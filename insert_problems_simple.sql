-- 插入更多简单题目 - 简化版本
-- 数组相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time) VALUES (
  '数组求和',
  '给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @id1 = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id1, 1);

-- 字符串相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time) VALUES (
  '反转字符串',
  '编写一个函数，其作用是将输入的字符串反转过来。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @id2 = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id2, 2);

-- 哈希表相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time) VALUES (
  '唯一字符',
  '给定一个字符串，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回 -1。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @id3 = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id3, 2);
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id3, 3);

-- 栈相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time) VALUES (
  '有效的括号',
  '给定一个只包括 括号的字符串，判断字符串是否有效。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @id4 = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id4, 6);

-- 队列相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time) VALUES (
  '用栈实现队列',
  '请你仅使用两个栈实现先入先出队列。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @id5 = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id5, 6);
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id5, 7);

-- 链表相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time) VALUES (
  '删除链表节点',
  '请编写一个函数，使其可以删除某个链表中给定的（非末尾）节点。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @id6 = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id6, 4);

-- 树相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time) VALUES (
  '二叉树的最大深度',
  '给定一个二叉树，找出其最大深度。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @id7 = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id7, 8);

-- 动态规划相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time) VALUES (
  '爬楼梯',
  '假设你正在爬楼梯。需要 n 阶你才能到达楼顶。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @id8 = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id8, 9);
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id8, 10);

-- 数学相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time) VALUES (
  '回文数',
  '给你一个整数 x，如果 x 是一个回文整数，返回 true，否则返回 false。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @id9 = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id9, 10);

-- 双指针相关
INSERT INTO problem (title, description, difficulty, time_limit, memory_limit, category_id, create_time, update_time) VALUES (
  '移动零',
  '给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。',
  'EASY',
  1000,
  256,
  1,
  NOW(),
  NOW()
);
SET @id10 = LAST_INSERT_ID();
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id10, 1);
INSERT INTO problem_tag (problem_id, tag_id) VALUES (@id10, 5);

-- 查看结果
SELECT id, title, difficulty FROM problem ORDER BY id;
