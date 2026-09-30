package com.coding.platform.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 前端上报的「操作事件」——算法哥就是靠这些事件看得见你在干什么。
 */
@Data
public class AgentEventDTO {

    @NotBlank(message = "事件类型不能为空")
    private String type;

    /** 当前在做的题（没有就为空） */
    private Long problemId;

    /** 附加信息，例如粘贴的字符数、编辑次数、停留秒数 */
    private String detail;

    /** 附加数值，配合 detail 用 */
    private Integer value;

    /** 话痨档：quiet 安静 / normal 克制 / chatty 活跃（不传按 normal） */
    private String mode;

}
