package com.coding.platform.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 分级提示使用记录：算法哥记得你卡在哪一档
 */
@Data
@TableName("agent_hint_log")
public class AgentHintLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long problemId;

    /** 提示档位 1~4 */
    private Integer level;

    private LocalDateTime createTime;

}
