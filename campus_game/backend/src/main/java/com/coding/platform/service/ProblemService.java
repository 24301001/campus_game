package com.coding.platform.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.coding.platform.entity.Problem;
import com.coding.platform.vo.ProblemSimilarVO;

import java.util.List;

public interface ProblemService extends IService<Problem> {

    IPage<Problem> getProblemPage(Page<Problem> page, Long categoryId, String difficulty, String keyword,
                                  List<Long> tagIds, Long companyId);

    Problem getProblemDetail(Long id);

    /** 相似题目：题库里事先算好挂上的那几道 */
    List<ProblemSimilarVO> getSimilarProblems(Long problemId);

}
