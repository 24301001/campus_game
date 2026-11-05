package com.coding.platform.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 算法哥题单
 */
@Data
@TableName("agent_plan")
public class AgentPlan implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    /** 备赛 / 面试 / 补短板 / 保持手感 */
    private String goal;

    private Integer dailyCount;

    private Integer days;

    private String summary;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}
