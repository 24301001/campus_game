package com.coding.platform.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * 算法哥对一次操作事件的反应。
 */
@Data
public class AgentEventVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 这次要不要开口 */
    private boolean speak;

    /** 要说的话（快通道，模板生成，毫秒级） */
    private String text;

    /** 语气：praise 夸 / tease 嘲讽 / remind 提醒 / warn 警告 / hint 给路 */
    private String tone;

    /** 值得再走一次大模型做详细点评（前端可再调 /agent/event/follow） */
    private boolean followUp;

    private String eventType;

    /** 被节流压下去时给个原因，方便调参 */
    private String reason;

}
