# 猫咪图鉴模块 `cat-dex/`

> 一句话：把地图里那四只猫宠接成一套**有等级、有图鉴、有账号进度**的养成玩法，
> 代码全部收在这个文件夹里，地图那边只多两行标签。

## ⚠️ 给做代码整合的同学：单独拿到这个文件夹是跑不起来的

本模块**只上传 `cat-dex/` 这一个目录**，宿主侧的两处挂载点**不在这次提交里**，
需要整合的人自己加回去（缺任何一处，图鉴要么不加载、要么 404）：

| # | 文件 | 要加什么 | 不加会怎样 |
|---|---|---|---|
| ① | `像素校园_全校地图.html` | `<head>` 里 `mp/theme.css` 之后一行 `<link rel="stylesheet" href="cat-dex/cat-dex.css">`；`</body>` 前 `mp/lobby.js` 之后一行 `<script src="cat-dex/cat-dex.js"></script>` | 页面上没有「🐱 猫咪图鉴」按钮，地图行为与原来完全一致（本模块不改地图一行，漏接线=没这个功能，不会报错） |
| ② | `mp/server.py` | 静态白名单放行 `cat-dex/` 整目录（见 §7.2 那四行） | 走 `mp/server.py` 起服务时 `cat-dex/*.js`、`*.css` 全 404；`python -m http.server` 没有白名单，不受影响 |

⚠️ `<script>` 那行**必须排在主脚本和 `mp/lobby.js` 之后**：本模块要把主脚本里的
`catPet / catFeed / catSprite / catCodexSee` 等顶层函数换成带等级的版本，
那些函数得先存在。顺序提前 = 钩子挂不上 = 图鉴按钮有、但摸喂不涨好感。

完整 diff 抄 §7，逐行照抄即可；接口清单见 §2，验收步骤见 §8。

---

- 版本：`MPCatDex.VERSION = "1.3.0"`
- 文件：`cat-dex.js`（1177 行）+ `cat-dex.css`（120 行）+ 本 `README.md`
- 依赖：`像素校园_全校地图.html` 的猫宠引擎（第 76/77/78 段：`CATS` / `catTick` / 轮盘）
- 不依赖：联机大厅（`mp/lobby.js`）在不在都能跑；只有登录态存在时进度才按 `mp:昵称` 记（见 §4）

---

## 1. 怎么装进页面

模块自己**不注册、不初始化**，只要按顺序加载就完事：

```html
<!-- <head> 里，紧跟 mp/theme.css 之后 -->
<link rel="stylesheet" href="cat-dex/cat-dex.css">

<!-- </body> 前，必须在主脚本和 mp/lobby.js 之后 -->
<script src="cat-dex/cat-dex.js"></script>
```

⚠️ **顺序不能提前**：本文件要把主脚本里的 `catPet / catFeed / catSprite / catCodexSee`
等顶层函数换成带等级的版本，那些函数得先存在。加载后左下角出现
「🐱 猫咪图鉴」按钮（`#catDexBtn`）就说明挂上了。

`install()` 里每个钩子都是 `wrapFn(name, …)`：`window[name]` 不是函数就跳过，
所以把这张文件单独拖到一个没有猫宠引擎的页面上，也只是不干活，不会报错。

---

## 2. 对外接口（`window.MPCatDex`，定义在 `cat-dex.js:1152`）

地图 / 大厅 / 验收脚本要用本模块**只调这些**，别去碰内部函数。

### 2.1 面板

| 接口 | 参数 → 返回 | 说明 |
|---|---|---|
| `openPanel(catId?)` | 无 → `undefined` | 打开图鉴浮层（`.cdx-shade`）。给了 `catId` 就直接翻到那只的详情 |
| `closePanel()` | 无 → `undefined` | 关浮层；详情开着会先收回列表 |
| `togglePanel()` | 无 → `undefined` | 开↔关，按钮点的就是它 |
| `isOpen()` | 无 → `boolean` | 浮层是否可见（快捷键会因此让路：图鉴开着时 Q/R 不摸猫） |

`Esc` 在面板内已绑定：先收详情，再关面板（`cat-dex.js:1062`）。

### 2.2 查询

| 接口 | 参数 → 返回 | 说明 |
|---|---|---|
| `cats()` | 无 → `Row[]` | 四只猫的完整视图，字段见下表 |
| `cat(catId)` | 猫 id → `Row \| null` | 从 `cats()` 里挑一只 |
| `wears()` | 无 → `{id,name}[]` | 头饰清单：`none 不戴 / bow 蝴蝶结 / hat 小礼帽 / flower 小红花 / crown 小皇冠` |
| `level(catId)` | → `int` | 好感等级（0…15+），由累计 xp 反解 |
| `can(catId, kind)` | `kind ∈ feed/approach/heart/follow/wear` → `{ok, level, need}` | 解锁判定；`kind` 不在表里时 `ok:true`（不拦未知动作） |
| `full(catId)` | → `int` | 此刻饱腹读数（0…100，已按真实时间消化过） |
| `daily(catId)` | → `{xp,xpCap,pets,petCap,full,fullMax,fullFeed,stuffed,day}` \| `null` | 今天这笔账：好感点数、抚摸次数、饱腹，以及刷新用的日期戳 |
| `account()` | → `"mp:昵称"` \| `"local:玩家id"` | 当前身份。**强制现读**，会顺手把 §4 那层 300ms 缓存作废 |
| `_state()` | → `{键:记录}` | 只读快照（验收用）。⚠️ 返回的是**整本账**，含别人账号的行 —— 键名前缀就是身份 |

`cats()` 每行（`cat-dex.js:870`）：

```
id name breed personality trait            // 品种/性格/习性文案来自本模块 §1 的 CAT_BRIEF
home now schedule                          // 常出没地 / 这个钟点 / 作息表（读地图的 CAT_SPOTS、CAT_SCHED）
met                                        // 这个账号见没见过 → 决定面板遮不遮身份
xp level xpIn xpNeed xpToNext nextMilestone
wear wearName follow
full fullMax fullFeed stuffed              // 饱腹
dayXp dayXpCap dayPets dayPetCap           // 当日额度
```

### 2.3 写入

| 接口 | 说明 |
|---|---|
| `addXp(catId, 点数, 原因)` | 涨/扣好感，返回 `{level, up[], got, capped}`。`up` 是这次跨过的等级，`got` 是实际到账（可能被当日上限截短），`capped=true` 表示今天一点都没涨。**当日好感上限只在这里落**（`cat-dex.js:271`），所以任何入口（轮盘、快捷键、将来的活动）都自动受管 |
| `setWear(catId, 饰id)` | 戴头饰。低于 15 级且不是 `"none"` → 返回 `false` 不写 |
| `setFollow(catId)` | 让它跟着我。低于 10 级或猫不存在 → `false`。一次只跟一只，会自动把上一只放回领地 |
| `stopFollow(catId)` | 解除跟随并把它挪回老地方（不挪会被地图的领地绳圈永久钉死在墙边） |
| `followOf()` | 当前跟随的是哪只（`null` = 没跟） |

### 2.4 事件

`on(name, fn)` → 返回取消函数。四类事件（`cat-dex.js:245`）：

| 事件 | payload | 什么时候发 |
|---|---|---|
| `level` | `{catId, from, to, up[], reason}` | `addXp` 跨过等级线 |
| `wear` | `{catId, wear}` | `setWear` 成功之后 |
| `follow` | `{catId, on}` | `setFollow` / `stopFollow` 成功之后 |
| `met` | `{catId}` | **这个账号**第一次见到某只猫（地图的 160px 触发链走进来） |

宿主想给自己的按钮加角标，就订 `met` / `level`，别去轮询 `cats()`。

---

## 3. 玩法与数值

### 3.1 等级与解锁（需求原文的五个点）

涨分：`抚摸 +2 / 喂食 +5`；等级 L→L+1 要 `L+1` 点 ⇒ 累计是三角数
（1 级=1、5 级=15、7 级=28、10 级=55、15 级=120）。

| 等级 | 解锁 | 实现 |
|---|---|---|
| 0 | 只能靠近、抚摸（"0 级开启记录"） | `doPet` 不设等级门槛 |
| 1 | 喂食 | `feedBlockReason` 第一道 |
| 5 | 猫主动过来蹭 | `approachTick()`，半径 `APPROACH_R=160`、蹭 6 秒、24 秒冷却 |
| 7 | 摸/喂冒爱心 | `burst()` |
| 10 | 图鉴里可选跟随 | `setFollow()` |
| 15 | 头饰换装 | `setWear()` + 精灵烘焙 |

第一次抚摸就给 +2 ⇒ 直接顶到 1 级，否则"摸完还是喂不动"看着像没生效。

### 3.2 三条独立的资源

| 账 | 上限 | 恢复 | 到顶的表现 |
|---|---|---|---|
| 好感 xp | 无（累计） | — | 升级 |
| 当日好感 `dayXp` | `DAY_XP_CAP=40`/只 | 过零点整本清零 | 动作照做、点数不涨，气泡「它今天玩累了，好感得明天再攒」 |
| 当日抚摸 `dayPets` | `DAY_PET_CAP=10`/只 | 同上 | 「它今天被你摸得够多了，让它歇一会儿」 |
| 饱腹 `full` | `FULL_MAX=100`/只 | 按**真实时间**每分钟消化 10 点 | 「猫咪已经饱啦，稍后再喂食吧」 |

两个每日额度是配套设计的：10 次抚摸(20) + 4 次喂食(20) = 当天 40 点正好用满。
喂食冷却 `FEED_CD_MS=6000`、抚摸冷却 `PET_CD_MS=2000`。

⚠️ 饱腹的"满"判的是**下一口放不放下**（`fullness + FULL_FEED > FULL_MAX`），
不是"读数等于 100"：消化是连续的，写 `>= 100` 的话吃满那一刻过一秒就变 99.8，
阈值永远够不着，玩家会看见"条画满了、喂下去却照样吃"。

### 3.3 数字只出现在面板里

地图 §交互.md 六 给世界内反馈立的规矩是"只有动作，没有数字"。所以游戏里看到的是
那句「猫咪已经饱啦」，不是 `87/100`；`饱腹 25/100`、`今日好感 +27/40` 这种读数
只在图鉴详情面板里画（`renderDetail()`）。

### 3.4 未遇见的猫遮什么

`met=false` 时（`renderGrid` / `renderDetail`）：

- 藏：名字（`？？？`）、习性文案（"走近看看是谁。"）、常出没地、这个钟点、**作息每行后面的地名**
- 给：品种（蹲下去看一眼就看得见的东西）、作息**时段**（几点来蹲是玩法的一部分）、
  好感/饱腹数值条、猫的图片（图鉴要求收录全部猫咪，只把它 `grayscale(1) brightness(.6)` 压成灰影）

⚠️ 作息的地名必须一起藏：那几行本来就带"食堂后门"这类字样，只挡「常出没地」
一格等于没挡 —— 同一张面板里自己漏自己。
第一次走近时（`catCodexSee` 钩子里）列表和详情**当场去灰**，不用重新点卡片。

---

## 4. 身份与存档（v1.3.0 重点）

### 4.1 为什么进度必须是账号级的

地图自带的两把钥匙都挂在**浏览器**上：

| 键 | 出处 | 问题 |
|---|---|---|
| `pixelcampus.pid` | `catPid()`（地图 19216 行）首次访问时生成 `p+Date.now().toString(36)` | 一台机器只有一个 |
| `pixelcampus.cat_codex` | `catCodexSee()`（地图 19264 行）写"哪几只见过" | 完全不分账号 |

⇒ 换一个新的登录号进来，图鉴直接是「已认识 4/4」、好感等级也是上一人攒的。
这就是本轮要修的 bug。

### 4.2 本模块怎么算身份（`acct()`，`cat-dex.js:118`）

```
1) localStorage.mpToken 有值 且 mpNickname 有值  →  "mp:" + mpNickname
2) 否则                                          →  "local:" + catPid()
```

- 判据用 `mpToken`：大厅退出登录会走 `clearAccountState() → saveToken('')` 把它清掉，
  而 `mpNickname` 不会跟着清（`mp/lobby.js:125`），只看昵称会把上一个人的名字带进空档。
- 用**昵称**而不是 token 当 key：token 每次登录都现发一张新的（`mp/server.py:515`
  按 sha256 落一行），拿它当 key 会变成"每重登一次好感清零"。
- 前缀里的冒号是标记：`prune()` 靠它认出并清掉旧版那种没有账号段的行
  （`pxxxx|cat_daju`）。**旧行不做迁移** —— 把浏览器级的共享进度认给某一个人，
  等于换个姿势复现这个 bug。
- `pid()` 外面夹了一层 300ms 缓存（`cat-dex.js:128`）：`rec()→key()→pid()` 每帧会被
  叫几十次，而 localStorage 是同步读。切换账号最迟 300ms 后被 `acctWatch()` 发现，
  这期间不会有玩家动作落进账（摸 2 秒 / 喂 6 秒冷却）。

### 4.3 键位表

| 存储 | 键形 | 装什么 |
|---|---|---|
| `localStorage["pixelcampus.cat_dex.v1"]` | 整本文档 | `{v, day, rec, codex}` |
| ↳ `rec` | `"mp:阿橘\|cat_daju"` | `{xp, wear, follow, petAt, feedAt, full, fullAt, dayXp, dayPets}` |
| ↳ `codex` | `"mp:阿橘"` | `{cat_daju:1, …}` ← **认识状态的真值在这里** |
| ↳ `day` | `"2026-10-31"` | 当日额度的日期戳，跟着地图 `catNow().day` 的口径 |

`catCodexLoad()` / `catCodexSee()` 这两个**地图的**函数在 `install()` 里被整个换成
读上面这套实现的版本（`cat-dex.js:1125`、`1132`），所以全校园只有一份真值：
图鉴说没认识、地图就不会说认识了；地图的 `pixelcampus.cat_codex` 从此没人读也没人写。

### 4.4 换账号不用刷新

`acctWatch()`（`cat-dex.js:781`，挂在每帧的 `tick()` 里）盯住身份变化：
登录 / 退出 / 断网转单机都只改 localStorage 不换页，所以这里会
① 把上一人领的那只猫放回领地，② 重画列表和详情。

---

## 5. 内部结构（`cat-dex.js` 十节）

| 节 | 行 | 干什么 |
|---|---|---|
| 1 等级曲线与解锁点 | 40 | 全部可调常数 + `CAT_BRIEF`（品种/性格/习性）+ `SPOT_LABEL`（四块领地） |
| 2 存档 | 96 | §4 的身份、`load/save/rec/prune` |
| 2.1 每日额度与饱腹 | 193 | `today/ensureDay/fullness/eatFull/isStuffed/dayXpLeft` |
| 3 事件总线 | 243 | `hooks/on/emit` |
| 4 查询与涨分 | 257 | `level/can/addXp/setWear` |
| 5 与地图引擎的缝合 | 302 | `SCORE_FLOOR`（按等级给耐受度压下限）、`say`、`wrapFn`、`doPet/doFeed`、头饰烘焙 |
| 6 爱心特效 | 512 | 三帧贴图 + `burst()`（侧视时爱心跟头走，不跟锚点） |
| 7 跟随（10 级） | 561 | `setFollow/stopFollow/followTick/releaseHome` + 7.1 主动靠近 |
| 8 每帧心跳 | 779 | `acctWatch()` + `tick()`：跨零点、跟随、靠近、键位气泡、爱心入列、头饰留白的 `ay` 补偿 |
| 9 图鉴面板 | 830 | `buildUI/cats/renderGrid/renderDetail/barOf` |
| 10 装钩子 + 导出 | 1075 | `install()` + `window.MPCatDex` |

### 5.1 钩子清单（对地图函数行为的替换，不改地图一个字节）

| 地图函数 | 本模块换成 | 为什么 |
|---|---|---|
| `catMemo` | 包一层：给 `importance` 压等级下限 | 需求要"0 级就能摸"，而陌生档的猫 120px 就跑。只改读到的**副本**，不回写账本 |
| `catPet` | 整个替换 `doPet` | 加抚摸冷却、当日次数、涨好感、爱心、让它走过来蹭 |
| `catFeed` | 整个替换 `doFeed` | 加等级/饱腹/冷却三道闸 + 涨好感；地图"一天只喂一次"不放粮时补 `catDropFood` 那一下表现 |
| `catFedToday` | 整个替换 | 轮盘的拒喂提示改成本模块的文案 |
| `catLeash` / `catKeepIn` | 包一层 | 跟随的猫松开领地绳圈，否则跨半张校园会被钉在边界上 |
| `catSprite` | 包一层 | 把头饰烘进精灵（带缓存 `_wearCache`） |
| `catCodexLoad` / `catCodexSee` | 整个替换 | **认识状态改账号级**（§4） |
| `occlTick` | 包一层 | 唯一一个"drawList 排完序之后、落笔之前"的可替换钩子，爱心和留白补偿都挂这里 |

### 5.2 头饰留白（一个容易再踩的坑）

待机上下浮动时头饰会被画布顶边一点点吃掉 ⇒ 戴饰的精灵在头顶多烘 `WEAR_PAD=4`
行透明（`padTop()`），代价是落笔点要跟着抬高：`tick()` 里对带 `__cdxPad` 的条目做
`it.ay += p`。⚠️ 必须防重入 —— 主脚本把 **props 按引用**推进 `drawList`，
`ay +=` 写两遍猫就飘上半空，所以用 `it.__cdxPadDone !== p` 做幂等。
CSS 侧所有 `canvas` 一律 `height:auto`，写死 54×54 会把多出来的行压回 18 行 = 猫被压扁。

---

## 6. 本模块的修改总结（按需求轮次）

| # | 需求 / 问题 | 落点 | 实测 |
|---|---|---|---|
| 79 | 建猫咪图鉴模块：等级/解锁五档、面板、跟随、头饰、爱心、主动靠近 | 整个 `cat-dex/` | 已验收 |
| 80 | 靠近猫出现「Q 抚摸 · R 喂食 · G 更多」键位气泡；轮盘两格补 Q/R 角标 | `tipText/tipTick`（711、717）、`badgeWheel`（742）、`.cdx-keytip`、`#wheel .cdx-wk` | 已验收 |
| 81 | 喂食单独一条**饱腹值**条；吃饱了喂食无效并提示 | `FULL_*`、`fullness/eatFull/isStuffed`、`feedBlockReason` 那句「猫咪已经饱啦，稍后再喂食吧」、详情面板 `cdx-full` 条 | 连喂 5 次，第 5 次被拒且文案逐字一致 |
| 82 | "过来蹭"的感应距离略小，微微调大 | `APPROACH_R` 120 → **160**（与地图"认识"半径同一个数） | 200px 不触发 / 150px 触发 |
| 83 | 新增每日刷新好感度上限 + 每只猫单独的抚摸次数上限 | `DAY_XP_CAP=40`、`DAY_PET_CAP=10`、`ensureDay()` 按 `catNow().day` 整本清零、`addXp` 里唯一落点 | 到顶后好感不再涨、跨天恢复 |
| 84 | 跟随状态喂食时应该先停下吃完再跟 | `followTick()` 的等待差事分支（`cat-dex.js:611`） | 跟随中喂食 → 停在粮边吃完才归队 |
| 85 | 待机上下浮动时头饰被裁 | `WEAR_PAD/padTop/dressSprite` + `tick()` 的 `ay` 补偿 + CSS `height:auto` | 72 组合逐格比对：戴饰图 D[4..21] == 原图 [0..17]，帽子占 D[0..3] |
| 86 | 初次遇见之前图鉴应是锁定态 → 按方案遮蔽身份 | §3.4 那套（藏名字/习性/地点/作息地名，留品种/时段/数值条/灰图）+ 点亮时当场去灰 | 截图 `cdx_unmet.png` |
| 87 | **新账号还没走近就 4/4 全认识** | §4 账号级身份 + `catCodexLoad/catCodexSee` 换实现 + `acctWatch()`；`VERSION` → 1.3.0 | 见 §8 |

版本号只在成批改完时跳档：`1.1.0`（#81~#85 那批）、`1.2.0`（#86）、`1.3.0`（#87）。

---

## 7. 有没有动模块外的代码？

**动了，一共两处，都是"挂载点"性质的几行，没有任何一行地图逻辑被改。**
⚠️ 这两处**只在本地工作区，没有随 `cat-dex/` 一起提交**（本仓库按模块目录分头开发，
宿主文件由整合的人统一改）—— 要跑起来请按下面两段手动加上，见开头那张表。

### 7.1 `像素校园_全校地图.html` —— 只加 4 行标签（两行引用 + 两行注释）

```diff
@@ <head> 里，mp/theme.css 之后
 <link rel="stylesheet" href="mp/theme.css">
+<link rel="stylesheet" href="cat-dex/cat-dex.css">

@@ </body> 前，mp/lobby.js 之后
 <script src="mp/lobby.js"></script>
+<!-- 猫咪图鉴模块：代码全在 cat-dex/ 里，这里只负责在它之后加载。
+     ⚠️ 顺序不能提前 —— 它要把主脚本里的 catPet / catFeed / catSprite 换成带等级的版本。 -->
+<script src="cat-dex/cat-dex.js"></script>
```

这张文件在工作区里还有别的未提交改动（`buildChar` / `buildCrouch` / 眼睛行位那批），
**那是形象渲染轮次留下的，与猫咪模块无关**。

### 7.2 `mp/server.py` —— 静态白名单放行整个 `cat-dex/` 目录

```python
# mp/server.py:624
# cat-dex/ 是"一个功能模块一个文件夹"的口径（模块自己往里加文件不用再动这里），
# 所以整目录放行；其余仍然只认那几个点名文件。真正的越界由下面的 is_relative_to 挡。
if requested not in {"像素校园_全校地图.html", "mp/look.js", "mp/lobby.js", "mp/theme.css"} \
        and not requested.startswith("cat-dex/"):
    self.send_error(404)
```

同一次改动还把上面那句注释里的"这四个文件"改成"这些文件"（因为目录也放行了）。
`python -m http.server` 那条路径不受影响 —— 它没有白名单。

### 7.3 明确没动的

- `mp/lobby.js`、`mp/look.js`、`mp/theme.css`、`mp/launch_local.py`、四家 NPC 服务、
  `backend/`：**本模块一行未改**。它们工作区里的未提交差异分别属于断线重连、
  形象渲染、启动器那几轮。
- 地图的猫宠引擎（`CATS / catTick / 轮盘 / catMemo / catCodex*`）源码：一行未改，
  全部通过 `window` 上的函数替换实现（§5.1）。
- 没有新增任何密钥；`cat-dex/` 里不含凭据。

---

## 8. 怎么测

### 8.1 起服务

```bash
# 项目根目录，必须用 .venv 解释器 + PYTHONPATH（见项目部署说明）
python mp/server.py            # :3000 静态 + :8090 WS
# 或者只验图鉴本身：python -m http.server 3000，然后开 /像素校园_全校地图.html
```

打开 `http://127.0.0.1:3000/像素校园_全校地图.html` → 登录门点「暂时单机游览」
（或真登录一个号）→ 左下角「🐱 猫咪图鉴」。

### 8.2 账号隔离（本轮的 bug）

控制台跑这段，两个假账号来回切：

```js
const D = MPCatDex, set = (n) => { localStorage.mpToken = 'T_' + n; localStorage.mpNickname = n; };
set('acctA'); D.account();            // → "mp:acctA"
catCodexSee('cat_daju');              // → true（第一次）
D.cats().map(c => c.id + ':' + c.met);// → cat_daju:true，其余 false → 已认识 1/4
set('acctB'); D.account();            // → "mp:acctB"
D.cats().map(c => c.id + ':' + c.met);// → 全 false → 已认识 0/4 ✅
catCodexSee('cat_daju');              // → true（B 也是第一次，世界内提示照弹）
set('acctA'); D.cats()[0].met;        // → true，A 的进度还在
```

真机走一遍更直观：A 号走近大橘点亮 → 退出登录 → 注册/登录 B 号 → 图鉴应是
「已认识 0/4」且四张卡都是 `？？？`；再切回 A 号，大橘仍是亮的。

### 8.3 其余功能

| 验什么 | 操作 | 期望 |
|---|---|---|
| 饱腹 | 连喂 5 次（每次隔 6 秒以上） | 第 5 次气泡「猫咪已经饱啦，稍后再喂食吧」；面板饱腹条转暖橙红 |
| 每日额度 | 摸满 10 次 / 喂到 40 点 | 分别提示"摸得够多了"和"今天玩累了"；过零点（或改 `catNow` 的日期）恢复 |
| 主动靠近 | 5 级后在猫 150px 内站着 | 它自己走过来蹭一阵；200px 不动 |
| 跟随先吃 | 10 级后开跟随，再喂食 | 它停在粮边吃完才归队 |
| 头饰 | 15 级后戴小礼帽，看待机浮动 | 帽子不被画布顶边裁掉，脚仍贴地 |
| 遮蔽 | 新账号打开图鉴 | 名字/习性/常出没地/作息地名都是 `？？？`，品种和时段照给，图是灰影 |

`MPCatDex.daily('cat_daju')` / `.full('cat_daju')` / `._state()` 是只读探针，
不用点界面就能读数。

---

## 9. 已知边界（没做的，先说清楚）

- **单机游览的身份**：大厅的 `soloSignIn()` 只把 token 存在闭包变量里，没写
  `localStorage.mpToken`（`mp/lobby.js:83`），所以单机走的是 `local:<catPid>` 这条回退。
  同一台浏览器多次单机 = 同一个本地存档；换浏览器才是新档。这是大厅那侧的写法，
  本模块没去改它。
- 一次只让一只猫跟随（四只全贴脚边就成遛猫大队了）。
- 详情里那条「站/走/蹭/睡」大图条未遇见时**不灰**（列表小图是灰的）。要一起灰的话
  改 `renderDetail()` 里那个 `forEach`，加 `c.met ? "" : " cdx-dim"`。
- 世界内不加饱腹数字（§3.3 的规矩）。
- 好感等级不随时间衰减；地图自己那份"耐受度分数"的每日衰减照旧，两者互不改写。
- `pixelcampus.cat_codex` 这把旧钥匙还留在 localStorage 里（没人读、也没人清），
  要不要顺手删掉等其它模块一起收尾。
