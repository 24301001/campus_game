package com.coding.platform.service;

import com.coding.platform.mapper.AgentStatsMapper;
import com.coding.platform.utils.StatsUtil;
import com.coding.platform.vo.AgentAnalysisVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 学情分析引擎：全部用确定性聚合算画像，大模型只负责把结论讲成人话。
 * <p>
 * 「给结论，不是给数据」——所以这里输出的是画像数字 + 事实描述，
 * 归因表述由 AgentService 交给大模型包装。
 */
@Service
public class AgentAnalysisService {

    @Autowired
    private AgentStatsMapper statsMapper;

    public AgentAnalysisVO analyze(Long userId) {
        AgentAnalysisVO vo = new AgentAnalysisVO();

        long attempted = StatsUtil.asLong(statsMapper.selectAttemptedCount(userId));
        long solved = StatsUtil.asLong(statsMapper.selectSolvedCount(userId));
        long submits = StatsUtil.asLong(statsMapper.selectSubmitCount(userId));
        long acceptedSubmits = StatsUtil.asLong(statsMapper.selectAcceptedSubmitCount(userId));

        vo.setAttemptedCount((int) attempted);
        vo.setSolvedCount((int) solved);
        vo.setSubmitCount((int) submits);
        vo.setAcceptedSubmitCount((int) acceptedSubmits);
        vo.setSolveRate(StatsUtil.rate(solved, attempted));
        vo.setAcceptRate(StatsUtil.rate(acceptedSubmits, submits));
        vo.setRank(StatsUtil.asInt(statsMapper.selectMyRank(userId)));
        vo.setTotalUsers(StatsUtil.asInt(statsMapper.selectTotalUsers()));
        vo.setActiveDays(StatsUtil.asInt(statsMapper.selectActiveDays(userId)));
        vo.setRepeatWaCount(StatsUtil.asInt(statsMapper.selectRepeatWaProblemCount(userId)));

        // 标签画像：补上通过率，并按通过率升序（最虚的排前面）
        List<Map<String, Object>> tagStats = statsMapper.selectTagStats(userId);
        for (Map<String, Object> row : tagStats) {
            long tagAttempted = StatsUtil.asLong(row.get("attempted"));
            long tagAccepted = StatsUtil.asLong(row.get("accepted"));
            row.put("rate", StatsUtil.rate(tagAccepted, tagAttempted));
        }
        tagStats.sort((left, right) ->
                Double.compare(StatsUtil.asDouble(left.get("rate")), StatsUtil.asDouble(right.get("rate"))));
        vo.setTagStats(tagStats);
        vo.setWeakTags(pickWeakTags(tagStats));

        vo.setDifficultyStats(statsMapper.selectDifficultyStats(userId));
        vo.setStatusStats(statsMapper.selectStatusStats(userId));
        vo.setStatusByDifficulty(statsMapper.selectStatusByDifficulty(userId));
        vo.setHourStats(statsMapper.selectHourStats(userId));

        List<Map<String, Object>> trend = statsMapper.selectDailyTrend(userId);
        vo.setTrend(trend);
        vo.setMaxStreak(calcMaxStreak(trend));

        // 今天单独拎出来：问「今天交了几次 / 几点交的」时直接有数可答
        vo.setTodaySummary(statsMapper.selectTodaySummary(userId));
        vo.setTodayRecords(statsMapper.selectTodayRecords(userId));

        return vo;
    }

    /** 薄弱标签：通过率低于 60% 且做过的题数够看的，取最虚的三个 */
    private List<String> pickWeakTags(List<Map<String, Object>> tagStats) {
        List<String> weak = new ArrayList<>();
        for (Map<String, Object> row : tagStats) {
            long attempted = StatsUtil.asLong(row.get("attempted"));
            if (attempted > 0 && StatsUtil.asDouble(row.get("rate")) < 60.0) {
                weak.add(String.valueOf(row.get("name")));
            }
            if (weak.size() >= 3) {
                break;
            }
        }
        if (weak.isEmpty() && !tagStats.isEmpty()) {
            // 没有明显短板时，把「做得最少」的那个标签当作优先补的对象
            Map<String, Object> least = tagStats.get(0);
            for (Map<String, Object> row : tagStats) {
                if (StatsUtil.asLong(row.get("attempted")) < StatsUtil.asLong(least.get("attempted"))) {
                    least = row;
                }
            }
            weak.add(String.valueOf(least.get("name")));
        }
        return weak;
    }

    private int calcMaxStreak(List<Map<String, Object>> trend) {
        int max = 0;
        int current = 0;
        LocalDate previous = null;
        for (Map<String, Object> row : trend) {
            LocalDate day;
            try {
                day = LocalDate.parse(String.valueOf(row.get("day")));
            } catch (Exception e) {
                continue;
            }
            if (previous != null && day.equals(previous.plusDays(1))) {
                current++;
            } else {
                current = 1;
            }
            previous = day;
            max = Math.max(max, current);
        }
        return max;
    }

    /**
     * 把画像整理成给大模型看的「真实数据」——数字只允许来自这里。
     */
    public String buildFacts(AgentAnalysisVO vo) {
        StringBuilder sb = new StringBuilder();
        sb.append("## 真实数据（只许引用这里的数字）\n");
        sb.append("- 做过 ").append(vo.getAttemptedCount()).append(" 题，过 ").append(vo.getSolvedCount())
                .append(" 题，题目通过率 ").append(vo.getSolveRate()).append("%\n");
        sb.append("- 总提交 ").append(vo.getSubmitCount()).append(" 次，AC ")
                .append(vo.getAcceptedSubmitCount()).append(" 次，提交通过率 ")
                .append(vo.getAcceptRate()).append("%\n");
        sb.append("- 全局排名：第 ").append(vo.getRank()).append(" / 共 ")
                .append(vo.getTotalUsers()).append(" 人\n");
        sb.append("- 有提交的天数 ").append(vo.getActiveDays()).append(" 天，最长连续 ")
                .append(vo.getMaxStreak()).append(" 天\n");
        sb.append("- 同一题反复 WA（≥3 次）的题：").append(vo.getRepeatWaCount()).append(" 道\n");

        // 今天单独写清楚：用户很爱问「今天交了几次、几点交的」
        Map<String, Object> today = vo.getTodaySummary();
        long todayTotal = today == null ? 0 : StatsUtil.asLong(today.get("total"));
        sb.append("- 今天（").append(LocalDate.now()).append("）：");
        if (todayTotal == 0) {
            sb.append("还没有提交过\n");
        } else {
            sb.append("提交 ").append(todayTotal).append(" 次，AC ")
                    .append(StatsUtil.asLong(today.get("accepted"))).append(" 次，涉及 ")
                    .append(StatsUtil.asLong(today.get("problems"))).append(" 道题（最早 ")
                    .append(today.get("firstAt")).append("，最近 ").append(today.get("lastAt")).append("）\n");
            if (vo.getTodayRecords() != null && !vo.getTodayRecords().isEmpty()) {
                sb.append("  今天每一次提交：");
                for (Map<String, Object> row : vo.getTodayRecords()) {
                    sb.append(row.get("time")).append(" ").append(row.get("title"))
                            .append("[").append(friendlyStatus(String.valueOf(row.get("status")))).append("] ");
                }
                sb.append("\n");
            }
        }
        sb.append("\n");

        sb.append("### 标签画像（通过率升序）\n");
        sb.append("| 标签 | 做过题数 | 通过题数 | 通过率 |\n|---|---|---|---|\n");
        for (Map<String, Object> row : vo.getTagStats()) {
            sb.append("| ").append(row.get("name")).append(" | ").append(StatsUtil.asLong(row.get("attempted")))
                    .append(" | ").append(StatsUtil.asLong(row.get("accepted")))
                    .append(" | ").append(StatsUtil.asDouble(row.get("rate"))).append("% |\n");
        }

        sb.append("\n### 难度画像\n| 难度 | 做过题数 | 通过题数 | 提交次数 |\n|---|---|---|---|\n");
        for (Map<String, Object> row : vo.getDifficultyStats()) {
            sb.append("| ").append(row.get("difficulty")).append(" | ")
                    .append(StatsUtil.asLong(row.get("attempted"))).append(" | ")
                    .append(StatsUtil.asLong(row.get("accepted"))).append(" | ")
                    .append(StatsUtil.asLong(row.get("submits"))).append(" |\n");
        }

        sb.append("\n### 错误归因（提交状态分布）\n| 状态 | 次数 |\n|---|---|\n");
        for (Map<String, Object> row : vo.getStatusStats()) {
            sb.append("| ").append(friendlyStatus(String.valueOf(row.get("status")))).append(" | ")
                    .append(StatsUtil.asLong(row.get("cnt"))).append(" |\n");
        }

        sb.append("\n### 错误 × 难度\n| 难度 | 状态 | 次数 |\n|---|---|---|\n");
        for (Map<String, Object> row : vo.getStatusByDifficulty()) {
            sb.append("| ").append(row.get("difficulty")).append(" | ")
                    .append(friendlyStatus(String.valueOf(row.get("status")))).append(" | ")
                    .append(StatsUtil.asLong(row.get("cnt"))).append(" |\n");
        }

        sb.append("\n### 活跃时段（提交次数）\n");
        for (Map<String, Object> row : vo.getHourStats()) {
            sb.append(StatsUtil.asInt(row.get("hour"))).append(" 点 ").append(StatsUtil.asLong(row.get("cnt")))
                    .append(" 次；");
        }

        sb.append("\n\n### 进步曲线（每日提交/通过）\n| 日期 | 提交 | 通过 |\n|---|---|---|\n");
        for (Map<String, Object> row : vo.getTrend()) {
            sb.append("| ").append(row.get("day")).append(" | ").append(StatsUtil.asLong(row.get("total")))
                    .append(" | ").append(StatsUtil.asLong(row.get("accepted"))).append(" |\n");
        }

        if (!vo.getWeakTags().isEmpty()) {
            sb.append("\n（系统算出的薄弱标签：").append(String.join("、", vo.getWeakTags())).append("）\n");
        }
        return sb.toString();
    }

    public static String friendlyStatus(String status) {
        if (status == null) {
            return "未知";
        }
        switch (status) {
            case "ACCEPTED":
                return "AC 通过";
            case "WRONG_ANSWER":
                return "WA 答案错误";
            case "TIME_LIMIT_EXCEEDED":
                return "TLE 超时";
            case "RUNTIME_ERROR":
                return "RE 运行错误";
            case "COMPILE_ERROR":
                return "CE 编译错误";
            case "MEMORY_LIMIT_EXCEEDED":
                return "MLE 内存超限";
            case "OUTPUT_LIMIT_EXCEEDED":
                return "OLE 输出超限";
            case "SECURITY_ERROR":
                return "安全策略拦截";
            default:
                return status;
        }
    }

}
