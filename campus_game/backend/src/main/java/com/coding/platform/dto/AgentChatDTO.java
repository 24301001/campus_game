package com.coding.platform.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class AgentChatDTO {

    /** 不传则自动新建会话 */
    private Long sessionId;

    @NotBlank(message = "说点什么吧")
    private String content;

    /** 当前在聊哪道题（分级提示、判题播报要用） */
    private Long problemId;

    /** 显式指定的提示档位 1~4，不传则由算法哥按已用档位往下走 */
    private Integer level;

}
