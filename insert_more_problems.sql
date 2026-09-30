-- 插入更多简单题目
-- 数组相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time)
VALUES (
  '数组求和',
  '给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @arr_sum_id = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@arr_sum_id, 1);
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@arr_sum_id, 5); -- 双指针也可以

-- 字符串相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time)
VALUES (
  '反转字符串',
  '编写一个函数，其作用是将输入的字符串反转过来。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @rev_str_id = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@rev_str_id, 2);

-- 哈希表相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time)
VALUES (
  '唯一字符',
  '给定一个字符串，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回 -1。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @uniq_char_id = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@uniq_char_id, 2);
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@uniq_char_id, 3);

-- 栈相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time)
VALUES (
  '有效的括号',
  '给定一个只包括 ''('','')'',''{''',''}'',''['','']'' 的字符串，判断字符串是否有效。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @valid_paren_id = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@valid_paren_id, 6);

-- 队列相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time)
VALUES (
  '用栈实现队列',
  '请你仅使用两个栈实现先入先出队列。队列应当支持一般队列支持的所有操作（push、pop、peek、empty）。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @queue_stack_id = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@queue_stack_id, 6);
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@queue_stack_id, 7);

-- 链表相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time)
VALUES (
  '删除链表节点',
  '请编写一个函数，使其可以删除某个链表中给定的（非末尾）节点。传入函数的唯一参数为要被删除的节点。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @del_node_id = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@del_node_id, 4);

-- 树相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time)
VALUES (
  '二叉树的最大深度',
  '给定一个二叉树，找出其最大深度。二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @max_depth_id = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@max_depth_id, 8);

-- 动态规划相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time)
VALUES (
  '爬楼梯',
  '假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @climb_stairs_id = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@climb_stairs_id, 9);
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@climb_stairs_id, 10);

-- 数学相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time)
VALUES (
  '回文数',
  '给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @palindrome_id = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@palindrome_id, 10);

-- 再插几个题
-- 双指针相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time)
VALUES (
  '移动零',
  '给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @move_zero_id = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@move_zero_id, 1);
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@move_zero_id, 5);

-- 查询结果
SELECT '已插入的题目:' AS info;
SELECT id, title, difficulty FROM problem ORDER BY id;
