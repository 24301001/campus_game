package com.coding.platform.mapper;

import com.coding.platform.vo.WrongProblemVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
 * 算法哥学情分析用的聚合查询。
 * <p>
 * 这里只做「确定性」的取数：题数、通过率、状态分布、排名都是 SQL 算出来的，
 * 不允许被大模型的幻觉影响，大模型只负责把这些数字讲成人话。
 */
@Mapper
public interface AgentStatsMapper {

    /** 标签画像：每个标签做了多少题、过了多少题 */
    @Select("SELECT t.id AS tagId, t.name AS name, " +
            "COUNT(DISTINCT s.problem_id) AS attempted, " +
            "COUNT(DISTINCT CASE WHEN s.status = 'ACCEPTED' THEN s.problem_id END) AS accepted " +
            "FROM submit_record s " +
            "JOIN problem_tag pt ON pt.problem_id = s.problem_id " +
            "JOIN tag t ON t.id = pt.tag_id " +
            "WHERE s.user_id = #{userId} " +
            "GROUP BY t.id, t.name")
    List<Map<String, Object>> selectTagStats(@Param("userId") Long userId);

    /** 难度画像 */
    @Select("SELECT p.difficulty AS difficulty, " +
            "COUNT(DISTINCT s.problem_id) AS attempted, " +
            "COUNT(DISTINCT CASE WHEN s.status = 'ACCEPTED' THEN s.problem_id END) AS accepted, " +
            "COUNT(*) AS submits " +
            "FROM submit_record s JOIN problem p ON p.id = s.problem_id " +
            "WHERE s.user_id = #{userId} " +
            "GROUP BY p.difficulty")
    List<Map<String, Object>> selectDifficultyStats(@Param("userId") Long userId);

    /** 错误归因：WA / TLE / RE / CE 各多少次 */
    @Select("SELECT status AS status, COUNT(*) AS cnt FROM submit_record " +
            "WHERE user_id = #{userId} GROUP BY status")
    List<Map<String, Object>> selectStatusStats(@Param("userId") Long userId);

    /** 错误归因交叉难度：哪一档难度上错得最多 */
    @Select("SELECT p.difficulty AS difficulty, s.status AS status, COUNT(*) AS cnt " +
            "FROM submit_record s JOIN problem p ON p.id = s.problem_id " +
            "WHERE s.user_id = #{userId} GROUP BY p.difficulty, s.status")
    List<Map<String, Object>> selectStatusByDifficulty(@Param("userId") Long userId);

    /** 习惯画像：活跃时段分布 */
    @Select("SELECT HOUR(create_time) AS hour, COUNT(*) AS cnt FROM submit_record " +
            "WHERE user_id = #{userId} GROUP BY HOUR(create_time) ORDER BY hour")
    List<Map<String, Object>> selectHourStats(@Param("userId") Long userId);

    /** 进步曲线：每天的提交数与通过数 */
    @Select("SELECT DATE_FORMAT(create_time, '%Y-%m-%d') AS day, COUNT(*) AS total, " +
            "SUM(CASE WHEN status = 'ACCEPTED' THEN 1 ELSE 0 END) AS accepted " +
            "FROM submit_record WHERE user_id = #{userId} " +
            "GROUP BY DATE_FORMAT(create_time, '%Y-%m-%d') ORDER BY day")
    List<Map<String, Object>> selectDailyTrend(@Param("userId") Long userId);

    /** 同一题反复 WA 的次数（判断是不是没读懂题就动手） */
    @Select("SELECT COUNT(*) FROM (SELECT problem_id FROM submit_record " +
            "WHERE user_id = #{userId} AND status = 'WRONG_ANSWER' " +
            "GROUP BY problem_id HAVING COUNT(*) >= 3) t")
    Long selectRepeatWaProblemCount(@Param("userId") Long userId);

    /** 已通过的不同题目数 */
    @Select("SELECT COUNT(DISTINCT problem_id) FROM submit_record " +
            "WHERE user_id = #{userId} AND status = 'ACCEPTED'")
    Long selectSolvedCount(@Param("userId") Long userId);

    /** 提交过的不同题目数 */
    @Select("SELECT COUNT(DISTINCT problem_id) FROM submit_record WHERE user_id = #{userId}")
    Long selectAttemptedCount(@Param("userId") Long userId);

    /** 总提交次数 */
    @Select("SELECT COUNT(*) FROM submit_record WHERE user_id = #{userId}")
    Long selectSubmitCount(@Param("userId") Long userId);

    /** 通过提交次数 */
    @Select("SELECT COUNT(*) FROM submit_record WHERE user_id = #{userId} AND status = 'ACCEPTED'")
    Long selectAcceptedSubmitCount(@Param("userId") Long userId);

    /** 有提交的天数 */
    @Select("SELECT COUNT(DISTINCT DATE(create_time)) FROM submit_record WHERE user_id = #{userId}")
    Long selectActiveDays(@Param("userId") Long userId);

    /** 我的排名：比我通过题数多的人 + 1 */
    @Select("SELECT COUNT(*) + 1 FROM `user` WHERE status = 1 AND accepted_problems > " +
            "(SELECT accepted_problems FROM `user` WHERE id = #{userId})")
    Long selectMyRank(@Param("userId") Long userId);

    /** 有效用户总数 */
    @Select("SELECT COUNT(*) FROM `user` WHERE status = 1")
    Long selectTotalUsers();

    /** 排在我前一名的人过了多少题（算「离上一名差几题」） */
    @Select("SELECT MIN(accepted_problems) FROM `user` WHERE status = 1 AND accepted_problems > " +
            "(SELECT accepted_problems FROM `user` WHERE id = #{userId})")
    Long selectNextAheadAccepted(@Param("userId") Long userId);

    /** 我自己的通过题数 */
    @Select("SELECT accepted_problems FROM `user` WHERE id = #{userId}")
    Long selectMyAccepted(@Param("userId") Long userId);

    /** 全局榜前 N */
    @Select("SELECT id AS userId, username AS username, nickname AS nickname, " +
            "accepted_problems AS acceptedProblems, score AS score " +
            "FROM `user` WHERE status = 1 ORDER BY accepted_problems DESC, id ASC LIMIT #{limit}")
    List<Map<String, Object>> selectTopUsers(@Param("limit") Integer limit);

    /** 分标签榜：该标签下每个用户过了多少题 */
    @Select("SELECT s.user_id AS userId, u.username AS username, u.nickname AS nickname, " +
            "COUNT(DISTINCT CASE WHEN s.status = 'ACCEPTED' THEN s.problem_id END) AS solved " +
            "FROM submit_record s " +
            "JOIN `user` u ON u.id = s.user_id " +
            "JOIN problem_tag pt ON pt.problem_id = s.problem_id " +
            "WHERE pt.tag_id = #{tagId} AND u.status = 1 " +
            "GROUP BY s.user_id, u.username, u.nickname " +
            "HAVING solved > 0 ORDER BY solved DESC LIMIT #{limit}")
    List<Map<String, Object>> selectTagRanking(@Param("tagId") Long tagId, @Param("limit") Integer limit);

    /** 同行坐标：这道题多少人试过、多少人过了 */
    @Select("SELECT COUNT(DISTINCT user_id) AS attempters, " +
            "COUNT(DISTINCT CASE WHEN status = 'ACCEPTED' THEN user_id END) AS solvers " +
            "FROM submit_record WHERE problem_id = #{problemId}")
    Map<String, Object> selectProblemPeerStats(@Param("problemId") Long problemId);

    /**
     * 错题本：他提交过、但至今一次都没 AC 过的题。
     * <p>
     * 判定标准就一条——没有 AC 记录。已经攻克的题不算错题，
     * 失败的次数按题目聚合，最近一次结果取时间最新的那条。
     */
    @Select("SELECT p.id AS id, p.title AS title, p.difficulty AS difficulty, " +
            "c.name AS category, COUNT(*) AS failCount, " +
            "SUBSTRING_INDEX(GROUP_CONCAT(s.status ORDER BY s.create_time DESC, s.id DESC), ',', 1) AS lastStatus, " +
            "MAX(s.create_time) AS lastTime " +
            "FROM submit_record s " +
            "JOIN problem p ON p.id = s.problem_id " +
            "LEFT JOIN category c ON c.id = p.category_id " +
            "WHERE s.user_id = #{userId} AND s.status <> 'ACCEPTED' " +
            "AND NOT EXISTS (SELECT 1 FROM submit_record a WHERE a.user_id = s.user_id " +
            "                AND a.problem_id = s.problem_id AND a.status = 'ACCEPTED') " +
            "GROUP BY p.id, p.title, p.difficulty, c.name " +
            "ORDER BY lastTime DESC LIMIT 60")
    List<WrongProblemVO> selectWrongProblems(@Param("userId") Long userId);

    /** 性能坐标：这道题通过的提交里，有多少比我的用时慢（算击败百分比） */
    @Select("SELECT COUNT(*) AS total, " +
            "SUM(CASE WHEN time_used > #{timeUsed} THEN 1 ELSE 0 END) AS slower " +
            "FROM submit_record WHERE problem_id = #{problemId} AND status = 'ACCEPTED'")
    Map<String, Object> selectProblemPerformance(@Param("problemId") Long problemId,
                                                @Param("timeUsed") Integer timeUsed);

    /** 每道题用过的最高提示档位（算法哥记得你卡在哪一档） */
    @Select("SELECT problem_id AS problemId, MAX(level) AS maxLevel, COUNT(*) AS cnt " +
            "FROM agent_hint_log WHERE user_id = #{userId} GROUP BY problem_id")
    List<Map<String, Object>> selectHintStats(@Param("userId") Long userId);

    /** 今天提交了几次（判断「今天还一题没交」） */
    @Select("SELECT COUNT(*) FROM submit_record WHERE user_id = #{userId} AND create_time >= CURDATE()")
    Long selectTodaySubmitCount(@Param("userId") Long userId);

    /** 今天的提交汇总：交了几次、AC 几次、涉及几道题 */
    @Select("SELECT COUNT(*) AS total, " +
            "SUM(CASE WHEN status = 'ACCEPTED' THEN 1 ELSE 0 END) AS accepted, " +
            "COUNT(DISTINCT problem_id) AS problems, " +
            "MIN(DATE_FORMAT(create_time, '%H:%i')) AS firstAt, " +
            "MAX(DATE_FORMAT(create_time, '%H:%i')) AS lastAt " +
            "FROM submit_record WHERE user_id = #{userId} AND create_time >= CURDATE()")
    Map<String, Object> selectTodaySummary(@Param("userId") Long userId);

    /** 今天的提交明细（带具体时间点，按时间正序） */
    @Select("SELECT DATE_FORMAT(s.create_time, '%H:%i') AS time, " +
            "s.problem_id AS problemId, p.title AS title, s.status AS status " +
            "FROM submit_record s LEFT JOIN problem p ON p.id = s.problem_id " +
            "WHERE s.user_id = #{userId} AND s.create_time >= CURDATE() " +
            "ORDER BY s.create_time ASC")
    List<Map<String, Object>> selectTodayRecords(@Param("userId") Long userId);

    /** 某道题的提交结果分布 */
    @Select("SELECT status AS status, COUNT(*) AS cnt FROM submit_record " +
            "WHERE user_id = #{userId} AND problem_id = #{problemId} GROUP BY status")
    List<Map<String, Object>> selectProblemStatusStats(@Param("userId") Long userId,
                                                      @Param("problemId") Long problemId);

}
