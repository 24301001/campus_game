-- =============================================
-- 算法哥的「账号记忆」
-- =============================================
-- 说明：
--   1. 一行对应一个账号 —— 每个账号都有自己的算法哥，记忆互不可见。
--   2. content 是算法哥对这位同学的长期记忆（自然语言要点）：常用语言、
--      常问/做错的题型、薄弱点、目标等；由大模型在聊过几轮后自动归纳更新。
--   3. 每次对话都会把这段记忆喂回给大模型，所以换了新会话他也还记得你。
--   4. 会话本身（agent_session / agent_message）本来就按 user_id 隔离，
--      这里只是补上「跨会话」的那部分记忆。
--   5. 可重复执行。
-- =============================================

CREATE TABLE IF NOT EXISTS `agent_memory` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `user_id` BIGINT NOT NULL COMMENT '账号ID（一个账号一条）',
    `content` MEDIUMTEXT COMMENT '算法哥对这个账号的长期记忆（自然语言要点）',
    `turn_count` INT NOT NULL DEFAULT 0 COMMENT '累计已消化的对话轮数，用来决定什么时候重新归纳',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='算法哥的账号级长期记忆';
