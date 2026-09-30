-- 为各个分类分配题目
-- 先查看现有分类
SELECT id, name FROM category;

-- 为"数据结构"分类分配题目（链表、树、图论等）
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '数据结构') 
WHERE title IN (
  'Add Two Numbers',
  'Remove Nth Node From End of List',
  'Merge Two Sorted Lists',
  'Merge k Sorted Lists',
  'Reverse Nodes in k-Group',
  'Same Tree',
  'Symmetric Tree',
  'Next Permutation',
  'Container With Most Water',
  'Trapping Rain Water'
);

-- 为"数组"分类分配题目
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '数组') 
WHERE title IN (
  'Two Sum II - Input Array Is Sorted',
  'Remove Duplicates from Sorted Array',
  'Remove Element',
  'Search Insert Position',
  'Maximum Subarray',
  'Plus One',
  'Merge Sorted Array',
  '3Sum',
  '3Sum Closest',
  '4Sum',
  'Median of Two Sorted Arrays'
);

-- 为"字符串"分类分配题目
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '字符串') 
WHERE title IN (
  'Implement strStr()',
  'Length of Last Word',
  'Add Binary',
  'Longest Substring Without Repeating Characters',
  'Longest Palindromic Substring',
  'Reverse Integer',
  'String to Integer (atoi)',
  'Palindrome Number',
  'Letter Combinations of a Phone Number',
  'Valid Parentheses',
  'Regular Expression Matching',
  'Longest Valid Parentheses',
  'Edit Distance'
);

-- 为"动态规划"分类分配题目
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '动态规划') 
WHERE title IN (
  'Climbing Stairs',
  'Maximum Subarray',
  'Edit Distance',
  'Longest Palindromic Substring',
  'Longest Valid Parentheses',
  'Regular Expression Matching',
  'Trapping Rain Water'
);

-- 为"二分查找"分类分配题目
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '二分查找') 
WHERE title IN (
  'Search Insert Position',
  'Two Sum II - Input Array Is Sorted',
  'Sqrt(x)',
  'Median of Two Sorted Arrays'
);

-- 为"贪心算法"分类分配题目
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '贪心算法') 
WHERE title IN (
  'Container With Most Water',
  'Maximum Subarray',
  'Trapping Rain Water'
);

-- 为"回溯算法"分类分配题目
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '回溯算法') 
WHERE title IN (
  'Letter Combinations of a Phone Number',
  'Regular Expression Matching'
);

-- 为"排序算法"分类分配题目
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '排序算法') 
WHERE title IN (
  'Merge Sorted Array',
  'Merge Two Sorted Lists',
  'Merge k Sorted Lists',
  'Next Permutation'
);

-- 为"位运算"分类分配题目
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '位运算') 
WHERE title IN (
  'Add Binary',
  'Reverse Integer',
  'Palindrome Number'
);

-- 为"数学"分类分配题目
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '数学') 
WHERE title IN (
  'Add Binary',
  'Reverse Integer',
  'Palindrome Number',
  'Plus One',
  'Sqrt(x)',
  'Climbing Stairs'
);

-- 为"链表"分类分配题目
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '链表') 
WHERE title IN (
  'Add Two Numbers',
  'Remove Nth Node From End of List',
  'Merge Two Sorted Lists',
  'Merge k Sorted Lists',
  'Reverse Nodes in k-Group'
);

-- 为"树"分类分配题目
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '树') 
WHERE title IN (
  'Same Tree',
  'Symmetric Tree'
);

-- 为"Java基础"分类创建一些新题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('Java中的String和StringBuilder区别', '请解释Java中String和StringBuilder的主要区别，并给出使用场景。', 'EASY', FLOOR(RAND() * 100), FLOOR(RAND() * 80), (SELECT id FROM category WHERE name = 'Java基础'), NOW(), NOW()),
('Java集合框架', '请简述Java集合框架的主要接口和实现类，并比较ArrayList和LinkedList的区别。', 'MEDIUM', FLOOR(RAND() * 80), FLOOR(RAND() * 60), (SELECT id FROM category WHERE name = 'Java基础'), NOW(), NOW()),
('Java多线程基础', '请解释Java中synchronized关键字的作用，并说明wait()和sleep()方法的区别。', 'MEDIUM', FLOOR(RAND() * 70), FLOOR(RAND() * 50), (SELECT id FROM category WHERE name = 'Java基础'), NOW(), NOW()),
('Java异常处理', '请简述Java异常体系结构，并说明受检异常和非受检异常的区别。', 'EASY', FLOOR(RAND() * 90), FLOOR(RAND() * 70), (SELECT id FROM category WHERE name = 'Java基础'), NOW(), NOW()),
('Java反射机制', '请解释Java反射机制的概念、主要API和应用场景。', 'HARD', FLOOR(RAND() * 40), FLOOR(RAND() * 25), (SELECT id FROM category WHERE name = 'Java基础'), NOW(), NOW()),
('Java IO流', '请简述Java IO流的分类和主要类，并给出文件读写的示例代码。', 'MEDIUM', FLOOR(RAND() * 75), FLOOR(RAND() * 55), (SELECT id FROM category WHERE name = 'Java基础'), NOW(), NOW()),
('Java8新特性', '请简述Java8的主要新特性，如Lambda表达式、Stream API等。', 'MEDIUM', FLOOR(RAND() * 85), FLOOR(RAND() * 65), (SELECT id FROM category WHERE name = 'Java基础'), NOW(), NOW()),
('Java设计模式-单例', '请实现线程安全的单例模式，并解释其原理。', 'HARD', FLOOR(RAND() * 50), FLOOR(RAND() * 30), (SELECT id FROM category WHERE name = 'Java基础'), NOW(), NOW());

-- 为"SQL"分类创建一些新题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('基础SQL查询', '请写出从员工表中查询所有数据的SQL语句。', 'EASY', FLOOR(RAND() * 120), FLOOR(RAND() * 100), (SELECT id FROM category WHERE name = 'SQL'), NOW(), NOW()),
('SQL JOIN查询', '请写出使用INNER JOIN查询两个关联表的SQL语句示例。', 'MEDIUM', FLOOR(RAND() * 90), FLOOR(RAND() * 70), (SELECT id FROM category WHERE name = 'SQL'), NOW(), NOW()),
('SQL聚合函数', '请写出使用SUM、AVG、COUNT等聚合函数的SQL查询示例。', 'MEDIUM', FLOOR(RAND() * 85), FLOOR(RAND() * 65), (SELECT id FROM category WHERE name = 'SQL'), NOW(), NOW()),
('SQL子查询', '请写出使用子查询的SQL语句示例。', 'HARD', FLOOR(RAND() * 60), FLOOR(RAND() * 40), (SELECT id FROM category WHERE name = 'SQL'), NOW(), NOW()),
('SQL索引优化', '请解释SQL索引的原理和作用，并说明如何优化查询性能。', 'HARD', FLOOR(RAND() * 45), FLOOR(RAND() * 28), (SELECT id FROM category WHERE name = 'SQL'), NOW(), NOW()),
('SQL事务', '请解释SQL事务的ACID特性和隔离级别。', 'MEDIUM', FLOOR(RAND() * 70), FLOOR(RAND() * 50), (SELECT id FROM category WHERE name = 'SQL'), NOW(), NOW());

-- 为"数据库"分类分配一些题目
UPDATE problem SET category_id = (SELECT id FROM category WHERE name = '数据库') 
WHERE title IN (
  'SQL索引优化',
  'SQL事务'
);

-- 为"操作系统"分类创建一些新题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('进程和线程的区别', '请解释操作系统中进程和线程的主要区别。', 'EASY', FLOOR(RAND() * 100), FLOOR(RAND() * 80), (SELECT id FROM category WHERE name = '操作系统'), NOW(), NOW()),
('死锁', '请解释死锁的概念、产生条件和预防方法。', 'HARD', FLOOR(RAND() * 50), FLOOR(RAND() * 30), (SELECT id FROM category WHERE name = '操作系统'), NOW(), NOW()),
('内存管理', '请简述操作系统内存管理的主要方式，如分页、分段等。', 'MEDIUM', FLOOR(RAND() * 70), FLOOR(RAND() * 50), (SELECT id FROM category WHERE name = '操作系统'), NOW(), NOW()),
('调度算法', '请简述常见的进程调度算法，如FCFS、SJF、RR等。', 'MEDIUM', FLOOR(RAND() * 75), FLOOR(RAND() * 55), (SELECT id FROM category WHERE name = '操作系统'), NOW(), NOW()),
('文件系统', '请简述文件系统的概念和主要功能。', 'EASY', FLOOR(RAND() * 95), FLOOR(RAND() * 75), (SELECT id FROM category WHERE name = '操作系统'), NOW(), NOW());

-- 为"网络"分类创建一些新题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('TCP和UDP的区别', '请解释TCP和UDP协议的主要区别和使用场景。', 'EASY', FLOOR(RAND() * 110), FLOOR(RAND() * 90), (SELECT id FROM category WHERE name = '网络'), NOW(), NOW()),
('HTTP状态码', '请列举常见的HTTP状态码及其含义。', 'EASY', FLOOR(RAND() * 105), FLOOR(RAND() * 85), (SELECT id FROM category WHERE name = '网络'), NOW(), NOW()),
('三次握手和四次挥手', '请解释TCP连接建立的三次握手和断开的四次挥手过程。', 'HARD', FLOOR(RAND() * 55), FLOOR(RAND() * 35), (SELECT id FROM category WHERE name = '网络'), NOW(), NOW()),
('OSI七层模型', '请简述OSI七层模型及其每一层的主要功能。', 'MEDIUM', FLOOR(RAND() * 80), FLOOR(RAND() * 60), (SELECT id FROM category WHERE name = '网络'), NOW(), NOW()),
('HTTPS原理', '请解释HTTPS的工作原理和SSL/TLS的作用。', 'HARD', FLOOR(RAND() * 45), FLOOR(RAND() * 28), (SELECT id FROM category WHERE name = '网络'), NOW(), NOW());

-- 为"Python基础"分类创建一些新题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('Python列表推导式', '请举例说明Python列表推导式的用法。', 'EASY', FLOOR(RAND() * 100), FLOOR(RAND() * 80), (SELECT id FROM category WHERE name = 'Python基础'), NOW(), NOW()),
('Python装饰器', '请解释Python装饰器的概念和用法，并给出示例。', 'MEDIUM', FLOOR(RAND() * 70), FLOOR(RAND() * 50), (SELECT id FROM category WHERE name = 'Python基础'), NOW(), NOW()),
('Python生成器', '请解释Python生成器的概念和yield关键字的作用。', 'MEDIUM', FLOOR(RAND() * 65), FLOOR(RAND() * 45), (SELECT id FROM category WHERE name = 'Python基础'), NOW(), NOW()),
('Python面向对象', '请简述Python面向对象编程的主要特性。', 'MEDIUM', FLOOR(RAND() * 75), FLOOR(RAND() * 55), (SELECT id FROM category WHERE name = 'Python基础'), NOW(), NOW()),
('Python异常处理', '请简述Python异常处理机制，并给出try-except的使用示例。', 'EASY', FLOOR(RAND() * 90), FLOOR(RAND() * 70), (SELECT id FROM category WHERE name = 'Python基础'), NOW(), NOW());

-- 为"C++基础"分类创建一些新题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('指针和引用的区别', '请解释C++中指针和引用的主要区别。', 'EASY', FLOOR(RAND() * 95), FLOOR(RAND() * 75), (SELECT id FROM category WHERE name = 'C++基础'), NOW(), NOW()),
('C++虚函数', '请解释C++虚函数的概念、作用和实现原理。', 'HARD', FLOOR(RAND() * 50), FLOOR(RAND() * 30), (SELECT id FROM category WHERE name = 'C++基础'), NOW(), NOW()),
('C++STL容器', '请简述C++STL中常用的容器及其特点。', 'MEDIUM', FLOOR(RAND() * 75), FLOOR(RAND() * 55), (SELECT id FROM category WHERE name = 'C++基础'), NOW(), NOW()),
('C++内存管理', '请解释new/delete和malloc/free的区别。', 'MEDIUM', FLOOR(RAND() * 70), FLOOR(RAND() * 50), (SELECT id FROM category WHERE name = 'C++基础'), NOW(), NOW()),
('C++模板', '请解释C++模板的概念和用法。', 'HARD', FLOOR(RAND() * 45), FLOOR(RAND() * 28), (SELECT id FROM category WHERE name = 'C++基础'), NOW(), NOW());

-- 为"后端开发"分类创建一些新题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('RESTful API设计', '请简述RESTful API的设计原则和最佳实践。', 'MEDIUM', FLOOR(RAND() * 80), FLOOR(RAND() * 60), (SELECT id FROM category WHERE name = '后端开发'), NOW(), NOW()),
('数据库连接池', '请解释数据库连接池的概念和作用。', 'MEDIUM', FLOOR(RAND() * 70), FLOOR(RAND() * 50), (SELECT id FROM category WHERE name = '后端开发'), NOW(), NOW()),
('缓存策略', '请简述常见的缓存策略和缓存更新策略。', 'HARD', FLOOR(RAND() * 55), FLOOR(RAND() * 35), (SELECT id FROM category WHERE name = '后端开发'), NOW(), NOW()),
('消息队列', '请解释消息队列的概念、作用和常见应用场景。', 'MEDIUM', FLOOR(RAND() * 65), FLOOR(RAND() * 45), (SELECT id FROM category WHERE name = '后端开发'), NOW(), NOW()),
('分布式系统', '请简述分布式系统的概念和CAP定理。', 'HARD', FLOOR(RAND() * 40), FLOOR(RAND() * 25), (SELECT id FROM category WHERE name = '后端开发'), NOW(), NOW());

-- 为"前端开发"分类创建一些新题目
INSERT INTO problem (title, description, difficulty, submit_count, accept_count, category_id, create_time, update_time)
VALUES 
('DOM操作', '请简述JavaScript中常见的DOM操作方法。', 'EASY', FLOOR(RAND() * 100), FLOOR(RAND() * 80), (SELECT id FROM category WHERE name = '前端开发'), NOW(), NOW()),
('事件冒泡和捕获', '请解释事件冒泡和事件捕获的区别。', 'MEDIUM', FLOOR(RAND() * 75), FLOOR(RAND() * 55), (SELECT id FROM category WHERE name = '前端开发'), NOW(), NOW()),
('闭包', '请解释JavaScript中闭包的概念和应用场景。', 'HARD', FLOOR(RAND() * 50), FLOOR(RAND() * 30), (SELECT id FROM category WHERE name = '前端开发'), NOW(), NOW()),
('Promise和async/await', '请解释Promise的概念和async/await的用法。', 'MEDIUM', FLOOR(RAND() * 70), FLOOR(RAND() * 50), (SELECT id FROM category WHERE name = '前端开发'), NOW(), NOW()),
('性能优化', '请简述前端性能优化的常见方法。', 'HARD', FLOOR(RAND() * 45), FLOOR(RAND() * 28), (SELECT id FROM category WHERE name = '前端开发'), NOW(), NOW());

-- 输出每个分类下的题目数量
SELECT c.name AS category_name, COUNT(p.id) AS problem_count
FROM category c
LEFT JOIN problem p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY problem_count DESC;

-- 输出总题目数
SELECT COUNT(*) AS total_problems FROM problem;
