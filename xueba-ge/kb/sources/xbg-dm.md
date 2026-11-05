---
course: 离散数学
book: 离散数学及应用(第2版) 刘铎
book_id: xbg-dm
source_type: textbook
ocr: MinerU 4.0 (ocr-mode=auto)
---

[page:1]

# 第1章

## 基础知识

本章主要介绍集合、序列、整除、同余、计数和布尔矩阵等内容，作为后续各章节的知识准备。

## 1.1 集合与序列

## 1.1.1 集合的基本概念

集合论的创始人是德国数学家康托（Georg Cantor，1845—1918)。他对集合论的思考与研究是从对三角级数的研究中产生的。1874年他发表了第一篇关于无穷集合的文章，开创了集合论。

当今，集合的概念和方法被广泛地应用于各种科学和技术领域，是当代科学技术研究中必不可少的数学工具和表述语言。它也是计算机科学与软件工程的理论基础，在程序设计、形式语言、关系数据库、操作系统等计算机学科中都有重要的应用。

集合是数学中最基本的概念，无法给出严格精确的定义。通常，将若干个可确定、可分辨的对象构成的无序整体称为集合(set)，常用大写英文字母A, B, C, X, Y, Z等表示。

定义1.1 组成集合的对象称作该集合的元素（element)，常用小写英文字母 $a ,   b ,   c ,$ $x , y , z$ 等表示。若对象 $a$ 是集合S的元素，则记作 $a   \in   { \cal S } ,$ 读作 $a$ 属于 $S ;$ 若对象a不是集合S的元素，则记作 $a   \not \in   S ,$ ，读作a不属于S。

【例1.1】 $R ;$ “方程 $x^{2}-2=0$ 的所有实数解”， $S \colon   ^ { \leftarrow } 1 2$ 的所有正约数”， $P ;$ “复平面上的所有点”， $\varrho \colon ^ { \mathrm { ~ e ~ } }$ 清华大学的全体学生”都是集合。3是集合S的元素，即 $3   \in   { \mathcal { S } } ;$ 而-3不是该集合的元素，即 $- 3 \not \in S _ { \circ }$ ，而“很大的实数”、“清华大学的全体年轻教师”都不是集合，因为不能明确地判断任意一个对象是否属于该集合。

注:

(a)组成一个集合的条件是能够明确地判断任意一个对象是或者不是该集合的元素，二者必居其一。

（b）集合中的元素没有次序。一个集合中也没有相同的元素。如果一个集合中出现若干个相同的元素，则将它们作为一个元素，即一个集合由它的元素所决定而与描述它时列举其元素的特定顺序无关。

（c）在同一个集合中的诸元素并不一定存在确定的关系。

[page:2]

## 离散数学及应用（第2版）

（d）为了体系的严谨性，我们规定:对于任意集合A都有A∉A。①

【例1.2】本书规定使用一些特定的符号表示一些常用集合:自然数（nature number)集N；整数（integer）集Z，正整数集Z⁺，非零整数集Z*；有理数（rational number）集Q，非零有理数集Q*；实数(real number)集R，非零实数集R*；复数(complex number)集C，非零复数集C*。

符号Z来自德语单词Zahlen，意为整数。有理数是整数相除的商（quotient)，因此用Q表示有理数。

使用形式化方法表示一个集合有两种方式——外延表示法和内涵表示法:

(1）外延表示法（列举法)。逐个列出集合的元素，元素与元素之间用逗号“,”隔开，并将所有元素写在大括号“{}”里，如:A={a, b, c}， $B { = } \{ 0 , 1 , \cdots , 1 0 \}$ $\mathbb{N} = \{0, 1, 2, \cdots\}$ 0

(2）内涵表示法（描述法)。假设P(x)是一个包含x的陈述句，表示x所具有的性质；对于每个确定的x，可以明确断定P(x)正确与否。集合 $\{ x | P ( x ) \}$ 表示所有使P(x)为真的对象x所组成的集合，如: $\mathbb { Z } ^ { + }   =   \{ x | x \}$ 是正整数}， $R = \{ x | x^{2} - 2 = 0$ 且 x是实数}。

定义1.2 设A和B是两个集合，如果A的任意一个元素都是B的元素，则称A为B 的子集（subset)，称 B 为A 的超集（superset)，记作A⊆B（或 $B _ { \supseteq } ^ { - } A ^ { \overline { { } } }$ ，读作A包含于B（或B 包含A）。

注:

(a）⊆表示集合与集合之间关系，而∈表示元素与集合之间关系。

（b）设A、B、C是3个集合，若 $A { \subseteq } B$ 且 $B { \subseteq } C ,$ ，则有 $A \subseteq C \text{。 }$

定义1.3 设A和B是两个集合，如果A⊂B且B⊆A，则称A与B相等，记作A=B；否则称它们不相等，记作A≠B。两个集合相等，当且仅当它们具有相同的元素。

定义1.4 设A和 B 是两个集合，如果 $A { \subseteq } B$ 且 A≠B，则称 A 为 B 的真子集（proper subset）记作A⊂B（或B⊃A）。

注:如果A是B的真子集，则集合A中的每一个元素都属于B，但集合B中至少有一个元素不属于A。

【例1.3】 设集合A={x|x是6的正约数}，B={1,2,3,6}，由于A和 B 具有相同的元素，故它们是同一个集合，即A=B。这说明很多集合可以用两种方法来表示，但也有些集合不可以用列举法表示，例如实数集R。

【例 1.4】 设集合A={1, 2, 3, 4, 5, 6}，B={0, 1,2, 3,4, 5, 6, 7}。由于对于任意 a∈A,均有a∈B，故A⊂B。且由于7∈B而7∉A，故A⊂B。

定义 1.5 在讨论的具体问题中，所讨论对象全体称作全集(universal set)，记作 U。

注:由全集的定义可知，在讨论具体问题时，所提及的集合均是全集的子集。而针对不同的具体问题可能会有不同的全集。

定义1.6 不包含任何元素的集合称作空集（empty set)，记作 $\varnothing _ { \circ }$

定理1.1设A是任意一个集合，∅是空集，则有:（a）A⊆A；（b） $\varnothing \subseteq A$

[page:3]

## 第1章 基础知识

证明.

（a）对于任意集合A，它的任一元素都是其自身的元素，因而 $A { \subseteq } A$

（b）（反证法）若存在集合A使得∅不是A的子集，则由定义1.2，存在元素 $x   \in   \mathcal { D }$而且x∉A；但这与空集的定义相矛盾，因此假设不成立，原结论成立。 □

推论空集是唯一的。

证明.（这里使用一个在后面还会经常使用的证明技巧。）

设 $\varnothing _ { 1 }$ 和 $\varnothing _ { 2 }$ 都是空集，则由定理1.1， $\varnothing _ { 1 } { \subseteq } \varnothing _ { 2 }$ 且 $\varnothing _ { 2 } { \subseteq } { \mathcal { D } } _ { 1 }$ ，由定义1.3有 $\varnothing _ { 1 } { = } \varnothing _ { 2 }$

定义 1.7 一个集合A 所包含的元素数目称为该集合的基数或势（cardinality)，记作|A|或#A 或 card(A)。

定义 1.8 若 $\left| A \right| < \infty$ ，则称A为有限集或有穷集（finite set），否则称A为无限集或无穷集（infinite set）。

【例1.5】 $| \{ a , b , 2 , a , \infty \} | = 4 , \mathrm { c a r d } ( \mathcal { D } ) = 0$ ，它们都是有限集。而N、 $\mathbb { Z }  、  \mathbb { Q }  、  \mathbb { Q } ^ { * }$ R、C都是无限集。

事实上，无穷集又可分为无穷可数集和无穷不可数集，无穷可数集和无穷不可数集也分别称为无穷可列集和无穷不可列集。这部分内容将在5.6节中详述。

定义 1.9 假设A 是集合，A 的所有子集所组成的集合称作A 的幂集（power set)，记作 $\mathcal { A } ( A )$ ，即 $\mathcal{P}(A)=\{x|x\subset A\}$

【例1.6】假设集合 $\scriptstyle { \mathcal { A } } = \{ a ,   b ,   c \}$ ，计算 $\mathcal { A } ( A )$ o

解.A的0元子集:∅。

A 的1 元子集: $\{ a \} ,   \{ b \} ,   \{ c \}$ 0

A 的2元子集: $\{ a , b \} , \{ a , c \} , \{ b , c \}$ 0

A的 3 元子集: $\{ a , b , c \}$ 0

于是 $\tilde { \mathcal { N } } ( A )   =   \{   \mathcal { D } ,   \{ a \} ,   \{ b \} ,   \{ c \} ,   \{ a , b \} ,   \{ a , c \} ,   \{ b , c \} ,   \{ a , b , c \} \}$ 0

【例1.7】 $\mathcal { A } ( \emptyset ) = \{ \emptyset \} .$

## 1.1.2 集合的运算及性质

集合的运算就是由给定的集合按照确定的规则产生另外的集合。集合运算主要有以下5种。

定义1.10 设U为全集，A、B为U的两个子集，则:

（a）A与B的交集（intersection）A∩B定义为 $A \cap B = \{ x | x \in A   且   x \in B \}$ 0

（b）A与B的并集（union）A∪B定义为 $A \cup B = \{ x | x \in A$ 或 $x { \in } B \}$

（c）B 关于A 的相对补（complement of B with respect to A）或A 与B的差集（difference）A-B 定义为 $A - B = \{ x | x \in A$ 且 $x { \not \in } B \}$ ，也记作 $A \backslash B _ { \circ }$

(d)A 关于全集U的相对补称作A 的绝对补或补集（complement)，记作 $\overline{A}  (或  \sim A )$即 $\overline { { A } } = \{ x | x \in U$ 且 $x { \not \in } A \}$ 0

（e）A与B的对称差（symmetric difference）A⊕B 定义为 $A \oplus B = \{ x | x \in A$ 或 $x { \in } B$ 且x不同时属于A和B}。

[page:4]

## 4

注:

(a) 由定义可得 $A - B = A \cap \overline{B} ; A \oplus B = (A - B) \cup (B - A) .$

(b)交运算、并运算也可以扩展到多个集合上，如 $A \cap B \cap C = \{ x | x \in A$ 且 $x { \in } B$ 且 $x { \in } C \}$ $A \cup B \cup C = \{ x | x \in A$ 或 $x { \in } B$ 或 $x { \in } C \}$ 。常用记号为 $\bigcap _ { i = 1 } ^ { n } A _ { i }$ 和 $\bigcup _ { i = 1 } ^ { n } A _ { i }$ 1=1

【例1.8】设全集 $U { = } \{ 0 , 1 , \cdots , 9 \}$ ，集合 $A = \{ 0, 1, 2, 3 \}, B = \{ 1, 3, 5, 7, 9 \}$ ，则 $A \cap B = \{ 1$ 3}, A∪ B={0, 1, 2, 3, 5, 7, 9}, $A - B = \{ 0 , 2 \}$ $B - A = \{ 5, 7, 9 \}$ , A ={4, 5, 6, 7, 8, 9}, $\overline { { B } }   =   \{ 0 , 2$ 4, 6, 8}, A⊕B={0, 2, 5, 7, 9} 。

定理1.2 设A、B是两个集合，则以下各表述彼此等价:

(a) $A { \subseteq } B \circ$

(b) $A \cap B = A$

(c) $A \cup B = B$

(d) $\mathcal{A}(A) \subseteq \mathcal{A}(B)$ 0

证明.只证明（a）与（d）等价，其他由定义易得。

证明集合 $X { \subseteq } Y$ 的基本方法是:对任意 $x { \in } X ,$ ，论证必有 $x   \in   Y _ { \circ }$

若 $A { \subseteq } B ,$ ，则对于任意 $X { \in } { \mathcal { \bar { A } } } ( A )$ ，有 $X { \subseteq } A$ ，故X⊂B，所以 $X { \in } { \mathcal { \bar { A } } } ( B )$ ，即 $\mathcal{A}(A) \subseteq \mathcal{A}(B)$

若 $\mathcal { \bar { A } } ( A ) { \subseteq } \mathcal { \bar { A } } ( B )$ ，则对于任意 $a   \in   A$ ，有 $\{ a \} { \subseteq } A$ ，即 $\{ a \} \in { \mathcal { \bar { H } } } ( A )$ ，于是 $\{ a \}   \in   \mathcal { \bar { A } } ( B )$ ，即 $\{ a \} { \subseteq } B$所以 $a   \in   B ,$ ，得到 $A { \subseteq } B$ o □

英国逻辑学家维恩（JohnVenn，1834—1923）于1881年在《符号逻辑》一书中首先使用相交区域的图解来说明类与类之间的关系。后来人们以他的名字来命名这种用图形来表示集合间关系和集合运算的方法，称作维恩图（Venndiagrams）或文氏图(图1.1)。其构造方法如下:

（1）用一个大的矩形表示全集的所有元素（有时为简单起见，可将全集省略）。

（2）在矩形内画一些圆（或任何其他形状的闭曲线)，用圆内部的点表示相应集合的元素。不同的圆代表不同的集合。用阴影或斜线的区域表示新组成的集合。

[page:5]

## 第1章 基础知识

维恩图的优点是形象直观，易于理解，而缺点是理论基础不够严谨，因此只能用于说明，不能用于证明。

定理1.3（集合运算的代数性质）设U为全集，A、B、C为U的子集，∅为空集，则有

（a）交换律: $A \cup B = B \cup A, \quad A \cap B = B \cap A, \quad A \oplus B = B \oplus A 。$

（b）结合律: $(A \cup B) \cup C = A \cup (B \cup C), (A \cap B) \cap C = A \cap (B \cap C), (A \oplus B) \oplus C = A \oplus (B \oplus C).$

（c）分配律: $A \cup (B \cap C) = (A \cup B) \cap (A \cup C), \quad A \cap (B \cup C) = (A \cap B) \cup (A \cap C).$

（d）吸收律: $A \cup (A \cap B) = A, \quad A \cap (A \cup B) = A$

（e）德·摩根律:

$$\overline{A \cup B} = \overline{A} \cap \overline{B} , \quad \overline{A \cap B} = \overline{A} \cup \overline{B} \text { 。 }$$

(绝对形式)

$A-(B\cup C)=(A-B)\cap(A-C),\ A-(B\cap C)=(A-B)\cup(A-C)$ (相对形式)

(f) 幂等律: $A \cup A = A, \quad A \cap A = A.$

（g）零律: $A \cup U = U, \quad A \cap \varnothing = \varnothing.$

（h）同一律: $A \cup \varnothing = A,\ A \cap U = A 。$

（i）排中律: $A \cup \overline{A} = U \text{。 }$

（j）矛盾律: $A \cap \overline{A} = \varnothing$

（k）余补律: $\overline { { \varnothing } } = U , \quad \overline { { U } } = \varnothing$ 0

（1）双重否定律: $\bar { \bar { A } }   =   A$

下面仅以例题的形式证明其中一部分，其余留给读者完成。

【例1.9】设A、B、C为任意集合，证明

$$A-(B \cap C)=(A-B) \cup (A-C)$$

证明. 证明两个集合X和Y相等的一般方法是分别证明 $X { \subseteq } Y$ 和 $Y { \subseteq } X { \circ }$

（1）证明 $(A - B) \cup (A - C) \subseteq A - (B \cap C)$

假设 $x \in (A - B) \cup (A - C)$ ，由定义有 $x { \in } A { - } B$ 或 $x { \in } { \mathcal { A } } { - } C .$ 0

若 $x { \in } A { - } B$ 则有 $x { \in } A$ 且 $x \not \in B ,$ ，于是 $x { \not \in } B \cap C \mathrm { { } _ { \circ } }$

若 $x { \in } A { - } C$ 则有 $x { \in } A$ 且 $x \not \in C ,$ ，于是 $x { \not \in } B \cap C _ { \circ }$ 3

[page:6]

## 离散数学及应用（第2版）

总之有 $x { \in } A$ 且 $x { \not \in } B \cap C ,$ ，故得 $x { \in } A { - } ( B \cap C )$ ，因此 $(A - B) \cup (A - C) \subseteq A - (B \cap C)$

(2） 证明 $A - ( B \cap C ) \subseteq ( A - B ) \cup ( A - C )$

假设 $x { \in } A { - } ( B \cap C )$ ，由定义有x∈A且 $x { \not \in } B \cap C .$

由 $x { \not \in } B \cap C ,$ ，有x∉B或 $x \not \in C \circ$ 再由 $x { \in } A$ 得 $x { \in } A { - } B$ 或 $x { \in } A { - } C \text { 。 }$

故 $x \in (A - B) \cup (A - C)$ ，进而 $A - ( B \cap C ) \subseteq ( A - B ) \cup ( A - C )$ 0

综合（1）和（2），即得 $A-(B \cap C)=(A-B) \cup (A-C)$

定理1.3中各定律并非相互独立，即，也可以使用部分定律证明其他定律。

【例1.10】设A、B、C为任意集合，则 $A-(B \cap C)=(A-B) \cup (A-C)$

$$A-(B\cap C)=A\cap \overline{(B\cap C)}=A\cap \overline{(B\cup C)}=(A\cap \overline{B})\cup (A\cap \overline{C})=(A-B)\cup (A-C)$$

使用上述定律还可以证明其他集合运算恒等式。

【例1.11】假设 $A { \subseteq } B ,$ ，则 $(B - A) \cup A = B$

证明. $(B - A) \cup A = (B \cap \overline{A}) \cup A = (B \cup A) \cap (\overline{A} \cup A) = B \cap U = B 。$

## 1.1.3 序列

定义1.11序列（sequence）是被排成一列的对象，每个对象不是在其他对象之前，就是在其他对象之后，各对象之间的顺序非常重要。序列中的对象也称为项（item)，项的个数（可能是无限的）称为序列的长度（length）。取出序列中的某些特定的项并保持它们在原来序列中的顺序，所得到的新序列称为原序列的子序列（subsequence）。

【例1.12】 以下诸例都是序列:

(a)1, 2, 3, 4, 5, 1, 2, 3

(b)2, 3, 5, 7, 11, 13,

(c)1, 4, 9, 16, 25, 36,

(d) apple, egg, egg, apple, egg, egg, …

$\{ a \} , b ,   \{ \{ b \} \}$

(f) $\mathrm { d } , \mathrm { i } , \mathrm { s } , \mathrm { c } , \mathrm { r } , \mathrm { e } , \mathrm { t } , \mathrm { e }$

序列可能是有限的（如例1.12中的（a）、（e）、（f))，也可以是无限的（如例1.12中的（b）、（c）、（d)）。有限序列包含空序列（empty sequence），它没有任何项。

定义1.12 对于给定的集合A,定义 $\boldsymbol { A } ^ { * }$ 为所有由A中元素生成的有限长度序列全体，A*中的元素称为A上的词（word）或串（string）。在不引起混淆时，也可忽略序列各项间的逗号。 $A ^ { * }$ 中的空序列称作空串（empty string），记作λ或 $\varepsilon _ { \odot }$ 此时A也称作字母表(alphabet)。

【例1.13】假设 $A = \{ a,   b,   \cdots,   z \}$ 为英文字母集合，则 $A ^ { * }$ 包含所有有限长度的英文“单词”——无论其是否具有意义，如 bat、cat、djoutrqoanlglkjr、asdfg。

定义 1.13 假设 A 是集合， $w_{1}=s_{1}s_{2}\cdots s_{n}$ 和 $w_{2}=t_{1}t_{2}\cdots t_{m}$ 都是 $A ^ { * }$ 中的元素，可定义 $w _ { 1 }$和 $w _ { 2 }$ 的连接（catenation）为 $s _ { 1 } s _ { 2 } { \cdots } s _ { n } t _ { 1 } t _ { 2 } { \cdots } t _ { m }$ ，记作 ${ \mathcal { W } } _ { 1 } { \circ } { \mathcal { W } } _ { 2 } { \textlangle }$ 0

注:假设A是集合， $w \in \boldsymbol { \mathcal { A } } ^ { * }$ ，则 $w \circ \lambda = \lambda \circ w = w.$ 0

【例1.14】假设 $A = \{ a, b, \cdots, z \}$ ， post, office∈ A*， 则 postooffice=postoffice。

[page:7]

## 第1章 基础知识

## 1.2 数论基础

本节主要讨论整数之间的性质，而带余除法是本节所讨论内容的基础。

定理1.4 （带余除法）设 n和 m都是整数且 n≠0，则可以唯一地将 m写为 $m = q \cdot n + r$其中 q 和 r 是整数，且 $0 \leqslant r < |n| \text { 。 } q$ 称作商（quotient），r称作余数（remainder），记作r=m mod n。

【例1.15】 -29=(-6)·5+1，143=11·13+0，915=11·78+57。

定义 1.14 在定理 1.4 的表达式中，若余数 r=0，则称 m 能被 n 整除（m is dividable by n)，或 n整除 m（n divides m)，记作 $n | m$ 。此时，称 m是n的一个倍数（multiple)称 n是 m 的一个约数或因子（divisor)。

注:n整除 m当且仅当存在整数 q 使得 $m { = } q { \cdot } n$

【例 1.16】 3|12，3|(−15)；12 的所有因子是{±1, ±2, ±3, ±4, ±6, ±12}。

定理1.5 假设 a、b、c是整数， $a { \neq } 0$ ，则

（a）若 $a | b$ 且 $a | c$ ，则对于任意的整数 $x  、 y$ ，有 $a | ( x b + y c )$ o

(b)若 $b { \neq } 0$ ， $a | b$ 且 $b | c$ ，则 $a | c _ { 1 }$

(c)若 $b \ne 0, a \mid b$ 且 $b | a$ ，则 $a = \pm b$ 0

证明.

(a）若 $a | b$ 且 $a | c$ ，则存在整数 $k _ { 1 }$ 及 $k _ { 2 }$ 使得 $b { = } k _ { 1 } a$ 及 $c { = } k _ { 2 } a$ ，于是 $x b+y c=x k_{1} a+y k_{2} a=$ $( x k _ { 1 } + y k _ { 2 } ) a$ ，即 $a \vert ( x b + y c )$

(b）若 $a | b$ 且 $b | c ,$ 则存在整数 $k _ { 1 }$ 及 $k _ { 2 }$ 使得 $b { = } k _ { 1 } a$ 及 $c { = } k _ { 2 } b$ ，于是 $c { = } k _ { 1 } k _ { 2 } a$ ，即 $a | c ,$ 8

(c）若 $a | b$ 且 $b | a$ ，则存在整数 $k _ { 1 }$ 及 $k _ { 2 }$ 使得 $b { = } k _ { 1 } a$ 及 $a { = } k _ { 2 } b$ ，于是 $\scriptstyle { a = k _ { 1 } k _ { 2 } a }$ 且 $a { \neq } 0$ $k_{1}k_{2} =  \pm 1$ ，即 $a = \pm b$ 0 □

定理1.6 对于任意正整数 a，有 $a | a$ 及1|a。

证明.由 $a{=}1{\cdot}a{=}a{\cdot}1$ 即得。

定义 1.15 若大于 1 的整数 p 的所有正因子只有 p 和 1，则称其为质数或素数(prime)；否则称其为合数（composite number）。

【例 1.17】 2,3, 5, 7, 11, 13, 17, 19 都是素数，而 4, 6, 8, 9, 10, 12, 14, 15, 16, 18 都是合数。

定理1.7 有无穷多个素数。

证明.（反证法）假设只有有穷多个素数，设为 $p _ { 1 } { , } p _ { 2 } { , } \cdots { , } p _ { n } { \mathrm { { \circ } } }$ 令 $m = p_{1}p_{2}\cdots p_{n} + 1$ ，显然有 $p_{i} \nmid m, 1 \leqslant i \leqslant n$ 。因此要么m本身是素数，要么存在大于 $p _ { n }$ 的素数整除m，与假设产生矛盾。 □

定理 1.8（算术基本定理，arithmetic fundamental theorem）设正整数 $n { \geq } 1$ ，则n可唯一地表示为 $p _ { 1 } ^ { k _ { 1 } } p _ { 2 } ^ { k _ { 2 } } \cdots p _ { s } ^ { k _ { s } }$ ，其中 $p_{1} < p_{2} < \cdots < p_{s}$ 是s个相异的素数，指数 $k _ { i }$ 都是正整数。该定理又称作唯一析因定理（unique factorization theorem)。该表达式称作整数 n的素因子分解。

推论 设正整数a的素因子分解是 $a = p_{1}^{k_{1}}p_{2}^{k_{2}}\cdots p_{s}^{k_{s}}$ ，则正整数d为 a的因子的充分

[page:8]

## 离散数学及应用（第2版）

必要条件是 $d = p_{1}^{r_{1}}p_{2}^{r_{2}}\cdots p_{s}^{r_{s}}$ ，其中 $0 \leqslant r_{i} \leqslant k_{i}, i = 1,2,\cdots,s$ 0

【例1.18】 $150=2\times3\times5^{2},\quad168=2^{3}\times3\times7$

定义 1.16 设 a 和 b 是两个不全为 0 的整数，若整数 d 满足 d|a 且 $d | b$ ，则称d是a、b 的公因子（common divisor），所有公因子中最大的正整数称作 a与 b 的最大公因子(greatest common divisor)，记作 $\operatorname { G C D } ( a ,   b )$

定义 1.17 设 a 和 b 是两个不全为 0 的整数，若整数 m 满足 a|m 且 $b | m$ ，则称m是a, b 的公倍数（common multiple)，所有公倍数中最小的非负整数称作 a 与 b 的最小公倍数（least common multiple），记作 $\operatorname { L C M } ( a ,   b )$

定义 1.18 若整数 a 和 b 的最大公因子为 1，则称 a 与 b 互素（relatively prime)。

注:对任意的正整数a有 $\mathrm{GCD}(0,a)=a,\mathrm{GCD}(1,a)=1,\mathrm{LCM}(1,a)=a.$

【例1.19】 GCD(12,15)=3，LCM(12,15)=60。8和15互素，而12和 15不互素，6、11、35两两互素。

定理1.9 设正整数 $a = p_{1}^{r_{1}}p_{2}^{r_{2}}\cdots p_{k}^{r_{k}} , \ b = p_{1}^{s_{1}}p_{2}^{s_{2}}\cdots p_{k}^{s_{k}}$ ，其中 $p _ { 1 } , p _ { 2 } , \cdots , p _ { k }$ 是互异素数，$r _ { 1 } , r _ { 2 } , \cdots , r _ { k } , s _ { 1 } , s _ { 2 } , \cdots , s _ { k }$ 是非负整数，则

$$\mathrm{GCD}(a, b) = p_{1}^{\min(r_{1},r_{1})}p_{2}^{\min(r_{2},r_{2})}\cdots p_{k}^{\min(r_{k},r_{k})}, \quad \mathrm{LCM}(a, b) = p_{1}^{\max(r_{1},r_{1})}p_{2}^{\max(r_{2},r_{2})}\cdots p_{k}^{\max(r_{k},r_{k})}$$

推论 设a、b 是正整数，则 $\mathrm{GCD}(a,b)\cdot \mathrm{LCM}(a,b)=a\cdot b$

【例1.20】 $150=2^{1} \times 3^{1} \times 5^{2} \times 7^{0}, \quad 168=2^{3} \times 3^{1} \times 5^{0} \times 7^{1}$ ，则

$$\mathrm{GCD}(150,168)=2^{1} \times 3^{1} \times 5^{0} \times 7^{0}=6,\quad \mathrm{LCM}(150,168)=2^{3} \times 3^{1} \times 5^{2} \times 7^{1}=4200$$

当不知道整数 a和 b 的因子分解时，也可以计算 a和 b的最大公因子。欧几里得（Euclid，约公元前325年—公元前265年）在《几何原本》中提出了计算最大公因子的算法，这被公认是最早的算法，也是人类历史上最美丽的算法之一。在表述该算法之前，先给出下述定理，以奠定该算法的理论基础。

定理 1.10 设 $a = q b + r$ ，其中 a、b、q、r都是整数，则

$$\mathrm{GCD}(a,   b) = \mathrm{GCD}(b,   r)$$

证明.若 $d | a$ 且 $d | b$ ，则由定理1.5，有 $d | b$ 且 $d | r _ { \circ }$

若 $d | b$ 且 $d | r ,$ ，则由定理1.5，有 $d | ( q b + r )$ ，即 $d | a$ o

于是，a与b的公因子集合和b与r的公因子集合相同。继而，最大公因子相同。□下面给出计算最大公因子的欧几里得算法。

欧几里得算法（辗转相除法）GCD(a, b)

输入:整数a、b（满足 $a \geqslant b \geqslant 0$ ，且a、b不全为0)。

输出:GCD(a, b)。

1 If b=0 then return a
2 Else return GCD(b, a mod b)

【例1.21】使用欧几里得算法求168与150的最大公因子。

$$\begin{array}{ccc}a & b \\168 & 150 \\\end{array}\quad \begin{array}{ccc}&  & 168 = 1 \times 150 + 18 \\\end{array}$$

[page:9]

## 第1章 基础知识

$$\begin{array}{ccc}150 & 18 & 150{=}8 \times 18{+}6 \\18 & 6 & 18{=}3 \times 6{+}0 \\6 & 0 & \\\end{array}$$

得 GCD(168, 150)=6。

由此例，有 $6=150-8\times18=150-8\times(168-1\times150)=9\times150+(-8)\times168$ ,即 GCD(168, 150)可表示成168与150的线性组合。更一般地讲，有以下定理。

定理 1.11 对于不全为 0 的整数 a、b 和 d，方程 sa+tb=d 存在整数解 s 和 t 当且仅当 $\mathrm { G C D } ( a ,   b ) | d \mathrm {  。  }$ 方程 $s a + t b = d$ 称作裴蜀（Bezout）等式或贝祖等式。

证明.（充分性）由定理1.10和例1.21知，通过回代法，可知 $sa + tb =  GCD (a, b)$ 存在整数解，设其为 $s_{0} 、 t_{0} 。$

若 $d { = } k { \cdot } \mathrm { G C D } ( a ,   b )$ ，则 $\boldsymbol { k } { \cdot } \boldsymbol { s } _ { 0 } , \boldsymbol { k } { \cdot } \boldsymbol { t } _ { 0 }$ 是方程的一个解。

（必要性）若方程 $s a + t b = d$ 存在整数解s 和 t，则由定理1.5 知 $\mathrm{GCD}(a,   b)|(sa + tb) = d.$

推论1 整数 a 和 b 互素当且仅当存在整数 x 和 y 使得 $x a + y b = 1$

推论2 假设大于 1 的整数 a 与 b 互素，则存在整数 $s_{0}>0,\ t_{0}<0,\ s_{1}<0,\ t_{1}>0$ 使得$s_{0}a + t_{0}b = 1$ 及 $s_{1}a + t_{1}b = 1$ 0

最大公因子和最小公倍数还具有如下性质。

定理1.12 假设a、b、c都是正整数，则

(a) $\mathrm{GCD}(a,\mathrm{GCD}(b,c)) = \mathrm{GCD}(\mathrm{GCD}(a,b),c)$

(b)] $\mathrm{LCM}(a,\mathrm{LCM}(b,c))=\mathrm{LCM}(\mathrm{LCM}(a,b),c)$ 0

(c) GCD(a, LCM(b, c))=LCM(GCD(a, b), GCD(a, c))。

(d) $\mathrm{LCM}(a,\mathrm{GCD}(b,c))=\mathrm{GCD}(\mathrm{LCM}(a,b),\mathrm{LCM}(a,c))$

【例1.22】

(a) GCD(15, GCD(6, 10))=GCD(15, 2)=1, GCD(GCD(15, 6), 10)=GCD(3, 10)=1.

(b) LCM(15, LCM(6, 10))=LCM(15, 30)=30,

LCM(LCM(15, 6), 10)=LCM(30, 10)=30。

(c) GCD(15, LCM(6, 10))=GCD(15, 30)=15,

LCM(GCD(15, 6), GCD(15, 30))=LCM(3, 15)=15。

(d) LCM(15, GCD(6, 10))=LCM(15, 2)=30,

$$\mathrm{GCD}(\mathrm{LCM}(15,6),\mathrm{LCM}(15,10))=\mathrm{GCD}(30,30)=30$$

定义 1.19 设 n 是正整数，a 和 b 是整数，如果 n|(a-b)，则称 a 模 n 同余于 b，或 a与 b模 n同余（congruent)，记作 $a \equiv b(\bmod n)$ ，n称为模（modulus）。

【例1.23】 $70 \equiv 5 \pmod{13}, -19 \equiv 6 \pmod{25}$ 0

定理1.13 以下命题等价:

(a) a与 b模 n 同余。

(b) $a \bmod n = b \bmod n$ 0

(c) $a = b + k n$ ，其中k是整数。

[page:10]

## 0

注: $b | a$ 当且仅当 a mod b =0。

定理1.14 若 $a \equiv b(\bmod n)$ $c \equiv d(\bmod n)$ ，则 $a \pm c \equiv b \pm d (\bmod n)$ , $ac \equiv bd(\bmod n)$ o

## 1.3 计数基础

## 1.3.1 加法法则与乘法法则

加法法则:设事件A有m种产生方式，事件B有n种产生方式，则当A与B产生的方式不重叠时，“事件A或B之一”有m+n种产生方式。

注:

（a）加法法则又称加法原理（additionprinciple)，适用于分类选取问题，但要注意适用条件——事件A与B产生的方式不重叠。

（b）加法法则可以进一步推广:事件 $A _ { 1 }$ 有 $p _ { 1 }$ 种产生方式，事件 $A _ { 2 }$ 有 $p _ { 2 }$ 种产生方式……事件 $A _ { k }$ 有 $p _ { k }$ 种产生方式，则当其中任何两个事件产生的方式都不重叠时，“事件$A _ { 1 }$ 或 $A _ { 2 }$ 或…或 ${A_{k}}^{\prime \prime}$ 有 $p _ { 1 } + p _ { 2 } + \cdots + p _ { k }$ 种产生方式。

【例1.24】 某班选修古代汉语的有18 人，不选的有10人，则该班共有18+10= 28人。

【例1.25】北京每天直达上海的客车有5次，客机有3班，则每天由北京直达上海的旅行方式有5+3=8种。

乘法法则:设事件A有m种产生方式，事件B有n种产生方式，则当A与 B产生的方式彼此独立时，“事件A与 $B ^ { \prime \prime }$ 有 m·n 种产生方式。

注:

（a）乘法法则又称乘法原理（multiplication principle)，适用于分步选取问题，但要注意适用条件——事件A与B产生的方式彼此独立，即无论事件A采用何种方式产生，都不影响事件 $B   \mathrm { { _ \circ } }$

（b）乘法法则可以进一步推广:事件 $A _ { 1 }$ 有 $p _ { 1 }$ 种产生方式，事件 $A _ { 2 }$ 有 $p _ { 2 }$ 种产生方式……事件 $A _ { k }$ 有 $p _ { k }$ 种产生方式，则当其中任何两个事件产生的方式都彼此独立时，“事件 $A _ { 1 }$ 与 $A _ { 2 }$ 与 $\cdots$ 与 ${A_{k}}^{\prime \prime}$ 有 $p _ { 1 } { \cdot } p _ { 2 } { \cdot } { \cdots } { \cdot } p _ { k }$ 种产生的方式。

【例 1.26】 某种字符串由两个字符组成，第一个字符可选自{a, b, c, d, e}，第二个字符可选自{1,2,3,4}，则这种字符串共有5×4=20个。

【例1.27】 求1400的不同的正因子个数。

解. $1400=2^{3}5^{2}7^{1}$ 的正因子为 $2 ^ { i } 5 ^ { j } 7 ^ { k }$ ，其中 $0 \leqslant i \leqslant 3,   0 \leqslant j \leqslant 2,   0 \leqslant k \leqslant 1$ 。于是，1400的不同的因子数是 $N=(3+1)(2+1)(1+1)=24$ o

定理1.15 设A 是集合，如果 $| A | { = } n$ ，则 $| \mathcal { \bar { A } } ( A ) | = 2 ^ { n }$ 0

证明. 假设 $A = \{ a_{1}, a_{2}, \cdots, a_{n} \}$ ，考虑A的任一个子集B，则对于每一个元素 $a _ { i }$ 都有$a _ { i } { \in } B$ 和 $a _ { i } \not \in B$ 两种可能，由乘法原理，B的可能数目一共为 $2 ^ { n }$ □

在实际问题中，分类（加法原则）与分步（乘法原则）一般都结合使用，有两种模式:先分类，每类内部分步；或先分步，每步又分类。

[page:11]

## 第1章 基础知识

【例1.28】A、B、C是3个城市，从A到B有4条道路，从B到C有2条道路，从A直接到C有3条道路，则从A到C共有4×2+3=11种不同的方式（先分类，类内再分步)。

【例1.29】某种样式的套装上装有T恤和衬衫两种，下装为长裤。T恤可选红色、蓝色和橙色，衬衫可选白色、黄色和粉色，长裤可选黑色、棕色，则共有(3+3)×2=12种着装方案（先分步，每步再分类）。

【例1.30】 求100!的末尾有多少个0。

解. 100!=100×99×98×…×2×1，将该乘积的每个因子分解，若分解式中共有i个5、j个2，那么 min{i,j}就是0的个数。

1,2，…,100中2和5的倍数的个数如下:

50个2的倍数，j>50;

20个5的倍数，其中有4个25的倍数（多加4个5)，因此i=20+4=24，min{i,j}=24。

事实上，100!=933262154439441526816992388562667004907159682643816214685929 6389521759999322991560894146397615651828625369792082722375825118521091686400 0000000000000000000000。

【例1.31】苗苗有n块大白兔奶糖，从生日那天开始，她每天至少吃一块，直到吃完为止。一共有多少种安排方案？

解. 方案数目为2ⁿ-1

以n=5的情况来说明计算方法:将5块糖按图1.2（a）所示方式放入9个格子内，空白的4个格子可以填入“”或保留空白（共两种可能），则每种填法都对应一种吃糖的安排方案，例如图1.2(b)表示第一天吃两块、第二天吃两块、第三天吃一块；图1.2(c)表示第一天吃一块、第二天吃四块。

## 1.3.2 排列与组合

考虑这样一个问题:设集合S包含n个元素，从S中选取r个元素有多少种取法？

根据取出的元素是否允许重复、取出的过程是否有序可以将该问题分为4个子类型:

[page:12]

## 12

$$\begin{aligned}& 不重复选取  & & 重复选取  \\& 有序选取  & & 排列  & & 可重排列  \\& 无序选取  & & 组合  & & 可重组合 \end{aligned}$$

本节将逐一对其进行介绍，首先考虑排列的问题。

定义1.20 从n个不同的对象中取r个可重复的对象，按次序排列，称为 n取r的可重排列。

此也即当|4|=n时，A*中长为r的串的个数。

定理 1.16 n 取 r 的可重排列数目为 $n ^ { r } ,$

证明.如图1.3所示，由于可重复，因此每个位置都有n种选择，由乘法原理即得结论。 口

定义1.21 从n个不同的对象中取r个不重复的对象，按次序排列，称为n取r的排列(permutation of n objects taken r at a time)。n取 r排列的全体构成的集合用 $P ( n , r )$表示，排列的个数用P(n, r)表示；当r=n时称为全排列或置换（permutation)。

此也即当|A|=n时，A*中长为r且各项彼此不同的串的个数。

## 【例1.32】 设集合 $A { = } \{ a , b , c , d \}$ ，则

（a）A上的所有4取3的排列是

abc bac acb bca cab cba
abd bad adb bda dab dba
bcd bdc cbd cdb dbc dcb
acd adc cad cda dac dca

## （b）A上的所有全排列是

abcd abdc acbd acdb adbc adcb
bacd badc bcad bcda bdac bdca
cabd cadb cbad cbda cdab cdba
dabc dacb dbac dbca dcab dcba

定理1.17

$$P(n,r)=\begin{cases}n(n-1)\cdots(n-r+1),&n\geq r\\0,&n<r\end{cases}$$

证明. 如图1.4所示，从n个中取r个的排列的典型例子是:从n个不同的球中取出r个，放入r个不同的盒子里，每盒1个。第1个盒子有n种选择，第2个有n-1种选择……第r个有 $n – r { + } 1$ 种选择。故有 $P(n,r)=n(n-1)\cdots(n-r+1)$ 。当 $r { \geq } n$ 时，该表达式中有一项为0，其积为0。

注:当r=n时，全排列的个数为 $n(n - 1) \cdots (n - n + 1) = n(n - 1) \cdots \times 2 \times 1$ ，此时记之为n!，称之为n的阶乘（factorial）。使用阶乘符号，可以将 $P ( n ,   r )$ 在形式上简化为

[page:13]

## 第1章 基础知识

n种选择 (n-1)种选择 n-(r-1)=n-r+1种选择

$$\begin{aligned}P(n, r) = &   n(n - 1)(n - 2)\cdots(n - r + 1) \\= &   \frac{n(n - 1)(n - 2)\cdots(n - r + 1)(n - r)(n - r - 1)\cdots\times2\times1}{(n - r)(n - r - 1)\cdots\times2\times1} \\= &   \frac{n!}{(n - r)!}\end{aligned}$$

【例1.33】一个社团共有10名成员，从中选出一名主席、一名副主席、一名书记，则共有P(10,3)=720种方法。

【例1.34】（a）4个男孩和4个女孩站成一排，有多少种方法？

（b）若要求没有女孩相邻，也没有男孩相邻，有多少种方法？

解.（a）P(8,8)=8!=40320。

（b）分为如图1.5所示的两种情况，因此方法数为 $2 \times 4! \times 4! = 1152$

【例1.35】 排列26个字母，使得a与b之间恰有7个字母，有多少种排列方式？ ▲例1.5】201于母，仅守u→υ之旧/1于，多少刀:

解.固定a和b，中间选7个字母，有2×P(24,7)种方法，将这9个字母视作一个整体，与其余17个字母进行全排列有18!种方式。故满足题意的排列方式有 $2 \times P(24, 7) \times$ 18!种。

【例1.36】由 $a , b , b , c , c , c$ 可以组成多少个长度为6的字符串？

解. 对 b 加下标为 $b _ { 1 } , b _ { 2 }$ ，对c加下标为 $c _ { 1 } , c _ { 2 } , c _ { 3 }$ ，则一共可以得到6!=720个长度为6 的字符串。另一方面，每一个由 a, b, b, c, c, c 组成的长度为 6 的字符串都可以通过加下标方式得到 2!×3!=12个有下标字符串。因此由 $a , b , b , c , c , c$ 组成的字符串共有720/12=60个。

采用类似的方法，可以得到如下定理。

定理1.18由 $k _ { 1 }$ 个1， $k _ { 2 }$ 个 $2 { \cdots } { \cdots } k _ { t }$ 个 t 组成的长度为 n 的排列种数为

$$\frac { n ! } { \lfloor k _ { 1 } ! k _ { 2 } ! { \cdots } k _ { t } ! }$$

其中 $n = k_{1} + k_{2} + \cdots + k_{t}$ 0

下面讨论组合的计数。

[page:14]

## 14

定义1.22 从n个不同元素中取r个不重复的元素组成一个子集，而不考虑其元素的顺序，称为n取r的组合（r-combination），该子集称作r-子集（r-subset）。n取r组合的全体构成的集合用C(n,r)表示，其元素个数用C(n,r)表示，有时也记作 $\binom { n } { r }$ C

【例1.37】 设集合 $A { = } \{ a , b , c , d \}$ ，则A上的所有4取3的组合是: $\{ a , b , c \}   , \quad \{ a , b ,$ $d \} , \{ a , c , d \} , \{ b , c , d \}$ 。每个3-子集中元素的所有全排列对应例1.32（a）结果中的一行。定理1.19

$$C(n,r)=\left\{\begin{aligned}&\frac{P(n,r)}{r!}=\frac{n!}{(n-r)!r!},&n\geq r\\&0,&n<r\end{aligned}\right.$$

证明. 从 n个不同元素中取r 个不重复的元素可组成 C(n， r)个子集，各个子集的所有全排列全体就是所有从n个中取r个的排列。因而 $\mathrm{C}(n, r) \bullet r! = \mathrm{P}(n, r)$ ，由此即得结论。

也可以这样理解:从n个不同的球中取出r个，放入r个相同的盒子里，每盒1个。若放入盒子后再将盒子标号区别，则又回到排列模型。每一个组合可有r!个标号方案。故有 $\mathrm{C}(n, r) \bullet r! = \mathrm{P}(n, r)$ C

注:由定理1.19易得，当 $n   \mathcal { P } r$ 时， $\mathrm{C}(n, r) = \mathrm{C}(n, n - r)$ 0

【例1.38】一个社团共有10名成员，从中选出3人组成指导委员会，则共有C(10,3)=120种方法。（注意和例1.33进行比较）

【例1.39】有5本不同的日文书，7本不同的英文书，10本不同的中文书。

（a）取2本不同语言的书，共有多少种取法？

（b）取2本相同语言的书，共有多少种取法？

（c）任取两本书，共有多少种取法？

解. $5 \times 7 + 5 \times 10 + 7 \times 10 = 155$

(b) $C(5,2)+C(7,2)+C(10,2)=10+21+45=76.$

（c）是（a）、(b)两种情况之和:155+76=231；或者从整体上计算:C(22,2)=231。

【例1.40】（简单格路问题）从(0,0)点出发沿x轴或y轴的正方向每步走一个单位，最终走到(m,n)点（如图1.7所示)，有多少条路径？

解.无论怎样走法，在x方向上总共走m步，在y方向上总共走n步。若用一个字母X表示x方向上的一步，一个字母Y表示y方向上的一步，则从(0,0)到(m, n)的每一条路径对应一个由 m个 X与 n 个 Y组成的字符串。这样的字符串共有 $\mathrm{C}(m+n,\ m)$ 个，即相当于在m+n 个位置中选 m 个放 X。

【例1.41】从1~100中选取3个数，使得其和能被3整除，有多少种方法？解.将1~100按照模3的余数分为3类:

$$A = \{ i | i \equiv 1 (\bmod 3) \} = \{ 1,4,\cdots,100 \}$$

[page:15]

## 第1章 基础知识

$$B = \{ i | i \equiv 2 (\bmod 3) \} = \{ 2, 5, \cdots, 98 \}$$

$$C = \{ i | i \equiv 3 (\bmod 3) \} = \{ 3,6,\cdots,99 \}$$

要满足条件，有4种取法:（a）3个数同属于A；（b）3个数同属于B；（c）3个数同属于C；（d）A、B、C中各取一数。

分类选取:

三个数全部取自A，有C(34,3)种方法。

三个数全部取自B，有C(33,3)种方法。

三个数全部取自C，有C(33,3)种方法。

分步处理:

三个数在A、B、C中各取1个，有34×33×33种方法。

故共有 C(34,3)+ C(33,3) + C(33,3) +34×33×33=53 922 种方法。

【例 1.42】 由 a, b, b, c, c, c 可以组成多少个长度为 6 的字符串？

解. 序列共有6 个位置。先放 c，有 C(6,3)种方法；再放 b，有 C(3,2)种方法；最后放 a，有 $\mathbf { C } _ { 1 } ^ { 1 }$ 种方法。因此由 $a , b , b , c , c , c$ 组成的字符串共有 C(6,3)C(3,2)C(1,1)=60。

采用这种方法同样可以得到定理1.18的结论。

【例1.43】 某车站有6个入口处，每个入口处每次只能进一人，一组12个人进站的方案有多少?

解.考虑一个进站方案:5人从入口一进入，无人从入口二进入，2人从入口三进入，1人从入口四进入，1人从入口五进入，3人从入口六进入。

这个方案可以表示成 $0 0 0 0 0 1 1 0 0 1 0 1 0 1 0 0 0$ ，其中表示人，是彼此不同的，表示相邻两个入口之间的分隔，注意n个门只用n-1个分隔。

于是任意一个进站方案都表示成上面17个元素的一个排列。

在17个元素的排列中先确定的位置，有C(17,5)种选择；再确定人的位置，有12!种选择。故C(17,5)×9!即为所求。

【例1.44】某保密装置须同时使用若干把不同的钥匙才能打开。现有7人，每人手中有若干钥匙。须至少4人同时到场，他们手中的钥匙才能打开保密装置的锁。回答以下问题:

（a）至少有多少把不同的钥匙？

（b）每人至少持几把钥匙？

解.（a）每3人至少缺1把钥匙，且每3人所缺钥匙不同（否则这两组人在一起也打不开锁)。故至少共有C(7,3)=35把不同的钥匙。

（b）任一人对于其他6人中的每3人，都至少有1把钥匙与之相配才能开锁。故每人至少持C(6,3)=20把不同的钥匙。

为加深理解，下面举一个较简单的例子:现有4人，其中至少3人到场方能开锁，所求如上。共有C(4,2)=6把不同的钥匙，每人有C(3,2)=3把钥匙，分配方法如图1.8所示。

[page:16]

## 16

【例1.45】把2n个人分成n组，每组2人，有多少种不同的分法？

解.相当于2n个不同的球放到n个相同的盒子中，每个盒子2个，放法为

$$N = \frac{1}{n!}C(2n,2)C(2n - 2,2) \cdots C(2,2) = \frac{1}{n!} \cdot \frac{(2n)!}{(2n - 2)! \cdot 2} \cdot \frac{(2n - 2)!}{(2n - 4)! \cdot 2} \cdots \frac{(2n)!}{(2n - 2)!}$$

【例1.46】有4种口味的棒糖，可从中选取3个（允许选相同口味的），那么一共有多少种不同的选择方法？

解. 假设选择 $x _ { 1 }$ 个口味1的棒糖， $x _ { 2 }$ 个口味2的棒糖， $x _ { 3 }$ 个口味3的棒糖， $x _ { 4 }$ 个口味4的棒糖。则问题转化为求方程 $x_{1} + x_{2} + x_{3} + x_{4} = 3$ 的非负整数解的个数。

例如， $x_{1} = 2, x_{2} = 0, x_{3} = 1, x_{4} = 0$ 这个解可以看作往4个抽屉里面按图1.9所示方法放球。

于是方程 $x_{1} + x_{2} + x_{3} + x_{4} = 3$ 的每个非负整数解都对应一个放球的方案，相当于在6个位置放 3个1，总方案数是C(6,3)。

采用类似方法，可得如下定理。

定理1.20 假设从n个相异对象中选取k个对象，且允许重复选取，则不同的选取方法数目为 $\mathrm{C}(n + k - 1,k)$

注:此问题即相当于“k个相同的球放到n个不同的盒子里，每个盒子球数不限，求放球方法数”，也称作n取k的可重组合。

【例1.47】 （a）由{1,2,3,4,5,6,7,8}中的数字可以组成多少个长度为5的严格增序列？

(b）由{1,2,3,4,5,6,7,8}中的数字可以组成多少个长度为5的非降序列？

解. （a）任何一个{1,2,3,4,5,6,7,8}的5-子集都对应一个长度为5的严格增序列，因此满足题意的序列总数为 C(8,5)=56。

(b）任何一个{1,2,3,4,5,6,7,8}的长度为 5 的非降序列都对应一个可重复的 5-组合，因此满足题意的序列总数为C(8+5-1,5)=792。

## 1.3.3 鸽巢原理

鸽巢原理（pigeonhole principle）是组合数学中最简单也是最基本的原理，也称作狄利克雷抽屉原理(Dirichlet's drawer principle)。因为狄利克雷（Dirichlet，1805—1859)首先明确提出抽屉原理并用以证明一些数论中的问题。

定理1.21 （鸽巢原理）若有n个鸽巢，n+1只鸽子，则至少有一个巢内有至少两只鸽子。

该定理也常被表述为:若n+1个苹果放在n个抽屉中，则至少有一个抽屉有至少两个苹果。

【例1.48】有3个子女的家庭中一定有两个孩子是同一性别。

证明.两种性别作为“抽屉”，3个孩子作为“苹果”，一定至少有一个抽屉里面有两

[page:17]

## 第1章 基础知识

只苹果。

【例1.49】假设在一个盒子里面有10双黑色袜子、12双蓝色袜子和8双红色袜子，那么拿出4只袜子一定可以保证有同色的两只。

【例1.50】 367人中至少有2人的生日相同。

【例1.51】 证明:在1～10中选取6个数，则其中必定有两个数的和是11。

证明.将10个数分为5组（5个抽屉）:{1,10}，{2,9}，{3,8}，{4,7}和{5,6}。于是任选6个数（6个苹果）都必然存在两个数在同一组中，它们的和就是11。 □

【例1.52】 证明:任意12个整数中一定存在两个整数，其差是11的倍数。

证明.任何一个整数模11的余数都只有11种: $0 , 1 , 2 , \cdots , 1 0 .$ 。于是任意的12个整数中必定存在两个整数模11的余数相同，它们的差就是11的倍数。 □

【例1.53】一次酒会上有n名来宾，其中一些来宾相互握手致意，已知没有人和自己握手，两人之间至多只握一次手。证明:一定有两名来宾的握手次数相同。

证明.将来宾作为“苹果”，握手的次数作为“抽屉”。

每名来宾的握手次数最多为n-1，最少为0。但是不可能既有来宾握手次数为n-1又有来宾握手次数为 $0 ;$ 假如有来宾握手次数为n-1，则说明他与其他任何一名来宾都握过手，那么不可能有来宾没有与其他人握过手；反过来，假如有来宾握手次数为0，则说明他与其他任何一名来宾都没有握过手，那么不可能有来宾与其他人都握过手。

因此抽屉的个数最多为n-1，苹果的个数为n，必定有两个苹果在同一个抽屉中，即必定有两名来宾的握手次数相同。 □

【例1.54】任意7个不同实数中必定存在两个实数x和y，使得 $0 < \frac{x - y}{1 + xy} < \frac{1}{\sqrt{3}}$

证明.首先，对于给定任何实数x，总能找到唯一的实数 $\theta , - \frac{\pi}{2} < \theta < \frac{\pi}{2}$ ，使得 $\tan \theta =$ $x _ { \circ }$ 所以，给定了7个不同的实数 $n _ { 1 } ,   n _ { 2 } ,   \cdots ,   n _ { 7 } ,$ 总可以在区间 $\left( - \frac { \pi } { 2 } , \frac { \pi } { 2 } \right)$ 中找到7个不同的实数 $\theta _ { 1 } ,   \theta _ { 2 } ,   \cdots ,   \theta _ { 7 }$ 使得 $n_{1}=\tan \theta_{1}, n_{2}=\tan \theta_{2}, \cdots, n_{7}=\tan \theta_{7}$

将区间 $\left( - \frac { \pi } { 2 } \mathbf { , } \frac { \pi } { 2 } \right)$ 分为6个子区间: $\left( - \frac { \pi } { 2 } , - \frac { \pi } { 3 } \right) , \left[ - \frac { \pi } { 3 } , - \frac { \pi } { 6 } \right) , \left[ - \frac { \pi } { 6 } , 0 \right) , \left[ 0 , \frac { \pi } { 6 } \right) , \left[ \frac { \pi } { 6 } , \frac { \pi } { 3 } \right)$和 $\left[ { \frac { \pi } { 3 } } , { \frac { \pi } { 2 } } \right)$ $\theta _ { 1 } , \theta _ { 2 } , \cdots$ $\theta _ { 7 }$ 中必定有两个实数 $\theta _ { i }$ 和 $\theta _ { j } ( \theta _ { i } > \theta _ { j } )$ 在同一区间中，于是$\tan 0 < \tan \left( \theta_{i} - \theta_{j} \right) < \tan \frac{\pi}{6}$ ，即

$$0 = \tan 0 \cdot \tan \left( \theta_{i} - \theta_{j} \right) = \frac{\tan \theta_{i} - \tan \theta_{j}}{1 + \tan \theta_{i} \tan \theta_{j}} = \frac{n_{i} - n_{j}}{1 + n_{i}n_{j}} < \tan \frac{\pi}{6} \cdot = \frac{1}{\sqrt{3}}$$

定理1.22 （一般性鸽巢原理）设 $m_{1},m_{2},\cdots,m_{n}$ 都是正整数，并有 $m_{1}+m_{2}+\cdots+m_{n}-n+1$只鸽子住进n个鸽巢，则至少对某个i有:第i个巢中至少有 $m _ { i }$ 只鸽子， $i {=} 1,2,\cdots,n 。$

证明.如若不然，则对任一i，都有:第i个巢中的鸽子数不超过 $m _ { i }   -   1$ 。于是鸽子总数至多是 $m_{1}+m_{2}+\cdots+m_{n}-n$ ，与假设相矛盾。 口

[page:18]

## 离散数学及应用（第2版）

注:定理1.21 是这一原理的特殊情况，即 $m_{1}=m_{2}=\cdots=m_{n}=2,\ m_{1}+m_{2}+\cdots+m_{n}-n+1=n+1$

推论 1 m 只鸽子住进 n 个巢，且 $m { - } 1 { = } q { \cdot } n { + } r$ ，其中 q 和 r是整数，且 $0 \leq r < n$ ，则至少有一个巢里有 $q { + } 1$ 只鸽子。

推论2 $n(m{-}1){+}1$ 只鸽子住进n个巢，至少有一个巢内至少有m只鸽子。

推论3 若 $m_{1} \text { , } m_{2} \text { , } \cdots \text { , } m_{n}$ 是正整数，且 $\frac{m_{1}+m_{2}+\cdots+m_{n}}{n}>r-1$ ，则 $m _ { 1 } ,   m _ { 2 } , \cdots ,   m _ { n }$中至少有一个不小于r。

【例1.55】 如果小张在15天内作了170道习题，那么他一定有某一天做了至少12道习题。

证明.170-1=169=11×15+4，由推论1即得。

【例1.56】在如图1.10（a）所示的边长为 $\sqrt { 3 }$ 的正六边形中任意放置19个点，则其中必有两点之间的距离不超过1。

证明. 按图1.10(b)所示方法将正六边形划分为6个边长为 $\sqrt { 3 }$ 的正三角形，则19个点中必定有4个点在同一个正三角形中（包括边界）。

再将该三角形按图1.10(c)所示方法分为3个圆心角为 $6 0 ^ { \circ }$ 的扇形（不必互不相交），则这4个点中至少存在两点在同一个扇形中（包括边界），例如图1.10（d）所示的这两个点之间的距离必然不超过1。 □

【例1.57】（Erdös-Szekeres 定理）每个由mn+1个互不相等的实数组成的序列中，必定含有一个至少由 n+1 项组成的递增子序列，或有一个至少由 m+1 项组成的递减子序列。

证明. 假设序列是 $a _ { 1 } ,   a _ { 2 } ,   . . . ,   a _ { m n + 1 }$ ，从 $a _ { k }$ 开始的最长的递增子序列的长度记为 $l _ { k ^ { \circ } }$ 如果 $l _ { k } { = } r$ ，那么就把 $a _ { k }$ 放入标号为r的盒子。

如果不存在含有一个n+1的递增子序列，那么盒子的标号只需要 $1 { \sim } n$

由鸽巢原理，将mn+1个元素 $a _ { 1 } , ~ a _ { 2 } , ~ \cdots , ~ a _ { m n + 1 }$ 放入这些盒子里，至少有一个盒子里有 m+1个元素，这m+1个元素组成一个递减子序列——因为如果有 $a _ { i } { \leq } a _ { j }$ ，则将 $a _ { i }$ 加到以 $a _ { j }$ 开始的最长的递增子序列前面，可以得到一个从 $a _ { i }$ 开始且长度为 $l _ { j } { + } 1$ 的递增子序列，与 $l _ { i } { = } l _ { j }$ (即 $a _ { i }$ 和 $a _ { j }$ 在同一个盒子里）产生矛盾。 □

注:这一结果是最好的。令 $[ a ,   b ]$ 表示序列 $(a,   a+1,   \cdots,   b)$ ，考虑 $I _ { 1 } ,   I _ { 2 } ,   \cdots ,   I _ { m } ,$ 其中$I_{k} = \left[ (m - k) \times n + 1, (m + 1 - k) \times n \right]$ ，这个序列由mn个不同的整数组成，而它既没有n+1项的递增子序列也没有m+1项的递减子序列。例如: $n = 4,   m = 3$ 时，序列是9, 10, 11,12, 5,6,7,8, 1, 2, 3, 4。

[page:19]

## 第1章 基础知识

下面这个例子没有直接使用鸽巢原理，但是其本质思想是和鸽巢原理类似的。

【例1.58】假设计算机科学实验室有15台工作站和10台服务器。可以用一条电缆直接把工作站连到服务器。同一时刻只有一条到服务器的直接连接是有效的。希望保证在任何时候任何一组不超过10个工作站都可以通过直接连接同时访问不同的服务器。达到这个目标所需要的最少直接连线的数目是多少？

解. 将工作站标记为 $W _ { 1 } ,   W _ { 2 } ,   \cdots ,   W _ { 1 5 }$ ，服务器标记为 $S _ { 1 } , S _ { 2 } , \cdots , S _ { 1 0 }$

对于 k=1, 2, …, 10，连接 $W _ { k }$ 到 $S _ { k } ;$ 并且 $W _ { 1 1 } ,   W _ { 1 2 } ,   W _ { 1 3 } ,   W _ { 1 4 }$ 和 $W _ { 1 5 }$ 中的每个工作站都连接到所有的10个服务器，总共60条直接连接。

任何一组10个工作站，组里工作站 $W_{i}(1 \leqslant i \leqslant 10)$ 可以直接访问服务器 $S _ { j }$ ，而工作站$W_{j}(j \geq 11)$ 可以访问任意服务器。

如果工作站和服务器之间直接连接少于60条，那么一定存在某个服务器至多连接5个工作站（否则至少需要 $(5 + 1) \times 10 = 60$ 条电缆)。除去这5个工作站后的其他10个工作站都无法访问这个服务器。

从而得到答案是60。

## 1.3.4 有限集的计数——容斥原理

【例1.59】回顾例1.8，设全集 $U { = } \{ 0 , 1 , \cdots , 9 \}$ ,集合 A={0, 1, 2, 3}, B={1, 3, 5, 7,9}，则 $A \cap B = \{ 1 , 3 \}$ , A ∪ B = {0, 1, 2, 3, 5, 7, 9}, $A - B = \{ 0 , 2 \}$ $B – \mathcal { A } = \{ 5 , 7 , 9 \}$ $\overline{A} = \{4, 5, 6,$ 7,8,9}, $\overline{B} = \{ 0, 2, 4, 6, 8 \}$ $A \oplus B = \{ 0, 2, 5, 7, 9 \}$ 。使用维恩图表示如图1.11所示。

可以看到 $\lvert A \cup B \lvert = 7$ $\lvert A \cap B \lvert = 2$ $|A| = 4, |B| = 5$ ，这4个值之间有如下关系:

$$|A| + |B| - |A \cap B| = 4 + 5 - 2 = 7 = |A \cup B|$$

这并非偶然现象，而是一般性原理。

定理1.23 设A、B为两个有限集，则

$$| A \cup B | = | A | + | B | - | A \cap B |$$

证明.显然，若A和B没有共同的元素，即 $A \cap B = \varnothing$ ，则 $| A _ { 1 } \cup A _ { 2 } | = | A _ { 1 } | + | A _ { 2 } |$ (事实上，这就是加法法则的集合论表示)。

若 $A \cap B \ne \varnothing$ ，由 $A \cup B = (A - B) \cup B$ 且 $(A - B) \cap B = \varnothing$ ，及 $A = (A - B) \cup (A \cap B)$ 且 $( A { - } B )$ $\cap ( A \cap B ) = \varnothing$ ，有 $|A \cup B| = |A - B| + |B|   及   |A| = |A - B| + |A \cap B|$ ，即 $| A \cup B | = | A | + | B | - | A \cap$ B|。 □

推论 设U为全集且元素数有限， $A { \subseteq } U ,$ ，则 $\left| \overline{A} \right| = \left| U \right| - \left| A \right|$ 0

[page:20]

## 20

证明. $\left| U \right| = \left| A \cup \overline{A} \right| = \left| A \cup \overline{A} \right| = \left| U \right| = \left| A \right| + \left| \overline{A} \right| - \left| A \cap \overline{A} \right| = \left| A \right| + \left| \overline{A} \right| - 0$ ，整理即得。 □

定理 1.23 也称作容斥原理（inclusion-exclusion principle），其含义也可以解释为:若S为一有限集， $P_{1} 、 P_{2}$ 分别表示两种性质，对于S中的任一元素只能为下面4种情况之一:

（1）只具有性质 $P _ { 1 } \mathrm { { _ { \circ } } }$

（2）只具有性质 $P _ { 2 } ,$

（3）同时具有性质 $P _ { 1 }$ 和 $P _ { 2 } ,$ C

(4) $P_{1} 、 P_{2}$ 两种性质都不具有。

如用 $A _ { 1 }$ 表示S中具有性质 $P _ { 1 }$ 的元素的集合， $A _ { 2 }$ 表示 $S$ 中具有性质 $P _ { 2 }$ 的元素的集合，则 $\overline { { A } } _ { 1 }$ 和 $\overline { { A _ { 2 } } }$ 就分别表示 S中不具有性质 $P _ { 1 }$ 元素的集合和不具有性质 $P _ { 2 }$ 的元素的集合。于是有

$$\begin{aligned}\left| \overline{A_{1}} \cap \overline{A_{2}} \right| = & \left| S \right| - \left( \left| A_{1} \right| + \left| A_{2} \right| - \left| A_{1} \cap A_{2} \right| \right) \\\left| A_{1} \cup A_{2} \right| = & \left| A_{1} \right| + \left| A_{2} \right| - \left| A_{1} \cap A_{2} \right|\end{aligned}$$

【例1.60】 有多少个以1开始或者以00结尾的长度为8的0-1序列？

解.以1开始的长度为8的0-1序列有 $2 ^ { 7 } { = } 1 2 8$ 个。

以00结尾的长度为8的0-1序列有 $2 ^ { 6 } { = } 6 4$ 个。

以1开始且以00结尾的长度为8的0-1序列有 $2 ^ { 5 } { = } 3 2$ 个。

由容斥原理，满足题意的序列有128+64-32=160个。

【例1.61】 某班40名同学中，有20人喜欢篮球，15人喜欢足球，5人既喜欢篮球又喜欢足球。问:（a）既不喜欢篮球又不喜欢足球的同学有多少人？（b）只喜欢篮球的同学有多少人?

解.设该班喜欢篮球的同学的集合为B，喜欢足球的同学的集合为F，由题意有$| B | = 2 0 , \quad | F | = 1 5 , \quad | B \cap F | = 5$ 0

$$\begin{aligned}(a) \mid & \overline{B} \cap \overline{F} \mid = 40 - (|B| + |F| - |B \cap F|) \\= & 40 - (20 + 15 - 5) \\= & 10\end{aligned}$$

故既不喜欢篮球又不喜欢足球的同学有10人。

(b） 由于 $\left( B \cap F \right) \cup \left( B \cap \overline{F} \right) = B \cap \left( F \cup \overline{F} \right) = B \cap U = B$ ，而且 $\left( B \cap F \right) \cap \left( B \cap \overline{F} \right) = \varnothing$因此 $\left| \left| B - F \right| = \left| B \cap \overline{F} \right| = \left| B \right| - \left| B \cap F \right| = 20 - 5 = 15 \right.$ ，即只喜欢篮球的同学有15人。

定理1.23可以推广到3个有限集元素的计数问题。

定理1.24 设A、B、C是有限集合，则

$$\begin{aligned} &|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |B \cap C| - |A \cap C| + |A \cap B \cap C|\\ &\\  证明 . \quad &|A \cup B \cup C|\\ &= |A| + |B \cup C| - |A \cap (B \cup C)|\\ &= |A| + |B \cup C| - |(A \cap B) \cup (A \cap C)|\\ &= |A| + |B| + |C| - |(A \cap B) + |A \cap C| - |(A \cap B) \cap (A \cap C)|\\ &= |A| + |B| + |C| - |B \cap C| - (|A \cap B| + |A \cap C| - |(A \cap B) \cap (A \cap C)|)\\ \end{aligned}$$

[page:21]

## 第1章 基础知识

$$\begin{aligned}&= |A| + |B| + |C| - |B \cap C| - (|A \cap B| + |A \cap C| - |(A \cap A) \cap (B \cap C)|) \quad &( 交换律、结合律 ) \\&= |A| + |B| + |C| - |A \cap B| - |B \cap C| - |A \cap C| + |A \cap B \cap C| \quad &( 幂等律 )\end{aligned}$$

【例1.62】一个培训班只有3门课程:数学、作文、英语。已知修这3门课的学生分别有170人、130人、120人，同时修数学、作文两门课的有50人，同时修数学、英语的有20人，同时修作文、英语的有25人，同时修3门课程的有5人。问:（a）培训班共有多少学生？（b）只修了数学的学生有多少名？

解.令M为修数学的学生集合，C为修作文的学生集合，E为修英语的学生集合，则

$$|M| = 170,\quad |C| = 130,\quad |E| = 120,\quad |M \cap C| = 50,\quad |M \cap E| = 20,\quad |C \cap E| = 25,\quad |M \cap C \cap E| = 5$$

(a)|U|=|M∪C∪E|=|M|+|C|+|E|-|M∩C|-|M∩E|-|C∩E|+|M∩C∩E|=330，即培训班有330名学生。

$$$\left( \mathtt { b } \right) \mathrm {  由  } \left| M \bigcap \left( C \bigcup E \right) \right| \mathrm { = } \left| \left( M \bigcap C \right) \bigcup \left( M \bigcap E \right) \right| \mathrm { = } \left| M \bigcap C \right| \mathrm { + } \left| M \bigcap E \right| \mathrm { - } \left| M \bigcap C \bigcap M \bigcap E \right| \mathrm { = } 5 0 \mathrm { + }$ $2 0 { \scriptstyle - 5 } { \scriptstyle - 6 5 }$ ,  有  $\left| M \bigcap { \overline { { C } } } \bigcap { \overline { { E } } } \right| { = } \left| M \bigcap { \overline { { \left( C \bigcup E \right) } } } \right| { = } \left| M \right| { - } \left| M \bigcap \left( C \bigcup E \right) \right| { = } 1 7 0 { - } 6 5 { = } 1 0 5 \text { 。  }$$$

【例1.63】软件学院有20名教师，可供他们选修的第二外语是日语、法语和德语。已知有5人选修日语，8人选修法语，10人选修德语，而且其中3人同时选修了这3门外语，请计算至少有多少人一门外语也没有选修。

解.设A、B、C分别表示选修日语、法语和德语的人。因此 $|A|=5,\ |B|=8,\ |C|=10,$ $|A \cap B \cap C| = 3 。由  |A \cap B| \geqslant |A \cap B \cap C| 。 |B \cap C| \geqslant |A \cap B \cap C| 。 |B \cap C| \geqslant |A \cap B \cap C|$ 得到:

$$\begin{aligned}|A \cup B \cup C| &= |A| + |B| + |C| - |A \cap B| - |B \cap C| - |A \cap C| + |A \cap B \cap C| \\&\leqslant |A| + |B| + |C| - 2|A \cap B \cap C| \\&= 5 + 8 + 10 - 2 \times 3 - 17\end{aligned}$$

至少有3人一门都没有选修。

容斥原理还可以进一步推广到m个有限集的计数问题上。

定理 1.25 设 $A_{1},A_{2},\cdots,A_{m}$ 为m个有限集，则

$$\begin{align*}& | \mathcal{A}_1 \bigcup \mathcal{A}_2 \bigcup \cdots \bigcup \mathcal{A}_m | \\= & \sum_{i=1}^m | \mathcal{A}_i | - \sum_{1 \leq i < j \leq m} | \mathcal{A}_i \bigcap \mathcal{A}_j | + \sum_{1 \leq i < j < k \leq m} | \mathcal{A}_i \bigcap \mathcal{A}_j \bigcap \mathcal{A}_k | - \cdots + (-1)^{m-1} | \mathcal{A}_1 \bigcap \mathcal{A}_2 \bigcap \cdots \bigcap \mathcal{A}_m |\end{align*}$$

证明.（使用数学归纳法）

（1）当m=2时结论成立（定理1.23）。

（2）假设定理1.25对m个有限集成立，对于 m+1个有限集:

$$\begin{align*}& | \mathcal{A}_1 \bigcup \mathcal{A}_2 \bigcup \cdots \bigcup \mathcal{A}_m \bigcup \mathcal{A}_{m+1} | \\=& | \mathcal{A}_1 \bigcup \mathcal{A}_2 \bigcup \cdots \bigcup \mathcal{A}_m | + | \mathcal{A}_{m+1} | - \left| \left( \mathcal{A}_1 \bigcup \mathcal{A}_2 \bigcup \cdots \bigcup \mathcal{A}_m \right) \bigcap \mathcal{A}_{m+1} \right| \\=& | \mathcal{A}_1 \bigcup \mathcal{A}_2 \bigcup \cdots \bigcup \mathcal{A}_m | + | \mathcal{A}_{m+1} | - \left| \left( \mathcal{A}_1 \bigcap \mathcal{A}_{m+1} \right) \bigcup \left( \mathcal{A}_2 \bigcap \mathcal{A}_{m+1} \right) \bigcup \cdots \bigcup \left( \mathcal{A}_m \bigcap \mathcal{A}_{m+1} \right) \right| \\=& \left( \sum_{i=1}^m | \mathcal{A}_i | - \sum_{1 \leqslant i < j \leqslant m} | \mathcal{A}_i \bigcap \mathcal{A}_j | + \sum_{1 \leqslant i < j < k \leqslant m} | \mathcal{A}_i \bigcap \mathcal{A}_j \bigcap \mathcal{A}_k | - \cdots + (-1)^{m-1} | \mathcal{A}_1 \bigcap \mathcal{A}_2 \bigcap \cdots \bigcap \mathcal{A}_m | \right)\end{align*}$$

[page:22]

## 22

$$\begin{aligned} &+ \mid A_{m+1} \mid - \left( \sum_{i=1}^{m} \mid A_i \bigcap A_{m+1} \mid - \sum_{1 \leq i < j \leq m} \mid A_i \bigcap A_j \bigcap A_{m+1} \mid \right.\\ &\\ \left. + \sum_{1 \leq i < j < k \leq m} \mid A_i \bigcap A_j \bigcap A_k \bigcap A_{m+1} \mid - \cdots + (-1)^{m-1} \mid A_1 \bigcap A_2 \bigcap \cdots \bigcap A_m \bigcap A_{m+1} \mid \right)\\ = & \sum_{i=1}^{m+1} \mid A_i \mid - \sum_{1 \leq i < j \leq m+1} \mid A_i \bigcap A_j \mid + \sum_{1 \leq i < j < k \leq m+1} \mid A_i \bigcap A_j \bigcap A_k \mid - \cdots + (-1)^m \mid A_1 \bigcap A_2 \bigcap \cdots \bigcap A_{m+1} \mid.\\ \end{aligned}$$

综合（1）、（2）可知定理1.25成立。

定理1.26 设S为有穷集， $P _ { 1 } , P _ { 2 } , \cdots , P _ { m }$ 是 m 种性质， $A _ { i }$ 是S中具有性质 $P _ { i }$ 的元素构成的子集， $i {=} 1, 2, \cdots, m 。$ ，则S中不具有性质 $P _ { 1 } , P _ { 2 } , \cdots , P _ { m }$ 的元素数为

$$\begin{align*}& | \overline{A_1} \bigcap \overline{A_2} \bigcap \cdots \bigcap \overline{A_m} | \\= & | S | - \sum_{i=1}^m | A_i | + \sum_{1 \leq i < j \leq m} | A_i \bigcap A_j | - \sum_{1 \leq i < j < k \leq m} | A_i \bigcap A_j \bigcap A_k | + \cdots + (-1)^m | A_1 \bigcap A_2 \bigcap \cdots \bigcap A_m |.\end{align*}$$

## 1.3.5 递推关系

定义1.23 设序列为 $a_{0},a_{1},\cdots,a_{n},\cdots \text{。 } 一$ 个把与某个或某些 $a _ { n }$ $a _ { i } ( i \leq n )$ 联系起来的等式叫做关于序列 $\{ a _ { n } \}$ 的递推关系（recurrence relation)。当给定递推关系和适当的初值后就唯一确定了序列。

【例1.64】 阶乘数列1,2,6,24, 120，…，其递推关系为 $F(n) = n F(n - 1)$ ，初值 $F ( 1 ) =$ 1。

【例1.65】法国数学家卢卡斯（EdouardLucas）在1883年提出了一个数学游戏:传说在世界中心贝拿勒斯（在印度北部）的圣庙里，一块黄铜板上有3根宝石柱。印度教的主神大梵天在创造世界的时候，在其中一根柱上从下到上地穿好了由大到小的64片金盘。大梵天命令僧侣们将圆盘从下面开始按大小顺序重新摆放在另一根柱子上，并且规定，在小圆盘上不能放大圆盘，在3根柱子之间一次只能移动一个圆盘。预言说当这些盘子移动完毕时，世界就将在一声霹雳中消灭，而梵塔、庙宇和众生也都将同归于尽。

这个传说又称作梵天寺之塔问题（Tower of Brahma puzzle)，而且有若干变体:其一是寺院的地点位于越南河内，因此该问题也常被称作“河内塔”或音译为“汉诺塔”（Tower of Hanoi)。

下面考虑该问题的一般形式:假设有n个圆盘，最初自下而上、自大而小地穿在A柱上（如图1.12所示），每次按规则移动一个圆盘，最终将所有圆盘移动到C柱上。

[page:23]

## 第1章 基础知识

注意到其中最大的盘子位于A柱的最底部（图1.13（a))，而要将其移动到C柱，必须如图1.13(b)所示先将A柱上所有其他盘子移到B柱上(这是一个类似于自己的子问题)；接着如图1.13(c)所示将最大的盘子从A柱移到C柱，之后不必再管它；最后再如图1.13（d）所示将刚才移到B柱上的盘子移到C柱上（这又是一个子问题）。

算法的形式化描述如下:

汉诺塔的递归算法 Hanoi (n, source, dest, by)

输入:圆盘数n。

1 If (n=1) then
1.1 Print (Move disk from source to dest)
2 Else
2.1 Hanoi (n-1, source, by, dest)
2.2 Print (Move disk from source to dest)
2.3 Hanoi (n-1, by, dest, source)

用T(n)表示移动n个圆盘所需要的步数。根据算法先把前面n-1个盘子转移到B上，然后把第n个盘子转到C上，最后再一次将B上的n-1个盘子转移到C上。得到递推关系 T(n)=2T(n−1)+1。

为求解 T(n)=2T(n-1)+1，T(1)=1。可使用倒推法:

$$\begin{aligned} \mathit { T } ( n ) &= 2 \mathit { T } ( n - 1 ) + 1 \\&= 2 ( 2 \mathit { T } ( n - 2 ) + 1 ) + 1 = 2 ^ { 2 } \mathit { T } ( n - 2 ) + 2 + 1 \\&= 2 ^ { 2 } ( 2 \mathit { T } ( n - 3 ) + 1 ) + 2 + 1 = 2 ^ { 3 } \mathit { T } ( n - 3 ) + 2 ^ { 2 } + 2 + 1 \\&\vdots \\&= 2 ^ { n - 1 } \mathit { T } ( 1 ) + 2 ^ { ( n - 1 ) - 1 } + \cdots + 2 ^ { 2 } + 2 + 1 \\&= 2 ^ { n - 1 } + 2 ^ { ( n - 1 ) - 1 } + \cdots + 2 ^ { 2 } + 2 + 1 \\&= 2 ^ { n } - 1\\ \end{aligned}$$

回到最初的汉诺塔问题，要将64片金盘重新摆放在另一根柱子上，最少需要24-1步，即使僧侣每秒移动一步而且每次移动都用了正确的方法，那么也需要 $5 . 8 { \times } 1 0 ^ { 1 1 }$ 年，

[page:24]

## 24

即5千多亿年！

下面再给出递推关系的另一个经典例子。

【例1.66】13世纪时，意大利数学家斐波那契（Fibonacci，1170—1250）在名为《算盘书》的数学著作中提出了著名的“兔子问题”:假定最初有新生的雌雄兔子一对，除了本月新生的兔子外，每对兔子每个月都可以生出一对新的兔子；而且假定兔子永远不会死，请问n个月后一共有多少对兔子？

设满n个月时兔子对数为 $f _ { n } ,$ ，其中当月新生兔数目设为 $N _ { n }$ 对，第 n-1 个月存活的兔子数目设为 $O _ { n }$ 对，则有 $f_{n} = N_{n} + O_{n}$ 而 $O_{n}=f_{n-1},\ N_{n}=f_{n-2}$ ，由此得到递推关系 $f _ { n }   =   f _ { n - 1 }   +$ $f _ { n - 2 } ,$ 初值 $f_{1} = 1, f_{2} = 1$ 。这个序列1,1,2,3,5,8,…称作斐波那契数列，它有着许多应用。

这类递推关系形式上具有特殊性，下面给出严格的定义。

定义 1.24 假设序列 $a _ { 0 } , a _ { 1 } , \cdots , a _ { n } ,$ …的递推关系满足

$$a_{n} + c_{1}a_{n - 1} + c_{2}a_{n - 2} + \cdots + c_{k}a_{n - k} = 0, \quad a_{0} = d_{0}, a_{1} = d_{1}, \cdots, a_{k - 1} = d_{k - 1}$$

其中 $c_{1},   c_{2},   \cdots,   c_{k}$ 及 $d _ { 0 } ,   d _ { 1 } ,   \cdots ,   d _ { k - 1 }$ 都是常数， $c _ { k }     \neq     0$ ，则称这个方程为k阶常系数线性齐次递推关系(linear homogeneous relation of degree k), $d _ { 0 } , \; d _ { 1 } , \; \cdots , \; d _ { k - 1 }$ 为初值。$c(x)=x^{k}+c_{1}x^{k-1}+\cdots+c_{k-1}x+c_{k}$ 称为该序列的特征多项式（characteristic equation)，其根称为特征根（characteristic root）。

例如， $\left\{ \begin{aligned} b_{n} &= 2b_{n - 1} \\ b_{0} &= 1 \end{aligned} \right. , \quad \left\{ \begin{aligned} a_{n} &= 4a_{n - 1} + 4a_{n - 2} = 0 \\ a_{0} &= 1, a_{1} = 3 \end{aligned} \right.$ 都是常系数线性齐次递推关系。

下面给出2阶常系数线性齐次递推关系的解法。

假设α、β是 $a_{n}=c_{1}a_{n - 1}+c_{2}a_{n - 2}$ 的特征方程 $x ^ { 2 } { - } c _ { 1 } x { - } c _ { 2 } { = } 0$ 的两个根，即 $a _ { n } = ( \alpha + \beta ) a _ { n - 1 } -$ $( \alpha \beta ) a _ { n - 2 }$ ，容易验证有 $a_{n}-\alpha a_{n-1}=\beta \left ( a_{n-1}-\alpha a_{n-2} \right )$ 。递推可以得到 $a_{n}-\alpha a_{n-1}=\beta\left(a_{n-1}-\alpha a_{n-2}\right)$ $\beta ^ { 2 } ( a _ { n - 2 } - \alpha a _ { n - 3 } ) = \cdots = \beta ^ { n - 1 } ( a _ { 1 } - \alpha a _ { 0 } )$ 。由此倒推得到 $a_{n}-\alpha^{n}a_{0}=(\beta^{n-1}+\alpha\beta^{n-2}+\alpha^{2}\beta^{n-3}+\cdots+\alpha^{n-1})$ $( a _ { 1 }   -   \alpha a _ { 0 } )$ ，有:

当 $\alpha   \neq   \beta$ 时， $a_{n}-\alpha^{n}a_{0}=\frac{\alpha^{n}-\beta^{n}}{\alpha-\beta}(a_{1}-\alpha a_{0})$ ，即 $a_{n} = \frac{\left( a_{1} - \beta a_{0} \right)}{\alpha - \beta}\alpha^{n} + \frac{\left( a_{1} - \alpha a_{0} \right)}{\beta - \alpha}\beta^{n}$

当 $\alpha   =   \beta$ 时， $a_{n}-\alpha^{n}a_{0}=n\alpha^{n-1}(a_{1}-\alpha a_{0})$ ，即 $a_{n}=a_{0}\alpha^{n}+(a_{1}-\alpha a_{0})n\alpha^{n-1}$ 0

【例1.67】递推关系 $f _ { n } = f _ { n - 1 } + f _ { n - 2 }$ 的特征方程是 $x ^ { 2 } { - } x { - } 1 { = } 0$ ，两个互异的特征根是$\frac{1 + \sqrt{5}}{2}, \quad \frac{1 - \sqrt{5}}{2}$ 。由初值 $f_{1}=1,\ f_{2}=1$ 可得 $f _ { 0 } = 0$ ，代入上述公式可得

$$f_{n}=\frac{1}{\sqrt{5}}\left(\frac{1+\sqrt{5}}{2}\right)^{n}-\frac{1}{\sqrt{5}}\left(\frac{1-\sqrt{5}}{2}\right)^{n}$$

【例1.68】递推关系 $\begin{cases}a_{n} - 4a_{n - 1} + 4a_{n - 2} = 0, \\a_{0} = 1, a_{1} = 3\end{cases}$ 的特征方程是 $x^{2}-4x+4=0$ ，特征根是2 (二重)，由初值 $a_{0}=1,\ a_{1}=3$ 代入得到 $a_{n}=2^{n}+n2^{n-1}$

【例1.69】使用多米诺（dominos）骨牌，即 $1 { \times } 2$ 的小方格，覆盖2×n的方格棋盘，有多少种不同的方式？

[page:25]

## 第1章 基础知识

解. 假设覆盖2×n的方格棋盘的不同方式数为 $S _ { n }$

考虑覆盖最左上角的小方格，必定是图1.14（a）或(b)的情况。在（a）的情况下，继续覆盖完方格棋盘共有 $S _ { n - 2 }$ 种不同方式；在(b)的情况下，继续覆盖完方格棋盘共有 $S _ { n - }$ 1种不同方式。

初值是 $S _ { 1 } { = } 1$ $S _ { 2 } { = } 2$ ，因此 $S _ { n }$ 就是第 $n { + } 1$ 个斐波那契数。

考虑一个问题:家中阳台上有10盆不同的花，为保持新鲜感，希望每天重新摆放，使得每盆花都不在第一天放的位置。那么最多可以连续多少天每天摆法都不同？

这就是错排问题的一个具体实例。若一个n元素的全排列中所有的元素都不在本来的位置上，那么就称这个全排列为原排列的一个错排（derangement)。一个形式化的表述是:若1-n的一个全排列 $\sigma _ { 1 } \sigma _ { 2 } { \cdots } \sigma _ { n }$ 满足 $\sigma _ { i } { \neq } i$ 对所有1≤i≤n成立，则称 $\sigma _ { 1 } \sigma _ { 2 } { \cdots } \sigma _ { n }$ 为1-n的一个错排。

法国数学家德·蒙特莫特（Pierre Rémond de Montmort, 1678—1719）在 1708 年最早提出了这个问题，并在1713年解决；尼古拉·伯努利（NicholasBernoulli）和欧拉也研究过这个问题，因此这个问题也称作“伯努利-欧拉错装信封问题”（Bernoulli-Euler problem of the misaddressed letters）—某人给 n个朋友写信，邀请他们来家中聚会，结果粗心的他却把请柬全都装错了信封。请问有多少种全部装错信封的情况？

n 个元素的错排的个数记为D(n)或d(n)或!n，称作错排数或德·蒙特莫特数。下面通过两种方法计算D(n)的具体值。

方法1:建立递推关系。

第1步，选择第n个元素的位置，共有n-1种方法（假定放在编号为k的位置）。

第2步，选择第k个元素的位置，有两种可能:第k个元素放在编号为n的位置此时剩下的 n-2 个元素进行错排即可（图 1.15（a))，方案数是 D(n-2)；或者第 k 个元素不在编号为n的位置，此时把编号为n的位置视作编号为k的位置，将n-1个元素进行错排即可（图1.15（b))，方案数是D(n-1)。

由此得到递推关系 $D(n)=(n-1)(D(n-2)+D(n-1))$ ，很容易得到初值D(1)=0和 $D(2) = 1$令 $N ( k ) = D ( k ) / k ! , k \geq 1$ ，则整理得到 $( N ( k ) - N ( k - 1 ) ) = - ( N ( k - 1 ) - N ( k - 2 ) ) / k$ 。于是:

[page:26]

## 26

$$\begin{aligned}N(k) - N(k - 1) = & - \frac{N(k - 1) - N(k - 2)}{k} = \frac{N(k - 2) - N(k - 3)}{k(k - 1)} \\= & \frac{- (N(2) - N(1))( - 1)^{k - 1}}{k(k - 1) \cdots 2} = \frac{( - 1)^{k}}{k!}\end{aligned}$$

因此 $N ( n ) { = } ( N ( n ) { - } N ( n { - } 1 ) ) { + } ( N ( n { - } 1 ) { - } N ( n { - } 2 ) ) { + } \cdots { + } ( N ( 2 ) { - } N ( 1 ) ) { + } N ( 1 )$ ，得到

$$D(n)=n!N(n)=n!\sum_{i = 0}^{n}\frac{(-1)^{i}}{i!}$$

方法2:应用容斥原理。

n个元素的全排列有 n!个，用集合 $A _ { k }$ 表示第k个位置是第k个元素（即元素k没有发生错排）的所有排列，则易得

$$\begin{aligned} &|A_{i}| = (n - 1)!, \quad 1 \leqslant i \leqslant n \\&|A_{i} \cap A_{j}| = (n - 2)!, \quad 1 \leqslant i < j \leqslant n \\&|A_{i} \cap A_{j} \cap A_{k}| = (n - 3)!, \quad 1 \leqslant i < j < k \leqslant n \\&\vdots \\&|A_{1} \cap A_{2} \cap \cdots \cap A_{n}| = 0!\\ \end{aligned}$$

则由容斥原理（定理1.26）也可以得到 $D(n)=n!+\sum_{i=1}^{n}(-1)^{i}\binom{n}{i}(n-i)!$

## 1.4 布尔矩阵及其运算

定义1.25一个布尔矩阵（Boolean matrix）或位矩阵（bit matrix）是一个元素为0或1的矩阵。

定义 1.26 设 $\boldsymbol{A} = \begin{bmatrix} a_{ij} \end{bmatrix}$ 是一个m×n的布尔矩阵，则定义其补（complement）为$\overline { { A } } = [ \overline { { a _ { i j } } } ] = [ 1 - a _ { i j } ] ,$ 0

定义 1.27 设 $A = [a_{ij}]  和  B = [b_{ij}]$ 是两个m×n的布尔矩阵，则定义

（a）A和B的并（join）为 $A \lor B = C = [c_{ij}]$ ，其中 $c_{ij} = \begin{cases}1, &  若  a_{ij} = 1  或  b_{ij} = 1 \\0, &  若  a_{ij} = 0  且  b_{ij} = 0\end{cases}$

（b）A和B的交（meet）为 $A \wedge B = D = [d_{ij}]$ ，其中 $d_{ij}=\begin{cases}1, &  若  a_{ij}=1  且  b_{ij}=1 \\0, &  若  a_{ij}=0  或  b_{ij}=0\end{cases} 。$

注:

（a）布尔矩阵的并和交可以扩展到多个布尔矩阵上。

（b）把一个元素看作1×1的矩阵，则也可以定义元素间的并和交。

定义 1.28 设 $\boldsymbol{A} = \begin{bmatrix} a_{ij} \end{bmatrix}$ 是 m×n的布尔矩阵， $\pmb { B } { = } [ b _ { i j } ]$ 是n×r的布尔矩阵，则定义A和B的布尔积（Boolean product）为 $A \odot B = C = [c_{ij}]$ ，其中

$$c_{ij} = \begin{cases}1, &  若存在  k, 1 \leq k \leq n,  使得  a_{ik} = 1  且  b_{kj} = 1 \\0, &  若所有  k, 1 \leq k \leq n, a_{ik} \times b_{kj} = 0\end{cases}$$

[page:27]

## 第1章 基础知识

如果将布尔矩阵的元素看作普通的数值，则元素之间可以进行普通的数值运算，矩阵也可以进行通常的加法、乘法运算。于是有如下定理。

定理1.27 设 $\boldsymbol{A} = \begin{bmatrix} a_{ij} \end{bmatrix}$ 和 $\pmb { B } { = } [ b _ { i j } ]$ 是两个m×n的布尔矩阵，则

(a) $A \lor B = C = [c_{ij}]$ ，其中 $c _ { i j } = a _ { i j } + b _ { i j } - a _ { i j } b _ { i j }$ 0

(b) $A \wedge B = D = [d_{ij}]$ ，其中 $d _ { i j } = a _ { i j } b _ { i j }$

(c)设 $A + B = E = \left[ e_{ij} \right]$ ，则 $A \lor B = C = [c_{ij}]$ ，其中 $c_{ij} = \begin{cases}1, &  若  e_{ij} > 0 \\0, &  若  e_{ij} = 0\end{cases} 。$

(d)设 $A + B = E = \left[ e_{ij} \right]$ ，则 $A \land B = D = [d_{ij}]$ ，其中 $d _ { i j } = \left\{ \begin{aligned} { 1 , } \\ { 0 , } \end{aligned} \right.$ 若若 $\begin{array} { r } { e _ { i j } = 2 } \\ { e _ { i j } < 2 } \end{array}$

设 $\boldsymbol{A} = \begin{bmatrix} a_{ij} \end{bmatrix}$ 是 m×n的布尔矩阵， $\pmb { B } { = } [ b _ { i j } ]$ 是n×r的布尔矩阵.则

(e）设 $A \times B = F = [f_{ij}]$ ，则 $A \odot B = G = [g_{ij}]$ ，其中 $g_{ij} = \left\{ \begin{aligned} 1, \quad  若  f_{ij} > 0 \\ 0, \quad  若  f_{ij} = 0 \end{aligned} \right. 。$

证明:只证明（e），余者由定义很容易证明。

(e) $g _ { i j } { = } 1$ 当且仅当存在k 使得 $a _ { i k } { = } b _ { k j } { = } 1$ ，而 $f_{ij} = \sum_{k} a_{ik} b_{kj} \geqslant 1$ 当且仅当存在 k 使得$a _ { i k } \mathrm { > } 0$ 且 $b _ { k j } { > } 0$ 。于是 $g _ { i j } { = } 1$ 当且仅当 $f _ { i j } { > } 0$ 口

【例1.70】设布尔矩阵 $\boldsymbol{A} = \begin{pmatrix}1 & 1 & 0 & 1 \\1 & 0 & 0 & 0 \\0 & 1 & 0 & 1 \\0 & 0 & 0 & 0\end{pmatrix}, \quad\boldsymbol{B} = \begin{pmatrix}0 & 1 & 1 & 0 \\1 & 1 & 0 & 1 \\0 & 0 & 0 & 0 \\0 & 0 & 0 & 1\end{pmatrix}$ ，则

$$\begin{aligned}\boldsymbol{A} + \boldsymbol{B} &= \begin{pmatrix}1 & 2 & 1 & 1 \\2 & 1 & 0 & 1 \\0 & 1 & 0 & 1 \\0 & 0 & 0 & 1\end{pmatrix}, &\boldsymbol{A} \lor \boldsymbol{B} &= \begin{pmatrix}1 & 1 & 1 & 1 \\1 & 1 & 0 & 1 \\0 & 1 & 0 & 1 \\0 & 0 & 0 & 1\end{pmatrix}, &\boldsymbol{A} \land \boldsymbol{B} &= \begin{pmatrix}0 & 1 & 0 & 0 \\1 & 0 & 0 & 0 \\0 & 0 & 0 & 0 \\0 & 0 & 0 & 0\end{pmatrix},\end{aligned}$$

$$\boldsymbol{A} \times \boldsymbol{B} = \begin{pmatrix}1 & 2 & 1 & 2 \\0 & 1 & 1 & 0 \\1 & 1 & 0 & 2 \\0 & 0 & 0 & 0\end{pmatrix}, \quad\boldsymbol{A} \odot \boldsymbol{B} = \begin{pmatrix}1 & 1 & 1 & 1 \\0 & 1 & 1 & 0 \\1 & 1 & 0 & 1 \\0 & 0 & 0 & 0\end{pmatrix}$$

定理1.28 假设布尔矩阵A、B和C具有兼容大小（即下述诸运算都可进行），则有（a） 交换律:

$$A \lor B = B \lor A, \quad A \land B = B \land A$$

（b）结合律:

$$(A \lor B) \lor C = A \lor (B \lor C), (A \land B) \land C = A \land (B \land C), (A \odot B) \odot C = A \odot (B \odot C)$$

（c）分配律:

$$A \land (B \lor C) = (A \land B) \lor (A \land C), A \lor (B \land C) = (A \lor B) \land (A \lor C)$$

证明.（a）由定义易得。

（b）假设 $(A \lor B) \lor C = [d_{ij}], A \lor (B \lor C) = [e_{ij}]$ 。则由定理1.27，有

[page:28]

## 离散数学及应用（第2版）

$$\begin{array} { r l } { d _ { i j } { = } } & { ( a _ { i j } { + } b _ { i j } { - } a _ { i j } b _ { i j } ) { + } c _ { i j } { - } ( a _ { i j } { + } b _ { i j } { - } a _ { i j } b _ { i j } ) c _ { i j } } \\ { = } & { a _ { i j } { + } b _ { i j } { + } c _ { i j } { - } a _ { i j } b _ { i j } { - } a _ { i j } c _ { i j } { - } b _ { i j } c _ { i j } { + } a _ { i j } b _ { i j } c _ { i j } } \\ { = } & { a _ { i j } { + } ( b _ { i j } { + } c _ { i j } { - } b _ { i j } c _ { i j } { - } a _ { i j } ( b _ { i j } { + } c _ { i j } { - } b _ { i j } c _ { i j } ) { - } e _ { i j } ) } \end{array}$$

即得 $(A \lor B) \lor C = A \lor (B \lor C)$ 0

假设 $(A \land B) \land C = [d_{ij}], A \land (B \land C) = [e_{ij}]$ 。则由定理1.27， $d_{ij}{=}(a_{ij}b_{ij})c_{ij}{=}a_{ij}(b_{ij}c_{ij}){=}e_{ij}$ ，即$(A \land B) \land C = A \land (B \land C)$

假设 $A \odot B = [d_{ij}], \quad (A \odot B) \odot C = [e_{ij}], \quad B \odot C = [f_{ij}], \quad A \odot (B \odot C) = [g_{ij}].$

则 $e _ { i j } { = } 1$ 当且仅当存在k使得 $d _ { i k } { = } c _ { k j } { = } 1$ ，而 $d _ { i k } { = } 1$ 当且仅当存在l使得 $a _ { i l } { = } b _ { l k } { = } 1$ 。于是$e _ { i j } { = } 1$ 当且仅当存在k、l使得 $a _ { i l } { = } b _ { l k } { = } c _ { k j } { = } 1$

同样地， $g _ { i j } { = } 1$ 当且仅当存在l使得 $a _ { i l } { = } f _ { l j } { = } 1$ ，而 $f _ { \boldsymbol { \mathcal { Y } } } { = } 1$ 当且仅当存在k使得 $b _ { l k }   =   c _ { k j }   =   1$于是 $g _ { i j } { = } 1$ 当且仅当存在k、l使得 $a _ { i l } { = } b _ { l k } { = } c _ { k j } { = } 1$

因此 $(A \odot B) \odot C = A \odot (B \odot C)$

(c）假设 $A \land (B \lor C) = [d_{ij}], (A \land B) \lor (A \land C) = [e_{ij}]$ 。则由定理1.27，有

$$\begin{aligned}e_{ij} = &   a_{ij}b_{ij} + a_{ij}c_{ij} - \left(a_{ij}b_{ij}a_{ij}c_{ij}\right) \\= &   a_{ij}b_{ij} + a_{ij}c_{ij} - \left(a_{ij}b_{ij}c_{ij}\right) \\= &   a_{ij}\left(b_{ij} + c_{ij} - b_{ij}c_{ij}\right) = d_{ij}\end{aligned}$$

即得 $A \land (B \lor C) = (A \land B) \lor (A \land C)$ 0

假设 $A \lor (B \land C) = [d_{ij}], (A \lor B) \land (A \lor C) = [e_{ij}]$ 。则由定理1.27，有

$$\begin{aligned}e_{_{ij}} = & \left(a_{_{ij}} + b_{_{ij}} - a_{_{ij}}b_{_{ij}}\right)\left(a_{_{ij}} + c_{_{ij}} - a_{_{ij}}c_{_{ij}}\right) \\= & a_{_{ij}}^{2} + a_{_{ij}}c_{_{ij}} - a_{_{ij}}^{2}c_{_{ij}} + a_{_{ij}}b_{_{ij}} + b_{_{ij}}c_{_{ij}} - a_{_{ij}}b_{_{ij}}c_{_{ij}} - a_{_{ij}}^{2}b_{_{ij}} - a_{_{ij}}b_{_{ij}}c_{_{ij}} + a_{_{ij}}^{2}b_{_{ij}}c_{_{ij}} \\= & a_{_{ij}} + a_{_{ij}}c_{_{ij}} - a_{_{ij}}c_{_{ij}} + a_{_{ij}}b_{_{ij}} + b_{_{ij}}c_{_{ij}} - a_{_{ij}}b_{_{ij}}c_{_{ij}} - a_{_{ij}}b_{_{ij}} - a_{_{ij}}b_{_{ij}}c_{_{ij}} + a_{_{ij}}b_{_{ij}}c_{_{ij}} \\= & a_{_{ij}} + b_{_{ij}}c_{_{ij}} - a_{_{ij}}b_{_{ij}}c_{_{ij}} = d_{_{ij}}\end{aligned}$$

即得 $A \lor (B \land C) = (A \lor B) \land (A \lor C)$ 0

将布尔矩阵视作一般矩阵时，其转置操作和布尔运算有如下关系。

定理1.29 假设布尔矩阵A、B和C具有兼容大小，则有

$$( \boldsymbol{A} \lor \boldsymbol{B} )^{\mathrm{T}} = \boldsymbol{A}^{\mathrm{T}} \lor \boldsymbol{B}^{\mathrm{T}}, \quad ( \boldsymbol{A} \land \boldsymbol{B} )^{\mathrm{T}} = \boldsymbol{A}^{\mathrm{T}} \land \boldsymbol{B}^{\mathrm{T}}, \quad ( \boldsymbol{A} \odot \boldsymbol{B} )^{\mathrm{T}} = \boldsymbol{B}^{\mathrm{T}} \odot \boldsymbol{A}^{\mathrm{T}}$$

## 习题1

1.1 列出下述集合的所有元素。

（a）大于0小于5的所有整数。

(b){x|x∈Z且 $x ^ { 2 } { = } 1 \}$ o

（c）{x|x是十进制的数字}。

（d）一年中有31天的月份。

1.2 用描述法表示以下集合。

(a) {1, 8, 27, 64, 125} 。

[page:29]

## 第1章 基础知识

（b）正偶整数的集合。

（c）直角坐标系中单位圆（不包括边界）的点集。

(d) {11, 13, 17, 19, 23, 29} .

1.3 判断以下结论是否成立。

(a) $\varnothing { \in } \varnothing 。$

(b) $\varnothing \subseteq \varnothing 。$

(c) $\varnothing \in \{ \varnothing \} _ { 0 }$

(d) $\varnothing \subseteq \{ \varnothing \} 。$

(e) $\{ a \} \in \{ a , \{ a \} \}   .$ 0

(f) $\{ a \} { \subseteq } \{ a ,   \{ a \} \}   .$ 0

1.4 设a、b、c、d代表不同的元素，指出以下集合A和B之间具有何种关系（即A⊂B、B⊂A、A=B、AB且BA 且A≠B等)。

(a) $A = \{ \{ a , b \} ,   \{ c \} ,   \{ d \} \} ,   B = \{ \{ a , b \} ,   \{ c \} \} ,$

(b) $A = \{ \{ a , b \} , \{ b \} , \emptyset \} , B = \{ \{ b \} \}$ 0

(c) $A = \{ 1 \} , B = \{ \{ 1 \} \} 。$

(d) $A = \left\{ x \mid x \in \mathbb{N}, x^2 > 4 \right\} , \quad B = \left\{ x \mid x \in \mathbb{N}, x > 2 \right\}$

(e) $A = \left\{ x \mid x \in \mathbb{R}, x^2 + x - 2 = 0 \right\}, \quad B = \left\{ y \mid y \in \mathbb{Q}, y^2 + y - 2 = 0 \right\}$

(f) $A = \left\{ x \mid x \in \mathbb{R}, x^2 \leq 2 \right\}, \quad B = \left\{ x \mid x \in \mathbb{R}, 2x^3 - 5x^2 + 4x = 1 \right\}$ o

1.5 设A表示一年级大学生的集合，B表示二年级大学生的集合，S表示软件工程专业学生的集合，C表示计算机科学技术专业学生的集合，D表示听离散数学课的学生的集合，M表示星期一晚上参加音乐会的学生的集合，T表示星期一白天有考试的学生的集合。下列各句子所对应的集合表达式分别是什么？

（a）所有计算机科学技术专业在学离散数学课的二年级学生。

(b）学离散数学课的、或者星期一晚上去听音乐会的、或者星期一白天有考试的学生。

（c）软件工程专业和计算机科学技术专业以外的、星期一晚上去听音乐会的二年级学生。

（d）星期一晚上去听音乐会但是星期一白天没有考试的学生。

1.6 画出下列集合的维恩图，并用阴影标记给出的集合。

(a) ${ \overline { { A } } } \bigcap { \overline { { B } } } \; .$

(b) $A \cup B { - } C _ { \circ }$

(c) $( A { \oplus } B ) \cup C \text{。 }$

(d) $( A \cup B ) \cap { \overline { { C } } }$ 0

(e) $\overline { { A \bigcap B \bigcap C } }$ 0

(f) ${ \mathcal { A } } \cup ( B \cap C ) \text { 。 }$

1.7 设 U={a, b, c, d, e}，A={d, e}，B={a, c}，C={b, d}，计算下列各式。

(a) $A \bigcap C .$ 0

[page:30]

## 离散数学及应用（第2版）

(b) $A \bigcap { \overline { { C } } } \; \mathrm {  。  }$

(c) $( A \cup B ) \cap { \overline { { C } } }$

(d) $( A \cup B ) \cap ( A \cup C )$ 0

(e) $A \oplus C \text {  。  }$

(f) A-C。

1.8 计算 $\mathcal { \vec { P } } ( \{ \varnothing \} ) , \mathcal { \vec { P } } ( \mathcal { \vec { P } } ( \varnothing ) ) , \mathcal { \vec { P } } ( \{ 1 , 2 \} ) , \mathcal { \vec { P } } ( \{ 1 , \{ 2 \} \} ) .$

1.9 设 U={1, 2, 3, 4, 5, 6}，A={1, 4}，B={1, 2, 5}，C={2, 4}，求下列集合。(a) $A \bigcap { \overline { { B } } } _ { \mathrm { ~ o ~ } }$ (b) $( A \bigcap B ) \bigcup { \overline { { C } } } .$ (c) ${ \overline { { A \bigcap B } } } \; \circ$ (d) $\mathcal { \bar { A } } ( A ) \cap \mathcal { \bar { A } } ( B ) \text { 。 }$ (e) $\mathcal { \bar { A } } ( A ) - \mathcal { \bar { A } } ( B ) \circ$

1.10 设[0,1]和(0,1)分别表示实数集上的闭区间和开区间，判断下述陈述是否成立。(a) $\{ 0 , 1 \} { \subseteq } ( 0 , 1 ) \text { 。 }$ (b) $\{ 0 , 1 \} { \subseteq } [ 0 , 1 ] \mathrm {  。  }$ (c) $(0,1) \subseteq [0,1] 。$

1.11 设[a, b]和(a, b)分别表示实数集上的闭区间和开区间，计算([0,4]∩[2, 5])-(1, 3)。

1.12 假设X、Y、Z为任意集合，且X⊕Y={1,2,3},X⊕Z={2,4}，若2∈Y,则一定有__∈Z。

1.13 设A、B、C为任意集合，证明:

(a) $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$

(b) $A \cup (A \cap B) = A, A \cap (A \cup B) = A$

(c) $A - B = A - (A \cap B)$

(d) $A = (A - B) \cup (A \cap B)$

(e) $(A - B) \cap (A \cap B) = \varnothing$

(f) $A \cup B = (A - B) \cup B$

(g) $(A - B) \cap B = \varnothing$

(h) $A \cap ( B - C ) = ( A \cap B ) - C$

(i) $A \oplus ( B \oplus C ) = ( A \oplus B ) \oplus C \text{。 }$

(j) $A \oplus B = (A \cup B) - (A \cap B)$

(k) $(A-B)-C=(A-C)-(B-C)=(A-C)-B=A-(B\cup C)$

(1) $(A - B) - C \subseteq A - (B - C)$

(m) $(A - B) - C \subseteq (A - B) \cup (B - C)$

(n) $A \cap \left( B \cup \overline{A} \right) = A \cap B , \quad A \cup \left( B \cap \overline{A} \right) = A \cup B .$ 0

1.14 设A、B、C、D是集合，A⊆C，B⊆D，证明以下结论。

(a) ${ \overline { { C } } } \subseteq { \overline { { A } } }   .$ 0

(b) $A \cap B { \subseteq } C \cap D \text { 。 }$

(c) $A \cup B { \subseteq } C \cup D \text { 。 }$

[page:31]

## 第1章 基础知识

(d) $A - D \subseteq C - B$

1.15 设A、B、C、D是集合， $A \subseteq C, B \subseteq D$ ，证明或反驳 $A \oplus B \subseteq C \oplus D$

1.16 设A、B、C、D是集合， $A \subset C , B \subset D$ ，证明或反驳以下结论。

(a) $A \cap B { \subset } C \cap D \text { 。 }$

(b) $A \cup B { \subset } C \cup D \text { 。 }$

1.17 设U是全集，X、Y是U的子集，证明:如果对于一切集合X都有 $X \cup Y { \subseteq } X ,$ 则Y=∅。

1.18 设A、B是集合，下述各式在什么条件下成立？证明你的结论。

(a) $A - B = A$

(b) $A - B = B$

(c) $A - B = B - A$

(d) $AB = A$

(e) $A \oplus B = \varnothing$

1.19 设U是全集，A、B、C是U的子集，下述各式在什么条件下成立？证明你的结论。

(a) $(A - B) \cup (A - C) = A$

(b) $(A - B) \cup (A - C) = \varnothing$

(c) $(A - B) \cap (A - C) = A$

(d) $(A - B) \cap (A - C) = \varnothing$

(e) $(A - B) \oplus (A - C) = A$

(f) $(A - B) \oplus (A - C) = \varnothing$

(g) $(A - B) \cup (B - A) = A \cup B$

(h) $(A - B) \cup (B - A) = A$

(i) $(A - B) \cup B = (A - B) - B$

1.20 设U是全集，A、B、C是U的子集，判断下列陈述的真伪。若为真，请给出证明；若为假，请给出反例。

(a）若 $A \cup B = A \cup C,$ 则 $B {=} C 。$

(b）若 $A \cap B = A \cap C,$ 则 $B {=} C 。$

(c）若 $A - B = \varnothing ,$ 则 $A { = } B { \mathrm {  。  } }$

（d）若 $A \cup B = A ,$ 则 $B { = } \varnothing 。$

(e）若 $\overline { { A } }   \cup   B   =   U$ ，则 $A { \subseteq } B \circ$

1.21 设A、B、C为任意集合，以下结论是否成立？如成立，证明你的结论；如不成立，请给出反例。

(a) $A \cap ( B \oplus C ) = ( A \cap B ) \oplus ( A \cap C ) \text { 。 }$

(b) $A \cup ( B \oplus C ) = ( A \cup B ) \oplus ( A \cup C ) \text { 。 }$

(c) $\mathcal{P}(A) \cap \mathcal{P}(B) = \mathcal{P}(A \cap B)$

(d) $\mathcal{P}(A) \cup \mathcal{P}(B) = \mathcal{P}(A \cup B)$

1.22 设A、B为任意集合，证明: ${ \overline { { A } } } = B$ 当且仅当 $A \cup B = U$ 且 $A \cap B = \varnothing$

1.23 设A、B、C为任意集合，证明以下陈述等价。

[page:32]

## 32

(a) $A { \subseteq } B \circ$

(b) $A – B { \subseteq } { \overline { { A } } } \; .$

(c) $A - \overline{B} = A$ 0

(d) $A \cap C \subseteq B \cap C$ 且 $A \bigcap { \overline { { C } } } \subseteq B \bigcap { \overline { { C } } }$ 0

1.24 假设A、B是集合，A⊕B=A，说明集合A、B之间有什么关系。

1.25 设A、B为任意集合，U为全集，证明以下陈述等价。(a) $A \cup B = U$ (b) ${ \overline { { A } } } \subseteq B   \circ$ (c) ${ \overline { { B } } } \subseteq A   \mathrm {  。   }$

1.26 设A、B、C为任意集合，证明以下陈述等价。(a) $A { = } B { \mathrm {  。  } }$ (b) $A \cup B = A \cap B$ (c) $A \oplus C = B \oplus C$ (d) $A \oplus B = \varnothing 。$ (e) $A \cup C = B \cup C$ 且 $A \cap C = B \cap C \circ$ (f) $A \cap C = B \cap C$ 且 $A \cap \overline{C} = B \cap \overline{C}$ 0

1.27 设A、B、C为任意集合，证明:C⊆A当且仅当A∩(B∪C)=(A∩B)∪C。

1.28 设集合 A={ab, bc, bb}，判断以下各字符串是否属于A*。(a) $a b a b a b  。$ (b) $a b c  。$ (c) $a b b a   \text{。 }$（d） abbcbaba。(e) $b c a b b a b  。$ (f) abbbcba。

1.29 判断下述陈述的真伪:7|13， -5|-15，0|2，2|0。

1.30 设 m、n都是正奇数，m>n，且 n不能整除 m，证明:存在正偶数 k和奇数r使得m=kn+r(0<r<n)或 $m = kn - r (0 < r < n)$ 0

1.31 证明: $7 | 2 2 2 2 ^ { 5 5 5 5 } + 5 5 5 5 ^ { 2 2 2 2 } \text{。 }$

1.32 设 a、b 是整数，证明: $11|a^{2}+5b^{2}$ 当且仅当11|a且11|b。

1.33 证明:对任意的整数n，有

(a) $6|n(n + 1)(n + 2)$

(b) $\frac{1}{5}n^{5}+\frac{1}{3}n^{3}+\frac{7}{15}n$ 是整数。

1.34 当正整数 m满足什么条件时， $1+2+\cdots+(m-1)+m\equiv0(\bmod\ m)$ 一定成立？（不要计算左边的和式。)

1.35 当正整数 m满足什么条件时， $1^{3}+2^{3}+\cdots+(m-1)^{3}+m^{3}\equiv0\pmod{m}$ 一定成立？（不要计算左边的和式。)

[page:33]

## 第1章 基础知识

1.36 证明:如果整系数方程 $a_{0}x^{n} + a_{1}x^{n - 1} + \cdots + a_{n - 1}x^{1} + a_{n} = 0$ 有非零整数解u，则 $u | a _ { n }$

1.37判断下述方程是否有整数解。若有整数解，试求出所有的整数解。

(a) $x^{2}-x+1=0$

(b) $x^{3}+x^{2}-4x-4=0$

(c) $x^{4}+5x^{3}-2x^{2}+7x+2=0$

1.38 给出 54 的全部因子。

1.39 对下述每一对数做带余除法，第一个数是被除数，第二个数是除数。(a) 78,19;（b) −1001, -13; (c) −14, 5; (d) 365, −7。

1.40 判断下述各正整数是素数还是合数: $113, 2^{8}-1, 221$ 0

1.41证明: $a { \geq } 1$ 是合数当且仅当存在等式 $a = b c$ ，其中 $1 < b < a, 1 < c < a$

1.42 设 p 是素数，a、b 是整数，且有 $p | a b$ ，证明: $p | \alpha$ 或 $p | b   \mathrm { { _ \circ } }$

1.43 设整数a、b互素，c是整数，证明:若 $a | b c$ ，则 $a | c _ { \circ }$

1.44 假设a、b、c、d均为正整数，下述各陈述是否为真？若为真，请给出证明；否则，请给出反例。

（a）若a|c，b|c，则 $a b | c _ { \circ }$

(b）若 a|c， $b | d ,$ 则 $ab|cd 。$

(c）若 $a b | c ,$ ，则 $a | c _ { \circ }$

(d) 若 $a | b c$ ，则 $a | c$ 或 $b | c _ { \mathrm { ~ c ~ } }$ 8

1.45 设 a是整数，p 是a的除1 以外最小的正因子，证明:p 是素数而且 $p   \leqslant   \sqrt { a }$

1.46 利用因子分解，计算下述每一对数的最大公约数和最小公倍数。(a)175, 140。(b）72, 180。(c)315,210。

1.47 求满足 $\mathrm{GCD}(a,   b) = 8$ 且 $\mathrm{LCM}(a, b) = 64$ 的所有整数 a、b。

1.48 求满足 GCD(a, b)=12 且 $\mathrm{LCM}(a, b)=72$ 的所有正整数对 $$a  、  b  。  $$

1.49 证明定理1.12。

1.50 设p是素数，a是整数，证明:当 p|a时， $\operatorname { G C D } ( p , a ) { = } p ;$ ；否则， $\operatorname { G C D } ( p , a ) { = } 1$

1.51 设p 是素数，a、b 都是非零整数，证明: $a / \mathrm { G C D } ( a ,   b )$ 与 $b / \mathrm { G C D } ( a ,   b )$ 互素。

1.52 设整数 a、b 互素，证明:

（a）对任意的整数m，有 $\operatorname { G C D } ( m , a b ) { = } \operatorname { G C D } ( m , a ) \operatorname { G C D } ( m , b )$

(b）当 $d { > } 0$ 时， $d | a b$ 当且仅当存在正整数 $d _ { 1 }  、  d _ { 2 } ,$ ，使得 $d = d _ { 1 } d _ { 2 } , d _ { 1 } | a , d _ { 2 } | b$ ，且 $d$的这种表示是唯一的。

1.53 假设a、b、d、m都是整数，证明:

（a）若 $a | m , b | m$ ，则 $\mathrm { L C M } ( a ,   b ) | m$

（b）若 $d | a , d | b$ ，则 $d | \mathrm { G C D } ( a ,   b )$ 0

1.54 求一切形如 $7 ^ { n + 2 } + 8 ^ { 2 n + 1 }$ 的数的最大公约数，其中n是非负整数。

1.55 设 m、n都是正整数，且 m与 n 互素，证明: $\mathrm{GCD}(2^{m}-1,2^{n}-1)=1$ 。并在相同条件

[page:34]

## 34

下考虑求 $\operatorname { G C D } ( a ^ { m } { - } 1 , a ^ { n } { - } 1 )$ 的值，这里α是任意整数。

1.56 用欧几里得算法求下述每一对数的最大公约数。

(a)85,125; (b)231,72; (c)45,56; （d)154, 64。

1.57 下述每一对数 a、b 是否互素？若互素，求整数 x、y 使得 xa+yb=1。

(a)24,35; （b)63,91; （c)450,539; （d)1024,729。

1.58 （a）使用欧几里得算法计算GCD(2009,1394)。

（b）计算s、t使得 2009s+1394t=GCD(2009, 1394)成立。

（c）计算LCM(2009, 1394)。

1.59 假设对于不全为 0的整数 a、b和 d，方程 sa+tb=d存在（一组）整数解s和 t。证明:值 s mod (b/GCD(a, b))和值 t mod (a/GCD(a, b))都是唯一的。即若有 $s_{1}a + t_{1}b = d$及 $s_{2}a + t_{2}b = d,$ 则有 $s_{1} \equiv s_{2}(\bmod b/\mathrm{GCD}(a,   b))$ 和值 $t_{1} \equiv t_{2}(\bmod a/ GCD (a, b))$

1.60 判断下述命题是否为真。

(a)758=246(mod 18)。

(b) 365=–3(mod 18)。

(c)−29≡1(mod 5)。

(d) 352=0(mod 11)。

1.61 给出使得下述同余式成立且大于1的正整数m。

(a) $35 \equiv 14(\bmod{m})$

(b) $10 \equiv -2(\bmod m)$

(c) $14^{2} \equiv 16^{2} \pmod{m}$

(d) −9=-30(mod m)且. 27≡1(mod m)。

1.62 证明定理 1.14。

1.63以下陈述是否成立？若成立，试证明之；若不成立，请举出反例。

(a）若 $a \equiv b(\bmod m),$ ，则 $a^{2} \equiv b^{2} \pmod{m}.$ 0

（b）若 $a^{2} \equiv b^{2}(\bmod m)$ ，则 $a \equiv b(\bmod m)$ 0

(c）若 $a^{2} \equiv b^{2} \pmod{m^{2}}$ ，则 $a \equiv b(\bmod m)$ 0

(d）若 a=b(mod mn)，则 $a \equiv b (\bmod m).$ 且 a≡b(mod n)。

(e)）若 a≡b(mod m)且 a≡b(mod n)，则 a≡b(mod mn)。

1.64 假设a、b、c、d、m均为整数，证明:

（a）若 m≠0，则 a|b当且仅当 ma|mb。

(b)若 a|c, b|c 且 a与 b 互素，则 ab|c。

(c）若a|b 且 $b \not = 0 ,$ 则 $| a | { \leqslant } | b |   .$

(d)若 $d \geqslant 1, d \left| m, a \equiv b \left( \bmod m \right) \right.$ ，则 $a \equiv b(\bmod d)$ 0

（e）若c、m互素，则 $a \equiv b(\bmod m)$ 当且仅当 $c a \equiv c b ( \bmod m )$ 0

（f)当d不是素数时，d|ab 不一定能得到d|a或 $d | b   \mathrm { { } _ { \circ } }$

(g）若 m>1，ca≡cb(mod m), $d = \mathrm{GCD}(m, c)$ ，则 $a \equiv b (\bmod m/d)$

（h）若 $d { \geqslant } 1$ ，则 $a \equiv b(\bmod m)$ 当且仅当 da=db(mod dm)。

1.65 设f(x)是整系数多项式，p是素数，证明: $(f(x))^p \equiv f(x^p) \pmod{p}$

[page:35]

## 第1章 基础知识

1.66 假设正整数 x、y、z 满足 $x^{2}+y^{2}=z^{2}$ ，且 $\mathrm{GCD}(x,y)=1$ 0

(a）证明:x和y必定是一奇一偶（以下不妨假定y是偶数）。

（b）证明:GCD(x,z)=1， $\mathrm{GCD}\left(\frac{z + x}{2}, \frac{z - x}{2}\right) = 1$

（c）证明:存在整数a和b，使得 $\frac{z + x}{2} = a^{2}, \quad \frac{z - x}{2} = b^{2}$ 。于是所有正整数解可以表示为 $x=a^{2}-b^{2}, \quad y=2ab, \quad z=a^{2}+b^{2}$

1.67 两个势均力敌的乒乓球选手甲和乙进行5局3胜制的比赛，比赛一共有多少种可能情形？

1.68 由1,2,3,4这4个数字能构成多少个大于 230的三位数？

1.69 计算机系统的每个用户有一个6～8个字符组成的密码，其中每个字符是一个大写字母或者数字，且每个密码必须包含一个数字。有多少种可能的密码？

1.70 试证一个整数是另一个整数的平方当且仅当它的正因子数目为奇数。

1.71 重新排列13 979 397 中的数字可以组成多少个大于 50 000 000 的数？

1.72 8粒颜色不同的宝石串成一个项圈，一共有多少种不同的串法？

1.73 n名男生和 n名女生排成一个男女相间的队伍，有多少种不同的方案？若围成一个圆桌坐下，又有多少种不同的方案？

1.74 用数字1 和 2 写成十位数，其中至少有连续5 位都是数字1，这样的十位数有多少个？

1.75 由单词 ASSOCIATIVE 中的字母可组成多少个不同的字符串？

1.76 把12个孩子分为3组玩不同的游戏，有多少种不同的分组方式？

1.77 从整数1,2,…,50中选出两个不同的数，共有多少种方法？若要求这两个数之和是偶数，共有多少种方法？若要求其和为奇数，共有多少种方法？

1.78 从整数1,2,…,1000中选出3个不同的数使得其和是4的倍数，共有多少种方法？

1.79 甲和乙两单位共11人，其中甲单位7人，乙单位4人，拟从中组成一个5人小组，若要求:（a）必须包含乙单位2人，或（b）至少包含乙单位2人，或（c）乙单位某一人与甲单位某一人不能同时在这个小组，试分别求各有多少种方案。

1.80 设n、r为正整数，证明:(a) $\mathrm{C}(n, r) = \frac{n}{r} \mathrm{C}(n - 1, r - 1)$ (b) $C(n,r)=C(n-1,r-1)+C(n-1,r)$

1.81 在8×8的棋盘的方格内放置5个0和3个1，如果没有两个数字被放在同一行，也没有两个数字被放在同一列，请计算方法数。

1.82 设N是正整数。证明:将N允许重复地有序拆分成r个正整数的和的方案（即将N写作 $a_{1}x_{1} + a_{2}x_{2} + \cdots + a_{n}x_{n} = N,$ ，其中 $x _ { i } { \geq } 1$ ，所谓“有序”是指3=1+2和3=2+1视为不同的方案）数为 C(N-1,r-1)。

(提示:令 $s_{i} = \sum_{k = 1}^{i} a_{k} , i = 1, 2, \cdots, r$ ，则 $0 < s_{1} < s_{2} < \cdots < s_{r} = N$ ，考虑 $S _ { i }$ 的取值可能。)

[page:36]

## 36

1.83 凸10边形的任意3个对角线不共点，试求该凸10边形的对角线交于多少个点？

1.84圆周上有n（n≥6）个点，每两个点之间作线段，假设其中任意3条线段在圆内无公共点，求以这些线段确定的交点组成顶点、以这些线段的一部分作为边的三角形的个数。

1.85 证明:对正整数N做任何重复的有序拆分，方案数为 $\sum_{r = 1}^{N} C(N - 1, r - 1) = 2^{N - 1}$

1.86 有10种不同的CD，从中选取5张（允许从同一种CD中选取多张），有多少种不同的选取方法？

1.87 假设有5种小说，有6种科技书，从中选取3本小说和4本科技书，分别计算满足如下要求的不同的选书方法数。

（a）可以选择相同种类的书，而且考虑选书的次序。

(b）可以选择相同种类的书，但不考虑选书的次序。

（c）不可以选择相同种类的书，但是要考虑选书的次序。

（d）不可以选择相同种类的书，且不考虑选书的次序。

1.88 试求n个完全一样的骰子能掷出多少种不同的方案。

1.89 假设 n是正整数，求{1,2,…, n}到{1,2, …, n}的单调不减函数的个数。

1.90 从 S={1,2, …, n}中选择 k 个不相邻的数，有多少种方法？

1.91 书架上有24卷百科全书，从其中任选5卷使得任何两卷都不相邻，这样的选法有多少种？

1.92 有 m个A和n个B构成序列（m≤n)，如果要求每个A后面都至少跟着一个B，可以组成多少个不同的序列？

1.93 10个男孩和5个女孩站成一排，若没有女孩相邻，有多少种方法？如果站成一个圆圈，有多少种方法？

1.94 由5个a、1个b、1个c、1个d和 1个e组成一个序列。

（a）计算没有两个a相邻的序列个数。

（b）计算b、c、d、e中的任何两个字母都不相邻的序列个数。

1.95 在n+1个小于或等于2n的不相等的正整数中，一定存在两个数是互素的。（提示:任意两个相邻的正整数是互素的。)

1.96（a）从一副标准的52张牌中必须选多少张牌才能保证选出的牌中至少有3张是同样花色的？（b）必须选出多少张牌才能保证选出的牌中至少有3张是红心？

1.97 证明:在边长为2的正方形中选取5个点，则其中必定有两个点之间的距离不超过 $\sqrt { 2 }$ o

1.98 证明:在边长为 2 的正三角形中选取5 个点，则其中必定有两个点之间的距离不超过1。

1.99 设n是正整数。证明:在任意一组n个连续的正整数中恰好有一个能被n整除。

1.100 设 $a_{1} 、 a_{2} 、 a_{3}$ 为任意3个整数， $b_{1} 、 b_{2} 、 b_{3}$ 为 $a_{1} 、 a_{2} 、 a_{3}$ 的任一排列，则 $a _ { 1 } – b _ { 1 }$ $a _ { 2 } – b _ { 2 }  、 a _ { 3 } – b _ { 3 }$ 中至少有一个是偶数。

[page:37]

## 第1章 基础知识

1.101 证明:从 1 到 2n 中任取 n+1 个正整数，则这 n+1 个数中至少有一对数，其中一个是另一个的倍数。

1.102 证明:任取 7 个不同的正整数，其中至少存在两个整数 a和 b，使得 a-b 或 $a { + } b$能被10整除。

1.103 设 $a _ { 1 } , a _ { 2 } , \cdots , a _ { m }$ 是正整数序列，证明:存在k和 $l, 1 \leqslant k \leqslant l \leqslant m$ ，使得 $a_{k}+a_{k+1}+\cdots+a_{l}$是 m的倍数。

1.104 已知一个集合由任意10个两两不同的十进制两位正整数组成。证明:这个集合中有两个不相交的子集，其元素之和相等。

1.105 证明:在边长为1的正方形中选取9个点，则其中必定有3个点组成的三角形的面积不超过1/8。

1.106 在一个3行7列的方格表中，给每一个小方格涂上黑色或白色，能否使方格表中任意一个矩形的4个角上都不是相同的颜色？

1.107 某学生有37天的时间准备考试。根据他过去的经验至多需要复习60小时，但每天至少要复习1小时。证明:无论怎样安排，都存在连续的若干天，使得他在这些天里恰好复习了12个小时。

1.108 把100台计算机连接到20台打印机上，为保证任意20台计算机都可以直接访问20台不同的打印机，找出至少需要多少条缆线。证明你的答案。

1.109 假设A、B为有限集合，证明:(a) $| A - B | \geqslant | A | - | B |$ (b) $| A \oplus B | = | A | + | B | - 2 | A \cap B | 。$

1.110 设一个班里有50个学生，在第一次考试中有26人得到A，在第二次考试中有21人得到A，如果两次考试中都没有得到A的学生是17人，那么有多少学生在两次考试中都得到A？

1.111 在1~10000中（包括1和10000）既不是某个整数的平方也不是某个整数的立方的数有多少个？是某个整数的平方但不是某个整数的立方的数有多少个？

1.112 3只蓝球、2只红球、2只黄球排成一排，若黄球不相邻，红球也不相邻，则有多少种方法？

1.113 某班有65名学生，其中养猫的有24人，养鱼的有25人，养狗的有26人，同时养猫和养鱼的有9人，同时养猫和养狗的有8人，同时养鱼和养狗的有10人，还有10人什么宠物也不养，求同时养3种宠物的人数。

1.114 在1~500中（包括1和500）不能被2、3和5整除的数有多少个？

1.115 假设 $|A|=44,\ |B|=50,\ |C|=51,\ |D|=56,\ |A\cap B|=18,\ |A\cap C|=23,\ |A\cap D|=19,\ |B\cap C|=20,$ $|B \cap D| = 25,\quad |C \cap D| = 32,\quad |A \cap B \cap C| = 8,\quad |A \cap B \cap D| = 7,\quad |A \cap C \cap D| = 11,\quad |B \cap C \cap D| = 10$ $| A \cap B \cap C \cap D | = 1$ ，计算 $| A \cup B \cup C \cup D | \text{。 }$

1.116 使用容斥原理求不超过120的素数个数。

1.117 对于图1.16，给每个顶点分配k种颜色中的一种。使相邻顶点的颜色互不相同的分配方式有多少种？

[page:38]

## 离散数学及应用（第2版）

1.118 设S为包含m个元素的集合，n是一个正整数， $n   \geq   m .$ 。从 S 中选出n个元素组成序列，其中，S的每个元素至少出现一次。证明:这样的排列的数目是

$$C(m,0)(m-0)^n-C(m,1)(m-1)^n+\cdots+(-1)^{(m-1)}C(m,m-1)(1)^n$$

1.119 n 对夫妇坐在摆成一排的 $2 n$ 把椅子上，如果每位丈夫都和他的妻子不相邻，那么有多少种不同的坐法？

1.120一个楼梯有n级，每次可以跨上1级或3级。从楼梯的最底端登到最顶端的不同的方法数满足什么样的递推关系？

1.121有n根火柴，甲、乙二人轮流取，每次只能取一根或两根。若甲先取，最后还由甲取光的方案数为 $a _ { n } \mathrm { { } _ { \circ } }$ 求出 $a _ { n }$ 的初始条件以及递推关系。

1.122 秋天到了，n只猴子采摘了一大堆苹果放到山洞里。第一只猴子悄悄来到山洞，把苹果平均分成n份，把剩下的 $m \quad (0 < m < n)$ 个苹果吃了，然后藏起来一份，最后把剩下的苹果重新合在一起。其余的猴子依次悄悄来到山洞，都做同样的操作，恰好每次都剩下了m个苹果。建立每只猴子来之前和来之后的苹果数目的递推关系。

1.123 使用倒推法求解递推关系。(a) $a_{1}=2,\ a_{n}=3a_{n-1}+1$ (b) $a_{1}=1,\ a_{n}=a_{n-1}+2n-1$ (c) $a_{1}=s,\ a_{n}=r \times a_{n-1}+t$ (d) $a_{0}=0,\quad a_{n}=na_{n-1}+n!(n\geqslant1).$ (e) $a_{0}=2,\quad a_{n}^{2}=2a_{n-1}^{2}+1(n\geqslant1).$

1.124 求解递推关系。

(a) $a_{n} - 7a_{n - 1} + 12a_{n - 2} = 0 \quad , \quad a_{0} = 4, a_{1} = 6$ (b) $\begin{cases}a_{n} + a_{n - 2} = 0 \\a_{0} = 0, a_{1} = 2\end{cases}$ (c) $a_{n}-4a_{n-1}+4a_{n-2}=0, \quad a_{0}=0,a_{1}=1$

1.125（a）求与包含两个连续0的n位二进位串的个数有关的递推关系。

（b）初始条件是什么？

（c）包含两个连续0的7位二进位串有多少个？

[page:39]

## 第1章 基础知识

1.126（a）求与不包含连续的相同符号的n位三进位串的个数有关的递推关系。

（b）初始条件是什么？

（c）不包含连续的相同符号的6位三进位串有多少个？

1.127 包含偶数个0的7位二进位串有多少个？

1.128一个1×n的方格图形用黑白两色为每个方格涂色，每个方格只能涂一种颜色，但是不允许任何两个黑色方格相邻，一共有多少种涂色方案？

1.129 用 a、b 和 c这 3 个符号组成长度是n的符号串，要求没有两个 a相连，有多少个满足要求的符号串？

1.130 某公司有n千万元可以用于对a、b、c3个项目投资。假设每年投资一个项目，投资的规则是:或者对a投资1千万元，或者对b投资2千万元，或者对c投资2千万元。问用完n千万元有多少种不同的方案？

1.131 设有n条直线，两两相交于一点，任意3条直线不相交于一点。这样的n条直线把平面分割成几个部分？

1.132 设有n条封闭的曲线，两两相交于两点，任意3条封闭曲线不相交于一点。这样的n条曲线把平面分割成几个部分？

1.133 使用3个不同字符在通信信道进行信息传输，如果传送字符A需要2μs，传送字符B和字符C都各需要1μs，一个信息是用字符A、B或C构成的有限长度的字符串（不考虑空串），在n微秒内可以传送多少种不同的信息？

1.134 在一个核反应堆中有两类粒子:α粒子和β粒子。每经过1个单位时间，1个α粒子分裂为3个β粒子，1个β粒子分裂为1个α粒子和2个β粒子。假设在时间0，反应堆里只有1个α粒子，那么在时刻100反应堆里总共有多少个粒子？

1.135 有10个箱子，编号为1,2,,10，各有一把锁和一把钥匙，10把锁各不相同，每个箱子放入一把钥匙后锁好。现在撬开1号箱子和2号箱子，取出钥匙去开别的箱子，再取出钥匙继续去开其他箱子。如果能够按这样的方式打开所有的箱子，则称其是一种好的放钥匙方法，求好的放钥匙方法种数。

1.136 有10个箱子，编号为1,2,…,10，各有一把锁和一把钥匙，10把锁各不相同，每个箱子放入一把钥匙后锁好。现在撬开1号箱子，取出钥匙去开别的箱子，再取出钥匙继续去开其他箱子。如果能够按这样的方式打开所有的箱子，则称其是一种很好的放钥匙方法，求很好的放钥匙方法种数。

1.137 m（m≥2）个人互相传球，接球后就传给别人。由甲开始发球，并把它当做第1次传球。球经过n次传球后，球仍回到甲手中的传球方式种数。（提示: $S_{n}+S_{n-1}=(m-1)^{n-1}$ 。)

1.138 对一个自然数作如下操作:如果是偶数则除以2，如果是奇数则加1，如此进行下去，直到得数为1时操作停止。经过9次操作变为1的数有多少个？

1.139 A={1, 2， …，n}，其中 n 为给定正整数。设 S⊆A，且 S 的每个元素都不小于 S的基数|S，则称S是饱满的（空集也是饱满的）。计算A的饱满子集的个数。（提示:将饱满子集S分为两种情况分别计数—n∉S及n∈S，后者除去n后每个元素可以减去1。)

[page:40]

## 离散数学及应用（第2版）

1.140 假设m、n是正整数，设 $f _ { n }$ 是斐波那契数，证明对于斐波那契数有

(a) $f_{m+n}=f_{m}f_{n-1}+f_{m+1}f_{n}$

(b) $f_{n - 1}^{2} + f_{n}^{2} = f_{2n - 1}$

(c) $f_{n}f_{n + 1} - f_{n - 1}f_{n - 2} = f_{2n - 1}$

(d) $f_{n}f_{n + 2} - f_{n + 1}^{2} = \pm 1$ 0

(e) $f_{2n+2}-(f_1+f_3+\cdots+f_{2n+1})=0$ 0

1.141 新年时5名好朋友每人都写一张贺年卡互相赠送，自己写的贺年卡不能送给自己，那么有多少种赠送方法？

1.142 小明给n个朋友写信，邀请他们来家中聚会，如果恰有m封请柬装错了信封，请问有几种这样装信封的情况？

1.143证明:

（a）D(n)是偶数当且仅当n是奇数。

(b) $D(n)=nD(n-1)+(-1)^{n}$

(c) $n ! = \sum_{i = 0}^{n} \binom{n}{i} D(n - i)$ ，这里定义 $D ( 0 ) { = } 1$ 0

1.144 对于给定的布尔矩阵A、B，计算 $A \lor B, A \land B, A \odot B$

(a) $\boldsymbol{A} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}, \boldsymbol{B} = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}.$

(b) $\boldsymbol{A} = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}, \boldsymbol{B} = \begin{pmatrix} 0 & 0 \\ 1 & 1 \end{pmatrix}$ 0

(c) $\boldsymbol{A} = \begin{pmatrix}1 & 0 & 0 \\0 & 1 & 1 \\1 & 0 & 0\end{pmatrix}, \boldsymbol{B} = \begin{pmatrix}1 & 1 & 1 \\0 & 0 & 1 \\1 & 0 & 1\end{pmatrix} 。$

(d) $$\pmb { A } = \left( \begin{matrix} { 1 } & { 0 } & { 0 } \\ { 0 } & { 0 } & { 1 } \\ { 1 } & { 0 } & { 1 } \end{matrix} \right) , \pmb { B } = \left( \begin{matrix} { 1 } & { 1 } & { 1 } \\ { 1 } & { 1 } & { 1 } \\ { 1 } & { 0 } & { 0 } \end{matrix} \right) \mathrm {  。  }$$ C

1.145 证明定理 1.29。

[page:41]

# 第2章

## 命题逻辑

逻辑是关于思维形式的科学，所谓思维的逻辑形式是指不同的具体思维内容之间的共同的联系方式。

数理逻辑是用数学的方法研究思维的形式结构和规律的学科，它使用符号语言，按照一定的规则，简洁地表达出各种推理的逻辑关系，所以数理逻辑又称符号逻辑，它与计算机科学有着非常密切的联系，是计算机程序设计、人工智能、逻辑设计、机器证明、自动程序设计、计算机辅助设计等计算机理论和应用学科的基础。

命题逻辑是数理逻辑中最基础的内容，以命题为最基本的单位来研究思维的形式结构和规律。

本章主要介绍命题、命题联结符、命题公式、等值演算、范式、推理演算等命题逻辑中的基础问题。

## 2.1 命题逻辑的基本概念

数理逻辑的主要研究内容和目标是推理，所谓推理就是由某些前提推演出相应的结论，而这些前提和结论都应该是表达判断的并且有明确是非结论的陈述句，我们称之为命题。

定义2.1 非真即假的陈述句称为命题（proposition)）。一个命题如果是对的或正确的，则称为真命题，其真值为“真”（true)，常用T或1表示；一个命题如果是错的或不正确的，则称为假命题，其真值为“假”（false)，常用F或0表示。

注:

（a）命题必须是陈述句，而祈使句、疑问句、感叹句等都不是命题。

(b）命题必须有确定的、唯一的真值，但这并不意味着一定知道它的真值。

【例2.1】判断下列句子哪些是命题，哪些不是命题。

（a）这本书题为《离散数学及应用》。

（b）这本《离散数学及应用》写得好吗？

（c）这本《离散数学及应用》写得真好！

（d）请购买《离散数学及应用》。

(e) 5 是素数。

(f) x+3>5。

（g）太阳从西方升起。

[page:42]

## 42

（h）本命题是假的。

（i）本命题是真的。

（j）天王星上没有生命。

（k）如果明天晴，而且我有空，我就去踢球。

(1）不得不说如果不是因为他是不得已而为之而且没有造成恶劣后果的话我是不会原谅他的。

解.以上句子中，（b）、（c）、（d）不是命题，因为它们都不是陈述句；（f）的真值随x值的变化而不同，因而它不具有确定真值，不是命题；（h）的真值既非真也非假，因此它不是命题；而（i）既可能是真也可能是假，真值不能确定，因此它也不是命题。（a）、(e)、（g)、（j)、（k）和(l)都是命题。其中， $( \mathbf { g } )$ 是假命题；（j）的真值虽然目前还无法确定，但它的真值客观存在，而且是唯一的。

在本书中，使用小写英文字母 $p , q , r , \cdots$ 或带有下标的小写字母 $p _ { 1 } , p _ { 2 } , p _ { 3 } , \cdots$ 来表示命题，称为命题变元或命题变项（propositional variables)。

例如， $p ;$ 2+3=5, $q ;$ 北京是中国的首都， $p _ { 1 } ;$ ；π是无理数。

严格地讲，命题变项和命题是不同的。命题有具体的含义和确定的真值，而命题变项只有明确表示某个命题时才有具体的含义和确定的真值，命题变项一般只表示一个抽象的命题，其真值可能是T，也可能是F（类似于代数中a、b、c等符号与确定的具体值的关系)。但通常也简称命题变项为命题。

定义 2.2 不能再分解的命题称为简单命题（simple proposition）或原子命题（atom proposition).

例如，“π是无理数”“小李在图书馆”都是原子命题。原子命题的一般形式是“……是……”，如例2.1中的（a）、（e）和（g）。

但并非所有命题都是原子命题。

定义 2.3 由原子命题通过逻辑联结词组合而成的命题称为复合命题（compound proposition).

例如例2.1中的（j）、（k）和(1)都是复合命题。

将命题联结起来的方式叫做命题联结词（proposition connective）或命题运算符(proposition operator)，主要有以下6种。

定义 2.4 设 $p$ 为命题，否定词（negation）“~”是一元联结词， $- p$ 读作“非 $p ^ { \prime \prime }$或 $^ { \circ } p$ 的否定”。若 $p$ 的真值为真，则 $\neg p$ 的真值为假；反之，若 $p$ 的真值为假，则 $- p$ 的真值为真。

否定联结词的含义相当于自然语言中的“不”“没有”“无”“否定”“并非”“取反”等。

【例2.2】若用p表示命题“3是素数”，则 $- p$ 即为命题“3不是素数”。

定义 2.5 设 $p  、 q$ 为命题，合取词（conjunction）“ $\textstyle { \big ( } { \bigwedge } ^ { \star }$ 是二元联结词， $p \wedge q$ 读作$^ { \circ } p$ 与 $q ^ { \prime }$ 或 $\text{" }p 、 q$ 的合取”。当且仅当 $p  、 q$ 的真值均为真时， $p \wedge q$ 的真值为真。

合取联结词的含义相当于自然语言中的 $^ { \circ } p$ 和 ${ \textit { q } } ^ { \prime \prime }   ^ { \omega } p$ 与 ${q}^{\mathrm{''}} \; {}^{\mathrm{''}}p$ 且 ${q^{\prime}}^{\omega}p$ ，同时 ${q^{\prime}}^{\omega}p$并且 ${q^{\prime}}^{\omega}p$ 以及 ${ \textit { q } } ^ { \prime \prime }   { } ^ { \epsilon } p$ 而且 $q ^ { \prime \prime }$ “既 $p   ,$ ，又 ${q}^{\mathrm{\tiny{~{ 外 }~}}\mathrm{\tiny{~{ 终 }~}}}$ 不但 $p ,$ 而且 $q ^ { \prime \prime }$ “尽管 $p   ,$ 依然 $q ^ { \prime \prime }$ “虽然

[page:43]

## 第2章 命题逻辑

$p ,$ 但是 $q ^ { \prime \prime }$ 等。

【例2.3】若用 $p$ 表示命题“3是素数”， $q$ 表示命题“5是素数”，则 $^ { \circ } 3$ 和 5 都是素数”可以表示为 $p \wedge q .$

定义2.6 设p、q为命题，析取词（disjunction）“V”是二元联结词， $p \vee q$ 读作$^ { \circ } p$ 或 $q ^ { \prime }$ 或 $^ { \circ } p$ $q$ 的析取”。当且仅当 $p  、 q$ 的真值均为假时， $p \vee q$ 的真值为假。

析取联结词的含义相当于自然语言中的 $^ { \circ } p$ 或者 $q ^ { \prime \prime }$ “要么 $p _ { \cdot }$ ，要么 $q ^ { \prime \prime }$ “不是 $p$ ，就是 $q ^ { \prime \prime }$ 等。

【例2.4】析取联结词√与自然语言中的“或者”类似但又有所不同。例如:

（a）苗苗在看电视或者在吃饭。

（b）苗苗今天上午十时在清华大学或者在北京大学。

这两个命题都含有联结词“或者”，但这两个“或者”的逻辑含义是不同的。对于（a)，苗苗可以既在看电视又在吃饭；而对于（b），苗苗不可能在同一时间出现在不同地点。

通常称命题（a）中的“或者”为“可兼或”，命题（b）中的“或者”为“不可兼或”。自然语言中的“可兼或”与析取联结词∨相对应，而“不可兼或”与下面介绍的异或联结词相对应。

定义 2.7 设 $p _ { 1 }$ $q$ 为命题，异或词（exclusiveor）“⊕”是二元联结词， $p \oplus q$ 读作$^ { \circ } p$ 异或 $q ^ { \prime }$ 。当且仅当p、q的真值相同时，p⊕q的真值为假。异或也称不可兼或。

定义 2.8 设 $p _ { 1 }$ $q$ 为命题，蕴涵词（implication）“⇒”是二元联结词， $p { \Longrightarrow } q$ 读作“若 $p$ 则 $q ^ { \prime }$ 。当且仅当 $p$ 的真值为真、 $q$ 的真值为假时， $p { \Longrightarrow } q$ 的真值为假。 $p$ 称作前提(premise), $q$ 称作结论（conclusion）。

蕴涵联结词的含义相当于自然语言中的“如果 $p$ ，则 $q ^ { \prime \prime }$ “因为 $p   ,$ ，所以 ${q}^{\mathrm{~ 叩 ~ 纯 }}$ 只要 $p _ { \cdot }$ 2就 ${q}^{\mathrm{ 外 }\ \mathrm{ 绐 }}$ 只有 $q ,$ 才 $p^{ 外亿 }$ 仅当 $q _ { \cdot }$ ，则 $p \; '' \; '' p$ 是 $q$ 的充分条件 ${ } ^ { \prime \prime } { } ^ { \epsilon _ { q } }$ 是 $p$ 的必要条件”“既然 $p   ,$那么 $q ^ { \prime \prime }$ 等。

【例2.5】若用 $p$ 表示命题“今天晴”， $q$ 表示命题“苗苗去图书馆”，则“因为今天晴，所以苗苗去图书馆了”可以表示为 $p { \Longrightarrow } q .$ 0

【例2.6】若用 $p$ 表示命题“2+2=4”，q表示命题“北京是中国的首都”，则 $p { \Longrightarrow } q$表示“因为2+2=4，所以北京是中国的首都”。

虽然例 2.6 中的 $p  、 q$ 没有任何语义上的关系，但是命题 $p { \Longrightarrow } q$ 确实是真命题。这表明在逻辑语言中仅考虑命题与命题之间的形式关系或说是逻辑内容，联结词仅仅代表命题之间的形式关系，而不考虑命题内容的实际含义，更不顾及日常自然用语中是否有此说法。自然语言中的“如果，则 $p _ { \cdot }$ $q ^ { \prime \prime } ,   p$ 与 $q$ 之间常有语义上的因果关系，而条件复合命题 $p { \Longrightarrow } q$ 的 $p$ 与 $q$ 之间不一定有这种关系。

【例2.7】对于条件复合命题 $p { \Longrightarrow } q$ ，当 $p$ 为假时， $q$ 不论为真还是为假，蕴涵式的真值均为真。这可以用下面的例子来解释:“如果周五地震，那么下次课考试”。用 $p$ 表示“周五地震”， $q$ 表示“下次课考试”，则命题可符号化为 $p { \Longrightarrow } q$ 。从语义上讲，如果周五地震了，那么一定会考试的；但是周五没有地震的话，是否考试都不违反该承诺。

对于命题 $p { \Longrightarrow } q$ ，称命题 $q { \Longrightarrow } p$ 为其逆命题，命题 $- p { \Rightarrow } { \sim } q$ 为其否命题，命题 $- q { \Rightarrow } { \sim } p$ 为其逆否命题。

[page:44]

## 44

定义2.9 设 p, q为命题，等价词（equivalence)“⇔”是二元联结词，p⇔q 读作“p当且仅当 $q ^ { \prime }$ 或“p、q等价”。当且仅当p、q的真值相同时，p⇔q的真值为真。“等价”也称作“双条件”（biconditional）。

等价联结词的含义相当于自然语言中的“p，当且仅当q”“p是q的充分必要条件” “p、q含义相同”等。

【例2.8】用p表示“3是奇数”，q表示“太阳从东方升起”，则命题“3是奇数，当且仅当太阳从东方升起”可符号化为p⇔q。

同命题p⇒q一样，复合命题p⇔q的p和q之间在语义上也可以没有任何关系，而p⇔q的真值仅与p、q的真值相关。

把一个用自然语言表述的命题表示为由命题变项、联结词和圆括号表示的复合命题的形式，称为命题的符号化，这是进行推理演算的首要步骤。命题的符号化一般经过如下3个步骤:

（1）找出命题中各原子命题，将原子命题符号化。

（2）找出命题中各联结词，将联结词符号化。

（3）将原子命题和联结词组成一个复合命题。

## 【例2.9】把下列自然语言命题符号化:

（a）说这本书写得不好是不正确的。

（b）π和e都是无理数。

（c）俞伯牙和钟子期是好朋友。

（d）α属于集合A或者集合B。

（e）小李生于1978年或者1987年。

（f）只有在晴天，我才会去公园。

（g）只要是晴天，我就会去公园。

（h）n是奇数当且仅当 n²是奇数。

（i）小李是一名本科生，他的专业是数学或计算机。

（j）不得不说如果不是因为他是不得已而为之而且没有造成恶劣后果的话我是不会原谅他的。

(a）设p表示“这本书写得好”，则命题符号化为~(~p)。

(b）设p表示“π是无理数”，q表示“e是无理数”，则命题符号化为p∧q。

(c）这里出现的“和”并不表示合取关系，它并不是一个复合命题，而仍然是原子命题，因而只能形式化为p，p表示“俞伯牙和钟子期是好朋友”。

(d）设p表示“α属于集合A”，q表示“α属于集合B”，它们是可兼或，命题符号化为 $p \vee q 。$

(e）设p表示“小李生于1978年”，q表示“小李生于1987年”，它们是不可兼或，命题符号化为p⊕q。

(f)设p表示“天气晴”，q表示“我去公园”，则命题符号化为q⇒p；或者理解为“如果不是晴天我就一定不去公园”，这时命题符号化为~p⇒~q；这两者都是正确的。

[page:45]

## 第2章 命题逻辑

(g）设p表示“天气晴”，q表示“我去公园”，则命题符号化为 $p { \Longrightarrow } q$

(h）设p表示“n是奇数”，q表示 ${ } ^ { \ast }   n ^ { 2 }$ 是奇数”，则命题符号化为 $p { \leftrightarrow } q$

(i）设p表示“小李是一名本科生”，q表示“小李的专业是数学”，r表示“小李的专业是计算机”，则命题符号化为 $p \wedge ( q \vee r )$ ，各分句之间的关系是合取关系。

(j）设p表示“他这么做”，q表示“他造成了恶劣后果”，r表示“我原谅他”，则命题符号化为 ${ \scriptstyle { \sim \sim ( \sim ( \sim \sim p \land \sim q ) \Rightarrow \sim r ) } }$ 0

【例2.10】 把程序语句“IF P THEN Q ELSE $\mathbb { R } ^ { \bullet }$ 表达为复合命题。

解. 由题意，可表达为(P⇒Q)∧(~P⇒R)。

## 2.2 命题公式及其分类

复合命题是由命题变项、逻辑联结词和括号等符号组成的符号串；但反过来，由这些符号组成的符号串并不一定都是命题。

定义2.10 命题逻辑中的命题公式（well formed formula，简记为 wff）递归地定义为

（1）单个命题变项p, q, r，…是命题公式。

(2）如果A是命题公式，则(~A)也是命题公式。

（3）如果A和B是命题公式，则由逻辑联结词联结A和B的符号串也是命题公式，$如 (A \land B) 、 (A \lor B) 、 (A \rightarrow B) 、 (A \leftrightarrow B)^{3}$ 等。

（4）有限次应用（1）～（3）构成的符号串才是命题公式。

换言之，只有用命题公式表示的符号串才是命题。命题公式也称为合式公式，简称公式。

【例2.11】 $( \neg p )  、 ( \neg ( p \land q ) )  、 ( p \land ( q \lor ( \neg r ) ) )$ 都是命题公式；而 $(p \to (\land q)), p \to (\lor p \to r$都不是命题公式。

为简化公式的形式，作如下规定:

（1）各逻辑联结词中，~的优先级最高，其次为∧和√（二者优先级相同），⇒和↔的优先级最低（二者优先级相同），符合此次序时，括号可以省略。

(2)公式(~p)的括号可以省略，写成~p。

（3）整个公式最外层的括号可以省略。

【例 2.12】命题公式 $( ( ( p \land ( \lnot r ) ) { \Rightarrow } q ) { \Rightarrow } ( p \lor q ) )$ 的最后一个联结符是⇒。省去最外层括号，可以将其简化为 $( ( p \land ( \sim r ) ) { \Rightarrow } q ) { \Rightarrow } ( p \lor q )$ ；进而考虑命题联结词的优先级，可以简化为 $( p \land \lnot r \lnot q ) \lnot p \lor q$

定义2.11 设A为命题公式，B为A中的一个连续的符号串，且B为命题公式，则称 B 为A的子公式（sub formula）。

【例2.13】 $p \lor q , q \lor r , p \land ( q \lor r )$ 都是公式 $(p \lor q) \Rightarrow (p \land (q \lor r))$ 的子公式，而 $p \wedge ( q$ $q ) { \Rightarrow } ( p$ 都不是该公式的子公式，因为它们本身不是公式。

命题公式不是命题，只有当公式中的每一个命题变项都被赋以确定的真值时，公式的真值才被确定，从而成为一个命题

[page:46]

## 46

定义 2.12 如果一个命题公式 A 含有 n 个命题变项 $p _ { 1 } , \; p _ { 2 } , \; \cdots , \; p _ { n }$ ，则该公式称为n元命题公式。在一个n元命题公式中，对变项组 $( p _ { 1 } , p _ { 2 } , \cdots , p _ { n } )$ 指定的一组确定真值称为该公式的一个真值指派或赋值（assignment)。若指定的一组值使A的真值为真，则称这组值为A的成真指派或成真赋值；若使A的真值为假，则称这组值为A的成假指派或成假赋值。

注:

（a）n（n≥1）元命题公式共有 $2 ^ { n }$ 个不同的真值指派。

（b）在命题变项 $p _ { 1 } ,   p _ { 2 } ,   \ldots ,   p _ { n }$ 次序确定的情况下， $( p _ { 1 } ,   p _ { 2 } ,   \ldots ,   p _ { n } )$ 的一个真值指派可以表示为一个由0和1组成的n位符号串。例如一个含命题变项 $p_{1} 、 p_{2} 、 p_{3}$ 的命题公式A的一个真值指派表示为101，其含义是 $p _ { 1 }$ 真值为 T， $p _ { 2 }$ 真值为F， $p _ { 3 }$ 真值为 T。

一个命题公式在每种真值指派（即每种命题变项取值的组合）上的值可以直观地用真值表（truthtable）来计算和表示:对于一个n元命题公式A，其真值表的输入端（即最左n列）的2ⁿ行对应它的2ⁿ个真值指派；输出端（即最右一列）对应命题公式在它的2ⁿ个真值指派下的真值。

为方便构造真值表，特约定如下:

（1）命题变项按字典序排列。

（2）对每个真值指派，以二进制数从小到大或从大到小顺序列出。

(3）若公式较复杂，可先列出各子公式的真值(若有括号，则应从里层向外层展开)，最后列出所求公式的真值。

例如，定义2.4~定义2.9中各个命题联结词的真值表如表2.1所示。

表2.1 各个命题联结词的真值表<table><tr><td>p</td><td>q</td><td><eq>\neg p</eq></td><td><eq>p \wedge q</eq></td><td><eq>p \vee q</eq></td><td><eq>p \oplus q</eq></td><td><eq>p { \Longrightarrow } q</eq></td><td><eq>p { \leftrightarrow } q</eq></td></tr><tr><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td><td>F</td><td>F</td></tr><tr><td>F</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>F</td></tr><tr><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td></tr></table>

【例2.14】列出下述命题的真值表，并给出各公式的成真指派和成假指派。

(a) $(p \lor (p \land q)) \Rightarrow ( \sim p \Rightarrow q).$ 0

(b) $\sim ( \sim p \lor q ) \land ( q \land q )$ 0

(c)(~p∧q)⇒(~q∨p)。

解.

(a) $(p \lor (p \land q)) \Rightarrow ( \sim p \Rightarrow q)$ 的真值表如表2.2所示。

成真指派为TT、TF、FT和FF，不存在成假指派。

(b) $\sim ( \sim p \lor q ) \land ( q \land q )$ 的真值表如表2.3所示。

不存在成真指派，成假指派为TT、TF、FT和FF。

(c) $( \sim p \land q ) \Rightarrow ( \sim q \lor p )$ 的真值表如表2.4所示。

成真指派为TT、TF和FF，成假指派为 $\mathrm { F T } _ { \circ }$

[page:47]

## 第2章 命题逻辑

表2.2例2.14（a）的真值表<table><tr><td colspan=2>真值指派</td><td colspan=4>子公式真值</td><td>命题公式真值</td></tr><tr><td>p</td><td>q</td><td><eq>p \wedge q</eq></td><td><eq>p   \lor   ( p   \land   q )</eq></td><td><eq>\mathtt { \sim } p</eq></td><td><eq>\sim \mathrel { p } \to \mathrel { q }</eq></td><td><eq>(p \lor (p \land q)) \Rightarrow ( \sim p \Rightarrow q)</eq></td></tr><tr><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td>F</td><td>T</td><td>F</td><td>T</td><td>T</td></tr><tr><td>F</td><td>T</td><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>T</td></tr></table>

表2.3例2.14（b）的真值表<table><tr><td colspan=2>真值指派</td><td colspan=4>子公式真值</td><td>命题公式真值</td></tr><tr><td>p</td><td>q</td><td><eq>\sim   p</eq></td><td><eq>{ \sim } p \vee q</eq></td><td><eq>\sim ( \sim p \lor q )</eq></td><td><eq>q \wedge q</eq></td><td><eq>\sim ( \sim p \lor q ) \land ( q \land q )</eq></td></tr><tr><td>T</td><td>T</td><td>F</td><td>T</td><td>F</td><td>T</td><td>F</td></tr><tr><td>T</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td></tr><tr><td>F</td><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td><td>F</td></tr><tr><td>F</td><td>F</td><td>T</td><td>T</td><td>F</td><td>F</td><td>F</td></tr></table>

表2.4例2.14（c）的真值表<table><tr><td colspan=2>真值指派</td><td colspan=4>子公式真值</td><td>命题公式真值</td></tr><tr><td>p</td><td>q</td><td><eq>\sim   p</eq></td><td><eq>{ \sim } p \wedge q</eq></td><td><eq>- q</eq></td><td><eq>{ \sim } q \vee p</eq></td><td><eq>( \sim p \land q ) \Rightarrow ( \sim q \lor p )</eq></td></tr><tr><td>T</td><td>T</td><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>T</td><td>T</td><td>T</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>F</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td></tr></table>

上述3个例子中，（a）的真值表最后一列全为T，（b）的真值表最后一列全为F，（c）的真值表最后一列中至少有一个T。事实上，可以根据命题公式在每种真值指派（即每种命题变项取值的组合）上的值对命题公式进行分类。

定义2.13 假设A为一个n元命题公式，若其所有2ⁿ个真值指派都是成真指派，则称A为永真式或重言式（tautology）；若其所有2ⁿ个真值指派都是成假指派，则称A为永假式或矛盾式（contradiction）；若其至少存在一个成真指派，则称A为可满足式（satisfiable formula）；若A至少存在一个成真指派及成假指派，则称A 为非重言的可满足式。

注:重言式一定是可满足式，但反之不真。

定理2.1 任意两个重言式的析取或合取仍然是重言式；任意两个矛盾式的析取或合取仍然是矛盾式。

真值表是命题逻辑中的重要工具，它不但能给出公式的成真指派和成假指派，而且可以用来判断公式的类型:

（a）若真值表最后一列全为T，则公式为重言式，如例2.14的（a)。

(b）若真值表最后一列全为F，则公式为矛盾式，如例2.14的（b）。

[page:48]

## 离散数学及应用（第2版）

(c)若真值表最后一列中至少有一个T，则公式为可满足式，如例2.14的(a)和(c)。

## 2.3 命题逻辑的等值演算

如例2.9（f）所示，不同的命题公式其含义可能是相同的，这时称A与B是等值的。

定义 2.14 设A、B 为两个命题公式，若A↔B 为一个重言式，则称A 与 B 等值（equivalent）或逻辑等值（logically equivalent)，记作A=B，称A≡B 为等值式(equivalence ).

注:

（a）“≡”并不是一个逻辑联结符，A=B表示A、B有等值关系，而并非命题

(b）设 $p _ { 1 } , p _ { 2 } , \cdots , p _ { n }$ 是公式A和公式B中出现的全部命题变项。由定义，A、B等值当且仅当对于命题变项 $p _ { 1 } , p _ { 2 } , \cdots , p _ { n }$ 的任意一组真值指派，A和B的取值均相同。

（c）等值演算不能直接证明两个公式不等值。证明两个公式不等值的基本思想是找到一个真值指派使一个成真，另一个成假。

等值演算就是由已知的等值式推演出新的等值式的过程。判断两个命题公式是否等值主要有两种方法:真值表法和等值演算法。使用真值表法判断两个公式是否等价，只需要将两个公式的真值表列出，判断输出列是否相同即可。

【例2.15】使用真值表法证明蕴涵等值式 $p { \Rightarrow } q { \equiv } { \sim } p \lor q$

解. 列出公式 $p { \Longrightarrow } q$ 和公式 $\lnot p \lor q$ 的真值表，如表2.5所示。

表 2.5 例 2.15 用表<table><tr><td>p</td><td>q</td><td>p⇒q</td><td><eq>{ \sim } p \vee q</eq></td></tr><tr><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>F</td><td>T</td><td>T</td></tr></table>

从中可以看出，公式 $p { \Longrightarrow } q$ 和公式 $\lnot p \lor q$ 的输出列完全相同，因此 $p { \Rightarrow } q { \equiv } { \sim } p \lor q$

【例2.16】 使用真值表法判断下述3个公式之间的等值关系:

$$p { \Rightarrow } ( q { \Rightarrow } r ) , ( p { \Rightarrow } q ) { \Rightarrow } r , ( p { \land } q ) { \Rightarrow } r$$

解:列出3个公式的真值表，如表2.6所示。

表 2.6 例 2.16 用表<table><tr><td colspan=3>真值指派</td><td colspan=3>命题公式真值</td></tr><tr><td>p</td><td>q</td><td>r</td><td><eq>p { \Rightarrow } ( q { \Rightarrow } r ) .</eq></td><td><eq>\boxed { ( p { \Rightarrow } q ) { \Rightarrow } r }</eq></td><td><eq>( p \land q ) { \Rightarrow } r</eq></td></tr><tr><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>T</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td></tr><tr><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr></table>

[page:49]

## 第2章 命题逻辑

续表<table><tr><td colspan=3>真值指派</td><td colspan=3>命题公式真值</td></tr><tr><td>p</td><td>q</td><td>r</td><td><eq>p { \Rightarrow } ( q { \Rightarrow } r ) .</eq></td><td><eq>\boxed { ( p { \Rightarrow } q ) { \Rightarrow } r }</eq></td><td><eq>( p \land q ) { \Rightarrow } r</eq></td></tr><tr><td>F</td><td>T</td><td>F</td><td>T</td><td>F</td><td>T</td></tr><tr><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>T</td></tr></table>

从中可以看出， $p { \Rightarrow } ( q { \Rightarrow } r )$ 和 $( p \land q ) { \Rightarrow } r$ 是等值的，而 $p { \Rightarrow } ( q { \Rightarrow } r )$ 和 $( p { \Rightarrow } q ) { \Rightarrow } r$ 是不等值的。

当命题变项较多时，真值表法的工作量很大；而等值演算法则以基本等值式为基础，应用代入规则、置换规则，逐步推演。

定理2.2（基本等值式）假设p、q、r为任意命题，则有

(a）双重否定律 $p { \equiv } { \sim } ( { \sim } p ) \text { 。 }$

（b）幂等律 $p \lor p = p, p \land p = p$

（c）交换律 $p \lor q = q \lor p, p \land q = q \land p$

(d) 结合律 $(p \lor q) \lor r = p \lor (q \lor r), (p \land q) \land r = p \land (q \land r).$

（e）分配律 $p \lor (q \land r) = (p \lor q) \land (p \lor r)$

$$p \land (q \lor r) = (p \land q) \lor (p \land r)$$

(f)德·摩根律 $\sim (p \lor q) \equiv \sim p \land \sim q, \sim (p \land q) \equiv \sim p \lor \sim q.$

$$p \lor (p \land q) = p, \quad p \land (p \lor q) = p 。$$

(h）零律 $p \lor \mathrm{T} = \mathrm{T}, p \land \mathrm{F} = \mathrm{F} 。$

(i) 同一律 $p \lor \mathrm{F}=p,\ p \land \mathrm{T}=p$

（j）排中律（非真即假） $p \lor \lnot p \equiv \Gamma \text{。 }$

（k）矛盾律（不能既真又假） $p \land p \equiv \mathrm{F}$

（1）蕴含等值式 $p { \Rightarrow } q { \equiv } { \sim } p \lor q .$

（m）等价等值式 $p \Leftrightarrow q = (p \Rightarrow q) \land (q \Rightarrow p)$

(n）假言易位 $p { \Rightarrow } q { \equiv } { \sim } q { \Rightarrow } { \sim } p \text { 。 }$

（o）等价否定等值式 $p { \Longleftrightarrow } q { \equiv } { \sim } p { \Longleftrightarrow } { \sim } q \text { 。 }$

(p）归谬论 $(p \to q) \land (p \to \sim q) \equiv \sim p 。$

因为重言式的真值与命题变项的真值无关，对任何指派，它的真值总为真，即重言式的值不依赖于命题变项值的变化。因此，对命题变项以任何公式替换后，得到的仍是重言式。由此得到下面一个重要定理。

定理2.3（代入规则）假设A是一个重言式，对其中所有相同的命题变项都用同命题公式进行代换，所得到的结果仍为一个重言式。

注:如用(r∧s)来代换某公式中的 $p   ,$ ，记作

$$\frac { p } { \left( r \wedge s \right) }$$

【例2.17】 用(s⇒t)来代换公式 $p \lor (q \land p) \Leftrightarrow p$ 中的p,得到 $\left| \left( s { \Rightarrow } t \right) \lor \left( q \land \left( s { \Rightarrow } t \right) \right) { \Leftrightarrow } \left( s { \Rightarrow } t \right) \right.$

【例2.18】使用代入规则证明以下重言式:

[page:50]

## 离散数学及应用（第2版）

(a) $( r \lor s ) \lor \sim ( r \lor s )$ 0

(b) $( ( r \lor s ) \land ( ( r \lor s ) \Rightarrow ( p \lor q ) ) ) \Rightarrow ( p \lor q )$

解.

(a)p∨~p为重言式，作代入 $\frac { p } { ( r \vee s ) }$ 。依据代入规则，知(r∨s)∨~(r∨s)是重言式。

(b）不难验证(a∧(a⇒b))⇒b是重言式，作代入 $\frac{a}{(r \lor s)}, \frac{b}{(p \lor q)}$ ，便知其是重言式。

定理2.4（置换规则）设Φ(A)是含命题公式A的命题公式，Φ(B)是用命题公式B置换了Φ(A)中的A之后得到的命题公式（不一定是每一处）。如果A=B，则 $\Phi ( A ) = \Phi ( B )$ c

证明. 设 $p _ { 1 } , \; p _ { 2 } , \; \cdots , \; p _ { n }$ 是公式Φ(A)和公式Φ(B)中出现的全部命题变项。因为A和B分别是Φ(A)和Φ(B)的子公式，所以A和B中所出现的命题变项都包含在 $p_{1},p_{2},\cdots,p_{n} 之$中。由于A=B，因此对于命题变项 $p _ { 1 } ,   p _ { 2 } ,   \cdots ,   p _ { n }$ 的任意一组真值指派，A和B的取值均相同，于是Φ(A)和Φ(B)的取值也必然相同。按照定义2.14的注（b)，Φ(A)≡Φ(B)。□

$$\begin{align*} 【例  2.19 】 \quad & ((p \lor q) \land p) \lor (p \land r) \\&= p \lor (p \land r) \quad & ( 用   p   置换  (p \lor q) \land p) \\&= p \quad & ( 用   p   置换   p \lor (p \land r))\end{align*}$$

事实上，在等值演算过程中，常无意识地使用了置换规则。

表2.7对于代入规则和置换规则进行了比较。

表2.7 代入规则和置换规则的比较<table><tr><td>比较项</td><td>代入规则</td><td>置换规则</td></tr><tr><td>使用对象</td><td>任意重言式</td><td>任一命题公式</td></tr><tr><td>代换对象</td><td>任一命题变项</td><td>任一子公式</td></tr><tr><td>被代换物</td><td>任一命题公式</td><td>任一与代换对象等值的命题公式</td></tr><tr><td>代换方式</td><td>代换同一命题变项的所有出现</td><td>代换子公式的某些出现</td></tr><tr><td>代换结果</td><td>仍为重言式</td><td>与原公式等值</td></tr></table>

使用这两个规则和基本等值式，便可以推导出其他一些更复杂的等值公式

【例2.20】证明 $p \Rightarrow (q \Rightarrow r) = (p \land q) \Rightarrow r$

证明. p⇒(q⇒r)
≡~p∨(~q∨r) (蕴涵等值式)
≡(~p∨~q)∨r (结合律)
≡~(p∧q)∨r (德·摩根律)
≡(p∧q)⇒r (蕴涵等值式)

【例2.21】证明 $( \neg p \lor ( q \lor \neg r ) ) \land ( \neg q \lor \neg r ) \land ( p \lor \neg r ) \neg \neg r \circ$

[page:51]

## 第2章 命题逻辑

$$\begin{aligned}&= (\sim (p \land \sim q) \land (\sim q \land p)) \lor \sim r \\&=  F  \lor \sim r \\&= \sim r\end{aligned}$$

(分配律) (交换律、矛盾律) (同一律)

等值演算除了可以验证两个公式等值外，还可以用来判别命题公式的类型、化简语句、解决逻辑问题等。

【例2.22】用等值演算法判断下列公式的类型:

(a) $q \land \lnot ( p \Rightarrow q ) .$ 0

$$(p {\Rightarrow} q) {\Leftrightarrow} ( {\sim} q {\Rightarrow} {\sim} p) 。$$

$$( ( p \land q ) \lor ( p \land \lnot q ) ) \land r .$$

$$\begin{aligned} &q(a) q \land \lnot p \lnot q \\&\quad \equiv q \land \lnot (\lnot p \lor q) \\&\quad \equiv q \land (p \land \lnot q) \\&\quad \equiv p \land (q \land \lnot q) \\&\quad \equiv p \land \mathrm{F} \\&\quad \equiv \mathrm{F}\\ \end{aligned}$$

该式为矛盾式。

$$\begin{aligned}(\mathsf{b}) & (p \text{→ } q) \text{→ } (\text{→ } q \text{→ } \text{→ } p) \\\equiv & (\text{→ } p \text{→ } q) \text{→ } (\text{→ } q \text{→ } \text{→ } p) \\\equiv & (\text{→ } p \text{→ } q) \text{→ } (q \text{→ } \text{→ } p) \\\equiv & \text{°T }\end{aligned}$$

该式为重言式。

$$\begin{aligned} &(c) \left( (p \land q) \lor (p \land \lnot q) \right) \land r \\&\quad = \left( p \land (q \lor \lnot q) \right) \land r \\&\quad = (p \land \mathrm{T}) \land r \\&\quad = p \land r\\ \end{aligned}$$

该式为非重言式的可满足式。

## 【例2.23】 化简以下语句:

（a）情况并非如此:如果他不来，那么我也不去。

(b）不得不说如果不是因为他是不得已而为之而且没有造成恶劣后果的话我是不会原谅他的。

解.

(a）假设p表示命题“他来”，q表示“我去”，则原语句形式化为 $\sim ( \sim _ { } { p } { \Rightarrow } { \sim } q )$

由 $\mathord { \sim } ( \mathord { \sim } p \mathord { \Rightarrow } \mathord { \sim } q ) \mathord { \equiv } \mathord { \sim } ( \mathord { \sim } \mathord { \sim } p \lor \mathord { \sim } q ) \mathord { \equiv } \mathord { \sim } ( p \lor \mathord { \sim } q ) \mathord { \equiv } \mathord { \sim } p \land q$ 可将其化简为:“我去了，而他没来。”

(b）假设命题p表示“他这么做”，q表示“他造成了恶劣后果”，r表示“我原谅他”，则原语句形式化为 ${ \sim } { \sim } ( { \sim } ( { \sim } { \sim } p \land { \sim } q ) { \Rightarrow } { \sim } r )$ 。由 ${ \scriptstyle { \sim \sim ( \sim ( \sim \sim p \land \sim q ) \Rightarrow \sim r ) = r \Rightarrow p \land \sim q } }$ 可将其化简为:“我原谅他，说明他这么做了而且没有造成恶劣后果”。

这个例子的结果或许多少有些出人意料，这是因为逻辑联结词是从自然语句中提炼

[page:52]

## 52

抽象出来的，它仅保留了逻辑内容，而把自然语句所表达的主观因素、心理因素以及文艺修辞方面的因素全部撇开；从而命题联结词只表达了自然语句的一种客观性质。

【例2.24】将下面一段程序化简:

If A∧B then
If B∨C then
X
Else
Y
End
Else
If A∧C then
Y
Else
X
End
End

解. 将程序形式化为((A∧B)∧(B∨C)⇒X)∧((A∧B)∧~(B∨C)⇒Y)∧(~(A∧B)∧ (A∧C) ⇒Y)∧(~(A∧B)∧~(A∧C)⇒X).

通过等值演算得到

因此该程序可以简化为

If A∧~B∧C then
Y
Else
X
End

【例2.25】小张或小李是三八红旗手；如果小张是三八红旗手，会告知大家的；如果小李是三八红旗手，那么小赵也是；大家并没有被告知小张是三八红旗手。请问:谁是三八红旗手？

解.假设命题p:小张是三八红旗手，q:小李是三八红旗手，r:大家被告知小张是三八红旗手，s:小赵是三八红旗手。则题目形式化为(p∨q)∧(p⇒r)∧(q⇒s)∧~r。

(p∨q)∧(p⇒r)∧(q⇒s)∧~r
≡(p∨q)∧(~p∨r)∧(~q∨s)∧~r
≡(p∨q)∧(~q∨s)∧((~p∨r)∧~r)
≡(p∨q)∧(~q∨s)∧(~p∧~r)
≡(~p∧(p∨q))∧(~q∨s)∧~r
≡(~p∧q)∧(~q∨s)∧~r

[page:53]

## 第2章 命题逻辑

$$\begin{aligned}&\equiv \sim  p \land (q \land (\sim  q \lor s)) \land \sim  r \\&\equiv \sim  p \land (q \land s) \land \sim  r \\&\equiv \sim  p \land  q \land s \land \sim  r\end{aligned}$$

可得结论:小李和小赵是三八红旗手，小张不是三八红旗手。

【例2.26】教室的玻璃被打破了，经调查是甲、 $乙$ 、丙3人其中一人所为。

甲说:不是我做的。

乙说:是我打破的玻璃。

丙说:此事与乙无关。

已知甲、乙、丙3人中两人说了假话，一人说了真话，试问实际上是谁打破了玻璃？

解. 用p表示玻璃是甲打破的，q表示玻璃是乙打破的，r表示玻璃是丙打破的，a表示甲说的是真话，b表示乙说的是真话，c表示丙说的是真话。

那么，若p成立，q和r都不成立，因此可表示成 $p \wedge \sim q \wedge \sim r$ ，同样地，若q成立，有 $p \land q \land r ;$ 若r成立，则有 $p \wedge \sim q \wedge r$

于是3人中有且仅有一个人打破了玻璃就表示成 $( p \land \lnot q \land \lnot r ) \lor ( \lnot p \land q \land \lnot r ) \lor ( \lnot p \land$ ${ \sim } q \wedge r )$ 。类似地，甲、 $乙、$ 丙3人中两人说了假话、一人说了真话表示为 $( a \land \lnot b \land \lnot c ) \lor$ $( \neg a \land b \land \neg c ) \lor ( \neg a \land \neg b \land c )$ 0

再将说了假话还是真话与是何人打破的玻璃联系起来得到 $( a { \leftrightarrow } { \sim } p ) \land ( b { \leftrightarrow } q ) \land$ $( c   \Leftrightarrow   \sim   q )$

至此，可以将该逻辑问题表示为

$$\begin{array} { r l } & { \quad ( ( p \wedge \neg q \wedge \neg r ) \vee ( \neg p \wedge q \wedge \neg r ) \vee ( \neg p \wedge \neg q \wedge r ) ) \wedge ( ( a \wedge \neg b \wedge \neg c ) \vee ( \neg a \wedge b \wedge \neg c ) \vee ( \neg a \wedge \neg b } \\ & { \wedge c ) ) \wedge ( a \circ \neg p ) \wedge ( b \circ \neg q ) \wedge ( c \circ \neg q ) } \end{array}$$

经等值演算化简可得 $( p \land \lnot q \land \lnot r ) \land ( \lnot a \land \lnot b \land c )$ ，即玻璃是甲打破的，只有丙说了真话。

## 2.4 对偶与范式

## 2.4.1 对偶

在定理2.2给出的基本等值式中，很多都是成对出现的，例如 $p { \vee } p { \equiv } p$ 和 $p \wedge p { \equiv } p$ $(p \lor q) \lor r = p \lor (q \lor r)$ 和 $(p \land q) \land r = p \land (q \land r)$ 等，它们两两不同之处仅在于将∨换成∧，将∧换成√，这种现象称为对偶。

定义2.15 在仅含有联结词~、∧、∨的命题公式A 中，将∨换成∧，∧换成V，若包含F和T亦相互取代，所得命题公式称为A的对偶式（dual），记作 ${ \boldsymbol { A } } ^ { * } ,$

注:由对偶式的定义显然有 $( \boldsymbol { A } ^ { * } ) ^ { * } = \boldsymbol { A }$ ，即对偶式是相互的。

【例2.27】设 $A = p \lor ( \sim p \lor ( q \land \sim r ) )$ ，则 $A^{*} = p \land ( \sim p \land (q \lor \sim r) )$ o

定理2.5 设A为一个仅含有联结词~、∧、√的 n元命题公式， $p _ { 1 } , \; p _ { 2 } , \; \cdots , \; p _ { n }$ 是其命题变项，则

$$\sim A(p_{1},p_{2},\cdots,p_{n}) = A^{*}(\sim p_{1},\sim p_{2},\cdots,\sim p_{n})$$

[page:54]

## 54

证明.对A 中联结词的个数m做数学归纳法:

（1）当m=0时，只可能为 $A { = } p$ ，定理显然成立。

（2）假设定理对于所有 $m { \leqslant } k$ 都成立。当 $m { = } k { + } 1$ 时， $A ( p _ { 1 } , p _ { 2 } , \cdots , p _ { n } )$ 形成命题公式的最后一个联结词仅可能为~、∧或√。

①若最后一个联结词为~，令 $A(p_{1},p_{2},\cdots,p_{n}) = \sim B(p_{1},p_{2},\cdots,p_{n})$ ，则B为一个仅含有联结词~、∧、√的n元命题公式，且联结词的个数为k。由归纳假设有

$$\sim B(p_{1},p_{2},\cdots,p_{n}) = B^{*}(\sim p_{1},\sim p_{2},\cdots,\sim p_{n})$$

于是， $\neg A(p_{1},p_{2},\cdots,p_{n})=\neg B(p_{1},p_{2},\cdots,p_{n})=\neg B^{*}(\neg p_{1},\neg p_{2},\cdots,\neg p_{n})=A^{*}(\neg p_{1},\neg p_{2},\cdots,\neg p_{n}).$

②若最后一个联结词为∧，令 $A(p_{1},p_{2},\cdots,p_{n})=B(p_{1},p_{2},\cdots,p_{n})\wedge C(p_{1},p_{2},\cdots,p_{n}),$则B、C均为仅含有联结词~、∧、∨的n元命题公式，且联结词的个数至多为k。由归纳假设有

$$\neg B(p_{1},p_{2},\ \cdots,p_{n})=B^{*}(\neg p_{1},\neg p_{2},\ \cdots,\neg p_{n}),\quad  且  \neg C(p_{1},p_{2},\ \cdots,p_{n})=C^{*}(\neg p_{1},\neg p_{2},\ \cdots,\neg p_{n})$$

于是:

$$\begin{aligned} &A^{*}(\sim p_{1},\sim p_{2},\cdots,\sim p_{n})\\=&(B(\sim p_{1},\sim p_{2},\cdots,\sim p_{n})\land C(\sim p_{1},\sim p_{2},\cdots,\sim p_{n}))^{*}\\=&B^{*}(\sim p_{1},\sim p_{2},\cdots,\sim p_{n})\lor C^{*}(\sim p_{1},\sim p_{2},\cdots,\sim p_{n})\\=&\sim B(p_{1},p_{2},\cdots,p_{n})\lor\sim C(p_{1},p_{2},\cdots,p_{n})\\=&\sim(B(p_{1},p_{2},\cdots,p_{n})\land C(p_{1},p_{2},\cdots,p_{n}))\\=&\sim A(p_{1},p_{2},\cdots,p_{n})\\\end{aligned}$$

③若最后一个联结词为∨，可类似于②进行证明。

推论 设A为一个仅含有联结词~、∧、∨的n元命题公式，若A为重言式，则 $A ^ { * }$必为矛盾式。

定理2.6（对偶原理）设A、B为两个仅含有联结词~、∧、√的n元命题公式，若A=B，则 $\boldsymbol { \mathcal { A } } ^ { * } { \equiv } \boldsymbol { \mathcal { B } } ^ { * }$ 0

证明. 设 $p _ { 1 } , p _ { 2 } , \cdots , p _ { n }$ 是公式A和公式B中出现的全部命题变项。由 $\sim  A(p_{1},p_{2},\cdots,p_{n}) =$ $A^{*}( \neg p_{1}, \neg p_{2}, \cdots, \neg p_{n})  及  \neg B(p_{1}, p_{2}, \cdots, p_{n}) \equiv B^{*}( \neg p_{1}, \neg p_{2}, \cdots, \neg p_{n})$ ，得到 $A^{*}( \sim p_{1}, \sim p_{2}, \cdots, \sim p_{n} ) =$ $\boldsymbol { B } ^ { * } ( \sim p _ { 1 } , \sim p _ { 2 } , \cdots , \sim p _ { n } )$ ，即 $A^{*}(p_{1},p_{2},\cdots,p_{n}) = B^{*}(p_{1},p_{2},\cdots,p_{n})$ 0 口

于是，已知 $A \equiv B$ ，且B是比A简单的命题公式，则由对偶原理可直接求出较简单的 $B ^ { * }$ 与 $A ^ { * }$ 等值。

【例2.28】若 $(p \land q) \lor (\sim p \lor (\sim p \lor q)) = \sim p \lor q$ ，则 $(p \lor q) \land (\sim p \land (\sim p \land q)) = \sim p \land q$ 0

## 2.4.2 析取范式和合取范式

与一个给定的命题公式等值而形式不同的命题公式可以有无穷多个。于是，首要的问题就是能否将所有与命题公式A等值的公式化为某一个统一的规范形式。通过这种规范形式，可以判断任意两个形式上不同的公式是否等值，判断任一公式是否为重言式或矛盾式等。

本节将介绍命题逻辑中的的两种规范形式

定义 2.16 命题变项 p 及其否定式 $\sim   p$ 统称文字(literal)，且p与 $\sim _ { p }$ 称为互补对。

[page:55]

## 第2章 命题逻辑

定义2.17由有限个文字的析取所组成的公式称为析取式（fundamental disjunction)；由有限个文字的合取所组成的公式称为合取式(fundamental conjunction)。

【例2.29】 $p  、  \sim p  、  p \lor q  、  p \lor q \lor \sim q$ 都是析取式， $p  、  \sim p  、  p \land q  、  p \land q \land \sim p$ 都是合取式。

容易看出，一个析取式是重言式当且仅当其中出现互补对，一个合取式是矛盾式当且仅当其中出现互补对。

在此基础上，可以定义析取范式和合取范式。

定义 2.18 形如 $A_{1} \lor A_{2} \lor \cdots \lor A_{n}$ 的公式称为析取范式（disjunctive normal form），其中 $A_{i} (i{=}1, 2, \cdots, n)$ 为合取式。给定命题公式A，与A等值的析取范式称作A的析取范式。

定义 2.19 形如 $A_{1} \land A_{2} \land \cdots \land A_{n}$ 的公式称为合取范式（conjunctive normal form），其中 $A_{i} (i{=}1, 2, \cdots, n)$ 为析取式。给定命题公式A，与A等值的合取范式称作A的合取范式。

【例 2.30】 $( \neg p \land q \land \neg r ) \lor ( \neg p \land \neg q \land \neg r ) \lor ( p \land q ) \lor ( p \land \neg q ) \lor ( \neg p \land q ) \lor ( \neg p \land \neg r ) \lor ( q$ $\bigwedge   \sim   r )$ 都是析取范式， $( p \lor q ) \land ( \lnot p \lor \lnot q ) \lor ( \lnot p \lor q ) \land \lnot r \lor p \land ( p \lor r ) \land ( \lnot p \lor \lnot q \lor r )$ 都是合取范式，而 $p \lor q  、  \sim p \land r  、  p  、  \sim q$ 既是析取范式又是合取范式。

定理2.7（a）一个析取范式是矛盾式，当且仅当它的每个合取式都是矛盾式，即每个合取式至少包含一个互补对。

(b）一个合取范式是重言式，当且仅当它的每个析取式都是重言式，即每个析取式至少包含一个互补对。

（c）任何析取范式的对偶式为合取范式；任何合取范式的对偶式为析取范式。

(d)设B为 $A ^ { * }$ 的析取范式，则 $B ^ { * }$ 为A的合取范式。

求范式的步骤如下:

（1）利用等值式模式将其他联结词转化成~、△、√:

$$p { \Rightarrow } q { \equiv } { \sim } p \lor q , \quad p { \Leftrightarrow } q { \equiv } ( { \sim } p \lor q ) \land ( { \sim } q \lor p ) { \equiv } ( p \land q ) \lor ( { \sim } q \land { \sim } p )$$

（2）简化双重否定号，并将所有~写到文字里，使之只作用于命题变项:

$$\sim ( \sim p ) \equiv p , \sim ( p \lor q ) \equiv \sim p \land \sim q , \sim ( p \land q ) \equiv \sim p \lor \sim q$$

（3）利用分配律，将其最终变成合取范式或析取范式:

$$p \lor (q \land r) = (p \lor q) \land (p \lor r), p \land (q \lor r) = (p \land q) \lor (p \land r)$$

【例2.31】求 $(p \lor q \Rightarrow r) \Rightarrow p$ 的析取范式和合取范式。

$$\begin{aligned}& 解 . (p \lor q{\rightarrow}r){\rightarrow}p \\&= (\sim (p \lor q) \lor r){\rightarrow}p \\&= \sim (\sim (p \lor q) \lor r) \lor p \\&= (\sim (p \lor q) \land \sim r) \lor ((p \lor q) \land p) \\&= ((p \lor q) \land \sim r) \lor ((p \lor q) \land p)\end{aligned}\quad \begin{aligned}&( 消去第一个  \Rightarrow ) \\&( 消去第二个  \Rightarrow ) \\&(\sim  内移 ) \\&(\sim  内移 ) \\&(\sim  消去 ) \\&(\lor  对八分配律 ) \\&( 会取范式 ) \\&( 人对  \lor  分配律 )\end{aligned}$$

[page:56]

## 56

【例2.32】求 $\sim (p \lor q) \Leftrightarrow (p \land q)$ 的析取范式。

$$\begin{aligned} 解 . & \sim (p \lor q) \text{\text{÷ }} (p \land q) \\= & (\sim (p \lor q) \land (p \land q)) \lor (\sim \sim (p \lor q) \land \sim (p \land q)) \\= & (\sim p \land \sim q \land p \land q) \lor ((p \lor q) \land (\sim p \lor \sim q)) \\= & (\sim p \land \sim q \land p \land q) \lor (p \land \sim p) \lor (p \land \sim q) \lor (q \land \sim p) \lor (q \land \sim q) \\= & (p \land \sim q) \lor (q \land \sim p)\end{aligned}$$

【例2.33】求 $(p \lor q) \Leftrightarrow (p \land q)$ 的合取范式。

$$\begin{aligned} 解 . & \sim (p \lor q) \Leftrightarrow (p \land q) \\= & (\sim (p \lor q) \lor (p \land q)) \land (\sim (p \land q) \lor \sim (p \lor q)) \\= & ((p \lor q) \lor (p \land q)) \land ((\sim p \lor \sim q) \lor (\sim p \land \sim q)) \\= & (p \lor q) \land (\sim p \lor \sim q)\end{aligned}$$

从范式的计算方法和上面的例子，可以得到如下定理。

定理2.8（范式存在定理）任一命题公式都存在着与之等值的析取范式和合取范式。但析取范式和合取范式可能不是唯一的。

## 2.4.3 主范式

范式的不唯一性给判别两公式是否等值带来了不便，不同形式的析取范式或合取范式可能等值。因此需要引入更“标准”的主范式这一概念。

定义 2.20 若 n 个命题变项 $p _ { 1 } , p _ { 2 } , \cdots , p _ { n }$ 组成的合取式 $q _ { 1 } \wedge q _ { 2 } \wedge \cdots \wedge q _ { n }$ 满足 $q _ { i } { = } p _ { i }$ 或${ \sim } p _ { i } \; ( \; 1 \leqslant i \leqslant n \; )$ ，即:

（1）每个命题变项与它的否定式不同时出现，但二者之一必定出现且仅出现一次。

（2）第i个命题变项或其否定出现在从左起的第i位上。则称合取式 $q _ { 1 } \wedge q _ { 2 } \wedge \cdots \wedge q _ { n }$ 为极小项（minterm）。

将命题变项看成1，命题变项的否定看成0，于是每个极小项对应一个二进制数，该二进制数正是该极小项真值为真的指派。将其转换为十进制数i，作为下角标，则该极小项可以表示为 $m _ { i } \mathrm { { _ { c } } }$

【例2.34】3个命题变项，8个极小项对应情况如下:

$$\begin{aligned}&\sim p \quad \land \quad \sim q \quad \land \quad \sim r \\&\sim p \quad \land \quad \sim q \quad \land \quad r \\&\sim p \quad \land \quad q \quad \land \quad r \\&\sim p \quad \land \quad q \quad \land \quad r \\&p \quad \land \quad q \quad \land \quad r \\\end{aligned}\quad\begin{aligned}&\sim p \quad \quad \rightharpoonup \\&\sim p \quad \land \quad \sim q \quad \land \quad \sim r \\&\sim p \quad \land \quad \land \quad \land \quad \sim r \\&\sim p \quad \land \quad q \quad \land \quad \land \quad r \\&\sim p \quad \land \quad q \quad \land \quad \land \quad r \\\end{aligned}\quad\begin{aligned}&\quad \quad \quad \begin{aligned}&\quad  —— \quad 000 \text {——— } 0,  记作   m_0,  记作   m_0, \\&\quad  —— \quad 001 \text {—— } 1,  记作   m_1, \\&\quad  —— \quad 010 \text {—— } 2,  记作   m_2, \\&\quad  —— \quad 011 \text {—— } 3,  记作   m_3, \\&\quad  —— \quad 100 \text {—— } 4,  记作   m_4, \\&\quad  —— \quad 101 \text {—— } 5,  记作   m_5, \\&\quad  记作   m_5, \\&\quad  —— 110 \text {—— } 6,  记作   m_6, \\&\quad  —— \quad 111 \text {—— } 7,  记作   m_7, \\\end{aligned} \end{aligned}$$

[page:57]

## 第2章 命题逻辑

一般情况下，n个命题变项共产生 $2 ^ { n }$ 个极小项，分别记为 $m_{0},m_{1},\cdots,m_{2^{n}-1}$

【例2.35】 3个命题变项，8个极小项的真值表如表2.8所示。表2.8 3 个命题变项、8个极小项的真值表<table><tr><td>p</td><td>q</td><td>r</td><td><eq>m _ { 0 }</eq></td><td><eq>m _ { 1 }</eq></td><td><eq>m _ { 2 }</eq></td><td><eq>m _ { 3 }</eq></td><td><eq>m _ { 4 }</eq></td><td><eq>m _ { 5 }</eq></td><td><eq>m _ { 6 }</eq></td><td><eq>m _ { 7 }</eq></td></tr><tr><td>T</td><td>T</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td></tr><tr><td>T</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td></tr><tr><td>T</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td></tr><tr><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>T</td><td>T</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>F</td><td>T</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td></tr></table>

定理2.9 极小项具有如下性质:

（a）对任一含有n个命题变项的公式，所有可能的极小项的个数和该公式的解释个数相同，都是2ⁿ。

（b）每个极小项只在一个真值指派下为真。

（c）极小项两两不等值，并且 $m_{i} \wedge m_{j} = \mathrm{F}(i \neq j)$ ，因为其中至少包含一对互补对。

（d）恰由2ⁿ个极小项的析取构成的公式必为重言式。

定义2.21 若由n个命题变项构成的析取范式中所有的合取式都是极小项，则称其为主析取范式(full disjunctive normal form)，用Σ表示。给定命题公式A，与A 等值的主析取范式称作A的主析取范式。

即仅由有限个极小项构成的析取范式称为主析取范式。

【例2.36】 在由3个命题变项构成的命题公式中， $(p \land \lnot q \land \lnot r) \lor (p \land q \land \lnot r) \lor (p \land$ $q \wedge r )$ $( p \land q \land r ) \lor ( \sim p \land \sim q \land \sim r )$ 都是主析取范式，而 $(p \land q) \lor ( \sim p \land \sim r )$ 不是主析取范式。

求给定命题公式A的主析取范式的步骤如下:

（1）求出A的一个析取范式A'。

（2）若A'的某合取式B中不含命题变项 $p _ { i }$ 或其否定 ${ \sim } p _ { i }$ ，则将B展成如下形式。

$$B = B \land (p_i \lor \sim p_i) = (B \land p_i) \lor (B \land \sim p_i)$$

(3）将重复出现的命题变项、矛盾式及重复出现的极小项都“消去”，如 $p \wedge p$ 用p置换， $p { \wedge } { \sim } p$ 用F置换， $m _ { i } \vee m _ { i }$ 用 $m _ { i }$ 置换。

（4）将极小项按由小到大的顺序排列，并用Σ表示之。如 $m_{1} \lor m_{2} \lor m_{5}$ 用 Σ(1, 2, 5)表示。

【例2.37】求 $( ( p \lor q ) { \Rightarrow } r ) { \Rightarrow } p$ 的主析取范式。

解. 原公式的析取范式为 $p \lor ( q \land r )$ ，用 $p \land ( \sim q \lor q ) \land ( \sim r \lor r )$ 置换p，用 $( \sim p \lor p ) \land ( q$ $\bigwedge   \sim   r )$ 置换 $( q   \land   \sim   r )$ ，然后展开得极小项:

$$\begin{aligned} &((p \lor q) \textcircled{=} r) \textcircled{=} p \\= & p \lor (q \land \sim r)\\ \end{aligned}$$

(析取范式)

[page:58]

## 离散数学及应用（第2版）

$$\begin{align*}=& (p \land (\lnot q \lor q) \land (\lnot r \lor r)) \lor ((\lnot p \lor p) \land (q \land \lnot r)) \\=& (p \land \lnot q \land \lnot r) \lor (p \land \lnot q \land r) \lor (p \land q \land \lnot r) \lor (p \land q \land r) \lor (p \land q \land r) \lor (\lnot p \land q \land \lnot r) \lor (p \land q \land \lnot r) \\=& m_4 \lor m_5 \lor m_6 \lor m_7 \lor m_2 \lor m_6 \\=& m_2 \lor m_4 \lor m_5 \lor m_6 \lor m_7 \\=& \Sigma(2,4,5,6,7)\end{align*}$$

类似地，可以定义极大项和主合取范式。

定义 2.22 若 n 个命题变项 $p _ { 1 } , p _ { 2 } , \cdots , p _ { n }$ 组成的析取式 $q _ { 1 } \vee q _ { 2 } \vee \cdots \vee q _ { n }$ 满足 $q _ { i }   =   p _ { i }$ 或$p_{i} \left( 1 \leqslant i \leqslant n \right)$ ，即:

（1）每个命题变项与它的否定式不同时出现，但二者之一必定出现且仅出现一次。

（2）第i个命题变项或其否定出现在从左起的第i位上。则称析取式 $q _ { 1 } \vee q _ { 2 } \vee \cdots \vee q _ { n }$ 为极大项（maxterm）。

同极小项情况类似，如果将命题变项看成0，将其否定看成1，则每一个极大项对应一个二进制数，该二进制数正是该极大项真值为假的指派。此二进制数对应的十进制数i作为下角标，则该极大项可以表示为 $M _ { i }$

【例2.38】3个命题变项，8个极大项对应情况如下:

$$\begin{aligned}p & \lor & q & \lor & r \\p & \lor & q & \lor & \sim r \\p & \lor & \lor & q & \lor & \sim r \\\neg p & \lor & q & \lor & \lor & \sim r \\\neg p & \lor & \lor & q & \lor & \sim r \\\neg p & \lor & \lor & \sim q & \lor & \sim r \\\neg p & \lor & \lor & \sim q & \lor & \sim r \\\neg p & \lor & \lor & \sim q & \lor & \sim r \\\neg p & \lor & \lor & \sim q & \lor & \sim r \\\end{aligned}\quad\begin{aligned}& \quad &  ——  000  ——  0,  记作   M_{0} \\& \quad &  ——  001  ——  1,  记作   M_{1} \\& \quad &  ——  010  ——  2,  记作   M_{2} \\& \quad &  ——  011  ——  3,  记作   M_{3} \\& \quad &  ——  100  ——  4,  记作   M_{4} \\& \quad &  ——  101  ——  5,  记作   M_{5} \\& \quad &  ——  110  ——  6,  记作   M_{6} \\& \quad &  ——  111  ——  7,  记作   M_{7} \\\end{aligned}$$

一般情况下，n个命题变项共产生2ⁿ个极大项，分别记为 $M_{0},M_{1},\cdots,M_{2^{n}-1}$

【例2.39】 3个命题变项，8个极大项的真值表如表2.9所示。表2.9 3 个命题变项，8 个极大项的真值表<table><tr><td>p</td><td>q</td><td>r</td><td><eq>\underline { { M _ { 0 } } }</eq></td><td><eq>\underline { { \underline { { M _ { 1 } } } } }</eq></td><td><eq>\underline { { | M _ { 2 } | } }</eq></td><td><eq>\underline { { M _ { 3 } } }</eq></td><td><eq>M _ { 4 }</eq></td><td><eq>M _ { 5 }</eq></td><td><eq>\underline { { M _ { 6 } } }</eq></td><td><eq>M _ { 7 }</eq></td></tr><tr><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td></tr><tr><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td></tr><tr><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>T</td><td>F</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>F</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr></table>

综合例2.34、例2.35、例2.38和例2.39，可以得到表2.10和表2.11。

[page:59]

## 第2章 命题逻辑

表2.10 极小项与极大项对应表<table><tr><td colspan=2>极小项</td><td colspan=5>命题变项*</td><td colspan=2>极大项</td></tr><tr><td><eq>m _ { 7 }</eq></td><td>111-     -7</td><td>p</td><td></td><td>q</td><td></td><td>r</td><td>000     -0</td><td><eq>M _ { 0 }</eq></td></tr><tr><td><eq>m _ { 6 }</eq></td><td>110      -6</td><td>p</td><td></td><td>q</td><td></td><td><eq>{ \sim } r</eq></td><td>001-     -1</td><td><eq>M _ { 1 }</eq></td></tr><tr><td><eq>m _ { 5 }</eq></td><td>101-      -5</td><td>p</td><td></td><td>~q</td><td>■</td><td>r</td><td>010      -2</td><td><eq>M _ { 2 }</eq></td></tr><tr><td><eq>m _ { 4 }</eq></td><td>100      4</td><td>p</td><td></td><td>~q</td><td></td><td><eq>{ \sim } r</eq></td><td>011-     -3</td><td><eq>M _ { 3 }</eq></td></tr><tr><td><eq>m _ { 3 }</eq></td><td>011-      -3</td><td><eq>\mathtt { \sim } p</eq></td><td></td><td>q</td><td></td><td>r</td><td>100     -4</td><td><eq>M _ { 4 }</eq></td></tr><tr><td><eq>m _ { 2 }</eq></td><td>010      -2</td><td><eq>\mathtt { \sim } p</eq></td><td></td><td>q</td><td></td><td><eq>{ \sim } r</eq></td><td>101-      -5</td><td><eq>M _ { 5 }</eq></td></tr><tr><td>m1</td><td>001-      -1</td><td>~p</td><td></td><td><eq>{ \sim } q</eq></td><td></td><td>r</td><td>110       6</td><td><eq>M _ { 6 }</eq></td></tr><tr><td><eq>m _ { 0 }</eq></td><td>000      -0</td><td>~p</td><td></td><td>~q</td><td></td><td><eq>{ \sim } r</eq></td><td>111-     -7</td><td><eq>M _ { 7 }</eq></td></tr></table>*对于极大项，·表示√；对于极小项，·表示∧。

表2.11 极小项与极大项真值表<table><tr><td>p</td><td>q</td><td>r</td><td><eq>m _ { 7 }</eq></td><td><eq>m _ { 6 }</eq></td><td><eq>m _ { 5 }</eq></td><td><eq>m _ { 4 }</eq></td><td><eq>m _ { 3 }</eq></td><td><eq>m _ { 2 }</eq></td><td><eq>m _ { 1 }</eq></td><td><eq>m _ { 0 }</eq></td><td><eq>M _ { 7 }</eq></td><td><eq>M _ { 6 }</eq></td><td>M5</td><td><eq>M _ { 4 }</eq></td><td><eq>M _ { 3 }</eq></td><td><eq>M _ { 2 }</eq></td><td><eq>M _ { 1 }</eq></td><td><eq>M _ { 0 }</eq></td></tr><tr><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>T</td><td>T</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td>T</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>T</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td></tr><tr><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td><td>T</td></tr><tr><td>F</td><td>F</td><td>T</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td></tr><tr><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>T</td><td>F</td></tr></table>

从表2.10及表2.11中可以看出，极小项和极大项有如下关系。

定理 2.10 设 $m _ { i }$ 和 $M _ { i }$ 是由命题变项 $p _ { 1 } , \; p _ { 2 } , \; . . . , \; p _ { n }$ 形成的极小项和极大项，则 $m_{i} \equiv$ ${ \sim } M _ { i } { } _ { \circ }$

## 定理2.11 极大项具有如下性质:

（a）对任一含有n个命题变项的公式，所有可能的极大项的个数和该公式的真值指派个数相同，都是2ⁿ。

（b）每个极大项只在一个真值指派下为假。

（c）极大项两两不等值，并且 $M_{i} \lor M_{j} = \mathrm{T} (i \neq j)$ ，因为其中至少包含一对互补对。

(d)恰由 $2 ^ { n }$ 个极大项的合取构成的公式必为矛盾式。

定义2.23 设由n个命题变项构成的合取范式中所有的析取式都是极大项，则称其为主合取范式（full conjunctive normal form)，用 Ⅱ表示。给定命题公式A，与A等值的主合取范式称作A的主合取范式。

即仅由有限个极大项构成的合取范式称为主合取范式。

求给定命题公式A的主合取范式的步骤如下:

（1）先求出A的一个合取范式 $A ^ { \prime } \circ$

（2）若A'的某简单析取式 B 中不含命题变项 $p _ { i }$ 或其否定 ${ \sim } p _ { i }$ ，则将B展成如下

[page:60]

## 离散数学及应用（第2版）

形式:

$$B = B \lor (p_i \land \sim p_i) = (B \lor p_i) \land (B \lor \sim p_i)$$

(3）将重复出现的命题变项、重言式及重复出现的极大项都“消去”。

（4）将极大项按由小到大的顺序排列，并用Ⅱ表示之。如 $M_{1} \land M_{2} \land M_{5}$ 用 ΠI(1, 2, 5)表示。

【例2.40】求 $( ( p \lor q ) { \Rightarrow } r ) { \Rightarrow } p$ 的主合取范式。

$$\begin{aligned}& 解 . ((p \lor q){\Rightarrow}r){\Rightarrow}p \\&\quad \equiv (p \lor q){\land}(p \lor {\sim}r) \\&\quad \equiv (p \lor q \lor (r \land {\sim}r)){\land}(p \lor (q \land {\sim}q) \lor {\sim}r) \\&\quad \equiv (p \lor q \lor r){\land}(p \lor q \lor {\sim}r){\land}(p \lor q \lor {\sim}r){\land}(p \lor {\sim}q \lor {\sim}r) \\&\quad = (p \lor q \lor r){\land}(p \lor q \lor {\sim}r){\land}(p \lor {\sim}q \lor {\sim}r) \\&\quad \equiv M_0{\land}M_1{\land}M_3 \\&\quad \equiv \Pi(0,1,3)\end{aligned}$$

(合取范式)

例2.37和例2.40计算的是同一个命题公式的主析取范式和主合取范式。事实上，当计算出其中之一时，可以很容易地得到另一个。

设命题公式A中含n个命题变项，且设A的主析取范式中含k个极小项 $m_{i_1}, m_{i_2}, \cdots$ $m _ { i _ { k } }$ ，则～A的主析取范式中必含 $2 ^ { n } { - } k$ 个极小项，设为 $m_{j_1}, m_{j_2}, \cdots, m_{j_{2^n-k}}$ ，即$A = m_{j_1} \lor m_{j_2} \lor \cdots \lor m_{j_{2^n-k}}$ ，于是

$$\begin{aligned}A & \equiv  \sim  \sim  A \\& \equiv  \sim  (m_{j_1} \lor m_{j_2} \lor \cdots \lor m_{j_{2^{n_{-k}}}}) \\& \equiv  \sim  m_{j_1} \land \sim  m_{j_2} \land \cdots \land \sim  m_{j_{2^{n_{-k}}}} \\& \equiv  M_{j_1} \land  M_{j_2} \land \cdots \land  M_{j_{2^{n_{-k}}}}\end{aligned}$$

由此可以给出由A的主析取范式求主合取范式的步骤:

（1）求出A的主析取范式中没包含的极小项 $m_{j_1}, m_{j_2}, \cdots, m_{j_{2^{n}-k}}$

（2）求出与步骤（1）中极小项下角标相同的极大项 $M_{j_1}, M_{j_2}, \cdots, M_{j_{2^n-k}}$

（3）由以上极大项构成的合取式为A的主合取范式。

$$\begin{aligned} 【例  2.41 】  \quad & ((p \lor q) {\Rightarrow} r) {\Rightarrow} p \\= & m_2 \lor m_4 \lor m_5 \lor m_6 \lor m_7 \\\equiv & \Sigma (2,4,5,6,7) \\\equiv & M_0 \land M_1 \land M_3 \\\equiv & \Pi(0,1,3)\end{aligned}$$

此外，也可以通过真值表来计算A的主析取范式和主合取范式

（1）列出公式A的真值表。

（2）找出所有的成真指派和成假指派。

（3）求出每个成真指派对应的极小项的编码，按下角标从小到大析取得到主析取范式。

[page:61]

## 第2章 命题逻辑

（4）求出每个成假指派对应的极小项的编码，按下角标从小到大合取得到主合取范式。

【例2.42】试由真值表求 $( ( p \lor q ) { \Rightarrow } r ) { \Rightarrow } p$ 的主范式。

解. 由 $( ( p \lor q ) { \Rightarrow } r ) { \Rightarrow } p$ 的真值表（表2.12）得到 $( ( p \lor q ) { \Rightarrow } r ) { \Rightarrow } p$ 的主析取范式为Σ(2,4, 5,6, 7)，主合取范式为 II(0, 1,3)。

表 2.12 例 2.42 用表<table><tr><td>极小项标号</td><td>真值指派</td><td>命题公式真值</td></tr><tr><td>m</td><td>p            q            r</td><td><eq>( ( p \lor q ) \Rightarrow r ) \Rightarrow p</eq></td></tr><tr><td>7</td><td>T            T           T</td><td>T</td></tr><tr><td>6</td><td>T            T            F</td><td>T</td></tr><tr><td>5</td><td>T            F            T</td><td>T</td></tr><tr><td>4</td><td>T            F            F</td><td>T</td></tr><tr><td>3</td><td>F            T           T</td><td>F</td></tr><tr><td>2</td><td>F            T            F</td><td>T</td></tr><tr><td>1</td><td>F            F            T</td><td>F</td></tr><tr><td>0</td><td>F            F            F</td><td>F</td></tr></table>

关于主范式的存在唯一性，有如下定理。

定理2.12（主析取范式定理）任一含有n个命题变项的公式都存在唯一的与之等值且恰仅含这n个命题变项的主析取范式。

证明.存在性由构造方法可得，下面只证明唯一性。假设某一命题公式A存在两个与之等值的主析取范式B和C，即A=B且A=C，则 $B {\equiv} C 。$ 由于B和C是不同的主析取范式，不妨设极小项 $m _ { i }$ 只出现在B中而不出现在C中，于是，下角标i的二进制表示为B的成真指派，而为C的成假指派，这与B=C矛盾，因而B与C必相同。 □

定理2.13（主合取范式定理）任一含有n个命题变项的公式都存在唯一的与之等值且恰仅含这n个命题变项的主合取范式。

证明. 与定理2.12的证明类似。

主析取范式具有如下用途:

（a）判断两命题公式是否等值。由于任何命题公式的主析取范式都是唯一的，因而若A=B，说明A与B有相同的主析取范式；反之，若A、B有相同的主析取范式，必有A=B。

（b）判断命题公式的类型。设A是含n个命题变项的命题公式，则

（b.1）A为重言式，当且仅当A的主析取范式中含全部 $2 ^ { n }$ 个极小项；当且仅当A的主合取范式中不含任何极大项即为空公式。

（b.2）A为矛盾式，当且仅当A的主析取范式中不含任何极小项—即为空公式；当且仅当A的主合取范式中含全部 $2 ^ { n }$ 个极大项。

（b.3）若A的主析取范式中至少含一个极小项，则A是可满足式。

（c）求命题公式的成真指派和成假指派。

[page:62]

## 62

【例2.43】判断下列命题公式的类型:

(a) $( ( p { \Rightarrow } q ) \land p ) { \Rightarrow } q .$ 0

(b) $(p{\Rightarrow}q){\land}q 。$ 1

解.

$$\begin{aligned}(\mathtt{a}) & ((p{\Rightarrow }q){\land }p){\Rightarrow }q \\\equiv & \sim ((\sim  p{\lor }q){\land }p){\lor }q \\\equiv & \sim (\sim  p{\lor }q){\lor }\sim  p{\lor }q \\\equiv & (p{\land }\sim  q){\lor }\sim  p{\lor }q \\\equiv & (p{\land }\sim  q){\lor }(\sim  p{\land }(\sim  q{\lor }q)){\lor }((\sim  p{\lor }p){\land }q) \\\equiv & (\sim  p{\land }\sim  q){\lor }(\sim  p{\land }q){\lor }(p{\land }\sim  q){\lor }(p{\land }q) \\\equiv & m_0{\lor }m_1{\lor }m_2{\lor }m_3 \\\equiv & \Sigma(0,1,2,3)\end{aligned}$$

由以上推演可知，（a）为重言式。

$$\begin{aligned} (b) & (p \rightarrow q) \land q \\& \equiv (\neg p \lor q) \land q \\& \equiv q \\& \equiv (p \lor \neg p) \land q \\& \equiv (\neg p \land q) \lor (p \land q) \\& \equiv m_1 \lor m_3 \\& \equiv \Sigma(1, 3)\\ \end{aligned}$$

由以上推演可知，(b)为非重言的可满足式，成真指派为FT,TT，成假指派为FF,TF。

【例2.44】要从甲、乙、丙3人中选派若干人去国外考察，需满足下述条件:

（1）若甲去，则丙必须去。

（2）若乙去，则丙不能去。

（3）甲和乙必须去一人且只能去一人。

问有几种可能的选派方案？

解.假设命题p:派甲去，q:派乙去，r:派丙去，则条件（1）形式化为 $p { \Longrightarrow } r ,$ ，条件(2） 形式化为 $q { \Longrightarrow } { \sim } r$ ，条件（3）形式化为 $(p \land \lnot q) \lor ( \lnot p \land q)$ 。问题转化为求下式的成真指派:

$$A = ( p \to r ) \land ( q \to \sim r ) \land ( ( p \land \sim q ) \lor ( \sim p \land q ) )$$

计算A的主析取范式:

$$\begin{array} { r l } & { \quad ( p { \Rightarrow } r ) { \wedge } ( q { \Rightarrow } { \sim } r ) { \wedge } ( ( p { \wedge } { \sim } q ) { \vee } ( { \sim } p { \wedge } q ) ) } \\ & { = ( { \sim } p { \vee } r ) { \wedge } ( { \sim } q { \vee } { \sim } r ) { \wedge } ( ( p { \wedge } { \sim } q ) { \vee } ( { \sim } p { \wedge } q ) ) } \\ & { = ( p { \wedge } { \sim } q { \wedge } r ) { \vee } ( { \sim } p { \wedge } q { \wedge } { \sim } r ) } \end{array}$$

可得成真指派为TFT，FTF。即方案1——派甲与丙去，方案2——派乙去。

[page:63]

## 第2章 命题逻辑

## 2.5 命题联结词的完备集

定义2.24 设C是一个联结词的集合，如果任何由n个命题变项构成的命题公式都存在仅使用C中的联结词构成的等值公式，则称C是完备的联结词集合，或者说C是联结词的完备集。

定义2.25 设C是一个联结词的集合，其中可由C中的其他联结词定义的联结词称作冗余联结词。不含有冗余联结词的联结词完备集称作极小完备集

定理 2.14 如果一个联结词完备集 $S _ { 1 }$ 中的所有联结词都可由一个联结词集合 $S _ { 2 }$ 定义，则 $S _ { 2 }$ 也是联结词完备集。

定理2.15 下述联结词集合都是完备集:

(a) $S_{1} = \{ \sim, \lor, \land \}$ 0

(b) $S _ { 2 } = \{ \sim , \land \}$ 0

(c) $S_{3}=\left\{\sim,\ \lor\right\}$ 0

(d) $S_{4} = \left\{ \sim, \Rightarrow \right\}$ 0

证明.（a）由定理2.12，任何由n个命题变项构成的命题公式都与唯一的主析取范式等值，而在主析取范式中仅含联结词~、√、∧，所以 $S_{1} = \{ \sim , \lor , \land \}$ 是联结词的完备集。

(b) $p \lor q { \scriptstyle \equiv \sim \sim } ( p \lor q ) { \scriptstyle \equiv \sim } ( \sim p \land \sim q )$ ，由 $S _ { 1 }$ 是完备集及定理2.14 可得 $S _ { 2 }$ 是完备集。

(c) $p \land q { \equiv } { \sim } ( { \sim } p \lor { \sim } q )$ ，由 $S _ { 1 }$ 是完备集及定理2.14 可得 $S _ { 3 }$ 是完备集。

(d) $p \lor q \equiv \sim (\sim p) \lor q \equiv \sim p \Rightarrow q$ ，由 $S _ { 3 }$ 是完备集及定理2.14 可得 $S _ { 4 }$ 是完备集。 □

从定理2.15中可以看到，在{~，∨，∧}中，∨和∧都是冗余联结词。

那么有没有单个联结词构成的完备集？答案是肯定的。

定义2.26 设p、q为命题，与非词（sheffer）“↑”是二元联结词， $p \uparrow q$ 读作 $^ { \ast } p$ 、q的与非”。当且仅当p、q的真值均为真时， $p \uparrow q$ 的真值为假。简言之， $p \uparrow q \equiv \sim ( p \land q )$ 0

定义2.27 设p、q为命题，或非词（pierce）“↓”是二元联结词， $p \downarrow q$ 读作 $^ { \circ } p$ 、q的或非”。当且仅当p、q的真值均为假时， $p \downarrow q$ 的真值为真。简言之， $p \downarrow q \equiv \sim ( p \vee q )$ 0

定理2.16 下述联结词集合都是完备集:

(e) $S _ { 5 } = \{ \uparrow \}$ 0

(f) $S _ { 6 } = \{ \downarrow \}$ 0

证明. $(e) \sim p \equiv \sim (p \land p) \equiv p \uparrow p, \quad p \land q \equiv \sim (p \land q) \equiv \sim (p \uparrow q) \equiv (p \uparrow q) \uparrow (p \uparrow q)$ ，由 $S _ { 2 }$ 是完备集及定理 2.14 可得 $S _ { 5 }$ 是完备集。

(f) $\sim p \equiv \sim (p \lor p) \equiv p \downarrow p, \quad p \lor q \equiv \sim (p \lor q) \equiv \sim (p \downarrow q) \downarrow (p \downarrow q)$ ，由 $S _ { 3 }$ 是完备集及定理2.14 可得 $S _ { 6 }$ 是完备集。 □

这也说明，在逻辑电路中只需一种或非门或者只需一种与非门，就可以构造出所有的逻辑电路。

【例2.45】 证明联结词集合{∧}不是完备的。

证明.假设{∧}是完备集，则由联结词完备性的定义有 $\neg p \equiv p_{1} \land p_{2} \land \cdots p_{n}$

但当 $p , p _ { 1 } , p _ { 2 } ,   \cdots , p _ { n }$ 都取值为真时，上式左端为假，而右端为真，产生矛盾。 □

[page:64]

## 64

此例说明，{~，∧}是联结词的极小完备集。

## 2.6 命题逻辑的推理

逻辑是研究思维结构和规则的科学，推理是逻辑的最终目标。为此，首先应该明确什么样的推理是有效的或正确的。

定义2.28推理是从前提推出结论的思维过程，前提（premise），或称假设(hypothesis)，是指已知的命题公式 $A_{1},   A_{2},   \cdots,   A_{n}$ ，结论（conclusion）是从前提出发应用推理规则推出的命题公式B，正确的推理或有效的推理即是指 $A_{1} \land A_{2} \land \cdots \land A_{n} \Rightarrow B$ 是重言式，此时称B是 $\mathcal{A}_{1}, \mathcal{A}_{2}, \cdots, \mathcal{A}_{n}$ 的逻辑推论或有效结论。也记作

解推理问题的基本方法如下:

（1）将命题符号化。

（2）写出前提、结论和推理的形式结构。

（3）对推理形式的正确性进行判断。

注:这里考虑的是推理形式结构的有效性，而不是结论的正确性。

而我们常提到的“证明”就是一个描述推理过程的命题公式序列，其中的每个公式或者是已知前提，或者是由前面的公式应用推理规则得到的结论（中间结论或推理中的结论)。

判断一个推理形式是否正确，从定义上讲就是判断一个蕴涵式是否是重言式，因此前文介绍过的判定公式类型的方法都可以用来判断推理形式的正确与否，具体地讲，包括真值表法、等值演算法和主析取范式法。

【例2.46】判断下面的推理是否正确:

若今天是周二，则我要来上课。今天是周二，所以我要来上课。

解. 假设命题 $p ;$ 今天是周二， $q ;$ 我来上课，则推理的形式结构为 $(p \Rightarrow q) \land p \Rightarrow q$ 。下面使用等值演算法判断推理的正确性:

$$\begin{aligned}&\left(p{\Rightarrow }q\right){\wedge }p{\Rightarrow }q \\=&\left(\left(\sim  p{\vee }q\right){\wedge }p\right){\vee }q \\=&\left(\left(p{\wedge }{\sim }q\right){\vee }{\sim }p\right){\vee }q \\=&\left.\sim  p{\vee }{\sim }q{\vee }q\right. \\\equiv&\left.\mathrm{T}\right.\end{aligned}$$

因此推理正确。

【例2.47】判断下面的推理是否正确:

若今天是周二，则我要来上课。我来上课了，所以今天是周二。

[page:65]

## 第2章 命题逻辑

解. 假设命题p:今天是周二，q:我来上课，则推理的形式结构为 $(p \Rightarrow q) \land q \Rightarrow p$ 。下面用主析取范式法判断推理的正确性:

$$\begin{aligned}&\mathop{=}\mathop{(p{\Rightarrow }q){\land }q{\Rightarrow }p}\\&\mathop{=}\mathop{\sim }((\mathop{\sim }p{\lor }q){\land }q){\lor }p\\&\mathop{=}\mathop{\sim }q{\lor }p\\&\mathop{=}M_{1}\\&\mathop{=}m_{0}{\lor }m_{2}{\lor }m_{3}\end{aligned}$$

不是重言式，所以推理不正确。

【例2.48】判断下面的推理是否正确:

如果三角形的两边相等，则其所对的角相等；一个三角形的两边不相等，所以其所对角不相等。

解. 设p:三角形的两边相等，q:三角形的两边所对的角相等。则推理的形式结构为$(p \to q) \land \lnot p \to \lnot q$ 。下面用真值表法判断推理的正确性，如表2.13所示。

表 2.13 例 2.48 用表<table><tr><td>p</td><td>q</td><td><eq>(p \to q) \land p \to \lnot q</eq></td><td>p</td><td>q</td><td><eq>(p \to q) \land p \to \lnot q</eq></td></tr><tr><td>T</td><td>T</td><td>T</td><td>F</td><td>T</td><td>F</td></tr><tr><td>T</td><td>F</td><td>T</td><td>F</td><td>F</td><td>T</td></tr></table>

该蕴涵式不是重言式，表明推理不正确，或论证并非有效。

根据欧几里得几何，此例中的结论确实成立，但是这个结论的正确性实际并不是由此例中的两个前提推得的！这也说明本节考虑的是推理形式结构的有效性，而不是结论的正确性。

采用判定公式类型的方法来判断推理形式的正确与否具有一般性、广泛性的优点，但这种方法的不足也很明显:不能直观看出由前提A到结论B的推演过程，而且也难于推广到谓词逻辑中使用。

因此建立推理演算的证明方法（亦称演绎法），该方法从前提 $\mathcal{A}_{1}, \mathcal{A}_{2}, \cdots, \mathcal{A}_{n}$ 出发，配合使用基本推理公式和几条推理规则，逐步推演出结论B。这种方法还能给出推理的过程，使用起来方便，推演层次清晰，更近于数学的推理，而且也容易推广到谓词逻辑。

推理演算的理论依据是

$$(A \to B) \land ((B \land C) \to R) \Rightarrow ((A \land C) \to R)$$

即，要从前提A、C出发，推演出结论R，可以先由前提A推演出结论B，而后再由前提B、C出发，推演出结论R。

下面给出命题逻辑中的基本推理式，其正确性可以用真值表等方法验证。

定理2.17（基本推理公式）以下蕴涵式皆为重言式:

(a）附加律 A⇒(A∨B)

(b）化简律

$$(A \land B) \Rightarrow A$$

（c）前后件附加

$$(A \to B) \to ((A \lor C) \to (B \lor C))$$

$$(A \to B) \to ((A \land C) \to (B \land C))$$

[page:66]

## 离散数学及应用（第2版）

$$( A { \Rightarrow } B ) { \Rightarrow } ( ( C { \Rightarrow } A ) { \Rightarrow } ( C { \Rightarrow } B ) )$$

（d）对偶

$$(A \Rightarrow B) \Rightarrow (B^{*} \Rightarrow A^{*})$$

（e）假言推理/分离式 $(A \Rightarrow B) \land A \Rightarrow B$

(f) 拒取式 $(A \to B) \land \sim B \to \sim A$

(g）析取三段论 $(A \lor B) \land \sim B \Rightarrow A$

（h）假言三段论 $(A \to B) \land (B \to C) \to (A \to C)$

(i)等价三段论 $( A { \leftrightarrow } B ) { \land } ( B { \leftrightarrow } C ) { \Rightarrow } ( A { \leftrightarrow } C )$

（j）构造性二难 $(A \to B) \land (C \to D) \land (A \lor C) \to (B \lor D)$

（k）构造性二难(特殊形式)

$$(A \to C) \land (B \to C) \land (A \lor B) \to C$$

$$(A \to B) \land ( \sim A \to B) \to B$$

## （1）破坏性二难

$$(A \to B) \land (C \to D) \land (\sim B \lor \sim D) \to (\sim A \lor \sim C)$$

而主要的推理规则有以下6条:

（a）前提引入规则:在证明的任何步骤上，都可引入前提。

（b）结论引入规则:在证明的任何步骤上，所证明的结论都可以作为后续证明的前提。

（c）代入规则:与命题逻辑等值演算中的代入规则相同。

(d）置换规则:在证明的任何步骤上，命题公式中的任何子命题公式都可以用与之等值的命题公式置换。例如p⇒q可以用~p∨q置换等。

（e）分离规则:由A及A⇒B成立，可将B 分离出来。

（f）条件证明规则: $A_{1} \land A_{2} \Rightarrow B$ 与 $A_{1} \Rightarrow (A_{2} \Rightarrow B)$ 等值。

## 【例2.49】构造下列推理的论证。

前提: $p { \vee } q , p { \Rightarrow } { \sim } r , s { \Rightarrow } t , { \sim } s { \Rightarrow } r , { \sim } t$

结论:q

解.

(1) s⇒t (前提引入)

(2) ~t

(前提引入)

(3) ~s （(1）（2）拒取式）

(4) ~s⇒r (前提引入)

(5) r

（(3）（4）分离）

(6) p⇒~r (前提引入)

(7) ~p （(5）（6）拒取式）

(8) $p \vee q$ (前提引入)

(9) q （（7）（8）析取三段论）

表明推理正确。

## 【例2.50】构造下列推理的论证。

前提:r⇒(q⇒s), ~p∨r, q

解.

结论: ${ \sim } p \vee s$

[page:67]

## 第2章 命题逻辑

(1) ~p∨r (前提引入)

(3) r⇒(q⇒s) (前提引入)

(4) p⇒(q⇒s) （(2）（3）假言三段论）

(5) q⇒(p⇒s) ((4)置换)

(6) q (前提引入)

(7) p⇒s （(5）（6）分离）

(8)~p∨s ((7)置换)

表明推理正确。

这个例子说明在证明过程中将析取式写为等值的蕴涵式更便于推理。

## 【例2.51】 构造下列推理的论证。

前提:~(p⇒q)⇒~(r∨s), (q⇒p)∨~r, r

结论:p⇔q

## 解.

(1)(q⇒p)∨~r (前提引入)

(2) r (前提引入)

(3) q⇒p （(1）（2）析取三段论）

(4) ~(p⇒q)⇒~(r∨s) (前提引入)

(5) r∨s ((2)附加)

(6) p⇒q （(4）（5）拒取式）

(7) p⇔q （(4）（8）合取）

表明推理正确。

## 【例2.52】刘老师的桌子上多了一盆鲜花，已知如下事实:

（1）花是乐乐或者玲玲送给刘老师的。

（2）如果是玲玲送来的，那么一定不是早晨送来的。

（3）如果玲玲说了真话，那么刘老师的办公室窗户是关上的。

（4）如果玲玲说了假话，那么花一定是早晨送来的。

（5）刘老师办公室的窗户是开着的。

刘老师推测出花是乐乐送来的，他的推断是否正确呢？

解.首先对前提和结论进行符号化，假设命题

p:乐乐送给刘老师鲜花。

q:玲玲送给刘老师鲜花。

r:花是早晨送来的。

s:玲玲说了真话。

t:刘老师办公室的窗户是开着的。

得到如下推理形式:

前提: $p { \vee } q , q { \Rightarrow } { \sim } r , s { \Rightarrow } { \sim } t , { \sim } s { \Rightarrow } r , t$

结论:p

[page:68]

## 离散数学及应用（第2版）

之后进行命题逻辑推理:

<table><tr><td>之后进行命题逻辑推理:</td></tr><tr><td>(前提引入) (1) t</td></tr><tr><td>(前提引入) (2) s⇒~t</td></tr><tr><td>（(1）（2）拒取式） (3) ~s</td></tr><tr><td>(前提引入) (4) ~s⇒r</td></tr><tr><td>（(3）（4）分离） (5) r</td></tr><tr><td>(前提引入) (6) q⇒~r</td></tr><tr><td>（(5）（6）拒取式） (7) ~q</td></tr><tr><td>(前提引入) (8) <eq>p \vee q</eq></td></tr><tr><td>(9) p （（7）（8）析取三段论）</td></tr></table>

推理形式结构正确，花是乐乐送来的。

当要证明的结论是蕴涵式C⇒B时，可以应用推理规则（f）“条件证明规则:A₁ $A _ { 2 } { \Rightarrow } B$ 与 $A_{1} \Rightarrow (A_{2} \Rightarrow B)$ 等值”将蕴涵式的前提C作为附加前提使用，只需证明蕴涵式的结论B即可，这种方法称作附加前提证明法。

即假设要证明的推理形式结构如下:

前提: $A_{1}, A_{2}, \cdots, A_{n}$

结论:C⇒B

可以等价地证明推理形式结构:

前提: $A_{1}, A_{2}, \cdots, A_{n}, C$

结论:B

其理论依据是: $A { \Rightarrow } ( C { \Rightarrow } B ) { \equiv } { \sim } A \lor ( { \sim } C \lor B ) { \equiv } { \sim } ( A \land C ) \lor B { \equiv } A \land C { \Rightarrow } B \text { 。 }$

【例2.53】构造下列推理的论证。

前提: $r { \supset } ( q { \supset } s ) , { \sim } p { \lor } r , q$

结论:p⇒s

解.

<table><tr><td>(1) p</td><td>(附加前提引入)</td></tr><tr><td>(2) <eq>{ \sim } p \vee r</eq></td><td>(前提引入)</td></tr><tr><td>(3) r</td><td>（(1）（2）析取三段论）</td></tr><tr><td>(4) r⇒(q⇒s)</td><td>(前提引入)</td></tr><tr><td>(5) q⇒s</td><td>（(3）（4）分离）</td></tr><tr><td>(6) q</td><td>(前提引入)</td></tr><tr><td>(7) s</td><td>((5）（6）分离)</td></tr></table>

推理正确，p⇒s是有效结论。

此外还有一种间接证明方法 归谬法（反证法），即欲证明

前提: $A_{1}, A_{2}, \cdots, A_{n}$

结论:B

可以等价地证明

前提: $A_{1}, A_{2}, \cdots, A_{n}, \cdots B$

[page:69]

## 第2章 命题逻辑

结论:矛盾

其理论依据如下。

定义 2.29 若 $A_{1} \land A_{2} \land \cdots \land A_{n}$ 是可满足式，则称 $A_{1},   A_{2},   \cdots,   A_{n}$ 是相容的；若 $A _ { 1 } \triangle$ ${ \mathcal { A } } _ { 2 } { \bigwedge } \cdots { \bigwedge } { \mathcal { A } } _ { n }$ 是矛盾式，则称 $\mathcal { A } _ { 1 } , \mathcal { A } _ { 2 } , \cdots , \mathcal { A } _ { n }$ 是不相容的。

定理2.18 $(A_{1} \land A_{2} \land \cdots \land A_{n} \Rightarrow B)$ 为重言式当且仅当 $A_{1} \land \cdots \land A_{n} \land \cdots B$ 为矛盾式。

即如果 $A_{1},A_{2},\cdots,A_{n},\sim B$ 不相容，则说明B是 $\mathcal { A } _ { 1 } , \mathcal { A } _ { 2 } , \cdots , \mathcal { A } _ { n }$ 的逻辑结论。

## 【例2.54】 使用归谬法构造下列推理的论证。

## 前提: $p { \Rightarrow } ( { \sim } ( r { \land } s ) { \Rightarrow } { \sim } q ) , p , { \sim } s$

结论:~q

解.

<table><tr><td>(1) <eq>p { \Rightarrow } ( { \sim } ( r { \land } s ) { \Rightarrow } { \sim } q )</eq></td><td>(前提引入)</td></tr><tr><td>(2) p</td><td>(前提引入)</td></tr><tr><td>(3) <eq>{ \sim } ( r \land s ) { \Rightarrow } { \sim } q</eq></td><td>((1）（2）分离）</td></tr><tr><td>(4) ~(~q)</td><td>(否定结论引入)</td></tr><tr><td>(5) q</td><td>((4）置换)</td></tr><tr><td>(6) <eq>r \triangle s</eq></td><td>（(3）（5）拒取式）</td></tr><tr><td>(7) <eq>{ \sim } s</eq></td><td>(前提引入)</td></tr><tr><td>(8) s</td><td>((6）化简)</td></tr><tr><td>(9) <eq>s \wedge   \sim   s</eq></td><td>（(7）（8）合取）</td></tr></table>

由（9）得出矛盾，说明推理正确。

推理演算方法有其优势，但也有其缺点:规则与公式较多，对技巧的要求较高，不便于机器证明与程序实现。罗宾逊（J.A.Robinson）于1965年提出的归结法（resolution）可克服这一劣势，它仅需要建立一条推理规则。其理论依据依然是定理2.18——证明A⇒B是重言式等价于证明A∧~B是矛盾式。

归结法的步骤如下:

（1）将A∧~B化成合取范式:

$$C_{1} \land C_{2} \land \cdots \land C_{n}$$

其中C为析取式。由诸C构成子句集 $S = \{ C _ { 1 } , C _ { 2 } , \cdots , C _ { n } \}$

（2）对S中的子句作归结（消互补对），归结结果仍放入S中，重复此步。

（3）直至归结出空子句□（矛盾式）。

第（2）步中的“归结”推理规则是:假设子句1为 $C_{1} = L \lor C_{1}$ ，子句2为 $C _ { 2 }   =   \sim   L$ $\scriptstyle { \bigvee } C _ { 2 } { ' }$ ，其中L和~L为互补对，则新子句为 $R(C_{1},C_{2}) = C_{1}' \lor C_{2}'$ (注意消去相同的文字)。其理论依据是: $C_{1} \land C_{2} \Rightarrow C_{1} \lor C_{2}$ 是重言式。

【例2.55】 使用归结法证明 $(p \Rightarrow q) \land \lnot q \Rightarrow \lnot p 。$

解. 先将 $(p \to q) \land \lnot q \land \lnot (\lnot p)$ 化成合取范式 $( ( \sim p \lor q ) \land p \land \sim q$ 。建立子句集 $S = \{ \sim p \lor q , p ,$ $- q \}$

归结过程如下:

(1) ${ \sim } p \vee q$

(前提引入)

[page:70]

## 离散数学及应用（第2版）

(2) p (前提引入)

(3) ~q (前提引入)

(4) q （(1）（2）归结)

(5) □ （(3）（4)归结)

归结出空子句□(矛盾式)，证明结束。

【例2.56】如果小张上课认真听讲，并且课后及时复习，那么她就能掌握基本知识点。而她或者未掌握基本知识点，或者已经能够完成作业了。而事实上小张课后及时复习了但并没有完成作业，因此她没有好好听课。这个推理是否正确？

解.先将原子命题符号化。

p:小张上课认真听讲了。

q:小张课后及时复习了。

r:小张掌握基本知识点了。

s:小张能够完成作业。

得到如下推理形式:

前提:(p∧q)⇒r≡~p∨~q∨r，~r∨s，~s，q

结论:~p

由前提和结论的否定可以得到子句集{~p∨~q∨r, ~r∨s, ~s, q, p}。

然后进行命题逻辑推理:

(1) p (结论的否定引入)

(2) ~r∨s (前提引入)

(3) ~s (前提引入)

(4) ~r ((2）（3）归结)

(5)~p∨~q∨r (前提引入)

(6) ~p∨~q ((4）（5）归结)

(7) q (前提引入)

(8) ~p ((6)（7）归结)

(9) □ （(1）（8）归结)

归结出空子句□，所以推理正确。

## 习题2

2.1 判断下列语句中哪些是命题，哪些是原子命题。

（a）火星上有水。

（b）全体起立！

（c）真辛苦啊！

（d）我可以过来吗？

(e)2+5=7。

(f) x+y=5。

[page:71]

## 第2章 命题逻辑

（g）只有努力工作，才能做出成绩。

（h）只要是在教室，就不允许吸烟。

（i）如果圣诞老人是不存在的，而且孙悟空也是不存在的，那么很多孩子被骗了。

（j）黄色和蓝色可以调配成绿色。

（k）每个大于2的偶数都可以表示为两个素数之和。

（1）除非下雨，苗苗一定会去公园。

2.2 判断下述命题的真值。

（a）如果1+1=3，那么太阳从东方升起。

（b）如果1+1=3，那么太阳从西方升起。

（c）4是2的倍数或是3的倍数。

（d）2不是素数当且仅当猫会飞。

2.3 设 p: 发生了堵车，q: 他起晚了，r: 他迟到了。

（a）用逻辑符号表示以下命题。

①由于堵车，他上班迟到了。

②只有堵车，他才会迟到。

③今天虽然他起晚了，但是没有堵车，所以他没有迟到。

④只要发生了堵车，即使他没有起晚，也会迟到。

（b）将下列命题用自然语言描述。

① $p { \Rightarrow } ( q \land { \sim } r ) \text {。 }$

②~(p∨q)∧r。

③~(q⇒p)∧p。

$p   \lor   q   \Rightarrow   \sim   r _ {      }$

2.4 对下面的每个前提给出两个结论，要求一个是有效的，而另一个不是有效的。

（a）只有天气热，我才去游泳。我正在游泳，所以 0

（b）只要天气热，我就去游泳。我没去游泳，所以

2.5 将下列命题符号化。

（a）数理逻辑并非是枯燥无味的。

（b）2既是偶数又是素数。

（c）虽然今天下雨了，苗苗还是去图书馆看书了。

（d）他一边吃饭，一边看电视。

（e）只要我努力学习，我就不会害怕考试。

（f）只有我努力学习，我才不会害怕考试。

（g）苗苗取得好成绩，原因在于她既聪明又勤奋。

（h）苗苗总在图书馆看书，除非她有课或者身体不舒服。

（i）不经一事，不长一智。

（j）平行四边形ABCD是正方形当且仅当它既是矩形又是菱形。

2.6 列出下列公式的真值表。

(a) $( p { \Rightarrow } { \sim } p ) { \Rightarrow } { \sim } p   .$

[page:72]

## 72

(b) $( p { \Leftrightarrow } q ) { \Leftrightarrow } ( q { \oplus } { \sim } p ) \text { 。 }$

(c) $(p \land (p \lor q)) \Leftrightarrow p$

(d) $\sim (p \Rightarrow (p \lor q)) \land r$

(e) $\sim (p \rightarrow q) \land ((q \leftrightarrow \sim r) \lor \sim p) 。$

(f) $( ( p \lor q ) { \Rightarrow } r ) { \Leftrightarrow } s \text { 。 }$

2.7 判断以下公式的类型。

(a) $(q \Rightarrow p) \land (\sim p \land q)$

(b) $p \Rightarrow (p \land (q \Rightarrow p))$

(c) $(p \land \lnot p) \Leftrightarrow q$

(d) $( p { \Rightarrow } ( q { \Rightarrow } r ) ) { \Rightarrow } ( ( p { \Rightarrow } q ) { \Rightarrow } ( p { \Rightarrow } r ) ) \text { 。 }$

(e) $(p \lor \lnot p) \Rightarrow ((q \land \lnot q) \land \lnot r)$

(f) $(p \lor q) \land (q \lor r) \land (r \lor p) \Leftrightarrow (p \land q) \lor (q \land r) \lor (r \land p) 。$

2.8 给出以下公式的成真指派和成假指派。

(a) $\sim (q \Rightarrow p) \land p$

(b) $p { \Rightarrow } ( p \lor q ) \text { 。 }$

(c) $\sim ( ( p { \rightarrow } q ) { \rightarrow } r ) { \leftrightarrow } ( q { \lor } r ) \text { 。 }$

(d) $\sim (p \rightarrow q) \land ((q \leftrightarrow r) \lor p)$

(e) $( { \sim } { \sim } p { \Rightarrow } { \sim } q ) { \land } ( q { \lor } ( { \sim } r { \land } p ) ) \text {。 }$

(f) $( { \sim } p { \land } q ) { \Rightarrow } ( ( q { \Rightarrow } r ) { \Leftrightarrow } { \sim } p ) .$

2.9 假设A、B、C为任意命题公式，判断下述结论是否成立。

（a）若 $A \lor C \equiv B \lor C,$ 则 $A { \equiv } B \text { 。 }$

(b）若 $A \land C \equiv B \land C,$ 则 $A { \equiv } B \text { 。 }$

(c）若 $\dot { \sim } A \equiv \sim B ,$ 则A≡B。

2.10 用等值演算法证明下列等值式。

(a) $p { \Rightarrow } ( q { \Rightarrow } r ) { \equiv } q { \Rightarrow } ( p { \Rightarrow } r ) \text { 。 }$

(b) $p { \Rightarrow } ( q { \Rightarrow } p ) { \equiv } { \sim } p { \Rightarrow } ( p { \Rightarrow } { \sim } q ) \text { 。 }$

(c) $(p \to q) \land (p \to r) \equiv p \to q \land r \text{。 }$

(d) $(p \lor q) \Rightarrow r = (p \Rightarrow r) \land (q \Rightarrow r)$

(e) $(p \to q) \land (p \to \sim q) \land r = r \land \sim p 。$

(f) $\neg (p \Leftrightarrow q) \equiv (p \lor q) \land \neg (p \land q) \equiv (p \land \neg q) \lor (\neg p \land q) \equiv \neg p \Leftrightarrow q \equiv p \Leftrightarrow \neg q 。$

(g) $( ( p \land q ) \Rightarrow r ) \land ( q \Rightarrow ( r \lor s ) ) = ( q \land ( s \Rightarrow p ) \Rightarrow r ) \text { 。 }$

(h) $( { \sim } p \land q ) { \Rightarrow } ( ( q { \Rightarrow } r ) { \Leftrightarrow } { \sim } p ) { \equiv } ( { \sim } p \lor { \sim } q \lor { \sim } r ) { \text { 。 } }$

2.11 用等值演算法判定以下命题形式的类型。

(a) $(p \land q) \Rightarrow q \text{。 }$

(b) $\sim ( \sim p \lor q ) \land q$

(c) $( \sim p \land q ) { \Rightarrow } ( ( q { \Rightarrow } { \sim } r ) { \Leftrightarrow } p ) \text { 。 }$

(d) $p \Rightarrow (p \lor q \lor r)$

(e) $\sim ( p \Rightarrow q ) \land q \land r \text{。 }$

[page:73]

## 第2章 命题逻辑

(f) p∨q⇒~r。

2.12 将下面的语句化简。

（a）我没有去接你是不对的，但是你也不应该不等我。

(b）如果不是在办公室没有人的情况下，接通电源，自动监视系统就不工作。

（c）把能被3整除、末位是0、各位数字之和大于31的数删除，把不能被3整除、末位是0、各位数字之和小于31的数删除，把能被3整除、末位是0、各位数字之和小于31的数删除，把不能被3整除、末位是0、各位数字之和大于31的数删除，把能被3整除、末位不是0、各位数字之和大于31的数删除。

2.13 将下面一段程序化简。

If A∨B then
If A∨C then
X
Else
Y
End
Else
If B∧C then
Y
Else
X
End
End

2.14 使用命题逻辑的知识解答下述逻辑问题。

（a）三个人估计比赛结果。

甲说:“A第一，B第三。”

乙说:“A第二，B第三。”

丙说:“A第一，B第二。”

结果三个人中有一个人全部猜对，另两人都只猜对了一半，请问A、B的名次是什么？

(b）灵灵新买了一条裙子，但是她不肯给大家看，只是给出了一个提示:“我新买的裙子的颜色是红、黄、黑之一。’

小张说:“灵灵一定不会买红色的。”

小王说:“那一定是黑色或黄色。”

小李说:“一定是黑色。”

最后灵灵说:“你们三人中间至少有一个说对了，至少有一个人说错了。”

请问，灵灵的新裙子是什么颜色的？

（c）灵灵、平平、欢欢和乐乐有一人只说谎话，而其余三人从不撒谎。他们每人戴一枚戒指，其中之一是妖魔戒指，带着它的人一定会说谎（无论天性如何)。根据以下对话，推断谁是天生只说谎话之人，谁带着妖魔戒指。

灵灵:“我的戒指不是妖魔戒指。”

[page:74]

## 74

平平:“欢欢天生只说谎话。”

欢欢:“带着妖魔戒指的是乐乐。”

乐乐:“欢欢天生从不说谎话。”

2.15 求下列命题公式的对偶式。

(a) $(p \land q) \lor ( \sim p \land r )$

(b) $( { \sim } p { \Rightarrow } { \sim } q ) { \land } ( q { \lor } ( { \sim } r { \land } p ) ) \text {。 }$

(c) $\sim (p \rightarrow q) \land ((q \leftrightarrow r) \lor p)$

(d) $(p \land q) \uparrow (\sim p \land q \land r)。$

2.16 求下列各命题公式的析取范式和合取范式。

(a) $( ( p \lor q ) { \Rightarrow } r ) { \Rightarrow } p \text { 。 }$

(b) $(p \lor (q \land r)) \Rightarrow (p \lor q \lor r)$

(c) $p \land (q \lor (\sim p \land r))$

(d) $( p { \Rightarrow } q ) { \Rightarrow } r \text { 。 }$

(e) $(p \to q) \lor ((q \land p) \Leftrightarrow (q \Leftrightarrow \sim r)) 。$

(f) $( \mathord { \sim } p \mathord { \rightrightarrows } q ) \mathord { \Rightarrow } ( \mathord { \sim } q \lor p ) \mathord { \circ }$

2.17 由表2.14所示的真值表，写出公式A、B、C的主合取范式和主析取范式（用 $m _ { i }$和 $M _ { i }$ 表示)。

表 2.14 习题 2.17 用表<table><tr><td>p</td><td>q</td><td>A</td><td>B</td><td>C</td></tr><tr><td>T</td><td>T</td><td>F</td><td>T</td><td>F</td></tr><tr><td>T</td><td>F</td><td>T</td><td>F</td><td>T</td></tr><tr><td>F</td><td>T</td><td>T</td><td>F</td><td>T</td></tr><tr><td>F</td><td>F</td><td>T</td><td>T</td><td>F</td></tr></table>

2.18 求下列命题公式的主析取范式和主合取范式。

(a) $q \land ( p \lor \sim q ) .$ 0

(b) $( \neg p \lor \neg q ) { \Rightarrow } ( p { \leftrightarrow } { \sim } q ) .$ 0

(c) $(p \land q) \lor ( \lnot p \land r )$

(d) $p \land (q \lor (\sim p \land r))$

$(p{\Rightarrow}q){\Rightarrow}r 。$

(f) $(p \to (q \land r)) \land (\sim p \to (\sim q \land \sim r))$

(g) $(p \to q) \lor ((q \land p) \Leftrightarrow (q \Leftrightarrow \sim r)) 。$

(h) $p \lor ( \lnot p \Rightarrow ( q \lor ( \lnot q \Rightarrow r ) ) )$

2.19 使用将公式化为主范式的方法判断下列各题中两公式是否等值。

(a) $(p \to q) \to (p \land q) \land (p \land q) \land (p \to q)$

(b) $(p \to r) \land (q \to r) \land (p \land q) \to r$

(c) $(p \land q) \lor (\neg p \land r) \lor (q \land r) \land (p \land q) \lor (\neg p \land r)$

(d) $p \Rightarrow (q \Rightarrow r)  与  q \Rightarrow (p \Rightarrow r) 。$ 0

[page:75]

## 第2章 命题逻辑

(e) p↑q与p↓q。

(f) $(p \lor q) \land (q \lor r) \land (r \lor p)  与  (p \land q) \lor (q \land r) \lor (r \land p) 。$

2.20 利用主范式判断下列命题公式的类型。

(a) $\sim ( q \land \sim ( ( \sim p \land q ) \lor p ) ) \text {。 }$

(b) $(q \Rightarrow p) \land (\sim p \land q)$

(c) $( \sim p \Rightarrow q ) \land r \text{。 }$

(d) $(p \mathord { \rightleftharpoons } q \mathord { \bigwedge } r) \lor (\mathord { \sim } r \mathord { \rightleftharpoons } (p \mathord { \Rightarrow } q)) 。$

(e) $( ( p \lor q ) \land \sim ( \lnot p \land ( \lnot q \lor \lnot r ) ) ) \lor ( \lnot p \land \lnot q ) \lor ( \lnot p \land \lnot r )  。$

(f) $(p {\Leftrightarrow} q) {\Rightarrow} ( {\sim} p {\land} {\sim} (q {\Rightarrow} {\sim} r) ) 。$

2.21 利用主范式求下列命题公式的成真指派和成假指派。

(a) $( \sim p \land q ) \lor p \text{。 }$

(b) $(q \Rightarrow p) \land ( \sim p \Rightarrow q)$

(c) $( p { \Leftrightarrow } q ) { \Rightarrow } ( p \lor q ) \text { 。 }$

(d) ${ \sim } r { \lor } { \sim } p { \Rightarrow } ( p { \Leftrightarrow } { \sim } q ) \text { 。 }$

(e) $( \sim p \land \sim q \land \sim r ) \lor ( p \land q ) .$

(f) $(p \Rightarrow q) \land (\sim p \land r)$

2.22 某单位须从A、B、C、D、E5人中遴选若干人出差，由于工作情况，人选受到如下限制:

（1）若A去，则B也去。

（2）D、E中必须去一人。

（3）B、C去且仅去一人。

（4）C、D同去或同不去。

（5）若E去，则A、B也去。

请问:可以选派哪些人出差？有多少种遴选方式？使用将公式化为主范式的方法求解该问题。

2.23 证明联结词集合{∨}和{⇒}不是完备的。

2.24 证明以下联结词集合是完备的。

(a) $\{ \oplus , \wedge , \Leftrightarrow \}   .$

(b) {⊕, ∨,⇔}。

2.25 给定命题公式(p∨q)⇒r，给出该公式在下列各联结词完备集中的等值的表示形式。

(a) {~,⇒};(b) {~, ∧}; (c) {↑};(d) {↓}。

2.26 给定命题公式p⇔q，给出该公式在下列各联结词完备集中的等值的表示形式。

(a) {~,⇒}; (b) {~, ∨}; (c) {↑};(d) {↓}。

2.27 将命题公式p^q化为只出现联结词“↓”的等值公式。

2.28 将下述命题公式化为仅含{~，√}联结词的等值公式。

(a) $(p \lor \lnot q) \land \lnot r$

(b) $p \land \lnot q \land r 。$

(c) $p \oplus q \circ$

[page:76]

## 离散数学及应用（第2版）

2.29 要设计由一个灯泡和3个开关A、B、C组成的电路，要求在且仅在下述4种情况下灯亮:

（1）C的扳键向上，A、B的扳键向下。

（2）A的扳键向上，B、C的扳键向下。

（3）B、C的扳键向上，A的扳键向下。

（4）A、B的扳键向上，C的扳键向下。

设F为1表示灯亮，p、q、r分别表示A、B、C的扳键向上。

（a）求F的主析取范式。

（b）在联结词完备集{~，∧}上构造F。

（c）在联结词完备集 $\{ \sim , \Rightarrow , \Leftrightarrow \}$ 上构造F。

2.30 证明下述蕴涵式是重言式。

(a) $( ( p { \Rightarrow } q ) { \Rightarrow } q ) { \Rightarrow } p \lor q \text { 。 }$

(b) $( ( p { \Rightarrow } q ) { \Rightarrow } ( r { \Rightarrow } ( r { \Rightarrow } p ) ) ) { \Rightarrow } ( r { \Rightarrow } ( p { \vee } q ) ) \text { 。 }$

2.31 利用推理规则构造下面推理的证明。

（a）前提: $(p \land \lnot q), \lnot q \lor r, \lnot r$

结论:~p

（b）前提: $p \lor q , p { \leftrightarrow } r , { \sim } q \lor s$

结论:s∨r

（c）前提: $(p \to q) \land (r \to s), (q \to w) \land (s \to x), \sim (w \land x), r$

结论:~p

（d）前提: $p \lor q, q \mathord { \Rightarrow } r, p \mathord { \Rightarrow } s, \mathord { \sim } s$

结论: $( p \lor q ) \land r$

（e）前提: $(p \land q) \Rightarrow r, \sim s \lor p, q$

结论:s⇒r

(f) 前提: ${ \sim } r \lor s , s { \Rightarrow } q , { \sim } q$

结论:q⇔r

（g）前提: $\sim r \Rightarrow (\sim p \lor s), q \Rightarrow \sim s$

结论: $p { \Rightarrow } ( q { \Rightarrow } r )$

2.32 使用附加前提方法证明下述推理形式。

（a）前提: $(p \land q) \Rightarrow r, \sim s \lor p, q$

结论:s⇒r

（b）前提: $p { \Rightarrow } q ,   r { \Rightarrow } s$

结论: $( p \land r ) { \Rightarrow } ( q \land s )$

（c）前提: $p { \Longrightarrow } q$

结论: $( p { \Longrightarrow } { \sim } q ) { \Longrightarrow } { \sim } p$

（d）前提: $p { \Rightarrow } ( q { \Rightarrow } r )$

结论: $( p { \Rightarrow } q ) { \Rightarrow } ( p { \Rightarrow } r )$

（e）前提: $( p \land q ) { \Rightarrow } r$

[page:77]

## 第2章 命题逻辑

结论: $p { \Rightarrow } ( q { \Rightarrow } r )$

(f) 前提: $\sim r \Rightarrow ( \sim p \lor s ) , q \Rightarrow s$

结论: $p { \Rightarrow } ( q { \Rightarrow } r )$

2.33 判断下列命题是否相容。

(a) $p { \Leftrightarrow } q , q { \Rightarrow } r , { \sim } p { \lor } s , { \sim } p { \Rightarrow } s , { \sim } s .$

(b) $p \lor q , \sim r \lor s , \sim q , \sim s .$

2.34 如果合同是有效的，那么张三应受罚。如果张三应受罚，他将破产。如果银行给张三贷款，他就不会破产。事实上，合同有效并且银行给张三贷款了。验证这些前提是否有矛盾。

2.35 使用归谬法证明以下推理。

（a）前提: $p \land q, p \lor r, r \lor s, s \Rightarrow u$

结论:u

（b）前提: $(p \land q) \Rightarrow r, \sim r \lor s, \sim s, p$

结论: $- q$

（c）前提: $p { \Rightarrow } ( q { \Rightarrow } r ) , { \sim } s { \lor } p , q$

结论: $s { \Longrightarrow } r$

（d）前提: $p { \vee } q , p { \Rightarrow } s , q { \Rightarrow } r$

结论: $s \sqrt { r }$

2.36 使用归结法证明以下推理。

（a）前提: $p { \vee } q , p { \Rightarrow } s , q { \Rightarrow } r$

结论: $s \sqrt { r }$

（b）前提: $p { \Rightarrow } ( q { \Rightarrow } r ) , { \sim } s { \lor } p , q$

结论: $s { \Longrightarrow } r$

（c）前提: $p { \Longrightarrow } q$

结论: $( p { \Longrightarrow } { \sim } q ) { \Longrightarrow } { \sim } p$

（d）前提: ${ \sim } r \lor s , s { \Rightarrow } q , { \sim } q$

结论: $q { \leftrightarrow } r$

2.37判断下述推理是否正确:或者是晴天，或者会下雨。如果是晴天，我就会去打球；如果我去打球，那么我就不读书。所以如果我在读书，那么天就在下雨。

2.38 证明下面的推理关系。

（a）如果8是偶数，则7能被2除尽。7不能被2除尽或者7是素数。但是7不是素数，所以8是奇数。

（b）如果我学习，那么我的离散数学课程考试不会不及格。如果我不是沉迷于网络游戏，那么我将会学习。但是我的离散数学课程考试不及格，因此我曾沉迷于网络游戏。

（c）如果今天是星期一，则要进行离散数学或数据结构课程的考试；如果数据结构课的老师生病，则不考数据结构；今天是星期一，并且数据结构的老师生病。所以今天进行离散数学的考试。

[page:78]

## 78

（d）如果公司的利润高，那么公司有一个好经理或它是一个好企业及大体上是个好的经营年份。现在的情况是:公司的利润高而且不是一个好的经营年份。因此公司有一个好经理。

（e）在意甲比赛中，假如有4只球队，其比赛情况如下:若国际米兰队获得冠军，则AC米兰队或尤文图斯队获得亚军；若尤文图斯队获得亚军，国际米兰队不能获得冠军；若拉齐奥队获得亚军，则AC米兰队不能获得亚军；最后，国际米兰队获得冠军。所以，拉齐奥队不能获得亚军。

（f）如果小张和小王去看电影，那么小李也去看电影；小赵不去看电影或者小张看电影；小王去看电影了。因此当小赵去看电影的时候小李也去。

2.39 灵灵、欢欢和乐乐一起去吃早饭，他们每人要的不是包子就是面条，已知:

（1）如果灵灵要的是包子，那么欢欢要的就是面条。

（2）灵灵或乐乐要的是包子，但是不会两人要的都是包子。

（3）欢欢和乐乐不会两人都要面条。

请问:“灵灵要的是面条”这一判断是否正确？

2.40 假定在一个岛上住着3类人:骑士、流氓、普通人。骑士总说真话，流氓总说假话，普通人有时说真话有时说假话。侦探为了找出罪犯，询问了岛上的3个人Amy、Brenda、Claire。侦探知道3个人中有一人犯罪了，但不知是哪个人。他们也知道罪犯是一个骑士，另两个人不是骑士（可能是流氓也可能是普通人）。此外，侦探还记录了如下供述。Amy说:“我是清白的。”Brenda说:“Amy说的是真的。”Claire说:“Brenda不是普通人。”经过分析，侦探找到了罪犯。他是谁？①

[page:79]

# 第3章

## 谓词逻辑

原子命题是命题逻辑中最基本的组成单元，不能对它再作进一步的分解，但同时也无法反映出某些原子命题的共同特征和相互关系。

例如，用p表示命题“小李是大学生”，用q表示命题“小王是大学生”，在命题逻辑的范畴中它们是两个独立的原子命题，p和q之间没有任何关系。但是，命题“小李是大学生”和“小王是大学生”之间有着相同的结构和内在的联系，它们都具有相同的谓语（及宾语）“是大学生”，不同的只是主语，它们都描述了“是大学生”这样一个共同的特性；而使用原子命题表示时并没有能将这一共性刻画出来。

再如著名的苏格拉底三段论:

凡是人都是要死的。

苏格拉底是人。

所以苏格拉底是要死的。

这个推理显然是正确的。但是，如用p、q、r分别表示上面3个命题，由于p∧q⇒r不是永真式，因此它不是正确的推理；也就是说，当p和q都为真时，得不出r一定为真。其根本原因在于命题逻辑不能将命题p、q、r间的内在的联系反映出来。

为了克服命题逻辑的局限性，引入了谓词和量词对原子命题和命题间的相互关系做进一步的剖析，从而产生了谓词逻辑。

谓词逻辑亦称一阶逻辑，它同命题逻辑一样，是数理逻辑中最基础的内容。

## 3.1 谓词与量词

## 3.1.1 谓词

在谓词逻辑中，一般将原子命题分解为个体词和谓词两个部分。

定义3.1 个体词（individual）是一个命题里表示思维对象的词，表示独立存在的具体或抽象的客体。简单地讲，个体词表示各种事物，相当于汉语中的名词。具体的、确定的个体词称为个体常项，一般用a、b、c表示；抽象的、不确定的个体词称为个体变项，一般用x、y、z表示。个体变项的取值范围称作个体域或论域（domain of the discourse），宇宙间一切事物组成的个体域称作全总个体域（universal domain of individuals)。

注:本书在提及论域时，如未特别说明，指的都是全总个体域。

[page:80]

## 离散数学及应用（第2版）

定义3.2 在命题中，表示个体词性质或相互之间关系的词称作谓词（predicate）。可以这样来理解谓词:

如果命题里只有一个个体词，这时表示该个体词性质或属性的词便称为谓词。这是一元（目）谓词，以P(x)、Q(x)等表示。

如果在命题里的个体词多于一个，那么表示这几个个体词间的关系的词称作谓词。这是多元（目）谓词，有n个个体的谓词 $P ( x _ { 1 } , x _ { 2 } , \cdots , x _ { n } )$ 称n元（目）谓词，以 $P ( x , y )$ Q(x, y)、R(x, y, z)等表示。

用谓词表示命题，必须包括个体词和谓词两个部分。例如，在“小李是大学生”中，“小李”“大学生”都是个体词，“是大学生”是谓词。在 $^ { \circ } 9$ 大于 $4 ^ { \prime \prime }$ 中，“9”和“4”都是个体词，“大于”是谓词。

准确地讲，谓词 P(x), Q(x, y)等是命题形式而不是命题。因为既没有指定谓词符号 P、Q的含义，而且个体词x、y也是个体变项而不代表某个具体的事物，从而无法确定P(x)、Q(x,y)的真值。仅当赋予谓词确定含义，并且个体词取定为个体常项时，命题形式才化为命题。如P(x)表示 $^ { \circ } x$ 是素数”，那么 P(7)是命题，真值为 T；Q(x, y)表示 $^ { \circ } x$ 等于 $y ^ { \prime \prime }$那么 Q(4,5)是命题，真值为F。

有时将P(3)、Q(2,3)这样不包含个体变项的谓词称作零元谓词，当赋予谓词确定含义时零元谓词为命题。因而可将命题看成是特殊的谓词。

【例3.1】将下列命题在一阶逻辑中用零元谓词符号化，并讨论其真值。

（a）8是素数。

（b）如果3大于4，则2大于6。

解.（a）设一元谓词 P(x)为 $^ { \circ } x$ 是素数”，则“8是素数”可符号化为零元谓词P(8)，真值为假。

(b）设二元谓词 G(x, y)为“x大于 $y ^ { \flat }$ ，则“如果3大于4，则2大于 $6 ^ { \bullet }$ 符号化为零元谓词 $G ( 3 , 4 ) { \Rightarrow } G ( 2 , 6 )$ ，由于G(3,4)为假，所以该命题为真。

## 3.1.2 量词

用来表示个体数量的词是量词（quantification），给谓词加上量词称作谓词的量化，可看作是对个体词所加的限制、约束的词，但不是对数量一个、二个、三个等的具体描述，而是讨论两个最通用的数量限制词。

定义3.3 符号“∀”称作全称量词（universal quantification)，读作“所有的 $x ^ { \prime \prime }$ “任意 $x ^ { \flat }$ 或“一切 $x ^ { \flat }$ ，含义相当于自然语言中的“任意的”“所有的”“一切的”“每一个” “凡”等。(∀x)P(x)意指对论域D中的所有个体都具有性质 $P _ { \odot }$ 命题(∀x)P(x)当且仅当对论域中的所有x来说P(x)均为真时方为真。

定义3.4 符号“∃”称作存在量词（existential quantification)，读作“存在 $x ^ { \prime \prime }$ ，含义相当于自然语言中的“某个”“存在”“有的”“至少有一个”“有些”等。(∃x)P(x)意指对论域D中至少有一个个体具有性质 $P _ { \odot }$

【例3.2】假设个体x的论域是全总个体域，“一切事物都是运动的”可以形式化描述为(∀x)(x 是运动的)。若以 P(x)表示 $^ { \circ } x$ 是运动的”，则可写作 $( \forall x ) ( P ( x ) )$ ，或简写成

[page:81]

## 第3章 谓词逻辑

(∀x)P(x)或∀xP(x)。

【例3.3】假设个体x的论域是全总个体域，“有的事物是水果”可以形式化描述为(∃x)(x是水果)。若以Q(x)表示“x是水果”，那么这句话就可写成(∃x)Q(x)，或简写成(∃x)Q(x)或∃xQ(x)。

## 3.2 谓词公式及分类

与命题逻辑类似，可以对谓词逻辑公式进行分类。

定义3.5 谓词逻辑中的谓词公式（well formed formula，简记为wff）递归地定义为

（1）命题常项、命题变项和原子谓词公式（不含联结词的谓词）是谓词公式。

（2）如果A是谓词公式，则~A也是谓词公式。

（3）如果A和B是谓词公式，则由逻辑联结词联结A和B的符号串也是谓词公式，如(A∧B)、(A∨B)、(A⇒B)、(A⇔B)等。

（4）若A是谓词公式，且A中无∀x及∃x出现，则(∀x)A(x)、(∃x)A(x)也是谓词公式。

（5）只有有限次地应用（1）～（4）构成的符号串才是谓词公式。

谓词公式也称为合式公式，简称公式。

【例 3.4】~p、~P(x, y)∧Q(x)、(∀x)(F(x)⇒G(x))、(∃x)(A(x)⇒(∀y)F(x, y))都是合式公式，而(∃x)(∀x)F(x)不是合式公式。

类似于命题逻辑中对命题公式进行的真值指派，可以对谓词逻辑公式赋予不同的解释。

定义3.6 谓词公式的一个解释（interpretation）由下面4部分组成:

（1）非空的论域D。

(2)D中一部分特定元素。

(3）D上一些特定的函数。

(4）D上一些特定的谓词。

注:

（a）解释规定了相应的个体常项、个体变项、函数符号和谓词符号的具体意义以及个体变项的取值范围。

（b）如果两个解释的4个组成部分中至少有一部分不同，则这两个解释是不同的。

（c）一个公式可以用不同的解释给定含义，一个解释可以对应多个不同的公式。

【例3.5】 谓词公式(∃x)P(f(x),2)的解释1为:论域D是正整数集合，2是一个特定的整数，函数f(x)=4x，谓词P(x,y)表示 x<y，那么在解释1下该命题是假命题。

解释2为:论域D为实数集，2是一个特定的实数，函数 $f(x) = x^{2}$ ，谓词 P(x, y)表示x=y，那么在解释2下该命题是真命题。

类似于命题逻辑，也可以对谓词逻辑公式进行分类。

定义3.7 设A为一个谓词公式，若A在任何解释下真值均为真，则称A为普遍有效的公式或逻辑有效式（logically valid formula）。若A在任何解释下真值均为假，则称

[page:82]

## 82

A为不可满足的（unsatisfiable）公式或矛盾式；若至少存在一个解释使A为真，则称A为可满足的（satisfiable）公式。

注:逻辑有效式一定是可满足式，反之不然。

【例3.6】(∀x)(P(x)∨~P(x))和(∀x)P(x)⇒P(y)都是普遍有效公式 $( \forall x ) ( P ( x ) \land P ( x ) )$和 $( \forall x ) P ( x ) \land ( \exists y ) \sim P ( y )$ 都是不可满足公式。例3.5中的谓词公式是非普遍有效的可满足公式。

谓词逻辑的判定问题指的是谓词逻辑任一公式的普遍有效性的判定问题。若说谓词逻辑是可判定的，就要求给出一个可行的方法，使得对任一谓词公式都能判定是否是普遍有效的。

在命题逻辑中，一个公式是否是重言式是很容易验证的—至少可以使用真值表列出该公式在所有真值指派下的真值。但是对于谓词逻辑的判定问题，情况大相径庭，对此有如下重要结论。

定理3.1（丘奇-图灵(Church-Turing)定理)谓词逻辑是不可判定的(undecidability of first-orderlogic)。即:对任一谓词公式而言，没有一个可行的方法判明它是否是普遍有效的。

注:但是谓词逻辑的某些子类是可判定的，下面就主要介绍这些可判定的子类。

定义 3.8 设命题公式 $A _ { 0 }$ 含命题变项 $p _ { 1 } , \: p _ { 2 } , \: \cdots , \: p _ { n }$ ，用n个谓词公式 $A_{1}, A_{2}, \cdots, A_{n}$分别处处代换 $p _ { 1 } , p _ { 2 } , \cdots , p _ { n }$ ，所得公式A称为 $A _ { 0 }$ 的代换实例。

【例3.7】 $P(y) \Rightarrow Q(z)  和  (\forall x)P(x) \Rightarrow (\exists x)Q(x)$ 都是命题公式 $p { \Longrightarrow } q$ 的代换实例。

定理3.2 命题公式中的重言式的代换实例都是逻辑有效式，在谓词公式中可仍称为重言式；命题公式中的矛盾式的代换实例都是矛盾式。

证明. 设命题公式 $A _ { 0 }$ 含命题变项 $p _ { 1 } , p _ { 2 } ,   \cdots , p _ { n }$ ，若 $A _ { 0 }$ 为重言式，则不论 $p _ { 1 } , p _ { 2 } , \cdots , p _ { n }$的真值如何， $A _ { 0 }$ 的真值总为 $\mathrm { T } _ { \circ }$ 而对于谓词公式 ${ \mathcal { A } } _ { 1 } ,   { \mathcal { A } } _ { 2 } ,   \cdots ,   { \mathcal { A } } _ { n } ,$ ，无论在何种解释下，它们的真值也都是或者为T或者为F，故用 $A_{1},   A_{2},   \cdots,   A_{n}$ 分别处处代换 $p _ { 1 } ,   p _ { 2 } ,   \cdots ,   p _ { n }$ 后所得的代换实例的真值也总为T。

同理可证明，矛盾式的代换实例仍为矛盾式。

【例3.8】判断以下公式类型。

(a) $( \forall x ) P ( x ) { \Rightarrow } ( \exists x ) P ( x )$ 0

(b)(∀x)P(x)⇒((∀x)(∃y)Q(x,y)⇒(∀x)P(x))。

(c) ~(P(x,y)⇒Q(x,y))∧Q(x,y)。

(d) (∀x)(∃y)Q(x,y)⇒(∃x)(∀y)Q(x,y)。

解.（a）是逻辑有效式，意指如果论域D中所有个体都具有性质P，则一定至少有一个个体具有性质 $P _ { \circ }$

（b）是逻辑有效式，是命题逻辑中重言式 $p { \Rightarrow } ( q { \Rightarrow } p )$ 的代换实例。

（c）是不可满足式，是命题逻辑中矛盾式 ${ \sim } ( p { \Rightarrow } q ) { \land } q$ 的代换实例。

（d）不是逻辑有效式也不是不可满足式，是可满足式:假设论域是正整数集合，当谓词 $Q ( x , y )$ 表示 $x = y$ 时， $( \forall x ) ( \exists y ) Q ( x , y )$ 为真， $( \exists x ) ( \forall y ) Q ( x , y )$ 为假，蕴涵式为假；当谓词 $Q ( x , y )$ 表示 $x \leq y$ 时， $( \forall x ) ( \exists y ) Q ( x , y )$ 为真， $( \exists x ) ( \forall y ) Q ( x , y )$ 为真，蕴涵式为真。

[page:83]

## 第3章 谓词逻辑

定义3.9 设A为谓词公式，B为A中的一个连续的符号串，且B为谓词公式，则称B为A的子公式（sub formula）。

定义3.10 设A为一个谓词公式，(∀x)P(x)或(∃x)P(x)为公式A的子公式，此时紧跟在∀、∃之后的x称为量词的指导变项或作用变项，P(x)称为相应量词的作用域或辖域(scope)，即为量词所约束的范围。在辖域中x的一切出现均称为约束出现，受指导变项所约束。所有约束出现的变项称为约束变项（boundedvariable)；在A中除了约束变项外出现的变项均称为自由变项（free variable)，不受指导变项的约束。

注:若公式中无自由变项，公式即为命题。

【例3.9】（a）(∀x)R(x, y)中，R(x, y)是(∀x)的辖域，x是约束变项，y是自由变项。(b) $( \forall x ) P ( x ) \lor Q ( x , y )$ 中，P(x)是(∀x)的辖域，P(x)中的 x是约束变项， $Q ( x , y )$ 中的 x和y是自由变项。

(c) $( \exists x ) ( ( \forall y ) P ( x , y ) ) 中$ ，P(x, y)是(∀y)的辖域，(∀y)P(x, y)是(∃x)的辖域，x、y都是约束变项。

(d) $( \forall x ) ( ( \exists y ) L ( x ,   y ) { \Rightarrow } ( \forall y ) H ( x ,   y ) )$ 中，(∀x)的辖域是 $( ( \exists y ) L ( x , y ) \Rightarrow ( \forall y ) H ( x , y ) )$ ，(∃y)的辖域是 L(x, y)，(∀y)的辖域是 H(x, y)，L(x, y)和 H(x, y)中的 x 都受(∀x)约束，L(x, y)中的y受(∃y)约束，H(x,y)中的y受(∀y)约束，这两者是不同的。

## 3.3 自然语言形式化

命题逻辑表达问题的能力仅限于联结词的使用；而谓词逻辑由于变项、谓词、量词的引入具有比命题逻辑强得多的表达问题的能力，已成为描述计算机所处理的知识的有力工具。

其中首要的工作就是问题本身的形式化描述。类似命题逻辑，将一个用自然语言描述的命题表示成谓词公式的形式，称为谓词逻辑中的自然语言形式化。

基本方法如下:

（1）要将问题分解成一些原子命题和逻辑联结符。

（2）分解出各个原子命题的个体词、谓词和量词。

（3）按照合式公式的表示规则翻译出自然语句。

【例3.10】将下述语句翻译为谓词公式，使用全总个体域。

（a）所有的素数都是整数。

（b）有的素数是奇数。

（c）并非所有整数都是素数。

（d）没有奇数是偶数。

（e）所有的素数或者是奇数，或者等于2。

（f）存在一个奇数，比所有整数都大。

（g）存在唯一的偶素数。

（h）至多有一个偶素数。

（i）哥德巴赫（Goldbach）猜想:每一个大于2的偶数都可以表示为两个素数的和。

[page:84]

## 离散数学及应用（第2版）

解.令谓词P(x)表示“x是整数”，Q(x)表示“x是奇数”，R(x)表示“x是偶数”，S(x)表示“x是素数”，E(x, y)表示“x=y”，G(x, y)表示“x>y”。

## （a）这句话可以形式化为 $( \forall x ) ( S ( x ) { \Rightarrow } P ( x ) )$

需注意的是这句话不能形式化为 $( \forall x ) ( S ( x ) \triangle P ( x ) )$ ，这个公式的意思是说，对宇宙间所有的事物x而言，x既是素数又是整数。

一般地讲，“所有的A是B”“是A的都是B”“一切A都是 $\mathbf { B } ^ { \prime \prime }$ 这类语句的形式描述只能使用“⇒”而不能使用“∧”。

## (b）这句话的形式化描述应为(∃x)(S(x)∧Q(x))。

需注意的是不能使用 $( \exists x ) ( S ( x ) { \Rightarrow } Q ( x ) )$ ，一般地讲，“有的A是 $\mathbf { B } ^ { \prime \prime }$ 这类语句的形式化描述只能使用“∧”而不能使用“⇒”。

(c）这句话可以形式化为~(∀x)(P(x)⇒S(x))；也可以把这句话理解为“有的整数不是素数”，这时应形式化为 $( \exists x ) ( P ( x ) \land \sim S ( x ) )$ 。它们都是正确的，其理由将在3.4节中阐述。

（d）这句话可以形式化为 $\neg ( \exists x ) ( Q ( x ) \land R ( x ) )$ 。也可以把这句话理解为“所有的奇数都不是偶数”或者“所有的偶数都不是奇数”，这时应形式化为 $( \forall x ) ( Q ( x ) { \Rightarrow } { \sim } R ( x ) )$ 或者(∀x)(R(x)⇒~Q(x))，它们都是正确的。

(e）这句话可以形式化为 $( \forall x ) ( S ( x ) { \Rightarrow } ( E ( x , 2 ) \lor Q ( x ) ) )$ C

(f)这句话的含义是“存在一个个体x，它是奇数；而且，对于任意个体y，如果它是整数，那么一定有 $y < x^{''}$ ，因此可以形式化为 $( \exists x ) ( Q ( x ) \land ( \forall y ) ( P ( y ) { \Rightarrow } G ( x , y ) ) )$

(g）这句话的含义是“存在一个个体x，它既是偶数又是素数；而且，如果还有个体y也是既是偶数又是素数，那么一定有 $x = y$ ，因此可以形式化为(∃x)(S(x)∧R(x)∧ $( \forall y ) ( S ( y ) \land R ( y ) \Rightarrow E ( x , y ) ) )$

（h）这句话和（g）的区别在于允许不存在偶素数，因此在形式化后也是不同的，应该表示为 $( \forall x ) ( S ( x ) \land R ( x ) \Rightarrow ( \forall y ) ( S ( y ) \land R ( y ) \Rightarrow E ( x , y ) ) )$ 。这句话也可以理解为“不存在不相等的两个个体，它们都既是偶数又是素数”，可形式化为 $\neg ( \exists x ) ( \exists y ) ( S ( x ) \land R ( x ) \land S ( y ) \land$ R(y)∧~E(x, y))。

(i) 形式化为 $( \forall x ) ( R ( x ) \land G ( x , 2 ) \Rightarrow ( \exists y ) ( \exists z ) ( S ( y ) \land S ( z ) \land E ( x , y + z ) ) ) \circ$

【例3.11】假设论域是整数集，将下述语句翻译为谓词公式，并判断其真值。

（a）至少存在一个偶数，且至少存在一个奇数。

（b）至少有一个整数既是偶数又是奇数。

（c）对于任一个整数而言，它或者是偶数，或者是奇数。

（d）所有整数都是偶数或者所有整数都是奇数。

（e）对于任一个整数而言，都存在比它小的整数。

（f）存在一个整数，满足任何整数都大于它。

解.令谓词 P(x)表示“x 是奇数”，Q(x)表示“x 是偶数”，E(x, y)表示“x=y”， $G ( x , y )$表示“x>y”。

(a）这句话可以形式化为(∃x)P(x)∧(∃x)Q(x)，是真命题。

(b）这句话可以形式化为 $( \exists x ) ( P ( x ) \land Q ( x ) )$ ，是假命题。

（c）这句话可以形式化为 $( \forall x ) ( P ( x )   \lor   Q ( x ) )$ ，是真命题。

[page:85]

## 第3章 谓词逻辑

（d）这句话可以形式化为 $( \forall x ) P ( x ) \lor ( \forall x ) Q ( x )$ ，是假命题。

(e）这句话可以形式化为(∀x)(∃y)G(x,y)，是真命题。

(f) 这句话可以形式化为(∃y)(∀x)G(x,y)，是假命题。

上述例子说明(∃x)P(x)∧(∃x)Q(x)和(∃x)(P(x)∧Q(x))、(∀x)(P(x)∨Q(x))和(∀x)P(x)∨ (∀x)Q(x)、(∀x)(∃y)G(x,y)和(∃y)(∀x)G(x,y)含义不同。这些都是容易混淆的，须注意加以区别。

【例3.12】假设论域是全总个体域，将下述语句翻译为谓词公式。

（a）没有人可以永生不死。

（b）天下乌鸦一般黑。

（c）金子一定闪光，但闪光的不一定是金子。

（d）所有的大学生都会说英语，有一些大学生会说法语。

## 解.

(a）设 P(x)表示“x是人”，Q(x)表示“x会死”。原语句可表示成~(∃x)(P(x)∧~Q(x))。

(b）设F(x)表示“x是乌鸦”，G(x, y)表示“x与y一般黑”。原语句可表示成(∀x)(∀y) $( F ( x ) \land F ( y ) \Rightarrow G ( x , y ) )$ ，或者 $( \exists x ) ( \exists y ) ( F ( x ) \land F ( y ) \land \neg G ( x , y ) )$ 即不存在个体 x、y都是乌鸦但不一般黑，这两句话含义是相同的。

(c）设G(x)表示“x是金子”，L(x)表示“x会闪光”，原语句可表示成 $i ( \forall x ) ( G ( x ) { \Rightarrow } L ( x ) )$ $\bigwedge ( \exists x ) ( L ( x ) \land \neg G ( x ) )$ C

(d）设S(x)表示“x是大学生”，E(x)表示“x会说英语”，F(x)表示“x会说法语”，原语句可表示成 $( \forall x ) ( S ( x ) { \Rightarrow } E ( x ) ) \land ( \exists x ) ( S ( x ) \land F ( x ) )$

如果引入二元谓词 C(x, y)表示“x可以说y这种语言”，那么原句子也可以表示为$( \forall x ) ( S ( x ) { \Rightarrow } C ( x ,$ 英语)) $\wedge ( \exists x ) ( S ( x ) \wedge C ( x ,$ 法语))。

【例3.13】假设论域是实数集，将下述语句翻译为谓词公式。

(a）函数f(x)趋向于a时的极限值是b。

(b）函数f(x)在点 $x _ { 0 }$ 处连续。

（c）任意两个实数之间都存在一个有理数。

## 解.

(a） 原语句可表示成 $( ( \forall \varepsilon ) ( \varepsilon \textgreater 0 \textrightarrow ( \exists \delta ) ( \delta \textgreater 0 \land ( \forall x ) ( | x - a | \textless \delta \textrightarrow | f ( x ) - b | \textless \varepsilon ) ) )  。$

(b)原语句可表示成(∀ε)(ε>0⇒(∃δ)(δ>0∧(∀x)(|x-x0|<δ⇒|f(x)-f(x0)|<ε)))。

(c）设P(x)表示“x是有理数”，则原语句可表示成 $( \forall x ) ( \forall y ) ( ( x { > } y ) { \Rightarrow } ( \exists z ) ( P ( z ) \land ( x { > } z )$ ∧(z>y)))。

此例中采用了易于理解的谓词表示形式。

总结上述各例，可以得到以下规律:

（a）“所有的 A是 $\mathrm{B}^{\mathrm{''}\ \mathrm{d}\mathrm{f}}$ 是A的都是B”“一切A都是 $\mathbf { B } ^ { \prime \prime }$ 应形式化为 $( \forall x ) ( A ( x ) { \Rightarrow }$ B(x))。

（b）“有的A是B”应形式化为 $( \exists x ) ( A ( x ) \land B ( x ) )$

（c）“所有的 A都不是 $\mathrm{B}^{ 外纶 }$ 是 A 的都不是 B”“一切 A都不是 $\mathbf { B } ^ { \prime \prime }$ 应形式化为$( \forall x ) ( A ( x ) \Rightarrow \sim B ( x ) )  或者  \sim ( \exists x ) ( A ( x ) \land B ( x ) ).$ 0

[page:86]

## 离散数学及应用（第2版）

(d）“有的A不是B”应形式化为 $( \exists x ) ( A ( x ) \land \sim B ( x ) )  或者  \sim ( \forall x ) ( A ( x ) \Rightarrow B ( x ) )$

(e)“只有一个 $\mathrm { A } ^ { \prime \prime }$ 应形式化为 $( \exists x ) ( A ( x ) \land ( \forall y ) ( A ( y ) \Rightarrow \operatorname { E q u a l } ( x , y ) ) )$

(f)“若存在A则唯一”应形式化为 $( \forall x ) ( A ( x ) { \Rightarrow } ( \forall y ) ( A ( y ) { \Rightarrow } \operatorname { E q u a l } ( x , y ) ) )$

（g）“所有的A和B都具有关系 $\mathbf { C } ^ { \pmb { \mathscr { s } } }$ 应形式化为 $( \forall x ) ( \forall y ) ( A ( x ) \land B ( y ) \Rightarrow C ( x , y ) )$

（h）“任何一个A都存在一个B与之对应满足性质 $\mathbf { C } ^ { \prime \prime }$ 应形式化为 $( \forall x ) ( A ( x ) { \Rightarrow }$ $( \exists y ) ( B ( y ) \land C ( x , y ) ) )$ 0

## 3.4 谓词逻辑的等值演算

如例3.12（b）所示，有些命题的形式化表述可能不止一种，但它们的含义都是相同的。因此需在谓词逻辑中也引入“等值”的概念。

定义3.11 设A、B 是两个谓词公式，若A↔B 是普遍有效的公式，则称A与 B等值，记作 $A { \equiv } B _ { \circ }$

注:类似于命题逻辑，两个谓词公式A、B等值当且仅当在任何解释下，A和B的真值都相同。

相比命题逻辑，量词和谓词的引入使得谓词演算应用更广泛，特别是在计算机科学、人工智能等领域，谓词逻辑是表示知识、实现推理的有力工具。

类似于命题逻辑，谓词逻辑的等值演算仍是以基本等值式为基础，应用等值演算规则逐步推演。

谓词逻辑中的基本等值式主要分两类:其一是从命题公式移植来的等值式，即命题逻辑中基本等值式的代换实例，如 $( \forall x ) F ( x ) { \Rightarrow } ( \exists y ) G ( y ) { \equiv } \sim ( \forall x ) F ( x ) \lor ( \exists y ) G ( y ) { 和 } \sim ( ( \forall x ) F ( x )$ $\bigvee ( \exists y ) G ( y ) ) \equiv \sim ( \forall x ) F ( x ) \land \sim ( \exists y ) G ( y )$ 等；另一类是谓词逻辑所特有的等值式，与量词有关。

定理3.3（消去量词等值式）设论域 $D { = } \{ a _ { 1 } , a _ { 2 } , \cdots , a _ { m } \}$ 是有限集合，有

(a) $( \forall x ) A ( x ) = A ( a _ { 1 } ) \land A ( a _ { 2 } ) \land \cdots \land A ( a _ { m } )$

(b) $( \exists x ) A ( x ) = A ( a _ { 1 } ) \lor A ( a _ { 2 } ) \lor \cdots \lor A ( a _ { m } ) .$ C

注:这一组等值式表明对于有限论域而言，全称量词与合取式相对应，存在量词则对应于析取式。

【例3.14】设论域 $D { = } \{ a , b , c \}$ ，消去下面公式中的量词。

(a) $( \forall x ) ( P ( x )   \lor   Q ( x ) )$

(b) $( \forall x ) ( P ( x ) { \Rightarrow } ( \exists y ) Q ( y ) ) \text { 。 }$

(c) $( \exists x ) ( \forall y ) R ( x ,   y ) \text { 。 }$

解.

$$\begin{aligned}& (a)   \left( \forall x \right) \left( P(x) \lor Q(x) \right) \\& \quad = \left( P(a) \lor Q(a) \right) \land \left( P(b) \lor Q(b) \right) \land \left( P(c) \lor Q(c) \right) \\& (b)   \left( \forall x \right) \left( P(x) \mathord{\rightarrow} \left( \exists y \right) Q(y) \right) \\& \quad = \left( P(a) \mathord{\rightarrow} \left( \exists y \right) Q(y) \right) \land \left( P(b) \mathord{\rightarrow} \left( \exists y \right) Q(y) \right) \land \left( P(c) \mathord{\rightarrow} \left( \exists y \right) Q(y) \right) \\& \quad = \left( \mathord{\sim} P(a) \lor \left( \exists y \right) Q(y) \right) \land \left( \mathord{\sim} P(b) \lor \left( \exists y \right) Q(y) \right) \land \left( \mathord{\sim} P(c) \lor \left( \exists y \right) Q(y) \right) \\& \quad = \left( \mathord{\sim} P(a) \land \mathord{\sim} P(b) \land \mathord{\sim} P(c) \right) \lor \left( \exists y \right) G(y) \quad ( 分配律 )\end{aligned}$$

[page:87]

## 第3章 谓词逻辑

$$\begin{aligned}&=(\neg P(a)\land\neg P(b)\land\neg P(c))\lor(G(a)\lor G(b)\lor G(c)) \\(\neg) & (\exists x)(\forall y)R(x,y) \\&=(\exists x)(R(x,a)\land R(x,b)\land R(x,c)) \\&=(R(a,a)\land R(a,b)\land R(a,c))\lor(R(b,a)\land R(b,b)\land R(b,c))\lor(R(c,a)\land R(c,b)\land R(c,c)) \\ 或者  \\& \quad (\exists x)(\forall y)R(x,y) \\&=((\forall y)R(a,y))\lor((\forall y)R(b,y))\lor((\forall y)R(c,y)) \\&=(R(a,a)\land R(a,b)\land R(a,c))\lor(R(b,a)\land R(b,b)\land R(b,c))\lor(R(c,a)\land R(c,b)\land R(c,c))\end{aligned}$$

定理3.4 （量词否定等值式/德·摩根律）设A(x)是含x自由出现的公式，则

(a)~(∀x)A(x)≡(∃x)~A(x)。

(b)~(∃x)A(x)≡(∀x)~A(x)。

即，“不是论域中所有个体都具有性质 $A ^ { \prime \prime }$ 和“论域中至少存在一个个体不具有性质$A ^ { \prime \prime }$ 二者含义是完全相同的，“论域中所有个体都不具有性质 $A ^ { \prime \prime }$ 和“论域中不存在具有性质A的个体”二者含义也是完全相同的。

当论域 $D { = } \{ a _ { 1 } , a _ { 2 } , \cdots , a _ { m } \}$ 是有限集合时，有

$$\begin{aligned} &\neg ( \mathcal{A}(a_{1}) \backslash \mathcal{A}(a_{2}) \backslash \cdots \backslash \mathcal{A}(a_{m})) {=} \neg ( \forall x) \mathcal{A}(x) {=} ( \exists x) \neg \mathcal{A}(x) {=} \neg \mathcal{A}(a_{1}) \lor \neg \mathcal{A}(a_{2}) \lor \cdots \lor \neg \mathcal{A}(a_{m})\\ &\neg ( \mathcal{A}(a_{1}) \backslash \mathcal{A}(a_{2}) \lor \cdots \lor \mathcal{A}(a_{m})) {=} \neg ( \exists x) \mathcal{A}(x) {=} ( \forall x) \neg \mathcal{A}(x) {=} \neg \mathcal{A}(a_{1}) \land \neg \mathcal{A}(a_{2}) \land \cdots \land \neg \mathcal{A}(a_{m})\\ \end{aligned}$$

即是命题逻辑中德·摩根律的表现形式。

定理3.5（量词辖域收缩与扩张等值式）设A(x)是含x自由出现的公式，谓词公式B 中不含x的出现，则有

(a) $( \forall x ) ( A ( x ) \lor B ) { = } ( \forall x ) A ( x ) \lor B .$

(b) $( \exists x ) ( A ( x ) \lor B ) { = } ( \exists x ) A ( x ) \lor B \text { 。 }$

(c) $( \forall x ) ( A ( x ) \land B ) = ( \forall x ) A ( x ) \land B$

(d) $( \exists x ) ( A ( x ) \land B ) { = } ( \exists x ) A ( x ) \land B \text { 。 }$

证明.仅证明（a），余者类似。

（a）假设在某一解释I下， $( \forall x ) ( A ( x ) \lor B )$ 为真，于是对任一x∈D有 $A ( x ) \vee B$ 为真。

如果B为真，则(∀x)A(x)∨B为真。

如果 B 为假，则对于任一 x∈D有A(x)为真，于是(∀x)A(x)为真，于是 $( \forall x ) A ( x ) { \vee } B$为真。

假设在某一解释I下， $( \forall x ) ( A ( x ) \lor B )$ 为假，于是存在x∈D使得 ${ \mathcal { A } } ( x ) { \bigvee } B$ 为假，则B和A(x)取值都为假。于是 $B \in (\forall x)A(x)$ 都为假，即 $( \forall x ) A ( x ) { \vee } B$ 为假。 □

定理3.6（量词分配等值式）设A(x)、B(x)是含x自由出现的谓词公式，则有

(a) $( \forall x ) ( A ( x ) \land B ( x ) ) { = } ( \forall x ) A ( x ) \land ( \forall x ) B ( x ) .$

(b) $( \exists x ) ( A ( x ) \lor B ( x ) ) { \equiv } ( \exists x ) A ( x ) \lor ( \exists x ) B ( x ) .$

证明.仅证明∀对∧的分配律。假设在某一解释I下 $( \forall x ) ( A ( x ) \land B ( x ) )$ 为真，于是对任$一  x{\in} D$ 有 $A(x) \wedge B(x)$ 为真，即A(x)为真且B(x)也为真，从而 $( \forall x ) A ( x ) \land ( \forall x ) B ( x )$ 为真。

反过来，如果 $( \forall x ) A ( x ) \land ( \forall x ) B ( x )$ 在一某解释I下为真，则(∀x)A(x)和(∀x)B(x)均为真，于是对任 $一  x{\in} D$ 有A(x)和 B(x)均为真，即 $( \forall x ) ( A ( x ) \mathop { \wedge }   B ( x ) )$ 为真。

[page:88]

## 88

∃对∨的分配律可类似证明。 □

注:

（a）以上两等值式的成立，实际上也反映了全称量词∀与合取∧的对应，存在量词3与析取√的对应，以及合取∧、析取√这两种运算都满足结合律、交换律。

（b）∀对∨不满足分配律，∃对∧不满足分配律。即 $( \forall x ) ( \forall y ) ( A ( x ) \lor B ( y ) )$ 与$( \forall x ) ( A ( x ) \lor B ( x ) )$ 不等值， $( \exists x ) ( \exists y ) ( A ( x ) \land B ( y ) ) \overline{ \mathrm{与} } ( \exists x ) ( A ( x ) \land B ( x ) )$ 不等值（可参看例3.11）。

定理 3.7 设 $\mathcal { A } ( x , y )$ 是含x、y自由出现的谓词公式，则有

(a) $( \forall x ) ( \forall y ) A ( x , y ) { = } ( \forall y ) ( \forall x ) A ( x , y ) .$ 0

(b) $( \exists x ) ( \exists y ) A ( x , y ) { = } ( \exists y ) ( \exists x ) A ( x , y )  。$

这组等值式的证明将在3.6节中作为例题给出（例3.24）。

注:这组等值式表明相同量词与排列的次序无关，但是对于不同量词，不能随意更换次序，即 $( \forall x ) ( \exists y ) A ( x , y ) \mathrm {  与  } ( \exists y ) ( \forall x ) A ( x , y )$ 不等值（可参看例3.11）。

定义3.12 在仅含有联结词~、∧、√的谓词公式A中，将∨换成∧，将∧换成∨，将全称量词∀换作存在量词∃，将存在量词∃换作全称量词∀，若包含F和T亦相互取代，所得谓词公式称为A的对偶式（dual），记作A*。

谓词逻辑中的对偶依然满足。

定理3.8（对偶原理）设A、B为两个仅含有联结词~、∧、√的n元谓词公式，若$A { \equiv } B$ ，则 $\boldsymbol { \mathcal { A } } ^ { * } { \equiv } \boldsymbol { \mathcal { B } } ^ { * }$ 0

例如，由 ${ \sim } ( \forall x ) P ( x ) { \equiv } ( \exists x ) { \sim } P ( x )$ 可得 $\neg ( \exists x ) P ( x ) { \equiv } ( \forall x ) { \sim } P ( x )$ 0

谓词逻辑包括以下3条等值演算规则。

定理3.9（置换规则）设 $\varPhi ( A )$ 是含谓词公式A 的公式，Φ(B)是用谓词公式B取代$\varPhi ( A )$ 中的A（不一定是每一处）之后得到的谓词公式，若A=B，则 $\Phi ( A ) { = } \Phi ( B )$

谓词逻辑中的置换规则与命题逻辑中的置换规则形式上完全相同，只是在这里A、B是谓词公式。

同一个个体变项符号，如例3.9（b）的公式 $( \forall x ) P ( x ) \lor Q ( x , y )$ 的x既有约束出现又有自由出现，容易引起概念上的混淆。为避免这种情况，引入了下面的代替规则和换名规则，使得同一个个体变项符号在一个公式中只呈现一种形式，要么为约束出现，要么为自由出现；同时使不同的量词所约束的个体变项不同名，便于计算机处理。

定理3.10（代替规则）将谓词公式A中某个自由出现的个体变项的所有自由出现改成A中未曾出现的某个个体变项符号，其余部分不变，记所得谓词公式为A'，则 $A { \equiv } A ^ { \prime }$

定理3.11（换名规则）将谓词公式A中某量词的指导变项及其在辖域内的所有约束出现改成该量词辖域内未曾出现的某个个体变项符号，其余部分不变，记所得谓词公式为A'，则 $A { \equiv } A ^ { \prime }$

即 $( \forall x ) A ( x ) = ( \forall y ) A ( y ) , \quad ( \exists x ) A ( x ) = ( \exists y ) A ( y )$ 。这是不难理解的，因为在同一论域D上，“对一切个体 x，x具有性质 $P ^ { \prime \prime }$ 同“对一切个体y，y具有性质 $P ^ { \prime \prime }$ 这两者除变项 x 和y的区别外并无差异，从而 $( \forall x ) A ( x )$ 与 $( \forall y ) A ( y )$ 有相同的真值。

表3.1对于代替规则和换名规则进行了比较。

[page:89]

## 第3章 谓词逻辑

表3.1 代替规则和换名规则的比较<table><tr><td>比较项</td><td>代替规则</td><td>换名规则</td></tr><tr><td>使用对象</td><td colspan=2>任一谓词公式</td></tr><tr><td>改名对象</td><td>自由变项</td><td>指导变项及其在辖域内的所有约束出现</td></tr><tr><td>改名方式</td><td>对公式中出现的所有同名的自由变项进行改名</td><td>对指导变项及其量词辖域中出现的约束变项处进行改名</td></tr><tr><td>改名限制</td><td>公式中未曾出现的某个个体变项符号</td><td>新的变项符号应是该量词辖域内未曾出现的</td></tr><tr><td>改名结果</td><td colspan=2>与原公式等值</td></tr></table>

【例3.15】将公式 $( \forall x ) F ( x ,   y ,   z ) { \Rightarrow } ( \exists y ) G ( x ,   y ,   z )$ 化为与之等值的公式，使其没有既是约束出现又是自由出现的个体变项符号。

$$\begin{align*} 解 . & (\forall x)F(x,y,z){\Rightarrow}(\exists y)G(x,y,z) \\=& (\forall u)F(u,y,z){\Rightarrow}(\exists y)G(x,y,z) \quad & ( 换名规则 ) \\=& (\forall u)F(u,y,z){\Rightarrow}(\exists v)G(x,v,z) \quad & ( 换名规则 ) \\ 或者  \\& (\forall x)F(x,y,z){\Rightarrow}(\exists y)G(x,y,z) \\=& (\forall x)F(x,u,z){\Rightarrow}(\exists y)G(x,y,z) \quad & ( 代替规则 ) \\=& (\forall x)F(x,u,z){\Rightarrow}(\exists y)G(v,y,z) \quad & ( 代替规则 )\end{align*}$$

使用这两类基本等值式和上述3条规则，可以进行谓词逻辑的等值演算。

【例3.16】 证明以下等值式成立。

$$(a) \quad (\forall x)(\forall y)(A(x) \lor B(y)) = (\forall x)A(x) \lor (\forall x)B(x)$$

解.

$$\begin{align*}& (a)  \; (\forall x)(\forall y)(A(x) \lor B(y)) \\&\quad = (\forall x)(A(x) \lor (\forall y)B(y)) \quad &( 量词锗域收缩等值式 ) \\&\quad = (\forall x).4(x) \lor (\forall y)B(y) \quad &( 量词锗域收缩等值式 ) \\&\quad = (\forall x).4(x) \lor (\forall x)B(x) \quad &( 换名规则 )\end{align*}$$

$$\begin{align*}& (b)  (\exists x)(A(x){\Rightarrow}B(x)) \\&\quad = (\exists x)(\neg A(x) \lor B(x)) \quad &( 置换规则 ) \\&\quad = (\exists x){\neg}A(x) \lor (\exists x)B(x) \quad &( 置词分配等值式 ) \\&\quad = \neg (\forall x)A(x) \lor (\exists x)B(x) \quad &( 德·摩根律 ) \\&\quad = (\forall x)A(x){\Rightarrow}(\exists x)B(x) \quad &( 置换规则 )\end{align*}$$

即(∀x)(∃y)(P(x)⇒Q(y))和(∃y)(∀x)(P(x)⇒Q(y))都与同一个谓词公式等值。

下面证明例3.12（b）的两种形式化描述等值。

【例 3.17】设 F(x)表示 $^ { \circ } x$ 是乌鸦”， $G ( x , y )$ 表示 $^ { \circ } x$ 与y一般黑”。“天下乌鸦一般

[page:90]

## 离散数学及应用（第2版）

黑”可表示成 $( \forall x ) ( \forall y ) ( F ( x ) \land F ( y ) \Rightarrow G ( x , y ) )$ ，或者~ $( \exists x ) ( \exists y ) ( F ( x ) \land F ( y ) \land \sim G ( x , y ) )$ 即不存在个体x、y都是乌鸦但不一般黑，下面证明这两个谓词公式是等值的:

$$\begin{align*}&\sim (\exists x)(\exists y)(F(x) \land F(y) \land \sim G(x,   y)) \\\equiv &   (\forall x) \sim (\exists y)(F(x) \land F(y) \land \sim G(x,   y)) \\\equiv &   (\forall x)(\forall y) \sim (F(x) \land F(y) \land \sim G(x,   y)) \\\equiv &   (\forall x)(\forall y)(\sim (F(x) \land F(y)) \lor G(x,   y)) \\\equiv &   (\forall x)(\forall y)(F(x) \land F(y) \to G(x,   y))\end{align*}$$

## 3.5前束范式

在命题逻辑中，我们研究过命题公式的规范的、标准的形式，即范式。在谓词逻辑中，谓词公式也有与之相对应的范式。

## 定义3.13 设A为一个谓词公式，如果满足

（1）所有量词都位于该公式的最左边。

（2）所有量词前都不含否定词。

（3）量词的辖域都延伸到整个公式的末端。

## 则称A 为前束范式（prenex formal form)。

前束范式的一般形式为

$$\mathcal { Q } _ { 1 }   x _ { 1 }   \mathcal { Q } _ { 2 }   x _ { 2 } { \cdots } \mathcal { Q } _ { n }   x _ { n } \quad \mathcal { M } ( x _ { 1 } , x _ { 2 } , \cdots , x _ { n } )$$

其中 $Q_{i}(1 \leqslant i \leqslant n)$ 为∀或∃， $Q_{1}x_{1}Q_{2}x_{2}\cdots Q_{n}x_{n}$ 称为前束，M为不含量词的公式，称作公式的基式或母式

【例3.18】 $( \forall x ) ( \forall y ) \neg ( P ( x ) \neg Q ( y ) ) \neg ( \forall x ) ( \exists y ) R ( x , y ) \neg S ( x , y )$ 都是前束范式，而 $\neg ( \forall x ) R ( x ,$ y)和 $( \forall x ) P ( x ) \lor ( \forall x ) Q ( x )$ 都不是前束范式。

下面给出求前束范式的基本方法:

（1）消去谓词公式中的联结词⇒、⇔。

（2）将谓词公式中的否定词~右移。

(3)将谓词公式中的量词左移(使用量词分配等值式、量词辖域收缩与扩张等值式)，必要时将变项改名。

【例3.19】求 $( \forall x ) P ( x , y ) { \leftrightarrow } \sim ( \forall y ) Q ( x , y )$ 的前束范式。

解.可按下述步骤实现:

$$\begin{aligned}&(\forall x)P(x,y)\because \neg (\forall y)Q(x,y)\\=&((\forall x)P(x,y)\neg \neg (\forall y)Q(x,y))\land (\neg (\forall y)Q(x,y)\neg (\forall x)P(x,y)) \quad &( 消去联结词  \Leftrightarrow )\\=&((\neg (\forall x)P(x,y)\lor \neg (\forall y)Q(x,y))\land (\neg (\neg (\forall y)Q(x,y)\lor (\forall x)P(x,y)) \quad &( 消去联结词  \Leftrightarrow )\\=&((\neg (\forall z)P(z,y)\lor \neg (\forall u)Q(x,u))\land (\neg (\neg (\forall y)Q(x,v))\lor (\forall w)P(w,y)) \quad &( 换名规则 )\\=&((\exists z)\neg P(z,y)\lor (\exists u)\neg Q(x,u))\land ((\forall v)Q(x,v))\lor (\forall w)P(w,y)) \quad &(\neg  内移 )\\=&(\exists z)(\neg P(z,y)\lor \neg Q(x,z))\land ((\forall v)Q(x,v)\lor (\forall w)P(w,y)) \quad &( 量词   分配等值式 )\\=&(\exists z)(\neg P(z,y)\lor \neg Q(x,z))\land ((\forall v))(\forall w)(Q(x,v)\lor P(w,y)) \quad &( 量词   左移 )\\=&(\exists z)(\forall v)(\forall w)((\neg P(z,y)\lor \neg Q(x,z))\land (Q(x,v)\lor P(w,y))) \quad &( 量词   左移 )\end{aligned}$$

[page:91]

## 第3章 谓词逻辑

$$\equiv ( \exists z ) ( \forall \nu ) ( \forall w ) S ( x , y , z , \nu , w )$$

注:使用以上步骤，可求得任一公式的前束范式。由于每一步变换都保持等值性，所以，所得到的前束范式与原公式是等值的。这里的 $S ( x , y , z , v , w )$ 便是原公式的母式。

由于前束中对量词的次序排列没有约束，如(∀v)(∀w)也可以写成(∀w)(∀v)，以及对母式没有明确的限制，自然其前束范式并不唯一，如上例的前束范式也可以是

$$( \exists z ) ( \forall w ) ( \forall \nu ) ( S ( x , y , z , \nu , w ) \land P )$$

其中P可以是任一不含量词的普遍有效的公式。

事实上，有如下定理。

定理3.12（前束范式存在定理）任一谓词公式都存在与之等值的前束范式，但其前束范式并不唯一。

【例3.20】求下列公式的前束范式。

(a）(∀x)F(x)∧~(∃x)G(x)。

(b)(∃x)F(x)∧~(∀x)G(x)。

解.

$$\begin{aligned}(a) & (\forall x)F(x) \land \lnot(\exists x)G(x) \\= & (\forall x)F(x) \land (\forall x) \lnot G(x) \\= & (\forall x)(F(x) \land \lnot G(x))\end{aligned}$$

$$\begin{align*}(\models) & \quad (\exists x)F(x) \land \neg (\forall x)G(x) \\& = (\exists x)F(x) \land (\exists x)\neg G(x) \\& = (\exists x)F(x) \land (\exists y)\neg G(y) \quad & ( 换名规则 ) \\& = (\exists x)(\exists y)(F(x) \land \neg G(y)) \quad & ( 量词辖域扩张等值式 )\end{align*}$$

$$\begin{aligned}& (c)  (\forall x)P(x,y)\neg((\exists y)Q(x,y)\neg(\forall z)R(x,z)) \\&= \neg(\forall x)P(x,y)\vee(\neg(\exists y)Q(x,y)\vee(\forall z)R(x,z)) \\&= (\exists x)\neg P(x,y)\vee((\forall y)\neg Q(x,y)\vee(\forall z)R(x,z)) \\&= (\exists x)\neg P(x,y)\vee(\forall y)(\forall z)(\neg Q(x,y)\vee R(x,z)) \\&= (\exists u)\neg P(u,v)\vee(\forall y)(\forall z)(\neg Q(x,y)\vee R(x,z)) \\&= (\exists u)(\forall y)(\forall z)(\neg P(u,v)\vee\neg Q(x,y)\vee R(x,z)) \\&= (\exists u)(\forall y)(\forall z)(\neg P(u,v)\vee\neg Q(x,y)\vee R(x,z))\end{aligned}( 量词辖域扩张等值式 )$$

## 3.6 谓词逻辑的推理

与命题逻辑推理相同，谓词逻辑推理也是由某些给定的前提出发，根据一些基本的推理规则推导出相应结论的过程，因而，谓词逻辑推理的形式与命题逻辑推理的形式是一致的。

在谓词逻辑中，从前提 $H _ { 1 } , H _ { 2 } , \cdots , H _ { n }$ 出发推出结论C的推理形式结构，依然采用如下的蕴涵式形式:

$$(H_1 \land H_2 \land \cdots \land H_n) \Rightarrow C$$

若上式为逻辑有效式，则称推理正确，称C为前提 $H _ { 1 } ,   H _ { 2 } ,   \cdots ,   H _ { n }$ 的逻辑结论或有效结

[page:92]

## 92

论；否则称推理不正确。于是，在谓词逻辑中判断推理是否正确便归结为判断上式是否为逻辑有效式的问题。

由于在谓词逻辑中不能使用真值表法，又不存在判别A⇒B是否普遍有效的一般方法，从而使用基本推理公式及推理规则是谓词逻辑的基本推理演算方法。

除命题逻辑中基本推理公式的代换实例外，还有一些谓词逻辑所特有的、与量词相关的推理公式。

定理3.13（基本推理公式）以下蕴涵式都是普遍有效公式。

(a) $( \forall x ) P ( x ) \lor ( \forall x ) Q ( x ) \Rightarrow ( \forall x ) ( P ( x ) \lor Q ( x ) ) .$

(b) $( \exists x ) ( P ( x ) \land Q ( x ) ) { \Rightarrow } ( \exists x ) P ( x ) \land ( \exists x ) Q ( x ) .$

(c) $( \forall x ) ( P ( x ) { \Rightarrow } Q ( x ) ) { \Rightarrow } ( ( \forall x ) P ( x ) { \Rightarrow } ( \forall x ) Q ( x ) ) .$

(d) $( \forall x ) ( P ( x ) { \Rightarrow } Q ( x ) ) { \Rightarrow } ( ( \exists x ) P ( x ) { \Rightarrow } ( \exists x ) Q ( x ) ) \text { 。 }$

(e) $( ( \exists x ) P ( x ) { \Rightarrow } ( \forall x ) Q ( x ) ) { \Rightarrow } ( \forall x ) ( P ( x ) { \Rightarrow } Q ( x ) ) \text { 。 }$

(f) $( \forall x ) ( P ( x ) { \Leftrightarrow } Q ( x ) ) { \Rightarrow } ( ( \forall x ) P ( x ) { \Leftrightarrow } ( \forall x ) Q ( x ) ) \text { 。 }$

(g) $( \forall x ) ( P ( x ) { \leftrightarrow } Q ( x ) ) { \rightarrow } ( ( \exists x ) P ( x ) { \leftrightarrow } ( \exists x ) Q ( x ) ) .$ 0

(h) $( \forall x ) ( P ( x ) { \Rightarrow } Q ( x ) ) \land ( \forall x ) ( Q ( x ) { \Rightarrow } R ( x ) ) { \Rightarrow } ( \forall x ) ( P ( x ) { \Rightarrow } R ( x ) ) \text { 。 }$

(i) $( \forall x ) ( P ( x ) \Rightarrow Q ( x ) ) \land P ( a ) \Rightarrow Q ( a ) .$

j) $( \forall x ) ( \forall y ) P ( x , y ) { \Rightarrow } ( \exists x ) ( \forall y ) P ( x , y ) .$

(k) $( \exists x ) ( \forall y ) P ( x , y ) { \Rightarrow } ( \forall y ) ( \exists x ) P ( x , y ) \text { 。 }$ 0

(1) $( \forall x ) ( \exists y ) P ( x , y ) { \Rightarrow } ( \exists x ) ( \exists y ) P ( x , y ) \text { 。 }$

至此，可以总结一下，两个量词的公式有下列8种情况: $( \forall x ) ( \forall y ) P ( x , y ) , ( \forall y ) ( \forall x ) P ( x ,$ y)、(∃y)(∀x)P(x, y)、(∃x)(∀y)P(x, y)、(∀x)(∃y)P(x, y)、(∀y)(∃x)P(x, y)、(∃y)(∃x)P(x, y)、$( \exists x ) ( \exists y ) P ( x , y )$ 。它们之间的关系等价与蕴涵关系如下（可参看图3.1）。

定理3.14 以下谓词公式都是普遍有效公式。

(a) $( \forall x ) ( \forall y ) P ( x , y ) { \Leftrightarrow } ( \forall y ) ( \forall x ) P ( x , y ) .$

(b) $( \forall x ) ( \forall y ) P ( x , y ) { \Rightarrow } ( \exists y ) ( \forall x ) P ( x , y ) .$ a

(c)(∀y)(∀x)P(x, y)⇒(∃x)(∀y)P(x, y)。

(d) $( \exists y ) ( \forall x ) P ( x , y ) { \Rightarrow } ( \forall x ) ( \exists y ) P ( x , y ) \text { 。 }$

(e) $( \exists x ) ( \forall y ) P ( x , y ) { \Rightarrow } ( \forall y ) ( \exists x ) P ( x , y ) \text { 。 }$

(f) $( \forall x ) ( \exists y ) P ( x , y ) { \Rightarrow } ( \exists y ) ( \exists x ) P ( x , y ) \text { 。 }$

[page:93]

## 第3章 谓词逻辑

(g) $( \forall y ) ( \exists x ) P ( x , y ) { \Rightarrow } ( \exists x ) ( \exists y ) P ( x , y ) .$ 0

(h) $( \exists y ) ( \exists x ) P ( x , y ) { \Leftrightarrow } ( \exists x ) ( \exists y ) P ( x , y )$ 0

在图3.1中未出现的有向边表示两者之间没有必然联系。

例如，假设论域D限定为正整数集合，解释1中谓词 $P ( x ,   y )$ 表示 $x { = } y$ ，解释2中谓词 $P ( x , y )$ 表示x×y=y，解释3中谓词 $P ( x , y )$ 表示 $x { \ngeq } y$ ，解释4中谓词 $P ( x , y )$ 表示 $x { \leqslant } y _ { \circ }$

那么在解释1下命题 $( \forall x ) ( \exists y ) P ( x , y )$ 为真，命题 $( \exists x ) ( \forall y ) P ( x , y )$ 为假。

在解释2下命题 $( \forall x ) ( \exists y ) P ( x , y )$ 为假，命题 $( \exists x ) ( \forall y ) P ( x , y )$ 为真。

在解释3下命题 $( \exists y ) ( \forall x ) P ( x , y )$ 为真，命题 $( \exists x ) ( \forall y ) P ( x , y )$ 为假。

在解释4下命题 $( \exists y ) ( \forall x ) P ( x , y )$ 为假，命题 $( \exists x ) ( \forall y ) P ( x , y )$ 为真。

而谓词逻辑所使用的推理规则除命题逻辑的推理演算中用到的6条基本推理规则外，还包括4条有关量词的消去和引入规则。

（a）全称量词消去规则（Universal Specification, US)，也称作全称举例规则:

$$$( \forall x ) P ( x ) { \Rightarrow } P ( y )$  或  $( \forall x ) P ( x ) { \Rightarrow } P ( a )$$$

其中y是论域中的任一个体。意指如果所有的 $x { \in } D$ 都具有性质P，那么D中任一个体y或特定个体a必具有性质 $P _ { \circ }$

该规则使用的条件如下:

(1）第一式中，取代x的y应为任意的不在P(x)中约束出现的个体变项。

（2）第二式中，a为任意个体常项。

(3）用y或a去取代P(x)中自由出现的 x时，必须对 x的所有自由出现进行取代。

（b）全称量词引入规则（Universal Generalization, UG)，也称作全称推广规则:

$$P ( y ) { \Rightarrow } ( \forall x ) P ( x )$$

其中y是论域中任一个体。意指如果任一个体 $y { \in } D$ 都具有性质P，那么D中所有个体x都具有性质 $P _ { \circ }$

该规则使用的条件如下:

（1）无论 $P(y)  中$ 自由出现的个体变项y取何值，P(y)应该均为真。

(2）取代自由出现的y的 x不能在 P(y)中约束出现。

（c）存在量词消去规则（Existential Specification, ES)，也称作存在举例规则:

$$( \exists x ) P ( x ) { \Rightarrow } P ( a )$$

其中a是论域中的一个个体常项。意指如果论域D中存在某个体具有性质P，那么必有特定个体a具有该性质 $P _ { \circ }$

该规则使用的条件如下:

（1）a是使P为真的特定的个体常项。

（2）a不能在P(x)中出现。

（3）P(x)中没有其他自由出现的个体变项。

（4）a在推导中未曾使用过。

（d）存在量词引入规则（Existential Generalization,EG)，也称作存在推广规则:

$$P ( a ) { \Rightarrow } ( \exists x ) P ( x )$$

其中a是论域中的一个个体常项。意指如果有个体常项a具有性质P，那么 $( \exists x ) P ( x )$ 必真。

[page:94]

## 离散数学及应用（第2版）

<table><tr><td>（a）（1）(∀x)(∃y)G(x,y)</td><td>(前提引入)</td></tr><tr><td>(2) (∃y)G(y, y)</td><td>(全称量词消去)</td></tr><tr><td>(b)（1）(∃x)G(x,y)</td><td>(对任意给定的y都成立)</td></tr><tr><td>(2)(∀x)(∃x)G(x, x)</td><td>(全称量词引入)</td></tr><tr><td>（c）（1）(∃x)Q(x)</td><td>(前提引入)</td></tr><tr><td>(2)(∃x)~Q(x)</td><td>(前提引入)</td></tr><tr><td>(3) Q(a)</td><td>（(1）存在量词消去)</td></tr><tr><td>(4) ~Q(a)</td><td>((2）存在量词消去)</td></tr><tr><td>(5) Q(a)∧~Q(a)</td><td>((3）（4）合取）</td></tr><tr><td>(6)(∃x)(Q(x)∧~Q(x))</td><td>(存在量词引入)</td></tr><tr><td>(d)（1）(∀x)(∃y)G(x, y)</td><td>(前提引入)</td></tr><tr><td>(2) (∃y)G(x, y)</td><td>(全称量词消去)</td></tr><tr><td>(3) G(x, a)</td><td>(存在量词消去)</td></tr><tr><td>(4)(∀x)G(x, a)</td><td>(全称量词引入)</td></tr><tr><td>(5) (∃y)(∀x)G(x, y)</td><td>(存在量词引入)</td></tr></table>

该规则使用的条件是如下:

（1）a是特定的个体常项。

（2）取代a的 x不能在P(a)中出现。

使用推理规则的推理演算过程如下:

（1）将以自然语句表示的推理问题形式化，转换为谓词公式。

（2）若不能直接使用基本的推理公式则消去量词。

（3）在无量词下使用规则和公式进行推理。

（4）引入量词，得到相应结论。

而且，在谓词逻辑的推理过程中要特别注意如下两点:

（1）在对带量词的谓词公式进行推理证明时，在既需要消去存在量词又需要消去全称量词时，一般要先使用存在量词消去规则，再使用全称量词消去规则。

（2）使用US、UG、ES、EG规则时，量词的辖域都必须延伸到整个公式的末端。换言之，在含有多个量词的谓词推理中，使用消去规则应该按照从左到右的顺序，而引入规则的使用应该按照从右到左的顺序。

## 【例3.21】 分析下述推理的正确性。

解. 在下面的讨论中都假定论域是整数集，谓词 Q(x)表示“x 是偶数”，G(x, y)表示“x>y”。

（a）前提（1）意为“对于任一个整数而言，都存在比它小的整数”，它是真命题，但是结论（2）意为“存在整数y，使得y>y”，是假命题，这个推理是不正确的。问题在于（2）违反了全称量词消去规则的使用条件（1），使用了约束变项y取代x。

（b）结论（2）明显不正确，事实上（2）已经不是谓词公式了。问题在于（2）违反了全称量词引入规则的使用条件（2)，使用了约束变项x取代y。

（c）前提（1）和（2）意为“存在一个偶数”及“存在一个不是偶数的整数”，都是

[page:95]

## 第3章 谓词逻辑

真命题，但是结论（6）明显是假命题，因此这个推理是不正确的。问题在于（4）违反了存在量词消去规则的使用条件（4)，使用了在推导中曾使用过的α。

（d）前提（1）意为“对于任一个整数而言，都存在比它小的整数”，它是真命题，结论（5）意为“存在一个整数，满足任何整数都大于它”，是假命题，推理不正确。问题在于（3）违反了存在量词消去规则的使用条件（3)，(3y)的辖域G(x,y)中存在自由变项x。

下面从语义上来解释这个错误推理的原因:(∀x)(∃y)G(x, y)推演出(∃y)G(x, y)，继而推演出 G(x, a)，但不能再推演出(∀x)G(x, a)。因为推演出的 G(x, a)成立时，个体 a 是依赖于 x的，不是所有的 x 对同一个 a 都有 G(x, a)成立，于是不能再推演出(∀x)G(x, a)。

## 【例3.22】分析下述推理的正确性。

(1) $( \forall x ) ( P ( x ) { \Rightarrow } Q ( x ) )$ (前提引入) (2)(∃x)P(x) (前提引入) (3) P(c)⇒Q(c) ((1）全称量词消去) (4) P(c) （(2）存在量词消去) (5) Q(c) （(3）（4）假言推理）(6)(∃x)Q(x) (存在量词引入)

解.由前提（1）和（2）得到结论（6）是一个正确推理，整个推理过程从表面上看也是正确的。但是仔细分析一下会发现，步骤（4）违反了存在量词消去规则的使用条件(4)，使用了在推导中曾使用过的c。从语义上讲，步骤（3）中的c可以为任意个体常项，不见得就恰恰是使P为真的特定的个体常项，因此步骤（4）不一定成立。

实际上，只要把步骤（3）和步骤（4）的次序调换一下，就得到了正确的推理过程。这也就是前面强调的在谓词逻辑的推理过程中要特别注意的两点中的第一点 —一般要先使用存在量词消去规则，再使用全称量词消去规则。

【例3.23】构造下述各推理的证明:

（a）前提: $( \forall x ) ( G ( x ) \lor H ( x ) ) , ( \forall x ) \sim G ( x )$

结论:(∃x)H(x)

(b）前提:(∃x)P(x)⇒(∀x)Q(x)

结论:(∀x)(P(x)⇒Q(x))

（注:此即定理3.13中的基本推理公式（e)。）

(c）前提:(∃x)P(x)⇒(∀x)(P(x)∨Q(x)⇒R(x))，(∃x)P(x)

结论:(∃x)(∃y)(R(x)∧R(y))

（d）前提:(∀x)(P(x)⇒Q(x))

结论:(∀x)P(x)⇒(∀x)Q(x)

(注:此即定理3.13中的基本推理公式（c)。）

解

(a）（1) $( \forall x ) ( G ( x ) \lor H ( x ) )$ (前提引入) (2) $G ( a ) \lor H ( a )$ (全称量词消去) (3) $( \forall x ) { \sim } G ( x )$ (前提引入)

[page:96]

## 离散数学及应用（第2版）

(4) ~G(a) (全称量词消去)

(6)(∃x)H(x) (存在量词引入)

(b）（1）(∃x)P(x)⇒(∀x)Q(x) (前提引入)

(2) (∀x)(∀y)(P(x)⇒Q(y)) ((1）置换)

(3)(∀y)(P(z)⇒Q(y)) (全称量词消去)

(5)(∀x)(P(x)⇒Q(x)) (全称量词引入)

(3)(∀x)(P(x)∨Q(x)⇒R(x)) ((1）（2）分离)

(4) P(c) ((2)存在量词消去)

(5) P(c)∨Q(c)⇒R(c) （(3）全称量词消去)

(6) P(c)∨Q(c) ((4)附加律)

(7) R(c) （(5）（6）分离）

(8）(∃x)R(x) ((7）存在量词引入)

(9)(∃y)R(y) ((7)存在量词引入)

（10）(∃x)R(x)∧(∃y)R(y) （(8）（9）合取）

(11）(∃x)(∃y)(R(x)∧R(y)) ((10）置换)

(d）（1）(∀x)(P(x)⇒Q(x)) (前提引入)

(2) P(x)⇒Q(x) (全称量词消去)

(3)(∀x)P(x) (附加前提引入)

(4) P(x) (全称量词消去)

(5) Q(x) （(2）（4）分离）

(6)(∀x)Q(x) (全称量词引入)

## 【例3.24】 证明定理3.7，即

(a) (∀x)(∀y)A(x, y) ≡ (∀y)(∀x)(x, y)。

(b) (∃x)(∃y)A(x, y) ≡ (∃y)(∃x)A(x, y)。

(a）证明(∀x)(∀y)A(x, y)⇒(∀y)(∀x)A(x, y)是逻辑有效式:

(1)(∀x)(∀y)A(x, y) (前提引入)

(2) (∀y)A(x, y) （(1）全称量词消去)

(3) A(x, y) ((2）全称量词消去)

(4)(∀x)A(x, y) ((3）全称量词引入)

(5)(∀y)(∀x)(x, y) （(4）全称量词引入)

类似可证明(∀y)(∀x)A(x, y)⇒(∀x)(∀y)A(x, y)是逻辑有效式，因此(∀x)(∀y)A(x, y) ≡ (∀y)(∀x)(x, y)。

（b）的证明类似可得。 口

[page:97]

## 第3章 谓词逻辑

【例3.25】 在谓词逻辑中构造以下推理的证明。

（a）所有的人都是要死的，苏格拉底是人，所以苏格拉底是要死的。

（b）所有的素数都是整数，所有的整数都是有理数，所以所有的素数都是有理数。

(c）有的病人喜欢所有的医生，没有一个病人喜欢某一庸医，所以没有医生是庸医。

（d）任何人如果他喜欢步行，则他就不喜欢乘汽车；每个人喜欢乘汽车或者喜欢骑自行车；有的人不喜欢骑自行车；因此有的人不喜欢步行。

(a）将以自然语句表示的推理问题形式化，转换为谓词公式。令P(x)表示“x是人”，Q(x)表示“x会死”，则得到如下推理形式:

前提:(∀x)(P(x)⇒Q(x))，P(苏格拉底)

结论:Q(苏格拉底)

之后进行谓词逻辑推理:

(1)(∀x)(P(x)⇒Q(x)) (前提引入)

(2) P(苏格拉底)⇒Q(苏格拉底) (全称量词消去)

(3）P(苏格拉底) (前提引入)

(4） Q(苏格拉底) （(2）（3）分离）

(b）令P(x)表示“x是素数”，Q(x)表示“x是整数”，R(x)表示“x是有理数”，得到如下推理形式:

前提:(∀x)(P(x)⇒Q(x))，(∀x)(Q(x)⇒R(x))

结论:(∀x)(P(x)⇒R(x))

之后进行谓词逻辑推理:

(1)(∀x)(P(x)⇒Q(x)) (前提引入)

(2) P(x)⇒Q(x) ((1）全称量词消去)

(3)(∀x)(Q(x)⇒R(x)) (前提引入)

(4) Q(x)⇒R(x) ((3）全称量词消去)

(5) P(x)⇒R(x) （(2）（4）假言三段论）

(6)(∀x)(P(x)⇒R(x) ((5）全称量词引入)

(c）令P(x)表示“x是病人”，Q(x)表示“x是庸医”，D(x)表示“x是医生”，L(x,y)表示“x喜欢y”，则得到如下推理形式:

前提:(∃x)(P(x)∧(∀y)(D(y)⇒L(x, y)))，(∀x)(P(x)⇒(∀y)(Q(y)⇒~L(x, y)))

结论:(∀x)(D(x)⇒~Q(x))

推理过程如下:

(1)(∃x)(P(x)∧(∀y)(D(y)⇒L(x, y))) (前提引入)

(2) P(c)∧(∀y)(D(y)⇒L(c, y)) ((1）全称量词消去)

(3)(∀x)(P(x)⇒(∀y)(Q(y)⇒~L(x, y) (前提引入)

(4) P(c)⇒(∀y)(Q(y)⇒~L(c, y)) ((3）全称量词消去)

(5) P(c) ((2)化简)

(6) (∀y)(D(y)⇒L(c, y)) ((2)化简)

[page:98]

## 离散数学及应用（第2版）

(7) D(y)⇒L(c, y) ((6)全称量词消去)

(8)(∀y)(Q(y)⇒~L(c, y) ((4）（5）分离）

(10) L(c, y)⇒~Q(y) ((9）置换)

(11) D(y)⇒~Q(y) （（7）（10）假言三段论）

(12)(∀y)(D(y)⇒~Q(y)) （(11）全称量词引入)

(13)(∀x)(D(x)⇒~Q(x)) （(12）换名规则)

(d）令W(x)表示“x喜欢步行”，B(x)表示“x喜欢乘汽车”，K(x)表示“x喜欢骑自行车”，则得到如下推理形式:

前提:(∀x)(W(x)⇒~B(x))，(∀x)(B(x)∨K(x))，(∃x)(~K(x))

（1)(∃x)(~K(x)) (前提引入)

(2) ~K(c) ((1）存在量词消去)

(3)(∀x)(B(x)∨K(x) (前提引入)

(4) B(c)∨K(c) ((3）全称量词消去)

(5) B(c) （（2）（4）析取三段论）

(6)(∀x)(W(x)⇒~B(x)) (前提引入)

(7) W(c)⇒~B(c) ((6)全称量词消去)

(8) ~W(c) （（5）（7）拒取式）

(9)(∃x)(~W(x)) （(8）存在量词引入)

## 习题3

3.1 将下列命题用0元谓词表示。

（a）天安门位于北京。

（b）小李不是教师，而是运动员。

（c）苗苗非常聪明和美丽。

（d）π和 e都是无理数。

（e）俞伯牙和钟子期是好朋友。

（f)α属于集合A或者集合B。

（g）乐乐既熟悉C++语言，又熟悉Java语言。

（h）鱼我所欲也，熊掌亦我所欲也。

（i）3大于2，4大于3，所以4大于2。

3.2 令谓词Odd(x)表示“x是奇数”，Even(x)表示“x是偶数”，Prime(x)表示“x是素数”，Equal(x，y)表示“x=y”，Greater(x,y)表示“x>y”。将以下各式译为汉语，并判断其真值。

(a)Prime(6)。

[page:99]

## 第3章 谓词逻辑

(b）(∀x)~Odd(x)。

(c）(∃x)Greater(5, x)。

(d)(∀x)(∃y)(Greater(y, x)∧Prime(y))。

(e)(∃x)(∃y)(Equal(x, y+2)∧Prime(x)∧Prime(y))。

(f) (∀x)(∀y)(∀z)((Equal(z, x+y)∧Odd(x)∧Odd(y))⇒Even(z))。

3.3 令谓词Odd(x)表示“x是奇数”，Even(x)表示“x是偶数”，Prime(x)表示“x是素数”，

Equal(x, y)表示“x=y”，Greater(x, y)表示“x>y”。利用谓词公式翻译下列命题。

（a）有不是奇数的素数。

(b）存在奇数 x、y和偶数 z使得 x与y的和大于 x与 z的和。

（c）对于任意的整数 x、y，存在整数 z 使得 x+z=y。

（d）存在大于10000的偶数。

（e）没有最大的素数。

（f）存在介于2和6之间的整数。

（g）只存在唯一的奇数1。

3.4 将下列命题用谓词表示出来，使用全总个体域。

（a）人都生活在地球上。

（b）有的人长着金色头发。

（c）并不是所有的实数都能表示成分数。

（d）没有能表示成分数的无理数。

（e）任意的偶数 x与y都有大于1的公因子。

(f)存在奇数x与y，它们没有大于1的公因子。

（g）说所有乌龟比所有兔子跑得都快是不对的。

（h）说有的乌龟比所有兔子跑得都快是正确的。

（i）一切反动派都是纸老虎。

（j）没有不透风的墙。

（k）有位老师又可爱又聪明。

（1）人固有一死，或轻于鸿毛，或重于泰山。

（m）尽管有些人是勤奋的，但并非所有人都勤奋。

（n）不存在又不好好学习又能拿到好成绩的学生。

(o）直线a和 b 平行当且仅当 a 与 b 不相交。

（p）所有老师和有些学生总是准时到达教室。

(q) 只有一个北京。

（r）世界上没有两个完全一样的鸡蛋。

（s）不是所有人都一样高。

（t）任何金属都可以溶解在某种液体中。

（u）有一种液体可以溶化任何金属。

（v）凡世间事，预则立，不预则废。

（w）凡是敌人赞同的我们就要反对，凡是敌人反对的我们就要赞同。

[page:100]

## 离散数学及应用（第2版）

（x）凡对顶角都相等，但是相等的两个角未必都是对顶角。

(y）不是所有的男生都比任何一名女生成绩好，但是至少有一名男生成绩超过所有女生。

（z）过平面上两相异点，有且仅有一条直线。

3.5 假设论域是实数集， $\{ f _ { n } ( x ) \}$ 是一个函数序列，f(x)为一个函数，将函数序列 $\{ f _ { n } ( x ) \}$在区间(a,b)内收敛于f(x)的定义“对任意 $\varepsilon > 0 , x \in ( a , b )$ 都存在正整数N，使得对任意 $n > N  有  \left| f(x) - f_n(x) \right| < \varepsilon$ 翻译为谓词公式。

3.6 假设论域是实数集， $\{ f _ { n } ( x ) \}$ 是一个函数序列，f(x)为一个函数，将函数序列 $\{ f _ { n } ( x ) \}$在区间(a,b)内一致收敛于f(x)的定义“对任意ε>0，都存在正整数N，使得 $n { \geq } N$ 时对所有 $x   \in   \left( a , b \right)$ 有 $\left| f(x) - f_n(x) \right| < \varepsilon$ 翻译为谓词公式。

3.7 给定解释I为:给定论域 $D = \mathbb{Z} , f(x,y) = x + y$ ，谓词 F(x, y)表示 x=y， $a { = } 2$ 。求下列各公式在解释I下的真值。

(a) $( \exists x ) F ( f ( x , x ) , a )$

(b) $( \forall x ) F ( f ( x , a ) , x ) \mathrm {  。  }$ 0

(c) $( \forall x ) ( \forall y ) ( F _ { } ( f ( x , a ) , y ) { \Rightarrow } F _ { } ( f ( y , a ) , x ) ) \text { 。 }$

(d) $( \forall x ) ( \forall y ) ( \exists z ) F ( f ( x , y ) , z ) \text { 。 }$

(e) $( \exists x ) ( \forall y ) ( \forall z ) F ( f ( y , z ) , x ) \text { 。 }$

3.8 试给出解释I使得在解释I下(∀x)(P(x)⇒Q(x))和(∀x)(P(x)∧Q(x))具有不同的真值。

3.9 试给出解释I使得在解释I下(∃x)(Q(x)∧P(x))和(∃x)(Q(x)⇒P(x))具有不同的真值。

3.10 指出下述公式的指导变项、辖域、自由变项和约束变项。

(a) $( \forall x ) ( P ( x ) \land Q ( x ) ) \land ( \exists x ) R ( x ) \text { 。 }$

(b) $( \exists x ) ( \forall y ) ( P ( x ) { \Rightarrow } R ( x , y ) ) .$ 0

(c) $( \exists x ) ( P ( x ) \land ( \forall y ) ( D ( y ) \Rightarrow L ( x , y ) ) ) \text { 。 }$

(d) $( \forall x ) ( F ( x ) { \Rightarrow } G ( y ) ) { \Rightarrow } ( \exists y ) ( H ( x ) \land L ( x , y , z ) ) \text { 。 }$

(e) $( \forall x ) P ( x , y , z ) \lor ( ( \exists u ) Q ( x , u ) { \Rightarrow } ( \exists w ) Q ( y , w ) ) \text { 。 }$

3.11 证明以下两个公式都不是逻辑有效式。

(a) $( \forall x ) ( P ( x ) \lor Q ( x ) ) { \Rightarrow } ( \forall x ) P ( x ) \lor ( \forall x ) Q ( x ) .$

(b) $( \exists x ) P ( x ) \land ( \exists x ) Q ( x ) \Rightarrow ( \exists x ) ( P ( x ) \land Q ( x ) ) \text { 。 }$

3.12 判断下列公式的类型，是普遍有效的给出证明，不是普遍有效的举出反例。

(a) $( \forall x ) P ( x ) { \Rightarrow } ( ( \forall x ) P ( x ) \lor ( \exists y ) G ( y ) ) .$

(b) $( ( \exists x ) P ( x ) { \Rightarrow } ( \exists x ) Q ( x ) ) { \Rightarrow } ( \exists x ) ( P ( x ) { \Rightarrow } Q ( x ) ) \text { 。 }$

(c)(∀x)P(x)⇒((∀x)(∃y)H(x, y)⇒(∀x)P(x))。

(d) $\sim \left( (\forall x)A(x) \Rightarrow (\exists x)B(x) \right) \land (\exists x)B(x) 。$

(e) $( \exists x ) ( \forall y ) P ( x , y ) { \Rightarrow } ( \forall x ) ( \exists y ) P ( x , y ) .$ 0

3.13 将公式 $( \forall x ) ( P ( x ) \Rightarrow Q ( x , y ) ) \land R ( x , y )$ 中的约束变项改名，判断以下结果哪个是正确的: $(\forall y)(P(y) \Rightarrow Q(y,\ y)) \land R(x,\ y), (\forall z)(P(z) \Rightarrow Q(x,\ y)) \land R(x,\ y), (\forall z)(P(z) \Rightarrow Q(z,\ y))$ $y) \triangle R(x,y)$

3.14 设个体域为 $\{ a , b , c \}$ ，试消去下列命题中的量词。

[page:101]

## 第3章 谓词逻辑

(a) $( \forall x ) P ( x ) { \Rightarrow } ( \exists x ) Q ( x ) \text { 。 }$

(b) $( \exists x ) ( P ( x ) \lor ( \forall y ) Q ( y ) )$ 0

(c) $( \forall y ) ( \exists x ) H ( x , y ) \text { 。 }$

3.15 将下列公式化为与之等值的公式，使其没有既是约束出现又是自由出现的个体变项符号。

(a) $( \forall x ) P ( x , y ) \lor ( \exists y ) Q ( x , y , z )$

(b) $( \forall x ) ( P ( x , y ) \lor ( \exists y ) Q ( x , y , z ) ) .$ 0

(c) $( \exists x ) ( \forall y ) ( P ( x ) { \Rightarrow } R ( x , y ) ) { \Leftrightarrow } L ( x , y ) .$

(d) $( ( \exists x ) P ( x , y ) { \Rightarrow } ( \forall y ) Q ( x , y ) ) { \Rightarrow } ( \forall x ) ( \exists y ) R ( x , y ) \text { 。 }$

3.16 设A(x)是含x自由出现的公式，谓词公式 B 中不含x的出现，证明:

(a) $( \forall x ) ( A ( x ) { \Rightarrow } B ) { \equiv } ( \exists x ) A ( x ) { \Rightarrow } B \text { 。 }$

(b) $( \exists x ) ( A ( x ) { \Rightarrow } B ) { \equiv } ( \forall x ) A ( x ) { \Rightarrow } B \text { 。 }$

$( \forall x ) ( B { \Rightarrow } A ( x ) ) { \equiv } B { \Rightarrow } ( \forall x ) A ( x ) .$

(d) $( \exists x ) ( B { \Rightarrow } A ( x ) ) { \equiv } B { \Rightarrow } ( \exists x ) A ( x ) \text { 。 }$ 0

3.17 证明下列各等值式。

(a) $( \exists x ) ( \exists y ) ( A ( x ) \land B ( y ) ) { \equiv } ( \exists x ) A ( x ) \land ( \exists x ) B ( x ) \text { 。 }$

(b) $\sim ( \exists x ) ( M ( x ) \land F ( x ) ) { = } ( \forall x ) ( M ( x ) { \Rightarrow } \sim F ( x ) ) .$ 0

(c) $( \forall x ) ( \forall y ) ( P ( x ) { \Rightarrow } Q ( y ) ) { \equiv } ( \exists x ) P ( x ) { \Rightarrow } ( \forall y ) Q ( y )$ 0

(d) $( \exists x ) ( \exists y ) ( P ( x ) { \Rightarrow } Q ( y ) ) { \equiv } ( \forall x ) P ( x ) { \Rightarrow } ( \exists y ) Q ( y ) .$

$\sim ( \forall x ) ( \exists y ) ( ( P ( x , y ) \lor Q ( x , y ) ) \land ( R ( x , y ) \lor S ( x , y ) ) )$ $\equiv (\exists x)(\forall y)((P(x,y) \lor Q(x,y)) \Rightarrow (\sim R(x,y) \land \sim S(x,y))) 。$

(f) $\sim ( \forall x ) ( ( \exists y ) L ( x ,   y ) { \Rightarrow } ( \forall y ) H ( x ,   y ) ) { = } ( \exists x ) ( \exists y ) ( \exists z ) ( L ( x ,   y ) \land \sim H ( x ,   z ) ) \text { 。 }$

(g) $( \exists z ) ( \exists x ) ( ( P ( x ,   z )   \Rightarrow   Q ( x ,   z ) ) \lor ( R ( x ,   z )   \Rightarrow   S ( x ,   z ) ) )$ $= ((\forall z)(\forall x)P(x,z) \text{\Rightarrow } (\exists z)(\exists x)\mathcal{Q}(x,z)) \lor ((\forall z)(\forall y)R(y,z) \text{\Rightarrow } (\exists z)(\exists y)S(y,z)) 。$

(h) $( ( \forall x ) P ( x ) \land ( \forall x ) \mathcal { Q } ( x ) \land ( \exists x ) R ( x ) ) \lor ( ( \forall x ) P ( x ) \land ( \forall x ) \mathcal { Q } ( x ) \land ( \exists x ) S ( x ) )$ $= ( \forall x ) ( P ( x ) \land Q ( x ) ) \land ( \exists x ) ( R ( x ) \lor S ( x ) ) .$

(i)(∀x)(P(x)∨q)⇒(∃x)(P(x)∧q)≡(q⇒(∃x)P(x))∧(~q⇒(∃x)~P(x))。

## 3.18 以下哪个公式与(∀x)(A(x)↓B(x))等值？

(∀x)A(x)↓(∀x)B(x), (∀x)A(x)↑(∀x)B(x), (∃x)A(x)↓(∃x)B(x),(∃x)A(x)↑(∃x)B(x)。

3.19 将下列公式化为等价的前束范式。

(a) $( \forall x ) F ( x ) { \Rightarrow } ( \exists x ) G ( x ) \text { 。 }$

(b) $( \exists x ) F ( x ) { \Rightarrow } ( \forall x ) G ( x ) \text { 。 }$

(c) $( \forall x ) ( P ( x ) { \Rightarrow } ( \exists y ) Q ( x , y ) ) \text { 。 }$

(d) $( ( \forall x ) F ( x , y ) { \Rightarrow } ( \exists y ) G ( y ) ) { \Rightarrow } ( \forall x ) H ( x , y ) .$

(e) $\sim ( ( \forall x ) ( \exists y ) P ( a , x , y ) \land ( \forall x ) Q ( x , b ) ) \Rightarrow R ( x ) \text { 。 }$

(f) $( \exists x ) P ( x , y ) { \Leftrightarrow } ( \forall z ) Q ( z ) .$ 0

(g) $( \forall x ) ( \forall y ) ( \forall z ) ( P ( x , y , z ) \land ( ( \exists u ) \underline { { Q } } ( x , u ) { \Rightarrow } ( \exists w ) \underline { { Q } } ( y , w ) ) ) .$

(h) $( \forall x ) ( P ( x ) { \Rightarrow } ( \forall y ) ( ( P ( y ) { \Rightarrow } ( Q ( x ) { \Rightarrow } Q ( y ) ) ) \lor ( \forall z ) P ( z ) ) ) .$ 0

[page:102]

## 离散数学及应用（第2版）

3.20 假定论域是整数集，谓词P(x)表示“x是4的倍数”，Q(x)表示“x是2的倍数”，G(x,y)表示“x>y”。判断下述推理是否正确，如果不正确，请指出错误的原因。(a）（1）(∃x)G(x,5) (前提引入) (2) G(3, 5) (存在量词消去) (b）（1）(∃x)G(x,a) (前提引入) (2) G(a, a) (存在量词消去) (c）（1）(∃x)G(x, a) (前提引入) (2)(∃x)(∃x)G(x, x) (存在量词引入) (d)（1）(∀x)(P(x)⇒Q(x)) (前提引入) (2) P(4)⇒Q(3) (全称量词消去)（e）（1）(∀x)P(x)⇒Q(x) (前提引入) (2) P(y)⇒Q(y) (全称量词消去) (f)（1)P(x)⇒Q(a) (前提引入) (2)(∃x)(P(x)⇒Q(x)) (存在量词引入) (g）（1）(∀x)(∃y)G(x,y) (前提引入) (2) (∃y)G(z, y) (全称量词消去) (3) G(z, b) (存在量词消去) (4)(∀z)G(z, b) (全称量词引入) (5) G(b, b) (全称量词消去) (6) (∀x)G(x, x) (全称量词引入)

## 3.21 利用推理规则作推理演算，构造以下推理形式的证明。 T 风则±识开，1迫以

(a）前提:(∀x)(~P(x)⇒Q(x)),(∀x)~Q(x)结论:P(a) (b）前提:(∀x)(P(x)⇒Q)结论:(∀x)P(x)⇒Q (c）前提:(∀x)(P(x)∨Q(x)),(∀x)(Q(x)⇒~R(x))结论:(∃x)(R(x)⇒P(x)) (d)前提:(∀x)(P(x)⇒(Q(x)∧R(x))),(∃x)(P(x)∧S(x))结论:(∃x)(R(x)∧S(x))（e）前提:(∀x)(∃y)P(x, y)结论:(∀x)(∃y)(∃z)(P(x, y)∧P(y, z)) (f）前提:(∀x)P(x)∨(∀x)Q(x)结论:(∀x)(P(x)∨Q(x)) (g）前提:(∀x)(G(x)⇒H(x))，~(∃x)(F(x)∧H(x))结论:(∃x)F(x)⇒(∃x)~G(x) (h）前提:(∀x)(H(x)⇒M(x))结论:(∀x)(∀y)(H(y)∧N(x, y))⇒(∃y)(M(y)∧N(a, y)) (i）前提:(∀x)(P(x)∨Q(x)) (i）前提:(r)(P(r)\/O(r))

[page:103]

## 第3章 谓词逻辑

结论:(∀x)P(x)∨(∃x)Q(x)

3.22 在谓词逻辑中构造以下推理的证明。

（a）大熊猫都产在中国，欢欢是大熊猫，所以，欢欢产在中国。

（b）所有的狮子都是凶猛动物，有些狮子不喝咖啡，所以有些凶猛动物不喝咖啡。

(c）所有叫得好听的鸟都是色彩鲜艳的，没有大鸟以蜂蜜为主食，不以蜂蜜为主食的鸟色彩是暗淡的，所以叫得好听的鸟是小鸟。

（d）每个不努力的学生都考不上研究生，小王考上了研究生，因此小王如果是学生就一定是努力的学生。

（e）学院的学生不是本科生就是研究生，有的学生是高才生，乐乐不是研究生但是高才生，从而如果乐乐是学院的学生必定是本科生。

(f）除了汤勺以外我没有一样东西是不锈钢做的，你送给我的礼物都是有用的，我的汤勺没用，所以你送给我的礼物不是不锈钢做的。

(g）每个喜欢吃素的人都不喜欢吃肉，每个人或者喜欢吃肉或者喜欢吃青菜，有的人不喜欢吃青菜，所以有的人不喜欢吃素。

（h）每个程序员都编写过程序，木马是一种程序，有的程序员没有编写过木马，因此有些程序不是木马。

（i）书柜里面的每本书都是名作，写出名作的人是天才，某个不出名的人写的书在书柜里，因此某个不出名的人是天才。

（j）不存在不能表示成分数的有理数，无理数都不能表示成分数。所以，无理数都不是有理数。

（k）有理数和无理数都是实数，虚数不是实数。因此，虚数既不是有理数也不是无理数。

[page:104]

# 第4章

## 二元关系

“关系”是一个基本而且普遍的概念，例如实数之间存在相等关系和小于关系，集合的子集之间存在相等关系和包含关系，在学生和课程之间存在选课关系，比赛双方间存在胜负关系，人与人之间存在朋友关系，等等。

关系理论的产生可追溯到1914年，最早出现在豪斯多夫（Hausdorff，1868—1942）的名著 Grundzüge der Mengenlehre（英语译文为 Basics of Set Theory，1914）的序型理论中。

本章主要介绍关系的定义、关系的表示方法、关系的运算、关系的性质、关系的闭包、等价关系和集合的划分、相容关系与集合的覆盖以及关系在计算机中的表示方法。

## 4.1 关系及其表示

## 4.1.1 有序对与笛卡儿积

例如，4名学生{张，白，宋，方}有3门课程{离散数学，数据结构，计算机网络}可供选择，可以使用什么样的数学结构来表示学生选课的情况？集合可能是一个选择，例如{张，离散数学}。

再考虑另一个问题:他们4人进行单循环羽毛球赛，希望使用一种数学结构来表示各场比赛的胜负关系。如果使用集合，由于各个元素是无序的，因此{白，方}和{方，白}事实上是同一个集合，表示的是参与比赛的双方，而无法体现出胜负关系。

所以，需要在数学结构中体现出序（order）。

定义4.1 由两个对象 a、b 按照一定次序组成的二元组称为一个有序对或序偶(ordered pair)，记作 $\left( a , b \right)$ ，其中a是它的第一元素或第一坐标，b是它的第二元素或第二坐标。

【例4.1】 在平面直角坐标系上，每一个点的坐标（例如(3,-4)）就是一个有序对。

注:（a）与集合不同，有序对的元素要考虑先后次序，即通常 $( a ,   b ) { \neq } ( b ,   a )$

（b）有序对 $( a , b )$ 和 $| ( c , d ) |$ 相等当且仅当 $a { = } c$ 且 $b { = } d .$

（c）有序对 $\left[ (a,   b) \right.$ 中的两元素可以来自同一集合，也可以来自不同的集合，若干个有序对也可以组成集合。

【例4.2】已知 $(2,x+5)=(3y-4,y)$ ，求x、 $y _ { \circ }$

解. 解方程 3y- $-4=2,x+5=y$ 得到 $y = 2, x = - 3$

[page:105]

## 第4章 二元关系

定义4.2 设A、B 为两个集合，定义它们的笛卡儿积（Cartesian product）A×B 为

$$A \times B = \{ (a, b) \mid a \in A   且   b \in B \}$$

它也称作直积（direct product）。

简言之，集合A和B的笛卡儿积即为A的所有元素和B的所有元素两两组成的所有有序对的集合。

笛卡儿积具有如下性质:

（a）若A或B中有一个为空集，则 $A { \times } B$ 就是空集，即 $A \times \varnothing = \varnothing \times B = \varnothing$

（b）笛卡儿积不满足交换律，即一般来讲 $A \times B \ne B \times A$

【例4.3】平面直角坐标系就是笛卡儿积R×R，这也是这个定义命名的来历。

【例4.4】已知集合 $A = \{ 0, 1 \}, B = \{ a, b, c \}, C = \varnothing$ ，计算 $A \times B, \quad B \times A, \quad A \times C, \quad A \times \mathcal{P}(A)$

解. $A \times B = \{ ( 0 { , } a ) , ( 0 { , } b ) , ( 0 { , } c ) , ( 1 { , } a ) , ( 1 { , } b ) , ( 1 { , } c ) \}$

$$B \times A = \{ ( a , 0 ) , ( b , 0 ) , ( c , 0 ) , ( a , 1 ) , ( b , 1 ) , ( c , 1 ) \}$$

$$A \times \tilde { \mathcal { P } } ( A ) = \{ ( 0 , \emptyset ) ,   ( 0 ,   \{ 0 \} ) ,   ( 0 ,   \{ 1 \} ) ,   ( 0 ,   \{ 0 , 1 \} ) ,   ( 1 , \emptyset ) ,   ( 1 ,   \{ 0 \} ) ,   ( 1 ,   \{ 1 \} ) ,   ( 1 ,   \{ 0 , 1 \} ) \}$$

【例 4.5】 {张，白，宋，方}×{离散数学，数据结构，计算机网络}={(张，离散数学)，(张，数据结构), (张，计算机网络),(白，离散数学),(白，数据结构),(白，计算机网络), (宋离散数学), (宋，数据结构), (宋，计算机网络), (方，离散数学), (方，数据结构), (方，计算机网络)}，表示所有可能的选课情况。

定理4.1 若A、B都是有限集，则 $A { \times } B$ 也是有限集， $|A \times B| = |A| \times |B|$

证明. 假设 $|A|=m,\ |B|=n$ ，根据笛卡儿积的定义，考虑 $A { \times } B$ 中的每一个元素 $( a , b )$ 的产生方式:第一元素有m种选择，而第二元素有n种选择，由乘法原理得到有序对共 $m \times$ n个。 □

定理4.2 笛卡儿积对于并或交运算满足分配律，即若A、B、C都是集合，则

(a) $A \times ( B \cap C ) = ( A \times B ) \cap ( A \times C )$ a

(b) $A \times ( B \cup C ) = ( A \times B ) \cup ( A \times C )$

(c) $(B \cap C) \times A = (B \times A) \cap (C \times A)$

(d) $(B \cup C) \times A = (B \times A) \cup (C \times A)$

证明.

（a）假设 $(x,y) \in A \times (B \cap C)$ ，则 $x \in A, y \in B \cap C$ ，由交集的定义有 $y { \in } B$ 且 $y { \in } C \circ$ 于是(x, $y \in (A \times B)$ 且 $(x,y) \in (A \times C)$ ，即 $(x,y) \in (A \times B) \cap (A \times C)$ ，继而得到 $A \times ( B \cap C ) \subseteq ( A \times B ) \cap ( A \times C )$ 0

反过来，假设 $(x,y) \in (A \times B) \cap (A \times C)$ ，则 $( x , y ) { \in } A { \times } B$ 且 $( x , y ) { \in } A { \times } C$ ，即 $x { \in } A , y { \in } B$ 且 $y { \in } C$由交集的定义有 $y { \in } B { \cap } C ,$ ，于是 $(x,y) \in A \times (B \cap C)$ ，继而有 $(A \times B) \cap (A \times C) \subseteq A \times (B \cap C)$

故: $A \times ( B \cap C ) = ( A \times B ) \cap ( A \times C )$ a

（b）～（d）的证明与之类似。

对于笛卡儿积的概念可以进一步推广。

定义 4.3 m 个集合 $A_{1},A_{2},\cdots,A_{m}$ 的笛卡儿积定义为

$$A_{1} \times A_{2} \times \cdots \times A_{m} = \left\{ (a_{1}, a_{2}, \cdots, a_{m}) \mid a_{i} \in A_{i}, i = 1, 2, \cdots, m \right\}$$

它的元素 $( a _ { 1 } , a _ { 2 } , \cdots , a _ { m } )$ 称为一个有序m元组，或简称m元组。

[page:106]

## 离散数学及应用（第2版）

注:当 $A_{1},A_{2},\cdots,A_{m}=A$ 时， $A_{1} \times A_{2} \times \cdots \times A_{m}$ 也记作 $A ^ { m }$

【例4.6】 R×R×R就是空间直角坐标系，其中每一个点都是一个有序3元组。

## 4.1.2 二元关系的定义

实际的选课情况只是笛卡儿积{张，白，宋，方}×{离散数学，数据结构，计算机网络}的一部分。在羽毛球比赛的例子中，{张，白，宋，方}×{张，白，宋，方}也不表示所有场次的胜负关系。例如不可能出现(张，张)，也不可能同时出现(张，白)和(白，张)。

因此在笛卡儿积的基础上还需要定义关系。

定义 4.4 假设A、B 是集合，A×B 的子集 R 称为A 到 B 的一个二元关系，简称为关系(relation)。当 $( a ,   b ) { \in } R$ 时，称 a 与 b 具有关系 R(a is related to b by R)，记为 aRb;若 $\scriptstyle { \left( a ,   b \right) \notin R }$ ，则称a与b不具有关系R。如果A=B则称R为A上的一个二元关系。

【例 4.7】 选课关系 R = {(张，数据结构),(张，离散数学),(白，数据结构),(方，计算机网络)}⊆{张，白，宋，方}×{离散数学，数据结构，计算机网络}。

【例4.8】 单循环羽毛球赛的胜负关系:{(张，白),(宋，张),(张，方),(白，宋),(方，白),(宋，方)}。

【例4.9】设集合 $A = \{ 0, 1 \}, B = \{ 1, 2, 3 \}, R_1 = \{ (0, 2) \}, R_2 = A \times B, R_3 = \varnothing, R_4 = \{ (0, 1) \}$则 $R_{1} 、 R_{2} 、 R_{3} 、 R_{4}$ 都是从A到B的关系， $R _ { 3 }$ 和 $R _ { 4 }$ 也是A上的关系。

【例4.10】假设A是任一个集合，则可定义如下关系:

（a）A上的空关系，即空集∅。

（b）A上的恒等关系: $I _ { A } { = } \{ ( a ,   a ) | a { \in } A \}$

(c) $\mathcal { P } ( A )$ 上的包含关系: $R _ { \subseteq } = \{ ( x , y ) | x , y \in \mathcal { P } ( A )$ 且 $x { \subseteq } { \mathcal { V } } \}$ 0

【例4.11】假设A是非零整数集N*的任一子集，则可以定义A上的整除关系为

$$D_{A}=\left\{ (x,y)|x,y\in A   且   x|y \right\}$$

假设B是实数集R的任一子集，则可以定义B上的小于或等于关系为

$$L_{B}=\left\{ (x,y)|x,y \in B  且  x \leq y \right\}$$

（类似地，可定义A上的倍数关系以及B上的大于或等于关系、小于关系、大于关系等。)

例如， $A = \{ 1, 2, 3 \}$ , 则 D,={(1, 1), (1, 2), (1, 3), (2, 2), (3, 3)}, $L _ { \mathcal { A } } { = } \{ ( 1 , 1 ) , ( 1 , 2 ) , ( 1 , 3 )$ (2, 2), (2, 3), (3, 3)} 。

【例4.12】设 $A   \subseteq   \mathbb { Z }   ,     n$ 为一个正整数，则可定义A上的“模n同余”关系R如下:

$$R=\left\{ (x,y) \mid x,y\in A   且   x=y\pmod{n} \right\}$$

【例4.13】

(a) $R = \left\{ (x,y) \mid x, y \in \mathbb{R}, x + 4y = 2 \right\}$ 代表了平面直角坐标系中的一条直线。

(b) $C = \{ (x,y) | x,y \in \mathbb{R}, x^2 + y^2 = 1 \}$ 是平面直角坐标系中点的横、纵坐标之间的关系，C中所有点恰好构成坐标平面上的单位圆。

(c) $R = \{ (x,y) \mid x, y \in$ R, $y>2x,x>0,x+y<4$ 代表了平面直角坐标系中的一个三角形（不含边界)。

(d)N上的关系 $R = \left\{ (x,y)|x,y \in \mathbb{N}, x > 0, y > 0, x + y < 4 \right\} = \left\{ (1,1), (1,2), (2,1) \right\}$ 表示平面直

[page:107]

## 第4章 二元关系

角坐标系中的一个三角形内部的整点。

定义4.5 假设A、B是集合， $R { \subseteq } A \times B$ 是A到B的一个二元关系。

（a）R的定义域（domain）为集合 $\mathrm{Dom}(R)=\{a|a\in A,$ 存在 $b   \in   B$ 使得 $( a , b ) { \in } R \}$ ，即R中所有有序对的第一元素构成的集合。

（b）R的值域（range）为集合1 $\mathrm{Rank}(R) = \{ b | b \in B,$ 存在 $a   \in   A$ 使得 $( a , b ) { \in } R \}$ ，即R中所有有序对的第二元素构成的集合。

（c）对于A中任一元素x，可定义x的像集（image）为 $R ( x ) { = } \{ y { \in } B | x R y \}$

（d）对于A的任一子集 $A _ { 1 }$ ，可定义 $A _ { 1 }$ 的像集为 $R ( A _ { 1 } ) { = } \{ y { \in } B | x R y$ 对某 $x   \in   A _ { 1 }$ 成立}，即 $R(A_{1}) = \bigcup_{x \in A_{1}} R(x)$ ；且定义 $R ( \varnothing ) = \varnothing$ 0

【例 4.14】 假设 R={(1, 1), (1, 2), (1,4 ), (2, 1), (3, 2), (3, 4)}是定义在集合A={1, 2, 3, 4}上的关系，则:Dom(R)={1, 2,3}，Ran(R)={1, 2,4}，R(2)={1}，R(3)={2,4}，R({2, 3})= {1, 2, 4}。

定理4.3假设A、B是集合，R、S是A到B的二元关系，若对于所有 $a   \in   A$ 都有 $R ( a ) { = } S ( a )$成立，则 R=S。

证明.对于任意 $( a ,   b ) { \in } R$ 有 $b { \in } R ( a ) { = } S ( a )$ ，因此 $(a,b){\in}S 。$ 于是 $R { \subseteq } S { \mathrm {  。  } }$ 类似地可证明S⊆R，从而 R=S。 □

定义4.6 假设A、B是集合， $R { \subseteq } A \times B$ 是A到B 的一个二元关系， $C { \subseteq } A$ ，则定义关系 R 在集合 C 上的限制（restriction of R to C) 为集合{(a, b) |(a, b)∈R且 $a   \in   C \}$ ，记之为$R | _ { C ^ { \circ } }$

可以将“关系”概念扩展为多元。

定义 4.7 假设 $A _ { 1 } ,   A _ { 2 } ,   \cdots ,   A _ { m }$ 是集合， $A_{1} \times A_{2} \times \cdots \times A_{m}$ 的子集R称为 $A _ { 1 } ,   A _ { 2 } ,   \cdots ,   A _ { m }$ 的一个m元关系。

【例4.15】一条学生信息记录事实上就是一个多元关系，如{李白（姓名),12100188（学号），中国文学（专业），3班（班级）}；而选课信息也是一个多元关系，如{李白（姓名），12100188（学号），男生体育—击剑（课程名称），李靖（授课教师）}；课程信息、教师信息也是多元关系。

此时关系也可以表示为二维表的形式，如表4.1至表4.4所示。

表4.1 学生信息<table><tr><td>姓      名</td><td><eq>学</eq>      号</td><td><eq>方</eq>      业</td><td>班      级</td></tr><tr><td>祖冲之</td><td>12101001</td><td>数学</td><td>1班</td></tr><tr><td>苏东坡</td><td>12103102</td><td>中国文学</td><td>3班</td></tr><tr><td>施耐庵</td><td>12103033</td><td>中国文学</td><td>3班</td></tr><tr><td>马钧</td><td>12102022</td><td>自动化技术</td><td>2班</td></tr><tr><td>公输班</td><td>12102024</td><td>机械制造</td><td>2班</td></tr><tr><td>李白</td><td>12103188</td><td>中国文学</td><td>3班</td></tr><tr><td>秦九韶</td><td>12101002</td><td>数学</td><td>1班</td></tr><tr><td>墨翟</td><td>12102026</td><td>机械制造</td><td>2班</td></tr></table>

[page:108]

## 离散数学及应用（第2版）

表 4.2 教师信息<table><tr><td>教师姓名</td><td>教师工号</td><td>开设课程</td></tr><tr><td>李靖</td><td>7809</td><td>男生体育       击剑</td></tr><tr><td>李靖</td><td>7809</td><td>军事理论</td></tr><tr><td>张良</td><td>8266</td><td>军事理论</td></tr><tr><td>司马迁</td><td>7021</td><td>中国古代史</td></tr><tr><td>.  •</td><td>• ·</td><td>•</td></tr></table>

表 4.3 课程信息<table><tr><td>课程名</td><td>授课教师</td><td>上课时间</td><td>上课地点</td></tr><tr><td>男生体育      -击剑</td><td>李靖</td><td>周一第二大节</td><td>体育场</td></tr><tr><td>军事理论</td><td>张良</td><td>周三第四大节</td><td>301</td></tr><tr><td>军事理论</td><td>李靖</td><td>周三第四大节</td><td>302</td></tr><tr><td>中国古代史</td><td>司马迁</td><td>周二第四大节</td><td>208</td></tr><tr><td>中国古代史</td><td>司马迁</td><td>周四第四大节</td><td>208</td></tr><tr><td></td><td></td><td>:</td><td></td></tr></table>

表 4.4 选课信息<table><tr><td>学生姓名</td><td>学生学号</td><td>课程名称</td><td>授课教师</td></tr><tr><td>李白</td><td>12103188</td><td>男生体育      -击剑</td><td>李靖</td></tr><tr><td>李白</td><td>12103188</td><td>军事理论</td><td>张良</td></tr><tr><td>苏东坡</td><td>12103102</td><td>中国古代史</td><td>司马迁</td></tr><tr><td>施耐庵</td><td>12103033</td><td>中国古代史</td><td>司马迁</td></tr><tr><td>•</td><td>•</td><td></td><td>•</td></tr></table>

而这就是关系数据库模型的理论基础。

1970 年 IBM 公司的研究员科德（E.F.Codd）发表了题为 A Relation Model of Data for Large Shared Data Banks的论文，首次提出了数据库系统的关系模型，并因此获得1981年的图灵奖。1977年IBM公司研制的关系数据库的代表系统 SystemR开始运行，其后又进行了不断的改进和扩充，出现了基于 SystemR的数据库系统 SQL/DB。当前流行的数据库管理系统产品大都是关系型数据库，数据库领域的研究工作也大都以关系方法为基础。

关系数据库的操作语言称为关系代数语言，对关系进行代数运算。关系代数语言的代表是 ISBL（Information System Base Language）语言。

关系代数的运算对象是关系，除传统的并、差、交和笛卡儿积等运算外，还包括选择、投影、连接和除法等专门的关系运算，例如在例4.15中通过表4.1～表4.4来得到李白需要在什么时间、要到何处去上课。

[page:109]

## 第4章 二元关系

## 4.1.3 二元关系的表示

采用集合的方式表示一个关系主要存在两点不足:不利于计算机进行处理；不够直观。因此关系还有其他3种主要的表现形式。

## 1. 关系矩阵

设 $A = \{ a_{1}, a_{2}, \cdots, a_{m} \}, B = \{ b_{1}, b_{2}, \cdots, b_{n} \}$ ，R是从A到B的关系，则可定义R的关系矩阵为一个m×n的布尔矩阵 $M _ { R } = [ r _ { i j } ] _ { m \times n } ,$ ，其中

$$r_{ij} = \left\{ \begin{aligned} 1 & \quad  if (a_i, b_j) \in R \\ 0 & \quad  if (a_i, b_j) \notin R \end{aligned} \right.$$

注:

（a）关系矩阵表示法只适合A、B为有限集的情况。

（b）关系矩阵适合表示从A到B的关系或者A上的关系。

（c）用矩阵表示关系，便于用代数方法研究关系的性质，进行关系的运算，也便于用计算机进行处理。

【例 4.16】 假设 R={(1, 1), (1, 2), (1, 4), (2, 1), (3, 2), (3, 4)}是定义在集合 A={1, 2, 3, 4}上的关系，则R的关系矩阵为

$$M_{_R} = \begin{pmatrix}1 & 1 & 0 & 1 \\1 & 0 & 0 & 0 \\0 & 1 & 0 & 1 \\0 & 0 & 0 & 0\end{pmatrix}$$

【例4.17】{张，白，宋，方}到{离散数学，数据结构，计算机网络}的选课关系R={(张，离散数学),(张，数据结构),(白，数据结构),(方，计算机网络)}的关系矩阵为

$$\boldsymbol{M}_{R}=\begin{pmatrix}1 & 1 & 0 \\0 & 1 & 0 \\0 & 0 & 0 \\0 & 0 & 1\end{pmatrix}$$

【例4.18】空关系的关系矩阵元素全部为0，恒等关系的关系矩阵是单位矩阵。

2. 关系图（directed graph，或 digraph）

若 $A { = } \{ a _ { 1 } , a _ { 2 } , \cdots , a _ { m } \}$ ，R是A上的关系，则R的关系图的画法如下:

（1）对A中每个元素，画一个圆形，并在圆形中标明该元素，称为关系图的顶点(vertice)。

(2） 如果 $\scriptstyle { \left( a _ { i } ,   a _ { j } \right) } \in R ,$ ，则从顶点 $a _ { i }$ 向顶点 $a _ { j }$ 画一个箭头，称为有向边或简称边（edge)，若 $a _ { i } { = } a _ { j }$ 则称这条边为自环（cycle）。

注:关系图表示法只适合表示有限集合A上的关系。

【例 4.19】 假设 R={(1, 1), (1, 2), (1, 4), (2, 1), (3, 2), (3, 4)}是定义在集合 A={1, 2, 3, 4}上的关系，则 R 的关系图如图 4.1所示。

[page:110]

## 110

## 3. 示意图（和关系图不同）

若 $A = \left\{ a_{1}, a_{2}, \cdots, a_{m} \right\}, B = \left\{ b_{1}, b_{2}, \cdots, b_{n} \right\}$ ，R是从A到B的关系，则R示意图的画法如下:

（1）左右两个椭圆分别列出集合A、B的所有元素。

(2） 如果 $( a _ { i } , b _ { j } )$ 属于关系R，则从左边的元素 $a _ { i }$ 向右边的元素 $b _ { j }$ 画一个箭头。

【例4.20】 选课关系 R={(张，数据结构),(张，离散数学)，(白，数据结构),(方，计算机网络)}的示意图如图4.2所示。

注:示意图表示法只适合A、B为有限集的情况。

假设 $A = \{ a_{1}, a_{2}, \cdots, a_{m} \}, B = \{ b_{1}, b_{2}, \cdots, b_{n} \}$ ，R是从A到 B的关系，则R的定义域和值域也可以从关系矩阵和关系图中看出:

图 4.2 例 4.20 用图

(a)若 $M _ { R }$ 的第i行中含有1，则 $a _ { i } { \in } \operatorname { D o m } ( R )$ ；若 $M _ { R }$ 的第j列中含有1，则 $b _ { j } \in \mathrm { R a n } ( R )$

(b）若 R的关系图中的顶点 $a _ { i }$ 至少发出一条有向边，则 $a _ { i } { \in } \operatorname { D o m } ( R )$ ；若至少有一条有向边指向顶点 $b _ { j }$ ，则 $b _ { j } { \in } \operatorname { R a n } ( R )$ 0

例如，从例 4.16 和例 4.19 中可以看出 Dom(R)={1, 2, 3}， $\mathrm{Ran}(R)=\{1,2,4\}$

## 4.2 关系的运算

关系的运算可以由已有关系产生新的关系，关系运算是关系理论的主要手段和工具。

## 4.2.1 关系的基本运算

首先关系是一种集合，因而集合的交、并、补、差运算对关系也适用。

定义4.8 假设A、B是两个集合，a∈A，b∈B，R、S为A到B的两个关系。

（a）R与S的交（intersection）关系R∩S定义为: $(a,   b) \in R \cap S$ 当且仅当 $( a ,   b ) { \in } R$ 且$( a ,   b ) { \in } S _ { \circ }$ 0

（b）R与S的并（union）关系R∪S定义为: $( a ,   b ) { \in } R \cup S$ 当且仅当 $( a , b ) { \in } R$ 或(a, b) $\in S _ { \odot }$

（c）R的补（complement）关系 $\overline { { R } }$ 定义为: $( a , b )   \in   \overline { { R } }$ 当且仅当 $\left( a , b \right) \not \in R$ 0

（d)R与S的差（difference）关系R-S定义为: $( a , b ) { \in } R { - } S$ 当且仅当 $( a , b ) { \in } R$ 且(a, b) ∉S。

另一方面，关系是一种特殊的集合，因而它又有不同于通常集合的运算:关系的逆和关系的复合。

定义 4.9 假设A、B 是两个集合，R 为 A 到 B 的关系，则 R 的逆(inverse)关系 $R ^ { - 1 }$定义为

$$R ^ { - 1 } { = } \{ ( b , a ) | b { \in } B , a { \in } A , ( a , b ) { \in } R \} { \subseteq } B { \times } A$$

简言之，R的逆关系是由将R中每个有序对的元素顺序交换构成的。

定理4.4假设A、B是集合，R、S为A到B的关系，则

[page:111]

## 第4章 二元关系

(a) $\mathrm{Dom}(R^{-1}) = \mathrm{Ran}(R), \quad \mathrm{Dom}(R) = \mathrm{Ran}(R^{-1})$

(b) $( R ^ { - 1 } ) ^ { - 1 } { = } R _ { \circ }$

(c) $\left( \overline { { R } } \right) ^ { - 1 } = \overline { { R ^ { - 1 } } }$

（d)若R⊂S，则 $\boldsymbol { R } ^ { - 1 }   \subseteq   \boldsymbol { S } ^ { - 1 }$

(e)若 R⊆S，则 ${ \overline { { S } } } \subseteq { \overline { { R } } }$ C

(f) $(R \cap S)^{-1} = R^{-1} \cap S^{-1}   且   (R \cup S)^{-1} = R^{-1} \cup S^{-1}$ o

证明.只证明（a）和（b），其余类似可证。

(a）若 $x { \in } \operatorname { D o m } ( R ^ { - 1 } )$ ，则存在y∈A，使得 $\scriptstyle { \cdot } ( x , y ) \in { \boldsymbol { R } } ^ { - 1 }$ ，即 $( y , x ) { \in } R$ ，于是 $x \in \operatorname{Rank}(R)$ ，从而 $\mathrm{Dom}(R^{-1}) \subseteq \mathrm{Ran}(R)$ 。类似可证明 $\mathrm{Ran}(R) \subseteq \mathrm{Dom}(R^{-1})$ 。故有 $\mathrm{Dom}(R^{-1}) = \mathrm{Ran}(R)$

类似地可证明 $\mathrm{Dom}(R)=\mathrm{Ran}(R^{-1})$

(b）若 $( x , y ) { \in } ( { \boldsymbol { R } } ^ { - 1 } ) ^ { - 1 }$ ，由逆的定义有 $\scriptstyle { \left( y ,   x \right) \in R ^ { - 1 } }$ ，即 $( x , y ) { \in } R .$

类似可证明，若(x, y)∈R，即 $( x , y ) { \in } ( { \boldsymbol { R } } ^ { - 1 } ) ^ { - 1 }$ 。故 $( R ^ { - 1 } ) ^ { - 1 } { = } R _ { \circ }$

定义4.10假设A、B、C是集合，R为A到B的关系，S为B到C的关系，则SR表示A到C的一个关系:

$S \circ R = \{ (a,c) \mid a \in A,   c \in C,$ 存在 b∈B 使得(a, b)∈R 且 $\scriptstyle { \left( b ,   c \right) \in S }   \}$

称为R和S的复合（composition）关系或合成关系。

【例4.21】实数集R上小于等于关系的逆是大于等于关系；正整数集上整除关系的逆是倍数关系。

【例 4.22】 假设集合 A={1, 2, 3, 4}，R={(1, 1), (1, 2), (1, 4), (2, 1), (3, 2), (3, 4)}和S={(1, 2), (1, 3), (2, 1), (2, 2), (2, 4), (4, 4)}是定义在 A 上的关系，则

R = { (1,3), (2,2), (2,3), (2,4), (3,1), (3,3), (4,1), (4,2), (4,3), (4,4) }

R1={(1, 1), (2, 1), (4, 1), (1, 2), (2, 3), (4, 3)}

R∩S={(1, 2), (2, 1)}

R ∪ S={(1, 1), (1, 2), (1, 3), (1, 4), (2, 1), (2, 2), (2, 4), (3, 2), (3, 4), (4, 4)}

SR ={(1, 1), (1, 2), (1, 3), (1, 4), (2, 2), (2, 3), (3, 1), (3, 2), (3, 4)}

RS={(1, 1), (1, 2), (1, 4), (2, 1), (2, 2), (2, 4)}

注:一般来讲关系的复合不满足交换律，即 $S ^ { \circ } R \neq R ^ { \circ } S$

【例4.23】 假设 R={(i, j)|2i+j=6}和 S={(j， k)|3j+k=10}是实数集R 上的关系。若(i, $k )   \in   { \cal S } ^ { \circ } R$ ，则存在 $j \in \mathbb { R }$ 使得 2i+j=6 且 $3 j { + } k { = } 1 0$ ，即 6i-k=8，于是 $S \circ R = \{ (i,k) \mid 6i - k = 8 \}$

【例 4.24】 R={(张，数据结构),(张，离散数学),(白，数据结构),(方，计算机网络)}，S={(数据结构，逸夫楼),(数据结构，一教),(离散数学，一教), (计算机网络，四教)}。

SR={(张，逸夫楼),(张，一教),(白，逸夫楼),(白，一教),(方，四教)}，表示各人的上课地点。此例表明也可以利用关系的示意图来计算关系的复合，如图4.3所示。

定理4.5（关系复合运算的保序性）假设A、B、C为集合， $R_{1} 、 R_{2}$ 為A到B的关系， $S _ { 1 }  、  S _ { 2 }$ 为 B 到C的关系， $R_{1} \subseteq R_{2}, \ S_{1} \subseteq S_{2}$ ，则 $S_{1} \circ R_{1} \subseteq S_{2} \circ R_{2}$

定理4.6假设A、B、C为集合，R为A到B的关系，S为B到C的关系，则对于A 的任意子集 $A _ { 1 }$ 有 $( S \circ R ) ( A _ { 1 } ) = S ( R ( A _ { 1 } ) )$ 10

[page:112]

## 112

【例 4.25】 R={(张，数据结构),(张，离散数学),(白，数据结构),(方，计算机网络)}，S={(数据结构，逸夫楼),(数据结构，一教),(离散数学，一教), (计算机网络，四教)}。

(SR)(白)={逸夫楼，一教}表示该同学需要去逸夫楼和一教上课；另一方面，$R( 白 ) = \left\{ \begin{aligned}  \end{aligned} \right.$ 数据结构}，S(数据结构)={逸夫楼，一教}。

定理4.7 设 R 为A到 B 的关系，则 $R = R \circ I_{A} = I_{B} \circ R$

证明. 对任意x∈A，有 $I _ { B } \circ R ( x ) = I _ { B } ( R ( x ) ) = R ( x ) 及 R \circ I _ { A } ( x ) = R ( I _ { A } ( x ) ) = R ( x )$ ，由定理4.3即得结论。 □

定理4.8假设A、B、C、D为集合，R为A到B的关系， $S _ { 1 }  、  S _ { 2 }$ 为B到C的关系，T为C到D的关系，则

(a) $(S_{1} \cup S_{2}) \circ R = (S_{1} \circ R) \cup (S_{2} \circ R)$

(b) $(S_{1} \cap S_{2}) \circ R \subseteq (S_{1} \circ R) \cap (S_{2} \circ R)$

(c) $T \circ ( S _ { 1 } \cup S _ { 2 } ) = ( T \circ S _ { 1 } ) \cup ( T \circ S _ { 2 } ) .$ 0

(d) $T \circ ( S _ { 1 } \cap S _ { 2 } ) \subseteq ( T \circ S _ { 1 } ) \cap ( T \circ S _ { 2 } )$ 0

证明.只证明(a)和(b)。

（a）若 $(a, c) \in (S_1 \cup S_2) \circ R$ ，则由复合运算的定义，存在 $b   \in   B$ ，使得 $( a , b ) { \in } R$ 且(b, $c ) { \in } S _ { 1 } \cup S _ { 2 }$ 。若 $( b , c ) { \in } S _ { 1 }$ ，则 $( a , c ) { \in } S _ { 1 } { \circ } R$ ；若 $( b , c ) { \in } S _ { 2 }$ ，则 $(a, c) \in S_{2} \circ R$ 。总而言之有 $( S _ { 1 } \bigcup$ $S_{2}) \circ R \subseteq (S_{1} \circ R) \cup (S_{2} \circ R)$

反之，对于任意 $( a , c ) { \in } ( S _ { 1 } { \circ } R ) \cup ( S _ { 2 } { \circ } R )$ ，若 $( a , c ) { \in } S _ { 1 } { \circ } R$ 则存在 $b _ { 1 } { \in } B$ ，使得 $\scriptstyle { \left( a ,   b _ { 1 } \right) \in R }$ 且$( b _ { 1 } ,   c ) { \in } S _ { 1 } { \subseteq } S _ { 1 } \cup S _ { 2 }$ ，于是 $(a,   c) \in (S_1 \cup S_2) \circ R;$ ；若 $( a ,   c ) { \in } S _ { 2 } { \circ } R$ 则存在 $b _ { 2 } { \in } B$ ，使得 $( a ,   b _ { 2 } ) { \in } R$ 且$( b _ { 2 } , c ) { \in } S _ { 2 } { \subseteq } S _ { 1 } \cup S _ { 2 } ,$ ，于是 $( a , c ) { \in } ( S _ { 1 } \cup S _ { 2 } ) { \circ } R$ 。总而言之有 $(S_{1} \circ R) \cup (S_{2} \circ R) \subseteq (S_{1} \cup S_{2}) \circ R$

综合以上两点即得 $(S_{1} \cup S_{2}) \circ R = (S_{1} \circ R) \cup (S_{2} \circ R)$

（b）若 $(a,   c) \in (S_1 \cap S_2) \circ R$ ，则存在 $b   \in   B$ ，使得 $(a,   b){\in}R$ 且 $(b,   c) {\in} S_1 {\cap} S_2$ ，从而 $( b , \; c ) { \in } S _ { 1 }$且 $( b , c ) { \in } S _ { 2 } .$ 。于是 $( a , c ) { \in } ( S _ { 1 } { \circ } R ) { \cap } ( S _ { 2 } { \circ } R )$ ，继而得到 $(S_{1} \cap S_{2}) \circ R \subseteq (S_{1} \circ R) \cap (S_{2} \circ R)$ o □

关系的运算和关系的矩阵表示有如下联系。

定理4.9 假设A、B、C为有限集合，R、T为A到B的关系，S为B到C的关系，则

(a) $M_{(R \cap T)} = M_R \wedge M_{T}$ 0

(b) $M_{(R \cup T)} = M_R \lor M_{T^c}$ 0

(c) $M _ { \overline { { R } } } = \overline { { M _ { R } } }$ 0

(d) $M _ { R ^ { - 1 } } = M _ { R } ^ { \mathrm { T } }$ 0

(e) $M_{(S \circ R)} = M_R \odot M_{S}$

[page:113]

## 第4章 二元关系

证明. 只证(e)，其余由定义即得。

(e) $( M _ { R } \odot M _ { S } ) ( i , j ) = 1$ 当且仅当存在k使得 $M _ { R } ( i , k ) { = } 1$ 且 $M _ { S } \left( k , j \right)   =   1$ ，即 $( i , k ) { \in } R$ 且(k, $j ) { \in } { \mathcal { S } } .$ 。而由复合的定义，存在k使得(i, k)∈R且 $( k , j ) { \in } S$ 当且仅当 $i ( i , j ) { \in } S ^ { \circ } \quad R$ ，即 $M _ { ( S ^ { \circ } R ) } ~ ( i ,$ j)=1。 口

【例 4.26】 假设集合 A={1, 2, 3, 4},R={(1,1), (1,2), (1,4), (2,1), (3,2), (3,4)}和 $S = \{ (1,2)$ (1,3), (2,1), (2,2), (2,4), (4,4)}是定义在A 上的关系，则

$$\begin{array} { r } { \pmb { M } _ { \pmb { \mathscr { R } } } = \left( \begin{array} { l l l l } { 1 } & { 1 } & { 0 } & { 1 } \\ { 1 } & { 0 } & { 0 } & { 0 } \\ { 0 } & { 1 } & { 0 } & { 1 } \\ { 0 } & { 0 } & { 0 } & { 0 } \end{array} \right) , \qquad \pmb { M } _ { \pmb { \mathscr { S } } } = \left( \begin{array} { l l l l } { 0 } & { 1 } & { 1 } & { 0 } \\ { 1 } & { 1 } & { 0 } & { 1 } \\ { 0 } & { 0 } & { 0 } & { 0 } \\ { 0 } & { 0 } & { 0 } & { 1 } \end{array} \right) , \qquad \pmb { M } _ { \pmb { \mathscr { R } } } \odot \pmb { M } _ { \pmb { \mathscr { S } } } = \left( \begin{array} { l l l l } { 1 } & { 1 } & { 1 } & { 1 } \\ { 0 } & { 1 } & { 1 } & { 0 } \\ { 1 } & { 1 } & { 0 } & { 1 } \\ { 0 } & { 0 } & { 0 } & { 0 } \end{array} \right) } \end{array}$$

这与例4.22的结果是相符的。

定理4.10（复合运算的结合律）假设A、B、C、D均为非空集合，R为A到B的关系，S为B到C的关系，T为C到D的关系，则

$$T ^ { \circ } ( S ^ { \circ } R ) = ( T ^ { \circ } S ) ^ { \circ } R \circ$$

证明.当A、B、C、D均为有限集合时，可使用关系矩阵这一工具来证明:

$$M_{T \circ (S \circ R)} = (M_R \odot M_S) \odot M_T, \quad M_{(T \circ S) \circ R} = M_R \odot (M_S \odot M_T)$$

由定理1.28， $(M_{R} \odot M_{S}) \odot M_{T} = M_{R} \odot (M_{S} \odot M_{T})$ ，于是 $T ^ { \circ } ( S ^ { \circ } R ) = ( T ^ { \circ } S ) ^ { \circ } R$

当A、B、C、D不全为有限集合时，通过定义也易证明定理的结论。

定理4.11 假设A、B、C为非空集合，R为A到B的关系，S为B到C的关系，则

$$( S ^ { \circ } R ) ^ { - 1 } = R ^ { - 1 } \circ S ^ { - 1 }$$

证明. 对于一般情形，可以使用定义4.10证明。

当A、B、C为有限集合时，由定理1.29有

$$M_{(S \circ R)^{-1}} = (M_{S \circ R})^{\mathrm{T}} = (M_{R} \odot M_{S})^{\mathrm{T}} = M_{S}^{\mathrm{T}} \odot M_{R}^{\mathrm{T}} = M_{S^{-1}} \odot M_{R^{-1}} = M_{R^{-1} \circ S^{-1}}$$

因此， $( S ^ { \circ } R ) ^ { - 1 } = R ^ { - 1 } \circ S ^ { - 1 }$ 0

可以将定理4.4和定理4.11的结果总结为表4.5。

表 4.5 定理 4.4 和定理 4.11 的结果<table><tr><td>□</td><td></td><td><eq>口 ^{-1}</eq></td></tr><tr><td><eq>R \subseteq S</eq></td><td><eq>{ \overline { { S } } } \subseteq { \overline { { R } } }</eq></td><td><eq>R ^ { - 1 }     \subseteq   S ^ { - 1 }</eq></td></tr><tr><td>R∩S</td><td><eq>\overline { { R \bigcap S } } = \overline { { R } } \cup \overline { { S } }</eq></td><td><eq>( R \cap S ) ^ { - 1 } { = } R ^ { - 1 } \cap S ^ { - 1 }</eq></td></tr><tr><td><eq>R \cup S</eq></td><td><eq>\overline { { R \cup S } } = \overline { { R } } \cap \overline { { S } }</eq></td><td><eq>( R \cup S ) ^ { - 1 } { = } R ^ { - 1 } \cup S ^ { - 1 }</eq></td></tr><tr><td>SoR</td><td>1</td><td><eq>( S \circ R ) ^ { - 1 } = R ^ { - 1 } \circ S ^ { - 1 }</eq></td></tr><tr><td></td><td colspan=2><eq>\left( \overline { { R } } \right) ^ { - 1 } = \overline { { R ^ { - 1 } } }</eq></td></tr></table>

## 4.2.2 关系的幂和道路

对于集合A上的关系R，可定义R的幂。

[page:114]

## 114

定义 4.11 设 R 为集合A 上的关系，n 为自然数，则 R 的 n 次幂 $( \mathrm { \bf ~ p o w e r } ) R ^ { n }$ 可递归地定义为

$$\begin{array} { l } { R ^ { 0 } { = } I _ { A } } \\ { R ^ { n } { = } R ^ { n - 1 } { \circ } R \quad n { = } 1 , 2 , 3 , \cdots } \end{array}$$

注:对于A 上的关系 R，计算 $R ^ { n }$ 就是n个R的复合。由定义可知，对于A上的任何关系 R都有 $R ^ { 0 } { = } I _ { A }$ 及 $R ^ { 1 } { = } R$

定理4.12 对于任何自然数 m、n有

$$R^{m} \circ R^{n} = R^{m + n}, \quad (R^{m})^{n} = R^{m \times n}$$

证明.使用数学归纳法。

（a）对于任意给定的 $m   \in   \mathbb { N }$ ，施归纳于n:若 $n { = } 0$ ，则有

$$R^{m} \circ R^{0} = R^{m} \circ I_{A} = R^{m} = R^{m+0}$$

假设 $R^{m} \circ R^{n} = R^{m + n}$ 成立，则有

$$R^{m}{\circ}R^{n+1}{=}R^{m}{\circ}(R^{n}{\circ}R){=}(R^{m}{\circ}R^{n}){\circ}R{=}R^{m+n+1}$$

所以对一切 $m , n   \in   \mathbb { N }$ 有 $R^{m} \circ R^{n} = R^{m + n}$ 0

（b）对于任意给定的 $m   \in   \mathbb { N }$ ，施归纳于 n:若 $n { = } 0$ ，则有

$$( R ^ { m } ) ^ { 0 } = I _ { A } = R ^ { 0 } = R ^ { m \times 0 }$$

假设 $( R ^ { m } ) ^ { n } = R ^ { m n }$ ，则有

$$( \boldsymbol { R } ^ { m } ) ^ { n + 1 } { = } ( \boldsymbol { R } ^ { m } ) ^ { n } { \circ } \boldsymbol { R } ^ { m } { = } ( \boldsymbol { R } ^ { m n } ) { \circ } \boldsymbol { R } ^ { m } { = } \boldsymbol { R } ^ { m n + m } { = } \boldsymbol { R } ^ { m ( n + 1 ) }$$

所以对一切 $m , n   \in$ N有 $( R ^ { m } ) ^ { n } = R ^ { m n }$ 0

【例 4.27】 假设集合 A={1, 2, 3, 4}，R={(1,1), (1,2), (1,4), (2,1), (3,2), (3,4)}是定义在A 上的关系，求R的1~4 次幂的关系矩阵。

解.

$$M_{_R} = \begin{pmatrix}1 & 1 & 0 & 1 \\1 & 0 & 0 & 0 \\0 & 1 & 0 & 1 \\0 & 0 & 0 & 0 \\\end{pmatrix}, \quad M_{_{R^2}} = \begin{pmatrix}1 & 1 & 0 & 1 \\1 & 1 & 0 & 1 \\1 & 0 & 0 & 0 \\0 & 0 & 0 & 0 \\\end{pmatrix},$$

$$M_{_{R^{3}}}=\begin{pmatrix}1 & 1 & 0 & 1 \\1 & 1 & 0 & 1 \\1 & 1 & 0 & 1 \\0 & 0 & 0 & 0\end{pmatrix}, \quad M_{_{R^{4}}}=\begin{pmatrix}1 & 1 & 0 & 1 \\1 & 1 & 0 & 1 \\1 & 1 & 0 & 1 \\0 & 0 & 0 & 0\end{pmatrix}$$

下面从关系图的角度来看关系的幂，首先需要定义道路。

定义 4.12 假设 A 为集合,a, b∈A,集合 A 上关系 R 中从 a 到 b 长为 n 的道路( path)是指A上的有限序列 $\pi \colon a , x _ { 1 } , x _ { 2 } , \cdots , x _ { n - 1 } , b$ ，满足

(1) $a R x _ { 1 }$ 0

(2) $x _ { i } R x _ { i + 1 }$ , 1≤i≤n-2。

(3) $x _ { n - 1 } R b$ 0

注:长度为n的道路包含n+1个顶点（允许重复）。

[page:115]

## 第4章 二元关系

【例 4.28】 在图4-4所表示的关系中，a, b, c, $d , f , e , b$ 是长为6的道路， $e , b , d , f , h , g , e , b , c$ 是长为8的道路。

定义 4.13 假设 A 为集合， $a , b { \in } A$ ，集合A上关系 R 中从 a 到 b 的一条道路（path）是指 A上的有限序列 $\pi \colon a , x _ { 1 } , x _ { 2 } , \cdots , x _ { n - 1 } ,   b   ,$ ，其中 $n { > } 0$ 称为该道路的长度 $( \mathbf { l e n g t h } )$ ，a称做该道路的起点，b 称做该道路的终点。若 $a { = } b$ ，则称之为回路(circuit)。

下述定理建立了关系的幂运算和“长为n的道路”概念之间的关系。

定理 4.13 设 R 为集合A 上的关系， $a , b   \in   A$ ，则存在 R 中从 a 到 b 长为 n 的道路当且仅当 $( a , b ) { \in } { \boldsymbol { R } } ^ { n }$ 0

证明.由定义易得。

类似地，可以定义关系 $R ^ { \infty }$

定义 4.14 设 R 为集合 A 上的关系，α， b∈A，则 $a \boldsymbol { R } ^ { \infty } \boldsymbol { b }$ 当且仅当存在 R 中从 $a$ 到 $b$的一条道路。

【例4.29】在图4.4中， $a R ^ { \infty } b , \quad e R ^ { \infty } h$ ，但是 $( g , a ) { \not \in } R ^ { \infty }$ 0

定义 4.15 假设 $\pi _ { 1 } : a , x _ { 1 } , x _ { 2 } , \cdots , x _ { n - 1 } , b$ 和 $\pi _ { 2 } : b , y _ { 1 } , y _ { 2 } , \cdots , y _ { m - 1 } , c$ 是关系R中的两条道路，则定义 $\pi _ { 1 }$ 和 $\pi _ { 2 }$ 的复合（composition）为道路 $a , x _ { 1 } , x _ { 2 } , \cdots , x _ { n - 1 } , b , y _ { 1 } , y _ { 2 } , \cdots , y _ { m - 1 } , c _ { \circ }$

定理 4.14 设 R 为集合A 上的关系，则 $R^{\infty} = \bigcup_{i = 1}^{\infty} R^{i} = R \cup R^{2} \cup R^{3} \cup \cdots$

证明. 假设 $a , b   \in   A$ 且 $a { \boldsymbol { R } } ^ { \circ \circ } { \boldsymbol { b } }$ ，则由定义存在 R 中从 a到 b 的道路 $\pi _ { 0 }$ 设π的长度为n，则 $a R ^ { n } b$ ，于是 $R ^ { \infty } \subseteq \bigcup _ { i = 1 } ^ { \infty } R ^ { i } .$

反过来，对于任意 $\left( a , b \right) { \in } \bigcup _ { i = 1 } ^ { \infty } R ^ { i }$ ，必存在整数n使得 $( a , b ) \in R ^ { n }$ 。由定理4.13，存在R中从a到b长为n的道路，于是 $( a , b ) \in R ^ { \infty }$ 。因此 $R ^ { n } \subseteq R ^ { \infty }$ ，继而 $\bigcup_{i = 1}^{\infty} R^{i} = R \cup R^{2} \cup \cdots \subseteq R^{\infty}$ o

定理4.15 假设 R 是有限集合A上的关系，|A|=n，则

$$R^{\infty}=R\cup R^{2}\cup R^{3}\cup\cdots\cup R^{n}$$

证明.分两部分证明:

(a）显然有R∪R²∪R³∪…∪Rⁿ⊂R=R∪R²∪R³∪…。

（b）下面证明 $R^{\infty} \subset R \cup R^{2} \cup R^{3} \cup \cdots \cup R^{n}$ 0

若 $a \boldsymbol { R } ^ { \infty } \boldsymbol { b }$ ，则存在 R 中从 α 到 b 的道路 $\pi \colon a , x _ { 1 } , x _ { 2 } , \cdots , x _ { m - 1 } , b$ 其中 $m   \geq   1$ 。若 $m { - } 1 { \geq } n$则由鸽巢原理，必定存在顶点 $x _ { i }$ 和 $x _ { j } , i \lnot j$ ，使得 $x _ { i } { = } x _ { j }$ (如图4.5所示)。

于是可以得到更短的道路 $\pi \colon a , x _ { 1 } , \cdots , x _ { i } , x _ { j + 1 } , \cdots , x _ { m - 1 } , b$ ，其长度为 $m { - } ( j { - } i )$

因此总可以假定道路中间经过的顶点各异，且 $m { - } 1 { \leqslant } n$

[page:116]

## 离散数学及应用（第2版）

若 $m { - } 1 { \leq } n$ ，则定理4.15成立。

若 m-1=n，则存在 k，使得 1≤k≤m-1， $a { = } x _ { k }$ 或 $b   =   x _ { k } ;$ 不失一般性，假定 $a { = } x _ { k }$ 。则由图4.6知，存在更短的道路 $\pi ^ { \prime } : a , x _ { k + 1 } , \cdots , b$ ，其长度不超过n。

因此，存在从 a到b的道路π，其长度不超过n，即 $(a,   b) \in R \cup R^2 \cup R^3 \cup \cdots \cup R^n$ 。口

## 4.3 关系的性质

在集合A上可以定义很多不同的关系，但很多时候对我们具有实际意义的只是其中的一部分，它们一般都具有一些特殊的性质。本节将讨论关系的性质及相关问题。

## 4.3.1 关系性质的定义和判断

定义4.16 假设R为集合A上的关系。

（a）如果 $( a ,   a ) { \in } R$ 对于所有 $a   \in   A$ 成立，则称 R是自反的（reflexive)，或称 R 满足自反性。

（b）如果 $\scriptstyle { \left( a ,   a \right) \not \in R }$ 对于所有a∈A 成立，则称 R是非自反的（irreflexive)，或称 R满足非自反性。

(c)如果对于任意 $a , b   \in   A$ ，若 $( a ,   b ) { \in } R$ 必然有 $( b , a ) { \in } R$ ，则称R是对称的(symmetric)，或称R满足对称性。

（d）如果对于任意 $a , b { \in } A$ ，若 $( a , b ) { \in } R$ 必然有 $( b , a ) { \notin } R$ ，则称R是非对称的(asymmetric)，或称R 满足非对称性。

(e）如果对于任意 $a , b { \in } A$ ，若 $(a, b) \in R$ 且 $( b , a ) { \in } R$ 必然有 $a { = } b$ ，则称 R是反对称的

[page:117]

## 第4章 二元关系

(antisymmetric)，或称R 满足反对称性。

（f）如果对于任意 $a ,   b ,   c { \in } A$ ，若 $( a ,   b ) { \in } R$ 且 $( b ,   c ) { \in } R$ 必然有 $( a ,   c ) { \in } R$ ，则称R是传递的（transitive），或称R满足传递性。

注:（a）R是非对称的另一等价定义是:对于任意a, b∈A，(a, b)∈R和 $( b , a ) { \in } R$ 不同时成立:

$$\begin{aligned}&\forall a \forall b ((a, b) \text{\in } R \text{\Rightarrow } (b, a) \text{\notin } R) \\\text{\in } & \forall a \forall b (\because (a, b) \text{\in } R \lor (b, a) \text{\notin } R) \\\text{\in } & \forall a \forall b ((a, b) \text{\notin } R \lor (b, a) \text{\notin } R) \\\text{\in } & \because \exists a \exists b ((a, b) \text{\in } R \land (b, a) \text{\in } R)\end{aligned}$$

（b）R是反对称的另一等价定义是:对于任意 $a ,   b   \in   A$ ，若 $( a ,   b ) { \in } R$ 且 $a \neq b$ 则必然有$( b , a ) { \not \in } R$ :

$$\begin{aligned}&\forall a \forall b ((a,   b) \in R \land (b,   a) \in R \Rightarrow a = b) \\=& \forall a \forall b (\sim ((a,   b) \in R \land (b,   a) \in R) \lor a = b) \\=& \forall a \forall b (\sim (a,   b) \in R \lor \sim (b,   a) \in R \lor a = b) \\=& \forall a \forall b (\sim ((a,   b) \in R \land a \neq b) \lor \sim (b,   a) \in R) \\=& \forall a \forall b ((a,   b) \in R \land a \neq b \Rightarrow (b,   a) \notin R)\end{aligned}$$

（c）若关系R是非对称的，一定是反对称的。

简言之，假设R为集合A上的关系，则

（a）R满足自反性: $\forall a   (a, a) {\in} R.$ a

(b）R满足非自反性: $\forall a   ( a , a ) { \not \in } R .$

（c）R满足对称性: $\forall a \forall b   ( ( a , b ) { \in } R { \Rightarrow } ( b , a ) { \in } R ) \text { 。 }$

（d)R满足非对称性: $\forall a \forall b   ( ( a , b ) { \in } R { \Rightarrow } ( b , a ) { \not \in } R )$

或 $\forall a \forall b ( ( a , b ) { \not \in } R \lor ( b , a ) { \not \in } R ) ,$

或 $\sim \exists a \exists b ( ( a , b ) { \in } R \land ( b , a ) { \in } R ) \text { 。 }$

(e） R 满足反对称性: $\forall a \forall b   ( ( a , b ) { \in } R { \land } ( b , a ) { \in } R { \Rightarrow } b { = } a ) ,$

或 $\forall a \forall b   ( ( a , b ) { \in } R { \land } a { \neq } b { \Rightarrow } ( b , a ) { \notin } R ) ,$

或 $\neg \exists a \exists b ( ( a , b ) { \in } R \land ( b , a ) { \in } R \land a { \neq } b ) \text { 。 }$

(f) R满足传递性: $\forall a \forall b \forall c   ( ( a , b ) { \in } R { \land } ( b , c ) { \in } R { \Rightarrow } ( a , c ) { \in } R ) \text { 。 }$

【例4.30】设集合 $A = \{ a , b , c \} , R _ { 1 } , R _ { 2 } , R _ { 3 }$ 和 $R _ { 4 }$ 是A上的关系，其中

$$R _ { 1 }   =   \{ ( a , b ) , ( b , a ) , ( c , c ) \} , \quad R _ { 2 }   =   \{ ( a , a ) , ( a , b ) , ( b , c ) , ( c , b ) \}$$

$$R _ { 3 }   =   \{ ( b , a ) , ( b , c ) \} ,   R _ { 4 }   =   \{ ( a , a ) , ( b , b ) , ( c , c ) , ( a , b ) , ( b , c ) , ( c , a ) \}$$

则:

$R _ { 1 }$ 不具有自反性，不具有非自反性，具有对称性，不具有非对称性，不具有反对称性，不具有传递性

$R _ { 2 }$ 不具有自反性，不具有非自反性，不具有对称性，不具有非对称性，不具有反对称性，不具有传递性

$R _ { 3 }$ 不具有自反性，具有非自反性，不具有对称性，具有非对称性，具有反对称性，具有传递性。

[page:118]

## 118

$R _ { 4 }$ 具有自反性，不具有非自反性，不具有对称性，不具有非对称性，具有反对称性，不具有传递性。

注:由 $\scriptstyle { \left| { \sim } \forall a \forall b \forall c ( ( a ,   b ) \in R \land ( b ,   c ) \in R \Rightarrow ( a ,   c ) \in R ) = \exists a \exists b \exists c ( ( a ,   b ) \in R \land ( b ,   c ) \in R \land ( a ,   c ) \not \in R ) \right.}$可知，关系R不具有传递性当且仅当存在有序对 $[ a ,   b ) { \in } R$ 且 $( b ,   c ) { \in } R$ 但是 $( a ,   c ) { \not \in } R \text { 。 }$ 。而在$R _ { 3 }$ 中没有出现这种情况，因此 $R _ { 3 }$ 具有传递性。

【例4.31】假设A是任一集合，则A上的恒等关系具有自反性、对称性、反对称性、传递性，A上的空关系满足非自反性、对称性、非对称性、反对称性、传递性。

【例4.32】 设A为R的一个非空子集，则A上的小于或等于关系 $"  \leqslant  "$ 是自反、反对称和传递的:

（1）对于任意 $x { \in } A$ ，都有 $x { \leqslant } x$ 成立，因而满足自反性。

(2) 对于任意 $x , y { \in } A ,$ 若 $x { \leqslant } y$ 且 $y { \leqslant } x$ 则必然有 $x { = } y$ ，因而满足反对称性。

（3） 对于任意 $x , y , z { \in } A$ ，若 $x { \leqslant } y$ 且 $y { \leqslant } z$ 则必然有 $x { \leqslant } z$ ，因而满足传递性。

【例4.33】设A为R的一个非空子集，则A上的小于关系 $`` < ''$ 是非自反、非对称、反对称和传递的:

（1）对于任意 $x { \in } A$ ，都有 $x { \leq } x$ 不成立，因而满足非自反性。

（2） 对于任意 $x , y { \in } A ,$ ，若 $x { \leq } y$ 则一定没有 $y { \leq } x$ 及一定有 $x \neq y$ ，因而满足非对称性、反对称性。

（3）对于任意 $x , y , z { \in } A ,$ ，若 $x { \leq } y$ 且 $y { < } z$ 则 $x   <   z$ ，因而满足传递性。

【例4.34】 设A为R的一个非空子集，则A上的不等于关系“≠”是非自反和对称的，但不是传递的——由 $x \neq y$ 及 $y \neq z$ 并不能得到 $x \neq z$

【例4.35】对于任意集合S，S)上的包含关系⊂满足自反性、反对称性、传递性(S)上的真包含关系⊂满足非自反性、非对称性、反对称性和传递性。

【例4.36】设A为 $\mathbb { N } ^ { + }$ 的一个非空子集，则

（a）A上的整除关系“|”是自反、反对称和传递的。

（b）A上的“模n同余”关系具有

（1）自反性: $a \equiv a \pmod{n}$ C

(2） 传递性: $a \equiv b(\bmod n)$ 且 $b \equiv c(\bmod n)$ 则必然有 $a \equiv c(\bmod n)$ 0

（3）对称性:若 $a \equiv b(\bmod n)$ 则 $b \equiv a \pmod{n}$ 0

## 【例4.37】

（a）单循环篮球联赛中的“打败”关系具有非自反性、非对称性、反对称性，且一般不具有传递性。

(b）双循环足球联赛中的“打败”关系具有非自反性，一般不具有非对称性、反对称性、传递性。

（c）平面上三角形的“相似”关系满足自反性、对称性、传递性。

（d）学生的“同班”关系满足自反性、对称性、传递性。

（e）设A与B都是n阶矩阵，如果存在n阶可逆矩阵P，使得 $P^{-1}AP = B$ ，则称A与B相似。矩阵的相似关系满足自反性、对称性、传递性。

定理4.16 设 R 为集合A上的关系，则

[page:119]

## 第4章 二元关系

（a）R具有自反性当且仅当 $I _ { A } { \subseteq } R .$ 0

（b）R具有非自反性当且仅当 $R \cap I_{A} = \varnothing$

（c）R具有对称性当且仅当 $R { = } R ^ { - 1 } .$ 0

（d）R具有非对称性当且仅当 $R \cap R ^ { - 1 } = \varnothing .$ C

（e）R具有反对称性当且仅当 $R \cap R ^ { - 1 } \subseteq I _ { A }$ 0

（f）R具有传递性当且仅当 $R ^ { 2 } { \subseteq } R \text { 。 }$

证明.

(a) 假设 $I _ { \mathcal { A } } \subseteq R$ ，则对于任意 $a   \in   A ,$ 由于 $( a , a ) { \in } I _ { A }$ ，有 $( a ,   a ) { \in } R$ ，因此R具有自反性；反过来，如果R具有自反性，则对于任意的 $a   \in   A$ 有 $[ ( a , a ) { \in } R ,$ ，因此 $I _ { \mathcal { A } } \subseteq R$

（b）证明过程与（a）类似。

(c) 假设 $R   =   R ^ { - 1 }$ ，则对于任意 $a ,   b   \in   A$ ，若 $( a ,   b ) { \in } R$ 则 $( a ,   b ) { \in } R ^ { - 1 } { = } R$ ，即 $( b ,   a ) { \in } R$ ，因此R具有对称性。

反过来，假设R具有对称性。对于任意 $a , b { \in } A ,$ 若 $( a ,   b ) { \in } R ^ { - 1 }$ 则由定义有 $$[ ( b , a ) { \in } R ;$$由 R 的对称性有 $[a, b) \in R$ ，从而 $$R ^ { - 1 } { \subseteq } R ;$$ 若 $(a, b) \in R$ 则由 R 的对称性有 $(b, a){\in}R$ ，即(a, $b )   \in   \boldsymbol { R } ^ { - 1 }$ ，从而 $R { \subseteq } R ^ { - 1 }$ 。综合这两者得到 $R { = } R ^ { - 1 }$ 0

（d）、（e）的证明与（c）类似。

(f)假设 $R ^ { 2 } { \subseteq } R \text { 。 }$ 若 $\scriptstyle { \left( a ,   b \right) \in R }$ 且 $( b , c ) { \in } R$ ，则由复合运算的定义有 $[ ( a , c ) { \in } { \boldsymbol { R } } ^ { 2 }$ ，继而 $[ ( a , c ) { \in } R ,$于是R满足传递性。

反过来，假设R满足传递性。若 $( a , c ) { \in } { \boldsymbol { R } } ^ { 2 }$ 则存在 $b   \in   A ,$ ，使得 $$. ( a , b ) { \in } R$$ 且 $$( b , c ) { \in } R \text { 。  }$$ ，于是 $$\mathrm { { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { } ~ } ~ } } } } } } } } ( a , c ) { \in } R \mathrm { { \tt { \tt { \tt ~ { \tt { \tt ~ { \tt ~ { \tt { \tt ~ { \tt ~ { \tt } ~ { \tt } } } } } } } } } } } \mathrm { { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt } ~ { \tt ~ { \tt } } } } } } } } } } \mathrm { { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt } ~ { \tt ~ { \tt } } } } } } } } } } \mathrm { { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt } ~ { \tt ~ { \tt } } } } } } } } } } \mathrm { { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt } ~ } } } } } } } } \mathrm { { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt } ~ } } } } } } } \mathrm { { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt } ~ } } } } } } } \mathrm { { \tt ~ { \tt \tt ~ { \tt ~ { \tt ~ { \tt ~ { \tt } ~ } } } } } } \mathrm { { \tt ~ { \tt \tt ~ { \tt ~ { \tt \tt ~ { \tt ~ { \tt } ~ } } } } } } \mathrm { { \tt ~ { \tt \tt ~ { \tt \tt ~ { \tt ~ { \tt } ~ } } } } } \mathrm { { \tt \tt ~ { \tt \tt { \tt \tt ~ { \tt \tt ~ { \tt } ~ } } } } } \mathrm { } \mathrm { { \tt \tt ~ { \tt \tt { \tt \tt ~ { \tt \tt ~ { \tt \tt } ~ } } } } } \mathrm { } \mathrm { { \tt \tt \tt { \tt \tt ~ { \tt \tt ~ { \tt \tt } } } } } \mathrm { } \mathrm { \tt } \mathrm { \tt { \tt \tt \tt { \tt \tt \tt { \tt \tt ~ { \tt \tt } } } } } \mathrm { } \mathrm { } \mathrm { \tt } \tt { \tt \tt } \tt { \tt \tt } \tt { \tt \tt } \tt { \tt \tt } \tt \tt { \tt \tt { \tt \tt \tt { \tt \tt \tt { \tt \tt \tt { \tt \tt \tt } } } } } \mathrm { } \tt \tt \tt { \tt } \tt \tt \tt { \tt \tt } \tt \tt { \tt \tt { \tt \tt \tt \tt { \tt \tt \tt } } \tt } \tt \tt \tt \tt \tt { \tt \tt \tt { \tt \tt \tt } \tt \tt \tt { \tt \tt \tt \tt \tt } \tt \tt \tt { \tt \tt \tt \tt \tt } \tt \tt \tt { \tt \tt \tt \tt \tt \tt { \tt \tt \tt \tt$ ，即得 $R ^ { 2 } { \subseteq } R$ 0 □

定理4.17 假设集合A 上的关系R具有传递性，则对于所有 $n   \geq   1$ $R ^ { n } { \subseteq } R$ 成立。

证明.对n进行归纳:

（1）n=1时， $R^{1}=R \subseteq R,\ n=2$ 时，由定理4.16(f)有 $R ^ { 2 } { \subseteq } R$

(2) 假设 $R ^ { n } { \subseteq } R$ 成立，则 $R^{n + 1} = R^n \circ R \subseteq R \circ R \subseteq R$

而关系性质在关系矩阵和关系图上的反映可见表4.6。

表4.6 关系性质在关系矩阵和关系图上的反映<table><tr><td>关系</td><td>关系矩阵的特点</td><td>关系图的特点</td></tr><tr><td>自反关系</td><td>主对角线元素全是1，即对于所有i，<eq>M _ { R } ( i ,   i ) { = } 1</eq></td><td>每个顶点都有自环</td></tr><tr><td>非自反关系</td><td>主对角线元素全是0，即对于所有i，<eq>M _ { R } ( i ,   i ) { = } 0</eq></td><td>每个顶点都无自环</td></tr><tr><td>对称关系</td><td>矩阵是对称矩阵<eq>\pmb { M } _ { R } = \pmb { M } _ { R } ^ { \mathrm { T } }</eq>，即对于所有<eq>i  、 j , M _ { R } ( i , j ) = M _ { R } ( j , i )</eq></td><td>如果两个顶点之间有边，一定是一对方向相反的边</td></tr><tr><td>非对称关系</td><td>对于所有<eq>i , j ,</eq>若<eq>M _ { R } ( i , j ) { = } 1</eq>，则<eq>M _ { R } ( j ,</eq><eq>i ) { = } 0</eq></td><td>两顶点之间至多存在一条有向边，每个顶点都无自环</td></tr><tr><td>反对称关系</td><td>对于所有<eq>i , j ,</eq> 若<eq>i \not \sim j</eq>且<eq>M _ { R } ( i , j ) { = } 1</eq>则<eq>M _ { R } ( j , i ) { = } 0</eq></td><td>两互异顶点之间至多存在一条有向边，允许存在自环</td></tr></table>

[page:120]

## 离散数学及应用（第2版）

续表<table><tr><td>关系</td><td>关系矩阵的特点</td><td>关系图的特点</td></tr><tr><td>传递关系</td><td>对于所有i、j，若<eq>( M _ { R } \odot M _ { R } ) ( i , j ) = 1</eq>则<eq>M _ { R } ( i , j ) { = } 1</eq></td><td>如果存在有向边(i,j)和(j,k)，则存在有向边(i, k)</td></tr></table>

保留对称关系的有向图中的顶点，且将所有有向边改作无向边，其结果称作该关系的图（graph）。

【例4.38】 由图 4.7(a)所示的对称关系相应的图为图4.7(b)。

【例4.39】 判断图4.8所示各关系的性质。

解. $R _ { 1 }$ 不具有自反性，不具有非自反性，具有对称性，不具有非对称性，不具有反对称性，不具有传递性。

$R _ { 2 }$ 不具有自反性，不具有非自反性，不具有对称性，不具有非对称性，不具有反对称性，不具有传递性。

$R _ { 3 }$ 不具有自反性，具有非自反性，不具有对称性，具有非对称性，具有反对称性，具有传递性。

$R _ { 4 }$ 具有自反性，不具有非自反性，不具有对称性，不具有非对称性，具有反对称性，不具有传递性。

## 4.3.2 关系运算对性质的保持

在例4.22中，关系R和S都不具有对称性，但R∩S却具有对称性。本节要解决的问题就是:4.2节介绍的运算中，哪些可以保持关系的哪些性质，哪些性质有可能因哪种运算而失去，为此给出如下一系列定理。

定理4.18 设R和S为集合A上的关系，则

(a）若R是自反的，那么 $R ^ { - 1 }$ 也是自反的。

（b）若R和S都是自反的，那么 R∩S、R∪S及 SR都是自反的。

[page:121]

## 第4章 二元关系

(c）R是自反的当且仅当 $\overline { { R } }$ 是非自反的。

证明.

（a）若 R是自反的，由定理4.16(a)有 $I _ { A } \subseteq R$ ；于是由定理 4.4(d)， $I_{A} = I_{A}^{-1} \subseteq R^{-1}$因而 $R ^ { - 1 }$ 也是自反的。

（b）若R和S都是自反的，则由定理4.16(a)有 $I _ { A } { \subseteq } R$ 且 $I _ { A } { \subseteq } S ,$ 于是 $I _ { A } { \subseteq } R \cap S$ 且 $I _ { A } { \subseteq } R$ ∪S，即R∩S和R∪S都是自反的。由定理4.5， $I_{A}=I_{A} \circ I_{A} \subseteq S \circ R$ 知 $S ^ { \circ } R$ 也是自反的。

(c) R 是自反的当且仅当 $I _ { A } { \subseteq } R$ ，而这当且仅当 $\overline { { R } } \cap I _ { A } = \varnothing$ ，即 $\overline { { R } }$ 是非自反的。 口

定理 4.19 设 R 和 S 为集合 $A$ 上的关系，则

（a）若R是对称的，那么 $R ^ { - 1 }$ 和 $\overline { { R } }$ 也是对称的。

（b）若R是对称的，那么 $R ^ { n }$ 也是对称的。

（c）若R和S都是对称的，那么R∩S和R∪S也是对称的。

证明.

(a)若 R 是对称的，则由定理 4.16(c)有 $R { = } R ^ { - 1 }$ ，于是 $R ^ { - 1 } { = } R { = } ( R ^ { - 1 } ) ^ { - 1 }$ ，以及由定理4.4(c)有 $\left( \overline{R} \right)^{-1} = \overline{R^{-1}} = \overline{R}$ ，故 $R ^ { - 1 }$ 和 $\overline { { R } }$ 也是对称的。

（b）由定理4.11 易得 $( R ^ { n } ) ^ { - 1 } { = } ( R ^ { - 1 } ) ^ { n }$ ，于是 $(R^{n})^{-1}=(R^{-1})^{n}=R^{n}$ 也是对称的。

（c）若R和S都是对称的，则 $R { = } R ^ { - 1 }$ 且 ${ \boldsymbol { S } } { = } { \boldsymbol { S } } ^ { - 1 }$ ，于是由定理 4.4(f)有(R∩S)−¹=R-¹∩S-¹= R∩S及 $(R \cup S)^{-1} = R^{-1} \cup S^{-1} = R \cup S$ 。可知 $R \cap S$ 和 $R \cup S$ 也是对称的。 □

定理4.20 设R和S为集合A上的关系，则

(a) $( R \cap S ) ^ { n } \subseteq R ^ { n } \cap S ^ { n } , \quad ( R \cup S ) ^ { n } \supseteq R ^ { n } \cup S ^ { n } .$

（b）若R是传递的，那么 $R ^ { - 1 }$ 也是传递的。

（c）若R和S都是传递的，那么R∩S也是传递的。

证明.

（a）留作习题。

(b）若R是传递的则 $R ^ { 2 } { \subseteq } R$ ，且由定理 4.11 和定理 4.4(d)有 $( R ^ { - 1 } ) ^ { 2 } { = } ( R ^ { 2 } ) ^ { - 1 } { \subseteq } R ^ { - 1 }$ ，于是$R ^ { - 1 }$ 也是传递的。

（c）若R和S都是传递的，则 $R ^ { 2 } { \subseteq } R$ 且 $S ^ { 2 } { \subseteq } S .$ 。由(a), $( R \cap S ) ^ { 2 } { \subseteq } R ^ { 2 } \cap S ^ { 2 } { \subseteq } R \cap S ,$ 故R∩S也是传递的。 □

将上述定理总结如表4.7所示。

表4.7 关系运算对性质的保持<table><tr><td rowspan=2>R 和 S满足的性质</td><td colspan=5>满足以下关系</td></tr><tr><td><eq>\overline { { R } }</eq></td><td><eq>R ^ { - 1 }</eq></td><td><eq>R \cap S</eq></td><td><eq>R \cup S</eq></td><td><eq>{ \mathcal { S } } { \circ } R</eq></td></tr><tr><td>自反性</td><td>非自反性</td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td></tr><tr><td>非自反性</td><td>自反性</td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td>×</td></tr><tr><td>对称性</td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td>×</td></tr><tr><td>反对称性</td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td><eq>\times</eq></td><td>×</td></tr><tr><td>传递性</td><td><eq>\times</eq></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td><eq>\times</eq></td><td>x</td></tr></table>注:表中的 $\text{" } \times  \text{" }$ 并不表示“一定不具有”而是表示“不一定具有”。

[page:122]

## 122

## 4.4 关系的闭包

关系的运算能够生成新的关系，但从表4.7中可以看到运算也可能会失去一些性质；另一方面，有的关系“先天性”地就缺少一些特定的性质。因而希望通过给关系添加一些有序对使其满足特定性质，而又希望添加的有序对尽可能少，以使得新的关系与原有关系相差不大。于是引入了关系的闭包运算。

定义4.17 假设R是集合A上的关系，若存在另一个A上的关系R'，使得

（1）R'满足某确定的性质。

(2) $R \subseteq R ^ { \prime }$

（3）对于任何A上满足该确定性质的S，如果有 $R \subseteq S$ ，则有 $R ^ { \prime } \subseteq S$ O则称R'为R的（关于该性质）的闭包（closure）。

注:条件（1）确定了新关系的性质，条件（2）确定新关系是在原关系的基础上通过添加有序对产生的，条件（3）确定新关系是包含原关系且具备该性质的“最小”集合。

一般将关系 R 的自反闭包记作 r(R)，对称闭包记作 s(R)，传递闭包记作 t(R)。

定理4.21 假设R是集合A上的关系，则

(a）R 是自反的当且仅当 r(R)=R。

(b）R 是对称的当且仅当 s(R)=R。

(c）R 是传递的当且仅当 t(R)=R。

证明.（a）若R是自反的，则

（1）R是自反的。

(2) $$R { \subseteq } R  。  $$ C

（3）对于任何包含R的自反关系S都有 $R \subseteq S$

因而由定义可知 r(R)=R。

反之，若R=r(R)，则R是某个关系的自反闭包，其必然是自反的。

（b）和（c）的证明方法类似。

下面给出关系闭包的构造方法。

定理4.22 假设R是集合A上的关系，则 $r(R)=R \cup I_{A}$ ，其中 $I _ { A }$ 是A上的恒等关系。

证明. 设 $R ^ { \prime }   =   R \bigcup I _ { A }$ ，则

（1）由于 $I _ { \mathcal { A } } \subseteq R ^ { \prime }$ ，因而R'是自反的。

(2) 显然有 $R \subseteq R ^ { \prime }$ C

（3） 对于 A 上任一满足 $R \subseteq S$ 的自反关系 S，由定理4.16(a)知 $I _ { \mathcal { A } } \subseteq { \mathcal { S } }$ ，于是$R' = R \cup I_{A} \subseteq S \cup S = S$ 0

于是由定义知 $R ^ { \prime }   =   R \bigcup I _ { A }$ 是R的自反闭包。

定理4.23 假设R是集合A上的关系，则 $s ( R ) { = } R \cup R ^ { - 1 }$

证明. 设 $R ^ { \prime } = R \cup R ^ { - 1 }$ ，则

（1）由于 $\left( R ^ { \prime } \right) ^ { - 1 } = \left( R \cup R ^ { - 1 } \right) ^ { - 1 } = R ^ { - 1 } \cup \left( R ^ { - 1 } \right) ^ { - 1 } = R ^ { - 1 } \cup R = R ^ { \prime }$ ，因而R'是对称的。

[page:123]

## 第4章 二元关系

(2) 显然有 $R \subseteq R ^ { \prime }$ C

（3）对于A 上任一满足 $R \subseteq S$ 的对称关系 S，由定理 $4 . 1 6 ( \mathrm { c } )$ 知 $S = S ^ { - 1 }$ ，而且由于$R \subseteq S$ 有 $\boldsymbol { R } ^ { - 1 } \subseteq \boldsymbol { S } ^ { - 1 }$ (定理 $4 . 4 ( \mathrm { d } ) )$ ，故而 $R^{\prime}=R\cup R^{-1}\subseteq S\cup S^{-1}=S$

于是由定义知 $R ^ { \prime } = R \cup R ^ { - 1 }$ 是R的对称闭包。

定理4.24 设 R 为集合A 上的任意二元关系，则

$$t(R) = R^{\infty} = \bigcup_{i = 1}^{\infty} R^{i}$$

证明.

(1) $R { \subseteq } { \boldsymbol { R } } ^ { \infty }$ 显然成立。

(2) 若 $a { \boldsymbol { R } } ^ { \infty } { \boldsymbol { b } }$ 且 $b \boldsymbol { R } ^ { \infty } \boldsymbol { c }$ ，则由定义，存在 R中从 a到 b的道路 $\pi _ { 1 }$ 和从 b 到 c 的道路 $\pi _ { 2 }$ ，于是 $\pi _ { 1 }$ 和 $\pi _ { 2 }$ 的复合即为从a到c的道路，因此有 $\boldsymbol { a R } ^ { \infty } \boldsymbol { c }$ ， $R ^ { \infty }$ 具有传递性。

（3）对于A上任一满足 $R \subseteq S$ 的传递关系S，由其满足传递性及定理4.17知，对于所有 $n \geqslant 1,\ S^{n} \subseteq S,$ 于是 $R^{\infty}=R\cup R^{2}\cup R^{3}\cup\cdots\cup S\cup S^{2}\cup S^{3}\cup\cdots\subseteq S$ 口

【例 4.40】 假设集合 A={1, 2, 3, 4}，R={(1, 1), (1, 2), (1, 4), (2, 1), (3, 2), (3, 4)}是定义在A上的关系，则

$$r ( R ) { = } \{ ( 1 , 1 ) , ( 1 , 2 ) , ( 1 , 4 ) , ( 2 , 1 ) , ( 2 , 2 ) , ( 3 , 2 ) , ( 3 , 3 ) , ( 3 , 4 ) , ( 4 , 4 ) \}$$

s(R)={(1, 1), (1, 2), (2, 1), (1, 4), (4, 1), (2, 1), (1, 2), (3, 2), (2, 3), (3, 4), (4, 3)}

$$t ( R ) { = } \{ ( 1 , 1 ) , ( 1 , 2 ) , ( 1 , 4 ) , ( 2 , 1 ) , ( 2 , 2 ) , ( 2 , 4 ) , ( 3 , 1 ) , ( 3 , 2 ) , ( 3 , 4 ) \}$$

关系的闭包运算在关系图的表现上为（假设R是有限集合A上关系且 $| A | = n$

（a）每个顶点如果没有自环则增加自环，得到的有向图即是该关系自反闭包的有向图。

(b）在该关系的有向图中，如果有顶点i到顶点j的有向边且 $i \not \sim j$ ，则添加（如果该图中不存在）有向边(j，i)，得到的有向图即是该关系对称闭包的有向图。或者保留该关系的有向图中的顶点，且将所有有向边改作无向边，得到的图即是该关系对称闭包的关系图，即是对称关系的图。

(c）不断更新有向图。如果存在顶点i到j的道路，则将边(i,j)添加到有向图中（如果该图中不存在这条边)，直至没有新的有向边可添加为止。最终的结果即是该关系传递闭包的关系图。

关系的闭包运算在关系矩阵上的方法为:当R 是有限集合A 上关系且 $\left| \boldsymbol{A} \right| = n$ 时，

$$\begin{aligned}\boldsymbol{M}_{r(R)} &= \boldsymbol{M}_{R} \lor \boldsymbol{M}_{L_{A}} \\\boldsymbol{M}_{s(R)} &= \boldsymbol{M}_{R} \lor \boldsymbol{M}_{R^{-1}} = \boldsymbol{M}_{R} \lor \boldsymbol{M}_{R}^{\mathrm{T}} \\\boldsymbol{M}_{r(R)} &= \boldsymbol{M}_{R} \lor \boldsymbol{M}_{R^{2}} \lor \boldsymbol{M}_{R^{3}} \lor \cdots \lor \boldsymbol{M}_{R^{n}} = \boldsymbol{M}_{R} \lor (\boldsymbol{M}_{R} \cap \boldsymbol{M}_{R}) \lor \cdots \lor (\boldsymbol{M}_{R})_{\bigcirc}^{n}\end{aligned}$$

【例 4.41】 假设集合 A={1, 2, 3, 4}，R={(1, 2), (2, 4), (3, 1), (3, 3), (4, 2), (4, 3)}是定义在A上的关系，则

$$\begin{array} { r } { \pmb { M } _ { \pmb { R } } = \left( \begin{array} { l l l l } { 0 } & { 1 } & { 0 } & { 0 } \\ { 0 } & { 0 } & { 0 } & { 1 } \\ { 1 } & { 0 } & { 1 } & { 0 } \\ { 0 } & { 1 } & { 1 } & { 0 } \end{array} \right) , \quad \pmb { M } _ { r ( \pmb { R } ) } = \left( \begin{array} { l l l l } { 1 } & { 1 } & { 0 } & { 0 } \\ { 0 } & { 1 } & { 0 } & { 1 } \\ { 1 } & { 0 } & { 1 } & { 0 } \\ { 0 } & { 1 } & { 1 } & { 1 } \end{array} \right) , \quad \pmb { M } _ { \varepsilon ( \pmb { R } ) } = \left( \begin{array} { l l l l } { 0 } & { 1 } & { 1 } & { 0 } \\ { 1 } & { 0 } & { 0 } & { 1 } \\ { 1 } & { 0 } & { 1 } & { 1 } \\ { 0 } & { 1 } & { 1 } & { 0 } \end{array} \right) } \end{array}$$

[page:124]

## 124

由

$$\begin{aligned}\boldsymbol{M}_{_{R^{2}}} = & \begin{pmatrix}0 & 0 & 0 & 1 \\0 & 1 & 1 & 0 \\1 & 1 & 1 & 0 \\1 & 0 & 1 & 1 \\1 & 0 & 1 & 1 \\\end{pmatrix}, \ \boldsymbol{M}_{_{R^{3}}} = \begin{pmatrix}0 & 1 & 1 & 0 \\1 & 0 & 1 & 1 \\1 & 1 & 1 & 1 \\1 & 1 & 1 & 0 \\\end{pmatrix}, \ \boldsymbol{M}_{_{R^{4}}} = \begin{pmatrix}1 & 0 & 1 & 1 \\1 & 1 & 1 & 0 \\1 & 1 & 1 & 1 \\1 & 1 & 1 & 1 \\\end{pmatrix}\end{aligned}$$

得

$$M_{t(R)} = M_{R} \lor M_{R^2} \lor M_{R^3} \lor M_{R^4} = \begin{pmatrix}1 & 1 & 1 & 1 \\1 & 1 & 1 & 1 \\1 & 1 & 1 & 1 \\1 & 1 & 1 & 1\end{pmatrix}$$

当|A|=n时，可以采用如下算法计算关系传递闭包的矩阵表示:

传递闭包构造算法 TransitiveClosure $( M _ { R } )$

输入: $M _ { R }$ (R 的关系矩阵)

输出:C（t(R)的关系矩阵）

1 C←MR, S←MR
2 For i=1 to n-1
2.1 S←SOMR
2.2 c←c∨s

一共进行n-1次循环；每次循环中有一次布尔积运算、一次并运算，共用 $n ^ { 3 } { \scriptstyle + } n ^ { 2 }$ 次元素的布尔操作。因此总的元素布尔操作次数为: $( n { - } 1 ) ( n ^ { 3 } { + } n ^ { 2 } )$ ，当n充分大时，其约等于 $n ^ { 4 }$

1960年，沃舍尔（StephenWarshall，1935—2006）给出了求传递闭包的一个有效算法。该算法的思路是:考虑n+1个矩阵的序列 $\boldsymbol { W } ^ { 0 } , \boldsymbol { W } ^ { 1 } , \cdots , \boldsymbol { W } ^ { n } , \boldsymbol { W } ^ { k } ( i , j ) = 1$ 当且仅当在存在R中一条从 $x _ { i }$ 到 $x _ { j }$ 的道路，并且这条道路除起点和终点外中间只经过 $\{ x _ { 1 } , x _ { 2 } , \cdots , x _ { k } \}$ 中的顶点。则 $W ^ { 0 }$ 就是R的关系矩阵，而 $W ^ { n }$ 对应 R的传递闭包。

该算法的理论基础是:一条除起点和终点外中间只经过 $\{ x _ { 1 } , x _ { 2 } , \cdots , x _ { k } \}$ 中的顶点的从

$x _ { i }$ 到 $x _ { j }$ 的道路分为两种可能（由定理4.15的证明过程，可假定该道路经过各个顶点至多一次):

（1）不经过 $x _ { k }$ (图 4.9 中用虚线表示)。

(2）经过 $x _ { k }$ (图4.9 中用实线表示)。

如果是第一种情况，则有 $\pmb { \mathscr { W } } ^ { k - 1 } ( i , j ) { = } 1$

图4.9 沃舍尔算法的理论基础

如果是第二种情况，则可以把道路分为两段，于是有

$$\pmb { W } ^ { k - 1 } ( i ,   k )   =   \pmb { W } ^ { k - 1 } ( k , j )   =   1$$

因此 $\pmb { \mathscr { W } } ^ { k } ( i ,   j ) { = } 1$ 当且仅当 $\pmb { \mathscr { W } } ^ { k - 1 } ( i ,   j ) { = } 1$ 或 $\pmb{W}^{k - 1}(i,\ k) = \pmb{W}^{k - 1}(k,\ j) = 1$ 。于是可以从 $W ^ { 0 } { = } M _ { R }$开始，依次计算 $\boldsymbol{W}^{1}, \boldsymbol{W}^{2} \cdots \cdots$ 直到 $\boldsymbol { W } ^ { n } = \boldsymbol { M } _ { t ( R ) }$

【例 4.42】 假设集合 A={1, 2, 3, 4}，R={(1, 2), (2, 4), (3, 1), (3, 3), (4, 2), (4, 3)}是定义在A上的关系，则

[page:125]

## 第4章 二元关系

$$\boldsymbol { W } ^ { 0 } = \boldsymbol { M } _ { \boldsymbol { R } } = \begin{pmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 1 & 0 & 1 & 0 \\ 0 & 1 & 1 & 0 \end{pmatrix}, \quad \boldsymbol { W } ^ { 1 } = \begin{pmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 1 & 1 & 1 & 0 \\ 0 & 1 & 1 & 0 \end{pmatrix}, \quad \boldsymbol { W } ^ { 2 } = \begin{pmatrix} 0 & 1 & 0 & 1 \\ 0 & 0 & 0 & 1 \\ 1 & 1 & 1 & 1 \\ 0 & 1 & 1 & 1 \end{pmatrix},$$

$$\boldsymbol { W } ^ { 3 } = \begin{pmatrix} 0 & 1 & 0 & 1 \\ 0 & 0 & 0 & 1 \\ 1 & 1 & 1 & 1 \\ 1 & 1 & 1 & 1 \end{pmatrix},$$

$$\boldsymbol{M}_{t(R)}=\boldsymbol{W}^{4}=\begin{pmatrix}1 & 1 & 1 & 1 \\1 & 1 & 1 & 1 \\1 & 1 & 1 & 1 \\1 & 1 & 1 & 1\end{pmatrix}$$

沃舍尔算法的伪代码描述如下:

沃舍尔算法 Warshall $( M _ { R }$ )输入: $M _ { R }$ (R的关系矩阵)

输出:C（t(R)的关系矩阵）

1 C←MR
2 For k = 1 to n
2.1 For i = 1 to n
2.1.1 For j = 1 to n
2.1.1.1 C[i, j]←C[i, j]∨(C[i, k]∧c[k, j])

共需要 $2 n ^ { 3 }$ 次元素的布尔操作。

沃舍尔算法在有向图上的操作如下:

For k = 1 to n

如果存在边(i， k) 和(k， j) 则将边(i， j)添加到有向图中

【例 4.43】 集合 A={1, 2, 3, 4}上关系 R={(1,2), (2,4), (3,1), (3,3), (4,2), (4,3)}的传递闭包可按图4.10所示方法求得。

图 4.10 例 4.43 用图

下面给出沃舍尔算法的“纸上工作法”（假设R是有限集合A上的关系且|A|=n):

对于k从1到n，执行下述过程:在第k次时，第k行不为0元素所在列画直线，第k列不为0元素所在行画直线，直线相交位置如果为0，则改为1。

【例 4.44】 假设集合 A={1, 2, 3, 4}，R={(1,2), (2,4), (3,1), (3,3), (4,2), (4,3)}是定义在A上的关系，则“纸上工作法”的过程如图4.11所示。

“纸上工作法”的理论依据是:在第k次时，第k行第j列不为0则表示 $C [ k , j ] { = } 1$第k列第i行不为0则表示 $C[i,k]{=}1$ ，第i行直线及第j列直线相交位置为 $C [ i , j ]$

[page:126]

## 离散数学及应用（第2版）

关系的闭包具有如下性质。

定理4.25 假设R、S是集合A上的关系且 R⊆S，则

(a) $r ( R ) { \subseteq } r ( S )$ O

(b) $s ( R ) { \subseteq } s ( S )$

(c) $t ( R ) { \subseteq } t ( S )$

证明.

(a）由于r(S)满足自反性，而且 $R { \subseteq } S { \subseteq } r ( S )$ ，因此由自反闭包的定义有 $r ( R ) { \subseteq } r ( S )$

（b）和（c）类似可证。

定理4.26 假设R是集合A上的关系，则

(a）如果R是自反的，那么 s(R)和 t(R)都是自反的。

(b）如果R是对称的，那么 r(R)和 t(R)都是对称的。

（c）如果R是传递的，那么 r(R)是传递的。

证明.（a）由于R是自反的，由定理4.16(a)， $I _ { A } { \subseteq } R ,$ ，于是 $I _ { A } \subseteq R \cup R ^ { - 1 } = s ( R ) , I _ { A } \subseteq R \cup R ^ { 2 }$ $\cup \cdots { = } t ( R )$ ，即 s(R)和 t(R)都是自反的。

（b）由于R是对称的，由定理4.16(c)， $\scriptstyle { \boldsymbol { R } } = { \boldsymbol { R } } ^ { - 1 }$ 。于是 $(r(R))^{-1}=(R\cup I_{A})^{-1}=R^{-1}\cup I_{A}^{-1}=R\cup$ $I _ { A } = r ( R )$ ，故 r(R)是对称的。

$( t ( \boldsymbol { R } ) ) ^ { - 1 } { = } ( \boldsymbol { R } \cup \boldsymbol { R } ^ { 2 } \cup \cdots ) ^ { - 1 } { = } \boldsymbol { R } ^ { - 1 } \cup ( \boldsymbol { R } ^ { 2 } ) ^ { - 1 } { \cdots } { = } \boldsymbol { R } ^ { - 1 } \cup ( \boldsymbol { R } ^ { - 1 } ) ^ { 2 } \cup \cdots { = } \boldsymbol { R } \cup \boldsymbol { R } ^ { 2 } \cup \cdots { = } t ( \boldsymbol { R } )$ ，故 t(R)是对称的。

(c)若 $r(R)=R \cup I_{A}$ 不具有传递性，则存在 $(a,   b) \in R \cup I_{A}, (b,   c) \in R \cup I_{A}$ 使得 $( a ,   c ) { \not \in } R \cup I _ { A }$首先，很明显，若a=b或b=c则上式不成立。

若a≠b 且 b≠c 则 $( a , b ) { \in } R , ( b , c ) { \in } R$ ，由R的传递性得 $( a , c ) { \in } R$ ，与 $( a , c ) { \not \in } R \cup I _ { A }$ 矛盾。因此假设不成立， $r(R)=R \cup I_{A}$ 具有传递性。 □

定理4.27 设R是集合A上任一二元关系，则

(a) $r(s(R)) = s(r(R))$ o

(b) $r(t(R)) = t(r(R))$

[page:127]

## 第4章 二元关系

(c) $t ( s ( R ) ) \lnot s ( t ( R ) )$ o

证明.只证明(c)，其余类似。

由闭包的定义 $\overline { { R } } { \subseteq } s ( R )$ ，因此由定理4.25可得 $t ( R ) { \subseteq } t ( s ( R ) )$ o

而且由于s(R)具有对称性，由定理4.26， $t ( s ( R ) )$ 也具有对称性。

因为 s(t(R))是 t(R)的对称闭包，由定义即有 $s ( t ( R ) ) { \subseteq } t ( s ( R ) )$ o

## 4.5 等价关系和集合的划分

例4.31、例4.36、例4.37(c)~(e)中的恒等关系、模n同余关系、三角形的相似关系、学生的同班关系、矩阵的相似关系等都满足自反性、对称性、传递性，事实上它们同属一类重要的关系—等价关系。

等价关系可以将集合中具有某种共同性质的元素归并成类，从而将对元素的研究转化为更简单的对类的研究。

## 4.5.1 等价关系、等价类和商集

定义4.18 假设R是非空集合A上的关系，如果R是自反的、对称的和传递的，则称 R 是A 上的等价关系（equivalence relation）。

【例4.45】集合 $A { = } \{ a , b , c \}$ 上的关系 $R { = } \{ ( a , a ) , ( b , b ) , ( c , c ) , ( b , c ) , ( c , b ) \}$ 和 $S = \{ (a, a)$ $( b , b ) , ( c , c ) , ( a , b ) , ( b , a ) \}$ 都是等价关系， $R \cap S = \{ ( a , a ) , ( b , b ) , ( c , c ) \}$ 也是等价关系，而R∪ $S { = } \{ ( a , a ) , ( b , b ) , ( c , c ) , ( a , b ) , ( b , a ) , ( b , c ) , ( c , b ) \}$ 则不是等价关系。

定理4.28 假设R、S为集合A上的两个等价关系，则 $R \cap S$ 也是等价关系。

证明. 由表4.7即得。

但是，一般来说，R∪S由于不一定具有传递性，因此不一定也是等价关系。以下定理给出了将 $R \cup S$ “扩充”为等价关系的方法。

定理 4.29 假设 R、S为集合A 上的等价关系，则包含 R∪S的最小等价关系为$( R \cup S ) ^ { \infty }$ 0

证明.

（1）显然有 $R \cup S { \subseteq } ( R \cup S ) ^ { \infty }$

(2) $( R \cup S ) ^ { \infty }$ 实际上是一个等价关系:由表4.7，R∪S具有自反性和对称性，由定理4.26, $( R \cup S ) ^ { \infty } { = } t ( R \cup S )$ 也具有自反性和对称性，而且 $( R \cup S ) ^ { \infty } { = } t ( R \cup S )$ 明显具有传递性。

(3)任何包含 $R \cup S$ 的等价关系T必定具有传递性，由于 ${ \mathfrak { r } } ( R \cup S ) ^ { \infty }$ 是 $R \cup S$ 的传递闭包，因此 $( R \cup S ) ^ { \infty } { \subseteq } T .$ 0 □

## 【例4.46】

(a）设A为N+的一个非空子集，n是一个正整数，则A上的模n同余关系是一个等价关系。

（b）平面上三角形的相似关系是一个等价关系。

（c）学生的同班关系是一个等价关系。

（d）矩阵的相似关系也是等价关系。

[page:128]

## 离散数学及应用（第2版）

【例 4.47】 设A={1,2，…，8}，则

（a）A上的模3同余关系R是一个A上的等价关系，R的关系图如图4.12(a)所示。

（b）A上的模2同余关系S是一个A上的等价关系，S的关系图如图4.12(b)所示。

（c）R∩S的关系图如图4.12(c)所示。

可以看到关系图4.12(a)被分为3个互不连通的部分{1,4,7}、{2,5,8}和{3,6}，每部分中的数两两都具有关系，而不同部分中的数之间则不具有关系。事实上，每一部分中的所有数构成一个等价类。

定义 4.19 假设 R 是非空集合A 上的等价关系，元素 a∈A，集合 R(a)称为 a所在的等价类（equivalence class），也记作 $[ a ] _ { R }$ 或[a]；集合 $\{ R ( a ) | a { \in } A \}$ 称作 A 关于 R 的商集(quotient sets)，记作 A/R；a 称作 R(a)的一个代表元。

【例4.48】 设集合A={1,2,3}，A×A上的关系 R定义为:(x， y)R(u,ν)当且仅当 x+y=u+ν。则 R是一个等价关系，(A×A)/R={{(1,1)}, {(1,2), (2,1)}, {(1,3), (2,2), (3,1)}, {(2,3), (3,2)}, {(3,3)}}，如图4.13所示。

【例4.49】

（a）在集合A={1,2, …, 8}上的模3同余关系 R 中:

R(1)=R(4)=R(7)={1, 4, 7}， R(2)=R(5)=R(8)={2, 5, 8}， R(3)=R(6)={3, 6}因此 R 的商集为 A/R={{1, 4, 7}, {2, 5, 8}, {3, 6}}。

(b)集合A={1,2, ,8}上的模2同余关系S的商集为 A/S={{1, 3,5,7},{2,4,6,8}。

(c) 等价关系 R∩S 的商集为 A/(R∩S)={{1, 7}, {2, 8}, {3}, {4}, {5}, {6}}。

## 4.5.2 集合的划分

【例4.50】 表4.8中，各同学之间的同班关系构成等价关系，其等价类是{{祖冲之秦九韶}，{马钧，公输班，墨翟}，{苏东坡，施耐庵，李白}}，而这恰恰是将所有同学分为3个班的结果，事实上它称作集合的划分。

定义4.20 设X为非空集合，若集合 $\varPi \subset \mathcal { P } ( X )$ 满足以下条件:

（1）对任意A∈I，A非空。

（2）对任意A, B∈I，若 $A { \neq } B$ ，则 $A \cap B = \varnothing$

[page:129]

## 第4章 二元关系

表 4.8 例 4.50 用表<table><tr><td>姓      名</td><td>学       号</td><td><eq>方</eq>      业</td><td>班      级</td></tr><tr><td>祖冲之</td><td>12101001</td><td>数学</td><td>1班</td></tr><tr><td>苏东坡</td><td>12103102</td><td>中国文学</td><td>3班</td></tr><tr><td>施耐庵</td><td>12103033</td><td>中国文学</td><td>3班</td></tr><tr><td>马钧</td><td>12102022</td><td>自动化技术</td><td>2班</td></tr><tr><td>公输班</td><td>12102024</td><td>机械制造</td><td>2班</td></tr><tr><td>李白</td><td>12103188</td><td>中国文学</td><td>3班</td></tr><tr><td>秦九韶</td><td>12101002</td><td>数学</td><td>1班</td></tr><tr><td>墨翟</td><td>12102026</td><td>机械制造</td><td>2班</td></tr></table>

(3) $\bigcup _ { A \in \varPi } A   =   X$ 0

则称I为集合X的一个划分（partition）或分划。A∈I称为X的划分块（block）。

【例4.51】 假设集合为 $S { = } \{ a , b , c , d , e , f , g \}$ ，则

$$\begin{array} { l } { { \pi _ { 1 } { = } \{   \{ a , b , c , e , f \} ,   \{ d , g \}   \} } } \\ { { \pi _ { 2 } { = } \{   \{ a , b , g \} ,   \{ d , e , f \} ,   \{ c \}   \} . } } \end{array}$$

都是S的划分，而

$$\begin{aligned}\pi_{3} = & \{   \{ a, b, c, d, e \},   \{ g \}   \} \\\pi_{4} = & \{   \{ a, b, c, d, e \},   \{ e, f, g \}   \} \\\pi_{5} = & \{   \{ a, b, c, e, g \},   \{ d, f \},   \emptyset   \}\end{aligned}$$

都不是S的划分。

【例 4.52】 设 n 为正整数，Ai={x|x=i (mod) n}， $0 \leqslant i \leqslant n - 1$ ，则 $\pi = \{ A_{0}, A_{1}, \cdots, A_{n-1} \}$就是Z的一个划分。

## 4.5.3 等价关系与划分的——对应

首先讨论如何由划分构造一个等价关系。

定理 4.30 设π是集合 A 的一个划分，定义 A 上的关系 R 为 aRb 当且仅当 a和 b属于同一个划分块，则R是A上的一个等价关系，称作由π决定的等价关系。

证明.

（1）若 $a   \in   A$ ，则明显地a在自己所处的划分块中，于是aRa，因而R具有自反性。

(2)若 $a R b$ ，则a与 b处于相同的划分块，于是bRa，因而R具有对称性。

（3）若 $a R b$ 且 $b R c ,$ ，则a与b处于相同的划分块，b与c处于相同的划分块，于是aRc，因而R具有传递性。

综上可得，R是A上的一个等价关系。

【例4.53】例4.52中的 π决定的等价关系即是Z的模n同余关系，其商集记作$\mathbb{Z} / n \mathbb{Z} = \{ \overline{0}, \overline{1}, \cdots, \overline{n-1} \}$ ，ī表示i所在的等价类。

由此可得出由集合Χ的划分求等价关系的方法:设I是集合X的一个划分，则由Ⅱ

[page:130]

## 离散数学及应用（第2版）

决定的等价关系为 $R = \bigcup _ { A \in \varPi } \left( A \times A \right)$

【例4.54】集合 $A { = } \{ a , b , c \}$ 的划分 $\{ \{ a , b \} , \{ c \} \}$ 决定的等价关系是

$$\{ a , b \} \times \{ a , b \} \cup \{ c \} \times \{ c \} = \{ ( a , a ) , ( a , b ) , ( b , a ) , ( b , b ) , ( c , c ) \}$$

下面讨论如何由等价关系得到一个划分，从而建立等价关系与划分之间的一一对应。

定理4.31 设 R 是A 上的一个等价关系，令 $a , b { \in } A$ ，则 aRb当且仅当 $R ( a ) { = } R ( b )$

证明. 假设 $R ( a ) { = } R ( b )$ 。则由R具有自反性有 $b   \in   R ( b )$ 。于是 $b { \in } R ( a )$ ，即 aRb。

反过来，假设 aRb。由 R的对称性有 bRa，于是 $a   \in   R ( b )$ $b   \in   R ( a )$ 。对于任意 $x { \in } R ( b )$因 R具有传递性，由 $x { \in } R ( b )$ 及 $b   \in   R ( a )$ 可得 $x { \in } R ( a )$ 。因此 $R ( b ) { \subseteq } R ( a )$ 。类似地可证明$R ( a ) { \subseteq } R ( b )$ ，故有 $R ( a ) { = } R ( b )$ □

定理4.32 设R 是A上的一个等价关系，则 $\mathcal{P}=A/R=\left\{R(a)|a\in A\right\}$ 是A的一个划分，而且 R就恰是由 $\mathcal { P }$ 决定的等价关系。

证明.

（a） 对于任意 $a   \in   A$ ，由R的自反性有 $a   \in   R ( a )$ ，即 R(a)非空。

（b）假设 $R ( a ) { \neq } R ( b )$ ，断言: $R(a) \cap R(b) = \varnothing$

否则，若存在 $c { \in } R ( a ) { \cap } R ( b )$ ，则 $c { \in } R ( a )$ 且 $c { \in } R ( b )$ ，即 aRc 且 $b R c .$ 。由定理4.31 有$R(a)=R(c)=R(b)$ ，产生矛盾。

因此 $\mathcal{J}=A/R=\left\{R(a)|a\in A\right\}$ 是A上的一个划分。

而且由定理 4.31，aRb 当且仅当a、b 属于 $\mathcal{F}=A/R=\left\{R(a)|a\in A\right\}$ 的同一个划分块，因此 $\mathcal { P }$ 决定的等价关系就是R。 □

由划分与等价关系的一一对应，可得以下定理。

定理 4.33 设 $R _ { 1 }$ 和 $R _ { 2 }$ 为非空集合A上的等价关系，则 $R _ { 1 } { = } R _ { 2 }$ 当且仅当 $A / R_1 = A / R_2$

## *4.6 相容关系与集合的覆盖

在实际问题中往往有些关系不具有传递性，例如朋友关系、父子关系等就不具有传递性，本节介绍一种应用广泛的新的关系——相容关系。

定义 4.21 设X是非空集合， $S \subseteq \mathcal { F } ( X ) - \emptyset$ ，如果 $\bigcup _ { A \in S } A   =   X$ ，则称S是集合X的一个覆盖（covering）。

【例 4.55】 设 X={1, 2, 3, 4, 5}，则 S1={{1}, {2, 3}, {2, 4, 5}}和 $S _ { 2 } = \{ \{ 1 \}$ , {3, 4}, {2, 4, 5}}都是集合X的覆盖。

定义4.22 设R为集合X上的二元关系，如果R具有自反性和对称性，则称R为X上的相容关系（compatibility relation）。

【例 4.56】 R={(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (1, 3), (3, 1), (2, 3), (3, 2), (2, 4), (4, 2), (3, 4), (4, 3), (2, 5), (5, 2), (3, 5), (5, 3), (4, 5), (5, 4) }是{1, 2, 3, 4, 5} 上的相容关系。

定义4.23 设R是集合X上的相容关系，C是X的非空子集，若 $\forall a , b \in C$ 都有aRb，则称 C 是由 R产生的相容类（compatibility block）。

[page:131]

## 第4章 二元关系

【例 4.57】 例 4.56 中的相容关系 R产生的相容类为{1}，{2, 3,4,5}，{2, 3}，{3,4}，{4,5}，{2,4,5}等。

注:

(a）由于集合X中任一元素a可以组成相容类{a}，因此总可以由X的若干个相容类形成X的覆盖；但由 X={1} ∪ {2, 3,4,5}={1} ∪{2,4, 5} ∪ {3,4}，可知由 R 产生的覆盖并不唯一。

(b）相容类{2,3}，{2,4,5}，{3,4}等还可以加入与类中元素符合相容关系的其他元素，构成新的相容类（{2,3}可以加入元素4或5；{2,4,5}可以加入元素3；{3,4}可以加入元素2或5)，但相容类{1,3}和 $\{ 2 , 3 , 4 , 5 \}$ 则不能再添加元素构成新的相容类。

定义4.24 设R是集合X上的相容关系，C是由R产生的相容类，如果C不能真包含在其他任何相容类中，则称 C 为 R的最大相容类（maximal compatibility block）。

注:易见，若X是有限集合，则X上相容关系产生的最大相容类只能有有限个。

【例 4.58】 例 4.56 中的相容关系 R 产生的所有最大相容类为{1, 3}和{2, 3, 4, 5}。

定理 4.34 设 R 是有限集合 X上的相容关系，C 是 R的一个相容类，则存在 R 的个最大相容类 $C ^ { \prime } ,$ ，使得 $C { \subseteq } C ^ { \prime }$

证明. 若C是最大相容类，则定理成立；否则必定存在a∈X，使得 $C { \subset } C _ { 1 } { = } C \cup \{ a \}$

类似地，可以得到相容类序列 $C { \subset } C _ { 1 } { \subset } C _ { 2 } { \subset } \cdots$ ，由于X中的元素个数有限，因此这个序列长度必定有限，而此序列的最后一个相容类就是包含C的最大相容类。 □

有限集合X中的任一元素a可以组成相容类{a}，从定理4.34可知，{a}必包含在个最大相容类之中，因此所有最大相容类组成的集合必是X的覆盖。

定义4.25 设R是集合X上的相容关系，R的所有最大相容类组成的集合称为A的完全覆盖。

给定有限集合X上相容关系R，由不同的相容类集合可以构成多个不同的X的覆盖，但是X的完全覆盖是唯一的。

由集合X上相容关系R可以得到X的覆盖。下述定理表明，由X的覆盖也可以得到X上的相容关系R。

定理4.35 设S 是集合X的覆盖，则由 C决定的关系 $R = \bigcup_{A \in S} (A \times A)$ 是X的一个相容关系。

【例4.59】 {1,2,3,4, 5}的完全覆盖{{1, 3},{2, 3,4,5}}决定了相容关系R={(1, 1),(2, 2), (3, 3), (4, 4), (5, 5), (1, 3), (3, 1), (2, 3), (3, 2), (2, 4), (4, 2), (3, 4), (4, 3), (2, 5), (5, 2), (3, 5), (5, 3), (4, 5), (5, 4) }

## *4.7 关系在计算机中的表示方法

为了便于程序编写，除关系矩阵外，还经常采用边列表、正向表、邻接表等方法表示一个图。

【例 4.60】 假设 R={(1,1), (1,2), (1,4), (2,1), (3,2), (3,4)}是定义在 A={1,2,3,4}上的关

[page:132]

## 离散数学及应用（第2版）

系，其关系图如图4.14所示。则可采用以下数据结构表示R:

（a）使用二维数组来存储R的关系矩阵。

（b）使用边列表，如图4.15所示。

两个一维数组分别依次存储各有序对的第一元素和第二元素。

（c）使用正向表，如图4.16所示。

使用两个一维数组 List1 和 List2，List1(i)到List1(i+1)-1 之间的值j 表示存在有向边(i, List2(j))。(List1(i)=-1 时需特殊处理，此处不详述。)

（d）使用反向表，如图4.17所示。

使用两个一维数组 List1 和 List2，List1(i)到 List1(i+1)-1 之间的值j 表示存在有向边(List2(j), i)。(List1(i)=-1 时需特殊处理，此处不详述。)

（e）使用邻接表，如图4.18所示。

纵向的列表表示各个顶点，而若在以i开始的横向的链表中存在值为j的节点当且仅当原关系中存在有序对(i,j)。

## 习题4

4.1 假设 $A = \{ a, b, c, d \}, B = \{ 1, 2 \}$ ，求 $A \times A 、 A \times B 、 B \times B$ o

4.2 假设 $(2x+y,x-2y)=(0,5)$ ，求x、y。

4.3 计算 $\mathcal { A } ( \{ \varnothing \} ) \times \{ \varnothing \}$

4.4 假设 A={1, 2, 3, 4}， $B { = } \{ a , b , c \}$ ，求 $A \times A, A \times B, B \times A$ 的元素个数。

[page:133]

## 第4章 二元关系

4.5 假设A、B、C是任意非空集合，证明:

(a) $A \times ( B - C ) = ( A \times B ) - ( A \times C )$

(b) $A \times ( B \oplus C ) = ( A \times B ) \oplus ( A \times C )$ 0

4.6 假设A、B、C、D是任意非空集合，判断下述等式是否成立，如成立请给出证明，如不成立请给出反例。

(a) $(A \cap B) \times (C \cap D) = (A \times C) \cap (B \times D)$

(b) $(A \cup B) \times (C \cup D) = (A \times C) \cup (B \times D)$

(c) $(A \oplus B) \times (C \oplus D) = (A \times C) \oplus (B \times D)$

(d) $(A - B) \times (C - D) = (A \times C) - (B \times D)$ 0

4.7 假设A、B、C、D是任意非空集合，证明: $A { \subseteq } B$ 且 $C { \subseteq } D$ 当且仅当 $A \times C \subseteq B \times D$ 0

4.8 假设 A={1, 2, 3, 4}， $B { = } \{ a , b , c \}$ ，有多少从A到B的关系？有多少A上的关系？

4.9假设 $|A| = n, |B| = m$ ，那么有多少个从A到B的不同二元关系？

4.10 若有限集合A有n个元素，在A上可以定义多少个不同的关系？

4.11 假设 A={1,2,3,4}，列出关系 R 中元素。

(a) $R = \{ (x,y) | x \in A, y \in A, y | x \}$ 0

(b) $R = \{ (x,y) | x \in A, y \in A, (y - x)^2 \in A \}$

(c) $R = \{ (x,y) | x \in A, y \in A, y < x \}$ 0

(d) $R = \{ (x,y) | x \in A, y \in A, x \}$ 与y互素}。

(e) $R = \{ (x,y) | x \in A, y \in A, y / x$ 是素数}。

4.12 Z+ 上关系 R 定义为 $R = \left\{ (x,y) \mid 2x + y = 12 \right\}$ ，求 Dom(R)和 $\operatorname { R a n } ( R )$

4.13 假设 R={(0, 1), (0, 2), (0, 3), (1, 1), (1, 2), (2, 3)}，计算 $R(0) 、 R(\{1,2\}) 、 R|_{\{1,2\}}$

4.14 假设A、B是两个非空集合，R为A到B的关系， $C { \subseteq } A$ ，证明: $R(C)=\mathrm{Ran}(R|_{C})$

4.15 假设A={1,2,3,4}，用关系矩阵和关系图表示下列二元关系:

(a) $R_{1} = \left\{ (1,1),(2,2),(3,3),(4,4) \right\}  。$

(b) $R_{2}=\left\{(1,2),(2,3),(1,3),(3,1)\right\}$ 0

(c) $R_{3}=\left\{(2,1)\right\}$ 0

(d) $R _ { 4 } { = } \{ ( 1 , 1 ) , ( 1 , 2 ) , ( 1 , 3 ) , ( 2 , 1 ) , ( 4 , 2 ) \}$

4.16 假设集合A={1, 2, 3, 4}，写出由下述关系矩阵形式定义的A 上关系的集合表达式和关系图。

$$M_{R_{1}} = \begin{pmatrix}1 & 0 & 0 & 0 \\0 & 1 & 1 & 0 \\0 & 1 & 1 & 0 \\0 & 0 & 0 & 1\end{pmatrix}, \quad M_{R_{2}} = \begin{pmatrix}1 & 1 & 0 & 1 \\0 & 1 & 0 & 1 \\0 & 0 & 1 & 0 \\0 & 0 & 0 & 1\end{pmatrix}, \quad M_{R_{3}} = \begin{pmatrix}0 & 0 & 1 & 0 \\0 & 0 & 1 & 0 \\1 & 1 & 1 & 1 \\0 & 0 & 1 & 0\end{pmatrix}$$

4.17 假设集合A={1, 2, 3, 4}，写出由下述关系图表示的A上关系的集合表达式和关系矩阵。

4.18 求集合A={1,2,3}上的恒等关系。

4.19 已知集合 A={1, 2, 3, 4, 5, 6}、 $B = \{ a , b \}$ ，计算 $L _ { A } , D _ { A } , { \mathcal { \bar { A } } } ( B )$ 上的包含关系、B上的恒等关系的关系矩阵和关系图，并求各自的定义域和值域。

[page:134]

## 离散数学及应用（第2版）

4.20 假设R和S都是集合A上的关系，证明或反驳:

(a) $\mathrm{Dom}(R \cap S) = \mathrm{Dom}(R) \cap \mathrm{Dom}(S)$

(b) $\mathrm{Dom}(R \cup S) = \mathrm{Dom}(R) \cup \mathrm{Dom}(S)$

(c) $\mathrm{Ran}(R \cap S) = \mathrm{Ran}(R) \cap \mathrm{Ran}(S)$

(d) $\mathrm{Ran}(R \cup S) = \mathrm{Ran}(R) \cup \mathrm{Ran}(S)$ 0

4.21 假设 R 是集合 A={1,2, 3}上的关系，且 R({1,2})={1, 3}，R({2,3})={2,3}，R({1, 3}) ={1,2}，画出R的关系图。

4.22 已知 A={1,2, 3, 4}， A 上的关系 R满足: R({1, 2})={1, 2}， R({1, 3})={1, 2, 4}，R({2, 3})={2,4}，R({3,4})={3,4}，计算所有可能的 R。

4.23 假设 R 是集合A 上的关系， $B , C { \subseteq } A$ ，证明或反驳:(a) $R(B \cap C) = R(B) \cap R(C)$ (b) $R(B \cup C) = R(B) \cup R(C)$

4.24 假设 R和S都是集合A上的关系，x∈A，证明或反驳:(a) $( R \cap S ) ( x ) { = } R ( x ) \cap S ( x ) .$ (b) $( R \cup S ) ( x ) { = } R ( x ) \cup S ( x )$ 0

4.25 假设A、B是两个非空集合，R为A到B的关系， $C , D { \subseteq } { \pmb { \mathscr { A } } }$ ，证明或反驳:

$$R | _ { C \cap D } = R | _ { C } \cap R | _ { D } , \quad R | _ { C ^ { \cup } D } = R | _ { C } \cup R | _ { D }$$

4.26 假设 R={(1, 2), (2, 3), (1, 4), (2, 2)}, S={(1,1), (1,3), (2,3), (3,2), (3,3)}是集合 A={1, 2, 3,4}上的关系，计算 $S \circ R 、 R \circ S 、 S^2 、 R^2$

4.27 假设 A={1, 2, 3, 4}，R={(i,j)|j=i+1}和 $S = \{ (i,j) \mid i = j + 2 \}$ 是A上的关系，计算 R∩S、R∪S、S-R、R、S°R、R°S。给出 $M _ { R }  、  M _ { S } ,$ 计算 $M_{R} \odot M_{S^{\circ}}$

4.28 已知关系 R={(0, 1), (1, 2), (3, 4)}，求关系 S 使得 SR ={(1, 3), (1, 4), (3, 3)}。

4.29 假设集合A 上的关系 R和 S都非空，那么 SR 是否一定也非空？

4.30 假设A、B、C是集合，R为A到B的关系，S为B到C的关系，证明: $\mathrm{Ran}(S^{\circ}R)=$ S(Ran(R))。

4.31 证明定理 4.5。

4.32 证明定理 4.6。

4.33 假设A、B、C为非空集合，R为B到C的关系， $S _ { 1 }$ $S _ { 2 }$ 为A到B的关系，则 $R \circ ( S _ { 1 } \cap S _ { 2 } ) { = } ( R \circ S _ { 1 } ) \cap ( R \circ S _ { 2 } )$ 是否成立？如成立请给出证明，如不成立请给出反例。

4.34 假设关系 R的关系图如图4.20所示。

（a）列出所有长度为2的道路。

[page:135]

## 第4章 二元关系

（b）给出一个长度为3的回路。

（c）给出从2到4的一条道路。

4.35 设 $A { = } \{ a , b , c \}$ ，定义A中的关系如下，求每个关系的各次幂。(a) $R _ { 1 } { = } \{ ( a , b ) , ( a , c ) , ( c , b ) \}$ (b) $R _ { 2 } { = } \{ ( a , b ) , ( b , c ) , ( c , b ) \}$ (c) $R _ { 3 } { = } \{ ( a , b ) , ( b , a ) , ( c , c ) \}$ (d) $R _ { 4 } { = } \{ ( a , b ) , ( a , a ) , ( a , c ) \}$

4.36 设 $A { = } \{ a , b , c , d \} , R { = } \{ ( a , b ) , ( b , a ) , ( b , c ) , ( c , d ) \}$ ，求R的各次幂，分别用关系矩阵和关系图表示。

4.37 设 $\mathcal { A } ^ { = } \{ a , b , c , d , e , f \} , R ^ { = } \{ ( a , b ) , ( b , c ) , ( c , d ) , ( d , e ) , ( e , f ) , ( f , a ) , ( a , a ) , ( b , b ) , ( c , c ) , ( d , e ) \} ,$ d), (e, e), (f, f)}，求 $R ^ { 5 } ,$

4.38 设A={1,2,3}，试给出 A 上两个不同的关系 $R _ { 1 }$ 和 $R _ { 2 }$ ，使得 $R_{1}^{2}=R_{1},\ R_{2}^{2}=R_{2}$

4.39 设 A={1,2, 3}，试给出 A 上关系 R 使得 $R \not \subseteq R ^ { 2 }$ C

4.40 假设R为集合A上关系，对于任意正整数m，证明: $( R ^ { m } ) ^ { - 1 } { = } ( R ^ { - 1 } ) ^ { m } .$

4.41 假设 R 为有限集合A 上关系，证明:存在正整数s、t使得 s<t 且 $R ^ { \boldsymbol { \varsigma } } { = } \boldsymbol { R } ^ { t }$

4.42设 $A = \{ a , b , d , e , f \} , R = \{ ( a , b ) , ( b , a ) , ( d , e ) , ( e , f ) , ( f , d ) \}$ ，求出最小的自然数 m和 n，使得 $m { \leq } n$ 且 $R ^ { m } { = } R ^ { n } .$

4.43 给定Z上的如下关系，它们各自具有何性质？(a) $\{ ( i , j ) | i , j \in \mathbb { Z } , | i - j | < 1 0 \}$ (b) $\{ ( i , j ) | i , j \in \mathbb { Z } ,   | i . j | { = } 8 \}$ 0 (c) $\left\{ (i,j)|i,j \in \mathbb{Z}, |i| = |j| \right\}$ (d) $\{ ( i , j ) | i , j \in \mathbb { Z } , | i | \leqslant | j | \}$

4.44 对于任意非空集合 S，定义 S)上的关系 R 为: $R = \{ (A,\ B)|A \in \mathcal{H}(S),\ B \in \mathcal{H}(S) \}$ $A \cap B = \varnothing$ ，试确定R具有的性质。

4.45 对于任意非空集合 S，定义 (S)上的关系 R 为: $R = \{ (A,\ B)|A \in \mathcal{H}(S),\ B \in \mathcal{H}(S)$ $A \cap B \ne \varnothing \}$ ，试确定R具有的性质。

4.46 给定集合 $A   =   \{ a ,   b ,   c \}$ 上关系的关系矩阵，它具有何种性质？(a) $M_{_R} = \begin{pmatrix}1 & 1 & 0 \\0 & 1 & 1 \\1 & 0 & 1\end{pmatrix}$ (b) $\boldsymbol{M}_{s}=\begin{pmatrix}1 & 0 & 0 \\1 & 1 & 0 \\1 & 1 & 1\end{pmatrix} 。$ (c) $\boldsymbol{M}_{T}=\begin{pmatrix}0 & 0 & 0 \\1 & 0 & 1 \\1 & 0 & 0\end{pmatrix}$

4.47 给定集合 $A   =   \{ a ,   b ,   c \}$ 上关系的关系图，它具有何种性质？

[page:136]

## 离散数学及应用（第2版）

4.48 设集合A={1,2,3}，判断如下A上关系具有何种性质:

(a) $R_{1} = \left\{ (1,1),(2,2),(3,3),(1,2) \right\}  。$

(b) R2={(1, 1), (2, 2), (3, 3), (1, 2), (2, 1)}。

(c) R3={(1, 2), (2, 3), (3, 1), (1, 3), (2, 1)} 。

(d) $R_{4} = \left\{ (1,1),(2,3) \right\}  。$

4.49 设 R 是C上的关系，xRy当且仅当 $x - y = a + b$ ，其中a、b是给定的实数。判断关系R具有何种性质。

4.50 给出一个例子满足:R具有传递性但是 $R ^ { 2 } { \neq } R .$

4.51 平面上直线之间的平行关系具有什么性质？

4.52 设集合 $A   =   \{ a , b , c \}$ ，构造关系R满足以下性质:

（a）具有传递性和对称性，但不具有自反性。

（b）具有对称性和自反性，但不具有传递性。

（c）具有非自反性和对称性，但不具有传递性。

（d）既不具有自反性，也不具有非自反性。

（e）具有自反性、传递性、对称性、反对称性。

4.53 是否存在反对称且对称的关系？是否存在非对称且对称的关系？

4.54 假设有限集合A有n个元素，请计算以下关系的个数:

（a）A上的自反关系。

（b）A上的非自反关系。

（c）A上的对称关系。

（d）A上的非对称关系。

（e）A上的反对称关系。

（f）A上既不具有对称性也不具有反对称性的关系。

4.55 若R和S都是传递的，判断下述结论是否成立，如成立请给出证明，如不成立请给出反例。

（a）R-S 是传递的。

(b）R∪S是传递的。

（c）SR 是传递的。

4.56 若R和S都是非自反的，判断下述结论是否成立，如成立请给出证明，如不成立请给出反例。

(a) $R ^ { - 1 }$ 是非自反的。

（b）R∩S是非自反的。

[page:137]

## 第4章 二元关系

（c）R∪S是非自反的。

（d）S°R是非自反的。

4.57 若R和S都是反对称的，判断下述结论是否成立，如成立请给出证明；如不成立请给出反例。

（a）R是反对称的。

(b) $R ^ { - 1 }$ 是反对称的。

（c）R∩S是反对称的。

（d）R∪S是反对称的。

（e）S°R 是反对称的。

4.58 举例说明 R和 S都是对称的，但是 SR不具有对称性。

4.59若 $R { = } R ^ { 4 }$ ，证明: $R ^ { 3 }$ 具有传递性。

4.60 假设 R和S为集合A上的对称关系，证明:若 $R ^ { \circ } S { \subseteq } S ^ { \circ } R ,$ ，则 $R \circ S = S \circ R$ 且 S°R 是对称的。

4.61 假设R和S为集合A 上的对称关系，证明:SR 是对称的当且仅当 $R \circ S = S \circ R$

4.62 证明定理 4.20(a)。

4.63 设R和 S为集合A 上的关系，给出 $( R \cap S ) ^ { n } = R ^ { n } \cap S ^ { n } , \quad ( R \cup S ) ^ { n } = R ^ { n } \cup S ^ { n }$ 的反例。

4.64 如果对于任意 $a ,   b ,   c { \in } A ,$ 若 $[ a ,   b ) { \in } R$ 且 $( b ,   c ) { \in } R$ 必然有 $[ ( a ,   c ) { \notin } R ,$ ，则称R是反传递的。证明:R反传递当且仅当 $(R \circ R) \cap R = \varnothing$

4.65 如果对于任意 $a , b , c { \in } A ,$ 若 $(a,   b) \in R \quad  且  (b,   c) \in R$ 必然有 $[ ( c , a ) { \in } R$ ，则称R是循环的。证明:若R是自反的和循环的，则R是对称的和传递的。

4.66 你觉得为什么不能通过减少有序对来使关系满足特定的性质？

4.67 假设 A={1, 2, 3}，A 上的关系 R={(1, 2), (2, 3), (3, 1)}，求 $r(R), \; s(R), \; t(R)$ 。(求传递闭包时须使用沃舍尔算法。)

4.68 假设 $R = \left\{ (0,1),(1,2),\cdots,(n,n+1),\cdots \right\} = \left\{ (x,x+1)|x \in \mathbb{N} \right\}$ 为N上的关系，求 $r ( R )  、 s ( R )$ t(R)。

4.69设 $A { = } \{ a ,   b ,   c ,   d \}$ 上的关系 $R { = } \{ ( a { , } b ) { , } ( b { , } a ) { , } ( b { , } c ) { , } ( c { , } d ) { , } ( d { , } b ) \}$ ，求 $r ( R )  、 s ( R )  、 t ( R )$ (求传递闭包时须使用沃舍尔算法。)

4.70 设 A={1, 2, 3}，试给出 A 上的关系 R 使得 $R \cup R ^ { 2 }$ 不具有传递性而 $R \cup R ^ { 2 } \cup R ^ { 3 }$ 具有传递性。

4.71 假设 R和 S 是集合A 上的关系。

（a）证明 $r(R \cup S) = r(R) \cup r(S)$

（b）证明 $s(R \cup S) = s(R) \cup s(S), \quad t(R \cup S) \supseteq t(R) \cup t(S)$

（d）举例说明 $t ( R \cup S ) { \neq } t ( R ) \cup t ( S )$ C

4.72 假设R和S是集合A上的关系。

（a）证明 $r(R \cap S) = r(R) \cap r(S)$ 0

（b）证明 $s ( R \cap S ) { \subseteq } s ( R ) \cap s ( S )$ 0

(c) $t ( R \cap S ) { \subseteq } t ( R ) \cap t ( S )$ 0

（d）举例说明 $s ( R \cap S ) { \neq } s ( R ) \cap s ( S )$ 0

[page:138]

## 138

（e）举例说明 $t ( R \cap S ) { \neq } t ( R ) \cap t ( S )$ 4.73 假设 R 是集合A上的关系，如果 R 是传递的，那么 s(R)是否一定也是传递的？4.74 举例说明 $t ( s ( R ) ) \lnot s ( t ( R ) )$ 不能取等号。4.75 非自反关系的传递闭包是否一定也非自反？为什么？4.76 反对称关系的传递闭包是否一定也反对称？为什么？4.77 已知 A={1, 2, 3, 4}，R={(1, 1), (1, 2), (2, 1), (2, 2), (3, 3), (4, 4)}，计算 $A / R ,$ 4.78 给出 A={1,2,3}上所有的等价关系。4.79 已知 A={1, 2, 3, 4, 5}，A/R={{1, 2}, {3, 5}, {4}}，计算 $R _ { \circ }$ 4.80已知 $A = \{ 1, 2, 3, 4, 5 \}, A / R = \{ \{ 1 \}, \{ 2, 3, 4 \}, \{ 5 \} \}$ ，计算 $R ^ { \circ } R ^ { - 1 }$ 4.81 已知 A={1, 2, 3, 4}，在 (A)上定义关系 R 为 SRT 当且仅当 $| S | { = } | \varPi |$ ，证明R是一个等价关系，并计算 $\bar { \mathcal { A } } ( A ) / R .$ 4.82 在N上定义二元关系R为 $( a ,   b ) { \in } R$ 当且仅当2 $| a { + } b |$（a）证明:R是一个等价关系。（b）计算N/R。4.83在 $\mathbb { N } ^ { + } \times \mathbb { N } ^ { + }$ 上定义二元关系 R 为(a, b)R(c, d)当且仅当 $2 | a + c _ { \circ }$ 证明 R 是一个等价关系。4.84 假设A={1,2,3,4}，在A×A 上定义二元关系 R 为 $( a , b ) R ( c , d )$ 当且仅当|a-b|=|c- $- d \vert .$ 9证明R是一个等价关系并求 $A   \times   A / R$ 4.85 在R $\mathbb { L } ^ { + } \times \mathbb { R } ^ { + }$ 上定义二元关系 R 为 $( a , b ) R ( c , d )$ 当且仅当 $ad = bc$ 。证明 R 是一个等价关系。4.86 假设 R 是复数集C上的二元关系， $( z _ { 1 } , z _ { 2 } ) { \in } R$ 当且仅当 $\scriptstyle | z _ { 1 } | = | z _ { 2 } |   \circ   R$ 是否是等价关系？如果是，请计算 $\mathbb { C } / R$ 4.87 假设2×2棋盘的4个方格中的每一个可以被涂成红色或蓝色，在所有涂色方案上定义关系 $R ;$ 假设 $C _ { 1 }$ 和 $C _ { 2 }$ 是两个涂色方案， $(C_{1}, C_{2}){\in}R$ 当且仅当 $C _ { 2 }$ 可以由旋转$C _ { 1 }$ 或者先旋转 $C _ { 1 }$ 再翻转 $C _ { 1 }$ 得到。（a）证明R是等价关系。（b）计算R的等价类。4.88 设R是集合A上的一个关系，满足对称性和传递性。证明:如果对于任意 $a   \in   A$存在 $b   \in   A$ 使得 $( a , b ) { \in } R$ ，则R是一个等价关系。4.89 设R是集合A上的一个关系，满足自反性和传递性，T是集合A上的一个关系。证明:对于任意 $a ,   b ,   c { \in } A$ ，若 $( a ,   b ) { \in } T$ 当且仅当(a, b)∈R且 $( b ,   a ) { \in } R$ ，则T是一个等价关系。4.90 设R是集合A上的二元关系，设 $S = \{ (a,   b) \}$ 存在 $c   \in   A$ ，使得 $( a ,   c ) { \in } R$ 且 $\scriptstyle { \left( c ,   b \right) \in R }   \}$证明:若R是一个等价关系，则S也是一个等价关系且 $R { = } S ,$ 4.91 假设S和 T是非空集合A 上的关系， $A { \times } A$ 上关系R定义为 $( x , y ) R ( u , \nu )$ 当且仅当 $x S u$且 $y T \nu _ { \circ }$ 证明:若S和T都是A上等价关系，则R是 $A { \times } A$ 上等价关系。4.92 设R是集合A上的一个自反关系。证明:R是一个等价关系当且仅当:对于任意$a , b , c { \in } A$ ，若 $( a ,   b ) { \in } R$ 且 $( a ,   c ) { \in } R$ ，则 $( b , c ) { \in } R .$

[page:139]

## 第4章 二元关系

4.93 设 R 是集合A 上的一个等价关系，那么 $R ^ { 2 }$ 是否也是等价关系？

4.94设 $R_{1} 、 R_{2}$ 是集合A上的两个等价关系，那么 $r ( R _ { 1 } – R _ { 2 } )$ 是否也是等价关系？

4.95 假设集合 $A \subseteq \mathbb { Z } , m , n$ 为正整数，R为A上的模m同余等价关系，S为A上的模n同余等价关系。则

(a）R∩S和(R∪S)°各代表什么关系？

（b）如何由A/R和A/S得到 $A / ( R \cap S ) ?$

4.96 假设 R 是集合A 上的等价关系，|A|=n，|R|=s且 $| A / R | { = } r$ 。证明 $rs \geq n^{2}$

4.97 下面哪些集合构成8位二进制串的集合上的划分？

（a）以1开始的二进位串的集合、以00开始的二进位串的集合、以01开始的二进位串的集合。

（b）包含串00的二进位串的集合、包含串01的二进位串的集合、包含串10的二进位串的集合、包含串11的二进位串的集合。

（c）以00结尾的二进位串的集合、以01结尾的二进位串的集合、以10为结尾的二进制串的集合、以11为结尾的二进制串的集合。

(d）以111结尾的二进位串的集合、以011结尾的二进位串的集合、以10结尾的二进位串的集合、以11结尾的二进位串的集合。

（e）含3k个1的二进位串的集合、含3k+1个1的二进位串的集合、含3k+2个1的二进位串的集合，其中k是正整数。

4.98 下面哪些是集合Z×Z的划分？

(a）x或y是奇数的(x, y)对的集合、x 是偶数的 $\left( x , y \right)$ 对的集合、y是偶数的(x, y)对的集合。

(b） x 或 y是奇数的(x, y)对的集合、x 和y只有一个是奇数的(x, y)对的集合、x和y都是偶数的(x,y)对的集合。

(c) x是正数的(x, y)对的集合、y 是正数的(x, y)对的集合、x和y 都是负数的(x, y)对的集合。

(d) x和y都被 3整除的(x, y)对的集合、x被3整除且 y不被3整除的(x, y)对的集合、x不被3整除且y被3整除的 $| ( x , y )$ 对的集合、x和y都不被3整除的(x,y)对的集合。

(e)x>0 且 $y { > } 0$ 的(x,y)对的集合、 $x > 0$ 且 $y { \leqslant } 0$ 的(x,y)对的集合、 $x { \leqslant } 0$ 且 $y { > } 0$ 的(x, y)对的集合、 $x { \leqslant } 0$ 且 $y { \leqslant } 0$ 的(x, y)对的集合。

(f） x≠0且 y≠0 的(x, y)对的集合、x=0且 $y \neq 0$ 的 $( x , y )$ 对的集合、x≠0且 $y { = } 0$ 的(x, y)对的集合。

4.99若 $\pi _ { 1 }$ 和 $\pi _ { 2 }$ 都是集合A的划分，若 $\pi _ { 2 }$ 中的每一个集合都是 $\pi _ { 1 }$ 中某个集合的子集，则称 $\pi _ { 2 }$ 是 $\pi _ { 1 }$ 的一个加细。证明:对于16位二进制串的集合，最后8位相同的二进制串的等价类所构成的划分是由最后4位相同的二进位串的等价类所构成的划分的加细。

4.100证明:若 $\pi_{1}=\left\{A_{1}, A_{2}, \cdots, A_{m}\right\}$ 是集合A的一个划分， $\pi_{2} = \{ B_{1}, B_{2}, \cdots, B_{n} \}$ 是集合B上的一个划分，则 $\pi _ { 1 } { \times } \pi _ { 2 }$ 是集合A×B的一个划分。

[page:140]

## 40

4.101 (a)假设集合 A={1, 2, 3, 4, 5}，π1={{1, 2, 3, 4}, {5}}，π2={{1, 2, 3}, {4, 5}}，计算 $\{ A _ { i } \cap B _ { j } \mid A _ { i } \cap B _ { j } \neq \emptyset , A _ { i } \in \pi _ { 1 } , B _ { j } \in \pi _ { 2 } \}$

（b）证明:若 $\pi_{1}=\left\{A_{1}, A_{2}, \cdots, A_{m}\right\}, \pi_{2}=\left\{B_{1}, B_{2}, \cdots, B_{n}\right\}$ 都是集合A的划分，则 $\{ A _ { i } \cap B _ { j }$ $\{ A _ { i } \cap B _ { j } \neq \varnothing , A _ { i } \in \pi _ { 1 } , B _ { j } \in \pi _ { 2 } \}$ 是集合A的一个划分（称为 $\pi _ { 1 }$ 与 $\pi _ { 2 }$ 的交叉划分)。

(c）若 $\pi _ { 1 }$ 决定的等价关系是 $R _ { 1 } , \pi _ { 2 }$ 决定的等价关系是 $R _ { 2 }$ ，那么 $\{ A _ { i } \cap B _ { j } \mid A _ { i } \cap B _ { j } \neq \emptyset$ $A _ { i } { \in } \pi _ { 1 } , B _ { j } { \in } \pi _ { 2 } \}$ 决定的等价关系是什么？

(d） 假设集合 A={全年级学生}， $\pi _ { 1 } { = } \{$ {全年级所有男生}，{全年级所有女生}}，$\pi _ { 2 } = \{ \{ 1$ 班学生}，{2班学生}，{3班学生}，{4班学生}，{5班学生}}，那么 $\pi _ { 1 }$与 $\pi _ { 2 }$ 的交叉划分的各划分块含义是什么？

4.102 包含4个元素的集合共有多少种不同的划分？

4.103 假设集合A有n个元素，证明:A的包含k个划分块的不同划分总数 $S ( n ,   k )$ 满足递推关系

$$S ( n , k ) { = } S ( n { - } 1 , k { - } 1 ) { + } k { \cdot } S ( n { - } 1 , k )$$

初始条件为 $S(n,1)=S(n,n)=1$

4.104 基数为 n 的集合划分数目 $B _ { n }$ 称作贝尔数（Bell number)。证明: $B_{n + 1} = \sum_{k = 0}^{n} \binom{n}{k} B_{k}$

4.105 下述关系是否构成相容关系？（a）三角形A和B具有关系R当且仅当A和B有相同度数的角。（b）学生甲和乙具有关系R当且仅当甲和乙选修过相同的课程。

4.106 覆盖是否一定是划分？划分是否一定是覆盖？

4.107若 $C _ { 1 }$ 和 $C _ { 2 }$ 都是集合A的覆盖，那么 $C _ { 1 } \cap C _ { 2 }$ 和 $C _ { 1 } \cup C _ { 2 }$ 是否也是集合A的覆盖？

4.108 证明:若 $C _ { 1 }$ 是集合A的一个覆盖， $C _ { 2 }$ 是集合B上的一个覆盖，则 $C _ { 1 } { \times } C _ { 2 }$ 是集合$A { \times } B$ 的一个覆盖。

4.109 设 X={bat, cat, doc, zig, bed} , $R = \{ (x,y) \mid x, y \in X \}$ 且 x、y至少有一个相同的字母}。证明:R是X上的相容关系。

4.110 相容关系是否一定是等价关系？等价关系是否一定是相容关系？

4.111 给定X的相容关系R的图，如图4.22所示，求它的完全覆盖。

4.112 不同的完全覆盖是否可决定相同的相容关系？如成立请给出证明，如不成立请给出反例。

[page:141]

# 第5章

## 函 数

函数是一种特殊的关系，也称为映射，它在计算机科学与技术以及相关学科中有着重要的作用和广泛的应用。

最初开始使用“函数”一词的是莱布尼茨（Leibniz，1646—1716)，用以描述曲线的一个相关量；而中文的“函数”一词由清朝数学家李善兰（1811—1882）译出。

本章主要介绍函数的定义、几种特殊的函数及相关性质、函数的运算以及常用的一些函数。

## 5.1 函数的定义

定义 5.1 设f 为集合 A 到 B 的二元关系，若对于任意 x∈Dom(f)都存在唯一的$y \in \mathrm{Rank}(f)$ 使得 $( x , \; y ) { \in } f$ 成立，则称 f为函数(function)，此时记 y=f(x)，称x为自变量（argument)，y为f在x的值（value）或x在f作用下的像（image）。函数也称作映射（mapping）或变换（transformation）。

注: $A = A_{1} \times A_{2} \times \cdots \times A_{n}$ 时，一般也将 $f _ { 1 } ( ( x _ { 1 } , x _ { 2 } , \cdots , x _ { n } ) )$ 简记为 $f(x_{1},x_{2},\cdots,x_{n})$ 。函数的定义如图5.1 所示。

【例 5.1】 R1={(1,1), (2,3), (4,1), (3,5), (5,3)}是函数，而 R2={(1,1), (1,3), (4,1), (3,5), (5,3)}不是函数，因为 R2(1)={1,3}。

在函数 $R _ { 1 }$ 中， $R_{1}(1)=1,\;R_{1}(2)=3,\;R_{1}(4)=1,\;R_{1}(3)=5,\;R_{1}(5)=3$ ，于是 $R _ { 1 }$ 也可以写作 $R _ { 1 } { = }$ $\{ ( 1 , R _ { 1 } ( 1 ) ) , ( 2 , R _ { 1 } ( 2 ) ) , ( 4 , R _ { 1 } ( 4 ) ) , ( 3 , R _ { 1 } ( 3 ) ) , ( 5 , R _ { 1 } ( 5 ) ) \}$

【例5.2】 设A=B=R，则 f(x)= x+1、 $g ( x ) = { \sqrt { x } }$ $h ( x )   =   \frac { 1 } { x }$ 都是函数。

注:两个函数f和g相等当且仅当满足下面两个条件:

(1) $\mathrm{Dom}(f) = \mathrm{Dom}(g)$ 0

[page:142]

## 42

(2) 对于任意 $x \in \mathrm{Dom}(f) = \mathrm{Dom}(g)$ 都有 $f ( x ) = g ( x )$

例如，函数 $f(x)=(x^{2}-1)/(x-1)$ 和 $g(x) = x + 1$ 不相等，因为 $\mathrm{Dom}(f) \subset \mathrm{Dom}(g)$

定义5.2 设A、B是非空集合，f是A到B的一个关系，如果对每个 $x { \in } A$ ，存在唯一的 $y { \in } B$ ，使得 $( x , y ) { \in } f ,$ 则称f为A到B的函数，记作 $f \colon A { \rightarrow } B _ { \circ }$

注:对于A到B的函数 $f,\ \mathrm{Dom}(f)=A,\ \mathrm{Ran}(f)\subseteq B.$

如果一个A到B的关系是函数，则它的关系矩阵中每一行至多有一个1；如果它是一个A到B的函数，则它的关系矩阵每一行恰好有一个1。

如果一个A上的关系是函数，则它的关系图中每一个顶点至多发出一条有向边（出度不超过1)；如果它是一个A上的函数，则它的关系图中每一个顶点恰好发出一条有向边（出度恰为1）。

【例5.3】设 $A = B = \mathbb{R}$ ，则 $f(x) = x + 1$ 是R到R的函数，而 $g(x)=\sqrt{x} \quad , \quad h(x)=\frac{1}{x}$ 则不是。

定义 5.3 设函数 $f \colon A { \rightarrow } B , A _ { 1 } { \subseteq } A$ ，则称 $f(A_{1}) = \left\{ f(x) \mid x \in A_{1} \right\}$ 为 $A _ { \mathbf { 1 } }$ 在f下的像（image of A1underf)，f(A)称为函数的像（image)。

【例5.4】设函数 $f \colon \mathbb { Z } ^ { + }   \to   \mathbb { Z } ^ { + }$ 定义为 $f(1)=1,f(n)=n-1(n>1)$ ,则有f({2,3})=f({1,2,3}) $= \{ 1 { , } 2 \}$ o

下面定义一些常用的函数。

## 定义 5.4

（a）设 $f .   A { \longrightarrow } B$ ，如果存在 $c   \in   B$ 使得对所有的x∈A都有f(x)=c，则称 $f .   A { \longrightarrow } B$ 是常值函数。

(b)设A 是非空集合，称A 上的恒等关系 $I _ { A }$ 为A上的恒等函数（identity function），也记作 $1 _ { A ^ { \odot } }$ 即对于所有的 $x \in A , 1 _ { A } ( x ) = x$ 0

（c）设R是A上的等价关系，定义从A到A/R的函数 $g \colon A { \rightarrow } A / R$ ，对任意 $a   \in   A$ $g(a) = [a]$ ，即将元素映到该元素所在的等价类，称g是从A 到商集A/R的典范映射（canonical map）或自然映射。

注:给定集合A和A上的一个等价关系R，就可以确定一个典范映射 $g \colon A { \rightarrow } A / R$ 。不同的等价关系确定不同的典范映射。

【例5.5】定义函数g为 $g(x) = 2$ ，则g是C到C的常值函数。

【例 5.6】 $A = \{ 1, 2, 3 \}$ 上的等价关系 R={(1,1), (1,3), (2,2), (3,1), (3,3)} ∪ I₄所确定的典范映射是 g1(1) = g1(3) = {1, 3}, g1(2) = {2}；A={1, 2, 3} 上的等价关系 $I _ { A }$ 所确定的典范映射是 $g_{2}(1)=\{1\},g_{2}(2)=\{2\},g_{2}(3)=\{3\}$

## 5.2 函数的性质

定义 5.5 设函数 $f \colon A { \rightarrow } B _ { \circ }$ 0

（a）若 $\mathrm{Ran}(f) = B$ ，则称f是满射（surjection）或映上的（onto）

(b)若任意 $y \in \operatorname{Rank}(f)$ 都存在唯一的 x∈A使得 $f(x) = y$ ，则称 $f .   A { \longrightarrow } B$ 是单射(injection)

[page:143]

## 第5章 函数

或——的（one-to-one）;

（c）若f既是满射又是单射，则称f是双射（bijection）或——对应（one-to-one correspondence ).

函数的满射、单射和双射如图5.2所示。其中，(a)是满射，(b)是单射，(c)是双射。

注:

(a)f是满射意味着:对于任意 $y { \in } B$ ，都存在 $x { \in } A$ 使得 $f(x) = y$

(b）f是单射另有如下两个等价定义:

（b-1）对于任意 $a , b   \in   A$ 满足 $a { \neq } b$ ，均有 $f(a) \neq f(b)$ o

（b-2）如果 $a , b   \in   A$ 满足 $f(a) = f(b)$ ，则 $a { = } b$ a

【例5.7】函数 $f \colon \mathbb { Z } ^ { + }   \to   \mathbb { Z } ^ { + }$ ，定义为 $f(1)=1,\ f(n)=n-1\ (n>1)$ 。f是满射——对于任意$y   \in   \mathbb { Z } ^ { + }$ ，有 $f(y + 1) = y;$ 但不是单射 $f(1)=f(2)=1$ 。从而f不是双射。

【例5.8】 函数g: R→R，定义为 $g(x) = x^{2} - 2x + 1$ 。g不是单射 $g(0)=g(2)=1$ ; g也不是满射 $\_ g$ 在 $x { = } 1$ 取得最小值0。从而 $g$ 不是双射。

【例5.9】 函数 h: R→ R，定义为 $h(x) = 2x + 1$ 。h 是单射——若 $2x_{1} + 1 = 2x_{2} + 1$ ，则必然有 $x _ { 1 } { = } x _ { 2 } ; \quad h$ 是满射——对于任意 y∈ R，有 $f\left(\frac{y - 1}{2}\right) = y$ 。从而h是双射。

【例5.10】设A是非空集合，A上的恒等函数 $1 _ { A }$ 既是单射又是满射，从而是双射。

【例5.11】设A是非空集合，R是A上的一个等价关系，则恒等关系 $I _ { A }$ 所确定的典范映射是双射，而其他的典范映射只是满射。

对于有限集合上的函数，有如下主要结果。

定理 5.1 假设A 和 B 是两个有限集合且满足 $| A | { = } | B |$ ，则函数 $f . A { \rightarrow } B$ 是单射当且仅当f是满射。

定理5.2 假设A和B都是有限集合，则

(a)若 $| A | { \leq } | B |$ ，则必然存在从A到B的单射函数、必然不存在从A到B的满射函数。

(b)若 $| A | { > } | B |$ ，则必然存在从A到B的满射函数、必然不存在从A到B的单射函数。

(c)若 $| A | { = } | B |$ ，则必然存在从A到B的双射函数。

推论 假设A是有限集合，B是无限集合，则

（a）必然不存在从A到B的满射函数。

（b）必然不存在从B到A的单射函数。

函数性质在关系矩阵和关系图中的体现是:

（a）如果一个A到B的函数是单射，则它的关系矩阵中每一列至多有一个1；如果

[page:144]

## 44

它是一个满射，则它的关系矩阵每一列至少有一个1；如果它是一个双射，则它的关系矩阵每一行每一列都恰好有一个1。

（b）如果一个A到B的函数是单射，则它的关系图中每一个顶点至多存在一条指向它的边（入度不超过1)；如果它是一个满射，则它的关系图中每一个顶点至少存在一条指向它的边（入度不小于1)；如果它是一个双射，则它的关系图中每一个顶点都发出条有向边，且恰存在一条指向它的边（出度和入度都恰好为1）。

## 5.3 函数的复合

定理5.3 设A、B、C是集合，f是A到 B的关系，g是B到C的关系。若 $f \mathrm { ~ } g$ 是函数，则 $g \circ f$ 也是函数，且满足

(a) $\mathrm{Dom}(g \circ f) = \{x \mid x \in \mathrm{Dom}(f)  且  f(x) \in \mathrm{Dom}(g)\}$ 0

（b）对于任意 $x \in \mathrm{Dom}(g \circ f)  有  g \circ f(x) = g(f(x)).$ 0

证明. 由定义4.10，若对于某个 $x \in \mathrm{Dom}(g \circ f)$ 存在 $y_{1},y_{2} \in \mathrm{Rank}(g \circ f)$ 使得 $( x , y _ { 1 } ) { \in } g ^ { \circ } f$ 且(x, $y _ { 2 } )   \in   g \circ f ,$ 则存在 $t _ { 1 } { \in } \mathrm { D o m } ( g )$ 使得(x, $t _ { 1 } ) { \in } f$ 且 $( t _ { 1 } , \; y _ { 1 } ) { \in } g$ ，存在 $t _ { 2 } { \in } \mathrm { D o m } ( g )$ 使得 $( x , t _ { 2 } ) { \in } f$ 且 $\overline { { ( t _ { 2 } } } ,$ $y _ { 2 } ) { \in } g .$ 。由于f是函数，因此 $t _ { 1 } { = } t _ { 2 }$ ，又由于 $(t_1, y_1) \in g, (t_2, y_2) \in g$ 且 $g$ 是函数，有 $y _ { 1 } { = } y _ { 2 }$ ，因此 $f ^ { \circ } g$ 为函数。

（a）由定义4.10即得。

（b）由定理4.6即得。

函数的复合如图5.3所示。

由定理5.3及关系复合运算的性质易得以下推论:假设A、B、C、D均为非空集合，f为A到B的关系，g为B到C的关系，h为C到D的关系。若 $f , g , h$ 都是函数，则 $( h \circ g ) \circ f$和 $h ^ { \circ } ( g ^ { \circ }   f )$ 也都是函数，且 $(h \circ g) \circ f = h \circ (g \circ f)$

【例 5.12】 函数 f: R → R 定义为 $f(x) = x + 1$ ， $g ;$ R→R 定义为 $g(x) = 2x + 1$ , h: R → R定义为 $h(x) = x^{2} + 1$ ，则:

$$\begin{cases}g^{\circ}f(x) = g(f(x)) = 2f(x) + 1 = 2(x + 1) + 1 = 2x + 3 \\f^{\circ}g(x) = f(g(x)) = g(x) + 1 = 2x + 1 + 1 = 2x + 2 \\h^{\circ}g^{\circ}f(x) = h(g(f(x))) = (2x + 3)^2 + 1 = 4x^2 + 12x + 10\end{cases}$$

定理5.4假设A、B、C为非空集合，函数 $f \colon A { \rightarrow } B , g : B { \rightarrow } C$ ，则

（a）如果 $g$ 和f都是满射，则 $g \circ f$ 也是满射。

(b）如果 $g$ 和f都是单射，则 $g \circ f$ 也是单射。

（c）如果 $g$ 和f都是双射，则 $g \circ f$ 也是双射。

[page:145]

## 第5章 函数

证明.

(a) 对于任意的 $c { \in } C ,$ ，因g是满射，故而存在 $b   \in   B$ 使得 $g(b) = c$ ；现考察b，因f是满射，故而存在 $a   \in   A$ 使得 $f(a)=b$ 于是 $g \circ f(a) = g(f(a)) = g(b) = c$ ，从而证明 $了 gof$ 是满射。

(b）假设存在 $x _ { 1 } , x _ { 2 } { \in } { \mathcal { A } }$ 使得 $g \circ f(x_1) = g \circ f(x_2)$ ，则由 $g(f(x_{1})) = g(f(x_{2}))$ 及 g 是单射知$f(x_{1}) = f(x_{2})$ ，又由于f也是单射，所以 $x _ { 1 } { = } x _ { 2 }$ 。从而证明了 $g \circ f$ 是单射。

（c）由（a)、（b）即得。

用图5.4说明定理5.4，其中(a)为满射的复合，(b)为单射的复合，(c)为双射的复合。

但是反过来，定理5.4的逆定理并不全部成立，而只是部分成立。

定理5.5 假设A、B、C为非空集合，函数 $f \colon A { \rightarrow } B , g \colon B { \rightarrow } C$ ，则

（a）若gf是单射，则f是单射。

（b）若gf是满射，则 $g$ 是满射。

（c）若gf是双射，则f是单射， $g$ 是满射。

证明.（a)假设f不是单射，即存在 $a_{1}, a_{2} \in A, a_{1} \neq a_{2}$ 且 $f(a_{1}) = f(a_{2})$ ;于是 $g \circ f(a_{1}) = g(f(a_{1})) =$ $g(f(a_{2})) = g \circ f(a_{2})$ ，而这与 $g \circ f$ 是单射矛盾。

(b）若 $g \circ f$ 是满射，则对于任意 $c   \in   C$ ，存在 $a   \in   A$ ，使得 $g \circ f ( a ) = c$ ，于是 $g(f(a)) = c$ ，故g是满射。

(c）由(a)、(b)即得。

定理5.5 可用图5.5来说明。其中，(a) g°f是单射，而g不是单射；(b) $g \circ f$ 是满射，而f不是满射； $\mathtt { ( c ) }   g \mathtt { \circ } f$ 是双射，而g不是单射且f不是满射。

定理5.6 假设A、B为集合，函数 $f \colon A { \rightarrow } B$ ，则 $f = f \circ 1 _ { A } = 1 _ { B } \circ f \circ$

证明.由定理4.7即得。

在本节最后给出一些除函数复合外的常用记号:

$$(f_{1}+f_{2})(x)=f_{1}(x)+f_{2}(x)$$

$$( f _ { 1 } { \cdot } f _ { 2 } ) ( x ) { = } f _ { 1 } ( x ) { \cdot } f _ { 2 } ( x )$$

$(m \cdot f)(x) = m \cdot f(x)$ 是一个非零常数)

[page:146]

## 离散数学及应用（第2版）

## 5.4逆函数

关系的逆关系仍然是关系，而函数作为关系，其逆关系却不一定也是函数。

【例 5.13】 设 f={(1,1), (2,3),(4,1), (3,5), (5,3)}是一个函数；而 f的逆关系 $f ^ { - 1 }     =     \{ ( 1 ,     1 )$ (3,2), (1,4), (5,3), (3,5)}是一个关系，但不是函数。

定义5.6 假设A、B为集合，如果函数 $f \colon A { \rightarrow } B$ 作为关系的逆关系 $f ^ { - 1 }$ 是B到A的函数，则称之为可逆的(invertible)，此时称 $f ^ { - 1 }$ 为f的反函数或逆函数(inverse function)。

定理 5.7 假设A、B为集合，设 $f \colon A { \longrightarrow } B$ ，若函数 $f ^ { - 1 }$ 存在，则

(a) $f ^ { - 1 } { \circ } f { = } 1 _ { A ^ { \circ } }$

(b) $f ^ { \circ } f ^ { - 1 }   =   1 _ { B } ,$

证明. 假设函数 $f ^ { - 1 }$ 存在，对于任意 $x { \in } A$ ，由于f是A到B的函数，因此存在 $y { \in } B$使得 $( x , y ) { \in } f _ { \circ }$ 于是 $( x ,   x ) { \in } f ^ { - 1 } { \circ } f ,$ 即得 $1 _ { A } { \subseteq } f ^ { - 1 } { \circlearrowleft } f _ { \circ }$ 又由于 $f  和  f^{-1}$ 都是函数，定理5.3表明$f ^ { - 1 } { \boldsymbol { \mathrm { o } } } f$ 也是函数，因此对于任意 $x { \in } A$ ，若还存在 $y { \in } A$ 使得 $( x ,   y ) { \in } f ^ { - 1 } { \circ } f ,$ 则必然有 $y { = } x$ ，即$f ^ { - 1 } { \circ } f { = } 1 _ { A }$ o

类似地，可证明 $f ^ { \circ } f ^ { - 1 } { = } 1 _ { B ^ { \circ } }$

下面的定理给出了逆函数存在的充要条件。

定理5.8假设A、B为非空集合，函数 $f \colon A { \rightarrow } B$ ，则f可逆当且仅当f是双射，且f的逆函数若存在则也是双射。

证明.（充分性）假设f是双射。下面证明 $f ^ { - 1 }$ 是B到A的函数。

因为f是函数，所以 $f ^ { - 1 }$ 是关系，且由f是双射有 $\mathrm{Dom}(f^{-1}) = \mathrm{Ran}(f) = B$ $\operatorname { R a n } ( f ^ { - 1 } ) =$ $\mathrm{Dom}(f) = A$ 。对于任意的 $b   \in   B$ ，若存在 $a _ { 1 } ,   a _ { 2 } { \in } { \mathcal { A } }$ 使得 $( b , a _ { 1 } ) { \in } f ^ { - 1 }$ 且 $( b ,   a _ { 2 } ) { \in } f ^ { - 1 }$ ，则由关系逆的定义有 $( a _ { 1 } , b ) { \in } f$ 且 $( a _ { 2 } ,   b ) { \in } f ,$ 根据f是单射可得 $a _ { 1 } { = } a _ { 2 }  。$ 从而证明了 $f ^ { - 1 }$ 是B到A的函数。

（必要性）假设f可逆，以下分两个步骤证明f是双射:

[page:147]

## 第5章 函数

（1）f是单射:由定理5.7， $f ^ { - 1 } { \mathcal { J } } ^ { - 1 } { \mathcal { A } }$ ，而 $1 _ { A }$ 是单射，由定理5.5，f是单射。

（2）f是满射:由定理5.7， $f ^ { \circ } f ^ { - 1 } { = } 1 _ { B } ,$ ，而 $1 _ { B }$ 是满射，由定理5.5，f是满射。

下面证明 $f ^ { - 1 }$ 也是双射:

(1) $f ^ { - 1 }$ 是满射:由定理5.7， $f ^ { - 1 } { \circ } f { \in } \mathbb { 1 } _ { A } ,$ ，而 $1 _ { A }$ 是满射，由定理5.5， $f ^ { - 1 }$ 是满射。

(2) $f ^ { - 1 }$ 是单射:由定理5.7， $f ^ { \circ }   f ^ { - 1 }     =     1 _ { B } ,$ 而 $1 _ { B }$ 是单射，由定理5.5， $f ^ { - 1 }$ 是单射。□

注:由定理5.8及关系的逆运算、复合运算的性质，易得:

(a） 若函数 $f \colon A { \longrightarrow } B$ 是双射，则 $\scriptstyle | ( f ^ { - 1 } ) ^ { - 1 } = f _ { \circ }$

(b）若函数 $f \colon A { \rightarrow } B , g \colon B { \rightarrow } C$ 均是双射，则 $( g \circ f ) ^ { - 1 } = f ^ { - 1 } \circ g ^ { - 1 }$ 0

【例5.14】 函数 h:R→R，h(x)=2x+1是双射，因此可逆，其逆函数是 $h^{-1}(x) = \frac{x - 1}{2}$而函数g:R →R， $g(x) = -x^2 + 2x - 1$ 不是双射，因此不存在g的逆函数。

本节最后给出一个更强的结果，它在实际应用中具有重要意义和价值。

定理5.9 假设A、B为集合，若A到B的函数f和B到A的函数g满足 $\scriptstyle { \mathcal { g } } \circ { \mathcal { f } }   =   1 _ { \mathcal { A } }$ 及$f ^ { \circ } g = 1 _ { B } ,$ 则f是一个A到B的双射，g是一个B到A的双射，而且f和g互为逆函数。

证明. 由 $\scriptstyle { \mathcal { E } } ^ { \circ } { \mathcal { J } } = 1 _ { \mathcal { A } }$ 知f是满射，由 $f ^ { \circ } g ^ { = 1 } \mathbf { 1 } _ { B }$ 知f是单射，因此f是双射，f可逆。且 $f ^ { - 1 } { = }$ $f^{-1} \circ (f \circ g) = (f^{-1} \circ f) \circ g = 1 \circ g = g$ 0

类似地可证明g也是双射，g可逆且 $g ^ { - 1 } { = } f _ { \circ }$

由此逆函数也可以等价地作如下定义。

定义5.7 假设A、B为集合，对于函数 $. f \colon A { \rightarrow } B$ ，若存在函数 $f ^ { - 1 }$ 使得 $f ^ { - 1 } \circ f = 1 _ { A }$ 且$f ^ { \circ } f ^ { - 1 } { = } 1 _ { B }$ ，则称f为可逆的，此时称 $f ^ { - 1 }$ 为f的反函数或逆函数。

## 5.5 计算机科学中的常用函数

定义5.8 设U为全集，对于任意集合 $A { \subseteq } U$ ，可定义A的特征函数（characteristic function) $\chi _ { 4 } : U \to \{ 0 , 1 \}$ 为

$$\chi_{A}(a)=\left\{\begin{aligned}1, & \quad a \in A \\ 0, & \quad a \in \overline{A}\end{aligned}\right.$$

【例5.15】设全集 $U { = } \{ 0 , 1 , \cdots , 9 \}$ ，集合 $A = \{ 0, 1, 2, 3 \}, B = \{ 1, 3, 5, 7, 9 \}$ ，则 $A \cap B = \{ 1$ 3}, A ∪ B={0, 1, 2, 3, 5, 7, 9}, A−B={0, 2}, A ={4, 5, 6, 7, 8, 9}, B ={0, 2, 4, 6, 8}, A⊕B={0, $\left. 2 , 5 , 7 , 9 \right\}$

则有: $\chi _ { 4 } ( 0 ) = 1 , \chi _ { 4 } ( 1 ) = 1 , \chi _ { 4 } ( 2 ) = 1 , \chi _ { 4 } ( 3 ) = 1 , \chi _ { 4 } ( 4 ) = 0 , \chi _ { 4 } ( 5 ) = 0 , \chi _ { 4 } ( 6 ) = 0 , \chi _ { 4 } ( 7 ) = 0 , \chi _ { 4 } ( 8 ) = 0 ,$ $\chi _ { A } ( 9 ) { = } 0$ 0

类似地，可定义 $\chi _ { 1 } , \chi _ { 2 } , \chi _ { 3 } , \chi _ { 4 } , \chi _ { 5 } , \chi _ { 6 } , \chi _ { 7 } , \chi _ { 8 } , \chi _ { 9 } , \chi _ { 1 0 } , \chi _ { 1 1 } , \chi _ { 1 2 } , \chi _ { 2 3 } , \chi _ { 1 4 } , \chi _ { 2 5 }$ 它们在各元素的取值如表 5.1 所示。

表 5.1 例 5.15 用表<table><tr><td>特征函数</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td></tr><tr><td><eq>\underline { { \underline { { \chi _ { 4 } } } } }</eq></td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td><eq>\chi _ { \bar { A } }</eq></td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr></table>

[page:148]

## 48

续表<table><tr><td>特征函数</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td></tr><tr><td><eq>\underline { { \underline { { \chi } } } } \underline { { \underline { { B } } } }</eq></td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td></tr><tr><td><eq>\chi _ { \overline { { B } } }</eq></td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td></tr><tr><td><eq>\chi _ { A \cap B }</eq></td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td><eq>\chi _ { A \cup B }</eq></td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td></tr><tr><td><eq>\chi _ { A - B }</eq></td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td><eq>\underline { { f _ { A \oplus B } } }</eq></td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td></tr></table>

一般情况下，假设全集U的基数是n且其元素有一个确定的顺序，于是每一个全集的子集都一一对应着一个n维0-1向量，也即1×n的布尔矩阵，于是集合运算可以转化为布尔矩阵之间的运算。例如，若集合A对应的布尔矩阵是 $\mathbf { V } _ { A }$ ，集合B对应的布尔矩阵是 $\mathbf { V } _ { B } ,$ ，则集合对应的布尔矩阵是 $\overline { { \mathbf { V } _ { A } } }$ ，集合A∪B对应的布尔矩阵是 $\mathbf { V } _ { A } \vee \mathbf { V } _ { B } ,$ 集合A∩B对应的布尔矩阵是 $\mathbf { V } _ { A } \wedge \mathbf { V } _ { B }$

将布尔运算转化为布尔矩阵运算可以方便地使用计算机表示集合和进行集合间的运算。

定理5.10 特征函数满足以下等式:

（a） 对于所有 $x \in U , \chi _ { \overline { { A } } } ( x ) = 1 - \chi _ { A } ( x )$

（b）对于所有x∈U， $\chi _ { A \cap B } ( x ) = \chi _ { A } ( x ) \chi _ { B } ( x )$ 0

（c）对于所有 $x \in U , \chi _ { A ^ { \cup } B } ( x ) = \chi _ { A } ( x ) + \chi _ { B } ( x ) - \chi _ { A } ( x ) \chi _ { B } ( x ) .$

（d）对于所有 $x \in U , \quad \chi _ { A \oplus B } ( x ) = \chi _ { A } ( x ) + \chi _ { B } ( x ) - 2 \chi _ { A } ( x ) \chi _ { B } ( x ) .$

(e）对于所有 $x \in U , \chi _ { A ^ { - } B } ( x ) = \chi _ { A } ( x ) ( 1 - \chi _ { B } ( x ) ) .$

定义5.9定义在R上的地板函数（floorfunction），也称作下取整函数，其值是不超过自变量x的最大整数，记作floor(x)或x

【例5.16】 $\left \lfloor 5 \right \rfloor = 5,\left \lfloor 2.4 \right \rfloor = 2,\left \lfloor -2.4 \right \rfloor = -3,\left \lfloor -\pi \right \rfloor = -4.$

注:下取整函数也称作高斯函数，记作[x]，这是因为该表示方法首次出现于高斯的数学巨著《整数论研考》(Disquisitiones Arithmeticae)。

定义5.10 定义在R上的天花板函数（ceiling function），也称作上取整函数，其值是不小于x的最小整数，记做 $\operatorname{eclip}(x)  或  [x]$

【例5.17】 $5 = 5, \left [ 2.4 \right ] = 3, \left [ -2.4 \right ] = -2, \left [ -\pi \right ] = -3$

下取整函数和上取整函数分别如图5.6(a)和(b)所示。

[page:149]

## 第5章 函数

上取整函数和下取整函数具有如下性质。

定理 5.11 设n为任意整数，x为实数，则

$(a - 1) \left\lfloor x \right\rfloor = n$ 当且仅当 $n \leqslant x < n + 1$ 0

$(a - 2) \left\lceil x \right\rceil = n$ 当且仅当 $n - 1 < x \leq n$ 0

(a-3) Lx= n 当且仅当 $x - 1 < n \leq x$

(a-4) $\lceil x \rceil   =   n$ 当且仅当 $x \leqslant n < x + 1$ O

(b) $x - 1 < \left \lfloor x \right \rfloor \leqslant x \leqslant \left \lceil x \right \rceil < x + 1$ 0

(c- $\left \lfloor -x \right \rfloor = \left \lceil x \right \rceil$

(c-2) $\left [ -x \right ] = \left [ x \right ]$

(d-1) $\left \lfloor x+n \right \rfloor =\left \lfloor x \right \rfloor +n$ 0

(d-2) $\left [ x+n \right ] =\left [ x \right ] +n$ 0

【例 5.18】 GCD 和 LCM 都是 $\mathbb { Z } ^ { + } \times \mathbb { Z } ^ { + }$ 到Z+的函数，是满射而非单射。

假设f是集合{1,2,3}上的一个双射，则f(1)f(2)f(3)构成{1,2,3}的一个置换。例如f={(1, 2), (2, 3), (3, 1)}，则f(1)f(2)f(3)为 231。

定义5.11 假设非空有限集合S包含n个元素，S上的一个双射称为S的一个n元置换或简称置换（permutation），表示为

$$\pi = \begin{pmatrix} x_{1} & x_{2} & \cdots & x_{n} \\ f(x_{1}) & f(x_{2}) & \cdots & f(x_{n}) \end{pmatrix}$$

其中 $x _ { i }$ 表示S中的互异元素，n称为置换的阶（order）。

【例5.19】 置换的表示形式是不唯一的，例如图5-7表示的集合S={1,2,3}上的置换可写为下述6种形式之一:

$$\pi = \begin{pmatrix} 1 & 2 & 3 \\ 3 & 2 & 1 \end{pmatrix}, \quad \pi = \begin{pmatrix} 1 & 3 & 2 \\ 3 & 1 & 2 \end{pmatrix}, \quad \pi = \begin{pmatrix} 2 & 1 & 3 \\ 2 & 3 & 1 \end{pmatrix},$$

$$\pi = \begin{pmatrix} 2 & 3 & 1 \\ 2 & 1 & 3 \end{pmatrix}, \quad \pi = \begin{pmatrix} 3 & 1 & 2 \\ 1 & 3 & 2 \end{pmatrix}, \quad \pi = \begin{pmatrix} 3 & 2 & 1 \\ 1 & 2 & 3 \end{pmatrix}$$

【例5.20】 集合S={1,2,3}上的置换（双射函数）有3!=6个，分别为

$$\pi_{1} = \begin{pmatrix} 1 & 2 & 3 \\ 1 & 2 & 3 \end{pmatrix}, \quad \pi_{2} = \begin{pmatrix} 1 & 2 & 3 \\ 1 & 3 & 2 \end{pmatrix}, \quad \pi_{3} = \begin{pmatrix} 1 & 2 & 3 \\ 2 & 1 & 3 \end{pmatrix},$$

$$\pi_{4} = \begin{pmatrix} 1 & 2 & 3 \\ 2 & 3 & 1 \end{pmatrix}, \quad \pi_{5} = \begin{pmatrix} 1 & 2 & 3 \\ 3 & 1 & 2 \end{pmatrix}, \quad \pi_{6} = \begin{pmatrix} 1 & 2 & 3 \\ 3 & 2 & 1 \end{pmatrix}$$

[page:150]

## 离散数学及应用（第2版）

一般地讲，假设S是有n个元素的有限集，则

（a）S的任一个置换都有n!种不同的表示。

(b）S共有n!个彼此不同的置换，其全体用 ${ \bf S } _ { n }$ 表示。

定义5.12 假设有限集合S包含n个元素，则称S上的恒等函数为S的恒等置换或不变置换。

由于置换就是一个双射，因此置换存在逆置换，具体地讲:假设非空有限集合S包含n个元素，S的置换 $\pi = \begin{pmatrix} x_{1} & x_{2} & \cdots & x_{n} \\ y_{1} & y_{2} & \cdots & y_{n} \end{pmatrix}$ 的逆置换为 $\pi^{-1} = \begin{pmatrix} y_{1} & y_{2} & \cdots & y_{n} \\ x_{1} & x_{2} & \cdots & x_{n} \end{pmatrix}$ ，而S的置换 $\pi_{1}=\begin{pmatrix}x_{1}&x_{2}&\cdots&x_{n}\\y_{1}&y_{2}&\cdots&y_{n}\end{pmatrix}$ 和 $\pi_{2}=\begin{pmatrix}y_{1}&y_{2}&\cdots&y_{n}\\z_{1}&z_{2}&\cdots&z_{n}\end{pmatrix}$ 的复合为 $\pi_{2} \circ \pi_{1} = \begin{pmatrix} x_{1} & x_{2} & \cdots & x_{n} \\ z_{1} & z_{2} & \cdots & z_{n} \end{pmatrix}$ 0

注:在习惯上也常将置换的复合称作置换的乘积或积。

【例 5.21】 对于集合 S={1,2,3}上的两个置换 $\pi_{1}=\begin{pmatrix}1&2&3\\3&1&2\end{pmatrix}$ 和 $\pi_{2}=\begin{pmatrix}1&2&3\\2&1&3\end{pmatrix}$ ，有

$$\pi_{1}^{-1}=\begin{pmatrix}3&1&2\\1&2&3\end{pmatrix}=\begin{pmatrix}1&2&3\\2&3&1\end{pmatrix}, \quad \pi_{2}^{-1}=\begin{pmatrix}2&1&3\\1&2&3\end{pmatrix}=\begin{pmatrix}1&2&3\\2&1&3\end{pmatrix}=\pi_{2}$$

$$\pi_{2} \circ \pi_{1} = \begin{pmatrix} 1 & 2 & 3 \\ 3 & 2 & 1 \end{pmatrix}_{1} \quad \pi_{1} \circ \pi_{2} = \begin{pmatrix} 1 & 2 & 3 \\ 1 & 3 & 2 \end{pmatrix}$$

定义5.13 假设π是集合S的一个置换，则可定义π的幂为

$$\begin{array} { l } { { \pi ^ {   0 } { = } 1 _ { S } } } \\ { { \pi ^ { n } { = }   \pi ^ { n { - } 1 } { } ^ {   0 } \pi , \quad n { \geqslant }   1 } } \end{array}$$

注:易见 $( \pi ^ { - 1 } ) ^ { n } { = } ( \pi ^ { n } ) ^ { - 1 }$

定义5.14 假设π是集合S的一个置换，使得 $\pi ^ { k } { = } 1 _ { S }$ 成立的最小正整数k称作π的周期(period)，记作 per(π)。

【例5.22】 对于集合 S={1,2,3}上的置换 $\pi = \begin{pmatrix} 1 & 2 & 3 \\ 3 & 1 & 2 \end{pmatrix}, \quad \pi^{1} = \pi, \quad \pi^{2} = \begin{pmatrix} 1 & 2 & 3 \\ 2 & 3 & 1 \end{pmatrix}$ $\pi ^ { 3 } { = } 1 _ { \mathcal { S } } ,$ 因此π的周期为3。

定理5.12 假设π是有限集合S的一个置换，则π的周期必定存在。

证明. 考察无限序列 $\pi^{1}, \pi^{2}, \pi^{3}, \cdots$ ，由于有限集合S的置换也只有有限个，因此必定存在 $1   \leqslant   i   <   j$ 使得 $\pi ^ { i } { = } \pi ^ { j }$ ，于是 $\pi ^ { j - i } { = } ( \pi ^ { j } ) ^ { \circ } ( \pi ^ { i } ) ^ { - 1 } { = } 1 _ { S ^ { \circ } }$ 。即序列 $\pi^{1}, \pi^{2}, \pi^{3}, \cdots \pi^{j-i}$ 中必定存在最小正整数k使得 $\pi ^ { k } { = } 1 _ { \mathcal { S } } ,$ 其即为π的周期。 口

定义 5.15 假设有限集合S包含n 个元素， $\left( a_{1}, a_{2}, \cdots, a_{r} \right)$ 表示S的一个如下置换:将 $a _ { 1 }$ 映射为 $a _ { 2 }$ ，将 $a _ { 2 }$ 映射为 $a _ { 3 } { \cdots } { \cdots }$ 将 $a _ { r - 1 }$ 映射为 $a _ { r }$ ，将 $a _ { r }$ 映射为 $a _ { 1 }$ ，同时将其他元素映射到自身。 $(a_{1},   a_{2},   \cdots,   a_{r})$ 称为一个 r-轮换或简称轮换（cycle permutation)，r 称作该轮换的长度。2-轮换也称作对换。

注:通常将 $1 _ { S }$ 写作轮换(1)。

【例5.23】置换 $\pi_{0}=\begin{pmatrix}1&2&3\\1&2&3\end{pmatrix}$ 可写作(1)， $\pi_{1}=\begin{pmatrix}1&2&3\\1&3&2\end{pmatrix}$ 可写作(2，3)，

[page:151]

## 第5章 函数

$\pi_{2}=\begin{pmatrix}1&2&3\\3&2&1\end{pmatrix}$ 可写作(1, 3), $\pi_{3}=\begin{pmatrix}1&2&3\\2&1&3\end{pmatrix}$ 可写作(1, 2), $\pi_{4}=\begin{pmatrix}1&2&3\\2&3&1\end{pmatrix}$ 可写作(1, 2, 3), $\pi_{5}=\begin{pmatrix}1&2&3\\3&1&2\end{pmatrix}$ 可写作(1,3,2)。

定义 5.16 若两个轮换 $\sigma_{1}=(a_{1}, a_{2}, \cdots, a_{r})  和  \sigma_{2}=(b_{1}, b_{2}, \cdots, b_{s})$ 满足 $\{ a _ { 1 } , a _ { 2 } , \cdots , a _ { r } \} \cap \{ b _ { 1 }$ $b_{2}, \cdots, b_{s} \} = \varnothing$ ，则称它们是不相交的轮换。

注:容易证明，不相交轮换对于复合运算是可换的。

定理5.13 任一置换可唯一（不计轮换的次序）表示成若干不相交轮换的复合(积)。

【例5.24】对于置换 $\pi = \begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 \\ 2 & 3 & 5 & 7 & 8 & 4 & 6 & 1 \end{pmatrix}$ ，从1开始，发现 $\pi(1)=2,\ \pi(2)=3$ $\pi(3)=5,\ \pi(5)=8,\ \pi(8)=1$ ，于是得到轮换(1,2,3,5,8)；再从{1,2, 3,4,5,6,7,8}\{1,2,3,5, 8}选择4，由π(4)=7，π(7)=6，π(6)=4得到轮换(4,7,6)。因此，π可以分解为π=(1,2,3,5, 8)°(4, 7, 6)。

定义 5.17 设A 为有限集合，n为一确定正整数，则 $A ^ { * }$ 到 $A ^ { n }$ 的函数 $H _ { : } { \underline { { { A } } } } ^ { * } { \to } { \underline { { { A } } } } ^ { n }$ 可称作一个哈希函数（hash function）。

哈希函数也称散列函数或杂凑函数，可以将任意长度的输入数据（字符串）打乱、混合、压缩，映射成一个定长的输出字符串，于是创建一个叫做“摘要”的数字“指纹”，使得数据量变小，并将数据的格式固定下来。

虽然广泛地讲，每个 $A ^ { * }$ 到 $A ^ { n }$ 的函数都可以称作哈希函数，但是并非所有这样的函数都是“好”的哈希函数，更不都是适合实际应用的哈希函数。一个好的哈希函数一般要满足以下两个要求:

（a）冲突尽可能少。由于 $\boldsymbol { A } ^ { * }$ 是无限集合，而 $A ^ { n }$ 是有限集合，因此H必定不是单射(定理5.2的推论）。即必定存在不同的自变量产生相同的哈希值（即函数值)，这种现象称为冲突（collision）或碰撞。好的哈希函数应尽可能减少冲突的出现。

（b）散列值应尽可能均匀地分布在整个值域范围内，这样可以减少冲突的发生。

【例5.25】假设 $A = \{ 0 , 1 , 2 , \cdots , 9 \}$ ，则每一个非负整数都可以看作 $\boldsymbol { A } ^ { * }$ 中的一个元素，对于给定的正整数 m，可定义函数f为f(x)=x mod m。则 f是 $\boldsymbol { A } ^ { * }$ 到 $A ^ { n }$ 的哈希函数（不一定是满射)，其中 $n = \left\lceil \log_{10} m \right\rceil$

例如，学生的学号范围取值为20120000至20122999，可取其模1000后的余数作为其哈希值（即学号的末3位）。

【例5.26】 可以取输入数值的平方值的中间若干位作为哈希值。

具体地讲，哈希函数的输入是可变大小（任意长度）的消息m，输出是固定长度（如64比特）的摘要值 $H ( m )$ 。对于密码学中使用的安全哈希函数有如下要求:

• 快速性:已知 m，计算 $H ( m )$ 是容易的。

• 单向性:已知 $c   =   H ( m )$ ，求m在计算上是不可行的。

弱抗碰撞性:对给定的消息 $m _ { 1 }$ ，找到另一个与之不同的消息 $m _ { 2 }$ ，使得 $H ( m _ { 1 } ) = H ( m _ { 2 } )$在计算上是不可行的。

[page:152]

## 152

• 强抗碰撞性:找到两个不同的消息 $m _ { 1 }$ 和 $m _ { 2 }$ ，使得 $H ( m _ { 1 } ) = H ( m _ { 2 } )$ 在计算上是不可行的。

• 敏感性: $c   =   H ( m )$ ，c的每一比特都与m的每一比特相关，并有高度敏感性，即每改变m的一比特，都将对c产生明显影响。

例5.25给出的哈希函数的例子在密码学上是不适用的。

## *5.6 双射函数及集合的势

1638年，伽利略（GalileoGalilei，1564—1642）在《关于两种新科学的对话》中借3个中世纪学者的对话指出:对于每个自然数，都有且只有一个平方数与之对应。于是就产生了一个问题:自然数和自然数的平方哪个多？或者更一般地讲:部分和全体哪个多？当时它不仅困惑了伽利略，也使许多数学家束手无策。

我们已经知道N $\subset   \mathbb { Z }   \subset   \mathbb { Q }   \subset   \mathbb { R }   \subset   \mathbb { C }$ ，那么它们的元素哪个更“多”？还有没有比C元素更多的集合？

1874—1894年间，康托（Cantor，1845—1918）圆满地解决了这个问题，其基本思想是“一一对应”。

定义5.18 假设A和B是两个集合，如果存在A到B的双射，则称集合A与集合B是等势的，记作 $A { \approx } B$ ；或称A和B的基数相等，记作 $| A | { = } | B | .$

【例5.27】由定理5.2，集合 $A { = } \{ a , b , c \}$ 和 $B ^ { = } \{$ 李白，杜甫，白居易}是等势的。

定理5.14 集合族（即集合的集合）上的等势关系是一个等价关系。

证明.设集合族为S，对任意的集合 $A , B { \in } S$ 有

（1）等势关系具有自反性:集合A上的恒等函数 $I _ { A }$ 给出了A到A的双射函数。

（2）等势关系具有对称性:假设 $A { \approx } B$ ，则存在A到B的一个双射函数 $f _ { \circ }$ 于是由定理5.8， $f ^ { - 1 }$ 给出了B到A的双射函数，即 $B { \approx } A$ o

（3）等势关系具有传递性:假设 $A { \approx } B$ 且 $B { \approx } C$ ，即存在A到B的双射函数f、B到C的双射函数 $g$ ，则 $g \circ f$ 给出了A到C的双射函数，即 $A { \approx } C _ { \circ }$ □

如果两个有限集合的元素个数是相同的，由定理5.2，必定存在两个集合之间的双射函数，因此它们一定是等势的；而如果两个有限集合的元素个数是不同的，必定不存在两个集合之间的双射函数，因此它们一定是不等势的。因此对于有限集合，可以按其元素个数划分为不同的等价类。

下面将主要讨论有限集合和无限集合之间的等势关系，以及无限集合之间的等势关系。

定理5.15 有限集合不能与其任意真子集等势。

证明. 设B为有限集合A的真子集，则有 $| A | { \geq } | B |$ 。由定理5.2，不存在集合B到集合A的双射函数，故A与B不等势。 口

【例5.28】自然数集 $\mathbb{N} = \{0,   1,   2,   \cdots\}$ 和集合 $\left\{ x ^ { 2 } \mid x \in \mathbb { N } \right\} = \left\{ 0 , 1 , 4 , 9 , \cdots \right\}$ 是等势的，双射函数为 $f(x) = x^{2}$ 。这样就回答了伽利略的问题，也说明有时候部分和全体“一样大”。事

[page:153]

## 第5章 函数

实上，可以证明任意无限集合必与其某个真子集等势，而这给出了无限集的本质（与定理5.15比较)，经常用来作为无限集合的定义。

【例5.29】 自然数集N={0,1,2,…}和整数集Z是等势的。双射函数为

$$f \colon \mathbb{N} \to \mathbb{Z}, f(n) = \left\{ \begin{aligned} -\frac{1 + n}{2}, & \quad  当  n  是奇数 , \\ \frac{n}{2}, & \quad  当  n  是偶数 . \end{aligned} \right.$$

【例5.30】自然数集N={0,1,2,…}和集合N×N是等势的。

如图5-8所示，将N×N中元素排成一个二维表格，而后沿箭头方向建立N×N和N的一一对应关系: $f(x,y)=\frac{(x+y)(x+y+1)}{2}+y$

【例 5.31】 对于任意的实数a、b，a<b，开区间(0，1)与(a， b)是等势的。双射函数为 $f(x) = (b - a)x + a$

类似地，可以证明对于任意的实数 $a 、 b 、 a < b$ ，闭区间[0,1]与 $[ a , b ]$ 是等势的。

【例5.32】开区间(0,1)与闭区间[0,1]是等势的。主要是处理端点0、1的对应，选择一个无限序列 $\frac{1}{2}, \frac{1}{2^2}, \frac{1}{2^3}, \frac{1}{2^4}, \cdots$ ，建立以下对应关系:

$$\begin{array}{ccccc}0 & 1 & \dfrac{1}{2} & \dfrac{1}{2^{2}} & \cdots & \dfrac{1}{2^{i}} & \cdots \\\downarrow & \downarrow & \downarrow & \downarrow & \cdots & \downarrow & \cdots \\\dfrac{1}{2} & \dfrac{1}{2^{2}} & \dfrac{1}{2^{3}} & \dfrac{1}{2^{4}} & \cdots & \dfrac{1}{2^{i+2}} & \cdots \\\end{array}$$

其他的数对应到自己。具体地讲，双射函数f是

$$f(x)=\left\{\begin{aligned}&\frac{1}{2}, &x&=0 \\&\frac{1}{2^{i+2}}, &x&=\frac{1}{2^i},i&=0,1,2,\cdots \\&x, & 其他 \end{aligned}\right.$$

【例5.33】开区间(0,1)与实数集R是等势的。双射函数为 $f(x) = \tan \frac{(2x - 1)\pi}{2}$

[page:154]

## 154

【例5.34】 开区间(0, 1)与(0, 1)×(0, 1)是等势的。

将每一个实数 $x { \in } ( 0 , 1 )$ 表示成无限小数形式 $x { = } 0 . x _ { 1 } x _ { 2 } \cdots x _ { i } \cdots$ (例如 0.5 可表示成0.4999…，0.781可表示为 0.780999…)。

于是可以建立(0，1)与(0，1)×(0，1)之间的双射: $f(0.x_{1}x_{2}x_{3}x_{4}x_{5}x_{6}\cdots)=0.x_{1}x_{3}x_{5}\cdots$ $0 . x _ { 2 } x _ { 4 } x _ { 6 } { \cdots } )$ ，因此(0,1)与(0, 1)×(0, 1)是等势的。

【例5.35】实数集R与复实数集C是等势的。

由例5.33和例5.34易得实数集R和集合R×R是等势的。而 $\mathbb { C }   \approx   \mathbb { R }   \times   \mathbb { R }$ ，双射函数为 $f(a+bi)=(a,b)$ 。故R $\approx ( 0 ,   1 ) \approx ( 0 ,   1 ) \times ( 0 ,   1 ) \approx$ R×R≈C。

下面的问题是:自然数集 $\mathbb{N} = \{0, 1, 2, \cdots\}$ 和实数集R都是无限集合，它们是否等势？

定理 5.16 自然数集 $\mathbb{N} = \{0, 1, 2, \cdots\}$ 和闭区间[0,1]不等势。

证明. 采用反证法。假设存在一个双射函数 $f . \mathbb { N }   \rightarrow   [ 0 , 1 ]$ ，则[0,1]中的元素必与N中的元素一一对应，那么[0,1]中的元素必可排列成如下的形式:

$$\mathrm{Ran}(f) = [0, 1] = \{x_0, x_1, x_2, x_3, \cdots\}$$

设每个 $x _ { i }$ 的小数形式是 $0 . a _ { i 0 } a _ { i 1 } a _ { i 2 } { \cdots } a _ { i j } { \cdots }$ ，且 $a _ { i j }   \in   \{ 0 , 1 , 2 , \cdots , 9 \}$ 。则有

$$\begin{array}{c}f(0) {=} x_{0} {=} 0. a_{00} a_{01} a_{02} \cdots a_{0j} \cdots \\f(1) {=} x_{1} {=} 0. a_{10} a_{11} a_{12} \cdots a_{1j} \cdots \\f(2) {=} x_{2} {=} 0. a_{20} a_{21} a_{22} \cdots a_{2j} \cdots \\\vdots \\f(i) {=} x_{i} {=} 0. a_{i0} a_{i1} a_{i2} \cdots a_{ij} \cdots \\\vdots\end{array}$$

由于f是双射，因此任一[0,1]中的实数均应出现在上表中的某一行。

下面按照对角线构造一个新的小数 $x^{*} = 0.a_{00}^{*}a_{11}^{*}a_{22}^{*}a_{33}^{*}\cdots a_{ii}^{*}\cdots$ ，使得 $a_{ii}^{*} \neq a_{ii} \quad (i = 0, 1, 2, \cdots$ $n , \cdots )$ 且 $a _ { i i } ^ { * } \neq 9$ (这是为了避免出现0.79999999…等类似情况)。那么显然有 $x ^ { * }   \in   [ 0 ,   1 ]$而 $x ^ { * }$ 又不在上表中，这是因为 $x ^ { * }$ 与上表中任一项都至少存在一位不同。因此f不可能是满射，更不可能是双射。 口

结合例5.32、例5.33和定理5.16的结果，可以得到如下推论。

推论（康托定理，1890年）自然数集N={0,1,2,...}和实数集R不等势。

对于不等势的集合，有如下定义

定义5.19 假设A和B是两个集合。

（a）如果存在A到B的单射，则称集合A劣势于集合B，记作 $A   \leqslant   B$ ；或称A的基数小于等于B的基数，记作 $| A |   \leqslant   | B |$

(b)如果存在A到B的单射，但不存在A到B的双射，则称集合A严格劣势于集合B，记作A<B；或称A的基数小于B的基数，记作 $| A | { < } | B |$

定义5.20 与自然数集合或其子集等势的集合称为可数（countable）集合或可列集合，自然数集合的基数记为 $\aleph _ { 0 } ($ 读作阿列夫零)；否则称作不可数（uncountable）集合或不可列集合。换言之，设A是集合，若 $| A | \leqslant \aleph _ { 0 }$ ，则称A为可数集或可列集。

定义5.21 全体实数构成的集合R是不可数的，其基数称作连续统（continuum）。

【例5.36】集合 $A=\left\{1,3,5,\cdots,2n-1,\cdots\right\},B=\left\{1,4,9,16\right\}$ 都是可数集；而开区间(0,1)、

[page:155]

## 第5章 函数

闭区间[0,1]都是不可数集合。

以下不加证明地给出两个重要结果。

定理 5.17 (策梅罗(Zermelo)定理)设 A、B 为任意两个集合，其基数的关系必符合以下3条之一:

(a) $| A | { \leq } | B |$

(b) $| A | { \geq } | B | .$ 0

(c) $| A | { = } | B |$ 0

定理5.18（康托-伯恩斯坦-施罗德（Cantor-Bernstein-Schroeder）定理）设A，B为任意两个集合，若有 $| A | \leq | B |$ 且 $| B | \leq | A |$ ，则有|A|=|B|。

由定理5.17可以得到如下结论。

定理5.19 $\mathbb { Q } \approx \mathbb { N }$ 0

证明.（1） $f(x) = x$ 给出了N到Q的单射函数，因此N $\lesssim \mathbb { Q }$

(2) 由N $\approx   \mathbb { Z }$ ，容易证明N $[ \times \mathbb { N }   \approx   \mathbb { Z }   \times   \mathbb { N } ]$ 。构造单射函数 $f ,$ 其将0映到(0,0)，将非零有理数 $\frac{b}{a}$ （其中 b∈Z，a∈， $\mathrm{GCD}(a,b)=1$ 映到 $( b , a )$ ，因此 $\mathbb { Q } \leqslant \mathbb { Z } \times \mathbb { N }$

由（1）、（2）和例5.30可得 $\mathbb { Q }   \approx   \mathbb { N }$ 0

定理5.20（康托定理，1890年）设A为一个集合， $\mathcal { P } ( A )$ 为A的幂集，则有 $| A | < | { \mathcal { P } } ( A ) |$

证明. 对任一函数 $g \colon { \mathcal { A } } { \rightarrow } { \mathcal { \bar { P } } } \left( { \mathcal { A } } \right)$ ，构造集合 $B = \{ x | x \in A$ 且 $x { \not \in } g ( x ) \}$ 。显然有 $B { \subseteq } A$ ，即$B   \in   \mathcal { P } ( A )$ 0

对任意的 $x { \in } A ,$ 若 $x { \in } B$ 则 $x { \boldsymbol { \mathrm { \pounds } } } \mathbf { g } ( x )$ ，因此 $B { \neq } g ( x )$ 。这说明 $B \not \in \mathrm { R a n } ( g )$ ，即g不是满射，当然也不是双射。因此不存在双射函数 $g : A \to { \mathcal { H } } ( A )$ 0 □

此定理说明不存在最大基数。

对于自然数集合N，其幂集的基数有何特点呢？

定理5.21 |(N)|=|R|。

由例 5.28 至例 5.35 及定理 5.20、定理5.21 可得到如下结论:

$\mathbb { N } \times \mathbb { N } \approx \mathbb { Q } \approx \mathbb { Z } \approx \mathbb { N } < \tilde { \mathcal { H } } ( \mathbb { N } ) \approx \mathbb { R } \approx [ a ,   b ] \approx ( a ,   b ) \approx \mathbb { C }$ (其中 a、b 为任意实数， $a < b$ 。

1878年，康托猜测:不存在一个集合，其基数在自然数集的基数和连续统之间，即不存在集合A使得 $\mathbf { N } _ { 0 } < | A | < |$ R|，这就是著名的连续统假设（continuum hypothesis)。在1900年第二届国际数学家大会上，大卫·希尔伯特（DavidHilbert，1862—1943）把康托尔的连续统假设列入20世纪有待解决的23个重要数学问题之首，因此它又被称为希尔伯特第一问题。

1938年哥德尔（Kurt Gödel，1906—1978）证明了连续统假设与目前使用的公理化集合论体系（Zermelo-Fraenkel set theory with the axiom of choice，ZFC）不矛盾，即不能在 ZFC 中被证伪；1963年科恩（Paul Joseph Cohen，1934—2007）证明连续假设和 ZFC是彼此独立的，即连续统假设不能在ZFC公理系统内证明其正确性与否。

[page:156]

## 离散数学及应用（第2版）

## 习题5

5.1 判断以下哪些A={1,2,3,4}上的关系构成函数。

(a) $R = \left\{ (x,y) \mid x \in A, y \in A, y + x < 7 \right\}$ 0

(b) $R = \left\{ (x,y) \mid x \in A, y \in A, x^2 + y^2 \leqslant 20 \right\}.$ 0

(c) $R = \{ (x,y) \mid x \in A, y \in A, y = x^2 \}$ 0

(d) $R = \{ (x,y) \mid x \in A, y \in A, x = y^2 \}$ o

5.2 判断以下哪些 $A { = } \{ a , b , c \}$ 上的关系构成函数，哪些构成A上的函数。

(a) $R {=} \{ (a,b), (a,c), (b,b), (b,a) \} 。$ O

(b) $R { = } \{ ( a , b ) , ( b , b ) \}$ 0

(c) $R { = } \{ ( a , b ) , ( b , b ) , ( c , c ) \}$ 0

5.3 判断以下哪些关系f是A到B的函数。

(a) $A = B = \mathbb{R} , x f y$ 当且仅当 $x ^ { 2 } { = } y ^ { 2 } .$ 0

(b) $A = B = \mathbb{R} , x f y$ 当且仅当 $x ^ { 3 } { = } y ^ { 3 } .$

(c) $A = B = \mathbb{C} , \left( a + b \mathrm{i} \right) f \left( c + d \mathrm{i} \right)$ 当且仅当 $a = c$

5.4 假设f和g都是集合A到集合B的函数，证明:f∩g也是A到B的函数。

5.5 将集合A到集合B的所有函数的集合记为 $B ^ { 4 } ,$ ，称为指数集，即 $B^{A} = \left\{ f \mid f; A \to B \right\}$如果设A、B都是有限集合， $|A|=m,\ |B|=n$ ，请计算 $| B ^ { 4 } |$

5.6设 $f \colon \operatorname { \mathbb { Z } } ^ { + }   \to   \operatorname { \mathbb { Z } } ^ { + }$ ，定义为

$f(x)=\left\{\begin{aligned}x/2,\\x+1,\end{aligned}\right.$ 若x为偶数若x为奇数

$A = \{ 0 , 1 \} , B = \{ 2 \}$ ，计算 $f ( A )  、 f ( B )$ 0

5.7设 $f \colon A \to B , B _ { 1 } \subseteq B$ ，证明: $f ( A \cap f ^ { - 1 } ( B _ { 1 } ) ) = f ( A ) \cap B _ { 1 }$ 0

5.8 若f是X到Y的函数， $A , B \subseteq X \circ$ 证明: $f(A)-f(B) \subseteq f(A-B)$ C

5.9 设f是从集合X到Y的函数， $f ^ { - 1 }$ 是f作为关系的逆关系。令 $S = \{ f^{-1}(\{y\}) \mid y \in Y \}$ ，证明:S是X的一个划分。

5.10 假设集合 $A { = } \{ a , b , c , d , e , f \}$ 上划分 $\{ \{ a , b , c \} ,   \{ d , e \} ,   \{ f \} \}$ 决定的等价关系为R，计算A/R的典范映射。

5.11 （a）给出一个 $\cdot \mathbb { Z } ^ { + }$ 到 $\mathbb { Z } ^ { + }$ 的既非单射又非满射的函数的例子。

(b）给出一个 $\mathbb { Z } ^ { + }$ 到 $\mathbb { Z } ^ { + }$ 的是单射但不是满射的函数的例子。

（c）给出一个 $\mathbb { Z } ^ { + }$ 到Z⁺的非单射但是是满射的函数的例子。

(d)给出一个 $\mathbb { Z } ^ { + }$ 到Z⁺的既是单射又是满射的函数的例子。

5.12 判断下面的函数是否为单射、满射、双射？为什么？

(a) $f \colon \mathbb{Z}^{+} \to \mathbb{R} , f(x) = \ln x$

(b) $f \colon \mathbb { R } \to \mathbb { R } , f _ { \bar { \bar { \bar { \bar { \bar { \bar { \bar { \bar { \bar { \bar { \bar { \bar { \bar { \bar { } } } } } } } } } } } } } } } = | x | .$

(c) $f \colon \mathbb { R } ^ { + } \to \mathbb { R } ^ { + } , f ( x ) = ( x ^ { 2 } + 1 ) / x$ ，其中R+为正实数集。

(d) $f:\ \mathbb{N} \times \mathbb{N} \rightarrow \mathbb{N}\ , \quad f(x,y)=x+y+1$ 0

[page:157]

## 第5章 函数

(e) $f:\ \mathbb{N} \times \mathbb{N} \rightarrow \mathbb{N} \times \mathbb{N},\ f(x,y)=(x+y,x-y)$

5.13 证明函数 $\mathcal { [ } f \colon \operatorname { \mathbb { Z } } ^ { + }   \times   \operatorname { \mathbb { Z } } ^ { + }$ →Z+是双射，其中 $f(m,n)=(m+n-2)(m+n-1)/2+m$

5.14 证明定理 5.1。

5.15 证明定理 5.2。

5.16 假设A和B 是两个有限集，函数f: A→B，证明:

（a）若f是单射，则 $|A| \leq |B|$

（b）若f是满射，则 $| B | \leq | A | .$

5.17 对于任意 $a   \in \mathbb { R }$ ，定义函数 $f(a)=\{x|x\in$ R且 $x   \leqslant   a   \}$ ，证明:f是R到(R)的单射，且当 $a { \leqslant } b$ 时， $f ( a ) { \subseteq } f ( b )$ o

5.18 设A 是有限集合， $f .   A   \rightarrow   A$ ，证明:

（a）若有自然数 $n   \geq   1$ 使得 $f ^ { n } { = } 1 _ { A }$ ，则f为双射。

（b）若f为双射，则有自然数 $n   \geq   1$ 使得 $f ^ { n } { = } 1 _ { A ^ { \circ } }$

5.19 设A、B都是有限集合， $|A|=m,\ |B|=n$ ，请计算集合A到集合B的所有单射函数的个数。

5.20 设A、B都是有限集合， $|A| = |B| = n$ ，请计算集合A到集合B的所有双射函数的个数。

5.21 设A 是集合，对于 $a   \in   A$ ，定义从A到A的函数到A的计值函数 $E _ { a }$ 为 $E_{a}(f) = f(a)$

(a) $E _ { a }$ 是单射么？证明你的结论。

(b) $E _ { a }$ 是满射么？证明你的结论。

5.22 假设有函数 $f : A { \rightarrow } B , g : C { \rightarrow } D .$

(a) $A { \times } C$ 到 B×D 的关系 $f \times g$ 定义为 $f \times g((x, y)) = (f(x), g(y))$ ，证明: $f \times g$ 是 $A { \times } C$ 到$B   \times   D$ 的函数。

（b）证明:若f和g都是单射，则f×g也是单射。

（c）证明:若f和g都是满射，则f×g也是满射。

（d）证明:若f和g都是双射，则 $f \times g$ 也是双射。

5.23 假设f: A→B，C, D⊆A。

（a）证明: $f(C \cap D) \subseteq f(C) \cap f(D)$ 0

（b）举例说明 $f(C \cap D) = f(C) \cap f(D)$ 不是永真的。

（c）说明对于什么函数上述等式为真。

5.24 对于以下集合A和B，构造从A到B的双射函数。

（a）A=(0,1)，B=(5,25)（二者都是实数集上的开区间）。

(b) $A = \{ a , b , c \} , B = \{$ 张三，李四，王五}。

(c) A=R, $B   =   \mathbb { R } ^ { + }$

5.25 设 a、b、m为整数，其中 m>1。证明:

$$E(i)=(ai+b)\bmod{m}$$

是{1,2, …, m-1}上的双射函数当且仅当 a 与 m 互素。

5.26 假设 $f { = } \{ ( a , \alpha ) , ( b , \alpha ) , ( c , \beta ) \} , \quad g { = } \{ ( \alpha , 0 ) , ( \beta , 1 ) \}$ ，计算 $g \circ f \circ$

5.27 设函数f: R→R 定义为 $f(x) = \sin(x)$ ，g: R→R定义为 $g(x) = x^{3} - 1$ ，h: R →R 定义为 $h(x) = 2^{x}$ ，计算 $g \circ f ( x )  、 f \circ g ( x )  、 h \circ g \circ f ( x )$ 0

[page:158]

## 158

5.28 设函数 f: R → R 定义为 f (x)=256 x，g: R → R 定义为 $g ( x ) { = } 2 ^ { x }$ ，h: R → R 定义为$h(x) = x^{3}$ ，计算 $g \circ f ( x )  、 f \circ g ( x )  、 h \circ g \circ f ( x )$

5.29 设函数f: R →R， $f(x)=\left\{\begin{aligned}x^{2}, \quad & x \geqslant 3 \\-2, \quad & x<3\end{aligned}\right.$ ; g: R →R , $g(x) = x + 2$ 。计算 $f ^ { \circ } g$ 和 $g \circ f \circ$

5.30 设函数f:R →R， $f(x)=\begin{cases}0, & x>1 \\x^{2}, & x\leqslant 1\end{cases};$ ;g: R→R，g(x)= x−2。计算 $f ^ { \circ } g$ 和 g°f。

5.31 设 $f \colon \mathbb { Z } ^ { + }   \to   \mathbb { Z } ^ { + }$ ，定义为

$$f(x)=\left\{\begin{aligned}x/2, \quad  若  x  为偶数 , \\x+1, \quad  若  x  为奇数 .\end{aligned}\right.$$

计算 $f^{4}(15) 、 f^{6}(65)$ 0

5.32 假设有两个 $\mathbb { Z } ^ { + }$ 到 $\mathbb { Z } ^ { + }$ 的函数:f(n)=n+1，g(n)=max(1,n−1)，证明:

（a）f是单射而不是满射。

（b）g是满射而不是单射。

(c) $\mathrm { g o f { \mathrm { ^ { \mathrm { \textleftarrow } } } 1 } _ { z ^ { + } } }$ ，而 $f ^ { \circ } 8 \neq 1 _ { \mathbb { Z } ^ { + } }$

5.33 假设A、B为集合，函数 $f : A \to B , g : B \to A , h : B \to A$ ，且满足 $g \circ f = h \circ f = 1 _ { A } , f \circ g = f \circ h = 1 _ { B }$证明: $\scriptstyle { \mathcal { S } } ^ { = h } \cdot$

5.34 假设A、B、C为集合，函数 $f \colon A { \rightarrow } B , g \colon B { \rightarrow } C$ ，举出满足以下性质的例子。

（a）g°f是单射，而g不是单射。

（b）g°f是满射，而f不是满射。

（c）g°f是双射，而g不是单射且f不是满射。

5.35 设A={1,2,3,4}，求出 A 上所有的可逆函数。

5.36 设函数f:R →R， $f(x)=\left\{\begin{aligned}x^{2},&\quad x\geqslant3\\9,&\quad x<3\end{aligned}\right.$ ; g: R →R , $g(x) = x + 2$ 。如果f和 $g$存在逆函数，则求出它们的逆函数；如果不存在逆函数，请说明理由。

5.37 设函数f: R×R→R×R定义为 $f(x,y)=(x+y,x-y)$

（a）证明:f是双射。

（b）求f的逆函数。

(c)求 $f _ { } ^ { o } f _ { \circ }$

5.38设 $f _ { 1 } , f _ { 2 } , f _ { 3 } \colon \mathbb { Z } ^ { + }   \to   \mathbb { Z } ^ { + }$ 定义为

$$\begin{cases}f_{1}(n) = 2n \\f_{2}(n) = \begin{cases}0, & n = 0  或  n = 1 \\n - 1, & n > 1\end{cases} \\f_{3}(n) = \begin{cases}n - 1, & n \bmod 2 = 0 \\n + 1, & n \bmod 2 = 1\end{cases}\end{cases}$$

分析 $f_{1} 、 f_{2} 、 f_{3}$ 是否为单射、满射、双射，说明 $f_{1} 、 f_{2} 、 f_{3}$ 是否可逆。

5.39 试举出一个例子说明 $f ^ { \circ } f   =   f$ 成立，其中 $f . ~ A { \rightarrow } A$ 且 $$\mathrm { { : } \mathit { f 2 } 1 _ { \mathit { A } } \mathrm { {  。  } } }$$ 若f的逆函数存在，是否还存在满足条件的f?

[page:159]

## 第5章 函数

5.40 设 f: A → B, g : B → C, h : C → A; 若 $h \circ g \circ f = 1_{A}, f \circ h \circ g = 1_{B}, g \circ f \circ h = 1_{C}$证明:f、g、h均为双射。

5.41 假设 U={1, 2, 3, 4, 5, 6, 7, 8}，A={2, 3, 5, 7}，B={1, 2, 4, 8}，计算特征函数 $[ \chi _ { A } ]$ 、XB。用0-1序列表示集合A∩B、A∪B、A-B、À、B、A⊕B。

5.42 证明定理 5.10。

5.43 证明定理 5.11。

5.44 假设A、B、C为非空集合，使用特征函数证明:

(a) $( A \oplus B ) \oplus C = A \oplus ( B \oplus C ) 。$

(b) $A-(B \cup C)=(A-B) \cap (A-C)$ 0

(c) $A \cup (A \cap B) = A$

5.45 计算[2.7]，「-2.7]，「14]，「-14]，「π]。

5.46 计算 $\begin{array}{l}\left[ 2.7 \right] , \left[ -2.7 \right] , \left[ 14 \right] , \left[ -14 \right] , \left[ \pi \right] .\end{array}$

5.47 证明:若n是整数，则 $n = \left\lceil n / 2 \right\rceil + \left\lfloor n / 2 \right\rfloor$ 0

5.48（a）对于哪些实数x、y而言， $\left \lfloor x+y \right \rfloor =\left \lfloor x \right \rfloor +\left \lfloor y \right \rfloor$

（b）对于哪些实数x、y而言， $\left [ x+y \right ] =\left [ x \right ] +\left [ y \right ] ?$

（c）对于哪些实数x、y而言， $\left [ x+y \right ] =\left [ x \right ] +\left [ y \right ] ?$

5.49 证明:对于任一整数 n， $\lfloor n / 2 \rfloor \times \lceil n / 2 \rceil = \lfloor n^2 / 4 \rfloor$ 成立。

5.50 证明:若n是奇数，则 $\left[ n^{2} / 4 \right] = \left( n^{2} + 3 \right) / 4$ 0

5.51 证明:若m是整数而 x非整数，则 $x \parallel m - x \parallel m - 1$ ；若x也是整数，则等于m。

5.52 证明:若x是实数，则 $\left\lfloor x / 2 \right\rfloor / 2 \rfloor = \left\lfloor x / 4 \right\rfloor , \left\lceil \left\lceil x / 2 \right\rceil / 2 \right\rceil = \left\lceil x / 4 \right\rceil$ C

5.53 当 m是正整数时，求 $\sum _ { k = 0 } ^ { m } \left[ { \sqrt { k } } \right]$ 的公式。

5.54 证明:设a、b 是任意两个实数，则

(a) $\lfloor 2a \rfloor \geqslant 2 \lfloor a \rfloor 。$

(b) $\lfloor 2a \rfloor + \lfloor 2b \rfloor \geqslant \lfloor a \rfloor + \lfloor a + b \rfloor + \lfloor b \rfloor.$

(c) $\left| a \right| \perp b  且  a - b  或  \left| a - b \right| + 1 。$

5.55 证明:设a是实数，n是正整数，则

(a) $\left\lfloor \frac{\left\lfloor na \right\rfloor}{n} \right\rfloor  =  \left\lfloor a \right\rfloor \text{。 }$

(b) $\left\lfloor a \right\rfloor + \left\lfloor a + \frac{1}{n} \right\rfloor + \cdots + \left\lfloor a + \frac{n - 1}{n} \right\rfloor = \left\lfloor na \right\rfloor$

5.56 如果 $a _ { n }$ 表示不是完全平方的第n个正整数，证明:

(a) $a _ { n } = n + \left| \sqrt { a _ { n } } \right| ,$ 0

(b) $a_{n}=n+\left\{\sqrt{n}\right\}$ ，其中{x}表示最接近于实数x的整数。

5.57 在7个元素的集合中，共有多少种不同的7阶置换？

[page:160]

## 离散数学及应用（第2版）

5.58 设 A={1, 2, 3, 4, 5, 6}, $\pi_{1} = \begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 \\ 3 & 4 & 1 & 2 & 6 & 5 \end{pmatrix}, \quad \pi_{2} = \begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 \\ 2 & 3 & 1 & 5 & 4 & 6 \end{pmatrix},$ $\pi_{3}=\begin{pmatrix}1&2&3&4&5&6\\6&3&2&5&4&1\end{pmatrix}$ ，计算 $\pi_{1}^{-1} , \quad \pi_{2}^{-1} , \quad \pi_{2} \circ \pi_{1} , \quad \pi_{1} \circ \pi_{2} , \quad (\pi_{1} \circ \pi_{2}) \circ \pi_{3}$ $\pi_{1} \circ \left( \pi_{2} \circ \pi_{3} \right)^{-1}$ C

5.59 证明定理 5.13。

5.60 设 A={1, 2, 3, 4, 5, 6, 7, 8}，计算

(a)(3, 5, 7, 8)°(1, 3, 2)。

(b) (2, 6)°(3, 5, 7, 8)°(2, 5, 3, 4)。

(c) (1, 4)°(2, 4, 5, 6)°(1, 4, 6, 7)。

(d) (5, 8)°(1, 2, 3, 4)°(3, 5, 6, 7)。

5.61 设A={1,2,3,4,5,6,7,8}，将以下的置换写成不相交轮换的复合:

$$\begin{aligned}& (a)  \begin{pmatrix}1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 \\4 & 3 & 2 & 5 & 1 & 8 & 7 & 6 \\\end{pmatrix} 。  \\& (b)  \begin{pmatrix}1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 \\6 & 5 & 7 & 8 & 4 & 3 & 2 & 1 \\\end{pmatrix} 。  \\& (c)  \begin{pmatrix}1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 \\2 & 3 & 4 & 1 & 7 & 6 & 8 & 5 \\\end{pmatrix} 。  \\& (d)  \begin{pmatrix}1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 \\2 & 3 & 1 & 4 & 6 & 7 & 8 & 5 \\\end{pmatrix} 。 \end{aligned}$$

5.62 将(4, 5, 6)°(5, 6, 7)°(6, 7, 1)°(1, 2, 3)°(2, 3, 4)°(3, 4, 5)写成不相交轮换的复合。

5.63 设 A={1, 2, 3, 4, 5, 6}, $\boldsymbol{\pi} = \begin{pmatrix}1 & 2 & 3 & 4 & 5 & 6 \\4 & 3 & 5 & 1 & 2 & 6\end{pmatrix}$

（a）将π写成不相交轮换的复合。

（b）计算 $[ \pi ^ { - 1 } ,$ 0

(c） 计算 $\left[ \mathcal { R } \right. _ { \mathrm { ~ c ~ } } ^ { 2 }$

（d）求π的周期。

5.64 假设有限集合S包含 n 个元素， $\sigma = ( a _ { 1 } , \; a _ { 2 } , \; \cdots , \; a _ { r } )$ 是S的一个轮换， $\tau   \in   \mathbf { S } _ { n } ,$ ，证明:$\tau ^ { \circ } \sigma ^ { \circ } \tau ^ { - 1 } { = } ( \tau ( a _ { 1 } ) , \tau ( a _ { 2 } ) , \cdots , \tau ( a _ { r } ) )$ 0

5.65 假设有限集合S包含 n 个元素， $\boldsymbol{\sigma} = (a_{1}, a_{2}, \cdots, a_{r})$ 是S的一个轮换。

(a) 给出σ的逆 $\sigma ^ { - 1 }$ 4

（b）计算σ的幂 ${ \boldsymbol { \mathrm { ~ \cdot ~ } } } { \boldsymbol { \mathrm { ~ \cdot ~ } } } ^ { n }   .$

（c）计算σ的周期per(σ)。

5.66 若置换π可写成不相交轮换的复合为 $\pi = \sigma _ { 1 } \circ \sigma _ { 2 } \circ \cdots \circ \sigma _ { k }$ ，请计算π的周期per(π)。

5.67 说明例5.25、例5.26给出的哈希函数的例子在密码学上是不适用的。

5.68证明:Z和 $2\mathbb{Z} = \{ 2x | x \in \mathbb{Z} \} = \{ 0, 2, -2, 4, -4, \cdots \}$ 是等势的。

5.69 证明:开区间(0,1)和半开半闭区间[0,1)是等势的。

[page:161]

## 第5章 函数

5.70 证明:实数集R和正实数集 $\mathbb { R } ^ { + }$ 是等势的。

5.71 设A、B、C是任意的集合，证明:

(a) $A { \leqslant } A ;$

(b）若 $A { \leqslant } B$ 且 $B   \leqslant   C ,$ ，则 $A { \leqslant } C _ { \circ }$

5.72 设A、B、C、D是任意的集合，若 $A { \approx } B$ 且 ${ C } { \approx } { D }$ ，证明: $A { \times } C { \approx } B { \times } D$

5.73若 ${ \mathcal { A } } { \subseteq } B { \subseteq } C ,$ 且 $A { \approx } C _ { \circ }$ 证明: $| A | { = } | B | { = } | C | .$ 0

5.74 找出N的3个不同的子集，使得它们都与N等势。

5.75 设A是有限集，B是可数集，证明: $A { \times } B$ 是可数集。

5.76 计算下述集合的基数。

(a) $\{ x , y , z \}$

(b) $\{ x | x { = } n ^ { 1 0 0 }$ 且 $n   \in   \mathbb { N } \}$ o

（c）平面直角坐标系中单位圆上的所有点。

5.77 证明:全体整系数多项式组成的集合是可数集。

5.78 称整系数 n次不可约多项式方程

$$a_{0}x^{n} + a_{1}x^{n - 1} + \cdots + a_{n - 1}x^{1} + a_{n} = 0 \quad (a_{0} \neq 0)$$

的实数根为n次代数数（algebraic integer）。证明:全体代数数组成的集合是可数集。

5.79 通常称不是代数数的实数为超越数（transcendental number）。证明:全体超越数组成的集合是不可数集，而且与R等势。

[page:162]

## 第6章

## 偏序关系

“次序”是我们经常遇到的一种关系，如体育比赛中的排名、姓氏笔画的排序等等，本章即是要研究一类与“次序”有关的重要关系——偏序关系，继而建立元素之间的可比结构。

本章主要介绍偏序关系和偏序集、哈斯图、偏序集中的特殊元素、拓扑排序、格的基本概念和一些特殊的格。

## 6.1 偏序关系和偏序集

## 6.1.1 偏序关系和偏序集的定义与性质

从例4.32、例4.35、例4.36中可以看到实数间的小于或等于关系、整数间的整除关系、集合之间的包含关系都具有类似的性质:自反性、反对称性和传递性。事实上它们都属于同一类特殊关系偏序关系，它和等价关系同为很重要的关系。

定义6.1 假设R是集合A上的关系，如果R是自反的、反对称的和传递的，则称R是A上的一个偏序（partial order）或半序（semi order）关系，一般简记作“≤”或“≥”。集合 A 和偏序关系 R 构成的有序二元组(A, R)称作偏序集（partially ordered set，简记为poset）或半序集（semi ordered set)。

【例6.1】

（a）任意非空集合A上的恒等关系 $I _ { A }$ 是A上的偏序关系。

(b）小于或等于关系、大于或等于关系、整除关系、倍数关系和包含关系也是相应集合上的偏序关系。

（c）设n是正整数， $\mathbf { D } _ { n }$ 是n所有正因子的集合，则 $\mathbf { D } _ { n }$ 上的整除关系“”是一个偏序关系，在本书中将该偏序集记作 $( \mathbf { D } _ { n } , \mathbf { \Lambda } | )$

定理 6.1 假设(A, ≤)是偏序集， $B { \subseteq } A$ ，则 $( B , \leq \mid  _ { B } )$ 也是偏序集。

证明.由定义易得。

定理6.2 若R为A上的偏序关系，则 $R ^ { - 1 }$ 也是A 上的偏序关系，称之为R的对偶(dual)。

证明.由表4.7，如果R是自反的、反对称的和传递的，则 $R ^ { - 1 }$ 也是自反的、反对称的和传递的，即也是一个偏序关系。 □

【例6.2】 实数集R上的小于或等于关系 $\text{" } \leq  \text{" }$ 是偏序关系，其对偶偏序关系为大

[page:163]

## 第6章 偏序关系

于或等于关系“≥”。

定义 6.2 假设(A, R)为偏序集， $a , b   \in   A$ ，如果 a≤b 或 b≤a 成立，则称 a、b 是可比的(comparable)，否则称 a、b是不可比的(incomparable)。

定义 6.3 假设(A, R)为偏序集，如果对于任意 a, b∈A，a、b都是可比的，则称 R为线序（linear order）或全序（total order)，(A, R)称作线序集（linearly ordered set）或全序集（totally ordered set)，也称为链（chain)。

【例6.3】

（a）集合A至少有两个元素时，A上的恒等关系 $I _ { A }$ 不是全序关系。

(b）实数集R上的小于或等于关系是全序关系。

（c）整数集Z上的整除关系不是全序关系，例如2和3就不可比。

(d）集合A至少有两个元素时，P(A)上的包含关系不是全序关系。

由例4.32~4.35中看到，任意集合A的幂集 $P ( A ) .$ 上的真包含关系与包含关系定义类似，但是不是偏序关系；实数上的小于和小于或等于关系定义类似，但也不是偏序关系。事实上，它们属于另一类特殊关系:

定义 6.4 假设R是集合A 上的关系，如果 R是非自反的和传递的，则称R是A上的一个拟序（quasiorder）关系，一般简记作“<”或“>”。

定理6.3 假设R是集合A上的关系，如果R是非自反和传递的，则R一定是非对称的。

证明.（反证法）假设R不是非对称的，则存在 $a ,   b   \in   A$ ，使得 $$\cdot ( a ,$ $b ) { \in } R$$ 且 $( b ,   a ) { \in } R$由R具有传递性则得到 $( a ,   a ) { \in } R ,$ ，与R具有非自反性矛盾。 □

下述定理指明了偏序关系和拟序关系之间的联系。

定理6.4 假设R是集合A上的关系。

（a）如果R是一个拟序关系，那么 $r(R)=R \cup I_{A}$ 是一个偏序关系。

（b）如果R是一个偏序关系，那么 $R { - } I _ { A }$ 是一个拟序关系。

由此，若 ${ \dot { \mathbf { \ell } } } ( A , \leq )$ 为偏序集，则用 $a { < } b$ 表示 $a { \leq } b$ 且 $a \neq b$

定义 6.5 假设(A, ≤)和 $( A ^ { \prime } ,   \leq ^ { \prime } )$ 是两个偏序集，函数f $A { \longrightarrow } A ^ { \prime }$ 是双射，若对于任意 $a _ { z }$ $b   \in   A , \quad a   \leq   b$ 当且仅当 $f _ { } ( a ) \leq f _ { } ( b )$ ，则称f为 $( A , \leq )$ 到 $( A ^ { \prime } , \leq )$ 的一个同构（isomorphism)，此时称 $(A, \leq)  和  (A', \leq')$ 是同构的（isomorphic)。

【例6.4】 函数 $f ( x ) = 2 ^ { x }$ 给出了 $[ ( \mathbb { Z } ^ { + } , \leq )$ 和 $\{ \{ 2 ^ { i }   |   i   \in   \mathbb { Z } ^ { + } \} , \}$ )之间的同构。

【例6.5】 函数f(x)=lnx给出了(R+,≤)和(R,≤)之间的同构。

定理 6.5 假设(A, ≤)和 $( A ^ { \prime } , \leq ^ { \prime } )$ 是两个偏序集，若函数 $f { \colon } A { \longrightarrow } A ^ { \prime }$ 是(A, ≤)到 $( A ^ { \prime } , \leq ^ { \prime } )$ 的一个同构，则 $f ^ { - 1 }$ 是 $( A ^ { \prime } , \leq )$ 到(A,≤)的一个同构。

证明. 由定理 5.8， $f ^ { - 1 }$ 是双射。接下来只需证明对任意c, d∈A'， $c { \leq } d$ 当且仅当 $f ^ { - 1 } ( c )$ $\leq f ^ { - 1 } ( d )$ 0

由定义6.5， $f ^ { - 1 } ( c )   \leq   f ^ { - 1 } ( d )$ 当且仅当 $f ( f ^ { - 1 } ( c ) ) \leq f ( f ^ { - 1 } ( d ) )$ ，即 $c \leq d \mathrm { { } _ { \circ } }$

假设 $f \colon A { \longrightarrow } A ^ { \prime }$ 是偏序集(A,≤)和 $( A ^ { \prime } , \leq )$ 之间的一个同构，B是A的一个子集且 $B' = f(B)$则由同构的定义易得以下定理。

定理6.6（对应原理）如果B中元素满足某性质，该性质与A中的一个或多个元素

[page:164]

## 离散数学及应用（第2版）

相关联，而且这个性质可以只使用关系≤来定义，则B′的元素也必然满足同样的性质，这个性质使用关系≤'来定义。

## 6.1.2 积偏序和字典序

定义 6.6 假设 $(A, \leq_1)  和  (B, \leq_2)$ 是两个偏序集，则可以定义在 $A { \times } B$ 上的偏序关系≤为$( a ,   b )   \leq   ( a ^ { \prime } ,   b ^ { \prime } )$ 当且仅当 $a { \leq } _ { 1 } a ^ { \prime }$ 且 $b   \leq   _ { 2 } b ^ { \prime }$称之为积偏序（product partial order)，记为 $(A \times B, \leq ) = (A, \leq_1) \times (B, \leq_2)$ 0

【例6.6】 $( \mathbf { D } _ { 3 } , \mathbf { \beta } | ) { \times } ( \mathbf { D } _ { 2 } ,$ 1)构成偏序集， $( a , b ) { \leq } ( c , d )$ 当且仅当 $a | c$ 且 $b | d \text{。 }$ 而且 $( \mathbf { D } _ { 3 } , \left| \right) { \times } ( \mathbf { D } _ { 2 }$ D与 $\mathbf { ( D _ { 6 } , }$ 1)同构，双射函数是 $f ( a , b ) { = } a { \times } b$ 0

此外，在集合 $A { \times } B$ 上还有一种常用的偏序定义方式。

定义 6.7 假设 $( A , \leq _ { 1 } )$ 和 $\iota ( B , \leq _ { 2 } )$ 是两个偏序集，则可以在 $A { \times } B$ 上定义偏序关系<为$( a , b )   \prec   ( a ^ { \prime } , b ^ { \prime } )$ 当且仅当 $a { \mathrel { \mathop { \leq } } } _ { 1 } a ^ { \prime }$ ，或者 $a { = } a ^ { \prime } .$ 且 $b   \leq   _ { 2 } b ^ { \prime }$

称之为词典序（lexicographic order）或字典序（dictionary order）。

词典序也可以扩展到 m个集合的笛卡儿积 $A_{1} \times A_{2} \times \cdots \times A_{m}$ 上: $(a_{1}, a_{2}, \cdots, a_{m}) \prec (a_{1}',$ $a _ { 2 } { ' } , \cdots , a _ { m } { ' } )$ 当且仅当

$$\begin{aligned} &a_{1} \text{< } a_{1} \text{', }  或  \\&a_{1} \text{= } a_{1} ' 且 a_{2} \text{< } a_{2} \text{', }  或  \\&a_{1} \text{= } a_{1} ' 且 a_{2} \text{= } a_{2} ' 且 a_{3} \text{< } a_{3} \text{', }  或  \\&\vdots \\&a_{1} \text{= } a_{1} \text{', } a_{2} \text{= } a_{2} \text{', } \cdots \text{, } a_{m-1} \text{= } a_{m-1} ' 且 a_{m} \text{\leq } a_{m} \text{" }\\ \end{aligned}$$

【例6.7】设 $S = \{ \mathrm{a}, \mathrm{b}, \mathrm{c}, \cdots, \mathrm{z} \}$ 为英文字母集合，则有: $\mathtt { b a t }   \prec   \mathtt { c a t }$ , life < line, technologist $\prec \operatorname { t e c h n o l o g i z e } .$ 0

于是在相同长度的英文单词之间可以进行排序，在英文词典中单词bat也的确在单词cat 之前。但是不同长度的单词之间应该如何排序呢？在英文词典上的位置又该如何安排？

如果查阅一本英文词典，会发现:

（1）post 排在 postoffice之前。

（2） apple 排在 theory 之前。

（3）arithmetic 排在 zoo之前。

而这事实上是通过将词典序扩展到 $S ^ { * }$ 上实现的:

假设 $x = a_{1}a_{2}\cdots a_{n}, y = b_{1}b_{2}\cdots b_{m}$ ，且 $k = \min(n, m)$ ，则 $x   \prec   y$ 当且仅当

(1) $(a_{1}, a_{2}, \cdots, a_{n}) = (b_{1}, b_{2}, \cdots, b_{n})$ 且 $n { \leqslant } m$ ，或

(2) $(a_{1}, a_{2}, \cdots, a_{k}) \prec (b_{1}, b_{2}, \cdots, b_{k})$ 且 $(a_{1}, a_{2}, \cdots, a_{k}) \neq (b_{1}, b_{2}, \cdots, b_{k})$ 0

## 6.1.3 哈斯图

偏序关系的关系图具有如下特点。

定理 6.7 假设 $( A , \leq )$ 是偏序集，则在拟序集(A, <)中不存在长度大于1的圈。

证明. 假设在 $( A ,   < ) !$ 中存在长度大于1的道路 $\pi \colon a , \; x _ { 1 } , \; x _ { 2 } , \; \cdots , \; x _ { n - 1 } , \; a$ ，则由定义有

[page:165]

## 第6章 偏序关系

$a<x_{1},\ x_{1}<x_{2},\ x_{2}<x_{3},\ \cdots,\ x_{n-1}<a$ 。由传递性有 $a { \leq } a$ ，即得矛盾。

基于此，可以将偏序关系的关系图简化为哈斯图，其得名于哈斯（Helmut Hasse，1898一1979)，原因主要是哈斯有效地利用了它们，但是哈斯并不是第一个使用它们的人。

由A上R的关系图得到哈斯图的方法如下:

（1）去掉所有顶点的自环，得到拟序关系 $\text{" }<  \text{" }$ 的关系图。

(2)若 $a { < } b$ 且不存在 c使得 $a < c$ 且 $c < b$ ，则在哈斯图中保留有向边 $\mathfrak { l } ( a , b )$ o

（3）重新组织各个顶点的位置，使得各个有向边的方向都朝向上方或斜上方（定理6.7保证可以做到这一点)。

（4）去掉边的箭头，用小圆圈代表集合中的元素。

【例 6.8】 偏序集({1, 2,3,4, 5,6}, )的关系图为图 6.1(a)，其哈斯图的画法如下:

（1）去掉所有顶点的自环（图6.1(b))。

(2）若 $a { < } b$ 且不存在c使得 $a < c$ 且 $c < b$ ，则保留有向边(a, b)（图 6.1(c))。

（3）重新组织各个顶点的位置，使得各个有向边的方向都朝向上方或斜上方(图 6.1(d))。

(4)去掉有向边的箭头，用小圆圈代表集合中的元素，其结果就是({1,2,3,4,5,6},1)的哈斯图（图 6.1(e))。

【例6.9】

(a）集合{1,2, …,12}上整除关系的哈斯图如图6.2(a)所示。

(b）({2, 3,6, 12,24, 36},l)的哈斯图如图6.2(b)所示。

(c）({1,2,3,4}，≤)的哈斯图如图6.2(c)所示。

（d）偏序集 $\mathbf { \dot { \varepsilon } } ( \mathbf { D } _ { 8 } ,$ 1)的哈斯图如图6.2(d)所示。

(e) P $( \{ a , b , c \} ) ,$ 上的包含关系⊂是一个偏序关系，它的哈斯图如图6.2(e)所示。

（f) 偏序集 $( \mathbf { D } _ { 3 0 } , \left. \right| )$ 的哈斯图如图6.2(f)所示。

注意到图6.2(e)和图6.2(f)只有各个点的标号不同，事实上这是因为它们是同构的:同构是 $f(\varnothing)=1,f(\{a\})=2,f(\{b\})=3,f(\{c\})=5,f(\{d \cup B\})=\mathrm{LCM}(f(d),f(B)) 。 (\{1,2,3,4\},\ \leqslant)$

[page:166]

## 离散数学及应用（第2版）

和 $| ( \mathbf { D } _ { 8 } ,$ 1)也是同构的，同构是 $f(m) = 2^{m}$ C

注:哈斯图只是表示有限偏序集的一种工具，例如无限偏序集(R，≤),(C,≤)就不能使用哈斯图表示。

【例6.10】 已知偏序集(A, R)的哈斯图为图6.3，试求关系 R的关系矩阵。

解.从位置最高的点开始画起，逐步“降低”，最终得到关系矩阵。

$$\boldsymbol{M}_{R}=\begin{pmatrix}1 & 0 & 0 & 1 & 1 & 1 & 1 & 1 \\0 & 1 & 0 & 1 & 1 & 1 & 1 & 1 \\0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\0 & 0 & 0 & 1 & 0 & 1 & 1 & 1 \\0 & 0 & 0 & 0 & 1 & 0 & 1 & 1 \\0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\0 & 0 & 0 & 0 & 0 & 0 & 1 & 1 \\0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 \\\end{pmatrix}$$

## 6.2 偏序集中的特殊元素

## 6.2.1 偏序集中的特殊元素

定义 6.8 假设(A, ≤)为偏序集。

(a)如果存在 $x { \in } A$ ，并且不存在 $a   \in   A$ ，使得 $x { \leq } a$ ，则称x为 $( A , \leq )$ 的极大元（maximal element)。

(b)如果存在 $x { \in } A$ ，并且不存在 $a   \in   A$ ，使得 $a { \leq } x$ ，则称x为 $( A , \leq )$ 的极小元（minimal

[page:167]

## 第6章 偏序关系

element)。

(c）如果存在x∈A，使得任意a∈A都满足a≤x，则称x为 $( A ,   \leq )$ 的最大元（greatest element 或maximum element)，常记作 I或1，称作幺元（unit element)。

（d）如果存在x∈A，使得任意 a∈A 都满足x≤a，则称x为 $(A,   \leq)  的$ 最小元（least element或 minimum element)，常记作 O或 0，称作零元（zero element)

简言之，假设（A,≤）为偏序集，则

x∈A 是(A, ≤)的极大元: $\forall a \left( a \in A \land x \leq a \Rightarrow a = x \right)$

x∈A 是(A, ≤)的极小元: $\forall a \left( a \in A \land a \leq x \Rightarrow a = x \right)$

x∈A 是(A, ≤)的最大元: $\forall a \left( a \in A \Rightarrow a \leq x \right)$

x∈A 是(A, ≤)的最小元: $\forall a \left( a \in A \Rightarrow x \leq a \right)$

【例 6.11】 设偏序集的哈斯图由图6.4(a)表示，则其极大元是c、f、h，极小元是a、b、c，没有最大元，没有最小元。

【例6.12】 偏序集 $\iota ( P ( \{ a , b , c \} ) , \subseteq )$ （见图6.4 (b)）中，极大元是 $\{ a , b , c \}$ ，极小元是∅，最大元是 $\{ a , b , c \}$ ，最小元是∅。

【例6.13】 偏序集({1,2,…,12}，)（见图6.4(c)）中，极大元是7、8、9、10、11、12，极小元是1，没有最大元，最小元是1。

注:有时候，极大元/极小元只有一个（如例6.12)；有时，极大元/极小元也可能存在多个（如例6.11）。孤立结点既是极小元也是极大元（如例6.11）。对于无限偏序集，可能不存在极小元和极大元，例如 $( \mathbb { Z }   ,   \leq )$ ；但对于有限偏序集，必定存在极小元和极大元。

定理6.8 假设(A,≤)为有限偏序集，则A中一定存在极大元（极小元)。

证明.令a为集合A中任一元素。

若a不是极大元，则由定义存在 $a _ { 1 } { \in } A$ 使得 $a { \leq } a _ { 1 }$

若 $a _ { 1 }$ 不是极大元，则由定义存在 $a _ { 2 } { \in } A$ 使得 $a _ { 1 } { \leq } a _ { 2 } .$ C

由于A是有限集，因此上述过程不能无限地进行下去，在该过程终止时，会得到

$$a \leq a_{1} \leq a_{2} \cdots \leq a_{k-1} \leq a_{k}$$

$a _ { k }$ 就是(A,≤)的一个极大元。

类似地可证明，A中一定存在极小元。

从哈斯图来看，极大元不存在“更高”的元素，极小元不存在“更低”的元素；最大元

[page:168]

## 离散数学及应用（第2版）

是比其他所有元素都“高”的元素，最小元是比其他所有元素都“低”的元素。

从例6.11~例6.13来看，最大(小)元可能不存在，也可能存在一个，但没有出现有多个最大(小)元的情况。事实上，有以下定理。

定理 6.9 任何一个偏序集 $\mathbf { : } ( A , \leq )$ 中最多只有一个最大元(最小元)。

证明. 设 a、b 都是 $\left| ( A , \leq ) \right.$ 的最大元，则由最大元的定义有 $b { \leq } a$ 且 $a { \leq } b$ ，而≤具有反对称性，故 $a { = } b$ ，即 $( A ,   \leq )$ 最大元若存在则必唯一。同理可以证明 $( A ,   \leq )$ 最小元若存在则必唯一。 □

定义 6.9 假设 $\mathbf { . } ( A , \leq )$ 为偏序集， $B { \subset } A$ ，则

（a）如有 $x { \in } A$ ，对于B 的任意元素b，都满足 $b { \leq } x$ ，则称x为B的上界（upper bound)。

（b）如有 $x { \in } A$ ，对于 B 的任意元素b，都满足 $x { \leq } b$ ，则称x为B的下界（lower bound)。

（c）假设元素x是集合B的上界，如果对于B的所有上界a都有 $x { \leq } a$ ，则称x为B的最小上界或上确界（least upper bound)，记作 LUB(B)。

(d）假设元素x是集合B的下界，如果对于B的所有下界a都有 $a { \leq } x$ ，则称x为B的最大下界或下确界（greatest lower bound)，记作 GLB(B)

简言之，假设 $( A , \leq )$ 为偏序集，且 $B { \subseteq } A$ ，则

$x { \in } A$ 是B的上界: $\forall b \left( b \in B \Rightarrow b \leq x \right)$

x∈A 是 B 的下界: $\forall b \left( b \in B \Rightarrow x \leq b \right)$

x∈A 是 B的上确界: $\forall a \left( a { \in } A \land \forall b ( b { \in } B \Rightarrow b { \leq } a ) \Rightarrow x { \leq } a \right)$

x∈A 是 B 的下确界: $\forall a \left( a \in A \land \forall b ( b \in B \Rightarrow a \leq b ) \Rightarrow a \leq x \right).$

【例6.14】 设集合{1,2,…,12}上的整除关系的哈斯图由图6.5(a)表示，则

(a）集合 $B_{1} = \{ 2, 3, 6 \}$ 的上界是6、12，下界是1，上确界是6，下确界是1。

(b）集合 $B_{2} = \{ 4,   6,   10 \}$ 不存在上界和上确界，下界是1、2，下确界是2。

【例6.15】设偏序集的哈斯图由图6.5(b)表示，则

（a）集合 $B _ { 1 } { = } \{ d , g , f \}$ 不存在上界和上确界，下界是a、b、d，下确界是d。

(b）集合 $B _ { 2 } = \{ d , e \}$ 的上界是g、h，下界是a、b，上确界是g，不存在下确界。

注:从上面两个例子中可以看到，即使对于有限偏序集，

（a）上（下）界、上（下）确界不一定存在，而且如果存在也不一定属于B。

（b）上（下）界若存在也不一定唯一，但上（下）确界如果存在则唯一。

[page:169]

## 第6章 偏序关系

定理6.10 假设(A,≤)为偏序集，B⊆A，则B的上(下)确界若存在则必定唯一。

直观地讲，在哈斯图中，若某点x“向下走”可达到B中每一元素，则x是B的一个上界，所有上界中位置“最低”的为B的上确界；若某点x“向上走”可达到B中每一元素，则x是B的一个下界，所有下界中位置“最高”的为B的下确界。

假设(A, ≤)为偏序集，B⊆A，则可以将之前的讨论总结如表6.1所示。

表6.1 偏序集中的特殊元素的存在性和唯一性<table><tr><td>特殊元素</td><td>存在性</td><td>唯一性</td><td>备注</td></tr><tr><td>极大元/极小元</td><td>可能不存在；但若A是有限集则一定存在</td><td>可能不唯</td><td></td></tr><tr><td>最大元/最小元</td><td>即使存在极大元/极小元也可能不存在最大元/最小元</td><td>若存在必定唯</td><td></td></tr><tr><td>B的上界/下界</td><td>可能不存在</td><td>可能不唯</td><td>若存在也可能不属于B</td></tr><tr><td>B的上确界/下确界</td><td>即使存在上界/下界也可能不存在上确界/下确界</td><td>若存在必定唯</td><td>若存在也可能不属于B</td></tr></table>

由对应原理（定理6.6）可得以下定理。

定理 6.11 假设偏序集(A, ≤)和(A', ≤')在函数f: A→A'作用下同构，则

(a）若a是(A,≤)的极大元（极小元)，则f(a)是 $( A ^ { \prime } , \leq )$ 的极大元（极小元）。

(b）若a是(A, ≤)的最大元（最小元)，则f(a)是(A', ≤')的最大元（最小元)。

(c）设B是A的一个子集，若α是B的上界（下界、上确界、下确界)，则 f(a)是f(B)的上界（下界、上确界、下确界）。

(d）如果(A,≤)的每个子集都存在上确界（下确界)，则(A',≤)的每个子集也都存在上确界（下确界）。

定理 6.12 设(A, ≤)为偏序集，(A, ≥)是其对偶，则

(a）若a是(A,≤)的极大元（极小元、最大元、最小元)，则a是(A,≥)的极小元（极大元、最小元、最大元)。

(b）设B⊆A，若a在(A，≤)下是B的上界（下界、上确界、下确界)，则a在(A，≥)下是B的下界（上界、下确界、上确界）。

## 6.2.2 拓扑排序

下面考虑一个实际问题。小方准备组织一次演讲比赛，有如下环节（未排序）:

（a）购买奖品和装饰物； （b）申请经费；

（c）确定地点； （d）进行彩排；

（e）确定参赛人员； (f)确定主题；

（g）借服装； （h）开始现场比赛；

（i）确定时间； （j）确定嘉宾。

但是要满足以下限制条件:

（1）确定演讲主题之后才能确定演讲比赛的时间。

[page:170]

## 170

（2）确定主题之后才能准备申请经费。

（3）在确定选手是否能参加之前先要确定比赛时间。

（4）购买何种装饰物须由比赛地点确定。

（5）只有当选手确定之后，才能借服装、租场地和确定要邀请的嘉宾。

（6）如果申请经费没有成功，那么不能购买奖品和装饰品。

（7）在彩排之前需要借服装和确定地点。

（8）比赛只有当嘉宾都邀请成功、已购买奖品而且彩排过才能进行。

于是，各个环节及其先后关系可以表示为图6.6(a)，如果忽略向上或向斜上的箭头，则得到一个偏序关系 R的哈斯图（图 6.6(b))。

但是小方每次只能做一件事，而且做事的先后顺序要受到前述诸约束。因此需要求一个全序关系R'，使得若 $$\mathsf { i } ( a , \thinspace b ) { \in } R \mathsf { , }$$ ，则有 $[ a ,   b ) { \in } R ^ { \prime }$

定义 6.10 假设(A, ≤)是偏序集，对其进行拓扑排序（topological sorting）是指将其扩张成一个全序集(A，<)，使得 $\leqq \leqq \prec$ ，即对于任意 $a , b   \in   A$ ，若a≤b 则 $a   \prec   b$

注:有时也将A的元素在<意义下“从小到大”逐一列出所形成的序列称作 $\mathfrak { i } ( A ,   \leq )$的一个拓扑排序。

【例 6.16】 设 $R { = } \{ ( a , b ) , ( a , c ) , ( a , a ) , ( b , b ) , ( c , c ) \}$ 是集合 $A { = } \{ a , b , c \}$ 上的偏序关序，则 $a , b , c$ 和 $a , c , b$ 都是(A,R)的拓扑排序，这也说明一般情况下可行的拓扑排序不唯一。

拓扑排序的算法为:

拓扑排序 TopologicalSorting((A, R))

输入:偏序集(A, R)

输出:A的元素在<意义下“从小到大”逐一列出所形成的序列

1. B←A, S←R, List←Λ
2. While |B|>0 do
2.1. 从 B 中选择一个极小元 x加入队列 List
2.2. B←B-{x}
2.3. S←S|B
3. Return List

由于A是有限集合，因此步骤2.1一定可以实行；另一方面，每次执行步骤2.2都

[page:171]

## 第6章 偏序关系

使得|B减少1，故而算法一定会终止。

回到小方组织演讲比赛的问题，其拓扑排序之一即是 $f , b , i , e , c , a , g , j , d , h$

## 6.3 格与布尔代数

## 6.3.1 格的定义

设(A，≤)为偏序集，B是A的一个有限子集，从6.2.1节可以看到，B的上确界、下确界并不一定存在；而当A的任一个有限子集B都存在上确界、下确界时，称这种特殊的偏序集 $\cdot ( A , \leq )$ 为格。

定义 6.11 假设 $( L , \leq )$ 为偏序集，如果对于任意 $a ,   b { \in } L , \quad \{ a ,   b \}$ 都存在上确界和下确界，则称 $( L , \leq )$ 为一个格(lattice)。将 $\operatorname { L U B } ( \{ a , b \} )$ 记作 $a   \sqrt { b }$ ，称之为 a与 b的并 $( \mathbf { j o i n } ) ;$将 $\operatorname { G L B } ( \{ a , b \} )$ 记作 $a \triangle b$ ，称之为 a与 b的交（meet)。

注:这里的√和∧符号只代表格中的二元运算，而不再有其他的含义，要与逻辑运算中的析取联结词和合取联结词区分开。

定理 6.13 假设 $( L , \leq )$ 是一个格，则L的任一个有限子集B都存在上确界、下确界。【例6.17】

（a）任一全序集 $\mathbf { : } ( A , \leq )$ 都是一个格。事实上，对于任意 $a , b   \in   A$ ，有 $a { \leq } b$ 或 $b { \leq } a$ 成立；不妨设 $a { \leq } b$ ，则 $a \lor b = b, \quad a \land b = a$ o

(b) $( \mathbb { Z } ^ { + } , | )$ 是一个格。对于任意 $x,y \in \mathbb{Z}^{+}, x \vee y = \mathrm{LCM}(x,y), x \wedge y = \mathrm{GCD}(x,y).$

（c）设n是正整数，则 $\left( \mathbf { D } _ { n } , \right.$ )构成一个格。对于任意 $x, y \in \mathbf{D}_{n}, x \lor y = \operatorname{LCM}(x, y)$ $x \wedge$ $y { = } \mathrm { G C D } ( x , y )$ o

（d）设S是集合，则 $( P ( S ) , \subseteq )$ 是格。对任意 $A , B { \in } { \mathcal { P } } ( S )$ $A \lor B = A \cup B$ $A \land B = A \cap B$

（e）设S是集合且元素数大于1，则S上的恒等关系 $I _ { S }$ 是偏序关系，但是 $( S , I _ { S } ) .$ 不是格。

【例6.18】判断图6.7中的哈斯图表示的偏序集是否构成格，并说明理由。

[page:172]

## 172

解.

（a）和（b）是格。

(c） 不是格 $\{ h , f \}$ 没有上确界，事实上集合元素数多于1且存在孤立结点的偏序集一定不是格。

（d）不是格——{9,10}没有上确界。

(e）不是格——{2,3}没有下确界，{24,36}没有上确界。

定义6.12 设f是含有格中元素以及符号=、≥、≤、∨和∧的命题。令f*是将f中的≥替换成≤、≤替换成≥、∨替换成∧、∧替换成∨所得到的命题，则称f*为f的对偶命题

【例6.19】 在格中令f是 $(a \lor b) \land c \leq c,$ f*是 $(a \land b) \lor c \geq c$ ，则 $f _ { 1 }$ 与 $f ^ { * }$ 互为对偶命题。

定理6.14（格的对偶原理）设f是含有格中元素以及符号=、≥、≤、√和∧的命题，若f对一切格为真，则f的对偶命题f*也对一切格为真。

证明. 事实上，命题f*对格(L, ≤)为真当且仅当f对格 $( L , \geq )$ 为真，因为二者的形式是完全相同的。 口

【例6.20】对一切格L，命题“对任意 $a,   b \in L,   a \land b \leq a$ 都为真。根据对偶原理，对一切格L，命题“对任意 $a,   b \in L,   a \lor b \geq a$ 也为真。

定理6.15（格的保序性）假设 $( L , \leq )$ 为格，则对于任意 $a , b , c   \in   L$ 都有

（a）若 $a { \leq } b$ 则

$$a \lor c \leq b \lor c, a \land c \leq b \land c$$

(b）若 $a { \leq } b$ 且 $c { \leq } d$ 则

$$a \lor c \leq b \lor d, a \land c \leq b \land d$$

(c) $a { \leq } c$ 且 $b \leq c$ 当且仅当 $a \vee b { \leq } c$ ；c≤a 且 $c { \leq } b$ 当且仅当 $c   \leq   a   \land   b$

证明. 根据对偶原理， $( \mathbf { a } ) { \sim } ( \mathbf { c } )$ 只证其中一个命题即可。

（a）由 $\nabla ^ { \flat }$ 的定义有 $b { \leq } b { \vee } c ,$ ，又 $a { \leq } b$ ，由偏序关系的传递性有 $a { \leq } b { \vee } c ;$ 又由 $\nabla ^ { \circ }$ 的定义有 $c { \leq } b { \vee } c ,$ 故 $b \vee c$ 是 $\{ a , c \}$ 的一个上界。于是由上确界的定义可得 $a \lor c \leq b \lor c$

（b）由于 $a { \leq } b$ ，故 $a \lor c \leq b \lor c$ ，由于 $c { \leq } d$ 故 $b \lor c \leq b \lor d ,$ 综合二者可得 $a \lor c \leq b \lor d$

(c)若 $a { \leq } c$ 且 $b \leq c ,$ ，则由(b)有 $a \lor b \leq c \lor c = c.$ 。反过来，假设 $a \vee b { \leq } c$ ，则由∨的定义及传递性即有 $a { \leq } c$ 且 $b \leq c$ □

定理 6.16 假设 $( L , \leq )$ 为格，则对于任意 $a , b   \in   L$ 都有

(a) $a \lor b = b$ 当且仅当 $a { \leq } b$ 0

(b) $a \land b = a$ 当且仅当 $a { \leq } b .$ 0

(c) $a \land b = a$ 当且仅当 $a \lor b = b$ 0

证明.由定义即得。

定理6.16 表明格中的 $\text{" } \leq  \text{" }$ 关系可以由∨和∧定义，于是格 $\cdot ( L , \leq )$ 也可记作 $( L , \vee , \wedge )$而且可以将√和∧视作L的两个运算，它们满足下述代数性质。

定理 6.17 假设 $( L , \vee , \wedge )$ 为格，则运算∨和∧适合幂等律、交换律、结合律和吸收律，即对于任意 $a , b , c   \in   L$ 都有

（a）幂等律: $a \lor a = a, \quad a \land a = a$

（b）交换律: $a \lor b = b \lor a, \quad a \land b = b \land a.$

[page:173]

## 第6章 偏序关系

（c）结合律: $(a \lor b) \lor c = a \lor (b \lor c), (a \land b) \land c = a \land (b \land c)$ 0

（d） 吸收律: $a \lor (a \land b) = a, a \land (a \lor b) = a.$ 0

证明. 根据对偶原理，(a)~(d)只证其中一个命题即可。

（a）由定理 6.16 及 a≤a即得。

（b）由定义即得。

（c）由上确界的定义有

$$(a \lor b) \lor c \geq a \lor b \geq a$$

$$(a \lor b) \lor c \geq a \lor b \geq b\tag{①}$$

②

$$(a \lor b) \lor c \geq c\tag{③}$$

由②和③可得

$$(a \lor b) \lor c \geq b \lor c\tag{④}$$

由式①和④有 $( a \lor b ) \lor c \geq a \lor ( b \lor c )$ 0

可类似地证明 $(a \lor b) \lor c \leq a \lor (b \lor c)$ ，由偏序关系的反对称性即得 $(a \lor b) \lor c = a \lor (b \lor$ c)。

(d)由 $a \wedge b \leq a$ 及定理6.16即得 $a \lor (a \land b) = a$ 0

定理 6.18 设 $( L _ { 1 } ,   \leqslant )$ 和 $( L _ { 2 } ,   \leqslant )$ 是格，则 $L { = } L _ { 1 } { \times } L _ { 2 }$ 在积偏序下构成一个格。

定义 6.13 假设 $( L , \vee , \wedge )$ 为格，S⊂L且S非空，若对于任意 $a , b { \in } S$ 都有 $a { \vee } b { \in } S$及 $a \wedge b { \in } S _ { i }$ ，则称S是L的一个子格（sublattice)。

注:对于子格元素，上确界和下确界都在原来的格中求。

【例6.21】

(a） 若集合 $A { \subseteq } B { \subseteq } \mathbb { R }$ ，则 $( A ,   \leqslant )$ 是 $( B ,   \leqslant )$ 的子格。

（b）对于任意正整数n， $( \mathbf { D } _ { n } , \left| \right)$ 是 $( \mathbb { Z } ^ { + }$ ,1)的子格。

（c）对于任意正整数m、n，若 $n | m$ ，则 $\left( \mathbf { D } _ { n } , \right.$ 1)是 $| ( \mathbf { D } _ { m } , \mathbf { \Lambda } | )$ 的子格。

（d）若集合A⊂B，则 $\left| (P(A), \subseteq ) \right|$ 是 $( P ( B ) , \subseteq )$ 的子格。

【例6.22】 如图6.8(a)所示的偏序集作为集合是 $\mathbf { D } _ { 3 0 }$ （图6.8(b)）的一个子集，但是并不是 $| \mathbf { ( D } _ { 3 0 } ,$ )的子格。在图6.8(a)所示的偏序集中， $6 \land 15 = 1$ ；而在 $\mathbf { ( D } _ { 3 0 } ,$ 1)中， $6 \land 15 = 3$

定义 6.14 若格 $( L _ { 1 } , ~ \leq _ { 1 } )$ 和 $( L _ { 2 } , ~ \leq _ { 2 } )$ 作为偏序集是同构的，则称它们为同构的格(isomorphic lattices )。

定理6.19（格同构的保运算性）假设f是格 $( L _ { 1 } ,   \bigvee _ { 1 } ,   \bigwedge _ { 1 } )$ 到 $(L_{2}, \lor_{2}, \land_{2})$ 的一个同构，则对于任意 $a , b { \in } L _ { 1 }$ 有

[page:174]

## 174

$$f(a \lor_{1}b) = f(a) \lor_{2}f(b), \quad f(a \land_{1}b) = f(a) \land_{2}f(b)$$

证明. 由定理6.11即得。

## 【例6.23】

（a）若有限集合 $S _ { 1 }$ 与 $S _ { 2 }$ 基数相同，即 $| S _ { 1 } | { = } | S _ { 2 } |$ ，则格 $(P(S_1), \subseteq )  与  (P(S_2), \subseteq )$ 同构。

设 $S_{1}=\left\{a_{1}, a_{2}, \cdots, a_{n}\right\}, S_{2}=\left\{b_{1}, b_{2}, \cdots, b_{n}\right\}$ ，则同构为 $f(a_{1}) = b_{1}, f(a_{2}) = b_{2}, \cdots, f(a_{n}) = b_{n},$ $f(A \cup B) = f(A) \cup f(B)$ 0

(b）设 $n { = } p _ { 1 } { \cdot } p _ { 2 } { \cdot } { \cdot } { \cdot } { \cdot } p _ { s }$ 是s个相异素数的积，则 $( \mathbf { D } _ { n } , \mathbf { \beta } | )$ 同构于 $( P ( S ) , \subseteq )$ ，其中 S是包含s个元素的有限集。

设 $S = \{ a_{1}, a_{2}, \cdots, a_{s} \}$ ，则同构为 $f(p_{1}) = a_{1}, f(p_{2}) = a_{2}, \cdots, f(p_{s}) = a_{s}, f(\mathrm{LCM}(a, b)) = f(a) \cup f(b)$

(c）若 $n { = } p ^ { k }$ 是素数的幂，则 $\left[ \mathbf { ( D } _ { n } , \right.$ I)同构于 $( \{ 1 , 2 , \; \cdots , k \} , \leq )$ ，同构为 $f ( p ^ { i } ) { = } i _ { \circ }$

(d)若 $\mathrm{GCD}(m, n) = 1$ 则 $\overline { { | ( \mathbf { D } _ { m } , \mathbf { \Lambda } | ) } } \times ( \mathbf { D } _ { n } , \mathbf { \Lambda } | )$ 同构于 $\hat { \mathbf { \Phi } } ( \mathbf { D } _ { m n } , \mathbf { \Phi } | )$ ，同构为 $f(a,   b) = a \cdot b$

【例6.24】所有包含4个元素的格（在同构的意义下）如图6.9(a)所示，而所有包含五个元素的格（在同构的意义下）则如图6.9(b)所示。

## 6.3.2 特殊的格

在本节中将逐一介绍一些具有特殊性质的格，其主要有4类:有界格、分配格、有补格、模格。

定义 6.15 存在最大元及最小元的格称作有界格（bounded lattice)。

## 【例6.25】

（a）对于任意集合S，幂集格 $\cdot ( P ( S ) , \subseteq )$ 是有界格（即使S是无限集），其最大元为S，最小元为∅。

(b) $( \mathbb { Z } ^ { + }$ ，D)不是有界格，没有最大元。

(c）（R，≤)不是有界格，既没有最大元也没有最小元。

(d) $( \mathbf { D } _ { n } , \mathbf { \Lambda } | )$ 是有界格，最大元为n，最小元为1。

定理 6.20 有限格 $L { = } \{ a _ { 1 } ,   a _ { 2 } ,   \cdots ,   a _ { n } \}$ 是有界格，L的最小元是 $a_{1} \land a_{2} \land \cdots \land a_{n}$ ，L的最大元是 $a_{1} \lor a_{2} \lor \cdots \lor a_{n}.$

证明.直接验证即得。

定理 6.21 设 $( L , \vee , \wedge )$ 是一个有界格，则对任意 $a   \in   L$ 有 $a   \lor   1   =   1$ $a \land 1 = a$ $a   \vee   0$ $a , a \wedge 0 = 0$ 。（这里的0指最小元，1指最大元。）

证明.由最大元、最小元的定义及定理6.16即得。

[page:175]

## 第6章 偏序关系

定义6.16 若格L中的∨运算对∧有分配律，∧运算对∨也有分配律，即对于任意$a , b , c { \in } L$ 有

$$a \land (b \lor c) = (a \land b) \lor (a \land c), \quad a \lor (b \land c) = (a \lor b) \land (a \lor c)$$

则称L为分配格（distributive lattice)。

注:事实上在任何格中这两个分配不等式都是等价的，即由 $a \land (b \lor c) = (a \land b) \lor (a$ ∧c)可得 $a \lor (b \land c) = (a \lor b) \land (a \lor c)$ ，反之亦然:

$$\begin{align*}& (a \lor b) \land (a \lor c) \\=& ((a \lor b) \land a) \lor ((a \lor b) \land c) \quad &( 入对  \lor  的分配律 ) \\=& a \lor ((a \land c) \lor (b \land c)) \quad &( 吸收律、入对  \lor  的分配律 ) \\=& (a \lor (a \land c)) \lor (b \land c) \quad &( 结合律 ) \\=& a \lor (b \land c) \quad &( 吸收律 )\end{align*}$$

【例6.26】指出下图中哪些格是分配格。

解. $L _ { 1 }$ 和 $L _ { 2 }$ 是分配格，而 $L _ { 3 }$ 和 $L _ { 4 }$ 不是分配格:

在 $L _ { 3 }$ 中 $a \land (b \lor c) = a \land 1 = a$ ，而 $(a \land b) \lor (a \land c) = 0 \lor 0 = 0$ 0

在 $L _ { 4 }$ 中 $a \land (b \lor c) = a \land 1 = a$ ，而 $(a \land b) \lor (a \land c) = b \lor 0 = b$ 0

$L _ { 3 }$ 称为钻石格， $L _ { 4 }$ 称为五角格。

【例6.27】 每个链都是分配格。对于格中任意元素 $a 、 b 、 c_{1}$ ，不妨假设 $b \geq c$ ，则

$$a \land (b \lor c) = a \land b, (a \land b) \lor (a \land c) = a \land b$$

【例6.28】 $( \mathbb { Z } ^ { + }   ,   | )  、 ( \mathbb { R }   , \leq )  、 ( \mathbb { D } _ { n } ,   | )$ 都是分配格。对于任意非空集合S，幂集格(P(S)，⊂)是分配格。

而对于一个格是否是分配格，主要有如下两条判则。

定理6.22 格L是分配格当且仅当对任意 $a ,   b ,   c { \in } L$ ，若 $a \land b = a \land c$ 且 $a \lor b = a \lor c$则 $b { = } c$ 0

证明.（必要性）若格L是分配格，且有 $a \land b = a \land c$ 及 $a \lor b = a \lor c$ ，则

$$b { = } b \land ( a \lor b ) { = } b \land ( a \lor c ) { = } ( b \land a ) \lor ( b \land c ) { = } ( c \land a ) \lor ( b \land c ) { = } c \land ( a \lor b ) { = } c \land ( a \lor c ) { = } c$$

该定理的充分性证明较难，故在本书中略去。

定理6.23 格L是分配格当且仅当L不含有与钻石格或五角格同构的子格。

证明.（必要性）假设格L是分配格，则L显然不含有与钻石格或五角格同构的子格。

（充分性）若格L不是分配格，则由定理6.22存在 $a , b , c { \in } L$ ，使得 $a \land b = a \land c, a \lor$ $b { = } a \vee c$ ，且 $b \neq c$ o

[page:176]

## 176

若b、c可比，不妨假设 $b \leq c$ ，则L存在与五角格同构的子格（图6.11(a))。

若b、c不可比，则L存在与钻石格同构的子格（图6.11(b))。 □

【例6.29】 图6.12中的格均非分配格。

定义 6.17 假设 $\left( L , \vee , \wedge \right)$ 为有界格，其最大元为1，最小元为0，对于元素 $a   \in   L$若元素 $a ^ { \prime } { \in } L$ 满足

$$a \lor a^{\prime} = 1   及   a \land a^{\prime} = 0$$

则称 a'是 a 的一个补元（complement)。

注:容易验证，如果α是b的一个补元，则b也是α的一个补元； $1 ^ { \prime } { = } 0$ 且 $0 ^ { \prime } { = } 1$

【例6.30】 考虑图6.13中的4个格，求出所有元素的补元。

解. 在 $L _ { 1 }$ 中，1'=0且 $0' = 1,\ a' = b,\ b' = a$

在 $L _ { 2 }$ 中， $1 ^ { \prime } { = } 0$ 且 $0^{\prime}=1,\ a,\ b$ 和c都不存在补元。

在 $L _ { 3 }$ 中，1'=0且 $0^{\prime}=1,\ a,\ b$ 和 c都存在两个补元，如 c的两个补元是a和b。

在 $L _ { 4 }$ 中，1'=0且 $0' = 1, a' = b' = c,$ ，即 c存在两个补元 a和 $b .$

上例表明，格中元素可能没有补元；也可能存在多个补元；下述定理表明，对于一些特殊的格，元素的补元若存在必唯一。

定理 6.24 设(L, )为有界分配格。

（a）若L中元素α存在补元，则其补元唯一。

（b）若L中元素a存在补元，则 $( a ^ { \prime } ) ^ { \prime } { = } a$

（c）（德·摩根律）对于任意 $a { , } b { \in } L$ ，若a、b都存在补元，则 $(a \land b)' = a' \lor b', (a \lor b)' =$

[page:177]

## 第6章 偏序关系

$a ^ { \prime } \triangle b ^ { \prime }  。$

证明.

（a）假设b、c都是a的补元，则有 $a \lor c = 1, \quad a \land c = 0, \quad a \lor b = 1, \quad a \land b = 0$ 。从而得到 a $c = a \lor b, a \land c = a \land b$ ，由于L是分配格，因此有 $b { = } c$

(b) $( a ^ { \prime } ) ^ { \prime }$ 与a都是α'的补元，由补元的唯一性得 $\cdot (a^{\prime})^{\prime} = a$

（c）对任意 $a , b   \in   L$ 有

$$\begin{aligned}(a \land b) \lor (a' \lor b') = (a \lor a' \lor b') \land (b \lor a' \lor b') = (1 \lor b') \land (a' \lor 1) = 1 \land 1 = 1 \\(a \land b) \land (a' \lor b') = (a \land b \land a') \lor (a \land b \land b') = (0 \land b) \lor (a \land 0) = 0 \lor 0 = 0\end{aligned}$$

故 $a ^ { \prime } \sqrt { b ^ { \prime } }$ 是 $a \triangle b$ 的补元，由补元唯一性有 $(a \land b)' = a' \lor b'$ 。同理可证 $(a \lor b)^{\prime} = a^{\prime} \land b^{\prime}$ □注:(c)可以推广到有限个元素，即

$$(a_{1} \land a_{2} \land \cdots \land a_{n}) = a_{1} \lor a_{2} \lor \cdots \lor a_{n}, \quad (a_{1} \lor a_{2} \lor \cdots \lor a_{n}) = a_{1} \land a_{2} \land \cdots \land a_{n}$$

定义 6.18 若有界格 $\cdot ( L , \vee , \wedge )$ 中每一个元素都存在（至少一个）补元，则称L为有补格（complemented lattice)。

【例6.31】 在图6.13所示的4个格中， $L_{1} 、 L_{3}$ 和 $L _ { 4 }$ 是有补格， $L _ { 2 }$ 不是有补格。

【例6.32】设S为非空集合，则幂集格 $\cdot ( P ( S ) , \subseteq )$ 是有补格:对于任意 $A \in P(S), A' = S - A$

【例6.33】设 $n {=} p_{1} . p_{2} . \cdots . p_{s}$ 是s个相异素数的积，则 $( \mathbf { D } _ { n } , \mathbf { \Lambda } | )$ 是有补格:对于任意 $a | n$ $a ^ { \prime } { = } n / a$ 0

定义 6.19 假设 $( L , \vee , \wedge ) ,$ 是一个格，如果对于任意 $a , b , c { \in } L$ ，当 $a { \leq } b$ 时，有

$$a \lor (c \land b) = (a \lor c) \land b$$

则称 L 为模格（modular lattice)。

定理 6.25 格(L， ≤)是模格当且仅当:对任意的 $a , b , c { \in } L$ ，若 $a \leq b, \quad c \lor a = c \lor b$ $c \land a = c \land b$ ，则 $a { = } b .$

证明.（a）假设 $( L , \leq )$ 是模格， $a , b , c { \in } L$ 且 $a \leq b, \quad a \lor c = b \lor c, \quad a \land c = b \land c$ ，则

$$a = a \lor (c \land a) = a \lor (c \land b) = (a \lor c) \land b = (b \lor c) \land b = b$$

(b）假设(L,≤)是一个满足定理中所述条件的格， $a , b , c { \in } L$ 且a≤b，则

$$a \lor (b \land c) \leq (a \lor b) \land (a \lor c) = b \land (a \lor c) \quad ( 由   a \lor b = b   及习题   6.41(b))$$

故而

$$\begin{aligned} &(b \land (a \lor c)) \lor c \exists (a \lor (b \land c)) \lor c = a \lor ((b \land c) \lor c) = a \lor c \\&(a \lor (b \land c)) \land c \exists (b \land (a \lor c)) \land c = b \land ((a \lor c) \land c) = b \land c\\ \end{aligned}$$

又有

$$(b \land (a \lor c)) \lor c \leq (a \lor c) \lor c = a \lor c, (a \lor (b \land c)) \land c \geq (b \land c) \land c = b \land c$$

因此 $(b \land (a \lor c)) \lor c = (a \lor (b \land c)) \lor c = a \lor c ), \quad (a \lor (b \land c)) \land c = (b \land (a \lor c)) \land c = b \land c$ $c )$ ，即得 $a \lor (b \land c) = b \land (a \lor c)$ ，即 $( L , \leq )$ 是模格。 □

定理6.26 分配格必定是模格，但模格不一定是分配格。

【例6.34】图6.11(b)所示钻石格是模格但不是分配格。

## *6.3.3 布尔代数

定义6.20 如果一个格既是有补格又是分配格，则称它作布尔格（Boolean lattice）

[page:178]

## 178

或布尔代数（Boolean algebra)。有有限个元素的布尔代数称作有限布尔代数（finite Boolean algebra)

由定理6.24，在布尔代数中，一个元素的补元是唯一的。因此可以把求补元的运算看作是布尔代数中的一元运算，进而可将布尔代数记为 $( B , \vee , \wedge , \prime , 0 , 1 )$ ，其中'为求补运算，0指最小元，1指最大元。

【例6.35】

(a)设 $n {=} p_{1} . p_{2} . \cdots . p_{s}$ 是s个相异素数的积，则 $\left( \mathbf { D } _ { n } , \right.$ )是有限布尔代数，可表示为 $\scriptstyle \left( \mathbf { D } _ { n } , \right.$ GCD, LCM, ', 1, n)，其中求补运算'为:对于任意 $a | n , a ^ { \prime } = n / a$

(b)对于任意非空集合 S,幂集格(P(S), ⊂)是布尔代数，可表示为(P(S), ∪, ∩,',∅， S)，其中求补运算'为:对于任意 $A \in P(S), A' = S - A$ 0

定理6.27 设元素b、c属于一个布尔格，则 $b \wedge c ^ { \prime } { = } 0$ 当且仅当 $b \leq c$

证明. 假设 $b { \leq } c$ ，则 $b \land c^{\prime} = (b \land c^{\prime}) \lor 0 = (b \land c^{\prime}) \lor (c \land c^{\prime}) = (b \lor c) \land c^{\prime} = c \land c^{\prime} = 0$

反过来，若 $b \wedge c = 0$ ，则 $b \land c = (b \land c) \lor (b \land c') = b \land (c \lor c') = b \land 1 = b$ ，即得 $b { \leq } c$ 0

定义 6.21 若布尔代数 $(B_1,   \lor,   \land,   ',   0,   1)  和  (B_2,   \blacktriangledown,   \blacktriangle,   \overbrace{},   \theta,   e)$ 作为格是同构的，则称它们为同构的布尔代数。

由定理6.11 及定理6.19 易得f(0)=θ，f(1)=e 及 $f(a \lor b) = f(a) \lor f(b), f(a \land b) = f(a) \land f(b)$ $f(a) = \overline{f(a)}$ ，即布尔代数的同构对于 $\wedge , \vee ,$ '是保运算的。

【例6.36】假设集合S满足 $| S | = s , n = p _ { 1 } \cdot p _ { 2 } \cdots p _ { s }$ 是s个相异素数的积，则 $( P ( S ) , \subseteq ) .$ 与$( \mathbf { D } _ { n } , \mathbf { \Lambda } | )$ 是同构的布尔代数。

假设有限集合S满足|Sl=n，则(P(S),⊂)是一个布尔格。按照第5章中特征函数的方法，S的每个子集对应一个长为n的0-1序列，例如图6.14(b)表示图6.14(a)所示的格。将这个格命名为 $B _ { n } ,$

于是若 $x=a_{1}a_{2}\cdots a_{n},y=b_{1}b_{2}\cdots b_{n}$ 是 $B _ { n }$ 的两个元素，则

(a) x≤y 当且仅当 $a _ { k } { \leq } b _ { k }$ （作为数字0或1）对所有 k=1,2,…, n成立。

(b) $x \wedge y = c_1 c_2 \cdots c_n,$ 其中 $c_{k} = \min \left\{ a_{k}, b_{k} \right\}$ 0

(c) $x \vee y = d_{1}d_{2}\cdots d_{n}$ ，其中 $d_{k} = \max \left\{ a_{k}, b_{k} \right\}$

(d) $x ^ { \prime } { = } z _ { 1 } z _ { 2 } { \cdots } z _ { n }$ ，其中 $\scriptstyle z _ { k } = 1 - a _ { k }$ 0

【例6.37】 在图6.14中，001≤101，110′=001，110√101=111，110∧101=100。

对于有限布尔代数有如下结果。

定理6.28（有限布尔代数的表示定理/Stone表示定理）任何有限布尔代数都与某个

[page:179]

## 第6章 偏序关系

$B _ { n }$ 同构，其中n为正整数。因此，任何有限布尔代数的元素个数都是2的幂。

## *6.3.4 信息流的格模型

在信息系统中，用户或进程称作主体（subject)，系统中被处理、被控制或被访问的对象（如文件、目录、进程、存储体、体外设备等）称为客体（subject)，于是就形成了主体和客体、主体与主体、客体与客体相互间的关系。

在这些关系中，都可能产生信息的传递，如两个进程之间的通信、用户之间的对话、用户甲写一个文件而用户乙读该文件等。这就产生了信息流（informationflow）的概念——在空间和时间上向同一方向运动中的一组信息，它有共同的信息源和信息接收者。

要实现信息系统安全的目的，就需要通过一些策略对系统中的信息流进行控制，这可以使用格模型来描述。

在常用的多级安全策略中，每组信息都被分配了一个安全级别，不同安全级别及其之间的关系使用线性格 $L _ { 1 }$ 表示。此外，假设系统中所有可能的信息持有者的集合为U，则某信息的安全持有范围就是U的一个子集，于是可以使用子集格 $L _ { 2 }$ 表示。

所有安全类别及其之间允许的信息流动可以使用 $L _ { 1 } { \times } L _ { 2 }$ 来描述，在其中 $( a , b ) { \leq } ( c , d )$当且仅当 $a   \leq   c$ 且 $b { \subseteq } d \text { 。 }$ 。约定只有 $( a ,   b ) { \leq } ( c ,   d )$ 时，信息可以从权限是 $( a ,   b )$ 的主体流向权限是 $( c , d )$ 的主体，即信息流动受到以下限制:高密级的信息不能流动到低密级，信息不能从在具有互异元素的子集（即 $L _ { 2 }$ 中的不可比元素）之间流动，集合 $A { \subseteq } U$ 掌握的信息集合 $B { \supseteq } A$ 也应该掌握。

例如，某系统的安全级别分为无级别级0（Unclassified）、秘密级1（Secret）、机密级2（Confidential）和绝密级3（Top Secret）4级，不同安全级别及其之间的关系为线性格 $L _ { 1 } { = } ( \{ 0 , 1 , 2 , 3 \} , \leq )$ 。系统有两类用户a和b,不同的信息持有范围为子集格 $L_{2} = (\{ \varnothing , \{ a \}$ {b}, $\{ a , b \} \} , \subseteq )$ 。所有安全类别所允许的信息流动可以用图6.15表示。

[page:180]

## 离散数学及应用（第2版）

事实上，任何一个信息流动策略都可以修改为一个格模型，与原模型相容。方法如下

（1）产生回路的安全类统一压缩成一个安全类。

（2）对无上确界的两个安全类A、B增加一个安全类A∨B。

（3）对无下确界的两个安全类A、B增加一个安全类A∧B。

例如，图 6.16(a)中B、C、H三个安全类等价，因此压缩成一个安全类 BCH 得到图 6.16(b)；对E和F增加安全类E∧F、EVF得到图 6.16(c)；对 D和 G增加一个安全

[page:181]

## 第6章 偏序关系

类 $D \bigtriangledown G$ 得到图6.16(d)；对A和I增加一个安全类A√I得到图 6.16(e)；对A√I和J增加一个安全类 $A { \bigvee } I { \bigvee } J$ 得到图6.16(f)，形成一个格。

## 习题6

6.1 设 $A { = } \{ a , b , c , d \}$ ，以下A上关系中哪些是偏序关系？如果是的话，画出相应的哈斯图。

(a) $\{ ( a , a ) , ( b , b ) , ( c , c ) , ( d , d ) \}$ 0

(b) $\{ ( a , a ) , ( a , b ) , ( a , c ) , ( d , d ) \}$ 0

(c) $\{ ( a , a ) , ( a , b ) , ( a , c ) , ( b , b ) , ( b , c ) , ( c , c ) \}$

(d) $\{ ( a , b ) , ( b , c ) , ( c , a ) , ( a , a ) , ( b , b ) , ( c , c ) , ( d , d ) \}$ 0

(e) $\{ ( a , a ) , ( a , b ) , ( a , c ) , ( a , d ) , ( b , b ) , ( c , c ) , ( d , d ) \}$ 0

6.2 图6.17由关系图表示的关系中，哪些是偏序关系，哪些是全序关系？

6.3 证明定理 6.4。

6.4 n 满足什么条件时， $( \mathbf { D } _ { n } , \mathbf { \beta } | )$ 是一个全序集？

6.5 证明:若(A, ≤)是全序集，则 $| ( \boldsymbol { A } ^ { - 1 } , \leq )$ 也是全序集。

6.6 假设R是集合A上的关系，证明:如果R是一个拟序关系，那么 $R ^ { - 1 }$ 也是拟序关系。

6.7 假设R和S都是集合A上的偏序关系，那么

(a) $R \cap S$ 是否也是A上的偏序关系？

(b) $R \cup S$ 是否也是A上的偏序关系？

6.8 假设关系R定义在由实数集的所有非空子集组成的集合上。判断以下每个关系是否是自反的、对称的、反对称的、传递的，是否是偏序。

(a）如果对于任意的 $\varepsilon { > } 0$ ，存在 $a   \in   A$ 和 $b   \in   B$ 使得 $\left| a { - } b \right| { < } \varepsilon ,$ 则 $( A , B ) { \in } R .$

(b）如果对任意 $a   \in   A$ 和 $\varepsilon { > } 0$ ，存在 $b   \in   B$ 使得 $\left| a { - } b \right| { < } \varepsilon ,$ 则 $\left| ( A , B ) { \in } R \right|$

（c）如果对于任意 $a { \in } A , b { \in } B$ 和 $\varepsilon { > } 0$ ，存在 $a ^ { \prime } { \in } A$ 和 $b ^ { \prime } { \in } B$ 使得 $\scriptstyle | a - b ^ { \prime } | < \varepsilon$ 且 $\left| a ^ { \prime } { - } b \right| { < } \varepsilon ,$ 则$$( A , B ) { \in } R  。  $$

6.9假设 $S = \{ F | F$ 是由命题变量p、q组成的命题公式}，“↔”是S上的等价关系。

(a） 计算 $| S / \leftrightarrow |$ 0

(b）定义 $S / \Longleftrightarrow ]$ 上的关系 $R = \{ ( [ A ] _ { \Leftrightarrow } , [ B ] _ { \Leftrightarrow } ) | [ A ] _ { \Leftrightarrow } \in S / \Leftrightarrow , [ B ] _ { \Leftrightarrow } \in S / \Leftrightarrow , A \rightarrow B \}$ ，证明:R是一个偏序。

6.10设 $( A , \leq )$ 是偏序集， $B   \subseteq   A$ ，若B中任意两个元素都可比，则B称为A的一个链，B

[page:182]

## 离散数学及应用（第2版）

中的元素个数称为链的长度；若B中任意两个不同元素都不可比，则B称为A的一个反链，B的元素个数称为反链的长度。（易见，链和反链的任意子集分别是链和反链。)

例如，在偏序集({1,2,3, 6,9, 18}, )中，{1,2, 6, 18}、{1, 3, 6, 18}和{1, 3,9, 18}都是A中长度为4的链，{2,3}和{6,9}都是该偏序集中长度为2的反链；在偏序集({2, 3, 6, 12, 24, 36}, |)中，{2, 6, 12, 24}、{2, 6, 12, 36}、{3, 6, 12, 24}和{3, 6, 12, 36}都是A中长度为4的链，{2,3}、{24,36}都是该偏序集中长度为2的反链。

设(A,≤)是偏序集，证明:如果A中最长链的长度是n，那么A的全部元素能被分成n条不相交的反链的并。

(提示:用数学归纳法，施归纳于n；还应注意到A的所有极大元构成一条反链。)

6.11设 $( A ,   \leq )$ 是偏序集， $|A| = mn + 1$ ，这里m、n为正整数，则A中或者存在一条长度为m+1的反链，或者存在一条长度为n+1的链。

6.12 证明:在任意mn+1个人中，要么存在m+1个人组成的一个序列，其中每个人（除了第一个人以外）都是序列中前一个人的后代；要么存在n+1个人，其中没有一个人是其他n个人中任何一个人的后代。

6.13 若 $( A , \leq )$ 和 $( B , \leq )$ 都是全序集，则积偏序是否也是全序集？词典序是否是全序集？

6.14 假设 R 是集合 S 上的关系， $S ^ { \prime } { \subseteq } S ,$ 定义 $S ^ { \prime } { \times } S ^ { \prime } ]$ 上的关系 R'为 $R^{\prime}=R\cap(S^{\prime}\times S^{\prime})$ ，确定下述每一断言是真还是假。

（a）若R是传递的，则R'也是传递的。

（b）若R是偏序关系，则R'也是偏序关系。

（c）若R是拟序关系，则R'也是拟序关系。

（d）若R是全序关系，则R'也是全序关系。

6.15 请给出集合A上的一个关系，使得其既是偏序关系又是等价关系。

6.16 设 R 是偏序关系，求证: $R \cup R ^ { - 1 }$ 是等价关系。

6.17 思考:在商务印书馆2011年出版的《新华字典》第11版中各个字的顺序是如何排的呢？

6.18 针对图6.18中各哈斯图，写出集合以及偏序关系。

6.19 求偏序集 $( P ( \{ a , b , c \} ) - \{ a , b , c \} - \emptyset , \subseteq )$ 中的极大元、极小元、最大元、最小元。

6.20 画出({1,2,3,4,5,6,7,8,9,10},)的哈斯图，并求其极大元、极小元、最大元、最小元。

[page:183]

## 第6章 偏序关系

6.21 已知偏序集的哈斯图如图6.19所示，求其极大元、极小元、最大元、最小元，求集合 $B_{1} = \{ 2,   3,   7,   14,   21 \}$ $B_{2} = \{ 2, 14 \}$ $B_{3} = \{ 2, 7 \}$ $B_{4} = \{ 2, 7, 14 \}$ 的上界、下界、上确界、下确界。

6.22 已知({2,3,6,12,24,36},)的哈斯图如图 6.20所示，求其极大元、极小元、最大元、最小元，求集合 $B_{1} = \{ 2, 6, 3 \}$ $B_{2} = \{ 3, 36 \}$ $B_{3} = \{ 6,   12 \}$ 的上界、下界、上确界、下确界。

6.23 已知偏序集的哈斯图如图6.21所示，求其极大元、极小元、最大元、最小元，求集合 $B _ { 1 } { = } \{ c , d , g , h \}$ $B _ { 2 } { = } \{ a , b , c , i \}$ $B _ { 3 } { = } \{ a , e , f , h \}$ $B _ { 4 } { = } \{ d , g , i , j \}$ 的上界、下界、上确界、下确界。给出其的一个拓扑排序。

6.24 关于一个软件项目的任务的哈斯图如图6.22所示，对这个软件项目的任务进行拓扑排序。

6.25 构造下述偏序集的例子:

（a）是偏序集，但不是全序集。

（b）是全序集，而且不存在最小元。

（c）是偏序集，存在最大元但不存在最小元。

（d）是偏序集，存在极小元但不存在极大元。

6.26 假设 $( A , \leq )$ 是偏序集， $B { \subseteq } A ,$ ，证明:若 $( B , \leq \mid _ { B } )$ 存在最大（小）元，则该最大（小）元在 $[ ( A , \leq )$ 中恰为B的上（下）确界。

6.27 证明定理 6.10。

[page:184]

## 离散数学及应用（第2版）

(f)

6.28 证明:最大(小)元一定是唯一的极大(小)元，反之则不然。

6.29若 ${ \mathfrak { i } } ( A , \leq )$ 的任意非空的子集B都有最小元的存在，则称≤为A的良序（well order)，称 $\mathfrak { i } ( A ,   \leq )$ 是良序集（well ordered set)。例如， $( \mathbb { Z } ^ { + }   ,   \leq )$ 是良序集，而 $( \mathbb { Z } ,   \leq )$ 不是良序集。

证明:

（a）良序集是全序集。

（b）有限全序集是良序集。

6.30 在图6.23由哈斯图表示的偏序集中，哪些是格？

6.31 设A是集合，E是A上的所有等价关系构成的集合。证明:(E,⊂)是格。

6.32 证明定理 6.13。

6.33 证明定理 6.18。

6.34 设格 L=({1,2, 5,6,10, 15,30}, 1)。以下诸偏序集是否是格，是否是 L 的子格？(a)({1, 2, 5, 10}, D)。(b) ({1, 6, 15, 30}, D)。(c) ({2, 10, 15, 30}, D)。(d) ({1, 2, 15, 30}, )。

6.35 求图 6.24 中格 L 的所有子格。

6.36 已知格的哈斯图如图6.25所示。

(a) {a, b, c, e, f, g, h, i}是否是该格的子格?

（b）给出该格的至少包含5个元素的子格。

（c）计算h的所有补元素；计算f的所有补元素。

6.37 设 $[ ( L , \leq )$ 为格， $a   \in   L$ ，定义集合 $S = \{ x | x \in L$ 且 $x { \leq } a \}$ ，证明: $( S , \leq )$ 是(L,≤)的一个子格。

6.38 设 a、b 为格 $\cdot ( L , \leq ) ^ { \intercal }$ 中的两个不同元素，且 $a { \leq } b$ ，定义集合 $S = \{ x | x \in L$ 且 $a { \leq } x { \leq } b \}$ ，证明:(S, ≤)是 $\mathbf { \ell } ( L , \leq )$ 的一个子格。

[page:185]

## 第6章 偏序关系

6.39 证明:一个格是链的充要条件是它的所有非空子集都是子格。

6.40 证明:对于格 $\cdot ( L , \leq )$ 中任何元素 $a  、 b  、 c  、 d ,$ 有 $(a \land b) \lor (c \land d) \leq (a \lor c) \land (b \lor d)$

6.41 证明:若L是格，则对于任意 $a , b , c { \in } L$ ，有

(a) $a \land ( b \lor c ) \geq ( a \land b ) \lor ( a \land c )$ 0

(b) $a \lor (b \land c) \leq (a \lor b) \land (a \lor c)$

6.42 证明:在有补格中， $1 ^ { \prime } { = } 0$ 且 $0 ^ { \prime } { = } 1$ 0

6.43 证明:具有两个以上元素的链不是有补格。

6.44 证明:在元素个数大于1的有界格中，每个元素都不是自己的补元。

6.45 在图6.26 由哈斯图表示的偏序集中，哪些是分配格？

6.46 举出两个具有6个元素的格，其中一个是分配格，而另一个不是。

6.47 假设L是有界分配格，证明:L中具有补元的元素全体构成L的一个子格。

6.48 对于模格 $\cdot ( L , \leq )$ ，若有3个元素 $a , b , c { \in } L$ ，使得下述3个式子的任何一个式子中把$\text{" } \leq  \text{" }$ 换成 $" = "$ 若成立，则另外两个式子中把 $\text{" } <  \text{" }$ 换成 $" = "$ 也必成立:

$$\begin{aligned}a \lor (b \land c) \leq (a \lor b) \land (a \lor c) \\(a \land b) \lor (a \land c) \leq a \land (b \lor c) \\(a \land b) \lor (b \land c) \lor (c \land a) \leq (a \lor b) \land (b \lor c) \land (c \lor a)\end{aligned}$$

6.49设 $( L , ~ \leq )$ 是模格，证明:对任意的 $a , b , c { \in } L$ ，若 $(a \lor b) \land c = b \land c$ ，则必有$(c \lor b) \land a = b \land a$

（提示:先证明 $b = (a \lor b) \land (c \lor b)$ ，再计算 $b \wedge a _ { \circ } )$

6.50 证明:L是分配格当且仅当对于任意 $a , b , c { \in } L$ ，有

$$(a \land b) \lor (b \land c) \lor (c \land a) = (a \lor b) \land (b \lor c) \land (c \lor a)$$

(提示: $\longleftarrow$ 先证明L是模格，再证明 $a \lor ((a \lor b) \land (b \lor c) \land (c \lor a)) = (a \lor b) \land (c$ $\nabla a )$ 及 $a \lor ((a \land b) \lor (b \land c) \lor (c \land a)) = a \lor (b \land c)$

6.51 设元素 $a  、 b$ 属于一个布尔格，证明: $a ^ { \prime } \vee b { = } 1$ 当且仅当 $a { \leq } b$

6.52 假设 $( B , \vee , \wedge , { } ^ { \prime } , 0 , 1 )$ 是布尔代数，证明:对于任意 $a , b , c { \in } B$ ，有

$$a \land (a' \lor b) = a \land b, \quad a \lor (a' \land b) = a \lor b$$

6.53 假设 $( B , \vee , \wedge , { } ^ { \prime } , 0 , 1 )$ 是布尔代数，证明:对于任意 $a,   b \in B,   a \leq b$ 当且仅当 $b ^ { \prime } { \leq } a ^ { \prime }$ 0

6.54 证明:对于任意的 n>1， $( B _ { n } , \leq )$ 与积格 $\left( B _ { 1 } , \leq \right) \times \left( B _ { 1 } , \leq \right) \times \ldots \times \left( B _ { 1 } , \leq \right)$ 同构。

6.55 以下由关系矩阵表示的关系中哪些构成布尔代数？

[page:186]

## 离散数学及应用（第2版）

(a)

$$\begin{pmatrix} \begin{pmatrix} \begin{pmatrix} M_{_R} = \begin{pmatrix}1 \begin{array}{l}0 \begin{array}{l}0 \begin{array}{l}0 \begin{array}{l}0 \begin{array}{l}1 \end{array}{l}0 \begin{array}{l}0 \begin{array}{l}1 \end{array}{l}0 \begin{array}{l}0 \begin{array}{l}1 \end{array}{l}0 \begin{array}{l}1 \begin{array}{l}1 \end{array}{l}1 \begin{array}{l}0 \begin{array}{l}1 \end{array}{l}1 \begin{array}{l}1 \begin{array}{l}1 \end{array}{l}1 \begin{array}{l}1 \end{array}1 \begin{array}{l}1 \end{array}1 \begin{array}{l}1 \end{array}1 \begin{array}{l}1 \end{array}1 \begin{array}{l}1 \end{array}1 \end{array}1 \\0 \begin{array}{l}0 \begin{array}{l}0 \begin{array}{l}0 \begin{array}{l}1 \end{array}1 \begin{array}{l}1 \end{array}0 \begin{array}{l}0 \begin{array}{l}0 \begin{array}{l}0 \begin{array}{l}0 \begin{array}{l}0 \begin{array}{l}0 \end{array}{l}0 \begin{array}{l}0 \begin{array}{l}0 \end{array}{l}0 \begin{array}{l}0 \begin{array}{l}0 \end{array}{l}0 \begin{array}{l}0 \begin{array}{l}0 \end{array}{l}0 \begin{array}{l}0 \end{array}1 \end{array}1 \end{array}1 \end{array}1 \end{array}1 \end{pmatrix}1 \\0 \begin{array}{array}{l}0 \begin{array}{l}0 \begin{array}{l}0 \begin{array}{l}0 \end{array}0 \begin{array}{l}0 \end{array}0 \begin{array}{l}0 \end{array}0 \end{array}0 \end{array}0 \end{array}0 \end{pmatrix}1 \\0 \begin{array}0 \begin{array}{l}0 \begin{array}{l}0 \end{array}0 \end{array}0 \end{array}0 \end{array}0 \end{pmatrix}1 \end{array}0 \end{pmatrix} \end{array} \end{array} \end{array} \end{array} \end{array} \end{array} \end{array} \end{array} \end{array} \end{array} \end{array} \end{array} \end{array}\tag{b}$$

$$\boldsymbol{M}_{R}=\begin{pmatrix}1 & 1 & 1 & 1 & 1 & 1 & 1 \\0 & 1 & 0 & 1 & 1 & 1 & 1 \\0 & 0 & 1 & 0 & 0 & 1 & 0 & 1 \\0 & 0 & 0 & 1 & 1 & 1 & 1 \\0 & 0 & 0 & 0 & 1 & 0 & 1 & 1 \\0 & 0 & 0 & 0 & 0 & 1 & 0 & 1 \\0 & 0 & 0 & 0 & 0 & 0 & 1 & 1 \\0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 \\\end{pmatrix}\tag{c}$$

$$M _ { _ R } = \left( \begin{aligned} { 1 } & { { } 0 } & { 0 } & { 0 } & { 0 } & { 0 } & { 0 } \\ { 1 } & { { } 1 } & { 0 } & { 0 } & { 0 } & { 0 } & { 0 } \\ { 1 } & { { } 1 } & { 1 } & { 0 } & { 0 } & { 0 } & { 0 } & { 0 } \\ { 1 } & { { } 1 } & { 1 } & { 1 } & { 0 } & { 0 } & { 0 } & { 0 } \\ { 1 } & { { } 1 } & { 0 } & { 0 } & { 1 } & { 0 } & { 0 } & { 0 } \\ { 1 } & { { } 1 } & { 0 } & { 0 } & { 1 } & { 1 } & { 0 } & { 0 } \\ { 1 } & { { } 1 } & { 1 } & { 1 } & { 1 } & { 1 } & { 1 } & { 0 } \\ { 1 } & { { } 1 } & { 1 } & { 1 } & { 1 } & { 1 } & { 1 } \\ \end{aligned} \right) .\tag{d}$$

$$\boldsymbol{M}_{R}=\left(\begin{aligned}&1\ 1\ 1\ 1\ 0\ 0\ 0\ 0\\&0\ 1\ 0\ 1\ 0\ 0\ 0\ 0\\&0\ 0\ 1\ 1\ 0\ 0\ 0\ 0\\&0\ 0\ 0\ 1\ 0\ 0\ 0\ 0\\&1\ 1\ 1\ 1\ 1\ 1\ 1\ 1\\&0\ 1\ 0\ 1\ 0\ 1\ 0\ 1\\&0\ 0\ 1\ 1\ 0\ 0\ 1\ 1\\&0\ 0\ 0\ 1\ 0\ 0\ 0\ 1\end{aligned}\right)$$

6.56 证明:若素数 $p$ 满足 $p ^ { 2 } | n$ ，则 $( \mathbf { D } _ { n } , \mathbf { \Lambda } | )$ 不是布尔代数。

[page:187]

# 第7章

## 代数结构

代数学历史悠久，几千年前人们就有了数的概念，并知道了一些解方程的方法。随着人类社会的发展，人们对数的认识逐渐深化，从自然数、整数、有理数、实数，最后扩展到复数。早期代数学处理的对象是具体的数，而近世代数学（即抽象代数学）的研究对象是抽象的代数结构，它是在集合基础上结合具有某些指定性质的运算而形成的，也称为代数系统。

代数结构不以某一具体对象为研究对象，而以一大类具有某种共同性质的对象为研究对象，研究它们所具有的共同属性与运算规律，从而揭示事物间的本质和内在关系。

抽象代数学在计算机科学与软件科学中应用广泛，如计算机软件形式说明和开发、算法设计与分析、信息处理与安全等，对学科的产生和发展有重大影响；与此同时，这些学科的迅速发展对抽象代数学也提出了新的要求，促使它不断发展。

本章将介绍代数结构的基本概念和性质，以及几类常用的代数结构:半群、亚群、群、环、域、格和布尔代数。

## 7.1 代数结构

## 7.1.1 运算与代数结构的定义

设f是从集合 $A ^ { 2 }$ 到集合A的函数，则对于 $A ^ { 2 }$ 中的每一个有序对 $( a _ { i } , a _ { j } ) { \in } A$ ，有 $a _ { k } { \in } A$使得 $f ( a _ { i } ,   a _ { j } ) { = } a _ { k }$ ，所以函数关系 $f ( a _ { i } ,   a _ { j } ) { = } a _ { k }$ 可以看作是集合A中的两个元素 $a _ { i }  、  a _ { j }$ 经过运算f后在A 中得到运算结果 $a _ { k } ,$ 。于是可以得到二元运算的定义。

定义 7.1 设 A 为非空集合，函数 $f : A { \times } A { \rightarrow } A$ 称作A上的一个二元运算（binary operation)，简称为二元运算。二元运算常用·、*、□、〇、⊗、⊕、Δ、∇等符号表示，而且通常将□(a, b)写作 $a  口  b 。$ 这时也称A对f封闭（closed）。

定义 7.2 设A 为非空集合，函数 f:A→A 称作 A 上的—个—元运算（unary operation)，简称为一元运算。通常将f(a)写作 $f a$

注:运算是抽象的，我们重点强调参与运算的元素与运算结果的对应关系，而非运算的过程。

定义 7.3 设A 为非空集合， $f _ { 1 } , f _ { 2 } , \cdots , f _ { k }$ 为A上的k个运算（包括一元运算和二元运算)，则称 $( { \mathcal { A } } , f _ { 1 } , f _ { 2 } , \cdots , f _ { k } )$ 为一个代数结构（algebraic structure）或代数系统（algebraic system)。

[page:188]

## 【例7.1】

(a）设A为集合，则∩、∪、⊕、-均为P(A)上的二元运算，求补运算“—”是P(A)上的一元运算。

（b）Z、N、Q、R、C上的普通加法、减法和乘法均为相应集合的二元运算，求相反数为相应集合的一元运算。

（c）设A为非空集合，则连接运算。是 ${ \boldsymbol { A } } ^ { * } .$ 上的二元运算。

(d)在Z的“模n同余”关系的商集Z $\left/ n\mathbb{Z} = \left\{ \overline{0, 1, \cdots, n-1} \right\} \right.$ 上可以定义模n加法“+n”和模 n 乘法 $\text{" } \times_{n} \text{" };$ 对任意 $\overline{a} \text { 、 } \overline{b} , \overline{a} + _ { n } \overline{b} = \overline{a + b} , \overline{a} \times _ { n } \overline{b} = \overline{a \times b}$

## 【例7.2】

（a）假设集合A为所有正奇整数，则普通加法“+”在A上不封闭，即存在两个正奇整数，其和不是正奇整数，因此“+”不是A上的二元运算。

（b）普通减法不是Z+上的二元运算，例如 $1   -   3 \not \in   \mathbb { Z } ^ { + }$

（c）正整数集 $\mathbb { Z } ^ { + }$ 上的普通除法不是 $\mathbb { Z } ^ { + }$ 上的二元运算，因为两个正整数相除的结果可能不是整数。这时也称Z+对除法运算不封闭。

(d)实数集合R上的除法不是R上的二元运算，因为 $0 \epsilon$ R，而0不能做除数。但在R*=R-{0}上可以定义除法运算。

## 【例7.3】

(a）设Mn(R)表示所有 n阶实方阵全体，则矩阵的加法和乘法都是Mn(R)上的二元运算，转置运算（记作T）是 $\mathbf { M } _ { n } \left( \mathbb { R } \right)$ 上的一元运算。 $\left( \mathbf{M}_{n}\left( \mathbb{R} \right), +, \times, ^{\mathrm{T}} \right)$ 构成一个代数结构。

(b)设 ${ \bf B } _ { n }$ 表示所有n阶布尔矩阵，则∧、√、都是布尔矩阵上的二元运算； $\left( \mathbf{B}_{n}, \begin{array}{c} \bigwedge \end{array} \right.$ ∨，)构成一个代数结构。

(c）设A为非空集合，S表示A上的关系全体，则(S,°)是一个代数结构。

(d)若 $( L , \leq )$ 是一个格，则(L，∨,∧)是一个代数结构，特别是:

(d-1)(Z+,LCM, GCD)是一个代数结构。

(d-2) $( \mathbf { D } _ { n } , \mathrm { L C M } , \mathrm { G C D } )$ 是一个代数结构，其中n是一个正整数。

(d-3)(A, max, min)是一个代数结构，其中 A⊆R。

(d-4)(P(A)，∪，∩)是一个代数结构，其中A为非空集合。

对于有限集合A上的一元运算和二元运算，还可以使用运算表的方式给出。表7.1和表7.2是运算表的一般形式，其中 $a _ { 1 } , a _ { 2 } , . . . , a _ { n }$ 是A中元素。

表 7.1 一元运算<table><tr><td><eq>a _ { i }</eq></td><td><eq>{ } ^ { \circ } a _ { i }</eq></td></tr><tr><td><eq>a _ { 1 }</eq></td><td><eq>{ } ^ { \circ } a _ { 1 }</eq></td></tr><tr><td><eq>a _ { 2 }</eq></td><td><eq>{ } ^ { \circ } a _ { 2 }</eq></td></tr><tr><td>•</td><td></td></tr><tr><td><eq>a _ { n }</eq></td><td><eq>{ } ^ { \circ } a _ { n }</eq></td></tr></table>

表 7.2 二元运算<table><tr><td>0</td><td><eq>a _ { 1 }</eq></td><td><eq>a _ { 2 }</eq></td><td><eq>\cdots</eq></td><td><eq>a _ { n }</eq></td></tr><tr><td><eq>a _ { 1 }</eq></td><td><eq>a _ { 1 } { \circ } a _ { 1 }</eq></td><td><eq>a _ { 1 } { \circ } a _ { 2 }</eq></td><td><eq>\cdots</eq></td><td><eq>a _ { 1 } { \circ } a _ { n }</eq></td></tr><tr><td><eq>a _ { 2 }</eq></td><td><eq>a _ { 2 } { \circ } a _ { 1 }</eq></td><td><eq>a _ { 2 } { \circ } a _ { 2 }</eq></td><td><eq>\cdots</eq></td><td><eq>a _ { 2 } { \circ } a _ { n }</eq></td></tr><tr><td>•</td><td>• •</td><td>•</td><td>•</td><td>•</td></tr><tr><td><eq>a _ { n }</eq></td><td><eq>a _ { n } { \circ } a _ { 1 }</eq></td><td><eq>a _ { n } { \circ } a _ { 2 }</eq></td><td>0</td><td><eq>a _ { n } { \circ } a _ { n }</eq></td></tr></table>【例7.4】 集合P({1,2})上∪运算的运算表如表7.3所示。

[page:189]

## 第7章 代数结构

【例7.5】 集合P({1,2})上⊕运算的运算表如表7.4所示。表 7.3 例 7.4 用表<table><tr><td>U</td><td>∅</td><td>{1}</td><td>{2}</td><td>{1,2}</td></tr><tr><td>∅</td><td>∅</td><td>{1}</td><td>{2}</td><td>{1,2}</td></tr><tr><td>{1}</td><td>{1}</td><td>{1}</td><td>{1,2}</td><td>{1,2}</td></tr><tr><td>{2}</td><td>{2}</td><td>{1,2}</td><td>{1,2}</td><td>{1,2}</td></tr><tr><td>{1,2}</td><td>{1,2}</td><td>{1,2}</td><td>{1,2}</td><td>{1,2}</td></tr></table>

表 7.4 例 7.5 用表<table><tr><td>⊕</td><td>∅</td><td>{1}</td><td>{2}</td><td>{1,2}</td></tr><tr><td>∅</td><td>∅</td><td>{1}</td><td>{2}</td><td>{1,2}</td></tr><tr><td>{1}</td><td>{1}</td><td>∅</td><td>{1,2}</td><td>{2}</td></tr><tr><td>{2}</td><td>{2}</td><td>{1,2}</td><td>∅</td><td>{1}</td></tr><tr><td>{1,2}</td><td>{1,2}</td><td>{2}</td><td>{1}</td><td>∅</td></tr></table>【例7.6】Z $/ 4 \mathbb { Z } = \{ \overline { { 0 } } , \overline { { 1 } } , \overline { { 2 } } , \overline { { 3 } } \}$ 上定义的模4加法和模4乘法的运算表如表7.5和表7.6所示。

表 7.5 例 7.6 用表 1<table><tr><td>X4</td><td>10</td><td>11</td><td>12</td><td>3</td></tr><tr><td>10</td><td>10</td><td></td><td>2</td><td>3</td></tr><tr><td>1</td><td>11</td><td>2</td><td>13</td><td>0</td></tr><tr><td>2</td><td>2</td><td>3</td><td>0</td><td>I1</td></tr><tr><td>3</td><td>13</td><td>0</td><td>ī</td><td>2</td></tr></table>

表 7.6 例 7.6 用表 2<table><tr><td>×4</td><td>10</td><td>11</td><td>12</td><td>3</td></tr><tr><td>10</td><td>10</td><td>10</td><td>0</td><td>10</td></tr><tr><td>ī</td><td>0</td><td>11</td><td>2</td><td>3</td></tr><tr><td>2</td><td>10</td><td>12</td><td>0</td><td>2</td></tr><tr><td>3</td><td>10</td><td>3</td><td>12</td><td>ī</td></tr></table>【例7.7】Z $/ 5 \mathbb { Z } = \{ \overline { { 0 } } , \overline { { 1 } } , \overline { { 2 } } , \overline { { 3 } } , \overline { { 4 } } \}$ 上定义的模 5 加法和模 5 乘法的运算表如表 7.7 和表7.8所示。

表 7.7 例 7.7 用表 1<table><tr><td>X5</td><td>0</td><td>ī</td><td>2</td><td>3</td><td>4</td></tr><tr><td>0</td><td>0</td><td>ī</td><td>2</td><td>3</td><td>4</td></tr><tr><td>ī</td><td>ī</td><td>2</td><td>3</td><td>-4</td><td>0</td></tr><tr><td>12</td><td>2</td><td>-3</td><td>-4</td><td>0</td><td>11</td></tr><tr><td>3</td><td>3</td><td>4</td><td>0</td><td>1</td><td>2</td></tr><tr><td>14</td><td>14</td><td>0</td><td>11</td><td>2</td><td>3</td></tr></table>

表 7.8 例 7.7 用表 2<table><tr><td>×5</td><td>0</td><td>ī</td><td>2</td><td>3</td><td>4</td></tr><tr><td>0</td><td>0</td><td>0</td><td>10</td><td>0</td><td>0</td></tr><tr><td>ī</td><td>0</td><td>ī</td><td>2</td><td>3</td><td>14</td></tr><tr><td>2</td><td>0</td><td>2</td><td>4</td><td>11</td><td>3</td></tr><tr><td>3</td><td>0</td><td>3</td><td>1</td><td>4</td><td>2</td></tr><tr><td>14</td><td>0</td><td>-4</td><td>3</td><td>2</td><td>11</td></tr></table>而且，还可以将二元运算的概念一步推广。定义 7.4 设A 为任意非空集合，函数 $f \colon A ^ { n } { \longrightarrow } A$ 称为集合A上的一个n元运算。

## 7.1.2 二元运算的性质

本节讨论二元运算的主要性质，包括单个二元运算性质、两个二元运算之间的性质以及二元运算中的一些特殊元素。

定义7.5 设□是非空集合A上的二元运算，如果对于任意 $a , b { \in } A$ ,都有 $a \square b = b \square a$则称运算口在A上是可交换的（commutative)，或称运算□在A上满足交换律。

定义7.6 设□是非空集合A上的二元运算，如果对于任意 $a , b , c { \in } { \mathcal { A } }$ ，都有(a□b)□c

[page:190]

## 离散数学及应用（第2版）

$= a \square ( b \square c )$ ，则称运算□在A上是可结合的（associative)，或称运算□在A上满足结合律。此时连续的运算之间不必加括号。

【例7.8】Z $\left/ n\mathbb{Z} = \left\{ \overline{0}, \overline{1}, \cdots, \overline{n-1} \right\} \right.$ 上定义的模n加法和模n乘法满足交换律和结合律。

## 【例7.9】

（a）在实数集R上的普通减法“_”不满足交换律和结合律。

(b）在R+上定义二元运算÷为普通除法，于是÷不满足交换律和结合律。例如:

$$4 \div 2 \neq 2 \div 4, \quad  且  \quad 4 \div (2 \div 2) = 4 \neq (4 \div 2) \div 2$$

（c）在正实数集R⁺上可以定义二元运算为 $a \diamond b = a ^ { b }$ ，则不满足交换律和结合律。例如:

$$2\diamond3=8\ne9=3\diamond2,\quad  且  \quad 2\diamond(3\diamond2)=2^{9}\ne2^{6}=(2\diamond3)\diamond2$$

## 【例7.10】

（a）集合上函数的复合运算不是可交换的，但是可结合的。

（b）设A为非空集合， ${ \boldsymbol { A } } ^ { * } .$ 上的连接运算。不满足交换律，但是满足结合律。

(c) $\mathbf{M}_{_n}(\mathbb{R})$ 上的矩阵加法满足交换律和结合律，矩阵乘法满足结合律但不满足交换律。

定义7.7 设□是非空集合A上的二元运算，如果对于任意 $a   \in   A$ ，都有 $a \square a = a$ ，则称运算口在A上是等幂的（idempotent)，或称运算口在A上满足幂等律。

定义7.8 设□、是非空集合A上的二元运算，如果对于任意 $a , b , c { \in } A$ ，都有$a \square (b \square c) = (a \square b) \square (a \square c)  及  (b \square c) \square a = (b \square a) \square (c \square a)$ ，则称二元运算□对于○在A上具有分配性（distributive)，或称运算口对于○在A上满足分配律。

定义7.9 设□、是非空集合A上的二元运算且都可交换，如果对于任意 $a , b   \in   A$都有 $a \square ( b \bigcirc c ) = a$ 及 $a \bigcirc (b \square c)  =  a$ ，则称运算口和在A上满足吸收律（absorption law）。

## 【例7.11】

(a）若(L,≤)是一个格，则代数结构(L，∨,∧)中的运算∨和∧满足交换律、结合律、幂等律和吸收律(定理6.17)。但一般√对于∧不满足分配律，∧对于√也不满足分配律；当分配律满足时， $( L , \leq )$ 是分配格。

(b）设U为全集，则∩、∪是P(U)上的二元运算，满足交换律、结合律、幂等律和吸收律，∩对于∪满足分配律，∪对于∩也满足分配律（定理1.3）。

下面介绍二元运算中的一些特殊元素。

定义 7.10 设□是非空集合A 上的二元运算，若 $e { \in } A$ 满足:对于任意 $a   \in   A$ ，都有$a { = } e \square a { = } a \square e$ ，则称e是A上关于运算□的单位元（identity）或幺元。

## 【例7.12】

(a）代数结构(R，+)中的单位元为0；代数结构(R，×)中的单位元为1。

（b）设A为集合， $S { = } P ( A )$ ，则S上的二元运算∪存在单位元∅，S上的二元运算∩存在单位元A。

(c）设 $\mathbf{M}_{n}(\mathbb{R})$ 表示所有n阶实方阵全体，则单位矩阵 $I _ { n }$ 是关于乘法运算的单位元，零矩阵是关于加法运算的单位元。

[page:191]

## 第7章 代数结构

【例7.13】(所有正偶整数,×)不存在单位元。

定理7.1 设口是非空集合A上的二元运算，若运算口存在单位元，则单位元唯一。证明. 假设e和i都是A上关于运算□的单位元。

由于 i 是A 上关于运算□的单位元，故对于任意 $a   \in   A$ 有 $a \square i {=} i \square a {=} a$ ，特别地，$e \square i { = } i \square e { = } e ,$

另一方面，由于e是A上关于运算□的单位元，有 $e \square i { = } i \square e { = } i .$ ，因此 $e { = } i _ { \circ }$

即，若运算口的单位元存在则唯一。

定义 7.11 设□是非空集合A 上的二元运算，若θ∈A 满足:对于任意 $a   \in   A$ ，都有θa=a□θ=θ，则称θ是A上关于运算□的零元（zero element）。

## 【例7.14】

(a）代数结构(R，+)中不存在零元，代数结构(R，×)中的零元为0。

（b）设A为集合， $S { = } P ( A )$ ，则S上的二元运算∪存在零元A，S上的二元运算∩存在零元∅。

定理7.2 设口是非空集合A上的二元运算，若运算口存在零元，则零元唯一。

定义7.12 设□是非空集合A上的二元运算且存在单位元 $e { \in } A ,$ 如果对于元素 $a   \in   A$存在 $b   \in   A$ ，使得 $b \square a = a \square b = e$ ，则称b是a关于运算口的逆元（inverse)，记作 $b   =   a ^ { - 1 }$

## 【例7.15】

（a）整数集Z上的加法运算中，0是单位元，而对于任意 $a   \in   \mathbb { Z }$ ，其逆元是-a。

（b）整数集Z上的乘法运算中，1是单位元，而对于任意 $a { \neq } \pm 1$ ，a不存在逆元。

(c) $\mathbb { R } ^ { * } = \mathbb { R } - \{ 0 \}$ 上的乘法运算的单位元是1，对于任意 $a   \in   \mathbb { R } ^ { * }$ ，其逆元是 $\frac{1}{a}$ 6

（d）设A为集合， $X { \in } { \mathcal { P } } ( A )$ 。若 $X \not = \varnothing ,$ ，则Χ关于∪运算不存在逆元；若 $X { \neq } A ,$ ，则X关于∩运算都不存在逆元；而∅关于∪运算存在逆元∅，A关于∩运算存在逆元A。

(e) 对于 $\mathbb{Z} / n\mathbb{Z} = \{ \overline{0}, \overline{1}, \overline{2}, \cdots, \overline{n-1} \}$ 上的模n加法，单位元是 $\overline { { 0 } }$ ，元素ā的逆元为 $n - a$

(f) 对于 $\mathbb{Z} / n\mathbb{Z} = \{ \overline{0}, \overline{1}, \overline{2}, \cdots, \overline{n-1} \}$ 上的模n乘法，单位元是ī，元素存在逆元当且仅当a与 n互素。此时由裴蜀等式，存在整数s和t使得 $sa + m = 1$ ，可得 $sa \equiv 1(\bmod n)$ 9即 $\overline { { a } } \times _ { _ { n } } \overline { { s } } = \overline { { 1 } }$ 。特别是当p是素数时， $\mathbb { Z } / p \mathbb { Z } - \{ \overline { { 0 } } \}$ 中任一元素均存在逆元。

定理7.3 设口是非空集合A上的二元运算，若运算口是可结合的，则任意元素的逆元若存在则唯一。

证明.假定元素x关于运算□存在两个逆元 y和 z，则有

$$(z \square x) \square y = e \square y = y, \quad z \square (x \square y) = z \square e = z$$

由于□具有结合性，因此 $\begin{aligned}& \text{〔 } (z \square x) \square y  =  z \square (x \square y)\end{aligned}$ ，于是y=z。

注:如果二元运算口不是可结合的，则一个元素的逆元可能不只一个。例如集合{a，$\left. b , c \right\}$ 上的二元运算口的运算表如表7.9所示。

α是关于□的单位元，而且b和c都是b的逆元。这与定理7.3并无矛盾，这是因为运算口不是可结合的。

如果 $(A, \; \square)$ 是一个代数结构，是A上的一个二元运算，那么该运算的性质在运算表上的反映是:

[page:192]

## 离散数学及应用（第2版）

表 7.9 □的运算表<table><tr><td>□</td><td>a</td><td>b</td><td>C</td></tr><tr><td>a</td><td>a</td><td>b</td><td>C</td></tr><tr><td>b</td><td>b</td><td>a</td><td>a</td></tr><tr><td>C</td><td>C</td><td>a</td><td>a</td></tr></table>

（a）运算□具有封闭性，当且仅当运算表中的每个元素都属于A。

（b）运算□具有可交换性，当且仅当运算表关于主对角线对称。

（c）运算□具有等幂性，当且仅当运算表的主对角线上的每一元素与它所在行（列）的表头元素相同。

（d）A关于□有零元，当且仅当该元素所对应的行和列中的元素都与该元素相同。

（e）A关于□有单位元，当且仅当该元素所对应的行和列依次与运算表的行和列相一致。

（f)设A中有单位元，a和b互为逆元，当且仅当位于a所在行、b所在列的元素以及b所在行、a所在列的元素都是单位元。

【例7.16】二元运算口的运算表如表7.10所示。

表 7.10 例 7.16 用表<table><tr><td>□</td><td>a</td><td>b</td><td>C</td><td><eq>d</eq></td></tr><tr><td>a</td><td>a</td><td>a</td><td>a</td><td>a</td></tr><tr><td>b</td><td>a</td><td>b</td><td>C</td><td><eq>d</eq></td></tr><tr><td>C</td><td>a</td><td>C</td><td><eq>b</eq></td><td>b</td></tr><tr><td><eq>d</eq></td><td>a</td><td><eq>d</eq></td><td><eq>b</eq></td><td>C</td></tr></table>

该运算表关于主对角线对称，因此运算□具有可交换性。α是关于运算□的零元。b是关于运算□的单位元。c有两个逆元是c和d，因此运算□不具有结合性。

## 7.2群

法国数学家伽罗华（Galois，1811—1832）提出了群的概念，引入了群论的一系列重要结果，以讨论方程式的可解性。他由此给出了一个方程可用根式求解的充分必要条件，系统化地阐释了五次以上之方程式没有公式解，而四次以下有公式解。

群论是抽象代数中得到充分发展的一个分支，已广泛地运用于数学、物理、通信和计算机科学。本节将介绍群的基本概念和基本性质，并给出一些重要结果。

## 7.2.1 半群与亚群

半群是具有一个二元运算的代数结构，在计算机科学的形式语言和自动机理论中得到广泛应用。

定义7.13 满足如下性质的代数结构(S, ·)称为半群（semigroup)。

[page:193]

## 第7章 代数结构

（1）集合S非空。

（2）运算·满足结合律。

注:通常称 $a { \cdot } b$ 为 a和 b的积（product)。若半群(S，·)中的运算·满足交换性，则称为可交换半群。在不引起混淆的情况下，也可以将(S,·)简记为 $S _ { \circ }$

定义 7.14 含有单位元的半群(S，·)称为亚群（monoid)，也称作含幺半群、单元半群、独异点。

## 【例7.17】

(a) $( \mathbb { Z } ^ { + } , + )$ 是一个可交换半群，但不是亚群，因为不存在单位 $元$

(b)(Z，+)，(Q，+)，(R，+)，(C,+)都是可交换亚群(单位元是0)；(Z，×)，(Q，×)，(R，×)，(C,×)都是可交换亚群(单位元是1)。

(c) $( \mathbb { Z } / n \mathbb { Z }   ,   + _ { n } )$ 是可交换亚群（单位元为 $\overline { { 0 } }$ $( \mathbb { Z } / n \mathbb { Z }   ,   \times _ { n } )$ 也是可交换亚群（单位元为ī)。

(d) $\left( \mathbf{M}_{n}(\mathbb{R})   ,   + \right)$ 是可交换亚群，而 $\left( \mathbf{M}_{n}(\mathbb{R})   ,   \times \right)$ 是不可交换亚群。

（e）设A为非空集合，则 $| ( \boldsymbol { A } ^ { * } , \circ ) |$ 是一个亚群，称作自由亚群，其单位元是空串λ。

(f)设U为全集，则(P(U)，∩)和(P()，∪)都是可交换亚群。

定理 7.4 设(S, ·)是一个半群，如果 S是一个有限集，则必有 $a   \in   { \cal S } ,$ 使得 $a \cdot a = a$

证明.由 $于 (S,\cdot);$ 是半群，对于任意 $x { \in } A ,$ ，考察序列 $x , x ^ { 2 } , \cdots , x ^ { n } , x ^ { n + 1 } , \cdots$ ，由鸽巢原理，其中必有两项相同。不妨假设 $x^{i}=x^{j}, 1 \leqslant i < j,$ ，令 $j { - } i { = } l _ { \circ }$

(a）若 $j { \geq } 2 i$ ，则记 $a   =   x ^ { j - i }$ ，有 $a \cdot a = x^{2(j - i)} = x^{j + j - 2i} = x^{i + j - 2i} = x^{j - i} = a$

(b)若 $j { \leqslant } 2 i$ ，由于 $x ^ { i } = x ^ { j } = x ^ { j + l } = x ^ { j + 2 l } = x ^ { j + 3 l } = \cdots$ ，总存在正整数m使得 $m { \cdot } l { \geq } i ,$ ，于是 $x ^ { i }   =   x ^ { j + m l }$ $j + m \cdot l > 2 i$ ，又转化为情形(a)。 □

## 7.2.2 群的概念

定义 7.15 满足下述4 个条件的代数结构 $( G , \cdot )$ 称为群（group）。

（1）运算·关于G是封闭的，即对于任意 $a , b   \in   G$ ，运算的结果 $a { \cdot } b$ 也属于 $G _ { \odot }$

（2）运算·是可结合的，即对于任意 $a , b , c { \in } G$ ，等式 $a { \cdot } ( b { \cdot } c ) { = } ( a { \cdot } b ) { \cdot } c$ 成立。

（3）G中存在单位元e，即对于任意 $a   \in   G$ ，等式 $e \cdot a = a \cdot e = a$ 成立。

（4）G的任何元素都存在逆元，即对于任意 $a   \in   G$ ，存在元素 $a ^ { \prime } { \in } G$ 使 $a \cdot a^{\prime} = a^{\prime} \cdot a = e$ $a ^ { \prime }$称作a的逆，通常记作 $a ^ { - 1 } ,$

在不引起混淆的情况下，通常将 $a { \cdot } b$ 简记为 ab，将 $\cdot ( G , \cdot )$ 简记为 $G _ { \circ }$ 若群 $( G , \cdot )$ 中的运算·满足交换性，则称其为交换群或可换群（commutative group）或阿贝尔群（Abelian group)。

由群的概念以及7.2.1节介绍的半群的相关概念，可以得到

$$\{  群  \} \subseteq \{  亚群  \} \subseteq \{  半群  \}$$

定义 7.16 设 $( G , \cdot ) ,$ 是一个群。如果G是有限集，那么称 $( G , \cdot )$ 为有限群(finite group), G中元素的个数通常称为该有限群的阶数（order），记为 $| G | _ { \odot }$ 如果G是无限集，则称(G, ·)为无限群。

[page:194]

## 离散数学及应用（第2版）

【例7.18】

(a）(Z,+)，(Q,+)，(R,+)，(C,+)都是群；但(R,×)不是群，因为0∈R关于乘法无逆元。

(b) $\left( \mathbf{M}_{n}(\mathbb{R})   ,   \times \right)$ 不构成群，因为存在不可逆矩阵；但是(n阶可逆实方阵全体，×)构成不可交换的群。

(c) $G { = } \{ 1 , - 1 \}$ 在普通乘法下构成群。

(d) $( \mathbb { Z } / n \mathbb { Z } , + _ { n } )$ 是可换群，但是 $( \mathbb { Z } / n \mathbb { Z } , \times _ { n } )$ 不是群，因为 $\overline { { 0 } }$ 关于 $\left[ \times _ { n } \right.$ 运算不存在逆元。然而，当p是素数时， $\left( \mathbb{Z} / p \mathbb{Z} - \left\{ \overline{0} \right\} , \times_n \right)$ 是可换群。

(e) $S = \{ 1, 2, 3, \cdots, n \}$ 上的所有n元置换在函数复合运算下构成一个群。

前两例群元素的个数是无限的，所以是无限群；后三例群元素的个数是有限的，所以是有限群。

【例7.19】二维欧氏空间刚体旋转可表示为 $T _ { \alpha } =$ $\begin{pmatrix} \cos \alpha \sin \alpha \\ -\sin \alpha \cos \alpha \end{pmatrix}$ ，其作用如图7.1所示。

则所有刚体旋转 $\pmb { T } { = } \{ \pmb { T } _ { \pmb { \alpha } } \}$ 在矩阵乘法运算下构成群:

$$\begin{aligned}\boldsymbol{T}_{\alpha} \times \boldsymbol{T}_{\beta} = & \left( \begin{array}{c}\cos \alpha \sin \alpha \\-\sin \alpha \cos \alpha\end{array} \right) \times \left( \begin{array}{c}\cos \beta \sin \beta \\-\sin \beta \cos \beta\end{array} \right) \quad  图  \\= & \left( \begin{array}{c}\cos \alpha \cos \beta - \sin \alpha \sin \beta \sin \alpha \cos \beta + \sin \beta \cos \alpha \\-\sin \alpha \cos \beta - \sin \beta \cos \alpha \cos \alpha \cos \beta - \sin \alpha \sin \beta\end{array} \right) \\= & \left( \begin{array}{c}\cos (\alpha + \beta) \sin (\alpha + \beta) \\-\sin (\alpha + \beta) \cos (\alpha + \beta)\end{array} \right) = \boldsymbol{T}_{\alpha + \beta} ,  从而满足封闭性。 \end{aligned}$$

7.1 例 7.19 用图

②矩阵乘法满足结合律。

③ 存在单位元 $\boldsymbol{T}_{0}=\left(\begin{aligned}\cos 0 \sin 0 \\-\sin 0 \cos 0\end{aligned}\right)=\left(\begin{aligned}1 0 \\0 1\end{aligned}\right)$ 0

④每个元素都存在有逆元: $\left( \boldsymbol { T } _ { \alpha } \right) ^ { - 1 } = \boldsymbol { T } _ { - \alpha } = \begin{pmatrix} \cos \alpha - \sin \alpha \\ \sin \alpha - \cos \alpha \end{pmatrix}$ O

【例7.20】 令A= P({1,2})，A上的运算⊕如表7.11所示。则(A, ⊕)构成一个群。【例7.21】 假设集合 $G { = } \{ e , a , b , c \}$ ，G上的运算*如表7.12所示。

表 7.11 例 7.20 用表表 7.12 例 7.21 用表<table><tr><td>⊕</td><td>∅</td><td>{1}</td><td>{2}</td><td>{1,2}</td></tr><tr><td>∅</td><td>∅</td><td>{1}</td><td>{2}</td><td>{1,2}</td></tr><tr><td>{1}</td><td>{1}</td><td>∅</td><td>{1,2}</td><td>{2}</td></tr><tr><td>{2}</td><td>{2}</td><td>{1,2}</td><td>∅</td><td>{1}</td></tr><tr><td>{1,2}</td><td>{1,2}</td><td>{2}</td><td>{1}</td><td>∅</td></tr></table>

<table><tr><td>*</td><td>e</td><td><eq>a</eq></td><td><eq>b</eq></td><td><eq>c</eq></td></tr><tr><td>e</td><td><eq>e</eq></td><td><eq>a</eq></td><td><eq>b</eq></td><td><eq>c</eq></td></tr><tr><td>a</td><td><eq>a</eq></td><td><eq>e</eq></td><td><eq>c</eq></td><td><eq>b</eq></td></tr><tr><td><eq>b</eq></td><td><eq>b</eq></td><td><eq>c</eq></td><td><eq>e</eq></td><td><eq>a</eq></td></tr><tr><td>C</td><td>C</td><td>b</td><td>a</td><td><eq>e</eq></td></tr></table>

则 $( G , * )$ 是一个群，称作克莱因（Klein）四元群。

【例7.22】 假设一个人面向正北，定义A={立正，向左转，向后转，向右转}，定义

[page:195]

## 第7章 代数结构

A上的运算。为两个动作相继完成，例如，向后转。向左转=向右转，向左转。向后转=向右转，向左转。向右转=立正

运算。的运算表如表7.13所示。

表 7.13 例 7.22 用表<table><tr><td>0</td><td>立正</td><td>向左转</td><td>向后转</td><td>向右转</td></tr><tr><td>立正</td><td>立正</td><td>向左转</td><td>向后转</td><td>向右转</td></tr><tr><td>向左转</td><td>向左转</td><td>向后转</td><td>向右转</td><td>立正</td></tr><tr><td>向后转</td><td>向后转</td><td>向右转</td><td><eq>立正</eq></td><td>向左转</td></tr><tr><td>向右转</td><td>向右转</td><td>立正</td><td>向左转</td><td>向右转</td></tr></table>

可以验证(A,°)构成一个群。

定义 7.17 假设(S, □)和(T，O)都是群，f是从 S到 T的一个函数，如果对于任意 a, $b   \in   S$ ，都有 $f(a \square b) = f(a) \bigcirc f(b)$ ，则称f为(S，□)到(T，O)的一个同态映射(homomorphism)，简称同态，称(S, )和(T,O)是同态的(homomorphic)。

定义 7.18 假设(S, □)和(T，O)都是群，f是从 S到 T的一个双射，如果对于任意 a, $b   \in   { \cal S } ,$ ，都有 $f(a \square b) = f(a) \bigcirc f(b)$ ，则称f为(S,□)到(T, O)的一个同构映射(isomorphism)，简称同构，称(S,□)和(T,O)是同构的（isomorphic)，记作 $( S ,   \square ) { \cong } ( T ,   \mathsf { O } )$

定义 7.19 假设(S, □)是群，若函数f是从(S, □)到(S, □)的一个同态，则称f为自同态（endomorphism）；若f是从(S，□)到(S，□)的一个同构，则称f为自同构(automorphism)。

【例7.23】 克莱因四元群和例7.20给出的例子(A,⊕)是同构的，同构函数是 $f(e)=\varnothing$ $f(a)=\{1\}, \quad f(b)=\{2\}, \quad f(c)=\{1,2\}$ 0

【例7.24】 例7.22给出的例子和 $( \mathbb { Z } / 4 \mathbb { Z }   ,   + _ { 4 } )$ 是同构的，同构函数是: $f( 立正 ) = \overline{0}$ , f(向左转)=ī，f(向后转)=2，f(向右转 $) { = } { \overline { { 3 } } }$

实际上这个同构可以作如下解释:俯视站立者，立正相当于逆时针旋转零个 $9 0 ^ { \circ }$向左转相当于逆时针旋转一个90°，向后转相当于逆时针旋转两个 $9 0 ^ { \circ }$ ，向右转相当于逆时针旋转三个 $9 0 ^ { \circ }$ ，°运算相当于旋转角度的相加，而且角度是模 $3 6 0 ^ { \circ }$ （即4个 $9 0 ^ { \circ } )$ 的。

【例7.25】定义集合 $A = \left\{ 2^{i} \mid i \in \mathbb{Z} \right\}$ ，则(A，×)是群，而且(Z，+)与之同构。同构函数f定义为 $f ( x ) { = } 2 ^ { x }$

【例7.26】假设集合 $A = \left\{ \left( a \quad 0 \right) \mid a, d \in \mathbb{R}^* \right\}$ ，则A在矩阵乘法运算下构成一个群，单位元为 $\binom { 1 0 } { 0 1 }$ 。设集合 $B = \left\{ \left( a \quad 0 \right) \mid a \in \mathbb{R}^* \right\}$ ，则B在矩阵乘法运算下构成一个群，单位元为 $\binom { 1 0 } { 0 0 }$ 。A到B的函数 $f\left( \binom{a\ 0}{0\ d} = \binom{a\ 0}{0\ 0} \right.$ 给出了A到B的一个同态，但不是同构。

【例7.27】 （R,+)和(R+,×)这两个群是同构的。其同构函数f定义为 $f(x) = e^{x}$ 。对于任意 $x , y \in$ R， $f(x+y)=e^{x+y}=e^{x}\times e^{y}=f(x)\times f(y)$ ；若 $x \neq y$ ，则 $e ^ { x } { \neq } e ^ { y }$ ，所以f为单射；又因为对

[page:196]

## 196

于任意 $\boldsymbol { y }   \in   \mathbb { R } ^ { + }$ ，存在 x=ln y∈ R，使得 $f(x) = e^{x} = y$ ，所以f为满射。

【例7.28】定义 $\mathbb { R } ^ { * }$ 上的函数 $\varphi _ { 1 } ( x ) = | x | , \quad \varphi _ { 2 } ( x ) = 2 x , \quad \varphi _ { 3 } ( x ) = x ^ { 2 } , \quad \varphi _ { 4 } ( x ) = 1 / x , \quad \varphi _ { 5 } ( x ) = - x$ ，则其中 $\varphi _ { 1 }  、  \varphi _ { 3 }$ 和 $\varphi _ { 4 }$ 是 $\iota ( \mathbb { R } ^ { * } , \times )$ 的自同态， $\varphi _ { 4 }$ 是 $( \mathbb { R } ^ { * } , \times )$ 的自同构；而 $\varphi _ { 2 }$ 和 $\varphi _ { 5 }$ 不是 $( \mathbb { R } ^ { * } , \times )$ 的自同态，原因是: $\varphi_{2}(x) \cdot \varphi_{2}(y) = 2x \cdot 2y \neq 2xy = \varphi_{2}(x \cdot y), \quad \varphi_{5}(x) \cdot \varphi_{5}(y) = (-x) \cdot (-y) \neq -xy = \varphi_{5}(x \cdot y)$ 0

【例7.29】 $\phi _ { a } : \mathbb { Z } \to \mathbb { Z } , \phi _ { a } ( x ) = a x$ 给出了(z,+)的一个自同态，其中 $a \in \mathbb { Z }$ 。当 a=±1时， $\phi _ { a }$ 是自同构。

定理 7.5 假设(S, □)和 $( T , \mathsf { O } )$ 都是群，f是从(S, 口)到(T, O)的一个同构， $e _ { 1 }$ 和 $e _ { 2 }$ 分别是(S, 口)和(T, O)的单位元，则

(a) $e _ { 2 } { = } f ( e _ { 1 } )$

（b）对于任意 $x \in S, f(x)^{-1} = f(x^{-1})$

证明.

（a） 对于任意 $y { \in } T ,$ ，由于f是满射，因此存在 $x   \in   S$ ，使得 $f(x) = y$ 。由于

$$y \bigcirc f(e_1) = f(x) \bigcirc f(e_1) = f(x \bigcirc e_1) = f(x) = y$$

及单位元的唯一性（定理7.1），得 $e _ { 2 } { = } f ( e _ { 1 } )$ 0

(b) $f(x) \bigcirc f(x^{-1}) = f(x \bigcirc x^{-1}) = f(e_1) = e_2, \quad f(x^{-1}) \bigcirc f(x) = f(x^{-1} \bigcirc x) = f(e_1) = e_2$ ，再由○运算满足结合性及定理 7.3 得 $f ( x ) ^ { - 1 } = f ( x ^ { - 1 } )$ o 口

【例7.30】（R，+)和 $( \mathbb { R } ^ { * } , \times )$ 这两个群是不同构的。

采用反证法证明:假设存在 $( \mathbb { R } ^ { * } , \times )$ 到(R,+)的同构函数f，则有 $f(-1)+f(-1)=f((-1)$ $(-1))=f(1),\ f(1)+f(1)=f(1\cdot 1)=f(1)$ ，因此 $f(-1) = f(1)$ ，这与f是单射矛盾。

定理7.6 群之间的同构是一个等价关系。

## 7.2.3 群的性质

定理7.7 假设G是群，则对于G中任意一个元素a，其逆元是唯一的。

证明. 由群的定义及定理7.3即得。

定理7.8（消去律）假设G是群，则

(a）若 $ab = ac$ 则 b=c（左消去律）。

（b）若 $b a = c a$ 则 b=c（右消去律)。

证明.（a）若 $a b   =   a c$ 则 $a ^ { - 1 } ( a b )   =   a ^ { - 1 } ( a c )$ ，由结合律有 $(a^{-1}a)b = (a^{-1}a)c$ ，即 $e b   =   e c$ ，继而 $b { = } c$ 0

类似地可证明(b)。

定理 7.9 假设 G 是群， $a , b   \in   G$ ，则:

（a）方程 $ax = b$ 在 G 中存在唯一解 $a ^ { - 1 } b$ 0

（b）方程 $y a { = } b$ 在 G 中存在唯一解 $b a ^ { - 1 }$

证明.（a）由 $a(a^{-1}b){=}(aa^{-1})b{=}eb{=}b$ 及消去律知方程 $ax = b$ 在 G 中存在唯一解。

定理 7.10 设(G, ·)是一个群，则对于任意 $a ,   b   \in   G$ ，有

(a) $( a ^ { - 1 } ) ^ { - 1 }   =   a   \mathrm { { _ { \circ } } }$ 0

[page:197]

## 第7章 代数结构

(b) $( a b ) ^ { - 1 } = b ^ { - 1 } a ^ { - 1 }$

证明.

(a) 因为 $a ^ { - 1 }$ 是a的逆元，有 $a a ^ { - 1 } { = } a ^ { - 1 } a { = } e$ ，又由逆元的唯一性，即得 $( a ^ { - 1 } ) ^ { - 1 } { = } a .$

（b）由于 $( b ^ { - 1 } a ^ { - 1 } ) ( a b ) { = } b ^ { - 1 } ( a ^ { - 1 } a ) b { = } b ^ { - 1 } e b { = } e$ ，及 $(ab)(b^{-1}a^{-1})=a^{-1}(b^{-1}b)a=a^{-1}ea=e$ ，又由逆元的唯一性，即得 $( a b ) ^ { - 1 } { = } b ^ { - 1 } a ^ { - 1 }$ 口

注:以上定理的结果可以推广为:若 $\mathfrak { i } ( G , \cdot )$ 是一个群， $a , b , \cdots , c { \in } G$ ，则有 $( a b \cdots c ) ^ { - 1 } = c ^ { - 1 } \cdots$ $\boldsymbol { b } ^ { - 1 } \boldsymbol { a } ^ { - 1 }$

定理7.11 设(G,·)是一个群，则在关于运算·的运算表中任何两行或两列都是不相同的，而且每一行每一列都是G中元素的一个置换。

证明.

（1）设S中关于运算·的单位元是 $e _ { \circ }$ 由于对于任意 $a , b   \in   G$ 且 $a { \neq } b$ ，总有

$$a \cdot e = a \neq b = b \cdot e   和   e \cdot a = a \neq b = e \cdot b$$

即在·的运算表中 a行与b行、a列与b列都不可能是相同的。

（2）考察第a行，如果 $ab = ac$ ，则由消去律知 $b = c .$ 。因此a行中各项彼此不同，即此行是G中元素的一个置换。同理可以证明运算表中每一列都是G中元素的一个置换。口

使用该定理可以很快地判断出哪些代数结构不是群，例如表7.14表示的运算一定不构成群；但反过来，即使运算表满足定理7.11，也不能断定它就是群，例如表7.15表示的运算其实也并不构成群。

表 7.14 *的运算表<table><tr><td>*</td><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><td>0</td><td>0</td><td>1</td><td>1</td><td>3</td></tr><tr><td>1</td><td>3</td><td>0</td><td>2</td><td>2</td></tr><tr><td>2</td><td>2</td><td>3</td><td>0</td><td>1</td></tr><tr><td>3</td><td>1</td><td>2</td><td>3</td><td>0</td></tr></table>

表 7.15 *的运算表<table><tr><td>*</td><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><td>0</td><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><td>1</td><td>3</td><td>0</td><td>1</td><td>2</td></tr><tr><td>2</td><td>2</td><td>3</td><td>0</td><td>1</td></tr><tr><td>3</td><td>1</td><td>2</td><td>3</td><td>0</td></tr></table>

假设G是群， $x { \in } G$ ，则x的幂 $x ^ { n }$ 可递归地定义为

$$\begin{array} { l } { x ^ { 0 } { = } e } \\ { x ^ { n } { = } x ^ { n - 1 } { \cdot } x } \\ { x ^ { n } { = } ( x ^ { - n } ) ^ { - 1 } } \end{array} \quad \begin{array} { l } { n { = } 1 , 2 , 3 , \cdots } \\ { n { = } { - } 1 , { - } 2 , { - } 3 , \cdots } \end{array}$$

类似于定理4.12，有以下定理。

定理 7.12 假设 G 是群， $x { \in } G ,$ ，则对于任何整数m、n有

$$x^{m} \circ x^{n} = x^{m + n}, \quad (x^{m})^{n} = x^{m \times n}$$

当G是有限群时，有以下定理。

定理7.13 若G是有限群，则对于任意 $a   \in   G ,$ ，存在正整数r，使得 $a ^ { r } { = } e$

证明. 设 $| G | { = } n$ ，则由鸽巢原理， $a , a ^ { 2 } , \cdots , a ^ { n } , a ^ { n + 1 }$ 中必有两项相同。不妨假设 $a ^ { m } { = } a ^ { l }$ $1 \leqslant m < l \leqslant n + 1$ ，令 $l { - } m { = } r$ ，于是由消去律可得 $e { = } a ^ { r }$ □

定理7.14 若G是有限群，则对于任意 $a   \in   G$ ，存在正整数r，使得 $a ^ { r } { = } a ^ { - 1 }$

证明. 由定理7.13，存在正整数r使得 $a ^ { r } { = } e$ ，则由消去律有 $a ^ { r - 1 }   =   a ^ { - 1 }$

[page:198]

## 离散数学及应用（第2版）

若r-1>0，则可得需证明之结论。

若r-1=0，表明r=1，即 $a { = } e$ ，于是 $a ^ { 1 }   =   e   =   a ^ { - 1 }$ 0

## 7.2.4 子群

定义7.20 假设G是一个群，H⊆G是G的一个子集，如果H在G中的运算下也构成一个群，则称(H,·)是(G,·)的一个子群（subgroup)，记作 $H { \leq } G _ { \circ }$

【例 7.31】 假设(G, ·)是一个群，e是 G 的单位元，则({e}, ·)和(G, ·)都是(G, ·)的子群，它们称作(G,·)的平凡子群（trivial subgroup)；而其他子群称作非平凡子群。

【例7.32】 (Z,+)是(Q,+)的子群，（Q,+)是(R,+)的子群，（R,+)是(C,+)的子群。

【例7.33】 $( \mathbb{Z} / 4 \mathbb{Z}, +_4 ) \cup ( \{ \overline{0}, \overline{2} \}, +_4 )$ 构成它的一个非平凡子群。

【例7.34】 克莱因四元群有5个子群: $\{ e \} ,   \{ e , a , b , c \} ,   \{ e , a \} ,   \{ e , b \} ,   \{ e , c \}$

【例7.35】定义 $n \mathbb{Z} = \left\{ n \cdot x \mid x \in \mathbb{Z} \right\}$ ，则(nZ，+)是整数群的子群。当 $n { \neq } 0 , \pm 1$ 时， $( n \mathbb { Z }$ +)是整数群的非平凡子群。

定理 7.15 假设(G, ·)是一个群，(H, ·)是群(G, ·)的子群，则 G 的单位元属于 H，而且对于任意a∈H，a在H中的逆元 ${ a _ { H } } ^ { - 1 }$ 就是a 在 G 中的逆元 $a ^ { - 1 }$

证明. 设 $e _ { H }$ 和 e 分别是 H 和 G 的单位元， ${ e _ { H } } ^ { - 1 }$ 为 $e _ { H }$ 在 G中的逆元，则

$$e _ { H } { = } e \cdot e _ { H } = ( e _ { H } { ^ { - 1 } } { \cdot } e _ { H } ) e _ { H } = e _ { H } { ^ { - 1 } } { \cdot } ( e _ { H } e _ { H } ) = e _ { H } { ^ { - 1 } } \cdot e _ { H } { = } e$$

又，对任意 $a   \in   H ,$ ，有

$$a _ { H } { } ^ { - 1 } = a _ { H } { } ^ { - 1 } \cdot e = a _ { H } { } ^ { - 1 } \cdot ( a \cdot a ^ { - 1 } ) = ( a _ { H } { } ^ { - 1 } \cdot a ) \cdot a ^ { - 1 } = e _ { H } \cdot a ^ { - 1 } = e \cdot a ^ { - 1 } = a ^ { - 1 }$$

定理 7.16 假设(G, ·)是一个群， $H \subseteq G,\ H \neq \varnothing$ ，则H是G的子群当且仅当对于任意$h _ { 1 } ,   h _ { 2 } { \in } H$ 有

(1) $h _ { 1 } { \cdot } h _ { 2 } { \in } H ,$ 且

(2) ${ h _ { 1 } } ^ { - 1 } { \in } H \mathrm { { \textcirc } }$

证明.必要性是显然的，下面只证明充分性。

由(1)知运算·在H上具有封闭性。

运算·在G上可结合，故在G的子集H上也可结合。

对于任意 $h _ { 1 } { \in } H _ { 1 }$ ，由(2)可知 ${ h _ { 1 } } ^ { - 1 } { \in } H ,$ ，再由(1)可得 $e = h_{1} \cdot h_{1}^{-1} \in H$ ，于是H关于·运算存在单位元。

对于任意 $h _ { 1 } { \in } H ,$ ，由(2)可知 ${ h _ { 1 } } ^ { - 1 } { \in } H _ { \circ }$

即H是G的子群。

定理7.17 假设(G,·)是一个群，H是 G 的有限非空子集，则 H是 G的子群当且仅当对于任意 $h _ { 1 } ,   h _ { 2 } { \in } H$ 有 $h _ { 1 } { \cdot } h _ { 2 } { \in } H .$ 0

证明.必要性是显然的，下面只证明充分性。

只须证明 ${ h _ { 1 } } ^ { - 1 } { \in } H$ 即可。类似于定理7.14的证明过程，可知存在正整数r，使得 ${ h _ { 1 } } ^ { r } { = } { h _ { 1 } } ^ { - 1 }$又由对于任意 $h _ { 1 } ,   h _ { 2 } { \in } H$ 有 $h _ { 1 } { \cdot } h _ { 2 } { \in } H$ 知 ${ h _ { 1 } } ^ { - 1 } = { h _ { 1 } } ^ { r } { \in } H _ { \circ }$ □

定理 7.18 假设(G, ·)是一个群， $H \subseteq G,\ H \neq \varnothing$ ，则H是G的子群当且仅当对于任意$h _ { 1 } ,   h _ { 2 } { \in } H$ 有 $h _ { 1 } { \cdot } { h _ { 2 } } ^ { - 1 } { \in } H _ { \circ }$

[page:199]

## 第7章 代数结构

证明.必要性是显然的，下面只证明充分性。

对于任意 $h _ { 1 } { \in } H , e { = } h _ { 1 } { \cdot } h _ { 1 } ^ { - 1 } { \in } H$ ，即H中包含单位元 $e   ,$

对于任意 $h _ { 1 } \in H , \quad h _ { 1 } ^ { - 1 } = e \cdot ( h _ { 1 } ) ^ { - 1 } \in H \text { 。 }$

对于任意 $h _ { 1 } ,   h _ { 2 } { \in } H ,$ 有 ${ h _ { 2 } } ^ { - 1 } { \in } H ,$ 故 $h_{1} \cdot h_{2} = h_{1} \cdot (h_{2}^{-1})^{-1} \in H$

由定理7.16知，H是 $G$ 的子群。

定理 7.19 假设 $( G , \cdot )$ 是有限群， $a   \in   G$ ，则 $\{ a ^ { n } | n   \in   \mathbb { Z } \}$ 是G的一个子群，称作由a生成的子群，记作 $\leq a >$

## 7.2.5 循环群与置换群

定义 7.21 在群(G, ·)中，若存在 $a   \in   G$ ，使得 $G = \{ a ^ { n } | n \in \mathbb { Z } \}$ ，则称(G, ·)为一个循环群，称 $a$ 为循环群G的一个生成元（generator）。此时也记 $G { = } ( a )$ 0

注:若 $a$ 是循环群G的一个生成元，则 $a ^ { - 1 }$ 也是循环群G的一个生成元。

【例7.36】 （Z，+)是循环群,生成元为1和-1。

【例7.37】 $\mathbb{Z} / 4\mathbb{Z} = \{\overline{0}, \overline{1}, \overline{2}, \overline{3}\}$ 上模4加法的运算表为表7.5。从中可以看出 $( \mathbb { Z }   /   4 \mathbb { Z }   , + _ { 4 } )$是一个循环群，ī和 $\bar { 3 }$ 都是生成元。

【例7.38】 $( \mathbb { Z } / n \mathbb { Z } , + _ { n } )$ 是循环群， $\bar { 1 }$ 为它的一个生成元。

定义 7.22 设S是非空有限集， $S _ { n }$ 是S的所有置换的集合，是函数的复合运算。则$( S _ { n } , \circ )$ 是一个群，称作集合S的 n 次对称群（symmetric group of degree n)。对称群 $\cdot ( S _ { n }$)的子群称做S的置换群（permutation group）。

【例7.39】如图7.2所示，一个正三角形可以围绕它的中心旋转 $1 2 0 ^ { \circ }$ ，围绕它的中心旋转 $2 4 0 ^ { \circ }$ ，绕3条对称轴翻转，或者不动。3个顶点在每种变换下都产生一个置换:

$$\pi_{_0} = \begin{pmatrix} 1 2 3 \\ 1 2 3 \end{pmatrix}\tag{不动}$$

$$\pi_{1} = \begin{pmatrix} 1 2 3 \\ 1 3 2 \end{pmatrix}$$

(绕对称轴 $l _ { 1 }$ 翻转）

$$\pi_{_2} = \begin{pmatrix} 1 2 3 \\ 3 2 1 \end{pmatrix}$$

(绕对称轴 $l _ { 2 }$ 翻转）

$$\pi_{3}=\begin{pmatrix}1\ 2\ 3 \\ 2\ 1\ 3\end{pmatrix}$$

(绕对称轴 $l _ { 3 }$ 翻转）

$$\pi_{4}=\begin{pmatrix}1\ 2\ 3 \\ 2\ 3\ 1\end{pmatrix}$$

(围绕中心旋转120°)

$$\pi_{5}=\begin{pmatrix}1\ 2\ 3 \\ 3\ 1\ 2\end{pmatrix}$$

(围绕中心旋转240°)

这6种动作形成一个置换群。

【例7.40】如图7.3所示，一个正方形可以围绕中心旋转 $0^{\circ} 、 90^{\circ} 、 180^{\circ} 、 270^{\circ}$也可以围绕4条对称轴作翻转，这8种动作构成一个置换群。

[page:200]

## 离散数学及应用（第2版）

$$\pi_{_0} = \binom{1\ 2\ 3\ 4}{1\ 2\ 3\ 4}$$

(围绕中心旋转 $0 ^ { \circ } )$

$$\pi_{1}=\begin{pmatrix}1\ 2\ 3\ 4 \\2\ 3\ 4\ 1\end{pmatrix}$$

(围绕中心旋转90°)

$$\pi_{2}=\begin{pmatrix}1\ 2\ 3\ 4 \\ 3\ 4\ 1\ 2\end{pmatrix}$$

$$\pi_{3}=\begin{pmatrix}1\ 2\ 3\ 4 \\ 4\ 1\ 2\ 3\end{pmatrix}$$

(围绕中心旋转180°)

$$\pi_{4}=\begin{pmatrix}1\ 2\ 3\ 4 \\2\ 1\ 4\ 3\end{pmatrix}$$

(围绕中心旋转270°)

(绕对称轴 $l _ { 1 }$ 翻转）

$$\pi_{5}=\begin{pmatrix}1\ 2\ 3\ 4 \\ 4\ 3\ 2\ 1\end{pmatrix}$$

$$\pi_{6}=\begin{pmatrix}1\ 2\ 3\ 4 \\ 1\ 4\ 3\ 2\end{pmatrix}$$

(绕对称轴 $l _ { 2 }$ 翻转）

(绕对称轴 $l _ { 3 }$ 翻转）

$$\pi_{7}=\begin{pmatrix}1\ 2\ 3\ 4 \\ 3\ 2\ 1\ 4 \end{pmatrix}$$

(绕对称轴 $l _ { 4 }$ 翻转）

## 7.2.6 陪集与拉格朗日定理

本节主要讨论群的分解，先给出陪集的定义。

定义 7.23 设(H, ·)是群 $\cdot ( G ,   \cdot )$ 的一个子群， $g { \in } G$ ，则可定义由 $g$ 所确定的H在 $G$ 中的左陪集（left coset）为 $g H = \{ g \cdot h | h \in H \}$ ，简称为H关于 $g$ 的左陪集；定义由 $g$ 所确定的H在 $G$ 中的右陪集（right coset）为 $Hg = \{ h \cdot g | h \in H \}$ ，简称为H关于 $g$ 的右陪集。

【例7.41】设 $G = \{ \pi_{0}, \pi_{1}, \pi_{2}, \pi_{3} \}$ 是一个4次置换群，其中 $\pi_{0}=\begin{pmatrix}1&2&3&4\\1&2&3&4\end{pmatrix}$ $\pi_{1} = \begin{pmatrix} 1 & 2 & 3 & 4 \\ 2 & 1 & 3 & 4 \end{pmatrix}, \quad \pi_{2} = \begin{pmatrix} 1 & 2 & 3 & 4 \\ 1 & 2 & 4 & 3 \end{pmatrix}, \quad \pi_{3} = \begin{pmatrix} 1 & 2 & 3 & 4 \\ 2 & 1 & 4 & 3 \end{pmatrix}$ ，则G上的复合运算如表7.16所示。

[page:201]

## 第7章 代数结构

表 7.16 例 7.41 用表<table><tr><td>0</td><td><eq>\pi _ { 0 }</eq></td><td><eq>\pi _ { 1 }</eq></td><td><eq>\pi _ { 2 }</eq></td><td><eq>\pi _ { 3 }</eq></td></tr><tr><td><eq>\pi _ { 0 }</eq></td><td><eq>\pi _ { 0 }</eq></td><td><eq>\pi _ { 1 }</eq></td><td><eq>\pi _ { 2 }</eq></td><td><eq>\pi _ { 3 }</eq></td></tr><tr><td><eq>\pi _ { 1 }</eq></td><td><eq>\pi _ { 1 }</eq></td><td><eq>\pi _ { 0 }</eq></td><td><eq>\pi _ { 3 }</eq></td><td><eq>\pi _ { 2 }</eq></td></tr><tr><td><eq>\pi _ { 2 }</eq></td><td><eq>\pi _ { 2 }</eq></td><td><eq>\pi _ { 3 }</eq></td><td><eq>\pi _ { 0 }</eq></td><td><eq>\pi _ { 1 }</eq></td></tr><tr><td><eq>\pi _ { 3 }</eq></td><td><eq>\pi _ { 3 }</eq></td><td><eq>\pi _ { 2 }</eq></td><td><eq>\pi _ { 1 }</eq></td><td><eq>\pi _ { 0 }</eq></td></tr></table>

记 $S = \{ \pi _ { 0 } , \pi _ { 1 } \} , T = \{ \pi _ { 2 } , \pi _ { 3 } \}$ ，则 $( S , \circ )$ 是 $( G ,   \circ )$ 的子群。可以计算得到 $\pi _ { 0 } S = S , \pi _ { 1 } S = S , \pi _ { 2 } S = T$ $\pi _ { 3 } S { = } T ,$ $T \cap S = \varnothing$ $T \cup S { = } G$ ，即 $\{ \pi _ { 0 } S , \pi _ { 1 } S , \pi _ { 2 } S , \pi _ { 3 } S \}$ （去掉重复的元素）构成G的一个划分。将这个结果一般化，得到以下定理。

定理 7.20 设(H,·)是群(G，·)的一个子群，在 G上定义二元关系 R 为:对于任意 $a _ { z }$ $b { \in } G , ( a , b ) { \in } R$ 当且仅当 $b ^ { - 1 } a   \in   H$ ，则R是G上的等价关系，且其等价类与相应的左陪集相等，即 $R(a) = aH 。$

证明. 设e是 G 的单位元。

（1）R满足自反性:任意 $a   \in   G$ ，由于 $e ^ { = } a ^ { - 1 } a \in H$ ，有 $$( a , a ) { \in } R \text { 。  }$$

(2） R满足对称性:假设 $a, b \in G, (a, b) \in R$ ，即 $b ^ { - 1 } a { \in } H$ 。由于H是群，因此$a ^ { - 1 } b { = } ( b ^ { - 1 } a ) ^ { - 1 } { \in } H$ ，即 $( b , a ) { \in } R$

（3）R满足传递性:假设 $a , b , c { \in } G , ( a , b ) { \in } R , ( b , c ) { \in } R$ ，即 $b^{-1}a \in H, \quad c^{-1}b \in H$ 。因此$c ^ { - 1 } a   =   ( c ^ { - 1 } b )   \cdot   ( b ^ { - 1 } a )   \in   H ,$ ，即 $( a ,   c ) { \in } R$

由此可知，R是一个等价关系。下面证明 $R(a) = aH 。$

对于任意 $x { \in } R ( a )$ ，有 $( a ,   x ) { \in } R$ ，由对称性得 $( x ,   a ) { \in } R$ ，即 $a ^ { - 1 } x { \in } H .$ 。因此存在 $h   \in   H$ 使得 $a ^ { - 1 } x { = } h$ ，即 $x = a h \in a H$ 得到 $R ( a ) { \subseteq } a H .$

反过来，假设 $x { \in } a H ,$ ，则存在 h∈H使得 x=ah即 $a^{-1}x = h, (x, a) \in R$ ，由对称性得 $( a , x ) { \in } R$即 $x { \in } R ( a )$ 。得到 $a H { \subseteq } R ( a )$ 。故有 $R(a)=aH$ □

注:如在此定理表述中将R的定义改为“对于任意 $a , b { \in } G , ( a , b ) { \in } R$ 当且仅当$b a ^ { - 1 } { \in } H$ ，则R仍是G上的等价关系，不过此时等价类与相应的右陪集相等，即 $R(a) = H a$

推论 设(H,·)是群(G, ·)的一个子群，对于任意 $x , y { \in } G$ ，有

（a）或者xH=yH，或者 $xH \cap yH = \varnothing$ C

（b）或者Hx=Hy，或者 $Hx \cap Hy = \varnothing$

(c) $G = \cup \{ a H | a \in G \} = \cup \{ H a | a \in G \}$

将群G用子群H的互不相同的左陪集来进行划分，称作 G关于子群H的左陪集分解；类似地可以定义G关于子群H的右陪集分解。

定理 7.21 设(H, ·)是群(G, ·)的一个有限子群， $g { \in } G ,$ ，则 $|gH| = |Hg| = |H|$

证明.设 $H = \{ h _ { 1 } , h _ { 2 } , \ldots , h _ { n } \}$ ，则 $g H = \{ g h _ { 1 } , g h _ { 2 } , \ldots , g h _ { n } \}$ 。若有 $g h _ { i } { = } g h _ { j }$ ，则由消去律得到 $h _ { i } { = } h _ { j }$ 。因此 $g h _ { 1 } ,   \mathrm { g } h _ { 2 } ,   \ldots ,   \mathrm { g } h _ { n }$ 中诸项各异，即得 $\left| g H \right| = n = \left| H \right|$ 0

类似可证明 $| H g | = n = | H |$

定理 7.22 设(H, ·)是群(G, ·)的一个有限子群， $S _ { \mathrm { L } } = \{ a H | a \in G \} , S _ { \mathrm { R } } = \{ H a | a \in G \}$ ，则 $\left| S _ { \mathrm { L } } \right| { = }$ $\left| S _ { \mathrm { R } } \right|$ 0

[page:202]

## 202

证明. 只需给出 $S _ { \mathrm { L } }$ 和 $S _ { \mathrm { R } }$ 之间的双射即可。

定义 $f(aH) = Ha^{-1}$ ，则由定理 7.20 及之后的注记可知 aH=bH 当且仅当 $b ^ { - 1 } a { \in } H ,$ ，而$H a ^ { - 1 } { = } H b ^ { - 1 }$ 当且仅当 $b ^ { - 1 } ( a ^ { - 1 } ) ^ { - 1 } { \in } H$ ，即 $b ^ { - 1 } a   \in   H .$ 。因此f是双射。 □

注:该定理说明 $S _ { \mathrm { L } }$ 与 $S _ { \mathrm { R } }$ 的基数相同，即左陪集和右陪集的“个数”相同。

定义7.24 设(H, ·)是群(G, ·)的一个子群，H在G中全体左（右）陪集组成的集合的基数称为 H在 G 中的指数(index)，记作[G:H]。

注:[G:H]可能是有限的，也可能是无限的。在本书中主要讨论[G:H]为有限值的情形。关于有限群的阶有以下重要的结果。

定理7.23 （拉格朗日定理）设(H,·)是有限群(G, ·)的一个子群，则 $| G | = [ G : H ] \cdot | H |$

证明. 假设 G 的左陪集分解为 $G { = } a _ { 1 } H \cup a _ { 2 } H \cup \cdots \cup a _ { k } H ,$ ，其中 $k = [ G : H ]$ 。由定理7.21，$| a _ { i } H | = | H |$ 。因此 $|G| = \sum_{i = 1}^{k} |a_{i}H| = \sum_{i = 1}^{k} |H| = k|H| = [G:H] \cdot |H|$ 口

推论 任何素数阶群不可能有非平凡子群。

【例7.42】 6阶群只能有1、2、3、6阶子群。

注:拉格朗日定理表述的是—m阶群若有n阶子群，则n整除m；但其逆不真即使n能整除m，m阶群也不一定有n阶子群。（参考习题7.91。）

定义 7.25 设(H, ·)是群(G, ·)的一个子群，若对于任意 $g   \in   G$ ，有 $g H = H g$ ，则称(H, ·)是(G, ·)的正规子群(normal subgroup)或正则子群、不变子群，记作 $H \triangleleft G$ 0

在正规子群中左陪集和右陪集相等，因此统称为陪集。

【例7.43】阿贝尔群的子群都是正规子群。

【例7.44】 nZ是Z的正规子群。

定理 7.24 群(G, ·)的子群(H, ·)是(G, ·)的一个正规子群当且仅当对于任意 $g   \in   G$ $h \in$ H，有 $g h g ^ { - 1 } { \in } H _ { \circ }$

证明.（必要性）对于任意 $g { \in } G , h { \in } H$ ，由于 $g H = H g$ ，存在 $h _ { 1 } { \in } H$ 使得 $g h { = } h _ { 1 } g$ ，即$g h g ^ { - 1 }   =   h _ { 1 }   \in   H _ { \circ }$

（充分性）即证明对于任意 $g \in G , \; g H = H g .$ 0

对于任意 $h { \in } H , ~ g h { \in } g H ,$ 由于 $g h g ^ { - 1 } { \in } H ,$ ，存在 $h _ { 1 } { \in } H$ 使得 $g h g ^ { - 1 } { = } h _ { 1 }$ ，即 $g h = h _ { 1 } g \in H g$这表明 $g H { \subseteq } H g$

类似地可以证明 ${ \it H g } { \subseteq } { \it g H } .$ 于是 $g H = H g$ ，即H是G的一个正规子群。

定义 7.26 设(H,·)是(G，·)的一个正规子群，定义 G/H为 $\{ H g | g \in G \}$ ，对于任意Ha, $H b \in G / H$ 定义 G/H上的运算。为 HaHb=Hab，则(G/H，°)构成一个群，称为 G 关于H的商群（quotient group）。

证明.

（1）证明。运算是良性定义的:即若Ha=Hx且 $H b = H y$ ，则 $H x \circ H y = H a \circ H b$

若 $H a = H x = x H , \quad H b = H y = y H$ ，则对于任意 $h   \in   H$ ，存在 $h _ { 1 } , h _ { 2 } { \in } H$ 使得 $h a b = x h _ { 1 } b =$ $x y h _ { 2 } { \in } x y H .$ 。由此得到 $Hab \subseteq xy \\ H = Hxy$ 。类似地可以证明 $H x y \subseteq H a b$ 。因此有 $Hxy = Hab$

（2）。运算的封闭性是显然的。

(3）。运算的结合性由群(G,·)上运算的结合性易得。

[page:203]

## 第7章 代数结构

（4）G/H中存在关于。运算的单位元 $\scriptstyle { H e = H _ { \circ } }$

（5）G/H中任何一个元素都存在关于。运算的逆元: $( H a ) ^ { - 1 } = H a ^ { - 1 }$

因此(G/H, °)构成一个群。

【例7.45】在例7.41中， $G = \{ \pi _ { 0 } , \pi _ { 1 } , \pi _ { 2 } , \pi _ { 3 } \}$ ，其中 $\pi_{0}=\begin{pmatrix}1&2&3&4\\1&2&3&4\end{pmatrix},\pi_{1}=\begin{pmatrix}1&2&3&4\\2&1&3&4\end{pmatrix}$ $\pi_{2}=\begin{pmatrix}1&2&3&4\\1&2&4&3\end{pmatrix},\pi_{3}=\begin{pmatrix}1&2&3&4\\2&1&4&3\end{pmatrix}$ $S = \{ \pi _ { 0 } , \pi _ { 1 } \} , T = \{ \pi _ { 2 } , \pi _ { 3 } \}$ ，则 $G / S = \{ S , T \} = \{ \{ \pi _ { 0 } , \pi _ { 1 } \}$ $\{ \pi _ { 2 } , \pi _ { 3 } \} \}$ ，G/S上运算表如表7.17所示。

表 7.17 例 7.45 用表<table><tr><td>0</td><td><eq>\{ \pi _ { 0 } , \pi _ { 1 } \}</eq></td><td><eq>\{ \pi _ { 2 } , \pi _ { 3 } \}</eq></td></tr><tr><td><eq>\{ \pi _ { 0 } , \pi _ { 1 } \}</eq></td><td><eq>\{ \pi _ { 0 } , \pi _ { 1 } \}</eq></td><td><eq>\{ \pi _ { 2 } , \pi _ { 3 } \}</eq></td></tr><tr><td><eq>\{ \pi _ { 2 } , \pi _ { 3 } \}</eq></td><td><eq>\{ \pi _ { 2 } , \pi _ { 3 } \}</eq></td><td><eq>\{ \pi _ { 0 } , \pi _ { 1 } \}</eq></td></tr></table>

(G/S, °)是一个商群。

## *7.3环与域

本节要讨论含有两个二元运算的代数结构，首先介绍环。

## 7.3.1 环

定义 7.27 设(R, +, ·)为一个代数结构，其中 R是非空集合，+和·是两个二元运算，若

(1）(R,+)构成交换群，

(2）(R, ·)构成半群，

（3）·运算对于+运算满足分配律，

则称(R,+,)是一个环（ring)，通常称+运算为环中的加法，·运算为环中的乘法。

通常将环中加法单位元记作0，乘法单位元（若存在）记作1；对任何元素x，称x的加法逆元为负元，记作-x；若x存在乘法逆元，则称之为逆元，记作 $x ^ { - 1 }$

## 【例7.46】

（a）整数集、有理数集、实数集和复数集关于普通的加法和乘法构成环，分别称为整数环Z，有理数环Q，实数环R和复数环C。

（b）n阶实矩阵集合 $\mathbf { M } _ { n } ($ R)关于矩阵的加法和乘法构成环。

(c）关于x的实系数多项式全体R[x]关于多项式的加法和乘法构成环，称作实系数多项式环。

(d)设 $A = \{ a + bi | a,  b \in \mathbb{Z} \}$ ，其中 $i ^ { 2 } = - 1$ ，则A关于复数加法和乘法构成环，称作高斯整数环。

定理 7.25 设(R,+,)是环，则

（a）对于任意 $a \in R, \quad a \cdot 0 = 0 \cdot a = 0$ (即加法单位元0恰好是乘法的零元)。

[page:204]

## 204

（b）对于任意 $a,   b \in R, \quad (-a) \cdot b = a \cdot (-b) = -(a \cdot b)$ 0

（c）对于任意 $a,b,c \in R, \left ( -a \right ) \cdot \left ( -b \right ) = a \cdot b 。$

（d）对于任意 $a , b , c { \in } R , \quad a { \cdot } ( b { - } c ) { = } a { \cdot } b { - } a { \cdot } c , \quad ( b { - } c ) { \cdot } a { = } b { \cdot } a { - } c { \cdot } a \quad .$

证明.

(a) $a \cdot 0 = a \cdot (0 + 0) = a \cdot 0 + a \cdot 0,$ ，由消去律得 $0 { = } a { \cdot } 0 ,$ ；同理可证明 $0 { \cdot } a { = } 0$

(b) $(-a) \cdot b + a \cdot b = (-a + a) \cdot b = 0 \cdot b = 0$ ，类似地有 $a \cdot b + ( - a ) \cdot b = 0$ ，所以(-a)·b 是 $a \cdot b$ 的加法逆元，即-(a·b)。

同理可证明 $a \cdot ( - b ) = - ( a \cdot b )$ 0

(c) $(-a) \cdot (-b) = -(a \cdot (-b)) = -(-(a \cdot b)) = a \cdot b$

(d) $a \cdot (b - c) = a \cdot (b + (-c)) = a \cdot b + a \cdot (-c) = a \cdot b - a \cdot c, \ (b - c) \cdot a = (b + (-c)) \cdot a = b \cdot a + (-c) \cdot a = b \cdot a - c \cdot a 。$

【例7.47】 在环中计算 $(a + b)^{3}, (a - b)^{2}$

$$\begin{aligned} 解 . (a + b)^{3} &= (a + b) \cdot (a + b) \cdot (a + b) \\&= (a^{2} + b \cdot a + a \cdot b + b^{2}) \cdot (a + b) \\&= a^{3} + b \cdot a^{2} + a \cdot b \cdot a + b^{2} \cdot a + a^{2} \cdot b + b \cdot a \cdot b + a \cdot b^{2} + b^{3} \\(a - b)^{2} &= (a - b) \cdot (a - b) = a^{2} - b \cdot a - a \cdot b + b^{2}\end{aligned}$$

定义 7.28 假设(R, +, ·)是环，则

（a）若环中乘法·满足交换律,则称R是交换环（commutative ring)。

（b）如果对于乘法存在单位元,则称 R是含幺环（ring with identity）。

（c）如果对于任意 $a , b \in R , a \cdot b = 0$ 必然有a=0或b=0，则称其为无零因子环(domain)；换言之，若其是无零因子环，则对于任意 $a, b \in R, a \neq 0$ 且 b≠0 必然有 $a \cdot b \neq 0 .$

(d）若环(R,+,·)是交换、含幺和无零因子的，则称其为整环（integral domain)。

## 【例7.48】

(a）整数环Z、有理数环Q、实数环R和复数环C都是交换环、含幺环、无零因子环和整环。

（b）实系数多项式环R $[ x ]$ 是整环。

(c) $n(n \geq 2)$ 阶实矩阵集合 $\mathbf { M } _ { n } ( \mathbb { R } )$ 关于矩阵的加法和乘法构成环，它是含幺环，但不是交换环和无零因子环，也不是整环。

(d）(2z，+,·)构成交换环和无零因子环，但不是含幺环和整环。

(e) $( \mathbb { Z } / 4 \mathbb { Z } , + _ { 4 } , \times _ { 4 } )$ 是交换环、含幺环(单位元ī)，但不是无零因子环(因为 $\overline { { 2 } } \cdot \overline { { 2 } } = \overline { { 0 } }$和整环。对于一般的n， $( \mathbb { Z } / n \mathbb { Z } , + _ { n } , \times _ { n } )$ 是含幺交换环，称作模n整数剩余类环；可以证明 $( \mathbb { Z } / n \mathbb { Z } , + _ { n } , \times _ { n } )$ 是整环当且仅当n是素数。

定理 7.26 环 $\left[ ( R , + , \cdot ) \right.$ 是无零因子环当且仅当环中乘法运算满足消去律，即对于任意$a,b,c \in R,\ a \neq 0$ ，必有

（1）由 $a \cdot b = a \cdot c$ 可得 $b = c$ ，且

(2)由 $b \cdot a = c \cdot a$ 可得 $b = c$ 0

推论 整环满足消去律。

定义 7.29 假设 $\mathbf { \Phi } _ { \mathbf { \Phi } } ( R , + , \cdot ) ,$ 是环，S是R的非空子集，若S关于环R的加法和乘法也构

[page:205]

## 第7章 代数结构

成一个环，则称S为R的子环（subring）。若S是R的子环，且S⊂R，则称S是R的真子环（proper subring)。

【例7.49】整数环Z、有理数环Q都是实数环R的真子环，也是复数环C的真子环。{0}和R也是实数环R的子环，称为平凡子环。

定理 7.27 设(R, +, ·)是环，S 是 R 的非空子集，若满足

（1）对于任意 $a , b { \in } S , \quad a { - } b { \in } S ,$ 且

(2） 对于任意 $a , b \in S , a b \in S ,$

则S是R的子环。

## 【例7.50】

(a) $( n \mathbb { Z }   , + , \cdot )$ 是整数环的子环。

(b) $\{   \overline { { { 0 } } }   \}  、 \{   \overline { { { 0 } } }   ,   \overline { { { 3 } } }   \}  、 \{   \overline { { { 0 } } }   ,   \overline { { { 2 } } }   ,   \overline { { { 4 } } }   \}$ 、Z/6Z都是 $( \mathbb { Z } / 6 \mathbb { Z }   ,   + _ { 6 } ,   \times _ { 6 } )$ 的子环。

## 7.3.2 域

定义 7.30 设(F，+，·)是代数结构，F是非空集合，+和·是F上的两个二元运算，若满足

(1）(F,+)构成交换群，其中加法单位元记作0，

(2）(F−{0}, ·)构成交换群，

（3）·运算对于+运算满足分配律，则称(F,+,)是一个域（field)。

定理7.28 域是整环。

反之不然，如(Z,+,×)是整环却不是域。但是有如下结果。

定理7.29 有限整环是域。

证明. 假设(F, +, ·)是有限整环， $\lvert F \lvert = \mathrel { n }$ ，只要证明对于任意 $x { \in } F { - } \{ 0 \}$ ，存在 x关于·运算的逆即可。

由鸽巢原理， $x , x ^ { 2 } , \cdots , x ^ { n } , x ^ { n + 1 }$ 中必有两项相同。不妨假设 $x^{m}=x^{l}, 1 \leqslant m < l \leqslant n+1$ ，令l-m=r，于是由整环满足消去律（定理7.26的推论）可得 $x ^ { - 1 }   =   x ^ { r - 1 }$ □

## 【例7.51】

（a）有理数集、实数集和复数集关于普通的加法和乘法都构成域，分别称为有理数域、实数域和复数域。

(b）实系数多项式环R[x]是整环，但不是域。

（c）可以证明对于一般的n， $( \mathbb { Z } / n \mathbb { Z } , + , \times )$ 是域当且仅当n是素数。

(d) $A = \{ a + bi \mid a, b \in \mathbb{Q} \}$ ，其中 $i ^ { 2 } = - 1$ ，其关于复数加法和乘法构成域。

(e) $S = \left\{ a + b \sqrt{3} \mid a, b \in \mathbb{Q} \right\}$ ，其关于实数加法和乘法构成域，乘法单位元是1，对于$a   +   b { \sqrt { 3 } }   \in   S$ ，其关于乘法的逆元是 $\frac{a}{a^{2}-3b^{2}}-\frac{b}{a^{2}-3b^{2}}\sqrt{3}$ 0

[page:206]

## 离散数学及应用（第2版）

## 7.4 作为代数结构的格与布尔代数

“格”还可以从代数结构的角度来定义。

定义7.31 如果非空集合L上的两个二元运算∨和∧满足如下的交换、结合、吸收律，则称(L，∨，∧)是一个格。即对于任意 $a , b , c { \in } L$ ，有

（1）交换律: $a \lor b = b \lor a, a \land b = b \land a$

（2）结合律: $(a \lor b) \lor c = a \lor (b \lor c), (a \land b) \land c = a \land (b \land c)$ 0

（3）吸收律: $a \lor (a \land b) = a, a \land (a \lor b) = a$

（4）幂等律: $a \lor a = a, a \land a = a$

注:幂等律不是必需的，事实上由吸收律，有 $a \lor a = a \lor (a \land (a \lor a)) = a, \quad a \land a = a$类似可得。

【例7.52】 $( \mathbf { D } _ { n } , \mathrm { L C M } , \mathrm { G C D } )$ 是一个格:对于任意 $x , y , z   \in   \mathbf { D } _ { n }$ ，有

$$\mathrm{GCD}(x, x) = x, \quad \mathrm{LCM}(x, x) = x$$

$$\mathrm{GCD}(x, y) = \mathrm{GCD}(y, x), \mathrm{LCM}(x, y) = \mathrm{LCM}(y, x)$$

$$\mathrm{GCD}(x,\mathrm{GCD}(y,z))=\mathrm{GCD}(\mathrm{GCD}(x,y),z)$$

$$\mathrm{LCM}(x,\mathrm{LCM}(y,z))=\mathrm{LCM}(\mathrm{LCM}(x,y),z)$$

$$\mathrm{GCD}(x,\mathrm{LCM}(x,y))=x,\mathrm{LCM}(x,\mathrm{GCD}(x,y))=x$$

关系“|”定义为:xly当且仅当 $\mathrm { L C M } ( x , y ) { = } y$ ，则 $| ( \mathbf { D } _ { n } , \mathbf { \Lambda } | )$ 与 $( \mathbf { D } _ { n } , \mathrm { L C M } , \mathrm { G C D } )$ 是同一个格。

【例7.53】 对于任意集合S，(P(S)，∪，∩)是一个格，而且 $与  (P (S), \subseteq )$ 是同一个格。

定理7.30 定义7.31与定义6.11 是等价的。

证明思路.

（1）利用运算√或∧定义L上的二元关系R:aRb当且仅当 $a \land b = a$

（2）证明R为L上的偏序。

（3）证明(L,R)满足定义6.11。

（4）证明对于L中任意两个元素x、 $y,\ \mathrm{LUB}(x,y)=x\lor y,\ \mathrm{GLB}(x,y)=x\land y 。$

这时可以采用代数的方法定义格的同构。

定义 7.32 设 $(L_1,\ \lor_1,\ \land_1)  和  (L_2,\ \lor_2,\ \land_2)$ 是两个格，如果存在双射 $f { \colon } L _ { 1 } { \to } L _ { 2 }$ ，使得对于任意的 $a , b { \in } L _ { 1 }$ 有

$$f(a \lor_1 b) = f(a) \lor_2 f(b), f(a \land_1 b) = f(a) \land_2 f(b)$$

成立，则称f是格 $L _ { 1 }$ 到 $L _ { 2 }$ 的同构， $L _ { 1 }$ 和 $L _ { 2 }$ 是同构的格。

类似地，布尔代数也可以采用代数的方法定义。

定义7.33 （布尔代数的公理化定义Ⅰ）设(B，V，∧，', 0,1)是代数结构，其中∨和Λ是两个二元运算，'是一个一元运算，0和1是B的两个元素，若对于任意 $a , b , c { \in } B$下述公理成立:

（1）交换律: $a \lor b = b \lor a, a \land b = b \land a$ D

（2）分配律: $a \land (b \lor c) = (a \land b) \lor (a \land c), a \lor (b \land c) = (a \lor b) \land (a \lor c),$ 0

（3）同一律: $a \lor 0 = a, a \land 1 = a$ 0

[page:207]

## 第7章 代数结构

（4）补元律: $a \lor a^{\prime} = 1, a \land a^{\prime} = 0$ 0

则称 $\iota ( B , \vee , \wedge , \prime , 0 , 1 )$ 是一个布尔代数。

定义7.34 （布尔代数的公理化定义Ⅱ）设(B，V，Λ，', 0,1)是代数结构，其中∨和Λ是两个是二元运算，'是一个一元运算，0和1是B的两个元素，若对于任意 $a , b , c { \in } B$下述公理成立:

（1）交换律: $a \lor b = b \lor a, a \land b = b \land a$

（2）分配律: $a \land (b \lor c) = (a \land b) \lor (a \land c), a \lor (b \land c) = (a \lor b) \land (a \lor c)$

（3）吸收律: $a \lor (a \land b) = a, a \land (a \lor b) = a$

（4）结合律: $(a \lor b) \lor c = a \lor (b \lor c), (a \land b) \land c = a \land (b \land c)$ 0

（5）补元律: $a \lor a = 1, a \land a = 0$

则称(B，∨，∧,',0, 1)是一个布尔代数。

注:可以证明，布尔代数的3种定义是等价的。

定理7.31 定义7.33与定义7.34是等价的。

证明.

(1）若代数结构(B，∨，∧,',0,1)满足定义7.34的条件，则

$$\begin{aligned}&a \lor 0 \\=& a \lor (a \land a^{\prime}) \\=& a \\& a \land 1 \\=& a \land (a \lor a^{\prime}) \\=& a\end{aligned}$$

即代数结构(B， ∨，∧,', 0, 1)也满足定义 7.33 的条件。

(2）若代数结构(B，∨，∧,',0, 1)满足定义7.33 的条件，则对于任意 $a   \in   B ,$ ，有

$$\begin{aligned}1 &= a \lor a^{\prime} = a \lor (a^{\prime} \land 1) = (a \lor a^{\prime}) \land (a \lor 1) = 1 \land (a \lor 1) = a \lor 1 \\0 &= a \land a^{\prime} = a \land (a^{\prime} \lor 0) = (a \land a^{\prime}) \lor (a \land 0) = 0 \lor (a \land 0) = a \land 0\end{aligned}$$

于是，

$$\begin{aligned}&a \lor (a \land b) - (a \land 1) \lor (a \land b) - a \land (1 \lor b) - a \land 1 - a \\&a \land (a \lor b) - (a \lor 0) \land (a \lor b) - a \lor (0 \land b) - a \lor 0 - a \\&\quad [a \lor (b \lor c)] \land [(a \lor b) \lor c] \\&= \{ a \land [(a \lor b) \lor c] \lor \{ b \lor c \land [(a \lor b) \lor c] \} \\&= \{ a \land ([a \lor (b \lor c)] \lor (a \lor \{b \lor c\} \lor \{(a \lor b) \lor c\} \{(a \lor b) \lor c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \lor c\} \{(a \land b) \lor c\} \{(a \land b) \lor c\} \{(a \land b) \lor c\} \{(a \land b) \lor c\} \{(a \land b) \lor c\} \{(a \land b) \lor c\} \{(a \land b) \lor c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \{(a \land b) \land c\} \ \end{aligned}$$

[page:208]

## 208

$$\begin{aligned}&=\{\{a\lor(b\lor c)]\land a\}\lor\{[a\lor(b\lor c)]\land b\}\}\lor\{\lor\{[a\lor(b\lor c)]\land b\}\}\lor\{( 由分配律 )\}\\&=\{a\lor\{[a\lor(b\lor c)]\land b\}\lor\{[(a\land c)\lor c]\}\land( 由吸收律 )\}\\&=\{a\lor\{[a\land b)\lor[(b\lor c)\land b]\}\}\lor c\quad( 由吸收律 )\lor\{ 参律 \}\\&=\{a\lor[(a\land b)\lor b]\lor c\quad( 由吸收律 )\land( 参律 )\}\\&=\{a\lor[(a\land b)\lor b]\}\lor c\quad( 由吸收律 )\\&=(a\lor b)\lor c\quad( 由吸收律 )\end{aligned}$$

即结合律成立。于是代数结构 $| ( B , \vee , \wedge , ^ { \prime } , 0 , 1 )$ 也满足定义7.34的条件。 口

这时可以从代数的角度上定义布尔代数之间的同构。

定义 7.35 设 $\scriptstyle { \left( B _ { 1 } , \quad \bigvee , \quad \bigwedge , \quad ^ { \prime } ,   0 , \right. }$ 1)和 $\iota ( B _ { 2 } ,   \pmb { \nabla } ,   \textbf { \Delta } ,   \mathrm { ~ \overline { { ~ \quad } } ~ } ,   \theta ,   e )$ 是两个布尔代数，如果存在双射 $f \colon B _ { 1 } { \to } B _ { 2 }$ ，对于任意的 $a , b   \in   B _ { 1 }$ 有

$$f(a \lor b) = f(a) \lor f(b), \quad f(a \land b) = f(a) \land f(b), \quad f(a') = \overline{f(a)},$$

成立，则称f是布尔代数 $B _ { 1 }$ 到 $B _ { 2 }$ 的同构。

注:由 $f(a \lor b) = f(a) \lor f(b), \quad f(a \land b) = f(a) \land f(b), \quad f(a') = \overline{f(a)}$ 及补元律可得 $f(0) = \theta,$ f(1)=e。

## 习题7

7.1 判断下列说法是否正确。

（a）设S是所有偶数构成的集合，规定S上的二元运算*为 $x * y = 5 \times x \times y$ ，则(S, *)构成一个代数结构。

(b）有理数集合Q在除法“÷”下构成一个代数结构。

（c）有理数集合Q在取绝对值运算下构成一个代数结构。

7.2 设|S=n，则在S上可以定义多少个不同的二元运算？

7.3设 $S = \{ x | x \in \mathbb { Z } ^ { + }$ 且 x<255}，判断以下在S上定义的运算否满足封闭性。

(a) $a \bigcirc b = \max (a, b)$

(b) $a \bigcirc b = \min(a, b).$ 0

(c) $aOb = \operatorname{GCD}(a, b)$

(d) $aOb = \mathrm{LCM}(a, b)$

7.4 举例说明，存在既不满足交换律又不满足结合律的运算。

7.5 设A={1,2,5, 10}，在 A 上定义运算*为 $a{*}b{=}\mathrm{GCD}(a,b)$ ，给出运算*的运算表。

7.6 设S={0,1,2,3}，在 S上定义运算*为 $a * b = (a + ab) \bmod 4$ ，给出运算*的运算表。

7.7 对于以下在R上定义的运算，判断是否满足交换律？是否满足结合律？是否存在单位元和零元？对于 $x \in \mathbb { R }$ ，是否存在x关于的逆元？

(a) $a O b = b$

(b) $a \bigcirc b = |a - b|$

$aOb = a + b - ab$

(d) $a\bigcirc b = a + 2b$

(e) $aOb = \sqrt{a^{2} + b^{2}}$

[page:209]

## 第7章 代数结构

(f) $a \bigcirc b = b + ab$

7.8 给定运算的运算表，如表7.18和表7.19所示，判断:是否满足交换律？是否满足结合律？是否存在单位元和零元？

(a)

表7.18习题7.8（a）用表<table><tr><td>O</td><td><eq>a</eq></td><td><eq>b</eq></td><td>C</td></tr><tr><td><eq>a</eq></td><td><eq>a</eq></td><td>b</td><td>C</td></tr><tr><td><eq>b</eq></td><td><eq>b</eq></td><td><eq>c</eq></td><td>a</td></tr><tr><td>C</td><td>C</td><td>a</td><td>b</td></tr></table>

(b)

表7.19习题7.8（b）用表<table><tr><td>O</td><td>a</td><td><eq>b</eq></td><td><eq>c</eq></td><td><eq>d</eq></td><td>e</td></tr><tr><td>a</td><td>a</td><td><eq>b</eq></td><td><eq>c</eq></td><td><eq>d</eq></td><td>e</td></tr><tr><td><eq>b</eq></td><td><eq>b</eq></td><td>b</td><td><eq>b</eq></td><td><eq>b</eq></td><td>b</td></tr><tr><td>C</td><td>C</td><td>b</td><td><eq>c</eq></td><td>a</td><td>a</td></tr><tr><td><eq>d</eq></td><td><eq>d</eq></td><td><eq>b</eq></td><td><eq>a</eq></td><td><eq>d</eq></td><td>C</td></tr><tr><td>e</td><td>e</td><td>b</td><td><eq>a</eq></td><td><eq>c</eq></td><td>e</td></tr></table>

7.9在 $\mathbb { Z } ^ { + }$ 上定义运算*为 $x * y = \mathrm{LCM}(x, y)$ ，请回答:

（a）*运算是否满足交换性？

（b）*运算是否满足结合性？

（c）*运算是否存在单位元？

(d)*是否存在零元？

7.10 在Z+上定义运算*为 $x * y = x ^ { y }$ 请回答:

（a）*运算是否满足交换性？

（b）*运算是否满足结合性？

（c）*运算是否存在单位元？

（d）*是否存在零元？

7.11 在R×R上定义运算□为 $(a,b) \square (c,d) = (ac, ad + b)$ ，请回答:

（a）□运算是否满足封闭性？

（b）□运算是否满足交换性？

（c）□运算是否满足结合性？

（d）□运算是否存在单位元？

(e）对于(x, y)∈ R×R，是否存在(x, y)关于□的逆元？

7.12 在R×R上定义运算□为 $(a,b) \square (c,d) = (a + c, ad + b)$ ，请回答:

（a）□运算是否满足封闭性？

（b）□运算是否满足交换性？

[page:210]

## 210

（c）□运算是否满足结合性？

（d）□运算是否存在单位元？

(e）对于(x, y)∈ R×R，是否存在(x, y)关于□的逆元？

7.13 在R上定义∇运算为a∇b=(ab)/2，Δ运算为 a∆b=(a+b)/3，请回答:

（a）∇运算是否满足封闭性？Δ运算是否满足封闭性？

（b）∇运算是否满足交换律？Δ运算是否满足交换律？

（c）∇运算是否满足结合律？Δ运算是否满足结合律？

（d）∇运算是否满足幂等律？Δ运算是否满足幂等律？

（e）∇运算和Δ运算是否满足吸收律？

（f）∇运算对于Δ运算是否满足分配律？Δ运算对于∇运算是否满足分配律？

（g）∇运算是否存在单位元？Δ运算是否存在单位元？

（h）∇运算是否存在零元？Δ运算是否存在零元？

（i）对于 x ∈R，是否存在 x关于∇的逆元？是否存在 x关于Δ的逆元？

7.14 在集合 A={-3, -2, −1, 0, 1, 2, 3}上定义 ∇ 运算为 a∇b=min(a， b)，Δ 运算为a∆b=max(a, b)，请回答:

（a）∇运算是否满足封闭性？Δ运算是否满足封闭性？

（b）∇运算是否满足交换律？Δ运算是否满足交换律？

（c）∇运算是否满足结合律？Δ运算是否满足结合律？

（d）∇运算是否满足幂等律？Δ运算是否满足幂等律？

（e）∇运算和Δ运算是否满足吸收律？

（f）∇运算对于Δ运算是否满足分配律？Δ运算对于∇运算是否满足分配律？

（g）∇运算是否存在单位元？Δ运算是否存在单位元？

（h）∇运算是否存在零元？Δ运算是否存在零元？

(i）对于 x ∈R，是否存在 x关于∇的逆元？是否存在 x关于Δ的逆元？

## 7.15 证明定理 7.2。

7.16 证明:若代数结构(A,口)存在单位元 e和零元θ，且A 至少有两个元素，则 e≠θ。

7.17 设*是集合S上的二元运算，在什么情况下，关于*的单位元和零元是S中的同一个元素？在什么情况下，零元存在逆元？

7.18 设□和是集合S上的两个二元运算，而且对于任意x, y∈S，x□y=x。证明:对□满足分配律。

7.19 设A={a, b, c}，定义在A上的二元运算*满足封闭性、交换律、幂等律且 $a * b = c$ $c * b = b$ ，请给出运算*的一个运算表，说明它是否可结合。

7.20 设□和是集合S上的两个二元运算，而且都满足吸收律。证明:□和都满足幂等律。

7.21 设集合A 上运算□和分别具有单位元 $e _ { 1 }$ 和 $e _ { 2 } ,$ 而且对口、口对都满足分配律。证明:对于任意x∈A，有 $x \square x = x \Omega x = x$

$$( 提示:计算  $e _ { 1 } \bigcirc ( e _ { 2 } \bigtriangleup e _ { 1 } )  、  e _ { 2 } \bigtriangleup ( e _ { 1 } \bigcirc e _ { 2 } )  、  ( x \bigcirc e _ { 2 } ) \bigtriangleup ( x \bigcirc e _ { 2 } )  、  ( x \bigtriangleup e _ { 1 } ) \bigcirc ( x \bigtriangleup e _ { 1 } )  。  )$$$

7.22 设A={1,2,3}，B 是A 上所有等价关系的集合。

[page:211]

## 第7章 代数结构

（a）列出B的元素。

（b）给出B上∩运算的运算表。

7.23 设(A, *)是一个半群，而且对于任意 $a,   b \in A,   a \neq b$ ，有 $a * b \neq b * a$

（a）证明:对于任意 $a   \in   A ,$ ，有 $a^{*}a = a$

（b）证明:对于任意 $a , b { \in } { \mathcal { A } } ,$ ，有 $a * b * a = a$

（c）证明:对于任意 $a , b , c { \in } { \mathcal { A } }$ ，有 $a * b * c = a * c$

7.24 在R上定义运算⊗为:对于任意 $x , y \in$ R， $x \otimes y = x + y + xy$ 。证明:(R，⊗)是一个可换亚群。

7.25 定义R+上的运算。为 $a \circ b = \frac{a + b}{1 + ab}$ ，代数结构 $\left| ( \mathbb { R } ^ { + }   ,   \circ ) \right.$ 是半群吗？是亚群吗？

7.26设 $A { = } \{ a , b , c \}$ ，定义在A上的二元运算*满足 $x * y = x$

(a）证明:(A,*)是一个半群。

（b）试通过增加最少的元素使得A扩张成一个亚群。

7.27 设(A,□)是一个亚群， $m { \in } A$ ，在A上定义运算为 $x \bigcirc y = x \bigtriangleup m \bigtriangleup y$ ，证明:(A，○)是一个半群。并请讨论在什么情况 $下 (A,\mathsf{O})$ 是一个亚群。

7.28 在R*上定义*运算为 $a * b = 3ab$ ，证明: $( \mathbb { R } ^ { * } , * )$ 是一个群。

7.29 在Z上定义*运算为 $a * b = a + b - 10$ ，证明:(z，*)是一个群。

7.30 $U_{n}=\left\{x \mid x \in \mathbb{C}, x^{n}=1\right\}$ ，n是一个给定的正整数，证明: $( U _ { n } , \times )$ 是一个群。

7.31 设A=R-{0,1}，在A上定义如下6个函数:

$$f_{1}(x)=x , \quad f_{2}(x)=1-x , \quad f_{3}(x)=\frac{1}{x} , \quad f_{4}(x)=\frac{1}{1-x} , \quad f_{5}(x)=1-\frac{1}{x} , \quad f_{6}(x)=\frac{x}{x-1}$$

证明: $( \{ f _ { 1 } , f _ { 2 } , f _ { 3 } , f _ { 4 } , f _ { 5 } , f _ { 6 } \} , \circ )$ 构成一个群，其中。是函数的复合运算。

7.32 某个通信系统传输的二进制码字格式为 $\boldsymbol{x} = (x_{1}, x_{2}, x_{3}, x_{4}, x_{5}, x_{6}, x_{7})$ ，其中 $x _ { 1 } , x _ { 2 } , x _ { 3 } , x _ { 4 }$是数据位， $x _ { 5 } , x _ { 6 } , x _ { 7 }$ 是校验位，满足 $x_{5}=x_{1}\oplus x_{2}\oplus x_{3},\ x_{6}=x_{1}\oplus x_{2}\oplus x_{4},\ x_{7}=x_{1}\oplus x_{3}\oplus x_{4}.$ 。其中⊕表示异或运算（即模2加法），0⊕0=0，0⊕1=1，1⊕0=1，1⊕1=0（事实上，这就是(7,4)汉明码)。

设S是所有这样码字构成的集合，定义S上的运算为

$$\boldsymbol{x} \oplus \boldsymbol{y} = (x_{1} \oplus y_{1}, x_{2} \oplus y_{2}, x_{3} \oplus y_{3}, x_{4} \oplus y_{4}, x_{5} \oplus y_{5}, x_{6} \oplus y_{6}, x_{7} \oplus y_{7})$$

证明:(S, ⊕)构成一个群。

7.33 完成表7.20所示的运算表，使之成为一个群。

表 7.20 习题 7.33 用表<table><tr><td>*</td><td>a</td><td>b</td><td>C</td><td><eq>d</eq></td></tr><tr><td><eq>a</eq></td><td></td><td></td><td></td><td></td></tr><tr><td><eq>b</eq></td><td></td><td></td><td></td><td><eq>c</eq></td></tr><tr><td><eq>c</eq></td><td></td><td></td><td><eq>b</eq></td><td></td></tr><tr><td><eq>d</eq></td><td></td><td></td><td></td><td></td></tr></table>

7.34 设 G 为非可换的群，证明:G 中存在非单位元 a和 $b , a \not = b$ ，且 $ab = ba$

[page:212]

## 212

7.35 设(G,·)是群，证明:在(G, ·)中，除单位元e外，不可能有任何别的等幂元。

7.36设 $( G , \cdot )$ 是群，且G的阶大于1，证明:在 $[ ( G , \cdot )$ 中不存在零元。

7.37 设代数结构(G,·)满足如下条件:

（1）·运算满足结合律。

(2） 对于任意 $a , b   \in   G$ ，方程 $ax = b$ 在G 中存在唯一解。

（3）对于任意 $a , b   \in   G$ ，方程 $y a { = } b$ 在 G 中存在唯一解。

证明:(G, ·)是群。

7.38 设有限代数结构(G, ·)满足如下条件:

（1）·运算满足结合律。

(2） 对于任意 $a , b , c   \in   G ,$ ，若 $ac = bc$ 则 $a { = } b$ 0

（3）对于任意 $a , b , c   \in   G ,$ ，若 $c a   =   c b$ 则 $a { = } b .$

证明:(G, ·)是群。

7.39设 $( G , \cdot )$ 是群，(A,*)是一个代数结构，f是G到A的一个满射，且满足对于任意 $a ,$ $b { \in } G , f ( a { \cdot } b ) = f ( a ) { \ast } f ( b )$ ，证明:(A，*)是群。

7.40 设(G, ·)是群，定义 G 上的关系 R 为 R={(x, y)|存在 $a   \in   G$ 使得 $y { = } a x a ^ { - 1 } \}$ ，证明:R是G上的等价关系。

7.41 设(G, ·)是群，对于任意 $a   \in   G$ ，都满足 $a ^ { 2 } { = } e$ ，证明:G是可换群。

7.42 证明:群(G,·)是可换群的充要条件是对于任意 $a , b \in G , \left( a \cdot b \right) ^ { 2 } = a ^ { 2 } \cdot b ^ { 2 } .$

7.43 证明:群(G,·)是可换群的充要条件是对于任意 $a , b \in G , \left( a \cdot b \right) ^ { - 1 } = a ^ { - 1 } \cdot b ^ { - 1 }$

7.44 设(G,·)是群，证明:如果对于任意 $a , b   \in   G$ ，都有 $(a \cdot b)^{3} = a^{3} \cdot b^{3}, \quad (a \cdot b)^{4} = a^{4} \cdot b^{4}$ $(a \cdot b)^{5} = a^{5} \cdot b^{5}$ ，则G是可换群。

(提示:计算 $( a { \cdot } b ) { \cdot } ( a { \cdot } b ) ^ { 3 }$ 得到 $a^{3} \cdot b = a \cdot b^{3} \cdot (a \cdot b) \cdot (a \cdot b)^{4}$ 得到 $a^{4} \cdot b = a \cdot b^{4}$ ，之后计算 $a \cdot a ^ { 3 } \cdot b _ { \circ } )$

7.45 对以下各小题给出的群 $G _ { 1 }$ 和 $G _ { 2 }$ 以及函数 $f . G _ { 1 } { \rightarrow } G _ { 2 }$ ，说明f是否是从 $G _ { 1 }$ 到 $G _ { 2 }$ 的同态，是否是从 $G _ { 1 }$ 到 $G _ { 2 }$ 的同构。

$G_{1}=(\mathbb{Z},+), \quad G_{2}=(\mathbb{R}^{*}, \times), \quad f(x)=\left\{\begin{aligned}1 \\ -1\end{aligned}\right.$ x是偶数(a) x是奇数

(b) $G _ { 1 } = ( \mathbb { R } , + ) , \quad G _ { 2 } = ( A , \times )$ ，其中 $A = \{ z \mid z \in \mathbb { C }$ , |z|=1}, $f(x) = \cos x + i \sin x$ 0

(c) $G _ { 1 } = G _ { 2 } = ( \mathbf { M } _ { n } ( \mathbb { R } ) , + ) , f ( \mathbf { A } ) = \mathbf { A } ^ { T } ,$ 其中 $A   \in   \mathbf { M } _ { n } ( \mathbb { R } )$ 0

7.46令 $\omega = \frac{-1 + \sqrt{-3}}{2}$ ，证明: $( \{ 1 , \; \infty , \; \infty ^ { 2 } \}$ ，×)是一个群，其中×是复数乘法，而且其与$( \mathbb { Z } / 3 \mathbb { Z } , + _ { 3 } )$ 同构。

7.47 证明:克莱因四元群和 $\left( \mathbb { Z } / 4 \mathbb { Z } , + _ { 4 } \right)$ 是不同构的。

7.48 证明:例7.26中的两个群A和B是不同构的。

7.49 证明定理 7.6。

7.50 设(G, ·)是群， $a   \in   G$ ，定义G上的函数f为 $f ( g ) { = } a g a ^ { - 1 }$ ，证明:f是G的自同构。

7.51设 $( G , \cdot )$ 是可换群，定义G上的函数f为 $f ( g ) = g ^ { 2 }$ 。证明:f是G的自同态。

7.52设 $( G , \cdot )$ 是群，定义G上的函数f为 $f ( g ) = g ^ { - 1 }$ 。证明:

(a)f是双射。

[page:213]

## 第7章 代数结构

(b) f是 G的自同构当且仅当(G,·)是可换群。

7.53证明: $\phi _ { a } : \mathbb { Z } / n \mathbb { Z } \to \mathbb { Z } / n \mathbb { Z } , \phi _ { a } ( \overline { { x } } ) = \overline { { a x } }$ 是 $( \mathbb { Z } / n \mathbb { Z } , + _ { n } )$ 的一个自同构，当且仅当a与n互素。

7.54 群 G上的自同构全体记作 Aut(G)，证明:Aut(G)关于函数的复合运算构成一个群，称作G的自同构群。

7.55 判断下述子集是否构成(n阶可逆实方阵全体,×)的子群。

（a）n阶可逆对称矩阵全体。

（b）n阶上三角可逆矩阵全体。

（c）行列式的值大于0的n阶矩阵全体。

（d）行列式的值小于0的n阶矩阵全体。

（e）n阶对角可逆矩阵全体。

7.56设 $G { = } \{ A , B , C , D \}$ ，其中 $\boldsymbol{A} = \begin{pmatrix} 1 0 \\ 0 1 \end{pmatrix}$ $\boldsymbol{B} = \begin{pmatrix} -1 & 0 \\ \quad 0 \quad -1 \end{pmatrix}$ $\boldsymbol{C} = \begin{pmatrix} 0 1 \\ -1 0 \end{pmatrix}$ $\boldsymbol{D}=\begin{pmatrix}0 & -1 \\1 & 0\end{pmatrix}$ G上的运算是矩阵乘法。请给出G的所有子群。

7.57一个群能够同构于它的一个非平凡子群么？如果能，试举出一例。

7.58设 $( G , \cdot )$ 是群，C是与G中每个元素都可交换的元素构成的集合，称C是G的中心，证明:C是G的子群。

7.59 设f是群 $G _ { 1 }$ 到 $G _ { 2 }$ 的同态映射，H是 $G _ { 1 }$ 的子群，证明: $f ( H )$ 是 $G _ { 2 }$ 的子群。

7.60 设(G, ·)是群，对于任意的 $a   \in   G ,$ ，令 $H = \{ y | y a = a y , \; y \in G \}$ ，证明:(H,·)是群(G,·)的子群。

7.61 设(H, ·)是群(G, ·)的子群， $a   \in   G$ ，定义 $a H a ^ { - 1 } = \{ a h a ^ { - 1 } | h \in H \}$ 。证明: $a H a ^ { - 1 }$ 是 G 的子群，称作H的一个共轭子群。

7.62 设(H, ·)和(S, ·)都是群(G, ·)的子群。(a）证明:(H∩S, ·)也是(G, ·)的子群。(b）(H∪S, ·)是否一定是(G, ·)的子群？

7.63 设(H, ·)和(S, ·)都是群 $( G ,$ ·)的子群，证明:若 $H \cup S = G$ ，则H=G或 $S { = } G .$ 。即任何一个群都不能是它的两个真子群的并。

7.64 设(H, ·)和(S, ·)都是群(G, ·)的子群，定义 G 上的关系 R 为 $R = \{ (x,y) \}$ 存在 $h \in H , s \in S$使得y=hxs}，证明:R是G上的等价关系。

7.65 证明定理 7.19。

7.66 设(G, ·)是群，e 是单位元，G 上的等价关系 R 满足: $\forall a , b , c { \in } G$ ，若 $( a b ) R ( a c )$ 则 bRc,证明:等价类 $[e] = \{ x | eRx, x \in G \}$ 构成G的子群。

7.67 假设(G, ·)是群，L(G)是 G 的所有子群的集合，即 $L(G) = \{ H | H \leq G \}$ ，证明: $( L ( G ) , \subseteq )$是格，称为G的子群格。

7.68 求群 $( \mathbb { Z } _ { 1 8 } , + _ { 1 8 } )$ 的子群格。

7.69 证明:任何循环群一定是可换群。

7.70 求循环群 $( \mathbb { Z } _ { 1 2 } , + _ { 1 2 } )$ 的所有生成元和子群。

[page:214]

## 214

7.71设 $G { = } ( a )$ 是循环群，s、t是正整数， $A = (a^{s}), \quad B = (a^{t})$ ，求A∩B的一个生成元。

7.72设 $( S _ { 3 } , \mathrm { ~  ~ \circ ~ } )$ 为集合S的3次对称群，定义 $S _ { 3 }$ 上的关系 R 为 R={(x, y)|存在 $a   \in   { \cal S } _ { 3 }$ 使得$y = a \circ x \circ a^{-1}$ ，求等价关系R确定的划分。

7.73 设多项式 $f = (x_{1} + x_{2})(x_{3} + x_{4})$ ，找出使得f保持不变的所有下标的置换，这些置换是否构成 $S _ { 4 }$ 的子群?

7.74 设置换 $a = \begin{pmatrix}1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 \\2 & 3 & 4 & 1 & 6 & 7 & 8 & 5 \\\end{pmatrix}, \quad b = \begin{pmatrix}1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 \\5 & 8 & 7 & 6 & 3 & 2 & 1 & 4 \\\end{pmatrix}$ 。设 $G ^ { = }$ $\{ a ^ { n } b ^ { m } | m$ 和 n 是正整数}。

（a）证明:G是 $S _ { 8 }$ 的子群。

（b）求G的阶。

（c）G是否是交换群？

（d）求G的所有交换子群。

(提示: $a ^ { 2 } { = } b ^ { 2 } , \quad a ^ { 4 } { = } e , \quad b ^ { 4 } { = } e , \quad a b a { = } b , \quad a ^ { 3 } b { = } a b ^ { 3 } { = } b a , \quad b a b { = } a , \quad b ^ { 3 } a { = } b a ^ { 3 } { = } a b _ { \circ } )$

7.75 设G={f|f:R→R $f(x) = ax + b$ 其中 $a , b \in \mathbb { R } , a \neq 0 \}$ ，二元运算是函数的复合。

（a）证明: $( G ,   \circ )$ 是群。

（b）若S 和 T 分别是由 G 中 a=1 和 b=0 的所有函数构成的集合，证明:(S，)和(T, )都是(G, )的子群。

（c）写出 S和T在G中所有的左陪集。

7.76 求群 $( \mathbb { Z } _ { 6 } , + _ { 6 } )$ 的每个子群及其相应的所有左陪集。

7.77求 $( \mathbb { Z } _ { 8 } , + _ { 8 } )$ 中子群 $H = \{ \overline{0}, \overline{4} \}$ 的所有左陪集与右陪集。

7.78 设(G, ·)是群，(H, ·)是群(G, ·)的子群，证明:若 $x { \in } G$ 且 xH 是 G 的子群，则 x∈H。

7.79 设(G, ·)是群，(H, ·)是群(G, ·)的子群，证明:在 H确定的陪集中，只有一个陪集是子群。

7.80 设(H, ·)是群(G,·)的一个子群，对于任意 $x , y   \in   G$ ，证明:

(a) x∈xH, x∈Hx。

(b）若x∈yH，则 $xH = yH;$ 若 $x { \in } H y$ ，则 $H x = H y$

(c）若x∈yH，则 $x ^ { - 1 } y { \in } H ;$ 若 $x   \in   H   y$ ，则 $x y ^ { - 1 } { \in } H$ 0

7.81 设 $A { = } \{ a , b , c , d , e \}$ ，A上的运算*的运算表如表7.21所示。

（a）证明 $\{ e , a \}$ 在*运算下构成一个群。

(b）使用拉格朗日定理证明(A,*)不是群。

表 7.21 习题 7.81 用表<table><tr><td>*</td><td>a</td><td>b</td><td>C</td><td><eq>d</eq></td><td>e</td></tr><tr><td><eq>a</eq></td><td><eq>e</eq></td><td><eq>d</eq></td><td><eq>b</eq></td><td><eq>c</eq></td><td><eq>a</eq></td></tr><tr><td><eq>b</eq></td><td><eq>a</eq></td><td><eq>e</eq></td><td><eq>c</eq></td><td><eq>d</eq></td><td><eq>b</eq></td></tr><tr><td><eq>c</eq></td><td><eq>b</eq></td><td><eq>d</eq></td><td><eq>a</eq></td><td><eq>e</eq></td><td><eq>c</eq></td></tr><tr><td><eq>d</eq></td><td><eq>c</eq></td><td><eq>b</eq></td><td><eq>d</eq></td><td><eq>a</eq></td><td><eq>e</eq></td></tr><tr><td><eq>e</eq></td><td><eq>a</eq></td><td><eq>c</eq></td><td><eq>d</eq></td><td><eq>b</eq></td><td>e</td></tr></table>

[page:215]

## 第7章 代数结构

7.82 设(G，·)是群，e为单位元，证明:G的阶数为偶数当且仅当 G存在中非单位元的元素a使得 $a ^ { 2 } { = } e$（提示:对任意x≠e，考虑 $y { = } x ^ { - 1 }$ 与x的关系；考虑 $( \{ a , e \} , \cdot ) _ { \circ } )$

7.83 若有限可换群G中所有元素的积不等于单位元e，证明:G的阶数为偶数。（提示:反证法，并使用习题7.82的结论。)

7.84 设群(G,·)的阶为 6，证明:G至多有一个阶为3的子群。

7.85 设(H, ·)和(K, ·)分别是群(G, ·)的 r阶和 s 阶子群，证明:若r 和 s 互素，则 $H \cap K = \{ e \}$

7.86设 $i ^ { 2 } = - 1$ ，令 $G = \left\{ \pm \binom{1 \quad 0}{0 \quad 1}, \pm \binom{i \quad 0}{0 \quad -i}, \pm \binom{0 \quad i}{i \quad 0}, \pm \binom{0 \quad 1}{-1 \quad 0} \right\}$ 0

（a）证明:G关于矩阵乘法构成群。

(b）找出 $( G , \times )$ 的所有子群，并画出子群格。

（c）证明:G的所有子群都是正规子群。

7.87 证明:({(1), (1, 2)°(3, 4), (1, 3)°(2, 4), (1, 4)°(2, 3)}, °)是 $S _ { 4 }$ 的正规子群，且与克莱因四元群同构。

7.88 设(S, 口)和 $| ( T , \mathsf { O } ) |$ 都是群，对于任意 $( s _ { 1 } , t _ { 1 } ) , ( s _ { 2 } , t _ { 2 } ) { \in } S { \times } T ,$ ，定义 $(s_{1}, t_{1}) \bullet (s_{2}, t_{2}) = (s_{1} \square s_{2},$ $t _ { 1 } \mathsf { O } t _ { 2 } )$ o

(a）证明:(S×T, ◆)是群，称作 S 和 T 的积群（product group)。

(b）假设 $H = \{ (s, e_2) | s \in S, e_2 \}$ 是 T的单位元}，证明:(H, )是(S×T, )的正规子群。

7.89 设(G, ·)是群，(H1, ·)和(H2, ·)都是群(G, ·)的子群，定义 $H_{1} \cdot H_{2} = \left\{ h_{1} \cdot h_{2} \mid h_{1} \in H_{1}, h_{2} \in H_{2} \right\}$

（a）请问 $H _ { 1 } { \cdot } H _ { 2 }$ 是否一定是 G 的子群？

（b）如果 $H _ { 1 } { \subseteq } H _ { 2 }$ ，那么 $H _ { 1 } { \cdot } H _ { 2 }$ 是否一定是 G 的子群？

（c）证明:若 $H _ { 2 }$ 是 G的正规子群，则 $H _ { 1 } { \cdot } H _ { 2 }$ 是G的子群。

（d）证明: $H _ { 1 } { \cdot } H _ { 2 }$ 是 G 的子群当且仅当 $H_{1} \cdot H_{2} = H_{2} \cdot H_{1}$ J

7.90 设(H, ·)和(S, ·)都是群(G, ·)的正规子群，证明:(H∩S, ·)也是(G, ·)的正规子群。

7.91 设 $( \{ \sigma _ { 1 } , \sigma _ { 2 } , \cdots , \sigma _ { 1 2 } \}$ ,°)是一个置换群，其中$\sigma_{1}=(1), \quad \sigma_{2}=(2,3,4), \quad \sigma_{3}=(2,4,3), \quad \sigma_{4}=(1,2)*(3,4), \quad \sigma_{5}=(1,2,3), \quad \sigma_{6}=(1,2,4).$ $\sigma_{7}=(1,3,2), \quad \sigma_{8}=(1,3,4), \quad \sigma_{9}=(1,3)\circ(2,4), \quad \sigma_{10}=(1,4,2), \quad \sigma_{11}=(1,4,3),$ $\sigma_{12} = (1,4) \circ (2,3)$证明它不存在6阶子群。

7.92 设(G, ·)是 n 阶有限群，e是单位元， $a \in G, \; < a >$ 是由a生成的子群。证明:(a) $\leq a >$ 是(G, ·)的正规子群。(b) $\leq a >$ 的阶数可以整除 $n _ { \mathrm { ~ c ~ } }$ (c) $< a >$ 的阶数是满足 $a ^ { m } { = } e$ 的最小正整数m。(d) $a ^ { n } { = } e .$ o

7.93 设(G, ·)是 n阶群，证明:n 是大于 1 的奇数当且仅当 G 中除单位元的任意元素可以写成另一个元素的平方。(提示:必要性——对任意 $x \neq e$ ，假设<x>的阶数为m，考虑 $x ^ { ( m + 1 ) / 2 }$

[page:216]

## 216

充分性——证明 $f(x) = y, x = y^{2}$ 是双射，并使用习题7.82的结论。)

7.94 设S为下列集合，+和×为普通加法和乘法。问S和+、×能否构成环？能否构成整环？能否构成域？为什么？(a) $S = \{ x | x = 3n, n \in \mathbb{Z} \}$ (b) $S = \{ x | x = 3n + 1, n \in \mathbb{Z} \}$ (c) $S = \{ x | x \in \mathbb{Z}, x \geqslant 0 \}.$ (d) $S = \left\{ x \mid x = a + b \sqrt{2} , a, b \in \mathbb{Q} \right\}$ (e) $S = \left\{ x \mid x = a + b \sqrt[3]{5}, a, b \in \mathbb{Q} \right\}$

7.95 设A 为集合，证明:P(A)关于集合的对称差运算④和集合的交运算∩构成环(P(A),⊕, ∩)。

7.96 设 R是环，a, b∈R，证明:如果 a、b 与 $a b   -   1$ 均可逆，则 $a-b^{-1}  与  (a-b^{-1})^{-1}-a^{-1}$ 也可逆而且 $[ ( a - b ^ { - 1 } ) ^ { - 1 } - a ^ { - 1 } ] ^ { - 1 } = a b a - a$ 0

7.97 设(R, +, ·)是一个环，且对于任意的 $x { \in } R$ ，有 $x \cdot x = x$ ，证明:

（a）对于任意x∈R，有x+x=0。

（提示:计算 $(x + x) \cdot (x + x)$

(b）(R, +, ·)是一个交换环。

（提示:计算 $(x + y) \cdot (x + y)$

7.98 举出满足以下条件的例子:

(a)(R, +, ·)是没有单位元的环，S⊂R，(S, +, ·)是含幺环。

（提示:例如 $R = \left\{ \left( \begin{aligned} a & \quad b \\ 0 & \quad 0 \end{aligned} \right) \Bigg| a,   b \in \mathbb{R} \right\} 。$

(b）(R, +, ·)是含幺环，S⊂R、(S, +, ·)也是含幺环，但是这两个环的单位元不同。

7.99 设S是R上所有函数的集合，定义S上的加法+为 $(f_{1}+f_{2})(x)=f_{1}(x)+f_{2}(x)$ ；定义S上的乘法×为 $\left( f _ { 1 } { \times } f _ { 2 } \right) ( x ) { = } f _ { 1 } ( x ) { \times } f _ { 2 } ( x )$ 。证明:(S, +,×)是含幺交换环。

7.100 设(B， ∨，∧,',0,1)是布尔代数，在 B 上定义运算⊕和⊗为$a \oplus b = (a \land b') \lor (a' \land b), \quad a \otimes b = a \land b$证明:(B,⊕)是一个交换群，(B,⊕,⊗)是一个以1为单位元的含幺交换环。

7.101 在R上定义运算⊕和运算⊗为:对于任意x, y∈ R，x⊕y=x+y-1，x⊗y=x+y-xy。证明(R，⊕,⊗)是一个交换环，并指出其零元和单位元（如果存在)。

7.102 设 R 是含幺环， $u , \nu { \in } R \text { 。 }$ 。证明下述3个命题彼此等价:

(a) $\scriptstyle { \boldsymbol { \mathcal { V } } } = { \boldsymbol { u } } ^ { - 1 }$ 0

(b) $uvu = u, \nu u^{2}v = 1$ 0

(提示: $u \nu { = } ( \nu u ^ { 2 } \nu ) u \nu { = } \nu u ( u \nu u ) \nu , \nu u { = } \nu u ( \nu u ^ { 2 } \nu ) { = } \nu ( u \nu u ) u \nu  。  )$

（c）uvu=u且ν是满足该条件的唯一元素。

（提示:证明 $u v \cdot 1 \cdot u v = u v , \quad v u \cdot 1 \cdot v u = v u \text { 。 }$

7.103 证明定理 7.26。

[page:217]

## 第7章 代数结构

7.104 假设正整数n>1，证明: $( \mathbb { Z } / n \mathbb { Z } , + _ { n } , \times _ { n } )$ 是整环当且仅当n是素数。

7.105 证明定理 7.27。

7.106 假设(R, +, ·)是一个环，a∈R, $R_{1}=\left\{x \mid x \in R, x a=0\right\}$ ，证明: $R _ { 1 }$ 是R的子环。

7.107 假设(R, +, ·)是一个环， $C = \{ x | x \in R \}$ 对任意 $a   \in   R$ ，有 $ax = xa$ ，C称作R的中心，证明:C是R的子环。

7.108 证明:对于任意的素数p， $( \mathbb { Z } / p \mathbb { Z } , + _ { p } , \times _ { p } ) _ { ! }$ 是域。

7.109 完成定理7.30的证明。

7.110 若L是如定义7.31所定义的格，证明:对于任意 $a , b , c { \in } L$ ，有(a) $a \land ( b \lor c ) \geq ( a \land b ) \lor ( a \land c ) .$ (b) $a \lor (b \land c) \leq (a \lor b) \land (a \lor c).$

7.111 在布尔代数(B, ∨，∧,', 0, 1)中，对于任意 $x { \in } B$ ，证明:满足 $x \lor y = 1, x \land y = 0$ 的元素y∈B是唯一的，即 $y = x ^ { \prime }$

7.112 假设某布尔代数(B，∨，∧，',0,1)如定义7.33（或定义7.34）所定义，证明对于所有 $x , y { \in } B ,$ ，有

$$x \lor x = x, \quad x \land x = x$$

(b) $( x ^ { \prime } ) ^ { \prime } { = } x$

$0^{\prime}=1,\ 1^{\prime}=0$

(d) $(x \lor y)' = x' \land y', \quad (x \land y)' = x' \lor y'$ (德·摩根律)

(e) x=y 当且仅当 $(x \land y') \lor (x' \land y) = 0$

7.113 设(B，∨，∧,',0,1)是布尔代数。证明:对所有 $x , y { \in } B$ ，以下三者等价:

(a) $x { \leq } y  。$

(b) $x \wedge y^{\prime} = 0.$ 0

(c) $x ^ { \prime } \vee y { = } 1$ o

7.114 设(B, ∨，∧, ', 0, 1)是布尔代数且 $A \subseteq B$ 。证明: $( { \mathcal { A } } , \vee , \wedge , { ' } , 0 , 1 )$ 是布尔代数当且仅当1∈A且对所有 $x , y { \in } A$ 有 $x \wedge y ^ { \prime } { \in } A$ o

7.115 设(B,∨，∧,',0,1)是布尔代数。证明:对所有 $a , b , c { \in } B$ ，有

$$(a \lor b') \land (b \lor c') \land (c \lor a') = (a' \lor b) \land (b' \lor c) \land (c' \lor a)$$

[page:218]

# 第8章

## 图 论

图论使用图的方法研究客观世界，包括实体物理空间，也包括非实体的观念世界。在图论中，用“顶点”表示事物，用“边”表示事物间的联系。

1736年，数学家欧拉（Leonhard Euler,1707—1783）解决了著名的哥尼斯堡七桥问题，从而奠定了图论的基础。1847年，物理学家基尔霍夫（GustavRobert Kirchhoff，1824—1887）把图论应用于电路网络的研究，引进了“树”的概念，开创了图论应用于工程科学的先例。

伴随着计算机科技的迅猛发展，图论近几十年来发展迅猛，应用范围更加广泛，成为研究和解决许多应用问题的基本工具之一。在解决运筹学、信息论、控制论、网络理论、博弈论、化学、社会科学、经济学、建筑学、心理学、语言学、软件科学、算法学和计算机科学中的问题时，图论扮演着越来越重要的角色，受到工程界和数学界的特别重视，发挥了重要作用。特别是厄多斯(Erdős，1913一1996)首先研究的随机图在复杂网络中的应用，已经产生了大量的成果。

图论研究的课题和包含的内容十分广泛，很难在一本教材中概括它的全貌。限于篇幅，本章仅能介绍一些基本的图论概念、理论以及与实际应用有关的基本图类和算法，为应用、研究和进一步学习提供基础知识。

## 8.1 基本概念

在4.1.3节中，我们曾用图形来表示二元关系，用点表示集合的元素，若aRb则在图中有由点a指向点b的有向线段。本章中的图是这一概念的扩展

## 8.1.1 无向图、有向图和握手定理

定义 8.1 一个无向图（undirected graph或 graph）G 指一个三元组(V，E，γ)，其中

(1) $V = \{ v_{1}, v_{2}, \cdots, v_{n} \}$ 是一个有限集合，称作顶点集，其元素称作顶点、结点或点(vertex/ node/ point)，|称作 G 的阶。

(2) $E = \{ e _ { 1 } , e _ { 2 } , \cdots , e _ { m } \}$ 是一个有限集合，称作边集，其元素称作边（edge/arc/line）。

（3）γ是E到V的元素个数为1或2的子集全体的一个函数，即对于任意 $e { \in } E$ ，有$\chi (e) = \{ u, v \} \subseteq V \setminus (u$ 和ν不必互异），此时u和ν称作边 e的端点（end points)。

【例 8.1】 在图 8.1 中，无向图 $G { = } ( V , E , \gamma )$ ，其中 $V = \{ v_{1}, v_{2}, v_{3}, v_{4} \}$ $E = \{ e _ { 1 } , e _ { 2 } , e _ { 3 } , e _ { 4 } ,$

[page:219]

## 第8章 图论

$$e_{5}\}, \gamma(e_{1}) = \{v_{2}, v_{4}\}, \gamma(e_{2}) = \{v_{2}, v_{3}\}, \gamma(e_{3}) = \{v_{3}, v_{4}\}, \gamma(e_{4}) = \{v_{3}, v_{4}\}, \gamma(e_{5}) = \{v_{4}\} 。$$

若无特殊说明，约定用n表示图G的顶点数，用m表示图G的边数，一个边数为 m的 n 阶图可简称为(n， m)-图。例如图 8.1是一个(4,5)-图。

现实世界中的很多问题都可以表示为图。例如用顶点来表示城市，如果两个城市之间有火车可以直达，就用边将表示这两个城市的点连接起来，这样就形成了一个图；再如将工厂表示为顶点，两个工厂之间若存在业务联系，则用边将它们对应的顶点相

连，这样就构成了工厂间的业务联系图。

和生活中或几何中的“图”不同，图论研究的对象“图”的顶点是可以任意游走的，边也可以拉伸，表示顶点的圆点和表示边的线的形状、相对位置没有实际意义，我们关心的是其间的关系。所以一个图的图形表示法可能不是唯一的，从几何上看来完全不同的图在图论中可能代表了相同的图。

【例8.2】图8.2中(a)和(b)表示的实际上是同一个无向图。

定义 8.2 假设 G=(V, E, γ)为无向图， $e { \in } E$ ，若 $\gamma ( e ) = \{ u , v \}$ ，则称e是u与ν之间的一条边，称 u 和ν是相邻顶点（adjacent vertices)，并称边 e 分别与 u 和ν相关联；若u=ν，则称e为一个自环或简称环（loop）。

定义 8.3 假设 G=(V, E, γ)为无向图，若 G 的两条边 $e _ { 1 }$ 和 $e _ { 2 }$ 都与同一个顶点关联，则称 $e _ { 1 }$ 和 $e _ { 2 }$ 是邻接的（adjacent）或相邻的。

定义 8.4 假设 $G { = } ( V , E , \gamma )$ 为无向图，若G中关联同一对顶点（允许相同）的边多于一条，则称这些边为重边或平行边（paralleledges)，这些边的条数称作重边的重数。

定义 8.5 假设G=(V，E，γ)为无向图，ν∈V，顶点ν的度数（degree）deg(v)是G中与ν关联的边的数目（自环在计度数时为2)。图G中最大的点度数和最小的点度数分别记为∆(G)和δ(G)。

定义 8.6 假设G=(V，E，γ)为无向图，G 中度数为零的顶点称为孤立顶点（isolated vertex)；图中度数为1的顶点称为悬挂点（pendant vertex)，与悬挂点相关联的边称为悬挂边（pendant edge)；图中度数为k的顶点称为k度点；图中度数为奇数的顶点称为奇度点，图中度数为偶数的顶点称为偶度点。

【例 8.3】 在图8.1中， $\deg(v_{1}) = 0, \deg(v_{2}) = 2, \deg(v_{3}) = 3, \deg(v_{4}) = 5$ $\nu _ { 2 }$ 和 $\nu _ { 3 }$ 是相邻顶点，且是 $e _ { 2 }$ 的两个端点； $\nu _ { 1 }$ 和 $\nu _ { 4 }$ 是不相邻的顶点； $\nu _ { 1 }$ 是孤立顶点， $e _ { 3 }$ 和 $e _ { 4 }$ 是重边， $e _ { 1 }$和 $e _ { 4 }$ 是邻接边， $e _ { 2 }$ 和 $e _ { 5 }$ 不相邻， $e _ { 5 }$ 是环。

定义8.7 不存在自环和重边的无向图称为简单图。

[page:220]

## 220

【例 8.4】图8.1所示的图不是简单图，而图8.3所示的图是简单图。

对于无向简单图而言，由于每条边可以使用顶点对唯一表示，因此可以用 $\gamma ( e )$ 代表 e，例如图 8.3 表示的图也可以简写为 $G { = } ( V ,$ E)，其中 $V = \{ v _ { 1 } , v _ { 2 } , v _ { 3 } , v _ { 4 } \} , E = \{ \{ v _ { 2 } , v _ { 4 } \} , \{ v _ { 2 } , v _ { 3 } \} , \{ v _ { 3 } , v _ { 4 } \} \}$ ，有时也将边 $\{ u , v \}$ 简写为 uν（此时将 uν 和 vu 视为等同)。

下面介绍图论中最基本的定理，它是欧拉在解决哥尼斯堡七桥问题时建立的第一个图论结果。

定理8.1（图论基本定理/握手定理）假设 $G { = } ( V , ~ E , ~ \gamma )$ 为无向图，则有$\sum_{v \in V} \deg(v) = 2 \left| E \right|$ ，即所有顶点度数之和等于边数的两倍。

证明.可使用归纳法证明:

（1）当边数为0时，每个顶点都是孤立顶点，因此 $\sum_{v \in V} \deg(v) = 0 = 2 \mid E \mid$ 成立。

（2）每增加一条边时，该边的两个端点（可能是同一个顶点）的度数都增加1，因此 $\sum \limits _ { v \in V } \deg ( v )$ 增加2，E增加1。

由（1）、（2）可知定理成立。

【例8.5】在图8.1中， $\deg(v_{1}) = 0, \deg(v_{2}) = 2, \deg(v_{3}) = 3, \deg(v_{4}) = 5; 0 + 2 + 3 + 5 = 10 = 2 \times |E|$推论在任何无向图中，奇数度的顶点数必是偶数。

证明. 设 $V _ { \mathrm { o } }$ 和 $V _ { \mathrm { e } }$ 分别是图 G 的奇度点集合和偶度点集合，则由定理 8.1 有$\sum_{v \in V} \deg(v) = \sum_{v \in V_0} \deg(v) + \sum_{v \in V_e} \deg(v) = 2 \left| E \right|$ o

由于 $\sum \limits _ { v \in V _ { \mathsf { e } } } \deg ( v )$ 是偶数之和，从而 $\sum_{v \in V_{\mathrm{o}}} \deg(v) = 2 \mid E \mid - \sum_{v \in V_{\mathrm{e}}} \deg(v)$ 必然也是偶数，而只有偶数个奇数的和才为偶数，即 $\left| V _ { 0 } \right|$ 必须是偶数。

【例8.6】假设一共有9个工厂，证明:

（a）在它们之间不可能每个工厂都只与其他3个工厂有业务联系。

(b）在它们之间不可能只有4个工厂与偶数个工厂有业务联系。

证明.将每个工厂用一个点表示，在有业务联系的两个工厂之间加边，则可构成一个无向图。

（a）如果每个工厂都只与其他3个工厂有业务联系，那么图G中每个点的度数都是3，与定理8.1的推论矛盾。

（b）如果只有4个工厂与偶数个工厂有业务联系，则有5个工厂与奇数个工厂有业务联系，即图G中有5个顶点具有奇数度数，与定理8.1的推论矛盾。

【例8.7】证明:不存在具有奇数个面而且每个面都具有奇数条棱的多面体。

证明.假设存在这样的多面体。作无向图G，其以多面体的面作为图的顶点，如果两个面之间存在公共的棱，则在代表这两个面的两个顶点之间添加一条边。根据假设，为奇数，而且对于任意 $v \in V , \deg ( v )$ 也是奇数，这与定理8.1的推论矛盾。

由无向图中各顶点的度数构成的序列称为该图的一个度数序列。例如图8.1的一个

[page:221]

## 第8章 图论

度数序列是0,2,3,5。

定理 8.2 对给定的非负整数序列 $d _ { 1 } , d _ { 2 } , \cdots , d _ { n }$ ，存在以 $d _ { 1 } , d _ { 2 } , \cdots , d _ { n }$ 为度数序列的 n阶无向图G当且仅当 $\sum _ { i = 1 } ^ { n } d _ { i }$ 是偶数。

证明.将顶点度数为奇数的顶点两两配对，两点之间连一条边，而后在每个顶点处不断增加自环即可。 □

下面介绍几类常用的特殊图。

定义 8.8 假设 G=(V, E， γ)为无向图，若 G 中所有顶点都是孤立顶点，则称 G 为零图（null graph）或离散图（discrete graph)；若||=n，|E|=0，则称G为n 阶零图。

定义8.9 所有顶点的度数均相等的无向图称为正则图（regular graph)；所有顶点的度数均为k的正则图称为k度正则图，也记作k-正则图。

注:零图是零度正则图。

【例 8.8】 图8.4中(a)、(b)、(c)、(d)都是3度正则图。

定义8.10 任意两个相异顶点都相邻的简单图称为完全图（complete graph），n阶完全图记为 $K _ { n \circ }$

注:显然， $K _ { n }$ 是 n-1 度正则图。

如果记 $V { = } \{ 1 , 2 , \cdots , n \}$ ，则完全图的边集是 $E = \{ \{ u , v \} | 1 \leqslant u < v \leqslant n \}$

【例8.9】 图8.5是一些常用的完全图。

定理 8.3 n阶完全图中的边数是 ${ \frac { 1 } { 2 } } n ( n   -   1 )$

证明.因为完全图中每点的度都是n-1，故 $\sum_{v \in V} \deg(v) = n(n - 1)$ ，于是由定理8.1，边数为 ${ \frac { 1 } { 2 } } n ( n - 1 )$ 口

定义8.11 如果图的顶点集V由集合{0,1}上的所有长为n的二进制串组成，两个顶点邻接当且仅当它们的标号序列仅在一位上数字不同。这样的简单图称作n-立方体

[page:222]

## 222

(n-cube)图，记作 $\mathcal { Q } _ { n }$ 或者 $B_{n} ; n \geq 3$ 时，又称为n维超立方体（hypercube）图。

在n-立方体图中，两个顶点 $x _ { 1 } x _ { 2 } { \cdots } x _ { n }$ 与 $y _ { 1 } y _ { 2 } { \cdots } y _ { n }$ 邻接，当且仅当在一个坐标上的数字不同，即 $\sum_{i = 1}^{n} \left| x_{i} - y_{i} \right| = 1$ 0

【例8.10】 图8.6 显示了 $B_{1} 、 B_{2} 、 B_{3}$ 和 $B _ { 4 }$

定义 8.12 假设 $V = \{ 1, 2, \cdots, n \} (n \geqslant 3), E = \{ \{ u, v \} | 1 \leqslant u, v \leqslant n, u - v \equiv 1 (\bmod n) \}$ ，则称简单图 G(V, E)为圈图（cycle graph)，记作 $C _ { n \circ }$

定义 8.13 假设 $V = \{ 0, 1, 2, \cdots, n \} (n \geqslant 3), E = \{ \{ u, v \} | 1 \leqslant u, v \leqslant n, u - v \equiv 1 (\bmod n) \}$或者 $u = 0 , v \geqslant 1 \}$ ，则称简单图 G(V, E)为轮图（wheel graph)，记作 $W _ { n } ,$

从直观上讲，轮图 $W _ { n }$ 就是在圈图 $C _ { n }$ 中增加一个顶点连接所有其他顶点。

【例 8.11】 n=3, 4, 5, 6 的圈图 $C _ { n }$ 见图8.7。

【例8.12】 n=3,4,5,6的轮图 $W _ { n }$ 见图8.8。

定义 8.14 若简单图 $G { = } ( V , \; E )$ 的顶点集V存在一个划分 $\{ V _ { 1 } , V _ { 2 } \}$ 使得G中任一条边的两端分别属于 $V _ { 1 }$ 和 $V _ { 2 }$ ,则称 G是二部图(bipartite graph)，此时也可以将 G 写作 $G { = } ( V _ { 1 }$ $V _ { 2 } , E )$ 。如果 $V _ { 1 }$ 中的每个顶点都与 $V _ { 2 }$ 中每个顶点相邻，则称G是完全二部图（complete bipartite graph)，记作 $K _ { r , s }$ ，其中 $r = | V _ { 1 } | , s = | V _ { 2 } | , V _ { 1 }$ 和 $V _ { 2 }$ 称作G 的互补顶点子集。

[page:223]

## 第8章 图论

【例8.13】图8.9中，(a)和(b)都是二部图，(a)是完全二部图 $K _ { 3 , 3 }$ ，而(b)不是完全二部图；(c)和(d)都不是二部图。

如果边存在方向，就得到了有向图。

定义 8.15 一个有向图（directed graph 或 digraph）G 指一个三元组 $\mathbf { . } ( V , E , \gamma )$ ，其中:

(1) $V = \{ v_{1}, v_{2}, \cdots, v_{n} \}$ 是一个有限集合，称作顶点集，其元素称作顶点（vertex）或结点。

(2) $E = \{ e _ { 1 } , e _ { 2 } , \cdots , e _ { m } \}$ 是一个有限集合，称作边集，其元素称作边（edge）。

(3) $\gamma$ 是E到 $V   \times   V$ 的一个函数，对于任意 $e { \in } E$ ，若 $\gamma (e) = (u, v) \in V \times V$ ，则u称作边 $e$的始点，ν称作边e的终点。

注:在本章中如不加特殊声明，所提及的“图”均泛指无向图和有向图，即它既可以表示无向图又可以表示有向图。

【例8.14】如图8.10所示，有向图 $G { = } ( V , E , \gamma )$ 中 $V = \{ v _ { 1 } , v _ { 2 } , v _ { 3 } , v _ { 4 } \} , E = \{ e _ { 1 } , e _ { 2 } , e _ { 3 } , e _ { 4 } \}$ $e_{5}\}, \quad \gamma(e_{1}) = (v_{4}, v_{2}), \quad \gamma(e_{2}) = (v_{3}, v_{2}), \quad \gamma(e_{3}) = (v_{3}, v_{4}), \quad \gamma(e_{4}) = (v_{4}, v_{3}), \quad \gamma(e_{5}) = (v_{4}, v_{4}).$

例如城市间的道路如果有单行线，那么就应该将其抽象为有向图模型；再如图8.11所示的程序流程图，也可以抽象为有向图模型。

[page:224]

## 224

在有向图中，由于边存在方向性，因此点的度数的概念稍有不同。

定义 8.16 假设 $G { = } ( V , E , \gamma )$ 为有向图，ν∈V，顶点ν的入度（in-degree）deg¯(v)是以ν为终点的有向边的数目，出度（out-degree）deg+(v)是以ν为始点的有向边的数目，顶点ν的度数 $\deg(v) = \deg^{-}(v) + \deg^{+}(v)$ 0

【例8.15】在图8.12中， $\deg^{+}(v_{1}) = 0, \deg^{-}(v_{1}) = 0, \deg^{+}(v_{2}) = 0, \deg^{-}(v_{2}) = 2, \deg^{+}(v_{3}) = 2,$ $\deg^{-}(v_{3}) = 1, \deg^{+}(v_{4}) = 3, \deg^{-}(v_{4}) = 2$

定理 8.4 对于任意有向图(V, E, γ)，有 $\sum_{v \in V} \deg^{+}(v) = \sum_{v \in V} \deg^{-}(v) = |E|$ 0

证明.任何一条有向边，在计算顶点度数时提供一个出度和一个入度。因此，任意有向图出度之和等于入度之和等于边数。 □

定义 8.17 假设 $G { = } ( V , E , \gamma )$ 为图，W是E到R的一个函数，则称(G,W)是一个赋权图（weighted graph)，对于e∈E，W(e)称作边e的权重（weight）或简称权。

在赋权图中，习惯上将边的权重标在边的旁边，例如图8.13就是一个赋权图。

## 8.1.2 图的同构与子图

一个图的图形表示不一定是唯一的，有很多表面上看来不同的图之间的差别仅在于顶点和边的名称的差异，而从邻接关系的意义上看，它们本质上都是一样的，可以把它们看成是同一个图的不同表现形式。这就是图的同构概念。

定义 8.18 设 $G _ { 1 } { = } ( V _ { 1 } , E _ { 1 } , \gamma _ { 1 } )$ 和 $G_{2}=(V_{2},E_{2},\gamma_{2})$ 是两个无向图，如果存在 $V _ { 1 }$ 到 $V _ { 2 }$ 的双射f和 $E _ { 1 }$ 到 $E _ { 2 }$ 的双射 $g$ ，满足对于任意的 $e { \in } E _ { 1 }$ ，若 $\gamma _ { 1 } ( e ) { = } \{ u , v \}$ ，则 $\gamma _ { 2 } ( g ( e ) ) { = } \{ f ( u ) , f ( v ) \}$ ，则称 $G _ { 1 }$ 和 $G _ { 2 }$ 是同构的（isomorphic），并记之为 $G_{1}  空  G_{2}$ 0

将定义叙述改为“满足对于任意的 $e { \in } E _ { 1 }$ ，若 $\gamma _ { 1 } ( e ) { = } ( u , v )$ ，则 $\gamma _ { 2 } ( g ( e ) ) = ( f ( u ) , f ( v ) )$ ，则该定义也适用于有向图。

【例8.16】图8.14中(a)和(b)是同构的，点集之间的双射函数是 $f(v_{1}) = a, \quad f(v_{2}) = b$

[page:225]

## 第8章 图论

$f(v_{3}) = c, f(v_{4}) = d$ ，边集之间的双射函数是 $g(e_i) = E_i, \quad i = 1, 2, \cdots, 6 。$

易知，图之间的同构关系是一种等价关系。由于我们感兴趣的主要是图的结构和性质，因此在本书中不区别同构的图，即只考虑等价类中的代表元素，而不再标出图的全部顶点名称和边的名称。

【例 8.17】 图 8.16 中(a)、(b)、(c)、(d)和(e)是同构的，称作彼得森图(Peterson graph)。

【例8.18】画出所有不同构的具有4个顶点、3条边的简单图。解. 如图8.16所示。

目前尚没有一个有效的方法可以判定两个图是否同构，下面给出图同构的一些必要条件:

（a）同构的图顶点数相同。

（b）同构的图边数相同。

（c）同构的图顶点度数序列在不计次序的情况下相同。

但是同时满足这3个条件的两个图也可能不同构。

【例8.19】 图8.17的(a)和(b)满足上述3个条件，但是彼此不同构。

定义 8.19 假设 G=(V, E)是一个 n 阶简单图，令 $E ^ { \prime } = \{ \{ u , v \} \mid u , v \in V , u \neq v , \{ u , v \} \notin E \}$则称 $( V , E ^ { \prime } )$ 为G的补图（complement graph），记作 $\scriptstyle { \overline { { G } } }   =   \left( V , E ^ { \prime } \right)$ 。若 $G$ 与 $\bar { G }$ 同构，则称 $G$

[page:226]

## 离散数学及应用（第2版）

是自补图(self-complementary graph)。

从直观上说，n阶简单图G的补图就是完全图 $K _ { n }$ 去除G的边集后得到的图。

【例 8.20】 在图 8.18中，(a)的补图是(b)。

定义 8.20 设 $G = (V_1, E_1, \gamma_1)$ 和 $H = (V_{2}, E_{2}, \gamma_{2})$ 是两个图，若满足 $V_{2} \subseteq V_{1} 、 E_{2} \subseteq E_{1}$ ，及$\gamma _ { 2 } = \gamma _ { 1 } \left| _ { E _ { 2 } } \right.$ ，即对于任意 $e { \in } E _ { 2 }$ ，有 $\gamma _ { 2 } ( e ) { = } \gamma _ { 1 } ( e )$ ，则称H是G的子图（subgraph)。当 $V _ { 2 } { = } V _ { 1 }$时，称H是G 的生成子图或支撑子图；当 $E _ { 2 } { \subset } E _ { 1 }$ 或 $V _ { 2 } { \subset } V _ { 1 }$ 时，称H是G的真子图；当$V _ { 2 } { = } V _ { 1 }$ 且 $E _ { 2 } { = } E _ { 1 }$ 或 $E _ { 2 } { = } \varnothing$ 时，称H是G的平凡子图。

定义 8.21 设 $H = (V_{2}, E_{2}, \gamma_{2})$ 是 $G { = } ( V _ { 1 } ,   E _ { 1 } ,   \gamma _ { 1 } )$ 的子图，若 $E_{2}=\left\{ e \mid \gamma_{1}(e)=\left\{ u, v \right\} \subseteq V_{2} \right\}$ ，即$E _ { 2 }$ 包含了图G中 $V _ { 2 }$ 之间的所有边，则称H是G的导出子图。

【例 8.21】在图8.19中， $H _ { 1 }$ 是G 的子图， $H _ { 2 }$ 是 G 的导出子图， $H _ { 3 }$ 是 G 的支撑子图， $H _ { 4 }$ 不是G的子图。

下面介绍构造子图的几种常用方法。

定义8.22 设ν是图G的一个顶点，从G中删去顶点ν及其关联的全部边以后得到的图称为G的删点子图，记为 $G { - } \nu ;$ 显然它是G的导出子图。

【例8.22】 图 8.20(a)为图 G，(b)为图 $G { - } \nu _ { \circ }$

定义 8.23 设e是图G的一条边，从G 中删去边e之后得到的图称为 G的删边子图，记为 $G { - } e _ { \circ }$ 显然它是G的支撑子图。

【例 8.23】 图 8.21(a)为图 G，(b)为图 $G { - } e .$

[page:227]

## 第8章 图论

## 8.1.3 道路、回路与连通性

定义 8.24 有向图G=(V, E， γ)中的一条道路（path）π是指一个点-边序列 $\nu _ { 0 } ,   e _ { 1 } ,   \nu _ { 1 }$ $e _ { 2 } , \cdots , \nu _ { k - 1 } , e _ { k } , \nu _ { k }$ ，满足对于所有 $i = 1 , \cdots , k , \gamma ( e _ { i } ) = ( v _ { i - 1 } , v _ { i } )$ ，称 $\pi$ 是从 $\nu _ { 0 }$ 到 $\nu _ { k }$ 的道路。如果 $\nu _ { 0 } { = } \nu _ { k }$ ，则称 $\pi$ 是回路（circuit）。 $\nu _ { 0 }$ 称为道路π的起点， $\nu _ { k }$ 称为π的终点，k称为 $\pi$的长度。如果在道路/回路 $\pi$ 中各边互异，则称π是简单道路（simple path）/简单回路(simple circuit)。如果在道路/回路π中，除 $\nu _ { 0 }$ 和 $\nu _ { k }$ 外，图中每个顶点至多出现一次，则称π是初级道路/初级回路；初级回路也称作圈（cycle）。

注:

(a)类似地可以定义无向图 $G { = } ( V , E , \gamma )$ 中的道路π为点-边序列 $v _ { 0 } , e _ { 1 } , v _ { 1 } , e _ { 2 } , \cdots , v _ { k - 1 } , e _ { k } ,$ $\nu _ { k }$ ，满足对于所有 $i = 1 , \cdots , k , \gamma ( e _ { i } ) = \{ v _ { i - 1 } , v _ { i } \}$ 。继而可以定义无向图中的回路、道路端点、长度、简单道路/简单回路、初级道路/初级回路。

(b)对于简单图而言，由于每条边可以使用顶点对唯一表示，因此道路 $v _ { 0 } , e _ { 1 } , v _ { 1 } , e _ { 2 } , \cdots ,$ $\nu _ { k - 1 } ,   e _ { k } ,   \nu _ { k }$ 也可以仅用顶点序列 $\nu _ { 0 } , \nu _ { 1 } , \cdots , \nu _ { k }$ 表示。

【例8.24】在图8.22中， $v _ { 3 } , e _ { 2 } , v _ { 2 } , e _ { 1 } , v _ { 4 } , e _ { 5 } , v _ { 4 }$ 是一条简单道路但不是初级道路， $\nu _ { 3 } ,$ $e _ { 2 } , \nu _ { 2 } , e _ { 1 } , \nu _ { 4 }$ 是一条初级道路， $v _ { 3 } , e _ { 3 } , v _ { 4 } , e _ { 4 } , v _ { 3 }$ 是一条简单回路。

定理8.5 假设简单图G 中每个顶点的度数都大于1，则G中存在回路。

证明. 假设 $\pi \colon \nu _ { 0 } , \nu _ { 1 } , \cdots , \nu _ { k - 1 } , \nu _ { k }$ 是图G 中最长的一条初级道路，显然 $\nu _ { 0 }$ 和 $\nu _ { k }$ 都不会与不在道路 $\pi$ 上的任何顶点相邻，否则将可以产生更长的一条道路。但是 $\deg ( v _ { 0 } ) > 1$ ，因此必定存在π上的顶点 $\nu _ { i }$ 与 $\nu _ { 0 }$ 相邻，于是产生了回路（如图8.23所示）。 □

定义 8.25 假设u和ν是无向图或有向图G 中的两个顶点，如果 $u { = } \nu$ 或者图中存在从u到ν的道路，则称u到ν是可达的（reachable)，否则称u到ν是不可达的。

注:容易看出，可达性是无向图的顶点集上的一个等价关系。

【例 8.25】在图8.24 中， $\nu _ { 3 }$ 到 $\nu _ { 2 }$ 是可达的， $\nu _ { 2 }$ 到 $\nu _ { 3 }$ 是不可达的。

定义8.26 假设G是无向图，如果图中任意两相异点之间都存在道路，则称G为连通的（connected）或连通图；否则称图G是不连通的（disconnected)。

注:定义1阶简单图也是连通图。

定义8.27 假设无向图G的顶点集V在可达关系下的等价类为 $\{ V _ { 1 } , \; V _ { 2 } , \; \cdots , \; V _ { k } \}$ ，则G关于 $V _ { i }$ 的导出子图称作图 G的一个连通分支（connected component)，其中 $i {=} 1, 2, \; \cdots, k_{\circ}$

注:连通图是只有一个连通分支的无向图。

【例8.26】 图8.25是有3 个连通分支的非连通图。

定义 8.28 假设 G=(V, E, γ)是连通图，若 $e { \in } E$ ，且 $G { - } e$ 不连通，则称e是图 G 中一

[page:228]

## 228

条割边或桥（bridge）。

【例 8.27】图8.26 中， $e _ { 1 }  、  e _ { 2 }$ 都是桥，而 $e _ { 3 }$ 1 $e _ { 4 }$ $e _ { 5 }$ 都不是桥。

注:图中每条悬挂边都是桥。

定理8.6 连通图中边e是桥当且仅当e不属于图中任意一条回路。

对于有向图而言，连通性的情况要复杂些。

定义8.29假设G是有向图，如果忽略图中边的方向后得到的无向图是连通的，则称G为连通的或有向连通图；否则称图G是不连通的。

定义 8.30 假设G 是有向连通图，如果对于图中任意两个顶点 u和ν，u 到ν和ν到 u都是可达的，则称G为强连通的（strongly connected)；如果对于图中任意两个顶点u和ν，u到ν和ν到u至少之一是可达的，则称图G是单向连通的。

注:强连通图必是单向连通图，单向连通图必是有向连通图。但是这两个命题反过来并不成立。

定义8.31 假设G 是有向图，如果图中不存在有向回路，则称G为有向无环图(Directed Acyclic Graph)，简记作 DAG。

【例8.28】图8.27中的(a)是强连通的，(b)是单向连通的但不是强连通的，(c)是有向连通的但不是单向连通的；(a)和(b)都不是DAG，(c)是DAG。

## 8.1.4 图的矩阵表示

图用图形表示的优点是直观形象，但是当顶点数和边数的值比较大时，这种方法不是很方便。图论中的图主要研究的是顶点集以及顶点之间是否具有某种关系，因此可以仿照之前的关系矩阵，用矩阵形式来表示图，以便于用代数方法研究图的性质，也便于计算机处理。

定义8.32 设G是有向图，顶点集为 $V = \{ v_{1}, v_{2}, \cdots, v_{n} \}$ 。构造矩阵 $\boldsymbol{A} = (a_{ij})_{n \times n}$ ，其中:

$$a_{ij} = \begin{cases}m, &  若存在  m  条  \nu_i  到  \nu_j  的有向边  \\0, &  若不存在  \nu_i  到  \nu_j  的有向边 \end{cases}$$

则称A 是有向图 G 的邻接矩阵（adjacent matrix)。

[page:229]

## 第8章 图论

有向图G的邻接矩阵A具有如下性质:

（a）A中第i行元素之和为顶点 $\nu _ { i }$ 的出度，即 $\sum_{j = 1}^{n} a_{ij} = \deg^{+}(v_{i})$

(b）A中第i列元素之和为顶点 $\nu _ { i }$ 的入度，即 $\sum_{j = 1}^{n} a_{ij} = \deg^{-}(v_{i})$

(c）A 在普通乘法意义下的 k 次幂 $A ^ { k }$ 的第i行第 $i j$ 列元素值为 $G$ 中从 $\nu _ { i }$ 到 $\nu _ { j }$ 的长度为k的不同道路数目。

对于无向图也可以类似地定义邻接矩阵。

定义 8.33 设G是无向图，顶点集为 $V = \{ v_{1}, v_{2}, \cdots, v_{n} \}$ 。构造矩阵 $\boldsymbol{A} = (a_{ij})_{n \times n}$ ，其中:

$$a_{ij} = \begin{cases}m, &  若存在  m  条以  v_i  到  v_j  为两端的边 , \\0, &  若  v_i  到  v_j  不相邻 \end{cases}$$

则称A 是无向图G的邻接矩阵。

无向图G的邻接矩阵A具有如下性质:

（a）A是对称矩阵。

(b）A中第i行元素之和等于第i列元素之和，为顶点 $\nu _ { i }$ 的度数，即 $\sum _ { j = 1 } ^ { n } a _ { i j } = \sum _ { j = 1 } ^ { n } a _ { j i } =$ $\deg ( v _ { i } )$ 0

(c）A在普通乘法意义下的 k次幂 $A ^ { k }$ 的第i行第j列元素值为G中从 $\nu _ { i }$ 到 $\nu _ { j }$ 的长度为k的不同道路数目。

【例8.29】 图 8.28 的邻接矩阵是 $\boldsymbol{A} = \begin{pmatrix}0 & 0 & 0 & 0 \\0 & 0 & 0 & 0 \\0 & 1 & 0 & 1 \\0 & 1 & 1 & 1\end{pmatrix}$ $\boldsymbol{A}^{3} = \begin{pmatrix}0 & 0 & 0 & 0 \\0 & 0 & 0 & 0 \\0 & 2 & 1 & 2 \\0 & 3 & 2 & 3\end{pmatrix}$ 中 $a _ { 4 2 } { = } 3$ 表

明从 $\nu _ { 4 }$ 到 $\nu _ { 2 }$ 有3条长度为3的不同道路:

$$v _ { 4 } , e _ { 5 } , v _ { 4 } , e _ { 4 } , v _ { 3 } , e _ { 2 } , v _ { 2 }$$

$$v _ { 4 } , e _ { 5 } , v _ { 4 } , e _ { 5 } , v _ { 4 } , e _ { 1 } , v _ { 2 }$$

$$v _ { 4 } , e _ { 4 } , v _ { 3 } , e _ { 3 } , v _ { 4 } , e _ { 1 } , v _ { 2 }$$

【例 8.30】 图 8.29的邻接矩阵是 $\boldsymbol{A} = \begin{pmatrix}0 & 0 & 0 & 0 \\0 & 0 & 1 & 1 \\0 & 1 & 0 & 2 \\0 & 1 & 2 & 1\end{pmatrix}$ $\boldsymbol{A}^{3} = \begin{pmatrix}0 & 0 & 0 & 0 \\0 & 5 & 8 & 9 \\0 & 8 & 8 & 15 \\0 & 9 & 15 & 15\end{pmatrix}$ 中 $a _ { 2 2 } { = } 5$

表明从 $\nu _ { 2 }$ 到 $\nu _ { 2 }$ 有5条长度为3的不同回路:

[page:230]

## 离散数学及应用（第2版）

$$\begin{array} { r } { \nu _ { 2 } , e _ { 2 } , \nu _ { 3 } , e _ { 3 } , \nu _ { 4 } , e _ { 1 } , \nu _ { 2 } , } \\ { \nu _ { 2 } , e _ { 2 } , \nu _ { 3 } , e _ { 4 } , \nu _ { 4 } , e _ { 1 } , \nu _ { 2 } , } \\ { \nu _ { 2 } , e _ { 1 } , \nu _ { 4 } , e _ { 3 } , \nu _ { 3 } , e _ { 2 } , \nu _ { 2 } , } \\ { \nu _ { 2 } , e _ { 1 } , \nu _ { 4 } , e _ { 4 } , \nu _ { 3 } , e _ { 2 } , \nu _ { 2 } , } \\ { \nu _ { 2 } , e _ { 1 } , \nu _ { 4 } , e _ { 5 } , \nu _ { 4 } , e _ { 1 } , \nu _ { 2 } , } \end{array}$$

对于二部图 $G { = } ( X , Y , E )$ ，还可以采用矩阵形式来表示。例如图8.30(a)的矩阵形式就是图 8.30(b)。

## 8.2欧拉图

18世纪时，普列戈利亚（Pregel）河流经东普鲁士的哥尼斯堡（Königsberg，今名加里宁格勒，属俄罗斯)，将该市陆地分成了4个部分:两岸及两个河心岛。陆地间共有7座桥相通（如图8.31所示）。当时的居民一直在议论一个话题:能否从任何一块陆地出发，通过每座桥一次且仅一次，最后又返回出发点？

欧拉在1736年解决了这一问题，发表了图论史上第一篇重要文献，标志着图论的开端。

欧拉注意到行人在同一块陆地内部如何行走与问题无关，因此他用顶点a、b、c、d

[page:231]

## 第8章 图论

分别表示4块陆地，用边来表示连接陆地的桥。这样，他就将这个实际问题转化为在图8.32所示的图中寻找包括每条边一次且仅一次的回路。本节即介绍解决这一问题的相关概念和方法。

定义 8.34 通过图 G中每条边一次且仅一次的道路称作该图的一条欧拉道路(Eulerian path)；通过图 G 中每条边一次且仅一次的回路称作该图的一条欧拉回路(Eulerian circuit)；存在欧拉回路的图称为欧拉图（Eulerian graph)。

注:欧拉道路是经过所有边的简单道路，欧拉回路是经过所有边的简单回路。

【例8.31】图8.33中的(a)存在欧拉回路，(b)不存在欧拉回路但是存在欧拉道路，(c)不存在欧拉道路。

欧拉在1736年给出了欧拉道路/回路存在的必要条件；1873年，希尔霍尔策（Car1 Hierholzer）首次给出了刻画欧拉图的充要条件。

定理8.7 无向图G是欧拉图当且仅当G是连通的而且所有顶点都是偶数度。

证明.（必要性）假设无向图G是欧拉图，即图中存在欧拉回路，则沿着该回路朝一个方向前进时，经一条边进入某顶点后必定经由另一条边离开，因此每个顶点都和偶数条边关联，即各顶点的度都是偶数。

（充分性）设连通图G的顶点都是偶数度，采用构造法证明欧拉回路的存在性。从任意点 $\nu _ { 0 }$ 出发，构造G的一条简单回路C:由于各顶点的度均是偶数，因此不可能停留在某点 $\nu _ { i } { \neq } \nu _ { 0 }$ 上而不能继续向前构造，因此最终一定能够回到 $\nu _ { 0 } ,$ ，构成简单回路C（如图 8.34(a)加粗边所示)。

若C包含了G中的所有边，它即是G的欧拉回路。否则，从G中删去C的各边及孤立顶点（如果存在)，得到 $G _ { 1 }$ ，显然 $G _ { 1 }$ 中各顶点的度仍然是偶数。由于原图是连通的，$G _ { 1 }$ 和原图的其他部分必然有公共顶点u。从这一点出发，在原图的剩余部分中重复上述步骤得到回路 $C ^ { \prime }$ （如图8.34(b)加粗边所示）。将C和C'连接起来得到包含边数比原来更多的G的一条简单回路（如图8.34(c)加粗边所示)。不断重复上述构造过程，最终可以构造出包含图G所有边的回路，即G的一条欧拉回路。 □

[page:232]

## 232

定理 8.8 无向图 G 存在欧拉道路当且仅当 G 是连通的而且 G 中奇数度顶点不超过两个。

证明.（必要性）设连通图G含有一条欧拉道路L，则在L中除起点与终点外，其余每个顶点都与偶数条边相关联，因此，G中最多有两个奇数度的顶点。

（充分性）若G没有奇数度顶点，则由定理8.7，G存在欧拉回路，其就是一条欧拉道路。

若G有两个奇数度顶点 u和ν，则在图G 中添加边uν得到G'，由定理8.7，G'存在欧拉回路C。从C中去掉边uv，则得到一条简单道路L，其两个端点是u和ν，并且包含了G的全部边，即L是G的一条欧拉道路。 口

由定理8.8知道，图8.32所示图的4个顶点都是奇数度顶点，因此不存在欧拉道路，所以哥尼斯堡七桥问题不存在满足要求的路线。

【例8.32】图8.35中的(a)、(b)所有顶点都是偶数度，因此它们都是欧拉图；(c)中有两个奇数度顶点，因此不存在欧拉回路，但是存在欧拉道路；(d)中有8个奇数度顶点，因此不存在欧拉道路。

前面讨论了欧拉道路存在性的判定问题，下面介绍弗勒里（Fleury）于1883年提出的在存在欧拉道路/回路的无向图中构造该道路/回路的算法:

## 弗勒里算法 Fleury (G)

输入:至多有两个奇数度顶点的图 $G { = } ( V , E   ,   \gamma )$

输出:以序列形式呈现的欧拉回路/道路π

1 选择图中一个奇数度顶点 v∈V，如果图中不存在奇数度顶点，则任意选取一个顶点 v，道路序列 π←V

2如果 $\mid   E   \mid   \neq   0$ ，则

2.1 如果与v关联的边多于一条，则任选其中不是桥的一条边 e；否则选择桥e

2.2 假设 e的两个端点是 v和 u，π $\cdot { \mathcal { K } } ^ { \circ }   \in   ^ { \circ } { \mathcal { U } } ,$ v←u

2.3 删除边e及孤立顶点（如果存在）

2.4 返回步骤2

3 输出序列π

表8.1给出了弗勒里算法的一个实例。

定理 8.9 假设连通图 G 中有 k 个度为奇数的顶点，则 G 的边集可以划分成 k/2 条简单道路，而不可能分解为k/2-1或更少条简单道路。

[page:233]

## 第8章 图论

(b)(a)表 8.1 弗勒里算法实例<table><tr><td>选择的边e</td><td>顶点ν</td><td>当前的道路π</td><td><eq>G</eq></td></tr><tr><td></td><td><eq>\nu _ { 1 }</eq></td><td><eq>\nu _ { 1 }</eq></td><td></td></tr><tr><td><eq>e _ { 1 }</eq></td><td><eq>\nu _ { 2 }</eq></td><td><eq>\nu _ { 1 } ,   e _ { 1 } ,   \nu _ { 2 }</eq></td><td></td></tr><tr><td><eq>e _ { 2 }</eq></td><td><eq>\nu _ { 3 }</eq></td><td><eq>v _ { 1 } , e _ { 1 } , v _ { 2 } , e _ { 2 } , v _ { 3 }</eq></td><td></td></tr><tr><td><eq>e _ { 4 }</eq></td><td><eq>\nu _ { 4 }</eq></td><td><eq>\nu _ { 1 } , e _ { 1 } , \nu _ { 2 } , e _ { 2 } , \nu _ { 3 } , e _ { 4 } , \nu _ { 4 }</eq>(注意此时不能选择桥<eq>e _ { 3 } )</eq></td><td><eq>v _ { 5 } \underline { \hphantom { v _ { 5 } } \hphantom { v _ { 5 } } \hphantom { v _ { 5 } } e _ { 6 } \hphantom { v _ { 6 } } \hphantom { v _ { 6 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } e _ { 3 } \hphantom { v _ { 3 } } e _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { v { 3 } } \hphantom { v _ { 3 } } \hphantom { v _ { 3 } } \hphantom { { 3 } } \hphantom { v _ { 3 } } \hphantom { v { 3 } } \hphantom { v _ { 3 } } \hphantom { { 3 } } \hphantom { v { 3 } } \hphantom { v _ { 3 } } \phantom { } \phantom { v { 3 } } \phantom { v _ { 3 } } \phantom { 3 } \phantom { v { } } \phantom { v _ { 3 } } \phantom { 3 } \phantom { v { } } \phantom { 3 } \phantom { v { } } \phantom { v _ { 3 } } \phantom { } \phantom { 3 } \phantom { } \phantom { } \phantom { v { } 3 } \phantom { v } \phantom { } \phantom { } \phantom { \phantom { } \</eq>es054</td></tr><tr><td><eq>e _ { 5 }</eq></td><td><eq>\nu _ { 5 }</eq></td><td><eq>\nu _ { 1 } , e _ { 1 } , \nu _ { 2 } , e _ { 2 } , \nu _ { 3 } , e _ { 4 } , \nu _ { 4 } , e _ { 5 } , \nu _ { 5 }</eq></td><td><eq>e _ { 6 }</eq>    <eq>\frac { v _ { 3 } } { - \diamond }</eq>     <eq>e _ { 3 }</eq><eq>v _ { 5 0 }</eq>     <eq>\multimap v _ { 1 }</eq></td></tr><tr><td><eq>e _ { 6 }</eq></td><td><eq>\nu _ { 3 }</eq></td><td><eq>\nu _ { 1 } , e _ { 1 } , \nu _ { 2 } , e _ { 2 } , \nu _ { 3 } , e _ { 4 } , \nu _ { 4 } , e _ { 5 } , \nu _ { 5 } , e _ { 6 } , \nu _ { 3 }</eq></td><td><eq>\begin{array} { r l r l r l } { { v _ { 3 } } } &amp; { { } } &amp; { e _ { 3 } } &amp; { { } } &amp; { { } } &amp; { { } } &amp; { { } } &amp; { { v _ { 1 } } } \end{array}</eq></td></tr><tr><td><eq>e _ { 3 }</eq></td><td><eq>\nu _ { 1 }</eq></td><td><eq>\nu _ { 1 } , e _ { 1 } , \nu _ { 2 } , e _ { 2 } , \nu _ { 3 } , e _ { 4 } , \nu _ { 4 } , e _ { 5 } , \nu _ { 5 } , e _ { 6 } , \nu _ { 3 } , e _ { 3 } , \nu _ { 1 }</eq></td><td><eq>\circ v _ { 1 }</eq></td></tr></table>

证明.由握手定理知k必定是偶数。将这k个顶点两两配对后增添互不相邻的k/2条边，得到一个无奇数度顶点的连通图G'。由定理8.7，图 $G ^ { \prime }$ 中存在欧拉回路C。在C中删去增添的这k/2条边，便得到了k/2条简单道路，它们包含了原图G中的所有边。

假设图G的边集可以分为q条简单道路，则在图G中添加q条边可以得到欧拉图 $G ^ { \prime } ,$因此图中所有顶点都是偶数度，而每添加一条边最多可以将两个奇度点变为偶度点，即有2q≥k。

【例8.33】图8.36(a)所示的图中有8个奇数度顶点，因此可以将它的边集分解为4条简单道路，如图8.36(b)所示。

无向图的欧拉道路问题及其有关结果很容易推广到有向图中。

定理8.10 有向图G 中存在欧拉回路当且仅当 G是连通的，而且 G中每个顶点的入度都等于出度。有向图G中存在欧拉道路但不存在欧拉回路当且仅当G是连通的，除两个顶点外，其余每个顶点的入度都等于出度，而且这两个顶点中一个顶点的入度比出度大1，另一顶点的入度比出度小1。

此定理的证明与定理8.7、定理8.8的证明类似。

【例8.34】图8.37中，(a)存在欧拉回路；(b)不存在欧拉回路，但是存在欧拉道路；(c)不存在欧拉道路。

[page:234]

## 离散数学及应用（第2版）

## 8.3 哈密顿图

1857年爱尔兰数学家哈密顿（William Rowan Hamilton，1805—1865）发明了“周游世界”玩具:用一个正十二面体的20个顶点代表世界上20个大城市，30条棱表示这些城市之间的交通线路（如图8.38(a)所示）。要求游戏者从任意一个城市（即顶点）出发，沿棱行走经过每个城市一次且只经过一次，最终返回出发地。

后来由于立体的玩具不太好用，又诞生了它的木板状的版本（如图8.38(b)所示）。

问题的实质是:在图8.38(b)所示的连通图中，是否存在包含所有顶点的初级回路？这个问题的解（之一）由图8.38(c)给出。更重要的是，由此引出了哈密顿道路和哈密顿回路的概念。

定义 8.35 通过图 G中每个顶点一次且仅一次的道路称作该图的一条哈密顿道路(Hamiltonian path)；通过图G中每个顶点一次且仅一次的回路称作该图的一条哈密顿回路（Hamiltonian circuit)；存在哈密顿回路的图称为哈密顿图（Hamiltonian graph)。注:

(a)由定义可以看出，图G中是否存在自环和重边不影响哈密顿道路/回路的存在性，因此之后只须考虑简单图的情况。

（b）哈密顿图中一定不存在悬挂边。

（c）存在哈密顿道路的图中不存在孤立顶点。

【例8.35】图8.39中，(a)存在哈密顿回路；(b)不存在哈密顿回路，但是存在哈密顿道路；(c)不存在哈密顿道路。

【例8.36】 图8.40(a)中没有哈密顿回路。

解.将图中顶点分为两类(在图8.40(b)中分别用实心顶点和空心顶点表示)，如果图中存在哈密顿回路，它一定是两种顶点交错出现的初级回路。但图中实心顶点有7个，空心顶点有9个，无法组成满足要求的初级回路。因此G中没有哈密顿回路。

[page:235]

## 第8章 图论

【例8.37】有7位科学家参加一个会议，已知A只会讲英语，B会讲英语和汉语，C可以讲英语、意大利语和俄语，D会日语和汉语，E会德语和意大利语，F会讲法语、日语和俄语，G可以讲德语和法语。可否安排他们在一个圆桌围坐，使得相邻的科学家都可以使用相同的语言交流。

解.用顶点表示科学家，如果两位科学家有共同语言则在代表他们的顶点之间连 一条边，可以形成如图8.41(a)所示的图。一个满足要求的排座位方案即是图中的一个哈密顿回路（如图8.41(b)加粗边所示）。

尽管欧拉图问题与哈密顿图问题类似，但是后者却要困难得多（NPC问题)，至今尚未找到一个简单的充分必要条件去判定一个图是否哈密顿图。哈密顿图的刻画一直是图论中的重要课题之一，本节将介绍几个基本结果。

定理 8.11 设 $G { = } ( V , \; E )$ 是 $n (n \geqslant 2)$ 阶简单图，如果G中任一对顶点u和ν都满足$\deg(u) + \deg(v) \geqslant n - 1$ ，则G中存在哈密顿道路。

证明.n=2时易验证定理成立，下面假设 $n   \geqslant   3$

首先证明 G是连通图。否则，图G至少有两个连通分支 $G _ { 1 } { = } ( V _ { 1 } , E _ { 1 } )$ 和 $G_{2} = \left( V_{2}, E_{2} \right)$任取 $v _ { 1 } \in V _ { 1 } , v _ { 2 } \in V _ { 2 }$ ，得 $\deg(v_{1}) + \deg(v_{2}) \leqslant |V_{1}| - 1 + |V_{2}| - 1 = n - 2$ ，与条件矛盾。

接下来，采用构造法证明图G存在哈密顿道路。假设 $\pi \colon \nu _ { 1 } , \nu _ { 2 } , \cdots , \nu _ { k - 1 } , \nu _ { k }$ 是图 G 中最长的一条初级道路（易知 $k \geq 3$ ，显然 $\nu _ { 1 }$ 和 $\nu _ { k }$ 都不会与不在道路π上的任何顶点相邻，否则将可以产生更长的一条道路。

若 $k { = } n$ ，则该初级道路经过了G的全部顶点，即是G中的一条哈密顿道路。

若 $k { \leq } n$ ，下面证明因此必定存在比π更长的初级回路，由而导致矛盾。

首先证明必定存在 $1   \leq   i   \leq   k$ 使得 $\{ v _ { 1 } , v _ { i } \} \in E , \{ v _ { i - 1 } , v _ { k } \} \in E$ (如图 8.42所示)。

如若不然，假设与 $\nu _ { 1 }$ 相邻的顶点为 $\nu _ { i _ { 1 } } , \nu _ { i _ { 2 } } , \cdots , \nu _ { i _ { t } }$ ，则 $\nu _ { k }$ 必定与 $\mathcal { V } _ { i _ { 1 } - 1 } , \mathcal { V } _ { i _ { 2 } - 1 } , \cdots , \mathcal { V } _ { i _ { t } }$ -1

[page:236]

## 236

不相邻，于是 $\deg(v_{1}) + \deg(v_{k}) \leqslant t + (k - 1 - t) = k - 1 < n - 1$ ，与已知条件矛盾。

因此必定存在1<i≤k使得 $\{ v _ { 1 } , v _ { i } \} \in E , \{ v _ { i - 1 } , v _ { k } \} \in E$ ，于是可以得到初级回路 $\nu _ { 1 } , \nu _ { 2 } , \cdots ,$ $\nu _ { i - 1 } , \; \nu _ { k } , \; \nu _ { k - 1 } , \; \cdots , \; \nu _ { i } , \; \nu _ { 1 }$ (如图8.43 中加粗边所示)，即 G中存在仅经过这k个顶点的初级回路C。不妨对C上的顶点重新编号，使得回路C的形式为 $\nu _ { 1 } , \nu _ { 2 } , \cdots , \nu _ { k - 1 } , \nu _ { k } , \nu _ { 1 }$ (如图 8.44(a)所示)。

然后证明存在比π更长的初级道路，因而导致矛盾。

因为 G 是连通图且 $k { \leq } n$ ，所以一定存在C之外的顶点与C中某点相邻，不妨假设顶点u与v相邻，于是可以得到长度为k+1的初级道路 $\nu _ { j + 1 } , \nu _ { j + 2 } , \cdots , \nu _ { k } , \nu _ { 1 } , \nu _ { 2 } , \cdots , \nu _ { j } , u$ (如图 8.44(b)中加粗边所示)。 □

定理 8.12 设 $G { = } ( V , \; E )$ 是 $n (n \geqslant 3)$ 阶简单图，如果G中任一对顶点u和ν都满足$\deg(u) + \deg(v) \geqslant n$ ，则G是哈密顿图。

证明. 由定理8.11，G中存在哈密顿道路: $\nu _ { 1 } ,   \nu _ { 2 } ,   \cdots ,   \nu _ { n - 1 } ,   \nu _ { n }$ (必要时对顶点重新编号)。类似于定理8.11的证明过程，可得到必定存在 $1   \leq   i   \leq   n$ 使得 $\{ v _ { 1 } , v _ { i } \} \in E , \{ v _ { i - 1 } , v _ { n } \} \in E$并由此可以构造一条哈密顿回路。 □

推论1 设 $G { = } ( V , E )$ 是 $n (n \geqslant 3)$ 阶简单图，如果G中任一顶点的次数都至少是 $n / 2$则G是哈密顿图。

【例8.38】当 $n { \geq } 2$ 时，完全图 $K _ { n }$ 是哈密顿图。

推论2 设 G 是一个(n, m)简单图，若 $m \geqslant (n^{2} - 3n + 6)/2$ ，则G是哈密顿图。

证明. 如果图中存在两个顶点 u,v，使得 $\deg(u) + \deg(v) < n$ ，则在图G 中删去这两个点，构成 n-2 阶简单图 $G^{\prime} 。 G^{\prime} 中$ 的边数为 $m' \geq m - (\deg(u) + \deg(v)) > (n^2 - 3n + 6)/2 - n -$ $( n { - } 2 ) ( n { - } 3 ) / 2$ ，与 $G ^ { \prime } )$ 是简单图矛盾。

因此，G中任一对顶点u和ν都满足 $\deg(u) + \deg(v) \geqslant n$ ，由定理8.12，G是哈密顿图。

注意，上述结果都是充分条件，不满足这些条件的图也可能是哈密顿图，例如图8.45所示的图显然是哈密顿图，但是它每个顶点的度数都是2，不满足定理8.12的条件。

[page:237]

## 第8章 图论

【例8.39】假设在 $n (n \geqslant 4)$ 个人中，任意两人合在一起能认识其余的n-2个人，则他们可以围成一圈，使相邻者相识。

证明.以每个人为一个顶点，相识者之间加边，便构成一个图G。问题转化为证明图G是哈密顿图。由题意可知对于任意两顶点u、v，有 $\deg(u) + \deg(v) \geqslant n - 2$ o

若u、ν代表的两人相识，则 $\deg(u)+\deg(v)\geqslant n-2+1+1=n.$

若u、ν代表的两人不相识，他们两人合在一起能认识其余的n-2个人。假设存在顶点w与u相邻，则必然有w与ν相邻，否则u、w代表的两人合在一起仍然不认识ν代表的人。同理，若存在顶点w与ν相邻，则必然有w与u相邻。这说明u、ν代表的两人都认识其余的全部n-2个人，于是 $\deg(u)+\deg(v)=n-2+n-2\geqslant n$

由定理8.12可知图中存在哈密顿回路，即所有人可以围成一圈，使相邻者相识。□

下面介绍一个与哈密顿道路/回路相关的有趣问题——骑士巡游 $\left( \mathrm{Knjht}'   \mathrm{s}   \mathrm{tour} \right)$在8×8的国际象棋盘的某一位置上放置一个棋子马(亦称骑士)，然后采用国际象棋中“马走日字”的规则前进，要求经过棋盘上每个小格子一次且仅一次。根据是否要求棋子马最终回到出发点，又可以把骑士巡游问题分为骑士巡游道路问题和骑士巡游回路问题。例如图8.46(a)是一个骑士巡游道路，图8.46(b)是一个骑士巡游回路。

而后人们又把骑士巡游问题推广到一般的 $m \times n (m \leqslant n)$ 棋盘上，施文克（Schwenk）证明，除了以下3种情况外， $m \times n (m \leqslant n)$ 棋盘上都存在骑士巡游回路:

（1）m和 n都是奇数而且 $n { \neq } 1$ 0

(2) m=1, 2, 4。

（3）m=3而且 $n = 4,6,8.$ 0

虽然骑士巡游回路的存在性已经得到了证明，但它的构造算法仍是一个活跃的课题。

另一个与哈密顿回路相关的问题是旅行商问题(Traveling Saleman Problem，TSP)，又称作旅行推销员问题、货郎担问题。问题的描述是:有一个推销员，要到n个城市推销商品，这n个城市两两之间的距离是已知的，他希望找到一条最短的路线，走遍所有的城市，最后再回到他出发的城市。使用图论的语言描述就是:给定一个权值都为正数的赋权完全图，求各边权值和最小的哈密顿回路。

【例8.40】图8.47所示图中的一条各边权值和最小哈密顿回路是 $\nu _ { 1 } , \nu _ { 2 } , \nu _ { 5 } , \nu _ { 4 } , \nu _ { 3 } , \nu _ { 1 } ,$权值和为135。

[page:238]

## 离散数学及应用（第2版）

(a)

旅行商问题在现实生活中有很多的应用领域，如规划最合理高效的道路交通，以减少拥堵；更好地规划物流，以减少运营成本；在互联网环境中更好地设置节点，以利于信息流动等。但是旅行商问题也是一个著名的难题（NPC问题)，至今尚没有有效的解决方法，因此为之设计高效的近似算法始终是最优化领域和算法领域的研究热点。

## 8.4 平面图

定义8.36 如果可以将无向图G画在平面上，使得除端点处外，各边彼此不相交，则称G是具有平面性的图，或简称为平面图（planar graph)，否则称G是非平面图。

注:容易看出，图G中是否存在自环和重边不影响图的平面性。因此之后只须考虑简单图的情况。

【例8.41】图8.48中(a)和(b)都是平面图，可分别画为(c)和(d)的形式。

图 8.48 例 8.41 用图

【例8.42】图8.49中(a)和(b)都是非平面图，无论怎么画，都会有一条边与其他边相交，例如(c)和(d)（有关这一结论更严格的证明将在定理8.16给出)。

定义8.37 设图G可以画在平面上且满足无边相交，G的边将平面划分为若干个封闭区域，则称之为G的面（face），包围面的边称为该面的边界（boundary），面的边界中的边数称为面的次数（degree）（桥在计次数时算作两条边）。

注:若一条边不是桥，它必是两个面的公共边界；桥只能是一个面的边界。两个以

[page:239]

## 第8章 图论

一条边为公共边界的面称为相邻的面。

【例 8.43】图 8.50(a)中有5个顶点、6 条边、3 个面，其中 $f _ { 1 1 }$ $f _ { 2 }$ 称为内部面， $f _ { 3 }$称为外部面， $f _ { 1 }$ 的次数为1， $f _ { 2 }$ 的次数为 6， $f _ { 3 }$ 的次数为5。图8.50(b)中有3 个顶点、6条边、5个面，其中 $f _ { 1 }$ 的次数为1， $f _ { 2 }$ 的次数为3， $f _ { 3 }$ 的次数为2， $f _ { 4 }$ 的次数为2， $f _ { 5 }$ 的次数为4。

连通平面图 G 的顶点数 n、边数 m 和面数 $f$ 具有如下数值特点。

定理8.13 平面图G的所有面的次数之和等于边数的两倍。

定理8.14（欧拉公式）设G是一个面数为 $f$ 的 $[ ( n , m ) .$ -连通平面图，则

$$n - m + f = 2$$

证明. 对图的边数m作归纳:

(1) $m { = } 0$ 时，由于 $G$ 是连通图，因此G只包含一个孤立顶点，只有一个外部面。于是

$$n-m+f=1-0+1=2$$

（2）假设m=k时欧拉公式成立。对于 $m = k + 1$ 情形，分两种情况讨论:

①图中存在悬挂点（如图8.51(a)中的ν)，则删去与之相连的悬挂边后，边数和点数都减少1而面数不变，因此 $n – m + f$ 的值不发生变化。

②图中不存在悬挂点，则每个顶点的度数都大于1，由定理8.5，图中存在回路C，C上任一边都一定是两个面的公共边界（如图8.51(b)中的 $e )$ ，删去此边后这两个面合并为一个面，因此顶点数不变，边数减少1，面数也减少1，于是 $n – m + f$ 的值也不发生变化。

推论 设G 是一个面数为 f的 $\vert ( n , m ) \vert$ 平面图，且有l个连通分支，则 $n - m + j = l + 1$

证明.假设这1个分支是 $G _ { 1 } , \; G _ { 2 } , \; \cdots , \; G _ { l } ,$ 并设 $G _ { i }$ 的顶点数、边数和面数分别是 $n _ { i } ,$ $m _ { i }$ 和 $f _ { i } ,$ 显然有 $\sum _ { i = 1 } ^ { l } n _ { i } = n _ { l }$ 和 $\sum _ { i = 1 } ^ { l } m _ { i } = m _ { l }$ ，此外由于外部面是各个连通分支共用的，因此$\sum _ { i = 1 } ^ { l } f _ { i } = f + l - 1$

[page:240]

## 240

由于每个 $G _ { i }$ 都是平面连通图，因此由欧拉公式有 $n_{i}-m_{i}+f_{i}=2$ ，于是有

$$m - m + f = \sum_{i = 1}^{l} n_{i} - \sum_{i = 1}^{l} m_{i} + \sum_{i = 1}^{l} f_{i} + 1 - l = \sum_{i = 1}^{l} (n_{i} - m_{i} + f_{i}) + 1 - l = 2l + 1 - l = l + 1$$

定理 8.15 设 G 是一个面数为 f的 $( n , m ) .$ -连通简单平面图， $n { \geqslant } 3$ ，每个面的次数至少是l，则 $m \leqslant \frac{l}{l - 2}(n - 2)$ 0

证明:由定理8.13有 $l \cdot f \leq 2 m$ 。代入欧拉公式可得: $2 = n - m + f \leqslant n - m + \frac{2}{l}m$ ，整理即得 $m \leqslant \frac{l}{l - 2}(n - 2)$ 0 □

推论1 设G 是一个面数为 f的 $( n , m )$ -连通简单平面图且 $n   \geqslant   3$ ，则 $m \leqslant 3n - 6$

证明. 由于G是简单图，而且 $n   \geqslant   3$ ，因此每个面的次数至少为3，代入定理8.15中的公式即得。 口

推论2 设G 是一个面数为 f的 $( n , m ) \cdot$ 连通简单平面图， $n   \geqslant   3$ 且每个面的次数至少是4，则 $m \leqslant 2n - 4$ 0

推论3 在任何简单连通平面图中，至少存在一个度数不超过5的顶点。

证明. 若全部顶点的度数均大于5，则由握手定理有 $6 n \leq 2 m$ ，即 $3 n \leq m$ 。再由推论1 得到3n≤3n-6，产生矛盾。 □

利用定理8.15及其推论可以判定某些图是非平面图。

定理 8.16 $K _ { 5 }$ 和 $K _ { 3 , 3 }$ 都是非平面图。

证明.

（a）假设简单图 $K _ { 5 }$ 是平面图，则由推论1应有 $10=m \leqslant 3n-6=3 \times 5-6=9$ ，产生矛盾，因此 $K _ { 5 }$ 不是平面图。

（b）假设二部图 $K _ { 3 , }$ 3是平面图，其中最短的回路长度为4，因此每个面的次数至少是4，由推论2应有 $9=m \leqslant 2n-4=2 \times 6-4=8$ ，产生矛盾。 □

注意，定理8.15及其推论只是图可平面性的必要条件，而非充分条件；换言之，即使满足定理8.15的图也可能是非平面图，例如，图8.52中每个面的次数至少为3，点数$n { = } 7$ ，边数 $m { = } 1 1$ $11 \leqslant 3 \times 7 - 6 = 15$ ，满足定理8.15推论1的条件。但是该图只是在 $K _ { 3 , }$ 3基础上增加一个度数为2的点和两条边，并不是平面图。

因此上述方法只可用来判别某个图是非平面图，而不能用来断定一个图是平面图。

波兰数学家库拉托夫斯基（Kuratowski，1896—1980）建立了一个定理，定性地说明了平面图的本质，可用以判断任何一个图是否是平面图。

定义 8.38 假设 $G { = } ( V , \; E , \; \gamma )$ 是无向图， $e { \in } E$ ，顶点u和ν是边e的两端， $e$ 的细分（subdivision）是指在G中增加一个顶 $点  w$ ，删去边 e，再增加以 u和w为端点的边 $e _ { 1 }$及以w和ν为端点的边 $e _ { 2 }$

从直观上看， $e$ 的细分就是在边的中间增加一个2度的顶点w，即如图8.53所示。

[page:241]

## 第8章 图论

定义8.39 假设G是无向图，G的一个细分是指对G的边做零次或多次细分后得到的图。

【例8.44】 图 8.54 中的(b)和(c)都是(a)的细分。

定理8.17（库拉托夫斯基定理）一个无向图是平面图当且仅当它不包含与 $K _ { 5 }$ 或$K _ { 3 , 3 }$ 的细分同构的子图。

【例8.45】 彼得森图不是平面图。

证明. 采用如图 8.55(a)所示的形式，图 8.55(b)是(a)的一个子图，其是图 8.55(c)的细分，而(c)即是二部图 $K _ { 3 , }$ 3，其中实心顶点和空心顶点标明了两个互补顶点子集

【例8.46】 证明图8.56(a)和(b)所示两图都不是平面图。

证明.

(a）删除图8.57(a)所示的虚线边，得到如图8.57(b)所示的子图，其就是 $K _ { 5 }$ 的一个细分（如图8.57(c)所示）。

[page:242]

## 242

（b）采用两种方法证明。

方法1:删除图8.58(a)中画成虚线的边和空心顶点，得到如图8.58(b)所示的子图，其同构于 $K _ { 3 , 3 }$

方法2:删除图8.58(c)所示的虚线边，得到 $K _ { 5 }$ 的细分（如图8.58(d)所示）。

此外，在可平面图和哈密顿图之间存在着有趣的联系，可以用于判定一个给定的哈密顿图是否是可平面图。

算法的基本思想是:如果简单图G既是哈密顿图又是平面图，那么在G画为平面图后，G的不在哈密顿回路C中的边将落在两个集合之一:C的内部（interior）或C的外部（exterior）。

具体而言，简单哈密顿图的可平面性判断算法如下:

哈密顿图的可平面性判断算法 QHPlanar (G)

输入: $( n , m ) .$ -简单哈密顿图G

输出:G是否可平面化的判断

1 将图G的哈密顿回路C画在平面上形成一个环，使得C将整个平面划分成内部区域及外部区域

2 设 G的不在C 中的边为 $e _ { 1 } , \quad e _ { 2 } , \quad \cdots , \quad e _ { m - n } ,$ 在新的图 $G ^ { \prime }$ 中构造顶点 $e _ { 1 } , e _ { 2 } , \cdots , e _ { n - n }$

3 若边 $e _ { i }$ 和 $e _ { j }$ 在G的新画法中是必须交叉的，即它们二者无法同时画在C的内部或外部，则在图 $G ^ { \prime }$ 的顶点 $e _ { i }$ 和 $e _ { j }$ 之间连一条边

4若 $G ^ { \prime }$ 是二部图则返回判断结果“是”，否则返回“否”

【例8.47】图8.59(a)、(b)、(c)都是哈密顿图，按照上述算法得到(d)、(e)、(f)。其中只有(d)是二部图，所以(a)是平面图，而(b)、(c)两图都不是平面图。

另一个与平面图相关的重要概念即是对偶图。

定义8.40 设G是一个平面图，满足下列条件的图 $G ^ { * }$ 称为 G 的对偶图(dual graph):

[page:243]

## 第8章 图论

（1）G的面 $f$ 与 $G ^ { * }$ 中的顶点v*一一对应。

（2）若G中的面 $f _ { i }$ 和fj邻接于共同边界e，则在 $G ^ { * }$ 中有与e一一对应的边 $e ^ { * }$ ，其以fi和f所对应的点 $\nu _ { i } ^ { * }$ 与 $\boldsymbol { \nu } _ { j } ^ { * }$ 为两个端点。

（3）若割边e处于f内，则在 $G ^ { * }$ 中f所对应的点ν有一个自环 $e ^ { * }$ 与e一一对应。

下面通过一个例子来说明对偶图的画法:假设平面图G如图8.60(a)所示。

（1）在图G中的每个面内画一个顶点（图8.60(b)中的空心顶点）。

(2）在这些新的顶点之间添加边（图8.60(b)中的虚线)，每条新的边恰与G中的一条边相交一次。

所得的新图（包括空心顶点和虚线边）即为G的对偶图 $G ^ { * }$ (整理后如图 8.60(c)所示)。

从这个例子中可以看出，平面图G的对偶图 $G ^ { * }$ 也是平面图，而且是连通的。G的自环和 $G ^ { * }$ 的桥之间以及 G的桥和 $G ^ { * }$ 的自环之间存在着对应关系。

同时，图8.60(a)和图8.60(c)恰是例8.43所示两图（图8.50)，它们的顶点数、边数和面数之间存在一定关系。

定理 8.18 假设 $G ^ { * }$ 是平面连通图G的对偶图，n、m、 $f _ { \gamma }$ $n ^ { * }$ $m ^ { * }$ 、f分别是G和 $G ^ { * }$的顶点数、边数和面数，则有

[page:244]

## 244

(a) $n { = } f ^ { * }  。$

(b) $m { = } m ^ { ^ { * } }$ 0

(c) ${ \mathit { f } } { = } { n } ^ { * }$

（d）若面f对应于顶点 $\nu ^ { * }$ ，则f的次数等于 $\nu ^ { * }$ 的度数。

证明.(b)、(c)、(d)由对偶图的画法即得，下面证明(a)。

由于 $G ^ { * }$ 和G都是平面连通图，由欧拉公式有 $n - m + f = 2$ 及 $n^{*} - m^{*} + f^{*} = 2$ ,又 $m = m^{*}, \quad f = n^{*}$即得 $n { = } f ^ { * }$ o 口

图的平面性问题有许多实际的应用。例如在高速公路的设计、电路印刷板的设计中都要考虑如何避免线路交叉；如果无法避免交叉，那么怎样才能使交叉数尽可能地少？或者如何进行分层设计以使每层都无交叉？这些问题都与图的平面表示相关。

## 8.5 顶点支配、独立与覆盖

本节讨论顶点、边和图的一些关系，在本节中都假设 $G ( V , \; E )$ 是没有孤立顶点的简单图。

定义 8.41 设 $G { = } ( V , E )$ 是无向简单图， $D { \subseteq } V$ ，若对于任意 $\scriptstyle { \mathcal { V } } \in { \mathcal { V } } - D$ ，都存在 $u   \in   D$ ，使得 $u v { \in } E$ ，则称D为一个支配集（dominating set）。若D是图G的支配集，且D的任何真子集都不再是支配集，则称D为一个极小支配集（minimal dominating set)。如果图G的支配集D满足对于G的任何支配集D'都有 $| D |   \leqslant   | D ^ { \prime } |$ ，则称D是G的一个最小支配集(minimum dominating set)，最小支配集D的元素数称作图G的支配数（domination number)，记作 $| \mathcal { \mathcal { \mathcal { n } } } ( G ) |$ C

注:

（a）对于V中任一个顶点而言，它或者属于支配集，或者与支配集中一个元素相邻。

（b）一个图中的极小支配集可能是不唯一的。

（c）一个图中的最小支配集可能是不唯一的。

（d）每个最小支配集都是极小支配集，但不是每个极小支配集都是最小支配集。

【例8.48】 在图8.61 中， $\{ \nu _ { 1 } , \nu _ { 2 } , \nu _ { 3 } \}$ 不是支配集； $\{ \nu _ { 5 } , \nu _ { 6 } , \nu _ { 7 } \}$ 是支配集，但不是极小支配集； $\{ v _ { 1 } , v _ { 3 } , v _ { 5 } \}$ 是极小支配集，但不是最小支配集； $\{ \nu _ { 3 } , \nu _ { 6 } \}$ 既是极小支配集也是最小支配集； $\{ \nu _ { 6 } , \nu _ { 7 } \}$ 也是最小支配集。图8.61的支配数是2。

## 【例8.49】

(a）在任一简单图G(V,E)中，V都是支配集。

（b）完全图 $K_{n} (n \geqslant 3)$ 的支配数为1。

[page:245]

## 第8章 图论

（c）完全二部图 $K _ { m , n }$ 的支配数为 $\operatorname* { m i n } ( m , n )$

（b）轮图 $W_{n} (n \geqslant 3)$ 的支配数为1。

例如，在一个分布式计算系统中，每个节点都有一台计算服务器，有些节点放置数据存储器，节点之间使用数据线连接。为提高速度，要求每个节点都可以直接访问到数据存储器；同时，为了节约成本，要求数据存储器尽可能少。这就可以抽象为支配集的问题。

定义 8.42 设 G=(V, E, γ)是一个无向图， ${ \mathcal { S } } { \subseteq } V ,$ 若对任意 $u , \nu { \in } { \mathcal { S } } ,$ ，都有u与ν不相邻，则称S是G的一个点独立集或简称独立集（independent set)，空集∅是任意图的点独立集；若对G的任何独立集 T，都有 ST，则称 S是 G的一个极大独立集（maximal independent set）。特别地，称具有最大基数的独立集为最大独立集（maximum independent set)。图G中最大独立集的基数称为G的独立数（independence number)，记为α(G)。

注:

（a）极大点独立集不是任何其他点独立集的子集。

(b）若点独立集S是G的一个极大独立集，则对于任意 $u   \in   V   -   S$ ，都存在 $\nu   \in   { \cal S } ,$ ，使得u与ν相邻。

（c）一个图中的极大独立集可能是不唯一的。

（d）一个图中的最大独立集可能是不唯一的。

（e）每个最大独立集都是极大独立集，但不是每个极大独立集都是最大独立集。

【例8.50】在图8.61中， $\{ v _ { 1 } , v _ { 2 } , v _ { 3 } \}$ 不是独立集； $\{ \nu _ { 1 } , \nu _ { 3 } \}$ 是独立集，但不是极大独立集； $\{ \nu _ { 4 } , \nu _ { 6 } \}$ 是极大独立集，但不是最大独立集； $\{ v _ { 1 } , v _ { 3 } , v _ { 5 } \}$ 既是极大独立集也是最大独立集； $\{ v _ { 2 } , v _ { 4 } , v _ { 5 } \}$ 也是最大独立集。图8.61的独立数是3。

## 【例8.51】

(a）在任一简单图G(V,E)中，空集∅都是独立集。

（b）完全图 $K_{n} (n \geqslant 3)$ 的独立数为1。

（c）完全二部图 $K _ { m , n }$ 的独立数为 max(m, n)。

(d)圈图 $C_{n} (n \geqslant 3)$ 的独立数为 $\lfloor n / 2 \rfloor$ o

(e）轮图 $W_{n} (n \geqslant 3)$ 的独立数为 $\lfloor n / 2 \rfloor$

例如，在某个通信系统中，由于传输过程中存在电磁干扰，输入符号可能和输出符

号不同。例如，输入 $a _ { 1 }$ 时输出端可能会是 $a _ { 1 }  、  a _ { 5 } ,$ ，输入 $a _ { 2 }$时输出端可能会是 $a _ { 1 }  、  a _ { 2 }  、  a _ { 5 }$ ，输入 $a _ { 3 }$ 时输出端可能会是$a _ { 1 }  、  a _ { 3 }$ ，输入 $a _ { 4 }$ 时输出端可能会是 $a _ { 3 }  、  a _ { 4 }$ ，输入 $a _ { 5 }$ 时输出端可能会是 $a_{4} 、 a_{5} 。$ 因此该通信系统中只能使用 $\{ a _ { 1 } ,   a _ { 2 } ,   a _ { 3 }$ $\left. a _ { 4 } , a _ { 5 } \right\}$ 中的部分符号，而不是全体；但从效率角度出发，又希望能供使用的符号尽可能多。如果输入符号x和y时可能具有相同的输出，则在顶点x和y之间连一条无向边。于是该问题就可以抽象为求图 8.62 中最大点独立集的问题。

[page:246]

## 246

在图的独立数和支配数之间存在如下关系。

定理8.19 一个独立集也是支配集当且仅当它是极大独立集。

证明.（充分性）假设S是图的一个极大独立集，但不是支配集，则存在顶点ν与S中所有顶点都不相邻，这就与S作为独立集的“极大性”产生矛盾。

（必要性）如果S既是独立集也是支配集，但不是极大独立集，则有独立集 $S _ { 1 }$ 满足$S { \subset } S _ { 1 }$ ，考虑顶点 $u   \in   { \cal S } _ { 1 }   -   { \cal S }$ ，则 $u$ 与S中所有顶点都不相邻，与S是支配集产生矛盾。□

定理8.20 无向简单图的极大独立集都是极小支配集，反之不真。

证明.假设S是图的一个极大点独立集，由定理8.19，S是支配集。

如果S不是极小支配集，则存在集合 $S _ { 1 } { \subset } S , S _ { 1 }$ 也是支配集，考虑顶点 $u   \in   \bar { S   -   } S _ { 1 }$ ，则u必定与 $S _ { 1 }$ 中某顶点相邻。换言之，存在一条边的两端点都属于S，与S是独立集产生矛盾。

反过来，极小支配集不一定是极大独立集。例如在图8.61中， $\{ \nu _ { 3 } , \nu _ { 6 } \}$ 是极小支配集，但不是极大独立集。 口

这个例子也表明了 $\alpha ( G ) \geqslant \gamma ( G )$

定义 8.43 设 G(V, E)是简单图， $\boldsymbol { V } ^ { * }     \subseteq     \boldsymbol { V } _ { \circ }$ 如果对于任意 $e { \in } E$ ，都存在 $\boldsymbol { \nu }   \in   \boldsymbol { V } ^ { * }$ ，使得ν是e的一个端点，则称 $V ^ { * }$ 为G的一个点覆盖集，简称点覆盖（vertex cover）。若 $V ^ { * }$ 是图G的点覆盖，且 $V ^ { * }$ 的任何真子集都不再是点覆盖，则称 $V ^ { * }$ 为一个极小点覆盖(minimal vertex cover)。如果图 G 的点覆盖 $V ^ { * }$ 满足对于G的任何点覆盖V'都有 $| V ^ { * } | \leqslant | V ^ { \prime } |$ ，则称$V ^ { * }$ 是G的一个最小点覆盖（minimum vertex cover)，最小点覆盖 $V ^ { * }$ 的元素数称作图G的点覆盖数（vertex cover number），记作 $\beta ( G )$ 0

注:

（a）在极小点覆盖中，不存在所有相邻顶点都属于 $V ^ { * }$ 的顶点。

（b）一个图中的极小点覆盖可能是不唯一的。

（c）一个图中的最小点覆盖可能是不唯一的。

(d）每个最小点覆盖都是极小点覆盖，但不是每个极小点覆盖都是最小点覆盖。

(e) 明显有 $\beta ( G ) \geq \gamma ( G )$ 0

【例8.52】在图8.61中， $\{ v _ { 1 } , v _ { 2 } , v _ { 3 } \}$ 不是点覆盖集； $\{ v _ { 1 } , v _ { 2 } , v _ { 4 } , v _ { 6 } , v _ { 7 } \}$ 是点覆盖集，但不是极小点覆盖集； $\{ v _ { 1 } , v _ { 2 } , v _ { 3 } , v _ { 5 } , v _ { 7 } \}$ 是极小点覆盖集，但不是最小点覆盖集； $\{ \nu _ { 1 } , \nu _ { 3 } , \nu _ { 4 } ,$ $\left. \nu _ { 6 } \right\}$ 既是极小点覆盖集也是最小点覆盖集； $\{ v _ { 2 } , v _ { 4 } , v _ { 6 } , v _ { 7 } \}$ 也是最小点覆盖集。图8.61的点覆盖数是4。

【例8.53】

(a）在任一简单图G(V,E)中，V是点覆盖。

(b）完全图 $K_{n} (n \geqslant 3)$ 中点覆盖数是 $n { - } 1$ 0

（c）完全二部图 $K _ { m , n }$ 的点覆盖数是 $\operatorname* { m i n } ( m ,   n )$

(d)圈图 $C_{n} (n \geqslant 3)$ 的点覆盖数为 $\lceil n / 2 \rceil$ 0

(e）轮图 $W_{n} (n \geqslant 3)$ 的点覆盖数为 $[ n / 2 ]$ +1。

例如，一个小区需要在一些路口安置 $3 6 0 ^ { \circ }$ 全方位摄像监控，要求能够监控所有通道，这就可以抽象为点覆盖集的问题。

[page:247]

## 第8章 图论

在简单图中，点覆盖集与独立集具有如下关系。

定理 8.21 在简单图 $G ( V , E )$ 中， $\boldsymbol { V } ^ { * } { \subseteq } \boldsymbol { V }$ 是点覆盖集当且仅当 $V { - } V ^ { * }$ 是独立集。

证明.（必要性）假设 $\boldsymbol { V } ^ { * } { \subseteq } \boldsymbol { V }$ 是点覆盖集，若 $V { - } V ^ { * }$ 不是独立集，则存在顶点 $u , v   \in   V -$ $V ^ { * }$ ，使得 $u  、 \nu$ 相邻，而这与 $V ^ { * }$ 是点覆盖集产生矛盾——边 $u \nu$ 没有被“覆盖”住。

（充分性）如果 $V { - } V ^ { * }$ 是独立集，但 $V ^ { * } { \subset } V$ 不是点覆盖集，则存在边 $u v { \in } E$ 使得 u, v∉ $V ^ { * }$ ，于是 $u , v   \in   V   -   V ^ { * }$ 且 $u , \nu$ 相邻，与 $V { - } V ^ { * }$ 是独立集矛盾。 □

推论1 在简单图 $G ( V , E )$ 中， ${ \boldsymbol { V } } ^ { * } { \subseteq } { \boldsymbol { V } }$ 是极小点覆盖集当且仅当 $V { - } V ^ { * }$ 是极大独立集。

证明. 如果 $V ^ { * }$ 是极小点覆盖集但 $V -   V$ *不是极大独立集，则存在另一个独立集S，$V   -   V ^ { * }     \subset     S$ ，于是由定理8.21，V-S是点覆盖集而且 $V ^ { * } = V - ( V - V ^ { * } ) \supset V - S ,$ ，与 $V ^ { * }$ 的“极小”性矛盾。

类似地可证明如果 $V { - } V ^ { * }$ 是极大独立集，则 ${ \boldsymbol { V } } ^ { * } { \subset } { \boldsymbol { V } }$ 是极小点覆盖集。 □

推论2 在简单图 $G(V,E)  中$ 1, $V ^ { * } { \subseteq } V$ 是最小点覆盖集当且仅当 $V { - } V ^ { * }$ 是最大独立集，继而有 $\alpha ( G ) + \beta ( G ) = | V |$ 0

证明. 如果 $V ^ { * }$ 是最小点覆盖集但 $V   -   V ^ { * }$ 不是最大独立集，则存在最大独立集 $S ,   | S | >$ $| { \boldsymbol { V } } { - } { \boldsymbol { V } } ^ { * } |$ ，于是由定理8.21，V-S是点覆盖集而且 $| | \boldsymbol{V} - \boldsymbol{S} | - | \boldsymbol{V} | - | \boldsymbol{S} | < | \boldsymbol{V} - | \boldsymbol{V} - \boldsymbol{V}^* | = | \boldsymbol{V}^* |$ ，与 $V ^ { * }$ 的“最小”矛盾。

类似地可证明，如果 $V { - } V ^ { * }$ 是最大独立集，则 $V ^ { * }$ 是最小点覆盖集。

继而自然有 $\alpha ( G ) + \beta ( G ) = | V |$ 0

【例 8.54】 在图8.61中， $\alpha(G)=3,\ \beta(G)=4,\ \alpha(G)+\beta(G)=|V|=7.$

## 8.6匹配

考虑一个工作分配问题:有m个人和n项工作，每个人都有能力可以从事其中一项或几项工作，但一个人只能从事一项工作，而一项工作也只能分配给一个人。要如何进行安排，才能使尽量多的人有工作可做？在什么条件下，每个人都可以有工作？

这个问题可以使用图的模型来描述:用顶点 $x_{1}, x_{2}, \cdots, x_{m}$ 表示m个人，用顶点 $y _ { 1 } ,$ $y _ { 2 } , \cdots , y _ { n }$ 表示n项工作，若 $x _ { i }$ 可以胜任工作 $y _ { j }$ ，则在 $x _ { i }$ 和 $y _ { j }$ 之间连一条边，于是可以得到一个二部图。而工作安排问题就是在图中寻找边的集合，使得每个顶点与这个集合中至多一条边关联这就是图中的“匹配”；让尽可能多的人有工作可做，则是求图中的“最大匹配”。

本节都假设图G是简单图。

## 8.6.1 匹配与最大匹配

定义 8.44 设 G=(V， E)是简单图， $M { \subseteq } E \text { 。 }$ 如果M中任何两条边都不邻接，则称M为G中的一个匹配（matching）或边独立集。设顶点 $v   \in   V ,$ ，若存在 $e { \in } M ,$ ，使得ν是e的一个端点，则称ν是M-饱和的（matched 或saturated)，否则称ν是M-非饱和的$\mathbf { ( u n m a t c h e d ) }$

[page:248]

## 248

定义 8.45 若匹配 M满足对任意 e∈E-M，M∪{e}不再构成匹配，则 M称是 G 的一个极大匹配(maximal matching)。如果图 G 的 匹配 M 满足对于 G 的任何匹配 M'都有|M $\geqslant \lvert M \rvert$ ，则称M是G的一个最大基数匹配（maximum-cardinalitymatching）或最大匹配(maximum matching)，最大匹配 M 的元素数称作图 G 的匹配数(matching number),记作ν(G)。

注:

（a）极大匹配不是任何其他匹配的子集。

(b）若匹配 M是 G 的一个极大匹配，则对于任意 $e { \in } E { - } M ,$ ，都存在 $e _ { 1 } { \in } M ,$ ，使得e与 $e _ { 1 }$ 相邻。

（c）一个图中的极大匹配可能是不唯一的。

（d）一个图中的最大匹配可能是不唯一的。

（e）每个最大匹配都是极大匹配，但不是每个极大匹配都是最大匹配

(f) 显然图G的匹配数不超过G的阶数的一半。

定义8.46 饱和图G中每个顶点的匹配称作完全匹配（complete matching）或完美匹配（perfect matching)。

注:

（a）在完美匹配中，每个顶点都关联匹配中的一条边。

（b）如果图G存在完美匹配，则图G的匹配数为G的阶数的一半，此时的阶数为偶数。

(c）每个完美匹配都是最大匹配，但不是每个最大匹配都是完美匹配

【例8.55】在图8.63(a)中，边集 $M_{1}=\left\{e_{3}, e_{7}\right\}, M_{2}=\left\{e_{4}, e_{6}\right\}, M_{3}=\left\{e_{3}, e_{5}, e_{7}\right\}, M_{4}=\left\{e_{1}\right.$ $\left. e _ { 7 } ,   e _ { 8 } \right\}$ 都是图的匹配（分别如图8.63(b)、(c)、(d)、(e)所示)， $M _ { 3 }$ 和 $M _ { 4 }$ 是 G 的完美匹配，$M _ { 2 }$ $M _ { 3 }$ 和 $M _ { 4 }$ 是G的极大匹配，但 $M _ { 2 }$ 不是最大匹配。在图8.63(b)中， $\{ \nu _ { 1 } , \nu _ { 3 } , \nu _ { 4 } , \nu _ { 6 } \}$ 是$M _ { 1 ^ { - } }$ 饱和顶点， $\{ \nu _ { 2 } , \nu _ { 5 } \}$ 是 $M _ { 1 }$ -非饱和顶点。图8.63(a)的匹配数是3。

【例8.56】图8.63(f)的匹配数是2，但其中不存在完美匹配。

[page:249]

## 第8章 图论

【例8.57】

(a） 完全图 $K_{n} (n \geqslant 3)$ 的匹配数为 $\lfloor n / 2 \rfloor$

（d）完全二部图 $K _ { m , n }$ 的匹配数为 min(m, n)。

(c）圈图 $C_{n} (n \geqslant 3)$ 的匹配数为Ln/2]。

(d)轮图 $W_{n} (n \geqslant 3)$ 的匹配数为 $\lceil n / 2 \rceil ,$

伯奇（Claude Berge）在1957年给出了一个匹配构成最大匹配的充要条件。在描述该定理之前，需要先给出如下定义。

定义8.47 设M是G中一个匹配，若G中一条初级道路是由M 中的边和E-M中的边交替出现组成的，则称其为交错道路（alternatingpath)；若一条交错道路的始点和终点都是 M-非饱和顶点，则称其为M-可增广道路（augmenting path）。

注:易知可增广道路的长度一定是奇数。

【例8.58】在图8.64中，匹配 $M = \{ x _ { 1 } y _ { 1 } ,   x _ { 3 } y _ { 2 } ,   x _ { 4 } y _ { 4 } ,   x _ { 5 } y _ { 5 } ,   x _ { 6 } y _ { 7 } \}$ ，则道路 $x _ { 2 } y _ { 3 } x _ { 4 } y _ { 4 }$ 不是交错道路，x1y1x3y2、x3y4X4、y3X4y4X5y5x6y7x7都是交错道路，y3X4y4X5y5X6y7x7是M-可增广道路，而 $x _ { 1 } y _ { 1 } x _ { 3 } y _ { 2 }$ 和 $x _ { 3 } y _ { 4 } x _ { 4 }$ 不是M-可增广道路。

定理8.22（伯奇引理）匹配M为图 $G { = } ( V , \; E )$ 的最大匹配当且仅当 G 中不存在M-可增广道路。

证明.（必要性）假设M为最大匹配，且存在一条M-可增广道路 $e _ { 1 } e _ { 2 } { \cdots } e _ { 2 k + 1 }$ ，则 $e _ { 2 } .$ $e _ { 4 } , \cdots , e _ { 2 k }$ 为属于M的边， $e_{1} 、 e_{3} 、 \cdots 、 e_{2k+1}$ 为不属于M的边。

构造新集合 $M_{1} = (M - \{e_{2}, e_{4}, \cdots, e_{2k}\}) \cup \{e_{1}, e_{3}, \cdots, e_{2k+1}\}$ ，易于验证 $M _ { 1 }$ 也是G的一个匹配。但是 $| M _ { 1 } | = | M | + 1$ ，与“M为最大匹配”矛盾。

（充分性）如果G（例如图8.65(a)）中不存在M-可增广道路（例如图8.65(b))，而M不是最大匹配，则必有最大匹配 $M _ { 1 }$ (例如图 8.65(c))。

[page:250]

## 250

令 $M_{2}=M_{1}\oplus M$ 则图 $( V , M _ { 2 } ) ^ { \intercal }$ 中的所有顶点度数不超过2。因此图 $( V , M _ { 2 } ) ^ { \intercal }$ 中每个连通分支或者是一个单独的回路，或者是一个单独的道路，而且道路是交错的(例如图 $8 . 6 5 ( \mathrm { d } ) )$

由于 $| M _ { 1 } | > | M |$ ，因此 $M_{2}=M_{1}\oplus M$ 中原本属于 $M _ { 1 }$ 的边多于原本属于M的边。所以一定存在一条交错道路以 $M _ { 1 }$ 中的边开始，以 $M _ { 1 }$ 中的边结束，于是它就是 G 中的一条M-可增广道路，产生矛盾。 □

基于伯奇引理，可以给出求二部图中最大匹配的算法，其基本思想是从任何一个初始匹配开始，不断寻找可增广道路从而扩大匹配的基数，直至不能再扩大为止。

为表述该算法，首先补充一个定义。

定义8.48 设W是图G的顶点集的一个子集，则 $N _ { G } ( W ) = \{ v \}$ 存在 $u   \in   W$ ，使得u与ν相邻}称作W的邻接顶点集（neighborhood of $W )$ 0

## 最大匹配算法 MaxMatch (G)

输入:二部图 G=(X, Y, E)

输出:G的一个最大匹配M

1任选一个初始匹配，给饱和顶点标记1，其余顶点标记0

2若X中各顶点都已有非0标记，则此时已是最大匹配，算法终止；否则，

2.1 选择一个0标记点x∈X，令 U←{x}，V←∅

2.2 若 $N _ { G } \left(   U \right)   =   V ,$ 则x无法作为一条可增广道路的端点，给x标记2，转步骤2

2.3 否则选择 $\scriptstyle { \mathcal { Y } } \in N _ { G }   \left( U \right)   -   { \mathcal { V } } ,$

2.3.1 若 $Y$ 的标记为1，则存在边 $\scriptstyle { \boldsymbol { Y } } { \boldsymbol { Z } } \in { \boldsymbol { M } } ,$ 令 $U \leftarrow U \cup \{ z \} , V \leftarrow V \cup \{ y \}$ ，转到步骤2.2

2.3.2 否则，存在一条x至 $Y$ 的可增广道路 $P ,$ 令M←M⊕P，给x和 $Y$ 标记1，转到步骤2

算法中标记1表示已饱和顶点，0表示未处理顶点。

【例8.59】设图8.66中的初始匹配 $M = \{ x_{2}y_{3}, x_{3}y_{4} \}$ ，求最大匹配。

算法第1轮:

步骤2.1 找到非饱和点 $x = x_{1}, \quad U \leftarrow \{x_{1}\}, \quad V \leftarrow \varnothing$ (图 8.66(b))。

步骤2.2 $N_{G}(U)=\{y_{3},y_{5}\}\neq V$

步骤2.3 选择 $y _ { 5 } { \in } N _ { G } ( U ) { - } V , y _ { 5 }$ 的标记为0。

步骤2.3.2 $P = \{ x_{1}y_{5} \}, M \leftarrow M \oplus P = \{ x_{2}y_{3}, x_{3}y_{4}, x_{1}y_{5} \}$ ,将 $x _ { 1 }$ 和 $y _ { 5 }$ 标记为 1(图 8.66(c))。

算法第2轮:

步骤2.1 找到非饱和点 $x = x_{4}, \quad U \leftarrow \{ x_{4} \}, \quad V \leftarrow \varnothing$ (图 8.66(d))。

步骤2.2 $N_{G}(U)=\{y_{4},y_{5}\}\neq V$

步骤2.3 选择 $y _ { 5 } { \in } N _ { G } ( U ) { - } V , y _ { 5 }$ 的标记为1。

步骤2.3.1 $y_{5}x_{1} \in M,\ U \leftarrow U \cup \{x_{1}\} = \{x_{4}, x_{1}\},\ V \leftarrow V \cup \{y_{5}\} = \{y_{5}\}$

步骤2.2 $N_{G}(U)=\left\{y_{3}, y_{4}, y_{5}\right\} \neq V$ (图 8.66(e))。

步骤2.3 选择 $y _ { 3 } { \in } N _ { G } ( U ) { - } V , y _ { 3 }$ 的标记为1。

步骤2.3.1 $y_{3}x_{2} \in M,\ U \leftarrow U \cup \{x_{2}\} = \{x_{4}, x_{1}, x_{2}\},\ V \leftarrow V \cup \{y_{3}\} = \{y_{5}, y_{3}\}$ 0

步骤2.2 $N_{G}(U)=\left\{y_{1}, y_{2}, y_{3}, y_{4}, y_{5}\right\} \neq V$ (图 $8 . 6 6 ( \mathrm { f } ) )$ 0

步骤2.3 选择 $y _ { 1 } { \in } N _ { G } ( U ) { - } V , y _ { 1 }$ 的标记为0。

[page:251]

## 第8章 图论

步骤2.3.2 $P = \{ x _ { 4 } y _ { 5 } , x _ { 1 } y _ { 5 } , x _ { 1 } y _ { 3 } , x _ { 2 } y _ { 3 } , x _ { 2 } y _ { 1 } \}$ (图 8.66(g))，M← $-M \oplus P = \{x_{1}y_{3}, x_{2}y_{1}, x_{3}y_{4}$ $\{ x _ { 4 } y _ { 5 } \}$ ，将 $x _ { 4 }$ 和 $y _ { 1 }$ 标记为1（图 8.66(h)）。

算法第3轮:

步骤2.1 找到非饱和点 x=x5，U←{x5}，V←∅（图 8.66(i))。

步骤2.2 $N _ { G } ( U ) = \{ y _ { 5 } \} \neq V$

步骤2.3 选择 $y _ { 5 } { \in } N _ { G } ( U ) { - } V , y _ { 5 }$ 的标记为1。

步骤2.3.1 $y_{5}x_{4} \in M,\ U \leftarrow U \cup \{x_{4}\} = \{x_{5}, x_{4}\},\ V \leftarrow V \cup \{y_{5}\} = \{y_{5}\}$ (图 8.66(j))。

步骤2.2 $N_{G}(U)=\{y_{5},y_{4}\}\neq V$

步骤2.3 选择 $y _ { 4 } { \in } N _ { G } ( U ) { - } V , y _ { 4 }$ 的标记为1。

步骤2.3.1 $y_{4}x_{3} \in M,\ U \leftarrow U \cup \{x_{3}\} = \{x_{5}, x_{4}, x_{3}\},\ V \leftarrow V \cup \{y_{4}\} = \{y_{5}, y_{4}\}$ (图 8.66(k))。

步骤2.2 $N _ { G } ( U ) = \{ y _ { 5 } , y _ { 4 } \} = V ,$ 给x标记2，转步骤2。

步骤2 X中各顶点都已有非0标记（图8.66(1))，此时M已是最大匹配，算法终止。

[page:252]

## 252

## 8.6.2 霍尔定理及其应用

霍尔（PhilipHall）曾研究二部图中的匹配，并于1935年提出了著名的霍尔婚配定理（Hall's marriage theorem)，或简称霍尔定理 $( \mathbf { H a l l ' s ~ t h e o r e m } )$ 0

定理8.23（霍尔定理）设 $G { = } ( X , Y , E )$ 为二部图，G中存在使X中每个顶点饱和的匹配M（即 $| M | = | X |$ 当且仅当对任何非空集合 $S \subseteq X , | N _ { G } ( S ) | \geqslant | S |$ （该条件表示任意子集S都有足够多的相邻顶点)。

证明.（必要性)假设存在匹配 $M { \subseteq } E$ 使X中每个顶点饱和，则 $| N _ { G } ( S ) | \geqslant | N _ { ( X , Y , M ) } ( S ) | = | S |$

（充分性）假设M是一个最大匹配，且存在M-非饱和顶点 $x { \in } X ,$

如果x是孤立顶点，则 $| N _ { G } ( \{ x \} ) | = 0 < 1 = | \{ x \} |$ ，与条件矛盾。

否则，考虑所有从x开始的交错道路，记Y中所有x可以通过这些道路到达的顶点为集合T，记X中所有x可以通过这些道路到达的顶点为集合W(包括x本身)。由于所有从x开始的极长的(即不能再延长了)交错道路的终点都不能是Y中M-非饱和顶点(否则将产生M-可增广道路，与M是最大匹配矛盾)，所以T中顶点都是M-饱和顶点。

记R为从x开始的所有交错道路的边形成的集合，则R∩M中的边构成了 $W - \{ x \}$ 和T中顶点的一一对应， $| W - \{ x \} | = | T |$ (例如图 8.67)。

下面证明 $N _ { G } ( W ) { = } T _ { \circ }$ 如果存在 $y { \in } N _ { G } ( W ) \cdot$ -T,那么存在 $z   \in   W ,$ 使得 $z y { \in } E \text { 。 }$ 又由于 $W - \{ x \}$中元素都是M-饱和顶点或x本身，因此 $z y \not \in M \circ$ 于是，或者x就是 z；或者x可以通过某条交错道路到达z，再经过边 zy可以到达 y，与 $y \not \in T$ 矛盾。

最后， $|W| = |W - \{x\}| + 1 > |W - \{x\}| = |T| = |N_G(W)|$ ，与条件产生矛盾。

推论1 设 G=(X, Y, E)为二部图，若存在正整数 k，使得对任意 $x { \in } X ,$ 有 deg(x)≥k,对任意 $y   \in   Y ,$ 有 $\deg(x) \leq k$ ，则G中存在使X中每个顶点饱和的匹配。

证明.假设非空集合 S⊆X，则 S 中顶点关联的边至少kS条，而这些边都与 $| N _ { G } ( S ) |$ 中的顶点关联，由于Y中顶点度数都不超过k，因此 $| N _ { G } ( S ) | \geqslant k | S | / k = | S |$ 。所以存在使X中每个顶点饱和的匹配。 □

推论2 对任意正整数k，k-正则二部图中必定存在使X中每个顶点饱和的匹配。

【例8.60】 如果一次集体相亲活动中有n个男孩和n个女孩，任意k个男孩加在一起认识的女孩至少有k人 $( 1 \leqslant k \leqslant n )$ ，则一定可以安排得当，使每个人都能与认识的人约会——这也是“婚配定理”得名的由来。

下面介绍霍尔定理的一个应用——拉丁方。

假设一块地用作某一作物的3个品种A、B、C的试验田，影响它们生长的因素有彼

[page:253]

## 第8章 图论

此独立的两类:3种不同肥料和3种不同的土壤。可以将地面划分为3行，每行施以不同肥料；分为3列，每列铺以不同的土壤，将地面分为9格，每格栽种一个品种。试验目的是观察不同肥料、不同土壤情况对作物生长的影响。试验方案如图8.68所示。

再如，希望测试1～4共4种品牌小轿车轮胎的抗磨损能力，但考虑到同一品牌的轮胎安装在小轿车不同位置也会对磨损有所影响。可以使用4辆小轿车甲、乙、丙、丁按图8.69所示的方案进行测试。

图8.68和图8.69的方阵都满足:恰有n种不同的元素，每种元素恰有n个，并且每种元素在每行和每列中恰好只出现一次这样的方阵称为拉丁方。

定义 8.49 称每行及每列都包含给定的 n 个符号恰一次的一个 n 阶方阵为拉丁方(Latin square)。

例如，以下两个方阵都是集合{1,2,3,4}上的4阶拉丁方。

$$\begin{aligned}\boldsymbol{L}_{1} &= \begin{pmatrix}1 & 2 & 3 & 4 \\3 & 4 & 1 & 2 \\4 & 3 & 2 & 1 \\2 & 1 & 4 & 3\end{pmatrix} \quad \boldsymbol{L}_{2} = \begin{pmatrix}1 & 2 & 3 & 4 \\4 & 3 & 2 & 1 \\2 & 1 & 4 & 3 \\3 & 4 & 1 & 2\end{pmatrix}\end{aligned}$$

著名数学家和物理学家欧拉最早研究了这样的方阵，他使用拉丁字母来作为方阵里元素的符号，拉丁方因此而得名。拉丁方不仅影响了统计学实验设计，而且出现在离散数学及代数的许多不同领域中。

一般来说，设 $S { = } \{ 1 , 2 ,   \cdots , n \}$ ，构造S上n阶拉丁方的主体思路就是逐行生成元素，具体步骤如下:

（1）构造一个完全二部图 $K_{n,n} = (S, C, E)$ ，其中 $C = \left\{ c _ { 1 } , c _ { 2 } , \cdots , c _ { n } \right\} , c _ { i } ( 1 \leqslant i \leqslant n )$ 的含义是第i列。

（2）由于完全二部图 $K _ { n , n }$ 是n正则二部图，根据定理8.23的推论2，存在完全匹配$M _ { 1 }$ 。将 $M _ { 1 }$ 中每条边属于X中顶点的标号分别作为第一行的元素，具体地讲， $c _ { 1 }$ 在 $M _ { 1 }$下配对的顶点的标号作为第1 行第1列的元素， $c _ { 2 }$ 在 $M _ { 1 }$ 下配对的顶点的标号作为第1行第2列的元素……得到矩阵的第一行。

(3）令 $E { \leftarrow } E { - } M _ { 1 }$ ，(S, C, E)是 n-1 正则二部图，根据定理 8.23 的推论 2，(S, C, E)存在完全匹配 $M _ { 2 }$ ，于是产生矩阵的第2行。

(4)令 $E { \leftarrow } E { - } M _ { 2 }$ ，(S, C, E)是 n-2 正则二部图，(S, C, E)存在完全匹配 $M _ { 3 }$ ，于是产生矩阵的第3行。

（5）依次进行，直至E为空，即得n阶拉丁方。

[page:254]

## 254

【例 8.61】 构造5阶拉丁方的过程如图 8.70(a)~(e)所示，M₁={11,22,33,44,55}，$M_{2} = \{ 12, 25, 31, 43, 54 \}$ $M_{3} = \{ 14, 21, 32, 45, 53 \}$ , M4={13, 24, 35, 41, 52}, $M_{5}=\{15,23,34\}$ 42,51}，得到如下拉丁方:

$$\begin{pmatrix}1 & 2 & 3 & 4 & 5 \\3 & 1 & 4 & 5 & 2 \\2 & 3 & 5 & 1 & 4 \\4 & 5 & 1 & 2 & 3 \\5 & 4 & 2 & 3 & 1\end{pmatrix}$$

## 8.6.3 匹配与覆盖

定义 8.50 设 $G   =   ( V ,   E )$ 是没有孤立顶点的简单图， $\boldsymbol { E } ^ { * } \underline { { \subseteq } } \boldsymbol { E } _ { \circ }$ 如果对于任意 $\nu   \in   V ,$ ，都存在 $e { \in } \boldsymbol { E } ^ { * }$ ，使得ν是e的一个端点，则称 $E ^ { * }$ 为G的一个边覆盖集，简称边覆盖（edge $\mathbf { c o v e r } )$ 。若 $\text{∠ }E^{*} 是$ 图G的边覆盖，且 $E ^ { * }$ 的任何真子集都不再是边覆盖，则称 $E ^ { * }$ 为一个极小边覆盖（minimal edge cover)。如果图 G的边覆盖 $E ^ { * }$ 满足对于G的任何边覆盖E'都有|E $\mathrm { ~  ~ } | \leqslant | E ^ { \mathrm { ~  ~ } } |$ ，则称 $E ^ { \mathrm { ~ * ~ } }$ 是 G 的一个最小边覆盖（minimum edge cover)，最小边覆盖 $E ^ { * }$的元素数称作图G的边覆盖数（edge covering number)，记作 $; \rho ( G )$

注:

（a）显然有孤立顶点的简单图不存在边覆盖。

(b）极小边覆盖 $E ^ { * }$ 中任何一条边的两个端点不可能都与 $E ^ { * }$ 中的其他边相关联。

（c）明显有 $\rho ( G ) \geqslant | V | / 2$ 0

(d）一个图中的极小边覆盖可能是不唯一的。

（e）一个图中的最小边覆盖可能是不唯一的。

（f）每个最小边覆盖都是极小边覆盖，但不是每个极小边覆盖都是最小边覆盖。

【例8.62】在图8.71中， $\{ e _ { 1 } ,   e _ { 2 } ,   e _ { 3 } \}$ 不是边覆盖集；$\{ e _ { 1 } , e _ { 5 } , e _ { 6 } , e _ { 7 } , e _ { 8 } \}$ 是边覆盖集，但不是极小边覆盖集； $\{ e _ { 3 } , e _ { 4 } ,$ $\left. e _ { 5 } ,   e _ { 7 } ,   e _ { 8 } \right\}$ 是极小边覆盖集，但不是最小边覆盖集； $\{ e _ { 1 } , e _ { 5 } ,$

[page:255]

## 第8章 图论

e7, $| e _ { 8 } \rangle$ 既是极小边覆盖集也是最小边覆盖集； $\{ e _ { 1 } ,   e _ { 2 } ,   e _ { 6 } ,   e _ { 8 } \}$ 也是最小边覆盖集。图8.71 的边覆盖数是4。

## 【例8.63】

(a）在任一简单图G(V,E)中，E都是边覆盖。

（b）任何完美匹配都是最小边覆盖。

(c）完全图 $K_{n} (n \geqslant 3)$ 的边覆盖数 $\rho(G)=\left[n/2\right]$

（d）完全二部图 $K _ { m , n }$ 的边覆盖数 $\rho(G)=\max(m,n)$ 0

(e）圈图 $C_{n} (n \geqslant 3)$ 的边覆盖数为 $\lceil n / 2 \rceil$ 0

(f) 轮图 $W_{n} (n \geqslant 3)$ 的边覆盖数为 $[ n / 2 ]$ +1。

下述定理给出了最大匹配与最小边覆盖之间的关系。

定理 8.24 设 G(V，E)是没有孤立顶点的简单图，M为 G的一个匹配，N为 G 的一个边覆盖，则|M $\geqslant \rho ( G ) \geqslant | V | / 2 \geqslant \nu ( G ) \geqslant | M |$ ；且当等号成立时，M为G的一个完美匹配，N为G的一个最小边覆盖。

此定理的证明是显然的。

定理 8.25 设 G(V, E)是没有孤立顶点的简单图（例如图 8.72(a))，则有

(a）设M为 G的一个最大匹配，对 G 中每一个M-非饱和顶点均取一条与其关联的边，组成集合N，则M∪N构成G的一个最小边覆盖（例如图8.72(b)和(c))。

（b）设N为G的一个最小边覆盖，若N存在相邻的边，则移去其中一条，直至不存在相邻的边为止，构成的边集合M则为G的一个最大匹配（例如图8.72(d)和(e))。

(c) $\rho ( G ) + \nu ( G ) = | V |$

证明.（将此定理的3个部分放在一起证明。）

(a）由于M为G的一个最大匹配，因此G有n-2ν(G)个非饱和顶点，不可能有两个相邻的非饱和顶点，因此 $\lvert N \lvert = n - 2   \nu ( G )$ $|M \cup N| = n - 2\nu(G) + \nu(G) = n - \nu(G)$ 。明显 M∪N构成了G的一个边覆盖，因此 $n - \nu ( G ) \geq \rho ( G )$ C

（b）由于N是一个最小边覆盖，因此N中任何一条边的两个端点不可能都与N中其他边相关联。所以从N中移去边的时候，产生且只产生M中的一个M-非饱和顶点（例

[page:256]

## 256

如图 8.72(f))。而最终M-非饱和顶点的个数为 $n { - } 2 | M |$ ，故移去的边的数目就是 $n { - } 2 | M |$得到 $| M | = | N | - ( n - 2 | M | )$ ，于是 $\rho ( G ) = | N | = n - | M | \geq n - \nu ( G )$ 0

(c）由(a)部分的证明有 $n - \nu(G) \geq \rho(G)$ ，由(b)部分的证明有 $\rho ( G ) \geqslant n - \nu ( G )$ ，故而必定有 $n - \nu(G) = \rho(G)$ (于是证明了 $\rho(G)=n-\nu(G)$ （于是证明了(b)）和 $\rho(G)+\nu(G)=|V|$ 。口

【例8.64】在图8.71中， $\{ e _ { 1 } ,   e _ { 5 } ,   e _ { 7 } \}$ 是一个最大匹配，图8.71的匹配数是3，边覆盖数是4，二者的和是顶点数7。

此外，1931年匈牙利数学家柯尼希（DénesKönig）给出了二部图中匹配数和最小点覆盖数的相等关系。

证明这个结果之前，需要先引入一个结论。

定理 8.26 假设K为没有孤立顶点的简单图G的任意一个点覆盖集，M 为 G的任意一个匹配，则 $| M | \leq | K |$ 。特别是 $\nu ( G ) \leq \beta ( G )$ o

此定理是显然的，只要注意到M中每条边至少有一端属于K即可。

推论 假设 K 为没有孤立顶点的简单图 G 的任意一个点覆盖集，M 为 G 的任意个匹配，若 $| M | { = } | K |$ ，则M是一个最大匹配，K是一个最小覆盖。

证明.由 $| M | \leqslant \nu ( G ) \leqslant \beta ( G ) \leqslant | K |$ 即得。 □

定理 8.27（柯尼希-艾盖尔瓦里定理，König-Egerváry theorem）二部图中最大匹配的边数等于最小点覆盖数的顶点数。

证明. 假设M是一个最大匹配， $V ^ { * }$ 为G的一个最小点覆盖集。

（1）由定理8.26有 $| M | { \leqslant } | V ^ { * } |$ O

(2)令 $X_{c}=V^{*} \cap X,\quad Y_{d}=V^{*} \cap Y,\quad c=|X_{c}|,\quad d=|Y_{d}|$ 0

考虑顶点为 $X _ { c } \cup ( Y _ { - } Y _ { d } )$ 的G 的导出子图 $G ^ { \prime } ,$ ，它也是二部图，其中存在使 $X _ { c }$ 中每个顶点饱和的匹配 $M _ { 1 }$ :若存在 $S \subseteq X_{c}, \left| N_{G} \left( S \right) \right| < \left| S \right|$ ，则 $( V ^ { * } – S ) \cup { N _ { G } } ^ { \prime } ( S )$ 同样构成了点覆盖集，但元素数小于 $V ^ { * }$ ，与 $V ^ { * }$ 的最小性矛盾。

同理，顶点为 $( X - X _ { c } ) \cup Y _ { d }$ 的G的导出子图中存在使 $Y _ { d }$ 中每个顶点饱和的匹配 $M _ { 2 }$

易见 $M_{1} \cup M_{2}$ 也是G的一个匹配，于是 $|M| \geqslant |M_1 \cup M_2| = |M_1| + |M_2| = |X_c| + |Y_d| = |V^*|$

综合(1)、(2)可得 $| \boldsymbol { M } | { = } | \boldsymbol { V } ^ { * } |$ C

柯尼希-艾盖尔瓦里定理还可以从另一个角度来描述:

所谓布尔矩阵的覆盖，是指选择了矩阵中某些行与列，这些行与列包含了矩阵中的所有非零元1。称能覆盖全部非零元的最小行数、列数之和为最小覆盖数，记为 $S _ { \mathrm { c } }$

对于任一个m×n布尔矩阵，如果覆盖了全部m行或全部n列，就会覆盖全部非零元。因此显然有 $S \leqslant \min(m, n)$ o

【例8.65】图8.73(a)中最小覆盖数为5，而图8.73(b)中最小覆盖数为4（覆盖其第1、2行，第4、5列)。

容易看出，每个布尔矩阵都可以视为二部图的矩阵形式，而每个覆盖都对应于二部图中的一个点覆盖。定义m×n布尔矩阵的秩（term rank）为矩阵中不在同行同列的1元素的最大个数，易见它的秩小于 $\operatorname* { m i n } ( m , n )$ ，而且二部图的矩阵形式的秩就是最大匹配数。则定理8.27也可以等价表述为以下形式。

定理8.28 布尔矩阵的秩等于其最小覆盖数。

[page:257]

## 第8章 图论

是M-非饱和 是M-非饱和

由此，如果将布尔矩阵和二部图（的矩阵形式）视为等同，则二部图的最大匹配数、二部图的点覆盖数、布尔矩阵的秩、布尔矩阵的最小覆盖数四者相等。

下面直观地解释一下最小覆盖与最大匹配之间的关系。假设一个最小覆盖盖住了矩阵的c行d列，现对矩阵进行调整（如图8.74所示):将盖住的c行记为 $X _ { c }$ 并放在上面，将盖住的 d 列记为 $Y _ { d }$ 并放在右面，则由 $X _ { c }$ 到 $Y { - } Y _ { d }$ 有使 $X _ { c }$ 中每个顶点饱和的匹配； $Y _ { d }$到 $X { - } X _ { c }$ 也有使 $Y _ { d }$ 中每个顶点饱和的匹配。

$$\begin{array}{c}\bigcup \bigcup \\\Longleftrightarrow \left( \begin{array}{ccccc}0 & 0 & 1 & 0 & 1 \\1 & 1 & 1 & 0 & 0 \\0 & 0 & 0 & 1 & 0 \\0 & 0 & 0 & 1 & 1 \\0 & 0 & 0 & 0 & 1 \\\end{array} \right) \\\end{array}$$

本节最后给出由最大匹配M（例如图8.75(a)）构造最小点覆盖集合的方法:

如果X中不存在M-非饱和顶点，则X本身就是一个最小点覆盖集。

考虑M-非饱和顶点 $x { \in } X \circ$

如果x是孤立顶点，则不会出现在任何匹配和最小点覆盖中，因此可以不考虑所有孤立顶点。

否则考察所有从x（例如图8.75(b)中的 $x _ { 4 } )$ 开始的交错道路，记Y中所有x可以通过这些道路到达的顶点为集合 $Y _ { x }$ （例如图 8.75(b)中 $Y_{x} = \left\{ y_{2}, y_{5} \right\}$ ，并记 $Y_{1} = \quad \bigcup_{x \in X} \quad Y_{x} 。$

易见每个 $Y _ { 1 }$ 中的元素都与M中唯一的一条边关联，记M中与 $Y _ { 1 }$ 中的元素关联的边集合为 $M _ { 1 }$ ，则 $Y _ { 1 } | { = } | M _ { 1 } |$ (例如图 8.75(c))。记 X 中与 $M { - } M _ { 1 }$ 相关联的顶点集合为 $X _ { 1 }$ （例如图 8.75(d))，则 $| X _ { 1 } | = | M _ { 1 } - | M _ { 1 } |$ 。明显有 $| Y _ { 1 } \cup X _ { 1 } | = | Y _ { 1 } | + | X _ { 1 } | = | M |$ 0

断言: $Y _ { 1 } \cup X _ { 1 }$ 就是一个最小点覆盖集。

只须证明 $Y _ { 1 } \cup X _ { 1 }$ 是一个点覆盖集即可，“最小性”由定理8.27立得。如果存在边uv，$u \in X - X _ { 1 } , v \in Y - Y _ { 1 }$ ，则由 $X_{1} 、 Y_{1}$ 的构造方法可知:或者u本身是M-非饱和顶点，经过uv可到达顶点v；或者存在M-非饱和顶点 $x { \in } X ,$ ，从x开始的某一条交错道路P可以到达顶

[page:258]

## 258

点u，而由P经过uν可到达顶点ν（参看图8.76)。这两者都与 $\scriptstyle { \mathcal { V } } \in Y - Y _ { 1 }$ 产生矛盾。

结合图8.74，则 $Y _ { 1 }$ 就是 $Y _ { d } , ~ X _ { 1 }$ 就是 $X _ { c }$ o

## *8.6.4 二部图中的最佳匹配

最大匹配、霍尔定理都是在边权值为1（或者说是边无权值）的情况下的匹配问题。但在实际应用问题中，边通常具有不同的权值，而且存在多个最大匹配。

例如不同的人从事不同工作时可能具有各不相同的效益或者成本，于是在人员工作安排时，不仅要求每个人有工作可做，而且还进一步要求总的工作效益最高或者成本最小。此时人员和工作可以形成一个二部图，而效益或者代价可以作为边的权值，之后寻找权值总和最大或最小的最大匹配。

在这样的模型中，边的权值称作代价（cost)，这个最大或最小的权值总和称作最优值，这样的完美匹配称作最佳匹配（optimal matching)。

设 $G { = } ( X , Y , E )$ 为赋权完全二部图，其中 $X = \left\{ x_{1}, x_{2}, \cdots, x_{n} \right\}, Y = \left\{ y_{1}, y_{2}, \cdots, y_{n} \right\}$ ，边 $x _ { i } y _ { j }$的权记为 c(i, j)或 $c _ { i j }$ ，假定权值都是非负整数。则最优值为 $\max\left( \sum_{i = 1}^{n} c(i, j_i) \right)$ 或者$\min \left( \sum_{i = 1}^{n} c(i, j_i) \right)$ ，其中 $j_{1}, j_{2}, \cdots, j_{n}$ 构成1~n的一个置换。

下面给出求赋权完全二部图中最大权匹配的算法（算法的“描述语言”是计算在算法过程中间某状态下的最小覆盖，但其本质和计算该状态下的最大匹配是一致的)。在算法中定义“标号”函数为l:X∪Y→Z，对于ν∈X∪Y，l(v)称为顶点ν的标号。

最大权匹配算法 MaxWeightMatch (G)

输入:赋权完全二部图 G=(X, Y, E)

输出:G的一个最大权匹配M

1 令界值 $I \left( x _ { i } \right) = \max _ { j } \left( C _ { i j } \right)$ ，构造矩阵 $B   =   ( \mathcal { D } _ { i j } )$ ，其中 $b _ { i j } = \mathbb { I } \left( x _ { i } \right) - c _ { i j }$

令界值 $\mathcal { I } \left( \gamma _ { j } \right) = - \left( \operatorname { m i n } _ { i } \left( b _ { i j } \right) \right)$ ，更新矩阵B， $b _ { i j } \leftarrow b _ { i j } + I ( y _ { j } )$

2 在矩阵B中对0元素进行最小覆盖，设覆盖数为r

(使用 8.6.1 节算法MaxMatch 及8.6.3 节最后部分由最大匹配构造最小点覆盖集合的方法可得）

3 若r=n，转到步骤6

4 在未覆盖的元素中选最小元δ。考虑矩阵B中的所有元素 $b _ { i j }$

4.1 若第i行、第j列均已被覆盖，则 $b _ { i j } { \leftarrow } b _ { i j } { + } \delta$

[page:259]

## 第8章 图论

4.2 若第i行、第j列均未被覆盖，则 $b _ { \underline { { i } } \underline { { j } } } { \leftarrow } b _ { \underline { { i } } \underline { { j } } } { - } \delta$

5 修改各行各列的标号值

5.1 若第i行未被覆盖，则 $\mathcal { I } \left( x _ { i } \right) \longleftarrow \mathcal { I } \left( x _ { i } \right) - \mathcal { S }$

5.2 若第j列已被覆盖，则 $\mathcal { I } \left( \gamma _ { j } \right) \longleftarrow \mathcal { I } \left( \gamma _ { j } \right) + \delta$

5.3 删除矩阵B的所有覆盖标记，转到步骤2

6 计算 $\sum_{i = 1}^{n} l(x_{i}) + \sum_{j = 1}^{n} l(y_{j})$ ，即为最大权，算法结束

该算法中矩阵 B也是G的某个子图 G'的矩阵形式表示，对$G ^ { \prime }$ 的最大匹配对应于对当前矩阵B的0元素的最小覆盖，其中$e _ { i j } { \in } G ^ { \prime }$ 当且仅当 $b _ { i j } { = } 0$

$$\boldsymbol{C}=\begin{pmatrix}9 & 7 & 9 & 8 & 9 \\8 & 3 & 3 & 3 & 4 \\7 & 5 & 1 & 2 & 2 \\9 & 1 & 4 & 3 & 5 \\5 & 2 & 4 & 1 & 4\end{pmatrix}$$

【例8.66】已知利润矩阵如图8.77所示，求最大利润。解. 过程如图8.78所示。

图 8.77 例 8.66 用图 1

$$\begin{array}{c} \pmb { B } ^ { \pmb { \mathscr { B } } = } \begin{array} { c } { l ( x _ { i } ) } \\ { 9 } \\ { 8 } \\ { 7 } \\ { 9 } \\ { 5 } \\ \end{array} \left[ \begin{array} { c c c c c } { 0 } & { 2 } & { 1 } & { 1 } & { 0 } \\ { 0 } & { 5 } & { 5 } & { 5 } & { 4 } \\ { 0 } & { 2 } & { 6 } & { 5 } & { 5 } \\ { 0 } & { 8 } & { 5 } & { 6 } & { 4 } \\ { 0 } & { 3 } & { 1 } & { 4 } & { 1 } \\ { 0 } & { 0 } & { 0 } & { 0 } & { 0 } \\ \end{array} \right] } \\ { 0 } \\ { 1 } \\ { 1 } \\ \end{array}$$

$$\begin{array}{c} \pmb { B } ^ { = } \begin{array} { c } { l ( x _ { i } ) } \\ { 9 } \\ { 8 } \\ { 7 } \\ { 9 } \\ { 5 } \\ \end{array} \pmb { \left[ \begin{array} { c c c c c } { 0 } & { 0 } & { 0 } & { 0 } & { 0 } & { 0 } \\ { 0 } & { 3 } & { 5 } & { 4 } & { 4 } \\ { 0 } & { 0 } & { 6 } & { 4 } & { 5 } \\ { 0 } & { 6 } & { 5 } & { 5 } & { 4 } \\ { 0 } & { 1 } & { 1 } & { 3 } & { 1 } \\ { 0 } & { - 2 } & { 0 } & { - 1 } & { 0 } & { l ( y _ { j } ) } \end{array} \right] } \\ { } \end{array}$$

$$\begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \begin{array}{l} \boldsymbol{B}=\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\end{array}\end{array}\end{array}\begin{array}{l}\begin{array}{l}\begin{array}{l}\end{array}\end{array}\end{array}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\end{array}\end{array}\end{array}\end{array}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\end{array}\end{array}\end{array}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\end{array}\end{array}\end{array}\end{array}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}{l}\end{array}\end{array}\end{array}\end{array}\begin{array}{l}\begin{array}{l}\begin{array}{l}\begin{array}{l}{l}\begin{array}{l}\end{array}{l}\end{array}\end{array}\begin{array}{l}\begin{array}{l}{l}\begin{array}{l}\begin{array}{l}{l}\end{array}\end{array}{l}\end{array}\end{array}\begin{array}{l}{l}\begin{array}{l}\begin{array}{l}{l}\begin{array}{l}{l}\end{array}{l}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\begin{array}{l}{l}\begin{array}{l}{l}\begin{array}{l}{l}\begin{array}{l}{l}\begin{array}{l}{l}\begin{array}{l}{l}\begin{array}{l}{l}\end{array}{l}\end{array}{l}\end{array}{l}\end{array}\end{array}{l}\end{array}\end{array}{l}\begin{array}{l}{l}\begin{array}{l}{l}I(x_{i})\\\end{array}\end{array}\end{array}{l}\begin{array}{l}{l}\begin{array}{l}{l}\begin{array}{l}{l}{l}\end{array}{l}\end{array}\end{array}{l}\end{array}\end{array}\end{array}{l}\end{array}\end{array}\begin{l}{l}\end{array}\end{array}\begin{l}{l}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\begin{l}\end{array}\end{l}\end{array}\end{array}\end{array}\end{l}\end{array}\end{array}\end{l}\end{array}\end{array}\end{l}\end{array}\end{l}\end{array}\end{l}\end{array}\end{l}\end{array}\end{l}\end{l}\end{array}\end{l}\end{l}\end{l}\end{l}\end{array}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}\end{l}$$

(a) 步骤1

$$\pmb { B } ^ { = } \quad \pmb { B } ^ { = } \quad \pmb { T } \quad \left[ \begin{array} { c c c c c } { { l ( x _ { i } ) } } & { { } } & { { } } & { { } } & { { } } \\ { { 9 } } & { { } } & { { 0 } } & { { 0 } } & { { 0 } } & { { 0 } } \\ { { 7 } } & { { } } & { { 0 } } & { { 2 } } & { { 4 } } & { { 3 } } & { { 3 } } \\ { { } } & { { } } & { { } } & { { } } & { { } } & { { } } & { { } } \\ { { 1 } } & { { 1 } } & { { 0 } } & { { 6 } } & { { 4 } } & { { 5 } } \\ { { } } & { { } } & { { } } & { { } } & { { } } & { { } } & { { } } \\ { { 8 } } & { { } } & { { 0 } } & { { 5 } } & { { 4 } } & { { 4 } } & { { 3 } } \\ { { } } & { { } } & { { } } & { { } } & { { } } & { { } } & { { } } \\ { { } } & { { } } & { { 1 } } & { { 0 } } & { { 0 } } & { { 2 } } & { { 0 } } \\ { { } } & { { } } & { { } } & { { } } & { { } } & { { } } & { { } } \\ { { } } & { { } } & { { 0 } } & { { - 2 } } & { { 0 } } & { { - 1 } } & { { 0 } } & { { l ( y _ { j } ) } } \end{array} \right]$$

(b) 步骤1

(c) 步骤2和4

$$\boldsymbol{B}^{=}\begin{array}{l}l(\boldsymbol{x}_{i}) \bigvee \\\quad 9 \\\quad 7 \\\quad 8 \\\quad 4 \\\quad 1 \\\quad 1 \\\end{array}\begin{array}{l}\left[\begin{array}{ccccc}1 & 0 & 0 & 0 & 0 \\0 & \overbrace{2} & 4 & 3 \\\end{array}\right] \longleftrightarrow \\\quad 1 & 0 & 6 & 4 & 5 \\\quad 0 & 5 & 4 & 4 & 3 \\\quad 0 & 0 & 0 & 2 & 0 \\\quad 1 & -2 & 0 & -1 & 0 \\\end{array}\begin{array}{l}\longleftrightarrow \\\longleftrightarrow \\\longleftrightarrow \\\end{array}$$

$$\pmb { B } ^ { = } \; \pmb { B } ^ { = } \; \pmb { \mathscr { f } } \left[ \begin{array} { c c c c c } { { l ( x _ { i } ) } } & { { } } & { { } } & { { } } & { { } } \\ { { 9 } } & { { } } & { { } } & { { } } & { { } } \\ { { 5 } } & { { } } & { { 0 } } & { { 0 } } & { { 0 } } & { { 0 } } \\ { { } } & { { } } & { { } } & { { } } & { { } } & { { } } \\ { { 7 } } & { { } } & { { 0 } } & { { 2 } } & { { 1 } } & { { 1 } } \\ { { } } & { { } } & { { } } & { { } } & { { } } & { { } } \\ { { } } & { { } } & { { 3 } } & { { 0 } } & { { 6 } } & { { 4 } } & { { 5 } } \\ { { } } & { { } } & { { } } & { { } } & { { } } & { { } } & { { } } \\ { { } } & { { } } & { { 0 } } & { { 3 } } & { { 2 } } & { { 2 } } & { { 1 } } \\ { { } } & { { } } & { { } } & { { } } & { { } } & { { } } & { { } } \\ { { } } & { { } } & { { 2 } } & { { 0 } } & { { 0 } } & { { 2 } } & { { 0 } } \\ { { } } & { { } } & { { } } & { { } } & { { } } & { { } } & { { } } \\ { { } } & { { } } & { { 3 } } & { { - 2 } } & { { 0 } } & { { - 1 } } & { { 0 } } & { { l ( y _ { j } ) } } \end{array} \right]$$

(d) 步骤4和5

(e) 步骤2和4

(f) 步骤4和5

$$\boldsymbol{B}=\begin{array}{c}l(\boldsymbol{x}_{i}) \underbrace{\left[\begin{array}{cccc}0 & 0 & 0 & 0 \\\end{array}\right]}_{\substack{\left[\begin{array}{cccc}3 & 0 & 0 & 0 & 0 \\\end{array}\right]}} \longleftarrow \\7 \underbrace{\left[\begin{array}{cccc}3 & 0 & 2 & \overbrace{(1)} \\\end{array}\right]}_{\substack{\left[\begin{array}{cccc}3 & 0 & 6 & 4 & 5 \\\end{array}\right]}} \longleftarrow \\6 \underbrace{\left[\begin{array}{cccc}0 & 3 & 2 & 2 & 1 \\\end{array}\right]}_{\substack{\left[\begin{array}{cccc}2 & 0 & 0 & 2 & 0 \\\end{array}\right]}} \longleftarrow \\4 \underbrace{\left[\begin{array}{cccc}3 & -2 & 0 & -1 & 0 \\\end{array}\right]}_{\substack{\left[\begin{array}{cccc}y_{j}\end{array}\right]}}\end{array}$$

(g) 步骤2和4

$$\pmb { B } ^ { = } \quad \pmb { B } ^ { = } \quad \pmb { \mathscr { l } } \left( \begin{array} { c } { l } { { \mathscr { l } } } \\ { { \mathscr { 9 } } } \\ { { \mathscr { 4 } } } \\ { { \mathscr { 6 } } } \end{array} \right) \left[ \begin{array} { c c c c c } { { \mathscr { 4 } } } & { { \mathscr { 1 } } } & { { \mathscr { 0 } } } & { { \mathscr { 0 } } } & { { \mathscr { 0 } } } \\ { { \mathscr { 0 } } } & { { \mathscr { 0 } } } & { { \mathscr { 1 } } } & { { \mathscr { 0 } } } & { { \mathscr { 0 } } } \\ { { \mathscr { 3 } } } & { { \mathscr { 0 } } } & { { \mathscr { 5 } } } & { { \mathscr { 3 } } } & { { \mathscr { 4 } } } \\ { { \mathscr { 5 } } } & { { \mathscr { 0 } } } & { { \mathscr { 3 } } } & { { \mathscr { 1 } } } & { { \mathscr { 1 } } } & { { \mathscr { 0 } } } \\ { { \mathscr { 4 } } } & { { \mathscr { 3 } } } & { { \mathscr { 1 } } } & { { \mathscr { 0 } } } & { { \mathscr { 2 } } } & { { \mathscr { 0 } } } \\ { { \mathscr { 4 } } } & { { \mathscr { - } } } & { { \mathscr { 0 } } } & { { \mathscr { - } } } & { { \mathscr { 0 } } } & { { \mathscr { l } } ( y _ { j } ) } \end{array} \right]$$

$$\pmb { B } = \begin{array} { c } { l } { l ( x _ { i } ) } \\ { \begin{array} { c } { 9 } \\ { 4 } \\ { \boxed { 0 } } \\ { 3 } \\ { \begin{array} { c } { 0 } \\ { 4 } \\ \end{array} } \\ \end{array} \begin{array} { l } { \begin{array} { c } { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ { \phantom { 0 } } \\ {  \end{array} \end{array} \end{array}$$

(h) 步骤4和5

(i) 步骤2

图 8.78 例 8.66 用图 2

因此，一个最佳匹配是 $\{ x _ { 1 } y _ { 4 } , x _ { 2 } y _ { 1 } , x _ { 3 } y _ { 2 } , x _ { 4 } y _ { 5 } , x _ { 5 } y _ { 3 } \}$ ，其最大利润为 $w_{14} + w_{21} + w_{32} + w_{45} +$ $w_{53} = (l(x_{1}) + \cdots + l(x_{5})) + (l(y_{1}) + \cdots + l(y_{5})) = 30.$

[page:260]

## 260

类似地，可以得到最小权匹配算法。

最小权匹配算法 MinWeightMatch (G)

输入:赋权完全二部图 $G { = } ( X , Y , E )$

输出:G的一个最小权匹配M

1 令界值 $\mathcal { I } \left( \mathbf { x } _ { \mathbf { i } } \right) = \operatorname { m i n } _ { \mathcal { j } } \left( C _ { \mathbf { i } \mathbf { j } } \right)$ ，构造矩阵 $B   =   ( \mathcal { D } _ { i j } )$ ，其中 $b _ { i j } { = } c _ { i j } { - } \mathbb { I } \left( x _ { i } \right)$令界值 $\mathcal{I}(y_{j}) = \min_{\mathcal{i}} \left( b_{ij} \right)$ ，更新矩阵B， $b _ { i j } { \leftarrow } b _ { i j } { - } I ( y _ { j } )$

2 在矩阵B中对0元素进行最小覆盖，设覆盖数为r

3 若r=n，转到步骤6

4 在未覆盖的元素中选最小 $元  \delta 。$ 考虑矩阵B中的所有元素 $b _ { i j }$

4.1 若第i行、第j列均已被覆盖，则 $b _ { i j } { \leftarrow } b _ { i j } { + } \delta$

4.2 若第i行、第j列均未被覆盖，则 $b _ { \underline { { i } } \underline { { j } } } { \leftarrow } b _ { \underline { { i } } \underline { { j } } } { - } \delta$

5 修改各行各列的标号值

5.1 若第i行未被覆盖，则 $\mathcal { I } \left( x _ { i } \right) \longleftarrow \mathcal { I } \left( x _ { i } \right) + \delta$

5.2 若第j列已被覆盖，则 $\mathcal { I } \left( \gamma _ { j } \right) \longleftarrow \mathcal { I } \left( \gamma _ { j } \right) - \mathcal { S }$

5.3 删除矩阵B的所有覆盖标记，转到步骤2 6 计算 $\sum_{i = 1}^{n} l(x_{i}) + \sum_{j = 1}^{n} l(y_{j})$ ，即为最小权，算法结束

$$\begin{pmatrix}7 & 6 & 4 & 6 & 1 \\4 & 6 & 5 & 7 & 2 \\3 & 5 & 7 & 6 & 8 \\4 & 7 & 8 & 8 & 5 \\2 & 6 & 5 & 6 & 3\end{pmatrix}$$

【例8.67】计算图8.79所示的成本矩阵中的最小成本。解. 过程如图8.80所示。

图 8.79 例 8.67 用图 1

$$\begin{array}{c} \pmb { B } ^ { \pmb { \mathscr { B } } = } \begin{array} { c } { l } { l ( x _ { i } ) } \\ { 1 } \\ { 2 } \\ { 3 } \\ { 4 } \\ { 4 } \\ { 2 } \\ \end{array} \left[ \begin{array} { c c c c c } { 6 } & { 5 } & { 3 } & { 5 } & { 0 } \\ { 2 } & { 4 } & { 3 } & { 5 } & { 0 } \\ { 0 } & { 2 } & { 4 } & { 3 } & { 5 } \\ { 0 } & { 3 } & { 4 } & { 3 } & { 5 } \\ { 0 } & { 3 } & { 4 } & { 4 } & { 1 } \\ { 0 } & { 4 } & { 3 } & { 4 } & { 1 } \\ { 0 } & { 0 } & { 0 } & { 0 } & { 0 } & { l ( y _ { j } ) } \end{array} \right] } \\ { 0 } \\ \end{array}$$

$$\begin{array}{c} \pmb { B } ^ { \pmb { \mathscr { B } } = } \begin{array} { c } { l ( x _ { i } ) } \\ { 1 } \\ { 2 } \\ { 3 } \\ { 4 } \\ { 2 } \\ \end{array} \left[ \begin{array} { c c c c c } { 6 } & { 3 } & { 0 } & { 2 } & { 0 } \\ { 2 } & { 2 } & { 0 } & { 2 } & { 0 } \\ { 0 } & { 0 } & { 1 } & { 0 } & { 5 } \\ { 0 } & { 1 } & { 1 } & { 1 } & { 1 } \\ { 0 } & { 2 } & { 0 } & { 1 } & { 1 } \\ { 0 } & { 2 } & { 3 } & { 3 } & { 0 } & { l ( y _ { i } ) } \end{array} \right] } \\ { 0 } \\ { 1 } \\ { 2 } \\ \end{array}$$

$$\begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \boldsymbol{B}^{=}\begin{array}{c}\begin{array}{cccc}\begin{array}{cccc}\begin{array}{cccc}\begin{array}{cccc}\begin{array}{cccc}\begin{array}{c}\begin{array}{c}\begin{array}{c}\begin{array}{c}\begin{array}{c}\begin{array}{c}\begin{array}{c}\begin{array}{c}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\begin{array}{c}\begin{array}{c}\begin{array}{cccc}\begin{array}{c}\begin{array}{c}\begin{array}{c}\begin{array}{c}\begin{c}\end{array}{c}\begin{array}{c}\begin{array}{c}\begin{c}\end{array}{c}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\begin{array}{c}\begin{array}{c}\begin{array}{c}\begin{array}{c}\begin{array}{c}\begin{array}{c}\begin{array}{c}{c}\begin{array}{c}\begin{array}{c}\begin{array}{c}\end{array}{c}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\begin{array}{c}\begin{array}{c}\begin{array}{c}{c}\begin{array}{c}\begin{array}{c}{c}\begin{array}{c}\begin{array}{c}{c}\begin{array}{c}{c}\begin{array}{c}\end{array}{c}\end{array}{c}\end{array}\end{array}{c}\end{array}\end{array}{c}\begin{array}{c}{c}\begin{array}{c}{c}\begin{array}{c}{c}\begin{array}{c}{c}\begin{array}{c}{c}\end{array}{c}\end{array}{c}\end{array}\end{array}{c}\begin{array}{c}{c}\begin{array}{c}{c}\begin{array}{c}{c}\begin{array}{c}{c}\end{array}{c}\end{array}\end{array}{c}\end{array}{c}\begin{array}{c}{c}\begin{array}{c}{c}{c}\end{array}{c}\end{array}\end{array}{c}\end{array}\begin{array}{c}{c}{c}\begin{array}{c}{c}{c}\end{array}\end{array}{c}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}$$

(a) 步骤1

(b) 步骤1

(c) 步骤2和4

$$\begin{array}{c} \pmb { B } = \begin{array} { c } { l ( x _ { i } ) } \\ { 2 } \\ { 3 } \\ { 3 } \\ { 5 } \\ { 3 } \\ { 4 } \\ { 5 } \\ { 3 } \\ \end{array} \left[ \begin{array} { c c c c c } { 6 } & { 2 } & { 0 } & { 1 } & { 0 } \\ { 2 } & { 1 } & { 0 } & { 1 } & { 0 } \\ { 1 } & { 0 } & { 2 } & { 0 } & { 6 } \\ { 0 } & { 0 } & { 1 } & { 0 } & { 6 } \\ { 0 } & { 0 } & { 1 } & { 0 } & { 1 } \\ { 0 } & { 1 } & { 0 } & { 0 } & { 1 } \\ { - 1 } & { 2 } & { 2 } & { 3 } & { - 1 } \\ \end{array} \right] } \\ { } \\ { - 1 } \\ \end{array}$$

$$\begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \begin{array}{c} \boldsymbol{B}=\begin{array}{c}l(\boldsymbol{x}_{i}) \\\hline 2 \\\hline 3 \\\hline 5 \\\hline 3 \\\end{array}\begin{array}{c}l(\boldsymbol{x}_{i}) \\\hline 2 \\\hline 6 \\\hline 1 \\\hline 2 \\\hline 1 \\\hline 1 \\\hline 1 \\\hline 1 \\\hline 0 \\\hline 3 \\\end{array}\begin{array}{c}\begin{array}{c}\overline{\bigcup} \\ \overline{\begin{array}{c}{c}2 \\ \begin{array}{c}{c} \begin{c} \begin{c} \begin{array}{c}{c} \begin{c} \begin{c} \begin{c} \begin{c} \begin{c} \begin{c} \begin{c} \begin{c} \begin{c} \begin{c} \begin{c} \end{c} \begin{c} \end{c} \end{c} \end{c} \end{array} \end{array} \end{array} \end{array} \end{array} \end{array} \end{array} \begin{c}{c}\begin{array}{c}\begin{c}\begin{array}{c}{c}\begin{c}\begin{c}\begin{c}\begin{array}{c}{c}\begin{c}\begin{c}\begin{c}\begin{c}\begin{c}\begin{array}{c}\begin{c}\begin{c}\begin{c}\begin{array}{c}\end{c}\end{c}\end{array}\end{c}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\end{array}\begin{c}{array}{c}\begin{array}{c}\begin{array}{c}{c}\begin{array}{c}\begin{c}\begin{array}{c}{c}\begin{c}\begin{array}{c}\begin{c}\begin{array}{c}\begin{c}\end{array}{c}\begin{c}\begin{array}{c}\begin{c}\begin{array}{c}\end{array}{c}\begin{c}\begin{array}{c}\end{array}{c}\begin{c}\end{array}{c}\begin{array}{c}\begin{c}\end{array}{c}\begin{array}{c}\begin{array}{c}{c}\end{array}{c}\begin{array}{c}\begin{c}\end{array}{c}\begin{array}{c}{c}\end{array}{c}\begin{array}{c}\begin{array}{c}{c}\end{array}{c}\begin{array}{c}{c}\end{array}{c}\begin{array}{c}{c}\end{array}{c}\begin{array}{c}{c}\end{array}{c}\begin{array}{c}{c}\end{array}{c}\begin{array}{c}{c}\end{array}{c}\begin{array}{c}{c}\end{array}{c}\begin{array}{c}{c}\end{array}{c}{c}\end{array}{c}\begin{array}{c}{c}\end{array}{c}{c}\end{array}{c}\begin{array}{c}{c}{c}\end{array}{c}{c}\end{array}{c}\begin{array}{c}{c}{c}\end{array}{c}{c}\end{array}{c}{c}}\begin{array}{c}{c}{c}\end{array}{c}{c}{c}\end{array}{c}{c}\begin{array}{c}{c}{c}{c}\end{array}{c}{c}{}\end{array}{c}{c}}{\begin{array}{c}{c}{c}{c}{}\end{array}{c}{c}{c}}{\end{array}}{c}{c}{}\begin{array}{c}{c}{c}{c}{}{c}{}\end{array}{c}{c}{}}{\begin{array}{c}{c}{c}{c}{c}{}{c}{}{}\end{array}}{c}{c}{}{}{\begin{array}{c}{c}{c}{c}{}}{c}{}{\end{array}}{c}{c}{}{}{}\end{array}{array}{c}{c}{c}{c}{}{c}{}{}\begin{array}{c}{c}{c}{c}{}{c}{}{c}{}{c}{}{}\end{array}{c}{c}{}{c}{}}{\end{array}{array}{c}{c}{c}{c}{}{c}{}}{c}{c}{}{\begin{array}{c}{c}{c}{}{c}{c}{c}{}{c}{}{c}{}{c}{}{}{c}{}{}\end{array}{c}{c}{c}{c}{}{c}{c}{}{c}{}{c}{c}{c}{}{}}{$$

(d) 步骤4和5

(e) 步骤2

图 8.80 例 8.67 用图 2

因此，一个最佳匹配是 $\{ x _ { 1 } y _ { 3 } , x _ { 2 } y _ { 5 } , x _ { 3 } y _ { 2 } , x _ { 4 } y _ { 1 } , x _ { 5 } y _ { 4 } \}$ ，其最小成本为 $w_{13}+w_{25}+w_{32}+w_{41}+w_{54}$ $l(x_{1}) + \cdots + l(x_{5}) + (l(y_{1}) + \cdots + l(y_{5})) = 21$

下面对算法的正确性进行证明。

[page:261]

## 第8章 图论

定理 8.29 算法MaxWeightMatch 的结果是最大权匹配。

证明.分3个步骤证明。

（1）断言:在算法步骤1中矩阵B始终满足 $b _ { i j } = l ( x _ { i } ) + l ( y _ { j } ) - c _ { i j } \geq 0$

不失一般性，假设算法在某轮变换时，最小覆盖盖住了共 $c$ 行和 $d$ 列， $c + d < n$ ，δ是未覆盖的最小元，算法步骤4.1和4.2中矩阵B中的元素变化为 $\boldsymbol { b } _ { \; i j } ^ { * } ,$ ，步骤5中标号变为$\boldsymbol { l } ^ { * } ( x _ { i } ) , \boldsymbol { l } ^ { * } ( y _ { j } ) ( 1 \leqslant i , j \leqslant n )$ 。

由步骤5.1，若第i行未被覆盖，则 $l ^ { * } ( x _ { i } ) { = } l ( x _ { i } ) { - } \delta ;$ 由步骤5.2，若第j列已被覆盖则 $l ^ { * } ( y _ { j } ) { = } l ( y _ { j } ) { + } \delta _ { \circ }$

若 $b _ { i j }$ 既被行覆盖也被列覆盖，由步骤4.1，则

$$b ^ { * } { } _ { i j } = b _ { i j } + \delta , \quad l ^ { * } ( x _ { i } ) + l ^ { * } ( y _ { j } ) - b ^ { * } { } _ { i j } = l ( x _ { i } ) + ( l ( y _ { j } ) + \delta ) - ( b _ { i j } + \delta ) = l ( x _ { i } ) + l ( y _ { j } ) - b _ { i j } .$$

若 $b _ { i j }$ 只被行覆盖，则

$$b ^ { * } { } _ { i j } { = } b _ { i j } , \quad l ^ { * } ( x _ { i } ) { + } l ^ { * } ( y _ { j } ) { - } b ^ { * } { } _ { i j } { = } l ( x _ { i } ) { + } l ( y _ { j } ) { - } b _ { i j }$$

若 $b _ { i j }$ 只被列覆盖，则

$$b ^ { * } { } _ { i j } { = } b _ { i j } , \quad l ^ { * } ( x _ { i } ) { + } l ^ { * } ( y _ { j } ) { - } b ^ { * } { } _ { i j } { = } ( l ( x _ { i } ) { - } \delta ) { + } ( l ( y _ { j } ) { + } \delta ) { - } b _ { i j } { - } l ( x _ { i } ) { + } l ( y _ { j } ) { - } b _ { i j }$$

若 $b _ { i j }$ 未被覆盖，由步骤4.2，则

$$b ^ { * } { } _ { i j } = b _ { i j } - \delta , \quad l ^ { * } ( x _ { i } ) + l ^ { * } ( y _ { j } ) - b ^ { * } { } _ { i j } = ( l ( x _ { i } ) - \delta ) + l ( y _ { j } ) - ( b _ { i j } - \delta ) = l ( x _ { i } ) + l ( y _ { j } ) - b _ { i j }$$

由于 $0 \leqslant \delta \leqslant b_{ij}$ ，因此 ${ \boldsymbol { b } } ^ { * } { } _ { i j } { \geqslant } 0$ ，且 $l ( x _ { i } ) { + } l ( y _ { j } ) { - } b _ { i j }$ 的值保持不变，为 $c _ { i j }$ ，特别是 $b _ { i j } { = } 0$ 时，$l(x_{i}) + l(y_{j}) = c_{ij}$

（2）算法一定会终止。

首先图中的完美匹配是有限个的，因此最佳匹配一定存在。

①每轮算法都使得 $\sum_{i = 1}^{n} \left( l(x_{i}) + l(y_{i}) \right)$ 下降，这可由

$$\begin{align*}\sum_{i = 1}^{n} \left( l^{*} \left( x_{i} \right) + l^{*} \left( y_{i} \right) \right) &= \sum_{i = 1}^{n} \left( l \left( x_{i} \right) + l \left( y_{i} \right) \right) - (n - c) \delta + d \delta \\&= \sum_{i = 1}^{n} \left( l \left( x_{i} \right) + l \left( y_{i} \right) \right) - (n - (c + d)) \delta\end{align*}$$

及 c+d<n 立得。

$\sum_{i = 1}^{n} \left( l(x_{i}) + l(y_{i}) \right)$ 具有下界。

假设最佳匹配为 $M = \left\{ x_{1}y_{j_{1}}, x_{2}y_{j_{2}}, \ldots, x_{n}y_{j_{n}} \right\}$ ，考虑任一种满足 $b_{ij} = l^{\prime}(x_i) + l^{\prime}(y_j) - c_{ij} \geq 0 (1 \leq$ $i , j \leqslant n )$ 的标号方法l'，都有 $\sum_{i = 1}^{n}c\left( x_{i},y_{j_{i}} \right) \leqslant \sum_{i = 1}^{n}\left( l^{\prime}\left( x_{i} \right) + l^{\prime}\left( y_{j_{i}} \right) \right)$ ，知 $\sum_{i = 1}^{n} \left( l(x_{i}) + l(y_{i}) \right)$ 以最佳匹配的最优值为下界。

③由于 l(xi)和l(yj)都是整数，S是正整数，因此 $\sum_{i = 1}^{n} \left( l(x_{i}) + l(y_{i}) \right)$ 不会无限下降，算法必定在有限步骤后终止。

（3）断言:算法终止时，一定可以得到最佳匹配。

算法终止时一定出现了n个不在同行、同列的 $b _ { i j }$ 均为0，假设它们是 $b _ { 1 , j _ { 1 } } , b _ { 2 , j _ { 2 } } , \cdots$

[page:262]

## 262

$b _ { n , j _ { n } }$ ，因此对当前矩阵B的0元素最小覆盖的覆盖数为n。对应于G'的匹配数为n，就是G的一个完美匹配M，而且此时有 $\sum_{i = 1}^{n} \left( l(x_{i}) + l(y_{i}) \right) = \sum_{1 \leq i \leq n} c(i, j_{i})$ C

考虑原图 G 的任意一个完美匹配 $M^{\prime} = \left\{ x_{1}y_{j_{1}}, x_{2}y_{j_{2}}, \cdots, x_{k}y_{j_{k}} \right\}$ ，则由矩阵B始终满足 $b _ { i j } = l ( x _ { i } ) + l ( y _ { j } ) - c _ { i j } \geq 0$ 可得 $\sum_{i = 1}^{n} c(x_i, y_{j_i}) \leq \sum_{i = 1}^{n} \left( l(x_i) + l(y_{j_i}) \right) = \sum_{1 \leq i \leq n} c(i, j_i)$

这表明算法终止时即得最大权匹配。

也可以从二部图的匹配的角度来证明算法一定会终止。

在步骤2 中，假设通过算法 MaxMatch 求出的 G'中最大匹配为M。

如果X中不存在M-非饱和顶点，则X本身就是一个完美匹配，算法终止。

否则考虑M-非饱和顶点 $x { \in } X _ { \circ }$ 按照G和G'的构造方法，x不可能是孤立顶点，考察所有从 x开始的交错道路，记 Y中所有 x可以通过这些道路到达的顶点为集合 $Y _ { x } ,$ ，记X中所有x可以通过这些道路到达的顶点为集合 $X _ { x }$ (包含点x本身)。记 $S = \bigcup_{\substack{x \in X \\  是  M - 非饱和 }} X_{x}$

$T = \bigcup_{\substack{x \in X \\  是  M - 非饱和 }} Y_{x}$ 。则(X-S)∪T就是G'的一个最小点覆盖集，也是对当前矩阵B的0元素的

最小覆盖，被覆盖的行的集合是X-S,被覆盖的列的集合是T。由(X-S)到(Y-T)有使 (X-S)中每个顶点饱和的匹配；T到S也有使T中每个顶点饱和的匹配（图8.81(a))。

注意由步骤4和步骤4.2，算法在每一轮变换中都会在未被覆盖的位置添加至少一个0。这相当于在G'中添加一条边 $u v   \in   S   \times   ( Y   -   T )$

由S的构造方法可知，或者u本身就是M-非饱和顶点，或者存在M-非饱和顶点 $x { \in } X ,$从 x开始的某一条交错道路可以到达顶点u。

若ν是M-非饱和顶点（图8.81(b))，则产生由x到ν的M-可增广道路，因此可以扩充M（至多发生 n次)。

若ν是 M-饱和顶点，则可以扩充 S 和 T（图 8.81(c)，这个环节在扩充 M 之前至多发生n次)。

因此算法在至多执行 $n ^ { 2 }$ 轮后必定终止。

[page:263]

## 第8章 图论

## 8.7图的着色

定义8.51 对简单图G的每个顶点赋予一种颜色，使得相邻的顶点颜色不同，称为图 G的一种点着色（vertex coloring)。对简单图 G进行点着色所需要的最少颜色数称为G的点色数(chromatic number)，记为x(G)。

注:对于n阶简单图G，明显地有 $\chi(G) \leq n$ 0

定义8.52 对简单图G的每条边赋予一种颜色，使得相邻的边颜色不同，称为图G的一种边着色（edge coloring）。

定义8.53 对无桥平面图G的每个面赋予一种颜色，使得相邻的面颜色不同，称为图 G 的一种面着色（face coloring）。

利用对偶图的概念，可以把平面图G的面着色问题转化为研究对偶图 $G ^ { * }$ 的点着色问题；而通过下面的线图概念，也可以将图的边着色问题转化为点着色问题。

定义 8.54 假设 G 是简单图，构造图 L(G)，G 中的边和 L(G)中的顶点一一对应，如果G中的边 $e _ { 1 }$ 和 $e _ { 2 }$ 相邻，则在L(G)中与 $e _ { 1 }$ 和 $e _ { 2 }$ 相对应的两个顶点间连一条边，称L(G)是 G 的线图（line graph）。

【例8.68】在图8.82中，(b)是(a)的线图，(d)是(c)的线图，(e)是彼得森图的线图。

【例8.69】 图8.83(a)的点色数是2，(b)的点色数是4，(c)的点色数是3。

【例8.70】彼得森图中含有长度为5的圈，因此至少要用3种颜色才能够正常着色。另一方面，彼得森图可以用3种颜色进行点着色（如图8.84所示）。因此彼得森图的点色数是3。

【例8.71】

(a) $\chi ( G ) { = } 1$ 当且仅当G是离散图。

[page:264]

## 离散数学及应用（第2版）

(b) $\chi ( K _ { n } ) = n$ 0

(c) $\chi(C_{n}) = 2$ ，n 是偶数时； $\chi(C_{n}) = 3$ ，n是奇数时。 $(n \geqslant 3)$

(d) $\chi ( W _ { n } ) { = } 3$ ，n 是偶数时； $\chi ( W _ { n } ) { = } 4$ ，n是奇数时。 $(n \geqslant 3)$

(e) $\chi ( G ) { = } 2$ 当且仅当G是二部图。

【例8.72】有6种化学药品，其中药品a和b不能存放在同一个仓库中，否则将发生化学反应，类似地，a和d、b和 e、b和f、c和d、c和 e、c和f、d和e也不能存放在同一个仓库中，请问至少需要多少个仓库存放这6种药品？

解.用顶点表示药品，如果两种药品不能存放在同一个仓库中，则在代表着两种药品的顶点之间连一条边，于是得到图8.85(a)。问题转化为对图8.85(a)的顶点着色问题，该图的点色数为3（如图8.85(b)所示)，因此至少需要3个仓库。

【例8.73】学校期末要举行各个课程的考试，要求学同一门课程的学生考试时间尽可能相同，问至少要举行多少场考试？

这个问题也可以转化为顶点着色:用顶点表示考试，顶点u和ν邻接当且仅当有学生既要参加u课程的考试又要参加ν课程的考试。那么，所得图的每一种顶点着色方案都给出了考试的一种安排方式，而最少的考试场次正好对应着图的点色数x(G)。

图 G的点着色可以确立其顶点集V上的一个二元关系 $R , ( u , v ) { \in } R$ 当且仅当 u 和 ν着以同一种颜色。由此可以得到V的一个划分 $\{ V _ { 1 } , \; V _ { 2 } , \; \cdots , \; V _ { k } \}$ ，其中每个划分块 $V _ { i }$ 都是G的一个点独立集。

反过来，若 $\{ V _ { 1 } , \; V _ { 2 } , \; \cdots , \; V _ { k } \}$ 是V上对应于点独立集的一个划分，则可由此确定G的一种着色法。

显然，图G的点色数就是将顶点集V关于独立集作划分时，划分块为最少时的数目。

决定一个图的点色数是一个难题（准确地讲，它是一个NP完全问题)，目前尚不存在有效的方法，因此在对图进行点着色时常采用近似算法，尽管不能得到最优结果，但是算法的执行却是快捷有效的。

下面介绍韦尔奇-鲍威尔（Welch-Powell）点着色算法:

韦尔奇-鲍威尔算法 Welch-Powell (G)

输入:简单图G

输出:图G的一个点着色方案

1.将图中顶点按度数不增的方式排成一个序列

2.使用一种新颜色对序列中的第一个顶点进行着色，并且按照序列次序，对与已着色顶点不邻接的每一顶点着同样的颜色，直至序列末尾。然后从序列中去掉已着色的顶点，得到一个新的序列

3.对新序列重复步骤2，直至得到空序列

[page:265]

## 第8章 图论

【例8.74】使用韦尔奇-鲍威尔方法对图8.86(a)进行顶点着色。

解.将图中各顶点按度数不增的次序排列得到顶点序列: $b , a , d , g , h , c , e , f _ { \circ }$

对顶点b着以第一种颜色，依次考察序列中其他顶点: $a 、 d 、 g 、 h$ 与b相邻，因此它们不能着第一种颜色； $c$ 与b不相邻，所以顶点c也着第一种颜色； $e$ 与已着色的顶点$c$ 相邻，因此不能着第一种颜色；f与已着色的顶点b和c都不相邻，因此着第一种颜色；至此第一轮着色过程结束（如图8.86(b)所示)，得到新的顶点序列: $a , d , g , h , e \mathrm { { } _ { \circ } }$

重复上述过程，对顶点 a、d、e着第二种颜色，对顶点g着第三种颜色，对顶点 h着第四种颜色，至此结束，得到图8.86(c)。

要说明的是，韦尔奇-鲍威尔算法并不总能得到最少颜色数目的着色方案。例如在图8.87(a)中，每个顶点的度数都是3，如果按照 $a , b , c , d , e , f , g , h$ 的顺序排列顶点，那么使用韦尔奇-鲍威尔算法将得到图8.87(b)的结果，共使用了4种颜色；而如果按照 $a , c , e ,$ g, b, d,f, h的顺序排列顶点，那么使用韦尔奇-鲍威尔算法将得到图 8.87(c)的结果，共使用了两种颜色，达到了该图的点色数。

下面介绍两个有关图着色的著名问题。

每个平面图都可以只使用4种颜色进行面着色，这就是著名的“四色定理”:一张各国地域连通，并且相邻国家有一段公共边界的平面地图上，可以用4种颜色为地图着色，使得相邻国家着有不同的颜色。它在图论发展史上起到过巨大的推动作用。

1852年，佛朗西斯·古思里（FrancisGuthrie）在绘制英格兰分郡地图时，发现许多地图都只需用4种颜色染色，就能保证有相邻边界的分区颜色不同。他将这个发现告诉了他的弟弟弗雷德里克·古思里。弗雷德里克将他哥哥的发现作为一个猜想向老师德·摩根提出。德·摩根对此很感兴趣，当天就和爱尔兰数学家哈密顿通信，将这个问题向他

[page:266]

## 离散数学及应用（第2版）

提出。而哈密顿则与之相反，对它丝毫不感兴趣，他在3天后的回信中告诉德·摩根，他不会尝试解决这个问题。

1879年，肯普（Alfred Kempe）宣布证明了四色定理。但是在1890年，希伍德（Heawood）指出了肯普的证明存在漏洞，而且他使用肯普的方法证明了“五色定理”。

直到1976年四色定理才最终由数学家阿佩尔（Kenneth Appel）和哈肯（Wolfgang Haken）在科克（J.Koch）的帮助下证明。他们的证明方法是将地图上的无限种可能情况归纳为1936种状态，再由电脑逐个检查这些状态是否可以用4种颜色进行面着色，过程共用了一千多个小时。四色定理是第一个主要由电脑证明的理论，但这一证明并没有被所有的数学家接受，因为采用的方法不能由人工直接验证。

在证明四色定理过程中，研究者还发现了平面哈密顿图和面着色之间的一个有趣联系:哈密顿回路将平面分成若干个回路内部面和若干个回路外部面，使用颜色A和B交替将内部面着色，使用颜色C和D交替将外部面着色，得到了一个使用4种颜色的面着色（如图8.88所示）。一般地讲，每个平面哈密顿图都可以使用4种颜色进行面着色。

接下来介绍与边着色相关的一个著名问题——拉姆齐数（Ramsey's number)。

我们将证明如下结果:任意6个人中必定有3个人彼此都认识或者有3个人彼此互不相识。

用顶点来表示6个人，如果两个人相识就在代表这两个人的顶点之间画一条边并染蓝色，如果两个人不相识就在代表着两个人的顶点之间画一条边并染红色，于是得到一个6阶完全图，每条边染以红蓝两色之一（此时不要求相邻的边必须异色）。问题转化为证明无论如何对边染色，图中一定存在同色三角形。（在下文中用实线表示蓝色边，用虚线表示红色边)。

考虑任一个顶点（不妨假设它是 $\nu _ { 1 } )$ ，与之关联的边有5条，由鸽巢原理，其中必定有3条边同色，不妨假设边 $\mathcal { V } _ { 1 } \mathcal { V } _ { 2 }  、 \mathcal { V } _ { 1 } \mathcal { V } _ { 3 }  、 \mathcal { V } _ { 1 } \mathcal { V } _ { 4 }$ 同为蓝色（如图8.89(a)所示)。下面考察边$\mathcal { V } _ { 2 } \mathcal { V } _ { 3 }  、 \mathcal { V } _ { 2 } \mathcal { V } _ { 4 }  、 \mathcal { V } _ { 3 } \mathcal { V } _ { 4 }$ 。如果其中存在蓝色边，则将产生蓝色三角形（如图8.89(b)所示)；如果3条边都是红色，则将产生红色三角形（如图8.89(c)所示）

但是5个人在一起有可能达不到要求的条件，如图8.90所示，图中既不存在红色三角形又不存在蓝色三角形。

这个问题的一般形式是:给定整数s和 t，计算最小的整数n，使得任意n个人中必

[page:267]

## 第8章 图论

定有s个人彼此相识或t个人互不相识。用图论的语言讲就是:对于给定整数s和t，计算最小的整数n，使得对n阶完全图的边任意染以红色或蓝色（相邻边可以颜色相同）后，图中都一定存在红色 s 阶完全图子图或蓝色 t阶完全图子图。这时的n记作 R(s, t)，称作拉姆齐数。上述例子表明 R(3，3)=6，这个问题和结果最早是由拉姆齐（Frank PlumptonRamsey，1903—1930）于1930年在论文《形式逻辑上的一个问题》（On a Problem in Formal Logic）中提出并证明的。

但是即使对于很小的s和t值，计算R(s, t)通常也是很困难的，目前已知的拉姆齐数非常少。厄尔多斯（PaulErdös，1913—1996）曾用一个故事来描述计算拉姆齐数的难度:“如果有一支外星人军队来到地球，要求获得R(5,5)的值，否则便会毁灭地球。这时，我们应该集中全世界所有的电脑和数学家来寻找这个值。但是倘若它们要求的是R(6,6)的值，我们要做的应该是去竭力毁灭这伙外星人。”

## 8.8网络与流

图8.91(a)表示一个地区的供水管线图。图中的边表示水管，边的权重是水管的容量上限，有向边表示仅允许单向流动；图中的顶点是水管的接合点，并附有控制水流流向与流量的机器；只有一个水源—自来水厂（顶点1），只有一个最终的终点——终极用户（顶点7）。水流流动时不能超过各条管线的容量限制。

类似的问题包括:图8.91(b)表示一个地区的各条主干道，整个地区只有一个入口（顶点1）和一个出口（顶点6），有向图的边表示单行线，每条单行线都有各自的最大吞吐量(单位时间通过的车辆数)，希望计算单位时间内从此地区可以通过的最大可能车辆数。

[page:268]

## 268

定义 8.55 假设 $G { = } ( V , E )$ 是一个连通无重边且不包含自环的有向图。如果G中（1）只有一个入度为0的顶点，记之作s，称作源（sourse）。

（2）只有一个出度为0的顶点，记之作t，称作汇 $( \mathbf { s i n k } ) ,$ 0

(3）每条有向边e=(u, v)都存在一个非负的权值 $c _ { u v }$ ，称作边的容量（capacity）。则称G是一个网络（network）或流网络（flow network），也记作 $G { = } ( V , E , s , t , c )$有向边也称作弧（arc)，边 $e   =   ( u , v )$ 通常也记作 $u \nu ,$

【例8.75】图8.92展示了一个网络实例，各边容量在方形框中表示。

一些类似的问题也可以抽象成定义8.55的网络。

（a）事实上如果有重边，将所有重边的容量求和作为其中一条边的总容量并删除其他重边，可以得到等价的网络图。

(b）自环的存在与否不影响问题的分析和求解，为简洁起见要求图不存在自环。

（c）在实际应用中，有时需要考虑点的权重（例如中转站的容量上限），假设该顶点的容量为w，可以通过如图8.93所示的方式修改。

（d）有时网络N中可能有多个源和多个汇，可以通过下述方式将网络N扩大为N，将问题转化为单个源和单个汇的网络N中的最大流问题:增加两个新的顶点s和t，添加s到每个源的有向边，添加每个汇到t的有向边，并且将足够大的容量 $c _ { 0 }$ 赋予这些新加的有向边。分别称s和t为超源（super-source）和超汇（super-sink）（通常取 $c _ { 0 }$ 大于每个源发出边容量之和即可)。

【例8.76】从城市A到城市C可以直达，也可以途经城市B。在18:00到19:00晚高峰期间平均行驶时间是:A到B需要15min，B到C需要30min，A到C需要30min。而路的最大容量是:A到 B的容量是1000辆，B 到C容量是1500辆，A到C容量是2000辆。

引入一个超源和一个超汇后，可以用图8.94表示这段时间的交通容量。在图中，如果在 $t _ { 1 }$ 时刻离开城市X并在 $t _ { 2 }$ 时刻到达城市 Y，则在 $" X,t_{1} "$ 向 $" Y,t_{2} "$ 引一条边，边的权值是路的容量。

[page:269]

## 第8章 图论

定义 8.56 假设顶点 $\nu   \in   V ,$ 定义ν的前驱（predecessor）为 $\mathrm{pred}(v) = \{ u | (u, v) \in E \}$定义ν的后继（successor）为 $\operatorname { s u c c } ( v ) = \{ u | ( v , u ) \in E \}$

## 定义 8.57 若实值函数 f: E→R 满足

（1）容量限制（capacity constraint）:对所有 $e = (u, v) \in E$ ，有 $f_{uv}=f(e) \leq c_{uv}$

$$v \in V - \{ s , t \} , \sum _ { u \in \mathrm { p r e d } ( v ) } f _ { u v } = \sum _ { u \in \mathrm { s u c c } ( v ) } f _ { v u }$$

则称它是网络的一个容许流分布，或简称为一个流（flow)， $f _ { u v }$ 称作边 $( u , v )$ 上的流量。如果边 $e = ( u , v )$ 满足 $f _ { u v } = c _ { u v }$ ，则称e为饱和边。

定义8.58 对所有顶点 $v   \in   V   -   \{ s \}$ ，定义 $f(\bullet, v) = \sum_{u \in \mathrm{pred}(v)} f_{uv}$ ，称作顶点ν的总流入量；对所有顶点 $u   \in   V   -   \{ t \}$ ，定义 $f(u,\bullet)=\sum_{v\in \mathrm{succ}(u)}f_{uv}$ ，称作顶点u的总流出量。为完整性考虑，可以补充定义 $f(\bullet,s)=0,\ f(t,\bullet)=0$ 0

流量守恒表明:流在除了源和汇以外的各个顶点的总流入量等于总流出量，即既不产生也不消耗。

定义 8.59 设f是网络图G 的一个流， $f ( s , \bullet )$ 称作流f的流量或者值（value)，即源s的总流出量，记作 $f | _ { \bigcirc }$ 若G的任意一个流 $f ^ { \prime }$ 都满足 $| f |   \geqslant   | f ^ { \prime } |$ ，则称f是G的一个最大流(maximum flow)。

【例8.77】 对于图8.92的网络实例，图8.95(a)表示了一个流（例如可以理解为允

[page:270]

## 离散数学及应用（第2版）

许4辆车沿粗线所示道路通过此地区)，图8.95(b)和(c)表示另外两个不同的流。(a)、(b)、(c)所示的流的值分别是4、24、28；(c)是该网络的一个最大流。

【例8.78】一般而言，网络的最大流是不唯一的，例如图8.96所示的网络。

[page:271]

## 第8章 图论

下面描述最大流的另一种刻画。

定义 8.60 在网络 $G { = } ( V , E , s , t , c )$ 中，任何一个满足s∈S，t∈T=V-S的顶点V的划分{S, T}称作一个 s-t 割(s-t cut),简称割(cut)。一个 s-t 割的容量(capacity)定义为 $\sum _ { \substack { u \in S , v \in T \\ \left( u , v \right) \in E } } c _ { u v }$

记为 cap(S, T)。如果图 G 的 s-t 割(S, T)使得任意一个 G 的 s-t 割(S'， T’)都有 $\mathrm{cap}(S, T) \leq$ cap(S', T')，则称(S, T)是图 G 的一个最小 s-t 割，简称最小割（minimum cut)。

【例 8.79】在图 8.92 所示的网络中，图 8.97(a)、(b)、(c)表示不同的 s-t 割，容量分别是30、62、28；(c)是该网络的一个最小割。

[page:272]

## 272

【例8.80】一般而言，网络的最小 s-t割不唯一，例如图8.98所示的网络。

下面建立流与割之间的关系，首先引入一些符号的定义。

定义 8.61 在网络 G=(V， E， s, t, c)中，假设 A、B 都是 V 的非空子集。定义$f(A,B)=\sum_{u \in A,v \in B \atop (u,v) \in E} f_{uv}$ ，即从A穿出进入B的边的总流量；定义 $c(A,B)=\sum_{u \in A,v \in B \atop (u,v) \in E} c_{uv}$ ，即从A

穿出进入B的边的总容量。

定理 8.30 假设 G=(V, E, s, t, c)是一个网络，令 f是一个流，(S, T)是一个 s-t 割，则通过该割的流量等于由源s发出的流量。即 $f ( S , T ) - f ( T , S ) = | f | .$ ，特别地有 f(•, t)=f。

证明.对|S|进行归纳证明。

S={s}时明显成立。

假设定理对于|S|<k时都成立。如图8.99所示，当|S|=k时，任取 ${ \pmb v } { \in } S { - } \{ s \}$ ，令 $S ^ { \prime } = S - \{ v \}$ $T ^ { \prime } { = } T \cup \{ v \}$ ，则由|S′|=k-1可知 $f ( S ^ { \prime } , T ^ { \prime } ) - f ( T ^ { \prime } , S ^ { \prime } ) = | f |$

将顶点ν添加到S'后，

$$\begin{aligned} &f(S,\ T) – f(T,\ S)\\=&(f(S^{\prime},\ T^{\prime}) – f(S^{\prime},\ \{\nu_{\}}) – f(\{\nu_{\}},\ T)) – (f(T^{\prime},\ S^{\prime}) – f(\{\nu_{\}},\ S^{\prime}) – f(T,\ \{\nu_{\}}))\\=&f(S^{\prime},\ T^{\prime}) – f(T^{\prime},\ S^{\prime}) – ((f(\{\nu_{\}},\ T) – f(\{\nu_{\}},\ S^{\prime})) – (f(T,\ \{\nu_{\}}) – f(S^{\prime},\ \{\nu_{\}})))\\=&f(S^{\prime},\ T^{\prime}) – f(T^{\prime},\ S^{\prime}) – f(\nu_{\} 。 ) – f(\bullet,\ \nu)\\=&f(S^{\prime},\ T^{\prime}) – f(T^{\prime},\ S^{\prime}) 。 \end{aligned}$$

表明f(S, T)-f(T, S)是不变量，值必定是f。

特别地有f(•, t)=f(V−{t}, {t})-f({t}, V−{t})=f。

【例 8.81】 在图 8.92 的网络中，读者可以通过图8.100(a)~(f)验证定理 8.30，其中(a)、(c)、(e)都是同一个流的不同的 s-t割，(b)、(d)、(f)是另一个流的不同 s-t割。

[page:273]

## 第8章 图论

[page:274]

## 274

定理 8.31 设 G 是一个网络，令 f是 G 的一个流，(S, T)是 G 的一个 s-t 割，则 $| { \mathfrak { f } } | { \leqslant }$ cap(S, T)。

$$\left| f \right| = f(S,T) - f(T,S) \leq f(S,T) = \sum_{u \leq S, v \in T \atop (u,v) \in E} f_{uv} \leq \sum_{u \leq S, v \in T \atop (u,v) \in E} c_{uv} = \exp(S,T)。$$

推论 设 G 是一个网络，f是一个流，(S, T)是一个 s-t 割，则若 $|f| = \exp(S, T)$ ，则f是一个最大流且(S, T)是一个最小 s-t 割。

证明. 假设 $f _ { 1 }$ 是任意一个流，则由定理8.31有 $|f_{1}| \leqslant \mathrm{cap}(S, T) = |f|$ ，因此f是一个最大流。

假设 $( S _ { 1 } , T _ { 1 } )$ 是任意一个 s-t 割，则由定理 8.31 有 $\mathrm{cap}(S, T) = |f| \leq \mathrm{cap}(S_1, T_1)$ ，因此(S, T)是一个最小 s-t 割。

在给出最大流和最小割的更深刻联系，以及描述构造最大流和最小割的算法之前，先给出剩余图和可增广道路的概念。

定义 8.62 假设网络 $G { = } ( V , \; E , \; s , \; t , \; c )$ 中有流 $f ,$ 则可如下定义G 关于 f的剩余图(residual graph)为 $G _ { f } { = } ( V , E _ { f } , s , t , c ^ { \prime } )$

(1) $G _ { f }$ 的顶点集与G的顶点集相同。

(2) $G _ { f }$ 的边集合 $E _ { f }$ 有两类: $\{ ( u , v ) | f _ { u v } < c _ { u v } \}$ ，称为前向边（forward edge); $\{ ( u , v ) | f _ { v u } >$ 0}，称为后向边（backward edge)；即 $E_{f}=\left\{(u, v) \mid f_{uv}<c_{uv}\right\}$ 或 $f _ { w } > 0 )$

[page:275]

## 第8章 图论

（3）容量 $c_{uv}^{\prime} = \left\{ \begin{aligned} & c_{uv} - f_{uv}, &  if   f_{uv} < c_{uv}, \\ & f_{vu}, &  if   f_{vu} > 0 \end{aligned} \right.$ 0

注:不同的流f对应不同的剩余图。

【例8.82】图8.101给出了剩余图中的边和容量的构造方法:根据(a)中边的容量和边上的流量可以在剩余图中构造两条边，如(b)所示；根据(c)中边的容量和边上的流量可以在剩余图中构造一条边，如(d)所示（也可以视为构造了两条边并忽略容量为0的边）。

【例8.83】图8.102(a)的剩余图如(b)所示，(c)的剩余图如(d)所示。

[page:276]

## 276

定义 8.63 假设网络 $G     =     \left( V , E , s , t , c \right)$ 中有流f，G 关于f的剩余图中的简单 s-t 道路 P称作可增广道路（augment path），定义 bottleneck $i ( P , f )$ 为P所经过各边的最小容量。

可以由增广道路P构造G的一个新的流 $f ^ { \prime }$ .

$$f_{uv}^{\prime}=\left\{\begin{aligned}f_{uv}+ bottleneck (P, f), \quad (u, v) \quad &  是  P  中的前向边  \\ f_{uv}- bottlemeck (P, f), \quad (v, u) \quad &  是  P  中的后向边  \\ f_{uv}, \quad &  其他情况 \end{aligned}\right.$$

可以验证函数 $f ^ { \prime }$ 满足容量条件和守恒条件:

（1）满足容量条件。对于不在道路P上的边而言，不产生任何变化；如果 $( u , v )$ 是P中的前向边，则由定义8.62有 $f_{uv}^{\prime}=f_{uv}+ bottleneck(P,f) \leq f_{uv}+c_{uv}^{\prime}=f_{uv}+c_{uv}-f_{uv}=c_{uv}$ ；如果(v, u)是P中的后向边，则由定义8.62有 $f_{uv}^{\prime}=f_{uv}- bottleneck (P,f) \leq f_{uv} \leq c_{uv}.$

（2）满足守恒条件。对于不在道路P上的顶点而言，不产生任何变化；对于在P上的顶点 $v   \in   V   -   \{ s ,   t \}$ ，假设在道路P上与ν关联的边是(u, v)和 $( \nu , w )$ 0

如果(u, ν)和(v, w)都是P 中的前向边，则

$$f^{\prime}(\bullet, \nu) - f^{\prime}(\nu, \bullet) = (f(\bullet, \nu) +  bottleneck (Pf)) - (f(\nu, \bullet) +  bottleneck (Pf)) \\= f(\bullet, \nu) - f(\nu, \bullet) = 0$$

如果(u, v)和(ν, w)都是 P 中的后向边，则

$$f^{\prime}(\bullet, \nu) - f^{\prime}(\nu, \bullet) = (f(\bullet, \nu) -  bottleneck (P, f)) - (f(\nu, \bullet) -  bottleneck (P, f)) \\= f(\bullet, \nu) - f(\nu, \bullet) = 0$$

如果(u, v)是 P 中的前向边， $( \nu , w )$ 是P中的后向边，则

$$f^{\prime}(\bullet, \nu) - f^{\prime}(\nu, \bullet) = (f(\bullet, \nu) +  bottleneck (P_f) -  bottleneck (P_f)) - f(\nu, \bullet) \\= f(\bullet, \nu) - f(\nu, \bullet) = 0$$

如果(u, v)是 P 中的后向边，(ν, w)是 P中的前向边，则

$$f^{\prime}(\bullet, \nu) - f^{\prime}(\nu, \bullet) = f(\bullet, \nu) - (f^{\prime}(\nu, \bullet) +  bottleneck (Pf) -  bottleneck (Pf)) \\= f(\bullet, \nu) - f(\nu, \bullet) = 0$$

而且， $f^{\prime} = f^{\prime}(s, \bullet) = f(s, \bullet) +  bottleneck (P, f) > f(s, \bullet) = |f|$ ，即流的流量得以提升。

由此可以得到如下结论，其包含了福特和福尔克森（Ford-Fulkerson）1956年得到的可增广道路定理和最大流最小割定理（max-flow min-cut theorem)，即网络图中最大流量等于最小割容量。

定理 8.32 假设f是网络 $G     =     \left( V , E , s , t , c \right)$ 的一个流，则以下陈述等价:

(a)f是一个最大流。

（b）当前f的剩余图中不存在可增广道路。

(c）存在 G 的一个 s-t 割(S, T)使得| $f \models \mathtt { c a p } ( S , T )$ o

证明.

(a)⇒(b)。如果当前关于f的剩余图中存在可增广道路，则可以通过这条道路扩大流，与f是最大流矛盾。

(b)⇒(c)。假设f是不存在可增广道路的流。设S 是在当前剩余图中由s可达的顶点之集合，则显然 $s   \in   S$ ，且 $t \not \in S ,$ ，否则存在可增广道路，令 $T { = } V { - } S _ { \circ }$

[page:277]

## 第8章 图论

假设 $u { \in } S , \quad v { \in } T _ { \circ }$ 若 $( u , v ) { \in } E$ ，则必然有 $f _ { u v } = c _ { u v } ,$ ，否则 $( u , v )   \in   E _ { f } ,$ ν也由s可达，与S的定义矛盾；若 $\mathbf { \dot { \ell } } ( \nu , u ) \mathbf { \in } E$ ，则必然有 $f _ { w } { = } 0$ ，否则 $\scriptstyle { \left| ( u ,   v ) \in E _ { f } \right| }$ ，ν也由s可达，与S的定义矛盾。因此由定理8.30有 $| f | = f ( S , T ) - f ( T , S ) = c ( S , T ) - 0 = c a p ( S , T )$ 0

(c)⇒(a)由定理8.31 的推论即得。

定理 $8.32\  " ( b ) \text{\Rightarrow}( c )  "$ 部分的证明也给出了由最大流构造最小割的方法。

【例 8.84】 对于图 8.92 的网络实例，图 8.95(c)是一个最大流，图 8.97(c)是对应于该最大流的一个最小割。

由定理8.32(a)和(b)的等价性可以给出最大流的构造算法——福特-福尔克森最大流算法（Ford-Fulkerson，1956年）:

## 最大流算法 Ford-Fulkerson (G)

输入:网络 $G     =     \left( V , E , s , t , c \right)$

输出:G的一个最大流f

1 初始流量选为0流量，即对所有边 $u v , \quad f _ { u v } { \leftarrow } 0$ 0

2 构造G关于f的剩余图 $G _ { \mathcal { F } ^ { \circ } }$

3若 $G _ { \mathcal { E } }$ 中存在增广道路P，则按照前述方法由增广道路P构造G的一个新的流f'，

$f { \leftarrow } f ^ { \prime }$ ，转到步骤2；否则输出f。

【例8.85】对于图8.103(a)中的网络，福特-福尔克森最大流算法的执行过程如(a)~(1)所示，而对应的最小割见(m)。

[page:278]

## 离散数学及应用（第2版）

[page:279]

## 第8章 图论

如果各边的容量都是整数，则每次 $f   \leftarrow   f ^ { \prime }$ 的更新都使得流的值至少增加1，因此算法至多在 $\sum _ { v \in \operatorname { s u c c } ( s ) } c _ { s v }$ 次结束；如果各边的容量都是一般实数，那么该算法有可能永远运行下去而无法终止。

【例8.86】考虑如图8.104所示的网络，s是源，t是汇，边 $e _ { 1 }  、  e _ { 2 }$ 和 $e _ { 3 }$ 的容量分别是1、 $r   =   \left( { \sqrt { 5 } } - 1 \right) \big / 2$ (r满足 $r ^ { 2 } { = } 1 { - } r )$ 和1，其他边的容量都是整数 $M{\geqslant}2$ 。记道路 $p _ { 1 } { = } s$ $v_{4},v_{3},v_{2},v_{1},t,p_{2}=s,v_{2},v_{3},v_{4},t$ 和 $p_{3}=s,v_{1},v_{2},v_{3},t$

考虑按如表8.2所示的次序执行福特-福尔克森最大流算法的前几次循环。

[page:280]

## 离散数学及应用（第2版）

表8.2 不终止的福特-福尔克森算法实例<table><tr><td rowspan=2>循环次数</td><td rowspan=2>可增广道路</td><td rowspan=2>增加的流量值</td><td colspan=3>边容量的剩余值</td></tr><tr><td><eq>e _ { 1 }</eq></td><td><eq>e _ { 2 }</eq></td><td><eq>e _ { 3 }</eq></td></tr><tr><td>0</td><td></td><td></td><td><eq>r ^ { 0 } { = } 1</eq></td><td><eq>r</eq></td><td>1</td></tr><tr><td>1</td><td><eq>\{ s , \nu _ { 2 } , \nu _ { 3 } , t \}</eq></td><td>1</td><td><eq>r ^ { 0 }</eq></td><td><eq>r ^ { 1 }</eq></td><td>0</td></tr><tr><td>2</td><td><eq>p _ { 1 }</eq></td><td><eq>r ^ { 1 }</eq></td><td><eq>r ^ { 2 }</eq></td><td><eq>0</eq></td><td><eq>r ^ { 1 }</eq></td></tr><tr><td>3</td><td><eq>p _ { 2 }</eq></td><td><eq>r ^ { 1 }</eq></td><td><eq>r ^ { 2 }</eq></td><td><eq>r ^ { 1 }</eq></td><td>0</td></tr><tr><td>4</td><td><eq>p _ { 1 }</eq></td><td><eq>r ^ { 2 }</eq></td><td><eq>0</eq></td><td><eq>r ^ { 3 }</eq></td><td><eq>r ^ { 2 }</eq></td></tr><tr><td>5</td><td><eq>p _ { 3 }</eq></td><td><eq>r ^ { 2 }</eq></td><td><eq>r ^ { 2 }</eq></td><td><eq>r ^ { 3 }</eq></td><td>0</td></tr></table>

注意到第1次循环到第5 次循环边 $e _ { 1 }$ 、 $e _ { 2 }$ 和 $e _ { 3 }$ 的剩余容量都是 $\{ r ^ { n } ,$ $r ^ { n + 1 }$ ,0}的形式，其中n是非负整数。可以证明，不断使用可增广道路 $p_{1} 、 p_{2} 、 p_{3}$ 增加流量， $e _ { 1 }$ $e _ { 2 }$ 和 $e _ { 3 }$的剩余容量都还是这种形式，而且总流量的极限是 $1 + 2 \sum _ { i = 1 } ^ { \infty } r ^ { i } = 3 + 2 r$ (前5次循环的总流量为 $1 + 2 r + 2 r ^ { 2 }$ o

然而很明显该网络的最大流是2M+1≥5>3+2r，即福特-福尔克森最大流算法不会终止，也无法达到最大流。

最后介绍一些网络最大流的应用。

可以将二部图的匹配问题化为网络流图:

（1）将原图的所有无向边改为有向边，由X中顶点指向Y中顶点。

（2）添加一个超源顶点s和一个超汇顶点 $t _ { \circ }$

（3）添加s到X中每个顶点的有向边，添加Y中每个顶点到t的有向边。

（4）所有有向边的容量都设置为1。

所得的图称作匹配网络（matching nerwork)。则有以下定理。

定理8.33（a）可以由匹配网络的一个流给出G的一个匹配，其中顶点 $x { \in } X$ 和 $y   \in   Y$相匹配当且仅当边 $\mathbf { \ell } ( x , y )$ 上的流量是1。

（b）一个最大匹配对应于一个最大流。

（c）一个值为|的流对应于一个使X中每个顶点饱和的匹配。

证明留作习题。

应用匹配网络和最大流最小割定理可以给出霍尔定理的另一个证明:

[page:281]

## 第8章 图论

（必要性）从“流量”的角度来看，明显有 $| N _ { G } ( S ) | \geqslant | S |$

（充分性）考虑G的匹配网络图 $G _ { 1 }$ 的任一个割(S, T)。边集合 $E _ { 1 } { = } \{ ( u , \nu ) | u { \in } S , \nu { \in } T \}$中的元素是以下3种类型之一（如图8.105所示）:

类型 $\mathrm{I} \longrightarrow (s,x), x \in X$

类型Ⅱ $(x,y),\ x \in X,\ y \in Y$

类型Ⅲ——(y, t)， y∈Y。

记 $n { = } | X |$ 。若 $X { \subseteq } T ,$ ，则 $\mathrm{cap}(S, T) \geqslant \sum_{x \in X} c(s, x)$ 至少为n。

若 $X _ { 1 } { = } X \cap S$ 非空，则 $E _ { 1 }$ 中有 $n { - } | X _ { 1 }$ 条类型Ⅰ的边。记 $Y _ { 1 } = N _ { G } ( X _ { 1 } ) \cap S , \quad Y _ { 2 } = N _ { G } ( X _ { 1 } ) \cap T .$则 $E _ { 1 }$ 中至少有 $| Y _ { 1 } |$ 条类型Ⅲ的边 $\left( \left| \left\{ (y,t)|y \in Y_1 \right\} \right| \right)$ 。而另一方面，由 $| X _ { 1 } | \leqslant | N _ { G } ( X _ { 1 } ) | = | Y _ { 1 } | + | Y _ { 2 } |$表明 $E _ { 1 }$ 中类型Ⅱ的边数至少是 $| Y _ { 2 } | \geqslant | X _ { 1 } | - | Y _ { 1 } |$

于是 $\mathrm{cap}(S, T) = |$ 类型Ⅰ的边|+|类型Ⅱ的边|+|类型Ⅲ的边 $\geqslant n - \left| X_{1} \right| + \left| X_{1} \right| - \left| Y_{1} \right| + \left| Y_{1} \right| = n.$

因此任意一个割的容量都至少为 n，而割({s}，X∪ Y∪{t})的容量恰好为 n，因此 $G _ { 1 }$的最小割的容量为n。而这就表示 $G _ { 1 }$ 最大流的值是 n，即存在使X 中每个结点饱和的匹配。 口

舞伴问题（dancing problem，k-正则二部图的完美匹配):一次舞会有n个男孩和 n个女孩，每个男孩恰好认识k个女孩，每个女孩也恰好认识k个男孩 $(1 \leqslant k \leqslant n)$ ，是否可以安排得当，使得每人的舞伴都是自己认识的（即是否存在k-正则二部图的完美匹配）？

建立一个匹配网络，并考虑如下定义的流: $f(s, x_i) = 1, f(y_j, t) = 1, f(x_i, y_j) = 1/k,$ ，其中$1 \leqslant i, j \leqslant n, x_i \in X, y_j \in Y$ (例如图8.106)，可以证明它是一个值为n的最大流。这就证明了完美匹配的存在性。

下面讨论一个与有向图中道路和连通性有关的结果。

定义 8.64 设 $G { = } ( V , E )$ 是一个有向连通图，s和t是图中两个给定的不同顶点。在图中从顶点s到顶点 t 的没有公共边的初级道路称为边不相交的道路（edge-disjoint path)。如果 $E { \subseteq } E ,$ ，且满足每条从s到t 的初级道路都必然包含E'中的边，则称E'是G的 st-分离集(st-disconnectigng set)。

[page:282]

## 282

由于要求找到从s到t的初级道路，因此可以忽略指向s的有向边和由t发出的有向边、忽略不是s或t但入度为0或出度为0的顶点，故而可以假定图中只有一个入度为0的顶点s，只有一个出度为0的顶点t，并给每条有向边都赋以权值1，于是形成一个网络。

容易看出，其中最大流的值就是s到t的边不相交道路的最大数目，而最小割的容量则是st-分离集的最少有向边数（参看图8.107)。由最大流最小割定理即得到门格定理(Menger，1927年)。

定理 8.34 有向图D 中从顶点s 到顶点 t 的边不相交有向道路的最大数目等于 st-分离集的最小有向边数。

## 习题8

8.1 已知无向图 G 如图 8.108 所示。

（a）求顶点数和边数。

(b）写出各顶点的度数，并验证握手定理及其推论。

（c）指出图G中的重边、环、孤立顶点、悬挂顶点、悬挂边。

(d）要使图G成为简单图，至少需要删去几条边？

8.2 已知有向图G 如图8.109所示。

（a）求顶点数和边数。

（b）写出各顶点的出度、入度和度数，并验证握手定理。

8.3 设图G 有n 个顶点和 n+1 条边，证明:G 中至少有一个顶点度数大于或等于 3。

[page:283]

## 第8章 图论

8.4 设 n 阶图 G有 m 条边，证明: $\delta ( G ) \leqslant \frac { 2 m } { n } \leqslant \Delta ( G )$ 0

8.5 确定下面的序列中哪些构成图的度数序列？若是图的度数序列，请画出一个对应的图。(a)6, 5, 4, 3, 2, 1. (b)6,5,4,3,2,2. (c)5, 5, 4, 3, 2, 1。

8.6 证明:不存在7阶无向简单图以1,3,3,4,6,6,7为度数序列。

8.7 7阶无向图G中有1个2度顶点、3个3度顶点、2个4度顶点、1个5度顶点，求G的边数。

8.8 具有13条边的无向图G中有3个2度顶点、2个3度顶点、1个4度顶点和若干个5度顶点，求G的阶数。

8.9 无向图G的边数为16，G有3个4度顶点、4个3度顶点、其余顶点度数均小于3，求G至少有多少个顶点。

8.10 已知无向图 G 中顶点数 n 与边数 m 相等，2度与 3 度顶点各 2 个，其余顶点均为悬挂顶点，求G的边数。

8.11 已知无向图G中边数m=10，有3个2度顶点和2个4度顶点，其余顶点均为奇数度顶点，试讨论奇数度顶点的个数及度数分配情况。

8.12 有n个人，每个人恰好有3个朋友，证明:n是偶数。

8.13 证明:任意 $n (n \geqslant 2)$ 个人之中，不认识另外奇数个人的人数为偶数。

8.14 9阶无向图 G 中顶点度数不是5 就是6，证明:G 中至少有 5 个 6 度顶点或者至少有6个5度顶点。

8.15 假设(n, m)-图 G 中，每个顶点的度数不是 k就是 k+1，且 G 中有 N个 k 度顶点，有N+1个k+1度顶点，试用n、m、k表示N的值。

8.16 证明:如果简单图G的所有顶点度数都大于2，则G的边数不可能是7。

8.17 证明:简单图中存在度相同的顶点。

8.18 n阶 k度正则图中有多少条边？

8.19 将有向图G的边的方向去掉得到的无向图称作G的基图，基图是完全图的有向图称作竞赛图。证明:竞赛图中所有顶点的入度平方之和等于所有顶点的出度平方之和。

（提示:利用 $\left( \deg^{-}(v) \right)^{2} = \left( n - 1 - \deg^{+}(v) \right)^{2}$

8.20 判断图8.110中的各图是否是二部图。

[page:284]

## 284

8.21 画出完全二部图 $K _ { 3 ,   \angle }$ 40

8.22 完全二部图 $K _ { r , \cdot }$ 中有多少条边?

8.23 n满足什么条件时，完全图 $K _ { n }$ 是二部图？

8.24 由完全二部图 $K_{r,s} (r \geqslant 1, s \geqslant 1)$ 产生完全图 $K_{n} (n = r + s)$ 需要增加多少条边？

8.25 设G是(n，m)-简单二部图，证明: $m   \leqslant   \frac { n ^ { 2 } } { 4 }$ 0

8.26 在一次舞会中，A、B两国学生各有 $n ( n > 2 )$ 人参加，A国内每个学生都与B国一些（不是所有）学生跳过舞，B国每个学生至少和A国一个学生跳过舞。证明:一定可以找到A国的两个学生 a和 b 及 B 国两个学生 x和y，使得 a和 x，b 和y跳过舞，而a和y，b和x没有跳过舞。(提示:记与B国学生x跳过舞的A国学生集合为 S(x)，则如果结论不成立，所有S(x)形成包含关系的“链”，将与“A国内每个学生都不与B国所有学生跳过舞’产生矛盾。)

8.27 某次会议有 n 名 $(n \geqslant 4)$ 代表出席，已知任意的4名代表中都有1个人与其余的3个人握过手。证明:任意的4名代表中必有一个人与其余的n-1名代表都握过手。（提示:等价于证明没有与其余的n-1名代表都握过手的代表不超过3人。)

8.28 设 G 是 n阶简单图。G 的带宽是指 $\max\{|i - j| \mid a_i$ 与 是相邻的}在G的顶点的所有 $a _ { j }$排列 $a _ { 1 } , a _ { 2 } , \cdots , a _ { n }$ 上所取的最小值，即带宽是赋给相邻顶点的下标的最大差值在顶点标号的所有置换中所可能取得的最小值。求以下各图的带宽:完全图 $K _ { 5 }$ 、完全二部图 $K _ { 2 , 3 }$ 、完全二部图 $K _ { 3 , 3 1 }$ 、立方体图 $B _ { 3 }$ 、圈图 $C _ { 5 }$ 、轮图 $W _ { 4 }$

8.29 令G 是一个图。假设对于 G 中的每对不同的顶点 $\nu _ { 1 }$ 和 $\nu _ { 2 }$ ，G 中存在唯一顶点 w，使得: $\nu _ { 1 }$ 和 w是相邻的， $\nu _ { 2 }$ 和 w是相邻的。

（a）证明:如果ν和u是G中不相邻的顶点，那么 $\deg(v) = \deg(u)$

(提示:建立与u相邻的顶点和与ν相邻的顶点之间的一一对应。)

(b）证明:如果存在一个度为k>1的顶点，且没有顶点与所有其他顶点相邻，那么每个顶点的度都为 $k _ { \mathrm { c } }$

（提示:证明如果u与ν相邻且均不与其他所有顶点相邻，则 $\deg(v) = \deg(u)$

8.30有 $2 n ( n \geq 1 )$ 个空间点，试证明:用 $n ^ { 2 } { + } 1$ 条线段任意连接这2n个点形成一个简单图，其中必然出现一个三角形。并证明用 $n ^ { 2 }$ 条边连接，则可能不出现三角形。

8.31 求图8.111的所有3阶子图、4阶导出子图和支撑子图。

8.32 证明:完全图的导出子图也是完全图。

8.33 在完全图 $K_{n} (n \geqslant 2)$ 中，寻找边数最多的生成子图，使得其成为完全二部图$K_{r,s} (n = r + s)$ 0

[page:285]

## 第8章 图论

8.34 判断图8.112 中的两图是否同构。

8.35 判断图8.113 中的两图是否同构。

8.36 判断图8.114 中的两图是否同构。

8.37 判断图8.115 中的两图是否同构。

8.38 画出所有不同构的(5,3)-简单图。

8.39 画出所有不同构的(5,4)-简单图。

8.40 有多少个不同构的5阶简单正则图？

8.41 有多少个不同构的6阶简单正则图？

8.42 已知 3 度正则图 G 的阶数 n 与边数 m 满足 $m = 2n - 3$ ，证明:G只有两种非同构的情况。

8.43 求图8.116 中的各图的补图。

8.44画出 $K _ { 4 }$ 的所有不同构的子图和生成子图，指出哪些是自补图。

8.45 给出一个5阶自补图的例子。

8.46 假设 G 是 $n (n \geqslant 2)$ 阶k-正则图，证明: $\bar { G }$ 也是正则图。

8.47 假设 n 阶简单图 G 有 m 条边，G 的补图 $\bar { G }$ 有多少条边？

8.48 假设G是n阶自补图，计算G的边数。

8.49 假设G是 n阶自补图，证明:或者 n是4的倍数，或者 n模4余1。

[page:286]

## 286

8.50 假设 G 是 n 阶简单图，试用 δ(G)和 Δ(G)表示 $\delta { \left( { \overline { { G } } } \right) }$ 和 $\mathcal { A } \big ( \overline { { G } } \big )$

8.51设 $G _ { 1 }$ 与 $G _ { 2 }$ 均为无向简单图，证明: $G _ { 1 }$ 与 $G _ { 2 }$ 同构当且仅当 $\overline { { G _ { 1 } } }$ 与 $\overline { { G _ { 2 } } }$ 同构。

8.52 已知无向图 G 如图 8.117 所示，求 $\nu _ { 1 }$ 到 $\nu _ { 3 }$ 的所有简单道路、初级道路，求 $\nu _ { 1 }$ 到 $\nu _ { 1 }$的所有简单回路、初级回路。

8.53 已知无向图G如图8.118所示，指出图中所有的桥。

8.54 证明定理 8.6。

8.55 证明:如果边e是桥，则G-e恰有两个连通分支。

8.56 证明:在 n阶图 G 中，若从顶点 u到 ν(u≠v)存在道路，则

（a）u到ν一定存在长度小于或等于 n-1 的道路。

（b）u到ν一定存在长度小于或等于n-1的初级道路。

8.57 证明:在n阶图G中，若存在ν到自身的回路，则

（a）一定存在ν到自身长度小于或等于n的回路。

(b）一定存在ν到自身长度小于或等于n的初级回路。

8.58 证明:若无向图G中恰有两个奇数度的顶点，则这两个顶点之间必然存在一条通路。

8.59 令 m 和 n 是正整数，满足 $1 \leqslant m \leqslant 2^{n}$ 。证明:n立方体图中存在一个长度为m的简单回路当且仅当m≥4且m为偶数。

8.60 n阶非连通简单图至多有多少条边？至少有多少条边?

8.61假设 $G _ { 1 }$ 和 $G _ { 2 }$ 是两个简单图，如果有 $G _ { 1 }$ 的某个特性，且 $G _ { 1 }$ 与 $G _ { 2 }$ 同构，则 $G _ { 2 }$ 也具有该特性。这样的特性称为不变量（invariant)。证明以下特性是不变量（其中k是一个正整数):

（a）有一个度为k的顶点。

（b）含有n个度为k的顶点。

（c）图是连通的。

（d）有一个长度为k的简单回路。

（e）有n个长度为k的简单回路。

8.62 假设无向连通图G中存在初级回路，证明:删除该回路中任何一边后，图仍然是连通的。

8.63 假设 n阶简单图 G 中每个顶点的度数都大于 $n / 2$ ，证明:G是连通图。

8.64 如果无向图G中，既存在顶点u到顶点ν的长度为奇数的道路，又存在顶点u到顶点ν的长度为偶数的道路，证明:图G中存在简单回路。

[page:287]

## 第8章 图论

8.65 如果无向图G中，存在顶点u到顶点ν的两条不同的简单道路，证明:图G中存在简单回路。

8.66 假设 G 为 n阶无向连通图，证明:

（a）至少有n-1条边。（提示:使用归纳法。）

(b）若边数大于n-1，则至少有一条回路。（提示:使用归纳法及定理8.5。）

（c）如果恰好有n-1条边，则至少有一个顶点的度数为奇数。

8.67 设G 是 $n (n \geqslant 5)$ 阶简单图，证明:G或 $\bar { G }$ 必定存在回路。

8.68 设(n, m)-简单图 G 满足 $m > \frac{1}{2}(n - 1)(n - 2)$ O

（a）证明:G是连通图。

（b）构造一个 $m = \frac{1}{2}(n - 1)(n - 2)$ 的非连通简单图。

8.69 n个城市由k条公路连接（公路两端为城市，中间不通过其他任何城市，两个不同城市之间最多有一条公路)，证明:若 $k \geq ( n - 1 ) ( n - 2 ) / 2$ ，则总可以通过连接城市的公路在任何两个城市之间旅行。

8.70 令 G 是一个 k 正则 n 阶简单图，其中

$$k \geqslant \frac{n - 3}{2}, n \bmod 4 = 1$$

$$k \geqslant \frac{n - 1}{2}, n \bmod 4 \neq 1$$

证明:G是连通的。

8.71 证明:简单图G是二部图当且仅当图中不存在回路或所有回路的长度都是偶数。

8.72 证明:无向图 $G   =   ( V , E   ,   \gamma )$ 不是连通图当且仅当存在V的一个划分 $\{ V _ { 1 } ,   V _ { 2 } \}$ ，使得G中任何边都不会以 $V _ { 1 }$ 中的一个顶点和 $V _ { 2 }$ 中的一个顶点作为两端。

8.73 证明:在图 8.119 中从 u 到ν的长度为 n的道路的数目等于 n阶斐波那契数 $f _ { n } ,$

8.74 称无向连通图G中的顶点ν为割点，是指如果将顶点ν和所有与ν关联的边删除，会使得图G变为非连通图。

（a）给出一个6阶图的例子，其中恰好有两个割点。

（b）给出一个6阶图的例子，其中没有割点。

（c）证明:连通图G中的顶点ν为割点当且仅当G中存在两个顶点x和 $y ,$ ，使得从 x到y的每条道路都经过 $\nu _ { \circ }$

8.75 连通简单图的两个不同顶点 $\nu _ { 1 }$ 和 $\nu _ { 2 }$ 之间的距离是在 $\nu _ { 1 }$ 和 $\nu _ { 2 }$ 之间的最短简单道路的长度（边数）。图的半径是从顶点ν到其他顶点的最大距离在所有顶点ν上所取的最小值。图的直径是在两个不同顶点之间的最大距离。

（a）直径是否一定是半径的2倍？

[page:288]

## 离散数学及应用（第2版）

（b）直径是否一定大于半径？

（c）求下列图的半径和直径: $K_{6} 、 K_{4,\;5}.$ 、超立方体图 $B_{3} 、 C_{6} 。$

(d）证明:若简单图G的直径至少为4，则它的补图 $\bar { G }$ 的直径不超过2。

(提示:考虑两个点 a和 b 在 $\bar { G }$ 中的距离，如果不是1，则a和b在G中相邻，继而证明在 $\bar { G }$ 中有a到 b长度为2的道路。)

(e）证明:若简单图G的直径至少为3，则它的补图 $\bar { G }$ 的直径不超过3。

8.76 举例说明有向图中顶点之间的可达关系既无对称性也无反对称性。

8.77 判断图8.120中的各有向图是否连通，是否是单向连通的，是否是强连通的。

8.78 寻找3 个 5 阶有向图 $G_{1} 、 G_{2} 、 G_{3}$ ，满足: $G _ { 1 }$是强连通的， $G _ { 2 }$ 是单向连通的但不是强连通的， $G _ { 3 }$ 是有向连通的但不是单向连通的。

8.79 证明:在一个没有回路的竞赛图中，对于任意顶点u和v，有 $\deg^{+}(u) \neq \deg^{+}(v)$ 0

8.80 设有向图D是单向连通图，证明:D中存在经过每个顶点至少一次的道路。

8.81 设有向图D是单向连通图，但不是强连通图，问在D中至少加几条边可以得到强连通图？

8.82 证明:一个简单有向图是强连通的当且仅当图中有一条包含每个顶点的回路。

8.83 证明:在一个DAG 中至少存在一个顶点出度为 $0 ,$

8.84 证明:在一个 n阶 DAG 中边的最大数目是 $n ( n { - } 1 ) / 2$

8.85 假设有向图如图8.121 所示。

（a）写出图的邻接矩阵。

（b）利用邻接矩阵计算各个顶点的出度和入度。

(c）计算 $\nu _ { 1 }$ 到 $\nu _ { 4 }$ 的长度为3的不同道路数。

（d）计算 $\nu _ { 1 }$ 到 $\nu _ { 4 }$ 的长度不超过3的不同道路数。

8.86 假设无向图如图8.122所示。

（a）写出图的邻接矩阵。

（b）利用邻接矩阵计算各个顶点的度数。

(c）计算 $\nu _ { 1 }$ 到 $\nu _ { 3 }$ 的长度为4的不同道路数。

（d）计算 $\nu _ { 4 }$ 到 $\nu _ { 4 }$ 长度不超过3的不同回路数。

[page:289]

## 第8章 图论

8.87 令A 是图 $K _ { m , n }$ 的邻接矩阵。给出A中元素的表示公式。

8.88 在完全图 $K_{n} (n > 2)$ 中，

（a）有多少长度 $k { \geqslant } 1$ 的道路？

（b）有多少条长度在1和k（包括k）之间的道路？

8.89 令ν和w 是 $K _ { n }$ 中的两个不同的顶点。令 $p _ { m }$ 代表 $K _ { n }$ 中从ν到w的长度为 m的道路的数目， $1 \leqslant m \leqslant n$

（a）寻找 $p _ { m }$ 的递归关系。

(b）给出 $p _ { m }$ 的显示公式。

8.90 令ν和w 是 $K_{n} (n \geqslant 2)$ 中的两个不同的顶点，证明:从ν到w的简单道路的数目是 $(n - 2)! \sum_{k = 0}^{n - 2} \frac{1}{k!}$ o

8.91 判断图8.123中的各图是否存在欧拉道路，是否存在欧拉回路。

8.92 画一个无向欧拉图，使得它满足以下条件:

（a）有偶数个顶点和偶数条边。

（b）有奇数个顶点和偶数条边。

（c）有偶数个顶点和奇数条边。

（d）有奇数个顶点和奇数条边。

8.93 设G是n（n≥2）阶欧拉图，证明:图G中不存在桥。

8.94 n 满足什么条件时，完全图 $K _ { n }$ 是欧拉图？

8.95 r, s 满足什么条件时，二部图 $K _ { r , s }$ 是欧拉图？

8.96 构造图8.124 中各图的欧拉回路。

8.97 判断图8.125中的各有向图是否存在欧拉道路，是否存在欧拉回路。

[page:290]

## 离散数学及应用（第2版）

8.98 画一个有向欧拉图，使得它满足以下条件:

（a）有偶数个顶点和偶数条边。

（b）有奇数个顶点和偶数条边。

（c）有偶数个顶点和奇数条边。

（d）有奇数个顶点和奇数条边。

8.99 证明:若连通有向图G是欧拉图，则它一定是强连通的。其逆命题成立吗？8.100 判断图8.126中的各图是否存在哈密顿道路，是否存在哈密顿回路。

8.101 说明图8.127 中的图不是哈密顿图。

8.102 证明:彼得森图不是哈密顿图。

8.103 画一个无向哈密顿图，使得它满足以下条件:

（a）有偶数个顶点和偶数条边。

（b）有奇数个顶点和偶数条边。

（c）有偶数个顶点和奇数条边。

（d）有奇数个顶点和奇数条边。

8.104 画出一个图，使其满足以下条件:

（a）具有欧拉回路和哈密顿回路。

（b）具有欧拉回路，但不具有哈密顿回路。

（c）不具有欧拉回路，但具有哈密顿回路。

（d）既不具有欧拉回路，也不具有哈密顿回路。

8.105 如果简单无向连通(n, m)-图 G 的边数满足 $m = (n^{2} - 3n + 4)/2$ ，G是否一定是哈密顿图？说明理由。

8.106一只蚂蚁可否从立方体的一个顶点出发，沿着棱爬行过每一个顶点一次且仅一次，最后回到出发点？利用图作解释。

[page:291]

## 第8章 图论

8.107 对一个3×3×3的立方体，能否从一个角上开始，通过所有27个1×1×1的小立体方块各一次，最后达到中心？试说明理由。

8.108一个班的学生共计选修A、B、C、D、E、F共6门课程，其中一部分人同时选修了D、C、A，一部分人同时选修了B、C、F，一部分人同时选修了E和B，还有一部分人同时选修了A和B。期终考试要求每天考一门课，6天内考完，而且为了减轻学生负担，要求每人都不会连续两天参加考试。试设计一个考试日程表。

8.109 10个人围坐于一个圆桌旁，每个人都至少和其余的5个人是朋友，请问能否安排座位使得每个人左右两边都是他的朋友？

8.110 某工厂生产6种不同颜色的纱制成的双色布，已知在生产的品种中，每种颜色至少和其他5种颜色中的3种颜色搭配，证明:可以挑出3种双色布，它们恰有6种不同的颜色。

8.111 r 和 s满足什么条件时，二部图 $K _ { r , s }$ 是哈密顿图？

8.112 完全图 $K_{n} (n \geqslant 3)$ 共有多少条不同的哈密顿回路？

8.113 设G 是 $n (n \geqslant 2)$ 阶哈密顿图，证明:图G中不存在桥。

8.114 当 m 和 n 取何值时图 8.128 是欧拉图？当 m 和 n 取何值时图 8.128 是哈密顿图？

8.115 修改习题 8.114 中的图 8.128，对所有 i=1,2, …, n，在第i行第 1列顶点和第i行第m列顶点之间都添加一条边。证明:得到的图是哈密顿图。

8.116证明:

（a）3×3的棋盘上不存在骑士巡游回路。

（b）4×3的棋盘上不存在骑士巡游回路。

（c）4×4的棋盘上不存在骑士巡游回路。

（提示:称顶上的和底下的8个格子为外格子，称其他8个格子为内格子。骑士必须从一个外格子移动到一个内格子，或者从一个内格子移动到一个外格子。此外，骑士必须从一个白格子移动到一个黑格子，或者从一个黑格子移动到一个白格子。)

8.117 证明:任何竞赛图中一定存在哈密顿道路。

8.118 证明:任何强连通的竞赛图必定是哈密顿图。

8.119 设n为正整数，证明:

[page:292]

## 292

(a) $K _ { 2 n }$ 的边集合是边不相交的m个哈密顿道路的边集的并，并计算m的值。（提示:考虑图8.129或图8.130）

(b) $K _ { 2 n + 1 }$ 的边集合是边不相交的m个哈密顿回路的边集的并，并计算m的值。8.120 2n+1个人围圆桌开会，每次开会时每人的邻座都与以前不同，问最多可以安排多少次这种会议？

8.121若无向图中每一条边都能定一个方向，使得到的有向图是强连通图，则称该图为可定向的。证明:

（a）判断图8.131 中的图是否可定向。

（b）证明:欧拉图是可定向的。

（c）证明:哈密顿图是可定向的。

（d）证明:若一个连通图具有桥，则它不是可定向的。

(e）证明:连通图是可定向的当且仅当图的每一条边至少在一条回路上。

（f）因为城市中心区交通流量正在增长，所以交通工程师计划将目前所有双行街道都变成单行街道。解释如何为这个问题建模。

8.122证明: $n   \geq   3$ 时，轮图 $W _ { n }$ 具有如下性质:

(a) $W _ { n }$ 中简单回路的数目是 $n ^ { 2 } – n { + } 1$ 0

[page:293]

## 第8章 图论

(b) $W _ { n }$ 不是欧拉图。

(c) $W _ { n }$ 是哈密顿图。

8.123 图8.132 中的各图是否是平面图?

8.124 证明定理8.13。

8.125 计算图8.133中的各图的顶点数、边数、面数、每个面的次数，并验证定理8.13和定理8.14。

8.126 已知 8阶连通平面图 G 有 5 个面，求 G 的边数 $m ,$

8.127 已知具有4个连通分支的平面图G有8个面和15 条边，求G的阶数。

8.128 假设简单连通平面图 G 的顶点数 $n { = } 6$ 且 $m { = } 1 2$ ，求G的面数和每个面的次数。

8.129 设简单连通图G有15个顶点，其中 7个顶点的度是4，6个顶点的度是6，2个顶点的度是8，证明:G是非平面图。

8.130 证明:任何有31 条边和12个顶点的简单连通图都不是平面图。

8.131 假设简单连通平面(n, m)-图 G 的阶数大于2，证明:G 的面数 $f \leqslant 2 n - 4$

8.132 证明:边数 $m \leq 3 0$ 的简单连通平面图G必定存在顶点ν满足 $\deg ( v ) \leqslant 4$

8.133 证明:不存在非连通的7阶15条边的简单平面图。

8.134 设G 是阶数不小于11 的简单图，证明:G和 $\bar { G }$ 至少有一个是非平面图。

8.135证明: $n { \leqslant } 3$ 时，n-立方体图是平面图； $n { > } 3$ 时，n-立方体图不是平面图。

8.136 r 和 s 满足什么条件时，二部图 $K _ { r , : }$ s是平面图？

8.137 n满足什么条件时，完全图 $K _ { n }$ 是平面图？

8.138 设 G 是一个 3-正则的简单连通平面图，令 $\phi _ { k }$ 表示由k条边围成的面的数目。证明:

$\sum_{k = 3}^{\infty}(6 - k)\phi_{k} = 12$ 0

8.139 设G 是一个n阶无环的连通平面图，假设G含有哈密顿回路C，证明:

$$\sum_{i = 1}^{n} (i - 2)(f_{i}^{(1)} - f_{i}^{(2)}) = 0$$

[page:294]

## 294

其中 $f _ { i } ^ { ( 1 ) }$ 和 $\mathbb { I } f _ { i } ^ { ( 2 ) }$ 分别是含在C 内部和外部的度数为i的面的数目。

8.140 证明图8.134中的各图是非平面图。

8.141 画出图8.135 中的各图的对偶图，并验证定理8.18。

8.142 已知平面图 G 的阶数 $n { = } 8$ ，边数 $m { = } 8$ ，面数f4，连通分支数 $k { = } 3$ ，求G的对偶图的阶数、边数、面数。

8.143设 $G ^ { * }$ 是具有 $k ( k \geqslant 2 )$ 个连通分支的平面图 G 的对偶图，已知 G 的边数 $m { = } 1 0$面数f=3，求 $G ^ { * }$ 的面数 $f ^ { * }$ o

8.144 给出平面图 G 的对偶图 $G ^ { * }$ 是欧拉图的充要条件。

8.145 假设平面图G有f个面，而且每两个面的边界都恰好共享一条公共边，求f的最大值。

8.146 假设 $\mathbf { \nabla } ( n , m ) .$ -图G是简单平面图，每个顶点的度数都大于2。

（a）证明:若面数f<12，则G必存在一个次数至多为4的面。

（b）举例说明，若12，则（a）中结论不成立。

8.147 举例说明“平面图G如果有度数为1的顶点，则对偶图 $G ^ { * }$ 含有自环；平面图 $G$如果有度数为2的顶点，则对偶图 $G ^ { * }$ 含有重边”的逆命题不真。

8.148 举例说明同构的两个图的对偶图不一定同构。

(提示:

8.149 如果平面图 G 和它的对偶图是同构的，称 G 是自偶图。证明:若(n, m)-图 G 是自偶的，则m=2n-2；并构造一个自偶图。

8.150 验证轮图 $W _ { 4 }$ 和 $W _ { 5 }$ 是自偶图。

8.151 求8阶自对偶平面图的边数和面数。

8.152 假设无向图如图8.136所示。

（a）找到图中的所有支配集、极小支配集、最小支配集，求图的支配数。

[page:295]

## 第8章 图论

（b）找到图中的所有独立集、极大独立集、最大独立集，求图的独立数。

(c）找到图中的所有点覆盖集、极小点覆盖集、最小点覆盖集，求图的点覆盖数。8.153 已知二部图如图8.137所示。

（a）找到图中的所有支配集、极小支配集、最小支配集，求图的支配数。

（b）找到图中的所有独立集、极大独立集、最大独立集，求图的独立数。

（c）找到图中的所有点覆盖集、极小点覆盖集、最小点覆盖集，求图的点覆盖数。

8.154 无向简单图的最大独立集是否一定是最小支配集？

8.155 无向简单图的最小支配集是否一定是最大独立集？

8.156 求彼得森图的支配数、独立数、点覆盖数。

8.157 求立方体图 $B_{n} (n \geqslant 1)$ 的支配数、独立数、点覆盖数。

8.158 已知10阶无向图G中无孤立顶点，G的独立数为4，求G的点覆盖数，并给出一个这样的无向图G。

8.159 证明:对于任意的无向简单图G，都有 $\beta ( G ) \geqslant \delta ( G )$

（提示:证明 $n - \alpha(G) \geqslant \delta(G)$

8.160令 $P _ { n }$ 是由n（n≥1）个顶点构成的简单道路。证明: $P _ { n }$ 中点独立集（包括空集∅）的数目是 n+2阶斐波那契数 $f _ { n + 2 }$

8.161 找到图8.138中各图的所有匹配、极大匹配、最大匹配，求图的支配数。图中是否存在完美匹配？

[page:296]

## 296

8.162 在图8.139中，寻找一个最大匹配。

8.163 是否每一个匹配都包含在一个最大匹配中？如果成立，请证明之；如果不成立，请给出反例。

8.164 寻找 $W _ { 7 }$ 中的完美匹配。

8.165 证明:树最多有一个完美匹配。

8.166 证明:立方体图 $B_{n} (n \geqslant 1)$ 存在完美匹配。

8.167 求 $K _ { 2 n }$ 和 $K _ { n , n }$ 中不同的完美匹配数目。

8.168 两个人通过轮流在图G上选取不同的顶点 $v_{0}, \; v_{1}, \; v_{2}, \; \cdots ]$ 进行游戏，要求对于任意$i { \geq } 0$ ， $\nu _ { i }$ 与 $\nu _ { i - 1 }$ 都是相邻的。无法再拿到顶点者失败。证明:先行者有获胜策略当且仅当图中不存在完美匹配。

8.169 在一个 $8 \times 8$ 的正方形的左上角和右下角分别去掉一个 $1 \times 1$ 的小块后，证明:不可能只用 $1   \times   2$ 的小矩形拼出这样一个图形。

8.170 减肥俱乐部希望将会员分成两人一组的互助小组，同一个组的两个人的重量相差不应该超过 25 1b（1 1b≈0.454 kg)。Andrew 重 185 lb，Bob 重 250 1b，Carl 重 215 1b，Dan重210 lb，Edward重260 1b，Frank重 205 1b。是否可以找到合适的分组方法？

8.171某中学有3个课外小组:物理组、化学组、生物组。今有张、王、李、赵、陈5名同学。若已知:

（1）张、王为物理组成员，张、李、赵为化学组成员，李、赵、陈为生物组成员。

（2）张为物理组成员，王、李、赵为化学组成员，王、李、赵、陈为生物组成员。

（3）张为物理组和化学组成员，王、李、赵、陈为生物组成员。

在以上3种情况下能否各选出3名不兼职的组长？

8.172 设图 8.140 中的初始匹配 $M = \{ x_{1}y_{1}, x_{2}y_{5} \}$ ，求它的一个最大匹配。

8.173 把一组联合国维和士兵分成两个人的小队，同队的两个成员要能讲同一种语言以

[page:297]

## 第8章 图论

便进行沟通。士兵和所掌握的语言如表8.3所示。至多可以将士兵分为多少个组？(允许有士兵未被编入任何组)

表 8.3 习题 8.173 用表<table><tr><td>士兵</td><td>语言</td></tr><tr><td>1</td><td>法语、德语、英语</td></tr><tr><td>2</td><td>西班牙语、法语</td></tr><tr><td>3</td><td>德语、朝鲜语</td></tr><tr><td>4</td><td>希腊语、德语、俄语、阿拉伯语</td></tr><tr><td>5</td><td>西班牙语、俄语</td></tr><tr><td>6</td><td>汉语、朝鲜语、日语</td></tr><tr><td>7</td><td>希腊语、汉语</td></tr></table>

8.174 有5个字符串 BC、ED、AC、BD和ABE，能否用其中的一个字母代表该字符串并且不产生混淆？如果可以，试给出一种方案。

8.175 5个学生V、W、X、Y、Z是4个兴趣协会 $C_{1} 、 C_{2} 、 C_{3} 、 C_{4}$ 的成员。 $C _ { 1 }$ 的成员是V、X和Y， $C _ { 2 }$ 的成员是X和 Z， $C _ { 3 }$ 的成员是V、Y和Z， $C _ { 4 }$ 的成员是V、W、X和 $Z _ { \circ }$ 希望从每个兴趣协会中选出一个代表，一个学生不能代表两个兴趣协会，这样的要求是否可以实现？

8.176 某工作室有4项（彼此独立的）工作要做，工作室负责人可以把这些工作分配给4个工人。每个工人做各项工作所需要的时间（以小时计）如表8.4所示。

表 8.4 习题 8.176 用表<table><tr><td>工人</td><td>工作1</td><td>工作2</td><td>工作3</td><td>工作4</td></tr><tr><td>工人1</td><td>3</td><td>7</td><td>5</td><td>8</td></tr><tr><td>工人2</td><td>6</td><td>3</td><td>2</td><td>3</td></tr><tr><td>工人3</td><td>3</td><td>5</td><td>8</td><td>6</td></tr><tr><td>工人4</td><td>5</td><td>8</td><td>6</td><td>3</td></tr></table>

负责人希望尽早结束这4项工作，所以他希望能选出4名工人并合理地给他们分配工作（每人一项），使得最大工作时间尽可能短。

8.177 举例说明霍尔定理对非二部图不成立。

8.178 在一个舞会上男女各占一半，假定每位男士都认识k位女士，每位女士也认识k位男士。问:是否可以安排得当，使每位都有认识的人做舞伴？

8.179 假设每位导师只有一个研究生指导名额，有6个学生报名了研究生面试，4位导师的意愿如表8.5所示，是否能够让每位导师都选择到自己认可的研究生？

[page:298]

## 离散数学及应用（第2版）

表 8.5 习题 8.179 用表<table><tr><td rowspan=2>导师</td><td colspan=6>学生</td></tr><tr><td><eq>a</eq></td><td><eq>b</eq></td><td><eq>c</eq></td><td><eq>d</eq></td><td><eq>e</eq></td><td><eq>f</eq></td></tr><tr><td><eq>A</eq></td><td><eq>\sqrt { }</eq></td><td></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td></td><td><eq>\surd</eq></td></tr><tr><td><eq>B</eq></td><td><eq>\sqrt { }</eq></td><td><eq>\surd</eq></td><td></td><td></td><td><eq>\sqrt { }</eq></td><td></td></tr><tr><td><eq>C</eq></td><td></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td></td><td></td><td><eq>\surd</eq></td></tr><tr><td><eq>D</eq></td><td></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td><eq>\sqrt { }</eq></td><td><eq>\sqrt { }</eq></td><td></td></tr></table>

8.180 申请人A 可以胜任工作 $J _ { 1 }$ 、 $J _ { 2 }$ 、 $J _ { 4 }$ 和 $J _ { 5 }$ ，申请人B可以胜任工作 $J _ { 1 }$ 、 $J _ { 4 }$ 和 $J _ { 5 }$ ，申请人C可以胜任工作 $J _ { 1 }$ 、 $J _ { 4 }$ 和 $J _ { 5 }$ ，申请人D可以胜任工作 $J _ { 1 }$ 和 $J _ { 5 }$ ，申请人E可以胜任工作 $J _ { 2 } , J _ { 3 }$ 和 $J _ { 6 } ,$ ，申请人F可以胜任工作 $J _ { 4 }$ 和 $J _ { 5 }$ 。每项工作最多只能分配给一个申请人。最多可以同时为多少人分配工作？是否可以让每人都有工作可做？

8.181 Bat先生带了6种不同味道的软糖回家，给他的6个孩子。但是，当他到家时，发现每个孩子都只喜欢某几种味道的糖。Amy只吃巧克力、香蕉或香草味的糖，Burt只喜欢巧克力和香蕉味的糖，Chris只吃香蕉、草莓和桃子味的糖，Dan只接受香蕉和香草味的糖，Edesl艾德塞只喜欢巧克力和香草味的糖，Frank只吃巧克力、桃子和薄荷味的糖。证明并非每个孩子都会得到他（或她）喜欢的软糖。

8.182 在国际象棋的棋盘的64个方格中，有16个方格已经标上记号，而且每行、每列都恰好有两个标记号的方格。证明:可以在已经标记号的方格中放上8个黑子和8个白子，使得每行每列都各有一个白子和一个黑子。

8.183 设0-1矩阵A每行恰有k个1，每列最多有k个1。证明:存在k个0-1矩阵 $P _ { 1 } , P _ { 2 } , \cdots$ $P _ { k } ,$ 使得 $A = \boldsymbol{P}_{1} + \boldsymbol{P}_{2} + \cdots + \boldsymbol{P}_{k},$ 其中每个矩阵 $P _ { i }$ 每行恰有一个1，每列最多有一个1。8.184 6 位教师 $Y _ { 1 } ,   Y _ { 2 } ,   \cdots ,   Y _ { 6 }$ 给4个班 $X _ { 1 } , X _ { 2 } , X _ { 3 } , X _ { 4 }$ 上课，课时安排由图8.141给出，第i行第j列数值表示教师 $Y _ { j }$ 给班级 $X _ { i }$ 每周上课的学时数。已知教室固定，问能否都安排在每天的前两节上课？试说明理由。

图 8.141 习题 8.184 用图

8.185 集合 $A_{1},A_{2},\cdots,A_{m}$ 的相异代表系（system of distinct representatives, SDR）由不同的元素 $x_{1},x_{2},\cdots,x_{m}$ 组成，使得对于所有 $1 \leqslant i \leqslant m,\ x_{i} \in A_{i}.$

(a）集合{1,3,5}、{1,2}、{3,4}、{2, 3,4}中是否存在 SDR?

(b）集合{1,2,3}、{1,2}、{2,3}、{1,3}中是否存在 SDR?

（c）证明:设集合 $A_{1},A_{2},\cdots,A_{m}$ 都是集合S的子集，如果存在正整数k使得

（c-1）对所有 $1 \leqslant i \leqslant m$ 都有 $| A _ { i } | \geqslant k$ ，且

[page:299]

## 第8章 图论

（c-2）S的每个元素恰好出现在 $A_{1},A_{2},\cdots,A_{m}$ 中的k个集合里。

则 $A_{1},A_{2},\cdots,A_{m}$ 具有一个相异代表系。

(d)集合 $A _ { 1 } , A _ { 2 } , \cdots , A _ { m }$ 具有一个相异代表系的充要条件是什么？

（e）证明:如果集合 $A_{1},A_{2},\cdots,A_{m}$ 都是集合S的子集，它们的并集所包含的元素超过m个，且它们具有有相异代表系。证明:它们具有多个不同的相异代表系。

8.186 设 $G { = } ( X , Y , E )$ 为二部图，定义G的亏格为 $g(G) = \max \left\{ |S| - |N_G(S)| \mid S \subseteq X \right\}$ 。证明:(a）G有完美匹配当且仅当 $g(G) = 0$

(b）X中能与Y中顶点相匹配的顶点的最大数量是 $\lvert X \lvert - g ( G )$

8.187 设 $G { = } ( X , Y , E )$ 为二部图，设 $M _ { Y }$ 是Y中顶点的最大度数， $m _ { X }$ 是 X中顶点的最小度数。

（a）证明:如果 $0 < M_{Y} \leq m_{X},$ 则G中存在使X中每个结点饱和的匹配M。

（b）举例说明存在二部图G，其中有使X中每个结点饱和的匹配但不满足 $M _ { Y } { \leqslant }$ $m _ { X ^ { \circ } }$

8.188 对于图8.142所示的无向图，找到图的所有边覆盖集、极小边覆盖集、最小边覆盖集，求图的边覆盖数。

8.189 求图8.143所示的二部图的一个最大匹配、一个最小边覆盖集，并验证定理8.25(c)。

[page:300]

## 离散数学及应用（第2版）

8.190 求彼得森图的匹配数、边覆盖数。

8.191 在彼得森图中，寻找既是完美匹配又是最小边覆盖的边集合。

8.192 求立方体图 $B_{n} (n \geqslant 1)$ 的匹配数、边覆盖数。

8.193 已知8阶二部图G中无孤立顶点，G的匹配数为1，求G的边覆盖数，并给出一个这样的二部图 $G _ { \circ }$

8.194 图8.144表示一张城市地图。相邻顶点间的线是一条街道，在一些路口（顶点）上安排警察，使任何一条街道都至少有一端有一个警察。求出实现这个目标所需要的最小警察数并指出他们应该安排在哪里。

8.195 求图8.145所示的二部图的一个最大匹配、一个最小点覆盖集，并验证定理8.27。

8.196 对图 8.146所示的 0-1 矩阵，验证定理 8.28。

$$\begin{pmatrix}0 & 0 & 1 & 0 & 1 \\1 & 0 & 1 & 1 & 1 \\0 & 0 & 1 & 0 & 0 \\0 & 0 & 0 & 0 & 1\end{pmatrix}$$

$$\left( \begin{matrix} { 1 } & { 1 } & { 0 } & { 0 } & { 0 } & { 0 } \\ { 1 } & { 1 } & { 0 } & { 0 } & { 0 } & { 0 } \\ { 0 } & { 1 } & { 0 } & { 0 } & { 0 } & { 0 } \\ { 0 } & { 1 } & { 1 } & { 0 } & { 0 } & { 0 } \\ { 1 } & { 0 } & { 0 } & { 1 } & { 0 } & { 1 } \\ { 1 } & { 0 } & { 0 } & { 0 } & { 1 } & { 0 } \\ \end{matrix} \right)$$

图 8.146 习题 8.196 用图

8.197 称简单图 G 的一个 k-正则支撑子图为 G 的一个 k 因子。如果存在两两没有公共边的k因子 $H_{1}=(V, E_{1}), H_{2}=(V, E_{1}), \cdots, H_{m}=(V, E_{m})$ ，使得

[page:301]

## 第8章 图论

$$G = H_{1} \cup H_{2} \cup \cdots \cup H_{m} = \left( V, \bigcup_{i = 1}^{m} E_{i} \right)$$

则称G是k 可因子分解的。

（a）证明: $K _ { n ,   n }$ 和 $K _ { 2 n }$ 是1可因子分解的。

（提示:考虑图8.147。)

（b）证明: $K _ { 2 n + 1 }$ 可以表示为n个连通的2因子的并（参考习题8.119）。

（c）证明:每个k-正则简单二部图是1可因子分解的。

（d）证明:每个2k-正则简单二部图是2可因子分解的。

8.198 已知利润矩阵如图8.148所示，求最大利润。

8.199 已知成本矩阵如图8.148所示，求最小成本。

$$\begin{bmatrix} 3 & 6 & 0 & 1 & 4 \\ 2 & 3 & 5 & 5 & 2 \\ 4 & 0 & 6 & 1 & 5 \\ 8 & 2 & 3 & 6 & 4 \\ 7 & 4 & 2 & 5 & 6 \end{bmatrix}$$

(a)

$$\begin{bmatrix} 5 & 3 & 2 & 1 & 4 \\ 0 & 6 & 5 & 0 & 3 \\ 2 & 6 & 3 & 3 & 5 \\ 4 & 3 & 1 & 4 & 3 \\ 3 & 5 & 5 & 4 & 1 \end{bmatrix}$$

$$\begin{bmatrix} 3 & 3 & 6 & 4 & 9 \\ 6 & 4 & 5 & 3 & 8 \\ 7 & 5 & 3 & 4 & 2 \\ 6 & 3 & 2 & 2 & 5 \\ 8 & 4 & 5 & 4 & 7 \end{bmatrix}$$

$$\begin{aligned} &\begin{bmatrix}\\ &5 & 4 & 5 & 3 & 5 & 8 \\&7 & 3 & 6 & 6 & 6 & 10 \\&5 & 6 & 8 & 4 & 2 & 9 \\&11 & 7 & 6 & 8 & 3 & 2 \\&8 & 9 & 5 & 4 & 6 & 7 \\&7 & 4 & 3 & 2 & 4 & 5\\ &\end{bmatrix}\\ \end{aligned}$$

图 8.148 习题8.198 和习题 8.199 用图

8.200 用尽可能少的颜色对 $C _ { 6 }  、 W _ { 6 }  、 K _ { 4 }  、 K _ { 5 }  、 K _ { 3 , 3 }  、 K _ { 3 , }$ 4进行点着色。

8.201 用尽可能少的颜色对 $C _ { 6 }  、 W _ { 6 }  、 K _ { 4 }  、 K _ { 5 }  、 K _ { 3 , 3 }  、 K _ { 3 , 4 }$ 进行边着色。

8.202 用尽可能少的颜色对 $W_{5} 、 W_{6}$ 进行面着色。

8.203 证明:若G 是欧拉图，则线图L(G)也是欧拉图，反之不成立。

8.204 证明:对于任意简单图 G都有 $\chi ( G ) \leqslant \varLambda ( G ) + 1$

8.205 假设T是非平凡的无向树，证明: $\chi ( T ) { = } 2$

8.206 设 G 是 n阶k-正则图，证明: $\chi ( G ) \geqslant n / ( n - k )$ a

8.207 设G 是平面简单图，证明: $\chi(G) \leq 6.$

（提示:利用定理8.15推论3，存在顶点度数至多为5。)

8.208 设G是连通的简单平面图，其中任一简单回路至少包含4条边，证明:

$$\delta ( G ) \leq 3$$

[page:302]

## 离散数学及应用（第2版）

(b) x(G)≤4。

8.209 证明:一个图的点色数小于或等于v-i+1，其中ν是这个图的顶点数，i是这个图的独立数。

8.210 证明:一个简单图的顶点数小于或等于这个图的独立数和点色数之积。

8.211 使用韦尔奇-鲍威尔方法对图8.149中的图进行顶点着色。

8.212 使用韦尔奇-鲍威尔方法对图8.150中的图进行面着色。

8.213 使用韦尔奇-鲍威尔方法对图8.151 中的图进行边着色。

8.214 用尽可能少的颜色对彼得森图进行边着色。

8.215 证明:简单图G是二部图当且仅当G 可以顶点2着色。

8.216 育才中学高二年级有5个班，在“欢乐英语日”时4位教师需要为各班上英语故事听力课和英文散文阅读课，安排如表8.6所示。请问当天至少需要安排多少节课？至少需要多少个教室?

表 8.6 习题 8.216 用表<table><tr><td>教师</td><td>1班</td><td>2班</td><td>3班</td><td>4班</td><td>5班</td></tr><tr><td>教师甲</td><td>故事听力</td><td>散文阅读</td><td></td><td></td><td>散文阅读</td></tr><tr><td>教师乙</td><td>散文阅读</td><td></td><td>故事听力</td><td>散文阅读1</td><td></td></tr><tr><td>教师丙</td><td></td><td>故事听力</td><td></td><td>故事听力</td><td>故事听力1</td></tr><tr><td>教师丁</td><td></td><td></td><td>散文阅读</td><td>散文阅读2</td><td>故事听力2</td></tr></table>

8.217 有6名硕士研究生需要进行论文答辩，答辩委员会的成员分别是A={张教授，王教授，李教授}、B={李教授，赵教授，刘教授}、C={赵教授，刘教授，田教授}、

[page:303]

## 第8章 图论

D={张教授，刘教授，王教授}、E={张教授，王教授，田教授}、F={王教授，李教授，张教授}，这次论文答辩必须安排多少个不同的时间？

8.218证明:一个4-正则图可以用红、蓝两色染它的边，每边只使用一种颜色，而使每个顶点所关联的边恰好有两条为红色，两条为蓝色。将上述结论推广到2k-正则图（k>0)。证明存在一种对边上色的方法，使得每个顶点关联的边中恰有k条为红色，恰有k条为蓝色。(提示:利用欧拉回路。)

8.219 如果一个连通图 G 的点色数为 k，但是对于 G 的任意一条边 e，从 G 中删掉边 e后得到的新图的点色数都是k-1，则称G为着色k关键的。

（a）证明:只要n是正的奇数且 $n   \geqslant   3$ ，那么 $C _ { n }$ 就是着色3关键的。

（b）证明:只要n是正的奇数且 $n   \geqslant   3$ ，那么 $W _ { n }$ 就是着色4关键的。

(c）证明:如果图G为着色 k关键的，那么G中各个顶点的度至少为k–1。

8.220 设G是每个面都是三角形的平面图，现用3种颜色对它的所有顶点任意着色（允许相邻颜色相同)。证明:3个顶点恰好得到了这3种颜色的面的数目是偶数个。(提示:两端同色的边染为红色，两端不同色的边染为蓝色。之后统计蓝色边的条数。)

8.221 计算 R(3, 4)。

8.222 有17位学者，每位都给其余的人写一封信，信的内容是讨论3个问题中的任意一个，而且两个人互相通信所讨论的是同一个题目。证明:至少有3位学者，他们之间通信所讨论是同一个题目。

8.223 在图8.152中填上缺失的边流量，使得到的结果是给出的网络的流，并确定流的值。

8.224 如果f是一个流，(S, T)是一个 s-t 割，cap(S, T)>|f|，是否可以得到结论:(S, T)不是最小割且f不是最大流？如果成立，请证明之；如果不成立，请给出反例。8.225 求图 8.153 的最大流和最小割。

8.226 假设有3个自来水厂A、B和C，有3个用水的用户X、Y和Z，供水管线图如图8.154所示。

[page:304]

## 离散数学及应用（第2版）

（a）请将其修改为一个等价的网络模型。

（b）假设自来水厂A至多可以提供2个单位的水，B至多可以提供4个单位的水，C至多可以提供7个单位的水，请对(a)部分的模型进行修改。

(c)如果再次添加条件用户X至多需要4个单位的水，Y至多需要3个单位的水，Z至多需要4个单位的水，请对(b)部分的模型再次进行修改。

8.227 7种设备要用5架飞机运往目的地。每种设备各有4台，5架飞机容量（台数）分别是8、8、5、4、4，问能否有一种装法使同一类型设备不会有两台在同一架飞机上。

8.228 假设 $f ( A , B )$ 如定义8.61。

（a）证明:若 $V_{1} \cap V_{2} = \varnothing$ ，则 $f(U,   V_1 \cup V_2) = f(U,   V_1) + f(U,   V_2)$

[page:305]

## 第8章 图论

（b）证明:若 $U_{1} \cap U_{2} = \varnothing$ ，则 $f(U_{1} \cup U_{2}, V) = f(U_{1}, V) + f(U_{2}, v)$ 0

（c）给出一个例子，说明:如果 $V _ { 1 }$ 和 $V _ { 2 }$ 不是不相交的，那么 $f ( U ,   V _ { 1 } \cup V _ { 2 } )$ 可能不等于 $f(U, V_1) + f(U, V_2)$ 0

(d)证明:对于任何顶点集合 $U 、 V 、 W, f(U, V \cup W) = f(U, V) + f(U, W) - f(U, V \cap W)$

8.229 给出一个网络的例子，其中每条有向边的容量都是整数，但存在一个最大流，在某些有向边上的流量不是整数。

8.230 设N是一个网络，实数d>0。定义网络N'，N'和N的有向图相同，但其所有有向边的容量都为N中相应的边的容量乘以 $d _ { \circ }$

（a）证明: $\{ S , T \}$ 是N的一个最小割当且仅当它是N的一个最小割。

（b）证明:如果ν和ν'分别是N和N'的最大流的值，那么 $v ^ { \prime } { = } d v _ { \circ }$

（c）证明: $f$ 是N的一个最大流当且仅当f'是N'的一个最大流，其中， $f^{\prime}(e) =$ $d f ( e )$ 0

（d）由此证明:如果各边的容量都是有理数，则福特-福尔克森最大流算法一定会在有限步骤后终止。

8.231 如果每边(u, v)还有非负的最小边流量条件 $m _ { u v }$ ，流 $f _ { i j }$ 必须对所有边(u, v)满足$m_{uv} \leqslant f_{uv} \leqslant c_{uv}$

（a）举例说明对所有边(u, v)满足 $m_{uv} \leq c_{uv}$ ，但其中没有流存在的网络图 G的例子。

(b) 定义 $m(A,B)=\sum_{u \in A,v \in B \atop (u,v) \in E} m_{uv}$ 。证明:任意一个流的流量 V对任意一个 s-t 割(S, T)

满足

$$m(S,T)-c(T,S) \leq V \leq c(S,T)-m(T,S)$$

（c）如果每条边(u, v)都满足 $c _ { w }   =   \infty$ ，那么如何在网络图G中寻找最小流？

(d)证明:如果 G 存在流，则 G 中存在流量为 max{c(S, T)-m(T, S)|(S, T)是一个s-t割}的最大流。

(e）证明:如果 G 存在流，则 G 中存在流量为 min {m(S, T)-c(T, S) |(S, T)是一个s-t 割}的最小流。

8.232 证明定理 8.33。

[page:306]

# 第9章

## 树及其应用

树是一类简单而非常重要的特殊图，它在算法分析、数据结构等计算机科学及其他许多领域都有广泛而重要的应用。

1847年德国学者基尔霍夫就用树的理论来研究电网络。1857年英国数学家凯莱（Arthur Cayley，1821—1895）在计算有机化学中 $\mathrm { C } _ { n } \mathrm { H } _ { 2 n + 2 }$ 的同分异构物的数目时独立地提出了树的概念。

本章主要介绍无向树和根树的定义、性质及其典型应用。

## 9.1 无向树

树是一类特殊的图，具有简单的形式和很好的性质，可以从多个角度去刻画它。另外，在不特殊说明的情况下，本节所提及的图都是无向图。

定义9.1 连通且不含任何简单回路的无向图称为无向树(undirected tree)，简称树(tree)。树中度数为1的顶点称为叶子（leaf)，度数大于1的顶点称为分枝点（branch point).

注:

（a）根据这个定义，一阶简单图 $K _ { 1 }$ 也是树，称作平凡树（trivial tree），它是一棵既无叶子又无分枝点的特殊树。

（b）由定义可知，树必定是不含重边和自环的，即树一定是简单图。

定义9.2 不含任何简单回路的图称为森林（forest）。

注:显然，森林的每个连通分支都是树。

【例9.1】在图9-1中，(a)是树，(b)存在简单回路，因而不是树，(c)是森林。在(a)中，b、c、h、i、j都是叶子，而a、d、e、f都是分枝点。

【例9.2】 碳氢化合物 $\mathrm { C _ { 4 } H _ { 1 0 } }$ 的分子结构图也可以表示为一棵树。

[page:307]

## 第9章 树及其应用

树有许多等价的定义，在表述等价定义之前，首先给出如下结果。

定理 9.1 设 n(n≥2)阶无向连通图 G 的边数满足 m=n-1，则图 G 中至少存在两个度数为1的顶点。

证明.因为图G是连通的，从而各顶点的度数均大于0。设图G有t个顶点度数为1，其余顶点度数都至少是2，则 $2m = \sum_{i = 1}^{n} \deg(v_i) \geqslant t + 2(n - t).$ ，由 m=n-1，可得 2(n-1)= 2m≥t+2n-2t，即 t≥2。 口

在此基础上，给出并证明无向树的如下等价定义。

定理9.2 设 T是(n, m)-无向图，则下述命题相互等价。

（a）T是树，即T连通且不存在简单回路。

（b）T的每一对相异顶点之间存在唯一的简单道路。

（c）T不存在简单回路，但在任何两个不相邻的顶点之间加一条新边后得到的图中存在简单回路（也称作“极大无圈”)。

（d）T连通且 m=n−1。

（e）T连通，但是删去任何一边后便不再连通，即T中每一条边都是桥（也称作“极小连通”)。

（f)T 不存在简单回路且 m=n-1。

证明.采用循环论证的方式。

(a)⇒(b):对阶数 n 进行归纳。

（1）n=1时，T不存在相异顶点，(b)成立。

(2）设 n=k 时(b)成立。当 n=k+1 时，已知 T 连通且不含简单回路，由定理 8.5，T

中存在度数为1的顶点，不妨记之为ν，并设uν为悬挂边（如图 9.3所示)。

对于 T-v 中任意两个相异顶点 $w _ { 1 }$ 和 $w _ { 2 }$ ， $w _ { 1 }$ 到 $w _ { 2 }$ 的任一条简单道路必然不经过 uv，由归纳假设， $w _ { 1 }$ 和 $w _ { 2 }$ 之间存在唯一的简单道路。

图 9.3 定理 9.2 用图 1

对于 $T { - } \nu$ 中任一顶点w，由于每条到ν的道路必然经过u，

而且由归纳假设唯一存在w到u的简单道路，因此w和ν之间存在唯一的简单道路。

(b)⇒(c):显然图 T中不存在重边和自环，对阶数n 进行归纳。

（1）n=1时，T只存在孤立顶点，(c)成立。

(2）设 n=k时(c)成立。当 n=k+1 时，首先证明图T 不存在简单回路。如果 T中存在

[page:308]

## 308

简单回路 $\nu _ { 1 } , \nu _ { 2 } , \cdots , \nu _ { k - 1 } , \nu _ { k }$ ，则从 $\nu _ { 2 }$ 到 $\nu _ { 1 }$ 存在两条不同的道路: $\nu _ { 2 } , \nu _ { 1 }$ 和 $\nu _ { 2 } , \cdots , \nu _ { k - 1 } , \nu _ { k } , \nu _ { 1 }$与(b)的条件矛盾。

而对于任意不相邻的两个顶点u和ν，由条件(b)存在ν到u的简单道路 $v , v _ { 1 } , v _ { 2 } , \cdots , v _ { k } ,$ u，于是添加边uν后构成简单回路 $\nu , \nu _ { 1 } , \nu _ { 2 } , \cdots , \nu _ { k } , u , \nu \mathrm { { } _ { \circ } }$

(c)⇒(d):对阶数 n 进行归纳。

（1）n=1时，T只存在孤立顶点，边数为0=1-1，(d)成立。

(2）设n=k时(d)成立。当n=k+1时，首先证明图T是连通的，否则连接两个不同连通分支中的两个顶点不会形成回路。

由于T连通且不包含任何回路，由定理8.5，T中存在度数为1的顶点，不妨记之为v，并设uν为悬挂边（如图9.3所示)。由归纳假设，T-ν顶点数 $n ^ { \prime } .$ 与边数 m'满足 $m ^ { \prime } { = } n ^ { \prime } { - } 1$故 T的顶点数 n 与边数 m 满足 $m = m' + 1 = n' - 1 + 1 = n - 1$

(d)⇒(e):对阶数 n 进行归纳。

（1）n=1时，T只存在孤立顶点，(e)成立。

（2）设n=k时(e)成立。当n=k+1时，由定理9.1，T中存在度数为1的顶点，不妨记之为ν，并设uν为悬挂边（如图9.3所示)。则uν为桥，而且由归纳假设T-ν中每一条边都是桥，于是T中每一条边都是桥。

(e)⇒(f):对阶数 n 进行归纳。

（1）n=1时，T只存在孤立顶点，边数为0=1-1，(f)成立。

(2)设n=k 时(f)成立。当n=k+1 时，首先证明图T不包含简单回路，否则由定理8.6，回路中任何一条边都不是桥，因此删去回路中的一条边不会使得图T变得不连通。

由于T连通且不包含任何回路，由定理8.5，T中存在度数为1的顶点，不妨记之为v，并设 uv为悬挂边（如图9.3所示)。由归纳假设，T-ν顶点数 n'与边数 m'满足 $m ^ { \prime } { = } n ^ { \prime } { - } 1$故 T 的顶点数 n 与边数 m 满足 $m = m' + 1 = n' - 1 + 1 = n$

(f)⇒(a):显然图T 中不存在重边和自环，对阶数n 进行归纳。

（1）易验证n=1,2时，(a)成立。

（2）设n=k时(a)成立。当n=k+1时，由定理8.5，T中存在度数小于2的顶点。

若 T 中存在孤立顶点 ν，考虑 T-ν 中任何一个边 uw（如图 9.4 所示)。T-v-uw 的顶点数 n'和边数 m'满足 $m ^ { \prime } { = } n ^ { \prime } { - } 1$ ，由归纳假设 T-v-uw 连通，因此存在 w 到 u 的道路 $w , v _ { 1 } , v _ { 2 } , \cdots , v _ { k }$ u，于是在 T 中存在回路 $w , v _ { 1 } , v _ { 2 } , \cdots , v _ { k } , u , w ,$ ，产生矛盾。

由于T中不存在孤立顶点，T中必然存在度数为1的顶点，图 9.4 定理9.2 用图 2不妨记之为ν，并设uν为悬挂边（如图9.3所示)。T-ν的顶点数 n'和边数 m'满足 $m ^ { \prime } { = } n ^ { \prime } { - } 1$ ，由归纳假设，T-ν连通，因此T也连通。 □

注:由定理9.2有以下结论。

设T是无向图，则当满足下述3个条件中的至少两个时T是树:

（a） T连通。

（b）T不存在简单回路。

(c)m=n−1。

[page:309]

## 第9章 树及其应用

由定理9.1及定理9.2即得如下推论。

推论1 任何非平凡树至少有2个叶子顶点。

推论2 对于任何无向(n, m)-图，若图中不存在简单回路，则 $m \leq n - 1$

证明. 若无向(n, m)-图 G 中 $m { > } n { - } 1$ ，则删去任意 $m { - } ( n { - } 1 )$ 条边得到图 $G ^ { \prime } ,$ 。图G'中仍然不存在任何简单回路，由定理9.2(f)，图 $G ^ { \prime } )$ 是树。再将删去的边重新添加到图 $G^{\prime}  中$由定理9.2(c)，G中存在回路，产生矛盾。 □

定理9.3 无向树都是平面图。

证明.对阶数n进行归纳即易得。

定理9.4 假设无向树T中有 $a _ { i }$ 个度数为i的顶点，则T的叶子数为 $\sum_{i = 3}(i - 2) \times a_{i} + 2$

证明. 假设无向树 T 中有 $a _ { i }$ 个度数为 i 的顶点和 m条边，则由握手定理有$\sum _ { i = 1 } ^ { n } i \times a _ { i } = 2 m$ ，由定理9.2有 $\sum _ { i = 1 } a _ { i } = m + 1$ ，于是 $\sum_{i = 1}^{n} i \times a_{i} = 2 \left( \sum_{i = 1}^{n} a_{i} - 1 \right)$ ，整理得到$a_{1} = \sum_{i = 3}(i - 2) \times a_{i} + 2$ o □

【例9.3】已知无向树T中有2个2度顶点和1个3度顶点，其余顶点都是叶子，计算T有多少个顶点。

解. 将已知条件代入定理9.4 的公式，得 $a_{1}=(3-2)\times 1+2=3$ ，故 T 共有 3+2+1=6 个顶点。

【例9.4】无向树T中有1个6度顶点、2个7度顶点、34个叶子，其余顶点度数都是8，计算T的边数。

解.将已知条件代入定理9.4的公式，得 $34=(6-2)\times1+(7-2)\times2+(8-2)\times a_{8}+2$ ，解得 $a _ { 8 } { = } 3$于是T的顶点数是40，故边数为40-1=39。

定理9.5 如果正整数序列 $d _ { 1 } , d _ { 2 } , \cdots , d _ { n }$ 满足 $\sum_{i = 1}^{n} d_{i} = 2(n - 1)$ ，则存在以 $d _ { 1 } , d _ { 2 } , \cdots , d _ { n }$为度序列的无向树。

证明. 对阶数n进行归纳。

(1) $n { = } 1$ 时， $d_{1}=2(1-1)=0$ ，表明图中只存在孤立顶点，定理成立。

(2） n=2 时， $d_{1}+d_{2}=2(2-1)=2$ ，表明 $d _ { 1 } { = } d _ { 2 } { = } 1$ ，定理成立。

（3）设 n=k>2 时定理 9.5 成立。当 $n   =   k   +   1$ 时，由 $\sum_{i = 1}^{n}d_{i} = 2(n - 1) < 2n$ 知存在 $d _ { j } { = } 1$ $(1 \leqslant j \leqslant n)$ ，不妨设 $j { = } 1$ ；由 $\sum_{i = 1}^{n}d_{i} = 2(n - 1) > n$ 知存在 $d_{k}>1 (1 \leqslant k \leqslant n)$ ，不妨设 $k { \overline { { - n } } }$ 。则正整数序列 $d _ { 2 } , \cdots , d _ { n - 1 } , d _ { n } { - } 1$ 满足 $\sum_{i = 2}^{n - 1}d_{i}+(d_{n}-1)=2(n - 1)-1-1=2(n - 2)$ ，由归纳假设，存在无向树T以 $d _ { 2 } , \; \cdots , \; d _ { n - 1 } , \; d _ { n } \mathrm { - 1 }$ 为度数序列。假设顶点u的度数为 $d _ { n } { - } 1$ ，新增一个顶点 ν，则 T增添顶点 ν和边 uν后得到的树 T'即以 $d _ { 1 } , d _ { 2 } , \cdots , d _ { n }$ 为度数序列。 □

[page:310]

## 离散数学及应用（第2版）

## 9.2 支撑树及其应用

有些连通图本身不是树，但它的某些子图是树。一个图可能有许多子图是树，其中重要的一类是支撑树。

定义 9.3 若连通图 G 的支撑子图 T 是一棵树，则称 T 为 G 的生成树或支撑树(spanning tree)，记为 $T _ { G \circ }$

【例9.5】图9.5中，(b)、(c)、(d)、(e)都是(a)的支撑树；(f)不是(a)的支撑子图，因此不是(a)的支撑树；(g)虽然是(a)的支撑子图，但是不是树，因此也不是(a)的支撑树。这个例子也表明图的支撑树可能不唯一。

定理9.6 无向图G具有支撑树，当且仅当G是连通图。

证明.（必要性）因为树是连通的，所以如果无向图G具有支撑树作为支撑子图，则G必定也是连通的。

（充分性）如果G中无回路，G本身就是支撑树。如果G中存在回路C，则去掉C中任何一条边，得到图 $G _ { 1 }$ 。由定理8.6，桥不属于任何一个回路，所以图 $G _ { 1 }$ 仍是连通的。

若 $G _ { 1 }$ 中还有回路，则重复上述去边步骤，最终可以得到一个不含回路且连通的G的支撑子图T，T即为G的支撑树。 □

推论 设G为一个n阶无向连通图，则其边数 $m \geq n - 1$

证明. 若G是n阶连通图，它必定含有支撑树，即至少包含n-1条边。 □

定理9.6的证明实际上给出了求连通图G的支撑树的一种算法，要点是逐次删除图中回路上的任一条边，直至图中不存在回路为止。

【例9.6】 图 9.6(b)~(f)给出了构造(a)的一棵支撑树的过程。

注意:由于边的选择不唯一，所以形成的支撑树也可能不唯一。

[page:311]

## 第9章 树及其应用

【例9.7】一个地区有5个村庄和一个池塘，各村庄都希望从池塘直接或间接引水到村里，但受限于客观条件，水道只能依图9.7(a)中的无向边铺设。请问最少要修几条水道？

可以将这个实际问题抽象成图9.7(b)，记该图为 G，满足题目要求的修水道方法即是求G的一个子图T，满足:包含G的所有顶点，连通，不存在回路（否则边数不是最少)。因此T就是G的一棵支撑树，边数至少为5，即最少要修5条水道。图9.8(a)和(b)都是G的支撑树。

但是在现实中，各条水道的修建费用很可能存在差异，这时应该抽象为赋权图，例如图9.9的情形。此时，图9.8(a)和(b)两个方案存在很大不同，见图9.10(a)和(b)，前者的总成本为105，而后者的总成本仅为79。因此对修水道方案还要增加“总成本最低”这一要求。

定义9.4 设(G, W)是无向连通赋权图，T是G的一棵支撑树，T的各边权值之和称为 T的权 $( \mathrm { w e i g h t } )$ ,记为 $w ( T ) ; G$ 的所有支撑树中权最小的称为G的最小支撑树(minimal

[page:312]

## 312

spanning tree, MST）或最小生成树。

注:由定义可知，在考虑图的最小支撑树时，不必考虑重边（因为至多选择其中权值最小的一条边）和自环，因此以后的讨论中都假定图是简单图。

下面介绍4种主要的求最小支撑树算法。

（a）普里姆算法。该算法于1930年由捷克数学家亚尔尼克（Vojtěch Jarník，1897 1970）发现；1957年，美国计算机科学家普里姆（RobertClayPrim，1921—）独立发现了该算法；1959年，迪杰斯特拉（EdsgerWybeDijkstra，1930—2002）再次发现了该算法。因此，普里姆算法又被称为DJP算法。

算法的思想是:维护两个集合 $V _ { T }$ 和 $E _ { T } , ~ E _ { T }$ 中为所有已经确定属于最小支撑树的边$V _ { T }$ 保存 $E _ { T }$ 中所有边的端点，每一步都将距离 $V _ { T }$ “最近”但是不属于 $V _ { T }$ 的顶点移入 $V _ { T ^ { \circ } }$

算法的具体步骤如下:

普里姆算法 Prim (G)

输入:赋权简单连通图 $G { = } ( V , E )$

输出:G的最小支撑树 $T   =   ( V _ { T } , E _ { T } )$

1 $V _ { T } \gets \{   V \}$ ，其中v为顶点集合V中的任一顶点（起始点）， $E _ { T } { \leftarrow } \emptyset$

2若 $V _ { T } = V ,$ 则输出 $T   =   \left( V _ { T } , \quad E _ { T } \right)$ ，否则

2.1 在集合E中选取权值最小的边uv，其中 $\scriptstyle { \mathcal { U } } \in { \mathcal { V } } _ { T }$ 且 $V   \in   \bar { V }   -   \bar { V } _ { T }$ (如果存在多条满足条件的边，则可任选其中之一)

2.2 $V_{T} \leftarrow V_{T} \cup \{ V \} , E_{T} \leftarrow E_{T} \cup \{ UV \};$

2.3 返回步骤2

[page:313]

## 第9章 树及其应用

【例9.8】 用普里姆算法求图9.9中赋权图的最小支撑树的过程如表9.1 所示。

表9.1 普里姆算法示例<table><tr><td rowspan=2>图</td><td><eq>V _ { T }</eq></td><td><eq>V – V _ { T }</eq></td><td><eq>E _ { T }</eq></td><td>可选择的边</td><td>选择的边</td></tr><tr><td>{A}</td><td>{B, C, D, E, F}</td><td>∅</td><td>w(AB)=14w(AF)=13w(AE)=22</td><td><eq>A F</eq></td></tr><tr><td></td><td>{A, F}</td><td><eq>\{ B , C , D , E \}</eq></td><td>{AF}</td><td>w(AB)=14w(FB)=12w(AE)=22w(FE)=24w(FC)=18w(FD)=19</td><td>FB</td></tr><tr><td></td><td>{A, F, B}</td><td>{C, D, E}</td><td>{AF, FB}</td><td>w(AE)=22w(BC)=21w(FC)=18w(FD)=19w(FE)=24</td><td>FC</td></tr><tr><td></td><td>{A, F, B, C}</td><td>{D, E}</td><td>{AF, FB,FC}</td><td>w(AE)=22w(CD)=16w(FD)=19w(FE)=24</td><td>CD</td></tr></table>

[page:314]

## 离散数学及应用（第2版）

续表<table><tr><td rowspan=3>图</td><td><eq>V _ { T }</eq></td><td><eq>V  – V _ { T }</eq></td><td><eq>E _ { T }</eq></td><td>可选择的边</td><td>选择的边</td></tr><tr><td><eq>\{ A , F , B , C , D \}</eq></td><td>{E}</td><td><eq>\{ A F , F B ,</eq><eq>F C , C D \}</eq></td><td><eq>w(AE)=22</eq><eq>w(DE)=20</eq><eq>w(FE)=24</eq></td><td><eq>D E</eq></td></tr><tr><td><eq>\{ \mathcal { A } , F , B , C , D , E \}</eq></td><td>∅</td><td><eq>\{ A F , F B ,</eq><eq>F C , C D ,</eq><eq>D E \}</eq></td><td></td><td></td></tr></table>

（b）克鲁斯卡尔算法。该算法由克鲁斯卡尔（Joseph Bernard Kruskal，1928—2010）在1956年发表。

算法的思想是:每一步都选择权值最小而且不与已选的边构成回路的边，直到边数等于顶点数减1为止。

算法的具体步骤如下:

克鲁斯卡尔算法 Kruskal(G)

输入:赋权简单连通图 $G { = } ( V , E )$

输出:G的最小支撑树 $T   =   ( V , E _ { T } )$

1将图 G的边按权值的不减顺序排成一个序列 $e_{1}, \quad e_{2}, \quad \cdots, \quad e_{m}, \quad E^{\prime} \leftarrow E, \quad E_{T} \leftarrow \varnothing$

2若 $|   E _ { T }   |   =   |   V   |   -   1$ ，则输出 $T   =   (   V , \quad E _ { T }   )$ ，否则

2.1 假设e 是E'中权值最小的边， $E ^ { \prime }   \leftarrow   E ^ { \prime }   -   \{   \in   \}$

(如果存在多条满足条件的边，则可任选其中之一)

2.2 如果e 与 $E _ { T }$ 中的边不构成回路，则 $E _ { T } { \leftarrow } E _ { T } { \cup } \{ \in \}$

2.3 返回步骤2

【例9.9】用克鲁斯卡尔算法求图9.9中赋权图的最小支撑树，首先将图9.9中的边按权值的不减顺序排序:BF, AF, AB, CD, CF, DF, DE, BC, AE, EF，随后的过程如表 9.2所示。

[page:315]

## 第9章 树及其应用

表9.2 克鲁斯卡尔算法示例<table><tr><td>图</td><td><eq>E ^ { \prime }</eq></td><td><eq>E _ { T }</eq></td><td>E&#x27;中权值最小的边</td><td>备注</td></tr><tr><td></td><td><eq>\{ BF, AF, AB, CD,</eq><eq>CF, DF, DE, BC,</eq><eq>A E , E F \}</eq></td><td><eq>\varnothing</eq></td><td><eq>B F</eq></td><td></td></tr><tr><td>D</td><td><eq>\{ A F , A B , C D , C F ,</eq><eq>DF, DE, BC, AE,</eq>EF}</td><td><eq>\{ B F \}</eq></td><td><eq>A F</eq></td><td></td></tr><tr><td>D</td><td><eq>\begin{array} { l } { \{ A B ,   C D ,   C F ,   D F , } \\ { D E , B C , A E , E F \} } \end{array}</eq></td><td><eq>\{ B F , A F \}</eq></td><td><eq>A B</eq></td><td><eq>A B</eq>与BF、<eq>A F</eq>构成回路</td></tr><tr><td>D                         C</td><td><eq>\begin{array} { l } { \{ C D , C F , D F , D E , } \\ { B C , A E , E F \} } \end{array}</eq></td><td><eq>\{ B F , A F \}</eq></td><td><eq>C D</eq></td><td></td></tr></table>

[page:316]

## 离散数学及应用（第2版）

续表<table><tr><td>图</td><td><eq>E ^ { \prime }</eq></td><td><eq>E _ { T }</eq></td><td>E&#x27;中权值最小的边</td><td>备注</td></tr><tr><td></td><td><eq>\begin{aligned}&amp;\{ \mathit{CF,\quad DF,\quad DE,} \\&amp;BC, \mathit{AE,EF} \}\end{aligned}</eq></td><td><eq>\{CD,BF,AF\}</eq></td><td><eq>C F</eq></td><td></td></tr><tr><td></td><td>{DF, DE, BC,AE, EF}</td><td><eq>\{ C F , C D , B F , A F \}</eq></td><td><eq>D F</eq></td><td>DF 与 CD、<eq>C F</eq>构成回路</td></tr><tr><td></td><td><eq>\begin{array}{l}\{ \mathit{DE}, \quad \mathit{BC}, \quad \mathit{AE}, \\\mathit{EF} \}\end{array}</eq></td><td><eq>\{ C F , C D , B F , A F \}</eq></td><td><eq>D E</eq></td><td></td></tr><tr><td></td><td></td><td><eq>\{ { \it D E } , { \it C F } , { \it C D } , { \it B F } , { \it A F } \}</eq></td><td></td><td></td></tr></table>（c）破圈法。该算法的思想是:每一步都删除权值最大而且不必要的边（出现在回路中的边删除后不破坏连通性)，直到边数等于顶点数减一为止。该算法的具体步骤如下:

破圈法 Reverse-delete (G)

输入:赋权简单连通图 $G { = } ( V , E )$

输出:G的最小支撑树 $T   =   ( V , E _ { T } )$

[page:317]

## 第9章 树及其应用

1 $E _ { T } { \leftarrow } E$

2若图 $( V , \ E _ { T } )$ 不存在回路，则输出 $T   =   \left(   V , \ E _ { T }   \right)$ ，否则

2.1 假设C是图 $( V , \ E _ { T } )$ 中的一条简单回路，e是C中权值最大的边

(如果存在多条满足条件的边，则可任选其中之一)

2.2 $E _ { T } { \leftarrow } E _ { T } - \{ \in \}$

【例9.10】 用破圈法求图9.9中赋权图的最小支撑树的过程如表9.3所示。

表9.3 破圈法示例<table><tr><td rowspan=5>图</td><td><eq>E _ { T }</eq></td><td>回路 C</td><td>选择的边</td></tr><tr><td><eq>\{ A B , A E , A F , B C , B F ,</eq><eq>\mathit { C D , C F , D E , D F , E F }</eq></td><td><eq>\mathit { E F , B F , B C , C D , D E }</eq></td><td><eq>E F</eq></td></tr><tr><td><eq>\{ A B , A E , A F , B C , B F ,</eq><eq>\mathit { C D } , \mathit { C F } , \mathit { D E } , \mathit { D F } \}</eq></td><td><eq>AF,CF,BC,AB</eq></td><td><eq>B C</eq></td></tr><tr><td><eq>\{ A B , A E , A F , B F , C D ,</eq><eq>CF,DE,DF</eq></td><td><eq>AF,BF,AB</eq></td><td><eq>A B</eq></td></tr><tr><td><eq>\{ A E , A F , B F , C D , C F ,</eq>DE, DF}</td><td><eq>AE,DE,DF,AF</eq></td><td><eq>A E</eq></td></tr></table>

[page:318]

## 318

续表<table><tr><td rowspan=3>图</td><td><eq>E _ { T }</eq></td><td>回路 C</td><td>选择的边</td></tr><tr><td><eq>\{ A F , B F , C D , C F , D E ,</eq>DF}</td><td><eq>DF,   CD,   CF</eq></td><td><eq>D F</eq></td></tr><tr><td><eq>\{ A F , B F , C D , C F , D E \}</eq></td><td></td><td></td></tr></table>

此外，可以证明，破圈法与如下算法是等价的:

破圈法ⅡI Reverse-delete-II(G)

输入:赋权简单连通图 $G { = } ( V , E )$

输出:G的最小支撑树 $T   =   ( V , E _ { T } )$

1将图 G的边按权值的不增顺序排成一个序列 $e_{1}, \quad e_{2}, \quad \cdots, \quad e_{m}, \quad E^{\prime} \leftarrow E, \quad E_{T} \leftarrow E$

2若 $| \; E _ { T } \; | = | \; V |   -   1$ ，则输出 $T   =   (   V , \quad E _ { T }   )$ ，否则

2.1 假设e是 $E ^ { \prime }$ 中权值最大的边， $E ^ { \prime }   \leftarrow   E ^ { \prime }   -   \{   \in   \}$

(如果存在多条满足条件的边，则可任选其中之一)

2.2 如果e不是 $( V , \ E _ { T } )$ 中的桥，则 $E _ { T } { \leftarrow } E _ { T } - \{   \in \}$

2.3 返回步骤2

它的流程和克鲁斯卡尔算法很类似。

（d）博鲁夫卡算法。该算法由捷克数学家博鲁夫卡（Otakar Boruvka，1899—1995）在1928年发现。

算法的思想是:每一步都选择最相近的两个连通分支合并，直到只剩下一个连通分支为止。

算法的具体步骤如下:

博鲁夫卡算法 Boruvka(G)

输入:赋权简单连通图 $G { = } ( V , E )$

输出:G的最小支撑树 $T   =   ( V , E _ { T } )$

1 $E _ { T } \leftarrow \emptyset$ ，图G中的每个顶点v都作为一个连通分支， $C   \leftarrow   (   V , \ E _ { T }   )$

2 对图C中的每两个不同连通分支，选择权重最小的边 $e = u v , E _ { T } \leftarrow \varnothing \cup \{ e \} , C \leftarrow ( V , E _ { T } )$

[page:319]

## 第9章 树及其应用

3 若只有一个连通分支则输出 $T   =   (   V , \ E _ { T }   )$ ，否则返回步骤2

【例9.11】用博鲁夫卡算法求图9.9中赋权图的最小支撑树，首先将图9.9中的边按权值的不减顺序排序: $\mathit { B F } , \mathit { A F } , \mathit { A B } , \mathit { C D } , \mathit { C F } , \mathit { D F } , \mathit { D E } , \mathit { B C } , \mathit { A E } , \mathit { E F } ,$ ，随后的过程如表9.4所示。

表9.4 博鲁夫卡算法示例<table><tr><td rowspan=2>图</td><td>连通分支</td><td>连通分支间最短的边</td><td><eq>E _ { T }</eq></td></tr><tr><td><eq>\{ \{ A \} ,   \{ B \} ,   \{ C \} ,   \{ D \} ,   \{ E \} ,   \{ F \} \}</eq></td><td>A-FB-FC-DD-CE-DF-B</td><td><eq>\varnothing</eq></td></tr><tr><td rowspan=2></td><td><eq>\{ \{ A , B , F \} ,   \{ C , D , E \} \}</eq></td><td><eq>F { - } C</eq></td><td><eq>\{ A F , B F , C D , D E \}</eq></td></tr><tr><td><eq>\{ \{ A , B , C , D , E , F \} \}</eq></td><td></td><td><eq>\{ A F , B F , C D , D E , C F \}</eq></td></tr></table>

下面对最小支撑树做一些说明:

当一个赋权图中存在权值相同的边时，最小支撑树也可能不唯一。例如图9.11(b)和(c)都是(a)的最小支撑树。

克鲁斯卡尔算法可以在非连通图中寻找最小支撑森林（图9.12所示）。其他算法是否可以在非连通图中寻找最小支撑森林留作习题。

[page:320]

## 离散数学及应用（第2版）

最后介绍两个与最小支撑树有关的问题:最小瓶颈支撑树和斯坦纳树。

定义9.5 设(G, W)是无向连通赋权图，G的所有支撑树中权值最大的边的权值最小的支撑树称为G 的最小瓶颈支撑树（minimal bottleneck spanning tree, MBST）。

【例9.12】在图9.13中，(b)、(c)、(d)都是(a)的最小瓶颈支撑树，这表明最小瓶颈支撑树可能不唯一；然而只有(b)是(a)的最小支撑树，这表明最小瓶颈支撑树可能不是最小支撑树。

关于最小瓶颈支撑树和最小支撑树之间的关系，有如下定理。

定理9.7 无向连通赋权图的最小支撑树一定是最小瓶颈支撑树，但最小瓶颈支撑树不一定是最小支撑树。

证明. 假设最小支撑树T不是最小瓶颈支撑树，设T的最大权值边为e，则最小瓶颈支撑树 $T _ { \mathrm { b } }$ 的所有边的权值都小于 $w ( e )$ 。删除 T中的 e形成两棵树 $T _ { 1 }$ 和 $T _ { 2 } ,$ 。由于 $T _ { \mathrm { b } }$ 连通，因此存在 $T _ { \mathrm { b } }$ 的边 $e ^ { \prime } ,$ ，连接 $T _ { 1 }$ 中某顶点和 $T _ { 2 }$ 中某顶点。于是用e'连接 $T _ { 1 }$ 和 $T _ { 2 }$ 后得到新的支撑树，但其总权值小于T，与T是最小支撑树产生矛盾。

最小瓶颈支撑树不一定是最小支撑树。考虑图9.14所示一个无向连通赋权图，图中仅存在一条桥而且权值最大，则图中每棵支撑树（无论是否最小支撑树）都是最小瓶颈支撑树。 □

定义 9.6 设 $( G { = } ( V , E ) , W )$ 是无向连通赋权图， $R { \subseteq } V$ ，在G的所有包含R中所有顶点

[page:321]

## 第9章 树及其应用

的子图中，总权值最小的树称为G的斯坦纳树（Steiner tree）。

当R=V时，斯坦纳树问题即是最小支撑树问题。

如果将例9.7的要求修改为“部分村庄希望从池塘直接或间接引水到村里，其他村庄是否从池塘直接或间接引水到村里无所谓”，则问题就变为求解图中的斯坦纳树。

【例9.13】当 $R { = } \{ a , \; b , \; c \}$ 时，图9.15(a)的斯坦纳树是最小支撑树，如图9.15(b)所示；而图9.15(c)的斯坦纳树则不是最小支撑树，如图9.15(d)所示。

虽然斯坦纳树问题与最小支撑树问题具有相似之处，然而斯坦纳树问题要难得多，它属于NPC 问题，事实上，它是卡普（Richard Manning Karp）证明的第一批 21个NPC问题之一。

## 9.3 最短道路树

定义9.7 假设(G，W)为赋权图，则图中一条道路的长度（length）是指该道路中各条边权值之和。

注:在本节中，假定赋权图中各边的权值都是正实数。

在实际应用中，经常要求计算给定的两个顶点之间长度最短的道路。

【例9.14】若干城市之间有铁路连通（图9.16(a))，铁路旁边的数字表明了本段路程所需时间，希望知道从城市s到其他城市的最短时间及路线。

可以将它抽象成图9.16(b)，问题就转化为计算顶点s到各个其他顶点的最短道路。

该问题的解如图9.17所示。

显然最短道路一定不包含回路，因此最短道路一定是初级道路。而且由定义可知，在考虑图的最短道路时，不必考虑重边（因为至多选择其中权值最小的一条边）和自环，因此以后的讨论中都假定图是简单图。

也可以这样理解最短道路问题:时刻0时洪水从图中某个顶点开始沿边蔓延，边的

[page:322]

## 322

权表示洪峰通过这段河路的时间，问题为求洪水到达各个顶点的时刻。

最短道路具有如下性质。

定理 9.8 设 $\pi \colon \nu _ { 0 } , \nu _ { 1 } , \cdots , \nu _ { k - 1 } , \nu _ { k }$ 是图 G 中顶点 $\nu _ { 0 }$ 到 $\nu _ { k }$ 的最短道路，则 $v _ { 0 } , v _ { 1 } , \cdots , v _ { k - 1 }$ 1是 $\nu _ { 0 }$ 到 $\nu _ { k - 1 }$ 的最短道路。

证明. 若存在另一条从 $\nu _ { 0 }$ 到 $\nu _ { k - 1 }$ 的更短的道路 $\nu _ { 0 } , u _ { 1 } , \cdots , \nu _ { k - 1 }$ ，则 $\pi ^ { \prime } \colon \nu _ { 0 } , u _ { 1 } , \cdots , \nu _ { k - 1 } ,$ $\nu _ { k }$ 是 $\nu _ { 0 }$ 到 $\nu _ { k }$ 的更短的道路，产生矛盾。 口

基于定理9.8,迪杰斯特拉于1959年给出了求唯一源点到其他各顶点的最短道路(之一）的算法，下面首先介绍该算法的思想。

记 d(v)表示从图 G 中给定顶点s到ν的最短道路的长度。对于任一顶点 u（u≠s）而言，假设与u相邻的顶点为 $v _ { 1 } , v _ { 2 } , \cdots , v _ { k }$ ，则必然有 $d(u) = \min_{1 \leq i \leq k} \left\{ d(v_i) + w(uv_i) \right\}$ 。所以每次 $d ( \nu _ { i } )$ 的（估计）值的变化都可能会影响到 $d ( u )$ 的（估计）值。

因此从时刻0开始，伴随着时间向前推移，总可以找到一个新的城市ν，洪水到达它的时间不多于到达其他城市的时间。洪水到达城市ν后，不断更新与ν相邻的顶点u的洪水最晚到达时间。

【例9.15】 仍以例9.14的图为例。

（1）时刻0时，洪水从s开始，此时顶点a的洪水最晚到达时刻更新为0+3=3，顶点c的洪水最晚到达时刻更新为 0+4=4，b、d与s不相邻，因此它们的洪水最晚到达时刻不更新，仍为∞（图9.18(a)）。

(2）时刻3时（之前局势不发生变化)，洪水由s到达a，此时顶点b的洪水最晚到达时刻更新为3+3=6、顶点c的洪水最晚到达时刻更新为 $\min\{4,3+5\}=4$ ，顶点d的更新

[page:323]

## 第9章 树及其应用

为 3+6=9（图 9.18(b))。

（3）时刻4时，洪水由s到达c，此时不必考查顶点a（即使它与c相邻)，顶点b的洪水最晚到达时刻更新为 min{6， 4+1}=5，顶点 d 的洪水最晚到达时刻更新为 min{9，4+4}=8（图9.18(c))。

(4）时刻5 时，洪水由c到达 b，顶点 d的洪水最晚到达时刻更新为 min{8,5+2}=7 (图9.18(d))。

(5）时刻7时，洪水由b到达d（图9.18(e))。至此问题得到解决（图9.18(f))。

具体来说，迪杰斯特拉算法维护两个集合 $V _ { T }$ 和 $E _ { T ^ { \prime } }$ 。 $V _ { T }$ 中为所有已确定 d(v)值的顶点，每一步都将距离 $V _ { T }$ “最近”（注意这里的“最近”与普里姆算法不同）但是不属于$V _ { T }$ 的顶点移入 $V _ { T }$ ，并更新与该点相邻的顶点的标签值，将该点距 $V _ { T }$ “最近”的边加入$E _ { T ^ { \circ } }$

算法的具体步骤如下:

迪杰斯特拉算法 Dijkstra(G)

输入:赋权简单连通图 $G { = } ( V , E )$ ，起点s

输出:G的最短道路树 $T   =   ( V _ { T } , E _ { T } )$

1 $V _ { T } \leftarrow \emptyset$ $E _ { T } \leftarrow \emptyset$ ,d(s)←0

2 对于所有 $V \in V - \{ S \} , \quad d ( V ) \leftarrow \infty$

3若 $V _ { T } { = } V ,$ 则输出 $T { = } \left( V _ { T } , E _ { T } \right)$ ，否则

3.1 在集合 $V   -   V _ { T }$ 中选取 $d ( v )$ 值最小的顶点v

(如果存在有多个满足条件的顶点v，则可任选其中之一)

3.2 若 u∈ $V _ { T }$ 满足v与u相邻且 $w \left( { u v } \right) = d \left( { v } \right) - d \left( { u } \right)$ ，则 $E _ { T } { \leftarrow } E _ { T } { \cup } \{   u V \}$

(如果存在有多个满足条件的顶点u，则可任选其中之一)

[page:324]

## 324

3.3 对于 $V   -   V _ { T }$ 中所有与v相邻的顶点 $d(u) \leftarrow \min \left\{ d(u), d(v) + w(uv) \right\}$

3.4 $V _ { T } { \leftarrow } V _ { T } { \cup } \{   V \}$

3.5 返回步骤3

【例9.16】用迪杰斯特拉算法求图9.16(b)赋权图中以s为起点的最短道路树的过程如表9.5所示（各顶点标签一列加粗文字表示顶点的标签值在本轮产生更新）。

表9.5 迪杰斯特拉算法示例<table><tr><td>图</td><td><eq>V _ { T }</eq></td><td><eq>V { - } V _ { T }</eq></td><td>顶点标签</td><td>所选顶点</td><td><eq>E _ { T }</eq></td></tr><tr><td></td><td>∅</td><td><eq>\{ s , a , b , c , d \}</eq></td><td><eq>d ( s ) { = } 0</eq>d(a)=∞d(b)=∞d(c)=∞<eq>d ( d ) = \infty</eq></td><td>S</td><td>∅</td></tr><tr><td></td><td>{s}</td><td><eq>\{ a , b , c , d \}</eq></td><td>d(a)=3d(b)=∞d(c)=4d(d)=∞</td><td>a</td><td>{sa}</td></tr><tr><td></td><td><eq>\{ s , a \}</eq></td><td><eq>\{ b , c , d \}</eq></td><td>d(b)=6d(c)=4d(d)=9</td><td>C</td><td><eq>\{ s a , s c \}</eq></td></tr><tr><td></td><td><eq>\{ s , a , c \}</eq></td><td>{b, d}</td><td>d(b)=5d(d)=8</td><td>b</td><td><eq>\{ s a , s c , b c \}</eq></td></tr><tr><td></td><td><eq>\{ s , a , b , c \}</eq></td><td>{d}</td><td>d(d)=7</td><td><eq>d</eq></td><td><eq>\{ s a , s c , b c , b d \}</eq></td></tr></table>

[page:325]

## 第9章 树及其应用

续表<table><tr><td>图</td><td><eq>V _ { T }</eq></td><td><eq>V { - } V _ { T }</eq></td><td>顶点标签</td><td>所选顶点</td><td><eq>E _ { T }</eq></td></tr><tr><td></td><td><eq>\{ s , a , b , c ,</eq><eq>d \}</eq></td><td><eq>\varnothing</eq></td><td></td><td></td><td></td></tr></table>

由迪杰斯特拉算法可以得到下面的结果（证明略）。

定理 9.9 假设图 G 是一个赋权图，ν是 G 的一个顶点，则存在 G 的一棵支撑树 T，使得在T 中ν到任意顶点 u的道路就是 G 中ν到u的最短道路（之一)。称 T为 G的最短道路树。

最后给出迪杰斯特拉算法的几点说明:

（a）该算法只适合于边权值都是正数的情况。

(b）该算法解决的是已知起始点求最短道路的问题；而已知终点求最短道路的问题与之完全相同。

（c）该算法也适用于有向图的情况，所得结果构成一棵根树（参见定义9.9）。

（d）迪杰斯特拉算法与普里姆算法非常相近，只需要把该算法的步骤3.2和步骤3.3改为

3.2 若 u∈ $V _ { T }$ 满足v与u相邻且 $w \left( u v \right) { = } d \left( u \right)$ ，则 $E _ { T } { \leftarrow } E _ { T } { \cup } \{   u v \}$ ++

3.3 对于 $V   -   V _ { T }$ 中所有与v相邻的顶点 $d ( u ) \leftarrow \operatorname* { m i n } \{ d ( u ) , w ( u v ) \}$ :

即是求最小支撑树的普里姆算法 事实上，迪杰斯特拉本人也曾经独立发现普里姆算法。

## 9.4 根树及其应用

## 9.4.1 根树的定义和基本概念

定义9.8 如果一个有向图在不考虑边的方向时是一棵树，那么该有向图称为有向树(directed tree)。

【例9.17】 图9.19中(a)、(b)、(c)均为有向树。

[page:326]

## 离散数学及应用（第2版）

而一类特殊的有向树——根树在实际问题中有着重要的应用。

定义9.9 假设T是一棵有向树，若T恰有一个入度为0的顶点ν，其余顶点的入度皆为1，则称T为根树（rooted tree），ν称作T的根（root）。根树中出度为0的顶点称为叶子（leaf)，出度大于0的顶点称为分枝点（branchpoint）。

注:只有一个孤立顶点的平凡树也认为是根树。

【例 9.18】 图 9.19(a)是根树，其中 f为根，a、c、e、h为叶子，b、d、f、g、i为分枝点；而(b)和(c)都不是根树。

例如一个单位的组织结构图就可以用根树表示，以顶点表示各级职务，边表示直属领导关系。

根树具有如下性质。

定理9.10 在根树T中，从根到任一其他顶点都存在唯一的简单道路。

定理9.10实际上也是根树的本质性刻画，具体如下。

定理9.11 如果有向图 T 中存在顶点 ν，使得从 ν到 T的任一其他顶点都存在唯一的简单道路，而且不存在从ν到ν的简单回路，则T是一棵以ν为根的根树。

定义9.10 在根树中，由根到顶点ν的道路长度称作ν的层数（level）。所有顶点的层数的最大值称为根树的高度（height）。

【例9.19】 图9.19(a)所示根树的高度为3，各顶点的层数在图9.20中标明。

习惯上，将树根画在上端，叶子画在下端，于是有向边的方向都指向下方或斜下方，同一层的顶点都画在同一水平线上。有时在不引起混淆的情况下，也可省略全部箭头。

例如瑞士著名的伯努利家族也可表示为一棵根树（图9.21)。这个家族中产生了很多艺术家和科学家，特别是17—18世纪一些著名数学家:约翰·伯努利、雅各布·伯努利、丹尼尔·伯努利、尼古拉一世·伯努利、尼古拉二世·伯努利。

定义9.11 在根树T中，若每个分枝点的出度最多为 m，则称 T为 m元树或 m 叉树(m-ary tree);如果每个分枝点的出度都等于 m，则称 T 为完全 m 叉树(complete m-ary tree);进一步，若 T的全部叶子顶点的层数都相同，则称 T 为正则 m 叉树(regular m-ary

[page:327]

## 第9章 树及其应用

tree)。

【例9.20】 图9.22(a)是3叉树，(b)是完全3叉树，(c)是正则3叉树。

定理 9.12 若 T是完全 m 叉树，其叶子数为 t，分枝点数为 i，则 $( m { - } 1 ) i { = } t { - } 1$

证明.由握手定理，所有顶点的出度之和等于入度之和。所有顶点的出度之和为m×i;除了根，每个顶点的入度为1，因此所有顶点的入度之和为t+i-1。整理即得结论。□

【例9.21】教室只有一个电源接口，但要同时使用28盏台灯，请问至少需要使用多少个4孔的接线板插座？

解.将问题表示为根树，每个接线板插座看成是它的分枝点，台灯作为叶子顶点，则问题就是求总的分枝点的数目，由定理9.12可得分枝点数为(28-1)/3=9，即至少需要9个接线板插座才能满足要求。

定理 9.13 假设完全二叉树 T 中分枝点数目为 $t (t \geqslant 1)$ ，设I表示各分枝点层数之和，J表示各叶子的层数之和，则 $J = I + 2 t$

证明. 对分枝点个数t作归纳。

（1）t=1时，T具有两个叶子，两个叶子的层数都是1，唯一的分枝点为根，层数为0。得到I=0，J=2，故J=I+2t成立。

（2）假设t=k时定理9.13成立。t=k+1时，设在完全二叉树T中，ν的两个孩子顶点$\nu _ { 1 }$ 和 $\nu _ { 2 }$ 都是叶子。则 $T     -     \nu _ { 1 }     -     \nu _ { 2 }$ 是含k个分枝点的完全二叉树，假设ν的层数为l，由归纳假设有 $J' = I' + 2t'$ ，其中 t'=t-1。比较 T和 $T   -   \nu _ { 1 }   -   \nu _ { 2 }$ 可得 $I^{\prime}=I-I,\ J^{\prime}=J-2(I+1)+I=J-I-2$ ，于是整理即得J=I+2t。 □

定理9.13中的I和J又常分别称作树的内部道路长度之和与外部道路长度之和。

定义9.12 假设u和ν是根树中两个相异顶点，

(a)如果从u到ν可达，则称 u是ν的祖先（ancestor)，ν是u的后代（descendant)。

（b）如果(u，v)是根树中的有向边，则称u是ν的父亲顶点或双亲顶点（parent)，ν是u的孩子顶点（offspring）。

（c）如果u和ν的父亲顶点相同，则称u和ν是兄弟顶点（sibling)。

【例 9.22】 在图9.23 中，f是 i的祖先，c 是 b的后代，d是e的父亲顶点，e是d的孩子顶点，a和d是兄弟顶点，b和g也是兄弟顶点，但是e和h不是兄弟顶点。

定义9.13 假设ν是根树T中一个顶点，ν及其所有后代所导出的子图 T称为 T的以ν为根的子树（subtree）。

【例9.23】图9.24中，(b)和(c)都是(a)的子树。

般来说，根树中各顶点出现的次序不重要；但是在实际应用中，常要考虑同一层

[page:328]

## 离散数学及应用（第2版）

中各顶点的次序，例如在真正的家族关系中，兄弟之间是有年龄大小次序的。于是我们引入有序树的概念。

定义9.14 如果在根树T中规定了每个分枝点的孩子顶点之间的次序，则称T为有序树（ordered tree）。

一般来讲，根树中同一层各顶点的次序为从左至右，即一个分枝点最左边的孩子顶点为第一个孩子，紧邻它右边的是第二个孩子，以此类推，最右边的孩子顶点为最后个孩子。

定义9.15 若m叉树T是有序的，则称T为m叉有序树。

定义9.16 对于二叉有序树而言，一个分枝点ν的第一个孩子顶点也称作左孩子第二个孩子顶点也称作右孩子，以ν的左孩子为根的子树称作ν的左子树，以ν的右孩子为根的子树称作ν的右子树。

定义9.17 如果 m叉有序树 T的每个顶点的孩子顶点都被规定了位置，则称 T是m叉位置树（m-ary positional tree）。

在二叉位置树中，一个分枝点可能只有左孩子而没有右孩子，也可能只有右孩子而没有左孩子。

【例9.24】图9.25(a)和(b)作为根树是相同的，但作为位置树是不同的。

二叉树的应用最为广泛，事实上任何一棵有序树都可以转换为一棵二叉位置树，其方法是:将每个顶点ν的第一个孩子作为它的左孩子，将ν的下一个兄弟作为它的右孩子。

【例9.25】图9.26(b)是(a)的二叉位置树表示。

有序树组成的森林也可以转换成二叉位置树，步骤如下:

（1）将森林中的每一棵树都表示成二叉位置树。

（2）除第一棵二叉位置树外，依次将剩下的每棵二叉位置树作为左边二叉位置树的根的右子树。

[page:329]

## 第9章 树及其应用

(d)

【例9.26】图9.27(a)是森林，(b)、(c)和(d)分别是其三个连通分枝的二叉位置树表示，(e)是该森林的二叉位置树表示。

(c)

m

(e)

图 9.27 例 9.26 用图

[page:330]

## 离散数学及应用（第2版）

## 9.4.2 二叉树的遍历

定义9.18 对一棵树的每个顶点系统地访问一次且仅一次的方式称作树的遍历(traversal)或周游。

二叉树遍历主要有如下3种方式:

（a）前序（preorder）遍历。先访问根，然后前序遍历根的左子树，最后前序遍历根的右子树。

## 前序遍历算法 preorder (node)

输入:二叉树的根 node

1 visit (node)
2 If node.left ≠ NULL then preorder (node.left)
3 If node.right ≠ NULL then preorder (node.right)

（b）中序（inorder）遍历。先中序遍历根的左子树，然后访问根，最后中序遍历根的右子树。

## 中序遍历算法 inorder (node)

输入:二叉树的根 node

1 If node.left ≠ NULL then inorder (node.left)
2 visit (node)
3 If node.right ≠ NULL then inorder (node.right)

（c）后序（postorder）遍历。先后序遍历根的左子树，然后后序遍历根的右子树，最后访问根。

## 后序遍历算法 postorder (node)

输入:二叉树的根 node

1 If node.left ≠ NULL then postorder (node.left)
2 If node.right ≠ NULL then postorder (node.right)
3 visit (node)

【例 9.27】 对于图 9.28 中所示的二元树，前序遍历的次序为 f, b, a, d, c, e, g, i, h,中序遍历的次序为 a, b, c, d, e, f, g, h, i,后序遍历的次序为 a, c, e, d, b, h, i, g, f。

在计算机科学中，二叉有序树广泛地用于组织数据和描述算法，例如可以用二叉有序树来表示运算表达式和进行求值。

【例9.28】 算术表达式((4×2)+1)-((6÷3)×2)可以用如图 9.29所示的有序树 T表示。

[page:331]

## 第9章 树及其应用

其中分枝点表示运算符，叶子表示运算数，层数的高低表示运算执行的先后顺序。

（a）前序遍历T的结果为 $- , + , \times , 4 , 2 , 1 , \times , \div , 6 , 3 , 2 ,$ ，因为运算符在运算数之前，故称此种表示法为前缀表示（prefix notation）或波兰表示（Polishnotation）（使用这个名称是为了纪念波兰逻辑学家卢卡锡维茨（Lukasiewicz))。

（b）后序遍历T的结果为 $4,2,\times,1,+,6,3,\div,2,\times,$ 一，因为运算符在运算数之后，故称此种表示法为后缀表示（postfix notation）或逆波兰表示（reverse Polish notation）。

（c）中序遍历T的结果为 $4 , \times , 2 , + , 1 , - , 6 , \div , 3 , \times , 2$ ，因为运算符在运算数之间，故称此种表示法为中缀表示（infix notation）。

【例9.29】命题公式 $( ( p \land ( \sim ( q \lor r ) ) ) \to ( ( p \lor q ) \land ( r \land s ) ) )$ 可以表示为图9.30所示的二叉有序树。

由前缀表示或后缀表示可以唯一构造表示运算式的有序树，但是由中缀表示则不行。例如图9.31(a)和(b)分别表示运算式 $( ( 4 \times 2 ) + 1 ) - ( ( 6 \div 3 ) \times 2 )  和  ( 4 \times 2 ) + ( ( 1 - 6 ) \div ( 3 \times 2 ) )$ ，但是这两棵有序树的中序遍历结果是相同的。

采用前缀表示的运算表达式可以按照如下规则求值:从左至右扫描符号串，直到出现一个运算符（例如*）紧接着两个运算数（例如a和b），此时计算 $a * b$ ，并将结果作为运算数替换这个运算符和两个运算数，重复此步骤，直至所有运算符处理完毕。一元运算和多元运算也类似地处理，遇到足够的运算数即产生运算结果并替代运算符和参与此次运算的所有运算数，迭代直至完成。

例如算术表达式 $( ( 4 { \times } 2 ) { + } 1 ) { - } ( ( 6 { \div } 3 ) { \times } 2 )$ 用有序树T表示后前序遍历的结果为 $- , + , \times , 4 , 2 ,$ 1, ×, ÷, 6,3,2，其求值过程如下:

（1）计算×,4,2的值，得到 $8 { = } 4 { \times } 2$ ，用8取代×,4,2，符号串化为-,+,8,1,×, ÷,6,3,2。

（2）计算+,8,1的值，得到9=8+1，用9取代+,8,1，符号串化为 $-,9,\times,\div,6,3,2 \text{。 }$

（3）计算÷,6,3的值，得到2=6÷3，用2取代÷,6,3，符号串化为 $-,9,\times,2,2 。$

（4）计算×,2,2的值，得到 $4 { = } 2 { \times } 2$ ，用4取代×,2,2，符号串化为-,9,4。

（5）计算-,9,4的值，得到5=9-4，用5取代-,9,4，符号串化为5，至此计算结束，5就是运算表达式的结果。

采用后缀表示的运算表达式也可以用类似的方法求值:从左至右扫描符号串，直到出现两个运算数（例如a和b）紧接着一个运算符（例如*)，此时计算 $a * b$ ，并将结果作为运算数替换这个运算符和两个运算数，重复此步骤，直至所有运算符处理完毕。

例如算术表达式 $( ( 4 { \times } 2 ) { + } 1 ) { - } ( ( 6 { \div } 3 ) { \times } 2 )$ 用根树 T表示后后序遍历 T的结果为 4,2, ×, 1, +, 6,3, ÷, 2, ×, −，其求值过程如下:

[page:332]

## 离散数学及应用（第2版）

(1）计算4,2,×的值得到8，用8取代4,2,×，符号串化为8,1,+,6, 3, ÷,2,×,−。

(2）计算8,1,+的值得到9，用9取代8,1,+，符号串化为9,6,3,÷,2,×,−。

(3）计算6,3,÷的值得到2，用2取代6,3,÷，符号串化为9,2,2,×,−。

(4）计算2,2,×的值得到4，用4取代2,2,×，符号串化为9,4,−。

（5）计算9,4,-的值得到5，用5取代9,4,-，符号串化为5，至此计算结束，5就是运算表达式的结果。

前缀表示和后缀表示在程序语言、编译理论和科学计算器设计中都有很重要的作用。

## 9.4.3 最优二叉树与赫夫曼编码

在传输数据和消息时，需要对数据或消息进行编码，二进制编码法是最常用的方式。般要求消息编码后的总长度尽可能短，以提高传输效率，减少差错可能。

【例9.30】信息“abanana”共有8个字符，由4种不同的字符组成，其中a出现4次，b出现1次，n出现2次，空格（下面用□表示）出现1次，将采用二进制方式对这4种字符进行编码。

编码方案一:用二进制编码00、01、10和11分别表示a、b、n和空格，则信息“abanana编码为0011010010001000，总长度为16。此时每个符号编码后的长度相同，因此称作定长编码方式。

编码方案二:用二进制编码1、000、01和001分别表示a、b、n和空格，则信息“a banana”编码为10010001011011，总长度为14。此时各符号编码后的长度存在差异，因此称作变长编码方式。

编码方案三:用二进制编码1、00、0和01分别表示a、b、n和空格，则信息“abanana编码为1010010101，总长度为10。虽然编码后的长度变得更短，但随之而来产生了问题:接收端如何对收到的符号串进行译码？例如接收端收到符号串001时，无法确定消息的内容应该是 n□、ba 还是 nna。

因此，在编码时必须考虑接收端不产生译码的二义性，这就需要引入前缀码的概念。

定义 9.19 设 $\alpha _ { 1 } \alpha _ { 2 } \cdots \alpha _ { n - 1 } \alpha _ { n }$ 为长度为n的符号串，称 $\alpha_{1}, \alpha_{1}\alpha_{2}, \cdots, \alpha_{1}\alpha_{2}\cdots\alpha_{n-1}$ 分别为该符号串的长度为1,2，…, n-1的前缀（prefix）。

定义 9.20 设 $A = \left\{ \beta_{1}, \beta_{2}, \cdots, \beta_{m} \right\}$ 为一个符号串集合，若对于任意的 βi, βj∈A,ij， $\beta _ { i }$ 和$\beta _ { j }$ 互不为前缀，则称A为前缀码（prefix code）或无前缀码（prefix-free code）。若 $\beta _ { i }$ 都是由0、1组成的符号串，则称A为二元前缀码。

【例9.31】 例 9.30 中编码方案二{1,000,01,001}是前缀码；而编码方案三{1,00,0, 01}则不是前缀码，因为0是00的前缀，0也是01的前缀。

显然，采用前缀码可以唯一确定接收的符号串内容。

一个编码方案也可以使用二叉位置树来表示:对于树中的分枝点，令与它左孩子(如果存在）关联的边标记为0，与右孩子（如果存在）关联的边标记为1；对每个顶点而言，其编码就是由根到该顶点的道路中各边标号依次构成的序列。

【例9.32】例9.30中3种编码方式对应的二叉位置树如图9.32(a)、(b)、(c)所示。

[page:333]

## 第9章 树及其应用

注意，在图9.32(a)和(b)中，表示符号的顶点都是叶子顶点；而在(c)中，表示符号n的顶点是分枝点，因此当接收端收到符号串001后，从二叉位置树的根开始按符号串中的符号顺序沿相应标号的边前进，却无法断定是在表示符号n的顶点中断继而译码成n还是应该继续前进。

一般地讲，在任何一个二元前缀码编码方案的二叉位置树表示中，表示符号的顶点都一定是叶子。而且，任一个二叉位置树编码后，各叶子的码构成的集合（或其子集）是一个前缀码。

假设一个二元前缀码编码方案中包括t种符号，每种符号在消息中出现的次数为 $w _ { i }$其编码长度为li，则消息的总长度为 $\sum _ { i = 1 } ^ { t } w _ { i } \cdot l _ { i }$ 。编码的目标是希望 $\sum _ { i = 1 } ^ { t } w _ { i } \cdot l _ { i }$ 的值尽可能小，达到这个最小值的二元前缀码称作最优二元前缀码。

对应到二叉位置树T上，则有以下定义。

定义 9.21 设二叉树 T 有 t 个叶子 $\nu _ { 1 } , \nu _ { 2 } , \cdots , \nu _ { t }$ ，分别赋予它们一个权值(非负实数)为 $w _ { 1 } , w _ { 2 } , \cdots , w _ { t }$ ，称 $W(T) = \sum_{i = 1}^{t} w_{i} \cdot l(v_{i})$ 为 T的权（weight)，其中 l(vi)是 $\nu _ { i }$ 的层数。

定义9.22 在所有有t 个叶子，带权 $w _ { 1 } { , } w _ { 2 } { , } \cdots { , } w _ { t }$ 的二叉树中，权最小的二叉树称为最优二叉树（optimal binary tree）。

赫夫曼（David Albert Huffman, 1925—1999）于1952年给出了最优二叉树的构造方法（即构造最优二元前缀码的方法），因此最优二叉树也称作赫夫曼树，对应的最优二元前缀码也称作赫夫曼码。该算法的基本思想是使得从根到权值大的叶子的道路较短，反之从根到权值小的叶子的道路较长。

赫夫曼算法 Huffman (w1, w2, …, wt)

输入:一组非负权值 $w _ { 1 } , w _ { 2 } , \cdots , w _ { t }$

输出:叶子顶点的权值为 $w _ { 1 } , w _ { 2 } , \cdots , w _ { t }$ 的最优二叉树的根v

1 构造t个顶点 $V_{1}, \ V_{2}, \ \cdots, \ V_{t}$ ，权值分别为 $w_{1}, \quad w_{2}, \quad \cdots, \quad w_{t}, \quad S \leftarrow \{v_{1}, \quad v_{2}, \quad \cdots, \quad v_{t}\}$ 2 若 $\mid S \mid { = } 1$ ，则输出s中唯一的元素，否则

2.1 假设 $\mathcal { U } _ { 1 }$ 和 $u _ { 2 }$ 是S中权值最小的两个顶点

2.2 构造一个新的顶点 w，令 w的左孩子是 $\mathcal { U } _ { 1 }$ ，右孩子是 $\mathcal { U } _ { 2 }$ ，权值为 $\mathcal { U } _ { 1 }$ 和 $u _ { 2 }$ 权值之和

2.3 $S \leftarrow ( S - \{ u _ { 1 } , \quad u _ { 2 } \} ) \cup \{ w \}$ ，返回步骤2

可以证明该算法的正确性，即所构造的树的确是一棵最优二叉树。

[page:334]

## 离散数学及应用（第2版）

【例9.33】信息“a banana”中a出现4次，b 出现1次，n出现 2次，空格出现1次。采用赫夫曼算法对其编码的过程如表9.6所示（顶点圆圈内的数字表示该顶点的权）。

表9.6 赫夫曼算法示例<table><tr><td>步骤</td><td>S（虚线框内顶点）</td></tr><tr><td>初始</td><td></td></tr><tr><td>第1次循环</td><td></td></tr><tr><td>第2次循环</td><td></td></tr><tr><td>第3次循环</td><td></td></tr></table>

在步骤2.1中两个权值最小的顶点的选择方法可能不唯一，因此由上述方法得到的最优二叉树不一定是唯一的（例如图9.33也是例9.30的一棵最优二叉树），编码方式也随之不同，但是构造出来的不同的树的权都是相同的。

[page:335]

## 第9章 树及其应用

## 习题9

9.1 分别画出所有不同构的3～6阶无向树。

9.2 已知无向树T中有5个叶子，其余顶点度数都是3，计算T有多少个顶点。

9.3 已知无向树T中有3个3度顶点和7个叶子，其余顶点都是4度顶点，计算T有多少条边。

9.4 已知无向树T中有2个4度顶点和3个3度顶点，其余顶点都是叶子，计算T有多少个顶点并画出两棵不同构的满足上述要求的树。

9.5 已知无向树T中有2个4度顶点，2个3度顶点，1个2度顶点，其余顶点都是叶子，计算T的顶点数、边数和叶子数。

9.6 确定下面的序列中哪些可以构成无向树的度数序列。(a)1, 1, 1, 1, 1, 1, 3, 3, 4。(b)1, 1, 2, 3, 3, 4。(c)1, 1, 2, 2, 3, 3, 4, 4. (d)1, 1, 1, 1, 2, 2, 3, 3。(e)1, 1, 1, 2, 2, 2, 2, 3。

9.7 给出所有以1,1,1,1,2,2,4 为度数序列的非同构的无向树。

9.8 证明所有的醇 $( \mathrm { a l c o h o l s } ) \mathrm { C } _ { n } \mathrm { H } _ { 2 n + 1 } \mathrm { O H }$ 是树分子结构，其中C、O、H的度分别是4、2、1。

9.9 证明:恰有两个叶子的无向树是一条道路。

9.10 证明:无向树都是二部图。

9.11 n满足什么条件时，完全图 $K _ { n }$ 是无向树？

9.12 假设T是树，证明:T中最长道路的起点和终点必然都是T的叶子。

9.13 若无向树 T中度数最大的顶点度数为 k，证明:T至少有k个叶子。

9.14 设 T是 k+1阶无向树，k≥1，G 是无向简单图，已知 $\delta ( G ) \geq k$ ，证明:G中存在与T同构的子图。

9.15 假设(m, n)-图 G 是一个有 k（k≥2）个连通分支的森林，试建立 m与 n 值之间的关系，并计算要添加多少条边才能使所得之图为无向树。

9.16令 $\nu _ { 1 } , \nu _ { 2 } , \cdots , \nu _ { n }$ 是给定的点， $d _ { 1 } , d _ { 2 } , \cdots , d _ { n }$ 是给定的正整数，满足 $\sum_{i = 1}^{n}d_{i} = 2(n - 1)$证明:满足 $\deg(v_{i}) = d_{i} \quad (i = 1, 2, \cdots, n)$ 的树的数目是 $\frac{(n - 2)!}{(d_1 - 1)! \cdots (d_n - 1)!}$

9.17 若可以用整数1,2,…, n来标记带有n个顶点的无向树的顶点，使得相邻顶点的标记之差的绝对值全都是不同的，则称这棵树为优美的。证明:图9.34中的树都是优美的。

9.18 毛虫图是含有一条简单通路的树，使得不包含在这条通路里的每个顶点都与这条通路里的一个顶点相邻。

[page:336]

## 离散数学及应用（第2版）

（a）图9.34中，哪些是毛虫图？

（b）带6个顶点的互不同构的毛虫图有多少种？

（c）证明或反驳:其边形成一条简单道路的所有树都是优美的。

(提示:考虑序列 1, n, 2, n−1, 3, n-2, …。)

（d）证明:所有的毛虫图都是二部图。

（e）证明:所有的毛虫图都是优美的。

(提示:考虑图9.35。)

9.19 无向树中顶点的离心度（偏心距）是从这个顶点开始的最长的简单通路的长度。当树T的顶点ν的偏心距最小时，则称ν为树T的（一个）中心。

（a）求图9.36 中顶点 a、g、l的偏心距。

（b）求图9.36中所给的树的（所有）中心。

（c）证明:一棵树只有一个中心或两个相邻的中心。

9.20 10名学生参加一次考试，共有10道判断题。已知没有两个学生做对的题目完全相同。证明在这10道题中可以找到一道题，将这道题取消后，每两个学生做对的题目仍然不会完全相同。

(提示:若删除第i题后学生甲和乙无法区分，则在顶点甲和顶点乙之间连标号i

[page:337]

## 第9章 树及其应用

的边。证明结果图中存在回路。)

9.21 图9.37 中有多少个不同构的支撑树？

9.22 画出图9.38的所有不同构的支撑树。

9.23 $K_{n} (1 \leqslant n \leqslant 7)$ 各有多少棵非同构的支撑树？

9.24 设G是无向连通图，证明:如果G的支撑树是唯一的，那么G本身就是树。

9.25 设 G 是无向连通图，e 是 G 的边，证明:e 是桥当且仅当e 在 G 的每个支撑树中出现。

9.26 设 G 是无向连通图，e 是 G 的边，如果 e不属于 G 的任一个支撑树，那么 e应具有什么性质?

9.27 设 G 是无向连通图，e是 G 的边，e既不是自环也不是桥，证明:存在 G 的某个支撑树包含e，也存在 G的某个支撑树不包含e。

9.28 用普里姆算法求图9.39所示赋权图的最小支撑树（从顶点 a开始）。

9.29 用克鲁斯卡尔算法求图9.39所示赋权图的最小支撑树。

[page:338]

## 离散数学及应用（第2版）

9.30用破圈法求图9.39所示赋权图的最小支撑树。

9.31 用博鲁夫卡算法求图9.39所示赋权图的最小支撑树。

9.32 图9.40 有多少棵最小支撑树？

9.33 如果要求计算赋权图中的最大支撑树，应该怎么处理？

9.34 如果要求计算赋权图中必须包含某条边的最小支撑树，应该怎么处理？

9.35 普里姆算法是否能在非连通图中寻找最小支撑森林？如果不能，需要怎样修改算法？

9.36 破圈法是否能在非连通图中寻找最小支撑森林？

9.37 博鲁夫卡算法是否可以在非连通图中寻找最小支撑森林？

9.38 假设(G, W)为赋权图，那么 G的最短道路树是否一定是唯一的？

9.39 求图9.41 以 s 为起点的最短道路树。

9.40 求图9.42 中以 a为起点的最短道路树。

9.41 找到图 9.43 中从 a 到 k 且经过 e的最短道路。

9.42 在图9.44所示的赋权图中寻找给定每对顶点之间的最短道路长度和最短道路。

[page:339]

## 第9章 树及其应用

9.43 给出一个例子说明:如果图中存在负数权值的边，则迪杰斯特拉算法将可能给出不正确的结果。

9.44 某工厂使用一台设备，每年年初要决定是继续使用还是购买新的（购买新设备时将旧设备按残值卖出）。预计该设备第1年的价格为11万元，以后每年涨1万元。使用的第1年、第2年……第5年的维修费分别为5、6、8、11、18万元。使用1年后的残值为4万元，之后每使用1年残值减少1万元。试制订购买维修该设备的5年计划，使总支出最小。

9.45 画出所有非同构的 $n (1 \leqslant n \leqslant 5)$ 阶根树。

9.46 给出所有具有3个顶点的非同构的根树和非同构的有序树。

9.47 证明定理 9.10。

9.48 证明定理9.11。

9.49 画出带有84个树叶而且高度为3的正则m叉树，其中m是正整数；或者证明这样树不存在。

9.50 假设 T是完全 m叉树，其叶子数为 l，分枝点数为 t，证明:T的边数为 mt。

9.51 假设 T是完全二叉树，其叶子数为l，证明:T的边数为 2(l-1)。

9.52 证明:一棵完全二叉树的顶点数为奇数。

9.53 假设 T是完全 m叉树，其叶子数为l，高度为 h，证明: $m+(m-1)(h-1)\leqslant l\leqslant m^{h}$

9.54 证明:高度为 h的 $m (m \geqslant 2)$ 叉树至多有 $( m ^ { h + 1 } { - } 1 ) / ( m { - } 1 )$ 个顶点。

9.55 假设有一台计算机，它有一条加法指令，可计算3个数的和。如果要计算9个数$x _ { 1 } , x _ { 2 } , x _ { 3 } , x _ { 4 } , x _ { 5 } , x _ { 6 } , x _ { 7 } , x _ { 8 } , x _ { 9 }$ 之和，则至少要执行几次加法指令？

9.56假设如果共有n名选手参加一次比赛，赛制是淘汰制，每局不超过m个选手参加，决出一名晋级。要决出冠军，至少要安排多少场比赛？

9.57 假定某人寄出一封连环信，要求收到信的每个人再把它寄给另外4个人。有一些人这样做了，但是其他人则没有寄出信，且假设没有人收到超过1封信。若读过信但是不寄出的人数超过100个后，连环信就终止了，则包括第1个人在内，多少人看过信？多少人寄出过信?

9.58 有多少个高为2的不同构的二叉位置树？

9.59 有多少个高为2的不同构的三叉位置树？

9.60 将图9.45所示的有序树表示为二叉位置树。

[page:340]

## 离散数学及应用（第2版）

9.61 将图9.46所示的森林表示为二叉位置树。

9.62 图9.47 是有序树 T的二叉位置树表示，请画出T。

9.63 图9.48是有序树组成的森林的二叉位置树表示，请画出该森林。

9.64 给出一棵二叉位置树，使得其前序遍历结果是 b, a, t, i, s, t, h, e, b, e, s, t。

9.65 给出一棵二叉位置树，使得其中序遍历结果是 b, a, t, i, s, t, h, e, b, e, s, t。

9.66 给出一棵二叉位置树，使得其后序遍历结果是 b, a, t, i, s, t, h, e, b, e, s, t。

9.67 给出公式 $( ( p \land q ) \Rightarrow ( \sim ( r \lor s ) ) ) \lor ( ( \sim s ) \Leftrightarrow ( \sim p ) )$ 的二叉位置树表示，并计算其前序遍历、中序遍历、后序遍历的结果。

9.68 写出表达式 $( ( a + ( b \times c ) ) \times d - e ) \div ( f + g ) + ( h \times i ) \times j$ 的前缀、中缀、后缀表示。

9.69 写出运算表达式 $( ( 8 \div 2 ) - 1 ) + ( 2 \times ( 6 - 3 ) )$ 的前缀表示，并由此计算运算表达式的值。

9.70 写出运算表达式((8÷2)-1)+(2×(6-3))的后缀表示，并由此计算运算表达式的值。

9.71 已知一个运算表达式的前缀表示为-, +,4,5, ×, ÷,2,2,3,请给出该运算表达式的二叉位置树表示。

9.72 已知一个运算表达式的后缀表示为 $2 , 1 , + , 6 , 3 , \div , \times , 4 , - ,$ 请给出该运算表达式的二叉位置树表示。

9.73 请给出中缀表示为 4, ÷,1, ×, 2,−, 3, +, 5 的两棵不同构的二叉位置树表示。

[page:341]

## 第9章 树及其应用

9.74 以下集合中，哪些是前缀码？

(a) {0, 11, 101, 1111}。

(b) {1, 01, 010, 101} 。

(c) {a, b, c, ac, bca} 。

(d) {ab, ac, b, caa, cac} 。

9.75 请画出二元前缀码{000,001,01,11,10}对应的二叉位置树。

9.76 根据图 9.49 所示的二叉位置树，写出各字母的编码，并对字符串 unsuccess 进行编码。

9.77 给定一组权1,3,4,5,5,6,9，求对应的最优二叉树。

9.78 给定权1,4,9,16,25,36,49,64,81,100，构造一个最优二叉树，并求树的权以及由此产生的前缀码。

9.79 给定权2,3,5,7,11,13,17,19,23，构造一个最优二叉树，并求树的权以及由此产生的前缀码。

9.80 给出“bat is the best”的赫夫曼编码方法（包括空格)，并计算编码后的码长。

9.81 给出“a fat cat eats at left”的赫夫曼编码方法（包括空格)，并计算编码后的码长。

9.82 给出“1arge cat at large”的赫夫曼编码方法（包括空格)，并计算编码后的码长。

9.83已知在数据中只出现5种符号A、B、C、D、E，出现的频率分别是10%、15%、30%、16%、29%，设计一种二进制编码方案，使得数据长度最少并且能正确解码。

9.84已知在数据中只出现6种字母A、B、C、D、E、F，出现的频率分别是30%、25%、20%、10%、10%、5%，构造一个最优二元前缀码，假设数据长度为1000个字母，编码后的数据共用多少个二进制位？

9.85 有一个游戏，起初有N堆石子，每次将两个大小分别为m和n的石子合并为一堆，得到m+n分，目的是最终合成一堆。如何安排合并的次序才能使得总得分最小？如何安排合并的次序才能使得总得分最大？

[page:342]

# 第10章

## 形式语言、自动机与正则表达式

形式语言是一种由标记和符号按某些规则组成的形式化系统。

20世纪 50年代，语言学家乔姆斯基（Avram Noam Chomsky）将语言形式化地定义为由一个字母表的字母组成的一些串的集合，在字母表上按照一定的规则定义文法、产生语言，并根据产生语言的文法的产生式的不同特点，将文法和对应产生的语言分为三大类。

从识别语言的角度来看，还有另一种方式来描述语言:按照某种识别规则构造自动机，通过自动机能够识别的所有字符串来定义语言。

于是形式语言主要有两种不同的描述方式:文法产生语言和自动机识别语言，将分别在10.2节和10.4节中进行介绍，10.5节中介绍这两种方式的等价性及相互转换方法。

20世纪语言学还有其他一些重要事件。20世纪50年代末至60年代初，巴科斯和诺尔使用巴科斯-诺尔范式(Backus-NaurForm,BNF)成功地对高级程序设计语言ALGOL60的词法和语法规则进行了形式化的描述。程序语言ALGOL60问世不久，人们就发现它有歧义性，而后证明了上下文无关文法是否有歧义性是不可判定的（也就是说不存在个算法能够判断一个上下文无关文法是不是歧义的)。同时期，数学家克林(StephenCole Kleene）引入了正则集合及正则表达式的概念，并提出了克林定理证明了正则表达式和有限状态自动机之间的等价性；等等。

有限自动机和某些种类的形式文法已经成为计算机科学的理论基础，被用于一些重要软件的设计和构造，如某些编译器部件。实际上，形式语言与自动机理论的应用范围已经扩展到生物工程、自动控制系统、图像处理与模式识别等许多领域。

## 10.1 语言

《韦氏大词典》①对“语言（language)”的解释之一是“词汇、发音及其组合方法，以在一个社会群体中所使用和理解（the words, their pronunciation， and the methods of combining them used and understood by a community)。”这通常称为自然语言(nature language)。

而《韦氏大词典》的另一个解释是“一种由标记和符号组成的形式化系统，包括该系统所容许的表达式的形成和转换的规则（a formal system of signs and symbols including

[page:343]

## 第10章 形式语言、自动机与正则表达式

rules for the formation and transformation of admissible expressions)。”这通常称为形式语言(formal language)，常用于建立自然语言模型以及与计算机通信。

自然语言的规则非常复杂且难于完全特征化，而形式语言可以通过一些确定的规则构造。

首先回顾1.1.3节中曾引入的一些基本概念。

定义10.1 字母表(alphabet)是指一个有限的非空符号集Σ，Σ 中的元素称为字母。

定义10.2 Σ为所有由Σ中元素生成的有限长度序列全体， $\boldsymbol { \varSigma } ^ { * }$ 中元素称为Σ上的词（word）或串（string）（在不引起混淆时，也可忽略序列各项间的逗号），即串是有限长度的符号序列。

定义 10.3 $\boldsymbol { \Sigma } ^ { * }$ 中的空序列称作空串（empty string)，习惯上使用 λ或ε表示，用Λ表示集合{λ}。

定义10.4 串w所含字母个数（即序列的项数）称作w的长度（length），记作|w|。

可以这样来理解:字母表是有限的符号集，而串是有限长度的符号序列。

【例10.1】 常用的字母表有

$\varSigma { = } \left\{ 0 , 1 \right\}$ ，二进制字母表。

$\varSigma = \{ \mathrm{a}, \mathrm{b}, \cdots, z \}$ ，所有小写字母的集合。

所有ASCI字符的集合，或者所有可打印的ASCII字符的集合。

【例10.2】 01101 是二进制字母表 $\scriptstyle \varSigma = \{ 0 ,   1 \}$ 上的一个串，长度为5；111是这个字母表上的另一个串，长度为3；空串λ的长度为 $0 ,$

定义 10.5 假设 $w_{1}=s_{1}s_{2}s_{3}\cdots s_{n}$ 和 $w_{2}=t_{1}t_{2}t_{3}\cdots t_{m}$ 都是字母表Σ上的串，则 $w _ { 1 }$ 和 $w _ { 2 }$ 的连接定义为 $s _ { 1 } s _ { 2 } s _ { 3 } { \cdots } s _ { n } t _ { 1 } t _ { 2 } t _ { 3 } { \cdots } t _ { m }$ ，记作 ${ \mathcal { W } } _ { 1 } { \circ } { \mathcal { W } } _ { 2 }$ 或 $\mathcal { W } _ { 1 } \mathcal { W } _ { 2 } \circ$ 。称作 $\boldsymbol { \varSigma } ^ { * }$ 上的连接运算。

注:假设Σ是字母表， $\scriptstyle { \boldsymbol { w } } \in { \boldsymbol { \varSigma } } ^ { * }$ ，则 $w \circ \lambda = \lambda \circ w = w \circ$

【例10.3】假设 $\Sigma = \{ a , b , \cdots , z \}$ $\mathrm { { \sf p o s t } ,   \mathrm { { o f f i c e } \in \Sigma ^ { * } } }$ ，则 post°office=postoffice。

定义 10.6 假设 w是字母表Σ上的串，则可以定义 w的 n 次幂 $w ^ { n }$ 为

$$w^{0}=\lambda \atop w^{n}=w^{n-1}\circ w, n \geqslant 1$$

【例10.4】

(a) $a ^ { 3 } { = } a a a$ 2 $(ab)^{2}a  =  ababa.$ 0

(b) $\{ 0 ^ { n } 1 ^ { n } \mid n \geqslant 1 \} = \{ 0 1 , 0 0 1 1 , 0 0 0 1 1 1 , \ldots \}$ 0

定义10.7 假设x、y、z是字母表Σ上的串，且 x=yz。称y是x的前缀（prefix)，如果 $z \notin \lambda ,$ 则称 y 是 x 的真前缀（proper prefix)；称 z 是 x的后缀（suffix)，如果 $y \not \in \lambda$则称 z 是 x 的真后缀（proper suffix)。

定义10.8 假设x、y是字母表Σ上的串，且存在字母表Σ上的串z, w使得 $x = z y w$ ，则称 $y$ 是x的子串（substring)。简言之，x的子串就是由x删去某个前缀后再删去某个后缀得到的结果。

【例 10.5】串abcde的前缀是λ、a、ab、abc、abcd、abcde，真前缀是λ、a、ab、abc、abcd；后缀是λ、e、de、cde、bcde、abcde，真后缀是λ、e、de、cde、bcde。对于任意字符串x，x的前缀有|x|+1个，真前缀有|x个；x的后缀有|x|+1个，真后缀有|x个。

[page:344]

## 344

【例 10.6】串 abc的所有子串是λ、a、b、c、ab、bc、abc。

## 【例10.7】

(a）对于任意非空字符串 x，λ是x的前缀，且是真前缀；λ是x的后缀，且是真后缀；λ是x的子串。

(b）对于任何字符串x，x是自身的前缀，但不是真前缀；x是自身的后缀，但不是真后缀；x是自身的子串。

(c）对于任何字符串 x，x的任意前缀y有唯一的一个后缀 z与之对应，使得 x=yz，反之亦然。

容易看出串在连接运算下形成的代数结构，见以下定理。

定理10.1 假设Σ是一个字母表，则(Σ*,°)构成一个半群。

语言是由符合语法的句子组成的集合。下面形式化地定义“语言”。

定义10.9 设Σ是有限字母表，Σ*的任一个子集L都称为Σ上的一个语言(language)。语言L的元素称作句子。

注:

（a）Σ上语言中的串不必包含2中的所有符号。

（b）语言可分为有穷语言与无穷语言。

## 【例10.8】

（a）对于任意字母表Σ， $\boldsymbol { \Sigma } ^ { * }$ 都是一个语言。

（b）空语言∅是任意字母表上的语言。

(c）仅由空串组成的集合{λ}也是任意字母表上的语言（注意，∅≠{λ}，前者没有串，而后者有一个串)。

（d）设Σ={0，1}，由相同个数的 0和 1 组成的串的集合{λ，01，10,0011，0101, 1001,…}构成一个语言。

(e）设Σ={0，1}，n是一个正整数，由 n个 0 后面紧跟n个1 组成的串的集合{01, 0011,000111，…}构成一个语言。

(f) 设Σ={0,1}，其值为素数的二进制数的集合{10,11,101, 111,1011, …}构成一个语言。

(g) $\{ 0 ^ { i } 1 ^ { j } | 0 \leqslant i \leqslant j \}$ ，此语言由若干个0（允许一个也没有）后面跟至少这么多个1的串组成。

(h) $\left\{ 0 ^ { n } 1 ^ { m } 0 ^ { k } | n , m , k \geqslant 1 \right\} , \left\{ 0 ^ { n } 1 ^ { m } 0 ^ { k } | n , m , k \geqslant 0 \right\}$ 都是字母表{0,1}上的语言。

定义 10.10 设 $L _ { 1 }$ 和 $L _ { 2 }$ 是有限字母表Σ上的两个语言，则可定义 $L _ { 1 }$ 与 $L _ { 2 }$ 的连接 $L _ { 1 } { \circ } L _ { 2 }$为

$$L_{1} \circ L_{2} = \left\{ \alpha \beta \mid \alpha \in L_{1}, \beta \in L_{2} \right\}$$

$L _ { 1 } \circ L _ { 2 }$ 也可简写作 $L _ { 1 } L _ { 2 } { _ { \circ } }$

通常来讲 $L _ { 1 } L _ { 2 } { \neq } L _ { 2 } L _ { 1 }$

【例 10.9】 假设 A={a, ab}，B={b, bb}，则 $AB = \{ ab, abb, abbb \}$ $BA = \{ba,ba,bba\}$ $b b a b \}$

语言的连接运算具有如下性质。

[page:345]

## 第10章 形式语言、自动机与正则表达式

定理10.2 设A、B、C、D是有限字母表Σ上的语言， $\varnothing$ 为空集， $A = \{ \lambda \}$ ，则有

(a) $\varnothing A = A \varnothing = A$

(b) $\lambda A = A A = A \circ$

(c) $(AB)C = A(BC)$

(d) $(A \cap B)C \subseteq AC \cap BC$

(e) $A(B \cap C) \subseteq AB \cap AC$

(f) $(A \cup B)C = AC \cup BC$

(g) $A(B \cup C) = AB \cup AC$

（h）若A⊂B且 $C { \subseteq } D ,$ ，则 $AC \subseteq BD$

假设Σ是一个字母表，则 $\bar { P } ( \boldsymbol { \varSigma } ^ { * } )$ 即为Σ上所有语言的全体，它在语言的连接运算下也形成特定的代数结构。

定理10.3 假设Σ是一个字母表，则 $( \boldsymbol { \mathcal { P } } ( \boldsymbol { \varSigma } ^ { * } ) , \boldsymbol { \circ } )$ 构成一个半群。

定义 10.11 设 L 是有限字母表Σ上的语言，定义 L 的 n 次幂 $L ^ { n }$ 为

$$\begin{aligned} &L^{0}=\varLambda \\&L^{n}=L^{n-1}\circ L,\ n\geqslant 1\\ \end{aligned}$$

定义10.12 设L是有限字母表Σ上的语言，定义L的正闭包 $L ^ { + }$ 为 $L ^ { + } { = } L ^ { 1 } \cup L ^ { 2 } \cup L ^ { 3 } \cup \cdots$定义L的星闭包 $L ^ { * }$ 为 $L^{*} = \Lambda \cup L^{+} = L^{0} \cup L^{1} \cup L^{2} \cup \cdots$ 0

【例10.10】假设 $A = \{ 0 , 1 \}$ ，则

(a) $A ^ { 0 } = \{ \lambda \}$ ，即长度为0的0和1组成的串的集合。

(b) $A ^ { 1 } { = } \{ 0 , 1 \}$ ，即所有长度为1的0和1组成的串的集合。

(c) $A^{2}=A^{1} \circ A=\{00,01,10,11\}$ ，即所有长度为2的0和1组成的串的集合。

（d）A3=A2°A={000,001,010,011,100,101,110,111}，即所有长度为3的0和1组成的串的集合。

(e) $A^{+}=A^{1}\cup A^{2}\cup A^{3}\cup\cdots$ {所有0和1组成的有限长度的非空串}。

(f) $A^{*} = A \cup A^{+} = \{$ 所有0和1组成的有限长度的串}。

【例10.11】 $\lambda ^ { * } = \lambda , \lambda ^ { + } = \lambda .$

【例 10.12】 {00, 11}+、{010, 101}*、{0} {00, 11}*{1}、 ${ \{ 0 , 1 \} } ^ { * } \{ 1 1 1 \} { \{ 0 , 1 \} } ^ { * }$ 都是字母表{0,1}上的语言。

语言的闭包具有如下性质。

定理10.4 设A和B是有限字母表Σ上的语言，则有

(a) $\boldsymbol { \mathscr { A } } ^ { n } { \subseteq } \boldsymbol { \mathscr { A } } ^ { * }$ ，对所有 $n   \geq   0$ 0

(b) $\boldsymbol { \mathscr { A } } ^ { n } { \subseteq } \boldsymbol { \mathscr { A } } ^ { + }$ ，对所有 $n   \geq   1$ O

$A \subseteq A B ^ { * } , A \subseteq B ^ { * } A \text { 。 }$

（d）若 $A { \subseteq } B ,$ ，则 $\boldsymbol { \mathscr { A } } ^ { * } { \subseteq } \boldsymbol { \mathscr { B } } ^ { * }$ ，且 $\boldsymbol { \mathscr { A } } ^ { + } { \subseteq } \boldsymbol { \mathscr { B } } ^ { + }$

(e) $\lambda { \in } A$ 当且仅当 $\boldsymbol { \mathscr { A } } ^ { + } { = } \boldsymbol { \mathscr { A } } ^ { * }$ 0

(f) $A A ^ { * } = A ^ { * } A = A ^ { * }$

(g) $( \boldsymbol{A}^{*} )^{*} = \boldsymbol{A}^{*} \boldsymbol{A}^{*} = \boldsymbol{A}^{*}$ 0

(h) $( \boldsymbol{A}^{*} )^{+} = ( \boldsymbol{A}^{+} )^{*} = \boldsymbol{A}^{*}$ 0

[page:346]

## 346

(i) $( \boldsymbol{A}^{*} \boldsymbol{B}^{*} )^{*} = ( \boldsymbol{A} \cup \boldsymbol{B} )^{*} = ( \boldsymbol{A}^{*} \cup \boldsymbol{B}^{*} )^{*}$ 0

证明.仅给出(i)的证明，其余部分作为习题。

(1)若 $x { \in } ( { \boldsymbol { \mathcal { A } } } ^ { * } { \boldsymbol { B } } ^ { * } ) ^ { * }$ ，则存在非负整数k使得 $x { = } ( y _ { 1 } z _ { 1 } ) ( y _ { 2 } z _ { 2 } ) \cdots ( y _ { k } z _ { k } )$ ，其中 $y _ { i } { \in } { \boldsymbol { A } } ^ { * } , ~ z _ { i } { \in } { \boldsymbol { B } } ^ { * }$ $1 { \leqslant } i { \leqslant } k .$ o

由A⊆A∪B、B⊆A∪B和(d)有 $y_{i} \in A^{*} \subseteq \left( A \cup B \right)^{*}, \ z_{i} \in B^{*} \subseteq \left( A \cup B \right)^{*}$ ，由(g)有 $y _ { i } z _ { i } { \in ( A \cup B ) } ^ { * }$ $(A \cup B)^{*} = (A \cup B)^{*}$ ，由(g)有 $x \in \left( \left( A \cup B \right) ^ { * } \right) ^ { * } = \left( A \cup B \right) ^ { * }$ ，因此 $( { \boldsymbol { A } } ^ { * } { \boldsymbol { B } } ^ { * } ) ^ { * } { \subseteq } ( { \boldsymbol { A } } \cup { \boldsymbol { B } } ) ^ { * }$

(2）由 $A { \subseteq } A ^ { ^ { + } }$ 和 $\boldsymbol { B } { \subseteq } \boldsymbol { B } ^ { * }$ 有 $(A \cup B) \subseteq (A^{*} \cup B^{*})$ ，因此由(d)有 $(A \cup B)^{*} \subseteq (A^{*} \cup B^{*})^{*}$

(3）若 $x { \in } ( { \boldsymbol { A } } ^ { * } \cup { \boldsymbol { B } } ^ { * } ) ^ { * }$ ，则存在非负整数k使得 $x = y_{1}y_{2}\cdots y_{k},$ 其中 $y _ { i } { \in } { \boldsymbol { A } } ^ { * } \cup { \boldsymbol { B } } ^ { * }$ $1 \leqslant i \leqslant k_{0}$如果 $y _ { i } { \in } { \boldsymbol { A } } ^ { \ast }$ ，则 $y_{i} = y_{i} \lambda \in A^{*} B^{*}$ ；如果 $y _ { i } { \in } { \boldsymbol { B } } ^ { * }$ ，则 $y_{i}=\lambda y_{i}\in A^{*}B^{*}$ ；因此总有 $y _ { i } { \in } { \boldsymbol { A } } ^ { * } { \boldsymbol { B } } ^ { * }$ ，故而$x { \in } ( { \boldsymbol { A } } ^ { * } { \boldsymbol { B } } ^ { * } ) ^ { * }$ 。所以 $( { \boldsymbol { A } } \cup { \boldsymbol { B } } ) ^ { * } { \subseteq } ( { \boldsymbol { A } } ^ { * } { \boldsymbol { B } } ^ { * } ) ^ { * }$ o □

## 10.2 文法

文法是定义和阐明（一类）语言的一种规则化方式，也可以说是以有穷的集合刻画无穷的集合的一个工具。美国语言学家乔姆斯基在1957年提出了短语结构文法。

定义 10.13 —个短语结构文法（phrase structure grammar）（或简称文法）G 包括

（1）一个有限集合N，其元素称为非终结符号（non-terminal symbol)。

（2）一个有限集合T，其元素称为终结符号（terminal symbol)，其中 $N \cap T = \varnothing$

(3) $\{ ( N \cup T ) ^ { * } { - } T ^ { * } \} \times ( N \cup T ) ^ { * }$ 的一个有限子集P，称为产生式的集合。

(4)一个开始符号 $\sigma { \in } N _ { \circ }$

记作 G=(N, T, P, σ)。

产生式 $[ ( \alpha , \beta ) { \in } P ]$ 通常写为 $$\alpha { \longrightarrow } \beta \text { 。 }$$ 在产生式 $\alpha { \longrightarrow } \beta$ 中， $\alpha { \in } { ( N \cup T ) } ^ { * } { - } T ^ { * }$ ，于是α至少包括一个非终结符号，而β能够由非终结符号和终结符号的任意组合构成。α称作这个产生式的左部， $\beta$ 称作这个产生式的右部。

定义 10.14 设 $G { = } ( N , T , P , \sigma )$ 是一个文法。如果 $\alpha { \longrightarrow } \beta$ 是一个产生式且 $x \alpha y { \in } { ( N \cup T ) } ^ { * }$这里 $x , y { \in } { ( N \cup T ) } ^ { * }$ ,则称xβy可直接从xαy推导，并写成 $x \alpha y { \Rightarrow } x \beta y$ 。如果对于 $\alpha _ { i } { \in } { ( N \cup T ) } ^ { * } ( i { = } 1$ $2 , \cdots , n { - } 1 )$ ，都有 $\alpha_{i + 1}(i = 1,2,\cdots,n - 1)$ 可直接从 $\alpha _ { i }$ 推导，则称 $\alpha _ { n }$ 可从 $\pmb { \alpha _ { 1 } }$ 推导，并写成 $\alpha _ { 1 } { \Rightarrow } \alpha _ { n } .$称 $\alpha_{1} \Rightarrow \alpha_{2} \Rightarrow \cdots \Rightarrow \alpha_{n}   是   \alpha_{n}   (从   \alpha_{1}  )$ 的推导（derivation）。

约定:(N∪T)*的任意元素都是从自身可推导的。称 $w { \in } { \boldsymbol { T } } ^ { * }$ 是文法正确的，当且仅当$\sigma { \Longrightarrow } w  。$

容易看出，⇒是 $\left( N \cup T \right) ^ { * }$ 上的关系，而且具有传递性。

【例 10.13】 设 N={sentence, noun, verb, adverb}， T={BAT, CAT, TABLE, EAT, RUN, SLEEP, WELL, FAST, HORRIBLY}，P 中元素为

sentence → noun verb adverb,
noun → BAT,
noun → CAT,
noun → TABLE,
verb → EAT,

[page:347]

## 第10章 形式语言、自动机与正则表达式

verb → RUN,
verb → SLEEP,
adverb → WELL
adverb → FAST,
adverb → HORRIBLY,
σ =sentence。

则 sentence ⇒ noun verb adverb ⇒ BAT verb adverb ⇒ BAT EAT adverb ⇒BAT EAT FAST，故“BATEAT FAST”是文法正确的；而“WELLRUNCAT”不是文法正确的。

但是注意“文法正确”和“语义正确”是不同的，例如“TABLESLEEPHORRIBLY”是文法正确的，但不存在正常的语义。

定义10.15 由G生成的语言是指从σ可推导的 T上的所有字符串组成的集合，记作L(G)。

## 【例10.14】

(a) 文法 G=({σ}, {x}, {σ→xσ，σ→x},σ)生成的语言是 $L(G)=\left\{x^{n}|n\geqslant1\right\}$

(b) 文法 G=({σ}, {x}, {σ→xσ，σ→λ},σ)生成的语言是 $L(G)=\left\{x^{n}|n\geqslant0\right\}$

(c) 文法 G=({σ}， {x}, {σ→xσy, σ→xy}, σ)生成的语言是 $L(G)=\left\{x^{n}y^{n}\mid n\geqslant1\right\}$

(d) 文法 G=({σ}, {x}, {σ→xσy, σ→λ}, σ)生成的语言是 $L(G)=\left\{x^{n}y^{n}\mid n\geqslant0\right\}$

## 【例10.15】

(a)设 $N = \{ \sigma , A \} , \quad T = \{ a , b , c \} , \quad P = \{ \sigma \rightarrow a \sigma b , \quad \sigma b \rightarrow b A , \quad a b A \rightarrow c \}$ ，则文法 $G { = } ( N , T , P ,$ σ)生成的语言是 $\{ a ^ { n } c b ^ { n } | n \geqslant 0 \}$

(b) 设 N={σ, A}，T={a, b, c}，P={σ→aA，A→bbA，A→λ}，则文法 G=(N, T, P, σ)生成的语言是 $\{ a ( b b ) ^ { n } | n \geqslant 0 \}$

定义 10.16 如果 L(G)=L(G')，那么称文法 G 和 G'等价。

事实上，不同的短语结构文法可以产生相同的语言（例如例10.18）。

可以根据文法的产生规则的类型将文法细分。

定义 10.17 设 G=(N, T, P, σ)是一个文法并设 λ 是空串。

产生式的两端无任何限制的为0型文法，产生0型语言或称递归可数语言。

如果每个产生式形式为 $\alpha { \cal A } \beta { \rightarrow } \alpha \delta \beta ,$ 其中 $\alpha ,   \beta   \in   \left( N   \cup   T \right) ^ { * }   ,     \mathcal { A }   \in   N ,     \delta   \in   \left( N   \cup   T \right) ^ { * }   -   \{ \lambda \}$ ，则称G为上下文相关（1型）文法（content sensitive grammar）。

如果每个产生式形式为A→δ，其中 $A { \in } N , \delta { \in } { ( N \cup T ) } ^ { * }$ ，则称G为上下文无关（2型）文法（content-free grammar）。

如果每个产生式形式为 A→a 或 A→aB 或 A→λ，其中 $A, B \in N, a \in T$ ，则称G为正则（3型）文法（regular grammar）。

上下文相关（1型）文法中，产生式 $\alpha { 4 \beta } { \rightarrow } \alpha { \delta \beta }$ 表明只有当非终止符A的前后为α、β的条件下（即所谓“上下文”)，A才可以改写成δ。而在上下文无关文法中，产生式 $A { \longrightarrow } \delta$表明任何时候都可以将A替换为δ。

正则文法的产生式非常简单，右部为一个终结符号，或者为一个终结符号后跟一个非终结符号，或者用空串替换一个非终结符号。

[page:348]

## 348

定义10.18如果存在一个上下文有关（上下文无关/正则）文法G，使得 $L { = } L ( G )$那么称语言L是上下文有关（上下文无关/正则）的。

从0型文法到3型文法，在产生式规则上的限制是逐步增加的，它们所生成的语言有包含关系，例如，0型文法所产生的语言真包含上下文相关语言，不具有 $A \rightarrow \lambda$ 生式的上下文无关文法生成的语言也是上下文相关语言，而一个正则语言是上下文无关语言。

分析树（parse tree 或者 parsing tree)，也称作派生树（derivation tree）、具体语法树（concrete syntax tree)，使用位置根树的形式描述一个上下文无关文法中句子的推导结果。

假设 $G { = } ( N , T , P ,$ σ)是一个上下文无关文法，则

（1）对树中每一个顶点使用NUT中的一个符号加上标号。

（2）根的标号为 $\sigma _ { \circ }$

（3）树的叶子顶点都是终结符号。

（4）树的非叶子顶点都是非终结符号。

（5）若顶点A的子女顶点从左到右依次为 $B_{1},~B_{2},~\cdots,~B_{n},$ ，则必有产生式 $A { \longrightarrow } B _ { 1 } B _ { 2 } { \cdots }$ $B _ { n } ,$

（6）从左到右读出各个叶子的标号。

分析树是句子结构的图形表示，简单说，它就是按照某一规则进行推导时所形成的树。

例10.13的分析树如图10.1所示。

【例10.16】设 $N = \{ \sigma , S \} , \quad T = \{ a , b \} , \quad P = \{ \sigma \to b \sigma , \quad \sigma \to a S , \quad S \to b S , \quad S \to b \}$ ，则 $G { = } ( N ,$ T, $P , \; \sigma ) )$ 是一个文法。因为每个产生式具有形式A→a或 $A { \rightarrow } a B$ ，这里 $A,   B \in N,   a \in T$ ，故G为正则文法。

一般地，从 $\sigma$ 唯一可推导的是

$$\begin{array}{l}\sigma {\Rightarrow } b \sigma {\Rightarrow } {\cdots } {\Rightarrow } b^{n} \sigma \quad (n {\geqslant } 0) \\\quad {\Rightarrow } b^{n} a S {\Rightarrow } {\cdots } {\Rightarrow } b^{n} a b^{m-1} S \quad (n {\geqslant } 0, m {\geqslant } 1) \\\quad {\Rightarrow } b^{n} a b^{m}\end{array}$$

于是 $L ( G )$ 由 $\{ a , b \}$ 上恰有一个a且以 b结尾的所有字符串组成，即 $L(G)=\left\{b^{n}ab^{m}\mid n\geqslant0\right\}$ m≥1}。

字符串 bbab 从σ可推导，写为 $\sigma   \Rightarrow   b b a b$ ，这个推导是 $\sigma { \Rightarrow } b \sigma { \Rightarrow } b b \sigma { \Rightarrow } b b a S { \Rightarrow } b b a b$分析树如图10.2所示。

【例10.17】 $G { = } ( \{ \sigma _ { j } ^ { \downarrow } ,   \{ 0 , 1 , + , \times \} ,   \{ \sigma { \rightarrow } 0 , \sigma { \rightarrow } 1 , \sigma { \rightarrow } \sigma { \div } \sigma , \sigma { \rightarrow } \sigma { \times } \sigma \}   P , \sigma )$ 是一个上下文无

[page:349]

## 第10章 形式语言、自动机与正则表达式

关文法。

图10.3(a)所示的分析树对应的推导式为 $\sigma { \rightarrow } \sigma { \scriptstyle + } \sigma { \rightarrow } 1 { \scriptstyle + } \sigma { \rightarrow } 1 { \scriptstyle + } \sigma { \times } \sigma { \rightarrow } 1 { \scriptstyle + } 1 { \scriptstyle \times } \sigma { \rightarrow } 1 { \scriptstyle + } 1 { \scriptstyle \times } 1$

图10.3(b)所示的分析树对应的推导式为 $\sigma { \rightarrow } \sigma { \times } \sigma { \rightarrow } \sigma { \times } 1 { \rightarrow } \sigma { \div } \sigma { \times } 1 { \rightarrow } 1 { \div } \sigma { \times } 1 { \rightarrow } 1 { \div } 1 { \times } 1$

这两个推导的不同之处是有意义的。从表达式的结构考虑，前者推导表示第二和第三个1先相乘，再和第一个1相加；而后者推导则表示先将前两个1相加，再将它们的和与第三个1相乘。很明显，结果是不同的。

设 G=(N, T, P, σ)是一个上下文无关文法，若存在 $x { \in } L ( G )$ ，使得有两个（或两个以上）不同的分析树可以产生x，则称G为一个有歧义的文法，或简称G为一个歧义文法(ambiguous grammar)。

例10.17的文法是歧义文法，而例10.16的文法不是。

歧义文法对程序语句的理解会有一定影响，例如语句“if condition1 then if condition2 then procedure1 else procedure2”中的“else”是应该匹配第一个“if”还是第二个？

可以证明上下文无关文法是否有歧义性是不可判定的，即不存在一个算法能够判断一个上下文无关文法是不是歧义的。1961年帕里克（RohitParikh）证明了一些文法具有固有的歧义性，即每一个与之等价的文法都一定是歧义文法。

【例10.18】 “整数”可以使用如下的上下文无关文法表示。

N={<数字>, <整数>, <带符号整数>, <无符号整数>}。

T={0, 1, 2, 3, 4, 5, 6, 7, 8, 9, +, −} 。

P中产生式为

<数字>→0，<数字>→1，…，<数字>→9

<整数>→<带符号整数>，<整数>→<无符号整数>

<带符号整数>→+<无符号整数>，<带符号整数>→-<无符号整数>

<无符号整数>→<数字>，<无符号整数>→<数字><无符号整数>

开始符号σ=<整数>。

这个文法是上下文无关的，但不是正则的；然而可以通过对产生式的修改得到正则文法。

<数字>→0<数字>，<数字>→1<数字>，…，<数字>→9<数字>，<数字>→λ

<整数>→+<无符号整数>，<整数>→-<无符号整数>

<整数>→0<数字>，<整数>→1<数字>，…，<整数>→9<数字>

[page:350]

## 离散数学及应用（第2版）

<无符号整数>→0<数字>，…，<无符号整数>→9<数字>

这也表明不同的短语结构文法可以产生相同的语言。

【例10.19】设 $T = \{ a ,   b \} ,   P = \{ \sigma { \rightarrow } a { \mathcal { A } } ,   \sigma { \rightarrow } b { \mathcal { B } } ,   B { \rightarrow } b { \mathcal { B } } ,   B { \rightarrow } a { \mathcal { A } } ,   { \mathcal { A } } { \rightarrow } a { \mathcal { B } } ,   { \mathcal { A } } { \rightarrow } b { \mathcal { A } } ,   { \mathcal { A } } { \rightarrow } { \mathcal { A } } \}$则正则文法 $G { = } ( \{ \sigma , A , B \} , T , P , \sigma )$ 生成的语言是T上所有含有奇数个a的串的集合。

【例10.20】设 $N = \{ \sigma , A , B , C , D , E \} , \quad T = \{ a , b , c \} , \quad P = \{ \sigma \rightarrow a A B , \quad \sigma \rightarrow a B , \quad A \rightarrow a A C ,$ A→aC, B→Dc, D→b, CD→CE, CE→DE, DE→DC, Cc→Dcc}， 则 $G { = } ( N , ~ T , ~ P , ~ \sigma )$是一个上下文相关文法。可以证明 $L(G)=\left\{a^{n}b^{n}c^{n}|n\geqslant1\right\}$ 不是正则的，即不存在与G等价的正则文法。

本节最后简要介绍由林登麦伊尔（Aristid Lindenmayer）于1968年创建的林登麦伊尔系统（L-system）中使用的文法，最初它是为了刻画植物生长的模型，而今越来越多地用于生成分形曲线。

定义10.19 一个（非交互）林登麦伊尔系统L包括

（1）一个有限的符号集合 $V _ { \odot }$

（2）一个有限的产生式 $\alpha { \longrightarrow } \beta { \mathfrak { k } }$ 的集合P，其中α∈V且 $. \beta { \in } { \boldsymbol { V } } ^ { * }$ C

(3)一个开始串 $\sigma   \in   \boldsymbol { V } ^ { * }$ 0

定义 10.20 设 ${ \cal L } { = } ( V ,   P ,   \sigma )$ 是一个林登麦伊尔系统，如果 $\alpha { = } x _ { 1 } x _ { 2 } { \cdots } x _ { n }$ ，并在P中存在产生式 $x _ { i } { \Rightarrow } \beta _ { i }$ (对于 $i {=} 1,2,\ \cdots,n\ )$ ，则写为 $\alpha { \Longrightarrow } \beta _ { 1 } \beta _ { 2 } { \cdots } \beta _ { n }$ ，并称 $\beta _ { 1 } \beta _ { 2 } \cdots \beta _ { n }$ 是直接可推导的。

林登麦伊尔系统中 $x_{1}x_{2}\cdots x_{n} \Rightarrow \beta_{1}\beta_{2}\cdots\beta_{n}$ 需要同时尽可能多地使用多个产生式；而在上下文无关文法中，允许只使用一个产生式，推导 $x_{1}x_{2}\cdots x_{n} \Rightarrow \beta_{1}x_{2}\cdots x_{n}.$

【例 10.21】 科赫雪花(koch snowflake)——设 $L = \left( \{ F , + , - \} , \{ F \rightarrow F + F - - F + F \} \right)$ F)是一个林登麦伊尔系统，其中F表示以当前方向画一条固定长度的线段， $\text{" }+ \text{" }$ 表示向左逆时针旋转 $60^{\circ}, " - "$ 表示向右顺时针旋转 $6 0 ^ { \circ }$

$$\begin{aligned} { F \quad } & { { } \Rightarrow F + F -- F + F } \\ { } & { { } \Rightarrow F + F -- F + F + F + F -- F + F -- F + F -- F + F + F + F -- F + F } \\ { } & { { } \cdots \cdots } \\ \end{aligned}$$

由此推导得到的前6次曲线如图10.4(a)~(f)所示，在这些曲线中，部分类似整体(图 $1 0 . 4 ( \mathrm { g } ) )$ ，是一种典型的分形（fractal）图形。

[page:351]

## 第10章 形式语言、自动机与正则表达式

将3个曲线按照一个“正三角形”的形式“拼合”起来，就得到了科赫雪花(图 10.4(h))。

将L的开始符号改作 $F + F + F$ (一个正三角形)，推导得到的图形就是科赫雪花。

## 10.3 巴科斯-诺尔范式和语法图

下面介绍描述上下文无关文法的一些其他方法。

美国人巴科斯（John Backus）首次在程序设计语言ALGOL58中使用一种形式化方法描述其语法，而后丹麦人诺尔（PeterNaur）在其创建的ALGOL60语言中发展并简化了巴科斯的表示方法。因此，这种形式化的语法表示方法被称作巴科斯-诺尔范式(Backus-Naur Form,BNF)，它是一种典型的元语言，便于语法分析和编译。

在BNF中，每条规则的左部是一个非终结符，右部是由非终结符和终结符组成的一个符号串；非终结符用尖括号括起，以“<”开始，以“>”结束；产生式S→T写作S::=T；具有相同左部的规则可以共用一个左部，各右部之间以竖线“|”隔开，“|”表示“或”。

【例10.22】 “整数”的BNF表示方法是

<整数>.:=<带符号整数>|<无符号整数>

<带符号整数>.:=+<无符号整数>|-<无符号整数>

<无符号整数>.:=<数字>|<数字><无符号整数>

<数字>::=0|1|2|3|4|5|6|7|8|9

[page:352]

## 离散数学及应用（第2版）

这等价地表示了例10.18的文法。

语法图（syntax diagram）又称作句法图或铁路图（railroad diagram），可以使用图形化方式表示某些巴科斯-诺尔范式。（语法图可以用来表示所有正则文法。)

一个文法一般由多个语法图组成，每个图都有一个起始顶点和一个终止顶点，每个图的起始顶点都表示一个非终结符。图中存在一条或多条从起始顶点到终止顶点的有向道路，道路中经过的非终结符用矩形表示，经过的终结符用圆形表示。

组合所有的语法图形成一个大的图，该图的起始顶点表示开始符号，而且只有一个终止顶点，这样得到的语法图称为主图。而属于语言的一个词“文法正确”当且仅当它在主语法图中形成一条道路。

## 【例10.23】

(a） BNF 范式<x>::=<y><z>a 的语法图如图 10.5(a)所示。

(b） BNF 范式<x>::=<y>|<z>|a 的语法图如图 10.5(b)所示。

(c） BNF 范式<x>.:=<y>|<y>a<x>的语法图如图 10.5(c)所示。

【例10.24】图10.6(a)是对应例 10.22中 BNF 范式的语法图，主图如图10.6(b)所示。

[page:353]

## 第10章 形式语言、自动机与正则表达式

## 10.4 有限状态自动机

（确定性）有限状态自动机（Finite State Automata，FSA）是为研究有限内存的计算过程和某些语言类而抽象出的一种计算模型，表示有限个状态以及在这些状态之间的转移和动作等行为，最终判断一系列行为是否符合“可接受”的要求。

定义10.21 有限状态自动机指一个五元组 $M { = } ( S , I , f , A , S _ { 0 } )$ ，其中S是一个有限的状态集合，I是一个有限的输入符号集合，f表示状态的转换是从S×I到S的函数，接受状态的非空集合 $A { \subseteq } S ,$ ，初始状态 $S _ { 0 } { \in } S _ { 0 }$

【例10.25】五元组 $M { = } ( \{ S _ { 0 } ,   S _ { 1 } \} ,   \{ a ,   b \} ,   f ,   \{ S _ { 1 } \} ,   S _ { 0 } )$ 构成一个有限状态自动机，其中$f(S_{0}, a) = S_{0}, \quad f(S_{0}, b) = S_{1}, \quad f(S_{1}, a) = S_{1}, \quad f(S_{1}, b) = S_{0}$

可以分析得到，对于例10.25中的有限状态自动机，可接受的语言L(M)为包含奇数个b的a-b 串。

有限状态自动机还有其他两种表示方式:状态转换表和状态转换图。

状态转换表第 $S _ { i }$ 行第 $I _ { j }$ 列的交叉处是 $S_{k} = f(S_{i}, I_{j})$ ，表示一种状态转换。对于例10.25中的有限状态自动机的状态转换表如表10.1所示。

表 10.1 例 10.25 用表<table><tr><td rowspan=2><eq>S</eq></td><td colspan=2>I</td></tr><tr><td>a</td><td><eq>b</eq></td></tr><tr><td><eq>S _ { 0 }</eq></td><td><eq>S _ { 0 }</eq></td><td><eq>S _ { 1 }</eq></td></tr><tr><td><eq>S _ { 1 }</eq></td><td><eq>S _ { 1 }</eq></td><td><eq>S _ { 0 }</eq></td></tr></table>

有限状态自动机的状态转移图是一个有向图，顶点表示状态集合S中各个元素(图10.7(a))；通过在有向边上标明输入符号表示 $f ,$ 例如图 10.7(b)表示 $S_{k} = f(S_{i}, I_{j})$ ；接受状态用双圈表示(图10.7(c))；此外，使用一个箭头指向表示开始状态的顶点(图10.7(d))。

例10.25中的有限状态自动机的状态转换图如图10.8所示。

可以把有限状态自动机 $M { = } ( S , I , f , A , S _ { 0 } )$ 看作一台机器，如图10.9所示，读写头从最

[page:354]

## 354

左端开始自左向右逐位读入x，然后由当前状态和当前读入的位，根据f得到下一个状态，读写头向右移动一位，直到读完x的所有位，最后判断最终状态是否属于可接受状态集合。如果最终状态属于可接受状态集合，则称M可接受x。

可以给出一个形式化的定义。

定义 10.22 假设 $M { = } ( S , ~ I , ~ f , ~ A , ~ S _ { 0 } )$ 是一个有限状态自动机， $x = x_{1}x_{2} \cdots x_{n} \in I^{n}$ 定义$f ^ { ( 0 ) } ( x ) { = } S _ { 0 } , f ^ { ( k + 1 ) } ( x ) { = } f ( f ^ { ( k ) } ( x ) , x _ { k + 1 } )$ ，其中 $0 \leqslant k \leqslant n-1$ ，如果 $f ^ { ( | x | ) } ( x ) { \in } { \mathcal { A } }$ ，则称x可以被M接受。I上所有可被M接受的串全体记作 $\operatorname { A c } ( M )$ ，也称作M可接受的（定义的）语言，记作 L(M)。

直观地说，x可以被M接受是指:在M的状态转换图中，从顶点 $S _ { 0 }$ 出发，存在一条到一个接受状态顶点的道路，途经的各条有向边上的符号之连接恰好是x。

【例10.26】设 $I { = } \{ a , b \}$

(a）接受所有偶数长度的串的有限状态自动机如图10.10(a)所示。

(b）接受所有以b结尾的串的有限状态自动机如图10.10(b)所示。

(c）接受所有包含偶数个a的串的有限状态自动机如图10.10(c)所示。

(d)接受所有包含至少一个 a 和至少一个 b 的串的有限状态自动机如图 10.10(d)所示。

[page:355]

## 第10章 形式语言、自动机与正则表达式

(e）接受所有包含至少两个a的串的有限状态自动机如图10.10(e)所示。

(f)接受所有以 bb结尾的串的有限状态自动机如图10.10(f)所示。

【例10.27】构造一个有限状态自动机M，它接受的语言为 $\{ x 0 0 0 y | x , y \in \{ 0 , 1 \} ^ { * } \}$

解. 假设状态 $S _ { 0 }$ 表示 M的启动状态； $S _ { 1 }$ 表示M读到了一个0，这个0可能是子串000的第1个 $_ { 0 } ; S _ { 2 }$ 表示M在 $S _ { 1 }$ 后紧接着又读到了一个0，这个0可能是子串000的第2 个 0； $S _ { 3 }$ 表示M在 $S _ { 2 }$ 后紧接着又读到了一个0，发现输入字符串含有子串000，因此这个状态应该是终止状态。

下面考虑状态转换函数。

明显有 $f(S_{0},0)=S_{1},f(S_{1},0)=S_{2},f(S_{2},0)=S_{3}.$

$f(S_{0},1)=S_{0}$ 在 $S _ { 0 }$ 读到了一个1，它需要继续在 $S _ { 0 } ^ { \mathrm { ~ c ~ } }$ 等待”可能是子串000的第1个0的输入字符0。

$f(S_{1},1)=S_{0}$ M在刚刚读到了一个0后，读到了一个1，表明在读入这个1之前所读入的0并不是子串000的第1个0，因此，M需要重新回到状态 $S _ { 0 }$ ，以寻找子串000的第1个0。

$f(S_{2},1)=S_{0}$ M在刚刚发现了00后，读到了一个1，表明在读入这个1之前所读入的00并不是子串000的前两个0，因此，M需要重新回到状态 $S _ { 0 }$ ，以寻找子串000的第1个0。

$f(S_{3},0)=S_{3}$ M已经找到了子串000，只要继续读完该串的剩余部分即可。

$f(S_{3},1)=S_{3}$ M已经找到了子串000，只要继续读完该串的剩余部分即可。

因此得到 $M { = } ( \{ S _ { 0 } , S _ { 1 } , S _ { 2 } , S _ { 3 } \} , \{ 0 , 1 \} , \{ f _ { 0 } ( S _ { 0 } , 0 ) { = } S _ { 1 } , f _ { 1 } ( S _ { 1 } , 0 ) { = } S _ { 2 } , f _ { 2 } ( S _ { 2 } , 0 ) { = } S _ { 3 } , f _ { 3 } ( S _ { 0 } , 1 ) { = } S _ { 0 } , f _ { 1 } ( S _ { 1 } , 0 ) { = } S _ { 2 } , \{ 0 , 1 \} , \{ 0 , 1 \} \} ) .$ $1)=S_{0},f(S_{2},1)=S_{0},f(S_{3},0)=S_{3},f(S_{3},1)=S_{3}\},\left\{S_{3}\right\},S_{0})$

【例10.28】以类似于例10.27的方法可以构造{0,1}上的有限状态自动机。

(a）接受所有包含01011的串的有限状态自动机如图10.11(a)所示。

(b）接受所有包含偶数个01的串的有限状态自动机如图10.11(b)所示。

[page:356]

## 离散数学及应用（第2版）

【例10.29】

（a）构造一个有限状态自动机M，它接受的语言为 $\{ 0 ^ { n } 1 ^ { m } | n , m \geqslant 1 \}$

（b）构造一个有限状态自动机M，它接受所有以11开始的0-1串。

解.（a）假设状态 $S _ { 0 }$ 表示M的启动状态； $S _ { 1 }$ 表示M读到至少一个0，并等待读更多的0； $S _ { 2 }$ 表示M读到至少一个0后，读到了至少一个1，并等待读更多的1。

如果在 $S _ { 0 }$ 读到1，则说明不能被接受，进入一个“陷阱状态” $S _ { \mathrm { t } }$ ，之后只要继续读完该串的剩余部分即可。

到达 $S _ { 2 }$ 后，读到0则说明不能被接受，进入 $S _ { \mathrm { t } } ,$ ，之后继续读完该串的剩余部分；读到1后，继续留在状态 $S _ { 2 }$ 即可。

可以得到如图10.12(a)所示的有限状态自动机。

(b）类似于(a)的方法，可以构造如图10.12(b)所示的有限状态自动机。

【例10.30】构造一个有限状态自动机M，它接受的语言为 $\{ x | x \in \{ 0, 1 \} ^ { * }$ ，且当把 x看成二进制数时，x能被3整除}。

解. 假设 $x{=}b_{1}b_{2}{\cdots}b_{k}$ ，M读入x时是自左而右逐位读入，当M在读入 $b _ { i }$ 时，已经读过的 x的各位形成的值 $y {=} b_{1} b_{2} \cdots b_{i-1}$ (最初情况的初值为0)，在读过 $b _ { i }$ 后，形成的值为$2 y { + } b _ { i } { \scriptstyle \circ }$ 于是y和 $2 y { + } b _ { i }$ 模3的余数之间存在如表10.2所示的关系。

表10.2 模3的余数之间关系<table><tr><td>y mod 3</td><td><eq>b _ { i }</eq></td><td><eq>2 y + b _ { i } \bmod 3</eq></td></tr><tr><td>0</td><td>0</td><td>0</td></tr><tr><td>0</td><td>1</td><td>1</td></tr></table>

[page:357]

## 第10章 形式语言、自动机与正则表达式

续表<table><tr><td>y mod 3</td><td><eq>b _ { i }</eq></td><td><eq>2 y + b _ { i } \bmod 3</eq></td></tr><tr><td>1</td><td>0</td><td>2</td></tr><tr><td>1</td><td>1</td><td>0</td></tr><tr><td>2</td><td>0</td><td>1</td></tr><tr><td>2</td><td>1</td><td>2</td></tr></table>

于是可以得到如图10.13的有限状态自动机。

定义 10.23 非确定性有限状态自动机（Nondeterministic Finite Automata, NFA）是一个五元组 $M { = } ( S , I , f , A , S _ { 0 } )$ ，其中S是一个有限的状态集合，I是一个有限的输入符号集合，接受状态的非空集合A⊂S，初始状态 $S _ { 0 } { \in } S _ { 1 }$ ，f是从 S×I 到 P(S)的函数——表示所有可能转换到的状态的全体。

在非确定性有限状态自动机中，f的一般形式是f(X, $a)=\left\{Y_{1}, Y_{2}, \cdots, Y_{m}\right\} \subseteq S$ 或者f(X, $a ) = \varnothing .$ 0

为更加明确起见，之前所介绍的“有限状态自动机”也称作“确定性有限状态自动机(Deterministic Finite Automata, $\mathbf{DFA})$ 。如果将函数f的值X视作等同于{X}，那么确定性有限状态自动机也是一种特殊的非确定性有限状态自动机。

【例10.31】五元组 $M ^ { = } ( \{ S _ { 0 } , S _ { 1 } , S _ { 2 } \} ,   \{ a ,   b \} , f ,   \{ S _ { 1 } , S _ { 2 } \} ,   S _ { 0 } )$ 构成一个非确定性有限状态自动机，其中 $f(S_{0},a)=\{S_{0},S_{1}\},f(S_{0},b)=\{S_{2}\},f(S_{1},a)=\{S_{1}\},f(S_{1},b)=\emptyset,f(S_{2},a)=\emptyset,f(S_{2},b)=$ $\{ S _ { 1 } , S _ { 2 } \}$ 0

状态转换表如表10.3所示。

表 10.3 例 10.31 用表<table><tr><td rowspan=2>S</td><td colspan=2>I</td></tr><tr><td>a</td><td>b</td></tr><tr><td><eq>S _ { 0 }</eq></td><td><eq>\{ S _ { 0 } , S _ { 1 } \}</eq></td><td>{S2}</td></tr><tr><td><eq>S _ { 1 }</eq></td><td>{S1}</td><td>∅</td></tr><tr><td><eq>S _ { 2 }</eq></td><td>∅</td><td><eq>\{ S _ { 1 } , S _ { 2 } \}</eq></td></tr></table>

状态转移图如图10.14所示。

定义 10.24 假设 $M { = } ( S , I , f , A , S _ { 0 } )$ 是一个非确定性有限状态自动机， $x = x_{1}x_{2} \cdots x_{n} \in I^{n}$定义 $f^{(0)}(x) = \left\{ S_0 \right\}$ , $f^{(k+1)}(x) = \bigcup_{X \in f^{(k)}(x)} f(X, x_{k+1})$ ，其中 $0 \leqslant k \leqslant n-1$ ，如果 $f ^ { ( | x | ) } ( x ) \cap A \neq \emptyset$

[page:358]

## 358

则称x可以被M接受。I上所有可被M接受的串全体记作 $\operatorname { A c } ( M )$ ，也称作M可接受的（定义的）语言，记作 $L ( M )$

直观地说，x可以被M接受是指:在M的状态转换图中，从顶点 $S _ { 0 }$ 出发，存在一条到一个接受状态顶点的道路，途经的各条有向边上的符号之连接恰好是 $x _ { \circ }$

【例10.32】aa、bbbb、bba可以被例10.31的非确定性有限状态自动机接受，而λ、ba、aba、bbaabb都不能被接受。

定义 10.25 假设 $M _ { 1 }$ 和 $M _ { 2 }$ 是两个有限状态自动机，若 $L ( M _ { 1 } ) { = } L ( M _ { 2 } )$ ，则称 $M _ { 1 }$ 和 $M _ { 2 }$等价。

【例10.33】图10.15所示的确定性有限状态自动机和例10.31的非确定性有限状态自动机是等价的，能接受的语言都是 $\left\{ a ^ { n } \mid n \geqslant 1 \right\} \cup \left\{ a ^ { n } b ^ { m } \mid n \geqslant 0 , m \geqslant 1 \right\} \cup \left\{ a ^ { n } b ^ { m } a ^ { k } \mid n \geqslant 0 \right\}$ $m \geqslant 2, k \geqslant 0$

定理10.5 假设语言L可以被一个非确定性有限状态自动机 $M_{1} = (S, I, f, A, S_{0})$ 接受，则存在一个确定性有限状态自动机 $M _ { 2 }$ 接受 $L _ { \circ }$

证明. 构造 $M_{2} = (S', I, F, A', \{S_{0}\})$ ，其中: $S ^ { \prime }   =   P ( S )$ $A^{\prime} = \left\{ X \subseteq S \mid X \cap A \neq \varnothing \right\}$ ，对任意 $a   \in   I$定义 $F(\{X_1, X_2, \cdots, X_m\}, a) = f(X_1, a) \cup f(X_2, a) \cup \cdots \cup f(X_m, a)$ ，并定义 $F(\varnothing, a) = \varnothing$ o

下面证明 $L(M_{1}) = L(M_{2})$

很容易看到 $\lambda { \in } L ( M _ { 1 } )$ 当且仅当 $\lambda { \in } L ( M _ { 2 } )$

对于任意 $w { \in } { \boldsymbol { I } } ^ { * }$ ，假设 $n { = } | w |$ $w = w_{1}w_{2}\cdots w_{n}$ 。下面使用归纳法证明对于所有 $1 \leq k \leq n$有 $F ^ { ( k ) } ( x ) { = } f ^ { ( k ) } ( x )$

（1）由 $f^{(1)}(x) = f(S_0, x_1)$ 有 $F ^ { ( 1 ) } ( x ) { = } F ( \{ S _ { 0 } \} , x _ { 1 } ) { = } f ( S _ { 0 } , x _ { 1 } ) { = } f ^ { ( 1 ) } ( x )$ o

(2) 假设 $F ^ { ( k ) } ( x ) { = } f ^ { ( k ) } ( x )$ ，则有

$$F^{(k+1)}(x) = F(F^{(k)}(x), x_{k+1}) = \bigcup_{X \in F^{(k)}(x)} f(X, x_{k+1}) = \bigcup_{X \in f^{(k)}(x)} f(X, x_{k+1}) = f^{(k+1)}(x).$$

于是 $w { \in } L ( M _ { 1 } )$ 当且仅当 $f ^ { ( n ) } ( w ) \cap A \neq \emptyset$ ，而这当且仅当 $F ^ { ( n ) } ( w ) { = } f ^ { ( n ) } ( w ) { \in } A ^ { \prime }$ ，即 $w \in$ $L ( M _ { 2 } )$ 0 □

【例10.34】例10.31的非确定性有限状态自动机可以通过定理10.5所述方法转化为等价的确定性有限状态自动机，如图10.16所示，这与图10.15是相同的。

[page:359]

## 第10章 形式语言、自动机与正则表达式

## 10.5 语言与自动机的关系

本节将建立起正则文法和有限状态自动机的等价性。

定理10.6 可以由确定性有限状态自动机 $M { = } ( S , I , f , A , S _ { 0 } )$ 构造一个正则文法 $G = (S, I)$ $P , S _ { 0 } )$ ，使得 $L ( G ) { = } L ( M )$ :假设X, $Y { \in } S , \quad a { \in } I ,$ 若 $f(X,a) = Y$ ，则在P中有 $X { \rightarrow } a Y ;$ 若 $X { \in } A$则在P中有 $X { \longrightarrow } \lambda$

证明. 很容易看到 $S _ { 0 } { \longrightarrow } \lambda$ 当且仅当 $S _ { 0 } { \in } A$ ，故 $\lambda { \in } L ( G )$ 当且仅当 $\lambda { \in } L ( M )$

首先证明 $L ( M ) { \subseteq } L ( G )$ 0

对于任意 $w { \in } L ( M )$ ，假设 $n = |w|, \quad w = w_1 w_2 \cdots w_n$ 。对所有 $1 { \leqslant } i { \leqslant } n$ ，记 $S _ { i } { = } f ^ { ( i ) } ( w )$ ，则有$S _ { i } { = } f ( S _ { i - 1 } , w _ { i } )$ ，而且 $S _ { n } { \in } A$ ，于是由P的构造有 $S _ { i - 1 } { \rightarrow } w _ { i } S _ { i }$ 及 $S _ { n } { \longrightarrow } \lambda _ { \cdot }$

因而 $S _ { 0 } { \Rightarrow } w _ { 1 } S _ { 1 } { \Rightarrow } w _ { 1 } w _ { 2 } S _ { 2 } { \Rightarrow } { \cdots } { \Rightarrow } w _ { 1 } w _ { 2 } { \cdots } w _ { n } S _ { n } { \Rightarrow } w _ { 1 } w _ { 2 } { \cdots } w _ { n } ,$ 表明 $w { \in } L ( G )$ o

下面证明 $L ( G ) { \subseteq } L ( M )$

由P的构造方法，每个产生式或者增加一个终结符号，或者减少一个非终结符号。

对于任意 $\scriptstyle { \mathcal { W } } \in L ( G )$ ，假设 $S _ { 0 } { \Rightarrow } \alpha _ { 1 } { \Rightarrow } \cdots { \Rightarrow } w$ 是w 从 $S _ { 0 }$ 的推导 $( \alpha _ { 1 }   \in   ( S   \cup   { \bar { I } } ) ^ { * } )$ ，则容易证明一定是经过|w|次 $X { \longrightarrow } a Y$ 型直接推导之后再进行一次 $X { \longrightarrow } \lambda$ 型直接推导。而每一次直接推导在M中都是符合f的，从形式上讲，如果直接推导是 $X { \longrightarrow } a Y ,$ ，则 $f^{(i)}(w)=X,\;Y=f^{(i+1)}(x)=$ $f ( f ^ { ( i ) } ( x ) , a )$ ，最后一次X→λ表明 $X { \in } A$ ，即得 $w { \in } L ( M )$ □

【例10.35】由图10.11(b)所示的有限状态自动机，可以构造正则文法 $G = ( \{ S _ { 0 } , S _ { 1 } , S _ { 2 } ,$ $S _ { 3 } \} ,   \{ 0 ,   1 \} ,   P ,   S _ { 0 } )$ ，其中 $P { = } \{ S _ { 0 } { \rightarrow } 0 S _ { 1 } ,   S _ { 0 } { \rightarrow } 1 S _ { 0 } ,   S _ { 1 } { \rightarrow } 0 S _ { 1 } ,   S _ { 1 } { \rightarrow } 1 S _ { 2 } ,   S _ { 2 } { \rightarrow } 0 S _ { 3 } ,   S _ { 2 } { \rightarrow } 1 S _ { 2 } ,   S _ { 3 } { \rightarrow } 0 S _ { 3 }$ $S _ { 3 } \to 1 S _ { 0 } , S _ { 0 } \to \lambda , S _ { 1 } \to \lambda \}$

定理10.7 可以由正则文法 $G { = } ( N ,   T ,   P ,   \sigma )$ 构造一个非确定性有限状态自动机 $M = S ,$ $T , f , A , \sigma )$ ，使得 $L ( G ) { = } L ( M )$ ，其中:

$$S = N \cup \{ F \} , \quad F \not \in N \cup T$$

$$f(X,a)=\left\{Y|X\to aY\in P\right\}\cup\left\{F|X\to a\in P\right\}(a\in T)$$

$$A = \{ F \} \cup \{ X | X \to \lambda \in P \}$$

证明. 很容易看到 $\sigma { \longrightarrow } \lambda { \in } P$ 当且仅当 $\sigma { \in } A$ ，故 $\lambda { \in } L ( G )$ 当且仅当 $\lambda { \in } L ( M )$

首先证明 $L ( G ) { \subseteq } L ( M )$

对于任意 $w { \in } L ( G )$ ，w从o的推导的形式必定是

$$\sigma { \Rightarrow } w _ { 1 } X _ { 1 } { \Rightarrow } w _ { 1 } w _ { 2 } X _ { 2 } { \Rightarrow } \cdots { \Rightarrow } w _ { 1 } w _ { 2 } \cdots w _ { n - 1 } X _ { n - 1 } { \Rightarrow } w _ { 1 } w _ { 2 } \cdots w _ { n }$$

[page:360]

## 离散数学及应用（第2版）

或者

$$\sigma { \Rightarrow } w _ { 1 } X _ { 1 } { \Rightarrow } w _ { 1 } w _ { 2 } X _ { 2 } { \Rightarrow } \cdots { \Rightarrow } w _ { 1 } w _ { 2 } \cdots w _ { n } X _ { n } { \Rightarrow } w _ { 1 } w _ { 2 } \cdots w _ { n }$$

则 $X _ { 1 } { \in } f ( \sigma , w _ { 1 } ) { \stackrel { \rightharpoonup } { = } } f ^ { ( 1 ) } ( w ) , X _ { 2 } { \in } f ( f ^ { ( 1 ) } ( w ) , w _ { 2 } ) { \stackrel { \rightharpoonup } { = } } f ^ { ( 2 ) } ( w )$ (由于 $X_{1} \rightarrow w_{2}X_{2}), \cdots, X_{n-1} \in f^{(n-1)}(w)$而最后一次推导或者是 $X _ { n - 1 } { \rightarrow } w _ { n }$ ，或者是 $X _ { n } { \rightarrow } \lambda$ ，前者表明 $F \in \bigcup_{X \in f^{(n-1)}(w)} f(X, w_n) =$ $f ^ { ( n ) } ( w )$ ，后者表明 $X _ { n } { \in } f ^ { ( n ) } ( w )$ 且 $X _ { n } { \in } A$ 。两者都表明 $f ^ { ( n ) } ( w ) \cap A \neq \emptyset$ ，即 w可以被M接受。下面证明 $L ( M ) { \subseteq } L ( G )$

对于任意 $\scriptstyle { \mathcal { W } } \in L ( M )$ ，假设 $n { = } | w |$ $w = w_{1}w_{2}\cdots w_{n}$ 。对所有 $0 \leqslant k \leqslant n-1$ ，由

$$f^{(k+1)}(w) = \bigcup_{X \in f^{(k)}(x)} \left( \{ Y \mid X \to w_{k+1} Y \in P \} \cup \{ F \mid X \to w_{k+1} \in P \} \right)$$

知或者存在 $X _ { k } \in f ^ { ( k ) } , X _ { k + 1 } \in f ^ { ( k + 1 ) }$ ，使得 $X _ { k } { \rightarrow } w _ { k + 1 } X _ { k + 1 } { \in } P ;$ 或者存在 $X _ { k } { \in } f ^ { ( k ) }$ ，使得 $X _ { k } { \rightarrow } w _ { k + 1 } { \in } P .$而且当k<n-1时，不会不存在 $X _ { k } { \rightarrow } w _ { k + 1 } X _ { k + 1 } { \in } P$ 而只有 $X _ { k } { \rightarrow } w _ { k + 1 } { \in } P$ ，否则 $f ^ { ( k + 1 ) } = F , f ^ { ( k + 2 ) } = \emptyset$当 $k { = } n { - } 1$ 时， $\scriptstyle { \mathcal { W } } \in L ( M )$ 表明 $f ^ { ( n ) } ( x ) \cap A \neq \emptyset$ C

若 $F { \in } f ^ { ( n ) } ( x )$ ，则存在 $X _ { n - 1 } { \in } f ^ { ( n - 1 ) }$ ，使得 $X _ { n - 1 } { \rightarrow } w _ { n } { \in } P$ ，因此可以得到推导

$$\sigma {=} X_{0}{\Rightarrow} w_{1}X_{1}{\Rightarrow} w_{1}w_{2}X_{2}{\Rightarrow} \cdots {\Rightarrow} w_{1}w_{2}\cdots w_{n-1}X_{n-1}{\Rightarrow} w_{1}w_{2}\cdots w_{n}$$

若存在 $X _ { n } { \in } f ^ { ( n ) } ( x ) \cap A \cap N .$ ，则 $X _ { n } { \rightarrow } \lambda { \in } P$ ，因此可以得到推导

$$\sigma { = } X _ { 0 } { \Rightarrow } w _ { 1 } X _ { 1 } { \Rightarrow } w _ { 1 } w _ { 2 } X _ { 2 } { \Rightarrow } \cdots { \Rightarrow } w _ { 1 } w _ { 2 } \cdots w _ { n } X _ { n } { \Rightarrow } w _ { 1 } w _ { 2 } \cdots w _ { n }$$

从而无论哪种请况都可以得到 $w { \in } L ( G )$

【例10.36】由正则文法 $G { = } ( \{ S _ { 0 } ,   S _ { 1 } ,   S _ { 2 } ,   S _ { 3 } \} ,   \{ 1 ,   0 \} ,   P ,   S _ { 0 } )$ ，其中 $P = \{ S _ { 0 } \to 0 S _ { 1 } ,   S _ { 0 } \to 0$ $S _ { 0 } { \rightarrow } 1 S _ { 0 } ,   S _ { 1 } { \rightarrow } 0 S _ { 1 } ,   S _ { 1 } { \rightarrow } 0 ,   S _ { 1 } { \rightarrow } 1 S _ { 2 } ,   S _ { 2 } { \rightarrow } 0 S _ { 3 } ,   S _ { 2 } { \rightarrow } 1 S _ { 2 } ,   S _ { 3 } { \rightarrow } 0 S _ { 3 } ,   S _ { 3 } { \rightarrow } 1 S _ { 0 } ,   S _ { 0 } { \rightarrow } \lambda _ { f } ^ { \gamma }$ ，可以构造一个非确定性有限状态自动机 $M { = } ( S , I , f , A , S _ { 0 } )$ ，使得 $L ( G ) { = } L ( M )$ ，其中 $S = \{ S _ { 0 } , S _ { 1 } , S _ { 2 } , S _ { 3 } , F \}$ $f ( S _ { 0 } , 0 ) { = } \{ S _ { 1 } , F \} , f ( S _ { 0 } , 1 ) { = } \{ S _ { 0 } \} , f ( S _ { 1 } , 0 ) { = } \{ S _ { 1 } , F \} , f ( S _ { 1 } , 1 ) { = } \{ S _ { 2 } \} , f ( S _ { 2 } , 0 ) { = } \{ S _ { 3 } \} , f ( S _ { 2 } , 1 ) { = } \{ S _ { 2 } \}$ $f(S_{3},0)=\{S_{3}\}, \quad f(S_{3},1)=\{S_{0}\}, \quad A=\{F,S_{0}\}$

M的状态转移图如图10.17所示。可以很容易验证它和图10.11(c)所示的有限状态自动机是等价的。

从定理10.5、定理10.6、定理10.7即可得到正则文法和有限状态自动机之间的等价性，由此可以证明如下结果。

【例10.37】 $L = \{ a^{n}b^{n}|n \geqslant 1 \}$ 不是正则语言，即不存在任何正则文法G使得 $L { = } L ( G )$下面仅给出简要的说明，严格的证明请读者完成。

[page:361]

## 第10章 形式语言、自动机与正则表达式

假设存在有限状态自动机 M=(S, I, f, A, $S _ { 0 } )$ 可以接受L，设 $\left| S \right| {=} k 。$ 由于M可以接受$a ^ { k + 1 } b ^ { k + 1 }$ ，因此M的状态转移图中存在从 $S _ { 0 }$ 开始、长为2(k+1)的道路P，终点是一个接受状态顶点。考虑读到第一个b之前的道路，记之为 $P _ { 1 } ;$ ；读到第一个b开始到结束的道路记之为 $P _ { 2 }$ o

$P _ { 1 }$ 必定经过图中同一个顶点（记为S）两次，即 $P _ { 1 }$ 包含 $S _ { i }$ 到 $S _ { i }$ 的回路。在 $P _ { 1 }$ 中将这个回路去除，再连接 $P _ { 2 }$ 后，仍然得到一条从 $S _ { 0 }$ 开始到该接受状态顶点的道路。于是存在 $0 \leq j \leq k$ 使得 $a ^ { j } b ^ { k + 1 }$ 也可以被M接受——产生矛盾。

而其根本原因在于有限状态自动机只有有限的“记忆能力”，所以无法“记住”读到第一个b之前有多少个a。

这也表明使用有限状态自动机无法进行“括号匹配”的检测，此时需要能力更强的计算模型。

## 10.6 正则表达式

20世纪50年代，克林提出了正则集和正则表达式的概念。

定义10.26 假设Σ是一个字母表，如下递归定义Σ上的正则表达式（regular expression):

（1）λ是一个正则表达式。

（2）若x∈Σ，则x是一个正则表达式。

(3）若α和β都是正则表达式，则(αβ)是一个正则表达式。

(4）若α和β都是正则表达式，则(α+β)是一个正则表达式。

(5）若α是正则表达式，则(α)*是一个正则表达式。

而且只有有限次使用上述规则的符号串才是正则表达式。

为书写的简洁，约定:

（1）最外层的括号可以省略。

(2）*的优先级最高，其次为连接（如ab)，+的优先级最低。

（3）同一种构造（+、连接、*）连续出现时，从左至右构造，中间的括号可以省略。

定义10.27 每一个正则表达式可以对应 $\boldsymbol { \Sigma } ^ { * }$ 的一个子集，称作 $( \boldsymbol { \varSigma } ^ { * }$ 的)正则集(regular set)。对应的规则如下:

（1）正则表达式λ对应A={λ}。

（2）若x∈Σ，则正则表达式x对应{x}。

（3）若α和β都是正则表达式，分别对应集合M和N，则(αβ)对应MN。

(4）若α和β都是正则表达式，分别对应集合M和N，则(α+β)对应 $M \cup N _ { \circ }$

（5）若α是正则表达式，对应集合M，则 $( \alpha ) ^ { * }$ 对应 ${ \boldsymbol { M } } _ { \mathrm { ~ c ~ } } ^ { * }$

【例10.38】 部分正则表达式和正则集合的对应关系如表10.4所示。

若α和β都是正则表达式，则 $( \alpha \beta )$ 对应的语法图如图10.18(a)所示， $( \alpha + \beta )$ 对应的语法图如图10.18(b)所示， $( \alpha ) ^ { 4 }$ 的语法图如图10.18(c)所示。

[page:362]

## 离散数学及应用（第2版）

表10.4 部分正则表达式和正则集合的对应<table><tr><td>正则表达式r</td><td>对应的正则集合R</td></tr><tr><td><eq>\lambda</eq></td><td>{λ}</td></tr><tr><td><eq>a</eq></td><td>{a}</td></tr><tr><td><eq>b</eq></td><td>{b}</td></tr><tr><td><eq>( a { + } b )</eq></td><td><eq>\{ a , b \}</eq></td></tr><tr><td><eq>( a b )</eq></td><td><eq>\{ a b \}</eq></td></tr><tr><td><eq>\left( a \right) ^ { * }</eq></td><td><eq>\{ a ^ { n } | n \geqslant 0 \}</eq></td></tr><tr><td><eq>\left( a { + } b \right) ^ { * }</eq></td><td><eq>\{ a , b \} ^ { * }</eq></td></tr><tr><td><eq>( { \boldsymbol { a } } { + } { \boldsymbol { b } } ^ { * } )</eq></td><td><eq>\{ a \} \cup \{ b ^ { n } | n \geqslant 0 \}</eq></td></tr></table>

【例10.39】 正则表达式 $(a+bc^{*})d(b+ac)^{*}$ 对应的语法图如图10.19所示。

下面不加证明地给出正则集和有限状态自动机之间的等价性关系。

定理10.8 （克林定理）L是正则集当且仅当存在有限状态自动机M可接受L

## 习题 10

10.1 假设 $\Sigma = \{ a, b \}$ 是字母表， $A = \{ a , b , a a , b b , a a a , b b b \} , B = \{ w | w \in \Sigma ^ { * } , | w | \geqslant 2 \} , C = \{ w | w \in$ $\Sigma ^ { * } , | w | \leqslant 2 \}$ ，计算 $A – (B \cap C)$

10.2 设 $\Sigma = \{ a, b \}$ ，求字符串aaba的所有前缀、真前缀、后缀、真后缀、子串。

10.3设 $\scriptstyle \varSigma = \{ a a ,   a b ,   b b ,   b a \}$ ，求字符串aaaaabbbba的所有前缀、真前缀、后缀、真后缀、子串。

10.4 λ的前缀是什么？真前缀是什么？后缀是什么？真后缀是什么？

10.5 对于任何字符串 x，x的任意子串 w 是否有唯一的一个前缀y和唯一的一个后缀 z与之对应，使得 $x = y w z ^ { 2 }$

10.6 对于任意字符串 x，x的子串有多少个？

[page:363]

## 第10章 形式语言、自动机与正则表达式

10.7 设 $\scriptstyle \varSigma = \{ a ,   b \}$ 上的语言是 $A = \{ \lambda , a \}$ $B = \{ a, b \}$ $C = \{ a b \}$ ，计算(a) $A ^ { 2 } \circ$ (b) $C _ { \mathrm { ~ \scriptsize ~ o ~ } } ^ { 3 }$ (c) $C A B \circ$ (d) ${ \boldsymbol { A } } ^ { + } \circ$ (e) $C ^ { * } ,$

10.8 证明定理 10.2。

10.9 设A、B、C是有限字母表Σ上的语言，证明或反驳:(a) $(A \cap B)C = AC \cap BC$ (b) $A(B \cap C) = AB \cap AC$ 10.10 证明定理 $10.4(a) \sim (h)$

10.11 设A、B、C和D都是有限字母表Σ上的语言，证明:(a) $( \boldsymbol { A } ^ { * } \boldsymbol { B } ^ { * } ) ^ { * } = ( \boldsymbol { B } ^ { * } \boldsymbol { A } ^ { * } ) ^ { * } .$ (b) $A \cup B \cup C \subseteq A^{*}B^{*}C^{*}$ (c) $( \boldsymbol { A } ^ { + } ) ^ { + } { = } \boldsymbol { A } ^ { + } .$ (d) $(AB)^{*}A = A(BA)^{*}$ (e) $( \boldsymbol { A } ^ { * } \boldsymbol { B } ^ { * } \boldsymbol { C } ^ { * } \boldsymbol { D } ^ { * } ) ^ { * } = ( \boldsymbol { A } \cup \boldsymbol { B } \cup \boldsymbol { C } \cup \boldsymbol { D } ) ^ { * }$

10.12 是否对于任意的语言L，都有 $L ^ { + } { = } L ^ { * } { - } A ?$

10.13 证明:如果A≠∅， $A ^ { 2 } { = } A$ ，那么 $A ^ { * } { = } A \circ$ 反之是否成立？

10.14 设L是空串λ及所有能通过反复使用如下规则构造出的串的集合。若 $\alpha { \in } L ,$ ，则 $a a b   \in   L$ 且 $b a a   \in   L$若 $\alpha { \in } L$ 且 $\beta { \in } L$ ，则 $\alpha \beta { \in } L$

例如， $a b   \in   L$ -取 $\lambda { \in } L$ ，由第一条规则有 $ab = ab \in L$ ；同理， $b a   \in   L$ ; aabb∈L-取 $a = ab \in L$ ，由第一条规则有 $a a b b { = } a \alpha b { \in } L ;$ aabbba∈L——取 $a = a a b b$ 和 $\beta { = } b a$则 $\alpha { \in } L$ 且 $\beta { \in } L$ ，由第二条规则有 $a a b b b a { = } \alpha \beta { \in } L$ 0

（a）证明: $a a b b { \in } L \text { 。 }$

（b）证明: $b a a b a b   \in   L .$ 0

（c）证明: $a a b { \not \in } L \mathrm { { } _ { \circ } }$

（d）证明:若 $\alpha { \in } L$ ，则 α中 a和 b的个数相等。

（e）证明:若α中a和b的个数相等，则 $\alpha { \in } L$ C

10.15 设Σ是字母表，对于任意 $x { \in } \varSigma ^ { { } ^ { * } }$ ,字符串 x 的倒序定义为

若 $|x| < 2$ ，则 $x ^ { \mathrm { T } } { = } x .$ 0

若|x|>1，令 $x { = } y a$ ，其中 $y { \in } \textstyle \sum ^ { * } , \quad a { \in } \textstyle \sum ,$ ，则 $x ^ { \mathrm { T } } { = } a y ^ { \mathrm { T } } .$

设L 是Σ上的一个语言， $L ^ { \mathrm { T } } { = } \{ x ^ { \mathrm { T } } | x { \in } L \}$ 称为语言L的逆。当 $\scriptstyle { \boldsymbol { L } } = { \boldsymbol { L } } ^ { \mathrm { { T } } }$ 时，L称为镜像语言。

给定语言L，令 $\hat { L }   =   L \bigcap L ^ { \mathrm { T } }$ 。如果L是镜像语言， $\hat { L }$ 必定是镜像语言吗？反之，如果 $\hat { L }$ 是镜像语言，L必定是镜像语言吗？

10.16 确定以下文法 $G { = } ( N , T , P , \sigma )$ 是否是上下文有关的、上下文无关的、正则的或者不

[page:364]

## 离散数学及应用（第2版）

是它们任何一种。

(a) $N = \{ \sigma _ { j } ^ { 2 } , T = \{ a \} , P = \{ \sigma \rightarrow a a \sigma , \sigma \rightarrow a a \} \}$

(b) N={σ}, T={a, b}, P={σ→aaσ, σ→a, σ→b}。

(c) $N = \{ \sigma _ { j } ^ { \lambda } , T = \{ a , b , c \} , P = \{ \sigma \rightarrow a \sigma , \sigma \rightarrow b \sigma , \sigma \rightarrow c \} .$ a

(d) N={σ, A}, T={a, b}, P={σ→aA, σ→bσ, A→a} 。

(e) $N = \{ \sigma , A \} , \quad T = \{ a , b \} , \quad P = \{ \sigma \to A b , A \to a A b , A \to \lambda \} .$

(f) $N = \{ \sigma , A \} , \quad T = \{ a , b \} , \quad P = \{ \sigma \to a A , A \to b \sigma , \sigma \to \lambda \} .$ 0

(g) N={σ, A}, T={a, b}, P={σ→bσ, σ→aA, A→aσ, A→bA, A→a, σ→b} 。

(h) $N = \{ \sigma , A \} , \quad T = \{ a , b , c \} , \quad P = \{ \sigma \rightarrow a \sigma , \quad \sigma \rightarrow b A , \quad A \rightarrow b A , \quad A \rightarrow c \} \quad .$

(i) $N = \{ \sigma , A , B \} , T = \{ a , b \} , P = \{ \sigma \rightarrow A A \sigma , A A \rightarrow B , B \rightarrow b B , A \rightarrow a \} \circ$

(j) N={σ, A, B} , T={a, b}, P={σ→A, σ→AAB, Aa→ABa, A→Aa, Bb→ABb, AB→ABB, B→b}。

(k) $N ^ { = } \{ \sigma , \mathcal { A } , B \} , \quad T ^ { = } \{ a , b , c \} , \quad P ^ { = } \{ \sigma { \rightarrow } \mathcal { A } B , \mathcal { A } B { \rightarrow } B \mathcal { A } , \mathcal { A } { \rightarrow } a \mathcal { A } , B { \rightarrow } B b , \mathcal { A } { \rightarrow } a , B { \rightarrow } b \} .$

(1) N={σ, A, B}, T={a, b, c}, P={σ→BAB, σ→ABA, A→AB, B→BA, A→aA, A→ ab, B→b}。

(m) $N = \{ \sigma , \mathcal { A } , B \} , \quad T = \{ a , b , c \} , \quad P = \{ \sigma { \rightarrow } \sigma { \mathcal { A } } , \sigma { \mathcal { A } } { \rightarrow } B \sigma , B \sigma { \rightarrow } a b , B { \rightarrow } a , \mathcal { A } { \rightarrow } c \}$

(n) N={σ, A, B}, T={a, +, (, )}, P={σ→(σ), σ→a+A, A→a+B, B→a+B, B→a} 。

10.17 指出习题10.16(a)～(f)中文法正确的串的特征。

10.18 设 G=(N, T, P, σ)， 其中 $N = \{ \sigma , A , B , C \} , T = \{ a , b , c \} , P = \{ \sigma \rightarrow a a \sigma , \sigma \rightarrow b A , A \rightarrow c B b ,$ A→cb, B→bbB, B→bb} 。

(b）说明语法产生的语言L(G)。

10.19 文法 $G { = } ( N , T , P , \sigma )$ 中 $N = \{ \sigma , A \} , T = \{ a , b \} , P = \{ \sigma \rightarrow b \sigma , \sigma \rightarrow a A , A \rightarrow a \sigma , A \rightarrow b A , A \rightarrow a ,$ σ→b}。证明:w∈L(G)当且仅当w非空且含有偶数个a。

10.20 （a）对文法 G=(N, T, P, σ)，其中 $N = \{ \sigma , A \} , \quad T = \{ a , b \} , \quad P = \{ \sigma \to b \sigma , \quad \sigma \to a A , \quad A \to a \sigma ,$ $A \to bA, A \to a, \sigma \to b \}$ ，给出σ→bbabbab的推导。

(b) 对文法 G=(N, T, P, σ)，其中 N={σ, A, B}, T={a, b},， P={σ→AB, AB→BA, A→ aA, B→bB, A→a, B→b}，给出 σ⇒abab 的推导。

10.21 0 型文法 G=({σ, A, B, C, D, E}, {0, 1}, P, σ)中 P={σ→ABC, AB→0AD, AB→1AE, AB→λ, D0→0D, D1→1D, E0→0E, E1→1E, C→λ, DC→B0C, EC→B1C, 0B→B0, 1B→B1}，请描述L(G)，并写出01100110的推导过程。

10.22 设 G=(N, T, P, σ)， 其中 $N = \{ \sigma , A , B , C \} , T = \{ a , b , c \} , P = \{ \sigma \rightarrow \sigma A , \sigma A \rightarrow B \sigma , B \sigma \rightarrow a b ,$ B→a, A→c}。对语法 G，给出两个不同的由σ到 abc 的推导。

10.23 对文法 G=(N, T, P, σ)，其中 $N = \{ \sigma , A , B \} , T = \{ a , b \} , P = \{ \sigma \rightarrow A B , A \rightarrow a B a , B \rightarrow b A b ,$ A→a, B→b}，画出σ⇒abab 的两棵不同的分析树，并判断G 是否是歧义文法。

10.24设 $\Sigma = \{ a, b \}$ ，请给出Σ上的短语结构语法G，使其语言为(a) $L(G)=\left\{a^{n}b^{n}|n\geqslant1\right\}$ 0

[page:365]

## 第10章 形式语言、自动机与正则表达式

(b) $L(G)=\left\{a^{n}b^{n}|n\geqslant3\right\}$

(c)L(G)={相同个数的 a和 b构成的串，且长度大于 0}。

(d) $L(G)=\left\{a^{n}b^{m}|n\geqslant1,m\geqslant1\right\}$ 0

(e) $L(G)=\left\{a^{n}b^{m}\mid n\geqslant1,m\geqslant3\right\}$ 0

(f) $L(G)=\{a^{n}b^{m}|n\geqslant 2,m$ 是非负偶数}。

(g) $L(G)=\left\{a^{n}b^{m}\right\}n$ 是正整数,m是正奇数}。

10.25 设Σ={a,b}，写一个文法，使其产生的语言是

(a） {a, b}上以 a 开始的字符串。

(b）{a, b}上以 ba 结束的字符串。

(c）{a, b}上以 ba 为子串的字符串。

(d) {a, b}上至少包含 3 个 a 的串。

(e）{a, b}上不含形如 aa 的子串的串。

10.26 给出一个正则文法，产生语言 $L = \{ w | w \in \{ 0 , 1 \} ^ { * }$ 且w不含有两个相邻的1}。

10.27 给出一个产生语言 $L = \{ w w ^ { \mathrm { T } } | w \in \{ 0 , 1 \} ^ { * } \}$ 的上下文相关文法。

10.28设 $\scriptstyle \sum = \{ a ,   b ,   c \}$ ，设计一个短语结构语法G，使其语言为 $L(G)=\left\{x\in\sum^{*}\left|x^{\mathrm{T}}=x\right.\right\}$

10.29 假设 $G _ { 1 }$ 和 $G _ { 2 }$ 都是正则文法，设计一个短语结构语法G，使其语言为 $L(G)=\left\{w_{1} w_{2}\right\}$ $w_{1} \in L(G_{1}), \ w_{2} \in L(G_{2})$ o

10.30假设 $G _ { 1 }$ 和 $G _ { 2 }$ 都是正则文法，设计一个短语结构语法G，使其语言为 $L(G)=\{w\}$ $\scriptstyle { \mathcal { W } } \in L ( G _ { 1 } )$ 或 $w { \in } L ( G _ { 2 } ) \}$ 0

10.31 假设 $G _ { 1 }$ 是正则文法，设计一个短语结构语法G，使其语言为 $L ( G ) { = } L { ( G _ { 1 } ) } ^ { * }$

10.32（希尔伯特曲线，Hilbert curve）设 $L = \{ A , B , F , + , - \} , \{ A \rightarrow - B F + A F A + F B \}$ $B \to +AF - BFB - FA + \}, A$ 是一个林登麦伊尔系统，其中F表示以当前方向画一条固定长度的线段，“+”表示向右顺时针旋转90°，“-”表示向左逆时针旋转90°，A、B不做任何动作。请画出由此推导得到的前5次图形。

10.33（龙曲线，dragon curve）设 $L = ( \{ X , Y , F , + , - \} , \{ X \rightarrow X + Y F + , Y \rightarrow - F X - Y \}$ ,FX)是一个林登麦伊尔系统，其中F表示以当前方向画一条固定长度的线段，“+”表示向右顺时针旋转 $9 0 ^ { \circ }$ ，“_”表示向左逆时针旋转90°，X、Y不做任何动作。请画出由此推导得到的前5次图形。

10.34 给出如下上下文无关文法的巴科斯-诺尔范式表示。

(a) $N = \{ \sigma _ { j } ^ { 2 } , T = \{ a \} , P = \{ \sigma \rightarrow a a \sigma , \sigma \rightarrow a a \} \}$ 0

(b) $N = \{ \sigma \} , \quad T = \{ a , b \} , \quad P = \{ \sigma \rightarrow a a \sigma , \quad \sigma \rightarrow a , \quad \sigma \rightarrow b \} .$

(c) $N = \{ \sigma _ { j } ^ { \lambda } , T = \{ a , b , c \} , P = \{ \sigma \rightarrow a \sigma , \sigma \rightarrow b \sigma , \sigma \rightarrow c \}$ 0

(d) $N = \{ \sigma , A \} , \quad T = \{ a , b , c \} , \quad P = \{ \sigma \rightarrow a \sigma , \sigma \rightarrow b A , A \rightarrow b A , A \rightarrow c \} .$

(e) $N = \{ \sigma , A \} , \quad T = \{ a , b \} , \quad P = \{ \sigma \to b \sigma ,   \sigma \to a \mathcal { A } ,   A \to a \sigma ,   A \to b \mathcal { A } ,   A \to a ,   \sigma \to b \}   \circ$ 5

(f) $N = \{ \sigma , A \} , \quad T = \{ a , b \} , \quad P = \{ \sigma \to a A , \sigma \to b \sigma , A \to a \} .$

(g) $N ^ { = } \{ \sigma , A , B \} , \quad T ^ { = } \{ a , + , ( , ) \} , \quad P ^ { = } \{ \sigma { \rightarrow } ( \sigma ) , \sigma { \rightarrow } a { + } A , A { \rightarrow } a { + } B , B { \rightarrow } a { + } B , B { \rightarrow } a \} .$

$$N { = } \{ \sigma , \mathcal { A } , B \} , \; T { = } \{ a , b , c \} , \; P { = } \{ \sigma { \rightarrow } B \mathcal { A } B , \; \sigma { \rightarrow } \mathcal { A } B \mathcal { A } , \mathcal { A } { \rightarrow } \mathcal { A } B , \; B { \rightarrow } B \mathcal { A } , \mathcal { A } { \rightarrow } a \mathcal { A } , \mathcal { A } { \rightarrow } a b , \; \sigma { \rightarrow } \mathcal { A } \mathcal { A } , \mathcal { A } { \rightarrow } \mathcal { A } \mathcal { A } \} .$$

[page:366]

## 离散数学及应用（第2版）

$B { \rightarrow } b \}$ 0

10.35 给出如下文法的语法图。

(a) $N = \{ \sigma _ { j } ^ { 2 } , T = \{ a \} , P = \{ \sigma \rightarrow a a \sigma , \sigma \rightarrow a a \}$

(b) $N = \{ \sigma _ { i } ^ { \lambda } , T = \{ a , b , c \} , P = \{ \sigma \rightarrow a \sigma , \sigma \rightarrow b \sigma , \sigma \rightarrow c \}$ 0

(c) $N = \{ \sigma , A \} , \quad T = \{ a , b \} , \quad P = \{ \sigma \to b \sigma ,   \sigma \to a \mathcal { A } ,   A \to a \sigma ,   A \to b \mathcal { A } ,   A \to a ,   \sigma \to b \} .$ o

(d) $N ^ { = } \{ \sigma , \mathcal { A } , B \} , \quad T ^ { = } \{ a , b , c \} , \quad P ^ { = } \{ \sigma { \rightarrow } B \mathcal { A } B ,   \sigma { \rightarrow } \mathcal { A } B \mathcal { A } ,   \mathcal { A } { \rightarrow } a \mathcal { A } ,   \mathcal { A } { \rightarrow } a b ,   B { \rightarrow } b \}$ 0

10.36 给出图10.20中的各语法图对应的巴科斯-诺尔范式。

10.37 根据有限状态自动机的状态转移表绘制状态转移图。

(a) $A = \{ S _ { 0 } \}$ ，见表10.5。

(b) $A = \{ S_{0}, S_{2} \}$ ，见表10.6。

(c) $A = \{ S_{0}, S_{2} \}$ ，见表10.7。

表10.5 习题10.37 用表1<table><tr><td rowspan=2><eq>S</eq></td><td colspan=2>I</td></tr><tr><td><eq>\underline { { a } }</eq></td><td><eq>b</eq></td></tr><tr><td><eq>\underline { { | S _ { 0 } | } }</eq></td><td><eq>\underline { { \mathcal { S } _ { 1 } } }</eq></td><td><eq>| S _ { 0 } |</eq></td></tr><tr><td><eq>\underline { { \underline { { \mathcal { S } _ { 1 } } } } }</eq></td><td><eq>S _ { 2 }</eq></td><td><eq>\underline { { \underline { { S _ { 0 } } } } }</eq></td></tr><tr><td><eq>S _ { 2 }</eq></td><td><eq>| \underline { { S _ { 0 } } } |</eq></td><td><eq>S _ { 2 }</eq></td></tr></table>

[page:367]

## 第10章 形式语言、自动机与正则表达式

表 10.6 习题 10.37 用表 2<table><tr><td rowspan=2><eq>S</eq></td><td colspan=2>I</td></tr><tr><td><eq>a</eq></td><td><eq>b</eq></td></tr><tr><td><eq>S _ { 0 }</eq></td><td><eq>S _ { 1 }</eq></td><td><eq>S _ { 1 }</eq></td></tr><tr><td><eq>S _ { 1 }</eq></td><td><eq>S _ { 0 }</eq></td><td><eq>S _ { 2 }</eq></td></tr><tr><td><eq>S _ { 2 }</eq></td><td><eq>S _ { 0 }</eq></td><td><eq>S _ { 1 }</eq></td></tr></table>

表 10.7 习题 10.37 用表 3<table><tr><td rowspan=2><eq>S</eq></td><td colspan=3><eq>I</eq></td></tr><tr><td><eq>a</eq></td><td><eq>b</eq></td><td><eq>c</eq></td></tr><tr><td><eq>S _ { 0 }</eq></td><td><eq>S _ { 1 }</eq></td><td><eq>S _ { 0 }</eq></td><td><eq>S _ { 2 }</eq></td></tr><tr><td><eq>S _ { 1 }</eq></td><td><eq>S _ { 0 }</eq></td><td><eq>S _ { 3 }</eq></td><td><eq>S _ { 0 }</eq></td></tr><tr><td><eq>S _ { 2 }</eq></td><td><eq>S _ { 3 }</eq></td><td><eq>S _ { 2 }</eq></td><td><eq>S _ { 0 }</eq></td></tr><tr><td><eq>S _ { 3 }</eq></td><td><eq>S _ { 1 }</eq></td><td><eq>S _ { 0 }</eq></td><td><eq>S _ { 1 }</eq></td></tr></table>

10.38 由图 10.21 所示的有限状态自动机 M=(S, I, f, A, So)的状态转移图给出 $S _ { 0 } .$ 、集合S、I、A及状态转移表。

10.39 设L是{a, b}上串的有限集合，证明:存在接受L的有限状态自动机。

10.40 画出接受{0,1}上以下语言的有限状态自动机的状态转移图。

(a) $L { = } \{ x | x$ 以000或101 结尾}。

（b）L={x|x 以011或10 开始}。

(c) $L { = } \{ x | x$ 以01开始，以100结尾}。

（d）L={x|x包含3个连续的0或者3个连续的1}。

(e) $L { = } \{ x | x$ 以0110为子串}。

(f) L={x|x 不包含10 或者111}。

（g）L={x|x包含的1的个数是3的倍数}。

(h) $L { = } \{ x | x \}$ 中每个1后面都紧跟一个0}。

(i) $L = \{ 0 ^ { n } 1 ^ { m } 2 ^ { k } | n , m , k \geqslant 1 \}$ 0

（j）L={x|将x看成二进制数时，x除以3余2，除以5余1，x的首字符为1}。

（k）L={x|将x看成二进制数时，x模5和3同余}。

[page:368]

## 离散数学及应用（第2版）

(1) $\{ x | x \in \{ 0 , 1 \} ^ { * }$ 且如果x以1结尾，则它的长度为偶数；如果x以0结尾，则它的长度为奇数}。

10.41 假设 $M { = } ( S , I , f , A , S _ { 0 } )$ 是一个有限状态自动机，构造一个有限自动机 $M ^ { \prime }$ 使得 $L ( M   ^ { \prime } )$ $=  \boldsymbol { I } ^ { * }   -   L ( \boldsymbol { M } )$

10.42 假设 $M_{1} = (S_{1}, I, f_{1}, A_{1}, S_{01})$ 和 $M_{2} = (S_{2},\; I,\; f_{2},\; A_{2},\; S_{02})$ 是两个有限状态自动机，定义$S = S_{1} \times S_{2}, \quad A = A_{1} \times A_{2}, \quad S_{0} = (S_{01}, S_{02}), \quad f(x, (S_{1}, S_{2})) = (f_{1}(x, S_{1}), f_{2}(x, S_{2}))$ 。证明: $M = (S, I, f)$ $\overline { { A } } , \overline { { S _ { 0 } } } )$ 是一个有限状态自动机且接受的语言是 $L ( M _ { 1 } ) \cap L ( M _ { 2 } )$ 0

10.43 假设 $M_{1} = (S_{1}, I, f_{1}, A_{1}, S_{01})$ 和 $M_{2} = (S_{2}, I, f_{2}, A_{2}, S_{02})$ 是两个有限状态自动机，定义$S = S_{1} \times S_{2},\ A = \left\{ (a_{1},a_{2})|a_{1} \in A_{1}  或  a_{2} \in A_{2} \right\},\ S_{0} = (S_{01},S_{02}),\ f(x,(S_{1},S_{2})) = (f_{1}(x,S_{1}),f_{2}(x,S_{2}))$ 0证明: $M { = } ( S , I , f , A , S _ { 0 } )$ 是一个有限状态自动机且接受的语言是 $L ( M _ { 1 } ) \cup L ( M _ { 2 } )$

10.44 根据状态转移表绘制非确定性有限状态自动机的状态转移图。

(a) $A = \{ S_{0}, S_{1} \}$ ，如表10.8所示。

(b) $A { = } \{ S _ { 0 } \}$ ，如表10.9所示。

(c) $A { = } \{ S _ { 1 } \}$ ，如表10.10所示。

表10.8 习题10.44 用表1<table><tr><td rowspan=2><eq>S</eq></td><td colspan=2>I</td></tr><tr><td>a</td><td>b</td></tr><tr><td><eq>S _ { 0 }</eq></td><td>{S1}</td><td><eq>\{ S _ { 0 } , S _ { 2 } \}</eq></td></tr><tr><td><eq>S _ { 1 }</eq></td><td>∅</td><td>{S2}</td></tr><tr><td><eq>S _ { 2 }</eq></td><td>{S1}</td><td>∅</td></tr></table>

表10.9 习题10.44 用表2<table><tr><td></td><td colspan=3>I</td></tr><tr><td>S</td><td>a</td><td>b</td><td>C</td></tr><tr><td><eq>S _ { 0 }</eq></td><td>{S1}</td><td>∅</td><td>∅</td></tr><tr><td><eq>S _ { 1 }</eq></td><td>{S0}</td><td>{S2}</td><td><eq>\{ S _ { 0 } , S _ { 2 } \}</eq></td></tr><tr><td><eq>S _ { 2 }</eq></td><td><eq>\{ S _ { 0 } , S _ { 1 } , S _ { 2 } \}</eq></td><td>{S0}</td><td>{S0}</td></tr></table>

表 10.10 习题 10.44 用表 3<table><tr><td rowspan=2><eq>S</eq></td><td colspan=2>I</td></tr><tr><td>a</td><td>b</td></tr><tr><td><eq>S _ { 0 }</eq></td><td>∅</td><td>{S3}</td></tr><tr><td><eq>S _ { 1 }</eq></td><td><eq>\{ S _ { 1 } , S _ { 2 } \}</eq></td><td>{S3}</td></tr><tr><td><eq>S _ { 2 }</eq></td><td>∅</td><td><eq>\{ S _ { 0 } , S _ { 1 } , S _ { 3 } \}</eq></td></tr><tr><td><eq>S _ { 3 }</eq></td><td>∅</td><td>∅</td></tr></table>

10.45 由图 10.22 所示的非确定性有限状态自动机的状态转移图给出 $S _ { 0 ^ { \circ } }$ 、集合S、I、A及状态转移表。

10.46 构造一个3个状态的非确定性有限状态自动机，接受的语言为 $\left\{ a b , a b c \right\} ^ { * }$

[page:369]

## 第10章 形式语言、自动机与正则表达式

10.47 画出接受{0,1}上以下语言的非确定性有限状态自动机的状态转移图。

（a）L={x|x 以011 或10开始}。

(b)L={x|x 以 011 或 10 结尾}。

（c)L={x|x 以01 开始但不以01 结尾}。

（d)L={x|x 包含 0110或者 111}。

(e)L={x|x 包含 101 和 11}。

10.48 由表10.8至表10.10和图10.22的非确定性有限状态自动机构造等价的确定性有限状态自动机。

10.49 由图10.21的确定性有限状态自动机构造等价的正则文法。

10.50 由以下正则文法 $G { = } ( N , T , P , \sigma )$ 构造等价的非确定性有限状态自动机。

(a) $N = \{ \sigma _ { j } ^ { 2 } , T = \{ a , b \} , P = \{ \sigma \rightarrow a \sigma , \sigma \rightarrow a , \sigma \rightarrow b \} \}$

(b) $N = \{ \sigma , A \} , \quad T = \{ a , b \} , \quad P = \{ \sigma \rightarrow a A , A \rightarrow b \sigma , A \rightarrow a \} .$

(c) $N = \{ \sigma , A \} , \quad T = \{ a , b \} , \quad P = \{ \sigma \rightarrow a A , A \rightarrow b \sigma , \sigma \rightarrow \lambda \}$ 0

(d) N={σ, A, B}, T={a, b, c}, P={σ→a, σ→aA, A→a, A→aA, A→cA, A→bB, B→a, $B { \rightarrow } b , B { \rightarrow } c , B { \rightarrow } a B , B { \rightarrow } b B , B { \rightarrow } c B \}   .$

(e) $N ^ { = } \{ \sigma , \mathcal { A } , \mathcal { B } , \mathcal { C } \} , \quad T ^ { = } \{ a , b , c \} , \quad P ^ { = } \{ \sigma { \rightarrow } a \mathcal { A } ,   \sigma { \rightarrow } b \mathcal { B } ,   \sigma { \rightarrow } c \mathcal { B } , \mathcal { A } { \rightarrow } a \mathcal { A } , \mathcal { A } { \rightarrow } a \mathcal { C } , \mathcal { A } { \rightarrow } a ,$ $B { \rightarrow } a C , B { \rightarrow } b A , B { \rightarrow } c A , B { \rightarrow } c , B { \rightarrow } \lambda , C { \rightarrow } \lambda \}   \mathrm { {  } }$

10.51 证明:语言 $L(G)=\left\{a^{n}b^{n}c^{n}|n=1,2,3,\cdots\right\}$ 不是正则语言。

10.52证明: $L = \{ a^{n!} | n \geqslant 0 \}$ 不是正则语言。

10.53 若 $\scriptstyle \varSigma = \{ a ,   b ,   c \}$ ，给出下述正则表达式对应的正则集。

(a) $( a + b ) c { b } ^ { * } .$ 0

(b) $a ( b b ) ^ { * } c _ { \circ }$

(c) $( { \boldsymbol { b } } ^ { * } { \boldsymbol { a } } { \boldsymbol { b } } ^ { * } { \boldsymbol { a } } { \boldsymbol { b } } ^ { * } ) ^ { * } .$

10.54 给出正则表达式以对应下述正则集。

(a) $L = \{ 0 ^ { n } 1 ^ { m } 2 ^ { k } | n , m , k \geqslant 1 \}$ 0

（b）L={x|x 以01 开始以100 结尾}。

（c）L={x|x的倒数第3个字符是0}。

（d)L={x|x 长度为偶数}。

(e)L={x|x 有奇数个 0}。

(f)L={x|x 包含3 个连续的 0或者3 个连续的1}。

(g) $L = \{ x | x \in \{ 0 , 1 \} \}$ 且:如果x以1结尾，则它的长度为偶数；如果x以0结尾，

[page:370]

## 离散数学及应用（第2版）

则它的长度为奇数}。

（h）L={x|x中只有一对连续的0}。

(i) L={x|x 中最多有一对连续的 0}。

(j）L={x|x中最多有一对连续的0或者最多有一对连续的1}。

（k）L={x|x中有一对连续的0并且有一对连续的1}。

(1)L={x|x中最多有一对连续的0并且最多有一对连续的1}。

10.55 对语法 $G { = } ( N , T , P , \sigma )$ ，给出对应语言L(G)的正则表达式。

(a) $N = \{ \sigma \} , \quad T = \{ a \} , \quad P = \{ \sigma \to a a \sigma , \quad \sigma \to a a \}$ 0

(b) $N = \{ \sigma _ { j } ^ { \lambda } , T = \{ a , b \} , P = \{ \sigma \rightarrow a a \sigma , \sigma \rightarrow a , \sigma \rightarrow b \} .$ 0

(c) $N = \{ \sigma , A \} , \quad T = \{ a , b , c \} , \quad P = \{ \sigma \rightarrow a \sigma , \quad \sigma \rightarrow b \sigma , \quad \sigma \rightarrow c \} .$

(d) $N = \{ \sigma , A \} , \quad T = \{ a , b \} , \quad P = \{ \sigma \to a A , A \to b \sigma , A \to a \} .$ 0

10.56 给出下述正则表达式对应的语法图。

(a) $(a + bc) \boldsymbol{b}^{*} 。$

(b) $a+(b+c^{*})^{*}$ 0

(c) $a ( { ( c b ) } ^ { * } { + } { ( b a ) } ^ { * } )$ 0

10.57 给出图10.23 中的各语法图对应的正则表达式。

[page:371]

## 附录A

## 综合性研讨专题

本部分主要介绍应用离散数学知识分析和解决的一些问题，其中很多问题不乏趣味性，可供课后阅读和研讨使用。

## A.1 凑邮资、分油、爬台阶与台球桌

## 【关键词】裴蜀等式

## A.1.1 邮资问题

首先介绍一个凑邮资的问题。

【例A.1】 当n>17时，用面值4元和7元的邮票可支付任何n元邮资。即，对于任意正整数 n>17 时，存在非负整数 a、b 使得 $4a+7b=n$

证明.假设 P(n)表示“可以用面值4元和 7元的邮票支付 n 元邮资”，令Q(n)=P(n)∧ $P(n+1) \land P(n+2) \land P(n+3)$ o

则 P(18)为真:18=2×7+4；P(19)为真:19=3×4+7；P(20)为真:20=5×4；P(21)为真:$21{=}3{\times}7$ 。于是Q(18)为真。

假设对于 $k { \geqslant } 1 8 ,$ ，有 $Q(k)=P(k)\land P(k+1)\land P(k+2)\land P(k+3)$ 为真。由P(k)为真易知P(k+4)为真（多使用一张面值4元的邮票即可)，故而 $Q(k+1)=P(k+1)\land P(k+2)\land P(k+3)\land P(k+4)$为真。

由归纳法可以完成证明。

更一般的情况是:令 a 和 b 是正整数，不失一般性地假设 GCD(a，b)=1（读者可以思考这个假定的合理性)。则存在n，使得对所有的正整数k≥n，k元的邮资都可以用a元的邮票和b元的邮票凑齐，即找到非负整数s和t使得 $s a + t b = k$ ，这就是1.2节中介绍的裴蜀等式。

定理 A.1 对于不全为 0 的整数 x、y 和 $d ,$ 方程 $s x + t y = d$ 存在整数解 s 和 t 当且仅当$\mathrm { G C D } ( x , y ) | d \mathrm {  。  }$ 方程 $s x + t y = d$ 称作裴蜀（Bezout）等式。

对于裴蜀等式的解，有如下一般性结果。

定理 A.2 假设 x、y 和 $d$ 是不全为0的整数， $s _ { 0 }$ 和 $t _ { 0 }$ 是方程 $s x + t y = d$ 的一组整数解，则方程 sx+ty=d的所有整数解为

[page:372]

## 372

$$s = s_{0} + \frac{y}{\mathrm{GCD}(x,y)} \times k$$

证明.“构成解”很容易验证。反过来，假设 $s _ { 1 }$ 和 $t _ { 1 }$ 是方程 $s x + t y = d$ 的一组整数解，则有 $(s_{0}-s_{1})x=-(t_{0}-t_{1})y$

$$\left( s _ { 0 } - s _ { 1 } \right) \frac { x } { \mathrm { G C D } ( x , y ) } = - \left( t _ { 0 } - t _ { 1 } \right) \frac { y } { \mathrm { G C D } ( x , y ) } , \quad 由于 \frac { x } { \mathrm { G C D } ( x , y ) } 和 \frac { y } { \mathrm { G C D } ( x , y ) }$$

(习题1.51)，有 $\frac{x}{\mathrm{GCD}(x,y)} \left| (t_0 - t_1) \right|$ (习题1.43)，令 $k = \left( t_{0} - t_{1} \right) \bigg/ \frac{x}{\mathrm{GCD}(x, y)}$ ，即得

$$s = s_{0} + \frac{y}{\mathrm{GCD}(x, y)} \times k$$

□

推论 假设大于1的整数x与y互素，则存在整数 $s_{0}>0,t_{0}<0,s_{1}<0,t_{1}>0$ 使得 $s_{0}x + t_{0}y = 1$及 $s _ { 1 } x { + } t _ { 1 } y { = } 1$ o

下面首先给出邮资问题的一个构造性的形式解。

如果 a或者b为1，可以取n=1；因此假设 $a { \geq } 1$ 且 $b { \geq } 1$

存在整数 s 和 t，满足 $s a - t b = 1 , s , t > 0$ 。令 $n { = } t ( a { - } 1 ) b$ 。则断言只利用 a元和b元邮票可以凑齐 $n, n+1, \cdots, n+a-1$ 元邮资:由 $n+j=t(a-1)b+j(sa-tb)=(js)a+t((a-1)-j)b$ ，其中 $0 { \leqslant }$ $j { \leqslant } a { - } 1$ ，可知用 $j s$ 张a元邮票和 $t ( a { - } 1 { - } j )$ 张 b 元邮票凑齐 $k   =   n   +   j$ 元邮资。

假设 $x \equiv (k - n) / a \rfloor , y \equiv (k - n) \bmod a$ ，则用 x+sy 张 a 元邮票和 $t ( a { - } 1 { - } y )$ 张b 元邮票凑齐$n { \dagger } j$ 元邮资。

【例A.2】 $a=7,   b=4$ 时， $1 = 3 \times 7 - 5 \times 4, \quad s = 3, \quad t = 5$ 。计算 $n=5\times(7-1)\times4=120$ 。对于 $k { = } 2 2 2$ $x = (222 - 120) / 7 = 14, \quad y = (222 - 120) \bmod 7 = 4$ ，于是使用 14+3×4=26 张 7 元邮票和$5 \times (7 - 1 - 4) = 10$ 张4元邮票凑齐222元邮资。

下面给出更“紧”的理论上的下界 $n   ,$ 0

定理 A.3 设 a 和 b 是互素的正整数，则当 $n > a b - a - b$ 时，方程 $ax + by = n$ 均有非负整数解，而 $ax+by=ab-a-b$ 没有非负整数解。

证明. 假设 $n > a b - a - b$ ，方程 $ax + by = n$ 的所有整数解为 $x = x_{0} + bt, \; y = y_{0} - at,$ ，其中 $t { \in \mathbb { Z } }$取 $t { = } t _ { 0 }$ ，使得 $0 \leqslant x_{0}+bt_{0} \leqslant b-1$ ，则由 $a(x_{0}+bt_{0})+b(y_{0}-at_{0})=n>ab-a-b$ ，有 $b ( y _ { 0 } - a t _ { 0 } ) >$ $a b - a - b - a ( b - 1 ) = - b$ ，从而 $y _ { 0 } – a t _ { 0 } \mathrm { { > } - 1 }$ ，即 $y_{0}-at_{0}\geqslant 0$ 。于是 $(x_{0}+bt_{0},y_{0}-at_{0})$ 就是 $ax + by = n$ 的一个非负整数解。

另一方面，若非负整数x和y使得 $ax+by=ab-a-b$ ，则 $a(x + 1) + b(y + 1) = ab$ 于是 $b | a ( x + 1 )$由 $\mathrm{GCD}(a, b) = 1$ 有 $b | x { + } 1$ ，从而 $x + 1 \geqslant b$ ；同样可知 $y + 1 \geq a$ 。因此 $ab = a(x + 1) + b(y + 1) \geqslant$ $ab + ab = 2ab$ ，导致矛盾，所以 $ax+by=ab-a-b$ 不存在非负整数解。 □

定理表明，如果a和b是互素的正整数，则 $N = a b - a - b$ 具有这样的性质:N元邮资

[page:373]

## 附录A 综合性研讨专题

无法用a元的邮票和b元的邮票凑齐；而对于每个大于N的正整数k，k元的邮资都可以用a元的邮票和b元的邮票凑齐。

## A.1.2 分油问题

接下来介绍第二个有趣的数学问题—分油（酒/水）问题（水壶问题）。它是一个历史悠久、流传广泛的初等的数学趣题，古往今来，在世界各地有很多种版本。

（日）《尘劫记》:斗桶中有油一斗（10升），7升和3升各有一，今欲油分两个5升。

（法〕泊松分酒问题:某人有12品脱美酒，想把一半赠人，但只有一个8品脱和一个5品脱的容器，问怎样才能把6品脱的酒倒入8品脱的容器中。

（俄）别莱利曼《趣味几何学》（原书10.8节):一只水桶可容12杓水，还有两只空桶，一只容量为9杓，另一只为5杓，怎样利用这两只空桶来把这大水桶中满盛的水分做两半？

（波兰）史泰因豪斯《数学万花镜》（原书第3章）:有3个容积各为12升、7升和5升的容器，要将装在最大容器中的12升酒2等分。

（美）帕帕斯《数学趣闻集锦（下)》:有一个8公升装满苹果酒的壶，和一个3公升、一个5公升的空壶，要怎么操作才能将苹果酒平分成两个4公升？

我国韩信分油问题:一天，韩信在路上遇到两个路人争执不下，原因是两人有装满10斤的油篓和两个3斤、7斤的（无刻度）空油篓，无法平均分出两份，每份5斤油。

只考虑其中一类子问题:简记3个桶（容器）为大桶、中桶、小桶，简记“3个容器容积分别为a升、b升、c升 $( b > c )$ ，要从装在最大容器中的a升油（酒/水）中分出 $d$升油（酒/水）， $a \geq b + c -$ -1, $a-b-c \le d<a$ ”为一个 $\left| ( a , b , c ; d ) \right|$ 问题。

$a - d \leqslant b + c$ (即 $a-b-c \le d$ 的要求是为了保证在大桶留下 $d$ 升油（酒/水）后，多出来的a-d升油（酒/水）有地方可放。

不失一般性，可以假定 $\mathrm { G C D } ( b , c ) { = } 1$

可以给出 $( a , b , c ; d )$ 问题的两个通用方法。

方法1:

0 倒油方法只允许:大桶⇒中桶，中桶⇒小桶，小桶⇒大桶

1若中桶已空，则从大桶中将油倒满中桶。若未达到目标，则进行步骤2

2 若小桶未满且中桶有油，则从中桶中倒油入小桶

3 若小桶已满，则从小桶中将油倒入大桶。若未达到目标，则返回步骤1

能够做到步骤1中的“倒满”实际上是由 $a \geqslant b + c - 1$ 保证的。如果 $a < b + c - 1$ ，例如(6,5,3)的情况，则进行到 $( ( 6 , 0 , 0 ) { \rightarrow } ( 1 , 5 , 0 ) { \rightarrow } ( 1 , 2 , 3 ) { \rightarrow } ( 4 , 2 , 0 ) { \rightarrow } ( 4 , 0 , 2 ) )$ 后，方法1无法进行下去。

【例A.3】 (10,7,3;5)的解决方法如图 A.1所示。

方法2:

0 倒油方法只允许:大桶⇒小桶，小桶⇒中桶，中桶⇒大桶

1若小桶已空，则从大桶中将油倒满小桶。若未达到目标，则进行步骤2

[page:374]

## 离散数学及应用（第2版）

2 若中桶未满且小桶有油，则从小桶中倒油入中桶

3 若中桶已满，则从中桶中将油倒入大桶。若未达到目标，则返回步骤1

能够做到步骤1中的“倒满”实际上是由a≥b+c-1保证的。如果a<b+c-1，例如(6, 5,4)的情况，则进行到 $( 6 , 0 , 0 ) { \rightarrow } ( 2 , 0 , 4 ) { \rightarrow } ( 2 , 4 , 0 )$ 后，方法2无法进行下去。

【例 A.4】 (10,7,3;5)的解决方法如图 A.2所示。

接下来解释这两个方法的合理性。

将中桶和小桶看作一个整体系统，而最终目标就是在该系统里留下a-d升油。

方法1的步骤1相当于在系统里“+b”，步骤3相当于在系统里“-c”，而步骤2是系统内部变化。例如图A.1就对应于 $2 \times ( + 7 ) + 3 \times ( - 3 ) = 10 - 5$ ，其中(a)、(g)表示“+7”，(c)、(e)、(i)表示“-3”。

方法2的步骤1相当于在系统里“+c”，步骤3相当于在系统里“-b”，而步骤2是系统内部变化。例如图A.2就对应于 $4 \times ( + 3) + 1 \times ( - 7) = 10 - 5$ ，其中(a)、(c)、(e)、(i)表示“+3”，

[page:375]

## 附录A 综合性研讨专题

(g)表示“-7”。

这其实就是裴蜀等式 $s b + t ( - c ) = a - d$ 和 $s(-b)+tc=a-d$

由于 $a - d \succ 0 \succ ( b - 1 ) ( - c - 1 ) \succ b ( - c ) - b - ( - c )   , \quad a - d \succ 0 \succ ( c - 1 ) ( - b - 1 ) \succ c ( - b ) - c - ( - b )$ , GCD(b, $-c)=\mathrm{GCD}(-b,\ c)=1$ ，由定理A.3方程 $s b + t ( - c ) = a - d$ 和方程 $s(-b)+tc=a-d$ 都一定存在非负整数解。

如果 $( s _ { 0 } , t _ { 0 } )$ 是一组非负特解，则通解是 $s = s_{0} + c k, \quad t = t_{0} + b k$ ，其中k是整数，易见存在最小非负解。

【例A.5】 变化的泊松分酒问题:某人有12品脱美酒，但只有一个8品脱和一个5品脱的容器，问怎样才能分出6品脱的酒。

由 $4 \times ( + 8 ) + 4 \times ( - 5 ) = 12 - 0$ 和 $4 \times ( + 5 ) + 1 \times ( - 8 ) = 12 - 0$ 可以得到分酒的两种方法，如表A.1所示。

[page:376]

## 离散数学及应用（第2版）

表 A.1 例 A.5 用表<table><tr><td colspan=4>方法1</td><td colspan=4>方法2</td></tr><tr><td>大桶</td><td>中桶</td><td>小桶</td><td>备注</td><td>大桶</td><td>中桶</td><td>小桶</td><td>备注</td></tr><tr><td>12</td><td>0</td><td>0</td><td>+8</td><td>12</td><td>0</td><td>0</td><td>+5</td></tr><tr><td>4</td><td>8</td><td>0</td><td></td><td>7</td><td>0</td><td>5</td><td></td></tr><tr><td>4</td><td>3</td><td>5</td><td>-5</td><td>7</td><td>5</td><td>0</td><td>+5</td></tr><tr><td>9</td><td>3</td><td>0</td><td></td><td>2</td><td>5</td><td>5</td><td></td></tr><tr><td>9</td><td>0</td><td>3</td><td>+8</td><td>2</td><td>8</td><td>2</td><td>-8</td></tr><tr><td>1</td><td>8</td><td>3</td><td></td><td>10</td><td>0</td><td>2</td><td></td></tr><tr><td>1</td><td>6</td><td>5</td><td>-5</td><td>10</td><td>2</td><td>0</td><td>+5</td></tr><tr><td>6</td><td>6</td><td>0</td><td></td><td>5</td><td>2</td><td>5</td><td></td></tr><tr><td>6</td><td>1</td><td>5</td><td>-5</td><td>5</td><td>7</td><td>0</td><td>+5</td></tr><tr><td>11</td><td>1</td><td>0</td><td></td><td>0</td><td>7</td><td>5</td><td></td></tr><tr><td>11</td><td>0</td><td>1</td><td>+8</td><td></td><td></td><td></td><td></td></tr><tr><td>3</td><td>8</td><td>1</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>3</td><td>4</td><td>5</td><td>-5</td><td></td><td></td><td></td><td></td></tr><tr><td>8</td><td>4</td><td>0</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>8</td><td>0</td><td>4</td><td>+8</td><td></td><td></td><td></td><td></td></tr><tr><td>0</td><td>8</td><td>4</td><td></td><td></td><td></td><td></td><td></td></tr></table>

【例A.6】部分不满足a≥b+c-1的问题也可使用这两个方法解决。例如〔俄〕别莱利曼《趣味几何学》中的问题:一只水桶可容12杓水，还有两只空桶，一只容量为9杓，另一只为5杓，怎样利用这两只空桶来把这大水桶中满盛的水分做两半？

解. 由3×(+5)+1×(-9)=12-6 可以得到分水的一种方法，如表A.2 所示。

表 A.2 例 A.6 用表<table><tr><td>大桶</td><td>中桶</td><td>小桶</td><td>备注</td></tr><tr><td>12</td><td>0</td><td>0</td><td>+5</td></tr><tr><td>7</td><td>0</td><td>5</td><td></td></tr><tr><td>7</td><td>5</td><td>0</td><td>+5</td></tr><tr><td>2</td><td>5</td><td>5</td><td></td></tr><tr><td>2</td><td>9</td><td>1</td><td>-9</td></tr><tr><td>11</td><td>0</td><td>1</td><td></td></tr><tr><td>11</td><td>1</td><td>0</td><td>+5</td></tr><tr><td>6</td><td>1</td><td>5</td><td></td></tr><tr><td>6</td><td>6</td><td>0</td><td></td></tr></table>

## A.1.3 登阶问题

有一个n阶的台阶，只允许向上登p阶或者向下走q阶。那么从地面开始，是否可

[page:377]

## 附录A 综合性研讨专题

以登上台阶顶部？

这个问题似乎只要求解方程 $ps+(-q)t=n$ 的非负整数解即可。但实际上情况复杂得多，例如 $p { = } 7 , q { = } 4$ 时，虽然 $1 \times 7 + 1 \times ( - 4) = 3$ ，但是显然不可能登上只有3阶的台阶顶部；虽然$3 \times 7 + 3 \times ( - 4) = 9$ ，但是依然不存在登上9阶台阶顶部的方法。

断言:假设每次只允许向上登p阶或向下行q阶， $\mathrm { G C D } ( p , q ) { = } 1$ 。如果台阶阶数至少$p { + } q { - } 1$ ，则一定可以登顶，而且这个界是“紧的”，即台阶阶数为 $p { + } q { - } 2$ 时有可能无法登顶。

【例A.7】台阶恰好 $n = 9 = ( 7 + 4 - 1 ) - 1$ 阶，则只允许向上登7阶、向下行4阶是无法做到的。

假设台阶恰好 $n = p + q - 1$ 阶，只允许向上登p阶，向下行q阶， $\mathrm { G C D } ( p , q ) { = } 1$ ，可以将“登到第k阶 $(1 \leqslant k \leqslant p + q - 1)$ 这一问题转化为一个分油问题。当 $p { > } q$ 时，转为只使用方法1的 $\scriptstyle { \left( n , p , q ; p + q - 1 - k \right) }$ 问题；当 $p { \leq } q$ 时，转为只使用方法2的 $( n , q , p ; p   +   q   -   1   -   k )$ 问题。

【例A.8】 $p { = } 7$ $q { = } 4$ 的情况见图 A.3(a); $p { = } 4 , q { = } 7$ 的情况见图 A.3(b)。

【例A.9】表A.1的左半部分方法1的“备注”栏给出了“共12阶，只允许向上登8阶，向下行5阶，如何登顶？”的一个解决方法:上8(8)、下5(3)、上8(11)、下 $5 ( 6 )$下5(1)、上8(9)、下 $5 ( 4 )$ 、上8(12)；而表A.1的右半部分方法2的“备注”给出了“共12阶，只允许向上登5阶、向下行8阶”的一个解决方法:上5(5)、上5(10)、下 $8 ( 2 )$上5(7)、上5(12)。（括号中表示所在阶的位置，地面记为0。)

当台阶阶数超过 $p { + } q { - } 1$ 时，例如阶数 $n = p + q - 1 + 5, \quad 5 \leqslant p + q - 1$ ，可以先利用第 $1 { \sim } p { + } q { - } 1$阶台阶到达位置5，之后再从位置5到达位置n（间隔共 $p { + } q { - } 1$ 阶)。

（转为分油问题，相当于先分出5升油在中桶和小桶中，之后将中桶和小桶的油倒在地上或河里，然后再分出来 $p { + } q { - } 1$ 升油。)

一般地讲，假设台阶阶数为 $m = (p + q - 1) + s \quad (s \geqslant 0)$ ，则可以按如下步骤登顶:

（1）利用第0阶到第 $p { + } q { - } 1$ 阶，到达位置 $s \bmod p \text{。 }$

(2) 再向上登 $| s / p |$ 次，到达位置 $(s \bmod p) + p \times \lfloor s/p \rfloor = s$ 0

[page:378]

## 离散数学及应用（第2版）

（3）从位置s出发登顶到达位置 m（间隔共p+q-1阶）。

## A.1.4 台球问题

假设台球桌是一个 a×b的矩形（如图A.4所示)，不失一般性地假定 $\mathrm{GCD}(a,b) = 1$假设球桌在坐标(0,0)、(a, 0)、(0, b)、(a, b)位置有4个球洞。台球的位置在 $( x , y )$ ，其中整数 x、y满足 $0 \leqslant x < a,\quad 0 \leqslant y < b$ 。球只允许以朝右斜上 $4 5   ^ { \circ }$ 击出，球碰到桌边后反弹。

【例 A.10】 a=3，b=5，x=0，y=0时（很靠近球洞 A，但是不在球洞中)，通过图A.5可以看出，以桌边为轴的连续镜像的反射可以将球的前进轨迹连接为直线，台球在击碰桌边5-1+3-1=6 次后落入球洞D。

对于一般情况，图A.6表明该问题相当于求解方程 $s a + ( a - x ) = t b + ( b - y )$ ，即$s a + t ( - b ) = ( b - y ) - ( a - x )$ 0

由 $((b - y) - (a - x)) - a(-b) + a + (-b) = ab + x - y = (a - 1)b + x + (b - y) > 0$ ，根据定理A.3，该方程存在非负整数解。如果 $( s _ { 0 } , t _ { 0 } )$ 是一组非负特解，则通解是 $s { = } s _ { 0 } { + } c k$ $t { = } t _ { 0 } { + } b k$ ，其中k是整

[page:379]

## 附录A 综合性研讨专题

数，易见存在最小非负解 $( s _ { 1 } ,   t _ { 1 } )$

从直观上讲，台球要向上穿过 $t _ { 1 }$ 个“镜像”台球桌，而每次“穿过”都相当于与水平桌边碰撞并反弹；台球要向右穿过 $s _ { 1 }$ 个“镜像”台球桌，而每次“穿过”都相当于与垂直桌边碰撞并反弹；因此台球在碰撞桌边 $s _ { 1 } { \scriptstyle + t _ { 1 } }$ 次后落入某球洞。

例如 x=0，y=0时，方程为 $sa+(a-x)=tb+(b-y)$ ，即(s+1)a=(t+1)b，由于 $\mathrm{GCD}(a,b) = 1$因此最小非负解为 $s _ { 1 } { = } b { \cdot }$ -1, $t _ { 1 } { = } a { - } 1$ ，台球在碰撞桌边a+b-2次后落入球洞。

## A.2 基于模运算的校验码

【关键词】模运算；求余；素数

## A.2.1 EAN-13 码

UPC（Universal Product Code，统一商品代码）即通常讲的“条形码”。美国的乔·伍德兰德（JoeWoodland）和贝尼·西尔佛（BenySilver）两位工程师最早研究用条形码表示食品项目以及相应的识别系统设备，并于1949年获得了美国的专利。UPC码共有A、B、C、D、E5种版本。

EAN（European Article Number，欧洲物品编号）条码是欧洲的国际物品编码协会（International Article Numbering Association）制定的一种条码，是在 UPC-A 标准的基础上建立的。EAN条码符号有标准版和缩短版两种，标准版由13位数字构成，又称为EAN-13码，缩短版由8位数字构成，又称为EAN-8码。两种条码的最后一位为校验位，由前面的12位或7位数字计算得出。我国于1991年加入EAN组织。

● EAN-13码由前缀码、生产厂商代码（厂商识别码）、商品项目代码和校验码组成。

• 前缀码是国际EAN组织标识各会员组织的代码，我国为 690～695。

• 变长的生产厂商代码是EAN编码组织分配给厂商的代码。

● 商品项目代码由厂商自行编码。

• 校验码，只有一位，取值范围为0～9，目的是校验代码的正确性。计算方法是用1分别乘以EAN-13的前12位(位数从左到右为1～12）中的奇数位，用3乘

[page:380]

## 离散数学及应用（第2版）

以偶数位，二者求和得到结果S，然后校验码为10-(Smod10)。换言之，用1分别乘以EAN-13的所有奇数位(位数从左到右为1～13)，用3乘以全部偶数位，二者的和是10的倍数。

【例A.11】以条形码6940211890004为例。此条形码分为4个部分。

第一部分:国家和地区代码，1～3位，该条码的694是中国的国家代码之一。

第二部分和第三部分是生产厂商代码及厂内商品代码，对应该条码的021189000。

第13位:共1位，由694021189000计算得来，过程见表A.3。

表 A.3 EAN-13 码示例<table><tr><td>6</td><td>9</td><td>4</td><td>0</td><td>2</td><td>1</td><td>1</td><td>8</td><td>9</td><td>0</td><td>0</td><td>0</td><td>S</td><td>10–(S mod 10)</td></tr><tr><td>6</td><td>27</td><td>4</td><td>0</td><td>2</td><td>3</td><td>1</td><td>24</td><td>9</td><td>0</td><td>0</td><td>0</td><td>76</td><td>4</td></tr></table>

## A.2.2 新版国际标准书号ISBN-13

新版国际标准书号（International Standard Book Number，ISBN）由13 位数字组成，并以4个连接号或4个空格分隔为5组，每组数字都有固定的含义。

第一组:978或979。

第二组:国家、语言或区位代码（例如中国为978-7，表示汉语）。

第三组:出版社代码，由各国家或地区的国际标准书号分配中心分配给各个出版社。

第四组:书序码，是该出版物的代码，由出版社具体给出。

第五组:校验码，只有一位，计算方法与EAN-13相同。

【例A.12】某图书的ISBN为978-7-100-06938-0，其中978-7表示汉语，100表示出版社为商务印书馆，06938为图书的代码。9+8+1+0+6+3=27，3×(7+7+0+0+9+8)=93，于是校验码为 10-((27+93) mod 10)=0。

## A.2.3 第二代身份证

1984年4月6日国务院发布《中华人民共和国居民身份证试行条例》，并且开始颁发第一代居民身份证。2004年3月29日起，中国正式开始为居民换发第二代居民身份证，其编码方法如表A.4所示。

表A.4 第二代居民身份证编码方法<table><tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td></tr><tr><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>A</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>M</td><td>M</td><td>D</td><td>D</td><td>B</td><td>B</td><td>B</td><td>X</td></tr><tr><td colspan=6>地址码</td><td colspan=8>出生日期码</td><td colspan=3>顺序及性别码</td><td>校验码</td></tr></table>

其中，第1、2位数字表示所在省（直辖市、自治区）的代码（例如北京市为11），第3、4位数字表示所在地级市（自治州）的代码，第5、6位数字表示所在区（县、自治县、县级市）的代码，第7～14位数字表示出生年月日，第15、16位数字表示所在地的派出所的代码，第17位数字表示性别（奇数表示男性，偶数表示女性），第18位数字

[page:381]

## 附录A 综合性研讨专题

是校检码（由前17位计算得来）。

为表述方便，将身份证的18位数自左而右记作 $K_{17}, K_{16}, \cdots, K_{1}, K_{0}$

校检码的计算方法符合ISO/IEC7064:2003，具体如下:

1. 将前17位数分别乘以不同的系数。从左至右前17位的系数 $( W _ { 1 7 } , \quad W _ { 1 6 } , \ldots , \quad W _ { 1 } )$ 分别为:7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 (可以看出 $w _ { i } { = } 2 ^ { i } { \bmod { 2 } }$ 11)。

2.将这17个数字和系数相乘的结果累加后模11求余。

3. 余数0，1，2，3，4，5，6，7，8，9，10分别对应（相当于下述公式中的函数f）的校验码为1，0，X，9，8，7，6，5，4，3，2。（即校验码与余数的和模11余1，X代表10）

这个计算方法使用公式表示就是 $f(\sum_{i = 1}^{17} K_i \times W_i \bmod 11) = (12 - \sum_{i = 1}^{17} K_i \times W_i) \bmod 1$ 11，于是 $\sum_{i = 0}^{17} K_{i} \times 2^{i} \equiv 1(\bmod 11)$

【例A.13】某（虚拟）身份证号的前17位为11010420180915195，最后一位校验码的计算过程见表A.5，再通过查询表A.6即得校验码是2。

表 A.5 例 A.13 用表 1<table><tr><td>i</td><td>17</td><td>16</td><td>15</td><td>14</td><td>13</td><td>12</td><td>11</td><td>10</td><td>9</td><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td><eq>\mathrm{Sum}(K_i \times W_i)</eq></td><td>Sum mod 11</td></tr><tr><td><eq>K _ { i }</eq></td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>4</td><td>2</td><td>0</td><td>1</td><td>8</td><td>0</td><td>9</td><td>1</td><td>5</td><td>1</td><td>9</td><td>5</td><td rowspan=3>241</td><td rowspan=3>10</td></tr><tr><td><eq>W _ { i }</eq></td><td>7</td><td>9</td><td>10</td><td>5</td><td>8</td><td>4</td><td>2</td><td>1</td><td>6</td><td>3</td><td>7</td><td>9</td><td>10</td><td>5</td><td>8</td><td>4</td><td>2</td></tr><tr><td><eq>K _ { i } x W _ { i }</eq></td><td>7</td><td>9</td><td>0</td><td>5</td><td>0</td><td>16</td><td>4</td><td>0</td><td>6</td><td>24</td><td>0</td><td>81</td><td>10</td><td>25</td><td>8</td><td>36</td><td>10</td></tr></table>

表 A.6 例 A.13 用表 2<table><tr><td>S</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr><tr><td>f(S)</td><td>1</td><td>0</td><td>X</td><td>9</td><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td></tr></table>

第二代身份证的验证码可以发现1个字符的错误。假设某个 $K _ { j }$ 被错抄成 $K_{j}^{\prime} \quad (0 \leqslant j$ ${ \leqslant } 1 7 )$ ，则 $\sum_{i = 0,i \neq j}^{17} K_i \times 2^i + K_j' \times 2^j = \sum_{i = 0}^{17} K_i \times 2^i + \left( K_j' - K_j \right) \times 2^j = 1 + \left( K_j' - K_j \right) \times 2^j \pmod{11}$由于11是素数，而且2和 $\left( K _ { j } ^ { \prime } - K _ { j } \right)$ 都与11互素，所以 $\left( K _ { j } ^ { \prime } - K _ { j } \right) \times 2 ^ { j } \neq 0 \bmod 1$ ，即不可能有 $\sum_{i = 0,i \neq j}^{17} K_{i} \times 2^{i} + K_{j}^{\prime} \times 2^{j} \equiv 1 ( mod  11)$ ，于是无法通过验证。

第二代身份证的验证码可以纠正1个已知位置的错误。假设某个 $K _ { j }$ 被错抄成 $K_{j}^{\prime} \left( 0 \leqslant \right.$ $j   \lesssim   1 7$ 已知），则 $\sum_{i = 0,i \neq j}^{17} K_i \times 2^i + K_j' \times 2^j = \sum_{i = 0}^{17} K_i \times 2^i + \left( K_j' - K_j \right) \times 2^j = 1 + \left( K_j' - K_j \right) \times 2^j$

[page:382]

## 382

(mod11)，于是可以计算得到正确的 $K_{j} = \left( K_{j}^{\prime} - \left( \sum_{i = 0, i \neq j}^{17} K_{i} \times 2^{i} + K_{j}^{\prime} \times 2^{j} - 1 \right) \times 6^{j} \right) \bmod 11 。$

第二代身份证的验证码可以发现2个相邻字符的颠倒错误。假设某个 $K _ { j }$ 和 $K _ { j + 1 }$ 被抄颠倒了 $(0 \leqslant j \leqslant 16$ $K _ { j } \neq K _ { { } _ { j + 1 } } )$ ，则

$$\begin{aligned} &\sum_{i = 0,i \neq j,i \neq j + 1}^{17} K_{i} \times 2^{i} + K_{j + 1} \times 2^{j} + K_{j} \times 2^{j + 1}\\ &= \sum_{i = 0}^{17} K_{i} \times 2^{i} + \left( K_{j} - K_{j + 1} \right) \times \left( 2^{j + 1} - 2^{j} \right)\\ &= 1 + \left( K_{j} - K_{j + 1} \right) \times 2^{j} \pmod{11}\\ \end{aligned}$$

由于11是素数，而且2和 $K _ { j } - K _ { j ^ { + 1 } }$ 都与11互素，所以 $\left( K _ { j } - K _ { j + 1 } \right) \times 2 ^ { j } \neq 0$ mod 11,即不可能通过验证。

## A.3 应用鸽巢原理的纸牌魔术二则①

【关键词】鸽巢原理；模运算；全排列

本节通过两个精彩的纸牌魔术介绍鸽巢原理的应用。

## A.3.1 纸牌魔术 A

## 1. 魔术简介

魔术师邀请一位不知情的观众从一副标准的扑克牌（52张）中随机选出5张牌。这位观众把它们展示给魔术师的助手，但不向魔术师展示。助手看过这5张牌后，从中选择4张，并按照一定的顺序逐一展示给魔术师看。魔术师便可以说出第5张纸牌的花色和点数。

## 2. 魔术揭秘

助手只能按照某种次序展示其中的4张纸牌，以此来向魔术师传递第5张牌的信息，具体而言就是第5张牌的花色和点数。

（1）注意到在任意5张纸牌中都必然有两张牌花色相同（鸽巢原理）。助手向魔术师展示的第一张牌就是这两张牌中的一张，这事实上就告诉了魔术师第5张牌的花色。而假如两张牌是3和J时，助手要选择哪一张向魔术师展示，是必须选择其中的某一张还是随意一张都可以？这个选择是要由第5张牌的点数决定的。

（2）确定第5张牌的点数。

按顺时针方向将同一套花色的扑克牌从A(1)到J(11)、Q(12)和K(13)循环编号（即点

[page:383]

## 附录A 综合性研讨专题

数1排在点数13之后)，排成一个圆形序列，如图A.7所示。

对于任意给定的两张纸牌（同花色）X和 Y，定义 distance(X，Y)为从X到 Y的顺时针距离（即(Y–X) mod 13)。例如 distance(A, 7)=6，distance (7, A)=7。

distance(X, Y)具有如下性质:distance(X, Y)+distance(Y, X)=13。（第二次）使用鸽巢原理，可以得到 distance(X, Y) ≤6 或者 distance(Y, X) ≤6。

于是回到“助手要选择同花色牌中的哪一张向魔术师展示”的问题，回答是:从相同花色的X和 Y两张牌中，助手向魔术师展示纸牌X而隐藏纸牌 Y,使得 distance(X, Y) ≤ 6。例如两张同花色纸牌是3和J时，助手要向魔术师展示J而隐藏:3，这是因为distance(J, 3)=5， 而 distance(3, J)=8。

这事实上界定了第5张牌的范围（6种可能)。例如助手向魔术师展示牌5时，表明第5张牌来自{6, 7, 8,9, 10, J}。

（3）下面使用第2、3、4张纸牌来说明第5张纸牌是这6种可能中的哪一个。

对于所有52张纸牌进行编号（1～52）以便排序，如表A.7所示。

于是，任意3张不同的纸牌都可以“排序”为“大”“中”“小”。由此可以形成3!=6个全排列，一一对应着1～6这6个数值:

小、中、大↔6

小、大、中↔5

中、小、大↔4

中、大、小↔3

大、小、中↔2

大、中、小↔1

因此助手可以通过给出第2、3、4张纸牌的一个全排列来指代1～6中的一个值，于是可以由这个值向魔术师表明第5张牌是6种可能中的第几张。

最后给出一个完整的魔术示例，假设五张牌选择如图A.8所示。

[page:384]

## 离散数学及应用（第2版）

表 A.7 52 张纸牌的编号<table><tr><td rowspan=2>A1</td><td rowspan=2>A2</td><td>A</td><td>A</td><td>K</td><td>K</td><td>K</td><td>K</td><td>Q</td><td></td><td></td><td></td></tr><tr><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td></tr><tr><td>J</td><td></td><td></td><td>0</td><td>10</td><td>10</td><td>10</td><td>10</td><td>9</td><td>9</td><td>9</td><td>9</td></tr><tr><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td></tr><tr><td>8</td><td>8</td><td>8</td><td>8</td><td>T</td><td>7</td><td>7</td><td>1</td><td>6</td><td>6</td><td>6</td><td>6</td></tr><tr><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td><td>33</td><td>34</td><td>35</td><td>36</td></tr><tr><td>5</td><td>5</td><td>5</td><td>5</td><td>T4</td><td>4</td><td>4</td><td>4</td><td>3</td><td>3</td><td>3</td><td>3</td></tr><tr><td>37</td><td>38</td><td>39</td><td>40</td><td>41</td><td>42</td><td>43</td><td>44</td><td>45</td><td>46</td><td>47</td><td>48</td></tr><tr><td>2</td><td>2</td><td>2</td><td>2</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>49</td><td>50</td><td>51</td><td>52</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></table>

助手注意到♥3和♥7花色相同，由于distance(3,7)=4，distance(7,3)=9，因此助手选择♥3作为第1张展示给魔术师的纸牌而隐藏♥7。7-3=4，4对应的排列是“中、小、大”，因此助手将依次展示给魔术师5、◆2、6。

## A.3.2 纸牌魔术 B

## 1. 魔术简介

魔术师将点数为A到10的10张纸牌交给一位不知情的观众，观众随机排列这10张纸牌（即观众选择全排列之一）后，面朝上展示给助手（但不向魔术师展示），之后将所有纸牌翻转，背面朝上按照原次序排在桌面上。助手从中选择6张，并按照一定的顺序逐一翻开展示给魔术师看，之后魔术师便可以指出背面朝上的4张纸牌的点数。

## 2. 魔术揭秘

根据鸽巢原理，在1～10的任一个排列中，都存在长度为4的递增子序列或长度为4的递减子序列（参看例1.57）。

[page:385]

## 附录A 综合性研讨专题

因此助手留下的4张牌就是这个排列中的一个长度为4的递增子序列或长度为4的递减子序列。

而到底是递增子序列还是递减子序列，可以由助手翻开6张牌的方向来“告知”魔术师如果助手从左向右翻转这6张牌，就表明是递增子序列；如果助手从右向左翻转这6张牌，就表明是递减子序列。

下面给出一个完整的魔术示例，假设观众按如图A.9所示的方式排列这10张牌（自左而右)。

其中有递增子序列3,5,8,10，也有递减子序列10,7,4,2。如果助手决定使用递增子序列，他留下前4张牌，并且将另外6张牌以从左往右的顺序翻开，魔术师意识到缺失的4个数字是3,5,8和10，而且是递增的；如果助手决定用递减子序列，他将印有数字10,7,4,2的纸牌留下，并且将另外6张牌以从右往左的顺序翻开，魔术师意识到缺失的4个数字是2,4,7和10，而且是递减的。

当对52张纸牌进行编号（表A.7）后，这个魔术还可以引入更多张数的纸牌、花色和点数也可以更加丰富。

## A.4 完美洗牌法

## 【关键词】置换；周期；映射

为后续理论的叙述方便，将一摞纸牌自上而下从0开始计数，即自上而下是第0张牌、第1张牌……第50张牌、第51张牌。

交错式洗牌（riffle）又称为完美洗牌法（perfect riffle shuffle）或鸽尾洗牌法，是一种常见的洗牌方法，主要流程为先将纸牌分成两半（图A.10(a)))，之后使两叠纸牌一张叉一张地交错叠在一起。

图 A.10 完美洗牌法

完美洗牌法有两种:顶端的纸牌洗牌后仍在顶端，称作外洗法（图A.10(b))；否则

[page:386]

## 离散数学及应用（第2版）

（顶端纸牌洗牌后处在第1张牌位置）称作内洗法（图A.10(c))。

图 A.11是8张纸牌的外洗法和内洗法的示例。其中，(a)为将纸牌分为两半，(b)和(c)分别为外洗法和内洗法的结果。

(a)

图 A.11 8 张纸牌的外洗法和内洗法

无论外洗法还是内洗法，都是某位置上纸牌的置换，如图A.12所示，外洗法和内洗法的置换分别为(a)和(b)。逆置换就是纸牌所在位置的置换。

52 张纸牌的外洗法置换的形式化表示为: $f(2i)=i,\quad f(2i+1)=26+i,\quad 0 \leqslant i \leqslant 25$ ；内洗法置换的形式化表示为: $g(2i+1)=i,\quad g(2i)=26+i,\quad 0 \leqslant i \leqslant 25$

$f^{-1}(x) = 2x, \; 2x < 51$ 时； $f^{-1}(x)=2x-51, 2x \geqslant 51$ 时。 $g^{-1}(x) = 2x + 1, \quad 2x < 51$ 时； $g ^ { - 1 } ( x ) { = } 2 x { - } 5 2$ $2 x \geqslant 5 1$ 时。)

可以将置换写作轮换的乘积，如8张纸牌的外洗法（图A.13(a)）可写作(0)(142)(356)(7)，8张纸牌的内洗法（图A.13(b)）可写作(046731)(25)。

于是可以由轮换计算置换的周期:假设置换 $\scriptstyle { \mathcal { H } } = { \mathcal { O } } _ { 1 } { \mathcal { O } } _ { 2 } \cdots { \mathcal { O } } _ { k } , \quad { \mathcal { O } } _ { i }$ 的长度为 $l _ { i } ,$ 则得到π的周期为 $\mathrm { L C M } [ l _ { 1 } , l _ { 1 } , \cdots , l _ { k } ]$ 。如图A.14所示，8张纸牌的外洗法置换(0)(142)(356)(7)的周期是3。

[page:387]

## 附录A 综合性研讨专题

52 张纸牌的外洗法置换为(0)(1, 26, 13, 32, 16, 8, 4, 2)(3, 27, 39, 45, 48, 24, 12, 6)(5, 28, 14, 7, 29, 40, 20, 10)(9, 30, 15, 33, 42, 21, 36, 18)(11, 31, 41, 46, 23, 37, 44, 22)(19, 35, 43, 47, 49,50,25,38)(17,34)(51)，周期为8，即使用外洗法洗牌8次就会将整叠纸牌恢复到最初的顺序。

而 52 张纸牌的内洗法置换为(0, 26, 39, 19, 9, 4, 28, 40, 46, 49, 24, 38, 45, 22, 37, 18, 35, 17, 8, 30, 41, 20, 36, 44, 48, 50, 51, 25, 12, 32, 42, 47, 23, 11, 5, 2, 27, 13, 6, 29, 14, 33, 16, 34,43,21,10,31,15,7,3,1)，周期为 52，需要52次洗牌才会将整叠纸牌恢复到最初的顺序。

虽然52远多于8，但和一副牌的全排列数52!相比实在太微不足道了，从置乱的角度上讲，“完美洗牌法”远非完美；然而它在魔术中却具有奇妙的作用。

1954年，英国魔术发明家埃尔姆斯利发现，可以通过完美洗牌法将最上面一张牌洗到给定的任意位置x:

（1）将x的值用二进制表示。

（2）自左而右，将1看作内洗法，将0看作外洗法，按此顺序洗牌即可。

例如 $x = 18 = (10010)_{2}$ 。如图A.15所示，经过1次内洗法、2次外洗法、1次内洗法、2次外洗法就可将最初位置0的纸牌洗到给定的位置18。

假设目标位置 x的二进制表示为 $b_{1}b_{2}\cdots b_{k} (1 \leqslant k \leqslant 6)$ ，下面使用归纳法证明上述方法的正确性。

[page:388]

## 388

<table><tr><td rowspan=12>内洗法外洗法外洗法内洗法外洗法</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>91</td><td>0 1</td><td>1 1</td><td>2 1</td><td>3</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>…</td></tr><tr><td colspan=20></td></tr><tr><td>26</td><td>0</td><td>27</td><td>1</td><td>28</td><td>2</td><td>29</td><td>3</td><td>30</td><td>4</td><td>31</td><td>5</td><td>32</td><td>6</td><td>33</td><td>7</td><td>34</td><td>8</td><td>35</td><td>…</td></tr><tr><td colspan=20></td></tr><tr><td>26</td><td>39</td><td>0</td><td>13</td><td>27</td><td>40</td><td>1</td><td>14</td><td>28</td><td>41</td><td>2</td><td>15</td><td>29</td><td>42</td><td>3</td><td>16</td><td>30</td><td>43</td><td>4</td><td>…</td></tr><tr><td colspan=20></td></tr><tr><td>26</td><td>6 3</td><td>9</td><td>19</td><td>0 3</td><td>3</td><td>13</td><td>46</td><td>2</td><td>7 7</td><td>40</td><td>2</td><td>0 1</td><td>34</td><td>1</td><td>4 4</td><td>7</td><td>28</td><td>8 4</td><td>1</td></tr><tr><td colspan=20></td></tr><tr><td>42</td><td>26</td><td>22</td><td>6</td><td>3</td><td>39</td><td>36</td><td>19</td><td>16</td><td>0</td><td>49</td><td>33</td><td>30</td><td>13</td><td>10</td><td>46</td><td>43</td><td>27</td><td>23</td><td>…</td></tr><tr><td colspan=20></td></tr><tr><td>42</td><td>50</td><td>26</td><td>34</td><td>22</td><td>31</td><td>6</td><td>14</td><td>3</td><td>11</td><td>39</td><td>47</td><td>36</td><td>44</td><td>19</td><td>28</td><td>16</td><td>24</td><td>0</td><td>…</td></tr></table>图A.15 用完美洗牌法将第0 张牌洗到位置18 的过程

证明. k=1时很容易验证上述方法正确。

k>1 时，设 $y = \left\lfloor x / 2 \right\rfloor = b_{1}b_{2}\cdots b_{k -}$ 1，由归纳假设，上述方法可以将最初最上面一张牌洗到第y个位置。

若 $b _ { k } { = } 1$ ，则进行一次内洗法， $g(x)=g(2y+1)=y$ ，表明最初最上面的牌从第y个位置洗到了第x个位置。

若 $b _ { k } { = } 0$ ，则进行一次外洗法， $f(x)=f(2y)=y$ ，表明最初最上面的牌从第y个位置洗到了第x个位置。

完成归纳法证明。

## A.5 Chomp 游戏

【关键词】偏序关系；策梅洛定理

Chomp是一个双人游戏，有m×n块曲奇饼排成一个矩形格状，称作棋盘。两个玩家轮流自选吃掉一块还剩下的曲奇饼，而且要把它右边和下面所有的曲奇饼都取走（如果存在）。如果不吃左上角的那一块曲奇饼（位置记为(1，1)）就没有其他选择的玩家为失败。

【例 A.14】 图 A.16 展示了一个棋盘为 4×6 的 Chomp 游戏的完整过程:

（a）是初始情况。

(b）表示玩家一吃掉位置为(3,3)的曲奇饼。

（c）表示玩家二吃掉位置为(1,4)的曲奇饼。

(d）表示玩家一吃掉位置为(1,2)的曲奇饼。

(e）表示玩家二吃掉位置为(2,1)的曲奇饼。

（f）表示玩家一在游戏中落败。

首先需要补充介绍一个重要的结果。

1913年，德国逻辑学家和数学家恩斯特·策梅洛（Ernst Zermelo）在论文Über eine Anwendung der Mengenlehre auf die Theorie des Schachspiels 中证明了策梅洛定理(Zermelo's theorem)，该定理表明在二人参与的游戏中，如果满足以下条件:

[page:389]

## 附录A 综合性研讨专题

（a）游戏步骤有限。

（b）信息完备（可以理解为参与者知道所有与游戏相关的信息以及本次游戏中已发生的所有步骤和结果)。

（c）不会产生平局。

（d）每一步骤都是确定性的（即运气因素并不牵涉在游戏中）。则或者先行一方有必胜策略，或者后行一方有必胜策略。

策梅洛定理的另一种表述是:在二人参与的游戏中，如果游戏步骤有限，信息完备，每一步骤都是确定性的，则或者先行一方有必胜策略，或者先行一方有必和策略，或者后行一方有必胜策略。

定理A.4 除去1×1大小的棋盘外，对于其他大小的棋盘，先手存在必胜策略。

证明.假设棋盘规模为m×n。首先，游戏不可能产生平局。其次，由于每一步移动至少吃掉1块曲奇饼干，因此不超过mn步后游戏必定结束。

由策梅洛定理，这个确定性二人有限游戏信息完备，且不存在平局，则或者先行一方有必胜策略，或者后行一方有必胜策略。

如果后手有必胜策略，使得无论先手第一次取哪个曲奇饼，后手都能获得最后的胜利，那么现在假设先手取最右下角的曲奇饼(m,n)，接下来后手可以取某块曲奇饼(a,b)使得自己进入必胜的局面。

事实上，先手在第一次取的时候就可以取曲奇饼(a,b)，之后完全模仿后手的必胜步骤，迫使后手失败。

于是产生矛盾。因此不存在后手必胜策略，先手存在必胜策略。

注意:这个证明是非构造性存在性证明，即只是证明了先手必胜策略的存在性，但没有构造出具体必胜策略。

虽然对于一些特殊的情况，比如棋盘是正方形、棋盘只有两行，可以找到必胜策略；但对于一般情况，还没有人能具体给出Chomp游戏的一般性必胜策略。

Chomp游戏还可以做如下变形:

[page:390]

## 离散数学及应用（第2版）

（a）三维Chomp游戏。将曲奇排成p×q×r的长方体，两个玩家轮流自选吃掉一块留下的曲奇饼，若曲奇饼干为(i,j,k)，则也要取走所有满足 $p \geqslant a \geqslant i$ $q   \geq   b$ ≥j, $r \geqslant c \geqslant k$ 的曲奇饼 $( a , b , c )$ (如果存在)。

可以类似地将Chomp游戏扩展到任意维，并可以类似地证明，先手都存在必胜策略。

（b）有限偏序集上的 Chomp 游戏。

Chomp游戏可以推广到在任意一个存在最小元a的有限偏序集(S, ≤)上:两名游戏者轮流选择S中的元素x，移走x以及所有S中比 x大的元素。失败者是被迫选择最小元a的玩家。

而且可以证明:传统Chomp游戏（曲奇饼摆放在m×n的矩形网格中）与偏序集(S,1)上的 Chomp 游戏相同，其中 S 是 $p ^ { m - 1 } q ^ { n - 1 }$ 的所有正因子组成的集合，这里p和q是两个不同的素数。

假设(A, ≤)和(B, ≤)都是全序集，则传统 Chomp 游戏与偏序集(A×B, ≤)上的 Chomp 游戏相同。

## A.6麻花辫

## 【关键词】群；群的运算

“你那美丽的麻花辫/缠呀缠住我心田/叫我日夜地想念/那段天真的童年”

郑智化《麻花辫子》

麻花辫是一种发型，把头发分成3股交叉扎起来形成像麻花样的辫子:

（1）把头发分成三股。

（2）把最左边（右边）一股头发从上面压到中间一股和右边（左边）一股之间(图 A.17(a)、(c))。

（3）如果还需要继续编辫子，则再把最右边（左边）一股头发从上面压到中间一股和左边（右边）一股之间（图A.17(b)、(d)）。

（4）如果还需要继续编辫子则返回步骤2。

（5）最后头发编完，用头绳（或皮筋、绑线带）扎住（图A.17(e))。

但为什么无论古今中外，编麻花辫的方法如此单一，都是上述操作序列不断重复（或者左右镜像）？

[page:391]

## 附录A 综合性研讨专题

先看最简单的情况:头发只分为一股，梳为马尾辫即可。

如果头发只分为两股，则只有图A.18所示一种编辫子方式（或者左右镜像），实际上就是搓麻绳的方法。

再讨论头发只分为两股时最简单的情况（交叉0次或1次），如图A.19所示，3种情况分别记为 e、a和 b。

下面来看交叉至多两次的情况，如图A.20所示是图A.19的9种组合形式，采用。表示“上下连接”。

容易看出 $e ^ { \circ } e ^ { = } e$ $e^{\circ}a = a$ $e \circ b = b$ $a \circ e = a$ $b \circ e = b$ $a \circ b = e$ $b \circ a = e$ 。因此可以将“。”视作G上的可交换的运算，其中G={所有由e、a、b组成的有限长度的串，字符之间的连接表示 $\{ ^ { a _ { 0 } , 3 } \}$ ，则(G,°)构成一个群，其中e是单位元，a和b互为逆。由此可知 $G = \{ e \} \cup \{ a ^ { i } | i \in \mathbb { Z } ^ { + } \}$ U $\{ b ^ { i } | i \in \mathbb { Z } ^ { + } \} = \{ a ^ { i } | i \in \mathbb { Z } \}$ ，事实上G是一个循环群， $a ^ { i }$ 中i的正负对应编麻绳的两种（对

[page:392]

## 离散数学及应用（第2版）

称）方式（i=0时就是“不编”）。

【例 A.15】 aeabbaaebaa 表示图 A.21(a)，实际上可以通过 $a e ( a b ) ( b a ) a e ( b a ) a$ 化简为 $a ^ { 3 }$ ，即为图 A.21(b)。

所以头发只分为两股时，（本质上）只有一种编辫子方式。

如果头发分为3股，最简单的情况（交叉0次或1次）如图A.22所示，有5种情况。

依然令 G={所有由 $e , a , a ^ { - 1 } , b , b ^ { - 1 }$ 组成的有限长度的串，字符之间的连接表示“”}，则(G, °)同样构成一个群。

下面来分析头发分为3股时，“通常意义上的美观”的辫子会是什么样子，考察“辫子”其实也就是考察G 中的一个有限长度的串 S，假定S中不会连续出现 $a \circ a^{-1}  、 a^{-1} \circ a  、 b \circ b^{-1}$和 $b ^ { - 1 } \circ b$

（1）以 $a ^ { 2 }  、 ( b ^ { - 1 } ) ^ { 2 }$ 为例，如图A.23(a)、(b)所示，会出现“一边单股，另一边搓麻绳”的情况，通常会认为这是不美观的。因此定义“通常意义上的美观”的辫子为G的一个子集 $H = \{ S \in G | S \}$ 中不连续出现 $aa^{-1} 、 a^{-1}a 、 bb^{-1} 、 b^{-1}b 、 a^{2} 、 (a^{-1})^{2} 、 b^{2}  和  (b^{-1})^{2} \}$

可以看出，从形式上讲 $H { - } \{ e \}$ 中的元素形如 $a ^ { i _ { 1 } } b ^ { j _ { 1 } } a ^ { i _ { 2 } } b ^ { j _ { 2 } } \cdots$ 或 $b ^ { j _ { 1 } } a ^ { i _ { 1 } } b ^ { j _ { 2 } } a ^ { i _ { 2 } } \cdots$ ，其中 $i _ { k _ { 2 } }$ $j _ { k } { = } \pm 1$ o

[page:393]

## 附录A 综合性研讨专题

（2）可以验证:

$$\begin{aligned} &a b a^{-1} = b a^{-1} b^{-1} \\&a b^{-1} a^{-1} = b a b^{-1} \\&a a^{-1} b a = b^{-1} a^{-1} b \\&a a^{-1} b^{-1} a = b^{-1} a b \\&a b^{-1} a = b^{-1} a b^{-1} \\&a a^{-1} b a^{-1} = b a^{-1} b\\ \end{aligned}$$

【例A.16】 对于 $a b a ^ { - 1 } = b a ^ { - 1 } b ^ { - 1 }$ ，可以参看图A.24（(a)和(b)实质上都是(c))。

于是可以得到（可参看图A.25，(a)和(b)实质上都是(c)):

$$\begin{aligned}&abab^{-1} = a(ab^{-1}a^{-1}) = a^{2}b^{-1}a^{-1} \quad &( 出现了  a^{2}) \\&aba^{-1}b = a(a^{-1}ba^{-1}) = ba^{-1} \quad &( 串的长度缩短 ) \\&aba^{-1}b^{-1} = a(aba^{-1}) = a^{2}ba^{-1} \quad &( 出现了  a^{2}) \\&\cdots\cdots\end{aligned}$$

最终可以得到:在 $\left\{ a ^ { i _ { 1 } } b ^ { j _ { 1 } } a ^ { i _ { 2 } } b ^ { j _ { 2 } } , b ^ { j _ { 1 } } a ^ { i _ { 1 } } b ^ { j _ { 2 } } a ^ { i _ { 2 } } , i _ { k } , j _ { k } = \pm 1 \right\}$ 共 32 个元素中，除了 {abab, $a ^ { - 1 } b ^ { - 1 } a ^ { - 1 } b ^ { - 1 } ,   b a b a ,   b ^ { - 1 } a ^ { - 1 } b ^ { - 1 } a ^ { - 1 } \}$ 外，其他串或者（等价地）将会出现 $a^{2} 、 b^{2} 、 (a^{-1})^{2}  和  (b^{-1})^{2}$的情况，或者串可以化简变短。

综合上述两方面的讨论，“通常意义上的美观”的辫子为 $H = H_{0} \cup H_{1} \cup H_{2} \cup H_{3} \cup H_{4}$其中 $H _ { 0 } { = } \{ e \} , \quad H _ { 1 } { = } \{ a , ~ a ^ { - 1 } , ~ b , ~ b ^ { - 1 } \} , \quad H _ { 2 } { = } \{ a b , ~ a b ^ { - 1 } , ~ a ^ { - 1 } b , ~ a ^ { - 1 } b ^ { - 1 } , ~ b a , ~ b a ^ { - 1 } , ~ b ^ { - 1 } a , ~ b ^ { - 1 } a ^ { - 1 } \}$ $H _ { 3 } = \{ a b a ^ { - 1 } ,   a b ^ { - 1 } a ^ { - 1 } ,   a ^ { - 1 } b a ,   a ^ { - 1 } b ^ { - 1 } a ,   a b ^ { - 1 } a ,   a ^ { - 1 } b a ^ { - 1 } \} , H _ { 4 } = \{ ( a b ) ^ { n } ,   ( a b ) ^ { n } a ,   ( b a ) ^ { n } ,   ( b a ) ^ { n } b ,   ( a ^ { - 1 } b ^ { - 1 } ) ^ { n } ,   a b ^ { - 1 } b ^ { - 1 } \} ,$ $( a ^ { - 1 } b ^ { - 1 } ) ^ { n } a ^ { - 1 } , ( b ^ { - 1 } a ^ { - 1 } ) ^ { n } , ( b ^ { - 1 } a ^ { - 1 } ) ^ { n } b ^ { - 1 } , n \geqslant 1 \}$ 0

[page:394]

## 离散数学及应用（第2版）

可以看出，如果编辫子中的“交叉”数至少是4（在现实中，这是一个合理的条件)，“通常意义上的美观”的辫子就是 $H _ { 4 }$ 中的元素，通俗地讲就是以下两种情况之一:

• a、b交替出现的串—对应之前描述的编麻花辫方法（或者左右镜像方法)。

$a ^ { - 1 }  、 b ^ { - 1 }$ 交替出现的串——对应之前描述的编麻花辫方法的前后翻转（也即将“压住另一股头发”改为“被另一股头发压住”，本质上没有区别，但是在“编”辫子时会感觉不顺手)。

上述讨论的只是辫子群、纽结理论的一个初等应用，事实上辫子群、纽结理论在数学、统计力学、量子力学、密码学中都具有非常重要的地位和价值。

## A.7 伯恩赛德引理与波利亚定理①

【关键词】置换；置换群；陪集分解；拉格朗日定理

先考虑一个“简单”的问题:对2×2的方格纸用黑白两种颜色着色，能得到多少种不同的着色方案？经过旋转使之吻合的两种方案算是同一种方案。

首先经过简单的枚举可以得到:不考虑旋转后的“等价性”时，所有的涂色方案如图 A.26 所示。

[page:395]

## 附录A 综合性研讨专题

考虑旋转的等价性后，其中本质上彼此相异的着色方案只有图A.27所示的6种。

将“格子”视作4个元素 $\{ x _ { 1 } , x _ { 2 } , x _ { 3 } , x _ { 4 } \}$ ，颜色集合为{黑，白}，允许的“旋转”“翻转”等都是置换，且构成一个置换群 $G = \{ \pi _ { 1 } , \pi _ { 2 } , \cdots , \pi _ { n } \}$

本节将采用问答形式对该问题进行分析和解答。

问题1:什么是“着色方案”？

回答1:一个着色方案指一个函数 $c \colon \{ x _ { 1 } , x _ { 2 } , x _ { 3 } , x _ { 4 } \} { \rightarrow } \cdot$ {黑，白}。也可以将一个着色方案写作 $S = ( c _ { 1 } , c _ { 2 } , c _ { 3 } , c _ { 4 } ) = ( c ( x _ { 1 } ) , c ( x _ { 2 } ) , c ( x _ { 3 } ) , c ( x _ { 4 } ) )$ ，这也称作一个状态。

问题2:什么是“相同”的着色方案？

回答2:函数c和 c'称作“相同”的或者本质上相同的着色方案，是指存在一个置换$\sigma \in \{ \pi _ { 1 } , \pi _ { 2 } , \cdots , \pi _ { n } \}$ ，使得 $c ^ { \prime } \circ \sigma = c$ ，这时也简记为 $o ( S ) = S ^ { \prime }$ ，其中， $S { = } ( c ( x _ { 1 } ) , c ( x _ { 2 } ) , c ( x _ { 3 } ) , c ( x _ { 4 } ) )$ $S ^ { \prime }     =     ( c ^ { \prime } ( x _ { 1 } ) , c ^ { \prime } ( x _ { 2 } ) , c ^ { \prime } ( x _ { 3 } ) , c ^ { \prime } ( x _ { 4 } ) )$ 。(注意这时 $\sigma ^ { - 1 } ( S ^ { \prime } )   =   S$ ，因此“相同”不具有“方向性”。)图A.28是一个具体例子。在（a）中， $c_{3} \circ \pi_{2} = c_{2}, c_{3}$ 与 $c _ { 2 }$ 是本质上相同的着色方案；(b）为 $\pi _ { 2 } ( S _ { 2 } ) { = } S _ { 3 }$ 。此时也记作 $S { \sim } S ^ { \prime }$

可以定义着色方案（状态）上的关系 R，(S, S')∈R当且仅当S可以由旋转S'得到，则可以证明R是等价关系，与着色方案（状态）S本质上相同的着色方案（状态）全体是S所在的等价类[S]。

问题3:以图 A.29为例，有的置换使得着色方案 $S _ { j }$ 本质上不发生变化（称之为 $S _ { j }$的一个稳定置换)，这样的置换有什么性质？

[page:396]

## 离散数学及应用（第2版）

回答3:很容易看出使得着色方案 $S _ { j }$ 不发生变化的置换是 $\{ \pi _ { 1 } ,   \pi _ { 2 } ,   \cdots ,   \pi _ { n } \}$ 的子群（称之为 $S _ { j }$ 的稳定子群)，记之为 $Z _ { j } .$

在表A.8中，如果 $\pi _ { i } ( S _ { j } ) { = } S _ { j }$ ，则在 $S _ { j }$ 所在的行和 $\pi _ { i }$ 所在的列的交叉处画一个 $"  \sqrt { }$ (为清晰起见，将等价的着色方案列在一起)。

表A.8 着色方案与置换<table><tr><td rowspan=2 colspan=5><eq>S _ { j }</eq></td><td><eq>\pi _ { 1 }</eq></td><td><eq>\pi _ { 2 }</eq></td><td><eq>\pi _ { 3 }</eq></td><td><eq>\pi _ { 4 }</eq></td><td rowspan=2>|Zj|</td></tr><tr><td>不动</td><td>顺时针旋转<eq>9 0 ^ { \circ }</eq></td><td>旋转<eq>1 8 0 ^ { \circ }</eq></td><td>逆时针旋转<eq>9 0 ^ { \circ }</eq></td></tr><tr><td rowspan=2><eq>S _ { 1 }</eq></td><td rowspan=2></td><td></td><td></td><td rowspan=2></td><td rowspan=2><eq>\sqrt { }</eq></td><td rowspan=2><eq>\sqrt { }</eq></td><td rowspan=2><eq>\sqrt { }</eq></td><td rowspan=2><eq>\surd</eq></td><td rowspan=2>4</td></tr><tr><td colspan=2></td></tr><tr><td><eq>S _ { 2 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td></td><td></td><td>1</td></tr><tr><td><eq>S _ { 3 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td></td><td></td><td>1</td></tr><tr><td><eq>S _ { 4 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td></td><td></td><td>1</td></tr><tr><td><eq>S _ { 5 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td></td><td></td><td>1</td></tr><tr><td><eq>S _ { 6 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td></td><td></td><td>1</td></tr><tr><td><eq>S _ { 7 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td></td><td></td><td>1</td></tr><tr><td><eq>S _ { 8 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td></td><td></td><td>1</td></tr><tr><td><eq>S _ { 9 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td></td><td></td><td>1</td></tr><tr><td><eq>S _ { 1 0 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td>2</td></tr><tr><td><eq>S _ { 1 1 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td>2</td></tr><tr><td><eq>S _ { 1 2 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td></td><td></td><td>1</td></tr><tr><td><eq>S _ { 1 3 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\surd</eq></td><td></td><td></td><td></td><td>1</td></tr><tr><td><eq>S _ { 1 4 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td></td><td></td><td>1</td></tr><tr><td><eq>S _ { 1 5 }</eq></td><td></td><td colspan=2></td><td></td><td><eq>\sqrt { }</eq></td><td></td><td></td><td></td><td>1</td></tr><tr><td><eq>S _ { 1 6 }</eq></td><td></td><td colspan=3></td><td><eq>\sqrt { }</eq></td><td><eq>\sqrt { }</eq></td><td><eq>\sqrt { }</eq></td><td><eq>\sqrt { }</eq></td><td>4</td></tr><tr><td colspan=5><eq>\pi _ { i }</eq></td><td>16</td><td>2</td><td>4</td><td>2</td><td></td></tr></table>

问题4:如果 $S _ { i } { \sim } S _ { j }$ $Z _ { i }$ 和 $Z _ { j }$ 之间有什么关系?

回答4:分3步来回答这个问题。

第1步——假设 $\sigma ( S _ { i } ) { = } S _ { j } , \quad \tau { \in } Z _ { i } ,$ ，则 $\sigma \circ \tau \circ \sigma^{-1}(S_j) = \sigma \circ \tau(S_i) = \sigma(S_i) = S_j$ ，即 $\sigma   \circ   \tau   \circ   \sigma ^ { - 1 }   \in Z _ { j } .$第2步——如果 $\sigma \circ \tau _ { 1 } \circ \sigma ^ { - 1 } = \sigma \circ \tau _ { 2 } \circ \sigma ^ { - 1 }$ ，则由 $\sigma ^ { - 1 } \circ ( \sigma \circ \tau _ { 1 } \circ \sigma ^ { - 1 } ) \circ \sigma = \sigma ^ { - 1 } \circ ( \sigma \circ \tau _ { 2 } \circ \sigma ^ { - 1 } ) \circ \sigma ,$得到 $\tau _ { 1 }   =   \tau _ { 2 }   .$ 。说明 $Z _ { i }$ 中不同元素 τ 对应着 $Z _ { j }$ 中不同元素 $\sigma   \circ   \tau   \circ   \sigma ^ { - 1 }$ 。这也表明 $| Z _ { i } | { \leqslant } | Z _ { j } |$

第3步——由于 $S _ { i } { \sim } S _ { j }$ 不具有方向性，因此也可以类似地得到 $| Z _ { j } | { \leqslant } | Z _ { i } |$ ，从而有|Zi|=|zj|。

问题5:和 $S _ { i }$ 等价的着色方案有多少个（也就是 $S _ { i }$ 所在等价类有多少个元素，I[Si]的值是多少）？

[page:397]

## 附录A 综合性研讨专题

回答5:答案是 $\left| \left[ S _ { i } \right] \right| { = } \left[ G { : } Z _ { i } \right]$ ，分两步来证明。

第1步——若 $S _ { j } { \in } [ S _ { i } ]$ ，则存在置换 $\sigma$ 使得 $\sigma ( S _ { i } )   =   S _ { j }$ ，于是 $\sigma Z _ { i }$ 就是 $Z _ { i }$ 的一个左陪集。若 $\sigma ( S _ { i } ) { = } S _ { j } , \quad \tau ( S _ { i } ) { = } S _ { j }$ ，则 $\sigma ^ { - 1 } \circ \tau ( S _ { i } ) { = } \sigma ^ { - 1 } ( S _ { j } ) { = } S _ { i }$ ，即 $\sigma ^ { - 1 } \circ \tau   \in   Z _ { i }$ ，因此 $\sigma Z _ { i } { = } \tau Z _ { i } \mathrm { {  。  } }$ 。这表明一个$S _ { j }$ 唯一对应 $Z _ { i }$ 的一个左陪集。

第2步——另一方面，如果 $\sigma Z _ { i }$ 是 $Z _ { i }$ 的一个左陪集，那么 $\sigma ( S _ { i } )$ 就是[S]中的一个元素。

这两点表明了[S]中的元素和 $Z _ { i }$ 的左陪集之间的一一对应（例如表A.9），立得$\left[ G { : } Z _ { i } \right] { = } \left| \left[ S _ { i } \right] \right|$

表A.9 [S]中的元素和 Z的左陪集之间的——对应<table><tr><td rowspan=2 colspan=3><eq>S _ { j }</eq></td><td><eq>\pi _ { 1 }</eq></td><td><eq>\pi _ { 2 }</eq></td><td><eq>\pi _ { 3 }</eq></td><td><eq>\pi _ { 4 }</eq></td><td rowspan=2><eq>| Z _ { j } |</eq></td></tr><tr><td>不动</td><td>顺时针旋转<eq>9 0 ^ { \circ }</eq></td><td>旋转180°</td><td>逆时针旋转90°</td></tr><tr><td><eq>S _ { 2 }</eq></td><td></td><td></td><td><eq>\pi _ { 1 } ( S _ { 2 } ) { = } S _ { 2 }</eq></td><td></td><td></td><td></td><td><eq>Z _ { 2 } { = } \{ \pi _ { 1 } \}</eq></td></tr><tr><td><eq>S _ { 3 } { = } \pi _ { 2 } ( S _ { 2 } )</eq></td><td colspan=2></td><td><eq>\pi _ { 2 } \circ \pi _ { 1 } = \pi _ { 2 }</eq></td><td></td><td></td><td></td><td><eq>\pi _ { 2 } Z _ { 2 } { = } \{ \pi _ { 2 } \}</eq></td></tr><tr><td><eq>S _ { 4 }   =   \pi _ { 3 } ( S _ { 2 } )</eq></td><td colspan=2>日</td><td><eq>\pi_{3} \circ \pi_{1} = \pi_{3}</eq></td><td></td><td></td><td></td><td><eq>\pi _ { 3 } Z _ { 2 } = \{ \pi _ { 3 } \}</eq></td></tr><tr><td><eq>S _ { 5 } { = } \pi _ { 4 } ( S _ { 2 } )</eq></td><td></td><td></td><td><eq>\pi_{4} \circ \pi_{1} = \pi_{4}</eq></td><td></td><td></td><td></td><td><eq>\pi _ { 4 } Z _ { 2 } = \{ \pi _ { 4 } \}</eq></td></tr><tr><td><eq>S _ { 1 0 }</eq></td><td></td><td></td><td><eq>\pi _ { 1 } ( S _ { 1 0 } ) { = } S _ { 1 0 }</eq></td><td></td><td><eq>\pi _ { 3 } ( S _ { 1 0 } ) { = } S _ { 1 0 }</eq></td><td></td><td><eq>Z _ { 1 0 } = \{ \pi _ { 1 } , \pi _ { 3 } \}</eq></td></tr><tr><td><eq>S _ { 1 1 }   =   \pi _ { 2 } ( S _ { 1 0 } )</eq></td><td></td><td></td><td><eq>\pi _ { 2 } \circ \pi _ { 1 } = \pi _ { 2 }</eq></td><td></td><td><eq>\pi_{2} \circ \pi_{3} = \pi_{4}</eq></td><td></td><td><eq>\pi _ { 2 } Z _ { 1 0 } = \{ \pi _ { 2 } , \pi _ { 4 } \}</eq></td></tr></table>

问题6:对于给定的置换 $\pi ,$ 满足 $\pi ( S ) = S$ 的着色方案有多少个？

回答6:先看图A.30所示的3个实例。

(1) $\pi _ { 3 }$ 分解为轮换的积为 $\pi_{3} = (13)(24)$ ，因此如果 $\pi _ { 3 } ( S ) = S ,$ ，那么必然有①和③颜色相同，②和④颜色相同，①和②颜色没有关系，①和④颜色没有关系，③和②颜色没有关系，③和④颜色没有关系。独立的颜色选择有两个，由①（或③）的颜色和②（或④）的颜色决定。

(2) $\pi _ { 2 }$ 分解为轮换的积为 $\pi_{2}=(1432)$ ，因此如果 $\pi _ { 2 } ( S ) { = } S$ ，那么必然有①、②、③和④颜色相同，独立的颜色选择只有1个。

(3) $\pi _ { 1 }$ 分解为轮换的积为 $\pi _ { 1 } { = } ( 1 ) ( 2 ) ( 3 ) ( 4 )$ (此处要求将长度为1的轮换也全部写出)，因此如果 $\pi _ { 1 } ( S ) = S$ ，那么①、②、③和④的颜色彼此之间都互不相同，独立的颜色选择有4个。

可以总结出一般性结果:如果置换π分解为k个轮换的积，则独立的颜色选择有k个，如果可以使用m种颜色，则一共有 $m ^ { k }$ 种着色方案S使得 $\pi ( S ) = S$ C

问题7:现在可以回答最初问题了吗？

回答7:如表A.8所示，如果 $\pi _ { i } ( S _ { j } ) { = } S _ { j }$ ，则在 $S _ { j }$ 所在的行和 $\pi _ { i }$ 所在的列的交叉处画一个 $"  \sqrt { }  "。$ 于是 $S _ { j }$ 所在行的 $"  \sqrt { }$ 数目就是 $S _ { j }$ 的稳定子群 $Z _ { j }$ 的元素个数 $| Z _ { j } |$ ，π所在列的 $"  \sqrt { }$

[page:398]

## 离散数学及应用（第2版）

数目是在 $\pi _ { i }$ 下保持不变的着色方案个数（记之为)，而最右一列的数值之和明显等于最下一行的数值之和，即 $\sum_{j} \left| Z_{j} \right| = \sum_{i = 1}^{n} \Pi_{i}$ C

下面要证明同一等价类的着色方案代表的各行的最右列的数值和都是 $n _ { \mathrm { ~ c ~ } }$

考虑 $[ S _ { j } ]$ ，问题4的回答表明，对于和 $S _ { j }$ 等价的任意着色方案 $S _ { k }$ 而言， $\lvert Z _ { j } \lvert = \lvert Z _ { k } \lvert$ ，即$S _ { j }$ 所在行的 $"  \sqrt { }$ 数目等于 $S _ { k }$ 所在行的 $"  \sqrt { }$ 数目；而问题5的回答表明 $[ S _ { j } ] { = } [ G { : } Z _ { j } ]$ ，这就是[S]包含的行数。

所以[S]包含的各行中“√”的总数就是行数和每行中“√”数目的乘积，由拉格朗日定理即得 $[G:Z_{j}]\times|Z_{j}|=|G|=n$

那么，等价类的个数（也就是本质上不同的着色方案数）就是表中所有的 $"  \sqrt { }$ 数目除以n，即 $\frac{1}{n} \sum_{j} \left| Z_{j} \right| = \frac{1}{n} \sum_{i=1}^{n} \Pi_{i}$ ，这就是伯恩赛德引理（Burnside's lemma)。

再由问题6的回答知道，假设总共可以使用m种颜色，而置换 $\pi _ { i }$ 分解为 $k _ { i }$ 个轮换的积，则 $\scriptstyle { \mathit { \Pi } } _ { i } = m ^ { k _ { i } }$ ，于是本质上不同的着色方案数为 $\frac { 1 } { n } { \sum _ { i = 1 } ^ { n } } m ^ { k _ { i } }$ ，此即波利亚（Pólya）定理。

回到最初的问题，应用波利亚定理，计算得到本质上不同的着色方案数为

$$( 2 ^ { 4 } + 2 ^ { 1 } + 2 ^ { 2 } + 2 ^ { 1 } ) / 4 = 6$$

## A.8 顿时错乱问题

【关键词】图；支撑子图；正则图

顿时错乱/即刻疯狂（Instant Insanity）智力玩具由 Franz Owen Armbruster 发明，并于1967年投放市场。它包括4个立方体，每一个立方体的每一面都染了红、白、蓝或绿4种颜色之一（例如图A.31所示，其中深色字表示可见面，浅色字表示不可见面。）。

游戏的目标是将4个立方体堆起来形成一个1×1×4的柱体，使得无论从前面、后面、左面还是右面都可以看到所有的4种颜色。

首先可以将立方体表示为平面形式，例如图A.32(a)所示的立方体对应图A.32(b)所

[page:399]

## 附录A 综合性研讨专题

示的平面形式。

图A.33给出了图A.31所示4个立方体的一个解，灰底黑字表示左右两面，白底黑字表示前后两面。

下面介绍使用图模型分析顿时错乱问题的方法:首先设置4个顶点R（红色)、G(绿色）、B（蓝色）、W（白色）（图A.34(a)），对于一个特定的立方体（图A.34(b)），在表示相对面的颜色顶点之间连一条无向边(图A.34(c)～(e))，形成一个无向图(图A.34(f))。

(注意:染色立方体与无向图不是一一对应的，但是这并不影响本问题的求解。)

类似地，可以得到图A.31中其他3个立方体对应的无向图，如图A.35所示。

将4个方块对应的无向图叠加起来，并对边标号1、2、3、4（表示边来自哪个立方体的无向图，来自同一个立方体的3条边给予相同的标号)，得到图A.36。

[page:400]

## 离散数学及应用（第2版）

如果游戏的解是存在的（如图A.33所示)，那么首先考虑前后两面，第1个立方体前后两面相对颜色是R-W、第2个立方体前后两面相对颜色是W-B，第3个立方体前后两面相对颜色是B-G、第4个立方体前后两面相对颜色是G-R，这就形成了叠加图G的一个有4条边的2-正则支撑子图（图A.37(a))，而且每条边标号各异。类似地，可以得到左右两面对应的子图（图A.37(b))，而且这两个子图不存在公共边。

反之，如果给出一个有4个顶点且每条边标号各异的2-正则图，就可以给出一种对应的码放方式，使得前后面都能看到所有的4种颜色。例如由图A.38(a)可以得到图A.38(b)所示的方案。类似地针对左面和右面，可以由图A.38(c)得到图A.38(d)所示的方案。

最后将图 A.38(b)所示的方案和图A.38(d)所示的方案“组合”即可得到游戏的一个解。

在“组合”的过程中唯一可能遇到的问题是:将图 A.38(b)和图 A.38(d)叠加后可得到图A.39(a)，而如图A.39(b)所示的立方体2则是GGWB。但是可以在保证不改变前面和后面的颜色的情况下，对换左面和右面的颜色，这只需要将立方体2翻转180°即可(图 A.39(c))。

[page:401]

## 附录A 综合性研讨专题

从前面的讨论可以看出，对于一个“顿时错乱”问题，求解过程如下:

（1）对每个立方体，给出对应的无向图。

（2）得到4个立方体无向图的叠加图G。

（3）需要叠加图G的两个具有4条边、没有公共边且各边标号互异的2-正则支撑子图（使用习题8.197的描述方式就是“G的两个没有公共边且各边标号互异的2因子”)。

（4）如果步骤3不能成功，则不存在解，否则由两个支撑子图构造一个解。

【例A.17】 求图A.40所示的顿时错乱问题的一个解。

找到图 A.40 中的两个具有4 条边且没有公共边的 2-正则支撑子图（图 A.41(a))，进而可以得到原问题的一个解（图A.41(b))。

[page:402]

## 离散数学及应用（第2版）

## A.9 抽芽游戏与抱子甘蓝游戏

【关键词】图；握手定理；平面图；欧拉公式

## A.9.1 抽芽游戏

## 1. 游戏规则描述

在 20 世纪 60 年代，康威（John Horton Conway）教授与派特森（Michael Stewart Paterson）创造了抽芽游戏（Sprouts）这个二人纸笔游戏。

抽芽游戏的规则如下:

（1）初始时，纸上有任意n个孤立顶点。

（2）二人轮流在图中加上一条边（边的两端是两个相异顶点或是同一顶点)，并在新增的边上任意加上一个顶点，但有如下要求:

①新增的边不能穿过任意已经存在的边。

②新增的边与自身不相交。

新增的边不经过任何顶点。

④每个点最多关联3条边（产生自环时记作两条边)，即图中任意顶点的度数不能超过3。

当图中无法添加边时，游戏结束。在初始的玩法中，画最后一条边的玩家获胜；也可以做相反的游戏规定，即被迫画最后一条边的玩家落败。

【例A.18】n=2时，图A.42展示了一次完整的游戏过程，实线表示玩家一，虚线表示玩家二，空心顶点表示初始顶点，黑色顶点表示度数达到3的顶点。

【例 A.19】 图 A.43 是 n=3 时的一次完整的游戏过程，共进行了8 次操作。

## 2. 游戏的最多操作次数

首先陈述一些基本事实和基本定义:如果图中存在某个点的度数小于等于1，则至少还可以在该点进行一次操作—画一个自环。因此游戏结束时，每个顶点的度数或者

[page:403]

## 附录A 综合性研讨专题

是2或者是3，称游戏结束时度数为2的顶点为幸存顶点（survivor)，度数为3的顶点为死亡顶点。

下面来证明抽芽游戏是一个有限步骤的游戏（博弈）。

定理A.5 抽芽游戏必将终止。

证明.定义图中的自由度（freedom）为（顶点数×3-边数×2），也就是当前图中所有顶点的“不饱和度”之和（点的度数为3称作饱和）。

由握手定理，图中的自由度总是非负的。游戏初始的自由度为3n，而每一次操作都使得图的自由度递减1（增加1个顶点、2条边），因此操作不可能无限进行下去，不超过3n次操作游戏一定终止。此外注意到最后一次操作总会产生一个新的度数为2的顶点，因此自由度不可能降到0，换言之，一次游戏的最多操作次数为3n-1。

这个值是确实可以达到的，例如图A.43所示；一般情况可见图A.44。

[page:404]

## 离散数学及应用（第2版）

(b)

## 3. 游戏的最少操作次数

下面计算抽芽游戏的最少操作次数。

游戏结束时，每个顶点的度数或者是2或者是3。假设游戏经过m次操作后结束，由于每次操作都增加一个顶点，将画出的边分为两段，所以游戏结束时有m+n个顶点和2m条边。假设游戏结束时有s个幸存顶点，则由握手定理有

$$2 \times 2m = 3 \times (m + n - s) + 2 \times s$$

整理可得 $m = 3n - s$ 0

考虑幸存顶点（度数为2），与它相邻的顶点必定都是度数为3的（否则彼此之间可以再连一条边)，那么必定是图A.45所示两种情况之一（参看图A.42(e)的两个幸存顶点)，每一个灰色的幸存顶点都联系着两个黑色的死亡顶点，而且不同的幸存顶点联系的死亡顶点彼此不同（否则这两个幸存顶点之间可以连一条边，参看图A.46的几种情况）。

因此有 $s + 2 \times s \leq m + n$ ，代入 $m = 3n - s$ ，可得m≥2n。这表明游戏结束时，一定至少进行了2n次操作，而且这个值是可以取到的，如图A.47所示。

[page:405]

## 附录A 综合性研讨专题

## 4. 游戏的必胜策略

虽然根据策梅洛定理可知，抽芽游戏的必胜策略必然存在，但目前为止，尚只是对较小的n值使用计算机搜索得到了具体的必胜策略，而无一般性结果。

## A.9.2 抱子甘蓝游戏

## 1. 游戏规则描述

抱子甘蓝（Brussels sprouts）游戏属于抽芽游戏的一个变体，其得名于“抱子甘蓝”这种植物的外形有一个“+”。

抱子甘蓝游戏与抽芽游戏的区别在于前者的顶点是“+”符号，称之为有4个自由臂。游戏的两个参与者轮流在图中加上一条边连接两个自由臂，之后在边中间加一个短线“-”，形成一个新的“+”符号，增加两个自由臂（图A.48)。

图A.49展示了一次完整的游戏过程，游戏共进行了8次操作。

## 2. 游戏的分析和证明

如果还是用之前的方式来分析，就会发现此时图中的自由度为(顶点数×4-边数×2)，而每一次操作都不改变图的自由度（增加2个自由臂和2条边)，无法判断游戏是否一定会终止。

而事实上，抱子甘蓝游戏的顶点情况和“度数不超过4”是不等价的。例如，图A.50(a)中间的“+”虽然有两个自由臂，但是不可以和自己连接，而图A.50(b)中间的顶点是可以和自己连接的（如虚线所示）。

[page:406]

## 离散数学及应用（第2版）

事实上有如下结果。

定理A.6 抱子甘蓝游戏经过有限步骤后终止；不仅如此，步骤数目是确定的。

证明.根据操作的规则可知，无论如何操作，游戏任一阶段的图都是平面图。

初始时候认为每一个“+”都是一个连通分支。在游戏的过程中，操作可能会增加面的个数或者减少连通分支数，例如图A.49的情况列在表A.10中。

表 A.10 定理 A.6 用表<table><tr><td>图 A.49</td><td>(a)</td><td>(b)</td><td>(c)</td><td>(d)</td><td>(e)</td><td>(f)</td><td>(g)</td><td>(h)</td><td>(i)</td></tr><tr><td>面数</td><td>1</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td></tr><tr><td>连通分支数</td><td>2</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr></table>

可以用归纳法证明，每个面（包括外部面）中至少有一个自由臂。如果图不连通，则任意两个连通分支的外部面都包含至少一个自由臂，这两个自由臂之间可以相互连接，使得图中的连通分支数目减少1，称这类操作为甲操作。而一个面中包含至少两个自由臂时，这两个自由臂之间还可以相互连接，游戏至少还可以进行一次操作，称这类操作为乙操作。

游戏中的每一次操作所连接的两个自由臂如果不属于同一个连通分支，则必然是甲操作，而甲操作只能进行n-1次；所连接的两个自由臂如果属于同一个连通分支，则必然是乙操作，如图A.51所示，减少同一个面内的两个自由臂，而增加的两个自由臂分属两个面，因此乙操作也不可能无限进行下去。由此可知游戏必定在有限步骤后结束。

假设游戏经过m次操作后结束，得到的连通平面图有f个面（包括外部面）。由于每次操作都增加一个顶点，将画出的边分为两段，所以游戏结束时有2m条边；由于不能再进行乙操作，因此每个面中只有一个自由臂。

计算图中每个顶点的4个臂，它们或者在1个面中，或者被边占用，因此有$4 \times (m + n) = 2 \times 2m + f,$ 即得 ${ \it f } { = } 4 n$

[page:407]

## 附录A 综合性研讨专题

另一方面，根据欧拉公式，可以得到 $(m + n) + f - 2m = 2$ ，则 $m=n+f-2=5n-2$

由定理A.6可以知道，抱子甘蓝游戏的“策略”很简单:无论如何连线加边，游戏都必定恰好在5n-2个步骤后结束，当n是奇数时先手必胜，当n是偶数时后手必胜。

## A.10 汉诺塔杂谈

【关键词】图；道路；哈密顿道路/回路；二进制表示

## A.10.1 汉诺塔图

考虑n个盘子的汉诺塔问题，称一种“各个盘子在3个柱上的一种合法放置”为一个“状态”，用一个{A,B,C}上长度为n的字符串表示当前状态，串中的第i项表示第n+1-i个盘子所在的柱子的标号。

【例 A.20】图A.52(a)的当前状态是 AAA，图 A.52（b）的当前状态是 ABB，图 A.52(c)的当前状态是 CBC，图 A.52(d)的当前状态是 CCC。

将状态作为图中的顶点，如果经过一次合法的移动可以将状态X变化到状态Y，则在顶点X向顶点Y引一条无向边，可以得到n个盘子的汉诺塔的无向图。n为1～6时对应的图如图A.53所示（(d)、(e)、(f)隐去顶点文字)。

从直观上可以看出，图A.53(a)~(f)具有相似性，n个盘子的汉诺塔的无向图由3个n-1个盘子的汉诺塔的无向图“垒”成。

考察汉诺塔的无向图中从“左下角”顶点AA…AA到“右下角”顶点CC…CC的道路，每条简单道路都是汉诺塔的一个移动过程。

从直观上看，这些道路中最短者就是AA…AA到顶点CC…CC的“直线”，也就是“三角形的边”（参看图A.54)。

而最长的简单道路如图 A.55 所示。(b)可以分为 AA→AC、AC→BC、BC→BA、BA→CA、CA→CC 共 5 段，其中 AA→AC、BC→BA、CA→CC 与(a)类似；同样地，(c)由3次(b)拼接而成，(d)也可由3次(c)拼接而成，这也体现了一种相似性。

[page:408]

## 离散数学及应用（第2版）

[page:409]

## 附录A 综合性研讨专题

推而广之，根据这种相似性，可以使用归纳法证明，对于任意的n≥2，n个盘子的汉诺塔的无向图中:

（a）有3ⁿ个顶点。

[page:410]

## 410

(b）有 $3 ( 3 ^ { n }     -     1 ) / 2$ 条边。

（c）顶点 AA…AA 到顶点 CC…CC的最短道路长度为 2ⁿ-1（即汉诺塔问题最少移动数)。

（d）顶点AA…AA到顶点CC…CC的最长简单道路，是图中的一条哈密顿道路，因此长度是3ⁿ-1。

而且，以n=3、4为例，如图A.56所示，将最长道路“下方的两个小三角形”的边水平翻转180°后再添加一条边即得图中的一条哈密顿回路。

## A.10.2 汉诺塔的非递归算法

下面介绍n个盘子的汉诺塔的非递归算法:

1 将3根柱子按顺序排成品字型。若n为偶数，按顺时针方向依次摆放A、B、C；若n为奇数，按顺时针方向依次摆放A、C、B。

2把圆盘1从现在的柱子移动到顺时针方向的下一根柱子上。

3把另外两根柱子上可以移动的圆盘移动到新的柱子上（事实上只有唯一的选择)。

4 如果没有达到目标要求，则返回步骤2。

【例 A.21】 n=3 的情况见图 A.57。

[page:411]

## 附录A 综合性研讨专题

## A.10.3 汉诺塔与普通二进制码

对于有n个盘子的汉诺塔问题，依次写出所有1-(n-1)的二进制表示 $B _ { n } B _ { n - 1 } { \cdots } B _ { 2 } B _ { 1 }$自左而右标记为第n位、第n-1位、…第2位、第1位。则 $\min (k|i = B_{n}B_{n - 1} \cdots B_{2}B_{1}, B_{k} = 1)$表示第i步移动k号盘子。

对于最小的盘子而言，总是有两种移动的可能性；对于其他盘子，总是有唯一的移动可能性。若n为偶数，最小的盘子的移动次序是A→B→C→A→…；若n为奇数，最小的盘子的移动次序是A→C→B→A→…。

【例 A.22】 n=4 的情况见表A.11。

表 A.11 例 A.22 用表<table><tr><td rowspan=2>i</td><td rowspan=2 colspan=4>4 位二进制码</td><td rowspan=2>移动的盘子编号</td><td rowspan=2>移动方法</td><td colspan=3>汉诺塔状态</td></tr><tr><td>A柱</td><td>B柱</td><td>C柱</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td></td><td></td><td>4321</td><td></td><td></td></tr><tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>A→B</td><td>432</td><td>1</td><td></td></tr><tr><td>2</td><td>0</td><td>0</td><td>1</td><td>0</td><td>2</td><td>A→C</td><td>43</td><td>1</td><td>2</td></tr><tr><td>3</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>B→C</td><td>43</td><td></td><td>21</td></tr><tr><td>4</td><td>0</td><td>1</td><td>0</td><td>0</td><td>3</td><td>A→B</td><td>4</td><td>3</td><td>21</td></tr><tr><td>5</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>C→A</td><td>41</td><td>3</td><td>2</td></tr></table>

[page:412]

## 412

续表<table><tr><td rowspan=2>i</td><td rowspan=2 colspan=4>4 位二进制码</td><td rowspan=2>移动的盘子编号</td><td rowspan=2>移动方法</td><td colspan=3>汉诺塔状态</td></tr><tr><td>A柱</td><td>B柱</td><td>C柱</td></tr><tr><td>6</td><td>0</td><td>1</td><td>1</td><td>0</td><td>2</td><td>C→B</td><td>41</td><td>32</td><td></td></tr><tr><td>7</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>A→B</td><td>4</td><td>321</td><td></td></tr><tr><td>8</td><td>1</td><td>0</td><td>0</td><td>0</td><td>4</td><td>A→C</td><td></td><td>321</td><td>4</td></tr><tr><td>9</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>B→C</td><td></td><td>32</td><td>41</td></tr><tr><td>10</td><td>1</td><td>0</td><td>1</td><td>0</td><td>2</td><td>B→A</td><td>2</td><td>3</td><td>41</td></tr><tr><td>11</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>C→A</td><td>21</td><td>3</td><td>4</td></tr><tr><td>12</td><td>1</td><td>1</td><td>0</td><td>0</td><td>3</td><td>B→C</td><td>21</td><td></td><td>43</td></tr><tr><td>13</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>A→B</td><td>2</td><td>1</td><td>43</td></tr><tr><td>14</td><td>1</td><td>1</td><td>1</td><td>0</td><td>2</td><td>A→C</td><td></td><td>1</td><td>432</td></tr><tr><td>15</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>B→C</td><td></td><td></td><td>4321</td></tr></table>

在 Mathematica 中，输入 IntegerExponent $[ \mathrm { R a n g e } [ 2 ^ { \wedge } \mathrm { n } \textrm { - } 1 ] , 2 ] + 1 ^ { \mathrm { \textcircled { 1 } } }$ 可以得到n个盘子的汉诺塔问题依次移动的盘子的号码。

例如，IntegerExponent[Range[2^4-1],2]+1 的结果是{1,2,1,3,1,2,1,4,1,2,1,3,1,2,1}。

## A.11存储器轮

【关键词】有向图；哈密顿回路；欧拉回路；映射；轮换

## A.11.1 存储器轮及解决方法

考虑4个0和4个1的一个圆形排列，使得每个3元组000、001、010、101、011、

111、110、100依次出现（如图A.58所示），称其为存储器轮。它描述所有8个3位0-1串只需要8位数字。

将这个问题一般化:将 $2 ^ { n }$ 个二进制数字 0 或1 排列成圆，使得这 $2 ^ { n }$ 个相邻的n元组包括所有的 $2 ^ { n }$ 个 n 位二进制序列。

(可以证明这 $2 ^ { n }$ 个二进制数字中有 $2 ^ { n - 1 }$ 个0及 $2 ^ { n - 1 }$ 个1。)

n=3时，方法之一是将三元组xyz作为顶点，从顶点xyz到顶点yzw引一条有向边，形成一个有向图（图A.59(a)），之后在图中寻找哈密顿回路即可(图A.59(b)粗线所示，它导出图A.58所示的存储器轮)。

图 A.58 3 位存储器轮

[page:413]

## 附录A 综合性研讨专题

下面提出两个问题:

(a) $n { = } 4$ 时，存在这样的存储器轮吗？

（b）是否对于任意的 $n   \geq   1$ 都存在存储器轮？

然而当 $n   \geq   4$ 时，图的规模较大，而哈密顿回路的构造又缺乏有效算法，因此上述方法不具有可操作性。

1946年，古德（I.J.Good）在一篇关于数论的论文中，使用不同的数学模型解决了这个问题。

例如 n=3时，三元组 xyz 作为顶点 xy到顶点yz的有向边（参看图A.60(a)）所生成的有向图如图A.60(b)所示，因为它的所有顶点的入度都等于出度，所以它是一个有向欧拉图。其中一条欧拉回路是000→001→010→101→011→111→110→100，对应着图 A.58所示的存储器轮。

【例A.23】n=4时，可以构造如图A.61(a)所示的有向图，其中存在一条欧拉回路，如图A.61(b)所示，可以得到如图A.61(c)所示的存储器轮。

定理A.7 对于任意正整数n，都存在着存储器轮。

证明. n=1的情况很容易验证。

[page:414]

## 414

$n { \geqslant } 2$ 时，构造 $2 ^ { n - 1 }$ 个顶点 $a_{1}a_{2}\cdots a_{n - 1} \in \{0,1\}^{n - 1}$ 。每个顶点 $a _ { 1 } a _ { 2 } { \cdots } a _ { n - 1 }$ 有两条入边 $0 \; a _ { 1 } a _ { 2 } { } ^ { \dots }$ $a_{n - 2} \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \cdot \over \over \over \over \over \over \over \boldsymbol { a _ { 1 } a _ { 2 } \cdots \over \over \over \over \over \over \over \over \over \boldsymbol { a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ { n - 1 } a _ _ { n - 1 - 1 } a _ \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \over \frac \over \over \over \over \over \frac \over \over \over \over \over \over \over \over \frac \over \over \over \frac \frac \over \over \over \frac \frac \frac \frac \frac \frac$ 和两条出边 $a _ { 1 } a _ { 2 } \cdots a _ { n - 1 }$ $\frac{a_{1}a_{2}\cdots a_{n-1}0}{}a_{2}a_{3}\cdots a_{n-1}0 、 a_{1}a_{2}\cdots a_{n-1}\frac{a_{1}a_{2}\cdots a_{n-1}1}{}\begin{array}{c}a_{2}a_{3}\cdots a_{n-1}1\\\end{array}$ (参看图A.62)，因此所有顶

点的入度和出度都等于2。

任意两个顶点 $a _ { 1 } a _ { 2 } { \cdots } a _ { n - }$ -1和 $b _ { 1 } b _ { 2 } . . . b _ { n - }$ 1之间都存在道路 $a _ { 1 } a _ { 2 } { \cdots } a _ { n - 1 } { \rightarrow } a _ { 2 } { \cdots } a _ { n - 1 } b _ { 1 } { \rightarrow } a _ { 3 } { \cdots }$ $a_{n - 1}b_{1}b_{2} \rightarrow \cdots \rightarrow b_{1}b_{2} \cdots b_{n - 1}$ ，因此该图是连通的。

由以上二者可以得到:该图是欧拉图，每一条欧拉回路对应一个存储器轮。 □

## A.11.2 德·布鲁因序列

由图中的欧拉回路得到的 0-1 串称作长度 $2 ^ { n }$ 的德·布鲁因（de Bruijn）序列。例如由图 A.61(b)得到长度16 的德·布鲁因序列0000111101100101。

长度 $2 ^ { n }$ 的德·布鲁因序列还有其他的构造方法，举例如下。

方法1:令 $m = 2^{n - 1}$ ，第一行写下m个1和m个0，第二行写下m个10，上一行编号和1或0之间的映射关系为: $f(i)=1,\ f(m+i)=0,\ 1 \leqslant i \leqslant m$

然后将第一行和第二行的1自左而右依次一一相连，将第一行和第二行的0也自左而右依次一一相连。连线实际上构成了位置编号的置换π(i)=2i-1，π(m+i)=2i，1≤i≤m。

将这个置换写成轮换的乘积的形式（每个轮换中最小的数值是递增的，且每个轮换

[page:415]

## 附录A 综合性研讨专题

都满足其中最小数值在第一个位置)。自左而右逐个写出各个轮换中数值对应第一行各个位置所映射到的第二行的1或0，则得到有2ⁿ个元素的德·布鲁因序列。

n=2,3,4时的情况如图A.63(a)、(b)、(c)所示。图A.63(a)分解为轮换的乘积后，符合要求的表示为(1)(23)(4)，对应的序列为f(1)f(2)f(3)f(4)=1100；图A.63(b)分解为轮换的乘积后，符合要求的表示为(1)(235)(476)(8)，对应的序列为f(1)f(2)f(3)f(5)f(4)f(7)f(6)f(8)= 11101000；图A.63(c)分解为轮换的乘积后，符合要求的表示为(1)(2,3,5,9)(4,7,13,10)(6,11) (8,15,14,12)(16),对应的序列为f(1)f(2)f(3)f(5)f(9)f(4)f(7)f(13)f(10)f(6)f(11)f(8)f(15)f(14)f(12) f(16) = 1111011001010000。

方法2:马丁（M.A.Martin）1934年证明了以下贪婪算法对所有的 $n { \geqslant } 2$ 都可以构造出一个长度 $2 ^ { n }$ 的德·布鲁因序列:

1 写出n 个0构成序列开始的n 项

2 如果在序列尾部添加一个1 后，和前 n-1 项相连构成已经出现过的长为n的 0-1 子串，则在序列尾部添加一个0；否则在序列尾部添加一个1

3若序列还不够2ⁿ项，则返回步骤2；否则序列就是一个长度2ⁿ的德·布鲁因序列

n=3,4时算法过程如表 A.12、表A.13所示。

表A.12 n=3 时贪婪算法构造德·布鲁因序列<table><tr><td>序列</td><td>序列尾部添加</td><td>备注</td></tr><tr><td>000</td><td>1</td><td></td></tr><tr><td>0001</td><td>1</td><td></td></tr><tr><td>00011</td><td>1</td><td></td></tr><tr><td>000111</td><td>0</td><td>否则出现111</td></tr><tr><td>0001110</td><td>1</td><td></td></tr><tr><td>00011101</td><td></td><td></td></tr></table>

[page:416]

## 离散数学及应用（第2版）

表 A.13 n=4 时贪婪算法构造德·布鲁因序列<table><tr><td>序列</td><td>序列尾部添加</td><td>备注</td></tr><tr><td>0000</td><td>1</td><td></td></tr><tr><td>00001</td><td>1</td><td></td></tr><tr><td>000011</td><td>1</td><td></td></tr><tr><td>0000111</td><td>1</td><td></td></tr><tr><td>00001111</td><td>0</td><td>否则出现1111</td></tr><tr><td>000011110</td><td>1</td><td></td></tr><tr><td>0000111101</td><td>1</td><td></td></tr><tr><td>00001111011</td><td>0</td><td>否则出现 0111</td></tr><tr><td>000011110110</td><td>0</td><td>否则出现1101</td></tr><tr><td>0000111101100</td><td>1</td><td></td></tr><tr><td>00001111011001</td><td>0</td><td>否则出现 0011</td></tr><tr><td>000011110110010</td><td>1</td><td></td></tr><tr><td>0000111101100101</td><td></td><td></td></tr></table>接下来介绍一个应用德·布鲁因序列的纸牌魔术①。

首先需要介绍一下“切牌”的概念:将一摞扑克中上面的若干张放到一摞的最下面称作一次切牌（如图A.64所示）

如果将纸牌视作一个循环序列（即最下面一张牌的“下1张”是顶端的一张)，则切牌并不改变纸牌之间的前后相邻关系。

魔术师邀请4位丝毫不知情的观众参加，拿出8张背面朝上的纸牌交给第1位观众。魔术师请第1位观众随意地切牌任意多次后将这叠纸牌交给第2位观众，第2位观众取走最上面的一张后将剩下的纸牌交给第3位观众，第3位观众取走最上面的一张后将剩下的纸牌交给第4位观众，第4位观众取走最上面的一张。魔术师故弄玄虚一番后，请第2～4位观众中取到红色花色纸牌者举一下手。然后魔术师可以再故弄玄虚一番，并道出第2～4位观众手中的纸牌。

[page:417]

## 附录A 综合性研讨专题

游戏的关键就在于8张纸牌的红黑花色排序为一个德·布鲁因序列“红红红黑黑黑红黑”（红色表示1，黑色表示0，则得到11100010)，随后第1位观众的切牌并不会改变这个循环的德·布鲁因序列，而连续3个“红/黑”组合是唯一的，所以对应的3张纸牌是可以唯一确定的。更进一步地，纸牌的点数可以采用一些便于记忆的方法。

例如，通过一些技巧设计，8张纸牌依次如表A.14所示。

表 A.14 8 张纸牌的设计<table><tr><td>牌面花色</td><td>红</td><td>红</td><td>红</td><td>黑</td><td>黑</td><td>黑</td><td>红</td><td>黑</td></tr><tr><td>连续三张纸牌的颜色</td><td>111</td><td>110</td><td>100</td><td>000</td><td>001</td><td>010</td><td>101</td><td>011</td></tr><tr><td>前两位</td><td>11</td><td>11</td><td>10</td><td>00</td><td>00</td><td>01</td><td>10</td><td>01</td></tr><tr><td>前两位确定花色</td><td></td><td></td><td>◆</td><td>小</td><td>小</td><td>小</td><td>◆</td><td>小</td></tr><tr><td>二二进制值就是点数</td><td>7</td><td>6</td><td>4</td><td>0</td><td>1</td><td>2</td><td>5</td><td>3</td></tr><tr><td>纸牌</td><td>7</td><td>6</td><td>4</td><td>10</td><td>*A</td><td>2</td><td>5</td><td>3</td></tr></table>

如果魔术过程中第3位和第4位观众取到红花色纸牌，那么连续的3个“红/黑”组合为“黑红红”，计算得第2位观众手中的纸牌是3；第3位观众开始的组合为“红红红”，手中的纸牌是♥7；第4位观众开始的组合为“红红黑”，手中的纸牌是♥6。

## A.12 中国邮路问题

## 【关键词】图；回路；欧拉回路

假设图A.65是一个住宅小区的平面图，昨夜突降大雪，希望扫雪车从小区大门进入将每条道路的积雪都清理干净后再离开小区，当然希望扫雪车总路程尽可能短。

类似的问题还有:

一个邮递员从邮局出发，要走完他所管辖的每一条街道，然后返回邮局。那么如何选择一条尽可能短的路线？

一名安全员需要从休息室出发，巡查美术馆中的每条道路后回到休息室，什么样的巡逻路线最短？

[page:418]

## 离散数学及应用（第2版）

由于该问题最早由管梅谷（KwanMei-Ko）先生于1960年提出，西方将之命名为中国邮递员问题（Chinese Postman Problem，CPP)，也称为中国邮路问题。

将图A.65用图的模型来表示:以街道为图的边，以街道交叉口为图的顶点，即得到图A.66。更一般的情形则是在一个赋权图中（权值均大于零）寻找至少包含每个边一次的“总长最短”的回路（不必是简单回路）。

在欧拉图中，任何一条欧拉回路都符合要求；当图不是欧拉图时，所求回路必然重复通过某些边。

管梅谷证明:若图的边数为m，则所求回路的边数最少是m，最多不超过2m，并且每条边在其中最多出现两次。

而这两个界都是“紧”的:如果图是欧拉图，则所求回路是一条欧拉回路，边数为m；如果图是树，则所求回路需要经过每条边两次，总边数为2m。

考虑一个简化情形:所有边的权值都是1。道路的长度就是经过的边数。

可以经过如下方法在无向连通非欧拉图中寻找最短邮路:

1 将图的奇数度顶点两两配对

2找到步骤1中同一对奇数度顶点之间的一条道路（任选即可)，并添加到原图中

3 如果在两个点之间添加了多于1条边，则在两个点之间成对地去除添加上的边（即若添加了偶数次边，则全部删去；若添加了奇数次边，则仅保留一条）

4 如果图中存在一个简单回路，添加的边数超过了回路长度的一半，则将该回路中添加的边去除，未添加边的添加新的重边

5 按步骤4反复修改，直到不能修改

6 结果图即为欧拉图，构造其中的欧拉回路，即得中国邮路问题的解

可以证明步骤3和4都是在不改变顶点度数的奇偶性的情况下减少图中的边数。

【例 A.24】 图 A.67(a)有 12 个奇点，(b)和(c)对应步骤2，(d)对应步骤 3，(e)对应步骤4，(f)是最终结果。

下面给出求解一般无向赋权图中的中国邮路问题的算法:

1 将图的奇数度顶点两两配对

2 找到步骤1中同一对奇数度顶点的一条道路（任选即可），并添加到原图中

3 如果在两个点之间添加了多于1条边，则在两个点之间成对地去除添加上的边

[page:419]

## 附录A 综合性研讨专题

4 如果图中存在一个简单回路，添加的边的总长度超过了回路长度的一半，则将该回路中添加了的边去除，未添加边的添加新的重边

5 按步骤4反复修改，直到不能修改

6 结果图即为欧拉图，构造其中的欧拉回路，即得中国邮路问题的解

可以证明步骤3和4都是在不改变顶点度数的奇偶性的情况下减少图中所有边的总权重数。

【例 A.25】 图 A.68(a)含有4个奇数度顶点 a、b、c、d，(b)和(c)对应步骤2，(d)对应步骤3，(e)对应步骤4，(f)是最终结果。

[page:420]

## 离散数学及应用（第2版）

特别是如果图中只有两个奇数度顶点，那么计算两点之间的最短道路，之后将最短道路的边添加到原图中即得。

## A.13 格雷码、超立方体的哈密顿回路和九连环

【关键词】二进制表示；超立方体图；哈密顿回路；递推关系

## A.13.1 格雷码

格雷码（Gray Code）由贝尔实验室的弗兰克·格雷（Frank Gray，1887—1969）在20世纪 40年代提出，并在1953 年取得美国专利 Pulse Code Communication。最初目的是在使用 PCM（Pusle Code Modulation）方法传输数字信号的过程中降低错误可能。

定义 A.1 如果将 $2 ^ { n }$ 个长为n的二进制串组成一个序列，使得将序列按圆形排列时一对相邻的二进制串只有一位不同，则称这些序列为n阶格雷码或简称格雷码（Gray code)。

在格雷码中，任意两个相邻的代码只有一位二进制数不同，最大码与最小码之间也仅一位不同，即“首尾相连”，因此又称循环码或反射码。

【例A.26】长度为3的普通二进制码（即 $0 { \sim } ( 2 ^ { 3 } { - } 1 )$ 的二进制表示）为000、001、010、011、100、101、110、111，而长度为3的格雷码为000、001、011、010、110、111、101、100。

在数字系统、机械工具、汽车制动等系统中，有时需要用传感器产生的数字值来指示位置。图A.69是编码盘概念图（此图中 $n { = } 3 )$ ，它把圆周等分成 $2 ^ { n }$ 个扇形，每个扇形分成n个部分，并且给每个部分赋值，暗的区域与对应的逻辑1的信号源相连，亮的区域没有连接，将其解释为逻辑0。

盘可以旋转，而触点（图A.69中箭头）将产生一个n位二进制编码，但当触点靠近两个扇形的边界时，在读出触点位置时可能发生错误。

例如，图A.69(a)使用普通二进制码，读出触点位置时的错误可能达到最大化，即3位都是错的；而图A.69(b)则使用格雷码对编码盘上的亮暗区域编码，使得其连续的码字之间只有一个数位变化，错误的影响可以降到最低。

[page:421]

## 附录A 综合性研讨专题

对n位二进制的码字，从右到左以0到 n-1编号，一个n位普通二进制码记为 $B _ { n - 1 } { } ^ { \cdots }$ $B _ { 1 } B _ { 0 } ,$ ，一个 n 位格雷码记为 $G _ { n - 1 } { \cdots } G _ { 1 } G _ { 0 } .$ 。n位普通二进制码和 n位格雷码之间的转换方法如下所示。

（a）n位普通二进制码转换为 n位格雷码:

$$\left\{ \begin{aligned} G_{n - 1} &= B_{n - 1} \\ G_{i} &= B_{i} \oplus B_{i + 1}, \quad 0 \leqslant i \leqslant n - 2 \end{aligned} \right.$$

其中⊕表示异或运算（即模2加法），0⊕0=0，0⊕1=1，1⊕0=1，1⊕1=0。

转换方法的示意图参见图 $\mathrm { A . 7 0 ( a ) }$

（b）n位格雷码转换为n位普通二进制码:

$$\left\{ \begin{aligned} B_{n - 1} &= G_{n - 1} \\ B_{i} &= G_{i} \oplus B_{i + 1}, \quad 0 \leqslant i \leqslant n - 2 \end{aligned} \right.$$

转换方法的示意图参见图A.70(b)。

图A.70 普通二进制码和格雷码的相互转换

【例A.27】 当 n=3时，3位普通二进制码和3位格雷码之间的对应如表 A.15所示。

表 A.15 3 位普通二进制码和 3 位格雷码<table><tr><td><eq>G _ { 2 } G _ { 1 } G _ { 0 }</eq></td><td>000</td><td>001</td><td>011</td><td>010</td><td>110</td><td>111</td><td>101</td><td>100</td></tr><tr><td><eq>B _ { 2 } B _ { 1 } B _ { 0 }</eq></td><td>000</td><td>001</td><td>010</td><td>011</td><td>100</td><td>101</td><td>110</td><td>111</td></tr></table>

## A.13.2 超立方体图中的哈密顿回路

下面介绍格雷码与超立方体图中哈密顿道路（回路）的关系。

回顾k-立方体图的定义:用长为k的0-1串组成的序列给顶点标号，两个顶点邻接当且仅当它们的标号串仅在一位上数字不同。

[page:422]

## 422

从图A.71中可以看到3位格雷码000、001、011、010、110、111、101、100对应着3-立方体图中的一条哈密顿道路（事实上，顶点000和100是相邻的，因此可以形成一条哈密顿回路)。

易见， $n   \geq   1$ 时，n阶格雷码一一对应着n-立方体图的哈密顿道路（n=1,2,4 的情况参见图 A.72(a)、(b)、(c)); $n   \geq   2$ 时，这条道路可以连接起点和终点形成哈密顿回路。

下面给出由(n-1)-立方体图的这条特殊的哈密顿道路构造n-立方体图的一条哈密顿道路的方法(n≥2):

1 将(n-1)-立方体图的这条哈密顿道路（例如图A.73(a)）经过的顶点标号最左端添加0，形成n-立方体图的一条道路 $\pi _ { 1 }$ (例如图A.73(b)中的粗实线部分)

2 将(n-1)-立方体图的这条哈密顿道路（例如图A.73(a)）经过的顶点标号最左端添加1，形成 n-立方体图的一条道路 $\pi _ { 2 }$ ，将 $\pi _ { 2 }$ 反向得到道路 $\pi _ { 3 }$ (例如图 A.73 (b) 中的粗点画线部分）

[page:423]

## 附录A 综合性研讨专题

3 将 $\pi _ { 1 }$ 的终点与 $\pi _ { 3 }$ 的起点相连（图 A.73 (b)中的粗虚线部分)，即形成 n-立方体图的一条哈密顿道路

根据上述构造n-立方体图的哈密顿道路的方法可以给出递归构造格雷码的方法（示例参看图 A.74):

1 1位格雷码有两个码字0和1。

2 将n位格雷码的码字加前缀0后，按顺序书写。

3 将n位格雷码的码字加前缀1后，按逆序书写。

4 步骤2和步骤3的结果就是 n+1位格雷码。

## A.13.3 九连环与格雷码

本节最后介绍一个中国传统民间智力玩具—九连环①。它以金属丝制成9个圆环，将圆环套装在横板或各式框架上，并贯以环柄。环柄部分称作“钗”，如图A.75(a)所示；另一部分主要是由9个环构成的，如图A.75(b)所示，它们从首至尾依次称为1号环到9号环。按照和钗的关系，每个环都有两个状态:在钗上或在钗下，简称在上和在下。游

[page:424]

## 离散数学及应用（第2版）

戏初始状态是9个环都在钗上，如图A.75(c)所示，目标是经过一些操作使得9个环都在钗下，如图A.75(d)所示（或者反之，从9个环都在钗下操作到9个环都在钗上）。

用长度为9的0-1串依次表示9号环到1号环的状态，用0表示在钗下，用1表示在钗上。例如图 A.75(c)对应的状态是111111111，图 A.75(d)对应的状态是 000000000，图 A.75(e)对应的状态是 010010000。

[page:425]

## 附录A 综合性研讨专题

九连环只有3个基本操作（本质上是两个）。

操作1:任何时候可以改变1号环的状态，即当1号环在上的时候，可以下1号环；当1号环在下的时候，可以上1号环。

（上1号环将状态 $b _ { 9 } b _ { 8 } { \cdots } b _ { 2 } 0$ 变为 $b _ { 9 } b _ { 8 } { \cdots } b _ { 2 } 1$ ；而下1号环将状态 $b _ { 9 } b _ { 8 } { \cdots } b _ { 2 } 1$ 变为 $b _ { 9 } b _ { 8 } { \cdots }$ $b _ { 2 } 0$ ，表示状态的串只有一位不同。)

操作2:可以改变紧跟在领头环后的环的状态，所谓“领头环”是指在钗上的最靠首的环，而并不一定是1号环（图A.75(e)中的领头环是5号环，可以进行的操作是上6号环)。

(将状态 $b _ { 9 } { \cdots } b _ { i } 0 1 0 { \cdots } 0$ 变为 $b _ { 9 } { \cdots } b _ { i } 1 1 0 { \cdots } 0$ ；或者将状态 $b _ { 9 } { \cdots } b _ { i } 1 1 0 { \cdots } 0$ 变为 $b _ { 9 } { \cdots } b _ { i } 0 1 0 { \cdots }$ 0，表示状态的串只有一位不同。)

操作3:1号、2号环状态相同时可以同时改变状态，即当1号、2号环都在钗上时可以一次操作同时下；当1号、2号环都在钗下时可以一次操作同时上。

实质上这相当于先上1号环（操作1）再上2号环（操作2），或者先下2号环（操作2）再下1号环（操作1）。

将所有环从钗上取下（状态1…1到0…0）的方法反向进行——下改为上，上改为下，操作顺序逆序进行，就是将所有环从钗下装上（状态0…0到1…1）的方法。

使用上述基本操作，可以给出全部取下n连环的递归式解法:

1 若n=1，则使用操作1直接下1 号环。

2 若n=2，则使用操作2下2号环后使用操作1下1号环，或者使用操作3一起下2号环和1号环。

3 若n>2，则

3.1 使用解决(n-2)连环的方法，将 n-2 号环至1号环全部取下（状态111…1到 $1 1 0 ^ { \cdots 0 } )$

3.2使用操作2，取下n号环（状态110…0到010…0）。

3.3 反向使用解决(n-2)连环的方法，将n-2号环至1号环全部装上(状态010…0到011…1)。

3.4 使用解决(n-1)连环的方法，将(n-1)号环至1号环全部取下（状态011…1到000…0)。

用 R(n)表示全部取下 n 连环操作次数，则 $R ( 1 ) { = } 1$ ；只允许操作1和操作2时 $R(2) = 2$允许操作3时 $R ( 2 ) { = } 1$

当 $n { > } 2$ 时，有递推关系

$$R(n)=R(n-2)+1+R(n-2)+R(n-1)$$

令 $T(n) = R(n) + 1/2$ ，则得到2阶常系数线性齐次递推关系:

$$T(n) = T(n - 1) + 2T(n - 2)$$

求解得到

$$R(n)=(2^{n+2}+(-1)^{n+1}-3)/6,\quad R(2)=2$$

$$R(n)=(2^n-(-1)^n-1)/2,\quad R(2)=1$$

当 n=9时，R(9)=341 或256。

下面介绍九连环与格雷码之间的联系。

注意到操作1和操作2会改变状态，但是表示状态的串都只有一位发生改变，事实上一次求解n连环过程中状态编码的变化是n位格雷码的一个连续部分（而不是全部）。

[page:426]

## 离散数学及应用（第2版）

【例A.28】 求解3连环的过程如表A.16所示。

表 A.16 求解 3 连环的过程<table><tr><td>图示</td><td>状态</td><td>状态转换为二进制码</td><td>二进制码对应的十进制数值</td><td>到下一状态的操作</td></tr><tr><td></td><td>111</td><td>101</td><td>5</td><td>取下1号环</td></tr><tr><td></td><td>110</td><td>100</td><td>4</td><td>取下3号环</td></tr><tr><td></td><td>010</td><td>011</td><td>3</td><td>装上1号环</td></tr><tr><td></td><td>011</td><td>010</td><td>2</td><td>取下2号环</td></tr><tr><td></td><td>001</td><td>001</td><td>1</td><td>取下1号环</td></tr><tr><td></td><td>000</td><td>000</td><td>0</td><td></td></tr></table>

令 $S _ { n }$ 表示n位格雷码字11…11对应的普通二进制码的十进制数值，则可以证明:

（1）只允许使用操作1和操作2，求解n连环过程中状态编码作为格雷码字对应的普通二进制码的十进制数值是从 $S _ { n }$ 递减到0。

(2)当 n 是奇数时， $S _ { n } = ( 2 ^ { n + 1 } - 1 ) / 3$ ；当 n 是偶数时， $S_{n}=(2^{n + 1} - 2)/3 (n > 1)$

由此也可以得到九连环的求解操作步数恰为 $S _ { 9 } { = } 3 4 1$

## A.14 谢尔宾斯基三角

【关键词】组合数；林登麦伊尔系统；混沌游戏；元胞自动机

北宋人贾宪约在1050年首先使用“贾宪三角”进行高次开方运算。南宋数学家杨辉

[page:427]

## 附录A 综合性研讨专题

在《详解九章算法》（1261年）中记载并保存了“贾宪三角”，故又称“杨辉三角”。元朝数学家朱世杰在《四元玉鉴》（1303年）中扩充“贾宪三角”成为“古法七乘方图”。法国数学家帕斯卡（Blaise Pascal，1623—1662）在 1653 年发表的Traité du triangle arithmétique（Treatise on the Arithmetical Triangle）中描述了这个三角形，因此它在欧洲被称作“帕斯卡三角”。

在图A.76(a)中，第 m（m≥0）行第n（0≤n≤m）个值为C(m, n)。每个数都等于它左斜上方和右斜上方两数之和。（图A.76(a)为古法七乘方图，图A.76(b)将其翻译为阿拉伯数字记法。)

## 圈方桑七法古

将有 $4 \times 2^{n} (n \geqslant 0)$ 行的贾宪三角中的奇数染为黑色，n 为 0~5 的情况见图 A.77，类似于n个盘子的汉诺塔图，也呈现出了很强的自相似性（指一个图形相似于它自身的一部分)。

事实上，无论图A.77还是n个盘子的汉诺塔图，当n→∞时，都将形成谢尔宾斯基三角（Sierpinski triangle)，它由波兰数学家谢尔宾斯基在1915年提出。

下面再给出几种生成谢尔宾斯基三角的方法:

方法一:几何方法（图A.78）。

1 取一个实心的正三角形。

2 对所有实心正三角形，进行如下操作:

2.1 连接3条边的中点，将它分成4个小正三角形。

2.2 将正中间的正三角形“挖空”。

3 重复步骤2。

[page:428]

## 离散数学及应用（第2版）

[page:429]

## 附录A 综合性研讨专题

## 方法二:混沌（chaos）游戏（图A.79）。

1在平面上选取一个正三角形的3个顶点，记为A、B、C，将3个点染为黑色

2 在平面上随机选取一个点P

3生成一个[1，3]内的随机整数

4 如果该随机数为1，则更新P为P和A连线的中点；如果该随机数为2，则更新P为P和B连线的中点；如果该随机数为3，则更新P为P和C连线的中点

5 将P点染为黑色

6 重复步骤3

[page:430]

## 离散数学及应用（第2版）

方法三:林登麦伊尔系统（Lindenmayer system）。

开始符号为 F-GG，规则为(F→F-G+F+GF)及(G→GG)，其中F和 G都表示向前画单位长度的线段，加号和减号（+和-）分别表示左转逆时针120°和右转顺时针120°。

图A.80表示由规则构造谢尔宾斯基三角的前几步过程。

元胞自动机（cellular automaton)也译作细胞自动机，由冯·诺依曼（J.vonNeumann)在20世纪50年代提出。此后，史蒂芬·沃尔夫勒姆（StephenWolfram）对元胞自动机理论进行了深入的研究。

考虑长度无限的一维格子表（图A.81(a))，用黑色格子表示1，用白色格子表示0。有无限多行这样的一维格子表就形成了一个“有始无终”的二维格子表（图A.81(b))。从第2行开始，每个格子是黑还是白根据上一行的相邻若干格子的情况（称作pattern）并依照一定的规则（rule）决定。

[page:431]

## 附录A 综合性研讨专题

<table><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></table>(a)

(b)图 A.81 元胞自动机

例如表 A.17 显示的“规则 $9 0 ^ { \circ }$ ，相邻的3个格子决定下一行3个位置正中间的格子的状态。可以参看图A.82（为清晰起见，图中用灰色表示“白”)。

表 A.17 规则 90<table><tr><td>当前行相邻的3 个格子</td><td>111</td><td>110</td><td>101</td><td>100</td><td>011</td><td>010</td><td>001</td><td>000</td></tr><tr><td>行正中间位置格子的状态</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td></tr></table>

假设第一行只有一个黑色格子，不断应用规则90（图A.83)，也可以得到谢尔宾斯基三角。

(b)

谢尔宾斯基三角是自相似集的例子，是一种分形。1973年，曼德勃罗（B.B.Mandelbrot）首次提出了分维和分形（fractal）的设想，其原意具有不规则、支离破

[page:432]

## 432

碎等意义。分形一般是指“一个粗糙或零碎的几何形状，可以分成数个部分，且每一部分都（至少会大略）是整体缩小尺寸的形状”，此一性质称为自相似。

分形作为一种数学工具，现已应用于各个领域，如数学、生物、大气、海洋、社会学科、计算机科学（例如基于分形的图片压缩）等，在音乐、美术领域也产生了一定的影响。图 A.84 就是使用分形创作软件Fractal Explorer所作的电脑图形。

[page:433]

## 附录B

## 课程综合实验

## B.1 实验一:汉诺塔问题的变体

## B.1.1 实验内容

1.3.5节介绍了汉诺塔问题及其递归解法、总移动次数的递推表达式和求解。本次实验的内容是考虑汉诺塔问题的若干变体。

## 1. 邻近移动

邻近移动即在原始的汉诺塔问题上增加一个要求:不允许A柱与C柱之间的直接转移，即每次只能移动到中间柱B或从中间柱B移出，如图B.1所示。

## 2. 循环移动

循环移动的变化在于:设A柱、B柱、C柱（及A柱）构成一个顺时针方向的三角形，所有的移动必须是顺时针方向，即或从A柱到B柱，或从B柱到C柱，或从C柱到A柱，如图B.2所示。

## 3. 奇偶汉诺塔

奇偶汉诺塔不对移动方式增加限制，但是要求最终结果是:所有奇数号的盘子放到B柱上，所有偶数号的盘子放到C柱上，如图B.3所示。它的求解方法和最少移动步数又是怎样呢？

[page:434]

## 离散数学及应用（第2版）

## 4. 双色汉诺塔

双色汉诺塔与汉诺塔问题在规则本质上是相同的，但不同的是，现在每种大小的盘子都有两个:一个黑色和一个白色。初始情况是A和B柱交错放置不同颜色的盘子，目标是使A柱和B柱上的盘子都是同色的，而且底部最大的圆盘需要交换位置，如图B.4所示。

## B.1.2 实验要求

学生须提交以下内容:

（1）汉诺塔各问题的解法描述。

（2）各问题总移动次数的递推表达式。

(3）各问题总移动次数（通过求解(2)的递推表达式得到）。

（4）实现各问题解法的源程序代码（须有适量注释）及输出结果（应和(1)~(3)所得到的结果一致)。

[page:435]

## 附录B 课程综合实验

## B.1.3 扩展阅读

有兴趣的学生可以查阅以下主题的资料:

（1）磁性汉诺塔（magnetic Hanoi）。

（2）多柱汉诺塔（multi-pegs Hanoi)。

## B.2 实验二:命题演算的计算机实现

真值表是命题逻辑中的一个重要工具，利用它可以解决命题逻辑中的几乎所有问题。例如，可以求命题公式的主范式，判断命题公式的类型，判断两个命题公式是否等价，判断推理形式是否正确，等等。

本实验要求编写程序完成以下功能:

（1）从文件读入逻辑表达式（由教师提供，仅由合取联结词“&”、析取联结词“”、否定联结词“!”及命题变项p、q、r、u、v、w组成，且命题变项的个数不超过6)，判断其是否是命题公式。

（2）实现计算机对命题公式的存储，给出命题公式的二叉树表示方法。

（3）给出得到的二叉树的前序、中序、后序遍历结果。

（4）构造该命题公式的真值表。

(5）由该命题公式的真值表得到主范式（包括主合取范式和主析取范式）。

（6）通过真值表判断该命题公式的类型。特别是，可以:

（a）判断两个给定的命题公式是否等值。

（b）判断一个给定的推理形式是否正确。

（7）利用上面的工作解决下面两个逻辑趣题:

（a）灵灵新买了一条裙子，但是她不肯给大家看，只是给出了一个提示:“我新买的裙子的颜色是红、黄、黑之一。

小张说:“灵灵一定不会买红色的。”

小王说:“那一定是黑色或黄色。”

小李说:“一定是黑色。”

最后灵灵说:“你们三人中至少有一个人说对了，至少有一个人说错了。”

请问，灵灵的新裙子是什么颜色的？

（b）灵灵、欢欢和乐乐一起去吃早饭，他们每人要的不是包子就是面条，已知:

①如果灵灵要的是包子，那么欢欢要的就是面条。

②灵灵或乐乐要的是包子，但是不会两人要的都是包子。

③欢欢和乐乐不会两人都要面条。

请问:“灵灵要的是面条”这一判断是否正确？

[page:436]

## 离散数学及应用（第2版）

## B.3 实验三:二元关系及其应用

关系是客观的，为事物所固有，存在于相应的事物之间。在日常生活学习和工作中我们经常遇到和处理关系，例如兄弟关系、同学关系、上下级关系、朋友关系、平面上直线的平行关系、整数之间的整除关系、实数之间的大小关系等。

在数学中关系被抽象成一个基本概念，它在计算机科学中被广泛应用，也是“离散数学”这门课程的基本概念和核心概念。其中等价关系和偏序关系则是两种重要且常见的特殊关系。例如，在生活中，平面上三角形的“相似”关系是一个等价关系，学生的“同班”关系也是一个等价关系，工程问题（如建水坝、造飞机、组装机床、软件开发等）中包含的工序之间的先后关系构成一个偏序关系。

另一方面，在生活中很多时候当我们谈到一件事情时，可能会有意无意地省略其作为关系的某些性质。例如:

(a）“打开电脑后请输入正确的密码进行登录，登录成功后请打开Word。”这段话中隐含“打开Word”是在“打开电脑”之后进行的。

（b）省略“同班”关系满足的传递性、对称性和自反性。例如“张良和陈平是同班同学，萧何和陈平也是同班同学”这段话中实际上隐含着一些有序对。

因此，对于实际生活中的问题，首先要将其表示为关系的形式，然后很重要的一个步骤就是将其所隐含的有序对补充完整，才能进行下一步的理论分析和处理。

本实验的主要内容就是对于给定的关系R，通过添加一些有序对使其满足特定性质，并通过关系的运算解决一些看似和关系性质、关系运算无关的问题。

## B.3.1 准备工作

关系作运算后的结果可能影响关系原来所具有的性质。请判断以下命题是否成立，如不成立请给出反例:

（a）如果R满足对称性，那么 $R ^ { \infty }$ 一定满足对称性。

（b）如果R满足自反性，那么 $R ^ { \infty }$ 一定满足自反性。

（c）如果R满足对称性，那么 $R ^ { - 1 }$ 一定满足对称性。

（d）如果R满足传递性，那么 $R ^ { - 1 }$ 一定满足传递性。

（e）如果R满足自反性，那么 $R \cup R ^ { - 1 }$ 一定满足自反性。

（f）如果R满足传递性，那么 $R \cup R ^ { - 1 }$ 一定满足传递性。

（g）如果R满足反对称性，那么 $R ^ { 2 }$ 一定满足反对称性。

（h）如果R满足反对称性，那么 $R ^ { \infty } .$ 一定满足反对称性。

## B.3.2 等价关系及其应用

首先定义要研究的对象:对于给定的集合A上关系R，若A上关系S满足(1) $R { \subseteq } S { \mathrm {  。  } }$

[page:437]

## 附录B 课程综合实验

（2）S是一个等价关系。

（3）若A上关系S'满足上述两个条件，则必有 $S \subseteq \mathrel { S ^ { \prime } } \mathrm { { _ { c } } }$则称S为R的等价闭包，记作 ${ \boldsymbol { S } } { = } { \boldsymbol { R } } ^ { \mathsf { e } }$ 0

请完成以下内容:

（1）若R为定义在集合A上的关系，那么应当如何计算 $R ^ { \mathsf { e } } ?$ 若R为定义在 $A = \{ a, b,$ $\boldsymbol { c } , d , e , f \}$ 上的关系，其有向图如图B.5表示。请计算 $R ^ { \mathsf { e } } ,$

（2）编写一个程序，根据一个关系R的矩阵表示，计算其等价闭包 $R ^ { \mathrm { e } }$

（3）考虑一个实际应用场景:某软件开发项目共包括16个模块，以下模块须由同一个开发小组实现:模块1与2，模块6与3，模块4与12，模块11与5，模块7与13，模块16与2，模块14与9，模块4与6，模块5与1，模块10与9，模块9与13，模块7与8，模块13与10，模块11与16，模块3与4。

（a）请利用前面(1)和(2)的结果，通过程序回答:

①最多可以分成多少个开发小组？

②每个小组各自的开发任务是什么？

（b）现实生活中的问题永远都是变化的。要解决这些不断变化的问题，是每一次都新建一个数学模型，还是每次都对已有模型进行改造更好呢？换言之，把改变留在前期数据的处理部分和留在后期的算法实现部分哪个更好呢？

如果在(a)的基础上，增加要求“每个小组至多实现5个模块”，那么是否有满足要求的分组方案？通过程序回答这个问题。

(c）在(a)的基础上，增加要求“模块9和模块13不可以由同一个开发小组实现”，请通过程序回答:是否有满足要求的分组方案？如果有，最多可以分成多少个开发小组？每个小组各自的开发任务是什么？

## B.3.3 偏序关系及其应用

哈斯图的引入简化了偏序关系的图形表示，前面讲授了将关系的有向图转化为哈斯图的方法。注意到哈斯图中不存在“三角形”，即不存在顶点a、b、c，使得有向边(a,b)、(b, c)和(a, c)都存在，因此这里提出了另一种画哈斯图的方法:

1 去掉所有顶点的自环:

$$S \leftarrow R - \{ ( \bar { \alpha } , \bar { \alpha } ) \mid \bar { \alpha } \in A \}$$

$$2 \ \mathbf { F o r } \mathbf { \textit { 1 } } = \mathbf { \textit { 1 } } \mathbf { t o } \left| \mathbf { \textit { A } } \right|$$

[page:438]

## 438

2.1 若 a<b 且使得 a<i 且 i<b，则去掉有向边 $( a , b )$ ，更新原图。

$$\mathtt { I f e x i s t s ( } a , \mathtt { i ) , ( } i , b \mathtt { ) , ( } a , b \mathtt { ) t h e n } S \leftarrow S \leftarrow \{ \mathtt { ( } a , b \mathtt { ) } \}$$

例如，偏序集({1,2, 3,4},≤)在步骤1 之后的结果如图B.6所示。

然后依次去掉三角形{1,2,3}中的有向边(1,3)、三角形{1,2,4}中的有向边(1,4)、三角形{2,3,4}中的有向边(2, 4)，则结果如图B.7所示。

下面证明此方法的正确性。要证明最终结果中不存在多边形（图B.8中加粗箭线表示的部分)。

将所有满足 bRc 且 $c R a$ 的元素c中最先被处理（即执行第2步）的记作 $d _ { \circ }$

如果处理d时 $( b , d ) { \in } S$ 且 $( d ,   a ) { \in } S$ ，则 $( b , a )$ 已被删除，因此不会形成多边形。

如果不满足上述两个条件，假设 $( b ,   d ) { \notin } S ,$ ，于是之前必定存在x∈A，bRx且 $x R d ,$ ，从而删去了(b, d)。但是 bRx、xRd 且 dRa，有 bRx 且 $x R a$ ，与d的选择矛盾。

假设 $( d , a ) { \notin } S ,$ ，于是之前必定存在 $y { \in } A , ~ d R y$ 且 $y R a$ ，从而删去了 $( d ,   a )$ 。类似地可以证明 bRy 且 $y R a$ ，与d的选择矛盾。 口

（1）根据前面的说明，给出由关系的布尔矩阵形式表示直接画哈斯图的方法。

（2）定义下一步要研究的对象:

对于给定的集合A上关系R，如果A上关系S满足

① $R { \subseteq } S \circ$

② S是一个偏序关系。

[page:439]

## 附录B 课程综合实验

③ S是这样的偏序关系中最小的一个。

则以下简记S为 $R ^ { \mathrm { p } }$ (即包含R的最小偏序关系)。

本实验内容完成以下两个任务:

（a）若R为定义在集合A上的关系，且假设 $R ^ { \mathrm { p } }$ 存在，那么如何计算 $S { = } R ^ { \mathrm { p } } ?$

（b）编写一个程序，从文件读入一个关系R的矩阵表示，计算 $R ^ { \mathrm { p } }$ 的矩阵表示（此环节假定 $R ^ { \mathrm { p } }$ 必定存在)，继而画 $R ^ { \mathrm { p } }$ 的哈斯图。

(3）在环节(2)中，假设 $R ^ { \mathrm { p } }$ 必定存在，但事实上，是否“对于任意一个关系R， $R ^ { \mathfrak { p } }$都存在”？

请思考并回答:“从理论上讲，如何断定对于给定的集合A上关系R，是否存在包含R的最小偏序关系？””。并请编程实现对给定关系R是否存在包含R的最小偏序关系的断定。

（4）考虑一个实际应用问题:一个程序中通常包括多个模块，各个模块之间存在调用关系。如果产生了模块之间的循环调用（例如，模块1调用模块2，模块2调用模块3，模块3调用模块1)，那么就有可能出现死循环。能否设计一个方法检测程序中是否有这种情况出现？

假设一个程序共包含8个模块，其调用关系是:模块1调用了模块2和模块3，模块2调用了模块8和模块3，模块3调用了模块6，模块4未调用其他模块，模块5调用了模块4和模块7，模块6调用了模块5和模块7，模块7未调用其他模块，模块8调用了模块5。

请编写程序判断该程序中是否存在模块循环调用的情况，如果不存在，请给出各模块之间调用关系的哈斯图以及一个拓扑排序。

（5）完成实验B.3.2及本实验前4个环节后，请思考并回答以下问题:

（a）关系一般有3种表示方法:集合的方式、关系矩阵的方式、关系图的方式。你认为本实验都采用关系矩阵的方式来处理的原因是什么？

（b）为什么对于每一个关系都存在包含它的等价关系，但是却可能不存在包含它的偏序关系？你认为其根本问题何在？

（c）你认为对于某关系R不存在包含其的偏序关系的本质原因是什么？你还能想到其他方法判定是否存在包含R的偏序关系么（此为可选答的问题）？

## B.3.4 连通性和欧拉道路/回路

4.3节介绍过（有限集合上）关系中的道路和回路，在第8章中又介绍了图中的道路和回路，图中与道路有关的问题是否可以通过关系的运算解决？

一个简单图可以视作某关系的图形表示，即此时可以将图和有限集合上的对称关系一一对应起来。

（1）编写程序，从文件读入一个简单图的矩阵表示，判断图中是否存在从顶点a到顶点b的道路。

（2）编写程序，从文件读入简单图的矩阵表示，判断其连通性。

（3）给定一个简单图的邻接矩阵表示如下:

[page:440]

## 离散数学及应用（第2版）

$$\begin{array} { r } { a  { b } c  { d } e  { f } } \\ { \begin{array} { r } { a \left( 0  { 1 }  { 0 }  { 1 }  { 0 } \right) } \\ { b \left|  { 1 }  { 0 }  { 1 }  { 0 }  { 0 } \right| } \\ { c \left|  { 0 }  { 1 }  { 0 }  { 0 }  { 0 } \right| } \\ { d \left|  { 1 }  { 0 }  { 0 }  { 1 }  { 0 } \right| } \\ { e \left|  { 1 }  { 0 }  { 0 }  { 1 }  { 0 }  { 1 } \right| } \\ { f \left( 0  { 0 }  { 0 }  { 0 }  { 1 }  { 0 } \right) } \end{array} } \end{array}$$

编写一个程序，判断边 ab、de、ef是否是桥。

（4）编写一个程序，从文件读入一个简单图的矩阵表示，判断该图属于以下哪种情况。

①存在欧拉回路。

②不存在欧拉回路，但是存在欧拉道路。

③不存在欧拉道路。

对于属于情况①的图，使用弗勒里（Fleury）算法构造一条从a点开始的欧拉回路；对于属于情况②的图，使用弗勒里算法构造一条欧拉道路。

（5）前面讨论的都是无向图，实际上在有向图上也可以定义连通性、欧拉道路和欧拉回路。请编写一个程序，从文件读入一个有向图的矩阵表示，判断该图属于以下哪种情况。

①存在欧拉回路。

②不存在欧拉回路，但是存在欧拉道路。

③不存在欧拉道路。

对于属于情况①的图，从a点开始构造一条欧拉回路；对于属于情况②的图，构造一条欧拉道路。

## B.4 实验四:村庄修引水渠问题

一个村庄有若干户人家，村庄附近有一条河（假定河岸为直线)，如图B.9所示。

各户希望从河直接或间接引水到家中，但受限于客观条件，只能:

（1）由河岸修到农户家中，即各户从河岸引水道。

[page:441]

## 附录B 课程综合实验

（2）由农户家中修到农户家中，即各户之间引水道。

即允许图B.10(a)或(b)的修水道方式，但是不允许(c)的方式。

## B.4.1 实验内容（一）

(1)假定水道的成本与直线距离成正比，16 个农户的坐标为(1, 13),(2, 19),(3,2),(4, 7), (6, 5), (6, 11), (9, 14), (11, 2), (11, 8), (11, 17), (12, 20), (14, 12), (15, 5), (19, 1), (19, 16), (20,6)，河岸是直线 $y { = } 0 .$ 。请编写程序给出最省钱的修水道方法。

（2）现实生活中的问题永远都在变化。现在假设有两条相交的河流分别是直线x=0和γ=0，如图B.11所示，各个农户的坐标不变。请编写程序给出最省钱的修水道方法。

（3）现在假设有3条相交的河流（假定两条河流相互平行且都与第三条垂直，如图B.12所示)。应该如何求最省钱的修水道方法？请写出你对模型的修改和调整。

（4）请分析:如果河流从村庄中间穿过，如图B.13所示，是否需要修改抽象模型？会对上面3个问题的结果产生影响吗？

[page:442]

## 442

## B.4.2 实验内容（二）

问题在实验内容（一）的基础上又有了变化。例如在图B.14中，农户1与河流之间的水管要给5家农户供水，因此不能使用普通水管，否则农户6得到的水量太小，因此农户1与河流之间的水管的成本要提高（就像人体中主动脉和毛细血管的半径也有很大差别一样)。

假定一段水管的成本不仅正比于水管长度，还正比于该水管供水（从河流算起）的农户的数目（参看图B.15)。例如图B.14中，农户1与河流之间水管的成本是 $y _ { 1 } { \times } 6$ 个单位成本（供水给农户1~6)，农户1与农户2之间水管的成本是 $\sqrt{ \left( x_{1} - x_{2} \right)^{2} + \left( y_{1} - y_{2} \right)^{2} } \times 4$个单位成本（供水给农户2、4、5、6）。

（1）仍假设河流是直线 $y { = } 0$ ，各个农户的坐标不变。请编写程序给出最省钱的修水道方法。

(2）你认为在(1)中得到的结果是否合理？为什么？是否可以用你总结的方法来解决这类问题呢？

（3）在(1)的基础上，将河流增加为两条，分别是 $x { = } 0$ 和 $y { = } 0$ ，各个农户的坐标不变。请编写程序给出最省钱的修水道方法。

## B.4.3 讨论与思考

（1）实验内容（一）和（二）是不同的问题，采用的解决方法也有所不同，你觉得这两个方法之间有什么联系？

（2）现实生活中，可能既不是实验内容（一）的情况，也不是实验内容（二）的情况，而更接近一种折中。例如，水管的成本不只和它给几户供水有关，也和供水户的远近有关，具体如下:

$$水管的成本 = 水管长度  ×该段水管总权重$$

而该段水管的总权重值为 $\sum _ { i = 1 } ^ { n } \alpha ^ { L _ { i } - 1 }$ ，其中 n表示该水管给 n家农户供水， $L _ { i }$ 表示其中农户i沿该水管到河的水管段数 $\alpha   \in   [ 0 , 1 ]$ 是一个常数（如图B.16、图B.17所示）。

问题仍然是:如何修水道最省钱？给出你对这个问题的抽象建模和分析。它和实验内容（一）和（二）有什么关系？

[page:443]

## 附录B 课程综合实验

## B.5 实验五:考场安排问题

## B.5.1 实验内容

学校期末要举行各个课程的考试，要求学同一门课程的学生考试时间必须相同。例如，表B.1表示了5名学生和8门课程的选课情况:

表 B.1 学生选课情况<table><tr><td rowspan=2>学生</td><td colspan=8>课程</td></tr><tr><td><eq>\mathbf { A }</eq></td><td><eq>\mathbf { B }</eq></td><td><eq>\mathbf { C }</eq></td><td>D</td><td>E</td><td>F</td><td>G</td><td>H</td></tr><tr><td><eq>甲</eq></td><td><eq>\sqrt { }</eq></td><td><eq>\sqrt { }</eq></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td></td><td></td><td></td><td></td></tr><tr><td><eq>乙</eq></td><td><eq>\surd</eq></td><td></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td></td><td></td><td></td><td></td></tr><tr><td><eq>丙</eq></td><td></td><td></td><td><eq>\surd</eq></td><td></td><td></td><td></td><td><eq>\sqrt { }</eq></td><td></td></tr><tr><td><eq>\top</eq></td><td></td><td></td><td></td><td></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td></td><td></td></tr><tr><td>戊</td><td></td><td></td><td></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td></td><td></td><td><eq>\sqrt { }</eq></td></tr></table>

那么学校就要安排4场考试（每场考试必须是同一时间，但是可以在不同地点进行不同课程的考试)，如表B.2所示。

[page:444]

## 444

表 B.2 考试安排表 1<table><tr><td>场次</td><td>课程</td><td>场次</td><td>课程</td></tr><tr><td>第一场考试</td><td>A, E</td><td>第三场考试</td><td>B, G</td></tr><tr><td>第二场考试</td><td>C, H</td><td>第四场考试</td><td>D, F</td></tr></table>

而在实际的考试安排中不仅要考虑学生，还要考虑授课教师作为主考官，他所教授的各课程的考试时间不能冲突，即不能安排在同一场。

例如，在表B.3中给出了教师授课情况，那么课程A和E的考试就不能安排在同一时间，因此考试的安排需要变更为表B.4所示。

表 B.3 教师授课情况<table><tr><td rowspan=2>学生</td><td colspan=8>课程</td></tr><tr><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td><td>G</td><td>H</td></tr><tr><td>赵老师</td><td>√</td><td></td><td>√</td><td></td><td>7</td><td></td><td></td><td></td></tr><tr><td>钱老师</td><td></td><td></td><td></td><td>√</td><td></td><td></td><td></td><td></td></tr><tr><td>孙老师</td><td></td><td>V</td><td></td><td></td><td></td><td>√</td><td></td><td></td></tr><tr><td>李老师</td><td></td><td></td><td></td><td></td><td></td><td></td><td>√</td><td>√</td></tr></table>

表 B.4 考试安排表 2<table><tr><td>场次</td><td>课程</td><td>场次</td><td>课程</td></tr><tr><td>第一场考试</td><td>A</td><td>第四场考试</td><td>D, F</td></tr><tr><td>第二场考试</td><td>C, H</td><td>第五场考试</td><td>E</td></tr><tr><td>第三场考试</td><td>B, G</td><td></td><td></td></tr></table>

## B.5.2 实验要求

（1）根据教师提供的学生选课情况（可以采用矩阵形式存放在文件中），编写程序给出考试的场次安排表（不要求一定得到最优方案）；

（2）在(1)的基础上，根据教师提供的教师教课情况（可以采用矩阵形式存放在文件中），编写程序给出考试的场次安排表（不要求一定得到最优方案）。

## B.6 实验六:展览馆的参观与维护

图B.18是一个展览馆的平面图，该展览馆共有3条相互隔开的走廊、7个展厅和男女盥洗室各一。

问题如下:

（1）如果你是一个参观者，是否可以设计一条参观线路，使得每个展厅只进出一次(走廊可以随意走)，而且去一次盥洗室？

（2）如果你是一个维修工，可否设计一条线路，使得除大门和盥洗室外，各展室的每个门只经过一次？

[page:445]

## 附录B 课程综合实验

(3）如果该展览馆经过整修，平面图发生变化（如图B.19所示)，重新考虑问题(1)。

请给出你对这个问题的抽象，并给出问题(1)～(3)的解答。

## B.7 实验七:导师和研究生的自动分配

某校软件学院的开学季又到了，今年有m名导师需要招收研究生，并有n=m×k名研究生需要分配导师。每位导师都至少需要选择m+k-1名研究生作为他的学生的候选集(排名不分先后)。

学院希望设计一个程序，可以根据导师的志愿自动分配研究生，每位导师都能够被分配到k名属于他的学生候选集的研究生。例如志愿如表B.5所示时，可以分配给导师A{学生 a，学生 $. f g$ ，分配给导师 B{学生b，学生 $c \}$ ，分配给导师 C{学生 $d ,$ 学生e}。

表 B.5 导师的志愿<table><tr><td rowspan=2>导师</td><td colspan=6>学生</td></tr><tr><td><eq>a</eq></td><td>b</td><td><eq>c</eq></td><td><eq>d</eq></td><td><eq>e</eq></td><td><eq>f</eq></td></tr><tr><td><eq>A</eq></td><td><eq>\surd</eq></td><td></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td></td><td><eq>\surd</eq></td></tr><tr><td>B</td><td><eq>\sqrt { }</eq></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td></td><td><eq>\surd</eq></td><td></td></tr><tr><td>C</td><td></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td><eq>\surd</eq></td><td></td></tr></table>

首先请分析，这个程序是否可以设计并实现，换言之，是否一定存在满足“每位导

[page:446]

## 离散数学及应用（第2版）

师都能够被分配到k名属于他的学生候选集的研究生”要求的方案？

如果存在这样的方案，请根据教师提供的导师志愿情况（可以矩阵形式存放在文件中)，编写程序给出满足要求的研究生分配方案。

## B.8 实验八:绿色健康城市规划

某城市的街道路网设计呈方格路网的子图形式，而且不存在长度是奇数的回路（例如图 B.20(a)、(b))。

为推广绿色出行和健康出行，市长决定设立一些步行街和便民服务站。要求:每个路口至少连接一条步行街，每条街道（两个路口之间）至少有一端的路口设有便民服务站。而从成本考虑，又希望在满足要求的前提下，步行街和便民服务站的数目应尽可能少。

在给定城市街道图的情况下，请你帮助市长确定应该将哪些街道设置为步行街，应该在哪些路口设置便民服务站。例如，图B.20所示的两个图的最佳方案如图B.21所示，其中粗线段表示步行街，深色顶点表示便民服务站。

根据教师提供的城市街道图（可以存放在文件中)，编写程序给出数目尽可能少且满足要求的步行街和便民服务站设置方案。

## B.9 实验九:羽毛球双打配对和住宿安排

互为友好城市的A市和B市决定联合组建若干个羽毛球男子双打组合，参加国际羽毛球友谊邀请赛。计划每个组合由1名A市男运动员和1名B市男运动员组成。

[page:447]

## 附录B 课程综合实验

由于运动员打法风格各不相同，因此不同运动员组合成双打配对的水平高低和竞赛优势也存在差异。例如在图B.22(a)所示的矩阵中，第i行第j列的值是A 市男运动员i和B市男运动员j配对组成双打的竞赛优势。

希望能将n名A市男运动员和n名B市男运动员配对组成n个双打组合，且竞赛优势总和达到最大。例如在图B.22(a)所示的情况下，最优的组合方式是:A市男运动员1与B市男运动员1配对，A市男运动员2与B市男运动员3配对，A市男运动员3与B市男运动员2配对。

另外，在比赛期间需要安排住宿，计划每个房间都由1名A市男运动员和1名B市男运动员合住。但是运动员都存在生活习惯上的差异，例如在图B.22(b)所示的矩阵中，第i行第j列的值是A市男运动员i和B市男运动员j的生活习惯差异大小。

希望能为n名A市男运动员和n名B市男运动员安排房间，使得生活差异总值达到最小。例如在图B.22(b)所示的情况下，最佳的安排房间方法是:A市男运动员1和B市男运动员3同住一间，A市男运动员2和B市男运动员1同住一间，A市男运动员3和B市男运动员2同住一间。

根据教师提供的A市男运动员和B市男运动员的配对竞赛优势及生活差异（可以矩阵形式存放在文件中)，编写程序给出使得总竞赛优势达到最大的双打配对方案以及总生活习惯差异尽可能小的安排房间方案。

[page:448]

## 附录C

## 名词英汉对照表

[page:449]

## 附录C 名词英汉对照表

<table><tr><td>Boolean product</td><td>布尔积</td></tr><tr><td>boundary</td><td>边界</td></tr><tr><td>bounded lattice</td><td>有界格</td></tr><tr><td>bounded variable</td><td>约束变项</td></tr><tr><td>branch point</td><td>分枝点</td></tr><tr><td>bridge</td><td>桥</td></tr><tr><td>canonical map</td><td>典范映射，自然映射</td></tr><tr><td>capacity</td><td>容量</td></tr><tr><td>cardinality</td><td>基数，势</td></tr><tr><td>Cartesian product</td><td>笛卡儿积</td></tr><tr><td>catenation</td><td>连接</td></tr><tr><td>ceiling function</td><td>天花板函数，上取整函数</td></tr><tr><td>chain</td><td>链</td></tr><tr><td>characteristic equation</td><td>特征多项式</td></tr><tr><td>characteristic function</td><td>特征函数</td></tr><tr><td>characteristic root</td><td>特征根</td></tr><tr><td>chromatic number</td><td>色数</td></tr><tr><td>chromatic number</td><td>点色数</td></tr><tr><td>circuit</td><td>回路</td></tr><tr><td>closed</td><td>封闭的</td></tr><tr><td>closure</td><td>闭包</td></tr><tr><td>combination</td><td>组合</td></tr><tr><td>commutative</td><td>可交换的</td></tr><tr><td>comparable</td><td>可比的</td></tr><tr><td>compatibility block</td><td>相容类</td></tr><tr><td>compatibility relation</td><td>相容关系</td></tr><tr><td>compatible class</td><td>相容类</td></tr><tr><td>complement</td><td>补</td></tr><tr><td>complemented lattice</td><td>有补格</td></tr><tr><td>complete graph</td><td>完全图</td></tr><tr><td>complete m-ary tree</td><td>完全 m叉树</td></tr><tr><td>complete matching</td><td>完全匹配</td></tr><tr><td>component</td><td>连通分支</td></tr><tr><td>composite number</td><td>合数</td></tr><tr><td>composition</td><td>复合，合成</td></tr><tr><td>compound statement</td><td>复合命题</td></tr><tr><td>conclusion</td><td>结论</td></tr><tr><td></td><td>具体语法树</td></tr><tr><td>concrete syntax tree congruent</td><td>同余</td></tr></table>

[page:450]

## 离散数学及应用（第2版）

<table><tr><td>conjunction</td><td>合取词</td></tr><tr><td>conjunctive normal form</td><td>合取范式</td></tr><tr><td>connected</td><td>连通的</td></tr><tr><td>content sensitive grammar</td><td>上下文相关语法</td></tr><tr><td>content-free grammar</td><td>上下文无关语法</td></tr><tr><td>contradiction</td><td>矛盾式，永假式</td></tr><tr><td>coset</td><td>陪集</td></tr><tr><td>cost</td><td>代价</td></tr><tr><td>countable</td><td>可数的，可列的</td></tr><tr><td>cover</td><td>覆盖</td></tr><tr><td>covering</td><td>覆盖</td></tr><tr><td>cut</td><td>割</td></tr><tr><td>cycle</td><td>圈</td></tr><tr><td>cycle permutation</td><td>轮换</td></tr><tr><td>degree</td><td>度数，次数</td></tr><tr><td>derivation</td><td>推导</td></tr><tr><td>derivation tree</td><td>派生树</td></tr><tr><td>descendant</td><td>后代</td></tr><tr><td>Deterministic Finite Automata (DFA)</td><td>确定性有限状态自动机</td></tr><tr><td>dictionary order</td><td>字典序</td></tr><tr><td>difference</td><td>差</td></tr><tr><td>digraph</td><td>有向图</td></tr><tr><td>directed graph</td><td>有向图</td></tr><tr><td>directed tree</td><td>有向树</td></tr><tr><td>direct product</td><td>直积</td></tr><tr><td>disconnected</td><td>不连通的</td></tr><tr><td>disconnecting set</td><td>分离集</td></tr><tr><td>discrete graph</td><td>离散图</td></tr><tr><td>disjunction</td><td>析取词</td></tr><tr><td>disjunctive normal form</td><td>析取范式</td></tr><tr><td>distributive</td><td>分配的</td></tr><tr><td>distributive lattice</td><td>分配格</td></tr><tr><td>divide</td><td>整除</td></tr><tr><td>divisor</td><td>因子</td></tr><tr><td>domain</td><td>定义域；无零因子环</td></tr><tr><td>dominating set</td><td>支配集</td></tr><tr><td>domination number</td><td>支配数</td></tr><tr><td>drawer principle</td><td>抽屉原则</td></tr><tr><td>dual</td><td>对偶</td></tr></table>

[page:451]

## 附录C 名词英汉对照表

<table><tr><td>dual graph</td><td>对偶图</td></tr><tr><td>edge</td><td>边</td></tr><tr><td>edge coloring</td><td>边着色</td></tr><tr><td>edge cover</td><td>边覆盖集，简称边覆盖</td></tr><tr><td>edge covering number</td><td>边覆盖数</td></tr><tr><td>edge-disjoint paths</td><td>边不相交的道路</td></tr><tr><td>element</td><td>元素</td></tr><tr><td>empty set</td><td>空集</td></tr><tr><td>empty string</td><td>空串</td></tr><tr><td>end point</td><td>端点</td></tr><tr><td>endomorphism</td><td>自同态</td></tr><tr><td>equivalence</td><td>等价词</td></tr><tr><td>equivalence classes</td><td>等价类</td></tr><tr><td>equivalence relation</td><td>等价关系</td></tr><tr><td>equivalent</td><td>等值</td></tr><tr><td>Eulerian circuit</td><td>欧拉回路</td></tr><tr><td>Eulerian graph</td><td>欧拉图</td></tr><tr><td>Eulerian path</td><td>欧拉道路</td></tr><tr><td>exclusive or</td><td>异或词</td></tr><tr><td>Existential Generalization (EG) existential quantification</td><td>存在量词引入规则</td></tr><tr><td>Existential Specification (ES)</td><td>存在量词</td></tr><tr><td>face</td><td>存在量词消去规则</td></tr><tr><td>face coloring</td><td>面</td></tr><tr><td>factorial</td><td>面着色</td></tr><tr><td></td><td>阶乘</td></tr><tr><td>field</td><td>域</td></tr><tr><td>finite</td><td>有限的</td></tr><tr><td>floor function</td><td>地板函数，下取整函数</td></tr><tr><td>flow</td><td>流</td></tr><tr><td>flow network</td><td>流网络</td></tr><tr><td>forest</td><td>森林</td></tr><tr><td>forward edge</td><td>前向边</td></tr><tr><td>free variable</td><td>自由变项</td></tr><tr><td>full conjunctive normal form</td><td>主合取范式</td></tr><tr><td>full disjunctive normal form</td><td>主析取范式</td></tr><tr><td>function</td><td>函数</td></tr><tr><td>fundamental conjunction</td><td>合取式</td></tr><tr><td>fundamental disjunction</td><td>析取式</td></tr><tr><td>generator</td><td>生成元</td></tr></table>

[page:452]

## 452

<table><tr><td>graph</td><td>无向图</td></tr><tr><td>graph coloring</td><td>图着色</td></tr><tr><td>Greatest Common Divisor (GCD)</td><td>最大公约数，最大公因子</td></tr><tr><td>greatest element</td><td>最大元</td></tr><tr><td>Greatest Lower Bound (GLB)</td><td>下确界</td></tr><tr><td>group</td><td>群</td></tr><tr><td>Hamiltonian circuit</td><td>哈密顿回路</td></tr><tr><td>Hamiltonian graph</td><td>哈密顿图</td></tr><tr><td>Hamiltonian path</td><td>哈密顿道路</td></tr><tr><td>hash function</td><td>哈希函数，散列函数，杂凑函数</td></tr><tr><td>height</td><td>高度</td></tr><tr><td>homomorphic</td><td>同态的</td></tr><tr><td>homomorphism</td><td>同态</td></tr><tr><td>hypothesis</td><td>假设</td></tr><tr><td>identity</td><td>单位元，幺元</td></tr><tr><td>identity function</td><td>恒等函数</td></tr><tr><td>image</td><td>像</td></tr><tr><td>implication</td><td>蕴含词</td></tr><tr><td>inclusion-exclusion principle</td><td>容斥原理</td></tr><tr><td>incomparable</td><td>不可比的</td></tr><tr><td>in-degree</td><td>入度</td></tr><tr><td>independence number</td><td>独立数</td></tr><tr><td>independent set</td><td>点独立集，简称独立集</td></tr><tr><td>individual</td><td>个体词</td></tr><tr><td>inference</td><td>推理</td></tr><tr><td>infinite</td><td>无限的</td></tr><tr><td>infix notation</td><td>中缀表示</td></tr><tr><td>injection</td><td>单射</td></tr><tr><td>inorder</td><td>中序</td></tr><tr><td>integral domain</td><td>整环</td></tr><tr><td>interpretation</td><td>解释</td></tr><tr><td>intersection</td><td>交</td></tr><tr><td>inverse</td><td>逆</td></tr><tr><td>invertible</td><td>可逆的</td></tr><tr><td>irreflexive</td><td>非自反的</td></tr><tr><td>isolated vertex</td><td>孤立顶点</td></tr><tr><td>isomorphic</td><td>同构的</td></tr><tr><td>isomorphism</td><td>同构</td></tr><tr><td>item</td><td>项</td></tr></table>

[page:453]

## 附录C 名词英汉对照表

<table><tr><td>join</td><td>并</td></tr><tr><td>Koch snowflake</td><td>科赫雪花</td></tr><tr><td>language</td><td>语言</td></tr><tr><td>Latin square</td><td>拉丁方</td></tr><tr><td>lattice</td><td>格</td></tr><tr><td>leaf</td><td>叶子</td></tr><tr><td>Least Common Multiple (LCM)</td><td>最小公倍数</td></tr><tr><td>least element</td><td>最小元</td></tr><tr><td>least upper bound</td><td>上确界</td></tr><tr><td>length</td><td>长度</td></tr><tr><td>level</td><td>层数</td></tr><tr><td>lexicographic order</td><td>词典序</td></tr><tr><td>line graph</td><td>线图</td></tr><tr><td>linear homogeneous relation</td><td>常系数线性齐次递推关系</td></tr><tr><td>linearly ordered set</td><td>线序集</td></tr><tr><td>linear order</td><td>线序</td></tr><tr><td>literal</td><td>文字</td></tr><tr><td>logic</td><td>逻辑</td></tr><tr><td>logically equivalent</td><td>逻辑等价的</td></tr><tr><td>logically valid formula</td><td>普遍有效的公式，逻辑有效式</td></tr><tr><td>loop</td><td>自环</td></tr><tr><td>lower bound</td><td>下界</td></tr><tr><td>map</td><td>映射</td></tr><tr><td>m-ary tree</td><td>m元树，m叉树</td></tr><tr><td>matching</td><td>匹配；边独立集</td></tr><tr><td>matching network</td><td>匹配网络</td></tr><tr><td>matching number</td><td>匹配数</td></tr><tr><td>maximal compatibility block</td><td>最大相容类</td></tr><tr><td>maximal element</td><td>极大元</td></tr><tr><td>maximal independent set</td><td>极大独立集</td></tr><tr><td>maximal matching</td><td>极大匹配</td></tr><tr><td>maximum-cardinality matching</td><td>最大基数匹配</td></tr><tr><td>maximum flow</td><td>最大流</td></tr><tr><td>maximum independent set</td><td>最大独立集</td></tr><tr><td>maximum matching</td><td>最大匹配</td></tr><tr><td>maxterm</td><td>极大项</td></tr><tr><td>meet</td><td>交</td></tr><tr><td>minimal dominating set</td><td>极小支配集</td></tr><tr><td>minimal edge cover</td><td>极小边覆盖</td></tr></table>

[page:454]

## 454

<table><tr><td>minimal element</td><td>极小元</td></tr><tr><td>Minimal Spanning Tree (MST)</td><td>最小生成树</td></tr><tr><td>minimal vertex cover</td><td>极小点覆盖</td></tr><tr><td>minimum cut</td><td>最小割</td></tr><tr><td>minimum dominating set</td><td>最小支配集</td></tr><tr><td>minimum edge cover</td><td>最小边覆盖</td></tr><tr><td>minimum vertex cover</td><td>最小点覆盖</td></tr><tr><td>minterm</td><td>极小项</td></tr><tr><td>modular lattice</td><td>模格</td></tr><tr><td>modulus</td><td>模</td></tr><tr><td>monoid</td><td>亚群，含幺半群，单元半群，独异点</td></tr><tr><td>multiple multiplication principle</td><td>倍数</td></tr><tr><td>negation</td><td>乘法原理，乘法法则</td></tr><tr><td>neighborhood</td><td>否定词</td></tr><tr><td>network</td><td>邻接顶点集</td></tr><tr><td>Nondeterministic Finite Automata (NFA)</td><td>网络</td></tr><tr><td>non-terminal symbol</td><td>非确定性有限状态自动机</td></tr><tr><td>normal form</td><td>非终结符号</td></tr><tr><td>normal subgroup</td><td>范式</td></tr><tr><td>null graph</td><td>正规子群</td></tr><tr><td>offspring</td><td>零图</td></tr><tr><td></td><td>孩子顶点</td></tr><tr><td>one-to-one</td><td>一对一的</td></tr><tr><td>one-to-one correspondence</td><td>一对应</td></tr><tr><td>onto</td><td>映上的</td></tr><tr><td>optimal binary tree</td><td>最优二叉树</td></tr><tr><td>optimal matching</td><td>最佳匹配</td></tr><tr><td>order</td><td>阶</td></tr><tr><td>ordered pair</td><td>有序对，序偶</td></tr><tr><td>ordered tree</td><td>有序树</td></tr><tr><td>out-degree</td><td>出度</td></tr><tr><td>parallel edges</td><td>重边，平行边</td></tr><tr><td>parent</td><td>父亲顶点，双亲顶点</td></tr><tr><td>parse tree</td><td>分析树</td></tr><tr><td>parsing tree</td><td>分析树</td></tr><tr><td>partial order</td><td>偏序</td></tr><tr><td>partially ordered set</td><td>偏序集</td></tr><tr><td>partition</td><td>分划，划分</td></tr><tr><td>path</td><td>道路</td></tr></table>

[page:455]

## 附录C 名词英汉对照表

pendant edge pendant vertex perfect matching period permutation permutation group phrase structure gramma pierce pigeonhole principle planar graph Polish notation positional tree postfix notation postorder power power set predecessor predicate predicate logic prefix prefix code prefix-free code prefix notation premise prenex normal form preorder prime product proper prefix proper subring proper subset proper suffix proposition proposition connective propositional variables proposition operator quantification quasiorder quotient

悬挂边悬挂点完美匹配周期排列，置换置换群短语结构文法或非词鸽巢原理平面图波兰式位置树后缀表示后序幂幂集前驱谓词谓词逻辑前缀前缀码无前缀码前缀表示前提前束范式前序素数，质数积真前缀真子环真子集真后缀命题命题联结词命题变项，命题变元命题运算符量词拟序商

[page:456]

## 456

<table><tr><td>quotient group</td><td>商群</td></tr><tr><td>quotient set</td><td>商集</td></tr><tr><td>railroad diagram</td><td>铁路图</td></tr><tr><td>range</td><td>值域</td></tr><tr><td>reachable</td><td>可达的</td></tr><tr><td>recurrence relation</td><td>递推关系</td></tr><tr><td>reflexive</td><td>自反的</td></tr><tr><td>regular expression</td><td>正则表达式</td></tr><tr><td>regular grammar</td><td>正则语法</td></tr><tr><td>regular graph</td><td>正则图</td></tr><tr><td>regular m-ary tree</td><td>正则 m 叉树</td></tr><tr><td>regular set</td><td>正则集</td></tr><tr><td>relation</td><td>关系</td></tr><tr><td>relatively prime</td><td>互素，互质</td></tr><tr><td>remainder</td><td>余数</td></tr><tr><td>residual graph</td><td>剩余图</td></tr><tr><td>restriction</td><td>限制</td></tr><tr><td>reverse Polish notation</td><td>逆波兰式</td></tr><tr><td>ring</td><td>环</td></tr><tr><td>root</td><td>根</td></tr><tr><td>rooted tree</td><td>根树</td></tr><tr><td>satisfiable</td><td></td></tr><tr><td>scope</td><td>可满足的</td></tr><tr><td>semigroup</td><td>辖域，个体域</td></tr><tr><td></td><td>半群</td></tr><tr><td>semi order</td><td>半序</td></tr><tr><td>semi ordered set</td><td>半序集</td></tr><tr><td>sequence</td><td>序列</td></tr><tr><td>set</td><td>集合</td></tr><tr><td>sheffer</td><td>与非词</td></tr><tr><td>sibling</td><td>兄弟顶点</td></tr><tr><td>simple circuit</td><td>简单回路</td></tr><tr><td>simple graph</td><td>简单图</td></tr><tr><td>simple path</td><td>简单道路</td></tr><tr><td>simple proposition</td><td>简单命题</td></tr><tr><td>sink</td><td>汇</td></tr><tr><td>sourse</td><td>源</td></tr><tr><td>spanning tree</td><td>生成树，支撑树</td></tr><tr><td>string</td><td>串</td></tr><tr><td>strongly connected</td><td>强连通的</td></tr></table>

[page:457]

## 附录C 名词英汉对照表

<table><tr><td>subformula</td><td>子公式</td></tr><tr><td>subgraph</td><td>子图</td></tr><tr><td>subgroup</td><td>子群</td></tr><tr><td>sublattice</td><td>子格</td></tr><tr><td>subring</td><td>子环</td></tr><tr><td>subset</td><td>子集</td></tr><tr><td>substring</td><td>子串</td></tr><tr><td>subtree</td><td>子树</td></tr><tr><td>successor</td><td>后继</td></tr><tr><td>suffix</td><td>后缀</td></tr><tr><td>superset</td><td>超集</td></tr><tr><td>super-sink</td><td>超汇</td></tr><tr><td>super-source</td><td>超源</td></tr><tr><td>surjection</td><td>满射</td></tr><tr><td>syllogism</td><td>三段论</td></tr><tr><td>symmetric</td><td>对称的</td></tr><tr><td>symmetric difference</td><td>对称差</td></tr><tr><td>symmetric group</td><td>对称群</td></tr><tr><td>syntax diagram</td><td>语法图，句法图</td></tr><tr><td>tautology</td><td>重言式，永真式</td></tr><tr><td>term rank</td><td>秩</td></tr><tr><td>terminal symbol</td><td>终结符号</td></tr><tr><td>the domain of the discourse</td><td>论域</td></tr><tr><td>topology sorting</td><td>拓扑排序</td></tr><tr><td>totally ordered set</td><td>全序集</td></tr><tr><td>total order</td><td>全序</td></tr><tr><td>transformation</td><td>变换</td></tr><tr><td>transitive</td><td>传递的</td></tr><tr><td>Traveling Salesman Problem (TSP)</td><td>旅行商问题</td></tr><tr><td>traversal</td><td>遍历，周游</td></tr><tr><td>tree</td><td>树</td></tr><tr><td>trivial subgroup</td><td>平凡子群</td></tr><tr><td>trivial tree</td><td>平凡树</td></tr><tr><td>truth table</td><td>真值表</td></tr><tr><td>unary operation</td><td>一元运算</td></tr><tr><td>uncountable</td><td>不可数的，不可列的</td></tr><tr><td>undirected graph</td><td>无向图</td></tr><tr><td>undirected tree</td><td>无向树</td></tr><tr><td>union</td><td>并</td></tr></table>

[page:458]

## 458

[{'type': 'text', 'content': 'unit element 幺元'}][{'type': 'text', 'content': 'universal domain of individuals 全总个体域'}][{'type': 'text', 'content': 'Universal Generalization (UG) 全称量词引入规则'}][{'type': 'text', 'content': 'universal quantification 全称量词'}][{'type': 'text', 'content': 'universal set 全集'}][{'type': 'text', 'content': 'Universal Specification (US) 全称量词消去规则'}][{'type': 'text', 'content': 'unsatisfiable 不可满足的'}][{'type': 'text', 'content': 'upper bound 上界'}][{'type': 'text', 'content': 'value 值'}][{'type': 'text', 'content': 'vertex 顶点'}][{'type': 'text', 'content': 'vertex coloring 点着色'}][{'type': 'text', 'content': 'vertex cover 点覆盖集，简称点覆盖'}][{'type': 'text', 'content': 'vertex cover number 点覆盖数'}][{'type': 'text', 'content': 'weight 权，权重'}][{'type': 'text', 'content': 'weighted graph 赋权图'}][{'type': 'text', 'content': 'well-formed formula 合式公式'}][{'type': 'text', 'content': 'word 词'}][{'type': 'text', 'content': 'zero element 零元'}]

[page:459]

## 附录D

## 使用 Mathematica 学习离散数学

Mathematica 软件是由美国物理学家沃尔弗拉姆（Stephen Wolfram）领导的 Wolfram Research开发的数学系统软件。Mathematica拥有强大的数值计算和符号计算能力，还可以很方便地进行图形的表示，它是理论研究工作者和工程技术人员的功能非常强大的助手。

本附录介绍如何在学习离散数学的过程中融合Mathematica软件的使用，使读者可以通过软件学习课程、通过课程学习软件，达到相得益彰的效果。

Mathematica软件的使用非常简单，在Mathematica笔记本（notebook）部分中通过键盘输入，而后只需按Shift+Enter键就可以看到输出。限于篇幅，本附录各节只给出离散数学学习需要实现的功能、输入的命令以及输出结果①，更多关于Mathematica软件安装和使用的内容请读者参看其他相关书籍。

## D.1 集合、序列与矩阵

【功能】生成集合{1,2,3,4,5,1}（准确地说是一个序列，即有序并允许重复元素）。

输入:A={1,2,3,4,5,1}

输出:{1,2,3,4,5,1}

【功能】去掉集合中的重复元素。

输入:Union[A]

输出:{1,2,3,4,5}

【功能】生成集合{1,3,5,7,9}。

输入:B={1,3,5,7,9}

输出:{1,3,5,7,9}

【功能】计算A与B的交集。

输入:Intersection[A,B]

输出:{1,3,5}

【功能】计算A与B的并集。

输入:Union[A,B]

输出:{1,2,3,4,5,7,9}

[page:460]

## 离散数学及应用（第2版）

【功能】计算A与B的差(A-B)。

输入:Complement[A,B]

输出:{2,4}

【功能】计算A与B的对称差。

输入: Union[Complement[A,B],Complement[B,A]

输出:{2,4,7,9}

【功能】计算有限集合A的元素个数。

输入:Length[Union[A]]

输出:5

【功能】判断元素1是否属于集合A。

输入:MemberQ[A,1]

输出:True

【功能】判断{1,2}是否是集合A的一个子集。

输入:Intersection[A, {1,2}]=={1,2}

输出:True

【功能】计算63与175的最大公约数。

输入:GCD[63,175]

输出:7

【功能】计算(s, t)使得 63s+175t=GCD(63,175)。

输入: {g,{s,t}}=ExtendedGCD[63,175]

输出:{7,{-11,4}}

输入:63*s+175*t==g

输出:True

【功能】计算63与175的最小公倍数。

输入:LCM[63,175]

输出:1575

【功能】判断63与175是否互素。

输入:CoprimeQ[63,175]

输出:False

【功能】判断63是否素数。

输入:PrimeQ[63]

输出:False

【功能】判断189是否可以整除63。

输入:Divisible[189,63]

输出:True

【功能】计算175除以63的商。

输入:Quotient[175,63]

输出:2

[page:461]

## 附录口 使用Mathematica学习离散数学

【功能】计算175除以63的余数（也就是175模63的值）。

输入:Mod[175,63]

输出:49

【功能】计算 $1 7 5 ^ { 3 }$ 除以63的余数（也就是 $1 7 5 ^ { 3 }$ 模63的值)。

输入:PowerMod[175,3,63]

输出:28

【功能】计算175的所有正因子。

输入:Divisors[175]

输出:{1,5,7,25,35,175}

【功能】计算175的整数分解（结果表示 $1 7 5 { = } 5 ^ { 2 } { \times } 7 ^ { 1 }$

输入:FactorInteger[175]

输出:{{5,2},{7,1}}

【功能】给出175的十进制表示的各位。

输入:IntegerDigits[175]

输出:{1,7,5}

【功能】给出175的二进制表示的各位。

输入:IntegerDigits[175,2]

输出:{1,0,1,0,1,1,1,1}

【功能】给出175的十六进制表示的各位。

输入:IntegerDigits[175,16]

输出:{10,15}

【功能】由二进制表示得到十进制表示的数值。

输入:FromDigits[{1,0,1,1,1,1,0,1},2]

输出:189

【功能】定义矩阵X。

输入:X={{1,1},{0,1}}

输出:{{1,1},{0,1}

【功能】以矩阵的形式显示X。

输入:MatrixForm[X]

输出: (0 1)

【功能】计算X的转置。

输入:Transpose[X]

输出:{{1,0},{1,1}}

【功能】定义矩阵Y(不输出结果)。

输入:Y={0,1},{1,1}}

【功能】计算X+Y。

输入:X+Y

[page:462]

## 462

输出:{1,2},{1,2}}

【功能】计算X与Y逐个元素的乘积。

输入:X*Y

输出:{{0,1},{0,1}}

【功能】计算X与Y的乘积。

输入:X.Y

输出:{{1,2},{1,1}}

【功能】将一个矩阵大于1的元素都变为1。

输入:Sign[{{1,2},{1,1}}]

输出:{{1,1},{1,1}}

【功能】计算X与Y的交。

输入:X*Y

输出:{0,1},{0,1}}

【功能】计算X与Y的并。

输入:Sign[X+Y]

输出:{{1,1},{1,1}}

【功能】计算X与Y的布尔积。

输入:Sign[X.Y]

输出:{1,1},{1,1}}

## D.2 排列、组合、递推关系与划分

本节及后面的诸功能都需要使用Combinatorica函数包，使用方法为输入“<<Combinatorica'”

【功能】生成{a, b,c}的所有全排列。

输入:Permutations[{a,b,c}]

输出: $\{ \{ \mathrm { a , } \mathrm { b , } \mathrm { c } \} \mathrm { , } \{ \mathrm { a , } \mathrm { c , } \mathrm { b } \} \mathrm { , } \{ \mathrm { b , } \mathrm { a , } \mathrm { c } \} \mathrm { , } \{ \mathrm { b , } \mathrm { c , } \mathrm { a } \} \mathrm { , } \{ \mathrm { c , } \mathrm { a , } \mathrm { b } \} \mathrm { , } \{ \mathrm { c , } \mathrm { b , } \mathrm { a } \} \}$

【功能】生成可重元素的所有全排列。

输入:Permutations[{a,a,b}]

输出: $\{ \{ \mathrm { a , } \mathrm { a , } \mathrm { b } \} , \{ \mathrm { a , } \mathrm { b , } \mathrm { a } \} , \{ \mathrm { b , } \mathrm { a , } \mathrm { a } \} \}$

【功能】生成 $\{ a , b , c , d \}$ 的所有的1-排列到3-排列。

输入:Permutations[{a,b,c,d},{1,3}]

输出: $\{ \{ \mathsf { a } \} , \{ \mathsf { b } \} , \{ \mathsf { c } \} , \{ \mathsf { d } \} , \{ \mathsf { a } \mathsf { , } \mathsf { b } \} , \{ \mathsf { a } \mathsf { , } \mathsf { c } \} , \{ \mathsf { a } \mathsf { , } \mathsf { d } \} , \{ \mathsf { b } \mathsf { , } \mathsf { a } \} , \{ \mathsf { b } \mathsf { , } \mathsf { c } \} , \{ \mathsf { b } \mathsf { , } \mathsf { d } \} , \{ \mathsf { c } \mathsf { , } \mathsf { a } \} , \{ \mathsf { c } \mathsf { , } \mathsf { b } \} , \{ \mathsf { c } \mathsf { , } \mathsf { d } \} , \{ \mathsf { d } \mathsf { , } \mathsf { a } \} , \{ \mathsf { d } \mathsf { , } \mathsf { b } \} , \{ \mathsf { c } \mathsf { , } \mathsf { d } \} \}$ {d,c},{a,b,c},{a,b,d},{a,c,b},{a,c,d},{a,d,b}, {a,d,c}, {b,a,c}, {b,a,d}, {b,c,a} {b,c,d}, {b,d,a}, {b,d,c}, {c,a,b},{c,a,d},{c,b,a},{c,b,d},{c,d,a},{c,d,b},{d,a,b} $\{ \mathrm { d , } \mathrm { a , } \mathrm { c } \} \mathrm { , } \{ \mathrm { d , } \mathrm { b , } \mathrm { a } \} \mathrm { , } \{ \mathrm { d , } \mathrm { b , } \mathrm { c } \} \mathrm { , } \{ \mathrm { d , } \mathrm { c , } \mathrm { a } \} \mathrm { , } \{ \mathrm { d , } \mathrm { c , } \mathrm { b } \} \}$

【功能】生成 $\{ a , b , c , d \}$ 的所有的2-排列。

输入:Permutations[{a,b,c,d},{2}]

[page:463]

## 附录口 使用Mathematica学习离散数学

{c}},{{a,b},{c}, {d}}, {{a,c},{b}, {d}},{{a,d}, {b},{c}},{{a}, {b},{c}, {d} }

输出: {{a,b},{a,c},{a,d},{b,a},{b,c},{b,d},{c,a},{c,b},{c,d}, {d,a}, {d,b},{d,c}

【功能】生成{a,b,c}的所有的组合（即子集）。

输入：Subsets[{a,b,c}]

输出：{{},{a},{b},{c}, {a,b},{a,c},{b,c},{a,b,c}}

【功能】生成{a,b,c,d}的所有至多包含两个元素的组合（即子集）。

输入：Subsets[{a,b,c,d},2]

输出: $\{ \{ \} , \{ \mathrm { a } \} , \{ \mathrm { b } \} , \{ \mathrm { c } \} , \{ \mathrm { d } \} , \{ \mathrm { a } \mathrm { , b } \} , \{ \mathrm { a } \mathrm { , c } \} , \{ \mathrm { a } \mathrm { , d } \} , \{ \mathrm { b } \mathrm { , c } \} , \{ \mathrm { b } \mathrm { , d } \} , \{ \mathrm { c } \mathrm { , d } \} \}$

【功能】生成{a,b,c,d}的所有恰包含2个元素的组合（即子集）。

输入:Subsets[{a,b,c,d},{2}]

或 KSubsets[{a,b,c,d},2]

输出: $\{ \{ \mathrm { a , } \mathrm { b } \} \mathrm { , } \{ \mathrm { a , } \mathrm { c } \} \mathrm { , } \{ \mathrm { a , } \mathrm { d } \} \mathrm { , } \{ \mathrm { b , } \mathrm { c } \} \mathrm { , } \{ \mathrm { b , } \mathrm { d } \} \mathrm { , } \{ \mathrm { c , } \mathrm { d } \} \}$

【功能】组合数C(6,2)的计算。

输入:Binomial[6,2]

输出:15

【功能】计算斐波那契数列的第10项。

输入:Fibonacci[10]

输出:55

【功能】计算集合 $\{ a ,   b ,   c ,   d \}$ 的所有不同划分。

输入:SetPartitions[{a,b,c,d}]

输出: $\{ \{ \{ \mathrm { a , } \mathrm { b , } \mathrm { c , } \mathrm { d } \} \} , \{ \{ \mathrm { a } \} , \{ \mathrm { b , } \mathrm { c , } \mathrm { d } \} \} , \{ \{ \mathrm { a , } \mathrm { b } \} , \{ \mathrm { c , } \mathrm { d } \} \} , \{ \{ \mathrm { a , } \mathrm { c , } \mathrm { d } \} , \{ \mathrm { b } \} \} , \{ \{ \mathrm { a , } \mathrm { b , } \mathrm { c } \} , \{ \mathrm { d } \} \} , \{ \{ \mathrm { a , } \mathrm { d } \}$

{b,c}},{{a,b,d}, {c}},{{a,c},{b,d} },{{a},{b},{c,d}},{{a},{b,c}, {d}},{{a},{b,d},

## D.3 关系与有向图

【功能】生成一个关系。

输入: L={{1,1},{1,2},{1,4},{2,1},{3,2},{3,4}

输出:{1,1},{1,2},{1,4},{2,1},{3,2},{3,4}}

【功能】生成该关系的有向图。

输入:G=FromOrderedPairs[L]

输出:Graph:< 6,4,Directed >

【功能】计算{a,b}和{1,2,3}的笛卡儿积。

输入:CartesianProduct[{a,b},{1,2,3}]

输出:{{a,1}, {a,2},{a,3},{b,1},{b,2},{b,3}}

【功能】由有序对构造有向图。

输入: ShowGraph[FromOrderedPairs[{{1,2},{2,1},{3,4}}]]

输出:（见图D.1）

【功能】由无序对构造无向图。

[page:464]

## 464

输入: ShowGraph[FromUnorderedPairs[{{1,2},{2,1},{3,4}}]

输出:（见图D.2）

【功能】由邻接矩阵构造无向图。

输入: ShowGraph[FromAdjacencyMatrix[{{0,1,0,0},{1,0,0,0}, {0,0,0,1}, {0,0,1,0}}]]

输出:（见图D.3）

【功能】显示关系G的有向图（显示顶点标号）。

输入: ShowGraph[G, VertexNumber->True]

输出:（见图D.4）

【功能】使有向图变为无向图。

输入:ShowGraph[MakeUndirected[G]]

输出:（见图D.5）

[page:465]

## 附录口 使用Mathematica学习离散数学

【功能】使有向图变为无向图并给每条边标号。

输入: ShowGraph[MakeUndirected[G],EdgeLabel->{1,2,3,4,5}]

输出:（见图D.6）

【功能】判断由图表示给出的一个关系是否是自反关系。

输入:ReflexiveQ[G]

输出:False

【功能】生成恒等关系的图并显示。

输入:ShowGraph[MakeGraph[Range[4],#2==#1&]]

输出:（见图D.7）

【功能】计算关系的自反闭包并显示。

输入: ShowGraph[MakeGraph[Range[4],MemberQ[L, {#2,#1}]‖#1==#2&]]

输出:（见图D.8）

【功能】判断由图表示给出的一个关系是否是对称关系。

输入:SymmetricQ[G]

输出:False

【功能】计算关系的对称闭包。

输入:ToOrderedPairs[MakeUndirected[G]

输出:{{2,1},{4,1},{3,2},{4,3},{1,1},{1,2},{1,4},{2,3},{3,4}

【功能】计算由图表示给出的一个关系的逆并显示。

输入: ShowGraph[MakeGraph[Range[4],MemberQ[L, {#2,#1 }]&]]

输出:（见图D.9）

[page:466]

## 离散数学及应用（第2版）

【功能】计算关系的对称闭包并显示。

输入: ShowGraph[MakeGraph[Range[4],MemberQ[L, {#2,#1 }]‖MemberQ[L,{#1,#2}] &]]

输出:（见图D.10）

【功能】判断由图表示给出的一个关系是否是反对称关系。

输入:AntiSymmetricQ[G]

输出:False

【功能】判断由图表示给出的一个关系是否是等价关系。

输入:EquivalenceRelationQ[G]

输出:False

【功能】计算由邻接矩阵{{1,1,0,0},{1,1,0,0},{0,0,1,0},{0,0,0,1}}所定义等价关系的等价类。

输入: EquivalenceClasses[{{1,1,0,0},{1,1,0,0},{0,0,1,0}, {0,0,0,1}}]

输出:{{1,2},{3},{4}}

【功能】判断由图表示给出的一个关系是否是传递关系。

输入:TransitiveQ[G]

输出:False

【功能】计算由{(1,1), (1,2),(1,4),(2,1),(3,2),(3,4)}所定义关系的传递闭包并显示。

输入:ShowGraph[TransitiveClosure[G]

输出:（见图D.11）

输入:ToOrderedPairs[TransitiveClosure[G]]

输出:{{1,1},{1,2},{1,4},{2,1},{2,2}, {2,4}, {3,1}, {3,2}, {3,4}}

输入:TransitiveQ[TransitiveClosure[G]]

输出:True

【功能】判断由图表示给出的一个关系是否是偏序关系。

输入:PartialOrderQ[G]

图D.11 关系的传递闭包

输出:False

【功能】显示有3个元素的集合的所有子集在包含关系下的有向图。

输入: ShowGraph[MakeGraph[Subsets[3],Intersection[#2,#1]==#1&]]

输出:（见图D.12）

【功能】显示有3个元素的集合的所有子集在包含关系下的哈斯图。

输入: ShowGraph[HasseDiagram[MakeGraph[Subsets[3],Intersection[#2, #1]==#1&]]

输出:（见图D.13）

【功能】显示1～12在整除关系下的有向图（显示顶点标号）。

输入: ShowGraph[MakeGraph[Range[12],Divisible[#2,#1]&], VertexNumber->True]

输出:（见图D.14）

[page:467]

## 附录口 使用Mathematica学习离散数学

【功能】显示1～12在整除关系下的哈斯图（显示顶点标号）。

输入: ShowGraph[HasseDiagram[MakeGraph[Range[12], Divisible[#2,#1]&]], VertexNumber->True ]

输出:（见图D.15）

【功能】显示1～12在整除关系下的一个拓扑排序。

输入: TopologicalSort[MakeGraph[Range[12],Divisible[#2,#1]&]]

输出:{1,2,3,5,7,11,4,6,9,10,8,12}

## D.4 图

【功能】显示有5个顶点的完全图。

输入:ShowGraph[CompleteGraph[5]]

输出:（见图D.16）

【功能】给出有5个顶点的完全图的邻接矩阵表示。

输入: TableForm[ToAdjacencyMatrix [CompleteGraph[5]]

<table><tr><td>输出:0</td><td>1</td><td>1</td><td>1 1</td></tr><tr><td>1</td><td>1</td><td>1</td><td>1 1 1</td></tr><tr><td>1</td><td></td><td>0</td><td>1</td></tr><tr><td>1</td><td>1</td><td></td><td>1</td></tr><tr><td>1</td><td>1</td><td>1</td><td>0 1</td></tr></table>

[page:468]

## 468

【功能】计算有5个顶点的完全图的顶点数。

输入:V[CompleteGraph[5]]

输出:5

【功能】计算有5个顶点的完全图的边数。

输入:M[CompleteGraph[5]]

输出:10

【功能】计算有5个顶点的完全图各顶点的度数。

输入:Degrees[CompleteGraph[5]]

输出:{4,4,4,4,4}

【功能】将图表示转换为有序对的表示方法。

输入:ToOrderedPairs[CompleteGraph[5]]

输出:{{2,1},{3,1},{4,1},{5,1},{3,2},{4,2},{5,2},{4,3},{5,3},{5,4},{1,2},{1,3},{1,4}, {1,5}, {2,3}, {2,4},{2,5},{3,4},{3,5},{4,5}}

【功能】将图表示转换为无序对的表示方法。

输入:ToUnorderedPairs[CompleteGraph[5]]

输出:{{1,2},{1,3},{1,4},{1,5},{2,3},{2,4},{2,5},{3,4},{3,5},{4,5}

【功能】显示有5个顶点的完全图保留顶点{1,2,4}后得到的生成子图（顶点标号）。

输入: ShowLabeledGraph[InduceSubgraph[CompleteGraph[5], {1,2,4}]]

输出:（见图D.17）

【功能】显示有10个顶点的星形图。

输入:ShowGraph[Star[10]

输出:（见图D.18）

【功能】在有10个顶点的星形图中加入边{1,2}并显示（顶点标号）。

输入: ShowLabeledGraph[AddEdge[Star[10], {1,2}]]

输出:（见图D.19）

【功能】在有10个顶点的星形图中加入边{1,2}、{5,7}并显示。

输入: ShowGraph[AddEdges[Star[10], {{1,2}, {5,7}}]]

输出:（见图D.20）

[page:469]

## 附录口 使用Mathematica学习离散数学

【功能】在有10个顶点的星形图中删除边{8,10}并显示。

输入: ShowGraph[DeleteEdge[Star[10], {8,10}]]

输出:（见图D.21）

【功能】显示一个完全二部图 $K _ { 3 , 4 }$

输入:ShowGraph[CompleteGraph[3,4]]

输出:（见图D.22）

【功能】显示彼得森图。

输入:ShowGraph[PetersenGraph]

输出:（见图D.23）

【功能】显示一个6×6棋盘上骑士的可能行动路线图。

输入:ShowLabeledGraph[KnightsTourGraph[6,6]]

输出:（见图D.24）

【功能】寻找一个6×6棋盘上的一个骑士周游道路。

输入:HamiltonianPath[KnightsTourGraph[6,6]]

输出: {1,9,5,16,3,7,15,2,10,6,17,30,34,26,13,21,32,19,8,4,12,23,36,28,20,31,27,35,24,11, 22,18,29,33,25,14}

【功能】寻找一个6×6棋盘上的一个骑士周游解。

输入:HamiltonianCycle[KnightsTourGraph[6,6]]

[page:470]

## 离散数学及应用（第2版）

输出: {1,9,5,16,3,7,15,2,10,6,17,30,34,26,13,21,32,19,8,4,12,23,36,28,20,31,27,35,24,11, 22,18,29,33,25,14,1}

【功能】给出有6个顶点的完全图的一条哈密顿回路。

输入:HamiltonianCycle[CompleteGraph[6]

输出:{1,2,3,4,5,6,1}

【功能】判断4×4棋盘上的是否存在一个骑士周游回路。

输入:HamiltonianQ[KnightsTourGraph[4,4]]

输出:False

【功能】判断有6个顶点的完全图是否存在欧拉回路。

输入:EulerianQ[CompleteGraph[6]]

输出:False

【功能】给出有5个顶点的完全图的一条欧拉回路。

输入:EulerianCycleCompleteGraph[5]]

输出:{2,3,1,4,5,3,4,2,5,1,2}

【功能】给有4个顶点的完全图每个边编号（即权值）并输出。

输入: ShowLabeledGraph[CompleteGraph[4],EdgeLabel->{1,2,3,4,6,8}]

输出:（见图D.25）

【功能】给有4个顶点的完全图每个边赋权值并计算其旅行商问题解。

输入: TravelingSalesman[SetEdgeWeights[CompleteGraph[4], {1,2,3,4,6,8}]]

[page:471]

## 附录口 使用Mathematica学习离散数学

输出:{1,3,2,4,1}

注:此时解为 2+4+6+3=15。

## D.5 树

【功能】判断一个图是否无圈。

输入: L={{1,1},{1,2},{1,4},{2,1},{3,2},{3,4}}

输出:{1,1},{1,2},{1,4},{2,1},{3,2},{3,4}

输入:G=FromOrderedPairs[L]

输出:Graph:< 6,4,Directed >

输入:AcyclicQ[G]

输出:False

【功能】找出一个图中的一个圈。

输入:FindCycle[G]

输出:{1,1}

【功能】找出该关系的对称闭包的一个生成树并显示。

输入: ShowGraph[MinimumSpanningTree[MakeUndirected[G]]]

输出:（见图D.26）

【功能】判断一个无向图是否是树。

输入:TreeQ[MakeUndirected[G]]

输出:False

【功能】随机生成一个有8个顶点的树。

输入:ShowGraph[RandomTree[8]]

输出:（见图D.27）

【功能】给无向图每个边编号（即权值）并输出。

输入: ShowGraph[MakeUndirected[G],EdgeLabel->{1,2,3,4,5}]

输出:（见图D.28）

【功能】给无向图每个边赋权值并计算其最小生成树。

[page:472]

## 472

输入: ShowGraph[MinimumSpanningTree[SetEdgeWeights[MakeUndirected[G], {1,2,3, 4,5}]]]

输出:（见图D.29）

【功能】给无向图每个边编号（即权值）并输出（换了一组权值）。

输入: ShowGraph[MakeUndirected[G],EdgeLabel->{5,4,3,2,1}]

输出:（见图D.30）

【功能】给无向图每个边赋权值并计算其最小生成树。

输入: ShowGraph[MinimumSpanningTree[SetEdgeWeights[MakeUndirected[G], {5,4,3, 2, 1}]]]

输出:（见图D.31）

[page:473]

## 附录E

## Prolog 语言与逻辑推理

Prolog 是 Programming in Logic 的缩写，意为使用逻辑的语言编写程序。它是一种逻辑编程语言。Prolog 语言最早由法国艾克斯-马赛(Aix-Marseille)大学的 Alain Colmerauer与Phillipe Roussel等人于20世纪 60年代末研究开发。一直在北美和欧洲被广泛使用。日本政府曾经为了建造智能计算机而用Prolog来开发ICOT第五代计算机系统。在早期的机器智能研究领域，Prolog曾经是主要的开发工具。1995年ISO制定了Prolog标准。

Prolog建立在逻辑学的理论基础之上，最初被运用于自然语言等研究领域。现在它已广泛应用在人工智能的研究中，可以用来建造专家系统、自然语言理解、智能知识库等。

相比于其他编程语言，Prolog语言更容易理解，但是编程思路有极大差异。它很适合开发有关人工智能方面的程序，例如专家系统、自然语言理解、定理证明以及许多智力游戏。

本节的示例都将使用基于 Visual Prolog 6.2 的 PIE（智能推理机）。

## E.1 Prolog 基础

本节只介绍Prolog与其他程序语言（如C语言）差异较大的方面。

Prolog区分大小写，一个原子是由一个小写字母开始的字符串（包括英文字母、数字)，有些原子是常量，而其他的是谓词。而一个变量是由一个大写字母或者下画线“_”开始的字符串。在Prolog中，变量和常数不用事先声明。除了原子及变量外，Prolog也可以处理数字。原子、变量及数字可以置于方括号“[]”内并使用逗号“,”分隔，形成一个列表。

Prolog的一段注释以“/*”开始，以“*/”结尾，单行注释使用“%”。

一个Prolog程序包含数个短句，每个短句或者是事实或者是规则，每一个短句以英文句号“.”（注意不是分号）结尾。

事实就是前提或已知条件，由谓词和个体词构成，以英文句号结束，形式为

谓词(个体词 1,个体词 2,…).

个体词可以是原子（在这种情况下，这些原子被当成常数）、数字、变量或列表，个体词以逗号分隔。

在一个Prolog程序中，有一个事实存在即代表一个语句是真的；无事实存在代表一个语句不是真的。

[page:474]

## 474

在Prolog解释程序被加载（或被查阅）时，使用者可以提交目标或查询，解释程序就会根据事实和规则给出结果（答案）。

## 【例E.1】事实

有如下命题:

（1）上海是一个现代化的城市。

（2）甲是乙的父亲。

(3) 3比2大。

（4）李岚与高翔是同班同学。

4 个命题的 Pro1og 语言表示如下:

(1) modern_city (shanghai).

(2) father (jia, yi).

(3) bigger (3, 2).

(4) classmates (lilan, gaoxiang).

## 【例E.2】 事实与询问

在 PIE中，输入

sunny. /*晴天。*/

按 F9 键(Reconsult)，选择 Window|Dialog 命令打开对话框，在 Dialog 框中输入 sunny，回车后出现

True /* 响应是 True 是因为事实 sunny 存在 */

1 Solution

在 Dialog 框中输入

rainy.

## 回车后出现

No solutions /* 有错误的结果是因为没有一个叫 rainy 的谓词 */

除事实之外，还可以使用规则来定义新的谓词，它的格式为

要定义的谓词:-条件谓词1，条件谓词2，…，条件谓词n.

分隔符“,”表示合取，“;”表示析取（不常用）。

## 【例E.3】规则

在整数范围内，谓词 bigger(X，Y)表示X大于 Y，那么如何利用这个谓词来定义如下的谓词?

(1） max(X, Y, Z)表示 X 大于 Y 和 Z。

(2) min(X, Y, Z)表示 X 小于 Y 和 Z。

(3）middle(X,Y,Z)表示X位于Y和Z之间。

解.可定义谓词如下:

[page:475]

## 附录E Prolog 语言与逻辑推理

(1) max(X, Y, Z):- bigger(X, Y), bigger(X, Z).
(2) min(X, Y, Z):- bigger(Y, X), bigger(Z, X).

(3） X 位于 Y 和 Z 之间可能有两种情况，一是 bigger(X，Y)且 bigger(Z，X)，二是bigger(Y, X)且 bigger(X, Z)。在新谓词有多种情况时，Prolog 允许多次定义同一个名字的谓词。

因此可定义谓词如下:

middle(X, Y, Z):- bigger(X, Y), bigger(Z, X).
middle(X, Y, Z):- bigger(Y, X), bigger(X, Z).

在PIE中的代码及结果如下:

bigger(3, 2).
bigger(5, 2).
bigger(5, 3).
middle(X, Y, Z) :- bigger(X, Y), bigger(Z, X).
middle(X, Y, Z) :- bigger(Y, X), bigger(X, Z).

按 F9 键后在 Dialog 框中输入

middle(3, 2, 5).

回车后出现

True 1 Solution.

表示数3位于2和5之间是成立的。

## 【例E.4】 规则与查询

在 PIE中，输入

father(jack, susan). /*事实1*/
father(jack, ray). /* 事实2 */
father(david, liza). /*事实3 */
father(david, john). /*事实 4 */
father(john, peter). /*事实 5 */
father(john, mary). /*事实 6 */
mother(karen, susan). /*事实 7*/
mother(karen, ray). /*事实 8 */
mother(amy, liza). /*事实 9 */
mother(amy, john). /*事实10 */
mother(susan, peter). /*事实 11 */
mother(susan, mary). /*事实12 */
parent(X, Y) :- father(X, Y). /*规则1 */
parent(X, Y) :- mother(X, Y). /*规则 2 */
grandfather(X, Y):- father(X, Z), parent(Z, Y). /*规则 3 */

[page:476]

## 476

grandmother(X, Y) :- mother(X, Z), parent(Z, Y). /*规则 4 */
yeye(X, Y) :- father(X, Z), father(Z, Y). /*规则 6 */
popo(X, Y) :- mother(X, z), mother(Z, Y). /*规则 9 */

按 F9 键在 Dialog 框中进行查询:

mother(susan,mary).
True
1 Solution /*事实12 */
father(john,susan) .
No solutions /* 这不能被推断出来 */
parent(susan, mary).
True
1 Solution

说明:这个目标要证明“Susan是Mary的一个家长”。从事实12和规则2得知，这个目标是真的。

parent(ray, peter).
No solutions

说明:这个目标要证明“Ray是Peter的一个家长”。没有事实和规则支持。

yeye (X, susan) .
No solutions

说明:这个查询问谁是 Susan的“yeye”。由于不能从程序中找到解，因此 Prolog解释程序回传 no。

popo (karen, X) .
X= peter
x= mary
2 Solutions

说明:这个查询问谁称呼 Karen 为“popo”。从程序得知 Peter 和 Mary 都是解，因此 Prolog解释程序会显示这两个答案。

yeye (X, Y) .
X= david, Y= peter
X= david, Y= mary
2 Solutions

说明:这个查询问“X是Y的yeye'，X和Y是谁？”从程序得知，X是David，而 Y 可以是 Peter 或 Mary。所以 Prolog 解释程序会回传两组结果。

除了自定义的谓词外，Prolog也提供了一些常用的内置谓词:

(a）算术谓词（算术运算符):+、-、*、/（这些运算符只作用于数字和变量）。

（b）比较谓词（比较运算符）:

[page:477]

## 附录E Prolog 语言与逻辑推理

<（小于）—只作用于数字及变量。

>（大于）—只作用于数字及变量。

=<（小于或等于）——只作用于数字及变量。

>=（大于或等于） 只作用于数字及变量。

is——两个操作数有相同的值。

两个操作数完全一样。

== 两个操作数没有相同的值。

以上的内置谓词有两个变元，一个在左面，另一个在右面（和其他的程序设计语言类似)。

## 【例E.5】“is”和“=”的区别

在 PIE中，输入:

4=4.
True
1 Solution

说明:很明显。

4 is 4.
True
1 Solution

说明:很明显。

4=1+3.
No solutions

说明:答案是no，因为“=”左面（4）和右面（1+3）形式不同。

4 is 1+3.
True
1 Solution

说明:“is”左面的值和右面的值相等。

列表是Prolog中的一种特有的数据结构，如[1,2,3,4]就指定了Prolog中的一个列表。

Prolog提供了两种特别的列表操作:

(a）Prolog提供了把表头项以及表头项以外的列表分离的方法。

(b）Prolog强大的递归功能可以方便地访问除去表头项后的列表。

列表的基本形式如下:[XY]。使用此列表可以与任意的列表匹配，匹配成功后，X绑定为列表的第一个元素的值(表头)，而Y则绑定为剩下的列表(表尾)。

## 【例E.6】 列表操作 删除列表中一个给定元素

在 PIE中，输入

delete(A, [A|X], X).
delete(A, [B|X], [B|Y]):-delete(A, X, Y).

[page:478]

## 478

按 F9 键后在 Dialog 框中输入

delete(2, [1, 2, 3, 4], X).

回车后出现

x= [1,3,4]
1 Solution
delete(A, [1, 2、3, 4], X);
A= 1, X= [2,3,4]
A= 2, x= [1,3,4]
A= 3, x= [1,2,4]
A= 4, X= [1,2,3]
4 Solutions
delete(C, [1, 2, 3, 4], [1, 2, 4]);
C= 3
1 Solution
delete(D, [1, 2, 3, 4], [1, 2, 5]);
No solutions
delete(1, E, [2, 3, 4]).
E= [1,2,3,4]
E= [2,1,3,4]
E= [2,3,1,4]
E= [2,3,4,1]
4 Solutions
middle(3, 2, 5).
True
1 Solution.

delete/3(斜线前为谓词名字，斜线后的数字表示参数数量)这个谓词的第一个规则是delete(A,[A|X], X)，这是一个边界条件，当元素A 是列表B的表头时，列表 X就是列表B的表尾。第二个规则定义了递归条件，如果元素A不是列表的表头，那么就递归调用delete/3，在表尾列表中除去A。

【例E.7】列表操作——将列表第一个数值递增1

在 PIE中，输入

a(A1， [A | B]) :- A1 is A + 1. %表示将列表第一个数值递增1

按 F9 键后在 Dialog 框中输入

a (X, [2,3,4])
X= 3
1 Solution

[page:479]

## 附录E Prolog 语言与逻辑推理

## E.2 典型逻辑问题

【例E.8】字谜

在图 E.1 中白色的方格(带有 L*标识的方格)里填上英文单词，可供选择的单词有dog、run、top、five、four、lost、mess、unit、baker、forum、green、super、prolog、vanish、wonder、yellow。

<table><tr><td>L1</td><td>L2</td><td>L3</td><td>L4</td><td>L5</td><td></td></tr><tr><td>L6</td><td></td><td>L7</td><td></td><td>L8</td><td></td></tr><tr><td>L9</td><td>L10</td><td>L11</td><td>L12</td><td>L13</td><td>L14</td></tr><tr><td>L15</td><td></td><td></td><td></td><td>L16</td><td></td></tr></table>图 E.1 例 E.8 用图

解.完整的程序代码如下:

word(d,o,g).
word(r,u,n).
word(t,o,p).
word(f,i,v,e).
word(f,o,u,r).
word(1,o,s,t).
word(m,e,s,s).
word(u,n,i,t).
word(b,a,k,e,r) .
word(f,o,r,u,m).
word(g,r,e,e,n).
word(s,u,p,e,r) .
word(p,r,o,1,o,g).
word(v,a,n,i,s,h).
word(w,o,n,d,e,r).
word(y,e,1,1,o,w).
solution(L1,L2,L3,L4,L5,L6,L7,L8,L9,L10,L11,L12,L13,L14,L15,L16):-
word(L1,L2,L3,L4,L5),
word(L9,L10,L11,L12,L13,L14),
word(L1,L6,L9,L15),
word(L3,L7,L11),
word(L5,L8,L13,L16).

按 F9 键后在 Dialog 框中输入

回车后出现

L1= f, L2= o, L3= r, L4= u, L5= m, L6= i, L7= u, L8= e, L9= v, L10= a, L11=

[page:480]

## 480

n, L12= i, L13= s, L14= h, L15= e, L16= s
1 Solution

【例E.9】汉诺塔问题

分析.如果只有一个盘子，直接移过去就行了，这是递归的边界条件。

如果要移动n个盘子，就要分3步走:

(1）把 n-1 个盘子移动到 B柱上(把 C 柱作为临时存放盘子的位置)。

（2）把最后一个盘子直接移到C柱上。

(3）最后把B柱上的盘子移到C柱上(把A柱作为临时存放盘子的位置)。

上面第（1）、（3）步用到了递归。通过递归把n个盘子的问题变成了两个n-1个盘子的问题。如此下去，最后变成了1个盘子的问题了，这也就是说问题被解决了。

解.完整的程序代码如下:

hanoi(N):-move(N, left, middle, right).
move(1, A, , C):-inform(A, C),!.
move(N, A, B, C):-
N1 is N-1, %注意这里的赋值
move(N1, A, C, B),
inform(A, B),
move(N1, B, A, C).
inform(Loc1, Loc2):-
write("Move a disk from ", Locl, " to ", Loc2),nl.

按 F9 键后在 Dialog 框中输入

hanoi(4)

回车后出现

Move a disk from left to middle
Move a disk from left to middle
Move a disk from middle to right
Move a disk from left to right
Move a disk from right to left
Move a disk from right to left
Move a disk from left to middle
Move a disk from left to middle
Move a disk from middle to right
Move a disk from middle to right
Move a disk from right to left
Move a disk from middle to left
Move a disk from left to middle
Move a disk from left to middle
Move a disk from middle to right
True
1 Solution

[page:481]

## 附录E Prolog 语言与逻辑推理

主程序为 hanoi/1，它的参数为盘子的数目。它调用递归谓词 move来完成任务。3个柱子的名字分别为 left、middle 和 right。

第一个move/4子句是边界情况，即只有一个盘子时，直接调用 inform/2显示移动盘子的方法。后面使用“!”表示停止搜索，这是因为:如果只有一个盘子，就是边界条件，无须再对第二条子句进行匹配了。

第二个move/4子句为递归调用，首先把盘子数目减少一个，再递归调用 move/4，把n-1个盘子从 A柱通过C柱移到B柱，再把A柱上的最后一个盘子直接从A柱移到C柱上，最后再递归调用move/4，把B柱上的n-1个盘子通过A柱移到C柱上。这里的柱子都是使用变量来代表的，A、B、C柱可以是1eft、middle、right中的任何一个，这是在移动的过程中决定的。

inform/2 把移动过程通过 write 谓词写出。write 类似 C 语言中的 printf 语句。

move子句中的“”表示任意变量。

【例E.10】 全排列问题

分析.permutation/2采用递归编写。它的第一个规则是边界条件，表示空表的全排列是空表。第二个规则定义递归，首先使用delete/3把表Y分解成元素A和 Y1，再对Y1进行全排列。因此全排列的思路就是把列表的每个元素作为新列表的头，而把除去某个元素后剩下的列表全排列后作为新列表的尾部。

解.完整的程序代码如下:

delete(A, [A|X], X).
delete(A, [B|X], [B|Y]):-delete(A, X, Y).
permutation([], []).
permutation([A|X], Y):-delete(A, Y, Y1), permutation(X, Y1).

按 F9 键后在 Dialog 框中输入

permutation(X, [1, 2, 3, 4]).

回车后出现

x= [1,2,3,4]
x= [1,2,4,3]
x= [1,3,2,4]
x= [1,3,4,2]
x= [1,4,2,3]
x= [1,4,3,2]
x= [2,1,3,4]
x= [2,1,4,3]
x= [2,3,1,4]
x= [2,3,4,1]
x= [2,4,1,3]
x= [2,4,3,1]
x= [3,1,2,4]

[page:482]

## 482

<table><tr><td></td><td>x= [3,1,4,2]</td></tr><tr><td></td><td>x= [3,2,1,4]</td></tr><tr><td></td><td>x= [3,2,4,1]</td></tr><tr><td></td><td>x= [3,4,1,2]</td></tr><tr><td></td><td>x= [3,4,2,1]</td></tr><tr><td></td><td>x= [4,1,2,3]</td></tr><tr><td></td><td>x= [4,1,3,2]</td></tr><tr><td></td><td>x= [4,2,1,3]</td></tr><tr><td></td><td>x= [4,2,3,1]</td></tr><tr><td></td><td>x= [4,3,1,2]</td></tr><tr><td></td><td>x= [4,3,2,1]</td></tr><tr><td></td><td>24 Solutions</td></tr></table>

[page:483]

## 参考文献

[1] Kolman B, Busby R, Ross S C. Discrete Mathematical Structures(影印版)[M]. 6 版. 北京: 高等教育出版社,2010.

[2] Rosen K H. Discrete Mathematics and Its Applications(影印版) [M]. 7 版. 北京: 机械工业出版社, 2012.

[3] Lovasz L, Pelikan J, Vesztergi K. Discrete Mathematics(影印版) [M]. 北京: 清华大学出版社, 2006.

[4] Dossey J A, Otto A D, Charles L E S, et al. Discrete Mathematics(影印版) [M]. 5 版 北京:机械工业出版社,2006.

[5] Johnsonbaugh R. Discrete Mathematics(影印版) [M]. 7 版 北京: 电子工业出版社, 2009.

[6] 屈婉玲，耿素云，张立昂. 离散数学[M]. 北京:高等教育出版社,2008.

[7] 左孝凌，李为鉴，刘永才. 离散数学[M]. 上海: 上海科学技术文献出版社,1982.

[8] 马振华. 离散数学导引[M]. 北京: 清华大学出版社, 1993.

[9] 王树禾. 离散数学引论[M]. 合肥: 中国科学技术大学出版社,2001.

[10] 徐洁磐，朱怀宏，宋方敏.离散数学及其在计算机中的应用[M].5版.北京:人民邮电出版社,2008.

[11] 耿素云，屈婉玲，王捍贫.离散数学教程[M]. 北京:北京大学出版社,2002.

[12] 王元元，张桂芸. 离散数学[M].2版. 北京: 机械工业出版社,2010.

[13] 卢开澄，卢华明. 组合数学[M].3版. 北京:清华大学出版社,2002.

[14] 潘承洞，潘承彪. 初等数论[M].2版.北京: 北京大学出版社,2003.

[15] 柯召，孙琦.数论讲义:上[M].2版.北京:高等教育出版社,2001.

[16] 柯召，孙琦.数论讲义:下[M].2版.北京:高等教育出版社,2003.

[17] 石纯一，王家廞. 数理逻辑与集合论[M].2版. 北京:清华大学出版社,2000.

[18] 戴一奇，胡冠章，陈卫. 图论与代数结构[M]. 北京: 清华大学出版社,1995

[19] 卢开澄，卢华明. 图论及其应用[M].2版. 北京:清华大学出版社,1995.

[20] 姜伯驹. 一笔画和邮递路线问题[M]. 北京: 科学出版社,2002.

[21] Chartrand G, Zhang P. 图论导引[M]. 范益政，汪毅，等译. 北京: 人民邮电出版社, 2007.

[22] Dasgupta S, Papadimitriou C, Vazirani U. 算法概论[M]. 钱枫，邹恒明，译. 北京:机械工业出版社，2009.

[23] 尤枫，颜可庆. 离散数学[M].2版.北京:机械工业出版社,2008.

[24] 檀凤琴，何自强. 离散数学[M]. 北京:机械工业出版社,2012.

[25] 蒋宗礼，姜守旭. 形式语言与自动机理论[M].3版. 北京:清华大学出版社,2013.

[26] 陈有祺. 形式语言与自动机[M]. 北京: 机械工业出版社,2008

[27] 吴鹤龄.七巧板、九连环和华容道[M]. 北京:科学出版社,2008
