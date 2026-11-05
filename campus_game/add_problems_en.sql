-- Insert 37 problems to reach total 50 problems
-- Easy difficulty (15 problems)
INSERT INTO problem (title, content, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('Two Sum II - Input Array Is Sorted', 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Remove Duplicates from Sorted Array', 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Remove Element', 'Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. The relative order of the elements may be changed.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Implement strStr()', 'Implement strStr(). Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Search Insert Position', 'Given a sorted array of distinct integers and a target value, return the index if the target is found.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Maximum Subarray', 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Length of Last Word', 'Given a string s consisting of some words separated by some number of spaces, return the length of the last word in the string.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Plus One', 'You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Add Binary', 'Given two binary strings a and b, return their sum as a binary string.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Sqrt(x)', 'Given a non-negative integer x, compute and return the square root of x.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Climbing Stairs', 'You are climbing a staircase. It takes n steps to reach the top.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Merge Two Sorted Lists', 'Merge two sorted linked lists and return it as a sorted list.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Merge Sorted Array', 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Same Tree', 'Given the roots of two binary trees p and q, write a function to check if they are the same or not.', 'EASY', 0, 0, 1, NOW(), NOW()),
('Symmetric Tree', 'Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).', 'EASY', 0, 0, 1, NOW(), NOW());

-- Medium difficulty (15 problems)
INSERT INTO problem (title, content, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('Add Two Numbers', 'You are given two non-empty linked lists representing two non-negative integers.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Longest Substring Without Repeating Characters', 'Given a string s, find the length of the longest substring without repeating characters.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Longest Palindromic Substring', 'Given a string s, return the longest palindromic substring in s.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Reverse Integer', 'Given a signed 32-bit integer x, return x with its digits reversed.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('String to Integer (atoi)', 'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Palindrome Number', 'Given an integer x, return true if x is palindrome integer.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Container With Most Water', 'You are given an integer array height of length n.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('3Sum', 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('3Sum Closest', 'Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Letter Combinations of a Phone Number', 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('4Sum', 'Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that:', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Remove Nth Node From End of List', 'Given the head of a linked list, remove the nth node from the end of the list and return its head.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Valid Parentheses', 'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Merge k Sorted Lists', 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.', 'MEDIUM', 0, 0, 1, NOW(), NOW()),
('Next Permutation', 'A permutation of an array of integers is an arrangement of its members into a sequence or linear order.', 'MEDIUM', 0, 0, 1, NOW(), NOW());

-- Hard difficulty (7 problems)
INSERT INTO problem (title, content, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('Regular Expression Matching', 'Given an input string s and a pattern p, implement regular expression matching with support for ''.'' and ''*'' where:', 'HARD', 0, 0, 1, NOW(), NOW()),
('Merge k Sorted Lists', 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.', 'HARD', 0, 0, 1, NOW(), NOW()),
('Reverse Nodes in k-Group', 'Given a linked list, reverse the nodes of a linked list k at a time and return its modified list.', 'HARD', 0, 0, 1, NOW(), NOW()),
('Longest Valid Parentheses', 'Given a string containing just the characters ''('' and '')'', find the length of the longest valid (well-formed) parentheses substring.', 'HARD', 0, 0, 1, NOW(), NOW()),
('Trapping Rain Water', 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', 'HARD', 0, 0, 1, NOW(), NOW()),
('Edit Distance', 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.', 'HARD', 0, 0, 1, NOW(), NOW()),
('Median of Two Sorted Arrays', 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.', 'HARD', 0, 0, 1, NOW(), NOW());

-- Add tags to new problems
-- First get the IDs of newly inserted problems
SET @start_id = (SELECT MAX(id) FROM problem) - 36;
SET @end_id = (SELECT MAX(id) FROM problem);

-- Add tags for easy problems
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 1 FROM problem WHERE id BETWEEN @start_id AND @start_id + 14; -- Array
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 2 FROM problem WHERE id BETWEEN @start_id AND @start_id + 14; -- String

-- Add tags for medium problems
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 3 FROM problem WHERE id BETWEEN @start_id + 15 AND @start_id + 29; -- Linked List
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 4 FROM problem WHERE id BETWEEN @start_id + 15 AND @start_id + 29; -- Hash Table

-- Add tags for hard problems
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 5 FROM problem WHERE id BETWEEN @start_id + 30 AND @end_id; -- Dynamic Programming
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 6 FROM problem WHERE id BETWEEN @start_id + 30 AND @end_id; -- Two Pointers

-- Update submit and accept counts with random values
UPDATE problem SET submit_count = FLOOR(RAND() * 100), accept_count = FLOOR(RAND() * 100) WHERE id >= @start_id;

-- Show total problems
SELECT COUNT(*) AS total_problems FROM problem;