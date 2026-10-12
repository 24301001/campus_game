---
course: 算法设计与分析
book: 算法设计与分析 2021—2022学年第1学期期末试卷(A卷) 参考答案与评分标准
book_id: alg21221a-ans
source_type: past_paper
ocr: MinerU 4.0 (ocr-mode=ocr) 2026-09-21
---

[page:1]

## 北京交通大学考试试题(A卷)

课程名称:算法设计与分析学年学期:2021—2022学年第1学期课程编号:M210004B开课学院:软件学院出题教师:刘铎，童浩楠，吴睿智第一部分、单项选择题。请选择最适合的答案，并填涂到答题卡上。(共 16 分)

<table><tr><td>1.</td><td>2.</td><td>3.</td><td>4.</td><td>5.</td><td>6.</td><td>7.</td><td>8.</td></tr><tr><td>C</td><td>C</td><td>A</td><td>B</td><td>A</td><td>A</td><td>C</td><td>D</td></tr></table>

<table><tr><td>考察知识点</td><td>要求</td></tr><tr><td>算法的数学基础</td><td>掌握</td></tr><tr><td>典型的分治算法</td><td>掌握</td></tr><tr><td>可选择性地介绍典型的贪婪算法0-1 背包问题</td><td>掌握</td></tr></table>

## 第二部分、计算题。（共34分）

9.（共12分）解:

(1)

<table><tr><td>Running time of (a)</td><td>T(n)=5T(n/2)+O(n)</td><td><eq>\Rightarrow \mathrm{T}(n) = \mathrm{O}(n^{\log 2^{5}})</eq></td></tr><tr><td>Running time of (b)</td><td>T(n)=2T(n-1)+O(1)</td><td>⇒ T(n)=O(2n)</td></tr><tr><td>Running time of (c)</td><td>T(n)=9T(n/3)+O(n²)</td><td>⇒ T(n)=O(n2logn)</td></tr></table>

(2)按照阶从低到高的顺序，对以上3个算法的时间复杂度进行排序为:O(n²logn)，O(nlog25), O(2n)。

为了更快地解决问题，应选择算法C。

<table><tr><td>考察知识点</td><td>要求</td></tr><tr><td>分治算法的分析方法</td><td>理解</td></tr><tr><td>主定理</td><td>掌握</td></tr></table>

[page:2]

## 10.（共12分）解:

(1)

表 1 目标函数 m[i, j]<table><tr><td>m[i, j]</td><td>j=1</td><td>j=2</td><td>j=3</td><td>j=4</td><td>j=5</td><td>j=6</td></tr><tr><td>i=1</td><td>0</td><td>42</td><td>168</td><td>258</td><td>270</td><td>286</td></tr><tr><td>i=2</td><td></td><td>0</td><td>189</td><td>324</td><td>258</td><td>282</td></tr><tr><td>i=3</td><td></td><td></td><td>0</td><td>315</td><td>216</td><td>272</td></tr><tr><td>i=4</td><td></td><td></td><td></td><td>0</td><td>90</td><td>162</td></tr><tr><td>i=5</td><td></td><td></td><td></td><td></td><td>0</td><td>40</td></tr><tr><td>i=6</td><td></td><td></td><td></td><td></td><td></td><td>0</td></tr></table>

表 2 标记函数 s[i, j]<table><tr><td>s[i, j]</td><td>j=1</td><td>j=2</td><td>j=3</td><td><eq>j = 4</eq></td><td>j=5</td><td>j =6</td></tr><tr><td>i=1</td><td>/</td><td>1</td><td>2</td><td>3</td><td>1</td><td>5</td></tr><tr><td>i=2</td><td></td><td>/</td><td>2</td><td>3</td><td>2</td><td>5</td></tr><tr><td>i=3</td><td></td><td></td><td>/</td><td>3</td><td>3</td><td>5</td></tr><tr><td>i=4</td><td></td><td></td><td></td><td>/</td><td>4</td><td>5</td></tr><tr><td>i=5</td><td></td><td></td><td></td><td></td><td>/</td><td>5</td></tr><tr><td>i=6</td><td></td><td></td><td></td><td></td><td></td><td>/</td></tr></table>(2) ( $\left( \boldsymbol{A}_{1} \left( \boldsymbol{A}_{2} \left( \boldsymbol{A}_{3} \left( \boldsymbol{A}_{4} \boldsymbol{A}_{5} \right) \right) \right) \boldsymbol{A}_{6} \right)$ 或者 $\left( A _ { 1 } \left( A _ { 2 } \left( A _ { 3 } \left( A _ { 4 } A _ { 5 } \right) \right) \right) \right) A _ { 6 }$

<table><tr><td>考察知识点</td><td>要求</td></tr><tr><td>算法的数学基础</td><td>掌握</td></tr><tr><td>典型的分治算法</td><td>掌握</td></tr><tr><td>典型的贪婪算法 0-1 背包问题</td><td>掌握</td></tr></table>

11. （共10分）解:

（1）请给出目标函数和标记函数的定义/表示、递推关系和初值。

令目标函数 d(i)表示凑出总和i所需的最少硬币数量。则 d(i)的初始值为:

$$\left\{ \begin{matrix} d(0) = 0 \\ d(i) = +\infty & i < 0 \end{matrix} \right.$$

递推式为 $d(i)=\min_{1 \leq k \leq 4} \{ d(i-v_k) \} + 1$

令标记函数 s(i)表示计算 d(i)时取得的 k 值，即 $\arg \min_{1 \leq k \leq 4} \{ d(i - v_k) \}$ ，含义是取得 d(i)

[page:3]

时所选取的最后一枚硬币。

则 s(i)的初始值为 s(0)=0，s(i)的递推式为 $s(i) = \arg \min_{1 \leq k \leq 4} \{ d(i - v_k) \}$

（2）如表3所示。

表3<table><tr><td></td><td>-7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>-1</td><td>0</td><td></td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td></tr><tr><td>d(i)</td><td>8</td><td>8</td><td>8</td><td>8</td><td>8</td><td>8</td><td>8</td><td>0</td><td>1</td><td>2</td><td>3</td><td>1</td><td>2</td><td>1</td><td>2</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>3</td><td>4</td></tr><tr><td>s(i)</td><td></td><td>/</td><td></td><td></td><td></td><td>/</td><td>/</td><td></td><td>1</td><td>1</td><td>1</td><td>4</td><td>4</td><td>6</td><td>6</td><td>8</td><td>8</td><td>6</td><td>6</td><td>8</td><td>8</td><td>8</td><td>8</td><td>8</td><td>8</td><td>8</td><td>8</td></tr></table>

（3）付款的最优方案是使用一枚面值为8的硬币、一枚面值为6的硬币、一枚面值为4的硬币、一枚面值为1的硬币；或者三枚面值为6的硬币、一枚面值为1的硬币；共使用4枚硬币。

<table><tr><td colspan="2">考察知识点</td><td>要求</td></tr><tr><td>典型的动态规划算法</td><td>矩阵链乘积</td><td>掌握</td></tr></table>

## 第三部分、综合分析题。（共50分）

## 12.（共12分）解:

（1）贪心策略:按币值从大到小排列零钱，从币值大的开始，每种钱尽量多用。如果剩余钱数小于该币值，再考虑用下一种钱币。

即:

remainder ← y
for i = n downto 0
x ←  remainder / p
remainder ← remainder − x×p

解方案是:对所有 $0 \leqslant i \leqslant n$ ，取 $x _ { i }$ 个币值为 $p ^ { i }$ 的硬币。

（2）对n做归纳，证明:当只有面值为 $\{ p ^ { 0 } , \cdots , p ^ { n } \}$ 的硬币可用时，贪婪解和最优解相同。

①n=0时，贪婪解和最优解相同。

②假设n=k时，贪婪解和最优解相同。现在考虑n=k+1时的情况。

假设贪婪解是对所有 $0 \leqslant i \leqslant k+1$ ，取 $x _ { i }$ 个币值为 $p ^ { i }$ 的硬币。假设最优解是对所有 $0 { \leqslant }$ $i \leqslant k + 1$ ，取 $z _ { i }$ 个币值为 $p ^ { i }$ 的硬币。

则有Σk=+1 $\begin{array} { r } { x _ { i } p ^ { i } = \sum _ { i = 0 } ^ { k + 1 } z _ { i } p ^ { i } = y } \end{array}$ C

[page:4]

考虑到贪婪算法的流程，必定对于所有 $0 \leqslant i \leqslant k$ ，都有 $x _ { i } { < } p$ 。否则，如果有某个 $z _ { j } { \geqslant }$ $p, 0 \leqslant j \leqslant k$ 则贪婪算法会先选择1枚面值为 $p ^ { j + 1 }$ 的硬币，而不是 $p$ 枚面值为 $p ^ { j }$ 的硬币。且由贪婪算法可知 $\begin{array} { r } { \mathbb { I } { \sum _ { i = 0 } ^ { k } x _ { i } p ^ { i } } \leq p ^ { k + 1 } - 1 } \end{array}$

断言:对于所有 $0 \leq i \leq k$ ，都有 $z _ { i } { < } p$ 。否则，如果有某个 $z _ { j } \geqslant p , 0 \leqslant j \leqslant k ,$ 则用1枚面值为 $p ^ { j + 1 }$ 的硬币替换 $p$ 枚面值为 $p ^ { j }$ 的硬币，硬币总币值不变，而硬币总个数减少 $P ^ { - 1 }$

②于是Σk $\begin{array} { r } { \phantom { } _ { = 0 } z _ { i } p ^ { i } \leq ( p - 1 ) \times \sum _ { i = 0 } ^ { k } p ^ { i } = p ^ { k + 1 } - 1 } \end{array}$ 0

考虑到贪婪算法的流程，所以必定有 $x_{k + 1} \geq z_{k + 1}$

于是，若 $x _ { k + 1 } { > } z _ { k + 1 }$ ，则

$$\begin{align*}p^{k+1} \leq (x_{k+1}p^{k+1} - z_{k+1}p^{k+1}) = \left(y - \sum_{i=0}^{k} x_i p^i \right) - \left(y - \sum_{i=0}^{k} z_i p^i \right) = \sum_{i=0}^{k} z_i p^i - \sum_{i=0}^{k} x_i p^i \\ \leq \sum_{i=0}^{k} z_i p^i \leq p^{k+1} - 1 < p^{k+1}\end{align*}$$

产生矛盾，因此必然有 $x_{k + 1} = z_{k + 1}$

$$\begin{array} { r l r } { \bigcirc } & { { } y - x _ { k + 1 } p ^ { k + 1 } = \sum _ { i = 0 } ^ { k + 1 } x _ { i } p ^ { i } \leq p ^ { k + 1 } - 1 \quad \mathrm { ~  且  ~ } \quad \sum _ { i = 0 } ^ { k + 1 } x _ { i } p ^ { i } = y - x _ { k + 1 } p ^ { k + 1 } = y - } \end{array}$$

$\begin{array} { r } { z _ { k + 1 } p ^ { k + 1 } = \sum _ { i = 0 } ^ { k + 1 } z _ { i } p ^ { i } } \end{array}$ 。因此只能使用面值为 $\{ p ^ { 0 } , \; \cdots , p ^ { k } \}$ 的硬币，由归纳假设可知对于所有$0 \leq i \leq k$ ，都有 $z _ { i } { = } x _ { i }$ C

综上可得对于所有 $0 \leqslant i \leqslant k+1$ ，都有 $z _ { i } { = } x _ { i }$ ，即贪婪解和最优解相同。

（3）在（1）中设计的贪心策略在此时不能确保得到最优解。

例如， $m=n=1,\ p=4,\ q=5$ 时，要凑得总面值为8。如果是使用（1）中设计的贪心算法的基本策略，则需要1枚面值为5的硬币、3枚面值为1的硬币，共使用4枚硬币；而事实上最优方案是使用两枚面值为4的硬币。

<table><tr><td>考察知识点</td><td>要求</td></tr><tr><td>贪婪策略的基本思想</td><td>了解</td></tr><tr><td>贪婪算法的基本框架</td><td>掌握</td></tr><tr><td>贪婪算法最优性的分析与证明</td><td>理解</td></tr></table>

[page:5]

13.（共12分）解:

（1）（参考解答。程序伪代码不唯一。）

Initial Call
j ← Find(1, n)
Ifj>0 then outputj
else output“None"
Find ( start, end)
if start > end then return -1
else
j ← (start + end) / 2
if A[j] =j then returnj
else if A[j] <j then return Find[j+1, end ]
else return Find[ start, j-1]

（2）算法的时间复杂度的递推关系式和初值为:

$$\left\{ \begin{aligned} T(n) \leq & T(n / 2)+0(1) \quad n>1 \\ & T(1)=1 \end{aligned} \right.$$

由主定理可知 $T ( n ) { = } O ( \log n )$

<table><tr><td>考察知识点</td><td>要求</td></tr><tr><td>分治策略的基本思想</td><td>了解</td></tr><tr><td>分治算法的基本框架</td><td>掌握</td></tr><tr><td>分治算法的分析方法</td><td>理解</td></tr><tr><td>主定理</td><td>掌握</td></tr></table>

14.（共13分）解:

（1）将各个点进行坐标标号，并增加一些额外顶点，如图1所示。

令 $\nu ( i , j )$ 表示点(i,j)的值， $M ( i , j )$ 表示从点(1,1)到点(i,j)的道路最小数值和，则有:

$$\begin{aligned} &M(i,   1)   =   \nu(1,   1); \quad & if   j   =   0   or   i   =   0; \\&M(i, j)   =   \min(M(i   -   1, j), M(i, j   -   1))   +   \nu(i, j), \quad & otherwise. \\ \end{aligned}$$

标记函数 $s ( i , j ) { = } 1$ 表示到点(i,j)的最小数值和道路的最后一条边是从左侧来，即从(i, j−1)到(i,j); $s ( i , j ) { = } 0$ 表示到点(i,j)的最小数值和道路的最后一条边是从上方来，即从(i-1, j)到(i,j)的点(i,j)的值；s(1,1)=-1 表示初始值或到点(i,j)的最小数值和道路的最后一条边是从上方来，即从(i-1,j)到(i,j)的点(i,j)的值。则有:

$$\begin{align*}s(1,   1) &= -1; \\s(i, j) &= 0, &  if   (j \geq 1   or   i \geq 1)   and   M(i-1, j) &\leq  M(i, j-1) \\s(i, j) &= 1, &  if   (j \geq 1   or   i \geq 1)   and   M(i-1, j) &\geq  M(i, j-1).\end{align*}$$

[page:6]

（2）各个点的 $M ( i , j )$ 值如图2所示，各个点的s(i,j)值如图3所示。

（3）道路选择如图4所示，总数值和为12。

<table><tr><td>考察知识点</td><td>要求</td></tr><tr><td>动态规划的基本思想</td><td>掌握</td></tr><tr><td>动态规划的基本框架</td><td>理解</td></tr><tr><td>动态规划的实现方法</td><td>掌握</td></tr></table>

## 15.（共13分）解:

（1）将各个点进行坐标标号，如图5所示。令 $\nu ( i , j )$ 表示点(i,j)的值。

选择一条明显的道路（如图6所示），以其数值和（15）作为初始的界，即current_best←15。

如图7所示斜线方式考察 $m ( k ) = \operatorname* { m i n } \{ v ( i , j ) | i + j = k \}$ ，2≤k≤8。

维护“到目前为止的最优值”current_best。

令 $C _ { a } ( i , j )$ 为从(1,1)到当前点 $. ( i , j )$ 的道路的数值和，估值函数为 $\scriptstyle C _ { e } ( i , j ) = \sum _ { k = i + j + 1 } ^ { 8 } m ( k )$即估计还要发生的开销的下界。则估界函数为 $C _ { a } ( i , j ) + C _ { e } ( i , j )$ O

[page:7]

若(i,j)为点(4,4)且 $C _ { a } ( 4 , 4 ) { \leq } c u r r e n t \_ b e s t$ ，则更新 current_best 为 $C _ { a } ( 4 , . 4 )$若(i,j)不是点(4,4)且 $C _ { a } ( i , j ) + C _ { e } ( i , j ) \geq c u r r e n t \_ b e s t ,$ ，则进行剪枝。

（2）剪枝后的（部分）搜索树如图8所示。

（3）道路选择如图9所示，总数值和为12。

[page:8]

<table><tr><td>考察知识点</td><td>要求</td></tr><tr><td>回溯法的基本思想</td><td>了解</td></tr><tr><td>回溯法的基本框架</td><td>掌握</td></tr><tr><td>“剪枝”的概念</td><td>理解</td></tr><tr><td>对“界”的正确估算</td><td>掌握</td></tr></table>
