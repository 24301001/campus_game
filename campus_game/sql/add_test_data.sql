-- 添加测试提交数据
USE coding_platform;

-- 添加测试提交记录
-- 两数之和 - 第一次错误
INSERT INTO submit_record (user_id, problem_id, code, language, status, time_used, memory_used, error_message, create_time) 
VALUES (2, 1, 'test code 1', 'JAVA', 'WRONG_ANSWER', 100, 64000, '答案错误', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- 两数之和 - 第二次错误
INSERT INTO submit_record (user_id, problem_id, code, language, status, time_used, memory_used, error_message, create_time) 
VALUES (2, 1, 'test code 2', 'JAVA', 'COMPILE_ERROR', 0, 0, '编译错误', DATE_SUB(NOW(), INTERVAL 4 DAY));

-- 两数之和 - 第三次通过
INSERT INTO submit_record (user_id, problem_id, code, language, status, time_used, memory_used, create_time) 
VALUES (2, 1, 'test code 3', 'JAVA', 'ACCEPTED', 50, 32000, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- 斐波那契数列 - 通过
INSERT INTO submit_record (user_id, problem_id, code, language, status, time_used, memory_used, create_time) 
VALUES (2, 2, 'test code 4', 'JAVA', 'ACCEPTED', 30, 16000, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- 反转链表 - 未通过
INSERT INTO submit_record (user_id, problem_id, code, language, status, time_used, memory_used, error_message, create_time) 
VALUES (2, 3, 'test code 5', 'JAVA', 'WRONG_ANSWER', 80, 48000, '输出格式错误', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 更新用户统计
UPDATE user 
SET total_problems = 5, accepted_problems = 2
WHERE id = 2;

-- 更新题目统计
UPDATE problem 
SET submit_count = 3, accept_count = 1
WHERE id = 1;

UPDATE problem 
SET submit_count = 1, accept_count = 1
WHERE id = 2;

UPDATE problem 
SET submit_count = 1, accept_count = 0
WHERE id = 3;
