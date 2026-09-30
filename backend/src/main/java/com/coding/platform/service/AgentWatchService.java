package com.coding.platform.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.coding.platform.dto.AgentEventDTO;
import com.coding.platform.entity.Problem;
import com.coding.platform.entity.SubmitRecord;
import com.coding.platform.entity.Tag;
import com.coding.platform.mapper.AgentStatsMapper;
import com.coding.platform.utils.StatsUtil;
import com.coding.platform.vo.AgentAnalysisVO;
import com.coding.platform.vo.AgentEventVO;
import com.coding.platform.vo.AgentPlanVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

/**
 * 算法哥的「观察层」：前端把操作事件报上来，这里决定他该不该开口、说什么。
 * <p>
 * 关键设计：
 * · 分工是「前端负责计时采样，后端负责该不该说 + 说什么」——停留多久、多久没敲键盘，
 *   这些只有前端知道，所以由前端判定后直接报事件；后端只管语气与节流。
 * · 快通道说一句话（模板，毫秒级），值得细讲的再让前端去调 /agent/event/follow 走大模型。
 * · <b>节流是这个功能的成败点</b>：不控频率，他三分钟就会变成弹窗广告。
 *   三级优先级 + 全局冷却 + 同类冷却 + 每日上限 + 「连着没人理就自动降频」。
 */
@Slf4j
@Service
public class AgentWatchService {

    // ---------------- 事件类型 ----------------

    public static final String OPEN_PROBLEM = "OPEN_PROBLEM";
    public static final String IDLE_LEAVE_PROBLEM = "IDLE_LEAVE_PROBLEM";
    public static final String BROWSE_TOO_LONG = "BROWSE_TOO_LONG";
    public static final String FIRST_LOGIN = "FIRST_LOGIN";
    public static final String START_CODING = "START_CODING";
    public static final String PASTE_CODE = "PASTE_CODE";
    public static final String NO_INPUT = "NO_INPUT";
    public static final String HEAVY_EDIT = "HEAVY_EDIT";
    public static final String CODE_TOO_LONG = "CODE_TOO_LONG";
    public static final String RUN = "RUN";
    public static final String SUBMIT_AC = "SUBMIT_AC";
    public static final String SUBMIT_WA = "SUBMIT_WA";
    public static final String SUBMIT_CE = "SUBMIT_CE";
    public static final String SUBMIT_TLE = "SUBMIT_TLE";
    public static final String SUBMIT_RE = "SUBMIT_RE";
    public static final String SUBMIT_OTHER = "SUBMIT_OTHER";
    public static final String WA_STREAK_3 = "WA_STREAK_3";
    public static final String CE_STREAK_2 = "CE_STREAK_2";
    public static final String AC_NEXT_QUICK = "AC_NEXT_QUICK";
    public static final String LONG_SESSION = "LONG_SESSION";
    public static final String NO_PRACTICE_TODAY = "NO_PRACTICE_TODAY";
    public static final String LATE_NIGHT = "LATE_NIGHT";
    public static final String STUCK_30MIN = "STUCK_30MIN";
    public static final String DAILY_NOT_DONE = "DAILY_NOT_DONE";
    public static final String PLAN_DAY_DONE = "PLAN_DAY_DONE";
    public static final String WEAK_TAG_AGAIN = "WEAK_TAG_AGAIN";
    public static final String RANK_UP = "RANK_UP";
    /** 不是事件，是「他把对话栏点开了」——用来重置忽略计数 */
    public static final String USER_OPENED_CHAT = "USER_OPENED_CHAT";

    @Autowired
    private ProblemService problemService;

    @Autowired
    private TagService tagService;

    @Autowired
    private SubmitRecordService submitRecordService;

    @Autowired
    private AgentStatsMapper statsMapper;

    @Autowired
    private AgentAnalysisService analysisService;

    @Autowired
    private AgentPlanService planService;

    /** 每个用户的节流状态。单机演示够用；真实部署应换成 Redis。 */
    private final Map<Long, WatchState> states = new ConcurrentHashMap<>();

    // ---------------- 对外入口 ----------------

    public AgentEventVO onEvent(Long userId, AgentEventDTO dto) {
        WatchState state = states.computeIfAbsent(userId, key -> new WatchState());
        state.rollDayIfNeeded();

        String type = dto.getType();
        if (USER_OPENED_CHAT.equals(type)) {
            state.spokeSinceOpened = 0;          // 有人理他，恢复正常频率
            return silent(type, "用户打开了对话栏");
        }

        Mode mode = Mode.of(dto.getMode());
        int priority = priorityOf(type);
        if (priority > mode.maxPriority) {
            return silent(type, "该事件在这个话痨档位下不说话");
        }

        long now = System.currentTimeMillis();
        // 冷却里把「还差多少秒」和「降频倍数」一并说清楚 —— 否则用户只能看到他沉默，
        // 没法区分是"没触发"还是"在冷却"，调参和演示时全靠猜。
        String penaltyNote = state.penalty > 1 ? "，降频 ×" + state.penalty : "";
        long globalGap = mode.globalGapMs * state.frequencyPenalty();
        if (now - state.lastSpeakAt < globalGap) {
            long remain = (globalGap - (now - state.lastSpeakAt)) / 1000;
            return silent(type, "全局冷却中（还差 " + remain + " 秒" + penaltyNote + "）");
        }
        Long lastSame = state.lastByType.get(type);
        long sameGap = mode.sameTypeGapMs * state.frequencyPenalty();
        if (lastSame != null && now - lastSame < sameGap) {
            long remain = (sameGap - (now - lastSame)) / 1000;
            return silent(type, "同类事件冷却中（还差 " + remain + " 秒" + penaltyNote + "）");
        }
        if (state.spokeToday >= mode.dailyLimit) {
            return silent(type, "今天主动开口次数已达上限（" + state.spokeToday + "/" + mode.dailyLimit + "）");
        }

        String text = compose(userId, state, dto);
        if (text == null) {
            return silent(type, "这次没有合适的话可说");
        }

        state.lastSpeakAt = now;
        state.lastByType.put(type, now);
        state.spokeToday++;
        // 连着说话但你一直没理他 → 自动降频，别再烦人。
        // ⚠️ 门槛别设太小：写代码时本来就不会去点气泡，「被无视」是常态而不是信号。
        // 5 次没人理才降一档，最多降到 1/3 频率（真实测过：3 次就降会让他在你专心写题时变得几乎不出声）。
        state.spokeSinceOpened++;
        if (state.spokeSinceOpened >= 5) {
            state.penalty = Math.min(3, state.penalty + 1);
            state.spokeSinceOpened = 0;
        }

        AgentEventVO vo = new AgentEventVO();
        vo.setSpeak(true);
        vo.setText(text);
        vo.setTone(toneOf(type));
        vo.setEventType(type);
        vo.setFollowUp(needLlmFollowUp(type));
        return vo;
    }

    /** 值得再走一次大模型细讲的事件 */
    private boolean needLlmFollowUp(String type) {
        return SUBMIT_AC.equals(type) || SUBMIT_WA.equals(type) || WA_STREAK_3.equals(type);
    }

    // ---------------- 台词 ----------------

    private String compose(Long userId, WatchState state, AgentEventDTO dto) {
        Long problemId = dto.getProblemId();
        Problem problem = problemId == null ? null : problemService.getById(problemId);
        String title = problem == null ? "这道题" : problem.getTitle();

        switch (dto.getType()) {
            case OPEN_PROBLEM: {
                if (problem == null) {
                    return null;
                }
                Map<String, Long> counts = problemStatusCounts(userId, problemId);
                long wa = counts.getOrDefault("WRONG_ANSWER", 0L);
                long ac = counts.getOrDefault("ACCEPTED", 0L);
                if (ac > 0) {
                    return pick("这题你已经过了。换个思路写，别用上次那版。",
                            "「" + title + "」你都 AC 过了，回来练手感？",
                            "又是这题。这次试试更优的复杂度。");
                }
                if (wa >= 2) {
                    return pick("「" + title + "」，你上次交了 " + wa + " 次全是 WA。先想清楚上次错在哪。",
                            "这题你栽过 " + wa + " 回了，别急着敲键盘。");
                }
                if (wa == 1) {
                    return pick("「" + title + "」上次没过。这次先写思路再写代码。",
                            "又是「" + title + "」。上次的坑还记得吧？");
                }
                return pick("新题「" + title + "」。先读题，别急着敲。",
                        "「" + title + "」第一次做，读两遍题再动手。");
            }
            case SUBMIT_AC: {
                SubmitRecord record = latestRecord(userId, problemId);
                String perf = record != null && record.getTimeUsed() != null
                        ? record.getTimeUsed() + " ms" : "跑通了";
                return pick("AC。" + perf + "，可以。",
                        "过了。「" + title + "」收进账本。",
                        "AC。这题算你的了，下一道。");
            }
            case SUBMIT_WA: {
                long wa = problemStatusCounts(userId, problemId).getOrDefault("WRONG_ANSWER", 0L);
                if (wa <= 1) {
                    return pick("WA。先别急着重交 —— 把刚才跳过的边界想一遍。",
                            "错了。多半是边界或者特判，别怪题目。",
                            "WA。你交之前手推过样例之外的输入吗？");
                }
                return pick("又 WA，这题第 " + wa + " 次了。",
                        "WA 第 " + wa + " 次。停一下，把错因写出来再改。");
            }
            case SUBMIT_CE: {
                return pick("CE。编译器在骂你，不是我。",
                        "编译都没过。先本地编译一次再交，省得白跑。",
                        "CE。「" + title + "」还没编译过就交上来了。");
            }
            case SUBMIT_TLE: {
                return pick("TLE。八成是复杂度选错了，不是机器慢。",
                        "超时。先算一下你的复杂度顶不顶得住这个数据规模。",
                        "TLE。换算法，或者把循环里的常数压下去。");
            }
            case SUBMIT_RE: {
                return pick("RE。先查下标越界和空值，别怪环境。",
                        "运行错误。数组边界、空指针、递归爆栈，按这个顺序排。");
            }
            case SUBMIT_OTHER: {
                return pick("这次结果不太好看，自己看一眼报错。");
            }
            case WA_STREAK_3: {
                return pick("同一道题第 3 次 WA。上次我说的，你看了吗？",
                        "三连 WA。「" + title + "」这个坑你是真不打算绕开了？",
                        "第 3 次了。不是手速问题，是你压根没读懂题。");
            }
            case CE_STREAK_2: {
                return pick("连续 CE。本地编译一下行不行，我心疼判题机。",
                        "又是 CE。花十秒在本地 javac 一下就省这一次了。");
            }
            case PASTE_CODE: {
                int n = dto.getValue() == null ? 0 : dto.getValue();
                return pick("粘贴了" + (n > 0 ? " " + n + " 个字符" : "一整段") + "？这题自己敲一遍。",
                        "复制的吧。手过一遍，印象才留得住。",
                        "粘完了改个变量名就想交？我看得见。");
            }
            case NO_INPUT: {
                return pick("卡了几分钟了。要我给个 L1 方向不要？",
                        "没动静。卡住了就说，别干坐着。",
                        "想不出来就直说，我又不会笑你。要提示吗？");
            }
            case HEAVY_EDIT: {
                int n = dto.getValue() == null ? 10 : dto.getValue();
                return pick("改了 " + n + " 次了。停一下，把思路先写在注释里。",
                        "来回改了 " + n + " 遍。你这是没思路在瞎试。");
            }
            case CODE_TOO_LONG: {
                int n = dto.getValue() == null ? 100 : dto.getValue();
                return pick(n + " 行了。这题用不着这么多。",
                        "写这么长，是不是一开始就没想清楚？");
            }
            case IDLE_LEAVE_PROBLEM: {
                return pick("字都没写就跑了？",
                        "「" + title + "」你一个字没写就走了。",
                        "走了？这题还空着呢。");
            }
            case BROWSE_TOO_LONG: {
                int n = dto.getValue() == null ? 5 : dto.getValue();
                return pick("挑了 " + n + " 分钟了。就挑最顺眼的那道吧，别选了。",
                        "选题挑这么久，是在躲难题吧。");
            }
            case LONG_SESSION: {
                int n = dto.getValue() == null ? 60 : dto.getValue();
                return pick("连刷 " + n + " 分钟了，起来走两步。",
                        "坐了 " + n + " 分钟了，眼睛不要了？");
            }
            case LATE_NIGHT: {
                int h = dto.getValue() == null ? LocalTime.now().getHour() : dto.getValue();
                return pick(h + " 点了。写完这题就睡。",
                        "这个点还在写代码，明天记得补觉。",
                        "夜里的代码明天的你看不懂，早点睡。");
            }
            case NO_PRACTICE_TODAY: {
                return pick("今天还一题没交。",
                        "今天一个字都没写。手会生的。",
                        "一天没动静了。挑道简单的热热身？");
            }
            case DAILY_NOT_DONE: {
                return pick("每日一题还没做。",
                        "今天的每日一题空着呢，先把它收了。");
            }
            case STUCK_30MIN: {
                return pick("这题卡半小时了。看题解，还是听我讲？",
                        "半小时了还没过。要不要先要个 L2？",
                        "卡太久了。别硬耗，问我要思路不丢人。");
            }
            case PLAN_DAY_DONE: {
                AgentPlanVO plan = planService.getLatestPlan(userId);
                if (plan == null) {
                    return null;
                }
                long done = doneCount(plan);
                int perDay = plan.getDailyCount() == null ? 0 : plan.getDailyCount();
                // 只有「刚好清掉一整天的量」才开口，否则每 AC 一题都报一次进度很烦
                if (done == 0 || perDay == 0 || done % perDay != 0) {
                    return null;
                }
                return pick("题单又清掉一天，累计 " + done + " 题，保持。",
                        "今天这份题单完成了，累计 " + done + " 题。",
                        "题单照做，累计 " + done + " 题，稳。");
            }
            case WEAK_TAG_AGAIN: {
                AgentAnalysisVO analysis = analysisService.analyze(userId);
                List<String> problemTags = tagService.getTagsByProblemId(problemId)
                        .stream().map(Tag::getName).collect(Collectors.toList());
                String hit = problemTags.stream()
                        .filter(analysis.getWeakTags()::contains).findFirst().orElse(null);
                if (hit == null) {
                    return null;
                }
                return pick("又是「" + hit + "」。我说过这块你虚。",
                        "「" + hit + "」——你的短板，又栽这儿了。",
                        "又是「" + hit + "」。这标签你该专门练一练。");
            }
            case RANK_UP: {
                long rank = StatsUtil.asLong(statsMapper.selectMyRank(userId));
                Long last = state.lastRank;
                state.lastRank = rank;
                if (last != null && rank < last) {
                    return "排名升到第 " + rank + " 了。继续。";
                }
                return null;
            }
            case FIRST_LOGIN: {
                Long today = statsMapper.selectTodaySubmitCount(userId);
                if (today != null && today > 0) {
                    return "来了。今天已经交了 " + today + " 次，接着来。";
                }
                return pick("来了。今天先从哪道开始？", "上线了。要我给你挑一道吗？");
            }
            case START_CODING: {
                return pick("开始敲了。我看着。", "手速不错，思路对吗？");
            }
            case RUN: {
                return pick("跑样例呢。样例过了不等于题过了。");
            }
            case AC_NEXT_QUICK: {
                return pick("连刷？质量优先。", "过一题就下一题，先想清楚刚才为什么能过。");
            }
            default:
                return null;
        }
    }

    // ---------------- 工具 ----------------

    private Map<String, Long> problemStatusCounts(Long userId, Long problemId) {
        if (problemId == null) {
            return java.util.Collections.emptyMap();
        }
        return statsMapper.selectProblemStatusStats(userId, problemId).stream()
                .collect(Collectors.toMap(
                        row -> String.valueOf(row.get("status")),
                        row -> StatsUtil.asLong(row.get("cnt")),
                        (left, right) -> left));
    }

    private SubmitRecord latestRecord(Long userId, Long problemId) {
        if (problemId == null) {
            return null;
        }
        return submitRecordService.getOne(new LambdaQueryWrapper<SubmitRecord>()
                .eq(SubmitRecord::getUserId, userId)
                .eq(SubmitRecord::getProblemId, problemId)
                .orderByDesc(SubmitRecord::getId)
                .last("LIMIT 1"));
    }

    private long doneCount(AgentPlanVO plan) {
        if (plan == null || plan.getDayList() == null) {
            return 0;
        }
        return plan.getDayList().stream()
                .filter(day -> day.getItems() != null)
                .flatMap(day -> day.getItems().stream())
                .filter(item -> Boolean.TRUE.equals(item.getDone()))
                .count();
    }

    private int priorityOf(String type) {
        switch (type) {
            case SUBMIT_AC:
            case SUBMIT_WA:
            case SUBMIT_CE:
            case SUBMIT_TLE:
            case SUBMIT_RE:
            case SUBMIT_OTHER:
            case WA_STREAK_3:
            case PASTE_CODE:
            case STUCK_30MIN:
            case PLAN_DAY_DONE:
                return 0;
            case CE_STREAK_2:
            case NO_INPUT:
            case HEAVY_EDIT:
            case IDLE_LEAVE_PROBLEM:
            case LONG_SESSION:
            case LATE_NIGHT:
            case NO_PRACTICE_TODAY:
            case DAILY_NOT_DONE:
            case WEAK_TAG_AGAIN:
            case RANK_UP:
            case OPEN_PROBLEM:
            case FIRST_LOGIN:
                return 1;
            default:
                return 2;
        }
    }

    private String toneOf(String type) {
        switch (type) {
            case SUBMIT_AC:
            case RANK_UP:
            case PLAN_DAY_DONE:
                return "praise";
            case WA_STREAK_3:
            case PASTE_CODE:
            case CE_STREAK_2:
            case HEAVY_EDIT:
            case CODE_TOO_LONG:
            case IDLE_LEAVE_PROBLEM:
            case BROWSE_TOO_LONG:
            case WEAK_TAG_AGAIN:
                return "tease";
            case SUBMIT_CE:
            case SUBMIT_TLE:
            case SUBMIT_RE:
            case SUBMIT_OTHER:
                return "warn";
            case NO_INPUT:
            case STUCK_30MIN:
                return "hint";
            default:
                return "remind";
        }
    }

    private String pick(String... options) {
        return options[ThreadLocalRandom.current().nextInt(options.length)];
    }

    private AgentEventVO silent(String type, String reason) {
        AgentEventVO vo = new AgentEventVO();
        vo.setSpeak(false);
        vo.setEventType(type);
        vo.setReason(reason);
        return vo;
    }

    // ---------------- 话痨档位 ----------------

    /**
     * 话痨档。四个参数：最高优先级 / 全局冷却(ms) / 同类冷却(ms) / 每日主动开口上限。
     * <p>
     * 冷却时长按「演示与测试友好」调过一轮：原来的 60/30/10 秒 + 同类 300/180/60 秒
     * 在实际使用时太长——同一个操作做过一次后，两三分钟内再做就完全没反应，
     * 用户会以为是坏了。现在整体收到约 1/3。
     */
    private enum Mode {
        /** 安静：只在判题这种关键节点开口 */
        QUIET(0, 20_000, 60_000, 30),
        /** 克制（默认）：判题 + 写代码行为 + 提醒 */
        NORMAL(1, 10_000, 45_000, 60),
        /** 活跃：连开始敲代码都要点评两句 */
        CHATTY(2, 5_000, 20_000, 200);

        private final int maxPriority;
        private final long globalGapMs;
        private final long sameTypeGapMs;
        private final int dailyLimit;

        Mode(int maxPriority, long globalGapMs, long sameTypeGapMs, int dailyLimit) {
            this.maxPriority = maxPriority;
            this.globalGapMs = globalGapMs;
            this.sameTypeGapMs = sameTypeGapMs;
            this.dailyLimit = dailyLimit;
        }

        static Mode of(String value) {
            if (value == null) {
                return NORMAL;
            }
            switch (value.toLowerCase()) {
                case "quiet":
                    return QUIET;
                case "chatty":
                    return CHATTY;
                default:
                    return NORMAL;
            }
        }
    }

    private static class WatchState {
        private long lastSpeakAt = 0L;
        private final Map<String, Long> lastByType = new ConcurrentHashMap<>();
        private LocalDate day = LocalDate.now();
        private int spokeToday = 0;
        private int spokeSinceOpened = 0;
        private int penalty = 1;
        private Long lastRank = null;

        void rollDayIfNeeded() {
            LocalDate today = LocalDate.now();
            if (!today.equals(day)) {
                day = today;
                spokeToday = 0;
                penalty = 1;
                spokeSinceOpened = 0;
                lastByType.clear();
            }
        }

        /** 没人理他 → 冷却越拉越长；有人打开对话栏就重置 */
        int frequencyPenalty() {
            return penalty;
        }
    }

}
