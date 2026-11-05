package com.coding.platform.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * 算法哥写完的代码：前端拿到之后在编辑器里一个字符一个字符敲出来。
 */
@Data
public class AgentSolveVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long problemId;

    private String problemTitle;

    private String language;

    /** 完整可提交的代码；为空说明这次没写出来 */
    private String code;

    /** 他写之前顺嘴说的一句（前端当台词显示） */
    private String note;
}
