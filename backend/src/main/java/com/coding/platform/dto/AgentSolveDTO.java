package com.coding.platform.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 「让算法哥替我写」的请求：哪道题、用什么语言写。
 */
@Data
public class AgentSolveDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 题目 id */
    private Long problemId;

    /** 语言标识（JAVA / CPP / C / PYTHON / JAVASCRIPT），不传按 Java 写 */
    private String language;
}
