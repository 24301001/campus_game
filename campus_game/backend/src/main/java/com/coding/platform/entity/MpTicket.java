package com.coding.platform.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 四家票仓（{@code mp_ticket}，任务书 §5.2 第⑥张表）：一次登录换来的各家票据。
 *
 * 存的是**那家服务自己签给这个人**的票，不是主 JWT —— 所以 8081 退出时能拿它回头
 * 去各家把会话作废（§9.2 铁律 4「一次登出全退，不留残票」）。
 * 主键是 (user_id, service) 两列，MyBatis-Plus 按单列主键的假设处理不了，
 * 所以这里不声明 {@code @TableId}，读写一律走 QueryWrapper。
 */
@Data
@TableName("mp_ticket")
public class MpTicket implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableField("user_id")
    private Long userId;

    private String service;

    private String ticket;

    @TableField("expires_at")
    private LocalDateTime expiresAt;
}
