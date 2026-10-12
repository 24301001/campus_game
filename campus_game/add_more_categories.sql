-- 增加更多分类标签
INSERT IGNORE INTO category (name, description, create_time, update_time)
VALUES 
('数组', '数组相关题目', NOW(), NOW()),
('字符串', '字符串处理题目', NOW(), NOW()),
('链表', '链表相关题目', NOW(), NOW()),
('树', '二叉树、多叉树等题目', NOW(), NOW()),
('图论', '图论算法题目', NOW(), NOW()),
('动态规划', '动态规划题目', NOW(), NOW()),
('贪心算法', '贪心算法题目', NOW(), NOW()),
('回溯算法', '回溯算法题目', NOW(), NOW()),
('二分查找', '二分查找算法题目', NOW(), NOW()),
('排序算法', '排序算法题目', NOW(), NOW()),
('位运算', '位运算相关题目', NOW(), NOW()),
('数学', '数学相关题目', NOW(), NOW()),
('设计模式', '设计模式题目', NOW(), NOW()),
('数据库', '数据库设计和优化题目', NOW(), NOW()),
('网络', '计算机网络题目', NOW(), NOW()),
('操作系统', '操作系统题目', NOW(), NOW()),
('面向对象', '面向对象编程题目', NOW(), NOW()),
('函数式编程', '函数式编程题目', NOW(), NOW()),
('并发编程', '并发和多线程题目', NOW(), NOW()),
('分布式系统', '分布式系统题目', NOW(), NOW());

-- 输出总分类数
SELECT COUNT(*) AS total_categories FROM category;