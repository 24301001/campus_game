---
course: 高等数学
book: 微积分(上册·第2版)
book_id: xbg-calc1
source_type: textbook
---

[page:1]

## 引 言

16世纪后期，丹麦天文学家第谷·布拉赫(TychoBrache)以坚韧不拔的毅力，对太阳系的行星运动进行了长达20年的精细观察，积累了丰富的观测资料.他的助手，德国人开普勒(J.Kepler)曾参与部分观测工作并继承了他的全部观测数据.在此基础上，开普勒又进行了长达20年的研究，总结出关于行星运动的三大定律.

开普勒第一定律 行星绕太阳运行(公转)的轨道是椭圆，太阳位于椭圆的一个焦点上.

开普勒第二定律从太阳中心指向一个行星的有向线段(向径)，在同样的时间内扫过同样的面积.换句话说就是向径的面积速度是常数(图0.1).

开普勒第三定律各行星公转周期的平方与其椭圆轨道长轴的立方之比是一个常数

图0.1

通过对开普勒三大定律的分析，牛顿判断行星应受到一个指向太阳的力的作用，这力的大小与行星的质量成正比，与距离的平方成反比.但这是一种什么力呢？经过缜密的思考，牛顿终于悟出其中的道理:这种力与地球上使物体下落的重力是一回事，它是存在于一切物体之间的相互吸引力.这样，牛顿总结出以下万有引力定律.

万有引力定律 任何两个物体之间都存在着一种相互吸引的力(称为万有引力).这力作用在两物体连线上，它的大小与两物体的质量的乘积成正比，而与这两物体间的距离的平方成反比.

本书将逐步说明怎样从开普勒定律导出万有引力定律，也将说明怎样从万有引力定律推导出开普勒三大定律.后一论证的重要意义在于指出:任何受到与距离平方成反比的有心力作用的物体，都遵循与行星运动相类似的运动规律.于是，我们得知，月球绕地球的运动应该遵循类似的规律；人造卫星绕地球的运动应该遵循类似的规律(牛顿实际上已从理论上预言了发射人造卫星的可能性)；原子内部的电子绕原子核的运动也应遵循类似的规律(因为原子核与电子间的静电吸引力也是与距离的平方成反比的力).

上述问题是一个数学建模的问题，它涉及一元函数微积分学和常微分方程的知识(也就是本书的全部内容)，而由于此问题对于人类生活的重大意义，对它的讨论将会引起大家的兴趣.此问题将贯穿本书，大家可以带着这个问题阅读.

[page:2]

## 引 言

本书会在某些章最后一节专门介绍如何将相关知识应用于此问题，当然，微积分的应用远远不止于此，所以每章中还会介绍许多其他方面的应用，数学理论和这些应用将构成本书的主体。本书将以这些问题把微积分的知识有机地贯穿起来.

[page:3]

北京交通大学2020...群号:1097062624

## 北交知行plus 2020学习资源分享群为小红果提供学习上的帮助。

知小行pro

知小行pro支持教师邮箱查询,校园网站快速访问,物理实验预约,软件下载等功能

第1章 函 数

初等数学的研究对象基本上是不变的量，而高等数学的研究对象则是变动的量.所谓函数关系就是变量之间的依赖关系.函数是微积分主要的研究对象，因此，本书从函数概念讲起.中学教材已介绍过函数概念和一些初等函数的性质与图形，本章将对原有知识进行复习、补充和提高

## 1.1 集合与函数

## 1.1.1 集合

## 1. 集合概念

具有某种(或某些)属性的一些对象的全体称为一个集合.集合中的每个对象称为该集合的元素.集合通常用大写的拉丁字母，如A，B，C，…来表示，元素则用小写的拉丁字母，如 $a , b , x , y , \cdots$ 来表示.当x是集合E的元素时，就说x属于E，记作 $x \in E$ ；当x不是集合E的元素时，就说x不属于E，记作 $x \in E$ 或x∉E.

不包含任何元素的集合称为空集，记作

表示集合的方法通常有两种.把集合中的元素列举出来，这种表示集合的方法称为列举法.例如，由元素 $a _ { 1 } \cdot a _ { 2 } \cdots a _ { n }$ 组成的集合A，可表示成

$$A = \left\{ a_{1}, a_{2}, \cdots, a_{n} \right\}.$$

把集合中元素所满足的条件写在元素的后面，用一条竖线隔开，外面写上大括号，这种表示集合的方法称为描述法.例如，集合

$$E = \left\{ x \mid x^{2} \leqslant 1 \right\}$$

表示所有满足不等式 $x^{2} \leqslant 1$ 的x的全体.

习惯上，全体非负整数，即自然数的集合记作N，即

$$\mathbf{N} = \left\{ 0, 1, 2, \cdots, n, \cdots \right\};$$

全体正整数的集合记作 $N ^{+}$ ,即

$$\mathbb{N}^{+} = \left\{ 1, 2, 3, \cdots, n, \cdots \right\};$$

全体整数的集合记作 $\mathbb { Z } ;$ 全体有理数的集合记作Q;全体实数的集合记作R.

2. 区间与邻域

1）有限区间(有穷区间)

设a,b为二实数，且 $a { \leq } b .$ 满足不等式 $a \leq x \leq b$ 的所有实数x的集合称为一

[page:4]

## 第1章 函 数

个闭区间，记作

$$\left[ a , b \right] = \left\{ x \mid a \leqslant x \leqslant b \right\} .$$

满足不等式 $a<x<b$ 的所有实数x的集合称为一个开区间，记作

$$(a,b)=\left\{x\mid a<x<b\right\}.$$

分别满足不等式 $a \leq x < b$ 和 $a < x \leq b$ 的所有实数x的集合称为半开区间，记作

$$\left[ a,b \right) = \left\{ x \mid a \leqslant x < b \right\}$$

和

$$\left [ a,b \right ] = \left \{ x \mid a < x \leqslant b \right \}.$$

以上各种区间都是有限区间(或有穷区间)，a与b分别称为区间的左、右端点，数 $b - a$ 称为区间的长度

## 2）无穷区间

满足不等式一 $0 0 < x < + \infty$ 的所有实数x的集合称为无穷区间，记作

$$(-\infty,+\infty)=\{x\mid-\infty<x<+\infty\}.$$

可类似写出半无穷区间

$$\begin{aligned} &(a, +\infty) = \{x \mid a < x < +\infty\}, \\&(a, +\infty) = \{x \mid a \leqslant x < +\infty\}, \\&(-\infty, a) = \{x \mid -\infty < x < a\}, \\&(-\infty, a] = \{x \mid -\infty < x \leqslant a\}.\\ \end{aligned}$$

图1.1给出了一些区间的示意图.

以点a为中心、以 $\delta ( \delta > 0 )$ 为半径的对称开区间 $(a - \delta, a + \delta)$ 称为点a的δ邻域，记作 $U(a,\delta)$ (图1.2).邻域 $U(a,\delta)$ 中除去

点a后剩余的所有点的集合称为点a的去心邻域，记作 $\stackrel{\circ}{U}(a,\delta)$

## 1.1.2 函数的概念和基本性质

## 1. 函数概念

假定在某个变化过程中有两个取实数值的变量x和y，x的变化域为X.如果

[page:5]

## 1.1 集合与函数

对于X中的每一个x值，根据某一规律(或法则)f，变量y都有唯一确定的值与它对应，就说y是x的函数，记作

$$y = f(x), \quad x \in X.$$

x称为自变量，y称为因变量.

自变量x的变化域 $D(f) = X$ 称为函数 $y = f(x)$ 的定义域.因变量 $\mathcal { Y }$ 的变化域称为函数 $y = f(x)$ 的值域，有时记作

$$R(f) = f(X) = \{ y \mid y = f(x), x \in X \}.$$

在函数的定义中，对应规律(即函数关系)及定义域是两个重要因素，而自变量和因变量采用什么符号来表示则是无关紧要的

函数的定义域通常按以下两种情形来确定:一种是对有实际背景的函数，根据实际背景中变量的实际意义确定；另一种是对抽象地用算式表达的函数，通常约定这种函数的定义域是使得算式有意义的一切实数组成的集合，通常叫做函数的自然定义域.

表示函数的主要方法有三种:表格法、图形法和解析法(公式法)，其中，用图形法表示函数是基于函数图形的概念，即坐标平面上的点集

$$\left\{ P(x,y) \mid y = f(x), x \in X \right\}$$

称为函数 $y = f(x) , x \in X$ 的图形(图1.3).

2. 一些函数的例子

例1.1 常值函数

$$y = c$$

的定义域为R，值域为{c}.图1.4中以 $c = 2$ 为例.

$$y = \left| x \right| = \left\{ \begin{aligned} & x, & x \geqslant 0, \\ & -x, & x < 0 \end{aligned} \right.$$

[page:6]

## 第1章 函 数

的定义域为R，值域为 $[ 0 , + \infty )$ (图1.5).

## 例1.3 符号函数

$$y = \mathrm{sgn}x = \begin{cases} 1, & x > 0, \\ 0, & x = 0, \\ -1, & x < 0 \end{cases}$$

的定义域为R，值域为{1，0，-1}（图1.6).

$$y = \left[ x \right]$$

表示取值为不超过x的最大整数.它的定义域为R，值域为整数集合Z(图1.7).

例1.5 狄利克雷函数

$$\bar { y } = \left\{ \begin{aligned} { } & { { } 1 , } & { } & { { } x \in Q , } \\ { } & { { } 0 , } & { } & { { } x \notin Q } \\ \end{aligned} \right.$$

的定义域为R，值域为{1，0}.

## 3. 函数的几种特性

## 1）单调性

对I内任意两点 $x_{1},x_{2}(x_{1} < x_{2})$ ,都有

设函数 $y = f(x)$ 在区间I上有定义.若

$$f(x_{1}) < f(x_{2}) \quad ( 或  \; f(x_{1}) > f(x_{2})),$$

则称 $f ( x )$ 是I上的单调递增(或单调递减)函数(图1.8).I称为$f ( x )$ 的单调区间.单调递增函数与单调递减函数统称为单调函数.

[page:7]

## 1.1 集合与函数

例如，函数 $y = x^{2}$ 在区间 $(0, +\infty)$ 内单调递增，在 $( = \infty , 0 ]$ 内单调递减(图1.9)，正弦函数 $y =$ sinx在区间 $\left( - \frac{\pi}{2}, \frac{\pi}{2} \right)$ 内单调递增，余弦函数 $y =$ cos,x在区间 $\left[ 0 , \pi \right]$ 内单调递减.

## 2）奇偶性

设函数 $y = f(x)$ 的定义域D关于原点对称，即 $x \in D \Leftrightarrow -x \in D.$ 若对D内任意一点x，都有$f(-x)=-f(x) \quad ( 或  f(-x)=f(x))$ 9

则称f(x)在D上是奇(或偶)函数.

例如，函数 $y = x^{m}$ 当m为奇数时是奇函数，当m为偶数时是偶函数奇函数的图像关于原点对称，偶函数的图像关于y轴对称(图1.10).

## 3）周期性

设存在正数T，使得函数 $y = f(x)$ 的定义域D满足 $x \in D \Leftrightarrow x \pm T \in D.$ 若对D内任意一点x，都有

$$f(x + T) = f(x)$$

[page:8]

## 第1章 函 数

则称 $f ( x )$ 为周期函数，常数T称为 $f ( x )$ 的周期.通常说周期函数的周期是指最小正周期.

例如，函数sinx，cosx都是以2π为周期的周期函数，函数tanx是以π为周期的周期函数.

并非每个周期函数都有最小正周期，如常值函数和狄利克雷函数就没有最小正周期.

## 4）有界性

设有函数 $y = f(x) , x \in X.$ 若存在正数M，使得对于所有 $x \in X$ ,都有

$$\left| f(x) \right| \leqslant M,$$

则称 $f ( x )$ 是X上的有界函数，或者说 $f ( x )$ 在X上有界.

若对于任意正数M，不论它多么大，总有一个 $x_{1} \in X$ ,使得

$$\mid f(x_{1}) \mid > M,$$

则称 $f ( x )$ 在X上无界.

例如，函数sinx，cosx都是R上的有界函数，而函数 $y = x^{n}(n$ 是正整数)，则是R上的无界函数.

## 4. 生成新函数的几种运算

## 1）四则运算

设函数 $f(x) , g(x)$ 的定义域依次为 $D_{1},D_{2},D=D_{1}\cap D_{2}\ne \varnothing$ ，则我们可以定义这两个函数的下列运算而生成新的函数:

和 $f+g\quad(f+g)(x)=f(x)+g(x),x\in D$

差 $f-g \quad (f-g)(x)=f(x)-g(x),x \in D;$

积 $f \cdot g \quad (f \cdot g)(x) = f(x) \cdot g(x), x \in D;$

$$\frac{f}{g} \quad \left( \frac{f}{g} \right)(x) = \frac{f(x)}{g(x)}, x \in D \backslash \{ x \mid g(x) = 0, x \in D \}.$$

## 2）复合函数

设有函数

$$y = f(u), \quad u \in U$$

及

$$u = \varphi(x), \quad x \in X,$$

若 $D = \left\{ x \mid x \in X, \varphi(x) \in U \right\} \neq \varnothing$ ，则在D上确定了一个新函数

$$y = f \left[ \varphi ( x ) \right] , \quad x \in D ,$$

称为 $y = f(u)$ 与 $u = \varphi(x)$ 的复合函数.也可记作

$$y = f \circ \varphi (x), \quad x \in D,$$

u称为中间变量.

[page:9]

## 1.1 集合与函数

有时，复合的手续会有好几步.例如，函数

$$y = \mathrm{l}\mathrm{g}\mathrm{sin}x^{2}$$

是由三个函数

$$y = \mathrm{lg} u, \quad u = \mathrm{sin} v, \quad v = x^{2}$$

复合而成的.

## 3）反函数

设有函数 $y = f(x) (x \in X)$ ，其值域为 $Y = f(X)$ .如果对于Y中每一个y值，都可由方程 $f(x) = y$ 唯一确定出x的值，那么就得到一个定义在集合Y上的新函数，称为 $y = f(x)$ 的反函数，记作

$$x = f^{-1}(y), \quad y \in Y.$$

例如，函数 $y = x^{3} \left( x \in R \right)$ 的反函数是 $x=\sqrt[3]{y}(y\in R)$

一般地，有下述结论:单调函数必存在反函数

习惯上通常用字母x表示自变量，用字母y表示因变量.因此，函数

$$y = f(x), \quad x \in X$$

的反函数常写成

$$y = f^{-1}(x), \quad x \in f(X).$$

$y = f(x)$ 与 $x = f^{-1}(y)$ 的图形相同，而 $y =$ $f ( x )$ 与 $y = f^{-1}(x)$ 的图形关于直线 $y = x$ 对称(图1.11).

## 5. 初等函数

在初等数学中已经讲过下面几类函数:

幂函数 $y = x^{\prime\prime} \left( \mu \in \mathbb{R} \right)$ 是常数)；

指数函数 $y = a^{x} \left( a > 0, a \neq 1 \right)$

对数函数 $y = \log_{a}x (a > 0, a \neq 1)$

图1.11

三角函数 $y=\sin x,y=\cos x,y=\tan x,y=\cot x,y=\sec x,y=\csc x;$

反三角函数 $y = \arcsin x , y = \arccos x , y = \arctan x.$

以上这五类函数统称为基本初等函数

由常数和基本初等函数经过有限次的四则运算和有限次的函数复合步骤所构成并可用一个式子表示的函数，称为初等函数.例如，多项式

$$y = a_{0} + a_{1}x + a_{2}x^{2} + \cdots + a_{n}x^{n},$$

有理函数

$$y = \frac{a_{0} + a_{1}x + a_{2}x^{2} + \cdots + a_{n}x^{n}}{b_{0} + b_{1}x + b_{2}x^{2} + \cdots + b_{nn}x^{n}}$$

以及

[page:10]

## 第1章 函 数

$$y = x + 3\sin x^{2}, \quad y = \ln(x + \sqrt{1 + x^{2}})$$

等，都是初等函数.

有一类初等函数在工程技术中经常要用到，这就是双曲函数.最常用的有以下几种

1）双曲正弦

$\mathrm{sh}x = \frac{\mathrm{e}^{x} - \mathrm{e}^{- x}}{2}$ ，它是R上单调递增的奇函数，值域为R(图1.12).

2）双曲余弦

$\mathrm{ch}x = \frac{\mathrm{e}^{x} + \mathrm{e}^{- x}}{2}$ ，它是R上的偶函数，在$( = \infty , 0 ]$ 单调递减，在 $[ 0 , + \infty )$ 单调递增，值域为 $[ 1 , + \infty )$ (图1.12).

3）双曲正切

$\mathrm{th}x = \frac{\mathrm{sh}x}{\mathrm{ch}x} = \frac{\mathrm{e}^{x} - \mathrm{e}^{- x}}{\mathrm{e}^{x} + \mathrm{e}^{- x}}$ ，它是R上单调递增的奇函数，值域为(—1,1)(图1.13).

由双曲函数的定义，不难得到公式

$$\begin{aligned}& ch ^{2}x -  sh ^{2}x = 1 , \\& sh (x \pm y) =  sh x ch y \pm  ch x sh y , \\& ch (x \pm y) =  ch x ch y \pm  sh x sh y , \\& ch (x \pm y) = \frac{ th x \pm  th y}{1 \pm  th x th y} , \\& sh 2x = 2 sh x ch x , \\& ch 2x =  ch ^{2}x +  sh ^{2}x.\end{aligned}$$

4）反双曲正弦

$y = \mathrm{arcsh}x = \ln(x + \sqrt{x^2 + 1})$ ，它是R上单调递增的奇函数(图1.14).

[page:11]

## 1.1 集合与函数

## 5）反双曲余弦

$y = \mathrm{arch}x = \ln(x + \sqrt{x^2 - 1})$ ，它的定义域是 $[ 1 , + \infty )$ ，值域是 $[ 0 , + \infty )$ ,是其定义域上的单调递增函数(图1.15).

## 6）反双曲正切

$y = \mathrm{arctan}x = \frac{1}{2}\ln\frac{1 + x}{1 - x}$ ，它的定义域是(—1，1)，值域是R，是其定义域上单调递增的奇函数(图1.16).

## 习题1.1

1. 求下列函数的自然定义域:(1) $y = \sqrt{3x + 2}$ (2) $y=\frac{1}{1-x^{2}}$ (3) $y=\frac{1}{\sqrt{4-x^{2}}}$ ; (4) $y = \tan(x + 1)$ (5) $y = \arcsin(x - 3)$ ; (6) $y = \ln(x + 1)$ ; (7) $y = \frac{\sqrt{x + 1}}{\sin x}$

2. 求下列函数的值域:(1) $y = x^{2} ,x \in \left [ -10,0 \right ] ;$ (2) $y = \lg x , x \in (0,10]$ (3) $y = \sqrt{x - x^{2}} , x \in \left [ 0,1 \right ]$ (4) $y = \frac{1}{1 - x}, x \in (0, 1).$

3. 把半径为R的一圆形铁皮，自中心处剪去中心角为α的一扇形后围成一无底圆锥.试将这圆锥的体积表示为α的函数.

4. 下列各题中，函数 f(x)和 $g(x)$ 是否相同？为什么？

$$f(x)=\lg x^{2},g(x)=2\lg x;$$

(3) $f(x)=\sqrt[3]{x^{4}-x^{3}},g(x)=x\sqrt[3]{x-1}$

$$f(x)=x,g(x)=\sqrt{x^{2}};$$

(4) $f(x)=1,g(x)=\sec^{2}x-\tan^{2}x;$ (5) $f(x)=\frac{x-1}{x^2-1},g(x)=\frac{1}{x+1};$

$$f(x)=x,g(x)=(\sqrt{x})^{2}$$

$$f(x)=1,g(x)=\sin^{2}x+\cos^{2}x;$$

[page:12]

## 第1章 函 数

(8) $f(x)=\sqrt{x+1}\sqrt{x-1},g(x)=\sqrt{x^{2}-1};$ (9) $f(x)=\lg x^{2},g(x)=2\lg|x|$ (10) $f(x)=\lg x^{3},g(x)=3\lg x.$

5. 设f(x)为定义在(—l,l)内的奇函数，若f(x)在(0,l)内单调递增，证明f(x)在(一l,0)内也单调递增.

6. 设下面所考虑的函数都是定义在(一l,l)上的.证明:

（1）两个偶函数的和是偶函数，两个奇函数的和是奇函数；

(2)两个偶函数的乘积是偶函数，两个奇函数的乘积是偶函数，偶函数与奇函数的乘积是奇函数；

(3)两个奇函数的商是偶函数，两个偶函数的商是偶函数

7.证明:定义在对称区间上的任何函数都可唯一表示成一个偶函数与一个奇函数之和

8.下列函数中哪些是偶函数，哪些是奇函数，哪些既非偶函数又非奇函数？(1) $y = x^{2}(1 - x^{2})$ (2) $y = 3x^{2} - x^{3}$ (3) $y=\frac{1-x^{2}}{1+x^{2}}$ (4) $y = x(x - 1)(x + 1);$ (5) $y = \sin x - \cos x + 1$ (6) $y = \frac{a^{x} + a^{- x}}{2}$ - (7) $y = \frac{a^{x} - a^{- x}}{2};$ (8) $y = \lg(x + \sqrt{x^2 + 1})$

9. 下列各函数中哪些是周期函数？对于周期函数，指出其周期. (1) $y = \cos(x - 2)$ ; (2) $y = \cos 4.x;$ (3) $y = 1 + \sin \pi x;$ (4) $y = x \cos x ;$ (5) $y = \sin^{2}x.$

10. 求下列函数的反函数:(1) $y = \sqrt[3]{x + 1} ;$ (2) $y = \frac{1 - x}{1 + x};$ (3) $y=\frac{ax+b}{cx+d}(ad-bc\ne0)$ (4) $y = 2\sin 3x \left( -\frac{\pi}{6} \leqslant x \leqslant \frac{\pi}{6} \right)$ ; (5) $y = 1 + \ln(x + 2)$ ·* (6) $y = \frac{2^{x}}{2^{x} + 1};$ (7) $y=\frac{1}{2}\left(x-\frac{1}{x}\right),x\in(0,+\infty)$

11. 设 f(x)的定义域 $D = [0,1]$ ，求下列各函数的定义域:(1) $f ( x ^ { 2 } )$ (2) $f(\sin x)$ (3) $f(x + a) (a > 0)$ (4) $f(x+a)+f(x-a)(a>0).$

12. 设

$$f(x)=\begin{cases}1, & \left | x \right | < 1, \\ 0, & \left | x \right | = 1, \\ -1, & \left | x \right | > 1,\end{cases} \quad g(x)=\mathrm{e}^{x},$$

求 $f[g(x)]$ 和 $g[f(x)]$ 8

## 1.2 部分微积分基础知识

本节我们把微积分要用到的部分基础知识做一下复习和补充

[page:13]

## 1.2 部分微积分基础知识

## 1.2.1 三角函数公式

任意三角函数的诱导公式可按照口诀“纵变横不变，正负看象限”记忆.即把角度按逆时针方向表示在单位圆周上，公式中遇到纵坐标轴 $\left(  如  \pm \frac{\pi}{2}, \pm \frac{3\pi}{2}  等  \right)$ , sin和 cos 互变；tan 和 cot 互变;遇到横坐标轴 $(如 \pm \pi,\pm 2\pi$ 等)，则不变.对于正负号，可把角度θ想象成锐角，诱导角度 $\left(  如  \frac{\pi}{2} + \theta  等  \right)$ 落在第几象限，对应的三角函数取什么样的正负号，公式就相应地取什么样的正负号.

$$\sin ( - \theta ) = - \sin \theta ,$$

$$\cos ( - \theta ) = \cos \theta ,$$

$$\tan ( - \theta ) = - \tan \theta ,$$

$$\sin \left( \frac{\pi}{2} \pm \theta \right) = \cos \theta,$$

$$\cos \left( \frac{\pi}{2} \pm \theta \right) = \mp \sin \theta,$$

$$\tan \left( \frac{\pi}{2} \pm \theta \right) = \mp \cot \theta,$$

$$\sin ( \pi \pm \theta ) = \mp \sin \theta ,$$

$$\cos ( \pi \pm \theta ) = - \cos \theta ,$$

$$\tan ( \pi \pm \theta ) = \pm \tan \theta ,$$

$$\sin \left( \frac{3}{2} \pi \pm \theta \right) = - \cos \theta,$$

$$\cos \left( \frac{3\pi}{2} \pm \theta \right) = \pm \sin \theta,$$

$$\tan \left( \frac{3}{2} \pi \pm \theta \right) = \mp \cot \theta,$$

$$\sin ( 2 \pi \pm \theta ) = \pm \sin \theta ,$$

$$\cos ( 2 \pi \pm \theta ) = \cos \theta ,$$

$$\tan ( 2 \pi \pm \theta ) = \pm \tan \theta ,$$

$$\sin ( n \pi \pm \theta ) = \pm ( - 1 ) ^ { n } \sin \theta ,$$

$$\cos ( n \pi \pm \theta ) = ( - 1 ) ^ { n } \cos \theta ,$$

$$\tan ( n \pi \pm \theta ) = \pm \tan \theta.$$

两角和差的三角函数公式

$$\sin ( \alpha \pm \beta ) = \sin \alpha \cos \beta \pm \cos \alpha \sin \beta$$

$$\cos ( \alpha \pm \beta ) = \cos \alpha \cos \beta \mp \sin \alpha \sin \beta,$$

$$\tan(\alpha \pm \beta) = \frac{\tan \alpha \pm \tan \beta}{1 \mp \tan \alpha \tan \beta}$$

倍角公式

$$\sin 2\alpha = 2\sin \alpha \cos \alpha = \frac{2\tan \alpha}{1 + \tan^{2}\alpha},$$

$$\cos 2\alpha = \cos^{2}\alpha - \sin^{2}\alpha = 2\cos^{2}\alpha - 1 = 1 - 2\sin^{2}\alpha = \frac{1 - \tan^{2}\alpha}{1 + \tan^{2}\alpha}$$

$$\tan 2\alpha = \frac{2\tan \alpha}{1 - \tan^{2}\alpha},$$

$$\sin 3\alpha = 3\sin \alpha - 4\sin^{3}\alpha,$$

$$\cos 3\alpha = 4\cos^{3}\alpha - 3\cos \alpha.$$

[page:14]

## 第1章 函 数

半角公式

$$\sin \frac{\alpha}{2} = \pm \sqrt{\frac{1 - \cos \alpha}{2}}$$

$$\cos \frac{\alpha}{2} = \pm \sqrt{\frac{1 + \cos \alpha}{2}}$$

$$\tan \frac{\alpha}{2} = \pm \sqrt{\frac{1 - \cos \alpha}{1 + \cos \alpha}} = \frac{1 - \cos \alpha}{\sin \alpha} = \frac{\sin \alpha}{1 + \cos \alpha}.$$

和差化积公式

$$\sin \alpha + \sin \beta = 2\sin \frac{\alpha + \beta}{2}\cos \frac{\alpha - \beta}{2},$$

$$\sin \alpha - \sin \beta = 2\cos \frac{\alpha + \beta}{2}\sin \frac{\alpha - \beta}{2},$$

$$\cos \alpha + \cos \beta = 2\cos \frac{\alpha + \beta}{2}\cos \frac{\alpha - \beta}{2},$$

$$\cos \alpha - \cos \beta = - 2 \sin \frac{\alpha + \beta}{2} \sin \frac{\alpha - \beta}{2},$$

$$\tan \alpha \pm \tan \beta = \frac{\sin(\alpha \pm \beta)}{\cos \alpha \cos \beta}.$$

积化和差公式

$$\sin \alpha \sin \beta = - \frac{1}{2} \left[ \cos ( \alpha + \beta ) - \cos ( \alpha - \beta ) \right] ,$$

$$\cos \alpha \cos \beta = \frac{1}{2} \left[ \cos (\alpha + \beta) + \cos (\alpha - \beta) \right]$$

$$\sin \alpha \cos \beta = \frac{1}{2} \left[ \sin (\alpha + \beta) + \sin (\alpha - \beta) \right].$$

## 1.2.2 反三角函数

我们规定:函数 $y = \sin x , x \in \left[ - \frac{\pi}{2} , \frac{\pi}{2} \right]$ 的反函数叫做反正弦函数，记作 $x =$ arcsiny.

习惯上，用字母x表示自变量，用 $\mathcal { Y }$ 表示函数，那么反正弦函数可以写成 $y =$ arcsinx，它的定义域是 $\left[ -1,1 \right]$ ，值域是 $\left[ - \frac{\pi}{2}, \frac{\pi}{2} \right]$

反正弦函数是单调递增的奇函数，它的图像是

[page:15]

## 1.2 部分微积分基础知识

我们规定:函数 $y = \cos x , x \in [0, \pi]$ 的反函数叫做反余弦函数，记作 $y = arc^{-}$ cosx，它的定义域是[-1，1]，值域是 $[ 0 , \pi ]$

反余弦函数是单调递减的函数，它的图像是

我们规定:函数 $y = \tan x , x \in \left( - \frac{\pi}{2}, \frac{\pi}{2} \right)$ 的反函数叫做反正切函数，记作 $y =$ arctanx，它的定义域是 $( - \infty , + \infty )$ ，值域是 $\left( - \frac{\pi}{2}, \frac{\pi}{2} \right)$

反正切函数是单调递增的奇函数，它的图像是

[page:16]

## 第1章 函 数

我们规定:函数 $y = \cot x , x \in (0, \pi)$ 的反函数叫做反余切函数，记作 $y = \mathrm{arc}^{-}$ cotx，它的定义域是 $( - \infty , + \infty )$ ，值域是 $( 0 , \pi )$

反余切函数是单调递减的函数，它的图像是

## 1.2.3 极坐标

在中学使用的是平面直角坐标系，它是最简单和最常用的一种坐标系，但不是

唯一的坐标系，在实际问题中，有时利用其他的坐标系比较方便，如炮兵射击时是以大炮为基点，利用目标的方位角以及目标与大炮的距离来确定目标的位置的.下面研究如何利用角和距离来建立坐标系.

定义1.1 在平面内取一个定点O,称为极点，引一条x射线 $O x$ ，称为极轴，再选定一个长度单位和角度的正方向(通常取逆时针方向)(图1.21).对于平面内任意一点M，

[page:17]

## 1.3 本章内容对开普勒问题的应用

用r表示线段OM的长度，θ表示从 $O x$ 到OM的角度，r称为点M的极径，θ称为点M的极角，有序数组 $( r , \theta )$ 称为点M的极坐标.这样建立的坐标系称为极坐标系.极坐标为 $( r , \theta )$ 的点M，可表示为 $M(r,\theta)$

当点M在极点时，它的极坐标 $r = 0 , \theta$ 可以取任意值.

建立极坐标系后，给定r和θ，就可以在平面内确定唯一一点M;反过来，给定平面内一点，也可以找到它的极坐标 $( r , \theta )$ .但和

极坐标

直角坐标系不同的是，平面内一个点的极坐标可以有无数种表示法.这是因为(r，$2n\pi + \theta)(n$ 为任意整数)是同一点的极坐标.如果限定 $0 \leq \theta < 2\pi$ 或 $\pi < \theta \leq \pi$ ,那么除极点外，平面内的点和极坐标就可以一一对应了.

把直角坐标系的原点作为极点，x轴的正半轴作为极轴，并在两种坐标系中取相同的长度单位(图1.22).设M是平面内任意一点，它的直角坐标是 $( x , y )$ ，极坐标是$( r , \theta )$ ，经过M点作x轴的垂线，垂足为N.由三角函数的定义，得

$$x = r \cos \theta, \quad y = r \sin \theta.$$

由上述关系式，我们可得关系式

$$r = \sqrt{x^{2} + y^{2}}, \quad \tan \theta = \frac{y}{x}.$$

图1.22

## 1.2.4 复指数函数

为了将来的应用，我们给出复指数函数的定义

设 $z = x + iy$ 为一个复数， $x : y \in \mathbf { R }$ 分别为其实部和虚部，i是虚数单位，满足$\dot { 1 } ^ { 2 } = = 1$ . 定义复指数函数 $\mathrm { e } ^ { z }$ 为 $\mathrm{e}^{z}=\mathrm{e}^{x}\left(\cos y+\sin y\right)$

特别是，若 $\theta \in R$ ,有 $\mathrm{e}^{\mathrm{i} \theta} = \cos \theta + \mathrm{i} \sin \theta.$ 这称为欧拉公式.

## 1.3 本章内容对开普勒问题的应用

在开普勒问题中，需要用极坐标表示椭圆轨道.下面来推导椭圆的极坐标方程.把极点选在椭圆的一个焦点上，让极轴沿着椭圆的长轴指向远离另一焦点的方向(图1.23).按照定义，椭圆是到两焦点的距离之和等于常数(设这常数为 $2 a )$ 的点的轨迹.椭圆的方程应为

$$r+\sqrt{r^{2}+4c^{2}+4rc\cos\theta}=2a,$$

其中设两焦点间的距离为 $2 c ;$

[page:18]

## 第1章 函 数

在上一方程中，先把左边的第一项r移到右边，再取两边的平方消去根号，得到

$$r^{2}+4c^{2}+4rc\cos\theta=r^{2}+4a^{2}-4ra.$$

由此又可得到

$$r = \frac{b^{2}}{a + c\cos\theta} = \frac{p}{1 + \varepsilon\cos\theta},$$

其中，

$$b = \sqrt{a^{2} - c^{2}}, \quad p = \frac{b^{2}}{a}, \quad \varepsilon = \frac{c}{a}.$$

这样就得到了椭圆的极坐标方程

$$r = \frac{p}{1 + \varepsilon \cos \theta}$$

[page:19]

# 第2章 极限与连续

极限是研究函数各变量之间关系的基本工具，在自然科学和工程技术问题中，有许多量是不可能通过有限次算术运算计算出来，而是需要通过分析变量的无限变化趋势后才能得到，这就是产生极限的实际背景.极限方法已经成为微积分研究的基本手段.本章将介绍极限和函数的连续性等基本概念以及它们的一些性质

## 2.1 数列的极限

## 2.1.1 数列极限的定义

极限概念是由于求某些实际问题的精确解答而产生的.例如，我国古代数学家刘徽(公元3世纪)利用圆内接正多边形来推算圆面积的方法割圆术，就是极限思想在几何学上的应用

设有一个圆，首先作内接正六边形，把它的面积记为 $A_{1}$ ；再作内接正十二边形，其面积记为 $A_{2}$ ;再作内接正二十四边形，其面积记为 $A_{3}$ ，如此循环下去，每次边数加倍.一般把内接正 $6 \times 2 ^ { n - 1 }$ 边形的面积记为 $A_{n}(n \in \mathbb{N}^{+})$ ，这样就得到一系列内接正多边形的面积

$$A_{1},A_{2},A_{3},\cdots,A_{n},\cdots,$$

它们构成一列有次序的数。当n越大，内接正多边形与圆的差别就越小，从而以 $A _ { n }$作为圆面积的近似值也越精确.但是无论n取得如何大，只要n取定了， $A_{n}$ 终究只是多边形的面积，而不是圆的面积.因此，设想n无限增大(记为 $n \rightarrow \infty )$ ，即内接正多边形的边数无限增加，在这个过程中，内接正多边形无限接近于圆，同时 $A _ { n }$ 也无限接近于某一确定的数值，这个确定的数值就理解为圆的面积.这个确定的数值在数学上称为上面这列有次序的数 $A_{1},A_{2},A_{3},\cdots,A_{n},\cdots$ 当 $n \twoheadrightarrow \infty$ 时的极限.在圆面积问题中可以看到，正是这个数列的极限精确地表达了圆的面积.

在解决实际问题中逐渐形成的这种极限方法，已成为微积分中的一种基本方法，因此有必要作进一步的阐明

先说明数列的概念

遵循某种规律，依照一定顺序排列起来的一串数

$$x_{1},x_{2},\cdots,x_{n},\cdots$$

称为一个数列(或序列)，简记作 $\left\{ x_{n} \right\}$ ，其中 $x_{1}$ 称为该数列的第一项， $x _ { 2 }$ 称为第二项，…第n项 $\mathcal{X}_{n}$ 称为数列的一般项或通项，n称为脚标或附标，如

[page:20]

## 第2章 极限与连续

$$0,1,0,\frac{1}{2},0,\frac{1}{3},\cdots,\frac{1+(-1)^{n}}{n},\cdots$$

$$\frac{1}{2}, \frac{2}{3}, \frac{3}{4}, \frac{4}{5}, \cdots, \frac{n}{n+1}, \cdots$$

$$1,-2,3,-4,5,-6,\cdots,(-1)^{n-1}n,\cdots$$

都是数列，它们的通项依次为 $\frac{1 + (-1)^n}{n}, \frac{n}{n + 1}, (-1)^{n-1}n.$

在几何上，数列 $\left\{ \mathcal{X}_{n} \right\}$ 可看作数轴上的一个动点，它依次取数轴上的点 $x_{1},x_{2},\cdots$ $x_{n},\cdots$ (图2.1).

数列 $\left\{ x_{n} \right\}$ 也可看成函数

$$y = f(n) = x_n, \quad n \in \mathbb{N}^+,$$

因此，数列有时也称为整变数的函数

对于要讨论的问题来说，重要的是当n无限增大时(即 $n \rightarrow \infty  时$ ，对应的 $x_{n} =$ $f(n)$ 是否能无限接近于某个确定的数值？如果能够的话，这个数值等于多少？

这里对数列

$$2,\frac{1}{2},\frac{4}{3},\cdots,\frac{n+(-1)^{n-1}}{n},\cdots$$

进行分析，在此数列中，

$$x_{n}=\frac{n+(-1)^{n-1}}{n}=1+(-1)^{n-1}\frac{1}{n}.$$

两个数a与b之间的接近程度可以用这两个数之差的绝对值 $\vert b - a \vert$ 来度量(在数轴上 $\vert b - a \vert$ 表示点a与点b之间的距离)， $\left| b - a \right|$ 越小，a与b就越接近

就上面的数列来说，因为

$$\left| x_{n} - 1 \right| = \left| ( - 1)^{n - 1}\frac{1}{n} \right| = \frac{1}{n},$$

可见当n越来越大时， $\frac { 1 } { \dot { n } }$ 越来越小，从而 $\mathcal { X } _ { n }$ 就越来越接近于1. 因为只要n足够大， $\left| x_{n} - 1 \right|$ 即 $\frac{1}{n}$ 可以小于任意给定的正数，所以说，当n无限增大时， $\mathcal{X}_{n}$ 无限接近于1.例如，给定 $\frac{1}{100}$ ，欲使 $\frac{1}{n} < \frac{1}{100}$ ，只要 $n > 1 0 0$ ，即从第101项起，都能使不等式

$$\left| x_{n} - 1 \right| < \frac{1}{100}$$

[page:21]

## 2.1 数列的极限

成立.同样地，如果给定 $\frac { 1 } { 1 0 0 0 0 }$ ，则从第10001项起，都能使不等式

$$\left| x_{n} - 1 \right| < \frac{1}{10000}$$

成立.一般地，不论给定的正数ε多么小，总存在着一个自然数N，使得当 $n > N$时，不等式

|xn −1 |< ε都成立.这就是数列 $x_{n}=\frac{n+(-1)^{n-1}}{n}(n=1,2,\cdots)$ 当 $n \rightarrow \infty$ 时无限接近于1这件事的实质.这样的一个数1，叫做数列 $x_{n}=\frac{n+(-1)^{n-1}}{n}(n=1,2,\cdots)$ 当 $n \rightarrow \infty$ 时的极限.

一般地，有

定义2.1 设有数列 $\{ , x _ { n } \}$ ，常数a.若对任意给定的正数ε，不论它多么小，总存在自然数N，使得当 $n > N$ 时，恒有

$$\left| x_{n} - a \right| < \varepsilon,$$

则称数列 $\{ x _ { n } \}$ 当n趋向于无穷时以a为极限.或者说，当n趋向于无穷时，数列$\left\{ x_{n} \right\}$ 的极限是a，记作

$$\lim_{n \to \infty} x_n = a \quad  或  \; x_n \to a   (当   n \to \infty  ) .$$

有极限的数列，称为收敛数列；没有极限的数列，称为发散数列

下面给“数列 $\left\{ x_{n} \right\}$ 的极限为 $a^{99}$ 一个几何解释(图2.2):

将常数a 及数列 $x_{1},x_{2},x_{3},\cdots,x_{n},\cdots$ 在数轴上用它们的对应点表示出来，再在数轴上作点a的ε邻域，即开区间 $(a - \varepsilon , a + \varepsilon)$ .因不等式 $\left| x_{n} - a \right| < \varepsilon$ 与不等式$a - \varepsilon < x_{n} < a + \varepsilon$ 等价，所以当 $m > N$ 时，几乎所有的点 $\mathcal{X}_{n}$ 都落在开区间 $(a - \varepsilon, a + \varepsilon)$内，而只有有限个(至多只有N个)在这区间之外.

为了表达方便，引入记号 $\because V$ 表示“任意给定”，“∃”表示“存在”，这样，数列极限 $\lim_{n \to \infty} x_n = a$ 的定义可表达为

$\lim_{n \to \infty} x_n = a \Leftrightarrow \forall \varepsilon > 0$ ，日自然数N，当 $n > N$ 时，有 $\left| x_{n} - a \right| < \varepsilon$

例2.1 证明数列

$$2,\frac{1}{2},\frac{4}{3},\cdots,\frac{n+(-1)^{n-1}}{n},\cdots$$

的极限是1.

证 $\left| x_{n} - a \right| = \left| \frac{n + (-1)^{n-1}}{n} - 1 \right| = \frac{1}{n}$ ，为了使 $\left| x_{n} - a \right|$ 小于任意给定的正数ε,只要

[page:22]

## 第2章 极限与连续

$$\frac{1}{n} < \varepsilon \quad  或  \quad n > \frac{1}{\varepsilon},$$

所以， $V _ { \varepsilon } > 0$ ,取 $N = \left[ \frac{1}{\varepsilon} \right]$ ，则当 $n > N$ 时，就有

$$\left| \frac{n + (-1)^{n-1}}{n} - 1 \right| < \varepsilon,$$

即

$$\lim_{n \to \infty} \frac{n + (-1)^{n-1}}{n} = 1.$$

说明 $\left[ \frac{1}{\varepsilon} \right]$ 是 $\frac { 1 } { \varepsilon }$ 取整数部分，例如 $\left [ 4.3 \right ] = 4, \left [ -4.3 \right ] = -5$

例2.2 设 $| q | { < } 1$ ，证明 $\lim_{n \to \infty} q^n = 0$

证令 $x_{n}=q^{n}$ .当 $q { = } 0$ 时，结论显然成立.以下设 $q \neq 0 .$

任给 $\varepsilon > 0$ 不妨设 $\varepsilon \leq 1 )$ ,要使

$$\left| x_{n} - 0 \right| = \left| q^{n} - 0 \right| = \left| q \right|^{n} < \varepsilon,$$

只需

$$n > \frac{\log \varepsilon}{\lg \mid q \mid}.$$

取 $N = \left[ \frac{\lg \varepsilon}{\lg |q|} \right]$ ，则当 $n > N$ 时，有

$$\left| q ^ { n } - 0 \right| < \varepsilon ,$$

所以

$$\lim_{n \to \infty} q^n = 0.$$

例 2.3 证明 $\lim_{n \to \infty} \sqrt[n]{n} = 1$

证任给 $\varepsilon > 0$ ,要使

$$\left| \sqrt[n]{n} - 1 \right| = \sqrt[n]{n} - 1 < \varepsilon,$$

即要使

$$n < (1 + \varepsilon)^n$$

注意到

$$(1 + \varepsilon)^n = 1 + n\varepsilon + \frac{n(n - 1)}{2}\varepsilon^2 + \cdots + \varepsilon^n > \frac{n(n - 1)}{2}\varepsilon^2 \quad ( 当  \; n \geqslant 2 \;  时 ),$$

所以，只要

$$n < \frac{n(n - 1)}{2}\varepsilon^{2},$$

便有 $n < (1 + \varepsilon)^n$ ,取 $N = \left[ \frac{2}{\varepsilon^{2}} + 1 \right]$ ，则当 $n \gg N$ 时，便有

$$\left| \sqrt[n]{n} - 1 \right| < \varepsilon,$$

[page:23]

## 2.1 数列的极限

所以

$$\lim_{n \to \infty} \sqrt[n]{n} = 1.$$

## 2.1.2 收敛数列的性质

定理2.1(极限的唯一性) 如果数列 $\{ x_{n} \}$ 收敛，那么它的极限唯一.

证设

$$\lim_{n \to \infty} x_{n} = a, \quad  同时  \lim_{n \to \infty} x_{n} = b,$$

则 $V \varepsilon > 0$ ,3 $N_{1} \in \mathbb{N}$ ，使得当 $n > N_{1}$ 时， $\left| x_{n}-a \right| < \frac{\varepsilon}{2}; \exists N_{2} \in \mathbf{N}$ ，使得当 $n { > } N _ { 2 }$ 时，$\left| x_{n} - b \right| < \frac{\varepsilon}{2}$ .取 $m > \max\{N_1, N_2\}$ ,则 $0 \leqslant \left| a - b \right| \leqslant \left| x_{m} - a \right| + \left| x_{m} - b \right| < \frac{\varepsilon}{2}$ $\mp \frac{\varepsilon}{2} = \varepsilon.$ 所以由ε的任意性，只能有 $|a - b| = 0$ ，即 $a { = } b .$

定理2.2(收敛数列的有界性) 如果数列 $\left\{ x_{n} \right\}$ 收敛，那么数列 $\{ x_{n} \}$ 一定有界，即3 $M > 0$ ,使得对任意n，都有 $|x_{n}| \leqslant M.$

证设 $\lim_{n \to \infty} x_n = a$ ，则对于 $\varepsilon { = } 1$ ，存在自然数N，当 $n > N$ 时，不等式

$$\left| x_{n} - a \right| < 1$$

成立.于是，当 $n \gg N$ 时，

$$\mid x_{n}\mid\leqslant\mid x_{n}-a\mid+\mid a\mid<1+\mid a\mid.$$

取 $M = \max \left\{ \left| x_{1} \right|, \left| x_{2} \right|, \cdots, \left| x_{N} \right|, 1 + |a| \right\}$ 即可.

根据这个定理，如果数列 $\left\{ x_{n} \right\}$ 无界，那么数列 $\left\{ x_{n} \right\}$ 一定发散.但是，如果数列$\left\{ x_{n} \right\}$ 有界，却不能断定数列 $\left\{ x_{n} \right\}$ 一定收敛，例如，数列

$$1, -1, 1, \cdots, (-1)^{n+1}, \cdots$$

有界，但后面会证明它是发散的.

定理2.3(收敛数列的保号性)如果 $\lim_{n \to \infty} x_n = a$ 且 $a > 0$ 或 $a < 0$ ，那么存在自然数 $N,n>N$ 时，总有 $x_{n} > 0$ 或 $x_{n} < 0$

证就 $a \geq 0$ 的情形证明.由数列极限的定义，对 $\varepsilon = \frac{a}{2} > 0$ ，存在自然数N，当$n > N$ 时，有

$$\left| x_{n} - a \right| < \frac{a}{2},$$

从而

$$x_{n} > a - \frac{a}{2} = \frac{a}{2} > 0.$$

推论 2.1 如果数列 $\left\{ x_{n} \right\}$ 满足 $x_{n} \geqslant 0$ (或 $x_{n} \leqslant 0$ 且 $\lim_{n \to \infty} x_n = a$ ,那么 $a \geqslant 0$ (或

[page:24]

## 第2章 极限与连续

$a \leqslant 0$

最后，介绍子数列的概念以及关于数列与其子数列收敛性之间的关系

在数列 $\left\{ x_{n} \right\}$ 中，保持原有顺序，从左到右任取其中无穷多项所构成的新数列，称为数列 $\left\{ x_{n} \right\}$ 的子数列.

子数列一般记作

$$x_{n_1},x_{n_2},\cdots,x_{n_k},\cdots,$$

其中

$$n_{1} < n_{2} < \cdots < n_{k} < n_{k + 1} < \cdots$$

在这里， $\mathcal { X } _ { n _ { k } }$ 中的k表示它是子数列的第k项， $\bar{n}_{k}$ 表示它是原来数列 $\{ x _ { n } \}$ 中的第 $n _ { k }$项.很明显，有 $k \leqslant n _ { k }$

定理2.4(数列与子数列收敛性的关系）数列 $\{ x _ { n } \}$ 收敛的充分必要条件为它的任何子数列 $\left\{ x_{n_k} \right\}$ 都收敛.

证 充分性显然.下证必要性.

设 $\lim_{n \to \infty} x_n = a$ ,故 $V _ { E } > 0$ ，存在自然数N，当 $n > N$ 时， $\left| x_{n} - a \right| < \varepsilon$ 成立.取 $K =$ N,则当 $k > - K$ 时， $n_{k} > n_{K} = n_{N} \geqslant N$ ,所以 $\left| x_{n_{k}} - a \right| < \varepsilon$ ，于是 $\lim_{k \to \infty} x_{n_k} = a$ 证毕.

由这个定理，如果数列 $\{ x _ { n } \}$ 有一个子数列发散或者有两个子数列收敛于不同的极限，那么数列 $\left\{ x_{n} \right\}$ 是发散的.例如，数列

$$1, -1, 1, \cdots, (-1)^{n+1}, \cdots$$

的子数列 $\{ x_{2k - 1} \}$ 收敛于1，而子数列 $\left\{ \mathcal { X } _ { 2 k } \right\}$ 收敛于—1，因此此数列发散.同时这个例子也说明，一个发散的数列可能有收敛的子数列.

## 习题2.1

1. 根据数列极限的定义证明:

(1) $\lim_{n \to \infty} \frac{1}{n^2} = 0$ (2) $\lim_{n \to \infty} \frac{3n + 1}{2n + 1} = \frac{3}{2}$ (3) $\lim_{n \to \infty} \frac{\sqrt{n^2 + a^2}}{n} = 1;$ (4) $\lim_{n \to \infty} 0.\underbrace{999\cdots 9}_{n 个 } = 1$

(5) $\lim_{n \to \infty} \frac{3n^2 + n}{n^2 + 1} = 3$ (6) $\lim_{n \to \infty} \left[ \frac{1}{1 \cdot 2} + \frac{1}{2 \cdot 3} + \cdots + \frac{1}{(n - 1)n} \right] = 1$ +#

(7) $\lim_{n \to \infty} \left[ \frac{1}{n^2} + \frac{1}{(n+1)^2} + \cdots + \frac{1}{(2n)^2} \right] = 0;$ (8) $\lim_{n \to \infty} \left( 1 - \frac{1}{2^2} \right) \left( 1 - \frac{1}{3^2} \right) \cdots \left( 1 - \frac{1}{n^2} \right) = \frac{1}{2}$

(9) $\lim_{n \to \infty} \frac{1}{n^a} = 0 (a > 0)$ (10) $\lim_{n \to \infty} nq^n = 0 \left( \left| q \right| < 1 \right)$ ; (11) $\lim_{n \to \infty} \frac{1}{\sqrt[n]{n!}} = 0$

2. 若 $\lim_{n \to \infty} u_n = a$ ，证明 $\lim_{n \to \infty} |u_n| = |a|$ .并举例说明:数列 $\{ \mid x_{n} \mid \}$ 有极限，但数列 $\left\{ x_{n} \right\}$ 可以无极限.

3. 设数列 $\left\{ x_{n} \right\}$ 有界，且 $\lim_{n \to \infty} y_n = 0$ ，证明 $\lim_{n \to \infty} x_n y_n = 0$

4. 对于数列 $\left\{ x_{n} \right\}$ ,若 $x_{2k - 1} \rightarrow a(k \rightarrow \infty), x_{2k} \rightarrow a(k \rightarrow \infty)$ ，证明 $x _ { n } \rightarrow a ( n \rightarrow \infty )$

[page:25]

## 2.2 函数的极限

5. 若存在自然数N，对任意的 $\varepsilon > 0$ ，当 $n > N$ 时，有 $\vert x _ { n } - a \vert = \varepsilon$ 问数列 $\left\{ \begin{aligned} \text { , } \text { , } \text { , } \text { , } \end{aligned} \right.$ 有什么性质？

6. 已知 $\lim_{n \to \infty} a_n = a$ ，证明 $\lim_{n \to \infty} \frac{1}{n} \left( a_1 + a_2 + \cdots + a_n \right) = a.$

7. 证明:若极限 $\lim_{n \to \infty} x_{2n}, \lim_{n \to \infty} x_{2n+1}, \lim_{n \to \infty} x_{3n}$ 都存在，则极限 $\lim_{n \to \infty} x_{n}$ 存在.

## 2.2 函数的极限

## 2.2.1 函数极限的定义

1. 自变量趋于无穷大时函数的极限

如果在 $x > 0 \infty$ 的过程中，对应的函数值 $f ( x )$ 无限接近于确定的数值A，那么A叫做函数 $f ( x )$ 当 $x \rightarrow \infty$ 时的极限.精确地说，就有如下定义.

定义2.2 设函数 $f ( x )$ 在|x|充分大时有定义，A是一个常数.若对任给 $\varepsilon > 0$不论它多么小，总存在正数X，使得当 $\vert x \vert > X$ 时，恒有

$$\left| f(x) - A \right| < \varepsilon,$$

则称当x趋向于无穷时，f(x)的极限是A，记作

$$\lim_{x \to \infty} f(x) = A,$$

或

$$f(x) \to A \quad ( 当   x \to \infty).$$

此定义可简单地表达为

$\lim_{x \to \infty} f(x) = A \Leftrightarrow \forall \varepsilon > 0$ , 3 $X > 0$ ,当 $\mid x \mid > X$ 时，有 $f(x) - A \mid < \varepsilon.$

从几何上来说， $\lim_{x \to \infty} f(x) = A$ 的意义是作直线 $y = A - \varepsilon$ 和 $y = A + \varepsilon$ ，则总有一个正数X存在，使得当 $x < - X$ 或 $x > X$ 时，函数 $y = f(x)$ 的图形位于这两直线之间(图2.3).这时，直线 $y = A$ 叫做函数 $y = f(x)$ 的图形的水平渐近线

例2.4证明

$$\lim_{x \to \infty} \frac{1}{x} = 0.$$

[page:26]

## 第2章 极限与连续

证 $V _ { \varepsilon } > 0$ ,取 $X { = } \frac { 1 } { \varepsilon }$ ，则当 $| x | > X$ 时， $\left| \frac{1}{x} - 0 \right| = \frac{1}{\left| x \right|} < \frac{1}{x} = \varepsilon$ ,所以 $\lim_{x \to \infty} \frac{1}{x} = 0$

## 2. 自变量趋于有限值时函数的极限

现在考虑自变量x的变化过程为 $x \to x_{0}$ .如果在 $x \to x_{0}$ 的过程中，对应的函数值 $f(x)$ 无限接近于确定的数值A,那么就说A是函数 $f ( x )$ 当 $x \rightarrow x_{0}$ 时的极限.

定义2.3 设函数 $f ( x )$ 在点 $\mathcal { X } _ { 0 }$ 的某一去心邻域内有定义，A是一个常数.若对任给 $\varepsilon > 0$ ，不论它多么小，总存在正数δ，使得当x满足不等式 $0 < \left| x - x_{0} \right| < \delta$时，恒有

$$\left| f(x) - A \right| < \varepsilon,$$

则称当 $x \to x_0$ 时， $f ( x )$ 的极限是A，记作

$$\lim_{x \to x_0} f(x) = A,$$

或

$$f(x) \to A \quad ( 当   x \to x_0).$$

此定义可简单地表达为

$\lim f(x)=A \Leftrightarrow \forall \varepsilon>0,\exists \delta>0$ ,当 $0 < \left| x - x_{0} \right| < \delta$ 时，有 $\left| f(x) - A \right| < \varepsilon.$ x→x0

图2.4

从几何上来说， $\lim_{x \to x_0} f(x) = A$ 的意义是作直线 $y = A - \varepsilon$ 和 $y = A + \varepsilon$ ，则总有一个正数 $\hat { \partial }$存在，使得当 $x_{0}-\delta<x<x_{0}$ 或 $x_{0} < x < x_{0} + \delta$时，函数 $y = f(x)$ 的图形位于这两直线之间(图2.4).

例2.5证明 $\lim_{x \to x_0} = c(c$ 为常数).

证设 $f(x) = c$ ，则任给 $\varepsilon > 0$ ，可任取一个正数作为 $\delta ,$ 当 $0 < \left| x - x_{0} \right| < \delta$ 时，恒有

$$\left| f(x) - c \right| = \left| c - c \right| < \varepsilon,$$

于是

$$\lim_{x \to x_0} c = c.$$

例2.6 证明 $\lim_{x \to x_0} x = x_0$

证设 $f(x) = x$ ，则任给 $\varepsilon > 0$ ,取 $\delta \overline{\overline{ 三 }} \varepsilon$ ,当 $0 < \left| x - x_{0} \right| < \delta$ 时，恒有

$$\left| f(x) - x_{0} \right| = \left| x - x_{0} \right| < \varepsilon,$$

于是

$$\lim_{x \to x_0} x = x_0.$$

例2.7 证明

$$\lim_{x \to 1} (x + 1) = 2.$$

[page:27]

## 2.2 函数的极限

证设 $f(x) = x + 1$ ，则任给 $\varepsilon > 0$ ,取 $\delta = \varepsilon$ ,当 $0 < \left| x - 1 \right| < \delta$ 时，恒有

$$\left| f(x) - 2 \right| = \left| x - 1 \right| < \varepsilon,$$

于是

$$\lim_{x \to 1} (x + 1) = 2.$$

例2.8证明

$$\lim_{x \to 1} \frac{x^2 - 1}{x - 1} = 2.$$

证设 $f(x)=\frac{x^{2}-1}{x-1}$ ,则 $x \neq 1$ 时，有 $\left| f(x) - 2 \right| = \left| \frac{x^2 - 1}{x - 1} - 2 \right| = |x - 1|$

任给 $\varepsilon > 0$ ,取 $\delta {  } {  } {  } {  } {  } {  } {  } {  } {  } {  } {  } \varepsilon$ ,当 $0 < \left| x - 1 \right| < \delta$ 时，恒有

$$\left| f(x) - 2 \right| = \left| x - 1 \right| < \varepsilon,$$

于是

$$\lim_{x \to 1} \frac{x^2 - 1}{x - 1} = 2.$$

例2.9 设 $x _ { 0 } > 0$ ，证明 $\lim_{x \to x_0} \sqrt{x} = \sqrt{x_0}$

证设 $f(x) = \sqrt{x}$ ,则

$$\left| f(x) - \sqrt{x_0} \right| = \left| \sqrt{x} - \sqrt{x_0} \right| = \left| \frac{x - x_0}{\sqrt{x} + \sqrt{x_0}} \right| \leqslant \frac{1}{\sqrt{x_0}} \left| x - x_0 \right| .$$

任给 $\varepsilon > 0$ ,取 $\delta = \min \{ x _ { 0 } , \sqrt { x _ { 0 } \varepsilon } \}$ ,当 $0 < \left| x - x_{0} \right| < \delta$ 时，恒有

$$\left| f(x) - \sqrt{x_0} \right| < \varepsilon,$$

于是

$$\lim_{x \to x_0} \sqrt{x} = \sqrt{x_0}.$$

## 3. 单侧极限

1）自变量趋于正无穷大时函数的极限

定义2.4 设函数 $f(x)$ 在x充分大时有定义，A是一个常数.若对任给 $\varepsilon > 0$不论它多么小，总存在正数X，使得当 $x > X$ 时，恒有

$$\left| f(x) - A \right| < \varepsilon,$$

则称当x趋向于正无穷时， $f ( x )$ 的极限是A，记作

$$\lim_{x \to +\infty} f(x) = A,$$

或

$$f(x) \to A \quad ( 当   x \to +\infty).$$

此定义可简单地表达为

[page:28]

## 第2章 极限与连续

$\lim_{x \to +\infty} f(x) = A \Leftrightarrow \forall \varepsilon > 0, \exists X > 0$ ,当 $x > X$ 时，有 $\left| f(x) - A \right| < \varepsilon.$

从几何上来说， $\lim_{x \to +\infty} f(x) = A$ 的意义是作直线 $y = A - \varepsilon$ 和 $y = A + \varepsilon$ ，则总有一个正数X存在，使得当 $x > X$ 时，函数 $y = f(x)$ 的图形位于这两直线之间(图2.5).这时，直线 $y = A$ 是函数 $y = f(x)$ 的图形的水平渐近线

2）自变量趋于负无穷大时函数的极限

定义2.5 设函数 $f ( x )$ 在x充分小时有定义，A是一个常数.若对任给 $\varepsilon > 0$不论它多么小，总存在正数X，使得当 $x < - X$ 时，恒有

$$\left| f(x) - A \right| < \varepsilon,$$

则称当x趋向于负无穷时， $f ( x )$ 的极限是A，记作

$$\lim_{x \to -\infty} f(x) = A,$$

或

$$f(x) \to A \quad ( 当   x \to -\infty).$$

此定义可简单地表达为

$\lim_{x \to -\infty} f(x) = A \Leftrightarrow \forall \varepsilon > 0, \exists X > 0$ ，当 $x < = X$ 时，有 $f(x) - A \mid < \varepsilon$

从几何上来说， $\lim_{x \to -\infty} f(x) = A$ 的意义是:作直线 $y = A - \varepsilon$ 和 $y = A + \varepsilon$ ，则总有一个正数X存在，使得当 $x < = X$ 时，函数 $y = f(x)$ 的图形位于这两直线之间.这时，直线 $y = A$ 是函数 $y = f(x)$ 的图形的水平渐近线

3）自变量从右侧趋于 $x _ { 0 }$ 时函数的右极限

定义2.6 设函数 $f(x)$ 在点 $\mathcal { X } _ { 0 }$ 的右侧附近有定义，A是一个常数.若对任给$\varepsilon > 0$ ，不论它多么小，总存在正数δ，使得当 $0<x-x_{0}<\delta$ 时，恒有

$$\left| f(x) - A \right| < \varepsilon,$$

则称当x从右侧趋向于 $x_{0}$ 时， $f(x)$ 的极限是A，记作

$$\lim_{x \to x_0^+} f(x) = A \quad  或  \quad f(x_0^+) = A,$$

[page:29]

## 2.2 函数的极限

或

$$f(x) \to A \quad ( 当   x \to x_0^+  ) .$$

此定义可简单地表达为

$\lim_{x \to x_0^+} f(x) = A \Leftrightarrow \forall \varepsilon > 0, \exists \delta > 0$ ，当 $0 < x = x_{0} < \delta$ 时，有 $\left| f(x) - A \right| < \varepsilon.$

从几何上来说， $\lim_{x \to x_0^+} f(x) = A$ 的意义是:作直线 $y = A - \varepsilon$ 和 $y = A + \varepsilon$ ，则总有一个正数 $\delta$ 存在，使得当 $0<x-x_{0}<\delta$ 时，函数 $y = f(x)$ 的图形位于这两直线之间(图 2.6).

图2.6

4）自变量从左侧趋于 $\mathcal{X}_{0}$ 时函数的左极限

定义2.7 设函数 $f ( x )$ 在点 $x_{0}$ 的左侧附近有定义，A是一个常数.若对任给$\varepsilon > 0$ ，不论它多么小，总存在正数δ，使得当 $-\delta < x - x_{0} < 0$ 时，恒有

$$\left| f(x) - A \right| < \varepsilon,$$

则称当x从左侧趋向于 $x_{0}$ 时， $f(x)$ 的极限是A，记作

$$\lim_{x \to x_0^{-}} f(x) = A \quad  或  \quad f(x_0^{-}) = A.$$

或

$$f(x) \to A \quad ( 当   x \to x_0^-).$$

此定义可简单地表达为

$\lim_{x \to x_0^-} f(x) = A \Leftrightarrow \forall \varepsilon > 0$ ,3 $\delta \gg 0$ ，当 $-\delta < x - x_{0} < 0$ 时，有 $\left| f(x) - A \right| < \varepsilon$

从几何上来说， $\lim_{x \to x_0^-} f(x) = A$ 的意义是:作直线 $y = A - \varepsilon$ 和 $y = A + \varepsilon$ ，则总有一个正数 $\delta$ 存在，使得当 $-\delta < x - x_{0} < 0$ 时，函数 $y = f(x)$ 的图形位于这两直线之间.

例2.10 证明 $\lim_{x \to +\infty} a^{-x} = 0 (a > 1)$

证任给 $1 > \varepsilon > 0$ ，要找到 $X > 0$ ，使得 $x \geq X$ 时，有

[page:30]

## 第2章 极限与连续

$$\left| a^{-x} - 0 \right| = a^{-x} < \varepsilon,$$

此式等价于

$$x > \frac{- \lg \varepsilon}{\lg a}.$$

所以取

$$X = \frac{- \lg \varepsilon}{\lg a}$$

则当 $x > X$ 时，有

$$\mid a^{-x} = 0 \mid < \varepsilon.$$

于是证明了

$$\lim_{x \to +\infty} a^{-x} = 0, \quad a > 1.$$

例 2.11 证明 $\lim_{x \to 0^{+}} \sqrt{x} = 0.$

证任给 $\varepsilon > 0$ ,要使

$$\left| \sqrt{x} - 0 \right| = \sqrt{x} < \varepsilon,$$

只需 $x < \varepsilon ^ { 2 }$ . 故取 $\delta = \varepsilon ^ { 2 }$ ,当 $0<x<\delta$ 时，恒有

$$\left| \sqrt{x} - 0 \right| < \varepsilon,$$

所以

$$\lim_{x \to 0^{+}} \sqrt{x} = 0.$$

可以证明:

定理2.5 $\lim_{x \to \infty} f(x) = A$ 的充分必要条件为 $\lim_{x \to +\infty} f(x) = \lim_{x \to -\infty} f(x) = A$

定理2.6 $\lim_{x \to x_0} f(x) = A$ 的充分必要条件为 $\lim_{x \to x_0^+} f(x) = \lim_{x \to x_0^-} f(x) = A.$

由这两个定理可以看出，如果某个单侧极限不存在或者两个单侧极限都存在但不相等，那么原来的极限就不存在.

## 2.2.2 函数极限的性质

与收敛数列的性质相比较，可得函数极限的一些相应的性质.它们都可以根据函数极限的定义，运用类似于证明收敛数列性质的方法加以证明.由于函数极限的定义按自变量的变化过程不同有各种形式，下面仅以 $\lim_{x \to x_0} f(x)$ 这种形式为代表给出关于函数极限性质的一些定理.其他形式的极限性质可类似给出.

定理2.7(函数极限的唯一性) 如果 $\lim_{x \to x_0} f(x)$ 存在，那么此极限唯一.

定理2.8(函数有极限时的局部有界性)如果 $\lim_{x \to x_0} f(x)$ 存在，那么存在常数$M > 0$ 和 $\delta > 0$ ，使得当 $0 < \left| x - x_{0} \right| < \delta$ 时，有 $\left| f(x) \right| \leqslant M.$

[page:31]

## 2.2 函数的极限

定理2.9 如果 $\lim_{x \to x_0} f(x) = A \neq 0$ ,那么存在 $x _ { 0 }$ 的某一去心邻域 $\mathcal { O } ( x _ { 0 } )$ ,当 $x \in$ $\mathcal { \tilde { U } } ( x _ { 0 } )$ 时，有 $\left| f(x) \right| > \frac{\left| A \right|}{2}$

证由函数极限的定义，对 $\varepsilon = \frac { | A | } { 2 }$ 来说，存在 $\delta > 0$ ,当 $0<|x-x_{0}|<\delta$ 时，有

$$\left| f(x) - A \right| < \frac{\left| A \right|}{2},$$

从而

$$A - \frac{\left| A \right|}{2} < f(x) < A + \frac{\left| A \right|}{2}.$$

若 $A \gg 0$ ,有 $f(x) > \frac{A}{2}$ ;若 $A < 0$ ,有 $f(x) < \frac{A}{2}$ ，总之，有 $\left| f(x) \right| > \frac{\left| A \right|}{2}$

由此可得以下定理及推论

定理2.10(函数有极限时的局部保号性） 如果 $\lim_{x \to x_0} f(x) = A$ ，且 $A > 0$ 或 $A <$ 0)，那么存在常数 $\delta > > 0$ ，使得当 $0 < \left| x - x_{0} \right| < \delta$ 时，有 $f(x) > 0$ 或 $f(x) < 0$

推论2.2 如果在 $\mathcal { X } _ { 0 }$ 的某去心邻域内 $f(x) \geq 0$ 或 $f(x) \leq 0$ ，而且 $\lim_{x \to x_0} f(x) = A$那么 $A \geq 0$ 或 $A \leq 0$

定理2.11(函数极限与数列极限的关系）函数极限 $\lim_{x \to x_0} f(x)$ 存在的充分必要条件为对于 $f ( x )$ 定义域内任一收敛于 $\mathcal { X } _ { 0 }$ 的数列 $\left\{ , x _ { n } \right\}$ ，且满足 $x_{n} \neq x_{0} \left( n \in \mathbb{N}^{+} \right)$相应的函数值数列 $f(x_{n})$ 都收敛.

证必要性设 $\lim_{x \to x_0} f(x) = A$ ,则 $\forall \varepsilon > 0, \exists \delta > 0$ ,当 $0 < \left| x - x_{0} \right| < \delta$ 时，有$\left| f(x) - A \right| < \varepsilon$

又因 $\lim_{n \to \infty} x_{n} = x_{0}$ ，故对 $\delta > 0$ ，∃N，当 $n > N$ 时，有 $\left| x_{n} - x_{0} \right| < \delta.$

由假设 $x_{n} \neq x_{0} \left( n \in \mathbb{N}^{+} \right)$ .故当 $n > N$ 时， $0 < \left| x - x_{0} \right| < \delta$ ，从而 $\left| f(x_{n}) - A \right| < \varepsilon$即 $\lim_{n \to \infty} f(x_n) = A$

充分性 容易说明满足定理中条件的 $\{ f(x_n) \}$ 极限都相等，设为A.若 $\lim_{x \to x_0} f(x)$不存在或者 $\lim_{x \to x_0} f(x) \neq A$ ，则存在某个 $\varepsilon _ { 0 } > 0$ ，使得对于任给 $\bar { n } \in \mathbf { N } ^ { + }$ ,3 $x_{n},0<$ $\left| x_{n} - x_{0} \right| < \frac{1}{n}, \left| f(x_{n}) - A \right| > \varepsilon_{0}$ .数列 $\left\{ x_{n} \right\}$ 满足 $x_{n} \rightarrow x_{0}$ ，且 $x_{n} \neq x_{0}$ ，但是 $f(x_{n})$ 不趋向于A，矛盾.

## 习题2.2

1. 根据函数极限的定义证明:

[page:32]

## 第2章 极限与连续

(1) $\lim_{x \to 3} (3x - 1) = 8;$ (2) $\lim_{x \to -2} \frac{x^2 - 4}{x + 2} = -4$ (3) $\lim_{x \to a} x = \sin a$

(4) $\lim_{x \to a} \cos x = \cos a$ (5) $\lim_{x \to a} \sqrt[3]{x} = \sqrt[3]{a};$ (6) $\lim_{x \to 1} \frac{x - 1}{x^2 - 1} = \frac{1}{2}$

2. 求 $f(x)=\frac{x}{x},\varphi(x)=\frac{\left | x \right | }{x}$ 当 $x \rightarrow 0$ 时的左、右极限，并说明它们在x→0时的极限是否存在

3.根据函数极限的定义证明:

(1) $\lim_{x \to \infty} \frac{1 + x^3}{2x^3} = \frac{1}{2}$ ; (2) $\lim_{x \to +\infty} \frac{\sin x}{\sqrt{x}} = 0.$

4. 用单侧极限定义证明下列各式:

(1) $\lim_{x \to 2^{+}} \frac{[x]^2 - 4}{x^2 - 4} = 0$ (2) $\lim_{x \to 0^{+}} x^{\alpha} = 0 (\alpha > 0)$

5. 设

$$f(x)=\begin{cases}\dfrac{1}{x - 1},&x < 0,\\x,&0 < x < 1,\\1,&x > 1.\end{cases}$$

问f(x)在x=0与x=1两点的极限是否存在？为什么？

6. 证明:极限 $\lim_{x \to 0^{+}} \cos \frac{1}{x}$ 不存在.

7. 证明 $\lim_{x \to 0^{+}} x \left[ \frac{1}{x} \right] = 1$

8. 证明:函数 $f(x) = |x|$ 当x→0时的极限为零.

9. 证明:若 $x > - 1 \infty$ 及 $x \rightarrow - \infty$ 时，函数 $f ( x )$ 的极限都存在且都等于A，则 $\lim_{x \to \infty} f(x) = A$

10. 根据函数极限的定义证明:函数 $f ( x )$ 当 $x \to x_{0}$ 时极限存在的充分必要条件是左极限、右极限各自存在并且相等

11. 试给出 $x \rightarrow 0 \infty$ 时函数极限的局部有界性的定理，并加以证明.

12. 已知 $\lim_{x \to +\infty} f(x) = A$ ，且 $\lim_{n \to \infty} x_n = +\infty$ ，证明 $\lim_{n \to \infty} f(x_n) = A$

## 2.3 无穷小与无穷大

## 2.3.1 无穷小

定义2.8 在某一极限过程中(如 $n \to \infty; x \to x_0; x \to x_0; x \to x_0; x \to \infty; x \to$ $+ \infty ; x \rightarrow - \infty )$ ，以0为极限的变量称为该极限过程中的无穷小量

例如， $\frac{1}{n}$ 是 $n \to \infty$ 时的无穷小量；x—1是x→1时的无穷小量

下面的定理说明无穷小与函数极限的关系.

定理2.12在自变量的同一变化过程中，函数f(x)具有极限A的充分必要

[page:33]

## 2.3 无穷小与无穷大

条件是 $f(x) = A + \alpha$ ，其中α是无穷小.

证以自变量 $x > x$ 为例来证.

必要性设 $\lim_{x \to x_0} f(x) = A$ ，则 $\forall \varepsilon > 0, \exists \delta > 0$ ,当 $0 < \left| x - x_{0} \right| < \delta$ 时，$\left| f(x) - A - 0 \right| = \left| f(x) - A \right| < \varepsilon$ ，所以 $\lim_{x \to x_0} (f(x) - A) = 0$ ，即 $f(x) - A$ 是 $x \to x_{0}$时的无穷小.令 $\alpha = f(x) - A$ ,则 $f(x) = A + \alpha.$

充分性设 $f(x) = A + \alpha$ ，其中A为常数，α为无穷小. $\forall \varepsilon > 0, \exists \delta > 0$ ,当$0 < \left| x - x_{0} \right| < \delta$ 时， $| f(x) - A | = | a | = | a - 0 | < \varepsilon$ ，所以 $\lim_{x \to x_0} f(x) = A$

## 2.3.2 无穷大

如果在某一极限过程中，函数 $f ( x )$ 的绝对值无限增大，就称 $f ( x )$ 是此极限过程中的无穷大.下面以 $x > x$ 为例叙述其定义.

定义2.9 设函数 $f ( x )$ 在 $\mathcal { X } _ { 0 }$ 的某一去心邻域内有定义.若对任意给定的$M > 0$ ，无论它多么大，总存在 $\delta > 0$ ，使得当 $0 < \left| x - x_{0} \right| < \delta$ 时，

$$\left| f(x) \right| > M,$$

则称函数 f(x)为 $x \to x_{0}$ 时的无穷大.记作

$$\lim_{x \to x_0} f(x) = \infty.$$

如果在定义中把 $\left| f(x) \right| > M$ 换成 $f(x) > M$ 或 $f(x) < -M$ ，就得到正无穷大和负无穷大的定义，分别记作

$$\lim_{x \to x_0} f(x) = +\infty \quad ( 或  \lim_{x \to x_0} f(x) = -\infty)$$

类似地，可以给出其他极限过程中的无穷大的定义.

例2.12证明 $\operatorname* { l i m } _ { x \to 0 } \frac { 1 } { x } = \infty ,$

证 $\forall M > 0$ ,令 $\delta { = } \frac { 1 } { M }$ ，则当 $0 < |x - 0| = |x| < \delta$ 时， $\left| \frac{1}{x} \right| = \frac{1}{\left| x \right|} > \frac{1}{\delta} = M.$ ,所以 $\lim_{x \to 0} \frac{1}{x} = \infty$

若 $\lim_{x \to x_0} f(x) = \infty$ ，就称直线 $x = x_{0}$ 为函数 $f ( x )$ 的图形的一条铅直渐近线

无穷大与无穷小之间有一种简单的关系.

定理2.13在自变量的同一变化过程中，如果 $f(x)$ 为无穷大，则 $\frac{1}{f(x)}$ 为无穷小；反之，若 $f ( x )$ 为无穷小，且 $f(x) \neq 0$ ，则 $\frac{1}{f(x)}$ 为无穷大.

证以 $x \rightarrow x_{0}$ 时为例.

若 $\lim_{x \to x_0} f(x) = \infty$ ，任给 $\varepsilon > 0$ ，对于 $M = \frac { 1 } { \varepsilon }$ 来说，存在 $\delta > 0$ ，使得当 $0 < \left| x - x_{0} \right| < \delta$

[page:34]

## 第2章 极限与连续

时，

$$\mid f(x) \mid > M = \frac{1}{\varepsilon},$$

即

$$\left| \frac{1}{f(x)} \right| < \varepsilon,$$

所以 $\frac { 1 } { f ( x ) }$ 为无穷小.

若 $\lim_{x \to x_0} f(x) = 0$ ，任给 $M > 0$ ,对于 $\varepsilon = \frac { 1 } { M }$ 来说，存在 $\delta > > 0$ ，使得当 $0 < \left| x - x_{0} \right| < \delta$时，

$$\mid f(x) \mid < \varepsilon = \frac{1}{M},$$

即

$$\left| \frac{1}{f(x)} \right| > M,$$

所以 $\frac{1}{f(x)}$ 是无穷大.

习题2.3

1. 两个无穷小的商是否一定是无穷小？举例说明

2. 根据定义证明:

(1) $y=\frac{x^{2}-9}{x+3}$ 为当x→3时的无穷小；（2） $y = x\sin\frac{1}{x}$ 为当x→0时的无穷小

3. 求下列极限并说明理由:

(1) $\lim_{x \to \infty} \frac{2x + 1}{x}$ (2) $\lim_{x \to 0} \frac{1 - x^2}{1 - x}$

4. 根据定义证明:函数 $y=\frac{1+2x}{x}$ 为当x→0时的无穷大.

5. 函数 $y = x \cos x$ 在 $( - \infty , + \infty )$ 内是否有界？这个函数是否为 $x \rightarrow + \infty$ 时的无穷大?为什么？

6. 证明:函数 $y = \frac{1}{x}\sin\frac{1}{x}$ 在区间(0，1]上无界，但不是 $x \rightarrow 0 ^ { + }$ 时的无穷大.

7. 求函数 $f(x) = \frac{4}{2 - x^{2}}$ 的图形的渐近线

[page:35]

## 2.4 极限运算法则

## 2.4 极限运算法则

## 2.4.1 无穷小运算法则

定理2.14 两个无穷小的和是无穷小.

证以 $x \to x_{0}$ 时为例.

设 $\alpha$ 和 $\beta$ 是 $x \to x_{0}$ 时的无穷小，而

$$\gamma = \alpha + \beta.$$

$V _ { E } > 0$ ,3 $\delta _ { 1 } > 0$ ,当 $0 < \left| x - x_{0} \right| < \delta_{1}$ 时，有

$$\mid a \mid < \frac{\varepsilon}{2}.$$

无穷小运算法则

E $\delta _ { 2 } > 0$ ,当 $0 < \left| x - x_{0} \right| < \delta_{2}$ 时，有

$$\vert \beta \vert < \frac { \varepsilon } { 2 } .$$

取 $\delta = \min \left\{ \delta_{1}, \delta_{2} \right\}$ ，则当 $0 < \left| x - x_{0} \right| < \delta$ 时，有

$$| \alpha + \beta | \leqslant | \alpha | + | \beta | < \frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon.$$

所以 $\alpha + \beta$ 是无穷小.

定理2.15 局部有界函数与无穷小的积是无穷小.

证以 $x \to x_{0}$ 时为例.

设α是 $x \to x_{0}$ 时的无穷小， $u ( x )$ 在 $\mathcal { X } _ { 0 }$ 的某去心邻域 $\stackrel{o}{U}(x_{0},\delta_{1})$ 内有界，即3 $M > 0$ ，使得对一切 $x \in U(x_0, \delta_1), \left| u(x) \right| \leqslant M$ 成立.

$V _ { \varepsilon } > 0$ , 3 $\delta _ { 2 } > 0$ ,当 $0 < \left| x - x_{0} \right| < \delta_{2}$ 时，有

$$\mid \alpha \mid < \varepsilon .$$

取 $\delta = \min \{ \delta_1, \delta_2 \}$ ,则当 $0 < \left| x - x_{0} \right| < \delta$ 时，有

$$\mid u \alpha \mid \leq M \varepsilon .$$

所以 $u \alpha$ 是无穷小.

推论2.3 常数与无穷小的乘积是无穷小.

推论2.4 两个无穷小的乘积是无穷小.

推论2.5 两个无穷小的差是无穷小.

推论2.6有限个无穷小的和、差与积都是无穷小.

定理2.16若 $f(u)$ 是极限过程1中的无穷小， $u = g(x)$ ，当x满足极限过程2时，相应的 $u = g(x)$ 满足极限过程1，则 $f(g(x))$ 是极限过程2中的无穷小.

证以 $\lim_{u \to u_0} f(u) = 0$ ，同时 $\lim_{x \to x_0} g(x) = u_0$ ，并且3 $\delta _ { 0 } > 0$ ，使得当 $x \in \mathring{U}(x_0, \delta_0)$ 时$g(x) \neq u_0$ 为例证明.

[page:36]

## 第2章 极限与连续

由 $\lim_{u \to u_0} f(u) = 0$ 知 $\forall \varepsilon > 0, \exists \eta > 0$ ,当 $0 < \left| u - u_{0} \right| < \eta$ 时， $\left| f(u) \right| < \varepsilon.$ 又由于$\lim_{x \to x_0} g(x) = u_0$ ，所以 $\delta_{1} > 0$ ，当 $0 < \left| x - x_{0} \right| < \delta_{1}$ 时， $| g(x) - u_0 | < \eta$取 $\delta = \min \{ \delta_0, \delta_1 \}$ ，则当 $0 < \left| x - x_{0} \right| < \delta$ 时， $0 < \left| g(x) - u_0 \right| < \eta$ ，故此时有

$$\left| f(g(x)) \right| < \varepsilon.$$

所以 $f(g(x))$ 是无穷小.

## 2.4.2 极限运算法则

定理2.17 如果 $\lim_{x \to a} f(x) = A, \lim_{x \to a} g(x) = B$ ,那么

(1) $\lim \left[ f(x) \pm g(x) \right] = \lim f(x) \pm \lim g(x) = A \pm B;$

(2) $\lim \left[ f(x) \cdot g(x) \right] = \lim f(x) \cdot \lim g(x) = A \cdot B;$

(3) 若又有 $B \neq 0$ ,则

$$\lim \frac{f(x)}{g(x)} = \frac{\lim f(x)}{\lim g(x)} = \frac{A}{B}.$$

极限运算法则

证(1) $f(x)=A+\alpha,g(x)=B+\beta,\alpha$ 和 $\beta$ 为无穷小.

$$f(x) \pm g(x) = (A + \alpha) \pm (B + \beta) = (A \pm B) + (\alpha \pm \beta).$$

而 $\alpha \pm \beta$ 为无穷小.由定理2.12可得结论.

(2) $f(x) \cdot g(x) = (A + \alpha) \cdot (B + \beta) = A \cdot B + (A\beta + B\alpha + \alpha\beta)$ ,而 $A\beta + B\alpha + \alpha\beta$是无穷小.由定理2.12可得结论.

$\frac{f(x)}{g(x)}=\frac{A}{B}+\left(\frac{f(x)}{g(x)}-\frac{A}{B}\right)=\frac{A}{B}+\frac{1}{Bg(x)}\left(Bg-A\beta\right)$ ，而 $\frac{1}{Bg(x)}(B\alpha - A\beta)$ 是无穷小.由定理2.12可得结论.此处用到了定理2.9，它保证了 $\vert g ( x ) \vert$ 局部有正下界，故 $\frac { 1 } { B g ( x ) }$ 局部有界.

推论2.7 如果limf(x)存在，c为常数，则

$$\lim \left[ c f(x) \right] = c \lim f(x).$$

推论2.8如果limf(x)存在，n是正整数，则

$$\lim \left[ f(x) \right]^n = \left[ \lim f(x) \right]^n.$$

例2.13设 $f(x)=a_{n}x^{n}+a_{n-1}x^{n-1}+\cdots+a_{0}$ ,求 $\lim_{x \to x_0} f(x)$

解

$$\begin{aligned}\lim_{x \to x_0} f(x) &= \lim_{x \to x_0} (a_n x^n + a_{n-1} x^{n-1} + \cdots + a_0) \\&= a_n (\lim_{x \to x_0} x)^n + a_{n-1} (\lim_{x \to x_0} x)^{n-1} + \cdots + \lim_{x \to x_0} a_0 \\&= a_n x_0^n + a_{n-1} x_0^{n-1} + \cdots + a_0 = f(x_0)\end{aligned}$$

例2.14设 $F(x) = \frac{P(x)}{Q(x)}$ ,其中 $P(x),Q(x)$ 都是多项式， $Q(x_0) \neq 0$ ,求 $\lim_{} F(x)$ x→x0

[page:37]

## 2.4 极限运算法则

lim P(x)解 lim F(x)= limP(x) x→x0 P(x0) =F(x0). x→x0 x+x0Q(x) limQ(x) Q(x0) x→x0

例2.15求 $\lim_{x \to 1} \frac{x - 1}{x^2 - 1}$

解 $\lim_{x \to 1} \frac{x - 1}{x^2 - 1} = \lim_{x \to 1} \frac{1}{x + 1} = \frac{1}{2}$

例2.16求 $\lim_{x \to 1} \frac{x + 2}{x^2 - 1}$

解因为 $\lim_{x \to 1} \frac{x^2 - 1}{x + 2} = 0$ ,所以 $\lim_{x \to 1} \frac{x + 2}{x^2 - 1} = \infty$

例2.17 求 $\lim_{x \to \infty} \frac{a_m x^m + a_{m-1} x^{m-1} + \cdots + a_0}{b_m x^n + b_{n-1} x^{n-1} + \cdots + b_0}$ ,其中 $a_{m} \neq 0, b_{n} \neq 0.$

解当 $n = m$ 时，

$$\lim_{x \to \infty} \frac{a_{m}x^{m} + a_{m - 1}x^{m - 1} + \cdots + a_{0}}{b_{m}x^{n} + b_{m - 1}x^{n - 1} + \cdots + b_{0}} = \lim_{x \to \infty} \frac{a_{n} + a_{n - 1}\frac{1}{x} + \cdots + a_{0}\frac{1}{x^{n}}}{b_{n} + b_{n - 1}\frac{1}{x} + \cdots + b_{0}\frac{1}{x^{n}}} = \frac{a_{n}}{b_{n}}$$

当 $n > m$ 时，

$$\lim_{x \to \infty} \frac{a_{m}x^{m} + a_{m - 1}x^{m - 1} + \cdots + a_{0}}{b_{m}x^{n} + b_{n - 1}x^{n - 1} + \cdots + b_{0}} = \lim_{x \to \infty} \frac{a_{m}\frac{1}{x^{n - m}} + a_{m - 1}\frac{1}{x^{n - m + 1}} + \cdots + a_{0}\frac{1}{x^{n}}}{b_{n} + b_{n - 1}\frac{1}{x} + \cdots + b_{0}\frac{1}{x^{n}}} = 0$$

当 $n { \leq } m$ 时，因为

$$\lim_{x \to \infty} \frac{b_nx^n + b_{n-1}x^{n-1} + \cdots + b_0}{a_mx^m + a_{m-1}x^{m-1} + \cdots + a_0} = 0,$$

所以

$$\lim_{x \to \infty} \frac{a_m x^n + a_{m-1} x^{m-1} + \cdots + a_0}{b_n x^n + b_{n-1} x^{n-1} + \cdots + b_0} = \infty.$$

例2.18求 $\lim_{x \to 0} x \sin \frac{1}{x}$

解因为 $\lim_{x \to 0} x = 0$ ,而 $\sin \frac{1}{x}$ 有界，所以 $\lim_{x \to 0} x \sin \frac{1}{x} = 0$

定理2.18(复合函数的极限运算法则) 若f(u)在极限过程1中存在极限A，$u = g(x)$ ，当x满足极限过程2时，相应的 $u = g(x)$ 满足极限过程1，则 $f(g(x))$ 在极限过程2中也存在极限A.

证以 $\lim_{u \to u_0} f(u) = A$ ，同时 $\lim_{x \to x_0} g(x) = u_0$ ，并且∃ $\delta _ { 0 } > 0$ ，使得当 $x \in \mathring{U}(x_0, \delta_0)$ 时$g(x) \neq u_0$ 为例证明.

[page:38]

## 第2章 极限与连续

由 $\lim_{u \to u_0} f(u) = A$ 知 $f(u) = A + \alpha(u)$ ,其中 $\alpha ( u )$ 是无穷小.所以 $f(g(x)) = A +$ $\alpha(g(x))$ ，由定理2.16知 $\alpha(g(x))$ 也是无穷小.再由定理2.12可得结论.

注:此定理的作用说明了在求极限过程中可以做代换，即

$$\lim_{x \to a} f(g(x)) = \lim_{u \to a} f(u)$$

计算下列极限:

(1) $\lim_{x \to 2} \frac{x^2 + 5}{x - 3}$ (2) $\lim_{x \to 1} \frac{x^2 - 2x + 1}{x^2 - 1}$ ; (3) $\lim_{x \to \infty} \left( 2 - \frac{1}{x} + \frac{1}{x^2} \right)$ ; (4) $\lim_{x \to \infty} \frac{x^2 - 1}{2x^2 - x - 1}$ i

(5) $\lim_{x \to \infty} \frac{x^2 + x}{x^4 - 3x^2 + 1}$ (6) $\lim_{n \to \infty} \left( 1 + \frac{1}{2} + \frac{1}{4} + \cdots + \frac{1}{2^n} \right)$

(7) $\lim_{n \to \infty} \frac{1 + 2 + 3 + \cdots + (n - 1)}{n^2}$ ; (8) $\lim_{x \to 1} \left( \frac{1}{1 - x} - \frac{3}{1 - x^3} \right)$ ; (9) $\lim_{n \to \infty} \frac{(-2)^n + 3^n}{(-1)^{n+1} + 3^{n+1}}$

(10) $\lim_{n \to \infty} \frac{\sqrt{n + 1} - \sqrt{n}}{\sqrt{n + 2} - \sqrt{n}}$ (11) $\lim_{n \to \infty} \frac{a^n - a^{-n}}{a^n + a^{-n}} \quad (a > 0)$ ; (12) $\lim_{x \to 2} \frac{x^3 + 2x^2}{(x - 2)^2}$ (13) $\lim_{x \to \infty} \frac{x^2}{2x + 1}$

(14) $\lim_{x \to +\infty} \left( \sqrt{x^2 + x} - x \right);$ (15) $\lim_{x \to 0} \frac{5x}{\sqrt[3]{1 + x} - \sqrt[3]{1 - x}}$ (16) $\lim_{x \to 0} \frac{\sqrt[3]{1 + 3x} - \sqrt[3]{1 - 2x}}{x + x^2}$

(17) $\lim_{x \to a^{+}}\frac{\sqrt{x}-\sqrt{a}+\sqrt{x-a}}{\sqrt{x^{2}-a^{2}}} \quad (a>0)$ (18) $\lim_{x \to 1} \frac{\sqrt{3 - x} - \sqrt{1 + x}}{x^2 - 1}$

(19) $\lim_{x \to -\infty} \left[ \sqrt{x^2 + x + 1} - \sqrt{x^2 - x + 1} \right]$ ; (20) $\lim_{x \to +\infty} x(\sqrt{x^2 + 1} - x)$

(21) $\lim_{x \to 0} x^2 \sin \frac{1}{x}$ ;(22) $\lim_{x \to \infty} \frac{\arctan x}{x}$

## 2.5 极限存在准则两个重要极限

## 2.5.1 夹逼准则和重要极限 $\lim_{x \to 0} \frac{\sin x}{x} = 1$

夹逼准则 若存在 $\eta > 0$ ，使得当 $0 < \left| x - x_{0} \right| < \eta$ 时，有

$$f(x) \leqslant h(x) \leqslant g(x),$$

且

则

$$\lim_{x \to x_0} f(x) = \lim_{x \to x_0} g(x) = A,$$

[page:39]

## 2.5 极限存在准则 两个重要极限

$$\lim_{x \to x_0} h(x) = A.$$

证因为 $\lim_{x \to x_0} f(x) = \lim_{x \to x_0} g(x) = A$ ，所以 $f(x)=A+\alpha,g(x)=A+\beta$ 其中 $\alpha , \beta$为无穷小.把 $h ( x )$ 写成 $h(x) = A + (h(x) - A) = A + \gamma(x)$ ，则有 $\alpha \leqslant \gamma(x) \leqslant \beta.$ 下面证明 $y ( x )$ 是无穷小. $\forall \varepsilon > 0 , \exists \delta > 0$ ,当 $x \in \mathring{U}(x_0, \delta)$ 时， $- \varepsilon < a < \varepsilon , - \varepsilon < \beta < \varepsilon$ ，所以$\varepsilon < \gamma(x) < \varepsilon$ 这说明 $y ( x )$ 是无穷小. $\lim_{x \to x_0} h(x) = A$

其他极限过程中也有类似的夹逼准则

下面利用夹逼准则推导重要极限

$$\lim_{x \to 0} \frac{\sin x}{x} = 1.$$

作半径为1的圆，设锐角 $\angle AOB$ 的弧度数为x(图2.7).

显然有 $\triangle A O B$ 的面积<扇形AOB的面积$\triangle AOD$ 的面积，即

$$\frac{1}{2}\sin x < \frac{1}{2}x < \frac{1}{2}\tan x, \quad x \in \left(0, \frac{\pi}{2}\right).$$

亦即

$$\sin x < x < \tan x, \quad x \in \left(0, \frac{\pi}{2}\right).$$

不等号两边都除以sinx，就有

$$1 < \frac{x}{\sin x} < \frac{1}{\cos x},$$

图2.7

或

$$\cos x < \frac{\sin x}{x} < 1,$$

因为 cosx 和 $\frac{\sin x}{x}$ 都是偶函数，所以上式对于 $\left( - \frac{\pi}{2}, 0 \right)$ 内的一切x也成立

引理2.1 $\left| \sin x \right| \leqslant \left| x \right|$ ，等号当且仅当 $x = 0$ 时成立.

证上面已证当 $0 < |x| < \frac{\pi}{2}$ 时， $\left| \sin x \right| < \left| x \right|$ 成立.当 $\left| x \right| \geqslant \frac{\pi}{2}$ 时，显然$\left| \sin x \right| < \left| x \right|$ 成立.而 $x = 0$ 时，显然等号成立.

下面证明 $\lim_{x \to 0} x = 1$

事实上， $1 \geqslant \cos x = 1 - 2\sin^{2}\frac{x}{2} \geqslant 1 - 2\left( \frac{x}{2} \right)^{2} = 1 - \frac{x^{2}}{2}$ ，而显然 $\lim_{x \to 0} \left( 1 - \frac{x^2}{2} \right) = 1$用夹逼准则得证 $\lim_{x \to 0} \cos x = 1$

再对 $\cos x < \frac{\sin x}{x} < 1$ 利用夹逼准则就得到了 $\lim_{x \to 0} \frac{\sin x}{x} = 1$

例 2.19 求 $\lim_{x \to 0} \frac{\tan x}{x}$

[page:40]

## 第2章 极限与连续

解 $\lim_{x \to 0} \frac{\tan x}{x} = \lim_{x \to 0} \left( \frac{\sin x}{x} \cdot \frac{1}{\cos x} \right) = \lim_{x \to 0} \frac{\sin x}{x} \cdot \lim_{x \to 0} \frac{1}{\cos x} = 1.$

例2.20求 $\lim_{x \to 0} \frac{1 - \cos x}{x^2}$

$$\lim_{x \to 0} \frac{1 - \cos x}{x^2} = \lim_{x \to 0} \frac{2 \sin^2 \frac{x}{2}}{x^2} = \frac{1}{2} \lim_{x \to 0} \left[ \frac{\sin \frac{x}{2}}{\frac{x}{2}} \right]^2 = \frac{1}{2}$$

例2.21求 $\lim_{x \to 0} \frac{\arcsin x}{x}$

解 $\lim_{x \to 0} \frac{\arcsin x}{x} = \lim_{t \to 0} \frac{t}{\sin t} = 1.$

## 2.5.2 单调有界收敛准则和重要极限 $\lim_{x \to \infty} \left( 1 + \frac{1}{x} \right)^x = \mathrm{e}$

单调有界收敛准则 如果数列 $\{ x_{n} \}$ 满足条件

$$x_{1} \leqslant x_{2} \leqslant x_{3} \leqslant \cdots \leqslant x_{n} \leqslant x_{n + 1} \leqslant \cdots$$

或者

$$x_{1} \geqslant x_{2} \geqslant x_{3} \geqslant \cdots \geqslant x_{n} \geqslant x_{n + 1} \geqslant \cdots$$

并且有界，则此数列存在极限

其他极限过程中也有相应的单调有界收敛准则

下面利用单调有界收敛准则推导重要极限

$$\lim_{x \to \infty} \left( 1 + \frac{1}{x} \right)^x = \mathrm{e}.$$

分两步证明.

单调有界收敛准则和第二个重要极限

(1)证明 $\lim_{n \to \infty} \left( 1 + \frac{1}{n} \right)^n = \mathrm{e}$

设

$$x_{n} = \left( 1 + \frac{1}{n} \right)^{n}.$$

由二项式定理得

$$\begin{aligned}x_{n} = & 1 + n \cdot \frac{1}{n} + \frac{n(n - 1)}{2!} \cdot \frac{1}{n^{2}} + \frac{n(n - 1)(n - 2)}{3!} \cdot \frac{1}{n^{3}} + \cdots \\& + \frac{n(n - 1)\cdots3 \cdot 2 \cdot 1}{n!} \cdot \frac{1}{n^{n}} \\= & 1 + 1 + \frac{1}{2!}\left(1 - \frac{1}{n}\right) + \frac{1}{3!}\left(1 - \frac{1}{n}\right)\left(1 - \frac{2}{n}\right) + \cdots \\& + \frac{1}{n!}\left(1 - \frac{1}{n}\right)\left(1 - \frac{2}{n}\right)\cdots\left(1 - \frac{n - 1}{n}\right).\end{aligned}$$

[page:41]

## 2.5极限存在准则两个重要极限

同理可得

$$\begin{aligned}x_{n + 1} &= 1 + 1 + \frac{1}{2!}\left( 1 - \frac{1}{n + 1} \right) + \frac{1}{3!}\left( 1 - \frac{1}{n + 1} \right)\left( 1 - \frac{2}{n + 1} \right) + \cdots \\&+ \frac{1}{n!}\left( 1 - \frac{1}{n + 1} \right)\left( 1 - \frac{2}{n + 1} \right)\cdots\left( 1 - \frac{n - 1}{n + 1} \right) \\&+ \frac{1}{(n + 1)!}\left( 1 - \frac{1}{n + 1} \right)\left( 1 - \frac{2}{n + 1} \right)\cdots\left( 1 - \frac{n}{n + 1} \right).\end{aligned}$$

可比较得出 $\{ x_{n} \}$ 是单调上升数列.

又有

$$\begin{aligned}x_{n} &< 1 + 1 + \frac{1}{2!} + \frac{1}{3!} + \cdots + \frac{1}{n!} \\&< 1 + 1 + \frac{1}{1 \bullet 2} + \frac{1}{2 \bullet 3} + \cdots + \frac{1}{(n - 1)n} \\&= 1 + 1 + \left(1 - \frac{1}{2}\right) + \left(\frac{1}{2} - \frac{1}{3}\right) + \cdots + \left(\frac{1}{n - 1} - \frac{1}{n}\right) \\&= 3 - \frac{1}{n} < 3.\end{aligned}$$

根据单调有界收敛准则， $\lim_{n \to \infty} \left( 1 + \frac{1}{n} \right)^n$ 存在，将其值记为e，即

$$\lim_{n \to \infty} \left( 1 + \frac{1}{n} \right)^n = \mathrm{e}.$$

e为自然对数的底.

(2) 证明 $\lim_{x \to \infty} \left( 1 + \frac{1}{x} \right)^x = \mathrm{e}.$

先证 $\lim_{x \to +\infty} \left(1 + \frac{1}{x}\right)^x = \mathrm{e}.$ 因为 $x \rightarrow + \infty$ ，所以不妨设 $x \geq 1$ .令 $[ x ] = n$ ,则

$$n \leqslant x < n + 1,$$

从而 $\left( 1 + \frac{1}{n + 1} \right)^{n} < \left( 1 + \frac{1}{x} \right)^{x} < \left( 1 + \frac{1}{n} \right)^{n + 1}$ .注意到

$$\lim_{n \to \infty} \left( 1 + \frac{1}{n+1} \right)^n = \lim_{n \to \infty} \frac{\left( 1 + \frac{1}{n+1} \right)^{n+1}}{1 + \frac{1}{n+1}} = \mathrm{e}$$

$$\lim_{n \to \infty} \left( 1 + \frac{1}{n} \right)^{n+1} = \lim_{n \to \infty} \left( 1 + \frac{1}{n} \right)^n \cdot \left( 1 + \frac{1}{n} \right) = \mathrm{e}$$

由夹逼准则，得 $\lim_{x \to +\infty} \left(1 + \frac{1}{x}\right)^x = \mathrm{e}.$

再证 $\lim_{x \to -\infty} \left(1 + \frac{1}{x}\right)^x = \mathrm{e}.$ ° 3

$$\lim_{x \to -\infty} \left(1 + \frac{1}{x}\right)^x = \lim_{y \to +\infty} \left(1 - \frac{1}{y}\right)^{-y} = \lim_{y \to +\infty} \left(1 + \frac{1}{y - 1}\right)^{y - 1} \cdot \left(1 + \frac{1}{y - 1}\right) = \mathrm{e}.$$

[page:42]

## 第2章 极限与连续

综合上述结果得到 $\lim_{x \to \infty} \left( 1 + \frac{1}{x} \right)^x = \mathrm{e}$

极限 $\lim_{x \to \infty} \left( 1 + \frac{1}{x} \right)^x = \mathrm{e}$ 有时也写成 $\lim_{\alpha \to 0} (1 + \alpha)^{\frac{1}{\alpha}} = \mathrm{e}.$

例2.22求 $\lim_{x \to \infty} \left( \frac{x^2 - 3}{x^2 + 2} \right)^{2x^2}$

解

$$\begin{aligned}\lim_{x \rightarrow \infty}\left( \frac{x^{2} - 3}{x^{2} + 2} \right)^{2x^{2}} &= \lim_{x \rightarrow \infty}\left( 1 + \frac{- 5}{x^{2} + 2} \right)^{2x^{2}} = \lim_{x \rightarrow 0}\left( 1 + \alpha \right)^{\left( - \frac{1}{\alpha} \right)} \\&= \lim_{\alpha \rightarrow 0}\frac{1}{\left( 1 + \alpha \right)^{4}} \cdot \lim_{\alpha \rightarrow 0}\frac{1}{\left\lbrack \left( 1 + \alpha \right)^{1 / \alpha} \right\rbrack^{10}} = \frac{1}{\mathrm{e}^{10}}\end{aligned}$$

## 2.5.3 柯西收敛准则

柯西收敛准则数列 $\{ x_{n} \}$ 收敛的充分必要条件是: $V _ { \varepsilon } > 0$ ，∃自然数N，当$m > N, n > N$ 时，有 $\left| x_{m} - x_{n} \right| < \varepsilon$

证只证必要性.设 $\lim_{n \to \infty} x_n = a$ ，则 $V _ { E } > 0$ ，∃自然数N，当 $m > N, n > N$ 时，有$\left| x_{m}-a \right| < \frac{\varepsilon}{2}, \left| x_{n}-a \right| < \frac{\varepsilon}{2}$ .此时， $\left| x_{m}-x_{n} \right| \leqslant \left| x_{m}-a \right| +\left| x_{n}-a \right| < \frac{\varepsilon }{2} +\frac{\varepsilon }{2} =\varepsilon .$

## 习题2.5

1. 用单调有界数列必有极限的定理证明下列数列的极限存在:

(1) $x_{n}=1+\frac{1}{2^{2}}+\cdots+\frac{1}{n^{2}}$

(2) $x_{n}=\frac{1}{5+10}+\frac{1}{5^{2}+10}+\cdots+\frac{1}{5^{n}+10};$

(3) $x_{n}=\frac{1}{2}\cdot \frac{3}{4}\cdot \cdots \cdot \frac{2n-1}{2n};$

(4) $x_{n}=\frac{1}{n}+\frac{1}{n+1}+\cdots+\frac{1}{2n}$

2. 求下列数列的极限:

(1) $x_{1}=\sqrt{2},\cdots,x_{n+1}=\sqrt{2x_{n}},n=1,2,\cdots;$

(2) $x_{0}=1,x_{n + 1}=1+\frac{x_{n}}{1 + x_{n}};$

(3) $x_{1}=\sin x,x_{n + 1}=\sin x,n=1,2,\cdots;$

(4) $\lim_{n \to \infty} \sqrt[n]{a_{1}^{n} + a_{2}^{n} + \cdots + a_{k}^{n}} \quad (a_{i} > 0, i = 1, \cdots, k).$

3. 计算下列极限:

(1) $\lim_{x \to 0} \frac{\sin ax}{x}$ (2) $\lim_{x \to 0} \frac{\tan 3x}{x}$ (3) $\lim_{x \to 0} x \cot x  ;$ (4) $\lim_{x \to 0} \frac{1 - \cos 2x}{x \sin x}$

[page:43]

## 2.6 无穷小的比较

(5) $\lim_{n \to \infty} 2^n \sin \frac{x}{2^n}$ (6) $\lim_{x \to 0} \frac{\sin \alpha x}{\sin \beta x} (\beta \neq 0)$ ;(7) $\lim_{x \to a} \frac{\cos x - \cos a}{x - a}$

(8) $\lim_{x \to a} \frac{\sin x - \sin a}{x - a}$ (9) $\lim_{x \to 0} \frac{\arctan x}{x}$ (10) $\frac{\sqrt{1 + \tan x} - \sqrt{1 - \tan x}}{\sin 2x}$ 一一

(11) $\lim_{x \to \infty} x \sin \frac{1}{x}$ ；(12) $\lim_{x \to 0} x \sin \frac{1}{x}$ (13) $\lim_{x \to \frac{\pi}{2}} \left[ \sec x - \tan x \right]$

(14) $\frac{\sqrt{1 + \tan x} - \sqrt{1 + \sin x}}{x^3}$ (15) $\lim_{x \to \frac{\pi}{4}} \tan 2x \tan \left( \frac{\pi}{4} - x \right)$

4. 计算下列极限:

(1) $\lim_{x \to 0} (1 - x)^{\frac{1}{x}}$ (2) $\lim_{x \to 0} (1 + 2x)^{\frac{1}{x}}$ (3) $\lim_{x \to \infty} \left( \frac{1 + x}{x} \right)^{2x}$

(4) $\lim_{x \to \infty} \left( 1 - \frac{1}{x} \right)^{kx}$ (k为正整数)；(5)若 $\lim_{x \to \infty} \left( \frac{x + 2a}{x - a} \right)^x = 8$ ,求a;

(6) $\lim_{x \to 1} (1 + \sin x)^{\cos x}$ (7) $\lim_{x \to \frac{\pi}{4}} (\tan x)^{\tan 2x}$

(8) $\lim_{x \to \infty} \left( \cos \frac{a}{x} \right)^{x^2} (a \neq 0)$ ; (9) $\lim_{x \to \frac{\pi}{2}} (\sin x)^{\tan x}$

5.利用极限存在准则证明:

(1) $\lim_{n \to \infty} \sqrt{1 + \frac{1}{n}} = 1$ on.

(2) $\lim_{n \to \infty} \left( \frac{1}{n^2 + \pi} + \frac{1}{n^2 + 2\pi} + \cdots + \frac{1}{n^2 + n\pi} \right) = 1$

(3) 数列 $\sqrt{2}, \sqrt{2 + \sqrt{2}}, \sqrt{2 + \sqrt{2 + \sqrt{2}}}$ 的极限存在；

(4) $\lim_{x \to 0} \sqrt[n]{1 + x} = 1$

(5) $\lim_{x \to 0^{+}} x \left[ \frac{1}{x} \right] = 1$ se.

(6) 设 $a > 0$ ，证明 $\lim_{n \to \infty} \frac{a^n}{(1 + a)(1 + a^2) \cdots (1 + a^n)} = 0$

## 2.6 无穷小的比较

在同一极限过程中出现的几个无穷小量，尽管都以0为极限，但趋于0的快慢速度可能不一样.在某些问题中，需要比较它们趋于0的速度

定义 2.10 设 $\alpha + \beta$ 是同一极限过程中的两个无穷小量

若 $\lim_{} \frac{\alpha}{\beta} = c \neq 0$ ，则称 $\alpha$ 与 $\beta$ 是同阶无穷小.特别地，若 $\lim \frac{\alpha}{\beta} = 1$ ,称 $\alpha$ 与 $\beta$ 是等价无穷小，记作

$$\alpha \sim \beta .$$

若 $\lim_{\alpha} \frac{\alpha}{\beta} = 0$ ,则称α是比 $\beta$ 高阶的无穷小，记作

[page:44]

## 第2章 极限与连续

$$\alpha = o(\beta).$$

此时也称 $\beta$ 是比α低阶的无穷小.

若 $\lim_{\alpha} \frac{\alpha}{\beta}$ 不存在且不是无穷大，则称 $\alpha$ 与 $\beta$ 无法比较

若 $\lim_{} \frac{\alpha}{\beta^{k}} = c \neq 0$ ,其中 $k > 0$ ,则称α是 $\beta$ 的k阶无穷小.

例如，易知x→0时， $2 x ^ { 2 }$ 是比x高阶的无穷小，即 $2 x ^ { 2 } =$ $o(x) ; n \to \infty$ 时， $\frac { 1 } { n ^ { 2 } }$ 是比 $\frac{1}{n^{3}}$ 低阶的无穷小； $x \rightarrow 0$ 时，sinx与x是等价无穷小，即 $\sin x \sim x;x \to 0$ 时， $1 - \cos x$ 是x的二阶无穷小； $; n \rightarrow$ ∞时， $\frac{1}{n}$ 与 $\frac{\sin n}{n}$ 是无法比较的两个无穷小.

定理2.19 $\beta$ 与 $\alpha$ 是等价无穷小的充分必要条件是

$$\beta = \alpha + o(\alpha).$$

证必要性设 $\beta \sim \alpha$ ，则 $\lim \frac{\beta - \alpha}{\alpha} = \lim \frac{\beta}{\alpha} - 1 = 0$ ，所以 $\beta - \alpha = o(\alpha)$ ，即$\beta = \alpha + o(\alpha)$

充分性设 $\beta = \alpha + o(\alpha)$ ,则 $\lim \frac{\beta}{\alpha} = \lim \frac{\alpha + o(\alpha)}{\alpha} = 1$ ,即 $\beta$ 与α等价.

例2.23 因为x→0时， $\sin x \sim x,\tan x \sim x,\arcsin x \sim x,1 - \cos x \sim \frac{1}{2}x^{2}$ ，所以当x→0时，有

$$\sin x = x + o(x),\tan x = x + o(x),\arcsin x = x + o(x),1 - \cos x = \frac{1}{2}x^{2} + o(x^{2}).$$

定理2.20 假设在同一极限过程中有变量u及非零无穷小量 $\alpha , \alpha _ { 1 } , \beta , \beta _ { 1 }$ ，且$\alpha \sim \alpha_{1}, \beta \sim \beta_{1}$ .又 $\lim_{u \to \infty} \frac{\alpha_1}{\beta_1} = A$ ,则

$$\mathrm{lim}u \cdot \frac{\alpha}{\beta} = \mathrm{lim}u \cdot \frac{\alpha_{1}}{\beta_{1}} = A.$$

证 $\lim_{\alpha \to \beta} \frac{\alpha}{\beta} = \lim_{\alpha \to \alpha} \frac{\alpha}{\alpha_1} \cdot \frac{\alpha_1}{\beta_1} \cdot \frac{\beta_1}{\beta} = \lim_{\alpha \to \alpha} \lim_{\alpha \to \alpha} \frac{\alpha_1}{\beta_1} \cdot \lim_{\beta \to \beta} \frac{\beta_1}{\beta} = A.$

定理2.20表明在求极限时，无穷小量因子可由其等价无穷小代换

例2.24求 $\lim_{x \to 0} \frac{\tan 3x}{\arcsin 5x}$

解 $\lim_{x \to 0} \frac{\tan 3x}{\arcsin 5x} = \lim_{x \to 0} \frac{3x}{5x} = \frac{3}{5}$

例2.25求 $\lim_{x \to 0} \frac{\tan 3x}{x^3 + 3x}$

[page:45]

## 2.7 函数的连续性与间断点

解 $\lim_{x \to 0} \frac{\tan 3x}{x^3 + 3x} = \lim_{x \to 0} \frac{3x}{3x} = 1.$

## 习题2.6

1. 当x→0 时 $2x - x^{2}$ 与 $x^{2} - x^{3}$ 相比，哪一个是高阶无穷小？

2. 当x→1时，无穷小1—x和 $1 - x^{3} , \frac{1}{2}(1 - x^{2})$ 是否同阶?是否等价？

3. 证明:当x→0时，有(1) $\arctan x \sim x ;$ (2) $\sec x - 1 \sim \frac{x^{2}}{2}.$

4. 利用等价无穷小的性质，求下列极限:

(1) $\lim_{x \to 0} \frac{\tan 3x}{2x}$ (2) $\lim_{x \to 0} \frac{\sin(x^n)}{(\sin x)^m} (n,m)$ 为正整数）；(3) $\lim_{x \to 0} \frac{\tan x - \sin x}{\sin^3 x}$

5. 证明下列各关系式:

(1) $(1 + x)^{k} = 1 + kx + o(x)(x \to 0)$ ,k为正整数；(2) $\frac{1 - x}{1 + x} \sim 1 - \sqrt{x}(x \to 1)$ (3) $\sqrt{x+\sqrt{x+\sqrt{x}}}\sim \sqrt[8]{x}(x\to 0^{+})$

6. 当x→0时，试确定下列各无穷小关于基本无穷小x的阶数:(1) $x^{3} + 10^{2}x^{2}$ ; (2) $\sqrt[3]{x^{2}}-\sqrt{x}(x>0)$ ; (3) $\frac{x(x + 1)}{1 + \sqrt{x}} (x > 0)$ ； (4) $\sqrt{5 + x^{3}} - \sqrt{5}$

(5) $\sqrt[3]{\tan x};$ (6) $\ln(1 + x)$ (7) $x + \sin x ;$ (8) $\sin x - \tan x.$

7. 定出适当的p，使下面各式成立:

(1) $\sqrt{1-\cos x}+\sqrt[3]{x\sin x}\sim x^{p}(x\to0)$ ; (2) $\sin(2\pi\sqrt{n^2+1})\sim\frac{\pi}{n^p}(n\to\infty)$

## 2.7 函数的连续性与间断点

## 2.7.1 函数的连续性

自然界中有许多现象是连续变化的，经常表现为当一个量有微小变化时，另一个依赖于它的量的变化也很微小.如果这两个量之间有函数关系 $y = f(x)$ ，则这种连续变化可以用函数的如下性质描写，即自变量x有微小变化时，其引起的因变量y的变化也很微小.这就是函数连续性的概念.下面给出其严格定义.

设变量u从它的一个初值 $u _ { 1 }$ 变到终值 $u _ { 2 }$ ，终值与初值的差 $u _ { 2 } - u _ { 1 }$ 就叫做变量u的增量，记作 $\triangle u$ ，即

$$\Delta u = u _ { 2 } - u _ { 1 } .$$

[page:46]

## 第2章 极限与连续

应该注意增量 $\Delta \vec { u }$ 可正可负.

现在假定函数 $y = f(x)$ 在点 $x _ { 0 }$ 的某一个邻域内有定义，当自变量x在此邻域内从 $x_{0}$ 变到 $x_{0} + \Delta x$ 时，函数y相应地从 $f(x_{0})$ 变到$f(x_{0} + \Delta x)$ ,其对应的增量记为 $\Delta y = f(x_{0} +$ $\Delta x = f(x_{0})$ (图2.8).

定义2.11 设函数 $y = f(x)$ 在点 $x _ { 0 }$ 的某一个邻域内有定义，如果

$$\lim _ { \Delta x \rightarrow 0 } \Delta y = 0 ,$$

那么就称函数 $y = f(x)$ 在点 $x _ { 0 }$ 处连续.

设 $x = x_{0} + \Delta x$ ,则 $\Delta x \rightarrow 0$ 等价于 $x \rightarrow x_{0}$ 而 $\Delta y \rightarrow 0$ 等价于 $f(x) \to f(x_0)$ . 由此得 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 处连续的等价定义如下.

定义2.12 设函数 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 的某一个邻域内有定义，如果

$$\lim_{x \to x_0} f(x) = f(x_0),$$

就称函数 $y = f(x)$ 在点 $x _ { 0 }$ 处连续.

如果用 $\varepsilon - \delta$ 语言，可得 $y = f(x)$ 在点 $x _ { 0 }$ 处连续的等价定义如下.

定义2.13 设函数 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 的某一个邻域内有定义，如果

$V _ { \varepsilon } > 0$ ,日 $\delta > 0$ ,当 $\left| x - x_{0} \right| < \delta$ 时，有 $\left| f(x) - f(x_0) \right| < \varepsilon$

就称函数 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 处连续.

下面给出单侧连续的概念

定义2.14如果 $f(x_{0}^{-}) = f(x_{0})$ ，就称函数 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 处左连续；如果$f(x_{0}^{+}) = f(x_{0})$ ，就称函数 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 处右连续.

显然 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 处连续等价于 $y = f(x)$ 在点 $x _ { 0 }$ 处既是左连续的也是右连续的.

定义2.15在区间上每一点都连续的函数，叫做在该区间上的连续函数.如果区间包括端点，那么函数在左端点连续指的是右连续，在右端点连续指的是左连续.

连续函数的图形一般来说是一条连续而不间断的曲线

例2.26常值函数 $y = c$ 是连续函数.

例2.27 正弦函数 $y = \sin x$ 是连续的.

证任意取定一点x，给它一个增量 $\Delta x$ ,则

$$\Delta y = \sin(x + \Delta x) - \sin x = 2\sin\frac{\Delta x}{2}\cos\left(x + \frac{\Delta x}{2}\right).$$

[page:47]

## 2.7 函数的连续性与间断点

所以 $0 \leqslant \left| \Delta y \right| \leqslant 2 \left| \sin \frac{\Delta x}{2} \right| \leqslant \left| \Delta x \right|$ ，由夹逼准则知 $\lim _ { \Delta x \to 0 } \Delta y = 0 , y = \sin x$ 处处连续.类似可证 $y = \cos x$ 是连续的.

## 2.7.2 函数的间断点

与连续对立的概念是间断，下面给出间断点的定义

定义2.16 设函数 $f ( x )$ 在点 $x_{0}$ 的某去心邻域内有定义，如果函数 $f ( x )$ 属于下列三种情形之一:

(1) 在 $x = x_{0}$ 处没有定义；

(2) 虽在 $x = x_{0}$ 处有定义，但 $\lim_{x \to x_0} f(x)$ 不存在；

(3) 虽在 $x = x_{0}$ 处有定义， $\lim_{x \to x_0} f(x)$ 也存在，但 $\lim_{x \to x_0} f(x) \neq f(x_0)$ ，就称函数$f ( x )$ 在点 $\mathcal { X } _ { 0 }$ 处不连续，点 $x _ { 0 }$ 称为 $f ( x )$ 的间断点.

例2.28 $y = \frac{\sin x}{x}$ 在 $x \equiv 0$ 处无定义，所以 $x \equiv 0$ 是间断点，由于 $\lim_{x \to 0} \frac{\sin x}{x} = 1$ ,所以补充定义后函数 $f(x)=\left\{\begin{aligned}&\frac{\sin x}{x},x\neq 0,\\&1,\quad x=0\end{aligned}\right.$ 在 $x = 0$ 处是连续的.因此， $x = 0$ 称为可去间断点(图2.9).

例2.29 $y = \left\{ \begin{aligned} x, x \neq 0, \\ 1, x = 0 \end{aligned} \right.$ 满足 $\lim_{x \to 0} f(x) = \lim_{x \to 0} x = 0 \neq 1 = f(0)$ ，所以 $x = 0$ 是间断点.修改 $x = 0$ 处定义后得到的函数 $f(x) = x$ 在 $x = 0$ 处连续.因此， $x = 0$ 也称为可去间断点(图2.10).

例2.30 $y=\left\{\begin{aligned}x, \quad x \leqslant 0, \\x+1, x>0\end{aligned}\right.$ 满足 $f(0^{+}) = 1 \neq 0 = f(0^{-})$ ，所以 $x = 0$ 是间断点.这种左右极限都存在但不相等的间断点处函数的图形有一个跳跃，所以这种间断点称为跳跃间断点(图2.11).

[page:48]

## 第2章 极限与连续

例 2.31 $y = \tan x$ 满足 $\lim_{x \to \frac{\pi}{2}} f(x) = \infty$ $x = \frac{\pi}{2}$ 称为无穷间断点(图2.12).

例2.32 $y = \sin \frac{1}{x}$ 满足 $x \rightarrow 0$ 时函数无穷次振荡，极限不存在， $x = 0$ 称为振荡间断点(图2.13).

定义2.17 如果点 $\mathcal { X } _ { 0 }$ 是 $f ( x )$ 的间断点，而 $f(x_{0})$ 和 $f(x_{0}^{ 于 })$ 都存在，则称 $x _ { 0 }$ 是第一类间断点；如果 $f(x_{0})$ 和 $f ( x _ { 0 } ^ { + } )$ 至少有一个不存在，则称 $\mathcal { X } _ { 0 }$ 是第二类间断点.

显然可去间断点和跳跃间断点是第一类间断点，而无穷间断点和振荡间断点是第二类间断点

[page:49]

## 2.8 连续函数的运算与初等函数的连续性

## 习题2.7

1. 研究下列函数的连续性:

(1) $f(x)=\left\{\begin{aligned}&x^{2},&0\leqslant x\leqslant1,\\&2-x,&1\leqslant x\leqslant2;\end{aligned}\right.$ (2) $f(x)=\left\{\begin{aligned}x, & \quad -1 \leqslant x \leqslant 1, \\1, & \quad x \leqslant -1  或  x\end{aligned}\right.$ $x > 1$

2. 求下列函数的间断点，并指出其类型:

(1) $f(x)=\left\{\begin{aligned}x^{2}+1, & \quad x \in[0,1], \\2-x^{2}, & \quad x \in(1,2];\end{aligned}\right.$ (2) $f(x) = \frac{x^{2}}{1 + x};$ (3) $f(x) = \frac{1 - x^{2}}{1 - x};$

(4) $f(x) = \cot \left( 2x + \frac{\pi}{6} \right)$ ; (5) $f(x) = \ln(x^2 - 4)$ (6) $f(x)=\begin{cases}-1, & x<0, \\0, & x=0, \\1, & x>0;\end{cases}$

(7) $f(x) = x \sin \frac{1}{x};$ (8) $f(x) = \sin \frac{1}{x}$ (9) $f(x)=\begin{cases}\mathrm{e}^{\frac{1}{x-1}}, & x>0, \\ \ln(1+x), & -1<x\end{cases}$ ≤0.

3. 下列函数在指出的点处间断，说明这些间断点属于哪一类.如果是可去间断点，则补充或改变函数的定义使其连续.

(1) $y=\frac{x^{2}-1}{x^{2}-3x+2},x=1,x=2;$ (2) $y=\frac{x}{\tan x},x=k\pi,x=k\pi+\frac{\pi}{2}(k=0,\pm1,\pm2\cdots)$

(3) $y = \cos^{2}\frac{1}{x},x = 0;$ (4) $y=\left\{ \begin{aligned} x-1, & \quad x \leqslant 1, \\ 3-x, & \quad x > 1, \end{aligned} \right. \quad x=1.$

4. 讨论函数 $f(x) = \lim_{n \to \infty} \frac{1 - x^{2n}}{1 + x^{2n}}$ 的连续性，若有间断点，判别其类型

5. 证明:若函数f(x)在点 $x _ { 0 }$ 连续且 $f(x_{0}) \neq 0$ ，则存在 $x _ { 0 }$ 的某一邻域 $U ( x _ { 0 } )$ ,当 $x \in U(x_0)$时， $f(x) \neq 0.$

6. 设

$$f(x)=\left\{\begin{aligned}x, & \quad x \in \mathbb{Q}, \\0, & \quad x \in \mathbb{R} \backslash \mathbb{Q},\end{aligned}\right.$$

证明:

(1) f(x)在 x=0连续；

(2) f(x)在非零的x处都不连续.

7. 选择a的值，使下列函数处处连续:

(1) $f(x)=\left\{\begin{aligned}&e^{x},&x<0,\\&a+x,&x\geq0;\end{aligned}\right.$ (2) $f(x)=\left\{\begin{aligned}&\frac{2}{x},&x\geqslant1,\\&a\cos\pi x,&x<1;\end{aligned}\right.$ (3) $f(x)=\begin{cases}x\sin\frac{1}{x},&x>0,\\a+x^{2},&x\leqslant0.\end{cases}$

## 2.8 连续函数的运算与初等函数的连续性

## 2.8.1连续函数的和、差、积、商的连续性

由函数在某点连续的定义和极限的四则运算法则，可得下面的结果

[page:50]

## 第2章 极限与连续

定理2.21 设函数 $f ( x )$ 和 $g(x)$ 在点 $\mathcal { X } _ { 0 }$ 连续，则它们的和 $f + g$ 、差 $f { \longrightarrow } g$ 、积$f \cdot g$ 在 $x _ { 0 }$ 连续.若 $g(x_0) \neq 0$ ，则商 $\frac{f}{g}$ 也在 $x _ { 0 }$ 连续.

例2.33因 $\tan x = \frac{\sin x}{\cos x}, \cot x = \frac{\cos x}{\sin x}, \sec x = \frac{1}{\cos x}, \csc x = \frac{1}{\sin x}$ ，再加上常值函数以及正弦函数和余弦函数的连续性，可得三角函数在其定义域内是连续的

## 2.8.2 连续函数的反函数的连续性

定理2.22如果函数 $y = f(x)$ 在区间 $I _ { x }$ 上单调递增(或单调递减)且连续，那么它的反函数 $x = f^{-1}(y)$ 也在对应的区间 $I_{y}=\left\{y \mid y=f(x), x \in I_{x}\right\}$ 上单调递增(或单调递减)且连续.

例2.34由于 $y = \sin x$ 在 $\left[ -\frac{\pi}{2}, \frac{\pi}{2} \right]$ 上单调递增且连续，所以它的反函数$y = \arcsin x$ 在闭区间 $[ = 1 , 1 ]$ 上也是单调递增且连续的.同理可证arccosx，arctanx，arccotx在它们的定义域内也是连续的.总之，反三角函数都是连续函数.

例2.35 我们不加证明地指出，指数函数 $a^{x}(a>0,a \neq 1)$ 是R上的单调且连续的函数，值域为 $(0, +\infty)$ .所以它的反函数对数函数 $\log_{a}x(a>0,a\neq1)$ 是 $( 0 , + \infty )$ 上的单调且连续的函数.

## 2.8.3 连续函数的复合函数的连续性

定理2.23 设函数 $y = f[g(x)]$ 是由函数 $u = g(x)$ 与函数 $y = f(u)$ 复合而成， $U(x_0) \subset D_{f^*g}$ .若函数 $u = g(x)$ 在 $x = x_{0}$ 连续，且 $g(x_0) = u_0$ ，而函数 $y = f(u)$在 $\vec { u } = \vec { u } _ { 0 }$ 连续，则复合函数 $y = f[g(x)]$ 在 $\mathcal{X} = \mathcal{X}_0$ 也连续.

证 $\lim_{x \to x_0} f[g(x)] = \lim_{u \to u_0} f(u) = f(u_0) = f[g(x_0)]$ .需要说明一点， $x \in \mathring{U}(x_0)$ 时有可能 $g(x) = u_0$ ，但此时 $f[g(x)] = f(u_0) = f[g(x_0)]$ 并不影响上述极限过程.

例2.36在 $( 0 , + \infty )$ 上，幂函数 $\mathcal { X } ^ { \mu }$ 可改写为 $a^{\mu \log_{a} \tau}$ ，由指数函数与对数函数的连续性可得幂函数在 $( 0 , + \infty )$ 上的连续性.实际上可以证明幂函数在其定义域内是处处连续的.

## 2.8.4 初等函数的连续性

由于已经说明常值函数和三角函数、反三角函数、指数函数、对数函数、幂函数等基本初等函数的连续性，也已经说明连续函数的四则运算和复合运算仍然保持

[page:51]

## 2.8 连续函数的运算与初等函数的连续性

连续性，那么根据初等函数的定义可以得到

定理2.24一切初等函数在其定义区间内都是连续的

如果 $f ( x )$ 是初等函数，且 $\mathcal { X } _ { 0 }$ 是 $f ( x )$ 定义区间内的点，则根据连续的定义和初等函数的连续性有

$$\lim_{x \to x_0} f(x) = f(x_0).$$

例2.37求 $\lim_{x \to 1} \arctan(e^{x^2 - 1})$

解 $\lim_{x \to 1} \arctan(e^{x^2 - 1}) = \arctan(e^{x^2 - 1}) = \frac{\pi}{4}$

例2.38求 $\lim_{x \to 0} \frac{\sqrt{1 + x^2} - 1}{x^2}$

解

$$\lim_{x \to 0} \frac{\sqrt{1 + x^2} - 1}{x^2} = \lim_{x \to 0} \frac{(\sqrt{1 + x^2} - 1)(\sqrt{1 + x^2} + 1)}{x^2(\sqrt{1 + x^2} + 1)} = \lim_{x \to 0} \frac{1}{\sqrt{1 + x^2} + 1} = \frac{1}{2}$$

例2.39求 $\lim_{x \to 0} \frac{\log_{a}(1 + x)}{x}$

解 $\lim_{x \to 0} \frac{\log_{a}(1 + x)}{x} = \lim_{x \to 0} \log_{a}(1 + x)^{\frac{1}{x}} = \log_{a}e = \frac{1}{\ln a}$

特别地， $\lim_{x \to 0} \frac{\ln(1 + x)}{x} = 1$

例2.40求 $\lim_{x \to 0} \frac{a^x - 1}{x}$

解令 $a^{x} - 1 = t$ ,则 $x = \log_{a}(1 + t)$ ,当 $x \to 0$ 时 $\bar{t} \rightarrow 0,$ 于是

$$\lim_{x \to 0} \frac{a^x - 1}{x} = \lim_{t \to 0} \frac{t}{\log_a (1 + t)} = \ln a.$$

特别地， $\lim_{x \to 0} \frac{\mathrm{e}^x - 1}{x} = 1$

例2.41求 $\lim_{x \to 0} (1 + 3\tan x)^{\frac{2}{\sin x}}$

解

$$\lim_{x \to 0} (1 + 3\tan x)^{\frac{2}{\sin x}} = \lim_{x \to 0} e^{\frac{6\tan x}{\sin x} \ln(1 + 3\tan x)^{\frac{1}{3\tan x}}} = e^{\frac{6}{\sin x} \ln(1 + 3\tan x)^{\frac{1}{3\tan x}}} = e^{\frac{6}{\sin x}}$$

一般地，对于形如 $u(x)^{v(x)}(u(x)>0)$ 的函数(通常称为幂指函数)，如果

$$\mathrm{lim}u(x)=a>0,\quad \mathrm{lim}v(x)=b,$$

[page:52]

## 第2章 极限与连续

那么

$$\lim_{x \to a} (x)^{v(x)} = a^b.$$

例2.41也可以这样解

$$\lim_{x \to 0} (1 + 3\tan x)^{\frac{2}{\sin x}} = \lim_{x \to 0} (1 + 3\tan x)^{\frac{1}{3\tan x} \cdot \frac{6\tan x}{\sin x}} = \lim_{x \to 0} (1 + 3\tan x)^{\frac{1}{3\tan x}} \cdot \lim_{x \to 0} \frac{6\tan x}{\sin x} = \mathrm{e}^6.$$

## 习题2.8

1. 求函数 $f(x)=\frac{x^{3}+3x^{2}-x-3}{x^{2}+x-6}$ 的连续区间，并求极限 $\lim_{x \to 0} f(x), \lim_{x \to -3} f(x)  及  \lim_{x \to 2} f(x)$

2. 设函数 f(x)与 $g(x)$ 在点 $\mathcal { X } _ { 0 }$ 连续，证明函数

$$\varphi(x)=\max\{f(x),g(x)\},\psi(x)=\min\{f(x),g(x)\}$$

在点 $x _ { 0 }$ 也连续.

3. 求下列极限:

(1) $\lim_{x \to 0} \frac{\sqrt{x + 1} - 1}{x}$ (2) $\lim_{x \to +\infty} \left( \sqrt{x^2 + x} - \sqrt{x^2 - x} \right);$ (3) $\lim_{x \to 0} \frac{\sqrt[3]{x + 1} \lg(2 + x^2)}{(1 - x)^2 + \cos x}$ ..

(4) $\lim_{n \to \infty} \left( 1 + \frac{1}{2n} \right)^n$ ; (5) $\lim_{n \to \infty} \mathrm{e}^{n \sin \frac{1}{n}}$ ; (6) $\lim_{x \to \infty} \mathrm{e}^{\frac{1}{x}};$ (7) $\lim_{x \to 0} \ln \frac{\sin x}{x};$ (8) $\lim_{x \to \infty} \left( 1 + \frac{1}{x} \right)^{\frac{x}{2}}$

(9) $\lim_{x \to 0} \left( 1 + 3 \tan^2 x \right)^{\cot^2 x}$ ; (10) $\lim_{x \to \infty} \left( \frac{3 + x}{6 + x} \right)^{\frac{x - 1}{2}}$ . (11) $\frac{\sqrt{1 + \tan x} - \sqrt{1 + \sin x}}{x\sqrt{1 + \sin^2 x} - x}$ 一

(12) $\lim_{x \to \infty} \left( \frac{2x + 2}{2x + 1} \right)^{x}$ (13) $\lim_{x \to 1} \left( \frac{1 - x}{1 - x^2} \right)^{\frac{1 - \sqrt{x}}{1 - x}}$ (14) $\lim_{x \to \infty} \left( \frac{2x^2 - x}{x^2 + 1} \right)^{\frac{3x - 1}{x + 1}}$

(15) $\lim_{x \to \infty} \left( \cos \frac{a}{x} + k \sin \frac{a}{x} \right)^x (a \cdot k \neq 0)$ ; (16) $\lim_{x \to 0} \left( \frac{a^x + b^x + c^x}{3} \right)^{\frac{1}{x}} (a > 0, b > 0, c > 0)$

## 2.9 有界闭区间上连续函数的性质

有界闭区间上的连续函数具有几个重要的性质，下面分别来叙述

## 2.9.1 最大值最小值定理

先说明最大值和最小值的概念.设函数 $f ( x )$ 的定义域为D，若存在 $x_{0} \in D$ ,使得对于任意的 $x \in D$ ,都有

$$f(x) \leqslant f(x_0) \quad (f(x) \geqslant f(x_0)),$$

则称 $f(x_{0})$ 是函数 $f ( x )$ 在D上的最大值(最小值).

定理2.25(最大值最小值定理)有界闭区间上的连续函数在此区间上有最大值和最小值(图2.14).

[page:53]

## 2.9 有界闭区间上连续函数的性质

推论2.9(有界性定理） 有界闭区间上的连续函数在此区间上有界.

## 2.9.2 零点定理与介值定理

如果 $f(x_{0}) = 0$ ,则称 $\mathcal { X } _ { 0 }$ 是 $f ( x )$ 的零点.

定理2.26(零点定理） 设函数 $f ( x )$ 在有界闭区间 $[ a , b ]$ 上连续， $f(a)f(b)<0$ ，则在开区间 $(a,b)$ 内至少存在 $f ( x )$ 的一个零点.

图2.14

几何意义:如果连续曲线弧 $y = f(x)$ 的两个端点位于x轴的不同侧，那么这段曲线弧与x轴至少有一个交点(图2.15).

推论2.10(介值定理）设函数 $f ( x )$ 在有界闭区间 $[ a , b ]$ 上连续，

$$f(a)=A,\quad f(b)=B,$$

则对于A与B之间的任意一个数C，在开区间 $(a,b)$ 内至少存在一点 $\xi _ { 1 }$ 使得

$$f(\xi)=C \quad ( 图  2.16).$$

推论2.11 设函数 $f ( x )$ 在有界闭区间 $\left[ a , b \right]$ 上连续，则此函数可取到介于最大值和最小值之间的任何值

例2.42证明方程 $x^{5} - 3x = 1$ 在区间(1,2)内至少有一个根.

证设 $f(x)=x^{5}-3x-1$ ，它在[1，2]上连续

$$\begin{aligned}f(1) &= -3 < 0, \\f(2) &= 25 > 0,\end{aligned}$$

由零点定理， $f ( x )$ 在(1,2)内至少有一个零点，即方程 $x^{5}-3x=1$ 在区间(1,2)内至少有一个根.

[page:54]

## 第2章 极限与连续

## 习题2.9

1. 假设函数f(x)在闭区间[0,1]上连续，并且对[0,1]上任一点x有 $0 \leqslant f(x) \leqslant 1$ .试证明[0,1]中必存在一点c，使得 $f(c) = c(c$ 称为函数 $f ( x )$ 的不动点).

2. 证明方程 $x = a\sin x + b$ 其中 $a>0,b>0$ ，至少有一个正根，并且它不超过 $a + b .$

3. 证明方程 $\sin x + x + 1 = 0$ 在开区间 $\left( - \frac{\pi}{2}, \frac{\pi}{2} \right)$ 内至少有一个根.

4. 若f(x)在[a,b]上连续 $a < x_{1} < x_{2} < \cdots < x_{n} < b(n \geqslant 3)$ ，则在 $(x_{1},x_{n})$ 内至少有一点ξ，使$f(\xi)=\frac{f(x_{1})+f(x_{2})+\cdots+f(x_{n})}{n}$

5. 证明:若f(x)在 $( - \infty , + \infty )$ 内连续，且 $\lim_{x \to \infty} f(x)$ 存在，则f(x)必在 $( - \infty , + \infty )$ 内有界.

6. 设 f(x)在(a,b)上连续，且 $\lim_{x \to a^{+}} f(x) = \lim_{x \to b^{-}} f(x) = B$ ，又存在 $x_{1} \in (a,b)$ ,使得 $f(x_{1}) \geqslant$ B,证明f(x)在(a,b)上有最大值.

7. 设f(x)在(a,b)上连续，且 $\lim_{x \to a^{+}} f(x) = \lim_{x \to b^{-}} f(x) = +\infty$ ,证明f(x)在(a,b)上有最小值.

8. 如果存在直线 $L:y=kx+b$ ，使得当 $x \rightarrow \infty$ 或 $x \rightarrow + \infty , x \rightarrow - \infty$ 时，曲线 $y = f(x)$ 上的动点 $M(x,f(x))$ 到直线L的距离 $d(M,L) \to 0$ ，则称L为曲线 $y = f(x)$ 的渐近线.

(1） 证明:直线 $L:y=kx+b$ 为曲线 $y = f(x)$ 的渐近线的充分必要条件是

$$k = \lim_{x \to \infty \atop (x \to +\infty)} \frac{f(x)}{x}, \quad b = \lim_{x \to \infty \atop (x \to +\infty)} \left[ f(x) - kx \right];$$

(2) 求曲线 $y = (2x - 1)e^{\frac{1}{x}}$ 的渐近线.

[page:55]

# 第3章 导数与微分

微分学是微积分的重要组成部分，它的基本概念是导数与微分.本章主要讨论导数和微分的概念以及它们的计算方法

## 3.1 导数与微分的概念

## 3.1.1 引例

在自然科学和工程技术问题中，往往需要考虑某个函数的因变量随自变量变化的快慢程度(即变化速率).导数的概念正是从求函数变化率的问题中概括、抽象出来的.先看两个例子.

例3.1 质点做变速直线运动的瞬时速度

大家知道，匀速直线运动的速度就是平均速度.但对变速直线运动来说，只知道平均速度是不够的，还需要知道运动质点在每个时刻的瞬时速度.怎样求瞬时速度呢?

设质点P沿一直线做变速运动.用s表示从某一选定的时刻开始到时刻t为止质点所走过的路程，则s是t的函数，即 $s = s(t)$ .现在的问题是已知质点P的运动规律 $s = s(t)$ ，试求质点P在时刻 $t _ { 0 }$ 的瞬时速度 $v ( t _ { 0 } )$

当时间从 $t _ { 0 }$ 时刻变到 $t_{0} + \Delta t$ 时刻时，质点P所走过的路程为

$$\Delta s = s(t_{0} + \Delta t) - s(t_{0}).$$

如果质点做匀速运动，那么，速度是一个常数，它可以用质点所走过的路程 $\triangle s$ 与所用时间 $\Delta t$ 的比值，即平均速度来计算，即

$$\bar { \upsilon } = \frac { \Delta s } { \Delta t } = \frac { s ( t _ { 0 } + \Delta t ) - s ( t _ { 0 } ) } { \Delta t } ,$$

这也是质点在时刻 $t _ { 0 }$ 的瞬时速度 $v ( t _ { 0 } )$

当质点P做变速直线运动时，速度每时每刻都可能不同，因此，比值 $\bar { \varpi } { = } \frac { \Delta \bar { s } } { \Delta t }$ 不能表示质点P在时刻 $t _ { 0 }$ 的速度，而只能表示质点P在 $\Delta t$ 这段时间内的平均速度.不过，一般说来，当 $\vert \Delta t \vert$ 很小时，质点的运动速度来不及有多大改变，因此可以把运动近似看成是匀速的，这样，平均速度 $\bar { w } { = } \frac { \Delta \bar { s } } { \Delta t }$ 就可以近似地描述瞬时速度 $v(t_0), \cdots$般说来，当 $\vert \Delta t \vert$ 越小，则 $\bar{\boldsymbol{v}} = \frac{\Delta \boldsymbol{s}}{\Delta t}$ 越接近于 $v ( t _ { 0 } )$ ，因而当 $\Delta t \rightarrow 0$ 时，平均速度的极限

[page:56]

## 第3章 导数与微分

就是瞬时速度，即

$$v ( t _ { 0 } ) = \lim _ { \Delta t \rightarrow 0 } \frac { \Delta s } { \Delta t } = \lim _ { \Delta t \rightarrow 0 } \frac { s ( t _ { 0 } + \Delta t ) - s ( t _ { 0 } ) } { \Delta t } .$$

例3.2 曲线上一点处切线的斜率.

先明确一个问题，什么是曲线的切线？

在中学数学里，大家学过圆的切线，它的定义是，与圆(周)只有一个交点的直线(图3.1).但是，对于一般曲线，这种用交点个数来定义切线的做法是不适用的.例如，抛物线 $y = x^{2}$ 与y轴只有一个交点，然而y轴显然不是它的切线.又如，在图3.2中，直线 $M_{0}M_{1}$ 与曲线C的交点不止一个，但从直观上看，却没有理由说 $M_{0}M_{1}$ 不是曲线C在点$M_{0}$ 处的切线.

因此，对于一般曲线的切线，需要重新下定义

设有曲线C，为了求出它在点 $M_{0}$ 处的切线，在曲线C上任取另外一点N，连接点 $M_{0}$ 和N，得到割线 $M _ { 0 } N ,$ 让点 N沿着曲线C 朝着点 $M_{0}$ 移动，于是割线$M _ { 0 } N$ 便绕着点 $M_{0}$ 转动；当点N无限接近于点 $M_{0}$ 时，若割线 $M _ { 0 } N$ 有一个极限位置 $M _ { 0 } T$ ，则称直线 $M _ { 0 } T$ 为曲线C在点 $M_{0}$ 处的切线(图3.3).简言之，割线的极限位置就是切线.

显然，切线的这个定义对于圆也是适用的

有了切线的定义，下面来讨论例3.2.

设有曲线C，其方程为 $y = f(x),M_{0}(x_{0},f(x_{0}))$ 为其上一点.为了求曲线C在点 $M_{0}$ 处切线的斜率，在曲线C上另取一点N，设其坐标为 $(x_{0} + \Delta x, f(x_{0} + \Delta x))$ 8连接点 $M_{0}$ 和N.易知割线 $M _ { 0 } N$ 的斜率为

$$\frac{\Delta y}{\Delta x} = \frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x}.$$

当点N沿曲线C移动并无限接近于点 $M_{0}$ (即 $\Delta x \rightarrow 0$ 时，割线 $M _ { 0 } N$ 也随之变化而

[page:57]

## 3.1 导数与微分的概念

趋近于切线 $M _ { 0 } T$ ，于是割线的斜率就趋向于切线的斜率，即有

$$\tan \theta = \lim_{\Delta x \to 0} \frac{\Delta y}{\Delta x} = \lim_{\Delta x \to 0} \frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x},$$

其中 $\theta$ 为切线 $M _ { 0 } T$ 与 $\mathcal { X }$ 轴正向的夹角(图3.4).

虽然例3.1是运动学问题，而例3.2是几何学问题，但是它们在数学的处理方法上却是相同的，都是求函数的局部变化率，即函数的改变量与自变量的改变量之比(这是平均变化率)当后者趋向于0时的极限.这类求函数变化率的问题

在科学技术领域中是很多的，如瞬时功率问题，比热问题，温度梯度问题，线密度问题，瞬时电流问题，化学反应速率问题，生物繁殖率问题等.这些概念都是用函数在某点处的变化率来刻画的.这种变化率在数学上称为导数.

## 3.1.2 导数的定义

从上面所讨论的两个问题可以看出，非匀速直线运动的速度和切线的斜率都归结为

$$\lim_{x \to x_0} \frac{f(x) - f(x_0)}{x - x_0}$$

其中 $x = x_{0}$ 和 $f(x) - f(x_0)$ 分别为函数 $y = f(x)$ 自变量的增量 $\Delta x$ 和函数的增量 $\Delta y$

$$\Delta x = x - x_{0},$$

$$\Delta y = f(x) - f(x_0) = f(x_0 + \Delta x) - f(x_0).$$

因 $x \to x_{0}$ 相当于 $\Delta x \rightarrow 0$ ，故上式也可写成

$$\lim _ { \Delta x \rightarrow 0 } \frac { \Delta y } { \Delta x } \quad  或  \quad \lim _ { \Delta x \rightarrow 0 } \frac { f ( x _ { 0 } + \Delta x ) - f ( x _ { 0 } ) } { \Delta x }$$

定义3.1 设函数 $y = f(x)$ 在点 $x _ { 0 }$ 的某个邻域内有定义，当自变量x在 $x_{0}$处取得增量 $\Delta x$ 时，相应的的函数取得增量 $\Delta y = f(x_{0} + \Delta x) - f(x_{0})$ ;如果 $\Delta y$ 与$\Delta x$ 之比当 $\Delta x \rightarrow 0$ 时的极限存在，则称函数 $y = f(x)$ 在点 $x _ { 0 }$ 处可导，并称这个极限为函数 $y = f(x)$ 在点 $x _ { 0 }$ 处的导数，记为 $f^{\prime}(x_0)$ ,即

$$f^{\prime}(x_0) = \lim_{\Delta x \to 0} \frac{\Delta y}{\Delta x} = \lim_{\Delta x \to 0} \frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x},$$

也可记作 $y^{\prime} \mid_{x = x_{0}} , \left. \frac{\mathrm{d}y}{\mathrm{d}x} \right|_{x = x_{0}}$ 或 $\left| \frac{\mathrm{d}f(x)}{\mathrm{d}x} \right|_{x = x_0}$

导数的定义式也可取不同的形式，常见的有

$$f^{\prime}(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}$$

[page:58]

## 第3章 导数与微分

和

$$f^{\prime}(x_0) = \lim_{x \to x_0} \frac{f(x) - f(x_0)}{x - x_0}.$$

上面讲的是函数在一点处可导.如果函数 $y = f(x)$ 在开区间I内的每点处都可导，就称函数 $f(x)$ 在开区间Ⅰ内可导.这时，对于任一 $x \in I$ ，都对应着 $f ( x )$ 的一个确定的导数值.这样就构成了一个新的函数，这个函数叫做原来函数 $y = f(x)$ 的导函数，记作 $y ^ { \prime } , f ^ { \prime } \left( x \right) , \frac { \mathrm { d } y } { \mathrm { d } x }  或  \frac { \mathrm { d } f \left( x \right) } { \mathrm { d } x } .$

显然，函数 $f ( x )$ 在点 $\mathcal { X } _ { 0 }$ 处的导数 $f^{\prime}(x_{0})$ 就是导函数 $f ^ { \prime } ( x )$ 在点 $x = \overline{x_{0}}$ 处的函数值，即

$$f^{\prime}(x_0) = f^{\prime}(x) \mid_{x = x_0}$$

## 3.1.3 微分的定义

先分析一个具体问题.一块正方形金属薄片受温度变化的影响，其边长由 $\mathcal { X } _ { 0 }$

变到 $x_{0} + \Delta x$ 图3.5)，问此薄片的面积改变了多少？

设此薄片的边长为x，面积为A，则A与x存在函数关系 $A \equiv x^{2}$ .薄片受温度变化的影响时面积的改变量，可以看成是当自变量x自 $\mathcal { X } _ { 0 }$ 取得增量 $\Delta x$ 时，函数 $A = x^{2}$ 相应的增量 $\Delta A$ ,即

$$\Delta A = (x_{0} + \Delta x)^{2} - x_{0}^{2} = 2x_{0}\Delta x + (\Delta x)^{2}.$$

从上式可以看出， $\Delta A$ 分成两部分，第一部分 $2 x _ { 0 } \Delta x$ 是 $\Delta x$ 的线性函数，即图3.5中带有斜线的两个矩形面积之和，而第二部分 $( \Delta x ) ^ { 2 }$ 在图中是带有交叉斜线的小正方形的面积，当

$\Delta x \rightarrow 0$ 时，第二部分 $( \Delta x ) ^ { 2 }$ 是比 $\Delta x$ 高阶的无穷小，即 $( \Delta x ) ^ { 2 } = o ( \Delta x )$ .由此可见，如果边长改变很微小，即 $\vert \Delta x \vert$ 很小时，面积的改变量 $\Delta A$ 可近似地用第一部分来代替.

一般地，如果函数 $y = f(x)$ 满足一定条件，则增量 $\Delta y$ 可表示为

$$\Delta y = A\Delta x + o(\Delta x)$$

$$\Delta y - A\Delta x = o(\Delta x)$$

其中A为不依赖于 $\Delta x$ 的常数，因此 $A \Delta x$ 是 $\Delta x$ 的线性函数，且它与 $\Delta y$ 之差

[page:59]

## 3.1 导数与微分的概念

是比 $\Delta x$ 高阶的无穷小，所以，当 $A \neq 0$ ，且 $\vert \Delta x \vert$ 很小时，就可以用 $\Delta x$ 的线性函数$A \Delta x$ 来近似代替 $\Delta y$

定义3.2 设函数 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 的某个邻域内有定义，如果增量

$$\Delta y = f(x_{0} + \Delta x) - f(x_{0})$$

可表示为

$$\Delta y = A\Delta x + o(\Delta x),$$

其中A为不依赖于 $\Delta x$ 的常数，则称函数 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 是可微的，而 $A \Delta x$ 叫做函数 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 相应于自变量增量 $\Delta x$ 的微分，记作 $\mathrm{d}y$ ，即

$$\mathrm{d}y = A\Delta x.$$

## 3.1.4 可微与可导的关系

定理3.1 函数 $y = f(x)$ 在点 $x _ { 0 }$ 处可微的充要条件是 $f ( x )$ 在点 $x _ { 0 }$ 处可导.此时有

$$\mathrm{d}y = f^{\prime}(x_0) \Delta x.$$

证必要性设 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 处可微，由定义知

$$\Delta y = A \Delta x + o(\Delta x),$$

所以

$$\frac{\Delta y}{\Delta x} = A + \frac{o(\Delta x)}{\Delta x},$$

$$\lim _ { \Delta x \rightarrow 0 } \frac { \Delta y } { \Delta x } = \lim _ { \Delta x \rightarrow 0 } A + \lim _ { \Delta x \rightarrow 0 } \frac { o ( \Delta x ) } { \Delta x } = A ,$$

即 $f ( x )$ 在点 $x _ { 0 }$ 处可导，且 $f^{\prime}(x_0) = A$ ,即

$$\mathrm{d}y = f^{\prime}(x_0) \Delta x.$$

充分性设 $y = f(x)$ 在点 $x _ { 0 }$ 处可导，即极限

$$\lim _ { \Delta x \rightarrow 0 } \frac { \Delta y } { \Delta x } = f ^ { \prime } \left( x _ { 0 } \right)$$

存在，则有

$$\frac{\Delta y}{\Delta x} = f^{\prime}(x_0) + \alpha,$$

其中 $\alpha$ 为无穷小，所以

$$\Delta y = f^{\prime}(x_{0})\Delta x + \alpha\Delta x = f^{\prime}(x_{0})\Delta x + o(\Delta x),$$

即 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 处可微，且

$$\mathrm{d}y = f^{\prime}(x_0) \Delta x.$$

## 3.1.5 导数与微分的几何意义

在直角坐标系中，函数 $y = f(x)$ 的图形是一条曲线.对于某一固定的 $\mathcal { X } _ { 0 }$ 值，曲

[page:60]

## 第3章 导数与微分

线上有一个确定点 $M(x_{0},y_{0})$ ，当自变量x有微小增量 $\Delta x$ 时，就得到曲线上另一点 $N(x_{0} + \Delta x$ $y_{0} + \Delta y$ .从图3.6可知

$$\begin{aligned} { M Q } & { { } = \Delta x , } \\ { Q N } & { { } = \Delta y . } \\ \end{aligned}$$

过点M作曲线的切线MT，它的倾角为α，则导数 $f^{\prime}(x_0)$ 就是MT的斜率，即 $f^{\prime}(x_0) = \tan \alpha$ 4而

$$QP = MQ \cdot \tan \alpha = \Delta x \cdot f^{\prime}(x_0),$$

即

$$\mathrm{d}y = QP.$$

由此可见，对于可微函数 $y = f(x)$ 而言，当 $\Delta y$ 是曲线 $y = f(x)$ 上的点的纵坐标的增量时，dy就是曲线的切线上点的纵坐标的相应增量.当 $\vert \Delta x \vert$ 很小时，$\left| \Delta y - \mathrm{d}y \right|$ 比 $\Delta x \vert$ 小得多.因此在点M的邻近，可以用切线段来近似代替曲线段.在局部范围内用线性函数近似代替非线性函数，在几何上就是局部用切线段近似代替曲线段，这在数学上称为非线性函数的局部线性化，是微分学的基本思想方法之一.这种思想方法在自然科学和工程问题的研究中经常采用.

## 3.1.6 求导数与微分举例

例3.3求函数 $f(x) = C$ 的导数与微分.

解方法一 $f^{\prime}(x)=\lim_{h \to 0}\frac{f(x+h)-f(x)}{h}=\lim_{h \to 0}\frac{C-C}{h}=0$ ，所以 $(C)^{\prime} = 0$ $\mathrm{d}(C) = 0$

方法二因为 $\Delta y = C - C = 0 = 0 \cdot \Delta x + 0$ ，所以 $(C)^{\prime} = 0, \mathrm{d}(C) = 0$

例3.4求函数 $f(x)=x^{n}(n\in \mathbb{N}^{+})$ 在 $x = a$ 处的的导数与微分.

解方法一

$$\begin{aligned}f^{\prime}(a) &= \lim_{h \to 0} \frac{f(a + h) - f(a)}{h} = \lim_{h \to 0} \frac{(a + h)^n - a^n}{h} \\&= \lim_{h \to 0} \left[ na^{n-1} + \frac{n(n-1)}{2}a^{n-2}h + \cdots + h^{n-1} \right] = na^{n-1}.\end{aligned}$$

所以 $f^{\prime}(a)=na^{n - 1},\mathrm{d}y=na^{n - 1}\Delta x.$

方法二因为

$$\Delta y = (a + \Delta x)^n - a^n = na^{n - 1} \Delta x + \frac{n(n - 1)}{2}a^{n - 2}(\Delta x)^2 + \cdots + (\Delta x)^n \\= na^{n - 1} \Delta x + o(\Delta x),$$

所以 $\mathrm{d}y = na^{n - 1} \Delta x, f^{\prime}(a) = na^{n - 1}$

[page:61]

## 3.1 导数与微分的概念

2 在上例中，若取 $\bar { n } { = } 1$ ,则 $\mathrm{d}y = \mathrm{d}x = \Delta x$ 通常把自变量x的增量 $\Delta x$ 称为自变量的微分，记作dx，即 $\mathrm{d}x = \Delta x$ 于是函数 $y \equiv f(x)$ 的微分又可记作

$$\mathrm{d}y = f^{\prime}(x)\mathrm{d}x.$$

从而有

$$\frac{\mathrm{d}y}{\mathrm{d}x} = f^{\prime}(x).$$

这就是说，函数的微分dy与自变量的微分dx之商等于该函数的导数.因此，导数也叫做“微商”.

例3.5 求函数 $f(x) = \sin x$ 的导数与微分.

解方法一

$$\begin{aligned}f^{\prime}(x) = & \lim_{h \rightarrow 0}\frac{f(x + h) - f(x)}{h} = \lim_{h \rightarrow 0}\frac{\sin(x + h) - \sin x}{h} \\= & \lim_{h \rightarrow 0}\cos\left( x + \frac{h}{2} \right) \cdot \frac{\sin\frac{h}{2}}{\frac{h}{2}} = \cos x.\end{aligned}$$

所以 $\left( \sin x \right)^{\prime} = \cos x,\sin x = \cos x \mathrm{d}x.$

方法二

$$\Delta y = \sin(x + \Delta x) - \sin x = 2\cos\left(x + \frac{\Delta x}{2}\right)\sin\frac{\Delta x}{2},$$

由 cosx 的连续性知 $\cos \left( x + \frac{\Delta x}{2} \right) = \cos x + o(1)$ .以后我们也用o(1)表示无穷小.

由 $\lim_{\Delta x \to 0} \frac{\sin \frac{\Delta x}{2}}{\frac{\Delta x}{2}} = 1$ 知，sin $\frac{\Delta x}{2} = \frac{\Delta x}{2} + o(\Delta x)$ ,所以

$$\Delta y = 2\cos\left(x + \frac{\Delta x}{2}\right)\sin\frac{\Delta x}{2} = 2\left(\cos x + o(1)\right)\left(\frac{\Delta x}{2} + o(\Delta x)\right) = \left(\cos x\right) \cdot \Delta x + o(\Delta x)$$

由此可知， $\mathrm{d}\sin x = \cos x\mathrm{d}x, \left( \sin x \right)^{\prime} = \cos x.$

类似可以证明: $\mathrm{d}\cos x = -\sin x\mathrm{d}x, \quad \left(\cos x\right)^{\prime} = -\sin x.$

例3.6求函数 $f(x)=a^{x}(a>0,a\neq1)$ 的导数与微分.

解方法一

$$f^{\prime}(x)=\lim_{h \to 0}\frac{f(x+h)-f(x)}{h}=\lim_{h \to 0}\frac{a^{x+h}-a^{x}}{h}=a^{x}\lim_{h \to 0}\frac{a^{h}-1}{h}=a^{x}\ln a.$$

所以 $\mathrm{d}a^{x}=a^{x}\ln a\mathrm{d}x,\left(a^{x}\right)^{\prime}=a^{x}\ln a$

方法二

$$\Delta y = a^{x + \Delta x} - a^{x} = a^{x}(a^{\Delta x} - 1)$$

由 $\lim_{\Delta x \to 0} \frac{a^{\Delta x} - 1}{\Delta x} = \ln a$ 知 $a^{\Delta x} - 1 = (\ln a)\Delta x + o(\Delta x)$ .所以

[page:62]

## 第3章 导数与微分

$$\Delta y = (a^{x} \ln a) \Delta x + o(\Delta x)$$

由此可知， $\mathrm{d}a^{x}=a^{x}\ln a\mathrm{d}x,\left(a^{x}\right)^{\prime}=a^{x}\ln a.$

特别地， $\mathrm{d}\mathrm{e}^{x} = \mathrm{e}^{x}\mathrm{d}x, \left( \mathrm{e}^{x} \right)^{\prime} = \mathrm{e}^{x}$

例3.7 求函数 $f(x)=\log_{a}x(a>0,a\neq1)$ 的导数与微分.

解方法一

$$\begin{aligned}f^{\prime}(x) = & \lim_{h \rightarrow 0}\frac{f(x + h) - f(x)}{h} = \lim_{h \rightarrow 0}\frac{\log_{a}(x + h) - \log_{a}x}{h} \\= & \lim_{h \rightarrow 0}\frac{1}{h}\log_{a}\frac{x + h}{x} = \frac{1}{x}\lim_{h \rightarrow 0}\frac{\log_{a}\left( 1 + \frac{h}{x} \right)}{\frac{h}{x}} = \frac{1}{x\ln a}.\end{aligned}$$

所以 d $\log _ { a } x = \frac { 1 } { x \ln a } \mathrm { d } x , \left( \log _ { a } x \right) ^ { \prime } = \frac { 1 } { x \ln a }$

方法二

$$\Delta y = \log_{a}(x + \Delta x) - \log_{a}x = \log_{a}\left(1 + \frac{\Delta x}{x}\right),$$

由 $\frac{\log_{a}\left(1+\frac{\Delta x}{x}\right)}{\frac{\Delta x}{x}}=\frac{1}{\ln a}$ 知 $\log _ { a } \left( 1 + \frac { \Delta x } { x } \right) = \frac { 1 } { x \ln a } \Delta x + o ( \Delta x )$ .所以

$$\Delta y = \frac{1}{x \ln a} \Delta x + o(\Delta x).$$

由此可知， $\mathrm{d}\log_{a}x=\frac{1}{x\ln a}\mathrm{d}x,\left(\log_{a}x\right)^{\prime}=\frac{1}{x\ln a}.$

特别地， $\mathrm{d}\ln x = \frac{1}{x}\mathrm{d}x, \left( \ln x \right)^{\prime} = \frac{1}{x}$

例3.8 求函数 $f(x) = |x|$ 在x=0处的导数与微分.

解 $\lim_{h \to 0} \frac{f(0 + h) - f(0)}{h} = \lim_{h \to 0} \frac{|h|}{h}$ ,而

$$\lim_{h \to 0^{+}} \frac{|h|}{h} = \lim_{h \to 0^{+}} \frac{h}{h} = 1, \lim_{h \to 0^{-}} \frac{|h|}{h} = \lim_{h \to 0^{-}} \frac{-h}{h} = -1.$$

求导数与微分举例

所以 $\lim_{h \to 0} \frac{f(0 + h) - f(0)}{h}$ 不存在，即 $f(x) = |x|$ 在x=0处不可导，也不可微

## 3.1.7 单侧导数

定义3.3 若 $\lim_{h \to 0^-} \frac{f(x_0 + h) - f(x_0)}{h}$ 存在，则称其为f(x)在 $x _ { 0 }$ 处的左导数，记作 $f^{\prime} - (x_0)$ ;若 $\lim_{h \to 0^{+}} \frac{f(x_{0} + h) - f(x_{0})}{h}$ 存在，则称其为f(x)在 $\mathcal { X } _ { \mathbb { O } }$ 处的右导数，记

[page:63]

## 3.1 导数与微分的概念

作 $f^{\prime} + (x_0)$ .这两种导数统称为单侧导数.根据极限与单侧极限的关系，可以得到如下定理.

定理3.2 函数 $y = f(x)$ 在点 $x _ { 0 }$ 处可导的充要条件是 $f ( x )$ 在点 $x _ { 0 }$ 处的左右导数都存在且相等.

如果函数 $f ( x )$ 在开区间 $(a,b)$ 内可导，且 $f^{\prime}_{+}(a)$ 和 $f ^ { \prime } - ( b )$ 都存在，就说 $f ( x )$在闭区间 $\left[ a , b \right]$ 上可导.

## 3.1.8 函数可微性与连续性的关系

设函数 $y = f(x)$ 在点x处可微，则

$$\Delta y = f^{\prime}(x)\Delta x + o(\Delta x),$$

显然当 $\Delta x \rightarrow 0$ 时， $\Delta y \rightarrow 0$ .这就是说，函数 $y = f(x)$ 在点x处是连续的.

反之，若 $y = f(x)$ 在点x处是连续的，则 $y = f(x)$ 在点x处不一定可微.例3.8中的函数 $y = \left | x \right |$ 在 $x { = } 0$ 处就是一个反例.

## 习题3.1

1. 证明 $\left( \cos x \right)^{\prime} = - \sin x.$

2. 根据导数定义求下列函数的导数:

(1) $y = a x + c ;$ (2) $y = \frac{1}{x}$ ; (3) $y = \sqrt{x} (x > 0)$ ; (4) $y = x^{2} + x$

(5) $f(x)=\begin{cases}x^{2}\sin\frac{1}{x},&x\neq0,\\0,&x=0,\end{cases}$ 求 $f ^ { \prime } ( 0 )$

3. 证明 $y = \left| \sin x \right|$ 在 $x { = } 0$ 点不可导.

4. 证明 $y = x^{\frac{2}{3}}$ 在 $x = 0$ 点的右导数为十∞，而左导数为 $\quad - \infty ,$

5. 求下列函数 f(x)的 $f ^ { \prime } = ( 0 )$ 及 $f_{ 土 }^{\prime}(0)$ ，且判断 $f^{\prime}(0)$ 是否存在:

(1) $f(x)=\left\{\begin{aligned}&\sin x, &x<0, \\&\ln(1+x), &x\geq0;\end{aligned}\right.$ (2) $f(x)=\begin{cases}\frac{x}{1+\mathrm{e}^{\frac{1}{x}}},&x\neq0,\\0,&x=0;\end{cases}$

(3) $f(x)=\left\{\begin{aligned}&x^{2},&x\geqslant0,\\&-x,&x<0.\end{aligned}\right.$

6. 已知物体的运动规律为 $s = t^{3} \left( m \right)$ ，求这物体在 $t = 2   (s)$ 时的速度.

7. 如果 $f ( x )$ 为偶函数，且 $f^{\prime}(0)$ 存在，证明 $f^{\prime}(0) = 0.$

8. 证明若函数 $f ( x )$ 在 $( - \infty , + \infty )$ 上是可导的奇(或偶)函数，则 $f ^ { \prime } ( x )$ 在 $( - \infty , + \infty )$ 上是偶(或奇)函数.

9. 设 $f ( x )$ 在 $\mathcal { X } _ { 0 }$ 点可导 $\cdot \alpha _ { n } = \beta _ { n }$ 分别为趋于零的正数列，证明

$$\lim_{n \to \infty} \frac{f(x_0 + \alpha_n) - f(x_0 - \beta_n)}{\alpha_n + \beta_n} = f'(x_0).$$

[page:64]

## 第3章 导数与微分

10. 求曲线 $y = \sin x$ 在具有下列横坐标的各点处切线的斜率:

$$x = \frac{2}{3}\pi, \quad x = \pi.$$

11. 求曲线 $y = \cos x$ 上点 $\left( \frac{\pi}{3}, \frac{1}{2} \right)$ 处的切线方程和法线方程

12. 在抛物线 $y = x^{2}$ 上取横坐标为 $x _ { 1 } { = } 1$ 及 $x _ { 2 } { = } 3$ 的两点，作过这两点的割线.问该抛物线上哪一点的切线平行于这条割线？

13.设函数

$$f(x)=\begin{cases}x^{2},&x\leqslant1,\\ax+b,&x>1.\end{cases}$$

如果函数 $f ( x )$ 在 $x { \equiv } 1$ 处连续且可导，a，b应取什么值？

14. 已知 $f(x)=\begin{cases}\sin x, & x<0, \\x, & x\geq0,\end{cases}$ 求 $f ^ { \prime } ( x )$

15. 证明:双曲线 $\bar{x}y = a^{2}$ 上任一点处的切线与两坐标轴构成的三角形的面积都等于 $2 a ^ { 2 }$

## 3.2 微分和求导的法则

## 3.2.1函数的和、差、积、商的微分与求导法则

定理3.3 如果函数 $u = u(x)$ 及 $v = v(x)$ 都在点x可微，那么它们的和、差、积、商(除分母为零的点外)都在点x可微，且

$$\mathrm{d}\left[u(x)\pm v(x)\right]=\mathrm{d}u(x)\pm\mathrm{d}v(x); \quad \left[u(x)\pm v(x)\right]'=u'(x)\pm v'(x).$$

(2) $\left[ u(x)v(x) \right] = v(x)\mathrm{d}u(x) + u(x)\mathrm{d}v(x); \quad \left[ u(x)v(x) \right]' = u'(x)v(x) +$ $u(x)v^{\prime}(x)$

$$\mathrm{d}\left[\frac{u(x)}{v(x)}\right]=\frac{v(x)\mathrm{d}u(x)-u(x)\mathrm{d}v(x)}{v^{2}(x)}; \quad \left[\frac{u(x)}{v(x)}\right]'=\frac{u'(x)v(x)-u(x)v'(x)}{v^{2}(x)}.$$

$$\begin{aligned} 证  \quad (1)  方法  \quad & \left[ u(x) \pm v(x) \right]' \\= & \lim_{\Delta x \to 0} \frac{\left[ u(x) \pm v(x) \right] - \left[ u(x) \pm v(x) \right]}{\Delta x} \\= & \lim_{\Delta x \to 0} \frac{u(x \pm \Delta x) - u(x)}{\Delta x} \pm \lim_{\Delta x \to 0} \frac{v(x \pm \Delta x) - v(x)}{\Delta x} \\= & u'(x) \pm v'(x).\end{aligned}$$

所以(1)成立.

方法二由 $\Delta u = \mathrm{d}u + o(\Delta x), \Delta v = \mathrm{d}v + o(\Delta x)$ ，可得

$$\Delta ( u \pm v ) = \Delta u \pm \Delta v = \mathrm { d } u \pm \mathrm { d } v + o ( \Delta x ) .$$

所以(1)成立.

(2)方法一

$$\left[ u(x) v(x) \right]'$$

[page:65]

## 3.2 微分和求导的法则

$$\begin{aligned}= & \lim_{\Delta x \rightarrow 0} \frac{u(x + \Delta x)v(x + \Delta x) - u(x)v(x)}{\Delta x} \\= & \lim_{\Delta x \rightarrow 0} \left[ \frac{u(x + \Delta x) - u(x)}{\Delta x} \cdot v(x + \Delta x) + u(x) \cdot \frac{v(x + \Delta x) - v(x)}{\Delta x} \right] \\= & u^{\prime}(x)v(x) + u(x)v^{\prime}(x).\end{aligned}$$

所以(2)成立.

方法二由 $\Delta u = \mathrm{d}u + o(\Delta x), \Delta v = \mathrm{d}v + o(\Delta x)$ ,可得

$$\begin{align*}\Delta(uv) = & u(x + \Delta x)v(x + \Delta x) - u(x)v(x) \\= & (u + \Delta u)(v + \Delta v) - uv = (\Delta u)v + u\Delta v + \Delta u\Delta v \\= & (du + o(\Delta x))v + u(dv + o(\Delta x)) + (du + o(\Delta x))(dv + o(\Delta x)) \\= & vdu + udv + o(\Delta x).\end{align*}$$

所以(2)成立.

(3)方法一

$$\begin{array} { r l } { \left[ \frac { u ( x ) } { v ( x ) } \right] ^ { \prime }     =     } & { \underset { \Delta x \leftrightarrow \frac { u ( x + \Delta x ) } { v ( x + \Delta x ) } - \frac { u ( x ) } { v ( x ) } } { \frac { u ( x + \Delta x ) } { \Delta x } - \frac { u ( x ) } { v ( x ) } } } \\ { =     } & { \underset { \Delta x \leftrightarrow \frac { u ( x + \Delta x ) v ( x ) - u ( x ) v ( x + \Delta x ) } { v ( x + \Delta x ) v ( x ) \Delta x } } { \frac { u ( x + \Delta x ) - u ( x ) \big [ v ( x ) - u ( x ) \big [ v ( x + \Delta x ) - v ( x ) \big ] } { v ( x + \Delta x ) v ( x ) \Delta x } } } \\ { =     } & { \underset { \Delta x \leftrightarrow \frac { u ( x + \Delta x ) - u ( x ) } { \Delta x } - \frac { u ( x ) v ( x ) - u ( x ) v ( x + \Delta x ) - v ( x ) } { v ( x + \Delta x ) v ( x ) } } { \frac { u ( x ) v ( x ) - u ( x ) v ( x ) } { v ( x + \Delta x ) v ( x ) } - \frac { u ( x ) v ( x ) - v ( x ) } { \Delta x } } } \\ { =     } & { \frac { u ^ { \prime } ( x ) v ( x ) - u ( x ) v ^ { \prime } ( x ) } { v ^ { \prime } ( x ) } . } \end{array}$$

所以(3)成立.

方法二由 $\Delta u = \mathrm{d}u + o(\Delta x), \Delta v = \mathrm{d}v + o(\Delta x)$ ,可得

$$\begin{aligned}\Delta\left(\frac{1}{v}\right) &= \frac{1}{v(x + \Delta x)} - \frac{1}{v(x)} \\&= \frac{v(x) - v(x + \Delta x)}{v(x + \Delta x)v(x)} = - \frac{\mathrm{d}v + o(\Delta x)}{v^2(x)} \cdot \frac{v^2(x)}{v^2(x) + o(1)} \\&= - \left(\frac{\mathrm{d}v}{v^2} + o(\Delta x)\right) \cdot (1 + o(1)) = - \frac{1}{v^2}\mathrm{d}v + o(\Delta x),\end{aligned}$$

所以 $\mathrm{d}\left(\frac{1}{v}\right)=-\frac{1}{v^{2}}\mathrm{d}v,$ 进而

$$\begin{aligned}\mathrm{d}\left(\frac{u}{v}\right) = & \frac{1}{v}\mathrm{d}u + u\mathrm{d}\left(\frac{1}{v}\right) = \frac{1}{v}\mathrm{d}u - \frac{u}{v^{2}}\mathrm{d}v \\= & \frac{v\mathrm{d}u - u\mathrm{d}v}{v^{2}},\end{aligned}$$

所以(3)成立.

[page:66]

## 第3章 导数与微分

注 和、差与积的求导和微分法则可以推广到任意有限个可导函数的情形.例如，设 $u = u(x), v = v(x), w = w(x)$ 均可导，则有

$$(u + v - w)^{\prime} = u^{\prime} + v^{\prime} - w^{\prime}, \quad \mathrm{d}(u + v - w) = \mathrm{d}u + \mathrm{d}v - \mathrm{d}w.$$

$$\left( u v w \right) ^ { \prime } = u ^ { \prime } v w + u v ^ { \prime } w + u v w ^ { \prime } , \quad \mathrm { d } \left( u v w \right) = u w \mathrm { d } u + u w \mathrm { d } v + u v \mathrm { d } w ,$$

例3.9 求函数 $f(x) = \tan x$ 的导数与微分.

解方法一

$$\begin{aligned}\left( \tan x \right)^{\prime} = \left( \frac{\sin x}{\cos x} \right)^{\prime} = & \frac{\left( \sin x \right)^{\prime}\cos x - \sin x\left( \cos x \right)^{\prime}}{\cos^{2}x} \\= & \frac{\cos^{2}x + \sin^{2}x}{\cos^{2}x} = \sec^{2}x.\end{aligned}$$

所以 $\tan x = \sec^{2}x\mathrm{d}x$

方法二

$$\begin{aligned}\mathrm{d}\mathrm{tan}x = & \mathrm{d}\Big(\frac{\mathrm{sin}x}{\mathrm{cos}x}\Big) = \frac{\cos x\mathrm{d}\mathrm{sin}x - \sin x\mathrm{d}\mathrm{cos}x}{\cos^{2}x} \\= & \frac{1}{\cos^{2}x}\mathrm{d}x = \sec^{2}x\mathrm{d}x,\end{aligned}$$

所以 $\left( \tan x \right)^{\prime} = \sec^{2}x$

例3.10 求函数 $f(x) = \sec x$ 的导数与微分.

解方法一

$$\left( \sec x \right)^{\prime} = \left( \frac{1}{\cos x} \right)^{\prime} = \frac{\sin x}{\cos^{2}x} = \sec x\tan x.$$

所以 $\mathrm{d}\sec x = \sec x\tan x\mathrm{d}x$

方法二

$$\begin{aligned}\mathrm{d}\mathrm{s}\mathrm{e}x = & \mathrm{d}\Big(\frac{1}{\mathrm{cos}x}\Big) = -\frac{\mathrm{d}\mathrm{cos}x}{\mathrm{cos}^2x} \\= & \frac{\mathrm{sin}x}{\mathrm{cos}^2x}\mathrm{d}x = \mathrm{sec}x\mathrm{tan}x\mathrm{d}x,\end{aligned}$$

所以 $\left( \sec x \right)^{\prime} = \sec x \tan x$

同理可得

$$\begin{aligned} &\mathrm{d}\cot x = -\csc^{2}x\mathrm{d}x; \quad (\cot x)^{\prime} = -\csc^{2}x.\\ &\mathrm{d}\csc x = -\csc x\cot x\mathrm{d}x; \quad (\csc x)^{\prime} = -\csc x\cot x.\\ \end{aligned}$$

## 3.2.2反函数的微分与求导法则

定理3.4如果函数 $x = f(y)$ 在区间 $I _ { y }$ 内单调、可微且 $f^{\prime}(y) \neq 0$ ，则它的反

[page:67]

## 3.2 微分和求导的法则

函数 $y = f^{-1}(x)$ 在区间 $I_{x}=\left\{x \mid x=f(y), y \in I_{y}\right\}$ 内也可微，且

$$\mathrm{d}y = \frac{1}{f^{\prime}(y)}\mathrm{d}x, \quad \frac{\mathrm{d}y}{\mathrm{d}x} = \frac{1}{f^{\prime}(y)}  或者  \mathrm{d}y = \frac{1}{\frac{\mathrm{d}x}{\mathrm{d}y}}\mathrm{d}x, \quad \frac{\mathrm{d}y}{\mathrm{d}x} = \frac{1}{\frac{\mathrm{d}x}{\mathrm{d}y}}.$$

证方法一 $\frac{\mathrm{d}y}{\mathrm{d}x}=\left[f^{-1}(x)\right]'=\lim_{\Delta x \to 0}\frac{\Delta y}{\Delta x}=\lim_{\Delta y \to 0}\frac{1}{\frac{\Delta x}{\Delta y}}=\frac{1}{f'(y)}=\frac{1}{\frac{\mathrm{d}x}{\mathrm{d}y}}$ 所以定理的结论成立.

方法二由 $\Delta x = f^{\prime}(y)\Delta y + o(\Delta y)$ ，得到 $\Delta y = \frac{1}{f^{\prime}(y)} \Delta x + \frac{o(\Delta y)}{f^{\prime}(y)} = \frac{1}{f^{\prime}(y)}$ $\Delta x + o(\Delta x)$ ，所以定理的结论成立

例3.11求函数 $y = \arcsin x$ 的导数与微分.

解设 $x = \sin y, y \in \left[ - \frac{\pi}{2}, \frac{\pi}{2} \right]$ 为直接函数，则 $y = \arcsin x$ 是它的反函数.函数 $x = \sin y$ 在开区间 $I_{y}=\left(-\frac{\pi}{2},\frac{\pi}{2}\right)$ 内单调、可导，且

$$\left( \sin y \right)^{\prime} = \cos y > 0.$$

因此，在对应区间 $I_{x} = (-1,1)$ 内有

$$\mathrm{d}y = \frac{1}{\left( \sin y \right)^{\prime}}\mathrm{d}x = \frac{1}{\cos y}\mathrm{d}x, \quad \frac{\mathrm{d}y}{\mathrm{d}x} = \frac{1}{\cos y}.$$

但 $\cos y = \sqrt{1 - \sin^{2}y} = \sqrt{1 - x^{2}}$ ，所以可得

$$\mathrm{d}(\arcsin x)=\frac{1}{\sqrt{1-x^{2}}}\mathrm{d}x,\quad(\arcsin x)^{\prime}=\frac{1}{\sqrt{1-x^{2}}}.$$

类似可得 $\mathrm{d}(\arccos x)=-\frac{1}{\sqrt{1-x^{2}}}\mathrm{d}x,\quad(\arccos x)^{\prime}=-\frac{1}{\sqrt{1-x^{2}}}.$

例3.12 求函数 y=arctanx的导数与微分.

解设 $x = \tan y, y \in \left( - \frac{\pi}{2}, \frac{\pi}{2} \right)$ 为直接函数，则 $y = \arctan x$ 是它的反函数.函数 $x = \tan y$ 在开区间 $I_{y}=\left(-\frac{\pi}{2},\frac{\pi}{2}\right)$ 内单调、可导，且

$$(\tan y)^{\prime} = \sec^{2} y > 0.$$

因此，在对应区间 $I_{x} = ( - \infty, + \infty )$ 内有

$$\mathrm{d}y = \frac{1}{\left( \tan y \right)^{\prime}}\mathrm{d}x = \frac{1}{\sec^{2}y}\mathrm{d}x, \quad \frac{\mathrm{d}y}{\mathrm{d}x} = \frac{1}{\sec^{2}y}.$$

但 $\sec^{2} y = 1 + \tan^{2} y = 1 + x^{2}$ ，所以可得

$$\mathrm{d}(\arctan x)=\frac{1}{1+x^{2}}\mathrm{d}x,\quad(\arctan x)^{\prime}=\frac{1}{1+x^{2}}.$$

[page:68]

## 第3章 导数与微分

类似可得

$$\mathrm{d}(\arccos x)=-\frac{1}{1+x^{2}}\mathrm{d}x,\quad(\arccos x)^{\prime}=-\frac{1}{1+x^{2}}.$$

## 3.2.3 复合函数的微分与求导法则

定理3.5 如果函数 $u = g(x)$ 在点x可微，而 $y = f(u)$ 在点 $u = g(x)$ 可微，则复合函数 $y = f[g(x)]$ 在点x可微，且

$$\mathrm{d}y = f^{\prime}(u)\mathrm{d}u, \quad \frac{\mathrm{d}y}{\mathrm{d}x} = \frac{\mathrm{d}y}{\mathrm{d}u} \cdot \frac{\mathrm{d}u}{\mathrm{d}x}.$$

证由 $\Delta y = f^{\prime}(u)\Delta u + o(\Delta u), \Delta u = \mathrm{d}u + o(\Delta x) = g^{\prime}(x)\mathrm{d}x + o(\Delta x)$得到

$$\begin{aligned}\Delta y &= f^{\prime}(u)(\mathrm{d}u + o(\Delta x)) + o(\Delta u) = f^{\prime}(u)\mathrm{d}u + o(\Delta x) \\&= f^{\prime}(u)g^{\prime}(x)\mathrm{d}x + o(\Delta x),\end{aligned}$$

所以定理的结论成立.

注当 $y = f(u) , u$ 是自变量时，当然有 $\mathrm{d}y = f^{\prime}(u)\mathrm{d}u.$ 本定理证明了当 $y =$ $f(u),u$ 是中间变量时， $\mathrm{d}y = f^{\prime}(u)\mathrm{d}u$ 仍然成立，这被称为一阶微分的形式不变性

例3.13 求函数 $y = x^{\mu} (x > 0)$ 的导数与微分.

解方法一 $y = x^{\mu} = \mathrm{e}^{\mu \ln x}$ ,令 $u = \mu \ln x$ ,则 $y = \mathrm{e}^{u}$

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{\mathrm{d}y}{\mathrm{d}u} \cdot \frac{\mathrm{d}u}{\mathrm{d}x} = \mathrm{e}^{u} \cdot \frac{\mu}{x} = x^{\mu} \cdot \frac{\mu}{x} = \mu x^{\mu - 1}.$$

所以 $\mathrm{d}(\mu \ln x) = \mu x^{\mu - 1} \mathrm{d}x$

方法二 $y = x^{\mu} = \mathrm{e}^{\mu \ln x}$ ,令 $u = \mu \ln x$ ,则 $y = \mathrm{e}^{u}$

$$\mathrm{d}y = \mathrm{e}^{u}\mathrm{d}u = \mathrm{e}^{u\ln x}\mathrm{d}(f\mathrm{d}\ln x) = \mathrm{e}^{u\ln x}\frac{f}{x}\mathrm{d}x = \mu x^{\mu - 1}\mathrm{d}x,$$

所以 $(x^{n})^{\prime} = u x^{n - 1}$

复合函数的求导法则被称为链锁法则，可以推广到多个中间变量的情形

我们以两个中间变量为例，设 $y = f(u) , u = \varphi(v) , v = \psi(x)$ ，则符合函数 $y =$ $f\left\{ \varphi \left[ \psi (x) \right] \right\}$ 的导数为 $\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{\mathrm{d}y}{\mathrm{d}u} \cdot \frac{\mathrm{d}u}{\mathrm{d}v} \cdot \frac{\mathrm{d}v}{\mathrm{d}x}.$

比如 $y = \operatorname{l n c o s}(e^x)$ 可以看成 $y = \ln u , u = \cos v , v = \mathrm{e}^{x}$ 复合而成.

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{\mathrm{d}y}{\mathrm{d}u} \cdot \frac{\mathrm{d}u}{\mathrm{d}v} \cdot \frac{\mathrm{d}v}{\mathrm{d}x} = \frac{1}{u} \cdot (-\sin v) \cdot \mathrm{e}^{x} = -\frac{\sin(\mathrm{e}^{x})}{\cos(\mathrm{e}^{x})} \cdot \mathrm{e}^{x} = -\mathrm{e}^{x}\tan(\mathrm{e}^{x}).$$

当然，做得熟练之后，可以不写出中间变量，直接写为

$$\frac{\mathrm{d}y}{\mathrm{d}x}=\left[\arccos\left(\mathrm{e}^{x}\right)\right]^{\prime}=\frac{1}{\cos\left(\mathrm{e}^{x}\right)}\left[\cos\left(\mathrm{e}^{x}\right)\right]^{\prime}=\frac{-\sin\left(\mathrm{e}^{x}\right)}{\cos\left(\mathrm{e}^{x}\right)}\left(\mathrm{e}^{x}\right)^{\prime}=-\mathrm{e}^{x}\tan\left(\mathrm{e}^{x}\right).$$

但是若用求微分的方法，则多少中间变量在形式上区别不大.对本例来说，可以写成

[page:69]

## 3.2 微分和求导的法则

## 反函数与复合函数的微分与求导法则

## 习题3.2

1. 推导余切函数及余割函数的导数公式:

$$\left( \cot x \right)^{\prime} = - \csc^{2}x, \quad \left( \csc x \right)^{\prime} = - \csc x\cot x.$$

2. 求下列函数的导数:

(1) $y=x^{3}+\frac{7}{x^{4}}-\frac{2}{x}+12;$ (2) $y = 5x^{3} - 2^{x} + 3\mathrm{e}^{x}$ ; (3) $y = 2\tan x + \sec x - 1$

(4) $y = \sin x \cdot \cos x;$ (5) $y = x^{2}\ln x;$ (6) $y = 3\mathrm{e}^{x}\cos x$ (7) $y = \frac{\ln x}{x}$ . (8) $y = \frac{\mathrm{e}^{x}}{x^{2}} + \ln 3$

(9) $y = x^{2}(\ln x)\cos x;$ (10) $\frac{1 + \sin t}{1 + \cos t}$

3. 求下列函数的微分:

(1) $y=\frac{1}{x}+2\sqrt{x};$ (2) $y = x\sin 2x;$ (3) $y = \frac{x}{\sqrt{x^{2} + 1}}$ (4) $y = \ln^{2}(1 - x)$

(5) $y = x^{2} \mathrm{e}^{2x}$ ; (6) $y = \mathrm{e}^{-x} \cos(3 - x)$ ;(7) $y = \arcsin \sqrt{1 - x^{2}}$ ;(8) $y = \tan^{2}(1 + 2x^{2})$

(9) $y = \arctan \frac{1 - x^{2}}{1 + x^{2}}$ ;(10) $s = A \sin(\omega t + \varphi)$

4. 以初速度v竖直上抛的物体，其上升高度s与时间t的关系是 $v_{s}=v_{0}t-\frac{1}{2}gt^{2}$ .求:

(1) 该物体的速度 $v ( t ) ;$ (2)该物体达到最高点的时刻.

5. 求曲线 $y = 2\sin x + x^{2}$ 上横坐标为 $x = 0$ 的点处的切线方程和法线方程

6. 讨论函数

$$f(x)=\begin{cases}x\sin\frac{1}{x},&x\neq0,\\0,&x=0.\end{cases}$$

在x=0处的连续性与可导性.

7. 求下列函数的导数:

(1) $y = (2x + 5)^{4}$ ; (2) $y = \cos(4 - 3x)$ ; (3) $y = \mathrm{e}^{-3x^{2}}$ ; (4) $y = \ln(1 + x^{2})$

(5) $y = \sin^{2}x;$ (6) $y = \sqrt{a^{2} - x^{2}}$ (7) $y = \tan x^{2}$ ; (8) $y = \arctan(\mathrm{e}^{x})$

(9) $y = ( \arcsin x ) ^ { 2 }$ ;(10) $y = \arccos x$ *#. (11) $y=x-\frac{1}{2}x^{2}+\frac{1}{3}x^{3}$ in

(12) $y=\frac{1}{x}+\frac{1}{\sqrt{x}}+\frac{1}{\sqrt[3]{x}}$ (13) $y=\frac{ax+b}{cx+d}$ ；(14) $y=\left(x-a\right)\left(x-b\right)^{2}\left(x-c\right)^{3}$ 1

[page:70]

## 第3章 导数与微分

(15) $y = x\sin x + \frac{\sin x}{x};$ (16) $y = x \cdot 10^{x}.$

8. 求下列函数的导数:

(1) $y = \arcsin(1 - 2x)$ ;(2) $y = \frac{1}{\sqrt{1 - x^{2}}}$ ;(3) $y = \mathrm{e}^{-\frac{x}{2}} \cos 3x;$ (4) $y = \arccos \frac{1}{x}$

(5) $y = \frac{1 - \ln x}{1 + \ln x};$ (6) $y=\frac{\sin 2x}{x}$ (7) $y = \arcsin \sqrt{x}$ (8) $y = \ln(x + \sqrt{a^2 + x^2})$

(9) $y = \ln(\sec x + \tan x)$ ; (10) $y = \ln(\csc x - \cot x)$ ; (11) $y = \arcsin(\sin x)$

(12) $y = \arctan \frac{1 + x}{1 - x};$ (13) $y = \ln \tan \frac{x}{2} - \cos x$ • lntanx; (14) $y = \ln(e^x + \sqrt{1 + e^{2x}})$

(15) $y = x^{\frac{1}{x}} \left( x > 0 \right)$ (16) $y = \mathrm{e}^{ax}\sin b.x;$ (17) $y = \arcsin \frac{x}{a};$ (18) $y = \frac{1}{a}\arctan\frac{x}{a};$

(19) $y = \cos^{5}x;$ (20) $y = \ln\tan 3x$ (21) $y = \ln \frac{t^{2}}{\sqrt{1 + t^{2}}}$ (22) $y = \arcsin \frac{2x}{x^{2} + 1}$

(23) $y = \frac{2}{\sqrt{a^{2} - b^{2}}}\arctan\left( \sqrt{\frac{a - b}{a + b}}\tan\frac{x}{2} \right) \quad (a > b \geqslant 0); \quad (24) y = \frac{1}{2a}\ln\left| \frac{x - a}{x + a} \right|$

(25) $y = \frac{x}{2}\sqrt{x^{2} + a^{2}} + \frac{a^{2}}{2}\ln|x + \sqrt{x^{2} + a^{2}}| (a \neq 0)$

(26) $y = \frac{x}{2}\sqrt{x^{2} - a^{2}} - \frac{a^{2}}{2}\ln|x| + \sqrt{x^{2} - a^{2}} \quad (a \neq 0).$

9. 求下列函数的导数:

(1) $y = \left( \arcsin \frac{x}{2} \right)^{2}$ (2) $y = \ln\tan\frac{x}{2};$ (3) $y = \sqrt{1 + \ln^{2}x}$ 1

(4) $y = \mathrm{e}^{\arctan \sqrt{x}}$ (5) $y = \sin^{n}x\cos nx;$ (6) $y = \frac{\arcsin x}{\arccos x}$ ; (7) $y = \mathrm{ln} \ln x$

(8) $y = \frac{\sqrt{1 + x} - \sqrt{1 - x}}{\sqrt{1 + x} + \sqrt{1 - x}};$ (9) $y = \arcsin \sqrt{\frac{1 - x}{1 + x}}$

10. 设函数 f(x)和 $g(x)$ 可导，且 $f^{2}(x) + g^{2}(x) \neq 0$ ，试求函数 $y = \sqrt{f^{2}(x) + g^{2}(x)}$ 的导数.

11.设f(x)可导，求下列函数的导数:

(1) $y = f(x^{2})$ ; (2) $y = f(\sin^{2}x) + f(\cos^{2}x)$

12. 求下列函数的导数:

(1) $y = \mathrm{e}^{-x} \left( x^{2} - 2x + 3 \right);$ (2) $y = \sin^{2}x \cdot \sin(x^{2})$ ; (3) $y = \left( \arctan \frac{x}{2} \right)^{2}$ (4) $y {=} \frac{\ln x}{x^{n}}$ ae

(5) $y = \frac{\mathrm{e}^{t} - \mathrm{e}^{- t}}{\mathrm{e}^{t} + \mathrm{e}^{- t}};$ (6) $y = \arccos \frac{1}{x}$ (7) $y = \mathrm{e}^{-\sin^{2}\frac{1}{x}}$ ; (8) $y = \sqrt{x + \sqrt{x}}$

(9) $y = x \arcsin \frac{x}{2} + \sqrt{4 - x^2}$

13. 求下列函数的微分:

(1) $y = \frac{1}{x}$ (2) $y = \cos x;$ (3) $\bar{y} = a^{x};$ (4) $y = \ln x;$ (5) $y = \frac{\ln x}{\sqrt{x}}$

(6) $y = \sqrt{x^{2} + a^{2}}$ ;(7) $y = \tan^{2}x + \ln\left| \cos x \right|$ ; (8) $y = \mathrm{e}^{x^{2}} \cos^{4} x.$

[page:71]

## 3.3高阶导数

14. 用微分的运算法则求下列函数的微分:

(1) $y = \left( x^{2} + 4x + 1 \right) \left( x^{2} - \sqrt{x} \right)$ (2) $\bar{y} = \frac{x^{2} - 1}{x^{3} + 1};$ (3) $y = \tan x + \frac { 1 } { \cos x } =$ (4) $y = \cos x^{2}$

(5) $y = \arccos \frac{1}{x};$ (6) $y = \arctan(\ln x)$

15. 设 $u(x),v(x),w(x)$ 都是x的可微函数，求下列函数的微分:

(1) $y = u \cdot v \cdot v;$ (2) $y = \ln \sqrt{u^{2} + v^{2}}$ (3) $y = \arctan \frac{\pi}{v};$ (4) $y = (u^{2} + v^{2} + w^{2})^{3/2}$

(5) $y = \mathrm{e}^{u \cdot v}$ (6) $y = \mathrm{e}^{v} \sin u ;$ (7) $y = \mathrm{e}^{\arctan(u \cdot v)}$ 。

16. 设函数 $f ( x )$ 和 $g ( x )$ 均在点 $x _ { 0 }$ 的某一邻域内有定义， $f ( x )$ 在 $\mathcal { X } _ { 0 }$ 处可导， $f ( x _ { 0 } ) = 0$ $g(x)$ 在 $\mathcal { X } _ { 0 }$ 处连续，试讨论 $f(x)g(x)$ 在 $\mathcal { X } _ { 0 }$ 处的可导性.

17. 设函数 f(x)满足下列条件:

(1) $f(x+y)=f(x) \cdot f(y)$ ，对一切 $x , y \in \mathbb { R }$

(2) $f(x) = 1 + xg(x)$ ，而 $\lim_{x \to 0} (x) = 1$

试证明f(x)在R上处处可导，且 $f^{\prime}(x) = f(x)$

## 3.3 高阶导数

## 3.3.1 定义

设函数 $y = f(x)$ 的导函数 $y^{\prime} = f^{\prime}(x)$ 存在.若 $y^{\prime} = f^{\prime}(x)$ 在点 $x _ { 0 }$ 处的导数存在，则称它为函数 $y = f(x)$ 的二阶导数，记作

$$f^{\prime\prime}(x_0), \quad y^{\prime\prime}(x_0) \quad  或  \quad \left.\frac{\mathrm{d}^2 y}{\mathrm{d} x^2}\right|_{x=x_0}$$

若函数 $y = f(x)$ 在区间X内每一点x处都有二阶导数，则得到二阶导函数

$$f^{\prime\prime}(x), \quad y^{\prime\prime}(x) \quad  或  \quad \frac{\mathrm{d}^2 y}{\mathrm{d} x^2}.$$

同样地，可以定义函数 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 处的三阶、四阶、…导数

$$f^{\prime\prime\prime}(x_0), f^{(4)}(x_0), \cdots$$

以及三阶、四阶、…导函数

$$f^{\prime\prime\prime}(x), f^{(4)}(x), \cdots.$$

一般地，若函数 $y = f(x)$ 的 $(n = 1)$ 阶导数 $f^{(n-1)}(x)$ 在点 $\mathcal{X}_{0}$ 处的导数存在，则称其为 $y = f(x)$ 的n阶导数，记作

$$f^{(n)}(x_0) = \lim_{\Delta x \to 0} \frac{f^{(n-1)}(x_0 + \Delta x) - f^{(n-1)}(x_0)}{\Delta x},$$

有时也写作

$$f^{(n)}(x_0) = \lim_{x \to x_0} \frac{f^{(n-1)}(x) - f^{(n-1)}(x_0)}{x - x_0}.$$

[page:72]

## 第3章 导数与微分

若 $y = f(x)$ 在区间X内每一点x处都有n阶导数，则得到n阶导函数 $f^{(n)}(x)$ $y^{(n)}$ 或 $\frac{\mathrm{d}^{n} y}{\mathrm{d} x^{n}}$

二阶导数 $y'' = f''(x)$ 的力学意义:若质点做变速直线运动，其运动规律为 $s = s(t)$ ，则一阶导数 $s^{\prime}(t) = v(t)$ 表示质点的瞬时速度；二阶导数 $s^{\prime\prime}(t) = a(t)$ 表示质点的瞬时加速度.

## 3.3.2 例子

高阶导数

例3.14 设 $y = x^{n} \left( n = 1, 2, \cdots \right)$ ,求 $y^{'},y^{''},\cdots,y^{(m)}$

解

$$\begin{aligned} &y^{\prime} = nx^{n - 1}, \quad\\ &y^{\prime\prime} = n(n - 1)x^{n - 2}, \quad\\ &\cdots\cdots\\ &y^{(n)} = n!, \quad\\ &y^{(n + 1)} = y^{(n + 2)} = \cdots = 0.\\ \end{aligned}$$

例3.15 设 $y = x^{\alpha} (x > 0, \alpha$ 为常数)，求 $y^{(n)}$

解

$$\begin{aligned} &y^{\prime} = \alpha x^{\alpha - 1}, \quad\\ &y^{\prime\prime} = \alpha(\alpha - 1)x^{\alpha - 2}, \quad\\ &\cdots\cdots \quad\\ &y^{(n)} = \alpha(\alpha - 1)(\alpha - 2)\cdots(\alpha - n + 1)x^{\alpha - n}.\\ \end{aligned}$$

特例设 $y = \frac { 1 } { x }$ ，即 $\alpha = - 1$ ,则

$$\left( \frac{1}{x} \right)^{(n)} = (-1)(-2)(-3)\cdots(-n)x^{-1-n} \\= \frac{(-1)^n \cdot n!}{x^{n+1}}.$$

例3.16 设 $y = a^{x} \left( a > 0, a \neq 1 \right)$ ,求 $y^{(n)}$

解

$$\begin{aligned} &y^{\prime} = a^{x}\ln a, \quad\\ &y^{\prime\prime} = a^{x}(\ln a)^{2}, \quad\\ &\cdots\cdots\cdots \quad\\ &y^{(n)} = a^{x}(\ln a)^{n}.\\ \end{aligned}$$

特例 $\left( \mathrm{e}^{x} \right)^{(n)} = \mathrm{e}^{x}$

例3.17设 $y = \ln x$ ,求 $y^{(n)}$

解 $y^{\prime} = \frac{1}{x}$ ,因此

$$y ^ { ( n ) } = \left( \frac { 1 } { x } \right) ^ { ( n - 1 ) } = \frac { ( - 1 ) ^ { n - 1 } \cdot ( n - 1 ) ! } { x ^ { n } } ,$$

[page:73]

## 3.3高阶导数

即

$$\left( \ln x \right)^{\left( n \right)} = \frac{\left( - 1 \right)^{n - 1} \cdot \left( n - 1 \right)!}{x^n}.$$

例3.18 设 $y = \sin x$ ,求 $y ^ { ( n ) }$

解 $\left( \sin x \right)^{\prime} = \cos x = \sin\left( x + \frac{\pi}{2} \right)$

$$\left( \sin x \right)'' = \left[ \sin \left( x + \frac{\pi}{2} \right) \right]' = \cos \left( x + \frac{\pi}{2} \right) = \sin \left( x + 2 \cdot \frac{\pi}{2} \right)$$

$$\left( \sin x \right)'' = \left[ \sin \left( x + 2 \cdot \frac{\pi}{2} \right) \right]' = \cos \left( x + 2 \cdot \frac{\pi}{2} \right) = \sin \left( x + 3 \cdot \frac{\pi}{2} \right)$$

用数学归纳法可以证明

$$\left( \sin x \right)^{\left( n \right)} = \sin \left( x + n \cdot \frac{\pi}{2} \right).$$

类似可得 $\left( \cos x \right)^{\left( n \right)} = \cos \left( x + n \cdot \frac{\pi}{2} \right)$

## 3.3.3运算法则

如果函数 $u = u(x)$ 及 $v = v(x)$ 都在点x处具有n阶导数，那么显然$u(x) + v(x)$ 及 $u(x) - v(x)$ 也在点x处具有n阶导数，且

$$(u \pm v)^{(n)} = u^{(n)} \pm v^{(n)}.$$

但乘积 $u(x) \cdot v(x)$ 的n阶导数并不如此简单，由

$$(uv)^{\prime} = u^{\prime}v + uv^{\prime}$$

首先得出

$$\begin{align*}(uv)'' &= u''v + 2u'v' + v'', \\(uv)'' &= u''v + 3u''v' + 3u'v'' + uv''.\end{align*}$$

用数学归纳法可以证明

$$(uv)^{(n)} = \sum_{k=0}^{n} C_{n}^{k} u^{(n-k)} v^{(k)}.$$

上式称为莱布尼茨公式.

例3.19 设 $y = x^{2} \cdot \mathrm{e}^{3x}$ ,求 $y ^ { ( n ) }$

解令 $u = \mathrm{e}^{3x} , v = x^{2}$ ,则

$$v^{\prime} = 2x, \quad v^{\prime\prime} = 2, \quad v^{\prime\prime} = v^{(4)} = \cdots = v^{(n)} = 0;$$

$$u^{(n)} = 3^{n} \cdot \mathrm{e}^{3x}, \quad u^{(n-1)} = 3^{n-1} \cdot \mathrm{e}^{3x}, \quad u^{(n-2)} = 3^{n-2} \cdot \mathrm{e}^{3x},$$

由莱布尼茨公式得到

$$\begin{aligned}y^{(n)} &= (x^2 \bullet \mathrm{e}^{3x})^{(n)} = (\mathrm{e}^{3x} \bullet x^2)^{(n)} \\&= (\mathrm{e}^{3x})^{(n)} \bullet x^2 + n(\mathrm{e}^{3x})^{(n-1)} \bullet (x^2)' + \frac{n(n-1)}{2!}(\mathrm{e}^{3x})^{(n-2)} \bullet (x^2)'' + 0 \\&= 3^n x^2 \mathrm{e}^{3x} + 2n \bullet 3^{n-1} x \mathrm{e}^{3x} + n(n-1)3^{n-2} \mathrm{e}^{3x} \\&= 3^{n-2} \bullet \mathrm{e}^{3x}[9x^2 + 6nx + n(n-1)].\end{aligned}$$

[page:74]

## 第3章 导数与微分

## 习题3.3

1. 求下列函数的二阶导数:

(1) $y = 2x^{2} + \ln x$ (2) $y = \mathrm{e}^{2x - 1}$ ; (3) $y = x \cos x;$ (4) $y = \mathrm{e}^{-t} \sin t$

(5) $y = \sqrt{a^{2} - x^{2}}$ (6) $y = \ln(1 - x^{2})$ ;(7) $y = \tan x;$ (8) $y = \frac{1}{x^{3} + 1}$

(9) $y = (1 + x^{2})\arctan x;$ (10) $y = \frac{\mathrm{e}^{x}}{x};$ (11) $y = x \mathrm{e}^{x^{2}}$ (12) $y = \ln(x + \sqrt{1 + x^2})$

(13) $y = \cos^{2}x \cdot \ln x;$ (14) $y = - \frac{x}{\sqrt{1 - x^{2}}}$

2. 设f(x)存在，求下列函数的二阶导数 $\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}}$

(1) $y = f(x^{2});$ (2) $y = \ln[f(x)]$ 8

3. 试从 $\frac{\mathrm{d}x}{\mathrm{d}y} = \frac{1}{y'}$ 导出:

(1) $\frac{\mathrm{d}^{2} x}{\mathrm{d} y^{2}} = - \frac{y^{\prime \prime}}{(y^{\prime})^{3}};$ (2) $\frac{\mathrm{d}^{3} x}{\mathrm{d} y^{3}} = \frac{3(y^{\prime \prime})^{2} - y^{\prime} y^{\prime \prime}}{(y^{\prime})^{5}}.$

4. 已知物体的运动规律为 $s = A \sin (A, \omega$ 是常数)，求物体运动的加速度，并验证

$$\frac{\mathrm{d}^{2} s}{\mathrm{d} t^{2}} + \omega^{2} s = 0,$$

5. 密度大的陨星进入大气层时，当它离地心为skm时的速度与√s成反比.试证陨星的加速度与 $s ^ { 2 }$ 成反比.

6. 验证函数 $y = C_{1} \mathrm{e}^{\lambda x} + C_{2} \mathrm{e}^{-\lambda x} \left( \lambda , C_{1} , C_{2} \right.$ 是常数)满足关系式:

$$y'' - \lambda^{2} y = 0.$$

7. 求下列函数所指定阶的导数:

(1) $y = \mathrm{e}^{x} \cos x$ ,求 $y^{(4)}$ ; (2) $y = x^{2}\sin 2x$ ,求 $y ^ { ( 5 0 ) }$

(3) $y=x^{2}(2x-1)^{2}(x+3)^{2}$ ,求 $y^{(6)},y^{(7)}$

8. 求下列函数的n阶导数的一般表达式:

(1) $y = x^{n} + a_{1}x^{n - 1} + a_{2}x^{n - 2} + \cdots + a_{n - 1}x + a_{n}(a_{1},a_{2},\cdots,a_{n}$ 都是常数)；

(2) $y = \sin^{2}x;$ (3) $y = x \ln x;$ (4) $y = x\mathrm{e}^{x}$

(5) $y = (x^{2} + 2x + 2)\mathrm{e}^{-x}$ (6) $y = \frac{1}{1 - x};$ (7) $y = \frac{1}{1 - x^{2}}$ ; (8) $y = \frac{x^{n}}{1 + x};$ (9) $y = \frac{1}{x}e^{x}$

9. 求函数 $f(x) = x^{2} \ln(1 + x)$ 在 $x = 0$ 处的n阶导数 $f^{(n)}(0)(n \geqslant 3)$

## 3.4 隐函数及由参数方程所确定的函数的导数 相关变化率

## 3.4.1 隐函数的导数

函数 $y = f(x)$ 也称为显函数，这是因为因变量y直接用自变量x的一个式子

[page:75]

## 3.4 隐函数及由参数方程所确定的函数的导数 相关变化率

表示 $\overline { \int }$ 出来， $\mathcal { Y }$ 与x之间的函数关系很明显.

有时，因变量 $\mathcal { Y }$ 与自变量 $\mathcal { X }$ 之间的对应关系没有用公式 $y = f(x)$ 明显地给出，或者不能用 $y = f(x)$ 明显给出，而是用 $x \cdot y$ 之间的一个方程式 $F(x,y)=0$ 来表示的.我们把由方程 $F(x,y)=0$ 所确定的函数称为隐函数

从方程 $F(x,y)=0$ 中有时可以解出y来，这时便得到了显函数.这叫做隐函数的显化.例如，可从隐函数方程 $3x + 5y + 1 = 0$ 解出显函数

$$y=-\frac{3}{5}x-\frac{1}{5}.$$

但是，有时隐函数并不能表为显函数的形式或者表示出来后形式很复杂.我们的问题是:假定方程 $F(x,y)=0$ 确定 $\mathcal { Y }$ 是x的隐函数，并且 $\mathcal { Y }$ 对 $\mathcal { X }$ 可导，那么，在不解出 $y$ 的情况下，怎样求导数 $y ^ { \prime } \dot { \bar { \gamma } }$ 下面我们通过例子来解决这个问题

例3.20 求由方程 $\mathrm{e}^{y}+xy-\mathrm{e}=0$ 所确定的隐函数的导数 $\frac{\mathrm{d}y}{\mathrm{d}x},$

解方法一把方程两边分别对x求导数，注意 $y = y(x)$

$$\frac{\mathrm{d}}{\mathrm{d}x}\left( \mathrm{e}^{y} + xy - \mathrm{e} \right) = \mathrm{e}^{y}\frac{\mathrm{d}y}{\mathrm{d}x} + y + x\frac{\mathrm{d}y}{\mathrm{d}x} = 0.$$

从而 $\frac{\mathrm{d}y}{\mathrm{d}x} = - \frac{y}{\mathrm{e}^{y} + x}$

方法二等式两边求微分得

$$\mathrm{d}(\mathrm{e}^{y}+xy-\mathrm{e})=\mathrm{d}(0)=0,$$

$$\mathrm{e}^{y}\mathrm{d}y+x\mathrm{d}y+y\mathrm{d}x=0,$$

$$\mathrm{d}y = - \frac{y}{\mathrm{e}^{y} - x}\mathrm{d}x.$$

所以

$$\frac{\mathrm{d}y}{\mathrm{d}x} = - \frac{y}{\mathrm{e}^{y} + x}.$$

例3.21 求由方程 $y^{5}+2y-x-3x^{7}=0$ 所确定的隐函数在 $x = 0$ 处的导数$\left. \frac{\mathrm{d}y}{\mathrm{d}x} \right|_{x = 0}$

解方法一把方程两边分别对x求导数，注意 $y = y(x)$

$$5y^{4}\frac{\mathrm{d}y}{\mathrm{d}x}+2\frac{\mathrm{d}y}{\mathrm{d}x}-1-21x^{6}=0.$$

当 $x = 0$ 时，从原方程得 $y = 0$ ，代入上式，得

$$2\left.\frac{\mathrm{d}y}{\mathrm{d}x}\right|_{x = 0} - 1 = 0.$$

所以

[page:76]

## 第3章 导数与微分

$$\left. \frac{\mathrm{d}y}{\mathrm{d}x} \right|_{x = 0} = \frac{1}{2}.$$

方法二等式两边求微分得

$$\mathrm{d}(y^{5}+2y-x-3x^{7})=\mathrm{d}(0)=0,$$

$$5y^{4}\mathrm{d}y+2\mathrm{d}y-\mathrm{d}x-21x^{6}\mathrm{d}x=0.$$

当 $x = 0$ 时，从原方程得 $y = 0$ ，代入上式，得

$$2\mathrm{d}y = \mathrm{d}x.$$

所以

$$\left. \frac{\mathrm{d}y}{\mathrm{d}x} \right|_{x = 0} = \frac{1}{2}.$$

例3.22 求椭圆 $\frac{x^{2}}{16}+\frac{y^{2}}{9}=1$ 在点 $\left( 2 , \frac { 3 } { 2 } \sqrt { 3 } \right)$ 处的切线方程(图3.7).

解由导数的几何意义知道，所求切线的斜率为

$$\bar{k} = y^{\prime} \mid_{x = 2}.$$

方法一 在椭圆方程两边分别对x求导数，注意 $y = y(x)$

从而

$$\frac{x}{8} + \frac{2}{9} y \cdot \frac{\mathrm{d}y}{\mathrm{d}x} = 0.$$

$$\frac{\mathrm{d}y}{\mathrm{d}x} = - \frac{9x}{16y}.$$

当 $x = 2$ 时， $y = \frac{3}{2}\sqrt{3}$ ，代入上式得

$$\left. \frac{\mathrm{d}y}{\mathrm{d}x} \right|_{x = 2} = - \frac{\sqrt{3}}{4}.$$

方法二在椭圆方程两边求微分，得

$$\mathrm{d}\left(\frac{x^{2}}{16}+\frac{y^{2}}{9}\right)=\mathrm{d}(1)=0,$$

$$\frac{x}{8}\mathrm{d}x + \frac{2y}{9}\mathrm{d}y = 0.$$

把 $x = 2, y = \frac{3}{2}\sqrt{3}$ 代入上式得

$$\left. \frac{\mathrm{d}y}{\mathrm{d}x} \right|_{x = 2} = - \frac{\sqrt{3}}{4}.$$

于是所求的切线方程为

[page:77]

## 3.4隐函数及由参数方程所确定的函数的导数相关变化率

$$y - \frac{3}{2}\sqrt{3} = - \frac{\sqrt{3}}{4}(x - 2)$$

即

$$\sqrt{3}x + 4y - 8\sqrt{3} = 0.$$

例3.23求由方程 $x - y + \frac{1}{2}\sin y = 0$ 所确定的隐函数的二阶导数 $\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}}.$

解 方法一把方程两边分别对x求导数，注意 $y = y(x)$

$$1 - \frac{\mathrm{d}y}{\mathrm{d}x} + \frac{1}{2}\cos y \cdot \frac{\mathrm{d}y}{\mathrm{d}x} = 0.$$

于是

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{2}{2 - \cos y}.$$

上式两边再对x求导，得

$$\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} = \frac{- 2\sin y \frac{\mathrm{d} y}{\mathrm{d} x}}{(2 - \cos y)^{2}} = \frac{- 4\sin y}{(2 - \cos y)^{3}}$$

方法二等式两边求微分，得

$$\mathrm{d}\left(x-y+\frac{1}{2}\sin y\right)=\mathrm{d}(0)=0,$$

$$\mathrm{d}x - \mathrm{d}y + \frac{1}{2}\cos y\mathrm{d}y = 0,$$

$$\mathrm{d}y = \frac{2}{2 - \cos y}\mathrm{d}x.$$

所以

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{2}{2 - \cos y}.$$

上式两边再求微分得

$$\mathrm{d}\left(\frac{\mathrm{d}y}{\mathrm{d}x}\right)=\mathrm{d}\left(\frac{2}{2-\cos y}\right),$$

$$\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} \mathrm{d} x = \frac{(2 - \cos y)\mathrm{d}(2) - 2\mathrm{d}(2 - \cos y)}{(2 - \cos y)^{2}} = \frac{- 2\sin y\mathrm{d} y}{(2 - \cos y)^{2}} = \frac{- 4\sin y}{(2 - \cos y)^{3}}\mathrm{d} x,$$

$$\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} = \frac{- 4 \sin y}{(2 - \cos y)^{3}}.$$

方法三把方程两边分别对x求导数，注意 $y = y(x)$

$$1 - \frac{\mathrm{d}y}{\mathrm{d}x} + \frac{1}{2}\cos y \cdot \frac{\mathrm{d}y}{\mathrm{d}x} = 0.$$

再对x求导得

[page:78]

## 第3章 导数与微分

$$-\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} - \frac{1}{2} \sin y \cdot \left( \frac{\mathrm{d} y}{\mathrm{d} x} \right)^{2} + \frac{1}{2} \cos y \cdot \frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} = 0.$$

于是

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{2}{2 - \cos y},$$

$$\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} = \frac{\frac{1}{2} \sin y \left( \frac{\mathrm{d} y}{\mathrm{d} x} \right)^{2}}{\frac{1}{2} \cos y - 1} = \frac{\sin y \cdot \frac{4}{(2 - \cos y)^{2}}}{\cos y - 2} = \frac{- 4 \sin y}{(2 - \cos y)^{3}}$$

方法四等式两边求微分，得

$$\mathrm{d}\left(x-y+\frac{1}{2}\sin y\right)=\mathrm{d}(0)=0,$$

$$\mathrm{d}x - \mathrm{d}y + \frac{1}{2}\cos y\mathrm{d}y = 0,$$

$$1 - \frac{\mathrm{d}y}{\mathrm{d}x} + \frac{1}{2}\cos y\frac{\mathrm{d}y}{\mathrm{d}x} = 0,$$

再求微分，得

$$-\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} \mathrm{d} x - \frac{1}{2} \sin y \mathrm{d} y \frac{\mathrm{d} y}{\mathrm{d} x} + \frac{1}{2} \cos y \frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} \mathrm{d} x = 0,$$

所以

$$\frac{\mathrm{d}y}{\mathrm{d}x}=\frac{\frac{2}{2}}{\frac{1}{2}\sin y\left(\frac{\mathrm{d}y}{\mathrm{d}x}\right)^{2}}=\frac{\sin y\cdot\frac{4}{(2-\cos y)^{2}}}{\frac{1}{2}\cos y-1}=\frac{\frac{1}{2}\sin y}{\cos y-2}=\frac{\frac{1}{(2-\cos y)^{3}}}{(2-\cos y)^{3}}$$

例3.24求 $y = x^{\sin x} \left( x > 0 \right)$ 的导数.

解等式两边取对数，得

$$\ln y = \sin x \cdot \ln x.$$

再在等式两边求微分，得

$$\frac{1}{y} \mathrm{d}y = \left( \cos x \cdot \ln x + \sin x \cdot \frac{1}{x} \right) \mathrm{d}x.$$

于是

$$\frac{\mathrm{d}y}{\mathrm{d}x}=y\left(\cos x\cdot\ln x+\sin x\cdot\frac{1}{x}\right)=x^{\sin x}\left(\cos x\cdot\ln x+\sin x\cdot\frac{1}{x}\right).$$

[page:79]

## 3.4 隐函数及由参数方程所确定的函数的导数 相关变化率

或者等式两边分别对x求导数，注意 $y = y(x)$

$$\frac{1}{y}\frac{\mathrm{d}y}{\mathrm{d}x}=\cos x\cdot\ln x+\sin x\cdot\frac{1}{x}$$

$$\frac{\mathrm{d}y}{\mathrm{d}x} = x^{\sin x}\left( \cos x \cdot \ln x + \sin x \cdot \frac{1}{x} \right).$$

上面的求导方法叫做对数求导法.对于一般形式的幂指函数

$$y = u \left( x \right)^{v \left( x \right)} \left( u \left( x \right) > 0 \right).$$

如果 $u(x),v(x)$ 都可导，则可象例3.24一样利用对数求导法求出导数.也可把此幂指函数表示为

$$y = \mathrm{e}^{\mathrm{i} \ln u}.$$

这样，便可直接求导得

$$y ^ { \prime } = \mathrm { e } ^ { v \ln u } \left( v ^ { \prime } \cdot \ln u + v \cdot \frac { u ^ { \prime } } { u } \right) = u ^ { v } \left( v ^ { \prime } \cdot \ln u + \frac { v u ^ { \prime } } { u } \right) .$$

例3.25求 $y=\sqrt[3]{\frac{\left(x^{2}-1\right)(2-x)}{3x+5}}$ 的导数.

解等式两边取绝对值，得

$$\| y \| = \sqrt[3]{\frac{\left| x^{2} - 1 \right| \cdot \left| 2 - x \right|}{\left| 3x + 5 \right|}}$$

再对上式取对数:

$$\ln \left| y \right| = \frac{1}{3} \left[ \ln \left| x^{2} - 1 \right| + \ln \left| 2 - x \right| - \ln \left| 3x + 5 \right| \right]$$

两边求微分，得

$$\frac{1}{y}\mathrm{d}y = \frac{1}{3}\left[\frac{2x}{x^{2} - 1} + \frac{1}{x - 2} - \frac{3}{3x + 5}\right]\mathrm{d}x.$$

所以

$$y = \frac{y}{3} \left[ \frac{2x}{x^2 - 1} + \frac{1}{x - 2} - \frac{3}{3x + 5} \right].$$

## 3.4.2 由参数方程所确定的函数的导数

研究物体运动的轨迹时，常遇到参数方程.例如，研究抛射体的运动问题时，如果空气阻力忽略不记，则抛射体的运动轨迹可表示为

$$\left\{ \begin{aligned} x &= v_{1} t, \\ y &= v_{2} t - \frac{1}{2} g t^{2}, \end{aligned} \right.$$

其中 $\mathcal { { { U } } } _ { 1 } \mathbin { , } \mathcal { { { U } } } _ { 2 }$ 分别为抛射体初速度的水平、铅直分量； $g$ 为重力加速度；t为飞行时间 $\therefore x$ 和 $\mathcal { Y }$ 分别为飞行中抛射体在铅直平面上的位置的横坐标和纵坐标(图3.8).

[page:80]

## 第3章 导数与微分

在上式中， $x : y$ 都与t存在函数关系.如果把对应于同一个t值的 $\mathcal { N }$ 与 $\mathcal { X }$ 的值看作是对应的，这样就得到y与x之间的函数关系，即

$$y = \frac{v_{2}}{v_{1}}x - \frac{g}{2v_{1}^{2}}x^{2}.$$

一般地，若参数方程

$$\begin{cases}x = \varphi(t)  , \\y = \psi(t)\end{cases}$$

确定 $\mathcal { Y }$ 与 $x$ 间的函数关系，则称此函数关系所表达的函数为由参数方程所确定的函数.

在实际问题中，需要计算由参数方程所确定的函数的导数.但并不是所有的参数方程确定的函数都能够显式化，有时虽然能够显式化，但显式化后的函数很复杂.因此需要一种方法能直接由参数方程算出它所确定的函数的导数.为此，假定函数 $x = \varphi(t), y = \psi(t)$ 都可导，而且 $\varphi^{'}(t) \neq 0$

对 $x = \varphi(t)$ 两边取微分得 $\mathrm{d}x = \varphi^{\prime}(t)\mathrm{d}$ t,所以 $\mathrm{d}t = \frac{1}{\varphi^{'}(t)}\mathrm{d}x$ ;对 $y = \phi(t)$ 两边取微分得 $\mathrm{d}y = \psi^{'}(t)\mathrm{d}t$ ,所以 $\mathrm{d}y = \frac{\psi^{'}(t)}{\varphi^{'}(t)}\mathrm{d}x$ ,即

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{\psi^{'}(t)}{\varphi^{'}(t)}$$

或者

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{\frac{\mathrm{d}y}{\mathrm{d}t}}{\frac{\mathrm{d}x}{\mathrm{d}t}}.$$

这就是参数方程的求导公式

如果 $x = \varphi(t), y = \psi(t)$ 二阶可导，则有

$$\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} = \frac{\mathrm{d}}{\mathrm{d} x} \left( \frac{\mathrm{d} y}{\mathrm{d} x} \right) = \frac{\mathrm{d}}{\mathrm{d} t} \left( \frac{\phi^{\prime}(t)}{\phi^{\prime}(t)} \right) \cdot \frac{\mathrm{d} t}{\mathrm{d} x} = \frac{\phi^{\prime \prime}(t) \phi^{\prime}(t) - \phi^{\prime}(t) \phi^{\prime \prime}(t)}{\phi^{\prime 3}(t)}.$$

例3.26 已知抛射体的运动轨迹的参数方程为

[page:81]

## 3.4 隐函数及由参数方程所确定的函数的导数相关变化率

$$\left\{ \begin{aligned} x &= v_{1} t, \\ y &= v_{2} t - \frac{1}{2} g t^{2}, \end{aligned} \right.$$

求抛射体在时刻t的运动速度.

解先求速度的大小.

由于速度的水平分量为

$$\frac { \mathrm { d } x } { \mathrm { d } t } = v _ { 1 }   ,$$

铅直分量为

$$\frac{\mathrm{d}y}{\mathrm{d}t} = v_{2} - g t   ,$$

所以抛射体运动速度的大小为

$$v = \sqrt{ \left( \frac{\mathrm{d}x}{\mathrm{d}t} \right)^2 + \left( \frac{\mathrm{d}y}{\mathrm{d}t} \right)^2 } = \sqrt{ v_1^2 + (v_2 - gt)^2 }$$

再求速度的方向，也就是轨迹的切线方向

设 $\alpha$ 是切线的倾角，则根据导数的几何意义，得

$$\tan \alpha = \frac{\mathrm{d}y}{\mathrm{d}x} = \frac{\frac{\mathrm{d}y}{\mathrm{d}t}}{\frac{\mathrm{d}x}{\mathrm{d}t}} = \frac{v_{2} - gt}{v_{1}}.$$

例3.27 已知椭圆的参数方程为

$$\left\{ \begin{aligned} x &= a \cos t, \\ y &= b \sin t, \end{aligned} \right.$$

求椭圆在 $t = \frac { \pi } { 4 }$ 相应的点处的切线方程(图3.9).

[page:82]

## 第3章 导数与微分

解当 $t = \frac{\pi}{4}$ 时，椭圆上的相应点 $M _ { 0 }$ 的坐标是

$$x_{0}=a\cos\frac{\pi}{4}=\frac{a\sqrt{2}}{2},$$

$$y_{0}=b\sin\frac{\pi}{4}=\frac{b\sqrt{2}}{2},$$

曲线在点 $M_{0}$ 的切线斜率为

$$\left. \frac{\mathrm{d}y}{\mathrm{d}x} \right|_{t = \frac{\pi}{4}} = \left. \frac{(b\sin t)^{\prime}}{(a\cos t)^{\prime}} \right|_{t = \frac{\pi}{4}} = \left. \frac{b\cos t}{-a\sin t} \right|_{t = \frac{\pi}{4}} = -\frac{b}{a}.$$

代入点斜式方程，即得椭圆在点 $M_{0}$ 处的切线方程

$$y - \frac{b\sqrt{2}}{2} = - \frac{b}{a}\left( x - \frac{a\sqrt{2}}{2} \right).$$

化简后得

$$bx + ay - \sqrt{2}ab = 0.$$

例3.28计算由摆线(图3.10)的参数方程

$$\begin{cases}x = a(t - \sin t), \\y = a(1 - \cos t)\end{cases}$$

所确定的函数 $y = y(x)$ 的二阶导数.

解

$$\frac{\mathrm{d}y}{\mathrm{d}x}=\frac{\frac{\mathrm{d}y}{\mathrm{d}t}}{\frac{\mathrm{d}x}{\mathrm{d}t}}=\frac{a\sin t}{a\left(1-\cos t\right)}=\frac{\sin t}{1-\cos t}=\cot\frac{t}{2},$$

$$\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} = \frac{\mathrm{d}}{\mathrm{d} t} \left( \cot \frac{t}{2} \right) \cdot \frac{1}{\frac{\mathrm{d} x}{\mathrm{d} t}} = - \frac{1}{2 \sin^{2} \frac{t}{2}} \cdot \frac{1}{a(1 - \cos t)} = - \frac{1}{a(1 - \cos t)^{2}}$$

## 3.4.3 相关变化率

设 $x = x(t)$ 及 $y = y(t)$ 都是可导函数，而变量x与y间存在某种关系，从而变化率 $\frac{\mathrm{d}x}{\mathrm{d}t}$ 与 $\frac{\mathrm{d}y}{\mathrm{d}t}$ 间也存在一定关系.这两个相互依赖的变化率称为相关变化率.相关

[page:83]

## 3.4隐函数及由参数方程所确定的函数的导数 相关变化率

变化率的问题就是研究这两个变化率之间的关系，以便从其中一个变化率求出另一个变化率.

例3.29一个倒圆锥形的蓄水池，高H为10m，底半径R为4m，水以 $5\mathrm{m}^{3}/\mathrm{min}$ 的速率流进水池.试求当水深为5m时，水面上升的速率(图3.11).

解 令h 表示在时刻t 水池内的水面高度.显然，h 是t的函数: $h \equiv h(t)$ .水池内水的体积v与h的关系为

$$v = \frac{1}{3} \pi r^{2} h,$$

其中r为小圆锥的底半径.利用相似三角形可解出

$$v = \frac{1}{3} \cdot \frac{\pi R^{2}}{H^{2}} \cdot h^{3}.$$

两端对t求导，得

$$\frac { \mathrm { d } v } { \mathrm { d } t } = \frac { 1 } { 3 } \cdot \frac { \pi R ^ { 2 } } { H ^ { 2 } } \cdot 3 h ^ { 2 } \frac { \mathrm { d } h } { \mathrm { d } t } ,$$

于是

$$\frac{\mathrm{d}h}{\mathrm{d}t} = \frac{H^{2}}{\pi R^{2}} \cdot \frac{1}{h^{2}} \frac{\mathrm{d}v}{\mathrm{d}t}.$$

当 $h = 5  m$ 时，有

$$\left. \frac{\mathrm{d}h}{\mathrm{d}t} \right|_{h = 5} = \frac{10^{2}}{\pi 4^{2}} \cdot \frac{1}{25} \cdot 5 = \frac{5}{4\pi}.$$

由参数方程所确定的函数的导数相关变化率

## 习题3.4

1.求由下列方程所确定的隐函数的导数 $\frac{\mathrm{d}y}{\mathrm{d}x}$

(1) $y^{2}-2xy+9=0;$ (2) $x^{3}+y^{3}-3axy=0$ ; (3) $xy = \mathrm{e}^{x + y}$ ； (4) $y = 1 - x\mathrm{e}^{y}$

(5) $\sqrt{x}+\sqrt{y}=\sqrt{a};$ (6) $y = \cos(x + y)$ ;(7) $y\sin x-\cos(x-y)=0;$ (8) $x+\sqrt{xy}+y=0.$

2. 求下列隐函数在指定点的导数 $\frac{\mathrm{d}y}{\mathrm{d}x}$

(1) $y = \cos x + \frac{1}{2}\sin y;$ 点 $( \frac { \pi } { 2 } , 0 )$ ; (2) $y\mathrm{e}^{x}+\ln y=1$ ，点(0,1).

[page:84]

## 第3章 导数与微分

3. 求下列方程确定的隐函数的微分 $\mathrm{d}y$ (1) $\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}=1;$ (2) $x^{y} = y^{r}$

4. 求曲线 $x^{\frac{2}{3}} + y^{\frac{2}{3}} = a^{\frac{2}{3}}$ 在点 $\left( \frac{\sqrt{2}}{4} a , \frac{\sqrt{2}}{4} a \right)$ 处的切线方程和法线方程.

5. 求由下列方程所确定的隐函数的二阶导数 $-\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}}$ (1) $x^{2}-y^{2}=1$ ; (2) $b^{2}x^{2}+a^{2}y^{2}=a^{2}b^{2}$ ; (3) $y = \tan(x + y)$ ; (4) $y = 1 + x\mathrm{e}^{y}$

6. 用对数求导法求下列函数的导数:(1) $y = \left( \frac{x}{1 + x} \right)^{x}$ ； (2) $y=\sqrt[5]{\frac{x-5}{\sqrt[5]{x^{2}+2}}}$ (3) $y=\frac{\sqrt{x+2}(3-x)^{4}}{(x+1)^{5}}$ (4) $y = \sqrt{x\sin x\sqrt{1 - \mathrm{e}^{x}}}$ (5) $y = \sqrt{\frac{1 - x}{1 + x}}$ (6) $y=\frac{x^{2}}{1+x}\sqrt{\frac{x+1}{1+x+x^{2}}}$ (7) $y = (x - b_{1})^{a_{1}} (x - b_{2})^{a_{2}} \cdots (x - b_{n})^{a_{n}}$ (8) $y = (1 + x^{2})^{x}$

7. 求下列参数方程所确定的函数的导数 $\frac{\mathrm{d}y}{\mathrm{d}x}$ (1) $\left\{ \begin{aligned} x = a t^{2} , \\ y = b t^{3} ; \end{aligned} \right.$ (2) $\begin{cases}x = \theta(1 - \sin\theta), \\y = \theta\cos\theta.\end{cases}$

8. 写出下列曲线在所给参数值相应的点处的切线方程和法线方程:

(1) $\begin{cases}x = \sin t, \\y = \cos 2t\end{cases}$ 在 $t = \frac{\pi}{4}$ 处；(2) $\left\{ \begin{aligned} x = & \frac{3at}{1 + t^{2}}, \\ y = & \frac{3at^{2}}{1 + t^{2}}, \end{aligned} \right.$ 在 $t = 2$ 处.

9. 求下列参数方程所确定的函数的二阶导数 $\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}}$ (1) $\left\{ \begin{aligned} x = & \frac{t^{2}}{2}, \\ y = & 1 - t; \end{aligned} \right.$ (2) $\left\{ \begin{aligned} x = a \cos t, \\ y = b \sin t; \end{aligned} \right.$ (3) $\begin{cases}x = 3\mathrm{e}^{-t} \\y = 2\mathrm{e}^{t};\end{cases}$

(4) $\left\{ \begin{aligned} x = f^{\prime}(t), \\ y = tf^{\prime}(t) - f(t) \end{aligned} \right.$ 设 $f^{\prime\prime}(t)$ 存在且不为零；(5) $\left\{ \begin{aligned} x = t - \sin t, \\ y = 1 - \cos t; \end{aligned} \right.$ 9 (6) $\left\{ \begin{aligned} x = a \mathrm{ch} t, \\ y = b \mathrm{sh} t; \end{aligned} \right.$ (7) $\left\{ \begin{aligned} x = a \cos^3 \theta , \\ y = a \sin^3 \theta ; \end{aligned} \right.$ (8) $\begin{cases}x = \ln \sqrt{1 + t^{2}}, \\y = \arctan t.\end{cases}$

10.求下列参数方程所确定的函数的三阶导数 $\frac{\mathrm{d}^{3} y}{\mathrm{d} x^{3}}$ (1) $\begin{cases}x = 1 - t^{2}, \\y = t - t^{3};\end{cases}$ (2) $\begin{cases}x = \ln(1 + t^2), \\y = t - \arctan t.\end{cases}$

11. 已知f(x)是周期为5的连续函数，它在 $x = 0$ 的某个邻域内满足关系式f(1 + sinx) − 3 f(1 - sinx) = 8x + o(x),

且f(x)在x=1处可导，求曲线 $y = f(x)$ 在点 $(6,f(6))$ 处的切线方程.

12.当正在高度H水平飞行的飞机开始向机场跑道下降时，如图3.12所示，从飞机到机

[page:85]

## 3.5 微分的简单应用

场的水平地面距离为L.假设飞机下降的路径为三次函数 $y=ax^{3}+bx^{2}+cx+d$ 的图形，其中$\left. y \right|_{x = - L} = H, \left. y \right|_{x = 0} = 0$ 试确定飞机的降落路径.

13.落在平静水面上的石头，产生同心波纹.若最外一圈波半径的增大速率总是6m/s，问在2s末扰动水面面积增大的速率为多少？

14.注水入深8m上顶直径8m的正圆锥形容器中，其速率为4m³/min.当水深为5m时，其表面上升的速率为多少？

15. 溶液自深18cm顶直径12cm的正圆锥形漏斗中漏入一直径为10cm的圆柱形筒中.开始时漏斗中盛满了溶液.已知当溶液在漏斗中深为12cm时，其表面下降的速率为1cm/min.问此时圆柱形筒中溶液表面上升的速率为多少？

16.一个人以8km/h的速度面向一个62m高的塔前进，当他距塔底80m时，他的头顶以什么速度接近塔顶(设人高为2m)?

17.有一长5m的梯子，靠在垂直的墙上，设下端沿地面以3m/s的速度离开墙脚滑动，求当下端离开墙脚1.5m时，梯子上端下滑的速度.

18.甲船以6km/h的速率向东行驶，乙船以8km/h的速率向南行驶.在中午12点整，乙船位于甲船之北16km处.问下午1点正两船相离的速率为多少？

## 3.5微分的简单应用

## 3.5.1 近似计算

在工程问题中，经常会遇到一些复杂的计算公式.如果直接用这些公式进行计算，那是很费力的.利用微分往往可以把一些复杂的计算公式用简单的近似公式来代替.

在3.1.4节可微与可导的关系中说过，如果 $y = f(x)$ 在点 $\mathcal { X } _ { 0 }$ 处的导数 $f^{\prime}(x_0) \neq$ 0,且 $\vert \Delta x \vert$ 很小时，有

$$\Delta y \approx \mathrm{d}y = f^{\prime}(x_0) \Delta x.$$

这个式子也可以写为

$$\Delta y = f(x_{0} + \Delta x) - f(x_{0}) \approx f^{\prime}(x_{0})\Delta x,$$

或

$$f(x_{0}+\Delta x)\approx f(x_{0})+f^{\prime}(x_{0})\Delta x.$$

令 $x = x_{0} + \Delta x$ ,即 $\Delta x = x - x_{0}$ ，则上式可改写为

$$f(x) \approx f(x_0) + f^{\prime}(x_0)(x - x_0).$$

[page:86]

## 第3章 导数与微分

例3.30钟摆的周期原来是1s.在冬季，摆长缩短了0.01cm，问这钟每天大约快多少？

解物理学告诉我们，单摆的周期T与摆长l之间有关系式

$$T = 2 \pi \sqrt { \frac { l } { g } } ,$$

$g$ 为重力加速度.现在因天冷摆长有了改变量 $\Delta l = -0.01  cm$ ，于是引起周期有相应的改变量 $\Delta T .$ 因为 $| \Delta l | = 0.01$ 比较小，所以可用微分 $\mathrm { d } T$ 来近似计算 $\triangle T ,$

设原来的周期为 $T _ { 0 }$ ，摆长为 $l _ { 0 }$ ，则由公式 $T_{0} = 2\pi \sqrt{\frac{l_{0}}{g}}$ ,得到

$$l _ { 0 } = \frac { T _ { 0 } ^ { 2 } g } { ( 2 \pi ) ^ { 2 } } .$$

由 $T { = } 2 \pi \sqrt { \frac { l } { g } }$ ,有

$$\frac{\mathrm{d}T}{\mathrm{d}l} = \frac{2\pi}{\sqrt{g}} \cdot \frac{1}{2\sqrt{l}} = \frac{\pi}{\sqrt{g}} \cdot \frac{1}{\sqrt{l}},$$

于是

$$\frac{\mathrm{d}T}{\mathrm{d}l}\bigg|_{l=l_0} = \frac{\pi}{\sqrt{g}} \cdot \frac{1}{\sqrt{l_0}} = \frac{\pi}{\sqrt{g}} \cdot \frac{2\pi}{T_0\sqrt{g}} = \frac{2\pi^2}{T_0g}.$$

从而由近似公式得到

$$\Delta T \approx \mathrm{d}T = \left. \frac{\mathrm{d}T}{\mathrm{d}l} \right|_{l = l_0} \cdot \Delta l = \frac{2\pi^2}{T_0 g} \cdot \Delta l.$$

设 $T_{0} = 1  s$ ，又已知 $\Delta l = -0.01  cm$ ,因此

$$\Delta T \approx \frac{2(3.14)^2}{980}(-0.01)  s  \approx -0.0002  s .$$

这表示，由于摆长缩短了0.01cm，摆的周期也缩短了大约0.0002s，也就是说，每秒钟大约快0.0002s，因此每天大约快

$$86400 \times 0.0002  s  = 17.28  s$$

例3.31求 $\cos 6 0 ^ { \circ } 1 2 ^ { \prime }$ 的近似值.

解

$$\cos 60^{\circ}12' = \cos \left( \frac{\pi}{3} + \frac{12}{60} \cdot \frac{\pi}{180} \right) = \cos \left( \frac{\pi}{3} + \frac{12\pi}{10800} \right).$$

令 $f(x)=\cos x,x_{0}=\frac{\pi}{3},\Delta x=\frac{12\pi}{10800}$ ,则

$$f(x_{0}) = \cos \frac{\pi}{3}, \quad f^{\prime}(x_{0}) = -\sin \frac{\pi}{3}.$$

由近似公式得

$$\cos 60^{\circ}12' \approx \cos \frac{\pi}{3} - \sin \frac{\pi}{3} \cdot \frac{12\pi}{10800} = \frac{1}{2} - \frac{\sqrt{3}}{2} \cdot \frac{12\pi}{10800} \approx 0.4970.$$

下面推导一些常用的近似公式.取 $x_{0} = 0$ ，于是

[page:87]

## 3.5微分的简单应用

$$f(x) \approx f(0) + f^{\prime}(0)x.$$

应用此式可以推得以下几个在工程上常用的近似公式(下面都假定|x|是较小的数值）:

(1) $(1 + x)^{a} \approx 1 + ax$

(2) $\sin x \approx x;$

(3) $\tan x \approx x;$

(4) $e ^ { x } \approx 1 + x ;$

(5) $\ln(1 + x) \approx x$

例3.32 近似计算 $\sqrt[3]{8.0034}.$

$$\sqrt[3]{8.0034}=\sqrt[3]{8(1+0.0034/8)}=2\sqrt[3]{1+0.0034/8}$$

再对 $\sqrt[3]{1 + 0.0034 / 8}$ 利用近似公式

$$\sqrt[3]{1 + x} = (1 + x)^{1/3} \approx 1 + \frac{1}{3}x,$$

将 $x = 0.0034$ 8代入，得到

$$\sqrt[3]{1 + 0.0034 / 8} \approx 1 + \frac{1}{3} \times \frac{0.0034}{8}$$

从而

$$\sqrt[3]{8.0034} \approx 2\left(1+\frac{1}{3} \times \frac{0.0034}{8}\right) \approx 2.0003.$$

## 3.5.2 估计误差

在生产实践中，经常要测量各种数据.但是有的数据不易直接测量，这时就通过测量其他有关数据后，根据某种公式算出所要的数据.例如，要计算圆钢的截面积A，可先用卡尺测量圆钢截面的直径D，然后根据公式 $A = \frac{\pi}{4}D^{2}$ 算出A.

由于测量仪器的精度、测量的条件和测量的方法等各种因素的影响，测得的数据往往带有误差，而根据带有误差的数据计算所得的结果也会有误差，这种误差叫做间接测量误差.

下面就讨论怎样利用微分来估计间接测量误差

先说明什么叫绝对误差、什么叫相对误差

如果某个量的精确值为A，它的近似值为a，那么 $\left| A - a \right|$ 叫做a的绝对误差，而绝对误差与 $\vert a \vert$ 的比值 $\frac { | A - a | } { | \underline { { a } } | }$ 叫做a的相对误差

在实际工作中，某个量的精确值往往是无法知道的，于是绝对误差和相对误差也就无法求得.但是根据测量仪器的精度等因素，有时能够确定误差在某一个范围内.如果某个量的精确值是A，测得它的近似值是a，又知道它的误差不超过 $\delta _ { A }$ ，即

[page:88]

## 第3章 导数与微分

$$\left| A - a \right| \leqslant \delta_{A},$$

那么 $\delta _ { A }$ 叫做测量A的绝对误差限，而 $\frac { \delta _ { A } } { | a | }$ 叫做测量A的相对误差限.

例3.33 设测得圆钢截面的直径 $D = 60.03  mm$ ，测得D的绝对误差限$\delta_{D}=0.05\mathrm{mm}$ 利用公式

$$A = \frac{\pi}{4}D^{2}$$

计算圆钢的截面积时，试估计面积的误差

解把测量D时所产生的误差当作自变量D的增量 $\triangle D$ ，那么，利用公式$A = \frac{\pi}{4} D^{2}$ 计算A时所产生的误差就是函数A的对应增量 $\Delta A .$ 当 $\vert \Delta D \vert$ 很小时，可以利用微分 dA 近似地代替增量 $\Delta A$ ，即

$$\Delta A \approx \mathrm{d}A = A^{\prime} \cdot \Delta D = \frac{\pi}{2} D \cdot \Delta D.$$

由于D的绝对误差限为 $\delta_{D}=0.05\mathrm{mm}$ ,所以

$$\mid \Delta D \mid \leqslant \delta_{D} = 0.05,$$

而

$$\left| \Delta \vec{A} \right| \approx \left| \mathrm{d}\vec{A} \right| = \frac{\pi}{2} D \cdot \left| \Delta D \right| \leqslant \frac{\pi}{2} D \cdot \delta_{D}.$$

因此得出A的绝对误差限约为

$$\delta _ { \Delta } = \frac { \pi } { 2 } D \cdot \delta _ { D } = \frac { \pi } { 2 } \times 6 0 . 0 3 \times 0 . 0 5 \approx 4 . 7 1 5 ( \mathrm { m m } ^ { 2 } ) ,$$

A 的相对误差限约为

$$\frac{\delta_{A}}{A}=\frac{\frac{\pi}{2}D\cdot\delta_{D}}{\frac{\pi}{4}D^{2}}=2\frac{\delta_{D}}{D}=2\times\frac{0.05}{60.03}\approx0.17\%.$$

一般地，根据直接测量的x值按公式 $y = f(x)$ 计算y值时，如果已知测量 $\mathcal { X }$的绝对误差限是 $\partial _ { \cdot x }$ ，即

$$\mid \Delta x \mid \leqslant \delta_{x},$$

那么，当 $y^{\prime} \neq 0$ 时，y的绝对误差

$$| \Delta y | \approx | \mathrm{d}y | = | y^{\prime} | \bullet | \Delta x | \leqslant | y^{\prime} | \bullet \delta_{x},$$

即y的绝对误差限约为

$$\delta _ { y } = | y ^ { \prime } | \cdot \delta _ { x } ,$$

$y$ 的相对误差限约为

$$\frac{\partial_{y}}{\left | y \right | }=\left | \frac{y^{\prime}}{y} \right | \cdot \delta_{x}.$$

[page:89]

## 3.6 本章内容对开普勒问题的应用

微分的简单应用

## 3.6 本章内容对开普勒问题的应用

考虑在平面上运动的一个质点，它在时刻t的位置可以用从原点到这点的有向线段(向径)来表示，也就是说，可以用向量 $\boldsymbol{B}(t) = \left\{ x(t), y(t) \right\}$ 来表示.从时刻t到时刻 $t + \Delta t$ ，质点从 $(x(t),y(t))$ 运动到 $\left( x \left( t + \Delta t \right) , y \left( t + \Delta t \right) \right)$ ，它的位移可以用向量

$$\Delta \boldsymbol{B}(t) = \boldsymbol{B}(t + \Delta t) - \boldsymbol{B}(t)$$

来表示.在这段时间里，质点的平均速度为

$$\frac { \Delta B ( t ) } { \Delta t } = \frac { B ( t + \Delta t ) - B ( t ) } { \Delta t } ,$$

这是一个向量.让 $\Delta t \rightarrow 0$ ，得到瞬时速度

$$v(t) = \lim_{\Delta t \to 0} \frac{\Delta \boldsymbol{B}(t)}{\Delta t} = \frac{\mathrm{d}\boldsymbol{B}(t)}{\mathrm{d}t} = \left\{ x^{\prime}(t), y^{\prime}(t) \right\}.$$

瞬时速度也是一个向量，它正好沿着质点运动轨迹的切线方向.瞬时速度向量的模

$$\left| \boldsymbol{v}(t) \right| = \left| \frac{\mathrm{d}\boldsymbol{B}(t)}{\mathrm{d}t} \right| = \sqrt{(x^{'}(t))^2 + (y^{'}(t))^2}$$

正好等于质点通过的路程s对时间的导数.为说明这一事实，需要指出

$$\frac{\mathrm{d}s}{\mathrm{d}t} = \sqrt{(x^{\prime}(t))^2 + (y^{\prime}(t))^2}.$$

这一事实暂且承认，其证明将在定积分的应用一章中给出.这样，瞬时速度向量$y(t) = \frac{\mathrm{d}B(t)}{\mathrm{d}t}$ 很好地描述了运动的瞬时状况:它的大小即路程对时间的导数，它的方向即运动轨迹的切线方向

根据同样的道理，运动的加速度也表示为一个向量

$$a = \frac{\mathrm{d}v}{\mathrm{d}t} = \frac{\mathrm{d}^2 B}{\mathrm{d}t^2}.$$

于是，对于质点的平面运动，牛顿第二定律的数学表示为

$$m \frac{\mathrm{d}^{2} \hat{B}}{\mathrm{d} t^{2}} = F,$$

这里作用力F也是平面上的向量

[page:90]

## 第3章 导数与微分

为了以下讨论方便，这里先推导质点运动方程的极坐标形式.质点在每一处都有一个与其向径同方向的单位向量 $e_{r} = \left\{ \cos \theta (t), \sin \theta (t) \right\}$ ，也有一个与 $e _ { r }$ 垂直与切线方向重合的单位向量 $e_{\theta} = \left\{ - \sin \theta (t) , \cos \theta (t) \right\}$ .在极坐标系下，有

$$\left\langle x(t),y(t)\right\rangle =\left\{ r(t)\cos \theta (t),r(t)\sin \theta (t)\right\} ,$$

所以

$$\begin{aligned} \boldsymbol { v } ( t ) &= \langle \boldsymbol { x } ^ { \prime } ( t ) , \boldsymbol { y } ^ { \prime } ( t ) \rangle \\&= \langle \boldsymbol { r } ^ { \prime } ( t ) \cos \theta ( t ) - \boldsymbol { r } ( t ) \theta ^ { \prime } ( t ) \sin \theta ( t ) , \boldsymbol { r } ^ { \prime } ( t ) \sin \theta ( t ) + \boldsymbol { r } ( t ) \theta ^ { \prime } ( t ) \cos \theta ( t ) \rangle \\&= \boldsymbol { r } ^ { \prime } \boldsymbol { e } _ { r } + \boldsymbol { r } \theta ^ { \prime } \boldsymbol { e } _ { \beta } .\\ \end{aligned}$$

同理，有

$$\begin{align*}\boldsymbol{a}(t) = & \left\{ \boldsymbol{x}''(t), \boldsymbol{y}''(t) \right\} \\= & \left\{ \boldsymbol{r}''(t) \cos \theta(t) - \boldsymbol{r}(t) \left( \theta'(t) \right)^2 \cos \theta(t) - 2 \boldsymbol{r}'(t) \theta'(t) \sin \theta(t) - \boldsymbol{r}(t) \theta'(t) \sin \theta(t) \right\} \\= & \left\{ \boldsymbol{r}''(t) \sin \theta(t) + 2 \boldsymbol{r}'(t) \theta'(t) \cos \theta(t) + \boldsymbol{r} \theta'(t) \cos \theta(t) - \boldsymbol{r}(t) \left( \theta'(t) \right)^2 \sin \theta(t) \right\} \\= & \left( \boldsymbol{r}'' - \boldsymbol{r}(\theta')^2 \right) \boldsymbol{e}_r + \left( 2 \boldsymbol{r}' \theta' + \boldsymbol{r} \theta' \right) \boldsymbol{e}_\theta \\= & a_r \boldsymbol{e}_r + a_r \boldsymbol{e}_\theta,\end{align*}$$

其中

$$a_{r}=r^{\prime}-r(\theta^{\prime})^{2}, \quad a_{\theta}=2r^{\prime}\theta^{\prime}+r\theta^{\prime\prime}.$$

作用在质点上的力F也沿这两方向分解，即

$$\boldsymbol{F} = \boldsymbol{F}_{r} \boldsymbol{e}_{r} + \boldsymbol{F}_{\theta} \boldsymbol{e}_{\theta}.$$

把运动方程

$$m B ^ { \prime \prime } = F$$

改写成

$$m a _ { r } e _ { r } + m a _ { \theta } e _ { \theta } = F _ { r } e _ { r } + F _ { \theta } e _ { \theta } ,$$

所以

$$m a _ { r } = F _ { r } , \quad m a _ { \theta } = F _ { \theta } ,$$

即

$$m(r^{\prime}-r(\theta^{\prime})^{2})=F_{r}, \quad m(2r^{\prime}\theta^{\prime}+r\theta^{\prime})=F_{\theta^{\prime}}$$

这就是质点运动方程的极坐标形式(适用于质点的平面运动).

下面从开普勒定律导出万有引力定律.开普勒第二定律说:从太阳中心指向一个行星的向径，在相等的时间内扫过相等的面积，换句话说就是向径的面积速度等于常数.先承认面积速度的分析表达式为

$$\frac{\mathrm{d}A}{\mathrm{d}t} = \frac{1}{2} r^2 \frac{\mathrm{d}\theta}{\mathrm{d}t},$$

即

[page:91]

## 3.6 本章内容对开普勒问题的应用

$$A^{\prime} = \frac{1}{2} r^{2} \theta^{\prime}.$$

具体的证明在定积分的应用部分给出

这样，开普勒第二定律的数学表示即为

$$r^{2}\theta^{\prime}=h( 常数 ).$$

对上式求导，得

$$2m^{\prime}\theta^{\prime}+r^{2}\theta^{\prime\prime}=0.$$

由此得到

$$2r^{\prime}\theta^{\prime}+r\theta^{\prime\prime}=0.$$

于是，得

$$F _ { \theta } = m ( 2 r ^ { \prime } \theta ^ { \prime } + r \theta ^ { \prime \prime } ) = 0 ,$$

$$\boldsymbol{F} = F_{r} \boldsymbol{e}_{r} + F_{\theta} \boldsymbol{e}_{\theta} = F_{r} \boldsymbol{e}_{r}.$$

这就是说，行星所受的力作用在太阳与行星的连线上

其次，根据开普勒第一定律，行星绕太阳运行的轨道是一个椭圆，太阳中心在椭圆的一个焦点上.用极坐标写出轨道的方程

$$r = \frac{p}{1 + \varepsilon \cos \theta}$$

由此得到

$$\frac{1}{r} = \frac{1}{\dot{p}}(1 + \varepsilon \cos \theta) = \frac{1}{\dot{p}} + \frac{\varepsilon}{\dot{p}} \cos \theta,$$

两边对t求导，得

$$- \frac{r^{\prime}}{r^{2}} = - \frac{\varepsilon}{p} \cdot \sin \theta \cdot \theta^{\prime},$$

$$r ^ { \prime } = \frac { \varepsilon } { p } ( r ^ { 2 } \theta ^ { \prime } ) \sin \theta = \frac { \varepsilon h } { p } \sin \theta.$$

于是，得

$$a_{r}=r^{\prime\prime}-r(\theta^{\prime})^{2}=r^{\prime\prime}-\frac{(r^{2}\theta^{\prime})^{2}}{r^{3}}=\frac{\varepsilon h^{2}}{\rho r^{2}}\cos\theta-\frac{h^{2}}{r^{3}}\\=\frac{h^{2}}{r^{2}}\left(\frac{\varepsilon}{\rho}\cos\theta-\frac{1}{r}\right)=-\frac{h^{2}}{\rho}\frac{1}{r^{2}},$$

$$F_{r}=ma_{r}=-\frac{mh^{2}}{p}\frac{1}{r^{2}}=-km\frac{1}{r^{2}}.$$

下面指出 $k = h^{2} / p$ 是一个常数(对太阳系中所有的行星都是一样的).注意到:面积速度 $\frac{\mathrm{d}A}{\mathrm{d}t} = \frac{1}{2} r^2 \theta^{\prime} = \frac{1}{2} h$ 与周期T相乘应该得到椭圆的面积

[page:92]

## 第3章 导数与微分

$$\frac{1}{2}hT = \pi ab.$$

这里暂且承认椭圆的面积是以上表达式，具体证明在定积分应用部分给出

由此得到

$$h = \frac{2\pi ab}{T}, \quad h^{2} = \frac{4\pi^{2}a^{2}b^{2}}{T^{2}}.$$

根据开普勒第三定律，应有

$$T^{2} = \lambda a^{3}$$

其中比值λ对太阳系中所有的行星都相同.于是

$$h ^ { 2 } = \frac { 4 \pi ^ { 2 } } { \lambda } \frac { b ^ { 2 } } { a } = \frac { 4 \pi ^ { 2 } } { \lambda } p ,$$

$$k = \frac{h^{2}}{p} = \frac{4\pi^{2}}{\lambda}$$

得

$$F_{r}=-km\frac{1}{r^{2}}\quad(k 是常数 ).$$

这就是说:行星所受的力指向太阳，它的大小与行星的质量成正比，与行星到太阳的距离的平方成反比

牛顿正是从这些结论出发，通过进一步的思考，总结出著名的万有引力定律.

[page:93]

# 第4章 定积分与不定积分

本章讨论微积分学的另一个大问题，即积分问题.下面将给出定积分与不定积分的概念与计算方法

## 4.1 定积分的概念和性质

## 4.1.1 两个实例

## 1. 曲边梯形的面积

设曲边梯形由连续曲线 $y = f(x)(f(x) \geqslant 0)$ ,x轴和直线 $x = a, x = b$ 围成，求它

困难在于有一边是“曲”的.为了克服这个困难，我们先把曲边梯形分细，对于每一个小曲边梯形，可用一个小矩形去近似代替它，这就是“以直代曲”.求出面积后，再一个个相加，于是得到一个大的阶梯形面积，它是原来大曲边梯形面积A的一个近似值.为了得到A的精确值，让分割无限变细，最后得到的极限值就是A.

图4.1

具体做法可分为以下四步

（1）分割 把区间 $\left[ a , b \right]$ 任意分成n个小区间，设分点为

$$a = x_{0} < x_{1} < x_{2} < \cdots < x_{n - 1} < x_{n} = b,$$

小区间的长度为

$$\Delta x_{i} = x_{i} - x_{i - 1}, \quad i = 1,2,\cdots,n.$$

过每个分点 $x_{i}(i = 1,2,\cdots,n)$ 作平行于y轴的直线，把原曲边梯形分为n个小曲边梯形，它们的面积分别记作

$$\Delta A_{1}, \Delta A_{2}, \cdots, \Delta A_{n}.$$

(2)近似代替“以直代曲”:考虑有代表性的小区间

$$\left[ x _ { i - 1 } , x _ { i } \right] , \quad i = 1 , 2 , \cdots , n ,$$

因为 $f(x)$ 是连续函数，所以当分割充分细密时， $f ( x )$ 在小区间 $\left[ x_{i - 1},x_{i} \right]$ 上的值变化不大，从而可用一个小矩形去近似代替小曲边梯形.这个小矩形的底与小曲边梯

[page:94]

## 第4章 定积分与不定积分

形的底相同，而高是函数值 $f(\xi_{i})$ ，于是得到

$$\Delta A_{i} \approx f(\xi_{i}) \cdot \Delta x_{i}, \quad i = 1,2,\cdots,n,$$

其中 $\xi _ { i } ^ { 1 }$ 是小区间 $\left[ x_{i - 1},x_{i} \right]$ 上的任意一点.

(3)求和 将各小区间上的函数值求和得到A的近似值

$$\begin{aligned}A &= \Delta A_{1} + \Delta A_{2} + \cdots + \Delta A_{n} \\&\approx f(\xi_{1}) \bullet \Delta x_{1} + f(\xi_{2}) \bullet \Delta x_{2} + \cdots + f(\xi_{n}) \bullet \Delta x_{n} \\&= \sum_{i=1}^{n} f(\xi_{i}) \bullet \Delta x_{i},\end{aligned}$$

这是一个阶梯形面积

（4）取极限显然，阶梯形面积 $\sum_{i = 1}^{n} f(\xi_{i}) \cdot \Delta x_{i}$ 既依赖于区间 $[ a , b ]$ 的分割方法，也依赖于中间点 $\xi_{i}(i = 1,2,\cdots,n)$ 的取法.但是，容易看出，当分割充分细时，$\sum_{i = 1}^{n} f(\xi_{i}) \cdot \Delta x_{i}$ 就可以任意接近所求面积A；并且当分割无限细下去(表现为$\lambda = \max_{1 \leqslant i \leqslant n} \{ \Delta x_{i} \} \rightarrow 0$ 时，就有

$$A = \lim_{\lambda \to 0} \sum_{i=1}^{n} f(\xi_i) \cdot \Delta x_i.$$

## 2. 质点做变速直线运动的路程

设质点沿直线做变速运动，速度为 $v = v(t)$ ，假定 $v ( t )$ 是t的连续函数，求质点在时间间隔 $\left[ a , b \right]$ 内所走过的路程s.

匀速直线运动的路程公式为 $\varsigma { \equiv } \upsilon t$ ，变速运动怎样求路程呢？

与上一个实例相似，把区间 $[ a , b ]$ 分细，以便在每个局部，可以把运动近似看成是匀速的.这就是“以匀代变”.

具体步骤如下:

(1) 分割 将区间 $[ a , b ]$ 任意分成n份，设分点为

$$a = t_{0} < t_{1} < t_{2} < \cdots < t_{n - 1} < t_{n} = b,$$

小区间的长度为

$$\Delta t_{i}=t_{i}-t_{i-1}, \quad i=1,2,\cdots,n.$$

(2)近似代替“以匀代变”:考虑小区间 $\left[ t _ { i - 1 } , t _ { i } \right] ( i = 1 , 2 , \cdots , n )$ .由于区间很小，速度 $v ( t )$ 又是连续变化的，因此可把质点在小区间上的运动近似看成匀速运动.具体地说，可在区间 $\left[ t _ { i - 1 } , t _ { i } \right]$ 上任取一点 $\tau_{i}(t_{i - 1} \leqslant \tau_{i} \leqslant t_{i})$ ，用质点在时刻 $\tau _ { i }$ 的速度 $v ( \tau _ { i } )$ 去近似代替变速 $v ( t )$ ，于是得到

$$\Delta s_{i} \approx v(\tau_{i}) \cdot \Delta t_{i}, \quad i = 1,2,\cdots,n.$$

(3) 求和

$$s = \Delta s_{1} + \Delta s_{2} + \cdots + \Delta s_{n}$$

[page:95]

## 4.1 定积分的概念和性质

$$\begin{align*}\approx & \; v(\tau_1) \bullet \Delta t_1 + v(\tau_2) \bullet \Delta t_2 + \cdots + v(\tau_n) \bullet \Delta t_n \\= & \; \sum_{i=1}^{n} v(\tau_i) \bullet \Delta t_i.\end{align*}$$

(4)取极限记 $\lambda = \max_{1 \leqslant i \leqslant n} \{ \Delta t_{i} \}$ ,令 $\lambda \rightarrow 0$ ,则

$$s = \lim_{\lambda \to 0} \sum_{i=1}^{n} v(\tau_i) \cdot \Delta t_i.$$

## 4.1.2 定积分的定义

从上面两个例子可以看到，问题最后都归结为求某种和式的极限。类似的实际问题还有很多，如变力做功问题，转动惯量问题，引力问题，旋转体的体积问题，曲线的弧长问题等.把处理这些问题的数学方法加以概括和抽象，便得到了定积分的定义.

定义4.1(定积分） 设函数 $f(x)$ 在区间 $\left[ a , b \right]$ 上有定义.用分点

$$a = x_{0} < x_{1} < x_{2} < \cdots < x_{n - 1} < x_{n} = b$$

将区间 $\left[ a , b \right]$ 任意分成n个小区间，小区间的长度为

$$\Delta x_{i}=x_{i}-x_{i-1}, \quad i=1,2,\cdots,n,$$

记 $\lambda = \max_{1 \leq i \leq n} \{ \Delta x_i \}$ .在每个小区间 $\left[ x _ { i - 1 } , x _ { i } \right]$ 上任取一点 $\xi_{i}(x_{i - 1} \leqslant \xi_{i} \leqslant x_{i})$ ，作乘积

$$f(\xi_{i}) \cdot \Delta x_{i}, \quad i = 1, 2, \cdots, n.$$

将这些乘积相加，得到和式

$$\sigma _ { n } = \sum _ { i = 1 } ^ { n } f ( \xi _ { i } ) \cdot \Delta x _ { i } ,$$

这个和称为函数 $f(x)$ 在区间 $\left[ a , b \right]$ 上的积分和.令 $\lambda \rightarrow 0$ ，若积分和 $\sigma _ { n }$ 有极限I(这个值I不依赖于 $[a,b]$ 的分法以及中间点 $\xi _ { i }$ 的取法 $(i = 1,2,\cdots,n)$ ，则称此极限值为 $f(x)$ 在 $\left[ a , b \right]$ 上的定积分，记作

$$I = \lim _ { \lambda \rightarrow 0 } \sum _ { i = 1 } ^ { n } f ( \xi _ { i } ) \cdot \Delta x _ { i } = \int _ { a } ^ { b } f ( x ) \mathrm { d } x ,$$

其中a和b分别称为定积分的下限与上限， $\left[ a , b \right]$ 称为积分区间.

定积分的这一定义，在历史上首先是由黎曼(Riemann)给出的，因此这种意义上的定积分也称为黎曼积分

若 $f ( x )$ 在 $[ a , b ]$ 上的定积分存在，则称 $f ( x )$ 在 $\left[ a , b \right]$ 上可积(或黎曼可积).

定积分 $\int_{a}^{b} f(x)   dx$ 也可用 $\varepsilon - \delta ^ { \prime \prime }$ 语言给出定义.

设 $f ( x )$ 在 $[ a , b ]$ 上有定义，I为常数.任给 $\varepsilon > 0$ ,若存在 $\delta > 0$ ，使得对于 $\left[ a , b \right]$的任意分法以及中间点 $\xi_{i}(x_{i - 1} \leqslant \xi_{i} \leqslant x_{i})$ 的任意取法，只要

$$\lambda = \max_{1 \leqslant i \leqslant n} \{ \Delta x_{i} \} < \delta,$$

就有

[page:96]

## 第4章 定积分与不定积分

$$\left| \sigma _ { n } - I \right| = \left| \sum _ { i = 1 } ^ { n } f ( \xi _ { i } ) \cdot \Delta x _ { i } - I \right| < \varepsilon ,$$

则称I为 $f(x)$ 在[a,b]上的定积分，记作

$$I = \lim _ { \lambda \rightarrow 0 } \sum _ { i = 1 } ^ { n } f ( \xi _ { i } ) \cdot \Delta x _ { i } = \int _ { a } ^ { b } f ( x ) \mathrm { d } x ,$$

有了定积分的概念以后，上面的两个实例就可以用定积分来表示

在第一个实例中，曲边梯形的面积A是曲边函数 $y = f(x)$ 在区间 $\left[ a , b \right]$ 上的定积分，即

$$A = \int_{a}^{b} f(x)   \mathrm{d}x, \quad f(x) \geqslant 0.$$

在第二个实例中，做变速直线运动的质点所走过的路程s是速度函数 $v = v(t)$在时间区间 $\left[ a , b \right]$ 上的定积分，即

$$s = \int_{a}^{b} v(t)   dt.$$

## 4.1.3 函数的可积性

若 $f ( x )$ 在 $[ a , b ]$ 上的定积分存在，则称 $f(x)$ 在 $\left[ a , b \right]$ 上可积，那么，什么样的函数是可积的呢？有下面的重要定理

定理4.1 若 $f(x)$ 在 $\left[ a , b \right]$ 上连续，则 $f ( x )$ 在 $[ a , b ]$ 上可积.

定理4.2若 $f(x)$ 在 $[ a , b ]$ 上只有有限个间断点，并且有界，则 $f ( x )$ 在 $[ a , b ]$上可积.

## 4.1.4 积分的几何意义

在 $\left[ a,b \right] \models f(x) \geqslant 0$ 时，定积分 $\int_{a}^{b} f(x)   dx$ 在几何上表示由曲线 $y = f(x)$ ,两条直线 $x = a, x = b$ 与x轴所围成的曲边梯形的面积；在 $\left[ a,b \right] \models f(x) \leq 0$ 时，由曲线$y = f(x)$ 、两条直线 $x = a, x = b$ 与x轴所围成的曲边梯形位于x轴的下方，定积分

$\int_{a}^{b} f(x)   dx$ 在几何上表示上述曲边梯形面积的负值；在 $[ a , b ]$ 上 $f ( x )$ 既取得正值又取得负值时，函数 $f ( x )$ 的图形某些部分在x轴的上方，而其他部分在x轴下方.此时定积分 $\int_{a}^{b} f(x) \mathrm{d}x$表示x轴上方图形面积减去x轴下方图形面积所得之差(图4.2).

[page:97]

## 4.1 定积分的概念和性质

例4.1 利用定义计算定积分 $\int_{0}^{1} x^{2} \mathrm{d}x$

解因为被积函数 $f(x) = x^{2}$ 在积分区间 $[ 0 , 1 ]$ 上连续，而连续函数是可积的，所以积分与区间[0，1]的分法及点 $\xi _ { i }$ 的取法无关.因此，为了便于计算，不妨把区间[0,1]分成n等份，分点为 $x_{i}=\frac{i}{n},i=1,2,\cdots,n-1$ ，这样，每个小区间$\left[ x_{i - 1},x_{i} \right]$ 的长度 $\Delta x_{i}=\frac{1}{n},i=1,2,\cdots,n$ ,取 $\xi_{i}=x_{i},i=1,2,\cdots,n$ ，于是，得和式

$$\begin{aligned}\sum_{i = 1}^{n} f(\xi_{i}) \Delta x_{i} &= \sum_{i = 1}^{n} \xi_{i}^{2} \Delta x_{i} = \sum_{i = 1}^{n} x_{i}^{2} \Delta x_{i} \\&= \sum_{i = 1}^{n} \left( \frac{i}{n} \right)^{2} \cdot \frac{1}{n} = \frac{1}{n^{3}} \sum_{i = 1}^{n} i^{2} \\&= \frac{1}{n^{3}} \cdot \frac{1}{6} n (n + 1) (2n + 1) \\&= \frac{1}{6} \left( 1 + \frac{1}{n} \right) \left( 2 + \frac{1}{n} \right).\end{aligned}$$

当 $\lambda \rightarrow 0$ ，即n→∞时，取上式右端的极限.由定积分的定义，即得所要计算的积分

$$\int_{0}^{1} x^{2} \mathrm{d}x = \lim_{\lambda \rightarrow 0} \sum_{i = 1}^{n} \xi_{i}^{2} \Delta x_{i} = \lim_{n \rightarrow \infty} \frac{1}{6} \left( 1 + \frac{1}{n} \right) \left( 2 + \frac{1}{n} \right) = \frac{1}{3}.$$

## 4.1.5 定积分的近似计算

设定积分 $\int_{a}^{b} f(x)   dx$ 存在，考虑如何得到它的一个近似值

用分点 $a = x_{0},x_{1},x_{2},\cdots,x_{n} = b$ 将 $\left[ a , b \right]$ 分成n个长度相等的小区间，每个小区间的长为

$$\Delta x = \frac{b - a}{n},$$

在小区间 $\left[ x_{i - 1},x_{i} \right]$ 上，取 $\xi = x_{i - 1}$ ,应有

$$\int_{a}^{b} f(x)   dx = \lim_{n \to \infty} \frac{b - a}{n} \sum_{i=1}^{n} f(x_{i-1})$$

从而对于任意确定的正整数n，有

$$\int_{a}^{b} f(x)   dx \approx \frac{b - a}{n} \sum_{i = 1}^{n} f(x_{i - 1}).$$

记 $f(x_{i}) = y_{i} \left( i = 0, 1, 2, \cdots, n \right)$ ，上式可记作

$$\int_{a}^{b} f(x)   dx \approx \frac{b - a}{n} (y_0 + y_1 + \cdots + y_{n-1}).$$

如果取 $\xi = x_{i}$ ，则可得近似公式

$$\int_{a}^{b} f(x)   dx \approx \frac{b - a}{n} (y_1 + y_2 + \cdots + y_n).$$

[page:98]

## 第4章 定积分与不定积分

以上求定积分近似值的方法称为矩形法，公式称为矩形法公式

矩形法的几何意义是用窄条矩形的面积作为窄条曲边梯形面积的近似值.整体上用台阶型的面积作为曲边梯形面积的近似值(图4.3).

求定积分近似值的方法，常用的还有梯形法和抛物线法(又称辛普森法)，简单介绍如下.

和矩形法一样，将区间 $\left[ a , b \right] n$ 等分.设 $f(x_{i}) = y_{i}$ ，曲线 $y = f(x)$ 上的点$(x_{i},y_{i})$ 记作 $M_{i}(i = 0,1,2,\cdots,n)$ a

梯形法的原理是将曲线 $y = f(x)$ 上的小弧段 $\overline { { M _ { i - 1 } M _ { i } } }$ 用直线段 $[ \overline { { M _ { i - 1 } } } \overline { { M _ { i } } } ]$ 代替，也就是把窄条曲边梯形用窄条梯形代替(图4.4)，由此得到定积分的近似值为

$$\begin{aligned}\int_{a}^{b} f(x) \mathrm{d}x & \approx \frac{b - a}{n} \left( \frac{y_{0} + y_{1}}{2} + \frac{y_{1} + y_{2}}{2} + \cdots + \frac{y_{n - 1} + y_{n}}{2} \right) \\& = \frac{b - a}{n} \left( \frac{y_{0} + y_{n}}{2} + y_{1} + y_{2} + \cdots + y_{n - 1} \right).\end{aligned}$$

显然，梯形法公式所得近似值就是矩形法公式所得两个近似值的平均值

例4.2 有一条河，宽200m，从一岸到对岸，每隔20m测量一次水深，测得数据如下表:

<table><tr><td>x(宽)/m</td><td>0</td><td>20</td><td>40</td><td>60</td><td>80</td><td>100</td><td>120</td><td>140</td><td>160</td><td>180</td><td>200</td></tr><tr><td>y(深)/m</td><td>2</td><td>4</td><td>6</td><td>9</td><td>12</td><td>16</td><td>18</td><td>13</td><td>8</td><td>6</td><td>2</td></tr></table>

求此河的横断面面积A的近似值

解设此河横断面的底边方程为 $y = f(x)$ ，则所求面积为

$$A = \int_{0}^{200} f(x)   \mathrm{d}x.$$

利用梯形公式，由于 $n=10,\frac{b-a}{n}=20\mathrm{m}$ ,因此

$$A = \int_{0}^{200} f(x)   \mathrm{d}x$$

[page:99]

## 4.1 定积分的概念和性质

$$\begin{aligned} &\approx 20\left[\frac{2+2}{2}+4+6+9+12+16+18+13+8+6\right]\\ &=1880(\mathrm{m}^{2}).\\ \end{aligned}$$

抛物线法的原理是将曲线 $y = f(x)$ 上的两个小弧段 $\overline{M_{i - 1}M_{i}}$ 和 $M_{i}M_{i + 1}$ 合起来，用过 $M_{i - 1},M_{i}$ $M_{i + 1}$ 三点的抛物线 $y = p x ^ { 2 } + q x + r$ 代替(图4.5).经推导可得，以此抛物线弧段为曲边、以 $\mathbb { L } x _ { i - 1 }$ $x_{i + 1}]$ 为底的曲边梯形面积为

$$\begin{aligned}\frac{1}{6}(y_{i - 1} + 4y_{i} + y_{i + 1}) \cdot 2\Delta x_{i} \\= \frac{b - a}{3n}(y_{i - 1} + 4y_{i} + y_{i + 1}).\end{aligned}$$

取n为偶数，得到定积分的近似值为

$$\begin{aligned}\int_{a}^{b} f(x) \mathrm{d}x & \approx \frac{b - a}{3n}[(y_{0} + 4y_{1} + y_{2}) + (y_{2} + 4y_{3} + y_{4}) + \cdots + (y_{n - 2} + 4y_{n - 1} + y_{n})] \\& = \frac{b - a}{3n}[y_{0} + y_{n} + 4(y_{1} + y_{3} + \cdots + y_{n - 1}) + 2(y_{2} + y_{4} + \cdots + y_{n - 2})].\end{aligned}$$

例4.3 用抛物线公式近似计算定积分 $\int_{0}^{1} \mathrm{e}^{-x^{2}}   \mathrm{d}x$

解取分点和相应的函数值用下表给出:

<table><tr><td>i</td><td>0</td><td>1 0.1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><td>x y</td><td>0.0 1.00000</td><td>0.99005</td><td>0.2 0.96079</td><td>0.3 0.91393</td><td>0.4 0.85214</td><td>0.5 0.77880</td></tr><tr><td>i</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td></td></tr><tr><td></td><td>0.6</td><td>0.7</td><td>0.8</td><td>0.9</td><td>1.0</td><td></td></tr><tr><td>x</td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>y</td><td>0.69768</td><td>0.61263</td><td>0.52729</td><td>0.44486</td><td>0.36788</td><td></td></tr></table>

于是由抛物线公式，得到

$$\begin{aligned}\int_{0}^{1} \mathrm{e}^{-x^2} \mathrm{d}x & \approx \frac{b-a}{3n}[(y_0 + y_{10}) + 4(y_1 + y_3 + y_5 + y_7 + y_8) + 2(y_2 + y_4 + y_6 + y_8)] \\& = \frac{1}{30}[1.36788 + 2 \times 3.03790 + 4 \times 3.74027] \\& = 0.74683.\end{aligned}$$

[page:100]

## 第4章 定积分与不定积分

## 4.1.6 定积分的基本性质

为了以后计算及应用方便起见，对定积分做以下两点补充规定:

(1) 当 $a = b$ 时， $\int_{a}^{b} f(x) \mathrm{d}x = 0$ 80

(2) 当 $a > b$ 时， $\int_{a}^{b} f(x)   \mathrm{d}x = - \int_{b}^{a} f(x)   \mathrm{d}x.$

性质4.1 $\int_{a}^{b} \mathrm{d}x = b - a.$

证直接运用定义即可.

性质4.2(线性性质) $\int _ { a } ^ { b } \left[ k _ { 1 } f ( x ) + k _ { 2 } g ( x ) \right] \mathrm { d } x = k _ { 1 } \int _ { a } ^ { b } f ( x ) \mathrm { d } x + k _ { 2 } \int _ { a } ^ { b } g ( x ) \mathrm { d } x   .$证$\begin{aligned}&\int_{a}^{b}\left[k_{1} f(x)+k_{2} g(x)\right] \mathrm{d} x \\=&\lim _{\lambda \rightarrow 0} \sum_{i=1}^{n}\left[k_{1} f(\xi_{i})+k_{2} g(\xi_{i})\right] \bullet \Delta x_{i} \\=&\lim _{\lambda \rightarrow 0}\left[k_{1} \sum_{i=1}^{n} f(\xi_{i}) \bullet \Delta x_{i}+k_{2} \sum_{i=1}^{n} g(\xi_{i}) \bullet \Delta x_{i}\right] \\=&k_{1} \lim _{\lambda \rightarrow 0} \sum_{i=1}^{n} f(\xi_{i}) \bullet \Delta x_{i}+k_{2} \lim _{\lambda \rightarrow 0} \sum_{i=1}^{n} g(\xi_{i}) \bullet \Delta x_{i} \\=&k_{1} \int_{a}^{b} f(x) \mathrm{d} x+k_{2} \int_{a}^{b} g(x) \mathrm{d} x.\end{aligned}$

推论4.1 $\int _ { a } ^ { b } \left[ f ( x ) \pm g ( x ) \right] \mathrm{d}x = \int _ { a } ^ { b } f ( x ) \mathrm{d}x \pm \int _ { a } ^ { b } g ( x ) \mathrm{d}x  .$

推论4.2 $\int_{a}^{b} k f(x)   dx = k \int_{a}^{b} f(x)   dx$

性质4.3 $\int_{a}^{b} f(x)   dx = \int_{a}^{c} f(x)   dx + \int_{c}^{b} f(x)   dx$

证先设 $a < c < b$ 因为函数 $f ( x )$ 在区间 $\left[ a , b \right]$ 上可积，所以不论 $\left[ a , b \right]$ 怎样分，积分和的极限总是不变的.因此，在分区间时，可以使c永远是个分点.那么，$\left[ a , b \right]$ 上的积分和等于 $[ a , c ]$ 上的积分和加 $[ c , b ]$ 上的积分和，记为

$$\sum_{[a,b]} f(\xi_i) \Delta x_i = \sum_{[a,c]} f(\xi_i) \Delta x_i + \sum_{[c,b]} f(\xi_i) \Delta x_i.$$

令 $\lambda \rightarrow 0$ ，上式两端同时取极限，即得

$$\int_{a}^{b} f(x)   dx = \int_{a}^{c} f(x)   dx + \int_{c}^{b} f(x)   dx.$$

其他情形的证明从略

性质4.4若 $a < b,f(x) \leq g(x)$ ，则 $\int_{a}^{b} f(x) \mathrm{d}x \leqslant \int_{a}^{b} g(x) \mathrm{d}x$

[page:101]

## 4.1 定积分的概念和性质

证因为 $f(x) \leqslant g(x) (a \leqslant x \leqslant b)$ ，所以对于区间 $[ a , b ]$ 的任意分割以及中间点 $\xi_{i}(i = 1,2,\cdots,n)$ 的任意取法，都有

$$f ( \xi _ { i } ) \leqslant g ( \xi _ { i } ) , \quad i = 1 , 2 , \cdots , n ,$$

从而

$$\sum_{i = 1}^{n} f(\xi_{i}) \cdot \Delta x_{i} \leqslant \sum_{i = 1}^{n} g(\xi_{i}) \cdot \Delta x_{i}.$$

令 $\lambda \rightarrow 0$ ，上式两端取极限，得

$$\lim _ { \lambda \rightarrow 0 } \sum _ { i = 1 } ^ { n } f ( \xi _ { i } ) \cdot \Delta x _ { i } \leqslant \lim _ { \lambda \rightarrow 0 } \sum _ { i = 1 } ^ { n } g ( \xi _ { i } ) \cdot \Delta x _ { i } ,$$

即

$$\int_{a}^{b} f(x)   \mathrm{d}x \leqslant \int_{a}^{b} g(x)   \mathrm{d}x.$$

推论4.3若 $a < b,f(x) \geqslant 0$ ,则 $\int_{a}^{b} f(x)   dx \geqslant 0.$

推论4.4若 $a < b, m \leq f(x) \leq M$ 则 $m(b - a) \leqslant \int_{a}^{b} f(x)   dx \leqslant M(b - a)$

推论4.5 $\left| \int_{a}^{b} f(x) \mathrm{d}x \right| \leqslant \int_{a}^{b} \left| f(x) \right| \mathrm{d}x$ $(a < b)$

性质4.5(定积分中值定理)(图4.6)若 $f(x)$ 在 $\left[ a , b \right]$ 上连续，则至少有一点$\xi \in [a,b]$ ,使得

$$\int_{a}^{b} f(x)   \mathrm{d}x = f(\xi) (b - a).$$

证因为 f(x)在 $\left[ a , b \right]$ 上连续，所以$f ( x )$ 在[a,b]上必有最大值M和最小值m，

图4.6

由推论4.4得

$$\begin{aligned}m(b - a) &\leqslant \int_{a}^{b} f(x)   dx \leqslant M(b - a), \\m &\leqslant \frac{1}{b - a} \int_{a}^{b} f(x)   dx \leqslant M,\end{aligned}$$

则 $\frac{1}{b - a}\int_{a}^{b}f(x)\mathrm{d}x$ 为介于m与M之间的一个数.由闭区间上连续函数的介值定理知，至少有一点 $\xi \in [a,b]$ ，使得 $f(\xi) = \frac{1}{b - a}\int_{a}^{b}f(x)\mathrm{d}x$ ,即

$$\int _ { a } ^ { b } f ( x ) \mathrm { d } x = f ( \xi ) ( b - a ) , \quad a \leqslant \xi \leqslant b .$$

例4.4估计 $\int_{\frac{1}{2}}^{1} x^3   \mathrm{d}x$ 的值.

[page:102]

## 第4章 定积分与不定积分

解因为被积函数 $f(x) = x^{3}$ 在积分区间 $\left[ \frac{1}{2}, 1 \right]$ 上单调上升，所以最大值为1,最小值为 $\frac{1}{8}$ .由推论4.4得

$$\frac{1}{16} \leqslant \int_{\frac{1}{2}}^{1} x^3   dx \leqslant \frac{1}{2}.$$

习题4.1

1. 利用定积分定义计算由抛物线 $y = x^{2} + 1$ ，两直线 $x=a,x=b(b>a)$ 及x轴所围成的图形的面积.

$$\int_{a}^{b} x \mathrm{d}x (a < b)$$

$$\int_{0}^{1} \mathrm{e}^{x} \mathrm{d}x  ;$$

$$\int_{a}^{b} (cx + d)   dx;$$

$$\int_{0}^{1} x^{3}   \mathrm{d}x;$$

3. 利用定积分的几何意义，证明下列等式:(1) $\int_{0}^{1} 2x   dx = 1;$ (2) $\int_{0}^{1} \sqrt{1 - x^{2}}   dx = \frac{\pi}{4};$ (3) $\int_{-\pi}^{\pi} \sin x   dx = 0;$

(4) $\int _ { - \frac { \pi } { 2 } } ^ { \frac { \pi } { 2 } } \cos x \mathrm { d } x = 2 \int _ { 0 } ^ { \frac { \pi } { 2 } } \cos x \mathrm { d } x.$

4. 设 $f ( x )$ 为 $\left[ 0 , a \right]$ 上非负单调增加的连续函数， $g(x)$ 是它的反函数，从定积分的几何意义证明$\int_{0}^{a} f(x) \mathrm{d}x + \int_{f(0)}^{f(a)} g(y) \mathrm{d}y = a f(a).$

5.利用定积分的几何意义，求下列积分:

(1) $\int_{0}^{t} x \mathrm{d}x (t > 0)$ ; (2) $\int_{-2}^{4} \left( \frac{x}{2} + 3 \right) \mathrm{d}x ;$ (3) $\int_{-1}^{2} \mid x \mid \mathrm{d}x;$ (4) $\int_{-3}^{3} \sqrt{9 - x^{2}}   dx;$ (5) $\int_{a}^{b}\sqrt{(x - a)(b - x)}\mathrm{d}x;$ (6) $\int_{a}^{b} \left| x - \frac{a + b}{2} \right|   dx.$

6. 设 $a \leq b .$ 问a，b取什么值时，积分 $\int_{a}^{b} (x - x^2)   dx$ 取得最大值?

7. 设 $\int_{-1}^{1} 3f(x) \mathrm{d}x = 18, \int_{-1}^{3} f(x) \mathrm{d}x = 4, \int_{-1}^{3} g(x) \mathrm{d}x = 3.$ 求(1) $\int_{-1}^{1} f(x)   dx ;$ (2) $\int_{1}^{3} f(x)   dx;$ (3) $\int_{3}^{-1} g(x)   dx;$ (4) $\int _ { - 1 } ^ { 3 } \frac { 1 } { 3 } \left[ 4 f ( x ) + 3 g ( x ) \right] \mathrm { d } x .$

8. 水利工程中要计算拦水闸门所受的水压力.已知闸门上水的压强 $\hat { P }$ 与水深h存在函数关系，且有 $p = 9$ .8h $( \mathrm{kN/m^2} )$ .若闸门高 $H = 3 m$ ,宽 $L = 2 m$ ，求水面与闸门顶相齐时闸门所受的水压力P.

9. 设 f(x)在[0,1]上连续，证明 $\int_{0}^{1} f^{2}(x) \mathrm{d}x \geqslant \left( \int_{0}^{1} f(x) \mathrm{d}x \right)^{2}$

[page:103]

## 4.2 微积分基本公式

10. 设 f(x)及 $g(x)$ 在 $[ a , b ]$ 上连续，证明:

(1) 若在[a,b]上 $f(x) \geq 0$ ，且 $\int_{a}^{b} f(x)   \mathrm{d}x = 0$ ，则在 $\left[ a , b \right]$ 上 $f(x) \equiv 0$

(2) 若在[a,b]上， $f(x) \geqslant 0$ ，且 $f(x)$ 不恒等于零，则 $\int_{a}^{b} f(x)   dx > 0$

(3) 若在[a，b]上， $f(x) \leqslant g(x)$ ，且 $\int_{a}^{b} f(x)   dx = \int_{a}^{b} g(x)   dx$ ，则在 $\left[ a,b \right] \models f(x) \equiv g(x)$

11. 判断下列各对积分哪一个的值较大:

(1) $\int_{0}^{1} x^{2} \mathrm{d}x$ 还是 $\int_{0}^{1} x^{3}   dx ?$ (2) $\int_{1}^{2} x^{2} \mathrm{d}x$ 还是 $\int_{1}^{2}x^{3}\mathrm{d}x?$ (3) $\int_{1}^{2} \ln x \mathrm{d}x$ 还是 $\int_{1}^{2} (\ln x)^{2}   dx$

12. 设 $f(x)$ 在区间[a,b]上连续， $g(x)$ 在区间 $\left[ a , b \right]$ 上连续且不变号.证明至少存在一点$\xi \in [a,b]$ ，使下式成立

$$\int _ { a } ^ { b } f ( x ) g ( x ) \mathrm { d } x = f ( \xi ) \int _ { a } ^ { b } g ( x ) \mathrm { d } x.$$

## 4.2 微积分基本公式

定积分对于解决实际问题具有重大的意义，但直接按定义来计算定积分很不容易，所以必须寻求计算定积分的新方法

## 4.2.1 启发

有一物体在一直线上运动.在这直线上取定原点、正向及长度单位，使它成一数轴.设时刻t时物体所在位置为 $s ( t )$ ，速度为 $v ( t )$

物体在时间间隔 $\left[ T _ { 1 } , T _ { 2 } \right]$ 内经过的路程可以用速度函数 $v ( t )$ 在 $\left[ \begin{array} { l } T _ { 1 } , T _ { 2 } \end{array} \right.$ 上的定积分

$$\int_{T_{1}}^{T_{2}}v(t)\mathrm{d}t$$

来表达；另外，这段路程又可以通过位置函数 $s ( t )$ 在区间 $\left[ T _ { 1 } , T _ { 2 } \right]$ 上的增量

$$s(T_{2}) - s(T_{1})$$

来表达.由此可见，位置函数 $s ( t )$ 与速度函数 $v ( t )$ 之间的关系为

$$\int _ { T _ { 1 } } ^ { T _ { 2 } } v ( t ) \mathrm { d } t = s ( T _ { 2 } ) - s ( T _ { 1 } ) .$$

因为 $s^{\prime}(t) = v(t)$ ，为了叙述上的方便，引入原函数的概念.

定义4.2 对于区间I上的 $f(x)$ ，如果存在可导函数 $F(x)$ 满足

$$F^{\prime}(x)=f(x) \quad  或  \quad \mathrm{d}F(x)=f(x)\mathrm{d}x,$$

称 $F(x)$ 为 $f ( x )$ 在区间I上的一个原函数

由原函数的定义可知，如 $F(x)$ 是 $f ( x )$ 的一个原函数，显然 $F(x) + C(C$ 为任意一个常数)也是 $f ( x )$ 的原函数.由此可知，如果 $f ( x )$ 存在原函数，则原函数有无穷多个.以后会证明，若 $F(x),G(x)$ 均为 $f(x)$ 的原函数，则它们之间相差一个常

[page:104]

## 第4章 定积分与不定积分

数，所以 $\left\{ F(x) + C \right\} (C$ 为任意一个常数)是 $f(x)$ 的全部的原函数.

有了原函数的概念，就可以说: $v ( t )$ 在 $\left[ T _ { 1 } , T _ { 2 } \right]$ 上的定积分可以用它的一个原函数在积分区间的两个端点处的函数值之差来表示.试着猜想一下，对于一般的定积分 $\int_{a}^{b} f(x)   dx$ 来说，如果 $F^{\prime}(x) = f(x)$ ，是否有计算公式

$$\int_{a}^{b} f(x)   \mathrm{d}x = F(b) - F(a).$$

回答是肯定的，但是证明它还需要一些预备知识.

## 4.2.2积分上限的函数及其导数

设函数 $f ( x )$ 在区间 $[ a , b ]$ 上连续，并且设x为 $[ a , b ] .$ 上的一点.考虑 $f ( x )$ 在部分区间 $\left[ a , x \right]$ 上的定积分

$$\int_{a}^{x} f(t)   dt.$$

如果上限 $\mathcal { X }$ 在区间 $\left[ a , b \right]$ 上任意变动，则对于每一个取定的x值，定积分有一个对应值，所以它在 $[ a , b ]$ 上定义了一个函数，记作 $\phi(x)$ ,且

$$\phi(x)=\int_{a}^{x}f(t)\mathrm{d}t,\quad a\leqslant x\leqslant b.$$

定理4.3 如果函数f(x)在区间 $[ a , b ]$ 上连续，则积分上限的函数

$$\Phi(x) = \int_{a}^{x} f(t)   dt$$

在 $\left[ a , b \right]$ 上可导，并且它的导数

$$\phi ^ { \prime } ( x ) = \frac { \mathrm { d } } { \mathrm { d } x } \int _ { a } ^ { x } f ( t ) \mathrm { d } t = f ( x ) , \quad a \leqslant x \leqslant b .$$

证若 $x \in (a,b)$ ,设x获得增量 $\Delta x$ ，满足$x + \Delta x \in (a,b)$ ，则(图4.7)

$$\begin{aligned}\Delta \phi &= \phi(x + \Delta x) - \phi(x) \\&= \int_{a}^{x + \Delta x} f(t)   dt - \int_{a}^{x} f(t)   dt \\&= \int_{x}^{x + \Delta x} f(t)   dt.\end{aligned}$$

再利用积分中值定理，即有等式

$$\Delta \Phi = f(\xi) \Delta x,$$

所以

其中 $\xi$ 位于 $\mathcal { X }$ 与 $x + \Delta x$ 之间.

$$\Phi^{\prime}(x)=\lim_{\Delta x \to 0}\frac{\Delta \Phi}{\Delta x}=\lim_{\Delta x \to 0}f(\xi)=f(x).$$

这里用到了 $f(x)$ 的连续性.

[page:105]

## 4.2 微积分基本公式

若 $x = a$ ,取 $\Delta x > 0$ ，则同理可证 $\Phi_{+}^{\prime}(a)=f(a)$ ;若 $x = b$ ,取 $\Delta x < 0$ ，则同理可证 $\Phi _ { - } ^ { \prime } ( b ) = f ( b )$

定理4.4 如果函数 $f ( x )$ 在区间 $\left[ a , b \right]$ 上连续，则函数

$$\Phi(x) = \int_{a}^{x} f(t)   dt$$

就是 $f ( x )$ 在 $[ a , b ]$ 上的一个原函数.

下面我们总结和推广一下变限积分的导数公式:

1. 如果 f(x) 连续，则 $\frac{\mathrm{d}}{\mathrm{d}x}\int_{a}^{x}f(t)\mathrm{d}t=f(x)$

2. 如果f(x) 连续，则 $\frac{\mathrm{d}}{\mathrm{d}x}\int_{x}^{b}f(t)\mathrm{d}t=\frac{\mathrm{d}}{\mathrm{d}x}\left(-\int_{b}^{x}f(t)\mathrm{d}t\right)=-f(x)$

3. 如果 f(x) 连续， $\varphi ( x )$ 可导，则 $\frac{\mathrm{d}}{\mathrm{d}x}\int_{a}^{\varphi(x)}f(t)\mathrm{d}t=f(\varphi(x))\varphi^{\prime}(x)$

这只要把 $\int_{a}^{\varphi(x)} f(t)   dt$ 看成 $\int_{a}^{u} f(t)   dt$ 和 $u = \varphi(x)$ 的复合函数，利用复合函数求导的链锁法则即可得到.

4. 如果 f(x)连续， $\phi(x)$ 可导，则

$$\frac{\mathrm{d}}{\mathrm{d}x} \int_{\psi(x)}^{b} f(t) \mathrm{d}t = \frac{\mathrm{d}}{\mathrm{d}x} \left( - \int_{b}^{\psi(x)} f(t) \mathrm{d}t \right) = - f(\psi(x)) \psi^{\prime}(x).$$

5. 如果 f(x)连续， $\varphi(x),\psi(x)$ 可导，则

$$\frac{\mathrm{d}}{\mathrm{d}x}\int_{\varphi(x)}^{\varphi(x)}f(t)\mathrm{d}t=\frac{\mathrm{d}}{\mathrm{d}x}\left(\int_{c}^{\varphi(x)}f(t)\mathrm{d}t-\int_{c}^{\varphi(x)}f(t)\mathrm{d}t\right)=f(\varphi(x))\varphi^{\prime}(x)-f(\varphi(x))\varphi^{\prime}(x).$$

## 4.2.3 牛顿-莱布尼茨公式

定理4.5 如果函数 $F(x)$ 是连续函数 $f(x)$ 在区间 $\left[ a , b \right]$ 上的一个原函数，则

$$\int_{a}^{b} f(x) \mathrm{d}x = F(b) - F(a).$$

证已知函数 $F(x)$ 是连续函数 $f ( x )$ 的一个原函数，又因积分上限的函数

$$\Phi(x) = \int_{a}^{x} f(t)   dt$$

也是 $f ( x )$ 的一个原函数.于是这两个原函数之差 $F(x) = \phi(x)$ 在 $\left[ a , b \right]$ 上必定是某一个常数C，即

$$F(x)-\Phi(x)=C,\quad a\leqslant x\leqslant b.$$

在上式中令 $x = a$ ,得 $C = F(a)$ ，再代回上式得 $\Phi(x) = F(x) - F(a)$ .令 $x = b$ 9得

$$\int_{a}^{b} f(x)   dx = F(b) - F(a).$$

为了方便起见，以后把 $F(x) - F(a)$ 记成 $\left[F(x)\right]_{a}^{b}$ .于是上式又可写成

[page:106]

## 第4章 定积分与不定积分

$$\int_{a}^{b} f(x)   dx = \left[ F(x) \right]_{a}^{b}.$$

这个公式叫做牛顿-莱布尼茨公式，它表明:一个连续函数在区间 $\left[ a , b \right]$ 上的定积分等于它的任一个原函数在区间 $\left[ a , b \right]$ 上的增量.这就给定积分提供了一个有效而简便的计算方法，大大简化了定积分的计算手续

通常也把牛顿-莱布尼茨公式叫做微积分基本公式

例4.5 求 $\int_{0}^{1} x^{2} \mathrm{d}x.$

解易验证 $\frac{x^{3}}{3}$ 是 $x ^ { 2 }$ 的一个原函数，所以按牛顿-莱布尼茨微积分基本公式公式，有

$$\int_{0}^{1} x^{2}   dx = \left[ \frac{x^{3}}{3} \right]_{0}^{1} = \frac{1}{3}.$$

例4.6求 $\int_{\frac{1}{2}}^{1} x^3   dx$ 的值.

解易验证 $\frac{x^{4}}{4}$ 是 $x ^ { 3 }$ 的一个原函数，所以按牛顿-莱布尼茨公式，有

$$\int_{\frac{1}{2}}^{1} x^3   dx = \left[ \frac{x^4}{4} \right]_{\frac{1}{2}}^{1} = \frac{15}{64}.$$

例4.7求 $\int_{0}^{1} \frac{1}{1 + x^{2}}   dx$ 的值.

解 易验证 arctanx 是 $\frac{1}{1 + x^{2}}$ 的一个原函数，所以按牛顿-莱布尼茨公式，有

$$\int_{0}^{1} \frac{1}{1 + x^{2}} \mathrm{d}x = \left[ \arctan x \right]_{0}^{1} = \frac{\pi}{4}.$$

例4.8计算正弦曲线 $y = \sin x$ 在 $[ 0 , \pi ]$ 上与 $\mathcal { X }$ 轴所围成的平面图形(图4.8)的面积.

解这图形是曲边梯形的一个特例.它的面积

$$A = \int_{0}^{\pi} \sin x   dx.$$

易验证一cosx是sinx的一个原函数，所以按牛顿-莱布尼茨公式，有

$$A = \int_{0}^{\pi} \sin x   dx = \left[ -\cos x \right]_{0}^{\pi} = 2.$$

例4.9汽车以每小时36km速度行驶，到某处需要减速停车.设汽车以等加速度 $a=-5m/s^{2}$ 刹车.问从开始刹车到停车，汽车驶过了多少距离？

解 首先要算出从开始刹车到停车经过的时间.设开始刹车的时刻为 $t \equiv 0$此时汽车速度为

$$v_{0}=36\mathrm{km/h}=\frac{36\times1000}{3600}\mathrm{m/s}=10\mathrm{m/s}.$$

[page:107]

## 4.2 微积分基本公式

刹车后汽车减速行驶，其速度为

$$v(t) = v_0 + at = 10 - 5t.$$

当汽车停住时，速度 $v(t) = 0$ ,故由

$$v(t) = 10 - 5t = 0$$

解得

$$t = \frac{10}{5} = 2(s).$$

于是在这段时间内，汽车所驶过的距离为

$$s = \int_{0}^{2} v(t)   dt = \int_{0}^{2} (10 - 5t)   dt = \left[ 10t - \frac{5t^2}{2} \right]_{0}^{2} = 10   (m) .$$

例4.10求 $\lim_{n \to \infty} \left( \frac{1}{n+1} + \frac{1}{n+2} + \cdots + \frac{1}{n+n} \right)$

解将和式改写成

$$\frac{1}{n + 1} + \frac{1}{n + 2} + \cdots + \frac{1}{n + n} = \frac{1}{n}\left[ \frac{1}{1 + \frac{1}{n}} + \frac{1}{1 + \frac{2}{n}} + \cdots + \frac{1}{1 + \frac{n}{n}} \right].$$

上式可以看成是函数 $f(x) = \frac{1}{1 + x}$ 在[0,1]上的黎曼和

$$\sum_{i = 1}^{n} f(\xi_{i}) \Delta x_{i}, \quad \xi_{i} = \frac{i}{n}, \Delta x_{i} = \frac{1}{n}.$$

于是

$$\begin{aligned}\lim_{n \rightarrow \infty}\left( \frac{1}{n + 1} + \frac{1}{n + 2} + \cdots + \frac{1}{n + n} \right) &= \lim_{n \rightarrow \infty}\sum_{i = 1}^{n}\frac{1}{1 + \frac{i}{n}} \cdot \frac{1}{n} \\&= \int_{0}^{1}\frac{1}{1 + x}\mathrm{d}x = \left\lbrack \ln(1 + x) \right\rbrack_{0}^{1} = \ln 2.\end{aligned}$$

## 习题4.2

1. 试求函数 $y = \int_{0}^{x} \sin t   dt$ 当 $x = 0$ 及 $\bar{x} = \frac{\pi}{4}$ 时的导数.

2. 求由参数表达式 $x = \int_{0}^{t} \sin u   du, y = \int_{0}^{t} \cos u   du$ 所确定的函数对x的导数 $\frac{\mathrm{d}y}{\mathrm{d}x}.$

3. 求由 $\int_{0}^{y} \mathrm{e}^{t} \mathrm{d}t + \int_{0}^{x} \cos t \mathrm{d}t = 0$ 所决定的隐函数对x的导数 $\frac{\mathrm{d}y}{\mathrm{d}x}.$

4. 计算下列各导数:

(1) $\frac{\mathrm{d}}{\mathrm{d}x}\int_{0}^{x^{2}}\sqrt{1 + t^{2}}\mathrm{d}t;$ (2) $\frac{\mathrm{d}}{\mathrm{d}x}\int_{x^{2}}^{x^{3}}\frac{\mathrm{d}t}{\sqrt{1 + t^{4}}};$ (3) $\frac{\mathrm{d}}{\mathrm{d}x}\int_{\sin x}^{\cos x}\cos\left(\pi t^{2}\right)\mathrm{d}t$ (4) $\frac{\mathrm{d}}{\mathrm{d}x}\int_{a}^{b}\sin x^{2}\mathrm{d}x.$

5. 计算下列各定积分:

(1) $\int_{0}^{a} \left( 3x^{2} - x + 1 \right) \mathrm{d}x ;$ (2) $\int_{1}^{2} \left( x^{2} + \frac{1}{x^{4}} \right) \mathrm{d}x ;$ (3) $\int_{4}^{9} \sqrt{x} \left( 1 + \sqrt{x} \right) \mathrm{d}x;$

[page:108]

## 第4章 定积分与不定积分

(4) $\int_{ \frac{1}{\sqrt{3}} }^{ \sqrt{3} } \frac{\mathrm{d}x}{1 + x^2}$ (5) $\int_{-\frac{1}{2}}^{\frac{1}{2}} \frac{\mathrm{d}x}{\sqrt{1 - x^2}}$ (6) $\int_{0}^{\sqrt{3}a}\frac{\mathrm{d}x}{a^{2}+x^{2}};$ (7) $\int_{0}^{1} \frac{\mathrm{d}x}{\sqrt{4 - x^{2}}}$

(8) $\int_{- 1}^{0}\frac{3x^{4} + 3x^{2} + 1}{x^{2} + 1}\mathrm{d}x;$ (9) $\int_{-e-1}^{-2} \frac{\mathrm{d}x}{1 + x};$ (10) $\int_{0}^{\frac{\pi}{4}}\tan^{2}\theta\mathrm{d}\theta;$ (11) $\int_{0}^{2\pi} \left| \sin x \right| \mathrm{d}x;$

(12) $\int_{0}^{2} f(x)   dx$ 其中 $f(x)=\left\{\begin{aligned}&x+1, &x \leqslant 1, \\&\frac{1}{2}x^{2}, &x>1;\end{aligned}\right.$ (13) $\int_{0}^{\frac{a}{2}}\frac{\mathrm{d}x}{(x - a)(x - 2a)};$

(14) $\int_{\frac{\sinh 1}{\sqrt{1 + x^{2}}}}^{\frac{\sinh 2}{\sqrt{1 + x^{2}}}} \frac{\mathrm{d}x}{\sqrt{1 + x^{2}}}$

6. 求下列函数:

(1) $f(x) = \int_{0}^{x} \mathrm{sgn}  t \mathrm{d}t;$ (2) $f(x) = \int_{0}^{x} \left| t \right| \mathrm{d}t;$ (3) $f(x) = \int_{0}^{1} \left| x - t \right| \mathrm{d}t;$

(4) $f(x) = \int_{0}^{1} t \left| x - t \right|   dt.$

7. 设k为正整数.试证下列各题:

(1) $\int _ { - \pi } ^ { \pi } \cos k x   \mathrm{d}x = 0   ;$ (2) $\int_{-\pi}^{\pi} \sin kx   dx = 0;$ (3) $\int_{-\pi}^{\pi} \cos^2 kx   dx = \pi;$

(4) $\int_{-\pi}^{\pi} \sin^2 kx   dx = \pi.$

8. 设 $k \neq l$ 为两个正整数.证明:

(1) $\int _ { - \pi } ^ { \pi } \cos k x \sin k x   dx = 0 ;$ (2) $\int _ { - \pi } ^ { \pi } \cos k x \cos k x   dx = 0 ;$ (3) $\int _ { - \pi } ^ { \pi } \sin k x \sin k x   dx = 0 ,$

9. 设

$$f(x)=\left\{\begin{aligned}x^{2}, & \quad x \in[0,1), \\x, & \quad x \in[1,2].\end{aligned}\right.$$

求 $\Phi(x) = \int_{0}^{x} f(t)   dt$ 在[0,2]上的表达式，并讨论Φ(x)在(0,2)内的连续性

10.设

$$f(x)=\left\{\begin{aligned}&\frac{1}{2}\sin x, & 0 \leqslant x \leqslant \pi, \\ &0, & x<0  或  x>\pi.\end{aligned}\right.$$

求 $\Phi(x) = \int_{0}^{x} f(t)   dt$ 在 $( - \infty , + \infty )$ 内的表达式.

11. 用定积分求下列各和数的极限:

(1) $\lim_{n \to \infty} \left( \frac{n}{n^2 + 1^2} + \frac{n}{n^2 + 2^2} + \cdots + \frac{n}{n^2 + n^2} \right)$ (2) $\lim_{n \to \infty} \frac{1}{n} \left( \sin \frac{\pi}{n} + \sin \frac{2\pi}{n} + \cdots + \sin \frac{n-1}{n} \pi \right)$

(3) $\lim_{n \to \infty} \left( \sqrt{\frac{n + 1}{n^3}} + \sqrt{\frac{n + 2}{n^3}} + \cdots + \sqrt{\frac{n + n}{n^3}} \right)$ ; (4) $\lim_{n \to \infty} \frac{1^p + 2^p + \cdots + n^p}{n^{p+1}} (p > 0).$

12. 求极限 $\lim_{n \to \infty} \frac{1}{n^3} \left[ 1^2 + 3^2 + \cdots + (2n - 1)^2 \right]$

13. 证明下列极限:

(1) $\lim_{n \to \infty} \int_{0}^{1} \frac{x^n}{1 + x}   dx = 0;$ (2) $\lim_{n \to \infty} \int_{0}^{a} \sin^n x   dx = 0 \left( 0 < a < \frac{\pi}{2} \right)$ ; (3) $\lim_{n \to \infty} \int_{0}^{\frac{\pi}{2}} \sin^n x   dx = 0.$

[page:109]

## 4.3 不定积分的概念与性质

14. 设 $p > 0$ ，证明

$$\frac{p}{p + 1} < \int_{0}^{1} \frac{\mathrm{d}x}{1 + x^{p}} < 1.$$

15. 设函数 $f(x) , g(x)$ 在 $\left[ a , b \right]$ 上连续，证明

$$\left| \int_{a}^{b} f \cdot g \mathrm{d}x \right| \leqslant \sqrt{\int_{a}^{b} f^2 \mathrm{d}x} \cdot \sqrt{\int_{a}^{b} g^2 \mathrm{d}x}.$$

16. 设函数 $f(x) , g(x)$ 在 $\left[ a , b \right]$ 上连续，证明

$$\sqrt{\int_{a}^{b}(f + g)^{2}\mathrm{d}x} \leqslant \sqrt{\int_{a}^{b}f^{2}\mathrm{d}x} + \sqrt{\int_{a}^{b}g^{2}\mathrm{d}x}.$$

17. 设 $f(x)$ 在区间 $\left[ a , b \right]$ 上连续，且 $f(x) > 0$ 证明

$$\int_{a}^{b} f(x) \mathrm{d}x \cdot \int_{a}^{b} \frac{\mathrm{d}x}{f(x)} \geqslant (b - a)^{2}.$$

## 4.3 不定积分的概念与性质

由微积分基本公式知，计算定积分的关键在于求出被积函数的原函数.本节将研究如何求一个函数的原函数，给出求原函数的方法不定积分，它是求导运算的逆运算.

## 4.3.1 不定积分的概念

由4.2节知道，如果一个函数 $f(x)$ 有原函数，则 $f(x)$ 有无穷多个原函数，任意两个原函数之间相差一个常数.因此，只要求得 $f ( x )$ 的任一个原函数 $F(x)$ ，则$F(x) + C$ 就是 $f ( x )$ 的全部原函数(C为任意常数).

定义4.3 如果 $F(x)$ 是函数 $f ( x )$ 的一个原函数，称 $f(x)$ 的原函数全体为$f(x)$ 的不定积分，记作

$$\int f(x) \mathrm{d}x = F(x) + C,$$

其中C为任意常数；x为积分变量； $f ( x )$ 为被积函数； $f(x) \mathrm{d}x$ 为被积表达式； $\int$ 为积分号.

由定义知，求不定积分 $\int f(x)   dx$ 就是由一个函数的微分 $f(x) \mathrm{d}x$ 去求这个函数本身.因此，微分运算 $:" d"$ 与不定积分运算 $\left[ \begin{matrix} { \cdots } \\ { } \\ { } \\ \end{matrix} \right] ^ { \left( \begin{matrix} { } \\ { } \\ { } \\ { } \\ \end{matrix} \right) }$ ”构成了一对广义的逆运算

$$\mathrm{d}\left[\int f(x)\mathrm{d}x\right]=f(x)\mathrm{d}x\left\{ 即 \frac{\mathrm{d}}{\mathrm{d}x}\left[\int f(x)\mathrm{d}x\right]=f(x)\right\}$$

与

$$\int \mathrm{d}F(x) = F(x) + C.$$

[page:110]

## 第4章 定积分与不定积分

例4.11 求 $\int \frac{1}{x} \mathrm{d}x.$

解当 $x > 0$ 时，由于 $\left( \ln x \right)^{\prime} = \frac{1}{x}$ ，所以 $\operatorname { l n } \bar { x }$ 是 $\frac{1}{x}$ 在 $( 0 , + \infty )$ 内的一个原函数.因此，在 $(0, +\infty)$ 内

$$\int \frac{1}{x} \mathrm{d}x = \ln x + C.$$

当 $x < 0$ 时，由于 $\left[ \ln( - x) \right]' = \frac{1}{- x}( - 1) = \frac{1}{x}$ ，所以 $\ln(-x)$ 是 $\frac{1}{x}$ 在 $( - \infty , 0 )$内的一个原函数.因此，在 $( - \infty , 0 )$ 内

$$\int \frac{1}{x} \mathrm{d}x = \ln(-x) + C.$$

把在 $x > 0$ 及 $x < 0$ 内的结果合起来，可写作

$$\int \frac{1}{x} \mathrm{d}x = \ln |x| + C.$$

例4.12设曲线通过点(1,2)，且其上任一点处的切线斜率等于这点横坐标的两倍，求此曲线的方程

解设所求的曲线方程为 $y = f(x)$ ，由题设，曲线上任一点 $(x,y)$ 处的切线斜率为

$$\frac{\mathrm{d}y}{\mathrm{d}x} = 2x,$$

即 $f ( x )$ 是 $2 \bar { x }$ 的一个原函数.

因为

$$\int 2x\mathrm{d}x = x^{2} + C,$$

故必有某个常数C使 $f(x) = x^{2} + C$ ，即曲线方程为 $y = x^{2} + C.$ 因所求曲线通过点(1,2),故

$$2 = 1 + C, \quad C = 1.$$

于是所求曲线方程为

$$y = x^{2} + 1.$$

例4.13 质点以初速度 $\mathcal { D } _ { 0 }$ 铅直上抛，不计阻力，求它的运动规律.

解所谓运动规律，是指质点的位置关于时间t的函数关系.为表示质点的位置，取坐标系如下:把质点所在的铅直线取作坐标轴，指向朝上，轴与地面的交点取作坐标原点.设质点抛出时刻为 $t = 0$ ,当 $t = 0$ 时质点所在位置的坐标为 $\mathcal{X}_{0}$在时刻t时坐标为x(图4.9)， $x = x(t)$ 就是要求的函数.

[page:111]

## 4.3 不定积分的概念与性质

由导数的物理意义，知

$$\frac{\mathrm{d}x}{\mathrm{d}t} = v(t)$$

即为质点在时刻t时向上运动的速度，且

$$\frac{\mathrm{d}^{2} x}{\mathrm{d} t^{2}} = \frac{\mathrm{d} v}{\mathrm{d} t} = a(t)$$

即为质点在时刻t时向上运动的加速度.按题意，有 $a(t) = -g$ ,即

$$\frac{\mathrm{d}v}{\mathrm{d}t}=-g \quad  或  \quad \frac{\mathrm{d}^2 x}{\mathrm{d}t^2}=-g.$$

先求 v(t).由 $\frac{\mathrm{d}v}{\mathrm{d}t}=-g$ ,即v(t)是 $( - g )$ 的原函数，故

$$y(t) = \int (-g) \mathrm{d}t = -gt + C_1,$$

由 $v(0) = v_{0}$ ,得 ${ { v } _ { 0 } } { = } { { C } _ { 1 } }$ ，于是

$$v(t) = -gt + v_0.$$

再求x(t).由 $\frac{\mathrm{d}x}{\mathrm{d}t} = v(t)$ ,即 $x ( t )$ 是 $v ( t )$ 的原函数，故

$$x(t) = \int v(t)   dt = \int (-gt + v_0)   dt = -\frac{1}{2}gt^2 + v_0t + C_2,$$

由 $x(0)=x_{0}$ ,得 $x_{0} = C_{2}$ ，于是所求运动规律为

$$x = - \frac { 1 } { 2 } g t ^ { 2 } + v _ { 0 } t + x _ { 0 } , \quad t \in [ 0 , T ] ,$$

其中T表示质点落地的时刻.

## 4.3.2 基本积分表

由不定积分的定义，结合导数的基本公式，不难得到下面的基本积分:

(1) $\int k\mathrm{d}x = kx + C(k$ 是常数)；

(3) $\int \frac{1}{x} \mathrm{d}x = \ln |x| + C;$

$$\int \frac{\mathrm{d}x}{1 + x^{2}} = \arctan x + C;$$

$$\int \frac{\mathrm{d}x}{\sqrt{1 - x^{2}}} = \arcsin x + C;$$

(6) $\int \cos x \mathrm{d}x = \sin x + C;$

[page:112]

## 第4章 定积分与不定积分

(7) $\int \sin x \mathrm{d}x = -\cos x + C;$

$$\int \frac{\mathrm{d}x}{\cos^{2}x} = \int \sec^{2}x\mathrm{d}x = \tan x + C;$$

$$\int \frac{\mathrm{d}x}{\sin^{2}x} = \int \csc^{2}x\mathrm{d}x = -\cot x + C;$$

$$\int \sec x \tan x   dx = \sec x + C;$$

$$\int \csc x \cot x   dx = -\csc x + C;$$

$$\int a^{x} \mathrm{d}x = \frac{a^{x}}{\ln a} + C (a > 0, a \neq 1);$$

$$\int \mathrm{sh} x \mathrm{d} x = \mathrm{ch} x + C;$$

$$\int \mathrm{ch}x \mathrm{d}x = \mathrm{sh}x + C;$$

(15) $\int \frac{1}{\mathrm{ch}^2 x} \mathrm{d}x = \mathrm{th} x + C;$

$$\int \frac{1}{\mathrm{sh}^2 x} \mathrm{d}x = -\coth x + C.$$

## 4.3.3 不定积分的性质

根据不定积分的定义，可以推得如下两个性质:

性质4.6 设函数 $f ( x )$ 及 $g(x)$ 的原函数存在，则

$$\int \left[ f(x) + g(x) \right] \mathrm{d}x = \int f(x) \mathrm{d}x + \int g(x) \mathrm{d}x.$$

性质4.7 设函数 $f ( x )$ 的原函数存在，k为非零常数，则

$$\int kf(x) \mathrm{d}x = k\int f(x) \mathrm{d}x.$$

利用基本积分表以及不定积分的这两个性质，可以求出一些简单函数的不定积分.

例4.14 求 $\int \left( \sqrt{2} x^{3} - \mathrm{e}^{x} + 3 \sin x - \frac{5}{x} - \frac{2}{x^{2}} \right) \mathrm{d}x.$

解原式 $\begin{aligned}= & \sqrt{2}\int_{x^{3}}^{}\mathrm{d}x - \int_{x^{2}}^{}\mathrm{d}x + 3\int_{x}^{}\sin x\mathrm{d}x - 5\int_{x}^{}\mathrm{d}x - 2\int_{x}^{}\frac{1}{x^{2}}\mathrm{d}x \\= & \frac{\sqrt{2}}{4}x^{4} - \mathrm{e}^{x} - 3\cos x - 5\ln\left| x \right| + \frac{2}{x} + C.\end{aligned}$

例4.15求 $\int \left( 2^{x} - 3^{x} \right)^{2} \mathrm{d}x.$

[page:113]

## 4.3不定积分的概念与性质

解

$$\int \left[ \left( 2^{x} \right)^{2} - 2\left( 2^{x} \right) \cdot \left( 3^{x} \right) + \left( 3^{x} \right)^{2} \right] \mathrm{d}x = \int 4^{x} \mathrm{d}x - 2\int 6^{x} \mathrm{d}x + \int 9^{x} \mathrm{d}x \\= \frac{4^{x}}{\ln 4} - \frac{2}{\ln 6} \mathrm{e}^{x} + \frac{9^{x}}{\ln 9} + C.$$

例4.16求 $\int \tan^{2} x   dx;$

解

$$\begin{aligned} 原式  &= \int \left( \frac{1}{\cos^2 x} - 1 \right) \mathrm{d}x \\&= \int \frac{1}{\cos^2 x} \mathrm{d}x - \int 1 \mathrm{d}x \\&= \tan x - x + C.\end{aligned}$$

例4.17 求 $\int \frac{1}{\sin^{2}x \cdot \cos^{2}x}\mathrm{d}x.$

解

$$\int\frac{\sin^{2}x+\cos^{2}x}{\sin^{2}x\cos^{2}x}\mathrm{d}x=\int\sec^{2}x\mathrm{d}x+\int\csc^{2}x\mathrm{d}x$$

例4.18 求 $\int \frac{x^{2}}{1 + x^{2}} \mathrm{d}x$

解

$$\int \frac{\left( 1 + x^{2} \right) - 1}{1 + x^{2}}\mathrm{d}x = \int 1\mathrm{d}x - \int \frac{1}{1 + x^{2}}\mathrm{d}x = x - \arctan x + C.$$

习题4.3

1. 求下列不定积分:

(1) $\int \frac{\mathrm{d}x}{x^{2}};$ (2) $\int \left( x^{2} - 3x + 2 \right) \mathrm{d}x ;$ (3) $\int \left( x^{2} + 1 \right)^{2} \mathrm{d}x ;$ (4) $\int ( \sqrt{x} + 1 ) ( \sqrt{x^3} - 1 ) \mathrm{d}x;$

(5) $\int \frac{(1 - x)^2}{\sqrt{x}}   dx ;$ (6) $\int \left( 2 \mathrm{e}^{x} + \frac{3}{x} \right) \mathrm{d}x ;$ (7) $\int \left( \frac{3}{1 + x^{2}} - \frac{2}{\sqrt{1 - x^{2}}} \right) \mathrm{d}x ;$

(8) $\int \mathrm{e}^{x}\left(1-\frac{\mathrm{e}^{-x}}{\sqrt{x}}\right) \mathrm{d} x ;$ (9) $\int 3^{x} \mathrm{e}^{x} \mathrm{d}x ;$ (10) $\int \frac{2 \cdot 3^{x} - 5 \cdot 2^{x}}{3^{x}} \mathrm{d}x;$

[page:114]

## 第4章 定积分与不定积分

(11) $\int \sec x \left( \sec x - \tan x \right) \mathrm{d}x;$ (12) $\int \cos^{2} \frac{x}{2}   dx$ (13) $\int \frac{\mathrm{d}x}{1 + \cos 2x};$

(14) $\int \frac{\cos 2x}{\cos x - \sin x}   dx ;$ (15) $\int \frac{\cos 2x}{\cos^{2}x\sin^{2}x}\mathrm{d}x;$ (16) $\int \cot^{2}x\mathrm{d}x;$

(17) $\int \cos \theta ( \tan \theta + \sec \theta )   \mathrm{d}\theta;$ (18) $\int \frac{x^{2}}{x^{2} + 1}\mathrm{d}x;$ (19) $\int \frac{3x^{4} + 2x^{2}}{x^{2} + 1} \mathrm{d}x ;$

(20) $\int \sqrt{x \sqrt{x \sqrt{x}}}   dx$ (21) $\int\frac{\sqrt{x^{4}+2+x^{-4}}}{x^{4}}\mathrm{d}x;$ (22) $\int \mid x \mid \mathrm{d}x.$

2. 一曲线通过点 $(e^{2},3)$ ，且在任一点处的切线的斜率等于该点横坐标的倒数，求该曲线的方程.

3.一物体由静止开始运动，经 $t ( s )$ 后的速度是 $3t^{2}   (m/s)$ ，问:

(1)在3s后物体离开出发点的距离是多少？

(2)物体走完360m需要多少时间?

4. 证明函数 $\arcsin(2x - 1)$ $\arccos(1 - 2x)$ 和 $2\arctan\sqrt{\frac{x}{1 - x}}$ 都是 $\frac{1}{\sqrt{x - x^{2}}}$ 的原函数.

## 4.4 换元积分法

利用基本积分表与积分的性质，所能计算的不定积分是非常有限的，因此，有必要进一步来研究不定积分的求法.本节把复合函数的微分法反过来用于求不定积分，利用中间变量的代换，得到复合函数的积分法，称为换元积分法，简称换元法.

## 4.4.1 第一类换元法(凑微分法)

设 $f(u)$ 具有原函数 $F(u)$ ,即

$$F^{\prime}(u)=f(u),\quad \int f(u)\mathrm{d}u=F(u)+C.$$

如果u是中间变量，且 $u = \varphi(x)$ ,设 $\varphi ( x )$ 可微，则根据复合函数微分法，有

$$\mathrm{d}F\left[ \varphi (x) \right] = f\left[ \varphi (x) \right] \varphi ^{\prime}(x)\mathrm{d}x,$$

从而由不定积分的定义，得

$$\int f \left[ \varphi ( x ) \right] \varphi ^ { \prime } ( x ) \mathrm { d } x = F \left[ \varphi ( x ) \right] + C = \left[ \int f ( u ) \mathrm { d } u \right] _ { u = \varphi ( x ) } .$$

于是有下述定理:

定理4.6设 $f ( u )$ 具有原函数， $u = \varphi(x)$ 可导，则有换元公式

$$\int f \left[ \varphi ( x ) \right] \varphi ^ { \prime } ( x ) \mathrm { d } x = \left[ \int f ( u ) \mathrm { d } u \right] _ { u = \varphi ( x ) } ,$$

例4.19求 $\int 2\cos 2x\mathrm{d}x.$

[page:115]

## 4.4换元积分法

解

$$\int \cos 2x \cdot 2\mathrm{d}x = \int \cos 2x \cdot (2x)^{\prime} \mathrm{d}x \cdot \int \cos u \mathrm{d}u = \sin u + C = \sin 2x + C.$$

例4.20求 $\int \frac{1}{\sqrt{1 - 3x}}   dx.$

解

$$\begin{aligned} \text{3 } \quad &= - \frac{1}{3} \int \frac{1}{\sqrt{1 - 3x}} \mathrm{d}(1 - 3x) = - \frac{1}{3} \int \frac{1}{\sqrt{u}} \mathrm{d}u \\&= - \frac{2}{3} \sqrt{u} + C = - \frac{2}{3} \sqrt{1 - 3x} + C.\end{aligned}$$

例4.21 求 $\int \frac{1}{3 + 2x} \mathrm{d}x.$

解

$$\begin{aligned} &= \frac{1}{2}\int\frac{1}{3 + 2x}(3 + 2x)^{\prime}\mathrm{d}x = \frac{1}{2}\int\frac{1}{u}\mathrm{d}u \\&= \frac{1}{2}\ln\left| u \right| + C = \frac{1}{2}\ln\left| 3 + 2x \right| + C.\\ \end{aligned}$$

一般地，对于积分 $\int f(ax + b)   dx$ ，总可作变换 $u = a x + b$ ，把它化为

$$\int f(ax + b) \mathrm{d}x = \int \frac{1}{a} f(ax + b) \mathrm{d}(ax + b) = \frac{1}{a} \left[ \int f(u) \mathrm{d}u \right]_{u = ax + b}$$

例4.22求 $\int 2x\mathrm{e}^{x^{2}}\mathrm{d}x.$

解

$$\begin{aligned}&= \int \mathrm{e}^{x^{2}} \mathrm{d}(x^{2}) = \int \mathrm{e}^{u} \mathrm{d}u \\&= \mathrm{e}^{u} + C = \mathrm{e}^{x^{2}} + C.\end{aligned}$$

例4.23求 $\int x\sqrt{1 - x^{2}}\mathrm{d}x$

解

$$\begin{aligned}&=-\frac{1}{2}\int\sqrt{1-x^{2}}\mathrm{d}(1-x^{2})=-\frac{1}{2}\int\sqrt{u}\mathrm{d}u\\&=-\frac{1}{3}u^{\frac{3}{2}}+C=-\frac{1}{3}(1-x^{2})^{\frac{3}{2}}+C.\end{aligned}$$

例4.24求 $\int \frac{1}{a^{2} + x^{2}} \mathrm{d}x.$

[page:116]

## 第4章 定积分与不定积分

解

$$\begin{aligned}\frac{1}{a^{2}}\int\frac{1}{1+\left(\frac{x}{a}\right)^{2}}\mathrm{d}x&=\frac{1}{a}\int\frac{1}{1+\left(\frac{x}{a}\right)^{2}}\mathrm{d}\frac{x}{a}\\&=\frac{1}{a}\arctan\frac{x}{a}+C.\end{aligned}$$

例4.25求 $\int\frac{\mathrm{d}x}{\sqrt{a^{2}-x^{2}}}\left(a>0\right)$

解

$$\frac{1}{a}\int\frac{dx}{\sqrt{1-\left(\frac{x}{a}\right)^{2}}}=\int\frac{d\frac{x}{a}}{\sqrt{1-\left(\frac{x}{a}\right)^{2}}}=\frac{1}{a}\int\frac{dx}{\sqrt{1-\left(\frac{x}{a}\right)^{2}}}$$

例4.26求 $\int \frac{1}{x^{2} - a^{2}} \mathrm{d}x$

解

$$\frac{1}{2a}\left[\left(\frac{1}{x - a} - \frac{1}{x + a}\right)\mathrm{d}x - \frac{1}{2a}\left(\int\frac{1}{x - a}\mathrm{d}x - \int\frac{1}{x + a}\mathrm{d}x\right)\right] = \frac{1}{2a}\left[\int\frac{1}{x - a}\mathrm{d}(x - a) - \int\frac{1}{x + a}\mathrm{d}(x + a)\right] = \frac{1}{2a}\ln\left|\frac{x - a}{x + a}\right| + C.$$

例4.27求 $\int \sin^{3} x \mathrm{d}x.$

解

$$\int \sin ^{2}x\sin xdx=-\int \left ( 1-\cos ^{2}x \right ) \mathrm{d}\left ( \cos x \right ) ^{2} \mathrm{d}x=-\cos x+\frac{1}{3}\cos ^{3}x+C.$$

例4.28求 $\int \sin^{2}x\cos^{5}x\mathrm{d}x.$

解

$$\begin{aligned}\int \sin^{2} x \cos^{4} x \cos x \mathrm{d}x &= \int \sin^{2} x (1 - \sin^{2} x)^{2} \mathrm{d}(\sin x) \\= & \int (\sin^{2} x - 2\sin^{4} x + \sin^{6} x) \mathrm{d}(\sin x) \\= & \frac{1}{3} \sin^{3} x - \frac{2}{5} \sin^{5} x + \frac{1}{7} \sin^{7} x + C.\end{aligned}$$

[page:117]

## 4.4 换元积分法

例4.29求 $\int \tan x \mathrm{d}x.$

解

$$\int \frac{\sin x}{\cos x} \mathrm{d}x = -\int \frac{1}{\cos x} \mathrm{d}(\cos x) \cdot \int \frac{\cos x}{\cos x} \mathrm{d}(\cos x) \cdot \int \frac{\cos x}{\cos x} \mathrm{d}x = C.$$

类似可得

$$\int \cot x   dx = \ln |\sin x| + C.$$

例4.30求 $\int \cos ^{2}x\mathrm{d}x.$

解

$$\int \frac{1 + \cos 2x}{2} \mathrm{d}x = \frac{1}{2} \left( \int \mathrm{d}x + \int \cos 2x \mathrm{d}x \right) = \frac{1}{2} \int \mathrm{d}x + \frac{1}{4} \int \cos 2x \mathrm{d}(2x) \\= \frac{x}{2} + \frac{\sin 2x}{4} + C.$$

例4.31求 $\int \sin^{2}x\cos^{4}x\mathrm{d}x.$

解

$$\begin{aligned} &= \frac{1}{8}\int (1 - \cos 2x)(1 + \cos 2x)^2   dx \\&= \frac{1}{8}\int (1 + \cos 2x - \cos^2 2x - \cos^3 2x)   dx \\&= \frac{1}{8}\int (\cos 2x - \cos^3 2x)   dx + \frac{1}{8}\int (1 - \cos^2 2x)   dx \\&= \frac{1}{8}\int \sin^2 2x \cdot \frac{1}{2} \mathrm{d}(\sin 2x) + \frac{1}{8}\int \frac{1}{2} (1 - \cos 4x)   dx \\&= \frac{1}{48}\sin^3 2x + \frac{x}{16} - \frac{1}{64}\sin 4x + C.\\ \end{aligned}$$

例4.32求 $\int \sec^{6} x \mathrm{d}x.$

解

$$\int \left( \sec^{2}x \right)^{2}\sec^{2}x\mathrm{d}x = \int \left( 1 + \tan^{2}x \right)^{2}\mathrm{d}\left( \tan x \right)^{2}\mathrm{d}\left( \tan x \right)^{2}\mathrm{d}\left( \tan x \right)^{2}$$

[page:118]

## 第4章 定积分与不定积分

$$\tan x + \frac{2}{3}\tan^{3}x + \frac{1}{5}\tan^{5}x + C.$$

例4.33求 $\int \tan^{5} x \sec^{3}$ xdx.

解

$$\begin{aligned}\int \tan^{4} x \sec^{2} x \sec x \tan x   dx & \\= \int (\sec^{2} x - 1)^{2} \sec^{2} x   d(\sec x) & \\= \int (\sec^{6} x - 2\sec^{4} x + \sec^{2} x)   d(\sec x) & \\= \frac{1}{7} \sec^{7} x - \frac{2}{5} \sec^{5} x + \frac{1}{3} \sec^{5} x + C.\end{aligned}$$

例4.34求 $\int \csc x \mathrm{d}x$

解

$$\begin{aligned} 原式  &= \int \frac{\mathrm{d}x}{\sin x} = \int \frac{\mathrm{d}x}{2\sin \frac{x}{2}\cos \frac{x}{2}} \\&= \int \frac{\mathrm{d}\frac{x}{2}}{\tan \frac{x}{2}\cos^2 \frac{x}{2}} = \int \frac{\mathrm{d}\left( \tan \frac{x}{2} \right)}{\tan \frac{x}{2}} \\&= \ln \left| \tan \frac{x}{2} \right| + C.\end{aligned}$$

因为

$$\tan \frac{x}{2} = \frac{\sin \frac{x}{2}}{\cos \frac{x}{2}} = \frac{2\sin^{2} \frac{x}{2}}{\sin x} = \frac{1 - \cos x}{\sin x} = \csc x - \cot x,$$

所以上述不定积分又可表示为

$$\int \csc x   dx = \ln |\csc x - \cot x| + C.$$

例4.35求 $\int \sec x \mathrm{d}x;$

解 利用例4.34的结果，

$$\int \csc \left( x + \frac{\pi}{2} \right) \mathrm{d}\left( x + \frac{\pi}{2} \right) \mathrm{d}x = \ln \left| \csc \left( x + \frac{\pi}{2} \right) - \cot \left( x + \frac{\pi}{2} \right) \right| + C$$

[page:119]

## 4.4 换元积分法

例4.36求 $\int \cos 3x\cos 2x \mathrm{d}x.$

解

$$\begin{aligned} 原式  &= \frac{1}{2}\int (\cos x + \cos 5x)   dx \\&= \frac{1}{2}\left(\int \cos x   dx + \frac{1}{5}\int \cos 5x   d (5x)\right) \\&= \frac{1}{2}\sin x + \frac{1}{10}\sin 5x + C.\end{aligned}$$

由微积分基本公式知，对于定积分的计算，凑微分法或第一类换元法也同样适用.

例4.37 计算 $I = \int_{0}^{\frac{\pi}{2}} \cos^5 x \sin x   dx.$

解 $I = - \int_{0}^{\frac{\pi}{2}}\cos^{5}x\mathrm{d}\cos x = - \left.\frac{1}{6}\cos^{6}x\right|_{0}^{\frac{\pi}{2}} = \frac{1}{6}.$

例4.38 计算 $I = \int_{0}^{1} \left( \mathrm{e}^{x} - 1 \right)^{4} \mathrm{e}^{x} \mathrm{d}x.$

解 $I = \int_{0}^{1} \left( \mathrm{e}^{x} - 1 \right)^{4} \mathrm{d}\left( \mathrm{e}^{x} - 1 \right) = \left. \frac{1}{5} \left( \mathrm{e}^{x} - 1 \right)^{5} \right|_{0}^{1} = \frac{1}{5} \left( \mathrm{e} - 1 \right)^{5}.$

例4.39 计算 $\int_{0}^{\pi}\sqrt{\sin^{3}x-\sin^{5}x}\mathrm{d}x$

解

$$\begin{aligned}I = & \int_{0}^{\frac{\pi}{2}}\sin^{\frac{3}{2}}x\cos x\mathrm{d}x + \int_{\frac{\pi}{2}}^{\pi}\sin^{\frac{3}{2}}x(-\cos x)\mathrm{d}x \\= & \int_{0}^{\frac{\pi}{2}}\sin^{\frac{3}{2}}x\mathrm{d}\sin x - \int_{\frac{\pi}{2}}^{\pi}\sin^{\frac{3}{2}}x\mathrm{d}\sin x \\= & \left.\frac{2}{5}\sin^{\frac{5}{2}}x\right|_{0}^{\frac{\pi}{2}} - \left.\frac{2}{5}\sin^{\frac{5}{2}}x\right|_{\frac{\pi}{2}}^{\pi} = \frac{2}{5} - \left(-\frac{2}{5}\right) = \frac{4}{5}.\end{aligned}$$

## 4.4.2 第二类换元法

定理4.7 设 $x = \phi(t)$ 是单调的、可导的函数，并且 $\psi^{\prime}(t) \neq 0.$ 又设 $f[\psi(t)]\psi^{'}(t)$具有原函数，则有换元公式

[page:120]

## 第4章 定积分与不定积分

$$\int f ( x ) \mathrm { d } x = \left[ \int f \left[ \psi ( t ) \right] \psi ^ { \prime } ( t ) \mathrm { d } t \right] _ { t = \psi ^ { - 1 } ( x ) } ,$$

其中 $\psi^{-1}(x)$ 是 $x = \phi(t)$ 的反函数.

证设 $f[\psi(t)]\psi^{'}(t)$ 的原函数为 $\Phi(t)$ ,记 $\Phi \left[ \psi ^ { - 1 } ( x ) \right] = F ( x )$ ，利用复合函数及反函数的求导法则，得

$$F ^ { \prime } ( x ) = \frac { \mathrm { d } \Phi } { \mathrm { d } t } \cdot \frac { \mathrm { d } t } { \mathrm { d } x } = f \left[ \phi ( t ) \right] \phi ^ { \prime } ( t ) \cdot \frac { 1 } { \phi ^ { \prime } ( t ) } = f \left[ \phi ( t ) \right] = f ( x ) ,$$

即 $F(x)$ 是f(x)的原函数，所以有

$$\int f(x) \mathrm{d}x = F(x) + C = \phi[\psi^{-1}(x)] + C = \left[ \int f(\psi(t))\psi^{\prime}(t) \mathrm{d}t \right]_{t=\psi^{-1}(x)}$$

这就完成了定理的证明.

例4.40求 $\int \sqrt{a^{2}-x^{2}} \mathrm{d}x (a>0)$

解设 $x = a \sin t , - \frac{\pi}{2} < t < \frac{\pi}{2}$ ,那么

$$\sqrt{a^{2}-x^{2}}=\sqrt{a^{2}-a^{2}\sin^{2}t}=a\cos t, \quad \mathrm{d}x=a\cos t\mathrm{d}t,$$

所以

$$\int \sqrt{a^{2}-x^{2}} \mathrm{d}x=\int a\cos t \cdot a\cos t \mathrm{d}t=a^{2}\int \cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \quad \int a\cos ^{2}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \quad \int} \int a\int a\cos ^{2}t \cos \cos ^{2}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \int a\int \cos \cos ^{d}t \cos ^{2}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \int \int a\cos \cos ^{d}t \mathrm{d}t \int \cos \cos ^{2}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \mathrm{d}t \int \int a\cos \cos ^{d}t \cos \cos ^{2}t \mathrm$$

作辅助三角形(图4.10)可得

图 4.10

$$t = \arcsin \frac{x}{a}, \quad \sin t = \frac{x}{a}, \quad \cos t = \frac{\sqrt{a^{2} - x^{2}}}{a},$$

于是

$$\int \sqrt{a^{2}-x^{2}} \mathrm{d}x = \frac{a^{2}}{2} \arcsin \frac{x}{a} + \frac{1}{2} x \sqrt{a^{2}-x^{2}} + C.$$

例4.41求 $\int\frac{\mathrm{d}x}{\sqrt{x^{2}+a^{2}}}\left(a>0\right).$

解设 $x = a \tan t , - \frac{\pi}{2} < t < \frac{\pi}{2}$ ,那么

$$\sqrt{x^{2}+a^{2}}=\sqrt{a^{2}+a^{2}\tan^{2}t}=a\sqrt{1+\tan^{2}t}=a\sec t,\quad\mathrm{d}x=a\sec^{2}t\mathrm{d}t,$$

所以

$$\int\frac{\mathrm{d}x}{\sqrt{x^{2}+a^{2}}}=\int\frac{a\sec^{2}t}{a\sec t}\mathrm{d}t=\int\sec t\mathrm{d}t\\=\ln\left|\sec t+\tan t\right|+C.$$

作辅助三角形(图4.11)，可得

[page:121]

## 4.4 换元积分法

$$\sec t = \frac{\sqrt{x^{2} + a^{2}}}{a}$$

$$\mathrm{tan}t = \frac{x}{a},$$

于是

图4.11

$$\int \frac{\mathrm{d}x}{\sqrt{x^{2} + a^{2}}} = \ln\left( \frac{x}{a} + \frac{\sqrt{x^{2} + a^{2}}}{a} \right) + C = \ln\left( x + \sqrt{x^{2} + a^{2}} \right) + C.$$

例4.42求 $\int\frac{\mathrm{d}x}{\sqrt{x^{2}-a^{2}}}\left(a>0\right)$

解当 $x \gg \tilde { a }$ 时，设 $x = a \sec t, 0 < t < \frac{\pi}{2}$ ,那么

$$\sqrt{x^{2}-a^{2}}=\sqrt{a^{2}\sec^{2}t-a^{2}}=a\sqrt{\sec^{2}t-1}=a\tan t, \quad \mathrm{d}x=a\sec t\tan t\mathrm{d}t,$$

所以

$$\int\frac{\mathrm{d}x}{\sqrt{x^{2}-a^{2}}}=\int\frac{a\sec t\tan t}{a\tan t}\mathrm{d}t=\int\sec t\mathrm{d}t\\=\ln(\sec t+\tan t)+C.$$

作辅助三角形(图4.12)，可得 $\sec t = \frac{x}{a}, \tan t = \frac{\sqrt{x^{2} - a^{2}}}{a}$ ，于是

$$\int\frac{\mathrm{d}x}{\sqrt{x^{2}-a^{2}}}=\ln\left(\frac{x}{a}+\frac{\sqrt{x^{2}-a^{2}}}{a}\right)+C_{1}$$

当 $x < - a$ 时，令 $x = - u$ ,那么 $u \geq a$ ，由上段结果有

$$\begin{aligned}\int \frac{\mathrm{d}x}{\sqrt{x^{2}-a^{2}}} &= -\int \frac{\mathrm{d}u}{\sqrt{u^{2}-a^{2}}} = -\ln(u+\sqrt{u^{2}-a^{2}})+C \\&=-\ln(-x+\sqrt{x^{2}-a^{2}})+C=\ln(-x-\sqrt{x^{2}-a^{2}})+C.\end{aligned}$$

把在 $x > a$ 及 $x < - a$ 内的结果合起来，可写作

$$\int\frac{\mathrm{d}x}{\sqrt{x^{2}-a^{2}}}=\ln\left|x+\sqrt{x^{2}-a^{2}}\right|+C.$$

注 在例4.41中，也可用双曲代换 $x = a \mathrm{sh} t;$ 在例4.42中，也可用双曲代换$x = a \operatorname { c h } t .$

例4.43求 $\int\frac{\sqrt{a^{2}-x^{2}}}{x^{4}}\mathrm{d}x.$

解设 $x { \equiv } \frac { 1 } { t }$ ,那么 $\mathrm{d}x = - \frac{\mathrm{d}t}{t^{2}}$ ，于是

[page:122]

## 第4章 定积分与不定积分

$$\int \frac{\sqrt{a^{2} - x^{2}}}{x^{4}}\mathrm{d}x = \int \frac{\sqrt{a^{2} - \frac{1}{t^{2}}} \cdot \left( - \frac{\mathrm{d}t}{t^{2}} \right)}{\frac{1}{t^{4}}} \\= - \int \left( a^{2}t^{2} - 1 \right)^{\frac{1}{2}} \mid t \mid \mathrm{d}t,$$

当 $x > 0$ 时，有

$$\int \frac{\sqrt{a^{2} - x^{2}}}{x^{4}}\mathrm{d}x = - \frac{1}{2a^{2}}\int \left( a^{2}t^{2} - 1 \right)^{\frac{3}{2}}\mathrm{d}\left( a^{2}t^{2} - 1 \right) \\= - \frac{\left( a^{2}t^{2} - 1 \right)^{\frac{3}{2}}}{3a^{2}} + C = - \frac{\left( a^{2} - x^{2} \right)^{\frac{3}{2}}}{3a^{2}x^{3}} + C,$$

当 $x < 0$ 时，有相同的结果.

再把一些结果作为基本公式总结一下，有

$$\int \tan x \mathrm{d}x = -\ln |\cos x| + C;$$

$$\int \cot x   dx = \ln |\sin x| + C;$$

(19) ∫secxdx = ln| sec + tanx |+ C;

(20) $\int \csc x \mathrm{d}x = \ln |\csc x - \cot x| + C;$

$$\int \frac{dx}{a^{2} + x^{2}} = \frac{1}{a}\arctan\frac{x}{a} + C (a \neq 0);$$

$$\int \frac{\mathrm{d}x}{x^{2} - a^{2}}\mathrm{d}x = \frac{1}{2a}\ln\left| \frac{x - a}{x + a} \right| + C(a \neq 0);$$

$$\int\frac{dx}{\sqrt{a^{2}-x^{2}}}=\arcsin\frac{x}{a}+C(a\neq0);$$

$$\int \frac{dx}{\sqrt{x^{2} + a^{2}}} = \ln(x + \sqrt{x^{2} + a^{2}}) + C;$$

$$\int \frac{\mathrm{d}x}{\sqrt{x^{2} - a^{2}}} = \ln \left| x + \sqrt{x^{2} - a^{2}} \right| + C.$$

例4.44计算 $\int_{0}^{\frac{\sqrt{2}}{2}}\frac{1}{\left(1-x^{2}\right)^{3/2}}\mathrm{d}x.$

解设 $x = \sin t,t \in \left[ - \frac{\pi}{2},\frac{\pi}{2} \right],\mathrm{d}x = \cos t\mathrm{d}t$ ,则

$$\int\frac{1}{\left( 1 - x^{2} \right)^{3/2}}\mathrm{d}x = \int\frac{\cos t}{\cos^{3}t}\mathrm{d}t = \int\sec^{2}t\mathrm{d}t = \tan t + C.$$

[page:123]

## 4.4 换元积分法

根据微积分基本公式，得

$$I = \left. \frac{x}{\sqrt{1 - x^{2}}} \right|_{0}^{\frac{\sqrt{2}}{2}} = 1.$$

在本题的计算过程中，如果直接对定积分进行换元，化为新变量下的定积分，可以避免从变量t回代成变量x的弯路，运算比较简洁.事实上，当 $x = 0$ 时， $t = 0$当 $x = \frac{\sqrt{2}}{2}$ 时， $t = \frac{\pi}{4}$ ,则

$$I = \int_{0}^{\frac{\pi}{4}} \sec^{2} t   dt = \tan t \Big|_{0}^{\frac{\pi}{4}} = 1.$$

很自然的问题是这种思想对一般的定积分计算是否仍然成立.为此给出定积分的第二类换元法

定理4.8 设 $f ( x )$ 在 $\left[ a , b \right]$ 上连续，作变换 $x = \varphi(t)$ ,其中 $\varphi ( t )$ 满足

(1) $\varphi \left ( \alpha  \right ) = a , \varphi \left ( \beta  \right ) = b$ ，且当 $t \in [\alpha, \beta]$ 时， $\varphi(t) \in [a,b]$

(2) $\varphi ( t )$ 在 $[ \alpha , \beta ]$ 上具有连续导数，则

$$\int _ { a } ^ { b } f ( x ) \mathrm { d } x = \int _ { a } ^ { \beta } f [ \varphi ( t ) ] \varphi ^ { \prime } ( t ) \mathrm { d } t.$$

证由于 $f ( x )$ 在 $\left[ a , b \right]$ 上连续， $f[\varphi(t)]\varphi^{'}(t)$ 在 $[ \alpha , \beta ]$ 上连续，因此公式等号两边的定积分存在.故可设 $f ( x )$ 在 $[ a , b ]$ 上的一个原函数为 $F(x)$ ,这时

$$\frac{\mathrm{d}F\left[\varphi(t)\right]}{\mathrm{d}t}=F^{\prime}\left[\varphi(t)\right]\varphi^{\prime}(t)=f\left[\varphi(t)\right]\varphi^{\prime}(t).$$

这说明 $F [ \varphi ( t ) ]$ 是 $f[\varphi(t)]\varphi^{'}(t)$ 在 $[ \alpha , \beta ]$ 上的原函数.由微积分基本公式，得

$$\int _ { a } ^ { b } f ( x ) \mathrm { d } x = F ( b ) - F ( a ) = F [ \varphi ( \beta ) ] - F [ \varphi ( a ) ] = \int _ { a } ^ { \beta } f [ \varphi ( t ) ] \varphi ^ { \prime } ( t ) \mathrm { d } t,$$

故换元公式成立.

例4.45计算 $I = \int_{4}^{9} \frac{1}{\sqrt{x} - 1}   dx.$

解设 $\sqrt{x} = t, \mathrm{d}x = 2t\mathrm{d}t$ ,当 $x = 4$ 时， $t = 2; x = 9$ 时， $t = 3$ ,故

$$\int_{2}^{3} \frac{2t}{t - 1} \mathrm{d}t = \int_{2}^{3} \left( 2 + \frac{2}{t - 1} \right) \mathrm{d}t = \left[ 2t + 2\ln(t - 1) \right] |_{2}^{3} = 2 + \ln 4.$$

例4.46证明:

(1) 若 $f(x)$ 在 $\left[ -a, a \right]$ 上是连续的偶函数，则

$$\int_{-a}^{a} f(x)   dx = 2 \int_{0}^{a} f(x)   dx;$$

(2) 若 $f ( x )$ 在 $\left[ -a, a \right]$ 上是连续的奇函数，则

$$\int_{-a}^{a} f(x)   dx = 0.$$

证因为

[page:124]

## 第4章 定积分与不定积分

$$\int _ { - a } ^ { a } f ( x ) \mathrm { d } x = \int _ { - a } ^ { 0 } f ( x ) \mathrm { d } x + \int _ { 0 } ^ { a } f ( x ) \mathrm { d } x ,$$

对积分 $\int_{-a}^{0} f(x)   dx$ 作代换 $x = - t$ ,得

$$\int_{-a}^{0} f(x)   dx = -\int_{a}^{0} f(-t)   dt = \int_{0}^{a} f(-t)   dt = \int_{0}^{a} f(-x)   dx.$$

于是

$$\int_{-a}^{a} f(x) \mathrm{d}x = \int_{0}^{a} f(-x) \mathrm{d}x + \int_{0}^{a} f(x) \mathrm{d}x = \int_{0}^{a} \left[ f(x) + f(-x) \right] \mathrm{d}x.$$

(1)若f(x)是偶函数，则

$$f(x) + f(-x) = 2f(x)$$

从而

$$\int_{-a}^{a} f(x)   dx = 2 \int_{0}^{a} f(x)   dx.$$

(2)若f(x)是奇函数，则

$$f(x) + f(-x) = 0,$$

从而

$$\int_{-a}^{a} f(x)   dx = 0.$$

例4.47 若f(x)在[0,1]上连续，证明:

(1) $\int_{0}^{\frac{\pi}{2}} f(\sin x)   dx = \int_{0}^{\frac{\pi}{2}} f(\cos x)   dx;$ 44

$$\int_{0}^{\pi}xf(\sin x)\mathrm{d}x = \frac{\pi}{2}\int_{0}^{\pi}f(\sin x)\mathrm{d}x.$$

证（1）设 $x = \frac{\pi}{2} - t$ ,则 $\mathrm{d}x = -\mathrm{d}t$ ，且当 $x = 0$ 时， $t = \frac{\pi}{2}$ ;当 $x = \frac{\pi}{2}$ 时， $t = 0$于是

$$\int_{0}^{\frac{\pi}{2}}f\left( \sin x \right)dx = - \int_{\frac{\pi}{2}}^{0}f\left\lbrack \sin\left( \frac{\pi}{2} - t \right) \right\rbrack dt = \int_{0}^{\frac{\pi}{2}}f\left( \cos t \right)dt = \int_{0}^{\frac{\pi}{2}}f\left( \cos x \right)dx.$$

(2) 设 $x = \pi - t$ ,则 $\mathrm{d}x = -\mathrm{d}t$ ，且当 $x = 0$ 时， $t = \pi;$ 当 $x = \pi$ 时， $\bar { t } { = } 0 .$ 于是

$$\begin{aligned}\int_{0}^{\pi}xf(\sin x)\mathrm{d}x &= -\int_{\pi}^{0}(\pi - t)f[\sin(\pi - t)]\mathrm{d}t \\&= \int_{0}^{\pi}(\pi - t)f(\sin t)\mathrm{d}t \\&= \pi\int_{0}^{\pi}f(\sin t)\mathrm{d}t - \int_{0}^{\pi}tf(\sin t)\mathrm{d}t \\&= \pi\int_{0}^{\pi}f(\sin x)\mathrm{d}x - \int_{0}^{\pi}xf(\sin x)\mathrm{d}x,\end{aligned}$$

所以

[page:125]

## 4.4 换元积分法

$$\int_{0}^{\pi}xf(\sin x)\mathrm{d}x = \frac{\pi}{2}\int_{0}^{\pi}f(\sin x)\mathrm{d}x.$$

例4.48 计算 $\int_{0}^{\pi}\frac{x\sin x}{1 + \cos^{2}x}\mathrm{d}x.$

解

$$\begin{aligned}\int_{0}^{\pi}\frac{x\sin x}{1 + \cos^{2}x}\mathrm{d}x &= \frac{\pi}{2}\int_{0}^{\pi}\frac{\sin x}{1 + \cos^{2}x}\mathrm{d}x = -\frac{\pi}{2}\int_{0}^{\pi}\frac{\mathrm{d}(\cos x)}{1 + \cos^{2}x} \\&= -\frac{\pi}{2}\left[\arctan(\cos x)\right]_{0}^{\pi} \\&= -\frac{\pi}{2}\left(-\frac{\pi}{4} - \frac{\pi}{4}\right) = \frac{\pi^{2}}{4}.\end{aligned}$$

例4.49 设 $f(x)$ 是连续的周期函数，周期为 $T ,$ 证明:

(1) $\int_{a}^{a + T} f(x) \mathrm{d}x = \int_{0}^{T} f(x) \mathrm{d}x$

(2) $\int_{a}^{a + nT} f(x)   dx = n \int_{0}^{T} f(x)   dx (n \in \mathbf{N}).$

证(1) $\int_{a}^{a + T}f(x)\mathrm{d}x = \int_{a}^{0}f(x)\mathrm{d}x + \int_{0}^{T}f(x)\mathrm{d}x + \int_{T}^{a + T}f(x)\mathrm{d}x,$

设 $x = t + T$ ,则 $\mathrm{d}x = \mathrm{d}t$ ，且当 $x = T$ 时， $t = 0$ ;当 $x = a + T$ 时， $t = a$ 于是

$$\int_{T}^{a + T}f(x)\mathrm{d}x = \int_{0}^{a}f(t + T)\mathrm{d}t = \int_{0}^{a}f(t)\mathrm{d}t = - \int_{a}^{0}f(x)\mathrm{d}x,$$

所以

$$\int_{a}^{a + T} f(x)   dx = \int_{0}^{T} f(x)   dx.$$

$$\int_{a}^{a + nT} f(x)   dx = \sum_{k=0}^{n-1} \int_{a + kT}^{a + kT + T} f(x)   dx = n \int_{0}^{T} f(x)   dx  .$$

例4.50 计算 $\int_{0}^{n\pi}\sqrt{1+\sin 2x}\mathrm{d}x.$

解由于 $\sqrt{1 + \sin 2x}$ 是以 $\pi$ 为周期的周期函数，所以

$$\begin{aligned}\int_{0}^{n\pi} \sqrt{1 + \sin 2x}   dx &= n\int_{0}^{\pi} \sqrt{1 + \sin 2x}   dx = n\int_{0}^{\pi} \left| \sin x + \cos x \right|   dx \\&= \sqrt{2}n\int_{0}^{\pi} \left| \sin \left( x + \frac{\pi}{4} \right) \right|   dx = \sqrt{2}n\int_{\frac{\pi}{4}}^{\frac{\pi}{4}} \left| \sin t \right|   dt \\&= \sqrt{2}n\int_{0}^{\pi} \left| \sin t \right|   dt = \sqrt{2}n\int_{0}^{\pi} \sin t   dt = 2\sqrt{2}n.\end{aligned}$$

第二类换元法(续)

[page:126]

## 第4章 定积分与不定积分

## 习题4.4

1. 求下列不定积分:

(1) $\int \mathrm{e}^{5t}   \mathrm{d}t   ;$ (2) $\int (3 - 2x)^{3}   dx;$ (3) $\int \frac{\mathrm{d}x}{1 - 2x};$ (4) $\int\frac{\mathrm{d}x}{\sqrt[3]{2 - 3x}};$

(5) $\int \left( \sin ax - \mathrm{e}^{\frac{x}{b}} \right) \mathrm{d}x ;$ (6) $\int \frac{\sin \sqrt{t}}{\sqrt{t}} \mathrm{d}t ;$ (7) $\int x\mathrm{e}^{-x^{2}}\mathrm{d}x;$ (8) $\int x\cos(x^{2})\mathrm{d}x;$

(9) $\int\frac{x}{\sqrt{2 - 3x^{2}}}\mathrm{d}x;$ (10) $\int \frac{3x^{3}}{1 - x^{4}}\mathrm{d}x;$ (11) $\int\frac{x + 1}{x^{2} + 2x + 5}\mathrm{d}x;$

(12) $\int \cos ^ { 2 } \left( \omega t + \varphi \right) \sin \left( \omega t + \varphi \right) \mathrm{d}t ;$ (13) $\int \frac{\sin x}{\cos^{3}x} \mathrm{d}x;$ (14) $\int\frac{\sin x+\cos x}{\sqrt[3]{\sin x-\cos x}}\mathrm{d}x;$

(15) $\int \tan ^{10} x \cdot \sec ^{2} x \mathrm{d}x;$ (16) $\int \frac{\mathrm{d}x}{x \ln x \ln \ln x};$ (17) $\int\frac{\mathrm{d}x}{\left( \arcsin x \right)^{2}\sqrt{1 - x^{2}}}$

(18) $\int\frac{10^{2\arccos x}}{\sqrt{1 - x^{2}}}\mathrm{d}x;$ (19) $\int \tan \sqrt{1 + x^{2}} \cdot \frac{x \mathrm{d}x}{\sqrt{1 + x^{2}}};$ (20) $\int\frac{\arctan\sqrt{x}}{\sqrt{x}(1 + x)}\mathrm{d}x;$

(21) $\int \frac{1 + \ln x}{(x \ln x)^2}   dx;$ (22) $\int \frac{\mathrm{d}x}{\sin x \cos x};$ (23) $\int \frac{\ln \tan x}{\cos x \sin x}   dx;$ (24) cos³xdx;

(25) $\int \cos ^ { 2 } \left( \omega t + \varphi \right) \mathrm{d}t ;$ (26) sin2xcos3xdx; (27) cosxcos x dx; 2

(28) $\int \sin 5x\sin 7x\mathrm{d}x;$ (29) $\int \tan ^{3}x\sec x\mathrm{d}x ;$ (30) $\int \frac{\mathrm{d}x}{\mathrm{e}^{x} + \mathrm{e}^{- x}}$ (31) $\int\frac{1 - x}{\sqrt{9 - 4x^{2}}}\mathrm{d}x;$

(32) $\int \frac{x^{3}}{9 + x^{2}}\mathrm{d}x$ (33) 2,d − 1; (34) $\int\frac{\mathrm{d}x}{(x + 1)(x - 2)};$

(35) $\int \frac{x}{x^{2} - x - 2} \mathrm{d}x;$ (36) $\int\frac{x^{2}\mathrm{d}x}{\sqrt{a^{2}-x^{2}}}\left(a>0\right); \quad (37) \int\frac{\mathrm{d}x}{x\sqrt{x^{2}-1}};$

(38) $\int\frac{\mathrm{d}x}{\sqrt{\left(x^{2}+1\right)^{3}}}$ (39) $\int\frac{\sqrt{x^{2}-9}}{x}\mathrm{d}x;$ (40) $\int \frac{\mathrm{d}x}{1 + \sqrt{2x}};$ (41) dx ; 1+√1−x2

(42) $\int\frac{\mathrm{d}x}{x+\sqrt{1-x^{2}}}$ (43) $\int\frac{x - 1}{x^{2} + 2x + 3}\mathrm{d}x;$ (44) $\int\frac{x^{3} + 1}{\left( x^{2} + 1 \right)^{2}}\mathrm{d}x;$ (45) $\int \frac{\mathrm{d}x}{\mathrm{e}^{x} - \mathrm{e}^{- x}}$

(46) $\int \frac{x}{(1 - x)^{3}} \mathrm{d}x;$ (47) Q6 22 dx(a> 0); (48) $\int \frac{1 + \cos x}{x + \sin x} \mathrm{d}x$

(49) $\int \frac{\sin x \cos x}{1 + \sin^4 x}   dx$ (50) $\int \tan^{4} x \mathrm{d}x;$ (51) sinxsin2xsin3xdx;

(52) $\int \frac{\mathrm{d}x}{x\left ( x^{6} + 4 \right ) } ;$ (53) $\int\sqrt{\frac{a + x}{a - x}}\mathrm{d}x(a > 0)$ (54) $\int\frac{\mathrm{d}x}{\sqrt{x(1 + x)}};$

(55) $\int \frac{\mathrm{d}x}{\sqrt{1 + \mathrm{e}^{x}}}$ (56) $\int \frac{\mathrm{d}x}{x^{2}\sqrt{x^{2}-1}}$ (57) $\int \frac{\mathrm{d}x}{\left( a^{2} - x^{2} \right)^{5/2}};$ (58) $\int \frac{\mathrm{d}x}{x^{4} \sqrt{1 + x^{2}}}$

(59) $\int \frac{\sin^{2}x}{\cos^{3}x}\mathrm{d}x;$ (60) $\int \frac{\sqrt{1 + \cos x}}{\sin x}   dx ;$ (61) $\int \frac{x^{3}}{\left ( 1 + x^{8} \right ) ^{2}}\mathrm{d}x;$ (62) $\int \frac{x^{11}}{x^8 + 3x^4 + 2} \mathrm{d}x;$

[page:127]

## 4.4 换元积分法

$$\int \frac{\mathrm{d}x}{16 - x^{4}}; \quad (64) \int \frac{\sin x}{1 + \sin x}\mathrm{d}x; \quad (65) \int \frac{\sqrt[3]{x}}{x(\sqrt{x} + \sqrt[3]{x})}\mathrm{d}x; \quad (66) \int \frac{\mathrm{d}x}{(1 + \mathrm{e}^{x})^{2}};$$

$$\int \frac{\mathrm{e}^{2x} + \mathrm{e}^{x}}{\mathrm{e}^{2x} - \mathrm{e}^{2x} + 1} \mathrm{d}x; \quad (68) \int \frac{1}{2x + 5} \mathrm{d}x; \quad (69) \int (3x - 1)^{100} \mathrm{d}x; \quad (70) \int \frac{\mathrm{d}x}{(2x + 11)^{5/2}};$$

$$\int \frac{\mathrm{d}x}{2 + 3x^{2}}; \quad (72) \int \frac{\mathrm{d}x}{\sqrt{2 - 5x^{2}}}; \quad (73) \int \frac{\mathrm{d}x}{\sqrt{x(1 - x)}}; \quad (74) \int \frac{\mathrm{e}^{x}}{2 + \mathrm{e}^{x}}\mathrm{d}x;$$

$$\int \frac{\mathrm{d}x}{\mathrm{ch}x}; \quad (76) \int \frac{\mathrm{d}x}{\mathrm{sh}x}; \quad (77) \int \frac{\ln^2 x}{x} \mathrm{d}x; \quad (78) \int \frac{\mathrm{d}x}{1 + \cos x}; \quad (79) \int \frac{\mathrm{d}x}{1 - \sin x};$$

$$\int \frac{x^{2}\mathrm{d}x}{\left ( 8x^{2} + 27 \right ) ^{3/2}}; \quad (81) \int \frac{1 + x}{1 - x}\mathrm{d}x; \quad (82) \int \frac{\mathrm{d}x}{\left ( x - 1 \right ) \left ( x - 3 \right ) }; \quad (83) \int \frac{\mathrm{d}x}{x^{2} + x - 2};$$

$$\int \frac{\mathrm{d}x}{2 + \mathrm{e}^{2x}}; \quad (85) \int \frac{\tan \sqrt{x}}{\sqrt{x}} \mathrm{d}x; \quad (86) \int \frac{x^{14}}{(x^5 + 1)^4} \mathrm{d}x; \quad (87) \int \frac{x^{2n - 1}}{x^n - 1} \mathrm{d}x;$$

$$\int \frac{\mathrm{d}x}{x\left ( x^{n} + a \right ) } \left ( a \neq 0 \right ) ; \quad \left ( 89 \right ) \int \frac{\ln\left ( x + 1 \right ) - \ln x}{x\left ( x + 1 \right ) } \mathrm{d}x ; \quad \left ( 90 \right ) \int \frac{1}{x^{2} - a^{2}}\mathrm{d}x ;$$

$$\int \frac{x \mathrm{d}x}{\sqrt{a^{2} - x^{2}}}; \quad (32) \int \frac{\ln x}{x \sqrt{1 + \ln x}} \mathrm{d}x; \quad (93) \int \frac{\mathrm{d}x}{x^{4} \sqrt{x^{2} + a^{2}}}; \quad (94) \int \frac{\mathrm{d}x}{x^{2} \sqrt{a^{2} - x^{2}}};$$

$$\int \frac{\sqrt{a^{2} - x^{2}}}{x}\mathrm{d}x; \quad (96) \int \frac{\sqrt{x^{2} + a^{2}}}{x}\mathrm{d}x; \quad (97) \int \frac{\mathrm{d}x}{x\sqrt{x^{2} + a^{2}}}; \quad (98) \int \frac{\mathrm{d}x}{x\sqrt{x^{2} - a^{2}}};$$

$$\int \frac{x^{2}}{\sqrt{a^{2} - x^{2}}}\mathrm{d}x ; \quad (100)\int \frac{x^{2}\mathrm{d}x}{\sqrt{1 + x^{2}}} ; \quad (101)\int \frac{\mathrm{d}x}{\sqrt{1 + \mathrm{e}^{2x}}} ; \quad (102)\int \frac{\mathrm{e}^{2x}}{\sqrt{\mathrm{e}^{x} + 1}}\mathrm{d}x ;$$

$$\int \frac{\mathrm{d}x}{\sqrt{5 + x - x^{2}}}; \quad (104) \int \sqrt{2 + x - x^{2}}\mathrm{d}x; \quad (105) \int \frac{x\mathrm{d}x}{\sqrt{4x - x^{2}}};$$

$$\int \frac{\mathrm{d}x}{\sqrt{x^{2} - 2x + 10}}; \quad (107) \int \frac{x + 1}{\sqrt{x^{2} + x + 1}}\mathrm{d}x.$$

2. 计算下列定积分:

(1) $\int_{ \frac{\pi}{3} }^{ \pi } \sin\left(x + \frac{\pi}{3}\right) \mathrm{d}x;$ (2) $\int_{-2}^{1} \frac{\mathrm{d}x}{(11 + 5x)^3};$ (3) $\int_{0}^{\frac{\pi}{2}}\sin\varphi\cos^{3}\varphi\mathrm{d}\varphi;$

(4) $\int_{0}^{\pi} \left( 1 - \sin^{3} \theta \right) \mathrm{d}\theta;$ (5) $\int_{\frac{\pi}{6}}^{\frac{\pi}{2}}\cos^{2}u\mathrm{d}u;$ (6) $\int_{0}^{\sqrt{2}}\sqrt{2 - x^{2}}\mathrm{d}x;$

(7) $\int_{-\sqrt{2}}^{\sqrt{2}} \sqrt{8 - 2y^2}   dy;$ (8) $\int_{\frac{1}{\sqrt{2}}}^{1}\frac{\sqrt{1 - x^{2}}}{x^{2}}\mathrm{d}x;$ (9) $\int_{0}^{a} x^{2} \sqrt{a^{2} - x^{2}}   dx \quad (a > 0)$

(10) $\int_{1}^{\sqrt{3}}\frac{\mathrm{d}x}{x^{2}\sqrt{1 + x^{2}}}$ (11) $\int_{-1}^{1} \frac{x   dx}{\sqrt{5 - 4x}}$ (12) $\int_{1}^{4}\frac{\mathrm{d}x}{1 + \sqrt{x}};$

(13) $\int_{\frac{3}{4}}^{1} \frac{\mathrm{d}x}{\sqrt{1 - x} - 1}$ (14) $\int_{0}^{\sqrt{2}a}\frac{x\mathrm{d}x}{\sqrt{3a^{2}-x^{2}}}(a>0);$ (15) $\int_{0}^{1} t \mathrm{e}^{\frac{t^{2}}{2}} \mathrm{d}t ;$ 一一

(16) $\int_{1}^{\mathrm{e}^{2}} \frac{\mathrm{d}x}{x \sqrt{1 + \ln x}}$ (17) $\int_{-2}^{0} \frac{(x + 2)   dx}{x^2 + 2x + 2}$ (18) $\int_{0}^{2} \frac{x \mathrm{d}x}{\left(x^{2}-2 x+2\right)^{2}};$

(19) $\int_{-\pi}^{\pi} x^{4} \sin x   dx ;$ (20) $\int_{-\frac{\pi}{2}}^{\frac{\pi}{2}} 4\cos^4\theta \mathrm{d}\theta;$ (21) $\int_{-\frac{1}{2}}^{\frac{1}{2}}\frac{\left(\arcsin x\right)^{2}}{\sqrt{1-x^{2}}}\mathrm{d}x;$

(22) $\int_{-5}^{5} \frac{x^{3}\sin^{2}x}{x^{4} + 2x^{2} + 1}\mathrm{d}x;$ (23) $\int_{-\frac{\pi}{2}}^{\frac{\pi}{2}} \cos x \cos 2x \mathrm{d}x ;$ (24) $\int _ { - \frac { \pi } { 2 } } ^ { \frac { \pi } { 2 } } \sqrt { \cos x - \cos ^ { 3 } x } \mathrm { d } x ;$

[page:128]

## 第4章 定积分与不定积分

$$\int_{0}^{\pi}\sqrt{1 + \cos 2x}\mathrm{d}x; \quad (26) \int_{0}^{2\pi}\left| \sin(x + 1) \right|\mathrm{d}x; \quad (27) \int_{0}^{\frac{\pi}{4}}\ln(1 + \tan x)\mathrm{d}x;$$

$$\int_{0}^{a}\frac{\mathrm{d}x}{x + \sqrt{a^{2} - x^{2}}} \quad (a > 0); \quad \int_{0}^{\frac{\pi}{2}}\sqrt{1 - \sin 2x}\mathrm{d}x; \quad (30) \int_{0}^{\frac{\pi}{2}}\frac{\mathrm{d}x}{1 + \cos^{2}x};$$

(31) $\int_{0}^{\pi}x\sqrt{\cos^{2}x-\cos^{4}x}\mathrm{d}x;$ (32) $\int_{0}^{x} \max\{t^{3}, t^{2}, 1\}   dt ;$ (33) C1 x(2− x2)12dx;

(34) $\int_{-1}^{1} \frac{x \mathrm{d}x}{x^2 + x + 1}$ (35) sinxsin2xsin3xdx; (36) |1−x|dx; 0

(37) $\int_{0}^{2} f(x)   dx$ ,其中 $f(x)=\left\{\begin{aligned} & x^{2}, & 0 \leqslant x \leqslant 1, \\ & 2-x, & 1 < x \leqslant 2; \end{aligned}\right.$

$$\int_{0}^{2} x \mid x - a \mid \mathrm{d}x (0 < a < 2); \quad (39) \int_{-2}^{2} \mid x^2 - 1 \mid \mathrm{d}x;$$

$$\int_{- 5}^{5}\frac{x^{3}\sin^{2}x}{x^{4} + x^{2} + 1}\mathrm{d}x ; \quad (41) \int_{0}^{a}\frac{x^{2}\mathrm{d}x}{\sqrt{a^{2} - x^{2}}} ; \quad (42) \int_{0}^{1}\frac{\mathrm{d}x}{(x + 1)\sqrt{x^{2} + 1}} ;$$

$$\int_{0}^{1} \sqrt{(1 - x^{2})^{3}} \mathrm{d}x ; \quad \int_{0}^{16} \frac{\mathrm{d}x}{\sqrt{x + 9} - \sqrt{x}} ; \quad \int_{0}^{\frac{\pi}{4}} \tan^{4} x \mathrm{d}x.$$

3. 求 $\int_{0}^{2} f(x - 1)   dx$ ,其中

$$f(x)=\left\{\begin{aligned}&\frac{1}{1+x}, \quad x \geqslant 0, \\&\frac{1}{1+\mathrm{e}^{x}}, \quad x < 0.\end{aligned}\right.$$

4. 设 f(x)在 $\left[ a , b \right]$ 上连续，证明

$$\int_{a}^{b} f(x) \mathrm{d}x = \int_{a}^{b} f(a + b - x) \mathrm{d}x.$$

5. 证明 $\int_{0}^{\pi} \sin^{n} x   dx = 2\int_{0}^{\pi/2} \sin^{n} x   dx, \int_{0}^{\pi} \cos^{2n} x   dx = 2\int_{0}^{\pi/2} \cos^{2n} x   dx  .$

6. 证明 $\int_{x}^{1} \frac{\mathrm{d}t}{1 + t^{2}} = \int_{1}^{\frac{1}{x}} \frac{\mathrm{d}t}{1 + t^{2}} (x > 0)$

7. 证明 $\int_{0}^{1} x^{m} (1 - x)^{n}   dx = \int_{0}^{1} x^{n} (1 - x)^{m}   dx (m, n \in \mathbb{N}) .$

8. 设f(x)是周期为T的连续函数，证明

$$\lim_{x \to +\infty} \frac{1}{x} \int_{0}^{x} f(t)   dt = \frac{1}{T} \int_{0}^{T} f(t)   dt.$$

9. 设 f(x)在[A,B]上连续， $A < a < b < B$ 求证

$$\lim _ { h \rightarrow 0 } \int _ { a } ^ { b } \frac { f ( x + h ) - f ( x ) } { h } \mathrm { d } x = f ( b ) - f ( a ) .$$

10. 设 f(x)在[0,1]上连续， $n \in \mathbb { Z } ,$ 证明

$$\int_{\frac{\pi}{2}\pi}^{\frac{\pi + 1}{2}\pi}f(\left| \sin x \right|)dx = \int_{\frac{\pi}{2}\pi}^{\frac{\pi + 1}{2}\pi}f(\left| \cos x \right|)dx = \int_{0}^{\frac{\pi}{2}}f(\sin x)dx.$$

11. 若f(t)是连续的奇函数，证明 $\int_{0}^{x} f(t)   dt$ 是偶函数；若f(t)是连续的偶函数，证明$\int_{0}^{x} f(t)   dt$ 是奇函数.

[page:129]

## 4.5分部积分法

## 4.5 分部积分法

4.4节在复合函数求导法则的基础上，得到了换元积分法.现在利用两个函数乘积的求导法则，来推得另一个求积分的基本方法分部积分法.

设函数 $u = u(x)$ 及 $v = v(x)$ 具有连续导数，那么，两个函数乘积的导数公式为

$$(uv)^{\prime} = u^{\prime}v + uv^{\prime},$$

移项，得

$$uv' = (uv)' - u'v.$$

对这个等式两边求不定积分，得

$$\int u v ^ { \prime } \mathrm { d } x = u v - \int u ^ { \prime } v \mathrm { d } x.$$

这个公式称为分部积分公式.它也可以写成

$$\int u \mathrm{d}v = uv = \int v \mathrm{d}u.$$

例4.51 求 $\int x\cos x\mathrm{d}x.$

解 $\int x\cos x\mathrm{d}x = \int x\mathrm{d}\sin x = x\sin x - \int \sin x\mathrm{d}x = x\sin x + \cos x + C.$

例4.52 求 $\int x^{2} \mathrm{e}^{x} \mathrm{d}x$

解

$$\begin{aligned}\int x^{2} \mathrm{e}^{x} \mathrm{d}x &= \int x^{2} \mathrm{d}\mathrm{e}^{x} = x^{2} \mathrm{e}^{x} - 2\int x \mathrm{e}^{x} \mathrm{d}x \\&= x^{2} \mathrm{e}^{x} - 2\int x \mathrm{d}\mathrm{e}^{x} = x^{2} \mathrm{e}^{x} - 2x \mathrm{e}^{x} + 2\int \mathrm{e}^{x} \mathrm{d}x \\&= x^{2} \mathrm{e}^{x} - 2x \mathrm{e}^{x} + 2 \mathrm{e}^{x} + C.\end{aligned}$$

例4.53 求 $\int x\mathrm{ln}x\mathrm{d}x$

解

$$\begin{aligned}\int x\ln x\mathrm{d}x &= \int \ln x\mathrm{d}\frac{x^{2}}{2} = \frac{x^{2}}{2}\ln x - \int \frac{x^{2}}{2}\mathrm{d}\ln x \\&= \frac{x^{2}}{2}\ln x - \frac{1}{2}\int x\mathrm{d}x = \frac{x^{2}}{2}\ln x - \frac{x^{2}}{4} + C.\end{aligned}$$

例4.54求 $\int \arccos x \mathrm{d}x$

解

$$\int \arccos x   dx = x \arccos x - \int x \arccos x$$

[page:130]

## 第4章 定积分与不定积分

$$\begin{aligned}&= x\arccos x + \int \frac{x}{\sqrt{1 - x^{2}}} \mathrm{d}x \\&= x\arccos x - \sqrt{1 - x^{2}} + C.\end{aligned}$$

例4.55求 $\int x\mathrm{arctan}x\mathrm{d}x$

解

$$\int x\arctan x\mathrm{d}x = \frac{1}{2}\int \arctan x\mathrm{d}(x^2) \\= \frac{x^2}{2}\arctan x - \frac{1}{2}\int \frac{x^2}{1 + x^2}\mathrm{d}x \\= \frac{1}{2}(x^2 + 1)\arctan x - \frac{x}{2} + C.$$

例4.56求 $\int \mathrm{e}^{x} \sin x \mathrm{d}x$

解

$$\begin{aligned}\int \mathrm{e}^{x} \sin x \mathrm{d}x &= \int \sin x \mathrm{d}(\mathrm{e}^{x}) = \mathrm{e}^{x} \sin x - \int \mathrm{e}^{x} \mathrm{d}\sin x \\&= \mathrm{e}^{x} \sin x - \int \cos x \mathrm{d}\mathrm{e}^{x} = \mathrm{e}^{x} \sin x - \mathrm{e}^{x} \cos x - \int \mathrm{e}^{x} \sin x \mathrm{d}x,\end{aligned}$$

所以

$$\int \mathrm{e}^{x} \sin x \mathrm{d}x = \frac{\mathrm{e}^{x}}{2} \left( \sin x - \cos x \right) + C.$$

例4.57求 $\int \mathrm{e}^{\sqrt{x}} \mathrm{d}x$

解令 $\sqrt{x} = t$ ,则 $x = t^{2}, \mathrm{d}x = 2t\mathrm{d}t.$ 于是

$$\int \mathrm{e}^{-x} \mathrm{d}x = 2\int t \mathrm{e}^{t} \mathrm{d}t = 2\int t \mathrm{d}\mathrm{e}^{t} = 2t \mathrm{e}^{t} - 2\int \mathrm{e}^{t} \mathrm{d}t = 2t \mathrm{e}^{t} - 2\mathrm{e}^{t} + C.$$

用 $\sqrt{x} = t$ 代回，得

$$\int \mathrm{e}^{\sqrt{x}} \mathrm{d}x = 2\mathrm{e}^{\sqrt{x}}(\sqrt{x} - 1) + C.$$

对于定积分，有类似的分部积分公式.

设 $u(x) , v(x)$ 在 $\left[ a , b \right]$ 上具有连续导数，则

$$\int _ { a } ^ { b } u ( x ) \mathrm { d } v ( x ) = u ( x ) v ( x ) \big | _ { a } ^ { b } - \int _ { a } ^ { b } v ( x ) \mathrm { d } u ( x ) .$$

例4.58 计算 $I = \int_{0}^{\frac{1}{2}} \arcsin x   dx ;$

解

$$\left| \frac{1}{2} \right| \left| \frac{1}{2} \right| - \int_{0}^{\frac{1}{2}} \frac{x}{\sqrt{1 - x^{2}}} \mathrm{d}x$$

[page:131]

## 4.5 分部积分法

$$\begin{aligned}&= \frac{\pi}{12} + \frac{1}{2}\int_{0}^{\frac{1}{2}} (1 - x^2)^{-\frac{1}{2}} \mathrm{d}(1 - x^2) \\&= \frac{\pi}{12} + \sqrt{1 - x^2} \Big|_{0}^{\frac{1}{2}} = \frac{\pi}{12} + \frac{\sqrt{3}}{2} - 1.\end{aligned}$$

例4.59证明

$$I_{n} = \int_{0}^{\frac{\pi}{2}}\sin^{n}x\mathrm{d}x = \int_{0}^{\frac{\pi}{2}}\cos^{n}x\mathrm{d}x = \left\{ \begin{aligned} \frac{n - 1}{n} \cdot \frac{n - 3}{n - 2} \cdots \frac{3}{4} \cdot \frac{1}{2} \cdot \frac{\pi}{2}, & \quad n  为正偶数 , \\ \frac{n - 1}{n} \cdot \frac{n - 3}{n - 2} \cdots \frac{4}{5} \cdot \frac{2}{3}, & \quad n  为正奇数 . \end{aligned} \right.$$

证令 $x = \frac{\pi}{2} - t$ ,则

$$\int _ { 0 } ^ { \frac { \pi } { 2 } } \sin ^ { n } x \mathrm { d } x = - \int _ { \frac { \pi } { 2 } } ^ { 0 } \cos ^ { n } t \mathrm { d } t = \int _ { 0 } ^ { \frac { \pi } { 2 } } \cos ^ { n } x \mathrm { d } x.$$

当 $n \gg 2$ 时，

$$\begin{aligned}I_{n} &= \int_{0}^{\frac{\pi}{2}}\sin^{n}x\mathrm{d}x = - \int_{0}^{\frac{\pi}{2}}\sin^{n - 1}x\mathrm{d}\cos x \\&= - \cos x\sin^{n - 1}x\int_{0}^{\frac{\pi}{2}} + \int_{0}^{\frac{\pi}{2}}(n - 1)\sin^{n - 2}x\cos^{2}x\mathrm{d}x \\&= (n - 1)\int_{0}^{\frac{\pi}{2}}\sin^{n - 2}x\mathrm{d}x - (n - 1)\int_{0}^{\frac{\pi}{2}}\sin^{n}x\mathrm{d}x \\&= (n - 1)I_{n - 2} - (n - 1)I_{n}.\end{aligned}$$

于是，得递推公式

$$I_{n} = \frac{n - 1}{n} I_{n - 2}.$$

当n为正偶数时， $I_{n}=\frac{n-1}{n}\cdot \frac{n-3}{n-2}\cdots\frac{3}{4}\cdot \frac{1}{2}I_{0}$

当n为正奇数时， $I_{n}=\frac{n-1}{n}\cdot \frac{n-3}{n-2}\cdots\frac{3}{4}\cdot \frac{2}{3}I_{1}$

又因为

$$I _ { 1 } = \int _ { 0 } ^ { \frac { \pi } { 2 } } \sin x \mathrm { d } x = 1 ,$$

$$I_{0} = \int_{0}^{\frac{\pi}{2}} \mathrm{d}x = \frac{\pi}{2}.$$

故

[page:132]

## 第4章 定积分与不定积分

不定积分的分部积分法

定积分的分部积分法

## 习题4.5

1. 求下列不定积分:

(1) $\int x\sin x\mathrm{d}x;$ (2) $\int \ln x \mathrm{d}x;$ (3) $\int \arcsin x \mathrm{d}x;$ (4) $\int x \mathrm{e}^{-x} \mathrm{d}x;$

(5) $\int x^{2}\ln x\mathrm{d}x;$ (6) $\int \mathrm{e}^{-x} \cos x  \mathrm{d}x ;$ (7) $\int \mathrm{e}^{-2x} \sin \frac{x}{2} \mathrm{d}x ;$ (8) $\int x\cos\frac{x}{2}\mathrm{d}x;$

(9) $\int x^{2}\arctan x\mathrm{d}x ;$ (10) $\int x\tan^{2}x\mathrm{d}x;$ (11) $\int x^{2}\cos x\mathrm{d}x ;$ (12) $\int t \mathrm{e}^{-2t}   \mathrm{d}t$

(13) $\int \ln^{2} x   dx ;$ (14) xsinxcosxdx; (15) $\int x^{2}\cos^{2}\frac{x}{2}\mathrm{d}x;$ (16) $\int x\ln(x - 1)\mathrm{d}x;$

(17) $\int \left( x^{2} = 1 \right) \sin 2x   dx ;$ (18) $\int \frac{\ln^{3}x}{x^{2}}\mathrm{d}x;$ (19) $\int \mathrm{e}^{\sqrt{x}} \mathrm{d}x ;$ (20) $\int \cos x   dx ;$

(21) $\int \left( \arcsin x \right)^{2} \mathrm{d}x ;$ (22) $\int \mathrm{e}^{x} \sin^{2} x \mathrm{d}x ;$ (23) $\int x\ln^{2}x\mathrm{d}x;$ (24) $\int \mathrm{e}^{\sqrt{3x + 9}}   \mathrm{d}x ;$

(25) $\int x\mathrm{ch}x\mathrm{d}x;$ (26) $\int x^{2}\mathrm{e}^{-2x}\mathrm{d}x;$ (27)∫ln(x+ √1+x²)dx;

(28) $\int \frac{x\ln x}{\left( 1 + x^{2} \right)^{2}}\mathrm{d}x;$ (29) $\int \sqrt{x} \arctan \sqrt{x}   dx$ (30) $\int\frac{\arcsin x}{\left(1-x^{2}\right)^{3/2}}\mathrm{d}x;$

(31) $\int \sin x \ln(\tan x)   dx;$ (32) $\int x^{3} \left( \ln x \right)^{2} \mathrm{d}x;$ (33) $\int \frac{\arctan \mathrm{e}^{x}}{\mathrm{e}^{x}} \mathrm{d}x;$

(34) $\int x \mathrm{e}^{x} \sin^{2} x \mathrm{d}x;$ (35) $\int\frac{x\arctan x}{\left(1+x^{2}\right)^{3/2}}\mathrm{d}x;$ (36) $\int \arcsin \sqrt{1 - x^{2}}   dx ;$

(37) $\int \frac{\ln \ln x}{x} \mathrm{d}x;$ (38) $\int x\cos^{2}x\mathrm{d}x;$ (39) $\int \mathrm{e}^{ax} \cos bx   dx ;$ (40) $\int \sqrt{x} \sin \sqrt{x}   dx ;$

(41) $\int \ln(1 + x^{2})   dx;$ (42) $\int \arctan \sqrt{x}   dx ;$ (43) $\int \frac{x + \sin x}{1 + \cos x} \mathrm{d}x;$

(44) $\int \mathrm{e}^{\sin x} \frac{x \cos^3 x - \sin x}{\cos^2 x} \mathrm{d}x ;$ (45) $\int \frac{x \mathrm{e}^{x}}{\left( \mathrm{e}^{x} + 1 \right)^{2}} \mathrm{d}x;$ (46) $\int \ln ^{2}(x+\sqrt{1+x^{2}}) \mathrm{d}x;$

(47) $\int \frac{\ln x}{\left( 1 + x^{2} \right)^{\frac{3}{2}}} \mathrm{d}x;$ (48) $\int \sqrt{1 - x^{2}}\arcsin xdx;$ (49) $\int\frac{x^{3}\arccos x}{\sqrt{1 - x^{2}}}\mathrm{d}x;$

[page:133]

## 4.6有理函数的积分

(50) $\int \frac{\cot x}{1 + \sin x} \mathrm{d}x$ (51) $\int \frac{\mathrm{d}x}{\sin^{3}x\cos x}$ (52) $\int \frac{\mathrm{d}x}{\left ( 2 + \cos x \right ) \sin x}$

(1) $\int_{0}^{1} x \mathrm{e}^{-x} \mathrm{d}x ;$ (2) $\int_{1}^{\mathrm{e}} x \ln x \mathrm{d}x;$ (3) $\int_{0}^{\frac{2\pi}{\omega}} t \sin \omega t   dt ;$ (4) $\int_{\frac{\pi}{4}}^{\frac{\pi}{3}}\frac{x}{\sin^{2}x}\mathrm{d}x;$

(5) $\int_{1}^{4}\frac{\ln x}{\sqrt{x}}\mathrm{d}x;$ (6) $\int_{0}^{1} x \arctan x \mathrm{d}x ;$ (7) $\int_{0}^{\frac{\pi}{2}}\mathrm{e}^{2x}\cos x\mathrm{d}x;$ (8) $\int_{1}^{2} x \log_{2} x   dx$

(9) $\int_{0}^{\pi} (x \sin x)^{2}   dx;$ (10) sin(lnx)dx; $\int_{\frac{1}{\mathrm{e}}}^{\mathrm{e}} \left| \ln x \right| \mathrm{d}x;$

(12) $\int_{0}^{1} \left(1 - x^{2}\right)^{\frac{m}{2}} \mathrm{d}x \left(m \in \mathbf{N}^{+}\right)$ (13) $J_{m} = \int_{0}^{\pi} x \sin^{m} x   dx (m \in \mathbf{N}^{+})$

(14) $\int_{0}^{1} \arcsin x   dx ;$ (15) $\int_{0}^{\pi}\ln(x+\sqrt{x^{2}+a^{2}})dx;$

(16) $\int_{0}^{\frac{1}{2}} \left( \arcsin x \right)^{2} \mathrm{d}x ;$ (17) $\int_{0}^{\pi} x \sin^{10} x   dx$ (18) $\int_{0}^{1} x^{10} \sqrt{1 - x^2}   dx;$ 4

(19) $\int_{0}^{1} \left( 1 - x^{2} \right)^{4} \sqrt{1 - x^{2}}   dx ;$ (20) $\int_{0}^{1} x (\arctan x)^{2}   dx;$ (21) $\int_{0}^{3} \arcsin \sqrt{\frac{x}{1 + x}}   dx ;$

(22) $\int_{0}^{\frac{\pi}{2}}\frac{x+\sin x}{1+\cos x}\mathrm{d}x;$ (23) $\int_{0}^{\pi} x^{2} \mid \cos x \mid \mathrm{d}x ;$ (24) $\int_{1}^{\mathrm{e}} (x \ln x)^{2}   \mathrm{d}x;$ (25) $\int_{0}^{1} \ln(1 + \sqrt{x})   dx.$

## 4.6 有理函数的积分

## 4.6.1 有理函数的积分

两个多项式的商 $\frac{P(x)}{Q(x)}$ 称为有理函数，又称为有理分式.这里总假定分子多项式 $P(x)$ 与分母多项式 $Q(x)$ 之间是没有公因式的.当分子多项式 $P(x)$ 的次数小于分母多项式 $Q(x)$ 的次数时，称此有理函数为真分式，否则称为假分式

利用多项式的除法，总可以将一个假分式化成一个多项式与一个真分式之和的形式，如

$$\frac{2x^{4}+x^{2}+3}{x^{2}+1}=2x^{2}-1+\frac{4}{x^{2}+1}$$

由于多项式的积分容易求，故重点讨论真分式的积分方法

对于真分式 $\frac{P_{n}(x)}{Q_{m}(x)}$ ，首先将 $Q_{m}(x)$ 在实数范围内进行因式分解，分解的结果不外乎两种类型，一种是 $(x - a)^{k}$ ，另外一种是 $(x^{2}+px+q)^{2}$ ，其中k，l是正整数且$p^{2}-4q<0$ ;其次，根据因式分解的结果，将真分式拆成若干个分式之和.

具体的做法如下:

若 $Q_{m}(x)$ 分解后含有因式 $(x - a)^{k}$ ，则和式中对应地含有以下k个分式之和

$$\frac{A_{1}}{(x - a)} + \frac{A_{2}}{(x - a)^{2}} + \cdots + \frac{A_{k}}{(x - a)^{k}}$$

[page:134]

## 第4章 定积分与不定积分

其中 $A _ { 1 } , \cdots , A _ { k }$ 为待定常数.

若 $Q_{m}(x)$ 分解后含有因式 $(x^{2}+px+q)^{l}$ ，则和式中对应地含有l个分式之和

$$\frac{M_{1}x + N_{1}}{\left( x^{2} + px + q \right)} + \frac{M_{2}x + N_{2}}{\left( x^{2} + px + q \right)^{2}} + \cdots + \frac{M_{l}x + N_{l}}{\left( x^{2} + px + q \right)^{l}}$$

其中 $M_{i},N_{i}(i = 1,2,\cdots,l)$ 为待定常数.

以上这些常数可通过待定系数法来确定.上述步骤称为把真分式化为部分分式之和，所以，有理函数的积分最终归结为部分分式的积分.

例4.60 求 $\int\frac{x + 1}{x^{2} - 5x + 6}\mathrm{d}x.$

解被积函数的分母分解成 $(x - 3)(x - 2)$ ，故可设

$$\frac{x + 1}{x^{2} - 5x + 6} = \frac{A}{x - 3} + \frac{B}{x - 2},$$

其中A，B为待定系数.上式两端去分母后，得

$$x + 1 = A(x - 2) + B(x - 3)$$

即

$$x + 1 = (A + B)x - 2A - 3B.$$

比较上式两端同次幂的系数，即有

$$\begin{cases}A + B = 1, \\2A + 3B = -1.\end{cases}$$

从而解得

$$A = 4, \quad B = -3,$$

于是

$$\int \frac{x + 1}{x^{2} - 5x + 6}\mathrm{d}x = \int \left( \frac{4}{x - 3} - \frac{3}{x - 2} \right) \mathrm{d}x \\= 4\ln |x - 3| - 3\ln |x - 2| + C.$$

例4.61 求 $\int\frac{x + 2}{(2x + 1)(x^2 + x + 1)}\mathrm{d}x.$

解设

$$\frac{x + 2}{\left( 2x + 1 \right)\left( x^{2} + x + 1 \right)} = \frac{A}{2x + 1} + \frac{Bx + C}{x^{2} + x + 1}$$

则

$$x+2=A(x^{2}+x+1)+(Bx+C)(2x+1)$$

即

$$x + 2 = ( A + 2 B ) x ^ { 2 } + ( A + B + 2 C ) x + A + C$$

有

[page:135]

## 4.6 有理函数的积分

$$\begin{cases}A + 2B = 0, \\A + B + 2C = 1, \\A + C = 2.\end{cases}$$

解得

$$\begin{cases} { A { = } 2 , } \\ { B { = } { - } 1 , } \\ { C { = } 0 , } \\ \end{cases}$$

于是

$$\begin{aligned}\int\frac{x + 2}{(2x + 1)(x^2 + x + 1)}\mathrm{d}x &= \int\left(\frac{2}{2x + 1} - \frac{x}{x^2 + x + 1}\right)\mathrm{d}x \\&= \ln|2x + 1| - \frac{1}{2}\int\frac{(2x + 1) - 1}{x^2 + x + 1}\mathrm{d}x \\&= \ln|2x + 1| - \frac{1}{2}\int\frac{\mathrm{d}(x^2 + x + 1)}{x^2 + x + 1} + \frac{1}{2}\int\frac{\mathrm{d}x}{\left(x + \frac{1}{2}\right)^2 + \frac{3}{4}} \\&= \ln|2x + 1| - \frac{1}{2}\ln(x^2 + x + 1) + \frac{1}{\sqrt{3}}\arctan\frac{2x + 1}{\sqrt{3}} + C.\end{aligned}$$

例4.62求 $\int\frac{x - 3}{(x - 1)^{2}(x + 1)}\mathrm{d}x.$

解设

$$\frac{x - 3}{(x - 1)^{2}(x + 1)} = \frac{A}{(x - 1)} + \frac{B}{(x - 1)^{2}} + \frac{C}{(x + 1)},$$

则

$$x - 3 = A(x^2 - 1) + B(x + 1) + C(x - 1)^2$$

即

$$x - 3 = ( A + C ) x ^ { 2 } + ( B - 2 C ) x + ( - A + B + C ) ,$$

有

$$\begin{cases}A + C = 0, \\B - 2C = 1, \\- A + B + C = - 3.\end{cases}$$

解得

$$\begin{cases}A = 1, \\B = -1, \\C = -1.\end{cases}$$

于是

$$\int\frac{x - 3}{(x - 1)^{2}(x + 1)}\mathrm{d}x = \int\left(\frac{1}{x - 1} + \frac{- 1}{(x - 1)^{2}} + \frac{- 1}{x + 1}\right)\mathrm{d}x$$

[page:136]

## 第4章定积分与不定积分

## 4.6.2可化为有理函数的积分举例

例4.63 求 $\int\frac{1 + \sin x}{\sin x(1 + \cos x)}\mathrm{d}x$

解由三角函数知道，sinx与cosx都可以用 $\tan \frac{x}{2}$ 的有理式表示，即

$$\sin x = 2\sin\frac{x}{2}\cos\frac{x}{2} = \frac{2\tan\frac{x}{2}}{\sec^{2}\frac{x}{2}} = \frac{2\tan\frac{x}{2}}{1 + \tan^{2}\frac{x}{2}}$$

$$\cos x = \cos^2 \frac{x}{2} - \sin^2 \frac{x}{2} = \frac{1 - \tan^2 \frac{x}{2}}{\sec^2 \frac{x}{2}} = \frac{1 - \tan^2 \frac{x}{2}}{1 + \tan^2 \frac{x}{2}}.$$

如果作变换 $u = \tan \frac{x}{2} ( - \pi < x < \pi )$ ,则有

$$\sin x = \frac{2u}{1 + u^{2}}, \quad \cos x = \frac{1 - u^{2}}{1 + u^{2}},$$

而 $x = 2\arctan u$ ，从而

$$\mathrm{d}x = \frac{2}{1 + u^{2}}\mathrm{d}u.$$

于是

$$\int \frac{1 + \sin x}{\sin x(1 + \cos x)} \mathrm{d}x = \int \frac{\left( 1 + \frac{2u}{1 + u^2} \right) \frac{2\mathrm{d}u}{1 + u^2}}{\frac{2u}{1 + u^2}\left( 1 + \frac{1 - u^2}{1 + u^2} \right)} \mathrm{d}x = \frac{1}{2} \int \left( u + 2 + \frac{1}{u} \right) \mathrm{d}u = \frac{1}{2} \left( \frac{u^2}{2} + 2u + \ln |u| \right) + C \cdot \frac{1}{4} \tan^2 \frac{x}{2} + \tan \frac{x}{2} + \frac{1}{2} \ln \left| \tan \frac{x}{2} \right| + C.$$

例4.64求 $\int \frac{\sqrt{x - 1}}{x} \mathrm{d}x$

解设 $\sqrt{x - 1} = u$ ，于是 $x = u^{2} + 1, \mathrm{d}x = 2u\mathrm{d}u$ ，从而所求积分为

[page:137]

## 4.6 有理函数的积分

$$\begin{aligned}\int \frac{\sqrt{x - 1}}{x} \mathrm{d}x &= \int \frac{u}{u^{2} + 1} \cdot 2u \mathrm{d}u = 2\int \frac{u^{2}}{u^{2} + 1} \mathrm{d}u \\&= 2\int \left( 1 - \frac{1}{1 + u^{2}} \right) \mathrm{d}u = 2(u - \arctan u) + C \\&= 2(\sqrt{x - 1} - \arctan \sqrt{x - 1}) + C.\end{aligned}$$

例4.65求 $\int\frac{\mathrm{d}x}{1 + \sqrt[3]{x + 2}}$

解设 $\sqrt[3]{x + 2} = u$ ，于是 $x = u^{3} - 2, \mathrm{d}x = 3u^{2}\mathrm{d}u$ ，从而所求积分为

$$\begin{aligned}\int \frac{\mathrm{d}x}{1 + \sqrt[3]{x + 2}} &= \int \frac{3u^{2}}{1 + u}\mathrm{d}u \\&= 3\int \left(u - 1 + \frac{1}{1 + u}\right)\mathrm{d}u \\&= 3\left(\frac{u^{2}}{2} - u + \ln|1 + u|\right) + C \\&= \frac{3}{2}\sqrt[3]{(x + 2)^{2}} - 3\sqrt[3]{x + 2} + 3\ln|1 + \sqrt[3]{x + 2}| + C.\end{aligned}$$

例4.66求 $\int\frac{\mathrm{d}x}{\left(1+\sqrt[3]{x}\right)\sqrt{x}}$

解设 $x { = } t ^ { 6 }$ ，于是 $\mathrm{d}x = 6t^{5}\mathrm{d}t$ ，从而所求积分为

$$\int\frac{dx}{\left(1+\sqrt[3]{x}\right)\sqrt{x}}=\int\frac{6t^{5}}{\left(1+t^{2}\right)t^{3}}dt=6\int\frac{t^{2}}{1+t^{2}}dt\\=6\int\left(1-\frac{1}{1+t^{2}}\right)dt=6(t-\arctan t)+C\\=6(\sqrt[6]{x}-\arctan\sqrt[6]{x})+C.$$

例4.67 求 $\int \frac{1}{x} \sqrt{\frac{1 + x}{x}} \mathrm{d}x$

解设 $\sqrt{\frac{1 + x}{x}} = t$ ，于是 $\frac{1 + x}{x} = t^{2},x = \frac{1}{t^{2} - 1},\mathrm{d}x = - \frac{2t\mathrm{d}t}{\left( t^{2} - 1 \right)^{2}}$ ，从而所求积分为

$$\begin{aligned}\int \frac{1}{x} \sqrt{\frac{1 + x}{x}} \mathrm{d}x &= \int (t^2 - 1)t \cdot \frac{-2t}{(t^2 - 1)^2} \mathrm{d}t = -2\int \frac{t^2}{t^2 - 1} \mathrm{d}t \\&= -2\int \left(1 + \frac{1}{t^2 - 1}\right) \mathrm{d}t = -2t - \ln \left|\frac{t - 1}{t + 1}\right| + C \\&= -2t + 2\ln(t + 1) - \ln \left|t^2 - 1\right| + C \\&= -2\sqrt{\frac{1 + x}{x}} + 2\ln\left(\sqrt{\frac{1 + x}{x}} + 1\right) + \ln \left|x\right| + C.\end{aligned}$$

[page:138]

## 第4章 定积分与不定积分

## 习题4.6

求下列不定积分:

(1) $\int \frac{x^{3}}{x + 3} \mathrm{d}x ;$ (2) $\int\frac{2x + 3}{x^{2} + 3x - 10}\mathrm{d}x;$ (3) $\int\frac{x + 1}{x^{2} - 2x + 5}\mathrm{d}x;$ (4) $\int \frac{\mathrm{d}x}{x\left( x^{2} + 1 \right)};$

(5) $\int \frac{3}{x^{3} + 1} \mathrm{d}x;$ (6) $\int\frac{x^{2}+1}{(x+1)^{2}(x-1)}\mathrm{d}x;$ (7) $\int\frac{x\mathrm{d}x}{(x + 1)(x + 2)(x + 3)};$

(8) $\int \frac{x^{5} + x^{4} - 8}{x^{3} - x} \mathrm{d}x ;$ (9) $\int\frac{\mathrm{d}x}{\left(x^{2}+1\right)\left(x^{2}+x\right)};$ (10)

$$\int \frac{\mathrm{d}x}{\left( x^{2} + 1 \right)\left( x^{2} + x + 1 \right)}; \quad (12) \int \frac{(x + 1)^{2}}{\left( x^{2} + 1 \right)^{2}}\mathrm{d}x; \quad (13) \int \frac{- x^{2} - 2}{\left( x^{2} + x + 1 \right)^{2}}\mathrm{d}x;$$

$$\int \frac{\mathrm{d}x}{3 + \sin^{2}x}; \quad (15) \int \frac{\mathrm{d}x}{3 + \cos x}; \quad (16) \int \frac{\mathrm{d}x}{2 + \sin x}; \quad (17) \int \frac{\mathrm{d}x}{1 + \sin x + \cos x};$$

$$\int \frac{\mathrm{d}x}{2\sin x - \cos x + 5}; \quad (19) \int \frac{\mathrm{d}x}{1 + \sqrt[3]{x + 1}}; \quad (20) \int \frac{(\sqrt{x})^3 - 1}{\sqrt{x} + 1}\mathrm{d}x;$$

$$\int \frac{\sqrt{x + 1} - 1}{\sqrt{x + 1} + 1} \mathrm{d}x; \quad (22) \int \frac{\mathrm{d}x}{\sqrt{x} + \sqrt[3]{x}}; \quad (23) \int \sqrt{\frac{1 - x}{1 + x}} \frac{\mathrm{d}x}{x};$$

$$\int\frac{\mathrm{d}x}{\sqrt[3]{(x + 1)^{2}(x - 1)^{3}}}; \quad (25)\int\frac{\mathrm{d}x}{(x^{2} - 4x + 4)(x^{2} - 4x + 5)}; \quad (26)\int\frac{x^{2} + 5x + 4}{x^{4} + 5x^{2} + 4}\mathrm{d}x;$$

$$\int \frac{x^{5}}{x + 1}\mathrm{d}x ; \quad (28) \int \frac{\mathrm{d}x}{2 - 3x^{2}} ; \quad (29) \int \frac{\mathrm{d}x}{(x^{2} - 2)(x^{2} + 3)} ; \quad (30) \int \frac{x^{3}\mathrm{d}x}{x^{4} - x^{2} + 2} ;$$

(31) $\int\frac{\mathrm{d}x}{(x + 2)(x^2 + 2x + 2)};$ (32) (x + a) ( x + b2) ; (33) r+ 1dx;

$$\int \frac{x^{2n - 1}}{\left( x^{2n} + 1 \right)^{2}}\mathrm{d}x; \quad (35) \int \frac{x^{2} + 1}{\left( x + 1 \right)^{2}\left( x - 1 \right)}\mathrm{d}x; \quad (36) \int \frac{x^{3} + 1}{x^{3} - 5x^{2} + 6x}\mathrm{d}x;$$

$$\int \frac{x}{x^{3} - 1}\mathrm{d}x ; \quad (38) \int \frac{\mathrm{d}x}{x^{3} + 1} ; \quad (39) \int \frac{\mathrm{d}x}{(x + 1)(x + 2)^{2}(x + 3)} ;$$

$$\int \frac{x \mathrm{d}x}{\left( x^{2} + 1 \right)\left( x + 2 \right)}; \quad (41) \int \cos \frac{x}{2} \cos \frac{x}{3} \mathrm{d}x; \quad (42) \int \sin \left( 2x - \frac{\pi}{6} \right) \cos \left( 3x + \frac{\pi}{4} \right) \mathrm{d}x;$$

(43) $\int \cos x\cos 2x\cos 3x\mathrm{d}x;$ (44) $\int \cos^{4} x   dx ;$ (45) $\int \cos ^{5}x\mathrm{d}x; \quad (46) \int \sin ^{2}x\cos ^{5}x\mathrm{d}x;$

(47) $\int \sec^{2} x \sin^{3} x   dx$ (48) sin2,xcos4xdx; (49) $\int \frac{\mathrm{d}x}{\sin x + \cos x};$

(50) $\int\frac{\cos x}{\sqrt{2+\cos 2x}}\mathrm{d}x;$ $\int \frac{\sin x \cos x}{\sin^4 x + \cos^4 x}   dx;$ (52) $\int \sec^{3} x \mathrm{d}x ;$

(53) $\int \csc^{3} x   dx$ (54) cos³ xsin2xdx; (55) $\int \frac{\mathrm{d}x}{1 + \varepsilon \cos x} ( \mid \varepsilon \mid < 1 ) ;$

(56) $\int \frac{\sin x \cos x}{\sin x + \cos x}   dx;$ (57) $\int \frac{\mathrm{d}x}{\cos^{4}x};$ (58) $\int \frac{\cos 2x}{\sin^{4}x + \cos^{4}x} \mathrm{d}x;$

(59) $\int \mathrm{sh}x\mathrm{sh}2x\mathrm{d}x ;$ (60) $\int \left( \mathrm{ch}x\mathrm{ch}3x\mathrm{d}x \right)$ (61) $\int \sqrt{\frac{1 + x}{1 - x}} \mathrm{d}x;$ (62) $\int\frac{1 - \sqrt{x + 1}}{1 + \sqrt[3]{x + 1}}\mathrm{d}x;$

[page:139]

## 4.7 反常积分

$$\int \frac{\sqrt{x + 1} - \sqrt{x - 1}}{\sqrt{x + 1} + \sqrt{x - 1}} \mathrm{d}x; \quad (64) \int \frac{\mathrm{d}x}{x(1 + 2\sqrt{x})}; \quad (65) \int \frac{\mathrm{d}x}{\sqrt[3]{(x + 1)^2(x - 1)^4}};$$

$$\int \frac{x\mathrm{d}x}{\sqrt{x^{2} - x + 2}}; \quad (67) \int \frac{x - \sqrt{x^{2} + 3x + 2}}{x + \sqrt{x^{2} + 3x + 2}}\mathrm{d}x; \quad (68) \int x\sqrt{x^{2} - 2x + 2}\mathrm{d}x;$$

$$\int \frac{\mathrm{d}x}{(x + 1)\sqrt{x^{2} + 1}}; \quad (70) \int \frac{\mathrm{d}x}{1 + 2\sqrt{x - x^{2}}}; \quad (71) \int \frac{x\mathrm{d}x}{(1 + x^{1/3})^{1/2}}$$

## 4.7反常积分

在一些实际问题中，常会遇到积分区间为无穷区间，或者被积函数为无界函数的积分，它们已经不属于一般的定积分了.因此，本节对定积分作两种推广，从而形成反常积分的概念.

## 4.7.1 无穷限的反常积分

定义4.4 设函数 $f ( x )$ 在区间 $[ a , + \infty )$ 上连续，取 $t > a$ ，如果极限

$$\lim_{t \to +\infty} \int_{a}^{t} f(x)   dx$$

存在，则称此极限为函数 $f(x)$ 在无穷区间 $[ a , + \infty )$ 上的反常积分，记作$\int_{a}^{+\infty} f(x)   dx$ ,即

$$\int_{a}^{+\infty} f(x) \mathrm{d}x = \lim_{t \to +\infty} \int_{a}^{t} f(x) \mathrm{d}x,$$

这时也称反常积分 $\int_{a}^{+\infty} f(x)   dx$ 收敛；如果上述极限不存在，则函数 $f(x)$ 在无穷区间$\left[ a, +\infty \right)$ 上的反常积分 $\int_{a}^{+\infty} f(x)   dx$ 就没有意义，习惯上称为反常积分 $\int_{a}^{+\infty} f(x)   dx$ 发散，这时记号 $\int_{a}^{+\infty} f(x)   dx$ 不再表示数值了

类似地，设函数f(x)在区间 $( - \infty , b ]$ 上连续，取 $t \leq b$ ，如果极限

$$\lim_{t \to -\infty} \int_{t}^{b} f(x)   dx$$

存在，则称此极限为函数 $f(x)$ 在无穷区间 $( - \infty , b ]$ 上的反常积分，记作$\int_{-\infty}^{b} f(x)   dx$ ,即

$$\int_{-\infty}^{b} f(x)   dx = \lim_{t \to -\infty} \int_{t}^{b} f(x)   dx,$$

这时也称反常积分 $\int_{-\infty}^{b} f(x)   dx$ 收敛.如果上述极限不存在，则称反常积分

[page:140]

## 第4章 定积分与不定积分

$\int_{-\infty}^{b} f(x)   dx$ 发散.

设函数 $f(x)$ 在区间 $( - \infty , + \infty )$ 上连续，如果反常积分

$$\int_{-\infty}^{0} f(x)   \mathrm{d}x, \quad \int_{0}^{+\infty} f(x)   \mathrm{d}x$$

都收敛，则称上述两反常积分之和为函数 $f(x)$ 在无穷区间 $( - \infty , + \infty )$ 上的反常积分，记作 $\int_{-\infty}^{+\infty} f(x)   dx$ ,即

$$\int _ { - \infty } ^ { + \infty } f ( x ) \mathrm { d } x = \int _ { - \infty } ^ { 0 } f ( x ) \mathrm { d } x + \int _ { 0 } ^ { + \infty } f ( x ) \mathrm { d } x ,$$

这时也称反常积分 $\int_{-\infty}^{+\infty} f(x)   dx$ 收敛.否则就称反常积分 $\int_{-\infty}^{+\infty} f(x)   dx$ 发散.

上述反常积分统称为无穷限的反常积分

由上述定义及牛顿-莱布尼茨公式，可得如下结果

设 $F(x)$ 为f(x)在 $[ a , + \infty )$ 上的一个原函数，若 $\lim_{x \to +\infty} F(x)$ 存在，则反常积分

$$\int_{a}^{+\infty} f(x) \mathrm{d}x = \lim_{x \to +\infty} F(x) - F(a);$$

若 $\lim_{x \to +\infty} F(x)$ 不存在，则反常积分 $\int_{a}^{+\infty} f(x) \mathrm{d}x$ 发散.

如果记 $F(+\infty)=\lim_{x \to +\infty} F(x),[F(x)]_a^{+\infty}=F(+\infty)-F(a)$ ,则当 $F( + \infty)$ 存在时

$$\int_{a}^{+\infty} f(x) \mathrm{d}x = \left[ F(x) \right]_{a}^{+\infty};$$

当 $F( + \infty)$ 不存在时，反常积分 $\int_{a}^{+\infty} f(x) \mathrm{d}x$ 发散.

类似地，若在 $(-\infty,b]  上  F'(x)=f(x)$ ，则当 $F( 一 \infty)$ 存在时，

$$\int _ { - \infty } ^ { b } f ( x ) \mathrm { d } x = \left[ F ( x ) \right] _ { - \infty } ^ { b } ;$$

当 $F(=\infty)$ 不存在时，反常积分 $\int_{-\infty}^{b} f(x)   dx$ 发散.

若在 $( - \infty , + \infty )$ 内 $F^{\prime}(x) = f(x)$ ,则当 $F( 一 \infty)$ 与 $F( + \infty)$ 都存在时，

$$\int_{-\infty}^{+\infty} f(x) \mathrm{d}x = \left[ F(x) \right]_{-\infty}^{+\infty};$$

当 $F(-\infty)$ 与 $F( + \infty)$ 有一个不存在时，反常积分 $\int_{-\infty}^{+\infty} f(x)   dx$ 发散.

例4.68 计算反常积分 $\int_{-\infty}^{+\infty} \frac{1}{1 + x^2}   dx.$

解 $\int_{-\infty}^{+\infty} \frac{1}{1 + x^2} \mathrm{d}x = \left[ \arctan x \right]_{-\infty}^{+\infty}$

[page:141]

## 4.7 反常积分

$$\begin{aligned}&=\lim_{x \to +\infty} \arctan x - \lim_{x \to -\infty} \arctan x \\&= \frac{\pi}{2} - \left( - \frac{\pi}{2} \right) = \pi.\end{aligned}$$

这个反常积分的几何意义是位于曲线 $y=\frac{1}{1+x^{2}}$ 的下方，x轴上方的图形面积(图4.13).

例4.69证明反常积分 $\int_{a}^{+\infty} \frac{\mathrm{d}x}{x^{\frac{p}{p}}} (a > 0)$ 当 $p > 1$ 时收敛，当 $p { \leqslant } 1$ 时发散.证当 $p = 1$ 时，

$$\int _ { a } ^ { + \infty } \frac { \mathrm { d } x } { x ^ { b } } = \int _ { a } ^ { + \infty } \frac { \mathrm { d } x } { x } = \left[ \ln x \right] _ { a } ^ { + \infty } = + \infty .$$

当 $p \neq 1$ 时，

$$\int _ { a } ^ { + \infty } \frac { \mathrm { d } x } { x ^ { p } } = \left[ \frac { x ^ { 1 - p } } { 1 - p } \right] _ { a } ^ { + \infty } = \left\{ \begin{aligned} & + \infty , & p < 1 , \\ & \frac { a ^ { 1 - p } } { p - 1 } , & p > 1 . \end{aligned} \right.$$

因此，当 $\rho > 1$ 时，此反常积分收敛，其值为 $\frac{a^{1 - p}}{p - 1}$ ;当 $\dot{p} \leq 1$ 时，此反常积分发散.

## 4.7.2无界函数的反常积分

下面把定积分推广到被积函数为无界函数的情形

如果函数 $f(x)$ 在点a的任一邻域内都无界，那么点a称为函数 $f(x)$ 的瑕点.无界函数的反常积分又称为瑕积分

定义4.5 设函数 $f ( x )$ 在 $(a,b]$ 上连续，点a为 $f(x)$ 的瑕点.取 $t > a$ ，如果极限

$$\lim_{t \to a^{+}} \int_{t}^{b} f(x)   dx$$

存在，则称此极限为函数 $f ( x )$ 在 $( a , b ]$ 上的反常积分，仍然记作 $\int_{a}^{b} f(x)   dx$ ,即

[page:142]

## 第4章 定积分与不定积分

$$\int_{a}^{b} f(x)   \mathrm{d}x = \lim_{t \to a^{+}} \int_{t}^{b} f(x)   \mathrm{d}x,$$

这时也称反常积分 $\int_{a}^{b} f(x)   dx$ 收敛，如果上述极限不存在，则称反常积分 $\int_{a}^{b} f(x)   dx$发散.

类似地，设函数f(x)在[a,b)上连续，点b为 $f ( x )$ 的瑕点.取 $t \leq b$ ，如果极限

$$\lim_{t \to b} \int_{a}^{t} f(x)   dx$$

存在，则定义

$$\int_{a}^{b} f(x)   \mathrm{d}x = \lim_{t \to b^{-}} \int_{a}^{t} f(x)   \mathrm{d}x,$$

否则，称反常积分 $\int_{a}^{b} f(x)   dx$ 发散.

设函数 $f ( x )$ 在 $\left[ a , b \right]$ 上除点 $c(a < c < b)$ 外连续，点c为 $f ( x )$ 的瑕点.如果两个反常积分

$$\int_{a}^{c} f(x) \mathrm{d}x, \quad \int_{c}^{b} f(x) \mathrm{d}x$$

都收敛，则定义

$$\int_{a}^{b} f(x) \mathrm{d}x = \int_{a}^{c} f(x) \mathrm{d}x + \int_{c}^{b} f(x) \mathrm{d}x,$$

否则称反常积分 $\int_{a}^{b} f(x)   dx$ 发散.

计算无界函数的反常积分，也可借助于牛顿-莱布尼茨公式

设 $x = a$ 为 $f ( x )$ 的瑕点，在 $(a,b]$ 上 $F^{\prime}(x) = f(x)$ ，如果极限 $\lim_{x \to a^{+}} F(x)$ 存在，则反常积分

$$\int_{a}^{b} f(x) \mathrm{d}x = F(b) - \lim_{x \to a^{+}} F(x) = F(b) - F(a^{+});$$

如果 $\lim_{x \to a^{+}} F(x)$ 不存在，则反常积分 $\int_{a}^{b} f(x)   dx$ 发散.

如果仍用记号 $\widehat{ } F(x)$ 来表示 $F(b) - F(a^{+})$ ，则形式上仍有

$$\int_{a}^{b} f(x)   dx = \left[ F(x) \right]_{a}^{b}.$$

对于 $f ( x )$ 在 $[ a , b )$ 上连续，b为瑕点的反常积分，也有类似的计算公式，这里不再详述.

例4.70 计算反常积分

$$\int_{0}^{a} \frac{\mathrm{d}x}{\sqrt{a^2 - x^2}} \quad (a > 0).$$

解因为

[page:143]

## 4.7 反常积分

$$\lim_{x \to a^{-}} \frac{1}{\sqrt{a^{2} - x^{2}}} = +\infty,$$

所以点a是瑕点，于是

$$\int_{0}^{a} \frac{\mathrm{d}x}{\sqrt{a^{2} - x^{2}}} = \left[ \arcsin \frac{x}{a} \right]_{0}^{a} = \lim_{x \to a^{-}} \arcsin \frac{x}{a} - 0 = \frac{\pi}{2}.$$

这个反常积分值的几何意义是位于曲线 $y =$ $\frac{1}{\sqrt{a^{2}-x^{2}}}$ 之下，直线 $x = 0$ 与 $x = a$ 之间的图形面积(图4.14).

例4.71 讨论反常积分 $\int_{-1}^{1} \frac{\mathrm{d}x}{x^2}$ 的收敛性.

解被积函数 $f(x) = \frac{1}{x^{2}}$ 在积分区间 $\left[ -1,1 \right]$上除 $x = 0$ 外连续，且 $\lim_{x \to 0} \frac{1}{x^2} = \infty$

由于

$$\int _ { - 1 } ^ { 0 } \frac { \mathrm { d } x } { x ^ { 2 } } = \left[ - \frac { 1 } { x } \right] _ { - 1 } ^ { 0 } = \lim _ { x \rightarrow 0 } \left( - \frac { 1 } { x } \right) - 1 = + \infty ,$$

图4.14

即反常积分 $\int_{-1}^{0} \frac{\mathrm{d}x}{x^2}$ 发散，所以反常积分 $\int_{-1}^{1} \frac{\mathrm{d}x}{x^2}$ 发散.

例4.72 证明反常积分 $\int_{a}^{b}\frac{\mathrm{d}x}{\left ( x=a \right ) ^{q}}$ 当 $0 < q < 1$ 时收敛，当 $q \geqslant 1$ 时发散.

证当 $q = 1$ 时

$$\int_{a}^{b}\frac{\mathrm{d}x}{(x - a)^{q}} = \int_{a}^{b}\frac{\mathrm{d}x}{x - a} = \left[ \ln(x - a) \right]_{a}^{b} = \ln(b - a) - \lim_{x \rightarrow a^{+}}\ln(x - a) = + \infty.$$

当 $q \neq 1$ 时

$$\int_{a}^{b} \frac{\mathrm{d}x}{(x - a)^q} = \left[ \frac{(x - a)^{1-q}}{1 - q} \right]_{a}^{b} = \left\{ \begin{aligned} & \frac{(b - a)^{1-q}}{1 - q}, & 0 < q < 1, \\ & +\infty, & q > 1. \end{aligned} \right.$$

因此，当 $0 < q < 1$ 时，此反常积分收敛，其值为 $\frac{(b - a)^{1 - q}}{1 - q}$ ;当 $q { \geqslant } 1$ 时，此反常积分发散.

[page:144]

## 第4章 定积分与不定积分

## 习题4.7

1. 判定下列各反常积分的收敛性，如果收敛，计算反常积分的值:

(1) $\int_{1}^{+\infty} \frac{\mathrm{d}x}{x^4};$ (2) $\int_{1}^{+\infty} \frac{\mathrm{d}x}{\sqrt{x}};$ (3) $\int_{0}^{+\infty} \mathrm{e}^{-ax}   \mathrm{d}x (a > 0) ;$ (4) $\int_{0}^{+\infty} \frac{\mathrm{d}x}{\left(1 + x\right)\left(1 + x^{2}\right)};$

(5) $\int _ { 0 } ^ { + \infty } \mathrm { e } ^ { - p t } \sin \omega t \mathrm { d } t ( p > 0 , \omega > 0 ) ;$ 44 (6) $\int_{-\infty}^{+\infty} \frac{\mathrm{d}x}{x^2 + 2x + 2};$ (7) $\int_{0}^{1} \frac{x \mathrm{d}x}{\sqrt{1 - x^{2}}}$

(8) $\int_{0}^{2} \frac{\mathrm{d}x}{(1 - x)^{2}}$ (9) $\int_{1}^{2}\frac{x\mathrm{d}x}{\sqrt{x - 1}}$ (10) $\int_{1}^{\mathrm{e}} \frac{\mathrm{d}x}{x \sqrt{1 - (\ln x)^2}}$ ; (11) $\int_{0}^{+\infty} \frac{\mathrm{d}x}{\mathrm{e}^{x+1} + \mathrm{e}^{3-x}}$

(12) $\int_{\frac{1}{2}}^{\frac{3}{2}}\frac{\mathrm{d}x}{\sqrt{\left | x^{2}-x \right | }}$ (13) $\int_{0}^{+\infty} \mathrm{e}^{-x} \cos x \mathrm{d}x ;$ (14) $\int_{2}^{+\infty} \frac{\mathrm{d}x}{x^2 - x};$ (15) $\int_{1}^{+\infty} \frac{\mathrm{d}x}{x \sqrt{x - 1}}$

(16) $\int_{-\infty}^{+\infty} \frac{\mathrm{d}x}{(1 + x^2)^n};$ (17) $\int_{0}^{1} x \ln^{n} x   dx ;$ (18) $\int_{a}^{b}\frac{x\mathrm{d}x}{\sqrt{(x - a)(b - x)}}(a < b)$

(19) $\int_{1}^{+\infty} \frac{\arctan x}{x^2}   dx;$ (20) $\int_{1}^{2}\frac{\mathrm{d}x}{x\sqrt{x^{2}-1}}$ (21) $\int_{0}^{1} \frac{x \mathrm{d}x}{\sqrt{1 - x^{2}}}; \quad (22) \int_{0}^{+ \infty} \frac{\mathrm{d}x}{1 + x^{3}};$

(23) $\int_{1}^{+\infty} \frac{\ln^2 x}{x^2}   dx ;$ (24) $\int_{-\infty}^{0} x \mathrm{e}^{-x^2}  \mathrm{d}x ;$ (25) $\int_{0}^{+\infty} \frac{\arctan x}{\left(1+x^{2}\right)^{3/2}} \mathrm{d}x;$

(26) $\int_{0}^{+\infty} \frac{\mathrm{d}x}{\left(x^2 + a^2\right)\left(x^2 + b^2\right)} (a \cdot b \neq 0);$ 一一 (27) $\int_{0}^{1} \frac{\mathrm{d}x}{(2 - x)\sqrt{1 - x}}$ (28) $\int_{1}^{5}\frac{x\mathrm{d}x}{\sqrt{5 - x}}$

2.当k为何值时，反常积分 $\int_{2}^{+\infty} \frac{\mathrm{d}x}{x(\ln x)^k}$ 收敛？当k为何值时，此反常积分发散？

3. 利用递推公式计算反常积分 $I_{n} = \int_{0}^{+ \infty}x^{n}\mathrm{e}^{- x}\mathrm{d}x (n \in \mathbf{N})$

4. 计算下列反常积分:

(1) $\int_{0}^{\frac{\pi}{2}}\left|\arcsin x\mathrm{d}x\right|$ (2) $\int_{0}^{+\infty} \frac{\mathrm{d}x}{\left(1+x^2\right)\left(1+x^\alpha\right)} (\alpha \geqslant 0)$

(3) $\int_{2}^{+\infty} \frac{x \ln x}{(x^2 - 1)^2}   dx;$ (4) $\int_{0}^{\frac{\pi}{2}}\mathrm{l}\mathrm{n}\mathrm{cos}x\mathrm{d}x ;$ (5) $\int_{1}^{+\infty} \frac{\mathrm{d}x}{x \sqrt{1+x^5+x^{10}}}$

5. 求由曲线 $y = x \mathrm{e}^{-2x^2}$ 和x轴的正方向所围成的面积.

6.设位于坐标原点O处有一质量为m的质点，另有一单位质量的质点P位于x轴上距原点为x处.由万有引力定律知，此两质点间的引力为 $F = \frac{km}{x^{2}}$ ，其中k为常数.试求质点P从$x  三  r$ 移动到无穷远处，引力F所做的功.

[page:145]

# 第5章微分方程

微分方程几乎是和微积分同时产生的，它的发展始于17世纪末，当时，力学、天文学、物理学以及工程技术提出了大量的问题需要解决.在这些问题中，有许多是要寻求函数关系，以便人们对客观事物的运动、变化过程进行规律性的研究，因此如何寻求函数关系，在实践中具有重要意义，在许多问题中，往往不能直接找出所需要的函数关系，但是根据问题所提供的情况，有时可以列出含有要找的函数及其导数的关系式，这样的关系式就是微分方程，微分方程建立以后，对它进行研究，找出未知函数来，这就是解微分方程.

## 5.1 微分方程的基本概念

下面通过几个具体例子来引出微分方程的基本概念.

例5.1 放射性元素的质量随着时间的延长而逐渐减少，称为衰变现象.由实验得知，在任一时刻t，镭的衰变速率与该时刻镭的质量成正比.假定镭在初始时刻 $t _ { 0 }$ 的质量为 $N_{0}$ ，试求镭的衰变规律.

解设镭在时刻t的质量为 $N \equiv N(t)$ ，则根据实验结果得到

$$\frac{\mathrm{d}N(t)}{\mathrm{d}t} = -kN(t), \quad k > 0.\tag{5.1}$$

根据初始时刻的已知条件有

$$N(t) \mid_{t = t_0} = N_0.\tag{5.2}$$

如果能设法解出未知函数 $N(t)$ ，便得到镭的衰变规律 $N = N(t)$

例5.2一曲线通过点(1，2)，且在该曲线上任一点 $M(x,y)$ 处的切线的斜率为 $2 x$ ，求这曲线的方程.

解设所求曲线的方程为 $y = y(x)$ .根据导数的几何意义，可知未知函数$y = y(x)$ 应满足关系式

$$\frac{\mathrm{d}y}{\mathrm{d}x} = 2x.\tag{5.3}$$

此外，未知函数 $y = y(x)$ 还应满足条件

[page:146]

## 第5章微分方程

$$x = 1   时 , \quad y = 2.\tag{5.4}$$

式(5.3)两端积分，得

$$y = \int 2x   dx$$

即

$$y = x^{2} + C,\tag{5.5}$$

其中C为任意常数.

把条件“ $x = 1$ 时， $y = 2$ 代入式(5.5)，得

$$2 = 1^{2} + C,$$

由此定出 $C { \equiv } 1$ .把C=1代入式(5.5)，即得所求曲线方程

$$y = x^{2} + 1.\tag{5.6}$$

例5.3设有一质量为m的物体，受重力作用垂直下落.试求物体的运动规律.

解 取坐标系如图5.1所示.

设t时刻落体的位移为 $s \equiv s(t)$ ，则由牛顿第二定律得到

即

$$\overline { { m g } } = m \frac { \mathrm { d } ^ { 2 } s } { \mathrm { d } t ^ { 2 } } ,$$

$$\frac { \mathrm { d } ^ { 2 } s } { \mathrm { d } t ^ { 2 } } = g ,\tag{5.7}$$

其中 为重力加速度.这个方程很容易求解:两端对t求不定积 $g$分，得

$$\frac{\mathrm{d}s}{\mathrm{d}t} = g t + C_1.$$

再对t求不定积分，得

$$s = \frac{1}{2}gt^{2} + C_{1}t + C_{2}\tag{5.8}$$

其中 $C_{1},C_{2}$ 为两个任意常数.因此还不能确定物体的运动规律.为了确定它，还必须知道落体的初始状态，即初始位置和初始速度.假定初始位置为 $s \mid_{t = 0} = 0$ ，初始速度为 $\left. \frac{\mathrm{d}s}{\mathrm{d}t} \right|_{t = 0} = 0$ ，则可确定 $C_{1} = 0, C_{2} = 0$ ，从而得到自由落体的运动规律

$$s = \frac { 1 } { 2 } g t ^ { 2 } .\tag{5.9}$$

例5.1~例5.3中的关系式(5.1)，(5.3)和(5.7)都含有未知函数的导数，它们都是微分方程.一般地，凡表示未知函数、未知函数的导数与自变量之间的关系的方程，叫做微分方程，未知函数是一元函数的，叫做常微分方程；未知函数是多元函数的，叫做偏微分方程.微分方程有时也简称方程

[page:147]

## 5.1 微分方程的基本概念

微分方程中所出现的未知函数的最高阶导数的阶数，叫做微分方程的阶.例如，方程(5.1)和(5.3)是一阶微分方程；方程(5.7)是二阶微分方程，又如方程

$$x^{3}y'' + x^{2}y' - 4xy' = 3x^{2}$$

是三阶微分方程；方程

$$y^{(4)}-4y^{\prime\prime}+10y^{\prime}-12y^{\prime}+5y=\sin 2x$$

是四阶微分方程

一般地，n阶微分方程的形式是

$$F(x,y,y^{\prime},\cdots,y^{(n)}) = 0\tag{5.10}$$

其中F为n+2个变量的函数.这里必须指出，在方程(5.10)中， $y^{(n)}$ 是必须出现的，而 $x,y,y^{'},\cdots,y^{(n-1)}$ 等变量则可以不出现.例如，n阶微分方程

$$y^{(n)} + 1 = 0$$

中，除 $y^{(n)}$ 外，其他变量都没有出现

如果能从方程(5.10)中解出最高阶导数，则得微分方程

$$y^{(n)} = f(x,y,y^{\prime},\cdots,y^{(n-1)}).\tag{5.11}$$

由前面的例子可以看到，在研究某些实际问题时，首先要建立微分方程，然后找出满足微分方程的函数(解微分方程).就是说，找出这样的函数，把这函数代入微分方程能使方程成为恒等式.这个函数就叫做该微分方程的解.确切地说，设函数 $y = \varphi (x)$ 在区间I上有n阶连续导数，如果在区间I上，

$$F \left[ x , \varphi \left( x \right) , \varphi ^ { \prime } \left( x \right) , \cdots , \varphi ^ { \left( n \right) } \left( x \right) \right] \equiv 0 ,$$

那么函数 $y = \varphi (x)$ 就叫做微分方程(5.10)在区间I上的解.

例如，函数(5.5)和(5.6)都是微分方程(5.3)的解；函数(5.8)和(5.9)都是微分方程(5.7)的解.

如果微分方程的解中含有相互独立的任意常数，且任意常数的个数与微分方程的阶数相同，这样的解叫做微分方程的通解.例如，函数(5.5)是方程(5.3)的解，它含有一个任意常数，而方程(5.3)是一阶的，所以函数(5.5)是方程(5.3)的通解；又如函数(5.8)是方程(5.7)的解，它含有两个独立的任意常数，而方程(5.7)是二阶的，所以函数(5.8)是方程(5.7)的通解.

由于通解中含有任意常数，所以它还不能完全确定地反映某一客观事物的规律性.要完全确定地反映客观事物的规律性，必须确定这些常数的值.为此，要根据问题的实际情况，提出确定这些常数的条件.例如，例5.1中的条件(5.2)，例5.2中的条件(5.4)便是这样的条件.

设微分方程中的未知函数为 $y = y(x)$ ，如果微分方程是一阶的，通常用来确定任意常数的条件是

$$x = x_{0}  时 , \quad y = y_{0},$$

或写成

[page:148]

## 第5章 微分方程

$$y \mid_{x = x_{0}} = y_{0}$$

其中 $\mathcal{X}_{0} \cdot \mathcal{Y}_{0}$ 都是给定的值；如果微分方程是二阶的，通常用来确定任意常数的条件是

$$x = x_{0} \quad  时 , \quad y = y_{0}, \quad y^{\prime} = y_{0}^{\prime},$$

或写成

$$y \mid_{x = x_{0}} = y_{0}, \quad y^{\prime} \mid_{x = x_{0}} = y_{0}^{\prime},$$

其中 $\mathcal { X } _ { 0 } \mathbin { \ast } \mathcal { Y } _ { 0 }$ 和 $y^{\prime}_{0}$ 都是给定的值.上述这种条件叫做初始条件.

确定了通解中的任意常数以后，就得到微分方程的特解.例如式(5.6)是方程(5.3)满足条件(5.4)的特解；式(5.9)是方程(5.7)满足条件 $s \mid_{t = 0} = 0$ 和 $\left. \frac{\mathrm{d}s}{\mathrm{d}t} \right|_{t = 0} = 0$的特解.

求微分方程 $y^{\prime} = f(x,y)$ 满足初始条件 $y \mid_{x = x_{0}} = y_{0}$ 的特解这样一个问题，叫做一阶微分方程的初值问题，记作

$$\begin{cases}y^{\prime} = f(x, y), \\y \mid_{x = x_0} = y_0.\end{cases}\tag{5.12}$$

微分方程的解的图形是一族曲线，叫做微分方程的积分曲线.初值问题(5.12)的几何意义，就是求微分方程的通过点 $(x_{0},y_{0})$ 的那条积分曲线.二阶微分方程的初值问题

$$\left\{ y^{\prime \prime} = f(x,y,y^{\prime}) \atop y \mid_{x = x_0} = y_0, y^{\prime} \mid_{x = x_0} = y_0^{\prime} \right\}$$

的几何意义是:求微分方程的通过点 $(x_{0},y_{0})$ 且在该点处的切线斜率为 $y^{\prime}_{0}$ 的那条积分曲线.

## 习题5.1

1. 指出下列各题中的函数是否为所给微分方程的解:

(1) $xy^{\prime} = 2y, y = 5x^{2}$

(2) $y^{\prime\prime} + y = 0, \quad y = 3\sin x - 4\cos x;$

(3) $y^{\prime\prime} - 2y^{\prime} + y = 0, y = x^{2}\mathrm{e}^{x}$

(4) $y ^ { \prime } - \left( \lambda _ { 1 } + \lambda _ { 2 } \right) y ^ { \prime } + \lambda _ { 1 } \lambda _ { 2 } y = 0 , y = C _ { 1 } \mathrm { e } ^ { \lambda _ { 1 } x } + C _ { 2 } \mathrm { e } ^ { \lambda _ { 2 } x } ;$

(5) $\frac{\mathrm{d}y}{\mathrm{d}x}-2y=0,y=\sin x,y=\mathrm{e}^{2x},y=C\mathrm{e}^{2x};$

(6) $4y^{\prime}=2y-x,y=\frac{1}{2}x+1,y=Ce^{x/2},y=Ce^{x/2}+\frac{x}{2}+1.$

2. 在下列各题中，验证所给二元方程所确定的函数为所给微分方程的解:

(1) $(x - 2y)y^{\prime} = 2x - y,x^{2} - xy + y^{2} = C;$

[page:149]

## 5.2 可分离变量的微分方程

(2) $(xy - x)y^{\prime\prime} + xy^{\prime 2} + yy^{\prime} - 2y^{\prime} = 0, \quad y = \ln(xy).$

3.在下列各题中，确定函数关系式中所含的参数，使函数满足所给的初始条件:

(1) $x^{2}-y^{2}=C, \left.y\right|_{x=0}=5$

(2) $y = \left( C _ { 1 } + C _ { 2 } . x \right) \mathrm{e} ^ { 2 x } , y | _ { x = 0 } = 0 , y ^ { \prime } | _ { x = 0 } = 1 ;$

(3) $y = C_{1}\sin(x - C_{2}), \quad y|_{x = \pi} = 1, \quad y^{\prime}|_{x = \pi} = 0.$

4. 求下列微分方程满足所给初始条件的解:

(1) $\left\{ \begin{aligned} \frac{\mathrm{d}y}{\mathrm{d}t} = & \sin t, \\ y|_{t = 0} = & 0; \end{aligned} \right.$ (2) $\left\{ \begin{aligned} y^{\prime} &= \frac{1}{x}, \\ y \mid_{x = \mathrm{e}} &= 0; \end{aligned} \right.$ (3) $\begin{cases}\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} = 6x, \\y \mid_{x = 0} = 0, \\y^{\prime} \mid_{x = 0} = 2.\end{cases}$

5.写出由下列条件确定的曲线所满足的微分方程:

(1) 曲线在点 $( x , y )$ 处的切线的斜率等于该点横坐标的平方；

(2) 曲线上点 $P(\bar{x},y)$ 处的法线与 $\mathcal { X }$ 轴的交点为Q，且线段 $P Q$ 被y轴平分.

6. 用微分方程表示一物理命题:某种气体的压强 $\dot{p}$ 对于温度T的变化率与压强成正比，与温度的平方成反比.

## 5.2 可分离变量的微分方程

下面讨论一阶微分方程

$$y' = f(x,y)\tag{5.13}$$

的一些解法.

一阶微分方程有时也写成对称形式

$$P(x,y)\mathrm{d}x + Q(x,y)\mathrm{d}y = 0.\tag{5.14}$$

在方程(5.14)中，变量x与y对称，它既可看成是以x为自变量、y为未知函数的方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} = - \frac{P(x,y)}{Q(x,y)} \quad (Q(x,y) \neq 0),$$

也可看成是以y为自变量、x为未知函数的方程

$$\frac{\mathrm{d}x}{\mathrm{d}y} = - \frac{Q(x,y)}{P(x,y)}$$

(这时 $P(x,y) \ne 0$

在例5.2中，遇到一阶微分方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} = 2x   ,$$

或

$$\mathrm{d}y = 2x\mathrm{d}x.$$

把上式两端积分就得到这个方程的通解

[page:150]

## 第5章微分方程

$$y = x^{2} + C.$$

但是并不是所有的一阶微分方程都能这样求解.例如，对于一阶微分方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} = 2xy^{2}\tag{5.15}$$

就不能像上面那样用直接对两端积分的方法求出它的通解.这是什么缘故呢?原因是方程(5.15)的右端含有未知函数 $\mathcal { Y }$ ，积分

$$\int 2xy^{2} \mathrm{d}x$$

求不出来，这是困难所在.为了解决这个困难，在方程(5.15)的两端同时乘以 $\frac{\mathrm{d}x}{y^{2}}$使方程(5.15)变为

$$\frac{\mathrm{d}y}{y^{2}} = 2x\mathrm{d}x,$$

这样，变量 $\mathcal { X }$ 与 $\mathcal { Y }$ 已分离在等式的两端，然后两端积分得

$$-\frac{1}{y} = x^{2} + C,$$

或

$$y = - \frac{1}{x^{2} + C},\tag{5.16}$$

其中C是任意常数.

可以验证，函数(5.16)确实满足一阶微分方程(5.15)，且含有一个任意常数，所以它是方程(5.15)的通解.

一般地，如果一个一阶微分方程能写成

$$g(y) \mathrm{d}y = f(x) \mathrm{d}x\tag{5.17}$$

的形式，就是说，能把微分方程写成一端只含 $\mathcal { Y }$ 的函数和 $\mathrm{d}y$ ，另一端只含 $x$ 的函数和dx，那么原方程就称为可分离变量的微分方程

假定方程(5.17)中的函数 $g(y)$ 和 $f ( x )$ 是连续的.设 $y = \varphi (x)$ 是方程(5.17)的解，将它代入(5.17)中得到恒等式

$$g \left[ \varphi \left( x \right) \right] \varphi ^ { \prime } \left( x \right) \mathrm{d}x = f \left( x \right) \mathrm{d}x.$$

将上式两端积分，并由 $y = \varphi (x)$ 引进变量 $\mathcal { Y }$ ,得

$$\int g(y)   dy = \int f(x)   dx.$$

[page:151]

## 5.2 可分离变量的微分方程

设 $G(y)$ 及 $F(x)$ 依次为 $g(y)$ 及 $f ( x )$ 的原函数，于是有

$$G(y) = F(x) + C.\tag{5.18}$$

因此，方程(5.17)的解满足关系式(5.18).反之，如果 $y = \varphi (x)$ 是由关系式(5.18)所确定的隐函数，那么在 $g(y) \neq 0$ 的条件下， $y = \varphi (x)$ 也是方程(5.17)的解，事实上，由隐函数的求导法可知，当 $g(y) \neq 0$ 时，

$$\varphi^{\prime}(x)=\frac{F^{\prime}(x)}{G^{\prime}(y)}=\frac{f(x)}{g(y)},$$

这就表示函数 $y = \varphi (x)$ 满足方程(5.17).所以，如果已分离变量的方程(5.17)中，$g(y)$ 和 $f ( x )$ 是连续的，且 $g(y) \neq 0$ ，那么式(5.17)两端积分后得到的关系式(5.18)，就用隐式给出了方程(5.17)的解，式(5.18)就叫做微分方程(5.17)的隐式解.又由于关系式(5.18)中含有任意常数，因此式(5.18)所确定的隐函数是方程(5.17)的通解，所以式(5.18)叫做微分方程(5.17)的隐式通解(当 $f(x) \neq 0$ 时，式(5.18)所确定的隐函数 $x = \phi(y)$ 也可认为是方程(5.17)的解).

例5.4 求微分方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} = 2xy\tag{5.19}$$

的通解.

解 方程(5.19)是可分离变量的，分离变量后得

$$\frac{\mathrm{d}y}{y} = 2x\mathrm{d}x,$$

两端积分

$$\int \frac{\mathrm{d}y}{y} = \int 2x\mathrm{d}x,$$

得

$$\ln | y | = x^{2} + C_{1},$$

从而

$$y = \pm \mathrm{e}^{x^{2} + C_{1}} = \pm \mathrm{e}^{C_{1}}\mathrm{e}^{x^{2}}.$$

因 $\pm \mathrm{e}^{C_{1}}$ 仍是任意常数，把它记作C，便得方程(5.19)的通解

$$y = C\mathrm{e}^{x^{2}}.$$

例5.5 放射性元素铀由于不断地有原子放射出微粒子而变成其他元素，铀的含量就不断减少，这种现象叫做衰变.由原子物理学知道，铀的衰变速度与当时未衰变的铀原子的含量M成正比.已知 $t = 0$ 时铀的含量为 $M_{0}$ ，求在衰变过程中铀含量 $M ( t )$ 随时间t变化的规律.

解铀的衰变速度就是 $M ( t )$ 对时间t 的导数 $\frac { \mathrm { d } M } { \mathrm { d } t } .$ 由于铀的衰变速度与其含量成正比，故得微分方程

[page:152]

## 第5章 微分方程

$$\frac{\mathrm{d}M}{\mathrm{d}t} = - \lambda M,\tag{5.20}$$

其中 $\lambda ( \lambda > 0 )$ 是常数，叫做衰变系数，λ前置负号是由于当t增加时M单调减少，即$\frac{\mathrm{d}M}{\mathrm{d}t} < 0$ 的缘故.

按题意，初始条件为

$$M \mid_{t=0} = M_0.$$

方程(5.20)是可分离变量的.分离变量后得

$$\frac{\mathrm{d}M}{M} = -\lambda \mathrm{d}t.$$

两端积分

$$\int \frac{\mathrm{d}M}{M} = \int ( - \lambda ) \mathrm{d}t,$$

以lnC表示任意常数，考虑到 $M > 0$ ,得

$$\ln M = - \lambda t + \ln C,$$

即

这就是方程(5.20)的通解.以初始条件代入上式，得

所以

$$M = C \mathrm{e}^{-\lambda t}.$$

$$M_{0} = C\mathrm{e}^{0} = C,$$

$$M = M _ { 0 } \mathrm { e } ^ { - \lambda t } ,$$

图5.2 这就是所求铀的衰变规律.由此可见，铀的含量随时间的增加而按指数规律衰减(图5.2).

例5.6 设某容器内有100L盐水，其中含盐10kg.现以 $2 L / min$ 的速度注入净水，并以同样速度使混合后的盐水流出(图5.3).容器内有搅拌器，可以认为混合后的盐水在同一时刻、在每一点都有相同的浓度.试求容器内的含盐量.又问:几

分钟后，溶液的浓度为 $3\%  kg/L$

解 第一步 列出微分方程.

这里用微元法.

设t时刻溶液中的含盐量为 $Q(t)$ ，考虑任意时间区间 $\left[ t , t + \mathrm{d}t \right]$ .在dt时间内，溶液中含盐量的改变量为

$$Q(t + \mathrm{d}t) - Q(t) \approx \mathrm{d}Q.$$

又显然有

$Q(t + \mathrm{d}t) = Q(t) +$ 流进的盐量 $Q _ { 1 }$ 一流出的盐量 $Q _ { 2 }$即

[page:153]

## 5.2 可分离变量的微分方程

$$\mathrm{d}Q \approx Q(t + \mathrm{d}t) - Q(t) = Q_1 - Q_2.$$

而

$$\begin{aligned}Q_{1} &= 0, \\Q_{2} &\approx  浓度  \times  体积  \approx \frac{Q(t)}{100 + (2t - 2t)} \cdot 2\mathrm{d}t \\&= \frac{2Q(t)}{100}\mathrm{d}t = \frac{Q}{50}\mathrm{d}t.\end{aligned}$$

因为 $\mid \mathrm{d}t \mid$ 很短，所以可以认为在dt时间内，溶液的浓度不变，就取为t时刻的浓度，于是得到微分方程

$$\mathrm{d}Q = - \frac{Q}{50} \mathrm{d}t.$$

这是可分离变量的方程.

第二步 求解初值问题.

$$\left\{ \begin{aligned} \mathrm{d}Q &= - \frac{Q}{50}\mathrm{d}t, \\ Q \mid_{t = 0} &= 10. \end{aligned} \right.$$

分离变量，得

$$\frac{\mathrm{d}Q}{Q} = - \frac{1}{50} \mathrm{d}t.$$

两边积分，有

$$\ln Q = - \frac{t}{50} + C_{1},$$

即

$$Q = C \cdot \mathrm{e}^{-\frac{t}{50}} (C = \mathrm{e}^{C_1}).$$

将初始条件 $Q(t) \mid_{t = 0} = 10$ 代入上式，得 $C = 1 0$ ，于是得到

$$Q(t) = 10\mathrm{e}^{-\frac{t}{50}}$$

由上式可解出

$$t = 50(\ln 10 - \ln 3)\min = 50(2.3026 - 1.0986)\min = 60.2\min$$

即经过1小时又12秒后，溶液的浓度为 $3\%  kg/L$ a

例5.7 有高为1m的半球形容器，水从它的底部小孔流出，小孔横截面积为 $\mathrm{1cm^{2}}$ (图5.4).开始时容器内盛满了水，求水从小孔流出过程中容器里水面的高度h(水面与孔口中心间的距离)随时间t变化的规律.

解 由水力学知道，水从孔口流出的流量

图5.4

[page:154]

## 第5章 微分方程

(即通过孔口横截面的水的体积V对时间t的变化率)Q满足公式

$$Q = \frac{\mathrm{d}V}{\mathrm{d}t} = 0.62S \sqrt{2gh} ,$$

其中0.62为流量系数;S为孔口横截面面积； $( g$ 为重力加速度.现在孔口横截面面积 $S = 1  cm ^2$ ,故

$$\frac{\mathrm{d}V}{\mathrm{d}t}=0.62\ \sqrt{2gh} ,$$

或

$$\mathrm{d}V = 0.62 \sqrt{2gh}   \mathrm{d}t.\tag{5.21}$$

另一方面，设在微小时间间隔 $\left[ t , t + \mathrm{d}t \right]$ 内，水面高度由h降至 $h + \mathrm{d}h \left( \mathrm{d}h < 0 \right)$则又可得到

$$\mathrm{d}V = - \pi r^{2} \mathrm{d}h,\tag{5.22}$$

其中r为时刻t的水面半径(图5.4)，右端置负号是由于 $\mathrm{d}h < 0$ 而 $\mathrm{d}V \gg 0$ 的缘故.又因

$$r = \sqrt{100^{2} - (100 - h)^{2}} = \sqrt{200h - h^{2}}$$

所以式(5.22)变成

$$\mathrm{d}V = - \pi (200h - h^{2}) \mathrm{d}h.\tag{5.23}$$

比较(5.21)和(5.23)两式，得

$$0.62\sqrt{2gh}\mathrm{d}t=-\pi(200h-h^{2})\mathrm{d}h,\tag{5.24}$$

这就是未知函数 $h = h(t)$ 应满足的微分方程.

此外，开始时容器内的水是满的，所以未知函数 $h = h(t)$ 还应满足初始条件

$$\bar { h } \mid _ { t = 0 } \equiv 1 0 0 .\tag{5.25}$$

方程(5.24)是可分离变量的.分离变量后得

$$\mathrm{d}t = - \frac{\pi}{0.62\sqrt{2g}} \left( 200h^{\frac{1}{2}} - h^{\frac{3}{2}} \right) \mathrm{d}h.$$

两端积分，得

$$t = - \frac{\pi}{0.62 \sqrt{2g}} \int \left( 200h^{\frac{1}{2}} - h^{\frac{3}{2}} \right) dh,$$

即

$$t = - \frac{\pi}{0.62 \sqrt{2g}} \left( \frac{400}{3} h^{\frac{3}{2}} - \frac{2}{5} h^{\frac{5}{2}} \right) + C,\tag{5.26}$$

其中C为任意常数.

把初始条件(5.25)代入式(5.26)，得

$$0 = - \frac{\pi}{0.62 \sqrt{2g}} \left( \frac{400}{3} \times 100^{\frac{3}{2}} - \frac{2}{5} \times 100^{\frac{5}{2}} \right) + C,$$

[page:155]

## 5.2 可分离变量的微分方程

因此

$$C = \frac{\pi}{0.62 \sqrt{2g}} \left( \frac{400000}{3} - \frac{200000}{5} \right) = \frac{\pi}{0.62 \sqrt{2g}} \times \frac{14}{15} \times 10^5.$$

把所得的C值代入式(5.26)并化简，就得

$$t = \frac{\pi}{4.65\ \sqrt{2g}}\left( 7 \times 10^{5} - 10^{3}h^{\frac{3}{2}} + 3h^{\frac{5}{2}} \right).$$

上式表达了水从小孔流出的过程中容器内水面高度h与时间t之间的函数关系.

这里还要指出，例5.7是通过对微元dV的分析得到微分方程(5.24)的.这种微元分析的方法，也是建立微分方程的一种常用方法

1. 求下列微分方程的通解:

(1) $xy^{\prime}-y\ln y=0;\quad (2)\ 3x^{2}+5x-5y^{\prime}=0$

(3) $\sqrt{1 - x^{2}}y^{\prime} = \sqrt{1 - y^{2}}$ (4) $y^{\prime} - xy^{\prime} = a(y^{2} + y^{\prime})$

(5) $\sec ^{2}x\tan y\mathrm{d}x+\sec ^{2}y\tan x\mathrm{d}y=0;$ (6) $\frac{\mathrm{d}y}{\mathrm{d}x}=10^{x+y}$

(7) $\left( \mathrm{e}^{x + y} - \mathrm{e}^{x} \right) \mathrm{d}x + \left( \mathrm{e}^{x + y} + \mathrm{e}^{y} \right) \mathrm{d}y = 0$ (8) $\cos x\sin y\mathrm{d}x+\sin x\cos y\mathrm{d}y=0$ P

(9) $(y + 1)^{2} \frac{\mathrm{d}y}{\mathrm{d}x} + x^{3} = 0;$ (10) $y\mathrm{d}x + \left( x^{2} - 4x \right)\mathrm{d}y = 0;$

(11) $(t + 2)\frac{\mathrm{d}x}{\mathrm{d}t} = 3x + 1;$ (12) $y - xy^{\prime} = a(y^{2} + y^{\prime})$

(13) $xy(y - xy^{\prime}) = x + yy^{\prime};$ (14) $y^{2}\mathrm{d}x + y\mathrm{d}y = x^{2}y\mathrm{d}y - \mathrm{d}x.$

2. 求下列微分方程满足所给初始条件的特解:

(1) $y^{\prime} = \mathrm{e}^{2x - y}, y|_{x = 0} = 0;$ (2) $\cos x\sin y\mathrm{d}y=\cos y\sin x\mathrm{d}x,y|_{x = 0}=\frac{\pi}{4}$

(3) $y^{\prime} \sin x = y \ln y, \left. y \right|_{x = \frac{\pi}{2}} = \mathrm{e};$ (4) $\cos y\mathrm{d}x+\left(1+\mathrm{e}^{-x}\right)\sin y\mathrm{d}y=0,\left.y\right|_{x=0}=\frac{\pi}{4}$

(5) $x\mathrm{d}y + 2y\mathrm{d}x = 0, \left. y \right|_{x = 2} = 1$ (6) $\left( 1 + \mathrm{e}^{x} \right) y y^{\prime} = \mathrm{e}^{x} , y |_{x = 1} = 1$

(7) $\frac{x}{1 + y}\mathrm{d}x - \frac{y}{1 + x}\mathrm{d}y = 0, \left. y \right|_{x = 0} = 1.$

3.有一盛满了水的圆锥形漏斗，高为10cm，顶角为 $60^{\circ}$ ，漏斗下面有面积为 $0.5cm^{2}$ 的孔，求水面高度变化的规律及流完所需的时间.

4.质量为1g(克)的质点受外力作用作直线运动，这外力和时间成正比，和质点运动的速度

[page:156]

## 第5章微分方程

成反比.在 $t = 10 s$ 时，速度等于 $50 cm/s$ 外力为 $4 \mathrm{g} \cdot \mathrm{cm} / \mathrm{s}^{2}$ ，问从运动开始经过了一分钟后的速度是多少?

5. 镭的衰变有如下的规律:镭的衰变速度与它的现存量R成正比.由经验材料得知，镭经过1600年后，只余原始量 $R _ { 0 }$ 的一半.试求镭的量R与时间t的函数关系.

6. 一曲线通过点(2,3)，它在两坐标轴间的任一切线线段均被切点所平分，求这曲线方程

7. 小船从河边点O处出发驶向对岸(两岸为平行直线).设船速为a，船行方向始终与河岸垂直，又设河宽为h，河中任一点处的水流速度与该点到两岸距离的乘积成正比(比例系数为

k).求小船的航行路线.

8.一个物体在冷却过程中，其温度变化速度与它本身的温度和环境的温度之差成正比.今有一温度为 $5 0 ^ { \circ } C$ 的物体，放入温度为 $2 0 ^ { \circ } C$的房间里(房间的温度看作不变)，试求物体温度随时间变化的规律

9. 根据托里拆利定理，液体从距自由面深度为hcm的孔流出，流速 $v = c \sqrt{2gh}    cm/s$ ，式中 $g$ 是重力加速度，c是流出系数，现有一圆柱形储油罐，直径20m，高20m，装满汽油，出口管直径10cm (图5.5)，实验测定 $c = 0.6.$ 问全部汽油流完，需要多少时间？

## 5.3齐次方程

## 5.3.1 齐次方程

如果一阶微分方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} = f(x,y)$$

中的函数 $f(x,y)$ 可写成 $\frac{y}{x}$ 的函数，即 $f(x,y)=\varphi\left(\frac{y}{x}\right)$ ，则称这方程为齐次方程，如

$$(xy - y^{2})\mathrm{d}x - (x^{2} - 2xy)\mathrm{d}y = 0$$

是齐次方程，因为

$$f(x,y)=\frac{xy-y^{2}}{x^{2}-2xy}=\frac{\frac{y}{x}-\left(\frac{y}{x}\right)^{2}}{1-2\left(\frac{y}{x}\right)}.$$

在齐次方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \varphi\left(\frac{y}{x}\right)\tag{5.27}$$

中，引进新的未知函数

$$u = \frac { y } { x } ,\tag{5.28}$$

[page:157]

## 5.3齐次方程

就可化为可分离变量的方程.因为由(5.28)有

$$y = u x , \quad \frac{\mathrm{d} y}{\mathrm{d} x} = u + x \frac{\mathrm{d} u}{\mathrm{d} x} ,$$

代入方程(5.27)，便得方程

$$u + x \frac{\mathrm{d}u}{\mathrm{d}x} = \varphi(u),$$

即

$$x \frac{\mathrm{d}u}{\mathrm{d}x} = \varphi(u) - u,$$

分离变量，得

$$\frac{\mathrm{d}u}{\varphi(u) - u} = \frac{\mathrm{d}x}{x},$$

两端积分，得

$$\int \frac{\mathrm{d}u}{\varphi(u) - u} = \int \frac{\mathrm{d}x}{x}.$$

求出积分后，再以 $\frac{y}{x}$ 代替u，便得所给齐次方程的通解.

例5.8解方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{y + \sqrt{x^{2} + y^{2}}}{x}, \quad x > 0.$$

解原方程可写成

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{y}{x} + \sqrt{1 + \left(\frac{y}{x}\right)^2},$$

因此是齐次方程.令 $\frac { y } { x } = u$ ,则

$$y = u x , \quad \frac{\mathrm{d} y}{\mathrm{d} x} = u + x \frac{\mathrm{d} u}{\mathrm{d} x},$$

于是原方程变为

$$x \frac{\mathrm{d}u}{\mathrm{d}x} + u = u + \sqrt{1 + u^{2}},$$

即

$$x \frac{\mathrm{d}u}{\mathrm{d}x} = \sqrt{1 + u^{2}}$$

[page:158]

## 第5章 微分方程

分离变量，得

$$\frac{\mathrm{d}u}{\sqrt{1 + u^{2}}} = \frac{\mathrm{d}x}{x},$$

两端积分，得

$$\ln ( u + \sqrt{1 + u^{2}} ) = \ln x + C_{1},$$

即

$$u + \sqrt{1 + u^{2}} = Cx(C = \mathrm{e}^{C_{1}}).$$

将 $u = \frac { y } { x }$ 代入上式，得

$$\frac{y}{x}+\sqrt{1+\left(\frac{y}{x}\right)^{2}}=Cx$$

于是得到原方程的通积分

$$y+\sqrt{x^{2}+y^{2}}=Cx^{2}.$$

例5.9 有旋转曲面形状的凹镜，假设由旋转轴上一点发出的一切光线经此凹镜反射后都与旋转轴平行(探照灯内的凹镜就是这样的)，求这旋转曲面的方程.

解取旋转轴为x轴，光源所在之处取作原点O，取通过旋转轴的任一平面为

$x O y$ 坐标面，这平面截此旋转面得曲线L(图5.6).按曲线L的对称性，可以只在 $y > 0$ 的范围内求L的方程.设点 $M(x,y)$为L上的任一点，点O发出的某条光线经点M反射后是一条与 $\mathcal { X }$ 轴平行的直线MS.又设过点M的切线AT与 $\mathcal { X }$ 轴的夹角为 $\alpha .$ 根据题意， $\angle SMT = \alpha.$ 另外， $\angle O M A$ 是入射角的余角，于是由光学中的反射定律，有 $\angle OMA = \angle SMT = \alpha$ ，从而$AO = OM$ 但 $AO = AP - OP = PM\cot\alpha - OP = \frac{y}{y'} - x$ ，而$OM = \sqrt{x^{2} + y^{2}}$ .于是得微分方程

$$\frac{y}{y'} - x = \sqrt{x^{2} + y^{2}}.$$

把x看作未知函数，把y看作自变量，当 $y > 0$ 时，上式即为

$$\frac{\mathrm{d}x}{\mathrm{d}y} = \frac{x}{y} + \sqrt{\left( \frac{x}{y} \right)^2 + 1}$$

这是齐次方程.令 $\frac{x}{y} = v$ ，则 $x = y v, \frac{\mathrm{d}x}{\mathrm{d}y} = v + y \frac{\mathrm{d}v}{\mathrm{d}y}$ ，代入上式，得

$$v + y \frac{\mathrm{d}v}{\mathrm{d}y} = v + \sqrt{v^{2} + 1} ,$$

[page:159]

## 5.3齐次方程

即

$$y \frac{\mathrm{d}v}{\mathrm{d}y} = \sqrt{v^{2} + 1} ,$$

分离变量，得

$$\frac{\mathrm{d}v}{\sqrt{v^{2} + 1}} = \frac{\mathrm{d}y}{y}.$$

积分，得

$$\ln (v + \sqrt{v^2 + 1}) = \ln y - \ln C,$$

或

$$v + \sqrt{v^{2} + 1} = \frac{y}{C}.$$

由

$$\left( \frac{y}{C} - v \right)^2 = v^2 + 1,$$

得

$$\frac{y^{2}}{C^{2}} - \frac{2yv}{C} = 1,$$

以 $y v = x$ 代入上式，得

$$y^{2}=2C\left(x+\frac{C}{2}\right).$$

这是以x轴为轴、焦点在原点的抛物线，它绕x轴旋转所得旋转抛物面的方程为

$$y^{2}+z^{2}=2C\left(x+\frac{C}{2}\right),$$

这就是所要求的旋转曲面方程

如果凹镜底面的直径是 $d .$ 从顶点到底面的距离是h，则以 $x + \frac{C}{2} = h$ 及 $y = \frac{d}{2}$代入 $y^{2}=2C\left(x+\frac{C}{2}\right)$ ,得 $C { = } \frac { d ^ { 2 } } { 8 h } .$ 这时旋转抛物面的方程为

$$y^{2}+z^{2}=\frac{d^{2}}{4h}\left(x+\frac{d^{2}}{16h}\right).$$

例5.10 设河边点O的正对岸为点A，河宽 $OA = h$ ，两岸为平行直线，水流速度为a，有一鸭子从点A游向点O，设鸭子(在静水中)的游速为 $b ( b > a )$ ，且鸭子游动方向始终朝着点O.求鸭子游过的轨迹的方程.

解 设水流速度为 $a(|a| = a)$ ,鸭子游速为 $b( \left | b \right |  = b)$ ，则鸭子实际运动速度为 $v = a + b$

[page:160]

## 第5章微分方程

取O为坐标原点，河岸朝顺水方向为x轴，y轴指向对岸(图5.7). 设在时刻t鸭子位于点 $P(x,y)$ ，则鸭子运动速度

故有

$$v = \left( v _ { x } , v _ { y } \right) = \left( \frac { \mathrm { d } x } { \mathrm { d } t } , \frac { \mathrm { d } y } { \mathrm { d } t } \right) ,$$

$$\frac{\mathrm{d}x}{\mathrm{d}y} = \frac{v_{x}}{v_{y}}.$$

图5.7

现在 $a = (a, 0)$ ，而 $b = b e_{\overline{PO}}$ ，其中 $e _ { \overline { { P O } } }$ 为与 $\overline{PO}$ 同方向的单位向量.由$\overline{PO}=-(x,y)$ ,故 $e_{\overline{BO}} = - \frac{1}{\sqrt{x^{2} + y^{2}}}(x,y)$ ，于是 $b = - \frac{b}{\sqrt{x^{2} + y^{2}}}(x,y)$ ,从而

$$v = a + b = \left[ a - \frac{bx}{\sqrt{x^2 + y^2}}, -\frac{by}{\sqrt{x^2 + y^2}} \right].$$

由此得微分方程

$$\frac{\mathrm{d}x}{\mathrm{d}y} = \frac{v_{x}}{v_{y}} = - \frac{a\sqrt{x^{2} + y^{2}}}{by} + \frac{x}{y},$$

即

$$\frac{\mathrm{d}x}{\mathrm{d}y} = - \frac{a}{b} \sqrt{\left( \frac{x}{y} \right)^2 + 1} + \frac{x}{y}.$$

令 $\frac { x } { y } = u$ ,则 $x = y u, \frac{\mathrm{d}x}{\mathrm{d}y} = y \frac{\mathrm{d}u}{\mathrm{d}y} + u$ ，代入上面的方程，得

$$y \frac{\mathrm{d}u}{\mathrm{d}y} = - \frac{a}{b} \sqrt{u^{2} + 1} ,$$

分离变量，得

$$\frac{\mathrm{d}u}{\sqrt{u^{2} + 1}} = - \frac{a}{by}\mathrm{d}y,$$

积分，得

$$\mathrm{arcsh}u = - \frac{a}{b} \left( \ln y + \ln C \right),$$

即

$$u = \sinh(Cy)^{-\frac{a}{b}} = \frac{1}{2}\left[ (Cy)^{-\frac{a}{b}} - (Cy)^{\frac{a}{b}} \right],$$

于是

$$x = \frac{y}{2} \left[ (Cy)^{-\frac{a}{b}} - (Cy)^{\frac{a}{b}} \right] = \frac{1}{2C} \left[ (Cy)^{1-\frac{a}{b}} - (Cy)^{1+\frac{a}{b}} \right].$$

[page:161]

## 5.3齐次方程

以 $y = h$ 时 $x = 0$ 代入上式，得 $C { = } \frac { 1 } { h }$ ，故鸭子游过的迹线方程为

$$x = \frac{h}{2} \left[ \left( \frac{y}{h} \right)^{1 - \frac{a}{b}} - \left( \frac{y}{h} \right)^{1 + \frac{a}{b}} \right], \quad 0 \leqslant y \leqslant h.$$

## 5.3.2 可化为齐次的方程

方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{ax + by + c}{a_{1}x + b_{1}y + c_{1}}\tag{5.29}$$

当 $c = c_{1} = 0$ 时是齐次的，否则不是齐次的.在非齐次的情形，可用下列变换把它化为齐次方程.令

$$x = X + h, \quad y = Y + k,$$

其中h及k为待定常数.于是

$$\mathrm{d}x = \mathrm{d}X, \quad \mathrm{d}y = \mathrm{d}Y,$$

从而方程(5.29)化为

$$\frac{\mathrm{d}Y}{\mathrm{d}X} = \frac{aX + bY + ab + bk + c}{a_{1}X + b_{1}Y + a_{1}h + b_{1}k + c_{1}}.$$

如果方程组

$$\begin{cases}a h + b k + c = 0 \\a_{1} h + b_{1} k + c_{1} = 0\end{cases}$$

的系数行列式 $\left| \begin{matrix} { a } & { \hat { b } } \\ { a _ { 1 } } & { b _ { 1 } } \\ \end{matrix} \right| \not = 0 .$ ，即 $\frac{a_{1}}{a} \neq \frac{b_{1}}{b}$ ,那么可以定出h及k使它们满足上述方程组.这样，方程(5.29)便化为齐次方程

$$\frac{\mathrm{d}Y}{\mathrm{d}X} = \frac{aX + bY}{a_{1}X + b_{1}Y}.$$

求出此齐次方程的通解后，在通解中以 $x = h$ 代 $X, y = k$ 代Y，便得方程(5.29)的通解.

当 $\frac{a_{1}}{a}=\frac{b_{1}}{b}$ 时，h及k无法求得，因此上述方法不能应用.但这时令 $\frac{a_{1}}{a}=\frac{b_{1}}{b}=\lambda$从而方程(5.29)可写成

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{ax + by + c}{\lambda(ax + by) + c_{1}}.$$

引人新变量 $y = a x + b y$ ,则

$$\frac{\mathrm{d}v}{\mathrm{d}x}=a+b\frac{\mathrm{d}y}{\mathrm{d}x} \quad  或  \quad \frac{\mathrm{d}y}{\mathrm{d}x}=\frac{1}{b}\left(\frac{\mathrm{d}v}{\mathrm{d}x}-a\right).$$

于是方程(5.29)成为

[page:162]

## 第5章微分方程

$$\frac{1}{b} \left( \frac{\mathrm{d}v}{\mathrm{d}x} - a \right) = \frac{v + c}{\lambda v + c_1},$$

这是可分离变量的方程.

以上所介绍的方法可以应用于更一般的方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} = f\left( \frac{ax + by + c}{a_{1}x + b_{1}y + c_{1}} \right).$$

例 5.11 解方程

$$(2x + y - 4)dx + (x + y - 1)dy = 0.$$

解所给方程属方程(5.29)的类型.令 $x = X + h, \; y = Y + k$ ，则 $\mathrm{d}x = \mathrm{d}X$ $\mathrm{d}y = \mathrm{d}Y$ ，代入原方程得

$$(2X + Y + 2h + k - 4) \mathrm{d}X + (X + Y + h + k - 1) \mathrm{d}Y = 0.$$

解方程组

$$\begin{cases}2h + k - 4 = 0, \\h + k - 1 = 0,\end{cases}$$

得 $h = 3 , k = - 2.$ 令 $x = X + 3, y = Y - 2$ ，原方程成为

$$(2X + Y) \mathrm{d}X + (X + Y) \mathrm{d}Y = 0,$$

或

$$\frac{\mathrm{d}Y}{\mathrm{d}X}=-\frac{2X+Y}{X+Y}=-\frac{\frac{2}{2}+\frac{Y}{X}}{1+\frac{Y}{X}},$$

这是齐次方程.

令 $\frac{Y}{X} = u$ ,则 $Y = uX,\frac{\mathrm{d}Y}{\mathrm{d}X} = u + X\frac{\mathrm{d}u}{\mathrm{d}X}$ ，于是方程变为

$$u + X \frac{\mathrm{d}u}{X} = - \frac{2 + u}{1 + u},$$

或

$$X \frac{\mathrm{d}u}{\mathrm{d}X} = - \frac{2 + 2u + u^{2}}{1 + u},$$

分离变量，得

$$-\frac{u + 1}{u^{2} + 2u + 2}\mathrm{d}u = \frac{\mathrm{d}X}{X}.$$

积分，得

$$\ln C_{1}-\frac{1}{2}\ln\left(u^{2}+2u+2\right)=\ln\left|X\right|,$$

于是

$$\frac{C_{1}}{\sqrt{u^{2}+2u+2}}=|X|$$

[page:163]

## 5.3齐次方程

或

$$C_{2}=X^{2}\left(u^{2}+2u+2\right), \quad C_{2}=C_{1}^{2},$$

即

$$Y^{2}+2XY+2X^{2}=C_{2}.$$

以 $X = x - 3, Y = y + 2$ 代入上式并化简，得

$$2x^{2}+2xy+y^{2}-8x-2y=C, \quad C=C_{2}-10.$$

习题5.3

1. 求下列齐次方程的通解:

(1) $xy^{\prime}-y-\sqrt{y^{2}-x^{2}}=0;$ (2) $x \frac{\mathrm{d}y}{\mathrm{d}x} = y \ln \frac{y}{x};$ (3) $\left( x^{2} + y^{2} \right) \mathrm{d}x - x y \mathrm{d}y = 0;$

(4) $(x^{3}+y^{3})\mathrm{d}x-3xy^{2}\mathrm{d}y=0;$ (5) $\left( 2 x \sin \frac{y}{x} + 3 y \cos \frac{y}{x} \right) \mathrm{d} x - 3 x \cos \frac{y}{x} \mathrm{d} y = 0 ;$

(6) $\left( 1 + 2 \mathrm{e}^{\frac{x}{y}} \right) \mathrm{d}x + 2 \mathrm{e}^{\frac{x}{y}} \left( 1 - \frac{x}{y} \right) \mathrm{d}y = 0;$ (7) $y^{\prime} = \sqrt{4x + 2y - 1}$

(8) $2x^{3}y^{\prime}=y(2x^{2}-y^{2})$ (9) $xy^{\prime} - y = x\tan\frac{y}{x};$ (10) $xy^{\prime} = \sqrt{x^{2} - y^{2}} + y,x > 0;$

(11) $(x - y - 1) + (y - x + 2)y^{\prime} = 0;$ (12) $y^{\prime} = 2\left( \frac{y + 2}{x + y - 1} \right)^{2}$ se.

(13) $(y' + 1)\ln\frac{x + y}{x + 3} = \frac{x + y}{x + 3};$ (14) $\frac{\mathrm{d}y}{\mathrm{d}x}=\frac{x-y^{2}}{2y\left (x+y^{2}  \right ) }$ 9 (15) $y^{\prime} = \frac{y\sqrt{y}}{2x\sqrt{y} - x^{2}}.$

2. 求下列齐次方程满足所给初始条件的特解:

(1) $\left( y^{2} - 3x^{2} \right)\mathrm{d}y + 2xy\mathrm{d}x = 0, \left. y \right|_{x = 0} = 1$ (2) $y^{\prime} = \frac{x}{y} + \frac{y}{x}, y|_{x = 1} = 2;$

(3) $\left( x^{2} + 2xy - y^{2} \right) \mathrm{d}x + \left( y^{2} + 2xy - x^{2} \right) \mathrm{d}y = 0, \left. y \right|_{x = 1} = 1.$

3. 设有连接点O(0,0)和A(1,1)的一段向上凸的曲线弧 $\widehat{OA}$ ，对于 $\widehat { O A }$ 上任一点 $P(x,y)$ ，曲线弧OP与直线段OP所围图形的面积为 $x^{2}$ ，求曲线弧 $\widehat { O A }$ 的方程.

4. 化下列方程为齐次方程，并求出通解:

(1) $(2x - 5y + 3)\mathrm{d}x - (2x + 4y - 6)\mathrm{d}y = 0;$ (2) $(x - y - 1)\mathrm{d}x + (4y + x - 1)\mathrm{d}y = 0;$

(3) $(3y - 7x + 7)\mathrm{d}x + (7y - 3x + 3)\mathrm{d}y = 0;$ (4) $(x + y)\mathrm{d}x + (3x + 3y - 4)\mathrm{d}y = 0.$

5. 证明方程

$$\frac{\mathrm{d}u}{\mathrm{d}v} + \frac{b}{a} = \frac{f(hv + e)}{g(au + bv + c)}$$

[page:164]

## 第5章微分方程

可化为分离变量方程，其中 $a , b , c , e , h$ 为常数.

## 5.4 一阶线性微分方程

## 5.4.1 线性方程

方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} + P(x)y = Q(x)\tag{5.30}$$

叫做一阶线性微分方程，因为它对于未知函数 $\mathcal { Y }$ 及其导数是一次方程.如果 $Q(x) \equiv 0$则方程(5.30)称为齐次的；如果 $Q(x)$ 不恒等于零，则方程(5.30)称为非齐次的.

设(5.30)为非齐次线性方程.为了求出非齐次线性方程(5.30)的解，先把$Q(x)$ 换成零而写出

$$\frac{\mathrm{d}y}{\mathrm{d}x} + P(x)y = 0\tag{5.31}$$

方程(5.31)叫做对应于非齐次线性方程(5.30)的齐次线性方程.方程(5.31)是可分离变量的，分离变量后得

$$\frac{\mathrm{d}y}{y} = - P(x) \mathrm{d}x,$$

两端积分，得

$$\ln \left| y \right| = - \int P(x) \mathrm{d}x + C_{1},$$

或

$$y = C \mathrm{e}^{- \int P(x) \mathrm{d}x} \quad (C = \pm \mathrm{e}^{C_1}),$$

这是对应的齐次线性方程(5.31)的通解.这里记号 $\int P(x)   dx$ 表示 $P(x)$ 的某个确定的原函数.

现在我们使用所谓常数变易法来求非齐次线性方程(5.30)的通解.这方法是把(5.31)的通解中的C换成x的未知函数 $u(x)$ ，即作变换

$$y = u \mathrm{e}^{-\int P(x) \mathrm{d}x}\tag{5.32}$$

于是

$$\frac{\mathrm{d}y}{\mathrm{d}x} = u^{\prime}\mathrm{e}^{-\int P(x)\mathrm{d}x} - uP(x)\mathrm{e}^{-\int P(x)\mathrm{d}x}.\tag{5.33}$$

将(5.32)和(5.33)代入方程(5.30)得

$$u ^ { \prime } \mathrm { e } ^ { - \int P ( x ) \mathrm { d } x } - u P ( x ) \mathrm { e } ^ { - \int P ( x ) \mathrm { d } x } + P ( x ) u \mathrm { e } ^ { - \int P ( x ) \mathrm { d } x } = Q ( x ) ,$$

[page:165]

## 5.4一阶线性微分方程

即

$$u ^ { \prime } \mathrm { e } ^ { - \int P ( x ) \mathrm { d } x } = Q ( x ) , \quad u ^ { \prime } = Q ( x ) \mathrm { e } ^ { \int P ( x ) \mathrm { d } x } .$$

两端积分，得

$$u = \int Q(x) \mathrm{e}^{\int P(x) \mathrm{d}x} \mathrm{d}x + C.$$

把上式代入(5.32)，便得非齐次线性方程(5.30)的通解

$$y = \mathrm{e}^{- \int P(x) \mathrm{d}x} \left( \int Q(x) \mathrm{e}^{\int P(x) \mathrm{d}x} \mathrm{d}x + C \right).\tag{5.34}$$

将式(5.34)改写成两项之和

$$y = C\mathrm{e}^{-\int P(x)\mathrm{d}x} + \mathrm{e}^{-\int P(x)\mathrm{d}x}\int Q(x)\mathrm{e}^{\int P(x)\mathrm{d}x}\mathrm{d}x,$$

上式右端第一项是对应的齐次线性方程(5.31)的通解，第二项是非齐次线性方程(5.30)的一个特解(在(5.30)的通解(5.34)中取C=0便得到这个特解).由此可知，一阶非齐次线性方程的通解等于对应的齐次方程的通解与非齐次方程的一个特解之和.

例 5.12 求方程

$$\frac{\mathrm{d}y}{\mathrm{d}x}-\frac{2y}{x+1}=(x+1)^{\frac{5}{2}}$$

的通解.

解这是一个非齐次线性方程，先求对应的齐次方程的通解

$$\begin{aligned}\frac{\mathrm{d}y}{\mathrm{d}x} - \frac{2}{x + 1}y &= 0, \\\frac{\mathrm{d}y}{\mathrm{d}x} &= \frac{2\mathrm{d}x}{x + 1}, \\\ln |y| &= 2\ln |x + 1| + \ln C, \\y &= C(x + 1)^{2}.\end{aligned}$$

用常数变易法，把C换成u，即令

$$y = u(x + 1)^{2}\tag{5.35}$$

则

$$\frac{\mathrm{d}y}{\mathrm{d}x}=u^{\prime}(x+1)^{2}+2u(x+1),$$

[page:166]

## 第5章微分方程

代入所给非齐次方程，得

$$u^{\prime} = (x + 1)^{\frac{1}{2}}.$$

两端积分，得

$$u = \frac{2}{3}(x + 1)^{\frac{3}{2}} + C.$$

再把上式代入式(5.35)，即得所求方程的通解为

$$y = (x + 1)^{2} \left[ \frac{2}{3}(x + 1)^{\frac{3}{2}} + C \right].$$

例5.13 有一个电路，如图5.8所示，其中电源电动势为 $E = E_{ m } \sin \omega t (E_{ m }, \omega$ 都是常量)，电阻R和电感L 都是常量. 求电流 i(t).

解（1）列方程.由电学知道，当电流变化时，L上有感应电动势 $-L\frac{\mathrm{d}i}{\mathrm{d}t}.$ 由回路电压定律得出

$$E - L \frac{\mathrm{d}i}{\mathrm{d}t} - iR = 0,$$

即

$$\frac{\mathrm{d}i}{\mathrm{d}t} + \frac{R}{L}i = \frac{E}{L}.$$

把 $E = E_{ m } \sin \omega t$ 代入上式，得

$$\frac{\mathrm{d}i}{\mathrm{d}t} + \frac{R}{L}i = \frac{E_{\mathrm{m}}}{L}\sin\omega t.\tag{5.36}$$

未知函数 $i ( t )$ 应满足方程(5.36).此外，设开关K闭合的时刻为 $t = 0$ ，这时i(t)还应该满足初始条件

$$i \mid _ { t = 0 } = 0 .\tag{5.37}$$

(2)解方程.方程(5.36)是一个非齐次线性方程.可以先求出对应的齐次方程的通解，然后用常数变易法求非齐次方程的通解.但是，也可以直接应用通解公式(5.34)来求解.这里 $P(t)=\frac{R}{L},Q(t)=\frac{E_{\mathrm{m}}}{L}\sin\omega t$ ，代入式(5.34)，得

$$i ( t ) = \mathrm { e } ^ { - \frac { R } { L } t } \left( \int \frac { E _ { \mathrm { m } } } { L } \mathrm { e } ^ { \frac { R } { L } t } \sin \omega t \mathrm { d } t + C \right) .$$

应用分部积分法，得

$$\int \mathrm{e}^{\frac{R}{L} t} \sin \omega t \mathrm{d}t = \frac{\mathrm{e}^{\frac{R}{L} t}}{R^2 + \omega^2 L^2} \left( R L \sin \omega t - \omega L^2 \cos \omega t \right),$$

将上式代入前式并化简，得方程(5.36)的通解

[page:167]

## 5.4一阶线性微分方程

$$i ( t ) = \frac { E _ { \mathrm { m } } } { R ^ { 2 } + \omega ^ { 2 } L ^ { 2 } } ( R \sin \omega t - \omega L \cos \omega t ) + C \mathrm { e } ^ { - \frac { R } { L ^ { 2 } } } ,$$

其中C为任意常数.

将初始条件式(5.37)代入上式，得

$$C = \frac{\omega L E_{\mathrm{m}}}{R^{2} + \omega^{2} L^{2}},$$

因此，所求函数i(t)为

$$i(t) = \frac{\omega L E_m}{R^2 + \omega^2 L^2} \mathrm{e}^{-\frac{R}{L} t} + \frac{E_m}{R^2 + \omega^2 L^2} (R \sin \omega t - \omega L \cos \omega t).\tag{5.38}$$

为了便于说明式(5.38)所反映的物理现象，下面把i(t)中第二项的形式稍加改变.

令

$$\cos \varphi = \frac{R}{\sqrt{R^{2} + \omega^{2}L^{2}}}, \quad \sin \varphi = \frac{\omega L}{\sqrt{R^{2} + \omega^{2}L^{2}}},$$

于是式(5.38)可写成

$$i(t) = \frac{\omega L E_m}{R^2 + \omega^2 L^2} \mathrm{e}^{-\frac{R}{L^2} t} + \frac{E_m}{\sqrt{R^2 + \omega^2 L^2}} \sin(\omega t - \varphi),$$

其中

$$\varphi = \arctan \frac{\omega L}{R}.$$

当t增大时，上式右端第一项(叫做瞬时电流)逐渐衰减而趋于零；第二项(叫做稳态电流)是正弦函数，它的周期和电动势的周期相同，而相角落后 $\varphi _ { \bullet }$

例5.14设降落伞从跳伞塔下落后，所受空气阻力与速度成正比，并设降落伞离开跳伞塔时 $(t = 0)$ 速度为零，求降落伞下落速度与时间的函数关系.

解设降落伞下落速度为 $v ( t )$ .降落伞在空中下落时，同时受到重力P与阻力R的作用(图5.9).重力大小为 $m g$方向与 $\mathcal { V }$ 一致；阻力大小为 $k v ( k$ 为比例系数)，方向与 $\boldsymbol { v }$ 相反，从而降落伞所受外力为

$$F = mg - kv.$$

根据牛顿第二运动定律

$$F = m a \: ,$$

其中 $\mathcal { Q }$ 为加速度，得函数 $v ( t )$ 应满足的方程为

图5.9

$$m \frac{\mathrm{d}v}{\mathrm{d}t} = mg - kv.\tag{5.39}$$

按题意，初始条件为

$$\left. \upsilon \right| _ { t = 0 } = 0 .$$

[page:168]

## 第5章微分方程

方程(5.39)是一个非齐次线性方程，可改写为

$$\frac{\mathrm{d}v}{\mathrm{d}t} + \frac{k}{m}v = g,$$

代入式(5.34)得

$$v = \mathrm{e}^{-\frac{k}{m}t} \left( \int \mathrm{e}^{\frac{k}{m}t} \mathrm{d}t + C \right),$$

或

$$v = \frac{mg}{k} + C\mathrm{e}^{-\frac{k}{m}t}\tag{5.40}$$

这就是方程(5.39)的通解.

将初始条件 $\left| \boldsymbol{\psi} \right|_{t = 0} = 0$ 代入(5.40)式，得

$$C=-\frac{mg}{k}.$$

于是所求的特解为

$$v = \frac{mg}{k} \left( 1 - \mathrm{e}^{-\frac{k}{m}t} \right).\tag{5.41}$$

由(5.41)可以看出，随着时间t的增大，速度v逐渐接近于常数 $\frac{mg}{k}$ ，且不会超过$\frac{mg}{k}$ ，也就是说，跳伞后开始阶段是加速运动，但以后逐渐接近于等速运动

## 5.4.2 伯努利方程

方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} + P(x)y = Q(x)y^n, \quad n \neq 0,1\tag{5.42}$$

叫做伯努利(Bernoulli)方程.当 $n = 0$ 或 $n { = } 1$ 时，这是线性微分方程.当 $n \neq 0, n \neq 1$时，这方程不是线性的，但是通过变量的代换，便可把它化为线性的.事实上，以 $y ^ { n }$除方程(5.42)的两端，得

$$y^{-n} \frac{\mathrm{d}y}{\mathrm{d}x} + P(x)y^{1-n} = Q(x)\tag{5.43}$$

容易看出，上式左端第一项与 $\frac{\mathrm{d}}{\mathrm{d}x}(y^{1 - n})$ 只差一个常数因子 $1 - n$ ，因此引入新的未知函数

$$z = y ^ { 1 - n } ,$$

[page:169]

## 5.4一阶线性微分方程

则

$$\frac{\mathrm{d}z}{\mathrm{d}x} = (1 - n)y^{-n}\frac{\mathrm{d}y}{\mathrm{d}x}.$$

用(1一n)乘方程(5.43)的两端，再通过上述代换便得线性方程

$$\frac{\mathrm{d}z}{\mathrm{d}x} + (1 - n)P(x)z = (1 - n)Q(x).$$

求出此方程的通解后，以 $y ^ { 1 - n }$ 代≈便得到伯努利方程的通解.

例5.15 求方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} + \frac{y}{x} = a(\ln x)y^{2}$$

的通解.

解以 $y ^ { 2 }$ 除方程的两端，得

$$y^{-2} \frac{\mathrm{d}y}{\mathrm{d}x} + \frac{1}{x}y^{-1} = a\ln x,$$

即

$$-\frac{\mathrm{d}(y^{-1})}{\mathrm{d}x}+\frac{1}{x}y^{-1}=a\ln x,$$

令 $z = y^{-1}$ ，则上述方程成为

$$\frac{\mathrm{d}z}{\mathrm{d}x} - \frac{1}{x}z = - a\ln x.$$

这是一个线性方程，它的通解为

$$z = x \left[ C - \frac{a}{2} ( \ln x ) ^ { 2 } \right]$$

以 $y^{-1}$ 代z，得所求方程的通解为

$$yx\left[C-\frac{a}{2}(\ln x)^{2}\right]=1.$$

在上节中，对于齐次方程 $y' = f\left(\frac{y}{x}\right)$ ，通过变量代换 $y = x u$ ，把它化为变量可分离的方程，然后分离变量，经积分求得通解.在本节中，对于一阶非齐次线性方程

$$y ^ { \prime } + P ( x ) y = Q ( x ) ,$$

可以通过解对应的齐次线性方程找到变量代换

$$y = u \mathrm{e}^{- \int P(x) \mathrm{d}x}$$

利用这一代换，把非齐次线性方程化为可分离变量的方程，然后经积分求得通解对于伯努利方程

$$y ^ { \prime } + P ( x ) y = Q ( x ) y ^ { n } ,$$

通过变量代换 $y^{1 - n} = z$ ，把它化为线性方程，然后按线性方程的解法求得通解.

[page:170]

## 第5章微分方程

利用变量代换(因变量的变量代换或自变量的变量代换)，把一个微分方程化为变量可分离的方程，或化为已经知其求解步骤的方程，这是解微分方程最常用的方法.下面再举一个例子.

例5.16解方程 $\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{1}{x + y}$

解 若把所给方程变形为

$$\frac{\mathrm{d}x}{\mathrm{d}y} = x + y,$$

即为 $\sqsubseteq$ 阶线性方程，则按一阶线性方程的解法可求得通解

也可用变量代换来解所给方程

令 $x + y = u$ ,则 $y = u - x,\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{\mathrm{d}u}{\mathrm{d}x} - 1$ .代入原方程，得

$$\frac{\mathrm{d}u}{\mathrm{d}x} - 1 = \frac{1}{u}, \quad \frac{\mathrm{d}u}{\mathrm{d}x} = \frac{u + 1}{u}.$$

分离变量，得

$$\frac{u}{u + 1}\mathrm{d}u = \mathrm{d}x,$$

两端积分，得

$$u - \ln | u + 1 | = x + C.$$

以 $u = x + y$ 代入上式，即得

$$y - \ln \left| x + y + 1 \right| = C,$$

或

$$x = C_{1} \mathrm{e}^{y} - y - 1, \quad C_{1} = \pm \mathrm{e}^{-C}.$$

习题5.4

1. 求下列微分方程的通解:

(1) $\frac{\mathrm{d}y}{\mathrm{d}x} + y = \mathrm{e}^{-x}$ (2) $xy^{\prime} + y = x^{2} + 3x + 2$

(3) $y^{\prime} + y\cos x = \mathrm{e}^{-\sin x}$ (4) $y^{\prime} + y\tan x = \sin 2x;$

(5) $(x^{2}-1)y^{\prime}+2xy-\cos x=0;$ (6) $\frac{\mathrm{d}\rho}{\mathrm{d}\theta} + 3\rho = 2;$ 一一

(7) $\frac{\mathrm{d}y}{\mathrm{d}x} + 2xy = 4x;$ (8) $y\ln y\mathrm{d}x+(x-\ln y)\mathrm{d}y=0;$

[page:171]

## 5.4一阶线性微分方程

(9) $(x - 2)\frac{\mathrm{d}y}{\mathrm{d}x} = y + 2(x - 2)^{3}$ ;(10) $(y^{2}-6x)\frac{\mathrm{d}y}{\mathrm{d}x}+2y=0;$

(11) $xy^{\prime} + y = 2\sqrt{xy}$ (12) $xy^{\prime}\ln x+y=ax(\ln x+1)$

(13) $\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{y}{2(\ln y - x)};$ (14) $\frac{\mathrm{d}y}{\mathrm{d}x} + xy - x^{3}y^{3} = 0;$

(15) $(y^{4}-3x^{2})\mathrm{d}y+xy\mathrm{d}x=0; \quad (16) y^{\prime}+x=\sqrt{x^{2}+y};$

(17) $3y^{\prime} + 2y = 6x;$ (18) $y^{\prime} + y = x\mathrm{e}^{x}$

(19) $y^{\prime} + x^{2}y = 0;$ (20) $xy^{\prime} - y = \frac{x}{\ln x}$

(21) $(x - 2xy - y^{2})y^{\prime} + y^{2} = 0.$

2. 求下列微分方程满足所给初始条件的特解:

(1) $\frac{\mathrm{d}y}{\mathrm{d}x}-y\tan x=\sec x,\left.y\right|_{x=0}=0;$ (2) $\frac{\mathrm{d}y}{\mathrm{d}x} + \frac{y}{x} = \frac{\sin x}{x}, y|_{x = \pi} = 1;$

(3) $\frac{\mathrm{d}y}{\mathrm{d}x} + y\cot x = 5\mathrm{e}^{\cos x}, \left. y \right|_{x = \frac{\pi}{2}} = - 4;$ (4) $\frac{\mathrm{d}y}{\mathrm{d}x} + 3y = 8, \left. y \right|_{x = 0} = 2$

(5) $\frac{\mathrm{d}y}{\mathrm{d}x} + \frac{2 - 3x^{2}}{x^{3}}y = 1, y|_{x = 1} = 0;$ (6) $y^{3}\mathrm{d}x+2(x^{2}-xy^{2})\mathrm{d}y=0,y|_{x=1}=1$

(7) $y^{\prime} + y = \mathrm{e}^{- x}, \left. y \right|_{x = 0} = 5;$ (8) $xy^{\prime} + y - \mathrm{e}^{2x} = 0, \quad y \mid_{x = \frac{1}{2}} = 2\mathrm{e}.$

3.已知某曲线经过点(1，1)，它的切线在纵轴上的截距等于切点的横坐标，求它的方程

4. 已知某车间的体积为 $(30 \times 30 \times 6)  m ^3$ ，其中的空气含0.12%(以体积分数)的 $\mathrm{CO_{2}}$ .现以含 $\mathrm{CO}_{2}0.04$ %的新鲜空气输入，问每分钟应输入多少，才能在30min后使车间空气中 $\mathrm{CO}_{2}$ 的含量不超过0.06%(假定输入的新鲜空气与原有空气很快混合均匀后，以相同的流量排出)?

5. 设可导函数 $\varphi ( x )$ 满足

$$\varphi \left( x \right)\cos x + 2\int_{0}^{x} \varphi \left( t \right)\sin t \mathrm{d}t = x + 1,$$

求 $\varphi ( x )$

6. 求一曲线的方程，这曲线通过原点，并且它在点 $( x , y )$ 处的切线斜率等于 $2 x + y$

7.设有一质量为m的质点做直线运动.从速度等于零的时刻起，有一个与运动方向一致、大小与时间成正比(比例系数为 $k _ { 1 } )$ 的力作用于它，此外还受一与速度成正比(比例系数为 $k _ { 2 } )$的阻力作用.求质点运动的速度与时间的函数关系.

8. 设有一个由电阻 $R = 10\Omega$ 电感 $L \equiv 2 H ($ 亨)和电源电压 $E = 20\sin 5t$ (伏)串联组成的电路.开关K合上后，电路中有电流通过.求电流i与时间t的函数关系.

9.一潜水艇在水中下沉时，所受阻力与下降速度成正比，如当 $t { = } 0$ 时， $v { = } v _ { 0 }$ ，求下沉速度.

10.设空中一雨滴的初始质量为 $M_{0}$ 克，雨滴在自由下落过程中均匀蒸发，假设每秒钟蒸发$m _ { 1 }$ 克，且空气阻力和雨滴速度成正比.设开始时刻雨滴的速度为零，试求雨滴速度与时间的关系.

11.一子弹以速度 $\mathcal { V } _ { 0 }$ 打进一块厚为h的木板，然后穿过它，以速度 $\mathcal { D } _ { 1 }$ 离开此板.假设木板对子弹的阻力与速度平方成正比，问子弹穿过该板需经过多少时间？

12.一曲线在任一点的斜率等 $\frac{2y + x + 1}{x}$ ，且通过点(1，0)，试求此曲线的方程式

[page:172]

## 第5章微分方程

13.求曲线的方程，此曲线上任一点 $( x , y )$ 处之切线垂直于此点与原点的连线

14.求下列伯努利方程的通解:

(1) $\frac{\mathrm{d}y}{\mathrm{d}x} + y = y^{2} \left( \cos x - \sin x \right);$ (2) $\frac{\mathrm{d}y}{\mathrm{d}x}-3xy=xy^{2}$

(3) $\frac{\mathrm{d}y}{\mathrm{d}x} + \frac{1}{3}y = \frac{1}{3}(1 - 2x)y^{4}$ (4) $\frac{\mathrm{d}y}{\mathrm{d}x} = y = xy^{5}$

(5) $x \mathrm{d}y - \left[ y + xy^{3} \left( 1 + \ln x \right) \right] \mathrm{d}x = 0;$ (6) $\frac{\mathrm{d}y}{\mathrm{d}x} + \frac{1}{x}y = x^{2}y^{6}$

(7) $\frac{\mathrm{d}y}{\mathrm{d}x} + \frac{xy}{1 - x^{2}} = xy^{\frac{1}{2}}$ (8) $3x(1 - x^{2})y^{2}\frac{\mathrm{d}y}{\mathrm{d}x} + (2x^{2} - 1)y^{3} = ax^{3}$ ae

(9) $y^{\prime}-y=\frac{1}{y}x^{2}; \quad (10) 3y^{2}y^{\prime}-ay^{3}=x+1;$

(11) $y^{\prime} \cos y + \sin y \cos^2 y = \sin^3 y.$

15. 验证形如 $y f(x y) \mathrm{d}x + x g(x y) \mathrm{d}y = 0$ 的微分方程，可经变量代换 $v = x y$ 化为可分离变量的方程，并求其通解.

16.用适当的变量代换将下列方程化为可分离变量的方程，然后求出通解:

(1) $\frac{\mathrm{d}y}{\mathrm{d}x}=(x+y)^{2}; \quad (2) \frac{\mathrm{d}y}{\mathrm{d}x}=\frac{1}{x-y}+1;$

(3) $xy' + y = y(\ln x + \ln y)$

(4) $y^{\prime} = y^{2} + 2(\sin x - 1)y + \sin^{2}x - 2\sin x - \cos x + 1;$

(5) $y(xy + 1)\mathrm{d}x + x(1 + xy + x^{2}y^{2})\mathrm{d}y = 0.$

17. 求解积分方程

$$\int _ { 0 } ^ { 1 } \varphi \left( t x \right) \mathrm{d}t = n \varphi \left( x \right) ,$$

其中 $\varphi ( x )$ 是可微的未知函数

## 5.5 可降阶的高阶微分方程

从本节起将讨论二阶及二阶以上的微分方程，即所谓高阶微分方程.对于有些高阶微分方程，可以通过代换将它化成较低阶的方程来求解.以二阶微分方程

$$y ^ { \prime \prime } = f ( x , y , y ^ { \prime } )\tag{5.44}$$

而论，如果能设法作代换把它从二阶降至一阶，那么就有可能应用前面所讲的方法来求出它的解.

下面介绍三种容易降阶的高阶微分方程的求解方法

## 5.5.1 $y^{(n)} = f(x)$ 型的微分方程

微分方程

$$y^{(n)} = f(x)\tag{5.45}$$

的右端仅含有自变量x.容易看出，只要把 $y^{(n - 1)}$ 作为新的未知函数，那么式(5.45)

[page:173]

## 5.5可降阶的高阶微分方程

就是新未知函数的一阶微分方程.两边积分，就得到一个 $n { - } 1$ 阶的微分方程

$$y^{(n-1)} = \int f(x)   dx + C_1.$$

同理可得

$$y^{(n-2)} = \int \left[ \int f(x)   dx + C_1 \right] dx + C_2.$$

依此法继续进行，接连积分n次，便得方程(5.45)的含有n个任意常数的通解.

例5.17 求微分方程

$$y'' = \mathrm{e}^{2x} - \cos x$$

的通解.

解对所给方程接连积分三次，得

$$\begin{aligned}y^{\prime\prime} &= \frac{1}{2}\mathrm{e}^{2x} - \sin x + C, \\y^{\prime} &= \frac{1}{4}\mathrm{e}^{2x} + \cos x + C_{2} + C_{3}, \\y &= \frac{1}{8}\mathrm{e}^{2x} + \sin x + C_{1}x^{2} + C_{2}x + C_{3}, \quad C_{1} = \frac{C}{2}.\end{aligned}$$

这就是所求的通解

例5.18 质量为m的质点受力F的作用沿Ox轴做直线运动.设力F仅是时间t的函数，即 $F = F(t)$ .在开始时刻 $t = 0$ 时 $F(0) = F_0$ ，随着时间t的增大，此力$F$ 均匀地减少，直到 $t = T$ 时， $F(T) = 0$ .如果开始时质点位于原点，且初速度为零，求这质点的运动规律.

解设 $x = x(t)$ 表示在时刻t时质点的位置，根据牛顿第二定律，质点运动的微分方程为

$$m \frac{\mathrm{d}^{2} x}{\mathrm{d} t^{2}} = F(t).\tag{5.46}$$

由题设，力 $F(t)$ 随t增大而均匀地减小，且当 $t = 0$ 时， $F(0) = F_{0}$ ,所以 $F(t) = F_0 =$ $R t$ 当 $t = T$ 时， $F(T) = 0$ ，从而

$$F(t) = F_0\left(1 - \frac{t}{T}\right).$$

于是方程(5.46)可以写成

$$\frac{\mathrm{d}^{2} x}{\mathrm{d} t^{2}} = \frac{F_{0}}{m} \left( 1 - \frac{t}{T} \right).\tag{5.47}$$

其初始条件为

$$\left. x \right|_{t = 0} = 0,\left. \frac{\mathrm{d}x}{\mathrm{d}t} \right|_{t = 0} = 0.$$

把式(5.47)两端积分，得

[page:174]

## 第5章微分方程

$$\frac{\mathrm{d}x}{\mathrm{d}t} = \frac{F_{0}}{m} \int \left( 1 - \frac{t}{T} \right) \mathrm{d}t,$$

即

$$\frac{\mathrm{d}x}{\mathrm{d}t} = \frac{F_{0}}{m}\left(t - \frac{t^{2}}{2T}\right) + C_{1}.\tag{5.48}$$

将条件 $\left. \frac{\mathrm{d}x}{\mathrm{d}t} \right|_{t = 0} = 0$ 代入式(5.48)，得

$$C _ { 1 } \equiv 0 ,$$

于是式(5.48)化为

$$\frac{\mathrm{d}x}{\mathrm{d}t} = \frac{F_{0}}{m} \left( t - \frac{t^{2}}{2T} \right).\tag{5.49}$$

把式(5.49)两端积分，得

$$x = \frac{F_{0}}{m}\left( \frac{t^{2}}{2} - \frac{t^{3}}{6T} \right) + C_{2},$$

将条件 $x \mid_{t = 0} = 0$ 代入上式，得

$$C _ { 2 } \equiv 0 .$$

于是所求质点的运动规律为

$$x = \frac{F_{0}}{m}\left( \frac{t^{2}}{2} - \frac{t^{3}}{6T} \right), \quad 0 \leqslant t \leqslant T.$$

## 5.5.2 $y^{\prime\prime} = f(x,y^{\prime})$ 型的微分方程

方程

$$y'' = f(x,y')\tag{5.50}$$

的右端不显含未知函数 $y .$ 如果设 $y ^ { \prime } = p$ ,那么

$$y ^ { \prime \prime } = \frac { \mathrm { d } p } { \mathrm { d } x } = p ^ { \prime } ,$$

而方程(5.50)就化为

$$p ^ { \prime } = f ( x , p ) .$$

这是一个关于变量 $x , p$ 的一阶微分方程.设其通解为

$$p = \varphi ( x , C _ { 1 } ) .$$

但是 $p = \frac{\mathrm{d}y}{\mathrm{d}x}$ ，因此又得到一个一阶微分方程

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \varphi(x, C_1).$$

对它进行积分，便得方程(5.50)的通解为

$$y = \int \varphi \left( x , C _ { 1 } \right) \mathrm{d}x + C _ { 2 }.$$

[page:175]

## 5.5 可降阶的高阶微分方程

## 例5.19 求解微分方程

$$y'' + \frac{1}{x}y' = x.$$

解 所给方程是 $y^{\prime \prime} = f(x,y^{\prime})$ 型的.设 $y ^ { \prime } = p$ ,则 $y ^ { \prime \prime } = p ^ { \prime }$ ，方程化为

$$p^{\prime} + \frac{1}{x}p = x.$$

这是一阶线性方程.由通解公式可得

$$\begin{aligned} &p = \mathrm{e}^{-\int_{x}^{1} \mathrm{d}x} \left[ \int_{x}^{1} \mathrm{e}^{\int_{x}^{1} \mathrm{d}x} \mathrm{d}x + C_{1} \right] = \mathrm{e}^{-\ln|x|} \left[ \int_{x}^{1} \mathrm{e}^{\ln|x|} \mathrm{d}x + C_{1} \right] \\&= \frac{1}{|x|} \left[ \int_{x}^{1} \mathrm{e}^{\int_{x}^{1} \mathrm{d}x} \mathrm{d}x + C_{1} \right] = \frac{1}{x} \left[ \int_{x}^{1} \mathrm{e}^{\int_{x}^{1} \mathrm{d}x} \mathrm{d}x + C_{2} \right] \\&= \frac{1}{3}x^{2} + \frac{C_{2}}{x}.\\ \end{aligned}$$

再积分，便得到原方程的通解

$$y = \frac{1}{9}x^{3} + C_{2}\ln\left| x \right| + C_{3},$$

其中 $C_{2},C_{3}$ 为两个任意常数.

例5.20设有一均匀、柔软的绳索，两端固定，绳索仅受重力的作用而下垂试问该绳索在平衡状态时是怎样的曲线？

解 设绳索的最低点为A.取y轴通过点A铅直向上，并取x轴水平向右.且

OA|等于某个定值(这个定值将在以后说明).设绳索曲线的方程为 $y = y(x)$ .考察绳索上点A到另一点 $M ( x$ $y )$ 间的一段弧AM，设其长为s.假定绳索的线密度为， $\rho _ { * }$则弧AM的重量为 $\rho g s$ .由于绳索是柔软的，因而在点A处的张力沿水平的切线方向，其大小设为H；在点M处的张力沿该点处的切线方向，设其倾角为θ，其大小为T (图 5.10).因作用于弧段 $\widehat { A M }$ 的外力相互平衡，把作用于弧 $\widehat { A M }$ 上的力沿铅直及水平两方向分解，得

$$T \sin \theta = \rho g s , \quad T \cos \theta = H.$$

两式相除，得

$$\tan \theta = \frac{1}{a} s, \quad \left( a = \frac{H}{\rho g} \right).$$

由于 $\tan \theta = y^{\prime}, s = \int_{0}^{x} \sqrt{1 + y^{\prime 2}}   dx$ ，代入上式，即得

$$y ^ { \prime } = \frac { 1 } { a } \int _ { 0 } ^ { x } \sqrt { 1 + y ^ { \prime 2 } } \mathrm { d } x.$$

将上式两端对x求导，便得 $y = y(x)$ 满足的微分方程

[page:176]

## 第5章微分方程

$$y'' = \frac{1}{a} \sqrt{1 + y'^2}.\tag{5.51}$$

取原点O到点A的距离为定值 $\mathcal { Q }$ ,即 $|OA| = a$ ,那么初始条件为

$$y \mid_{x = 0} = a, \quad y^{\prime} \mid_{x = 0} = 0.$$

下面来解方程(5.51).

方程(5.51)属于 $y^{\prime \prime} = f(x,y^{\prime})$ 的类型.设 $y^{\prime} = p$ ,则 $y'' = \frac{\mathrm{d}p}{\mathrm{d}x}$ ，代入方程(5.51)，并分离变量，得

$$\frac{\mathrm{d}p}{\sqrt{1 + p^{2}}} = \frac{\mathrm{d}x}{a}.$$

两端积分，得

$$\mathrm{arcsh}p = \frac{x}{a} + C_{1}.\tag{5.52}$$

把条件 $y^{\prime} \mid_{x = 0} = p \mid_{x = 0} = 0$ 代入式(5.52)，得

$$C _ { 1 } = 0 ,$$

于是式(5.52)成为

$$\mathrm{arcsh} p = \frac{x}{a}.$$

即

$$y ^ { \prime } = \operatorname { s h } \frac { x } { a } .$$

积分上式两端，便得

$$y = a \operatorname{ch} \frac{x}{a} + C_2.\tag{5.53}$$

将条件 $y \mid_{x = 0} = a$ 代入式(5.53)，得

$$C _ { 2 } = 0 .$$

于是该绳索的形状可由曲线方程

$$y = a \mathrm{ch} \frac{x}{a} = \frac{a}{2} \left( \mathrm{e}^{\frac{x}{a}} + \mathrm{e}^{-\frac{x}{a}} \right)$$

来表示.此曲线叫做悬链线.

## 5.5.3 $y ^ { \prime \prime } = f ( y , y ^ { \prime } )$ 型的微分方程

方程

$$y'' = f(y,y')\tag{5.54}$$

中不明显地含自变量x.为了求出它的解，令 $y ^ { \prime } = p$ ，并利用复合函数的求导法则把$y ^ { \prime \prime }$ 化为对y的导数，即

[page:177]

## 5.5 可降阶的高阶微分方程

$$y'' = \frac{\mathrm{d}p}{\mathrm{d}x} = \frac{\mathrm{d}p}{\mathrm{d}y} \cdot \frac{\mathrm{d}y}{\mathrm{d}x} = p \frac{\mathrm{d}p}{\mathrm{d}y}.$$

这样，方程(5.54)就化为

$$p \frac{\mathrm{d}p}{\mathrm{d}y} = f(y, p).$$

这是一个关于变数 $y , p$ 的一阶微分方程，设它的通解为

$$y ^ { \prime } = p = \varphi ( y , C _ { 1 } ) ,$$

分离变量并积分，便得方程(5.54)的通解为

$$\int \frac{\mathrm{d}y}{\varphi\left( y,C_{1} \right)} = x + C_{2}.$$

例5.21 求微分方程

$$1 + y y ^ { \prime \prime } + y ^ { \prime 2 } = 0\tag{5.55}$$

的通解.

解 方程(5.55)不明显地含自变量 $\mathcal { X }$ ,设

$$y ^ { \prime } = p , \quad  则  y ^ { \prime \prime } = p \frac { \mathrm { d } p } { \mathrm { d } y } ,$$

代入方程(5.55)，得

$$1 + y p \frac{\mathrm{d}p}{\mathrm{d}y} + p^2 = 0.$$

分离变量，得

$$\frac{p \mathrm{d}p}{1 + p^{2}} = - \frac{\mathrm{d}y}{y}.$$

两端积分，得

$$\frac{1}{2}\ln(1 + p^{2}) = -\ln|y| + C,$$

于是有

$$(1 + p^{2})y^{c} = C_{1}$$

解得

$$p = \pm \frac{\sqrt{C_{1} - y^{2}}}{y};$$

即

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \pm \frac{\sqrt{C_{1} - y^{2}}}{y}.$$

再分离变量，得

$$\pm \frac{y\mathrm{d}y}{\sqrt{C_{1} - y^{2}}} = \mathrm{d}x,$$

[page:178]

## 第5章微分方程

两边积分，得

$$\mp \sqrt{C_{1}-y^{2}}=x+C_{2},$$

即

$$(x + C_{2})^{2} + y^{2} = C_{1}.$$

这就是原方程的通解.

例5.22一个离地面很高的物体，受地球引力的作用，由静止开始落向地面.求它落到地面时的速度和所需的时间(不计空气阻力).

解 取连接地球中心与该物体的直线为y轴，其方向铅直向上，取地球的中心为原点O(图5.11).

设地球的半径为R，物体的质量为m，物体开始下落时与地球中心的距离为 $l ( l > R )$ ，在时刻t物体所在位置为 $y = y(t)$ ，于是速度为 $v(t) = \frac{\mathrm{d}v}{\mathrm{d}t},$ 根据万有引力定律，即

得微分方程

$$m \frac{\mathrm{d}^{2} y}{\mathrm{d} t^{2}} = - \frac{k m M}{y^{2}},$$

即

$$\frac{\mathrm{d}^{2} y}{\mathrm{d} t^{2}} = - \frac{k M}{y^{2}},\tag{5.56}$$

其中M为地球的质量，k为引力常数.因为当 $y = R$ 时， $\frac{\mathrm{d}^{2} y}{\mathrm{d} t^{2}} = - g$ (这里负号是由于物体运动加速度的方向与ν轴的正向相反的缘故)，所以 $g = \frac{kM}{R^{2}}, kM = gR^{2}$ 于是方程(5.56)化为

$$\frac{\mathrm{d}^{2} y}{\mathrm{d} t^{2}} = - \frac{g R^{2}}{y^{2}},\tag{5.57}$$

初始条件是

$$y \mid_{t=0} = l, \quad y^{\prime} \mid_{t=0} = 0.$$

先求物体到达地面时的速度.由 $\frac{\mathrm{d}y}{\mathrm{d}t} = v$ 得

$$\frac{\mathrm{d}^{2} y}{\mathrm{d} t^{2}} = \frac{\mathrm{d} v}{\mathrm{d} t} = \frac{\mathrm{d} v}{\mathrm{d} y} \cdot \frac{\mathrm{d} y}{\mathrm{d} t} = v \frac{\mathrm{d} v}{\mathrm{d} y},$$

代入方程(5.57)并分离变量，得

$$v \mathrm{d}v = - \frac{g R^{2}}{y^{2}} \mathrm{d}y.$$

两端积分，得

[page:179]

## 5.5 可降阶的高阶微分方程

$$v^{2} = \frac{2gR^{2}}{y} + C_{1}.$$

把初始条件代入上式，得

$$C_{1} = - \frac{2gR^{2}}{l},$$

于是

$$v ^ { 2 } = 2 g R ^ { 2 } \left( \frac { 1 } { y } - \frac { 1 } { l } \right) , \quad v = - R \sqrt { 2 g \left( \frac { 1 } { y } - \frac { 1 } { l } \right) } .\tag{5.58}$$

其中取负号是由于物体运动的方向与 $\mathcal { Y }$ 轴的正向相反的缘故

在式(5.58)中令 $y = R$ ，就得到物体到达地面时的速度为

$$v = - \sqrt{\frac{2gR(l - R)}{l}}.$$

下面来求物体落到地面所需的时间.由式(5.58)，有

$$\frac{\mathrm{d}y}{\mathrm{d}t}=v=-R\sqrt{2g\left(\frac{1}{y}-\frac{1}{l}\right)},$$

分离变量，得

$$\mathrm{d}t = - \frac{1}{R} \sqrt{\frac{l}{2g}} \sqrt{\frac{y}{l - y}} \mathrm{d}y.$$

两端积分(对右端积分利用置换 $y = l \cos^2 u$ ,得

$$t = \frac{1}{R} \sqrt{\frac{l}{2g}} \left[ \sqrt{ly - y^2} + l \arccos \sqrt{\frac{y}{l}} \right] + C_2.\tag{5.59}$$

由条件 $y \mid_{t = 0} = l$ ,得

$$C _ { 2 } = 0 .$$

于是式(5.59)化为

$$t = \frac{1}{R} \sqrt{\frac{l}{2g}} \left[ \sqrt{ly - y^2} + l \arccos \sqrt{\frac{y}{l}} \right].$$

上式令 $\scriptstyle { \underline { { { y } } } } = \underline { { { R } } }$ ，便得到物体到达地面所需的时间

$$t = \frac{1}{R} \sqrt{\frac{l}{2g}} \left( \sqrt{lR - R^2} + l \arccos \sqrt{\frac{R}{l}} \right).$$

1. 求下列各微分方程的通解:

[page:180]

## 第5章 微分方程

(1) $y^{\prime} = x + \sin x;$ (2) $y^{\prime\prime} = x\mathrm{e}^{x}$

(3) $y^{\prime\prime} = \frac{1}{1 + x^{2}};$ (4) $y^{\prime\prime} = 1 + y^{\prime 2}$

(5) $y^{\prime\prime} = y^{\prime} + x;$ (6) $xy^{\prime\prime} + y^{\prime} = 0$

(7) $y y ^ { \prime \prime } + 2 y ^ { \prime 2 } = 0 ; \quad ( 8 ) y ^ { 3 } y ^ { \prime \prime } - 1 = 0 ;$

(9) $y^{\prime \prime} = \frac{1}{\sqrt{y}}; \quad (10) y^{\prime \prime} = (y^{\prime})^3 + y^{\prime};$

(11) $y^{\prime}+y^{\prime 2}+1=0; \quad (12) y y^{\prime\prime}-y^{\prime 2}-1=0;$

(13) $\left( \frac{\mathrm{d}y}{\mathrm{d}x} \right)^{3} - 4x^{2} \frac{\mathrm{d}y}{\mathrm{d}x} = 0;$ 1 (14) $xy(y^{\prime})^{2}-(x^{2}+y^{2})y^{\prime}+xy=0;$

(15) $(y^{\prime})^{3}-y^{\prime}\mathrm{e}^{2x}=0; \quad (16) (y^{\prime})^{2}-4y^{2}=0;$

(17) $y^{\prime 2}-2y^{\prime}+2y=0; \quad (18) x y^{\prime \prime}+y^{\prime \prime}=1;$

(19) $y^{\prime \prime} = \left[ 1 + y^{\prime 2} \right]^{3/2}; \quad (20) y^{\prime \prime} = 2yy^{\prime};$ 二二

(21) $y^{\prime\prime}(e^{x}+1)+y^{\prime}=0;$ (22) $xy^{\prime\prime} = y^{\prime} + x\sin\frac{y^{\prime}}{x}.$

2. 求下列各微分方程满足所给初始条件的特解:

(1) $y^{3}y^{\prime \prime }+1=0,y\mid _{x=1}=1,y^{\prime }\mid _{x=1}=0;$

(2) $y^{\prime \prime}-ay^{\prime 2}=0,y|_{x=0}=0,y^{\prime}|_{x=0}=-1;$

(3) $y'' = \mathrm{e}^{ax} , y|_{x=1} = y'|_{x=1} = y''|_{x=1} = 0;$

(4) $y^{\prime \prime} = \mathrm{e}^{2y}, y|_{x = 0} = y^{\prime}|_{x = 0} = 0;$

(5) $y^{\prime \prime}=3\sqrt{y},y|_{x=0}=1,y^{\prime}|_{x=0}=2;$

(6) $y^{\prime\prime}+(y^{\prime})^{2}=1,y|_{x=0}=0,y^{\prime}|_{x=0}=0;$

(7) $2y^{\prime\prime}-\sin 2y=0,y|_{x=0}=\frac{\pi}{2},y^{\prime}|_{x=0}=1.$

3. 试求 $y'' = x$ 的经过点M(0,1)且在此点与直线 $y=\frac{x}{2}+1$ 相切的积分曲线.

4.设有一质量为m的物体，在空中由静止开始下落，如果空气阻力为 $R = c v ( c$ 为常数，v为物体运动的速度)，试求物体下落的距离s与时间t的函数关系.

## 5.6 高阶线性微分方程

本节和以下两节将讨论在实际问题中应用得较多的所谓高阶线性微分方程讨论时以二阶线性微分方程为主

## 5.6.1二阶线性微分方程举例

例5.23设有一个弹簧，它的上端固定，下端挂一个质量为m的物体.当物体处于静止状态时，作用在物体上的重力与弹性力大小相等、方向相反.这个位置就是物体的平衡位置.如图5.12所示，取x轴铅直向下，并取物体的平衡位置为坐标原点

[page:181]

## 5.6 高阶线性微分方程

如果使物体具有一个初始速度 $v _ { 0 } \neq 0$ ，那么物体便离开平衡位置，并在平衡位置附近作上下振动.在振动过程中，物体的位置x随时间t变化，即x是t的函数，即 $\bar{x} = x(t)$ .要确定物体的振动规律，就要求出函数 $x = x(t)$

由力学知道，弹簧使物体回到平衡位置的弹性恢复力f(它不包括在平衡位置时和重力 $m g$ 相平衡的那一部分弹性力)和物体离开平衡位置的位移 $\mathcal { X }$ 成正比，即

$$f = -cx$$

其中 $\mathcal { C }$ 为弹簧的弹性系数，负号表示弹性恢复力的方向和物体位移的方向相反.

图5.12

另外，物体在运动过程中还受到阻尼介质(如空气、油等)的阻力的作用，使得振动逐渐趋向停止.由实验知道，阻力R的方向总与运动方向相反，当运动速度不大时，其大小与物体运动的速度成正比，设比例系数为 $\mu$ ，则有

$$R = - \mu \frac{\mathrm{d}x}{\mathrm{d}t}.$$

根据上述关于物体受力情况的分析，由牛顿第二定律得

$$m \frac{\mathrm{d}^{2} x}{\mathrm{d} t^{2}} = - c x - \mu \frac{\mathrm{d} x}{\mathrm{d} t}.$$

移项，并记

$$2n = \frac{\mu}{m}, \quad k^{2} = \frac{c}{m},$$

则上式化为

$$\frac{\mathrm{d}^{2} x}{\mathrm{d} t^{2}} + 2 n \frac{\mathrm{d} x}{\mathrm{d} t} + k^{2} x = 0.\tag{5.60}$$

这就是在有阻尼的情况下，物体自由振动的微分方程

如果物体在振动过程中，还受到铅直干扰力

$$F = H { \operatorname { s i n } } p t$$

的作用，则有

$$\frac { \mathrm { d } ^ { 2 } x } { \mathrm { d } t ^ { 2 } } + 2 n \frac { \mathrm { d } x } { \mathrm { d } t } + k ^ { 2 } x = h \sin p t   ,\tag{5.61}$$

其中 $h { = } \frac { H } { m } .$ 这就是强迫振动的微分方程

例5.24 设有一个由电阻 $R$ 、自感L、电容C和电源E串联组成的电路，其中R，L及C为常数.电源电动势是时间t的函数，且 $E = E_{ m }$ sinωt，这里 $E_{ m }$ 及 $\omega$ 也是常数(图5.13).

设电路中的电流为 $i ( t )$ ，电容器极板上的电荷量为 $q ( t )$ ，两极板间的电压为

[page:182]

## 第5章微分方程

$u _ { C }$ ，自感电动势为 $E _ { L }$ .由电学知

$$i = \frac{\mathrm{d}q}{\mathrm{d}t}, \quad u_{C} = \frac{q}{C}, \quad E_{L} = -L\frac{\mathrm{d}i}{\mathrm{d}t},$$

根据回路电压定律，得

$$E - L \frac{\mathrm{d}i}{\mathrm{d}t} - \frac{q}{C} - R i = 0 ,$$

即

$$L C \frac { \mathrm { d } ^ { 2 } u _ { C } } { \mathrm { d } t ^ { 2 } } + R C \frac { \mathrm { d } u _ { C } } { \mathrm { d } t } + u _ { C } = E _ { \mathrm { m } } \sin \omega t ,$$

图5.13

或写成

$$\frac { \mathrm { d } ^ { 2 } u _ { C } } { \mathrm { d } t ^ { 2 } } + 2 \beta \frac { \mathrm { d } u _ { C } } { \mathrm { d } t } + \omega _ { 0 } ^ { 2 } u _ { C } = \frac { E _ { \mathrm { m } } } { L C } \sin \omega t ,\tag{5.62}$$

其中 $\beta = \frac{R}{2L}, \omega_{0} = \frac{1}{\sqrt{LC}}$ .这就是串联电路的振荡方程

如果电容器经充电后撤去外电源 $(E = 0)$ ，则方程(5.62)成为

$$\frac { \mathrm { d } ^ { 2 } u _ { C } } { \mathrm { d } t ^ { 2 } } + 2 \beta \frac { \mathrm { d } u _ { C } } { \mathrm { d } t } + \omega _ { 0 } ^ { 2 } u _ { C } = 0 .\tag{5.63}$$

例5.22和例5.23虽然是两个不同的实际问题，但是仔细观察一下所得出的方程(5.61)和(5.62)，就会发现它们可以归结为同一个形式

$$\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} + P(x) \frac{\mathrm{d} y}{\mathrm{d} x} + Q(x) y = f(x)\tag{5.64}$$

而方程(5.60)和方程(5.63)都是方程(5.64)的特殊情形: $f(x) \equiv 0$ .在工程技术的其他许多问题中，也会遇到上述类型的微分方程

方程(5.64)叫做二阶线性微分方程.当方程右端 $f(x) \equiv 0$ 时，方程叫做齐次的；当 $f ( x )$ 不恒等于零时，方程叫做非齐次的

于是方程(5.61)、(5.62)都是二阶非齐次线性微分方程；方程(5.60)、(5.63)都是二阶齐次线性微分方程

要进一步讨论例5.22和例5.23中的问题，就需要解二阶线性微分方程.为此，下面来讨论二阶线性微分方程的解的一些性质，这些性质可以推广到n阶线性方程

$$y^{(n)} + a_{1}(x)y^{(n-1)} + \cdots + a_{n-1}(x)y^{\prime} + a_{n}(x)y = f(x).$$

## 5.6.2 线性微分方程的解的结构

先讨论二阶齐次线性方程

[page:183]

## 5.6 高阶线性微分方程

$$y ^ { \prime \prime } + P ( x ) y ^ { \prime } + Q ( x ) y = 0\tag{5.65}$$

定理5.1如果函数 $y_{1}(x)$ 与 $y_{2}(x)$ 是方程(5.65)的两个解，那么

$$y = C_{1}y_{1}(x) + C_{2}y_{2}(x)\tag{5.66}$$

也是方程(5.65)的解，其中 $C_{1},C_{2}$ 是任意常数.

证将式(5.66)代入式(5.65)左端，得

$$\begin{aligned} &\left[C_{1} y_{1}^{\prime \prime}+C_{2} y_{2}^{\prime \prime}\right]+P(x)\left[C_{1} y_{1}^{\prime}+C_{2} y_{2}^{\prime}\right]+Q(x)\left[C_{1} y_{1}+C_{2} y_{2}\right] \\=&C_{1}\left[y_{1}^{\prime \prime}+P(x) y_{1}^{\prime}+Q(x) y_{1}\right]+C_{2}\left[y_{2}^{\prime \prime}+P(x) y_{2}^{\prime}+Q(x) y_{2}\right]\end{aligned}$$

由于 $\mathcal{Y}_{1}$ 与 $y_{2}$ 是方程(5.65)的解，上式右端方括号中的表达式都恒等于零，因而整个式子恒等于零，所以式(5.66)是方程(5.65)的解

齐次线性方程的这个性质表明它的解符合迭加原理

迭加起来的解(5.66)从形式上来看含有 $C _ { 1 }$ 与 $C _ { 2 }$ 两个任意常数，但它不一定是方程(5.65)的通解.例如，设 $y_{1}(x)$ 是方程(5.65)的一个解，则 $y_{2}(x) = 2y_{1}(x)$也是方程(5.65)的解.这时式(5.66)成为 $y = C_{1}y_{1}(x) + 2C_{2}y_{1}(x)$ ，可以把它改写成 $y = C y_{1}(x)$ ，其中 $C = C_{1} + 2C_{2}$ .这显然不是方程(5.65)的通解.那么在什么情况下式(5.66)才是方程(5.65)的通解呢？要解决这个问题，还需引入一个新的概念，即所谓函数的线性相关与线性无关.

设 $y_{1}(x), y_{2}(x), \cdots, y_{n}(x)$ 为定义在区间I上的n个函数，如果存在n个不全为零的常数 $k_{1},k_{2},\cdots,k_{n}$ ，使得当 $x \in I$ 时有恒等式

$$k_{1}y_{1} + k_{2}y_{2} + \cdots + k_{n}y_{n} \equiv 0$$

成立，那么称这n个函数在区间Ⅰ上线性相关；否则称线性无关

例如，函数 $1,\cos^{2}x,\sin^{2}x$ 在整个数轴上是线性相关的.因为取 $k_{1} = 1, k_{2} = k_{3} =$一1，就有恒等式

$$1 = \cos^{2}x - \sin^{2}x \equiv 0.$$

而函数 $1 , x , x ^ { 2 }$ 在任何区间 $(a,b)$ 内是线性无关的.因为如果 $k_{1},k_{2},k_{3}$ 不全为零，那么在该区间内至多只有两个x值能使二次三项式

$$k_{1} + k_{2}x + k_{3}x^{2}$$

为零；要使它恒等于零，必须 $k_{1},k_{2},k_{3}$ 全为零.

应用上述概念可知，对于两个函数的情形，它们线性相关与否，只要看它们的比是否为常数.如果比为常数，那么它们就线性相关；否则就线性无关

有了线性无关的概念后，便有如下关于二阶齐次线性微分方程(5.65)的通解结构的定理.

定理5.2 如果 $y_{1}(x)$ 与 $y_{2}(x)$ 是方程(5.65)的两个线性无关的特解，那么

$$y = C_{1}y_{1}(x) + C_{2}y_{2}(x), \quad C_{1},C_{2}  是任意常数 ,$$

就是方程(5.65)的通解.

例如，方程 $y^{\prime\prime} + y = 0$ 是二阶齐次线性方程(这里 $P(x) \equiv 0, Q(x) \equiv 1$ .容易验

[page:184]

## 第5章微分方程

证 $y_{1} = \cos x$ 与 $y_{2} = \sin x$ 是所给方程的两个解，且 $\frac{y_{2}}{y_{1}}=\frac{\sin x}{\cos x}=\tan x$ 不恒等于常数，即它们是线性无关的.因此方程 $y^{\prime\prime} + y = 0$ 的通解为

$$y = C_{1}\cos x + C_{2}\sin x.$$

又如，方程 $(x - 1)y^{\prime\prime} - xy^{\prime} + y = 0$ 也是二阶齐次线性方程$\left( P(x) = - \frac{x}{x - 1}, Q(x) = \frac{1}{x - 1} \right)$ .容易验证 $y_{1} = x, y_{2} = \mathrm{e}^{x}$ 是所给方程的两个解，且$\frac{y_{2}}{y_{1}} = \frac{\mathrm{e}^{x}}{x}$ 不恒等于常数，即它们是线性无关的.因此方程的通解为

$$y = C_{1}x + C_{2}\mathrm{e}^{x}.$$

定理5.2不难推广到n阶齐次线性方程

推论5.1 如果 $y_{1}(x), y_{2}(x), \cdots, y_{n}(x)$ 是n阶齐次线性方程

$$y^{(n)} + a_{1}(x)y^{(n-1)} + \cdots + a_{n-1}(x)y' + a_{n}(x)y = 0$$

的n个线性无关的解，那么，此方程的通解为

$$y = C _ { 1 } y _ { 1 } ( x ) + C _ { 2 } y _ { 2 } ( x ) + \cdots + C _ { n } y _ { n } ( x ) ,$$

其中 $C_{1},C_{2},\cdots,C_{n}$ 为任意常数.

下面讨论二阶非齐次线性方程(5.64).方程(5.65)叫做与非齐次方程(5.64)对应的齐次方程

在前面我们已经看到，一阶非齐次线性微分方程的通解由两部分构成:一部分是对应的齐次方程的通解；另一部分是非齐次方程本身的一个特解.实际上，不仅一阶非齐次线性微分方程的通解具有这样的结构，而且二阶及更高阶的非齐次线性微分方程的通解也具有同样的结构.

定理5.3设 $y^{*}(x)$ 是二阶非齐次线性方程

$$y ^ { \prime \prime } + P ( x ) y ^ { \prime } + Q ( x ) y = f ( x )\tag{5.67}$$

的一个特解. $Y(x)$ 是与它对应的齐次方程(5.65)的通解，那么

$$y = Y(x) + y^{*}(x)\tag{5.68}$$

是二阶非齐次线性微分方程(5.67)的通解.

证把式(5.68)代入方程(5.67)的左端，得

$$\begin{align*}&\left( Y^{\prime\prime} + y^{*\prime} \right) + P(x)\left( Y^{\prime} + y^{*\prime} \right) + Q(x)\left( Y + y^{*} \right) \\=& \left[ Y^{\prime\prime} + P(x)Y^{\prime} + Q(x)Y \right] + \left[ y^{*\prime} + P(x)y^{*\prime} + Q(x)y^{*} \right]\end{align*}$$

由于Y是方程(5.65)的解， $y ^ { * }$ 是(5.67)的解，可知第一个括号内的表达式恒等于零，第二个恒等于 $f(x)$ .这样 $,y = Y + y^{*}$ 使(5.67)的两端恒等，即式(5.68)是方程(5.67)的解.

由于对应的齐次方程(5.65)的通解 $Y = C_{1}y_{1} + C_{2}y_{2}$ 中含有两个任意常数，所以 $y = Y + y^{*}$ 中也含有两个任意常数，从而它就是二阶非齐次线性方程(5.67)的

[page:185]

## 5.6 高阶线性微分方程

通解.

例如，方程 $y'' + y = x^2$ 是二阶非齐次线性微分方程.已知 $Y = C_{1} \cos x + C_{2} \sin x$是对应的齐次方程 $y'' + y = 0$ 的通解；又容易验证 $y^{*} = x^{2} - 2$ 是所给方程的一个特解.因此

$$y = C_{1}\cos x + C_{2}\sin x + x^{2} - 2$$

是所给方程的通解

非齐次线性微分方程(5.67)的特解有时可用下述定理来帮助求出.

定理5.4 设非齐次线性方程(5.67)的右端 $f ( x )$ 是几个函数之和，如

$$y ^ { \prime \prime } + P ( x ) y ^ { \prime } + Q ( x ) y = f _ { 1 } ( x ) + f _ { 2 } ( x ) ,\tag{5.69}$$

而 $y_{1}^{*}(x)$ 与 $y_{2}^{*}(x)$ 分别是方程

$$y^{\prime\prime} + P(x)y^{\prime} + Q(x)y = f_{1}(x)$$

与

$$y^{\prime \prime} + P(x)y^{\prime} + Q(x)y = f_{2}(x)$$

的特解，那么 $y_{1}^{*}(x) + y_{2}^{*}(x)$ 就是原方程的特解.

证将 $y = y_{1}^{*} + y_{2}^{*}$ 代入方程(5.69)的左端，得

$$\begin{align*}& \left( y_{1}^{*} + y_{2}^{*} \right)^{\prime\prime} + P(x)\left( y_{1}^{*} + y_{2}^{*} \right)^{\prime} + Q(x)\left( y_{1}^{*} + y_{2}^{*} \right) \\= & \left[ y_{1}^{*\prime} + P(x)y_{1}^{*\prime} + Q(x)y_{1}^{*} \right] + \left[ y_{2}^{*\prime} + P(x)y_{2}^{*\prime} + Q(x)y_{2}^{*} \right] \\= & f_{1}(x) + f_{2}(x),\end{align*}$$

因此 $y_{1}^{*} + y_{2}^{*}$ 是方程(5.69)的一个特解.

这一定理通常称为非齐次线性微分方程的解的迭加原理

定理5.3和定理5.4也可推广到n阶非齐次线性方程，这里不再赘述

## 5.6.3 常数变异法

在前面，为解一阶非齐次线性方程，用了常数变异法.其特点是:如果 $C y_{1}(x)$是齐次线性方程的通解，那么，可以利用变换 $y = u y_1 (x)$ (此变换是把齐次方程的通解中的任意常数C换成未知函数 $u ( x )$ 而得)去解非齐次线性方程.这一方法也适用于解高阶线性方程.下面就二阶线性方程来做讨论.

如果已知齐次方程(5.65)的通解为

$$Y(x) = C_1 y_1(x) + C_2 y_2(x),$$

那么，可以用如下的常数变异法去求非齐次方程(5.67)的通解

令

$$y = y _ { 1 } ( x ) v _ { 1 } + y _ { 2 } ( x ) v _ { 2 } ,\tag{5.70}$$

要确定未知函数 $v_{1}(x)$ 及 $v_{2}(x)$ 使式(5.70)所表示的函数y满足非齐次方程(5.67).为此，对式(5.70)求导，得

[page:186]

## 第5章 微分方程

$$y ^ { \prime } = y _ { 1 } v _ { 1 } ^ { \prime } + y _ { 2 } v _ { 2 } ^ { \prime } + y _ { 1 } ^ { \prime } v _ { 1 } + y _ { 2 } ^ { \prime } v _ { 2 } .$$

由于两个未知函数 $\mathcal { { V } } _ { 1 } \mathbin { { , } } \mathcal { { V } } _ { 2 }$ 只需满足一个关系式(5.67)，所以可规定它们再满足一个关系式.从 $y ^ { \prime }$ 的上述表示式可看出，为了使 $y ^ { \prime \prime }$ 的表示式中不含 $v_{1}^{\prime\prime}$ 和 $\vec{v_{2}}$ ，可设

$$y_{1}v_{1}^{\prime} + y_{2}v_{2}^{\prime} = 0\tag{5.71}$$

从而

$$y ^ { \prime } = y _ { 1 } ^ { \prime } v _ { 1 } + y _ { 2 } ^ { \prime } v _ { 2 } ,$$

再求导，得

$$y'' = y_{1}^{\prime}v_{1}^{\prime} + y_{2}^{\prime}v_{2}^{\prime} + y_{1}^{\prime\prime}v_{1} + y_{2}^{\prime\prime}v_{2}.$$

把 $y , y ^ { \prime } , y ^ { \prime \prime }$ 代入方程(5.67)，得

$$y_{1}^{\prime}v_{1}^{\prime}+y_{2}^{\prime}v_{2}^{\prime}+y_{1}^{\prime\prime}v_{1}+y_{2}^{\prime\prime}v_{2}+P(y_{1}^{\prime}v_{1}+y_{2}^{\prime}v_{2})+Q(y_{1}v_{1}+y_{2}v_{2})=f,$$

整理得

$$y_{1}^{\prime}v_{1}^{\prime}+y_{2}^{\prime}v_{2}^{\prime}+(y_{1}^{\prime\prime}+Py_{1}^{\prime}+Qy_{1})v_{1}+(y_{2}^{\prime\prime}+Py_{2}^{\prime}+Qy_{2})v_{2}=f.$$

注意到 $\mathcal{Y}_{1}$ 及 $\mathcal { Y } _ { 2 }$ 是齐次方程(5.65)的解，故上式即为

$$y_{1}^{\prime}v_{1}^{\prime}+y_{2}^{\prime}v_{2}^{\prime}=f.\tag{5.72}$$

联立方程(5.71)与(5.72)，在系数行列式

$$W = \begin{vmatrix} y_{1} & y_{2} \\ y_{1}^{\prime} & y_{2}^{\prime} \end{vmatrix} = y_{1}y_{2}^{\prime} - y_{1}^{\prime}y_{2} \neq 0$$

时，可解得

$$v_{1}^{\prime}=-\frac{y_{2}f}{W}, \quad v_{2}^{\prime}=\frac{y_{1}f}{W}.$$

对上两式积分(假定f(x)连续)，得

$$v _ { 1 } = C _ { 1 } + \int \left( - \frac { y _ { 2 } f } { W } \right) \mathrm { d } x , \quad v _ { 2 } = C _ { 2 } + \int \frac { y _ { 1 } f } { W } \mathrm { d } x .$$

于是得非齐次方程(5.67)的通解为

$$y = C_{1}y_{1} + C_{2}y_{2} - y_{1}\int \frac{y_{2}f}{W}\mathrm{d}x + y_{2}\int \frac{y_{1}f}{W}\mathrm{d}x.$$

例5.25 求方程 $x y^{\prime \prime} - y^{\prime} = x^{2}$ 的通解。

解 这是变系数方程，对应齐次方程为

$$xy^{\prime\prime} - y^{\prime} = 0.$$

不难由观察法知，方程有两个线性无关的特解

$$y_{1} = 1, \quad y_{2} = x^{2}.$$

于是知方程的通解为

$$\bar{y} = C_{1} \cdot 1 + C_{2}x^{2} = C_{1} + C_{2}x^{2}.$$

下面用常数变异法求非齐次方程 $xy^{\prime\prime} - y^{\prime} = x^{2}$ 的通解.把所给方程写成标准形式

[page:187]

## 5.6 高阶线性微分方程

$$y'' - \frac{1}{x}y' = x.$$

令 $y = v_{1} + x^{2}v_{2}$ . 按照

$$\begin{cases}y_{1}v_{1}^{\prime} + y_{2}v_{2}^{\prime} = 0, \\y_{1}^{\prime}v_{1}^{\prime} + y_{2}^{\prime}v_{2}^{\prime} = f,\end{cases}$$

有

$$\begin{cases}v_{1}^{\prime} + x^{2}v_{2}^{\prime} = 0, \\2xv_{2}^{\prime} = x.\end{cases}$$

解得

$$v_{1}^{\prime}=-\frac{1}{2}x^{2}, \quad v_{2}^{\prime}=\frac{1}{2}.$$

积分，得

$$v_{1}=C_{1}-\frac{1}{6}x^{3}, \quad v_{2}=C_{2}+\frac{1}{2}x.$$

于是所求非齐次方程的通解为

$$y = \frac{1}{3}x^{3} + C_{2}x^{2} + C_{1}.$$

如果只知齐次方程(5.65)的一个不恒为零的解 $y_{1}(x)$ ，那么，利用变换$y = u y_1(x)$ ，可把非齐次方程(5.67)化为一阶线性方程.

事实上，把

$$y = y_{1}u, \quad y^{\prime} = y_{1}u^{\prime} + y_{1}^{\prime}u, \quad y^{\prime\prime} = y_{1}u^{\prime\prime} + 2y_{1}^{\prime}u^{\prime} + y_{1}^{\prime\prime}u$$

代入方程(5.67)，得

$$y_{1}u^{\prime \prime}+2y_{1}^{\prime}u^{\prime}+y_{1}^{\prime \prime}u+P(y_{1}u^{\prime}+y_{1}^{\prime}u)+Qy_{1}u=f,$$

即

$$y_{1}u^{\prime \prime}+(2y_{1}^{\prime}+Py_{1})u^{\prime}+(y_{1}^{\prime \prime}+Py_{1}^{\prime}+Cy_{1})u=f.$$

由于 $y_{1}^{\prime \prime} + P y_{1}^{\prime} + Q y_{1} = 0$ ，故上式为

$$y_{1}u^{\prime\prime}+(2y_{1}^{\prime}+Py_{1})u^{\prime}=f.$$

令 $u ^ { \prime } = z$ ，上式即化为一阶线性方程

$$y_{1}z^{\prime}+(2y_{1}^{\prime}+Py_{1})z=f.\tag{5.73}$$

把方程(5.67)化为方程(5.73)以后，按一阶线性方程的解法，设求得方程(5.73)的通解为

$$z = C_{2}Z(x) + z^{*}(x)$$

积分，得

$$u = C _ { 1 } + C _ { 2 } U ( x ) + u ^ { * } ( x ) ,$$

其中 $U^{\prime}(x)=Z(x),u^{\prime\prime}(x)=z^{\prime}(x)$ .上式乘以 $y_{1}(x)$ ，便得方程(5.67)的通解

$$y = C _ { 1 } y _ { 1 } ( x ) + C _ { 2 } U ( x ) y _ { 1 } ( x ) + u ^ { * } ( x ) y _ { 1 } ( x ) .$$

[page:188]

## 第5章微分方程

上述方法显然也适用于求齐次方程(5.65)的通解

例5.26 已知 $y_{1}(x) = \mathrm{e}^{x}$ 是齐次方程 $y'' - 2y' + y = 0$ 的解，求非齐次方程$y'' - 2y' + y = \frac{1}{x}\mathrm{e}^{x}$ 的通解.

解令 $y = \mathrm{e}^{x} u$ ,则 $y^{\prime} = \mathrm{e}^{x}(u^{\prime} + u), y^{\prime} = \mathrm{e}^{x}(u^{\prime\prime} + 2u^{\prime} + u)$ ，代入非齐次方程，得

$$\mathrm{e}^{x}\left(u^{\prime \prime}+2 u^{\prime}+u\right)-2 \mathrm{e}^{x}\left(u^{\prime}+u\right)+\mathrm{e}^{x} u=\frac{1}{x} \mathrm{e}^{x},$$

即

$$\mathrm{e}^{x} u'' = \frac{1}{x} \mathrm{e}^{x}, \quad u'' = \frac{1}{x}.$$

这里不需再作变换去化为一阶线性方程，只要直接积分，便得

$$u ^ { \prime } = C + \ln | x | ,$$

再积分，得

$$u = C_{1} + C x + x \ln | x | - x,$$

即

$$u = C_{1} + C_{2}x + x\ln\left | x \right | , \quad C_{2} = C - 1.$$

于是所求通解为

$$y = C_{1} \mathrm{e}^{x} + C_{2} x \mathrm{e}^{x} + x \mathrm{e}^{x} \ln |x|.$$

## 习题5.6

1. 下列函数组在其定义区间内哪些是线性无关的？

(1) $x , x ^ { 2 }$ ; (2) $x , 2 x ;$

(3) $\mathrm{e}^{2x} , 3\mathrm{e}^{2x} ; \quad (4) \mathrm{e}^{-x} , \mathrm{e}^{x}$

(5) $\cos 2x,\sin 2x; \quad (6)\mathrm{e}^{x^{2}},x\mathrm{e}^{x^{2}}$

(7) $\sin 2x,\cos x\sin x;$ (8) $\mathrm{e}^{x} \cos 2x, \mathrm{e}^{x} \sin 2x;$

(9) $\ln x,x\ln x;$ (10) $\mathrm{e}^{ax}, \mathrm{e}^{bx} (a \neq b)$ ; (11) $\mathrm{e}^{x} , x \mathrm{e}^{x}$

2. 验证函数 $y = \mathrm{e}^{x}$ 与 $y = \mathrm{e}^{-x}$ 在 $( - \infty , + \infty )$ 上都是二阶线性齐次微分方程

$$y'' - y = 0$$

的解.求它的通解，并求方程

$$y^{\prime\prime} - y = - 1$$

的通解.

[page:189]

## 5.7 常系数齐次线性微分方程

3. 验证函数 $y = 1 , y = \sin x , y = \cos x$ 在 $( - \infty , + \infty )$ 上都是三阶线性齐次微分方程

$$y'' + y' = 0$$

的解.求它的通解，并求方程

$$y'' + y' = x$$

的通解.

4. 验证函数 $y = 1 , y = x , y = x ^ { 2 } , \cdots , y = x ^ { n - 1 }$ 在 $( - \infty, + \infty )$ 上都是n阶线性齐次微分方程

$$y^{(n)} = 0$$

的解.求它的通解，并求方程

$$y ^ { ( n ) } = 1$$

的通解.

5. 验证 $y_{1} = \cos \omega x$ 及 $y_{2} = \sin x$ 都是方程 $y^{\prime\prime} + \omega^{2}y = 0$ 的解，并写出该方程的通解.

6. 验证 $y_{1} = \mathrm{e}^{x^{2}}$ 及 $y_{2} = x \mathrm{e}^{x^{2}}$ 都是方程 $y^{\prime\prime} - 4xy^{\prime} + \left( 4x^{2} - 2 \right)y = 0$ 的解，并写出该方程的通解.

7. 验证:

(1) $y = C_{1} \mathrm{e}^{x} + C_{2} \mathrm{e}^{2x} + \frac{1}{12} \mathrm{e}^{5x} \left( C_{1} \sqrt{C_{2}} \right.$ 是任意常数)是方程 $y'' - 3y' + 2y = \mathrm{e}^{5x}$ 的通解；

(2) $y = C_{1}\cos 3x + C_{2}\sin 3x + \frac{1}{32}(4x\cos x + \sin x)(C_{1},C_{2}$ 是任意常数)是方程 $y^{\prime\prime} + 9y = x\cos x$

的通解；

(3) $y = C_{1}x^{2} + C_{2}x^{2}\ln x(C_{1},C_{2}$ 是任意常数)是方程 $x^{2}y^{\prime\prime}-3xy^{\prime}+4y=0$ 的通解；

(4) $y = C_{1}x^{5} + \frac{C_{2}}{x} - \frac{x^{2}}{9}\ln x (C_{1},C_{2}$ 是任意常数)是方程 $x^{2}y^{\prime\prime}-3xy-5y=x^{2}\ln x$ 的通解；

(5) $y = \frac{1}{x} \left( C_1 \mathrm{e}^x + C_2 \mathrm{e}^{-x} \right) + \frac{\mathrm{e}^x}{2} \left( C_1 \sqrt{C_2} \right)$ 是任意常数)是方程 $x y^{\prime \prime} + 2 y^{\prime} - x y = \mathrm{e}^{x}$ 的通解；

(6) $y = C_{1}\mathrm{e}^{x} + C_{2}\mathrm{e}^{-x} + C_{3}\cos x + C_{4}\sin x - x^{2}(C_{1} \times C_{2} \times C_{3} \times C_{4}$ 是任意常数)是方程 $y^{(4)} - y =$ $x ^ { 2 }$ 的通解.

8. 已知 $y_{1}(x) = \mathrm{e}^{x}$ 是齐次线性方程

$$(2x - 1)y^{\prime\prime} - (2x + 1)y^{\prime} + 2y = 0$$

的一个解，求此方程的通解.

9. 已知 $y_{1}(x) = x$ 是齐次线性方程 $x^{2}y^{\prime }-2xy^{\prime }+2y=0$ 的一个解，求非齐次线性方程 $x^{2}y^{\prime\prime} =$ $2xy^{\prime} + 2y = 2x^{3}$ 的通解.

10. 已知齐次线性方程 $y'' + y = 0$ 的通解为 $Y(x) = C_{1}\cos x + C_{2}\sin x$ ，求非齐次线性方程$y^{\prime\prime} + y = \sec x$ 的通解.

11. 已知齐次线性方程 $x^{2}y^{\prime\prime}-xy^{\prime}+y=0$ 的通解为 $Y(x) = C_{1}x + C_{2}x \cdot \ln|x|$ ，求非齐次线性方程 $x^{2}y^{\prime\prime}-xy^{\prime}+y=x$ 的通解.

## 5.7 常系数齐次线性微分方程

先讨论二阶常系数齐次线性微分方程的解法，再把二阶方程的解法推广到n

[page:190]

## 第5章 微分方程

阶方程.

在二阶齐次线性微分方程

$$y ^ { \prime \prime } + P ( x ) y ^ { \prime } + Q ( x ) y = 0\tag{5.74}$$

中，如果 $y ^ { \prime } \cdot y$ 的系数 $P(x),Q(x)$ 均为常数，即式(5.74)成为

$$y'' + p y' + q y = 0\tag{5.75}$$

其中 $p , q$ 是常数，则称方程(5.75)为二阶常系数齐次线性微分方程.如果 $\mathcal { P } : 9$ 不全为常数，称方程(5.74)为二阶变系数齐次线性微分方程

由上节讨论可知，要找微分方程(5.75)的通解，可以先求出它的两个解 $y_{1}$ $y_{2}$ ，如果 $\frac{y_{1}}{y_{2}}$ 不恒为常数，即 $\mathcal{Y}_{1}$ 与 $y_{2}$ 线性无关，那么 $y = C_{1}y_{1} + C_{2}y_{2}$ 就是方程(5.75)的通解.

当r为常数时，指数函数 $y = \mathrm{e}^{nx}$ 和它的各阶导数都只相差一个常数因子.由于指数函数有这个特点，因此用 $y = \mathrm{e}^{rx}$ 来尝试，看能否选取适当的常数r，使 $y = \mathrm{e}^{cx}$ 满足方程(5.75).

将 $y = \mathrm{e}^{rx}$ 求导，得

$$y^{\prime} = r \mathrm{e}^{rx}, y^{\prime\prime} = r^{2} \mathrm{e}^{rx}$$

把 $y : y ^ { \prime }$ 和 $y ^ { \prime \prime }$ 代入方程(5.75)，得

$$( r ^ { 2 } + p r + q ) \mathrm { e } ^ { r x } = 0 .$$

由于 $\mathrm{e}^{rx} \neq 0$ ，所以

$$r^{2} + pr + q = 0.\tag{5.76}$$

由此可见，只要r满足代数方程(5.76)，函数 $y = \mathrm{e}^{rx}$ 就是微分方程(5.75)的解，我们把代数方程(5.76)叫做微分方程(5.75)的特征方程

特征方程(5.76)是一个二次代数方程，其中 $r ^ { 2 } , r$ 的系数及常数项恰好依次是微分方程(5.75)中 $y ^ { \prime \prime } , y ^ { \prime }$ 及 $\mathcal { Y }$ 的系数.

特征方程(5.76)的两个根 $r _ { 1 } , r _ { 2 }$ 可以用公式

$$r_{1,2} = \frac{- p \pm \sqrt{p^{2} - 4q}}{2}$$

求出.它们有三种不同的情形.

(1) 当 $p^{2}-4q>0$ 时， $r_{1}, r_{2}$ 是两个不相等的实根，即

$$r_{1}=\frac{-p+\sqrt{p^{2}-4q}}{2}, \quad r_{2}=\frac{-p-\sqrt{p^{2}-4q}}{2};$$

(2) 当 $p^{2}-4q=0$ 时， $r _ { 1 } , r _ { 2 }$ 是两个相等的实根，即

$$r_{1} = r_{2} = - \frac{p}{2};$$

(3) 当 $p^{2}-4q<0$ 时， $\mathcal { r } _ { 1 } , \mathcal { r } _ { 2 }$ 是一对共轭复根，即

[page:191]

## 5.7 常系数齐次线性微分方程

$$r_{1} = \alpha + \mathrm{i} \beta, \quad r_{2} = \alpha - \mathrm{i} \beta,$$

其中

$$\alpha = - \frac{p}{2}, \quad \beta = \frac{\sqrt{4q - p^{2}}}{2}.$$

相应地，微分方程(5.75)的通解也有三种不同的情形，分别讨论如下

（1）特征方程有两个不相等的实根，即 $r_{1} \neq r_{2}$

由上面的讨论知道 $y_{1} = \mathrm{e}^{r_{1}x}, y_{2} = \mathrm{e}^{r_{2}x}$ 是微分方程(5.75)的两个解，并且$\frac{y_{2}}{y_{1}}=\frac{\mathrm{e}^{r_{2}x}}{\mathrm{e}^{r_{1}x}}=\mathrm{e}^{(r_{2}-r_{1})x}$ 不是常数，因此微分方程(5.75)的通解为

$$y = C_{1} \mathrm{e}^{r_{1}x} + C_{2} \mathrm{e}^{r_{2}x}.$$

（2）特征方程有两个相等的实根，即 $r_{1} = r_{2}$

这时，只得到微分方程(5.75)的一个解

$$y_{1} \equiv \mathrm{e}^{r_{1}x}.$$

为了得出微分方程(5.75)的通解，还需求出另一个解 $\mathcal{Y}_{2}$ ，并且要求 $\frac{y_{2}}{y_{1}}$ 不是常数.

设 $\frac{y_{2}}{y_{1}} = u(x)$ ,即 $y_{2} = \mathrm{e}^{r_{1}x}u(x)$ .下面来求 $u(x)$

对 $\mathcal { Y } _ { 2 }$ 求导，得

$$y _ { 2 } ^ { \prime } = \mathrm { e } ^ { r _ { 1 } x } \left( u ^ { \prime } + r _ { 1 } u \right) , \quad y _ { 2 } ^ { \prime } = \mathrm { e } ^ { r _ { 1 } x } \left( u ^ { \prime \prime } + 2 r _ { 1 } u ^ { \prime } + r _ { 1 } ^ { 2 } u \right) ,$$

将 $y_{2} \cdot y_{2}^{'}$ 和 $y_{2}^{\prime\prime}$ 代入微分方程(5.75)，得

$$\mathrm{e}^{r_{1}x}\left[\left(u^{\prime\prime}+2r_{1}u^{\prime}+r_{1}^{2}u\right)+p\left(u^{\prime}+r_{1}u\right)+qu\right]=0,$$

约去 $\mathrm{e}^{r_{1}x}$ ，并以 $u ^ { \prime \prime } , u ^ { \prime } , u$ 为准合并同类项，得

$$u ^ { \prime \prime } + ( 2 r _ { 1 } + p ) u ^ { \prime } + ( r _ { 1 } ^ { 2 } + p r _ { 1 } + q ) u = 0 .$$

由于 $r _ { 1 }$ 是特征方程(5.76)的二重根，因此 $r_{1}^{2}+pr_{1}+q=0$ ，且 $2r_{1} + p = 0$ ，于是得

$$u ^ { \prime \prime } = 0 .$$

因为只要得到一个不为常数的解，所以不妨选取 $u = x$ ，由此得到微分方程(5.75)的另一个解

$$y_{2} = x \mathrm{e}^{r_{1}x}.$$

从而微分方程(5.75)的通解为

即

$$y = C_{1} \mathrm{e}^{r_{1}x} + C_{2} x \mathrm{e}^{r_{1}x},$$

[page:192]

## 第5章微分方程

$$y = \left( C_{1} + C_{2} x \right) \mathrm{e}^{r_{1} x}.$$

(3)特征方程有一对共轭复根，即 $r_{1}=\alpha+\mathrm{i}\beta, r_{2}=\alpha-\mathrm{i}\beta(\beta\neq0)$

这时， $y_{1} = \mathrm{e}^{(\alpha + \mathrm{i}\beta)x}, y_{2} = \mathrm{e}^{(\alpha - \mathrm{i}\beta)x}$ 是微分方程(5.75)的两个解，但它们是复值函数.为了得出实值函数形式，先利用欧拉公式 $\mathrm{e}^{\mathrm{i} \theta} = \cos \theta + \mathrm{i} \sin \theta$ 把 $\mathcal { Y } _ { 1 } , \mathcal { Y } _ { 2 }$ 改写为

$$y_{1} = \mathrm{e}^{(a + \mathrm{i}\beta)x} = \mathrm{e}^{ax} \cdot \mathrm{e}^{\mathrm{i}\beta x} = \mathrm{e}^{ax}(\cos\beta x + \mathrm{i}\sin\beta x)$$

$$y_{2}=\mathrm{e}^{(a-\mathrm{i}\beta)x}=\mathrm{e}^{ax}\cdot\mathrm{e}^{-\mathrm{i}\beta x}=\mathrm{e}^{ax}(\cos\beta x-\mathrm{i}\sin\beta x).$$

由于复值函数 $y_{1}$ 与 $\mathcal{Y}_{2}$ 之间成共轭关系，因此，取它们的和除以2就得到它们的实部;取它们的差除以2i就得到它们的虚部.由于方程(5.75)的解符合迭加原理，所以实值函数

$$\overline { y _ { 1 } } = \frac { 1 } { 2 } \left( y _ { 1 } + y _ { 2 } \right) = \mathrm { e } ^ { a x } \cos \beta x ,$$

$$\frac { y _ { 2 } } { y _ { 2 } } = \frac { 1 } { 2 \mathrm { i } } \left( y _ { 1 } - y _ { 2 } \right) = \mathrm { e } ^ { a x } \sin \beta x ,$$

还是微分方程(5.75)的解，且 $\frac{\overline{y_{1}}}{\overline{y_{2}}}=\frac{\mathrm{e}^{ax}\cos\beta x}{\mathrm{e}^{ax}\sin\beta x}=\cot\beta x$ 不是常数，所以微分方程(5.75)的通解为

$$y = \mathrm{e}^{ax} \left( C_{1} \cos \beta x + C_{2} \sin \beta x \right).$$

综上所述，求二阶常系数齐次线性微分方程

$$y'' + p y' + q y = 0$$

的通解的步骤如下:

第一步 写出微分方程(5.75)的特征方程

$$r^{2} + pr + q = 0.$$

第二步 求出特征方程(5.76)的两个根 $r _ { 1 } , r _ { 2 }$

第三步 根据特征方程(5.76)的两个根的不同情形，按照下列表格写出微分方程(5.75)的通解.

<table><tr><td>的两个根 特征方程 <eq>r^{2}+pr+q=0</eq> <eq>r _ { 1 } + r _ { 2 }</eq></td><td>的通解 微分方程 <eq>y^{\prime \prime} + p y^{\prime} + q y = 0</eq></td></tr><tr><td>两个不相等的实根 <eq>r _ { 1 } , r _ { 2 }</eq></td><td><eq>y = C_{1} \mathrm{e}^{r_{1}x} + C_{2} \mathrm{e}^{r_{2}x}</eq></td></tr><tr><td>两个相等的实根 <eq>r _ { 1 } { = } r _ { 2 }</eq></td><td><eq>y = \left( C_{1} + C_{2}x \right) \mathrm{e}^{r_{1}x}</eq></td></tr><tr><td>一对共轭复根 <eq>r_{1,2} = \alpha \pm \mathrm{i}\beta</eq></td><td><eq>y = \mathrm{e}^{ax} \left( C_{1} \cos \beta x + C_{2} \sin \beta x \right)</eq></td></tr></table>

[page:193]

## 5.7 常系数齐次线性微分方程

例5.27 求微分方程 $y^{\prime\prime} + 2y^{\prime} - 3y = 0$ 的通解.

解 所给微分方程的特征方程为

$$r^{2} + 2r - 3 = 0$$

其根 $r_{1}=1, r_{2}=-3$ 是两个不相等的实根，因此所求通解为

$$y = C_{1} \mathrm{e}^{x} + C_{2} \mathrm{e}^{-3x}.$$

例5.28 求方程 $\frac{\mathrm{d}^{2} s}{\mathrm{d} t^{2}} + 2 \frac{\mathrm{d} s}{\mathrm{d} t} + s = 0$ 满足初始条件 $s \mid_{t = 0} = 4, \left. s^{\prime} \right|_{t = 0} = - 2$ 的特解.

解 所给方程的特征方程为

$$r^{2} + 2r + 1 = 0.$$

其根 $r_{1}=r_{2}=-1$ 为两个相等的实根，因此所求微分方程的通解为

$$s = \left( C _ { 1 } + C _ { 2 } t \right) \mathrm{e} ^ { - t } .$$

将条件 $s \mid_{t = 0} = 4$ 代入通解，得 $C_{1} = 4$ ,从而

$$s = (4 + C_2 t) \mathrm{e}^{-t}.$$

将上式对t求导，得

$$s^{\prime} = \left( C_{2} - 4 - C_{2} t \right) \mathrm{e}^{- t}.$$

再把条件 $s^{'} \mid_{t = 0} = - 2$ 代入上式，得 $C_{2} = 2,$ 于是所求特解为

$$s = (4 + 2t)\mathrm{e}^{-t}.$$

例5.29 求微分方程 $y^{\prime\prime} + y^{\prime} + y = 0$ 的通解.

解 所给方程的特征方程为

$$r^{2}+r+1=0.$$

其根 $r_{1,2} = \frac{1}{2} \left( -1 \pm \sqrt{3} i  \right)$ 为一对共轭复根.因此所求通解为

$$y = \mathrm{e}^{-\frac{1}{2}x} \left( C_1 \cos \frac{\sqrt{3}}{2} x + C_2 \sin \frac{\sqrt{3}}{2} x \right).$$

例5.30在5.6节例5.23中，设物体只受弹性恢复力f的作用，且在初始$t = 0$ 时的位置为 $x = x_{0}$ ，初始速度为 $\left. \frac{\mathrm{d}x}{\mathrm{d}t} \right|_{t = 0} = v_{0}$ .求反映物体运动规律的函数$x = x(t)$

解由于不计阻力R，即假设 $-\mu \frac{\mathrm{d}x}{\mathrm{d}t} = 0$ ，所以5.6节中的方程(5.60)化为

$$\frac{\mathrm{d}^{2} x}{\mathrm{d} t^{2}} + k^{2} x = 0 ,\tag{5.77}$$

方程(5.77)叫做无阻尼自由振动的微分方程

反映物体运动规律的函数 $x = x(t)$ 是满足微分方程(5.77)及初始条件

$$x \mid_{t = 0} = x_{0}, \quad \left. \frac{\mathrm{d}x}{\mathrm{d}t} \right|_{t = 0} = v_{0}$$

的特解.

[page:194]

## 第5章 微分方程

方程(5.77)的特征方程为 $r^{2} + k^{2} = 0$ ,其根 $r = \pm i k$ 是一对共轭复根，所以方程(5.77)的通解为

$$x = C_{1} \cos kt + C_{2} \sin kt.$$

应用初始条件，定出 $C_{1}=x_{0},C_{2}=\frac{v_{0}}{k}$ .因此，所求的特解为

$$x = x_{0} \cos kt + \frac{v_{0}}{k} \sin kt.\tag{5.78}$$

为了便于说明特解所反映的振动现象，令

$$x_{0}=A\sin\varphi,\quad\frac{v_{0}}{k}=A\cos\varphi,\quad0\leqslant\varphi<2\pi$$

于是(5.78)式化为

$$x = A \sin(kt + \varphi),\tag{5.79}$$

其中

$$A = \sqrt{x_{0}^{2} + \frac{v_{0}^{2}}{k^{2}}}, \quad \tan \varphi = \frac{kx_{0}}{v_{0}}.$$

函数(5.79)的图形如图5.14所示(图中假定 $x_{0} > 0, v_{0} > 0$

函数(5.79)所反映的运动就是简谐振动.这个振动的振幅为A，初相为 $\varphi _ { 1 }$ 周期为 $T = \frac{2\pi}{k}$ ,角频率为k.由于 $k = \sqrt { \frac { c } { m } } .$ ，它与初始条件无关，而完全由振动系统(在本例中就是弹簧和物体所组成的系统)本身所确定.因此，k又叫做系统的固有频率.固有频率是反映振动系统特性的一个重要参数.

例5.31在上一节例5.23中，设物体受弹簧的恢复力f和阻力R的作用，且在初始 $t = 0$ 时的位置 $x = x_{0}$ ，初始速度 $\left. \frac{\mathrm{d}x}{\mathrm{d}t} \right|_{t = 0} = v_{0}$ .求反映物体运动规律的函数$x = x(t)$

解 这就是要找满足有阻尼的自由振动方程

$$\frac{\mathrm{d}^{2} x}{\mathrm{d} t^{2}} + 2 n \frac{\mathrm{d} x}{\mathrm{d} t} + k^{2} x = 0\tag{5.80}$$

及初始条件

$$x \mid_{t=0} = x_0, \quad \left. \frac{\mathrm{d}x}{\mathrm{d}t} \right|_{t=0} = v_0$$

[page:195]

## 5.7常系数齐次线性微分方程

的特解.

方程(5.80)的特征方程为 $r^{2}+2nr+k^{2}=0$ ,其根为

$$r = \frac{- 2n \pm \sqrt{4n^{2} - 4k^{2}}}{2} = - n \pm \sqrt{n^{2} - k^{2}}.$$

以下按 $n < k, n > k$ 及 $\dot { { { { { n } } } } } = = { { { { k } } } }$ 三种不同情形分别进行讨论.

（1)小阻尼情形，即 $n \leq k ,$

特征方程的根 $r = - n \pm \mathrm{i} \omega, \left( \omega = \sqrt{k^{2} - n^{2}} \right)$ 是一对共轭复根，所以方程(5.80)的通解为

$$x = \mathrm{e}^{-nt} \left( C_1 \cos \omega t + C_2 \sin \omega t \right).$$

应用初始条件，定出 $C_{1}=x_{0},C_{2}=\frac{v_{0}+nx_{0}}{\omega}$ ，因此所求特解为

$$x = \mathrm{e}^{-nt} \left( x_{0} \cos \omega t + \frac{v_{0} + nx_{0}}{\omega} \sin \omega t \right).\tag{5.81}$$

令

$$x_{0}=A\sin\varphi,\quad\frac{v_{0}+nx_{0}}{\omega}=A\cos\varphi,\quad0\leqslant\varphi<2\pi,\tag{5.82}$$

那么式(5.81)又可写成

$$x = A \mathrm{e}^{-nt} \sin(\omega t + \varphi),\tag{5.83}$$

其中

$$\omega = \sqrt{k^{2} - n^{2}}; \quad A = \sqrt{x_{0}^{2} + \frac{\left( v_{0} + nx_{0} \right)^{2}}{\omega^{2}}}, \quad \tan\varphi = \frac{x_{0}\omega}{v_{0} + nx_{0}}.$$

从式(5.83)看出，物体的运动是周期 $T = \frac{2\pi}{\omega}$ 的振动.但与简谐振动不同，它的振幅 $A \mathrm{e}^{-\overline{n} t}$ 随时间t的增大而逐渐减小.因此，物体随时间t的增大而趋于平衡位置

函数(5.83)的图形如图5.15所示(图中假定 $x_{0} = 0, v_{0} > 0$

(2)大阻尼情形，即 $n > k$

特征方程的根 $r_{1}=-n+\sqrt{n^{2}-k^{2}}$ $r_{2}=-n-\sqrt{n^{2}-k^{2}}$ 是两个不相等的负实根，所以方程(5.80)的通解为

$$x = C _ { 1 } \mathrm { e } ^ { - \left( n - \sqrt { n ^ { 2 } - k ^ { 2 } } \right) t } + C _ { 2 } \mathrm { e } ^ { - \left( n + \sqrt { n ^ { 2 } - k ^ { 2 } } \right) t } ,$$

(5.84)

其中任意常数 $C_{1},C_{2}$ 可以由初始条件来确定.

从式(5.84)看出，使 $x = 0$ 的t值最多只有一个，即物体最多越过平衡位置一次，因此物体已不再有振动现象.又当 $t \rightarrow + \infty$ 时， $x \rightarrow 0 .$ 因此，物体随时间t的增

[page:196]

## 第5章微分方程

大而趋于平衡位置.

函数(5.84)的图形如图5.16所示（图中假定$x_{0} > 0, v_{0} > 0$

（3）临界阻尼情形，即 $n { = } k$

特征方程的根 $r_{1} = r_{2} = \cdots n$ 是两个相等的实根，所以方程(5.80)的通解为

$$x = \mathrm{e}^{-nt} \left( C_1 + C_2 t \right),$$

其中任意常数 $C _ { 1 }$ 和 $C _ { 2 }$ 可由初始条件来确定.由上式可看出，在临界阻尼情形使$x = 0$ 的t值也最多只有一个，因此物体也不再有振动现象.又由于

$$\lim_{t \to +\infty} t \mathrm{e}^{-nt} = \lim_{t \to +\infty} \frac{t}{\mathrm{e}^{nt}} = 0,$$

从而可以看出，当 $t \rightarrow + \infty$ 时， $x \rightarrow 0$ 因此，在临界阻尼情形，物体也随时间t的增大而趋于平衡位置.

上面讨论二阶常系数齐次线性微分方程所用的方法以及方程的通解的形式，可推广到n阶常系数齐次线性微分方程上去，对此不再详细讨论，只简单地叙述如下:

n阶常系数齐次线性微分方程的一般形式是

$$y ^ { ( n ) } + p _ { 1 } y ^ { ( n - 1 ) } + p _ { 2 } y ^ { ( n - 2 ) } + \cdots + p _ { n - 1 } y ^ { \prime } + p _ { n } y = 0 ,\tag{5.85}$$

其中 $p_{1},p_{2},\cdots,p_{n-1},p_{n}$ 都是常数.

有时用记号D(微分算符)表示对x求导的运算 $\frac{\mathrm{d}}{\mathrm{d}x}$ ，把 $\frac{\mathrm{d}y}{\mathrm{d}x}$ 记作 $D y$ ，把 $\frac{\mathrm{d}^n y}{\mathrm{d}x^n}$ 记作$D^{n}y$ ，并把方程(5.85)记作

$$\left( D ^ { n } + p _ { 1 } D ^ { n - 1 } + \cdots + p _ { n - 1 } D + p _ { n } \right) y = 0 .\tag{5.86}$$

记

$$L(D) = D^n + p_1D^{n-1} + \cdots + p_{n-1}D + p_n,$$

L(D)叫做微分算符D的n次多项式.于是方程(5.86)可记作

$$L(D)y = 0.$$

如同讨论二阶常系数齐次线性微分方程那样，令 $y = \mathrm{e}^{nx}$ .由于 $D\mathrm{e}^{rx} = r\mathrm{e}^{rx},\cdots$ $D^{n}\mathrm{e}^{rx} = r^{n}\mathrm{e}^{rx}$ ,故 $L(D)\mathrm{e}^{rx} = L(r)\mathrm{e}^{rx}$ .因此把 $y = \mathrm{e}^{cx}$ 代入方程(5.86)，得

$$L(r)\mathrm{e}^{rx} = 0.$$

由此可见，如果选取r为n次代数方程

$$L(r)=0 \left( 即   r^{n}+p_{1}r^{n-1}+p_{2}r^{n-2}+\cdots+p_{n-1}r+p_{n}=0\right)\tag{5.87}$$

的根，那么函数 $y = \mathrm{e}^{rx}$ 就是方程(5.86)的一个解.

方程(5.87)叫做方程(5.86)的特征方程.

根据特征方程的根，可以写出其对应的微分方程的解如下:

[page:197]

5.7常系数齐次线性微分方程<table><tr><td>特征方程的根</td><td>微分方程通解中的对应项</td></tr><tr><td>单实根r</td><td>给出一项 <eq>\mathrm{Ce}^{rx}</eq></td></tr><tr><td>一对单复根 <eq>r_{1,2} = \alpha \pm \mathrm{i}\beta</eq></td><td>给出两项 <eq>\mathrm{e}^{ax}\left(C_{1}\cos\beta x+C_{2}\sin\beta x\right)</eq></td></tr><tr><td>k重实根r</td><td>给出k项 <eq>\mathrm{e}^{rx}\left(C_{1}+C_{2}x+\cdots+C_{k}x^{k-1}\right)</eq></td></tr><tr><td>一对k重复根 <eq>r_{1,2} = \alpha \pm \mathrm{i}\beta</eq></td><td>给出2k项 <eq>\mathrm{e}^{ax}\left[\left(C_{1}+C_{2}x+\cdots+C_{k}x^{k-1}\right)\cos\beta x+\left(D_{1}+D_{2}x+\cdots+D_{k}x^{k-1}\right)\sin\beta x\right]</eq></td></tr></table>

由代数学知道，n次代数方程有n个根(重根按重数计算).而特征方程的每一个根都对应着通解中的一项，且每项各含一个任意常数.这样就得到n阶常系数齐次线性微分方程的通解

$$y = C_{1}y_{1} + C_{2}y_{2} + \cdots + C_{n}y_{n}.$$

例5.32 求方程 $y^{(4)}-6y^{\prime\prime}+22y^{\prime\prime}-30y^{\prime}+13y=0$ 的通解.

解 所给方程的特征方程为

$$r^{4}-6r^{3}+22r^{2}-30r+13=0,$$

即

$$(r - 1)^{2}(r^{2} - 4r + 13) = 0.$$

它的根为 $r_{1} = r_{2} = 1$ 和 $r_{3,4} = 2 \pm 3\mathrm{i}$

因此所给微分方程的通解为

$$y = \mathrm{e}^{x} \left( C_{1} + C_{2} x \right) + \mathrm{e}^{2x} \left( C_{3} \cos 3x + C_{4} \sin 3x \right).$$

例5.33求方程 $\frac{\mathrm{d}^{4} \boldsymbol{\omega}}{\mathrm{d} x^{4}} + \beta^{4} \boldsymbol{\omega} = 0$ 的通解，其中 $\beta > 0$

解 所给方程的特征方程为

$$r^{4} + \beta^{4} = 0.$$

由于

$$\begin{aligned} &r^{4} + \beta^{4} = r^{4} + 2r^{2}\beta^{2} + \beta^{4} - 2r^{2}\beta^{2} = (r^{2} + \beta^{2})^{2} - 2r^{2}\beta^{2}\\ &= (r^{2} - \sqrt{2}\beta r + \beta^{2})(r^{2} + \sqrt{2}\beta r + \beta^{2}),\\ \end{aligned}$$

所以特征方程可以写为

$$\left( r ^ { 2 } - \sqrt { 2 } \beta r + \beta ^ { 2 } \right) \left( r ^ { 2 } + \sqrt { 2 } \beta r + \beta ^ { 2 } \right) = 0 ,$$

它的根为 $r_{1,2} = \frac{\beta}{\sqrt{2}} \left( 1 \pm \mathrm{i} \right), r_{3,4} = - \frac{\beta}{\sqrt{2}} \left( 1 \pm \mathrm{i} \right)$ .因此所给方程的通解为

$$w = \mathrm{e}^{\frac{\beta}{\sqrt{2}}x}\left[C_{1}\cos\frac{\beta}{\sqrt{2}}x + C_{2}\sin\frac{\beta}{\sqrt{2}}x\right]+\mathrm{e}^{-\frac{\beta}{\sqrt{2}}x}\left[C_{3}\cos\frac{\beta}{\sqrt{2}}x + C_{4}\sin\frac{\beta}{\sqrt{2}}x\right].$$

[page:198]

## 习题5.7

1. 求下列微分方程的通解:

(1) $y^{\prime\prime} + y^{\prime} - 2y = 0; \quad (2) y^{\prime\prime} - 4y^{\prime} = 0;$

(3) $y'' + y = 0;$ (4) $y^{\prime\prime} + 6y^{\prime} + 13y = 0$

(5) $4\frac{\mathrm{d}^{2}x}{\mathrm{d}t^{2}}-20\frac{\mathrm{d}x}{\mathrm{d}t}+25x=0;$ (6) $y^{\prime\prime} - 4y^{\prime} + 5y = 0;$

(7) $y^{(4)}-y=0; \quad (8) y^{(4)}+2y^{\prime}+y=0;$

(9) $y^{(4)}-2y^{\prime\prime}+y^{\prime\prime}=0; \quad (10) y^{(4)}+5y^{\prime}-36y=0;$

(11) $y^{\prime}+3y^{\prime}+2y=0; \quad (12) 2y^{\prime}+5y^{\prime}+2y=0;$

(13) $y^{\prime\prime}-3y^{\prime}=0; \quad (14) y^{\prime\prime}-6y^{\prime}+9y=0;$

(15) $y^{\prime\prime}+9y=0;\quad (16)\ y^{\prime\prime}+y^{\prime}+y=0;$

(17) $u^{\prime\prime}+B^{2}u=0(B>0); \quad (18) y^{\prime\prime}+2\delta y^{\prime}+\omega_{0}^{2}y=0(\omega_{0}>\delta>0);$

(19) $y^{\prime\prime}-y=0; \quad (20) y^{\prime\prime}-2y^{\prime}+y=0;$

(21) $y'' + 3y' + 3y' + y = 0.$

2. 求下列微分方程满足所给初始条件的特解:

(1) $y^{\prime}-4y^{\prime}+3y=0,y|_{x=0}=6,y^{\prime}|_{x=0}=10;$

(2) $4y^{\prime\prime}+4y^{\prime}+y=0,y|_{x=0}=2,y^{\prime}|_{x=0}=0;$

(3) $y^{\prime}-3y^{\prime}-4y=0,y|_{x=0}=0,y^{\prime}|_{x=0}=-5;$

(4) $y^{\prime}+4y^{\prime}+29y=0,y|_{x=0}=0,y^{\prime}|_{x=0}=15;$

(5) $y^{\prime \prime}+25y=0,y|_{x=0}=2,y^{\prime}|_{x=0}=5;$

(6) $y^{\prime}-4y^{\prime}+13y=0,y|_{x=0}=0,y^{\prime}|_{x=0}=3;$

(7) $y^{\prime}+4y^{\prime}+4y=0,y|_{x=0}=1,y^{\prime}|_{x=0}=1;$

(8) $4y^{\prime\prime}+9y=0,y|_{x=0}=2,y^{\prime}|_{x=0}=-1.$

3.一个单位质量的质点在数轴上运动，开始时质点在原点O处且速度为 $\mathcal { W } _ { 0 }$ ，在运动过程

中，它受到一个力的作用，这个力的大小与质点到原点的距离成正比(比例系数 $k_{1} > 0$ 而方向与初速一致，且介质的阻力与速度成正比(比例系数 $k _ { 2 } > 0$ .求反映这质点的运动规律的函数

4. 在图5.17所示的电路中先将开关K拨向A，达到稳定状态后再将开关K拨向B，求电压 $u _ { C } ( t )$ 及电流 i(t). 已知$E=20V,C=0.5 \times 10^{-6}  F (法),L=0.1  H (亨),R=2000\Omega.$

5.设圆柱形浮筒，直径为0.5m，铅直放在水中，当稍向下

压后突然放开，浮筒在水中上下振动的周期为 $2 s .$ 求浮筒的质量

6. 设 $y_{1}(x),y_{2}(x)$ 是二阶齐次线性方程 $y ^ { \prime \prime } + p ( x ) y ^ { \prime } + q ( x ) y = 0$ 的两个解，令

$$W(x) = \left| \begin{matrix} y_{1}(x) & y_{2}(x) \\ y_{1}^{\prime}(x) & y_{2}^{\prime}(x) \end{matrix} \right| = y_{1}(x)y_{2}^{\prime}(x) - y_{1}^{\prime}(x)y_{2}(x),$$

证明:(1) $W(x)$ 满足方程 $W' + p(x)W = 0$

(2) $W(x) = W(x_0) \mathrm{e}^{-\int_{x_0}^{x} p(t) \mathrm{d}t}.$

[page:199]

## 5.8 常系数非齐次线性微分方程

## 5.8 常系数非齐次线性微分方程

本节着重讨论二阶常系数非齐次线性微分方程的解法，并对n阶方程的解法作必要的说明.

二阶常系数非齐次线性微分方程的一般形式是

$$y ^ { \prime \prime } + p y ^ { \prime } + q y = f ( x ) ,\tag{5.88}$$

其中 $p , q$ 是常数.

求二阶常系数非齐次线性微分方程的通解，归结为求对应的齐次方程

$$y'' + p y' + q y = 0\tag{5.89}$$

的通解和非齐次方程(5.88)本身的一个特解.由于二阶常系数齐次线性微分方程的通解的求法已得到解决，所以这里只需讨论求二阶常系数非齐次线性微分方程的一个特解 $y ^ { * }$ 的方法.

本节只介绍当方程(5.88)中的 $f ( x )$ 取两种常见形式时求 $y ^ { * }$ 的方法.这种方法的特点是不用积分就可求出 $y ^ { \prime }$ 来，叫做待定系数法. $f ( x )$ 的两种形式是

(1) $f(x) = P_m(x)\mathrm{e}^{\lambda x}$ ，其中λ是常数， $P_{m}(x)$ 是x的一个m次多项式，写为

$$P_{m}(x)=a_{0}x^{m}+a_{1}x^{m - 1}+\cdots+a_{m - 1}x+a_{m};$$

(2) $f(x) = \mathrm{e}^{\lambda x} \left[ P_{L}(x) \cos \omega x + P_{n}(x) \sin \omega x \right]$ ,其中 $\lambda , \omega$ 是常数， $P_{l}(x),P_{n}(x)$分别是x的l次、n次多项式，其中有一个可为零.

下面分别介绍 $f ( x )$ 为上述两种形式时 $y^{*}$ 的求法.

## 5.8.1 $f(x) = \mathrm{e}^{\lambda x} P_m(x)$

方程(5.88)的特解 $y ^ { * }$ 是使其成为恒等式的函数.怎样的函数能使式(5.88)成为恒等式呢?因为式(5.88)右端 $f ( x )$ 是多项式 $P_{m}(x)$ 与指数函数 $\mathrm{e}^{\lambda x}$ 的乘积，而多项式与指数函数乘积的导数仍然是多项式与指数函数的乘积，因此，我们推测$y^{*} = Q(x)\mathrm{e}^{\lambda x}(Q(x)$ 是某个多项式)可能是方程(5.88)的特解.把 $y ^ { * } : y ^ { * }$ 及 $y^{\ast \prime \prime}$ 代入方程(5.88)，然后考虑能否选取适当的多项式 $Q(x)$ ，使 $y^{*} = Q(x)\mathrm{e}^{\lambda x}$ 满足方程(5.88).因此，将

$$\begin{align*}y^{*} &= Q(x)\mathrm{e}^{\lambda x} \\y^{*} &= \mathrm{e}^{\lambda x}\left[\lambda Q(x) + Q^{\prime}(x)\right], \\y^{*\prime} &= \mathrm{e}^{\lambda x}\left[\lambda^{2}Q(x) + 2\lambda Q^{\prime}(x) + Q^{\prime}(x)\right]\end{align*}$$

[page:200]

## 第5章微分方程

代入方程(5.88)并消去 $\mathrm{e}^{\lambda x}$ ,得

$$Q ^ { \prime } ( x ) + ( 2 \lambda + p ) Q ^ { \prime } ( x ) + ( \lambda ^ { 2 } + p \lambda + q ) Q ( x ) = P _ { m } ( x ) .\tag{5.90}$$

(1) 如果 $\lambda$ 不是式(5.89)的特征方程 $r^{2}+pr+q=0$ 的根，即 $\lambda^{2}+p\lambda+q\neq 0$由于 $P_{m}(x)$ 是一个m次多项式，要使式(5.90)的两端恒等，可令 $Q ( x )$ 为另一个 $j \gamma l$次多项式

$$Q_{m}(x)=b_{0}x^{m}+b_{1}x^{m - 1}+\cdots+b_{m - 1}x+b_{m},$$

代入式(5.90)，比较等式两端x同次幂的系数，可得到以 $b_{0},b_{1},\cdots,b_{m}$ 作为未知数的m+1个方程的联立方程组.从而可以定出这些 $b_{i}(i = 0,1,\cdots,m)$ ，并得到所求的特解

$$y ^ { * } = Q _ { m } ( x ) \mathrm { e } ^ { \lambda x } .$$

（2）如果λ是特征方程 $r^{2}+pr+q=0$ 的单根，即 $\lambda^{2}+p\lambda+q=0$ ,但 $2 \lambda + p \neq 0$要使式(5.90)的两端恒等，那么 $Q ^ { \prime } ( x )$ 必须是m次多项式.此时可令

$$Q(x) = xQ_m(x),$$

并且可用同样的方法来确定 $Q_{m}(x)$ 的系数 $b_{i}(i = 0,1,2,\cdots,m)$

（3）如果λ是特征方程 $r^{2}+pr+q=0$ 的重根，即 $\lambda^{2} + p\lambda + q = 0$ ，且 $2\lambda + p = 0$要使式(5.90)的两端恒等，那么 $Q ^ { \prime } ( x )$ 必须是m次多项式.此时可令

$$Q(x) = x^{2}Q_{m}(x),$$

并用同样的方法来确定 $Q_{m}(x)$ 中的系数.

综上所述，有如下结论:

如果 $f(x) = P_m(x) \mathrm{e}^{\lambda x}$ ，则二阶常系数非齐次线性微分方程(5.88)具有形如

$$y^{*} = x^{k}Q_{m}(x)\mathrm{e}^{\lambda x}\tag{5.91}$$

的特解，其中 $Q_{m}(x)$ 是与 $P_{m}(x)$ 同次(m次)的多项式，而k按λ不是特征方程的根、是特征方程的单根或是特征方程的重根依次取为0、1或2.

上述结论可推广到n阶常系数非齐次线性微分方程，但要注意式(5.91)中的k是特征方程含根λ的重数(即若λ不是特征方程的根，k取为 $0;$ 若λ是特征方程的s重根，k取为s).

例5.34 求微分方程 $y^{\prime\prime} - 2y^{\prime} - 3y = 3x + 1$ 的一个特解.

解这是二阶常系数非齐次线性微分方程，且函数 $f ( x )$ 是 $P_{m}(x) \mathrm{e}^{\lambda x}$ 型$\left( P_{m}(x) = 3x + 1, \lambda = 0 \right)$

与所给方程对应的齐次方程为

$$y'' - 2y' - 3y = 0$$

它的特征方程为

$$r^{2}-2r-3=0.$$

由于这里 $\lambda = 0$ 不是特征方程的根，所以应设特解为

$$y^{*} = b_{0}x + b_{1}.$$

[page:201]

## 5.8 常系数非齐次线性微分方程

把它代入所给方程，得

$$-3b_{0}x-2b_{0}-3b_{1}=3x+1,$$

比较两端x同次幂的系数，得

$$\left\{ \begin{aligned} - 3b_{0} &= 3, \\ - 2b_{0} &= 3b_{1} = 1. \end{aligned} \right.$$

由此求得 $b_{0} = - 1,b_{1} = \frac{1}{3}$ .于是求得一个特解为

$$y^{*} = -x + \frac{1}{3}.$$

例5.35 求微分方程 $y'' - 5y' + 6y = x\mathrm{e}^{2x}$ 的通解.

解 所给方程也是二阶常系数非齐次线性微分方程，且 $f ( x )$ 呈 $P_{m}(x)\mathrm{e}^{\lambda x}$ 型$(P_{m}(x) = x, \lambda = 2)$

与所给方程对应的齐次方程为

$$y'' - 5y' + 6y = 0,$$

它的特征方程

$$r^{2}-5r+6=0$$

有两个实根 $r_{1} = 2, r_{2} = 3$ 于是与所给方程对应的齐次方程的通解为

$$Y = C_{1} \mathrm{e}^{2x} + C_{2} \mathrm{e}^{3x}.$$

由于 $\lambda = 2$ 是特征方程的单根，所以应设 $y ^ { * }$ 为

$$y^{*} = x(b_{0}x + b_{1})\mathrm{e}^{2x}.$$

把它代入所给方程，得

$$-2b_{0}x+2b_{0}-b_{1}=x.$$

比较等式两端同次幂的系数，得

$$\left\{ \begin{aligned} { } & { { } - 2 b _ { 0 } = 1 , } \\ { } & { { } 2 b _ { 0 } - b _ { 1 } = 0 . } \\ \end{aligned} \right.$$

解得 $b_{0}=-\frac{1}{2},b_{1}=-1$ .因此求得一个特解为

$$y^{*} = x\left( - \frac{1}{2}x - 1 \right)\mathrm{e}^{2x}.$$

从而所求的通解为

$$y = C_{1} \mathrm{e}^{2x} + C_{2} \mathrm{e}^{3x} - \frac{1}{2}(x^{2} + 2x)\mathrm{e}^{2x}$$

5.8.2 $f(x) = \mathrm{e}^{\lambda x} \left[ P_{l}(x) \cos{\omega x} + P_{n}(x) \sin{\omega x} \right]$ 型

应用欧拉公式，把三角函数表示为复变指数函数的形式，有

$$f(x) = \mathrm{e}^{\lambda x} \left[ P_{l} \cos \omega x + P_{n} \sin \omega x \right]$$

[page:202]

## 第5章微分方程

$$\begin{aligned} &= \mathrm{e}^{\lambda x} \left[ P_{l} \frac{\mathrm{e}^{\lambda x} + \mathrm{e}^{-\lambda x}}{2} + P_{n} \frac{\mathrm{e}^{\lambda x} - \mathrm{e}^{-\lambda x}}{2\mathrm{i}} \right] \\&= \left( \frac{P_{l}}{2} + \frac{P_{n}}{2\mathrm{i}} \right) \mathrm{e}^{(\lambda + \mathrm{i}\omega)x} + \left( \frac{P_{l}}{2} - \frac{P_{n}}{2\mathrm{i}} \right) \mathrm{e}^{(\lambda - \mathrm{i}\omega)x} \\&= P(x) \mathrm{e}^{(\lambda + \mathrm{i}\omega)x} + P(x) \mathrm{e}^{(\lambda - \mathrm{i}\omega)x},\\ \end{aligned}$$

其中

$$P(x)=\frac{P_{l}}{2}+\frac{P_{n}}{2\mathrm{i}}=\frac{P_{l}}{2}-\frac{P_{n}}{2}\mathrm{i};$$

$$\bar{P}(x)=\frac{P_{l}}{2}-\frac{P_{n}}{2\mathrm{i}}=\frac{P_{l}}{2}+\frac{P_{n}}{2}\mathrm{i};$$

二者为共轭的m次多项式(即它们对应项的系数是共轭复数)，而 $m = \max \{ l, n \}$

应用前面的结果，对于 $f ( x )$ 中的第一项 $P(x)\mathrm{e}^{(x + i\omega)x}$ ，可求出一个m次多项式$Q_{m}(x)$ ,使得 $y_{1}^{*} = x^{k}Q_{m}\mathrm{e}^{(\lambda + i\omega)x}$ 为方程

$$y'' + p y' + q y = P(x) \mathrm{e}^{(\lambda + \mathrm{i} \omega) x}$$

的特解，其中k按λ+iω不是特征方程的根或是特征方程的单根依次取0或1.由于 $f ( x )$ 的第二项 $\overline{P}(x)\mathrm{e}^{(x - i\omega)x}$ 与第一项 $P\left( x \right)\mathrm{e}^{\left( \lambda + w \right)x}$ 成共轭，所以与 $y_{1}^{\prime}$ 成共轭的函数 $y_{2}^{*} = x^{k} \bar{Q}_{m} \mathrm{e}^{(\lambda - i \omega)x}$ 必然是方程

$$y ^ { \prime \prime } + p y ^ { \prime } + q y = \bar { P } ( x ) \mathrm { e } ^ { ( \lambda - \mathrm { i } \omega ) x }$$

的特解，其中 $\overline{Q}_{m}$ 表示与 $Q _ { m }$ 成共轭的m次多项式，于是，方程(5.88)具有形如

$$y^{*} = x^{k}Q_{m}\mathrm{e}^{(\lambda + i\omega)x} + x^{k}Q_{m}\mathrm{e}^{(\lambda - i\omega)x}$$

的特解.上式可写为

$$\begin{align*}y^{*} &= x^{k}\mathrm{e}^{\mathrm{i}x}\left[Q_{m}\mathrm{e}^{\mathrm{i}\omega x} + Q_{m}\mathrm{e}^{-\mathrm{i}\omega x}\right] \\&= x^{k}\mathrm{e}^{\mathrm{i}x}\left[Q_{m}(\cos\omega x + \mathrm{i}\sin\omega x) + Q_{m}(\cos\omega x - \mathrm{i}\sin\omega x)\right],\end{align*}$$

由于括号内的两项是互成共轭的，相加后无虚部，所以可以写成实函数的形式

$$y ^ { * } = x ^ { k } \mathrm { e } ^ { \lambda x } \left[ R _ { m } ^ { ( 1 ) } ( x ) \cos \omega x + R _ { m } ^ { ( 2 ) } \sin \omega x \right].$$

综上所述，有如下结论:

如果 $f(x) = \mathrm{e}^{\lambda x} \left[ P_{l}(x) \cos \omega x + P_{n}(x) \sin \omega x \right]$ ，则二阶常系数非齐次线性微分方程(5.88)的特解可设为

$$y^{*} = x^{k} \mathrm{e}^{\lambda x} \left[ R_{m}^{(1)}(x) \cos \omega x + R_{m}^{(2)} \sin \omega x \right]\tag{5.92}$$

其中 $R_{m}^{(1)}(x),R_{m}^{(2)}(x)$ 是m次多项式， $m = \max\{l, n\}$ ，而k按 $\lambda + i \omega$ 或 $\lambda - \mathrm{i}\omega$ 不是特征方程的根、或是特征方程的单根依次取0或1.

上述结论可推广到n阶常系数非齐次线性微分方程，但要注意式(5.92)中的k是特征方程中含根 $\lambda + \mathrm{i}\omega($ $\lambda = \mathrm{i}\omega$ 的重数.

例5.36 求微分方程 $y'' + y = x\cos 2x$ 的一个特解.

解所给方程是二阶常系数非齐次线性方程，且 $f ( x )$ 属于

$$\mathrm{e}^{\lambda x} \left[ P_{l}(x) \cos \omega x + P_{n}(x) \sin \omega x \right]$$

其中 $\lambda = 0 , \omega = 2 , P _ { l } ( x ) = x , P _ { n } ( x ) = 0$ .与所给方程对应的齐次方程为

[page:203]

## 5.8 常系数非齐次线性微分方程

$$y ^ { \prime \prime } + y = 0 ,$$

它的特征方程为

$$r^{2} + 1 = 0.$$

由于 $\lambda + i \omega = 2 i$ 不是特征方程的根，所以应设特解为

$$y^{*} = (ax + b)\cos 2x + (cx + d)\sin 2x.$$

把它代入所给方程，得

$$( - 3 a x - 3 b + 4 c ) \cos 2 x - ( 3 c x + 3 d + 4 a ) \sin 2 x = x \cos 2 x.$$

比较两端同类项的系数，得

$$\begin{cases}- 3a = 1, \\- 3b + 4c = 0, \\- 3c = 0, \\- 3d - 4a = 0.\end{cases}$$

由此解得

$$a=-\frac{1}{3}, \quad b=0, \quad c=0, \quad d=\frac{4}{9}.$$

于是求得一个特解为

$$y^{*} = - \frac{1}{3}x\cos 2x + \frac{4}{9}\sin 2x.$$

例5.37在例5.22中，设物体受弹性恢复力 $f$ 和铅直干扰力 $F$ 的作用.试求物体的运动规律.

解这里需要求出无阻尼强迫振动方程

$$\frac{\mathrm{d}^{2} x}{\mathrm{d} t^{2}} + k^{2} x = h \sin p t\tag{5.93}$$

的通解.

对应的齐次微分方程(即无阻尼自由振动方程)为

$$\frac{\mathrm{d}^{2} x}{\mathrm{d} t^{2}} + k^{2} x = 0   ,\tag{5.94}$$

它的特征方程 $r^{2} + k^{2} = 0$ 的根为 $r = \pm i k$ .故方程(5.94)的通解为

$$X = C_{1} \cos kt + C_{2} \sin kt.$$

令

$$C_{1} = A \sin \varphi, \quad C_{2} = A \cos \varphi,$$

则方程(5.94)的通解又可写成

$$X = A \sin(kt + \varphi),$$

其中 $,A , \varphi$ 为任意常数.

方程(5.93)右端的函数

$$f(t) = h \sin pt$$

与 $f(t) = \mathrm{e}^{\lambda t} \left[ P_{l}(t) \cos \omega t + P_{n}(t) \sin \omega t \right]$ 相比较，有 $\lambda = 0 , \omega = p , P _ { l } \left( t \right) = 0$

[page:204]

## 第5章微分方程

$P_{n}(t) = h$ .分别就 $p \neq k$ 和 $p = k$ 两种情形讨论如下:

(1) 如果 $p \neq k$ ,则 $\lambda \pm \mathrm{i}\omega = \pm \mathrm{i}p$ 不是特征方程的根，故设

$$x^{*} = a_{1}\cos pt + b_{1}\sin pt.$$

代入方程(5.93)，求得

$$a_{1} = 0, \quad b_{1} = \frac{h}{k^{2} - p^{2}}.$$

于是

$$x^{*} = \frac{h}{k^{2} - p^{2}}\sin pt.$$

从而当 $p \neq k$ 时，方程(5.94)的通解为

$$x = X + x^{*} = A\sin(kt + \varphi) + \frac{h}{k^{2} - p^{2}}\sinpt.$$

上式表示，物体的运动由两部分组成，这两部分都是简谐振动.上式第一项表示自由振动，第二项所表示的振动叫做强迫振动.强迫振动是干扰力引起的，它的角频率即为干扰力的角频率 $\mathcal { P }$ ；当干扰力的角频率 $\hat { p }$ 与振动系统的固有频率k相差很小时，其振幅 $\left| \frac{h}{k^{2} - p^{2}} \right|$ 可以很大.

(2) 如果 $p = k$ ,则 $\lambda \pm \mathrm{i}\omega = \pm \mathrm{i}p$ 是特征方程的根.故设

$$x^{*} = t(a_{1}\cos kt + b_{1}\sin kt).$$

代入方程(5.93)求得

$$a _ { 1 } = - \frac { h } { 2 k } , \quad b _ { 1 } = 0 ,$$

于是

$$x^{*} = - \frac{h}{2k}t\cos kt.$$

从而当 $p = k$ 时，方程(5.93)的通解为

$$x = X + x^{*} = A\sin(kt + \varphi) - \frac{h}{2k}t\cos kt.$$

上式右端第二项表明，强迫振动的振幅 $\frac{h}{2k}t$ 随时间t的增大而无限增大.这就发生所谓共振现象.为了避免共振现象，应使干扰力的角频率 $\hat { P }$ 不要靠近振动系统的固有频率k.反之，如果要利用共振现象，则应使 $p = k$ 或使 $\mathcal { P }$ 与 $\vec { R }$ 尽量靠近.

有阻尼的强迫振动问题可作类似讨论，这里从略

[page:205]

## 5.8 常系数非齐次线性微分方程

## 习题5.8

1. 求下列各微分方程的通解:

(1) $2y^{\prime\prime} + y^{\prime} - y = 2\mathrm{e}^{x}; \quad (2) y^{\prime\prime} + a^{2}y = \mathrm{e}^{x};$

(3) $2y^{\prime\prime} + 5y^{\prime} = 5x^{2} - 2x - 1;$ (4) $y^{\prime\prime} + 3y^{\prime} + 2y = 3x\mathrm{e}^{-x}$

(5) $y^{\prime\prime} - 2y^{\prime} + 5y = \mathrm{e}^{x}\sin 2x;$ (6) $y^{\prime\prime} - 6y^{\prime} + 9y = (x + 1)\mathrm{e}^{3x}$

(7) $y^{\prime\prime}+5y^{\prime}+4y=3-2x;$ (8) $y'' + 4y = x\cos x;$

(9) $y^{\prime}+y=\mathrm{e}^{x}+\cos x; \quad (10) y^{\prime}-y=\sin^{2}x;$

(11) $y^{\prime\prime} + 2y^{\prime} + 5y = \sin 2x;$ (12) $y'' + y' = 2y' = x(\mathrm{e}^{x} + 4)$ .

(13) $y^{\prime\prime} - 4y^{\prime} + 5y = 5;$ (14) $y^{\prime\prime} + 2y^{\prime} = 4\mathrm{e}^{3x}$

(15) $y^{\prime\prime} - 7y^{\prime} + 12y = x;$ (16) $y'' + 9y = 10\sin 2x;$

(17) $y'' + 9y = 10\cos 2x;$ (18) $2y^{\prime\prime} - 3y^{\prime} - 2y = \mathrm{e}^{x} + \mathrm{e}^{- x}$

(19) $y^{\prime\prime} + y = \cos x\cos 3x;$ (20) $y^{\prime} + 2y^{\prime} + 5y = \mathrm{e}^{x} \left( \sin x + \cos x \right)$

(21) $2y^{\prime\prime} + y^{\prime} - y = x^{2}\mathrm{e}^{2x}$ (22) $y^{\prime\prime} - 4y = \cos^{2}x;$

(23) $y^{(4)} - 4y^{(3)} + 5y^{\prime\prime} - 4y^{\prime} + 4y = \mathrm{e}^{x}$

2. 求下列各微分方程满足已给初始条件的特解:

(1) $y^{\prime}+y+\sin 2x=0,\left.y\right|_{x=\pi}=1,\left.y^{\prime}\right|_{x=\pi}=1;$

(2) $y^{\prime}-3y^{\prime}+2y=5,y|_{x=0}=1,y^{\prime}|_{x=0}=2;$

(3) $y^{\prime\prime}-10y^{\prime}+9y=\mathrm{e}^{2x},y|_{x=0}=\frac{6}{7},y^{\prime}|_{x=0}=\frac{33}{7};$

(4) $y^{\prime\prime} - y = 4x\mathrm{e}^{x} , \left. y \right|_{x = 0} = 0 , \left. y^{\prime} \right|_{x = 0} = 1;$

(5) $y^{\prime\prime}-4y^{\prime}=5,y|_{x=0}=1,y^{\prime}|_{x=0}=0;$

$$y^{\prime\prime} + 2y^{\prime} + y = \cos x, \quad y|_{x = 0} = 0, \quad y^{\prime}|_{x = 0} = \frac{3}{2};$$

(7) $y^{\prime\prime}-4y=1,y|_{x=0}=0,y^{\prime}|_{x=0}=\frac{1}{4};$

(8) $u^{\prime\prime}-4u^{\prime}+3u=\sin t,u|_{t=0}=0,u^{\prime}|_{t=0}=0;$

(9) $y^{\prime}+y^{\prime}-2=(x+1)e^{x},y|_{x=0}=1,y^{\prime}|_{x=0}=2.$

3. 大炮以仰角α、初速 $\mathcal { D } _ { 0 }$ 发射炮弹，若不计空气阻力，求弹道曲线

4. 在 $R , L , C$ 含源串联电路中，电动势为E的电源对电容器C充电.已知 $E = 20 V$ $C = 0.2\mu  F$ 微法) $L = 0.1  H ( 亨 ) , R = 1000\Omega$ ，试求合上开关K后的电流i(t)及电压 $u _ { C } ( t )$

5.一链条悬挂在一钉子上，启动时一端离开钉子8m另一端离开钉子12m，分别在以下两种情况下求链条滑下来所需要的时间:

(1)若不计钉子对链条所产生的摩擦力；

(2)若摩擦力为1m长的链条的重量.

6. 设函数 $\varphi ( x )$ 连续，且满足

$$\varphi \left( x \right) = \mathrm{e}^{x} + \int_{0}^{x} t \varphi \left( t \right) \mathrm{d}t - x \int_{0}^{x} \varphi \left( t \right) \mathrm{d}t,$$

[page:206]

## 第5章微分方程

求 $\varphi ( x )$

## 5.9欧拉方程

变系数的线性微分方程一般都是不容易求解的.但是对于某些特殊的变系数线性微分方程，则可以通过变量代换化为常系数线性微分方程，使其容易求解.欧拉方程就是其中的一种.

形如

$$x^{n}y^{(n)}+p_{1}x^{n-1}y^{(n-1)}+\cdots+p_{n-1}xy^{\prime}+p_{n}y=f(x)\tag{5.95}$$

的方程(其中 $p_{1},p_{2},\cdots,p_{n}$ 为常数)，叫做欧拉方程.

作变换

$$x = \mathrm{e}^{t} \quad  或   t = \ln x,$$

将自变量x换成t(这里仅在 $x > 0$ 范围内求解.如果要在 $x < 0$ 内求解，则可作变换 $x = - \mathrm{e}^{t}$ 或 $t = \ln( - x )$ ，所得结果与 $x > 0$ 内的结果相类似)，有

$$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{\mathrm{d}y}{\mathrm{d}t} \cdot \frac{\mathrm{d}t}{\mathrm{d}x} = \frac{1}{x} \frac{\mathrm{d}y}{\mathrm{d}t},$$

$$\frac{\mathrm{d}^{2} y}{\mathrm{d} x^{2}} = \frac{1}{x^{2}} \left( \frac{\mathrm{d}^{2} y}{\mathrm{d} t^{2}} - \frac{\mathrm{d} y}{\mathrm{d} t} \right),$$

$$\frac{\mathrm{d}^{3} y}{\mathrm{d} x^{3}} = \frac{1}{x^{3}} \left( \frac{\mathrm{d}^{3} y}{\mathrm{d} t^{3}} - 3 \frac{\mathrm{d}^{2} y}{\mathrm{d} t^{2}} + 2 \frac{\mathrm{d} y}{\mathrm{d} t} \right).$$

如果采用记号D表示对t求导的运算 $\frac{\mathrm{d}}{\mathrm{d}t}$ ,那么上述计算结果可以写成

$$x y ^ { \prime } = D y   ,$$

$$\begin{aligned}x^{2} y^{\prime \prime} &= \frac{\mathrm{d}^{2} y}{\mathrm{d} t^{2}} - \frac{\mathrm{d} y}{\mathrm{d} t} = \left( \frac{\mathrm{d}^{2}}{\mathrm{d} t^{2}} - \frac{\mathrm{d}}{\mathrm{d} t} \right) y \\&= (D^{2} - D) y = D(D - 1) y,\end{aligned}$$

$$x^{3}y'' = \frac{\mathrm{d}^{3}y}{\mathrm{d}t^{3}} - 3\frac{\mathrm{d}^{2}y}{\mathrm{d}t^{2}} + 2\frac{\mathrm{d}y}{\mathrm{d}t} \\= (D^{3} - 3D^{2} + 2D)y = D(D - 1)(D - 2)y.$$

一般地，有

$$x^{k}y^{(k)}=D(D-1)\cdots(D-k+1)y.$$

把它代入欧拉方程(5.95)，便得一个以t为自变量的常系数线性微分方程.在求出此方程的解后，把t换成lnx，即得原方程的解.

例5.38 求欧拉方程 $x^{3}y'' + x^{2}y'' - 4xy' = 3x^{2}$ 的通解.

解作变换 $x \equiv \mathrm{e}^{t}$ 或 $t = \ln x$ ，原方程化为

[page:207]

## 5.9 欧拉方程

$$D(D - 1)(D - 2)y + D(D - 1)y - 4Dy = 3\mathrm{e}^{2t}$$

即

$$D^{3}y - 2D^{2}y - 3Dy = 3\mathrm{e}^{2t}$$

或

$$\frac{\mathrm{d}^{3} y}{\mathrm{d} t^{3}} - 2 \frac{\mathrm{d}^{2} y}{\mathrm{d} t^{2}} - 3 \frac{\mathrm{d} y}{\mathrm{d} t} = 3 \mathrm{e}^{2 t}.\tag{5.96}$$

方程(5.96)所对应的齐次方程为

$$\frac{\mathrm{d}^{3} y}{\mathrm{d} t^{3}} - 2 \frac{\mathrm{d}^{2} y}{\mathrm{d} t^{2}} - 3 \frac{\mathrm{d} y}{\mathrm{d} t} = 0,\tag{5.97}$$

其特征方程为

$$r^{3}-2r^{2}-3r=0,$$

它有三个根，即 $r_{1}=0, r_{2}=-1, r_{3}=3$ 于是方程(5.97)的通解为

$$Y = C_{1} + C_{2} \mathrm{e}^{-t} + C_{3} \mathrm{e}^{3t} = C_{1} + \frac{C_{2}}{x} + C_{3} x^{3}.$$

根据前面，特解的形式为

$$y^{*} = b\mathrm{e}^{2t} = bx^{2},$$

代入原方程，求得 $b = - \frac{1}{2}$ ,即

$$y^{*} = - \frac{x^{2}}{2}.$$

于是，所给欧拉方程的通解为

$$y = C_{1} + \frac{C_{2}}{x} + C_{3}x^{3} - \frac{1}{2}x^{2}.$$

习题5.9

求下列欧拉方程的通解:

(1) $x^{2}y^{\prime \prime}+xy^{\prime}-y=0;$ (2) $y^{\prime\prime} - \frac{y^{\prime}}{x} + \frac{y}{x^{2}} = \frac{2}{x}$

(3) $x^{3}y^{\prime\prime}+3x^{2}y^{\prime\prime}-2xy^{\prime}+2y=0;$ (4) $x^{2}y^{\prime\prime}-2xy^{\prime}+2y=\ln^{2}x-2\ln x;$ 44

(5) $x^{2}y^{\prime\prime}+xy^{\prime}-4y=x^{3}$ (6) $x^{2}y^{\prime\prime}-xy^{\prime}+4y=x\sin(\ln x)$

(7) $x^{2}y^{\prime\prime}-3xy^{\prime}+4y=x+x^{2}\ln x;$ (8) $x^{3}y'' + 2xy' - 2y = x^{2}\ln x + 3x;$

[page:208]

## 第5章 微分方程

$$x^{2}y^{\prime\prime}+3xy^{\prime}+y=0; \quad (10) x^{2}y^{\prime\prime}-4xy^{\prime}+6y=x;$$

(11) $\frac{\mathrm{d}^{2} R}{\mathrm{d} t^{2}} + \frac{2}{t} \frac{\mathrm{d} R}{\mathrm{d} t} - \frac{n(n + 1)}{t^{2}} R = 0 \quad (t > 0); \quad (12) x^{2} y^{\prime \prime} + 3xy^{\prime} + 5y = 0;$

(13) $x^{2}y'' - xy' + y = 2\ln x; \quad (14) x^{2}y'' + 5xy' + 4y = \ln x^{3}.$

## 5.10 本章内容对开普勒问题的应用

现在从万有引力定律推导开普勒定律.根据万有引力定律，行星受到指向太阳中心的引力的作用.行星在某一时刻的速度向量与太阳中心共同决定一张平面.容易判断:行星以后的运动不会离开这一平面(因为在垂直于这平面的方向上既没有速度，又没有外力的作用).我们在这平面上取以太阳中心为极点的极坐标系.于是，行星所受的力F表示为

$$F = F _ { r } \mathrm { e } _ { r } + F _ { \theta } \mathrm { e } _ { \theta } ,$$

其中

$$F _ { r } = - G \frac { M m } { r ^ { 2 } } , \quad F _ { \theta } = 0 .$$

这里M是太阳的质量，m是行星的质量，G是万有引力常数.行星的运动方程可以写成

$$r ^ { \prime \prime } - r ( \theta ^ { \prime } ) ^ { 2 } = - \frac { k } { r ^ { 2 } } , \quad 2 r ^ { \prime } \theta ^ { \prime } + r \theta ^ { \prime \prime } = 0 ,$$

这里 $k = G M .$ 后一方程两边乘以r，得

$$2rr^{\prime}\theta^{\prime} + r^{2}\theta^{\prime} = 0,$$

或

$$\frac{\mathrm{d}}{\mathrm{d}t}(r^{2}\theta^{'}) = 0.$$

这说明面积速度为常数，即

$$\frac{\mathrm{d}A}{\mathrm{d}t}=\frac{1}{2}r^{2}\theta^{\prime}=\frac{1}{2}h$$

再来考察方程

$$r ^ { \prime \prime } - r ( \theta ^ { \prime } ) ^ { 2 } = \frac { - k } { r ^ { 2 } } .$$

记 $u = 1 / r$ ，则由

$$r ^ { 2 } \theta ^ { \prime } = h$$

可得

$$\theta ^ { \prime } = h u ^ { 2 } .$$

于是有

[page:209]

## 5.10 本章内容对开普勒问题的应用

$$\begin{aligned} &r^{\prime} = \frac{\mathrm{d}}{\mathrm{d}\theta}\left( \frac{1}{u} \right)\theta^{\prime} = - \frac{1}{u^{2}}\frac{\mathrm{d}u}{\mathrm{d}\theta}\theta^{\prime} = - h\frac{\mathrm{d}u}{\mathrm{d}\theta}, \\&r^{\prime\prime} = \frac{\mathrm{d}}{\mathrm{d}t}(r^{\prime}) = \frac{\mathrm{d}}{\mathrm{d}\theta}\left( - h\frac{\mathrm{d}u}{\mathrm{d}\theta} \right)\theta^{\prime} \\&= - h\frac{\mathrm{d}^{2}u}{\mathrm{d}\theta^{2}}\theta^{\prime} = - h^{2}u^{2}\frac{\mathrm{d}^{2}u}{\mathrm{d}\theta^{2}}.\\ \end{aligned}$$

方程化为

$$-h^{2}u^{2}\frac{\mathrm{d}^{2}u}{\mathrm{d}\theta^{2}}-h^{2}u^{3}=-ku^{2},$$

即

$$\frac{\mathrm{d}^{2} u}{\mathrm{d} \theta^{2}} + u = \frac{k}{h^{2}}.$$

这是一个二阶常系数线性微分方程.容易看出它的一个特解是 $\bar{u} = k / h^{2}$ .于是，此方程的一般解为

$$u = D \cos \theta + C \sin \theta + \frac{k}{h^2}.$$

此式又可写成

$$u = L \cos ( \theta - \theta _ { 0 } ) + \frac { k } { h ^ { 2 } } ,$$

其中

$$\cos \theta_{0} = \frac{D}{\sqrt{D^{2} + C^{2}}}, \quad \sin \theta_{0} = \frac{C}{\sqrt{D^{2} + C^{2}}}.$$

于是有

$$\begin{aligned} &r = \frac{1}{u} = \frac{1}{L\cos(\theta - \theta_0) + k / h^2}\\ &= \frac{\frac{h^2}{k}}{1 + \frac{h^2L}{k}\cos(\theta - \theta_0)}\\ &= \frac{p}{1 + \varepsilon\cos(\theta - \theta_0)},\\ \end{aligned}$$

其中

$$\epsilon = \frac { h ^ { 2 } L } { k } , \quad p = \frac { h ^ { 2 } } { k } .$$

于是得到圆锥曲线的一般方程

$$r = \frac{p}{1 + \varepsilon \cos(\theta - \theta_0)}.$$

[page:210]

## 第5章微分方程

因为运转中的行星不会跑到无穷远去，它的轨道应该是一个椭圆，所以 $\varepsilon \leq 1$

最后证明开普勒第三定律.利用关系

$$\frac{1}{2}hT = \pi ab, \quad p = \frac{h^{2}}{k} = \frac{b^{2}}{a},$$

可得

$$\begin{aligned} &T^{2} = \left( \frac{2\pi ab}{h} \right)^{2} = \frac{4\pi^{2}a^{2}b^{2}}{h^{2}} = \frac{\frac{4\pi^{2}}{h}a^{2}b^{2}}{\frac{h^{2}}{h}}\\ &= \frac{\frac{4\pi^{2}}{h}a^{2}b^{2}}{\frac{b^{2}}{a}} = \frac{4\pi^{2}}{h}a^{3},\\ \end{aligned}$$

其中 $k = G M$ 是一个常数.

[page:211]

# 第6章 微分中值定理与导数的应用

本章将应用导数来研究函数以及曲线的某些性态，并利用这些知识解决一些实际问题，而导数描写的是函数局部的性质，要研究的问题往往涉及函数的大范围性质.联系这两方面的桥梁是微分学的几个中值定理，它们是导数应用的理论基础

## 6.1 微分中值定理

## 6.1.1 罗尔定理

在讲罗尔定理之前，先介绍费马引理

费马引理设函数 $f ( x )$ 在点 $x_{0}$ 的某邻域 $U(x_{0})$ 内有定义，并且在 $x_{0}$ 处可导，如果对任意的 $x \in U(x_0)$ ,有

$$f(x) \leqslant f(x_0) \quad  或  \; f(x) \geqslant f(x_0),$$

那么 $f^{\prime}(x_0) = 0$

证不妨设 $x \in U(x_0)$ 时， $f(x) \leqslant f(x_0)$ .于是，对于 $x_{0}+\Delta x\in U(x_{0})$ 有

$$f(x_{0}+\Delta x) \leqslant f(x_{0}),$$

从而当 $\Delta x > 0$ 时，

$$\frac{f(x_{0}+\Delta x)-f(x_{0})}{\Delta x} \leqslant 0;$$

当 $\Delta x < 0$ 时，

$$\frac{f\left(x_{0}+\Delta x\right)-f\left(x_{0}\right)}{\Delta x} \geqslant 0.$$

根据函数 f(x)在 $x _ { 0 }$ 可导的条件及极限的保号性，便得到

$$f^{\prime}(x_{0}) = f_{+}^{\prime}(x_{0}) = \lim_{\Delta x \to 0^{+}} \frac{f(x_{0} + \Delta x) - f(x_{0})}{\Delta x} \leqslant 0,$$

$$f^{\prime}(x_{0}) = f_{-}^{\prime}(x_{0}) = \lim_{\Delta x \to 0^{-}} \frac{f(x_{0} + \Delta x) - f(x_{0})}{\Delta x} \geqslant 0,$$

所以 $f^{\prime}(x_0) = 0$ 证毕.

罗尔定理 如果函数f(x)满足

（1） 在闭区间 $[ a , b ]$ 上连续；

(2) 在开区间(a,b)内可导；

（3）在区间端点处的函数值相等，即 $f(a) = f(b)$ ,那么在(a,b)内至少有一点ξ,使得 $f^{\prime}(\xi) = 0.$

[page:212]

## 第6章 微分中值定理与导数的应用

证由于 $f(x)$ 在闭区间 $\left[ a , b \right]$ 上连续，所以有最大值M和最小值m.这样只有两种可能情形:

(1) $M = m$ 此时， $f(x) = M, \forall \xi \in (a,b)$ ,都有 $f^{\prime}(\xi) = 0$

(2) $M > m .$ 因为 $f(a) = f(b)$ ,所以M和m这两个值至少有一个在 $(a,b)$ 中取到，不妨假定3 $\xi \in (a,b)$ ，使得 $f(\xi) = M.$ 由费马引理，有 $f^{\prime}(\xi) =$ 0.定理证毕.

## 6.1.2 拉格朗日中值定理

拉格朗日中值定理如果函数f(x)满足

(1) 在闭区间[a,b]上连续；

(2) 在开区间 $(a,b)$ 内可导，

则在 $( a , b )$ 内至少存在一点ξ，使得 $f(b) - f(a) = f^{\prime}(\xi)(b - a)$

证引进辅助函数

$$\varphi(x)=f(x)-f(a)-\frac{f(b)-f(a)}{b-a}(x-a).$$

容易验证 $\varphi ( x )$ 满足罗尔定理的条件.根据罗尔定理，在 $(a,b)$ 内至少有一点ξ，使得$\varphi^{'}(\xi) = 0$ ,即v1

$$f^{\prime}(\xi) - \frac{f(b) - f(a)}{b - a} = 0.$$

由此得

$$f(b) - f(a) = f^{\prime}(\xi)(b - a).$$

拉格朗日中值定理的几何解释若曲线 $y =$ $f ( x )$ 在A，B两点间连续，且在AB内每一点处都有不垂直于x轴的切线，则在曲线 $y = f(x)$ 上至少存在一点 $P(\xi,f(\xi))$ ，使得曲线 $y = f(x)$ 在P点的切线与割线AB平行(图6.2).

[page:213]

## 6.1 微分中值定理

注6.1当 $b < a$ 时， $f(b) - f(a) = f^{\prime}(\xi)(b - a)$ 仍然成立.

注6.2 设x为区间 $[ a , b ]$ 内一点， $\bar{x} + \Delta x$ 为这区间内的另一点，拉格朗日中值公式在区间 $\left[ x , x + \Delta x \right]$ 或 $\left[ x + \Delta x , x \right]$ 上就成为

$$f(x+\Delta x)-f(x)=f^{\prime}(x+\theta\Delta x)\cdot\Delta x,\quad0<\theta<1,$$

其中θ为介于0与1之间的某个数.上式也称有限增量公式

注6.3 如果 $f(a) = f(b)$ ，则拉格朗日中值定理就变成了罗尔定理的情形

定理6.1 如果函数 $f ( x )$ 在区间Ⅰ上的导数恒为零，那么 $f ( x )$ 在区间I上是一个常数.

证 在区间I上任取两点 $x _ { 1 } , x _ { 2 }$ ，由拉格朗日中值公式得

$$f(x_{1}) - f(x_{2}) = f^{\prime}(\xi)(x_{1} - x_{2})$$

其中 $\xi$ 为 $\mathcal { X } _ { 1 } , \mathcal { X } _ { 2 }$ 之间的某个点.由于 $f ( x )$ 在区间I上的导数恒为零，所以 $f(x_{1}) =$ $f(x_{2})$ .因为 $\mathcal { X } _ { 1 } , \mathcal { X } _ { 2 }$ 是在I中任取的，所以 $f ( x )$ 在区间I上是一个常数.

例6.1 证明当 $x > 0$ 时

$$\frac{x}{1 + x} < \ln(1 + x) < x.$$

证设 $f(t) = \ln t$ ，显然 $f ( t )$ 在区间 $\left[ 1 , 1 + x \right]$ 上满足拉格朗日中值定理的条件，所以

$$f(1+x)-f(1)=f^{\prime}(\xi)(1+x-1), \quad 1<\xi<1+x.$$

代入 $f(t) = \ln t$ ,即得

$$\ln(1 + x) = \frac{x}{\xi}.$$

由于 $1 < \xi < 1 + x$ ,所以

$$\frac{x}{1 + x} < \ln(1 + x) < x.$$

## 6.1.3柯西中值定理

柯西中值定理 如果函数 $f(x)$ 和 $g(x)$ 满足条件:

(1) 在闭区间 $\left[ a , b \right]$ 上连续；

(2) 在开区间 $( a , b )$ 内可导；

(3) $g^{\prime}(x) \neq 0, \forall x \in (a, b)$

则在(a,b)内至少存在一点ξ，使得

$$\frac{f(b) - f(a)}{g(b) - g(a)} = \frac{f^{\prime}(\xi)}{g^{\prime}(\xi)}.$$

证引进辅助函数

$$\varphi(x)=f(x)-f(a)-\frac{f(b)-f(a)}{g(b)-g(a)}(g(x)-g(a)).$$

[page:214]

## 第6章 微分中值定理与导数的应用

容易验证 $\varphi ( x )$ 满足罗尔定理的条件.根据罗尔定理，在 $(a,b)$ 内至少存在一点 $\xi ,$ 使得 $\varphi^{'}(\xi) = 0$ ，即

$$f^{\prime}(\xi)-\frac{f(b)-f(a)}{g(b)-g(a)}g^{\prime}(\xi)=0.$$

图6.3

由此得

$$\frac{f(b) - f(a)}{g(b) - g(a)} = \frac{f^{\prime}(\xi)}{g^{\prime}(\xi)}.$$

柯西中值定理的几何解释 设在XOY坐标系中，以x为参数，曲线的参数方程为

$$\begin{cases}X = f(x), \\Y = g(x),\end{cases}a \leqslant x \leqslant b,$$

则柯西中值定理的几何解释与拉格朗日中值定理的几何解释是一样的(图6.3).

注6.4当 $b < a$ 时，柯西中值定理仍然成立

注6.5 如果 $g(x) = x$ ，则柯西中值定理就变成了拉格朗日中值定理的情形

## 习题6.1

1. 验证罗尔定理对函数 $y = \mathrm{l n s i n} x$ 在区间 $\left[ \frac{\pi}{6}, \frac{5\pi}{6} \right]$ 上的正确性.

2. 验证拉格朗日中值定理对函数 $y=4x^{3}-5x^{2}+x-2$ 在区间[0，1]上的正确性

3. 对函数 $f(x) = \sin x$ 及 $F(x) = x + \cos x$ 在区间 $\left[ 0 , \frac { \pi } { 2 } \right]$ 上验证柯西中值定理的正确性.

4. 试证明:对函数 $y = p x ^ { 2 } + q x + r$ 应用拉格朗日中值定理时，所求得的点 $\xi$ 总是位于区间的正中间.

5. 不用求出函数 $f(x)=(x-1)(x-2)(x-3)(x-4)$ 的导数，说明方程 $f^{\prime}(x) = 0$ 有几个实根，并指出它们所在的区间.

6. 证明恒等式 $\arcsin x + \arccos x = \frac{\pi}{2} \left( - 1 \leqslant x \leqslant 1 \right)$

7. 若方程 $a_{0}x^{n} + a_{1}x^{n - 1} + \cdots + a_{n - 1}x = 0$ 有一个正根 $x = x_{0}$ .证明:

方程 $a_{0}nx^{n - 1} + a_{1}(n - 1)x^{n - 2} + \cdots + a_{n - 1} = 0$ 必有一个小于 $\mathcal { X } _ { 0 }$ 的正根.

8. 若函数 $f ( x )$ 在(a,b)内具有二阶导数，且 $f(x_{1}) = f(x_{2}) = f(x_{3})$ ,其中 $a < x_{1} < x_{2} < x_{3} <$ b，证明:在 $(x_{1},x_{3})$ 内至少有一点ξ，使得 $f^{\prime\prime}(\xi) = 0$

9. 设 $a>b>0,n>1$ ，证明

$$n b^{n - 1}(a - b) < a^n - b^n < n a^{n - 1}(a - b).$$

[page:215]

## 6.1 微分中值定理

10. 设 $a>b>0$ ，证明

$$\frac{a - b}{a} < \ln \frac{a}{b} < \frac{a - b}{b}.$$

11. 证明下列不等式:

(1) $\left| \arctan a - \arctan b \right| \leqslant \left| a - b \right|$ ##

(2) 当 $x > 1$ 时 $\mathrm{e}^{x}>\mathrm{e}^{-x}$

12.证明:方程 $x^{5}+x-1=0$ 只有一个正根.

13. 设 $f(x) , g(x)$ 在[a,b]上连续，在(a,b)内可导，证明在(a,b)内存在一点 $\xi ,$ 使得

$$\begin{vmatrix} f(a) & f(b) \\ g(a) & g(b) \end{vmatrix} = (b - a) \begin{vmatrix} f(a) & f^{\prime}(\xi) \\ g(a) & g^{\prime}(\xi) \end{vmatrix}.$$

14. 证明:若函数f(x)在 $( - \infty , + \infty )$ 内满足关系式 $f^{\prime}(x) = f(x)$ ,且 $f(0) = 1$ ,则 $f(x) = \mathrm{e}^{x}$

15. 设函数 $y = f(x)$ 在 $x = 0$ 的某邻域内具有n阶导数，且 $f(0)=f^{\prime}(0)=\cdots=f^{(n-1)}(0)=0$试用柯西中值定理证明

$$\frac{f(x)}{x^{n}} = \frac{f^{(n)}(\theta x)}{n!}, \quad 0 < \theta < 1.$$

16. 设 $\lim_{x \to \infty} f'(x) = k$ ,求 $\lim_{x \to \infty} \left[ f(x+a) - f(x) \right]$

17.证明:多项式 $f(x)=x^{3}-3x+a$ 在[0，1]上不可能有两个零点.

18. 设 $a_{0}+\frac{a_{1}}{2}+\cdots+\frac{a_{n}}{n+1}=0$ ，证明多项式

$$f(x) = a_{0} + a_{1}x + \cdots + a_{n}x^{n}$$

在(0，1)内至少有一个零点.

19. 设 f(x)在 $[0,a]$ 上连续，在(0,a)内可导，且 $f(a) = 0.$ 证明:存在一点 $\xi \in (0,a)$ ，使得$f(\xi) + \xi f^{\prime}(\xi) = 0$

20. 设 $0 < a < b$ ，函数f(x)在 $\left[ a , b \right]$ 上连续，在 $(a,b)$ 内可导.试利用柯西中值定理证明:存在一点 $\xi \in (a,b)$ ,使得

$$f(b) = f(a) = \xi f^{\prime}(\xi) \ln \frac{b}{a}.$$

21. 设 $f(x) , g(x)$ 都是可导函数，且 $\left| f^{\prime}(x) \right| < g^{\prime}(x)$ .证明:当 $x > a$ 时，

$$f(x) - f(a) \mid < g(x) = g(a).$$

22. 证明:若 $f ^ { \prime } ( x )$ 为常数，则f(x)是线性函数.

23.证明下列不等式:

(1) $\left| \sin x - \sin y \right| \leqslant \left| x - y \right|$

(2) $\left| \arcsin x - \arcsin y \right| \geqslant \left| x - y \right|$

24. 求证: $4ax^{3}+3bx^{2}+2cx-a-b-c=0$ 在(0,1)间至少有一个根.

25. 求证: $\mathrm{e}^{x}=ax^{2}+bx+c$ 的根不超过三个

26. 设函数 $f ( x )$ 在 $[ x _ { 0 } , x _ { 0 } + \delta )$ 上连续， $f ^ { \prime } ( x )$ 在 $(x_{0},x_{0}+\delta)$ 上存在，且 $\lim_{x \to x_0^+} f'(x) = \hat{A}$ ,则$f^{\prime}_{+}(x_0) = A_1$

27. 设 f(x)在 $[ a , b ]$ 上可微，且 $\bar { a } b \geq 0$ ，试证存在 $c \in (a,b)$ ，使得

$$2c\left[f(b)-f(a)\right]=\left(b^{2}-a^{2}\right)f^{\prime}(c).$$

28. 设 f(x)在 $(a, +\infty)$ 上可微，且 $\lim_{x \to a^{+}} f(x) = \lim_{x \to +\infty} f(x)$ ，证明存在 $c \in (a, +\infty)$ ,使得

[page:216]

## 第6章 微分中值定理与导数的应用

$f^{\prime}(c) = 0.$

29. 设函数 f(x)在 $( 一 r, r )$ 上有n阶导数，且 $\lim_{x \to 0} f^{(n)}(x) = l$ ，证明 $f^{(n)}(x)$ 在0点连续.

30. 设函数 $f(x) , g(x)$ 在(a，b)上可微，对任意的 $x \in (a,b), g(x) \neq 0$ ，且在(a,b)上

$$\begin{vmatrix} f(x) & g(x) \\ f^{\prime}(x) & g^{\prime}(x) \end{vmatrix} = 0.$$

求证:存在常数c，使得 $f(x) = c g(x) , x \in (a, b)$

31. 证明达布定理:设f(x)在 $[ a , b ]$ 上可微，则

(1) 若 $f_{+}^{\prime}(a) \cdot f_{-}^{\prime}(b) < 0$ ，求证存在 $c \in (a,b)$ ，使得 $f^{\prime}(c) = 0$

(2) 若 $f_{+}^{\prime}(a) \neq f^{\prime}(b),k$ 属于以 $f^{\prime}_{+}(a),f^{\prime}_{-}(b)$ 为端点的开区间，则存在 $c \in (a,b)$ ，使得$f^{\prime}(c) = k.$

32. 若f(x)在区间I上可导，且 $f^{\prime}(x) \neq 0$ ,则 $f^{\prime}(x)$ 在区间I上同号.

33. 设 f(x)在邻域 $(a - h, a + h)$ 上可导，在 $\left[ a - h , a + h \right]$ 上连续.求证:

(1) 存在 $\theta \in (0,1)$ ,使得

$$\frac{f(a+h)-f(a-h)}{h}=f^{\prime}(a+\theta h)+f^{\prime}(a-\theta h);$$

(2) 存在 $\theta \in (0,1)$ ,使得

$$\frac{f(a+h)-2f(a)+f(a-h)}{h}=f^{\prime}(a+\theta h)-f^{\prime}(a-\theta h).$$

## 6.2 洛必达法则

在某一极限过程中，求两个无穷小之比的极限，或两个无穷大量之比的极限，是经常会遇到的问题.它们称为 $\frac { \cdots 0 } { 0 }$ 型或 $\overset { \leftrightarrow } { \underset {} { \underset {} { \infty } { } } } \overset { \leftrightarrow } { \underset {} { \underset {} { \infty } { } } } \overset { \leftrightarrow } { \underset {} { \pi } { } }$ 型的未定式.

定理6.2 设

(1) 当 $x \to a$ 时，函数 $f ( x )$ 和 $g ( x )$ 都趋于零；

(2) 在点a的某去心邻域内， $f ^ { \prime } ( x )$ 和 $g ^ { \prime } ( x )$ 都存在且 $g^{\prime}(x) \neq 0$

(3) $\lim_{x \to a} \frac{f'(x)}{g'(x)}$ 存在(或为无穷大)，

那么

$$\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}$$

证 补充或者修改定义使得 $f(a) = g(a) = 0$ 这时可以验证 $f(x) , g(x)$ 在点$\alpha$ 的某邻域内满足柯西中值定理的条件，所以

$$\frac{f(x)}{g(x)} = \frac{f(x) - f(a)}{g(x) - g(a)} = \frac{f^{\prime}(\xi)}{g^{\prime}(\xi)},$$

其中 $\xi$ 为位于a和x之间的某点.上式两边令 $x \rightarrow a$ 取极限，注意到 $x \rightarrow a$ 时 $\xi > a$ ,所以

[page:217]

## 6.2 洛必达法则

$$\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(\xi)}{g'(\xi)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}$$

例6.2求 $\lim_{x \to 0} \frac{\sin ax}{\sin bx} (b \neq 0)$

解

$$\lim_{x \to 0} \frac{\sin ax}{\sin bx} = \lim_{x \to 0} \frac{a\cos ax}{b\cos bx} = \frac{a}{b}$$

例6.3求 $\lim_{x \to 1} \frac{x^3 - 3x + 2}{x^3 - x^2 - x + 1}$

解

$$\lim_{x \to 1} \frac{x^3 - 3x + 2}{x^3 - x^2 - x + 1} = \lim_{x \to 1} \frac{3x^2 - 3}{3x^2 - 2x - 1} = \lim_{x \to 1} \frac{6x}{6x - 2} = \frac{3}{2}$$

例6.4求 $\lim_{x \to 0} \frac{x - \sin x}{x^3}$

解

$$\lim_{x \to 0} \frac{x - \sin x}{x^3} = \lim_{x \to 0} \frac{1 - \cos x}{3x^2} = \lim_{x \to 0} \frac{\sin x}{6x} = \frac{1}{6}$$

例6.5求 $\lim_{x \to 0} \frac{\ln(1 + x)}{x^2}$

解

$$\lim_{x \to 0} \frac{\ln(1 + x)}{x^2} = \lim_{x \to 0} \frac{\frac{1}{1 + x}}{2x} = \infty$$

注:洛必达法则涉及到求导，当然有时候会有变限积分的求导，举例如下:

$$\lim_{x \to 0} \frac{\int_{\cos x}^{1} \mathrm{e}^{-t^2}   dt}{x^2} = \lim_{x \to 0} \frac{\sin x \cdot \mathrm{e}^{-\cos^2 x}}{2x} = \frac{1}{2\mathrm{e}}$$

定理6.3 设

(1) 当 $x \rightarrow \infty$ 时，函数 $f ( x )$ 和 $g(x)$ 都趋于零；

(2) 当 $\vert x \vert$ 充分大时 $f ^ { \prime } ( x )$ 和 $g^{\prime}(x)$ 都存在且 $g^{\prime}(x) \neq 0$

(3) $\lim_{x \to \infty} \frac{f'(x)}{g'(x)}$ 存在(或为无穷大)，

则

$$\lim_{x \to \infty} \frac{f(x)}{g(x)} = \lim_{x \to \infty} \frac{f'(x)}{g'(x)}$$

定理6.4设

(1)当 $x \rightarrow a$ 时，函数 $g(x)$ 趋于无穷；

(2) 在点 a的某去心邻域内， $f^{\prime}(x)$ 和 $g ^ { \prime } ( x )$ 都存在，且 $g^{\prime}(x) \neq 0$

(3) $\lim_{x \to x} \frac{f'(x)}{g'(x)}$ 存在(或为无穷大)，

则

[page:218]

## 第6章 微分中值定理与导数的应用

$$\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}$$

定理6.5设

(1) 当 $x \rightarrow \infty$ 时，函数 $g(x)$ 趋于无穷；

(2) 当 $\vert x \vert$ 充分大时 $f ^ { \prime } ( x )$ 和 $g ^ { \prime } ( x )$ 都存在且 $g^{\prime}(x) \neq 0$

(3) $\lim_{x \to \infty} \frac{f'(x)}{g'(x)}$ 存在(或为无穷大)，

则

$$\lim_{x \to \infty} \frac{f(x)}{g(x)} = \lim_{x \to \infty} \frac{f'(x)}{g'(x)}$$

例6.6求 $\lim_{x \to +\infty} \frac{\frac{\pi}{2} - \arctan x}{\frac{1}{x}}$

解 $\lim_{x \to +\infty} \frac{\frac{\pi}{2} - \arctan x}{\frac{1}{x}} = \lim_{x \to +\infty} \frac{-\frac{1}{1 + x^2}}{-\frac{1}{x^2}} = \lim_{x \to +\infty} \frac{x^2}{1 + x^2} = 1.$

例6.7求 $\lim_{x \to +\infty} \frac{\ln x}{x^{\lambda}} (\lambda > 0)$

解

$$\lim_{x \to +\infty} \frac{\ln x}{x^{\lambda}} = \lim_{x \to +\infty} \frac{\frac{1}{x}}{\lambda x^{\lambda - 1}} = \lim_{x \to +\infty} \frac{1}{\lambda x^{\lambda}} = 0.$$

例6.8求 $\lim_{x \to +\infty} \frac{x^n}{\mathrm{e}^x} \quad (n \in \mathbf{N}^+)$

解

$$\begin{aligned}\lim_{x \rightarrow + \infty}\frac{x^{n}}{\mathrm{e}^{x}} &= \lim_{x \rightarrow + \infty}\frac{nx^{n - 1}}{\mathrm{e}^{x}} = \lim_{x \rightarrow + \infty}\frac{n(n - 1)x^{n - 2}}{\mathrm{e}^{x}} = \cdots \\&= \lim_{x \rightarrow + \infty}\frac{n!}{\mathrm{e}^{x}} = 0.\end{aligned}$$

还有一些 $0 \cdot \infty , \infty - \infty , 0 ^ { 0 } , 1 ^ { \infty } , \infty ^ { 0 }$ 型的未定式，也可通过 $\frac{0}{0}$ 或 $\frac{\infty}{\infty}$ 型的未定式来计算.下面举例说明.

例6.9求 $\lim_{x \to 0^{+}} x^{\lambda} \ln x (\lambda > 0)$

解

$$\lim_{x \to 0^{+}} x^{\lambda} \ln x = \lim_{x \to 0^{+}} \frac{\ln x}{x^{-\lambda}} = \lim_{x \to 0^{+}} \frac{\frac{1}{x}}{x} = \lim_{x \to 0^{+}} \frac{-x^{\lambda}}{\lambda} = 0.$$

例6.10求 $\lim_{x \to 0} \left( \frac{2}{\sin^2 x} - \frac{1}{1 - \cos x} \right)$

解 $\lim_{x \to 0} \left( \frac{2}{\sin^2 x} - \frac{1}{1 - \cos x} \right) = \lim_{x \to 0} \frac{2 - 2\cos x - \sin^2 x}{\sin^2 x (1 - \cos x)}$

[page:219]

## 6.2 洛必达法则

$$\begin{aligned}= & \lim_{x \rightarrow 0}\frac{2 - 2\cos x - \sin^{2}x}{x^{2} \cdot \frac{1}{2}x^{2}} = \lim_{x \rightarrow 0}\frac{2\sin x - 2\sin x \cdot \cos x}{2x^{3}} \\= & \lim_{x \rightarrow 0}\frac{\sin x \cdot (1 - \cos x)}{x^{3}} = \lim_{x \rightarrow 0}\frac{x \cdot \frac{1}{2}x^{2}}{x^{3}} = \frac{1}{2}.\end{aligned}$$

例6.11 求 $\lim_{x \to 0^{+}} x^{x}$

解设 $y = x^{n}$ ，取对数得

$$\ln y = x \ln x.$$

而

$$\lim_{x \to 0^{+}} \ln y = \lim_{x \to 0^{+}} (x \ln x) = 0,$$

所以

$$\lim_{x \to 0^{+}} x^{x} = \lim_{x \to 0^{+}} y = \mathrm{e}_{x \to 0^{+}}^{\lim_{x \to 0^{+}} \ln y} = \mathrm{e}^{0} = 1.$$

## 习题6.2

1. 用洛必达法则求下列极限:

(1) $\lim_{x \to 0} \frac{\ln(1 + x)}{x}$ ; (2) $\lim_{x \to 0} \frac{\mathrm{e}^x - \mathrm{e}^{-x}}{\sin x}$ (3) $\lim_{x \to a} \frac{\sin x - \sin a}{x - a}$ ；(4) $\lim_{x \to \pi} \frac{\sin 3x}{\tan 5x}$

(5) $\lim_{x \to \frac{\pi}{2}} \frac{\ln \sin x}{(\pi - 2x)^2}$ (6) $\lim_{x \to a} \frac{x^m - a^m}{x^n - a^n} (a \neq 0)$ (7) $\lim_{x \to 0^{+}} \frac{\ln \tan 7x}{\ln \tan 2x};$ (8) $\lim_{x \to \frac{\pi}{2}} \frac{\tan x}{\tan 3x};$ 二

(9) $\lim_{x \to +\infty} \frac{\ln\left(1 + \frac{1}{x}\right)}{\arccos x}$ ； (10) $\lim_{x \to 0} \frac{\ln(1 + x^2)}{\sec x - \cos x}$ ； (11) $\lim_{x \to 0} x \cot 2x;$ (12) $\lim_{x \to 0} x^2 \mathrm{e}^{1/x^2}$

(13) $\lim_{x \to 1} \left( \frac{2}{x^2 - 1} - \frac{1}{x - 1} \right)$ (14) $\lim_{x \to \infty} \left( 1 + \frac{a}{x} \right)^x$ (15) $\lim_{x \to 0^{+}} x^{\sin x}$ (16) $\lim_{x \to 0^{+}} \left( \frac{1}{x} \right)^{\tan x}$

(17) $\lim_{x \to 1} \frac{x - x^x}{1 - x + \ln x};$ (18) $\lim_{x \to 0} \left[ \frac{1}{\ln(1 + x)} - \frac{1}{x} \right]$ (19) $\lim_{x \to +\infty} \left( \frac{2}{\pi} \arctan x \right)^x$

(20) $\lim_{x \to \infty} \left[ \left( a_{1}^{\frac{1}{x}} + a_{2}^{\frac{1}{x}} + \cdots + a_{n}^{\frac{1}{x}} \right) / n \right]^{nx} \left( a_{1}, a_{2}, \cdots, a_{n} > 0 \right)$ (21) $\lim_{x \to 0} \frac{\tan x - x}{x - \sin x}$

(22) $\lim_{x \to \frac{\pi}{2}} \frac{\ln \sin x}{(\pi - 2x)^2}$ (23) $\lim_{x \to 0} \frac{x - \arcsin x}{\sin^3 x}$ ; (24) $\lim_{x \to 1} \frac{\sqrt{2x - x^4} - \sqrt[3]{x}}{1 - \sqrt[4]{x^3}}$

(25) $\lim_{x \to 0} \frac{(1 + x)^{\frac{1}{x}} - \mathrm{e}}{x}$ (26) $\lim_{x \to 0} \frac{\mathrm{e}^x - \mathrm{e}^{-x}}{\ln(\mathrm{e} - x) + x - 1}$ ; (27) $\frac{\mathrm{e}^{x}-\mathrm{e}^{-x}-2x}{x-\sin x}$

[page:220]

## 第6章 微分中值定理与导数的应用

(28) $\lim_{x \to 0^{+}} \frac{\arcsin ax}{\ln \sin bx} (a > 0, b > 0)$ (29) $\lim_{x \to 0} \frac{\arccos x}{\ln \cos bx};$ (30) $\lim_{x \to 0} \frac{\mathrm{e}^{-1/x^2}}{x^{100}}$ 一一

(31) $\lim_{x \to 0^{+}} x^{x^{x}}$ (32) $\lim_{x \to \frac{\pi}{2}} \left( \cos x \right)^{\frac{\pi}{2} - x}$ (33) $\lim_{x \to 0^{+}} \left( \cot x \right)^{\frac{1}{\ln x}}$ *0.

(34) $\lim_{x \to +\infty} \left( \frac{2}{\pi} \arctan x \right)^x$ (35) $\lim_{x \to 0} \left( \frac{2}{\pi} \arccos x \right)^{\frac{1}{x}}$ (36) $\lim_{x \to 0} \left( \frac{\arcsin x}{x} \right)^{\frac{1}{x^2}}$

(37) $\lim_{x \to 1} \left( \frac{1}{\ln x} - \frac{1}{x - 1} \right)$ ; (38) $\lim_{x \to 0} \left( \frac{1}{x} - \frac{1}{\mathrm{e}^x - 1} \right)$ ; (39) $\lim_{x \to 0} \left( \frac{1}{x^2} - \frac{1}{\sin^2 x} \right)$

(40) $\lim_{x \to \infty} \frac{x - \sin x}{x + \sin x}$ (41) $\lim_{x \to 1} \frac{x - x^x}{1 - x + \ln x}$ (42) $\lim_{x \to 1^{-}} \sqrt{1 - x^{2}} \cot \left[ \frac{x}{2} \sqrt{\frac{1 - x}{1 + x}} \right];$

(43) $\lim_{x \to +\infty} \left( \frac{\ln(1 + x)}{x} \right)^{\frac{1}{x}}$

2. 验证极限 $\lim_{x \to \infty} \frac{x + \sin x}{x}$ 存在，但不能用洛必达法则

3. 验证极限 $\lim_{x \to 0} \frac{x^2 \sin \frac{1}{x}}{\sin x}$ 存在，但不能用洛必达法则

4. 讨论函数

$$f(x)=\left\{\begin{aligned}&\left[\frac{(1+x)^{\frac{1}{x}}}{\mathrm{e}}\right]^{\frac{1}{x}},&x>0,\\&\mathrm{e}^{-\frac{1}{2}},&x\leqslant0\end{aligned}\right.$$

在点 $x = 0$ 处的连续性.

5. 求证下列θ的极限:

(1） 由中值定理 $\ln(1 + x) - 0 = \frac{x}{1 + \theta x}$ ,求证 $\lim_{x \to 0} \theta = \frac{1}{2}$

(2) 由中值定理 $\mathrm{e}^{x}-1=x\mathrm{e}^{ax}$ ,求证 $\lim_{x \to 0} \theta = \frac{1}{2}$

(3) 由中值定理 $\arcsin x - 0 = \frac{x}{\sqrt{1 - \theta^{2}x^{2}}}$ ,求证 $\lim_{x \to 0} \theta = \frac{1}{\sqrt{3}}$

## 6.3泰勒公式

对于一些较复杂的函数，为了便于研究，往往希望用一些简单的函数来近似表达.由于用多项式表示的函数，只要对自变量进行有限次加、减、乘三种运算，便能求出它的函数值来，因此我们经常用多项式来近似表达函数

用微分近似函数实际上就是用一次多项式来近似函数.但是这种近似表达式还存在着不足之处.首先是精确度不高，它所产生的误差仅是关于 $x = x_{0}$ 的高阶无穷小;其次是用它来做近似计算时，不能具体估算出误差大小.因此对于精确度要求较高且需要估计误差的时候，就必须用高次多项式来近似表达函数，同时给出误差公式

于是提出如下问题:设函数 $f ( x )$ 在含有 $x_{0}$ 的开区间内充分光滑，试找出一个

[page:221]

## 6.3泰勒公式

关于 $(x - x_{0})$ 的n次多项式

$$p_{n}(x)=a_{0}+a_{1}(x-x_{0})+a_{2}(x-x_{0})^{2}+\cdots+a_{n}(x-x_{0})^{n}$$

来近似表达f(x)，要求 $p_{n}(x)$ 与 $f ( x )$ 之差是比 $(x - x_{0})^{n}$ 高阶的无穷小.

因为 $f(x) - p_n(x) = o(x - x_0)^n$ ，所以 $\lim_{x \to x_0} \left( f(x) - p_n(x) \right) = 0$ 这意味着$a_{0} = f(x_{0})$ .这时 $f(x)-p_{n}(x)=f(x)-f(x_{0})-a_{1}(x-x_{0})-a_{2}(x-x_{0})^{2}-\cdots$ $-a_{n}(x - x_{0})^{n}$ ，而

$$\frac{f(x) - p_{n}(x)}{x - x_{0}} = o(x - x_{0})^{n - 1},$$

所以

$$\begin{aligned}&\lim_{x \rightarrow x_{0}}\frac{f(x)-p_{n}(x)}{x-x_{0}} \\=&\lim_{x \rightarrow x_{0}}\left(\frac{f(x)-f(x_{0})}{x-x_{0}}-a_{1}-a_{2}(x-x_{0})-\cdots-a_{n}(x-x_{0})^{n-1}\right)=0,\end{aligned}$$

由此可得 $a_{1} = f^{\prime}(x_{0})$

由此可以按照 $f(x)$ 和 $p_{n}(x)$ 在 $\mathcal { X } _ { 0 }$ 处的函数值以及直到n阶的导数值都相等来确定 $\hat{P}_{n}$ 的系数.由此可得

$$a_{0}=f(x_{0}), \quad a_{1}=f^{\prime}(x_{0}), \quad a_{2}=\frac{1}{2!}f^{\prime\prime}(x_{0}), \quad \cdots, \quad a_{n}=\frac{1}{n!}f^{(n)}(x_{0}),$$

所以希望

$$\begin{aligned} &p_{n}(x) = f(x_{0}) + f^{\prime}(x_{0})(x - x_{0}) + \frac{1}{2!}f^{\prime\prime}(x_{0})(x - x_{0})^{2}\\ &+ \cdots + \frac{1}{n!}f^{(n)}(x_{0})(x - x_{0})^{n}\\ \end{aligned}$$

能满足要求.

## 6.3.1 皮亚诺型余项泰勒公式

定理 6.6 若函数 f(x)在点 $x _ { 0 }$ 处有n阶导数，则有

$$f(x) = f(x_0) + f'(x_0) \cdot (x - x_0) + \frac{f''(x_0)}{2!} \cdot (x - x_0)^2 \\+ \cdots + \frac{f^{(n)}(x_0)}{n!} \cdot (x - x_0)^n + R_n(x),$$

其中

$$R_{n}(x)=o(x-x_{0})^{n}, \quad x \rightarrow x_{0}.$$

证只需证明

$$\lim _ { x \rightarrow x _ { 0 } } \frac { R _ { n } ( x ) } { \left( x - x _ { 0 } \right) ^ { n } } = 0 ,$$

[page:222]

## 第6章 微分中值定理与导数的应用

即

$$\begin{aligned} &\lim_{x \rightarrow x_{0}} \frac{1}{(x - x_{0})^{n}}\left\{ f(x) - \left[ f(x_{0}) + f^{\prime}(x_{0}) \cdot (x - x_{0}) + \frac{f^{\prime\prime}(x_{0})}{2!} \cdot (x - x_{0})^{2} \right. \right.\\ &\left. \left. + \cdots + \frac{f^{(n)}(x_{0})}{n!} \cdot (x - x_{0})^{n} \right] \right\} = 0.\\ \end{aligned}$$

连续运用 $n - 1$ 次洛必达法则，再用导数定义，得

$$\begin{aligned}&\lim_{x \rightarrow x_{0}}\frac{R_{n}(x)}{(x - x_{0})^{n}} \\=& \lim_{x \rightarrow x_{0}}\frac{1}{n(x - x_{0})^{n - 1}}\left[ f^{\prime}(x) - f^{\prime}(x_{0}) - f^{\prime\prime}(x_{0})(x - x_{0}) - \cdots - \frac{f^{(n)}(x_{0})}{(n - 1)!}(x - x_{0})^{n - 1} \right] \\=& \cdots \\=& \frac{1}{n!}\lim_{x \rightarrow x_{0}}\frac{f^{(n - 1)}(x) - f^{(n - 1)}(x_{0})}{x - x_{0}} - f^{(n)}(x_{0}) \\=& 0\end{aligned}$$

于是定理得证.

定理6.6中的公式称为函数 $f ( x )$ 在点 $x _ { 0 }$ 处的n阶局部泰勒公式(或泰勒展开式），也称带皮亚诺余项的泰勒公式. $R_{n}(x)=o(x-x_{0})^{n}(x\neq x_{0})$ 称为皮亚诺余项

当 $\bar{x}_{0} = 0$ 时，泰勒公式化为

$$f(x)=f(0)+f^{\prime}(0)x+\frac{f^{\prime\prime}(0)}{2!}x^{2}+\cdots+\frac{f^{(n)}(0)}{n!}x^{n}+o(x^{n})(x\to0).$$

此式又称 $f ( x )$ 的n阶局部麦克劳林公式

通过直接计算高阶导数，可以得到如下几个常用的初等函数的麦克劳林公式

$$\mathrm{e}^{x}=1+x+\frac{x^{2}}{2!}+\frac{x^{3}}{3!}+\cdots+\frac{x^{n}}{n!}+o(x^{n})(x>0);$$

$$\sin x = x - \frac{x^{3}}{3!} + \frac{x^{5}}{5!} - \cdots + (-1)^{m-1} \frac{x^{2m-1}}{(2m-1)!} + o(x^{2m})(x \to 0);$$

$$\cos x = 1 - \frac{x^{2}}{2!} + \frac{x^{4}}{4!} - \cdots + (-1)^{m} \frac{x^{2m}}{(2m)!} + o(x^{2m+1})(x \to 0);$$

$$(1 + x)^{\alpha} = 1 + ax + \frac{\alpha(\alpha - 1)}{2!}x^{2} + \cdots + \frac{\alpha(\alpha - 1)\cdots(\alpha - n + 1)}{n!}x^{n} + o(x^{n})(x \neq 0);$$

$$\ln (1 + x) = x - \frac{x^{2}}{2} + \frac{x^{3}}{3} - \cdots + (-1)^{n-1}\frac{x^{n}}{n} + o(x^{n})(x \to 0).$$

例6.12 求极限 $\lim_{x \to 0} \frac{\cos x - \mathrm{e}^{-\frac{x^2}{2}}}{x^4}$

解 $\cos x = 1 - \frac{1}{2}x^{2} + \frac{1}{4!}x^{4} + o(x^{5})(x \to 0)$

$$\mathrm{e}^{-\frac{x^{2}}{2}}=1+\left(-\frac{x^{2}}{2}\right)+\frac{1}{2!}\left(-\frac{x^{2}}{2}\right)^{2}+o\left(x^{4}\right)$$

[page:223]

## 6.3泰勒公式

$$1 - \frac{x^{2}}{2} + \frac{x^{4}}{8} + o(x^{4}) \quad (x \to 0)$$

于是

$$\lim_{x \to 0} \frac{\cos x - \mathrm{e}^{\frac{x^2}{2}}}{x^4} = \lim_{x \to 0} \frac{-\frac{1}{12}x^4 + o(x^4)}{x^4} = -\frac{1}{12}$$

## 6.3.2 拉格朗日型余项泰勒公式

定理6.7若函数f(x)在含有点 $\mathcal { X } _ { 0 }$ 的某个开区间(a,b)内具有直到 $(n + 1)$ 阶的导数，则对任意 $x \in (a,b)$ 有

$$f(x)=f(x_{0})+f^{\prime}(x_{0})\cdot(x-x_{0})+\frac{f^{\prime\prime}(x_{0})}{2!}\cdot(x-x_{0})^{2}\\+\cdots+\frac{f^{(n)}(x_{0})}{n!}\cdot(x-x_{0})^{n}+R_{n}(x),$$

其中

$$R _ { n } ( x ) = \frac { f ^ { ( n + 1 ) } ( \xi ) } { ( n + 1 ) ! } ( x - x _ { 0 } ) ^ { n + 1 } ,$$

$\xi$ 是 $x _ { 0 }$ 与 $\mathcal { X }$ 之间的某个值.

证 $R_{n}(x)=f(x)-p_{n}(x)$ .由假设可知， $R_{n}(x)$ 在(a,b)内具有直到 $n + 1$ 阶的导数，且

$$R_{n}(x_{0}) = R_{n}^{\prime}(x_{0}) = R_{n}^{\prime\prime}(x_{0}) = \cdots = R_{n}^{(n)}(x_{0}) = 0.$$

对函数 $R_{n}(x)$ 及 $(x - x_{0})^{n + 1}$ 在以 $\mathcal { X } _ { 0 }$ 与 $\mathcal { X }$ 为端点的区间上应用柯西中值定理，得

$$\frac{R_{n}(x)}{(x - x_{0})^{n + 1}} = \frac{R_{n}(x) - R_{n}(x_{0})}{(x - x_{0})^{n + 1} - 0} = \frac{R_{n}^{\prime}(\xi_{1})}{(n + 1)(\xi_{1} - x_{0})^{n}},$$

其中 $\xi _ { 1 }$ 为 $x _ { 0 }$ 与 $\mathcal { X }$ 之间的某个值.再对两个函数 $R_{n}^{\prime}(x)$ 及 $(n + 1)(x - x_{0})^{n}$ 在以 $x_{0}$及 $\xi _ { 1 }$ 为端点的区间上应用柯西中值定理，得

$$\frac{R_{n}^{\prime}(\xi_{1})}{(n + 1)(\xi_{1} - x_{0})^{n}} = \frac{R_{n}^{\prime}(\xi_{1}) - R_{n}^{\prime}(x_{0})}{(n + 1)(\xi_{1} - x_{0})^{n} - 0} = \frac{R_{n}^{\prime}(\xi_{2})}{n(n + 1)(\xi_{2} - x_{0})^{n - 1}},$$

其中 $\xi _ { 2 }$ 为 $x_{0}$ 与 $\xi _ { 1 }$ 之间的某个值.

照此方法继续做下去，经过(n十1)次后，得

$$\frac{R_{n}(x)}{(x - x_{0})^{n + 1}} = \frac{R_{n}^{(n + 1)}(\xi)}{(n + 1)!},$$

因为 $\xi \in (x_0, \xi_n)$ ，因而 $\xi \in (x_0,x)$ a

注意到 $R_{n}^{(n + 1)}(x) = f^{(n + 1)}(x)$ ,可得

$$R_{n}(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-x_{0})^{n+1}.$$

[page:224]

## 第6章 微分中值定理与导数的应用

定理证毕.

定理6.7中的公式称为函数 $f ( x )$ 在点 $x _ { 0 }$ 处的带拉格朗日余项的泰勒公式. $R_{n}(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-x_{0})^{n+1}$ 称为拉格朗日型余项

当 $x_{0} = 0$ 时，泰勒公式化为

$$f(x)=f(0)+f^{\prime}(0)x+\frac{f^{\prime\prime}(0)}{2!}x^{2}+\cdots+\frac{f^{(n)}(0)}{n!}x^{n}+\frac{f^{(n+1)}(\theta x)}{(n+1)!}x^{n+1}, \quad 0<\theta<1.$$

此式又称 $f ( x )$ 的拉格朗日型余项的麦克劳林公式

当 $n { = } 0$ 时，泰勒公式变为拉格朗日中值公式

由泰勒公式知，以多项式 $p_{n}(x)$ 近似表达函数 $f ( x )$ 时，其误差为 $| R_n (x) |$ .如果对于某个固定的n，当 $x \in (a,b)$ 时， $\left| f^{(n+1)}(x) \right| \leq M$ ，则有估计式

$$\left| R _ { n } ( x ) \right| \leqslant \frac { M } { ( n + 1 ) ! } \left| x - x _ { 0 } \right| ^ { n + 1 }$$

通过直接计算高阶导数，可以得到如下几个常用的初等函数的麦克劳林公式

$$\mathrm{e}^{x}=1+x+\frac{x^{2}}{2!}+\frac{x^{3}}{3!}+\cdots+\frac{x^{n}}{n!}+\frac{\mathrm{e}^{\theta x}}{(n+1)!}x^{n+1}(0<\theta<1);$$

$$\sin x = x - \frac{x^{3}}{3!} + \frac{x^{5}}{5!} - \cdots + (-1)^{m - 1}\frac{x^{2m - 1}}{(2m - 1)!} + (-1)^{m}\frac{\cos \theta x}{(2m + 1)!}.x^{2m + 1}$$

$(0 < \theta < 1)$

$$\cos x = 1 - \frac{x^{2}}{2!} + \frac{x^{4}}{4!} - \cdots + (-1)^{m} \frac{x^{2m}}{(2m)!} + (-1)^{m+1} \frac{\cos \theta x}{(2m+2)!} x^{2m+2}$$

$(0 < \theta < 1)$

$$\begin{align*}(1 + x)^{n} = & 1 + ax + \frac{a(a - 1)}{2!}x^{2} + \cdots + \frac{a(a - 1)\cdots(a - n + 1)}{n!}x^{n} \\& + \frac{a(a - 1)\cdots(a - n + 1)(a - n)}{(n + 1)!}(1 + \theta x)^{n - n - 1}x^{n + 1}(0 < \theta < 1);\end{align*}$$

$$\ln \left( 1 + x \right) = x - \frac{x^{2}}{2} + \frac{x^{3}}{3} - \cdots + \left( - 1 \right)^{n - 1}\frac{x^{n}}{n} + \frac{\left( - 1 \right)^{n}}{\left( n + 1 \right)\left( 1 + \theta x \right)^{n + 1}}x^{n + 1}$$

$$(0 < \theta < 1)$$

例6.13 试用拉格朗日型余项的泰勒公式求e的近似值，并估计误差.

解 $\mathrm{e}^{x}=1+x+\frac{x^{2}}{2!}+\frac{x^{3}}{3!}+\cdots+\frac{x^{n}}{n!}+\frac{\mathrm{e}^{\theta x}}{(n+1)!}x^{n+1}, \quad 0<\theta<1,$

由此可知，若令

$$\mathrm{e}^{x} \approx 1 + x + \frac{x^{2}}{2!} + \frac{x^{3}}{3!} + \cdots + \frac{x^{n}}{n!},$$

则产生的误差为

$$\left| R _ { n } ( x ) \right| = \left| \frac { \mathrm { e } ^ { \theta x } } { ( n + 1 ) ! } x ^ { n + 1 } \right| < \frac { \mathrm { e } ^ { | x | } } { ( n + 1 ) ! } \left| x \right| ^ { n + 1 } , \quad 0 < \theta < 1.$$

[page:225]

## 6.3泰勒公式

如果取x=1，则得无理数e的近似式

$$\mathrm{e} \approx 1 + 1 + \frac{1}{2!} + \cdots + \frac{1}{n!}$$

其误差

$$\left| R_{n} \right| < \frac{\mathrm{e}}{(n + 1)!} < \frac{3}{(n + 1)!}.$$

当n=10时，可算出e≈2.718282，其误差不超过 $10^{ 一 6}$

## 习题6.3

1. 按(x-4)的幂展开多项式 $f(x)=x^{4}-5x^{3}+x^{2}-3x+4.$

2. 应用麦克劳林公式，按x的幂展开函数 $f(x) = (x^2 - 3x + 1)^3$

3. 求函数 $f(x) = \sqrt{x}$ 按(x一4)的幂展开的带有拉格朗日型余项的3阶泰勒公式.

4. 求函数 f(x)=lnx按(x—2)的幂展开的带有皮亚诺型余项的 n阶泰勒公式.

5. 求函数 $f(x) = \frac{1}{x}$ 按(x+1)的幂展开的带有拉格朗日型余项的n阶泰勒公式

6. 求函数 f(x)=tanx的带有皮亚诺型余项的 3 阶麦克劳林公式.

7. 求函数 $f(x) = x \mathrm{e}^{x}$ 的带有皮亚诺型余项的n阶麦克劳林公式.

8. 利用已知的展开式求下列函数的局部麦克劳林展式:(1) $x \mathrm{e}^{x} :$ (2) $\operatorname { c h } x ;$ (3) $\ln \frac{1 + x}{1 - x}$ (4) $\operatorname { c o s } ^ { 2 } \bar { \mathcal { X } } ;$ (5) $\frac{x^{3}+2x+1}{x-1}$ ； (6) $\cos x^{2}$

9. 求 arcsinx的局部麦克劳林展式.

10.写出下列函数的局部麦克劳林公式至所指阶数:

(1) $\mathrm{e}^{x} \cos x \left( x^{4} \right)$ ;(2) $\arctan x(x^{3})$

(3) $\sin(\sin x)(x^{3})$ (4) $\frac{x}{2x^{3}+x-1}\left(x^{3}\right)$

(5) $\frac{1 + x + x^{2}}{1 - x + x^{2}} \left( x^{1} \right)$ ;(6) $\frac{x^{2}}{\sqrt{1 - x + x^{2}}}\left( x^{4} \right)$

11. 利用泰勒公式求下列极限:

(1) $\lim_{x \to +\infty} \left( \sqrt[3]{x^3 + 3x^2} - \sqrt[4]{x^4 - 2x^3} \right)$ ; (2) $\lim_{x \to 0} \frac{\cos x - \mathrm{e}^{-\frac{x^2}{2}}}{x^2[x + \ln(1 - x)]};$

(3) $\frac{1 + \frac{1}{2}x^{2} - \sqrt{1 + x^{2}}}{\left( \cos x - \mathrm{e}^{x^{2}} \right)\sin x^{2}}$ (4) $\lim_{x \to 0} \frac{a^x + a^{-x} - 2}{x^2} (a > 0)$

[page:226]

## 第6章 微分中值定理与导数的应用

$$\lim_{x \to 0} \frac{\ln(1 + x + x^2) + \ln(1 - x + x^2)}{x \sin x}; \quad (6) \lim_{x \to 0} \frac{e^{x^3} - 1 - x^3}{\sin^6 2x};$$

(7) $\lim_{x \to 0} \left( \frac{1}{x} - \frac{1}{\sin x} \right)$

12. 设 $f^{\prime\prime}(x_0)$ 存在，证明

$$\lim_{h \to 0} \frac{f(x_0 + h) + f(x_0 - h) - 2f(x_0)}{h^2} = f'(x_0).$$

13. 设 $f^{(n)}(x_0)$ 存在，且 $f(x_{0}) = f^{\prime}(x_{0}) = \cdots = f^{(n)}(x_{0}) = 0$ ，证明

$$f(x) = o[(x - x_0)^n] \quad (x \to x_0).$$

14. 试确定常数a和b，使 $f(x) = x - (a + b\cos x)\sin x$ 为当 $x \rightarrow 0$ 时关于x的5阶无穷小.

15. 设对 $\forall x \in (a,b)$ ,有 $f^{\prime\prime}(x) > 0$ ,求证 $\forall x_{i} \in (a,b), i = 1,2,\cdots,n$ ，都有

$$f\left( \frac{x_{1} + x_{2} + \cdots + x_{n}}{n} \right) \leqslant \frac{1}{n}\sum_{i = 1}^{n}f(x_{i}),$$

且等号仅在 $x_{i}(i = 1,2,\cdots,n)$ 都相等时才成立

16. 设函数 $f(x) = -\ln x$ ，求证:当 $x > 0$ 时， $f^{\prime\prime}(x) > 0$ ;当 $x_{i}>0(i=1,2,\cdots,n)$ 时，有

$$\frac{n}{\frac{1}{x_{1}} + \frac{1}{x_{2}} + \cdots + \frac{1}{x_{n}}} \leqslant \sqrt[n]{x_{1}x_{2}\cdots x_{n}} \leqslant \frac{x_{1} + x_{2} + \cdots + x_{n}}{n}.$$

## 6.4 函数的单调性与曲线的凹凸性

## 6.4.1函数单调性的判别法

如果函数 $y = f(x)$ 在某个区间上单调递增(单调递减)，那么它的图形是一条沿x轴正向上升(下降)的曲线.如果曲线具有切线的话，则切线的斜率是非负的(是非正的)，即 $y^{\prime}=f^{\prime}(x) \geqslant 0(y^{\prime}=f^{\prime}(x) \leqslant 0)$ .于是可以猜想是否可用导数的符号来判断函数的单调性(图6.4).

定理6.8设函数 $f(x)$ 在闭区间 $\left[ a,b \right]$ 上连续，在开区间 $(a,b)$ 内可微，则

(1)若在(a,b)内 $f^{\prime}(x) > 0$ ,则 $f ( x )$ 在 $\left[ a , b \right]$ 上单调递增；

(2) 若在 $(a,b)$ 内 $f^{\prime}(x) < 0$ ,则 $f(x)$ 在 $\left[ a , b \right]$ 上单调递减.

[page:227]

## 6.4函数的单调性与曲线的凹凸性

证（1）在 $\left[ a , b \right]$ 上任取两点 $x _ { 1 } < x _ { 2 }$ ，由拉格朗日中值定理知，存在一点$\xi \in (x_1, x_2)$ ,使得

$$f(x_{2}) - f(x_{1}) = f^{\prime}(\xi) \cdot (x_{2} - x_{1}).$$

由 $f^{\prime}(\xi)>0,x_{2}-x_{1}>0$ 知 $f(x_{2}) - f(x_{1}) > 0$ ,即

$$f(x_{1}) < f(x_{2}).$$

因此 f(x)在 $[ a , b ]$ 上单调递增.

(2) 的证明类似.

注6.6对于其他类型的区间，如 $(a,b),[a,b),(a,b],(a,+\infty),[a,+\infty)$ $( - \infty , b ] , ( - \infty , b ) , ( - \infty , + \infty )$ 等，有相应类似的结论

例6.14讨论函数 $f(x) = \mathrm{e}^{x}$ 在区间 $( - \infty , + \infty )$ 内的单调性.

解因为

$$f^{\prime}(x) = \mathrm{e}^{x} > 0, \quad \forall x \in (-\infty, +\infty),$$

所以由定理6.8知， $f(x) = \mathrm{e}^{x}$ 在 $( - \infty , + \infty )$ 内单调递增.

例6.15 指出函数 $f(x)=\frac{1}{3}x^{3}-x^{2}+\frac{1}{3}$ 的单调区间.

解 $f(x)$ 的定义域为 $( - \infty , + \infty )$ ，且在 $( - \infty , + \infty )$ 内有

$$f^{\prime}(x) = x^{2} - 2x = x(x - 2).$$

令 $f^{\prime}(x) = 0$ ，解出 $x = 0,2.$ 在区间 $( - \infty , 0 )$ 内 $f^{\prime}(x) > 0$ ，所以 $f(x)$ 单调递增；在区间 $(0,2)$ 内 $f^{\prime}(x) < 0$ ，所以 $f ( x )$ 单调递减；在区间 $( 2 , + \infty )$ 内， $f^{\prime}(x) > 0$ ，所以$f ( x )$ 单调递增.

例6.16 讨论函数 $y = \sqrt[3]{x^{2}}$ 的单调性.

解 $f ( x )$ 的定义域为 $( - \infty , + \infty )$

当 $x \neq 0$ 时，此函数的导数为

$$y^{\prime} = \frac{2}{3\sqrt[3]{x}},$$

在区间 $( - \infty , 0 )$ 内 $f^{\prime}(x) < 0$ ，所以 $f ( x )$ 单调递减；在区间 $( 0 , + \infty )$ 内 $f^{\prime}(x) > 0$ ，所以 $f ( x )$单调递增(图6.5).

注6.7如果函数在其定义区间上连续，除去有限个导数不存在的点外，导数存在且连续，那么只要用方程 $f^{\prime}(x) = 0$ 的根及 $f^{\prime}(x)$ 不存在的点来划分函数 $f(x)$ 的定义区间，就可以保证 $f^{\prime}(x)$ 在各个部分区间内保持定号，因而函数在各个部分区间上单调.

注6.8 定理6.8只给出了一个函数在某区间上单调的充分条件，而不是必

[page:228]

## 第6章 微分中值定理与导数的应用

要条件.例如，对于函数 $f(x) = x^{3}$ ,有 $f^{\prime}(x) = 3x^{2}$ .当 $x = 0$ 时 $f^{\prime}(x) = 0$ ，但是，$f(x) = x^{3}$ 在整个区间 $( - \infty , + \infty )$ 内单调上升.又例如，对于函数 $f(x) = x^{\frac{1}{3}}$ 来说，当 $x \neq 0$ 时，有

$$f^{\prime}(x)=\frac{1}{3}\cdot\frac{1}{\sqrt[3]{x^{2}}}>0,$$

但在 $x = 0$ 处 $f ( x )$ 不可导，然而 $f\left(x\right)=x^{\frac{1}{3}} 在 \left(-\infty,+\infty\right)$ 内单调递增(图6.6).

由此可见，若 $f ( x )$ 在某区间内连续，只在某几个孤立点处的导数为0或不存在，而在其他点处，有 $f^{\prime}(x) > 0$ (或 $f^{\prime}(x) < 0$ ，则仍可断定 $f(x)$ 在此区间内单调递增(或单调递减).

例6.17证明:当 $x \neq 0$ 时，有不等式$\mathrm{e}^{x}>1+x$

证设 $f(x) = \mathrm{e}^{x} - 1 - x$ ，只需证明:当$x \neq 0$ 时，有 $f(x) > 0$

因为 $f^{\prime}(x) = \mathrm{e}^{x} - 1$ ，则在 $( = \infty , 0 )$

$f^{\prime}(x) < 0, f(x)$ 单调递减；在 $(0, +\infty)$ 内， $f^{\prime}(x)>0,f(x)$ 单调递增.所以 $f(0) = 0$是函数 $f ( x )$ 的最小值，所以当 $x \neq 0$ 时，有

$$f(x) > f(0) = 0,$$

即

$$\mathrm{e}^{x}>1+x,$$

如图6.7所示.

例6.18证明:当 $x \in \left(0, \frac{\pi}{2}\right)$ 时，有不等式$\frac{2}{\pi}x < \sin x < x.$

证已证明过不等式

$$\sin x < x < \tan x, \quad x \in \left(0, \frac{\pi}{2}\right).$$

所以只需证明

$$\frac{2}{\pi}x < \sin x, \quad x \in \left(0, \frac{\pi}{2}\right),$$

或

$$\frac{\pi}{2} \cdot \frac{\sin x}{x} > 1, \quad x \in \left( 0, \frac{\pi}{2} \right).$$

令

$$f(x) = \frac{\pi}{2} \cdot \frac{\sin x}{x},$$

[page:229]

## 6.4函数的单调性与曲线的凹凸性

则

$$f^{\prime}(x) = \frac{\pi}{2} \cdot \frac{\cos x}{x^{2}}(x - \tan x),$$

所以，当 $x \in \left( 0, \frac{\pi}{2} \right)$ 时

$$f^{\prime}(x) < 0.$$

从而有

$$f(x) > f\left(\frac{\pi}{2}\right) = 1, \quad x \in \left(0, \frac{\pi}{2}\right).$$

## 6.4.2 曲线的凹凸性与拐点

从几何上看到，在有的曲线弧上，如果任取两点，则联接这两点间的弦总位于这两点间的弧段的上方，而有的曲线弧，则正好相反.曲线的这种性质就是曲线的凹凸性(图6.8).

定义6.1设f(x)在区间I上连续，如果对I上任意两点 $\mathcal { X } _ { 1 } \mathbin { \ast } \mathcal { X } _ { 2 }$ ，恒有

$$f\left(\frac{x_{1}+x_{2}}{2}\right)<\frac{f(x_{1})+f(x_{2})}{2},$$

则称 $f ( x )$ 在Ⅰ上的图形是(向上)凹的(或凹弧)；如果恒有

图6.8

$$f\left(\frac{x_{1}+x_{2}}{2}\right)>\frac{f(x_{1})+f(x_{2})}{2},$$

则称 $f(x)$ 在I上的图形是(向上)凸的(或凸弧)(图6.9).

[page:230]

## 第6章 微分中值定理与导数的应用

可以用二阶导数的符号来判断曲线的凹凸性

定理6.9 设函数 $f ( x )$ 在闭区间 $\left[ a , b \right]$ 上连续，在开区间 $(a,b)$ 内具有一阶和二阶导数，那么

(1) 若在 $(a,b)$ 内 $f^{\prime\prime}(x) > 0$ ,则 $f ( x )$ 在 $[ a , b ]$ 上的图形是凹的；

(2) 若在(a,b)内 $f^{\prime\prime}(x) < 0$ ,则f(x)在 $\left[ a , b \right]$ 上的图形是凸的.

证（1）在 $\left[ a , b \right]$ 上任取两点 $x _ { 1 } < x _ { 2 }$ ，记 $\frac{x_{1} + x_{2}}{2} = x_{0}$ ，并记 $x_{2}-x_{0}=x_{0}-x_{1}$ $= h$ ,则 $x_{1}=x_{0}-h,x_{2}=x_{0}+h$ ，由拉格朗日中值定理知

$$f(x_{0}+h)-f(x_{0})=f^{\prime}(x_{0}+\theta_{1}h)h,$$

$$f(x_{0}) - f(x_{0} - h) = f^{\prime}(x_{0} - \theta_{2}h)h,$$

其中 $0 < \theta_{1} < 1 ; 0 < \theta_{2} < 1$ .两式相减，得

$$f(x_{0}+h)+f(x_{0}-h)-2f(x_{0})=\left[f^{\prime}(x_{0}+\theta_{1}h)-f^{\prime}(x_{0}-\theta_{2}h)\right]h.$$

对 $f ^ { \prime } ( x )$ 在区间 $\left[ x _ { 0 } - \theta _ { 2 } h , x _ { 0 } + \theta _ { 1 } h \right]$ 上再次利用拉格朗日中值公式，得

$$\left[ f ^ { \prime } \left( x _ { 0 } + \theta _ { 1 } h \right) - f ^ { \prime } \left( x _ { 0 } - \theta _ { 2 } h \right) \right] h = f ^ { \prime \prime } \left( \xi \right) \left( \theta _ { 1 } + \theta _ { 2 } \right) h ^ { 2 } ,$$

其中 $x_{0}-\theta_{2}h<\xi<x_{0}+\theta_{1}h$ 由假定知 $f^{\prime\prime}(\xi) > 0$ ,故有

$$f(x_{0}+h)+f(x_{0}-h)-2f(x_{0})>0,$$

即

$$f\left(\frac{x_{1}+x_{2}}{2}\right)<\frac{f(x_{1})+f(x_{2})}{2},$$

所以f(x)在 $[ a , b ]$ 上的图形是凹的.

(2) 的证明类似.

注6.9 对于其他类型的区间，如 $(a,b),[a,b),(a,b],(a,+\infty),[a,+\infty)$ $( - \infty , b ] , ( - \infty , b ) , ( - \infty , + \infty )$ 等，有相应类似的结论

例6.19 判定曲线 $y = \ln x$ 的凹凸性.

解因为 $y^{\prime} = \frac{1}{x}, y^{\prime\prime} = -\frac{1}{x^2}$ ，所以在 $y = \ln x$ 的定义域 $( 0 , + \infty )$ 内 $y'' < 0$ ,曲线$y = \ln x$ 是凸的.

例6.20判定曲线 $y = x^{3}$ 的凹凸性.

解因为 $y^{\prime} = 3x^{2} , y^{\prime\prime} = 6x$ ，所以当 $x { \leqslant } 0$ 时 $y'' < 0$ ，所以曲线在 $( - \infty , 0 ]$ 内是凸弧；当 $x > 0$ 时 $y ^ { \prime \prime } > 0$ ，所以曲线在 $[ 0 , + \infty )$ 内是凹弧.

一般地，设 $y = f(x)$ 在区间I上连续， $\mathcal { X } _ { 0 }$ 是Ⅰ的内点.如果曲线 $y = f(x)$ 在经过点 $(x_{0},f(x_{0}))$ 时，曲线的凹凸性改变了，就称点 $(x_{0},f(x_{0}))$ 为曲线的拐点

例6.21求曲线 $f(x)=\frac{1}{3}x^{3}-x^{2}+\frac{1}{3}$ 的凹凸区间及拐点

[page:231]

## 6.4 函数的单调性与曲线的凹凸性

解 $f^{\prime}(x)=x^{2}-2x,f^{\prime\prime}(x)=2x-2=2(x-1)$ ，所以当 $x \in ( - \infty,1)$ 时，$f^{\prime\prime}(x) < 0$ ，曲线在 $( - \infty , 1 ]$ 内是凸弧；当 $x \in (1, +\infty)$ 时， $f^{\prime\prime}(x) > 0$ ，曲线在$[ 1 , + \infty )$ 内是凹弧.于是 $\left(1,-\frac{1}{3}\right)$ 是曲线的拐点.

例6.22求曲线 $f(x) = x^{4}$ 的凹凸区间及拐点.

解 $f^{\prime}(x) = 4x^{3}, f^{\prime\prime}(x) = 12x^{2}$ ，所以除 $x = 0$ 外，都有 $f^{\prime\prime}(x) > 0$ ，曲线在整个定义域 $( = 0 0 , + \infty )$ 内是凹弧，没有拐点

例6.23 求曲线 $y = \sqrt[3]{x}$ 的凹凸区间及拐点.

解当 $x \neq 0$ 时，

$$y^{\prime} = \frac{1}{3\sqrt[3]{x^{2}}}, \quad y^{\prime\prime} = -\frac{2}{9x\sqrt[3]{x^{2}}},$$

在 $( - \infty , 0 )$ 内 $y ^ { \prime \prime } > 0$ ，曲线在 $( - \infty , 0 ]$ 上是凹弧；在 $( 0 , + \infty )$ 内 $y ^ { \prime \prime } < 0$ ，曲线在$[ 0 , + \infty )$ 上是凸弧.(0,O)是拐点.

## 习题6.4

1. 判定函数 $f(x) = \arctan x - x$ 的单调性.

2. 判定函数 $f(x) = x + \cos x \quad (0 \leqslant x \leqslant 2\pi)$ 的单调性.

3. 求下列函数的单调性区间与极值点:

(1) $f(x) = 3x^{2} - x^{3}$ ; (2) $f(x) = x - \ln(1 + x)$ ； (3) $f(x)=a-b(x-c)^{\frac{2}{3}}(a>0,b>0)$ **

(4) $f(x) = x - \mathrm{e}^{x}$ (5) $f(x) = \sqrt{x} \ln x$

4. 求下列函数的极值点与极值:

(1) $y = x + a^{2} / x;$ (2) $y = x \mathrm{e}^{-x}$ ;(3) $y = \frac{1}{x} \ln^2 x.$

5. 确定下列函数的单调区间:

(1) $y=2x^{3}-6x^{2}-18x-7$ (2) $y=2x+\frac{8}{x}(x>0)$

(3) $y=\frac{10}{4x^{3}-9x^{2}+6x};$ (4) $y = \ln(x + \sqrt{1 + x^2})$

(5) $y = (x - 1)(x + 1)^{3}$ (6) $y = \sqrt[3]{(2x - a)(a - x)^{2}} (a > 0)$

(7) $y = x^{n} \mathrm{e}^{-x} \quad (n > 0, x \geqslant 0)$ ; (8) $y = x + \left| \sin 2x \right|$

6.证明下列不等式:

[page:232]

## 第6章 微分中值定理与导数的应用

(1) 当 $x > 0$ 时 $1+\frac{1}{2}x>\sqrt{1+x}$

(2) 当 $x > 0$ 时 $1+x\ln(x+\sqrt{1+x^{2}})>\sqrt{1+x^{2}}$

(3)当 $0<x<\frac{\pi}{2}$ 时 $\sin x + \tan x > 2x;$

(4) 当 $0 < x < \frac { \pi } { 2 }$ 时， $\tan x > x + \frac{1}{3}.x^{3}$

(5)当 $x > 4$ 时 $2 ^ { x } > x ^ { 2 }$ ;

(6)当 $0<x_{1}<x_{2}<\frac{\pi}{2}$ 时， $\frac{\tan x_{2}}{\tan x_{1}} > \frac{x_{2}}{x_{1}}$

(7) 当 $x > > 0$ 时 $\ln(1 + x) > \frac{\arctan x}{1 + x}$

(8) 当 $\mathrm{e} < a < b < \mathrm{e}^{2}$ 时 $\ln ^{2}b-\ln ^{2}a>\frac{4}{\mathrm{e}^{2}}(b-a)$

(9)当 $x > > 0$ 时 $x>\ln(1+x)>x-\frac{1}{2}x^{2}$

(10)当 $x \neq 0$ 时 $\frac{{\mathrm{e}}^{x}+{\mathrm{e}}^{-x}}{2}>1+\frac{x^{2}}{2}$

(11) 当 $x \in \left(0, \frac{\pi}{2}\right)$ 时 $2x < \sin x + \tan x;$

(12)当 $x > 0$ 时 $\sin x > x - \frac{1}{6}x^{3}$

7. 讨论方程 $\ln x = a x (a > 0)$ 有几个实根?

8. 判定下列曲线的凹凸性:

(1) $y = 4x - x^{2} ; \quad (2) y =  sh x ;$

(3) $y=x+\frac{1}{x}(x>0)$ ; (4) $y = x \arctan x.$

9. 求下列函数图形的拐点及凹或凸的区间:

(1) $y = x^{3} - 5x^{2} + 3x + 5; \quad (2) y = x\mathrm{e}^{-x};$

(3) $y = (x + 1)^{4} + \mathrm{e}^{x}; \quad (4) y = \ln(x^{2} + 1)$

(5) $y = \mathrm{e}^{\arctan x} ; \quad (6) y = x^{4}(12\ln x - 7)$

(7) $y = 3x^{2} - x^{3}$ (8) $y = x + \frac{x}{x^{2} - 1}$

(9) $y = \sqrt{1 + x^{2}}$

10.利用函数图形的凹凸性，证明下列不等式:

(1) $\frac{1}{2}\left(x^{n}+y^{n}\right)>\left(\frac{x+y}{2}\right)^{n}(x>0,y>0,x\neq y,n>1)$

(2) $\frac{\mathrm{e}^{x}+\mathrm{e}^{y}}{2}>\mathrm{e}^{\frac{x+y}{2}}(x\neq y)$

(3) $x\ln x+y\ln y>(x+y)\ln\frac{x+y}{2}(x>0,y>0,x\ne y).$

11. 试证明:曲线 $y=\frac{x-1}{x^{2}+1}$ 有三个拐点位于同一直线上

[page:233]

## 6.5 函数的极值与最大值最小值

12.问 $a ; b$ 为何值时，点(1,3)为曲线 $y = a x ^ { 3 } + b x ^ { 2 }$ 的拐点？

13. 试决定曲线 $y=ax^{3}+bx^{2}+cx+d$ 中的 $a , b , c , d ,$ 使得 $x = - 2$ 处曲线有水平切线，(1，—10)为拐点，且点 $( = 2, 44 )$ 在曲线上.

14. 试决定 $y = k(x^{2} - 3)^{2}$ 中k的值，使曲线的拐点处的法线通过原点

15. 设 $y = f(x)$ 在 $x = x_{0}$ 的某邻域内具有三阶连续导数，如果 $f^{\prime\prime}(x_0) = 0$ ，且 $f'''(x_0) \ne 0$ ,试问 $(x_{0},f(x_{0}))$ 是否为拐点？为什么？

## 6.5 函数的极值与最大值最小值

## 6.5.1 函数的极值及其求法

定义6.2 设函数 $f(x)$ 在点 $\mathcal { X } _ { 0 }$ 的某邻域 $U(x_{0})$ 内有定义，如果对于去心邻域$\mathcal { O } ( x _ { 0 } )$ 内的任意x，有

$$f(x) < f(x_0) \quad  或  \quad f(x) > f(x_0)),$$

就称 $f(x_{0})$ 是函数 $f ( x )$ 的一个极大值(或极小值).

函数的极大值与极小值统称为函数的极值，使函数取得极值的点称为极值点

由费马引理知，如果函数 $f ( x )$ 在 $\mathcal { X } _ { 0 }$ 处可导，且 $f(x)$ 在 $\mathcal { X } _ { 0 }$ 处取得极值，则$f^{\prime}(x_0) = 0$ 这是可导函数取得极值的必要条件.使得 $f^{\prime}(x_0) = 0$ 的 $x _ { 0 }$ 称为驻点，则可说可导函数的极值点必为驻点.但反过来，函数的驻点却不一定是极值点.例如， $x = 0$ 是 $f(x) = x^{3}$ 的驻点，却不是极值点.另外，函数在它的导数不存在的点处也可能取得极值.例如 $f(x) = \left| x \right|$ 在 $x = 0$ 处取得极小值.

定理6.10(第一充分条件) 设函数 $f ( x )$ 在 $\mathcal { X } _ { 0 }$ 处连续，且在 $\mathcal { X } _ { 0 }$ 的某去心邻域$\stackrel{\circ}{U}(x_{0},\delta)$ 内可导.

(1) 若 $x \in (x_0 - \delta, x_0)$ 时， $f^{\prime}(x) > 0$ ,而 $x \in (x_0, x_0 + \delta)$ 时， $f^{\prime}(x) < 0$ ,则 $f ( x )$在 $\mathcal { X } _ { 0 }$ 处取得极大值；

(2) 若 $x \in (x_0 - \delta, x_0)$ 时 $f^{\prime}(x) < 0$ ;而 $x \in (x_0, x_0 + \delta)$ 时 $f^{\prime}(x) > 0$ ,则 $f ( x )$在 $\mathcal { X } _ { 0 }$ 处取得极小值；

(3) 若 $x \in \mathring{U}(x_0, \delta)$ 时 $f^{\prime}(x)$ 的符号保持不变，则 $f(x)$ 在 $\mathcal { X } _ { 0 }$ 处没有极值(图6.10).

证（1）根据函数单调性的判别法，函数 $f ( x )$ 在 $(x_{0} - \delta, x_{0}]$ 内单调递增，而在 $\left[ x _ { 0 } , x _ { 0 } + \delta \right)$ 内单调递减.所以 $x \in \mathring{U}(x_0, \delta)$ 时，总有 $f(x) < f(x_0), f(x)$ 在 $x _ { 0 }$ 处取得极大值.

(2)，(3)的证明类似.

例6.24求 $f(x)=\frac{1}{3}x^{3}-x^{2}+\frac{1}{3}$ 的极值.

[page:234]

## 第6章 微分中值定理与导数的应用

解令 $f^{\prime}(x) = x^{2} - 2x = x(x - 2) = 0$ ，得两个驻点

$$x_{1} = 0, \quad x_{2} = 2.$$

在 $( - \infty , 0 )$ 内 $y ^ { \prime } > 0$ ,在(0,2)内 $y^{\prime} < 0$ ，所以 $f(0)=\frac{1}{3}$ 为极大值；又因在 $(2, +\infty)$内 $y ^ { \prime } > 0$ ，所以 $f(2)=-1$ 为极小值.

例6.25求 $f(x) = (x - 1)\sqrt[3]{x^{2}}$ 的极值.

解当 $x \neq 0$ 时，有

$$f^{\prime}(x)=\sqrt[3]{x^{2}}+(x-1)\cdot\frac{2}{3}x^{-1/3}=\frac{5x-2}{3\sqrt[3]{x}},$$

所以可得一驻点 $x \equiv 2/5$ ，且知 $x = 0$ 为导数不存在的点.

在 $( - \infty , 0 )$ 内 $f^{\prime}(x) > 0$ ，在 $\left(0,\frac{2}{5}\right)$ 内 $f^{\prime}(x) < 0$ ,所以 $f(0) = 0$ 为极大值；又因在 $( \frac{2}{5}, + \infty )$ 内 $f^{\prime}(x) > 0$ ,所以 $f\left(\frac{2}{5}\right)=-\frac{3}{25}\sqrt[3]{20}$ 为极小值.

定理6.11(第二充分条件） 设函数 $f(x)$ 在 $x_{0}$ 处具有二阶导数，且 $f^{\prime}(x_{0}) =$ $0,f^{\prime\prime}(x_0) \neq 0$ ,那么

(1) 当 $f^{\prime\prime}(x_0) < 0$ 时， $f(x)$ 在 $x_{0}$ 处取得极大值；

(2) 当 $f^{\prime\prime}(x_0) > 0$ 时， $f(x)$ 在 $x_{0}$ 处取得极小值.

证（1）由于

$$f^{\prime\prime}(x_0) = \lim_{x \to x_0} \frac{f^{\prime}(x) - f^{\prime}(x_0)}{x - x_0} < 0,$$

[page:235]

## 6.5 函数的极值与最大值最小值

根据函数极限的局部保号性，当x在 $x_{0}$ 的足够小的去心邻域内，

$$\frac{f^{\prime}(x) - f^{\prime}(x_0)}{x - x_0} < 0,$$

即

$$\frac{f^{\prime}(x)}{x - x_{0}} < 0.$$

因此，在 $\mathcal { X } _ { 0 }$ 的左去心邻域内， $f^{\prime}(x) > 0$ ，在 $x _ { 0 }$ 的右去心邻域内， $f^{\prime}(x) < 0$

根据函数单调性的判别法，函数 $f(x)$ 在 $\left( x _ { 0 } - \delta , x _ { 0 } \right]$ 内单调递增，而在$\left[ x _ { 0 } , x _ { 0 } + \delta \right)$ 内单调递减，所以 $x \in \mathring{U}(x_0, \delta)$ 时，总有 $f(x) < f(x_0), f(x)$ 在 $x_{0}$ 处取得极大值.

(2)的证明类似.

例6.26求 $f(x)=\frac{1}{3}x^{3}-x^{2}+\frac{1}{3}$ 的极值.

解令 $f^{\prime}(x) = x^{2} - 2x = x(x - 2) = 0$ ，得两个驻点

$$x_{1} = 0, \quad x_{2} = 2.$$

函数的极值

又因为 $f^{\prime\prime}(x) = 2x - 2$ ,所以 $f^{\prime\prime}(0)=-2<0,f(0)=\frac{1}{3}$ 为极大值； $f^{\prime\prime}(2) = 2 > 0$

$f(2)=-1$ 为极小值.

例6.27求 $f(x) = (x^2 - 1)^3 + 1$ 的极值.

解 $f^{\prime}(x) = 6x(x^{2} - 1)^{2}$

令 $f^{\prime}(x) = 0$ ，解得驻点 $x_{1} = - 1,x_{2} = 0,x_{3} = 1$ .又因

$$f^{\prime\prime}(x) = 6(x^2 - 1)(5x^2 - 1)$$

有 $f^{\prime\prime}(0) = 6 > 0$ ,故 $f(0) = 0$ 为极小值.在 $x_{1} = - 1$ 的小的去心邻域内， $f^{\prime}(x) < 0$ 保持定号，所以 $x_{1} = - 1$ 不是极值点.同理 $x_{3} = 1$ 也不是极值点(图6.11).

图6.11

## 6.5.2 最大值最小值问题

在工农业生产、工程技术及科学实验中，常常会遇到这样一类问题:在一定条件下，怎样使“产品最多”、“用料最省”、“成本最低”、“效率最高”等，这类问题在数学上有时可归结为求某一函数(通常称为目标函数)的最大值或最小值问题

假定函数 $f(x)$ 在闭区间 $\left[ a , b \right]$ 上连续，在开区间 $(a,b)$ 内只有有限个驻点和不可导点，若 $f(x)$ 在闭区间 $\left[ a , b \right]$ 上的最值点在 $(a , b)$ 内取到，则此最值点必为极值点，所以一定在驻点或者不可导点处取到.当然，最值点也可能是区间的端点.所以

[page:236]

## 第6章 微分中值定理与导数的应用

只要把区间端点、驻点以及不可导点处的函数值都计算出来，其中最大的就是最大值，最小的就是最小值

例6.28求 $f(x)=\sqrt[3]{(x^{2}-2x)^{2}}$ 在闭区间[-1,3]上的最大值与最小值.

解 $f^{\prime}(x) = \frac{4}{3}\frac{x - 1}{\sqrt[3]{x(x - 2)}}$ ，所以1为驻点，0，2为导数不存在的点.由$f(-1)=\sqrt[3]{9},f(0)=0,f(1)=1,f(2)=0,f(3)=\sqrt[3]{9}$ ,所以f(x)的最大值为 $\sqrt [ 3 ] { 9 }$ ，最小值为0.

例6.29铁路线上AB段的距离为100km.工厂C距A处为20km,AC垂直于AB.为了运输需要，要在AB线上选定一点D向工厂修筑一条公路.已知铁路

每公里货运的运费与公路上每公里货运的运费之比为3:5.为了使货物从供应站B运到工厂C的运费最省，问D点应选在何处(图 6.12)?

解设 $AD=x\mathrm{km}$ ,则 $BD = 100 - x$

$$CD = \sqrt{400 + x^{2}}$$

设铁路上每千米的运费为3k，公路上每千米的运费为5k.设从B点到C点需要的总运费为y，则

$$y = 5k\sqrt{400 + x^{2}} + 3k(100 - x), \quad 0 \leqslant x \leqslant 100.$$

因为

$$y^{\prime} = k \left( \frac{5x}{\sqrt{400 + x^2}} - 3 \right)$$

所以驻点为 $x = 15$

由于 $y(0)=400k,y(15)=380k,y(100)=500k\sqrt{1+\frac{1}{5^2}}$ ，所以当 $AD = x =$ 15km时，总运费最省.

在求函数的最大值(或最小值)时，特别值得指出的是下述情形: $f(x)$ 在一个区间内可导且只有一个驻点 $x _ { 0 }$ ，且这个驻点 $x_{0}$ 是函数 $f(x)$ 的极值点，那么，当$f(x_{0})$ 是极大值时， $f(x_{0})$ 就是 $f(x)$ 在此区间上的最大值；当 $f(x_{0})$ 是极小值时，$f(x_{0})$ 就是f(x)在此区间上的最小值(图6.13).

[page:237]

## 6.5 函数的极值与最大值最小值

例6.30做一个圆柱形无盖铁桶，容积一定，设为 $V_{0}$ .问铁桶的底半径与高的比例应为多少才能最省铁皮(图6.14)?

解设铁桶底半径为r，高为h，则所需铁皮面积为

$$S = 2 \pi r h + \pi r ^ { 2 } .$$

由 $V_{0}=\pi r^{2}h$ ,得

$$h = \frac { V _ { 0 } } { \pi r ^ { 2 } } ,$$

所以

图6.14

$$S = \frac{2V_{0}}{r} + \pi r^{2}, \quad 0 < r < + \infty.$$

因为

$$\frac{\mathrm{d}S}{\mathrm{d}r} = - \frac{2V_{0}}{r^{2}} + 2\pi r,$$

所以得唯一的驻点为 $r_{1}=\sqrt[3]{\frac{V_{0}}{\pi}}$ .易得出其为极小值点，故为最小值点.此时有

$$h = \frac{V_{0}}{\pi r^{2}}\bigg|_{r = r_{1}} = r_{1},$$

所以，当底半径r与高h相等时，最省铁皮

例6.31 在椭圆 $\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}=1$ 的第一象限部分求一点P，使过该点的切线与两坐标轴所围图形的面积最小(图6.15).

解设 $(x_{1},y_{1})$ 为椭圆在第一象限的点.对方程 $\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}=1$ 两边求微分，得

$$\frac{2x\mathrm{d}x}{a^{2}} + \frac{2y\mathrm{d}y}{b^{2}} = 0,$$

[page:238]

## 第6章 微分中值定理与导数的应用

所以

$$\frac{\mathrm{d}y}{\mathrm{d}x} = - \frac{b^{2}}{a^{2}} \cdot \frac{x}{y}.$$

于是得到椭圆在点 $(x_{1},y_{1})$ 处的切线方程

$$y - y_{1} = - \frac{b^{2}}{a^{2}} \cdot \frac{x_{1}}{y_{1}}(x - x_{1})$$

即

$$\frac{x_{1}x}{a^{2}} + \frac{y_{1}y}{b^{2}} = 1.$$

由此易求得切线在x轴上的截距为 $X = \frac { a ^ { 2 } } { x _ { 1 } }$ ，在y轴上的截距为 $Y { = } \frac { b ^ { 2 } } { y _ { 1 } }$ ，所以所求面积为

$$S = \frac{1}{2}XY = \frac{1}{2}\left( \frac{a^{2}}{x_{1}} \right) \cdot \left( \frac{b^{2}}{y_{1}} \right) = \frac{a^{3}b}{2} \cdot \frac{1}{x_{1} \cdot \sqrt{a^{2} - x_{1}^{2}}}, \quad 0 < x_{1} < a.$$

因为

$$\frac{\mathrm{d}S}{\mathrm{d}x_{1}} = \frac{a^{3}b}{2} \cdot \frac{1}{\sqrt{a^{2} - x_{1}^{2}}} \cdot \frac{2x_{1}^{2} - a^{2}}{\left( a^{2} - x_{1}^{2} \right) \cdot x_{1}^{2}}, \quad 0 < x_{1} < a.$$

所以得唯一的驻点为 $x_{1} = \frac{a}{\sqrt{2}}$ .易得出其为极小值点，故为最小值点.此时有

$$y_{1} = \frac{b}{\sqrt{2}},$$

所以当P点选为 $\left( \frac{a}{\sqrt{2}}, \frac{b}{\sqrt{2}} \right)$ 时，过它的椭圆的切线与两坐标轴围成的面积最小.

例6.32已知一稳压电源回路，电源的电动势为E，内阻为 $r _ { 0 }$ .负载电阻为R.问R多大时，输出功率最大(图 6.16)?

解消耗在负载电阻R上的功率为

$$\tilde { P } = i ^ { 2 } R .$$

其中i为回路中的电流.由欧姆定律知

$$i = \frac { E } { R + r _ { 0 } } ,$$

所以

$$P = \frac{E^{2}R}{(R + r_{0})^{2}}, \quad 0 < R < +\infty.$$

因为

$$\frac{\mathrm{d}P}{\mathrm{d}R} = \frac{E^{2}(r_{0} - R)}{(R + r_{0})^{3}},$$

[page:239]

## 6.5 函数的极值与最大值最小值

所以得唯一的驻点为 $R = r_{0}$ .易得出其为极大值点，故为最大值点.所以当 $R = r_{0}$时输出功率最大

例6.33 一束光线由空气中 A点经过水面折射后到达水中B点.已知光在空气中和水中传播的速度分别是 $w_{1}$ 和 $v _ { 2 }$ ，试确定光线的传播路径(图6.17).

解设A点到水面的垂直距离为 $AO = h_{1}$ , B点到水面的垂直距离为 $BQ = h_{2},x$ 轴沿水面过点$O , Q , Q Q$ 的长度为l.

光线总是沿着耗时最少的路径传播，因此光

线在同一均匀介质中必沿直线传播.设光线的传播路径与x轴的交点为P，$O P { = } x$ ，则光线从A到B的传播路径为折线APB，所需传播时间为

$$T ( x ) = \frac { \sqrt { h _ { 1 } ^ { 2 } + x ^ { 2 } } } { v _ { 1 } } + \frac { \sqrt { h _ { 2 } ^ { 2 } + ( l - x ) ^ { 2 } } } { v _ { 2 } } , \quad x \in [ 0 , l ] .$$

由于

$$T ^ { \prime } ( x ) = \frac { 1 } { v _ { 1 } } \cdot \frac { x } { \sqrt { h _ { 1 } ^ { 2 } + x ^ { 2 } } } - \frac { 1 } { v _ { 2 } } \cdot \frac { l - x } { \sqrt { h _ { 2 } ^ { 2 } + ( l - x ) ^ { 2 } } } , \quad x \in [ 0 , l ] ,$$

$$\begin{align*}T''(x) = \frac{1}{v_1} \cdot \frac{h_1^2}{(h_1^2 + x^2)^{\frac{3}{2}}} + \frac{1}{v_2} \cdot \frac{h_2^2}{[h_2^2 + (l - x)^2]^{\frac{3}{2}}} > 0, \quad x \in [0, l], \\T'(0) < 0, \quad T'(l) > 0,\end{align*}$$

且 $T^{\prime}(x)$ 在 $[ 0 , 1 ]$ 上连续，故 $T^{\prime}(x)$ 在(O,l)内存在唯一零点 $\mathcal{X}_{0}$ ，且 $x _ { 0 }$ 是 $T(x)$ 在(0,l)内的唯一极小值点，从而也是T(x)在 $[ 0 , 1 ]$ 上的最小值点.

$\mathcal { X } _ { 0 }$ 必然满足

$$\frac{x_{0}}{v_{1}\sqrt{h_{1}^{2}+x_{0}^{2}}}=\frac{l-x_{0}}{v_{2}\sqrt{h_{2}^{2}+(l-x_{0})^{2}}}.$$

因为

$$\frac{x_{0}}{\sqrt{h_{1}^{2}+x_{0}^{2}}}=\sin \theta_{1}, \quad \frac{l-x_{0}}{\sqrt{h_{2}^{2}+(l-x_{0})^{2}}}=\sin \theta_{2},$$

所以

$$\frac { \mathrm { s i n } \theta _ { 1 } } { \upsilon _ { 1 } } = \frac { \mathrm { s i n } \theta _ { 2 } } { \upsilon _ { 2 } } ,$$

其中 $\theta _ { 1 } , \theta _ { 2 }$ 分别为光线的入射角和折射角.这就是著名的光的折射定律

还要指出，实际问题中，往往根据问题的性质就可以断定可导函数f(x)确有最大值或最小值，而且一定在定义区间内部取得.这时如果 $f(x)$ 在定义区间内部只有一个驻点 $\mathcal { X } _ { 0 }$ ，那么不必讨论 $f(x_{0})$ 是不是极值，就可以断定 $f(x_{0})$ 是最大值或

[page:240]

## 第6章 微分中值定理与导数的应用

最小值.

例6.34把一根直径为d的圆木锯成截面为矩形的梁.问矩形截面的高h和宽b应如何选择才能使梁的抗弯截面模量最大(图6.18)?

解 由力学分析知，矩形梁的抗弯截面模量为

$$W = \frac { 1 } { 6 } b h ^ { 2 } .$$

而

$$h^{2} = d^{2} - b^{2}$$

所以

$$W = \frac{1}{6} \left( d^2 b - b^3 \right), \quad b \in (0, d).$$

由

$$W ^ { \prime } = \frac { 1 } { 6 } \left( d ^ { 2 } - 3 b ^ { 2 } \right) ,$$

得驻点

$$b = \sqrt { \frac { 1 } { 3 } } d .$$

由于梁的最大抗弯截面模量一定存在，而且在(0，d)内部达到，所以必然在$b { = } \sqrt { \frac { 1 } { 3 } } d .$ 处达到.此时可以解得

$$d:h:b=\sqrt{3}:\sqrt{2}:1.$$

## 习题6.5

1. 求下列函数的极值:

(1) $y=2x^{3}-6x^{2}-18x+7; \quad y=x-\ln(1+x)$

(3) $y=-x^{4}+2x^{2}$ (4) $y = x + \sqrt{1 - x}$

(5) $y=\frac{1+3x}{\sqrt{4+5x^{2}}}$ (6) $\frac{3x^{2} + 4x + 4}{x^{2} + x + 1}$ 4

(7) $y = \mathrm{e}^{x} \cos x;$ (8) $y = x^{\frac{1}{x}}$

(9) $y=3-2(x+1)^{\frac{1}{3}}$ ;(10) $y = x + \tan x$

2. 试证明:如果函数 $y=ax^{3}+bx^{2}+cx+d$ 满足条件 $b^{2}-3ac<0$ ，那么这函数没有极值

[page:241]

## 6.5 函数的极值与最大值最小值

3. 试问a为何值时，函数 $f(x) = a \sin x + \frac{1}{3} \sin 3x$ 在 $x = \frac{\pi}{3}$ 处取得极值？它是极大值还是极小值？并求此极值.

4. 求下列函数在 $( 0 , + \infty )$ 上的最小值:

(1) $f(x) = x + \frac{1}{x};$ (2) $f\left(x\right)=x+\frac{1}{x^{2}};$

(3) $f(x) = x^{3} + \frac{1}{x}$

5. 求下列函数在 $[ 0 , a ]$ 上的最大值:

(1) $f(x) = x \sqrt{a^{2} - x^{2}}$ (2) $f(x)=x^{2}\sqrt{a^{2}-x^{2}}$

(3) $f(x) = x^{3} \sqrt{a^{2} - x^{2}}$

6. 求下列函数的最大值、最小值:

(1) $y=2x^{3}-3x^{2},-1\le x\le 4;$ (2) $y=x^{4}-8x^{2}+2,-1\le x\le 3$ se.

(3) $y=x+\sqrt{1-x},-5\le x\le1$

7. 问函数 $y=2x^{3}-6x^{2}-18x-7(1\leqslant x\leqslant4)$ 在何处取得最大值？并求出它的最大值.

8. 问函数 $y=x^{2}-\frac{54}{x}(x<0)$ 在何处取得最小值？

9. 问函数 $y=\frac{x}{x^{2}+1}(x\geqslant0)$ 在何处取得最大值？

10. 设 $a>1,f(x)=a^{x}-ax$ 在 $( - \infty , + \infty )$ 内的驻点为 $x ( a )$ .问a为何值时 $x ( a )$ 最小?并求出最小值.

11. 求椭圆 $x^{2}-xy+y^{2}=3$ 上纵坐标最大和最小的点

12. 求数列 $\{ \sqrt [ m ] { n } \}$ 的最大项.

13.某车间靠墙壁要盖一间长方形小屋，现有存砖只够砌20m长的墙壁.问应围成怎样的长方形才能使这间小屋的面积最大？

14.要造一圆柱形油罐，体积为V，问底半径r和高h各等于多少时，才能使表面积最小？这时底直径与高的比是多少?

15. 某地区防空洞的截面拟建成矩形加半圆(图6.19).截面的面积为 $5 \mathrm { m } ^ { 2 }$ .问底宽x为多少时才能使截面的周长最小，从而使建造时所用的材料最省？

16.设有质量为5kg的物体，置于水平面上，受力F的作用而开始移动(图6.20).设摩擦系数 $\mu = 0.25$ ，问力F与水平线的交角α为多少时，才可使力F的大小为最小.

[page:242]

## 第6章 微分中值定理与导数的应用

17.有一杠杆，支点在它的一端.在距支点0.1m处挂一质量为49kg的物体.加力于杠杆的另一端使杠杆保持水平(图6.21).如果杠杆的线密度为5kg/m，求最省力的杆长.

18. 从一块半径为R的圆铁片上挖去一个扇形做成一个漏斗(图6.22).问留下的扇形的中心角φ取多大时，做成的漏斗的容积最大？

19.某吊车的车身高为1.5m，吊臂长15m.现在要把一个6m宽、2m高的屋架，水平地吊到6m高的柱子上去(图6.23)，问能否吊得上去？

20.一房地产公司有50套公寓要出租.当月租金定为1000元时，公寓会全部租出去.当月租金每增加50元时，就会多一套公寓租不出去，而租出去的公寓每月需花费100元的维修费.试问房租定为多少可获得最大收入？

21.已知制作一个背包的成本为40元.如果每一个背包的售出价为x元，售出的背包数由

$$n = \frac{a}{x - 40} + b(80 - x)$$

给出，其中a,b为正常数.问什么样的售出价格能带来最大利润？

22.有笔直的一条河流，河的一侧有A,B两地，A,B两地到河的垂直距离分别是c，d，其垂足分别是M,N，设MN=h.A，B两地为了用水，需在河边建一水塔，问建在何处能最省水管？

23.轮船的燃料费和其速度的立方成正比，已知在速度为10km/h时，燃料费总计每小时30元，其余的用费(不依赖于速度)为每小时480元.问当轮船的速度为若干，才能使1km路程的费用总和为最小？

[page:243]

## 6.6 函数图形的描绘

24. 在椭圆 $\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}=1$ 中，嵌入一内接矩形，矩形的对边分别平行于坐标轴，求使矩形有最大面积时的边长

25.用某种仪器测量某一零件的长度n次，所得的n个结果分别为 $a_{1},a_{2},\cdots,a_{n}$ ，为了较好地表达零件的长度，取x使得函数

$$y = (x - a_{1})^{2} + (x - a_{2})^{2} + \cdots + (x - a_{n})^{2}$$

为最小，试求这个 $\mathcal { X } _ { \mathrm { ~ s ~ } } ^ { \mathrm { ~ o ~ } }$

26.设炮口的仰角为α，炮弹的初速度为 $\omega_{0} \mathrm{m/s}$ ，将炮位处放在原点，发炮时间取作 $t = 0$ ，如不计空气阻力，炮弹的运动方程为

$$\left\{ \begin{aligned} x &= v_{0} t \cos \alpha, \\ y &= v_{0} t \sin \alpha - \frac{1}{2} g t^{2}, \end{aligned} \right.$$

问:如果初速度不变，应如何调整炮口的仰角α才能使射程最远？

## 6.6 函数图形的描绘

## 6.6.1 曲线的渐近线

定义6.3若一动点沿曲线的一条无穷分支无限远离原点时，此动点到某一固定直线的距离趋近于零，则称该直线为曲线的渐近线

渐近线的求法如下:

(1) 垂直渐近线.若 $\lim_{x \to x_0+0} f(x) = \infty ( 或  \lim_{x \to x_0-0} f(x) = \infty)$ ，则直线 $x = x_{0}$ 为曲线$y = f(x)$ 的垂直渐近线

(2) 水平渐近线.若 $\lim_{x \to +\infty} f(x) = k \quad  或  \quad \lim_{x \to -\infty} f(x) = k$ ，其中k为常数，则直线$y = k$ 为曲线 $y = f(x)$ 的水平渐近线.

(3) 斜渐近线.若曲线 $y = f(x)$ 以直线 $y=ax+b$ 为斜渐近线，则由斜渐近线的定义，容易得

$$\lim_{x \to +\infty} \left[ f(x) - (ax + b) \right] = 0.$$

进而有

$$\lim_{x \to +\infty} \left[ \frac{f(x)}{x} - a - \frac{b}{x} \right] = 0,$$

所以

$$a = \lim_{x \to +\infty} \frac{f(x)}{x}.$$

进而得

[page:244]

## 第6章 微分中值定理与导数的应用

$$b = \lim_{x \to +\infty} \left[ f(x) - ax \right].$$

注6.10 $x \rightarrow \cdots 0 0$ 时的情形可以类似得出.

例6.35 求曲线 $y = \frac{(x - 1)^{3}}{(x + 1)^{2}}$ 的渐近线.

解易知

$$\lim_{x \to -1} \frac{(x - 1)^3}{(x + 1)^2} = \infty$$

因此 $x = - 1$ 为垂直渐近线.

再求斜渐近线.

$$a = \lim_{x \to \infty} \frac{f(x)}{x} = \lim_{x \to \infty} \frac{(x - 1)^3}{x(x + 1)^2} = 1,$$

$$\begin{aligned}b &= \lim_{x \to \infty} \left[ f(x) - ax \right] = \lim_{x \to \infty} \left[ \frac{(x - 1)^3}{(x + 1)^2} - x \right] \\&= \lim_{x \to \infty} \frac{-5x^2 + 2x - 1}{(x + 1)^2} = -5.\end{aligned}$$

于是得斜渐近线 $y = x - 5.$

## 6.6.2 利用导数作函数的图形

利用导数作函数图形的主要步骤如下:

(1) 确定函数 f(x)的定义域；

（2）判断函数的奇偶性、周期性等；

(3)求一阶导数 $f^{\prime}(x)$ ，求出所有驻点，并求出一阶导数不存在的点，以便考虑函数的单调性与极值

(4)求二阶导数 $f^{\prime\prime}(x)$ ,求出使 $f^{\prime\prime}(x) = 0$ 的所有点，并求出二阶导数不存在的点，以便考虑函数的凹凸性与拐点；

(5)求出函数的可能的渐近线；

(6)根据以上各点，列表；

(7) 作图.

例6.36作概率曲线 $y = \mathrm{e}^{-x^2}$ 的图形.

解（1）定义域: $( - \infty , + \infty )$

[page:245]

## 6.6 函数图形的描绘

(2) $y = \mathrm{e}^{-x^{2}}$ 是偶函数，图形关于y轴对称，且全部位于x轴上方.

(3) $y^{\prime} = - 2x\mathrm{e}^{- x^{2}}$ ，由此可得唯一驻点 $x { = } 0 .$

(4) $y ^ { \prime \prime } = - 4 \mathrm { e } ^ { - x ^ { 2 } } \left( \frac { 1 } { 2 } - x ^ { 2 } \right)$ ，由此得二阶导数的两个零点 $x = \pm \frac{1}{\sqrt{2}}$

(5) 因为

$$\begin{aligned}a &= \lim_{x \to \infty} \frac{f(x)}{x} = \lim_{x \to \infty} \frac{\mathrm{e}^{-x^2}}{x} = 0, \\b &= \lim_{x \to \infty} \mathrm{e}^{-x^2} = 0,\end{aligned}$$

所以y=0为水平渐近线.

(6) 列表如下:

<table><tr><td>x</td><td><eq>\left( - \infty , - \frac{1}{\sqrt{2}} \right)</eq></td><td>一<eq>\frac{1}{\sqrt{2}}</eq></td><td><eq>\left( - \frac{1}{\sqrt{2}}, 0 \right)</eq></td><td>0</td><td><eq>\left(0, \frac{1}{\sqrt{2}}\right)</eq></td><td><eq>\frac{1}{\sqrt{2}}</eq></td><td><eq>\left( \frac{1}{\sqrt{2}}, +\infty \right)</eq></td></tr><tr><td><eq>f ^ { \prime } ( x )</eq></td><td>十</td><td>十</td><td>十</td><td>0</td><td>一</td><td>一</td><td>一</td></tr><tr><td><eq>f^{\prime\prime}(x)</eq></td><td>十</td><td>0</td><td>一</td><td>一</td><td>一</td><td>0</td><td>+</td></tr><tr><td><eq>f ( x )</eq></td><td></td><td>拐点<eq>y \approx 0 . 6</eq></td><td></td><td>极大<eq>y = 1</eq></td><td></td><td>拐点<eq>y \approx 0 . 6</eq></td><td></td></tr></table>

(7）作图(图6.24)如下:

例6.37作 $y = f(x) = \frac{(x - 1)^{3}}{(x + 1)^{2}}$ 的图形.

解（1）定义域: $x \neq -1$

(2) 无对称性.

(3) $f^{\prime}(x) = \frac{(x - 1)^{2}(x + 5)}{(x + 1)^{3}}$ ，由此可得驻点 $x = -5, x = 1$

(4) $f^{\prime\prime}(x) = \frac{24(x - 1)}{(x + 1)^4}$ ，由此得二阶导数的零点 $x = 1$

[page:246]

## 第6章微分中值定理与导数的应用

(5) 渐近线: $x = - 1$ 为垂直渐近线； $y = x - 5$ 为斜渐近线.

(6) 列表如下:

<table><tr><td>x</td><td><eq>( - \infty , - 5 )</eq></td><td>-5</td><td><eq>(-5,-1)</eq></td><td>-1</td><td>(-1,1)</td><td>1</td><td><eq>( 1 , + \infty )</eq></td></tr><tr><td><eq>f ^ { \prime } ( x )</eq></td><td>+</td><td>0</td><td>一</td><td>不存在</td><td>+</td><td>0</td><td>十</td></tr><tr><td><eq>f^{\prime\prime}(x)</eq></td><td>—</td><td>—</td><td>一</td><td>不存在</td><td>一</td><td>0</td><td>+</td></tr><tr><td><eq>f ( x )</eq></td><td></td><td>极大-13.5</td><td></td><td>不存在</td><td></td><td>拐点0</td><td></td></tr></table>

(7) 作图(图6.25)如下:

描绘下列函数的图形:

(1) $y=\frac{1}{5}\left(x^{4}-6x^{2}+8x+7\right)$ ; (2) $y = \frac{x}{1 + x^{2}}$ (3) $y = \mathrm{e}^{-(x - 1)^{2}}$ ; (4) $y = x^{2} + \frac{1}{x}$

(5) $y = \frac{\cos x}{\cos 2x}$ (6) $y = 3x^{2} - x^{3}$ ; (7) $y = x + \frac{x}{x^{2} - 1}$ ; (8) $y = x^{2} \mathrm{e}^{\frac{1}{x}}$

(9) $y = \arctan x$ (10) $y = \sqrt{\frac{x - 1}{x + 1}}$ ; (11) $y = (x - 1)x^{\frac{2}{3}}$

## 6.7 曲率

有不少实际问题需要考虑曲线的弯曲程度.例如，在工程技术中往往会遇到梁或轴因受外力作用而弯曲变形的情况，为了保证使用安全，在设计时，必须对弯曲

[page:247]

## 6.7 曲率

程度有所了解，以便将它限制在一定范围之内.又如，火车拐弯时，为了保证安全、平稳，需要知道铁轨在弯道处的情况.现在国内通常采用的是在直线轨道与圆弧轨道之间，接上一段适当的曲线轨道(如三次抛物线轨道)，以便使火车逐渐地拐弯.这一段曲线称为缓和曲线.在这个问题中，也要考虑曲线的弯曲程度

## 6.7.1 曲率的定义

怎样刻画曲线的弯曲程度呢?考察长度相同的两条曲线段 $\widehat{A_{1}A_{2}}$ 及 $\widehat { A _ { 3 } A _ { 4 } }$ .当动点从点 $A_{1}$ 沿着 $\widehat{A_{1}A_{2}}$ 运动到点 $A _ { 2 }$ 时，切线 $A_{1}T_{1}$ 也随着转动到切线 $A_{2}T_{2}$ ，记 $\varphi$

为这两条切线正向之间的夹角.类似地，记另一曲线段 $\widehat { A _ { 3 } A _ { 4 } }$ 的两个端点处切线 $A_{3}T_{3}$与 $A_{4}T_{4}$ 的正向之间的夹角为 $\psi _ { * }$ 可以看到，切线的夹角越大，曲线段弯得越厉害(图6.26).

不过，切线的夹角还不能完全刻画曲线段的弯曲程度.从图6.27可以看出， $\widehat { M N }$ 与$\widehat{PQ}$ 这两条曲线段具有相同的切线夹角，但

图 6.26

是它们的弯曲程度显然不一样. $\widehat { M N }$ 比 $P Q$ 短，弯得也更厉害.

由此可见，曲线段的弯曲程度除了与两个端点处切线正向的夹角有关以外，还与曲线段的长度(简称弧长)有关.因此，通常用比值

$$\frac{ 夹角 }{ 弧长 } ,$$

即单位弧长上切线正向转过的角度，来刻画曲线段的弯曲程度

定义6.4(平均曲率） 设曲线段 $\widehat{AB}$ 的长度为s，端点A,B处的切线正向的夹角为 $\varphi$ ，则

$$\bar { K } = \frac { \varphi } { s }$$

称为曲线段 $\widehat{A B}$ 的平均曲率.(图6.28)

平均曲率刻画了一段曲线的平均弯曲程度.

例6.38 证明:直线段AB的平均曲率为零.

证对于直线段AB来说， $\varphi = 0$ ,因此

$$\bar { K } = \frac { \varphi } { s } = 0 .$$

[page:248]

## 第6章 微分中值定理与导数的应用

例6.39 证明:半径为R的圆周上任一段弧 $\widehat{A B}$ 的平均曲率为 $\frac{1}{R}$

证如图6.29所示， $\angle AOB = \varphi , s = R \angle AOB = R \varphi$ ,因此

$$\bar{K} = \frac{\varphi}{s} = \frac{\varphi}{R\varphi} = \frac{1}{R}.$$

从平均曲率的定义和例6.38、例6.39容易看出，平均曲率越小，曲线段越平坦；平均曲率越大，曲线段越弯曲.

直线段和圆弧是很特殊的两段曲线，它们在每一点附近的弯曲情况都相同.因此，用平均曲率就可以刻画它们的弯曲程度.但是，对于一般的曲线来说，在不同点处的弯曲程度可能不一样.因此，平均曲率只能近似反应曲线的弯曲情况.为了精确刻画曲线在一点处的弯曲程度，有必要引进曲线在一点处的曲率的概念，类似于用平均速度的极限来定义瞬时速度，下面用平均曲率的极限来定义曲线在一点处的曲率.

定义6.5(曲线在一点处的曲率)设有曲线段 $\widehat{AB}, \widehat{K} = \frac{\varphi}{s}$ 为 $\widehat{AB}$ 的平均曲率.若点 B沿 $\widehat{AB}$ 趋于点A时，曲线段的平均曲率K有极限，则称此极限值为曲线段AB在点A处的曲率，记作

$$K = \lim_{s \to 0} K = \lim_{s \to 0} \frac{\varphi}{s}.$$

## 6.7.2曲率的计算公式

设曲线是充分光滑的，其方程为

$$y = f(x),$$

又设点A及点B的坐标分别为 $( x , y )$ 及 $(x + \Delta x, y + \Delta y)$ ，切线AT和 $B T ^ { \prime }$ 对于正x轴的倾角分别为θ及 $\theta + \Delta \theta .$

[page:249]

## 6.7 曲率

从图6.30看出， $\theta$ 为 $\triangle PQR$ 的外角，它等于不相邻两内角之和，即$\theta = (\theta + \Delta \theta) + \varphi$ ,因此有

$$\varphi = - \Delta \theta = \left| \Delta \theta \right| ,$$

于是 $\widehat{AB}$ 的平均曲率为

$$\overline{K} = \frac{\varphi}{\overbrace{AB}} = \frac{\left| \Delta \theta \right|}{\overbrace{AB}} = \frac{\left| \frac{\Delta \theta}{\Delta x} \right|}{\overbrace{\frac{AB}{\left| \Delta x \right|}}} = \frac{\left| \frac{\Delta \theta}{\Delta x} \right|}{\overbrace{\frac{AB}{AB}} \bullet \frac{\overline{AB}}{\left| \Delta x \right|}},$$

所以

$$K = \lim_{B \to A} \overline{K} = \lim_{B \to \Lambda} \frac{\left| \begin{array}{c} \overline{\Delta \theta} \\ \overline{\Delta x} \end{array} \right|}{\overline{\begin{array}{c} \overline{AB} \\ \overline{AB} \end{array}} \bullet \overline{\begin{array}{c} \overline{AB} \\ \overline{\left| \begin{array}{c} \Delta x \end{array} \right|} \end{array}}}.$$

由于

$$\lim _ { B \rightarrow \Lambda } \frac { \widehat { A B } } { \overline { A B } } = 1 , \quad \overline { A B } = \sqrt { ( \Delta x ) ^ { 2 } + ( \Delta y ) ^ { 2 } } ,$$

所以

$$K = \lim_{B \to A} \frac{\left| \frac{\Delta \theta}{\Delta x} \right|}{\sqrt{1 + \left( \frac{\Delta y}{\Delta x} \right)^2}}.$$

又因为当 $B \rightarrow A$ 时，有 $\Delta x \rightarrow 0$ ,于是

$$K = \lim_{B \to A} \frac{\left| \frac{\Delta \theta}{\Delta x} \right|}{\sqrt{1 + \left( \frac{\Delta y}{\Delta x} \right)^2}} = \frac{\left| \frac{\mathrm{d}\theta}{\mathrm{d}x} \right|}{\sqrt{1 + y^{'2}}}$$

[page:250]

## 第6章 微分中值定理与导数的应用

因为θ为切线 $A T$ 的倾角，所以 $\theta = \arctan y'$ ,且

$$\frac{\mathrm{d}\theta}{\mathrm{d}x} = \left( \arctan y^{\prime} \right)_{x}^{\prime} = \frac{y^{\prime\prime}}{1 + y^{\prime 2}},$$

即

$$K = \frac{\left| y^{\prime\prime} \right|}{\left( 1 + y^{\prime 2} \right)^{\frac{3}{2}}}.$$

这就是曲率的计算公式.

若曲线由参数方程

$$\begin{cases}x = \varphi(t)  , \\y = \psi(t)\end{cases}$$

给出，则由参数方程求导公式可得

$$K = \frac{\left| \phi^{\prime\prime}(t) \cdot \phi^{\prime}(t) - \phi^{\prime}(t) \cdot \phi^{\prime\prime}(t) \right|}{\left[ \phi^{\prime 2}(t) + \phi^{\prime 2}(t) \right]^{\frac{3}{2}}}.$$

例6.40 计算等边双曲线 $x y = 1$ 在点(1,1)处的曲率.

解由 $y = \frac{1}{x}$ ,得

$$y^{\prime} = - \frac{1}{x^{2}}, \quad y^{\prime\prime} = \frac{2}{x^{3}},$$

因此，

$$y^{\prime} \mid_{x = 1} = - 1, \quad y^{\prime\prime} \mid_{x = 1} = 2.$$

代入曲率公式，得

$$K = \frac{2}{\left[ 1 + ( - 1)^{2} \right]^{\frac{3}{2}}} = \frac{\sqrt{2}}{2}.$$

例6.41抛物线 $y=ax^{2}+bx+c$ 上哪一点处的曲率最大？

解由 $y=ax^{2}+bx+c$ ,得

$$y^{\prime} = 2ax + b, \quad y^{\prime\prime} = 2a.$$

代人公式，得

$$K = \frac{\left | \hat{2}a \right | }{\left [ 1 + (2ax + b)^{2} \right ]^{3/2} }$$

所以，当 $2ax + b = 0$ ,即 $x=-\frac{b}{2a}$ 时曲率最大.也就是说，抛物线在顶点处曲率最大.

例6.42求椭圆

$$\begin{cases}x = a \cos t, \\y = b \sin t\end{cases}a > b > 0,0 \leqslant t < 2\pi$$

[page:251]

## 6.7 曲率

上的最大曲率及最小曲率.

解

$$\frac{\mathrm{d}x}{\mathrm{d}t} = - a\sin t, \quad \frac{\mathrm{d}y}{\mathrm{d}t} = b\cos t,$$

$$\frac{\mathrm{d}^{2} x}{\mathrm{d} t^{2}} = - a \cos t, \quad \frac{\mathrm{d}^{2} y}{\mathrm{d} t^{2}} = - b \sin t.$$

代入公式，得

$$K = \frac{\left[ ( - b\sin t )( - a\sin t ) - ( b\cos t )( - a\cos t ) \right]}{\left[ ( - a\sin t )^{2} + ( b\cos t )^{2} \right]^{3/2}} = \frac{ab}{\left[ b^{2} + ( a^{2} - b^{2} )\sin^{2}t \right]^{3/2}}$$

所以，当 $t = 0$ 或π时，K达到最大值 $\frac{a}{b^{2}}$ ;当 $t = \pi / 2$ 或 $3\pi/2$ 时，K达到最小值 $\frac{b}{a^{\frac{2}{}}}$ .这表明，椭圆在长轴的两个端点处曲率最大，在短轴的两个端点处曲率最小.这与直观了解是一致的.

## 6.7.3 曲率圆与曲率半径

设曲线 $y = f(x)$ 在点 $M(x,y)$ 处的曲率为 $K(K \neq 0)$ .在点M处的曲线的法线上，在凹的一侧取一点D，使得 $\left|DM\right|=\frac{1}{K}=\rho.$ 以D为圆 $心 ,o$ 为半径作圆，这个圆叫做曲线在点M处的曲率圆，曲率圆的圆心D叫做曲线在点M处的曲率中心，曲率圆的半径 $\rho$ 叫做曲线在点M处的曲率半径(图6.31).

按上述规定可知，曲率圆与曲线在点M处有相同的切线和曲率，且在点M邻近有相同的凹向.因此，在实际问题中，常常用曲率圆在点M邻近的一段圆弧来近似代替曲线弧，以使问题简化

例6.43设工件内表面的截线为抛物线 $y = 0.4x^{2}$ .现在要用砂轮磨削其内表面.问用半径多大的砂轮才比较合适(图6.32)？

解 为了在磨削时不使砂轮与工件接触处附近的那部分工件磨去太多，砂轮

[page:252]

## 第6章微分中值定理与导数的应用

的半径应不大于抛物线上各点处曲率半径中的最小值.因为抛物线在其顶点处的曲率最大，也就是说，抛物线在其顶点处的曲率半径最小.由

$$y^{\prime} = 0.8x, \quad y^{\prime\prime} = 0.8,$$

有

$$y^{\prime} \mid_{x = 0} = 0, \quad y^{\prime\prime} \mid_{x = 0} = 0.8.$$

代入公式，得

$$K = 0 . \: 8 .$$

因而求得抛物线顶点处的曲率半径

$$\rho = \frac{1}{K} = 1.25$$

所以选用砂轮的半径不得超过1.25.

习题6.7

1. 求椭圆 $4x^{2} + y^{2} = 4$ 在点(0,2)处的曲率.

2. 求下列函数在指定点处的曲率:

(1) 双曲线 $x y = 4$ ，在点(2,2)处；

(2) 抛物线 $y = 4x - x^{2}$ ，在其顶点处；

(3) $x = a \cos^3 t, y = a \sin^3 t$ ，在 $t = \pi / 4$ 处；

(4) $y = a \operatorname{ch} \frac{x}{a}$ ,在点(0,a)处.

3. 求 $x = 3t^{2}, y = 3t - t^{2}$ 在t=1处的曲率半径.

4. 求阿基米德螺线 $r = a \varphi$ 的曲率半径.

5. 求对数螺线 $r = a \mathrm{e}^{m \varphi}$ 的曲率半径.

6. 求 $y = \ln x$ 的最大曲率.

7. 求曲线 $y = \mathrm{Insec}x$ 在点 $( x , y )$ 处的曲率及曲率半径

8. 求抛物线 $y=x^{2}-4x+3$ 在其顶点处的曲率及曲率半径.

9. 求曲线 $x = a \cos^3 t, y = a \sin^3 t$ 在 $t = t _ { 0 }$ 相应的点处的曲率

10. 对数曲线 $y = \ln x$ 上哪一点处的曲率半径最小？求出该点处的曲率半径

11. 证明曲线 $y = \operatorname{coth}\frac{x}{a}$ 在点 $( x , y )$ 处的曲率半径为 $\frac{y^{2}}{a}$

12. 一飞机沿抛物线路径 $y = \frac{x^{2}}{10000}$ 轴铅直向上，单位为m)做俯冲飞行.在坐标原点O处飞机的速度为 $v=200\mathrm{m/s}$ 飞行员体重 $G=70kg.$ 求飞机俯冲至最低点，即原点处时座椅对

[page:253]

## 6.8方程的近似解

飞行员的反力.

13.汽车连同载重共5t，在抛物线拱桥上行驶，速度为21.6km/h，桥的跨度为10m，拱的矢高为0.25m(图6.33).求汽车越过桥顶时对桥的压力.

14. 曲线弧 $y = \sin x ( 0 < x < \pi )$ 上哪一点处的曲率半径最小？求出该点处的曲率半径

## 6.8 方程的近似解

在科学技术问题中，经常会遇到求解高次代数方程或其他类型的方程的问题要求得这类方程的实根的精确值往往比较困难，因此需要寻求方程的近似解

求方程的近似解，可分两步来做

第一步是确定根的大致范围.具体地说，就是确定一个区间[a，b]，使所求的根是位于这个区间内的唯一实根.这一步工作称为根的隔离，区间[a，b]称为所求实根的隔离区间.由于方程 $f(x) = 0$ 的实根在几何上表示曲线 $y = f(x)$ 与x轴交点的横坐标，因此为了确定根的隔离区间，可以先较精确地画出 $y = f(x)$ 的图形，然后从图上定出它与x轴交点的大概位置.由于作图和读数的误差，这种做法得不出根的高精确度的近似值，但一般已可以确定出根的隔离区间.

第二步是以根的隔离区间的端点作为根的初始近似值，逐步改善根的近似值的精确度，直至求得满足精确度要求的近似解.完成这一步工作有多种方法，这里介绍两种常用的方法二分法和切线法.按照这些方法编出简单的程序，就可以在计算机上求出方程足够精确的近似解.

## 6.8.1 二分法

设 f(x)在区间 $\left[ a , b \right]$ 上连续， $f(a) \cdot f(b) < 0$ ，且方程 $f(x) = 0$ 在 $(a,b)$ 内仅有一个实根 $\xi ,$ 于是 $[ a , b ]$ 即为这个根的一个隔离区间.

取 $\left[ a , b \right]$ 的中点 $\xi_{1}=\frac{a+b}{2}$ ,计算 $f ( \xi _ { 1 } )$

如果 $f(\xi_1) = 0$ ,则 $\xi = \xi _ { 1 }$

如果 $f ( \xi _ { 1 } )$ 与 $f(a)$ 同号，则取 $a_{1} = \xi_{1}, b_{1} = b$ ，由 $f(a_{1}) \cdot f(b_{1}) < 0$ ，即知$a_{1} < \xi < b_{1}$ ，且 $b_{1}-a_{1}=\frac{1}{2}(b-a)$ ;

[page:254]

## 第6章 微分中值定理与导数的应用

如果 $f(\xi_1)$ 与 $f ( b )$ 同号，则取 $a_{1} = a,   b_{1} = \xi_{1}$ ，也有 $a_{1} < \xi < b_{1}$ ，且$b_{1}-a_{1}=\frac{1}{2}(b-a)$ 00.

总之，当 $\xi \neq \xi _ { 1 }$ 时，可得 $a_{1} < \xi < b_{1}$ ，且 $b_{1}-a_{1}=\frac{1}{2}(b-a)$

以 $\left[ a_{1} , b_{1} \right.$ 作为新的隔离区间，重复上述做法，当 $\xi \ne \xi_{2} = \frac{1}{2}(a_{1} + b_{1})$ 时，可得$a_{2} < \xi < b_{2}$ ，且 $b_{2}-a_{2}=\frac{1}{2^{2}}(b-a)$

如此重复n次，可得 $a_{n} < \xi < b_{n}$ ，且 $b_{n}-a_{n}=\frac{1}{2^{n}}(b-a).$

例6.44 用二分法求方程 $x^{3}+1.1x^{2}+0.9x-1.4=0$ 的实根的近似值，使误差不超过 $1 0 ^ { - 3 }$

解令 $f(x)=x^{3}+1.1x^{2}+0.9x-1$ .4，显然f(x)在 $( - \infty , + \infty )$ 内连续.

由 $f^{\prime}(x)=3x^{2}+2.2x+0.9$ ，根据判别式 $B^{2}-4AC=2.2^{2}-4\times 3\times 0.9$ $= -5.96 < 0$ ,知 $f^{\prime}(x) > 0$ 故f(x)在 $( - \infty , + \infty )$ 内单调增加， $f(x) = 0$ 至多有一个实根.

由 $f(0)=-1.4<0,f(1)=1.6>0$ ，知f(x)=0在[0,1]内有唯一的实根.取$a=0,b=1,\left [ 0,1 \right ]$ 即为一个隔离区间

计算得

$$\xi_{1}=0.5,f(\xi_{1})=-0.55<0, 故 a_{1}=0.5,b_{1}=1;$$

$$\xi_{2}=0.75,f(\xi_{2})=0.32>0,故a_{2}=0.5,b_{2}=0.75;$$

$$\xi_{3}=0.625,f(\xi_{3})=-0.16<0, 故 a_{3}=0.625,b_{3}=0.75;$$

$$\xi_{4}=0.687,f(\xi_{4})=0.062>0,故a_{4}=0.625,b_{4}=0.687;$$

$$\xi_{5}=0.656,f(\xi_{5})=-0.054<0, 故 a_{5}=0.656,b_{5}=0.687;$$

$$\xi_{6}=0.672,f(\xi_{1})=0.005>0, 故 a_{6}=0.656,b_{6}=0.672;$$

$$\xi_{7}=0.664,f(\xi_{7})=-0.025<0, 故 a_{7}=0.664,b_{7}=0.672;$$

$$\xi_{8}=0.668,f(\xi_{8})=-0.010<0,故a_{8}=0.668,b_{8}=0.672;$$

$$\xi_{0}=0.670,f(\xi_{0})=-0.002<0, 故 a_{0}=0.670,b_{0}=0.672;$$

$$\xi_{10} = 0.671, f(\xi_{10}) = 0.001 > 0,  故  a_{10} = 0.670, b_{10} = 0.671.$$

于是

$$0.670 < \xi < 0.671,$$

即0.670作为根的不足近似值，0.671作为根的过剩近似值，其误差都小于 $1 0 ^ { - 3 }$

## 6.8.2 切线法

设f(x)在[a,b]上具有二阶导数， $f(a) \cdot f(b) < 0$ 且 $f^{\prime}(x)$ 及 $f^{\prime\prime}(x)$ 在 $\left[ a , b \right]$

[page:255]

## 6.8 方程的近似解

上保持定号.在上述条件下，方程 $f(x) \equiv 0$ 在 $(a,b)$ 内有唯一的实根 $\xi : [ a , b ]$ 为根的一个隔离区间.此时， $y = f(x)$ 在 $\left[ a , b \right]$ 上的图形 $\widehat{AB}$ 只有如图6.34所示的四种不同情形.

考虑用曲线弧一端的切线来代替曲线弧，从而求出方程实根的近似值.这种方法叫做切线法.从图中看出，如果在纵坐标与 $f^{\prime\prime}(x)$ 同号的那个端点(此端点记作$(x_{0},f(x_{0}))$ 作切线，切线与x轴的交点的横坐标 $x _ { 1 }$ 就比 $x_{0}$ 更接近方程的根ξ.

下面以 $f(a)<0,f(b)>0,f^{\prime}(x)>0,f^{\prime\prime}(x)<0$ 的情形为例进行讨论.因为$f(a)$ 与 $f^{\prime\prime}(x)$ 同号，所以令 $x_{0}=a$ ，在端点 $(x_{0},f(x_{0}))$ 作切线，切线方程为

$$y - f(x_{0}) = f^{\prime}(x_{0})(x - x_{0}).$$

令 $y = 0$ ，从上式中解出x，就得到切线与x轴交点的横坐标为

$$x_{1} = x_{0} - \frac{f(x_{0})}{f^{\prime}(x_{0})}.$$

它比 $\mathcal { X } _ { 0 }$ 更接近方程的根 $\xi .$

再在点 $(x_{1},f(x_{1}))$ 作切线，可得根的近似值 $x_{2}$ .如此继续，一般地，在点$(x_{n - 1}, f(x_{n - 1}))$ 作切线，得根的近似值

$$x_{n}=x_{n - 1}-\frac{f(x_{n - 1})}{f^{\prime}(x_{n - 1})}.$$

如果 $f ( b )$ 与 $f^{\prime\prime}(x)$ 同号，切线作在端点B，可记 $\bar{x}_{0}=b$ ，仍按公式计算切线与 $\mathcal { X }$

[page:256]

## 第6章 微分中值定理与导数的应用

轴交点的横坐标.

例6.45 用切线法求方程 $x^{3}+1.1x^{2}+0.9x-1.4=0$ 的实根的近似值，使误差不超过 $1 0 ^ { - 3 }$

解令 $f(x)=x^{3}+1.1x^{2}+0.9x-1.4$ ，由例6.44知[0,1]是根的一个隔离区间.

$$f(0) < 0,f(1) > 0.$$

在[0,1]上，有

$$f^{\prime}(x)=3x^{2}+2.2x+0.9>0$$

$$f^{\prime\prime}(x) = 6x + 2.2 > 0$$

故 $f ( x )$ 在 $[ 0 , 1 ]$ 上的图形属于图中情形.按 $f^{\prime\prime}(x)$ 与f(1)同号，所以令 $x _ { 0 } { = } 1$

连续应用公式，得

$$x_{1} = 1 - \frac{f(1)}{f^{\prime}(1)} \approx 0.738;$$

$$x_{2}=0.738-\frac{f(0.738)}{f^{\prime}(0.738)}\approx0.674;$$

$$x_{3}=0.674-\frac{f(0.674)}{f^{\prime}(0.674)}\approx0.671;$$

$$x_{4}=0.671-\frac{f(0.671)}{f^{\prime}(0.671)}\approx0.671.$$

至此，计算不能再继续.注意到 $f(x_{i})(i = 0,1,\cdots)$ 与 $f ^ { \prime \prime } ( x )$ 同号，知 $f(0,671)>$ 0,经计算可知 $f(0.670) < 0$ ，于是有

$$0.670 < \xi < 0.671.$$

以0.670或0.671作为根的近似值，其误差都小于 $1 0 ^ { - 3 }$

[page:257]

# 第7章 定积分的应用

微积分的萌芽、发展和壮大，强烈地联系着实践的需要和检验.本书已经讲述了定积分的概念、理论和计算，并学习了广义积分.现在来系统讨论定积分在几何和物理方面的一些应用

学习这一部分内容，不仅要掌握一些具体的公式，更重要的是学习用定积分去解决实际问题的思想方法.本章将着重介绍微元分析法(简称微元法)及其应用，其理论根据是定积分概念和微积分基本公式

## 7.1 微元法的基本思想

定积分所要解决的问题是求某个不均匀分布的整体量(记作A).这个量可能是一个几何量(如曲边梯形的面积)，也可能是一个物理量(如变速直线运动的路程).由于这些量是不规则或不均匀的，因而必须先通过分割，把整体问题转化为局部问题，在局部范围内，“以直代曲”或“以匀代不匀”，近似地求出整体量在局部范围内的各部分，然后相加，再取极限，最后得到整体量.这就是利用定积分解决实际问题的基本思想:“分割——近似代替——求和——取极限”

凡是能用定积分来计算的这些量，都有以下三个特点:

第一，它们都是分布在某个区间上的，也就是说，这些量都与自变量x的某个区间 $[ a , b ]$ 有关，因此称它们为整体量.

第二，这类整体量A对于区间 $[ a , b ]$ 具有可加性.也就是说，如果把 $\left[ a , b \right]$ 分成若干个部分区间

$$\left[ x _ { i - 1 } , x _ { i } \right] , \quad i = 1 , 2 , \cdots , n ,$$

则量A等于对应于各个部分区间的局部量 $\Delta A_{i}(i = 1,2,\cdots,n)$ 的总和，即

$$A = \sum _ { i = 1 } ^ { n } \Delta A _ { i } .$$

第三，由于整体量A在区间 $[ a , b ]$ 上的分布是不均匀的，因而每个局部量 $\Delta A _ { i }$在部分区间 $[ x _ { i - 1 } , x _ { i } ]$ 上的分布一般也是不均匀的.可以设法“以匀代不匀”求得局部量的近似值

$$\Delta A_{i} \approx f(\xi_{i}) \cdot \Delta x_{i} \quad i = 1,2,\cdots,n,\tag{7.1}$$

其中 $f ( x )$ 为根据实际问题所选择的一个函数； $\xi _ { i }$ 是区间 $\left[ x_{i - 1},x_{i} \right]$ 上任一点；而$\Delta x_{i} = x_{i} - x_{i - 1}$ .正确地写出近似等式(7.1)是很关键的.在这里，要求当 $\Delta x_{i} \rightarrow 0$

[page:258]

## 第7章 定积分的应用

时， $\Delta A_{i}$ 与 $f(\xi_{i}) \cdot \Delta x_{i}$ 之差 $\left[ \Delta A_{i} - f(\xi_{i}) \cdot \Delta x_{i} \right]$ 是比 $\Delta \mathcal { \hat { X } } _ { i }$ 更高阶的无穷小量，即$f(\xi_i) \cdot \Delta x_i$ 应当是 $\Delta A _ { i }$ 的主要部分.只有这样，当 $\Delta x_{i} \rightarrow 0 (i = 1,2,\cdots,n)$ 时，整体量的近似等式

$$A = \sum_{i = 1}^{n} \Delta A_{i} \approx \sum_{i = 1}^{n} f(\xi_{i}) \cdot \Delta x_{i}$$

的误差才有可能仍然是无穷小量，从而通过取极限而得到精确等式

$$A = \lim_{\lambda \to 0} \sum_{i=1}^{n} f(\xi_i) \cdot \Delta x_i$$

其中 $\bar{\lambda} = \max_{1 \leqslant i \leqslant n} \{ \Delta x_{i} \}$

由于整体量A具有上述三个特点，因而可以用“分割—近似代替—求和—取极限”的办法来计算它.在这四步中，关键的一步是“近似代替”.必须正确选择函数 $f(x)$ ，写出局部范围内的近似等式(7.1).

但是，由于整体量A是待求的、未知的，每个局部量 $\Delta A_{i}(i = 1,2,\cdots,n)$ 也是未知的，因此很难断定写出来的 $f(\xi_i) \cdot \Delta x_i$ 是不是 $\Delta A _ { i }$ 的主要部分.一般说来，只有通过多次实践，不断取得经验，逐步掌握规律.

上面所说的四个步骤，在实际应用中，往往简化为以下两步.用这两步来解决实际问题的方法称为“微元法”.

第一步分割区间 $\left[ a , b \right]$ ，考虑任意一份，即具有代表性的一份 $\left[ x , x + \Delta x \right]$ 或$\left[ x , x + \mathrm{d}x \right]$ .选择函数 $f(x),$ 以匀代不匀”，写出局部量的近似值

$$\Delta A \approx f(x) \cdot \Delta x = f(x) \mathrm{d}x,$$

$f(x) \mathrm{d}x$ 称为整体量A的微元(微小元素).

第二步当 $\Delta x \rightarrow 0$ 时，把这些微元在区间 $\left[ a , b \right]$ 上无限积累，所得的定积分$\int_{a}^{b} f(x)   dx$ 就是整体量A，即

$$A = \int_{a}^{b} f(x)   \mathrm{d}x.$$

为什么用这样两步写出的定积分就是所要求的整体量呢？从数量关系上看，“微元”到底是什么？换句话说，微元法的理论根据是什么？

若用函数 $A(x)$ 表示量A对应于变动区间 $\left[ a , x \right] ( a \leqslant x \leqslant b )$ 的部分量，则显然有

$$A(a)=0,\quad A(b)=A(b)-A(a)=A.$$

给x以改变量dx，这里把相应于区间 $\left[ x , x + \mathrm{d}x \right]$ 的部分量记作 $\Delta A .$ 如果根据实际问题找到的 $f(x) \mathrm{d}x$ 正好是 $\Delta A$ 的线性主要部分，那么， $f(x) \mathrm{d}x$ 就是函数$A(x)$ 的微分，即

$$f(x) \mathrm{d}x = \mathrm{d}A = A^{\prime}(x) \mathrm{d}x,$$

[page:259]

## 7.2 平面图形的面积

于是由牛顿-莱布尼兹公式知

$$\int_{a}^{b} f(x) \mathrm{d}x = \int_{a}^{b} A^{\prime}(x) \mathrm{d}x = A(x) \mid_{a}^{b} = A(b) - A(a) = A.$$

这表明，整体量A可以表示为定积分

$$A = \int_{a}^{b} f(x)   \mathrm{d}x,$$

其中函数 $f ( x )$ 是根据实际问题写出来的.只要“微元 $\mathrm{d}A = f(x) \mathrm{d}x$ 确实是函数$A(x)$ 的微分，并且 $f ( x )$ 在 $\left[ a , b \right]$ 上可积，那么，上面的讨论都是成立的.

如前面所述，由于整体量是待求的，部分量(即函数 $A(x)$ 是未知的，因此，很难断定写出来的微元 $f(x) \mathrm{d}x$ 到底是不是 $A(x)$ 的微分，换句话说，很难断定

$f(x) \mathrm{d}x$ 是不是 $\Delta A$ 的主要部分.一般说来，要多实践，要凭经验，要根据问题的具体情况，对写出的微元，仔细分析，由此可见，微元法的两步，关键是第一步—把微元dA分析清楚.

以上就是微元分析法(或微元法)的基本思想和理论根据

下面介绍怎样用微元法来解决一些几何问题和物理问题

微元法

## 7.2 平面图形的面积

## 7.2.1 直角坐标系下的面积公式

设有连续函数 $f(x) , g(x)$ ,满足

$$g(x) \leqslant f(x), \quad x \in [a,b],$$

求由曲线 $y = f(x) , y = g(x)$ 及直线 $x = a, x = b$ 所围成的面积A(图7.1).

第一步分割区间 $\left[ a , b \right]$ ，考虑任意一份 $\left[ x , x + \mathrm{d}x \right]$ .相应于这个小区间的面积微元dA可以取为小矩形面积，该小矩形以 $\left[ f(x) - g(x) \right]$ 为高、以dx为底，于是

[page:260]

## 第7章 定积分的应用

$$\mathrm{d}A = \left[ f(x) - g(x) \right] \mathrm{d}x.$$

第二步 将 dA在区间[a，b]上无限求和，得到

$$A = \int_{a}^{b} \left[ f(x) - g(x) \right] \mathrm{d}x\tag{7.2}$$

例7.1 计算由两条抛物线: $y^{2} = x,y = x^{2}$ 所围成的图形的面积(图7.2).

解先求出这两条抛物线的交点.为此，解方程组

$$\begin{cases} { y ^ { 2 } = x , } \\ { y = x ^ { 2 } , } \\ \end{cases}$$

得到两个解

$$x = 0,\quad y = 0\quad  及  x = 1,\quad y = 1,$$

即这两条抛物线的交点为(0,0)及(1，1)，从而知此图形在直线 $x = 0$ 及x=1之间.根据式(7.2)，得所求面积为

$$\int_{0}^{1} \left( \sqrt{x} - x^{2} \right) dx = \left[ \frac{2}{3}x^{\frac{3}{2}} - \frac{x^{3}}{3} \right]_{0}^{1} = \frac{1}{3}.$$

例7.2 求椭圆 $\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}=1$ 所围图形的面积(图7.3).

解 由对称性，椭圆面积等于椭圆在第一象限内面积的4倍.设椭圆的面积为A，于是由式(7.2)，得

$$A = 4 \int_{0}^{a} y(x)   dx.$$

从椭圆方程解出 $y = \pm \frac{b}{a} \sqrt{a^2 - x^2}$ ，上半椭圆方程为

$$\bar{y} = \frac{b}{a} \sqrt{a^2 - x^2},$$

因此

[page:261]

## 7.2平面图形的面积

$$\begin{aligned}A &= 4\int_{0}^{a}\frac{b}{a}\sqrt{a^{2} - x^{2}}\mathrm{d}x \\&= \frac{4b}{a}\left[\frac{x}{2}\sqrt{a^{2} - x^{2}} + \frac{a^{2}}{2}\arcsin\frac{x}{a}\right]_{0}^{a} = \pi ab.\end{aligned}$$

设平面图形由连续曲线 $x = \varphi ( y ) , x = \psi ( y )$ 及直线 $y = c, y = d$ 围成，其面积为A.如果连续曲线满足

$$\varphi ( y ) \leqslant \psi ( y ) , \quad y \in [ c , d ] ,$$

则有类似的面积公式(图7.4)

$$A = \int _ { c } ^ { d } \left[ \psi ( y ) - \varphi ( y ) \right] \mathrm{d}y\tag{7.3}$$

例7.3 求曲线 $y^{2} = - 4(x - 1)$ 与 $y^{2} = - 2(x - 2)$ 围成的图形面积(图7.5).

解把 $y^{2} = - 4(x - 1)$ 改写为 $x=\varphi(y)=\frac{1}{4}(4-y^{2})$ ,把 $y^{2} = - 2(x - 2)$ 改写为 $x = \psi(y) = \frac{1}{2}(4 - y^{2})$ ，这是两条相交于两点(0，一2)，(0，2)的抛物线.由式(7.3)，得面积为

$$\begin{aligned}A = \int_{- 2}^{2}\left\lbrack \frac{1}{2}\left( 4 - y^{2} \right) - \frac{1}{4}\left( 4 - y^{2} \right) \right\rbrack dy = 2\int_{0}^{2}\left\lbrack \frac{1}{2}\left( 4 - y^{2} \right) - \frac{1}{4}\left( 4 - y^{2} \right) \right\rbrack dy = \frac{8}{3}.\end{aligned}$$

## 7.2.2 边界曲线由参数方程表示时的面积公式

一般地，当曲边梯形的曲边 $y = f(x) \left( f(x) \geqslant 0, x \in [a, b] \right)$ 由参数方程

$$\begin{cases}x = \varphi(t)  , \\y = \varphi(t)\end{cases}$$

给出时，如果 $x = \varphi(t)$ 满足 $\varphi ( \alpha ) = a , \varphi ( \beta ) = b , \varphi ( t )$ 在 $[ \alpha , \beta ]$ (或 $[ \beta , \alpha ] )$ 上具有连续

[page:262]

## 第7章 定积分的应用

导数， $y = \phi(t)$ 连续，则由曲边梯形的面积公式及定积分的换元公式可知，曲边梯形的面积为

$$A = \int_{a}^{b} f(x)   dx = \int_{a}^{\beta} \psi(t) \varphi^{\prime}(t)   dt.\tag{7.4}$$

例7.4 求由摆线 $x = a(t - \sin t), y = a(1 - \cos t)$ 的一拱 $(0 \leq t \leq 2\pi)$ 与x轴所围图形的面积.

解由式(7.4),得

$$\begin{aligned}A &= \int_{0}^{2\pi} a(1 - \cos t) \cdot a(1 - \cos t)   dt \\&= a^{2} \int_{0}^{2\pi} (1 - 2\cos t + \cos^{2} t)   dt = 3\pi a^{2}.\end{aligned}$$

## 7.2.3 极坐标系下的面积公式

设有一条连续曲线，其极坐标方程为 $r = r(\theta)$ .求由曲线 $r = r(\theta)$ 及两个向径$\theta = \alpha , \theta = \beta$ 所围成的面积A(图7.6).

这里仍采用“微元法”来求解此问题.先分割区间 $[ \alpha , \beta ]$ ，任取一份 $\left[ \theta , \theta + \mathrm{d} \theta \right]$用圆弧代替曲线弧，得到面积微元

$$\mathrm{d}A = \frac{1}{2} r^2 (\theta) \mathrm{d}\theta.$$

然后将 $\mathrm{d}A$ 在区间 $[ \alpha , \beta ]$ 上无限求和，便得到面积公式

$$A = \int_{a}^{\beta} \frac{1}{2} r^2 (\theta) \mathrm{d}\theta = \frac{1}{2} \int_{a}^{\beta} r^2 (\theta) \mathrm{d}\theta.\tag{7.5}$$

例7.5 求心脏线 $r = a ( 1 + \cos \theta ) ( a > 0 )$ 所围成的面积A.

解如图7.7所示，由对称性知

$$\begin{aligned}A &= 2 \cdot \frac{1}{2}\int_{0}^{\pi}a^{2}\left( 1 + \cos\theta \right)^{2}\mathrm{d}\theta \\&= a^{2}\int_{0}^{\pi}\left( 1 + 2\cos\theta + \cos^{2}\theta \right)\mathrm{d}\theta = \frac{3}{2}\pi a^{2}.\end{aligned}$$

[page:263]

## 7.2 平面图形的面积

例7.6 求圆 $\rho = \sqrt{2} \sin \theta$ 与双纽线$\rho^{2} = \cos 2\theta$ 的公共部分的面积.

解圆与双纽线的图形如图7.8所示.它们关于射线 $\theta = \frac{\pi}{2}$ 对称，在第一象限的交点为 $\left( \frac{1}{\sqrt{2}}, \frac{\pi}{6} \right)$ .因此，所求面积为第一象限内公共面积的两倍.从图7.8可以看出，公共部分由两部分组成，一部分为由圆

$\rho=\sqrt{2}\sin\theta$ 与矢径 $\theta = 0 , \theta = \frac{\pi}{6}$ 所围成；另一部分为由双纽线 $\rho^{2} = \cos 2\theta$ 与矢径 $\theta \equiv$ $\frac{\pi}{6}, \theta = \frac{\pi}{4}$ 所围成.因此，所求面积为

$$\begin{aligned}A &= 2\left[\frac{1}{2}\int_{0}^{\frac{\pi}{6}}2\sin^{2}\theta d\theta + \frac{1}{2}\int_{\frac{\pi}{6}}^{\frac{\pi}{4}}\cos 2\theta d\theta\right] \\&= \int_{0}^{\frac{\pi}{6}}\left(1 - \cos 2\theta\right)d\theta + \frac{1}{2}\int_{\frac{\pi}{6}}^{\frac{\pi}{4}}\left(\cos 2\theta\right)d\left(2\theta\right) \\&= \left[\theta - \frac{1}{2}\sin 2\theta\right]_{0}^{\frac{\pi}{6}} + \frac{1}{2}\left[\sin 2\theta\right]_{\frac{\pi}{6}}^{\frac{\pi}{4}} \\&= \frac{\pi}{6} + \frac{1 - \sqrt{3}}{2}.\end{aligned}$$

习题7.2

1. 求由下列各组曲线所围成的图形的面积:

(1) $y=\frac{1}{2}x^{2}$ 与 $x^{2} + y^{2} = 8$ 两部分都要计算)；

(2) $y = \frac{1}{x}$ 与直线 $y = x$ 及 $x = 2$

(3) $y = \mathrm{e}^{x} , y = \mathrm{e}^{-x}$ 与直线 $x = 1$

(4) $y = \ln x , y$ 轴与直线 $y = \ln a , y = \ln b ( b > a > 0 )$ in

(5) $y=1-x^{2},y=\frac{2}{3}x;$

(6) $y=2x,y=\frac{1}{2}x,y=\frac{1}{4}x+1$

[page:264]

## 第7章 定积分的应用

(7) $y=x^{2},y=(x-2)^{2},y=0$

(8) $y=x^{2},y=x,y=2x;$

(9) $y=x,y=x+\sin^{2}x(0\leqslant x\leqslant\pi)$

2. 求抛物线 $y=-x^{2}+4x-3$ 及其在点(0，一3)和(3，0)处的切线所围成的图形的面积.

3. 求抛物线 $y^{2} = 2p x$ 及其在点 $\left( \frac{p}{2}, p \right)$ 处的法线所围成的图形的面积

4. 求由下列各曲线所围成的图形的面积:

(1) $\rho = 2a\cos\theta$ (2) $x = a \cos^3 t, y = a \sin^3 t;$ (3) $\rho = 2a(2 + \cos \theta)$

5. 求由星形线 $\begin{cases}x = a\cos^{3}t, \\y = a\sin^{3}t\end{cases}$ 所围图形的面积

6. 求由曲线 $\frac{x^{4}}{a^{4}}+\frac{y^{4}}{b^{4}}=1$ 所围图形的面积.

7. 求由三叶玫瑰线 $r = a \sin 3\theta$ 一瓣与极轴所围的面积.

8. 求由曲线 $y = x(x - 1)(x - 2)$ 与 $y = 0$ 所围成图形的面积.

9. 求对数螺线 $\rho = a \mathrm{e}^{\theta} ( - \pi \leqslant \theta \leqslant \pi )$ 及射线 $\theta  三  \pi$ 所围成的图形的面积

10. 求下列各曲线所围成图形的公共部分的面积:

(1) $\rho = 3 \cos \theta$ 及 $\rho = 1 + \cos \theta;$ (2) $\rho=\sqrt{2}\sin\theta$ 及 $\rho^{2} = \cos 2\theta.$

11. 求位于曲线 $y = \mathrm{e}^{x}$ 下方，该曲线过原点的切线的左方以及x轴上方之间的图形的面积. 12. 求由抛物线 $y^{2} = 4ax$ 与过焦点的弦所围成的图形面积的最小值.

13. 求由曲线 $\rho = a \sin \theta , \rho = a ( \cos \theta + \sin \theta ) ( a > 0 )$ 所围图形公共部分的面积.

## 7.3 体积

## 7.3.1已知平行截面面积，求立体的体积

设空间某立体由一曲面和垂直于x轴的二平面 $x = a, x = b$ 围成(图7.9).用一

组垂直于x轴的平面去截它，得到彼此平行的截面.如果过任一点 $x(a \leqslant x \leqslant b)$ 且垂直于x轴的平面截该立体所得的截面面积 $A(x)$是已知的连续函数，则此立体的体积为

$$V = \int_{a}^{b} A(x)   \mathrm{d}x.\tag{7.6}$$

现在用微元法来证明式(7.6).分割区间 $\left[ a , b \right]$ ，考虑任一小区间 $\left[ x , x + \mathrm{d}x \right]$ .相应

于这一小段的立体可以近似看成小的正柱体，其上、下底的面积都是 $A(x)$ ，高为dx.于是得到体积微元(即微小体积 $\Delta V$ 的近似值)

$$\mathrm{d}V = A(x)\mathrm{d}x.$$

将 $\mathrm{d}V$ 在 $[ a , b ]$ 上无限求和，便得

[page:265]

## 7.3 体积

$$V = \int_{a}^{b} A(x)   dx.$$

由此公式易知，夹在两个平行平面之间的两个立体，如果用任意一个平行截面去截而所得的截面面积相等，那么这两个立体的体积相等.这个结果通常称为卡瓦列里(Cavalieri)原理.卡瓦列里是17世纪意大利数学家，他在1635年提出并引用这一原理.其实这一原理，早在我国南北朝时期已由杰出的数学家祖冲之(429～ 500)和他的儿子祖暅受刘徽关于体积计算的启示提出.祖冲之父子的原文是这样说的:“缘幂势既同，则积不容异”.这里的所谓“幂”就是截面面积、“势”就是高.所以卡瓦列里提出此原理晚于祖冲之父子约1100年.

例7.7 设有一半径为a的圆柱体，用一与底面交角为 $\alpha$ 的平面去截割，如果平面通过底圆的直径，求截下部分立体的体积

解取平面与圆柱底面的交线为x轴，底面的圆心为坐标原点，建立坐标系如图7.10所示，那么底圆的方程为 $x^{2} + y^{2} = a^{2}$ .在区间 $\left[ -a, a \right]$ 上任取一点x，过该点作垂直于x轴的平面，与待求体积的立体相交，得截面为一直角三角形，它的两条直角边分别为 $\mathcal { Y }$ 与ytanα，从而它的面积为

$$A(x)=\frac{1}{2}y^{2}\tan\alpha=\frac{1}{2}(a^{2}-x^{2})\tan\alpha,$$

所以截下部分立体的体积为

$$\begin{aligned}V &= \int_{-a}^{a} A(x)   dx = \int_{0}^{a} (a^2 - x^2) \tan \alpha   dx \\&= \tan \left[ a^2 x - \frac{1}{3} x^3 \right]_{0}^{a} = \frac{2}{3} a^3 \tan \alpha.\end{aligned}$$

例7.8 求两个半径相等其轴垂直相交的圆柱面 $x^{2} + y^{2} = a^{2}$ 与 $x^{2} + z^{2} = a^{2}$ 所围成的立体的体积(图7.11).

解根据对称性，只需求出一个象限中的体积再乘以8即可.

现在过点(x,0,0)作垂直于x轴的平面.它与此物体在第一卦限所截的图形为一个正方形LKNM，其边长为 $\sqrt{a^{2}-x^{2}}$ ,因此其面积为

$$P(x) = a^{2} - x^{2}$$

于是，所求体积为

[page:266]

## 第7章 定积分的应用

$$V = 8 \int_{0}^{a} (a^2 - x^2)   dx = \frac{16}{3} a^3.$$

## 7.3.2 旋转体的体积

设有连续曲线 $y = f(x)$ ,满足

$$f(x) \geqslant 0,\quad x \in [a,b],$$

将此曲线绕x轴旋转一周，求所产生的旋转体的体积(图7.12).

为了利用式(7.6)，我们先设法写出平行截面面积 $A(x)$ .过区间 $\left[ a , b \right]$ 上任一点x，作垂直于x轴的平面，截旋转体所得横截面是一个半径为 $y = f(x)$ 的圆，其面积为

$$A(x) = \pi y^{2} = \pi f^{2}(x).$$

再利用式(7.6)，便得到旋转体的体积公式

$$V = \int_{a}^{b} A(x) \mathrm{d}x = \pi \int_{a}^{b} y^2 \mathrm{d}x = \pi \int_{a}^{b} f^2(x) \mathrm{d}x.\tag{7.7}$$

同理可得由连续曲线

$$x = \varphi(y), \quad y \in [c,d]$$

(其中 $\varphi ( y ) \geq 0 )$ 绕γ轴旋转一周所产生的旋转体体积为

$$V = \pi \int_{c}^{d} \varphi^{2}(y)   \mathrm{d}y,\tag{7.8}$$

见图7.13.

例7.9 求由椭圆 $\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}=1$ 绕x轴旋转所成旋转体的体积.

解上半椭圆的方程为 $y = \frac{b}{a} \sqrt{a^2 - x^2}$ 由式(7.7),得

$$V = \pi \int_{-a}^{a} y^2   dx = \frac{\pi b^2}{a^2} \int_{-a}^{a} (a^2 - x^2)   dx = \frac{4}{3} \pi ab^2.$$

[page:267]

## 7.3 体积

同理可得由椭圆 $\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}=1$ 绕y轴旋转所成旋转体的体积为

$$V = \frac{4}{3} \pi a^{2} b.$$

特例当 $\bar{a} = \bar{b}$ 时，即为球体体积

$$V = \frac{4}{3} \pi a^{3} \quad (a  为球体半径 ).$$

例7.10 求旋轮线的第一拱

$$x = a \left( t - \sin t \right),$$

$$y = a ( 1 - \cos t ) , \quad 0 \leqslant t \leqslant 2 \pi$$

与 $y = 0$ 所围图形由:①绕y轴旋转；②绕直线 $y = 2a$ 旋转所得的旋转体的体积$(a > 0)$ (图7.14).

解（1）记弧 $[ \widehat { O B } ]$ 上点的横坐标为

图7.14

$$x_{1}=a(t-\sin t), \quad 0 \leqslant t \leqslant \pi,$$

则弧 $[AB]$ 上相应的对称点的横坐标为

$$x_{2}=2\pi a-x_{1}=2\pi a-a(t-\sin t), \quad 0 \leqslant t \leqslant \pi.$$

设曲边梯形OABC和曲边三角形OBC绕y轴旋转所得的体积分别为 $V _ { 2 }$ 及$V _ { 1 }$ ，则由式(7.8)知，所求体积为

$$\begin{aligned} &V = V_{2} - V_{1} = \pi \int_{0}^{2a} x_{2}^{2} \mathrm{d}y - \pi \int_{0}^{2a} x_{1}^{2} \mathrm{d}y \\&= \pi \int_{0}^{\pi} [2\pi a - a(t - \sin t)]^{2} \mathrm{d}[a(1 - \cos t)] - \pi \int_{0}^{\pi} [a(t - \sin t)]^{2} \mathrm{d}[a(1 - \cos t)] \\&= 4\pi^{2}a^{3} \int_{0}^{\pi} (\pi \sin t - t \sin t + \sin^{2} t) \mathrm{d}t \\&= 6\pi^{3}a^{3}.\\ \end{aligned}$$

(2)设旋轮线第一拱与直线 $y = 2a, \quad x = 0, \quad x = 2\pi a$所围平面图形绕直线 $y = 2a$ 旋转所得的体积为$V_{0}$ ,则

$$V_{0} = \pi \int_{0}^{2\pi} (2a - y)^{2}   dx = \pi a^{3} \int_{0}^{2\pi} (1 + \cos t - \cos^{2} t - \cos^{3} t)   dt = \pi^{2} a^{3}.$$

于是所求体积为

$$V = \pi ( 2 a ) ^ { 2 } \cdot 2 \pi a - V _ { 0 } = 7 \pi ^ { 2 } a ^ { 3 } .$$

例7.11 求抛物面 $2ax = x^{2} + y^{2}$ 与上半球面$x^{2}+y^{2}+z^{2}=3a^{2}\left ( a>0,z>0 \right )$ 所围成的立体的体积(图7.15).

[page:268]

## 第7章 定积分的应用

解 两曲面都是绕z轴的旋转体，两曲面交线是一个圆.由

$$\begin{cases}x^{2} + y^{2} + z^{2} = 3a^{2}, \\x^{2} + y^{2} = 2az,\end{cases}$$

得 $\tilde { z } = a$ ，所以交线圆位于 $z = a$ 的平面上.现在用垂直于z轴的平面去截这个立体.当 $z \leqslant a$ 时，截出的圆盘半径为 $\sqrt { 2 a z }$ ，而当 $z > a$ 时截出的圆的半径为$\sqrt{3a^{2}-z^{2}}$ ，由此得

$$V = \pi \int_{0}^{a} 2 a z \mathrm{d} z + \pi \int_{a}^{\sqrt{3} a} \left( 3 a^{2} - z^{2} \right) \mathrm{d} z = \frac{\pi a^{3}}{3} \left( 6 \sqrt{3} - 5 \right).$$

## 7.3.3 柱壳法

下面再介绍一种求旋转体体积的方法，称为柱壳法

设在 $x O y$ 平面内有一块由曲线 $y = f_{1}(x), y = f_{2}(x)$ 与直线 $x = a, x = b$ 所围成的平面图形ABDC(图7.16).假定函数 $f_{1}(x)$ 与 $f_{2}(x)$ 在区间 $\left[ a , b \right]$ 上连续，且$f_{2}(x) < f_{1}(x)$ .当图形ABDC绕y轴旋转时，就产生一个旋转体，现在要求此旋转体的体积.

把平面图形分成许多平行于y轴的小条，任取位于区间 $\left[ x , x + \mathrm{d}x \right]$ 上的一条，其宽为dx，高为 $h(x) = f_{1}(x) - f_{2}(x)$ .让此小条绕y轴旋转就产生一薄柱壳，这一薄柱壳的内表面的面积为 $2\pi xh(x)$ .将它剖开并把它展平，就得到一块近似于厚度为dx，面积为 $2 \pi x h ( x )$ 的矩形薄板，其体积 $2\pi xh(x)\mathrm{d}x$ 就是薄柱壳体积的近似值，从而得柱壳体积微元

$$\mathrm{d}V = 2\pi xh(x)\mathrm{d}x,$$

所以所求旋转体的体积为

$$V = 2 \pi \int _ { a } ^ { b } x \left[ f _ { 1 } ( x ) - f _ { 2 } ( x ) \right] \mathrm{d}x.$$

例7.12 求在曲线 $8y = 12x - x^{3}$ 之上，直线 $y = 2$ 之下，从 $x = 0$ 到 $x = 2$ 的一块平面图形绕y轴旋转所产生的旋转体的体积.

[page:269]

## 7.3 体积

解图7.17中平行于y轴的典型小条的高为

$$h(x)=2-y=2-\frac{3}{2}x+\frac{1}{8}x^{3},$$

所以

$$\mathrm{d}V = 2\pi x\left(2 - \frac{3}{2}x + \frac{1}{8}x^{3}\right)\mathrm{d}x,$$

从而

$$\begin{aligned} &V = 2\pi\int_{0}^{2}\left( 2x - \frac{3}{2}x^{2} + \frac{1}{8}x^{4} \right)dx \\&= 2\pi\left[ x^{2} - \frac{1}{2}x^{3} + \frac{1}{40}x^{5} \right]_{0}^{2} = \frac{8}{5}\pi.\\ \end{aligned}$$

本例如果用垂直于y轴的平行截面法去求，则要从方程 $8y = 12x - x^{3}$ 解出x，这是比较困难的.

## 习题7.3

1. 把抛物线 $y^{2} = 4ax$ 及直线 $x = x_{0} \left( x_{0} > 0 \right)$ 所围成的图形绕x轴旋转，计算所得旋转体的体积.

2. 由 $y = x^{3} ,x = 2 ,y = 0$ 所围成的图形，分别绕x轴及y轴旋转，计算所得两个旋转体的体积.

3. 把星形线 $x^{2/3} + y^{2/3} = a^{2/3}$ 所围成的图形绕x轴旋转，计算所得旋转体的体积(图7.18).

4. 用积分方法证明球缺的体积(图7.19)为

$$V = \pi H^{2}\left(R - \frac{H}{3}\right).$$

5. 求下列已知曲线所围成的图形，按指定的轴旋转所产生的旋转体的体积:(1) $y = x^{2} , x = y^{2}$ ,绕 $y$ 轴；

[page:270]

## 第7章 定积分的应用

(2) $y = \arcsin x , x = 1 , y = 0$ ,绕x轴；

(3) $x^{2}+(y-5)^{2}=16$ ,绕x轴.

6. 求圆盘 $x^{2}+y^{2}\leqslant a^{2}$ 绕 $x = -b (b > a > 0)$ 旋转所成旋转体的体积.

7.设有一截椎体，其高为h，上、下底均为椭圆，椭圆的轴长分别为2a，2b和2A，2B，求此截锥体的体积.

8. 计算底面是半径为R的圆，而垂直于底面上一条固定直径的所有截面都是等边三角形的立体体积(图7.20).

9. 计算曲线 $y = \sin x (0 \leqslant x \leqslant \pi)$ 和x轴所围成的图形绕 $\mathcal { Y }$ 轴旋转所得旋转体的体积

10. 设抛物线 $y=ax^{2}+bx+c$ 通过点(0，0)，且当$x \in [0,1]$ 时， $y \geqslant 0 ,$ 试确定 $a , b , c$ 的值，使得抛物线$y=ax^{2}+bx+c$ 与直线 $x = 1, y = 0$ 所围图形的面积为 $\frac{4}{9}$ ，且使该图形绕x轴旋转而成的旋转体的体积最小.

11. 求由曲线 $y = x^{\frac{3}{2}}$ ,直线 $x = 4$ 及x轴所围图形绕 $y$轴旋转而成的旋转体的体积.

12. 求圆盘 $(x - 2)^{2} + y^{2} \leq 1$ 绕y轴旋转而成的旋转体的体积.

13. 求由 $y = x^{2}$ 与 $y = 2$ 所围图形绕x轴及y轴旋转而成旋转体体积.

14. 求由 $y = \operatorname{coth}\frac{x}{a}$ 与 $x = 0, x = a, y = 0$ 所围图形绕x轴旋转而成旋转体体积.

15. 求由 $y = \sin x ( 0 \leqslant x \leqslant \pi )$ 与x轴所围图形绕x轴旋转而成旋转体体积

16. 求由摆线

$$x = a(t - \sin t), \quad 0 \leqslant t \leqslant 2\pi$$

与x轴所围图形绕x轴旋转而成旋转体体积

17. 求由 $y^{2} = 2px$ 与 $y^{2}=4(x-p)^{2}(p>0)$ 所围图形绕x轴旋转而成旋转体体积

18. 求由 $x^{2}+(y-b)^{2}=a^{2}(b>a>0)$ 所围图形绕x轴旋转而成旋转体体积

19. 求由 $y = \sin x \left( 0 \leqslant x \leqslant \pi \right) , y = 0$ 所围图形绕 $x = \frac{\pi}{2}$ 旋转而成旋转体体积.

## 7.4 平面曲线的弧长和旋转体的侧面积

## 7.4.1 弧长的概念

圆周长是用圆内接正多边形的周长当边数趋于无穷时的极限来定义的.与圆周长的概念类似，可以建立一般曲线弧的长度概念

如图7.21所示，在曲线弧 $\widehat{AB}$ 上任取分点

$$A = M_{0},M_{1},M_{2},\cdots,M_{i - 1},M_{i},\cdots,M_{n} = B,$$

[page:271]

## 7.4 平面曲线的弧长和旋转体的侧面积

依次用弦将相邻两点联结起来，得到一条内接折线.记每条弦的长度为

$$\left| M _ { i - 1 } M _ { i } \right| , \quad i = 1 , 2 , \cdots , n ,$$

令 $\lambda = \max_{1 \leq i \leq n} \left| M_{i-1} M_i \right|$ .如果当分点无限增加，且 $\lambda \rightarrow 0$ 时，折线长度的极限

$$\lim_{\lambda \to 0} \sum_{i=1}^{n} \left| M_{i-1} M_i \right|$$

存在，则称此极限值为曲线弧 $\widehat{A B}$ 的长度，或弧长.这时，这段曲线弧称为可求长的.下面讨论平面曲线弧长的计算公式.

## 7.4.2 直角坐标情形

设曲线弧由直角坐标方程

$$y = f(x) , \quad a \leqslant x \leqslant b$$

给出，其中 $f(x)$ 在 $[ a , b ]$ 上具有一阶连续导数.现在来计算这曲线弧的长度.

取横坐标x为积分变量，其变化区间为 $\left[ a , b \right]$ .曲线 $y = f(x)$ 上相应于 $\left[ a,b \right]$ 上任一小区间 $\left[ x , x + \mathrm{d}x \right]$ 的一段弧的长度，可以用该曲线在点 $(x,f(x))$ 处的切线上相应的一小段的长度近似代替.而切线上这相应的小段的长度为

$$\sqrt{ \left( \mathrm{d}x \right)^{2} + \left( \mathrm{d}y \right)^{2} } = \sqrt{ 1 + y^{'2} } \mathrm{d}x ,$$

从而得弧长元素(即弧微分)

$$\mathrm{d}s = \sqrt{1 + y^{'2}}\mathrm{d}x,$$

以 $\sqrt{1 + y^{'2}}   dx$ 为被积表达式，在闭区间 $\left[ a , b \right]$ 上作定积分，便得所求弧长

$$s = \int_{a}^{b} \sqrt{1 + y^{\prime 2}}   dx.$$

例7.13两根电线杆之间的电线，由于其本身的重量，下垂成曲线型.这样的曲线叫悬链线.适当选取坐标系后，悬链线的方程为

$$y = c \operatorname { c h } \frac { x } { c } ,$$

其中c为常数.计算悬链线上介于 $x = -b$ 与 $x = b$ 之间一段弧(图7.22)的长度.

解 由于对称性，要计算的弧长为对应于x从0到b的一段曲线弧长的两倍

[page:272]

## 第7章 定积分的应用

由 $y^{\prime} = \sin \frac{x}{c}$ ，得弧长元素

$$\mathrm{d}s = \sqrt{1 + \mathrm{sh}^2 \frac{x}{c}} \mathrm{d}x = \mathrm{ch} \frac{x}{c} \mathrm{d}x.$$

因此，所求弧长为

$$s = 2 \int_{0}^{b} \operatorname{ch} \frac{x}{c} \mathrm{d}x = 2c \left[ \operatorname{sh} \frac{x}{c} \right]_{0}^{b} = 2c \operatorname{sh} \frac{b}{c}.$$

## 7.4.3 参数方程情形

设曲线弧由参数方程

$$\left\{ \begin{aligned} x = \varphi(t), \\ y = \psi(t), \end{aligned} \right. \quad \alpha \leqslant t \leqslant \beta.$$

给出，其中 $\varphi(t), \psi(t)$ 在 $[ a , \beta ]$ 上具有连续导数.现在来计算这曲线弧的长度.

取参数t为积分变量，其变化区间为 $[ \alpha , \beta ]$ 对应于 $[ \alpha , \beta ]$ 上任一小区间$\left[ t , t + \mathrm{d}t \right]$ 的小弧段的长度的近似值(弧微分)，即弧长元素为

$$\mathrm{d}s = \sqrt{(\mathrm{d}x)^{2} + (\mathrm{d}y)^{2}} = \sqrt{\varphi^{\prime 2}(t)(\mathrm{d}t)^{2} + \varphi^{\prime 2}(t)(\mathrm{d}t)^{2}} = \sqrt{\varphi^{\prime 2}(t) + \varphi^{\prime 2}(t)}\mathrm{d}t.$$

于是所求弧长为

$$s = \int _ { a } ^ { \beta } \sqrt { \varphi ^ { ' 2 } ( t ) + \psi ^ { ' 2 } ( t ) } \mathrm { d } t.$$

例7.14 计算摆线(图7.23)

$$\begin{cases}x = a(\theta - \sin \theta), \\y = a(1 - \cos \theta)\end{cases}$$

的一拱 $( 0 \leqslant \theta \leqslant 2 \pi )$ 的长度.

解弧长元素

$$\begin{aligned}\mathrm{d}s = \sqrt{a^{2}(1 - \cos \theta)^{2} + a^{2}\sin^{2}\theta}\mathrm{d}\theta \\= a\sqrt{2(1 - \cos \theta)}\mathrm{d}\theta = 2a\sin\frac{\theta}{2}\mathrm{d}\theta.\end{aligned}$$

图7.24

从而，所求弧长

$$s = \int_{0}^{2\pi} 2a\sin\frac{\theta}{2}\mathrm{d}\theta = 2a\left[ - 2\cos\frac{\theta}{2} \right]_{0}^{2\pi} = 8a.$$

例7.15 计算星形线

$$\left\{ \begin{aligned} x &= a \cos^3 t, \\ y &= a \sin^3 t \end{aligned} \right.$$

的弧长(图7.24).

解 根据对称性，只要求出它在第一象限中的一段弧长乘4即可，此时参数t是由0

[page:273]

## 7.4 平面曲线的弧长和旋转体的侧面积

变到 $\frac{\pi}{2}$ .显然

$$x^{\prime}(t) = - 3a\cos^{2}t\sin t, \quad y^{\prime}(t) = 3a\sin^{2}t\cos t,$$

因此弧长

$$\begin{aligned} &s = 4\int_{0}^{\frac{\pi}{2}}\sqrt{9a^{2}\cos^{4}t\sin^{2}t + 9a^{2}\sin^{4}t\cos^{2}t}\ dt\\ &= 12a\int_{0}^{\frac{\pi}{2}}\cos t\sin t\ dt = 12a\int_{0}^{\frac{\pi}{2}}\sin t\sin t\ dt\\ &= 6a\sin^{2}t\big|_{0}^{\frac{\pi}{2}} = 6a.\\ \end{aligned}$$

## 7.4.4 极坐标情形

设曲线弧由极坐标方程

$$r = r(\theta), \quad \alpha \leqslant \theta \leqslant \beta$$

给出，其中 $r ( \theta )$ 在 $[ \alpha , \beta ]$ 上具有连续导数，现在来计算这曲线弧的长度.

由直角坐标与极坐标的关系可得

$$\begin{cases}x = r(\theta)\cos\theta, \\y = r(\theta)\sin\theta,\end{cases}\alpha \leqslant \theta \leqslant \beta.$$

这就是以极角θ为参数的曲线弧的参数方程.于是，弧长元素为

$$\mathrm{d}s = \sqrt{x^{\prime 2}(\theta) + y^{\prime 2}(\theta)} \mathrm{d}\theta = \sqrt{r^{2}(\theta) + r^{\prime 2}(\theta)} \mathrm{d}\theta,$$

从而所求弧长为

$$s = \int _ { \alpha } ^ { \beta } \sqrt { r ^ { 2 } ( \theta ) + r ^ { ' 2 } ( \theta ) } \mathrm { d } \theta.$$

例7.16 求对数螺线 $\rho = \mathrm{e}^{m \theta} (m > 0)$ 从点 $P_{0}(\rho_{0},\theta_{0})$ 到任意一点 $( 0 , \theta )$ 的弧长.解

$$s _ { P _ { 0 } P } ^ { \frown } = \int _ { \theta _ { 0 } } ^ { \theta } \sqrt { \mathrm { e } ^ { 2 m \theta } + m ^ { 2 } \mathrm { e } ^ { 2 m \theta } } \mathrm { d } \theta = \sqrt { 1 + m ^ { 2 } } \int _ { \theta _ { 0 } } ^ { \theta } \mathrm { e } ^ { m \theta } \mathrm { d } \theta \\ = \frac { \sqrt { 1 + m ^ { 2 } } } { m } \left( \mathrm { e } ^ { m \theta } - \mathrm { e } ^ { m \theta _ { 0 } } \right) = \frac { \sqrt { 1 + m ^ { 2 } } } { m } \left( \rho - \rho _ { 0 } \right) .$$

从这个结果可以看出:

（1）对数螺线的弧长跟矢径的增量成比例

（2)对数螺线从某固定点P开始虽可向极点环绕无穷多次，但当 $\theta _ { 0 } \rightarrow - \infty$ 时，这段弧的长度却趋于有限极限 $\frac{\sqrt{1 + m^{2}}}{m}\rho.$

## 7.4.5 旋转体的侧面积

设有光滑曲线段 $y = f(x)$ ,其中

$$f(x) \geqslant 0, \quad x \in [a,b],$$

[page:274]

## 第7章 定积分的应用

将此曲线段绕x轴一周，求所产生的旋转体的侧面积F.

旋转体的侧面面积即为空间曲面的面积，而有关空间曲面的面积将在多元函数积分学中给出一般的定义.这里仅凭几何直观来导出旋转体的侧面积公式，且仍用微元法.

采用图7.25所示分割区间 $\left[ a , b \right]$ ，考虑任意一份 $\left[ x , x + \mathrm{d}x \right]$ .相应于这一份的，是

由小弧段 $M N$ 绕x轴旋转所得到的侧面积 $\Delta F$ ，它可以用切线段MT(其长度为ds)绕x轴旋转所得到的圆台的侧面积来近似代替.这个圆台的上、下底半径分别是y及 $y + \mathrm{d}y$ ,斜高为ds,于是有

$$\pi \cdot ( 上底半径 + 下底半径 ) \cdot  斜高  \quad = \pi[y+(y+dy)] \cdot ds = 2\pi yds + \pi dy \cdot ds.$$

当 $\mathrm{d}x \to 0$ 时，dy·ds是dx的高阶无穷小，略去，得到侧面积微元

$$\mathrm{d}F = 2\pi y\mathrm{d}s = 2\pi y\sqrt{1 + y^{'2}}\mathrm{d}x,$$

将上式从a到b求定积分，便得到侧面积公式

$$F = 2 \pi \int _ { a } ^ { b } y \sqrt { 1 + y ^ { ' 2 } } \mathrm { d } x .$$

当光滑曲线段AB由参数方程

$$\left\{ \begin{aligned} x = x(t), \\ y = y(t), \end{aligned} \quad \alpha \leqslant t \leqslant \beta \right.$$

给出时，侧面积公式为

$$F = 2 \pi \int _ { a } ^ { \beta } y \left( t \right) \sqrt { x ^ { ' 2 } \left( t \right) + y ^ { ' 2 } \left( t \right) } \mathrm { d } t.$$

当光滑曲线段AB由极坐标方程

$$r = r ( \theta ) , \quad \alpha \leqslant \theta \leqslant \beta$$

给出时，则可选θ作为参数，侧面积公式为

$$F = 2 \pi \int _ { \alpha } ^ { \beta } \left[ r ( \theta ) \sin \theta \right] \sqrt { r ^ { 2 } ( \theta ) + r ^ { ' 2 } ( \theta ) } \mathrm { d } \theta.$$

例7.17 求旋轮线

$$\left\{ \begin{aligned} x = a(t - \sin t), \\ y = a(1 - \cos t), \end{aligned} \right. \quad 0 \leqslant t \leqslant 2\pi$$

绕x轴旋转所得旋转体的侧面积

解因为

[page:275]

## 7.4 平面曲线的弧长和旋转体的侧面积

$$\mathrm{d}s = 2a \left| \sin \frac{t}{2} \right| \mathrm{d}t,$$

所以

$$\begin{aligned}P &= 2\pi\int_{0}^{2\pi}a(1 - \cos t) \cdot 2a\left| \sin\frac{t}{2} \right|dt \\&= 4\pi a^{2}\int_{0}^{2\pi}(1 - \cos t)\sin\frac{t}{2}dt \\&= 8\pi a^{2}\int_{0}^{2\pi}\sin^{3}\frac{t}{2}dt = 16\pi a^{2}\int_{0}^{\pi}\sin^{3}u\ du \\&= - 16\pi a^{2}\int_{0}^{\pi}(1 - \cos^{2}u)\cos u \\&= - 16\pi a^{2}\left( \cos u - \frac{1}{3}\cos^{2}u \right)\bigg|_{0}^{\pi} = \frac{64}{3}\pi a^{2}.\end{aligned}$$

例7.18 求心脏线

$$r = a ( 1 + \cos \theta ) , \quad a > 0$$

绕极轴旋转而成的旋转体的侧面积S

解因为

$$\mathrm{d}s = \sqrt{r^{2} + r^{\prime 2}} \mathrm{d}\theta = 2a \left| \cos \frac{\theta}{2} \right| \mathrm{d}\theta,$$

且在上半平面上此曲线对应参数θ为 $0 \leq \theta \leq \pi$ ,因此

$$\begin{aligned} &P = 2\pi\int_{0}^{\pi}a(1 + \cos\theta)\sin\theta\mathrm{d}\theta \left| \cos\frac{\theta}{2} \right|\mathrm{d}\theta\\ &= 4\pi a^{2}\int_{0}^{\pi}2\cos^{2}\frac{\theta}{2} \cdot 2\sin\frac{\theta}{2}\cos\frac{\theta}{2} \cdot \cos\frac{\theta}{2}\mathrm{d}\theta\\ &= 16\pi a^{2}\int_{0}^{\pi}\cos^{4}\frac{\theta}{2}\sin\frac{\theta}{2}\mathrm{d}\theta = \frac{32}{5}\pi a^{2}.\\ \end{aligned}$$

例7.19 求旋转椭球体的表面积.

解设此椭球体是由

$$\frac{x^{2}}{a^{2}}+\frac{y^{2}}{b^{2}}=1,\quad a>b$$

绕x轴旋转而得.此时

$$y^{2} = b^{2} - \frac{b^{2}}{a^{2}}x^{2}$$

因而有

$$yy^{\prime} = - \frac{b^{2}}{a^{2}}x$$

及

[page:276]

## 第7章 定积分的应用

$$\begin{aligned}y\sqrt{1 + y^{\prime 2}} = \sqrt{y^{2} + (yy^{\prime})^{2}} = \sqrt{b^{2} - \frac{b^{2}}{a^{2}}x^{2} + \frac{b^{4}}{a^{4}}x^{2}} \\= \frac{b}{a}\sqrt{a^{2} - \frac{a^{2} - b^{2}}{a^{2}}x^{2}} = \frac{b}{a}\sqrt{a^{2} - \varepsilon^{2}x^{2}}\end{aligned}$$

其中

$$\varepsilon = \frac{\sqrt{a^{2} - b^{2}}}{a}$$

是椭圆的离心率.

这样一来，旋转椭球体的表面积为

$$\begin{aligned} &p = 2\pi \frac{b}{a}\int_{-a}^{a} \sqrt{a^2 - \varepsilon^2 x^2}   dx = 4\pi \frac{b}{a}\int_{0}^{a} \sqrt{a^2 - \varepsilon^2 x^2}   dx \\&= 4\pi \frac{b}{a}\left(\frac{1}{2}x\sqrt{a^2 - \varepsilon^2 x^2} + \frac{a^2}{2\varepsilon}\arcsin\frac{\varepsilon x}{a}\right)\bigg|_{0}^{a} \\&= 2\pi \frac{b}{a}\left(a\sqrt{a^2 - \varepsilon^2 x^2} + \frac{a^2}{\varepsilon}\arcsin\varepsilon\right) \\&= 2\pi b\left(b + \frac{a}{\varepsilon}\arcsin\varepsilon\right).\\ \end{aligned}$$

如果此椭圆绕y轴作旋转，则此时旋转体表面积

$$P_{1} = 2\pi \int_{-b}^{b} x \sqrt{1 + x^{'2}}   dy.$$

和上面一样，可以算出(只是将a与b对换以及将x换成y即可)

$$x\sqrt{1+x^{'2}}=\frac{a}{b}\sqrt{b^{2}+\frac{a^{2}-b^{2}}{b^{2}}x^{2}}$$

因而

$$\begin{aligned}P_{1} &= 2\pi\int_{-b}^{b} \frac{a}{b} \sqrt{b^{2} + \frac{a^{2} - b^{2}}{b^{2}}x^{2}}   dx \\&= 2\pi\frac{a}{b} \frac{b^{3}}{\sqrt{a^{2} - b^{2}}} \left[ \frac{\sqrt{a^{2} - b^{2}}}{b^{2}}x\sqrt{\frac{a^{2} - b^{2}}{b^{4}}x^{2} + 1} \right] \\&+ \ln\left[ \frac{\sqrt{a^{2} - b^{2}}}{b^{2}}x + \sqrt{\frac{a^{2} - b^{2}}{b^{4}}x^{2} + 1} \right]_{0}^{b} \\&= 2\pi a\left[ a + \frac{b^{2}}{\sqrt{a^{2} - b^{2}}}\ln\frac{\sqrt{a^{2} - b^{2}} + a}{b} \right].\end{aligned}$$

习题7.4

1. 计算曲线 y=lnx 上相应于 $\sqrt{3} \leq x \leq \sqrt{8}$ 的一段弧长.

[page:277]

## 7.4 平面曲线的弧长和旋转体的侧面积

2. 计算曲线 $y=\frac{\sqrt{x}}{3}(3-x)$ 上相应于 $1 \leq x \leq 3$ 的一段弧的长度(图7.26).

3. 计算半立方抛物线 $y^{2} = \frac{2}{3}(x - 1)^{3}$ 被抛物线 $y^{2} = \frac{x}{3}$截得的一段弧的长度

4. 计算抛物线 $y^{2} = 2p x$ 从顶点到这曲线上的一点$M(x,y)$ 的弧长.

图7.26

5.将绕在圆(半径为a)上的细线放开拉直，使细线与圆周始终相切，细线端点画出的轨迹叫做圆的渐伸线，其方程为

$$x = a(\cos t + t\sin t), \quad y = a(\sin t - t\cos t).$$

算出此曲线上对应于 $0 \leq t \leq \pi$ 的一段弧的长度(图7.27).

6. 在摆线 $x = a(t - \sin t), y = a(1 - \cos t)$ 上求分摆线第一拱成1:3的点的坐标.

7. 求曲线 $\rho \theta = 1$ 相应于 $\frac { 3 } { 4 } \leq \theta \leq \frac { 4 } { 3 }$ 的一段弧长.

8. 求心形线 $\rho = a ( 1 + \cos \theta )$ 的全长.

9. 求抛物线 $y=\frac{1}{2}x^{2}$ 被圆 $x^{2} + y^{2} = 3$ 所截下的有限部分的弧长.

10. 求抛物线 $y = a x^{2}$ 在 $x = - b$ 到 $x = b$ 之间的弧长.

11. 求阿基米德螺线 $r = a \theta$ 从θ=0到 $\theta = \theta_{0}$ 之间的弧长.

12. 求曲线 $x = \mathrm{e}^{t} \sin t, y = \mathrm{e}^{t} \cos t$ 从 t=0 到 t=1一段弧长.

13. 求 $y = \ln(1 - x^{2})$ 上相应于 $0 \leq x \leq \frac { 1 } { 2 }$ 的一段弧长.

14. 求曲线 $x = a \cos^4 t, y = a \sin^4 t$ 的弧长.

15. 求曲线 $r = a \mathrm{e}^{m} (m > 0)$ 当 $0 \leq r \leq a$ 时的弧长.

16. 求曲线 $y = \ln\cos x$ 由x=0到 $x=a\left(0<a<\frac{\pi}{2}\right)$ 一段弧的弧长.

17. 证明:悬链线 $y = a \operatorname{ch} \frac{x}{a} (a > 0)$ 自点A(0,a)到 $P(x,y)$ 的弧长

$$s = \sqrt{y^{2} - a^{2}}.$$

18. 设一半径为R的球，被相距 $H(0 < H < 2R)$ 的两平面所截，求所得球台的侧面积

19. 求半径为R的球的表面积

20. 求抛物线 $y^{2} = 4ax$ 由顶点到 $x = 3a$ 的一段弧绕x轴旋转所得的旋转体的侧面积

21. 求双纽线 $r^{2}=a^{2}\cos 2\theta$ 绕极轴旋转所得的旋转体的侧面积

22. 求悬链线 $y = a \operatorname{ch} \frac{x}{a}$ 相应于 $\vert x \vert \leq b$ 的一段弧绕x轴及y轴旋转所得的旋转体的侧面积.

[page:278]

## 第7章 定积分的应用

23. 求曲线 $y = \tan x \left( 0 \leqslant x \leqslant \frac{\pi}{4} \right)$ 绕x轴旋转所得的旋转面的面积

24. 求 $x^{2/3} + y^{2/3} = a^{2/3}$ 绕x轴旋转所得的旋转体的侧面积

## 7.5 功 水压力和引力

## 7.5.1 变力沿直线所做的功

由中学物理知，一个物体做直线运动，且在运动的过程中一直受跟运动方向一致的常力F的作用，那么当物体有位移s时，力F所做的功为

$$W = F _ { \mathbb { S } } ,$$

现在来考虑变力F沿直线做功的问题.该物体在x轴上运动，且在从a移动到b的过程中，始终受到跟x轴的正向一致的力F的作用(图7.28).由于当物体位于x轴上的不同位置时，所受力也各异，也就是说，力F的大小随物体所在的位置而定，因此它是一个 $\mathcal { X }$ 的函数，可设为 $F = \varphi(x)$ ，且假定 $\varphi ( x )$ 在区间 $[ a , b ] .$ 上是连续的.

如果把区间 $[ a , b ]$ 任意分成许多子区间，并任意取出一个子区间 $\left[ x , x + \mathrm{d}x \right]$ 来考虑，因为力 $\varphi ( x )$ 是连续函数，子区间又很小，所以力的大小在这个子区间上的变化就甚微，所以可以把力F在子区间 $\left[ x , x + \mathrm{d}x \right]$ 左端点处值 $\varphi(x)$ 看成是物体经过这一子区间时所受的力，从而 $\varphi(x) \mathrm{d}x$ 就是物体从x移动到 $x + \mathrm{d}x$ 时，力F所做的功的近似值.因此功元素为

$$\mathrm{d}W = \varphi(x)\mathrm{d}x.$$

所以当物体从a沿x轴移动到b时，作用在其上的力 $F = \varphi(x)$ 所做的功为

$$W = \int_{a}^{b} \varphi(x)   dx.$$

例7.20有一弹簧，用5N的力可以把它拉长0.01m.求把弹簧拉长0.1m，力所做的功(图7.29).

[page:279]

## 7.5 功水压力和引力

解由物理学知，使弹簧产生伸缩变形的力，在伸缩量不大的情况下，与伸缩量成正比.因此，这个力的大小可用kx来表示，即

$$F = k x .$$

其中x为伸缩量 $k > 0$ 为比例常数(称为弹簧的倔强系数).

对本题来说， $x > 0$ ，且当 $x = 0.01$ 时， $F { = } 5 .$ 所以

$$k = \frac{5}{0.01} = 500.$$

因此

$$F = 5 0 0 x .$$

从而要求将弹簧拉长0.1m力F所做的功，只需将功元素

$$\mathrm{d}W = 500x\mathrm{d}x$$

在区间[0,0.1]上积分，即

$$W = \int_{0}^{0.1} 500x   dx = 500 \left[ \frac{x^2}{2} \right]_{0}^{0.1} = 2.5 J$$

例7.21 自地面垂直向上发射火箭，火箭质量为m.试计算将火箭发射到距离地面的高度为h处所做的功，并由此计算第二宇宙速度(即火箭脱离地球引力范围的最小速度)(图7.30).

解 设地球质量为M,半径为R.取坐标系如图7.30所示.只需写出在区间 $\left[ R , R + h \right]$ 的任一点r处，对火箭所需施加的外力 $F(r)$

由实验知，地球对位于点r处的火箭的引力的大小为

图7.30

$$f = G \frac { M m } { r ^ { 2 } } .$$

其中r为火箭到地球中心O的距离 $G > 0$ ，为引力常数.

为了发射火箭，必须克服地球的引力.用于克服地球引力的外力 $F(r)$ 与地球引力大小相等，因此

$$F(r) = G \frac{Mm}{r^2}.$$

于是，将火箭自地面(即 $r { \equiv } R$ 处)发射到距离地面高度为h(此时 $r = R + h$ 时所需做的功为

$$\begin{aligned}W_{1} &= \int_{R}^{R + h}F(r)\mathrm{d}r = GMm\int_{R}^{R + h}\frac{1}{r^{2}}\mathrm{d}r \\&= GMm\left(\frac{1}{R} - \frac{1}{R + h}\right).\end{aligned}$$

上式引力常数G可以这样确定:当火箭在地面时，地球对火箭的引力大小为$f = G \frac{Mm}{R^{2}}$ ，且应该等于重力 $m g$ ,即

[page:280]

## 第7章 定积分的应用

$$G \frac{Mm}{R^2} = mg \quad (g  为重力加速度 ),$$

于是 $G = R^{2}g/M$ 所以

$$W_{1}=\frac{R^{2}g}{M}Mm\left(\frac{1}{R}-\frac{1}{R+h}\right)=mgR^{2}\left(\frac{1}{R}-\frac{1}{R+h}\right)$$

这就是将火箭自地面发射到距离地面高度为h处所需做的功

为了使火箭脱离地球引力范围，也就是把火箭发射到无穷远处，这时所需做的功为

$$W_{2}=\lim_{h \to +\infty}W_{1}=mgR^{2}\lim_{h \to +\infty}\left(\frac{1}{R}-\frac{1}{R+h}\right)=mgR.$$

由能量守恒定律， $W_{2}$ 应等于外界所给予火箭的动能 $\frac{1}{2}mv_{0}^{2}(v_{0}$ 为火箭离开地面的初速度)，即

$$mgR = \frac{1}{2}mv_{0}^{2},$$

解得

$$v _ { 0 } \equiv \sqrt { 2 g R } .$$

将 $g=9.8  m/s ^2,R=6371  km =6.731 \times 10^6  m$ 代入上式，得

$$v_{0}=\sqrt{2 \times 9.8 \times 6.371 \times 10^{6}}  m/s =11.2 \times 10^{3}  m/s$$

这就是第二宇宙速度

例7.22有一圆柱形大蓄水池，直径为20m，高为30m，内盛有水，水深为 $2 7 \mathrm { m } .$ 求将水从池口全部抽出所做的功

解 建立坐标系如图7.31所示，水深区间为[3,30].考虑微小区间 $\left[ x , x + \mathrm{d}x \right]$ 上的水层，这一水层到池口的距离即可视为 ${ \mathcal { X } } .$由于水的比重为 $9800\mathrm{N/m^{3}}$ ，所以功元素为

$$\mathrm{d}W = \pi \cdot 10^{2} \cdot 9800x\mathrm{d}x = 9.8 \times 10^{5}x\mathrm{d}x$$

从而所求的功为

$$W = \int_{3}^{30} 9.8 \times 10^{5} \pi x \mathrm{d}x = 9.8 \times 10^{5} \pi \left[ \frac{x^{2}}{2} \right]_{3}^{30} = 1.4 \times 10^{9} \mathrm{J}.$$

## 7.5.2 静止液体对薄板的侧压力

设有一薄板垂直放在一均匀的静止液体中，求液体对薄板的侧压力P.

因为总可以把任意形状的薄板分成若干个曲边梯形的薄板，所以只需考虑形状

[page:281]

## 7.5 功 水压力和引力

为曲边梯形的薄板.取直角坐标系Oxy如图7.32，y轴在水平面上，向右为正向，x轴垂直向下，向下为正向.设薄板的底边位于x轴上，而平行于y轴的两条边的方程分别为 $x =$ $a , x = b$ ，又设曲边的方程为 $y = f(x)$ ,其中 $f ( x )$为x的连续函数.

考虑 $\left[ x , x + \mathrm{d}x \right]$ 对应的一小条薄板.只要分割足够细，这一小横条所受液体的侧压力 $\Delta P$近似等于当它水平地放在深度为x的位置时所受液体的垂直压力；而后者等于以小横条为底、以x为高的液体柱的重量.当dx充分小时，用小矩形的面积f(x)dx来近似代替小横条的面积，于是液体柱的体积近似为 $xf(x)\mathrm{d}x$ ,从而

$$\mathrm{d}P = \rho g x f(x) \mathrm{d}x,$$

其中 $\rho$ 为液体的密度； $g=9.8  N/kg$

因此，所求侧压力为

$$P = \int_{a}^{b} \mathrm{d}P = \rho g \int_{a}^{b} x f(x) \mathrm{d}x.$$

例7.23有一薄板的形状为等腰梯形，其下底为10m，上底为6m，高为5m，已知此薄板垂直地放在水中，下底沉没于水面下的距离是20m.求水对于薄板的压力P.

解如图7.33所示，用梯形ABCD表示此薄板.由对称性，只需计算薄板的一半所受的侧压力 $P / 2 ,$ 为此，需先求出直线BC的方程.由假设，B，C两点的坐标分别是(20，5)与(15,3)，由此立即得到BC的方程

$$y = \frac{2}{5}x - 3.$$

水的密度为 $\rho = 1000   kg/m ^3$ ,因此

$$\frac{P}{2} = \rho g \int_{15}^{20} x \left( \frac{2}{5} x - 3 \right) \mathrm{d}x = 3470833 \mathrm{N},$$

即

$$P \equiv 6941666\mathrm{N}.$$

## 7.5.3 引力

从万有引力定律知，质量为 $m _ { 1 } , m _ { 2 }$ 的两质点间的引力，其方向沿着两质点的连

[page:282]

## 第7章 定积分的应用

线，其大小与两质点质量的乘积成正比，与两质点间距离r的平方成反比，即

$$F = G \frac{m_1 m_2}{r^2},$$

其中 $G > 0$ ，为引力常数.

如果要计算一个物体对一个质点的引力，或者两个物体之间的引力，一般来说，要用到重积分.但是对于某些比较简单的情形，也可以用定积分计算.

例7.24设有一均匀细杆，长为2l，质量为M.另一质量为m的质点A，位于细杆所在直线上，与杆的近端的距离为a(图7.34).求细杆对质点的引力F.

解取坐标系如图7.34所示，质点A位于原点.仍用微元法，分割区间$\left[ a , a + 2 l \right]$ ，任取一份 $\left[ x , x + \mathrm{d}x \right]$ .相应的小段细杆可近似看成一个位于x处，质量为$\frac{M}{2l}\mathrm{d}x$ 的质点.由万有引力定律知，这一小段对质点A的引力为

$$\mathrm{d}F = G \frac{\left( \frac{M}{2l} \mathrm{d}x \right) m}{x^2} = \frac{GMm}{2l} \cdot \frac{1}{x^2} \mathrm{d}x.$$

从 $\alpha$ 到 $a + 2 l$ 求定积分，便得到细杆对质点的引力

$$F = \int_{a}^{a + 2l} \frac{GMm}{2l} \cdot \frac{1}{x^2} \mathrm{d}x = \frac{GMm}{a(2l + a)}.$$

例7.25细杆、质点同例7.24，但质点A位于细杆的垂直平分线上，距杆的中心为a.求细杆对质点的引力F.

解 取坐标系如图7.35所示

此例与例7.24不同.例7.24中细杆上各小段对质点A的引力虽然大小不同，方向却相同.因为力的都朝着细杆，所以可以将引力微元相加，得到总的引力.其中只计

[page:283]

## 7.5功水压力和引力

算了总引力的大小F，而方向，由于朝着细杆，因而未特别说明.此例的情况不一样，细杆上各小段对质点A的引力不仅大小不同，而且方向也不同.这样，各段对质点的引力不能像例7.24那样相加，而必须利用矢量的加法.也就是说，应把每一小段对质点的引力分解为x分量与y分量，然后按分量相加，得到总引力的x分量 $F_{ 元 }$ 与 $\mathcal { Y }$ 分量 $F_{y},$ 下面根据这一想法，用微元法来求总引力F.

设总引力为 $F = \left\{ F_{x}, F_{y} \right\}$ .由于细杆是均匀的，且质点A关于细杆的位置具有对称性，因此总引力F的x分量 $F_{x} = 0$ (细杆左右两端的对称的各段，对质点A的引力在x方向的分量互相抵消)，从而只需计算 $F_{y}$ 4

分割区间[一l,l]，任取一份 $\left[ x , x + \mathrm{d}x \right]$ .这一小段细杆可近似看作位于x处的一个质点，其质量为 $\frac{M}{2l}\mathrm{d}x$ ，到质点A的距离为 $\sqrt{x^{2}+a^{2}}$ 因此，由万有引力定律知，这一小段对质点A的引力 $\mathrm{d}F$ 的大小为

$$\left| \mathrm{d}F \right| = G \frac{\left( \frac{M}{2l} \mathrm{d}x \right) m}{\left( \sqrt{x^2 + a^2} \right)^2} = \frac{GMm}{2l} \cdot \frac{1}{x^2 + a^2} \mathrm{d}x,$$

引力 $\mathrm { d } F$ 的方向朝着点x.易知 $\mathrm { d } F$ 的y分量为

$$\begin{aligned}\mathrm{d}F_{y} &= - \left| \mathrm{d}F \right| \cos \theta = - \left| \mathrm{d}F \right| \frac{a}{\sqrt{x^{2} + a^{2}}} \\&= - \frac{GMma}{2l} \cdot \frac{1}{\left( x^{2} + a^{2} \right)^{3/2}} \mathrm{d}x,\end{aligned}$$

式中负号表示dF与正y轴的夹角为钝角.将上式从一l到l求定积分，便得到总引力$F$ 的y分量

$$\begin{aligned}F_{y} = & \int_{- l}^{l}-\frac{GMma}{2l} \cdot \frac{1}{(x^{2}+a^{2})^{3 / 2}} \mathrm{d}x \\= & -\frac{GMma}{l} \int_{0}^{l} \frac{1}{(x^{2}+a^{2})^{3 / 2}} \mathrm{d}x = -\frac{GMm}{a \sqrt{l^{2}+a^{2}}}\end{aligned}$$

于是细杆对质点A的引力为

$$F = \left\{ 0 , - \frac { G M m } { a \sqrt { l ^ { 2 } + a ^ { 2 } } } \right\} ,$$

即细杆对质点A的引力大小为 $\frac{GMm}{a\sqrt{l^{2}+a^{2}}}$ ，其方向沿着细杆的垂直平分线并指向细杆.

[page:284]

## 第7章 定积分的应用

## 习题7.5

1. 由实验知道，弹簧在拉伸过程中，需要的力F(N)与伸长量s(cm)成正比，即

$$F = k s \quad (k   是比例常数 ).$$

如果把弹簧由原长拉伸6cm，计算所做的功

2. 直径为20cm、高为80cm的圆筒内充满压强为 $10N/cm^{2}$ 的蒸汽.设温度保持不变，要使蒸汽体积缩小一半，问需要做多少功？

3. 一颗人造地球卫星的质量为173kg，在高于地面630km处进入轨道.问把这颗卫星从地面送到630km的高空处，克服地球引力要做多少功？已知 $g=9.8\mathrm{~m/s^{2}}$ ，地球半径 $R = 6370  km$

4. 一物体按规律 $x = c t^{3}$ 做直线运动，介质的阻力与速度的平方成正比.计算物体由 $x = 0$移至 $x = a$ 时，克服介质阻力所做的功.

5.用铁锤将一铁钉击入木板，设木板对铁钉的阻力与铁钉击入木板的深度成正比，在击第一次时，将铁钉击入木板1cm.如果铁锤每次锤击铁钉所做的功相等，问锤击第二次时，铁钉又击入多少?

6.设一圆锥形储水池，深15m，口径20m，盛满水，今以泵将水吸尽，问要做多少功？

7.半径为r的球沉入水中，球的上部与水面相切，球的密度与水相同，现将球从水中取出，需做多少功?

8. 如果10N的力能使弹簧伸长1cm，现在要使这弹簧伸长10cm，问需做多少功？

9. 有一弹簧，原长1m，每压缩1cm需力0.05N.若从80cm长压缩到60cm长，问外力做功多少?

10.有一横截面面积为 $S = 20  m ^2$ ，深为5m的水池，装满了水，要把池中的水全部抽到高为10m的水塔顶上去，要做多少功？

11.有一长l的细杆，均匀带电，总电量为Q.在杆的延长线上，距A端为 $\gamma _ { 0 } ^ { * }$ 处，有一单位正电荷.求这单位正电荷所受的电场力.如果此单位正电荷由局杆端A为a处移到距杆端b处，电场做的功是多少？

12.有一矩形闸门，宽2m，高3m，水面超过门顶2m.求闸门上所受的水压力.

13.洒水车上的水箱是一个横放的椭圆柱体，椭圆水平轴长2m，竖直轴长1.5m.当水箱装满水时，计算水箱的一个端面所受的压力

14.有一等腰梯形闸门，它的两条底边各长10m和6m，高为20m.较长的底边与水面相齐.计算闸门的一侧所受的水压力.

15.一底为8cm、高为6cm的等腰三角形片，铅直地沉没在水中，顶在上，底在下且与水面平行，而顶离水面3cm，试求它每面所受的压力.

16.边长为a和b的矩形薄板，与液面成α角斜沉于液体内，长边平行于液面而位于深h处，设 $a > > b$ ，液体的密度为 $\rho_{1}$ 试求薄板每面所受的压力.

17. 设有一长度为l、线密度为 $\mu$ 的均匀细直棒，在与棒的一端垂直距离为 $\mathcal { Q }$ 单位处有一质量为m的质点M，试求这细棒对质点M的引力.

18.设有一半径为 $R ,$ 中心角为 $\varphi$ 的圆弧形细棒，其线密度为常数 $\mu .$ 在圆心处有一质量为

[page:285]

## 7.6 本章内容对开普勒问题的应用

m的质点M.试求这细棒对质点M的引力.

19. 设星形线 $x = a \cos^3 t, y = a \sin^3 t$ 上每一点处的线密度的大小等于该点到原点距离立方，在原点O处有一单位质点，求星形线在第一象限的弧段对这质点的引力.

20.设有两均匀细杆，长度分别为 $l_{1} ; l_{2}$ ，质量分别为 $M_{1},M_{2}$ ，它们位于同一条直线上，相邻两端点之距离为a，试证二者之间的引力为

$$F = \frac{m_{1}m_{2}}{l_{1}l_{2}}G\ln\frac{(a + l_{1})(a + l_{2})}{a(a + l_{1} + l_{2})}.$$

21.一金属棒长3m，离棒左端xm处的线密度为 $\rho(x)=\frac{1}{\sqrt{x+1}}(\mathrm{kg/m})$ .问x为何值时，$[ 0 , x ]$ 一段的质量为全棒质量的一半.

22.今有一细棒，长度为10m，已知距左端点x米处的线密度是 $\rho(x) = (6 + 0.3x)    kg/m$ 求这个细棒的质量.

23. 某质点作直线运动，速度为

$$V = t^{2} + \sin 3t$$

求质点在时间间隔T内所经过的路程

24.一质点在阻力影响下做匀减速直线运动，速度每秒减少2m，若初速度为 $25 m/s.$ 问质点能走多远?

25.油类通过油管时，中间流速大，越靠近管壁流速越小.实验确定，某处的流速v和该处到管子中心的距离r有关系式 $v = k(a^{2} - r^{2})$ ，其中k为比例常数；a为油管半径.求通过油管的流量(图7.36).

## 7.6 本章内容对开普勒问题的应用

已经推导出求弧长的公式

$$s = \int _ { a } ^ { t } \sqrt { x ^ { \prime 2 } ( t ) + y ^ { \prime 2 } ( t ) } \mathrm { d } t ,$$

[page:286]

## 第7章 定积分的应用

所以

$$\frac{\mathrm{d}s}{\mathrm{d}t} = \sqrt{\left( x^{\prime}(t) \right)^{2} + \left( y^{\prime}(t) \right)^{2}}.$$

也已推导出面积计算公式

$$A ( \theta ) = \int _ { a } ^ { \theta } \frac { 1 } { 2 } r ^ { 2 } ( \theta ) \mathrm { d } \theta = \frac { 1 } { 2 } \int _ { a } ^ { \theta } r ^ { 2 } ( \theta ) \mathrm { d } \theta ,$$

所以

$$\frac{\mathrm{d}A}{\mathrm{d}t} = \frac{1}{2} r^2 \frac{\mathrm{d}\theta}{\mathrm{d}t}.$$

且也已推导出长半轴为 $a$ ，短半轴为 $b$ 的椭圆的面积为 $\pi a b .$

[page:287]

## 习题答案

# 第1章

习题1.1

1. (1) $x \geqslant - \frac { 2 } { 3 }$ ; (2) $x \neq \pm 1;$ (3) $( - 2,2 )$ ； (4) $x \ne k\pi + \frac{\pi}{2} - 1, k \in \mathbb{Z};$

(5) $[ 2 , 4 ] ;$ (6) $( - 1, + \infty )$ ; (7) $x > - 1$ 且 $x \notin \mathbb { Z } ,$

2. (1) $\left[0,100\right];$ (2) $( - \infty , 1 ]$ (3) $\left[0,\frac{1}{2}\right]$ ; (4) $(1, +\infty)$

3. $V = \frac{(2\pi - \alpha)^{2}R^{3}}{24\pi^{2}}\sqrt{\alpha(4\pi - \alpha)}, \alpha \in (0,2\pi).$

4.（1）不同，定义域不同；（2）不同，对应法则不同；

（3）相同，定义域与对应法则都相同；（4）不同，定义域不同；

(5)不同，定义域不同；(6)不同，定义域不同；

(7)相同，定义域与对应法则都相同；(8）不同，定义域不同；

（9）相同，定义域与对应法则都相同；（10）相同，定义域与对应法则都相同. 5-7. 略.

8.（1）偶函数；（2）非奇非偶函数；（3）偶函数；（4）奇函数；（5）非奇非偶函数；

(6）偶函数；（7)奇函数；（8）奇函数.

9. （1）周期函数， $T = 2\pi;$ （2) 周期函数， $T = \frac{\pi}{2}$ ；（3）周期函数，T=2；

（4）非周期函数；（5）周期函数， $T { = } \pi .$

10. (1) $y = x^{3} - 1;$ (2) $y=\frac{1-x}{1+x};$ (3) $y = \frac{b - dx}{cx - a}$ (4) $y = \frac{1}{3}\arcsin\frac{x}{2}$

(5) $y = \mathrm{e}^{x - 1} - 2$ (6) $y = \log_{2} \frac{x}{1 - x}$ (7) $y = x + \sqrt{1 + x^{2}}$

11. (1) $[ - 1 , 1 ]$ (2) $\left[ 2 k \pi , ( 2 k + 1 ) \pi \right] , k \in Z ;$ (3) $\left[ -a, 1-a \right]$

(4) 若 $a > \frac { 1 } { 2 }$ ，定义域为空集；若 $a = \frac{1}{2}$ ，定义域为 $\left\{ \frac{1}{2} \right\}$

若 $0 < a < \frac{1}{2}$ ，定义域为 $\left[ a,1 - a \right]$

12. $f[g(x)]=\begin{cases}1, & x<0, \\0, & x=0, \\-1, & x>0.\end{cases} \quad g[f(x)]=\begin{cases}\mathrm{e}, & |x|<1, \\1, & |x|=1, \\\mathrm{e}^{-1}, & |x|>1.\end{cases}$

[page:288]

## 习题答案

2. 证明略，反例如 $x_{n} = (-1)^{n}$

3-4. 略.

5. $n > > N$ 时 $x_{n} \equiv a.$

6-7. 略.

习题2.2

1. 略.

2. $f(0^{+}) = f(0^{-}) = 1$ ，极限存在. $\varphi(0^{+}) = 1, \varphi(0^{-}) = -1$ ，极限不存在.

3-4. 略.

5. $-1 = f(0^{-}) \neq f(0^{+}) = 0$ ,所以x→0时f(x)极限不存在；$f(1^{+}) = f(1^{-}) = 1$ ,所以x→1时f(x)极限存在.

6-12. 略.

习题2.3

1. 不一定.

2. 略.

3. (1)2; (2) 1.

4. 略.

5. 无界；不是无穷大

6. 略.

7. $x = \pm \sqrt{2}$ 为两条铅直渐近线，y=0为一条水平渐近线.

习题2.4

(1)-9; (2) $0 ;$ (3) $2 ;$ (4) $\frac{1}{2}$ ； (5) 0; (6) $2 ;$ (7) $\frac{1}{2}$ ; (8)-1;

(9) $\frac{1}{3}$ ;(10) $\frac{1}{2}$ ; (11) $1 , a \geq 1$ 时； $0,\bar{a}=1$ 时 $= 1 , a < 1$ 时；（12)∞；

(13) $\bigcirc \bigcirc ;$ (14) $\frac{1}{2};$ (15) $\frac { 1 5 } { 2 } .$ (16) $\frac{5}{3}$ (17) $\frac { 1 } { \sqrt { 2 a } }$ ; (18) $-\frac{1}{2\sqrt{2}}$

(19)-1;(20) $\frac{1}{2}$ ； (21) 0; (22)0.

习题2.5

1. 略.

2. (1)2; (2) $\frac{1+\sqrt{5}}{2}$ ; (3) 0; (4) $\max_{1 \leq i \leq k}$

3. (1) $\omega ;$ (2)3;(3)1;(4)2;(5) $x ;$ (6) $\frac{\alpha}{\beta}$ ;(7) $一  \sin a$ ;(8) $\mathrm { c o s } a$ ; (9) 1; (10) $\frac{1}{2} ;$ (11)1; (12) 0; (13)0; (14) $\frac { 1 } { 4 } ;$ (15) $\frac{1}{2}$

4. (1) $\mathrm{e}^{-1}$ ; (2) $\mathrm{e}^{2} ;$ (3) $\mathrm{e}^{2};$ (4) $\mathrm{e}^{-k} ;$ (5) $a = \ln 2$ ; (6) $\mathrm{e}^{-1}$ ;(7) $\mathrm{e}^{-1}$ ; (8) $\mathrm{e}^{-\frac{a^{2}}{2}}$ ; (9) 1.

5. 略.

[page:289]

习题2.6

1. $x^{2} = x^{3}$ 是高阶无穷小.

2. 是同阶无穷小.与 $\frac{1}{2}(1 - x^{2})$ 等价，与 $1 = x^{3}$ 不等价.

3. 略.

4. (1) $\frac{3}{2} :$ (2) $n > m$ 时为 $0 , \bar { n } = \bar { m }$ 时为 $1,n < m$ 时为∞；(3) $\frac{1}{2}$

5. 略.

6. (1)2; (2) $\frac{1}{2}$ ；(3)1； (4)3; (5) $\frac{1}{3}$ ； (6)1;； (7)1; (8) 3.

7. (1) $\frac{2}{3} ;$ (2) 1.

习题2.7

1. （1）处处连续；（2) $x { = } - 1$ 为间断点，其他地方连续.

2.（1）x=1为第一类跳跃间断点；（2) $x = -1$ 为第二类无穷间断点；

(3）x=1为第一类可去间断点；（4) $x = \frac{n\pi}{2} - \frac{\pi}{12}, n \in \mathbb{Z}$ 为第二类无穷间断点；

(5）无间断点；（6）x=0为第一类跳跃间断点；（7）x=0为第一类可去间断点；

(8) $x = 0$ 为第二类振荡间断点；（9）x=0为第一类跳跃间断点，x=1为第二类间断点

3. (1) $x { = } 1$ 为第一类可去间断点，可补充定义 $f(1)=-2$ 使得 $x { = } 1$ 变为连续点；$x = 2$ 为第二类无穷间断点；

(2) $x = 0$ 为第一类可去间断点，可补充定义f(0)=1使得 $x = 0$ 变为连续点；

$x = k \pi , k \neq 0$ 为第二类无穷间断点；

$x = k\pi + \frac{\pi}{2}$ 为第一类可去间断点，可补充定义 $f\left(kx+\frac{\pi}{2}\right)=0$ 使得 $x =$ $k \pi + \frac { \pi } { 2 }$ 成为连续点；

(3) $x \equiv 0$ 为第二类振荡间断点；

(4）x=1为第一类跳跃间断点.

4. $x = \pm 1$ 为第一类跳跃间断点

5-6. 略.

7. (1)1; (2)—2; (3) 0.

习题2.8

1. 连续区间为 $\left( - \infty , - 3 \right) , \left( - 3 , 2 \right) , \left( 2 , + \infty \right) ; \lim _ { x \rightarrow 0 } f ( x ) = \frac { 1 } { 2 } ; \lim _ { x \rightarrow - 3 } f ( x ) = - \frac { 8 } { 5 } ; \lim _ { x \rightarrow 2 } f ( x ) = \infty$

2. 略.

3. (1) $\frac{1}{2};$ (2)1;(3) $\frac { 1 8 2 } { 2 }$ ;(4) $\frac{1}{2}$ ; (5) e; (6) 1; (7) 0; (8) $\mathrm{e}^{\frac{1}{2}}$ ; (9) $\mathrm { e ^ { 3 } }$

(10) $\mathrm{e}^{-\frac{3}{2}}$ ; (11) $\frac{1}{2}$ ； (12) e2； (13) $\frac{1}{\sqrt{2}}$ ；(14)8；(15) $\mathrm { e } ^ { b a }$ ; (16) $\sqrt { a b c } ,$

[page:290]

习题2.9

1-7. 略.

8. （1）略；（2） $y = 2x + 1$ 为渐近线 $x = 0$ 为铅直渐近线.

# 第3章

习题3.1

1. 略.

2. (1)a; (2) $-\frac{1}{x^{2}};$ (3) $\frac { 1 } { 2 \sqrt { x } } ;$ (4) $2x + 1;$ (5) 0.

3-4. 略.

5. (1) $f_{-}^{\prime}(0)=f_{+}^{\prime}(0)=1,f^{\prime}(0)=1$ (2) $f_{-}^{\prime}(0)=1,f_{+}^{\prime}(0)=0,f^{\prime}(0)$ 不存在；

(3) $f_{-}^{\prime}(0)=-1,f_{+}^{\prime}(0)=0,f^{\prime}(0)$ 不存在.

6. 12m/s.

7-9. 略.

10. $-\frac{1}{2}, -1.$

11. 切线 $y - \frac{1}{2} = - \frac{\sqrt{3}}{2}\left(x - \frac{\pi}{3}\right)$ ,法线 $y - \frac{1}{2} = \frac{2}{\sqrt{3}}\left(x - \frac{\pi}{3}\right)$

12. 点(2,4).

13. $a=2,b=-1.$

14. $f^{\prime}(x)=\left\{\begin{aligned}\cos x, & \quad x \leqslant 0, \\ 1, & \quad x > 0.\end{aligned}\right.$

15. 略.

习题3.2

1. 略.

2. (1) $y^{\prime} = 3x^{2} - \frac{28}{x^{5}} + \frac{2}{x^{2}}$ (2) $y^{\prime} = 15x^{2} - 2^{x}\ln 2 + 3\mathrm{e}^{x}$ ； (3) $y^{\prime} = 2\sec^{2}x + \sec x\tan x;$

(4) $y^{\prime} = \cos 2x;$ (5) $y^{\prime} = 2x\ln x + x;$ (6) $y^{\prime} = 3\mathrm{e}^{x} \left( \cos x - \sin x \right)$ *#. (7) $y^{\prime} = \frac{1 - \ln x}{x^{2}}$

(8) $y^{\prime} = \frac{(x - 2)\mathrm{e}^{x}}{x^{3}}$ (9) $y^{\prime} = 2x(\ln x)\cos x + x\cos x - x^{2}(\ln x)\sin x$

(10) $\frac{1 + \sin t + \cos t}{(1 + \cos t)^2}$

3. (1) $\mathrm{d}y = \left( - \frac{1}{x^{2}} + \frac{1}{\sqrt{x}} \right) \mathrm{d}x ;$ (2) $\mathrm{d}y = \left( \sin 2x + 2x\cos 2x \right) \mathrm{d}x;$ (3) $\mathrm{d}y = \left( x^{2} + 1 \right)^{-\frac{3}{2}} \mathrm{d}x$ a

(4) $\mathrm{d}y = \frac{- 2\ln(1 - x)}{1 - x}\mathrm{d}x;$ (5) $\mathrm{d}y = 2x\mathrm{e}^{2x}(1 + x)\mathrm{d}x;$

(6) $\mathrm{d}y = \mathrm{e}^{-x} \left( \sin(3-x) - \cos(3-x) \right) \mathrm{d}x;$ (7) $\mathrm{d}y = \frac{- x}{\sqrt{1 - x^{2}} \left| x \right|} \mathrm{d}x;$

(8) $\mathrm{d}y = 8x\tan(1 + 2x^{2})\sec^{2}(1 + 2x^{2})\mathrm{d}x;$ (9) $\mathrm{d}y = \frac{- 2x}{1 + x^{4}}\mathrm{d}x;$

[page:291]

(10) $\mathrm{d}s = \omega A \cos(\omega t + \varphi) \mathrm{d}t.$

4. (1) $\sigma(t) = \sigma_0 - g t;$ (2) $\frac { \mathcal { U } _ { 0 } } { \mathcal { E } } .$

5. 切线: $y = 2x$ 法线 $y=-\frac{1}{2}x.$

6. 连续，不可导.

7.(1) $y^{\prime} = 8(2x + 5)^{3}$ ;(2) $y^{\prime} = 3\sin(4 - 3x)$ ; (3) $y^{\prime} = - 6x\mathrm{e}^{- 3x^{2}}$ ;(4) $y^{\prime} = \frac{2x}{1 + x^{2}}$

(5) $y^{\prime} = \sin 2x;$ (6) $y^{\prime} = \frac{- x}{\sqrt{a^{2} - x^{2}}}$ (7) $y^{\prime} = 2x\sec^{2}x^{2}$ 1 (8) $y^{\prime} = \frac{\mathrm{e}^{x}}{1 + \mathrm{e}^{2x}}$ sn.

(9) $y^{\prime} = \frac{2\arcsin x}{\sqrt{1 - x^{2}}}$ (10) $y^{\prime} = -\tan x;$ (11) $y^{\prime} = 1 - x + x^{2}$

(12) $y^{\prime}=-\frac{1}{x^{2}}-\frac{1}{2x^{\frac{3}{2}}}-\frac{1}{3x^{\frac{4}{3}}}$ (13) $y^{\prime} = \frac{ad - bc}{(cx + d)^2};$

(14) $y^{\prime} = (x - b)^{2}(x - c)^{3} + 2(x - a)(x - b)(x - c)^{3} + 3(x - a)(x - b)^{2}(x - c)^{2}$

(15) $y^{\prime} = \sin x + x\cos x + \frac{x\cos x - \sin x}{x^{2}};$ (16) $y^{\prime} = 10^{x} + x10^{x} \ln 10$

8.(1) $y^{\prime} = - \frac{1}{\sqrt{x - x^{2}}}$ (2) $y^{\prime} = x(1 - x^{2}) - \frac{3}{2}$ (3) $y = - \frac{1}{2} \mathrm{e}^{- \frac{x}{2}} \cos 3x - 3\mathrm{e}^{- \frac{x}{2}} \sin 3x;$

(4) $y^{\prime} = \frac{1}{\left | x \right | \sqrt{x^{2} - 1}};$ (5) $y^{\prime} = \frac{- 2}{x(1 + \ln x)^{2}}$ (6) $y^{\prime} = \frac{2x\cos 2x - \sin 2x}{x^{2}}$

(7) $y^{\prime} = \frac{1}{2\sqrt{x - x^{2}}}$ (8) $y^{\prime} = \frac{1}{\sqrt{a^{2} + x^{2}}}$ (9) $y^{\prime} = \sec x;$ (10) $y^{\prime} = \csc x;$

(11) $y^{\prime} = \frac{\cos x}{\left| \cos x \right|};$ (12) $y^{\prime} = \frac{1}{1 + x^{2}};$ (13) $y^{\prime} = \sin x \ln \tan x;$ 一 (14) $y^{\prime} = \frac{\mathrm{e}^{x}}{\sqrt{1 + \mathrm{e}^{2x}}}$

(15) $y^{\prime} = x^{\frac{1}{x} - 2}(1 - \ln x)$ ;(16) $y^{\prime} = a \mathrm{e}^{ax} \sin bx + b \mathrm{e}^{ax} \cos bx;$ (17) $y^{\prime} = \frac{\left | a \right | }{a\sqrt{a^{2} - x^{2} } } ;$

(18) $y^{\prime} = \frac{1}{a^{2} + x^{2}};$ (19) $y^{\prime} = - 5\cos^{4}x\sin x;$ (20) $y^{\prime} = 6\csc6x;$ (21) $y^{\prime} = \frac{2}{t} = \frac{t}{1 + t^{2}}$

(22) $y^{\prime} = \frac{2(1 - x^{2})}{\left| 1 - x^{2} \right|(x^{2} + 1)}$ (23) $y^{\prime} = \frac{1}{a + b\cos x};$ (24) $y^{\prime} = \frac{1}{x^{2} - a^{2}}$

(25) $y^{\prime} = \sqrt{x^{2} + a^{2}} ; \quad (26) y^{\prime} = \sqrt{x^{2} - a^{2}} .$

9. (1) $y^{\prime} = \frac{2\arcsin\frac{x}{2}}{\sqrt{4 - x^{2}}}$ (2) $y^{\prime} = \csc x;$ (3) $y^{\prime} = \frac{\ln x}{x\sqrt{1 + \ln^{2}x}}$ (4) $y^{\prime} = \frac{\mathrm{e}^{\arctan \sqrt{x}}}{2\sqrt{x}(1 + x)};$

(5) $y^{\prime} = n\sin^{n - 1}x\cos(n + 1)x$ (6) $y^{\prime} = \frac{\arccos x + \arcsin x}{\sqrt{1 - x^{2}}(\arccos x)^{2}}$ (7) $y^{\prime} = \frac{1}{x \ln x \ln \ln x};$

(8) $y^{\prime}=\frac{1-\sqrt{1-x^{2}}}{x^{2}\sqrt{1-x^{2}}}$ (9) $y^{\prime}=-\frac{1}{\left(1+x\right)\sqrt{2x\left(1-x\right)}}$

10. $y^{\prime} = \frac{f f^{\prime} + g g^{\prime}}{\sqrt{f^{2} + g^{2}}}$

[page:292]

11. (1) $y^{\prime} = 2xf^{\prime}(x^{2})$ ; (2) $y^{\prime} = \sin 2x \left( f^{\prime} \left( \sin^{2} x \right) - f^{\prime} \left( \cos^{2} x \right) \right)$

12. (1) $y^{\prime} = \mathrm{e}^{- x}( - x^{2} + 4x - 5 ) ;$ (2) $y^{\prime} = \sin 2x\sin x^{2} + 2x\sin^{2}x\cos x^{2}$

(3) $y^{\prime} = \frac{4\arctan\frac{x}{2}}{4 + x^{2}}$ (4) $y^{\prime} = \frac{1 - n\ln x}{x^{n + 1}}$ (5) $y^{\prime} = \frac{4}{\left( \mathrm{e}^{t} + \mathrm{e}^{- t} \right)^{2}};$ (6) $y^{\prime} = \frac{\tan \frac{1}{x}}{x^{2}}$

(7) $y^{\prime} = \mathrm{e}^{- \sin^{2}\frac{1}{x}} \frac{\sin\frac{2}{x}}{x^{2}}$ (8) $y^{\prime} = \frac{1 + 2\sqrt{x}}{4\sqrt{x^{2} + x\sqrt{x}}}$ (9) $y^{\prime} = \arcsin \frac{x}{2}.$

13. (1) $\mathrm{d}y = - \frac{1}{x^{2}}\mathrm{d}x;$ (2) $\mathrm{d}y = -\sin x\mathrm{d}x;$ (3) $\mathrm{d}y = a^{x} \ln a \mathrm{d}x$ (4) $\mathrm{d}y = \frac{1}{x}\mathrm{d}x;$

(5) $\mathrm{d}y = \frac{2 - \ln x}{2x\sqrt{x}}\mathrm{d}x;$ (6) $\mathrm{d}y = \frac{x}{\sqrt{x^{2} + a^{2}}}\mathrm{d}x;$ (7) $\mathrm{d}y = \left( 2\tan^{3}x + \tan x \right)\mathrm{d}x$

(8) $\mathrm{d}y = 2\mathrm{e}^{x^{2}}\cos^{3}x(x\cos x - 2\sin x)\mathrm{d}x$

14.(1) $\mathrm{d}y = \left( 4x^{3} + 12x^{2} - \frac{5}{2}x\sqrt{x} + 2x - 6\sqrt{x} - \frac{1}{2\sqrt{x}} \right) \mathrm{d}x$

(2) $\mathrm{d}y = \frac{- x^{4} + 3x^{2} + 2x}{\left( x^{3} + 1 \right)^{2}}\mathrm{d}x;$ (3) $\mathrm{d}y = \left( \sec^{2}x + \sec x\mathrm{d}x \right)$ dx; (4) $\mathrm{d}y = - 2x\sin x^{2}\mathrm{d}x;$ 井中

(5) $\mathrm{d}y = \frac{1}{\left | x \right | \sqrt{x^{2} - 1}}\mathrm{d}x;$ (6) $\mathrm{d}y = \frac{1}{x + x(\ln x)^{2}}\mathrm{d}x.$

15. (1) $\mathrm{d}y = vw\mathrm{d}u + uw\mathrm{d}v + uv\mathrm{d}w;$ (2) $\mathrm{d}y = \frac{u\mathrm{d}u + v\mathrm{d}v}{u^{2} + v^{2}};$ (3) $\mathrm{d}y = \frac{v\mathrm{d}u - u\mathrm{d}v}{u^{2} + v^{2}};$ t牛

(4) $\mathrm{d}y = 3\left( u^{2} + v^{2} + w^{2} \right)^{\frac{1}{2}} \left( u\mathrm{d}u + v\mathrm{d}v + w\mathrm{d}w \right)$ ; (5) $\mathrm{d}y = \mathrm{e}^{uv} \left( v\mathrm{d}u + u\mathrm{d}v \right)$

(6) $\mathrm{d}y = \mathrm{e}^{v} \left( \cos u   \mathrm{d}u + \sin u   \mathrm{d}v \right)$ ; (7) $\mathrm{d}y = \mathrm{e}^{\arctan(uv)} \frac{v\mathrm{d}u + u\mathrm{d}v}{1 + u^2 v^2}.$

## 16. 可导.

17. 略.

## 习题3.3

1. (1) $y'' = 4 - \frac{1}{x^2}$ (2) $y'' = 4\mathrm{e}^{2x - 1}$ ;(3) $y^{\prime} = - 2\sin x - x\cos x;$ (4) $y^{\prime \prime} = - 2\mathrm{e}^{- t}\cos t$

(5) $y'' = - \frac{a^{2}}{\left( a^{2} - x^{2} \right)^{\frac{3}{2}}};$ (6) $y^{\prime\prime} = \frac{- 2\left( 1 + x^{2} \right)}{\left( 1 - x^{2} \right)^{2}}$ (7) $y^{\prime\prime} = 2\sec^{2}$ xtanx;

(8) $y^{\prime\prime} = \frac{6x(2x^3 - 1)}{(x^3 + 1)^3};$ (9) $y^{\prime \prime} = 2\arctan x + \frac{2x}{1 + x^{2}};$ (10) $y^{\prime \prime} = \frac{\mathrm{e}^{x}\left( x^{2} - 2x + 2 \right)}{x^{3}};$

(11) $y^{\prime\prime} = 2x\mathrm{e}^{x^{2}}\left( 3 + 2x^{2} \right)$ ;(12) $y^{\prime\prime} = - \frac{x}{\left( 1 + x^{2} \right)^{\frac{3}{2}}}$

(13) $y = - 2\cos 2x\ln x - \frac{2\sin 2x}{x} - \frac{\cos^{2}x}{x^{2}}$ (14) $y^{\prime\prime} = \frac{3x}{\left( 1 - x^{2} \right)^{\frac{5}{2}}}$

2. (1) $y^{\prime\prime} = 2f^{\prime}(x^2) + 4x^2f^{\prime\prime}(x^2)$ ; (2) $y'' = \frac{f f'' - (f')^2}{f^2}$

3. 略.

4. $s^{\prime\prime} = - \omega^{2} A \sin \omega t.$

5-6. 略.

[page:293]

7. (1) $y^{(4)} = -4\mathrm{e}^{x}\cos x; \quad (2) y^{(50)} = -2^{50}x^{2}\sin 2x + 50\cdot 2^{50}x\cos 2x + 50\cdot 49\cdot 2^{58}\sin 2x;$

(3) $y^{(6)} = 4 \cdot 6!, y^{(7)} = 0$

8. (1) $y^{(n)} = n! ; \quad y^{(n)} = -2^{n-1} \cos \left( 2x + \frac{n\pi}{2} \right)$

(3) $y^{\prime}=1+\ln x,y^{(n)}=(-1)^{n-2}(n-2)!.x^{-(n-1)},n\geqslant2;$

(4) $y^{(n)} = \mathrm{e}^{x}(x + n); \quad (5) y^{(n)} = (-1)^{n}\mathrm{e}^{-x}\left[x^{2} + (2 - 2n)x + n^{2} - 3n + 2\right];$

(6) $y^{(n)} = (-1)^{n-1} n! (x-1)^{-(n+1)}$ A

(7) $y^{(n)} = \frac{n!}{2}(-1)^{n-1}\left((x-1)^{-(n+1)} - (x+1)^{-(n+1)}\right)$ (8) $y^{(n)} = n! \quad (x + 1)^{-(n + 1)}$

(9) $y^{(n)} = \sum_{k = 0}^{n} (-1)^{k} \frac{n!}{(n - k)!} \frac{\mathrm{e}^{x}}{x^{k + 1}}$

9. $(-1)^{n-1}\frac{n!}{n-2}(n\geqslant 3)$

习题3.4

1. (1) $y^{\prime} = \frac{y}{y - x};$ (2) $y^{\prime} = \frac{ay - x^{2}}{y^{2} - ax};$ (3) $y^{\prime} = \frac{\mathrm{e}^{x + y} - y}{x - \mathrm{e}^{x + y}};$ (4) $y^{\prime} = \frac{- \mathrm{e}^{y}}{1 + x\mathrm{e}^{y}}$

(5) $y^{\prime} = - \frac{\sqrt{y}}{\sqrt{x}};$ (6) $y^{\prime} = \frac{- \sin(x + y)}{1 + \sin(x + y)};$ (7) $y^{\prime} = \frac{y\cos x + \sin(x - y)}{\sin(x - y) - \sin x};$

(8) $y^{\prime}=\frac{-y-2\sqrt{xy}}{x+2\sqrt{xy}}.$

2. (1)-2; (2) $= \frac { 1 } { 2 } .$

3. (1) $\mathrm{d}y = - \frac{b^{2}x}{a^{2}y}\mathrm{d}x ;$ (2) $\mathrm{d}y = \frac{xy\ln y - y^{2}}{xy\ln x - x^{2}}\mathrm{d}x.$

4. 切线 $y=-x+\frac{\sqrt{2}}{2}a;$ 法线 $y = x.$

5. (1) $y^{\prime\prime} = - \frac{1}{y^{3}};$ (2) $y^{\prime\prime} = - \frac{b^{4}}{a^{2}y^{3}}$ (3) $y^{\prime\prime} = \frac{- 2(1 + y^{2})}{y^{5}};$ (4) $y^{\prime\prime} = \frac{\mathrm{e}^{2y}(3 - y)}{(2 - y)^3}.$

6. (1) $y^{\prime} = \left( \frac{x}{1 + x} \right)^{x} \left( \ln \frac{x}{1 + x} + \frac{1}{1 + x} \right)$ ; (2) $y^{\prime}=\frac{1}{5}\sqrt[5]{\frac{x-5}{\sqrt[5]{x^{2}+2}}}\left(\frac{1}{x-5}-\frac{2x}{5(x^{2}+2)}\right)$

(3) $y^{\prime}=\frac{\sqrt{x+2}(3-x)^{4}}{(x+1)^{5}}\left(\frac{1}{2(x+2)}+\frac{4}{x-3}-\frac{5}{x+1}\right)$

(4) $y^{\prime} = \frac{1}{2}\sqrt{x\sin x\sqrt{1 - \mathrm{e}^{x}}}\left( \frac{1}{x} + \cot x - \frac{\mathrm{e}^{x}}{2\left( 1 - \mathrm{e}^{x} \right)} \right)$ #0.

(5) $y^{\prime} = \frac{1}{x^{2}}\sqrt{\frac{1 - x}{1 + x}}\left( \frac{2x}{x^{2} - 1} - \ln\frac{1 - x}{1 + x} \right)$

(6) $y^{\prime}=\frac{x^{2}}{1+x}\sqrt{\frac{x+1}{1+x+x^{2}}}\left(\frac{2}{x}-\frac{1}{2(1+x)}-\frac{2x+1}{2(1+x+x^{2})}\right)$

$$y^{\prime} = (x - b_{1})^{a_{1}} (x - b_{2})^{a_{2}} \cdots (x - b_{n})^{a_{n}} \left( \frac{a_{1}}{x - b_{1}} + \frac{a_{2}}{x - b_{2}} + \cdots + \frac{a_{n}}{x - b_{n}} \right)$$

(8) $y ^ { \prime } = \left( 1 + x ^ { 2 } \right) ^ { x } \left( \ln \left( 1 + x ^ { 2 } \right) + \frac { 2 x ^ { 2 } } { 1 + x ^ { 2 } } \right).$

[page:294]

7.(1) $\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{3bt}{2a}$ (2) $\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{\cos \theta - \theta \sin \theta}{1 - \sin \theta - \theta \cos \theta}$

8. （1）切线 $y = - 2\sqrt{2}\left(x - \frac{\sqrt{2}}{2}\right)$ ,法线 $\bar{y} = \frac{\sqrt{2}}{4} \left( x - \frac{\sqrt{2}}{2} \right)$

(2) 切线 $y - \frac{12a}{5} = - \frac{4}{3}\left(x - \frac{6a}{5}\right)$ ,法线 $y - \frac{12a}{5} = \frac{3}{4} \left( x - \frac{6a}{5} \right)$

9. (1) $y'' = \frac{1}{t^{3}}$ ; (2) $y'' = - \frac{b}{a^{2}\sin^{3}t};$ (3) $y'' = \frac{4}{9}\mathrm{e}^{3t}$ ;(4) $y^{\prime\prime} = \frac{1}{f^{\prime\prime}(t)}$

(5) $y^{\prime\prime} = - \frac{1}{(1 - \cos t)^2};$ (6) $y ^ { \prime \prime } = - \frac { b } { a ^ { 2 } \left( \mathrm { s h } t \right) ^ { 3 } } ;$ (7) $y^{\prime\prime} = \frac{1}{3a\sin\theta\cos^{4}\theta};$ (8) $y'' = - \frac{1 + t^{2}}{t^{3}}.$

10. (1) $y'' = - \frac{3(1 + t^{2})}{8t^{5}}$ ;(2) $y ^ { \prime \prime } = \frac { t ^ { 4 } - 1 } { 8 t ^ { 3 } } .$

11. $y = 2x - 12.$

12. $y = H \left[ 2 \left( \frac{x}{L} \right)^3 + 3 \left( \frac{x}{L} \right)^2 \right].$

13. $144\pi m^{2}/s.$

14. $\frac{16}{25\pi}  m/min$

15. $0.64   cm/min$

16. $6.4 km/h.$

17. $\frac{4.5}{\sqrt{22.75}}  m/s$

18. $-2.8  km/h.$

# 第4章

习题4.1

1. $\frac{b^{3}-a^{3}}{3}+b-a.$

2. (1) $\frac { b ^ { 2 } - a ^ { 2 } } { 2 } ,$ (2) e-1; (3) $\frac{c}{2}(b^{2}-a^{2})+d(b-a)$ ; (4) $\frac{1}{4}$

3-4. 略.

5. (1) $\frac { t ^ { 2 } } { 2 }$ (2)21；（3) $\frac{5}{2}$ ；(4) $\frac{9\pi}{2}$ ； (5) $\frac{\pi(b - a)^{2}}{8}$ ;(6) $\frac{(b - a)^{2}}{4}.$

6. $a=0,b=1$

7. (1) 6; (2)-2; (3)-3; (4) $\frac { 2 5 } { 3 } .$

8. 88.2kN.

9-10. 略.

12. 略.

11. (1) $\int_{0}^{1} x^{2} \mathrm{d}x ;$ (2) $\int_{1}^{2} x^{3}   dx ;$ (3) $\int_{1}^{2} \ln x   dx$

[page:295]

习题4.2

1.0 $\frac { \sqrt { 2 } } { 2 } ,$

2. $\operatorname { c o t f . }$

3. $= \frac{\cos x}{\mathrm{e}^{y}}.$

4. (1) $2x\sqrt{1+x^{4}}$ ; (2) $\frac{3x^{2}}{\sqrt{1 + x^{12}}} - \frac{2x}{\sqrt{1 + x^{8}}}$ a0.

(3) $- \sin x \cos ( \pi \cos ^ { 2 } x ) - \cos x \cos ( \pi \sin ^ { 2 } x )$ 9 (4) 0.

5. (1) $a^{3}-\frac{a^{2}}{2}+a;$ (2) $\frac{21}{8}$ ; (3) $4 5 \frac { 1 } { 6 }$ (4) $\frac{\pi}{6}$ (5) $\frac{\pi}{3}$ (6) $\frac{\pi}{3a}$ ;(7) $\frac{\pi}{6}$

(8) $1 + \frac{\pi}{4};$ (9)-1; (10) $1 = \frac{\pi}{4};$ (11) $4 ;$ (12) $\frac { 8 } { 3 } ,$ (13) $\frac{1}{a}\ln\frac{3}{2}$ ; (14) 1.

6. (1) $f(x) = \left| x \right|$ (2) $f(x)=\begin{cases}\dfrac{x^{2}}{2},&x\geqslant0,\\-\dfrac{x^{2}}{2},&x<0;\end{cases}$ (3) $f(x)=\left\{\begin{aligned}&\frac{1}{2}-x, &x<0, \\&\frac{1}{2}-x+x^{2}, &0 \leqslant x \leqslant 1, \\&x-\frac{1}{2}, &x>1;\end{aligned}\right.$

(4) $f(x)=\left\{\begin{aligned}&\frac{1}{3}-\frac{x}{2},&x<0,\\&\frac{1}{3}-\frac{x}{2}+\frac{x^{3}}{3},&0\leqslant x\leqslant1,\\&\frac{x}{2}-\frac{1}{3},&x>1.\end{aligned}\right.$

7-8. 略.

9. $\Phi(x)=\left\{\begin{aligned}&\frac{x^{3}}{3},&0\leqslant x\leqslant1,\\&\frac{x^{2}}{2}-\frac{1}{6},&1<x\leqslant2.\end{aligned}\right.$ 处处连续.

10. $\phi(x)=\left\{\begin{aligned}&0, &x \leqslant 0, \\&\frac{1}{2}(1-\cos x), &0 < x \leqslant \pi, \\&1, &x \geqslant \pi.\end{aligned}\right.$

11. (1) $\frac{\pi}{4}$ ; (2) $\frac{2}{\pi} ;$ (3) $\frac{2}{3}(2\sqrt{2}-1)$ ; (4) $\frac { 1 } { p + 1 } ;$

12. $\frac{4}{3}$

13-17.略.

习题4.3

1. (1) $-\frac{1}{x} + C;$ (2) $\frac{1}{3}x^{3}-\frac{3}{2}x^{2}+2x+C;$ (3) $\frac{1}{5}x^{5}+\frac{2}{3}x^{3}+x+C;$

(4) $\frac{1}{3}x^{3}+\frac{2}{5}x^{5}-\frac{2}{3}x^{3}-x+C;$ (5) $2\sqrt{x}-\frac{4}{3}x^{\frac{3}{2}}+\frac{2}{5}x^{\frac{5}{2}}+C;$ (6) $2\mathrm{e}^{x}+3\ln \left | x \right | +C;$

[page:296]

(7) $3\arctan x - 2\arcsin x + C;$ (8) $\mathrm{e}^{x}-2\sqrt{x}+C;$ (9) $\frac{3^{x}\mathrm{e}^{x}}{1 + \ln 3} + C;$

(10) $2x-\frac{5}{\ln 2-\ln 3}\left(\frac{2}{3}\right)^{x}+C;$ (11) $\tan x - \sec x + C;$ $\frac{x + \sin x}{2} + C;$

(13) $\frac{1}{2}\tan x+C;$ (14) $\sin x - \cos x + C;$ (15) $\begin{aligned}-\cot x - \tan x + C;\end{aligned}$ $(16) - \cot x - x + C;$

(17) $- \cos \theta + \theta + C ;$ (18) $x - \arctan x + C;$ (19) $x^{3}-x+\arctan x+C;$ (20) $\frac { 8 } { 1 5 } x ^ { \frac { 1 5 } { 8 } } + C _ { 2 }$

(21) $-\frac{1}{x}-\frac{1}{5x^{5}}+C;$ (22) $\varphi(x)+C_{x}\varphi(x)=\left\{\begin{aligned}&\frac{x^{2}}{2},&x\geqslant0,\\&-\frac{x^{2}}{2},&x<0.\end{aligned}\right.$

2. $y = 1 + \ln x.$

3. $(1) 27  m ;$ (2) $\sqrt [ 3 ] { 3 6 0 } .$

4. 略.

习题4.4

1. (1) $\frac{1}{5} \mathrm{e}^{5t} + C;$ (2) $-\frac{1}{8}(3 - 2x)^{4} + C;$ (3) $-\frac{1}{2}\ln\left|1-2x\right|+C;$

(4) $-\frac{1}{2}(2 - 3x)^{\frac{2}{3}} + C;$ (5) $-\frac{1}{a}\cos ax - b\mathrm{e}^{\frac{x}{b}} + C;$ (6) $= 2 \cos \sqrt{t} + C;$

(7) $-\frac{1}{2}\mathrm{e}^{-x^{2}} + C;$ (8) $\frac{1}{2}\sin(x^{2}) + C;$ (9) $-\frac{1}{3}(2-3x^{2})^{\frac{1}{2}}+C;$

(10) $-\frac{3}{4}\ln\left|1-x^{4}\right|+C;$ (11) $\frac{1}{2}\ln(x^{2}+2x+5)+C;$

(12) $- \frac{1}{3\omega} \cos^3 \left( \omega t + \varphi \right) + C;$ (13) $\frac{1}{2\cos^{2}x}+C;$ (14) $\frac{3}{2}\sqrt[3]{(\sin x-\cos x)^{2}+C};$

(15) $\frac{1}{11}\tan^{11}x + C;$ (16) $\ln \left| \ln x \right| + C;$ (17) $-\frac{1}{\arcsin x}+C;$ (18) $-\frac{10^{2\arccos x}}{2\ln 10}+C;$

(19) $\ln \left| \cos \sqrt{1 + x^{2}} \right| + C;$ (20) $(\arctan \sqrt{x} )^{2} + C;$ (21) $= \frac{1}{x\ln x} + C;$

(22) $\ln \left| \tan x \right| + C;$ (23) $\frac{1}{2}(\ln\tan x)^{2}+C;$ (24) $\sin x - \frac{\sin^{3}x}{3} + C;$

(25) $\frac{t}{2} + \frac{1}{4\omega}\sin2(\omega t + \varphi) + C;$ (26) $\frac{1}{2}\cos x - \frac{1}{10}\cos 5x + C;$

(27) $\frac{1}{3}\sin\frac{3x}{2}+\sin\frac{x}{2}+C;$ (28) $\frac{1}{4}\sin 2x - \frac{1}{24}\sin 12x + C;$

(29) $\frac{1}{3}\sec^{3}x - \sec x + C;$ (30) $\arctan e^{x} + C;$ (31) $\frac{1}{2}\arcsin\frac{2x}{3}+\frac{1}{4}\sqrt{9-4x^{2}}+C;$

(32) $\frac{x^{2}}{2}-\frac{9}{2}\ln(x^{2}+9)+C;$ (33) $\frac{1}{2\sqrt{2}}\ln\left|\frac{\sqrt{2}x - 1}{\sqrt{2}x + 1}\right| + C;$ (34) $\frac{1}{3}\ln\left|\frac{x - 2}{x + 1}\right| + C;$

(35) $\frac{2}{3}\ln \left | x-2 \right | +\frac{1}{3}\ln \left | x+1 \right | +C;$ (36) $\frac{a^{2}}{2}\left(\arcsin\frac{x}{a}-\frac{x}{a^{2}}\sqrt{a^{2}-x^{2}}\right)+C;$

(37) $\arccos\frac{1}{\left|x\right|}+C;$ (38) $\frac{x}{\sqrt{1 + x^{2}}} + C;$ (39) $\sqrt{x^{2}-9}-3\arccos\frac{3}{\left | x \right | }+C;$

[page:297]

$$\sqrt{2x}-\ln(1+\sqrt{2x})+C_{1} \quad (41) \arcsin x-\frac{x}{1+\sqrt{1-x^{2}}}+C_{1}$$

$$\frac{1}{2}\left( \arcsin x + \ln\left| x + \sqrt{1 - x^{2}} \right| \right) + C_{1} \quad (43) \quad \frac{1}{2}\ln\left( x^{2} + 2x + 3 \right) - \sqrt{2}\arctan\frac{x + 1}{\sqrt{2}} + C_{2}$$

$$\frac{1}{2}\left(\frac{x + 1}{x^{2} + 1} + \ln(x^{2} + 1) + \arctan x\right) + C_{4} \quad (45) \quad \frac{1}{2}\ln\frac{\left| \mathrm{e}^{x} - 1 \right|}{\mathrm{e}^{x} + 1} + C_{5}$$

$$\frac{1}{2(1 - x)^{2}} - \frac{1}{1 - x} + C_{5} \quad (47) \quad \frac{1}{6a^{3}}\ln\left| \frac{a^{3} + x^{3}}{a^{3} - x^{3}} \right| + C_{5} \quad (48) \quad \ln|x + \sin x| + C_{5}$$

$$\frac{1}{2}\arctan^{2}x+C; \quad (50) \quad \frac{1}{3}\tan^{3}x-\tan x+x+C;$$

$$\frac{1}{8}\left(\frac{1}{3}\cos 6x-\frac{1}{2}\cos 4x-\cos 2x\right)+C_{1} \quad (52) \quad \frac{1}{4}\ln |x|-\frac{1}{24}\ln (x^{6}+4)+C_{2}$$

$$\left( 5 \right) a \arcsin \frac{x}{a} - \sqrt{a^2 - x^2} + C_5 \quad \left( 5 \right) \ln \left| x + \frac{1}{2} + \sqrt{x(x + 1)} \right| + C_5$$

$$\ln \frac{\sqrt{1 + e^{x}} - 1}{\sqrt{1 + e^{x}} + 1} + C_{1} \quad (56) \quad \frac{\sqrt{x^{2} - 1}}{x} + C_{2} \quad (57) \quad \frac{1}{3a^{4}}\left[ - \frac{3x}{\sqrt{a^{2} - x^{2}}} + \frac{x^{3}}{\sqrt{\left( a^{2} - x^{2} \right)^{3}}} \right] + C_{3}$$

$$\frac{\sqrt{\left( 1 + x^{2} \right)^{3}}}{3x^{3}} + \frac{\sqrt{1 + x^{2}}}{x} + C; \quad \frac{\sin x}{2\cos^{2}x} - \frac{1}{2}\ln\left| \sec x + \tan x \right| + C;$$

$$\frac{1}{\sqrt{2}}\ln\left|\frac{\sqrt{1+\cos x}-\sqrt{2}}{\sqrt{1+\cos x}+\sqrt{2}}\right|+C; \quad (61) \frac{x^{4}}{8(1+x^{8})}+\frac{1}{8}\arctan x^{4}+C;$$

$$\frac{x^{4}}{4}+\ln\frac{\sqrt[4]{x^{4}+1}}{x^{4}+2}+C; \quad (63) \frac{1}{32}\ln\left|\frac{2+x}{2-x}\right|+\frac{1}{16}\arctan\frac{x}{2}+C;$$

$$\frac{2}{1 + \tan \frac{x}{2}} + x + C; \quad (65) \ln \frac{x}{(\sqrt[6]{x} + 1)^6} + C; \quad (66) \frac{1}{1 + e^{x}} + \ln \frac{e^{x}}{1 + e^{x}} + C;$$

$$\left( 6 7 \right) \arctan \left( \mathrm{e}^{x} - \mathrm{e}^{-x} \right) + C_{5} \quad \left( 6 8 \right) \frac{1}{2} \ln \left| 2 x + 5 \right| + C_{5} \quad \left( 6 9 \right) \frac{1}{303} \left( 3 x - 1 \right)^{101} + C_{5}$$

$$\frac{1}{3}(2x + 11)^{-\frac{3}{2}} + C_{5} \quad (71) \frac{1}{\sqrt{6}}\arctan\sqrt{\frac{3}{2}}x + C_{5} \quad (72) \frac{1}{\sqrt{5}}\arcsin\sqrt{\frac{5}{2}}x + C_{5}$$

$$\left( 7 3 \right) \arcsin \left( 2 x - 1 \right) + C ; \quad \left( 7 4 \right) \ln \left( 2 + \mathrm{e}^{x} \right) + C ; \quad \left( 7 5 \right) 2 \arctan \mathrm{e}^{x} + C ;$$

$$\ln \left| \ln \frac{x}{2} \right| + C_{1} \quad (77) \quad \frac{1}{3} \ln^{3} x + C_{2} \quad (78) \quad \tan \frac{x}{2} + C_{3} \quad (79) \quad \tan \left( \frac{x}{2} + \frac{\pi}{4} \right) + C_{5}$$

$$\left( 8 0 \right) - \frac { 1 } { 1 2 } \left( 8 x ^ { 3 } + 2 7 \right) ^ { - \frac { 1 } { 2 } } + C _ { 3 } \quad \left( 8 1 \right) - x - 2 \ln \left| x - 1 \right| + C _ { 4 } \quad \left( 8 2 \right) - \frac { 1 } { 2 } \ln \left| \frac { x - 3 } { x - 1 } \right| + C _ { 5 }$$

$$\frac{1}{3}\ln\left|\frac{x - 1}{x + 2}\right| + C_{1} \quad (84) \quad \frac{1}{4}\ln\frac{\mathrm{e}^{2x}}{\mathrm{e}^{2x} + 2} + C_{2} \quad (85) \quad - 2\ln\left|\cos\sqrt{x}\right| + C_{3}$$

$$\left( 8 6 \right) - \frac { 1 } { 5 } \left( x ^ { 5 } + 1 \right) ^ { - 1 } + \frac { 1 } { 5 } \left( x ^ { 5 } + 1 \right) ^ { - 2 } - \frac { 1 } { 1 5 } \left( x ^ { 5 } + 1 \right) ^ { - 3 } + C _ { 1 } \quad \left( 8 7 \right) \frac { 1 } { n } x ^ { n } + \frac { 1 } { n } \ln \left| x ^ { n } - 1 \right| + C _ { 5 }$$

$$\frac{1}{an}\ln\left|\frac{x^{n}}{x^{n}+a}\right|+C; \quad (89) -\frac{1}{2}\left[\ln(x+1)-\ln x\right]^{2}+C;$$

$$\frac{1}{2a}\ln\left|\frac{x - a}{x + a}\right| + C; \quad (91) -\sqrt{a^{2} - x^{2}} + C; \quad (92) \frac{2}{3}(\ln x - 2)\sqrt{1 + \ln x} + C;$$

$$\left( 9 3 \right) - \frac { 1 } { 3 a ^ { 4 } x ^ { 3 } } \left( a ^ { 2 } + x ^ { 2 } \right) ^ { 3 / 2 } + \frac { 1 } { a ^ { 4 } x } \sqrt { a ^ { 2 } + x ^ { 2 } } + C ; \quad \left( 9 4 \right) - \frac { 1 } { a ^ { 2 } x } \sqrt { a ^ { 2 } - x ^ { 2 } } + C ;$$

[page:298]

(95) $a\ln\left|\frac{a-\sqrt{a^{2}-x^{2}}}{x}\right|+\sqrt{a^{2}-x^{2}}+C;$ (96) $a\ln\left|\frac{x}{a+\sqrt{a^{2}+x^{2}}}\right|+\sqrt{a^{2}+x^{2}}+C;$

(97) $\frac{1}{a}\ln\left|\frac{x}{a+\sqrt{a^{2}+x^{2}}}\right|+C;$ (98) $\frac{1}{a}\arccos\frac{a}{\left | x \right | }+C;$

(99) $-\frac{x}{2}\sqrt{a^{2}-x^{2}}+\frac{a^{2}}{2}\arcsin\frac{x}{a}+C;$ $\frac{1}{3}\ln \left | x^{3}+\sqrt{1+x^{6}} \right | +C;$

(101) $x - \ln(1 + \sqrt{1 + \mathrm{e}^{2x}}) + C;$ (102) $\frac{4}{7}\left(1+\mathrm{e}^{x}\right)^{7/4}-\frac{4}{3}\left(1+\mathrm{e}^{x}\right)^{3/4}+C;$

(103) $\arcsin \frac{1}{\sqrt{21}}(2x - 1) + C;$ $\frac{2x - 1}{4}\sqrt{2 + x - x^{2}} + \frac{9}{8}\arcsin\frac{2x - 1}{3} + C;$

(105) $2\arcsin\frac{x - 2}{2} - \sqrt{4x - x^{2}} + C;$ (106) $\ln \left | x-1+\sqrt{x^{2}-2x+10} \right | +C;$

(107) $\sqrt{x^{2}+x+1}+\frac{1}{2}\ln\left|x+\frac{1}{2}+\sqrt{x^{2}+x+1}\right|+C.$

2. (1)0; (2) $\frac{51}{512} ;$ (3) $\frac{1}{4} ;$ (4) $\pi - \frac{4}{3};$ (5) $\frac{\pi}{6}-\frac{\sqrt{3}}{8};$ (6) $\frac{\pi}{2}$ (7) $\sqrt{2}(\pi + 2)$

(8) $1 - \frac { \pi } { 4 }$ i (9) $\frac { \pi } { 1 6 } a ^ { 4 } ;$ (10) $\sqrt{2}-\frac{2\sqrt{3}}{3};$ (11) $\frac{1}{6}$ (12) $2+2\ln\frac{2}{3}$

(13) $1 - 2\ln 2$ (14) $(\sqrt{3} = 1) a;$ (15) $1 = \mathrm{e}^{-\frac{1}{2}}$ ; (16) $2(\sqrt{3} = 1)$ ; (17) $\frac{\pi}{2}$

(18) $\frac { \pi } { 4 } + \frac { 1 } { 2 }$ ;(19)0; (20) $\frac{3}{2}\pi;$ (21) $\frac{\pi^{3}}{324};$ (22)0;(23) $\frac{2}{3}$ ;(24) $\frac{4}{3}$ ;

(25) $2 \sqrt{2} ;$ (26)4; (27) $\frac{\pi}{8} \ln 2$ (28) $\frac{\pi}{4}$ ; (29) $2(\sqrt{2} - 1)$ ; (30) $\frac{\pi}{2\sqrt{2}}$

(31) $\frac{\pi}{2}$ ; (32) $\begin{cases}\dfrac{1}{3}x^{3} - \dfrac{2}{3}, & x < - 1, \\x, & - 1 \leqslant x \leqslant 1, \\\dfrac{1}{4}x^{4} + \dfrac{3}{4}, & x > 1;\end{cases}$ ，(33) $\frac{1}{26}(2^{13} - 1)$ ; (34) $\frac{1}{2}\ln 3 - \frac{\pi}{2\sqrt{3}}$

(35) $\frac{1}{6}; \quad (36) \quad \frac{1}{2};$ (37) $\frac{5}{6} ;$ (38) $\frac{1}{3}a^{3}-2a+\frac{8}{3}$ ;(39)4;(40)0;(41) $\frac{1}{4}a^{2}\pi;$

(42) $\frac{1}{\sqrt{2}}\ln(1+\sqrt{2})$ (43) $\frac{3\pi}{16}$ ； (44) 14; (45) $\frac { \pi } { 4 } - \frac { 2 } { 3 }$

3. $\ln(1 + \mathrm{e}).$

4-11. 略.

习题4.5

1. (1) $-x\cos x+\sin x+C;$ (2) $x(\ln x - 1) + C;$ (3) $x\arcsin x+\sqrt{1-x^{2}}+C;$

(4) $- \mathrm{e}^{- x}(x + 1) + C;$ (5) $\frac{1}{3}x^{3}\ln x - \frac{1}{9}x^{3} + C;$ (6) $\frac{\mathrm{e}^{-x}}{2}(\sin x - \cos x) + C;$

(7) $-\frac{2}{17}\mathrm{e}^{-2x}\left(\cos\frac{x}{2}+4\sin\frac{x}{2}\right)+C;$ (8) $2x\sin\frac{x}{2}+4\cos\frac{x}{2}+C;$

(9) $\frac{1}{3}x^{3}\arctan x-\frac{1}{6}x^{2}+\frac{1}{6}\ln(1+x^{2})+C;$ (10) $-\frac{1}{2}x^{2}+x\tan x+\ln\left|\cos x\right|+C;$

[page:299]

$$x^{2}\sin x+2x\cos x-2\sin x+C; \quad (12) -\frac{e^{-2t}}{2}\left(t+\frac{1}{2}\right)+C;$$

$$x\ln^{2}x-2x\ln x+2x+C; \quad (14) -\frac{1}{4}x\cos 2x+\frac{1}{8}\sin 2x+C;$$

$$\frac{x^{3}}{6}+\frac{1}{2}x^{2}\sin x+x\cos x-\sin x+C_{1} \quad (16) \quad \frac{1}{2}(x^{2}-1)\ln (x-1)-\frac{1}{4}x^{2}-\frac{1}{2}x+C_{1}$$

$$\frac{1}{2}\left(x^{2}-\frac{3}{2}\right)\cos 2x+\frac{x}{2}\sin 2x+C_{1} \quad (18) \quad -\frac{1}{x}\left(\ln ^{3} x+3\ln ^{2} x+6\ln x+6\right)+C_{2}$$

$$3\mathrm{e}^{\sqrt{x}}\left(\sqrt[3]{x^{2}}-2\sqrt[3]{x}+2\right)+C; \quad (20) \frac{x}{2}\left(\cos \ln x+\sin \ln x\right)+C;$$

$$x(\arcsin x)^{2}+2\sqrt{1-x^{2}}\arcsin x-2x+C_{5}\quad(22)\quad\frac{1}{2}\mathrm{e}^{x}-\frac{1}{5}\mathrm{e}^{x}\sin2x-\frac{1}{10}\mathrm{e}^{x}\cos2x+C_{5}$$

$$\frac{1}{2}x^{2}\left( \ln^{2}x - \ln x + \frac{1}{2} \right) + C_{5} \quad \left( 24 \right)\frac{2}{3}\left( \sqrt{3x + 9} - 1 \right)e^{\sqrt{3x + 9}} + C_{5}$$

$$(25) x\mathrm{sh}x - \mathrm{ch}x + C; \quad (26) -\frac{1}{4}\mathrm{e}^{-2x}(2x^2 + 2x + 1) + C;$$

$$x\ln(x+\sqrt{1+x^{2}})-\sqrt{1+x^{2}}+C; \quad (28) \frac{x^{2}}{2(1+x^{2})}\ln x-\frac{1}{4}\ln(1+x^{2})+C;$$

$$\frac{2}{3}\sqrt{x^{3}}\arctan\sqrt{x}-\frac{1}{3}x+\frac{1}{3}\ln(1+x)+C;$$

$$\frac{x}{\sqrt{1 - x^{2}}}\arcsin x + \frac{1}{2}\ln\left| 1 - x^{2} \right| + C; \quad (31) - \cos x\ln\tan x + \ln\left| \tan\frac{x}{2} \right| + C;$$

$$\frac{1}{4}x^{4}\left[(\ln x)^{2}-\frac{1}{2}\ln x+\frac{1}{8}\right]+C_{1}\quad(33)\quad-e^{-x}\arctan e^{x}+x-\frac{1}{2}\ln(1+e^{2x})+C_{2}$$

$$\frac{1}{2}(x - 1)\mathrm{e}^{x} - \frac{x}{10}\mathrm{e}^{x}(2\sin 2x + \cos 2x) + \frac{1}{50}\mathrm{e}^{x}(4\sin 2x - 3\cos 2x) + C;$$

$$\frac{-1}{\sqrt{1+x^{2}}}\arctan x+\frac{x}{\sqrt{1+x^{2}}}+C; \quad (36) \quad x\arcsin\sqrt{1-x^{2}}-\operatorname{sgn}x\sqrt{1-x^{2}}+C;$$

$$\ln x(\ln \ln x - 1) + C; \quad (38) \frac{1}{4}x^{2} + \frac{x}{4}\sin 2x + \frac{1}{8}\cos 2x + C;$$

$$\frac{1}{a^{2}+b^{2}}\mathrm{e}^{ax}\left ( a\cos bx+b\sin bx \right ) +C; \quad (40) \left ( 4-2x \right ) \cos \sqrt{x} +4\sqrt{x}\sin \sqrt{x} +C;$$

$$x\ln(1 + x^{2}) - 2x + 2\arctan x + C; \quad (42) \quad (x + 1)\arctan\sqrt{x} - \sqrt{x} + C;$$

$$\left( 4 3 \right) x \tan \frac { x } { 2 } + C ; \quad \left( 4 4 \right) \mathrm { e } ^ { \sin x } \left( x - \sec x \right) + C ; \quad \left( 4 5 \right) \frac { x \mathrm { e } ^ { x } } { \mathrm { e } ^ { x } + 1 } - \ln \left( 1 + \mathrm { e } ^ { x } \right) + C ;$$

$$x\ln^{2}\left(x+\sqrt{1+x^{2}}\right)-2\sqrt{1+x^{2}}\ln\left(x+\sqrt{1+x^{2}}\right)+2x+C;$$

$$\frac{x\ln x}{\sqrt{1 + x^{2}}} - \ln(x + \sqrt{1 + x^{2}}) + C_{3} \quad (48) \quad \frac{1}{4}(\arcsin x)^{2} + \frac{x}{2}\sqrt{1 - x^{2}}\arcsin x - \frac{x^{2}}{4} + C_{3}$$

$$\frac{1}{3}\sqrt{1 - x^{2}}\left( x^{2} + 2 \right)\arccos x - \frac{1}{9}x\left( x^{2} + 6 \right) + C; \quad (50) - \ln\left| \csc x + 1 \right| + C;$$

$$\ln \left| \tan x \right| - \frac{1}{2\sin^{2}x} + C_{1} \quad (52) \quad \frac{1}{3}\ln(2 + \cos x) - \frac{1}{2}\ln(1 + \cos x) + \frac{1}{6}\ln(1 - \cos x) + C_{2}$$

2. (1) $1 = \frac{2}{\mathrm{e}}$ (2) $\frac{1}{4}(\mathrm{e}^{2} + 1)$ (3) $= \frac{2\pi}{\omega^{2}}$ 14 (4) 9 1 3|2 *

[page:300]

(5) $4(2\ln 2 - 1)$ (6) $\frac { \pi } { 4 } - \frac { 1 } { 2 }$ (7) $\frac{1}{5}(\mathrm{e}^{\pi} - 2)$ ;(8) $2 - \frac{3}{4\ln 2};$ (9) $\frac { \pi ^ { 3 } } { 6 } - \frac { \pi } { 4 }$

$\left\{ \begin{aligned} &\frac{m!!}{(m + 1)!!} \cdot \frac{\pi}{2}, \\ &\frac{m!!}{(m + 1)!!}, \end{aligned} \right.$ m为奇数，(10) $\frac{1}{2}(\sin 1 - \cos 1 + 1)$ ; (11) $2\left(1 - \frac{1}{\mathrm{e}}\right)$ ；(12) m为偶数；

$\begin{aligned}J_{m}= & \left\{ \begin{aligned} & \frac{(m - 1)!!}{m!!} \cdot \frac{\pi^{2}}{2}, & m, \\ & \frac{(m - 1)!!}{m!!}\pi, & m. \end{aligned} \right.\end{aligned}$ 为偶数，(13) $J_{1} = \pi;$ (14) $\frac { \pi } { 2 } - 1$为大于1的奇数，

(15) $\pi \ln \left( \pi + \sqrt{\pi^{2} + a^{2}} \right) - \sqrt{\pi^{2} + a^{2}} + |a|$ (16) $\frac{1}{72}\pi^{2}+\frac{\sqrt{3}}{6}\pi-1$ ; (17) $\frac{63}{512}\pi^{2};$

(18) $\frac{21}{2048}\pi;$ (19) $\frac{63}{512} \pi ;$ (20) $\frac{\pi^{2}}{16}-\frac{\pi}{4}+\frac{1}{2}\ln 2$ a (21) $\frac{4}{3}\pi - \sqrt{3};$ (22) $\frac{\pi}{2}$

(23) $\frac{\pi^{2}}{2}+2\pi-4;$ (24) $\frac{5}{27}\mathrm{e}^{3}-\frac{2}{27}$ (25) $\frac { 1 } { 2 } .$

习题4.6

(1) $\frac{1}{3}x^{3}-\frac{3}{2}x^{2}+9x-27\ln \left | x+3 \right | +C;$ (2) $\ln |x - 2| + \ln |x + 5| + C;$

(3) $\frac{1}{2}\ln(x^{2}-2x+5)+\arctan\frac{x-1}{2}+C;$ (4) $\ln |x| - \frac{1}{2}\ln(x^2 + 1) + C;$

(5) $\ln \left| x + 1 \right| - \frac{1}{2}\ln \left( x^{2} - x + 1 \right) + \sqrt{3}\arctan\frac{2x - 1}{\sqrt{3}} + C;$ (6) $\frac{1}{x + 1} + \frac{1}{2}\ln|x^2 - 1| + C;$

$$2\ln \left | x+2 \right | -\frac{1}{2}\ln \left | x+1 \right | -\frac{3}{2}\ln \left | x+3 \right | +C;$$

(8) $\frac{1}{3}x^{3}+\frac{1}{2}x^{2}+x+8\ln\left | x \right | -4\ln\left | x+1 \right | -3\ln\left | x-1 \right | +C;$

(9) $\ln |x| - \frac{1}{2}\ln |x + 1| - \frac{1}{4}\ln(x^2 + 1) - \frac{1}{2}\arctan x + C;$

(10) $\frac{1}{4}\ln\left|\frac{x - 1}{x + 1}\right| - \frac{1}{2}\arctan x + C;$ (11) $-\frac{1}{2}\ln\frac{x^{2}+1}{x^{2}+x+1}+\frac{\sqrt{3}}{3}\arctan\frac{2x+1}{\sqrt{3}}+C;$

(12) $\arctan x - \frac{1}{x^{2} + 1} + C;$ (13) $-\frac{x + 1}{x^{2} + x + 1} - \frac{4}{\sqrt{3}}\arctan\frac{2x + 1}{\sqrt{3}} + C;$

(14) $\frac{1}{2\sqrt{3}}\arctan\frac{2\tan x}{\sqrt{3}}+C;$ (15) $\frac{1}{\sqrt{2}}\arctan\frac{\tan\frac{x}{2}}{\sqrt{2}}+C;$

(16) $\frac{2}{\sqrt{3}}\arctan\frac{2\tan\frac{x}{2}+1}{\sqrt{3}}+C;$ (17) $\ln \left[ 1 + \tan \frac{x}{2} \right] + C;$

(18) $\frac{1}{\sqrt{5}}\arctan\frac{3\tan\frac{x}{2}+1}{\sqrt{5}}+C;$ (19) $\frac{3}{2}\sqrt[3]{(1 + x)^{2}} - 3\sqrt[3]{x + 1} + 3\ln\left| 1 + \sqrt[3]{1 + x} \right| + C;$

(20) $\frac{1}{2}x^{2}-\frac{2}{3}\sqrt{x^{3}}+x-4\sqrt{x}+4\ln(\sqrt{x}+1)+C;$

[page:301]

$$x-4\sqrt{x+1}+4\ln(\sqrt{1+x}+1)+C; \quad (22) 2\sqrt{x}-4\sqrt[4]{x}+4\ln(\sqrt[4]{x}+1)+C;$$

$$\ln \left| \frac{\sqrt{1 - x} - \sqrt{1 + x}}{\sqrt{1 - x} + \sqrt{1 + x}} \right| + 2\arctan\sqrt{\frac{1 - x}{1 + x}} + C; \quad (24) - \frac{3}{2}\sqrt{\frac{x + 1}{x - 1}} + C;$$

$$\frac{1}{x - 2}-\arctan(x - 2)+C; \quad (26)\arctan x+\frac{5}{6}\ln\frac{x^{2}+1}{x^{2}+4}+C;$$

$$\frac{1}{5}x^{5}-\frac{1}{4}x^{4}+\frac{1}{3}x^{3}-\frac{1}{2}x^{2}+x-\ln\left | x+1 \right | +C_{5}\quad (28) \quad \frac{1}{2\sqrt{6}}\ln\left | \frac{\sqrt{3}x+\sqrt{2}}{\sqrt{3}x-\sqrt{2}} \right |+C_{5}$$

$$\frac{1}{10\sqrt{2}}\ln\left|\frac{x - \sqrt{2}}{x + \sqrt{2}}\right| - \frac{1}{5\sqrt{3}}\arctan\frac{x}{\sqrt{3}} + C;$$

$$\frac{1}{4}\ln \left | x^{4}-x^{2}+2 \right | +\frac{1}{2\sqrt{7}}\arctan \frac{2}{\sqrt{7}}\left ( x^{2}-\frac{1}{2} \right ) +C;$$

$$\frac{1}{2}\ln \left | x+2 \right | -\frac{1}{4}\ln \left | x^{2} +2x+2 \right | +\frac{1}{2}\arctan \left ( x+1 \right ) +C;$$

$$\frac{b}{a^{2}+b^{2}}\arctan\frac{x}{b}-\frac{a}{a^{2}+b^{2}}\ln\left | x+a \right | +\frac{a}{2\left ( a^{2}+b^{2} \right ) }\ln\left | x+b^{2} \right | +C;$$

$$\frac{1}{2}\ln \left | 1+x^{2} \right | +\arctan x+\frac{1}{x}-\frac{1}{3}x^{-3}+C; \quad (34) \frac{1}{2n}\left [ \arctan x^{n}-\frac{x^{n}}{1+x^{2n}} \right ] +C;$$

$$\frac{1}{2}\ln \left | x^{2}-1 \right |  +\frac{1}{x+1}+C_{1} \quad (36) x+\frac{1}{6}\ln \left | x \right | -\frac{9}{2}\ln \left | x-2 \right | +\frac{28}{3}\ln \left | x-3 \right | +C_{2}$$

$$\frac{1}{3}\ln \left | x-1 \right | -\frac{1}{6}\ln \left | x^{2}+x+1 \right | +\frac{1}{\sqrt{3} }\arctan \frac{2}{\sqrt{3} }\left ( x+\frac{1}{2}  \right )+C;$$

$$\frac{1}{3}\ln \left | x+1 \right | -\frac{1}{6}\ln \left | x^{2}-x+1 \right | +\frac{1}{\sqrt{3} }\arctan \frac{2}{\sqrt{3} }\left ( x-\frac{1}{2}  \right )+C_{3}$$

$$\frac{1}{2}\ln|x + 1| - \frac{1}{x + 2} - \frac{1}{2}\ln|x + 3| + C;$$

$$\left( 4 0 \right) - \frac { 2 } { 5 } \ln \left| x + 2 \right| + \frac { 1 } { 5 } \ln \left| x ^ { 2 } + 1 \right| + \frac { 1 } { 5 } \arctan x + C ;$$

$$\frac{3}{5}\sin\frac{5}{6}x+3\sin\frac{x}{6}+C_{5}\quad(42)\quad-\frac{1}{10}\cos\left(5x+\frac{\pi}{12}\right)+\frac{1}{2}\cos\left(x+\frac{5\pi}{12}\right)+C_{5}$$

$$\frac{x}{4}+\frac{\sin 6x}{24}+\frac{\sin 4x}{16}+\frac{\sin 2x}{8}+C; \quad (44) \frac{3x}{8}+\frac{\sin 2x}{4}+\frac{\sin 4x}{32}+C;$$

$$\sin x - \frac{2}{3}\sin^{3}x + \frac{1}{5}\sin^{5}x + C_{3} \quad (46) \quad \frac{1}{3}\sin^{3}x - \frac{2}{5}\sin^{5}x + \frac{1}{7}\sin^{7}x + C_{5}$$

$$\cos x+\frac{1}{\cos x}+C; \quad (48) \frac{1}{16}x-\frac{1}{64}\sin 4x+\frac{1}{48}\sin ^{2}2x+C;$$

$$\frac{1}{\sqrt{2}}\ln\left|\tan\left(\frac{x}{2}+\frac{\pi}{8}\right)\right|+C; \quad (50) \frac{1}{\sqrt{2}}\arcsin\left(\sqrt{\frac{2}{3}}\sin x\right)+C;$$

$$\frac{1}{2}\arctan(\cos 2x)+C; \quad \frac{1}{2}\frac{\sin x}{\cos^{2}x}+\frac{1}{2}\ln\left|\frac{1+\sin x}{\cos x}\right|+C;$$

$$\left( 5 3 \right) - \frac { 1 } { 2 } \frac { \cos x } { \sin ^ { 2 } x } + \frac { 1 } { 2 } \ln \left| \tan \frac { x } { 2 } \right| + C ; \quad \left( 5 4 \right) - \frac { 2 } { 5 } \cos ^ { 5 } x + C ;$$

$$\frac{2}{\sqrt{1 - \varepsilon^{2}}}\arctan\left[ \sqrt{\frac{1 - \varepsilon}{1 + \varepsilon}}\tan\frac{x}{2} \right] + C;$$

[page:302]

(56) $\frac{1}{2}\left( \sin x - \cos x \right) - \frac{1}{2\sqrt{2}}\ln\left| \tan\left( \frac{x}{2} + \frac{\pi}{8} \right) \right| + C;$ (57) $\tan x + \frac{1}{3}\tan^{3}x + C;$

(58) $\frac{1}{2\sqrt{2}}\ln\left|\frac{\sin 2x+\sqrt{2}}{\sin 2x-\sqrt{2}}\right|+C;$ (59) $\frac{2}{3}\mathrm{sh}^{3}x+C;$

(60) $\frac{1}{8}\mathrm{sh}4x+\frac{1}{4}\mathrm{sh}2x+C;$ (61) $\arcsin x - \sqrt{1 - x^{2}} + C;$

(62) $6t - 3t^{2} - 2t^{3} + \frac{3}{2}t^{4} + \frac{6}{5}t^{5} - \frac{6}{7}t^{7} + 3\ln(1 + t^{2}) - 6\arctan t + C,t = \sqrt[6]{x + 1}$

(63) $\frac{1}{2}x^{2}-\frac{x}{2}\sqrt{x^{2}-1}+\frac{1}{2}\ln\left | x+\sqrt{x^{2}-1} \right | +C;$

(64) $6 \left[ \ln | t | - \ln | 2 t + 1 | \right] + C , t = \sqrt[6]{x} ;$ (65) $\frac{3}{2}\left(\frac{x + 1}{x - 1}\right)^{\frac{1}{3}} + C;$

(66) $\sqrt{x^{2}-x+2}+\frac{1}{2}\ln\left|x-\frac{1}{2}+\sqrt{x^{2}-x+2}\right|+C;$

(67) $- \frac { 5 } { 1 8 } ( 1 + t ) ^ { - 1 } - \frac { 1 } { 6 } ( 1 + t ) ^ { - 2 } + \frac { 3 } { 4 } \ln | t - 1 | - \frac { 1 6 } { 2 7 } \ln | t - 2 | - \frac { 1 7 } { 1 0 8 } \ln | t + 1 | + C ,$ $t = \frac{1}{x + 1}\sqrt{x^{2} + 3x + 2};$

$$\frac{1}{3}\left(2-2x+x^{2}\right)^{\frac{3}{2}}+\frac{x-1}{2}\sqrt{2-2x+x^{2}}+\frac{1}{2}\ln\left(x-1+\sqrt{2-2x+x^{2}}\right)+C;$$

(69) $\frac{1}{\sqrt{2}}\ln\left|\frac{\sqrt{2}\sqrt{1 + x^{2}} + x - 1}{1 + x}\right| + C;$ (70) $\frac{-x}{\sqrt{x-x^{2}}+x}-\arctan\frac{\sqrt{x-x^{2}}}{x}+C;$

(71) $\frac{6}{11}t^{11}-\frac{10}{3}t^{9}+\frac{60}{7}t^{7}-12t^{5}+10t^{3}-6t+C,t=(x^{1/3}+1)^{1/2}.$

习题4.7

1. (1) $\frac{1}{3};$ （2）发散；（3） $\frac{1}{a}$ ; (4) $\frac { \pi } { 4 }$ ; (5) $\frac { \omega } { p ^ { 2 } + \omega ^ { 2 } }$ ；（6）π；（7）1；（8）发散；

(9) $\frac{8}{3};$ (10) $\frac{\pi}{2};$ (11) $\mathrm{e}^{-2}\left(\frac{\pi}{2}-\arctan \mathrm{e}^{-1}\right)$ ; (12) $\frac{\pi}{2} + \ln(2 + \sqrt{3})$ ；(13) $\frac{1}{2}$

(14) $\ln 2$ ；(15)π；(16) $\pi \frac{(2n - 3)!!}{(2n - 2)!!}$ (17) $\frac{1}{2^{n + 1}}(-1)^{n}n!$ (18) $\frac{a + b}{2}\pi$

(19) $\frac{1}{4}\pi + \frac{1}{2}\ln 2$ (20) $\frac{\pi}{3}$ ; (21)1; (22) $\frac{2\pi}{3\sqrt{3}}$ ；(23)2; (24) $-\frac{1}{2}$

(25) $\frac { \pi } { 2 } - 1$ ; (26) $\frac{1}{2ab(a + b)}\pi;$ (27) $\frac{\pi}{2}$ ;(28) $\frac { 4 4 } { 3 } .$

2. 当k>1 时收敛于 $\frac{1}{(k - 1)(\ln 2)^{k - 1}}$ ;当 $k \leqslant 1$ 时发散.

3. $n ! ,$

4. (1) $-\frac{\pi}{2}\ln 2$ (2) $\frac{\pi}{4};$ (3) $\frac{2}{3}\ln 2-\frac{1}{4}\ln 3$ ；(4) $-\frac{\pi}{2} \ln 2$ ;(5) $\frac{1}{5}\ln\left(1+\frac{2}{\sqrt{3}}\right)$

5. $\frac{1}{4}$

6. $\frac{1}{r}  km .$

[page:303]

# 第5章

习题5.1

1.（1）是；（2）是；（3）不是；（4）是；（5）y=sinx不是 $y = \mathrm{e}^{2x}$ 是， $y = C\mathrm{e}^{2x}$ 是；

(6) $y=\frac{1}{2}x+1$ 是， $y = C\mathrm{e}^{x/2}$ 不是， $y = C\mathrm{e}^{x/2} + \frac{x}{2} + 1$ 是.

2. 略.

3. (1) $C=-25;$ (2) $C_{1}=0,C_{2}=1$ ； (3) $C_{1}=(-1)^{k},C_{2}=k\pi+\frac{\pi}{2},k\in\mathbf{Z}.$

4. (1) $y = \frac{1}{\omega} \left( 1 - \cos \omega t \right)$ ; (2) $y = \ln x - 1$ ; (3) $y = x^{3} + 2x.$

5. (1) $y^{\prime} = x^{2};$ (2) $y y^{\prime} + 2 x = 0$

6. $\frac{\mathrm{d}p}{\mathrm{d}T}=k\frac{p}{T^{2}}$

习题5.2

1. (1) $y = \mathrm{e}^{Cx}$ (2) $y=\frac{1}{2}x^{2}+\frac{1}{5}x^{3}+C;$ (3) $\arcsin y = \arcsin x + C;$

(4) $\frac{1}{y}=a\ln\left|x+a-1\right|+C;$ (5) $\tan x \tan y = C;$ (6) $10^{-y}+10^{x}=C;$

(7) $\left( \mathrm{e}^{x} + 1 \right) \left( \mathrm{e}^{y} - 1 \right) = C;$ (8) $\sin x \sin y = C;$ (9) $3x^{4}+4(y+1)^{3}=C;$

(10) $(x - 4)y^{4} = Cx;$ (11) $\sqrt[3]{3x + 1} = C(t + 2)$ ; (12) $\frac{y}{1 - ay} = C(a + x)$

(13) $y^{2}-1=C(1+x^{2})$ ; (14) $y^{2}+1=C\left(\frac{x-1}{x+1}\right)$

2. (1) $\mathrm{e}^{y} = \frac{1}{2} \left( \mathrm{e}^{2x} + 1 \right);$ (2) $\cos x - \sqrt{2}\cos y = 0;$ (3) $\ln y = \tan \frac{x}{2}$

(4) $(1 + \mathrm{e}^{x})\sec y = 2\sqrt{2};$ (5) $x^{2}y = 4$ (6) $y^{2}=2\ln(1+\mathrm{e}^{x})+1-2\ln(1+\mathrm{e})$ sn.

(7) $3x^{2}+2x^{3}-3y^{2}-2y^{3}+5=0.$

3. $t = -0.0305h^{\frac{5}{2}} + 9.64$ ，水流完所需的时间约为10s.

4. $\bar{v}=\sqrt{72500} \approx 269.3(cm/s)$

5. $R = R_{0} \mathrm{e}^{-0.000433t}$

6. $x y { = } 6 .$

7.取O为原点，河岸朝顺水方向为x轴，y轴指向对岸，则所求航线为

$$x = \frac{k}{a} \left( \frac{h}{2} y^2 - \frac{1}{3} y^3 \right).$$

8. $T = 20 + 30\mathrm{e}^{-kt}$

9. $\frac{4}{3} \times 10^{5}  s  = 37.037  h$

习题5.3

1. (1) $y+\sqrt{y^{2}-x^{2}}=Cx^{2}$ ; (2) $\ln \frac{y}{x} = Cx + 1;$ (3) $y^{2}=x^{2}\left(2\ln\left|x\right|+C\right)$

[page:304]

(4) $x^{3}-2y^{3}=Cx;$ (5) $x^{2}=C\sin^{3}\frac{y}{x};$ (6) $x + 2y\mathrm{e}^{\frac{x}{y}} = C;$

(7) $\sqrt{4x + 2y - 1} - 2\ln(\sqrt{4x + 2y - 1} + 2) = x + C;$ (8) $x^{2}=y^{2}\left(\ln |x|+C\right)$

(9) $\sin \frac{y}{x} = Cx;$ (10) $\arcsin \frac{y}{x} = \ln x + C;$ (11) $(x - y)^{2} - 2x + 4y = C;$

(12) $\ln | y + 2 | + 2\arctan\frac{y + 2}{x - 3} = C;$ (13) $\frac{x + y}{x + 3}\left( 1 - \ln\frac{x + y}{x + 3} \right) = \frac{C}{x + 3};$

(14) $x\sqrt{\frac{y^{4}}{x^{2}}+\frac{2y^{2}}{x}-1}=C;$ (15) $\sqrt{y}\sqrt[3]{2-3x^{-1}\sqrt{y}}=C.$

2. (1) $y^{3} = y^{2} - x^{2}$ (2) $y^{2} = 2x^{2}(\ln x + 2)$ ； (3) $\frac{x + y}{x^{2} + y^{2}} = 1$

3. $y = x(1 - 4\ln x).$

4. (1) $(4y - x - 3)(y + 2x - 3)^{2} = C;$ (2) $\ln \left[ 4 y ^ { 2 } + ( x - 1 ) ^ { 2 } \right] + \arctan \frac { 2 y } { x - 1 } = C ;$

(3) $(y - x + 1)^{2}(y + x - 1)^{5} = C;$ (4) $x+3y+2\ln\left | x+y-2 \right | =C.$

5. 略.

习题5.4

1. (1) $y = \mathrm{e}^{-x} (x + C);$ (2) $y=\frac{1}{3}x^{2}+\frac{3}{2}x+2+\frac{C}{x};$ (3) $y = (x + C)\mathrm{e}^{-\sin x}$ a0.

(4) $y = C\cos x - 2\cos^{2}x;$ (5) $y=\frac{\sin x+C}{x^{2}-1};$ (6) $3\rho = 2 + C\mathrm{e}^{-3\theta}$ (7) $y = 2 + C\mathrm{e}^{-x^2}$

(8) $2x\ln y = \ln^{2}y + C;$ (9) $y = (x - 2)^3 + C(x - 2)$ (10) $x = C y ^ { 3 } + \frac { 1 } { 2 } y ^ { 2 }$

(11) $x-\sqrt{xy}=C;$ (12) $y = ax + \frac{C}{\ln x}$ (13) $x = C y ^ { - 2 } + \ln y - \frac { 1 } { 2 }$

(14) $y^{-2} = C\mathrm{e}^{x^{2}} + x^{2} + 1;$ (15) $x^{2}=C y^{6}+y^{4}$ (16) $\sqrt{\left(x^{2}+y\right)^{3}}=x^{3}+\frac{3}{2}xy+C;$

(17) $y = C\mathrm{e}^{-\frac{2}{3}x} + 3x - \frac{9}{2}$ (18) $y = C\mathrm{e}^{-x} + \frac{1}{2}x\mathrm{e}^{x} - \frac{1}{4}\mathrm{e}^{x}$ ;(19) $y = C\mathrm{e}^{-\frac{1}{3}x^3}$

(20) $y = C x + x \ln | \ln x |$ (21) $x = y^{2} + C y^{2} \mathrm{e}^{\frac{1}{y}}$ a

2.(1) $y = \frac{x}{\cos x},$ (2) $y = \frac{\pi - 1 - \cos x}{x}$ ;(3) $y\sin x + 5\mathrm{e}^{\cos x} = 1$

(4) $y = \frac{2}{3} \left( 4 - \mathrm{e}^{-3x} \right)$ (5) $2y = x^{3} - x^{3}e^{x^{2} - 2} - 1$ ; (6) $x(1 + 2\ln y) - y^{2} = 0$ OP

(7) $y = (5 + x)\mathrm{e}^{-x}$ (8) $y = \frac{1}{2x}(\mathrm{e} + \mathrm{e}^{2x})$

3. $y = x - x\ln x.$

4. $2 5 0 \mathrm { m } ^ { 3 }$

5. $\varphi(x)=\cos x+\sin x.$

6. $y = 2 \left( \mathrm{e}^{x} - x - 1 \right)$

7. $v = \frac{k_{1}}{k_{2}}t - \frac{k_{1}m}{k_{2}^{2}}(1 - \mathrm{e}^{-\frac{k_{2}}{m}t}).$

[page:305]

8. $i = \mathrm{e}^{-5t} + \sqrt{2}\sin\left(5t - \frac{\pi}{4}\right)A.$

9. $v = \left( v _ { 0 } - \frac { 1 } { k } m g \right) \mathrm { e } ^ { - \frac { k } { m } t } + \frac { 1 } { k } m g .$

10. $v ( t ) = \frac { g } { k - m _ { 1 } } ( M _ { 0 } - m _ { 1 } t ) - \frac { g } { k - m _ { 1 } } M _ { 0 } ^ { 1 - \frac { k } { m _ { 1 } } } ( M _ { 0 } - m _ { 1 } t ) ^ { \frac { k } { m _ { 1 } } } ,$

11. $t_{1} = \frac{h(v_{0} - v_{1})}{v_{0}v_{1}}\left( \ln\frac{v_{0}}{v_{1}} \right)^{- 1}$

12. $2y = 3x^{2} - 2x - 1$

13. $x^{2}+y^{2}=C.$

14. (1) $\frac{1}{y} = -\sin x + C\mathrm{e}^{x}$ (2) 3 x2 2+ ln 3 =C;(3) $\frac{1}{y^{3}} = C\mathrm{e}^{x} - 1 - 2x;$ 2 y

(4) $\frac{1}{y^{4}} = - x + \frac{1}{4} + C\mathrm{e}^{- 4x}$ (5) 23 23 2 2+lnx) +C; (6) $y^{-5} = \frac{5}{2}x^{3} + Cx^{5}$ 2

(7) y2 =C(1−x2)1 一 1 (1−x²), |x|<1;y2 =C(x²−1)+ 1 -(1−x²),|x|>1; 3 3

(8) $y^{3}=ax+cx(1-x^{2})^{\frac{1}{2}},|x|<1;y^{3}=ax+cx(x^{2}-1)^{\frac{1}{2}},|x|>1;$

(9) $y^{2}=-x^{2}-x-\frac{1}{2}+Ce^{2x};$ (10) $y^{3} = - \frac{1}{a}\left[ x + 1 + \frac{1}{a} \right] + C\mathrm{e}^{ax}$

(11) $\left( \sin y \right)^{-2} = C\mathrm{e}^{2x} + 2.$

15. $\ln \left| x \right| + \int \frac{g(v)   dv}{v \left[ f(v) - g(v) \right]} = C, v = xy.$

16. (1) $y = -x + \tan(x + C)$ (2) $(x - y)^{2} = - 2x + C;$ (3) $y = \frac{1}{x} \mathrm{e}^{Cx}$

(4) $y=1-\sin x-\frac{1}{x+C};$ (5) $2x^{2}y^{2}\ln\left | y \right |  - 2xy - 1 = Cx^{2}y^{2}$

17. $\varphi(x)=C|x|^{\frac{1-n}{n}}$

习题5.5

1. (1) $y = \frac{1}{6}x^{3} - \sin x + C_{1}x + C_{2};$ (2) $y=(x-3)e^{x}+C_{1}x^{2}+C_{2}x+C_{3}$ OP

(3) $y = x \arctan x - \frac{1}{2} \ln(1 + x^2) + C_1 x + C_2;$ (4) $y = - \ln \left[ \cos ( x + C _ { 1 } ) \right] + C _ { 2 }$

(5) $y = C_{1} \mathrm{e}^{x} - \frac{1}{2} x^{2} - x + C_{2}$ (6) $y = C_{1} \ln |x| + C_{2}; \quad (7) y^{3} = C_{1}.x + C_{2};$ 1

(8) $C_{1}y^{2}-1=\left(C_{1}x+C_{2}\right)^{2};$ (9) $x + C_{2} = \pm \left[ \frac{2}{3} \left( \sqrt{y} + C_{1} \right)^{\frac{3}{2}} - 2C_{1} \sqrt{\sqrt{y} + C_{1}} \right];$

(10) $y = \arcsin(C_2\mathrm{e}^x) + C_1$ (11) $y = \ln \left| \cos (x + C_1) \right| + C_2$

(12) $y = \frac{1}{2C_{1}} \left( \mathrm{e}^{C_{1}x + C_{2}} + \mathrm{e}^{-C_{1}x - C_{2}} \right)$ (13) $y=C,y=x^{2}+C,y=-x^{2}+C;$

(14) $y^{2}-x^{2}=C,y=Cx;$ (15) $y = C , y = \mathrm{e}^{x} + C , y = - \mathrm{e}^{x} + C ;$

(16) $y = C\mathrm{e}^{2x} , y = C\mathrm{e}^{-2x} ; \quad (17) -\sqrt{1-2y} + \ln|\sqrt{1-2y} \pm 1| = x + C;$

(18) $y = C_{1}x\ln x + \frac{1}{2}x^{2} + C_{2}x + C_{3}$ (19) $y = - \sqrt{1 - \left( x + C_{1} \right)^{2}} + C_{2}$

[page:306]

(20)当 $y^{'} \ne 0$ 时 $\int \frac{\mathrm{d}y}{y^{2} + C_{1}} = x + C_{2}$ ;当 $y ^ { \prime } = 0$ 时 $, y \equiv C ;$

(21) $y = C_{1} \left( x - \mathrm{e}^{-x} \right) + C_{2}$ (22) $y = x^{2} \arctan(C_{1}x) - \frac{x}{C_{1}} + \frac{1}{C_{1}^{2}} \arctan(C_{1}x) + C_{2}$

2. (1) $y = \sqrt{2x - x^{2}}$ (2) $y = - \frac{1}{a}\ln(ax + 1)$

(3) $y = \frac{1}{a^{3}}e^{ax} - \frac{e^{a}}{2a}x^{2} + \frac{e^{a}}{a^{2}}(a - 1)x + \frac{e^{a}}{2a^{3}}(2a - a^{2} - 2);$ (4) $y = \mathrm{Insec}x$

(5) $y = \left( \frac{1}{2}x + 1 \right)^{\alpha}$ (6) $y = \ln( \mathrm{e}^{x} + \mathrm{e}^{-x} ) - \ln 2$ 00. (7) $y = 2  arctan  e^x$

3. $y=\frac{x^{3}}{6}+\frac{x}{2}+1$

4. $\frac{mg}{c}\left(t+\frac{m}{c}\mathrm{e}^{-\frac{c}{m}t}-\frac{m}{c}\right)$

习题5.6

1.（1）线性无关；（2)线性相关；（3）线性相关；（4）线性无关；（5）线性无关；(6）线性无关；（7）线性相关；（8）线性无关；（9）线性无关；（10）线性无关；(11)线性无关.

2. $y = C_{1} \mathrm{e}^{x} + C_{2} \mathrm{e}^{-x} ; y = 1 + C_{1} \mathrm{e}^{x} + C_{2} \mathrm{e}^{-x}.$

$$y = C_{1} + C_{2}\sin x + C_{3}\cos x, \quad y = \frac{1}{2}x^{2} + C_{1} + C_{2}\sin x + C_{3}\cos x.$$

4. y=C1+C2x+C3x2+…+Cnx−1;y= n!

5. $y = C_{1} \cos \omega x + C_{2} \sin \omega x.$

6. $y = \left( C_{1} + C_{2} x \right) \mathrm{e}^{x^{2}}$

7. 略.

8. $y = C_{1} \mathrm{e}^{x} + C_{2} (2x + 1)$

9. $y = C_{1}x + C_{2}x^{2} + x^{3}$

10. $y = C_{1}\cos x + C_{2}\sin x + x\sin x + \cos x\ln\left| \cos x \right|.$

11. $y = C_{1}x + C_{2}x\ln\left| x \right| + \frac{1}{2}x\ln^{2}\left| x \right|.$

习题5.7

1. (1) $y = C_{1} \mathrm{e}^{x} + C_{2} \mathrm{e}^{- 2x}$ (2) $y = C_{1} + C_{2} \mathrm{e}^{4x}$ (3) $y = C_{1} \cos x + C_{2} \sin x$

(4) $y = \mathrm{e}^{-3x} \left( C_{1} \cos 2x + C_{2} \sin 2x \right)$ ;(5) $x = (C_{1} + C_{2}t)\mathrm{e}^{\frac{5}{2}t}$

$$y = \mathrm{e}^{2x}(C_1\cos x + C_2\sin x); \quad (7) y = C_1\mathrm{e}^{x} + C_2\mathrm{e}^{-x} + C_3\cos x + C_4\sin x;$$

(8) $y = (C_{1} + C_{2}x)\cos x + (C_{3} + C_{4}x)\sin x; \quad (9) y = C_{1} + C_{2}x + (C_{3} + C_{4}x)\mathrm{e}^{x};$

(10) $y = C_{1}\mathrm{e}^{2x} + C_{2}\mathrm{e}^{-2x} + C_{3}\cos{3x} + C_{4}\sin{3x}$ (11) $y = C_{1} \mathrm{e}^{-x} + C_{2} \mathrm{e}^{-2x}$

(12) $y = C_{1} \mathrm{e}^{- 2x} + C_{2} \mathrm{e}^{- \frac{1}{2}x}$ (13) $y = C_{1} + C_{2} \mathrm{e}^{3x}$ ; (14) $y = \left( C_{1} + C_{2} x \right) \mathrm{e}^{3x}$

(15) $y = C_{1} \cos 3x + C_{2} \sin 3x;$ (16) $y = \mathrm{e}^{-\frac{1}{2}x} \left( C_1 \cos \frac{\sqrt{3}}{2} x + C_2 \sin \frac{\sqrt{3}}{2} x \right)$

[page:307]

(17) $u = C_{1}\cos Bt + C_{2}\sin Bt; \quad (18) y = \mathrm{e}^{-\delta x}\left(C_{1}\cos\sqrt{\omega_{0}^{2}-\delta^{2}}x + C_{2}\sin\sqrt{\omega_{0}^{2}-\delta^{2}}x\right)$

$$y = C_{1}\mathrm{e}^{x} + \mathrm{e}^{-\frac{1}{2}x}\left(C_{2}\cos\frac{\sqrt{3}}{2}x + C_{3}\sin\frac{\sqrt{3}}{2}x\right); \quad (20) y = C_{1}\mathrm{e}^{x} + C_{2}\mathrm{e}^{\frac{\sqrt{3}}{2}x} + C_{3}\mathrm{e}^{-\frac{\sqrt{3}}{2}x};$$

(21) $y = \left( C_{1} + C_{2}x + C_{3}x^{2} \right) \mathrm{e}^{-x}$

2. (1) $y = 4\mathrm{e}^{x} + 2\mathrm{e}^{3x}$ (2) $y = (2 + x)\mathrm{e}^{-\frac{x}{2}}$ (3) $y = \mathrm{e}^{-x} - \mathrm{e}^{4x}$ ； (4) $y = 3\mathrm{e}^{- 2x}\sin 5x$

(5) $y = 2\cos 5x + \sin 5x; \quad (6) y = \mathrm{e}^{2x}\sin 3x; \quad (7) y = (1 + 3x)\mathrm{e}^{-2x};$

$$y = 2\cos\frac{3}{2}x - \frac{2}{3}\sin\frac{3}{2}x.$$

$$x = \frac{v_{0}}{\sqrt{k_{2}^{2} + 4k_{1}}}(1 - \mathrm{e}^{- \sqrt{k_{2}^{2} + 4k_{1}}t})\mathrm{e}^{\left( - \frac{k_{2}}{2} + \frac{\sqrt{k_{2}^{2} + 4k_{1}}}{2} \right)t}$$

$$u_{C}(t)=\frac{10}{9}(19\mathrm{e}^{-10^{3}t}-\mathrm{e}^{-1.9\times10^{4}t})\mathrm{V},i(t)=\frac{19}{18}\times10^{-2}(-\mathrm{e}^{-10^{3}t}+\mathrm{e}^{-1.9\times10^{4}t})\mathrm{A}.$$

5. $M = 195  kg$

6. 略.

## 习题5.8

1. (1) $y = C_{1} \mathrm{e}^{\frac{x}{2}} + C_{2} \mathrm{e}^{-x} + \mathrm{e}^{x}$ (2) $y = C_{1}\cos ax + C_{2}\sin ax + \frac{\mathrm{e}^{x}}{1 + a^{2}};$

$$y = C_{1} + C_{2} \mathrm{e}^{-\frac{x}{2}} + \frac{1}{3}x^{3} - \frac{3}{5}x^{2} + \frac{7}{25}x; \quad (4) y = C_{1} \mathrm{e}^{-x} + C_{2} \mathrm{e}^{-2x} + \left(\frac{3}{2}x^{2} - 3x\right)\mathrm{e}^{-x};$$

$$y = \mathrm{e}^{x}(C_{1}\cos 2x + C_{2}\sin 2x) - \frac{1}{4}x\mathrm{e}^{x}\cos 2x; \quad (6) y = (C_{1} + C_{2}x)\mathrm{e}^{2x} + \frac{x^{2}}{2}(\frac{1}{3}x + 1)\mathrm{e}^{2x};$$

$$y = C_{1}\mathrm{e}^{-x} + C_{2}\mathrm{e}^{-4x} + \frac{11}{8} - \frac{1}{2}x; \quad (8) y = C_{1}\cos 2x + C_{2}\sin 2x + \frac{1}{3}x\cos x + \frac{2}{9}\sin x;$$

$$y = C_{1}\cos x + C_{2}\sin x + \frac{e^{x}}{2} + \frac{x}{2}\sin x; \quad (10) y = C_{1}e^{x} + C_{2}e^{-x} - \frac{1}{2} + \frac{1}{10}\cos 2x;$$

$$y = \mathrm{e}^{-x} \left( C_1 \cos 2x + C_2 \sin 2x \right) - \frac{4}{17} \cos 2x + \frac{1}{17} \sin 2x;$$

$$y = C_{1} + C_{2} \mathrm{e}^{x} + C_{3} \mathrm{e}^{-2x} + \left( \frac{1}{6}x^{2} - \frac{4}{9}x \right)\mathrm{e}^{x} - x^{2} - x;$$

$$y = \mathrm{e}^{2x}(C_1\cos x + C_2\sin 2x) + 1; \quad y = C_1 + C_2\mathrm{e}^{-2x} + \frac{4}{15}\mathrm{e}^{2x};$$

$$y = C_{1}\mathrm{e}^{3x} + C_{2}\mathrm{e}^{4x} + \frac{1}{12}x + \frac{7}{144}; \quad (16) y = C_{1}\cos 3x + C_{2}\sin 3x + 2\sin 2x;$$

$$y = C_{1}\cos 3x + C_{2}\sin 3x + 2\cos 2x; \quad (18) y = C_{1}\mathrm{e}^{2x} + C_{2}\mathrm{e}^{-\frac{1}{2}x} - \frac{1}{3}\mathrm{e}^{x} + \frac{1}{3}\mathrm{e}^{-x};$$

$$y = \mathrm{e}^{-x} \left( C_1 \cos 2x + C_2 \sin 2x \right) + \mathrm{e}^{x} \left( \frac{11}{65} \sin x + \frac{3}{65} \cos x \right);$$

$$y = C_{1} \mathrm{e}^{-x} + C_{2} \mathrm{e}^{\frac{1}{2}x} + \left( \frac{1}{9}x^{2} - \frac{2}{9}x + \frac{14}{81} \right) \mathrm{e}^{2x}$$

(22) $y = C_{1} \mathrm{e}^{2x} + C_{2} \mathrm{e}^{-2x} - \frac{1}{8} - \frac{1}{16} \cos 2x;$

[page:308]

(23) $y = C_{1}\sin x + C_{2}\cos x + (C_{3} + C_{4}x)\mathrm{e}^{2x} + \frac{1}{2}\mathrm{e}^{x}.$

2. (1) $y = - \cos x - \frac{1}{3}\sin x + \frac{1}{3}\sin 2x;$ (2) $y = - 5\mathrm{e}^{x} + \frac{7}{2}\mathrm{e}^{2x} + \frac{5}{2};$

(3) $y = \frac{1}{2} \left( \mathrm{e}^{9x} + \mathrm{e}^{x} \right) - \frac{1}{7} \mathrm{e}^{2x};$ (4) $y = \mathrm{e}^{x} - \mathrm{e}^{- x} + \mathrm{e}^{x}(x^{2} - x)$ a0

(5) $y = \frac{11}{16} + \frac{5}{16}\mathrm{e}^{4x} - \frac{5}{4}x;$ (6) $y = x \mathrm{e}^{-x} + \frac{1}{2} \sin x$

(7) $y = \frac{3}{16}\mathrm{e}^{2x} + \frac{1}{16}\mathrm{e}^{-2x} - \frac{1}{4};$ (8) $u = - \frac{1}{4}\mathrm{e}^{t} + \frac{1}{20}\mathrm{e}^{3t} + \frac{1}{10}\sin t + \frac{1}{5}\cos t;$

(9) $y = 1 + \frac{1}{4}\mathrm{e}^{-x} + 2x + \left( \frac{1}{2}x - \frac{1}{4} \right)\mathrm{e}^{x}.$

3.取炮口为原点，炮弹前进的水平方向为x轴，铅直向上为y轴，弹道曲线为

$$x = v_{0} \cos \alpha \cdot t, \quad y = v_{0} \sin \alpha \cdot t - \frac{1}{2}gt^{2}.$$

4. $u_{C}(t) = 20 - 20\mathrm{e}^{-5 \times 10^{3}t} \left[ \cos(5 \times 10^{3}t) + \sin(5 \times 10^{3}t) \right] V.$

$$i(t) = 4 \times 10^{-2} \mathrm{e}^{-5 \times 10^3 t} \sin(5 \times 10^3 t) \mathrm{A}$$

5. (1) $t = \sqrt{\frac{10}{g}} \ln(5 + 2\sqrt{6})    s ;$ (2) $t = \sqrt{\frac{10}{g}} \ln \left( \frac{19 + 4\sqrt{22}}{3} \right)  s$

6. $\varphi(x)=\frac{1}{2}(\cos x+\sin x+\mathrm{e}^{x}).$

习题5.9

(1) $y = C_{1}x + \frac{C_{2}}{x}$

(2) $y = x ( C _ { 1 } + C _ { 2 } \ln | x | ) + x \ln ^ { 2 } | x | .$

(3) $y = C_{1}x + C_{2}x\ln|x| + C_{3}x^{-2}.$

(4) $y = C_{1}x + C_{2}x^{2} + \frac{1}{2}\left( \ln^{2}x + \ln x \right) + \frac{1}{4}$

(5) $y = C_{1}x^{2} + C_{2}x^{-2} + \frac{1}{5}x^{3}.$

(6) $y = x \left[ C_{1} \cos \left( \sqrt{3} \ln x \right) + C_{2} \sin \left( \sqrt{3} \ln x \right) \right] + \frac{1}{2} x \sin \left( \ln x \right).$

(7) $y = C_{1}x^{2} + C_{2}x^{2}\ln x + x + \frac{1}{6}x^{2}\ln^{3}x.$

$$y = C_{1}x + x\left[ C_{2}\cos(\ln x) + C_{3}\sin(\ln x) \right] + \frac{1}{2}x^{2}(\ln x - 2) + 3x\ln x.$$

(9) $y = \frac{1}{x} \left( C_1 + C_2 \ln |x| \right).$

(10) $y = C_{1}x^{2} + C_{2}x^{3} + \frac{1}{2}x.$

(11) $R = C_{1}t^{-n-1} + C_{2}t^{n}$

(12) $y = \frac{1}{x} \left[ C_1 \cos (2 \ln x) + C_2 \sin (2 \ln x) \right].$

[page:309]

(13) $y = ( C _ { 1 } + C _ { 2 } \ln x ) x + 4 + 2 \ln x.$

(14) $y = \left( C _ { 1 } + C _ { 2 } \ln x \right) \frac { 1 } { x ^ { 2 } } + \frac { 3 } { 4 } \ln x - \frac { 3 } { 4 }$

# 第6章

习题6.1

1-4. 略.

5.有分别位于(1,2)，(2,3)及(3,4)内的三个根.

6-33. 略.

习题6.2

1. （1)1; （2)2; (3) $\text{∠ }COSa ;$ (4) $-\frac{3}{5};$ (5) $-\frac{1}{8};$ (6) $\frac{m}{n}a^{m - n}$ ；(7)1; (8)3;

(9)1;(10)1;(11) $\frac { 1 } { 2 }$ ；(12)∞；(13) $= \frac { 1 } { 2 }$ ； (14) $\mathrm { e } ^ { a } \; ,$ (15)1；（16)1;

(17) 2; (18) $\frac{1}{2}$ ; (19) $\mathrm{e}^{-\frac{2}{\pi}}$ ; (20) $a_{1}a_{2}\cdots a_{n};$ (21) 2;(22) $-\frac{1}{8}$ ; (23) $-\frac{1}{6}$

(24) $\frac{16}{9}$ ; (25) $-\frac{\mathrm{e}}{2};$ (26) $\frac{2\mathrm{e}}{\mathrm{e} - 1}$ ；(27)2; (28)1；(29) $\left( \frac{a}{b} \right)^{2}$ ; (30) 0;

(31)0;(32)1;(33) $\frac{1}{\mathrm{e}}$ ; (34) $\mathrm{e}^{-\frac{2}{\pi}}$ ;(35) $\mathrm{e}^{-\frac{2}{\pi}}$ ；(36) $\mathrm{e}^{\frac{1}{6}}$ ;(37) $\frac{1}{2}$ ;(38) $\frac{1}{2}$

(39) $-\frac{1}{3}$ ；(40)1; (41) 2; (42)4; (43)1.

2-3. 略.

4. 连续.

5. 略.

习题6.3

1. $f(x)=-56+21(x-4)+37(x-4)^{2}+11(x-4)^{3}+(x-4)^{4}$

2. $f(x)=x^{6}-9x^{5}+30x^{4}-45x^{3}+30x^{2}-9x+1.$

$$\sqrt{x}=2+\frac{1}{4}(x-4)-\frac{1}{64}(x-4)^{2}+\frac{1}{512}(x-4)^{3}-\frac{15(x-4)^{4}}{4!16[4+\theta(x-4)]^{2}}(0<\theta<1).$$

4. $\ln x = \ln 2 + \frac{1}{2}(x - 2) - \frac{1}{2^3}(x - 2)^2 + \frac{1}{3 \cdot 2^3}(x - 2)^3 - \cdots$ $+ ( - 1 ) ^ { n - 1 } \frac { 1 } { n \cdot 2 ^ { n } } ( x - 2 ) ^ { n } + o ( ( x - 2 ) ^ { n } ) .$

5. = −[1+(x+1)+(x+1)²+…+(x+1)"] x $+ ( - 1 ) ^ { n + 1 } \frac { ( x + 1 ) ^ { n + 1 } } { \left[ - 1 + \theta ( x + 1 ) \right] ^ { n + 2 } } ( 0 < \theta < 1 ) .$

6. $\tan x = x + \frac{1}{3}x^{3} + o(x^{3})$

7. $x \mathrm{e}^{x}=x+x^{2}+\frac{x^{3}}{2!}+\cdots+\frac{x^{n}}{(n-1)!}+o(x^{n})(0<\theta<1).$

[page:310]

8.(1) $x+x^{2}+\frac{1}{2!}x^{3}+\cdots+\frac{1}{n!}x^{n+1}+o(x^{n+1}),x\to0;$

(2) $1+\frac{1}{2!}x^{2}+\frac{1}{4!}x^{4}+\cdots+\frac{1}{(2n)!}x^{2n}+o(x^{2n+1}),x\rightarrow0;$

(3) $2x+\frac{2}{3}x^{3}+\frac{2}{5}x^{5}+\cdots+\frac{2}{2n-1}x^{2n-1}+o(x^{2n}),x\to0;$

(4) $1 - \frac{2}{2!}x^{2} + \frac{2^{3}}{4!}x^{4} + \cdots + (-1)^{m}\frac{2^{2m - 1}}{(2m)!}x^{2m} + o(x^{2m + 1}), x \rightarrow 0;$

$$-1-3x-3x^{2}-4x^{3}-4x^{4}-\cdots-4x^{n}+o(x^{n}),x\to0.$$

(6) $1 - \frac{1}{2!}x^{4} + \frac{1}{4!}x^{8} + \cdots + (-1)^{m} \frac{1}{(2m)!}x^{4m} + o(x^{4m+2})$

9. x+ 1 23 X 32 + (2m−1)!!]2x2m+1+0(x2m+1),x→0. 3! 5! (2m+1)!

10. (1) $1+x-\frac{1}{3}x^{3}-\frac{1}{6}x^{4}+o(x^{4}),x\to0;$ 二1

(2) $x - \frac{1}{3}x^{3} + o(x^{4}) , x \rightarrow 0 ;$ (3) $x - \frac{1}{3}x^{3} + o(x^{3}), x \rightarrow 0;$

(4) $-x-x^{2}-3x^{3}+o(x^{3}),x\to0;$ (5) $1+2x+2x^{2}-2x^{4}+o(x^{4}),x\to0$

(6) $x^{2}+\frac{1}{2}x^{3}-\frac{1}{8}x^{4}+o(x^{4}),x\rightarrow0.$

11. (1) $\frac{3}{2};$ (2) $\frac{1}{6} ;$ (3) $-\frac{1}{12}$ (4) $\mathrm{ln}^{2}a;$ (5)1；(6) $2 ^ { - 7 }$ ; (7) 0.

12-13. 略.

14. $a=\frac{4}{3},b=-\frac{1}{3};$

15-16. 略.

习题6.4

1. 单调减少.

2. 单调增加.

3.（1） 在 $( - \infty , 0 ] , [ 2 , + \infty )$ 上单调下降，在 $[ 0 , 2 ]$ 上单调上升. $f(0) = 0$ 为极小值， $f(2) = 4$为极大值；

(2) 在(—1,0]上单调下降，在 $[ 0 , + \infty )$ 上单调上升. $f(0) = 0$ 为极小值；

(3) 在 $( - \infty , c ] .$ 上单调上升，在 $[ c , + \infty )$ 上单调下降. $f(c) = a$ 为极大值；

(4) 在 $( - \infty , 0 ]$ 上单调上升，在 $[ 0 , + \infty )$ 上单调下降. $f(0)=-1$ 为极大值；

(5) 在 $(0, \mathrm{e}^{-2}]$ 上单调下降，在 $\left[ \mathrm{e}^{-2} , +\infty \right)$ 上单调上升. $f(\mathrm{e}^{-2}) = -2\sqrt{\mathrm{e}^{-2}}$ 为极小值.

4. (1）在点a取极小值2a,在点一a取极大值—2a;

(2) 在点 1 取极大值 $\mathrm{e}^{-1}$ ；（3）在点 $\mathrm { e } ^ { 2 }$ 取极大值 $4\mathrm{e}^{-2}$

5. (1) $( - \infty , - 1 ] , [ 3 , + \infty )$ 上单调增加， $\left[ -1,3 \right]$ 上单调减少；

(2) $[ 2 , + \infty )$ 上单调增加， $( 0 , 2 ]$ 上单调减少；

(3) $\left[ \frac{1}{2}, 1 \right]$ 上单调增加， $\left( - \infty , 0 \right) , \left( 0 , \frac { 1 } { 2 } \right] , \left[ 1 , + \infty \right)$ 上单调减少；

(4) $( - \infty , + \infty )$ 上单调增加；

[page:311]

(5) $\left[ \frac{1}{2}, +\infty \right)$ 上单调增加， $( - \infty , \frac { 1 } { 2 } ]$ 上单调减少；

(6) $\left( - \infty , \frac { 2 } { 3 } a \right] , \left[ a , + \infty \right)$ 上单调增加， $\left[ \frac{2}{3}a, a \right]$ 上单调减少；

(7) $\left[ 0 , \bar { n } \right]$ 上单调增加， $[ n , + \infty )$ 上单调减少；

(8) $\left[ \frac{k\pi}{2}, \frac{k\pi}{2} + \frac{\pi}{3} \right]$ 上单调增加， $\left[ \frac{kx}{2} + \frac{\pi}{3}, \frac{k\pi}{2} + \frac{\pi}{2} \right]$ 上单调减少 $, k \in \mathbb { Z } .$

6. 略.

7. $a > \frac { 1 } { \mathrm { e } }$ 时没有实根， $0 < a < \frac{1}{\mathrm{e}}$ 时有两个实根， $,a=\frac{1}{\mathrm{e}}$ 时只有x=e一个实根.

8. （1）凸的；（2) $( - \infty , 0 ]$ 上凸 $[ 0 , + \infty )$ 上凹；（3）凹的；（4）凹的.

9. （1）拐点 $( \frac { 5 } { 3 } , \frac { 2 0 } { 2 7 } )$ ，在 $\left( - \infty , \frac { 5 } { 3 } \right]$ 内凸的，在 $\left[ \frac{5}{3}, +\infty \right)$ 内凹的；

(2)拐点 $( 2 , \frac { 2 } { \mathrm { e } ^ { 2 } } )$ ，在(一∞，2]内凸的，在 $[ 2 , + \infty )$ 内凹的；

(3) 凹的；

(4)拐点(—1，ln2)，(1，ln2)在 $( - \infty , - 1 ] , [ 1 , + \infty )$ 内凸的，在[—1，1]内凹的；

(5)拐点 $\left( \frac{1}{2}, \mathrm{e}^{\arctan \frac{1}{2}} \right)$ ,在 $\left( - \infty , \frac { 1 } { 2 } \right]$ 内凹的，在 $\left[ \frac{1}{2}, +\infty \right)$ 内凸的；

(6)拐点(1，一7)，在(0，1]内凸的，在[1，+∞)内凹的.

(7)-(9) 略.

10-11. 略.

12. $a=-\frac{3}{2},b=\frac{9}{2}$

13. $a=1,b=-3,c=-24,d=16.$

14. $k = \pm \frac { \sqrt { 2 } } { 8 } .$

15. 是拐点.

习题6.5

1.（1）极大值f(-1)=17，极小值 $f(3) = -47$

(2) 极小值 $f(0) = 0$

(3) 极大值 $f(\pm 1) = 1$ ，极小值 $f(0) = 0$ +

(4) 极大值 $f\left(\frac{3}{4}\right)=\frac{5}{4}$

(5) 极大值 $f\left(\frac{12}{5}\right)=\frac{1}{10}\sqrt{205}$

(6) 极大值 $f(0) = 4$ ,极小值 $f(-2)=\frac{8}{3}$

(7) 极大值 $f\left(\frac{\pi}{4} + 2k\pi\right) = \frac{\sqrt{2}}{2}\mathrm{e}^{\frac{\pi}{4} + 2k\pi}$

极小值 $f\left(\frac{\pi}{4}+(2k+1)\pi\right)=-\frac{\sqrt{2}}{2}\mathrm{e}^{\frac{\pi}{4}+(2k+1)\pi}.k\in\mathbf{Z};$

[page:312]

(8) 极大值 $f(\mathrm{e}) = \mathrm{e}^{\frac{1}{\mathrm{e}}}$

(9) 没有极值；

(10)没有极值.

2. 略.

3. $a = 2, f\left(\frac{\pi}{3}\right) = \sqrt{3}$ 为极大值.

4. (1）2; (2) $\frac{3}{2}\sqrt[3]{2};$ (3) $\frac{4}{3}$ √3.

5. (1) $\frac { 1 } { 2 } a ^ { 2 } ;$ (2) $\frac{2}{9}\sqrt{3}a^{3}$ (3) $\frac{3}{16}\sqrt{3}a^{4}$

6.（1）最大值f(4)=80，最小值 $f(-1) = -5$

(2) 最大值f(3)=11，最小值 $f(2)=-14$

(3) 最大值 $f\left(\frac{3}{4}\right) = 1$ .25，最小值 $f(-5)=-5+\sqrt{6}.$

7.当x=1时有最大值-29.

8. 当 $x = -3$ 时有最小值27.

9. 当 $x = 1$ 时有最大值 $\frac{1}{2}$

10. $a = e^{e}$ ,最小值 $1 { = } \frac { 1 } { { \operatorname { e } } } .$

11. $(1,2),(-1,-2)$

12. $\sqrt{3}.$

13. 长为10m，宽为 $5 \mathrm { m } .$

14. $r=\sqrt[3]{\frac{V}{2\pi}},h=2\sqrt[3]{\frac{V}{2\pi}},d:h=1:1.$

15. 底宽为 $\sqrt{\frac{40}{4 + \pi}} = 2.366(m)$

16. 当 $\alpha = \arctan \mu = \arctan 0.$ 25时，力最小.

17. 杆长1.4m.

18. $\varphi = \frac{2\sqrt{6}}{3}\pi.$

19. 能.

20. $1800  元 .$

21. $60  元 .$

22. 距离 M点 $\frac { a h } { a + b ^ { \prime } }$ 处.

23. $20 km/h.$

24. $a\sqrt{2},b\sqrt{2}.$

25. $\frac{1}{n}(a_{1} + a_{2} + \cdots + a_{n}).$

[page:313]

26. $\frac { \pi } { 4 }$

习题6.6

略.

习题6.7

1. 2.

2. (1) $\frac{1}{4}\sqrt{2};$ (2) $2 ;$ (3) $\frac{2}{3a};$ (4) $\frac{1}{a}$

3. $\frac { 1 } { 1 8 } 3 7 ^ { 3 / 2 } .$

4. $\frac{1}{2a^{2}+r^{2}}(a^{2}+r^{2})^{3/2}$

5. $r \sqrt{1 + m^{2}}$

6. $\frac { 2 } { 9 } \sqrt { 3 } .$

7. $\left| \cos x \right| , \left| \sec x \right|$

8. $2 , \frac { 1 } { 2 }$

9. $\left[ \frac{2}{3a\sin 2t_{0}} \right]$

10. $\left( \frac{\sqrt{2}}{2}, -\frac{\ln 2}{2} \right), \frac{3\sqrt{3}}{2}.$

11. 略.

12. $1246 N .$

13. $45400 N .$

14. $\left( \frac{\pi}{2}, 1 \right)$ ,1.

# 第7章

习题7.2

1. (1) $2\pi + \frac{4}{3}, 6\pi - \frac{4}{3}$ ; (2) $\frac{3}{2} - \ln 2$ ;(3) $\mathrm{e}+\frac{1}{\mathrm{e}}-2;$ (4) $b - a ;$ (5) $\frac{40}{81}\sqrt{10}$

(6) $\frac{84}{49}$ ;(7) $\frac{2}{3}$ ; (8) $\frac { 7 } { 6 }$ ； (9) $\frac{\pi}{2}$

2. $\frac { 9 } { 4 } .$

3. $\frac{16}{3}p^{2}$

4. (1) $\pi a^{2}$ ; (2) $\frac{3}{8}\pi a^{2}$ ; (3) $1 8 \pi a ^ { 2 }$

5. $\frac { 3 } { 8 } \pi a ^ { 2 } .$

[page:314]

6. $\frac{ab}{2\sqrt{\pi}}\Gamma^{2}\left(\frac{1}{4}\right)$

7. $\frac { \pi } { 1 2 } a ^ { 2 } ,$

8. $\frac { 1 } { 2 } .$

9. $\frac{a^{2}}{4}\left( \mathrm{e}^{2\pi} - \mathrm{e}^{-2\pi} \right)$

10. (1) $\frac{5}{4} \pi ;$ (2) $\frac{\pi}{6} + \frac{1 - \sqrt{3}}{2}$

11. $\frac{\mathrm{e}}{2}$ t

12. $\frac { 8 } { 3 } a ^ { 2 } ,$

13. $\frac{\pi - 1}{4}a^{2}$

习题7.3

1. $2 \pi a x _ { 0 } ^ { 2 }$

2. $\frac{128}{7}\pi,\frac{64}{5}\pi.$

3. $\frac{32}{105}\pi a^{3}$

4. 略.

5. (1) $\frac{3}{10} \pi ;$ (2) $\frac{\pi^{3}}{4}=2\pi;$ (3) $1 6 0 \pi ^ { 2 }$

6. $2 \pi ^ { 2 } a ^ { 2 } b .$

7. $\frac{1}{6} \pi h \left[ 2(ab + AB) + aB + bA \right].$

8. $\frac { 4 \sqrt { 3 } } { 3 } R ^ { 3 }$

9. $2 \pi^{2}.$

10. $a=-\frac{5}{3},b=2,c=0.$

11. $\frac{512}{7}\pi.$

12. $4 \pi^{2}.$

13. $\frac{32}{5}\sqrt{2}\pi,2\pi.$

14. $\frac{\pi}{2}a^{3}+\frac{\pi}{4}a^{3}\mathrm{sh}2.$

15. $\frac{1}{2}\pi^{2}$

16. $5\pi^{2}a^{3}$

[page:315]

17. $\frac { 5 } { 1 2 } \pi \dot { p } ^ { 3 } .$

18. $2 \pi ^ { 2 } a ^ { 2 } b .$

19. $\pi^{2}-2\pi.$

习题7.4

1. $1+\frac{1}{2}\ln\frac{3}{2}$

2. $2\sqrt{3}-\frac{4}{3}$

3. $\frac{8}{9}\left[\left(\frac{5}{2}\right)^{\frac{3}{2}} - 1\right]$

4. $\frac{y}{2p}\sqrt{p^{2}+y^{2}}+\frac{p}{2}\ln\frac{y+\sqrt{p^{2}+y^{2}}}{p}.$

5. $\frac{a}{2}\pi^{2}$

6. $\left( \left( \frac{2}{3} \pi - \frac{\sqrt{3}}{2} \right) a , \frac{3}{2} a \right)$

7. $\ln \frac{3}{2} + \frac{5}{12}.$

8. $8 a .$

9. $\sqrt{6}+\ln(\sqrt{2}+\sqrt{3})$

10. $b \sqrt{1 + 4a^{2}b^{2}} + \frac{1}{2a}\ln(2ab + \sqrt{1 + 4a^{2}b^{2}}).$

11. $\frac{1}{2} a \theta_0 \sqrt{1+\theta_0^2} + \frac{1}{2} a \ln |\theta_0 + \sqrt{1+\theta_0^2}|$

12. $\sqrt{2}(e - 1)$

13. $\ln 3 - \frac{1}{2}$

14. $a \left[ 1 + \frac{1}{\sqrt{2}} \ln(1 + \sqrt{2}) \right]$

15. $\frac{a}{m}\sqrt{1 + m^{2}}$

16. $\ln \left| \sec a + \tan a \right|$

17. 略.

18. $2 \pi R H .$

19. $4 \pi R^{2}$

20. $\frac{56}{3}a^{2}\pi s$

21. $2\pi a^{2}(2-\sqrt{2})$

22. $2 \pi a \left[ b + \frac{a}{2} \ln \frac{2b}{a} \right] , 2 \pi a \left[ b \ln \frac{b}{a} - a \ln \frac{b}{a} + a \right].$

[page:316]

23. $\pi ( \sqrt{5} - \sqrt{2} ) + \pi \ln \frac{( \sqrt{2} + 1 ) ( \sqrt{5} - 1 )}{2}.$

24. $\frac{12}{5}\pi a^{2}.$

习题7.5

1. $0.\ 18  kJ .$

2. $8 0 0 \pi \ln 2 J .$

3. $9.72 \times 10^{5}  kJ$

4. $\frac{27}{7}kc^{\frac{2}{3}}a^{\frac{7}{3}}$

5. $(\sqrt{2} - 1)  cm .$

6. $5 7 6 9 7 . 5 \mathrm { k J } .$

7. $\frac { 4 } { 3 } \pi r ^ { 4 } \rho g .$

8. 5J.

9. 0.3J.

10. $9.8 \times 1.25 \times 10^{6}$

11. $\frac{kQ}{l}\left(\frac{1}{a}-\frac{1}{a+l}\right);\frac{kQ}{l}\ln\frac{b(a+l)}{a(b+l)}.$

12.205.8kN.

13. $17.3 kN .$

14. $1 4 3 7 3 \mathrm { k N } .$

15. $1.65 N .$

16. $\frac{1}{2} \rho g a b ( 2 h + b \sin \alpha ) .$

17. 取 y轴通过细直棒，

$$F _ { y } = G m _ { H } \left( \frac { 1 } { a } - \frac { 1 } { \sqrt { a ^ { 2 } + l ^ { 2 } } } \right) , \quad F _ { x } = - \frac { G m _ { H } l } { a \sqrt { a ^ { 2 } + l ^ { 2 } } } .$$

18.引力的大小为 $\frac{2Gm\mu}{R}\sin\frac{\varphi}{2}$ ，方向为M指向圆弧的中点.

19. $F_{x}=\frac{3}{5}Ga^{2},F_{y}=\frac{3}{5}Ga^{2}.$

20. 略.

21. $\frac{5}{4}  m _{\bullet}$

22. $7 5  kg ;$

23. $\frac{1}{3}(T^{3}+1-\cos 3T).$

24. $\frac{625}{4}  m .$

25. $\frac{1}{2}k\pi a^{4}$

[page:317]

[General Information]

书名=14469879

SS号=14469879
