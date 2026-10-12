USE coding_platform;

-- 创建标签表
CREATE TABLE IF NOT EXISTS tag (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '标签ID',
    name VARCHAR(50) NOT NULL COMMENT '标签名称',
    description VARCHAR(255) DEFAULT NULL COMMENT '标签描述',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- 创建题目-标签关联表
CREATE TABLE IF NOT EXISTS problem_tag (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
    problem_id BIGINT NOT NULL COMMENT '题目ID',
    tag_id BIGINT NOT NULL COMMENT '标签ID',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_problem_tag (problem_id, tag_id),
    KEY idx_problem_id (problem_id),
    KEY idx_tag_id (tag_id),
    CONSTRAINT fk_pt_problem FOREIGN KEY (problem_id) REFERENCES problem(id) ON DELETE CASCADE,
    CONSTRAINT fk_pt_tag FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目-标签关联表';

-- 插入标签数据
INSERT INTO tag (name, description, sort_order) VALUES
('数组', '数组相关题目', 1),
('字符串', '字符串相关题目', 2),
('哈希表', '哈希表相关题目', 3),
('链表', '链表相关题目', 4),
('双指针', '双指针相关题目', 5),
('栈', '栈相关题目', 6),
('队列', '队列相关题目', 7),
('树', '树相关题目', 8),
('动态规划', '动态规划相关题目', 9),
('数学', '数学相关题目', 10);

-- 给现有题目添加标签
INSERT INTO problem_tag (problem_id, tag_id) VALUES
(1, 1), (1, 3), -- 两数之和：数组、哈希表
(2, 9), (2, 10), -- 斐波那契数列：动态规划、数学
(3, 4), (3, 5); -- 反转链表：链表、双指针
