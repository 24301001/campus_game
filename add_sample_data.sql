-- 为所有题目添加示例输入和输出
-- 1. 两数之和（已存在）
UPDATE problem 
SET sample_input = '4\n2 7 11 15\n9',
    sample_output = '0 1'
WHERE title = '两数之和';

-- 2. 斐波那契数列（已存在）
UPDATE problem 
SET sample_input = '10',
    sample_output = '55'
WHERE title = '斐波那契数列';

-- 3. 数组求和（已存在）
UPDATE problem 
SET sample_input = '4\n2 7 11 15\n9',
    sample_output = '0 1'
WHERE title = '数组求和';

-- 4. 反转链表
UPDATE problem 
SET sample_input = '5\n1 2 3 4 5',
    sample_output = '5 4 3 2 1'
WHERE title = '反转链表';

-- 5. 合并两个有序链表
UPDATE problem 
SET sample_input = '3\n1 2 4\n3\n1 3 4',
    sample_output = '1 1 2 3 4 4'
WHERE title = '合并两个有序链表';

-- 6. 二叉树的中序遍历
UPDATE problem 
SET sample_input = '5\n1 null 2 3',
    sample_output = '1 3 2'
WHERE title = '二叉树的中序遍历';

-- 7. 最大子序和
UPDATE problem 
SET sample_input = '9\n-2 1 -3 4 -1 2 1 -5 4',
    sample_output = '6'
WHERE title = '最大子序和';

-- 8. 买卖股票的最佳时机
UPDATE problem 
SET sample_input = '6\n7 1 5 3 6 4',
    sample_output = '5'
WHERE title = '买卖股票的最佳时机';

-- 9. 有效的括号
UPDATE problem 
SET sample_input = '()[]{}',
    sample_output = 'true'
WHERE title = '有效的括号';

-- 10. 合并两个有序数组
UPDATE problem 
SET sample_input = '3\n1 2 3\n3\n2 5 6',
    sample_output = '1 2 2 3 5 6'
WHERE title = '合并两个有序数组';

-- 11. 移除元素
UPDATE problem 
SET sample_input = '3\n3 2 2 3\n3',
    sample_output = '2\n2 2'
WHERE title = '移除元素';

-- 12. 实现strStr()
UPDATE problem 
SET sample_input = 'hello\nll',
    sample_output = '2'
WHERE title = '实现strStr()';

-- 13. 外观数列
UPDATE problem 
SET sample_input = '4',
    sample_output = '1211'
WHERE title = '外观数列';

-- 14. 最大公约数
UPDATE problem 
SET sample_input = '12 18',
    sample_output = '6'
WHERE title = '最大公约数';

-- 15. 爬楼梯
UPDATE problem 
SET sample_input = '3',
    sample_output = '3'
WHERE title = '爬楼梯';

-- 16. 杨辉三角
UPDATE problem 
SET sample_input = '5',
    sample_output = '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1'
WHERE title = '杨辉三角';

-- 17. 买卖股票的最佳时机 II
UPDATE problem 
SET sample_input = '6\n7 1 5 3 6 4',
    sample_output = '7'
WHERE title = '买卖股票的最佳时机 II';

-- 18. 验证回文串
UPDATE problem 
SET sample_input = 'A man, a plan, a canal: Panama',
    sample_output = 'true'
WHERE title = '验证回文串';

-- 19. 只出现一次的数字
UPDATE problem 
SET sample_input = '4\n2 2 1',
    sample_output = '1'
WHERE title = '只出现一次的数字';

-- 20. 环形链表
UPDATE problem 
SET sample_input = '3\n3 2 0 -4\n1',
    sample_output = 'true'
WHERE title = '环形链表';

-- 21. 相交链表
UPDATE problem 
SET sample_input = '3\n4\n1 9 1\n2 4\n3',
    sample_output = '8'
WHERE title = '相交链表';

-- 22. 多数元素
UPDATE problem 
SET sample_input = '7\n3 2 3',
    sample_output = '3'
WHERE title = '多数元素';

-- 23. 存在重复元素
UPDATE problem 
SET sample_input = '4\n1 2 3 1',
    sample_output = 'true'
WHERE title = '存在重复元素';

-- 24. 缺失数字
UPDATE problem 
SET sample_input = '3\n3 0 1',
    sample_output = '2'
WHERE title = '缺失数字';

-- 25. 反转字符串
UPDATE problem 
SET sample_input = 'hello',
    sample_output = 'olleh'
WHERE title = '反转字符串';

-- 26. 整数反转
UPDATE problem 
SET sample_input = '123',
    sample_output = '321'
WHERE title = '整数反转';

-- 27. 回文数
UPDATE problem 
SET sample_input = '121',
    sample_output = 'true'
WHERE title = '回文数';

-- 28. 字符串转换整数 (atoi)
UPDATE problem 
SET sample_input = '42',
    sample_output = '42'
WHERE title = '字符串转换整数 (atoi)';

-- 29. 最长公共前缀
UPDATE problem 
SET sample_input = '3\nflower flow flight',
    sample_output = 'fl'
WHERE title = '最长公共前缀';

-- 30. 三数之和
UPDATE problem 
SET sample_input = '6\n-1 0 1 2 -1 -4',
    sample_output = '[-1,-1,2]\n[-1,0,1]'
WHERE title = '三数之和';

-- 31. 最接近的三数之和
UPDATE problem 
SET sample_input = '4\n-1 2 1 -4\n1',
    sample_output = '2'
WHERE title = '最接近的三数之和';

-- 32. 四数之和
UPDATE problem 
SET sample_input = '6\n1 0 -1 0 -2 2\n0',
    sample_output = '[-2,-1,1,2]\n[-2,0,0,2]\n[-1,0,0,1]'
WHERE title = '四数之和';

-- 33. 删除排序数组中的重复项
UPDATE problem 
SET sample_input = '3\n1 1 2',
    sample_output = '2\n1 2'
WHERE title = '删除排序数组中的重复项';

-- 34. 搜索旋转排序数组
UPDATE problem 
SET sample_input = '7\n4 5 6 7 0 1 2\n0',
    sample_output = '4'
WHERE title = '搜索旋转排序数组';

-- 35. 搜索插入位置
UPDATE problem 
SET sample_input = '4\n1 3 5 6\n5',
    sample_output = '2'
WHERE title = '搜索插入位置';

-- 36. 外观数列
UPDATE problem 
SET sample_input = '4',
    sample_output = '1211'
WHERE title = '外观数列';

-- 37. 报数
UPDATE problem 
SET sample_input = '4',
    sample_output = '1211'
WHERE title = '报数';

-- 38. 最后一个单词的长度
UPDATE problem 
SET sample_input = 'Hello World',
    sample_output = '5'
WHERE title = '最后一个单词的长度';

-- 39. 加一
UPDATE problem 
SET sample_input = '3\n1 2 3',
    sample_output = '1 2 4'
WHERE title = '加一';

-- 40. 二进制求和
UPDATE problem 
SET sample_input = '11\n1',
    sample_output = '100'
WHERE title = '二进制求和';

-- 41. x 的平方根
UPDATE problem 
SET sample_input = '4',
    sample_output = '2'
WHERE title = 'x 的平方根';

-- 42. 爬楼梯
UPDATE problem 
SET sample_input = '3',
    sample_output = '3'
WHERE title = '爬楼梯';

-- 43. 删除链表的倒数第N个节点
UPDATE problem 
SET sample_input = '5\n1 2 3 4 5\n2',
    sample_output = '1 2 3 5'
WHERE title = '删除链表的倒数第N个节点';

-- 44. 两两交换链表中的节点
UPDATE problem 
SET sample_input = '4\n1 2 3 4',
    sample_output = '2 1 4 3'
WHERE title = '两两交换链表中的节点';

-- 45. 括号生成
UPDATE problem 
SET sample_input = '3',
    sample_output = '((()))\n(()())\n(())()\n()(())\n()()()'
WHERE title = '括号生成';

-- 46. 合并K个排序链表
UPDATE problem 
SET sample_input = '3\n1 4 5\n1 3 4\n2 6',
    sample_output = '1 1 2 3 4 4 5 6'
WHERE title = '合并K个排序链表';

-- 47. 验证二叉搜索树
UPDATE problem 
SET sample_input = '2\n2 1 3',
    sample_output = 'true'
WHERE title = '验证二叉搜索树';

-- 48. 对称二叉树
UPDATE problem 
SET sample_input = '1\n2 2 3 4 4 3',
    sample_output = 'true'
WHERE title = '对称二叉树';

-- 49. 二叉树的最大深度
UPDATE problem 
SET sample_input = '3\n3 9 20 null null 15 7',
    sample_output = '3'
WHERE title = '二叉树的最大深度';

-- 50. 二叉树的层序遍历
UPDATE problem 
SET sample_input = '3\n3 9 20 null null 15 7',
    sample_output = '3\n9 20\n15 7'
WHERE title = '二叉树的层序遍历';

-- 输出更新结果
SELECT COUNT(*) as updated_problems 
FROM problem 
WHERE sample_input IS NOT NULL AND sample_input != '';