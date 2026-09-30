package com.coding.platform.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 算法哥题单条目
 */
@Data
@TableName("agent_plan_item")
public class AgentPlanItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long planId;

    private Long userId;

    /** 第几天，从 1 开始 */
    private Integer dayIndex;

    /** 当天第几题，从 1 开始 */
    private Integer orderIndex;

    private Long problemId;

    /** 入选理由 */
    private String reason;

    /** 是否已完成 */
    private Integer done;

    private LocalDateTime createTime;

}
