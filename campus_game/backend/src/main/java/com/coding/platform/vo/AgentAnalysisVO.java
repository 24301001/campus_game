package com.coding.platform.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * 学情诊断结果：数字全部来自确定性 SQL 聚合，结论才由大模型表述。
 */
@Data
public class AgentAnalysisVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 提交过的题目数 */
    private Integer attemptedCount;

    /** 通过的题目数 */
    private Integer solvedCount;

    /** 总提交次数 */
    private Integer submitCount;

    /** 通过提交次数 */
    private Integer acceptedSubmitCount;

    /** 题目粒度通过率（通过的题 / 做过的题） */
    private Double solveRate;

    /** 提交粒度通过率（AC 提交 / 总提交） */
    private Double acceptRate;

    private Integer rank;

    private Integer totalUsers;

    /** 有提交的天数 */
    private Integer activeDays;

    /** 最长连续提交天数 */
    private Integer maxStreak;

    /** 标签画像：name / attempted / accepted / rate */
    private List<Map<String, Object>> tagStats;

    /** 薄弱标签（按通过率升序取前几） */
    private List<String> weakTags;

    /** 难度画像 */
    private List<Map<String, Object>> difficultyStats;

    /** 错误归因：状态分布 */
    private List<Map<String, Object>> statusStats;

    /** 错误归因交叉难度 */
    private List<Map<String, Object>> statusByDifficulty;

    /** 习惯画像：活跃时段 */
    private List<Map<String, Object>> hourStats;

    /** 进步曲线 */
    private List<Map<String, Object>> trend;

    /** 今天的提交汇总：total / accepted / problems / firstAt / lastAt */
    private Map<String, Object> todaySummary;

    /** 今天的提交明细：time / problemId / title / status */
    private List<Map<String, Object>> todayRecords;

    /** 同一题反复 WA 的题数 */
    private Integer repeatWaCount;

    /** 大模型给出的诊断与处方（Markdown） */
    private String conclusion;

}
