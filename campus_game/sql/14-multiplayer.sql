-- =============================================
-- 二期 · 多人联机的六张新表 + 账号表补丁
-- =============================================
-- 依据：2期开发任务书.md §5.1 / §5.2
--
-- 说明：
--   1. 二期**不新建账号表**，账号唯一真相源仍是 8081 的 `user` 表；
--      本脚本只给它补「昵称全服唯一」这一条约束。
--   2. 六张新表全部加 `mp_` 前缀，与一期表同库（coding_platform），互不动结构。
--   3. `mp_message` 一张表同时承担「实时私聊」和「离线留言」——没有第二套系统。
--   4. `mp_player.look_json` 存的是形象配方（几个字节），**不存图片**；
--      照片全程只在浏览器里处理，服务端永远收不到（任务书 §8.7）。
--   5. 可重复执行。
-- =============================================

-- ---------------------------------------------
-- 一、账号表补丁：昵称全服唯一
-- ---------------------------------------------
-- 现状：`user.username` 有 uk_username，`nickname` varchar(50) 可空、无唯一约束。
-- 后果：不补约束，公告栏会出现两个「张伟」（任务书 §5.1 的警告）。
--
-- 步骤：先把历史数据的空昵称填成登录名 → 再给重名的补上 #id 后缀 → 最后加唯一索引。
-- 二期注册收「昵称 + 密码」，代码里把同一个值同时写进 username 和 nickname，
-- 所以 uk_username 与 uk_nickname 指向同一个字符串，两条约束互不冲突。

UPDATE `user` SET `nickname` = `username`
 WHERE `nickname` IS NULL OR `nickname` = '';

UPDATE `user`
   SET `nickname` = CONCAT(`nickname`, '#', `id`)
 WHERE `id` NOT IN (
     SELECT `id` FROM (
         SELECT MIN(`id`) AS `id` FROM `user` GROUP BY `nickname`
     ) AS keep
 );

DROP PROCEDURE IF EXISTS `mp_add_user_nickname_unique`;
DELIMITER $$
CREATE PROCEDURE `mp_add_user_nickname_unique`()
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.STATISTICS
                    WHERE TABLE_SCHEMA = DATABASE()
                      AND TABLE_NAME = 'user'
                      AND INDEX_NAME = 'uk_nickname') THEN
        ALTER TABLE `user` ADD UNIQUE KEY `uk_nickname` (`nickname`);
    END IF;
END$$
DELIMITER ;
CALL `mp_add_user_nickname_unique`();
DROP PROCEDURE IF EXISTS `mp_add_user_nickname_unique`;

-- 昵称列收窄到 16 字（任务书 §5.1：2~16 字，允许中文）。
-- 只在历史数据已全部落在 16 字以内时才会成功；被截断的旧昵称会先报错而不是被偷偷改短。
ALTER TABLE `user` MODIFY COLUMN `nickname` VARCHAR(16)
    COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '登录昵称，2~16 字，全服唯一，注册后不可改';

-- ⚠️ 密码列本身不用改（varchar(255) 装得下 bcrypt 的 60 位），
--    但后端 SecurityConfig 现在是 NoOpPasswordEncoder（明文比较），
--    必须换成 BCrypt 才符合任务书 §5.1「明文永不落库」。见 W1 后端改造。

-- ---------------------------------------------
-- 二、六张 mp_ 新表
-- ---------------------------------------------

-- ① 一对一会话。a<b 归一化，保证 (甲,乙) 和 (乙,甲) 是同一条记录
CREATE TABLE IF NOT EXISTS `mp_session` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `user_a` BIGINT NOT NULL COMMENT '较小账号ID',
    `user_b` BIGINT NOT NULL COMMENT '较大账号ID',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `last_msg_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后一条消息时间',
    `last_preview` VARCHAR(64) NOT NULL DEFAULT '' COMMENT '会话列表里的最后一条摘要',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_pair` (`user_a`, `user_b`),
    KEY `idx_b` (`user_b`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='玩家一对一会话';

-- ② 私聊消息（实时与离线留言共用这一张表）
CREATE TABLE IF NOT EXISTS `mp_message` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `session_id` BIGINT NOT NULL COMMENT '所属会话 mp_session.id',
    `from_user` BIGINT NOT NULL COMMENT '发送人账号ID',
    `to_user` BIGINT NOT NULL COMMENT '接收人账号ID',
    `content` VARCHAR(500) NOT NULL COMMENT '正文，≤500 字，纯文本',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '发送时间（毫秒）',
    `read_at` DATETIME(3) DEFAULT NULL COMMENT '已读时间，NULL=未读',
    PRIMARY KEY (`id`),
    KEY `idx_session` (`session_id`, `id`),
    KEY `idx_to_unread` (`to_user`, `read_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='玩家私聊消息';

-- ③ 公告（全服广播，保留最新 50 条）
CREATE TABLE IF NOT EXISTS `mp_announcement` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `user_id` BIGINT NOT NULL COMMENT '发送人账号ID',
    `content` VARCHAR(200) NOT NULL COMMENT '正文，≤200 字，纯文本',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '0=正常 1=已删',
    PRIMARY KEY (`id`),
    KEY `idx_time` (`created_at`),
    KEY `idx_user_time` (`user_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='公告栏';

-- ④ 最后在线（网关进程重启后仍能显示「3 分钟前在线」）
CREATE TABLE IF NOT EXISTS `mp_presence` (
    `user_id` BIGINT NOT NULL COMMENT '账号ID',
    `last_seen` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次活跃时间',
    `last_scene` VARCHAR(32) NOT NULL DEFAULT 'out' COMMENT '最后所在场景ID',
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='最后在线';

-- ⑤ 玩家档案：昵称 + 形象配方 + 落点
CREATE TABLE IF NOT EXISTS `mp_player` (
    `user_id` BIGINT NOT NULL COMMENT '账号ID',
    `nickname` VARCHAR(16) NOT NULL COMMENT '登录名，不可改；公告/聊天显示的就是它',
    `look_json` VARCHAR(256) NOT NULL COMMENT '形象配方（任务书 §8.3），几字节，不存图',
    `bio` VARCHAR(80) NOT NULL DEFAULT '' COMMENT '个性签名，≤40 字',
    `college` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '学院（下拉选择）',
    `grade` VARCHAR(8) NOT NULL DEFAULT '' COMMENT '年级（下拉选择）',
    `tags` VARCHAR(128) NOT NULL DEFAULT '[]' COMMENT '兴趣标签，JSON 数组，≤5 个',
    `last_x` INT NOT NULL DEFAULT 0 COMMENT '上次落点 X（世界像素）',
    `last_y` INT NOT NULL DEFAULT 0 COMMENT '上次落点 Y（世界像素）',
    `last_scene` VARCHAR(32) NOT NULL DEFAULT 'out' COMMENT '上次所在场景',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='玩家形象档案';

-- ⑥ 四家票仓：一次登录换来的四张票（短期有效，过期由 8081 静默续）
CREATE TABLE IF NOT EXISTS `mp_ticket` (
    `user_id` BIGINT NOT NULL COMMENT '账号ID',
    `service` VARCHAR(16) NOT NULL COMMENT 'xbg/ld/cmr/agent',
    `ticket` VARCHAR(512) NOT NULL COMMENT '该家服务发给这个人的票据',
    `expires_at` DATETIME NOT NULL COMMENT '过期时间',
    PRIMARY KEY (`user_id`, `service`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='四家 NPC 服务票据';
