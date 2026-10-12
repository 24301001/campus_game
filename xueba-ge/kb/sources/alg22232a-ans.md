---
course: 算法设计与分析
book: 算法设计与分析 2022—2023学年第2学期期末试卷(A卷) 参考答案与评分标准
book_id: alg22232a-ans
source_type: past_paper
ocr: MinerU 4.0 (ocr-mode=ocr) 2026-09-21
---

[page:1]

## 北京交通大学考试试题(A卷)

## 参考答案与评分标准

课程名称:算法设计与分析 学年学期:2022—2023学年第2学期

课程编号:M210004B开课学院:软件学院出题教师:刘铎，吴睿智，李令昆

## 第一部分、单项选择题。（共20分)

<table><tr><td>1.</td><td>2.</td><td>3.</td><td>4.</td><td>5.</td><td>6.</td><td>7.</td><td>8.</td><td>9.</td><td>10.</td></tr><tr><td>D</td><td>A</td><td>C</td><td>B</td><td>D</td><td>B</td><td>D</td><td>C</td><td>B</td><td>D</td></tr></table>

## 第二部分、计算题。（共30分）

11.（共12分）解:变量定义如图1所示。用0-1变量 $x_{1},x_{2},y_{1},y_{2},y_{3},y_{4}$ 分别表示是否选择该有向边，1表示选择，0表示不选择。（4分）

则可得到线性规划模型如下（目标3分、等式组3分、变量类型约束2分）。

MIN $3+1x_{1}+0x_{2}+10y_{1}+11y_{2}+11y_{3}+4y_{4}$

ST $x _ { 1 }   +   x _ { 2 }   -   1   =   0$

$$y _ { 1 } { + } y _ { 2 } { - } x _ { 1 } { = } 0$$

$$y_{3}+y_{4}-x_{2}=0$$

$$x_{1},x_{2},y_{1},y_{2},y_{3},y_{4} \in \{0,1\}$$

12.（共10分）解:

（1）（1+2+1分）令S[1]S[2]S[3]...S[n]表示输入序列， $L(i) \quad (1 \leq i \leq n)$ 表示以 S[i]结束的最长单调递增子序列的长度，P(i)表示这个最长单调递增子序列中在Si]之前一项（即倒数第二项）的位置。如果 $L ( i ) { = } 1$ (即该子序列只包含S[i]，而没有倒数第二项)，则取$P ( i ) { = } 0$ o

[page:2]

（2）（2+2分）过程如表1所示。

(3)(2分)最长单调递增子序列是[65158170239300389](65,158,170,239,300,389)。

表1<table><tr><td>i</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td></tr><tr><td>S[i]</td><td>65</td><td>158</td><td>170</td><td>155</td><td>239</td><td>300</td><td>207</td><td>389</td></tr><tr><td>L(i)</td><td>1</td><td>2</td><td>3</td><td>2</td><td>4</td><td>5</td><td>4</td><td>6</td></tr><tr><td>P(i)</td><td>0</td><td>1</td><td>2</td><td>1</td><td>3</td><td>5</td><td>3</td><td>6</td></tr></table>

13.（共8分）解:(1) TA(n)=k×TA(n/5) T(5)=k T(n)∈Θ(nlog5k) (2+1 分) (2)TB(n)=t×TB(n/4) T(4)=t T(n)∈Θ(nlog4′) (2+1 分)

（3)当 $\log _ { 5 } k < \log _ { 4 } t$ 时，即 $\frac{\ln k}{\ln t} < \frac{\ln 5}{\ln 4} = \log_{4}$ 5时，算法 $A _ { \mathbf { p u s } }$ 的时间复杂性将优于 $\pmb { B _ { \mathrm { p l u s } } }$的。(2分)

## 第三部分、综合分析题。（共50分）

14.（共12分）解:（过程不唯一）

参考解法一（byLi)。

（1）（9分）
IS-MATCH (str, prefix)
if (len(str) < len(prefix)) then return FALSE
for i = 1 to m
if str[i] ≠ prefix[i]
return FALSE
return TRUE
LOWER-BOUND (A, prefix)
1←0, r←n+1
while (r - 1 > 1)
mid ← (1+r) / 2
if (A[mid] >= prefix) then r ← mid
else 1 ← mid
return r

[page:3]

UPPER-BOUND (A, prefix, index)
1 ← index, r ← n+1
while (r - 1 > 1)
mid ← (1+r) / 2
if (IS-MATCH(A[mid], prefix)) then 1 ← mid
else r ← mid
return r
COUNT-PREFIX (A, prefix)
1 ← LOWER-BOUND (A, prefix)
if (l=n+1 or (not IS-MATCH(A[1], prefix))) then return 0
r ← UPPER-BOUND(A, prefix, 1)
return r - l

(2)(3 分)IS-MATCH 的时间复杂度为 O(m), LOWER-BOUND 的时间复杂度为 O(1og n)，UPPER-BOUND 的时间复杂度为 O(m log n)。因此 COUNT-PREFIX的时间复杂度为O(m log n)。

参考解法二（by Liu)。

（1）（9分）

IS-MATCH (str, prefix)
if (lengthof(str) < m) then return FALSE
for i = 1 to m
if str[i] ≠ prefix[i] then
return FALSE
return TRUE
FindFirst (left, right)
low←left, high←right, label←-1
while (low≤high) do
mid←(1ow+high)/2
if (IS-MATCH(A[mid], prefix))
label←mid, high←mid-1
else if (Key<A[mid]) high←mid-1
else low←mid+1
return label

[page:4]

FindLast (left, right)

low←left, high←right, label←-1
while(low≤high) do
mid←(1ow+high)/2
if (IS-MATCH(A[mid], prefix))
label←mid, low←mid+1
else if (Key<A[mid]) high←mid-1
else low←mid+1
return label
COUNT-PREFIX (A, prefix)

输入：A[0..n-1], prefix

输出:A中前缀为 prefix 的字符串个数

from←FindFirst(0, n-1)
to←FindLast(0, n-1)
if(from<0)then output0
else output to-from+1

(2)（3分）IS-MATCH的时间复杂度为 O(m)，设FindFirst/FindLast的时间复杂度为 T(n)（二者流程类似)，则 T(n)=T(n/2)+O(m)，T(1)∈O(m)，即 T(n)∈O(m 1og n)。因此 COUNT-PREFIX 的时间复杂度为 O(m log n)。

15.（共12分）解:

（1）（4分）将怪兽按T/D的值由小到大排序，依次击败。

（2）（4分）（参考示例伪代码，不唯一）

BEAT-MONSTER(Monster[])
SORT(Monster) //将怪兽按T/D按不减顺序排序
return Monster[]

(3)（4分)

（证明方式一）假设有一个怪兽的击败顺序为 $I A = ( 1 ^ { \prime } , 2 ^ { \prime } , 3 ^ { \prime } , \cdots , n ^ { \prime } )$ ，则怪兽1'对村庄的破坏强度为0（一开始就击败它，不会对村庄产生破坏），怪兽2′对村庄的破坏强度为$T _ { 1 ^ { ' } } \times D _ { 2 ^ { ' } }$ ，怪兽3′对村庄的破坏强度为 $( \boldsymbol { T } _ { 1 ^ { \prime } } + \boldsymbol { T } _ { 2 ^ { \prime } } ) \times \boldsymbol { D } _ { 3 ^ { \prime } } . . . . . . ,$ 以此类推，怪兽k′对村庄的破坏强度为 $\begin{array} { r } { i D _ { k ^ { \prime } } \times \sum _ { i = 1 } ^ { k - 1 } T _ { i ^ { \prime } } } \end{array}$ o

[page:5]

同理，怪兽 $( k + 1 ) ^ { \prime }$ 对村庄的破坏强度为 $\begin{array} { r } { i D _ { ( k + 1 ) ^ { \prime } } \times \sum _ { i = 1 } ^ { k } T _ { i ^ { \prime } } } \end{array}$

交换怪兽 $k'  和  (k + 1)'$ 对怪兽 $\cdot i \in [ 1 ^ { \prime } , ( k - 2 )$ ]和怪兽 $\cdot i \in [ ( k + 2 ) ^ { \prime } , n ^ { \prime } ]$ 对村庄产生的总破坏无影响。（8分）

因此设顺序B为顺序A中交换怪兽k'和(k+1)′，对村庄产生的总破坏变小了，即有:

$$\begin{aligned} D(B) - D(A) &= D_{(k+1)'} \times \sum_{i=1}^{k-1} T_{i'} + D_{k'} \times \left( \sum_{i=1}^{k-1} T_{i'} + T_{(k+1)'} \right) \\&- D_{k'} \times \sum_{i=1}^{k-1} T_{i'} - D_{(k+1)'} \times \sum_{i=1}^{k} T_{i'} \\&= D_{k}' \times T_{(k+1)'} - D_{(k+1)'} \times T_{k}' < 0\\ \end{aligned}$$

即 $D _ { k ^ { \prime } } \times T _ { ( k + 1 ) ^ { \prime } } < D _ { ( k + 1 ) ^ { \prime } } \times T _ { k } ^ { \prime }$ ，即 $\begin{array} { r } { | \frac { T _ { k ^ { \prime } } } { D _ { k } ^ { \prime } } > \frac { T _ { ( k + 1 ) ^ { \prime } } } { D _ { ( k + 1 ) ^ { \prime } } } \mathrm { , } } \end{array}$

也就是说，若任意一个顺序中存在相邻两个怪兽，它们满足关系 $\begin{array} { r } { \mathrm { i } \frac { T _ { k ^ { \prime } } } { D _ { k } ^ { \prime } } > \frac { T _ { ( k + 1 ) ^ { \prime } } } { D _ { ( k + 1 ) ^ { \prime } } } } \end{array}$ ，那么我们交换击败它们的先后顺序，可以使得对村庄的总的破坏力变小。在新的击败顺序中，如果还有相邻的两个怪兽满足上述关系，再交换它们可以使得村庄受到的总破坏再变小，重复这个过程，当顺序无法产生任何交换时，村庄受到的总的破坏力是最小的，此时有击败顺序 $( 1 ^ { \prime } , 2 ^ { \prime } , 3 ^ { \prime } , \cdots , n ^ { \prime } )$ ，满足: $\frac{T_{1'}}{D_{1'}} < \frac{T_{2'}}{D_{2'}} < \frac{T_{3'}}{D_{3'}} < \cdots < \frac{T_{n'}}{D_{n'}}$

(证明方式二)

首先，最优方案中无空闲时间，且打倒所有怪兽的总时间是确定的。

定义:若在打怪兽顺序 $i_{1},   i_{2},   \cdots,   i_{n}$ 中存在 $1 \leq a < b \leq n$ 且 $\begin{array} { r } { \frac { T _ { i _ { a } } } { T _ { D _ { i _ { a } } } } > \frac { T _ { i _ { b } } } { D _ { i _ { b } } } , } \end{array}$ ，则称此时 $( i _ { a } ,   i _ { b } )$ 构成一个逆序。

如果一个（无空闲时间的）打怪兽顺序方案中有一对逆序，那么就一定存在两个相邻的任务形成逆序。（学生可直接使用此结论而不加证明。)

由算法可知贪婪解中不存在逆序。

假设 $S ^ { * } ]$ 是一个最优解，其打怪兽顺序为 $i_{1},i_{2},\cdots,i_{n} 。$

①若 $S ^ { * }$ 中不存在逆序，则其就是贪婪解。

②如果 $S ^ { * }$ 中存在逆序 $( i _ { a } ,   i _ { a ^ { + } 1 } )$ ，则对换打怪兽 $i _ { a }$ 和打怪兽 $i _ { a + 1 }$ 的次序后，

总破坏的变化值为: $\begin{array} { r } { D _ { i _ { a } } \times T _ { i _ { a + 1 } } - D _ { i _ { a + 1 } } \times T _ { i _ { a } } = D _ { i _ { a } } D _ { i _ { a + 1 } } \left( \frac { T _ { i _ { a + 1 } } } { D _ { i _ { a + 1 } } }   -   \frac { T _ { i _ { a } } } { D _ { i _ { a } } } \right) < 0 } \end{array}$ ，与 $S ^ { * }$ 的最优性产生矛盾。

[page:6]

因此最优解必定与贪婪解相同。

16.（共13分）解:（解法不唯一，采用不同思路亦可根据实际情况适当给分）

（1）（共6分）令 $\begin{array} { r } { W = \lfloor \sum _ { i = 1 } ^ { n } w _ { i }   / 2 \rfloor } \end{array}$ 。设两队人的总体重为A和 $B , A { \leq } B$ ，则 $B - A =$ $\textstyle \sum _ { i = 1 } ^ { n } w _ { i } - 2 A$ 。要使得B-A尽量小，即等价于在 $\textstyle A \leq \sum _ { i = 1 } ^ { n } w _ { i }$ 且 $A { \leq } B$ 且 $A { + } B { = } { \textstyle \sum _ { i = 1 } ^ { n } w _ { i } }$ 条件下使得A的值尽量大。而这又等价于在 $A \leq W$ 条件下使得A的值尽量大（于是类似于背包问题/装载问题)。

令从前k个人中选择总体重不超过W的若于人所能取得的最大总体重为 $F ( k , y )$

递推关系及初值为:

$$F\left( k,y \right) = \left\{ \begin{matrix} 0 & ,  if   k = 0   or   y = 0 \\F\left( k - 1,y \right) & , 1 \leq k \leq n,1 \leq y \leq W,   w_{k} > y \\\min\left\{ F\left( k - 1,y \right),F\left( k - 1,y - w_{k} \right) + w_{k} \right\} & , 1 \leq k \leq n,1 \leq y \leq W,   w_{k} \leq y \\\end{matrix} \right.$$

伪代码为:

输入:人数 $n , n$ 人的体重 $w_{1}, w_{2}, \cdots, w_{n}$

输出:所有分队方案中最小可能体重差

1. W← [∑i=1wi/2]
2. for y = 0 to W
3. F(0, y)←0
4. for k = 1 to n
5. F(k, 0)←0
6. for k = 1 to n
7. for y = 1 to W
8. F(k, y)←F(k–1, y)
9. if wk≤y then
10. if F(k-1, y−wk)+wk>F(k, y) then
11. F(k, y)←F(k−1, y−wk)+wk

12. $return $\frac { \sum _ { i = 1 } ^ { n } w _ { i } } { 2 } - 2 F ( n , W )$$

[page:7]

（2）（共7分）过程如表2所示 $\begin{array} { r } { ( W = \lfloor \sum _ { i = 1 } ^ { n } w _ { i }   / 2 \rfloor = 1 3 ) } \end{array}$ ，最小体重差为2 —分为11、3和5、4、3两队。

表2<table><tr><td>yk</td><td>0</td><td></td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>11</td><td>11</td><td>11</td></tr><tr><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>11</td><td>11</td><td>11</td></tr><tr><td>3</td><td>0</td><td>0</td><td>0</td><td>0</td><td>4</td><td>5</td><td>5</td><td>5</td><td>5</td><td>9</td><td>9</td><td>11</td><td>11</td><td>11</td></tr><tr><td>4</td><td>0</td><td>0</td><td>0</td><td>3</td><td>4</td><td>5</td><td>5</td><td>7</td><td>8</td><td>9</td><td>9</td><td>11</td><td>12</td><td>12</td></tr><tr><td>5</td><td>0</td><td>0</td><td>0</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>12</td></tr></table>

17.（共13分）解:（解法不唯一，采用不同思路亦可根据实际情况适当给分）问题分析同题16。

（1）（3分）依次考虑各个人。用0-1变量表示 $x _ { 1 } , x _ { 2 } , x _ { 3 } , x _ { 4 } , x _ { 5 }$ 分别表示是否选择第i个人加入体重和为A的队伍（即不是总体重“偏重”的一队），1表示选择，0表示不选择。

维护“到目前为止， $在  A \leq W$ 条件下，A的最优值”current_best。

设已经考虑了i个人，用 $C _ { a } ( i )$ 表示目前已经选定的人的总体重， $C _ { e } ( i )$ 表示未考虑的人的总体重，则估界函数为 $C _ { a } ( i ) { + } C _ { e } ( i )$

若i=n 且 $C _ { a } ( n ) \textgreater c u r r e n t \_ b e s t$ ，则更新 current_best 为 $C _ { a } ( n )$

剪枝依据:

①若i≠n，且 $C _ { a } ( i ) \mathrm { > } W$ ，则进行剪枝。（事实上，先判断加第i+1个人的体重后是否超过W，如果是的话则不再考虑继续进行。)

②若i≠n，且 $C _ { a } ( i ) { + } C _ { e } ( i ) { \leq } c u r r e n t \_ b e s t$ 则进行剪枝。

（2）（7分）剪枝后的（部分）搜索树如图2所示。

（3）（3分）选择体重分别为11、3的组合一队，其他人组成另一队，最小总体重差为2。

[page:8]
