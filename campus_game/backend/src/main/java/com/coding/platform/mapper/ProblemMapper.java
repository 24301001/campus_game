package com.coding.platform.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.coding.platform.entity.Problem;
import com.coding.platform.vo.ProblemSimilarVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ProblemMapper extends BaseMapper<Problem> {

    /** 相似题目：题目详情页和算法哥推荐共用同一份数据 */
    @Select("SELECT q.id AS id, q.title AS title, q.difficulty AS difficulty, " +
            "c.name AS category, s.reason AS reason " +
            "FROM problem_similar s " +
            "JOIN problem q ON q.id = s.similar_problem_id " +
            "LEFT JOIN category c ON c.id = q.category_id " +
            "WHERE s.problem_id = #{problemId} ORDER BY s.sort_order")
    List<ProblemSimilarVO> selectSimilarProblems(@Param("problemId") Long problemId);

}
