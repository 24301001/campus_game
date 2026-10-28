package com.coding.platform.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 玩家形象档案（{@code mp_player}，任务书 §5.2 第⑤张表）。
 *
 * 主键就是账号 id（一个人一行），所以 {@code @TableId(type = INPUT)} ——
 * 不能让 MyBatis-Plus 自增，它自增的是自己的序列，和 {@code user.id} 没关系。
 *
 * ⚠️ 这张表里**没有**学号、真实姓名、手机号、邮箱这些列（§10.6 红线 1）。
 * 没有字段，就没有"哪次上线忘了过滤"的事故。
 */
@Data
@TableName("mp_player")
public class MpPlayer implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.INPUT)
    private Long userId;

    /** 🔒 注册名，不可改：公告与聊天的署名就是它（§10.3）。 */
    private String nickname;

    /** 形象配方 JSON 文本，几字节，**不存图片**（§8.4 / §8.7）。 */
    private String lookJson;

    private String bio;

    private String college;

    private String grade;

    /** 兴趣标签，JSON 数组文本，≤5 个、每个 ≤6 字。 */
    private String tags;

    /** 主页可见性 JSON，形如 {@code {"bio":false,"grade":false}}；缺省即公开。 */
    private String privacyJson;

    private Integer lastX;

    private Integer lastY;

    private String lastScene;

    private LocalDateTime updatedAt;
}
