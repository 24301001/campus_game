package com.coding.platform.controller;

import com.coding.platform.common.Result;
import com.coding.platform.dto.CompileDTO;
import com.coding.platform.service.JudgeService;
import com.coding.platform.vo.CompileResultVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/judge")
public class JudgeController {

    @Autowired
    private JudgeService judgeService;

    @PostMapping("/compile")
    public Result<CompileResultVO> compileAndJudge(Authentication authentication, @Valid @RequestBody CompileDTO compileDTO) {
        Long userId = null;
        if (authentication != null && authentication.getPrincipal() != null) {
            userId = (Long) authentication.getPrincipal();
        }
        CompileResultVO result = judgeService.compileAndJudge(userId, compileDTO);
        return Result.success(result);
    }

    /** 判题机支持哪些语言、这台机器上哪些真能跑（含默认模板，前端直接拿来用） */
    @GetMapping("/languages")
    public Result<List<Map<String, Object>>> languages() {
        return Result.success(judgeService.listLanguages());
    }

}
