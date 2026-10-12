-- 修复乱码的题目标题
UPDATE problem 
SET title = '第一个字符',
    description = '找出字符串中的第一个不重复字符，并返回它的索引。如果不存在，则返回 -1。'
WHERE id = 6;

UPDATE problem 
SET title = '用栈实现队列',
    description = '请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作（push、pop、peek、empty）。'
WHERE id = 11;

UPDATE problem 
SET title = '删除链表节点',
    description = '给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。返回删除后的链表的头节点。'
WHERE id = 12;

UPDATE problem 
SET title = '滑动窗口',
    description = '给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。'
WHERE id = 16;

UPDATE problem 
SET title = '两数之和 II - 输入有序数组',
    description = '给定一个已按照 非递减顺序排列 的整数数组 numbers ，请你从数组中找出两个数满足相加之和等于目标数 target 。'
WHERE id = 17;

UPDATE problem 
SET title = '实现 strStr()',
    description = '给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回  -1 。'
WHERE id = 20;

UPDATE problem 
SET title = '最大子数组和',
    description = '给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。'
WHERE id = 22;

UPDATE problem 
SET title = '相同的树',
    description = '给你两棵二叉树的根节点 p 和 q ，编写一个函数来检验这两棵树是否相同。'
WHERE id = 30;

UPDATE problem 
SET title = '两数相加',
    description = '给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。请你将两个数相加，并以相同形式返回一个表示和的链表。'
WHERE id = 32;

UPDATE problem 
SET title = '无重复字符的最长子串',
    description = '给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。'
WHERE id = 33;

UPDATE problem 
SET title = '最长回文子串',
    description = '给你一个字符串 s，找到 s 中最长的回文子串。'
WHERE id = 34;

UPDATE problem 
SET title = '盛最多水的容器',
    description = '给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。'
WHERE id = 38;

UPDATE problem 
SET title = '电话号码的字母组合',
    description = '给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。'
WHERE id = 41;

UPDATE problem 
SET title = '删除链表的倒数第 N 个结点',
    description = '给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。'
WHERE id = 43;

UPDATE problem 
SET title = '合并K个升序链表',
    description = '给你一个链表数组，每个链表都已经按升序排列。请你将所有链表合并到一个升序链表中，返回合并后的链表。'
WHERE id = 45;

UPDATE problem 
SET title = '下一个排列',
    description = '整数数组的一个 排列  就是将其所有成员以序列或线性顺序排列。整数数组的 下一个排列 是指其整数的下一个字典序更大的排列。'
WHERE id = 46;

UPDATE problem 
SET title = '正则表达式匹配',
    description = '给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 ". " 和 "*" 的正则表达式匹配。'
WHERE id = 47;

UPDATE problem 
SET title = '合并K个升序链表',
    description = '给你一个链表数组，每个链表都已经按升序排列。请你将所有链表合并到一个升序链表中，返回合并后的链表。'
WHERE id = 48;

UPDATE problem 
SET title = 'K 个一组翻转链表',
    description = '给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。'
WHERE id = 49;

UPDATE problem 
SET title = '最长有效括号',
    description = '给你一个只包含 ". " 和 "*" 的字符串 s，找出最长有效（格式正确且连续）括号子串的长度。'
WHERE id = 50;

UPDATE problem 
SET title = '接雨水',
    description = '给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。'
WHERE id = 51;

UPDATE problem 
SET title = '编辑距离',
    description = '给你两个单词 word1 和 word2， 请返回将 word1 转换成 word2 所使用的最少操作数  。你可以对一个单词进行如下三种操作：插入一个字符、删除一个字符、替换一个字符。'
WHERE id = 52;

UPDATE problem 
SET title = '寻找两个正序数组的中位数',
    description = '给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。'
WHERE id = 53;

-- 为修复后的题目添加示例输入输出
UPDATE problem 
SET sample_input = 'leetcode',
    sample_output = '0'
WHERE id = 6;

UPDATE problem 
SET sample_input = '5\n1 2 3 4 5',
    sample_output = '1 2 3 4 5'
WHERE id = 11;

UPDATE problem 
SET sample_input = '4\n4 5 1 9\n5',
    sample_output = '4 1 9'
WHERE id = 12;

UPDATE problem 
SET sample_input = '8\n1 3 -1 -3 5 3 6 7\n3',
    sample_output = '3 3 5 5 6 7'
WHERE id = 16;

UPDATE problem 
SET sample_input = '4\n2 7 11 15\n9',
    sample_output = '1 2'
WHERE id = 17;

UPDATE problem 
SET sample_input = 'hello\nll',
    sample_output = '2'
WHERE id = 20;

UPDATE problem 
SET sample_input = '9\n-2 1 -3 4 -1 2 1 -5 4',
    sample_output = '6'
WHERE id = 22;

UPDATE problem 
SET sample_input = '3\n1 2 3\n3\n1 2 3',
    sample_output = 'true'
WHERE id = 30;

UPDATE problem 
SET sample_input = '3\n2 4 3\n3\n5 6 4',
    sample_output = '7 0 8'
WHERE id = 32;

UPDATE problem 
SET sample_input = 'abcabcbb',
    sample_output = '3'
WHERE id = 33;

UPDATE problem 
SET sample_input = 'babad',
    sample_output = 'bab'
WHERE id = 34;

UPDATE problem 
SET sample_input = '9\n1 8 6 2 5 4 8 3 7',
    sample_output = '49'
WHERE id = 38;

UPDATE problem 
SET sample_input = '23',
    sample_output = 'ad ae af bd be bf cd ce cf'
WHERE id = 41;

UPDATE problem 
SET sample_input = '5\n1 2 3 4 5\n2',
    sample_output = '1 2 3 5'
WHERE id = 43;

UPDATE problem 
SET sample_input = '3\n1 4 5\n1 3 4\n2 6',
    sample_output = '1 1 2 3 4 4 5 6'
WHERE id = 45;

UPDATE problem 
SET sample_input = '3\n1 2 3',
    sample_output = '1 3 2'
WHERE id = 46;

UPDATE problem 
SET sample_input = 'aa\na',
    sample_output = 'false'
WHERE id = 47;

UPDATE problem 
SET sample_input = '3\n1 4 5\n1 3 4\n2 6',
    sample_output = '1 1 2 3 4 4 5 6'
WHERE id = 48;

UPDATE problem 
SET sample_input = '5\n1 2 3 4 5\n2',
    sample_output = '2 1 4 3 5'
WHERE id = 49;

UPDATE problem 
SET sample_input = '(()',
    sample_output = '2'
WHERE id = 50;

UPDATE problem 
SET sample_input = '6\n0 1 0 2 1 0 1 3 2 1 2 1',
    sample_output = '6'
WHERE id = 51;

UPDATE problem 
SET sample_input = 'horse\nros',
    sample_output = '3'
WHERE id = 52;

UPDATE problem 
SET sample_input = '2\n1 3\n2',
    sample_output = '2.00000'
WHERE id = 53;

-- 输出最终结果
SELECT COUNT(*) as total_problems, COUNT(sample_input) as has_sample 
FROM problem 
WHERE sample_input IS NOT NULL AND sample_input != '';