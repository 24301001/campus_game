-- 为题目添加标签关联

-- 先清空已有的关联（避免重复）
DELETE FROM problem_tag;

-- 为数组相关题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 1 FROM problem WHERE category_id IN (
  SELECT id FROM category WHERE name LIKE '%数组%'
) ORDER BY id;

-- 为字符串相关题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 2 FROM problem WHERE category_id IN (
  SELECT id FROM category WHERE name LIKE '%字符串%'
) ORDER BY id;

-- 为哈希表相关题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 3 FROM problem WHERE id % 7 = 0 ORDER BY id;

-- 为链表相关题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 4 FROM problem WHERE category_id IN (
  SELECT id FROM category WHERE name LIKE '%链表%'
) ORDER BY id;

-- 为双指针相关题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 5 FROM problem WHERE id % 5 = 0 ORDER BY id;

-- 为栈相关题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 6 FROM problem WHERE id % 6 = 0 ORDER BY id;

-- 为队列相关题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 7 FROM problem WHERE id % 8 = 0 ORDER BY id;

-- 为树相关题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 8 FROM problem WHERE category_id IN (
  SELECT id FROM category WHERE name LIKE '%树%'
) ORDER BY id;

-- 为动态规划相关题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 9 FROM problem WHERE category_id IN (
  SELECT id FROM category WHERE name LIKE '%动态规划%'
) ORDER BY id;

-- 为数学相关题目添加标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 10 FROM problem WHERE category_id IN (
  SELECT id FROM category WHERE name LIKE '%数学%'
) ORDER BY id;

-- 确保每个题目至少有一个标签
-- 为没有标签的题目默认添加一个标签
INSERT INTO problem_tag (problem_id, tag_id)
SELECT id, 1 FROM problem 
WHERE id NOT IN (SELECT DISTINCT problem_id FROM problem_tag)
ORDER BY id;

-- 查看分配结果
SELECT 
  t.name AS tag_name,
  COUNT(pt.problem_id) AS problem_count
FROM tag t
LEFT JOIN problem_tag pt ON t.id = pt.tag_id
GROUP BY t.id, t.name
ORDER BY t.id;

-- 查看有多少题目有标签
SELECT 
  COUNT(DISTINCT p.id) AS total_problems,
  COUNT(DISTINCT pt.problem_id) AS problems_with_tags
FROM problem p
LEFT JOIN problem_tag pt ON p.id = pt.problem_id;
