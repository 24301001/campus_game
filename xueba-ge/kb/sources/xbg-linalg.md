---
course: 线性代数
book: 线性代数与空间解析几何(第5版)
book_id: xbg-linalg
source_type: textbook
---

[page:1]

## 第一章矩阵及其初等变换

在自然科学和工程技术中有大量的问题与矩阵这一数学概念有关，并且这些问题的研究常常反映为对矩阵的研究.甚至有些表面上完全没有联系的、性质完全不同的问题，归结成矩阵问题以后却是相同的.这就使矩阵成为数学中一个极其重要的、应用广泛的工具，因而也就成为代数、特别是线性代数的一个主要研究对象，尤其是随着计算机的广泛应用，矩阵知识已成为现代科技人员必备的数学基础.

重点难点

本章主要介绍矩阵的运算、解线性方程组的高斯消元法与矩阵的初等变换、逆矩阵和分块矩阵.

## 1.1矩阵及其运算

## 一、矩阵的概念

在物资调运中，某类物资有3个产地、5个销地，它的调运方案可在表1.1中反映.

表 1.1单位:t<table><tr><td rowspan=2 colspan=2>调运数</td><td colspan=5>销地</td></tr><tr><td>I</td><td>Ⅱ</td><td>Ⅲ</td><td>IV</td><td>V</td></tr><tr><td rowspan=3>产地</td><td>I</td><td>0</td><td>3</td><td>4</td><td>7</td><td>5</td></tr><tr><td>Ⅱ</td><td>8</td><td>2</td><td>3</td><td>0</td><td>2</td></tr><tr><td>Ⅲ</td><td>5</td><td>4</td><td>0</td><td>6</td><td>6</td></tr></table>

如果我们用 $a_{ij}(i = 1,2,3;j = 1,2,3,4,5)$ 表示从第i个产地运往第j个销地的运量(如 $a_{12} = 3, a_{24} = 0, a_{35} = 6$ ，这样就能把调运方案表简写成一个3行5列的数表

$$\begin{pmatrix}0 & 3 & 4 & 7 & 5 \\8 & 2 & 3 & 0 & 2 \\5 & 4 & 0 & 6 & 6\end{pmatrix},$$

[page:2]

用这种数表来表达某种状态或数量关系，在自然科学、技术科学以及实际生活中都是常见的.这种数表我们称为矩阵.

定义1 由 $m \times n$ 个数排成的m行n列数表

重难点分析矩阵的概念

$$\begin{pmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & \ddots & \vdots \\a_{m1} & a_{m2} & \cdots & a_{mn}\end{pmatrix}$$

称为一个m行n列矩阵，简称为 $\bar { m } \times \bar { n }$ 矩阵，其中 $\alpha_{ij}$ 表示第i行第j列处的元(或称元素),i称为 $\alpha_{ij}$ 的行指标，j称为 $\alpha _ { i j }$ 的列指标.

元是实数的矩阵称为实矩阵，元是复数的矩阵称为复矩阵.本书中的矩阵除特别说明外，都指实矩阵.

通常用大写黑体字母A，B，…或者 $(a_{ij}),(b_{ij})$ ，…表示矩阵.若需指明矩阵的行数和列数，常写为 $A_{m \times n}$ 或 $\vec{A} = \left( a_{ij} \right)_{m \times n}$

例如 $\boldsymbol{A} = \begin{bmatrix} 0 & -1 & 2 \\ 1 & 2 & 3 \end{bmatrix}$ 为一个 $2 \times 3$ 矩阵.

n元线性方程组

$$\begin{cases}a_{11}x_{1} + a_{12}x_{2} + \cdots + a_{1n}x_{n} = b_{1}, \\a_{21}x_{1} + a_{22}x_{2} + \cdots + a_{2n}x_{n} = b_{2}, \\\cdots\cdots\cdots\cdots \\a_{m1}x_{1} + a_{m2}x_{2} + \cdots + a_{mn}x_{n} = b_{m}.\end{cases}$$

的系数可以组成一个m行n列矩阵

$$\boldsymbol{A} = \begin{pmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & & \vdots \\a_{m1} & a_{m2} & \cdots & a_{mn}\end{pmatrix},$$

称为方程组的系数矩阵；而系数及常数项可以组成一个m行n+1列矩阵

$$\overline{A} = \begin{pmatrix}a_{11} & a_{12} & \cdots & a_{1n} & b_{1} \\a_{21} & a_{22} & \cdots & a_{2n} & b_{2} \\\vdots & \vdots & & \vdots & \vdots \\a_{m1} & a_{m2} & \cdots & a_{mn} & b_{m}\end{pmatrix},$$

称为方程组的增广矩阵.我们将利用矩阵这一工具来研究线性方程组

元全为零的矩阵称为零矩阵，记作 $O_{m \times n}$ 或0.如

$$\boldsymbol { O } _ { 2 \times 2 } = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}, \quad \boldsymbol { O } _ { 2 \times 3 } = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}.$$

[page:3]

当 $m = n$ 时，称A为n阶矩阵(或n阶方阵).

只有1行 $(1 \times n)$ 或1列 $(m \times 1)$ 的矩阵

$$\left( a_{11}, a_{12}, \cdots, a_{1n} \right), \begin{pmatrix} a_{11} \\ a_{21} \\ \vdots \\ a_{m1} \end{pmatrix}$$

分别称为行矩阵和列矩阵.

若方阵 $\boldsymbol{A} = (a_{ij})_{n \times n}$ 的元 $a_{ij} = 0 (i \neq j)$ ，则称A为对角矩阵， $a_{ii}(i = 1,2,\cdots,n)$ 称为A的对角 $元$ ，记作 $\boldsymbol{A} = \mathrm{diag}(a_{11}, a_{22}, \cdots, a_{nn})$ .例如，

$$\boldsymbol{A} = \begin{bmatrix} -1 & 0 \\ 0 & 5 \end{bmatrix} =  diag (-1,5)$$

为二阶对角矩阵.

对角元全为数1的对角矩阵称为单位矩阵，n阶单位矩阵记为 $\boldsymbol{I}_{n}$ ，在不致混淆时也记为I，即

$$\boldsymbol{I} =  diag (1,1,\cdots,1) = \begin{bmatrix} 1 & & & \\ & 1 & & \\ & & \ddots & \\ & & & 1 \end{bmatrix}.$$

形如

$$\begin{pmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\0 & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & & \vdots \\0 & 0 & \cdots & a_{nn}\end{pmatrix},\quad\begin{pmatrix}a_{11} & 0 & \cdots & 0 \\a_{21} & a_{22} & \cdots & 0 \\\vdots & \vdots & & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn}\end{pmatrix}$$

的矩阵分别称为上三角形矩阵和下三角形矩阵

## 二、矩阵的线性运算

矩阵是线性代数的基本运算对象之一，为了讨论矩阵的运算，我们首先给出矩阵相等的概念.

如果A和B都是 $m \times n$ 矩阵，就称A和B为同型矩阵.

两个矩阵 $A = (a_{ij})$ 和 $B = (b_{ij})$ ，如果它们为同型矩阵，且对应元相等，即

$$a_{ij} = b_{ij} \quad (i = 1,2,\cdots,m; j = 1,2,\cdots,n),$$

就称A和B相等，记为 $A = B$

例如，

$$\boldsymbol{A} = \begin{bmatrix} 0 & x & -1 \\ 3 & 4 & y \end{bmatrix}, \quad \boldsymbol{B} = \begin{bmatrix} z & 3 & -1 \\ 3 & 4 & 2 \end{bmatrix},$$

[page:4]

如果 $A = B$ ，则立即得 $x = 3, \; y = 2, \; z = 0$

现在我们介绍矩阵的加法运算及矩阵与数的乘积

设有两种物资(单位:t)，要从三个产地运往四个销地，其调运方案分别为矩阵A和 B:

$$\boldsymbol{A} = \begin{bmatrix} 30 & 25 & 17 & 0 \\ 20 & 0 & 14 & 23 \\ 0 & 20 & 20 & 30 \end{bmatrix}, \quad \boldsymbol{B} = \begin{bmatrix} 10 & 15 & 13 & 30 \\ 0 & 40 & 16 & 17 \\ 50 & 10 & 0 & 10 \end{bmatrix},$$

那么，从各产地运往各销地两种物资的总运量是A与B的和，即

$$\boldsymbol{A} + \boldsymbol{B} = \begin{pmatrix}40 & 40 & 30 & 30 \\20 & 40 & 30 & 40 \\50 & 30 & 20 & 40\end{pmatrix}.$$

定义2(矩阵的加法) 设矩阵

$$\boldsymbol{A} = \begin{pmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & & \vdots \\a_{m1} & a_{m2} & \cdots & a_{mn}\end{pmatrix}$$

与

$$\boldsymbol{B}=\begin{pmatrix}b_{11} & b_{12} & \cdots & b_{1n} \\b_{21} & b_{22} & \cdots & b_{2n} \\\vdots & \vdots & & \vdots \\b_{m1} & b_{m2} & \cdots & b_{mn}\end{pmatrix}$$

是两个 $m \times n$ 矩阵，将它们的对应元相加，得到一个新的 $m \times n$ 矩阵

$$\boldsymbol { C } = \begin{pmatrix}a _ { 1 1 } + b _ { 1 1 } & a _ { 1 2 } + b _ { 1 2 } & \cdots & a _ { 1 n } + b _ { 1 n } \\a _ { 2 1 } + b _ { 2 1 } & a _ { 2 2 } + b _ { 2 2 } & \cdots & a _ { 2 n } + b _ { 2 n } \\\vdots & \vdots & & \vdots \\a _ { m 1 } + b _ { m 1 } & a _ { m 2 } + b _ { m 2 } & \cdots & a _ { m n } + b _ { m n }\end{pmatrix},$$

则称矩阵C是矩阵A与B的和，记为 $C = A + B$

值得注意的是，只有同型矩阵才能相加，且同型矩阵之和仍为同型矩阵.如

$$\boldsymbol{A} = \begin{bmatrix} 2 & 0 & -1 \\ 0 & 1 & 2 \end{bmatrix}, \quad \boldsymbol{B} = \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix},$$

A与B不能相加.

设矩阵 $A = (a_{ij})$ ，若把它的每一元换为其相反数得到的矩阵

$$\begin{pmatrix}- a_{11} & - a_{12} & \cdots & - a_{1n} \\- a_{21} & - a_{22} & \cdots & - a_{2n} \\\vdots & \vdots & & \vdots \\- a_{m1} & - a_{m2} & \cdots & - a_{mn}\end{pmatrix}$$

称为A的负矩阵，记为一A.显然有

$$A+(-A)=O.$$

[page:5]

利用矩阵的加法与负矩阵的概念，我们可以定义两个 $\bar { m } \times \bar { n }$ 矩阵A与B的差，即矩阵的减法:

$$A - B = A + ( - B )$$

就是把A与B的对应元相减.

显然， $A - B = O$ 与A=B等价.

下面介绍矩阵与数的乘积.

设从某三个地区分别到另两个地区的距离(单位:km)可用下列3×2的矩阵表示为

$$\begin{aligned}\boldsymbol{A} = & \begin{bmatrix} 90 & 60 \\ 120 & 70 \\ 80 & 55 \end{bmatrix} \coprod \\ &  甲  \quad  乙 \end{aligned}$$

已知货物的运费为2元/(吨·千米)，那么，各地区之间每吨货物的运费只要将A中每一元都乘以2，即得

$$\begin{aligned}&\begin{bmatrix} 180 & 120 \\ 240 & 140 \\ 160 & 110 \end{bmatrix} \underline{\mathbb{I}} \\&\quad  甲  \quad  乙  \quad\end{aligned}$$

矩阵与数的乘积的定义如下:

定义3(矩阵的数乘)设 $A = (a_{ij})_{m \times n}$ 是一个m×n矩阵，k是一个数，则称矩阵

$$\begin{pmatrix}ka_{11} & ka_{12} & \cdots & ka_{1n} \\ka_{21} & ka_{22} & \cdots & ka_{2n} \\\vdots & \vdots & & \vdots \\ka_{m1} & ka_{m2} & \cdots & ka_{mn}\end{pmatrix}$$

为矩阵A与数k的乘积(简称矩阵的数乘)，记为kA.

也就是说，用数k乘矩阵A就是将A中的每一元都乘以k.

矩阵的加法与数乘统称为矩阵的线性运算.

容易证明，设A，B，C为同型矩阵，k，l为数，那么矩阵的线性运算满足下列八条性质:

$$\begin{align*}1^{\circ} \quad & A + B = B + A ; \\2^{\circ} \quad & (A + B) + C = A + (B + C) ; \\3^{\circ} \quad & A + O = A ; \\4^{\circ} \quad & A + (-A) = O ; \\5^{\circ} \quad & 1A = A ; \\6^{\circ} \quad & k(lA) = (kl)A ; \\7^{\circ} \quad & k(A + B) = kA + kB ;\end{align*}$$

[page:6]

8°(k+l)A=kA+lA.

例1 设矩阵

$$\boldsymbol{A} = \begin{bmatrix} 3 & -1 & 2 \\ 1 & 5 & 7 \end{bmatrix}, \quad \boldsymbol{B} = \begin{bmatrix} 7 & 5 & -4 \\ 5 & 1 & 9 \end{bmatrix},$$

且A +2X=B,求矩阵X.

解 由 $A + 2X = B$ 得

$$\boldsymbol{X} = \frac{1}{2} (\boldsymbol{B} - \boldsymbol{A}) = \frac{1}{2} \begin{bmatrix} 7 - 3 & 5 - (-1) & -4 - 2 \\ 5 - 1 & 1 - 5 & 9 - 7 \end{bmatrix} = \begin{bmatrix} 2 & 3 & -3 \\ 2 & -2 & 1 \end{bmatrix}.$$

## 三、矩阵的乘法

设甲、乙两家公司生产I、Ⅱ、Ⅲ三种型号的计算机，月产量(单位:台)为

$$\begin{aligned}&\left[\begin{aligned}& I  & &  II  & &  II \\&25 & & 20 & & 18\\&24 & & 16 & & 27\end{aligned}\right]\begin{aligned}& 甲 \\& 乙 \end{aligned}.\end{aligned}$$

如果生产这三种型号的计算机每台的利润(单位:万元/台)为

$$\left[ \begin{matrix} { 0 . 5 } \\ { 0 . 2 } \\ { 0 . 7 } \\ \end{matrix} \right] \begin{matrix} { \underline { { 1 } } } \\ { \underline { { \Pi } } } \\ { \underline { { \Pi } } } \\ \end{matrix} ,$$

则这两家公司的月利润(单位:万元)应为

$$\begin{pmatrix}25 \times 0.5 + 20 \times 0.2 + 18 \times 0.7 \\24 \times 0.5 + 16 \times 0.2 + 27 \times 0.7\end{pmatrix}=\begin{pmatrix}29.1 \\34.1\end{pmatrix} 二$$

可见，甲公司每月的利润为29.1万元，乙公司每月的利润为34.1万元.

矩阵的乘法的定义如下:

定义4 设 $m \times p$ 矩阵 $\boldsymbol{A} = (a_{ij})_{m \times p}, p \times n$ 矩阵 $\boldsymbol{B} = \left( b_{ij} \right)_{p \times n}$ ，则由元

$$c_{ij} = a_{i1}b_{1j} + a_{i2}b_{2j} + \cdots + a_{ip}b_{pj} = \sum_{k=1}^{p} a_{ik}b_{kj} \quad (i = 1,2,\cdots,m; j = 1,2,\cdots,n)$$

构成的 $m \times n$ 矩阵 $C = (c_{ij})_{m \times n}$ 称为矩阵A与B的乘积，记为 $C = AB$

由定义可知:

(1)A的列数必须等于B的行数，A与B才能相乘；

(2)乘积C的行数等于A的行数，C的列数等于B的列数；

(3) 乘积C中第i行第j列元 $c_{ij}$ 等于A的第i行元与B的第j列元对应乘积之和，即

[page:7]

$$c_{ij} = a_{i1}b_{1j} + a_{i2}b_{2j} + \cdots + a_{ip}b_{pj}$$

例2设 $\boldsymbol{A} = \begin{pmatrix}1 & 2 & 3 \\3 & 2 & 1\end{pmatrix}$ $B = \begin{pmatrix} 1 & 3 \\ 3 & 1 \\ 2 & 2 \end{pmatrix}$ $D = \begin{pmatrix} 1 & 0 \\ 3 & 2 \end{pmatrix}$ ，求 $AB , AD$

解

$${ \scriptstyle A B } = \left[ \begin{matrix} { 1 \times 1 + 2 \times 3 + 3 \times 2 } & { 1 \times 3 + 2 \times 1 + 3 \times 2 } \\ { 3 \times 1 + 2 \times 3 + 1 \times 2 } & { 3 \times 3 + 2 \times 1 + 1 \times 2 } \\ \end{matrix} \right] = \left[ \begin{matrix} { 1 3 } & { 1 1 } \\ { 1 1 } & { 1 3 } \\ \end{matrix} \right] .$$

AD 无意义.

例3 对于线性方程组

$$\begin{cases}a_{11}x_{1} + a_{12}x_{2} + \cdots + a_{1n}x_{n} = b_{1}, \\a_{21}x_{1} + a_{22}x_{2} + \cdots + a_{2n}x_{n} = b_{2}, \\\quad \cdots \cdots \cdots \cdots \\a_{m1}x_{1} + a_{m2}x_{2} + \cdots + a_{mn}x_{n} = b_{m},\end{cases}\tag{1.1}$$

若令矩阵

$$\begin{aligned}\boldsymbol{A} &=\begin{bmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & & \vdots \\a_{m1} & a_{m2} & \cdots & a_{mn}\end{bmatrix},\quad\boldsymbol{X} =\begin{bmatrix}x_{1} \\x_{2} \\\vdots \\x_{n}\end{bmatrix},\quad\boldsymbol{b} =\begin{bmatrix}b_{1} \\b_{2} \\\vdots \\b_{m}\end{bmatrix},\end{aligned}$$

则

$$\begin{aligned}\boldsymbol{A} \boldsymbol{X} &=\begin{bmatrix}a_{11} x_{1}+a_{12} x_{2}+\cdots+a_{1 n} x_{n} \\a_{21} x_{1}+a_{22} x_{2}+\cdots+a_{2 n} x_{n} \\\cdots \cdots \cdots \cdots \\a_{m 1} x_{1}+a_{m 2} x_{2}+\cdots+a_{m n} x_{n}\end{bmatrix}=\begin{bmatrix}b_{1} \\b_{2} \\\vdots \\b_{m}\end{bmatrix}=\boldsymbol{b}.\end{aligned}$$

即方程组(1.1)可表为如下矩阵形式:

$$AX = b.$$

矩阵乘法满足下列运算规律:

$1 ^ { \circ }$ 结合律 $(AB)C = A(BC)$

$2 ^ { \circ }$ 数乘结合律 $k(AB) = (kA)B = A(kB)$ ,k为数；

$3 ^ { \circ }$ 分配律 $A(B + C) = AB + AC$

$$(B + C)A = BA + CA.$$

这里只证明结合律，其他两条请读者自证.

设A是 $m \times n$ 矩阵，B是 $n \times p$ 矩阵，C是 $p \times s$ 矩阵，则AB是 $m \times p$ 矩阵，BC是$n \times s$ 矩阵，故 $(AB)C$ 与 $A(BC)$ 都是 $m \times s$ 矩阵，因而是同型矩阵.

现在比较它们的对应元.

[page:8]

矩阵 $(AB)C$ 的第i行第j列元为

$$\sum_{k = 1}^{p} \left( \sum_{l = 1}^{n} a_{il} b_{lk} \right) c_{kj} = \sum_{k = 1}^{p} \sum_{l = 1}^{n} a_{il} b_{lk} c_{kj}.$$

矩阵A(BC)的第i行第j列元为

$$\sum_{l = 1}^{n} a_{il} \left( \sum_{k = 1}^{p} b_{lk} c_{kj} \right) = \sum_{l = 1}^{n} \sum_{k = 1}^{p} a_{il} b_{lk} c_{kj} = \sum_{k = 1}^{p} \sum_{l = 1}^{n} a_{il} b_{lk} c_{kj}.$$

上式成立是由于双重有限项求和符号可以交换次序，所以 $(AB)C$ 与 $A(BC)$ 的对应元相等，故有

$$(AB)C = A(BC).$$

例4 设 $A = \begin{bmatrix} 1 & 1 \\ -1 & -1 \end{bmatrix}$ $\boldsymbol{B} = \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}$ ，求 $A B$ 和 BA.

解 显然

$$AB = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}, \quad BA = \begin{bmatrix} 2 & 2 \\ -2 & -2 \end{bmatrix}.$$

在例4中，我们已经看出矩阵乘法一般不满足交换律，即一般

$$AB \ne BA.$$

当 $AB \ne BA$ 时，称A与B不可交换；当 $AB = BA$ 时，称A与B可交换.

从例4还可见，A，B都是非零矩阵，但 $AB = O$ 由此可知，矩阵的乘法不满足消去律，即 $A \ne 0$ 时，由 $AB = AC$ 不能推出 $B = C .$ 事实上，由

$$AB-AC=A(B-C)=O$$

不能推出 $B - C = O$

矩阵乘法一般不满足交换律，但是，容易得到如下常用结果:

$$\boldsymbol{I}_{m} \boldsymbol{A}_{m \times n}=\boldsymbol{A}_{m \times n}, \quad \boldsymbol{A}_{m \times n} \boldsymbol{I}_{n}=\boldsymbol{A}_{m \times n}.$$

可见，单位矩阵在矩阵乘法中的作用与数1在数的乘法中的作用类似.

我们称

$$k \boldsymbol{I} =  diag (k, k, \cdots, k) = \begin{bmatrix} k & & & \\ & k & & \\ & & \ddots & \\ & & & k \end{bmatrix} \quad (k \neq 0)$$

为数量矩阵.

n阶数量矩阵kI与任意n阶矩阵A也是可交换的.这是因为

[page:9]

$$(kI)A = k(IA) = kA,A(kI) = k(AI) = kA.$$

我们还可定义方阵的幂和方阵的多项式

定义5设A是n阶方阵,k为正整数，定义

$$\begin{cases}A^{1} = A, \\A^{k + 1} = A^{k}A, \quad k = 1,2,\cdots.\end{cases}$$

由定义可以证明:当m，k为正整数时，

$$A^{m}A^{k}=A^{m+k}$$

$$(A^{m})^{k} = A^{mk}.$$

但需注意，一般

$$(AB)^{k} \neq A^{k}B^{k}.$$

当AB=BA时， $(AB)^{k} = A^{k}B^{k} = B^{k}A^{k}$ ，但其逆不真.

定义6 设 $f(x)=a_{k}x^{k}+a_{k-1}x^{k-1}+\cdots+a_{1}x+a_{0}$ 是x的k次多项式，A是n阶方阵，则

$$f(\boldsymbol{A}) = a_{k}\boldsymbol{A}^{k} + a_{k - 1}\boldsymbol{A}^{k - 1} + \cdots + a_{1}\boldsymbol{A} + a_{0}\boldsymbol{I}$$

称为方阵A 的k 次多项式

由定义容易证明:若 $f(x) , g(x)$ 为多项式，A，B均为n阶方阵，则

$$f(A)g(A)=g(A)f(A).$$

例如

$$\left( \boldsymbol{A} + 3 \boldsymbol{I} \right) \left( 2 \boldsymbol{A} - \boldsymbol{I} \right) = \left( 2 \boldsymbol{A} - \boldsymbol{I} \right) \left( \boldsymbol{A} + 3 \boldsymbol{I} \right) = 2 \boldsymbol{A}^2 + 5 \boldsymbol{A} - 3 \boldsymbol{I}.$$

但是一般情况下

$$f(A)g(B) \neq g(B)f(A).$$

这里要注意，一般来说

$$\begin{aligned}&\left( \boldsymbol{A} + \boldsymbol{B} \right)^{2} \neq \boldsymbol{A}^{2} + 2\boldsymbol{A}\boldsymbol{B} + \boldsymbol{B}^{2}, \\&\left( \boldsymbol{A} + \boldsymbol{B} \right)\left( \boldsymbol{A} - \boldsymbol{B} \right) \neq \left( \boldsymbol{A} - \boldsymbol{B} \right)\left( \boldsymbol{A} + \boldsymbol{B} \right) \neq \boldsymbol{A}^{2} - \boldsymbol{B}^{2},\end{aligned}$$

等等.但是，由于AI=IA，因而

$$\begin{aligned} &\left( \boldsymbol{A} + \boldsymbol{I} \right)^{2} = \boldsymbol{A}^{2} + 2\boldsymbol{A}\boldsymbol{I} + \boldsymbol{I}^{2} = \boldsymbol{A}^{2} + 2\boldsymbol{A} + \boldsymbol{I}, \\&\left( \boldsymbol{A} + \boldsymbol{I} \right)\left( \boldsymbol{A} - \boldsymbol{I} \right) = \boldsymbol{A}^{2} - \boldsymbol{I}^{2} = \boldsymbol{A}^{2} - \boldsymbol{I},\\ \end{aligned}$$

等等.

由于数量矩阵λI与任意方阵可交换，下式可按二项式定理展开

$$(A + \lambda I)^n = A^n + C_n^1 \lambda A^{n-1} + C_n^2 \lambda^2 A^{n-2} + \cdots + C_n^{n-1} \lambda^{n-1} A + \lambda^n I.$$

例5求与 $\boldsymbol{A} = \begin{pmatrix}1 & 1 & 0 \\0 & 1 & 0 \\0 & 0 & 1\end{pmatrix}$ 可交换的矩阵B.

[page:10]

解

$$\boldsymbol{B}=\left[\begin{aligned}a_{1} & \quad a_{2} & \quad a_{3} \\b_{1} & \quad b_{2} & \quad b_{3} \\c_{1} & \quad c_{2} & \quad c_{3}\end{aligned}\right],  则  \quad\boldsymbol{A} \boldsymbol{B}=\left[\begin{aligned}a_{1}+b_{1} & \quad a_{2}+b_{2} & \quad a_{3}+b_{3} \\b_{1} & \quad b_{2} & \quad b_{3} \\c_{1} & \quad c_{2} & \quad c_{3}\end{aligned}\right], \quad\boldsymbol{B} \boldsymbol{A}=\left[\begin{aligned}a_{1} & \quad a_{1}+a_{2} & \quad a_{3} \\b_{1} & \quad b_{1}+b_{2} & \quad b_{3} \\c_{1} & \quad c_{1}+c_{2} & \quad c_{3}\end{aligned}\right].$$

由 $AB = BA$ 得

$$\begin{array} { r } { a _ { 1 } + b _ { 1 } = a _ { 1 } , a _ { 2 } + b _ { 2 } = a _ { 1 } + a _ { 2 } , a _ { 3 } + b _ { 3 } = a _ { 3 } , } \\ { b _ { 1 } = b _ { 1 } , \quad b _ { 2 } = b _ { 1 } + b _ { 2 } , \quad b _ { 3 } = b _ { 3 } , } \\ { c _ { 1 } = c _ { 1 } , \quad c _ { 2 } = c _ { 1 } + c _ { 2 } , \quad c _ { 3 } = c _ { 3 } . } \end{array}$$

所以 $b_{1}=b_{3}=0,c_{1}=0,b_{2}=a_{1}$ ，于是与A可交换的矩阵

$$\boldsymbol{B} = \begin{pmatrix}a_{1} & a_{2} & a_{3} \\0 & a_{1} & 0 \\0 & c_{2} & c_{3}\end{pmatrix},$$

其中 $a_{1},a_{2},a_{3},c_{2},c_{3}$ 为任意数.

例6 设

$$\boldsymbol{A} = \begin{pmatrix}1 & a & b \\0 & 1 & a \\0 & 0 & 1\end{pmatrix},$$

求 $A^{n}(n$ 为正整数).

解

$$\boldsymbol { A } ^ { 2 } = \begin{bmatrix} 1 & a & b \\ 0 & 1 & a \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & a & b \\ 0 & 1 & a \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 2 a & a ^ { 2 } + 2 b \\ 0 & 1 & 2 a \\ 0 & 0 & 1 \end{bmatrix},$$

$$\boldsymbol { A } ^ { 3 } = \begin{bmatrix} 1 & 2 a & a ^ { 2 } + 2 b \\ 0 & 1 & 2 a \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & a & b \\ 0 & 1 & a \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 3 a & ( 1 + 2 ) a ^ { 2 } + 3 b \\ 0 & 1 & 3 a \\ 0 & 0 & 1 \end{bmatrix},$$

设

$$A^{k} = \begin{bmatrix} 1 & ka & \left[ 1 + 2 + \cdots + (k - 1) \right] a^{2} + kb \\ 0 & 1 & ka \\ 0 & 0 & 1 \end{bmatrix}$$

成立，有

$$\boldsymbol{A}^{k + 1} = \begin{bmatrix} 1 & ka & \left[ 1 + 2 + \cdots + (k - 1) \right] a^{2} + kb \\ 0 & 1 & ka \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & a & b \\ 0 & 1 & a \\ 0 & 0 & 1 \end{bmatrix}$$

[page:11]

$$\begin{aligned}= & \begin{bmatrix}1 & (k + 1)a & (1 + 2 + \cdots + k)a^{2} + (k + 1)b \\0 & 1 & (k + 1)a \\0 & 0 & 1\end{bmatrix}.\end{aligned}$$

由数学归纳法知

$$\boldsymbol{A}^{n}=\begin{bmatrix}1&na&[1+2+\cdots+(n-1)]a^{2}+nb\\0&1&na\\0&0&1\end{bmatrix}.$$

n个变量 $x_{1},x_{2},\cdots,x_{n}$ 与m个变量 $y_{1},y_{2},\cdots,y_{m}$ 之间的关系式

$$\begin{cases}y_{1} = a_{11}x_{1} + a_{12}x_{2} + \cdots + a_{1n}x_{n}, \\y_{2} = a_{21}x_{1} + a_{22}x_{2} + \cdots + a_{2n}x_{n}, \\\quad \cdots \cdots \cdots \cdots \\y_{m} = a_{m1}x_{1} + a_{m2}x_{2} + \cdots + a_{mn}x_{n},\end{cases}$$

称为从变量 $x_{1},x_{2},\cdots,x_{n}$ 到变量 $y_{1},y_{2},\cdots,y_{m}$ 的线性变换，其中 $\alpha_{ij}$ 为常数.可以看出，上述变换可写为

$$Y = A X ,$$

其中

$$\boldsymbol{A} = \begin{pmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & & \vdots \\a_{m1} & a_{m2} & \cdots & a_{mn}\end{pmatrix}, \quad\boldsymbol{X} = \begin{pmatrix}x_{1} \\x_{2} \\\vdots \\x_{n}\end{pmatrix}, \quad\boldsymbol{Y} = \begin{pmatrix}y_{1} \\y_{2} \\\vdots \\y_{n}\end{pmatrix}.$$

当A=I时 $Y = AX = X$ 为恒等变换.

例7 在平面直角坐标系中，线性变换

$$\binom{x'}{y'} = \binom{\cos \theta - \sin \theta}{\sin \theta - \cos \theta} \binom{x}{y}$$

是将点 $(x,y)$ 逆时针旋转θ角得到新点 $(x',y')$ 的旋转变换.

## 应用实例:职工轮训

实例某公司为了实现技术更新，计划对职工实行分批脱产轮训.现有职工中不脱产职工8000人，脱产轮训职工2000人.若每年从不脱产职工中抽调30%的人脱产轮训，同时又有60%脱产轮训职工结业回到生产岗位，若职工总数保持不变，一年后不脱产职工及脱产轮训职工各有多少?两年后又怎样?

解令

$$\boldsymbol{A} = \begin{pmatrix} 0.70 & 0.60 \\ 0.30 & 0.40 \end{pmatrix}, \quad \boldsymbol{X} = \begin{pmatrix} 8000 \\ 2000 \end{pmatrix},$$

[page:12]

则一年后不脱产职工及脱产轮训职工人数可用AX表示:

$$AX = \begin{pmatrix} 0.70 & 0.60 \\ 0.30 & 0.40 \end{pmatrix} \begin{pmatrix} 8\ 000 \\ 2\ 000 \\ \end{pmatrix} = \begin{pmatrix} 6\ 800 \\ 3\ 200 \end{pmatrix}.$$

两年后不脱产职工及脱产轮训职工人数可用 $A^{2}X$ 表示:

$$A^{2}X = A(AX) = \binom{0.70 \quad 0.60}{0.30 \quad 0.40} \binom{6800}{3200} = \binom{6680}{3320},$$

故两年后脱产轮训职工人数约占不脱产职工人数的一半.

## 四、矩阵的转置

把一个矩阵A的行列互换，所得到的矩阵称为A的转置，记为 $A^{\mathrm{T}}$ .确切的定义如下:

定义7设

$$\boldsymbol{A} = \begin{bmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & & \vdots \\a_{m1} & a_{m2} & \cdots & a_{mn}\end{bmatrix},$$

则称

$$\boldsymbol{A}^{\mathrm{T}}=\begin{pmatrix}a_{11} & a_{21} & \cdots & a_{m1} \\a_{12} & a_{22} & \cdots & a_{m2} \\\vdots & \vdots & & \vdots \\a_{1n} & a_{2n} & \cdots & a_{mn}\end{pmatrix}$$

为A的转置.

显然， $m \times n$ 矩阵的转置是 $n \times m$ 矩阵.

矩阵的转置满足以下规律:

$$1^{\circ} \quad (A^{\mathrm{T}})^{\mathrm{T}} = A ;$$

$$2^{\circ} \quad (A + B)^{\mathrm{T}} = A^{\mathrm{T}} + B^{\mathrm{T}};$$

$3^{\circ} \quad (k\boldsymbol{A})^{\mathrm{T}} = k\boldsymbol{A}^{\mathrm{T}}, k$ 为数；

$$4^{\circ} \quad (AB)^{\mathrm{T}} = B^{\mathrm{T}} A^{\mathrm{T}}.$$

$1 ^ { \circ } , 2 ^ { \circ } , 3 ^ { \circ }$ 都容易证明.下面证明 $4 ^ { \circ }$ 设 $\boldsymbol{A} = (a_{ij})_{m \times n}, \boldsymbol{B} = (b_{ij})_{n \times s}$ .因为AB是 $m \times s$矩阵，所以 $(AB)^{\mathrm{T}}$ 是 $s \times m$ 矩阵，而 $B^{\mathrm{T}}$ 是 $s \times n$ 矩阵 $;A^{ 下 }$ 是 $n \times m$ 矩阵，所以 $\boldsymbol{B}^{\mathrm{T}} \boldsymbol{A}^{\mathrm{T}}$ 是$s \times m$ 矩阵，故 $(AB)^{\mathrm{T}}$ 与 $\boldsymbol{B}^{\mathrm{T}} \boldsymbol{A}^{\mathrm{T}}$ 是同型矩阵.

现比较它们的对应元. $(AB)^{\mathrm{T}}$ 的第i行第j列元，也就是AB的第 $j$ 行第i列元，即为

$$\sum_{k = 1}^{n} a_{jk} b_{ki}.$$

[page:13]

另一方面， $\boldsymbol{B}^{\mathrm{T}}$ 的第i 行第k 列元是 $\hat { b } _ { k i } , \hat { A } ^ { \mathrm { T } }$ 的第k行第j 列元是 $\boldsymbol{a}_{jk}$ ，因此， $\widehat{B}^{\mathrm{T}} A^{\mathrm{T}}$ 的第i行第j列元为

$$\sum_{k = 1}^{n} b_{ki} a_{jk} = \sum_{k = 1}^{n} a_{jk} b_{ki} ,$$

从而 $(AB)^{\mathrm{T}}$ 与 $\overline{\boldsymbol{B}}^{\mathrm{T}} \boldsymbol{A}^{\mathrm{T}}$ 的对应元相等，故有 $( \boldsymbol{A} \boldsymbol{B} )^{\mathrm{T}} = \boldsymbol{B}^{\mathrm{T}} \boldsymbol{A}^{\mathrm{T}}$

例8设

$$\boldsymbol{A} = \begin{bmatrix} 1 & -1 & 2 \\ 0 & 1 & 3 \\ 1 & 2 & 1 \end{bmatrix}, \quad \boldsymbol{B} = \begin{bmatrix} 3 & 1 \\ 2 & 2 \\ 1 & -1 \end{bmatrix},$$

求 $A^{\mathrm{T}},B^{\mathrm{T}},AB,B^{\mathrm{T}}A^{\mathrm{T}}$

解

$$\boldsymbol{A}^{\mathrm{T}}=\begin{pmatrix} -1 & 0 & 1 \\ -1 & 1 & 2 \\ 2 & 3 & 1 \end{pmatrix}, \quad \boldsymbol{B}^{\mathrm{T}}=\begin{pmatrix} 3 & 2 & -1 \\ 1 & 2 & -1 \end{pmatrix},$$

$$\boldsymbol{A} \boldsymbol{B} = \begin{bmatrix} 1 & -1 & 2 \\ 0 & 1 & 3 \\ 1 & 2 & 1 \end{bmatrix} \begin{bmatrix} 3 & 1 \\ 2 & 2 \\ 1 & -1 \end{bmatrix} = \begin{bmatrix} 3 & -3 \\ 5 & -1 \\ 8 & 4 \end{bmatrix},$$

$$\boldsymbol{B}^{\mathrm{T}} \boldsymbol{A}^{\mathrm{T}} = (\boldsymbol{A} \boldsymbol{B})^{\mathrm{T}} = \begin{bmatrix} 3 & 5 & 8 \\ -3 & -1 & 4 \end{bmatrix}.$$

例9证明: $(ABC)^{\mathrm{T}} = C^{\mathrm{T}}B^{\mathrm{T}}A^{\mathrm{T}}$

证 $(A\boldsymbol{B}\boldsymbol{C})^{\mathrm{T}} = [(A\boldsymbol{B})\boldsymbol{C}]^{\mathrm{T}} = \boldsymbol{C}^{\mathrm{T}}(A\boldsymbol{B})^{\mathrm{T}} = \boldsymbol{C}^{\mathrm{T}}\boldsymbol{B}^{\mathrm{T}}\boldsymbol{A}^{\mathrm{T}}.$

对于有限多个矩阵乘积的转置，用数学归纳法容易证明:

$$( \boldsymbol { A } _ { 1 } \boldsymbol { A } _ { 2 } \cdots \boldsymbol { A } _ { k } ) ^ { \mathrm { T } } = \boldsymbol { A } _ { k } { } ^ { \mathrm { T } } \boldsymbol { A } _ { k - 1 } { } ^ { \mathrm { T } } \cdots \boldsymbol { A } _ { 1 } { } ^ { \mathrm { T } } .$$

定义8若 $A^{\top} = A$ ，则称A为对称矩阵；若 $A^{\mathrm{T}} = - A$ ，则称A为反称矩阵.显然，对称矩阵和反称矩阵都是方阵，对称矩阵A中的元之间有关系

$$a_{ij} = a_{ji}, \forall i,j.$$

反称矩阵A的元之间有关系

$$a_{ii} = 0, \quad a_{ij} = -a_{ji}, \quad i \neq j.$$

例如， $\begin{pmatrix}0 & 2 \\-2 & 0\end{pmatrix}$ $\begin{pmatrix}1 & 0 & 3 \\0 & 2 & 1 \\3 & 1 & 4\end{pmatrix}$ 分别为反称矩阵和对称矩阵.

显然，数乘对称矩阵仍为对称矩阵；同阶对称矩阵之和仍为对称矩阵.但是，对称矩阵的乘积未必是对称矩阵.

例如， $\begin{pmatrix}0 & -1 \\-1 & 1\end{pmatrix}$ 和 $\left[ \begin{matrix} { 1 } & { 1 } \\ { 1 } & { 1 } \\ \end{matrix} \right]$ 均为对称矩阵，但

[page:14]

$$\begin{pmatrix} 0 & - 1 \\ - 1 & 1 \end{pmatrix} \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} - 1 & - 1 \\ 0 & 0 \end{bmatrix}$$

为非对称矩阵.

例10 设A与B为两个n阶对称矩阵，证明:AB为对称矩阵的充要条件是$AB = BA$

证若 $AB = BA$ ,则 $( \boldsymbol{A} \boldsymbol{B} )^{\mathrm{T}} = \boldsymbol{B}^{\mathrm{T}} \boldsymbol{A}^{\mathrm{T}} = \boldsymbol{B} \boldsymbol{A} = \boldsymbol{A} \boldsymbol{B}$ ，即AB为对称矩阵.

反之，若AB为对称矩阵，即 $( \boldsymbol{A} \boldsymbol{B} )^{\mathrm{T}} = \boldsymbol{A} \boldsymbol{B}$ ,则 $AB = (AB)^{\mathrm{T}} = B^{\mathrm{T}}A^{\mathrm{T}} = BA$ ，即A与B可交换.

容易证明，对任意矩阵 $\hat { A } , \hat { A } A ^ { \mathrm { T } }$ 和 $A^{\mathrm{T}}A$ 都是对称矩阵.

例11设A,B为同阶方阵，A为反称矩阵，B为对称矩阵，则AB-BA为对称矩阵.

$$\begin{aligned}(\boldsymbol{A}\boldsymbol{B} - \boldsymbol{B}\boldsymbol{A})^{\mathrm{T}} &= (\boldsymbol{A}\boldsymbol{B})^{\mathrm{T}} - (\boldsymbol{B}\boldsymbol{A})^{\mathrm{T}} = \boldsymbol{B}^{\mathrm{T}}\boldsymbol{A}^{\mathrm{T}} - \boldsymbol{A}^{\mathrm{T}}\boldsymbol{B}^{\mathrm{T}} \\&= \boldsymbol{B}(-\boldsymbol{A}) - (-\boldsymbol{A})\boldsymbol{B} = \boldsymbol{A}\boldsymbol{B} - \boldsymbol{B}\boldsymbol{A},\end{aligned}$$

即AB—BA为对称矩阵.

## 习题1.1

1. 设 $\boldsymbol{A} = \begin{bmatrix} 5 & - 2 & 1 \\ 3 & 4 & - 1 \end{bmatrix}, \boldsymbol{B} = \begin{bmatrix} - 3 & 2 & 0 \\ - 2 & 0 & 1 \end{bmatrix}$ ,计算 $A-B,2A+5B,3A-4B$

2. 求矩阵 X:

$$2\begin{bmatrix} 3 & -1 & 1 \\ -2 & 0 & 2 \end{bmatrix} - 3\boldsymbol{X} + \begin{bmatrix} -2 & -1 & 1 \\ 3 & 1 & -1 \end{bmatrix} = \boldsymbol{O}.$$

3.计算:

(1)

$$\begin{pmatrix}3 & -2 \\0 & 1 \\2 & 4 \\-1 & 0\end{pmatrix}\begin{pmatrix}2 &  &  \\& 1 & -1 \\0 & -1 & 2\end{pmatrix} ;$$

$$\left( a_{1},a_{2},\cdots ,a_{n} \right) \begin{pmatrix} b_{1} \\ b_{2} \\ \vdots \\ b_{n} \end{pmatrix};$$

(3)

$$\begin{pmatrix}a_{1} \\a_{2} \\\vdots \\a_{n}\end{pmatrix}(b_{1}, b_{2}, \cdots, b_{n});$$

$$\left( x _ { 1 } , x _ { 2 } \right) \left( a _ { 1 1 } \quad a _ { 1 2 } \atop a _ { 2 1 } \quad a _ { 2 2 } \right) \left( x _ { 1 } \atop x _ { 2 } \right);$$

(5)

$$\begin{pmatrix}1 & 1 & 0 \\1 & -1 & 0 \\\frac{1}{2} & \quad \frac{1}{2} & 1\end{pmatrix}\begin{pmatrix}0 & -2 & 1 \\-2 & \quad 0 & 1 \\1 & \quad 1 & 0\end{pmatrix}\begin{vmatrix}1 & 1 & \frac{1}{2} \\& & \\1 & -1 & \frac{1}{2} \\& \quad 0 & 1\end{vmatrix}.$$

4.A,B皆为n阶方阵，问下列等式成立的条件是什么？

[page:15]

(1) $\left( \boldsymbol{A} + \boldsymbol{B} \right)^{3} = \boldsymbol{A}^{3} + 3\boldsymbol{A}^{2}\boldsymbol{B} + 3\boldsymbol{A}\boldsymbol{B}^{2} + \boldsymbol{B}^{3}$

(2) $(A + B)^{2} - (A^{2} + 2AB + B^{2}) = O$

5. 若 $AB = BA, AC = CA$ ，证明:A，B，C是同阶矩阵，且

$$A(B+C)=(B+C)A\ , \quad A(BC)=(BC)A\ .$$

6. 计算(n为正整数):

$$\left[ \begin{matrix} { 1 } & { 0 } \\ { 1 } & { 1 } \\ \end{matrix} \right] ^ { n } ;$$

$$\begin{pmatrix}a & 1 & 0 \\0 & a & 1 \\0 & 0 & a\end{pmatrix}^{n};$$

$$\begin{pmatrix}a & 0 & 0 \\0 & -b & 0 \\0 & 0 & c\end{pmatrix}^n.$$

7. 求 $\begin{pmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{pmatrix}^m$ ，并对例7中的旋转变换说明此结果的几何意义

8. 设 $f(x)=x^{2}-x-1,A=\begin{pmatrix}3&1&1\\3&1&2\\1&-1&0\end{pmatrix}$ ,求 $f(A)$

9. 已知 $\boldsymbol{\alpha} = (1,2,3), \boldsymbol{\beta} = \left(1, \frac{1}{2}, \frac{1}{3}\right)$ ,且 $A = \alpha^{\mathrm{T}} \beta$ ,计算 $A^{n}$

10.举反例说明下列命题是错误的:

(1) 若 $A^{2} = O$ ,则 $A = O$

(2) 若 $A^{2} = A$ ,则 $A = O$ 或 $A = I$

(3) 若 $AX = AX$ ,且 $A \ne  O$ ,则 $X { = } Y .$

11.如果A是实对称矩阵，且 $A^{2} = O$ ，证明: $A = O$

12. 设 $A = \frac{1}{2}(B + I)$ ，证明: $A^{2} = A$ 当且仅当 $\boldsymbol{B}^{2}=\boldsymbol{I}$

13. 设X 是n×1矩阵，且 $X^{\mathrm{T}}X = 1$ ，证明: $S = I - 2XX^{\mathrm{T}}$ 是对称矩阵，且 $S^{2} = I$

14.利用等式

$$\begin{bmatrix} 17 & - 6 \\ 35 & - 12 \end{bmatrix} = \begin{bmatrix} 2 & 3 \\ 5 & 7 \end{bmatrix} \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix} \begin{bmatrix} - 7 & \phantom{-} 3 \\ \phantom{-} 5 & - 2 \end{bmatrix},$$

$$\begin{pmatrix}-7 & 3 \\5 & -2\end{pmatrix}\begin{vmatrix}2 & 3 \\5 & 7\end{vmatrix}=\begin{vmatrix}1 & 0 \\0 & 1\end{vmatrix},$$

计算 $\begin{bmatrix} 17 & -6 \\ 35 & -12 \end{bmatrix}^{5}$

15.求平方等于零矩阵的所有二阶矩阵

## 1.2高斯消元法与矩阵的初等变换

在中学代数里，研究的中心问题之一是解方程，而其中最简单的便是线性(一次)方程及方程组.解线性方程组之所以重要，是因为一个复杂的实际问题往往可以简化或归结为一个线性方程组.

[page:16]

线性方程组在数学的许多分支(如微分方程、概率统计、计算方法)以及其他学科领域(如物理学、经济学、工程技术)中都有着广泛的应用.

实际问题提出的线性方程组往往是很复杂的，未知量的个数和方程的个数都很多.例如，水坝设计可以提出几十个，甚至几百个未知量和方程的线性方程组，数学物理问题中常常需要求解上万个甚至更多未知量的方程组，而且未知量的个数与方程的个数也不一定相等

一般地，我们把有n个未知量 $x_{1},x_{2},\cdots,x_{n}$ 和m个方程的方程组写为

$$\begin{cases}a_{11}x_{1} + a_{12}x_{2} + \cdots + a_{1n}x_{n} = b_{1}, \\a_{21}x_{1} + a_{22}x_{2} + \cdots + a_{2n}x_{n} = b_{2}, \\\quad \cdots \cdots \cdots \cdots \\a_{m1}x_{1} + a_{m2}x_{2} + \cdots + a_{mn}x_{n} = b_{m}.\end{cases}$$

如果常数项 $b_{i}(i = 1,2,\cdots,m)$ 中至少有一个不为0，则称方程组为非齐次方程组；否则称为齐次方程组.满足方程组的一组数: $x_{1}=c_{1},x_{2}=c_{2},\cdots,x_{n}=c_{n}$ 称为方程组的一个解.

对于一般线性方程组，我们要讨论的问题是:它在什么条件下有解？如果有解，有多少解？又如何求出其全部解？所谓解方程组，就是当方程组有解时求出它的全部解，当它无解时判明它无解.

## 一、高斯消元法

在初等数学中，解二元、三元线性方程组用的是加减消元法和代入消元法.本节所讲的一般线性方程组的消元法，就是将中学所用的方法加以一般化和规范化.

我们先从一些例子来说明解线性方程组的消元法:

例1 解线性方程组

$$\begin{cases}3x_{1} - x_{2} + 5x_{3} = 3, \\x_{1} - x_{2} + 2x_{3} = 1, \\x_{1} - 2x_{2} - x_{3} = 2.\end{cases}$$

解将方程组中的第一个与第三个方程交换位置，得方程组:

$$\begin{cases}x_{1} - 2x_{2} - x_{3} = 2, \\x_{1} - x_{2} + 2x_{3} = 1, \\3x_{1} - x_{2} + 5x_{3} = 3.\end{cases}$$

将方程组的第一个方程的(一1)倍加到第二个方程，然后将第一个方程的(一3)倍加到第三个方程，得方程组:

$$\left\{ \begin{aligned} x_{1} - 2x_{2} - x_{3} = 2, \\ x_{2} + 3x_{3} = - 1, \\ 5x_{2} + 8x_{3} = - 3. \end{aligned} \right.$$

再将方程组中第二个方程的(一5)倍加到第三个方程，得方程组:

[page:17]

$$\left\{ \begin{aligned} x_{1} - 2x_{2} - x_{3} &= \quad 2, \\ x_{2} + 3x_{3} &= - 1, \\ - 7x_{3} &= \quad 2. \end{aligned} \right.$$

最后将方程组的第三个方程乘以 $-\frac{1}{7}$ ，得方程组:

$$\left\{ \begin{aligned} x_{1} - 2x_{2} - x_{3} &= \quad 2, \\ x_{2} + 3x_{3} &= - 1, \\ x_{3} &= - \frac{2}{7}. \end{aligned} \right.$$

这就是高斯消元过程.于是得方程组的惟一解为:

$$\left\{ \begin{aligned} x_{1} &= \frac{10}{7}, \\ x_{2} &= -\frac{1}{7}, \\ x_{3} &= -\frac{2}{7}. \end{aligned} \right.$$

例2 解线性方程组

$$\begin{cases}x_{1} + 3x_{2} + 4x_{3} = - 2, \\2x_{1} + 5x_{2} + 9x_{3} = 3, \\3x_{1} + 7x_{2} + 14x_{3} = 8, \\\quad - x_{2} + \quad x_{3} = 7.\end{cases}$$

解将第一个方程的(一2)倍加到第二个方程，第一个方程的(一3)倍加到第三个方程，得方程组:

$$\begin{cases}x_{1} + 3x_{2} + 4x_{3} = - 2, \\\quad - x_{2} + x_{3} = 7, \\\quad - 2x_{2} + 2x_{3} = 14, \\\quad - x_{2} + x_{3} = 7.\end{cases}$$

先将第二个方程乘以(一1)，再将第二个方程的2倍加到第三个方程，最后将第二个方程加到第四个方程，得方程组:

$$\left\{ \begin{aligned} x_{1} + 3x_{2} + 4x_{3} = - 2, \\ x_{2} - x_{3} = - 7, \\ 0 = \quad 0, \\ 0 = \quad 0. \end{aligned} \right.$$

即

[page:18]

$$\left\{ \begin{aligned} x_{1} + 3x_{2} + 4x_{3} = - 2, \\ x_{2} - x_{3} = - 7. \end{aligned} \right.$$

为求方程组的解，将第二个方程改写为 $x_{2} = x_{3} - 7$ ，再将它代入第一个方程，得$x_{1} = - 7x_{3} + 19$ .于是得

$$x_{1} = - 7x_{3} + 19, \quad x_{2} = - 7,$$

其中 $x _ { 3 }$ 可以任意取值.我们称 $x _ { 3 }$ 为自由未知量.由于 $x_{3}$ 可以任意取值，所以方程组有无穷多个解.

## 例3解线性方程组

$$\begin{cases}x_{1} - 2x_{2} + 3x_{3} - x_{4} + 2x_{5} = 2, \\3x_{1} - x_{2} + 5x_{3} - 3x_{4} - x_{5} = 6, \\2x_{1} + x_{2} + 2x_{3} - 2x_{4} - 3x_{5} = 8.\end{cases}$$

解 将方程组的第一个方程的(一3)倍加到第二个方程，将第一个方程的(一2)倍加到第三个方程，得方程组:

$$\left\{ \begin{aligned} x_{1} - 2x_{2} + 3x_{3} - x_{4} + 2x_{5} = 2, \\ 5x_{2} - 4x_{3} \quad - 7x_{5} = 0, \\ 5x_{2} - 4x_{3} \quad - 7x_{5} = 4. \end{aligned} \right.$$

再将方程组的第二个方程的(一1)倍加到第三个方程，得方程组:

$$\left\{ \begin{aligned} x_{1} - 2x_{2} + 3x_{3} - x_{4} + 2x_{5} = 2, \\ 5x_{2} - 4x_{3} \quad - 7x_{5} = 0, \\ 0x_{5} = 4. \end{aligned} \right.$$

因方程组的第三个方程无解，从而所给方程组无解.

前面三个例子在解方程组的过程中，我们总要先通过一些变换，将方程组化为容易求解的同解方程组，这些变换可以归纳为以下三种变换:

$1 ^ { \circ }$ 交换两个方程的位置；

$2 ^ { \circ }$ 用一个非零数乘某一个方程；

$3^{\circ}$ 把一个方程的适当倍数加到另一个方程上去.

为了后面叙述方便，我们称这三种变换为线性方程组的初等变换

高斯消元法的过程就是反复施行初等变换的过程，且总是将方程组变成同解方程组.

## 二、矩阵的初等变换

在解线性方程组的过程中，我们已经看到，如果线性方程组各个方程的系数和常数项定了，那么这个线性方程组的解就完全确定了.至于一个方程组的未知量用什么符号是无关紧要的.

既然线性方程组由多个方程的未知量的系数与常数项完全决定，因此可将方程组

[page:19]

的系数与常数项用矩阵表示，整个消元过程都可在矩阵上进行.为此，我们比照线性方程组的初等变换引入矩阵的初等变换的概念

定义1矩阵的行(列)初等变换指对矩阵施以下列三种变换:

$1 ^ { \circ }$ 交换两行(列)的位置；

$2 ^ { \circ }$ 用一非零数乘某一行(列)的所有元；

$3^{\circ}$ 把矩阵的某一行(列)的适当倍数加到另一行(列)上去.

现在解线性方程组可用对增广矩阵施以行初等变换来代替，这样在书写上更方便

为方便计算，用 $r _ { i }$ 表示矩阵的第i行，交换 $i , j$ 两行，记为 $r_{i} \leftrightarrow r_{j}$ ;数 $k$ 乘以第i行，记为 $\frac{k}{}r_{i}$ ;数 k乘以第i行加到第 $j$ 行，记为 $k r_{i} + r_{j}$

现在我们对前面三个例子用矩阵的行初等变换来求解.

先解例1的方程组

$$\left\{ \begin{aligned} 3x_{1} - x_{2} + 5x_{3} = 3, \\ x_{1} - x_{2} + 2x_{3} = 1, \\ x_{1} - 2x_{2} - x_{3} = 2. \end{aligned} \right.$$

对增广矩阵施以行初等变换:

$$\begin{aligned}\overline{A} = & \begin{bmatrix}3 & -1 & 5 \vdots 3 \\1 & -1 & 2 \vdots 1 \\1 & -2 & -1 \vdots 2 \\\end{bmatrix}\xrightarrow{r_1 \leftrightarrow r_3}\begin{bmatrix}1 & -2 & -1 \vdots 2 \\1 & -1 & 2 \vdots 1 \\3 & -1 & 5 \vdots 3 \\\end{bmatrix} \\& \xrightarrow{-r_1 + r_2}\begin{bmatrix}1 & -2 & -1 \vdots & 2 \\0 & 1 & 3 \vdots -1 \\0 & 5 & 8 \vdots -3 \\\end{bmatrix}\xrightarrow{-5r_2 + r_3}\begin{bmatrix}1 & -2 & -1 \vdots & 2 \\0 & 1 & 3 \vdots -1 \\0 & 0 & -7 \vdots & 2 \\\end{bmatrix} \\& \xrightarrow{-\frac{1}{7}r_3}\begin{bmatrix}1 & -2 & -1 \vdots & 2 \\0 & 1 & 3 \vdots -1 \\0 & 0 & 1 \vdots - \frac{2}{7} \\\end{bmatrix}\xrightarrow{r_3 + r_1}\begin{bmatrix}1 & -2 & 0 \vdots & \frac{1}{27} \\0 & 1 & 0 \vdots -\frac{1}{7} \\0 & 1 & 0 \vdots -\frac{1}{7} \\0 & 0 & 1 \vdots - \frac{2}{7} \\\end{bmatrix}\end{aligned}$$

$$\frac { 2 r _ { 2 } + r _ { 1 } } { } \left( \begin{matrix} { 1 } & { 0 } & { 0 } \\ { } & { } & { \vdots } & { \displaystyle \frac { 1 0 } { 7 } } \\ { 0 } & { 1 } & { 0 } & { \displaystyle \vdots } & { - \displaystyle \frac { 1 } { 7 } } \\ { } & { } & { } & { \vdots } & { \displaystyle \vdots } \\ { 0 } & { 0 } & { 1 } & { \displaystyle \vdots } & { - \displaystyle \frac { 2 } { 7 } } \\ \end{matrix} \right) .$$

于是得原方程组的解为

[page:20]

$$\left\{ \begin{aligned} x_{1} &= \frac{10}{7}, \\ x_{2} &= -\frac{1}{7}, \\ x_{3} &= -\frac{2}{7}. \end{aligned} \right.$$

注意，最后两步初等变换我们使用了高斯消元法的改进方法高斯-若尔当消元法，即在行阶梯形矩阵基础上进一步化为简化行阶梯形矩阵.

如果一个矩阵每个非零行的非零首元都出现在上一行非零首元的右边，同时没有一个非零行出现在零行之下，则称这种矩阵为行阶梯形矩阵.如果行阶梯形矩阵的每一个非零行的非零首元都是1，且非零首元所在列的其余元都为0，则称这种矩阵为简化行阶梯形矩阵.

例如下面两个矩阵都是行阶梯形矩阵:

$$\boldsymbol{A} = \begin{pmatrix}1 & 2 & 0 & 0 & 2 \\0 & 0 & 1 & 0 & -1 \\0 & 0 & 0 & 1 & 0\end{pmatrix}, \quad\boldsymbol{B} = \begin{pmatrix}1 & 3 & 0 & -1 \\0 & 2 & 1 & 0 \\0 & 0 & 0 & 1\end{pmatrix},$$

且A为简化行阶梯形矩阵，而B不是简化行阶梯形矩阵.

显然，用有限次行初等变换可以把任何矩阵化为一个简化行阶梯形矩阵，以后还会知道，所得到的简化行阶梯形矩阵是惟一的.于是，这就为用行初等变换将增广矩阵化简的过程提供了一个明确的目标.

再解例2的方程组

$$\begin{cases}x_{1} + 3x_{2} + 4x_{3} = - 2, \\2x_{1} + 5x_{2} + 9x_{3} = 3, \\3x_{1} + 7x_{2} + 14x_{3} = 8, \\\quad - x_{2} + \quad x_{3} = 7.\end{cases}$$

对增广矩阵施以行初等变换:

$$\overline{A} = \begin{vmatrix}1 & 3 & 4 & \frac{1}{2} - 2 \\2 & 5 & 9 & 3 \\3 & 7 & 14 & 8 \\0 & -1 & 1 & 7\end{vmatrix}\xrightarrow{- 2r_{1} + r_{2}}\begin{vmatrix}1 & 3 & 4 & - 2 \\0 & - 1 & 1 & 7 \\0 & - 2 & 2 & 14 \\0 & - 1 & 1 & 7\end{vmatrix}$$

$$\xrightarrow{(-1)r_{2}}\begin{pmatrix}1 & 3 & 4 \\0 & 1 & -1 \\0 & -2 & 2 \\0 & -1 & 1 \\\end{pmatrix}\xrightarrow{2r_{2}+r_{3}}\begin{pmatrix}1 & 3 & 4 & -2 \\0 & 1 & -1 & -7 \\0 & 0 & 0 & 0 \\0 & 0 & 0 & 0 \\\end{pmatrix}$$

[page:21]

$$\xrightarrow { - 3 r _ { 2 } + r _ { 1 } } \left| \begin{matrix} { 1 } & { 0 } & { 7 } & { 1 9 } \\ { 0 } & { 1 } & { - 1 } & { \vdots } & { - 7 } \\ { 0 } & { 0 } & { 0 } & { \vdots } & { 0 } \\ { 0 } & { 0 } & { 0 } & { \vdots } & { 0 } \\ \end{matrix} \right| ,$$

与矩阵对应的方程组为

$$\begin{cases}x_{1} & + 7x_{3} = 19, \\\quad x_{2} - x_{3} = - 7,\end{cases}$$

令 $x_{3} = k(k$ 为任意数)，则方程组的通解为

$$\begin{cases}x_{1} = - 7k + 19, \\x_{2} = \quad k - 7, \\x_{3} = \quad k.\end{cases}$$

最后解例3的方程组

$$\begin{cases}x_{1} - 2x_{2} + 3x_{3} - x_{4} + 2x_{5} = 2, \\3x_{1} - x_{2} + 5x_{3} - 3x_{4} - x_{5} = 6, \\2x_{1} + x_{2} + 2x_{3} - 2x_{4} - 3x_{5} = 8.\end{cases}$$

对增广矩阵施以行初等变换:

$$\begin{aligned}\overline{A} = & \begin{vmatrix}1 & -2 & 3 & -1 & 2 \vdots 2 \\3 & -1 & 5 & -3 & -1 \vdots 8 \\2 & 1 & 2 & -2 & -3 \vdots 8\end{vmatrix}\xrightarrow{-3r_1+r_2}\begin{vmatrix}1 & -2 & 3 & -1 & 2 \vdots 2 \\0 & 5 & -4 & 0 & -7 \vdots 0 \\0 & 5 & -4 & 0 & -7 \vdots 4\end{vmatrix} \\& \xrightarrow{-r_3+r_3}\begin{vmatrix}1 & -2 & 3 & -1 & 2 \vdots 2 \\0 & 5 & -4 & 0 & -7 \vdots 0 \\0 & 0 & 0 & 0 & 0 \vdots 4\end{vmatrix},\end{aligned}$$

与矩阵对应的方程组为

$$\left\{ \begin{aligned} x_{1} - 2x_{2} + 3x_{3} - x_{4} + 2x_{5} = 2, \\ 5x_{2} - 4x_{3} \quad - 7x_{5} = 0, \\ 0x_{5} = 4, \end{aligned} \right.$$

由第三个方程知方程组无解.

从上面的三个例子可见，对于一般的线性方程组 $AX = b$ ，通过消元步骤，即对增广矩阵作三种行初等变换，可将其化为简化行阶梯形矩阵.为了便于作一般的讨论，不妨假设 $\overline{A} = (A, b)$ 化为如下的简化行阶梯形矩阵:

[page:22]

$$\overline { { A } } = ( A   , b ) \twoheadrightarrow \left( \begin{matrix} { c _ { 1 1 } } & { 0 } & { \cdots } & { 0 } & { c _ { 1 , r + 1 } } & { \cdots } & { c _ { 1 n } } & { \vdots } & { d _ { 1 } } \\ { 0 } & { c _ { 2 2 } } & { \cdots } & { 0 } & { c _ { 2 , r + 1 } } & { \cdots } & { c _ { 2 n } } & { \vdots } & { d _ { 2 } } \\ { \vdots } & { \vdots } & { } & { \vdots } & { \vdots } & { \vdots } & { } & { \vdots } & { \vdots } \\ { 0 } & { 0 } & { \cdots } & { c _ { r r } } & { c _ { r , r + 1 } } & { \cdots } & { c _ { r n } } & { \vdots } & { d _ { r } } \\ { 0 } & { 0 } & { \cdots } & { 0 } & { 0 } & { \cdots } & { 0 } & { \vdots } & { d _ { r + 1 } } \\ { 0 } & { 0 } & { \cdots } & { 0 } & { 0 } & { \cdots } & { 0 } & { 0 } \\ { \vdots } & { \vdots } & { } & { \vdots } & { \vdots } & { \vdots } & { \cdots } & { \vdots } & { \vdots } \\ { 0 } & { 0 } & { \cdots } & { 0 } & { 0 } & { \cdots } & { 0 } & { 0 } \end{matrix} \right) ,\tag{1.2}$$

其中 $c_{ii} = 1 \left( i = 1, 2, \cdots, r \right)$

与这个矩阵对应的非齐次线性方程组与 $A X = b$ 是同解方程组.由矩阵易见，方程组有解的充分必要条件是 $d _ { r + 1 } = 0 .$ 因为当 $d_{r + 1} \neq 0$ 时，式(1.2)中第 $r + 1$ 行对应的方程

$$0x_{1} + 0x_{2} + \cdots + 0x_{n} = d_{r + 1}$$

是无解的.

当 $d_{r + 1} = 0$ 时，即在有解的情况下，又分两种情况:

(1)当 $r = n$ 时，有惟一解

$$\left\{ \begin{matrix} { x _ { 1 } } & { = d _ { 1 } , } \\ { x _ { 2 } } & { = d _ { 2 } , } \\ { \hphantom { x _ { 1 } } } & { \hphantom { x _ { 2 } } } \\ { x _ { n } } & { = d _ { n } , } \\ \end{matrix} \right.$$

(2)当 $r < n$ 时，有无穷多个解，求解时，把矩阵中每行第一个非零元 $c_{ii}(i = 1,2,\cdots,r)$所在列对应的未知量(这里是 $x_{1},x_{2},\cdots,x_{r})$ 取为基本未知量，其余未知量(这里是 $\mathcal { X } _ { r + 1 }$ $x_{r + 2}, \cdots, x_{n}$ 取为自由未知量，然后将 $n - r$ 个自由未知量依次取任意常数 $k_{1},k_{2},\cdots,k_{n-r}$即可解得 $x_{1},x_{2},\cdots,x_{r}$ ，从而得到方程组的全部解。

将上述结果总结为如下定理:

定理1设n元非齐次线性方程组 $AX = b$ ，对它的增广矩阵施以行初等变换，得到简化行阶梯形矩阵(1.2)，若 $d_{r + 1} \neq 0$ ，则方程组无解；若 $d_{r + 1} = 0$ ，则方程组有解，而且当 $r = n$ 时有惟一解，当 $r < n$ 时有无穷多解.

用不同的消元步骤，将增广矩阵化为阶梯形矩阵时，阶梯形矩阵的形式不是惟一的，但阶梯形矩阵的非零行的行数是惟一确定的.当方程组有解时，表明解中任意常数的个数是相同的，但解的表示式不是惟一的，然而每一种解的表示式中，包含的无穷多个解的集合又是相等的.这些重要的结论，在第四章研究了向量组的线性相关性理论后才能给以严格的论证.

关于齐次线性方程组 $AX = 0$ ，我们知道它总有平凡解(零解)

$$x_{1}=x_{2}=\cdots=x_{n}=0.$$

当 $r { \leqslant } n$ 时，有无穷多解，求解的方法与非齐次线性方程组相同.如果齐次线性方程组的方程个数m小于未知量个数n，则必有 $r \leqslant m < n$ ，因而必有无穷多个非零解，于

[page:23]

是有如下定理:

定理2 设m个n元方程组成的齐次线性方程组 $AX = \mathbf{0}$ ,若 $m < n$ ，则方程组必有非零解.

最后需要指出:初等变换是可逆变换.初等变换和它的逆变换对比如表1.2所示:

表1.2<table><tr><td>类型</td><td>初等变换</td><td>逆变换</td></tr><tr><td>I</td><td>交换两行(列)</td><td>交换同样的两行(列)</td></tr><tr><td>Ⅱ</td><td>用<eq>k \neq 0</eq>乘某一行(列)</td><td>用乘同一行(列)<eq>\frac{1}{k}</eq></td></tr><tr><td>Ⅲ</td><td>把第i行(列)的k倍加到第j行(列)上</td><td>把第i行(列)的一k倍加到第j行(列)上</td></tr></table>

如果矩阵A经过有限次初等变换变成矩阵B，就称矩阵A与B等价，记作 $A { \cong } B$若使用的是行(列)初等变换，则称A与B行(列)等价.

不难证明:矩阵的等价关系具有:

(1) 反身性 $A { \cong } A$

(2) 对称性若 $A \cong B$ ,则 $B { \cong } A$

(3) 传递性若 $A \cong B, B \cong C$ ，则 $A { \cong } C ,$

## 三、初等矩阵

初等变换在矩阵理论中具有十分重要的作用.根据矩阵乘法运算的特定涵义，我们可以把矩阵的初等变换表示为矩阵的乘法运算.先看几个矩阵的乘法运算.

设

$$\boldsymbol{A} = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ a_{31} & a_{32} & \cdots & a_{3n} \end{bmatrix}$$

,则

$$\begin{pmatrix}0 & 1 & 0 \\1 & 0 & 0 \\0 & 0 & 1\end{pmatrix}\begin{bmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\a_{31} & a_{32} & \cdots & a_{3n}\end{bmatrix}=\begin{bmatrix}a_{21} & a_{22} & \cdots & a_{2n} \\a_{11} & a_{12} & \cdots & a_{1n} \\a_{31} & a_{32} & \cdots & a_{3n}\end{bmatrix},$$

$$\begin{pmatrix}1 & 0 & 0 \\0 & c & 0 \\0 & 0 & 1\end{pmatrix}\begin{bmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\a_{31} & a_{32} & \cdots & a_{3n}\end{bmatrix}=\begin{bmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\ca_{21} & ca_{22} & \cdots & ca_{2n} \\a_{31} & a_{32} & \cdots & a_{3n}\end{bmatrix},$$

$$\begin{pmatrix}1 & 0 & 0 \\0 & 1 & 0 \\c & 0 & 1\end{pmatrix}\begin{bmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\a_{31} & a_{32} & \cdots & a_{3n}\end{bmatrix}=\begin{bmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\a_{31} + a_{31} & c a_{12} + a_{32} & \cdots & c a_{1n} + a_{3n}\end{bmatrix},$$

由此可见，上面左边三个三阶矩阵左乘A，分别使A作了三种行初等变换(第1，2行交换;A的第2行乘c；第1行乘c加到第3行).这三个三阶矩阵本身又是单位矩阵作同样的行初等变换(即对A所作的三种行初等变换)而得到的，它们称为初等矩阵.上面三个式子表明A的行初等变换可以表示成相应的初等矩阵左乘A的运算.

[page:24]

下面给出初等矩阵的一般定义，并讨论矩阵的行(列)初等变换如何表示为矩阵与初等矩阵的乘法运算.

定义2将单位矩阵作一次初等变换得到的矩阵，称为初等矩阵

对应于三种初等变换有三种类型的初等矩阵.

$$\begin{aligned}\mathbf{1}^{\circ} \quad \boldsymbol{E}_{ij} &=\begin{bmatrix}1 &  &  &  &  &  &  &  \\& \ddots &  &  &  &  &  &  & \ddots &  \\&  & 1 &  &  &  &  &  &  &  \\&  &  & 0 & \cdots &  & 1 &  &  &  \\&  &  &  & 1 &  &  &  &  &  \\&  &  & \vdots & \ddots &  & \vdots &  &  &  \\&  &  &  &  & 1 &  &  &  \\&  &  & 1 & \cdots &  & 0 &  &  &  \\&  &  &  &  &  &  & 1 &  \\&  &  &  &  &  &  & \ddots &  \\&  &  &  &  &  &  &  & 1 \\\end{bmatrix}\end{aligned} 第  i  行$$

$E_{ij}$ 是由单位矩阵第i，j行(或列)交换而得到的.

$$\boldsymbol{Q}^{\circ} \quad \boldsymbol{E}_{i}(\boldsymbol{c}) = \begin{aligned}\begin{bmatrix} 1 & & & & \\ & \ddots & & & \\ & & 1 & & \\ & & & c & \\ & & & & 1 \\ & & & & & \ddots \\ & & & & & & 1 \end{bmatrix}  第  i  行 , \\\end{aligned}$$

其中 $c \ne 0,E_{i}(c)$ 是由单位矩阵第i行(或列)乘c而得到的.

$$\begin{aligned} &\boldsymbol{B}^{\circ} \quad \boldsymbol{E}_{ij}\left(c\right)=\begin{bmatrix}1 &  &  &  &  &  \\& \ddots &  &  &  &  \\&  & 1 &  &  &  \\&  & \vdots & \ddots &  &  \\&  & c & \cdots & 1 &  \\&  &  &  &  & \ddots &  \\&  &  &  &  &  & 1\end{bmatrix} 第  i  行  j  行 .\\ \end{aligned}$$

$\underline{E}_{ij}(c)$ 是由单位矩阵第i行乘c加到第j行而得到的，或由第j列乘c加到第i列而得到的.

由矩阵乘法定义立即可得如下定理:

定理3 对一个 $m \times n$ 矩阵A作一次行初等变换就相当于在A的左边乘上相应的 $m \times m$ 初等矩阵；对A作一次列初等变换就相当于在A的右边乘上相应的 $m \times n$ 初等矩阵.

[page:25]

如果矩阵B是由A经过有限次行初等变换得到的，则必存在有限个初等矩阵$E_{1},E_{2},\cdots,E_{k}$ ,使得

$$\boldsymbol{B} = \boldsymbol{E}_{k} \boldsymbol{E}_{k - 1} \cdots \boldsymbol{E}_{1} \boldsymbol{A}.$$

如果矩阵B是由A经过有限次列初等变换得到的，则必存在有限个初等矩阵 $E_{1}^{\prime}$ $E_{2}^{\prime}, \cdots, E_{s}^{\prime}$ ，使得

$$\boldsymbol{B} = \boldsymbol{A} \boldsymbol{E}_{1}^{\prime} \boldsymbol{E}_{2}^{\prime} \cdots \boldsymbol{E}_{s}^{\prime}.$$

如果矩阵B是由A经过有限次初等变换得到的，则必存在有限个初等矩阵 $P_{1}$ $P_{2},\cdots,P_{k}$ 与 $Q_{1},Q_{2},\cdots,Q_{l}$ ,使得

$$\boldsymbol{B} = \boldsymbol{P}_{k} \boldsymbol{P}_{k - 1} \cdots \boldsymbol{P}_{1} \boldsymbol{A} \boldsymbol{Q}_{1} \cdots \boldsymbol{Q}_{l - 1} \boldsymbol{Q}_{l}.$$

例4 设

$$\begin{aligned}\boldsymbol{P}_{1} &= \begin{bmatrix}1 & 0 & 3 & & 1 \\0 & 2 & 1 & -1 \\1 & 2 & 1 & & 2 \\2 & 1 & 0 & & 1\end{bmatrix}, \quad\boldsymbol{P}_{2} = \begin{bmatrix}1 & 0 & 0 & 0 \\0 & 1 & 0 & 0 \\0 & 0 & 1 & 0 \\c & 0 & 0 & 1\end{bmatrix}, \quad\boldsymbol{P}_{3} = \begin{bmatrix}1 & & & \\& k & & \\& & 1 & \\& & & 1\end{bmatrix}, \\& \quad & 1\end{aligned}$$

典型例题讲解初等矩阵与初等变换

求 $P_{1}P_{2}P_{3}$

解

$$\begin{aligned}\boldsymbol{P}_{1} \boldsymbol{P}_{2} \boldsymbol{P}_{3} &= (\boldsymbol{P}_{1} \boldsymbol{P}_{2}) \boldsymbol{P}_{3} =\begin{vmatrix}1 + c & 0 & 3 & 1 \\-c & 2 & 1 & -1 \\1 + 2c & 2 & 1 & 2 \\2 + c & 1 & 0 & 1\end{vmatrix}\begin{vmatrix}1 &  &  &  \\& k &  &  \\&  & 1 &  \\&  &  & 1\end{vmatrix}\\&=\begin{vmatrix}1 + c & 0 & 3 & 1 \\-c & 2k & 1 & -1 \\1 + 2c & 2k & 1 & 2 \\2 + c & k & 0 & 1\end{vmatrix}.\end{aligned}$$

## 应用实例:计算机层析X射线

计算机层析扫描仪根据仅从患者头部外侧测得的X射线，来计算、描绘病人大脑的图像.

图1.1说明线性代数在计算机层析X射线照相术中的作用.在三角形中，3个小圆圈表示3个小的器官，分别表示为 $x_{1},x_{2}$ 与 $x_{3}$ ，而直线则表示X射线.这些小器官的位置尚属未知，这就使每根X射线不能仅对准一个器官.在这里，沿 $L _ { 1 2 }$ 通过的总质量为 $x_{1} + x_{2}$ ,其中 $\mathcal { X } _ { 1 } , \mathcal { X } _ { 2 }$ 分别为器官的质量，它们吸收一定强度的X射线.通过测量吸收的强度，我们能求出射线通过的总质量，所以 $x_{1} + x_{2}$ 是一个已知量 $b _ { 1 }$ ，即$x_{1} + x_{2} = b_{1}$ .这同样也适用于其他的直线，于是我们可得下列方程组:

[page:26]

$$\begin{cases}x_{1} + x_{2} = b_{1}, \\x_{2} + x_{3} = b_{2}, \\x_{3} + x_{3} = b_{3},\end{cases}$$

用高斯消元法可求出质量 $\left( x _ { 1 } , x _ { 2 } , x _ { 3 } \right)$

为了医学诊断的需要，计算机层析不仅要在这三个位置，而且要在每一个器官的几千个点处计算组织的密度，而每条X射线要穿过许多这样的点，因此，我们可以得到含几千个未知数的几千个方程组成的线性方程组，在所选的第N个点具有未知的标记密度 $x_{N}$ (即“线性吸收系数”).这种问题的解答不仅涉及线性代数，还涉及更进一步的数学知识.

## 题1.2

1. 解下列线性方程组:

(1)

$$\begin{cases}x_{1} + 2x_{2} + 3x_{3} = 8, \\2x_{1} + 5x_{2} + 9x_{3} = 16, \\3x_{1} - 4x_{2} - 5x_{3} = 32;\end{cases}$$

(2)

$$\begin{cases}x_{1} + 2x_{2} + 3x_{3} = 4, \\3x_{1} + 5x_{2} + 7x_{3} = 9, \\5x_{1} + 8x_{2} + 11x_{3} = 14;\end{cases}$$

(3)

$$\begin{cases}2x_{1} + x_{2} + 3x_{3} = 6, \\3x_{1} + 2x_{2} + x_{3} = 1, \\5x_{1} + 3x_{2} + 4x_{3} = 27\end{cases}$$

(4)

$$\begin{cases}x_{1} + x_{2} + x_{3} = 1, \\x_{1} + 2x_{2} - 5x_{3} = 2, \\2x_{1} + 3x_{2} - 4x_{3} = 5\end{cases}$$

(5)

$$\begin{cases}x_{1} - x_{2} + 2x_{4} + x_{5} = 0, \\3x_{1} - 3x_{2} + 7x_{4} = 0, \\x_{1} - x_{2} + 2x_{3} + 3x_{4} + 2x_{5} = 0, \\2x_{1} - 2x_{2} + 2x_{3} + 7x_{4} - 3x_{5} = 0.\end{cases}$$

2. 用行初等变换将矩阵A变为单位矩阵:

(1)

$$A = \begin{pmatrix}1 & 0 & 0 & 0 \\1 & 1 & 0 & 0 \\1 & 1 & 1 & 0 \\1 & 1 & 1 & 1\end{pmatrix};$$

(2)

$$\boldsymbol{A} = \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & 1 & -1 & -1 \\ 1 & -1 & 1 & -1 \\ 1 & -1 & -1 & 1 \end{bmatrix};$$

(3) $A = \begin{bmatrix} 2 & a \\ b & 2 \end{bmatrix}, ab \neq 4.$

3. 讨论λ为何值时， $\boldsymbol{A} = \begin{pmatrix}3 & 1 & 1 & 4 \\\lambda & 4 & 10 & 1 \\1 & 7 & 17 & 3 \\2 & 2 & 4 & 3\end{pmatrix}$ 经行初等变换所得行阶梯形矩阵分别有两

[page:27]

个、三个非零行.

4. 设A是3阶矩阵，将A的第1列与第2列交换得B，再把B的第2列加到第3列得C,求矩阵Q，使得 $AQ = C.$

## §1.3 逆矩阵

## 一、逆矩阵的概念与性质

前面我们定义了矩阵的加法、减法和乘法三种运算.自然地，欲在矩阵中引入类似于“除法”的概念，其关键是要引入类似于数的倒数的概念

对于任意方阵A，有

$$AI = IA = A.$$

所以，从矩阵乘法的角度来看，单位矩阵Ⅰ类似于数1的作用.一个数 $\bar{a} \ne 0$ 的倒数$a^{-1}$ 可用

$$aa^{-1}=1 \quad  或  \quad a^{-1}a=1$$

来刻画.类似地，我们引入逆矩阵的概念

定义设A为n阶方阵，若存在n阶方阵B，使得

$$AB = BA = I$$

则称A是可逆矩阵，简称A可逆，并称B是A的逆矩阵.

定理1设A是可逆矩阵，则它的逆矩阵是惟一的.

证 设A有两个逆矩阵B和C，即

$$AB = BA = I, AC = CA = I.$$

于是

$$B = B I = B ( A C ) = ( B A ) C = I C = C.$$

故可逆矩阵的逆矩阵是惟一的.

由定义可知，如果B是A的逆矩阵，则A亦是B的逆矩阵，它们互为逆矩阵.

如果A可逆，则A的逆矩阵存在，记为 $A^{-1}$ ，且有 $A A ^ { - 1 } = A ^ { - 1 } A = I$

在后面的δ2.2中我们将证明:如果A，B为n阶方阵，且 $AB = I$ (或 $BA = I$ ,则$\tilde{B} \equiv A^{-1}$ .这样，检验矩阵可逆时，就不必按定义证明 $\boldsymbol{A}\boldsymbol{B}=\boldsymbol{I}$ 且 $BA = I$ ，而只要证明$AB = I$ (或 $BA = I$ 就行了.

显然， $I^{-1} = I$ .由逆矩阵的定义易得对角矩阵的逆矩阵.设

$$A = \mathrm{diag}(d_1, d_2, \cdots, d_n), d_i \neq 0 (i = 1, 2, \cdots, n),$$

则

[page:28]

$$\boldsymbol{A}^{-1} = \mathrm{diag} \left( \frac{1}{d_1}, \frac{1}{d_2}, \cdots, \frac{1}{d_n} \right).$$

要注意的是，并非每个矩阵都有逆矩阵，例如矩阵 $\left[ \begin{matrix} { 0 } & { 0 } \\ { 1 } & { 1 } \\ \end{matrix} \right]$ 不可能有逆矩阵，因为它与任何二阶矩阵的乘积都不可能为单位矩阵.

例1设 $\boldsymbol{A} = \begin{pmatrix} 0 & 1 \\ 1 & 2 \end{pmatrix}$ ,求A的逆矩阵.

解用待定系数法，令 $A^{-1} = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$ ,则可得

$$\boldsymbol { A } \boldsymbol { A } ^ { - 1 } = \begin{bmatrix} 0 & 1 \\ 1 & 2 \end{bmatrix} \begin{bmatrix} a & b \\ c & d \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = \boldsymbol { I } ,$$

所以

$$\begin{pmatrix}c & d \\a + 2c & b + 2d\end{pmatrix}=\begin{pmatrix}1 & 0 \\0 & 1\end{pmatrix}$$

因此可得线性方程组

$$\begin{cases}c = 1, \\d = 0, \\a + 2c = 0, \\b + 2d = 1.\end{cases}$$

解得 $a=-2,b=1,c=1,d=0$

$$A^{-1} = \begin{bmatrix} -2 & 1 \\ 1 & 0 \end{bmatrix}.$$

用待定系数法求n阶矩阵的逆矩阵，当n较大时，工作量很大，因此并不方便，后面将介绍简便的方法.在介绍其他方法之前，先研究逆矩阵的性质.

定理2 设A,B均为n阶可逆矩阵，数 $\lambda \neq 0$ ,则

$1 ^ { \circ } \quad A ^ { - 1 }$ 可逆，且 $(A^{-1})^{-1} = A$

$2^{\circ} \quad \lambda \boldsymbol{A}$ 可逆，且 $(\lambda \boldsymbol{A})^{-1} = \frac{1}{\lambda} \boldsymbol{A}^{-1}$ 06

$3^{\circ} \quad AB$ 可逆，且 $( \boldsymbol{A} \boldsymbol{B} )^{-1} = \boldsymbol{B}^{-1} \boldsymbol{A}^{-1}$

$4^{\circ} \quad A^{\mathrm{T}}$ 可逆，且 $\left( \boldsymbol{A}^{\mathrm{T}} \right)^{-1} = \left( \boldsymbol{A}^{-1} \right)^{\mathrm{T}}$

证 我们证明其中的 $3^{\circ}$ 和 $4 ^ { \circ }$

$3^{\circ}$ 因为

[page:29]

$$\left( \boldsymbol{A} \boldsymbol{B} \right) \left( \boldsymbol{B}^{-1} \boldsymbol{A}^{-1} \right) = \boldsymbol{A} \left( \boldsymbol{B} \boldsymbol{B}^{-1} \right) \boldsymbol{A}^{-1} = \boldsymbol{A} \boldsymbol{I} \boldsymbol{A}^{-1} = \boldsymbol{A} \boldsymbol{A}^{-1} = \boldsymbol{I},$$

所以AB可逆，且 $(AB)^{-1} = B^{-1}A^{-1}$

$4 ^ { \circ }$ 因为

$$\boldsymbol{A}^{\mathrm{T}}(\boldsymbol{A}^{-1})^{\mathrm{T}}=(\boldsymbol{A}^{-1}\boldsymbol{A})^{\mathrm{T}}=\boldsymbol{I}^{\mathrm{T}}=\boldsymbol{I},$$

所以 $A^{\mathrm{T}}$ 可逆，且 $\left( \boldsymbol{A}^{\mathrm{T}} \right)^{-1} = \left( \boldsymbol{A}^{-1} \right)^{\mathrm{T}}$

对于上述性质中的 $3 ^ { \circ }$ ，由数学归纳法不难推广到s个矩阵的乘积.若 $A_{1},A_{2},\cdots$ A。均为同阶可逆矩阵，则

$$\left( \boldsymbol{A}_{1} \boldsymbol{A}_{2} \cdots \boldsymbol{A}_{s} \right)^{-1} = \boldsymbol{A}_{s}^{-1} \boldsymbol{A}_{s-1}^{-1} \cdots \boldsymbol{A}_{1}^{-1}.$$

例2设方阵B为幂等矩阵(即 $\hat{B}^{2} \equiv \hat{B}$ ，从而 $\forall k \in \mathbf{N}^{*} \mathbb{D}, B^{k} = B ), A = I + B$ ,证明:A可逆，且

$$A^{-1} = \frac{1}{2}(3I - A).$$

证

$$A \left( \frac{1}{2} (3I - A) \right) = \frac{1}{2} (3A - A^2)$$

而

$$A^{2} = (I + B)^{2} = I + 2B + B^{2} = I + 3B = I + 3(A - I) = 3A - 2I,$$

于是

$$A \left( \frac{1}{2} \left( 3I - A \right) \right) = \frac{1}{2} \left( 3A - 3A + 2I \right) = I,$$

故A可逆，且 $A^{-1} = \frac{1}{2}(3I - A)$

例3 设矩阵 A满足 $A^{2}-3A-10I=O$ ，证明:A，A-4I都可逆，并求它们的逆矩阵.

证 由 $A^{2}-3A-10I=O$ 得 $A(A - 3I) = 10I$ ,即

$$A \left( \frac{1}{10} (A - 3I) \right) = I,$$

故由逆矩阵的定义知，A可逆，且 $A^{-1} = \frac{1}{10}(A - 3I)$

典型例题讲解利用定义求逆矩阵

再由 $A^{2}-3A-10I=O$ 得 $(A + I)(A - 4I) = 6I$ ,即

$$\frac{1}{6}(A + I)(A - 4I) = I,$$

故A-4I可逆，且 $(A - 4I)^{-1} = \frac{1}{6}(A + I)$

[page:30]

由初等变换可逆及其与逆变换的对应关系可知，初等矩阵是可逆的，且逆矩阵仍为初等矩阵，事实上，

$$\boldsymbol { E } _ { i j } ^ { - 1 } = \boldsymbol { E } _ { i j } ; \boldsymbol { E } _ { i } ^ { - 1 } ( c ) = \boldsymbol { E } _ { i } \left( \frac { 1 } { c } \right) , c \neq 0 ; \boldsymbol { E } _ { i j } ^ { - 1 } ( c ) = \boldsymbol { E } _ { i j } ( - c ) .$$

定理3 设A为n阶矩阵，则下列各命题是等价的.

1°A是可逆的；

$2 ^ { \circ }$ 齐次线性方程组 $AX = 0$ 只有零解；

$3 ^ { \circ }$ A与I行等价；

$4 ^ { \circ }$ A可表为有限个初等矩阵的乘积

证 $1^{\circ} \Rightarrow 2^{\circ}$ 设A 是可逆的且X是 $AX = 0$ 的解，则

$$\boldsymbol{X}=\boldsymbol{I}\boldsymbol{X}=(\boldsymbol{A}^{-1}\boldsymbol{A})\boldsymbol{X}=\boldsymbol{A}^{-1}(\boldsymbol{A}\boldsymbol{X})=\boldsymbol{A}^{-1}\boldsymbol{0}=\boldsymbol{0}$$

因此，AX=0只有零解.

$2^{\circ} \Rightarrow 3^{\circ}$ 若齐次线性方程组 $AX = 0$ 只有零解.设

$$A \xrightarrow{行初等变换} B \text {(} B  为行阶梯形矩阵)$$

则 $AX = \mathbf{0}$ 与 $B X = 0$ 同解.若B有一对角元为零，则B的最后一行元全为零，这样 $AX =$ 0同解于未知量个数多于方程个数的线性方程组.于是AX=0有非零解，这与已知矛盾.因而行阶梯形矩阵B的对角元全为非零，从而A经过行初等变换可化为的简化行阶梯形矩阵是I，即A与I行等价.

$3 ^ { \circ } \Rightarrow 4 ^ { \circ }$ 因为A与I行等价.所以A经过行初等变换可以得到I.又因对A施以行初等变换相当于用初等矩阵左乘A，从而存在初等矩阵 $P_{1},P_{2},\cdots,P_{k}$ ，使得 $P_{k} \cdots$ $P_{2}P_{1}A = I$ ，又因初等矩阵可逆，故

$$\boldsymbol{A} = \boldsymbol{P}_{1}^{-1} \boldsymbol{P}_{2}^{-1} \cdots \boldsymbol{P}_{k}^{-1},$$

而初等矩阵的逆矩阵仍为初等矩阵，所以A可表示为有限个初等矩阵的乘积

$4^{\circ} \Rightarrow 1^{\circ}$ 设存在初等矩阵 $E_{1},E_{2},\cdots,E_{k}$ ,使得

$$\boldsymbol{A} = \boldsymbol{E}_{1} \boldsymbol{E}_{2} \cdots \boldsymbol{E}_{k}$$

由初等矩阵可逆及定理2中 $3 ^ { \circ }$ 的推广知 $E_{1}E_{2}\cdots E_{k}$ 也可逆.故A 可逆.

推论设A为n阶矩阵，则非齐次线性方程组 $AX = b$ 有惟一解的充分必要条件是A 可逆.

证 充分性:若A可逆，则 $AX = b$ 有惟一解 $\hat{X} = \hat{A}^{-1} \hat{b}$

必要性:设 $AX = b$ 有惟一解X，但A不可逆，则AX=0有非零解 $Z \neq 0 ,$ 令

$$Y = X + Z ,$$

易知 $Y \neq X$ 且

$$AY = A\left( X + Z \right) = AX + AZ = b + 0 = b$$

即Y也为AX=b的解，矛盾.故A可逆.

[page:31]

## 二、用行初等变换求逆矩阵

现在我们介绍一个求 $A^{-1}$ 的简便方法.设A可逆，故存在初等矩阵 $E_{1},E_{2},\cdots$ $E_{k}$ ,使得

$$E_{k}E_{k - 1}\cdots E_{1}A = I,$$

即

$$\boldsymbol{A}^{-1}=\boldsymbol{E}_{k} \boldsymbol{E}_{k-1} \cdots \boldsymbol{E}_{1}=\boldsymbol{E}_{k} \boldsymbol{E}_{k-1} \cdots \boldsymbol{E}_{1} \boldsymbol{I}.$$

因此，如果用一系列行初等变换将A化为I，则用同样的行初等变换就将I化为 $A^{-1}$这就给我们提供了一个计算 $A^{-1}$ 的有效方法:若对(A，I)施以行初等变换将A变为I,则I就变为 $\tilde{A}^{-1}$ ,即

$$(A,I) \xrightarrow{ 行初等变换 } (I,A^{-1}).$$

例4 利用行初等变换求 $\boldsymbol{A} = \begin{pmatrix}0 & 2 & -1 \\1 & 1 & 2 \\-1 & -1 & -1\end{pmatrix}$ 的逆矩阵 $\vec{A}^{-1}$

解

$$\left( \boldsymbol { A } , \boldsymbol { I } \right) = \begin{pmatrix} 0 & 2 & - 1 \vdots 1 & 0 & 0 \\ 1 & 1 & 2 \vdots 0 & 1 & 0 \\ - 1 & - 1 & - 1 \vdots 0 & 0 & 1 \end{pmatrix} \xrightarrow{r_{1} \leftrightarrow r_{2}} \begin{pmatrix} 1 & 1 & 2 \vdots 0 & 1 & 0 \\ 0 & 2 & - 1 \vdots 1 & 0 & 0 \\ - 1 & - 1 & - 1 \vdots 0 & 0 & 1 \end{pmatrix}$$

$$\xrightarrow{r_{1}+r_{3}}\begin{pmatrix}1 & 1 & 2 \vdots 0 & 1 & 0 \\0 & 2 & -1 \vdots 1 & 0 & 0 \\0 & 0 & 1 \vdots 0 & 1 & 1\end{pmatrix}\xrightarrow{r_{3}+r_{2}}\begin{pmatrix}1 & 1 & 2 \vdots 0 & 1 & 0 \\0 & 2 & 0 \vdots 1 & 1 & 1 \\0 & 0 & 1 \vdots 0 & 1 & 1\end{pmatrix}$$

典型例题讲解利用初等变换求逆矩阵

$$\xrightarrow{-2r_{3}+r_{1}}\begin{bmatrix}1&1&0&\vdots&0&-1&-2\\0&2&0&\vdots&1&1&1\\0&0&1&0&1&1\end{bmatrix}\xrightarrow{\frac{1}{2}\bullet r_{2}}\begin{bmatrix}1&1&0&\vdots&0&-1&-2\\0&1&0&\vdots&1&&\frac{1}{2}&\frac{1}{2}\\0&0&1&0&1&1&1\end{bmatrix}$$

$$\xrightarrow{-r_{2}+r_{1}}\begin{bmatrix}1&0&0&\vdots&-\dfrac{1}{2}&-\dfrac{3}{2}&-\dfrac{5}{2}\\& &\vdots& & \\0&1&0&\vdots&\dfrac{1}{2}&\dfrac{1}{2}&\dfrac{1}{2}\\& &\vdots& & \\0&0&1&\vdots&0&1&1\end{bmatrix},$$

$$\boldsymbol{A}^{-1}=\left[\begin{aligned}-\frac{1}{2} & \quad -\frac{3}{2} & \quad -\frac{5}{2} \\\frac{1}{2} & \quad \frac{1}{2} & \quad \frac{1}{2} \\0 & \quad 1 & \quad 1\end{aligned}\right].$$

[page:32]

值得注意的是，用行初等变换求逆矩阵时，必须始终用行初等变换，其间不能作任何列初等变换.

例5 问矩阵 $A = \begin{pmatrix}1 & - 2 & 1 \\2 & 0 & 1 \\0 & 4 & - 1\end{pmatrix}$ 是否可逆?

解

$$\begin{aligned}(A, \boldsymbol{I}) &=\begin{bmatrix}1 & -2 & 1 \vdots & 1 & 0 & 0 \\2 & 0 & 1 \vdots & 0 & 1 & 0 \\0 & 4 & -1 \vdots & 0 & 0 & 1\end{bmatrix}\rightarrow\begin{bmatrix}1 & -2 & 1 \vdots & 1 & 0 & 0 \\0 & 4 & -1 \vdots & -2 & 1 & 0 \\0 & 4 & -1 \vdots & 0 & 0 & 1\end{bmatrix}\\&\rightarrow\begin{bmatrix}1 & -2 & 1 \vdots & 1 & 0 & 0 \\0 & 4 & -1 \vdots & -2 & 1 & 0 \\0 & 0 & 0 \vdots & 2 & -1 & 1\end{bmatrix},\end{aligned}$$

故 A 不可逆.

例6解线性方程组 $\left\{ \begin{aligned} 2x_{2} - x_{3} = 2, \\ x_{1} + x_{2} + 2x_{3} = 1, \\ - x_{1} - x_{2} - x_{3} = 1 \end{aligned} \right.$

解 以前我们用高斯消元法求解，现在用逆矩阵求解.设原方程组为 $AX = b$ ,其中

$$\boldsymbol{A} = \begin{pmatrix}0 & 2 & -1 \\1 & 1 & 2 \\-1 & -1 & -1\end{pmatrix}, \quad \boldsymbol{b} = \begin{pmatrix}2 \\1 \\1\end{pmatrix},$$

由例4知 $\boldsymbol{A}^{-1}=\left|\begin{aligned}-\frac{1}{2} & \quad -\frac{3}{2} & \quad -\frac{5}{2} \\ \frac{1}{2} & \quad \frac{1}{2} & \quad \frac{1}{2} \\ 0 & \quad 1 & \quad 1\end{aligned}\right|$ ，故原方程组有惟一解

$$\boldsymbol{X}=\boldsymbol{A}^{-1}\boldsymbol{b}=(-5,2,2)^{\mathrm{T}}.$$

方程组AX=B可以认为是矩阵方程，若A可逆，则有解 $\boldsymbol{X} = \boldsymbol{A}^{-1} \boldsymbol{B}$ .而对于矩阵方程 $XA = B$ ，若A可逆，则有解 $X = BA^{-1}$ .若A，B均可逆，对于矩阵方程 $AXB = C$ ，则有解

$$\boldsymbol{X} = \boldsymbol{A}^{-1} \boldsymbol{C} \boldsymbol{B}^{-1}.$$

类似于前面关于 $(A,I) \xrightarrow{ 行初等变换 } (I,A^{-1})$ 的推导方法，我们很容易知道可以用如下方法求 $\boldsymbol{A}^{-1} \boldsymbol{B}$ (留给读者自证):

[page:33]

$$(A,B) \xrightarrow{ 行初等变换 } (I,A^{-1}B)$$

例7设 $( 2 \boldsymbol { I } - \boldsymbol { C } ^ { - 1 } \boldsymbol { B } ) \boldsymbol { A } ^ { \mathrm { T } } = \boldsymbol { C } ^ { - 1 }$ ，其中I是4阶单位矩阵，

$$\boldsymbol{B} = \begin{pmatrix}1 & 2 & -3 & -2 \\0 & 1 & 2 & -3 \\0 & 0 & 1 & 2 \\0 & 0 & 0 & 1\end{pmatrix}, \quad\boldsymbol{C} = \begin{pmatrix}1 & 2 & 0 & 1 \\0 & 1 & 2 & 0 \\0 & 0 & 1 & 2 \\0 & 0 & 0 & 1\end{pmatrix},$$

求A.

解 由题设有 $C(2I - C^{-1}B)A^{\mathrm{T}} = I$ ,即 $(2C - B)A^{\mathrm{T}} = I$ ，也就是 $A(2C - B)^{\mathrm{T}} = I$由于

$$\begin{aligned} &2\boldsymbol{C}-\boldsymbol{B}=\begin{bmatrix}1&2&3&4\\0&1&2&3\\0&0&1&2\\0&0&0&1\end{bmatrix},\\ \end{aligned}$$

且易知 $2C - B$ 可逆，因而 $(2C - B)^{\mathrm{T}}$ 也可逆，于是

$$\boldsymbol{A} = \left( (2\boldsymbol{C} - \boldsymbol{B})^{\mathrm{T}} \right)^{-1} = \left( (2\boldsymbol{C} - \boldsymbol{B})^{-1} \right)^{\mathrm{T}} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ -2 & 1 & 0 & 0 \\ 1 & -2 & 1 & 0 \\ 0 & 1 & -2 & 1 \end{bmatrix}.$$

例8设

$$\begin{aligned}\boldsymbol{P}_{1} &= \begin{bmatrix}0 & 0 & 1 & 0 \\0 & 1 & 0 & 0 \\1 & 0 & 0 & 0 \\0 & 0 & 0 & 1\end{bmatrix}, \quad\boldsymbol{P}_{2} = \begin{bmatrix}1 & 0 & 0 & 0 \\0 & 1 & 0 & 0 \\0 & 0 & 1 & 0 \\c & 0 & 0 & 1\end{bmatrix}, \quad\boldsymbol{P}_{3} = \begin{bmatrix}1 & & & \\& k & & \\& & 1 & \\& & & 1\end{bmatrix}, \\& \quad & 1\end{aligned}$$

求 $\left( \boldsymbol{P}_{1} \boldsymbol{P}_{2} \boldsymbol{P}_{3} \right)^{-1}$

解

$$\begin{aligned} &( \boldsymbol { P } _ { 1 } \boldsymbol { P } _ { 2 } \boldsymbol { P } _ { 3 } ) ^ { - 1 } = \boldsymbol { P } _ { 3 } ^ { - 1 } \boldsymbol { P } _ { 2 } ^ { - 1 } \boldsymbol { P } _ { 1 } ^ { - 1 } = \begin{pmatrix} 1 & & & \\ & 1 & & \\ & \frac { 1 } { k } & & \\ & & 1 & \\ & & & 1 \end{pmatrix} \begin{pmatrix} & 1 & 0 & 0 & 0 \\ & 0 & 1 & 0 & 0 \\ & 0 & 0 & 1 & 0 \\ & - c & 0 & 0 & 1 \end{pmatrix} \begin{pmatrix} 0 & 0 & 1 & 0 \\ 0 & 1 & 0 & 0 \\ & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix}\\ \end{aligned}$$

$$\begin{aligned} &= \begin{bmatrix} 1 &  &  &  \\& \frac{1}{k} &  &  \\&  & 1 &  \\&  &  & 1 \\&  &  &  & 1 \\&\end{bmatrix} \begin{bmatrix} 0 & 0 & 1 & 0 \\ 0 & 1 & 0 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & -c & 1 \\&\end{bmatrix} = \begin{bmatrix} 0 & 0 & 1 & 0 \\ 0 & \frac{1}{k} &  & 0 & 0 \\ 1 & 0 &  & 0 & 0 \\ 0 & 0 & -c & 1 \\&\end{bmatrix}.\\ \end{aligned}$$

[page:34]

## 应用实例:敏感度分析—扰动分析

实例一个家具厂生产桌子、椅子和沙发，该厂一个月可用550单位木材，475单位劳力及222单位纺织品.家具厂要为每月用完这些资源制订生产计划表.不同产品所需资源的数量如下:

<table><tr><td></td><td>桌子</td><td></td><td>椅子</td><td>沙发</td></tr><tr><td>木</td><td>材</td><td>4</td><td>2</td><td>5</td></tr><tr><td>劳力</td><td></td><td>3</td><td>2</td><td>5</td></tr><tr><td>纺织品</td><td></td><td>0</td><td>2</td><td>4</td></tr></table>

试确定:

(1)每种产品应生产出多少个？

(2)若纺织品的数量增加10个单位，所生产沙发的数量改变多少?

解（1）设每月生产桌子、椅子和沙发的数量分别为 $x_{1},x_{2},x_{3}$

$$\boldsymbol{X} = \begin{bmatrix} x_{1} \\ x_{2} \\ x_{3} \end{bmatrix}, \quad \boldsymbol{A} = \begin{bmatrix} 4 & 2 & 5 \\ 3 & 2 & 5 \\ 0 & 2 & 4 \end{bmatrix}, \quad \boldsymbol{b} = \begin{bmatrix} 550 \\ 475 \\ 222 \end{bmatrix},$$

则有 $AX = b$

$$\boldsymbol{A}^{-1}=\begin{pmatrix}1 & -1 & 0 \\6 & -8 & \frac{5}{2} \\-3 & 4 & -1\end{pmatrix}, \quad \boldsymbol{X}=\boldsymbol{A}^{-1}\boldsymbol{b}=\begin{pmatrix}75 \\55 \\28\end{pmatrix}.$$

(2)在许多实际问题中，求出满足已知需求的量，只是全过程的一半.人们还对如下问题感兴趣:需求微小改变对解X有怎样的影响?这个课题称为敏感度分析扰动分析.

纺织品数量增加10个单位，使得b改变 $\Delta \boldsymbol{b} = \begin{pmatrix} 0 \\ 0 \\ 10 \end{pmatrix}$ .研究 $\Delta b$ 对解的影响，我们建立新的关系式 $AX^{*} = b + \Delta b$ ,则

$$\boldsymbol{X}^{*}=\boldsymbol{A}^{-1}\left(\boldsymbol{b}+\Delta \boldsymbol{b}\right)=\boldsymbol{A}^{-1} \boldsymbol{b}+\boldsymbol{A}^{-1} \Delta \boldsymbol{b}=\boldsymbol{X}+\Delta \boldsymbol{X}.$$

于是，

$$\Delta \boldsymbol{X} {=} \boldsymbol{A}^{-1} \Delta \boldsymbol{b} = \begin{pmatrix} 1 & -1 & & 0 \\ & & & \\ 6 & -8 & & \frac{5}{2} \\ -3 & & 4 & -1 \end{pmatrix} \begin{pmatrix} 0 \\ 0 \\ 10 \end{pmatrix} = \begin{pmatrix} & 0 \\ & 25 \\ -10 \end{pmatrix},$$

故所生产沙发的数量减少10个.

[page:35]

## 习题1.3

1. 设 $\boldsymbol{A} = \begin{bmatrix} 1 & 2 \\ -3 & 4 \end{bmatrix}$ $B = \begin{pmatrix} \dfrac{4}{10} & x \\ \dfrac{3}{10} & y \end{pmatrix}$ ，确定 $x , y$ ，使B成为A的逆矩阵.

2. 若A，B均为n阶可逆矩阵，问 $A = B,AB,AB^{-1}$ 是否一定为可逆矩阵？若不是，请举例说明.

3. 已知 $\boldsymbol{A}^{-1} = \begin{pmatrix}1 & 2 & 1 \\0 & 1 & 3 \\1 & 2 & 4\end{pmatrix}$ $\boldsymbol{B}^{-1}=\begin{pmatrix}2 & 1 & 0 \\-1 & 2 & 1 \\-2 & 3 & 1\end{pmatrix}$ ,求 $( \boldsymbol{A} \boldsymbol{B} )^{-1} , ( \boldsymbol{A}^{\mathrm{T}} \boldsymbol{B} )^{-1} , \left[ ( \boldsymbol{A} \boldsymbol{B} )^{\mathrm{T}} \right]^{-1}$

4. 利用行初等变换求矩阵的逆:

(1)

$$\begin{pmatrix}1 & 1 & -1 \\2 & 1 & 0 \\1 & -1 & 0\end{pmatrix} ;$$

(2)

$$\begin{aligned}\begin{bmatrix} 2 & 2 & 3 \\ 1 & -1 & 0 \\ -1 & 2 & 1 \end{bmatrix} ; \end{aligned}$$

(3)

$$\begin{pmatrix}1 & 1 & 1 & 1 \\1 & 1 & -1 & -1 \\1 & -1 & 1 & -1 \\1 & -1 & -1 & 1\end{pmatrix};$$

(4)

$$\begin{pmatrix}0 & 0 & 1 & -1 \\0 & 3 & 1 & 4 \\2 & 7 & 6 & -1 \\1 & 2 & 2 & -1\end{pmatrix}.$$

5. 设 A 是 n 阶矩阵，

（1）若A满足矩阵方程 $A^{2}-A+I=O$ ，证明:A和I一A都可逆，并求它们的逆矩阵；

(2)若A满足矩阵方程 $A^{2}-2A-4I=O$ ，证明 $:\boldsymbol{A} \neq \boldsymbol{I}$ 和A—3I都可逆，并求它们的逆矩阵.

6. 设 n 阶矩阵A满足条件 $\hat { A } ^ { k } = O , k$ 为正整数，证明:I—A可逆，且

$$\left( \boldsymbol{I} - \boldsymbol{A} \right)^{-1} = \boldsymbol{I} + \boldsymbol{A} + \boldsymbol{A}^2 + \cdots + \boldsymbol{A}^{k-1}.$$

7. 设 $f(x)=a_{k}x^{k}+a_{k-1}x^{k-1}+\cdots+a_{0},a_{0}\ne 0,A$ 为n阶矩阵，证明:若 $f(A) = 0$ ,则A可逆，并写出 $A^{-1}$

8. 求下列各矩阵方程中的X:

(1)

$$\begin{pmatrix}1 & 1 & -1 \\0 & 2 & 2 \\1 & -1 & 0\end{pmatrix}\boldsymbol{X} =\begin{pmatrix}1 & -1 \\1 & 1 \\2 & -1\end{pmatrix};$$

(2)

$$\boldsymbol{X} \begin{vmatrix} 1 & 1 & - 1 \\ 0 & 2 & 2 \\ 1 & - 1 & 0 \end{vmatrix} = \begin{vmatrix} 1 & - 1 & 1 \\ 1 & 1 & 0 \end{vmatrix};$$

(3)

$$\begin{pmatrix}1 & 1 & -1 \\0 & 2 & 2 \\1 & -1 & 0\end{pmatrix}\boldsymbol{X}+\begin{pmatrix}0 & 1 \\1 & 0 \\4 & 3\end{pmatrix}=\begin{pmatrix}1 & -1 \\1 & 1 \\2 & 1\end{pmatrix}.$$

9. 设

[page:36]

$$\begin{aligned}\boldsymbol{B} &= \begin{bmatrix}1 & -1 & 0 & 0 \\0 & 1 & -1 & 0 \\0 & 0 & 1 & -1 \\0 & 0 & 0 & 1\end{bmatrix}, &\boldsymbol{C} &= \begin{bmatrix}2 & 1 & 3 & 4 \\0 & 2 & 1 & 3 \\0 & 0 & 2 & 1 \\0 & 0 & 0 & 2\end{bmatrix},\end{aligned}$$

且A满足 $A(I - C^{-1}B)^{\mathrm{T}}C^{\mathrm{T}} = I$ ,求A.

10.设A，B都是可逆矩阵，证明:

(1) 若 $AX = XY$ ,则 $X = Y ;$ (2) 若 $XA = YA$ ,则 $X = Y$

11. 证明可逆对称矩阵A的逆矩阵 $A^{-1}$ 也是对称矩阵.

12.设 $A = P B P^{-1}$ ,证明 $f(A)=Pf(B)P^{-1}$ ，其中f是一个多项式.

13.设 $P^{-1}AP = B,P = \binom{-1 \quad -4}{1 \quad 1},B = \binom{-1 \quad 0}{0 \quad 2}$ ,求 $\bar{A}^{11}$

## 1.4 分块矩阵

有时候，我们用几条纵线与横线将矩阵分割，把一个大矩阵看成是由一些小矩阵组成的，就如矩阵是由数组成的一样，构成一个分块矩阵，从而把大型矩阵的运算化为若干小型矩阵的运算，使运算更为简明.这是处理阶数较高的矩阵的重要方法.

若将 A分块为

$$\boldsymbol{A} = \begin{bmatrix} a_{11} & a_{12} \vdots a_{13} \\ a_{21} & a_{22} \vdots a_{23} \\ \cdots \cdots \cdots \cdots \cdots \cdots \cdots \\ a_{31} & a_{32} \vdots a_{33} \end{bmatrix},$$

则得四个子矩阵

$$\boldsymbol { A } _ { 1 1 } = \begin{bmatrix} a _ { 1 1 } & a _ { 1 2 } \\ a _ { 2 1 } & a _ { 2 2 } \end{bmatrix}, \quad \boldsymbol { A } _ { 1 2 } = \begin{bmatrix} a _ { 1 3 } \\ a _ { 2 3 } \end{bmatrix}, \quad \boldsymbol { A } _ { 2 1 } = ( a _ { 3 1 } \quad a _ { 3 2 } ), \quad \boldsymbol { A } _ { 2 2 } = ( a _ { 3 3 } ).$$

这样，A就能表为

$$\boldsymbol{A} = \begin{bmatrix} \boldsymbol{A}_{11} & \boldsymbol{A}_{12} \\ \boldsymbol{A}_{21} & \boldsymbol{A}_{22} \end{bmatrix},$$

于是，A被看作是以矩阵为元的 $2 \times 2$ 型矩阵.这样就能将行与列较多的矩阵根据需要简单地表出.

又如，对矩阵A进行如下形式分块:

$$\boldsymbol{A} = \begin{bmatrix} 1 & 0 & 0 & 0 & 2 \\ 0 & 1 & 0 & 1 & - 3 \\ 0 & 0 & 1 & - 1 & 0 \\ 0 & 0 & 0 & 4 & 1 \end{bmatrix},$$

[page:37]

记

$$\boldsymbol { I } = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}, \quad \boldsymbol { A } _ { 1 } = \begin{pmatrix} 0 & 2 \\ 1 & - 3 \\ - 1 & 0 \end{pmatrix}, \quad \boldsymbol { O } = ( 0 \quad 0 \quad 0 ), \quad \boldsymbol { A } _ { 2 } = ( 4 \quad 1 ),$$

则

$$\boldsymbol{A} = \begin{bmatrix} \boldsymbol{I} & \boldsymbol{A}_{1} \\ \boldsymbol{O} & \boldsymbol{A}_{2} \end{bmatrix}.$$

当考虑一个矩阵的分块时，一个重要的原则是使分块后的子矩阵中有便于利用的特殊矩阵，如单位矩阵、零矩阵、对角矩阵、三角形矩阵等.

常用的分块矩阵，除了上面的 $2 \times 2$ 分块矩阵，还有以下几种形式

将 $m \times n$ 矩阵 $A = (a_{ij})_{m \times n}$ 按行分块为 $m \times 1$ 分块矩阵

$$\boldsymbol{A} = \begin{pmatrix}\boldsymbol{\alpha}_{1} \\\boldsymbol{\alpha}_{2} \\\vdots \\\boldsymbol{\alpha}_{m}\end{pmatrix},$$

其中 $\boldsymbol{a}_{i}=\left(a_{i 1} \quad a_{i 2} \quad \cdots \quad a_{i n}\right) \quad(i=1,2, \cdots, m)$

将 $\bar { m } \times \bar { n }$ 矩阵 $\boldsymbol{A} = \left( a_{ij} \right)_{m \times n}$ 按列分块为 $1 \times n$ 分块矩阵

$$\boldsymbol { A } = \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 2 } , \cdots , \boldsymbol { \beta } _ { n } \right) ,$$

其中 $\boldsymbol{\beta}_{j}=(a_{1j}, a_{2j}, \cdots, a_{mj})^{\mathrm{T}} \quad (j=1,2, \cdots, n)$

当矩阵 $\boldsymbol{A} = (a_{ij})_{n \times n}$ 中非零元都集中在主对角线附近时可将A分块成下面的块对角矩阵(又称为准对角矩阵):

$$\boldsymbol{A} = \mathrm{diag}(\boldsymbol{A}_{1}, \boldsymbol{A}_{2}, \cdots, \boldsymbol{A}_{l}) = \begin{bmatrix} \boldsymbol{A}_{1} & & & \\ & \boldsymbol{A}_{2} & & \\ & & \ddots & \\ & & & \boldsymbol{A}_{l} \end{bmatrix},$$

其中 $A_{i}(i = 1,2,\cdots,t)$ 是 $r _ { i }$ 阶方阵 $\left( \sum_{i = 1}^{t} r_{i} = n \right)$

例如

$$\boldsymbol{A} = \begin{pmatrix}1 & 3 & 0 & 0 & 0 & 0 \\0 & 2 & 0 & 0 & 0 & 0 \\0 & 0 & -1 & 0 & 0 & 0 \\0 & 0 & 0 & 2 & 5 & 0 \\0 & 0 & 0 & 0 & 1 & 1 \\0 & 0 & 0 & 0 & 0 & 2\end{pmatrix}= \begin{pmatrix}\boldsymbol{A}_{1} & & & \\& \boldsymbol{A}_{2} & & \\& & \boldsymbol{A}_{3}\end{pmatrix},$$

[page:38]

其中

$$\boldsymbol{A}_{1}=\begin{pmatrix}1&3\\0&2\end{pmatrix}, \quad \boldsymbol{A}_{2}=(-1), \quad \boldsymbol{A}_{3}=\begin{pmatrix}2&5&0\\0&1&1\\0&0&2\end{pmatrix}.$$

下面讨论分块矩阵的运算.

设分块矩阵

$$\boldsymbol{A} = \begin{bmatrix} \boldsymbol{A}_{11} & \cdots & \boldsymbol{A}_{1s} \\ \vdots & & \vdots \\ \boldsymbol{A}_{r1} & \cdots & \boldsymbol{A}_{rs} \end{bmatrix}, \quad \boldsymbol{B} = \begin{bmatrix} \boldsymbol{B}_{11} & \cdots & \boldsymbol{B}_{1s} \\ \vdots & & \vdots \\ \boldsymbol{B}_{r1} & \cdots & \boldsymbol{B}_{rs} \end{bmatrix},$$

若A，B分块的办法相同，即相应小矩阵 $A_{ij}$ 和 $\boldsymbol{B}_{ij}$ 的行数、列数对应相等，则

$$\boldsymbol{A} + \boldsymbol{B} = \begin{vmatrix} \boldsymbol{A}_{11} + \boldsymbol{B}_{11} & \cdots & \boldsymbol{A}_{1s} + \boldsymbol{B}_{1s} \\ \vdots & & \vdots \\ \boldsymbol{A}_{r1} + \boldsymbol{B}_{r1} & \cdots & \boldsymbol{A}_{rs} + \boldsymbol{B}_{rs} \end{vmatrix}.$$

例1设 $\boldsymbol{A} = \begin{pmatrix}1 & 2 & 3 & 4 \\2 & 3 & -1 & -4 \\3 & -1 & -2 & 2\end{pmatrix}, \boldsymbol{B} = \begin{pmatrix}2 & 5 & -6 & -1 \\4 & 7 & 3 & -2 \\-1 & 2 & 4 & 5\end{pmatrix}$ ,则

$$\boldsymbol{A} + \boldsymbol{B} = \begin{bmatrix} \boldsymbol{A}_{11} + \boldsymbol{B}_{11} & \boldsymbol{A}_{12} + \boldsymbol{B}_{12} \\ \boldsymbol{A}_{21} + \boldsymbol{B}_{21} & \boldsymbol{A}_{22} + \boldsymbol{B}_{22} \end{bmatrix}$$

其中

$$\boldsymbol{A}_{11} + \boldsymbol{B}_{11} = \begin{bmatrix} 1 \\ 2 \end{bmatrix} + \begin{bmatrix} 2 \\ 4 \end{bmatrix} = \begin{bmatrix} 3 \\ 6 \end{bmatrix},$$

$$\boldsymbol{A}_{12} + \boldsymbol{B}_{12} = \begin{bmatrix} 2 & 3 & 4 \\ 3 & -1 & -4 \end{bmatrix} + \begin{bmatrix} 5 & -6 & -1 \\ 7 & 3 & -2 \end{bmatrix} = \begin{bmatrix} 7 & -3 & 3 \\ 10 & 2 & -6 \end{bmatrix},$$

$$A_{21} + B_{21} = (3) + (-1) = (2)$$

$$\boldsymbol{A}_{22}+\boldsymbol{B}_{22}=(-1-2-2)+(2-4-5)=(1-2-7).$$

设分块矩阵 $\boldsymbol{A} = \left( \boldsymbol{A}_{ij} \right)_{s \times t}, k$ 是一个数，则分块矩阵的数乘为

$$k \boldsymbol{A} = (k \boldsymbol{A}_{ij})_{s \times i},$$

对于分块矩阵A与B的乘法AB，若A的列的分法与B的行的分法相同，就可以将子块看成“数”那样按乘法的规则进行运算，至于A的行的分法及B的列的分法没有任何要求.

设 $\boldsymbol{A} = \left( a_{ij} \right)_{m \times n}, \boldsymbol{B} = \left( b_{ij} \right)_{n \times p}$ ，如果把A,B分别分块为r×s和s×t分块矩阵，且A

[page:39]

的列的分法与B的行的分法相同，则

$$\boldsymbol{A} \boldsymbol{B}=\begin{vmatrix}\boldsymbol{A}_{11} & \boldsymbol{A}_{12} & \cdots & \boldsymbol{A}_{1 s} \\\vdots & \vdots & & \vdots \\\boldsymbol{A}_{r 1} & \boldsymbol{A}_{r 2} & \cdots & \boldsymbol{A}_{r s}\end{vmatrix}\begin{vmatrix}\boldsymbol{B}_{11} & \cdots & \boldsymbol{B}_{1 t} \\\boldsymbol{B}_{21} & \cdots & \boldsymbol{B}_{2 t} \\\vdots & & \vdots \\\boldsymbol{B}_{s 1} & \cdots & \boldsymbol{B}_{s t}\end{vmatrix}=\boldsymbol{C},$$

其中C 是 $r \times t$ 分块矩阵，且

$$\begin{aligned}\boldsymbol{C}_{kl} &= \boldsymbol{A}_{k1} \boldsymbol{B}_{1l} + \boldsymbol{A}_{k2} \boldsymbol{B}_{2l} + \cdots + \boldsymbol{A}_{ks} \boldsymbol{B}_{sk} \\&= \sum_{i=1}^{s} \boldsymbol{A}_{ki} \boldsymbol{B}_{il} \quad (k = 1,2,\cdots,r; l = 1,2,\cdots,t).\end{aligned}$$

可以证明:用分块矩阵乘法求得的AB与不分块作乘法求得的AB是相同的(略).

例2 设 $\boldsymbol{A} = \begin{pmatrix}1 & 0 & 0 & 0 \\0 & 1 & 0 & 0 \\-1 & 2 & 1 & 0 \\1 & 1 & 0 & 1\end{pmatrix}$ $\boldsymbol{B} = \begin{pmatrix}1 & 0 \\-1 & 2 \\1 & 0 \\-1 & -1\end{pmatrix}$ ,求AB.

解令 $\boldsymbol{A}_{1}=\begin{bmatrix}-1&2\\1&1\end{bmatrix}$ ,则

$$\boldsymbol{A} = \begin{bmatrix} \boldsymbol{I} & \boldsymbol{O} \\ \boldsymbol{A}_{1} & \boldsymbol{I} \end{bmatrix}.$$

典型例题讲解利用分块矩阵乘法求矩阵乘积

再将 B分块为

$$\boldsymbol{B} = \begin{pmatrix}1 & 0 \\-1 & 2 \\1 & 0 \\-1 & -1\end{pmatrix} = \begin{pmatrix}\boldsymbol{B}_{1} \\\boldsymbol{B}_{2}\end{pmatrix},$$

于是

$$\boldsymbol{A}\boldsymbol{B} = \begin{bmatrix} \boldsymbol{I} & \boldsymbol{O} \\ \boldsymbol{A}_{1} & \boldsymbol{I} \end{bmatrix} \begin{bmatrix} \boldsymbol{B}_{1} \\ \boldsymbol{B}_{2} \end{bmatrix} = \begin{bmatrix} \boldsymbol{B}_{1} \\ \boldsymbol{A}_{1}\boldsymbol{B}_{1} + \boldsymbol{B}_{2} \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ -1 & 2 \\ -2 & 4 \\ -1 & 1 \end{bmatrix}.$$

例3 若n阶矩阵A,B为同型块对角矩阵，即

$$\boldsymbol{A} = \mathrm{diag}(A_1, A_2, \cdots, A_i) , \quad \boldsymbol{B} = \mathrm{diag}(B_1, B_2, \cdots, B_i) ,$$

其中 $A_{i}$ 和 $\boldsymbol{B}_{i}$ 是同阶方阵 $(i = 1,2,\cdots,t)$ ,则

[page:40]

$$\boldsymbol{A}\boldsymbol{B}=\begin{pmatrix}\boldsymbol{A}_{1}\boldsymbol{B}_{1} & & & \\& \boldsymbol{A}_{2}\boldsymbol{B}_{2} & & \\& & \ddots & \\& & & \boldsymbol{A}_{t}\boldsymbol{B}_{t}\end{pmatrix}.$$

设块对角矩阵 $\boldsymbol{A} = \mathrm{diag}(A_1, A_2, \cdots, A_t)$ ,其中 $A_{i}(i = 1,2,\cdots,t)$ 可逆.因为

$$\begin{aligned} &\begin{bmatrix} \boldsymbol{A}_{1} & & & \\ & \boldsymbol{A}_{2} & & \\ & & \ddots & \\ & & & \boldsymbol{A}_{t} \end{bmatrix} \begin{bmatrix} \boldsymbol{A}_{1}^{-1} & & & \\ & \boldsymbol{A}_{2}^{-1} & & \\ & & \ddots & \\ & & & \boldsymbol{A}_{t}^{-1} \end{bmatrix}\\ &= \begin{bmatrix} \boldsymbol{A}_{1} \boldsymbol{A}_{1}^{-1} & & & \\ & \boldsymbol{A}_{2} \boldsymbol{A}_{2}^{-1} & & \\ & & \ddots & \\ & & & \boldsymbol{A}_{t} \boldsymbol{A}_{t}^{-1} \end{bmatrix} = \boldsymbol{I},\\ \end{aligned}$$

于是便有

$$A^{-1} = \mathrm{diag}(A_1^{-1}, A_2^{-1}, \cdots, A_t^{-1}).$$

同理，若 $A_{i}(i = 1,2,\cdots,t)$ 可逆，则

$$\left( \begin{matrix} { } & { } & { } & { \mathbf { A } _ { 1 } } \\ { } & { } & { A _ { 2 } } & { } \\ { } & { . ^ { \ast } } & { } & { } \\ { } & { } & { } & { } \\ { A _ { 1 } } & { } & { } & { } \\ \end{matrix} \right) ^ { - 1 } = \left[ \begin{matrix} { } & { } & { } & { } & { A _ { \phantom { - } 1 } ^ { - 1 } } \\ { } & { } & { . ^ { \ast } } & { } & { } \\ { } & { } & { . ^ { \ast } } & { } & { } \\ { } & { A _ { 2 } ^ { - 1 } } & { } & { } & { } \\ { \mathbf { A } _ { 1 } ^ { - 1 } } & { } & { } & { } & { } \\ \end{matrix} \right] .$$

若分块矩阵

$$\boldsymbol{A} = \begin{bmatrix} \boldsymbol{A}_{11} & \boldsymbol{A}_{12} & \cdots & \boldsymbol{A}_{1s} \\ \boldsymbol{A}_{21} & \boldsymbol{A}_{22} & \cdots & \boldsymbol{A}_{2s} \\ \vdots & \vdots & & \vdots \\ \boldsymbol{A}_{r1} & \boldsymbol{A}_{r2} & \cdots & \boldsymbol{A}_{rs} \end{bmatrix},$$

则不难验证

$$\boldsymbol{A}^{\mathrm{T}}=\begin{vmatrix}\boldsymbol{A}_{11}^{\mathrm{T}} & \boldsymbol{A}_{21}^{\mathrm{T}} & \cdots & \boldsymbol{A}_{r 1}^{\mathrm{T}} \\\boldsymbol{A}_{12}^{\mathrm{T}} & \boldsymbol{A}_{22}^{\mathrm{T}} & \cdots & \boldsymbol{A}_{r 2}^{\mathrm{T}} \\\vdots & \vdots & & \vdots \\\boldsymbol{A}_{1 s}^{\mathrm{T}} & \boldsymbol{A}_{2 s}^{\mathrm{T}} & \cdots & \boldsymbol{A}_{r s}^{\mathrm{T}}\end{vmatrix},$$

即除了把子块的行与列对换外，每个子块还要进行转置

例4设乘法AB有意义，B按列分块， $\boldsymbol{B} = (b_1, b_2, \cdots, b_n)$ ,则

$$AB = A(b_{1},b_{2},\cdots,b_{n}) = (Ab_{1},Ab_{2},\cdots,Ab_{n}).$$

可见，若 $AB = O$ ,则

[page:41]

$$A b _ { i } = O , \quad i = 1 , 2 , \cdots , n .\tag{2}$$

即B的每一列 $b_{i} \left( i = 1, 2, \cdots, n \right)$ 都是齐次线性方程组AX=O的解.

例5 设 $m \times n$ 矩阵 $\boldsymbol{A} = ( \boldsymbol{\alpha}_{1} , \boldsymbol{\alpha}_{2} , \cdots , \boldsymbol{\alpha}_{n} )$ ,则

$$\boldsymbol{A}\boldsymbol{A}^{\mathrm{T}}=(\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n})\begin{bmatrix}\boldsymbol{\alpha}_{1}^{\mathrm{T}}\\\boldsymbol{\alpha}_{2}^{\mathrm{T}}\\\vdots\\\boldsymbol{\alpha}_{n}^{\mathrm{T}}\end{bmatrix}=\boldsymbol{\alpha}_{1}\boldsymbol{\alpha}_{1}^{\mathrm{T}}+\boldsymbol{\alpha}_{2}\boldsymbol{\alpha}_{2}^{\mathrm{T}}+\cdots+\boldsymbol{\alpha}_{n}\boldsymbol{\alpha}_{n}^{\mathrm{T}},$$

$$\boldsymbol{A}^{\mathrm{T}} \boldsymbol{A} = \begin{bmatrix}\boldsymbol{\alpha}_{1}^{\mathrm{T}} \\\boldsymbol{\alpha}_{2}^{\mathrm{T}} \\\vdots \\\boldsymbol{\alpha}_{n}^{\mathrm{T}}\end{bmatrix}(\boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{2}, \cdots, \boldsymbol{\alpha}_{n}) = \begin{bmatrix}\boldsymbol{\alpha}_{1}^{\mathrm{T}} \boldsymbol{\alpha}_{1} & \boldsymbol{\alpha}_{1}^{\mathrm{T}} \boldsymbol{\alpha}_{2} & \cdots & \boldsymbol{\alpha}_{1}^{\mathrm{T}} \boldsymbol{\alpha}_{n} \\\boldsymbol{\alpha}_{2}^{\mathrm{T}} \boldsymbol{\alpha}_{1} & \boldsymbol{\alpha}_{2}^{\mathrm{T}} \boldsymbol{\alpha}_{2} & \cdots & \boldsymbol{\alpha}_{2}^{\mathrm{T}} \boldsymbol{\alpha}_{n} \\\vdots & \vdots & & \vdots \\\boldsymbol{\alpha}_{n}^{\mathrm{T}} \boldsymbol{\alpha}_{1} & \boldsymbol{\alpha}_{n}^{\mathrm{T}} \boldsymbol{\alpha}_{2} & \cdots & \boldsymbol{\alpha}_{n}^{\mathrm{T}} \boldsymbol{\alpha}_{n}\end{bmatrix}.$$

## 题1.4

1. 将下列矩阵适当分块后进行计算:

(1)

$$\begin{pmatrix}- 2 & 3 & 0 & 0 \\1 & 2 & 0 & 0 \\0 & 0 & 1 & 2 \\0 & 0 & 2 & 5\end{pmatrix}\begin{bmatrix}1 & 2 & 0 & 0 \\3 & 2 & 0 & 0 \\0 & 0 & 2 & 1 \\0 & 0 & 3 & 4\end{bmatrix};$$

(2)

$$\begin{pmatrix}1 & -1 & 0 & 0 \\2 & 3 & 0 & 0 \\0 & 1 & 0 & 0 \\0 & 0 & 1 & 4\end{pmatrix}\begin{pmatrix}1 & 0 & 0 \\-2 & 0 & 0 \\0 & 3 & 2 \\0 & 4 & 3\end{pmatrix};$$

(3)

$$\begin{pmatrix}1 & 0 & 0 & 0 & 0 \\0 & 1 & 0 & 0 & 0 \\-1 & 2 & 1 & 0 & 0 \\1 & 1 & 0 & 1 & 0 \\-2 & 0 & 0 & 0 & 1\end{pmatrix}\begin{bmatrix}3 & 2 & 0 & 1 & 0 \\1 & 3 & 0 & 0 & 1 \\-1 & 0 & 0 & 0 & 0 \\0 & -1 & 0 & 0 & 0 \\0 & 0 & -1 & 0 & 0\end{bmatrix},$$

2. 利用矩阵分块求A 的逆矩阵 $A^{-1}$

$$\begin{aligned}(1) \boldsymbol{A} = & \begin{pmatrix}2 & 0 & 0 & 0 & 0 \\0 & -1 & 0 & 0 & 0 \\0 & 0 & 1 & 1 & -1 \\0 & 0 & 2 & 1 & 0 \\0 & 0 & 1 & -1 & 0\end{pmatrix};\end{aligned}$$

$$\boldsymbol{A} = \begin{pmatrix}0 & 0 & 0 & 0 & -3 \\0 & 0 & 0 & 2 & 0 \\2 & 2 & 3 & 0 & 0 \\1 & -1 & 0 & 0 & 0 \\-1 & 2 & 1 & 0 & 0\end{pmatrix};$$

$$\begin{aligned}(3) \boldsymbol{A} &=\begin{pmatrix}0 & a_{1} & 0 & \cdots & 0 \\0 & 0 & a_{2} & \cdots & 0 \\\vdots & \vdots & \vdots & & \vdots \\0 & 0 & 0 & \cdots & a_{n-1} \\a_{n} & 0 & 0 & \cdots & 0\end{pmatrix},\prod_{i=1}^{n} a_{i} \neq 0.\end{aligned}$$

3. 设A,B,C,D 都是n阶矩阵，A 可逆，

[page:42]

$$X = \begin{bmatrix} I & O \\ -CA^{-1} & I \end{bmatrix}, \quad Y = \begin{bmatrix} A & B \\ C & D \end{bmatrix}, \quad Z = \begin{bmatrix} I & -A^{-1}B \\ O & I \end{bmatrix},$$

求 XYZ.

4. 设

$$\boldsymbol{A} = \begin{bmatrix} a_{1} \boldsymbol{I}_{1} & & & \\ & a_{2} \boldsymbol{I}_{2} & & \\ & & \ddots & \\ & & & a_{r} \boldsymbol{I}_{r} \end{bmatrix}, \quad a_{i} \neq a_{j} (i \neq j),$$

$I _ { i }$ 是 $n _ { i }$ 阶单位矩阵， $\sum _ { i = 1 } ^ { r } n _ { i } = n$ .证明:与A可交换的矩阵只能是如下形式的分块对角矩阵

$$\boldsymbol{B} = \begin{pmatrix}\boldsymbol{A}_{1} & & & \\& \boldsymbol{A}_{2} & & \\& & \ddots & \\& & & \boldsymbol{A}_{r}\end{pmatrix},$$

其中 $A _ { i }$ 是n阶方阵 $(i = 1,2,\cdots,r)$

5. 解矩阵方程 AX=B，其中

$$\boldsymbol{A} = \begin{bmatrix} 2 & 3 & 0 & 0 & 0 \\ 3 & 6 & 0 & 0 & 0 \\ 0 & 0 & 4 & 0 & 0 \\ 0 & 0 & 0 & 3 & 2 \\ 0 & 0 & 0 & 7 & 5 \end{bmatrix}, \quad \boldsymbol{B} = \begin{bmatrix} -1 & 2 & 3 & 1 & 0 \\ -3 & 6 & 15 & -6 & 3 \\ 8 & 0 & 4 & 12 & -4 \\ 1 & 2 & -3 & 1 & 1 \\ 3 & 1 & -2 & 4 & 1 \end{bmatrix}.$$

## 习题

1. 设A,B,C和D 都是二阶矩阵， $AB = CD$ ，试问:是否可以推出，对所有二阶矩阵X，有 $AXB = CXD$

2. 已知n阶矩阵A 与B 可交换(即AB=BA)，证明:

$$( \boldsymbol { A } - \boldsymbol { B } ) ^ { 3 } = \boldsymbol { A } ^ { 3 } - 3 \boldsymbol { A } ^ { 2 } \boldsymbol { B } + 3 \boldsymbol { A } \boldsymbol { B } ^ { 2 } - \boldsymbol { B } ^ { 3 }$$

当A与B不能交换时， $(A - B)^{3}$ 的正确展开式是什么？

3. 设 $\boldsymbol{A} = (a_{ij})_{m \times n}, \boldsymbol{A}^{\mathrm{T}} \boldsymbol{A} = \boldsymbol{O}$ ，证明 $:A = O$

4. 证明:任意方阵可以写成对称矩阵与反称矩阵的和.

λ″ 0 0 λ 0 0 n nλ″-1 λ″ 0 5.证明: 1 λ 0 三n(n-1) 0 λ λn-2 nλ″-1 λ″ 2

[page:43]

6. 设 $A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}$ ，求所有与A可交换的矩阵.

7. 设 $\boldsymbol{\alpha} = (1,2), \boldsymbol{\beta} = (-2,3)$ ，求 $\alpha \beta ^ { \mathrm { T } } , \alpha ^ { \mathrm { T } } \beta , ( \alpha ^ { \mathrm { T } } \beta ) ^ { 1 0 0 }$

8. 证明:两个上三角形矩阵的乘积仍是上三角形矩阵.

9. 已知A是一个n阶对称矩阵，B是一个反称矩阵.

(1) 问 $\tilde { A } ^ { k } . \tilde { B } ^ { k }$ 是否为对称或反称矩阵？(k为正整数.)

(2) 证明 $AB + BA$ 是一个反称矩阵.

10. 设 $\boldsymbol{A} = \begin{pmatrix}1 & 0 & 1 \\0 & 2 & 0 \\1 & 0 & 1\end{pmatrix}$ $n \geqslant 2$ 为正整数，求 $A^{n} = 2A^{n - 1}$

11. 设 $\boldsymbol{A} = \begin{pmatrix}5 & 2 & - 4 \\2 & 8 & 2 \\- 4 & 2 & 5\end{pmatrix}$ ，证明:A满足方程 $A^{2}-9A=O$ ，并由此证明A不可逆.

12. 设 $a_{1},a_{2},\cdots,a_{n}$ 互不相同 $A = \mathrm{diag}(a_1, a_2, \cdots, a_n)$ ，证明:所有与A可交换的矩阵B只能是对角矩阵.

13.下列矩阵是否可逆？若可逆，则求其逆矩阵:

(1)

$$\left[ \begin{matrix} { 1 } & { 2 } \\ { 3 } & { 4 } \\ \end{matrix} \right] \sharp$$

(2)

$$\begin{aligned}\begin{bmatrix} 3 & 0 & 1 \\ 0 & 5 & 0 \\ -1 & 1 & -1 \end{bmatrix}\end{aligned} ;$$

(3)

$$\begin{pmatrix}3 & -2 & 0 & -1 \\0 & 2 & 2 & 1 \\1 & -2 & -3 & -2 \\0 & 1 & 2 & 1\end{pmatrix}^{-1}$$

14. 设 $\boldsymbol{A} = \begin{pmatrix}-1 & 0 & 0 \\1 & -1 & 0 \\1 & 1 & -1\end{pmatrix}$ ，计算: $( \boldsymbol{A} + 2 \boldsymbol{I} )^{-1} ( \boldsymbol{A}^2 - 4 \boldsymbol{I} ) 及 ( \boldsymbol{A} + 2 \boldsymbol{I} )^{-1} ( \boldsymbol{A} - 2 \boldsymbol{I} )$

15.已知 $A B A ^ { \mathrm { T } } = 2 B A ^ { \mathrm { T } } + I$ ,求B.其中 $\boldsymbol{A} = \begin{pmatrix}1 & 0 & 0 \\0 & 1 & 2 \\0 & 0 & 1\end{pmatrix}$

16. 设矩阵A 和 B 满足关系 $AB = A + 2B, A = \begin{pmatrix} 3 & 0 & 1 \\ 1 & 1 & 0 \\ 0 & 1 & 4 \end{pmatrix}$ ，求矩阵B.

17. 设 n 阶矩阵A 和 B 满足条件 $A + B = AB$

(1)证明A—I为可逆矩阵； (2) 已知 $\boldsymbol{B} = \begin{pmatrix}1 & - 3 & 0 \\2 & 1 & 0 \\0 & 0 & 2\end{pmatrix}$ ,求A.

18. 设 A 为 n 阶矩阵，

(1) 若 $A^{2} = A$ ，证明:I+A可逆，并求 $(I + A)^{-1}$

(2) 若 $A^{3} = 3A(A - I)$ ，证明:I—A可逆，并求 $(I - A)^{-1}$

19. 设A 是n 阶可逆矩阵，将A 的第i行和第j行对换后得到的矩阵记为B.

(1) 证明B 可逆； (2) 求 $AB^{-1}$

[page:44]

20. 设A是m×n矩阵，B是n×s矩阵，X是n×1矩阵，证明: $AB \equiv O$ 的充分必要条件是B的每一列都是齐次线性方程组AX=0的解.

21. 设 $A = (a_{ij})$ 是n阶矩阵，其对角元的和称为A的迹，记为tr(A)，即$\mathrm{tr}(\boldsymbol{A}) = \sum_{i = 1}^{n} a_{ii}$ .证明 $\mathrm{tr}(\boldsymbol{A}\boldsymbol{B}) = \mathrm{tr}(\boldsymbol{B}\boldsymbol{A})$ ，其中A,B 为n阶方阵.

22.证明:无论对怎样的矩阵A，B，关系式AB—BA=I都不成立.

23.设C是n阶可逆矩阵，D是3×n矩阵，且 $\boldsymbol{D}=\begin{pmatrix}1 & 2 & \cdots & n \\0 & 0 & \cdots & 0 \\0 & 0 & \cdots & 0\end{pmatrix}$ ，求一个 $n \times (n + 3)$矩阵A，使得 $A \binom{C}{D} = I_n$

24.求方阵 $\boldsymbol{A} = \begin{pmatrix}1 & a & a^{2} & a^{3} & \cdots & a^{n} \\0 & 1 & a & a^{2} & \cdots & a^{n - 1} \\0 & 0 & 1 & a & \cdots & a^{n - 2} \\\vdots & \vdots & \vdots & \vdots & & \vdots \\0 & 0 & 0 & 0 & \cdots & 1\end{pmatrix}$ 的逆矩阵.

## 思考题

1.n阶可逆上三角形矩阵的逆矩阵 $A^{-1}$ 是否仍为上三角形矩阵？若是，证明之.

2. 设 $\boldsymbol{A} = \begin{pmatrix}a_{1}b_{1} & a_{1}b_{2} & \cdots & a_{1}b_{n} \\a_{2}b_{1} & a_{2}b_{2} & \cdots & a_{2}b_{n} \\\vdots & \vdots & & \vdots \\a_{n}b_{1} & a_{n}b_{2} & \cdots & a_{n}b_{n}\end{pmatrix}$ .试问:如何求 $A^{k}(k$ 为正整数)？

3. 设B 是元全为1的n阶 $( n \geqslant 2 )$ 矩阵，证明:

(1) $\boldsymbol{B}^{k}=n^{k-1}\boldsymbol{B}(k \geqslant 2$ 为正整数)；(2) $( \boldsymbol { I } - \boldsymbol { B } ) ^ { - 1 } = \boldsymbol { I } - \frac { 1 } { n - 1 } \boldsymbol { B } .$

4. 以2×2分块矩阵 $\boldsymbol{A} = \begin{pmatrix} \boldsymbol{A}_{11} & \boldsymbol{A}_{12} \\ & \\ \boldsymbol{A}_{21} & \boldsymbol{A}_{22} \end{pmatrix}$ 为例，我们是否可以同样定义它的三类行初等变换和列初等变换，并相应地定义三类分块初等矩阵？若能，如何定义？对于你所定义的分块初等矩阵，在保证可乘的情况下，其作用与本章所述初等矩阵左乘(或右乘)矩阵的作用是否是相同的？

知识点注释一

综合自测题一

[page:45]

# 第二章行 列 式

在线性代数一些问题研究中，如线性方程组、矩阵等问题， 重点难点常要用到行列式做工具.在初等代数中，已经讨论过二、三阶行列式的定义、性质和计算，本章进一步讨论n阶行列式的定义、性质和计算.

## 1 n阶行列式的定义

我们先从解二元及三元线性方程组引入二阶、三阶行列式的概念及计算.

考虑二元线性方程组

$$\begin{cases}a_{11}x_{1} + a_{12}x_{2} = b_{1}, \\a_{21}x_{1} + a_{22}x_{2} = b_{2},\end{cases}$$

如果 $a_{11}a_{22} - a_{12}a_{21} \ne 0$ ，那么方程组的解为

$$\left\{ \begin{aligned} x_{1} = \frac{b_{1}a_{22} - a_{12}b_{2}}{a_{11}a_{22} - a_{12}a_{21}}, \\ x_{2} = \frac{a_{11}b_{2} - b_{1}a_{21}}{a_{11}a_{22} - a_{12}a_{21}}. \end{aligned} \right.$$

如果对于方程组的系数矩阵

$$\boldsymbol{A} = \begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix},$$

引入行列式记号 $\text{" } \boxed{\quad } \boxed{\quad }$ 和detA，那么就可以得到一个二阶行列式，并规定A的行列式的值为

$$\det A = \begin{vmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{vmatrix} = a_{11}a_{22} - a_{12}a_{21}.$$

系数矩阵A的行列式detA称为方程组的系数行列式

记

[page:46]

$$\det \boldsymbol{A}_{1}=\begin{vmatrix}b_{1}&a_{12}\\b_{2}&a_{22}\end{vmatrix}, \quad \det \boldsymbol{A}_{2}=\begin{vmatrix}a_{11}&b_{1}\\a_{21}&b_{2}\end{vmatrix},$$

那么二元线性方程组的解可写成

$$x_{1} = \frac{\det A_{1}}{\det A}, \quad x_{2} = \frac{\det A_{2}}{\det A}.$$

类似地，三元线性方程组

$$\begin{cases}a_{11}x_{1} + a_{12}x_{2} + a_{13}x_{3} = b_{1}, \\a_{21}x_{1} + a_{22}x_{2} + a_{23}x_{3} = b_{2}, \\a_{31}x_{1} + a_{32}x_{2} + a_{33}x_{3} = b_{3}\end{cases}$$

的系数矩阵A的行列式规定为

$$\begin{aligned}\det \boldsymbol{A} = & \begin{vmatrix}a_{11} & a_{12} & a_{13} \\a_{21} & a_{22} & a_{23} \\a_{31} & a_{32} & a_{33}\end{vmatrix}= a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32} \\& - a_{11}a_{23}a_{32} - a_{12}a_{21}a_{33} - a_{13}a_{22}a_{31}.\end{aligned}$$

那么，当 $\det A \neq 0$ 时，方程组的解也可写成

$$x_{1} = \frac{\det A_{1}}{\det A}, \quad x_{2} = \frac{\det A_{2}}{\det A}, \quad x_{3} = \frac{\det A_{3}}{\det A},$$

其中 det $A_{1}$ ,det $A_{2}$ , det $A_{3}$ 是将系数行列式的第1列、第2列、第3列分别换成常数列所得的行列式

三阶行列式的计算方法可用图示记忆法(图2.1).凡是实线上三个元相乘所得到的项带正号，凡是虚线上三个元相乘所得到的项带负号.

对n元线性方程组的解要得到类似的结果，显然要对n阶行列式给出合理的定义.

观察三阶行列式的值，我们不难看出可以将三阶行列式写成如下展开式形式:

$$\begin{vmatrix}a_{11} & a_{12} & a_{13} \\a_{21} & a_{22} & a_{23} \\a_{31} & a_{32} & a_{33}\end{vmatrix}= a_{11}\begin{vmatrix}a_{22} & a_{23} \\a_{32} & a_{33}\end{vmatrix}- a_{12}\begin{vmatrix}a_{21} & a_{23} \\a_{31} & a_{33}\end{vmatrix}$$

[page:47]

$$+ a_{13} \begin{vmatrix} a_{21} & a_{22} \\ a_{31} & a_{32} \end{vmatrix} = a_{11}A_{11} + a_{12}A_{12} + a_{13}A_{13}\tag{2.1}$$

其中 $A_{11},A_{12},A_{13}$ 分别称为 $a_{11} , a_{12} , a_{13}$ 的代数余子式.

$$A_{11} = (-1)^{1+1} \left| \begin{matrix} a_{22} a_{23} \\ a_{32} a_{33} \end{matrix} \right|, A_{12} = (-1)^{1+2} \left| \begin{matrix} a_{21} a_{23} \\ a_{31} a_{33} \end{matrix} \right|, A_{13} = (-1)^{1+3} \left| \begin{matrix} a_{21} a_{22} \\ a_{31} a_{32} \end{matrix} \right|,$$

二阶行列式的展开式 $\begin{vmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{vmatrix} = a_{11}a_{22} - a_{12}a_{21}$ 也可视为按第1行展开，且 $a _ { 2 2 }$ 恰是 $\underline{a}_{11}$ 的代数余子式， $a _ { 2 1 }$ 恰为 $\alpha_{12}$ 的代数余子式，即

$$\begin{vmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{vmatrix} = a_{11}A_{11} + a_{12}A_{12}\tag{2.2}$$

如果把(2.1)，(2.2)两式分别作为三阶和二阶行列式的定义，显然这种定义的方法是统一的，都是用低阶行列式定义高一阶的行列式.因此，我们自然也就希望用这种递归的方法来定义一般的n阶行列式.

定义设A为一个n阶矩阵，A的行列式

$$\det \boldsymbol{A} = \begin{vmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn}\end{vmatrix}$$

是由A确定的一个数:

(1)当η=1时，det $A = \det(a_{11}) = a_{11}$

重难点分析n阶行列式的定义

(2) 当 $n \gg 2$ 时， $\det A = a_{11}A_{11} + a_{12}A_{12} + \cdots + a_{1n}A_{1n} = \sum_{j = 1}^{n} a_{1j}A_{1j}$ ,其中 $A _ { \downarrow j } =$ $(-1)^{1+j}M_{1j}$

$$\begin{aligned}\therefore M_{1j} = \begin{vmatrix}a_{21} & \cdots & a_{2,j-1} & a_{2,j+1} & \cdots & a_{2n} \\a_{31} & \cdots & a_{3,j-1} & a_{3,j+1} & \cdots & a_{3n} \\\vdots & & \vdots & \vdots & & \vdots \\a_{n1} & \cdots & a_{n,j-1} & a_{n,j+1} & \cdots & a_{nn}\end{vmatrix} \quad (j = 1,2,\cdots,n)  ,\end{aligned}$$

称 $M_{1j}$ 为元 $a_{1j}$ 的余子式，即为划掉A的第1行第j列后所得的n一1阶行列式 $,A_{1j}$ 称为 $a_{1j}$ 的代数余子式

为了书写方便，在不引起混淆的时候，本书也用A|表示矩阵A的行列式

由定义可以看出，行列式是由行列式不同行不同列的元乘积构成的和式，这种定义方法称为归纳定义.通常，把上述定义简称为按行列式的第1行展开.

例1 计算

[page:48]

$$D_{4}=\begin{vmatrix}2&0&0&4\\7&1&0&5\\2&6&1&0\\8&4&3&5\end{vmatrix}.$$

解因为 $a_{12} = a_{13} = 0$ ，所以由定义

$$\begin{aligned}D_{4} = & a_{11}A_{11} + a_{14}A_{14} \\= & 2 \times (-1)^{1+1} \left| \begin{matrix} 1 & 0 & 5 \\ 6 & 1 & 0 \\ 4 & 3 & 5 \end{matrix} \right| + 4 \times (-1)^{1+4} \left| \begin{matrix} 7 & 1 & 0 \\ 2 & 6 & 1 \\ 8 & 4 & 3 \end{matrix} \right| \\= & 2 \left[ 1 \times (-1)^{1+1} \left| \begin{matrix} 1 & 0 \\ 3 & 5 \end{matrix} \right| + 5 \times (-1)^{1+3} \left| \begin{matrix} 6 & 1 \\ 4 & 3 \end{matrix} \right| \right] \\& - 4 \left[ 7 \times (-1)^{1+1} \left| \begin{matrix} 6 & 1 \\ 4 & 3 \end{matrix} \right| + 1 \times (-1)^{1+2} \left| \begin{matrix} 2 & 1 \\ 8 & 3 \end{matrix} \right| \right] \\= & 2[5+5(18-4)] - 4[7(18-4)-(6-8)] = -250.\end{aligned}$$

例2 计算行列式

$$D_{n}=\begin{vmatrix}a_{11}& & & \\a_{21}&a_{22}& & \\\vdots&\vdots&\ddots& \\a_{n1}&a_{n2}&\cdots&a_{nn}\end{vmatrix},$$

其中未写出的元均为0(以下同).

解由定义，将 $D_{n}$ 按第一行展开，得

$$\begin{aligned}D_{n} &= a_{11} \left| \begin{matrix}a_{22} & & & \\a_{32} & a_{33} & & \\\vdots & \vdots & \ddots & \\a_{n2} & a_{n3} & \cdots & a_{nn} \\\end{matrix} \right|= a_{11} a_{22} \left| \begin{matrix}a_{33} & & & \\a_{43} & a_{44} & & \\\vdots & \vdots & \ddots & \\a_{n3} & a_{n4} & \cdots & a_{nn} \\\end{matrix} \right| \\&= \cdots = a_{11} a_{22} \cdots a_{nn}.\end{aligned}$$

同理可得

$$\begin{bmatrix} a_{11} & & & \\ & a_{22} & & \\ & & \ddots & \\ & & & a_{nn} \end{bmatrix} = a_{11}a_{22}\cdots a_{nn}.$$

单位矩阵I和数量矩阵的行列式分别为

$$\det I = 1, \quad \det(kI_n) = k^n.$$

[page:49]

例3计算n阶下三角形行列式

$$D _ { \mathit { n } } = \left| \begin{matrix} { } & { } & { } & { } & { a _ { \mathit { n } } } \\ { } & { } & { \dots } & { } & { } \\ { } & { a _ { \mathit { 2 } } } & { } & { } & { } \\ { } & { } & { } & { } & { } \\ { a _ { \mathit { 1 } } } & { } & { } & { \varkappa } & { } \\ \end{matrix} \right| .$$

解 由行列式定义有

$$\begin{aligned}D_{n} = & a_{n}(-1)^{1+n}\left|\begin{array}{ccc}&  &  &  \\&  & a_{n-1} \\&  &  &  \\&  & \ddots &  \\& a_{2} &  &  \\&  &  & \times\end{array}\right| \\= & (-1)^{n-1}a_{n}D_{n-1} \\= & (-1)^{n-1}a_{n}(-1)^{n-2}a_{n-1}D_{n-2} \\= & \cdots = (-1)^{(n-1)+(n-2)+\cdots+2+1}a_{n}a_{n-1}\cdots a_{2}a_{1} \\= & (-1)^{\frac{n(n-1)}{2}}a_{1}a_{2}\cdots a_{n}.\end{aligned}$$

同理

$$\begin{aligned} &\begin{vmatrix}\\ &  &  &  & a_{n} \\&  &  & \ddots &  \\&  & a_{2} &  &  \\&  &  &  &  \\&a_{1} &  &  &\\ &\end{vmatrix}= (-1)^{\frac{n(n-1)}{2}} a_{1} a_{2} \cdots a_{n}.\\ \end{aligned}$$

## 题2.1

1. 用行列式的定义计算下列行列式:

(1)

$$\begin{bmatrix} 1 & 2 & 0 & 0 \\ 3 & 4 & 0 & 0 \\ 0 & 0 & -1 & 3 \\ 0 & 0 & 5 & 1 \end{bmatrix};$$

(2)

$$\begin{bmatrix} 1 & 0 & 2 & 0 \\ -1 & 0 & 3 & 0 \\ 0 & 2 & 0 & -1 \\ 0 & 1 & 0 & 3 \end{bmatrix};$$

(3)

$$\begin{bmatrix} 0 & 0 & 0 & 4 \\ 0 & 0 & 4 & 3 \\ 0 & 4 & 3 & 2 \\ 4 & 3 & 2 & 1 \end{bmatrix} ;$$

(4)

$$\left| \begin{array} { c c c c c c } { 0 } & { 0 } & { \cdots } & { 0 } & { \textbf { i } } & { 0 } \\ { 0 } & { 0 } & { \cdots } & { 2 } & { 0 } & { 0 } \\ { \vdots } & { \vdots } & { } & { \vdots } & { \vdots } & { \vdots } \\ { 0 } & { 8 } & { \cdots } & { 0 } & { 0 } & { 0 } \\ { 9 } & { 0 } & { \cdots } & { 0 } & { 0 } & { 0 } \\ { 0 } & { 0 } & { \cdots } & { 0 } & { 0 } & { 1 0 } \\ \end{array} \right| .$$

[page:50]

2.用行列式的定义计算下列行列式:

(1)

$$\begin{bmatrix} a & 0 & 0 & b \\ 0 & c & d & 0 \\ 0 & e & f & 0 \\ g & 0 & 0 & h \end{bmatrix};\tag{2}$$

$$\begin{aligned} &\begin{vmatrix}\\ &x & y & 0 & \cdots & 0 & 0 \\&0 & x & y & \cdots & 0 & 0 \\&0 & 0 & x & \cdots & 0 & 0 \\&\vdots & \vdots & \vdots & & \vdots & \vdots \\&0 & 0 & 0 & \cdots & x & y \\&y & 0 & 0 & \cdots & 0 & x\\ &\end{vmatrix},\\ \end{aligned}$$

## 2.2行列式的性质与计算

## 一、行列式的性质

为了进一步讨论n阶行列式，简化行列式的计算，下面介绍n阶行列式的性质

性质1n阶矩阵A的行列式按任一行展开，其值相等，即

$$\det \boldsymbol{A} = a_{i1}A_{i1} + a_{i2}A_{i2} + \cdots + a_{in}A_{in} = \sum_{j = 1}^{n} a_{ij}A_{ij} \quad (i = 1, 2, \cdots, n),$$

其中 $A_{ij} = (-1)^{i+j}M_{ij}, M_{ij}$ 是det A 中去掉第i 行第j列元 $a_{ij}$ 所成的η—1阶行列式，称为元 $a_{ij}$ 的余子式 $;A_{ij}$ 称为元 $\alpha_{ij}$ 的代数余子式.

证明从略.

推论若行列式的某行元全为零，则行列式等于零.

例1计算n阶上三角形行列式(即当 $i > j$ 时 $a_{ij} = 0$

$$\boldsymbol{D}_{n}=\begin{vmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\& a_{22} & \cdots & a_{2n} \\& & \ddots & \vdots \\& & & a_{nn}\end{vmatrix}.$$

解先将 $D_{n}$ 按第n行展开，以后每次都按最后一行展开.

$$D_{n}=a_{nn}\begin{vmatrix}a_{11}&a_{12}&\cdots&a_{1,n-1}\\&a_{22}&\cdots&a_{2,n-1}\\& &\ddots&\vdots\\& & &a_{n-1,n-1}\end{vmatrix}$$

$$\begin{aligned} &= a_{nn}a_{n - 1,n - 1}\left| \begin{matrix} a_{11} & a_{12} & \cdots & a_{1,n - 2} \\&a_{22} & \cdots & a_{2,n - 2} \\& & \ddots & \vdots \\& & & a_{n - 2,n - 2} \\\end{matrix} \right|\\ &= \cdots = a_{11}a_{22}\cdots a_{nn}.\\ \end{aligned}$$

[page:51]

同理可得

$$\begin{aligned} &\begin{vmatrix}\\ &  &  &  &  & a_{n} \\& \times &  & a_{n - 1} &  \\&  & \ddots &  &  \\&  &  &  &  \\& a_{2} &  &  &  \\&\end{vmatrix}= ( - 1)^{\frac{n(n - 1)}{2}}a_{1}a_{2}\cdots a_{n}.\\ \end{aligned}$$

例2计算四阶行列式

$$D = \begin{vmatrix} 6 & 1 & 0 & 0 \\ 5 & -1 & 3 & -2 \\ 0 & 2 & 0 & 0 \\ 1 & 3 & 4 & -3 \end{vmatrix}.$$

解由于第3行除 $a _ { 3 2 } \equiv 2$ 外，其他元均为零，由性质1得

$$D = a_{32}A_{32} = 2 \times (-1)^{3+2} \left| \begin{matrix} 6 & 0 & 0 \\ 5 & 3 & -2 \\ 1 & 4 & -3 \end{matrix} \right| ,$$

再按第1行展开有

$$D=-2\times6\times(-1)^{1+1}\left|\begin{matrix}3&-2\\4&-3\end{matrix}\right|=-12\times(-9+8)=12.$$

性质2若n阶行列式某两行对应元全相等，则行列式为零.

即当 $a_{ik} = a_{jk}, i \neq j, k = 1, 2, \cdots, n$ 时， $\det A = 0$

证用数学归纳法证明.结论对二阶行列式显然成立.当 $n \geqslant 3$ 时，假设结论对 $n = 1$阶行列式成立，在n阶的情况下，对第k行展开 $(k \neq i,j)$ ,则

$$\det A = a_{k1}A_{k1} + a_{k2}A_{k2} + \cdots + a_{kn}A_{kn} = \sum_{l = 1}^{n} a_{kl}A_{kl},$$

由于 $M_{kl} \left( l = 1, 2, \cdots, n \right)$ 是n一1阶行列式，且其中都有两行元全相等，所以

$$A_{kl} = (-1)^{k+l}M_{kl} = 0 \quad (k = 1,2,\cdots,n),$$

故 $\det A = 0$

性质3

$$\begin{aligned}\begin{vmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\\vdots & \vdots & & \vdots \\b_{i1} + c_{i1} & b_{i2} + c_{i2} & \cdots & b_{in} + c_{in} \\\vdots & \vdots & & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn}\end{vmatrix}\end{aligned}$$

[page:52]

$$\begin{aligned}= & \begin{vmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\\vdots & \vdots & & \vdots \\b_{i1} & b_{i2} & \cdots & b_{in} \\\vdots & \vdots & & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn}\end{vmatrix}+ \begin{vmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\\vdots & \vdots & & \vdots \\c_{i1} & c_{i2} & \cdots & c_{in} \\\vdots & \vdots & & & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn}\end{vmatrix}.\end{aligned}$$

证 由性质1，将上式左端行列式按第i行展开得

$$\begin{aligned} 左  = & (b_{i1} + c_{i1})A_{i1} + (b_{i2} + c_{i2})A_{i2} + \cdots + (b_{in} + c_{in})A_{in} \\= & (b_{i1}A_{i1} + b_{i2}A_{i2} + \cdots + b_{in}A_{in}) + (c_{i1}A_{i1} + c_{i2}A_{i2} + \cdots + c_{in}A_{in}) \\= & \begin{vmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\\vdots & \vdots & & \vdots \\b_{i1} & b_{i2} & \cdots & b_{in} \\\vdots & \vdots & & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn}\end{vmatrix}+ \begin{vmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\\vdots & \vdots & & \vdots \\c_{i1} & c_{i2} & \cdots & c_{in} \\\vdots & \vdots & & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn}\end{vmatrix}.\end{aligned}$$

性质3说明:如果行列式的某一行是两组数的和，那么这个行列式就等于两个行列式的和，这两个行列式分别以这两组数为这一行的元，其他各行与原来行列式的对应各行不变.

性质4(行列式的初等变换)若把行初等变换施于n阶矩阵A上:

(1)将 A的某一行乘数k得到 $A_{1}$ ,则 $\det A_{1}=k\left(\det A\right)$

(2)将A的某一行的k倍加到另一行得到 $A_{2}$ ，则 $\det \boldsymbol{A}_{2} = \det \boldsymbol{A}$

（3)交换A 的两行得到 $A_{3}$ ,则 $\det A_{3}=-\det A$

证（1）利用性质1，按乘数k的那一行展开，即得 $\det A_{1}=k\left(\det A\right)$

(2)由性质3及(1)得

$$\det \boldsymbol{A}_{2}=\begin{vmatrix}a_{11} & \cdots & a_{1n} \\\vdots & & \vdots \\a_{i1} & \cdots & a_{in} \\\vdots & & \vdots \\a_{j1}+ka_{i1} & \cdots & a_{jn}+ka_{in} \\\vdots & & \vdots \\a_{n1} & \cdots & a_{nn}\end{vmatrix}$$

$$\begin{array}{c}\left| \begin{array}{cccc}a_{11} & \cdots & a_{1n} \\\vdots &  & \vdots \\a_{i1} & \cdots & a_{in} \\\vdots &  & \vdots \\a_{j1} & \cdots & a_{jn} \\\vdots &  & \vdots \\a_{n1} & \cdots & a_{jn} \\\end{array} \right|+\left| \begin{array}{cccc}a_{11} & \cdots & a_{1n} \\\vdots &  & \vdots \\a_{i1} & \cdots & a_{in} \\\vdots &  & \vdots \\ka_{i1} & \cdots & ka_{in} \\\vdots &  & \vdots \\a_{n1} & \cdots & a_{nn} \\\end{array} \right| \\\end{array}$$

[page:53]

$$\det A + k \cdot 0 = \det A.$$

(3) 由(2)可知

$$\begin{aligned}\det A_{3} &=\begin{vmatrix}a_{11} & \cdots & a_{1n} \\\vdots & & \vdots \\a_{j1} & \cdots & a_{jn} \\\vdots & & \vdots \\a_{i1} & \cdots & a_{in} \\\vdots & & \vdots \\a_{n1} & \cdots & a_{in}\end{vmatrix} 第  j  行  i  行 =\begin{vmatrix}a_{11} & \cdots & a_{1n} \\\vdots & & \vdots \\a_{j1} & \cdots & a_{jn} \\\vdots & & \vdots \\a_{j1} + a_{ii} & \cdots & a_{jn} + a_{in} \\\vdots & & \vdots \\a_{n1} & \cdots & a_{nn}\end{vmatrix}\\&=\begin{vmatrix}a_{11} & \cdots & a_{1n} \\\vdots & & \vdots \\a_{n1} & \cdots & a_{nn} \\\vdots & & \vdots \\a_{n1} & \cdots & a_{nn}\end{vmatrix}\\&=\begin{vmatrix}a_{11} & \cdots & a_{1n} \\\vdots & & \vdots \\-a_{n1} & \cdots & -a_{in} \\\vdots & & \vdots \\a_{j1} + a_{n1} & \cdots & a_{jn} + a_{in} \\\vdots & & \vdots \\a_{n1} & \cdots & a_{nn}\end{vmatrix}=\begin{vmatrix}a_{11} & \cdots & a_{1n} \\\vdots & & \vdots \\-a_{n1} & \cdots & -a_{in} \\\vdots & & \vdots \\a_{j1} & \cdots & a_{jn} \\\vdots & & \vdots \\a_{n1} & \cdots & a_{nn}\end{vmatrix}= \cdots \det A_{n}, \\&=\begin{vmatrix}a_{11} & \cdots & a_{1n} \\\vdots & & \vdots \\a_{n1} & \cdots & a_{nn} \\\vdots & & \vdots \\a_{n1} & \cdots & a_{nn}\end{vmatrix}\end{aligned}$$

推论若行列式某两行对应元成比例，则行列式的值为零.

由性质4可知下列常用结论成立，设A为n阶矩阵，则

$$\det \left( k \boldsymbol{A} \right) = k^n \left( \det \boldsymbol{A} \right).$$

必须指出，不能把矩阵的初等变换与行列式的初等变换混淆，首先矩阵是数表，行列式是数；其次，前者是保持两矩阵的等价关系，不是相等，而后者是保持两行列式的等值关系.

为了研究矩阵转置的行列式，我们先来讨论初等矩阵的行列式.对于三个初等矩阵 $E_{ij} , E_i(c)$ 和 $E_{ij}(c)$ ，设A为n阶矩阵，由性质4有

$$\begin{aligned} &\det(\boldsymbol{E}_{ij}) = \det(\boldsymbol{E}_{ij}\boldsymbol{I}) = -\det\boldsymbol{I} = -1; \\&\det\boldsymbol{E}_{i}(c) = c \neq 0, \\&\det\boldsymbol{E}_{ij}(c) = 1.\\ \end{aligned}$$

于是，设 $A$ 为n阶矩阵，由性质4得

$$\begin{aligned} &\det(\boldsymbol{E}_{ij}\boldsymbol{A}) = -\det\boldsymbol{A} = (\det\boldsymbol{E}_{ij})(\det\boldsymbol{A}), \\&\det(\boldsymbol{E}_{i}(c)\boldsymbol{A}) = c(\det\boldsymbol{A}) = (\det\boldsymbol{E}_{i}(c))(\det\boldsymbol{A}), \\&\det(\boldsymbol{E}_{ij}(c)\boldsymbol{A}) = \det\boldsymbol{A} = (\det\boldsymbol{E}_{ij}(c))(\det\boldsymbol{A}).\\ \end{aligned}$$

故对任一初等矩阵E，都有

$$\det ( E A ) = ( \det E ) ( \det A ).$$

一般地，设 $E_{1},E_{2},\cdots,E_{t}$ 为初等矩阵，则

$$\det \left( \boldsymbol{E}_{1} \boldsymbol{E}_{2} \cdots \boldsymbol{E}_{l} \boldsymbol{A} \right) = \left( \det \boldsymbol{E}_{1} \right) \left( \det \boldsymbol{E}_{2} \right) \cdots \left( \det \boldsymbol{E}_{l} \right) \left( \det \boldsymbol{A} \right).$$

[page:54]

性质5n阶矩阵A的行列式detA与其转置矩阵的行列式 $\mathrm{det}(\boldsymbol{A}^{\mathrm{T}})$ 的值相等.即

$$\det(A^{\mathrm{T}}) = \det A.$$

证由于 $\hat{A}^{\mathrm{T}}$ 可逆的充分必要条件为A可逆，所以，当A不可逆时， $,A^{\mathrm{T}}$ 也不可逆.设A经行初等变换化为行阶梯形矩阵R,R的最后一行的元全为零，即存在初等矩阵$E_{1},E_{2},\cdots,E_{i}$ ，使得

$$A = E_{1}E_{2}\cdots E_{t}R.$$

由性质1的推论知detR=0，因而

$$\det A = \left( \det E_{1} \right) \left( \det E_{2} \right) \cdots \left( \det E_{l} \right) \left( \det R \right) = 0.$$

又 $\hat{A}^{\mathrm{T}}$ 也不可逆，同理， $\det(A^{\mathrm{T}}) = 0$ .故 $\det(A^{\mathrm{T}}) = \det A$

当A可逆时，由δ1.3的定理3，存在初等矩阵 $E_{1}, E_{2}, \cdots, E_{s}$ ，使得$A = E_{1}E_{2}\cdots E_{s}$ ，从而

$$\begin{align*}\det(\boldsymbol{A}^{\mathrm{T}}) = \det(\boldsymbol{E}_{s}^{\mathrm{T}} \cdots \boldsymbol{E}_{2}^{\mathrm{T}} \boldsymbol{E}_{1}^{\mathrm{T}}) \\= (\det \boldsymbol{E}_{s}^{\mathrm{T}}) \cdots (\det \boldsymbol{E}_{2}^{\mathrm{T}}) (\det \boldsymbol{E}_{1}^{\mathrm{T}}),\end{align*}$$

又由于对于三种初等矩阵，显然其行列式均分别等于它们转置的行列式，因而

$$\begin{aligned}\det(\boldsymbol{A}^{\mathrm{T}}) = & \left( \det \boldsymbol{E}_{s} \right) \cdots \left( \det \boldsymbol{E}_{2} \right) \left( \det \boldsymbol{E}_{1} \right) \\= & \left( \det \boldsymbol{E}_{1} \right) \left( \det \boldsymbol{E}_{2} \right) \cdots \left( \det \boldsymbol{E}_{s} \right) \\= & \det \left( \boldsymbol{E}_{1} \boldsymbol{E}_{2} \cdots \boldsymbol{E}_{s} \right) \\= & \det \boldsymbol{A}.\end{aligned}$$

性质5说明，行列式对行成立的性质对列也成立.于是，由性质1和性质5知，n阶行列式det A可按任一行或任一列展开，即

$$\det A = \sum_{k = 1}^{n} a_{kj} A_{kj} \quad (j = 1, 2, \cdots, n).$$

例3试证:奇数阶反称矩阵的行列式必为零.

证设A为n阶反称矩阵(n为奇数)，则 $A^{\top} = - A$ ，因而

$$\det A = \det A^{\top} = \det (-A) = (-1)^{n} \det A = -\det A$$

故 det A =0.

## 二、行列式的计算

计算行列式的一个基本方法是利用行列式的性质，把行列式化成上三角形行列式.由于这一方法程序固定，故适合在计算机上使用，而且计算工作量比按定义展开的方法要少.

## 例4 计算行列式

[page:55]

$$D = \left| \begin{array}{rrrr}1 & 1 & -1 & 3 \\-1 & -1 & 2 & 1 \\2 & 5 & 2 & 4 \\\hline2 & 1 & \frac{3}{2} & 1 \\\end{array} \right| .$$

解

$$D = \frac{1}{2}\left| \begin{matrix} 1 & 1 & - 1 & 3 \\ - 1 & - 1 & 2 & 1 \\ 2 & 5 & 2 & 4 \\ 1 & 2 & 3 & 2 \end{matrix} \right| \xlongequal{\begin{matrix} r_{1} + r_{2} \\ - 2r_{1} + r_{3} \\ - r_{1} + r_{4} \end{matrix}} \frac{1}{2}\left| \begin{matrix} 1 & 1 & - 1 & 3 \\ 0 & 0 & 1 & 4 \\ 0 & 3 & 4 & - 2 \\ 0 & 1 & 4 & - 1 \end{matrix} \right|$$

$$\xlongequal { r _ { 2 } \leftrightarrow r _ { 4 } } - \frac { 1 } { 2 } \left| \begin{matrix} { 1 } & { 1 } & { - 1 } & { 3 } \\ { 0 } & { 1 } & { 4 } & { - 1 } \\ { 0 } & { 3 } & { 4 } & { - 2 } \\ { 0 } & { 0 } & { 1 } & { 4 } \\ \end{matrix} \right| \xlongequal { - 3 r _ { 2 } + r _ { 3 } } - \frac { 1 } { 2 } \left| \begin{matrix} { 1 } & { 1 } & { - 1 } & { 3 } \\ { 0 } & { 1 } & { 4 } & { - 1 } \\ { 0 } & { 0 } & { - 8 } & { 1 } \\ { 0 } & { 0 } & { 1 } & { 4 } \\ \end{matrix} \right|$$

$$\xlongequal { r _ { 3 } \leftrightarrow r _ { 4 } } \frac { 1 } { 2 } \left| \begin{matrix} { 1 } & { 1 } & { - 1 } & { 3 } \\ { 0 } & { 1 } & { 4 } & { - 1 } \\ { 0 } & { 0 } & { 1 } & { 4 } \\ { 0 } & { 0 } & { - 8 } & { 1 } \\ \end{matrix} \right| \xlongequal { 8 r _ { 3 } + r _ { 4 } } \frac { 1 } { 2 } \left| \begin{matrix} { 1 } & { 1 } & { - 1 } & { 3 } \\ { 0 } & { 1 } & { 4 } & { - 1 } \\ { 0 } & { 0 } & { 1 } & { 4 } \\ { 0 } & { 0 } & { 0 } & { 3 3 } \\ \end{matrix} \right| { = } \frac { 3 3 } { 2 } .$$

计算行列式的另一基本方法是，恰当地利用性质，将某一行(列)的元尽可能化为零，然后按该行(列)展开，降阶后再计算.

例5 计算四阶行列式

$$D = \begin{vmatrix} 5 & 2 & - 6 & - 3 \\ - 4 & 7 & - 2 & 4 \\ - 2 & 3 & 4 & 1 \\ 7 & - 8 & - 10 & - 5 \end{vmatrix}.$$

解

$$D \stackrel { \begin{array} { r r r r r } { - 2 c _ { 4 } + c _ { 1 } } \\ { - 3 c _ { 4 } + c _ { 2 } } \\ { - 4 c _ { 4 } + c _ { 3 } } \end{array} } { = } \left| \begin{matrix} { - 1 } & { 1 1 } & { 6 } & { - 3 } \\ { 4 } & { - 5 } & { - 1 8 } & { 4 } \\ { 0 } & { 0 } & { 0 } & { 1 } \\ { - 3 } & { 7 } & { 1 0 } & { - 5 } \end{matrix} \right|$$

$$\begin{aligned}&\xrightarrow{ 按  r_{3}  展开 } 1 \times (-1)^{3+t} \begin{vmatrix}-1 & 11 & 6 \\4 & -5 & -18 \\-3 & 7 & 10\end{vmatrix} \xrightarrow{4r_{1}+r_{2}} \begin{vmatrix}-1 & 11 & 6 \\0 & 39 & 6 \\0 & -26 & -8\end{vmatrix}\end{aligned}$$

$$- ( - 1 ) ( - 1 ) ^ { 1 + 1 } \left| \begin{array} { r r } 3 9 & 6 \\ - 2 6 & - 8 \end{array} \right| = - 1 5 6.$$

[page:56]

这里 $c _ { i }$ 表示第i列.

例6计算n阶行列式

$$D_{n}=\begin{vmatrix}x&y&y&\cdots&y\\y&x&y&\cdots&y\\\vdots&\vdots&\vdots& &\vdots\\y&y&y&\cdots&x\end{vmatrix}.$$

解注意到每行除了一个x外，其余n—1个数全为y，故将第2列，第3列， $\cdots$第n列都加到第1列，得

$$\begin{aligned}D_{n} = & \left| \begin{matrix}x + (n - 1)y & y & \cdots & y \\x + (n - 1)y & x & \cdots & y \\\vdots & \vdots & & \vdots \\x + (n - 1)y & y & \cdots & x \\\end{matrix} \right|= \left[ x + (n - 1)y \right]\left| \begin{matrix}1 & y & \cdots & y \\1 & x & \cdots & y \\\vdots & \vdots & & \vdots \\1 & y & \cdots & x \\\end{matrix} \right| \\\xlongequal{-r_{1}+r_{i}(i = 2,\cdots,n)} & \left[ x + (n - 1)y \right]\left| \begin{matrix}1 & y & \cdots & y \\0 & x - y & \cdots & 0 \\\vdots & \vdots & & \vdots \\0 & 0 & \cdots & x - y \\\end{matrix} \right| \\= & \left[ x + (n - 1)y \right](x - y)^{n - 1}.\end{aligned}$$

例7 证明

$$\begin{vmatrix}a_{1} + b_{1} & b_{1} + c_{1} & c_{1} + a_{1} \\a_{2} + b_{2} & b_{2} + c_{2} & c_{2} + a_{2} \\a_{3} + b_{3} & b_{3} + c_{3} & c_{3} + a_{3}\end{vmatrix}= 2\begin{vmatrix}a_{1} & b_{1} & c_{1} \\a_{2} & b_{2} & c_{2} \\a_{3} & b_{3} & c_{3}\end{vmatrix}.$$

证一把左端行列式的第2,3列加到第1列，提取公因子2，再把第1列乘(一1)加到第2,3列得

$$\begin{aligned} 左式  = 2\begin{vmatrix}a_{1} + b_{1} + c_{1} & - a_{1} & - b_{1} \\a_{2} + b_{2} + c_{2} & - a_{2} & - b_{2} \\a_{3} + b_{3} + c_{3} & - a_{3} & - b_{3}\end{vmatrix}.\end{aligned}$$

把第2,3列加到第1列，然后分别提2,3列的公因数(—1)，再作两次列对换，等式得证.

证二

$$\begin{aligned} 左式  &=\begin{vmatrix}a_{1} & b_{1}+c_{1} & c_{1}+a_{1} \\a_{2} & b_{2}+c_{2} & c_{2}+a_{2} \\a_{3} & b_{3}+c_{3} & c_{3}+a_{3}\end{vmatrix}+\begin{vmatrix}b_{1} & b_{1}+c_{1} & c_{1}+a_{1} \\b_{2} & b_{2}+c_{2} & c_{2}+a_{2} \\b_{3} & b_{3}+c_{3} & c_{3}+a_{3}\end{vmatrix} \\&=\begin{vmatrix}a_{1} & b_{1} & c_{1}+a_{1} \\a_{2} & b_{2} & c_{2}+a_{2} \\a_{3} & b_{3} & c_{3}+a_{3}\end{vmatrix}+\begin{vmatrix}a_{1} & c_{1} & c_{1}+a_{1} \\a_{2} & c_{2} & c_{2}+a_{2} \\a_{3} & c_{3} & c_{3}+a_{3}\end{vmatrix}+\end{aligned}$$

[page:57]

$$\begin{aligned}&\left| \begin{matrix}b_{1} & b_{1} & c_{1} + a_{1} \\b_{2} & b_{2} & c_{2} + a_{2} \\b_{3} & b_{3} & c_{3} + a_{3}\end{matrix} \right|+\left| \begin{matrix}b_{1} & c_{1} & c_{1} + a_{1} \\b_{2} & c_{2} & c_{2} + a_{2} \\b_{3} & c_{3} & c_{3} + a_{3}\end{matrix} \right| \\=&\left| \begin{matrix}a_{1} & b_{1} & c_{1} \\a_{2} & b_{2} & c_{2} \\a_{3} & b_{3} & c_{3}\end{matrix} \right|+ 0 + 0 + 0 + 0 + 0 + 0 + 0 + \left| \begin{matrix}b_{1} & c_{1} & a_{1} \\b_{2} & c_{2} & a_{2} \\b_{3} & c_{3} & a_{3}\end{matrix} \right|=  右式 .\end{aligned}$$

例8证明范德蒙德(Vandermonde)行列式 $( n \geq 2 )$

$$V_{n}=\left|\begin{matrix}1&1&1&\cdots&1\\x_{1}&x_{2}&x_{3}&\cdots&x_{n}\\x_{1}^{2}&x_{2}^{2}&x_{3}^{2}&\cdots&x_{n}^{2}\\\vdots&\vdots&\vdots&&\vdots\\x_{1}^{n-1}&x_{2}^{n-1}&x_{3}^{n-1}&\cdots&x_{n}^{n-1}\end{matrix}\right|=\prod_{1\leqslant j<i\leqslant n}\left(x_{i}-x_{j}\right),$$

其中连乘积

$$\begin{aligned}\prod_{1 \leqslant j < i \leqslant n} & (x_{i}-x_{j}) \\= & (x_{2}-x_{1})(x_{3}-x_{1})\cdots(x_{n}-x_{1})(x_{3}-x_{2})\cdots(x_{n}-x_{2}) \\\cdots & (x_{n-1}-x_{n-2})(x_{n}-x_{n-2})(x_{n}-x_{n-1})\end{aligned}$$

是满足条件 $1 \leq j < i \leq n$ 的所有因子 $(x_{i} - x_{j})$ 的乘积.

证 对行列式的阶数n作数学归纳法.

当 $n \equiv 2$ 时，有

$$\left| \begin{matrix} { 1 } & { 1 } \\ { x _ { 1 } } & { x _ { 2 } } \\ \end{matrix} \right| = x _ { 2 } - x _ { 1 } ,$$

结论成立.

假设对于n一1阶范德蒙德行列式结论成立.下证对n阶范德蒙德行列式结论也成立.

在 $V _ { n }$ 中从第n行开始，逐行减去上一行的 $x _ { 1 }$ 倍，可得

$$\begin{aligned}V_{n} &=\begin{vmatrix}1 & 1 & 1 & \cdots & 1 \\0 & x_{2} - x_{1} & x_{3} - x_{1} & \cdots & x_{n} - x_{1} \\0 & x_{2}(x_{2} - x_{1}) & x_{3}(x_{3} - x_{1}) & \cdots & x_{n}(x_{n} - x_{1}) \\\vdots & \vdots & \vdots & & \vdots \\0 & x_{2}^{n - 2}(x_{2} - x_{1}) & x_{3}^{n - 2}(x_{3} - x_{1}) & \cdots & x_{n}^{n - 2}(x_{n} - x_{1})\end{vmatrix} \\&=\begin{vmatrix}1 & x_{2} - x_{1} & x_{3} - x_{1} & \cdots & x_{n} - x_{1} \\x_{2}(x_{2} - x_{1}) & x_{3}(x_{3} - x_{1}) & \cdots & x_{n}(x_{n} - x_{1}) \\\vdots & \vdots & & \vdots \\x_{2}^{n - 2}(x_{2} - x_{1}) & x_{3}^{n - 2}(x_{3} - x_{1}) & \cdots & x_{n}^{n - 2}(x_{n} - x_{1})\end{vmatrix}\end{aligned}$$

[page:58]

$$\begin{aligned}= (x_{2} - x_{1})(x_{3} - x_{1})\cdots(x_{n} - x_{1}) \left| \begin{array}{cccc}1 & 1 & \cdots & 1 \\x_{2} & x_{3} & \cdots & x_{n} \\x_{2}^{2} & x_{3}^{2} & \cdots & x_{n}^{2} \\\vdots & \vdots & & \vdots \\x_{2}^{n - 2} & x_{3}^{n - 2} & \cdots & x_{n}^{n - 2} \\\end{array} \right|,\end{aligned}$$

上式右端的行列式是一个n一1阶范德蒙德行列式，根据归纳假设有

$$V_{n}=(x_{2}-x_{1})(x_{3}-x_{1})\cdots(x_{n}-x_{1})\prod_{2 \leq j<i \leq n}(x_{i}-x_{j})=\prod_{1 \leq j<i \leq n}(x_{i}-x_{j}),$$

由归纳法，结论成立.

显然， $V_{n} \neq 0$ 的充分必要条件是 $x_{1},x_{2},\cdots,x_{n}$ 互不相同.

由上例可见，利用数学归纳法证明行列式时，在降阶过程中注意保持行列式的“原形”是很重要的.

在n阶行列式的计算中，一般都将高阶行列式转化为低阶行列式来计算.但对某些特殊的行列式，也常采用“加边”法

例9 计算n阶行列式

$$D_{n}=\begin{vmatrix}x_{1}-m&x_{2}&\cdots&x_{n}\\x_{1}&x_{2}-m&\cdots&x_{n}\\\vdots&\vdots&&\vdots\\x_{1}&x_{2}&\cdots&x_{n}-m\end{vmatrix}.$$

解 我们利用如下的加边法:

$$D _ { n } = \left| \begin{array} { c c c c c } { 1 } & { x _ { 1 } } & { x _ { 2 } } & { \cdots } & { x _ { n } } \\ { 0 } & { x _ { 1 } - m } & { x _ { 2 } } & { \cdots } & { x _ { n } } \\ { 0 } & { x _ { 1 } } & { x _ { 2 } - m } & { \cdots } & { x _ { n } } \\ { \vdots } & { \vdots } & { \vdots } & { } & { \vdots } \\ { 0 } & { x _ { 1 } } & { x _ { 2 } } & { \cdots } & { x _ { n } - m } \\ \end{array} \right| ,$$

将第1行的(—1)倍分别加到第2行，第3行，…，第n+1行得

$$D_{n}{=}\begin{vmatrix}1&x_{1}&x_{2}&\cdots&x_{n}\\-1&-m&0&\cdots&0\\-1&0&-m&\cdots&0\\\vdots&\vdots&\vdots& &\vdots\\-1&0&0&\cdots&-m\end{vmatrix},$$

若 $\bar{m} \equiv 0$ ,则

$$D_{n}=\left\{\begin{aligned}x_{1}, \quad n=1, \\ 0, \quad n>1.\end{aligned}\right.$$

[page:59]

若 $m \neq 0$ ，则将 $D_{n}$ 中第2列，第3列，…，第n+1列都乘 $- \frac { 1 } { m }$ 后加到第1列得

$$\begin{aligned}D_{n} &= \left| \begin{matrix}1 - \sum\limits_{i = 1}^{n}\frac{x_{i}}{m} & x_{1} & x_{2} & \cdots & x_{n} \\0 & - m & 0 & \cdots & 0 \\0 & 0 & - m & \cdots & 0 \\\vdots & \vdots & \vdots & & \vdots \\0 & 0 & 0 & \cdots & - m \\\end{matrix} \right| \\&= ( - m)^{n}\left( 1 - \frac{1}{m}\sum_{i = 1}^{n}x_{i} \right) \\&= ( - 1)^{n - 1}m^{n - 1}\left( \sum_{i = 1}^{n}x_{i} - m \right),\end{aligned}$$

## 三、方阵乘积的行列式

本段中，我们来进一步讨论方阵乘积的行列式以及用行列式来刻画矩阵可逆的充要条件.

定理1 n阶矩阵A可逆的充分必要条件为 $\det A \neq 0$

证设A经行初等变换化为简化行阶梯形矩阵R，即存在初等矩阵 $E_{1},E_{2},\cdots$ $E _ { i }$ ，使得

$$\boldsymbol{A} = \boldsymbol{E}_{1} \boldsymbol{E}_{2} \cdots \boldsymbol{E}_{l} \boldsymbol{R}.$$

若A可逆，则R=I，所以

$$\det A = \left( \det \boldsymbol{E}_{1} \right) \left( \det \boldsymbol{E}_{2} \right) \cdots \left( \det \boldsymbol{E}_{t} \right) \left( \det \boldsymbol{I} \right) \neq 0.$$

反之，如果 $\det A \neq 0$ ，但A不可逆，则R的最后一行的元全为零，因此由行列式的性质知 det R=0，则

$$\det A = \left( \det \boldsymbol{E}_{1} \right) \left( \det \boldsymbol{E}_{2} \right) \cdots \left( \det \boldsymbol{E}_{r} \right) \left( \det \boldsymbol{R} \right) = 0,$$

矛盾，故A可逆.

下面我们证明一个重要结果:两个n阶矩阵乘积的行列式等于这两个矩阵的行列式的乘积.

定理2设A,B为 η阶矩阵，则

$$\det ( \boldsymbol{A} \boldsymbol{B} ) = ( \det \boldsymbol{A} ) ( \det \boldsymbol{B} ).$$

证 设A经行初等变换化为简化行阶梯形矩阵R，即存在初等矩阵 $E_{1},E_{2},\cdots$ $E _ { t }$ ,使得 $\boldsymbol{A} = \boldsymbol{E}_{1} \boldsymbol{E}_{2} \cdots \boldsymbol{E}_{t} \boldsymbol{R}$ ,则

$$\begin{aligned}\det(\boldsymbol{A}\boldsymbol{B}) &= \det(\boldsymbol{E}_{1}\boldsymbol{E}_{2}\cdots\boldsymbol{E}_{i}\boldsymbol{R}\boldsymbol{B}) \\&= (\det\boldsymbol{E}_{1})(\det\boldsymbol{E}_{2})\cdots(\det\boldsymbol{E}_{i})(\det(\boldsymbol{R}\boldsymbol{B})).\end{aligned}$$

如果A可逆，则R=I.此时 $A = E_{1}E_{2}\cdots E_{t}$ ，于是

[page:60]

$$\det A = \left( \det E_{1} \right) \left( \det E_{2} \right) \cdots \left( \det E_{t} \right),$$

故

$$\det \left( A B \right) = \left( \det A \right) \left( \det \left( I B \right) \right) = \left( \det A \right) \left( \det B \right).$$

如果A不可逆，则R的最后一行全为零，因而RB的最后一行也全为零，所以由行列式性质，

$$\det(RB) = 0$$

从而 $\det(AB) = 0$ ，又由定理1知 $\det A = 0$ ,故

$$\det ( \boldsymbol{A} \boldsymbol{B} ) = ( \det \boldsymbol{A} ) ( \det \boldsymbol{B} ).$$

推论1 设 $A_{i}(i = 1,2,\cdots,r)$ 均为n阶矩阵，则

$$\det \left( \boldsymbol{A}_{1} \boldsymbol{A}_{2} \cdots \boldsymbol{A}_{r} \right) = \left( \det \boldsymbol{A}_{1} \right) \left( \det \boldsymbol{A}_{2} \right) \cdots \left( \det \boldsymbol{A}_{r} \right).$$

推论2如果A,B为n阶矩阵，且 $AB = I$ (或 $BA = I$ ,则 $\hat { B } = A ^ { - 1 }$

证因为 $\det(AB) = (\det A)(\det B) = \det I = 1$ ，所以det $A \neq 0$ ，故 $A^{-1}$ 存在，于是

$$\boldsymbol{B}=\boldsymbol{I}\boldsymbol{B}=(\boldsymbol{A}^{-1}\boldsymbol{A})\boldsymbol{B}=\boldsymbol{A}^{-1}(\boldsymbol{A}\boldsymbol{B})=\boldsymbol{A}^{-1}\boldsymbol{I}=\boldsymbol{A}^{-1}.$$

设A为可逆的，则 $\det A \neq 0$ .由定理2和 $A A ^ { - 1 } = I$ 有

$$\left( \det A \right) \left( \det \left( A^{-1} \right) \right) = \det I = 1,$$

因而

$$\det(\boldsymbol{A}^{-1}) = (\det \boldsymbol{A})^{-1}.$$

这说明A的逆矩阵的行列式等于A的行列式的倒数

例10设

$$\boldsymbol{A} = \begin{bmatrix} 1 & 2 & 4 \\ 0 & - 2 & 7 \\ 0 & 0 & - 3 \end{bmatrix}, \quad \boldsymbol{B} = \begin{bmatrix} 4 & 9 & 5 \\ 0 & 1 & - 7 \\ 0 & 0 & 2 \end{bmatrix},$$

求 $\det(AB^{\mathrm{T}}),\det(A+B),\det(2A),\det(A^{-1}),\det(2A^{2}B^{-1})$

解显然 $\det A = 6 \ne 0, \det B = 8 \ne 0$ ，故A，B可逆，且

$$\det \left( \boldsymbol{A} \boldsymbol{B}^{\mathrm{T}} \right) = \left( \det \boldsymbol{A} \right) \left( \det \boldsymbol{B}^{\mathrm{T}} \right) = 48,$$

$$\det(\boldsymbol{A} + \boldsymbol{B}) = \begin{vmatrix} 5 & 11 & 9 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{vmatrix} = 5,$$

$$\det(2\boldsymbol{A}) = 2^{3}\det\boldsymbol{A} = 48$$

$$\det(A^{-1}) = \frac{1}{\det A} = \frac{1}{6},$$

[page:61]

$$\det\left(2\boldsymbol{A}^{2}\boldsymbol{B}^{-1}\right)=2^{3}\det\left(\boldsymbol{A}^{2}\right)\left(\det\boldsymbol{B}^{-1}\right)=2^{3}\left(\det\boldsymbol{A}\right)^{2}\cdot\frac{1}{\det\boldsymbol{B}}=36.$$

例11 已知矩阵 $\boldsymbol{A} = (\boldsymbol{\alpha}, \boldsymbol{v}_{1}, \boldsymbol{v}_{2}, \boldsymbol{v}_{3}), \boldsymbol{B} = (\boldsymbol{\beta}, \boldsymbol{v}_{1}, \boldsymbol{v}_{2}, \boldsymbol{v}_{3})$ ,其中 $\alpha , \beta , v _ { 1 } , v _ { 2 } , v _ { 3 }$ 都是$4 \times 1$ 矩阵.设 $| \boldsymbol{A} | = 4, | \boldsymbol{B} | = 1$ ,求 $| \boldsymbol{A}^{\mathrm{T}} + \boldsymbol{B}^{\mathrm{T}} |$

解

$$\begin{aligned}\left| \boldsymbol{A}^{\mathrm{T}} + \boldsymbol{B}^{\mathrm{T}} \right| &= \left| (\boldsymbol{A} + \boldsymbol{B})^{\mathrm{T}} \right| = \left| \boldsymbol{A} + \boldsymbol{B} \right| \\&= \left| \boldsymbol{\alpha} + \boldsymbol{\beta}, 2\boldsymbol{v}_{1}, 2\boldsymbol{v}_{2}, 2\boldsymbol{v}_{3} \right| \\&= \left| \boldsymbol{\alpha}, 2\boldsymbol{v}_{1}, 2\boldsymbol{v}_{2}, 2\boldsymbol{v}_{3} \right| + \left| \boldsymbol{\beta}, 2\boldsymbol{v}_{1}, 2\boldsymbol{v}_{2}, 2\boldsymbol{v}_{3} \right| \\&= 2^{3} \left| \boldsymbol{\alpha}, \boldsymbol{v}_{1}, \boldsymbol{v}_{2}, \boldsymbol{v}_{3} \right| + 2^{3} \left| \boldsymbol{\beta}, \boldsymbol{v}_{1}, \boldsymbol{v}_{2}, \boldsymbol{v}_{3} \right| = 40.\end{aligned}$$

典型例题讲解行列式计算综合例题

## 题2.2

1. 计算下列行列式:

(1)

$$\left[ \begin{matrix} { 0 } & { 1 } & { 1 } & { 1 } \\ { 1 } & { 0 } & { 1 } & { 1 } \\ { 1 } & { 1 } & { 0 } & { 1 } \\ { 1 } & { 1 } & { 1 } & { 0 } \\ \end{matrix} \right] ;$$

(2)

$$\begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & - 1 & 1 & 1 \\ 1 & 1 & - 1 & 1 \\ 1 & 1 & 1 & - 1 \end{bmatrix};$$

(3)

$$\left[ \begin{matrix} { 5 } & { 0 } & { 4 } & { 2 } & { } \\ { 1 } & { - 1 } & { 2 } & { 1 } & { } \\ { 4 } & { 1 } & { 2 } & { 0 } & { } \\ { 1 } & { 1 } & { 1 } & { 1 } & { } \\ \end{matrix} \right] ;$$

(4)

$$\begin{bmatrix} 0 & a & b & c \\ a & 0 & c & b \\ b & c & 0 & a \\ c & b & a & 0 \end{bmatrix} ;$$

$$\left. \begin{array} { c c c c c } { 1 } & { \; 2 \; } & { \; 2 \; } & { \cdots \; } & { \; 2 \; } \\ { 2 } & { \; 2 \; } & { \; 2 \; } & { \cdots \; } & { \; 2 \; } \\ \end{array} \right\}$$

(5)

$$\begin{array}{ccccc|c}2 & 2 & 3 & \cdots & 2 & \vdots \\\vdots & \vdots & \vdots & & \vdots & \\2 & 2 & 2 & \cdots & n & \\\end{array}$$

(6)

$$\left[ \begin{matrix} { 1 { + } a _ { 1 } b _ { 1 } } & { 1 { + } a _ { 1 } b _ { 2 } } & { 1 { + } a _ { 1 } b _ { 3 } } & { 1 { + } a _ { 1 } b _ { 4 } } \\ { 1 { + } a _ { 2 } b _ { 1 } } & { 1 { + } a _ { 2 } b _ { 2 } } & { 1 { + } a _ { 2 } b _ { 3 } } & { 1 { + } a _ { 2 } b _ { 4 } } \\ { 1 { + } a _ { 3 } b _ { 1 } } & { 1 { + } a _ { 3 } b _ { 2 } } & { 1 { + } a _ { 3 } b _ { 3 } } & { 1 { + } a _ { 3 } b _ { 4 } } \\ { 1 { + } a _ { 4 } b _ { 1 } } & { 1 { + } a _ { 4 } b _ { 2 } } & { 1 { + } a _ { 4 } b _ { 3 } } & { 1 { + } a _ { 4 } b _ { 4 } } \\ \end{matrix} \right] ;$$

(7)

$$\begin{aligned}\left| \begin{array}{ccccc}1 & 2 & 3 & \cdots & n - 1 & n \\1 & -1 & 0 & \cdots & 0 & 0 \\0 & 2 & -2 & \cdots & 0 & 0 \\\vdots & \vdots & \vdots & & \vdots & \vdots \\0 & 0 & 0 & \cdots & n - 1 & -(n - 1) \\\end{array} \right| .\end{aligned}$$

2.证明下列等式:

(1)

$$\begin{vmatrix} a_{1} + b_{1}x & a_{1}x + b_{1} & c_{1} \\ a_{2} + b_{2}x & a_{2}x + b_{2} & c_{2} \\ a_{3} + b_{3}x & a_{3}x + b_{3} & c_{3} \end{vmatrix} = (1 - x^{2}) \begin{vmatrix} a_{1} & b_{1} & c_{1} \\ a_{2} & b_{2} & c_{2} \\ a_{3} & b_{3} & c_{3} \end{vmatrix};$$

(2)

$$\begin{vmatrix} ax + by & ay + bz & az + bx \\ ay + bz & az + bx & ax + by \\ ax + bx & ax + by & ay + bz \end{vmatrix} = (a^3 + b^3) \begin{vmatrix} x & y & z \\ y & z & x \\ z & x & y \end{vmatrix};$$

[page:62]

$$\begin{aligned}(3) D_{n} = & \left| \begin{array}{ccccc}\cos \theta & 1 & 0 & \cdots & 0 & 0 \\1 & 2\cos \theta & 1 & \cdots & 0 & 0 \\0 & 1 & 2\cos \theta & \cdots & 0 & 0 \\\vdots & \vdots & \vdots & & \vdots & \vdots \\0 & 0 & 0 & \cdots & 2\cos \theta & 1 \\0 & 0 & 0 & \cdots & 1 & 2\cos \theta \\\end{array} \right| = \cos n\theta.\end{aligned}$$

3. 计算下列行列式:

(1)

$$\begin{vmatrix}a_{1} + \lambda_{1} & a_{2} & \cdots & a_{n} \\a_{1} & a_{2} + \lambda_{2} & \cdots & a_{n} \\\vdots & \vdots & & \vdots \\a_{1} & a_{2} & \cdots & a_{n} + \lambda_{n}\end{vmatrix}\quad (\lambda_{i} \neq 0, i = 1, 2, \cdots, n);$$

$$\begin{aligned}(2) \left| \begin{array}{cccc}a_{1}^{n} & a_{1}^{n - 1}b_{1} & \cdots & a_{1}b_{1}^{n - 1} & b_{1}^{n} \\a_{2}^{n} & a_{2}^{n - 1}b_{2} & \cdots & a_{2}b_{2}^{n - 1} & b_{2}^{n} \\\vdots & \vdots & & \vdots & \vdots \\a_{n}^{n} & a_{n}^{n - 1}b_{n} & \cdots & a_{n}b_{n}^{n - 1} & b_{n}^{n} \\a_{n + 1}^{n} & a_{n + 1}^{n - 1}b_{n + 1} & \cdots & a_{n + 1}b_{n + 1}^{n - 1} & b_{n + 1}^{n} \\\end{array} \right| \quad (a_{i} \neq 0, i = 1,2, \cdots, n + 1).\end{aligned}$$

4. 若A 是 n 阶矩阵， $\boldsymbol{A}\boldsymbol{A}^{\mathrm{T}} \equiv \boldsymbol{I}$ ,试求det A.

5. 设 A 为 n 阶矩阵， $AA^{\mathrm{T}} = I, \det A = -1$ ，证明: $\det(I + A) = 0$

6. 设 $A = B = - C = D^{\mathrm{T}} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$ ，求: $\begin{bmatrix} \boldsymbol{A} & \boldsymbol{B} \\ \boldsymbol{C} & \boldsymbol{D} \end{bmatrix}, \begin{bmatrix} \boldsymbol{A} \\ \boldsymbol{C} \end{bmatrix}, \begin{bmatrix} \boldsymbol{B} \\ \boldsymbol{D} \end{bmatrix}.$

7. 设A,B 均为4阶矩阵， $|A| = -2, |B| = 3$ ，计算:

(1) $\left| \frac{1}{2} \boldsymbol{A} \boldsymbol{B}^{-1} \right|$ (2) $\left[ - \boldsymbol{A} \boldsymbol{B}^{\mathrm{T}} \right]$ (3) $\left| (AB)^{-1} \right|$ (4) $\left[ \left[ ( \boldsymbol{A} \boldsymbol{B} )^{\mathrm{T}} \right]^{-1} \right]$

8. 已知 n 阶矩阵A 满足 $A^{2} \equiv A$ ，证明: $A \equiv I$ 或 $\det A = 0$

## 3拉普拉斯展开定理

拉普拉斯(Laplace)定理是行列式按一行(列)展开的推广.下面我们先将余子式与代数余子式的概念加以推广.

定义在n阶行列式D中，任取k行、k列 $( 1 \leq k \leq n )$ ,位于这k行、k列的交点上的 $k ^ { 2 }$ 个元按原来的相对位置组成的k阶行列式S，称为D的一个k阶子式.在D中划去S所在的k行与k列，余下的元按原来的相对位置组成的n一k阶行列式M称为S的余子式.设 S的各行位于D 中第 $i_{1},i_{2},\cdots,i_{k}$ 行 $(i_1 < i_2 < \cdots < i_k)$ ,S 的各列位于D 中第 $j_{1}, j_{2}, \cdots, j_{k}$ 列 $(j_1 < j_2 < \cdots < j_k)$ ,则称

重难点分析k阶子式、余子式、代数余子式

$$A = (-1)^{(i_1 + i_2 + \cdots + i_k) + (j_1 + j_2 + \cdots + j_k)} M$$

[page:63]

为S的代数余子式.

例如，在四阶行列式

$$D = \left| \begin{matrix} { 1 } & { 2 } & { 1 } & { 4 } \\ { 3 } & { 1 } & { 4 } & { 4 } \\ { 0 } & { 0 } & { 2 } & { 1 } \\ { 1 } & { 1 } & { 1 } & { 4 } \\ \end{matrix} \right|$$

中选取第1,3行，第2，4列得一个二阶子式

$$S = \begin{vmatrix} 2 & 4 \\ 0 & 1 \end{vmatrix} = 2$$

S的余子式为

$$M = \begin{vmatrix} 3 & 4 \\ 1 & 1 \end{vmatrix} = - 1$$

S的代数余子式为

$$A=(-1)^{(1+3)+(2+4)}M=\begin{vmatrix}3&4\\1&1\end{vmatrix}=-1.$$

由于从n个行中任取k行，共有 $\mathrm{C}_{n}^{k}$ 种取法；从n个列中任取k列，也有 $C _{n}$ 种取法，故 n阶行列式D的k $( 1 \leqslant k \leqslant n )$ 阶子式共有 $( \mathbb{C}_n^k )^2$ 个.而对D的每一个子式S，它的余子式M和代数余子式A都由S惟一确定.

定理(拉普拉斯定理)若在行列式D中任意取定k个行 $(1 \leq k \leq n - 1)$ ,则由这k个行组成的所有k阶子式与它们的代数余子式的乘积之和等于D.

设D的某k行组成的所有k阶子式分别为 $S_{1},S_{2},\cdots,S_{t} \left ( t=C_{n}^{k} \right )$ ，它们相应的代数余子式分别为 $A_{1},A_{2},\cdots,A_{l}$ ,则

$$D = S_{1}A_{1} + S_{2}A_{2} + \cdots + S_{l}A_{l}.$$

定理的证明从略.

当k=1时，拉普拉斯定理就是行列式按一行(列)展开，所以拉普拉斯定理是行列式按一行(列)展开性质的推广，它是行列式按某k行(列)的展开.

例1 计算

$$D = \left| \begin{matrix} { 2 } & { 1 } & { 0 } & { 0 } & { 0 } \\ { 1 } & { 2 } & { 1 } & { 0 } & { 0 } \\ { 0 } & { 1 } & { 2 } & { 1 } & { 0 } \\ { 0 } & { 0 } & { 1 } & { 2 } & { 1 } \\ { 0 } & { 0 } & { 0 } & { 1 } & { 2 } \\ \end{matrix} \right| .$$

解按第1，2行展开，这两行元共组成 $C_{5}^{2} = 10$ 个二阶子式，但其中不为0的二阶子式只有3个，即

[page:64]

$$S_{1}=\begin{vmatrix}2&1\\1&2\end{vmatrix}=3,\;S_{2}=\begin{vmatrix}2&0\\1&1\end{vmatrix}=2,\;S_{3}=\begin{vmatrix}1&0\\2&1\end{vmatrix}=1,$$

它们对应的代数余子式为

$$A_{1} = (-1)^{(1+2)+(1+2)} \begin{vmatrix} 2 & 1 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & 2 \end{vmatrix} = 4 \text{。 }$$

$$A_{2}=(-1)^{(1+2)+(1+3)}\begin{vmatrix}1&1&0\\0&2&1\\0&1&2\end{vmatrix}=-3$$

$$A_{3} = (-1)^{(1+2)+(2+3)} \begin{vmatrix} 0 & 1 & 0 \\ 0 & 2 & 1 \\ 0 & 1 & 2 \end{vmatrix} = 0$$

故由拉普拉斯定理

$$D = S_{1}A_{1} + S_{2}A_{2} + S_{3}A_{3} = 6.$$

由拉普拉斯定理可得下列常用结果:块下或块上三角形矩阵

$$\boldsymbol{A} = \begin{pmatrix} \boldsymbol{B}_{m \times m} & \boldsymbol{O} \\ * & \boldsymbol{C}_{n \times n} \end{pmatrix}$$

或

$$\boldsymbol{A} = \begin{bmatrix} \boldsymbol{B}_{m \times m} & * \\ \boldsymbol{O} & \boldsymbol{C}_{n \times n} \end{bmatrix}$$

的行列式

$$\det A = (\det B)(\det C).$$

事实上，对于

$$\boldsymbol{A} = \begin{bmatrix} \boldsymbol{B}_{m \times m} & \boldsymbol{O} \\ * & \boldsymbol{C}_{n \times n} \end{bmatrix},$$

在detA的前m行的所有m阶子式中，只有一个可能不为零，故由拉普拉斯定理，按前m行展开，易知det $A = ( \det B ) ( \det C )$ 成立.同理，对于

$$\boldsymbol{A} = \begin{bmatrix} \boldsymbol{B}_{m \times m} & \times \\ \boldsymbol{O} & \boldsymbol{C}_{n \times n} \end{bmatrix},$$

按 det A的前m列展开便知结论成立

[page:65]

特别地，有块对角矩阵行列式的常用结果:设

$$\boldsymbol{A} = \mathrm{diag}(A_1, A_2, \cdots, A_i),$$

其中 $A_{i}(i = 1,\cdots,t)$ 为方阵，则

$$\det A = \left( \det A_{1} \right) \left( \det A_{2} \right) \cdots \left( \det A_{l} \right).$$

例2 设分块矩阵 $A = \begin{pmatrix} B & O \\ C & D \end{pmatrix}$ ，其中O是零矩阵，B和D是可逆矩阵，求 $A^{=1}$

解根据拉普拉斯定理 $\det \boldsymbol{A} = (\det \boldsymbol{B})(\det \boldsymbol{D}) \neq 0$ ，所以A可逆.

设 $A^{-1}$ 对应的分块矩阵为 $\boldsymbol{A}^{-1} = \begin{pmatrix} \boldsymbol{X}_{1} & \boldsymbol{X}_{2} \\ \boldsymbol{X}_{3} & \boldsymbol{X}_{4} \end{pmatrix}$ ,其中 $X _ { 1 }$ 与B是同型矩阵， $X _ { 4 }$ 与D是同型矩阵.则根据分块矩阵的乘法有

典型例题讲解利用拉普拉斯展开判断矩阵可逆性

$$\begin{aligned}\boldsymbol{A} \boldsymbol{A}^{-1} &=\begin{bmatrix}\boldsymbol{B} & \boldsymbol{O} \\\boldsymbol{C} & \boldsymbol{D}\end{bmatrix}\begin{bmatrix}\boldsymbol{X}_{1} & \boldsymbol{X}_{2} \\\boldsymbol{X}_{3} & \boldsymbol{X}_{4}\end{bmatrix} \\&=\begin{bmatrix}\boldsymbol{B} \boldsymbol{X}_{1} & \boldsymbol{B} \boldsymbol{X}_{2} \\\boldsymbol{C} \boldsymbol{X}_{1}+\boldsymbol{D} \boldsymbol{X}_{3} & \boldsymbol{C} \boldsymbol{X}_{2}+\boldsymbol{D} \boldsymbol{X}_{4}\end{bmatrix}=\begin{bmatrix}\boldsymbol{I} & \boldsymbol{O} \\\boldsymbol{O} & \boldsymbol{I}\end{bmatrix}=\boldsymbol{I},\end{aligned}$$

故

$$\begin{cases}BX_{1} = I, \\BX_{2} = O, \\CX_{1} + DX_{3} = O, \\CX_{2} + DX_{4} = I.\end{cases}$$

解得

$$\begin{cases}\boldsymbol{X}_{1} = \boldsymbol{B}^{-1}, \\\boldsymbol{X}_{2} = \boldsymbol{O}, \\\boldsymbol{X}_{3} = -\boldsymbol{D}^{-1} \boldsymbol{C} \boldsymbol{B}^{-1}, \\\boldsymbol{X}_{4} = \boldsymbol{D}^{-1},\end{cases}$$

故

$$\boldsymbol{A}^{-1} = \begin{bmatrix} \boldsymbol{B}^{-1} & \boldsymbol{O} \\ -\boldsymbol{D}^{-1} \boldsymbol{C} \boldsymbol{B}^{-1} & \boldsymbol{D}^{-1} \end{bmatrix}.$$

## 题2.3

1. 计算下列行列式:

[page:66]

(1)

$$\begin{bmatrix} 1 & 2 & 0 & 0 \\ 3 & 4 & 0 & 0 \\ 0 & 0 & -1 & 3 \\ 0 & 0 & 5 & 1 \end{bmatrix};$$

(2)

$$\begin{bmatrix} 1 & 0 & 2 & 0 \\ -1 & 0 & 3 & 0 \\ 0 & 2 & 0 & -1 \\ 0 & 1 & 0 & 3 \end{bmatrix} ;$$

(3)

$$\begin{bmatrix} 0 & 0 & 0 & 1 & - 1 & 2 \\ 0 & 0 & 0 & 3 & \quad 0 & 2 \\ 0 & 0 & 0 & 2 & \quad 4 & 0 \\ 0 & 0 & 1 & 2 & \quad 0 & 4 \\ 0 & 2 & 3 & 0 & \quad 2 & 3 \\ 3 & 1 & 2 & 1 & \quad 4 & 0 \end{bmatrix} ;$$

(4)

$$\begin{aligned} &\begin{bmatrix} a &  &  &  &  &  & b \\& a &  &  &  &  & b \\&  & \ddots &  &  & \ddots &  \\&  &  & a & b &  &  \\&  &  & b & a &  &  \\&  & \ddots &  &  & \ddots &  \\&b &  &  &  &  & a \\&\end{bmatrix}_{n  行 } \begin{bmatrix}\\ & 行 \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  \\&  &  \\&  \\&  \\&  \\&  \\&  \\&  &  \\&  \\&  \\&  \\&  \\&  \\&  \\&  &  \\&  \\&  &  \\&  \\&  \\&  \\&  \\&  &  \\&  \\&  &  \\&  \\&  \\&  &  \\&  \\ &  &  \\ &  \\ &  \\ &  &  \\ &  \\ &  &  \\ &  \\ &  \\ &  &  \\ &  \\ &  &  \\ &  &  \\ &  \\ &  \\ &  &  \\ &  &  \\ &  &  \\ &  \\ &  &  \\ &  \\ &  &  &  \\ &  &  \\ &  \\ &  &  \\ &  &  \\ &  &  \\ &  \\ &  &  &  &  \\ &  \\ &  \\ &  &  &  &  \\ &  &  \\ &  &  \\ &  \\ &  &  \\ &  &  &  &  &  \\ \\ &  &  &  &  \\ &  &  \\ &  &  &  \\ &  &  &  &  &  \\ \\ &  &  &  &  &  &  &  \\ \\ &  &  &  &  \\ \\ &  &  &  &  &  &  &  &  &  \\ \\ &  &  &  &  &  &  &  \\ \\ &  &  &  &  &  &  &  &  &  &  &  \\ \\ \\ &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  \\ \\ \\ \\ &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  &  & \end{bmatrix} \end{aligned}$$

2. 设A，B均为n阶可逆矩阵，证明 $\left[ \begin{matrix} { O } & { A } \\ { B } & { O } \\ \end{matrix} \right]$ 可逆，并求其逆矩阵

3. 设A和B都是可逆矩阵，求 $\left[ \begin{matrix} { C } & { A } \\ { B } & { O } \\ \end{matrix} \right]$ 的逆矩阵.

4. 求下列矩阵的逆矩阵:

(1)

$$\begin{pmatrix}1 & 3 & 0 & 0 & 0 \\2 & 8 & 0 & 0 & 0 \\0 & 0 & 1 & 0 & 1 \\0 & 0 & 2 & 3 & 2 \\0 & 0 & 3 & 1 & 1\end{pmatrix};$$

(2)

$$\begin{pmatrix}1 & 3 & 0 & 0 & 0 \\2 & 8 & 0 & 0 & 0 \\1 & 0 & 1 & 0 & 1 \\0 & 1 & 2 & 3 & 2 \\2 & 3 & 3 & 1 & 1\end{pmatrix};$$

(3)

$$\begin{pmatrix}0 & 0 & 0 & 4 & 4 \\0 & 0 & 0 & 7 & 8 \\1 & 1 & 1 & 0 & 0 \\0 & 1 & 1 & 0 & 0 \\0 & 0 & 1 & 0 & 0\end{pmatrix}.$$

5. 设 $A = (B \quad C)$ 是 $m \times m$ 矩阵，B是 $n \times s$ 子矩阵，且 $B^{\mathrm{T}}C = 0$ .证明: $\det\left( \boldsymbol{A}^{\mathrm{T}} \boldsymbol{A} \right) =$ $\det( \boldsymbol{B}^{\mathrm{T}} \boldsymbol{B} ) \det( \boldsymbol{C}^{\mathrm{T}} \boldsymbol{C} )$

## 2.4 克拉默法则

在本章2.2中，我们不仅介绍了行列式的性质，而且还得到了矩阵A可逆的充分必要条件为 $\det A \neq 0$ .这里，我们进一步利用行列式给出逆矩阵的表达式，并给出解线性方程组的克拉默(Cramer)法则.

[page:67]

引理1 设 $\boldsymbol{A} = (a_{ij})_{n \times n}, \boldsymbol{A}_{ij}$ 表示 $a_{ij}$ 的代数余子式，则

$$\sum_{k = 1}^{n}a_{ik}A_{jk} = a_{i1}A_{j1} + a_{i2}A_{j2} + \cdots + a_{in}A_{jn} = 0 \quad (i \neq j, i, j = 1, \cdots, n).$$

证 行列式按第j行展开得

$$\det A = \sum_{k = 1}^{n} a_{jk}A_{jk}$$

所以将行列式中第j行的元 $a_{j1}, a_{j2}, \cdots, a_{jn}$ 换成 $a_{i1}, a_{i2}, \cdots, a_{in}$ 后所得的行列式，其展开式为 $\sum_{k = 1}^{n}a_{ik}A_{jk}$ ，即

$$\sum_{k = 1}^{n}a_{ik}A_{jk} =\begin{vmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\\vdots & \vdots & & \vdots \\a_{i1} & a_{i2} & \cdots & a_{in} \\\vdots & \vdots & & \vdots \\a_{i1} & a_{i2} & \cdots & a_{in} \\\vdots & \vdots & & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn}\end{vmatrix} 第 \ i\  行 = 0.$$

引理1说明:行列式的任一行(列)的元乘以另一行(列)对应元的代数余子式之和等于零.

引理2设A为η阶矩阵，则

$$AA^{*} = A^{*}A = (\det A)I,$$

其中

$$\boldsymbol{A}^{*} = \begin{pmatrix}\boldsymbol{A}_{11} & \boldsymbol{A}_{21} & \cdots & \boldsymbol{A}_{n1} \\\boldsymbol{A}_{12} & \boldsymbol{A}_{22} & \cdots & \boldsymbol{A}_{n2} \\\vdots & \vdots & & \vdots \\\boldsymbol{A}_{1n} & \boldsymbol{A}_{2n} & \cdots & \boldsymbol{A}_{nn}\end{pmatrix}$$

称为A 的伴随矩阵 $(A_{ij}$ 是 det A 中元 $a _ { i j }$ 的代数余子式）.

证由引理1可得

$$\begin{aligned}\boldsymbol{A} \boldsymbol{A}^{\star} &=\begin{bmatrix}a_{11} & a_{12} & \cdots & a_{1 n} \\a_{21} & a_{22} & \cdots & a_{2 n} \\\vdots & \vdots & & \vdots \\a_{n 1} & a_{n 2} & \cdots & a_{n n}\end{bmatrix}\begin{bmatrix}A_{11} & A_{21} & \cdots & A_{n 1} \\A_{12} & A_{22} & \cdots & A_{n 2} \\\vdots & \vdots & & \vdots \\A_{1 n} & A_{2 n} & \cdots & A_{n n}\end{bmatrix}\\&=\begin{bmatrix}\det \boldsymbol{A} & & & \\& \det \boldsymbol{A} & & \\& & \ddots & \\& & & \det \boldsymbol{A}\end{bmatrix}= (\det \boldsymbol{A}) \boldsymbol{I},\end{aligned}$$

[page:68]

同理，由行列式按列展开定理，可得

$$A^{*} A = (\det A)I.$$

前面我们得到A可逆的充分必要条件为 $\det A \neq 0$ 当A可逆时，借助于 $A^{*}$ 和行列式可以得到 $A^{-1}$ 的简明表达式.

定理1 设A可逆，则

$$A^{-1} = \frac{1}{\det A}A^*$$

证由引理2，

$$A A ^ { * } = A ^ { * } A = ( \det A ) I ,$$

因A 可逆，故 det $A \neq 0$ ，于是

$$A \left( \frac{1}{\det A} A^* \right) = I,$$

故

$$A^{-1} = \frac{1}{\det A}A^*$$

例1 矩阵

$$\boldsymbol{A} = \begin{pmatrix}1 & 2 & 3 \\2 & 2 & 1 \\3 & 4 & 3\end{pmatrix}, \quad\boldsymbol{B} = \begin{pmatrix}2 & 3 & -1 \\-1 & 3 & -3 \\1 & 15 & -11\end{pmatrix}$$

是否可逆？若可逆，求 $A^{-1},B^{-1}$

解因 $\det A = 2, \det B = 0$ ，所以A可逆，B不可逆.下面来求 $A^{-1}$

$$A_{11} = (-1)^{1+1} \left| \begin{matrix} 2 & 1 \\ 4 & 3 \end{matrix} \right| = 2, \quad A_{21} = (-1)^{2+1} \left| \begin{matrix} 2 & 3 \\ 4 & 3 \end{matrix} \right| = 6,$$

$$A_{31} = (-1)^{3+1} \begin{vmatrix} 2 & 3 \\ 2 & 1 \end{vmatrix} = -4, \quad A_{12} = (-1)^{1+2} \begin{vmatrix} 2 & 1 \\ 3 & 3 \end{vmatrix} = -3,$$

$$A_{22} = (-1)^{2+2} \begin{vmatrix} 1 & 3 \\ 3 & 3 \end{vmatrix} = -6, \quad A_{32} = (-1)^{3+2} \begin{vmatrix} 1 & 3 \\ 2 & 1 \end{vmatrix} = 5,$$

$$A_{13} = (-1)^{1+3} \left| \begin{matrix} 2 & 2 \\ 3 & 4 \end{matrix} \right| = 2, \quad A_{23} = (-1)^{2+3} \left| \begin{matrix} 1 & 2 \\ 3 & 4 \end{matrix} \right| = 2,$$

$$A_{33} = (-1)^{3+3} \begin{vmatrix} 1 & 2 \\ 2 & 2 \end{vmatrix} = -2.$$

故

[page:69]

$$\boldsymbol{A}^{-1} = \frac{1}{\det \boldsymbol{A}} \boldsymbol{A}^* = \frac{1}{2} \begin{pmatrix} 2 & 6 & -4 \\ -3 & -6 & 5 \\ 2 & 2 & -2 \end{pmatrix} = \begin{pmatrix} 1 & 3 & -2 \\ -\frac{3}{2} & -3 & \frac{5}{2} \\ 1 & 1 & -1 \end{pmatrix}.$$

定理1给出了 $A^{=1}$ 的简明表达式，但是由例1可以看出，用这个公式来求逆矩阵，计算量一般非常大.实际应用中求逆矩阵，一般采用第一章介绍的行初等变换法，而且该方法程序固定，适宜于计算机上计算大型方阵的逆矩阵.

例2 设 $\boldsymbol{A} = \begin{pmatrix}1 & 1 & 1 \\1 & 2 & 1 \\1 & 1 & 3\end{pmatrix}$ ,求 $(A^{\cdot})^{-1}$

解 因 $\det A = 2 \ne 0$ ，于是由 $AA^{*} = (\det A)I$ 得

$$\left( \frac{1}{\det A} A \right) A^* = I,$$

故 $A^{*}$ 可逆且

$$\left( \boldsymbol{A}^{*} \right)^{-1} = \frac{1}{\det \boldsymbol{A}} \boldsymbol{A} = \frac{1}{2} \begin{vmatrix} 1 & 1 & 1 \\ 1 & 2 & 1 \\ 1 & 1 & 3 \end{vmatrix} = \begin{vmatrix} \dfrac{1}{2} & \dfrac{1}{2} & \dfrac{1}{2} \\ \dfrac{1}{2} & 1 & \dfrac{1}{2} \\ \dfrac{1}{2} & \dfrac{1}{2} & \dfrac{3}{2} \end{vmatrix}.$$

例3 设A是三阶矩阵，且 $\det A = \frac{1}{3}$ ,求 $\det((2A)^{-1}-3A^{*})$

解因为 $\left( 2 \boldsymbol { A } \right) ^ { - 1 } = \frac { 1 } { 2 } \boldsymbol { A } ^ { - 1 } , \boldsymbol { A } ^ { * } = \left( \det \boldsymbol { A } \right) \boldsymbol { A } ^ { - 1 } = \frac { 1 } { 3 } \boldsymbol { A } ^ { - 1 }$ ,所以

$$\begin{aligned}\det\left( (2\boldsymbol{A})^{-1} - 3\boldsymbol{A}^{*} \right) = \det\left( \frac{1}{2}\boldsymbol{A}^{-1} - \boldsymbol{A}^{-1} \right) = \det\left( -\frac{1}{2}\boldsymbol{A}^{-1} \right) \\= \left( -\frac{1}{2} \right)^{3}\det\left( \boldsymbol{A}^{-1} \right) = -\frac{1}{8}\frac{1}{\det\boldsymbol{A}} = -\frac{3}{8}.\end{aligned}$$

典型例题讲解与伴随矩阵相关的行列式计算

例4设A可逆，且 $A^{*}B = A^{- 1} + B$ ，证明B可逆，当

$$\boldsymbol{A} = \begin{pmatrix}2 & 6 & 0 \\0 & 2 & 6 \\0 & 0 & 2\end{pmatrix}$$

时，求B.

解由已知有

$$(A^{*} - I)B = A^{-1}.$$

于是由 $\left| \boldsymbol{A}^{*} - \boldsymbol{I} \right| \left| \boldsymbol{B} \right| = \left| \boldsymbol{A}^{-1} \right| \neq 0$ 知B 和 $A ^ { * } - I$ 可逆，再由上式得

[page:70]

$$\boldsymbol{B}=\left(\boldsymbol{A}^{*}-\boldsymbol{I}\right)^{-1}\boldsymbol{A}^{-1}=\left[\boldsymbol{A}\left(\boldsymbol{A}^{*}-\boldsymbol{I}\right)\right]^{-1}=\left(\left|\boldsymbol{A}\right|\boldsymbol{I}-\boldsymbol{A}\right)^{-1},$$

很容易计算得

$$\left| \boldsymbol{A} \right| \boldsymbol{I} - \boldsymbol{A} = 6 \left| \begin{aligned} 1 & \quad -1 & \quad 0 \\ 0 & \quad 1 & \quad -1 \\ 0 & \quad 0 & \quad 1 \end{aligned} \right| .$$

于是，求出上述矩阵的逆矩阵便得 $\boldsymbol{B} = \frac{1}{6} \begin{pmatrix}1 & 1 & 1 \\0 & 1 & 1 \\0 & 0 & 1\end{pmatrix}$

定理2(克拉默法则)设n阶矩阵A可逆，则线性方程组AX=b有惟一解X= $(x_{1},x_{2},\cdots,x_{n})^{\mathrm{T}}$ ,其中

$$x_{j} = \frac{\det A_{j}}{\det A} \quad (j = 1, 2, \cdots, n),$$

det $A_{j}$ 是用 b 代替 det A 中的第 $j$ 列得到的行列式.

证关于解的惟一性，在§1.3定理3的推论中已给出充分必要条件，下面证明解的表示式.由于

$$\begin{pmatrix}x_{1} \\x_{2} \\\vdots \\x_{n}\end{pmatrix}= \boldsymbol{X} = \boldsymbol{A}^{-1} \boldsymbol{b} = \frac{1}{\det \boldsymbol{A}} \boldsymbol{A}^{*} \boldsymbol{b} = \frac{1}{\det \boldsymbol{A}}\begin{vmatrix}A_{11} & A_{21} & \cdots & A_{n1} \\A_{12} & A_{22} & \cdots & A_{n2} \\\vdots & \vdots & & \vdots \\A_{1n} & A_{2n} & \cdots & A_{nn}\end{vmatrix}\begin{vmatrix}b_{1} \\b_{2} \\\vdots \\b_{n}\end{vmatrix},$$

比较两端对应元得

$$x_{j} = \frac{1}{\det A}(b_{1}A_{1j} + b_{2}A_{2j} + \cdots + b_{n}A_{nj}) = \frac{\det A_{j}}{\det A}.$$

克拉默法则给了我们一个用行列式写出 $n \times n$ 线性方程组解的简便方法，具有重要的理论价值.然而，为了求出解，我们需计算n+1个n阶行列式.一般其计算量要比用高斯消元法多得多.

例5已知三次曲线 $y=a_{1}+a_{2}x+a_{3}x^{2}+a_{4}x^{3}$ 过四点 $(x_{1},y_{1}),(x_{2},y_{2}),(x_{3}$ $y_{3}),(x_{4},y_{4})$ ,其中 $x_{1},x_{2},x_{3},x_{4}$ 互不相同，试求系数 $a_{1},a_{2},a_{3},a_{4}$

解将四个点的坐标分别代入三次曲线的方程，得关于 $a_{1},a_{2},a_{3},a_{4}$ 的方程组

$$\begin{cases}a_{1} + a_{2}x_{1} + a_{3}x_{1}^{2} + a_{4}x_{1}^{3} = y_{1}, \\a_{1} + a_{2}x_{2} + a_{3}x_{2}^{2} + a_{4}x_{2}^{3} = y_{2}, \\a_{1} + a_{2}x_{3} + a_{3}x_{3}^{2} + a_{4}x_{3}^{3} = y_{3}, \\a_{1} + a_{2}x_{4} + a_{3}x_{4}^{2} + a_{4}x_{4}^{3} = y_{4},\end{cases}$$

系数行列式

[page:71]

$$\det \boldsymbol{A} = \begin{vmatrix} 1 & x_{1} & x_{1}^{2} & x_{1}^{3} \\ 1 & x_{2} & x_{2}^{2} & x_{2}^{3} \\ 1 & x_{3} & x_{3}^{2} & x_{3}^{3} \\ 1 & x_{4} & x_{4}^{2} & x_{4}^{3} \end{vmatrix} = \prod_{1 \leqslant j < i \leqslant 4} \left( x_{i} - x_{j} \right) \neq 0,$$

由克拉默法则，有惟一解

$$a_{j} = \frac{\det A_{j}}{\det A} \quad (j = 1,2,3,4),$$

其中 $\det A_{j}$ 是以 $y _ { 1 } , y _ { 2 } , y _ { 3 } , y _ { 4 }$ 替代 detA 中第j 列元所得行列式.

## 题2.4

1. 试用伴随矩阵求下列矩阵的逆矩阵:

$$\left[ \begin{matrix} { a } & { b } \\ { c } & { d } \\ \end{matrix} \right]$$

$$ad - bc \ne 0$$

$$\begin{pmatrix}1 & 0 & 0 \\1 & 1 & 0 \\1 & 1 & 1\end{pmatrix};$$

$$2 \left| \begin{matrix} { 3 } & { - 4 } & { 5 } \\ { 2 } & { - 3 } & { 1 } \\ { 3 } & { - 5 } & { - 1 } \\ \end{matrix} \right| .$$

2. 设A是n阶矩阵，证明:

(1) $\left( k \tilde { A } \right) ^ { * } = k ^ { n - 1 } \tilde { A } ^ { * } ;$ (2) $\det(\boldsymbol{A}^{*}) = (\det \boldsymbol{A})^{n - 1}$ (3) $\left( \boldsymbol{A}^{\mathrm{T}} \right)^{*} = \left( \boldsymbol{A}^{*} \right)^{\mathrm{T}}$

3. 设A是可逆矩阵，证明: $\left( \boldsymbol{A}^{*} \right)^{-1} = \left( \boldsymbol{A}^{-1} \right)^{*}$

4. 设A 是 n阶非零实矩阵，且 $A^{\cdot} = A^{\top}$ ，证明:A是可逆矩阵.

5. 设A为4阶矩阵， $|A| = a \neq 0$ ,计算 $\det( \mid \boldsymbol{A}^{*} \mid \boldsymbol{A} )$

6.λ为何值时，方程组 $\begin{cases}\lambda x_{1} + x_{2} = 0, \\x_{1} + \lambda x_{2} = 0\end{cases}$ 有非零解?

7. 用克拉默法则解方程组 $\begin{cases}x + y + z = a + b + c, \\ax + by + cz = a^{2} + b^{2} + c^{2}, \\bx + cay + abz = 3abc,\end{cases}$ ,式中 $a , b , c$ 两两互异.

## 2.5矩阵的秩

## 一、矩阵秩的概念

矩阵的秩是矩阵的一个重要数值特征，是线性代数中的一个重要概念.为了建立矩阵的秩的概念，先给出矩阵的子式的定义

定义1在 $m \times n$ 矩阵A中，位于任意取定的k行和k列 $(1 \leqslant k \leqslant \min\{m,n\})$ 交叉点上的 $k ^ { 2 }$ 个元，按原来的相对位置组成的k阶行列式，称为A的一个k阶子式.

例如，在矩阵

[page:72]

$$\boldsymbol{A} = \begin{vmatrix} 3 & 2 & -1 & -3 \\ 2 & -1 & 3 & 1 \\ 4 & 5 & -5 & -6 \end{vmatrix}$$

中，取第1,2行和第2，4列交叉点上的元，组成的二阶行列式

$$\left[ \begin{matrix} { 2 } & { - 3 } \\ { - 1 } & { 1 } \\ \end{matrix} \right]$$

为A的一个二阶子式.

有了子式的概念，就可以定义矩阵的秩

定义2设在矩阵A中有一个不等于零的r阶子式D，且没有不等于零的 $r + 1$阶子式，那么D称为A的最高阶非零子式，数r称为矩阵A的秩，记作R(A).并规定零矩阵的秩等于零.

由行列式的性质可知，A中所有r+1阶子式全等于零时，所有高于r+1阶的子式也全等于零，因此A的秩R(A)就是A中不等于零的子式的最高阶数.

显然，对任意矩阵 $A,R(A)$ 是惟一的，但其最高阶非零子式一般是不惟一的.

定义2实际上包含两部分:一部分是， $R(A) \geq r$ 的充分必要条件是A有一个r阶子式不为零；另一部分是， $R(A) \leq r$ 的充分必要条件是A的所有r+1阶子式全为零.

例1 求矩阵 $\boldsymbol{A} = \begin{vmatrix} 3 & 1 & 0 & 2 \\ 1 & -1 & 2 & -1 \\ 1 & 3 & -4 & 4 \end{vmatrix}$ 的秩.

解A有12个一阶子式.例如，由第2行、第2列交点上的元构成的一阶子式

$$\det(-1)=-1\ne 0.$$

再看一下A的二阶子式，可以知道A有

$$C_{3}^{2} \cdot C_{4}^{2} = 3 \times 6 = 18$$

个二阶子式，其中由第1,2行和第1，2列交叉点上的元构成的二阶子式

$$\begin{vmatrix} 3 & 1 \\ 1 & - 1 \end{vmatrix} = - 4 \ne 0.$$

最后，再考查一下A的三阶子式，A有4个三阶子式，分别计算有

$$\begin{vmatrix} 3 & 1 & 0 \\ 1 & - 1 & 2 \\ 1 & 3 & - 4 \end{vmatrix} = 0 , \quad \begin{vmatrix} 3 & 1 & 2 \\ 1 & - 1 & - 1 \\ 1 & 3 & 4 \end{vmatrix} = 0 ,$$

$$\begin{vmatrix} 3 & 0 & 2 \\ 1 & 2 & - 1 \\ 1 & - 4 & 4 \end{vmatrix} = 0 , \quad \begin{vmatrix} 1 & 0 & 2 \\ - 1 & 2 & - 1 \\ 3 & - 4 & 4 \end{vmatrix} = 0 .$$

故由定义， $R(A)=2$

[page:73]

从该例可看出，根据定义求秩是很困难的，下面给出求矩阵秩的初等变换法

## 二、矩阵秩的计算

定理1初等变换不改变矩阵的秩.

证只就行初等变换加以证明，列初等变换的情形同理可证.

对于行初等变换中的第一种和第二种变换，由于变换后矩阵中的每一个子式均能在原来的矩阵中找到相应的子式，它们之间或只是行的次序不同，或只是某一行扩大了k倍，因此相应子式或同为零，或同为非零，所以矩阵的秩不变.

对于第三种行初等变换，设

$$\boldsymbol{A} = \begin{bmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & & \vdots \\a_{m1} & a_{m2} & \cdots & a_{mn}\end{bmatrix},$$

不妨考虑把A的第2行的k倍加至第1行上，得

$$\boldsymbol{B} = \begin{bmatrix}a_{11} + ka_{21} & a_{12} + ka_{22} & \cdots & a_{1n} + ka_{2n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & & \vdots \\a_{m1} & a_{m2} & \cdots & a_{mn}\end{bmatrix},$$

设 $R(B) = t$ ，即B中有t阶子式 $B_{i}$ 不为零.若 $B_{i}$ 不包含第1行的 $元$ ，则在A中能找到与 $B_{p}$ 完全相同的t阶子式，因此 $R(A) \geq t$ ;若 $B_{t}$ 包含第1行的元，即

$$0 \ne B_{i} = \begin{bmatrix} a_{1j_{1}} + ka_{2j_{1}} & \cdots & a_{1j_{t}} + ka_{2j_{t}} \\ \vdots & & \vdots \\ a_{i_{t}j_{1}} & \cdots & a_{i_{t}j_{t}} \end{bmatrix},$$

则由行列式的性质知

$$0 { \neq } B _ { \ell } = \left| \begin{matrix} { a _ { 1 j _ { 1 } } } & { \cdots } & { a _ { 1 j _ { \ell } } } \\ { \vdots } & { } & { \vdots } \\ { a _ { i _ { \ell } j _ { 1 } } } & { \cdots } & { a _ { i _ { \ell } j _ { \ell } } } \\ \end{matrix} \right| + k \left| \begin{matrix} { a _ { 2 j _ { 1 } } } & { \cdots } & { a _ { 2 j _ { \ell } } } \\ { \vdots } & { } & { \vdots } \\ { a _ { i _ { \ell } j _ { 1 } } } & { \cdots } & { a _ { i _ { \ell } j _ { \ell } } } \\ \end{matrix} \right| ,$$

若 $B_{t}$ 不包含第2行元，则上面两个行列式中至少有一个非零；若B，包含第2行元，则右端第一个行列式非零，而以上两种情况的非零行列式均为A中的t阶子式，所以1 $R(A) \geq t$

总之，归纳以上得到的结论:若由矩阵A经第三种行初等变换得到矩阵B，则$R\left ( B \right ) \le R\left ( A \right )$ .但事实上，我们又能从B出发经行初等变换得到A(即只要把B的第2行的(一k)倍加到第1行)，因此根据上面的结论又有 $R\left ( A \right ) \le R\left ( B \right )$ .故

$$R\left ( A \right ) = R\left ( B \right )$$

[page:74]

例2 求矩阵

$$\boldsymbol{A} = \begin{pmatrix}1 & -1 & 2 & 1 & 0 \\2 & -2 & 4 & 2 & 0 \\3 & 0 & 6 & -1 & 1 \\0 & 3 & 0 & 0 & 1\end{pmatrix}$$

的秩.

解 对A作行初等变换

$$\begin{aligned}\boldsymbol{A} &=\begin{vmatrix}1 & -1 & 2 & 1 & 0 \\2 & -2 & 4 & 2 & 0 \\3 & 0 & 6 & -1 & 1 \\0 & 3 & 0 & 0 & 1\end{vmatrix}\xrightarrow{}\begin{vmatrix}1 & -1 & 2 & 1 & 0 \\0 & 0 & 0 & 0 & 0 \\0 & 3 & 0 & -4 & 1 \\0 & 3 & 0 & 0 & 1\end{vmatrix}\\&\xrightarrow{}\begin{vmatrix}1 & -1 & 2 & 1 & 0 \\0 & 3 & 0 & 0 & 1 \\0 & 0 & 0 & -4 & 0 \\0 & 0 & 0 & 0 & 0\end{vmatrix}= \boldsymbol{B}  ,\end{aligned}$$

B中有三阶子式

$$\begin{vmatrix} 1 & - 1 & 1 \\ 0 & 3 & 0 \\ 0 & 0 & - 4 \end{vmatrix} = - 12 \neq 0,$$

显然B中所有四阶子式全为零，所以R(B)=3.故

$$R\left ( A \right ) = R\left ( B \right ) = 3.$$

事实上，将矩阵A用行初等变换化为行阶梯形矩阵，则行阶梯形矩阵非零行的行数就是A的秩，即:设A为m×n矩阵，则R(A)=r的充分必要条件是通过行初等变换能将A化为具有r个非零行的行阶梯形矩阵.

例3设

典型例题讲解利用矩阵的秩确定参数

$$\boldsymbol{A} = \begin{bmatrix} 1 & 2 & 1 \\ 2 & 2 & - 2 \\ - 1 & t & 5 \\ 1 & 0 & - 3 \end{bmatrix},$$

已知 $R(A)=2$ ,求t.

解 对A作行初等变换得

$$\boldsymbol{A} \rightarrow \begin{bmatrix} 1 & 2 & 1 \\ 0 & - 2 & - 4 \\ 0 & 2 + t & 6 \\ 0 & 0 & 0 \end{bmatrix} = \boldsymbol{B}.$$

[page:75]

由 $R\left ( A \right ) = R\left ( B \right ) = 2$ ，知B中第2行、第3行成比例.于是由 $\frac{-2}{2+t}=\frac{-4}{6}$ 得 $t = 1$

推论设A为 $m \times n$ 矩阵，则

$$R\left(PA\right)=R\left(AQ\right)=R\left(PAQ\right)=R\left(A\right),$$

其中P,Q分别为m阶和n阶可逆矩阵.

证因为P可逆，所以存在有限个初等矩阵 $E_{1},E_{2},\cdots,E_{k}$ ,使得 $P = E_{k} \cdots E_{2}E_{1}$从而

$$PA = E_{k} \cdots E_{2}E_{1}A$$

即 PA 为对A施以 $E_{1},E_{2},\cdots,E_{k}$ 相对应的行初等变换所得矩阵，于是由定理1，

$$R \left( P A \right) = R \left( A \right) ,$$

同理可证 $R\left(AQ\right)=R\left(PAQ\right)=R\left(A\right)$

例4设

$$\boldsymbol{A} = \begin{bmatrix} 3 & 4 & 1 \\ 0 & 2 & 0 \\ 5 & 1 & 3 \end{bmatrix}, \quad \boldsymbol{B} = \begin{bmatrix} 2 & -1 & 3 \\ 0 & 3 & 1 \\ 0 & 0 & 0 \end{bmatrix},$$

求R(AB).

解因为 $\vert A \vert \neq 0$ ，所以A可逆.显然 $R(B)=2$ 故 $R\left ( AB \right ) = R\left ( B \right ) = 2$

## 三、矩阵秩的性质

关于矩阵的秩，有如下性质:

定理2(1）设A为n阶矩阵，则A可逆的充分必要条件是R $(A) = n$

(2)对任意矩阵 $\hat { A } , R \left( A \right) = R \left( A ^ { \mathrm { T } } \right)$

(3) 设A 为 $m \times n$ 矩阵，则 $0 \leqslant R\left( A \right) \leqslant \min\left\{ m,n \right\}$

(4)对任意矩阵 $A,R\left ( kA \right ) =\left \{ \begin{aligned} 0, \quad k=0, \\ R\left ( A \right ) , \quad k\neq 0. \end{aligned} \right.$

证(3)和(4)是显然的.我们证明(1)和(2).

(1)若A可逆，则 $\det A \neq 0$ ，因此由定义2知 $R(A) = n$

反之，若 $R(A) = n$ ，由定义2易知 $\det A \neq 0$ ，故A可逆.

(2)A的任一子式的转置就是 $\hat { A } ^ { \mathrm { ~ T ~ } }$ 的子式；反之 $, \vec{A}^{\mathrm{T}}$ 的任一子式的转置就是A的子式.根据行列式的性质，A中不为零的最高阶子式就是 $A^{\mathrm{T}}$ 中不为零的最高阶子式，反之亦然.故

$$R\left(A\right)=R\left(A^{\mathrm{T}}\right).$$

由定理2的(1)知，对于n阶矩阵A，detA=0的充分必要条件是 $R(A) < n$ .因而，可逆矩阵又称为满秩矩阵，不可逆矩阵又称为降秩矩阵或退化矩阵.

例5设A为n阶矩阵 $( n \geqslant 2 )$ ，证明:

[page:76]

$$R\left(A^{*}\right)=\left\{\begin{aligned}n, \quad R\left(A\right)=n, \\0, \quad R\left(A\right)<n-1.\end{aligned}\right.$$

证若 $R(A)=n$ ,即 $\det A \neq 0$ ,由 $AA^{*} = (\det A)I$ 有

$$\left( \det \boldsymbol{A} \right) \left( \det \boldsymbol{A}^{*} \right) = \det \left( \boldsymbol{A} \boldsymbol{A}^{*} \right) = \det \left( \left( \det \boldsymbol{A} \right) \boldsymbol{I} \right) = \left( \det \boldsymbol{A} \right)^{n} \neq 0,$$

故 $\mathrm{det} \boldsymbol{A}^* \neq 0$ ,即 $R\left(A^{*}\right)=n$

若 $R\left ( A \right ) < n - 1$ ，则A中最高阶非零子式的阶数小于n—1，因而A中任意 $n - 1$阶子式均为零，所以

$$\boldsymbol{A}^{*} = \begin{vmatrix}\boldsymbol{A}_{11} & \boldsymbol{A}_{21} & \cdots & \boldsymbol{A}_{n1} \\\boldsymbol{A}_{12} & \boldsymbol{A}_{22} & \cdots & \boldsymbol{A}_{n2} \\\vdots & \vdots & & \vdots \\\boldsymbol{A}_{1n} & \boldsymbol{A}_{2n} & \cdots & \boldsymbol{A}_{nn}\end{vmatrix} = \boldsymbol{O},$$

即 $R\left(A^{*}\right) \equiv 0$

对于例5中 $R\left ( A \right ) = n - 1$ 的情形，在§ 4.4的例5 中给出.

定理3 对任意矩阵 $A_{m \times n}$ ，都存在可逆矩阵 $P_{m \times m}, Q_{n \times n}$ ,使得

$$PAQ = \begin{bmatrix} I, & O \\ O & O \end{bmatrix}_{m \times n}, \quad R(A) = r,$$

其中 $\begin{pmatrix} I_r & O \\ O & O \end{pmatrix}_{m \times n}$ 称为A的标准形.即任何矩阵A都等价于其标准形. n

证对任意的 $A_{m \times n}$ ，总可经有限次行初等变换化为简化行阶梯形矩阵，然后通过有限次列初等变换便可得到

$$\left[ \begin{matrix} { I _ { r } } & { O } \\ { O } & { O } \\ \end{matrix} \right] .$$

又由于行阶梯形矩阵非零行的行数r即A的秩，因而 $R(A) = r$ .故存在初等矩阵$E_{1},E_{2},\cdots,E_{s};\widetilde{E}_{1},\widetilde{E}_{2},\cdots,\widetilde{E}_{l}$ ，使得

$$\boldsymbol{E}_{s} \cdots \boldsymbol{E}_{2} \boldsymbol{E}_{1} \boldsymbol{A} \boldsymbol{E}_{1} \boldsymbol{E}_{2} \cdots \boldsymbol{E}_{t} = \begin{bmatrix} \boldsymbol{I}_{r} & \boldsymbol{O} \\ \boldsymbol{O} & \boldsymbol{O} \end{bmatrix}.$$

$\boldsymbol{P}=\boldsymbol{E}, \cdots \boldsymbol{E}_{2} \boldsymbol{E}_{1}, \boldsymbol{Q}=\widetilde{\boldsymbol{E}}_{1} \widetilde{\boldsymbol{E}}_{2} \cdots \widetilde{\boldsymbol{E}}_{l}$ ，则 $P , Q$ 可逆且

$$PAQ = \begin{bmatrix} I_{r} & O \\ O & O \end{bmatrix}.$$

定理3也说明，对任意矩阵A，存在可逆的矩阵K，S，使

[page:77]

$$\boldsymbol{A} = \boldsymbol{K} \begin{bmatrix} \boldsymbol{I}_{r} & \boldsymbol{O} \\ \boldsymbol{O} & \boldsymbol{O} \end{bmatrix} \boldsymbol{S}, \quad \boldsymbol{R}(\boldsymbol{A}) = r.$$

推论 同型矩阵A与B等价的充分必要条件是 $R\left(A\right)=R\left(B\right)$

例6设 $\boldsymbol{A} = \begin{pmatrix}1 & - 2 & 1 \\- 1 & 1 & 1 \\1 & - 3 & 3\end{pmatrix}$ ，求A的标准形.

解

$$\begin{aligned}A = & \begin{bmatrix} \quad 1 & - 2 & 1 \\ - 1 & \quad 1 & 1 \\ \quad 1 & - 3 & 3 \end{bmatrix} \rightarrow \begin{bmatrix} \quad 0 & - 1 & 2 \\ - 1 & \quad 1 & 1 \\ \quad 0 & - 2 & 4 \end{bmatrix} \rightarrow \begin{bmatrix} \quad 0 & - 1 & 2 \\ - 1 & \quad 1 & 1 \\ \quad 0 & \quad 0 & 0 \end{bmatrix} \\\rightarrow & \begin{bmatrix} - 1 & \quad 1 & 1 \\ \quad 0 & - 1 & 2 \\ \quad 0 & \quad 0 & 0 \end{bmatrix},\end{aligned}$$

所以 $R(A)=2$ ，故A的标准形必为

$$\begin{pmatrix}I_{2} & O \\O & O\end{pmatrix}=\begin{pmatrix}1 & 0 & 0 \\0 & 1 & 0 \\0 & 0 & 0\end{pmatrix}.$$

例7证明 $R\left[\begin{bmatrix}A&O\\O&B\end{bmatrix}\right]=R\left(A\right)+R\left(B\right)$

证设 $R\left ( A \right ) = r_{1} ,R\left ( B \right ) = r_{2}$ .由定理3，存在可逆矩阵 $P_{1},P_{2},Q_{1},Q_{2}$ ,使得

$$\boldsymbol { A } = \boldsymbol { P } _ { 1 } \begin{pmatrix} \boldsymbol { I } _ { r _ { 1 } } & \boldsymbol { O } \\ \boldsymbol { O } & \boldsymbol { O } \end{pmatrix} \boldsymbol { Q } _ { 1 } , \quad \boldsymbol { B } = \boldsymbol { P } _ { 2 } \begin{pmatrix} \boldsymbol { I } _ { r _ { 2 } } & \boldsymbol { O } \\ \boldsymbol { O } & \boldsymbol { O } \end{pmatrix} \boldsymbol { Q } _ { 2 } ,$$

于是

$$\begin{bmatrix} \begin{aligned}\begin{bmatrix}\boldsymbol{A} & \boldsymbol{O} \\\boldsymbol{O} & \boldsymbol{B}\end{bmatrix}&=\begin{bmatrix}\boldsymbol{P}_{1}\begin{bmatrix}\boldsymbol{I}_{r_{1}} & \boldsymbol{O} \\\boldsymbol{O} & \boldsymbol{O}\end{bmatrix}\boldsymbol{Q}_{1} & \boldsymbol{O} \\& & \boldsymbol{P}_{z}\begin{bmatrix}\boldsymbol{I}_{r_{2}} & \boldsymbol{O} \\\boldsymbol{O} & \boldsymbol{O}\end{bmatrix}\boldsymbol{Q}_{2} \\& & \\& \boldsymbol{O} &\end{bmatrix}\\&=\begin{bmatrix}\boldsymbol{P}_{1} & \boldsymbol{O} \\\boldsymbol{O} & \boldsymbol{P}_{2}\end{bmatrix}\begin{bmatrix}\begin{bmatrix}\boldsymbol{I}_{r_{1}} & \boldsymbol{O} \\\boldsymbol{O} & \boldsymbol{O}\end{bmatrix} & \boldsymbol{O} \\& & \\\boldsymbol{O} & \begin{bmatrix}\boldsymbol{I}_{r_{2}} & \boldsymbol{O} \\\boldsymbol{O} & \boldsymbol{O}\end{bmatrix}\end{bmatrix}\begin{bmatrix}\boldsymbol{Q}_{1} & \boldsymbol{O} \\\boldsymbol{O} & \boldsymbol{Q}_{2}\end{bmatrix},\end{bmatrix}\end{aligned}$$

由 $\begin{bmatrix} \boldsymbol{P}_{1} & \boldsymbol{O} \\ \boldsymbol{O} & \boldsymbol{P}_{2} \end{bmatrix}, \begin{bmatrix} \boldsymbol{Q}_{1} & \boldsymbol{O} \\ \boldsymbol{O} & \boldsymbol{Q}_{2} \end{bmatrix}$ 可逆，知

[page:78]

$$\boldsymbol{R}\left[\begin{bmatrix}\boldsymbol{A} & \boldsymbol{O} \\\boldsymbol{O} & \boldsymbol{B}\end{bmatrix}\right]=\boldsymbol{R}\left[\begin{bmatrix}\begin{bmatrix}\boldsymbol{I}_{r_1} & \boldsymbol{O} \\\boldsymbol{O} & \boldsymbol{O}\end{bmatrix} & \boldsymbol{O} \\& & \\\boldsymbol{O} & \begin{bmatrix}\boldsymbol{I}_{r_2} & \boldsymbol{O} \\\boldsymbol{O} & \boldsymbol{O}\end{bmatrix}\end{bmatrix}\right]=\boldsymbol{r}_1+\boldsymbol{r}_2.$$

## 题2.5

1. 求下列矩阵的秩:

(1)

$$\begin{bmatrix} 2 & - 3 & 8 & 2 \\ 2 & 12 & - 2 & 12 \\ 1 & 3 & 1 & 4 \end{bmatrix};$$

(2)

$$\begin{pmatrix}4 & -2 & 1 \\1 & 2 & -1 \\-1 & 8 & -7 \\2 & 14 & 13\end{pmatrix};$$

(3)

$$\begin{pmatrix}1 & -1 & 2 & 1 & 0 \\2 & -2 & 4 & -2 & 0 \\3 & 0 & 6 & -1 & 1 \\0 & 3 & 0 & 0 & 1\end{pmatrix} 。$$

2.求下列矩阵的标准形:

(1)

$$\begin{pmatrix}1 & 1 & -1 \\3 & 1 & 0 \\4 & 4 & 1 \\1 & -2 & 1\end{pmatrix};$$

(2)

$$\begin{pmatrix}1 & -1 & 0 & 1 & 2 \\2 & 0 & 1 & 1 & 0 \\3 & 1 & 0 & 0 & 4 \\2 & 2 & 0 & -1 & -2\end{pmatrix}.$$

3. 讨论λ的取值范围，确定 $A = \begin{pmatrix}3 & 1 & 1 & 4 \\\lambda & 4 & 10 & 1 \\1 & 7 & 17 & 3 \\2 & 2 & 4 & 3\end{pmatrix}$ 的秩.

4.在秩为r的矩阵中，有没有等于零的r一1阶子式?有没有等于零的r阶子式?有没有不等于零的r+1阶子式?

5.证明:任何秩为r的矩阵均可表成r个秩为1的矩阵之和.

6.设A,B分别与C,D等价，证明: $\left[ \begin{matrix} { A } & { O } \\ { O } & { B } \\ \end{matrix} \right]$ 与 $\left[ \begin{matrix} { C } & { O } \\ { O } & { D } \\ \end{matrix} \right]$ 等价.

7. 求 $n(n>1)$ 阶矩阵 $\boldsymbol{A} = \begin{pmatrix}a & b & \cdots & b \\b & a & \cdots & b \\\vdots & \vdots & & \vdots \\b & b & \cdots & a\end{pmatrix}$ 的秩.

[page:79]

1. 计算下列行列式:

(1)

$$\left| \begin{array} { c c c c c c }a & 0 & 0 & \cdots & 0 & 1 \\0 & a & 0 & \cdots & 0 & 0 \\0 & 0 & a & \cdots & 0 & 0 \\\vdots & \vdots & \vdots & & \vdots & \vdots \\0 & 0 & 0 & \cdots & a & 0 \\1 & 0 & 0 & \cdots & 0 & a \\\end{array} \right|$$

(n 阶);

(2)

$$\begin{aligned} &\begin{vmatrix}\\ &x & -1 & 0 & \cdots & 0 & 0 \\&0 & x & -1 & \cdots & 0 & 0 \\&0 & 0 & x & \cdots & 0 & 0 \\&\vdots & \vdots & \vdots & & \vdots & \vdots \\&0 & 0 & 0 & \cdots & x & -1 \\&a_{n} & a_{n-1} & a_{n-2} & \cdots & a_{2} & x+a_{1}\\ &\end{vmatrix};\\ \end{aligned}$$

(3)

$$\begin{bmatrix} a & (a - 1)^n & \cdots & (a - n)^n \\ a^{n - 1} & (a - 1)^{n - 1} & \cdots & (a - n)^{n - 1} \\ \vdots & \vdots & & \vdots \\ a & a - 1 & \cdots & a - n \\ 1 & 1 & \cdots & 1 \end{bmatrix};$$

(4)

$$\begin{aligned} &\begin{vmatrix}\\ &a_{1} & x & x & \cdots & x & x \\&x & a_{2} & x & \cdots & x & x \\&x & x & a_{3} & \cdots & x & x \\&\vdots & \vdots & \vdots & & \vdots & \vdots \\&x & x & x & \cdots & a_{n - 1} & x \\&x & x & x & \cdots & x & a_{n}\\ &\end{vmatrix};\\ \end{aligned}$$

(5)

$$\begin{bmatrix} 1+a_{1} & 1 & 1 & \cdots & 1 & 1 \\ 1 & 1+a_{2} & 1 & \cdots & 1 & 1 \\ -1 & 1 & 1+a_{3} & \cdots & 1 & 1 \\ \vdots & \vdots & \vdots & & \vdots & \vdots \\ 1 & 1 & 1 & \cdots & 1 & 1+a_{n} \end{bmatrix} \quad (a_{i} \neq 0, i=1,2,\cdots,n);$$

(6)

$$\left| \begin{array} { c c c c c c }2 & 1 & 0 & \cdots & 0 & 0 \\1 & 2 & 1 & \cdots & 0 & 0 \\0 & 1 & 2 & \cdots & 0 & 0 \\\vdots & \vdots & \vdots & & \vdots & \vdots \\0 & 0 & 0 & \cdots & 2 & 1 \\0 & 0 & 0 & \cdots & 1 & 2 \\\end{array} \right|$$

(n 阶).

[page:80]

2. 求 $\boldsymbol{A} = \begin{pmatrix}3 & 0 & 4 & 0 \\2 & 2 & 2 & 2 \\0 & -7 & 0 & 0 \\5 & 3 & -2 & 2\end{pmatrix}$ 的第4行各元的代数余子式之和.

3. 设A为n阶方阵，存在正整数k，使得 $A^{k} = O$ ,证明:A不可逆.

4. 已知三阶实矩阵A 满足 $a_{ij}=A_{ij}(i=1,2,3;j=1,2,3)$ ,求 det A.

5. 设 $\boldsymbol{A} = (a_{ij})_{n \times n}$ 为非零实矩阵， $a_{ij} = A_{ij} \left( i, j = 1, 2, \cdots, n \right)$ ，证明 $R(A) = n$

6. 设A为n阶可逆方阵，证明: $\left( \boldsymbol{A}^{*} \right)^{*} = \left( \det \boldsymbol{A} \right)^{n - 2} \boldsymbol{A}$

7. 求矩阵

$$\boldsymbol{A} = \begin{pmatrix}0 & \cdots & 0 & a_{1} & 0 \\0 & \cdots & a_{2} & 0 & 0 \\\vdots & & \vdots & \vdots & \vdots \\a_{n - 1} & \cdots & 0 & 0 & 0 \\0 & \cdots & 0 & 0 & a_{n}\end{pmatrix}$$

的秩.

8. 若矩阵A的元均为整数，证明 $:\boldsymbol{A}^{-1}$ 的元均为整数的充要条件是 $\det A = \pm 1$

9. 证明:(1)上三角形矩阵的伴随矩阵仍是上三角形矩阵；

(2)可逆上三角形矩阵的逆矩阵仍是上三角形矩阵.

10. 设矩阵A,B 满足 $\boldsymbol{A}^{*} \boldsymbol{B} \boldsymbol{A} = 2 \boldsymbol{B} \boldsymbol{A} - 8 \boldsymbol{I}, \boldsymbol{A} = \begin{pmatrix} 1 & 0 & 0 \\ 0 & - 2 & 0 \\ 0 & 0 & 1 \end{pmatrix}$ ,求B.

11. 设 A 为 n 阶可逆矩阵，α为 $n \times 1$ 矩阵，b为常数，

$$\boldsymbol{P} = \begin{pmatrix} \boldsymbol{I} & \boldsymbol{O} \\ -\boldsymbol{\alpha}^{\mathrm{T}} \boldsymbol{A}^{*} & |\boldsymbol{A}| \end{pmatrix}, \quad \boldsymbol{Q} = \begin{pmatrix} \boldsymbol{A} & \boldsymbol{\alpha} \\ \boldsymbol{\alpha}^{\mathrm{T}} & \boldsymbol{b} \end{pmatrix}.$$

(1) 计算并化简 $P Q$

(2) 证明:Q可逆的充分必要条件是 $\boldsymbol{\alpha}^{\mathrm{T}} \boldsymbol{A}^{-1} \boldsymbol{\alpha} \neq b$

12. 设 $A_{m \times n},m < n,R\left ( A \right ) = m$ ，证明:存在 $n \times m$ 矩阵B，使得 $AB = I_{m}$

## 思考题二

1. 用三种方法证明:

$$\begin{aligned}\left| \begin{matrix}1 + a_{1} & 1 & \cdots & 1 \\1 \cdot & 1 + a_{2} & \cdots & 1 \\\vdots & \vdots & & \vdots \\1 & 1 & \cdots & 1 + a_{n} \\\end{matrix} \right|= \left( 1 + \sum_{i = 1}^{n}\frac{1}{a_{i}} \right)\prod_{i = 1}^{n}a_{i}.\end{aligned}$$

2. 在平面直角坐标系中，求三条直线 $a_{i}x + b_{i}y + c_{i} = 0 (i = 1,2,3)$ 相交于一点

[page:81]

$( x _ { 0 } , y _ { 0 } )$ 的充分必要条件.

3. 设 $a^{2} \neq b^{2}$ ，方程组

$$\begin{cases}ax_{1} + bx_{2n} = 1 \\ax_{2} + bx_{2n-1} = 1 \\\cdots\cdots\cdots\cdots \\ax_{n} + bx_{n+1} = 1 \\bx_{n} + ax_{n+1} = 1 \\\cdots\cdots\cdots\cdots \\bx_{2} + ax_{2n-1} = 1 \\bx_{1} + ax_{2n} = 1\end{cases}$$

是否有惟一解？为什么？若为惟一解则求之.

4. 将

$$\boldsymbol{A} = \begin{pmatrix}2 & 1 & 0 & 0 \\1 & 2 & 1 & 0 \\0 & 1 & 2 & 1 \\0 & 0 & 1 & 2\end{pmatrix}$$

分解成对角元为1的下三角形矩阵L和上三角形矩阵U的乘积，即A=LU. 5. 设A，B均为n阶矩阵，下列等式是否成立？为什么？

$$\begin{vmatrix} A & B \\ B & A \end{vmatrix} = | A + B | | A - B | .$$

知识点注释二

综合自测题二

[page:82]

## 第三章 几 何 空间

重点难点

在平面解析几何中，我们建立直角坐标系，将平面上的点$M_{0}(x_{0},y_{0})$ 与有序数组 $( x _ { 0 } , y _ { 0 } )$ 一一对应，然后使用代数的方法研究几何问题.将数学中的两个研究对象“数”与“形”统一起来，这在数学史上是一次划时代的变革，这次变革的功劳应首先归于法国数学家笛卡儿(Descartes).

本章我们将空间的点 $M_{0}(x_{0},y_{0},z_{0})$ 与有序数组$( x _ { 0 } , y _ { 0 } , z _ { 0 } )$ 一一对应，建立空间直角坐标系，用代数的方法研究几何问题.在本章的讨论中，将提出三维几何空间中的向量概念，而三维几何向量是我们在第四章讨论的n维向量的特例，几何空间的理论与方法是n维向量空间的基础.

## §3.1 空间直角坐标系与向量

## 一、空间直角坐标系

笛卡儿的功绩是将数学中的两个研究对象“形”与“数”统一起来，完成了数学史上一项划时代的变革.将“形”与“数”、几何与代数联系起来的纽带是在空间建立坐标系，从而使几何问题代数化.在中学已介绍了平面直角坐标系，并用坐标方法解决了一些平面解析几何问题.需要指出，在平面上建立坐标系，两个坐标轴之间的夹角可以不是直角，只要在平面上取一定点O及两个相交的数轴，就可以构成平面上的一个坐标系，这种坐标系称为仿射坐标系.由于直角坐标系比较简明，能使许多计算简化，所以直角坐标系是最常用的坐标系之一.下面我们在平面直角坐标系Oxy基础上建立三维空间直角坐标系.

通过原点O作一条垂直于 $O x y$ 平面的直线，称为z轴.原点的z坐标为零，z轴的方向按右手系法则确定，即当右手食指指向x轴正向、中指指向y轴正向时，拇指指向z轴的正向，这样我们就建立了空间直角坐标系 $O x y z ($ (图 3.1).O为坐标原点，$O x , O y , O z$ 称为坐标轴，分别称为x轴(横轴)、y轴(纵轴)、z轴(竖轴)，每两条坐标轴所确定的平面称为坐标面，分别称为 $O x y , O y z , O z x$ 平面.

设M为空间任意点，过M分别作三个坐标面的平行平面，与 $x , y , z$ 轴分别交于

[page:83]

A，B，C三点(图3.2)，设这三点在三个坐标轴上的坐标分别是 $x _ { 0 } , y _ { 0 } , z _ { 0 }$ ，则有序数组$( x _ { 0 } , y _ { 0 } , z _ { 0 } )$ 就称为点M的坐标.反之，任给一个有序数组 $(x_{0},y_{0},z_{0})$ ，在 $x , y , z$ 轴分别找出坐标为 $x_{0},y_{0},z_{0}$ 的点，不妨仍用A，B，C表示这三点，过A，B，C分别作平行于坐标面的平面，这三个平面的交点就是M.这样，空间的点与有序数组 $( x , y , z )$ 之间就建立了一一对应的关系.

显然，原点的坐标是(0，0,0)；在x，y，z轴上的点的坐标分别是 $(x,0,0)$ $(0,y,0),(0,0,z)$ ;在 $O x y , O y z , O x z$ 平面上的点的坐标分别是 $(x,y,0),(0,y,z)$ $(x,0,z)$

建立空间直角坐标系以后，整个空间就被三个坐标面分为八个部分，每一部分称为一个卦限，共有八个卦限(图3.3).其编号顺序是，Oxy平面上一、二、三、四象限的上方的四个部分分别称为Ⅰ，Ⅱ，Ⅲ，Ⅳ卦限，而Oxy平面上一、二、三、四象限的下方的四个部分分别称为V，VI，Ⅶ，Ⅷ卦限.

图3.4分别画出了坐标为(—2,3,2)的点P与坐标为(2,2，-1)的点Q.

## 二、向量及其线性运算

我们知道在物理学中描述力、速度、加速度等类型的量，既要指出大小，还要明确方向.这种既有大小，又有方向的量称为向量.

在几何上，可以用有向线段 $\overrightarrow{A B}$ 表示向量，A,B分别表示这个向量的起点与终点.也常用黑体字a,b,c 或α,β,γ 等表示向量.

[page:84]

向量的大小(或长度)称为向量的模，记为a∥或 $\overrightarrow{A B}$ .模等于1的向量称为单位向量.模等于零的向量称为零向量，记为0.零向量没有确定的方向.

与a的模相同而方向相反的向量称为a的负向量(或反向量)，记为一a.显然， $- a$的负向量就是a，即 $=(-a)=a$

在许多几何与物理问题中，所讨论的向量常常与起点无关，这种不考虑其起点的向量称为自由向量.也就是说，自由向量可以在空间中自由平行移动；或者说，自由向量的起点可以放在空间任何位置.如果没有特别申明，本书所指的向量都是自由向量.

在平面上力F由其沿x轴、y轴的两个分量完全确定.同理，在三维空间，力F由其沿x轴、y轴、z轴的三个分量完全确定，若三个分量分别是 $a_{1},a_{2},a_{3}$ ，那么力F就可以用有序数组 $\left( a_{1} , a_{2} , a_{3} \right)$ 表示(图 3.5).

对空间向量a作平行移动，将其起点移到坐标原点O，设其终点为P，则向量 $\overrightarrow{OP}$确定终点P.反过来，空间中任意一点P也确定了一个向量 $\overrightarrow{OP}$ ，也就是说，空间的点与向量之间建立了一一对应关系.

点P的坐标 $\left( a _ { 1 } , a _ { 2 } , a _ { 3 } \right)$ 也称向量 $\overrightarrow{OP}$ 的坐标或分量.向量 $\overrightarrow{OP}$ 可表示为

$$\overrightarrow{OP}=\boldsymbol{a}=(a_{1},a_{2},a_{3}).$$

这就是向量的坐标表示(图3.6).

对于零向量我们用记号0=(0,0,0)表示.

向量a的负向量 $-a = ( - a_{1} , - a_{2} , - a_{3} )$

两个向量相等当且仅当它们的对应分量相同，即

$$\left( a _ { 1 } , a _ { 2 } , a _ { 3 } \right) = \left( b _ { 1 } , b _ { 2 } , b _ { 3 } \right) \Leftrightarrow a _ { 1 } = b _ { 1 } , a _ { 2 } = b _ { 2 } , a _ { 3 } = b _ { 3 }.$$

[page:85]

定义(向量的线性运算)设向量 $\boldsymbol{a} = (a_{1}, a_{2}, a_{3})$ ，向量 $\boldsymbol{b} = (b_{1}, b_{2}, b_{3})$ ，则向量a与向量b的加法规定为

$$a+b=\left(a_{1}+b_{1},a_{2}+b_{2},a_{3}+b_{3}\right);$$

向量 $a = ( a _ { 1 } , a _ { 2 } , a _ { 3 } )$ 与数k的乘法(简称数乘)规定为

$$k \boldsymbol{a} = ( k \boldsymbol{a}_{1} , k \boldsymbol{a}_{2} , k \boldsymbol{a}_{3} ) .$$

显然，向量a的负向量一 $a = (-1)a$ ，零向量 $0 = 0 a$

向量的减法定义为

$$a-b=a+(-b).$$

容易证明向量的加法和数乘满足以下八条运算法则:

$$a+b=b+a$$

$$2^{\circ} \quad (a + b) + c = a + (b + c);$$

$$3^{\circ} \quad a + 0 = a ;$$

$$4^{\circ} \quad a + (-a) = 0;$$

$$5^{\circ} \quad 1a = a ;$$

$$6^{\circ} \quad \lambda(\mu a) = (\lambda \mu) a ;$$

$$7^{\circ} \quad \lambda(a+b)=\lambda a+\lambda b;$$

$$8 ^ { \circ } \quad ( \lambda + \mu ) a = \lambda a + \mu a ,$$

其中 $\lambda , \mu$ 为数.

在 $x , y , z$ 轴上分别取三个单位向量i,j，k(称为基向量)，即

$$i = (1,0,0), \quad j = (0,1,0), \quad k = (0,0,1),$$

则

$$\begin{aligned}\boldsymbol{a} &= (a_{1}, a_{2}, a_{3}) = (a_{1}, 0, 0) + (0, a_{2}, 0) + (0, 0, a_{3}) \\&= a_{1}(1, 0, 0) + a_{2}(0, 1, 0) + a_{3}(0, 0, 1) = a_{1}\boldsymbol{i} + a_{2}\boldsymbol{j} + a_{3}\boldsymbol{k}.\end{aligned}$$

这时我们称向量a可由基向量 $i , j , k$ 线性表出.

当 $b / / a$ 时，向量a与b可平行移动到同一条直线上，故向量a与b平行，又称向量 a 与 b 共线.

当 $b \ne a$ 且 $a \neq 0$ 时，必存在 $\lambda \in \mathbf{R}$ ，使 $b = \lambda a$ .这时称向量b可由向量a线性表出.当 $\lambda > 0$ 时，a与b同向；当 $\lambda < 0$ 时，a与b反向.且有下式成立:

$$\begin{aligned}\left( b_{1},b_{2},b_{3} \right) &= \lambda \left( a_{1},a_{2},a_{3} \right) = \left( \lambda a_{1},\lambda a_{2},\lambda a_{3} \right), \\& \quad \frac{b_{1}}{a_{1}} = \frac{b_{2}}{a_{2}} = \frac{b_{3}}{a_{3}} = \lambda.\end{aligned}$$

反之，若各分量的比例式成立，则可推出 $b \ne a$ ,故

$$b \parallel a \Leftrightarrow \frac{b_{1}}{a_{1}} = \frac{b_{2}}{a_{2}} = \frac{b_{3}}{a_{3}}.$$

两个向量a与 $b$ 的夹角规定为使其中一个向量与另一个向量方向一致时所旋转

[page:86]

的最小角度，记为<a,b>.显然

$$0 \leqslant (a,b) \leqslant \pi.$$

同样可以定义向量与数轴，数轴与数轴的夹角.

过空间点A作平面与轴u垂直相交于点 $\overline{A}'$ ,则 $A ^ { \prime }$ 称为A在轴u上的投影.

对于空间向量 $\overrightarrow{A B}$ 与轴u，设A,B在轴u上的投影分别是 $A^{\prime},B^{\prime}$ ，则 $\overrightarrow{A B}$ 在轴u上的投影用记号 $\mathrm{Prj}_{u} \overrightarrow{AB}$ 表示且定义为

$$\operatorname{Prj}_{u} \overrightarrow{AB}=\left\{\begin{aligned}&\parallel \overrightarrow{A^{\prime}B^{\prime}}\parallel, \quad  当  \overrightarrow{A^{\prime}B^{\prime}}  与  u  同向时 , \\&-\parallel \overrightarrow{A^{\prime}B^{\prime}}\parallel,  当  \overrightarrow{A^{\prime}B^{\prime}}  与  u  反向时 .\end{aligned}\right.$$

其几何意义如图3.7所示.

由上述定义可得向量在轴上的投影具有以下性质:

$$\mathrm { P r j } _ { u } \boldsymbol { a } = \| \boldsymbol { a } \| \cos \langle \boldsymbol { a } , \boldsymbol { u } \rangle ,$$

其中 $\langle a,u\rangle$ 为向量a与轴u的夹角， $0 \leqslant (a,u) \leqslant \pi;$

$$2^{\circ} \quad \operatorname{Prj}_{u}(a+b)=\operatorname{Prj}_{u} a+\operatorname{Prj}_{u} b.$$

根据向量在轴上投影的概念，向量 $\overrightarrow{OA}$ 的坐标 $a _ { 1 } , a _ { 2 }$ $\mathcal { Q } _ { \mathrm { ~ 3 ~ } }$ 分别是向量 $\overrightarrow{OA}$ 在三个坐标轴的投影.由图3.8可知

$$\left\| \overrightarrow{OA} \right\| = \left\| \boldsymbol{a} \right\| = \sqrt{a_{1}^{2} + a_{2}^{2} + a_{3}^{2}}$$

图3.7

$$\left\| k \boldsymbol{a} \right\| = \sqrt{(k a_{1})^{2} + (k a_{2})^{2} + (k a_{3})^{2}} = \left| k \right| \left\| \boldsymbol{a} \right\|.$$

在物理学中我们已经知道，力与速度是向量，并且它们的加法符合平行四边形法则.下面我们将看到，按我们现在定义的向量的加法也是满足平行四边形法则的.

由于空间中任意两个向量可以通过平行移动将其起点移动到坐标原点，所以空间中任意两个向量的加法可以在平面上进行.下面以图3.9所示的向量为例说明向量的加法符合平行四边形法则.

设 $\overrightarrow{OA}=(a_{1},a_{2}),\overrightarrow{OB}=(b_{1},b_{2})$ .以 $(a_{1} + b_{1}, a_{2} + b_{2})$ 为向量 $\overrightarrow{OP}$ 的终点，我们只需说明以O,A，P,B为顶点的四边形是平行四边形即可.

事实上，

[page:87]

$$\Pr_{x}\overrightarrow{BP}=a_{1}+b_{1}-b_{1}=a_{1},\quad\Pr_{y}\overrightarrow{BP}=a_{2}+b_{2}-b_{2}=a_{2}.$$

所以 $\overrightarrow{B P}$ 在x,y轴上的投影分别是 $a _ { 1 } , a _ { 2 }$ ，即向量 $\overrightarrow{BP}$ 经平行移动后可与向量 $\overrightarrow{OA}$ 重合，故

$$\overrightarrow{BP} \parallel \overrightarrow{OA}.$$

同理 $\overrightarrow{AP} \parallel \overrightarrow{OB}.$ 所以四边形OAPB是平行四边形，即 $\overrightarrow{OA}$ 与 $\overrightarrow{OB}$ 的加法符合平行四边形法则:

$$\overrightarrow{OA}+\overrightarrow{OB}=\overrightarrow{OP}.$$

由图3.9还可以看到， $\overrightarrow{OB}$ 经平行移动与 $\overrightarrow{[ \overrightarrow{A} \overrightarrow{P} ]}$ 重合，故

$$\overrightarrow{OA}+\overrightarrow{AP}=\overrightarrow{OP},$$

即向量的加法符合三角形法则.

例1 设 $a \ne 0,e_{a} = \frac{1}{\left \| a \right \| } a$ ,则

$$\left\| \boldsymbol{e}_{a} \right\| = \left| \frac{1}{\left\| \boldsymbol{a} \right\|} \right| \left\| \boldsymbol{a} \right\| = \frac{1}{\left\| \boldsymbol{a} \right\|} \left\| \boldsymbol{a} \right\| = 1.$$

$e _ { a }$ 是与a同方向的单位向量.

由以上讨论可知，向量a又可表示为 $a = \parallel a \parallel e_{a}$

例2利用向量的线性运算证明:三角形的中位线平行于底边且等于底边的一半.

证 如图3.10所示，设D，E分别是 $AB , AC$ 的中点，即

$$\begin{aligned}\overrightarrow{DE} = & \overrightarrow{DA} + \overrightarrow{AE} = \frac{1}{2}\overrightarrow{BA} + \frac{1}{2}\overrightarrow{AC} \\= & \frac{1}{2}(\overrightarrow{BA} + \overrightarrow{AC}) = \frac{1}{2}\overrightarrow{BC},\end{aligned}$$

所以 $\overrightarrow{DE} \parallel \overrightarrow{BC}$ ,且 $\overrightarrow{DE}$ = $\equiv \frac{1}{2}$ = $\overrightarrow{BC}$ l.

例3 若 $a \parallel c,b \parallel c,c \neq 0$ ,求证:a与b的线性组合 $k_{1}a + k_{2}b$ $(k_{1},k_{2} \in \mathbf{R})$ 也平行于c.

证由 $a \parallel c,b \parallel c$ 知，必存在常数 $\lambda_{1} , \lambda_{2}$ ，使得 $a = \lambda_{1}c , b = \lambda_{2}c$ ,于是

$$k_{1}\boldsymbol{a} + k_{2}\boldsymbol{b} = k_{1}(\lambda_{1}\boldsymbol{c}) + k_{2}(\lambda_{2}\boldsymbol{c}) = (k_{1}\lambda_{1} + k_{2}\lambda_{2})\boldsymbol{c}$$

故 $k_{1}a + k_{2}b$ 与c平行.

例4设 $M_{1}(x_{1},y_{1},z_{1}),M_{2}(x_{2},y_{2},z_{2})$ 是空间两点.

(1) 求 $\overrightarrow{M_{1}M_{2}}$ ∥；

(2) 设 M 为线段 $M_{1}M_{2}$ 上一点，且 $\frac{M_{1}M}{MM_{2}} = \lambda$ ,求 M的坐标.

解（1）设O是 $M_{1},M_{2}$ 所在空间直角坐标系的原点，如图3.11所示.

[page:88]

$$\begin{aligned}\overrightarrow{OM_{1}} &= (x_{1}, y_{1}, z_{1}), \quad \overrightarrow{OM_{2}} = (x_{2}, y_{2}, z_{2}), \\\overrightarrow{M_{1}M_{2}} &= \overrightarrow{OM_{2}} - \overrightarrow{OM_{1}} = (x_{2} - x_{1}, y_{2} - y_{1}, z_{2} - z_{1}), \\\parallel \overrightarrow{M_{1}M_{2}} \parallel &= \sqrt{(x_{2} - x_{1})^{2} + (y_{2} - y_{1})^{2} + (z_{2} - z_{1})^{2}}.\end{aligned}$$

这就是空间两点 $M_{1}$ 与 $M_{2}$ 的距离公式.这是平面上两点的距离公式的推广.

(2) 设 M 的坐标为 $(x,y,z)$ ,则

$$\begin{aligned}\overrightarrow{M_{1}M} &= (x - x_{1}, y - y_{1}, z - z_{1}), \\\overrightarrow{MM_{2}} &= (x_{2} - x, y_{2} - y, z_{2} - z).\end{aligned}$$

由 $\overrightarrow{M_{1}M}=\lambda\overrightarrow{MM_{2}}$ 可得

$$\begin{aligned}x - x_{1} &= \lambda(x_{2} - x), \quad y - y_{1} = \lambda(y_{2} - y), \quad z - z_{1} = \lambda(z_{2} - z), \\&x = \frac{x_{1} + \lambda x_{2}}{1 + \lambda}, \quad y = \frac{y_{1} + \lambda y_{2}}{1 + \lambda}, \quad z = \frac{z_{1} + \lambda z_{2}}{1 + \lambda}.\end{aligned}$$

最后介绍向量的方向余弦.

向量的主要特征是模与方向.设 $\boldsymbol{a} = (a_{1}, a_{2}, a_{3})$ ，则 $\left\| a \right\| = \sqrt{a_{1}^{2} + a_{2}^{2} + a_{3}^{2}}$ .怎样用向量的坐标表示向量的另一个特征——方向呢?

向量a的方向由a与 $x , y , z$ 轴的夹角 $\alpha , \beta$ γ完全确定 $\alpha , \beta , \gamma$ 称为a的方向角.由向量与轴的夹角定义可知

$$0 \leqslant \alpha \leqslant \pi, 0 \leqslant \beta \leqslant \pi, 0 \leqslant \gamma \leqslant \pi.$$

由图3.12 可得

$$\cos \alpha = \frac{a_{1}}{\left \| a \right \| }, \cos \beta = \frac{a_{2}}{\left \| a \right \| }, \cos \gamma = \frac{a_{3}}{\left \| a \right \| },$$

图3.12

即

$$\cos \alpha = \frac{a_{1}}{\sqrt{a_{1}^{2} + a_{2}^{2} + a_{3}^{2}}}, \cos \beta = \frac{a_{2}}{\sqrt{a_{1}^{2} + a_{2}^{2} + a_{3}^{2}}}, \cos \gamma = \frac{a_{3}}{\sqrt{a_{1}^{2} + a_{2}^{2} + a_{3}^{2}}}.$$

cos α, cos β,cosγ 称为向量 a 的方向余弦.

向量a的方向余弦满足以下关系式:

$$\cos ^{2}\alpha +\cos ^{2}\beta +\cos ^{2}\gamma =1.$$

与a同向的单位向量

$$e_{a} = \frac{1}{\left \| \boldsymbol{a} \right \| } \boldsymbol{a} = \left( \frac{a_{1}}{\left \| \boldsymbol{a} \right \| }, \frac{a_{2}}{\left \| \boldsymbol{a} \right \| }, \frac{a_{3}}{\left \| \boldsymbol{a} \right \| } \right) = (\cos \alpha, \cos \beta, \cos \gamma).$$

[page:89]

## 题3.1

1.在空间直角坐标系中，画出以下各点:(1) $M_{1}(2,1,3)$ (2) $M_{2}(1,3,-1)$

2. 指出下列各点的特殊性质:(1) $M_{1}(3,0,0);$ (2) $M_{2}(0,0,-2)$ (3) $M_{3}(0, -3, 4);$ (4) $M_{4}(5,0,-1)$

3. 求点 $M_{0}(x_{0},y_{0},z_{0})$ 关于各坐标面，各坐标轴及原点的对称点

4. 设向量 a 与 b 不平行 $\overrightarrow{AB}=\boldsymbol{a}+2\boldsymbol{b},\overrightarrow{BC}=-4\boldsymbol{a}-\boldsymbol{b},\overrightarrow{CD}=-5\boldsymbol{a}-3\boldsymbol{b}$ ，证明:四边形$A B C D$ 是梯形.

5. 设等腰梯形的四个顶点为A，B，C,D,AB是底边， $\overrightarrow{AB}=\boldsymbol{a},\overrightarrow{AD}=\boldsymbol{b},\left \langle \boldsymbol{a},\boldsymbol{b} \right \rangle =\frac{\pi }{3}$ ,试用向量a,b表示向量 $\overrightarrow{DC}, \overrightarrow{CB}, \overrightarrow{AC}, \overrightarrow{DB}$

6. 设向量a与三坐标轴成相等的锐角，求a的方向余弦.若∥a∥=2,求a的坐标.

7. 向量a与x轴、y轴成等角，与z轴所成的角是它们的2倍，求a的方向角.

8. 设 $A(2,-2,5),B(-1,6,7)$ ，求:(1) $\overrightarrow{A B}$ 在三坐标轴上的投影； (2) $\overrightarrow{A B}$ 的模；(3) $\overrightarrow{A B}$ 的方向余弦； (4) $\overrightarrow{A B}$ 方向上的单位向量.

9. 在 Oxy 平面上求向量p，使它垂直于向量 $q = (5, -3, 4)$ ，并与q有相等的长度.

10.设向量a与三个基向量成相等的锐角，且 $\| a \| = 2\sqrt{3}$ ,求 a.

11.当λ与μ为何值时，向量 $a = ( - 2,3,\lambda )$ 与 $b = ( \mu , - 6 , 2 )$ 共线?

## 3.2 向量的乘法

## 一、内积

设质点在力F的作用下产生位移s(见图3.13)，则力F所做的功为

$$W { = } \parallel F \parallel \parallel s \parallel \operatorname { c o s } \theta ,$$

其中θ是向量F与s的夹角.

这样的运算在数学中称为内积

定义1 向量a与b的内积为

$$\boldsymbol{a} \cdot \boldsymbol{b} = \left\| \boldsymbol{a} \right\| \left\| \boldsymbol{b} \right\| \cos (\boldsymbol{a}, \boldsymbol{b}).$$

其中〈a,b>是a 与b的夹角.

由定义1可知，两个向量的内积是一个实数，而内积运算符号用“。”表示，所以内积又称为数量积或点乘积.

[page:90]

将向量 $a$ 与自身的内积 $a \cdot a$ 记为 $a ^ { 2 }$ ，于是，由定义1可得

$$a^{2} = \left\| a \right\| \left\| a \right\| \cos \left\langle a, a \right\rangle = \left\| a \right\|^{2}.$$

由定义1还可以得到，若 $a \neq 0$ 且 $b \neq 0$ ,则

$$\cos \left( \boldsymbol{a}, \boldsymbol{b} \right) = \frac{\boldsymbol{a} \cdot \boldsymbol{b}}{\left\| \boldsymbol{a} \right\| \left\| \boldsymbol{b} \right\|}.$$

向量的内积满足以下规则:

$$a \cdot b = b \cdot a$$

$$2^{\circ} \quad (\lambda a) \cdot b = \lambda (a \cdot b);$$

$$3^{\circ} \quad (a + b) \cdot c = a \cdot c + b \cdot c.$$

对规则 $3 ^ { \circ }$ 给出证明.

证

$$\begin{aligned}(\boldsymbol{a} + \boldsymbol{b}) \cdot \boldsymbol{c} &= \|\boldsymbol{a} + \boldsymbol{b}\| \|\boldsymbol{c}\| \cos(\boldsymbol{a} + \boldsymbol{b}, \boldsymbol{c}) \\&= \|\boldsymbol{c}\| \Pr j _{c}(\boldsymbol{a} + \boldsymbol{b}) \\&= \|\boldsymbol{c}\| \Pr j _{c}\boldsymbol{a} + \|\boldsymbol{c}\| \Pr j _{c}\boldsymbol{b} \\&= \|\boldsymbol{a}\| \|\boldsymbol{c}\| \cos(\boldsymbol{a}, \boldsymbol{c}) + \|\boldsymbol{c}\| \|\boldsymbol{b}\| \cos(\boldsymbol{b}, \boldsymbol{c}) \\&= \boldsymbol{a} \cdot \boldsymbol{c} + \boldsymbol{b} \cdot \boldsymbol{c}.\end{aligned}$$

例1 设 $\begin{aligned}a \parallel = 11, \parallel b \parallel = 23, \parallel a - b \parallel = 30\end{aligned}$ ,求∥ $a + b \parallel$

$$\begin{aligned}\| \boldsymbol{a} + \boldsymbol{b} \|^2 &= (\boldsymbol{a} + \boldsymbol{b})^2 = \boldsymbol{a}^2 + 2\boldsymbol{a} \cdot \boldsymbol{b} + \boldsymbol{b}^2 \\&= \| \boldsymbol{a} \|^2 + \| \boldsymbol{b} \|^2 + 2\boldsymbol{a} \cdot \boldsymbol{b} = 650 + 2\boldsymbol{a} \cdot \boldsymbol{b},\end{aligned}$$

$$\begin{aligned}\| a - b \|^{2} &= (a - b)^{2} = a^{2} - 2a \cdot b + b^{2} \\&= \| a \|^{2} + \| b \|^{2} - 2a \cdot b = 650 - 2a \cdot b = 900,\end{aligned}$$

由上式可得 $2a \cdot b = - 250$ ,故

$$\begin{aligned}&\left\| \boldsymbol{a} + \boldsymbol{b} \right\|^2 = 650 - 250 = 400, \\&\left\| \boldsymbol{a} + \boldsymbol{b} \right\| = 20.\end{aligned}$$

由内积的定义容易得到，三个基向量i，j，k之间的内积有以下结果:

$$\begin{aligned}i^{2} &= j^{2} = k^{2} = 1, \\i \cdot j &= j \cdot k = k \cdot i = 0.\end{aligned}$$

设 $\boldsymbol{a} = (a_{1}, a_{2}, a_{3}), \boldsymbol{b} = (b_{1}, b_{2}, b_{3})$ ,则

$$\begin{align*}\boldsymbol{a} \cdot \boldsymbol{b} = & \left( a_{1} \boldsymbol{i} + a_{2} \boldsymbol{j} + a_{3} \boldsymbol{k} \right) \cdot \left( b_{1} \boldsymbol{i} + b_{2} \boldsymbol{j} + b_{3} \boldsymbol{k} \right) \\= & a_{1} b_{1} \boldsymbol{i}^{2} + a_{1} b_{2} \boldsymbol{i} \bullet \boldsymbol{j} + a_{1} b_{3} \boldsymbol{i} \bullet \boldsymbol{k} + a_{2} b_{1} \boldsymbol{j} \bullet \boldsymbol{i} + a_{2} b_{2} \boldsymbol{j}^{2} \\& + a_{2} b_{3} \boldsymbol{j} \bullet \boldsymbol{k} + a_{3} b_{1} \boldsymbol{k} \bullet \boldsymbol{i} + a_{3} b_{2} \boldsymbol{k} \bullet \boldsymbol{j} + a_{3} b_{3} \boldsymbol{k}^{2} \\= & a_{1} b_{1} + a_{2} b_{2} + a_{3} b_{3}.\end{align*}$$

这是向量内积的坐标表示式.利用这个表示式，可得两个非零向量a与 $b$ 夹角余弦的坐标表示式:

[page:91]

$$\cos ( \boldsymbol { a } , \boldsymbol { b } ) = \frac { \boldsymbol { a } \cdot \boldsymbol { b } } { \left\| \boldsymbol { a } \right\| \left\| \boldsymbol { b } \right\| } = \frac { a _ { 1 } b _ { 1 } + a _ { 2 } b _ { 2 } + a _ { 3 } b _ { 3 } } { \sqrt { a _ { 1 } ^ { 2 } + a _ { 2 } ^ { 2 } + a _ { 3 } ^ { 2 } } \sqrt { b _ { 1 } ^ { 2 } + b _ { 2 } ^ { 2 } + b _ { 3 } ^ { 2 } } } , \quad \frac { \boldsymbol { a } } { \left\| \boldsymbol { a } \right\| } \cdot \frac { \boldsymbol { b } } { \left\| \boldsymbol { b } \right\| } = e _ { a } \cdot e _ { b } .$$

若向量a与b的夹角为 $\frac{\pi}{2}$ ,则称a与b正交(或垂直)，记为 $a \perp b$ .由于零向量的方向是任意的，所以零向量与任何向量正交，且

$$a \perp b \quad \Leftrightarrow \quad a \cdot b = a _ { 1 } b _ { 1 } + a _ { 2 } b _ { 2 } + a _ { 3 } b _ { 3 } = 0 .$$

例2证明:如果向量a与b都与向量c垂直，则它们的线性组合 $k_{1}a + k_{2}b(k_{1}$ $k_{2} \in \mathbf{R}$ 也与c垂直.

证由 $a \perp c$ 且 $b \perp c$ ,知 $a \cdot c \equiv 0$ 且 $b \cdot c = 0$ 于是

$$\left( k _ { 1 } a + k _ { 2 } b \right) \cdot c = k _ { 1 } \left( a \cdot c \right) + k _ { 2 } \left( b \cdot c \right) = 0 ,$$

故向量 $k_{1}a + k_{2}b$ 与c 垂直.

对两个向量的内积

$$\boldsymbol{a} \cdot \boldsymbol{b} = \left\| \boldsymbol{a} \right\| \left\| \boldsymbol{b} \right\| \cos (\boldsymbol{a}, \boldsymbol{b})$$

两边取绝对值可得

$$| a \cdot b | \leqslant \| a \| \| b \|$$

或

$$(a \cdot b)^{2} \leqslant (a \cdot a)(b \cdot b).$$

以上两式称为柯西-施瓦茨(Cauchy-Schwarz)不等式.利用这个不等式可以证明以下的三角不等式:

$$\| a + b \| \leqslant \| a \| + \| b \|.$$

事实上，

$$\begin{aligned}\| \boldsymbol{a} + \boldsymbol{b} \|^2 &= (\boldsymbol{a} + \boldsymbol{b}) \cdot (\boldsymbol{a} + \boldsymbol{b}) \\&= \boldsymbol{a} \cdot \boldsymbol{a} + \boldsymbol{a} \cdot \boldsymbol{b} + \boldsymbol{b} \cdot \boldsymbol{a} + \boldsymbol{b} \cdot \boldsymbol{b} \\&= \parallel \boldsymbol{a} \parallel^2 + 2\boldsymbol{a} \cdot \boldsymbol{b} + \parallel \boldsymbol{b} \parallel^2 \\&\leqslant \parallel \boldsymbol{a} \parallel^2 + 2 \mid \boldsymbol{a} \cdot \boldsymbol{b} \mid + \parallel \boldsymbol{b} \parallel^2 \\&\leqslant \parallel \boldsymbol{a} \parallel^2 + 2 \parallel \boldsymbol{a} \parallel \parallel \boldsymbol{b} \parallel + \parallel \boldsymbol{b} \parallel^2 \\&= ( \parallel \boldsymbol{a} \parallel + \parallel \boldsymbol{b} \parallel )^2.\end{aligned}$$

所以 $\| a + b \| \leqslant \| a \| + \| b \|$

## 二、外积

定义2向量a与b的外积是一个向量，记为 $a \times b$ ，其模与方向确定如下:

$$1^{\circ} \quad \left\| \boldsymbol{a} \times \boldsymbol{b} \right\| = \left\| \boldsymbol{a} \right\| \left\| \boldsymbol{b} \right\| \sin(\boldsymbol{a}, \boldsymbol{b});$$

[page:92]

$2 ^ { \circ } \quad a \times b$ 与a,b都垂直，且 $a,b,a \times b$ 符合右手法则(图3.14).

由于向量的外积是一个向量，且外积的符号用 $\text{" } \times  \text{" }$ 表示，所以外积又称为向量积或叉乘积.

$$\begin{aligned}& 外积具有以下性质:  \\&1^{\circ} \quad a \times a = 0  ;  \\&2^{\circ} \quad a \times 0 = 0  ;  \\&3^{\circ} \quad a \times b = -b \times a  ;  \\&4^{\circ} \quad (\lambda a) \times (\mu b) = \lambda \mu (a \times b) (\lambda, \mu \in \mathbf{R})  ;  \\&5^{\circ} \quad a \times (b + c) = (a \times b) + (a \times c)  . \end{aligned}$$

以上性质中， $1 ^ { \circ } - 4 ^ { \circ }$ 都可用定义2直接证明， $5^{\circ}$ 的证明比较复杂，这里都略去不证.

图 3.14

由外积的定义不难得到基向量i,j，k的外积有以下结果:

$$\begin{aligned}i \times i &= j \times j = k \times k = 0, \\i \times j &= k, \quad j \times k = i, \quad k \times i = j, \\j \times i &= -k, \quad k \times j = -i, \quad i \times k = -j.\end{aligned}$$

设 $\boldsymbol{a} = (a_{1}, a_{2}, a_{3}), \boldsymbol{b} = (b_{1}, b_{2}, b_{3})$ ，利用外积运算规则与基向量i，j，k的外积可得

$$\begin{aligned}\boldsymbol{a} \times \boldsymbol{b} = & (a_{1} \boldsymbol{i} + a_{2} \boldsymbol{j} + a_{3} \boldsymbol{k}) \times (b_{1} \boldsymbol{i} + b_{2} \boldsymbol{j} + b_{3} \boldsymbol{k}) \\= & a_{1} b_{2} \boldsymbol{k} - a_{1} b_{3} \boldsymbol{j} - a_{2} b_{1} \boldsymbol{k} + a_{2} b_{3} \boldsymbol{i} + a_{3} b_{1} \boldsymbol{j} - a_{3} b_{2} \boldsymbol{i} \\= & (a_{2} b_{3} - a_{3} b_{2}) \boldsymbol{i} + (a_{3} b_{1} - a_{1} b_{3}) \boldsymbol{j} + (a_{1} b_{2} - a_{2} b_{1}) \boldsymbol{k}.\end{aligned}$$

利用三阶行列式的展开式，上述结果可以记为

$$\boldsymbol{a} \times \boldsymbol{b} = \begin{vmatrix} \boldsymbol{i} & \boldsymbol{j} & \boldsymbol{k} \\ \boldsymbol{a}_{1} & \boldsymbol{a}_{2} & \boldsymbol{a}_{3} \\ \boldsymbol{b}_{1} & \boldsymbol{b}_{2} & \boldsymbol{b}_{3} \end{vmatrix}$$

由定义2可得外积的几何意义是: $a \times b$ 的模是以a与b为邻边的平行四边形的面积(图3.15).

例3求以A(2,1,3)，B(1,4,5)，C(1，-2,1)为顶点的三角形面积.

解由向量外积的几何意义可得 $\triangle ABC$ 的面积为

$$S _ { \triangle A B C } = \frac { 1 } { 2 } \parallel \overrightarrow { A B } \times \overrightarrow { A C } \parallel ,$$

其中 $\overrightarrow{AB} = (-1,3,2), \overrightarrow{AC} = (-1,-3,-2)$ ,故

$$\overrightarrow{AB} \times \overrightarrow{AC} = \begin{vmatrix} \boldsymbol{i} & \boldsymbol{j} & \boldsymbol{k} \\ -1 & 3 & 2 \\ -1 & -3 & -2 \end{vmatrix} = -4\boldsymbol{j} + 6\boldsymbol{k},$$

[page:93]

$$S _ { \triangle A B C } = \frac { 1 } { 2 } \parallel - 4 j + 6 k \parallel = \frac { 1 } { 2 } \sqrt { ( - 4 ) ^ { 2 } + 6 ^ { 2 } } = \sqrt { 1 3 } .$$

例4 设单位向量 $\overrightarrow{OA}$ 与三个坐标轴的夹角相等，B是点M(1，—3,2)关于点N(-1,2,1)的对称点，求 $\overrightarrow{OA} \times \overrightarrow{OB}$

解设 $\alpha , \beta , \gamma$ 是 $\overrightarrow{OA}$ 的方向角，则

$$\alpha = \beta = \gamma ,$$

$$\cos ^{2}\alpha +\cos ^{2}\beta +\cos ^{2}\gamma =3\cos ^{2}\alpha =1,$$

典型例题讲解向量的运算

$$\cos \alpha = \cos \beta = \cos \gamma = \pm \frac{1}{\sqrt{3}}$$

$$\overrightarrow{OA}=(\cos\alpha,\cos\beta,\cos\gamma)=\pm\frac{1}{\sqrt{3}}(1,1,1).$$

设点B的坐标是 $(x,y,z)$ ，则点N是线段MB的中点.由中点坐标公式得

$$\frac{x + 1}{2} = - 1,\quad \frac{y - 3}{2} = 2,\quad \frac{z + 2}{2} = 1,$$

$$x = -3, \quad y = 7, \quad z = 0,$$

$$\overrightarrow{OB} = ( - 3,7,0 ).$$

$$\overrightarrow{OA} \times \overrightarrow{OB} = \pm \frac{1}{\sqrt{3}} \left| \begin{array}{ccc} \boldsymbol{i} & \boldsymbol{j} & \boldsymbol{k} \\ 1 & 1 & 1 \\ -3 & 7 & 0 \end{array} \right| = \pm \frac{1}{\sqrt{3}} ( - 7\boldsymbol{i} - 3\boldsymbol{j} + 10\boldsymbol{k} ).$$

例5证明:Ⅱ $a \times b \parallel ^ { 2 } + ( a \cdot b ) ^ { 2 } = \parallel a$ $\parallel b \parallel ^2$

证

$$\begin{align*}\| \boldsymbol{a} \times \boldsymbol{b} \|^{2} + (\boldsymbol{a} \cdot \boldsymbol{b})^{2} &= \| \boldsymbol{a} \|^{2} \| \boldsymbol{b} \|^{2} \sin^{2} \theta + \| \boldsymbol{a} \|^{2} \| \boldsymbol{b} \|^{2} \cos^{2} \theta \\&= \| \boldsymbol{a} \|^{2} \| \boldsymbol{b} \|^{2} (\sin^{2} \theta + \cos^{2} \theta) = \| \boldsymbol{a} \|^{2} \| \boldsymbol{b} \|^{2}.\end{align*}$$

## 三、混合积

定义3 向量a,b,c的混合积定义为 $(a \times b) \cdot c$

由定义3可知，三个向量a,b，c的混合积是一个实数.有时也将 $(a \times b) \cdot c$ 记为[a b c].

设 $a = ( a _ { 1 } , a _ { 2 } , a _ { 3 } ) , b = ( b _ { 1 } , b _ { 2 } , b _ { 3 } ) , c = ( c _ { 1 } , c _ { 2 } , c _ { 3 } )$ ,则

$$\boldsymbol{a} \times \boldsymbol{b} = (a_{2}b_{3} - a_{3}b_{2})\boldsymbol{i} + (a_{3}b_{1} - a_{1}b_{3})\boldsymbol{j} + (a_{1}b_{2} - a_{2}b_{1})\boldsymbol{k}$$

$$\left( \boldsymbol{a} \times \boldsymbol{b} \right) \cdot \boldsymbol{c} = \left( a_{2}b_{3} - a_{3}b_{2} \right)c_{1} + \left( a_{3}b_{1} - a_{1}b_{3} \right)c_{2} + \left( a_{1}b_{2} - a_{2}b_{1} \right)c_{3}.$$

写成行列式的形式就是

$$\left( \boldsymbol{a} \times \boldsymbol{b} \right) \cdot \boldsymbol{c} = \left| \begin{aligned} \boldsymbol{a}_{1} \quad \boldsymbol{a}_{2} \quad \boldsymbol{a}_{3} \\ \boldsymbol{b}_{1} \quad \boldsymbol{b}_{2} \quad \boldsymbol{b}_{3} \\ \boldsymbol{c}_{1} \quad \boldsymbol{c}_{2} \quad \boldsymbol{c}_{3} \end{aligned} \right| .$$

[page:94]

典型例题讲解混合积的概念与性质

混合积 $(a \times b) \cdot c$ 的几何意义是其绝对值$| (a \times b) \cdot c |$ 等于以向量a，b，c为棱的平行六面体的体积(图3.16).这个平行六面体的底面积为 $a \times b$ ,高为 $c \mid \mid \cos \theta \mid$ ，其中θ为 $a \times b$ 与c的夹角.由体积公式可得

$$\begin{aligned}V &= \left\| \boldsymbol{a} \times \boldsymbol{b} \right\| \left\| \boldsymbol{c} \right\| \left| \cos \theta \right| \\&= \left| (\boldsymbol{a} \times \boldsymbol{b}) \cdot \boldsymbol{c} \right|.\end{aligned}$$

由混合积的定义及坐标表示式可得以下性质:

$$1^{\circ} \quad (a \times b) \cdot c = (c \times a) \cdot b = (b \times c) \cdot a;$$

$2^{\circ}$ 对任意实数 $\lambda , \mu$ ,有

$$\left( \boldsymbol{a} \times \boldsymbol{b} \right) \cdot \left( \lambda \boldsymbol{c}_{1} + \mu \boldsymbol{c}_{2} \right) = \lambda \left( \boldsymbol{a} \times \boldsymbol{b} \right) \cdot \boldsymbol{c}_{1} + \mu \left( \boldsymbol{a} \times \boldsymbol{b} \right) \cdot \boldsymbol{c}_{2};$$

$3^{\circ}$ 设a,b,c 为三个非零向量， $\left[ a b c \right] = 0 \Leftrightarrow a , b , c$ 都平行于同一平面，即a，b，c 共面.

例6 设四面体的四个顶点为 $A\left(x_{1}, y_{1}, z_{1}\right), B\left(x_{2}, y_{2}, z_{2}\right), C\left(x_{3}, y_{3}, z_{3}\right)$ $D\left(x_{4},y_{4},z_{4}\right)$ ，求四面体ABCD的体积.

解由立体几何知，四面体ABCD的体积V等于以 $\overrightarrow{AB},\overrightarrow{AC},\overrightarrow{AD}$ 为棱的平行六面体的体积的 $\frac{1}{6}$ ，即

典型例题讲解混合积的几何意义

$$\frac{1}{6} \left| (\overrightarrow{AB} \times \overrightarrow{AC}) \cdot \overrightarrow{AD} \right|$$

而 $\overrightarrow{AB}=(x_{2}-x_{1},y_{2}-y_{1},z_{2}-z_{1}),\overrightarrow{AC}=(x_{2}-x_{1},y_{3}-y_{1},z_{3}-z_{1}),\overrightarrow{AD}=(x_{1}-x_{1},$ $y_{4} = y_{1},z_{4} = z_{1}$ ,故有

$$V = \frac{1}{6} \left| \begin{array}{ccc}x_{2} - x_{1} & y_{2} - y_{1} & z_{2} - z_{1} \\x_{3} - x_{1} & y_{3} - y_{1} & z_{3} - z_{1} \\x_{4} - x_{1} & y_{4} - y_{1} & z_{4} - z_{1} \\\end{array} \right| .$$

## 题3.2

1.若向量x 与a=(2,1,-1)共线，且满足 a·x=3,求x.

2. 设 $\left \| a \right \| = \left \| b \right \| = 5,\left \langle a,b \right \rangle = \frac{\pi}{4}$ ，计算以a-2b和 $3a + 2b$ 为邻边构成的三角形面积.

3. 利用向量方法证明:

(1)三角形的余弦定理； (2)直径上的圆周角是直角.

[page:95]

4.设a,b,c 中任意两个向量的夹角都是 $\frac{\pi}{3}$ ，且∥a∥=4，∥| $b \parallel = 6$ , Ⅱ| $c \parallel = 2$ ，计算 $\parallel a+b+c \parallel$

5. 设 $a=(1,2,3),b=(-2,1,1),c=(2,4,1)$ ，计算:(1) $(3a - 2c) \cdot b$ (2) $(b - 2a) \times c$

6. 设 $u = 2a + 3b, \quad v = a - b$ ，而 $a \parallel = 1$ , $\left \| b \right \| = 2,\left \langle a,b \right \rangle = \frac{\pi}{3}$ ，求:

(1) Prjv u ; (2)以u，v为邻边的平行四边形面积.

7. 设一平行四边形的对角线向量是 $c = a + 2b$ 与 $d = 3a - 4b$ ，且 $a \parallel = 1$ ,∥ $b \parallel = 2$ $\langle a,b\rangle = \frac{\pi}{6}$ ，求此平行四边形的面积

8.将 $M_{1}(7,-4,1),M_{2}(-2,2,4)$ 的连线 $M_{1}M_{2}$ 三等分，求分点坐标.

9. 设四面体的顶点为A(2,1，-1),B(3,0,1),C(2,-1,3)，D在y轴上，其体积为5，求顶点D的坐标.

## 3.3 平面

为讨论平面的有关性质以及平面间的位置关系，我们先建立平面的方程

## 一、平面的方程

## 1. 点法式方程

一张平面π可以由π上任意一点和垂直于π的任意一个向量完全确定.垂直于π的任一向量都称为π的法向量

如图3.17所示，设 $M_{0}(x_{0},y_{0},z_{0})$ 是平面π上一个确定的点， $M(x,y,z)$ 是π上任一点，向量 $\boldsymbol{n} = (A, B, C)$ 与π垂直，则

$$\boldsymbol{n} \cdot \overrightarrow{M_{0}M}=(A, B, C) \cdot (x-x_{0}, y-y_{0}, z-z_{0})=0,$$

即

$$A(x - x_{0}) + B(y - y_{0}) + C(z - z_{0}) = 0.$$

显然，平面π上任一点的坐标都满足这个方程.而坐标满足方程的点都在π上.于是这个方程就是过点 $M(x_{0},y_{0},z_{0})$ 且与向量 $n = (A, B, C)$ 垂直的平面π的方程，称为平面的点法式方程.

例1 求过不共线的三点 $M_{1}(2,-1,4),M_{2}(-1,3,-2),M_{3}(0,2,3)$ 的平面π的方程.

解 $\overrightarrow{M_{1}M_{2}}=(-3,4,-6),\overrightarrow{M_{1}M_{3}}=(-2,3,-1)$ ，平面π的法向量为

$$\boldsymbol { n } = \overrightarrow { M _ { 1 } M _ { 2 } } \times \overrightarrow { M _ { 1 } M _ { 3 } } = \left| \begin{matrix} i & j & k \\ - 3 & 4 & - 6 \\ - 2 & 3 & - 1 \end{matrix} \right| = 1 4 i + 9 j - k ,$$

[page:96]

平面π的方程为

$$14(x - 2) + 9(y + 1) - (z - 4) = 0$$

即

$$14x+9y-z-15=0.$$

## 2. 一般式方程

平面的点法式方程可改写为

$$Ax + By + Cz + D = 0,$$

其中 $D = -Ax_{0} - By_{0} - Cz_{0}$

这个方程称为平面的一般式方程.

利用一般式方程可以讨论一些比较特殊的平面的特性.

（1)当D=0时，平面 $Ax + By + Cz = 0$ 经过坐标原点.

(2) 当 $A = 0 \left( D \neq 0 \right)$ 时，平面 $B y + C z + D = 0$ 的法向量 $\boldsymbol{n} = (0, B, C), \boldsymbol{n}$ 与$i = (1,0,0)$ 垂直，由此可得平面与x轴平行.

同样，平面 $Ax + Cz + D = 0$ 与y轴平行，平面 $Ax + By + D = 0$ 与 z轴平行.

(3)当 $A=B=0(D\ne 0)$ 时，平面 $Cz + D = 0$ 与 $O x y$ 平面平行.

同样，平面 $Ax + D = 0$ 与 $O y z$ 平面平行，平面 $By + D = 0$ 与 $O x z$ 平面平行.而$A = B = D = 0$ 时，平面 $z = 0$ 即为 Oxy 平面.

例2 画出下列平面的图形:

(1) $2x - y - z = 0;$ (2) $-x+3y+6=0;$ (3) $3z - 7 = 0.$

解（1）此平面过原点，且与 $O x y$ 平面的交线为 $O x y$ 平面上的直线 $2x - y = 0$与Oxz 平面的交线为 $O x z$ 平面上的直线 $2x - z = 0$ ,其图形为图3.18(a).

(2)此平面与z轴平行，且与x轴的交点坐标为(6,0,0),与y轴的交点坐标为$(0, -2, 0)$ ，其图形为图3.18(b).

(3) 平面 $z = \frac{7}{3}$ 与Oxy平面平行，与z轴的交点坐标为 $\left(0,0,\frac{7}{3}\right)$ ，其图形为图3.18(c).

值得注意的是，在平面解析几何中，线性方程 $ax + by + c = 0$ 表示直线.而在空间解析几何中，线性方程 $Ax + By + Cz + D = 0, Ax + By + D = 0, Ax + D = 0$ 都表示平面.

## 3. 截距式方程

设平面π的一般式方程为

$$Ax + By + Cz + D = 0,$$

且 $ABCD\ne0$ ，则上式可化为

$$\frac{x}{-\frac{D}{A}}+\frac{y}{-\frac{D}{B}}+\frac{z}{-\frac{D}{C}}=1.$$

[page:97]

设 $a=-\frac{D}{A},b=-\frac{D}{B},c=-\frac{D}{C}$ ,则

$$\frac{x}{a} + \frac{y}{b} + \frac{z}{c} = 1.$$

这个方程称为平面的截距式方程.这个平面与x轴、 $y$ 轴、z轴的交点分别是(a，0,0),(0,b,0)，(0,0,c).a,b,c称为平面π在坐标轴上的截距.

## 二、平面与平面的位置关系

对于两个平面

$$\begin{aligned}\pi_{1}: & \quad A_{1}x + B_{1}y + C_{1}z + D_{1} = 0, \\\pi_{2}: & \quad A_{2}x + B_{2}y + C_{2}z + D_{2} = 0.\end{aligned}$$

它们的法向量为 $\boldsymbol{n}_{1}=\left(A_{1}, B_{1}, C_{1}\right), \quad \boldsymbol{n}_{2}=\left(A_{2}, B_{2}, C_{2}\right)$ .则有

(1) $\pi_{1}$ 与 $\pi_{2}$ 平行⇔ $\frac{A_{1}}{A_{2}}=\frac{B_{1}}{B_{2}}=\frac{C_{1}}{C_{2}}\ne\frac{D_{1}}{D_{2}}$

(2) $\pi_{1}$ 与 $\pi_{2}$ 重合⇔ $\frac{A_{1}}{A_{2}}=\frac{B_{1}}{B_{2}}=\frac{C_{1}}{C_{2}}=\frac{D_{1}}{D_{2}}$

(3) $\pi_{1}$ 与 $\pi_{2}$ 相交⇔ $\frac{A_{1}}{A_{2}}=\frac{B_{1}}{B_{2}}=\frac{C_{1}}{C_{2}}$ 不成立.

两平面的法向量的夹角称为两平面的夹角.设 $n _ { 1 }$ 与 $n _ { 2 }$ 的夹角为 $\theta$ ，则

$$\cos \theta = \frac{\boldsymbol{n}_{1} \cdot \boldsymbol{n}_{2}}{\left \| \boldsymbol{n}_{1} \right \| \left \| \boldsymbol{n}_{2} \right \|} = \frac{A_{1}A_{2} + B_{1}B_{2} + C_{1}C_{2}}{\sqrt{A_{1}^{2} + B_{1}^{2} + C_{1}^{2}}\sqrt{A_{2}^{2} + B_{2}^{2} + C_{2}^{2}}},$$

由此可得

$$\pi_{1} \perp \pi_{2} \quad \Leftrightarrow \quad A_{1}A_{2} + B_{1}B_{2} + C_{1}C_{2} = 0.$$

例3求过点 $M_{0}(-1,3,2)$ 且与平面 $2x-y+3z-4=0 和 x+2y+2z-1=0$ 都垂直的平面π的方程.

[page:98]

解一两个已知平面的法向量分别为 $n_{1} = (2, -1, 3), n_{2} = (1, 2, 2)$ ，故平面π的法向量为

$$\boldsymbol{n} = \boldsymbol{n}_{1} \times \boldsymbol{n}_{2} = \begin{vmatrix} \boldsymbol{i} & \boldsymbol{j} & \boldsymbol{k} \\ 2 & -1 & 3 \\ 1 & 2 & 2 \end{vmatrix} = -8\boldsymbol{i} - \boldsymbol{j} + 5\boldsymbol{k}$$

故平面π的方程为

$$-8(x+1)-(y-3)+5(z-2)=0$$

即

$$8x + y - 5z + 15 = 0.$$

解二 设平面π的方程为

$$A x + B y + C z + D = 0 ,$$

其法向量 $n = (A, B, C)$ ，由π与两个已知平面都垂直可知，n与 $n_{1} = (2, -1, 3), n_{2} =$ (1,2,2)垂直，即

$$\begin{aligned} &n \cdot n_{1} = 2A - B + 3C = 0, \\&n \cdot n_{2} = A + 2B + 2C = 0.\\ \end{aligned}$$

又由点 $M_{0}( = 1,3,2)$ 在平面π上，可得

$$-A+3B+2C+D=0.$$

联立求解

$$\begin{cases}2A - B + 3C = 0, \\A + 2B + 2C = 0, \\- A + 3B + 2C + D = 0,\end{cases}$$

可得 $A=\frac{8}{15}D,B=\frac{1}{15}D,C=-\frac{1}{3}D$ .故平面π的方程为

$$\frac{8}{15}Dx + \frac{1}{15}Dy - \frac{1}{3}Dz + D = 0,$$

即

$$8x + y - 5z + 15 = 0.$$

例4求点 $P_{0}(x_{0},y_{0},z_{0})$ 到平面 $Ax + By + Cz + D = 0$ 的距离.

解如图3.19所示，在平面上任取一点 $P_{1}(x_{1},y_{1},z_{1})$ ,过 $P_{0}$ 作平面的法向量

$$\boldsymbol{n} = (A, B, C)   ,$$

则 $P_{(i)}$ 到平面的距离d就是向量 $\overrightarrow{P_{1}P_{0}}$ 在n上的投影的绝对值，即

$$d = \left| \mathrm{Pr}_{n} \overline{P_{1}P_{0}} \right| = \left| \frac{n \cdot \overline{P_{1}P_{0}}}{\left\| n \right\|} \right| = \frac{\left| n \cdot \overline{P_{1}P_{0}} \right|}{\left\| n \right\|}$$

[page:99]

$$\frac{\left|A\left(x_{0}-x_{1}\right)+B\left(y_{0}-y_{1}\right)+C\left(z_{0}-z_{1}\right)\right|}{\sqrt{A^{2}+B^{2}+C^{2}}}$$

因为 $-Ax_{1}-By_{1}-Cz_{1}=D$ ,故

$$\frac{\left|Ax_{0}+By_{0}+Cz_{0}+D\right|}{\sqrt{A^{2}+B^{2}+C^{2}}}$$

## 题3.3

1. 写出下列平面的方程:

(1)过点M(1,1,1)且平行于平面 $\pi :-2x+y-z+1=0$

(2) 过点 $M_{1}(1,2,0)$ 和 $M_{2}(2,1,1)$ 且垂直于平面 $\pi : y - x - 1 = 0$

(3) 过 z轴且与平面 $2x + y - \sqrt{5}z = 0$ 的夹角为 $\frac{\pi}{3}$

2.下列图形有何特点？画出其图形.

(1) $2z - 3 = 0$ 44 (2) $y = 0$ (3) $3x + 4y - z = 0;$ (4) $x + y + 2z = 0.$

3. 由原点向平面作垂线，垂足为 $(x_{0},y_{0},z_{0})$ ，求此平面的方程.

4. 求过点 $A(-2,3,0),B(1,-1,2)$ 且与向量 $a = (4,5,1)$ 平行的平面方程.

5. 求过三点 $A(4,2,1),B(-1,-2,2)$ 和 $C(0,4,-5)$ 的平面方程.

6. 求以平面 $\frac{x}{a} + \frac{y}{b} + \frac{z}{c} = 1$ 与三坐标轴的交点为顶点的三角形的面积

7. 平面π过点M(2,0,-8)且与平面 $x-2y+4z-7=0, \\ 3x+5y-2z+3=0$ 都垂直，求平面π的方程.

8. 求由平面 $\pi_{1}:x-3y+2z-5=0$ 与 $\pi_{2}:3x - 2y - z + 3 = 0$ 所成二面角的平分面的方程.

## 3.4 空间直线

与平面的讨论类似，我们先给出空间直线的方程.

## 一、空间直线的方程

1. 点向式方程

给定点 $M_{0}(x_{0},y_{0},z_{0})$ 和非零向量 $s = (m, n, p)$ ，那么通过点 $M_{0}$ 且平行于s的直线l在空间的位置就可以完全确定.向量s称为直线l的方向向量

如图3.20所示，任取 $M(x,y,z) \in l$ ,则

$$\overrightarrow { M _ { 0 } M } = ( x - x _ { 0 } , y - y _ { 0 } , z - z _ { 0 } ) ,$$

[page:100]

且 $\overrightarrow{M_{0}M} / /s$ .于是存在 $\lambda \in \mathbb{R}$ ，使 $\overrightarrow{M_{0}M}=\lambda\boldsymbol{s}$即

$$\left( x - x _ { 0 } , y - y _ { 0 } , z - z _ { 0 } \right) = \left( \lambda m , \lambda n , \lambda p \right) ,$$

所以

图3.20

$$\frac{x - x_{0}}{m} = \frac{y - y_{0}}{n} = \frac{z - z_{0}}{p}.\tag{3.1}$$

显然，直线l上任一点的坐标都满足方程组；反之，坐标满足方程组的点必在直线l上.因此这个方程组称为直线l的点向式方程，又称为标准方程.

若点向式方程中某个分母为零，比如 $m \equiv 0$ ，则由式(3.1)可知 $x - x_{0} = 0$ ，这表明直线l在平面 $x = x_{0}$ 上.也就是说，

$$\frac{x - x_{0}}{0} = \frac{y - y_{0}}{n} = \frac{z - z_{0}}{p}$$

应理解为

$$\left\{ \begin{aligned} x - x_{0} &= 0, \\ \frac{y - y_{0}}{n} &= \frac{z - z_{0}}{p}. \end{aligned} \right.$$

例1 设直线l 经过点 $M_{1}(x_{1},y_{1},z_{1})$ 与 $M_{2}(x_{2},y_{2},z_{2})$ ，求l的方程.

解 l的方向向量 $s = \overline{M_{1}} \overline{M_{2}} = (x_{2} - x_{1}, y_{2} - y_{1}, z_{2} - z_{1})$ ，故l的方程为

$$\frac{x - x_{1}}{x_{2} - x_{1}} = \frac{y - y_{1}}{y_{2} - y_{1}} = \frac{z - z_{1}}{z_{2} - z_{1}}$$

## 2. 参数式方程

由点向式方程可得

$$\begin{cases}x = \lambda m + x_0, \\y = \lambda n + y_0, \\z = \lambda p + z_0.\end{cases}$$

这就是直线/的参数式方程，λ称为参数.不同的λ对应于l上不同的点

例2 设直线l过点M(3,4，一4),s是l的方向向量，s的方向角为 $\frac{\pi}{3}, \frac{\pi}{4}, \frac{2\pi}{3}$ ,求l的方程.

解 $e_{s} = \left( \cos \frac{\pi}{3}, \cos \frac{\pi}{4}, \cos \frac{2\pi}{3} \right) = \left( \frac{1}{2}, \frac{\sqrt{2}}{2}, -\frac{1}{2} \right)$ ，可取 $s = (1,\sqrt{2}, -1)$ ，则l的方程为

[page:101]

$$\begin{cases}x = \lambda + 3, \\y = \sqrt{2}\lambda + 4, \\z = -\lambda - 4.\end{cases}$$

## 3. 一般式方程

一条空间直线可以看作两个平面的交线，于是直线方程可表示为

$$\begin{cases}A_{1}x + B_{1}y + C_{1}z + D_{1} = 0, \\A_{2}x + B_{2}y + C_{2}z + D_{2} = 0.\end{cases}$$

这个方程组称为直线的一般式方程

例3将直线l的一般式方程 $\begin{cases}4x + 3y - z + 5 = 0, \\3x + 2y + 2z + 1 = 0\end{cases}$ 化为点向式方程.

解一 由一般式方程可得

$$\begin{cases}4x + 3y = z - 5, \\3x + 2y = - 2z - 1,\end{cases}$$

取z=1，解得 $x = -1, y = 0$ 于是，M(-1,0,1)是l上一点.

两个平面的法向量分别是 $\boldsymbol{n}_{1}=(4,3,-1),\boldsymbol{n}_{2}=(3,2,2)$ ，故l的方向向量为

$$\boldsymbol{s} = \boldsymbol{n}_{1} \times \boldsymbol{n}_{2} = \begin{vmatrix} \boldsymbol{i} & \boldsymbol{j} & \boldsymbol{k} \\ 4 & 3 & -1 \\ 3 & 2 & 2 \end{vmatrix} = 8\boldsymbol{i} - 11\boldsymbol{j} - \boldsymbol{k}$$

所以l的方程为

$$\frac{x + 1}{8} = \frac{y}{-11} = \frac{z - 1}{-1}$$

解二取 $z = 1$ ，由一般式方程可得l上的点M(—1,0,1)；取 $z = 0$ 可得l上的点$N(7, -11, 0)$ .由此可得l的方向向量 $s = \overline{MN} = (8, -11, -1)$ ,故l的方程为

$$\frac{x + 1}{8} = \frac{y}{-11} = \frac{z - 1}{-1}$$

解三 在一般式方程中消去x可得 $z = \frac{y + 11}{11}$ ，消去y可得 $z = \frac{x - 7}{- 8}.$ 于是，l的方程为

$$\frac{x - 7}{- 8} = \frac{y + 11}{11} = \frac{z}{1}.$$

解二与解三的结果表现形式不同，但容易看出都是同一条直线l的方程.

## 二、直线与直线的位置关系

对于两条空间直线

[page:102]

$$l_{1}:\frac{x - x_{1}}{m_{1}} = \frac{y - y_{1}}{n_{1}} = \frac{z - z_{1}}{p_{1}}, \quad l_{2}:\frac{x - x_{2}}{m_{2}} = \frac{y - y_{2}}{n_{2}} = \frac{z - z_{2}}{p_{2}}.$$

它们的方向向量 $s_{1} = (m_{1}, n_{1}, p_{1}), s_{2} = (m_{2}, n_{2}, p_{2})$ 分别过点 $M_{1}(x_{1},y_{1},z_{1})$ $M_{2}(x_{2},y_{2},z_{2})$ ,则有

(1) $l _ { 1 }$ 与 $l _ { 2 }$ 平行 $\Leftrightarrow \quad s_{1} \parallel s_{2} \times \overrightarrow{M_{1}M_{2}}$

(2) $l _ { 1 }$ 与 $l _ { 2 }$ 重合 $\Leftrightarrow \quad s_{1} \parallel s_{2} \parallel \overrightarrow{M_{1}M_{2}}$

(3) $l _ { 1 }$ 与 $l _ { 2 }$ 相交 $\Leftrightarrow \quad s_{1} \land s_{2}$ 且 $\left[ s _ { 1 } \quad s _ { 2 } \quad \overrightarrow { M _ { 1 } M _ { 2 } } \right] = 0$

(4) $l_{1}$ 与 $l _ { 2 }$ 异面 $\Leftrightarrow s _ { 1 } \times s _ { 2 }$ 且 $\left[ s _ { 1 } \quad s _ { 2 } \quad \overline { M _ { 1 } M _ { 2 } } \right] \neq 0$

两直线的方向向量的夹角 $\theta$ 称为两直线的夹角，有

$$\cos \theta = \frac{\boldsymbol{s}_{1} \cdot \boldsymbol{s}_{2}}{\left \| \boldsymbol{s}_{1} \right \| \left \| \boldsymbol{s}_{2} \right \|} = \frac{m_{1}m_{2} + n_{1}n_{2} + p_{1}p_{2}}{\sqrt{m_{1}^{2} + n_{1}^{2} + p_{1}^{2}}\sqrt{m_{2}^{2} + n_{2}^{2} + p_{2}^{2}}},$$

由此可得

$$l_{1} \perp l_{2} \quad \Leftrightarrow \quad m_{1}m_{2}+n_{1}n_{2}+p_{1}p_{2}=0.$$

例4 判定直线 $l_{1}:x = y = z - 4$ 与 $l_{2}: -x = y = z$ 的位置关系.

解因为 $s_{1} = (1,1,1), s_{2} = (-1,1,1)$ ，所以 $l _ { \perp }$ 与 $l _ { 2 }$ 不平行.

点 $M_{1}(0,0,4)$ 在直线 $l _ { 1 }$ 上，点 $M_{2}(0,0,0)$ 在直线 $l _ { 2 }$ 上.

$$\overrightarrow{M_{1}M_{2}}=(0,0,-4)$$

混合积

$$\left[ s _ { 1 } \quad s _ { 2 } \quad \overrightarrow { M _ { 1 } M _ { 2 } } \right] = - 8 \neq 0 ,$$

故 $l _ { 1 }$ 与 $l _ { 2 }$ 为异面直线.

例5 求过点 $M(2,0,-1)$ 且与直线 $l:\begin{cases}2x - 3y + z - 6 = 0, \\4x - 2y + 3z + 9 = 0.\end{cases}$ 平行的直线方程.

解 l的方向向量为

$$\boldsymbol{s} = \boldsymbol{n}_{1} \times \boldsymbol{n}_{2} = \begin{vmatrix} \boldsymbol{i} & \boldsymbol{j} & \boldsymbol{k} \\ 2 & -3 & 1 \\ 4 & -2 & 3 \end{vmatrix} = -7\boldsymbol{i} - 2\boldsymbol{j} + 8\boldsymbol{k}$$

所以l的方程为 $\frac{x - 2}{- 7} = \frac{y}{- 2} = \frac{z + 1}{8}$

下面讨论空间任一点 $M_{0}(x_{0},y_{0},z_{0})$ 到直线 $l:\frac{x - x_{1}}{m} = \frac{y - y_{1}}{n} = \frac{z - z_{1}}{p}$ 的距离.

如图3.21所示，设 $\boldsymbol{s} = \overrightarrow{M_{1}M} = (m, n, p)$ ，则以s和M $\overrightarrow{_{1}M_{0}}$ 为邻边所作的平行四边形的面积

$$A = \| \boldsymbol{s} \times \overrightarrow{M_1 M_0} \| = d \| \boldsymbol{s} \|$$

[page:103]

故点 $M_{0}$ 到直线l的距离

$$d = \frac{\left\| s \times \overline{M_1} \overline{M_0} \right\|}{\left\| s \right\|}.$$

例6求点 $M_{0}(1,2,1)$ 到直线l:

$\begin{cases}x + y = 0, \\x - y + z - 2 = 0\end{cases}$ 的距离.

解l的方向向量

$$s = \begin{vmatrix} i & j & k \\ 1 & 1 & 0 \\ 1 & -1 & 1 \end{vmatrix} = i - j - 2k = (1, -1, -2).$$

在l的方程中取 $z = 0$ ，得l上的点 $M_{1}(1, -1, 0)$

$$\overrightarrow{M_{1}M_{0}}=(0,3,1),$$

$$\boldsymbol{s} \times \overrightarrow{M_{1}M_{0}} = \begin{vmatrix} \boldsymbol{i} & \boldsymbol{j} & \boldsymbol{k} \\ 1 & -1 & -2 \\ 0 & 3 & 1 \end{vmatrix} = 5\boldsymbol{i} - \boldsymbol{j} + 3\boldsymbol{k} = (5, -1, 3).$$

$$d = \frac{\left\| \boldsymbol{s} \times \overline{\boldsymbol{M}_{1} \boldsymbol{M}_{0}} \right\|}{\left\| \boldsymbol{s} \right\|} = \frac{\sqrt{5^{2} + (-1)^{2} + 3^{2}}}{\sqrt{1^{2} + (-1)^{2} + (-2)^{2}}} = \sqrt{\frac{35}{6}}.$$

## 三、直线与平面的位置关系

对于直线

$$l:\frac{x - x_{0}}{m} = \frac{y - y_{0}}{n} = \frac{z - z_{0}}{p}$$

与平面

$$\pi : A x + B y + C z + D = 0 ,$$

重难点分析直线与平面的位置关系

直线的方向向量为 $s = (m, n, p)$ ，平面的法向量为 $\boldsymbol{n} = (A, B, C)$ ,则有

(1)l与π平行 $s \cdot n = 0$ 但 $A x _ { 0 } + B y _ { 0 } + C z _ { 0 } + D \neq 0$ se.

(2) l 在π上 $s \cdot n = 0$ 且 $A x _ { 0 } + B y _ { 0 } + C z _ { 0 } +$ $D \equiv 0$ i

(3)l与π 相交 $\Leftrightarrow \quad s \cdot n \neq 0.$

过l作一平面 $\pi^{\prime}$ 与 $\pi$ 垂直，则 $\pi ^ { \prime }$ 与 $\pi$ 的交线 $l ^ { \prime }$ 称为l在 $\pi$ 上的投影.

l与 $l ^ { \prime }$ 的夹角(锐角)称为l与π的夹角(图3.22).由图 3.22还可得

图3.22

[page:104]

$$\theta = \left\{ \begin{aligned} \frac{\pi}{2} - \langle s, n \rangle , \quad \langle s, n \rangle \leqslant \frac{\pi}{2}, \\ \langle s, n \rangle - \frac{\pi}{2}, \quad \langle s, n \rangle > \frac{\pi}{2}, \end{aligned} \right.$$

由此式可得

$$\begin{aligned}\sin \theta = & \frac{\left| \boldsymbol{n} \cdot \boldsymbol{s} \right|}{\left\| \boldsymbol{n} \right\| \left\| \boldsymbol{s} \right\|} \\= & \frac{\left| A m + B n + C p \right|}{\sqrt{A^{2} + B^{2} + C^{2}} \sqrt{m^{2} + n^{2} + p^{2}}}.\end{aligned}$$

例7 判定直线 $l:\frac{x - 1}{1} = \frac{y + 2}{- 2} = \frac{z}{2}$ 与平面 $\pi :x+4y-z-1=0$ 的位置关系，若相交则求出交点与夹角.

解

$$s = (1, -2, 2), \quad n = (1, 4, -1),$$

由 $s \cdot n = - 9 \neq 0$ ，知直线与平面相交

直线l的参数方程为

$$\begin{cases}x = \lambda + 1, \\y = - 2\lambda - 2, \\z = \lambda,\end{cases}$$

代入π的方程，可得 $\lambda = - \frac{8}{9} . \lambda = - \frac{8}{9}$ 在l上所对应的点 $M\left(\frac{1}{9},-\frac{2}{9},-\frac{16}{9}\right)$ 为l与π的交点.

故l与π的夹角

$$\theta = \arcsin \frac{\left| \boldsymbol{n} \cdot \boldsymbol{s} \right|}{\left\| \boldsymbol{n} \right\| \left\| \boldsymbol{s} \right\|} = \arcsin \frac{\left| 1 - 8 - 2 \right|}{\sqrt{18} \sqrt{9}} = \arcsin \frac{1}{\sqrt{2}} = \frac{\pi}{4}.$$

例8直线l过点M(2,5，-2)且与直线 $l_{1}:\begin{cases}x - y + 2z - 4 = 0, \\3x + 4y + z = 0\end{cases}$ 垂直相交，求l的方程.

解 $l _ { 1 }$ 的方向向量为

$$\boldsymbol{s}_{1}=\boldsymbol{n}_{1} \times \boldsymbol{n}_{2}=\begin{vmatrix}\boldsymbol{i} & \boldsymbol{j} & \boldsymbol{k} \\1 & -1 & 2 \\3 & 4 & 1\end{vmatrix}=-9\boldsymbol{i}+5\boldsymbol{j}+7\boldsymbol{k}.$$

过M(2,5，—2)作与 $l _ { 1 }$ 垂直的平面π，则π的方程为

$$-9(x-2)+5(y-5)+7(z+2)=0$$

即 $9x - 5y - 7z - 7 = 0$ .与 $l _ { 1 }$ 的方程联立求解:

$$\begin{cases}9x - 5y - 7z - 7 = 0, \\x - y + 2z - 4 = 0, \\3x + 4y + z = 0,\end{cases}$$

[page:105]

得直线 $l _ { \perp }$ 与平面π的交点N(1，-1,1).点M(2,5，-2)与N(1，-1,1)所确定的直线就是l(见图3.23). 1,

l的方向向量为 $s = \overrightarrow{MN} = (-1, -6, 3)$ ，所以l的方程为

$$\frac{x - 2}{- 1} = \frac{y - 5}{- 6} = \frac{z + 2}{3}$$

设直线/的方程是

$$\left\{ \begin{aligned} A_{1}x + B_{1}y + C_{1}z + D_{1} &= 0, \\ A_{2}x + B_{2}y + C_{2}z + D_{2} &= 0. \end{aligned} \right.\tag{3.2}$$

(3.3)

则除方程(3.3)所表示的平面外，经过直线l的所有平面都可以由下式表示:

$$A_{1}x + B_{1}y + C_{1}z + D_{1} + \lambda(A_{2}x + B_{2}y + C_{2}z + D_{2}) = 0.$$

经过直线l的平面全体称为过l的平面束.这个方程称为经过直线l的平面束方程.

例9求直线 $l:\frac{x - 4}{4} = \frac{y - 5}{- 1} = \frac{z - 2}{3}$ 在平面π: $2x + 2y + z - 11 = 0$ 上的投影直线 $l ^ { \mathcal { F } } .$

解一 过直线l作一平面 $\pi^{\prime}$ 与π垂直，则 $\pi^{\prime}$ 与π的交线就是l在π上的投影直线 $l ^ { \prime }$

将l的方程改写为一般式，则由

$$\left\{ \begin{aligned} \frac{x - 4}{4} = & \frac{y - 5}{- 1}, \\ \frac{y - 5}{- 1} = & \frac{z - 2}{3} \end{aligned} \right.$$

可得

$$\begin{cases}x + 4y - 24 = 0, \\3y + z - 17 = 0.\end{cases}$$

过l的平面束方程为 $x+4y-24+\lambda(3y+z-17)=0$ ,即

$$x+(4+3\lambda)y+\lambda z-(24+17\lambda)=0$$

其法向量为 $n^{\prime} = (1, 4 + 3\lambda, \lambda)$ .由 $\pi ^ { \prime } \perp \pi$ 可得

$$n \cdot n^{\prime} = 2 \cdot 1 + 2 \cdot (4 + 3\lambda) + 1 \cdot \lambda = 7\lambda + 10 = 0$$

$$\lambda = - \frac{10}{7},$$

故 $\pi ^ { \prime }$ 的方程为

[page:106]

$$x+\left(4-\frac{30}{7}\right)y-\frac{10}{7}z-\left(24-\frac{170}{7}\right)=0,$$

即 $7x-2y-10z+2=0.l$ 在π上的投影直线为

$$l ^ { \prime } : \left\{ \begin{aligned} & 7 x - 2 y - 1 0 z + 2 = 0 , \\ & 2 x + 2 y + z - 1 1 = 0 . \end{aligned} \right.$$

解二 作过l且与π垂直的平面 $\pi^{\prime}$ ，则l上的点M(4,5,2)在 $\pi^{\prime}$ 上.

直线l的方向向量 $s = (4, -1, 3)$ 与平面π的法向量 $\boldsymbol{n} = (2, 2, 1)$ 的外积 $s \times n$ 就是 $\pi ^ { \prime }$ 的法向量 $n ^ { \prime \prime }$

$$\boldsymbol{n}^{\prime}=\boldsymbol{s} \times \boldsymbol{n}=\begin{vmatrix}\boldsymbol{i} & \boldsymbol{j} & \boldsymbol{k} \\4 & -1 & 3 \\2 & 2 & 1\end{vmatrix}=-7 \boldsymbol{i}+2 \boldsymbol{j}+10 \boldsymbol{k},$$

故 $\pi^{\prime}$ 的方程为

$$-7(x-4)+2(y-5)+10(z-2)=0$$

即 $7x - 2y - 10z + 2 = 0$ ，所以直线l在平面 $\pi$ 上的投影直线为

$$l ^ { \prime } : \left\{ \begin{aligned} & 7 x - 2 y - 1 0 z + 2 = 0 , \\ & 2 x + 2 y + z - 1 1 = 0 . \end{aligned} \right.$$

例10设平面 $\pi$ 与 $\pi ' : 5x - y + 3z - 2 = 0$ 垂直， $i \pi$ 与 $\pi^{\prime}$ 的交线落在 $O x y$ 平面上，求平面π的方程.

解一设π的方程为

$$Ax + By + Cz + D = 0,$$

则 $\pi$ 与 $\pi ^ { \prime }$ 的交线就是 $\pi ^ { \prime }$ 与 $O x y$ 平面的交线:

$$l:\left\{ \begin{aligned} 5x - y + 3z - 2 = 0, \\ z = 0. \end{aligned} \right.$$

l 上的两个点 $M_{1}(1,3,0),M_{2}(0,-2,0) \in \pi$

将 $M_{1},M_{2}$ 的坐标代入π的方程可得:

$$\begin{cases}A + 3B + D = 0, \\- 2B + D = 0.\end{cases}\tag{3.4}$$

(3.5)

又由 $\pi \perp \pi ^ { \prime }$ 可知其法向量垂直:

$$(A,B,C) \cdot (5,-1,3)=5A-B+3C=0.\tag{3.6}$$

联立求解式(3.4)，(3.5)，(3.6)可得 $A=15,B=-3,C=-26,D=-6.\pi$ 的方程为

$$15x - 3y - 26z - 6 = 0.$$

[page:107]

解二π与 $\pi^{\prime}$ 的交线即 $\pi ^ { \prime }$ 与 $O x y$ 平面的交线:

$$l:\left\{ \begin{aligned} 5x - y + 3z - 2 = 0, \\ z = 0. \end{aligned} \right.$$

过l的平面束方程为

$$5x - y + 3z - 2 + \lambda z = 0\tag{3.7}$$

即 $5x - y + (3 + \lambda)z - 2 = 0$ ,其法向量为 $n = ( 5 , - 1 , 3 + \lambda )$

由π与 $\pi^{\prime}$ 垂直可知n与 $\pi ^ { \prime }$ 的法向量垂直:

$$n \cdot ( 5 , - 1 , 3 ) = 3 5 + 3 \lambda = 0 , \lambda = - \frac { 3 5 } { 3 } .$$

将 $\lambda = - \frac{35}{3}$ 代入平面束方程(3.7)，得π的方程为

$$15x - 3y - 26z - 6 = 0.$$

## 题3.4

1.对于直线

$$l_{1}:\begin{cases}x = 1 + \lambda, \\y = -1 + 2\lambda, \\z = \lambda\end{cases} 与 \quad l_{2}:\begin{cases}2x - y - 5 = 0, \\y - 2z + 3 = 0,\end{cases}$$

(1) 证明 $: l_{1} / / l_{2};$ (2)求 $l _ { 1 }$ 与 $l _ { 2 }$ 的距离；（3）求 $l _ { 1 }$ 与 $l_{2}$ 所确定的平面方程.

2. 证明直线 $l_{1}:\left\{\begin{aligned}2x - y + 3z + 3 = 0 \\x + 10y - 21 = 0\end{aligned}\right.$ 与 $l_{2}:\begin{cases}2x - y = 0, \\7x + z - 6 = 0.\end{cases}$ 相交，并求出 $l _ { 1 }$ 与 $l _ { 2 }$

的交点、夹角以及 $l _ { 1 }$ 与 $l _ { 2 }$ 所确定的平面.

3. 求与平面 $2x - 3y - 6z - 14 = 0$ 平行，且与坐标原点的距离为5的平面方程.

4.求点M(3,1，-4)关于直线l: $\begin{cases}x - y - 4z + 12 = 0, \\2x + y - 2z + 3 = 0\end{cases}$ 的对称点.

5.平面π过三点A(1,0,0),B(0,1,0),C(0,0,1),求过原点的直线l,使l在平面 $x =$ y上，且与π成45°角.

6. 求点P(3,1,2)在直线 $l:x=3t,y=t-1,z=t+1$ 上的投影 $P^{\prime}$ ，并求点P到l的距离d.

7. 求直线l: $\begin{cases}x + 2y - 3z - 5 = 0 \\2x - y + z + 2 = 0\end{cases}$ 的标准方程和在三个坐标面上的投影

8.证明直线 $l_{1}:\frac{x - 1}{2} = \frac{y + 2}{- 3} = \frac{z - 5}{4}$ 与 $l_{2}:\frac{x - 7}{3} = \frac{y - 2}{2} = \frac{z - 1}{- 2}$ 位于同一平面内，并求此平面及两直线间的夹角.

9. 对于直线 $l_{1}:\frac{x + 7}{3} = \frac{y + 4}{4} = \frac{z + 3}{- 2}$ 与 $l_{2}:\frac{x - 21}{6} = \frac{y + 5}{- 4} = \frac{z - 2}{- 1}$

[page:108]

（1）证明它们不在同一平面上；

(2) 写出过 $l _ { 2 }$ 且平行于 $l _ { 1 }$ 的平面方程.

## 习题三

1. 设 a,b 均为非零向量，且 $b \parallel = 1, \langle a, b \rangle = \frac{\pi}{4}$ ,求

$$\lim_{x \to 0} \frac{\left\| a + xb \right\| - \left\| a \right\|}{x}$$

2.设向量r与a=i-2j—2k共线，与j成锐角，且∥r∥=15，求r.

3.在顶点为A(1，-1,2)，B(5，—6,2)和 $C(1,3,-1)$ 的三角形中，求AC边上的高h.

4. 设向量 p和向量 $q = 3i + 6j + 8k$ 与x轴都垂直，且∥ $p \parallel = 2$ ,求向量p.

5. 设向量 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 两两垂直，且符合右手系规则， $\left\| \boldsymbol{\alpha}_{1} \right\| = 4, \left\| \boldsymbol{\alpha}_{2} \right\| = 2, \left\| \boldsymbol{\alpha}_{3} \right\| = 3$计算 $( \alpha_{1} \times \alpha_{2} ) \cdot \alpha_{3}$

6. 平面π过 $M_{1}(1,1,1)$ 和 $M_{2}(0,1,-1)$ 且与平面 $x + y + z = 0$ 垂直，求π的方程.

7. 平面π过 $\pi_{1}:2x-3y-z+1=0$ 与 $\pi_{2}:x+y+z=0$ 的交线且与平面 $\pi_{2}$ 垂直，求π的方程.

8. 在直线 $l:\begin{cases}3x + 2y + 4z - 11 = 0, \\2x + y - 3z - 1 = 0\end{cases}$ 上求与点Q(1,1,1)的距离为1的点P.

9. 求点A(1,—2,1)到直线 $l : \frac{x + 3}{2} = \frac{y - 1}{- 3} = \frac{z + 2}{4}$ 的距离.

10.求过点A(-1,2,3)与向量α=(4,3,1)垂直，并与直线 $l:\frac{x - 1}{2} = \frac{y + 2}{1} = \frac{z - 3}{1}$ 相交的直线方程.

11. 求直线 $l:\frac{x - 1}{1} = \frac{y}{1} = \frac{z - 1}{- 1}$ 在平面 $\pi : x - y + 2z - 1 = 0$ 上的投影直线 $l ^ { \prime }$ 的方程。

## 思考题三

1. 对于向量a，b，试解释为什么称 $\| a + b \| \leqslant \| a \| + \| b \|$ 为三角不等式？

2. 设直线l 的方程是 $\begin{cases}A_{1}x + B_{1}y + C_{1}z + D_{1} = 0, \\A_{2}x + B_{2}y + C_{2}z + D_{2} = 0.\end{cases}$ 用

$$\lambda_{1}(A_{1}x + B_{1}y + C_{1}z + D_{1}) + \lambda_{2}(A_{2}x + B_{2}y + C_{2}z + D_{2}) = 0\tag{*}$$

表示经过直线l的平面束方程与用

$$A_{1}x + B_{1}y + C_{1}z + D_{1} + \lambda(A_{2}x + B_{2}y + C_{2}z + D_{2}) = 0\tag{**}$$

[page:109]

表示经过直线l的平面束方程，有何差异？你认为它们的优缺点各在何处？试用式(*)求例9中投影直线l′的方程.

3. 试推导两条空间异面直线的距离公式.

知识点注释三

综合自测题三

[page:110]

## 第四章 n维向量空间

## §4.1 n 维向量空间的概念

## 一、n维向量空间的概念

在第三章几何空间中，如果点P对于坐标原点O的位置向量 $\overrightarrow{OP}$ 是a，那么a的分量就是点P的坐标，因此，向量也就记为 $\boldsymbol{a} = (a_{1}, a_{2}, a_{3})$

我们还定义了向量的线性运算，即向量的加法

重难点分析n维向量空间的概念

$$\boldsymbol{a}+\boldsymbol{b}=(a_{1},a_{2},a_{3})+(b_{1},b_{2},b_{3})=(a_{1}+b_{1},a_{2}+b_{2},a_{3}+b_{3})$$

和向量的数乘

$$k \boldsymbol { a } = ( k a _ { 1 } , k a _ { 2 } , k a _ { 3 } ) ,$$

并且给出了向量的加法与数乘满足八条运算法则:

$$a+b=b+a$$

$$2^{\circ} \quad (a + b) + c = a + (b + c);$$

$$3^{\circ} \quad a + 0 = a ;$$

$$4^{\circ} \quad a + (-a) = 0;$$

$$5^{\circ} \quad 1a = a ;$$

$$6^{\circ} \quad \lambda(\mu a) = (\lambda \mu) a ;$$

$$7^{\circ} \quad \lambda(a+b)=\lambda a+\lambda b;$$

$$8^{\circ} \quad (\lambda + \mu)a = \lambda a + \mu a$$

其中 $\lambda = \mu$ 为数.

对于所有三维向量 $(a_{1}, a_{2}, a_{3})$ 组成的集合，按我们定义的向量的加法与数乘满足八条运算法则，我们称这个集合构成一个三维向量空间，记为 $\mathbf { R } ^ { 3 }$

现在我们把 $\mathbf { R } ^ { 3 }$ 推广到n维向量空间.

n个数 $a_{1},a_{2},\cdots,a_{n}$ 组成的有序数组称为n维向量，记为

$$\boldsymbol{\alpha} = (a_{1}, a_{2}, \cdots, a_{n}).$$

[page:111]

我们也称 $\alpha = (a_{1}, a_{2}, \cdots, a_{n})$ 为n维行向量， $\overline{a}_{i}$ 称为向量α的第i个分量；称

$$\boldsymbol{\beta} = \begin{pmatrix} b_{1} \\ b_{2} \\ \vdots \\ b_{n} \end{pmatrix}$$

为n维列向量 $,b_{i}$ 称为向量 $\beta$ 的第i个分量.分量为实数的向量称为实向量，分量为复数的向量称为复向量

设 $\boldsymbol{\alpha} = (a_{1}, a_{2}, \cdots, a_{n}), \boldsymbol{\beta} = (b_{1}, b_{2}, \cdots, b_{n})$ 为n维向量，若它们的各个分量对应相等，则称α与 $\beta$ 相等，记为 $a = \beta$

定义零向量 $0 = (0, 0, \cdots, 0)$ ，负向量 $- \boldsymbol{a} = ( - a_{1} , - a_{2} , \cdots , - a_{n} )$

记 $\mathbf{R}^{n}$ 为具有n个实分量的一切n维向量的集合，且定义加法和数乘规则如下:

设 $\boldsymbol{\alpha} = (a_{1}, a_{2}, \cdots, a_{n}), \boldsymbol{\beta} = (b_{1}, b_{2}, \cdots, b_{n}), k \in \mathbb{R}$ ,则

$$\begin{aligned}\boldsymbol{\alpha} + \boldsymbol{\beta} &= (a_{1} + b_{1}, a_{2} + b_{2}, \cdots, a_{n} + b_{n}), \\k\boldsymbol{\alpha} &= (ka_{1}, ka_{2}, \cdots, ka_{n}).\end{aligned}$$

向量的加法与数乘满足下列运算规律:

设 $\alpha , \beta , \gamma$ 都是n维向量，k,l是数，

1°α+β=β+α;
2°(α+β)+γ=α+(β+γ);
3° α+0=α;
α+(-α)=0;
5° 1α=α;
6° k(lα)=(kl)α;
7°k(α+β)=kα+kβ;
8° (k+l)α=kα+lα.

$\mathbf{R}^{n}$ 称为n维实向量空间.

实际上，n维行向量可以视为 $1 \times n$ 矩阵，n维列向量可以视为 $n \times 1$ 矩阵.向量的加法及数乘实质上就是矩阵的加法及数乘. $1 ^ { \circ } - 8 ^ { \circ }$ 条运算规律就是矩阵的加法和数乘所满足的八条运算规律.

我们已经看到，对于给定的坐标系，可以把一个物理向量表示为 $\mathbf { R } ^ { 3 }$ 中的向量.在$\mathbf{R}^{n}$ 中引进长度和角度的一般概念仍然是可能的和有用的，后面第五章中我们将这样做.早在17世纪，拉格朗日研究质点运动时，就曾用质点在空间的位置坐标 $(x,y,z)$及时间t这四个有序数 $(x,y,z,t)$ 来描述质点的运动，因而引入了四维向量及四维向量空间的概念.又如，在一个较复杂的控制系统中(如导弹、飞行器等)，决定系统在t时刻的参数，假定最少需要n个 $x_{1}(t),x_{2}(t),\cdots,x_{n}(t)$ ,那么这n个变量就称为系统的状态变量.n维向量 $\boldsymbol{X} = \left( x_{1}(t), x_{2}(t), \cdots, x_{n}(t) \right)$ 就称为系统的状态向量.它的全体就称为系统的状态空间.状态空间中的任一点X(向量)就表示系统的一个状态.

一个 $m \times n$ 矩阵的每一行可看成是一个n维向量，每一列则可看成一个m维向量，它共有m个行向量，n个列向量.

[page:112]

有了向量的运算，于是线性方程组

$$\begin{cases}a_{11}x_{1} + a_{12}x_{2} + \cdots + a_{1n}x_{n} = b_{1}, \\a_{21}x_{1} + a_{22}x_{2} + \cdots + a_{2n}x_{n} = b_{2}, \\\cdots\cdots\cdots\cdots \\a_{m1}x_{1} + a_{m2}x_{2} + \cdots + a_{mn}x_{n} = b_{m}.\end{cases}$$

可以写成以下简单形式:

$$x_{1}\left[\begin{matrix}a_{11} \\a_{21} \\\vdots \\a_{m1}\end{matrix}\right]+x_{2}\left[\begin{matrix}a_{12} \\a_{22} \\\vdots \\a_{m2}\end{matrix}\right]+\cdots+x_{n}\left[\begin{matrix}a_{1n} \\a_{2n} \\\vdots \\a_{mn}\end{matrix}\right]=\left[\begin{matrix}b_{1} \\b_{2} \\\vdots \\b_{m}\end{matrix}\right],$$

即

$$x_{1}\boldsymbol{a}_{1} + x_{2}\boldsymbol{a}_{2} + \cdots + x_{n}\boldsymbol{a}_{n} = \boldsymbol{b}$$

其中 $\boldsymbol{a}_{j}=(a_{1j},a_{2j},\cdots,a_{mj})^{\mathrm{T}}(j=1,2,\cdots,n),\boldsymbol{b}=(b_{1},b_{2},\cdots,b_{m})^{\mathrm{T}}$ .还可写为如下更简单形式:

$$\left( \alpha _ { 1 } , \alpha _ { 2 } , \cdots , \alpha _ { n } \right) X = b$$

其中 $\boldsymbol{X} = (x_{1}, x_{2}, \cdots, x_{n})^{\mathrm{T}}$ .满足上式的X称为方程组 $AX = b$ 的一个解向量.

## 二、 $\mathrm{R}^{n}$ 的子空间

取 $\varnothing \neq V \subset \mathbb { R } ^ { n }$ ，对于 $\mathbf{R}^{n}$ 的运算，V常常也构成一n维向量空间.

定义设 $\varnothing \neq V \subseteq \mathbb{R}^n$ ,如果V对于 $\mathbf{R}^{n}$ 的线性运算也构成一个向量空间，那么称 $V$为 $\mathbf{R}^{n}$ 的一个子空间.

一个非空子集合要满足什么条件才能成为子空间呢?

非空子集合 $V \subset \mathbf{R}^n$ 对于 $\mathbf{R}^{n}$ 中原有的运算，V中的向量满足向量空间定义中的规则 $1^{\circ},2^{\circ},5^{\circ} - 8^{\circ}$ 是显然的.如果V对于 $\mathbf{R}^{n}$ 中原有的运算具有封闭性，那么不难看出规则中的 $3 ^ { \circ } , 4 ^ { \circ }$ 自然也满足.因此，我们得到

定理1 设V为 $\mathbf{R}^{n}$ 的非空子集合.V是 $\mathbf { R } ^ { n }$ 的一个子空间的充分必要条件为V对于 $\mathbf{R}^{n}$ 的加法和数乘运算是封闭的.

例1设 $V = \left\{ \left( x _ { 1 } , x _ { 2 } \right) \mid x _ { 2 } = 2 x _ { 1 } \right\} \subset \mathbb { R } ^ { 2 } , \left( _ { C } , 2 _ { C } \right)$ 为V的任一元素， $k \in \mathbb{R}$ ,则

$$k(c,2c)=(kc,2kc)\in V.$$

设 $(a,2a),(b,2b)$ 为V的任意两元素，则

$$(a,2a)+(b,2b)=(a+b,2(a+b))\in V.$$

易见，V为 $\mathbf{R}^{2}$ 的子空间.

例2在 $\tilde { \mathbf { R } } ^ { 3 }$ 中，由平行四边形法则，过坐标原点的平面上的任两向量的和向量仍在该平面上，其上的任一向量的数乘向量仍在该平面上，故该平面为 $\mathbf { R } ^ { 3 }$ 的一个子空

[page:113]

间.同理，过原点的空间直线也为 $\mathbf{R}^{3}$ 的一个子空间.但是，不过原点的平面或空间直线不是 $\mathbf { \bar { R } } ^ { 3 }$ 的子空间，这是因为 $0$ 不在它们之中，而任何子空间都应是包含零元的(对此，我们可以参见例3).

例3 考虑 $\mathbf { \tilde { R } } ^ { 3 }$ 的子集

$$W = \left\{ (x,y,z) \in \mathbb{R}^3 \mid x + y - z = 1 \right\}.$$

容易验证， $W$ 关于向量的线性运算不封闭.事实上， $\alpha = (1,0,0) \in W$ ，但 $2 a \notin W$ 故 $W$不是 $\mathbf { R } ^ { 3 }$ 的子空间.

## 应用实例:矩阵、向量在计算机图形学中的应用

用几何的术语来说，用矩阵A乘向量v，则向量v变换为另一个向量ω.我们可将Av看成函数 $w = f(v) = A v$ .例如，在计算机图形学中，这种变换用来在电视广告中产生文字与动画.这为一个向量被一个矩阵乘的效果提供了一种可视化的方法.

现在简单地把二维向量表示为平面上的点.考虑

$$\boldsymbol{v}_{1}=\begin{bmatrix}0\\0\end{bmatrix},\boldsymbol{v}_{2}=\begin{bmatrix}2\\0\end{bmatrix},\boldsymbol{v}_{3}=\begin{bmatrix}2\\2\end{bmatrix},\boldsymbol{v}_{4}=\begin{bmatrix}0\\2\end{bmatrix},$$

$$\boldsymbol { v } _ { 5 } = \begin{bmatrix} 1 \\ 0 \end{bmatrix} , \boldsymbol { v } _ { 6 } = \begin{bmatrix} 2 \\ 1 \end{bmatrix} , \boldsymbol { v } _ { 7 } = \begin{bmatrix} 1 \\ 2 \end{bmatrix} , \boldsymbol { v } _ { 8 } = \begin{bmatrix} 0 \\ 1 \end{bmatrix},$$

其中 $v_{1},v_{2},v_{3},v_{4}$ 是一边长为2的正方形的顶点， $v_{5},v_{6},v_{7},v_{8}$ 是这个正方形各边的中点(图4.1(a)).

设 $\boldsymbol{w}_{i}=\boldsymbol{A} \boldsymbol{v}_{i}(i=1,2, \cdots, 8), \boldsymbol{A}=\begin{bmatrix}1 & 1 \\ 1 & -1\end{bmatrix}$ ，则变换后的正方形如图4.1(b)所示:

$$\boldsymbol { w } _ { 1 } = \begin{bmatrix} 0 \\ 0 \end{bmatrix} , \boldsymbol { w } _ { 2 } = \begin{bmatrix} 2 \\ 2 \end{bmatrix} , \boldsymbol { w } _ { 3 } = \begin{bmatrix} 4 \\ 0 \end{bmatrix} , \boldsymbol { w } _ { 4 } = \begin{bmatrix} 2 \\ - 2 \end{bmatrix},$$

$$\boldsymbol{w}_{5}=\begin{bmatrix}1\\1\end{bmatrix},\boldsymbol{w}_{6}=\begin{bmatrix}3\\1\end{bmatrix},\boldsymbol{w}_{7}=\begin{bmatrix}3\\-1\end{bmatrix},\boldsymbol{w}_{8}=\begin{bmatrix}1\\-1\end{bmatrix}.$$

原正方形中点 $v_{5},v_{6},v_{7},v_{8}$ 是如何变换为旋转后正方形的中点向量 $w_{5},w_{6},w_{7},w_{8}$的？如果 $v _ { \mathrm { j } }$ 与 $v _ { 2 }$ 之间的线段不变换为 $w_{1}$ 与 $w_{2}$ 之间的线段，那么要确定 $v_{1}$ 与 $v_{2}$之间的线段上的点如何变换则是冗长乏味的。

下列定理具有重大的实际价值，正如上面提到的，因为我们只需计算出端点被映射到哪里，从而使计算机图形学中的计算得到简化.

以下我们证明，对于 $2 \times 2$ 矩阵A，任何把二维向量v变为二维向量w的变换 $w =$ $A v$ ，总是把直线映成直线.这里给出的证明，用意是说明线性代数与几何之间的关系和线性代数的作用，证明的细节并不重要.

[page:114]

定理2对于任何一个 $2 \times 2$ 矩阵A，二维向量空间的映射 $v \rightarrow w = A v$ 把直线映成直线.把一条直线映射到一点的特殊情况除外.

证向量 $v _ { \perp }$ 与 $v _ { 2 }$ 之间的线段L可表示为向量组

$$L = \left\{ u : u = v _ { 1 } + c \left( v _ { 2 } - v _ { 1 } \right) , 0 \leqslant c \leqslant 1 \right\} .$$

当 $c = 0$ 时，可得 $v_{1}$ .设 $w_{1}=A v_{1}, w_{2}=A v_{2}$ .需证上述映射把L映射到线段

$$L ^ { \prime } = \left\{ y : y = w _ { 1 } + c \left( w _ { 2 } - w _ { 1 } \right) , 0 \leqslant c \leqslant 1 \right\} .$$

下面我们证明:向量 $u = v_{1} + c(v_{2} - v_{1})$ 映射到向量 $y = w_{1} + c(w_{2} - w_{1})$ ,即 y $\equiv A u$

$$\begin{align*}Au = A(v_1 + c(v_2 - v_1)) = A v_1 + c A(v_2 - v_1) \\= w_1 + c(A v_2 - A v_1) = w_1 + c(w_2 - w_1) = y,\end{align*}$$

在 $w_{1} = w_{2}$ 的特殊情况， $, L ^ { \prime }$ 缩为点 $w _ { 1 }$

## 题4.1

1. 求满足下列条件的 $x \in \mathbb{R}^3$ 2

(1) $3x + \beta = \gamma, \beta = (1,0,1), \gamma = (1,1, - 1)$

(2) $2x+3\beta=3x+\gamma,\beta=(2,0,1),\gamma=(3,1,-1).$

2. 分别满足下列条件的集合 $V = \left\{ (x_1, x_2, \cdots, x_n) \right\}$ 是不是 $\mathbf{R}^{n}$ 的子空间? (1) $x_{1} \geqslant 0;$ (2) $x_{1}x_{2}=0$ (3) $x_{1} + x_{2} = 3x_{3}$

## §4.2向量组的线性相关性

## 一、向量组的线性组合

同维数的向量所组成的集合称为向量组.

两个向量 $\alpha , \beta$ 之间最简单的关系是对应分量成比例，即存在数k，使得

$$\alpha = k\beta.$$

[page:115]

在多个向量之间，这一关系推广为线性组合.

定义1对于给定的向量组 $\beta , \alpha _ { 1 } , \alpha _ { 2 } , \cdots , \alpha _ { m }$ ，若存在一组数 $k_{1},k_{2},\cdots,k_{m}$ ,使得

$$\boldsymbol { \beta } = k _ { 1 } \boldsymbol { \alpha } _ { 1 } + k _ { 2 } \boldsymbol { \alpha } _ { 2 } + \cdots + k _ { m } \boldsymbol { \alpha } _ { m } ,$$

则称向量 $\beta$ 为向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 的线性组合，或称向量 $\beta$ 可由向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$线性表出.所有 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性组合的集合用 $L(\alpha_{1},\alpha_{2},\cdots,\alpha_{m})$ 表示.

例如，设 $\boldsymbol{\alpha}_{1}=(1,0,2,-1),\boldsymbol{\alpha}_{2}=(3,0,4,1),\boldsymbol{\beta}=(-1,0,0,-3)$ ，由于

重难点分析向量组定义及其与矩阵的关系

$$\boldsymbol{\beta} = 2\boldsymbol{\alpha}_{1} - \boldsymbol{\alpha}_{2}$$

因而 $\beta$ 是 $\alpha_{1}, \alpha_{2}$ 的线性组合.

例1 零向量是任一向量组的线性组合.

事实上，设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 为任一向量组，有

$$0 = 0 \alpha _ { 1 } + 0 \alpha _ { 2 } + \cdots + 0 \alpha _ { m }$$

例2在 $\mathbf { \bar { R } } ^ { 3 }$ 中,L(i,j,k)是所有形如

重难点分析线性组合与线性表出定义

$$x_{1}\boldsymbol{i}+x_{2}\boldsymbol{j}+x_{3}\boldsymbol{k}=(x_{1},x_{2},x_{3})$$

的向量集合.因此 $\mathbf{R}^{3} = L(i, j, k)$ .同理，

$$\mathbf{R}^{n}=L\left(\boldsymbol{\varepsilon}_{1}, \boldsymbol{\varepsilon}_{2}, \cdots, \boldsymbol{\varepsilon}_{n}\right),$$

其中

$$\boldsymbol{\varepsilon}_{1}=\begin{bmatrix}1 \\ 0 \\ \vdots \\ 0 \end{bmatrix}, \quad \boldsymbol{\varepsilon}_{2}=\begin{bmatrix}0 \\ 1 \\ \vdots \\ 0 \end{bmatrix}, \quad \cdots \quad , \quad \boldsymbol{\varepsilon}_{n}=\begin{bmatrix}0 \\ \vdots \\ 0 \\ 1 \end{bmatrix}.$$

容易证明，设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 为n维向量组，则 $L \left( \alpha _ { 1 } , \alpha _ { 2 } , \cdots , \alpha _ { m } \right)$ 是 $\mathbf{R}^{n}$ 的一个子空间，称之为由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 生成的子空间.

例3向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 中任一向量都可用这个向量组线性表出.

因为

$$\boldsymbol{\alpha}_{i}=0 \boldsymbol{\alpha}_{1}+0 \boldsymbol{\alpha}_{2}+\cdots+0 \boldsymbol{\alpha}_{i-1}+1 \boldsymbol{\alpha}_{i}+0 \boldsymbol{\alpha}_{i+1}+\cdots+0 \boldsymbol{\alpha}_{m}$$

所以 $\alpha_{i} \left( i = 1, 2, \cdots, m \right)$ 可由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性表出.

下面我们来看线性组合及矩阵的秩与非齐次线性方程组之间的联系.设向量组

$$\boldsymbol{\alpha}_{1}=\begin{bmatrix}a_{11}\\a_{21}\\\vdots\\a_{m1}\end{bmatrix},\quad\boldsymbol{\alpha}_{2}=\begin{bmatrix}a_{12}\\a_{22}\\\vdots\\a_{m2}\end{bmatrix},\quad\cdots,\quad\boldsymbol{\alpha}_{n}=\begin{bmatrix}a_{1n}\\a_{2n}\\\vdots\\a_{mn}\end{bmatrix},\tag{4.1}$$

记

[page:116]

$$\boldsymbol{A} = \left( \boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{2}, \cdots, \boldsymbol{\alpha}_{n} \right), \quad \boldsymbol{X} = \left( x_{1}, x_{2}, \cdots, x_{n} \right)^{\mathrm{T}}, \quad \boldsymbol{b} = \left( b_{1}, b_{2}, \cdots, b_{n} \right)^{\mathrm{T}},$$

则非齐次线性方程组 $AX = b$ 与线性组合及矩阵的秩有如下重要结果:

定理1 设有向量组(4.1) $\boldsymbol{A} = ( \boldsymbol{\alpha}_{1} , \boldsymbol{\alpha}_{2} , \cdots , \boldsymbol{\alpha}_{n} )$ ，则下列命题等价:

$$b \in L \left( \alpha _ { 1 } , \alpha _ { 2 } , \cdots , \alpha _ { n } \right) ;$$

$2^{\circ} \quad AX = b$ 有解；

3°R(A,b)=R(A).

证 $1 ^ { \circ } \leftrightarrow 2 ^ { \circ }$ :向量b 可由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 线性表出，即有数 $x_{1},x_{2},\cdots,x_{n}$ ，使得

$$x_{1}\alpha_{1} + x_{2}\alpha_{2} + \cdots + x_{n}\alpha_{n} = b$$

即有

$$\left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { n } \right) \begin{bmatrix} x _ { 1 } \\ x _ { 2 } \\ \vdots \\ x _ { n } \end{bmatrix} = \boldsymbol { b } ,$$

即有 $\boldsymbol{X} = (x_{1}, x_{2}, \cdots, x_{n})^{\mathrm{T}}$ ,使

$$A X = b ,$$

也就是线性方程组AX=b有解 $\boldsymbol{X} = (x_1, x_2, \cdots, x_n)^{\mathrm{T}}$ .上述步骤可逆，故 $1 ^ { \circ } \leftrightarrow 2 ^ { \circ }$

$2 ^ { \circ } \leftrightarrow 3 ^ { \circ }$ :设 $R(A) = r$ ，因初等变换不改变矩阵的秩，于是对增广矩阵(A，b)作行初等变换可得

$$\left( \boldsymbol { A } , \boldsymbol { b } \right) \xrightarrow { } \begin{bmatrix} c _ { 1 1 } & \cdots & c _ { 1 s } & \cdots & c _ { 1 n } \\ & \ddots & \vdots & & \vdots & \vdots \\ & & c _ { r s } & \cdots & c _ { r n } \\ & & & \vdots & & \vdots \\ & & & & & \vdots \\ & & & & & \vdots \\ & & & & & \vdots \\ & & & & & 0 \end{bmatrix} \xrightarrow { } \left( \boldsymbol { B } , \boldsymbol { d } \right),$$

$AX = b$ 与BX=d同解.因此

$$A\boldsymbol{X} = \boldsymbol{b}  有解  \Leftrightarrow d_{r+1} = 0 \Leftrightarrow R(\boldsymbol{B}, \boldsymbol{d}) = R(\boldsymbol{B}) = r$$

即AX=b有解等价于 $R\left(A,b\right)=R\left(A\right)=r$

故定理结论成立.

该定理中的 $2 ^ { \circ }$ 与 $3 ^ { \circ }$ 的等价性常被称作方程组AX=b有解的判别定理.

例4 线性方程组 $\begin{cases}x_{1} = b_{1} \\5x_{1} + 4x_{2} = b_{2} \\2x_{1} + 4x_{2} = b_{3}\end{cases}$ ，有解的充要条件是 $\boldsymbol{b} = (b_{1}, b_{2}, b_{3})^{\mathrm{T}}$ 可由 $\alpha_{1}  三$

$(1,5,2)^{\mathrm{T}}, \boldsymbol{\alpha}_{2} = (0,4,4)^{\mathrm{T}}$ 线性表出，其几何意义就是b在 $\alpha_{1},\alpha_{2}$ 张成的平面上.

例5证明:向量 $\boldsymbol{\beta} = (-1,1,5)^{\mathrm{T}}$ 是向量 $\boldsymbol{\alpha}_{1}=(1,2,3)^{\mathrm{T}}, \boldsymbol{\alpha}_{2}=(0,1,4)^{\mathrm{T}}, \boldsymbol{\alpha}_{3}=(2$ $3 , 6 ) ^ { \mathrm { T } }$ 的线性组合，并具体将 $\beta$ 用 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性表出.

[page:117]

证 只需考察线性方程组

$$\begin{pmatrix}1 & 0 & 2 \\2 & 1 & 3 \\3 & 4 & 6\end{pmatrix}\boldsymbol{X} =\begin{bmatrix}-1 \\1 \\5\end{bmatrix},$$

$$\overline{A} = \begin{vmatrix} 1 & 0 & 2 & -1 \\ 2 & 1 & 3 & 1 \\ 3 & 4 & 6 & 5 \end{vmatrix} \rightarrow \begin{vmatrix} 1 & 0 & 2 & -1 \\ 0 & 1 & -1 & 3 \\ 0 & 4 & 0 & 8 \end{vmatrix}$$

$$\begin{aligned}\rightarrow\begin{bmatrix}1 & 0 & \quad 2 \vdots - 1 \\0 & 1 & - 1 \vdots \quad 3 \\0 & 0 & \quad 1 \vdots - 1\end{bmatrix}\rightarrow\begin{bmatrix}1 & 0 & 0 \vdots & \quad 1 \\0 & 1 & 0 \vdots & \quad 2 \\0 & 0 & 1 \vdots - 1\end{bmatrix},\end{aligned}$$

解得 $x_{1}=1,x_{2}=2,x_{3}=-1$ .故 $\beta$ 可由 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性表出，且

$$\boldsymbol{\beta} = \boldsymbol{\alpha}_{1} + 2\boldsymbol{\alpha}_{2} - \boldsymbol{\alpha}_{3}.$$

定义2设有两个向量组

$$\left( \mathrm { I } \right) : \alpha _ { 1 } , \alpha _ { 2 } , \cdots , \alpha _ { r } , \quad \left( \mathrm { I I } \right) : \beta _ { 1 } , \beta _ { 2 } , \cdots , \beta _ { r } ,$$

若向量组(Ⅰ)中每个向量都可由向量组(Ⅱ)中的向量线性表出，则称向量组(Ⅰ)可由向量组(Ⅱ)线性表出.若向量组(I)与向量组(Ⅱ)可互相线性表出，则称它们等价.

不难证明，向量组等价关系有下述性质:

(1)反身性 每一个向量组都与其自身等价；

(2)对称性如果向量组(I)与向量组(Ⅱ)等价，则向量组（Ⅱ)与向量组（Ⅰ)等价；

(3)传递性如果向量组(I)与向量组(Ⅱ)等价，向量组(Ⅱ)与向量组(Ⅲ)等价，则向量组(Ⅰ)与向量组(Ⅲ)等价.

## 二、向量组的线性相关性

向量组的线性相关性是向量在线性运算下的一种性质，是线性代数中极重要的基本概念.我们先来讨论一下它在三维空间中的某些几何背景.

若两个向量 $\alpha _ { \perp }$ 和 $\alpha _ { 2 }$ 共线，则 $\alpha_{2}=l\alpha_{1}(l\in\mathbf{R})$ .这等价于，存在不全为零的数 $k _ { 1 }$ $\vec { R } _ { 2 }$ ,使 $k_{1} \boldsymbol{\alpha}_{1} + k_{2} \boldsymbol{\alpha}_{2} = \boldsymbol{0}$

若 $\alpha _ { 1 }$ 和 $\alpha _ { 2 }$ 不共线，则 $V l \in R$ ,有 $\alpha_{2} \neq \alpha_{1}$ .它等价于，只有当 $k _ { 1 } , k _ { 2 }$ 全为零时，才有 $k_{1} \boldsymbol{\alpha}_{1} + k_{2} \boldsymbol{\alpha}_{2} = \mathbf{0}$

若三个向量 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 共面，则其中至少一个向量可用另两个向量线性表示，如图 4.2 中: $\boldsymbol{\alpha}_{3}=l_{1} \boldsymbol{\alpha}_{1}+l_{2} \boldsymbol{\alpha}_{2}$ ;图4.3 中: $\boldsymbol{\alpha}_{1} = 0\boldsymbol{\alpha}_{2} + l_{3}\boldsymbol{\alpha}_{3}$ ，二者都等价于存在不全为零的数 $k_{1},k_{2},k_{3}$ ,使

$$k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + k_{3}\boldsymbol{\alpha}_{3} = \boldsymbol{0}.$$

[page:118]

若 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 不共面(图4.4)，则任一个向量都不能由另两个向量线性表示.即只有当$k_{1},k_{2},k_{3}$ 全为零时，才有 $k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + k_{3}\boldsymbol{\alpha}_{3} = \mathbf{0}$ Aα.=k

上述三维向量在线性运算下的性质，即一组向量中是否存在一个向量可由其余向量线性表示，或是否有不全为零的系数使向量组的线性组合为零向量，就是向量组的线性相关性.n维向量组的线性相关性的一般定义如下:

定义3 设n维向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ ，若存在一组不全为零的数 $k_{1},k_{2},\cdots,k_{m}$ ,使得

图 4.4

$$k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + \cdots + k_{m}\boldsymbol{\alpha}_{m} = \boldsymbol{0},\tag{4.2}$$

则称 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性相关；否则，称 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性无关，即仅当 $k_{1}=k_{2}=\cdots=$ $k_{m} = 0$ 时，式(4.2)才成立.

根据定义3，容易得到下列基本性质:

（1）对于只含一个向量α的向量组，线性相关的充分必要条件是这个向量为零向量；线性无关的充分必要条件是这个向量不是零向量.

事实上，由定义3，若α线性相关，则存在数 $k \neq 0$ ，使得 $k \alpha = 0$ ，因此， $\alpha = 0$ ；反之，若 $\alpha = 0$ ,取 $k = 1 \neq 0$ ,即有 $1\alpha = 0$ ，因而α线性相关.

(2)两个向量线性相关(无关)的充分必要条件是它们的各分量对应成(不成)比例.

事实上，若 $k_{1} \boldsymbol{\alpha}_{1} + k_{2} \boldsymbol{\alpha}_{2} = \mathbf{0}$ ，且 $k_{1} \neq 0$ ,则得

$$\alpha_{1} = - \frac{k_{2}}{k_{1}} \alpha_{2}$$

因而 $\alpha_{1}$ 各分量与 $\alpha_{2}$ 各对应分量成比例；反之，若有数k使 $\alpha_{1} = k\alpha_{2}$ ,即

$$1 \alpha _ { 1 } - k \alpha _ { 2 } = 0 ,$$

因而 $\alpha_{1}, \alpha_{2}$ 线性相关.

可见，在 $\vec{\mathrm{R}}^2$ 和 $\mathbf { \hat { R } } ^ { 3 }$ 中，两向量共线(或平行)的充分必要条件是它们线性相关.

设 $\boldsymbol{X} = \begin{bmatrix} x_{1} \\ x_{2} \\ x_{3} \end{bmatrix}, \boldsymbol{Y} = \begin{bmatrix} y_{1} \\ y_{2} \\ y_{3} \end{bmatrix}$ 是 $\overline{\mathbf{R}}^{3}$ 中线性无关的向量，则点 $(x_{1},x_{2},x_{3})$ 和点 $( y _ { 1 } , y _ { 2 }$ $y _ { 3 }$ 不在 $\mathbf { R } ^ { 3 }$ 中过坐标原点的同一直线上.因为三点 $\begin{array}{l}(0,0,0),(x_{1},x_{2},x_{3}),(y_{1},y_{2},y_{3})\end{array}$不共线，它们决定一平面.如果点 $( z _ { 1 } , z _ { 2 } , z _ { 3 } )$ 位于这平面上，向量 $\hat { \boldsymbol { Z } } = ( z _ { 1 } , z _ { 2 } , z _ { 3 } ) ^ { \mathrm { T } }$ 可写成X和Y的线性组合，因而X,Y和Z线性相关.如果点 $(z_{1},z_{2},z_{3})$ 不位于这平面

[page:119]

上，则这三个向量线性无关.

例6 n维单位向量组 $\boldsymbol{\varepsilon}_{1}=\left(\begin{array}{c}1 \\0 \\\vdots \\0\end{array}\right), \boldsymbol{\varepsilon}_{2}=\left(\begin{array}{c}0 \\1 \\\vdots \\0\end{array}\right), \cdots, \boldsymbol{\varepsilon}_{n}=\left(\begin{array}{c}0 \\0 \\\vdots \\1\end{array}\right)$ 线性无关.

证考察 $x_{1}\boldsymbol{\varepsilon}_{1}+x_{2}\boldsymbol{\varepsilon}_{2}+\cdots+x_{n}\boldsymbol{\varepsilon}_{n}=\mathbf{0}$ ,即

$$x_{1}\left[\begin{array}{c}1 \\0 \\\vdots \\0\end{array}\right]+x_{2}\left[\begin{array}{c}0 \\1 \\\vdots \\0\end{array}\right]+\cdots+x_{n}\left[\begin{array}{c}0 \\0 \\\vdots \\1\end{array}\right]=\left[\begin{array}{c}0 \\0 \\\vdots \\0\end{array}\right],$$

即 $\left[ \begin{matrix} { x _ { 1 } } \\ { x _ { 2 } } \\ { \vdots } \\ { x _ { n } } \\ \end{matrix} \right] = \left[ \begin{matrix} { 0 } \\ { 0 } \\ { \vdots } \\ { 0 } \\ \end{matrix} \right]$ ,于是 $x_{1}=x_{2}=\cdots=x_{n}=0$ ,即 $\varepsilon_{1}, \varepsilon_{2}, \cdots, \varepsilon_{n}$ 线性无关.

特别地，在 $\mathbf{R}^{2}$ 中 $, i , j$ 线性无关；在 $\mathbf{R}^{3}$ 中 $, i , j , k$ 线性无关.

例7 含有零向量的向量组线性相关.

证设向量组为 $0,\alpha_{1},\alpha_{2},\cdots,\alpha_{m}$ ,因为

$$10 + 0\alpha_{1} + \cdots + 0\alpha_{m} = 0$$

所以结论成立.

一般地，n个m维向量(用列向量形式表示)

$$\boldsymbol{\alpha}_{1}=\left[\begin{aligned}a_{11} \\a_{21} \\\vdots \\a_{m1}\end{aligned}\right], \quad\boldsymbol{\alpha}_{2}=\left[\begin{aligned}a_{12} \\a_{22} \\\vdots \\a_{m2}\end{aligned}\right], \quad\cdots, \quad\boldsymbol{\alpha}_{n}=\left[\begin{aligned}a_{1n} \\a_{2n} \\\vdots \\a_{mn}\end{aligned}\right]\tag{4.3}$$

是否线性相关的问题，也就是

$$x_{1}\alpha_{1} + x_{2}\alpha_{2} + \cdots + x_{n}\alpha_{n} = 0,\tag{4.4}$$

即

$$\left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { n } \right) \begin{bmatrix} x _ { 1 } \\ x _ { 2 } \\ \vdots \\ x _ { n } \end{bmatrix} = \mathbf{0} ,$$

即 $AX = 0$ 有无非零解的问题，其中

$$\boldsymbol{A} = \left( \boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{2}, \cdots, \boldsymbol{\alpha}_{n} \right) = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{bmatrix}, \quad \boldsymbol{X} = \begin{bmatrix} x_{1} \\ x_{2} \\ \vdots \\ x_{n} \end{bmatrix}.$$

[page:120]

定理2 设有m维向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}, A = (\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n})$ ，则下列三命题等价:$1^{\circ} \quad \alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 线性相关；

$2^{\circ} \quad AX = 0$ 有非零解；

$$3^{\circ} \quad R\left ( A \right ) < n.$$

证设向量组(4.3)线性相关，据定义3，有不全为零的数 $x_{1},x_{2},\cdots,x_{n}$ 使式(4.4)成立，即方程组 $AX = 0$ 有非零解.上述步骤可逆，故 $1 ^ { 9 }$ 与 $2 ^ { \circ }$ 等价.

另一方面，将A作行初等变换可得

$$\boldsymbol{A} \rightarrow \begin{bmatrix} c_{11} & \cdots & c_{1s} & \cdots & c_{1n} \\ & \ddots & \vdots & & \vdots \\ & & c_{rs} & \cdots & c_{rn} \end{bmatrix} = \boldsymbol{B}.$$

$AX = \mathbf{0}$ 与 $B X \equiv 0$ 同解，且 $R\left ( A \right ) = R\left ( B \right ) = r$ .由§1.2的定理2知，当 $r \leq n$ 时， $B X = 0$有非零解；又当 $r = n$ 时， $B X = 0$ 显然只有零解.故 $A X = 0$ 有非零解的充分必要条件是$R(A) < n$ .即 $2 ^ { \circ }$ 与 $3 ^ { \circ }$ 等价.

特别地，若 $m = n$ ，即向量组中向量个数等于向量维数时，A为方阵，由 $\det A \neq 0$当且仅当 $R(A)=n$ ,有

推论1 设有η维向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}, A = (\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n})$ ，则下列三命题等价:$1^{\circ} \quad \alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 线性相关(无关);

$2^{\circ} \quad AX = 0$ 有非零解(只有零解)；

$$3^{\circ} \quad \det A = 0 (\neq 0).$$

对于向量个数大于向量维数的向量组(即 $n > m$ 有

推论2 设m维向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}, n > m$ ,则 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 必线性相关.

证设 $\boldsymbol{A} = \left( \boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{2}, \cdots, \boldsymbol{\alpha}_{n} \right)_{m \times n}$ ,由 $n > m$ 知 R $(A) \leq m < n$ ，于是由定理2有 $\alpha_{1}$ $\alpha_{2},\cdots,\alpha_{n}$ 线性相关.

由推论1和推论2可知，三维向量空间 $\mathbf{R}^{3}$ 中任意四个向量必线性相关，而任意三个向量线性相关的充分必要条件是它们共面.

在 $\mathbf{R}^{n}$ 中，任意 $\bar{n} + 1$ 个向量都是线性相关的，因此，任一线性无关的n维向量组中最多含有n个向量.

例8判断向量组 $\alpha_{1} = (2, - 1,7), \alpha_{2} = (1,4,11), \alpha_{3} = (3, - 6,3)$ 的线性相关性.

典型例题讲解向量数等于分量数时线性相关性的判定

解一因为

$$\det A = \det( \boldsymbol{\alpha}_{1}^{\top}, \boldsymbol{\alpha}_{2}^{\top}, \boldsymbol{\alpha}_{3}^{\top} ) = \left| \begin{matrix} 2 & 1 & 3 \\ -1 & 4 & -6 \\ 7 & 11 & 3 \end{matrix} \right| = 0,$$

故 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性相关.

解二由行初等变换，有

$$\boldsymbol{A} = \left( \boldsymbol{\alpha}_{1}^{\mathrm{T}}, \boldsymbol{\alpha}_{2}^{\mathrm{T}}, \boldsymbol{\alpha}_{3}^{\mathrm{T}} \right) = \begin{bmatrix} 2 & 1 & 3 \\ -1 & 4 & -6 \\ 7 & 11 & 3 \end{bmatrix} \rightarrow \begin{bmatrix} -1 & 4 & -6 \\ 0 & 1 & -1 \\ 0 & 0 & 0 \end{bmatrix},$$

[page:121]

所以 $R\left ( A \right ) = 2 < 3$ ,故 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性相关.

例9 若向量组 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关，则 $\beta _ { 1 } = \alpha _ { 1 } + \alpha _ { 2 } , \beta _ { 2 } = \alpha _ { 2 } + \alpha _ { 3 } , \beta _ { 3 } = \alpha _ { 3 } + \alpha _ { 1 }$ 也线性无关.

证设有数 $x_{1} + x_{2} + x_{3}$ ,使

$$x_{1}\boldsymbol{\beta}_{1} + x_{2}\boldsymbol{\beta}_{2} + x_{3}\boldsymbol{\beta}_{3} = \mathbf{0},$$

即

$$x_{1}(\boldsymbol{\alpha}_{1}+\boldsymbol{\alpha}_{2})+x_{2}(\boldsymbol{\alpha}_{2}+\boldsymbol{\alpha}_{3})+x_{3}(\boldsymbol{\alpha}_{3}+\boldsymbol{\alpha}_{1})=\mathbf{0},$$

整理得

$$\left( x _ { 1 } + x _ { 3 } \right) \boldsymbol { \alpha } _ { 1 } + \left( x _ { 1 } + x _ { 2 } \right) \boldsymbol { \alpha } _ { 2 } + \left( x _ { 2 } + x _ { 3 } \right) \boldsymbol { \alpha } _ { 3 } = \mathbf { 0 } ,$$

因为 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关，故仅有

$$\begin{cases}x_{1} + x_{2} = 0, \\x_{1} + x_{2} = 0, \\x_{2} + x_{3} = 0.\end{cases}\tag{4.5}$$

由 $\left| \begin{matrix} { 1 } & { 0 } & { 1 } \\ { 1 } & { 1 } & { 0 } \\ { 0 } & { 1 } & { 1 } \\ \end{matrix} \right| { = } 2 { \neq } 0 .$ 知方程组(4.5)只有零解 $x_{1} = x_{2} = x_{3} = 0$ ,故 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \boldsymbol{\beta}_{3}$ 线性无关.

下面，我们再来介绍关于向量组线性相关性的几个基本结论

定理3向量组中有一部分向量(称为部分组)线性相关，则整个向量组线性相关.证设向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 中有r个 $(r \leqslant m)$ 向量的部分组线性相关，不妨设$\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r}$ 线性相关，则有不全为零的数 $k_{1},k_{2},\cdots,k_{i}$ ,使

$$k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + \cdots + k_{r}\boldsymbol{\alpha}_{r} = \mathbf{0}$$

成立.改写上式为

$$k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + \cdots + k_{r}\boldsymbol{\alpha}_{r} + 0\boldsymbol{\alpha}_{r + 1} + \cdots + 0\boldsymbol{\alpha}_{m} = \boldsymbol{0},$$

显然 $k_{1},k_{2},\cdots,k_{r},0,\cdots,0$ 也是一组不全为零的数，故 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r}, \alpha_{r + 1}, \cdots, \alpha_{m}$ 也线性相关.

定理3常叙述为:线性无关的向量组的任何一部分组都线性无关.即所谓的:“若部分相关，则整体相关”；“若整体无关，则部分无关”.

定理4 向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m} (m \geqslant 2)$ 线性相关的充分必要条件是其中至少有一个向量可以由其余 $m - 1$ 个向量线性表出.

证必要性:设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性相关，即有不全为零的数 $k_{1},k_{2},\cdots,k_{m}$ ,使

$$k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + \cdots + k_{m}\boldsymbol{\alpha}_{m} = \boldsymbol{0},$$

因 $k_{1},k_{2},\cdots,k_{m}$ 中至少有一个不为零，不妨设 $k _ { 1 } \neq 0$ ，则有

$$\boldsymbol { \alpha } _ { 1 } = \left( - \frac { k _ { 2 } } { k _ { 1 } } \right) \boldsymbol { \alpha } _ { 2 } + \left( - \frac { k _ { 3 } } { k _ { 1 } } \right) \boldsymbol { \alpha } _ { 3 } + \cdots + \left( - \frac { k _ { m } } { k _ { 1 } } \right) \boldsymbol { \alpha } _ { m } ,$$

[page:122]

即 $\alpha _ { 1 }$ 可由其余向量线性表出.

充分性:设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 中有一个向量(不妨设 $\overline{a}_{1})$ 能由其余向量线性表出，即有数 $l_{2}, l_{3}, \cdots, l_{m}$ ,使得

$$\boldsymbol { \alpha } _ { 1 } = l _ { 2 } \boldsymbol { \alpha } _ { 2 } + l _ { 3 } \boldsymbol { \alpha } _ { 3 } + \cdots + l _ { m } \boldsymbol { \alpha } _ { m } ,$$

即

$$( - 1 ) \boldsymbol { \alpha } _ { 1 } + l _ { 2 } \boldsymbol { \alpha } _ { 2 } + \cdots + l _ { m } \boldsymbol { \alpha } _ { m } = \boldsymbol { 0 } ,$$

因 $-1, l_{2}, \cdots, l_{m}$ 不全为零，故 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性相关.

定理4也就是， $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性无关的充分必要条件是其中任一向量均不能由其余向量线性表出.

定理5 若向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性无关，而 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}, \beta$ 线性相关，则 $\beta$ 可由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性表出，且表示式惟一.

证由于 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}, \beta$ 线性相关，即有不全为零的数 $k_{1},k_{2},\cdots,k_{m},k$ ,使

$$k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + \cdots + k_{m}\boldsymbol{\alpha}_{m} + k\boldsymbol{\beta} = \boldsymbol{0}.$$

再证 $k \neq 0$ ，否则得

$$k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + \cdots + k_{m}\boldsymbol{\alpha}_{m} = \boldsymbol{0},$$

而 $k_{1},k_{2},\cdots,k_{m}$ 不全为零，此与 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性无关矛盾，故 $k \neq 0$ 于是

$$\boldsymbol { \beta } = \left( - \frac { k _ { 1 } } { k } \right) \boldsymbol { \alpha } _ { 1 } + \left( - \frac { k _ { 2 } } { k } \right) \boldsymbol { \alpha } _ { 2 } + \cdots + \left( - \frac { k _ { m } } { k } \right) \boldsymbol { \alpha } _ { m } ,$$

即 $\beta$ 可由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性表出.

为了证 $\beta$ 由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性表出的表示式惟一，设有两种表示式

$$\begin{aligned}\boldsymbol{\beta} &= l_{1}\boldsymbol{\alpha}_{1} + l_{2}\boldsymbol{\alpha}_{2} + \cdots + l_{m}\boldsymbol{\alpha}_{m} , \\\boldsymbol{\beta} &= s_{1}\boldsymbol{\alpha}_{1} + s_{2}\boldsymbol{\alpha}_{2} + \cdots + s_{m}\boldsymbol{\alpha}_{m} ,\end{aligned}$$

两式相减得

$$\left( l _ { 1 } - s _ { 1 } \right) \boldsymbol { \alpha } _ { 1 } + \left( l _ { 2 } - s _ { 2 } \right) \boldsymbol { \alpha } _ { 2 } + \cdots + \left( l _ { m } - s _ { m } \right) \boldsymbol { \alpha } _ { m } = \mathbf { 0 } ,$$

由于 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性无关，所以

$$l_{1}-s_{1}=l_{2}-s_{2}=\cdots=l_{m}-s_{m}=0,$$

即 $l_{i}=s_{i}\left ( i=1,2,\cdots ,m \right )$ ，故 $\beta$ 可由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 惟一地线性表出.

例10设

$$\boldsymbol{\alpha}_{1} = \begin{pmatrix} 1 \\ -1 \\ 1 \end{pmatrix}, \quad \boldsymbol{\alpha}_{2} = \begin{pmatrix} -1 \\ 0 \\ 1 \end{pmatrix}, \quad \boldsymbol{\alpha}_{3} = \begin{pmatrix} 1 \\ 3 \\ -2 \end{pmatrix}, \quad \boldsymbol{\alpha}_{4} = \begin{pmatrix} 0 \\ -5 \\ 5 \end{pmatrix},$$

问:(1) $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 是否线性相关？(2) $\alpha _ { 4 }$ 可否由 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性表出？若能，则求其表示式.

解（1）作矩阵

[page:123]

$$\boldsymbol{A} = \left( \boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{2}, \boldsymbol{\alpha}_{3} \right) = \begin{bmatrix} 1 & -1 & 1 \\ -1 & 0 & 3 \\ 1 & 1 & -2 \end{bmatrix} \rightarrow \begin{bmatrix} 1 & -1 & 1 \\ 0 & -1 & 4 \\ 0 & 0 & 5 \end{bmatrix},$$

因而 $R\left ( A \right ) = 3 = n$ ，由定理2知 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关.

(2) 由 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关，而 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 显然线性相关(向量个数4大于向量维数3），所以由定理5知 $\alpha _ { + }$ 可由 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性表出，且表示式惟一.设

$$x_{1}\boldsymbol{\alpha}_{1} + x_{2}\boldsymbol{\alpha}_{2} + x_{3}\boldsymbol{\alpha}_{3} = \boldsymbol{\alpha}_{4}$$

即

$$\overline{A} = \begin{pmatrix}1 & -1 & 1 \vdots & 0 \\-1 & 0 & 3 \vdots & -5 \\1 & 1 & -2 \vdots & 5\end{pmatrix} \xrightarrow{} \begin{pmatrix}1 & -1 & 1 \vdots & 0 \\0 & -1 & 4 \vdots & -5 \\0 & 2 & -3 \vdots & 5\end{pmatrix}$$

$$\begin{aligned}\rightarrow\begin{vmatrix}1 & -1 & 1 & 0 \\0 & 1 & -4 & 5 \\0 & 0 & 1 & -1\end{vmatrix}\rightarrow\begin{vmatrix}1 & 0 & 0 & 2 \\0 & 1 & 0 & 1 \\0 & 0 & 1 & -1\end{vmatrix},\end{aligned}$$

得惟一解 $x_{1}=2,x_{2}=1,x_{3}=-1$ ,故 $\alpha_{4} = 2\alpha_{1} + \alpha_{2} - \alpha_{3}$

## 题4.2

1. 把向量β表示成向量组 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 的线性组合:

(1) $\boldsymbol{\beta} = (0,2,0,-1), \boldsymbol{\alpha}_{1} = (1,1,1,1), \boldsymbol{\alpha}_{2} = (1,1,1,0), \boldsymbol{\alpha}_{3} = (1,1,0,0)$ α=(1,0,0,0);

(2) $\boldsymbol{\beta}=(0,1,0,1,0),\boldsymbol{\alpha}_{1}=(1,1,1,1,1),\boldsymbol{\alpha}_{2}=(1,2,1,3,1),\boldsymbol{\alpha}_{3}=(1,1,0,1,0)$ α =(2,2,0,0,0).

2. 判断下列向量组的线性相关性:

(1) $\alpha_{1} = (1,1,1), \alpha_{2} = (1,2,3), \alpha_{3} = (1,6,3)$

(2) $\boldsymbol{\alpha}_{1}=(1,2,3),\boldsymbol{\alpha}_{2}=(1,-4,1),\boldsymbol{\alpha}_{3}=(1,14,7)$

(3) $\boldsymbol{\alpha}_{1}=(2,3),\boldsymbol{\alpha}_{2}=(-3,1),\boldsymbol{\alpha}_{3}=(0,-2);$

(4) $\boldsymbol{\alpha}_{1}=(4,3,-1,1,-1),\boldsymbol{\alpha}_{2}=(2,1,-3,2,-5),\boldsymbol{\alpha}_{3}=(1,-3,0,1,-2)$

$$\bar{\alpha}_{4} = (1,5,2,-1,6).$$

3. 已知 $\boldsymbol{\alpha}_{1}=(1,2,3),\boldsymbol{\alpha}_{2}=(3,-1,2),\boldsymbol{\alpha}_{3}=(2,3,c)$ ，问:

(1) 当c 取何值时， $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性相关?并将 $\alpha _ { 3 }$ 表示为 $\alpha_{1}, \alpha_{2}$ 的线性组合；

(2) 当c 为何值时， $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关?

$$\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$$

$$\alpha_{1} + \alpha_{2} , \alpha_{2} + \alpha_{3} , \alpha_{3} + \alpha_{4} , \alpha_{4} + \alpha_{1}$$

5. 证明:若 $\alpha_{1},\alpha_{2}$ 线性无关，则 $\alpha_{1} + \alpha_{2} , \alpha_{1} - \alpha_{2}$ 线性无关.

6. 设 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关，问l,m满足什么条件时，向量组 $l \alpha_{2} - \alpha_{1}, m \alpha_{3} - \alpha_{2}, \alpha_{1} -$ $\alpha _ { 3 }$ 也线性无关?

[page:124]

7.证明:若 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性相关，且 $\alpha _ { 3 }$ 不能用 $\alpha _ { \perp }$ 和 $\alpha _ { 2 }$ 线性表示，则向量 $\alpha _ { 1 }$ 和 $\alpha _ { 2 }$ 仅差一数值因子.

8. 设α是向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 的线性组合，但不是 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m-1}$ 的线性组合.证明: $\alpha _ { m }$ 是 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m-1}, \alpha$ 的线性组合.

9.证明:矩阵 $\begin{pmatrix}a & b & c \\0 & d & e \\0 & 0 & f\end{pmatrix}$ 的列向量组线性相关的充要条件是对角元至少有一个为零.

10.证明:r维向量组的每个向量添上n一r个分量，成为n维向量组，若r维向量组线性无关，则n维向量组也线性无关.

## §4.3向量组的秩与极大无关组

## 一、向量组的秩与极大无关组

m个n维向量形成的向量组的线性相关性是就全体m个向量而言的.但是，其中最多有多少个向量是线性无关的呢?

例如，设 $\boldsymbol{\alpha}_{1}=(1,0,1),\boldsymbol{\alpha}_{2}=(1,-1,1),\boldsymbol{\alpha}_{3}=(2,0,2)$ ，可以验证， $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性相关.但其中部分向量 $\alpha_{1}, \alpha_{2}$ 及 $\alpha_{2}, \alpha_{3}$ 是线性无关的，它们都含有两个线性无关的向量.

从该例可以看出， $\alpha_{1},\alpha_{2}$ 及 $a_{2},a_{3}$ 这两个线性无关向量组中，如果再添加一个向量进去，它们就变成线性相关的了.可见它们在该向量组中作为一个线性无关向量组，所包含的向量个数达到了最多.为此，我们引出向量组的秩与极大无关组的概念.

## 定义 设向量组T满足

1°在 T 中有r个向量 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 线性无关；

$\widehat { 2 } ^ { \circ } \quad \widehat { T }$ 中任意r+1个向量(如果T中有r+1个向量)都线性相关；

则称 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r}$ 是向量组T的一个极大线性无关组，简称为极大无关组，数r称为向量组T的秩.

规定，只含零向量的向量组的秩为零

例1 求向量组 $\boldsymbol{\alpha}_{1}=(2,1,3,-1),\boldsymbol{\alpha}_{2}=(3,-1,2,0),\boldsymbol{\alpha}_{3}=(1,3,4,-2),\boldsymbol{\alpha}_{4}=$ (4，—3，1,1)的秩和一个极大无关组.

解显然 $\alpha_{1}, \alpha_{2}$ 线性无关，而

$$A = ( \boldsymbol { \alpha } _ { 1 } ^ { \top } , \boldsymbol { \alpha } _ { 2 } ^ { \top } , \boldsymbol { \alpha } _ { 3 } ^ { \top } ) = \begin{pmatrix} 2 & 3 & 1 \\ 1 & - 1 & 3 \\ 3 & 2 & 4 \\ - 1 & 0 & - 2 \end{pmatrix} \xrightarrow{} \begin{pmatrix} 1 & - 1 & 3 \\ 0 & 1 & - 1 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix},$$

可见 $R(A)=2<n=3$ 所以 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性相关，同理可得 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{1}, \alpha_{3}, \alpha_{4}, \alpha_{2}, \alpha_{3}$ $\alpha _ { 4 }$ 也线性相关.故 $\alpha_{1},\alpha_{2}$ 为 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 的一个极大无关组，秩为2.此外，由同样方法

[page:125]

可知， $\alpha_{1}, \alpha_{3}; \alpha_{1}, \alpha_{4}; \alpha_{2}, \alpha_{3}; \alpha_{2}, \alpha_{4}; \alpha_{3}, \alpha_{4}$ 分别也都是向量组的极大无关组

我们知道矩阵的最高阶非零子式可能不止一个，但矩阵的秩是惟一的；类似地，由定义及例1知，向量组的极大无关组也可能不止一个，但向量组的秩是惟一的.

由定义易知，一个向量组若线性无关，则其极大无关组就是它本身，秩就是向量组中向量的个数.从而，我们有

向量组线性无关(相关)⇒向量组的秩等于(小于)向量组所含向量的个数

例 $2 \quad \mathrm { ~ R ~ }$ 的秩为n，且任意n个线性无关的n维向量均为 $\mathbf{R}^{n}$ 的一个极大无关组.

事实上，因为任意 $\bar{n} + 1$ 个n维向量必线性相关，故任意n个线性无关的n维向量都是 $\mathbf{R}^{n}$ 的一个极大无关组.

定理1 若矩阵A经有限次行初等变换变成B，则A的任意k $( 1 \leqslant k \leqslant n )$ 个列向量与B的对应的k个列向量有相同的线性相关性.

证设A为 $m \times n$ 矩阵，任取A的 $k \left( 1 \leqslant k \leqslant n \right)$ 个列向量得矩阵 $A _ { \textit { k } } , A _ { \textit { k } }$ 经有限次行初等变换后化为 $B_{k}$ .由于行初等变换保持齐次线性方程组同解，因而齐次线性方程组 $A_{k}X = 0$ 与 $B_{k}X = 0$ 同时具有非零解或只有零解.故由δ4.2的定理2知， $A_{k}$ 的列向量组与 $B_{k}$ 的列向量组有相同的线性相关性.

类似地，我们还可就列初等变换同样地得到相应的结果.

给定一个向量组，我们可以由它们作为一个矩阵的行(或列)向量组来确定一个矩阵；反之，给定一个矩阵A，我们可以得到A的行(列)向量组.那么，向量组的秩与矩阵的秩有什么关系呢？

我们把矩阵A的列向量组的秩称为A的列秩，其行向量组的秩称为A的行秩.

关于矩阵A的秩、列秩和行秩，我们有

定理2矩阵的行秩等于列秩，也等于矩阵的秩.

证设 $R(A) = r$ 9

$$A \xrightarrow{行初等变换} B  (行阶梯形矩阵)$$

则B中有且仅有r个非零行，由§4.2的定理2及定义知，B的r个非零行的非零首元所在r个列向量是线性无关的，且为B的列向量组的一个极大无关组.根据定理1，这r个列向量与A中相对应的r个列向量也是A的列向量组的一个极大无关组.故A的列秩等于 $r ^ { - } .$

A 的行向量即 $A^{\mathrm{T}}$ 的列向量，于是由 $R\left( \boldsymbol{A}^{\mathrm{T}} \right) = R\left( \boldsymbol{A} \right)$ 知，A的行秩也等于r.

值得注意的是，定理2的证明实际上还给出了如何方便地利用行初等变换求出向量组的秩和极大无关组的方法.

例3 设向量组 $\boldsymbol{\alpha}_{1}=(1,3,1,4),\boldsymbol{\alpha}_{2}=(2,12,-2,12),\boldsymbol{\alpha}_{3}=(2,-3,8,2)$ ,求向量组的秩和一个极大无关组，并判断向量组的线性相关性.

解

[page:126]

$$\begin{aligned}\boldsymbol{A} &= (\boldsymbol{\alpha}_{1}^{\mathrm{T}},\boldsymbol{\alpha}_{2}^{\mathrm{T}},\boldsymbol{\alpha}_{3}^{\mathrm{T}}) =\begin{bmatrix}1 & 2 & 2 \\3 & 12 & -3 \\1 & -2 & 8 \\4 & 12 & 2\end{bmatrix} \\&\rightarrow\begin{bmatrix}1 & 2 & 2 \\0 & 6 & -9 \\0 & -4 & 6 \\0 & 4 & -6\end{bmatrix}\rightarrow\begin{bmatrix}1 & 2 & 2 \\0 & 2 & -3 \\0 & 0 & 0 \\0 & 0 & 0\end{bmatrix},\end{aligned}$$

所以 $R(A)=2$ ，即 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 的秩为2,因而 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性相关，且由定理2的证明知 $\alpha_{1}, \alpha_{2}$ 为 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 的一个极大无关组.

例4 求向量组

$$\boldsymbol{\alpha}_{1}=(2,4,2), \quad \boldsymbol{\alpha}_{2}=(1,1,0), \quad \boldsymbol{\alpha}_{3}=(2,3,1), \quad \boldsymbol{\alpha}_{4}=(3,5,2)$$

的秩和一个极大无关组，判断向量组的线性相关性，并把其余向量用该极大无关组线性表出.

解作

$$\begin{aligned}\boldsymbol{A} &= (\boldsymbol{\alpha}_{1}^{\top},\boldsymbol{\alpha}_{2}^{\top},\boldsymbol{\alpha}_{3}^{\top},\boldsymbol{\alpha}_{4}^{\top}) =\begin{bmatrix}2 & 1 & 2 & 3 \\4 & 1 & 3 & 5 \\2 & 0 & 1 & 2\end{bmatrix} \\&\xrightarrow{}\begin{bmatrix}2 & 1 & 2 & 3 \\0 & -1 & -1 & -1 \\0 & -1 & -1 & -1\end{bmatrix}\xrightarrow{}\begin{bmatrix}2 & 1 & 2 & 3 \\0 & 1 & 1 & 1 \\0 & 0 & 0 & 0\end{bmatrix}= \boldsymbol{B}  ,\end{aligned}$$

所以 $R(A)=2$ ，即 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 的秩为 $2 < 4$ ，因而 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 线性相关(事实上，由向量个数大于向量维数直接知 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 线性相关)，且 $\alpha_{1}, \alpha_{2}$ 为 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$的一个极大无关组.将B再施以行初等变换

$$\boldsymbol{B} \rightarrow \begin{bmatrix} 2 & 0 & 1 & 2 \\ 0 & 1 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix} \rightarrow \begin{bmatrix} 1 & 0 & \dfrac{1}{2} & 1 \\ & & & \\ 0 & 1 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix},$$

于是有

$$\boldsymbol { \alpha } _ { 3 } = \frac { 1 } { 2 } \boldsymbol { \alpha } _ { 1 } + \boldsymbol { \alpha } _ { 2 } , \quad \boldsymbol { \alpha } _ { 4 } = \boldsymbol { \alpha } _ { 1 } + \boldsymbol { \alpha } _ { 2 } ,$$

例5设数 $a \neq b$ ，求(1，2)，(1，a)，(1，b)的一个极大无关组.

解这三个二维向量一定线性相关.又因 $a \neq b$ ，所以 $\left| \begin{matrix} { 1 } & { 1 } \\ { a } & { b } \\ \end{matrix} \right| \not = 0 .$ ，从而 $\begin{pmatrix}1 \\a\end{pmatrix}\colon\begin{pmatrix}1 \\b\end{pmatrix}$ 线性无关.因而该向量组的秩为 $2,\begin{bmatrix}1\\ \\ a\end{bmatrix}\div\begin{bmatrix}1\\ \\ b\end{bmatrix}$ 为一个极大无关组

[page:127]

由极大无关组的定义容易看出，向量组与其任一极大无关组等价，因而，一向量组的任意两个极大无关组都是等价的，任意两个极大无关组所含向量个数是相同的，均为向量组的秩.

下面我们来讨论两向量组的秩的关系，先证如下常用定理

定理3 若向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 可由向量组 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{s}$ 线性表出，且 $\alpha _ { 1 }$ $\alpha_{2},\cdots,\alpha_{1}$ 线性无关，则 $r \leqslant s$

证不妨设讨论的是列向量(若是行向量，证明方法类似)，记

$$\boldsymbol { A } = \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { r } \right) , \quad \boldsymbol { B } = \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 2 } , \cdots , \boldsymbol { \beta } _ { r } \right) ,$$

因 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 可由 $\beta_{1}, \beta_{2}, \cdots, \beta_{s}$ 线性表出，所以存在矩阵

$$\boldsymbol { K } = \left( k _ { i j } \right) _ { s \times r } = \left( \gamma _ { 1 } , \gamma _ { 2 } , \cdots , \gamma _ { r } \right) ,$$

其中 $\boldsymbol{\gamma}_{j}=(k_{1j},k_{2j},\cdots,k_{nj})^{\mathrm{T}}(j=1,2,\cdots,r)$ ，使得 $A = B K$ .假设 $r \gg s$ ，则向量组 $\gamma _ { \uparrow }$ $\gamma_{2},\cdots,\gamma_{n}$ 线性相关，于是有不全为零的数 $x_{1},x_{2},\cdots,x_{n}$ ,使

$$x_{1}Y_{1} + x_{2}Y_{2} + \cdots + x_{r}Y_{r} = 0,$$

即

$$\left( \boldsymbol { \gamma } _ { 1 } , \boldsymbol { \gamma } _ { 2 } , \cdots , \boldsymbol { \gamma } _ { r } \right) \begin{bmatrix} x _ { 1 } \\ x _ { 2 } \\ \vdots \\ x _ { r } \end{bmatrix} = \boldsymbol { K } \boldsymbol { X } = \boldsymbol { 0 } ,$$

这里 $\boldsymbol{X} = (x_1, x_2, \cdots, x_r)^{\mathrm{T}}$ .因此

$$AX = BKX = B0 = 0.$$

即方程组AX=0有非零解，由§4.2的定理2知 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r}$ 线性相关，与定理假设矛盾.故 $r > s$ 不成立，即 $r \leqslant s$

定理3的等价说法是，设向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r}$ 可由向量组 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{s}$ 线性表出，如果 $r \geq s$ ,那么 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r}$ 线性相关.

由定理3可得向量组秩的性质:设向量组(Ⅰ)的秩为 $r _ { 1 }$ ，向量组(Ⅱ)的秩为 $r _ { 2 }$若(Ⅰ)能由(Ⅱ)线性表出，则 $r_{1} \leqslant r_{2}$

事实上，设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r_{1}}$ 为(Ⅰ)的极大无关组， $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{r_{2}}$ 为(Ⅱ)的极大无关组，因(Ⅰ)可由(Ⅱ)线性表出，据向量组与其极大无关组的等价性知， $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r_{1}}$ 可由 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{r_{2}}$ 线性表出，且由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r_{1}}$ 线性无关和定理3，有 $r_{1} \leqslant r_{2}$

由此可知，任何两个等价的向量组必有相同的秩

定理4 设 $\alpha_{j_1}, \alpha_{j_2}, \cdots, \alpha_{j_n}$ 是 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 的线性无关部分组，它是极大无关组的充分必要条件是 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 中每一个向量均可由 $\alpha_{j_1}, \alpha_{j_2}, \cdots, \alpha_{j_s}$ 线性表出.

证充分性:若 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 可由线性无关的部分组 $\alpha_{j_1}, \alpha_{j_2}, \cdots, \alpha_{j_r}$ 线性表出，则据定理3知 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 中任何 $r + 1$ 个向量都线性相关，因而 $\alpha_{j_{1}}, \alpha_{j_{2}}, \cdots, \alpha_{j_{r}}$ 是极大无关组.

[page:128]

必要性:若 $\alpha_{j_1}, \alpha_{j_2}, \cdots, \alpha_{j_s}$ 是 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 的一个极大无关组，则当 $j \in \{ j \}$ $j_{2},\cdots,j_{r}$ 时，显然 $\alpha_{j} \left( j = 1, 2, \cdots, s \right)$ 可由 $\alpha_{j_{1}}, \alpha_{j_{2}}, \cdots, \alpha_{j_{s}}$ 线性表出；当 $j \notin \{ j_1, j_2, \cdots$ $j , j$ 时， $\alpha_{j}, \alpha_{j_{1}}, \alpha_{j_{2}}, \cdots, \alpha_{j_{s}}$ 线性相关，又 $\alpha_{j_1}, \alpha_{j_2}, \cdots, \alpha_{j_s}$ 线性无关，因而 $\alpha_{j}  (  j = 1$ $2,\cdots,s$ 可由 $\alpha_{j_1}, \alpha_{j_2}, \cdots, \alpha_{j_r}$ 线性表出.

定理2告诉我们，矩阵的秩和向量组的秩有着本质的联系，因而关于二者的问题常常相互转化.例如，对于如下关于矩阵秩的重要不等式，我们用向量组的理论可以容易地加以证明.

例6设A,B分别为 $m \times r, r \times n$ 矩阵，证明:

$$R\left(AB\right)\leqslant\min\left\{R\left(A\right),R\left(B\right)\right\}.$$

证设 $C_{m \times n} = A_{m \times r}B_{r \times n}$ ,即

$$\left( \boldsymbol { c } _ { 1 } , \cdots , \boldsymbol { c } _ { k } , \cdots , \boldsymbol { c } _ { n } \right) = \left( \boldsymbol { a } _ { 1 } , \boldsymbol { a } _ { 2 } , \cdots , \boldsymbol { a } _ { r } \right) \begin{pmatrix} b _ { 1 1 } & \cdots & b _ { 1 k } & \cdots & b _ { 1 n } \\ b _ { 2 1 } & \cdots & b _ { 2 k } & \cdots & b _ { 2 n } \\ \vdots & & \vdots & & \vdots \\ b _ { r 1 } & \cdots & b _ { r k } & \cdots & b _ { r n } \end{pmatrix},$$

其中 $c_{k}, \alpha_{j} (k = 1, 2, \cdots, n; j = 1, 2, \cdots, r)$ 分别为C和A的列向量.由上式有

$$\boldsymbol{c}_{k}=b_{1 k} \boldsymbol{\alpha}_{1}+b_{2 k} \boldsymbol{\alpha}_{2}+\cdots+b_{r k} \boldsymbol{\alpha}_{r} \quad(k=1,2, \cdots, n) .$$

即AB的列向量组 $c_{1},c_{2},\cdots,c_{n}$ 可由A的列向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r}$ 线性表出，故有$R\left ( C \right ) \le R\left ( A \right )$

另一方面，由以上结果便得

$$R\left( \boldsymbol{C} \right) = R\left( \boldsymbol{C}^{\mathrm{T}} \right) = R\left( \boldsymbol{B}^{\mathrm{T}}\boldsymbol{A}^{\mathrm{T}} \right) \leqslant R\left( \boldsymbol{B}^{\mathrm{T}} \right) = R\left( \boldsymbol{B} \right).$$

故 $R\left(AB\right)\leqslant\min\left\{R\left(A\right),R\left(B\right)\right\}$

大家可能已经注意到，我们在定理3的证明和例6的证明中两次用到:向量组$\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{q}$ 可由向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{p}$ 线性表出，也就是存在矩阵 $K_{p \times q}$ ，使得

$$\left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { p } \right) \boldsymbol { K } = \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 2 } , \cdots , \boldsymbol { \beta } _ { q } \right) ,$$

这里假设向量是列向量

如果设矩阵 $\boldsymbol{A} = (\boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{2}, \cdots, \boldsymbol{\alpha}_{p}), \boldsymbol{B} = (\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{q})$ ，上式也就是矩阵方程 $A X =$ B有解.于是，由§4.2定理1我们便有如下结论:

向量组 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{q}$ 可由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{p}$ 线性表出的充分必要条件是 $R(A)=$ $R(A,B)$

两向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{p}$ 与 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{q}$ 等价的充分必要条件是

$$R\left(A\right)=R\left(B\right)=R\left(A,B\right).$$

也就是说，我们把§4.2的定理1推广成了如下三命题等价:

1°向量组 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{q}$ 可由向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{p}$ 线性表出；

$2^{\circ} \quad AX = B$ 有解；

3°R(A)=R(A,B).

[page:129]

有关例题不再列举，留作习题.

## 二、 $\mathrm{R}^{n}$ 的基、维数与坐标

$n$ 维向量的全体 $\mathbf{R}^{n}$ 的一个极大无关组也称为n维向量空间 $\mathbf{R}^{n}$ 的一组基，其任一极大无关组所含向量个数又称为n维向量空间 $\mathbf{R}^{n}$ 的维数，记为dim $\mathbf{R}^{n}$ .显然 dim $\mathbf{R}^{n}$ $= n$ .单位向量组 $\varepsilon_{1}, \varepsilon_{2}, \cdots, \varepsilon_{n}$ 称为 $\mathbf { R } ^ { n }$ 的一个标准基.i,j,k为 $\mathbf { R } ^ { 3 }$ 的一个标准基.可见， $\mathbf{R}^{n}$ 中任一向量均为其基的线性组合.即设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 为 $\mathbf{R}^{n}$ 的一组基，则

$$\mathbf{R}^{n}=L\left(\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}\right).$$

如果在 $\mathbf { R } ^ { 3 }$ 中 $\alpha , \beta , \gamma$ 线性无关，则它们构成 $\mathbf { R } ^ { 3 }$ 的一组基，且

$$\mathbf{R}^{3}=L\left(\alpha,\beta,\gamma\right).$$

因此，任何第四个向量 $(a,b,c)^{\mathrm{T}} \in L(\alpha,\beta,\gamma)$

设 $\alpha \in \mathbf{R}^n$

$$\boldsymbol{\alpha} = x_{1}\boldsymbol{\alpha}_{1} + x_{2}\boldsymbol{\alpha}_{2} + \cdots + x_{n}\boldsymbol{\alpha}_{n}$$

则称 $x_{1},x_{2},\cdots,x_{n}$ 为 $\alpha$ 在基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 下的坐标.由§4.2的定理5知坐标是惟一的.

对于 $\mathbf{R}^{n}$ 的子空间V，也可类似地定义基、维数(记为dimV)和坐标.

例7 设 $\boldsymbol{\alpha} = (x_{1}, x_{2}, x_{3})^{\mathrm{T}} \neq \mathbf{0}$ ,则α张成一个一维子空间 $L(\alpha) = \{ k\alpha \mid k \in \mathbb{R} \}$ .一向量$(a,b,c)^{\mathrm{T}} \in L(\alpha)$ 的充分必要条件是点 $(a,b,c)$ 在由坐标原点 $( 0 , 0 , 0 )$ 和点$( x _ { 1 } , x _ { 2 } , x _ { 3 } )$ 决定的直线上.因此， $\mathrm { R ^ { 3 } }$ 的一维子空间可用过坐标原点的一直线表示.

设 $\boldsymbol{\alpha}=(x_{1},x_{2},x_{3})^{\mathrm{T}},\boldsymbol{\beta}=(y_{1},y_{2},y_{3})^{\mathrm{T}}$ 线性无关，则

$$L\left( \boldsymbol{\alpha},\boldsymbol{\beta} \right) = \left\{ k_{1}\boldsymbol{\alpha} + k_{2}\boldsymbol{\beta} \mid k_{1},k_{2} \in \mathbf{R} \right\}$$

是 $\mathbf { R } ^ { 3 }$ 的二维子空间.向量 $(a,b,c)^{\mathrm{T}} \in L(\alpha, \beta)$ 的充分必要条件是点 $(a,b,c)$ 位于由点$(0,0,0),(x_{1},x_{2},x_{3})$ 和 $(y_{1},y_{2},y_{3})$ 决定的平面上.因此， $\mathbf { R } ^ { 3 }$ 的二维子空间可表为一过原点的平面.

例8 对于δ4.2的例5中的向量， $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 为 $\mathbf { R } ^ { 3 }$ 的一组基， $. \beta$ 在该基下的坐标为1,2，-1.

任意 $\mathcal { n }$ 个线性无关的n维向量都是 $\mathbf{R}^{n}$ 的一组基，不同的基之间有什么关系呢？同一向量在不同基下的坐标一般是不相同的，它们之间的关系又是怎样的呢?这就是所谓的基变换和坐标变换的问题.

设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 和 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{n}$ 分别为 $\mathbf{R}^{n}$ 的基，由于 $\mathbf{R}^{n}$ 的任两组基都是等价的，所以存在可逆矩阵A，使得

$$\left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 2 } , \cdots , \boldsymbol { \beta } _ { n } \right) = \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { n } \right) \boldsymbol { A } ,$$

我们称A为从基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 到基 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{n}$ 的过渡矩阵.

设向量 $\alpha \in \mathbf{R}^n$ 在两组基下的坐标分别为 $x_{1},x_{2},\cdots,x_{n}$ 和 $x_{1}^{\prime},x_{2}^{\prime},\cdots,x_{n}^{\prime}$ ,即

[page:130]

$$\boldsymbol{\alpha} = (\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n}) \begin{bmatrix} x_{1} \\ x_{2} \\ \vdots \\ x_{n} \end{bmatrix},$$

$$\boldsymbol{\alpha} = (\boldsymbol{\beta}_{1},\boldsymbol{\beta}_{2},\cdots,\boldsymbol{\beta}_{n})\begin{vmatrix}x_{1}^{\prime} \\x_{2}^{\prime} \\\vdots \\x_{n}^{\prime}\end{vmatrix}= (\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n})\boldsymbol{A}\begin{vmatrix}x_{1}^{\prime} \\x_{2}^{\prime} \\\vdots \\x_{n}^{\prime}\end{vmatrix},$$

由坐标的惟一性知

$$\begin{aligned}\begin{bmatrix}x_{1} \\x_{2} \\\vdots \\x_{n}\end{bmatrix}= &A\begin{bmatrix}x_{1}^{\prime} \\x_{2}^{\prime} \\\vdots \\x_{n}^{\prime}\end{bmatrix}.\end{aligned}$$

这就是向量α在两组基下的坐标变换公式

例如，在 $\mathbf { R } ^ { 3 }$ 中，从基 $\mathcal { E } _ { 1 } , \mathcal { E } _ { 2 } , \mathcal { E } _ { 3 }$ 到基 $\boldsymbol{\alpha}_{1}=(-1,-2,2),\boldsymbol{\alpha}_{2}=(-2,-1,2),\boldsymbol{\alpha}_{3}=$

(3,2，-3)的过渡矩阵为 $\begin{pmatrix}-1 & -2 & 3 \\-2 & -1 & 2 \\2 & 2 & -3\end{pmatrix}$

例9在 $\mathrm { R } ^ { 3 }$ 中取两组基

$$\begin{aligned}\boldsymbol{\alpha}_{1} &= (-1, -2, 2), \boldsymbol{\alpha}_{2} = (-2, -1, 2), \boldsymbol{\alpha}_{3} = (3, 2, -3) ; \\\boldsymbol{\beta}_{1} &= (1, 1, 1), \quad \boldsymbol{\beta}_{2} = (1, 2, 3), \quad \boldsymbol{\beta}_{3} = (2, 0, 1) ,\end{aligned}$$

求从基 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 到基 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \boldsymbol{\beta}_{3}$ 的过渡矩阵.

解 设A 是从 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 到 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \boldsymbol{\beta}_{3}$ 的过渡矩阵.则

$$\left( \boldsymbol { \beta } _ { 1 } ^ { \mathrm { T } } , \boldsymbol { \beta } _ { 2 } ^ { \mathrm { T } } , \boldsymbol { \beta } _ { 3 } ^ { \mathrm { T } } \right) = \left( \boldsymbol { \alpha } _ { 1 } ^ { \mathrm { T } } , \boldsymbol { \alpha } _ { 2 } ^ { \mathrm { T } } , \boldsymbol { \alpha } _ { 3 } ^ { \mathrm { T } } \right) \boldsymbol { A } ,$$

$$\boldsymbol{A} = (\boldsymbol{\alpha}_{1}^{\mathrm{T}},\boldsymbol{\alpha}_{2}^{\mathrm{T}},\boldsymbol{\alpha}_{3}^{\mathrm{T}})^{-1}(\boldsymbol{\beta}_{1}^{\mathrm{T}},\boldsymbol{\beta}_{2}^{\mathrm{T}},\boldsymbol{\beta}_{3}^{\mathrm{T}}) = \begin{bmatrix} -1 & -2 & 3 \\ -2 & -1 & 2 \\ 2 & 2 & -3 \end{bmatrix}^{-1} \begin{bmatrix} 1 & 1 & 2 \\ 1 & 2 & 0 \\ 1 & 3 & 1 \end{bmatrix}$$

$$\begin{aligned}= & \begin{vmatrix}1 & 0 & 1 \\2 & 3 & 4 \\2 & 2 & 3\end{vmatrix}\begin{vmatrix}1 & 1 & 2 \\1 & 2 & 0 \\1 & 3 & 1\end{vmatrix}= \begin{vmatrix}2 & 4 & 3 \\9 & 20 & 8 \\7 & 15 & 7\end{vmatrix}.\end{aligned}$$

## 题4.3

1. 若 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性相关，问 $\alpha_{1} + \alpha_{2} , \alpha_{2} + \alpha_{3} , \alpha_{3} + \alpha_{1}$ 是否线性相关？

2. 设 n维单位向量组 $\varepsilon_{1}, \varepsilon_{2}, \cdots, \varepsilon_{n}$ 可由n维向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 线性表出，证明: $\alpha_{1}$ $\alpha_{2},\cdots,\alpha_{n}$ 线性无关.

[page:131]

3. 设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是一组n维向量，证明:它们线性无关的充分必要条件是任一n维向量都可由它们线性表出.

4.求下列向量组的秩和一个极大无关组，判定向量组的线性相关性，并将其余向量用极大无关组线性表出.

$$\boldsymbol{\alpha}_{1}=(1,0,0,1),\boldsymbol{\alpha}_{2}=(0,1,0,1),\boldsymbol{\alpha}_{3}=(0,1,0,-1),\boldsymbol{\alpha}_{4}=(2,-1,1,0)$$

(2) $\boldsymbol{\alpha}_{1}=(1,2,1,3),\boldsymbol{\alpha}_{2}=(4,-1,-5,-6),\boldsymbol{\alpha}_{3}=(1,-3,-4,-7)$

(3) $\boldsymbol{\alpha}_{1}=(1,1,0),\boldsymbol{\alpha}_{2}=(0,2,0),\boldsymbol{\alpha}_{3}=(0,0,3)$

5. s 维向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 线性无关，且可由向量组 $\beta_{1}, \beta_{2}, \cdots, \beta_{s}$ 线性表出，证明:向量组 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{s}$ 的秩为s.

6. 设向量组 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关，求 $\alpha_{1} - \alpha_{2} , \alpha_{2} - \alpha_{3} , \alpha_{3} - \alpha_{1}$ 的一个极大无关组。

7.设A，B为同型矩阵，证明如下常用不等式:

$$R\left(A+B\right)\leqslant R\left(A\right)+R\left(B\right).$$

8. 设A，B均为有m行的矩阵，证明:

$$\max \left\{ R \left( A \right) , R \left( B \right) \right\} \leqslant R \left[ \left( A , B \right) \right] \leqslant R \left( A \right) + R \left( B \right) .$$

9. 证明: $\boldsymbol{\alpha}_{1} = (1, - 1,0), \boldsymbol{\alpha}_{2} = (2,1,3), \boldsymbol{\alpha}_{3} = (3,1,2)$ 为 $\widetilde{\mathbf{R}}^{3}$ 的一组基，并求 $\beta_{1} =$ $(5,0,7),\beta_{2}=(-9,-8,-13)$ 在该基下的坐标.

10. 在 $\mathbf { R } ^ { 3 }$ 中

$$\begin{cases}\boldsymbol{\alpha}_{1} = (1,2,1) , \\\boldsymbol{\alpha}_{2} = (2,3,3) , \\\boldsymbol{\alpha}_{3} = (3,7,1) ;\end{cases}\quad\begin{cases}\boldsymbol{\beta}_{1} = (3,1,4) , \\\boldsymbol{\beta}_{2} = (5,2,1) , \\\boldsymbol{\beta}_{3} = (1,1,-6) .\end{cases}$$

(1) 证明 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 与 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \boldsymbol{\beta}_{3}$ 都是 $\mathbf{R}^{3}$ 的基；

(2) 求从 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 到 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \boldsymbol{\beta}_{3}$ 的过渡矩阵；

(3) 求 $\alpha = (2,1,1)$ 在 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \boldsymbol{\beta}_{3}$ 下的坐标；

(4) 求α在 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 下的坐标.

## §4.4 线性方程组解的结构

在第一章和§2.4中，我们已利用矩阵和向量组的理论陆续得到了线性方程组的一些重要结论，在这一节对线性方程组解的结构作进一步研究.

## 一、齐次线性方程组

齐次线性方程组

$$\begin{cases}a_{11}x_{1} + a_{12}x_{2} + \cdots + a_{1n}x_{n} = 0, \\a_{21}x_{1} + a_{22}x_{2} + \cdots + a_{2n}x_{n} = 0, \\\cdots\cdots\cdots\cdots \\a_{m1}x_{1} + a_{m2}x_{2} + \cdots + a_{mn}x_{n} = 0,\end{cases}\tag{4.6}$$

[page:132]

即

$$AX = 0\tag{4.7}$$

显然有一组平凡解

$$x_{1}=x_{2}=\cdots=x_{n}=0,$$

即X=0，称为零解.

关于齐次线性方程组AX=0的解，我们已经得到下列重要结论:

设A为 $\bar { m } \times \bar { n }$ 矩阵，则下面三命题等价:

$\begin{aligned}\hat{1}^{\circ} \quad A\hat{X} = 0\end{aligned}$ 只有零解；

2°R(A)=n;

$3 ^ { \circ }$ A的列向量组线性无关.

即下面三命题等价:

$1^{\circ} \quad AX = 0$ 有非零解；

2°R(A)<n;

$3 ^ { \circ } \quad \tilde { A }$ 的列向量组线性相关.

特别地，当A为n阶方阵时，下面三命题等价:

1° $AX = 0$ 只有零解(有非零解);

$$2^{\circ} \quad R(A)=n(R(A)<n);$$

$$3^{\circ} \quad \det A \neq 0(\det A = 0).$$

关于 $AX = 0$ 的解，有如下性质:

性质1若 $\xi _ { 1 } , \xi _ { 2 }$ 为齐次线性方程组 $AX = 0$ 的解，则 $X = \xi_{1} + \xi_{2}$ 也是 $AX = 0$ 的解.证由于 $A \left( \xi _ { 1 } + \xi _ { 2 } \right) = A \xi _ { 1 } + A \xi _ { 2 } = 0 + 0 = 0$ ,因而 $\xi _ { 1 } + \xi _ { 2 }$ 也是 $AX \equiv 0$ 的解.

性质2 若 $\xi$ 为齐次线性方程组 $AX = 0$ 的解，k为数，则 $X = k 5$ 也是 $A X = 0$ 的解.证由 $A(k\xi) = kA\xi = k0 = 0$ 知结论成立.

由性质1,2立即得

性质3 齐次线性方程组 $AX \equiv 0$ 解向量的线性组合也为 $AX = 0$ 的解.即设 $\xi _ { \perp }$ $5 , \cdots 5$ 为 $AX = 0$ 的解，则对任意s个数 $k_{1},k_{2},\cdots,k_{s},k_{1}\xi_{1}+k_{2}\xi_{2}+\cdots+k_{s}\xi_{s}$ 也是$A X = 0$ 的解.

将齐次线性方程组 $AX = 0$ 的解的全体记为 $W$ ，即

$$W = \left\{ X \in \mathbb{R}^n \mid AX = 0 \right\}.$$

由性质1,2知 $W$ 为 $\mathbf{R}^{n}$ 的一个子空间，称为 $AX = 0$ 的解空间，其任一组基称为 $AX = 0$的一个基础解系.

于是，设 $\xi_{1}, \xi_{2}, \cdots, \xi_{n}$ 是 $AX = 0$ 的一组解向量，则 $5 , 5 , \cdots , 5$ 是 $AX = 0$ 的基础解系当且仅当 $\xi_{1}, \xi_{2}, \cdots, \xi$ 线性无关，且 $A X = 0$ 的任一解向量都可表为 $\xi_{1}, \xi_{2}, \cdots, \xi$的线性组合.

易见，仅当 $AX = 0$ 有非零解时才有基础解系.

定理设齐次线性方程组 $AX = 0$ 的系数矩阵A的秩 $R\left ( A \right ) = r < n$ ，则方程组AX $= 0$ 有基础解系且所含解向量个数为 $n - r$ ,即 $W$ 的维数为 $n = r$ ,这里n为方程组中未

[page:133]

知数的个数.

证 设系数矩阵A的秩为r，不妨设A的前r个列向量线性无关，于是由A经行初等变换可得

$$\boldsymbol { B } = \begin{bmatrix} 1 & \cdots & 0 & \bar { b } _ { 1 1 } & \cdots & \bar { b } _ { 1 , n - r } \\ \vdots & & \vdots & \vdots & & \vdots \\ 0 & \cdots & 1 & \bar { b } _ { r 1 } & \cdots & \bar { b } _ { r , n - r } \\ 0 & \cdots & 0 & 0 & \cdots & 0 \\ \vdots & & \vdots & \vdots & & \vdots \\ 0 & \cdots & 0 & 0 & \cdots & 0 \end{bmatrix},$$

与B对应，有方程组

$$\begin{cases}x_{1} = - b_{11}x_{r + 1} - \cdots - b_{1,n - r}x_{n}, \\\quad \cdots \cdots \cdots \cdots \\x_{r} = - b_{r1}x_{r + 1} - \cdots - b_{r,n - r}x_{n}.\end{cases}\tag{4.8}$$

方程组AX=0与方程组(4.8)同解.在方程组(4.8)中，任给 $x_{r + 1}, \cdots, x_{n}$ 一组值，则惟一确定 $x_{1},x_{2},\cdots,x_{n}$ 的值，就得方程组(4.8)的一个解，也就是方程组AX=0的解.令 $x _ { 1 } + 1 , \cdots , x _ { n }$ 取下列 $n - r$ 组数

$$\left[ \begin{matrix} { \bar { \boldsymbol { x } } _ { r + 1 } } \\ { \bar { \boldsymbol { x } } _ { r + 2 } } \\ { \vdots } \\ { \boldsymbol { x } _ { n } } \\ \end{matrix} \right] = \left[ \begin{matrix} { 1 } \\ { 0 } \\ { \vdots } \\ { 0 } \\ \end{matrix} \right] , \left[ \begin{matrix} { 0 } \\ { 1 } \\ { \vdots } \\ { 0 } \\ \end{matrix} \right] , \cdots , \left[ \begin{matrix} { 0 } \\ { 0 } \\ { \vdots } \\ { 1 } \\ \end{matrix} \right] .$$

由方程组(4.8)依次可得

$$\begin{pmatrix}x_{1} \\\vdots \\x_{r}\end{pmatrix}=\begin{pmatrix}-b_{11} \\\vdots \\-b_{r1}\end{pmatrix},\begin{pmatrix}-b_{12} \\\vdots \\-b_{r2}\end{pmatrix},\cdots,\begin{pmatrix}-b_{1,n-r} \\\vdots \\-b_{r,n-r}\end{pmatrix},$$

从而求得方程组AX=0的n—r个解:

$$\pmb { \xi } _ { 1 } = \left[ \begin{matrix} { - b _ { 1 1 } } \\ { \vdots } \\ { - b _ { r 1 } } \\ { 1 } \\ { 0 } \\ { \vdots } \\ { 0 } \end{matrix} \right] , \pmb { \xi } _ { 2 } = \left[ \begin{matrix} { - b _ { 1 2 } } \\ { \vdots } \\ { - b _ { r 2 } } \\ { 0 } \\ { 1 } \\ { \vdots } \\ { 0 } \end{matrix} \right] , \cdots , \pmb { \xi } _ { n - r } = \left[ \begin{matrix} { - b _ { 1 , n - r } } \\ { \vdots } \\ { - b _ { r , n - r } } \\ { 0 } \\ { 0 } \\ { \vdots } \\ { 1 } \end{matrix} \right] .$$

下面证明 $\xi_{1}, \xi_{2}, \cdots, \xi_{n}$ 就是基础解系.

首先，因 $\left( x_{r + 1},x_{r + 2},\cdots,x_{n} \right)^{\mathrm{T}}$ 所取的n—r个n一r维向量

[page:134]

$$\begin{pmatrix}1 \\0 \\\vdots \\0\end{pmatrix},\begin{pmatrix}0 \\1 \\\vdots \\0\end{pmatrix},\cdots,\begin{pmatrix}0 \\0 \\\vdots \\1\end{pmatrix}$$

线性无关，所以在每个向量前面添加r个分量而得到的n一r个n维向量 $\xi_{1}, \xi_{2}, \cdots$ $\xi_{n - 1}$ 也线性无关(参见习题4.2的题10).

其次，证明方程组 $AX = \mathbf{0}$ 的任一解 $\boldsymbol{X} = (l_1, \cdots, l_r, l_{r+1}, \cdots, l_n)^{\mathrm{T}}$ 都可由 $\xi_{1}$ $\xi_{2},\cdots,\xi_{n}$ 线性表出.为此，作向量

$$\boldsymbol { \eta } = l _ { r + 1 } \boldsymbol { \xi } _ { 1 } + l _ { r + 2 } \boldsymbol { \xi } _ { 2 } + \cdots + l _ { n } \boldsymbol { \xi } _ { n - r } ,$$

由性质3知η也是AX=0的解.比较η与X，它们的后面n-r个分量对应相等，由于它们都满足方程组(4.8)，从而有它们的前面r个分量也必对应相等，因此 $X = \widehat { \eta }$ ，即

$$\boldsymbol { X } = l _ { r + 1 } \boldsymbol { \xi } _ { 1 } + l _ { r + 2 } \boldsymbol { \xi } _ { 2 } + \cdots + l _ { n } \boldsymbol { \xi } _ { n - r } ,$$

于是由定义知， $\xi_{1}, \xi_{2}, \cdots, \xi_{n-r}$ 为 $AX = 0$ 的基础解系.

值得注意的是，定理1的证明实际上就是一个具体求基础解系的方法.因为齐次线性方程组的基础解系实质上就是向量组W的一个极大无关组，因而一般不惟一，但是基础解系中向量个数必为 $n = r$

例如，任取 $n - r$ 个线性无关的n一r维向量，并使 $\left[ \begin{matrix} { x _ { r + 1 } } \\ { x _ { r + 2 } } \\ { \vdots } \\ { x _ { n } } \\ \end{matrix} \right]$ 分别等于这些向量，再

通过方程组(4.8)求出 $x_{1},x_{2},\cdots,x_{r}$ 便得一个基础解系.

设求得 $\xi_{1}, \xi_{2}, \cdots, \xi_{n-r}$ 为AX=0的一个基础解系，则该方程组的任一解可表示为

$$\boldsymbol{X}=k_{1} \boldsymbol{\xi}_{1}+k_{2} \boldsymbol{\xi}_{2}+\cdots+k_{n-r} \boldsymbol{\xi}_{n-r}$$

其中 $k_{1},k_{2},\cdots,k_{n-r}$ 为任意数，上式称为AX=0的通解.

例1 求齐次线性方程组 $\begin{cases}2x_{1} + x_{2} - 2x_{3} + 3x_{4} = 0, \\3x_{1} + 2x_{2} - x_{3} + 2x_{4} = 0, \\x_{1} + x_{2} + x_{3} - x_{4} = 0\end{cases}$ 的通解.

解对系数矩阵作行初等变换

$$\begin{aligned}A &= \begin{bmatrix}2 & 1 & -2 & 3 \\3 & 2 & -1 & 2 \\1 & 1 & 1 & -1\end{bmatrix}\xrightarrow{}\begin{bmatrix}0 & -1 & -4 & 5 \\0 & -1 & -4 & 5 \\1 & 1 & 1 & -1\end{bmatrix} \\&\xrightarrow{}\begin{bmatrix}0 & 0 & 0 & 0 \\0 & -1 & -4 & 5 \\1 & 1 & 1 & -1\end{bmatrix}\xrightarrow{}\begin{bmatrix}1 & 1 & 1 & -1 \\0 & -1 & -4 & 5 \\0 & 0 & 0 & 0\end{bmatrix}\xrightarrow{}\begin{bmatrix}1 & 0 & -3 & 4 \\0 & 1 & 4 & -5 \\0 & 0 & 0 & 0\end{bmatrix},\end{aligned}$$

得同解方程组 $\begin{cases}x_{1} = \quad 3x_{3} - 4x_{4}, \\x_{2} = - 4x_{3} + 5x_{4}.\end{cases}$ 因此基础解系为

[page:135]

$$\pmb { \xi } _ { 1 } = \left[ \begin{aligned} { \phantom { - } 3 } \\ { - 4 } \\ { \phantom { - } 1 } \\ { \phantom { - } 0 } \end{aligned} \right] , \quad \pmb { \xi } _ { 2 } = \left[ \begin{aligned} { - 4 } \\ { \phantom { - } 5 } \\ { \phantom { - } 0 } \\ { \phantom { - } 1 } \end{aligned} \right] .$$

故原方程组的通解为

$\vec { X } = k _ { 1 } \vec { \xi } _ { 1 } + k _ { 2 } \vec { \xi } _ { 2 } , \quad k _ { 1 } , k _ { 2 }$ 为任意数.

例2求齐次线性方程组 $\begin{cases}2x_{1} + 3x_{2} + x_{3} = 0, \\x_{1} - 2x_{2} + 4x_{3} = 0, \\3x_{1} + 8x_{2} - 2x_{3} = 0, \\4x_{1} - x_{2} + 9x_{3} = 0\end{cases}$ 的通解.

解 对系数矩阵A作行初等变换

$$\begin{aligned}\boldsymbol{A} &= \begin{vmatrix}2 & 3 & 1 \\1 & -2 & 4 \\3 & 8 & -2 \\4 & -1 & 9\end{vmatrix}\rightarrow\begin{vmatrix}1 & -2 & 4 \\0 & 1 & -1 \\0 & 1 & -1 \\0 & 1 & -1\end{vmatrix}, \\\rightarrow &\begin{vmatrix}1 & -2 & 4 \\0 & 1 & -1 \\0 & 0 & 0 \\0 & 0 & 0\end{vmatrix}\rightarrow\begin{vmatrix}1 & 0 & 2 \\0 & 1 & -1 \\0 & 0 & 0 \\0 & 0 & 0\end{vmatrix},\end{aligned}$$

得同解方程组 $\begin{cases}x_{1} = - 2x_{3}, \\x_{2} = \quad x_{3},\end{cases}$ 取 $x_{3} = 1$ 得基础解系

$$\boldsymbol{\xi} = (-2,1,1)^{\mathrm{T}}.$$

故原方程组的通解为 $X = k \xi , k$ 为任意数.

例3试证:与 $AX = 0$ 基础解系等价的线性无关的向量组也是该方程组的基础解系.

证 两个等价的线性无关的向量组所含向量个数是相等的.

设 $\xi_{1}, \xi_{2}, \cdots, \xi_{n}$ 是 $AX = \mathbf{0}$ 的一个基础解系， $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 与之等价，则$\boldsymbol{\alpha}_{i}(i = 1,2,\cdots,s)$ 可由 $\xi_{1}, \xi_{2}, \cdots, \xi_{n}$ 。线性表出，从而 $\boldsymbol{\alpha}_{i} \left( i = 1, 2, \cdots, s \right)$ 也是 $AX = \mathbf{0}$的解.

因齐次线性方程组任一解 $\beta$ 均可由基础解系 $\xi_{1}, \xi_{2}, \cdots, \xi_{n}$ 线性表出，从而由题设知 $\beta$ 也可由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 线性表出，又 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 线性无关，于是由定义知 $\alpha_{1}$ $\alpha_{2},\cdots,\alpha_{s}$ 为一个基础解系.

例4 设 n阶矩阵A,B满足 $AB = O$ ，证明:

$$R\left ( A \right ) +R\left ( B \right ) \le n.$$

证将B分块为 $\boldsymbol{B} = (b_1, b_2, \cdots, b_n)$ ,其中 $b_{1},b_{2},\cdots,b_{n}$ 为B的列向量组，则

$$AB = A(b_{1},b_{2},\cdots,b_{n}) = (Ab_{1},Ab_{2},\cdots,Ab_{n}) = O,$$

[page:136]

即

$$Ab_{i}=0\quad(i=1,2,\cdots,n),$$

即 $b_{i} \left( i = 1, 2, \cdots, n \right)$ 为AX=0的解，因而 $b_{i}(i = 1,2,\cdots,n)$ 可由AX=0的基础解系$\xi_{1}, \xi_{2}, \cdots, \xi_{n-r}$ 线性表出，这里 $r = R(A)$ .于是

$$R\left(b_{1}, b_{2}, \cdots, b_{n}\right) \leqslant R\left(\xi_{1}, \xi_{2}, \cdots, \xi_{n-r}\right)=n-R(A),$$

即 $R\left ( B \right ) \le n-R\left ( A \right )$ ，也就是 $R\left ( A \right ) +R\left ( B \right ) \le n$

定理1揭示了A的秩和AX=0的解的关系，它不仅对求解AX=0具有重要意义，而且如例4所表明的那样，常常可以通过研究齐次线性方程组的解来讨论系数矩阵的秩.

例 5 设 n 阶矩阵A 的秩 R $(A)=n-1(n \geqslant 2)$ ，证明 $R(A^{*}) = 1$

证由 $R\left(A\right)=n-1$ 知 det A=0，于是 $AA^{*} = (\det A)I = O$ .便有

$$R\left ( A \right ) +R\left ( A^{*}  \right ) \leqslant n.$$

所以 $R\left(A^{*}\right)\leqslant n-R\left(A\right)=1$ .又由 $R\left(A\right)=n-1$ 知A中有n—1阶子式不为零，因而$A^{*} \ne  O$ ，便有 $R(A^{*}) \geq 1$ .这样我们就证得 $R\left(A^{*}\right)=1$

综合例5和δ2.5的例5，我们证明了如下常用结果:若A为n阶矩阵，则

$$R\left(A^{*}\right)=\begin{cases}n, & R\left(A\right)=n, \\1, & R\left(A\right)=n-1\left(n \geqslant 2\right), \\0, & R\left(A\right) \leqslant n-1\left(n \geqslant 2\right).\end{cases}$$

用线性方程组的理论可以讨论空间平面的位置关系.

例6对于三个过原点的平面

$$\begin{cases}\pi_{1}: \quad a_{1}x + b_{1}y + c_{1}z = 0, \\\pi_{2}: \quad a_{2}x + b_{2}y + c_{2}z = 0, \\\pi_{3}: \quad a_{3}x + b_{3}y + c_{3}z = 0,\end{cases}$$

根据系数矩阵 $\boldsymbol{A} = \begin{bmatrix} a_{1} & b_{1} & c_{1} \\ a_{2} & b_{2} & c_{2} \\ a_{3} & b_{3} & c_{3} \end{bmatrix}$ 的秩r的大小分别讨论如下:

(1)r=3时，由4.2的定理2，这时线性方程组只有零解，即三平面相交于一点的充分必要条件是 $R(A)=3$ ,即 $\det A \neq 0$

(2)r=2时，三平面有两平面相交于一直线，另一平面或通过这一交线，或与其中一平面重合.这是因为假如 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 是A的行向量，由 $R(A)=2$ 知 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性相关，而其中有两个向量线性无关.假设 $\alpha_{1},\alpha_{2}$ 线性无关，那么 $a _ { 1 } , b _ { 1 } , c _ { 1 }$ 与 $a _ { 2 } , b _ { 2 }$ $\mathcal { C } _ { 2 }$ 不成比例，因此平面 $\pi_{1}$ 与 $\pi_{2}$ 交于一条直线.由 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性相关，可知 $\alpha_{3} = k_{1} \alpha_{1}$ $+k_{2}\alpha_{2}$ ，当 $k_{1}k_{2} \neq 0$ 时，平面 $\pi_{3}$ 通过 $\pi_{1}, \pi_{2}$ 两平面的交线；当 $k_{1}k_{2}=0$ 时，若 $k_{1} \equiv 0$ ,则$\alpha_{3} = k_{2} \alpha_{2}$ ,这时 $\pi_{2},\pi_{3}$ 平行，又因为它们都过原点，所以 $\pi_{2}, \pi_{3}$ 两平面重合.

(3)r=1时，A的三个行向量两两线性相关，从而三平面两两平行，又因为它们

[page:137]

都过原点，因而重合.

## 二、非齐次线性方程组

对于非齐次线性方程组

$$\begin{cases}a_{11}x_{1} + a_{12}x_{2} + \cdots + a_{1n}x_{n} = b_{1}, \\a_{21}x_{1} + a_{22}x_{2} + \cdots + a_{2n}x_{n} = b_{2}, \\\quad \cdots \cdots \cdots \cdots \\a_{m1}x_{1} + a_{m2}x_{2} + \cdots + a_{mn}x_{n} = b_{m},\end{cases}\tag{4.9}$$

设

$$\boldsymbol{\alpha}_{1}=\left[\begin{matrix}a_{11} \\a_{21} \\\vdots \\a_{m1}\end{matrix}\right],\boldsymbol{\alpha}_{2}=\left[\begin{matrix}a_{12} \\a_{22} \\\vdots \\a_{m2}\end{matrix}\right],\cdots,\boldsymbol{\alpha}_{n}=\left[\begin{matrix}a_{1n} \\a_{2n} \\\vdots \\a_{mn}\end{matrix}\right],\boldsymbol{b}=\left[\begin{matrix}b_{1} \\b_{2} \\\vdots \\b_{m}\end{matrix}\right],$$

则方程组(4.9)可记为 $x_{1}\boldsymbol{\alpha}_{1}+x_{2}\boldsymbol{\alpha}_{2}+\cdots+x_{n}\boldsymbol{\alpha}_{n}=\boldsymbol{b}$ ,即

$$A X = b \; .\tag{4.10}$$

关于非齐次线性方程组 $A X = b$ ，在本章§4.2中我们已得到如下重要结果:

$AX = b$ 有解⇒b可由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 线性表出 $\Leftrightarrow R\left( \bar{A} \right) = R\left( A \right)$

下面来讨论 $A X = b$ 解的结构.方程组(4.10)对应的齐次线性方程组 $AX \equiv 0$ 称为方程组(4.10)的导出组.非齐次线性方程组的解有如下性质:

性质4设 $\eta_{1}, \eta_{2}$ 为非齐次线性方程组 $A X = b$ 的两个解，则 $\eta_{2} - \eta_{1}$ 为其导出组的解.

证 因为 $A \left( \boldsymbol { \eta } _ { 2 } - \boldsymbol { \eta } _ { 1 } \right) = A \boldsymbol { \eta } _ { 2 } - A \boldsymbol { \eta } _ { 1 } = b - b = \boldsymbol { 0 }$ ,所以 $\eta_{2} - \eta$ 为导出组的解.

性质5设η为 $AX = b$ 的解， $\xi$ 为 $A X = 0$ 的解，则 $\eta + \xi$ 为 $AX = b$ 的解.

证由 $A(\eta + \xi) = A\eta + A\xi = b + 0 = b$ ,知 $\eta + \xi$ 为 $A X = b$ 的解.

$A X = b$ 的任意一个解，我们都称之为 $A X = b$ 的一个特解.于是由以上两个性质得:

性质6如果 $\gamma _ { 0 }$ 为 $AX = b$ 的一个特解，则 $AX = b$ 的任一解γ都可表示成

$$\gamma = \gamma _ { 0 } + \xi ,\tag{4.11}$$

其中 $\xi$ 为 $A X = 0$ 的一个解.因此，对于 $AX = b$ 的任一特解 $\gamma _ { \mathrm { o } }$ ，当 $\xi$ 取遍它的导出组的全部解时，式(4.11)就给出 $A X = b$ 的全部解.

证显然

$$\hat { \gamma } = \hat { \gamma } _ { 0 } + ( \hat { \gamma } - \hat { \gamma } _ { 0 } ) ,$$

由性质 $4 , \gamma - \gamma _ { 0 }$ 是 $AX = 0$ 的一个解，令 $\xi = \gamma = \gamma_{0}$ ，就得性质的结论.既然 $AX = b$ 的任一解都能表示成式(4.11)的形式，当然在 $\xi$ 取遍 $AX \equiv 0$ 的全部解时，

$$\gamma = \gamma_{0} + \xi$$

[page:138]

就取遍 AX=b 的全部解.

性质6说明，为了找出非齐次线性方程组的全部解，我们只要找到它的一个特解以及它的导出组的全部解就行了.如果 $\gamma_{0}$ 是非齐次方程组的一个特解， $\xi_{1}, \xi_{2}, \cdots$ $\xi_{n - i}$ 是其导出组的一个基础解系，则非齐次方程组的任意一个解都可以表示成

$$\boldsymbol{X} = \boldsymbol{Y}_{0} + k_{1} \boldsymbol{\xi}_{1} + k_{2} \boldsymbol{\xi}_{2} + \cdots + k_{n - r} \boldsymbol{\xi}_{n - r}, \quad k_{1}, k_{2}, \cdots, k_{n - r}  为任意数 .$$

上式称为AX=b的通解.

例7 求非齐次线性方程组 $\begin{cases}x_{1} - x_{2} + x_{3} - x_{4} = 1, \\x_{1} - x_{2} - x_{3} + x_{4} = 0, \\x_{1} - x_{2} - 2x_{3} + 2x_{4} = -\frac{1}{2}\end{cases}$ 的通解.

解

$$\begin{aligned}\overline{A} &= \begin{vmatrix}1 & -1 & 1 & -1 & 1 \\1 & -1 & -1 & 1 & 0 \\1 & -1 & -2 & 2 & -\frac{1}{2}\end{vmatrix}\xrightarrow{}\begin{vmatrix}1 & -1 & 1 & -1 & 1 \\0 & 0 & -2 & 2 & -1 \\0 & 0 & -3 & 3 & \frac{1}{2}\end{vmatrix} \\\rightarrow&\begin{vmatrix}1 & -1 & 1 & -1 & 1 \\0 & 0 & 1 & -1 & \frac{1}{2} \\0 & 0 & 0 & 0 & 0\end{vmatrix}\xrightarrow{}\begin{vmatrix}1 & -1 & 0 & 0 & \frac{1}{2} \\0 & 0 & 1 & -1 & \frac{1}{2} \\0 & 0 & 0 & 0 & 0\end{vmatrix},\end{aligned}$$

所以 $R\left ( A \right ) = R\left ( \overline{A}  \right ) = 2$ ，因而原方程组有解，且得同解方程组

$$\left\{ \begin{aligned} x_{1} = & \frac{1}{2} + x_{2}, \\ x_{3} = & \frac{1}{2} + x_{4}. \end{aligned} \right.\tag{4.12}$$

(1）求对应齐次线性方程组的一个基础解系.

由方程组(4.12)的对应齐次线性方程组分别取 $x_{2} = 1 , x_{4} = 0$ 和 $x_{2} = 0 , x_{4} = 1$ 得基础解系

$$\boldsymbol { \xi } _ { 1 } = ( 1 , 1 , 0 , 0 ) ^ { \mathrm { T } } , \quad \boldsymbol { \xi } _ { 2 } = ( 0 , 0 , 1 , 1 ) ^ { \mathrm { T } }$$

（2）求非齐次线性方程组的一个特解.

由式(4.12)取 $x_{2} = x_{4} = 0$ 得

$$\boldsymbol{Y}_{0}=\left(\frac{1}{2}, 0, \frac{1}{2}, 0\right)^{\mathrm{T}}.$$

故原方程组的通解为

$$\boldsymbol{X}=\boldsymbol{Y}_{0}+k_{1} \boldsymbol{\xi}_{1}+k_{2} \boldsymbol{\xi}_{2}, \quad k_{1}, k_{2}  为任意数 .$$

例8问λ为何值时，方程组 $\begin{cases}\lambda x_{1} + x_{2} + x_{3} = 1, \\x_{1} + \lambda x_{2} + x_{3} = \lambda, \\x_{1} + x_{2} + \lambda x_{3} = \lambda^{2}\end{cases}$ 有惟一解？有无穷多解?无

[page:139]

解？有解时并求解.

解

$$\begin{aligned}\overline{A} &=\begin{vmatrix}\lambda & 1 & 1 & 1 \\1 & \lambda & 1 & \lambda \\1 & 1 & \lambda & \lambda^{z}\end{vmatrix}\xrightarrow{}\begin{vmatrix}1 & 1 & \lambda & \lambda^{z} \\1 & \lambda & 1 & \lambda \\\lambda & 1 & 1 & 1 \\\end{vmatrix}\\&\xrightarrow{}\begin{vmatrix}1 & 1 & \lambda & \lambda \\0 & \lambda - 1 & 1 - \lambda & \lambda \left( 1 - \lambda \right) \\0 & 1 - \lambda & 1 - \lambda^{z} & 1 - \lambda^{3} \\\end{vmatrix}\\&\xrightarrow{}\begin{vmatrix}1 & 1 & \lambda & \lambda^{z} \\0 & \lambda - 1 & 1 - \lambda & \lambda \left( 1 - \lambda \right) \\0 & 0 & 2 - \lambda - \lambda^{z} & 1 - \lambda^{z} + \lambda - \lambda^{3} \\\end{vmatrix}\\&\xrightarrow{}\begin{vmatrix}1 & 1 & \lambda & \lambda^{z} \\0 & \lambda - 1 & 1 - \lambda & \lambda \left( 1 - \lambda \right) \\0 & 0 & \left( 1 - \lambda \right) \left( \lambda + 2 \right) & \left( 1 + \lambda \right)^{z} \left( 1 - \lambda \right) \\\end{vmatrix}.\end{aligned}\tag{4.13}$$

(1) $\lambda = 1$ 时， $R\left ( A \right ) = R\left ( \widetilde{A}  \right ) = 1 < n = 3$ ，有无穷多解.此时

$$\overline{A} \twoheadrightarrow \begin{pmatrix}1 & 1 & 1 & 1 \\0 & 0 & 0 & 0 \\0 & 0 & 0 & 0\end{pmatrix},$$

得同解方程组 $x_{1} = 1 - x_{2} - x_{3}$ .由其对应的齐次线性方程组取 $x_{2} = 1 , x_{3} = 0$ 和 $x_{2} = 0$ $x _ { 3 } { = } 1$ 得对应齐次线性方程组的基础解系

$$\boldsymbol { \xi } _ { 1 } = ( - 1 , 1 , 0 ) ^ { \mathrm { T } } , \quad \boldsymbol { \xi } _ { 2 } = ( - 1 , 0 , 1 ) ^ { \mathrm { T } } .$$

取 $x_{2} = x_{3} = 0$ 得非齐次线性方程组的特解

$$\boldsymbol{Y}_{0}=(1,0,0)^{\mathrm{T}}.$$

故原方程组的通解为

$$\bar{X}=Y_{0}+k_{1}\xi_{1}+k_{2}\xi_{2},\quad k_{1},k_{2}  为任意数 .$$

(2) $\lambda = - 2$ 时 $R\left ( A \right ) = 2 \ne R\left ( \overline{A}  \right ) = 3$ ，无解.

(3) $\lambda \ne 1, -2$ 时， $R\left ( A \right ) =R\left ( \overline{A}  \right ) =3=n$ ，所以有惟一解.此时由式(4.13)直接得

$$\left\{ \begin{aligned} x_{1} &= \frac{- \lambda - 1}{\lambda + 2}, \\ x_{2} &= \frac{1}{\lambda + 2}, \\ x_{3} &= \frac{(\lambda + 1)^{2}}{\lambda + 2}. \end{aligned} \right.$$

例9判断方程组 $\left\{ \begin{array} { c c } { x _ { 1 } + } & { x _ { 2 } = 1 , } \\ { a x _ { 1 } + } & { b x _ { 2 } = c , } \\ { a ^ { 2 } x _ { 1 } + b ^ { 2 } x _ { 2 } = c ^ { 2 } . } & { } \\ \end{array} \right.$ ，是否有解，其中 $a , b , c$ 互不相等.

[page:140]

解因

$$\mathrm{det} \bar{A} = \begin{vmatrix} 1 & 1 & 1 \\ a & b & c \\ a^{2} & b^{2} & c^{2} \end{vmatrix} = (b - a)(c - a)(c - b)$$

由题设知 $\det \overline{A} \neq 0$ ，因而 $R(\overline{A}) = 3$ ，而 $R(A)=2$ ,故 $R\left(A\right)\neq R\left(\overline{A}\right)$ ，于是方程组无解.

例10 已知方程组

$$\begin{cases}a_{11}x_{1} + a_{12}x_{2} + \cdots + a_{1n}x_{n} = b_{1}, \\a_{21}x_{1} + a_{22}x_{2} + \cdots + a_{2n}x_{n} = b_{2}, \\\cdots\cdots\cdots\cdots \\a_{n1}x_{1} + a_{n2}x_{2} + \cdots + a_{nn}x_{n} = b_{n}\end{cases}\tag{4.14}$$

的系数矩阵A的秩等于 $\boldsymbol{B} = \begin{pmatrix}a_{11} & a_{12} & \cdots & a_{1n} & b_{1} \\\vdots & \vdots & & \vdots & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn} & b_{n} \\b_{1} & b_{2} & \cdots & b_{n} & 0\end{pmatrix}$ 的秩，证明方程组(4.14)有解.

证增广矩阵

$$\overline{A} = \begin{bmatrix}a_{11} & a_{12} & \cdots & a_{1n} \vdots & b_{1} \\a_{21} & a_{22} & \cdots & a_{2n} \vdots & b_{2} \\\vdots & \vdots & & \vdots & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn} \vdots & b_{n}\end{bmatrix},$$

显然 $\bar{\boldsymbol{s}}$ 的行向量组是B的行向量组的部分组，因而A的行向量组可以由B的行向量组线性表出，从而 $\bar { A }$ 的行向量组的秩小于等于B的行向量组的秩，所以

$$R \left( \bar{A} \right) \leqslant R \left( B \right).$$

又已知 $R\left(A\right)=R\left(B\right)$ ,于是

$$R\left ( A \right ) =R\left ( B \right ) \geqslant R\left ( \overline{A}  \right ) .\tag{4.15}$$

又因A的列向量组可由 $\overline { A }$ 的列向量组线性表出，因此

$$R\left ( A \right ) \le R\left ( \overline{A}  \right ) .\tag{4.16}$$

由式(4.15)，(4.16)得 $R\left(A\right)=R\left(\bar{A}\right)$ .故方程组(4.14)有解.

例11 讨论两平面

$$\begin{aligned}\pi_{1} : \quad & a_{1}x + b_{1}y + c_{1}z = d_{1}, \\\pi_{2} : \quad & a_{2}x + b_{2}y + c_{2}z = d_{2}\end{aligned}$$

之间的关系.设

$$\begin{aligned}\boldsymbol{A} &= \begin{bmatrix}a_{1} & b_{1} & c_{1} \\a_{2} & b_{2} & c_{2}\end{bmatrix}, \quad\overline{\boldsymbol{A}} = \begin{bmatrix}a_{1} & b_{1} & c_{1} & d_{1} \\a_{2} & b_{2} & c_{2} & d_{2}\end{bmatrix}.\end{aligned}$$

[page:141]

当 $R(A)=2$ 时，非齐次线性方程组有解，但 $R\left(A\right)=R\left(\overline{A}\right)=2<n=3$ ，因而有无穷多解.所以两平面相交于一直线；

当 $R(A)=1,R(\overline{A})=2$ 时，非齐次线性方程组无解，所以两平面平行；

当 $R(\bar{A}) = R(\bar{A}) = 1$ 时，显然 $\overline{A}$ 的两个行向量线性相关，即 $a_{1},b_{1},c_{1},d_{1}$ 与 $a _ { 2 }$ $b _ { 2 } , c _ { 2 } , d _ { 2 }$ 成比例，所以两平面相重合.

## 例12 讨论空间三个平面

$$\begin{aligned}\pi_{1}: \quad & a_{1}x + b_{1}y + c_{1}z = d_{1}, \\\pi_{2}: \quad & a_{2}x + b_{2}y + c_{2}z = d_{2}, \\\pi_{3}: \quad & a_{3}x + b_{3}y + c_{3}z = d_{3}\end{aligned}$$

的位置关系.设

$$\begin{aligned}\boldsymbol{A} &= \begin{bmatrix}a_{1} & b_{1} & c_{1} \\a_{2} & b_{2} & c_{2} \\a_{3} & b_{3} & c_{3}\end{bmatrix}, \quad\overline{\boldsymbol{A}} = \begin{bmatrix}a_{1} & b_{1} & c_{1} & d_{1} \\a_{2} & b_{2} & c_{2} & d_{2} \\a_{3} & b_{3} & c_{3} & d_{3}\end{bmatrix}.\end{aligned}$$

现在我们利用向量组的线性相关性及线性方程组的理论来讨论这三个平面的位置关系.

1. $R(A)=3$

这时 $R(\overline{A}) = 3$ ，根据克拉默法则知，上面方程组有惟一解，所以三个平面交于一点(见图4.5(1)).

2. $R(A)=2,R(\bar{A})=3.$

此时方程组无解，所以三个平面不相交.又因为 $R(A)=2$ ，所以A的三个行向量$a_{1},a_{2},a_{3}$ (它们也是三个平面的法向量)线性相关，即存在不全为零的实数 $k_{1},k_{2},k_{3}$使得 $k_{1} \boldsymbol{a}_{1} + k_{2} \boldsymbol{a}_{2} + k_{3} \boldsymbol{a}_{3} = \mathbf{0}$ 当 $k_{1},k_{2},k_{3}$ 都不为零时，有 $a_{i} \times a_{j} \neq 0 (i \neq j)$ ，即任意两个平面相交，且由

$$\boldsymbol{a}_{1} \cdot (\boldsymbol{a}_{2} \times \boldsymbol{a}_{3}) = \left[ \boldsymbol{a}_{1} \quad \boldsymbol{a}_{2} \quad \boldsymbol{a}_{3} \right] = \det \boldsymbol{A} = 0$$

知 $\pi_{2}$ 和 $\pi_{3}$ 的交线与 $\pi_{1}$ 平行.同理可知， $\pi_{1}$ 和 $\pi_{3}$ 的交线与 $\pi_{2}$ 平行 $;\pi_{1}$ 和 $\pi_{2}$ 的交线

[page:142]

与 $\pi_{3}$ 平行.因此三个平面形成一个三棱柱(见图4.5(2)).当 $k_{1},k_{2},k_{3}$ 中有一个为零时，三个平面中有两个平面平行，另一平面与这两个平面相交(见图4.5(3)).

## 3. R(A)=2,R(A)=2.

这时方程组有解，且解里仅含一个参数，故三个平面相交于一条直线.又因为$R(\overline{A}) = 2$ ，所以 $\overline { A }$ 的三个行向量 $b_{1},b_{2},b_{3}$ 线性相关，即存在不全为零的实数 $k_{1} ; k_{2}$ $\vec{k}_{3}$ ，使得 $k_{1} \boldsymbol{b}_{1} + k_{2} \boldsymbol{b}_{2} + k_{3} \boldsymbol{b}_{3} = \mathbf{0}$ 当 $k_{1},k_{2},k_{3}$ 都不为零时，三个平面互异（见图4.5 (4)).当 $k_{1},k_{2},k_{3}$ 中有一个为零时，三平面中有两个平面重合(见图4.5(5)).

## 4. R(A)=1,R(A)=2.

此时方程组无解，所以三个平面不相交.又因为 $R(A)=1$ ，所以三个平面平行；而由 $R(\bar{A}) = 2$ 知三个平面中至少有两个平面互异.即三个平面平行，并且互异(见图4.5 (6))；或三个平面平行，其中有两个平面重合(见图4.5(7)).

## 5. R(A)=1,R(A)=1.

这时方程组有解，且解里含两个参数，故这些解所对应的点必在一个平面内，即三个平面重合(见图4.5(8)).

三个平面总共有上述八种不同的位置.

## 应用实例:投入产出模型

现代生产高度专业化的特点，使得一个经济系统内众多的生产部门之间紧密关联，相互依存.每个部门在生产过程中都要消耗各个部门提供的产品或服务，称之为投入；每个部门也向各个部门及社会提供自己的产品或服务，称之为产出.投入产出数学模型就是应用线性代数理论所建立的，研究经济系统各部门之间投入产出综合平衡关系的经济数学模型.

若从事的是生产活动，产出就是生产的产品.这里我们只讨论价值型投入产出模型，投入和产出都用货币数值来度量.

在一个经济系统中，每个部门(企业)作为生产者，它既要为自身及系统内其他部门(企业)进行生产而提供一定的产品，又要满足系统外部(包括出口)对它的产品需求.另一方面，每个部门(企业)为了生产其产品，又必然是消耗者，它既有物资方面的消耗(消耗本部门(企业)和系统内其他部门(企业)所生产的产品，如原材料、设备、运输和能源等)，又有人力方面的消耗.消耗的目的是为了生产，生产的结果必然要创造新的价值，以用于支付劳动者的报酬、缴付税金和获取合理的利润.显然，对每个部门(企业)来讲，在物资方面的消耗和新创造的价值等于它的总产品的价值，这就是“投入”与“产出”之间的总的平衡关系.

## (一)分配平衡方程组

我们从产品分配的角度讨论投入产出的一种平衡关系.即讨论:在经济系统内每个部门(企业)的产品产量与系统内部对产品的消耗及系统外部对产品的需求处于平衡的情况下，如何确定各部门(企业)的产品产量.

设某个经济系统由n个企业组成，为帮助理解，列表4.1如下:

[page:143]

## 表4.1

<table><tr><td rowspan=2 colspan=2>直接消耗系数</td><td colspan=4>消耗企业</td><td rowspan=2>外部需求</td><td rowspan=2>总产值</td></tr><tr><td>1</td><td>2</td><td>…</td><td>n</td></tr><tr><td rowspan=4>生产企业</td><td>1</td><td><eq>c_{11}</eq></td><td><eq>\mathcal { C } _ { 1 2 }</eq></td><td>...</td><td><eq>\mathcal { C } _ { \perp n }</eq></td><td><eq>d _ { 1 }</eq></td><td><eq>x_{1}</eq></td></tr><tr><td>2</td><td><eq>C_{21}</eq></td><td><eq>c_{22}</eq></td><td>……</td><td><eq>\mathcal { C } _ { 2 n }</eq></td><td><eq>d _ { 2 }</eq></td><td><eq>x _ { 2 }</eq></td></tr><tr><td></td><td></td><td></td><td></td><td>…</td><td></td><td>...</td></tr><tr><td>n</td><td><eq>\widetilde{C_{n1}}</eq></td><td><eq>\overline{C_{n2}}</eq></td><td>…</td><td><eq>C_{nm}</eq></td><td><eq>d_{n}</eq></td><td><eq>x _ { n }</eq></td></tr></table>

其中 $x_{i}$ 表示第i个企业的总产值， $x_{i} \geq 0 ; d_{i}$ 表示系统外部对第i个企业的产值的需求量， $d_{i} \geq 0 ; c_{ij}$ 表示第j个企业生产单位产值需要消耗第i个企业的产值数，称为第j个企业对第i个企业的直接消耗系数， $c_{ij} \geqslant 0$

表中编号相同的生产企业和消耗企业是指同一个企业.如“1”号表示煤矿，“2”号表示电厂， $c . 2 1$ 表示煤 $矿$ 生产单位产值需要直接消耗电厂的产值数， $c _ { 2 2 }$ 表示电厂生产单位产值需要直接消耗自身的产值数， $d_{2}$ 表示系统外部对电厂产值的需求量， $x_{2}$ 表示电厂的总产值.

第i个企业分配给系统内各企业生产性消耗的产值数为

$$c_{i1}x_{1} + c_{i2}x_{2} + \cdots + c_{in}x_{n}$$

提供给系统外部的产值数为 $d _ { i }$ ，这两部分之和就是第i个企业的总产值 $x _ { i }$ .于是可得分配平衡方程组

$$x_{i} = \left( \sum_{j = 1}^{n} c_{ij} x_{j} \right) + d_{i} , \quad i = 1, 2, \cdots, n,\tag{4.17}$$

记

$$\boldsymbol{C} = \begin{pmatrix}c_{11} & c_{12} & \cdots & c_{1n} \\c_{21} & c_{22} & \cdots & c_{2n} \\\vdots & \vdots & & \vdots \\c_{n1} & c_{n2} & \cdots & c_{nn}\end{pmatrix}, \quad\boldsymbol{X} = \begin{pmatrix}x_{1} \\x_{2} \\\vdots \\x_{n}\end{pmatrix}, \quad\boldsymbol{d} = \begin{pmatrix}d_{1} \\d_{2} \\\vdots \\d_{n}\end{pmatrix},$$

于是式(4.17)可表示成矩阵形式

$$X = C X + d ,\tag{4.18}$$

即

$$(I - C)X = d\tag{4.19}$$

式(4.18)或式(4.19)是投入产出数学模型之一，这是一个含n个未知量 $x_{i}   (i = 1$ 2，…,n)和n个方程的线性方程组.

C称为直接消耗系数矩阵，X称为生产向量，d称为外部需求向量.显然它们的元

[page:144]

均非负.

若设 $x_{ij}$ 表示第j部门在生产过程中消耗第i部门的产品数量，一般称为中间产品，如 $x_{12}$ 表示第2部门在生产过程中消耗第1部门的生产数量.于是显然第j部门对第i部门的直接消耗系数

$$c_{ij} = \frac{x_{ij}}{x_j}, \quad i,j = 1,2,\cdots,n.$$

由上式可知，直接消耗系数矩阵C具有以下性质:

$$(1) 0 \leqslant c_{ij} \leqslant 1, \quad i,j = 1,2,\cdots,n; \quad (2) \sum_{i = 1}^{n}c_{ij} < 1, \quad j = 1,2,\cdots,n.$$

可以证明I一C是可逆的，且其逆的元均非负.从而，分配平衡方程组 $(I - C)X = d$一定有惟一解 $X = (I - C)^{-1}d$

实例一某工厂有三个车间，设在某一生产周期内，车间之间直接消耗系数及总产值如表4.2:

表4.2<table><tr><td rowspan=2 colspan=2>直接消耗系数</td><td colspan=3>消耗车间</td><td rowspan=2>外部需求</td><td rowspan=2>总产值</td></tr><tr><td>1</td><td>2</td><td>3</td></tr><tr><td rowspan=3>生产车间</td><td>1</td><td>0.25</td><td>0.10</td><td>0.10</td><td><eq>d _ { 1 }</eq></td><td>400</td></tr><tr><td>2</td><td>0.20</td><td>0.20</td><td>0.10</td><td><eq>d _ { 2 }</eq></td><td>250</td></tr><tr><td>3</td><td>0.10</td><td>0.10</td><td>0.20</td><td><eq>d _ { 3 }</eq></td><td>300</td></tr></table>

为使各车间与系统内外需求平衡，求:(1)各车间的最终产品 $d_{1},d_{2},d_{3};(2)$ 各车间之间的中间产品 $x_{ij}(i,j = 1,2,3)$

解（1)

$$\boldsymbol{d} = \begin{bmatrix} d_{1} \\ d_{2} \\ d_{3} \end{bmatrix} = (\boldsymbol{I} - \boldsymbol{C})\boldsymbol{X} = \begin{bmatrix} 0.75 & -0.10 & -0.10 \\ -0.20 & 0.80 & -0.10 \\ -0.10 & -0.10 & 0.80 \end{bmatrix}\begin{bmatrix} 400 \\ 250 \\ 300 \end{bmatrix} = (245, 90, 175)^{\mathrm{T}}$$

即 $d_{1}=245,d_{2}=90,d_{3}=175;$

(2) 由 $x_{ij} = c_{ij}x_{j}, \quad i,j = 1,2,3$ ,得

$$x_{11}=0.25 \times 400=100, \quad x_{12}=0.1 \times 250=25, \quad x_{13}=0.1 \times 300=30,$$

同理得

$$\begin{aligned}x_{21} &= 80, \quad x_{22} = 50, \quad x_{23} = 30, \\x_{31} &= 40, \quad x_{32} = 25, \quad x_{33} = 60.\end{aligned}$$

实例二设某一经济系统在某生产周期内的直接消耗系数矩阵C和外部需求向量如下:

[page:145]

$$\boldsymbol{C}=\begin{bmatrix}0.25&0.1&0.1\\0.2&0.2&0.1\\0.1&0.1&0.2\end{bmatrix},\quad\boldsymbol{d}=\begin{bmatrix}235\\125\\210\end{bmatrix},$$

求该系统在这一生产周期内的总产值向量X.

解 由分配平衡方程组 $(I - C)X = d$ 的增广矩阵

$$\begin{aligned}&\begin{bmatrix}0.75 & -0.1 & -0.1 & \vdots & 235 \\-0.2 & 0.8 & -0.1 & \vdots & 125 \\-0.1 & -0.1 & 0.8 & \vdots & 10\end{bmatrix}\xrightarrow{}\begin{bmatrix}0 & -0.85 & 5.9 & \vdots & 1\ 810 \\0 & 1 & -1.7 & \vdots & -295 \\1 & 1 & -8 & -2\ 100\end{bmatrix}\\\xrightarrow{}&\begin{bmatrix}1 & 1 & -8 & \vdots & -2\ 100 \\0 & 1 & -1.7 & \vdots & -295 \\0 & -0.85 & 5.9 & 1\ 810\end{bmatrix}\xrightarrow{}\begin{bmatrix}1 & 0 & -6.3 & \vdots & -1\ 805 \\0 & 1 & -1.7 & \vdots & -295 \\0 & 0 & -4.455 & 1\ 559.25\end{bmatrix}\\\xrightarrow{}&\begin{bmatrix}1 & 0 & 0 & \vdots & 400 \\0 & 1 & 0 & \vdots & 300 \\0 & 0 & 1 & \vdots & 350\end{bmatrix}\end{aligned}$$

知， $\boldsymbol{X} = (400, 300, 350)^{\mathrm{T}}$

## (二)消耗平衡方程组

这里我们从消耗的角度讨论投入产出的另一种平衡关系，它是在系统内各个部门(企业)的总产值应与生产性消耗及新创造的价值(净产值)相等(相平衡)的情况下，讨论系统内各部门(企业)的总产值与新创造的价值(净产值)之间的相互关系.

某个经济系统的几个企业之间的直接消耗系数仍如前所述，那么第j个企业生产产值 $\mathcal { X } _ { j }$ 需要消耗自身和其他企业的产值数(在原材料、运输、能源、设备等方面的生产性消耗)为 $c_{1j}x_{j} + c_{2j}x_{j} + \cdots + c_{nj}x_{j}$ ，如果生产产值 $\mathcal { X } _ { j }$ 所获得的净产值为 $z_{j}$ ，则 $x _ { j } =$ $c_{1j}x_{j} + c_{2j}x_{j} + \cdots + c_{nj}x_{j} + z_{j}$ ,即

$$x_{j} = \left( \sum_{i = 1}^{n} c_{ij} \right) x_{j} + z_{j}, \quad j = 1, 2, \cdots, n,\tag{4.20}$$

方程组(4.20)称为消耗平衡方程组.式(4.20)可写成

$$(1 - \sum_{i = 1}^{n} c_{ij})x_{j} = z_{j}, \quad j = 1,2,\cdots,n.\tag{4.21}$$

记

$$\boldsymbol{D}=\begin{pmatrix}\sum\limits_{i = 1}^{n}c_{i1} & & & \\& \sum\limits_{i = 1}^{n}c_{i2} & & \\& & \ddots & \\& & & \sum\limits_{i = 1}^{n}c_{in}\end{pmatrix}, \quad\boldsymbol{Z}=\begin{pmatrix}z_{1} \\z_{2} \\\vdots \\z_{n}\end{pmatrix},$$

[page:146]

于是式(4.20)，(4.21)的矩阵形式为

$$X = DX + Z ,\tag{4.22}$$

即

$$(I - D)X = Z.\tag{4.23}$$

式(4.22)，(4.23)是投入产出模型之二，它揭示了经济系统的生产向量X、净产值向量Z与企业消耗矩阵D之间的关系.

由式(4.17)和式(4.20)可得 $\sum_{i = 1}^{n} \left[ \left( \sum_{j = 1}^{n} c_{ij} x_{j} \right) + d_{i} \right] = \sum_{j = 1}^{n} \left[ \left( \sum_{i = 1}^{n} c_{ij} x_{j} \right) + z_{j} \right]$ ,故

$$\sum_{i = 1}^{n} d_{i} = \sum_{j = 1}^{n} z_{j},\tag{4.24}$$

式(4.24)表明，系统外部对各企业产值的需求量总和等于系统内部各企业净产值之总和.

## 题4.4

1. 求下列齐次线性方程组的基础解系:

(1)

$$\begin{cases}x_{1} + x_{2} + 2x_{3} - x_{4} = 0, \\2x_{1} + x_{2} + x_{3} - x_{4} = 0, \\2x_{1} + 2x_{2} + x_{3} + 4x_{4} = 0;\end{cases}$$

(2)

$$\begin{cases}2x_{1} + 3x_{2} - x_{3} + 5x_{4} = 0, \\3x_{1} + x_{2} + 2x_{3} - 7x_{4} = 0, \\4x_{1} + x_{2} - 3x_{3} + 6x_{4} = 0, \\x_{1} - 2x_{2} + 4x_{3} - 7x_{4} = 0.\end{cases}$$

2. 当λ为何值时，齐次线性方程组

$$\left\{ \begin{aligned} ( \lambda - 2 ) x _ { 1 } - 3 x _ { 2 } & - 2 x _ { 3 } = 0 , \\ - x _ { 1 } + ( \lambda - 8 ) x _ { 2 } & - 2 x _ { 3 } = 0 , \\ 2 x _ { 1 } + 1 4 x _ { 2 } + ( \lambda + 3 ) x _ { 3 } & = 0 \end{aligned} \right.$$

有非零解？并求出它的通解.

3. 设 $\xi_{1}, \xi_{2}$ 为某齐次线性方程组的基础解系，问 $\xi_{1} + \xi_{2} , 2\xi_{1} - \xi_{2}$ 是否可构成该方程组的基础解系？为什么？

4. 设线性方程组 $AX = 0$ 只有零解，证明:对任意正整数k， $A^{k}X = 0$ 也只有零解.

5. 求下列非齐次线性方程组的通解:

(1)

$$\begin{cases}4x_{1} + 2x_{2} - x_{3} = 2, \\3x_{1} - x_{2} + 2x_{3} = 10, \\11x_{1} - 3x_{2} = 8;\end{cases}$$

(2)

$$\begin{cases}x_{1} - x_{2} + x_{4} = 1, \\2x_{1} + x_{3} = 2, \\3x_{1} - x_{2} - x_{3} - x_{4} = 0\end{cases}$$

(3)

$$\begin{cases}x_{1} + x_{2} - 3x_{3} - x_{4} = 1, \\3x_{1} - x_{2} - 3x_{3} + 4x_{4} = 4, \\x_{1} + 5x_{2} - 9x_{3} - 8x_{4} = 0.\end{cases}$$

[page:147]

6.a，b为何值时，方程组 $\begin{cases}x_{1} + 2x_{2} + 3x_{3} - x_{4} = b, \\- x_{1} + x_{2} \quad + 4x_{4} = 3 - b, \\2x_{1} + 3x_{2} + 5x_{3} + ax_{4} = 1\end{cases}$ ，有解？有解时求出解.

7.设

$$\begin{aligned} &\begin{vmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & & \vdots \\ a_{n1} & a_{n2} & \cdots & a_{nn} \end{vmatrix} \neq 0 \text{。 }\\ \end{aligned}$$

问方程组

$$\begin{cases}a_{11}x_{1} + a_{12}x_{2} + \cdots + a_{1,n-1}x_{n-1} = a_{1n}, \\a_{21}x_{1} + a_{22}x_{2} + \cdots + a_{2,n-1}x_{n-1} = a_{2n}, \\\cdots\cdots\cdots\cdots \\a_{n1}x_{1} + a_{n2}x_{2} + \cdots + a_{n,n-1}x_{n-1} = a_{nn}\end{cases}$$

是否有解?

8. 试求下列方程组有解的充分必要条件:

$$\begin{cases}x_{1} - x_{2} = a_{1}, \\x_{2} - x_{3} = a_{2}, \\\quad \cdots \cdots \cdots \cdots \\x_{n - 1} - x_{n} = a_{n - 1}, \\x_{n} - x_{1} = a_{n},\end{cases}$$

9. 设 $\eta ^ { * }$ 是非齐次线性方程组 $AX = b$ 的一个解， $\xi_{1}, \xi_{2}, \cdots, \xi_{n-r}$ 是对应的齐次线性方程组的一个基础解系.证明:

(1) $\eta \cdot , \xi _ { 1 } , \xi _ { 2 } , \cdots , \xi _ { n - 1 }$ 线性无关；

(2) $\eta^{*}, \eta^{*} + \xi_{1}, \eta^{*} + \xi_{2}, \cdots, \eta^{*} + \xi_{n-}$ 线性无关.

10.设四元非齐次线性方程组的系数矩阵的秩为3，已知 $\eta_{1}, \eta_{2}, \eta_{3}$ 是它的三个解向量，且

$$\boldsymbol{\eta}_{1}=\left(\begin{aligned}2 \\ 3 \\ 4 \\ 5\end{aligned}\right), \quad \boldsymbol{\eta}_{2}+\boldsymbol{\eta}_{3}=\left(\begin{aligned}1 \\ 2 \\ 3 \\ 4\end{aligned}\right).$$

求该方程组的通解.

## 习题四

1. 下列命题是否正确？如正确，证明之；如不正确，举反例:

(1) $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m} (m > 2)$ 线性无关的充要条件是任意两个向量线性无关；

[page:148]

(2) $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m} (m > 2)$ 线性相关的充要条件是有m—1个向量线性相关；

(3) 若 $\alpha_{1}, \alpha_{2}$ 线性相关， $\beta_{1}, \beta_{2}$ 线性相关，则有不全为零的数 $\boldsymbol{k}_{\perp}$ 和 $k _ { 2 }$ ，使 $k_{1}a_{1} +$ $k_{2} \boldsymbol{\alpha}_{2} = \boldsymbol{0}$ 且k $\boldsymbol{\beta}_{1}+k_{2} \boldsymbol{\beta}_{2}=\mathbf{0}$ ，从而使 $k_{1}\left( \boldsymbol{\alpha}_{1} + \boldsymbol{\beta}_{1} \right) + k_{2}\left( \boldsymbol{\alpha}_{2} + \boldsymbol{\beta}_{2} \right) = \mathbf{0}$ ，故 $\boldsymbol{\alpha}_{1} + \boldsymbol{\beta}_{1}$ $\alpha_{2} + \beta_{2}$ 线性相关；

(4) 若 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关，则 $\alpha_{1} - \alpha_{2} , \alpha_{2} - \alpha_{3} , \alpha_{3} - \alpha_{1}$ 线性无关；

(5) 若 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 线性无关，则 $\alpha_{1} + \alpha_{2} , \alpha_{2} + \alpha_{3} , \alpha_{3} + \alpha_{4} , \alpha_{4} + \alpha_{1}$ 线性无关；

(6)若 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n} (n > 2)$ 线性相关，则 $\alpha_{1} + \alpha_{2}, \alpha_{2} + \alpha_{3}, \cdots, \alpha_{n - 1} + \alpha_{n}, \alpha_{n} + \alpha_{1}$ 线性相关.

2.对任意向量组 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ ，证明: $\boldsymbol{\alpha}_{1}-\boldsymbol{\alpha}_{2},\boldsymbol{\alpha}_{2}-\boldsymbol{\alpha}_{3},\boldsymbol{\alpha}_{3}-\boldsymbol{\alpha}_{1}$ 线性相关.

3. 如果 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性相关，那么其中每一向量是否都可以是其余向量的线性组合?

4. 如果存在一组不全为零的数 $k_{1},k_{2},\cdots,k_{m}$ ，使 $k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + \cdots + k_{m}\boldsymbol{\alpha}_{m} \neq \mathbf{0}$ ，那么$\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 是否一定线性无关？

5. 对于平面或空间中的向量，线性相关与线性无关的概念有何几何意义？

6. 设 $\boldsymbol{\alpha}_{1}=\begin{bmatrix}a_{1}\\a_{2}\\a_{3}\end{bmatrix},\boldsymbol{\alpha}_{2}=\begin{bmatrix}b_{1}\\b_{2}\\b_{3}\end{bmatrix},\boldsymbol{\alpha}_{3}=\begin{bmatrix}c_{1}\\c_{2}\\c_{3}\end{bmatrix}$ ，则平面上三条直线

$$\begin{cases}a_{1}x + b_{1}y + c_{1} = 0, \\a_{2}x + b_{2}y + c_{2} = 0, \quad (a_{i}^{2} + b_{i}^{2} \neq 0, i = 1, 2, 3), \\a_{3}x + b_{3}y + c_{3} = 0\end{cases}$$

交于一点的充要条件是什么？

7. 设 γ是 $\beta_{1}, \beta_{2}, \cdots, \beta_{s}$ 的线性组合，而 $\boldsymbol{\beta}_{i}(i = 1,2,\cdots,s)$ 又都是 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 的线性组合，证明:γ必为 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 的线性组合.

8. 设向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性无关，向量组 $\beta , \alpha _ { 1 } , \alpha _ { 2 } , \cdots , \alpha _ { m } ( \beta \neq 0 )$ 线性相关，则 $\beta$ $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 中有且仅有一个向量 $\alpha _ { i }$ 可由其前面的向量线性表出.

9. 设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 线性无关，

$$\begin{cases}\boldsymbol{\beta}_{1} = a_{11}\boldsymbol{\alpha}_{1} + a_{12}\boldsymbol{\alpha}_{2} + \cdots + a_{1s}\boldsymbol{\alpha}_{s}, \\\boldsymbol{\beta}_{2} = a_{21}\boldsymbol{\alpha}_{1} + a_{22}\boldsymbol{\alpha}_{2} + \cdots + a_{2s}\boldsymbol{\alpha}_{s}, \\\cdots\cdots\cdots\cdots \\\boldsymbol{\beta}_{s} = a_{s1}\boldsymbol{\alpha}_{1} + a_{s2}\boldsymbol{\alpha}_{2} + \cdots + a_{s s}\boldsymbol{\alpha}_{s},\end{cases}\boldsymbol{A} =\begin{pmatrix}a_{11} & a_{12} & \cdots & a_{1s} \\a_{21} & a_{22} & \cdots & a_{2s} \\\vdots & \vdots & & \vdots \\a_{s1} & a_{s2} & \cdots & a_{s s}\end{pmatrix},$$

证明: $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{s}$ 线性无关的充要条件是 $\det A \neq 0$

10. 设向量 $\beta$ 可由向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r}$ 线性表出，但不能由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r-1}$ 线性表出.证明:

(1) $\alpha _ { r }$ 不能由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r-1}$ 线性表出；

(2) $\alpha _ { i j }$ 能由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r-1}, \beta$ 线性表出.

11. 设 $\boldsymbol{\alpha}_{1}=(-2,1,0,3),\boldsymbol{\alpha}_{2}=(1,-3,2,4),\boldsymbol{\alpha}_{3}=(3,0,2,-1),\boldsymbol{\alpha}_{4}=(2,-2,4,6)$ ,判定向量组 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 的线性相关性.若线性相关，试将其中一个向量表示为其

[page:149]

余向量的线性组合.

12. 设 $\boldsymbol{\alpha}_{1}=(3,1,2,5),\boldsymbol{\alpha}_{2}=(1,1,1,2),\boldsymbol{\alpha}_{3}=(2,0,1,3),\boldsymbol{\alpha}_{4}=(1,-1,0,1),\boldsymbol{\alpha}_{5}=(4$ 2,3，7)，求此向量组的一个最大无关组，并用它表示其余向量.

13.已知 $\boldsymbol{\alpha}_{1}=(1,0,2,3),\boldsymbol{\alpha}_{2}=(1,1,3,5),\boldsymbol{\alpha}_{3}=(1,-1,a+2,1),\boldsymbol{\alpha}_{4}=(1,2,4,a+8)$ $\boldsymbol{\beta} = (1,1,b + 3,5)$ ，问:

(1) a,b为何值时，β不能表示成 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 的线性组合？

(2) a,b 为何值时 $, \beta$ 可由 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 惟一线性表示？并写出该表示式.

14.判断下面两个向量组是否等价，并说明理由:

$$\begin{align*}(  I  ) ; \boldsymbol{\alpha}_{1} = \begin{bmatrix} 1 \\ 0 \end{bmatrix} , \boldsymbol{\alpha}_{2} = \begin{bmatrix} 0 \\ 1 \end{bmatrix} ; \quad (  II  ) ; \boldsymbol{\beta}_{1} = \begin{bmatrix} 1 \\ 1 \end{bmatrix} , \boldsymbol{\beta}_{2} = \begin{bmatrix} 2 \\ 1 \end{bmatrix} , \boldsymbol{\beta}_{3} = \begin{bmatrix} 1 \\ 2 \end{bmatrix} .\end{align*}$$

15. 设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 为齐次方程组 $AX = 0$ 的基础解系， $\boldsymbol { \beta } _ { 1 } = t _ { 1 } \boldsymbol { \alpha } _ { 1 } + t _ { 2 } \boldsymbol { \alpha } _ { 2 } , \boldsymbol { \beta } _ { 2 } = t _ { 1 } \boldsymbol { \alpha } _ { 2 } +$ $t_{2}\boldsymbol{\alpha}_{3},\cdots,\boldsymbol{\beta}_{s}=t_{1}\boldsymbol{\alpha}_{s}+t_{2}\boldsymbol{\alpha}_{1}$ ，其中 $t _ { 1 } , t _ { 2 }$ 为常数.试问 $t_{1} \cdot t_{2}$ 满足什么条件时， $\beta_{1}$ 6 $\beta_{2},\cdots,\beta_{s}$ 也为 $AX = 0$ 的一个基础解系.

16. 设A为n阶方阵，且 $A^{2}-A=2I$ ，证明: $R(2I - A) + R(I + A) = n$

17.设 $\boldsymbol{\beta}_{1} , \boldsymbol{\beta}_{2}$ 为非齐次线性方程组 $AX = b$ 的两个不同的解， $\alpha_{1}, \alpha_{2}$ 是对应齐次线性方程组的基础解系 $,k_{1},k_{2}$ 为任意常数，证明:方程组 $AX = b$ 的通解为

$$k_{1}\boldsymbol{\alpha}_{1} + k_{2}(\boldsymbol{\alpha}_{1} - \boldsymbol{\alpha}_{2}) + \frac{1}{2}(\boldsymbol{\beta}_{1} + \boldsymbol{\beta}_{2}).$$

18.问λ为何值时，方程组 $\begin{cases}\lambda x_{1} - x_{2} - x_{3} = 1, \\- x_{1} + \lambda x_{2} - x_{3} = - \lambda, \\- x_{1} - x_{2} + \lambda x_{3} = \lambda^{2}\end{cases}$ ，有解，并求出解的一般形式。

19.设四元齐次线性方程组(Ⅰ) $\begin{cases}x_{1} + x_{2} = 0, \\x_{2} - x_{4} = 0,\end{cases}$ 又已知某齐次线性方程组(Ⅱ)的通解为

$$k_{1}(0,1,1,0)^{\mathrm{T}} + k_{2}(-1,2,2,1)^{\mathrm{T}} \quad (k_{1},k_{2} \in \mathbf{R}).$$

(1)求方程组(Ⅰ)的基础解系；

(2)问(Ⅰ)和(Ⅱ)是否有非零公共解？若有，则求出所有的非零公共解；若没有，则说明理由.

20. 设A是 $m \times m$ 矩阵,B是 $m \times n$ 矩阵， $n \ll m$ ,若 $A B = I$ ，证明B的列向量组线性无关.

21. 设A是n阶矩阵，若存在正整数k，使线性方程组 $A^{k}X = 0$ 有解向量α，且 $A^{k - 1}\alpha \neq 0.$ 证明:向量组 $\alpha , A \alpha , \cdots , A ^ { k - 1 } \alpha$ 线性无关.

22. 设有向量组 $\begin{array}{l}(  I  ) ; \boldsymbol{\alpha}_{1} = ( 1 , 0 , 2 ) , \boldsymbol{\alpha}_{2} = ( 1 , 1 , 3 ) , \boldsymbol{\alpha}_{3} = ( 1 , - 1 , a + 2 )\end{array}$ 和向量组(Ⅱ): $\beta_{1} = (1,2,a + 3), \beta_{2} = (2,1,a + 6), \beta_{3} = (2,1,a + 4)$ .试问:a为何值时，组(Ⅰ)与组(Ⅱ)等价？何时不等价?

23.试讨论三个平面 $\pi_{1}:x-y+2z+a=0,\ \pi_{2}:2x+3y-z-1=0$ $\pi_{3}:x-6y+6z+10=0$ 的相互位置关系.

[page:150]

1. 设矩阵 $\begin{pmatrix}a_{1} & b_{1} & c_{1} \\a_{2} & b_{2} & c_{2} \\a_{3} & b_{3} & c_{3}\end{pmatrix}$ 满秩，则直线 $l_{1}:\frac{x - a_{3}}{a_{1} - a_{2}} = \frac{y - b_{3}}{b_{1} - b_{2}} = \frac{z - c_{3}}{c_{1} - c_{2}}$ 与直线 $l_{2}:\frac{x - a_{1}}{a_{2} - a_{3}} =$ $\frac{y - b_{1}}{b_{2} - b_{3}} = \frac{z - c_{1}}{c_{2} - c_{3}}$ 的位置关系是何种情况？

2.若向量组 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关，则 $\alpha_{1} + \alpha_{2} , \alpha_{2} + \alpha_{3} , \alpha_{3} + \alpha_{1}$ 线性无关.问:其逆是否成立？为什么？

3. 设向量β可以由 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性表出。若 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关，则表达式惟一.问:其逆是否成立？为什么？

4.“两个同型矩阵等价的充要条件是它们的秩相等”和“两个向量组等价的充要条件是它们的秩相等”这两个说法是否都是正确的？说明理由.

5. $V = \left\{ (x,y,0) \mid x,y \in \mathbb{R} \right\}$ 是否是 $\mathbf{\bar{R}}^3$ 的子空间？若是，求它的基和维数.

6. 齐次线性方程组AX=0解向量的线性组合仍为AX=0的解.试探讨:设 $\eta_{1}$ $\eta_{2},\cdots,\eta_{t}$ 是非齐次线性方程组AX=b的解向量，那么 $\eta_{1}, \eta_{2}, \cdots, \eta_{l}$ 的线性组合是否也是AX=b的解？若不是，则成立的条件是什么？充要条件是什么？

知识点注释四

综合自测题四

[page:151]

# 第五章 特征值与特征向量

工程技术中的振动问题与稳定性问题，数学中矩阵的对角化与微分方程组的求解问题，还有其他一些实际问题，都可以归结为求矩阵的特征值与特征向量.

重点难点

本章先介绍矩阵的特征值与特征向量的概念，再引入相似矩阵的概念，并讨论矩阵的相似对角化，最后介绍n维向量空间的正交性及实对称矩阵的相似对角化.

## §5.1 特征值与特征向量的概念与计算

在实际问题中，常常碰到这样的问题，即对于一个给定的n阶方阵A，是否存在非零的n维向量α，使得Aα与α平行，即存在常数λ，使得Aα=λα成立.在数学上，这就是特征值与特征向量的问题.

定义设A是n阶方阵，如果存在数λ和n维非零向量α，使

$$A \alpha = \lambda \alpha ,\tag{5.1}$$

则称λ为方阵A的一个特征值，α为方阵A对应于特征值λ的一个特征向量.

例1设

$$\boldsymbol{A} = \begin{bmatrix} 3 & - 2 \\ 1 & 0 \end{bmatrix}, \quad \boldsymbol{\alpha}_{1} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}, \quad \boldsymbol{\alpha}_{2} = \begin{bmatrix} 2 \\ 1 \end{bmatrix}, \quad \boldsymbol{\beta} = \begin{bmatrix} - 1 \\ 1 \end{bmatrix},$$

有

$$A\boldsymbol{\alpha}_{1} = \begin{bmatrix} 3 & - 2 \\ 1 & 0 \end{bmatrix}\begin{bmatrix} 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 1 \\ 1 \end{bmatrix} = 1\boldsymbol{\alpha}_{1}$$

$$\boldsymbol { A } \boldsymbol { \alpha } _ { 2 } = \begin{bmatrix} 3 & - 2 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 2 \\ 1 \end{bmatrix} = \begin{bmatrix} 4 \\ 2 \end{bmatrix} = 2 \begin{bmatrix} 2 \\ 1 \end{bmatrix} = 2 \boldsymbol { \alpha } _ { 2 } ,$$

重难点分析特征值与特征向量的定义

$$A \boldsymbol { \beta } = \begin{bmatrix} 3 & - 2 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} - 1 \\ 1 \end{bmatrix} = \begin{bmatrix} - 5 \\ - 1 \end{bmatrix} \neq \lambda \begin{bmatrix} - 1 \\ 1 \end{bmatrix}.$$

由定义可知，1与2就是A的两个特征值， $\alpha_{1}$ 与 $\underline{\alpha}_{2}$ 就是A分别对应于特征值1

[page:152]

与2的特征向量；而β则不是A的特征向量.

从几何上看，矩阵A分别乘向量 $\alpha_{1}, \alpha_{2}$ 与β的结果如图5.1所示 $,A\alpha_{3}$ 相当于将向量 $\alpha_{2}$ 增大一倍.这说明，如果α是A的特征向量，那么Aα相当于对α作一次“伸缩”变换.

例2 设方阵A满足 $\dot { A } ^ { 2 } = A$ ，试证:A的特征值只有0或1.

证 设λ是A的特征值，α是A对应于λ的特征向量，则 $A\alpha = \lambda\alpha \quad (\alpha \neq 0)$于是

$$\lambda \boldsymbol{\alpha} = A\boldsymbol{\alpha} = A^{2}\boldsymbol{\alpha} = A\left( A\boldsymbol{\alpha} \right) = A\left( \lambda \boldsymbol{\alpha} \right) = \lambda\left( A\boldsymbol{\alpha} \right) = \lambda^{2}\boldsymbol{\alpha}$$

所以

$$( \lambda ^ { 2 } - \lambda ) \alpha = 0.$$

因为 $a \neq 0$ ，所以 $\lambda^{2}-\lambda=\lambda(\lambda-1)=0$ ，即λ=0或 $\lambda = 1$

对于n阶方阵A，如果α是A对应于特征值λ的一个特征向量，则对任意的 $k \neq 0$

$$A \left( k \boldsymbol { \alpha } \right) = k \left( A \boldsymbol { \alpha } \right) = k \left( \lambda \boldsymbol { \alpha } \right) = \lambda \left( k \boldsymbol { \alpha } \right) ,$$

所以，kα也是A对应于特征值λ的特征向量.

设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r}$ 都是A对应于特征值λ的特征向量，且 $k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + \cdots + k_{r}\boldsymbol{\alpha}_{r} \neq$ 0,则

$$\begin{aligned}\boldsymbol{A}\left(k_{1} \boldsymbol{\alpha}_{1}+k_{2} \boldsymbol{\alpha}_{2}+\cdots+k_{r} \boldsymbol{\alpha}_{r}\right) &=k_{1}\left(\boldsymbol{A} \boldsymbol{\alpha}_{1}\right)+k_{2}\left(\boldsymbol{A} \boldsymbol{\alpha}_{2}\right)+\cdots+k_{r}\left(\boldsymbol{A} \boldsymbol{\alpha}_{r}\right) \\&=k_{1}\left(\lambda \boldsymbol{\alpha}_{1}\right)+k_{2}\left(\lambda \boldsymbol{\alpha}_{2}\right)+\cdots+k_{r}\left(\lambda \boldsymbol{\alpha}_{r}\right) \\&=\lambda\left(k_{1} \boldsymbol{\alpha}_{1}+k_{2} \boldsymbol{\alpha}_{2}+\cdots+k_{r} \boldsymbol{\alpha}_{r}\right).\end{aligned}$$

所以 $k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + \cdots + k_{r}\boldsymbol{\alpha}_{r}$ 也是A对应于特征值λ的特征向量

设 $V_{\lambda}$ 是n阶方阵A对应于特征值λ的所有特征向量以及零向量所组成的集合，即

$$V_{\lambda}=\left\{\boldsymbol{\alpha} \mid A \boldsymbol{\alpha}=\lambda \boldsymbol{\alpha}, \lambda \in \mathrm{C}, \boldsymbol{\alpha} \in \mathrm{C}^{n}\right\}.$$

由以上分析可知 $V_{\lambda}$ 对向量的加法和数乘封闭.故 $V _ { \lambda }$ 构成子空间.我们称 $V _ { \lambda }$ 为A的特征子空间.

在例1中 $A\boldsymbol{\alpha}_{1} = \boldsymbol{\alpha}_{1}, A\boldsymbol{\alpha}_{2} = 2\boldsymbol{\alpha}_{2}$ ，不难证明:A对应于特征值 $\lambda_{1} = 1$ 的所有特征向

[page:153]

量都可以由 $\alpha _ { \perp }$ 线性表出，对应于 $\lambda_{2} = 2$ 的所有特征向量都可以由 $\alpha _ { 2 }$ 线性表出.

从几何上看， $V_{\lambda_{1}}$ 对应于过原点与点(1，1)的直线 $l_{1},V_{\lambda_{2}}$ 对应于过原点与点(2,1)的直线 $l _ { 2 }$ (图5.2)，即

$$\begin{aligned}V_{\lambda_{1}} = \{ l_{1}  上的所有向量  \}, \\V_{\lambda_{2}} = \{ l_{2}  上的所有向量  \}.\end{aligned}$$

下面讨论对于给定的方阵 $\boldsymbol{A} = \left( a_{ij} \right)_{n \times n}$ ,怎样求A的特征值与特征向量

设α是方阵A对应于特征值λ的特征向量，即 $A\boldsymbol{\alpha} = \lambda\boldsymbol{\alpha} \quad (\boldsymbol{\alpha} \neq \boldsymbol{0}), (\lambda\boldsymbol{I} - \boldsymbol{A})\boldsymbol{\alpha} = \boldsymbol{0}$ .于是，α是齐次线性方程组 $( \lambda I - A ) X = 0$ 即

$$\begin{cases}(\lambda - a_{11})x_{1} - a_{12}x_{2} - \cdots - a_{1n}x_{n} = 0, \\- a_{21}x_{1} + (\lambda - a_{22})x_{2} - \cdots - a_{2n}x_{n} = 0, \\\cdots\cdots\cdots\cdots \\- a_{n1}x_{1} - a_{n2}x_{2} - \cdots + (\lambda - a_{nn})x_{n} = 0\end{cases}$$

的非零解.因此， $( \lambda I - A ) X = 0$ 的解空间就是A的特征子空间，它的维数为

$$\dim V_{\lambda}=n-R\left(\lambda I-A\right).$$

$( \lambda I - A ) X = 0$ 的基础解系为 $V _ { \lambda }$ 的基.

因为齐次线性方程组有非零解的充要条件是系数行列式等于零，所以

$$\det(\lambda \boldsymbol{I} - \boldsymbol{A}) = 0.$$

我们将方程 $\det(\lambda I - A) = 0$ 称为方阵A的特征方程.特征方程的根就是特征值，故有时又将特征值称为特征根.若λ是单根，则称λ为A的单特征根；若λ是k重根，则称λ为A的k重特征根.

由以上分析可得求方阵A的特征值与特征向量的计算步骤如下:

$1 ^ { \circ }$ 求特征方程 $\det(\lambda \boldsymbol{I} - \boldsymbol{A}) = 0$ 的全部相异根 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{k} (k \leq n)$

$2 ^ { \circ }$ 分别求 $\left( \lambda _ { i } I - A \right) X = 0 \left( i = 1 , 2 , \cdots , k \right)$ 的基础解系 $\alpha_{i1}, \alpha_{i2}, \cdots, \alpha_{ir_i}$ ，则$k_{1}\boldsymbol{\alpha}_{i1} + k_{2}\boldsymbol{\alpha}_{i2} + \cdots + k_{r_{i}}\boldsymbol{\alpha}_{ir_{i}} \left( k_{1}, k_{2}, \cdots, k_{r_{i}} \right.$ 不全为零)就是A对应于特征值 $\lambda_{i}$ 的全部特征向量。

例3求方阵 $A = \begin{bmatrix} 3 & - 2 \\ 1 & 0 \end{bmatrix}$ 的特征值与特征向量.

解 $\det(\lambda \boldsymbol{I} - \boldsymbol{A}) = \begin{vmatrix} \lambda - 3 & 2 \\ -1 & \lambda \end{vmatrix} = \lambda^2 - 3\lambda + 2 = (\lambda - 1)(\lambda - 2)$ ，A的特征值为$\lambda_{1} = 1 , \lambda_{2} = 2$

对于 $\lambda_{1} = 1$ ，齐次线性方程组 $( \lambda _ { 1 } \boldsymbol { I } - \boldsymbol { A } ) \boldsymbol { X } = \mathbf{0}$ 的系数矩阵为

$$\left[ \begin{matrix} { - 2 } & { 2 } \\ { - 1 } & { 1 } \\ \end{matrix} \right] ,$$

[page:154]

相应简化的齐次线性方程组为 $x_{1} - x_{2} = 0$ ，其基础解系为

$$\boldsymbol{\alpha}_{1} = (1,1)^{\mathrm{T}}$$

故对应于 $\lambda_{1} = 1$ 的A的全部特征向量为 $k_{1} \alpha_{1} (k_{1} \neq 0)$

对于 $\lambda_{2} = 2$ ，齐次线性方程组 $( \lambda _ { 2 } \boldsymbol { I } - \boldsymbol { A } ) \boldsymbol { X } = \boldsymbol { 0 }$ 的系数矩阵为

$$\left[ \begin{matrix} { - 1 } & { 2 } \\ { - 1 } & { 2 } \\ \end{matrix} \right] ,$$

相应简化的齐次线性方程组为 $x_{1} - 2x_{2} = 0$ ，其基础解系为

$$\boldsymbol{\alpha}_{2} = (2,1)^{\mathrm{T}}$$

故对应于 $\lambda_{2} = 2$ 的A的全部特征向量为 $k_{2} \alpha_{2} (k_{2} \neq 0)$

例4 求 $\boldsymbol{A} = \begin{pmatrix}1 & - 2 & 2 \\- 2 & - 2 & 4 \\2 & 4 & - 2\end{pmatrix}$ 的特征值与特征向量.

解

$$\begin{aligned}\det(\lambda \boldsymbol{I} - \boldsymbol{A}) = & \left| \begin{matrix}\lambda - 1 & 2 & - 2 \\2 & \lambda + 2 & - 4 \\- 2 & - 4 & \lambda + 2\end{matrix} \right| = \left| \begin{matrix}\lambda - 1 & 2 & - 2 \\2 & \lambda + 2 & - 4 \\0 & \lambda - 2 & \lambda - 2\end{matrix} \right| \\= & \left| \begin{matrix}\lambda - 1 & 4 & - 2 \\2 & \lambda + 6 & - 4 \\0 & 0 & \lambda - 2\end{matrix} \right| = (\lambda - 2) \left| \begin{matrix}\lambda - 1 & 4 \\2 & \lambda + 6\end{matrix} \right| \\= & (\lambda - 2)^{2}(\lambda + 7),\end{aligned}$$

A的特征值为 $\lambda_{1} = 2$ 重） $\lambda_{2} = - 7$

对于 $\lambda_{1} = 2$ ，齐次线性方程组 $( \lambda _ { 1 } \boldsymbol { I } - \boldsymbol { A } ) \boldsymbol { X } = \boldsymbol { 0 }$ 的系数矩阵为

$$\begin{pmatrix}1 & 2 & - 2 \\2 & 4 & - 4 \\- 2 & - 4 & 4\end{pmatrix}\xrightarrow{}\begin{pmatrix}1 & 2 & - 2 \\0 & 0 & \quad 0 \\0 & 0 & \quad 0\end{pmatrix},$$

相应简化的齐次线性方程组为 $x_{1} = - 2x_{2} + 2x_{3}$ ，其基础解系为

$$\boldsymbol{\alpha}_{1}=(-2,1,0)^{\mathrm{T}}, \quad \boldsymbol{\alpha}_{2}=(2,0,1)^{\mathrm{T}},$$

A 对应于 $\lambda_{1} = 2$ 的全部特征向量为 $k_{1} \boldsymbol{\alpha}_{1} + k_{2} \boldsymbol{\alpha}_{2} (k_{1}, k_{2}$ 不全为零).

对于 $\lambda_{2} = - 7$ ，齐次线性方程组 $( \lambda _ { 2 } I - A ) X = 0$ 的系数矩阵为

$$\begin{pmatrix}- 8 & 2 & - 2 \\2 & - 5 & - 4 \\- 2 & - 4 & - 5\end{pmatrix}\xrightarrow{}\begin{vmatrix}1 & 0 & \dfrac{1}{2} \\0 & 1 & 1 \\0 & 0 & 0\end{vmatrix},$$

[page:155]

相应简化的齐次线性方程组为 $\begin{cases}x_{1} = -\frac{1}{2}x_{3}, \\x_{2} = -x_{3},\end{cases}$ 其基础解系为

$$\boldsymbol{a}_{3} = (1, 2, -2)^{\mathrm{T}},$$

A 对应于 $\lambda_{2} = - 7$ 的全部特征向量为 $k_{3} \alpha_{3} (k_{3} \neq 0)$

例5 求方阵 $\boldsymbol{A} = \begin{bmatrix} -1 & 1 & 0 \\ -4 & 3 & 0 \\ 1 & 0 & 2 \end{bmatrix}$ 的特征值与特征向量.

解

$$\det(\lambda \boldsymbol{I} - \boldsymbol{A}) = \left| \begin{matrix} \lambda + 1 & - 1 & 0 \\ 4 & \lambda - 3 & 0 \\ - 1 & 0 & \lambda - 2 \end{matrix} \right| = (\lambda - 2)(\lambda - 1)^{2}$$

A的特征值为 $\lambda_{1} = 2 , \lambda_{2} = 1 ( 2$ 重）.

对于 $\lambda_{1} = 2$ ，对应的齐次线性方程组 $( \lambda _ { 1 } \boldsymbol { I } - \boldsymbol { A } ) \boldsymbol { X } = \boldsymbol { 0 }$ 为

$$\begin{cases}3x_{1} - x_{2} = 0, \\4x_{1} - x_{2} = 0, \\-x_{1} - 0,\end{cases}\tag{5.2}$$

其基础解系为

$$\boldsymbol{a}_{1} = (0, 0, 1)^{\mathrm{T}}.$$

A 对应于 $\lambda_{1} = 2$ 的全部特征向量为 $k_{1} \alpha_{1} (k_{1} \neq 0)$

注意，方程组(5.2)实质上是一个三元线性方程组，其中 $x_{3}$ 的系数全部为零.取$x _ { 3 }$ 为自由未知量，则当 $x_{3} = 1$ 时， $x_{1} = x_{2} = 0$

对于 $\lambda_{2} = 1$ ，相应的齐次线性方程组 $\left( \lambda _ { 2 } \boldsymbol { I } - \boldsymbol { A } \right) \boldsymbol { X } = \boldsymbol { 0 }$ 为

$$\left\{ \begin{aligned} { 2 x _ { 1 } } & { { } } & { - } & { x _ { 2 } } & { { } } & { = } & { { } 0 , } \\ { 4 x _ { 1 } } & { { } } & { - } & { 2 x _ { 2 } } & { { } } & { = } & { { } 0 , } \\ { - x _ { 1 } } & { { } } & { } & { } & { } & { { } } & { - x _ { 3 } } & { { } = } & { { } 0 , } \\ \end{aligned} \right.$$

其基础解系为

$$\boldsymbol{\alpha}_{2}=(1,2,-1)^{\mathrm{T}}$$

A对应于 $\lambda_{2} = 1$ 的全部特征向量为 $k_{2} \alpha_{2} (k_{2} \neq 0)$

在例4中， $\lambda_{1} = 2$ 是A的2重特征根，A对应于 $\lambda_{1}$ 的线性无关的特征向量有两个，即 $( \lambda _ { 1 } \boldsymbol { I } - \boldsymbol { A } ) \boldsymbol { X } = \boldsymbol { 0 }$ 的基础解系由两个解向量组成.在例5中 $\lambda_{2} = 1$ 也是A的2重特征根，但A对应于 $\lambda_{2} \equiv 1$ 的线性无关的特征向量却只有一个，即 $\left( \lambda _ { 2 } \boldsymbol { I } - \boldsymbol { A } \right) \boldsymbol { X } = \boldsymbol { 0 }$ 的基础解系只由一个解向量组成.

设n阶矩阵A的特征多项式为

[page:156]

$$f \left( \lambda \right) = \left| \lambda \boldsymbol { I } - \boldsymbol { A } \right| = \left( \lambda - \lambda _ { 1 } \right) ^ { k _ { 1 } } \left( \lambda - \lambda _ { 2 } \right) ^ { k _ { 2 } } \cdots \left( \lambda - \lambda _ { r } \right) ^ { k _ { r } }$$

其中 $\lambda_{i} \ne \lambda_{j} (i \ne j), \sum_{i = 1}^{r} k_{i} = n$ ，则 $k _ { i }$ 称为特征值 $\lambda_{i}$ 的代数重数，而 $\lambda_{i}$ 的特征子空间$V_{\lambda_{i}}$ 的维数称为 $\lambda_{i}$ 的几何重数.

可以证明:特征值的几何重数不大于它的代数重数.即如果 $\lambda_{i}$ 是A的 $k _ { i }$ 重特征值，则A对应于 $\lambda_{i}$ 的线性无关的特征向量的个数不大于 $k _ { i }$ ，也就是 $( \lambda _ { i } I - A ) X = 0$ 的基础解系所含解向量个数不大于 $k _ { i }$

例6设 $A = \begin{bmatrix} 1 & -1 \\ 1 & 1 \end{bmatrix}$ ,求A的特征值与特征向量.

解 $\det \left( \lambda \boldsymbol{I} - \boldsymbol{A} \right) = \left| \begin{matrix} \lambda - 1 & 1 \\ - 1 & \lambda - 1 \end{matrix} \right| = \lambda^{2} - 2\lambda + 2, \boldsymbol{A}$ 的特征值为 $\lambda_{1} \equiv 1 +  i$ $\lambda_{2} = 1 -  i$

对于 $\lambda _ { 1 } = 1 + \mathrm { i } , \left( \lambda _ { 1 } I - A \right) X = 0$ 的系数矩阵为

$$\begin{pmatrix} \mathrm{i} & 1 \\ -1 & \mathrm{i} \end{pmatrix} \rightarrow \begin{bmatrix} 1 & -\mathrm{i} \\ 0 & 0 \end{bmatrix}, \quad x_1 = \mathrm{i}x_2,$$

其基础解系为

$$\boldsymbol{\alpha}_{1} = \begin{bmatrix} 1 \\ - \mathrm{i} \end{bmatrix}.$$

A 对应于 $\lambda_{1} = 1 + \mathrm{i}$ 的全部特征向量为 $k_{1} \alpha_{1} (k_{1} \neq 0)$

对于 $\lambda _ { 2 } = 1 - \mathrm { i } , \left( \lambda _ { 2 } I - A \right) X = \mathbf { 0 }$ 的基础解系为

$$\alpha_{2} = \begin{bmatrix} 1 \\ \vdots \\ 1 \end{bmatrix},$$

A对应于 $\lambda_{2} = 1 - \mathrm{i}$ 的全部特征向量为 $k_{2} \alpha_{2} (k_{2} \neq 0)$

我们将行列式 $\det(\lambda I - A)$ 称为矩阵A的特征多项式，记为 $f_{A}(\lambda)$ ,即

$$f_{A}(\lambda) = \det(\lambda I - A).$$

下面进一步讨论特征多项式 $f_{A}(\lambda)$ 的性质.

$$f_{A}(\lambda) = \det(\lambda \boldsymbol{I} - \boldsymbol{A}) = \left| \begin{matrix} \lambda - a_{11} & - a_{12} & \cdots & - a_{1n} \\ - a_{21} & \lambda - a_{22} & \cdots & - a_{2n} \\ \vdots & \vdots & & \vdots \\ - a_{n1} & - a_{n2} & \cdots & \lambda - a_{nn} \end{matrix} \right|.$$

则 $f_{A}(\lambda)$ 是λ的n次多项式:

$$f_{A}(\lambda)=\lambda^{n}+\alpha_{n-1}\lambda^{n-1}+\cdots+\alpha_{1}\lambda+\alpha_{0}.\tag{5.3}$$

[page:157]

利用行列式性质将det(λI-A)展开可得

$$\begin{align*}f_{A}(\lambda) = \det(\lambda \boldsymbol{I} - \boldsymbol{A}) \\= \lambda^{n} - (a_{11} + a_{22} + \cdots + a_{nn})\lambda^{n - 1} + \cdots + (-1)^{n} \det \boldsymbol{A}.\end{align*}\tag{5.4}$$

又设 $f_{A}(\lambda)$ 的全部根(即A的全部特征值)为 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}$ ,则

$$\begin{align*}f_{A}(\lambda) &= (\lambda - \lambda_{1})(\lambda - \lambda_{2})\cdots(\lambda - \lambda_{n}) \\&= \lambda^{n} - (\lambda_{1} + \lambda_{2} + \cdots + \lambda_{n})\lambda^{n - 1} + \cdots + (-1)^{n}\lambda_{1}\lambda_{2}\cdots\lambda_{n}.\end{align*}\tag{5.5}$$

比较(5.3)，(5.4)，(5.5)可得:

$$\begin{aligned}\alpha_{n - 1} &= - (a_{11} + a_{22} + \cdots + a_{nn}) = - (\lambda_{1} + \lambda_{2} + \cdots + \lambda_{n}), \\\alpha_{0} &= (-1)^{n}\det A = (-1)^{n}\lambda_{1}\lambda_{2}\cdots\lambda_{n}.\end{aligned}$$

于是，矩阵A的特征值与A的主对角元及detA之间有以下关系:

$$\begin{aligned} &\lambda _ { 1 } + \lambda _ { 2 } + \cdots + \lambda _ { n } = a _ { 1 1 } + a _ { 2 2 } + \cdots + a _ { n n } = \operatorname { t r } ( \boldsymbol { A } ) ,\\ &\lambda _ { 1 } \lambda _ { 2 } \cdots \lambda _ { n } = \operatorname { d e t } \boldsymbol { A } .\\ \end{aligned}$$

因此，方阵的η个特征值之和等于方阵的主对角元之和；n个特征值之积等于方阵的行列式 $; n$ 阶方阵A可逆的充分必要条件是A的所有特征值全不为零.

在多项式理论中可以证明:整系数多项式的整数根一定是常数项的整数因子。利用这个结论，可以确定某些矩阵是否有整数特征值.

例7设 $\lambda_{1} = 12$ 是矩阵 $\boldsymbol{A} = \begin{pmatrix} 7 & 4 & -1 \\ 4 & 7 & -1 \\ -4 & a & \quad 4 \end{pmatrix}$ 的一个特征值，求常数a及矩阵A的其余特征值.

解因为 $\lambda_{1} = 12$ 是矩阵A的一个特征值，所以，

$$\det(\lambda_{1} \boldsymbol{I}-\boldsymbol{A})=\left|\begin{matrix}5 & -4 & 1 \\-4 & 5 & 1 \\4 & -a & 8\end{matrix}\right|=9a+36=0,$$

所以 $a = - 4$ .设矩阵A的其余特征值是 $\lambda_{2}, \lambda_{3}$ ,则

$$\begin{aligned}\lambda_{1} + \lambda_{2} + \lambda_{3} &= 7 + 7 + 4 = 18, \\\lambda_{1}\lambda_{2}\lambda_{3} &= \det A = 108,\end{aligned}\tag{5.6}$$

(5.7)

将 $\lambda_{1} = 12$ 代入式(5.6)，(5.7)，可得 $\lambda_{2} = \lambda_{3} = 3$

## 题5.1

1. 求下列矩阵的特征值与特征向量:

(1)

$$\left[ \begin{matrix} { 3 } & { 4 } \\ { 5 } & { 2 } \\ \end{matrix} \right] ;$$

(2)

$$\left[ \begin{matrix} { 0 } & { a } \\ { - a } & { 0 } \\ \end{matrix} \right] ;$$

(3)

$$\begin{pmatrix}1 & 2 & 3 \\2 & 1 & 3 \\3 & 3 & 6\end{pmatrix};$$

[page:158]

(4)

$$\begin{bmatrix} 2 & 0 & 0 \\ 1 & 1 & 0 \\ 1 & 1 & 1 \end{bmatrix};$$

(5)

$$\begin{pmatrix}0 & 0 & 1 \\0 & 1 & 0 \\1 & 0 & 0\end{pmatrix}$$

(6)

$$\begin{pmatrix}1 & 1 & 1 & 1 \\1 & 1 & -1 & -1 \\1 & -1 & 1 & -1 \\1 & -1 & -1 & 1\end{pmatrix}.$$

2. 设λ是方阵A的特征值，证明 $: \lambda ^ { m }$ 是 $A ^ { m }$ 的特征值.

3. 设向量α是方阵A对于λ的特征向量，试求 $A^{m}$ 对于 $\lambda^{m}$ 的特征向量.

4. 设λ是方阵A的特征值 $f(x)$ 是x的多项式，证明 $: f ( \lambda )$ 是 $f(A)$ 的特征值.

5.试讨论可逆矩阵A与 $A^{-1}$ 的特征值与特征向量的关系.

6. 设A可逆，讨论A与 $A ^ { * }$ 的特征值(特征向量)之间的关系.

7. 设n阶矩阵A的任何一行中n个元素的和都是a，证明 $: \lambda = a$ 是A的特征值.

8. 设 $A^{2} = I$ ，证明:A的特征值只能是±1.

9. 设 n 阶矩阵A 满足 $A^{\mathrm{T}}A = I$ , det $A = - 1$ ，证明:—1是A的一个特征值.

10.设 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}$ 为 $A = \left( a_{ij} \right)_{n \times n}$ 的n个特征值，证明:

$$\sum_{i = 1}^{n} \lambda_{i}^{2} = \sum_{i = 1}^{n} \sum_{j = 1}^{n} a_{ij} a_{ji}.$$

11. 设3 阶矩阵A的特征多项式为 $f_{A}(\lambda)=\lambda^{3}-3\lambda^{2}+5\lambda-3$ ，则A的整数特征值可能是哪些数?这些数中有没有A的特征值?

## §5.2 矩阵的相似对角化

## 一、相似矩阵的基本概念

在习题1.3的第13题的练习中，我们已经知道，如果已知可逆矩阵P，且$\boldsymbol{P}^{-1} \boldsymbol{A} \boldsymbol{P} = \boldsymbol{\Lambda}$ (对角矩阵) $\boldsymbol{\beta} = \begin{bmatrix} \lambda_{1} & \\ & \lambda_{2} \end{bmatrix}$ ,则

$$\hat { A } = \hat { P } \hat { \Lambda } \hat { P } ^ { - 1 } ,$$

且

$$\boldsymbol { A } ^ { k } = \boldsymbol { P } \boldsymbol { \Lambda } ^ { k } \boldsymbol { P } ^ { - 1 } = \boldsymbol { P } \begin{bmatrix} \lambda _ { 1 } ^ { k } & \\ & \lambda _ { 2 } ^ { k } \end{bmatrix} \boldsymbol { P } ^ { - 1 } .$$

对于同阶方阵A，B，如果存在可逆矩阵P，使得 $P^{-1}AP = B,A$ 与B之间的这种关系，我们给出如下定义:

定义 对于n阶矩阵A,B，如果存在可逆矩阵P，使

$$P^{-1}AP = B$$

则称A与B相似，记为 $A \sim B$

矩阵之间的相似关系具有以下性质:

[page:159]

$1 ^ { \circ }$ 反身性 A~A;

$2 ^ { \circ }$ 对称性若A~B，则 $B \sim A$

$3 ^ { \circ }$ 传递性 若A~B且 $B { { \sim } } C$ ,则 $A \sim \mathrel { C }$

1°和 $2 ^ { \circ }$ 的证明是很显然的 $. 3 ^ { \circ }$ 的证明如下:

设 $A \sim B$ ，则存在可逆矩阵P，使得 $\widehat{P}^{-1}AP = \widehat{B}$ ,又 $B \sim C$ ，则存在可逆矩阵 $\mathcal { Q }$ ，使$Q ^ { - 1 } B Q = C .$ 所以

$$Q^{-1}P^{-1}APQ=(PQ)^{-1}A(PQ)=C,$$

记 $R = PQ$ ，则R可逆，且 $R^{-1}AR = C$ 故 $A \sim C .$

定理1相似矩阵的特征值相同.

证设A~B，则存在可逆矩阵P，使

$$\begin{aligned}\boldsymbol{B} &= \boldsymbol{P}^{-1} \boldsymbol{A} \boldsymbol{P}, \\\det(\lambda \boldsymbol{I} - \boldsymbol{B}) &= \det(\lambda \boldsymbol{I} - \boldsymbol{P}^{-1} \boldsymbol{A} \boldsymbol{P}) = \det[\boldsymbol{P}^{-1}(\lambda \boldsymbol{I} - \boldsymbol{A}) \boldsymbol{P}] \\&= \det \boldsymbol{P}^{-1} \det(\lambda \boldsymbol{I} - \boldsymbol{A}) \det \boldsymbol{P} = \det(\lambda \boldsymbol{I} - \boldsymbol{A}),\end{aligned}$$

A与B的特征多项式相同，因此A与B的特征值相同.

例1 设n阶方阵 $\boldsymbol{A} \sim \boldsymbol{A} = \begin{pmatrix}\lambda_{1} & & & \\& \lambda_{2} & & \\& & \ddots & \\& & & \lambda_{n}\end{pmatrix}$ ,求 $A^{k}(k$ 为正整数）.

解 因为 $A \sim \Lambda$ ，故存在可逆方阵P，使 $\boldsymbol{P}^{-1} \boldsymbol{A} \boldsymbol{P} = \boldsymbol{\Lambda}$

$$A = P \Lambda P^{-1} ,$$

所以

$$\begin{aligned}\boldsymbol{A}^{k} = & \left( \boldsymbol{P} \boldsymbol{\Lambda} \boldsymbol{P}^{-1} \right) \left( \boldsymbol{P} \boldsymbol{\Lambda} \boldsymbol{P}^{-1} \right) \cdots \left( \boldsymbol{P} \boldsymbol{\Lambda} \boldsymbol{P}^{-1} \right) = \boldsymbol{P} \boldsymbol{\Lambda}^{k} \boldsymbol{P}^{-1} \\= & \boldsymbol{P} \begin{bmatrix}\lambda_{1}^{k} & & & \\& \lambda_{2}^{k} & & \\& & \ddots & \\& & & \lambda_{n}^{k}\end{bmatrix} \boldsymbol{P}^{-1},\end{aligned}$$

只需求出 $P^{-1}$ ，再计算出 $P\Lambda^{k}P^{-1}$ 就行了，当k比较大时，这比直接计算 $A ^ { k }$ 要方便得多.

我们自然要提出的问题是，什么样的矩阵A可以与对角矩阵相似？或者说，对于给定的矩阵A，在什么条件下存在对角矩阵A与可逆矩阵P，使 $P^{-1}AP = A$ 如果这样的矩阵A与P存在，又应该怎样求出？下面就讨论这些问题.

## 二、矩阵的相似对角化

定理2 若n阶矩阵A 与对角矩阵 $\boldsymbol{A} = \begin{pmatrix}\lambda_{1} & & & \\& \lambda_{2} & & \\& & \ddots & \\& & & \lambda_{n}\end{pmatrix}$ 相似，则 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}$

[page:160]

是A的全部特征值.

证因为 $\boldsymbol{A} \sim \boldsymbol{A} = \begin{pmatrix}\lambda_{1} & & & \\& \lambda_{2} & & \\& & \ddots & \\& & & \lambda_{n}\end{pmatrix}$ ，所以A与A的特征值相同.

又

$$\det \left( \lambda \boldsymbol{I} - \boldsymbol{\Lambda} \right) = \left( \lambda - \lambda_{1} \right) \left( \lambda - \lambda_{2} \right) \cdots \left( \lambda - \lambda_{n} \right),$$

所以 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}$ 是A的全部特征值，也就是A的全部特征值

定理2指出，如果A与对角矩阵A相似，则A的主对角线上的元就是A的全部特征值，那么，使 $\boldsymbol{P}^{-1} \boldsymbol{A} \boldsymbol{P} = \boldsymbol{\Lambda}$ 的矩阵P又是怎样构成的呢？

设 $\boldsymbol{P} = \left( p_{1}, p_{2}, \cdots, p_{n} \right), p_{1}, p_{2}, \cdots, p_{n}$ 是P的列向量组，则

$$\boldsymbol{P}^{-1} \boldsymbol{A} \boldsymbol{P} = \boldsymbol{\Lambda} , \quad \boldsymbol{A} \boldsymbol{P} = \boldsymbol{P} \boldsymbol{\Lambda} ,$$

即

$$\begin{aligned}\boldsymbol{A}(\boldsymbol{p}_{1}, \boldsymbol{p}_{2}, \cdots, \boldsymbol{p}_{n}) &= (\boldsymbol{p}_{1}, \boldsymbol{p}_{2}, \cdots, \boldsymbol{p}_{n}) \begin{pmatrix}\lambda_{1} & & & \\& \lambda_{2} & & \\& & \ddots & \\& & & \lambda_{n}\end{pmatrix}, \\(\boldsymbol{A}\boldsymbol{p}_{1}, \boldsymbol{A}\boldsymbol{p}_{2}, \cdots, \boldsymbol{A}\boldsymbol{p}_{n}) &= (\lambda_{1}\boldsymbol{p}_{1}, \lambda_{2}\boldsymbol{p}_{2}, \cdots, \lambda_{n}\boldsymbol{p}_{n}), \\\boldsymbol{A}\boldsymbol{p}_{i} &= \lambda_{i}\boldsymbol{p}_{i} \quad (1, 2, \cdots, n).\end{aligned}$$

因为P可逆，故 $p_{i} \neq 0 \left( i = 1,2,\cdots,n \right)$ ，于是， $p_{1},p_{2},\cdots,p_{n}$ 是A的 n 个线性无关的特征向量.

反之，若A有n个线性无关的特征向量 $p_{1},p_{2},\cdots,p_{n}$ ,即

$$A p _ { i } = \lambda _ { i } p _ { i } \quad ( i = 1 , 2 , \cdots , n ) ,$$

设 $P = \left( p_{1}, p_{2}, \cdots, p_{n} \right)$ ，则P可逆，且

$$\begin{aligned}\boldsymbol{A} \boldsymbol{P} &= (\boldsymbol{A} \boldsymbol{p}_{1}, \boldsymbol{A} \boldsymbol{p}_{2}, \cdots, \boldsymbol{A} \boldsymbol{p}_{n}) = (\lambda_{1} \boldsymbol{p}_{1}, \lambda_{2} \boldsymbol{p}_{2}, \cdots, \lambda_{n} \boldsymbol{p}_{n}) \\&= (\boldsymbol{p}_{1}, \boldsymbol{p}_{2}, \cdots, \boldsymbol{p}_{n}) \begin{pmatrix}\lambda_{1} & & & \\& \lambda_{2} & & \\& & \ddots & \\& & & \lambda_{n}\end{pmatrix} = \boldsymbol{P} \boldsymbol{\Lambda}  ,\end{aligned}$$

所以

$$P^{-1}AP = \Lambda$$

即A与对角矩阵A相似.

由以上讨论可得

定理3n阶矩阵A能与对角矩阵A相似的充分必要条件是A有n个线性无关的特征向量.

[page:161]

由此定理可知，如果n阶矩阵A有n个线性无关的特征向量

$$A p _ { i } = \lambda _ { i } p _ { i } \quad ( i = 1 , 2 , \cdots , n ) ,$$

令 $P = \left( p_{1}, p_{2}, \cdots, p_{n} \right)$ ,则

$$\boldsymbol{P}^{-1} \boldsymbol{A} \boldsymbol{P} = \begin{bmatrix} \lambda_{1} & & & \\ & \lambda_{2} & & \\ & & \ddots & \\ & & & \lambda_{n} \end{bmatrix},$$

$\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}$ 是 $A$ 的全部特征值.

值得注意的是，P中列向量 $p_{1},p_{2},\cdots,p_{n}$ 的排列顺序要与 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}$ 的排列顺序一致.

由于 $p_{i}$ 是 $( \lambda _ { i } I - A ) X = 0$ 的基础解系中的解向量，故 $p_{i}$ 的取法不是惟一的，因此P也不是惟一的.而 $f_{A}(\lambda) = \det(\lambda I - A) = 0$ 的根只有n个(重根按重数计算)，所以如果不计 $\lambda_{i}$ 的排列顺序，则A是惟一确定的.

例2 设 $\boldsymbol{A} = \begin{pmatrix} 4 & - 6 & 0 \\ - 3 & - 5 & 0 \\ - 3 & - 6 & 1 \end{pmatrix}$ ,求 $A^{10}$

解 $\det(\lambda \boldsymbol{I} - \boldsymbol{A}) = \left| \begin{matrix} \lambda - 4 & - 6 & 0 \\ 3 & \lambda + 5 & 0 \\ 3 & 6 & \lambda - 1 \end{matrix} \right| = (\lambda + 2)(\lambda - 1)^{2}$

A的特征值为 $\lambda _ { 1 } = - 2 , \lambda _ { 2 } = 1 ( 2$ 重）.

对于 $\lambda _ { 1 } = - 2 , \left( \lambda _ { 1 } I - A \right) X = 0$ 的系数矩阵为

$$\begin{pmatrix}-6 & -6 & 0 \\3 & 3 & 0 \\3 & 6 & -3\end{pmatrix}\xrightarrow{}\begin{pmatrix}1 & 1 & 0 \\0 & 0 & 0 \\0 & 1 & -1\end{pmatrix}\xrightarrow{}\begin{pmatrix}1 & 0 & 1 \\0 & 1 & -1 \\0 & 0 & -\end{pmatrix},$$

对应的齐次线性方程组为 $\begin{cases}x_{1} = - x_{3}, \\x_{2} = - x_{3},\end{cases}$ 其基础解系为 $\boldsymbol{\alpha}_{1}=(-1,1,1)^{\mathrm{T}}$

对于 $\lambda_{2}=1,(\lambda_{2}\boldsymbol{I}-\boldsymbol{A})\boldsymbol{X}=\mathbf{0}$ 的系数矩阵为

$$\begin{pmatrix}-3 & -6 & 0 \\3 & 6 & 0 \\3 & 6 & 0\end{pmatrix}\xrightarrow{}\begin{pmatrix}1 & 2 & 0 \\0 & 0 & 0 \\0 & 0 & 0\end{pmatrix},$$

对应的齐次线性方程组为 $x_{1} = - 2x_{2} + 0x_{3}$ ,其基础解系为 $\boldsymbol{\alpha}_{2}=\begin{bmatrix}-2 \\ 1 \\ 0 \end{bmatrix},\boldsymbol{\alpha}_{3}=\begin{bmatrix}0 \\ 0 \\ 1 \end{bmatrix}$ .令

$$\boldsymbol{P} = (\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\boldsymbol{\alpha}_{3}) = \begin{bmatrix} -1 & -2 & 0 \\ 1 & 1 & 0 \\ 1 & 0 & 1 \end{bmatrix}.$$

[page:162]

易见，P是可逆矩阵，且

$$\boldsymbol{P}^{-1} \boldsymbol{A} \boldsymbol{P} = \begin{bmatrix} -2 & & \\ & 1 & \\ & & 1 \end{bmatrix}, \quad \boldsymbol{A} = \boldsymbol{P} \begin{bmatrix} -2 & & \\ & 1 & \\ & & 1 \end{bmatrix} \boldsymbol{P}^{-1}, \quad \boldsymbol{P}^{-1} = \begin{bmatrix} 1 & 2 & 0 \\ -1 & -1 & 0 \\ -1 & -2 & 1 \end{bmatrix},$$

所以

$$\begin{aligned}\boldsymbol{A}^{10} = & \boldsymbol{P}\begin{bmatrix}(-2)^{10} & & \\& 1 & \\& & 1\end{bmatrix}\boldsymbol{P}^{-1} \\= & \begin{bmatrix}-1 & -2 & 0 \\1 & 1 & 0 \\1 & 0 & 1\end{bmatrix}\begin{bmatrix}1.024 & & \\& 1 & \\& & 1\end{bmatrix}\begin{bmatrix}1 & 2 & 0 \\-1 & -1 & 0 \\-1 & -2 & 1\end{bmatrix} \\= & \begin{bmatrix}-1022 & -2046 & 0 \\1023 & 2047 & 0 \\1023 & 2046 & 1\end{bmatrix}.\end{aligned}$$

例3设 $A \ne O, A^k = O(k$ 为正整数），证明:A不能与对角矩阵相似

证设A能与对角矩阵 $\boldsymbol{\Lambda} = \mathrm{diag}(\lambda_1, \lambda_2, \cdots, \lambda_n)$ 相似，则存在可逆矩阵P，使

$$A = P \Lambda P^{-1} ,\tag{5.8}$$

$$\boldsymbol { A } ^ { k } = \boldsymbol { P } \boldsymbol { \Lambda } ^ { k } \boldsymbol { P } ^ { - 1 } = \boldsymbol { P } \begin{pmatrix} \lambda _ { 1 } ^ { k } & & & \\ & \lambda _ { 2 } ^ { k } & & \\ & & \ddots & \\ & & & \lambda _ { n } ^ { k } \end{pmatrix} \boldsymbol { P } ^ { - 1 } = \boldsymbol { O } ,$$

于是可得 $\mathrm{diag}(\lambda_1^k, \lambda_2^k, \cdots, \lambda_n^k) = O.$ 从而 $\lambda_{1} = \lambda_{2} = \cdots = \lambda_{n} = 0$ ，即有 $\Lambda = O$ .由式(5.8)可得 $A = O$ ，与题设 $A \neq O$ 矛盾.故A 不能与对角矩阵相似.

定理3给出了n阶矩阵与对角矩阵相似的充分必要条件，但是对于一个具体的n阶矩阵，要直接判断它是否有n个线性无关的特征向量一般是很困难的，下面我们进一步讨论什么样的n阶矩阵能与对角矩阵相似.

定理↓ 设 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{m}$ 是矩阵A的互异特征值， $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 是A 分别对应于这些特征值的特征向量，则 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性无关.

证用数学归纳法证明.

重难点分析互异特征值的特征向量线性无关:

当 $m = 1$ 时，结论显然成立.因为特征向量 $\alpha_{1} \neq 0$ ，一个非零向量是线性无关的.

假设对 $m - 1$ 个互异特征值结论成立

对m个互异特征值 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{m}$ 以及它们所对应的特征向量 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ ,设

$$k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + \cdots + k_{m}\boldsymbol{\alpha}_{m} = \boldsymbol{0},\tag{5.9}$$

用A左乘式(5.9)两端得

[page:163]

$$\begin{align*}k_{1}(A\boldsymbol{\alpha}_{1}) + k_{2}(A\boldsymbol{\alpha}_{2}) + \cdots + k_{m}(A\boldsymbol{\alpha}_{m}) = \boldsymbol{0}, \\k_{1}(\lambda_{1}\boldsymbol{\alpha}_{1}) + k_{2}(\lambda_{2}\boldsymbol{\alpha}_{2}) + \cdots + k_{m}(\lambda_{m}\boldsymbol{\alpha}_{m}) = \boldsymbol{0}.\end{align*}\tag{5.10}$$

用 $\lambda _ { m }$ 乘式(5.9)两端得

$$k _ { 1 } \left( \lambda _ { m } \boldsymbol { a } _ { 1 } \right) + k _ { 2 } \left( \lambda _ { m } \boldsymbol { a } _ { 2 } \right) + \cdots + k _ { m } \left( \lambda _ { m } \boldsymbol { a } _ { m } \right) = 0 ,\tag{5.11}$$

式(5.10)与式(5.11)两端相减可得

$$k_{1}(\lambda_{1}-\lambda_{m})\boldsymbol{\alpha}_{1}+k_{2}(\lambda_{2}-\lambda_{m})\boldsymbol{\alpha}_{2}+\cdots+k_{m-1}(\lambda_{m-1}-\lambda_{m})\boldsymbol{\alpha}_{m-1}=\mathbf{0},$$

由归纳假设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m-1}$ 线性无关，故

$$k_{1}(\lambda_{1}-\lambda_{m})=k_{2}(\lambda_{2}-\lambda_{m})=\cdots=k_{m-1}(\lambda_{m-1}-\lambda_{m})=0.$$

又因为 $\lambda_{i}-\lambda_{m}\neq 0(i=1,2,\cdots,m-1)$ ，故只有

$$k_{1}=k_{2}=\cdots=k_{m-1}=0,$$

代入式(5.9)得

$$k_{m} \alpha_{m} = 0$$

由 $\alpha_{_m} \neq 0$ 可得 $k_{m} = 0$ ，于是 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性无关.

推论1 设n阶矩阵A的特征值都是单特征根，则A能与对角矩阵相似.

证因为A的特征值都是 $\det(\lambda I - A) = 0$ 的单根，故A有n个互异特征值.互异特征值对应的特征向量是线性无关的，故A有n个线性无关的特征向量，因而A能与对角矩阵相似.

与定理4的证明类似，我们可以得到下面的推论:

推论2 设 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{k}$ 是矩阵A的互异特征值， $\alpha_{i1}, \alpha_{i2}, \cdots, \alpha_{ir}$ 是对应于特征值 $\lambda_{i}$ 的线性无关的特征向量，则 $\alpha_{11}, \cdots, \alpha_{1r_1}, \cdots, \alpha_{k1}, \cdots, \alpha_{kr_k}$ 也线性无关.

设 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{r}$ 是n阶矩阵A的全部互异特征值， $\lambda_{i}$ 是A的 $点 _{i}$ 重特征值$(k_{i} \geqslant 1)$ ,则

$$k_{1} + k_{2} + \cdots + k_{r} = n.$$

若对每一个特征值 $\lambda_{i} \left( i = 1,2,\cdots,r \right),\left( \lambda_{i} \boldsymbol{I} - \boldsymbol{A} \right) \boldsymbol{X} = \boldsymbol{0}$ 的基础解系由 $k _ { i }$ 个解向量组成，即 $\lambda_{i}$ 恰有 $k _ { i }$ 个线性无关的特征向量，则由推论2可知，A有n个线性无关的特征向量.而 $( \lambda , I - A ) X = 0$ 的基础解系所含解向量个数不大于 $k _ { i }$ ，故可得下面的定理:

定理 $5 \quad n$ 阶矩阵A与对角矩阵相似的充分必要条件是对于A的每一个 $k _ { i }$ 重特征根 $\lambda_{i}$ ，齐次线性方程组 $( \lambda _ { i } I - A ) X = 0$ 的基础解系由 $k _ { i }$ 个解向量组成.

$\lambda, I - \tilde{A}$ 是齐次线性方程组 $( \lambda _ { i } I - A ) X = 0$ 的系数矩阵，由系数矩阵的秩与基础解系所含解向量的个数的关系可以得到定理5的一个推论.

推论3n阶矩阵A与对角矩阵相似的充分必要条件是对于每一个 $k _ { i }$ 重特征根$\lambda_{i},R\left( \lambda_{i} \boldsymbol{I} - \boldsymbol{A} \right) = n - k_{i}$

例4 下列矩阵能否与对角矩阵相似?

$$\boldsymbol{A} = \begin{bmatrix} 1 & 2 & 2 \\ 2 & 1 & - 2 \\ - 2 & - 2 & 1 \end{bmatrix}, \quad \boldsymbol{B} = \begin{bmatrix} 3 & - 1 & - 2 \\ 2 & 0 & - 2 \\ 2 & - 1 & - 1 \end{bmatrix}, \quad \boldsymbol{C} = \begin{bmatrix} 3 & 1 & 0 \\ - 4 & - 1 & 0 \\ 4 & - 8 & - 2 \end{bmatrix}.$$

[page:164]

解

$$\det(\lambda \boldsymbol{I}-\boldsymbol{A})=\begin{vmatrix}\lambda-1&-2&-2\\-2&\lambda-1&2\\2&2&\lambda-1\end{vmatrix}=(\lambda-1)(\lambda+1)(\lambda-3)$$

A的特征值都是单根，故A能与对角矩阵相似

$$\det(\lambda \boldsymbol{I} - \boldsymbol{B}) = \left| \begin{matrix} \lambda - 3 & 1 & 2 \\ - 2 & \lambda & 2 \\ - 2 & 1 & \lambda + 1 \end{matrix} \right| = \lambda(\lambda - 1)^{2}$$

对于2重特征根 $\lambda_{2} = 1$

$$\lambda_{2} \boldsymbol{I} - \boldsymbol{B} = \begin{bmatrix} - 2 & 1 & 2 \\ - 2 & 1 & 2 \\ - 2 & 1 & 2 \end{bmatrix},$$

$$R \left( \lambda _ { 2 } I - B \right) = 1 ,$$

所以B能与对角矩阵相似.

$$\left| \lambda \boldsymbol{I} - \boldsymbol{C} \right| = \left| \begin{matrix} \lambda - 3 & - 1 & 0 \\ 4 & \lambda + 1 & 0 \\ - 4 & 8 & \lambda + 2 \end{matrix} \right| = (\lambda - 1)^{2}(\lambda + 2)$$

对于2 重特征根 $\lambda_{1} = 1$ ，

$$\lambda_{1} \boldsymbol{I} - \boldsymbol{C} = \begin{bmatrix} - 2 & - 1 & 0 \\ 4 & 2 & 0 \\ - 4 & 8 & 3 \end{bmatrix},$$

$$R \left( \lambda _ { 1 } I - C \right) = 2 ,$$

所以C不能与对角矩阵相似.

例5 已知 $\boldsymbol{\alpha} = \begin{pmatrix} 1 \\ 1 \\ -1 \end{pmatrix}$ 是矩阵 $\boldsymbol{A} = \begin{pmatrix}2 & -1 & 2 \\5 & a & 3 \\-1 & b & -2\end{pmatrix}$ 的特征向量，试确定a，b的值与α所对应的特征值，并讨论A能否与对角矩阵相似.

典型例题讲解可对角化判定范例

解设α所对应的特征值为λ，则

$$\left( \lambda \boldsymbol{I} - \boldsymbol{A} \right) \boldsymbol{\alpha} = \begin{bmatrix} \lambda - 2 & 1 & - 2 \\ - 5 & \lambda - a & - 3 \\ 1 & - b & \lambda + 2 \end{bmatrix} \begin{bmatrix} 1 \\ 1 \\ - 1 \end{bmatrix} = \boldsymbol{0},$$

解得 $a = - 3,b = 0,\lambda = - 1$ .于是

$$\boldsymbol{A} = \begin{bmatrix} 2 & -1 & 2 \\ 5 & -3 & 3 \\ -1 & 0 & -2 \end{bmatrix},$$

[page:165]

$$\det(\lambda \boldsymbol{I} - \boldsymbol{A}) = \left| \begin{matrix} \lambda - 2 & 1 & - 2 \\ - 5 & \lambda + 3 & - 3 \\ 1 & 0 & \lambda + 2 \end{matrix} \right| = (\lambda + 1)^{3}.$$

故 $\lambda = - 1$ 是A的3重特征根 $R \left( - \boldsymbol{I} - \boldsymbol{A} \right) = R \left[ \begin{pmatrix} - 3 & 1 & - 2 \\ - 5 & 2 & - 3 \\ 1 & 0 & 1 \end{pmatrix} \right] = 2$ .所以A不能与对角矩阵相似.

## 习题5.2

1. 在习题5.1第1题中，哪些矩阵可与对角矩阵相似？对于能与对角矩阵相似者，求出可逆矩阵P与对角矩阵Λ，使 $\hat{P}^{-1} \hat{A} \hat{P} = \hat{\Lambda}$

2. 设 $A = \left( a_{ij} \right)_{n \times n}$ 是上三角形矩阵，A的主对角线元相等，且至少有一个元素 $a_{ij} \neq 0$ $( i < j )$ ，证明:A不能与对角矩阵相似.

3. 设 $\alpha_{1},\alpha_{2}$ 是矩阵A不同特征值的特征向量，证明 $\alpha_{1} + \alpha_{2}$ 不是A的特征向量.

4. 设 $f(x)=a_{n}x^{n}+a_{n-1}x^{n-1}+\cdots+a_{1}x+a_{0},A\sim B$ .证明: $f(A) \sim f(B)$

5. 设 $\boldsymbol{A} = \begin{pmatrix}1 & 4 & 2 \\0 & -3 & 4 \\0 & 4 & 3\end{pmatrix}$ ,求 $A^{100}$

6. 设 A，B 都是 n 阶方阵且 $\det A \neq 0$ ，证明 $AB \sim BA$

7. 设 $\boldsymbol{A} = \begin{bmatrix} 1 & 4 & 2 \\ 0 & -3 & 4 \\ 0 & 4 & 3 \end{bmatrix}, \boldsymbol{B} = \begin{bmatrix} 1 & 2 & 3 \\ 0 & x & 6 \\ 0 & 0 & 5 \end{bmatrix}$ ，且 $A \sim B$ ,求x的值.

8. 设3阶方阵A 的特征值 $\lambda_{1} = 1 , \lambda_{2} = 0 , \lambda_{3} = - 1$ ，对应的特征向量为 $\boldsymbol{\alpha}_{1} = \begin{pmatrix} 1 \\ 2 \\ 2 \end{pmatrix}$ $\boldsymbol{\alpha}_{2}=\begin{bmatrix}2\\-2\\1\end{bmatrix},\boldsymbol{\alpha}_{3}=\begin{bmatrix}-2\\-1\\2\end{bmatrix}$ ,求A.

9.设A~B,C~D，证明: $\binom{A \quad O}{O \quad C} \sim \binom{B \quad O}{O \quad D}$

10. 设A是3阶矩阵，且 $\boldsymbol{I}+\boldsymbol{A},3\boldsymbol{I}-\boldsymbol{A},\boldsymbol{I}-3\boldsymbol{A}$ 均不可逆.证明:

(1)A 是可逆矩阵；(2)A 与对角矩阵相似.

11.证明:相似矩阵的行列式相等.

12.设 $\boldsymbol{A} \sim \boldsymbol{\Lambda} = \begin{pmatrix} -1 & 0 \\ 0 & 2 \end{pmatrix}$ ,求 $\det(A - I)$

13. 设矩阵 $\boldsymbol{A} = \begin{bmatrix} 1 & b & 1 \\ b & a & 1 \\ 1 & 1 & 1 \end{bmatrix}, \boldsymbol{B} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 4 \end{bmatrix}$ ，且A与B相似，求 $a , b$

[page:166]

## §5.3n维向量空间的正交性

在几何空间中，我们讨论过向量的长度与向量间的夹角等度量概念，这些概念也可以引入到n维向量空间 $\mathbf{R}^{n}$ 中，而长度与夹角都可以用内积来定义.为此，我们先将几何空间中内积的概念推广到n维向量空间 $\mathbb{R}^n$ ，再进一步讨论向量的长度，夹角以及向量的正交性.

## 一、内积

定义1 设 $\boldsymbol{\alpha} = (a_{1}, a_{2}, \cdots, a_{n}), \boldsymbol{\beta} = (b_{1}, b_{2}, \cdots, b_{n})$ 是 $\mathbf{R}^{n}$ 中的两个向量，则实数

称为α与 $\beta$ 的内积，记为 $( \alpha , \beta )$

$$a_{1}b_{1} + a_{2}b_{2} + \cdots + a_{n}b_{n}$$

在 $\mathbf { R } ^ { 3 }$ 中，也将 $( \alpha , \beta )$ 记为 $\alpha : \beta .$

利用矩阵的乘法，将α，β看作行矩阵，则 $( \alpha , \beta )$ 又可表示为 $a \beta ^ { \mathrm { T } }$ .若将 $\alpha , \beta$ 记为列向量的形式，则 $( \alpha , \beta )$ 可表示为 $\alpha^{\top} \beta,$

根据内积的定义，容易证明内积具有以下性质:

$1 ^ { \circ }$ 非负性 $( \alpha , \alpha ) \geq 0$ ，当且仅当 $\alpha = 0$ 时等号成立；

$2 ^ { \circ }$ 对称性 $( \alpha , \beta ) = ( \beta , \alpha )$

$3 ^ { \circ }$ 线性性 $\left( \boldsymbol{\alpha} + \boldsymbol{\beta} , \boldsymbol{\gamma} \right) = \left( \boldsymbol{\alpha} , \boldsymbol{\gamma} \right) + \left( \boldsymbol{\beta} , \boldsymbol{\gamma} \right)$

$$\left( k \alpha , \beta \right) = k \left( \alpha , \beta \right) ,$$

其中 $\alpha , \beta , \gamma$ 为 $\mathbf{R}^{n}$ 中任意三个向量，k为任意实数.

由上述性质与定义不难看出，内积还满足以下关系:

$$\begin{aligned} &\left( \boldsymbol{\alpha}, l\boldsymbol{\beta} \right) = l\left( \boldsymbol{\alpha}, \boldsymbol{\beta} \right), \quad l \in \mathbb{R}, \\&\left( \boldsymbol{\alpha}, \boldsymbol{\beta} + \boldsymbol{\gamma} \right) = \left( \boldsymbol{\alpha}, \boldsymbol{\beta} \right) + \left( \boldsymbol{\alpha}, \boldsymbol{\gamma} \right).\\ \end{aligned}$$

利用内积可以定义向量的长度.

定义2设 $\boldsymbol{\alpha} = (a_{1}, a_{2}, \cdots, a_{n}) \in \mathbb{R}^{n}$ ,则 $\sqrt{ \left( \boldsymbol{\alpha} , \boldsymbol{\alpha} \right) } = \sqrt{ a_{1}^{2} + a_{2}^{2} + \cdots + a_{n}^{2} }$ 称为 $\alpha$ 的长度，记为 $\parallel \alpha \parallel$

向量的长度具有以下性质:

$1 ^ { \circ }$ 非负性 $\parallel \alpha \parallel \geqslant 0$ ，当且仅当 $\alpha = 0$ 时 $\alpha \parallel = 0$

$2^{\circ}$ 齐次性 $\left\| k \boldsymbol{\alpha} \right\| = \left| k \right| \left\| \boldsymbol{\alpha} \right\|, \quad k \in \mathbb{R};$

$3 ^ { \circ }$ 三角不等式 $\left\| \boldsymbol{\alpha} + \boldsymbol{\beta} \right\| \leqslant \left\| \boldsymbol{\alpha} \right\| + \left\| \boldsymbol{\beta} \right\|$ .

当 $\alpha \parallel \equiv 1$ 时，称α为单位向量

如果 $\alpha \neq 0$ ，则由

$$\left( \frac{1}{\left\| \boldsymbol{\alpha} \right\|} \boldsymbol{\alpha}, \frac{1}{\left\| \boldsymbol{\alpha} \right\|} \boldsymbol{\alpha} \right) = \frac{1}{\left\| \boldsymbol{\alpha} \right\|^2} (\boldsymbol{\alpha}, \boldsymbol{\alpha}) = 1$$

可知， $\frac{1}{\parallel \alpha \parallel } \alpha$ 是单位向量.

[page:167]

向量的内积还满足以下关系式

$$\left( \alpha , \beta \right) ^ { 2 } \leqslant \left\| \alpha \right\| ^ { 2 } \left\| \beta \right\| ^ { 2 } ,$$

当且仅当 $\alpha$ 与 $\beta$ 线性相关时等号成立.这个不等式称为柯西-施瓦茨不等式.

事实上，若 $\alpha , \beta$ 线性无关，则对任意实数t，都有 $t \alpha + \beta \ne 0$ ，于是

$$\left( t \alpha + \beta , t \alpha + \beta \right) = \left( \alpha , \alpha \right) t ^ { 2 } + 2 \left( \alpha , \beta \right) t + \left( \beta , \beta \right) > 0.$$

这是关于t的二次函数，其函数值恒正，则其判别式必小于零，故有

$$\left[ 2 \left( \boldsymbol { \alpha } , \boldsymbol { \beta } \right) \right] ^ { 2 } - 4 \left( \boldsymbol { \alpha } , \boldsymbol { \alpha } \right) \left( \boldsymbol { \beta } , \boldsymbol { \beta } \right) < 0 ,$$

即

$$( \alpha , \beta ) ^ { 2 } < \left\| \alpha \right\| ^ { 2 } \left\| \beta \right\| ^ { 2 } .$$

当 $\alpha , \beta$ 线性相关时，如果 $\alpha , \beta$ 中有一个为0，显然等式成立.因而不妨设 $\beta = k\alpha \ne 0$ ，则有

$$\left( \boldsymbol{\alpha},\boldsymbol{\beta} \right)^{2} = \left( \boldsymbol{\alpha},k\boldsymbol{\alpha} \right)^{2} = k^{2}\left( \boldsymbol{\alpha},\boldsymbol{\alpha} \right)^{2} = \left( \boldsymbol{\alpha},\boldsymbol{\alpha} \right)\left( k\boldsymbol{\alpha},k\boldsymbol{\alpha} \right) = \left\| \boldsymbol{\alpha} \right\|^{2}\left\| \boldsymbol{\beta} \right\|^{2}.$$

根据柯西-施瓦茨不等式，对于任何非零向量 $\alpha , \beta$ ，总有

$$\left| \frac{(\alpha,\beta)}{\left\| \alpha \right\| \left\| \beta \right\|} \right| \leqslant 1.$$

这样我们就可以定义 $\mathbf{R}^{n}$ 中向量的夹角.

定义3当 $\alpha \neq 0$ 且 $\beta \ne 0$ 时， $\theta = \arccos \frac{(\alpha, \beta)}{\parallel \alpha \parallel \parallel \beta \parallel}$ 称为α与 $\beta$ 的夹角，记为 $\langle \alpha , \beta \rangle$

## 二、η维向量的正交性

定义4如果向量α与β的内积为零，即 $( \alpha , \beta ) = 0$ ，则称α与 $\beta$ 正交.

显然， $\mathbf{R}^{n}$ 中的零向量0与任一向量α的内积 $(0,a)=0$ ，所以零向量与任何向量都正交.

定义5如果向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 中任意两个向量都正交且不含零向量，则称$\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 为正交向量组.

正交向量组是 $\mathbf{R}^{n}$ 中十分重要的概念，下面讨论正交向量组的有关性质

定理 正交向量组是线性无关的.

证设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 是正交向量组，且

$$k_{1}\boldsymbol{a}_{1} + k_{2}\boldsymbol{a}_{2} + \cdots + k_{m}\boldsymbol{a}_{m} = \boldsymbol{0}.$$

用 $\alpha _ { 1 }$ 与上式两端作内积，则

$$\begin{aligned}\left( \boldsymbol{\alpha}_{1}, \boldsymbol{0} \right) &= \left( \boldsymbol{\alpha}_{1}, k_{1} \boldsymbol{\alpha}_{1} + k_{2} \boldsymbol{\alpha}_{2} + \cdots + k_{m} \boldsymbol{\alpha}_{m} \right) \\&= \left( \boldsymbol{\alpha}_{1}, k_{1} \boldsymbol{\alpha}_{1} \right) + \left( \boldsymbol{\alpha}_{1}, k_{2} \boldsymbol{\alpha}_{2} \right) + \cdots + \left( \boldsymbol{\alpha}_{1}, k_{m} \boldsymbol{\alpha}_{m} \right) \\&= k_{1} \left( \boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{1} \right) + k_{2} \left( \boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{2} \right) + \cdots + k_{m} \left( \boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{m} \right)\end{aligned}$$

[page:168]

$$k_{1}(\alpha_{1},\alpha_{1}) = 0.$$

因为 $\alpha_{1} \neq 0$ ，所以 $( \alpha _ { 1 } , \alpha _ { 1 } ) > 0$ ，于是 $k_{\mathrm{i}} = 0$

同理， $k_{2}=\cdots=k_{m}=0$ .所以 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 线性无关.

但是，线性无关向量组未必是正交向量组.如 $\boldsymbol{a}_{1} = (1,0,0) , \boldsymbol{a}_{2} = (1,1,0)$ $\alpha_{3} = (1,1,1)$ 线性无关，但其中任何两个向量都不正交

例1 在 $\bar{\mathbf{R}}^3$ 中 $\boldsymbol{\alpha}_{1}=(1,1,1),\boldsymbol{\alpha}_{2}=(1,-2,1)$ ,求向量 $\alpha _ { 3 }$ ，使 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 为正交向量组.

解显然 $\left( \alpha _ { 1 } , \alpha _ { 2 } \right) = 0$ ,设 $\boldsymbol{a}_{3} = (x_{1}, x_{2}, x_{3})$ ，则应有

$$\left\{ \begin{aligned} ( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 3 } ) = x _ { 1 } + x _ { 2 } + x _ { 3 } = 0 , \\ ( \boldsymbol { \alpha } _ { 2 } , \boldsymbol { \alpha } _ { 3 } ) = x _ { 1 } - 2 x _ { 2 } + x _ { 3 } = 0 , \end{aligned} \right.$$

其基础解系为 $\boldsymbol{\alpha}_{3}=(-1,0,1).\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\boldsymbol{\alpha}_{3}$ 为正交向量组.

因为 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 是正交向量组，所以 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 线性无关，于是 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 是 $\mathbf { R } ^ { 3 }$ 的一组基.

例2在 $\mathbf{R}^{n}$ 中，设向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r} (r < n)$ 线性无关，且向量组 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{s}$中每一个向量都与 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r}$ 中每一个向量正交，且 $s + r > n$ .证明 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{s}$ 线性相关.

证设 $\boldsymbol{\alpha}_{i}(i = 1,2,\cdots,r), \boldsymbol{\beta}_{j}(j = 1,2,\cdots,s)$ 均为列向量，则

$$\left( \boldsymbol { \alpha } _ { i } , \boldsymbol { \beta } _ { j } \right) = \boldsymbol { \alpha } _ { i } ^ { \mathrm { T } } \boldsymbol { \beta } _ { j } = 0 \left( i = 1 , 2 , \cdots , r , j = 1 , 2 , \cdots , s \right).$$

又设矩阵 $\boldsymbol{A} = \begin{bmatrix} \boldsymbol{\alpha}_{1}^{\top} \\ \boldsymbol{\alpha}_{2}^{\top} \\ \vdots \\ \boldsymbol{\alpha}_{r}^{\top} \end{bmatrix}$ ,则

$$\boldsymbol{A} \boldsymbol{\beta}_{j}=\left[\begin{aligned}\boldsymbol{\alpha}_{1}^{\mathrm{T}} \boldsymbol{\beta}_{j} \\\boldsymbol{\alpha}_{2}^{\mathrm{T}} \boldsymbol{\beta}_{j} \\\vdots \\\boldsymbol{\alpha}_{r}^{\mathrm{T}} \boldsymbol{\beta}_{j}\end{aligned}\right]=\left[\begin{aligned}0 \\0 \\\vdots \\0\end{aligned}\right],$$

即 $\beta_{j}$ 是齐次线性方程组 $AX = 0$ 的解向量.而 $A X = 0$ 的基础解系由 $n = R(A) = n - r$个解向量组成，所以

$$\beta_{1},\beta_{2},\cdots,\beta_{s}  的秩  \leqslant n - r,$$

由已知条件 $s + r > n$ 可得 $s > n - r$ ，所以 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{s}$ 线性相关.

在正交向量组中，如果每一个向量的长度都是1，这样的正交向量组在相关讨论中特别重要.

定义6设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 是η维向量空间 $\mathbf{R}^{n}$ 的正交向量组，且 $\alpha _ { _ { i } } \parallel = 1$ $(i = 1,2,\cdots,s)$ ,则称 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 为标准正交向量组.若 $s = n$ ，则称 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 为

[page:169]

$\mathrm{R}^{n}$ 的标准正交基.

标准正交向量组又称为规范正交向量组

例如， $\boldsymbol { \alpha } _ { 1 } = ( 1 , 0 , 0 ) , \boldsymbol { \alpha } _ { 2 } = ( 0 , 1 , 0 ) , \boldsymbol { \alpha } _ { 3 } = ( 0 , 0 , 1 )$ 与 $\boldsymbol{\beta}_{1}=\left(\frac{1}{\sqrt{3}}, \frac{1}{\sqrt{3}}, \frac{1}{\sqrt{3}}\right)$ 9 $\boldsymbol{\beta}_{2}=\left(-\frac{1}{\sqrt{6}}, \frac{2}{\sqrt{6}},-\frac{1}{\sqrt{6}}\right), \boldsymbol{\beta}_{3}=\left(-\frac{1}{\sqrt{2}}, 0, \frac{1}{\sqrt{2}}\right)$ 都是 $\mathbf{R}^{3}$ 的标准正交基.

例3设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是 $\mathbf{R}^{n}$ 的一组标准正交基，求 $\mathbf{R}^{n}$ 中向量 $\beta$ 在该基下的坐标.

解设 $\boldsymbol{\beta}=x_{1} \boldsymbol{\alpha}_{1}+x_{2} \boldsymbol{\alpha}_{2}+\cdots+x_{n} \boldsymbol{\alpha}_{n}$ ，将此式两边对 $\alpha_{j} \left( j = 1, 2, \cdots, n \right)$ 分别求内积，得

$$\begin{aligned}(\boldsymbol{\beta}, \boldsymbol{\alpha}_{j}) &= (x_{1}\boldsymbol{\alpha}_{1} + x_{2}\boldsymbol{\alpha}_{2} + \cdots + x_{n}\boldsymbol{\alpha}_{n}, \boldsymbol{\alpha}_{j}) \\&= \sum_{i = 1}^{n} x_{i}(\boldsymbol{\alpha}_{i}, \boldsymbol{\alpha}_{j}) = x_{j}(\boldsymbol{\alpha}_{j}, \boldsymbol{\alpha}_{j}) = x_{j}.\end{aligned}$$

故 $\beta$ 在基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 下的坐标为

$$x_{j} = (\boldsymbol{\beta}, \boldsymbol{\alpha}_{j}), j = 1, 2, \cdots, n.$$

在 $\mathbf { R } ^ { 3 }$ 中，取 $i . j . k$ 为标准正交基，这里的 $x _ { 1 } , x _ { 2 } , x _ { 3 }$ 就是 $\beta$ 在 $i , j , k$ 上的投影.

## 三、施密特正交化方法

n维向量空间 $\mathbf{R}^{n}$ 中任意n个线性无关的向量 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 都可以作为 $\mathbf{R}^{n}$ 的一组基，这组基未必是标准正交基.但是，任何一组线性无关的向量 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ ，都可以通过适当的方法化为一组任意两个向量都正交的单位向量 $\gamma_{1}, \gamma_{2}, \cdots, \gamma_{s}$ ，且 $\gamma _ { 1 }$ $\gamma _ { 2 } , \cdots , \gamma$ 与 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 等价.这种方法就是施密特(Schmidt)正交化方法.

我们首先考虑由 $\alpha_{1},\alpha_{2},\alpha_{3}$ 组成的线性无关向量组.

令 $\boldsymbol{\beta}_{1}=\boldsymbol{\alpha}_{1},\boldsymbol{\beta}_{2}=\boldsymbol{\alpha}_{2}+k\boldsymbol{\beta}_{1}$ ，选择适当的k，使得 $( \boldsymbol { \beta } _ { 2 } , \boldsymbol { \beta } _ { 1 } ) = 0$ ,即

$$\left( \boldsymbol { \alpha } _ { 2 } + k \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 1 } \right) = \left( \boldsymbol { \alpha } _ { 2 } , \boldsymbol { \beta } _ { 1 } \right) + k \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 1 } \right) = 0 ,$$

由此推出 $k = - \frac{\left( \boldsymbol{\alpha}_{2} , \boldsymbol{\beta}_{1} \right)}{\left( \boldsymbol{\beta}_{1} , \boldsymbol{\beta}_{1} \right)}$

$$\boldsymbol { \beta } _ { 2 } = \boldsymbol { \alpha } _ { 2 } - \frac { \left( \boldsymbol { \alpha } _ { 2 } , \boldsymbol { \beta } _ { 1 } \right) } { \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 1 } \right) } \boldsymbol { \beta } _ { 1 } .$$

令 $\boldsymbol{\beta}_{3}=\boldsymbol{\alpha}_{3}+k_{1} \boldsymbol{\beta}_{1}+k_{2} \boldsymbol{\beta}_{2}$ ，为使 $\left( \boldsymbol { \beta } _ { 3 } , \boldsymbol { \beta } _ { 1 } \right) = 0 , \left( \boldsymbol { \beta } _ { 3 } , \boldsymbol { \beta } _ { 2 } \right) = 0$ ，则可推出

$$k _ { 1 } = - \frac { \left( \boldsymbol { \alpha } _ { 3 } , \boldsymbol { \beta } _ { 1 } \right) } { \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 1 } \right) } , \quad k _ { 2 } = - \frac { \left( \boldsymbol { \alpha } _ { 3 } , \boldsymbol { \beta } _ { 2 } \right) } { \left( \boldsymbol { \beta } _ { 2 } , \boldsymbol { \beta } _ { 2 } \right) } ,$$

于是

$$\boldsymbol { \beta } _ { 3 } = \boldsymbol { \alpha } _ { 3 } - \frac { \left( \boldsymbol { \alpha } _ { 3 } , \boldsymbol { \beta } _ { 1 } \right) } { \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 1 } \right) } \boldsymbol { \beta } _ { 1 } - \frac { \left( \boldsymbol { \alpha } _ { 3 } , \boldsymbol { \beta } _ { 2 } \right) } { \left( \boldsymbol { \beta } _ { 2 } , \boldsymbol { \beta } _ { 2 } \right) } \boldsymbol { \beta } _ { 2 } .$$

一般地，把线性无关向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 化为与之等价的标准正交向量组的施

[page:170]

密特正交化过程如下:

$$\beta_{1} = \alpha_{1} ,$$

$$\boldsymbol { \beta } _ { 2 } = \boldsymbol { \alpha } _ { 2 } - \frac { \left( \boldsymbol { \alpha } _ { 2 } , \boldsymbol { \beta } _ { 1 } \right) } { \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 1 } \right) } \boldsymbol { \beta } _ { 1 } ,$$

$$\boldsymbol { \beta } _ { 3 } = \boldsymbol { \alpha } _ { 3 } - \frac { \left( \boldsymbol { \alpha } _ { 3 } , \boldsymbol { \beta } _ { 1 } \right) } { \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 1 } \right) } \boldsymbol { \beta } _ { 1 } - \frac { \left( \boldsymbol { \alpha } _ { 3 } , \boldsymbol { \beta } _ { 2 } \right) } { \left( \boldsymbol { \beta } _ { 2 } , \boldsymbol { \beta } _ { 2 } \right) } \boldsymbol { \beta } _ { 2 } ,$$

$$\boldsymbol { \beta } _ { s } = \boldsymbol { \alpha } _ { s } - \frac { \left( \boldsymbol { \alpha } _ { s } , \boldsymbol { \beta } _ { 1 } \right) } { \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 1 } \right) } \boldsymbol { \beta } _ { 1 } - \frac { \left( \boldsymbol { \alpha } _ { s } , \boldsymbol { \beta } _ { 2 } \right) } { \left( \boldsymbol { \beta } _ { 2 } , \boldsymbol { \beta } _ { 2 } \right) } \boldsymbol { \beta } _ { 2 } - \cdots - \frac { \left( \boldsymbol { \alpha } _ { s } , \boldsymbol { \beta } _ { s - 1 } \right) } { \left( \boldsymbol { \beta } _ { s - 1 } , \boldsymbol { \beta } _ { s - 1 } \right) } \boldsymbol { \beta } _ { s - 1 } .$$

再令

$$\boldsymbol { \gamma } _ { i } = \frac { 1 } { \left\| \boldsymbol { \beta } _ { i } \right\| } \boldsymbol { \beta } _ { i } \quad ( i = 1 , 2 , \cdots , s ) ,$$

则 $\gamma_{1}, \gamma_{2}, \cdots, \gamma_{s}$ 是一组与 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 等价的标准正交向量组

例4设 $\boldsymbol{\alpha}_{1} = (1,1,1)$ ,在 $\mathbf{R}^{3}$ 中求 $\alpha_{2},\alpha_{3}$ ,使 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 为正交向量组.

解由 $\left( \boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{2} \right) = 0, \left( \boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{3} \right) = 0$ 可知， $\alpha_{2},\alpha_{3}$ 都应满足方程

$$x_{1} + x_{2} + x_{3} = 0$$

其基础解系为 $\xi_{1} = (1,0, - 1), \xi_{2} = (0,1, - 1)$ .将 $\xi _ { 1 } , \xi _ { 2 }$ 正交化:

$$\alpha_{2} = \xi_{1} = (1,0,-1)$$

$$\boldsymbol{\alpha}_{3}=\boldsymbol{\xi}_{2}-\frac{\left(\boldsymbol{\xi}_{2}, \boldsymbol{\alpha}_{2}\right)}{\left(\boldsymbol{\alpha}_{2}, \boldsymbol{\alpha}_{2}\right)} \boldsymbol{\alpha}_{2}=(0,1,-1)-\frac{1}{2}(1,0,-1) \text {, } \boldsymbol{\alpha}_{2}=\frac{1}{2}(-1,2,-1) \text {. }$$

$\alpha_{1}, \alpha_{2}, \alpha_{3}$ 为所求的正交向量组.

例5在 $\mathbf { R } ^ { 3 }$ 中，将基 $\boldsymbol{\alpha}_{1}=(1,1,1),\boldsymbol{\alpha}_{2}=(1,2,1),\boldsymbol{\alpha}_{3}=(0,-1,1)$ 化为标准正交基.

解先正交化，令

$$\boldsymbol{\beta}_{1}=\boldsymbol{\alpha}_{1}=(1,1,1)$$

$$\boldsymbol { \beta } _ { 2 } = \boldsymbol { \alpha } _ { 2 } - \frac { \left( \boldsymbol { \alpha } _ { 2 } , \boldsymbol { \beta } _ { 1 } \right) } { \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 1 } \right) } \boldsymbol { \beta } _ { 1 } = ( 1 , 2 , 1 ) - \frac { 4 } { 3 } ( 1 , 1 , 1 ) = \frac { 1 } { 3 } ( - 1 , 2 , - 1 ) ,$$

典型例题讲解施密特正交化方法的计算范例

$$\boldsymbol { \beta } _ { 3 } = \boldsymbol { \alpha } _ { 3 } - \frac { \left( \boldsymbol { \alpha } _ { 3 } , \boldsymbol { \beta } _ { 1 } \right) } { \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 1 } \right) } \boldsymbol { \beta } _ { 1 } - \frac { \left( \boldsymbol { \alpha } _ { 3 } , \boldsymbol { \beta } _ { 2 } \right) } { \left( \boldsymbol { \beta } _ { 2 } , \boldsymbol { \beta } _ { 2 } \right) } \boldsymbol { \beta } _ { 2 } \\ = ( 0 , - 1 , 1 ) - \frac { 0 } { 3 } ( 1 , 1 , 1 ) + \frac { 1 } { 2 } ( - 1 , 2 , - 1 ) = \frac { 1 } { 2 } ( - 1 , 0 , 1 ) .$$

再单位化，令

$$\boldsymbol{\gamma}_{1}=\frac{1}{\left\|\boldsymbol{\beta}_{1}\right\|} \boldsymbol{\beta}_{1}=\frac{1}{\sqrt{3}}(1,1,1),$$

$$\gamma _ { 2 } = \frac { 1 } { \left\| \boldsymbol { \beta } _ { 2 } \right\| } \boldsymbol { \beta } _ { 2 } = \frac { 1 } { \sqrt { 6 } } ( - 1 , 2 , - 1 ) ,$$

[page:171]

$$\gamma_{3}=\frac{1}{\left \| \boldsymbol{\beta}_{3} \right \| }\boldsymbol{\beta}_{3}=\frac{1}{\sqrt{2}}(-1,0,1).$$

$\gamma_{1}, \gamma_{2}, \gamma_{3}$ 就是 $\bar{\mathbf{R}}^{3}$ 的一组标准正交基

## 四、正交矩阵

将例5中的 $\gamma_{1}, \gamma_{2}, \gamma_{3}$ 作为一个矩阵的行向量组

$$\boldsymbol{A} = \left( \begin{aligned} \frac{1}{\sqrt{3}} & \quad \frac{1}{\sqrt{3}} & \quad \frac{1}{\sqrt{3}} \\ -\frac{1}{\sqrt{6}} & \quad \frac{2}{\sqrt{6}} & \quad -\frac{1}{\sqrt{6}} \\ -\frac{1}{\sqrt{2}} & \quad 0 & \quad \frac{1}{\sqrt{2}} \end{aligned} \right),$$

则不难验证 $A^{\top}A = A\tilde{A}^{\top} = I$

定义7 如果η阶实矩阵A满足

$$A^{\top}A = A A^{\top} = I,$$

则称A为正交矩阵.

由定义7可知正交矩阵必为方阵且具有以下性质:

$$1^{\circ} \quad A^{-1} = A^{\mathrm{T}}.$$

于是 $A^{\mathrm{T}} A = I$ 与 $A A ^ { \top } = I$ 中只要有一个成立，则A就是正交矩阵.

$$2^{\circ} \quad \det \boldsymbol{A} = \pm 1.$$

事实上， $\det \left( \boldsymbol{A}^{\mathrm{T}} \boldsymbol{A} \right) = \left( \det \boldsymbol{A}^{\mathrm{T}} \right) \left( \det \boldsymbol{A} \right) = \left( \det \boldsymbol{A} \right)^{2} = \det \boldsymbol{I} = 1$ ，故有 $\det A = \pm 1$

$3 ^ { \circ }$ 若A，B都是n阶正交矩阵，则AB也是正交矩阵.

这个性质的证明留给读者

4°n阶矩阵A为正交矩阵的充分必要条件是A的行(列)向量组是标准正交向量组.

事实上，设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是A的行向量组:

$$\boldsymbol{A} = \begin{bmatrix} \boldsymbol{\alpha}_{1} \\ \boldsymbol{\alpha}_{2} \\ \vdots \\ \boldsymbol{\alpha}_{n} \end{bmatrix}, \quad \boldsymbol{A}^{\mathrm{T}} = (\boldsymbol{\alpha}_{1}^{\mathrm{T}}, \boldsymbol{\alpha}_{2}^{\mathrm{T}}, \cdots, \boldsymbol{\alpha}_{n}^{\mathrm{T}}),$$

$$\boldsymbol{A}\boldsymbol{A}^{\top}=\begin{vmatrix}\boldsymbol{\alpha}_{1}\boldsymbol{\alpha}_{1}^{\top}&\boldsymbol{\alpha}_{1}\boldsymbol{\alpha}_{2}^{\top}&\cdots&\boldsymbol{\alpha}_{1}\boldsymbol{\alpha}_{n}^{\top}\\\boldsymbol{\alpha}_{2}\boldsymbol{\alpha}_{1}^{\top}&\boldsymbol{\alpha}_{2}\boldsymbol{\alpha}_{2}^{\top}&\cdots&\boldsymbol{\alpha}_{2}\boldsymbol{\alpha}_{n}^{\top}\\\vdots&\vdots&&\vdots\\\boldsymbol{\alpha}_{n}\boldsymbol{\alpha}_{1}^{\top}&\boldsymbol{\alpha}_{n}\boldsymbol{\alpha}_{2}^{\top}&\cdots&\boldsymbol{\alpha}_{n}\boldsymbol{\alpha}_{n}^{\top}\end{vmatrix},$$

由上式可知 $\boldsymbol{A}\boldsymbol{A}^{\top} = \boldsymbol{I}$ 的充分必要条件是

$$\boldsymbol { \alpha } _ { i } \boldsymbol { \alpha } _ { i } ^ { \top } = 1 , \quad \boldsymbol { \alpha } _ { j } \boldsymbol { \alpha } _ { j } ^ { \top } = 0 \quad ( i \neq j , i , j = 1 , 2 , \cdots , n ) ,$$

[page:172]

即 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是标准正交向量组.

例6设

$$\boldsymbol{A} = \begin{pmatrix}\dfrac{1}{3} & \dfrac{2}{3} & \dfrac{2}{3} \\\dfrac{2}{3} & \dfrac{1}{3} & -\dfrac{2}{3} \\\dfrac{2}{3} & -\dfrac{2}{3} & \dfrac{1}{3}\end{pmatrix}, \quad\boldsymbol{B} = \begin{pmatrix}2 & 0 & 0 \\0 & \dfrac{1}{\sqrt{2}} & \dfrac{1}{\sqrt{2}} \\0 & \dfrac{1}{\sqrt{2}} & -\dfrac{1}{\sqrt{2}}\end{pmatrix}.$$

A的行向量组是标准正交向量组，故A是正交矩阵，B的各行向量虽然两两正交，但 $\alpha_{1} = (2, 0, 0)$ 不是单位向量，故B不是正交矩阵.

1. 在 $\mathbf { \bar { R } } ^ { 4 }$ 中求下列向量α与 $\beta$ 的夹角:(1) α=(2,1,3,2), β=(1,2,-2,1); (2) α=(1,2,2,3), β=(3,1,5,1); (3) α=(1,1,1,2), β=(3,1,-1,0).

2. 在 $\mathbf{R}^{4}$ 中求一与 $\boldsymbol{\alpha}_{1}=(1,1,-1,1),\boldsymbol{\alpha}_{2}=(1,-1,-1,1),\boldsymbol{\alpha}_{3}=(2,1,1,3)$ 正交的单位向量α.

3. 设 $\gamma_{1}, \gamma_{2}, \gamma_{3}$ 是 $\mathbf{R}^{3}$ 的一组标准正交基，且 $\alpha = 3 \gamma _ { 1 } + 2 \gamma _ { 2 } + 4 \gamma _ { 3 } , \beta = \gamma _ { 1 } - 2 \gamma _ { 2 }$

$$\alpha , \beta$$

$$\alpha , \beta$$

4. 设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是 $\mathbf{R}^{n}$ 的一组基，证明:

(1) 如果 $\boldsymbol{\beta} \in \mathbb{R}^n$ ，且 $\left( \boldsymbol { \beta } , \boldsymbol { \alpha } _ { i } \right) = 0 \left( i = 1 , 2 , \cdots , n \right)$ ,则 $\beta = 0$

(2)如果 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2} \in \mathbb{R}^{n}$ ,使 $\left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \alpha } _ { i } \right) = \left( \boldsymbol { \beta } _ { 2 } , \boldsymbol { \alpha } _ { i } \right) \left( i = 1 , 2 , \cdots , n \right)$ ,则 $\boldsymbol{\beta}_{1} = \boldsymbol{\beta}_{2}$

5. 用施密特正交化方法将下列向量组分别标准正交化:(1) $\alpha_{1} = (1,1,1), \quad \alpha_{2} = (1,2,3), \quad \alpha_{3} = (1,4,9);$ (2) $\alpha_{1} = (1,0,-1,1), \quad \alpha_{2} = (1,-1,0,1), \quad \alpha_{3} = (-1,1,1,0).$

6. 设 $Y_{1},Y_{2},Y_{3}$ 是 $\mathbf { R } ^ { 3 }$ 的一组标准正交基，证明:

$$\boldsymbol{\alpha}_{1}=\frac{1}{3}\left(2 \boldsymbol{\gamma}_{1}+2 \boldsymbol{\gamma}_{2}-\boldsymbol{\gamma}_{3}\right), \boldsymbol{\alpha}_{2}=\frac{1}{3}\left(2 \boldsymbol{\gamma}_{1}-\boldsymbol{\gamma}_{2}+2 \boldsymbol{\gamma}_{3}\right), \boldsymbol{\alpha}_{3}=\frac{1}{3}\left(\boldsymbol{\gamma}_{1}-2 \boldsymbol{\gamma}_{2}-2 \boldsymbol{\gamma}_{3}\right)$$

也是 $\mathbf { R } ^ { 3 }$ 的一组标准正交基

7. 设A，B是同阶正交矩阵，证明 $: \boldsymbol{A} \boldsymbol{B}$ 也是正交矩阵.

8. 设A为正交矩阵，证明 $: \boldsymbol{A}^{\text { * }}$ 也是正交矩阵.

9. 设α为n维列向量， $\boldsymbol{\alpha}^{\mathrm{T}} \boldsymbol{\alpha} = 1, \boldsymbol{H} = \boldsymbol{I} - 2 \boldsymbol{\alpha} \boldsymbol{\alpha}^{\mathrm{T}}$ ，证明:H是对称的正交矩阵.

10. 设 $\boldsymbol{A} = \left| \begin{aligned} \boldsymbol{a} & \quad -\frac{3}{7} & \quad \frac{2}{7} \\ \boldsymbol{b} & \quad \boldsymbol{c} & \quad \boldsymbol{d} \\ -\frac{3}{7} & \quad \frac{2}{7} & \quad \boldsymbol{e} \end{aligned} \right|$ 为正交矩阵，试求 $a , b , c , d , e$ 的值.

11.设A 是奇数阶正交矩阵且 $\det A = 1$ ，证明:λ=1是A的特征值.

[page:173]

## §5.4实对称矩阵的相似对角化

在§5.2中所讨论的一般n阶矩阵相似对角化的结论对于实对称矩阵当然成立.而实对称矩阵的相似对角化又有其自身的特殊性.实对称矩阵的一个重要特性就是它的特征值都是实数，为了证明这个结论:我们先介绍复矩阵的共轭矩阵概念及其基本性质.

设 $A = (a_{ij})_{m \times n}, a_{ij} \in \mathrm{C}(\mathrm{C}$ 为复数集)，我们把 $\overline{A} = (\overline{a}_{ij})_{m \times n}$ 称为A的共轭矩阵，其中 $\overset { - } { a } _ { i j }$ 是 $\alpha_{ij}$ 的共轭复数.

由共轭矩阵的定义及共轭复数的运算性质，容易证明共轭矩阵有以下性质:

$$1^{\circ} \quad \overline{(A^{\top})} = \overline{(A)^{\top}}; \quad 2^{\circ} \quad \overline{kA} = \overline{kA}; \quad 3^{\circ} \quad \overline{AB} = \overline{AB}.$$

现在我们利用上述性质证明以下定理

定理1实对称矩阵的特征值都是实数

证设λ是实对称矩阵A的任一特征值，则有非零向量α，使得 $A\alpha = \lambda\alpha$

欲证λ是实数，只需证明 $\overline{\lambda} = \lambda$ .在 $A\alpha = \lambda \alpha$ 两端取共轭，得 $A\alpha = \lambda\alpha$ ，由共轭矩阵的性质 $2^{\circ}$ 及性质 $3 ^ { \circ }$ ,有 $\overline{A} \overline{\alpha} = \overline{\lambda} \overline{\alpha}$ ，因为A是实对称矩阵，所以 $\overline{A} = A, A^{\mathrm{T}} = A$ ，于是有

$$A^{\top} \alpha = \lambda \alpha,$$

上式两端再取转置，有

$$\overline { { \alpha } } ^ { \mathrm { T } } A = \overline { { \lambda } } \overline { { \alpha } } ^ { \mathrm { T } } ,$$

再用α右乘上式两端，得

$$\begin{aligned}\overline{\alpha}^{\mathrm{T}} A \alpha &= \overline{\lambda} \overline{\alpha}^{\mathrm{T}} \alpha , \\\overline{\alpha}^{\mathrm{T}} \alpha &= \overline{\lambda} \overline{\alpha}^{\mathrm{T}} \alpha ,\end{aligned}$$

移项，有 $( \lambda - \bar{\lambda} ) \boldsymbol{\alpha}^{\mathrm{T}} \boldsymbol{\alpha} = 0$ ,因为 $a \neq 0$ ,所以

$$\overline { { \boldsymbol { \alpha } } } ^ { \mathrm { T } } \boldsymbol { \alpha } = \left( \overline { a } _ { 1 } , \overline { a } _ { 2 } , \cdots , \overline { a } _ { n } \right) \left| \begin{matrix} a _ { 1 } \\ a _ { 2 } \\ \vdots \\ a _ { n } \end{matrix} \right| = \sum _ { i = 1 } ^ { n } \overline { a } _ { i } a _ { i } > 0 ,$$

故 $\lambda - \bar{\lambda} = 0 , \lambda = \bar{\lambda}$ ，即λ为实数.

任一n阶矩阵的不同特征值的特征向量是线性无关的，对于实对称矩阵则有下面更进一步的结论.

定理2设A为一个实对称矩阵，那么对应于A的不同特征值的特征向量彼此正交.

证设 $\lambda_{1} , \lambda_{2}$ 是A的两个不同的特征值， $\alpha_{1}, \alpha_{2}$ 是A分别属于 $\lambda_{1}, \lambda_{2}$ 的特征向量，于是有

$$A \boldsymbol { \alpha } _ { 1 } = \lambda _ { 1 } \boldsymbol { \alpha } _ { 1 } , \quad A \boldsymbol { \alpha } _ { 2 } = \lambda _ { 2 } \boldsymbol { \alpha } _ { 2 } ,$$

[page:174]

上面第一个等式两端取转置可得

$$\boldsymbol{\alpha}_{1}^{\mathrm{T}} \boldsymbol{A} = \lambda_{1} \boldsymbol{\alpha}_{1}^{\mathrm{T}},$$

用 $\alpha _ { 2 }$ 右乘上式两端得

$$\lambda _ { 1 } \boldsymbol { \alpha } _ { 1 } ^ { \mathrm { T } } \boldsymbol { \alpha } _ { 2 } = \boldsymbol { \alpha } _ { 1 } ^ { \mathrm { T } } \boldsymbol { A } \boldsymbol { \alpha } _ { 2 } = \boldsymbol { \alpha } _ { 1 } ^ { \mathrm { T } } \lambda _ { 2 } \boldsymbol { \alpha } _ { 2 } = \lambda _ { 2 } \boldsymbol { \alpha } _ { 1 } ^ { \mathrm { T } } \boldsymbol { \alpha } _ { 2 } ,$$

即 $\left( \lambda_{1} - \lambda_{2} \right) \boldsymbol{\alpha}_{1}^{\mathrm{T}} \boldsymbol{\alpha}_{2} = 0$ ，又因为 $\lambda_{1} \neq \lambda_{2}$ ，所以有 $\boldsymbol{\alpha}_{1}^{\mathrm{T}} \boldsymbol{\alpha}_{2} = 0$ ,即 $\alpha_{1}$ 与 $\alpha_{2}$ 正交.

一般n阶矩阵未必能与对角矩阵相似，而实对称矩阵则一定能够与对角矩阵相似，这个结论可由下面的定理得到.

定理3对任意n阶实对称矩阵A，都存在一个n阶正交矩阵C，使得

$$\hat{C}^{\mathrm{T}} A \hat{C} = \hat{C}^{-1} A \hat{C}$$

为对角矩阵.

证明从略.

由定理3可知实对称矩阵的对角化问题，实质上是求正交矩阵C的问题.计算C的步骤如下:

$1 ^ { \circ }$ 求出实对称矩阵A的全部特征值 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{r}$

$2 ^ { \circ }$ 对于各个不同的特征值 $\lambda_{i}$ ，求出齐次线性方程组 $( \lambda _ { i } I - A ) X = 0$ 的基础解系.对基础解系进行正交化和单位化，得到A对于 $\lambda_{i}$ 的一组标准正交的特征向量.由§5.2的推论3可知，这个向量组所含向量的个数恰好是 $\lambda_{i}$ 作为A的特征值的重数；

$3 ^ { \circ }$ 将 $\lambda_{i} \left( i = 1, 2, \cdots, r \right)$ 的所有标准正交的特征向量构成一组 $\mathbf{R}^{n}$ 的标准正交基$Y_{1},Y_{2},\cdots,Y_{n}$

$4 ^ { \circ }$ 取 $C = \left( \gamma_{1}, \gamma_{2}, \cdots, \gamma_{n} \right)$ ，则C为正交矩阵且使得 $C^{\mathrm{T}}AC = C^{-1}AC$ 为对角矩阵，对角线上的元为相应特征向量的特征值.

例1 设 $\boldsymbol{A} = \begin{pmatrix}2 & 2 & - 2 \\2 & 5 & - 4 \\- 2 & - 4 & 5\end{pmatrix}$ ，求正交矩阵C，使 $C^{-1}AC$ 为对角矩阵.

解

典型例题讲解正交对角化的计算范例

$$\begin{aligned}\det(\lambda \boldsymbol{I}-\boldsymbol{A}) &=\begin{vmatrix}\lambda-2 & -2 & 2 \\-2 & \lambda-5 & 4 \\2 & 4 & \lambda-5\end{vmatrix}=\begin{vmatrix}\lambda-2 & -2 & 2 \\0 & \lambda-1 & \lambda-1 \\2 & 4 & \lambda-5\end{vmatrix} \\&=\begin{vmatrix}\lambda-2 & -2 & 4 \\0 & \lambda-1 & 0 \\2 & 4 & \lambda-9\end{vmatrix}=(\lambda-1)\begin{vmatrix}\lambda-2 & 4 \\2 & \lambda-9\end{vmatrix}=(\lambda-1)^{2}(\lambda-10).\end{aligned}$$

对于 $\lambda_{1} = 1  (2$ 重），由 $( \lambda _ { 1 } I - A ) X = 0$ ,即

$$\begin{pmatrix}-1 & -2 & 2 \\-2 & -4 & 4 \\2 & 4 & -4\end{pmatrix}\begin{bmatrix}x_1 \\x_2 \\x_3\end{bmatrix}=\begin{bmatrix}0 \\0 \\0\end{bmatrix},$$

[page:175]

解得基础解系为 $\boldsymbol{\alpha}_{1}=(-2,1,0)^{\mathrm{T}},\boldsymbol{\alpha}_{2}=(2,0,1)^{\mathrm{T}}$ .将 $\alpha_{1},\alpha_{2}$ 正交化:

$$\boldsymbol{\beta}_{1}=\boldsymbol{\alpha}_{1}=(-2,1,0)^{\mathrm{T}}$$

$$\boldsymbol{\beta}_{2}=\boldsymbol{\alpha}_{2}-\frac{\left(\boldsymbol{\alpha}_{2}, \boldsymbol{\beta}_{1}\right)}{\left(\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{1}\right)} \boldsymbol{\beta}_{1}=(2,0,1)^{\mathrm{T}}-\frac{-4}{5}(-2,1,0)^{\mathrm{T}}=\frac{1}{5}(2,4,5)^{\mathrm{T}}.$$

再将 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}$ 单位化:

$$\boldsymbol { \gamma } _ { 1 } = \frac { 1 } { \left\| \boldsymbol { \beta } _ { 1 } \right\| } \boldsymbol { \beta } _ { 1 } = \left( - \frac { 2 } { \sqrt { 5 } } , \frac { 1 } { \sqrt { 5 } } , 0 \right) ^ { \mathrm { T } } ,$$

$$\gamma_{2}=\frac{1}{\left \| \boldsymbol{\beta}_{2} \right \| }\boldsymbol{\beta}_{2}=\left ( \frac{2}{3\sqrt{5}},\frac{4}{3\sqrt{5}},\frac{5}{3\sqrt{5}} \right )^{\mathrm{T}}.$$

对于 $\lambda_{2} = 10$ ,由 $\left( \lambda _ { 2 } \boldsymbol { I } - \boldsymbol { A } \right) \boldsymbol { X } = \boldsymbol { 0 }$ 解得 $\boldsymbol{\alpha}_{3} = (1, 2, -2)^{\mathrm{T}}$ ,将 $\alpha_{3}$ 单位化:

$$\gamma_{3}=\frac{1}{\left\|\boldsymbol{\alpha}_{3}\right\|}\boldsymbol{\alpha}_{3}=\left(\frac{1}{3},\frac{2}{3},-\frac{2}{3}\right)^{\mathrm{T}}.$$

令

$$\boldsymbol{C}=\left(\boldsymbol{\gamma}_{1}, \boldsymbol{\gamma}_{2}, \boldsymbol{\gamma}_{3}\right)=\left|\begin{array}{ccc}-\dfrac{2}{\sqrt{5}} & \dfrac{2}{3 \sqrt{5}} & \dfrac{1}{3} \\\dfrac{1}{\sqrt{5}} & \dfrac{4}{3 \sqrt{5}} & \dfrac{2}{3} \\0 & \dfrac{5}{3 \sqrt{5}} & -\dfrac{2}{3}\end{array}\right|,$$

则C为正交矩阵，且 $\boldsymbol{C}^{-1} \boldsymbol{A} \boldsymbol{C} = \begin{pmatrix} 1 & & \\ & 1 & \\ & & 10 \end{pmatrix}$

例2设A，B都是n阶实对称矩阵，证明:A与B相似的充要条件是A与B有相同的特征值.

证充分性:设A与B有相同的特征值: $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}$ ，则存在可逆矩阵P，Q，使

$$P^{-1}AP = \Lambda = Q^{-1}BQ$$

其中 $\boldsymbol{\Lambda} = \mathrm{diag}(\lambda_1, \lambda_2, \cdots, \lambda_n)$ .由矩阵相似的传递性可知A与B相似.

必要性的证明与§5.2定理1的证明相同.

例3设A,B都是n阶实对称矩阵，若存在正交矩阵T，使 $T^{-1}AT,T^{-1}BT$ 都是对角矩阵，则AB是实对称矩阵.

证由 $( \boldsymbol{A} \boldsymbol{B} )^{\mathrm{T}} = \boldsymbol{B}^{\mathrm{T}} \boldsymbol{A}^{\mathrm{T}} = \boldsymbol{B} \boldsymbol{A}$ 可知，AB对称的充要条件是AB可交换.因此只需证$AB = BA$ .据已知，设

$$\boldsymbol{T}^{-1} \boldsymbol{A} \boldsymbol{T} = \mathrm{diag}(\lambda_1, \lambda_2, \cdots, \lambda_n), \quad \boldsymbol{T}^{-1} \boldsymbol{B} \boldsymbol{T} = \mathrm{diag}(\mu_1, \mu_2, \cdots, \mu_n),$$

则

[page:176]

$$\left( \boldsymbol{T}^{-1} \boldsymbol{A} \boldsymbol{T} \right) \left( \boldsymbol{T}^{-1} \boldsymbol{B} \boldsymbol{T} \right) = \left( \boldsymbol{T}^{-1} \boldsymbol{B} \boldsymbol{T} \right) \left( \boldsymbol{T}^{-1} \boldsymbol{A} \boldsymbol{T} \right) = \mathrm{diag} \left( \lambda_1 / \varepsilon_1 , \cdots , \lambda_n / \varepsilon_n \right) ,$$

所以 $AB = BA$ .故 AB 是实对称矩阵.

## 应用实例

实例 $一  \left(  CO _{2} \right.$ 分子振动)求一个振动分子的固有频率问题实质上是一个特征值问题.我们考虑 $\mathrm{CO}_{2}$ 分子.这是一个所谓的线性分子，即当这一分子处于平衡状态时，它的所有原子都在一条直线上.

考虑纵向振动.假定这一分子的所有运动都很小.

设 $x _ { \frac { 1 } { 4 } }$ 与 $x _ { 3 }$ 表示当这一系统作纵向振动时，两个氧原子偏离平衡位置的位移，而$x _ { 2 }$ 表示碳原子偏离平衡位置的位移.假设恢复力是偏离平衡位置的位移的线性函数，并设碳原子和一个氧原子之间的力常数为k，而两个氧原子之间的力常数为 $k ^ { \prime }$ 一个氧

原子的质量用m表示，碳原子的质量用M表示，则

运动方程为

$$\left\{ \begin{aligned} m \frac{\mathrm{d}^{2} x_{1}}{\mathrm{d} t^{2}} &= k(x_{2}-x_{1})+k^{\prime}(x_{3}-x_{1}), \\ M \frac{\mathrm{d}^{2} x_{2}}{\mathrm{d} t^{2}} &= -k(x_{2}-x_{1})+k(x_{3}-x_{2}), \\ m \frac{\mathrm{d}^{2} x_{3}}{\mathrm{d} t^{2}} &= -k(x_{3}-x_{2})-k^{\prime}(x_{3}-x_{1}). \end{aligned} \right.$$

求解该微分方程组.

解 方程组的矩阵形式为

$$\hat { \boldsymbol { X } } = \boldsymbol { A } \boldsymbol { X } , \boldsymbol { A } = \begin{pmatrix}- ( p + q ) & p & q \\r & - 2 r & r \\q & p & - ( p + q )\end{pmatrix},$$

其中 $p = \frac{k}{m}, q = \frac{k'}{m}, r = \frac{k}{M}$

$$\det \left( \lambda \boldsymbol{I} - \boldsymbol{A} \right) = \lambda \left( \lambda + p + 2q \right) \left( \lambda + p + 2r \right).$$

A的特征值是 $\lambda = 0 , - ( p + 2 q ) , - ( p + 2 r )$ .对应的特征向量分别为

$$\begin{pmatrix}1 \\1 \\1\end{pmatrix},\begin{bmatrix}1 \\0 \\-1\end{bmatrix},\begin{bmatrix}1 \\-\dfrac{2m}{M} \\1\end{bmatrix}.$$

作可逆矩阵 $\boldsymbol{C} = \begin{pmatrix}1 & 1 & 1 \\1 & 0 & -\dfrac{2m}{M} \\1 & -1 & 1\end{pmatrix}$ ,令 $X = C Y$ ,则

[page:177]

$$\boldsymbol{C}^{-1} \boldsymbol{A} \boldsymbol{C}=\begin{pmatrix}0 & 0 & 0 \\0 & -(p+2 q) & 0 \\0 & 0 & -(p+2 r)\end{pmatrix}.$$

这样，运动方程化简为 $\dot{Y} = (C^{-1}AC)Y$ ,即

$$\begin{cases}\ddot{y}_{1} = 0, \\\ddot{y}_{2} + (p + 2q)y_{2} = 0, \\\ddot{y}_{3} + (p + 2r)y_{3} = 0.\end{cases}$$

通解为 $\begin{cases}y_{1} = c_{1}t + d, \\y_{2} = c_{2}\sin(\sqrt{p + 2q} t + \alpha), \\y_{3} = c_{3}\sin(\sqrt{p + 2r} t + \beta),\end{cases}$

三类规范(标准)方式分别是当 $i = 1 , 2 , 3$ 时由 $y_{i} \neq 0, y_{j} = 0 (j \neq i)$ 所给出的.由$X = cY$ ，这三类规范方式分别对应于

(1) $x_{1}=x_{2}=x_{3}=c_{1}t+d$

(2) $x_{2}=0,x_{1}=-x_{3}=c_{2}\sin(\sqrt{p+2q}t+\alpha)$

(3) $x_{1}=x_{3}=c_{3}\sin(\sqrt{p+2r}t+\beta),x_{2}=-\left(\frac{2m}{M}\right)x_{1}.$

第一类规范方式(对应特征值 $\lambda = 0$ 只是一个平移.其余两类规范方式都是在平衡位置附近的振动，其周期分别是 $\frac{2\pi}{\sqrt{p + 2q}}  与  \frac{2\pi}{\sqrt{p + 2r}}$

实例二(人口流动问题)设某城市有30万人从事农、工、商工作，假定这个总人数在若干年内保持不变，根据社会调查得到以下数据:

（1）在这30万就业人员中，目前从事农、工、商工作的人数分别是15万，9万，6万；

(2)农业人员中每年有20%改为从工，10%改为从商；

（3）工业人员中每年有20%改为从农，10%改为从商；

（4）商业人员中每年有10%改为从农，10%改为从工

预测一二年后从事各业人员的人数以及多年后从事各业人员总数的发展趋势

解设 $\hat { \boldsymbol { X } } _ { i } = ( x _ { i 1 } , x _ { i 2 } , x _ { i 3 } ) ^ { \mathrm { T } }$ 表示第i年后从事农、工、商人员的数量，则

$$\boldsymbol{X}_{0}=(15,9,6)^{\mathrm{T}}$$

分别用1,2，3表示农、工、商三种行业，用 $\boldsymbol{a}_{ij}$ 表示每年从第i种行业改为第j种行业的人数占第i种行业人数的百分比， $:a_{ij}$ 表示第i种行业人员继续从事该行业的百分比，则矩阵 $A = (a_{ij})$ 就表示从事各业人员间的转移比例，

$$\boldsymbol{A} = \begin{bmatrix} 0.7 & 0.2 & 0.1 \\ 0.2 & 0.7 & 0.1 \\ 0.1 & 0.1 & 0.8 \end{bmatrix}.$$

由题目条件可得

[page:178]

$$\boldsymbol{X}_{1}=\boldsymbol{A} \boldsymbol{X}_{0}=\left(\begin{aligned}12. 9 \\ 9. 9 \\ 7. 2\end{aligned}\right), \boldsymbol{X}_{2}=\boldsymbol{A} \boldsymbol{X}_{1}=\left(\begin{aligned}11. 73 \\ 10. 23 \\ 8. 04\end{aligned}\right).$$

事实上，

$$\begin{aligned}\boldsymbol{X}_{2} &=\boldsymbol{A} \boldsymbol{X}_{1}=\boldsymbol{A}^{2} \boldsymbol{X}_{0}, \cdots, \boldsymbol{X}_{n}=\boldsymbol{A} \boldsymbol{X}_{n-1}=\boldsymbol{A}^{2} \boldsymbol{X}_{n-2}=\cdots=\boldsymbol{A}^{n} \boldsymbol{X}_{0}, \\&\det(\lambda \boldsymbol{I}-\boldsymbol{A})=\cdots=(\lambda-1)(\lambda-0.7)(\lambda-0.5).\end{aligned}$$

A的特征值为 $\lambda_{1} = 1, \lambda_{2} = 0, \lambda_{3} = 0.5$ .故存在可逆矩阵P，使 $A = P \Lambda P^{-1}$ ，其中 $A =$ $\mathrm{diag}(1,0.7,0.5)$

$$\boldsymbol{A}^{n}=\boldsymbol{P}\boldsymbol{A}^{n}\boldsymbol{P}^{-1}=\boldsymbol{P}\begin{bmatrix}1^{n}&\\&(0.7)^{n}&\\&&(0.5)^{n}\end{bmatrix}\boldsymbol{P}^{-1}.$$

当 $n \to \infty$ 时 $,A^{n}$ 趋近于 $\begin{pmatrix}1 & 0 & 0 \\0 & 0 & 0 \\0 & 0 & 0\end{pmatrix},$

设 $n \to \infty$ 时， $X_{n} \rightarrow X$ ,则 $X_{n - 1} \rightarrow X^*$ ,由 $X_{n} = A X_{n - 1}$ 可得

$$A X ^ { * } = X ^ { * } .$$

若 $X^{*} \neq 0$ ,则 $X ^ { * }$ 是A 对应于特征值 $\lambda_{1} = 1$ 的特征向量.

解方程组 $\left[ \lambda _ { 1 } I - A \right] X = 0$ 可得基础解系为 $\boldsymbol{\alpha} = (1,1,1)^{\mathrm{T}}$ .故 $X^{*}$ 可由α线性表出，设 $\boldsymbol{X}^{*} = k\boldsymbol{\alpha} = (k, k, k)^{\mathrm{T}}$ ，则由 $k + k + k = 30$ ，可得 $k \equiv 1 0 .$ 即多年之后，从事农、工、商工作的人数将趋于相等，即都趋于10万人.

此问题还可以用以下方法求解:

由前面分析可知:

$$X_{n}=A^{n}X_{0}, A^{n}=PA^{n}P^{-1},$$

且A的特征值为 $\lambda_{1} = 1 , \lambda_{2} = 0 . 7 , \lambda_{3} = 0 . 5$ 5.将 $\lambda_{1}, \lambda_{2}, \lambda_{3}$ 代入齐次线性方程组

$$\left[ \lambda _ { i } I - A \right] X = 0 ,$$

可求出 $\lambda_{1}, \lambda_{2}, \lambda_{3}$ 所对应的特征向量分别为 $\boldsymbol{\alpha}_{1}=(1,1,1)^{\mathrm{T}}, \boldsymbol{\alpha}_{2}=(1,1,-2)^{\mathrm{T}}, \boldsymbol{\alpha}_{3}=$ $(1, -1, 0)^{\mathrm{T}}$ .所以

$$\boldsymbol{P} = (\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\boldsymbol{\alpha}_{3}) = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 1 & -1 \\ 1 & -2 & 0 \end{bmatrix}, \quad \boldsymbol{P}^{-1} = \frac{1}{6} \begin{bmatrix} 2 & 2 & 2 \\ 1 & 1 & -2 \\ 3 & -3 & 0 \end{bmatrix}.$$

$$\boldsymbol{A}^{n}=\boldsymbol{P}\boldsymbol{A}^{n}\boldsymbol{P}^{-1}=\begin{bmatrix}2+(0.7)^{n}+3(0.5)^{n}&2+(0.7)^{n}-3(0.5)^{n}&2-2(0.7)^{n}\\2+(0.7)^{n}-3(0.5)^{n}&2+(0.7)^{n}+3(0.5)^{n}&2-2(0.7)^{n}\\2-2(0.7)^{n}&2-2(0.7)^{n}&2+4(0.7)^{n}\end{bmatrix}$$

于是，

[page:179]

$$\boldsymbol{X}_{n}=\boldsymbol{A}^{n} \boldsymbol{X}_{0}=\begin{bmatrix}10+2(0.7)^{n}+3(0.5)^{n} \\ 10+2(0.7)^{n}-3(0.5)^{n} \\ 10-4(0.7)^{n}\end{bmatrix}$$

由上式可以得到第n年从事农、工、商人员的人数情况，且当 $n \to \infty$ 时， $X_{n}$ 趋近于 $X^{*} = (10,10,10)^{\mathrm{T}}$ .即经过很多年后，从事农、工、商人员的数目都趋近于10万人.

实例三(最小二乘近似)在科学工程中经常会进行预测.在两个变量x和 $\mathcal { Y }$之间存在线性关系 $y = m x + b$ ，而常数m和b是未知的，为了求出m和b，测得实验数据:

$$\begin{array}{c|cccc}\bar{x} & \bar{x}_{1} & \bar{x}_{2} & \cdots & \bar{x}_{n} \\\hline y & \bar{y}_{1} & \bar{y}_{2} & \cdots & \bar{y}_{n} \\\end{array}$$

如果点 $\left( x _ { 1 } , y _ { 1 } \right) , \left( x _ { 2 } , y _ { 2 } \right) , \cdots , \left( x _ { n } , y _ { n } \right)$ 落在 $\bar{\mathbf{R}}^2$ 的一条直线上，那么容易确定由实验得到的m和b的预测值:它们是过这n个点的直线的斜率和在y轴上的截距.然而，通常点 $(x_{1},y_{1}),(x_{2},y_{2}),\cdots,(x_{n},y_{n})$ 不在同一直线上，于是问题化为求一条直线，使得在某种意义下，该直线距离这n个点最近.

怎样才叫一点到一直线最近，有各种不同的度量标准.我们可以用这些点沿垂直方向到直线 $y = mx + b$ 的距离的平方和

$$S = \left[ y_{1} - (mx_{1} + b) \right]^{2} + \cdots + \left[ y_{n} - (mx_{n} + b) \right]^{2}$$

来度量这些点与直线的接近程度.平方放大了较大的误差在S中的比重

对点 $(x_{1},y_{1}),\cdots,(x_{n},y_{n})$ 的最小二乘线性近似就是直线 $y = m x + b$ ，它使得S尽可能的小.我们将用线性代数方法求出使S达到最小的m和b.

如果 $\left( x _ { 1 } , y _ { 1 } \right) , \cdots , \left( x _ { n } , y _ { n } \right)$ 共线，则有

$$\{ \begin{aligned} mx_{1} + b &= y_{1}, \\ mx_{2} + b &= y_{2}, \\ \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \cdots \ \end{aligned}$$

其中 $\boldsymbol{X}=\left(x_{1}, x_{2}, \cdots, x_{n}\right)^{\mathrm{T}}, \boldsymbol{e}=(1,1, \cdots, 1)^{\mathrm{T}}, \boldsymbol{Y}=\left(y_{1}, y_{2}, \cdots, y_{n}\right)^{\mathrm{T}}$ .可见n个给定点在$\mathbf{R}^{n}$ 中的同一直线l上的充分必要条件是Y是X和e的线性组合，系数分别是l的斜率和y轴上的截距.

如果 $(x_{1},y_{1}),\cdots,(x_{n},y_{n})$ 不共线，考虑求m和b，使得 $mX + be$ 尽可能接近Y.我们求m和b，使得

$$\left\| \boldsymbol{Y} - (m\boldsymbol{X} + b\boldsymbol{e}) \right\|^2 = \left[ y_1 - (m\boldsymbol{x}_1 + b) \right]^2 + \cdots + \left[ y_n - (m\boldsymbol{x}_n + b) \right]^2 = S$$

最小，恰好与所求点 $\left( x _ { 1 } , y _ { 1 } \right) , \cdots , \left( x _ { n } , y _ { n } \right)$ 的最小二乘近似相同.

由于此时方程组 $mX + be = Y$ 无解，即 $Y \notin L(X,e)$ .因在 $L(X,e)$ 中的向量最接近

[page:180]

Y的是Y在 $L(X,e)$ 上的正交投影(图5.4).这样，最小二乘近似问题的解就是方程组

$$mX + be = \Pr_{L(X,e)} Y$$

的解.求其中的m和b可以采用如下方法:

因

图5.4

$\tilde{Y}-\mathrm{Prj}_{L(X,e)}Y=\left[Y-(mX+be)\right]\perp$ 平面 $L(X,e)$

又 $X \in L\left ( X,e \right ) ,e \in L\left ( X,e \right )$ ，于是必有

$$\left\{ \begin{aligned} \left( X , \left[ Y - ( m X + b e ) \right] \right) &= 0 , \\ \left( e , \left[ Y - ( m X + b e ) \right] \right) &= 0 . \end{aligned} \right.$$

即

$$\begin{cases}(X, X)m + (X, e)b = (X, Y), \\(e, X)m + (e, e)b = (e, Y).\end{cases}$$

由克拉默法则得

$$\left\{ \begin{aligned} m = \frac{(e, e)(X, Y) - (e, X)(e, Y)}{(e, e)(X, X) - (e, X)^2}, \\ b = \frac{(X, X)(e, Y) - (X, Y)(e, X)}{(e, e)(X, X) - (e, X)^2}. \end{aligned} \right.$$

实例四求点 $(-1,1),(1,-1),(3,-4),(5,-4)$ 的最小二乘线性近似

解 令 $\boldsymbol{X} = (-1, 1, 3, 5), \boldsymbol{Y} = (1, -1, -4, -4)$ ,则

$$\left\{ \begin{aligned} m &= \frac{4(-34) - 8(-8)}{4 \times 36 - 8^2} = -\frac{9}{10}, \\ b &= \frac{36(-8) - (-34) \times 8}{4 \times 36 - 8^2} = -\frac{1}{5}, \end{aligned} \right.$$

直线为 $y=-\frac{9}{10}x-\frac{1}{5}$

实例五 某小镇的人口在20年间缓慢地增长如下表:

<table><tr><td>年</td><td>1960</td><td>1970 1980</td></tr><tr><td>人口数</td><td>2000 2 050</td><td>2 080</td></tr></table>

试预测2010年时这个小镇的人口数

解没有其他的信息可用来找到别的方法，用直线作为人口增长规律的近似表示是可取的.令 $X = (1960, 1970, 1980), Y = (2\ 000, 2\ 050, 2\ 080)$ .利用公式可求得 $m =$ $4,b = -5836.67$ .所以这些数据的最小二乘近似为 $y=4x-5836.67$ . 将 $x = 2010$ 代入得 $y = 2\ 163.\ 33$ .故我们预测2010年时人口数为2163.

最小二乘线性近似也可用来对实验数据作非线性函数拟合.最常见的例子是幂函数和指数函数.

如果在正的变量x和y之间有确定的理论关系 $y = a x^{b}$ ，那么取对数得出lgx和

[page:181]

lg y之间的线性关系式

$$\lg y = b \lg x + \lg a$$

于是同样可用最小二乘近似法.

如果在理论上x和y之间存在形如 $y = a c^{x}$ 的关系，其中 $y , a , c > 0$ .取对数得x和lg y之间的线性关系式

$$\lg y = (\lg c)x + \lg a.$$

所以也可用最小二乘近似法.

## 习题5.4

1. 设 $\boldsymbol{A} = \begin{pmatrix} 1 & - 2 & 2 \\ - 2 & 4 & - 4 \\ 2 & - 4 & 4 \end{pmatrix}$ ，求正交矩阵P及对角矩阵A，使 $P^{-1}AP = \Lambda$

2. 设 $\boldsymbol{A} = \begin{pmatrix}2 & 0 & 0 \\0 & 3 & a \\0 & a & 3\end{pmatrix}$ ，有正交矩阵C，使 $\boldsymbol{C}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{C}=\begin{pmatrix}1 & 0 & 0 \\0 & 2 & 0 \\0 & 0 & 5\end{pmatrix}$ ,求常数a 与矩阵C.

3. 设三阶实对称矩阵A的特征值是1,2,3，矩阵A 对应于特征值1,2的特征向量分别是 $\boldsymbol{\alpha}_{1}=(-1,-1,1)^{\mathrm{T}}, \boldsymbol{\alpha}_{2}=(1,-2,-1)^{\mathrm{T}}$

(1)求A对应于特征值3的特征向量；(2)求矩阵A.

4.设A是3阶实矩阵，且有3个相互正交的特征向量。证明:A是实对称矩阵.

5. 设A是 n 阶实对称矩阵 $,A^{2}=A$ ，证明:存在正交矩阵T，使得

$$\boldsymbol{T}^{-1} \boldsymbol{A} \boldsymbol{T} = \mathrm{diag}(1,1,\cdots,1,0,\cdots,0).$$

## 习题五

1. 求矩阵 $\boldsymbol{A} = \begin{pmatrix}1 & 3 & 1 & 2 \\0 & -1 & 1 & 3 \\0 & 0 & 3 & 5 \\0 & 0 & 0 & 3\end{pmatrix}$ 的特征值与特征向量.

2. 求方阵 $\boldsymbol{A} = \begin{pmatrix}a & a & \cdots & a \\a & a & \cdots & a \\\vdots & \vdots & & \vdots \\a & a & \cdots & a\end{pmatrix}$ $(a \neq 0)$ 的特征值和特征向量.

3. 设 $\boldsymbol{A} = \begin{pmatrix}-1 & 2 & 2 \\2 & -1 & -2 \\2 & -2 & -1\end{pmatrix}$

[page:182]

(1) 求A的特征值；

(2) 求 $I + A^{-1}$ 的特征值.

4. 设 $\boldsymbol{A} = \begin{pmatrix} 7 & 4 & -1 \\ 4 & 7 & -1 \\ -4 & -4 & x \end{pmatrix}$ 的特征值 $\lambda _ { 1 } = 3 ( 三重 ) , \lambda _ { 2 } = 1 2$ ，求x的值，并求其特征向量.

5. 设 3阶矩阵A的特征值为 $\lambda_{1} = 1 , \lambda_{2} = 2 , \lambda_{3} = 3$ ，对应的特征向量依次为

$$\xi_{1} = (1,1,1)^{\mathrm{T}}, \xi_{2} = (1,2,4)^{\mathrm{T}}, \xi_{3} = (1,3,9)^{\mathrm{T}},$$

向量 $\boldsymbol{\beta} = (1,1,3)^{\mathrm{T}}$

(1)将β用 $5 1 , 5 2 , 5 3$ 线性表出；

(2) 求 $A^{n}\beta(n$ 为正整数).

6. 设矩阵A与B相似，其中 $\boldsymbol{A} = \begin{bmatrix} - 2 & 0 & 0 \\ 2 & x & 2 \\ 3 & 1 & 1 \end{bmatrix}, \boldsymbol{B} = \begin{bmatrix} - 1 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & y \end{bmatrix},$

(1) 求x 与 y 的值；

(2) 求可逆矩阵P，使 $P^{-1}AP = B$

7.设 n 阶矩阵 A 有 n 个特征值 $0,1,2,\cdots,n-1$ ，且矩阵B~A，求 $\det(I + B)$

8. 设 $\boldsymbol{A} = \begin{bmatrix} 2 & 2 & 0 \\ 8 & 2 & a \\ 0 & 0 & 6 \end{bmatrix} \sim \boldsymbol{A}$ (对角矩阵)，求常数a，并求可逆矩阵P，使 $\boldsymbol{P}^{-1} \boldsymbol{A} \boldsymbol{P} = \boldsymbol{\Lambda}$

9. 求齐次线性方程组 $\left\{ \begin{aligned} 2 x_{1} + x_{2} - x_{3} + x_{4} - 3x_{5} = 0, \\ x_{1} + x_{2} - x_{3} \quad + x_{5} = 0 \end{aligned} \right.$ 的解空间的一组标准正交基.

10. 如果实对称矩阵A 满足关系式 $A^{2} + 6A + 8I = O$ ，证明 $:A + 3I$ 是正交矩阵。

11. 若实矩阵A 满足 $A^{\mathrm{T}} = - A$ ，则称A为反称实矩阵.证明:反称实矩阵的特征值为0或纯虚数.

12. 已知三阶实对称矩阵A的特征值为1,1，—2，且 $(1,1,-1)^{\mathrm{T}}$ 是对应于—2的特征向量，求A.

13. 设3 阶矩阵A与 3 维向量X使 $X,AX,A^{2}X$ 线性无关，且

$$A^{3}X = 3AX - 2A^{2}X.$$

(1) 记 $\hat{P} = (\hat{X}, \hat{A}\hat{X}, \hat{A}^2\hat{X})$ ，求3阶矩阵B，使 $\dot{A} = PBP^{-1}$

(2) 求 $\det(A + I)$

14.设 $\xi = \left[ \begin{matrix} { 1 } \\ { 1 } \\ { - 1 } \\ \end{matrix} \right]$ 是 $\boldsymbol{A} = \begin{pmatrix}a & -1 & 2 \\5 & b & 3 \\-1 & 0 & -2\end{pmatrix}$ 的特征向量，求A，并证明A的任一特征向量均能由ξ线性表出。

15.设 $\boldsymbol{A} = \begin{bmatrix} 3 & 2 & 2 \\ 2 & 3 & 2 \\ 2 & 2 & 3 \end{bmatrix}, \boldsymbol{P} = \begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 1 \\ 0 & 0 & 1 \end{bmatrix}$ $\boldsymbol{B} = \boldsymbol{P}^{-1} \boldsymbol{A}^{*} \boldsymbol{P}$ ,求 $B + 2I$ 的特征值和特征向量.

16.设 $A \sim \mathrm{diag}(4, 3, 6)$ .求 $\det(A^{2} - I)$

[page:183]

17.3阶矩阵A有特征值—1,1,2.证明: $\boldsymbol{B} = (\boldsymbol{A}^{*} + \boldsymbol{I})^{2}$ 可相似对角化，并求B的相似对角矩阵.

18.某生产线每年一月份进行熟练工与非熟练工的人数统计，然后将 $\frac{1}{6}$ 熟练工支援其他生产部门，其缺额由招收新的非熟练工补充.新、老非熟练工经培训及年终考核有 $\frac{2}{5}$ 成为熟练工.设第n年一月份统计的熟练工和非熟练工所占百分比分别为 $\mathcal{X}_{n}$和 $y_{n}$ ，记为向量 $\begin{bmatrix} x_{n} \\ y_{n} \end{bmatrix}$

(1) 求 ${x_{n + 1}\choose y_{n + 1}}$ 与 $\left[ \begin{matrix} { x _ { _ { n } } } \\ { y _ { _ { n } } } \\ \end{matrix} \right]$ 的关系并写成矩阵形式: $\begin{aligned}\begin{bmatrix}x_{n + 1} \\y_{n + 1}\end{bmatrix}= \boldsymbol{A}\begin{bmatrix}x_{n} \\y_{n}\end{bmatrix}\end{aligned}$

(2)验证 $\boldsymbol{\eta}_{1}=\left[\begin{aligned}4 \\ 1\end{aligned}\right], \boldsymbol{\eta}_{2}=\left[\begin{aligned}-1 \\ 1\end{aligned}\right]$ 是A的两个线性无关的特征向量，并求出相应的特征值；

(3) 当 $\begin{aligned}\begin{bmatrix}x_{1} \\y_{1}\end{bmatrix}&=\begin{bmatrix}\dfrac{1}{2} \\\dfrac{1}{2}\end{bmatrix}\end{aligned}$ 时，求 $\begin{aligned} { \left[ \begin{matrix} { x _ { n + 1 } } \\ { y _ { n + 1 } } \\ \end{matrix} \right] } \\ \end{aligned}$

## 思考题五

1. 命题“若 $\frac{1}{3}$ 不是矩阵A的特征值，则3I—A为可逆矩阵”是否成立？为什么？

2. 设矩阵 A~B，

(1) det A 与 det B 有何关系?

(2) A 与 B 的特征向量有何关系？

(3) $\mathrm{tr}(\boldsymbol{A})$ 与 tr(B)有何关系?

(4) $\hat{A}^{k}$ 与 $\vec{B}^{k}$ 有何关系(k为正整数)?

(5) $f(A)$ 与f(B)有何关系 $(f(x)$ 为多项式)？

3. 设A，B为n阶矩阵，在什么情况下， $A \sim B \Leftrightarrow A$ 与B有相同的特征值？

4. 能否用初等变换将A 化为与之相似的对角矩阵？

知识点注释五

综合自测题五

[page:184]

# 第六章 二次型与二次曲面

重点难点

二次型的研究与解析几何中化二次曲面的方程为标准形的问题有密切联系，其理论与方法在数学、物理学和工程中都有广泛的应用.本章着重讨论实二次型的标准形与正定性，空间曲线与曲面(特别是二次曲面)的方程与图形，最后将二次型的理论与方法用于研究二次曲面的方程.

## 6.1 实二次型及其标准形

## 一、二次型及其矩阵表示

在平面解析几何中，二次方程

$$ax^{2}+2bxy+cy^{2}=d$$

表示一条二次曲线.为了便于研究该曲线的几何性质，我们可以选择适当的角度θ，作坐标变换

$$\begin{cases}x = x^{\prime} \cos \theta - y^{\prime} \sin \theta, \\y = x^{\prime} \sin \theta + y^{\prime} \cos \theta,\end{cases}$$

将二次方程化为只含平方项的标准方程

$$a^{\prime}x^{\prime 2}+b^{\prime}y^{\prime 2}=d.$$

由 $a ^ { \prime \prime }$ 和 $b ^ { \prime }$ 的符号很快能判断出此二次曲线表示的是一个椭圆或者是双曲线.

上述二次方程的左端是一个二次齐次多项式，从代数学的观点来看，就是通过一个可逆线性变换将一个二次齐次多项式化为只含平方项的多项式.这样的问题，在许多理论问题或实际应用问题中常会遇到.现在我们把这类问题一般化，讨论n个变量的二次齐次多项式的问题.

定义1 n元二次齐次多项式

$$\begin{aligned}f(x_{1},x_{2},\cdots,x_{n}) = a_{11}x_{1}^{2} + 2a_{12}x_{1}x_{2} + \cdots + 2a_{1n}x_{1}x_{n} \\+ a_{22}x_{2}^{2} \quad + \cdots + 2a_{2n}x_{2}x_{n} \\+ \cdots\end{aligned}$$

[page:185]

$$\mp a_{mn}x_{n}^{2}$$

称为n元二次型，简称为二次型

如果二次型中的系数 $a_{ij} \in \mathbf{R}(i \leqslant j, i, j = 1, 2, \cdots, n)$ ，则称二次型f为实二次型；如果 $a_{ij} \in \mathrm{C}$ ，则称二次型f为复二次型.本章只讨论实二次型.

如果令 $a_{ij} = a_{ji} \left( i, j = 1, 2, \cdots, n \right)$ ，则二次型可记为

$$f(x_{1},x_{2},\cdots,x_{n})=a_{11}x_{1}^{2}+a_{12}x_{1}x_{2}+\cdots+a_{1n}x_{1}x_{n}+\cdots+a_{2n}x_{2}x_{n}+\cdots+a_{2n}x_{2}x_{n}+\cdots+a_{2n}x_{2}x_{n}+\cdots+a_{2n}x_{2}x_{n}+\cdots+a_{2n}x_{2}^{2}\\=\sum_{i=1}^{n}\sum_{j=1}^{n}a_{ij}x_{i}x_{j},$$

令

$$\boldsymbol{A} = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & & \vdots \\ a_{n1} & a_{n2} & \cdots & a_{nn} \end{bmatrix}, \quad \boldsymbol{X} = \begin{bmatrix} x_{1} \\ x_{2} \\ \vdots \\ x_{n} \end{bmatrix},$$

则二次型可表示为

$$f(X)=X^{\mathrm{T}}AX \quad (A^{\mathrm{T}}=A).$$

这一形式称为二次型 $f\left( x_{1},x_{2},\cdots,x_{n} \right)$ 的矩阵形式，实对称矩阵A称为二次型f(X)的矩阵.

显然，二次型与其矩阵是互相惟一确定的.以后在实二次型的矩阵表达式$f(\hat{X}) = \hat{X}^{\mathrm{T}} A \hat{X}$ 中都假定A是实对称矩阵.

二次型 $f(\boldsymbol{X}) = \boldsymbol{X}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{X}$ 的矩阵A的秩称为二次型f(X)的秩.

例如，二次型

$$\begin{aligned}f(x_{1},x_{2},x_{3}) = & 2x_{1}^{2} - x_{2}^{2} + 4x_{1}x_{2} - 6x_{1}x_{3} + x_{2}x_{3} \\= & (x_{1},x_{2},x_{3})\begin{bmatrix}2 & 2 & -3 \\2 & -1 & 1 \\-3 & \frac{1}{2} & 0\end{bmatrix}\begin{bmatrix}x_{1} \\x_{2} \\x_{3}\end{bmatrix}, \\= & (x_{1},x_{2},x_{3})\begin{bmatrix}2 & -1 & -3 \\2 & -1 & 1 \\-3 & \frac{1}{2} & 0\end{bmatrix}\begin{bmatrix}x_{1} \\x_{2} \\x_{3}\end{bmatrix},\end{aligned}$$

典型例题讲解二次型的矩阵与秩

这个二次型的矩阵是 $\boldsymbol{A} = \begin{pmatrix}2 & - 2 & - 3 \\& - 2 & - 3 \\2 & - 1 & 1 \\& & 2 \\- 3 & - \dfrac{1}{2} & 0\end{pmatrix}.$

由于 $\det A = \frac{5}{2}$ ，故A的秩为3，所以 $f(x_{1},x_{2},x_{3})$ 的秩也是3.

[page:186]

对于n元二次型 $f(x_{1},x_{2},\cdots,x_{n})$ ,变换

$$\begin{cases}x_{1} = c_{11}y_{1} + c_{12}y_{2} + \cdots + c_{1n}y_{n}, \\x_{2} = c_{21}y_{1} + c_{22}y_{2} + \cdots + c_{2n}y_{n}, \\\quad \cdots\cdots\cdots\cdots \\x_{n} = c_{n1}y_{1} + c_{n2}y_{2} + \cdots + c_{nn}y_{n}\end{cases}$$

称为从 $y_{1},y_{2},\cdots,y_{n}$ 到 $x_{1},x_{2},\cdots,x_{n}$ 的线性变换.如果线性变换的系数矩阵可逆，则称为可逆线性变换.

令 $\boldsymbol{X}=\begin{pmatrix}x_{1} \\x_{2} \\\vdots \\x_{n}\end{pmatrix},\boldsymbol{C}=\begin{pmatrix}c_{11} & c_{12} & \cdots & c_{1n} \\c_{21} & c_{22} & \cdots & c_{2n} \\\vdots & \vdots & & \vdots \\c_{n1} & c_{n2} & \cdots & c_{nn}\end{pmatrix},\boldsymbol{Y}=\begin{pmatrix}y_{1} \\y_{2} \\\vdots \\y_{n}\end{pmatrix}$ ，则线性变换可记为

$$X { = } C Y .$$

将 n元二次型 $f(X) = X^{\mathrm{T}}AX$ 作可逆线性变换 $X = cY$ ,则

$$f\left( \boldsymbol{X} \right) = \left( \boldsymbol{C}\boldsymbol{Y} \right)^{\mathrm{T}}\boldsymbol{A}\left( \boldsymbol{C}\boldsymbol{Y} \right) = \boldsymbol{Y}^{\mathrm{T}}\left( \boldsymbol{C}^{\mathrm{T}}\boldsymbol{A}\boldsymbol{C} \right)\boldsymbol{Y}.$$

令 $\boldsymbol{B} = \boldsymbol{C}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{C}$ ,则

$$f(X)=Y^{\mathrm{T}}BY=g(Y).$$

二次型 $f(X) = X^{\mathrm{T}}AX$ 通过线性变换 $X = cY$ 后变成一个新二次型 $g\left( Y \right) = Y^{\mathrm{T}} B Y$这两个二次型的系数矩阵A与B的关系是

$$B = C^{\mathrm{T}} A C.$$

定义2 设A，B为n阶方阵，如果存在可逆矩阵C，使得

$$\boldsymbol{B} = \boldsymbol{C}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{C},$$

则称A与B合同.

矩阵之间的合同关系具有以下性质:

$1 ^ { \circ }$ 反身性 任何n阶矩阵A都与自身合同；

$2 ^ { \circ }$ 对称性 如果A与B合同，则B与A合同；

$3^{\circ}$ 传递性 如果A与B合同且B与C合同，则A与C合同.

这些性质的证明留给读者.

可逆线性变换 $X = cY$ 把二次型 $f(X) = X^{\mathrm{T}}AX$ 变为二次型 $g\left( Y \right) = Y^{\mathrm{T}} B Y$ ，这两个二次型的矩阵A与B合同，即 $B = C^{\mathrm{T}} A C$ ，故A与B的秩相同.因此 $f(X)$ 与 $g\left(Y\right)$ 的秩相同.所以可逆线性变换不改变二次型的秩.

例1 设矩阵 $\boldsymbol{A} = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}, \boldsymbol{B} = \begin{bmatrix} -2 & 0 \\ 0 & 1 \end{bmatrix}$ ，求实可逆矩阵C，使 $C^{\mathrm{T}}AC = B$

解 矩阵A对应的二次型是

$$f\left(x_{1}, x_{2}\right)=\boldsymbol{X}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{X}=x_{1}^{2}-x_{2}^{2}$$

[page:187]

矩阵B对应的二次型是

$$g\left( y_{1},y_{2} \right) = \boldsymbol{Y}^{\mathrm{T}}\boldsymbol{B}\boldsymbol{Y} = - 2y_{1}^{2} + y_{2}^{2}.$$

作可逆线性变换

$$\begin{cases}x_{1} = 0y_{1} + y_{2}, \\x_{2} = \sqrt{2}y_{1} + 0y_{2},\end{cases}$$

即令矩阵

$$\boldsymbol{C} = \begin{bmatrix} 0 & 1 \\ \sqrt{2} & 0 \end{bmatrix}, \quad \boldsymbol{X} = \begin{bmatrix} x_{1} \\ x_{2} \end{bmatrix}, \quad \boldsymbol{Y} = \begin{bmatrix} y_{1} \\ y_{2} \end{bmatrix},$$

且 $X = C Y$ ,则 $f(x_{1},x_{2})$ 与 $g(y_1, y_2)$ 的矩阵之间的关系为: $C^{\mathrm{T}}AC = B$

## 二、用配方法化二次型为标准形

在各种二次型中，平方和形式

$$d_{1}y_{1}^{2}+d_{2}y_{2}^{2}+\cdots+d_{n}y_{n}^{2}$$

无疑是最简单的.下面我们将介绍，任何一个二次型 $f(X) = X^{\mathrm{T}}AX$ 都可以通过可逆线性变换 $X = cY$ 化为平方和形式，这种平方和形式的二次型称为标准形.

定理1任何一个二次型都可以通过可逆线性变换化为标准形

利用配方法和对变量个数n使用归纳法可证明这个定理(证明从略).下面通过具体例子说明怎样用配方法化二次型为标准形.

例2用配方法化二次型 $f\left(x_{1},x_{2},x_{3}\right)=x_{1}^{2}+2x_{2}^{2}+5x_{3}^{2}+2x_{1}x_{2}+2x_{1}x_{3}+$ $6 x _ { 2 } x _ { 3 }$ 为标准形.

解

$$f\left(x_{1}, x_{2}, x_{3}\right)=\left(x_{1}^{2}+x_{2}^{2}+x_{3}^{2}+2 x_{1} x_{2}+2 x_{1} x_{3}+2 x_{2} x_{3}\right)+x_{2}^{2}+ \cdots + \left(x_{1}^{2}+x_{2}^{2}+x_{3}^{2}\right)^{2}+\cdots$$

作线性变换

典型例题讲解配方法化二次型为标准形

$$\begin{cases}y_{1} = x_{1} + x_{2} + x_{3}, \\y_{2} = \quad x_{2} + 2x_{3}, \\y_{3} = \quad x_{3},\end{cases}$$

则 $f(x_{1},x_{2},x_{3})$ 的标准形为

$$f = y_{1}^{2} + y_{2}^{2}.$$

如果用 $y_{1},y_{2},y_{3}$ 表示 $x_{1},x_{2},x_{3}$ ，则上述线性变换又可表示为

$$\begin{cases}x_{1} = y_{1} - y_{2} + y_{3}, \\x_{2} = \quad y_{2} - 2y_{3}, \\x_{3} = \quad y_{3},\end{cases}$$

[page:188]

记

$$\begin{aligned}\boldsymbol{Y} &= \begin{bmatrix} y_{1} \\ y_{2} \\ y_{3} \end{bmatrix}, \quad\boldsymbol{C} = \begin{bmatrix} 1 & -1 & 1 \\ 0 & 1 & -2 \\ 0 & 0 & 1 \end{bmatrix}, \quad\boldsymbol{X} = \begin{bmatrix} x_{1} \\ x_{2} \\ x_{3} \end{bmatrix},\end{aligned}$$

则上式又可记为 $X = cY$ ，即二次型 $f(x_{1},x_{2},x_{3})$ 通过可逆线性变换 $X = cY$ 变为标准形 $f = y_{1}^{2} + y_{2}^{2}$

例3用配方法化二次型 $f(x_{1},x_{2},x_{3})=2x_{1}x_{2}+2x_{1}x_{3}-6x_{2}x_{3}$ 为标准形.

解 作线性变换

$$\begin{cases}x_{1} = y_{1} + y_{2} \\x_{2} = y_{1} - y_{2} \\x_{3} = \quad y_{3}\end{cases}$$

则

$$\begin{aligned} f(x_{1},x_{2},x_{3})&=2(y_{1}+y_{2})(y_{1}-y_{2})+2(y_{1}+y_{2})y_{3}-6(y_{1}-y_{2})y_{3}\\&=2y_{1}^{2}-2y_{2}^{2}-4y_{1}y_{3}+8y_{2}y_{3}\\&=2(y_{1}^{2}+y_{3}^{2}-2y_{1}y_{3})-2y_{2}^{2}-2y_{3}^{2}+8y_{2}y_{3}\\&=2(y_{1}-y_{3})^{2}-2(y_{2}^{2}+4y_{3}^{2}-4y_{2}y_{3})+6y_{3}^{2}\\&=2(y_{1}-y_{3})^{2}-2(y_{2}-2y_{3})^{2}+6y_{3}^{2},\\ \end{aligned}$$

再作线性变换

$$\begin{cases}z_{1} = y_{1} - y_{3}, \\z_{2} = \quad y_{2} - 2y_{3}, \\z_{3} = \quad y_{3},\end{cases}$$

则

$$f = 2z_{1}^{2} - 2z_{2}^{2} + 6z_{3}^{2}.\tag{6.1}$$

如果再令

则

$$\begin{cases}t_{1} = \sqrt{2}z_{1}, \\t_{2} = \sqrt{6}z_{3}, \\t_{3} = \sqrt{2}z_{2}.\end{cases}$$

$$\hat { f } = t _ { 1 } ^ { 2 } + t _ { 2 } ^ { 2 } - t _ { 3 } ^ { 2 }\tag{6.2}$$

式(6.1)与式(6.2)所表示的二次型都是 $f(x_{1},x_{2},x_{3})$ 的标准形.由此可见，一个二次型的标准形不是惟一的.式(6.2)这样的标准形称为规范形.

n元二次型的规范形的一般形式为

$$y_{1}^{2}+\cdots+y_{p}^{2}-y_{p+1}^{2}-\cdots-y_{r}^{2}\quad(r\leqslant n).$$

定理2任何一个二次型的规范形是惟一的.

我们将这个定理的证明思路叙述如下:

[page:189]

二次型 $f(X) = X^{\mathrm{T}}AX$ 可以通过可逆线性变换化为标准形.经过适当的调整，将正项集中在前面，负项集中在后面，表示为如下形式:

$$f(X)=d_{1}y_{1}^{2}+\cdots+d_{p}y_{p}^{2}-d_{p+1}y_{p+1}^{2}-\cdots-d_{r}y_{r}^{2},$$

其中 $r \leqslant n,d_{i} > 0(i = 1,2,\cdots,r)$

再令

$$z_{i} = \sqrt{d_{i}} y_{i} \quad (i = 1, 2, \cdots, r),$$

则

$$f(X)=z_{1}^{2}+\cdots+z_{p}^{2}-z_{p+1}^{2}-\cdots-z_{r}^{2}.$$

由于可逆线性变换不改变二次型的秩，故标准形中系数不为零的平方项的项数r是惟一确定的.在理论上还可以进一步证明，标准形中正项项数 $\hat { P }$ 与负项项数 $r = p$也是惟一确定的，故任一二次型的规范形是惟一的.

二次型的标准形中，正项项数 $\hat { p }$ 称为正惯性指数，负项项数 $r - p$ 称为负惯性指数，而正负惯性指数的差 $2 p - r$ 称为符号差.

可逆线性变换不改变二次型的秩与正负惯性指数，而秩与惯性指数在标准形中都是一目了然的，这正是我们要用可逆线性变换化二次型为标准形的目的之一.

例4设二次型

$$f\left(x_{1},x_{2},x_{3}\right)=x_{1}^{2}+ax_{2}^{2}+x_{3}^{2}+2x_{1}x_{2}-2x_{2}x_{3}-2ax_{1}x_{3}$$

的正负惯性指数都是1，求 $f(x_{1},x_{2},x_{3})$ 的规范形及常数 $\alpha$

解 $f(x_{1},x_{2},x_{3})$ 的规范形为

$$y_{1}^{2}-y_{2}^{2}.$$

因为 $f(x_{1},x_{2},x_{3})$ 的正负惯性指数都是1，所以 $f(x_{1},x_{2},x_{3})$ 的秩为2，其矩阵A 的秩也为2.

$$\boldsymbol{A} = \begin{bmatrix} 1 & 1 & - a \\ 1 & a & - 1 \\ - a & - 1 & 1 \end{bmatrix}.$$

由 $R(A)=2$ 可知:

$$\det A = \begin{vmatrix} 1 & 1 & - a \\ 1 & a & - 1 \\ - a & - 1 & 1 \end{vmatrix} = - (a - 1)^{2}(a + 2) = 0.$$

解得a=1或 $a = - 2$

若a=1则 $R(A)=1$ ,与 $R(A)=2$ 矛盾，所以 $a = - 2$

## 三、用正交变换化二次型为标准形

如果线性变换 $X = cY$ 中的系数矩阵C是正交矩阵，则称这个线性变换为正交变换.

[page:190]

对n维实向量 $\boldsymbol{\alpha} = (a_{1}, a_{2}, \cdots, a_{n})^{\mathrm{T}}, \boldsymbol{\beta} = (b_{1}, b_{2}, \cdots, b_{n})^{\mathrm{T}}$ ，设A为n阶正交矩阵，作正交变换

$$\bar { X } = A \alpha , \quad \bar { Y } = A \beta ,$$

则

$$\left( \boldsymbol{X}, \boldsymbol{Y} \right) = \left( \boldsymbol{A}\boldsymbol{\alpha}, \boldsymbol{A}\boldsymbol{\beta} \right) = \left( \boldsymbol{A}\boldsymbol{\alpha} \right)^{\top}\left( \boldsymbol{A}\boldsymbol{\beta} \right) = \boldsymbol{\alpha}^{\top}\boldsymbol{A}^{\top}\boldsymbol{A}\boldsymbol{\beta} = \boldsymbol{\alpha}^{\top}\boldsymbol{\beta} = \left( \boldsymbol{\alpha}, \boldsymbol{\beta} \right).$$

即正交变换保持向量内积不变，因此也就保持向量的长度与夹角不变.于是，在正交变换下，几何图形的形状不会发生改变.而这个特征是一般可逆线性变换所不具备的，这也是我们着重讨论正交变换的目的之一.

设 $f(X) = X^{\mathrm{T}}AX$ 是实二次型，则A为实对称矩阵，由δ5.4定理3可知，存在正交矩阵C，使 $\boldsymbol{C}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{C}=\operatorname{diag}\left(\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}\right)$ ,其中 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}$ 是A的全部特征值

作正交变换 $X = C Y$ ,则

$$f\left( \boldsymbol{X} \right) = \boldsymbol{Y}^{\mathrm{T}} \boldsymbol{C}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{C} \boldsymbol{Y} = \lambda_{1} y_{1}^{2} + \lambda_{2} y_{2}^{2} + \cdots + \lambda_{n} y_{n}^{2}.$$

于是，我们已经证明了如下定理:

定理3任何一个实二次型都可以通过正交变换化为标准形.

由以上推导可知，用正交变换 $X = C Y$ 化二次型 $f\left(X\right)=X^{\mathrm{T}}AX$ 为标准形的主要工作，在于求正交矩阵C，使 $\boldsymbol{C}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{C}=\operatorname{diag}\left(\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}\right)$ .这项工作在第五章中已经做了详细的讨论.

用正交变换化二次型 $f(\boldsymbol{X}) = \boldsymbol{X}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{X}$ 为标准形，平方项的系数刚好是矩阵A的全部特征值，如果不计特征值的排列顺序，则这样的标准形是惟一的.

例5用正交变换化二次型

$$f(x_{1},x_{2},x_{3})=x_{1}^{2}-2x_{2}^{2}-2x_{3}^{2}-4x_{1}x_{2}+4x_{1}x_{3}+8x_{2}x_{3}$$

为标准形.

典型例题讲解正交变换化二次型为标准形

解 $f(x_{1},x_{2},x_{3})$ 的矩阵为

$$\boldsymbol{A} = \begin{bmatrix} - 1 & - 2 & 2 \\ - 2 & - 2 & 4 \\ 2 & 4 & - 2 \end{bmatrix},$$

$$\det(\lambda \boldsymbol{I} - \boldsymbol{A}) = \left| \begin{matrix} \lambda - 1 & 2 & - 2 \\ 2 & \lambda + 2 & - 4 \\ - 2 & - 4 & \lambda + 2 \end{matrix} \right| = (\lambda - 2)^{2}(\lambda + 7)$$

特征值 $\lambda_{1} = 2  (  2$ 重） $\lambda_{2} = - 7$

对于 $\lambda_{1} = 2$ ，线性方程组 $( \lambda _ { 1 } \boldsymbol { I } - \boldsymbol { A } ) \boldsymbol { X } = \boldsymbol { 0 }$ 的基础解系为 $\boldsymbol{\alpha}_{1} = (-2,1,0)^{\mathrm{T}}, \boldsymbol{\alpha}_{2} =$ $(2,0,1)^{\mathrm{T}}$ .将 $\alpha_{1},\alpha_{2}$ 正交化:

$$\boldsymbol{\beta}_{1}=\boldsymbol{\alpha}_{1}=(-2,1,0)^{\mathrm{T}},$$

$$\boldsymbol { \beta } _ { 2 } = \boldsymbol { \alpha } _ { 2 } - \frac { \left( \boldsymbol { \alpha } _ { 2 } , \boldsymbol { \beta } _ { 1 } \right) } { \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 1 } \right) } \boldsymbol { \beta } _ { 1 } = \left( \frac { 2 } { 5 } , \frac { 4 } { 5 } , 1 \right) ^ { \mathrm { T } } = \frac { 1 } { 5 } \left( 2 , 4 , 5 \right) ^ { \mathrm { T } } ,$$

再将 $\beta_{1} \cdot \beta_{2}$ 单位化:

[page:191]

$$\boldsymbol{\gamma}_{1}=\frac{1}{\left\|\boldsymbol{\beta}_{1}\right\|} \boldsymbol{\beta}_{1}=\frac{1}{\sqrt{5}}(-2,1,0)^{\mathrm{T}},$$

$$\gamma_{2}=\frac{1}{\left \| \boldsymbol{\beta}_{2} \right \| }\boldsymbol{\beta}_{2}=\frac{1}{3\sqrt{5}}(2,4,5)^{\mathrm{T}}.$$

对于 $\lambda_{2} = \pi$ ，线性方程组 $\left( \lambda _ { 2 } \boldsymbol { I } - \boldsymbol { A } \right) \boldsymbol { X } = \boldsymbol { 0 }$ 的基础解系为 $\boldsymbol{\alpha}_{3} = (1, 2, -2)^{\mathrm{T}}$ ,将 $\alpha _ { 3 }$单位化:

$$\boldsymbol{Y}_{3}=\frac{1}{3}(1,2,-2)^{\mathrm{T}}.$$

令

$$\begin{aligned}\boldsymbol{X} &= \begin{bmatrix}x_{1} \\x_{2} \\x_{3}\end{bmatrix}, &\boldsymbol{C} &= \begin{bmatrix}-\dfrac{2}{\sqrt{5}} & \dfrac{2}{3\sqrt{5}} & \dfrac{1}{3} \\\dfrac{1}{\sqrt{5}} & \dfrac{4}{3\sqrt{5}} & \dfrac{2}{3} \\0 & \dfrac{5}{3\sqrt{5}} & -\dfrac{2}{3}\end{bmatrix}, &\boldsymbol{Y} &= \begin{bmatrix}y_{1} \\y_{2} \\y_{3}\end{bmatrix},\end{aligned}$$

则X=CY是正交变换，且 $f\left(x_{1},x_{2},x_{3}\right)=2y_{1}^{2}+2y_{2}^{2}-7y_{3}^{2}$

1. 写出二次型 $f(x_{1},x_{2},x_{3})=\sum_{i = 1}^{3}(a_{i1}x_{1}+a_{i2}x_{2}+a_{i3}x_{3})^{2}$ 的矩阵.

2. 用配方法化二次型为标准形:

(1) $x_{1}^{2}+4x_{1}x_{2}-3x_{2}x_{3}$

$$x_{1}^{2}+x_{2}^{2}+x_{3}^{2}+x_{4}^{2}+2x_{1}x_{2}+2x_{2}x_{3}+2x_{3}x_{4}$$

(3) $2x_{1}x_{2}+2x_{1}x_{3}-6x_{2}x_{3}$

3. 确定下面二次型的秩与符号差:

$$x_{1}x_{2n} + x_{2}x_{2n - 1} + \cdots + x_{n}x_{n + 1}$$

4.用正交变换化二次型为标准形:

$$3x_{1}^{2}+3x_{3}^{2}+4x_{1}x_{2}+8x_{1}x_{3}+4x_{2}x_{3}; \quad (2) x_{1}^{2}+x_{2}^{2}-x_{3}^{2}+4x_{1}x_{2}+4x_{2}x_{3}.$$

5. 已知二次型

$$f\left(x_{1},x_{2},x_{3}\right)=2x_{1}^{2}+3x_{2}^{2}+3x_{3}^{2}+2ax_{2}x_{3}\quad(a>0)$$

通过正交变换化为标准形 $f = y_{1}^{2} + 2y_{2}^{2} + 5y_{3}^{2}$ ，求参数a及所用的正交变换矩阵C. 6. 设n元二次型 $f = \boldsymbol{X}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{X}, \boldsymbol{A}$ 的特征值 $\lambda_{1} \leqslant \lambda_{2} \leqslant \cdots \leqslant \lambda_{n}$ ，证明:对任意n维实向量X，

$$\lambda_{1} \bar{X}^{\mathrm{T}} \bar{X} \leqslant \bar{X}^{\mathrm{T}} A \bar{X} \leqslant \lambda_{n} \bar{X}^{\mathrm{T}} \bar{X}.$$

7. 设A是对称矩阵，且对任意n维向量X，均有 $\hat{X}^{\top}AX = 0$ ，证明 $:A = O$

8. 证明:若A，B均为三阶实对称矩阵，且对一切X有 $X^{\top}AX = X^{\top}BX$ ,则 $A = B$

[page:192]

9.设C为可逆矩阵， $\boldsymbol{C}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{C}=\operatorname{diag}\left(d_{1}, d_{2}, \cdots, d_{n}\right)$ ，问:对角矩阵的对角元是否一定是A的特征值？若成立，证明之，若不成立，举出反例.

10. 设 n 阶实对称矩阵 A 的秩为 $r \left( r < n \right)$ ，证明:存在可逆矩阵C，使得 $C^{\mathrm{T}}AC =$ $\mathrm{diag}(d_1, d_2, \cdots, d_r, 0, \cdots, 0)$ .其中 $d_{i} \neq 0 \left( i = 1,2,\cdots,r \right)$

## 6.2 正定二次型

二次型

$$f(x_{1},x_{2},\cdots,x_{n})=x_{1}^{2}+x_{2}^{2}+\cdots+x_{n}^{2}\tag{6.3}$$

具有如下特性:对任意一组不全为零的实数 $a_{1},a_{2},\cdots,a_{n}$ ,都有

$$f(a_{1},a_{2},\cdots,a_{n})=a_{1}^{2}+a_{2}^{2}+\cdots+a_{n}^{2}>0.$$

而二次型

$$g\left(x_{1}, x_{2}, \cdots, x_{n}\right)=x_{1}^{2}+\cdots+x_{p}^{2}-x_{p+1}^{2}-\cdots-x_{n}^{2}$$

则不具备这样的性质.

定义1如果任一非零实向量X，都使二次型 $f(X)=X^{\mathrm{T}}AX>0$ ，则称f(X)为正定二次型，f(X)的矩阵A称为正定矩阵.

重难点分析正定二次型的概念

换句话说，如果任意一组不全为零的实数 $a_{1},a_{2},\cdots,a_{n}$ ，都使 $f(a_{1},a_{2},\cdots,a_{n})>$ 0，则二次型 $f(x_{1},x_{2},\cdots,x_{n})$ 是正定二次型.例如，式(6.3)所示的二次型就是正定二次型.对于一般的二次型，下面的定理可以判断它是否正定.

定理1 二次型 $f(X) = X^{\mathrm{T}}AX$ 为正定二次型的充分必要条件是对称矩阵A的特征值全为正数.

证设A的特征值为 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}$ ，则通过正交变换X=CY可将f(X)化为

$$f(X)=\lambda_{1}y_{1}^{2}+\lambda_{2}y_{2}^{2}+\cdots+\lambda_{n}y_{n}^{2}=g(Y).$$

重难点分析正定二次型判定定理

充分性:若 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}$ 全为正数，则对任一非零实向量 $Y \neq 0$ ,均有 $g(Y) > 0$ 故对任一非零实向量X，可得非零实向量 $\hat{Y} \equiv C^{-1} \hat{X}$ ,使

$$f\left(X\right)=g\left(Y\right)>0,$$

故f(X)是正定二次型.

必要性:用反证法.设A的某个特征值 $\lambda_{i} \leqslant 0$ ,不妨设 $\lambda_{1} \leqslant 0$ ，则对于

$$\boldsymbol{Y} = (1, 0, \cdots, 0)^{\mathrm{T}},$$

有 $X = C Y \neq 0$ ，而

$$f\left(X\right)=g\left(Y\right)=\lambda_{1}\leqslant0,$$

这与f(X)是正定二次型矛盾，故 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}$ 全为正数.

由此可得:

推论1 二次型 $f(X) = X^{\mathrm{T}}AX$ 是正定二次型的充分必要条件是f(X)的正惯性

[page:193]

指数为n.

事实上，二次型f(X)通过正交变换可化为标准形

$$\lambda _ { 1 } y _ { 1 } ^ { 2 } + \lambda _ { 2 } y _ { 2 } ^ { 2 } + \cdots + \lambda _ { n } y _ { n } ^ { 2 } ,$$

于是，由定理1可得推论1.

由于可逆线性变换不改变二次型的正负惯性指数，所以可逆线性变换也不会改变二次型的正定性.

如果n元二次型 $f(X) = X^{\mathrm{T}}AX$ 的正惯性指数为n，则其规范形为

$$g\left( \boldsymbol{Y} \right) = y_{1}^{2} + y_{2}^{2} + \cdots + y_{n}^{2} = \boldsymbol{Y}^{\mathrm{T}} \boldsymbol{I} \boldsymbol{Y},\tag{6.4}$$

故A与I合同.

反之，如果A与I合同，则f(X)的规范形必然是式(6.4).于是可得

推论2 二次型 $f(X) = X^{\mathrm{T}}AX$ 是正定二次型的充分必要条件是对称矩阵A与单位矩阵I合同.

有时需要直接从二次型 $f(X) = X^{\mathrm{T}}AX$ 的矩阵A判断f(X)是否为正定二次型.为此，我们先引入顺序主子式的概念.

定义2对于n阶矩阵 $A = \left( a_{ij} \right)_{n \times n}$ ,子式

$$\boldsymbol{P}_{k}=\left|\begin{matrix}a_{11} & a_{12} & \cdots & a_{1 k} \\a_{21} & a_{22} & \cdots & a_{2 k} \\\vdots & \vdots & & \vdots \\a_{k 1} & a_{k 2} & \cdots & a_{k k}\end{matrix}\right| \quad(k=1,2, \cdots, n)$$

称为A的顺序主子式.

有了这个概念，我们不加证明地给出下面的定理:

定理2 二次型 $f(X) = X^{\mathrm{T}}AX$ 是正定二次型的充分必要条件是对称矩阵A的所有顺序主子式全大于零.

例1 二次型 $f\left(x_{1},x_{2},x_{3}\right)=x_{1}^{2}+4x_{2}^{2}+4x_{3}^{2}+2tx_{1}x_{2}-2x_{1}x_{3}+4x_{2}x_{3}$ ,当t取何值时，f为正定二次型？

解 f 的矩阵为 $\boldsymbol{A} = \begin{pmatrix}1 & t & -1 \\t & 4 & 2 \\-1 & 2 & 4\end{pmatrix}$ ,A的顺序主子式为

$$P_{1}=1,\quad P_{2}=\begin{vmatrix}1&t\\t&4\end{vmatrix}=4-t^{2}$$

$$\boldsymbol{P}_{3}=\begin{vmatrix}1&t&-1\\t&4&2\\-1&2&4\end{vmatrix}=-4t^{2}-4t+8=-4(t-1)(t+2).$$

由于 $P_{1} = 1 > 0$ ，故f正定的充分必要条件是 $P_{2} > 0$ 且 $P_{3} > 0$ ,即

$$\begin{cases}4 - t^{2} > 0, \\- 4(t - 1)(t + 2) > 0,\end{cases}$$

[page:194]

解得一 $2 < t < 1$ .故当 $-2 < t < 1$ 时，f正定.

因为正定二次型 $f(X) = X^{\mathrm{T}}AX$ 的矩阵A称为正定矩阵，所以 $f(X)$ 正定的充要条件是A为正定矩阵.与二次型的正定性判断相平行，可得下面的结论:

定理3对于实对称矩阵A，下列命题等价:

$1 ^ { \circ }$ A是正定矩阵；

$2 ^ { \circ }$ A的特征值全为正数；

$3 ^ { \circ }$ A 与单位矩阵I合同；

$4 ^ { \circ }$ A的顺序主子式全大于零.

例2 证明:正定矩阵A的逆矩阵 $A^{-1}$ 也是正定矩阵.

由于我们定义的正定矩阵A首先是一个实对称矩阵，而 $\left( \boldsymbol{A}^{-1} \right)^{\mathrm{T}} = \left( \boldsymbol{A}^{\mathrm{T}} \right)^{-1} = \boldsymbol{A}^{-1}$故 $A^{-1}$ 也是一个实对称矩阵.

下面我们用三种不同的方法来证明这个 $A^{-1}$ 是正定矩阵.

证一因为A是正定矩阵，所以A的特征值 $\lambda_{1}, \lambda_{2}, \cdots, \lambda_{n}$ 全为正数，且存在正交矩阵C，使 $C^{-1}AC =  diag (\lambda_1, \lambda_2, \cdots, \lambda_n)$ ，于是

$$\boldsymbol{C}^{-1} \boldsymbol{A}^{-1} \boldsymbol{C} = (\boldsymbol{C}^{-1} \boldsymbol{A} \boldsymbol{C})^{-1} = \mathrm{diag} \left( \frac{1}{\lambda_1}, \frac{1}{\lambda_2}, \cdots, \frac{1}{\lambda_n} \right),$$

所以 $A^{-1}$ 的特征值 $\frac{1}{\lambda_{1}}, \frac{1}{\lambda_{2}}, \cdots, \frac{1}{\lambda_{n}}$ 全为正数，故 $A = 1$ 为正定矩阵.

证二由于A是正定矩阵，所以A与单位矩阵I合同，即存在可逆矩阵P，使

$$\tilde { A } = P ^ { \top } I P = P ^ { \top } P ,$$

所以

$$\boldsymbol{A}^{-1}=(\boldsymbol{P}^{\mathrm{T}}\boldsymbol{P})^{-1}=\boldsymbol{P}^{-1}(\boldsymbol{P}^{\mathrm{T}})^{-1}=\boldsymbol{P}^{-1}(\boldsymbol{P}^{-1})^{\mathrm{T}}=\boldsymbol{P}^{-1}\boldsymbol{I}(\boldsymbol{P}^{-1})^{\mathrm{T}},$$

于是 $,A^{-1}$ 与单位矩阵1合同.

证三设 $f(\boldsymbol{X}) = \boldsymbol{X}^{\mathrm{T}} \boldsymbol{A}^{-1} \boldsymbol{X}$ ，作可逆线性变换 $X = A Y$ ,得

$$\bar { X } ^ { \mathrm { T } } A ^ { - 1 } \bar { X } = \bar { Y } ^ { \mathrm { T } } A ^ { \mathrm { T } } A ^ { - 1 } A Y = Y ^ { \mathrm { T } } A Y ,$$

可逆线性变换不改变二次型的正定性，而 $Y^{\top} A Y$ 是正定二次型，故 $\widetilde { X } ^ { \top } A ^ { - \top } X$ 也是正定二次型，因此矩阵 $A^{-1}$ 是正定矩阵.

与正定二次型相对应，我们还可以讨论负定二次型，半正定二次型，半负定二次型.

定义3 对于二次型 $f(X) = X^{\top}AX$ 及任一非零实向量X，

$1 ^ { \circ }$ 如果 $f(X) = X^{\mathrm{T}}AX < 0$ ，则称f(X)是负定二次型；

$2 ^ { \circ }$ 如果 $f(X)=X^{\mathrm{T}}AX\geqslant0$ ,则称 $f(X)$ 是半正定二次型；

$3 ^ { \circ }$ 如果 $f(X) = X^{\mathrm{T}}AX \leqslant 0$ ,则称 $f(X)$ 是半负定二次型；

$4 ^ { \circ }$ 不是正定、半正定、负定、半负定的二次型称为不定二次型

与正定二次型的判断相对应，有下面的结论:

定理4 对于二次型 $f(X) = X^{\mathrm{T}}AX$ ，下列命题等价:

$1^{\circ} \quad f(X)$ 为负定二次型；

$2^{\circ} \quad f(X)$ 的特征值全为负数；

[page:195]

$3^{\circ} \quad f(X)$ 的负惯性指数为n;

$4^{\circ} \quad f(X)$ 的矩阵A的顺序主子式满足 $( - 1 ) ^ { k } P _ { k } > 0 \quad ( k = 1 , 2 , \cdots , n )$

事实上，由正定二次型与负定二次型的定义可知， $f\left(X\right)=X^{\mathrm{T}}AX$ 为负定二次型的充要条件是 $-f(X)=-X^{\mathrm{T}}AX$ 为正定二次型.

值得注意的是 $f(X) = X^{\mathrm{T}}AX$ 是负定二次型的充要条件不是顺序主子式全小于零，而是按照子式阶数的奇偶性呈现出奇负偶正的特点

例3判断二次型 $f\left(x_{1},x_{2},x_{3}\right)=-5x_{1}^{2}-6x_{2}^{2}-4x_{3}^{2}+4x_{1}x_{2}+4x_{1}x_{3}$ 是否为负定二次型.

解f的矩阵为

$$\boldsymbol{A} = \begin{bmatrix} - 5 & 2 & 2 \\ 2 & - 6 & 0 \\ 2 & 0 & - 4 \end{bmatrix}.$$

因为

$$(-1)P_{1}=-|-5|>0,$$

$$( - 1 ) ^ { 2 } P _ { 2 } = \left| \begin{matrix} - 5 & 2 \\ 2 & - 6 \end{matrix} \right| = 2 6 > 0,$$

$$( - 1 ) ^ { 3 } P _ { 3 } = - \left| \begin{matrix} - 5 & 2 & 2 \\ 2 & - 6 & 0 \\ 2 & 0 & - 4 \end{matrix} \right| = 8 0 > 0 ,$$

所以f是负定二次型.

例4设矩阵 $\boldsymbol{A} = \begin{bmatrix} 1 & 0 & 1 \\ 0 & 2 & 0 \\ 1 & 0 & 1 \end{bmatrix}, \boldsymbol{B} = (k\boldsymbol{I} + \boldsymbol{A})^2$ .求对角矩阵Λ，使 $B \sim \Lambda$ ，并确定k为何值时，B为正定矩阵.

解

$$\det(\lambda \boldsymbol{I} - \boldsymbol{A}) = \left| \begin{matrix} \lambda - 1 & 0 & - 1 \\ 0 & \lambda - 2 & 0 \\ - 1 & 0 & \lambda - 1 \end{matrix} \right| = \lambda(\lambda - 2)^{2}.$$

A的特征值为 $\lambda_{1} = 2 \left( 2 \right.$ 重） $\lambda_{2} = 0$ .因为A为实对称矩阵，故存在正交矩阵P，使

$$\boldsymbol{P}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{P}=\boldsymbol{D}=\begin{bmatrix}2 & 0 & 0 \\0 & 2 & 0 \\0 & 0 & 0\end{bmatrix}$$

$$\boldsymbol{A} = (\boldsymbol{P}^{\mathrm{T}})^{-1} \boldsymbol{D} \boldsymbol{P}^{-1} = \boldsymbol{P} \boldsymbol{D} \boldsymbol{P}^{\mathrm{T}},$$

于是

$$\boldsymbol{B}=(k \boldsymbol{I}+\boldsymbol{A})^{2}=(k \boldsymbol{P} \boldsymbol{P}^{\mathrm{T}}+\boldsymbol{P} \boldsymbol{D} \boldsymbol{P}^{\mathrm{T}})^{2} \\=[\boldsymbol{P}(k \boldsymbol{I}+\boldsymbol{D}) \boldsymbol{P}^{\mathrm{T}}][\boldsymbol{P}(k \boldsymbol{I}+\boldsymbol{D}) \boldsymbol{P}^{\mathrm{T}}] \\=\boldsymbol{P}(k \boldsymbol{I}+\boldsymbol{D})^{2} \boldsymbol{P}^{\mathrm{T}}$$

[page:196]

$$\boldsymbol{P}^{\left ( k+2 \right ) ^{2} }\left ( k+2 \right ) ^{2}\left [ \begin{matrix} \boldsymbol{P}^{\mathrm{T}} \\ & \left ( k+2 \right )^{2} \\ & & \left [ k^{2} \right ] \end{matrix} \right ] \boldsymbol{P}^{\mathrm{T}}.$$

令 $\boldsymbol{A} = \begin{pmatrix}(k + 2)^{2} &  &  \\& (k + 2)^{2} &  \\&  & k^{2}\end{pmatrix}$ ,则 $B \sim A$

由此可知，当 $k \ne - 2$ 且 $k \neq 0$ 时，B的特征值全为正实数，此时B为正定矩阵.

## 习题6.2

1. 下列二次型是否为正定二次型？

(1) $5x_{1}^{2}+x_{2}^{2}+5x_{3}^{2}+4x_{1}x_{2}-8x_{1}x_{3}-4x_{2}x_{3}$

(2) $-5x_{1}^{2}-6x_{2}^{2}-4x_{3}^{2}+4x_{1}x_{2}+4x_{1}x_{3};$

(3) $2x_{1}^{2}+5x_{2}^{2}+4x_{3}^{2}+4x_{1}x_{2}-4x_{1}x_{3}-8x_{2}x_{3}.$

2. 证明:实对称矩阵A负定的充要条件是存在可逆矩阵C，使 $A = - C^{\mathrm{T}} C$

3. 设A是正定矩阵，C是可逆矩阵，证明 $:C^{\mathrm{T}}AC$ 是正定矩阵.

4. 证明:若A，B 是n阶正定矩阵，则 $k A + l B$ 也是正定矩阵(其中 $k \geqslant 0, l \geqslant 0, k + l >$ 0).

5. 设A是正定矩阵，证明 $A^{*}$ 也是正定矩阵.

6. t取何值时，下列二次型是正定二次型？

(1) $x_{1}^{2}+x_{2}^{2}+5x_{3}^{2}+2tx_{1}x_{2}-2x_{1}x_{3}+4x_{2}x_{3};$

(2) $x_{1}^{2}+4x_{2}^{2}+x_{3}^{2}+2tx_{1}x_{2}+10x_{1}x_{3}+6x_{2}x_{3}.$

7. 证明:如果 $A = \left( a_{ij} \right)_{n \times n}$ 是正定矩阵，则 $a_{ii} > 0 (i = 1,2,\cdots,n)$ ;如果 $A = \left( a_{ij} \right)_{n \times n}$ 是负定矩阵，则 $a_{ii} < 0 (i = 1,2,\cdots,n)$

8. 对于 n 元二次型 $X^{\mathrm{T}} A X$ ，证明:

(1) $X^{\mathrm{T}}AX$ 是半正定二次型的充要条件是 $X^{\mathrm{T}}AX$ 的正惯性指数与秩相等，且秩小于n；

(2) $\boldsymbol{X}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{X}$ 是半负定二次型的充要条件是 $X^{\mathrm{T}}AX$ 的负惯性指数与秩相等，且秩小于n.

9. 设A是n阶正定矩阵，I是n阶单位矩阵，证明: $\det(A + I) > 1$

10.证明:若A是n阶正定矩阵，则存在正定矩阵B，使得 $A = B^{2}$

11. 设A 是n阶实对称矩阵，且 $A^{2}=A,R(A)=r(0<r<n)$

(1) 证明 $; A + I$ 是正定矩阵；

(2) 计算: $\det(I + A + \cdots + A^k)$

## 3曲面与空间曲线

前面我们研究了二次型，本节开始研究在空间 $\bar{\mathbf{R}}^3$ 中三元二次方程表示什么曲面，最后利用二次型有关理论对三元二次方程进行化简，同时还介绍空间曲线的一般方程.

[page:197]

## 一、曲面

在空间 $\mathbf { R } ^ { 3 }$ 中，满足三元方程

$$F(x,y,z)=0$$

的有序数组 $( x , y , z )$ 所对应的点的集合

$$S = \left\{ (x,y,z) \mid F(x,y,z) = 0 \right\}$$

在空间 $\mathbf { R } ^ { 3 }$ 中表示曲面.

如果空间曲面S与三元方程 $F(x,y,z)=0$ 有下述关系:

1. 曲面上的任何一点的坐标 $( x , y , z )$ 都满足方程；

2. 满足方程的 $(x,y,z)$ 必是曲面S上某点的坐标，那么方程 $F(x,y,z)=0$ 称为曲面S的方程，曲面S就称为方程 $F(x,y,z)=0$ 的图形(图6.1).

在空间解析几何中，关于曲面的研究，有下面两个基本问题:

1. 已知曲面S建立它的方程；

2. 已知方程 $F(x,y,z)=0$ ，研究它所表示的曲面的形状及性质.

图 6.1

下面我们举例说明如何解决这两个基本问题

例1 求以点 $M_{0}(x_{0},y_{0},z_{0})$ 为球心，以R为半径的球面的方程.

解设 $M(x,y,z)$ 是球面上任一点，则 $M_{0}$ 与M的距离为R，

$$\sqrt{ \left( x - x _ { 0 } \right) ^ { 2 } + \left( y - y _ { 0 } \right) ^ { 2 } + \left( z - z _ { 0 } \right) ^ { 2 } } = R ,$$

两边平方得

$$(x - x_{0})^{2} + (y - y_{0})^{2} + (z - z_{0})^{2} = R^{2}$$

显然，坐标满足方程的点都在球面上，所以这个方程就是以 $( x _ { 0 } , y _ { 0 } , z _ { 0 } )$ 为球心，以R为半径的球面方程(图6.2).

一般来说，三元二次方程

$$x^{2}+y^{2}+z^{2}+Ax+By+Cz+D=0$$

经过配方后都可以化为

$$(x - x_{0})^{2} + (y - y_{0})^{2} + (z - z_{0})^{2} = E.$$

图 6.2

当 $E \gg 0$ 时，表示实球面；

当 $E = 0$ 时，表示点球面；

当 $E \lessdot 0$ 时，表示虚球面，也就是方程不表示任何曲面.

例如:

$$x^{2}+2x+y^{2}+z^{2}-2z-2=0$$

[page:198]

配方后可以化成

$$(x + 1)^{2} + y^{2} + (z - 1)^{2} = 4.$$

这个方程表示球心在 $( = 1, 0, 1 )$ ，半径为2的球面.

例2已知方程 $x^{2} + y^{2} = R^{2}$ ，研究它表示怎样的曲面.

解方程 $x^{2} + y^{2} = R^{2}$ 在 $O x y$ 平面上表示圆，但在空间直角坐标系中，它表示一个曲面.由于方程不含竖坐标 $z ,$所以不管z是多少，只要点的坐标 $x \cdot y$ 满足方程，点就在曲面上.因此，凡是通过 $O x y$ 平面的圆上的点且平行于z轴的直线l都在曲面上，所以这曲面可以看成平行于z轴的直线沿 $O x y$ 平面上的圆 $x^{2} + y^{2} = R^{2}$ 移动一周而成的，这曲面就是圆柱面，故方程 $x^{2} + y^{2} = R^{2}$ 表示圆柱面(图6.3).

下面讨论两类特殊的曲面:柱面与旋转面.

## 1. 柱面

现在介绍一般的柱面及其方程.

若一动直线l沿已知曲线c移动，且始终与某一直线 $l ^ { \prime }$平行，则这样形成的曲面称为柱面.曲线c称为柱面的准线，而直线l称为柱面的母线(图6.4).

在例2中 $O x y$ 平面上的圆称为圆柱面的准线，平行于$z$ 轴的直线l称为圆柱面的母线

例3 方程

(1) $\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}=1;$ (2) $\frac{x^{2}}{a^{2}}-\frac{y^{2}}{b^{2}}=1$ ; (3) $x^{2} = 2px$

图 6.4

表示怎样的曲面？

解（1）与方程 $x^{2} + y^{2} = R^{2}$ 类似地分析，方程 $\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}=1$ 表示以 $O x y$ 平面上的椭圆为准线，以平行于z轴的直线为母线的柱面，称为椭圆柱面.

(2) 方程 $\frac{x^{2}}{a^{2}}-\frac{y^{2}}{b^{2}}=1$ 表示以 $O x y$ 平面上的双曲线为准线，以平行于z轴的直线为母线的柱面，称为双曲柱面(图6.5).

(3) 方程 $x^{2} = 2px$ 表示以Oxy平面上的抛物线为准线，以平行于z轴的直线为母线的柱面，称为抛物柱面(图6.6).

[page:199]

一般说来，在空间直角坐标系中，方程 $F(x,y)=0$ 表示柱面，它的母线平行于z轴，它的准线是 $O x y$ 平面上的曲线 $c : F(x,y) = 0$ .这个方程的特点是缺少变量z，其母线就与z轴平行.

类似地，方程 $F(y,z) = 0$ 表示母线平行于x轴的柱面，方程 $F(x,z) = 0$ 表示母线平行于y轴的柱面.

一般说来，若曲面方程中缺少一个变量，则该曲面是一个柱面，且这个柱面的母线与这个变量对应的坐标轴平行.

例4试讨论下列图形的特点:

(1) $\frac{x^{2}}{a^{2}}+\frac{z^{2}}{c^{2}}=1$ (2) $\frac{y^{2}}{b^{2}}-\frac{z^{2}}{c^{2}}=1$ (3) $y^{2} = 2px$

解（1）表示椭圆柱面，其准线是 $O x z$ 平面上的椭圆，母线平行于y轴；

(2)表示双曲柱面，其准线是 $O y z$ 平面上的双曲线，母线平行于 $\mathcal { X }$ 轴；

（3)表示抛物柱面，其准线是 $O x y$ 平面上的抛物线，母线平行于z轴.

## 2. 旋转曲面

一条空间曲线c绕一条定直线l旋转一周所产生的曲面称为旋转曲面.曲线 $C$ 称为该曲面的母线，定直线l称为旋转轴

下面着重讨论坐标面上的曲线绕坐标轴旋转所产生的曲面.

设曲线c 是 $O y z$ 平面上的一条曲线:

$$c:\left\{ \begin{aligned} &f(y,z) = 0, \\ &x = 0, \end{aligned} \right.$$

将c绕z轴旋转一周得旋转曲面S，设 $P_{0}(0,y_{0},z_{0})$ 是曲线c上任意一点，$P(x,y,z)$ 是c绕z轴旋转任一角度时 $P_{0}$ 所处的位置.因为 $P_{0}(0,y_{0},z_{0})$ 在c上，所以

$$f(y_0,z_0)=0,$$

又由图6.7可见

$$O _ { 1 } P = O _ { 1 } P _ { 0 } = \left| y _ { 0 } \right| , z = z _ { 0 } ,$$

而 $O_{1}P = \sqrt{x^{2} + y^{2}}$ ,故

$$x^{2}+y^{2}=y^{2},y_{0}=\pm \sqrt{x^{2}+y^{2}}$$

代入式 $f(y_{0},z_{0}) = 0$ 可得点P的坐标应满足

$$f(\pm \sqrt{x^{2}+y^{2}},z)=0.$$

这个方程就是 $O y z$ 平面上的曲线 $f(y,z) = 0$ 绕z轴旋转一周所形成的旋转曲面方程.

同理，曲线c绕y轴旋转一周所成的旋转面方程应为

$$f(y,\pm \sqrt{x^{2}+z^{2}})=0.$$

[page:200]

例5求 $O y z$ 平面上的曲线 $\dot{x}:\begin{cases}y = kz, \\x = 0\end{cases}$ 绕z轴旋转一周所形成的旋转曲面的方程.

解 根据旋转面方程产生的方法，得 $\pm \sqrt{x^{2}+y^{2}}=kz$ ,即

$$x^{2}+y^{2}=k^{2}z^{2}$$

这个方程所表示的曲面称为圆锥面(图6.8).

当 $k = 1$ 时，圆锥面方程为 $x^{2} + y^{2} = z^{2}$ ，这时锥面关于 $z$轴的张角为 $\frac{\pi}{4}$

有时已知某个旋转曲面的方程，要讨论这个曲面是由什么样的曲线绕哪一条坐标轴旋转而成的。

例6 研究曲面 $\bar{S}:z = x^{2} + y^{2}$ 的形状.

图6.8

解方程 $z = x^{2} + y^{2}$ 可记为

$$z - \left( \pm \sqrt{x^{2} + y^{2}} \right)^{2} = 0$$

故S可看作是 $O y z$ 平面上的曲线 $\left\{ \begin{aligned} { } & { { } z = y ^ { 2 } } \\ { } & { { } x = 0 } \\ \end{aligned} \right. ,$ 绕≈轴旋转一周所形成的曲面.也可以看作是 $O x z$ 平面上的曲线 $\left\{ \begin{aligned} { } & { { } z = x ^ { 2 } } \\ { } & { { } y = 0 } \\ \end{aligned} \right. ,$ 绕z轴旋转一周所形成的曲面(图6.9)，这样的曲面称为旋转抛物面.

$O x z$ 平面上的曲线 $\begin{aligned}\mathcal{C}:\begin{cases}f(x,z) = 0 \\y = 0\end{cases}\end{aligned}$ 绕≈轴旋转所形成的曲面方程为

图6.9

$$f(\pm \sqrt{x^{2}+y^{2}},z)=0.$$

绕x轴旋转所形成的曲面方程为

$$f(x,\pm \sqrt{y^{2}+z^{2}})=0.$$

读者可仿此讨论 $O x y$ 平面上的曲线 $c:\left\{ \begin{aligned} & f(x,y) = 0, \\ & z = 0 \end{aligned} \right.$ 绕x 轴或 y 轴旋转所形成的曲面方程.

## 二、空间曲线

## 1. 空间曲线的方程

空间曲线可以看做是两个曲面的交线.设 $F_{1}(x,y,z)=0$ 与 $F_{2}(x,y,z)=0$ 分别是曲面 $S_{1}$ 与 $S_{2}$ 的方程，将这两个方程联立起来

$$\begin{cases}F_{1}(x,y,z) = 0, \\F_{2}(x,y,z) = 0,\end{cases}\tag{6.5}$$

[page:201]

就得到 $S_{1}$ 与 $S_{2}$ 的交线c的方程.式(6.5)称为曲线c 的一般式方程.

如果 $S_{1}$ 与 $S_{2}$ 是两个相交平面，则c是一条直线.

例7 方程组 $\begin{cases}x^{2} + y^{2} = 1, \\2x + 2y + 3z = 6\end{cases}$ 表示怎样的空间曲线?

解 $x^{2} + y^{2} = 1$ 是一个圆柱面，其准线是Oxy平面上的圆$x^{2} + y^{2} = 1$ ，母线与z轴平行 $2x + 2y + 3z = 6$ 即 $\frac{x}{3} + \frac{y}{3} + \frac{z}{2} =$ 1，这是一个在 $x , y , z$ 轴上的截距分别为3,3,2的平面.这样一个圆柱面与平面的交线就是方程组表示的空间曲线(图6.10).

空间曲线也可以用参数式表示.将曲线上动点的坐标x，$y + z$ 都用一个参变量t表示，可得

典型例题讲解空间曲线的方程

$$\begin{cases}x = x(t), \\y = y(t), \\z = z(t),\end{cases}$$

这就是曲线的参数方程.

例8 方程 $\begin{cases}x = a \cos t, \\y = a \sin t, \\z = bt\end{cases}$ 所表示的曲线如图6.11所示，这条曲线称为圆柱螺线.

由例8的方程可知， $x^{2} + y^{2} = a^{2}$ 是一个圆柱面方程.例8中的曲线在这个方程所示的圆柱面上.图6.11中所示的h称为圆柱螺线的螺距， $h = 2 \pi b$ 4

## 2. 空间曲线在坐标面上的投影

以空间曲线c为准线，作母线平行于z轴的柱面S,S与$O x y$ 平面的交线 $c ^ { \prime }$ 就是c在 $O x y$ 平面上的投影.曲面S称为投影柱面(图6.12).

同样可以讨论空间曲线c在 $Oyz,Oxz$ 平面上的投影.

例9 求曲线 $x^{2}+y^{2}+z^{2}=a^{2} \atop x^{2}+y^{2}-ax=0$ 在 $O x y$ 平面上的投影.

解 曲面 $x^{2}+y^{2}=ax=0$ 可写为

$$\left(x - \frac{a}{2}\right)^{2} + y^{2} = \frac{a^{2}}{4},$$

这是一个母线与z轴平行的圆柱面，它就是投影柱面.c是球面与圆柱面的交线，这里$C$ 由 $O x y$ 平面上方与下方相互对称的两部分组成，它们在Oxy平面上的投影都是圆柱面与 $O x y$ 平面的交线，这条交线为

[page:202]

$$c^{\prime}:\left\{\begin{aligned}&\left(x-\frac{a}{2}\right)^{2}+y^{2}=\frac{a^{2}}{4},\\&z=0.\end{aligned}\right.$$

在 $O x y$ 平面上，这是一个以 $\left( \frac{a}{2}, 0 \right)$ 为圆心，以 $\frac{a}{2}$ 为半径的圆(图6.13).

一般地，为求曲线

$$c : \left\{ \begin{aligned} & F_{1}(x,y,z) = 0, \\ & F_{2}(x,y,z) = 0 \end{aligned} \right.$$

在 $O x y$ 平面的投影，可由方程组消去z，得

图6.13

$$F(x,y)=0,$$

这就是投影柱面所满足的方程.再与z=0联立，得

$$c^{\prime}:\begin{cases}F(x,y)=0,\\z=0.\end{cases}$$

这就是c 在 $O x y$ 平面上的投影曲线.

例10 求曲线 $\begin{aligned} &c : \begin{cases} 2x^{2} + y^{2} + z^{2} = 16 \\ x^{2} - y^{2} + z^{2} = 0 \end{cases}\\ \end{aligned}$ 在 $O x y$ 平面上的投影.

解 由c的方程消去z，可得

$$x^{2}+2y^{2}=16$$

于是c 在 $O x y$ 平面上的投影为

$$c^{\prime}:\begin{cases}x^{2}+2y^{2}=16,\\z=0.\end{cases}$$

例11 求曲线 $x^{2}+y^{2}+z^{2}=4$ 在 $O y z$ 平面上的投影.

解由c的方程消去x，可得

$$z^{2}+3z-4=0$$

这个方程表示两个平面

$$\pi _ { 1 } : z = 1 , \qquad \pi _ { 2 } : z = - 4 ,$$

$\pi_{2}$ 显然不合题意，应舍去.故c在 $\mathcal { O } y z$ 平面上的投影为

$$c^{\prime}:\begin{cases}z = 1, \\x = 0,\end{cases}|y| \leqslant \sqrt{3}.$$

[page:203]

由于c 是球面 $x^{2}+y^{2}+z^{2}=4$ 与旋转抛物面 $x^{2} + y^{2} = 3z$ 的交线，它是平面z=1上的圆.故 c 在 $O y z$ 平面上的投影应为一线段，该线段在平面z=1与 $x = 0$ 的交线上，其纵坐标 $y \in [ - \sqrt{3} , \sqrt{3} ]$

## 习题6.3

1. 动点到二定点 $M_{1}(0,0,a)$ 与 $M_{2}(0,0,-a)$ 的距离平方和为定数 $4 a ^ { 3 }$ ，求动点的轨迹方程，并指出方程表示空间的什么图形.

2.设动点与两定点A(1,3,2),B(0,0,1)等距，又与另两定点C(3,0,3),D(0，-2,0)等距，求动点的轨迹，并指出方程表示空间的什么图形.

3.求下列旋转曲面的方程:

(1) $\left\{ \begin{aligned} x^{2} + \frac{y^{2}}{9} = 1 \\ z = 0 \end{aligned} \right.$ 绕x轴，y轴旋转一周；（2) $\begin{cases}y^{2} + z^{2} = 9 \\x = 0\end{cases}$ 绕z轴旋转一周.

4.下列曲面中，哪些是旋转曲面？是怎样产生的? (1) $x^{2} + y^{2} = 4$ (2) $\frac{x^{2}}{4}-\frac{y^{2}}{9}=1$ . (3) $x^{2}+y^{2}=2z$ (4) $\frac{x^{2}}{25}+\frac{y^{2}}{4}+\frac{z^{2}}{4}=1$ (5) $(z - a)^{2} = x^{2} + y^{2}$

5. 一柱面的母线平行于x轴，且过曲线 $\begin{cases}2x^{2} + y^{2} + z^{2} = 16, \\x^{2} - y^{2} + z^{2} = 0,\end{cases}$ 求柱面方程.

6. 下列方程各表示什么曲线？(1) $\begin{cases}x^{2} + y^{2} + z^{2} - 25 = 0, \\x^{2} + y^{2} = 16\end{cases}$ (2) $\begin{cases}x = \cos t, \\y = \sin t, \\z = -1.\end{cases}$

7. 分别写出Oyz平面上以原点为圆心的单位圆的直角坐标方程和参数方程.

8. 求曲线 $\begin{cases}x^{2} + y^{2} + z^{2} = 4 \\y = x\end{cases}$ 在各坐标面上的投影.

9. 求直线 $l:\frac{x - 1}{0} = \frac{y}{1} = \frac{z}{1}$ 绕y轴旋转一周所得曲面的方程.

## §6.4 二次曲面

一般二次方程

$a_{11}x^{2}+a_{22}y^{2}+a_{33}z^{2}+2a_{12}xy+2a_{13}xz+2a_{23}yz+b_{1}x+b_{2}y+b_{3}z+c=0$ 所表示的曲面称为二次曲面

如前面介绍的椭圆柱面 $\frac{x^{2}}{a^{2}}+\frac{z^{2}}{c^{2}}=1$ 与旋转抛物面 $z = x^{2} + y^{2}$ 都是特殊的二次

[page:204]

曲面.

在通常情况下，从一般二次方程讨论曲面的几何特征是比较困难的，但是，通过适当的坐标变换(正交变换或平移变换)，可以将一般二次方程化为形式比较简单的标准方程.下面先讨论三类典型的二次曲面的标准方程，再通过具体例子介绍怎样把一般二次方程化为二次曲面的标准方程.

## 一、椭球面

方程

$$\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}+\frac{z^{2}}{c^{2}}=1 \quad(a,b,c>0)$$

所确定的曲面称为椭球面.它可以看作是球面

$$x^{ \prime 2 } + y^{ \prime 2 } + z^{ \prime 2 } = 1$$

经变换

$$x = a x ^ { \prime } , \quad y = b y ^ { \prime } , \quad z = c z ^ { \prime }$$

所得到的.即球心在坐标原点的球面在坐标轴方向按不完全相同的比例放大或缩小后所变成的.

下面从二次曲面在空间的范围、对称性以及平面与曲面相交所产生的截痕等三方面讨论椭球面的几何特征.

(1) 范围

$$|x| \leqslant a,\quad |y| \leqslant b,\quad |z| \leqslant c,$$

即椭球面在 $x = \pm a, \; y = \pm b, \; z = \pm c$ 六个平面所围成的长方体内.

(2)对称性曲面关于坐标原点、三个坐标轴以及三个坐标面都是对称的

(3) 截痕形状 用平面 $z = z_{0} \left( -c < z_{0} < c \right)$ 去截椭球面所得截痕为

$$\left\{ \begin{aligned} \frac{x^{2}}{a^{2}} + \frac{y^{2}}{b^{2}} = 1 - \frac{z_{0}^{2}}{c^{2}}, \\ z = z_{0}, \end{aligned} \right.$$

这是平面 $z = z_{0}$ 上的椭圆.

同样，用平面 $x = x_{0}, y = y_{0}$ 去截椭球面所得截痕分别为椭圆

$$\sqrt{\frac{y^{2}}{b^{2}}+\frac{z^{2}}{c^{2}}}=1-\frac{x_{0}^{2}}{a^{2}}, \quad \sqrt{\frac{x^{2}}{a^{2}}+\frac{z^{2}}{c^{2}}}=1-\frac{y_{0}^{2}}{b^{2}},$$

椭球面的图形如图6.14所示.

当 $a = b$ (或 $a \equiv c$ 或 $b \equiv c$ 时，曲面是一个旋转椭球面.

图 6.14

[page:205]

## 二、抛物面

## 1. 椭圆抛物面

方程

$$z = \frac{x^{2}}{2p} + \frac{y^{2}}{2q} \quad (pq > 0)$$

所确定的曲面称为椭圆抛物面.其几何特征如下:

(1)范围若 $\widehat { P } : \widehat { q }$ 同为正，则曲面在 $O x y$ 平面上方；若 $\not{p} \; , \; q$ 同为负，则曲面在$O x y$ 平面下方.

(2)对称性 曲面关于z轴以及 $O y z , O x z$ 平面对称.

(3)截痕形状 用平面 $z = z_{0}(z_{0}$ 与 $p , q$ 同号)去截曲面所得的截痕为

$$\left\{ \begin{aligned} \frac{x^{2}}{2px_{0}} + \frac{y^{2}}{2qz_{0}} = 1, \\ z = z_{0}, \end{aligned} \right.$$

这是平面 $z = z_{0}$ 上的椭圆.

用平面 $x = x_{0}$ 与 $y = y_{0}$ 去截曲面，所得截痕分别是

$$\left\{ \begin{aligned} z = & \frac{x_{0}^{2}}{2p} + \frac{y^{2}}{2q}, \\ x = & x_{0} \end{aligned} \right.$$

与

$$\left\{ \begin{aligned} z = & \frac{x^{2}}{2p} + \frac{y_{0}^{2}}{2q}, \\ y = & y_{0}, \end{aligned} \right.$$

它们是平面 $x = x_{0}$ 与 $y = y_{0}$ 上的抛物线.

椭圆抛物面的图形如图6.15.

当 $p = q$ 时，曲面是旋转抛物面

## 2. 双曲抛物面

方程

$$z = \frac{x^{2}}{2p} - \frac{y^{2}}{2q} \quad (pq > 0)$$

所确定的曲面称为双曲抛物面.其几何特征如下:

(1) 范围 $x,y,z \in \mathbb{R}$ ，曲面可向各方向无限延伸.

(2)对称性 曲面关于z轴和 $O y z , O x z$ 平面对称.

(3) 截痕形状 用平面 $z = z_{0} \neq 0$ 截曲面所得截痕为双曲线

$$\left\{ \begin{aligned} &\frac{x^{2}}{2p z_{0}} - \frac{y^{2}}{2q z_{0}} = 1, \\ &z = z_{0}; \end{aligned} \right.$$

用 $z = 0$ 去截曲面，截痕为两条相交直线

$$\sqrt{\frac{x}{\sqrt{\left |  p \right | }}}+\frac{y}{\sqrt{\left |  q \right | }}=0,\quad  与  \quad \sqrt{\frac{x}{\sqrt{\left |  p \right | }}}-\frac{y}{\sqrt{\left |  q \right | }}=0,$$

[page:206]

用平面 $x = x_{0}$ 与 $y = y_{0}$ 截曲面所得截痕分别为

$$\left\{ \begin{aligned} z &= \frac{x_{0}^{2}}{2p} - \frac{y^{2}}{2q}, \\ x &= x_{0} \end{aligned} \right. \quad  与  \quad \left\{ \begin{aligned} z &= \frac{x^{2}}{2p} - \frac{y_{0}^{2}}{2q}, \\ y &= y_{0} \end{aligned} \right.$$

它们是平面 $x = x_{0}$ 与 $y = y_{0}$ 上的抛物线.

双曲抛物面的图形如图6.16所示，由于曲面的形状恰似一个马鞍，所以又称为马鞍面.

## 三、双曲面

## 1. 单叶双曲面

方程

$$\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}-\frac{z^{2}}{c^{2}}=1 \quad(a,b,c>0)$$

所表示的曲面称为单叶双曲面.其几何特征如下:

(1) 范围 因为 $\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}\geqslant1$ ，所以曲面在椭圆柱面 $\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}=1$ 的外部.

(2)对称性 曲面关于三条坐标轴、三个坐标面以及坐标原点都对称.

(3)截痕形状 用平面 $z = z_{0}$ 截曲面所得截痕为

$$\left\{ \begin{aligned} \frac{x^{2}}{a^{2}} + \frac{y^{2}}{b^{2}} = 1 + \frac{z_{0}^{2}}{c^{2}}, \\ z = z_{0}; \end{aligned} \right.$$

这是平面 $z = z_{0}$ 上的椭圆.

用平面 $x = x_{0}$ 与 $y = y_{0}$ 去截曲面:

当 $\left| x_{0} \right| \neq a,\left| y_{0} \right| \neq b$ 时，交线分别是双曲线:

$$\left\{ \begin{aligned} \frac{y^{2}}{b^{2}} - \frac{z^{2}}{c^{2}} = 1 - \frac{x_{0}^{2}}{a^{2}}, \\ x = x_{0} \quad ( | x_{0} | \neq a ) \end{aligned} \right.$$

与

$$\sqrt{\frac{x^{2}}{a^{2}}-\frac{z^{2}}{c^{2}}}=1-\frac{y_{0}^{2}}{b^{2}}, \quad \left(y_{0} \neq b\right).$$

当 $\left| x_{0} \right| = a , \left| y_{0} \right| = b$ 时，交线是两条相交直线:

$$\left\{ \begin{aligned} z &= \pm \frac{c}{b} y, \\ x &= \pm a \end{aligned} \right. \quad  与  \quad \left\{ \begin{aligned} z &= \pm \frac{c}{a} x, \\ y &= \pm b. \end{aligned} \right.$$

单叶双曲面的图形如图6.17所示.图6.18给出当 $x_{0} < a$ $x_{0}=a$ 及 $x_{0} > a$ 三种情况所截曲面的情形.

图 6.17

[page:207]

## 2. 双叶双曲面

方程

$$\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}-\frac{z^{2}}{c^{2}}=-1\quad(a,b,c>0)$$

所确定的曲面S称为双叶双曲面.其几何特征如下:

(1) 范围 因为 $\vert z \vert \geqslant c$ ，所以曲面在两平行平面 $z = \pm c$ 之外.

(2)对称性曲面关于三条坐标轴、三个坐标面以及原点对称

(3) 截痕形状 用平面 $z = z_{0}( \left | z_{0} \right |  > c )$ 截曲面所得截痕为

$$\left\{ \begin{aligned} \frac{x^{2}}{a^{2}} + \frac{y^{2}}{b^{2}} = \frac{z_{0}^{2}}{c^{2}} - 1, \\ z = z_{0}, \end{aligned} \right.$$

这是平面 $z = z_{0}$ 上的椭圆；

用平面 $x = x_{0}, y = y_{0}$ 截曲面所得截痕分别为

$$\sqrt{\frac{x^{2}}{c^{2}}-\frac{y^{2}}{b^{2}}}=1+\frac{x_{0}^{2}}{a^{2}},$$

与

$$\left\{ \begin{aligned} \frac{x^{2}}{c^{2}} - \frac{x^{2}}{a^{2}} = 1 + \frac{y_{0}^{2}}{b^{2}}, \\ y = y_{0}, \end{aligned} \right.$$

它们是平面 $x = x_{0}, y = y_{0}$ 上的双曲线.

双叶双曲面的图形如图6.19所示.

例1 设 $f\left(x_{1},x_{2},x_{3}\right)=3x_{1}^{2}+2x_{2}^{2}+x_{3}^{2}-4x_{1}x_{2}-4x_{2}x_{3}$ ，用正交变换化二次型$f(x_{1},x_{2},x_{3})$ 为标准形，并判断 $f(x_{1},x_{2},x_{3}) = 5$ 表示什么曲面.

解 $f\left(x_{1},x_{2},x_{3}\right)=3x_{1}^{2}+2x_{2}^{2}+x_{3}^{2}-4x_{1}x_{2}-4x_{2}x_{3}$ 的矩阵为

[page:208]

$$\boldsymbol{A} = \begin{bmatrix} 3 & - 2 & 0 \\ - 2 & 2 & - 2 \\ 0 & - 2 & 1 \end{bmatrix},$$

$$\det(\lambda \boldsymbol{I} - \boldsymbol{A}) = \left| \begin{matrix} \lambda - 3 & 2 & 0 \\ 2 & \lambda - 2 & 2 \\ 0 & 2 & \lambda - 1 \end{matrix} \right| = (\lambda - 5)(\lambda - 2)(\lambda + 1).$$

将 $\lambda_{1} = 5, \lambda_{2} = 2, \lambda_{3} = -1$ 分别代入齐次线性方程组 $( \lambda I - A ) X = 0$ ，解得所对应的特征向量分别是

$$\boldsymbol{\alpha}_{1}=(2,-2,1)^{\mathrm{T}}, \quad \boldsymbol{\alpha}_{2}=(2,1,-2)^{\mathrm{T}}, \quad \boldsymbol{\alpha}_{3}=(1,2,2)^{\mathrm{T}},$$

将 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 标准正交化得

$$\boldsymbol { \beta } _ { 1 } = \left( \frac { 2 } { 3 } , - \frac { 2 } { 3 } , \frac { 1 } { 3 } \right) ^ { \mathrm { T } } , \quad \boldsymbol { \beta } _ { 2 } = \left( \frac { 2 } { 3 } , \frac { 1 } { 3 } , - \frac { 2 } { 3 } \right) ^ { \mathrm { T } } , \quad \boldsymbol { \beta } _ { 3 } = \left( \frac { 1 } { 3 } , \frac { 2 } { 3 } , \frac { 2 } { 3 } \right) ^ { \mathrm { T } } ,$$

取正交矩阵

$$\boldsymbol{C} = (\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \boldsymbol{\beta}_{3}) = \left| \begin{aligned} \frac{2}{3} \quad \frac{2}{3} \quad \frac{1}{3} \\ -\frac{2}{3} \quad \frac{1}{3} \quad \frac{2}{3} \\ \frac{1}{3} \quad -\frac{2}{3} \quad \frac{2}{3} \end{aligned} \right|$$

作正交变换 $X = cY$ ，即 $\left\{ \begin{aligned} x_{1} = & \frac{2}{3}y_{1} + \frac{2}{3}y_{2} + \frac{1}{3}y_{3}, \\ x_{2} = & -\frac{2}{3}y_{1} + \frac{1}{3}y_{2} + \frac{2}{3}y_{3}, \\ x_{3} = & \frac{1}{3}y_{1} - \frac{2}{3}y_{2} + \frac{2}{3}y_{3}, \\ f = & 5y_{1}^{2} + 2y_{2}^{2} - y_{3}^{2}. \end{aligned} \right.$ 得标准形

$f = 5$ ,即

$$y_{1}^{2}+\frac{y_{2}^{2}}{\frac{5}{2}}-\frac{y_{3}^{2}}{5}=1.$$

由于正交变换不改变几何图形的形状，所以这是单叶双曲面方程

在曲面本身的研究或曲面在其他方面的应用中，经常涉及几个曲面相交所产生的曲线或几个曲面围成的空间区域

例2 试画出曲面 $z = 1 - x^{2}$ 与 $z = 3x^{2} + y^{2}$ 交线的草图并确定其交线在 $O x y$ 平面上的投影曲线.

解 其交线如图6.20所示.

[page:209]

将 $z = 1 - x^{2}$ 代入方程 $z = 3x^{2} + y^{2}$ 得投影柱面方程:

$$4x^{2}+y^{2}=1$$

两曲面交线在 $O x y$ 平面上的投影曲线为

$$\begin{cases}4x^{2} + y^{2} = 1, \\z = 0,\end{cases}$$

这是 $O x y$ 平面上的一个椭圆.

## 应用实例

## (一)几何应用

$$\begin{aligned}f(x_{1},x_{2},x_{3}) = & a_{11}x_{1}^{2} + a_{22}x_{2}^{2} + a_{33}x_{3}^{2} + 2a_{12}x_{1}x_{2} + 2a_{13}x_{1}x_{3} \\& + 2a_{23}x_{2}x_{3} + b_{1}x_{1} + b_{2}x_{2} + b_{3}x_{3} + c,\end{aligned}\tag{6.6}$$

则方程 $f(x_{1},x_{2},x_{3}) = 0$ 在几何空间中表示一个二次曲面.

$$\begin{aligned}\boldsymbol{A} &= \begin{bmatrix}a_{11} & a_{12} & a_{13} \\a_{21} & a_{22} & a_{23} \\a_{31} & a_{32} & a_{33}\end{bmatrix}, \quad\boldsymbol{X} = \begin{bmatrix}x_{1} \\x_{2} \\x_{3}\end{bmatrix}, \quad\boldsymbol{b} = \begin{bmatrix}b_{1} \\b_{2} \\b_{3}\end{bmatrix}.\end{aligned}$$

则式(6.6)可记为

$$f\left( \bar{X} \right) = \bar{X}^{\mathrm{T}}AX + b^{\mathrm{T}}X + c\tag{6.7}$$

1. 作正交变换 X=CY，其中 $\boldsymbol{Y} = (y_1, y_2, y_3)^{\mathrm{T}}$ ,则

$$f(X)=\lambda_{1}y_{1}^{2}+\lambda_{2}y_{2}^{2}+\lambda_{3}y_{3}^{2}+b^{\prime}_{1}y_{1}+b^{\prime}_{2}y_{2}+b^{\prime}_{3}y_{3}+c,\tag{6.8}$$

其中 $\lambda_{1}, \lambda_{2}, \lambda_{3}$ 是矩阵A的特征值.

2. 对(6.8)配平方，在几何上就是作坐标平移变换，将(6.8)化为标准形.化成标准形后的方程所表示的几何图形与式(6.6)所表示的几何图形是相同的.根据 $\lambda_{1} , \lambda_{2}$ $\lambda_{3}$ 和d的不同关系，一共有17种不同的情况，我们常见的有以下两类:

(1) $\lambda_{1}z_{1}^{2}+\lambda_{2}z_{2}^{2}+\lambda_{3}z_{3}^{2}=d\quad(\lambda_{1}\lambda_{2}\lambda_{3}\neq0)$

根据 $\lambda_{1}, \lambda_{2}, \lambda_{3}$ 与d的不同情况，可能是椭球面或双曲面.

(2) $\lambda_{1}z_{1}^{2}+\lambda_{2}z_{2}^{2}=az_{3}\left(\lambda_{1}\lambda_{2}\neq0,a\neq0\right)$

根据 $\lambda_{1}, \lambda_{2}, a$ 的不同符号，为不同类型的抛物面.

其他标准形可根据不同的几何意义进行讨论.

实例将二次曲面方程

$$x_{1}^{2}+4x_{2}^{2}+x_{3}^{2}+2x_{1}x_{2}+4x_{1}x_{3}+2x_{2}x_{3}+\sqrt{3}x_{1}-6\sqrt{3}x_{2}+\sqrt{3}x_{3}+\frac{1}{2}=0$$

用正交变换与坐标平移变换化为标准形.

解 设

[page:210]

$$\boldsymbol{A} = \begin{bmatrix} 1 & 1 & 2 \\ 1 & 4 & 1 \\ 2 & 1 & 1 \end{bmatrix}, \quad \boldsymbol{X} = \begin{bmatrix} x_{1} \\ x_{2} \\ x_{3} \end{bmatrix}, \quad \boldsymbol{b} = \begin{bmatrix} \sqrt{3} \\ -6\sqrt{3} \\ \sqrt{3} \end{bmatrix}.$$

则曲面方程的左端可表为

$$\begin{aligned}f(\boldsymbol{X}) &= \boldsymbol{X}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{X} + \boldsymbol{b}^{\mathrm{T}} \boldsymbol{X} + \frac{1}{2}. \\\det(\lambda \boldsymbol{I} - \boldsymbol{A}) &= (\lambda + 1)(\lambda - 2)(\lambda - 5),\end{aligned}$$

A 的特征值为 $\lambda _ { 1 } = - 1 , \lambda _ { 2 } = 2 , \lambda _ { 3 } = 5$ ,求出 $\lambda_{1}, \lambda_{2}, \lambda_{3}$ 的特征向量并单位化:

$$\pmb{\alpha}_{1} = \left[ \begin{matrix} \dfrac{1}{\sqrt{2}} \\ 0 \\ \dfrac{1}{\sqrt{2}} \end{matrix} \right], \quad \pmb{\alpha}_{2} = \left[ \begin{matrix} \dfrac{1}{\sqrt{3}} \\ \dfrac{1}{\sqrt{3}} \\ \dfrac{1}{\sqrt{3}} \end{matrix} \right], \quad \pmb{\alpha}_{3} = \left[ \begin{matrix} \dfrac{1}{\sqrt{6}} \\ \dfrac{2}{\sqrt{6}} \\ \dfrac{1}{\sqrt{6}} \end{matrix} \right],$$

令 $\begin{aligned}\boldsymbol{Y} \cdot \boldsymbol{C} = \begin{bmatrix}\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{3}} & \frac{1}{\sqrt{6}} \\0 & -\frac{1}{\sqrt{3}} & \frac{2}{\sqrt{6}} \\-\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{3}} & \frac{1}{\sqrt{6}}\end{bmatrix}, \boldsymbol{Y} = \begin{bmatrix}y_{1} \\y_{2} \\y_{3}\end{bmatrix}\end{aligned}$ ，作正交变换 $X = C Y$ ,则 $f\left(X\right)=-y_{1}^{2}+2y_{2}^{2}+$

$5y_{3}^{2}+8y_{2}-5\sqrt{2}y_{3}+\frac{1}{2}$ .将 $f(X)$ 配平方，

$$f\left( \boldsymbol{X} \right) = - y_{1}^{2} + 2\left( y_{2} + 2 \right)^{2} + 5\left( y_{3} - \frac{\sqrt{2}}{2} \right)^{2} - 10.$$

$$\begin{aligned}z_{1} &= y_{1}, \\z_{2} &= y_{2} + 2, \\z_{3} &= y_{3} - \frac{\sqrt{2}}{2},\end{aligned}$$

则曲面方程 $f(X) = 0$ 化为 $-z_{1}^{2}+2z_{2}^{2}+5z_{3}^{2}=10$ 即

$$-\frac{z_{1}^{2}}{10}+\frac{z_{2}^{2}}{5}+\frac{z_{3}^{2}}{2}=1.$$

这是一个单叶双曲面的方程.

## (二)相对论——洛伦兹变换

数学中最重要的概念之一是不变性的概念.这种思想对我们来说已不是新的了

[page:211]

例如，我们知道一个物体的对称性是用保持该物体不变的等距变换来衡量的.

在狭义相对论中我们还可以举出另外一个例子.狭义相对论的基本假设如下:

(1)对于两个以常速度相对运动的观察者来说，每一个物理定律都同等地有效.

(2)光速是一个物理常数c:两个以常速度相对运动的观察者都会观察到光在真空中沿直线以速率 $\mathcal { C }$ 运动(实验表明，c近似于300000km/s).

考虑两个以常速度相对运动的观察者.每一观察者设置一个直角坐标系.假定在一个被两个观察者一致称为 $t = 0$ 的时刻，这两个坐标系瞬时地重合.然后坐标系随着各自的观察者运动.

第一个观察者注意到，在时间t内，光从(0，0，0)运动到了 $( x , y , z )$ .他得出光速 $C$是由 $\left(x^{2}+y^{2}+z^{2}\right)^{\frac{1}{2}}=ct$ 或者 $x^{2}+y^{2}+z^{2}-c^{2}t^{2}=0$ 给出的.

第二个观察者注意到，在他的坐标系中，光在时间 $t ^ { \prime }$ 内由(0,0,0)运动到了 $x ^ { \prime }$ $y ^ { \prime } : z ^ { \prime }$ .他得出光速c 由 $x^{ \prime 2 } + y^{ \prime 2 } + z^{ \prime 2 } - c^{ 2 } t^{ \prime 2 } = 0$ 给出.

由基本假设，上述两个方程中的常数c相同.这两个方程给出了两个坐标系间的一个关系:

$$x^{2}+y^{2}+z^{2}-c^{2}t^{2}=x^{\prime 2}+y^{\prime 2}+z^{\prime 2}-c^{2}t^{\prime 2}.\tag{6.9}$$

设 $\sigma : ( x , y , z , t ) \rightarrow ( x ^ { \prime } , y ^ { \prime } , z ^ { \prime } , t ^ { \prime } )$ 是联系第一个观察者的量值与第二个观察者的对应量值的变换，则二次型 $Q = x^{2} + y^{2} + z^{2} - c^{2}t^{2}$ 在变换 $\sigma$ 下不变.

因而，出现一个有趣的问题:我们能够找到一个变换 $\sigma$ 保持 $Q$ 不变吗？特别地，σ能够取为线性变换吗？

我们只限于注意这种情况:第二个观察者以速率 $\mathcal { V }$ 在 $\mathcal { X }$ 轴方向上相对于第一个观察者运动(图6.21).此时坐标平面 $y = 0$ 与 $y^{'} = 0$ 永远重合；平面 $z = 0$ 与 $z^{\prime} = 0$ 也是这样.于是，我们总可以假定 $y = y^{\prime}$ 及 $z = z ^ { \prime }$ .条件(6.9)就简化为

$$x^{2}-c^{2}t^{2}=x^{\prime 2}-c^{2}t^{\prime 2}\tag{6.10}$$

设 $\sigma$ 是一个线性变换，它把 $( x , t )$ 映到 $(x',t')$ ，且使条件(6.10)满足.首先注意到 $x^{'} =$ 0蕴涵着 $x - vt = 0$ ，因为第二个观察者的坐标原点 $O ^ { \prime }$ 以速率 $\mathcal { V }$ 相对于第一个观察者运动.由此可见，对于某个(可能与 $v$ 有关的)常数 $\gamma$ ,有

$$x^{\prime} = \gamma(x - vt).\tag{6.11}$$

根据坐标系的取法(图6.21)，可以假定γ是正的(考虑当 $t = 0$ 时的量值).我们再用线性关系

$$t' = ax + bt\tag{6.12}$$

完成 $\sigma$ 的定义，这里 $\alpha$ 与b是待定的常数.

把(6.11)、(6.12)两式代入(6.10)式，我们得知二次型 $x^{2}-c^{2}t^{2}$ 恒等于

$$\gamma^{2}(x - vt)^{2} - c^{2}(ax + bt)^{2}$$

比较 $x^{2},xt$ 及 $t ^ { 2 }$ 项的系数，我们得到

[page:212]

$$\begin{cases}1 = \gamma^{2} - a^{2}c^{2}, \\0 = - \gamma^{2}v - abc^{2}, \\- c^{2} = \gamma^{2}v^{2} - b^{2}c^{2}.\end{cases}$$

由上述三个式子可以求出

$$\gamma = \gamma ( v ) = \frac { 1 } { \sqrt { 1 - v ^ { 2 } / c ^ { 2 } } } ,$$

$$a = a \left( v \right) = \pm \frac{v / c^{2}}{\sqrt{1 - v^{2} / c^{2}}},$$

$$b = b(v) = \pm \frac{1}{\sqrt{1 - v^{2} / c^{2}}}.$$

注意 γ,a,b都是与 $\mathcal { V }$ 有关的常数，且

$$\gamma \left( - v \right) = \gamma \left( v \right), a \left( - v \right) = - a \left( v \right), b \left( - v \right) = b \left( v \right).$$

为了保证这些常数是实的，必须 $\vert v \vert < c$

只剩下要确定 $\alpha$ 与b的符号了.线性变换 $\sigma$ 用矩阵形式给出为

$$\begin{aligned}\begin{bmatrix}x^{\prime} \\t^{\prime}\end{bmatrix}= \boldsymbol{L}(v)\begin{bmatrix}x \\t\end{bmatrix}, \quad\boldsymbol{L}(v) =\begin{bmatrix}\gamma & -\gamma v \\a & b\end{bmatrix}\end{aligned}\tag{6.13}$$

(参看(6.11)和(6.12)式).对于第一个观察者而言，一个被他用 $(x,t)$ 度量的事件被第二个观察者用 $(x',t')$ 度量，坐标通过(6.13)相联系.而对第二个观察者而言，第一个观察者以速度一v运动，所以他将按照

$$\begin{pmatrix} x \\ t \end{pmatrix} = L(-v) \begin{pmatrix} x' \\ t' \end{pmatrix}$$

来计算量值之间的关系.于是可得

$$L(v)L(-v)=I.\tag{6.14}$$

因此

$$\begin{pmatrix}\gamma & - \gamma_{v} \\a & b\end{pmatrix}\begin{bmatrix}\gamma & \gamma_{v} \\- a & b\end{bmatrix}=\begin{bmatrix}1 & 0 \\0 & 1\end{bmatrix}.$$

[page:213]

容易求得

$$b = \gamma = \frac{1}{\sqrt{1 - v^{2} / c^{2}}}, \quad a = \frac{- v / c^{2}}{\sqrt{1 - v^{2} / c^{2}}}.$$

线性变换

$$\begin{pmatrix}x^{\prime} \\t^{\prime}\end{pmatrix}=\boldsymbol{L}(v)\begin{pmatrix}x \\t\end{pmatrix}, \quad\boldsymbol{L}(v)=\boldsymbol{\gamma}(v)\begin{pmatrix}1 & -v \\-v/c^2 & 1\end{pmatrix}, \quad|v|<c.$$

称为洛伦兹变换.它们是联系以常速度v相对运动的观察者的量值的线性变换，并且满足相对论的基本假设.特别地， $x^{2} = c^{2}t^{2}$ 在洛伦兹变换下不变.

矩阵的集合 $\{ L ( v )$ ，对所有使 $\vert v \vert < c$ 的v}在矩阵乘法下成为一个群，称为洛伦兹群.由(6.14)式有 $\left[ L \left( v \right) \right] ^ { - 1 } = L \left( - v \right)$ .此外，可以证明

$$L \left( v \right) L \left( v ^ { \prime } \right) = L \left( v ^ { \prime \prime } \right) ,$$

其中 $v'' = \frac{v + v'}{1 + \frac{v v'}{c^2}}$ .这就是狭义相对论中速度叠加的法则.

## 习题6.4

1. 求旋转抛物面 $y^{2} + z^{2} = x$ 与平面 $x + 2y - z = 0$ 的交线在三个坐标面上的投影曲线方程.

2.下列方程表示什么曲面？画出其草图，对其中的旋转面，说明是怎样产生的:(1) $x^{2}+y^{2}+z^{2}=4y$ (2) $3z = \sqrt{x^{2} + y^{2}}$ (3) $x^{2} + y^{2} - 2x = 0$ (4) $4x^{2}+y^{2}-2y-z+1=0$ ;(5) $\frac{x^{2}}{4}-y^{2}+z^{2}=1$ ; (6) $x^{2}-4y^{2}=0.$

3. 下列方程表示什么曲线？画出其草图:(1) $\begin{cases}x^{2} + y^{2} + z^{2} = 16 \\y = 2\end{cases}$ (2) $\left\{ \begin{aligned} \frac{x^{2}}{4} + y^{2} = 1 - \frac{z}{2} , \\ x = 2 ; \end{aligned} \right.$ (3) $\begin{cases}9x^{2} + 4y^{2} - z^{2} = 0, \\z = 3.\end{cases}$

4.画出下列各曲面所围立体的草图

(1) 平面 $y=0,z=0,3x+y=6,3x+2y=12$ 和 $x + y + z = 6$

(2)抛物柱面 $2y^{2} = x$ 及平面 $z = 0,\frac{x}{4} + \frac{y}{2} + \frac{z}{2} = 1$

（3)第Ⅰ卦限内，圆柱面 $x^{2}+y^{2}=a^{2},z^{2}+x^{2}=a^{2}$ 及坐标面.

5. 用正交变换化方程 $3x_{1}^{2}+3x_{2}^{2}+2x_{1}x_{2}=1$ 为标准形，并讨论在 $\mathbf { \bar { R } } ^ { 2 }$ 与 $\bar{\mathbf{R}}^{3}$ 中这个方程分别表示什么样的图形.

6. 设 $f\left(x_{1},x_{2},x_{3}\right)=x_{1}^{2}+tx_{2}^{2}+4x_{3}^{2}-4x_{1}x_{2}+4x_{2}x_{3}$ ,且 $f(x_{1},x_{2},x_{3}) = 1$ 为椭球面方程，试讨论t应取何值？

[page:214]

1. 证明:秩为r的对称矩阵可以表示成r个秩等于1的对称矩阵之和.

2. 用配方法化二次型为标准形:

$$f(x_{1},x_{2},x_{3},x_{4})=x_{1}x_{2}+x_{1}x_{3}+x_{1}x_{4}+x_{2}x_{3}+x_{2}x_{4}-x_{3}x_{4}$$

3. 设A，B都是实对称矩阵，证明:存在正交矩阵C使 $C^{\top}AC = B$ 的充要条件是A与B有相同的特征值.

4. 设二次型 $f = x_{1}^{2} + x_{2}^{2} + x_{3}^{2} + 2\lambda x_{1}x_{2} + 2x_{1}x_{3} + 2\mu x_{2}x_{3}$ 经正交变换 $X = C Y$ 化为$f = y_{2}^{2} + 2y_{3}^{2}$ ，其中 $\boldsymbol{X} = (x_{1},x_{2},x_{3})^{\mathrm{T}}, \boldsymbol{Y} = (y_{1},y_{2},y_{3})^{\mathrm{T}}, \boldsymbol{C}$ 是3阶正交矩阵，求常数$\lambda , \mu$

5. 设二次型 $f=3x_{1}^{2}+3x_{2}^{2}+5x_{3}^{2}+4x_{1}x_{3}-4x_{2}x_{3}$

(1)写出二次型的矩阵表示式；

(2)用正交变换化二次型为平方和.

6. 设实对称矩阵 $A = (a_{ij})_{n \times n}$ 是正定矩阵， $b_{1},b_{2},\cdots,b_{n}$ 是任意n个非零实数.证明:$\boldsymbol{B} = \left( a_{ij} b_i b_j \right)_{n \times n}$ 也是正定矩阵.

7. 设A为n阶对称矩阵.证明:A满秩的充要条件是存在实矩阵B，使 $AB + B^{\top}A$ 为正定矩阵。

8. 设二次型 $f=x_{1}^{2}+4x_{2}^{2}+4x_{3}^{2}+2\lambda x_{1}x_{2}-2x_{1}x_{3}+4x_{2}x_{3}+5x_{4}^{2}$ ，问λ取何值时，f为正定二次型？

9. 设A，B是同阶正定矩阵，证明: $\det(\lambda A - B) = 0$ 的根都是正根

10. 设 A 是n 阶正定矩阵， $\boldsymbol{X}=\left(x_{1}, x_{2}, \cdots, x_{n}\right)^{\mathrm{T}}, \boldsymbol{X}^{\mathrm{T}} \boldsymbol{B} \boldsymbol{X}=\boldsymbol{X}^{\mathrm{T}} \boldsymbol{A} \boldsymbol{X}+x_{n}^{2}$ .证明: $\det B >$ det A.

11.设A为n阶实对称矩阵，且其正负惯性指数都不为零.证明:存在非零向量 $X_{1},X_{2}$和 $X_{3}$ ，使得 $X_{1}^{\mathrm{T}} A X_{1} > 0, X_{2}^{\mathrm{T}} A X_{2} = 0$ 和 $X_{3}^{\mathrm{T}}AX_{3}<0$

12. 设A是奇数阶实对称矩阵， $\det A > 0$ .证明:存在非零向量 $X_{0}$ ，使得 $X_{0}^{\mathrm{T}}AX_{0}>0$

13. 设 $f\left(x_{1}, x_{2}, \cdots, x_{n}\right)=\left(x_{1}+a_{1} x_{2}\right)^{2}+\left(x_{2}+a_{2} x_{3}\right)^{2}+\cdots+\left(x_{n-1}+a_{n-1} x_{n}\right)^{2}+$ $(x_{n} + a_{n}x_{1})^{2}$ ，其中 $a_{1},a_{2},\cdots,a_{n}$ 均为实数，问 $a_{1},a_{2},\cdots,a_{n}$ 满足何条件时，二次型 $f(x_{1},x_{2},\cdots,x_{n})$ 正定？

14. 设 $D = \begin{pmatrix} A & C \\ C^{\top} & B \end{pmatrix}$ 为正定矩阵，其中A，B分别为m阶和n阶对称矩阵，C为 $m \times n$阶矩阵.

(1) 计算 $P^{\mathrm{T}}DP$ ，其中 $\boldsymbol{P}=\begin{pmatrix}\boldsymbol{I}_{m} & -\boldsymbol{A}^{-1} \boldsymbol{C} \\\boldsymbol{O} & \boldsymbol{I}_{n}\end{pmatrix}$

(2)判断矩阵 $\boldsymbol{B}-\boldsymbol{C}^{\mathrm{T}} \boldsymbol{A}^{-1} \boldsymbol{C}$ 是否为正定矩阵，并证明你的结论.

15. 求圆 $\begin{cases}x^{2} + y^{2} + z^{2} = 10y, \\x + 2y + 2z - 19 = 0\end{cases}$ 的圆心和半径.

16. 求球面 $x^{2}+y^{2}+z^{2}=a^{2}$ 与锥面 $x^{2} + y^{2} - z^{2} = 0$ 的交线在三个坐标面上的投影

[page:215]

曲线.

17.证明:两柱面 $x^{2}+z^{2}=R^{2},y^{2}+z^{2}=R^{2}$ 的交线在两个平面上.

18.写出下列各组曲面的交线在指定平面上的投影曲线方程:

(1) $4x^{2}+9y^{2}=36z$ 与z=4在Oxy 平面上；

(2) $x^{2}+y^{2}+z^{2}=100$ 与 $z = 2x$ 在 $O x y , O y z$ 平面上；

(3) $x^{2}+y^{2}+z^{2}=a^{2}$ 与 $x^{2}+y^{2}-z^{2}=0$ 在Oxy 平面上；

(4) $x^{2}+y^{2}+z^{2}=a^{2}$ 与 $x^{2}+y^{2}-ax=0$ 在 Oxz 平面上；

(5) $x^{2}+y^{2}+z^{2}=100$ 与 $x^{2}+y^{2}-64=0$ 在 Oxy 平面上.

19. 已知二次曲面方程 $x^{2}+ay^{2}+z^{2}+2bxy+2xz+2yz=4$ 可以经过正交变换

$$\begin{pmatrix} x \\ y \\ z \end{pmatrix} = \boldsymbol{C} \begin{pmatrix} \xi \\ \eta \\ \xi \end{pmatrix}$$

化为椭圆柱面方程 $\eta^{2}+4\xi^{2}=4$ ，求a，b的值和正交矩阵C.

## 思考题六

1. 可否用初等变换将实对称矩阵A化为与之合同的对角矩阵A，即 $C^{\mathrm{T}}AC = A$ 并同时求出可逆矩阵C?

2. 设A是实对称矩阵，B是正定矩阵.问:是否存在可逆矩阵C，使得A和B同时合同于对角矩阵，即 $C^{\mathrm{T}} A C$ 和 $\widetilde{C}^{\mathrm{T}} \widetilde{BC}$ 都是对角矩阵？说明理由.

3. 两个同阶实对称矩阵是否可以同时合同于对角矩阵？

4. 讨论:对任意 $m \times n$ 矩阵 $A , A ^ { \mathrm { ~ T ~ } } A$ 的有定性.进一步地，讨论所得结论与 $R(A)=n$ 的关系，或可进一步得到什么结论？

知识点注释六

综合自测题六

[page:216]

## C h a p t er 07

重点难 点

在第四章中，我们把有序数组称为向量，并且讨论了向量的线性相关性、向量组的极大无关组与秩等重要概念.在本章中，我们将这些概念推广，在更广泛的意义下讨论向量及有关性质，这就是线性空间的内容.在线性空间中，事物之间的联系表现为元素之间的对应关系，而线性变换就是反映线性空间的元素间最基本的线性联系.在某种意义上，线性代数就是研究线性空间与线性变换的学科.

## .1线性空间的概念

## 一、线性空间

如果数集P中任意两个数作某一运算后的结果仍在P中，我们就称数集P对这个运算是封闭的.对加、减、乘、除四则运算封闭的数集P称为数域.

最常见的数域是有理数域Q，实数域R，复数域C.除了这三个常见的数域外，还有其他很多数域，例如

$$Q \left( \sqrt{2} \right) = \left\{ a + b \sqrt{2} \mid a, b \in \mathbf{Q} \right\}$$

不难验证， $Q(\sqrt{2})$ 也是一个数域.而全体整数组成的集合Z对于除法运算不封闭，故Z不是数域.

在解析几何中，我们讨论过向量的加法“+”与数乘“·”运算.设

$$V = \left\{  从原点出发的  3  维向量全体  \right\},$$

R为实数域，则 $V, \mathbb{R}, +, \cdot$ 所组成的系统 $(V,R,+,\cdot)$ 具有以下特点:

1. 加法运算在V中封闭.即对任意的 $\alpha,\beta \in V$ ，存在惟一的 $\gamma \in V$ 与之对应，使$\hat{\gamma} = \alpha + \beta$

2. 数乘运算在V中封闭.即对任意的 $k \in \mathbb{R}, \alpha \in V$ ，存在惟一的 $\delta \in V$ 与之对应，使 $\delta = k \cdot \alpha$ (简记为 $k \alpha$

3.加法“+”与数乘“。”还满足以下八条运算规则:

$$1^{\circ} \quad \alpha + \beta = \beta + \alpha;$$

[page:217]

$2^{\circ} \quad (\boldsymbol{\alpha} + \boldsymbol{\beta}) + \boldsymbol{\gamma} = \boldsymbol{\alpha} + (\boldsymbol{\beta} + \boldsymbol{\gamma})$ DO

$3 ^ { \circ }$ 存在零元素 $0 \in V$ ，对任意的 $\alpha \in V$ ,都有 $\alpha + 0 = \alpha$

$4 ^ { \circ }$ 对任意的 $a \in V$ ，存在α的负元素 $\beta \in V$ ,使 $\alpha + \beta = 0$

$$5^{\circ}$$

$$6 ^ { \circ }$$

$$7^{\circ} \quad k(\boldsymbol{\alpha} + \boldsymbol{\beta}) = k\boldsymbol{\alpha} + k\boldsymbol{\beta};$$

$$8^{\circ} \quad (k + l)\alpha = k\alpha + l\alpha,$$

其中 $\alpha , \beta , \gamma \in V , k , l \in \mathbf { R } .$

值得注意的是，规则 $8 ^ { \circ }$ 中，左端 $k + l$ 的“+”是普通数的加法，而右端 $k\boldsymbol{\alpha} + l\boldsymbol{\alpha}$ 的$\text{" } +  \text{" }$ ，是向量与向量的加法.虽然同一个记号表达了不同的意义，但是只要我们注意到了这一点，在具体问题中是不会发生混淆的.

对于次数小于n的实系数多项式全体及零多项式所组成的集合

$$R _ { n } \left[ x \right] = \left\{ a _ { 0 } + a _ { 1 } x + \cdots + a _ { n - 1 } x ^ { n - 1 } \mid a _ { i } \in \mathbb { R } , i = 0 , 1 , \cdots , n - 1 \right\} ,$$

实数域R以及多项式的加法 $"  +   "$ ，数与多项式的乘法“。”所组成的系统$( R _ { n } [ x ] , R _ { 1 } + , \cdot )$ 也具有“十”与“。”在 $\tilde{R}_{n}[x]$ 中封闭，且满足前面所列八条运算规则的特点.

在第四章中,n维实向量的全体

$$\mathbf{R}^{n}=\left\{\left(a_{1}, a_{2}, \cdots, a_{n}\right) \mid a_{i} \in \mathbf{R}, i=1,2, \cdots, n\right\}$$

对于n维向量的加法“+”与数乘“。”，系统 $\left( \mathrm{R}^{n}, \mathrm{R}, + , \cdot \right)$ 也具有“+”与“。”在 $\mathbf{R}^{n}$ 中封闭，且满足前述八条运算规则的特点.

我们还可以举出许多具有以上特点的系统.舍去这些系统中具体元素的意义，将其运算的本质特点抽象出来，我们给出以下关于线性空间的定义:

定义1 设V是一个非空集合，P是一个数域.如果在V中定义了一个运算“+”，称为加法；在P与V之间定义了一个运算“。”，称为数乘.“+”,“。”在V中封闭，且满足前面所述的八条运算规则，则称系统 $(V,P,+,\cdot)$ 为线性空间.

如果所论及的运算“+”与“·”在上下文中是清楚的，在不需要强调运算“+”与“”的时候，我们也称V为数域P上的线性空间，并将线性空间 $(V,P,+,\cdot)$ 简记为$V(P)$ .有时又称V为线性空间.在我们称V为线性空间的时候，一定要注意这只是一个简称，不要忘记相应的数域P与运算 $\text{" }+ \text{" }, \text{" }+ \text{" }$ 及八条运算规则.

由定义1可知，前面所列举的系统 $\left( V , \mathbb { R } , + , \cdot \right) , \left( R _ { n } \left[ x \right] , \mathbb { R } , + , \cdot \right)$ 以及 $\left( \mathbf{R}^{n} \right., \mathbf{R}$ $+ , \cdot )$ 都是线性空间.下面再看几个例子.

例1 设

$$R^{m \times n} = \left\{ m   行   n   列的实矩阵全体  \right\},$$

P为有理数域Q，对于矩阵的加法 $\text{" }+ "$ 与数乘“·”，容易验证“+”与“。”在 $R^{m \times n}$ 中封闭，且满足八条运算规则，所以系统 $( R ^ { m \times n } , \mathrm { Q } , + , \cdot )$ 构成线性空间.

例2设

$$C[a,b]=\left\{ 区间 [a,b] 上的连续函数全体 \right\}$$

[page:218]

P为实数域R，对于函数的加法“+”以及实数与函数的乘法“·”，系统$\left( \bar{C} \left[ a, b \right], \bar{R}, + , \cdot \right)$ 构成线性空间.

例3设V为复数域C,P为实数域R，对于复数的加法“+”与乘法“·”，系统$(C,R,+,\cdot)$ 是线性空间.

如果设V为实数域R，P为复数域C，对于复数的加法“+”与乘法“·”，由于乘法运算在V中不封闭，所以 $(R,C,+,\cdot)$ 不是线性空间.

以上各例的运算都是我们以前所熟悉的.事实上，线性空间的运算可以是相当抽象的.

例4设

$$\mathbb{R}^{+} = \{  所有正实数  \}, \quad P =  实数域  \mathbb{R},$$

定义加法 $\text{" } \textcircled{T}  \text{" }$ 与数乘“。”如下:

$$a \oplus b = ab \quad (a,b \in \mathbb{R}^+),$$

$$k \circ a = a^{k} \quad (k \in \mathbf{R}, a \in \mathbf{R}^{+}).$$

这样定义的运算满足以下条件:

（1）加法的封闭性:

$$\forall a,b \in \mathbb{R}^{+}, \quad a \oplus b = ab \in \mathbb{R}^{+};$$

(2) 数乘的封闭性:

$$\forall k \in \mathbb{R}, a \in \mathbb{R}^+, \quad k \circ a = a^k \in \mathbb{R}^+;$$

(3)八条运算规则:

1°a+b=ab=ba=b+a;

$$2^{\circ} \quad (a \oplus b) \oplus c = (ab) \oplus c = (ab)c = a(bc) = a \oplus (b \oplus c);$$

$3 ^ { \circ }$ 存在零元素 $1 \in \mathbb{R}^{+}, \forall a \in \mathbb{R}^{+}, a \oplus 1 = a \\ 1 = a$

$4^{\circ} \quad \forall a \in \mathbf{R}^{+}$ ，存在负元素 $a^{-1} \in \mathbf{R}^{+}$ ,使 $a \oplus a^{-1} = a a^{-1} = 1$

5°1°a=a¹=a;

$$\begin{align*}6^{\circ} \quad k \circ (l \circ a) = k \circ a^{l} = (a^{l})^{k} = a^{kl} = (kl) \circ a;\end{align*}$$

$$\begin{aligned}7^{\circ} \quad k \circ (a \oplus b) = k \circ (ab) = (ab)^{k} = a^{k}b^{k} = a^{k} \oplus b^{k} = (k \circ a) \oplus (k \circ b);\end{aligned}$$

$$8^{\circ} \quad (k + l) \circ a = a^{k + l} = a^{k}a^{l} = a^{k} \oplus a^{l} = (k \circ a) \oplus (l \circ a).$$

所以系统 $\left( \mathbf{R}^{+} , \mathbf{R} , \oplus , \circ \right)$ 构成线性空间.

如果将例4的加法与数乘规定为普通实数的加法“+”与乘法“·”，则乘法运算在$\mathbb{R}^{+}$ 中不封闭，于是 $\left( \mathrm{R}^{+} , \mathrm{R} , + , \cdot \right)$ 不是线性空间.

例5 设S是双向无穷数列组成的集合，S的元素为

$$\left\{ y_{k} \right\} = \left\{ \cdots, y_{-2}, y_{-1}, y_{0}, y_{1}, y_{2}, \cdots \right\}.$$

设 $\{ z _ { k } \}$ 是S的另一个元素，规定 S的加法 $\because + \cdots$ 与数乘“·”如下:

$$\left\langle y_{k} \right\rangle + \left\langle z_{k} \right\rangle = \left\langle \cdots, y_{-2} + z_{-2}, y_{-1} + z_{-1}, y_{0} + z_{0}, y_{1} + z_{1}, y_{2} + z_{2}, \cdots \right\rangle,$$

$$\lambda \cdot \left\{ y_{k} \right\} = \left\{ \cdots,\lambda y_{- 2},\lambda y_{- 1},\lambda y_{0},\lambda y_{1},\lambda y_{2},\cdots \right\}.$$

[page:219]

容易验证，S对以上规定的加法与数乘构成实数域上的线性空间

S的元素来自于工程技术，在任何时刻都可采样的信号，如电信号、光信号、机械信号等，可用 $\{ y _ { k } \}$ 这样的元素描述.我们将S这样的线性空间称为信号空间.

由以上各例可见，线性空间所包含的内容十分广泛.线性空间中的元素也称为向量，这种向量可以是第三章中那种既有大小、又有方向的向量，也可以是n维向量$\left( a _ { 1 } , a _ { 2 } , \cdots , a _ { n } \right)$ ，还可以是函数、矩阵、复数等.同时还看到，对于同一个集合V，由于所取的数域P不同，或者所定义的加法与数乘运算不同，有的可以构成线性空间，有的却不能构成线性空间

线性空间 $(V,P,+,\cdot)$ 称为数域P上的线性空间.实数域上的线性空间称为实线性空间；复数域上的线性空间称为复线性空间.

线性空间具有以下性质:

(1)零元素是惟一的；

(2)任一元素的负元素是惟一的(α的负元素记为一α)；

(3) $\alpha = 0 , \quad ( - 1 ) \alpha = - \alpha , \quad k 0 = 0 ;$ _

(4) 若 $k \alpha = 0$ ，则k=0或 $\alpha = 0 ,$

我们只证明其中的性质(1)，而将其余性质的证明留给读者.

证（1）设 $0_{1},0_{2}$ 都是线性空间 $(V,P,+,\cdot)$ 的零元素，则 $V a \in V$

$$\alpha + 0 = \alpha , \quad \alpha + 0 _ { 2 } = \alpha ,$$

于是

$$0_{1}=0_{1}+0_{2}=0_{2}+0_{1}=0_{2}$$

## 二、子空间

设 $(V,P,+,\cdot)$ 是一个线性空间， $W \subset V$ ，则有时 $(W, P, +, \cdot)$ 也可以构成一个线性空间.例如，对于全体n阶实矩阵的集合 $R^{n \times n}$ 以及矩阵的加法与数乘. $( R ^ { n \times n } , \mathbb { R }$ $+ , \cdot )$ 是线性空间.对于 $R^{n \times n}$ 的子集合 $\boldsymbol{W} = \left\{ \boldsymbol{A} \mid \boldsymbol{A} \in \boldsymbol{R}^{n \times n}, \boldsymbol{A}^{\mathrm{T}} = \boldsymbol{A} \right\}$ ，容易验证: $(W,\mathbf{R}$ $主 , \cdot )$ 也是一个线性空间.

定义2设 $(V,P,+,\cdot)$ 是线性空间， $W \subset V$ ,如果 $(W, P, +, \cdot)$ 也是线性空间，则称 $(W, P, +, \cdot)$ 为 $(V,P,+,\cdot)$ 的线性子空间.

线性子空间简称为子空间.故有时也称W为V的子空间

如果 $(V,P,+,\cdot)$ 是线性空间， $W \subset V$ ，对系统 $(W,P,+,\cdot)$ 而言，运算“+”与“·”所应满足的八条运算规则中， $1^{\circ},2^{\circ},5^{\circ},6^{\circ},7^{\circ},8^{\circ}$ 显然满足.如果“+”与“。”在W中封闭，则由 $\alpha \in W$ 可得 $(-1)\alpha = -\alpha \in W$ ，于是规则4°成立.又因 $\alpha + ( - \alpha ) = 0 \in$ W，于是规则3°成立.所以对于 $(W,P,+,\cdot)$ ，只要“+”与“。”在W中封闭， $(W,P$ $+ , \cdot )$ 就是线性空间，因而也就是 $(V,P,+,\cdot)$ 的子空间.由此可得

定理设 $W \subset V$ ，则系统 $(W, P, +, \cdot)$ 是线性空间 $(V,P,+,\cdot)$ 的子空间的充分必要条件是“+”与“·”在W中封闭.

例6设 $(V,P,+,\cdot)$ 是一个线性空间， $V_{1}=V,V_{2}=\left \{ 0 \right \}$ ,则 $V _ { 1 }$ 与 $V_{2}$ 都是V的子空间.这两个特殊的子空间称为V的平凡子空间， $V$ 的其他子空间称为非平凡子

[page:220]

空间.

例7 设 $\boldsymbol{\alpha}_{1}=(1,2,3,4),\boldsymbol{\alpha}_{2}=(0,2,1,3)$

$$L \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } \right) = \left\{ k _ { 1 } \boldsymbol { \alpha } _ { 1 } + k _ { 2 } \boldsymbol { \alpha } _ { 2 } \mid k _ { 1 } , k _ { 2 } \in \mathbf { R } \right\} .$$

任取 $\boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 2 } \in L \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } \right)$ ,即

$$\boldsymbol { \beta } _ { 1 } = l _ { 1 } \boldsymbol { \alpha } _ { 1 } + l _ { 2 } \boldsymbol { \alpha } _ { 2 } , \quad \boldsymbol { \beta } _ { 2 } = t _ { 1 } \boldsymbol { \alpha } _ { 1 } + t _ { 2 } \boldsymbol { \alpha } _ { 2 } ,$$

则

$$\boldsymbol { \beta } _ { 1 } + \boldsymbol { \beta } _ { 2 } = ( l _ { 1 } + t _ { 1 } ) \boldsymbol { \alpha } _ { 1 } + ( l _ { 2 } + t _ { 2 } ) \boldsymbol { \alpha } _ { 2 } \in L \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } \right) ,$$

$$\lambda \cdot \boldsymbol{\beta}_{1}=(\lambda l_{1})\boldsymbol{\alpha}_{1}+(\lambda l_{2})\boldsymbol{\alpha}_{2}\in L(\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2}).$$

所以 $L \left( \alpha_{1} , \alpha_{2} \right)$ 是 $\mathbf { \tilde { R } } ^ { 4 }$ 的子空间.

一般地，设V(P)是线性空间， $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r} \in V$ ,则

$$L\left( \boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{r} \right) = \left( k_{1}\boldsymbol{\alpha}_{1} + k_{2}\boldsymbol{\alpha}_{2} + \cdots + k,\boldsymbol{\alpha}_{r} \mid k_{i} \in P,i = 1,2,\cdots,r \right)$$

是V的子空间，称为由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r}$ 生成的子空间.

例8设

$$\widetilde { W } = \left\{ \left( s , t , 0 \right) \mid s , t \in \mathbf { R } \right\} ,$$

则W又可表示为

$$\boldsymbol { W } = \left\{ s \boldsymbol { \alpha } _ { 1 } + t \boldsymbol { \alpha } _ { 2 } \mid \boldsymbol { \alpha } _ { 1 } = ( 1 , 0 , 0 ) , \boldsymbol { \alpha } _ { 2 } = ( 0 , 1 , 0 ) , s , t \in \mathbf { R } \right\} ,$$

所以W是由 $\boldsymbol{\alpha}_{1} = (1,0,0)$ 与 $\boldsymbol{\alpha}_{2} = (0, 1, 0)$ 所生成的 $\mathbf{R}^{3}$ 的子空间.

例9设 $W_{1}$ 是过坐标原点的直线 $l_{1}:\frac{x}{3}=\frac{y}{2}=z$ 上的向量全体组成的集合， $W_{2}$

是不过坐标原点的直线 $l_{2}:\begin{cases}x + y + z = 1 ; \\x - y + z = 1\end{cases}$ 上的向量全体组成的集合

$l _ { 1 }$ 上任意二向量 $\alpha_{1}$ 与 $\alpha_{2}$ 的和 $\alpha_{1} + \alpha_{2}$ 仍在 $l _ { \perp }$ 上，任一实数λ与 $l _ { 1 }$ 上的任一向量α的乘积λα仍在 $l _ { 1 }$ 上，所以 $W_{1}$ 是 $\mathbf{R}^{3}$ 的子空间.

$l _ { 2 }$ 上的向量α与其负向量一α的和 $\alpha + ( - \alpha ) = 0$ ，因为 $l _ { 2 }$ 不经过原点，所以0不在 $l _ { 2 }$ 上，故 $W_{2}$ 不是 $\mathbb { R } ^ { 3 }$ 的子空间.

例10设 $V_{1},V_{2}$ 是线性空间V的子空间，则

$$\begin{aligned} &V_{1} \cap V_{2} = \{ \boldsymbol{\alpha} \mid \boldsymbol{\alpha} \in V_{1}  且  \boldsymbol{\alpha} \in V_{2} \}, \quad\\ &V_{1} + V_{2} = \{ \boldsymbol{\alpha}_{1} + \boldsymbol{\alpha}_{2} \mid \boldsymbol{\alpha}_{1} \in V_{1}, \boldsymbol{\alpha}_{2} \in V_{2} \}\\ \end{aligned}$$

分别称为 $V _ { 1 }$ 与 $V _ { 2 }$ 的交与和.

请读者自己证明， $V_{1} \cap V_{2}$ 与 $V_{1} + V_{2}$ 都是V的子空间.

根据向量组生成子空间的定义以及子空间的和的定义可知:设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{r}$ 与$\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{s}$ 是数域P上线性空间V的两个向量组，则

[page:221]

$$L\left( \boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{r} \right) + L\left( \boldsymbol{\beta}_{1},\boldsymbol{\beta}_{2},\cdots,\boldsymbol{\beta}_{r} \right) = L\left( \boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{r},\boldsymbol{\beta}_{1},\boldsymbol{\beta}_{2},\cdots,\boldsymbol{\beta}_{r} \right).$$

下面介绍有用的矩阵列空间和行空间以及 $\mathbf{R}^{n}$ 的正交子空间的概念.

定义3 设向量 $\alpha \in \mathbb{R}^n, W$ 是 $\mathbf{R}^{n}$ 的一个子空间，如果对于任意的 $\gamma \in W$ ,都有$( \alpha , \gamma ) = 0$ ,就称α与子空间W正交，记作 $a \perp W$

定义4 设V和W是 $\mathbf{R}^{n}$ 的两个子空间，如果对于任意的 $\alpha \in V, \beta \in W$ ,都有$( \alpha , \beta ) = 0$ ，就称V和W正交，记作 $V \perp W$

例如， $\mathbf { R } ^ { 3 }$ 中 $O x y$ 平面上的全体向量和z轴上的全体向量，分别是 $\mathbf { R } ^ { 3 }$ 的二维和一维子空间，它们是两个正交的子空间.但是过原点互相垂直的两个平面上的全体向量构成的两个子空间不是正交的子空间(因为它们交线上的非零向量自身的内积不等于零).

定义5矩阵A的列(行)向量组生成的子空间，称为矩阵A的列(行)空间.

若A为 $m \times n$ 矩阵，则A的列向量组 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{n} \in \mathbb{R}^{m}$ ，行向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ $\in \mathbb { R } ^ { n }$ ，于是A的列空间为 $L \left( \boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{n} \right)$ 是 $\mathbb{R}^{m}$ 的一个子空间 $; A$ 的行空间为 $L \left( \alpha_{1} \right.$ $\alpha_{2},\cdots,\alpha_{m}$ 是 $\mathbf{R}^{n}$ 的一个子空间.

第四章讲过，非齐次线性方程组 $Ax = b$ 有解的充要条件之一为 $^ { a } b$ 是A的列向量组的线性组合”.根据矩阵列空间的定义，这个充要条件也可叙述为 $^ { \circ } b$ 属于A的列空间”.

齐次线性方程组 $A\bar{x} = 0$ ,即

$$\begin{cases}a_{11}x_{1} + a_{12}x_{2} + \cdots + a_{1n}x_{n} = 0, \\a_{21}x_{1} + a_{22}x_{2} + \cdots + a_{2n}x_{n} = 0, \\\cdots\cdots\cdots\cdots \\a_{m1}x_{1} + a_{m2}x_{2} + \cdots + a_{mn}x_{n} = 0.\end{cases}$$

其每个解向量与系数矩阵A的每个行向量都正交，所以解空间与A的行空间是正交的。

定义 $6 \quad \mathbf { R } ^ { n }$ 中与子空间V正交的全部向量所构成的集合

$$W = \left\{ \alpha \mid \alpha \perp V, \alpha \in \mathbf{R}^n \right\}$$

称为V的正交补，记作 $W = V^{\perp}$

容易证明， $\mathbf{R}^{n}$ 的子空间V的正交补 $V^{\perp}$ 是 $\mathbf{R}^{n}$ 的一个子空间(留作习题).

例如 $\cdot AX \equiv 0$ 的解空间是由与A的行向量都正交的全部向量构成，所以解空间是A的行空间的正交补.这是 $AX = 0$ 解空间的一个基本性质。

## 题7.1

1. 下列各系统 $(V,P,+,\cdot)$ 是否构成线性空间?

(1) $V = \left\{ (a,b,a,b,\cdots,a,b) \mid a,b \in \mathbf{R} \right\}$ ，P=实数域 $R , \quad + \quad$ 与“·”为 $\mathbf{R}^{n}$ 中的加法与数乘；

[page:222]

(2) $V = \left\{ \left( a _ { 1 } , a _ { 2 } , \cdots , a _ { n } \right) \mid \sum _ { i = 1 } ^ { n } a _ { i } = 1 , a _ { i } \in \mathbf { R } \right\} , P =$ 有理数域 $\widetilde{\mathbf{Q}}, ''  +  ''$ 与“·”为 $\mathbf{R}^{n}$中的加法与数乘；

（3）V={全体3阶实对称矩阵}，P=实数域 $R , ''  +  ''$ 与“。”为矩阵的加法与数乘；

(4)V={全体n阶实可逆矩阵}，P=实数域 $R , \quad +$ 与“·”为矩阵的加法与数乘；

(5) $V = \left\{ f(x) \mid f(x) = a_{0} + a_{1}x + \cdots + a_{n}x^{n}, a_{n} \neq 0, a_{i} \in \mathbf{R} \right\} , P =$ 有理数域Q，$\text{" }+  "与"·"$ 为多项式的加法与数乘.

2. 下列各集合W是否构成 $\mathbf{R}^{n}$ 的子空间？

(1) $\boldsymbol{W}=\left\{\left(a_{1}, a_{2}, \cdots, a_{n}\right) \mid a_{1}+a_{2}=0, a_{i} \in \mathbf{R}\right\}$

(2) $W = \left\{ \left( a_{1},a_{2},\cdots,a_{n} \right) \mid a_{1} + a_{2} \neq 0,a_{i} \in \mathbf{R} \right\}$

(3) $\boldsymbol{W}=\left\{k_{1} \boldsymbol{\alpha}_{1}+k_{2} \boldsymbol{\alpha}_{2}\mid \boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{2} \in \mathbf{R}^{n}, k_{1}, k_{2} \in \mathbf{R}\right.$ ，当 $k_{1},k_{2}$ 不全为零时， $k_{1} \boldsymbol{\alpha}_{1} + k_{2} \boldsymbol{\alpha}_{2}$ ≠0}.

3. 证明:在线性空间 $(V,P,+,\cdot)$ 中，若 $k\boldsymbol{\alpha} = \boldsymbol{0}$ ,则 $k = 0$ 或 $\alpha = 0 \left( k \in P , \alpha \in V \right)$

4. 证明:线性空间V的子空间 $V_{1}$ 与 $V_{2}$ 的交 $V_{1} \bigcap V_{2}$ 和 $V_{1} + V_{2}$ 都是V的子空间.

5. 设W为线性空间V的一个子空间.证明W的正交补 $W^{\perp}$ 是V的一个子空间.

## §7.2 线性空间的基、维数与坐标

在第四章所讨论的 $\mathbf{R}^{n}$ 中向量的线性组合、线性相关、线性无关等概念，只涉及线性运算的加法与数乘，这些概念都可以推广到线性空间中来.

例如，在线性空间 $\left( R _ { n } \left[ x \right] , R , + , \cdot \right)$ 中

$$a_{0}1 + a_{1}x + \cdots + a_{n - 1}x^{n - 1}$$

是 $1,x,\cdots,x^{n-1}$ 的一个线性组合 $R_{n}[x]$ 的零元素是多项式零.由多项式理论可知，只有当 $a_{0}=a_{1}=\cdots=a_{n-1}=0$ 时，才有

$$a_{0}1 + a_{1}x + \cdots + a_{n - 1}x^{n - 1} = 0,$$

于是，在线性空间 $R_{n}[x]$ 中， $1,x,\cdots,x^{n-1}$ 是线性无关的.

## 一、基与维数

$\mathbf{R}^{n}$ 中向量组的极大无关组与秩的概念推广到线性空间中，就是基与维数的概念

定义1 在线性空间V中，如果有n个向量 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 线性无关，而V中任意n+1个向量线性相关，则称 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 为V的一组基，n称为线性空间V的维数，记为 $\dim V = n$

维数为n的线性空间称为n维线性空间.

可以证明:

(1) $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是线性空间V的一组基的充分必要条件是 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 线性无关，且V中任一向量可由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 线性表出.

(2) n维线性空间V中任意n个线性无关的向量都是V的一组基

[page:223]

例1 设

$$P _ { n } \left[ x \right] = \left\{ a _ { 0 } + a _ { 1 } x + \cdots + a _ { n - 1 } x ^ { n - 1 } \mid a _ { i } \in P , i = 0 , 1 , \cdots , n - 1 \right\} ,$$

对于多项式的加法“+”与数乘 $\cdot  , (P_{n}[x],P,+,\cdot )$ 是线性空间.在这个线性空间中， $1,x,\cdots,x^{n-1}$ 是线性无关的，且系数在P上的任一次数不大于 $n = 1$ 的多项式都可由它们线性表出，所以 $1,x,\cdots,x^{n-1}$ 是 $P_{n}[x]$ 的一组基， $P_{n}[x]$ 是n维线性空间.

例2 求线性空间 $R ^ { 2 \times 3 }$ 的一组基与维数.

解在 $\tilde { R } ^ { 2 \times 3 }$ 中，令

$$\boldsymbol { E } _ { 1 1 } = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} , \quad \boldsymbol { E } _ { 1 2 } = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 0 \end{bmatrix} , \quad \boldsymbol { E } _ { 1 3 } = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 0 & 0 \end{bmatrix} ,$$

$$\boldsymbol { E } _ { 2 1 } = \begin{bmatrix} 0 & 0 & 0 \\ 1 & 0 & 0 \end{bmatrix}, \quad \boldsymbol { E } _ { 2 2 } = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}, \quad \boldsymbol { E } _ { 2 3 } = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix},$$

设

$$k_{11}E_{11} + k_{12}E_{12} + \cdots + k_{23}E_{23} = O,$$

即

$$\begin{pmatrix}k_{11} & k_{12} & k_{13} \\k_{21} & k_{22} & k_{23}\end{pmatrix}=\begin{bmatrix}0 & 0 & 0 \\0 & 0 & 0\end{bmatrix},$$

于是 $k_{11} = k_{12} = \cdots = k_{23} = 0$ ，由此可知 $E_{11},E_{12},\cdots,E_{23}$ 线性无关.

任取

$$\boldsymbol { A } = \begin{bmatrix} a _ { 1 1 } & a _ { 1 2 } & a _ { 1 3 } \\ a _ { 2 1 } & a _ { 2 2 } & a _ { 2 3 } \end{bmatrix} \in R ^ { 2 \times 3 }$$

则

$$\boldsymbol{A} = a_{11}\boldsymbol{E}_{11} + a_{12}\boldsymbol{E}_{12} + \cdots + a_{23}\boldsymbol{E}_{23}$$

即 $R ^ { 2 \times 3 }$ 中任一向量可由 $E_{11},E_{12},\cdots,E_{23}$ 线性表出.故 $E_{11},E_{12},\cdots,E_{23}$ 是 $R ^ { 2 \times 3 }$ 的一组基， $R^{2 \times 3}$ 的维数是6.

线性空间V的子空间W也有基与维数的概念.

由于在有限维的线性空间V的子空间W中不可能有比V有更多数目的线性无关的向量组，所以，任何一个线性子空间的维数不能超过整个空间的维数.即

$$\dim ( W ) \leqslant \dim ( V ) .$$

借助维数与基的定义，容易证明:

性质设W是线性空间V的子空间， $\dim(W) = \dim(V)$ ,则 $W = V$

该性质的证明留作习题.

在线性空间V中，由向量组 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 生成的子空间 $L \left( \alpha _ { 1 } , \alpha _ { 2 } , \cdots , \alpha _ { s } \right)$ 的维数

[page:224]

等于 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 的秩， $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 的极大无关组为 $L \left( \alpha _ { 1 } , \alpha _ { 2 } , \cdots , \alpha _ { s } \right)$ 的基.对于矩阵A，

$$\dim(A 的列空间) = \dim(A 的行空间) = R(A).$$

例3 $W = \left\{ \boldsymbol{\alpha} \mid A\boldsymbol{\alpha} = \boldsymbol{0}, A \in \mathbb{R}^{n \times n}, \boldsymbol{\alpha} \in \mathbb{R}^n \right\}, W \subset \mathbb{R}^n, W$ 即为齐次线性方程组 $AX = 0$的解集合.由线性方程组的理论可知，若 $\alpha_{1},\alpha_{2} \in W,k \in \mathbb{R}$ ,则

$$\boldsymbol{\alpha}_{1}+\boldsymbol{\alpha}_{2} \in W, \quad k \boldsymbol{\alpha}_{1} \in W.$$

故 $W$ 是 $\mathbf{R}^{n}$ 的子空间.这个子空间的基就是 $A X = 0$ 的基础解系，维数为 $n - R(A)$所以

这是AX=0解空间的又一个基本性质

例4设 $W = \left\{ (x,y,z) \mid \frac{x}{3} = \frac{y}{2} = z \right\}$ ,w 是 $\mathbf { R } ^ { 3 }$ 的子空间，求W的基与维数.

解W的元素即直线 $\frac{x}{3} = \frac{y}{2} = z$ 上的向量，该直线上任一向量都可由 $\alpha \equiv$ (3,2,1)线性表出.故α是W的基， $W$ 是 $\vec{\mathbf{R}}^3$ 的1维子空间.

事实上，过原点的任一直线上的向量全体组成的集合是 $\mathbf{R}^{3}$ 的1维子空间，而过原点的任一平面上的向量全体组成的集合是 $\mathbf { \hat { R } } ^ { 3 }$ 的2维子空间.

定理1 设V是n维线性空间，W是V的m维子空间，且 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 是W的一组基，则 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 可以扩充为V的基，即在 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{m}$ 的基础上可以添加n一m个向量成为V的一组基.

## 二、坐标

在解析几何中，坐标是研究向量的有力工具，在线性空间中，同样可以利用坐标来研究向量.

定义2 设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是线性空间 $(V,P,+,\cdot)$ 的一组基，对任 $- \alpha \in V$ ,存在惟一的一组数 $a_{1},a_{2},\cdots,a_{n} \in P$ ,使

$$\boldsymbol{\alpha}=a_{1} \boldsymbol{\alpha}_{1}+a_{2} \boldsymbol{\alpha}_{2}+\cdots+a_{n} \boldsymbol{\alpha}_{n}$$

有序数组 $\left( a _ { 1 } , a _ { 2 } , \cdots , a _ { n } \right)$ 称为α在基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 下的坐标.

例5 在线性空间 $P_{4}[x]$ 中， $1,x,x^{2},x^{3}$ 是一组基， $f(x)=a_{0}+a_{1}x+a_{2}x^{2}+$ $a _ { 3 } \bar { \mathcal { X } } ^ { 3 }$ 在这组基下的坐标是 $\left( a _ { 0 } , a _ { 1 } , a _ { 2 } , a _ { 3 } \right)$

例6在 $\mathbf { R } ^ { 3 }$ 中， $\boldsymbol { \alpha } _ { 1 } = ( 1 , 0 , 0 ) , \boldsymbol { \alpha } _ { 2 } = ( 0 , 1 , 0 ) , \boldsymbol { \alpha } _ { 3 } = ( 0 , 0 , 1 )$ 是一组基.设 $\alpha =$ $(0,2,-3)$ ,则

$$\boldsymbol{\alpha} = 0\boldsymbol{\alpha}_{1} + 2\boldsymbol{\alpha}_{2} - 3\boldsymbol{\alpha}_{3}$$

α在 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 下的坐标是(0,2，—3).

同样， $\boldsymbol{\alpha}_{1}^{\prime}=(1,0,0),\boldsymbol{\alpha}_{2}^{\prime}=(1,1,0),\boldsymbol{\alpha}_{3}^{\prime}=(1,1,1)$ 也是 $\mathbf{R}^{3}$ 的一组基.为求出 $\alpha =$

[page:225]

(0,2,-3)在 $\alpha_{1}^{'} , \alpha_{2}^{'} , \alpha_{3}^{'}$ 下的坐标，可设

$$\boldsymbol{\alpha} = x_{1} \boldsymbol{\alpha}_{1} + x_{2} \boldsymbol{\alpha}_{2} + x_{3} \boldsymbol{\alpha}_{3}'$$

即

$$(0,2,-3)=(x_{1},0,0)+(x_{2},x_{2},0)+(x_{3},x_{3},x_{3})=(x_{1}+x_{2}+x_{3},x_{2}+x_{3},x_{3})$$

亦即

$$\left\{ \begin{aligned} x_{1} + x_{2} + x_{3} &= 0, \\ x_{2} + x_{3} &= 2, \\ x_{3} &= - 3, \end{aligned} \right.$$

解得 $x_{1} = - 2,x_{2} = 5,x_{3} = - 3.\alpha$ 在 $\alpha_{1}^{'} , \alpha_{2}^{'} , \alpha_{3}^{'}$ 下的坐标是(-2,5，-3).

可见同一个向量在不同基下的坐标一般是不相同的.

例7 在线性空间 $\tilde { R } ^ { 2 \times 2 }$ 中，试证:

$$\boldsymbol{A}_{1}=\begin{bmatrix}1&1\\1&1\end{bmatrix},\quad\boldsymbol{A}_{2}=\begin{bmatrix}1&1\\-1&-1\end{bmatrix},\quad\boldsymbol{A}_{3}=\begin{bmatrix}1&-1\\1&-1\end{bmatrix},\quad\boldsymbol{A}_{4}=\begin{bmatrix}-1&1\\1&-1\end{bmatrix}$$

是一组基，并求 $\boldsymbol{A} = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$ 在 $\boldsymbol{A}_{1}, \boldsymbol{A}_{2}, \boldsymbol{A}_{3}, \boldsymbol{A}_{4}$ 下的坐标.

解设 $k_{1}\boldsymbol{A}_{1} + k_{2}\boldsymbol{A}_{2} + k_{3}\boldsymbol{A}_{3} + k_{4}\boldsymbol{A}_{4} = \boldsymbol{O}$ ,即

$$\begin{aligned}\begin{bmatrix}k_{1} & k_{1} \\k_{1} & k_{1}\end{bmatrix}+\begin{bmatrix}k_{2} & k_{2} \\-k_{2} & -k_{2}\end{bmatrix}+\begin{bmatrix}k_{3} & -k_{3} \\k_{3} & -k_{3}\end{bmatrix}+\begin{bmatrix}-k_{4} & k_{4} \\k_{4} & -k_{4}\end{bmatrix}=\begin{bmatrix}0 & 0 \\0 & 0\end{bmatrix},\end{aligned}$$

亦即

$$\begin{cases}k_{1} + k_{2} + k_{3} - k_{4} = 0, \\k_{1} + k_{2} - k_{3} + k_{4} = 0, \\k_{1} - k_{2} + k_{3} + k_{4} = 0, \\k_{1} - k_{2} - k_{3} - k_{4} = 0,\end{cases}$$

此方程组的系数行列式

$$\begin{vmatrix} 1 & 1 & 1 & - 1 \\ 1 & 1 & - 1 & 1 \\ 1 & - 1 & 1 & 1 \\ 1 & - 1 & - 1 & - 1 \end{vmatrix} = \begin{vmatrix} \dot{4} & 0 & 0 & 0 \\ 1 & 1 & - 1 & 1 \\ 1 & - 1 & 1 & 1 \\ 1 & - 1 & - 1 & - 1 \end{vmatrix}$$

$$\begin{aligned}= & 4 \begin{vmatrix} & 1 & -1 & 1 \\ -1 & 1 & 1 \\ -1 & -1 & -1 \end{vmatrix} = & 16 ,\end{aligned}$$

所以方程组只有惟一零解 $k_{1}=k_{2}=k_{3}=k_{4}=0$ ,所以 $A_{1},A_{2},A_{3},A_{4}$ 线性无关.又因为$R^{2 \times 2}$ 的维数是4，所以 $A_{1},A_{2},A_{3},A_{4}$ 是 $R ^ { 2 \times 2 }$ 的一组基.

[page:226]

设 $\boldsymbol{A} = x_{1}\boldsymbol{A}_{1} + x_{2}\boldsymbol{A}_{2} + x_{3}\boldsymbol{A}_{3} + x_{4}\boldsymbol{A}_{4}$ ,即

$$\begin{aligned}\begin{vmatrix}1 & 2 \\3 & 4\end{vmatrix}=\begin{vmatrix}x_{1} & x_{1} \\x_{1} & x_{1}\end{vmatrix}+\begin{vmatrix}x_{2} & x_{2} \\-x_{2} & -x_{2}\end{vmatrix}+\begin{vmatrix}x_{3} & -x_{3} \\x_{3} & -x_{3}\end{vmatrix}+\begin{vmatrix}-x_{4} & x_{4} \\x_{4} & -x_{4}\end{vmatrix}, \\\begin{vmatrix}x_{1}+x_{2}+x_{3}-x_{4}=1, \\x_{1}+x_{2}-x_{3}+x_{4}=2, \\x_{1}-x_{2}+x_{3}+x_{4}=3, \\x_{1}-x_{2}-x_{3}-x_{4}=4,\end{vmatrix}\end{aligned}$$

解此方程组得 $x_{1}=\frac{5}{2},x_{2}=-1,x_{3}=-\frac{1}{2},x_{4}=0.A$ 在 $A_{1},A_{2},A_{3},A_{4}$ 下的坐标是 $\left( \frac{5}{2}, -1, -\frac{1}{2}, 0 \right)$

建立了坐标以后，就可以把n维线性空间V的任何一个向量α与线性空间 $\mathbf{R}^{n}$ 的向量 $\left( a _ { 1 } , a _ { 2 } , \cdots , a _ { n } \right)$ 联系起来，并且还可以将V中的运算与 $\mathbf{R}^{n}$ 中的运算联系起来.

设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是实线性空间V的基， $\alpha , \beta \in V$

$$\begin{aligned}\boldsymbol{\alpha} &= a_{1}\boldsymbol{\alpha}_{1} + a_{2}\boldsymbol{\alpha}_{2} + \cdots + a_{n}\boldsymbol{\alpha}_{n}, \\\boldsymbol{\beta} &= b_{1}\boldsymbol{\alpha}_{1} + b_{2}\boldsymbol{\alpha}_{2} + \cdots + b_{n}\boldsymbol{\alpha}_{n},\end{aligned}$$

则有

$$\begin{aligned}\alpha \quad & \leftrightarrow \quad (a_{1}, a_{2}, \cdots, a_{n}), \\\beta \quad & \leftrightarrow \quad (b_{1}, b_{2}, \cdots, b_{n}).\end{aligned}\tag{7.1}$$

(7.2)

又因为

$$\begin{aligned}\boldsymbol{\alpha} + \boldsymbol{\beta} &= (a_{1} + b_{1})\boldsymbol{\alpha}_{1} + (a_{2} + b_{2})\boldsymbol{\alpha}_{2} + \cdots + (a_{n} + b_{n})\boldsymbol{\alpha}_{n}, \\k\boldsymbol{\alpha} &= (ka_{1})\boldsymbol{\alpha}_{1} + (ka_{2})\boldsymbol{\alpha}_{2} + \cdots + (ka_{n})\boldsymbol{\alpha}_{n},\end{aligned}$$

所以

$$\boldsymbol{\alpha} + \boldsymbol{\beta} \quad \leftrightarrow \quad (a_{1}, a_{2}, \cdots, a_{n}) + (b_{1}, b_{2}, \cdots, b_{n}),\tag{7.3}$$

$$k \alpha \quad \leftrightarrow \quad k(a_1, a_2, \cdots, a_n).\tag{7.4}$$

由式(7.1)，(7.2)，(7.3)，(7.4)可见，在n维实线性空间V中取定一组基后，V中的向量与 $\mathbf{R}^{n}$ 的向量之间存在一一对应的关系.如果V中的向量α与 $\beta$ 在 $\mathbf{R}^{n}$ 中分别对应 $\boldsymbol{a}^{\prime}=(a_{1}, a_{2}, \cdots, a_{n}), \boldsymbol{\beta}^{\prime}=(b_{1}, b_{2}, \cdots, b_{n})$ ,则 $a + \beta$ 与 $k \alpha$ 在 $\mathbf{R}^{n}$ 中分别对应 $\alpha^{\prime} +$ $\beta ^ { \prime }$ 与 $k a ^ { \prime }$ ，我们称这种对应关系保持运算关系不变，同时称V与 $\mathbf{R}^{n}$ 同构.

任何一个n维实线性空间V都与 $\mathbf{R}^{n}$ 同构，而同构关系保持线性运算关系不变，因此 $i V$ 中抽象的线性运算就可以转化为 $\mathbf{R}^{n}$ 中的线性运算，并且 $\mathbf { R } ^ { n }$ 中凡是只涉及线性运算的性质都适用于V.

## 三、基变换与坐标变换

n维线性空间中任意n个线性无关的向量都可以作为V的一组基，不同的基之间

[page:227]

有什么关系呢?

设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是V的一组基， $\alpha_{1}', \alpha_{2}', \cdots, \alpha_{n}'$ 是V的另一组基，为便于叙述与区别，我们将前者称为旧基，后者称为新基.新旧基之间有如下关系:

$$\begin{cases}\boldsymbol{\alpha}_{1}' = a_{11}\boldsymbol{\alpha}_{1} + a_{21}\boldsymbol{\alpha}_{2} + \cdots + a_{n1}\boldsymbol{\alpha}_{n}, \\\boldsymbol{\alpha}_{2}' = a_{12}\boldsymbol{\alpha}_{1} + a_{22}\boldsymbol{\alpha}_{2} + \cdots + a_{nn}\boldsymbol{\alpha}_{n}, \\\quad \cdots \cdots \cdots \cdots \\\boldsymbol{\alpha}_{n}' = a_{1n}\boldsymbol{\alpha}_{1} + a_{2n}\boldsymbol{\alpha}_{2} + \cdots + a_{nn}\boldsymbol{\alpha}_{n},\end{cases}\tag{7.5}$$

记

$$\boldsymbol{A} = \begin{bmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn}\end{bmatrix},$$

利用矩阵乘法，式(7.5)可记为

$$\left( \boldsymbol { \alpha } _ { 1 } ^ { \prime } , \boldsymbol { \alpha } _ { 2 } ^ { \prime } , \cdots , \boldsymbol { \alpha } _ { n } ^ { \prime } \right) = \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { n } \right) \boldsymbol { A } ,\tag{7.6}$$

式(7.5)，(7.6)表示出新旧基之间的关系，称为基变换式.矩阵A称为从基 $\alpha_{1}, \alpha_{2}, \cdots$ $\alpha_{n}$ 到基 $\alpha_{1}', \alpha_{2}', \cdots, \alpha_{n}'$ 的过渡矩阵.不难证明:过渡矩阵是可逆的.

由式(7.6)可得

$$\left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { n } \right) = \left( \boldsymbol { \alpha } _ { 1 } { } ^ { \prime } , \boldsymbol { \alpha } _ { 2 } { } ^ { \prime } , \cdots , \boldsymbol { \alpha } _ { n } { } ^ { \prime } \right) \boldsymbol { A } ^ { - 1 } ,$$

所以从基 $\alpha_{1}', \alpha_{2}', \cdots, \alpha_{n}'$ 到基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 的过渡矩阵是 $A^{-1}$

例8 在n维线性空间中，如果从基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 到基 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{n}$ 的过渡矩阵是A，从基 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{n}$ 到基 $\gamma_{1}, \gamma_{2}, \cdots, \gamma_{n}$ 的过渡矩阵是B，则从 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 到 $\gamma _ { 1 }$ $Y_{2},\cdots,Y_{n}$ 的过渡矩阵是AB.

证 由题意得

$$\begin{aligned}\left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 2 } , \cdots , \boldsymbol { \beta } _ { n } \right) &= \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { n } \right) \boldsymbol { A } , \\\left( \boldsymbol { \gamma } _ { 1 } , \boldsymbol { \gamma } _ { 2 } , \cdots , \boldsymbol { \gamma } _ { n } \right) &= \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 2 } , \cdots , \boldsymbol { \beta } _ { n } \right) \boldsymbol { B } ,\end{aligned}$$

因此

$$\begin{aligned}\left( \boldsymbol{\gamma}_{1}, \boldsymbol{\gamma}_{2}, \cdots, \boldsymbol{\gamma}_{n} \right) &= \left[ \left( \boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{2}, \cdots, \boldsymbol{\alpha}_{n} \right) \boldsymbol{A} \right] \boldsymbol{B} \\&= \left( \boldsymbol{\alpha}_{1}, \boldsymbol{\alpha}_{2}, \cdots, \boldsymbol{\alpha}_{n} \right) \left( \boldsymbol{A} \boldsymbol{B} \right),\end{aligned}$$

所以从基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 到基 $\gamma_{1}, \gamma_{2}, \cdots, \gamma_{n}$ 的过渡矩阵是AB.

对于线性空间 $\mathbf{R}^{n}$ 的例子在§4.3我们已经列举，下面我们再看一个例子

例9 在线性空间 $P_{3}[x]$ 中，求从基 $1 , x , x ^ { 2 }$ 到基 $f_{1} = - 1 - 2x + 2x^{2},f_{2} =$ $-2-x+2x^{2},f_{3}=3+2x-3x^{2}$ 的过渡矩阵.

[page:228]

解 $\begin{aligned} &f_{1}=-1-2x+2x^{2}, \\&f_{2}=-2-x+2x^{2}, \\&f_{3}=3+2x-3x^{2},\\ \end{aligned}$ 即 $\left( f _ { 1 } , f _ { 2 } , f _ { 3 } \right) = \left( 1 , x , x ^ { 2 } \right) \begin{bmatrix} - 1 & - 2 & 3 \\ - 2 & - 1 & 2 \\ 2 & 2 & - 3 \end{bmatrix}$

基 $1 , x , x ^ { 2 }$ 到基 $f_{1},f_{2},f_{3}$ 的过渡矩阵为 $\begin{pmatrix}-1 & -2 & 3 \\-2 & -1 & 2 \\2 & 2 & -3\end{pmatrix}$

在n维线性空间中，同一个向量α在不同基下的坐标一般是不相同的，它们之间有下面的关系.

定理2设在n维线性空间中，向量α在基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 与基 $\alpha_{1}', \alpha_{2}', \cdots, \alpha_{n}$ 下的坐标分别是 $\left( a _ { 1 } , a _ { 2 } , \cdots , a _ { n } \right)$ 与 $\left( {a_{1}}^{\prime}, {a_{2}}^{\prime}, \cdots, {a_{n}}^{\prime} \right)$ ,从基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 到基 $\alpha_{1}', \alpha_{2}', \cdots$ $\alpha_{n}^{\prime}$ 的过渡矩阵是A，则有下面的坐标变换式:

$$\begin{pmatrix}a_{1} \\a_{2} \\\vdots \\a_{n}\end{pmatrix}=A\begin{bmatrix}a_{1} \\a_{2} \\\vdots \\a_{n}\end{bmatrix}, \quad  或  \quad\begin{bmatrix}a_{1} \\a_{2} \\\vdots \\a_{n}\end{bmatrix}=A^{-1}\begin{bmatrix}a_{1} \\a_{2} \\\vdots \\a_{n}\end{bmatrix}.\tag{7.7}$$

证因为

$$\begin{aligned}\boldsymbol{\alpha} &= (\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n})\begin{pmatrix}a_{1} \\a_{2} \\\vdots \\a_{n}\end{pmatrix}= (\boldsymbol{\alpha}_{1}^{\prime},\boldsymbol{\alpha}_{2}^{\prime},\cdots,\boldsymbol{\alpha}_{n}^{\prime})\begin{pmatrix}a_{1}^{\prime} \\a_{2}^{\prime} \\\vdots \\a_{n}^{\prime}\end{pmatrix}\\&= (\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n})A\begin{pmatrix}a_{1}^{\prime} \\a_{2}^{\prime} \\\vdots \\a_{n}^{\prime}\end{pmatrix},\end{aligned}$$

由坐标的惟一性得

$$\begin{pmatrix}a_{1} \\a_{2} \\\vdots \\a_{n}\end{pmatrix}=\boldsymbol{A}\begin{bmatrix}a_{1} \\a_{2} \\\vdots \\a_{n}\end{bmatrix}, \quad 或 \quad\begin{bmatrix}a_{1} \\a_{2} \\\vdots \\a_{n}\end{bmatrix}=\boldsymbol{A}^{-1}\begin{bmatrix}a_{1} \\a_{2} \\\vdots \\a_{n}\end{bmatrix}.$$

例10对于线性空间 $\vec{P}_{3}[x]$ 的两组基

$$\alpha_{1}=-1-2x+2x^{2},\ \alpha_{2}=-2-x+2x^{2},\ \alpha_{3}=3+2x-3x^{2};$$

$$\beta _ { 1 } = 1 + x + x ^ { 2 } , \beta _ { 2 } = 1 + 2 x + 3 x ^ { 2 } , \beta _ { 3 } = 2 + x ^ { 2 }$$

(1) 求从基 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 到基 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \boldsymbol{\beta}_{3}$ 的过渡矩阵；

(2) 求坐标变换公式.

[page:229]

解（1）由

$$\begin{aligned}(\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\boldsymbol{\alpha}_{3})&=(1,x,x^{2})\boldsymbol{A},\\(\boldsymbol{\beta}_{1},\boldsymbol{\beta}_{2},\boldsymbol{\beta}_{3})&=(1,x,x^{2})\boldsymbol{B},\end{aligned}$$

其中

$$\boldsymbol{A} = \begin{bmatrix} - 1 & - 2 & 3 \\ - 2 & - 1 & 2 \\ 2 & 2 & - 3 \end{bmatrix}, \quad \boldsymbol{B} = \begin{bmatrix} 1 & 1 & 2 \\ 1 & 2 & 0 \\ 1 & 3 & 1 \end{bmatrix},$$

得

$$\left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 2 } , \boldsymbol { \beta } _ { 3 } \right) = \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \boldsymbol { \alpha } _ { 3 } \right) \boldsymbol { A } ^ { - 1 } \boldsymbol { B } ,$$

从基 $\alpha_{1},\alpha_{2},\alpha_{3}$ 到基 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \boldsymbol{\beta}_{3}$ 的过渡矩阵为 $\boldsymbol{A}^{-1} \boldsymbol{B} = \begin{pmatrix}2 & 4 & 3 \\9 & 20 & 8 \\7 & 15 & 7\end{pmatrix}$

(2)坐标变换公式为

$$\begin{pmatrix}a_{1} \\a_{2} \\a_{3}\end{pmatrix}=\begin{pmatrix}2 & 4 & 3 \\9 & 20 & 8 \\7 & 15 & 7\end{pmatrix}\begin{pmatrix}a_{1}^{\prime} \\a_{2}^{\prime} \\a_{3}^{\prime}\end{pmatrix}$$

下面以 $\mathbf{R}^{2}$ 为例对基变换与坐标变换作几何解释.

在 $\mathbf{R}^{2}$ 中，任何两个线性无关的向量都可以作为 $\mathbf{R}^{2}$ 的基.例如， $\boldsymbol{\alpha}_{1} = (1,0), \boldsymbol{\alpha}_{2} =$ (0,1)可以作为 $\bar { \mathbf { R } } ^ { 2 }$ 的基.这两个向量相互正交，且长度都是1.以这两个向量的方向作为坐标轴 $O x$ 与 $O y$ 的正向，以它们的长度作为x轴与 $\mathcal { Y }$ 轴的单位，就可以构成一个直角坐标系 $, \mathbf{R}^2$ 中任一向量如 $\alpha = (2,3)$ ,可由 $\alpha_{1}, \alpha_{2}$ 线性表出，

$$\alpha = 2\alpha_{1} + 3\alpha_{2}$$

$\alpha$ 在基 $\alpha_{1},\alpha_{2}$ 下的坐标是(2,3).如果将α作平行移动，使其起点与坐标原点重合，则其终点在 $O x y$ 坐标系下的坐标也是(2,3)(如图7.1).

同样， $\boldsymbol{\beta}_{1}=(1,1),\boldsymbol{\beta}_{2}=(-1,2)$ 也是 $\widetilde { \mathbf { R } } ^ { 2 }$ 的基.这两个向量不正交，长度也不相等.

[page:230]

以这两个向量的方向作为坐标轴 $O x ^ { \prime } , O y ^ { \prime }$ 的正向，以它们的长度分别作为 $O x ^ { \prime } , O y ^ { \prime }$的单位，也可以构成一个坐标系.这种坐标系称为仿射坐标系.仿射坐标系的坐标轴可以不垂直，每个坐标轴上的单位长度也可以不相等.α=(2，3)也可以由 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}$ 线性表出，

$$\boldsymbol{\alpha} = \frac{7}{3} \boldsymbol{\beta}_{1} + \frac{1}{3} \boldsymbol{\beta}_{2}.$$

α在 $\beta_{1}, \beta_{2}$ 下的坐标是 $\left( \frac{7}{3}, \frac{1}{3} \right), \boldsymbol{\alpha}, \boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}$ 的关系如图7.2所示.

将仿射坐标系 $O x ^ { \prime } y ^ { \prime }$ 转变为直角坐标系Oxy，也就是将基 $\beta_{1}, \beta_{2}$ 换为 $\alpha_{1}, \alpha_{2}$ ,这就是前面所说的基变换的几何背景.

因为

$$\begin{cases}\boldsymbol{\beta}_{1} = \boldsymbol{\alpha}_{1} + \boldsymbol{\alpha}_{2} , \\\boldsymbol{\beta}_{2} = - \boldsymbol{\alpha}_{1} + 2\boldsymbol{\alpha}_{2} ,\end{cases}$$

所以从 $\alpha_{1}, \alpha_{2}$ 到 $\beta_{1}, \beta_{2}$ 的过渡矩阵为 $\boldsymbol{A} = \begin{bmatrix} 1 & -1 \\ 1 & 2 \end{bmatrix}$ ，相应的坐标变换式为

$$\begin{aligned}\begin{bmatrix}x \\y\end{bmatrix}= \boldsymbol{A}\begin{bmatrix}x^{\prime} \\y^{\prime}\end{bmatrix}.\end{aligned}$$

对于 $\alpha = (2,3)$ ,α在两组基下的坐标分别为

$$(x,y)=(2,3),\quad (x^{\prime},y^{\prime})=\left[\frac{7}{3},\frac{1}{3}\right].$$

而

$$\boldsymbol{A} \begin{bmatrix} x' \\ y' \end{bmatrix} = \begin{bmatrix} 1 & -1 \\ 1 & 2 \end{bmatrix} \begin{bmatrix} \frac{7}{3} \\ \frac{1}{3} \\ \end{bmatrix} = \begin{bmatrix} 2 \\ 3 \\ \end{bmatrix} = \begin{bmatrix} x \\ y \\ \end{bmatrix},$$

与前面关于 $\mathbf{R}^{n}$ 中基变换与坐标变换的讨论是一致的.

[page:231]

1. 确定习题7.1第1题中各线性空间的维数与一组基.

2. 确定习题7.1第2题中各子空间的维数与一组基.

3. 求 $x_{1} + x_{2} + \cdots + x_{n} = 0$ 的解空间的维数与一组基.

4. 设 $\mathbf { R } ^ { + } \equiv \{$ 所有正实数}，定义 $a \oplus b = ab, k \circ a = a^k, k \in \mathbb{R}$ .确定线性空间$(R^{+},R,\oplus,\circ)$ 的维数与一组基.

5. 证明:

(1) $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是线性空间V的一组基的充分必要条件是 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 线性无关且V中任一向量都可由 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 线性表出；

(2)n维线性空间中任意n个线性无关的向量都是V的一组基.

6. 设W是线性空间V的子空间，且 $\dim(W) = \dim(V)$ ，证明: $W = V .$

7. 在 $\mathbf { R } ^ { 3 }$ 中求向量 $\alpha = (1,2,1)$ 在基 $\boldsymbol{\alpha}_{1}=(1,1,1),\boldsymbol{\alpha}_{2}=(1,1,-1),\boldsymbol{\alpha}_{3}=(1,-1,-1)$下的坐标.

8. 在 $\mathbf{R}^{n}$ 中求向量 $\boldsymbol{a} = (a_{1}, a_{2}, \cdots, a_{n})$ 在基 $\boldsymbol{\alpha}_{1}=(1,1,\cdots,1),\boldsymbol{\alpha}_{2}=(1,1,\cdots,1,0),\cdots$ $\boldsymbol{\alpha}_{n} = (1, 0, \cdots, 0)$ 下的坐标.

9. 设 $E_{ij}$ 是第i行、第j列处的元为数1，而其余元为零的2阶方阵.

(1) 证明: $\boldsymbol{E}_{11}, \boldsymbol{E}_{22}, \boldsymbol{E}_{12} + \boldsymbol{E}_{21}, \boldsymbol{E}_{12} - \boldsymbol{E}_{21}$ 是 $R ^ { 2 \times 2 }$ 的一组基；

(2) 求 $\boldsymbol{A} = \begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix}$ 在这组基下的坐标.

10.设 $c_{1}\boldsymbol{\alpha} + c_{2}\boldsymbol{\beta} + c_{3}\boldsymbol{\gamma} = \mathbf{0}$ ，且 $C_{1},C_{3} \neq 0$ .证明: $L \left( \alpha , \beta \right) = L \left( \beta , \gamma \right)$

11. 在 $P ^ { + }$ 中，求向量 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 生成的子空间的基与维数.设

$$\boldsymbol{\alpha}_{1}=(2,1,3,1),\boldsymbol{\alpha}_{2}=(1,2,0,1),\boldsymbol{\alpha}_{3}=(-1,1,-3,0),\boldsymbol{\alpha}_{4}=(1,1,1,1);$$

(2) $\boldsymbol{\alpha}_{1}=(2,1,3,-1),\boldsymbol{\alpha}_{2}=(-1,1,-3,1),\boldsymbol{\alpha}_{3}=(4,5,3,-1),\boldsymbol{\alpha}_{4}=(1,5,$ -3,1).

12. 求由向量 $\alpha_{1}, \alpha_{2}$ 生成的子空间 $L \left( \alpha_{1} , \alpha_{2} \right)$ 与 $\beta_{1},\beta_{2}$ 生成的子空间的 $L \left( \boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2} \right)$ 的交与和的基与维数.

(1) $\boldsymbol{\alpha}_{1}=(1,2,1,0),\boldsymbol{\alpha}_{2}=(-1,1,1,1),\boldsymbol{\beta}_{1}=(2,-1,0,1),\boldsymbol{\beta}_{2}=(1,-1,3,7)$

$$\boldsymbol{\alpha}_{1}=(1,1,0,0),\boldsymbol{\alpha}_{2}=(1,0,1,1),\boldsymbol{\beta}_{1}=(0,0,1,1),\boldsymbol{\beta}_{2}=(0,1,1,0).$$

13. 在 $\mathbf { R } ^ { 4 }$ 中，求一非零向量α，使α在下面两组基下有相同的坐标:

$$\begin{cases}\boldsymbol{\alpha}_{1} = (1,0,0,0), \\\boldsymbol{\alpha}_{2} = (0,1,0,0), \\\boldsymbol{\alpha}_{3} = (0,0,1,0), \\\boldsymbol{\alpha}_{4} = (0,0,0,1);\end{cases}\quad\begin{cases}\boldsymbol{\eta}_{1} = (2,1,-1,1), \\\boldsymbol{\eta}_{2} = (0,3,1,0), \\\boldsymbol{\eta}_{3} = (5,3,2,1), \\\boldsymbol{\eta}_{4} = (6,6,1,3).\end{cases}$$

14. 已知 $1,x,x^{2},x^{3}$ 是线性空间 $P_{4}[x]$ 的一组基.

(1) 证明 $1,1+x,(1+x)^{2},(1+x)^{3}$ 也是 $P_{4}[x]$ 的一组基；

[page:232]

(2) 求由基 $1,x,x^{2},x^{3}$ 到 $1,1+x,(1+x)^{2},(1+x)^{3}$ 的过渡矩阵；

(3) 求由基 $1,1+x,(1+x)^{2},(1+x)^{3}$ 到基 $1,x,x^{2},x^{3}$ 的过渡矩阵；

(4) 求 $a_{0}+a_{1}x+a_{2}x^{2}+a_{3}x^{3}$ 在基 $1,1+x,(1+x)^{2},(1+x)^{3}$ 下的坐标.

15. 设 $\boldsymbol{\beta}_{1}=(-1,1),\boldsymbol{\beta}_{2}=(-1,-2)$ 是直角坐标系 $O x y$ 中的两个向量，以 $\beta_{1}, \beta_{2}$ 的方向为仿射坐标系 $O x ^ { \prime } y ^ { \prime }$ 中坐标轴 $O x ^ { \prime }$ 与 $O y ^ { \prime }$ 的正向，以 $\beta_{1}, \beta_{2}$ 的长度为 $O x ^ { \prime }$ 与 $O y ^ { \prime }$的单位长度.求向量 $\boldsymbol{\beta} = ( - 2, 5 )$ 在 $O x ^ { \prime } y ^ { \prime }$ 下的坐标.

## 7.3欧氏空间

在讨论向量空间 $\mathbf{R}^{n}$ 时，我们曾经利用内积把 $\widetilde { \mathbf { R } } ^ { 3 }$ 中向量的长度与夹角等概念引人 $\mathbf { R } ^ { n }$ 中，现在我们同样可以利用内积把向量的长度与夹角引入实线性空间 $(V,R,+$ ·)，并讨论V(R)中向量组的规范正交化问题.

## 一、内积

定义1 设 $(V,R,+,\cdot)$ 是线性空间，如果V中任意两个元素 $\alpha , \beta$ 可进行某种运算，将这种运算记为 $( \alpha , \beta )$ ，其运算结果是一个实数，且运算满足以下条件:

(1) $( \alpha , \beta ) = ( \beta , \alpha )$

(2) $\left( \boldsymbol{\alpha} + \boldsymbol{\beta} , \boldsymbol{\gamma} \right) = \left( \boldsymbol{\alpha} , \boldsymbol{\gamma} \right) + \left( \boldsymbol{\beta} , \boldsymbol{\gamma} \right)$

(3) $( \alpha , \alpha ) \geqslant 0$ ，当且仅当 $\alpha = 0$ 时等号成立，则称 $( \alpha , \beta )$ 为线性空间 $(V,R,+,\cdot)$ 的一个内积.

定义了内积的实线性空间称为欧氏空间

例1设 $\alpha , \beta \in \mathbb { R } ^ { n } , \alpha = ( a _ { 1 } , a _ { 2 } , \cdots , a _ { n } ) , \beta = ( b _ { 1 } , b _ { 2 } , \cdots , b _ { n } )$ ,则 $( \alpha , \beta ) = a_{1} b_{1} +$ $a_{2}b_{2}+\cdots+a_{n}b_{n}$ 为 $\mathbf{R}^{n}$ 的一个内积，这是我们在第五章所熟悉的内积.

设A是 n阶正定矩阵，规定α与 $\beta$ 的运算如下:

$$( \alpha , \beta ) = \alpha A \beta ^ { \mathrm { T } }$$

则由矩阵的乘法可知， $\boldsymbol{\alpha} \boldsymbol{A} \boldsymbol{\beta}^{\mathrm{T}}$ 是一个实数，且

(1) $\left( \boldsymbol{\alpha}, \boldsymbol{\beta} \right) = \boldsymbol{\alpha} \boldsymbol{A} \boldsymbol{\beta}^{\mathrm{T}} = \boldsymbol{\beta} \boldsymbol{A} \boldsymbol{\alpha}^{\mathrm{T}} = \left( \boldsymbol{\beta}, \boldsymbol{\alpha} \right)$

(2) $\left( \boldsymbol{\alpha} + \boldsymbol{\beta} , \boldsymbol{\gamma} \right) = \left( \boldsymbol{\alpha} + \boldsymbol{\beta} \right) \boldsymbol{A} \boldsymbol{\gamma}^{\mathrm{T}} = \boldsymbol{\alpha} \boldsymbol{A} \boldsymbol{\gamma}^{\mathrm{T}} + \boldsymbol{\beta} \boldsymbol{A} \boldsymbol{\gamma}^{\mathrm{T}} = \left( \boldsymbol{\alpha} , \boldsymbol{\gamma} \right) + \left( \boldsymbol{\beta} , \boldsymbol{\gamma} \right);$

(3) $\left( \boldsymbol{\alpha} , \boldsymbol{\alpha} \right) = \boldsymbol{\alpha} \boldsymbol{A} \boldsymbol{\alpha}^{\mathrm{T}} \geqslant 0$ ，当且仅当 $\alpha = 0$ 时等号成立.

所以 $( \alpha , \beta ) = \alpha A \beta^{\mathrm{T}}$ 也是 $\mathbf{R}^{n}$ 的一个内积.

对于不同的内积， $\left( \mathrm{R}^{n}, \mathrm{R}, + , \cdot \right)$ 构成不同的欧氏空间.

例2 $\left( C \left[ a , b \right] , R , + , \cdot \right)$ 是一个线性空间，对任意的 $f(x),g(x) \in C[a,b]$ ,规定 $f(x) , g(x)$ 的运算

$$\left( f \left( x \right) , g \left( x \right) \right) = \int _ { a } ^ { b } f \left( x \right) g \left( x \right) \mathrm{d} x ,$$

则

$$\left( f \left( x \right) , g \left( x \right) \right) = \int _ { a } ^ { b } f \left( x \right) g \left( x \right) \mathrm{d}x = \int _ { a } ^ { b } g \left( x \right) f \left( x \right) \mathrm{d}x = \left( g \left( x \right) , f \left( x \right) \right) ;$$

[page:233]

$$\begin{aligned}(2) \left( f(x) + g(x), h(x) \right) &= \int_{a}^{b} \left[ f(x) + g(x) \right] h(x)   dx \\&= \int_{a}^{b} f(x) h(x)   dx + \int_{a}^{b} g(x) h(x)   dx \\&= \left( f(x), h(x) \right) + \left( g(x), h(x) \right);\end{aligned}$$

(3) $\left( f \left( x \right) , f \left( x \right) \right) = \int _ { a } ^ { b } f ^ { 2 } \left( x \right) \mathrm{d}x \geqslant 0$ ，当且仅当 $f(x) = 0$ 时等号成立，

所以 $\left( f \left( x \right) , g \left( x \right) \right) = \int _ { a } ^ { b } f \left( x \right) g \left( x \right) \mathrm{d} x$ 是线性空间 $(C[a,b],R,+\cdot )$ 的一个内积.

## 二、内积的性质

有了内积概念，可以定义欧氏空间 $(V,R,+,\cdot)$ 的向量长度.

设 $(V, \mathrm{R}, +, \cdot)$ 是欧氏空间，则

$$\left\| \alpha \right\| = \sqrt{\left( \alpha,\alpha \right)} , \alpha \in V$$

称为向量α的模(长度，范数).

在欧氏空间中，有以下两个重要不等式:

1. 柯西不等式

$$\left| ( \alpha , \beta ) \right| \leqslant \left| \alpha \right| \left| \beta \right|$$

或

$$( \alpha , \beta ) ^ { 2 } \leqslant ( \alpha , \alpha ) ( \beta , \beta ) .$$

这个不等式的证明与§5.3中相应不等式的证明完全一致.有了这个不等式，就可以定义欧氏空间中两个向量的夹角:

$$\left( \boldsymbol { \alpha } , \boldsymbol { \beta } \right) = \arccos \frac { \left( \boldsymbol { \alpha } , \boldsymbol { \beta } \right) } { \left\| \boldsymbol { \alpha } \right\| \left\| \boldsymbol { \beta } \right\| } .$$

## 2. 三角不等式

$$\left\| \boldsymbol{\alpha} + \boldsymbol{\beta} \right\| \leqslant \left\| \boldsymbol{\alpha} \right\| + \left\| \boldsymbol{\beta} \right\|.$$

例3设 $a,b,c \in \mathbb{R}^{+}$ 且 $a + b + c = 1$ ，证明 $\frac{1}{a} + \frac{1}{b} + \frac{1}{c} \geqslant 9$

证设 $\boldsymbol{\alpha} = (\sqrt{a} , \sqrt{b} , \sqrt{c} ) , \boldsymbol{\beta} = \left( \frac{1}{\sqrt{a}} , \frac{1}{\sqrt{b}} , \frac{1}{\sqrt{c}} \right)$ ,则

$$\left( \alpha , \beta \right) ^ { 2 } \leqslant \left\| \alpha \right\| ^ { 2 } \left\| \beta \right\| ^ { 2 } ,$$

即

$$(1 + 1 + 1)^{2} \leqslant (a + b + c)\left(\frac{1}{a} + \frac{1}{b} + \frac{1}{c}\right) = \frac{1}{a} + \frac{1}{b} + \frac{1}{c}.$$

所以 $\frac{1}{a} + \frac{1}{b} + \frac{1}{c} \geqslant 9$

[page:234]

例4设 $f(x),g(x) \in C[a,b]$ ，证明:

$$\left( \int _ { a } ^ { b } f ( x ) g ( x ) \mathrm { d } x \right) ^ { 2 } \leqslant \int _ { a } ^ { b } f ^ { 2 } ( x ) \mathrm { d } x \int _ { a } ^ { b } g ^ { 2 } ( x ) \mathrm { d } x .$$

这个题目在微积分中是一个技巧性比较强的题目，如果利用柯西不等式，则是一个直接结果.

证设 $\left( f \left( x \right) , g \left( x \right) \right) = \int _ { a } ^ { b } f \left( x \right) g \left( x \right) \mathrm{d} x$ ，则 $(f(x),g(x))$ 是欧氏空间$(C[a,b],R,+,\cdot)$ 的一个内积，由柯西不等式可得

$$\begin{aligned}\left( f(x), g(x) \right)^{2} &= \left( \int_{a}^{b} f(x) g(x) \mathrm{d}x \right)^{2} \\& \leqslant \left( f(x), f(x) \right) \left( g(x), g(x) \right) \\&= \int_{a}^{b} f^{2}(x) \mathrm{d}x \int_{a}^{b} g^{2}(x) \mathrm{d}x.\end{aligned}$$

## 三、标准正交基

定义2 设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是欧氏空间V(R)的一组基，且满足:

(1) $\left( \boldsymbol{\alpha}_{i}, \boldsymbol{\alpha}_{j} \right) = 0 \left( i \neq j \right)$

(2) $\left\| \boldsymbol{a}_{i} \right\| = 1 (i = 1,2,\cdots,n)$

则称 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 为欧氏空间V(R)的一组标准(规范)正交基.

例5在线性空间 $R_{3}[x]$ 中，规定 $f(x) , g(x)$ 的内积如下:

$$\left( f \left( x \right) , g \left( x \right) \right) = \int _ { - 1 } ^ { 1 } f \left( x \right) g \left( x \right) \mathrm{d} x.$$

将 $1 , x , x ^ { 2 }$ 化为 $R_{3}[x]$ 的标准正交基.

解将线性无关向量组化为标准正交向量组的方法同 $\mathbf{R}^{n}$ 中的施密特正交化方法是一致的.

$$\beta_{1} = 1   ,$$

$$\beta_{2}=x-\frac{(x,1)}{(1,1)}\cdot 1=x-\frac{\int_{-1}^{1}x\mathrm{d}x}{\int_{-1}^{1}\mathrm{d}x}=x,$$

$$\beta_{3}=x^{2}-\frac{\left(x^{2}, 1\right)}{(1,1)} \cdot 1-\frac{\left(x^{2}, x\right)}{(x, x)} \cdot x$$

$$x^{2}-\frac{\int_{-1}^{1}x^{2}\mathrm{d}x}{\int_{-1}^{1}\mathrm{d}x}-\frac{\int_{-1}^{1}x^{3}\mathrm{d}x}{\int_{-1}^{1}x^{2}\mathrm{d}x}\cdot x=x^{2}-\frac{1}{3}$$

$$\gamma _ { 1 } = \frac { 1 } { \left\| \beta _ { 1 } \right\| } \beta _ { 1 } = \frac { 1 } { \sqrt { \int _ { - 1 } ^ { 1 } \mathrm { d } x } } \cdot 1 = \frac { \sqrt { 2 } } { 2 } ,$$

[page:235]

$$\gamma _ { 2 } = \frac { 1 } { \left\| \beta _ { 2 } \right\| } \beta _ { 2 } = \frac { 1 } { \sqrt { \int _ { - 1 } ^ { 1 } x ^ { 2 } \mathrm { d } x } } \cdot x = \frac { \sqrt { 6 } } { 2 } x ,$$

$$\begin{aligned}\gamma_{3} &= \frac{1}{\left\| \beta_{3} \right\|} \beta_{3} = \frac{1}{\sqrt{\int_{- 1}^{1}\left( x^{2} - \frac{1}{3} \right)^{2}\mathrm{d}x}} \cdot \left( x^{2} - \frac{1}{3} \right) \\&= \frac{\sqrt{10}}{4}(3x^{2} - 1).\end{aligned}$$

$\gamma_{1}, \gamma_{2}, \gamma_{3}$ 是 $R _ { 3 } [ x ]$ 的一组标准正交基.

## 题7.3

1. 证明欧氏空间中勾股定理成立，即若 $\alpha \perp \beta$ ，则 $\boldsymbol{\alpha} + \boldsymbol{\beta} \parallel^2 = \parallel \boldsymbol{\alpha} \parallel^2 + \parallel \boldsymbol{\beta} \parallel^2$

2. 设 $\alpha , \beta$ 是n维欧氏空间V中两个不同的向量，且 $\left\| \begin{array}{c} \boldsymbol{\alpha} \end{array} \right\| = \left\| \begin{array}{c} \boldsymbol{\beta} \end{array} \right\| = 1$ .证明: $( \alpha , \beta ) \neq 1$

3. 在线性空间 $R_{3}[x]$ 中，规定内积 $\left( f \left( x \right) , g \left( x \right) \right) = \int _ { a } ^ { b } f \left( x \right) g \left( x \right) \mathrm{d} x$ ，问 $1,x,x^{2}-\frac{1}{3}$是否是 $R_{3}[x]$ 的一组正交基?

## 7.4 线性变换

线性空间V的元素之间的联系可以用V到自身的映射来表现.线性空间V到自身的映射称为变换，而线性变换是线性空间中最简单也是最基本的一种变换.

## 一、线性变换的概念与性质

定义1 设V是数域P上的线性空间，σ是V的一个变换，且σ满足:

$$\sigma \left( \alpha + \beta \right) = \sigma \left( \alpha \right) + \sigma \left( \beta \right) , \quad \forall \alpha , \beta \in V ;$$

$$2 ^ { \circ } \quad \sigma ( k \alpha ) = k \sigma ( \alpha ) , \quad \forall k \in P , \alpha \in V ,$$

则称σ是线性空间V的线性变换.

例1 在线性空间 $\mathbf { R } ^ { 3 }$ 中，规定σ如下:

$$\sigma ( a _ { 1 } , a _ { 2 } , a _ { 3 } ) = ( 0 , a _ { 1 } , a _ { 2 } ) ,$$

则 $\sigma$ 显然是 $\mathbf { R } ^ { 3 }$ 的一个变换.对 $\mathbf{R}^{3}$ 的任意两个向量 $\boldsymbol{\alpha} = (a_{1}, a_{2}, a_{3}), \boldsymbol{\beta} = (b_{1}, b_{2}, b_{3})$ 及任意的 $k \in \mathbb{R}$

$$\begin{aligned}\sigma(\boldsymbol{\alpha} + \boldsymbol{\beta}) &= \sigma(a_{1} + b_{1}, a_{2} + b_{2}, a_{3} + b_{3}) = (0, a_{1} + b_{1}, a_{2} + b_{2}) \\&= (0, a_{1}, a_{2}) + (0, b_{1}, b_{2}) = \sigma(\boldsymbol{\alpha}) + \sigma(\boldsymbol{\beta}) ;\end{aligned}$$

$$\begin{aligned}\sigma(k\boldsymbol{\alpha}) &= \sigma(ka_{1},ka_{2},ka_{3}) = (0,ka_{1},ka_{2}) \\&= k(0,a_{1},a_{2}) = k\sigma(\boldsymbol{\alpha}).\end{aligned}$$

[page:236]

所以σ是 $\mathbf{R}^{3}$ 的线性变换.

例2 在线性空间 $\mathbf { R } ^ { 3 }$ 中，规定τ如下:

$$\tau \left( a _ { 1 } , a _ { 2 } , a _ { 3 } \right) = \left( a _ { 1 } ^ { 2 } , a _ { 2 } ^ { 2 } , a _ { 3 } ^ { 2 } \right) ,$$

则 $\tau$ 是 $\mathbf{R}^{3}$ 的一个变换.对 $\mathbf{R}^{3}$ 中两个向量 $\boldsymbol{\alpha} = (a_{1}, a_{2}, a_{3}), \boldsymbol{\beta} = (b_{1}, b_{2}, b_{3})$

$$\begin{aligned}\tau(\boldsymbol{\alpha} + \boldsymbol{\beta}) &= \tau(a_{1} + b_{1}, a_{2} + b_{2}, a_{3} + b_{3}) \\&= ((a_{1} + b_{1})^{2}, (a_{2} + b_{2})^{2}, (a_{3} + b_{3})^{2})\end{aligned}$$

$$\begin{aligned}\tau(\boldsymbol{\alpha}) + \tau(\boldsymbol{\beta}) &= (a_{1}^{2}, a_{2}^{2}, a_{3}^{2}) + (b_{1}^{2}, b_{2}^{2}, b_{3}^{2}) \\&= (a_{1}^{2} + b_{1}^{2}, a_{2}^{2} + b_{2}^{2}, a_{3}^{2} + b_{3}^{2}).\end{aligned}$$

在一般情况下

$$\tau \left( \boldsymbol{\alpha} + \boldsymbol{\beta} \right) \neq \tau \left( \boldsymbol{\alpha} \right) + \tau \left( \boldsymbol{\beta} \right).$$

τ不是 $\tilde{\mathbf{R}}^{3}$ 的线性变换.

例3 在线性空间 $R_{n}[x]$ 中，规定σ如下:

$$\sigma ( f ( x ) ) = f ^ { \prime } ( x ) ,$$

则 $\sigma$ 是 $R_{n}[x]$ 的变换.对任意的 $f(x),g(x) \in R_{n}[x]$ 以及 $k \in \mathbb{R}$

(1) $\sigma \left( f \left( x \right) + g \left( x \right) \right) = f ^ { \prime } \left( x \right) + g ^ { \prime } \left( x \right) = \sigma \left( f \left( x \right) \right) + \sigma \left( g \left( x \right) \right)$

(2) $\sigma ( k f ( x ) ) = k f ^ { \prime } ( x ) = k \sigma ( f ( x ) )$ 8

所以在 $R_{n}[x]$ 中，求导运算是线性变换.

例4 在数域P上的线性空间V中，规定τ为

$$\tau ( \alpha ) = k \alpha ,$$

其中k为P中一常数，α为V中任意向量.则容易验证，τ是V的线性变换.这个线性变换称为数乘变换.

当 $k = 0$ 时， $\tau ( \alpha ) = 0 \alpha = 0$ .即τ将V中的所有向量都变成零向量，这个特殊的数乘变换τ称为零变换，记为0.

当k=1时， $\tau(\alpha) = 1\alpha = \alpha$ .这个特殊的数乘变换称为恒等变换

例5 旋转变换一 $\mathbf{R}^{2} \left( \widehat{O} x y \right)$ 平面上以原点为始点的全体向量)中每个向量绕原点按逆时针方向旋转θ角的变换 $R_{\theta}$ 是 $\mathbf{R}^{2}$ 的一个线性变换（图7.3）.即 $V a =$ $(x,y) \in \mathbb{R}^2$ ，

$$R _ { \theta } ( x , y ) = R _ { \theta } ( \alpha ) = \alpha ^ { \prime } = ( x ^ { \prime } , y ^ { \prime } ) ,\tag{7.8}$$

其中 $| \alpha | = r$ ，而

$$\begin{aligned}x^{\prime} = r\cos(\beta + \theta) = & r\cos\beta\cos\theta - r\sin\beta\sin\theta \\= & x\cos\theta - y\sin\theta, \\y^{\prime} = & r\sin(\beta + \theta) = r\sin\beta\cos\theta + r\cos\beta\sin\theta \\= & y\cos\theta + x\sin\theta.\end{aligned}$$

图7.3

于是， $\forall \boldsymbol{\alpha}_{1}=(x_{1}, y_{1}), \boldsymbol{\alpha}_{2}=(x_{2}, y_{2}) \in \mathbf{R}^{2}$ 和 $\forall \lambda, \mu \in \mathbb{R}$ ，由(7.8)式即得

[page:237]

$$\begin{aligned} &R_{\theta}(\lambda \boldsymbol{\alpha}_{1}+\mu \boldsymbol{\alpha}_{2})\\=&R_{\theta}(\lambda x_{1}+\mu x_{2},\lambda y_{1}+\mu y_{2})\\=&((\lambda x_{1}+\mu x_{2})\cos \theta-(\lambda y_{1}+\mu y_{2})\sin \theta,(\lambda x_{1}+\mu x_{2})\sin \theta+(\lambda y_{1}+\mu y_{2})\cos \theta)\\=&\lambda(x_{1}\cos \theta-y_{1}\sin \theta,x_{1}\sin \theta+y_{1}\cos \theta)+\mu(x_{2}\cos \theta-y_{2}\sin \theta,x_{2}\sin \theta+y_{2}\cos \theta)\\=&\lambda R_{\theta}(x_{1},y_{1})+\mu R_{\theta}(x_{2},y_{2})=\lambda R_{\theta}(\boldsymbol{\alpha}_{1})+\mu R_{\theta}(\boldsymbol{\alpha}_{2}).\end{aligned}$$

故 $R_{\theta}$ 是 $\mathbf { R } ^ { 2 }$ 的一个线性变换.

不难发现，线性变换σ具有以下性质:

(1) $\sigma \left( 0 \right) = 0 , \sigma \left( - \alpha \right) = - \sigma \left( \alpha \right)$

(2) $\sigma \left( k _ { 1 } \boldsymbol { \alpha } _ { 1 } + k _ { 2 } \boldsymbol { \alpha } _ { 2 } + \cdots + k _ { s } \boldsymbol { \alpha } _ { s } \right) = k _ { 1 } \sigma \left( \boldsymbol { \alpha } _ { 1 } \right) + k _ { 2 } \sigma \left( \boldsymbol { \alpha } _ { 2 } \right) + \cdots + k _ { s } \sigma \left( \boldsymbol { \alpha } _ { s } \right) ;$

(3) 若 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 线性相关，则 $\sigma \left( \alpha _ { 1 } \right) , \sigma \left( \alpha _ { 2 } \right) , \cdots , \sigma \left( \alpha _ { s } \right)$ 也线性相关.

值得注意的是，线性变换可能将线性无关的向量组变为线性相关的向量组.例如，在例3中， $1,x,x^{2},\cdots,x^{n - 1}$ 是 $R_{n}[x]$ 中n个线性无关的向量，

$$\sigma(1)=0,\;\sigma(x)=1,\;\sigma(x^{2})=2x,\;\cdots,\;\sigma(x^{n-1})=(n-1)x^{n-2},$$

而 $\sigma(1), \sigma(x), \cdots, \sigma(x^{n-1})$ 是线性相关的.

这是因为σ作为V到自身的映射未必是一一映射.如果σ是V到自身的一一映射，则称σ为可逆线性变换.此时有下面的性质:

(4）若σ是可逆线性变换，则 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 线性相关的充分必要条件是 $\sigma \left( \alpha_{1} \right)$ $\sigma \left( \alpha _ { 2 } \right) , \cdots , \sigma \left( \alpha _ { s } \right)$ 线性相关.

## 二、线性变换的运算

定义2设σ,τ是数域P上线性空间V(P)的线性变换， $k \in P$ ，规定:

以上运算分别称为线性变换的加法、数乘与乘法 $\sigma + \tau , k \sigma , \sigma \tau$ 也是线性变换.

例6在 $\mathbf { R } ^ { 2 }$ 中，线性变换σ与τ分别是

$$\sigma \left( a , b \right) = \left( b , - a \right) , \tau \left( a , b \right) = \left( a , - b \right) ,$$

计算 $2\sigma - 3\tau, \tau\sigma$

$$\begin{aligned}&\left( 2\sigma - 3\tau \right)(a,b) = 2\sigma(a,b) - 3\tau(a,b) \\&\quad = 2(b, - a) - 3(a, - b) = (2b - 3a, - 2a + 3b). \\&\left( \tau\sigma \right)(a,b) = \tau(\sigma(a,b)) = \tau(b, - a) = (b,a).\end{aligned}$$

线性变换的加法与数乘满足以下运算规则:

[page:238]

4°σ+(-σ)=0;
5°lσ=σ;
6° k(lσ)=(kl)σ;
7° k(σ+τ)=kσ+kτ;
8° (k+l)σ=kσ+lo,

其中 $0 , \tau , \varphi$ 是线性空间V中任意的线性变换， $3 ^ { \circ }$ 中的0表示零变换， $4 ^ { \circ }$ 中的一σ表示σ的负变换， $- \sigma = ( - 1 ) \sigma , k , l$ 是数域P中任意的数.

例7 设W={数域P上线性空间V的所有线性变换}，则对于线性变换的加法“+”与数乘“。”，系统 $(W,P,+,\cdot)$ 构成线性空间.

线性变换的乘法满足以下运算规则:

9° (στ)φ=σ(τφ);
10° σ(τ+φ)=στ+σφ;
11° (σ+τ)φ=σφ+τφ.
一般地，σσ记为 $\sigma ^ { 2 } , \sigma \tau \neq \tau \sigma$

## 三、线性变换的矩阵

由前面的讨论可见，线性变换加法、数乘以及乘法所满足的运算规则与矩阵的相应运算所满足的运算规则完全是相同的，这一点并非偶然，因为线性变换与矩阵之间有着密切的关系

定义3设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是线性空间V(P)的一组基，σ是V(P)的线性变换

$$\begin{cases}\sigma(\boldsymbol{\alpha}_{1}) = a_{11}\boldsymbol{\alpha}_{1} + a_{21}\boldsymbol{\alpha}_{2} + \cdots + a_{n1}\boldsymbol{\alpha}_{n}, \\\sigma(\boldsymbol{\alpha}_{2}) = a_{12}\boldsymbol{\alpha}_{1} + a_{22}\boldsymbol{\alpha}_{2} + \cdots + a_{n2}\boldsymbol{\alpha}_{n}, \\\quad \cdots \cdots \cdots \cdots \\\sigma(\boldsymbol{\alpha}_{n}) = a_{1n}\boldsymbol{\alpha}_{1} + a_{2n}\boldsymbol{\alpha}_{2} + \cdots + a_{nn}\boldsymbol{\alpha}_{n},\end{cases}\tag{7.9}$$

则矩阵

$$\boldsymbol{A} = \begin{pmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn}\end{pmatrix}$$

称为σ在基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 下的矩阵.

利用矩阵的乘法，式(7.9)可记为

$$\left( \sigma \left( \boldsymbol { \alpha } _ { 1 } \right) , \sigma \left( \boldsymbol { \alpha } _ { 2 } \right) , \cdots , \sigma \left( \boldsymbol { \alpha } _ { n } \right) \right) = \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { n } \right) \boldsymbol { A } ,$$

或简记为

$$\sigma \left( \alpha _ { 1 } , \alpha _ { 2 } , \cdots , \alpha _ { n } \right) = \left( \alpha _ { 1 } , \alpha _ { 2 } , \cdots , \alpha _ { n } \right) A.$$

由于 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是 $V \left( P \right)$ 的基，所以矩阵A的各个列向量作为 $\sigma ( a _ { 1 } )$

[page:239]

$\sigma \left( \alpha _ { 2 } \right) , \cdots , \sigma \left( \alpha _ { n } \right)$ 在基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 下的坐标是惟一确定的.这就是说，线性变换在确定的基下对应惟一的矩阵A.反之，对于给定的矩阵A和确定的基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ ,通过式(7.9)也可以惟一确定一个线性变换.所以在一组确定的基下，线性变换与其矩阵之间是一一对应的.

例8在 $\mathbf { R } ^ { 3 }$ 中，求线性变换

$$\sigma ( a _ { 1 } , a _ { 2 } , a _ { 3 } ) = ( a _ { 1 } + a _ { 2 } , a _ { 2 } + a _ { 3 } , a _ { 3 } + a _ { 1 } )$$

在基 $\boldsymbol{\alpha}_{1}=(1,0,0),\boldsymbol{\alpha}_{2}=(0,1,0),\boldsymbol{\alpha}_{3}=(0,0,1)$ 下的矩阵.

解 $\sigma \left( \alpha _ { 1 } \right) = \left( 1 , 0 , 1 \right) = 1 \cdot \alpha _ { 1 } + 0 \cdot \alpha _ { 2 } + 1 \cdot \alpha _ { 3 }$

$$\sigma \left( \boldsymbol { \alpha } _ { 2 } \right) = \left( 1 , 1 , 0 \right) = 1 \cdot \boldsymbol { \alpha } _ { 1 } + 1 \cdot \boldsymbol { \alpha } _ { 2 } + 0 \cdot \boldsymbol { \alpha } _ { 3 }$$

$$\sigma \left( \boldsymbol { \alpha } _ { 3 } \right) = \left( 0 , 1 , 1 \right) = 0 \cdot \boldsymbol { \alpha } _ { 1 } + 1 \cdot \boldsymbol { \alpha } _ { 2 } + 1 \cdot \boldsymbol { \alpha } _ { 3 } ,$$

故σ在 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 下的矩阵为

$$\underline{A} = \begin{pmatrix}1 & 1 & 0 \\0 & 1 & 1 \\1 & 0 & 1\end{pmatrix}.$$

例9在 $R_{n}[x]$ 中，求线性变换 $\sigma \left( f \left( x \right) \right) = f ^ { \prime } \left( x \right)$ 在基1， $x,x^{2},\cdots,x^{n - 1}$ 下的矩阵.

解

$$\begin{align*}\sigma(1) &= 0 \bullet 1 + 0 \bullet x + 0 \bullet x^2 + \cdots + 0 \bullet x^{n-2} + 0 \bullet x^{n-1}, \\\sigma(x) &= 1 \bullet 1 + 0 \bullet x + 0 \bullet x^2 + \cdots + 0 \bullet x^{n-2} + 0 \bullet x^{n-1}, \\\sigma(x^2) &= 0 \bullet 1 + 2 \bullet x + 0 \bullet x^2 + \cdots + 0 \bullet x^{n-2} + 0 \bullet x^{n-1}, \\\cdots &\cdots \cdots \cdots \\\sigma(x^{n-1}) &= 0 \bullet 1 + 0 \bullet x + 0 \bullet x^2 + \cdots + (n-1) \bullet x^{n-2} + 0 \bullet x^{n-1}.\end{align*}$$

所以σ在基 $1,x,x^{2},\cdots,x^{n-1}$ 下的矩阵是

$$\boldsymbol{A} = \begin{pmatrix}0 & 1 & 0 & \cdots & 0 \\0 & 0 & 2 & \cdots & 0 \\\vdots & \vdots & \vdots & & \vdots \\0 & 0 & 0 & \cdots & n - 1 \\0 & 0 & 0 & \cdots & 0\end{pmatrix},$$

定理1 设σ,τ是线性空间V(P)的线性变换， $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是 $V(P)$ 的一组基，σ，τ在这组基下的矩阵分别是A，B，则在这一组基下:

$1 ^ { \circ } \quad \sigma + \tau .$ 的矩阵是A+B；

$2 ^ { \circ } k \sigma$ 的矩阵是kA;

$3 ^ { \circ } \quad \sigma \tau$ 的矩阵是AB;

$4 ^ { \circ } \quad \bar { \sigma }$ 是可逆线性变换的充要条件是A为可逆矩阵

证 $1^{\circ} \quad \sigma(\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n}) = (\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n})A$ 9

$$\tau \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { n } \right) = \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { n } \right) \boldsymbol { B } ,$$

[page:240]

$$\begin{aligned}\left( \sigma + \tau \right)\left( \boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n} \right) &= \sigma\left( \boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n} \right) + \tau\left( \boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n} \right) \\&= \left( \boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n} \right)\boldsymbol{A} + \left( \boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n} \right)\boldsymbol{B} \\&= \left( \boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n} \right)\left( \boldsymbol{A} + \boldsymbol{B} \right),\end{aligned}$$

所以 $\sigma + \tau$ 在基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 下的矩阵是 $A + B$

$2 ^ { \circ } , 3 ^ { \circ } , 4 ^ { \circ }$ 的证明留给读者.

同一个线性变换在不同基下的矩阵一般是不相同的，这些矩阵之间的关系由以下定理给出:

定理2设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 与 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{n}$ 是线性空间V的两组基，从 $\alpha_{1}, \alpha_{2}, \cdots$ $\alpha_{n}$ 到 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{r}$ 的过渡矩阵是 $P$ ，线性变换 $\sigma$ 在这两组基下的矩阵分别是A与 $B$则 $\boldsymbol{B} = \boldsymbol{P}^{-1} \boldsymbol{A} \boldsymbol{P}$

证由已知条件，

$$\begin{align*}\sigma(\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n}) &= (\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n})A , \\\sigma(\boldsymbol{\beta}_{1},\boldsymbol{\beta}_{2},\cdots,\boldsymbol{\beta}_{n}) &= (\boldsymbol{\beta}_{1},\boldsymbol{\beta}_{2},\cdots,\boldsymbol{\beta}_{n})B , \\(\boldsymbol{\beta}_{1},\boldsymbol{\beta}_{2},\cdots,\boldsymbol{\beta}_{n}) &= (\boldsymbol{\alpha}_{1},\boldsymbol{\alpha}_{2},\cdots,\boldsymbol{\alpha}_{n})P ,\end{align*}$$

所以

$$\sigma \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 2 } , \cdots , \boldsymbol { \beta } _ { n } \right) = \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { n } \right) \boldsymbol { P } \boldsymbol { B } .\tag{7.10}$$

又

$$\sigma \left( \boldsymbol { \beta } _ { 1 } , \boldsymbol { \beta } _ { 2 } , \cdots , \boldsymbol { \beta } _ { n } \right) = \sigma \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { n } \right) \boldsymbol { P } = \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { n } \right) \boldsymbol { A } \boldsymbol { P } .\tag{7.11}$$

比较(7.10)，(7.11)两式得

$$PB = AP$$

P是过渡矩阵因而可逆，所以

$$\boldsymbol{B} = \boldsymbol{P}^{-1} \boldsymbol{A} \boldsymbol{P}.$$

由定理2可知，一个线性变换在不同基下的矩阵是相似的.

设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是线性空间 $V(P)$ 的一组基， $\sigma$ 是 $V(P)$ 的一个线性变换，若$\alpha \in V(P)$ ,且

$$\boldsymbol{\alpha} = x_{1}\boldsymbol{\alpha}_{1} + x_{2}\boldsymbol{\alpha}_{2} + \cdots + x_{n}\boldsymbol{\alpha}_{n}$$

则

$$\sigma(\boldsymbol{\alpha}) = x_{1}\sigma(\boldsymbol{\alpha}_{1}) + x_{2}\sigma(\boldsymbol{\alpha}_{2}) + \cdots + x_{n}\sigma(\boldsymbol{\alpha}_{n}).$$

因此，对于 $\sigma$ 来讲，如果知道了 $\sigma$ 关于 $V(P)$ 的基的像 $\sigma \left( \alpha _ { 1 } \right) , \sigma \left( \alpha _ { 2 } \right) , \cdots , \sigma \left( \alpha _ { n } \right)$ ，则任一个向量α的像 $\sigma ( a )$ 就知道了.下面的定理又进一步说明一个线性变换完全被它在一组基上的像所确定

定理3设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ 是 $V(P)$ 的一组基，如果 $V(P)$ 的两个线性变换 $\sigma$ 和 $\tau$关于这组基的像相同，即

$$\sigma \left( \boldsymbol { \alpha } _ { i } \right) = \tau \left( \boldsymbol { \alpha } _ { i } \right) , \quad i = 1 , 2 , \cdots , n ,$$

[page:241]

则 $\sigma = \tau$

证 $\sigma = \tau$ 的意义是每个向量在它们的作用下的像相同，即对于任意的 $\alpha \in V$ ，有$\sigma(\alpha) = \tau(\alpha)$ .设任一个α为

$$\alpha = x_{1}\alpha_{1} + x_{2}\alpha_{2} + \cdots + x_{n}\alpha_{n},$$

那么

$$\sigma(\boldsymbol{\alpha}) = x_{1}\sigma(\boldsymbol{\alpha}_{1}) + x_{2}\sigma(\boldsymbol{\alpha}_{2}) + \cdots + x_{n}\sigma(\boldsymbol{\alpha}_{n}) \\= x_{1}\tau(\boldsymbol{\alpha}_{1}) + x_{2}\tau(\boldsymbol{\alpha}_{2}) + \cdots + x_{n}\tau(\boldsymbol{\alpha}_{n}) = \tau(\boldsymbol{\alpha}).$$

自然地，反过来的问题是:给定 $\mathbf{R}^{n}$ 的基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ ，对于任给的n个向量 $\beta_{1}$ $\boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{n}$ ，是否存在惟一的一个线性变换σ，使得 $\sigma \left( \boldsymbol { \alpha } _ { i } \right) = \boldsymbol { \beta } _ { i } , i = 1 , 2 , \cdots , n ;$ (见本章的思考题.)

## 题7.4

1. 下列各变换中，哪些是线性变换？

(1) 在线性空间V 中 $\sigma \left( \xi \right) = \xi + \alpha \left( \alpha \right)$ 为V中一个固定的向量）；

(2) 在线性空间V 中 $\sigma(\xi) = \alpha(\alpha$ 为V中一个固定的向量)；

(3) 在 $\mathbf { \bar { R } } ^ { 3 }$ 中 $\sigma(x_{1},x_{2},x_{3})=(x_{1}^{2},x_{2}+x_{3},x_{3}^{2})$

(4) 在 $\mathbf { R } ^ { 3 }$ 中 $\sigma(x_{1},x_{2},x_{3})=(2x_{1}-x_{2},x_{2}+x_{3},x_{3})$ on

(5) 在 $R^{n \times n}$ 中 $\sigma(A)=BAC(B,C$ 是 $R ^ { n \times n }$ 中两个固定的矩阵).

2. 证明: $\sigma \left( x _ { 1 } , x _ { 2 } \right) = \left( x _ { 2 } , - x _ { 1 } \right) , \tau \left( x _ { 1 } , x _ { 2 } \right) = \left( x _ { 1 } , - x _ { 2 } \right)$ 是 $\overline{\mathbf{R}}^2$ 的两个线性变换，并求 $\sigma + \tau , \sigma \tau , \tau \sigma$

3. 求下列线性变换在给定基下的矩阵:

(1) $\sigma \left( x _ { 1 } , x _ { 2 } , x _ { 3 } \right) = \left( 2 x _ { 1 } - x _ { 2 } , x _ { 2 } + x _ { 3 } , x _ { 3 } \right)$ ，基 $\boldsymbol { a } _ { 1 } = ( 1 , 0 , 0 ) , \boldsymbol { a } _ { 2 } = ( 0 , 1$ $\boldsymbol{\alpha}_{3} = (0, 0, 1)$

(2) 设 $\mathbf{\bar{R}}^3$ 中线性变换σ在基 $\eta_{1} = (-1,1,1), \eta_{2} = (1,0,-1), \eta_{3} = (0,1,1)$ 下的矩阵是

$$\boldsymbol{A} = \begin{pmatrix}1 & 0 & 1 \\1 & 1 & 0 \\-1 & 2 & 1\end{pmatrix},$$

求σ在 $\boldsymbol{\alpha}_{1}=(1,0,0),\boldsymbol{\alpha}_{2}=(0,1,0),\boldsymbol{\alpha}_{3}=(0,0,1)$ 下的矩阵；

(3) 在 $\mathbf{R}^{3}$ 中，设 $\eta_{1} = (-1,0,2), \eta_{2} = (0,1,1), \eta_{3} = (3,-1,0), \sigma$ 定义如下:

$$\begin{cases}\sigma(\eta_{1}) = (-5, 0, 3), \\\sigma(\eta_{2}) = (0, -1, 6), \\\sigma(\eta_{3}) = (-5, -1, 9),\end{cases}$$

求σ在基 $\alpha_{1} = (1,0,0), \alpha_{2} = (0,1,0), \alpha_{3} = (0,0,1)$ 下的矩阵；

[page:242]

(4) 在 $\overline{R}^{2 \times 2}$ 中定义线性变换

$$\sigma ( \boldsymbol { A } ) = \begin{bmatrix} a & b \\ c & d \end{bmatrix} \boldsymbol { A } , \quad \tau ( \boldsymbol { A } ) = \boldsymbol { A } \begin{bmatrix} a & b \\ c & d \end{bmatrix} ,$$

求 $\sigma , \tau , \sigma + \tau , \sigma \tau$ 在基 $\boldsymbol{E}_{11}, \boldsymbol{E}_{12}, \boldsymbol{E}_{21}, \boldsymbol{E}_{22}$ (同习题7.2中题9)下的矩阵.

4. 设σ是线性空间V的线性变换，W是V的子空间， $\sigma \left( W \right) = \left\{ \sigma \left( \alpha \right) \mid \alpha \in W \right\}$ ，证明:$\sigma ( W )$ 也是V的子空间.

5. 在线性空间 $R_{n + 1}[x]$ 中 $\sigma(f(x)) = f^{\prime}(x)$ ,对于基 $1,x,\frac{x^{2}}{2!},\cdots,\frac{x^{n}}{n!}$ ,求 $\sigma , \sigma ^ { 2 } , \cdots , \sigma ^ { n }$的矩阵.

## 习题七

1. 下列各集合对于给定的加法与数乘运算，是否构成实数域R上的线性空间？

(1)V={主对角线上各元之和为零的实n阶矩阵全体}，对于矩阵的加法与数乘；

(2) $V = \{ n$ 阶实可逆矩阵全体}，对于矩阵的加法与数乘；

(3) $V = \left\{ f(x) \left| \int_{0}^{1} f(x)   dx = 0 \right. \right\}$ ，对于通常函数的加法与数乘.

2. 设 $P^{n \times n} = \left\{ \begin{aligned} \end{aligned} \right.$ 数域P上的n阶方阵全体}，对于矩阵的加法与数乘，下列哪些集合可构成 $P^{n \times n}$ 的子空间？

(1) $V_{1}=\left\{A \mid \det A=1, A \in P^{n \times n}\right\}$ ；(2) $V_{2} = \left\{ O \mid O \right.$ 是 $P^{n \times n}$ 的零矩阵}；

(3) $V_{3} = \left\{ I \mid I \right.$ 是n阶单位矩阵}；(4) $V_{4}=\left\{A \mid A^{\mathrm{T}}=A, A \in P^{n \times n}\right\}$

(5) $V_{5}=\left\{A \mid A^{\mathrm{T}} A=I\right\}$ (6) $V_{6}=\left\{ \boldsymbol{A} \mid a_{ii}=0, i=1,2,\cdots,n \right\}$

3. 设 $\alpha_{1} = (7, - 5,2,4), \alpha_{2} = (3,1,6, - 2)$ ，求 $\alpha_{3},\alpha_{4}$ ,使 $\alpha_{1}, \alpha_{2}, \alpha_{3}, \alpha_{4}$ 构成 $\mathbf{R}^{4}$ 的基。

4. 在 $\mathbf{R}^{4}$ 中，求齐次线性方程组

$$\begin{cases}2x_{1} + x_{2} - 2x_{3} + 3x_{4} = 0, \\x_{1} + x_{2} + x_{3} - x_{4} = 0, \\3x_{1} + 2x_{2} - x_{3} + 2x_{4} = 0\end{cases}$$

解空间的基与维数.

5. 已知 $\mathbf{R}^{3}$ 的两组基为

$$\boldsymbol{\alpha}_{1} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}, \qquad \boldsymbol{\alpha}_{2} = \begin{bmatrix} 1 \\ 0 \\ -1 \end{bmatrix}, \qquad \boldsymbol{\alpha}_{3} = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix};$$

$$\boldsymbol{\beta}_{1}=\begin{bmatrix}1\\2\\1\end{bmatrix}, \quad \boldsymbol{\beta}_{2}=\begin{bmatrix}2\\3\\4\end{bmatrix}, \quad \boldsymbol{\beta}_{3}=\begin{bmatrix}3\\4\\3\end{bmatrix}.$$

(1) 求由基 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 到基 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \boldsymbol{\beta}_{3}$ 的过渡矩阵；

[page:243]

(2) 求 $\mathbf{R}^{3}$ 中任一向量α在这两组基下的坐标之间的关系.

6. 在 $R ^ { 2 \times 2 }$ 中取两组基:

$$\boldsymbol { E } _ { 1 } = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix} , \boldsymbol { E } _ { 2 } = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} , \boldsymbol { E } _ { 3 } = \begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix} , \boldsymbol { E } _ { 4 } = \begin{bmatrix} 0 & 0 \\ 0 & 1 \end{bmatrix}$$

$$\boldsymbol{F}_{1}=\begin{bmatrix}3&1\\-1&1\end{bmatrix},\boldsymbol{F}_{2}=\begin{bmatrix}1&3\\1&1\end{bmatrix},\boldsymbol{F}_{3}=\begin{bmatrix}3&0\\-2&1\end{bmatrix},\boldsymbol{F}_{4}=\begin{bmatrix}1&1\\0&2\end{bmatrix}.$$

求:(1)由基 $E_{1},E_{2},E_{3},E_{4}$ 到基 $F_{1},F_{2},F_{3},F_{4}$ 的过渡矩阵；

(2) 向量 $M = \begin{bmatrix} a_{1} & a_{2} \\ a_{3} & a_{4} \end{bmatrix}$ 在基 $\left\{ E , \right\}$ 和基 $\{ F _ { i } \}$ 下的坐标；

(3)求一非零向量 $\dot{X} \in R^{2 \times 2}$ ，使X在两组基下的坐标相等.

7. 设 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 和 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \boldsymbol{\beta}_{3}$ 是 $\mathbf { R } ^ { 3 }$ 的两组基 $\boldsymbol{\beta}_{1}=2 \boldsymbol{\alpha}_{1}+\boldsymbol{\alpha}_{2}+3 \boldsymbol{\alpha}_{3}, \boldsymbol{\beta}_{2}=\boldsymbol{\alpha}_{1}+\boldsymbol{\alpha}_{2}+2 \boldsymbol{\alpha}_{3}$ $\boldsymbol{\beta}_{3}=-\boldsymbol{\alpha}_{1}+\boldsymbol{\alpha}_{2}+\boldsymbol{\alpha}_{3}$ ;线性变换σ在基 $\alpha_{1}, \alpha_{2}, \alpha_{3}$ 下的矩阵

$$\boldsymbol{A} = \begin{bmatrix} 5 & 7 & - 5 \\ 0 & 4 & - 1 \\ 2 & 8 & 3 \end{bmatrix}.$$

(1) 求σ在基 $- \alpha_{2} , 2 \alpha_{1} , \alpha_{3}$ 下的矩阵；

(2) 求σ在基 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \boldsymbol{\beta}_{3}$ 下的矩阵。

8. 设 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{s}$ 是线性空间V的一组向量，T是V的一个线性变换，证明:

$$T \left( L \left( \boldsymbol { \alpha } _ { 1 } , \boldsymbol { \alpha } _ { 2 } , \cdots , \boldsymbol { \alpha } _ { s } \right) \right) = L \left( T \boldsymbol { \alpha } _ { 1 } , T \boldsymbol { \alpha } _ { 2 } , \cdots , T \boldsymbol { \alpha } _ { s } \right).$$

9. 在 $R_{4}[x]$ 中定义内积为 $(f,g)=\int_{-1}^{1}f(x)g(x)dx$ ，将 $1,x,x^{2},x^{3}$ 化为$R_{4}[x]$ 的标准正交基.

## 思考题七

1. 对于第四章复习题中第21题，能否推广到线性空间V上的线性变换σ情形？即是否有:设σ是线性空间V上的线性变换，如果 $\sigma^{k - 1}(\alpha) \neq 0$ ，但 $\sigma^{k}(\alpha) = 0$ ，那么α，$\sigma \left( \alpha \right),\sigma ^{2}\left( \alpha \right),\cdots,\sigma ^{k - 1}\left( \alpha \right)$ 线性无关(k为大于1的正整数)?

2. 给定 $\mathbf{R}^{n}$ 的基 $\alpha_{1}, \alpha_{2}, \cdots, \alpha_{n}$ ,对于任给的n个向量 $\boldsymbol{\beta}_{1}, \boldsymbol{\beta}_{2}, \cdots, \boldsymbol{\beta}_{n}$ ，是否存在惟一的一个线性变换σ，使得 $\sigma \left( \boldsymbol { \alpha } _ { i } \right) = \boldsymbol { \beta } _ { i } , i = 1 , 2 , \cdots , n ?$

3. 证明:对于可逆线性变换 $\sigma , \alpha , \alpha , \cdots , \alpha ,$ 线性相关的充分必要条件是 $\sigma \left( \alpha_{1} \right)$ $\sigma \left( \alpha _ { 2 } \right) , \cdots , \sigma \left( \alpha _ { s } \right)$ 线性相关.对于一般的线性变换，结论是如何的？

4. 在 $\bar{\mathbf{R}}^2$ 中构造一个线性变换σ，使之为 $\mathbf{R}^{2}$ 中每个向量关于过原点的直线l相对称的

[page:244]

## 变换.

## 综合自测题七

[page:245]

## 应用案例

部分习题参考答案

[page:246]

[page:247]

## 郑重声明

高等教育出版社依法对本书享有专有出版权。任何未经许可的复制、销售行为均违反《中华人民共和国著作权法》，其行为人将承担相应的民事责任和行政责任；构成犯罪的，将被依法追究刑事责任。为了维护市场秩序，保护读者的合法权益，避免读者误用盗版书造成不良后果，我社将配合行政执法部门和司法机关对违法犯罪的单位和个人进行严厉打击。社会各界人士如发现上述侵权行为，希望及时举报，本社将奖励举报有功人员。

反盗版举报电话(010)58581999 58582371 58582488

反盗版举报传真(010)82086060

反盗版举报邮箱dd@hep.com.cn

通信地址北京市西城区德外大街4号 高等教育出版社法律事务与版权管理部

邮政编码100120

## 防伪查询说明

用户购书后刮开封底防伪涂层，利用手机微信等软件扫描二维码，会跳转至防伪查询网页，获得所购图书详细信息。用户也可将防伪二维码下的20位密码按从左到右、从上到下的顺序发送短信至106695881280，免费查询所购图书真伪。

## 反盗版短信举报

编辑短信“JB，图书名称，出版社，购买地点”发送至10669588128

防伪客服电话

(010)58582300

[page:248]

## 线性代数与空间解析几何(第五版)
