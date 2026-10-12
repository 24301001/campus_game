-- 为各个空分类添加题目

-- 为"动态规划"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('爬楼梯问题', '假设你正在爬楼梯，需要n阶才能到达楼顶，每次可以爬1或2个台阶，问有多少种不同的方法？', 'EASY', 120, 95, 30, NOW(), NOW()),
('最长公共子序列', '给定两个字符串，计算它们的最长公共子序列的长度。', 'MEDIUM', 85, 55, 30, NOW(), NOW()),
('背包问题', '给定物品的重量和价值，在背包容量限制下，求能获得的最大价值。', 'HARD', 50, 30, 30, NOW(), NOW()),
('最长递增子序列', '给定一个整数数组，找出其中最长的递增子序列的长度。', 'MEDIUM', 70, 45, 30, NOW(), NOW()),
('买卖股票的最佳时机', '给定一个数组，它的第i个元素是一支给定股票第i天的价格，计算你能获得的最大利润。', 'EASY', 110, 90, 30, NOW(), NOW());

-- 为"二分查找"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('二分查找基础', '实现二分查找算法，在有序数组中查找目标值。', 'EASY', 130, 110, 33, NOW(), NOW()),
('搜索插入位置', '给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。', 'EASY', 125, 105, 33, NOW(), NOW()),
('在排序数组中查找元素的第一个和最后一个位置', '给定一个排序数组和目标值，找出目标值在数组中开始和结束的位置。', 'MEDIUM', 75, 50, 33, NOW(), NOW()),
('搜索旋转排序数组', '假设按升序排序的数组在某个点上旋转，搜索目标值。', 'MEDIUM', 65, 40, 33, NOW(), NOW()),
('x的平方根', '实现int sqrt(int x)函数，计算并返回x的平方根。', 'EASY', 115, 95, 33, NOW(), NOW());

-- 为"贪心算法"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('分发饼干', '假设你要给孩子们分发饼干，每个孩子最多只能给一块饼干，求能满足的最大孩子数。', 'EASY', 100, 80, 31, NOW(), NOW()),
('跳跃游戏', '给定一个非负整数数组，你最初位于数组的第一个位置，问能否到达最后一个位置。', 'MEDIUM', 80, 55, 31, NOW(), NOW()),
('柠檬水找零', '在柠檬水摊上，每一杯柠檬水的售价是5美元，求能否正确找零。', 'EASY', 95, 85, 31, NOW(), NOW()),
('买卖股票的最佳时机II', '设计一个算法来计算你所能获取的最大利润，你可以尽可能完成更多交易。', 'MEDIUM', 85, 65, 31, NOW(), NOW()),
('分发糖果', '给一群孩子分糖果，每个孩子至少分配到一个糖果，求最少需要多少糖果。', 'HARD', 45, 25, 31, NOW(), NOW());

-- 为"回溯算法"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('全排列', '给定一个不含重复数字的数组，返回其所有可能的全排列。', 'MEDIUM', 75, 50, 32, NOW(), NOW()),
('子集', '给定一组不含重复元素的整数数组，返回该数组所有可能的子集。', 'MEDIUM', 80, 60, 32, NOW(), NOW()),
('组合总和', '给定一个无重复元素的数组和一个目标数，找出数组中所有可以使数字和为目标数的组合。', 'MEDIUM', 70, 45, 32, NOW(), NOW()),
('生成括号', '给出n代表生成括号的对数，生成所有可能并且有效的括号组合。', 'MEDIUM', 65, 40, 32, NOW(), NOW()),
('单词搜索', '给定一个二维网格和一个单词，找出该单词是否存在于网格中。', 'MEDIUM', 60, 35, 32, NOW(), NOW());

-- 为"排序算法"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('快速排序', '实现快速排序算法。', 'MEDIUM', 90, 65, 34, NOW(), NOW()),
('归并排序', '实现归并排序算法。', 'MEDIUM', 85, 60, 34, NOW(), NOW()),
('冒泡排序', '实现冒泡排序算法。', 'EASY', 120, 100, 34, NOW(), NOW()),
('选择排序', '实现选择排序算法。', 'EASY', 110, 90, 34, NOW(), NOW()),
('插入排序', '实现插入排序算法。', 'EASY', 115, 95, 34, NOW(), NOW());

-- 为"位运算"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('位1的个数', '编写一个函数，输入是一个无符号整数，返回其二进制表达式中数字位为1的个数。', 'EASY', 110, 90, 35, NOW(), NOW()),
('汉明距离', '两个整数之间的汉明距离指的是这两个数字对应二进制位不同的位置的数目。', 'EASY', 105, 85, 35, NOW(), NOW()),
('颠倒二进制位', '颠倒给定的32位无符号整数的二进制位。', 'EASY', 100, 80, 35, NOW(), NOW()),
('只出现一次的数字', '给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。', 'EASY', 115, 95, 35, NOW(), NOW()),
('数字范围按位与', '给定范围[m, n]，其中0 <= m <= n <= 2147483647，返回此范围内所有数字的按位与。', 'MEDIUM', 55, 35, 35, NOW(), NOW());

-- 为"数学"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('斐波那契数', '计算斐波那契数，F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)。', 'EASY', 120, 100, 36, NOW(), NOW()),
('罗马数字转整数', '给定一个罗马数字，将其转换成整数。', 'EASY', 130, 105, 36, NOW(), NOW()),
('整数反转', '给出一个32位的有符号整数，你需要将这个整数中每位上的数字进行反转。', 'EASY', 125, 95, 36, NOW(), NOW()),
('回文数', '判断一个整数是否是回文数。', 'EASY', 140, 115, 36, NOW(), NOW()),
('字符串相乘', '给定两个以字符串形式表示的非负整数，返回它们的乘积。', 'MEDIUM', 60, 40, 36, NOW(), NOW());

-- 为"树"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('二叉树的最大深度', '给定一个二叉树，找出其最大深度。', 'EASY', 115, 95, 28, NOW(), NOW()),
('二叉树的层序遍历', '给你一个二叉树，请你返回其按层序遍历得到的节点值。', 'MEDIUM', 80, 55, 28, NOW(), NOW()),
('二叉树的前序遍历', '给定一个二叉树，返回它的前序遍历。', 'EASY', 110, 90, 28, NOW(), NOW()),
('二叉树的中序遍历', '给定一个二叉树，返回它的中序遍历。', 'EASY', 105, 85, 28, NOW(), NOW()),
('对称二叉树', '给定一个二叉树，检查它是否是镜像对称的。', 'EASY', 120, 100, 28, NOW(), NOW());

-- 为"图论"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('岛屿数量', '给你一个由0和1组成的二维网格，请你计算网格中岛屿的数量。', 'MEDIUM', 70, 45, 29, NOW(), NOW()),
('课程表', '你这个学期必须选修numCourses门课程，问是否可能完成所有课程的学习。', 'MEDIUM', 60, 40, 29, NOW(), NOW()),
('克隆图', '给你无向连通图中一个节点的引用，请你返回该图的深拷贝。', 'MEDIUM', 55, 35, 29, NOW(), NOW()),
('单词接龙', '给定两个单词和一个字典，找出从起始单词到结束单词的最短转换序列长度。', 'HARD', 40, 20, 29, NOW(), NOW()),
('省份数量', '有n个城市，其中一些彼此相连，问有多少个省份。', 'MEDIUM', 65, 45, 29, NOW(), NOW());

-- 为"数据库"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('查找重复的电子邮箱', '编写一个SQL查询来查找表中所有重复的电子邮箱。', 'EASY', 100, 80, 38, NOW(), NOW()),
('第二高的薪水', '编写一个SQL查询，获取Employee表中第二高的薪水。', 'EASY', 95, 75, 38, NOW(), NOW()),
('删除重复的电子邮箱', '编写一个SQL查询来删除所有重复的电子邮箱。', 'MEDIUM', 70, 45, 38, NOW(), NOW()),
('上升的温度', '编写一个SQL查询，查找所有与之前的日期相比温度更高的日期的ID。', 'MEDIUM', 65, 40, 38, NOW(), NOW()),
('部门最高工资', '编写一个SQL查询，找出每个部门工资最高的员工。', 'MEDIUM', 60, 35, 38, NOW(), NOW());

-- 为"网络"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('TCP与UDP的区别', '请简述TCP和UDP协议的主要区别。', 'EASY', 110, 90, 39, NOW(), NOW()),
('HTTP和HTTPS的区别', '请简述HTTP和HTTPS协议的主要区别。', 'EASY', 105, 85, 39, NOW(), NOW()),
('HTTP方法详解', '请简述HTTP常见的请求方法（GET、POST、PUT、DELETE等）。', 'MEDIUM', 75, 50, 39, NOW(), NOW()),
('Cookie和Session的区别', '请简述Cookie和Session的主要区别和使用场景。', 'MEDIUM', 70, 45, 39, NOW(), NOW()),
('跨域问题', '请解释什么是跨域问题，以及常见的解决方法。', 'MEDIUM', 65, 40, 39, NOW(), NOW());

-- 为"操作系统"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('进程和线程的区别', '请简述进程和线程的主要区别。', 'EASY', 120, 100, 40, NOW(), NOW()),
('死锁的必要条件', '请简述死锁产生的四个必要条件。', 'EASY', 110, 90, 40, NOW(), NOW()),
('进程调度算法', '请简述常见的进程调度算法（FCFS、SJF、RR等）。', 'MEDIUM', 75, 50, 40, NOW(), NOW()),
('页面置换算法', '请简述常见的页面置换算法（FIFO、LRU、OPT等）。', 'MEDIUM', 70, 45, 40, NOW(), NOW()),
('银行家算法', '请简述银行家算法的原理和作用。', 'HARD', 45, 25, 40, NOW(), NOW());

-- 为"设计模式"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('单例模式', '请简述单例模式的概念、实现方式和使用场景。', 'EASY', 100, 80, 37, NOW(), NOW()),
('工厂模式', '请简述工厂模式的概念、分类和使用场景。', 'MEDIUM', 70, 45, 37, NOW(), NOW()),
('观察者模式', '请简述观察者模式的概念和使用场景。', 'MEDIUM', 65, 40, 37, NOW(), NOW()),
('策略模式', '请简述策略模式的概念和使用场景。', 'MEDIUM', 60, 35, 37, NOW(), NOW()),
('MVC模式', '请简述MVC模式的概念和各层的职责。', 'EASY', 110, 90, 37, NOW(), NOW());

-- 为"面向对象"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('面向对象三大特性', '请简述面向对象编程的三大特性（封装、继承、多态）。', 'EASY', 120, 100, 41, NOW(), NOW()),
('接口和抽象类的区别', '请简述接口和抽象类的主要区别。', 'MEDIUM', 75, 50, 41, NOW(), NOW()),
('重载和重写的区别', '请简述方法重载和方法重写的主要区别。', 'EASY', 115, 95, 41, NOW(), NOW()),
('this和super的区别', '请简述this和super关键字的区别和作用。', 'EASY', 110, 90, 41, NOW(), NOW()),
('继承关系', '请简述继承的概念、优点和缺点。', 'MEDIUM', 70, 45, 41, NOW(), NOW());

-- 为"函数式编程"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('函数式编程概念', '请简述函数式编程的主要概念和特点。', 'MEDIUM', 60, 35, 42, NOW(), NOW()),
('Lambda表达式', '请简述Lambda表达式的概念和用法。', 'MEDIUM', 65, 40, 42, NOW(), NOW()),
('Stream API', '请简述Java 8中Stream API的主要用法。', 'MEDIUM', 70, 45, 42, NOW(), NOW()),
('纯函数', '请简述纯函数的概念和特点。', 'EASY', 80, 60, 42, NOW(), NOW()),
('高阶函数', '请简述高阶函数的概念和使用场景。', 'MEDIUM', 55, 30, 42, NOW(), NOW());

-- 为"并发编程"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('synchronized关键字', '请简述synchronized关键字的作用和使用方法。', 'MEDIUM', 70, 45, 43, NOW(), NOW()),
('volatile关键字', '请简述volatile关键字的作用和原理。', 'MEDIUM', 65, 40, 43, NOW(), NOW()),
('线程池', '请简述线程池的概念、优点和常见实现。', 'MEDIUM', 75, 50, 43, NOW(), NOW()),
('CAS', '请简述CAS（Compare-And-Swap）的概念和原理。', 'HARD', 40, 20, 43, NOW(), NOW()),
('AQS', '请简述AQS（AbstractQueuedSynchronizer）的概念和作用。', 'HARD', 35, 15, 43, NOW(), NOW());

-- 为"分布式系统"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('CAP定理', '请简述CAP定理的概念和三个特性。', 'MEDIUM', 60, 35, 44, NOW(), NOW()),
('分布式事务', '请简述分布式事务的概念和常见解决方案。', 'HARD', 35, 15, 44, NOW(), NOW()),
('一致性哈希', '请简述一致性哈希算法的概念和应用场景。', 'MEDIUM', 55, 30, 44, NOW(), NOW()),
('负载均衡', '请简述负载均衡的概念、作用和常见算法。', 'MEDIUM', 65, 40, 44, NOW(), NOW()),
('微服务架构', '请简述微服务架构的概念、优点和缺点。', 'MEDIUM', 70, 45, 44, NOW(), NOW());

-- 为"面试真题"分类添加一些综合题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('如何学习编程', '请分享你学习编程的方法和经验。', 'EASY', 150, 130, 20, NOW(), NOW()),
('职业规划', '请谈谈你对未来3-5年的职业规划。', 'EASY', 140, 120, 20, NOW(), NOW()),
('项目经验', '请谈谈你参与过的最有挑战性的项目，以及你的贡献。', 'MEDIUM', 80, 55, 20, NOW(), NOW()),
('自我评价', '请谈谈你的优点和缺点，以及如何改进。', 'EASY', 130, 110, 20, NOW(), NOW()),
('为什么选择我们', '请谈谈你为什么想加入我们公司。', 'EASY', 125, 105, 20, NOW(), NOW());

-- 为"系统设计"分类添加题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('设计一个URL短链接系统', '请设计一个URL短链接系统，阐述你的设计思路。', 'HARD', 40, 20, 19, NOW(), NOW()),
('设计一个聊天系统', '请设计一个实时聊天系统，阐述你的设计思路。', 'HARD', 35, 15, 19, NOW(), NOW()),
('设计一个秒杀系统', '请设计一个高并发的秒杀系统，阐述你的设计思路。', 'HARD', 30, 10, 19, NOW(), NOW()),
('设计一个分布式缓存', '请设计一个分布式缓存系统，阐述你的设计思路。', 'HARD', 45, 25, 19, NOW(), NOW()),
('设计一个日志系统', '请设计一个大规模日志收集和分析系统，阐述你的设计思路。', 'HARD', 38, 18, 19, NOW(), NOW());

-- 为"算法"分类补充一些题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('两数之和', '给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。', 'EASY', 200, 160, 1, NOW(), NOW()),
('无重复字符的最长子串', '给定一个字符串，找出其中无重复字符的最长子串的长度。', 'MEDIUM', 100, 65, 1, NOW(), NOW()),
('最长回文子串', '给定一个字符串，找出其中最长的回文子串。', 'MEDIUM', 90, 55, 1, NOW(), NOW()),
('反转链表', '反转一个单链表。', 'EASY', 150, 130, 1, NOW(), NOW()),
('合并两个有序链表', '将两个升序链表合并为一个新的升序链表。', 'EASY', 140, 120, 1, NOW(), NOW());

-- 统计每个分类下的题目数量
SELECT c.id, c.name, COUNT(p.id) AS problem_count
FROM category c
LEFT JOIN problem p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY problem_count DESC;

-- 输出总题目数
SELECT COUNT(*) AS total_problems FROM problem;
