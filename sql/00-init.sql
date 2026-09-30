-- =============================================
-- 在线编程刷题与学习管理系统 - 数据库初始化脚本
-- 数据库名称：coding_platform
-- =============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS coding_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE coding_platform;

-- =============================================
-- 1. 用户表 (user)
-- =============================================
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `password` VARCHAR(255) NOT NULL COMMENT '密码',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
    `role` VARCHAR(20) NOT NULL DEFAULT 'USER' COMMENT '角色：USER-普通用户，ADMIN-管理员',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    `total_problems` INT NOT NULL DEFAULT 0 COMMENT '总提交题数',
    `accepted_problems` INT NOT NULL DEFAULT 0 COMMENT '通过题数',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    KEY `idx_email` (`email`),
    KEY `idx_role` (`role`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =============================================
-- 2. 题目分类表 (category)
-- =============================================
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
    `description` VARCHAR(255) DEFAULT NULL COMMENT '分类描述',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目分类表';

-- =============================================
-- 3. 题目表 (problem)
-- =============================================
DROP TABLE IF EXISTS `problem`;
CREATE TABLE `problem` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '题目ID',
    `title` VARCHAR(200) NOT NULL COMMENT '题目标题',
    `description` TEXT COMMENT '题目描述',
    `input_description` TEXT COMMENT '输入描述',
    `output_description` TEXT COMMENT '输出描述',
    `sample_input` TEXT COMMENT '示例输入',
    `sample_output` TEXT COMMENT '示例输出',
    `difficulty` VARCHAR(20) NOT NULL DEFAULT 'EASY' COMMENT '难度：EASY-简单，MEDIUM-中等，HARD-困难',
    `category_id` BIGINT DEFAULT NULL COMMENT '分类ID',
    `time_limit` INT NOT NULL DEFAULT 1000 COMMENT '时间限制（毫秒）',
    `memory_limit` INT NOT NULL DEFAULT 64 COMMENT '内存限制（MB）',
    `template_code` TEXT COMMENT '模板代码',
    `answer_code` TEXT COMMENT '答案代码',
    `solution` TEXT COMMENT '题解',
    `submit_count` INT NOT NULL DEFAULT 0 COMMENT '提交次数',
    `accept_count` INT NOT NULL DEFAULT 0 COMMENT '通过次数',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_difficulty` (`difficulty`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_status` (`status`),
    CONSTRAINT `fk_problem_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目表';

-- =============================================
-- 4. 提交记录表 (submit_record)
-- =============================================
DROP TABLE IF EXISTS `submit_record`;
CREATE TABLE `submit_record` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '提交ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `problem_id` BIGINT NOT NULL COMMENT '题目ID',
    `code` TEXT NOT NULL COMMENT '提交的代码',
    `language` VARCHAR(20) NOT NULL DEFAULT 'JAVA' COMMENT '编程语言',
    `status` VARCHAR(50) NOT NULL COMMENT '状态：ACCEPTED-通过，WRONG_ANSWER-答案错误，COMPILE_ERROR-编译错误，RUNTIME_ERROR-运行时错误，TIME_LIMIT_EXCEEDED-超时',
    `time_used` INT DEFAULT NULL COMMENT '运行时间（毫秒）',
    `memory_used` INT DEFAULT NULL COMMENT '内存使用（KB）',
    `error_message` TEXT COMMENT '错误信息',
    `output` TEXT COMMENT '运行输出',
    `expected_output` TEXT COMMENT '预期输出',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_problem_id` (`problem_id`),
    KEY `idx_status` (`status`),
    KEY `idx_create_time` (`create_time`),
    CONSTRAINT `fk_submit_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_submit_problem` FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='提交记录表';

-- =============================================
-- 5. 收藏表 (collect)
-- =============================================
DROP TABLE IF EXISTS `collect`;
CREATE TABLE `collect` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `problem_id` BIGINT NOT NULL COMMENT '题目ID',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_problem` (`user_id`, `problem_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_problem_id` (`problem_id`),
    CONSTRAINT `fk_collect_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_collect_problem` FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- =============================================
-- 6. 笔记表 (note)
-- =============================================
DROP TABLE IF EXISTS `note`;
CREATE TABLE `note` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '笔记ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `problem_id` BIGINT NOT NULL COMMENT '题目ID',
    `content` TEXT COMMENT '笔记内容',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_problem` (`user_id`, `problem_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_problem_id` (`problem_id`),
    CONSTRAINT `fk_note_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_note_problem` FOREIGN KEY (`problem_id`) REFERENCES `problem` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='笔记表';

-- =============================================
-- 7. 系统日志表 (sys_log)
-- =============================================
DROP TABLE IF EXISTS `sys_log`;
CREATE TABLE `sys_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '日志ID',
    `user_id` BIGINT DEFAULT NULL COMMENT '用户ID',
    `username` VARCHAR(50) DEFAULT NULL COMMENT '用户名',
    `operation` VARCHAR(100) DEFAULT NULL COMMENT '操作',
    `method` VARCHAR(200) DEFAULT NULL COMMENT '请求方法',
    `params` TEXT DEFAULT NULL COMMENT '请求参数',
    `time` BIGINT DEFAULT NULL COMMENT '执行时长（毫秒）',
    `ip` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统日志表';

-- =============================================
-- 初始化数据
-- =============================================

-- 初始化管理员用户（密码：admin123）
INSERT INTO `user` (`username`, `password`, `email`, `nickname`, `role`, `status`) VALUES
('admin', 'admin123', 'admin@coding.com', '管理员', 'ADMIN', 1);

-- 初始化普通用户（密码：user123）
INSERT INTO `user` (`username`, `password`, `email`, `nickname`, `role`, `status`) VALUES
('user', 'user123', 'user@coding.com', '刷题者', 'USER', 1);

-- 初始化题目分类
INSERT INTO `category` (`name`, `description`, `sort_order`) VALUES
('算法', '算法相关题目', 1),
('数据结构', '数据结构相关题目', 2),
('Java基础', 'Java语言基础题目', 3),
('SQL', 'SQL数据库题目', 4);

-- 初始化示例题目
INSERT INTO `problem` (`title`, `description`, `input_description`, `output_description`, `sample_input`, `sample_output`, `difficulty`, `category_id`, `template_code`, `answer_code`, `solution`) VALUES
('两数之和', '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。', '第一行输入数组长度n，第二行输入n个整数，第三行输入target。', '输出两个整数，用空格隔开，表示两个数的下标。', '4\n2 7 11 15\n9', '0 1', 'EASY', 1,
'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) {\n            nums[i] = scanner.nextInt();\n        }\n        int target = scanner.nextInt();\n        \n        // 在这里编写你的代码\n        \n        scanner.close();\n    }\n}',
'import java.util.Scanner;\nimport java.util.HashMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) {\n            nums[i] = scanner.nextInt();\n        }\n        int target = scanner.nextInt();\n        \n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                System.out.println(map.get(complement) + \" \" + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n        \n        scanner.close();\n    }\n}',
'使用哈希表可以在O(n)时间复杂度内解决问题。'),
('斐波那契数列', '求斐波那契数列的第n项。', '输入一个整数n。', '输出斐波那契数列的第n项。', '10', '55', 'EASY', 1,
'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        \n        // 在这里编写你的代码\n        \n        scanner.close();\n    }\n}',
'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        \n        if (n <= 1) {\n            System.out.println(n);\n            scanner.close();\n            return;\n        }\n        \n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int temp = b;\n            b = a + b;\n            a = temp;\n        }\n        System.out.println(b);\n        \n        scanner.close();\n    }\n}',
'使用迭代的方式计算斐波那契数列，避免递归的栈溢出问题。'),
('反转链表', '给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。', '输入链表长度n和n个整数。', '输出反转后的链表。', '5\n1 2 3 4 5', '5 4 3 2 1', 'MEDIUM', 2,
'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = scanner.nextInt();\n        }\n        \n        // 在这里编写你的代码\n        \n        scanner.close();\n    }\n}',
'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = scanner.nextInt();\n        }\n        \n        for (int i = n - 1; i >= 0; i--) {\n            System.out.print(arr[i] + (i == 0 ? \"\\n\" : \" \"));\n        }\n        \n        scanner.close();\n    }\n}',
'使用双指针法进行链表反转。');
