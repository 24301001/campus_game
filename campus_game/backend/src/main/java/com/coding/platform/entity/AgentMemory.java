package com.coding.platform.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 算法哥的「账号级长期记忆」——一个账号一条。
 * <p>
 * 会话（agent_session / agent_message）本来就按 userId 隔离，所以「不同账号看不到对方的历史」
 * 是靠隔离保证的；这张表补的是另一半：跨会话的长期记忆。换了新对话，算法哥也能记得你
 * 常用什么语言、老在哪类题上栽跟头、在准备哪家面试。
 */
@Data
@TableName("agent_memory")
public class AgentMemory implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 一个账号只留一条 */
    private Long userId;

    /** 自然语言要点，由大模型在聊过几轮后归纳更新 */
    private String content;

    /** 累计消化的对话轮数，用来决定什么时候重新归纳 */
    private Integer turnCount;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}
