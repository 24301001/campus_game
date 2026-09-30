---
course: 算法设计与分析
book: 算法设计与分析 2023—2024学年第2学期期末试卷(A卷) 参考答案与评分标准
book_id: alg23242a-ans
source_type: past_paper
ocr: MinerU 4.0 (ocr-mode=ocr) 2026-09-21
---

[page:1]

## 北京交通大学考试试题(A卷)

## 参考答案与评分标准

课程名称:算法设计与分析学年学期:2023—2024学年第2学期

课程编号:M210004B开课学院:软件学院出题教师:刘铎，李令昆

第一部分、单项选择。请选择最适合的答案，并填涂到答题卡上。

(共 24 分)

<table><tr><td>1.</td><td>2.</td><td>3.</td><td>4.</td><td>5.</td><td>6.</td><td>7.</td><td>8.</td></tr><tr><td>A</td><td>C</td><td>D</td><td>B</td><td>D</td><td>B</td><td>D</td><td>A</td></tr></table>

## 第二部分、建模与计算。（共26分）

9.（共8分）解:用0-1变量 $S 1 { \sim } S 9$ 分别表示是否挖石板 $S_{1} \sim S_{9}, 0 - 1$ 变量 $g _ { 1 } { \sim } g _ { 4 }$ 分別表示是否拿取金板 $G _ { 1 } { \sim } G _ { 4 } , 1$ 表示挖/拿取，0表示不挖/不拿取选择。（2分）则可得到线性规划模型如下（目标2分、等式组2分、变量类型约束2分）。

$$\begin{aligned}& MAX   1\$g_{1} + 10g_{2} + 20g_{3} + 25g_{4} - 6s_{1} - 5s_{2} - 2s_{3} - 4s_{4} - 3s_{5} - 7s_{6} - 2s_{7} - s_{8} - 16s_{9} \\& ST  \quad s_{1} + s_{2} + s_{4} + s_{5} - 4g_{1} \geq 0 \\& \quad s_{2} + s_{3} + s_{5} + s_{6} - 4g_{2} \geq 0 \\& \quad s_{4} + s_{5} + s_{7} + s_{8} - 4g_{3} \geq 0 \\& \quad s_{5} + s_{6} + s_{8} + s_{9} - 4g_{4} \geq 0 \\& \quad s_{i} \in \{0, 1\}, \quad g_{j} \in \{0, 1\}, \quad  其中  1 \leq i \leq 9, \quad 1 \leq j \leq 4\end{aligned}$$

10. （共10分）解:K(i,w)表示仅考虑金板1~i且背包重量限制为 w时所能取得的最大值，题目的目标为 K(4, 15)。S(i, w)表示仅考虑金板1~i 且背包重量限制为 w时、取得最大值时，是否选取了物品i，1表示是，0表示否。解题过程如表1和表2所示。允许的最大总价值为38，取物品1、2和4。

表1 K(i, w)<table><tr><td>Wi</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td>1</td><td>0</td><td>0</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td><td>10</td></tr><tr><td>2</td><td>0</td><td>0</td><td>10</td><td>10</td><td>10</td><td>10</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td><td>20</td></tr><tr><td>3</td><td>0</td><td>0</td><td>10</td><td>10</td><td>10</td><td>10</td><td>20</td><td>20</td><td>22</td><td>22</td><td>22</td><td>22</td><td>32</td><td>32</td><td>32</td><td>32</td></tr><tr><td>4</td><td>0</td><td>0</td><td>10</td><td>10</td><td>10</td><td>10</td><td>20</td><td>20</td><td>22</td><td>22</td><td>22</td><td>28</td><td>32</td><td>32</td><td>32</td><td>38</td></tr></table>

[page:2]

表 2 S(i, w)<table><tr><td>Wi</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr><tr><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr><tr><td>3</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr><tr><td>4</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr></table>

11.（共8分）解:本题目实质上就是Huffman编码问题，过程参见图1。

具体方案为:

①将长为18的木板锯为长为7和11的两块，开销为18；

②将长为7的0木板锯为长为3和4的两块，开销为7;

③将长为3的木板锯为长为1和2的两块，开销为3；

④将长为4的木板锯为长为2和2的两块，开销为4;

⑤将长为11的木板锯为长为5和6的两块，开销为11；

总（最小）开销为43。

## 第三部分、算法设计与分析。（共50分）

12.（共12分）解:（过程不唯一）

(1)设 $m ( i , j )$ 表示按要求切割从位置 $p _ { i }$ 到位置 $. p _ { j }$ 的木板所用的最小开销，其中0≤i<j≤N。递推关系及初值为:

$$m(i,j)=\left\{\begin{matrix}0&,  if   j-i=1 \\\min\left\{m(i,k)+m(k,j)+p_j-p_i\right\}&,i+1\leq k\leq j-1\end{matrix}\right.$$

题目目标为 m(0, N)。

[page:3]

伪代码为:

输入: $L 、 n 、 L_{1} 、 L_{2} 、 \cdots 、 L_{N}$

输出:此时的最小总开销

1. $\mathtt { f o r } i = 0 \; \mathtt { t o } \; N - 1$

2. $m ( i , i + 1 ) \leftarrow 0$

3. $\mathtt { f o r } l { = } 2 \mathtt { t o } N$

4. $\mathtt { f o r } i = 0 \; \mathtt { t o } \; N - l$

5. j←i+l

6. $m ( i , j ) \leftarrow + \infty$

7. $\mathtt { f o r } k = i + 1 \mathtt { t o } j - 1$

8. $\mathrm{i} \; \mathrm{f} \; m(i, k) + m(k, j) + p_j - p_i < m(i, j) \; \mathrm{then}$

9. $m(i,j) \leftarrow m(i,k) + m(k,j) + p_j - p_i$

10. return m(0, N)

(2) $p_{0}=0,\ p_{1}=7,\ p_{2}=9,\ p_{3}=15,\ p_{4}=20,\ p_{5}=30 。$

表 3 m(i, j)<table><tr><td>ji</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>0</td><td>0</td><td>9</td><td>23</td><td>40</td><td>68</td></tr><tr><td>1</td><td></td><td>0</td><td>8</td><td>21</td><td>44</td></tr><tr><td>2</td><td>/</td><td>/</td><td>0</td><td>11</td><td>32</td></tr><tr><td>3</td><td>/</td><td>1</td><td>/</td><td>0</td><td>15</td></tr><tr><td>4</td><td>一</td><td>/</td><td>/</td><td>/</td><td>0</td></tr></table>

## 13.（共12分）解:（过程不唯一）

参考伪代码如下（8分）:

$\scriptstyle \mathrm { I S - V A L I D }   ( \; A [ 1 . . n ] ,   t a r g e t \; )$ //主函数

1. $\mathtt { i n i t i a l i z e } \; \underline { { c n t } } [ 1 . . 5 0 ] \; \mathtt { w i t h } \; 0$

2. $m a x n \gets \mathtt { m a x } ( \mathcal { A } [ 1 ] , \mathcal { A } [ 2 ] , . . . , \mathcal { A } [ n ] )$ //表示最大元素的值

3. $\begin{array} { r } { m i n n \leftarrow \mathtt { m i n } ( A [ 1 ] , A [ 2 ] , . . . , A [ n ] ) } \end{array}$ //表示最小元素的值

4. $total \leftarrow A[1] + A[2] + \cdots + A[n]$

5. $\mathtt { f o r } i = 1 \; \mathtt { t o } \; n \; \mathtt { d o }$

6. $c n t [ A [ i ] ] \leftarrow c n t [ A [ i ] ] + 1$ //表示按元素大小统计个数

7. $\mathtt { r e t u r n \_ d f s } \; ( m a x n , n , 0 , t a r g e t , t o t a l , m a x n , m i n n )$

[page:4]

dfs ( i, num, sum, target, total, maxn, minn )

∥/num变量表示还要考虑几个不同的元素大小，sum变量表示当前考虑的子数组/子序列中元素的和，i表示下一个备选数字是多少

1. if num = 0 then return true
2. if sum = target then
3. return dfs (maxn, n, 0, target, total, maxn, minn)
4. if sum + minn > len or sum + total < target then
5. return false
6. forj =i down to minn do
7. if cnt[j] > 0 and sum + j ≤ target then
8. cnt[j] ← cnt[j] − 1
9. if dfs (j, num−1, sum+j, target, total-j, maxn, minn) then
10. return true
11. cnt[j] ← cnt[j] + 1
12. if sum = 0 or sum + j = target then
13. break
14. return false

算法思路:回溯搜索每个数是否需要选择到某个子数组中。应从最大数到最小数逐个搜索，因为这样可以将剩余问题尽可能的减小。

剪枝依据（4分，只要回溯过程正确且剪枝依据非平凡均可得分）:

1. 如果当前子数组和加上最小元素的值仍然大于target，不用继续往下搜索了。(dfs函数的第4行)

2. 如果当前子数组的和加上剩余的总长度仍然小于target，也不用继续往下搜索了。（dfs函数的第4行）

3.如果当前子数组为空，则当前搜索过程中选择的元素必须在该子数组中，否则不存在解。（dfs函数的第12行）

4. 如果当前搜索的数字加上子数组的和正好等于target，但是加上它之后剩余的元素不能分成若干个子数组且和均为 target，则不存在解（dfs函数的第12行）。

5.在搜索的过程中，若当前元素决定不被放入到当前子数组中，则相同的元素也都不再放入到当前子数组中。（IS-VALID第6行按元素大小统计个数，及dfs函数的第第6、9行，选择该元素时下一个状态可以继续选择该元素，而不选择该元素时则直接跳过，搜索进入下一个不同的数字)。

[page:5]

14.（共14分）解:令 $t _ { i } { = } c _ { i } { - } \nu _ { i }$ ，其中1≤i≤n。将所有商品分为两类:I类商品满足 $t _ { i } { \leq } 0$ (推广走量)；Ⅱ类商品满足 $t _ { i } { > } 0$

（1）（3分）施行两阶段贪心策略:第一阶段针对I类商品，按照定价低者优先，依次买完所有商品；第二阶段针对Ⅱ类商品，按照返现高者优先，依次买完所有商品。

（2）（8分）参考伪代码如下:

1.  list A←Λ, B←Λ //将序列A和B初始化为空序列，
//将分别存放I类商品，按和Ⅱ类商品

2. fori=1 ton
3. ti=ci−Vi,
4. i f t≤0 then append (ci, vi) to list A
5. else append i to list A
6. sort A according to $c _ { i }$ non-decreasingly
7. sort B according to vi non-increasingly
8. return A°B //返回A、B两个序列的连接

（3）（3分，以下为详细完整的证明，学生答出其大意即可。）

假设 $s_{1}, s_{2}, \cdots, s_{n}$ 是购买所有商品的一个顺序。定义其中的三类“逆序”:

第①类逆序:如果存在1≤x<y≤n而商品 $S _ { X }$ 属于第ⅡI类且商品 $S _ { y }$ 属于第I类，则称此时$( s _ { x } ,   s _ { y } )$ 构成一个第①类逆序。

第②类逆序:如果存在 1≤x<y≤n 且商品 $S _ { X }$ 和商品 $S _ { y }$ 都属于第I类且 $| c _ { s _ { x } } > c _ { s _ { y } }$ ，则称此时 $\left( s _ { x } ,   s _ { y } \right)$ 构成一个第②类逆序。

第③类逆序:如果 1≤x<y≤n 且商品 $S _ { X }$ 和商品 $S _ { y }$ 都属于第Ⅱ类且 $\overline { { \mathinner { | { v _ { s _ { x } } < v _ { s _ { y } } } } } }$ ，则称此时 $( s _ { x } ,$ $s _ { y } )$ 构成一个第③类逆序。

假设 $S ^ { * } )$ 是能够保证购买所有商品且初始钱数最少的所有解中三类逆序数之和最小的解之一，其购买顺序为 $i_{1}, i_{2}, \cdots, i_{n}$

观察结果1:如果一个完成任务的顺序中有一个第①类逆序，那么就一定存在某个1≤x<n使得 $( s _ { x } ,   s _ { x + 1 } )$ 构成一个第①类逆序。（学生可直接使用此结论而不加证明。)

结论1: $S ^ { * }$ 中不存在第①类逆序。

采用反证法。假设 $S ^ { * }$ 中存在第①类逆序，则由观察结果1可知 $S ^ { * }$ 中存在第①类逆序$( s _ { x } ,   s _ { x + 1 } )$ ，其中 $1 \leq x \leq n$ 。商品 $S _ { X }$ 属于第Ⅱ类且商品 $S _ { x + 1 }$ 属于第I类。

记在购买商品 $S _ { X }$ 之前苗苗手中的钱数为w，则有 $\dot { \boldsymbol { w } } \ge c _ { s _ { x } }$ ；且如图2(a)所示，在购买

[page:6]

商品之后苗苗手中的钱数为 $w - c _ { s _ { x } } + v _ { s _ { x } }$ 。由 $S ^ { * }$ 的定义可知 $w - c _ { s _ { x } } + v _ { s _ { x } } \geq c _ { s _ { x + 1 } }$

交换商品 $S _ { X }$ 和商品 $S _ { x + 1 }$ 的购买次序后，如图2(b)所示。由第Ⅱ类商品的定义可知 $| c _ { s _ { x } } >$ $v _ { s _ { x } }$ ，因此由 $w - c _ { s _ { x } } + v _ { s _ { x } } \geq c _ { s _ { x + 1 } }$ 可得 $w \geq c _ { s _ { x + 1 } } + \left( c _ { s _ { x } } - v _ { s _ { x } } \right) > c _ { s _ { x + 1 } }$ ，于是用w元可以购买商品 $S _ { x + 1 }$ ；购买商品 $S _ { x + 1 }$ 之后，苗苗手中的钱数为 $i w - c _ { s _ { x + 1 } } + v _ { s _ { x + 1 } }$ ，由第I类商品的定义可知 $\mathbb { I } c _ { s _ { x + 1 } } \leq v _ { s _ { x } }$ ，因此 $w - c _ { s _ { x + 1 } } + v _ { s _ { x + 1 } } { \geq } w \geq c _ { s _ { x } }$ ，即仍然可以购买商品 $S _ { X }$ 0

因此，交换商品 $S _ { X }$ 和商品 $S _ { x + 1 }$ 的购买次序后，仍然构成保证购买所有商品的解且初始钱数不会增加，但是交换商品 $S _ { X }$ 和商品 $S _ { x + 1 }$ 的购买次序导致总逆序数严格减少，于是和 $S ^ { * }$ 的假设产生矛盾。

由此可知能够保证购买所有商品且初始钱数最少的所有解中三类逆序数之和最小的解之一必定是如图3所示的形式。

在此基础上，可以得到以下两个观察结果及两个结论。

观察结果2:如果一个完成任务的顺序中有一个第②类逆序，那么就一定存在某个1≤x<n 使得 $( s _ { x } ,   s _ { x + 1 } )$ 构成一个第②类逆序。（学生可直接使用此结论而不加证明。)

结论 2: $S ^ { * }$ 中不存在第②类逆序。

采用反证法。假设 $S ^ { * }$ 中存在第 $\oslash$ 类逆序，则由观察结果2可知 $S ^ { * }$ 中存在第②类逆序$( s _ { x } ,   s _ { x + 1 } )$ ，其中 $1 \leq x \leq n$

记在购买商品 $S _ { X }$ 之前苗苗手中的钱数为w，则有 $\dot { \boldsymbol { w } } \ge c _ { s _ { x } }$ ；且如图2(a)所示，在购买商品之后苗苗手中的钱数为 $w - c _ { s _ { x } } + v _ { s _ { x } }$ 。由 $S ^ { * }$ 的定义可知 $w - c _ { s _ { x } } + v _ { s _ { x } } \geq c _ { s _ { x + 1 } }$

交换商品 $S _ { X }$ 和商品 $S _ { x + 1 }$ 的购买次序后，如图2(b)所示。由第②类逆序的定义可知 $c _ { s _ { x } } \geq$ $c _ { s _ { x + 1 } }$ ，因此用w元可以购买商品 $s _ { x + 1 } ;$ 购买商品 $S _ { x + 1 }$ 之后，苗苗手中的钱数为 $| w - c _ { s _ { x + 1 } } +$ $v _ { s _ { x + 1 } }$ ，由 $w - c _ { s _ { x } } \geq 0$ 及 $v _ { s _ { x + 1 } } - c _ { s _ { x + 1 } } \geq 0$ 可知 $\left( w - c _ { s _ { x + 1 } } + v _ { s _ { x + 1 } } \right) - c _ { s _ { x } } { \geq } 0$ ，即仍然可以购买商品 $S _ { X }$

[page:7]

因此，交换商品 $S _ { X }$ 和商品 $S _ { x + 1 }$ 的购买次序后，仍然构成保证购买所有商品的解且初始钱数不会增加，但是交换商品 $S _ { X }$ 和商品 $S _ { x + 1 }$ 的购买次序导致总逆序数严格减少，于是和 $S ^ { * }$ 的假设产生矛盾。

观察结果3:如果一个完成任务的顺序中有一个第③类逆序，那么就一定存在某个1≤x<n 使得 $( s _ { x } ,   s _ { x + 1 } )$ 构成一个第③类逆序。（学生可直接使用此结论而不加证明。）

结论3: $S ^ { * }$ 中不存在第③类逆序。

采用反证法。假设 $S ^ { * }$ 中存在第③类逆序，则由观察结果3可知 $S ^ { * }$ 中存在第③类逆序$( s _ { x } ,   s _ { x + 1 } )$ ，其中 $1 \leq x \leq n$

记在购买商品 $S _ { X }$ 之前苗苗手中的钱数为w，则有 $\dot { \boldsymbol { w } } \ge c _ { s _ { x } }$ ；且如图2(a)所示，在购买商品之后苗苗手中的钱数为 $w - c _ { s _ { x } } + v _ { s _ { x } }$ 。由 $S ^ { * }$ 的定义可知 $| w - c _ { s _ { x } } + v _ { s _ { x } } \geq c _ { s _ { x + 1 } }$

交换商品 $S _ { X }$ 和商品 $S _ { x + 1 }$ 的购买次序后，如图2(b)所示，由第③类逆序的定义可知 $| v _ { s _ { x } } <$ $v _ { s _ { x + 1 } }$ 。由第Ⅱ类商品的定义可知 $c _ { s _ { x } } > v _ { s _ { x } }$ ，因此由 $w - c _ { s _ { x } } + v _ { s _ { x } } \geq c _ { s _ { x + 1 } }$ 可得 $w \geq c _ { s _ { x + 1 } } +$ $\left( c _ { s _ { x } } - v _ { s _ { x } } \right) > c _ { s _ { x + 1 } }$ ，于是用w元可以购买商品 $s _ { x + 1 } ;$ 购买商品 $S _ { x + 1 }$ 之后，苗苗手中的钱数为 $i w - c _ { s _ { x + 1 } } + v _ { s _ { x + 1 } }$ ，可得 $\left( w - c _ { s _ { x + 1 } } + v _ { s _ { x + 1 } } \right) - c _ { s _ { x } } > \left( w - c _ { s _ { x } } + v _ { s _ { x } } \right) - c _ { s _ { x + 1 } } { \geq } 0$ ，即仍然可以购买商品 $S _ { X }$

因此，交换商品 $S _ { X }$ 和商品 $S _ { x + 1 }$ 的购买次序后，仍然构成保证购买所有商品的解且初始钱数不会增加，但是交换商品 $S _ { X }$ 和商品 $S _ { x + 1 }$ 的购买次序导致总逆序数严格减少，于是和 $S ^ { * }$ 的假设产生矛盾。

结论 4: $S ^ { * }$ 中不存在任何一类逆序中的任何一个，于是其就是贪婪解。

15.（共12分）解:（过程不唯一）本质上就是找到一个位置l， $A[l] > A[l+1]$

（1）（6分)

FIND-CIRCULAR-SHIFT(A, n)
1. L ←1,R← n
2. while R-L> 1 Do
3. M← (L+R)/2
4. if A[L] < A[M] then
5. L←M
6. else
7. R←M
8. returnL

[page:8]

（2）（3分）由于数组中的所有元素均不相等且循环右移前数组单调上升，于是若数组被循环右移，则一定有A[1]>A[n]。只要找出满足A[]>A[l+1]的l即可（下文称其为“间断点”)。我们采用二分查找方法，不包含间断点的“一半”一定是单调增的(于是“左端’的值小于“右端”的值)，而包含间断点的“一半”的值则有如图4中所示的特点（于是“左端”的值大于“右端”的值)。

在算法第2~7行的每次迭代中，都确保间断点的位置（下标/索引）在L（含）~R（不含）中，直至寻找间断点的范围只包含数组中两项时，它们必然就是A[]和A[l+1]

（3）（3分）

用 T(n)表示输入为 n时，递推式为 $T(n)=T\left(\frac{n}{2}\right)+n(n>2),T(2)=0$ ，其解为T(n) ∈ $\Theta ( \log _ { 2 } n )$
