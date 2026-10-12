package com.coding.platform.service;

import com.coding.platform.dto.CompileDTO;
import com.coding.platform.vo.CompileResultVO;

import java.util.List;
import java.util.Map;

public interface JudgeService {

    CompileResultVO compileAndJudge(Long userId, CompileDTO compileDTO);

    /**
     * 判题机支持的语言 + 这台机器上是否真的能跑。
     * 前端据此只展示可用的语言 —— 不然用户提交完才发现"工具链没装"。
     */
    List<Map<String, Object>> listLanguages();

}
