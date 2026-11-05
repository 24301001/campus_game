package com.coding.platform.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.Map;

@Data
public class AgentChatVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long sessionId;

    private Long messageId;

    /** 算法哥的回话（Markdown） */
    private String reply;

    /** 这一轮识别出的意图 */
    private String intent;

    /** 结构化附加数据：题目卡片 / 题单 / 学情数字，供前端渲染卡片 */
    private Map<String, Object> payload;

}
