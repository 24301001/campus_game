-- 1. 删除英文标签
DELETE FROM tag WHERE name IN ('Array', 'String', 'Linked List', 'Hash Table', 'Dynamic Programming', 'Two Pointers', 'Binary Search', 'Greedy', 'Backtracking', 'Tree', 'Graph', 'Sorting', 'Heap', 'Stack', 'Queue', 'Math', 'Bit Manipulation');

-- 2. 增加更多分类标签（只添加不存在的）
INSERT IGNORE INTO category (name, description, create_time, update_time)
VALUES 
('算法', '算法相关题目', NOW(), NOW()),
('数据结构', '数据结构相关题目', NOW(), NOW()),
('SQL', '数据库SQL题目', NOW(), NOW()),
('Java基础', 'Java基础知识题目', NOW(), NOW()),
('C++基础', 'C++基础知识题目', NOW(), NOW()),
('Python基础', 'Python基础知识题目', NOW(), NOW()),
('前端开发', '前端开发相关题目', NOW(), NOW()),
('后端开发', '后端开发相关题目', NOW(), NOW()),
('系统设计', '系统设计相关题目', NOW(), NOW()),
('面试真题', '各大公司面试真题', NOW(), NOW());

-- 3. 将英文题目改成中文
UPDATE problem SET 
  title = '两数之和 II - 输入有序数组',
  description = '给定一个已按照 非递减顺序排列 的整数数组 numbers ，请你从数组中找出两个数满足相加之和等于目标数 target 。',
  difficulty = 'EASY'
WHERE title = 'Two Sum II - Input Array Is Sorted';

UPDATE problem SET 
  title = '删除排序数组中的重复项',
  description = '给你一个 升序排列 的数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。',
  difficulty = 'EASY'
WHERE title = 'Remove Duplicates from Sorted Array';

UPDATE problem SET 
  title = '移除元素',
  description = '给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素，并返回移除后数组的新长度。',
  difficulty = 'EASY'
WHERE title = 'Remove Element';

UPDATE problem SET 
  title = '实现 strStr()',
  description = '实现 strStr() 函数。给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回  -1 。',
  difficulty = 'EASY'
WHERE title = 'Implement strStr()';

UPDATE problem SET 
  title = '搜索插入位置',
  description = '给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。',
  difficulty = 'EASY'
WHERE title = 'Search Insert Position';

UPDATE problem SET 
  title = '最大子数组和',
  description = '给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。',
  difficulty = 'EASY'
WHERE title = 'Maximum Subarray';

UPDATE problem SET 
  title = '最后一个单词的长度',
  description = '给你一个字符串 s，由若干单词组成，单词前后用一些空格字符隔开。返回字符串中 最后一个 单词的长度。',
  difficulty = 'EASY'
WHERE title = 'Length of Last Word';

UPDATE problem SET 
  title = '加一',
  description = '给定一个由 整数 组成的 非空 数组所表示的非负整数，在该数的基础上加一。',
  difficulty = 'EASY'
WHERE title = 'Plus One';

UPDATE problem SET 
  title = '二进制求和',
  description = '给你两个二进制字符串，返回它们的和（用二进制表示）。',
  difficulty = 'EASY'
WHERE title = 'Add Binary';

UPDATE problem SET 
  title = 'x 的平方根',
  description = '给你一个非负整数 x ，计算并返回 x 的 算术平方根 。',
  difficulty = 'EASY'
WHERE title = 'Sqrt(x)';

UPDATE problem SET 
  title = '爬楼梯',
  description = '假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？',
  difficulty = 'EASY'
WHERE title = 'Climbing Stairs';

UPDATE problem SET 
  title = '合并两个有序链表',
  description = '将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。',
  difficulty = 'EASY'
WHERE title = 'Merge Two Sorted Lists';

UPDATE problem SET 
  title = '合并两个有序数组',
  description = '给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。',
  difficulty = 'EASY'
WHERE title = 'Merge Sorted Array';

UPDATE problem SET 
  title = '相同的树',
  description = '给你两棵二叉树的根节点 p 和 q ，编写一个函数来检验这两棵树是否相同。',
  difficulty = 'EASY'
WHERE title = 'Same Tree';

UPDATE problem SET 
  title = '对称二叉树',
  description = '给你一个二叉树的根节点 root ， 检查它是否轴对称。',
  difficulty = 'EASY'
WHERE title = 'Symmetric Tree';

-- 中等难度题目
UPDATE problem SET 
  title = '两数相加',
  description = '给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。',
  difficulty = 'MEDIUM'
WHERE title = 'Add Two Numbers';

UPDATE problem SET 
  title = '无重复字符的最长子串',
  description = '给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。',
  difficulty = 'MEDIUM'
WHERE title = 'Longest Substring Without Repeating Characters';

UPDATE problem SET 
  title = '最长回文子串',
  description = '给你一个字符串 s，找到 s 中最长的回文子串。',
  difficulty = 'MEDIUM'
WHERE title = 'Longest Palindromic Substring';

UPDATE problem SET 
  title = '整数反转',
  description = '给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。',
  difficulty = 'MEDIUM'
WHERE title = 'Reverse Integer';

UPDATE problem SET 
  title = '字符串转换整数 (atoi)',
  description = '请你来实现一个 myAtoi(string s) 函数，使其能将字符串转换成一个 32 位有符号整数（类似 C/C++ 中的 atoi 函数）。',
  difficulty = 'MEDIUM'
WHERE title = 'String to Integer (atoi)';

UPDATE problem SET 
  title = '回文数',
  description = '给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。',
  difficulty = 'MEDIUM'
WHERE title = 'Palindrome Number';

UPDATE problem SET 
  title = '盛最多水的容器',
  description = '给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。',
  difficulty = 'MEDIUM'
WHERE title = 'Container With Most Water';

UPDATE problem SET 
  title = '三数之和',
  description = '给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。',
  difficulty = 'MEDIUM'
WHERE title = '3Sum';

UPDATE problem SET 
  title = '最接近的三数之和',
  description = '给你一个长度为 n 的整数数组 nums 和 一个目标值 target。请你从 nums 中选出三个整数，使它们的和与 target 最接近。',
  difficulty = 'MEDIUM'
WHERE title = '3Sum Closest';

UPDATE problem SET 
  title = '电话号码的字母组合',
  description = '给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。',
  difficulty = 'MEDIUM'
WHERE title = 'Letter Combinations of a Phone Number';

UPDATE problem SET 
  title = '四数之和',
  description = '给你一个由 n 个整数组成的数组 nums ，和一个目标值 target 。请你找出所有和为 target 且不重复的四元组。',
  difficulty = 'MEDIUM'
WHERE title = '4Sum';

UPDATE problem SET 
  title = '删除链表的倒数第 N 个结点',
  description = '给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。',
  difficulty = 'MEDIUM'
WHERE title = 'Remove Nth Node From End of List';

UPDATE problem SET 
  title = '有效的括号',
  description = '给定一个只包括 ''('', '')'', ''{'', ''}'', ''['', '']'' 的字符串 s ，判断字符串是否有效。',
  difficulty = 'MEDIUM'
WHERE title = 'Valid Parentheses';

UPDATE problem SET 
  title = '合并K个升序链表',
  description = '给你一个链表数组，每个链表都已经按升序排列。请你将所有链表合并到一个升序链表中，返回合并后的链表。',
  difficulty = 'MEDIUM'
WHERE title = 'Merge k Sorted Lists' AND difficulty = 'MEDIUM';

UPDATE problem SET 
  title = '下一个排列',
  description = '整数数组的一个 排列  就是将其所有成员以序列或线性顺序排列。',
  difficulty = 'MEDIUM'
WHERE title = 'Next Permutation';

-- 困难难度题目
UPDATE problem SET 
  title = '正则表达式匹配',
  description = '给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 '' . '' 和 '' * '' 的正则表达式匹配。',
  difficulty = 'HARD'
WHERE title = 'Regular Expression Matching';

UPDATE problem SET 
  title = '合并K个升序链表',
  description = '给你一个链表数组，每个链表都已经按升序排列。请你将所有链表合并到一个升序链表中，返回合并后的链表。',
  difficulty = 'HARD'
WHERE title = 'Merge k Sorted Lists' AND difficulty = 'HARD';

UPDATE problem SET 
  title = 'K 个一组翻转链表',
  description = '给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。',
  difficulty = 'HARD'
WHERE title = 'Reverse Nodes in k-Group';

UPDATE problem SET 
  title = '最长有效括号',
  description = '给你一个只包含 ''('' 和 '')'' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。',
  difficulty = 'HARD'
WHERE title = 'Longest Valid Parentheses';

UPDATE problem SET 
  title = '接雨水',
  description = '给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。',
  difficulty = 'HARD'
WHERE title = 'Trapping Rain Water';

UPDATE problem SET 
  title = '编辑距离',
  description = '给你两个单词 word1 和 word2， 请返回将 word1 转换成 word2 所使用的最少操作数  。',
  difficulty = 'HARD'
WHERE title = 'Edit Distance';

UPDATE problem SET 
  title = '寻找两个正序数组的中位数',
  description = '给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。',
  difficulty = 'HARD'
WHERE title = 'Median of Two Sorted Arrays';

-- 4. 为题目分配分类
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '算法') WHERE difficulty = 'EASY';
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '算法') WHERE difficulty = 'MEDIUM';
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '算法') WHERE difficulty = 'HARD';

-- 5. 更新题目统计信息
UPDATE problem SET submit_count = FLOOR(RAND() * 1000), accept_count = FLOOR(RAND() * 500) WHERE id > 13;

-- 输出结果
SELECT COUNT(*) AS total_problems FROM problem;
SELECT COUNT(*) AS total_categories FROM category;
SELECT COUNT(*) AS total_tags FROM tag;