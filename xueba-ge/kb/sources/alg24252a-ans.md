---
course: 算法设计与分析
book: 算法设计与分析 2024—2025学年第2学期期末试卷(A卷) 参考答案与评分标准
book_id: alg24252a-ans
source_type: past_paper
ocr: MinerU 4.0 (ocr-mode=ocr) 2026-09-21
---

[page:1]

## 北京交通大学考试试题（A卷）

## 参考答案与评分标准

课程名称:算法设计与分析 学年学期:2024—2025学年第2学期

课程编号:M210004B开课学院:软件学院出题教师:刘铎，党凡，李令昆

第一部分、单项选择。请选择最适合的答案。(共20分)

<table><tr><td>1.</td><td>2.</td><td>3.</td><td>4</td><td>5.</td><td>6.</td><td>7.</td><td>8.</td><td>9.</td><td>10.</td></tr><tr><td>B</td><td>C</td><td>B</td><td>C</td><td>B</td><td>A</td><td>D</td><td>C</td><td>A</td><td>D</td></tr></table>

## 第二部、建模与计算。（共30分）

11.（共9分）解:（每空1分）

<table><tr><td>轮次</td><td>L</td><td>R</td><td>mid</td></tr><tr><td>0</td><td>0</td><td>5</td><td>2.5</td></tr><tr><td>1</td><td>0</td><td>2.5</td><td>1.25</td></tr><tr><td>2</td><td>1.25</td><td>2.5</td><td>1.875</td></tr><tr><td>3</td><td>1.875</td><td>2.5</td><td>2.1875</td></tr></table>

12.（共13分）解:

变量定义（3分）:设 $[ x _ { A } ]$ 表示经典型A的产量(袋)， $x _ { B }$ 表示高蛋白型B的产量(袋)，$x _ { C }$ 表示低糖型C的产量（袋）。

目标函数（3分）:Maximize $Z = 4x_{A} + 5x_{B} + 3.5x_{C}$

约束条件（每个1分，共7分，前三个条件单位错误总共扣1分）:

$$\left\{ \begin{array} { c } 8 0 x _ { A } + 9 0 x _ { B } + 8 5 x _ { C } \leq 3 2 0 0 0 * 1 0 0 0 \\ 2 5 x _ { B } \leq 6 0 0 0 * 1 0 0 0 \\ 1 0 x _ { A } + 8 x _ { B } + 3 x _ { C } \leq 2 4 0 0 * 1 0 0 0 \\ x _ { A } + x _ { B } \leq 7 0 0 0 \\ x _ { C } \geq 0 . 4 x _ { A } \\ x _ { A } , x _ { B } , x _ { C } \geq 0 \\ x _ { A } , x _ { B } , x _ { C } \in \mathbb { Z } \end{array} \right.$$

13.（共8分）解:

令 $m = \log _ { 2 } n$ ，则 $T ( n ) = T ( 2 ^ { m } )$ 0

记 $S ( m ) = T ( 2 ^ { m } )$ ，原式等价于 $S(m)=2S(m/2)+m,S(0)=1 。$ (至此2 分)

符合主定理情形2，因此有 $S ( m ) = \Theta ( m \log m )$

(至此 5 分)

换回原变量，有 $T(n) = S(\log_2 n) = \Theta(\log n \log \log n)$ (至此8分)

[page:2]

## 第三部分、算法设计与分析。（共50分）

14.（共13分）解:

（1）（共5分，每个1分；多写不正确的每个扣1分，最多扣5分。）
(2,1), (3,1), (8,1), (6,1), (8,6)
（2）（8分）参考伪代码如下所示。
初始调用：
InvCount(A[1..n]):
return Count(A, 1, n)
Count(A, left, right): //统计A[left..mid]的逆序对数量
if left ≥ right then return 0 //区间长度≤1，逆序对数为0
mid ← |(left + right) / 2|
S left ← Count(A, left, mid) //左半部分逆序对数
S right ← Count(A, mid + 1, right) //右半部分逆序对数
S_cross ← MergeCount(A, left, mid, right) //跨越两部分的逆序对数
returnS left + S right + S cross
MergeCount(A, left, mid, right):
∥/先把待合并区间复制到辅助数组 B
B[left..right] ← A[left..right]
i ← left, j ← mid + 1, k ← left, S ← 0
whilei ≤ mid andj ≤ right do
if B[i]≤ B[j] then //无逆序对，直接复制
A[k] ← B[i]
i ← i + 1
else //出现跨区间逆序对
A[k] ← B[j]
S ← S + (mid − i + 1) ∥/B[i..mid]均大于 B[j]
j←j+ 1
k ← k + 1,
end while
//复制剩余元素（最多一侧有元素未合并）
if i ≤ mid then A[k..right] ← B[i..mid] else A[k..right] ← B[j..right]
return S //返回跨区间逆序对数

备注:分治结构正确得4分；能在线性时间内完成归并——即总体复杂度为O(n1g n)，再得4分。写出O(n2)或O(nlg2n)时间伪代码者，此处可得5分。

[page:3]

## 15.（共12分）解:

（1）（3分）贪心选择性质:总是优先执行处理时间最短的任务。

（2）（5分）参考伪代码如下所示。

Greedy-Schedule-SPT(Tasks):

将所有任务 $a _ { i }$ 依处理时间 $p _ { i }$ 的不增顺序排序
time ← 0 //当前时刻
total ← 0 ∥/完成时刻之和
fori← 1 to n
time ← time + pi, total ← total + time
return total/n ∥/平均完成时刻

（3）（共4分）假设在某个调度中，有两个任务 $\cdot a _ { i }$ 和 $i a _ { j }$ ，且 $. p _ { i } > p _ { j }$ ，但调度中却先执行了 $a _ { i }$ 再执行 $a _ { j }$ ；那么此调度中，一定有两个相邻任务 $a _ { i }$ 和 $a _ { j }$ 满足 $p _ { i } > p _ { j }$ ，但先执行了 $a _ { i }$再执行 $\therefore a _ { j }$ (学生可直接使用此结果而无需证明。)

我们比较调度顺序（假设t为 $a _ { i }$ 的开始时刻):

顺序一:先 $\cdot a _ { i }$ 后 $a _ { j }$ ，它们的完成时刻分别为 $\begin{array} { r } { { : } C _ { i } = t + p _ { i } , C _ { j } = t + p _ { i } + p _ { j } { \mathrm {  。  } } } \end{array}$

顺序二:先 $\mathrm { i } a _ { j }$ 后 $a _ { i }$ ，它们的完成时刻分别为 ${ { \bf \nabla } } ^ { \prime } C _ { j } { } ^ { \prime } = t + p _ { j } , C _ { i } { } ^ { \prime } = t + p _ { j } + p _ { i }   .$

总完成时刻变化为: $\left( C _ { i } + C _ { j } \right) - \left( C _ { i } ^ { \prime } + C _ { j } ^ { \prime } \right) = p _ { i } - p _ { j } > 0  。$

因此，将 $\overline { { \cdot } } p _ { j } < p _ { i }$ 的任务交换到前面，会减少总完成时间。不断进行这样的交换操作，最终会得到最小的平均完成时刻调度—即按照 $i p _ { i }$ 的不增顺序排序。

整体复杂度由排序部分决定，为0(nlgn)。

## 16.（共12分）解:

本题可建模为将航行计划按出发时的坐标排序，然后力求使得到达坐标中单调上升的序列长度尽可能长，因此是问题转换为最长上升子序列问题，n减去求得的最长上升子序列长度即为最少的去除方案。 (至此 5 分)

参考伪代码如下所示。

MIN-REMOVE(plan)
1. sort plan by its start time
2. initialize f[1..n] with 1
3. for i = 1 to n do
4. for j = 1 to i−1 do
5. if plan[j].end < plan[i].end then
6. f[i] ← max(f[i], f[j]+1)
7. maxn ←f[1]
8. for i = 2 to n do
9. maxn ← max(maxn, f[i])
10. return n-maxn

[page:4]

17.（共13分）解:（解答不唯一）

（1）估界函数（2分）: $C _ { a }$ 表示当前已选货物集合的总利润； $C _ { e }$ 表示剩余未考虑的货物的总利润。（备注: $C _ { e }$ 不唯一，其他合理的设计亦可。)

剪枝依据（2分）:①重量超过限制； $\textcircled{2}  C _ { a } + C _ { e }$ ≤当前已知最优解的利润。

（2）剪枝后的搜索树如下所示（7分）:

各个节点处的数字依次表示:当前选择的总重量，当前获得的总利润 $( C _ { a } )$ ，剩余未考虑货物的总利润 $(C_e),~C_a+C_e$ 。（标注形式不限于此，但必须清晰地体现当前选择的总重量、 $C _ { a } + C _ { e }$ ，以便展示剪枝过程。)

（3）最优解为选取货物A、B、D（2分）。
