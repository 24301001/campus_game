-- 插入37道题目，使总题目数达到50道
-- 简单难度题目（15道）
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('Two Sum II - Input Array Is Sorted', 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Remove Duplicates from Sorted Array', 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Remove Element', 'Given an integer array nums and an integer val, remove all occurrences of val in nums in-place.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Implement strStr()', 'Implement strStr(). Return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Search Insert Position', 'Given a sorted array of distinct integers and a target value, return the index if the target is found.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Maximum Subarray', 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Length of Last Word', 'Given a string s consisting of words and spaces, return the length of the last word in the string.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Plus One', 'You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Add Binary', 'Given two binary strings a and b, return their sum as a binary string.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Sqrt(x)', 'Given a non-negative integer x, compute and return the square root of x.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Climbing Stairs', 'You are climbing a staircase. It takes n steps to reach the top.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Merge Two Sorted Lists', 'Merge two sorted linked lists and return it as a sorted list.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Merge Sorted Array', 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Same Tree', 'Given the roots of two binary trees p and q, write a function to check if they are the same or not.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Symmetric Tree', 'Given the root of a binary tree, check whether it is a mirror of itself.', 'EASY', 0, 0, 1, NOW(), NOW());

-- 中等难度题目（15道）
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('Add Two Numbers', 'You are given two non-empty linked lists representing two non-negative integers.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Longest Substring Without Repeating Characters', 'Given a string s, find the length of the longest substring without repeating characters.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Longest Palindromic Substring', 'Given a string s, return the longest palindromic substring in s.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Reverse Integer', 'Given a signed 32-bit integer x, return x with its digits reversed.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('String to Integer (atoi)', 'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Palindrome Number', 'Given an integer x, return true if x is a palindrome integer.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Container With Most Water', 'You are given an integer array height of length n.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('3Sum', 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('3Sum Closest', 'Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Letter Combinations of a Phone Number', 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('4Sum', 'Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that:', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Remove Nth Node From End of List', 'Given the head of a linked list, remove the nth node from the end of the list and return its head.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Valid Parentheses', 'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Merge k Sorted Lists', 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Next Permutation', 'A permutation of an array of integers is an arrangement of its members into a sequence or linear order.', 'MEDIUM', 0, 0, 1, NOW(), NOW());

-- 困难难度题目（7道）
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('Regular Expression Matching', 'Given an input string s and a pattern p, implement regular expression matching with support for '' . '' and '' * '' characters.', 'HARD', 0, 0, 1, NOW(), NOW()),
('Merge k Sorted Lists', 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.', 'HARD', 0, 0, 1, NOW(), NOW()),
('Reverse Nodes in k-Group', 'Given a linked list, reverse the nodes of a linked list k at a time and return its modified list.', 'HARD', 0, 0, 1, NOW(), NOW()),
('Longest Valid Parentheses', 'Given a string containing just the characters ''('' and '')'', find the length of the longest valid (well-formed) parentheses substring.', 'HARD', 0, 0, 1, NOW(), NOW()),
('Trapping Rain Water', 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', 'HARD', 0, 0, 1, NOW(), NOW()),
('Edit Distance', 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.', 'HARD', 0, 0, 1, NOW(), NOW()),
('Median of Two Sorted Arrays', 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.', 'HARD', 0, 0, 1, NOW(), NOW());

-- 添加更多标签
INSERT INTO tag (name, description, create_time, update_time)
VALUES 
('Array', 'Array related problems', NOW(), NOW()),
('String', 'String manipulation problems', NOW(), NOW()),
('Linked List', 'Linked list problems', NOW(), NOW()),
('Hash Table', 'Hash table and dictionary problems', NOW(), NOW()),
('Dynamic Programming', 'Dynamic programming problems', NOW(), NOW()),
('Two Pointers', 'Two pointers technique', NOW(), NOW()),
('Binary Search', 'Binary search algorithm', NOW(), NOW()),
('Greedy', 'Greedy algorithm problems', NOW(), NOW()),
('Backtracking', 'Backtracking problems', NOW(), NOW()),
('Tree', 'Binary tree and other tree problems', NOW(), NOW()),
('Graph', 'Graph theory problems', NOW(), NOW()),
('Sorting', 'Sorting algorithms', NOW(), NOW()),
('Heap', 'Heap and priority queue problems', NOW(), NOW()),
('Stack', 'Stack data structure problems', NOW(), NOW()),
('Queue', 'Queue data structure problems', NOW(), NOW()),
('Math', 'Mathematical problems', NOW(), NOW()),
('Bit Manipulation', 'Bit manipulation techniques', NOW(), NOW());

-- 为新题目添加标签
-- 先获取所有新插入题目的ID
SET @start_id = (SELECT MAX(id) FROM problem) - 36;
SET @end_id = (SELECT MAX(id) FROM problem);

-- 为简单题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, (SELECT id FROM tag WHERE name = 'Array') FROM problem WHERE id BETWEEN @start_id AND @start_id + 14;
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, (SELECT id FROM tag WHERE name = 'String') FROM problem WHERE id BETWEEN @start_id AND @start_id + 14;

-- 为中等题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, (SELECT id FROM tag WHERE name = 'Linked List') FROM problem WHERE id BETWEEN @start_id + 15 AND @start_id + 29;
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, (SELECT id FROM tag WHERE name = 'Hash Table') FROM problem WHERE id BETWEEN @start_id + 15 AND @start_id + 29;

-- 为困难题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, (SELECT id FROM tag WHERE name = 'Dynamic Programming') FROM problem WHERE id BETWEEN @start_id + 30 AND @end_id;
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, (SELECT id FROM tag WHERE name = 'Two Pointers') FROM problem WHERE id BETWEEN @start_id + 30 AND @end_id;

-- 更新题目统计信息
UPDATE problem SET submit_count = FLOOR(RAND() * 100), accept_count = FLOOR(RAND() * 100) WHERE id >= @start_id;

-- 输出总题目数和标签数
SELECT COUNT(*) AS total_problems FROM problem;
SELECT COUNT(*) AS total_tags FROM tag;