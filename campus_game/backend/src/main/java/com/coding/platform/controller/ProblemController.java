package com.coding.platform.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.coding.platform.common.Result;
import com.coding.platform.entity.Problem;
import com.coding.platform.service.ProblemService;
import com.coding.platform.vo.ProblemSimilarVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/problem")
public class ProblemController {

    @Autowired
    private ProblemService problemService;

    @GetMapping("/list")
    public Result<IPage<Problem>> getProblemList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long companyId,
            @RequestParam(name = "tagIds", required = false) List<Long> tagIds,
            @RequestParam(name = "tagIds[]", required = false) List<Long> tagIdsArr) {
        List<Long> finalTagIds = (tagIds != null && !tagIds.isEmpty()) ? tagIds : tagIdsArr;
        Page<Problem> page = new Page<>(pageNum, pageSize);
        IPage<Problem> result = problemService.getProblemPage(page, categoryId, difficulty, keyword, finalTagIds, companyId);
        return Result.success(result);
    }

    @GetMapping("/detail/{id}")
    public Result<Problem> getProblemDetail(@PathVariable Long id) {
        Problem problem = problemService.getProblemDetail(id);
        return Result.success(problem);
    }

    /** 相似题目：给这道题挂的那几道同类题 */
    @GetMapping("/similar/{id}")
    public Result<List<ProblemSimilarVO>> getSimilarProblems(@PathVariable Long id) {
        return Result.success(problemService.getSimilarProblems(id));
    }

}
