package com.coding.platform.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.coding.platform.dto.AgentChatDTO;
import com.coding.platform.dto.AgentPlanDTO;
import com.coding.platform.dto.AgentSolveDTO;
import com.coding.platform.entity.AgentHintLog;
import com.coding.platform.entity.AgentMemory;
import com.coding.platform.entity.AgentMessage;
import com.coding.platform.entity.AgentSession;
import com.coding.platform.entity.Note;
import com.coding.platform.entity.Problem;
import com.coding.platform.entity.ProblemSolution;
import com.coding.platform.entity.SubmitRecord;
import com.coding.platform.entity.Tag;
import com.coding.platform.entity.User;
import com.coding.platform.exception.BusinessException;
import com.coding.platform.mapper.AgentHintLogMapper;
import com.coding.platform.mapper.AgentMemoryMapper;
import com.coding.platform.mapper.AgentMessageMapper;
import com.coding.platform.mapper.AgentSessionMapper;
import com.coding.platform.mapper.AgentStatsMapper;
import com.coding.platform.mapper.ProblemSolutionMapper;
import com.coding.platform.service.AgentAnalysisService;
import com.coding.platform.service.AgentLlmClient;
import com.coding.platform.service.AgentPlanService;
import com.coding.platform.service.AgentService;
import com.coding.platform.service.AgentWatchService;
import com.coding.platform.service.AgentSearchClient;
import com.coding.platform.service.CollectService;
import com.coding.platform.service.NoteService;
import com.coding.platform.service.ProblemService;
import com.coding.platform.service.SubmitRecordService;
import com.coding.platform.service.TagService;
import com.coding.platform.service.UserService;
import com.coding.platform.utils.StatsUtil;
import com.coding.platform.vo.AgentAnalysisVO;
import com.coding.platform.vo.AgentChatVO;
import com.coding.platform.vo.AgentPlanVO;
import com.coding.platform.vo.AgentSolveVO;
import com.coding.platform.vo.ProblemSimilarVO;
import com.coding.platform.vo.WrongProblemVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * 算法哥本体。
 * <p>
 * 关键设计：判题不经过大模型。判题结果、学情数字、排名、题单全部是确定性的，
 * 大模型只做三件事——把判题结果讲成人话、把思路拆成台阶、把画像讲成结论。
 */
@Slf4j
@Service
public class AgentServiceImpl extends ServiceImpl<AgentSessionMapper, AgentSession> implements AgentService {

    // ------------------------------------------------------------------ 意图

    private static final String INTENT_HINT = "HINT";
    private static final String INTENT_JUDGE = "JUDGE_REPORT";
    private static final String INTENT_ANALYZE = "ANALYZE";
    private static final String INTENT_PLAN = "PLAN";
    private static final String INTENT_RANK = "RANK";
    private static final String INTENT_DAILY = "DAILY";
    private static final String INTENT_RECOMMEND = "RECOMMEND";
    private static final String INTENT_PROFILE = "PROFILE";
    private static final String INTENT_WRONG = "WRONG";
    private static final String INTENT_SIMILAR = "SIMILAR";
    private static final String INTENT_COLLECT = "COLLECT";
    private static final String INTENT_DISCUSS = "DISCUSSION";
    private static final String INTENT_CHAT = "CHAT";

    /** 人格与铁律：算法哥怎么说话，全在这里定死 */
    private static final String SYSTEM_PROMPT =
            "你是「算法哥」，像素校园里的第五个智能体，管竞赛刷题、在线判题、学情教练。\n\n"
            + "【你是什么人】\n"
            + "你是刷题量过万、打过比赛拿过牌的选手，现在带人。你说话像一个真正的高手：判断快、有主见、不绕弯，"
            + "一开口就让人有「这题他心里有数」的踏实感，但从不端着、不装。\n\n"
            + "【你怎么说话】\n"
            + "1) 先答他问的那件事。他问哪道题就讲哪道题；他那几笔提交、通过率、排名是你手里的底牌，"
            + "相关了再打出来，不相关就别每轮播报一遍——那是客服，不是学长。\n"
            + "2) 有判断、敢下结论：开口先给你的判断（「这题是区间 DP」「你这是边界没兜住」「属于没想清楚就动手」），"
            + "再补一两句理由。别把话说得四平八稳、什么都不敢定。\n"
            + "3) 说人话、用短句、带口语：「行」「别急」「这么写不行」「你先别敲，把状态定义想清楚」。\n"
            + "4) 行话能用，但别堆：AC / WA / TLE / RE / CE、卡常、边界、特判、套路、板子、水题、一眼题。"
            + "用得上就是「你这常数太大了」，用不上就别硬塞。\n"
            + "5) 不能出现的味道：客服腔（「已为您…」「感谢您的提问」）、公文腔（「综上所述」「建议如下」"
            + "「希望对你有帮助」）、系统播报腔（「动作：」「结论：」「下一步：」）。也别动不动列 1. 2. 3.，"
            + "一句话能说完就一句话，真需要分点才分。\n"
            + "6) 该损就损，损完给台阶；他真做对了也别吝啬夸，但要夸得具体（「常数压到 O(n) 了，可以」），"
            + "别来「你真棒」这种空夸。\n"
            + "7) 长短跟着事情走：闲聊三五句；讲题、给代码时该长就长。\n"
            + "两个例子——\n"
            + "他问「我今天提交了几次」：「今儿一次没交。昨天那 5 次全砸同一道题上，4 次连编译都没过。"
            + "先把报错第一行贴我。」\n"
            + "他问「这题为什么超时」：「你在两层循环里套了个哈希，数据上到 1e5 就是 O(n²)，机器再快也顶不住。"
            + "两条路：先排序再双指针，或者上单调栈把这层砍掉。想听哪个？」\n"
            + "而不是「今天（日期）：0 次提交。建议：请先解决编译错误。」\n\n"
            + "【你的边界】\n"
            + "只聊刷题、算法、数据结构、复杂度、判题。校园琐事（在哪吃饭、怎么走、课业考试）一句话让他去找对应的人，然后拉回正题。\n\n"
            + "【底线，必须守，但别把这些话念出来】\n"
            + "- 判题结果是编译器和测试用例给出的死结论，你只能解释它，不许改口径、不许猜、不许圆场；数据里没有的结论一个字都不许编。\n"
            + "- 分级提示不许跳：L1 只给方向，L2 给关键那一步，L3 给伪代码骨架，L4 才给完整代码。他没走到那一步，就别往下给。\n"
            + "- 只用「真实数据」里的数字，别编题号、通过率、排名。标签是平台打的、可能不准：讲题和给方向一律以题目描述和样例为准，"
            + "标签只当参考；标签跟题面明显对不上，就按题面讲，顺嘴提一句这题标签可能标错了。\n"
            + "- 每句结论都要落到他能做的下一件事上，但用正常话说出来，别写成「行动项」。\n"
            + "- 你不代写作业——目标是让他下次自己能写出来。但他要是明说「帮我写」「我不会，你写吧」，"
            + "就别推辞，把完整代码给他，附一句提醒他看懂了再交。\n"
            + "- 用 Markdown，代码用 ``` 围栏并标语言。";

    /** 他直接投降、让你代写时用的提示词：要的是能直接提交的完整代码，不是思路 */
    private static final String SOLVE_PROMPT =
            "你是「算法哥」，竞赛刷题教练。他现在直接投降了，让你替他写。\n"
            + "【任务】把这题的正确解法写成一份可以直接提交的完整代码。\n"
            + "硬性要求：\n"
            + "1. 必须是完整程序：自己读输入、自己输出。不能只给函数、不能给伪代码框架。\n"
            + "2. 必须用指定的语言写，严格按题目的输入输出格式来；拿不准就按样例推。\n"
            + "3. 逻辑必须正确，能过题目给的样例；记得处理边界（n=0、空输入、数组越界等）。\n"
            + "4. 输出格式：先写一句不超过 25 个字的话（你的口吻，可以吐槽他这么快就投降），"
            + "然后给一个 ``` 围栏代码块并标好语言。代码块之后再写任何内容。\n";

    /** 从大模型回复里抠出第一个围栏代码块 */
    private static final Pattern CODE_BLOCK =
            Pattern.compile("```[a-zA-Z0-9+#]*\\s*\\r?\\n(.*?)```", Pattern.DOTALL);

    /** 发讨论时抠正文用：成对的引号里那句 */
    private static final Pattern DISCUSS_QUOTE_PATTERN =
            Pattern.compile("[「『\"“]([^」』\"”]{2,})[」』\"”]");

    /** 发讨论时抠正文用：「讨论 / 评论 / 留言」后面跟着的那一截 */
    private static final Pattern DISCUSS_TAIL_PATTERN =
            Pattern.compile("(?:讨论|评论|留言|发帖|帖子)[，,。、:：\\s]*(\\S.{3,})");

    @Autowired
    private AgentMessageMapper messageMapper;

    @Autowired
    private AgentHintLogMapper hintLogMapper;

    @Autowired
    private AgentStatsMapper statsMapper;

    @Autowired
    private AgentLlmClient llmClient;

    /** 联网通道：没配 key 就是个空壳，search() 永远返回空 list */
    @Autowired
    private AgentSearchClient searchClient;

    @Autowired
    private AgentAnalysisService analysisService;

    @Autowired
    private AgentPlanService planService;

    @Autowired
    private ProblemService problemService;

    @Autowired
    private TagService tagService;

    @Autowired
    private UserService userService;

    /** 帮他收藏题目用的（collect 表，一账号一题一条） */
    @Autowired
    private CollectService collectService;

    /** 帮他发讨论用的（平台的「讨论」就是 note 表，一账号一题一条，是覆盖写） */
    @Autowired
    private NoteService noteService;

    @Autowired
    private SubmitRecordService submitRecordService;

    @Autowired
    private ProblemSolutionMapper problemSolutionMapper;

    @Autowired
    private AgentMemoryMapper memoryMapper;

    /** 归纳记忆是后台活儿：单线程慢慢做，绝不拖慢对话本身 */
    private final ExecutorService memoryExecutor = Executors.newSingleThreadExecutor(r -> {
        Thread t = new Thread(r, "agent-memory");
        t.setDaemon(true);
        return t;
    });

    /** 每聊这么多轮，就把这个账号的长期记忆重新归纳一次 */
    private static final int MEMORY_EVERY_TURNS = 4;

    // ------------------------------------------------------------------ 会话

    @Override
    public List<AgentSession> listSessions(Long userId) {
        return list(new LambdaQueryWrapper<AgentSession>()
                .eq(AgentSession::getUserId, userId)
                .orderByDesc(AgentSession::getUpdateTime)
                .orderByDesc(AgentSession::getId));
    }

    @Override
    public AgentSession createSession(Long userId, String title) {
        AgentSession session = new AgentSession();
        session.setUserId(userId);
        session.setTitle(StrUtil.isBlank(title) ? "新的对话" : StrUtil.maxLength(title.trim(), 30));
        session.setCreateTime(LocalDateTime.now());
        session.setUpdateTime(LocalDateTime.now());
        save(session);
        return session;
    }

    @Override
    public void deleteSession(Long userId, Long sessionId) {
        AgentSession session = getById(sessionId);
        if (session == null || !userId.equals(session.getUserId())) {
            throw new BusinessException("会话不存在");
        }
        removeById(sessionId);
        messageMapper.delete(new LambdaQueryWrapper<AgentMessage>().eq(AgentMessage::getSessionId, sessionId));
    }

    @Override
    public List<AgentMessage> listMessages(Long userId, Long sessionId) {
        AgentSession session = getById(sessionId);
        if (session == null || !userId.equals(session.getUserId())) {
            throw new BusinessException("会话不存在");
        }
        return messageMapper.selectList(new LambdaQueryWrapper<AgentMessage>()
                .eq(AgentMessage::getSessionId, sessionId)
                .orderByAsc(AgentMessage::getId));
    }

    // ------------------------------------------------------------------ 对话主流程

    @Override
    public AgentChatVO chat(Long userId, AgentChatDTO dto) {
        String content = dto.getContent().trim();
        AgentSession session = resolveSession(userId, dto.getSessionId(), content);

        AgentMessage userMessage = saveMessage(session.getId(), userId, "user", content, null);

        String intent = detectIntent(content, dto.getProblemId());
        Map<String, Object> payload = new LinkedHashMap<>();
        String reply;
        try {
            reply = dispatch(userId, session.getId(), userMessage.getId(), intent, dto, content, payload);
        } catch (Exception e) {
            log.error("算法哥处理失败", e);
            // 出错也要给一句话，否则这段对话就断了
            reply = e instanceof BusinessException
                    ? e.getMessage()
                    : "我这会儿有点卡壳（" + e.getMessage() + "），你再说一遍或者换个问法。";
        }

        AgentMessage assistantMessage = saveMessage(session.getId(), userId, "assistant", reply, intent);
        session.setUpdateTime(LocalDateTime.now());
        if ("新的对话".equals(session.getTitle())) {
            session.setTitle(StrUtil.maxLength(content, 30));
        }
        updateById(session);

        // 这轮聊完 → 后台过一遍记忆（攒够几轮才真的重新归纳，不打断对话）
        maybeRefreshMemory(userId, session.getId());

        AgentChatVO vo = new AgentChatVO();
        vo.setSessionId(session.getId());
        vo.setMessageId(assistantMessage.getId());
        vo.setReply(reply);
        vo.setIntent(intent);
        vo.setPayload(payload);
        return vo;
    }

    private String dispatch(Long userId, Long sessionId, Long userMessageId, String intent,
                            AgentChatDTO dto, String content, Map<String, Object> payload) {
        switch (intent) {
            case INTENT_HINT:
                return handleHint(userId, sessionId, userMessageId, dto, content, payload);
            case INTENT_JUDGE:
                return handleJudgeReport(userId, sessionId, userMessageId, dto, payload);
            case INTENT_ANALYZE:
                return handleAnalyze(userId, sessionId, userMessageId, payload);
            case INTENT_PLAN:
                return handlePlan(userId, sessionId, userMessageId, content, payload);
            case INTENT_RANK:
                return handleRank(userId, sessionId, userMessageId, payload);
            case INTENT_DAILY:
                return handlePick(userId, sessionId, userMessageId, content, payload, true);
            case INTENT_RECOMMEND:
                return handlePick(userId, sessionId, userMessageId, content, payload, false);
            case INTENT_PROFILE:
                return handleProfileUpdate(userId, sessionId, userMessageId, content, payload);
            case INTENT_WRONG:
                return handleWrongProblems(userId, sessionId, userMessageId, payload);
            case INTENT_SIMILAR:
                return handleSimilar(userId, sessionId, userMessageId, dto, content, payload);
            case INTENT_COLLECT:
                return handleCollect(userId, dto, content);
            case INTENT_DISCUSS:
                return handleDiscussion(userId, dto, content);
            default:
                return handleChat(userId, sessionId, userMessageId, content);
        }
    }

    // ------------------------------------------------------------------ 分级提示 L1~L4

    private String handleHint(Long userId, Long sessionId, Long userMessageId, AgentChatDTO dto,
                              String content, Map<String, Object> payload) {
        Long problemId = dto.getProblemId();
        if (problemId == null) {
            return "先说清楚是哪道题——在题目详情页点右上角「问算法哥」，"
                    + "或者在聊天页顶上把当前题目选上，我就按那道题给你台阶。";
        }
        Problem problem = problemService.getProblemDetail(problemId);
        if (problem == null) {
            return "没找到这道题，题号可能不对，换一道再试。";
        }

        int maxUsedLevel = currentMaxHintLevel(userId, problemId);
        int level = resolveHintLevel(dto.getLevel(), content, maxUsedLevel);
        boolean saidStuck = containsAny(content, "不会", "没思路", "看不懂", "完全不会", "想不出来");

        AgentHintLog hintLog = new AgentHintLog();
        hintLog.setUserId(userId);
        hintLog.setProblemId(problemId);
        hintLog.setLevel(level);
        hintLog.setCreateTime(LocalDateTime.now());

        payload.put("type", "hint");
        payload.put("problemId", problemId);
        payload.put("problemTitle", problem.getTitle());
        payload.put("level", level);

        // 真实数据放在 facts 里，任务与输出要求放在任务说明里：
        // 这样即使大模型没接上，降级输出给他的也是真实数据，而不是一句指令
        StringBuilder facts = new StringBuilder();
        facts.append(buildProblemFacts(problem));
        facts.append("\n## 这个人在这一题上的状态\n");
        facts.append("- 之前用过的最高提示档：L").append(maxUsedLevel == 0 ? "（还没用过）" : "L" + maxUsedLevel).append("\n");
        facts.append(buildProblemSubmitFacts(userId, problemId));

        StringBuilder task = new StringBuilder();
        task.append("【任务】分级提示 · 只给第 L").append(level).append(" 级\n");
        task.append("- 他这次").append(saidStuck
                ? "直说了「我不会/没思路」——请把关键一步讲透，回到 L2 的颗粒度，别越级给代码。"
                : "来要提示。").append("\n");
        task.append("\n【输出要求】\n");
        task.append("- 只输出 L").append(level).append(" 该有的东西，绝不能越级给后面的内容。\n");
        task.append("- L1：这题属于什么类型、该往哪个方向想，2~4 句，不给步骤不给代码。\n");
        task.append("- L2：讲清关键的那一步是什么、为什么这么想，可以举个小例子，但不给完整步骤清单、不给代码。\n");
        task.append("- L3：给伪代码骨架（含状态定义/不变量/转移），明确写一句「这是骨架，还不能直接交」，不写完整可运行代码。\n");
        task.append("- L4：给完整可提交代码（Java），分段说明关键点，并点出复杂度和容易踩的边界。\n");
        task.append("- 结尾用一句话告诉他「下一档能拿到什么」，让他自己决定要不要继续。\n");

        String reply = askLlm(userId, sessionId, userMessageId, task.toString(), facts.toString());
        // 讲出来了才记档：不能让一次失败的调用白白推高他的提示档位
        hintLogMapper.insert(hintLog);
        return reply;
    }

    private int resolveHintLevel(Integer requested, String content, int maxUsedLevel) {
        if (containsAny(content, "不会", "没思路", "看不懂", "完全不会", "想不出来")) {
            // 直说「我不会」→ 回到 L2，把关键步骤讲透
            return Math.max(2, Math.min(maxUsedLevel, 4));
        }
        if (requested != null) {
            return Math.max(1, Math.min(4, requested));
        }
        if (containsAny(content, "完整代码", "给我代码", "贴代码", "代码答案")) {
            return 4;
        }
        if (containsAny(content, "伪代码", "骨架")) {
            return 3;
        }
        if (containsAny(content, "方向", "往哪想", "是什么类型")) {
            return 1;
        }
        return Math.min(Math.max(maxUsedLevel + 1, 1), 4);
    }

    private int currentMaxHintLevel(Long userId, Long problemId) {
        List<Map<String, Object>> rows = statsMapper.selectHintStats(userId);
        for (Map<String, Object> row : rows) {
            if (StatsUtil.asLong(row.get("problemId")) == problemId) {
                return StatsUtil.asInt(row.get("maxLevel"));
            }
        }
        return 0;
    }

    // ------------------------------------------------------------------ 判题结果播报

    private String handleJudgeReport(Long userId, Long sessionId, Long userMessageId,
                                     AgentChatDTO dto, Map<String, Object> payload) {
        LambdaQueryWrapper<SubmitRecord> wrapper = new LambdaQueryWrapper<SubmitRecord>()
                .eq(SubmitRecord::getUserId, userId);
        if (dto.getProblemId() != null) {
            wrapper.eq(SubmitRecord::getProblemId, dto.getProblemId());
        }
        wrapper.orderByDesc(SubmitRecord::getId).last("LIMIT 1");
        SubmitRecord record = submitRecordService.getOne(wrapper);
        if (record == null) {
            return "你还没提交过" + (dto.getProblemId() != null ? "这道题" : "任何代码") + "，先写点东西交上来，我才好说你错在哪。";
        }

        Problem problem = problemService.getById(record.getProblemId());
        String status = record.getStatus();

        payload.put("type", "judge");
        payload.put("problemId", record.getProblemId());
        payload.put("status", status);
        payload.put("recordId", record.getId());

        StringBuilder facts = new StringBuilder();
        facts.append("## 判题结果（确定性结论，不可改动）\n");
        facts.append("- 题目：").append(problem != null ? "#" + problem.getId() + " " + problem.getTitle() : "#" + record.getProblemId()).append("\n");
        facts.append("- 状态：").append(AgentAnalysisService.friendlyStatus(status)).append("\n");
        facts.append("- 用时：").append(record.getTimeUsed() == null ? "未记录" : record.getTimeUsed() + " ms")
                .append("，内存：").append(record.getMemoryUsed() == null ? "未记录" : record.getMemoryUsed() + " KB").append("\n");
        if (problem != null) {
            facts.append("- 题目限制：时间 ").append(problem.getTimeLimit()).append(" ms，内存 ")
                    .append(problem.getMemoryLimit()).append(" MB\n");
        }
        if (StrUtil.isNotBlank(record.getErrorMessage())) {
            facts.append("- 报错信息：\n```\n").append(StrUtil.maxLength(record.getErrorMessage(), 1500)).append("\n```\n");
        }
        if (record.getExpectedOutput() != null) {
            facts.append("- 期望输出：\n```\n").append(StrUtil.maxLength(record.getExpectedOutput(), 500)).append("\n```\n");
        }
        if (record.getOutput() != null) {
            facts.append("- 实际输出：\n```\n").append(StrUtil.maxLength(record.getOutput(), 500)).append("\n```\n");
        }
        facts.append("- 同行坐标：").append(buildPeerFacts(record)).append("\n");
        facts.append("- 我的提交代码：\n```java\n").append(StrUtil.maxLength(record.getCode(), 4000)).append("\n```\n");

        StringBuilder task = new StringBuilder();
        task.append("【任务】把这个判题结果讲给我听\n\n");
        task.append("【输出要求】\n");
        task.append("- 第一句话直接说清结果，别绕。\n");
        task.append("- WA → 指出最可能错在哪一类（边界没考虑 / 特例没判 / 输出格式 / 题意理解偏），并给一个你自己构造、他能自己跑的反例输入；\n");
        task.append("- TLE → 做复杂度分析：是复杂度选错了还是常数太大，数据规模撑不撑得住，给可行的优化方向；\n");
        task.append("- RE → 说清典型原因（下标越界 / 空指针 / 递归爆栈 / 除零），结合他的代码指位置；\n");
        task.append("- CE → 把编译器的话翻译成人话，按行指出问题；\n");
        task.append("- SECURITY_ERROR → 平台的代码安全检查把这次提交拦下了（具体原因写在报错信息里，例如死循环结构），按报错信息说明拦的是什么、改成什么写法才合规；\n");
        task.append("- AC → 点评性能处在什么位置，再点一句有没有更优解法（时间或空间）。\n");
        task.append("- 结尾给一个明确动作：改哪里、试什么、接下来做哪类题。\n");
        return askLlm(userId, sessionId, userMessageId, task.toString(), facts.toString());
    }

    // ------------------------------------------------------------------ 观察层的慢通道

    @Override
    public String commentEvent(Long userId, String type, Long problemId) {
        // 没接大模型就返回 null，前端保留快通道那句模板台词，气泡不会变成一坨原始数据
        if (!llmClient.available()) {
            return null;
        }

        LambdaQueryWrapper<SubmitRecord> wrapper = new LambdaQueryWrapper<SubmitRecord>()
                .eq(SubmitRecord::getUserId, userId);
        if (problemId != null) {
            wrapper.eq(SubmitRecord::getProblemId, problemId);
        }
        wrapper.orderByDesc(SubmitRecord::getId).last("LIMIT 1");
        SubmitRecord record = submitRecordService.getOne(wrapper);

        Problem problem = record == null ? null : problemService.getById(record.getProblemId());

        StringBuilder task = new StringBuilder();
        if (AgentWatchService.SUBMIT_AC.equals(type)) {
            task.append("【任务】他刚 AC 了一道题，用**一句话**点评。\n")
                    .append("说清两件事：性能处在什么位置（借助同行数据），有没有更优的方向。\n");
        } else if (AgentWatchService.WA_STREAK_3.equals(type)) {
            task.append("【任务】同一道题他连续 WA 了三次，用**一句话**扎心地点出问题在哪。\n")
                    .append("不许骂人，但要让他记住；不要给答案，不要贴代码。\n");
        } else {
            task.append("【任务】他刚 WA 了，用**一句话**指出最可能错在哪一类")
                    .append("（边界没考虑 / 特例没判 / 输出格式 / 题意理解偏）。不要给答案，不要贴代码。\n");
        }
        task.append("【硬性要求】只输出那一句话，60 字以内；不要 Markdown、不要换行、不要前缀、不要引号。\n");

        StringBuilder facts = new StringBuilder();
        facts.append("## 真实数据（只许引用这里的数字）\n");
        if (problem != null) {
            StringBuilder tags = new StringBuilder();
            if (problem.getTags() != null && !problem.getTags().isEmpty()) {
                tags.append(problem.getTags().stream().map(Tag::getName).collect(Collectors.joining("、")));
            }
            facts.append("- 题目：").append(problem.getTitle())
                    .append("（").append(difficultyCn(problem.getDifficulty())).append("）")
                    .append(tags.length() > 0 ? "，标签：" + tags : "").append("\n");
        }
        if (record != null) {
            facts.append("- 本次判题：").append(AgentAnalysisService.friendlyStatus(record.getStatus()))
                    .append("，用时 ").append(record.getTimeUsed() == null ? "未记录" : record.getTimeUsed() + " ms")
                    .append("，内存 ").append(record.getMemoryUsed() == null ? "未记录" : record.getMemoryUsed() + " KB").append("\n");
            if (StrUtil.isNotBlank(record.getErrorMessage())) {
                facts.append("- 报错：").append(StrUtil.maxLength(record.getErrorMessage(), 300)).append("\n");
            }
            facts.append("- 同行坐标：").append(buildPeerFacts(record)).append("\n");
            facts.append("- TA 的代码（供你判断，不要贴出来）：\n```java\n")
                    .append(StrUtil.maxLength(record.getCode(), 2500)).append("\n```\n");
        }
        facts.append("- 我这道题的历史提交分布：");
        if (problemId != null) {
            for (Map<String, Object> row : statsMapper.selectProblemStatusStats(userId, problemId)) {
                facts.append(AgentAnalysisService.friendlyStatus(String.valueOf(row.get("status")))
                        .split(" ")[0]).append(" ").append(StatsUtil.asLong(row.get("cnt"))).append(" 次；");
            }
        }
        facts.append("\n");

        return askLlm(userId, null, null, task.toString(), facts.toString());
    }

    private String buildPeerFacts(SubmitRecord record) {
        StringBuilder sb = new StringBuilder();
        Map<String, Object> peer = statsMapper.selectProblemPeerStats(record.getProblemId());
        if (peer != null) {
            sb.append("这道题共 ").append(StatsUtil.asLong(peer.get("attempters"))).append(" 人试过、")
                    .append(StatsUtil.asLong(peer.get("solvers"))).append(" 人通过。");
        }
        if ("ACCEPTED".equals(record.getStatus()) && record.getTimeUsed() != null) {
            Map<String, Object> perf = statsMapper.selectProblemPerformance(record.getProblemId(), record.getTimeUsed());
            long total = perf == null ? 0 : StatsUtil.asLong(perf.get("total"));
            if (total <= 0) {
                sb.append("你是这道题第一个通过的。");
            } else {
                long slower = StatsUtil.asLong(perf.get("slower"));
                sb.append("在本题的 ").append(total).append(" 次通过提交里，你的用时击败了 ")
                        .append(StatsUtil.rate(slower, total)).append("% 的提交。");
            }
        }
        return sb.toString();
    }

    // ------------------------------------------------------------------ 学情诊断

    @Override
    public AgentAnalysisVO analyze(Long userId) {
        AgentAnalysisVO analysis = analysisService.analyze(userId);
        String facts = analysisService.buildFacts(analysis);

        StringBuilder user = new StringBuilder();
        user.append("【任务】给我做一次学情诊断\n\n");
        user.append("内容要覆盖这些（顺序你自己安排，用你的话讲）：\n");
        user.append("- 哪类题稳、哪类题虚，点名标签；\n");
        user.append("- 能力边界卡在哪一档难度；\n");
        user.append("- WA / TLE / RE / CE 各是什么性质的问题（边界没兜住 / 复杂度选错 / 基本功 / 没读懂题就动手），并给处方；\n");
        user.append("- 是在进步还是在原地打转，给出依据；\n");
        user.append("- 刷得多还是刷得巧；\n");
        user.append("- 这个排名和通过率说明什么；\n");
        user.append("- 最后落到三条具体处方，每条写清做哪类题、几道、什么时候做。\n");
        user.append("写法要求：写成一篇连着的话，像跟人当面分析，"
                + "不要「1) 标签画像」这种小标题、不要「动作：」，该分点就用短句自然分，"
                + "表格只在真能一句话说清时才用。只给结论，不要复述数据表。不要写「继续加油」这种空话。\n");

        analysis.setConclusion(askLlm(userId, null, null, user.toString(), facts));
        return analysis;
    }

    private String handleAnalyze(Long userId, Long sessionId, Long userMessageId, Map<String, Object> payload) {
        AgentAnalysisVO analysis = analyze(userId);
        payload.put("type", "analysis");
        payload.put("analysis", analysis);
        return analysis.getConclusion();
    }

    // ------------------------------------------------------------------ 题单

    @Override
    public AgentPlanVO createPlan(Long userId, AgentPlanDTO dto) {
        return planService.buildPlan(userId, dto);
    }

    @Override
    public AgentPlanVO latestPlan(Long userId) {
        return planService.getLatestPlan(userId);
    }

    @Override
    public void markPlanItem(Long userId, Long itemId, Boolean done) {
        planService.markItemDone(userId, itemId, done != null && done);
    }

    private String handlePlan(Long userId, Long sessionId, Long userMessageId, String content,
                              Map<String, Object> payload) {
        AgentPlanDTO dto = parsePlanRequest(content);
        AgentPlanVO plan = planService.buildPlan(userId, dto);

        payload.put("type", "plan");
        payload.put("plan", plan);

        StringBuilder facts = new StringBuilder();
        facts.append("## 排法（确定性算法算出来的，不要改）\n");
        facts.append("- 目标：").append(plan.getGoal()).append("，").append(plan.getDays())
                .append(" 天 × 每天 ").append(plan.getDailyCount()).append(" 题\n");
        facts.append("- 选题目径：薄弱标签加权 + 排除我已经通过的题 + 难度不跳档（天与天之间难度最多升一档）\n");
        facts.append("- 摘要：").append(plan.getSummary()).append("\n\n");
        facts.append(buildPlanFacts(plan));

        StringBuilder task = new StringBuilder();
        task.append("【任务】我按你的画像排了一份题单，把它讲给我听\n\n");
        task.append("【输出要求】\n");
        task.append("- 用 3~5 句话讲清：为什么这么排、前一半和后一半分别在练什么、最容易放弃的是哪一天。\n");
        task.append("- 不要重复罗列题目清单（界面上已经列出了），不要输出表格。\n");
        task.append("- 最后给一句能立刻开始的动作。\n");
        return askLlm(userId, sessionId, userMessageId, task.toString(), facts.toString());
    }

    private String buildPlanFacts(AgentPlanVO plan) {
        StringBuilder sb = new StringBuilder();
        sb.append("## 题单内容\n");
        if (plan.getDayList() == null) {
            return sb.toString();
        }
        for (AgentPlanVO.DayVO day : plan.getDayList()) {
            sb.append("- 第 ").append(day.getDayIndex()).append(" 天（").append(day.getFocus()).append("）：");
            for (AgentPlanVO.ItemVO item : day.getItems()) {
                sb.append("#").append(item.getProblemId()).append(" ").append(item.getTitle())
                        .append("[").append(difficultyCn(item.getDifficulty())).append("]；");
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    private AgentPlanDTO parsePlanRequest(String content) {
        AgentPlanDTO dto = new AgentPlanDTO();
        dto.setGoal("补短板");
        if (containsAny(content, "面试")) {
            dto.setGoal("面试");
        } else if (containsAny(content, "比赛", "竞赛", "备赛", "赛前")) {
            dto.setGoal("备赛");
        } else if (containsAny(content, "手感", "保持状态", "随便刷")) {
            dto.setGoal("保持手感");
        }

        Matcher days = Pattern.compile("(\\d{1,2})\\s*天").matcher(content);
        if (days.find()) {
            dto.setDays(Integer.parseInt(days.group(1)));
        }
        Matcher perDay = Pattern.compile("每天\\s*(\\d{1,2})\\s*题").matcher(content);
        if (perDay.find()) {
            dto.setDailyCount(Integer.parseInt(perDay.group(1)));
        }
        return dto;
    }

    // ------------------------------------------------------------------ 排名播报

    @Override
    public AgentChatVO rank(Long userId) {
        return buildRankReply(userId, null, null);
    }

    private String handleRank(Long userId, Long sessionId, Long userMessageId, Map<String, Object> payload) {
        AgentChatVO cached = buildRankReply(userId, sessionId, userMessageId);
        payload.putAll(cached.getPayload());
        return cached.getReply();
    }

    private AgentChatVO buildRankReply(Long userId, Long sessionId, Long userMessageId) {
        AgentAnalysisVO analysis = analysisService.analyze(userId);
        List<Map<String, Object>> top = statsMapper.selectTopUsers(10);
        long myAccepted = StatsUtil.asLong(statsMapper.selectMyAccepted(userId));
        Long nextAhead = statsMapper.selectNextAheadAccepted(userId);

        List<Map<String, Object>> tagRanks = new ArrayList<>();
        for (String tagName : analysis.getWeakTags()) {
            Tag tag = tagService.getOne(new LambdaQueryWrapper<Tag>()
                    .eq(Tag::getName, tagName).last("LIMIT 1"));
            if (tag == null) {
                continue;
            }
            List<Map<String, Object>> rows = statsMapper.selectTagRanking(tag.getId(), 500);
            int myRank = 0;
            long mySolvedInTag = 0;
            for (int i = 0; i < rows.size(); i++) {
                if (StatsUtil.asLong(rows.get(i).get("userId")) == userId) {
                    myRank = i + 1;
                    mySolvedInTag = StatsUtil.asLong(rows.get(i).get("solved"));
                    break;
                }
            }
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("tag", tagName);
            item.put("rank", myRank);
            item.put("total", rows.size());
            item.put("solved", mySolvedInTag);
            tagRanks.add(item);
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("type", "rank");
        payload.put("rank", analysis.getRank());
        payload.put("totalUsers", analysis.getTotalUsers());
        payload.put("accepted", myAccepted);
        payload.put("solvedDistinct", analysis.getSolvedCount());
        payload.put("top", top);
        payload.put("tagRanks", tagRanks);

        StringBuilder facts = new StringBuilder();
        facts.append("## 榜单口径（两个数不是一个东西，说的时候必须点明，别混用）\n");
        facts.append("- 平台榜单按「累计 AC 次数」排名，这是我的榜单词数：").append(myAccepted).append(" 次\n");
        facts.append("- 去重后我通过的不同题目数：").append(analysis.getSolvedCount()).append(" 道\n");
        facts.append("- 我的名次：第 ").append(analysis.getRank()).append(" / 共 ")
                .append(analysis.getTotalUsers()).append(" 人（按累计 AC 次数）\n");
        if (nextAhead != null) {
            facts.append("- 离上一名差 ").append(nextAhead - myAccepted).append(" 次 AC\n");
        } else {
            facts.append("- 我已经是榜首了\n");
        }
        facts.append("- 榜上前十（括号内是累计 AC 次数）：");
        for (Map<String, Object> row : top) {
            facts.append(row.get("nickname") != null && StrUtil.isNotBlank(String.valueOf(row.get("nickname")))
                            ? row.get("nickname") : row.get("username"))
                    .append("(").append(StatsUtil.asLong(row.get("acceptedProblems"))).append("次) ");
        }
        facts.append("\n\n## 分标签排名（只列我的薄弱标签）\n");
        for (Map<String, Object> item : tagRanks) {
            facts.append("- 「").append(item.get("tag")).append("」：");
            if (StatsUtil.asInt(item.get("rank")) > 0) {
                facts.append("第 ").append(item.get("rank")).append(" / 共 ").append(item.get("total"))
                        .append(" 人，过了 ").append(item.get("solved")).append(" 题\n");
            } else {
                facts.append("还没在这个标签上拿到 AC\n");
            }
        }

        StringBuilder task = new StringBuilder();
        task.append("【任务】播报我的排名\n\n");
        task.append("【输出要求】\n");
        task.append("- 说清我现在的名次、离上一名差多少、哪个分标签榜最拖后腿。\n");
        task.append("- 「榜单词数」和「去重通过的题数」是两个口径，引用时要标明是哪一个（比如「榜单上累计 AC 32 次、去重过 5 道题」）。\n");
        task.append("- 分标签比总排名更有指导意义，请点名最能提分的那一个标签。\n");
        task.append("- 结尾给一个动作：想升上去，这几天该刷哪类题、几道。\n");
        task.append("- 写法：连着说，像当面跟我讲，别用小标题、别写「动作：」。\n");
        task.append("- 榜单只展示学习数据（题数/通过率/排名），不要提任何人的对话内容或位置。\n");

        AgentChatVO vo = new AgentChatVO();
        vo.setPayload(payload);
        vo.setReply(askLlm(userId, sessionId, userMessageId, task.toString(), facts.toString()));
        return vo;
    }

    // ------------------------------------------------------------------ 每日一题 / 推荐一道

    @Override
    public AgentChatVO daily(Long userId) {
        Map<String, Object> payload = new LinkedHashMap<>();
        String reply = handlePick(userId, null, null, "每日一题", payload, true);
        AgentChatVO vo = new AgentChatVO();
        vo.setReply(reply);
        vo.setIntent(INTENT_DAILY);
        vo.setPayload(payload);
        return vo;
    }

    private String handlePick(Long userId, Long sessionId, Long userMessageId, String content,
                              Map<String, Object> payload, boolean daily) {
        AgentAnalysisVO analysis = analysisService.analyze(userId);
        Problem problem = pickProblem(userId, analysis.getWeakTags(),
                daily ? LocalDate.now().toEpochDay() : System.currentTimeMillis() / 86400000L);
        if (problem == null) {
            return "题库里没有你没做过的题了。要我按你的画像重新排一份题单吗？";
        }

        List<String> tagNames = tagService.getTagsByProblemId(problem.getId())
                .stream().map(Tag::getName).collect(Collectors.toList());

        payload.put("type", "problem");
        payload.put("problemId", problem.getId());
        payload.put("title", problem.getTitle());
        payload.put("difficulty", problem.getDifficulty());
        payload.put("tags", tagNames);
        payload.put("daily", daily);

        String hitTag = tagNames.stream().filter(analysis.getWeakTags()::contains).findFirst().orElse(null);

        StringBuilder facts = new StringBuilder();
        facts.append("## 我选的题（已经定了，不要换）\n");
        facts.append("- #").append(problem.getId()).append(" ").append(problem.getTitle())
                .append("（").append(difficultyCn(problem.getDifficulty())).append("）\n");
        facts.append("- 标签：").append(tagNames.isEmpty() ? "无" : String.join("、", tagNames)).append("\n");
        facts.append("- 选它的原因：").append(hitTag != null ? "命中我的薄弱标签「" + hitTag + "」" : "补覆盖面的空缺")
                .append("，且我还没通过过\n");
        facts.append("\n## 我的画像\n");
        facts.append("- 做过 ").append(analysis.getAttemptedCount()).append(" 题，过了 ").append(analysis.getSolvedCount())
                .append(" 题；薄弱标签：").append(analysis.getWeakTags().isEmpty() ? "暂无明显短板" : String.join("、", analysis.getWeakTags())).append("\n");

        StringBuilder task = new StringBuilder();
        task.append("【任务】").append(daily ? "给我今天的每日一题" : "推荐我一道题").append("\n\n");
        task.append("【输出要求】\n");
        task.append("- 用 2~3 句说清为什么给我这道题、它练的是哪个能力。\n");
        task.append("- 给一句方向（往哪个类型想），但不要给解法、不要给代码——我还没做。\n");
        task.append("- 最后告诉我：做不出来可以找你要 L1 提示。\n");
        return askLlm(userId, sessionId, userMessageId, task.toString(), facts.toString());
    }

    private Problem pickProblem(Long userId, List<String> weakTags, long seed) {
        Set<Long> solved = submitRecordService.list(new LambdaQueryWrapper<SubmitRecord>()
                        .eq(SubmitRecord::getUserId, userId)
                        .eq(SubmitRecord::getStatus, "ACCEPTED"))
                .stream().map(SubmitRecord::getProblemId).collect(Collectors.toSet());
        Set<Long> attempted = new HashSet<>(submitRecordService.list(new LambdaQueryWrapper<SubmitRecord>()
                        .eq(SubmitRecord::getUserId, userId))
                .stream().map(SubmitRecord::getProblemId).collect(Collectors.toSet()));

        List<Problem> candidates = problemService.list(new LambdaQueryWrapper<Problem>()
                        .eq(Problem::getStatus, 1)
                        .orderByAsc(Problem::getId))
                .stream()
                .filter(problem -> !solved.contains(problem.getId()))
                .collect(Collectors.toList());
        if (candidates.isEmpty()) {
            return null;
        }

        List<Problem> preferred = new ArrayList<>();
        for (Problem problem : candidates) {
            boolean weakHit = tagService.getTagsByProblemId(problem.getId())
                    .stream().anyMatch(tag -> weakTags.contains(tag.getName()));
            if (weakHit || attempted.contains(problem.getId())) {
                preferred.add(problem);
            }
        }
        List<Problem> pool = preferred.isEmpty() ? candidates : preferred;
        return pool.get((int) Math.floorMod(seed, pool.size()));
    }

    // ------------------------------------------------------------------ 普通问答

    private String handleChat(Long userId, Long sessionId, Long userMessageId, String content) {
        return askLlm(userId, sessionId, userMessageId, content, buildUserSnapshot(userId));
    }

    private String buildUserSnapshot(Long userId) {
        AgentAnalysisVO analysis = analysisService.analyze(userId);
        User user = userService.getById(userId);
        StringBuilder sb = new StringBuilder();
        sb.append("## 这个人当前的刷题状态（真实数据）\n");
        sb.append("> 这些是背景资料：他问什么就先答什么，只挑跟这个问题相关的数字用，别整段复述。\n");
        sb.append("- 昵称：").append(user != null && StrUtil.isNotBlank(user.getNickname())
                ? user.getNickname() : (user != null ? user.getUsername() : "这位同学")).append("\n");
        if (user != null) {
            StringBuilder profile = new StringBuilder("- 资料：性别 ")
                    .append(StrUtil.isBlank(user.getGender()) ? "未设置" : user.getGender())
                    .append("，位置 ").append(StrUtil.isBlank(user.getIpAddress()) ? "未设置" : user.getIpAddress())
                    .append("，加入时间 ").append(user.getCreateTime() == null ? "未设置" : user.getCreateTime().toLocalDate());
            if (StrUtil.isNotBlank(user.getBio())) {
                profile.append("，简介「").append(user.getBio()).append("」");
            }
            sb.append(profile).append("\n");
        }
        sb.append("- 做过 ").append(analysis.getAttemptedCount()).append(" 题，过 ").append(analysis.getSolvedCount())
                .append(" 题，提交通过率 ").append(analysis.getAcceptRate()).append("%\n");
        sb.append("- 全局排名 第 ").append(analysis.getRank()).append(" / 共 ").append(analysis.getTotalUsers()).append(" 人\n");
        sb.append("- 薄弱标签：").append(analysis.getWeakTags().isEmpty() ? "暂无明显短板" : String.join("、", analysis.getWeakTags())).append("\n");

        // 今天这一块必须给出具体时间点 —— 用户经常问「我今天几点交的」
        Map<String, Object> today = analysis.getTodaySummary();
        long todayTotal = today == null ? 0 : StatsUtil.asLong(today.get("total"));
        sb.append("- 今天（").append(LocalDate.now()).append("）：");
        if (todayTotal == 0) {
            sb.append("还没有提交过\n");
        } else {
            sb.append("提交 ").append(todayTotal).append(" 次，AC ")
                    .append(StatsUtil.asLong(today.get("accepted"))).append(" 次（最早 ")
                    .append(today.get("firstAt")).append("，最近 ").append(today.get("lastAt")).append("）\n");
            if (analysis.getTodayRecords() != null && !analysis.getTodayRecords().isEmpty()) {
                sb.append("  今天每一次提交：");
                for (Map<String, Object> row : analysis.getTodayRecords()) {
                    sb.append(row.get("time")).append(" ").append(row.get("title"))
                            .append("[").append(AgentAnalysisService.friendlyStatus(String.valueOf(row.get("status")))).append("] ");
                }
                sb.append("\n");
            }
        }

        sb.append("- 最近 5 次提交（带时间）：\n");
        List<SubmitRecord> recent = submitRecordService.list(new LambdaQueryWrapper<SubmitRecord>()
                .eq(SubmitRecord::getUserId, userId)
                .orderByDesc(SubmitRecord::getId)
                .last("LIMIT 5"));
        for (SubmitRecord record : recent) {
            Problem problem = problemService.getById(record.getProblemId());
            LocalDateTime at = record.getCreateTime();
            String when = at == null ? "时间未知"
                    : String.format("%02d-%02d %02d:%02d", at.getMonthValue(), at.getDayOfMonth(), at.getHour(), at.getMinute());
            sb.append("  - ").append(when).append(" ")
                    .append(problem != null ? problem.getTitle() : "题目" + record.getProblemId())
                    .append(" → ").append(AgentAnalysisService.friendlyStatus(record.getStatus())).append("\n");
        }
        return sb.toString();
    }

    // ------------------------------------------------------------------ 大模型调用

    /**
     * @param userContent 这一轮的诉求（含任务与输出要求）
     * @param facts       真实数据块
     */
    private String askLlm(Long userId, Long sessionId, Long beforeMessageId, String userContent, String facts) {
        if (!llmClient.available()) {
            return "> ⚠️ 算法哥的大模型还没接上：在 `backend/src/main/resources/application.yml` 里把 `agent.llm.api-key` 填上就能开口了。\n"
                    + "> 下面是我手上**真实的原始数据**，你先看着：\n\n" + facts;
        }

        List<Map<String, String>> messages = new ArrayList<>();
        if (sessionId != null && beforeMessageId != null) {
            List<AgentMessage> history = messageMapper.selectList(new LambdaQueryWrapper<AgentMessage>()
                    .eq(AgentMessage::getSessionId, sessionId)
                    .lt(AgentMessage::getId, beforeMessageId)
                    .orderByDesc(AgentMessage::getId)
                    .last("LIMIT 8"));
            Collections.reverse(history);
            for (AgentMessage message : history) {
                Map<String, String> item = new HashMap<>();
                item.put("role", message.getRole());
                item.put("content", StrUtil.maxLength(StrUtil.nullToEmpty(message.getContent()), 2000));
                messages.add(item);
            }
        }

        Map<String, String> current = new HashMap<>();
        current.put("role", "user");
        current.put("content", userContent + memoryFacts(userId)
                + "\n\n【真实数据 · 只许引用这里的数字，不许编造】\n" + facts);
        messages.add(current);

        return llmClient.chat(SYSTEM_PROMPT, messages);
    }

    // ------------------------------------------------------------------ 账号记忆

    @Override
    public String getMemory(Long userId) {
        AgentMemory memory = loadMemory(userId);
        return memory == null ? "" : StrUtil.nullToEmpty(memory.getContent());
    }

    @Override
    public void clearMemory(Long userId) {
        memoryMapper.delete(new LambdaQueryWrapper<AgentMemory>().eq(AgentMemory::getUserId, userId));
    }

    private AgentMemory loadMemory(Long userId) {
        if (userId == null) {
            return null;
        }
        return memoryMapper.selectOne(new LambdaQueryWrapper<AgentMemory>()
                .eq(AgentMemory::getUserId, userId)
                .last("LIMIT 1"));
    }

    /** 把记忆拼进事实块，让大模型每轮都能看到「他之前记住的你」 */
    private String memoryFacts(Long userId) {
        String memory = getMemory(userId);
        if (StrUtil.isBlank(memory)) {
            return "";
        }
        return "\n\n【你对这位同学的长期记忆 · 你自己以前记下的】\n"
                + "> 这是你和他之前的交流里沉淀下来的，回答时自然用上就行，别生硬复述。\n"
                + StrUtil.maxLength(memory, 1200);
    }

    /** 攒够 MEMORY_EVERY_TURNS 轮，就丢给后台线程重新归纳一次 */
    private void maybeRefreshMemory(Long userId, Long sessionId) {
        if (userId == null || sessionId == null) {
            return;
        }
        try {
            AgentMemory memory = loadMemory(userId);
            int turns;
            if (memory == null) {
                memory = new AgentMemory();
                memory.setUserId(userId);
                memory.setContent("");
                memory.setTurnCount(1);
                memory.setCreateTime(LocalDateTime.now());
                memory.setUpdateTime(LocalDateTime.now());
                memoryMapper.insert(memory);
                turns = 1;
            } else {
                turns = (memory.getTurnCount() == null ? 0 : memory.getTurnCount()) + 1;
                memory.setTurnCount(turns);
                memoryMapper.updateById(memory);
            }
            if (turns % MEMORY_EVERY_TURNS == 0) {
                final Long sid = sessionId;
                memoryExecutor.submit(() -> refreshMemory(userId, sid));
            }
        } catch (Exception e) {
            // 记忆是锦上添花的东西，失败了也不能影响对话
            log.warn("算法哥更新记忆索引失败：{}", e.getMessage());
        }
    }

    /** 真正的归纳：把「已有的记忆 + 最近这段对话」交给大模型，合并成一段新的记忆 */
    private void refreshMemory(Long userId, Long sessionId) {
        try {
            if (!llmClient.available()) {
                return;
            }
            AgentMemory memory = loadMemory(userId);
            List<AgentMessage> recent = messageMapper.selectList(new LambdaQueryWrapper<AgentMessage>()
                    .eq(AgentMessage::getSessionId, sessionId)
                    .orderByDesc(AgentMessage::getId)
                    .last("LIMIT 16"));
            if (recent.isEmpty()) {
                return;
            }
            Collections.reverse(recent);
            StringBuilder convo = new StringBuilder();
            for (AgentMessage message : recent) {
                convo.append("user".equals(message.getRole()) ? "同学：" : "算法哥：")
                        .append(StrUtil.maxLength(StrUtil.nullToEmpty(message.getContent()), 800))
                        .append("\n");
            }

            String old = memory == null ? "" : StrUtil.nullToEmpty(memory.getContent());
            String task = "【任务】更新「你对这位同学的长期记忆」。\n"
                    + "已有的记忆（可能为空）：\n" + (StrUtil.isBlank(old) ? "（空）" : old) + "\n\n"
                    + "最近这段对话：\n" + convo + "\n"
                    + "【输出要求】\n"
                    + "- 用不超过 6 条短句，概括：他常用的编程语言、常问或常错的题型、明显薄弱点、"
                    + "目标（比如在准备哪家公司的面试）、以及值得记住的偏好或约定。\n"
                    + "- 旧记忆里依然成立的保留，新信息并进去，过时的丢掉。\n"
                    + "- 只输出这几条短句，每行一条，不要标题、不要解释、不要客套。";

            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> item = new HashMap<>();
            item.put("role", "user");
            item.put("content", task);
            messages.add(item);
            String updated = llmClient.chat(
                    "你是算法哥，正在维护对某个学生的长期记忆。只输出记忆要点，不输出别的内容。", messages);
            if (StrUtil.isBlank(updated)) {
                return;
            }
            if (memory == null) {
                memory = new AgentMemory();
                memory.setUserId(userId);
                memory.setTurnCount(0);
                memory.setCreateTime(LocalDateTime.now());
                memory.setContent(StrUtil.maxLength(updated.trim(), 1000));
                memory.setUpdateTime(LocalDateTime.now());
                memoryMapper.insert(memory);
            } else {
                memory.setContent(StrUtil.maxLength(updated.trim(), 1000));
                memory.setUpdateTime(LocalDateTime.now());
                memoryMapper.updateById(memory);
            }
        } catch (Exception e) {
            log.warn("算法哥归纳记忆失败：{}", e.getMessage());
        }
    }

    // ------------------------------------------------------------------ 工具

    private AgentSession resolveSession(Long userId, Long sessionId, String content) {
        if (sessionId != null) {
            AgentSession session = getById(sessionId);
            if (session == null || !userId.equals(session.getUserId())) {
                throw new BusinessException("会话不存在");
            }
            return session;
        }
        return createSession(userId, StrUtil.maxLength(content, 30));
    }

    private AgentMessage saveMessage(Long sessionId, Long userId, String role, String content, String intent) {
        AgentMessage message = new AgentMessage();
        message.setSessionId(sessionId);
        message.setUserId(userId);
        message.setRole(role);
        message.setContent(content);
        message.setIntent(intent);
        message.setCreateTime(LocalDateTime.now());
        messageMapper.insert(message);
        return message;
    }

    private String detectIntent(String content, Long problemId) {
        String text = content.toLowerCase();
        // 改个人资料要排在最前面：这类话里常带「设置」「信息」这些词，别被后面的意图抢走
        if (looksLikeProfileUpdate(content)) {
            return INTENT_PROFILE;
        }
        // 错题本和「找类似题」也是先认，别被后面的「来过一道」这种词抢走
        if (containsAny(text, "错题", "做错的题", "错了哪些", "哪些没过", "没过的题", "没过哪些",
                "还没过的题", "我的错题本", "没过关", "没做出来的题", "栽跟头", "翻车的题",
                "搞不定的题", "啃不动的题", "没搞定的题", "没ac的题")) {
            return INTENT_WRONG;
        }
        if (containsAny(text, "类似的题", "类似题", "相似的题", "相似题", "同类题", "同类型的题",
                "有没有类似", "来几道类似", "找几道类似", "再来几道")) {
            return INTENT_SIMILAR;
        }
        // 让他动手收藏。注意「我的收藏 / 收藏夹」是在看列表，不是在收藏，别抢过来。
        if (containsAny(text, "收藏", "收一下", "加入收藏")
                && !containsAny(text, "我的收藏", "收藏夹", "收藏的题", "收藏列表", "收藏的题目")) {
            return INTENT_COLLECT;
        }
        // 让他发讨论。光提「讨论」不算，得带上发的动作，免得把「看看讨论区」也当成发帖。
        if (containsAny(text, "讨论", "评论", "发帖", "留言")
                && containsAny(text, "发", "发布", "写", "留", "帮我", "替我", "给我", "来一条", "来一段")) {
            return INTENT_DISCUSS;
        }
        if (containsAny(text, "每日一题", "今日一题", "今天做什么题", "每日任务",
                "今天做啥题", "今天做哪题", "今天练什么", "今天刷哪道", "今天做啥")) {
            return INTENT_DAILY;
        }
        if (containsAny(text, "题单", "刷题计划", "学习计划", "练几天", "排个计划", "做题计划",
                "给我排一排", "帮我安排", "刷题规划", "安排个计划", "怎么规划", "给个计划")) {
            return INTENT_PLAN;
        }
        if (containsAny(text, "学情", "画像", "诊断", "我怎么样", "我的水平", "薄弱", "短板", "哪里差", "进步了",
                "我菜在哪", "我弱在哪", "哪块不行", "我哪不行", "我什么水平", "看看我的水平")) {
            return INTENT_ANALYZE;
        }
        if (containsAny(text, "排名", "榜单", "第几名", "rating", "榜上", "升了几名",
                "我排多少", "排多少名", "排名咋样", "名次怎么样")) {
            return INTENT_RANK;
        }
        if (containsAny(text, "提示", "不会", "没思路", "怎么做", "怎么想", "卡住", "想不出来", "伪代码",
                "给点思路", "hint", "咋写", "怎么写", "不会写", "卡了", "卡这", "没头绪", "想不到",
                "给个思路", "讲讲思路", "怎么入手")) {
            return INTENT_HINT;
        }
        if (containsAny(text, "为什么错", "错哪", "判题", "提交结果", "运行结果", "过了吗", "为什么wa", "wa了",
                "超时", "tle", "编译错误", "运行错误", "答案错误", "runtime error", "ac了", "通过了",
                "没过", "没通过", "为啥没过", "为啥错", "错哪儿", "咋错的", "刚才那题", "刚交的", "刚提交的")) {
            return INTENT_JUDGE;
        }
        if (containsAny(text, "给我一道", "推荐一道", "来一道", "推荐题", "练一道", "找道题", "出题",
                "来一题", "来道题", "整一道", "给一道", "出道题")) {
            return INTENT_RECOMMEND;
        }
        // 关键词一个都没命中 → 再让大模型读一遍。
        // 口语说法列不完（「我那些栽过的题再给我翻翻」），这一步只在全落空时才走，
        // 换来的是「换个说法也听得懂」。
        String byLlm = classifyIntentByLlm(content);
        if (byLlm != null) {
            return byLlm;
        }
        return INTENT_CHAT;
    }

    /**
     * 意图兜底：本地关键词全落空时，让大模型把这句话归到固定意图里的一个。
     * <p>
     * 只回一个代号，认不准 / 没配大模型 / 出错，一律返回 null —— 退回普通聊天，绝不让它乱指路。
     * 太长的句子多半是在问知识或闲聊，就直接不折腾了。
     * 会「真动手写东西」的意图不进兜底（改资料 PROFILE、收藏 COLLECT、发讨论 DISCUSSION）：
     * 猜错了就是真改库、真公开发言，宁可让他把话说清楚。
     */
    private String classifyIntentByLlm(String content) {
        if (!llmClient.available() || StrUtil.isBlank(content) || content.length() > 40) {
            return null;
        }
        String system = "你是意图分类器，只输出一个类别代号，不要解释、不要标点、不要换行。\n"
                + "可选代号只有这些：\n"
                + "HINT 要思路或提示；JUDGE_REPORT 问某次提交为什么错、判题结果；ANALYZE 看学情、水平、薄弱项；\n"
                + "PLAN 要刷题计划或题单；RANK 看排名；DAILY 问今天该做哪道题；RECOMMEND 让随便推荐一道题；\n"
                + "WRONG 想看自己做错的题、还没过的题；SIMILAR 想要某道题的类似题、同类型题；\n"
                + "CHAT 其它（闲聊、问知识点、跟刷题无关的）。\n"
                + "只输出代号本身。";
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", content);
        messages.add(message);
        try {
            String raw = llmClient.chat(system, messages);
            if (StrUtil.isBlank(raw)) {
                return null;
            }
            String label = raw.trim().toUpperCase().replaceAll("[^A-Z_]", "");
            switch (label) {
                case INTENT_HINT:
                case INTENT_JUDGE:
                case INTENT_ANALYZE:
                case INTENT_PLAN:
                case INTENT_RANK:
                case INTENT_DAILY:
                case INTENT_RECOMMEND:
                case INTENT_WRONG:
                case INTENT_SIMILAR:
                    return label;
                default:
                    return null;
            }
        } catch (Exception e) {
            log.warn("意图兜底分类失败，按普通聊天处理：{}", e.getMessage());
            return null;
        }
    }

    // ------------------------------------------------------------------ 错题本 / 找类似题

    @Override
    public List<WrongProblemVO> wrongProblems(Long userId) {
        return statsMapper.selectWrongProblems(userId);
    }

    /** 错题本：把他还没过的题摆成一张可点的卡片，点题名就能进去重做 */
    private String handleWrongProblems(Long userId, Long sessionId, Long userMessageId,
                                       Map<String, Object> payload) {
        List<WrongProblemVO> wrongs = statsMapper.selectWrongProblems(userId);
        payload.put("type", "wrong");
        payload.put("problems", wrongs);
        if (wrongs.isEmpty()) {
            return "错题本是空的——你交过的都过了。\n不是夸你，是你挑得太保守。去题库找两道看着不顺眼的。";
        }
        WrongProblemVO worst = wrongs.get(0);
        for (WrongProblemVO w : wrongs) {
            if (w.getFailCount() != null
                    && (worst.getFailCount() == null || w.getFailCount() > worst.getFailCount())) {
                worst = w;
            }
        }
        StringBuilder sb = new StringBuilder();
        sb.append(wrongs.size()).append(" 道还没过，全给你摆出来了。\n");
        // 题名写成站内链接，点一下直接进题重做
        sb.append("最该先收拾的是 [").append(worst.getTitle())
                .append("](/problem/").append(worst.getId()).append(")");
        if (worst.getFailCount() != null && worst.getFailCount() > 1) {
            sb.append("，你已经在它身上栽了 ").append(worst.getFailCount()).append(" 次");
        }
        sb.append("。点题名直接进去重做；想先练手感，就点后面的「找类似的」。\n");
        sb.append("规矩不变：先自己想，卡住了再来找我要提示。");
        return sb.toString();
    }

    /** 要几道类似的题：定一道基准题，把库里挂好的同类型题给他 */
    private String handleSimilar(Long userId, Long sessionId, Long userMessageId,
                                 AgentChatDTO dto, String content, Map<String, Object> payload) {
        Problem base = null;
        if (dto.getProblemId() != null) {
            base = problemService.getById(dto.getProblemId());
        }
        if (base == null) {
            // 他可能是从错题卡片上点「找类似的」过来的，话里带着题名
            base = matchProblemInText(content);
        }
        if (base == null) {
            return "先说清是哪道题的类似题——在题目页面直接问我，或者把题名带上，"
                    + "比如「给我几道和最长递增子序列类似的题」。";
        }

        List<ProblemSimilarVO> similar = problemService.getSimilarProblems(base.getId());
        payload.put("type", "similar");
        payload.put("baseId", base.getId());
        payload.put("baseTitle", base.getTitle());
        payload.put("problems", similar);

        // 联网是补充项：配了搜索 key 才去网上翻，翻到就一起放进卡片；
        // 没配 key 时这里是空 list，下面这段等于不存在。
        List<Map<String, String>> web = searchClient.search(base.getTitle() + " 类似题 算法", 3);
        if (!web.isEmpty()) {
            payload.put("web", web);
        }

        if (similar.isEmpty()) {
            if (web.isEmpty()) {
                return "「" + base.getTitle() + "」这题，我库里还没挂上同类题。";
            }
            return "「" + base.getTitle() + "」这题题库里没挂同类题，我上网翻了几条，放卡片里了。";
        }
        StringBuilder sb = new StringBuilder();
        sb.append("「").append(base.getTitle()).append("」这一路，我给你挑了 ")
                .append(similar.size()).append(" 道：");
        // 题名写成站内链接，点一下直接进题（前端会在当前页签里跳）
        for (int i = 0; i < similar.size(); i++) {
            ProblemSimilarVO item = similar.get(i);
            sb.append(i == 0 ? "" : "、")
                    .append("[").append(item.getTitle()).append("](/problem/").append(item.getId()).append(")");
        }
        sb.append("。\n点题名直接进去做。");
        if (similar.size() >= 2) {
            sb.append("做的时候留意「").append(similar.get(0).getTitle())
                    .append("」和「").append(similar.get(1).getTitle())
                    .append("」差在哪——同类型的题，差的那一点才是考点。");
        }
        if (!web.isEmpty()) {
            sb.append("\n另外我上网也翻了几条相关的，一并放卡片里了。");
        }
        return sb.toString();
    }

    /** 从他说的话里认出题名：取句子里出现过的最长的那个题名。
        他也常把后缀省掉（题名「爬楼梯问题」，他说「爬楼梯」），所以带一层后缀容错。 */
    private Problem matchProblemInText(String content) {
        if (StrUtil.isBlank(content)) {
            return null;
        }
        Problem best = null;
        int bestLen = 0;
        for (Problem p : problemService.list()) {
            String title = p.getTitle();
            if (StrUtil.isBlank(title) || title.length() < 2) {
                continue;
            }
            String hit = null;
            if (content.contains(title)) {
                hit = title;
            } else {
                String bare = title.replaceAll("(问题|题目|这道题|这题)$", "");
                if (bare.length() >= 2 && content.contains(bare)) {
                    hit = bare;
                }
            }
            if (hit != null && hit.length() > bestLen) {
                best = p;
                bestLen = hit.length();
            }
        }
        return best;
    }

    // ------------------------------------------------------------------ 帮他收藏 / 发讨论

    /** 定位这次要操作的题：优先「他现在打开的那道」，其次从话里认题名 */
    private Problem resolveTargetProblem(AgentChatDTO dto, String content) {
        Problem problem = null;
        if (dto.getProblemId() != null) {
            problem = problemService.getProblemDetail(dto.getProblemId());
        }
        if (problem == null) {
            problem = matchProblemInText(content);
        }
        return problem;
    }

    /** 「帮我收藏这题」→ 真去收藏；说「取消收藏」就取消 */
    private String handleCollect(Long userId, AgentChatDTO dto, String content) {
        Problem problem = resolveTargetProblem(dto, content);
        if (problem == null) {
            return "收藏哪道题？在题目页面直接跟我说，或者把题号、题名带上，"
                    + "比如「帮我收藏爬楼梯问题」。";
        }
        boolean cancel = containsAny(content, "取消", "移除", "去掉", "删掉", "不收藏", "别收藏");
        String link = "[" + problem.getTitle() + "](/problem/" + problem.getId() + ")";
        if (cancel) {
            if (!collectService.isCollected(userId, problem.getId())) {
                return "「" + problem.getTitle() + "」本来就没在你的收藏里，不用取消。";
            }
            collectService.cancelCollect(userId, problem.getId());
            return "行，" + link + " 给你从收藏里拿掉了。";
        }
        if (collectService.isCollected(userId, problem.getId())) {
            return "「" + problem.getTitle() + "」你早收藏过了，在个人主页「收藏题目」里躺着呢。";
        }
        collectService.collect(userId, problem.getId());
        return "收藏了，" + link + " 已经进你的收藏夹，个人主页「收藏题目」能翻到。";
    }

    /** 「帮我在这题下发个讨论：……」→ 发到这道题的讨论区 */
    private String handleDiscussion(Long userId, AgentChatDTO dto, String content) {
        Problem problem = resolveTargetProblem(dto, content);
        if (problem == null) {
            return "发哪道题的讨论？在题目页面直接跟我说，或者把题号、题名带上。";
        }
        String body = parseDiscussionContent(content);
        if (StrUtil.isBlank(body)) {
            return "内容是啥？你把要说的话给我，我替你发到「" + problem.getTitle() + "」的讨论区。\n"
                    + "比如：帮我发个讨论：这题用双指针能把复杂度压到 O(n)。";
        }
        Note existing = noteService.getNote(userId, problem.getId());
        noteService.saveOrUpdateNote(userId, problem.getId(), body);
        String link = "[" + problem.getTitle() + "](/problem/" + problem.getId() + ")";
        if (existing != null) {
            return "发上去了，" + link + " 的讨论区能看到。\n"
                    + "提醒一句：你在这题下面原来那条被这条顶掉了——平台的讨论是一个人一道题只能留一条。";
        }
        return "发好了，" + link + " 的讨论区能看到，个人主页「讨论」里也记了一笔。";
    }

    /** 从「帮我发个讨论：……」里把要发的那段话抠出来；抠不出就返回 null，让他自己把话说清楚 */
    private String parseDiscussionContent(String content) {
        if (StrUtil.isBlank(content)) {
            return null;
        }
        String text = content.trim();
        // 1) 冒号后面就是正文（中英文冒号都认）
        int cut = -1;
        int cn = text.indexOf('：');
        int en = text.indexOf(':');
        if (cn >= 0) {
            cut = cn;
        }
        if (en >= 0 && (cut < 0 || en < cut)) {
            cut = en;
        }
        if (cut >= 0) {
            String body = text.substring(cut + 1).trim();
            if (StrUtil.isNotBlank(body)) {
                return body;
            }
        }
        // 2) 「……」里的那句一般就是正文
        Matcher quoted = DISCUSS_QUOTE_PATTERN.matcher(text);
        if (quoted.find() && StrUtil.isNotBlank(quoted.group(1))) {
            return quoted.group(1).trim();
        }
        // 3) 「讨论 / 评论 / 留言」后面跟着的那一截（剥掉「一下」这类语气词）
        Matcher tail = DISCUSS_TAIL_PATTERN.matcher(text);
        if (tail.find()) {
            String body = tail.group(1).trim().replaceAll("^(一下|以下|这条|这个|一句)[，,。、\\s]*", "");
            // 太短的八成是语气词残渣，不是真内容——宁可不发，也别往讨论区丢垃圾
            if (body.length() >= 6) {
                return body;
            }
        }
        return null;
    }

    // ------------------------------------------------------------------ 用对话改个人资料

    /** 资料字段词：出现这些词基本就是要改资料。
        用户名 / 邮箱 / 头像 / 密码 也收进来——这些不归我改，但必须由我给出准确答复，
        不能漏给大模型，否则它会顺着话头瞎说「已经改好了」。 */
    private static final Pattern PROFILE_FIELD_RE = Pattern.compile(
            "性别|位置|所在地|地区|城市|加入时间|注册时间|入驻时间|昵称|简介|个性签名|签名|"
                    + "个人资料|个人信息|用户名|账号名|邮箱|头像|密码");
    /** 「我在北京」「我来自上海」这种不带字段词的说法，也算在改位置。
        整句必须就是这个形状，免得「我在做动态规划的题」被当成位置。 */
    private static final Pattern PROFILE_SELF_RE = Pattern.compile(
            "^我(?:现在)?(?:在|住在|来自|定居在?|坐标)([\\u4e00-\\u9fa5A-Za-z]{2,6})(?:了|吧|呀|啊|哦|的)?$");
    /** 位置值里不该出现这些词，否则说明抓错了（比如「我在做题」） */
    private static final String[] LOC_STOPWORDS = {
            "做题", "刷", "写", "学", "考", "忙", "公司", "这里", "那里", "看", "想", "弄", "搞",
            "改", "用", "睡觉", "上班", "上课", "吃饭", "玩", "聊天", "编程", "debug", "摸鱼", "家",
            "题", "的", "书", "代码", "算法", "项目", "一下", "怎么", "怎样", "如何", "不对", "错"
    };
    /** 这些词单独出现只是语气词/指代，不是真的资料值（「帮我改一下昵称看看」里的「看看」） */
    private static final Pattern FILLER_WORDS = Pattern.compile(
            "看看|看一下|看下|一下|试试|怎么|怎样|如何|行吗|可以吗|谢谢|帮我|改改|设置|吧");

    /** 光提到「头像」「位置」不算改资料（「头像有点丑」是吐槽）：得有改的动作 */
    private static final Pattern PROFILE_ACTION_RE = Pattern.compile(
            "改成|改为|设为|设置为|变成|换成|换|改|设置|更新|填|恢复|清空|去掉|删掉|是|为|：|:");

    private boolean looksLikeProfileUpdate(String content) {
        String c = content.replaceAll("\\s+", "");
        if (PROFILE_FIELD_RE.matcher(c).find() && PROFILE_ACTION_RE.matcher(c).find()) {
            return true;
        }
        return parseLocation(c) != null;
    }

    /**
     * 用一句话改个人资料：昵称、性别、位置、加入时间、个性简介、邮箱、头像、密码。
     * <p>
     * 这里刻意不让大模型经手——改的是数据库里的真字段，必须确定、可核对，
     * 所以他改完直接把「改了什么」念给你听。
     */
    private String handleProfileUpdate(Long userId, Long sessionId, Long userMessageId,
                                       String content, Map<String, Object> payload) {
        String c = content.replaceAll("\\s+", "");
        if (userService.getById(userId) == null) {
            return "没找着你的账号，回头再试。";
        }

        // 改密码单独处理：要验原密码，而且聊天记录里绝不能留下明文
        String newPassword = parseNewPassword(c);
        if (newPassword != null) {
            return changePassword(userId, userMessageId, c, newPassword, payload);
        }

        List<String> changed = new ArrayList<>();
        User update = new User();
        update.setId(userId);

        String gender = parseGender(c);
        if (gender != null) {
            update.setGender(gender);
            changed.add("性别 " + gender);
        }
        String location = parseLocation(c);
        if (location != null) {
            update.setIpAddress(location);
            changed.add("位置 " + location);
        }
        LocalDateTime joinTime = parseJoinTime(c);
        if (joinTime != null) {
            update.setCreateTime(joinTime);
            changed.add("加入时间 " + joinTime.toLocalDate());
        }
        String nickname = parseNickname(c);
        if (nickname != null) {
            update.setNickname(nickname);
            changed.add("昵称 " + nickname);
        }
        String bio = parseBio(c);
        if (bio != null) {
            update.setBio(bio);
            changed.add("简介「" + bio + "」");
        }
        String email = parseEmail(c);
        if (email != null) {
            update.setEmail(email);
            changed.add("邮箱 " + email);
        }
        // 头像：要么换成某个链接，要么恢复成默认
        if (isAvatarReset(c)) {
            update.setAvatar("");
            changed.add("头像（已恢复默认）");
        } else {
            String avatar = parseAvatar(c);
            if (avatar != null) {
                update.setAvatar(avatar);
                changed.add("头像");
            }
        }

        if (changed.isEmpty()) {
            if (c.contains("密码") && (c.contains("改") || c.contains("换") || c.contains("新")
                    || c.contains("设置") || c.contains("重置"))) {
                // 只是说了「我要改密码」，没把新密码（或原密码）写出来 —— 直接告诉他该怎么写
                return "改密码要带上原密码和新密码，例如「原密码是 abc123，新密码改成 xyz789」。";
            }
            if (c.contains("用户名") || c.contains("账号名")) {
                return "用户名是登录用的，改不了。能改的是：昵称、性别、位置、加入时间、个性简介、邮箱、头像、密码。";
            }
            return "没听明白要改哪一项。我能改：昵称、性别、位置、加入时间、个性简介、邮箱、头像、密码。\n"
                    + "比如「性别改成女」「我在北京」「加入时间设为 2024-03-01」「昵称改成阿伟」"
                    + "「简介：爱刷题的大三学生」「邮箱改成 abc@bjtu.edu.cn」「头像换成 https://... 这个链接」。";
        }

        userService.updateById(update);
        // 告诉前端：资料变了，把右上角那份缓存的用户信息刷一下
        payload.put("type", "profile");
        payload.put("changed", changed);
        return "改好了：" + String.join("；", changed)
                + "。\n个人主页上已经更新，自己去看一眼对不对。";
    }

    /** 改密码：必须带上原密码校验；改完把聊天记录里那条消息抹掉，别留明文 */
    private String changePassword(Long userId, Long userMessageId, String c,
                                  String newPassword, Map<String, Object> payload) {
        String oldPassword = parseOldPassword(c);
        if (oldPassword == null) {
            return "改密码得先验原密码。你把原密码也带上，例如「原密码是 abc123，新密码改成 xyz789」。";
        }
        if (newPassword.length() < 6) {
            return "新密码太短了，至少 6 位再试。";
        }
        try {
            userService.updatePassword(userId, oldPassword, newPassword);
        } catch (Exception e) {
            return "原密码不对，没改成。你要是忘了原密码，找管理员重置。";
        }
        redactMessage(userMessageId);
        payload.put("type", "profile");
        return "密码改好了。\n刚才那条带密码的消息我从聊天记录里抹掉了——以后别把密码发在对话里。";
    }

    /** 把某条消息的内容替换掉（改密码用） */
    private void redactMessage(Long messageId) {
        if (messageId == null) {
            return;
        }
        AgentMessage redacted = new AgentMessage();
        redacted.setId(messageId);
        redacted.setContent("（这条消息包含密码，已从聊天记录中抹去）");
        messageMapper.updateById(redacted);
    }

    /** 性别：必须有性别语境才认，免得「男朋友」这种也被当成性别 */
    private String parseGender(String c) {
        boolean ctx = Pattern.compile("性别|(?:改|变|换|设)(?:成|为).{0,2}(?:男|女)|我(?:是|想当|要当|当).{0,2}(?:男|女)")
                .matcher(c).find();
        if (!ctx) {
            return null;
        }
        if (c.contains("保密")) {
            return "保密";
        }
        if (c.contains("其他") || c.contains("其它")) {
            return "其他";
        }
        if (c.contains("女")) {
            return "女";
        }
        if (c.contains("男")) {
            return "男";
        }
        return null;
    }

    private String parseLocation(String c) {
        // 动词/分隔符必须写出来：「位置不对啊」这种抱怨不能被当成把位置改成「不对」
        Matcher m = Pattern.compile(
                "(?:位置|所在地|地区|城市|坐标)[^\\u4e00-\\u9fa5A-Za-z]{0,4}"
                        + "(?:改成|改为|设为|设置为|变成|换成|是|为|在|：|:)"
                        + "\\s*([\\u4e00-\\u9fa5A-Za-z]{2,12})").matcher(c);
        if (m.find()) {
            String v = cleanLocation(m.group(1));
            if (v != null) {
                return v;
            }
        }
        Matcher self = PROFILE_SELF_RE.matcher(c);
        if (self.find()) {
            return cleanLocation(self.group(1));
        }
        return null;
    }

    private String cleanLocation(String raw) {
        String v = raw.replaceAll("(了|的|吧|呀|啊|哦|呢|嘛|，|。|！|？|,|\\.|!|\\?)+$", "");
        for (String stop : LOC_STOPWORDS) {
            if (v.contains(stop)) {
                return null;
            }
        }
        return v.length() >= 2 ? v : null;
    }

    private LocalDateTime parseJoinTime(String c) {
        Matcher m = Pattern.compile(
                "(?:加入时间|注册时间|入驻时间|加入于|注册于|加入|注册)[^0-9]{0,8}"
                        + "(\\d{4})\\s*[-/年.]\\s*(\\d{1,2})\\s*(?:[-/月.]\\s*(\\d{1,2}))?").matcher(c);
        if (!m.find()) {
            return null;
        }
        try {
            int year = Integer.parseInt(m.group(1));
            int month = Integer.parseInt(m.group(2));
            int day = m.group(3) == null ? 1 : Integer.parseInt(m.group(3));
            if (month < 1 || month > 12 || day < 1 || day > 31) {
                return null;
            }
            return LocalDateTime.of(year, month, day, 0, 0);
        } catch (Exception e) {
            return null;
        }
    }

    private String parseNickname(String c) {
        // 动词/分隔符必须真的写出来，否则「帮我改一下昵称看看」会把「看看」当成新昵称
        Matcher m = Pattern.compile(
                "昵称[^\\u4e00-\\u9fa5A-Za-z0-9]{0,4}"
                        + "(?:改成|改为|设为|设置为|换成|叫|是|为|：|:)"
                        + "\\s*([\\u4e00-\\u9fa5A-Za-z0-9_\\-]{1,16})").matcher(c);
        if (!m.find()) {
            return null;
        }
        String v = m.group(1).replaceAll("(吧|呀|啊|哦|呢|了|的)+$", "");
        if (v.isEmpty() || FILLER_WORDS.matcher(v).matches()) {
            return null;
        }
        return v;
    }

    private String parseBio(String c) {
        Matcher m = Pattern.compile(
                "(?:简介|个性签名|签名|自我介绍|座右铭)[^\\u4e00-\\u9fa5A-Za-z0-9]{0,4}"
                        + "(?:改成|改为|设为|设置为|换成|是|为|：|:)\\s*(.{1,80})").matcher(c);
        if (!m.find()) {
            return null;
        }
        String v = m.group(1).replaceAll("(，|。|！|？|,|\\.|!|\\?|~|～)+$", "").trim();
        return v.isEmpty() ? null : v;
    }

    /** 邮箱：句子里提到邮箱，就把那个邮件地址抓出来 */
    private String parseEmail(String c) {
        if (!c.toLowerCase().contains("邮箱") && !c.toLowerCase().contains("email")) {
            return null;
        }
        Matcher m = Pattern.compile("([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,})").matcher(c);
        return m.find() ? m.group(1) : null;
    }

    /** 「头像恢复默认」「把头像清掉」 */
    private boolean isAvatarReset(String c) {
        return c.contains("头像")
                && (c.contains("恢复默认") || c.contains("默认头像") || c.contains("清空")
                    || c.contains("去掉") || c.contains("删掉") || c.contains("换回默认"));
    }

    /** 头像换成某个图片链接 */
    private String parseAvatar(String c) {
        if (!c.contains("头像")) {
            return null;
        }
        Matcher m = Pattern.compile("(https?://[^\\s，。；、\"'）)]+)").matcher(c);
        return m.find() ? m.group(1) : null;
    }

    /**
     * 新密码。支持「新密码 abc」「密码改成 abc」「把密码改成 abc」「密码设为 abc」。
     * 「旧密码」里的那个「密码」后面跟着的是「是/为」，不会被这里吃掉。
     */
    private String parseNewPassword(String c) {
        Matcher m = Pattern.compile(
                "(?:新密码|(?:要)?(?:改成|改为|设为|设置为|换成)的?密码"
                        + "|密码(?:改成|改为|设为|设置为|换成))"
                        + "[^\\w]{0,4}(?:是|为|：|:)?\\s*([^\\s，。；,;、]{1,30})").matcher(c);
        return m.find() ? m.group(1) : null;
    }

    /** 原密码。必须带「是/为/：」这类分隔，免得把「旧密码改成 xyz」里的 xyz 当成原密码 */
    private String parseOldPassword(String c) {
        Matcher m = Pattern.compile(
                "(?:旧|原|当前|原本的?|现在的?)(?:的)?密码"
                        + "\\s*(?:是|为|：|:)\\s*([^\\s，。；,;、]{1,30})").matcher(c);
        if (m.find()) {
            return m.group(1);
        }
        // 「旧密码 abc」这种只空一格的写法
        Matcher m2 = Pattern.compile(
                "(?:旧|原|当前|原本的?|现在的?)(?:的)?密码\\s*(?!是|为|：|:|改成|改为|设为|设置为|换成)"
                        + "([^\\s，。；,;、]{1,30})").matcher(c);
        return m2.find() ? m2.group(1) : null;
    }

    private String buildProblemFacts(Problem problem) {
        StringBuilder sb = new StringBuilder();
        sb.append("## 题目\n");
        sb.append("- 题号：").append(problem.getId()).append("\n");
        sb.append("- 标题：").append(problem.getTitle()).append("\n");
        sb.append("- 难度：").append(difficultyCn(problem.getDifficulty())).append("\n");
        if (problem.getTags() != null && !problem.getTags().isEmpty()) {
            sb.append("- 标签：").append(problem.getTags().stream().map(Tag::getName).collect(Collectors.joining("、"))).append("\n");
        }
        sb.append("- 时间限制：").append(problem.getTimeLimit()).append(" ms，内存限制：")
                .append(problem.getMemoryLimit()).append(" MB\n\n");
        sb.append("### 题目描述\n").append(StrUtil.maxLength(StrUtil.nullToEmpty(problem.getDescription()), 3000)).append("\n\n");
        sb.append("### 输入描述\n").append(StrUtil.maxLength(StrUtil.nullToEmpty(problem.getInputDescription()), 1200)).append("\n\n");
        sb.append("### 输出描述\n").append(StrUtil.maxLength(StrUtil.nullToEmpty(problem.getOutputDescription()), 1200)).append("\n\n");
        sb.append("### 样例输入\n```\n").append(StrUtil.nullToEmpty(problem.getSampleInput())).append("\n```\n\n");
        sb.append("### 样例输出\n```\n").append(StrUtil.nullToEmpty(problem.getSampleOutput())).append("\n```\n");
        if (StrUtil.isNotBlank(problem.getTemplateCode())) {
            sb.append("\n### 平台给的模板代码\n```java\n")
                    .append(StrUtil.maxLength(problem.getTemplateCode(), 1500)).append("\n```\n");
        }
        return sb.toString();
    }

    // ------------------------------------------------------------------ 代写代码

    @Override
    public AgentSolveVO solve(Long userId, AgentSolveDTO dto) {
        Problem problem = dto.getProblemId() == null ? null : problemService.getById(dto.getProblemId());
        if (problem == null) {
            throw new BusinessException("这题不存在，我写不了。");
        }
        String language = normalizeLanguage(dto.getLanguage());

        AgentSolveVO vo = new AgentSolveVO();
        vo.setProblemId(problem.getId());
        vo.setProblemTitle(problem.getTitle());
        vo.setLanguage(language);

        // 1) 题库里已经存着这份语言的标准答案（每一份都提交判题机验过能 AC）——
        //    直接取出来给他，绝不再让大模型现编。现编的代码经常把题面读岔、跑出错误结果。
        ProblemSolution verified = findSolution(problem.getId(), language);
        if (verified != null && StrUtil.isNotBlank(verified.getCode())) {
            vo.setCode(verified.getCode());
            vo.setNote(StrUtil.isBlank(verified.getNote()) ? "写完了，拿去交。" : verified.getNote());
            return vo;
        }

        // 2) 八股文概念题 / SQL 题没有能跑代码 —— 把讲解或 SQL 原样讲给他听（code 留空）
        ProblemSolution explain = findSolution(problem.getId(), "TEXT");
        if (explain == null) {
            explain = findSolution(problem.getId(), "SQL");
        }
        if (explain != null && StrUtil.isNotBlank(explain.getCode())) {
            vo.setNote(explain.getCode());
            return vo;
        }

        // 3) 兜底：这道题还没准备答案，才让大模型现写（会明确告诉他这份没验过）
        if (!llmClient.available()) {
            vo.setNote("这题我手里还没有验过的标准答案，大模型也没接上，写不了。");
            return vo;
        }

        String facts = buildProblemFacts(problem)
                + "\n## 要用什么语言写\n" + languageLabel(language) + "\n";
        String task = "【任务】用 " + languageLabel(language) + " 写出这题的完整可提交代码。\n"
                + "只输出：一句不超过 25 字的话 + 一个 ``` 代码块，别写别的。";

        String raw = askLlm(userId, null, null, task, facts);
        String code;
        String note;
        Matcher matcher = CODE_BLOCK.matcher(raw);
        if (matcher.find()) {
            code = matcher.group(1).trim();
            note = raw.substring(0, matcher.start()).trim();
        } else {
            // 模型没按格式给代码块：整段当代码塞进去，至少他手里有东西改
            code = raw.replace("```", "").trim();
            note = "格式没按我说的来，代码给你塞进去了，自己扫一眼再交。";
        }
        if (StrUtil.isBlank(code)) {
            vo.setNote("这次没写出来，再点我一次试试。");
            return vo;
        }
        vo.setCode(code);
        vo.setNote(StrUtil.isBlank(note) ? "写完了，拿去交。" : StrUtil.maxLength(note, 60));
        return vo;
    }

    /** 取某道题某语言的已验证答案；没有返回 null */
    private ProblemSolution findSolution(Long problemId, String language) {
        return problemSolutionMapper.selectOne(new LambdaQueryWrapper<ProblemSolution>()
                .eq(ProblemSolution::getProblemId, problemId)
                .eq(ProblemSolution::getLanguage, language));
    }

    /** 语言标识归一化：不认识的按 Java 处理 */
    private static String normalizeLanguage(String raw) {
        if (StrUtil.isBlank(raw)) {
            return "JAVA";
        }
        String key = raw.trim().toUpperCase();
        if ("CPP".equals(key) || "C".equals(key) || "PYTHON".equals(key) || "JAVASCRIPT".equals(key)) {
            return key;
        }
        return "JAVA";
    }

    private static String languageLabel(String key) {
        switch (key) {
            case "CPP":
                return "C++";
            case "C":
                return "C";
            case "PYTHON":
                return "Python";
            case "JAVASCRIPT":
                return "JavaScript";
            default:
                return "Java";
        }
    }

    private String buildProblemSubmitFacts(Long userId, Long problemId) {
        List<Map<String, Object>> rows = statsMapper.selectProblemStatusStats(userId, problemId);
        if (rows.isEmpty()) {
            return "- 这道题他还没提交过。\n";
        }
        StringBuilder sb = new StringBuilder("- 这道题他的提交记录：");
        for (Map<String, Object> row : rows) {
            sb.append(AgentAnalysisService.friendlyStatus(String.valueOf(row.get("status")))
                    .split(" ")[0]).append(" ").append(StatsUtil.asLong(row.get("cnt"))).append(" 次；");
        }
        sb.append("\n");
        return sb.toString();
    }

    private String difficultyCn(String difficulty) {
        if ("HARD".equals(difficulty)) {
            return "困难";
        }
        if ("MEDIUM".equals(difficulty)) {
            return "中等";
        }
        return "简单";
    }

    private boolean containsAny(String text, String... keywords) {
        if (text == null) {
            return false;
        }
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

}
