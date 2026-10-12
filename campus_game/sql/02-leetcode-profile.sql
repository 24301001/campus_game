-- =============================================
-- LeetCode风格个人中心功能增强 - 数据库迁移脚本
-- =============================================

USE coding_platform;

-- =============================================
-- 1. 用户表增加字段
-- =============================================
ALTER TABLE `user` ADD COLUMN `gender` VARCHAR(10) DEFAULT NULL COMMENT '性别' AFTER `avatar`;
ALTER TABLE `user` ADD COLUMN `ip_address` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址' AFTER `gender`;
ALTER TABLE `user` ADD COLUMN `score` INT NOT NULL DEFAULT 0 COMMENT '积分（做对一题+1）' AFTER `accepted_problems`;
ALTER TABLE `user` ADD COLUMN `easy_count` INT NOT NULL DEFAULT 0 COMMENT '简单题完成数' AFTER `score`;
ALTER TABLE `user` ADD COLUMN `medium_count` INT NOT NULL DEFAULT 0 COMMENT '中等题完成数' AFTER `easy_count`;
ALTER TABLE `user` ADD COLUMN `hard_count` INT NOT NULL DEFAULT 0 COMMENT '困难题完成数' AFTER `medium_count`;
ALTER TABLE `user` ADD COLUMN `view_count` INT NOT NULL DEFAULT 0 COMMENT '阅读题目总数' AFTER `hard_count`;
ALTER TABLE `user` ADD COLUMN `like_count` INT NOT NULL DEFAULT 0 COMMENT '获得的点赞总数' AFTER `view_count`;
ALTER TABLE `user` ADD COLUMN `followers_count` INT NOT NULL DEFAULT 0 COMMENT '关注者数量' AFTER `like_count`;
ALTER TABLE `user` ADD COLUMN `following_count` INT NOT NULL DEFAULT 0 COMMENT '关注数量' AFTER `followers_count`;
ALTER TABLE `user` ADD COLUMN `bio` VARCHAR(255) DEFAULT NULL COMMENT '个人简介' AFTER `following_count`;

-- =============================================
-- 2. 关注表 (follow)
-- =============================================
DROP TABLE IF EXISTS `follow`;
CREATE TABLE `follow` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '关注ID',
    `follower_id` BIGINT NOT NULL COMMENT '关注者ID',
    `following_id` BIGINT NOT NULL COMMENT '被关注者ID',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '关注时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_follower_following` (`follower_id`, `following_id`),
    KEY `idx_follower_id` (`follower_id`),
    KEY `idx_following_id` (`following_id`),
    CONSTRAINT `fk_follow_follower` FOREIGN KEY (`follower_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_follow_following` FOREIGN KEY (`following_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='关注表';

-- =============================================
-- 3. 题目阅读记录表 (problem_view)
-- =============================================
DROP TABLE IF EXISTS `problem_view`;
CREATE TABLE `problem_view` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '记录ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `problem_id` BIGINT NOT NULL COMMENT '题目ID',
    `view_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '阅读时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_problem_id` (`problem_id`),
    KEY `idx_view_time` (`view_time`),
    CONSTRAINT `fk_view_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_view_problem` FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目阅读记录表';

-- =============================================
-- 4. 评论点赞表 (comment_like)
-- =============================================
DROP TABLE IF EXISTS `comment_like`;
CREATE TABLE `comment_like` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `note_id` BIGINT NOT NULL COMMENT '评论/笔记ID',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_note` (`user_id`, `note_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_note_id` (`note_id`),
    CONSTRAINT `fk_like_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_like_note` FOREIGN KEY (`note_id`) REFERENCES `note` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论点赞表';

-- =============================================
-- 5. 修改笔记表为评论表，增加字段
-- =============================================
ALTER TABLE `note` ADD COLUMN `parent_id` BIGINT DEFAULT NULL COMMENT '父评论ID（用于回复）' AFTER `content`;
ALTER TABLE `note` ADD COLUMN `like_count` INT NOT NULL DEFAULT 0 COMMENT '点赞数' AFTER `parent_id`;
ALTER TABLE `note` ADD COLUMN `ip_address` VARCHAR(50) DEFAULT NULL COMMENT '发表时的IP' AFTER `like_count`;

-- 创建索引
CREATE INDEX idx_parent_id ON `note`(`parent_id`);
CREATE INDEX idx_like_count ON `note`(`like_count`);

-- =============================================
-- 6. 更新现有用户统计数据（可选）
-- =============================================

-- 为现有用户初始化分数（基于已通过的题目数）
UPDATE `user` u SET 
    u.score = u.accepted_problems,
    u.view_count = (
        SELECT COUNT(DISTINCT sr.problem_id) 
        FROM submit_record sr 
        WHERE sr.user_id = u.id
    ),
    u.easy_count = (
        SELECT COUNT(DISTINCT sr.problem_id) 
        FROM submit_record sr 
        JOIN problem p ON sr.problem_id = p.id 
        WHERE sr.user_id = u.id AND sr.status = 'ACCEPTED' AND p.difficulty = 'EASY'
    ),
    u.medium_count = (
        SELECT COUNT(DISTINCT sr.problem_id) 
        FROM submit_record sr 
        JOIN problem p ON sr.problem_id = p.id 
        WHERE sr.user_id = u.id AND sr.status = 'ACCEPTED' AND p.difficulty = 'MEDIUM'
    ),
    u.hard_count = (
        SELECT COUNT(DISTINCT sr.problem_id) 
        FROM submit_record sr 
        JOIN problem p ON sr.problem_id = p.id 
        WHERE sr.user_id = u.id AND sr.status = 'ACCEPTED' AND p.difficulty = 'HARD'
    );

-- 更新关注者数量缓存
UPDATE `user` u SET 
    u.followers_count = (SELECT COUNT(*) FROM follow f WHERE f.following_id = u.id),
    u.following_count = (SELECT COUNT(*) FROM follow f WHERE f.follower_id = u.id);

-- =============================================
-- 完成
-- =============================================
SELECT 'LeetCode风格个人中心功能增强 - 数据库迁移完成!' AS message;