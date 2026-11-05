-- 重置所有题目的提交数和通过数为0
UPDATE problem 
SET submit_count = 0, accept_count = 0
WHERE id > 0;

-- 输出结果
SELECT COUNT(*) AS total_problems, 
       SUM(submit_count) AS total_submissions, 
       SUM(accept_count) AS total_acceptances
FROM problem;