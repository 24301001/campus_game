/* =========================================================
   7.2 向导 · 小北：说个地方，她带你走过去
   ---------------------------------------------------------
   本段是整个交互层的第一块砖。此前地图 97 万字节里**没有人、没有说话、
   没有输入**（全库搜 npc / 对话 / 寻路 零命中），所以这里从零立三层：

     ① **NPC**    —— 红衣女志愿者站在南门内出生点旁（精灵走 71 段的换装配色）
     ② **对话**   —— 走近按 E 开面板，打字或点按钮说一个地名
     ③ **带路**   —— 在栅格上跑 Dijkstra 出一条路，然后**角色自己走过去**

   ⚠️ 四条贯穿全段的设计约束，每一条都是想清楚才定的：

   (1) **她自己走，不碰 `player` 一根汗毛。**（2026-09-30 第三十六轮整条改写）
       第三十五轮这里写的是反的：她站在原地，靠伪造 `dx/dy` 把**玩家**推着走。
       用户当场指出玩法不对 —— 带路的人应该走在前面。现在 `GUIDE.x/y` 是一个真正
       被驱动的位置，方向键 100% 还给玩家；「带路中怎么中止」于是必须换键，
       从"按方向键"改成 **Esc**（见 §7.2.8）。
       ⚠️ 她的移动谓词与 `ensureWalkGrid()` 烘格子那一行**逐字相同** —— 理由见 §7.2.6。
       ⚠️ 步态照抄玩家那两行（按**实际位移**推进、顶墙位移 0 就停），
          所以她也正常抬腿、正常贴墙滑、正常待机呼吸。

   (2) **路网是现成的，但必须用玩家那把尺子重筛一遍。**
       `20_ground.js` 的 `CELLK` 是烘焙地面时顺带算出来的 326×184 占位图，
       全项目搜 findPath / A* 零命中 —— 不需要写第二份几何。
       ⚠️ 但 `CELLK` 只认「这格是不是楼」，它**不知道** `solids` 里那些石狮/旗台/围墙。
          所以还得叠一层 `blocked()`。**必须是 `blocked` 而不是 `ptBlocked`**：
          前者 hw=6/hh=4，正是玩家自己在主循环里用的那一把尺子；后者 hw=7/hh=5，
          宽 1px 就会规划出一条"格子上通、他人挤不过去"的缝。

   (3) **不进 `props`，走 `render()` 的 `drawList`。** 两重收益：
       ① 她是每帧换 `img` 的活人（朝向随玩家 + 待机两帧呼吸），进 `props` 会让
          `_propdiff.py` / `_sprhash.py` 每轮报一条**假差异**（同 duck / flag 的处理）；
       ② 不进 `props` 就天然躲开 60 段那一串**白名单式** clear* —— 那些函数只保留
          自己认识的 tag，一个陌生的小精灵落在草坪带上会被静默删掉。
       代价：`_scene.py` / `_propview.py` 那族探针**看不见她**（它们只遍历 props），
       所以"画得对不对"只能靠 `shot.py` 出图肉眼判。

   (4) **不 `addSolid`。**
       向导没有碰撞盒，玩家可以从她身上走过去（和鸭子一样）。这不是偷懒 ——
       `scatter()` 的 `n` 兼作物种种子，**任何 `addSolid` 挪位都会重掷全校园散射**
       （README §6.6 那颗地雷）。也不能改 `_propdiff.py` 的跳过名单去遮它。
   ========================================================= */

/* --- 7.2.1 状态 --- */
const GUIDE = {
  x: 0, y: 0, dir: "down", step: IDLE_BASE, idle: 0,   // 站位与朝向
  walk: 0,                                             // 行走累加器（驱动她的步态相位）
  near: false, open: false,                            // 气泡 / 面板
  mode: "home",                                        // 见下方状态表
  path: null, wi: 0, dest: "", spot: null,             // 沿路走
  hold: 0,                                             // 0 走 / 1 半路等你 / 2 到站等你
  stuck: 0, retried: false,                            // 卡死探测 / 本段已原地重算过一次
  delay: 0, lastAsk: null,                             // 回复展示期 / 上一次问到的目的地
  think: 0, busy: false,                               // 第三十九轮：大模型作废计数 / "正在想"
  comeT: 0, comeX: 0, comeY: 0                         // "走向你"的节流重算
};
/* 状态表（第三十六轮新增）：
     home    站在南门原位（GUIDE_HOME），不动
     here    站在你旁边待命，不动
     come    正走向你（被你按 E 叫过来）
     lead    带路中：走在前面 + 滞回等你
     arrived 已到目的地，面板开着等你按 Esc
     back    正走回南门
   ⚠️ `hold` 只在 `lead` 里有意义：1 = 半路停下等你，2 = 到站了但你还没跟上。 */
const GUIDE_NEAR2  = 46 * 46;     // 招呼半径 46 世界像素（≈2 格）
const GUIDE_WP_R2  = 14 * 14;     // 中间路点的到点半径（她 94px/s ÷ 60 ≈ 1.57px/帧）
const GUIDE_END_R2 = 8 * 8;       // 最后一个路点收紧一点，她才会真的站到地方上
const GUIDE_STUCK_T = 1.5;        // 连续 1.5s 走不动就原地重算；再 1.5s 就放弃
const LEAD_MAX = 72, LEAD_MIN = 46;   // 滞回：拉开 72px 停下等，追回 46px 继续走
const LEAD_END = 60;                  // 到站后要等你进到 60px 内，才弹「到了」
const COME_NEAR2 = 52 * 52;           // 她走到你身边这个半径内就算"到你跟前了"

/* --- 7.2.2 站位：南门内、出生点旁边 ---
   照 `60_assemble.js:783` 找 SPAWN 的那个写法，逐个候选偏移试到第一个能站的。
   ⚠️ 不许与 SPAWN 重合 —— 一出生就叠在一起，玩家会以为卡住了。
   ⚠️ 这里只挑坐标，**不加 addSolid**（见文件头 (4)）；她的精灵由补丁 18 落笔。 */
const GUIDE_HOME = { x: 0, y: 0 };   // 南门原位。她带完路要精确归位到这一点
(function guidePlace() {
  const CAND = [[46, -26], [-46, -26], [46, 26], [-46, 26], [60, -2], [-60, -2], [0, -58]];
  for (const c of CAND) {
    const x = clamp(SPAWN.x + c[0], 20, WORLD_W - 20);
    const y = clamp(SPAWN.y + c[1], 70, WORLD_H - 24);
    if (canWalk(x, y) && !blocked(x, y) && insideBoundary(x, y) && distToBound(x, y) > 30) {
      GUIDE.x = x; GUIDE.y = y; break;
    }
  }
  if (!GUIDE.x) { GUIDE.x = SPAWN.x; GUIDE.y = SPAWN.y - 70; }   // 兜底
  GUIDE_HOME.x = GUIDE.x; GUIDE_HOME.y = GUIDE.y;
  console.log("[像素校园] 向导小北站位 (" + (GUIDE.x | 0) + ", " + (GUIDE.y | 0) + ")"
    + " · 距出生点 " + Math.hypot(GUIDE.x - SPAWN.x, GUIDE.y - SPAWN.y).toFixed(1) + "px");
})();

/* --- 7.2.3 地名词典 ---
   锚点惯例照 `60_assemble.js:795` 的 `_landmarks`：**矩形中轴 x + 南缘 y**，
   再往南推 14px 落到墙外 —— 南缘本身常压在 BLD 格上（楼是从南缘往里画的），
   不推这一下，每一次寻路都要靠终点回退兜。 */
const GDEST = [];
(function guideBuildDict() {
  for (const e of CAMPUS) {
    if (e[1] === "grass") continue;          // 草坪 ×5：景观不是目的地，见 §7.2.6
    const R = zoneRect(e);
    GDEST.push({ name: e[0], kind: e[1], ax: R.x + R.w / 2, ay: R.y + R.h + 14 });
  }
  for (const G of GATES) {
    /* 门点沿**朝校内**的法线推 30px：南北门是竖门（dir v）、东西门是横门（h） */
    const inY = G.y > WORLD_H / 2 ? -30 : (G.y < WORLD_H / 2 ? 30 : 0);
    const inX = G.x > WORLD_W / 2 ? -30 : (G.x < WORLD_W / 2 ? 30 : 0);
    GDEST.push({ name: G.name, kind: "gate",
                 ax: G.x + (G.dir === "h" ? inX : 0),
                 ay: G.y + (G.dir === "v" ? inY : 0) });
  }
  for (const P of PLAZA)                    // ⚠️ PLAZA 的 x/y/w/h 已是世界像素
    GDEST.push({ name: P.name, kind: "plaza", ax: P.x + P.w / 2, ay: P.y + P.h / 2 });
})();

/* 匹配键集：**规范名自映射 ∪ 别称表**。键 → 候选规范名数组（>1 个就是歧义）。
   ⚠️ 铁律：每一条的键都必须能在 CAMPUS / GATES / PLAZA 里找到出处。本校园实测
      **CAMPUS 52 行**（bld 39 / grass 5 / bball 2 / water 1 / siyuan 1 / library 1 /
      tennis 1 / track 2 —— 与 `accept.py` 的 B4 逐类相同），名字分布：
      宿舍 ×12 / 草坪 ×5 / 操场 ×2 / 篮球场 ×2 / **其余 31 各 1**（12+5+2+2+31 = 52）。
      去掉 5 块草坪 + 5 个校门 + 5 个广场 ⇒ **GDEST 共 57 个**（探针实测 n=57）。由此：
        · 教学楼只有 第一/二/五/七/八/九 六栋 ⇒ **「三教/四教/六教」一律不许进表**，
          用户打「三教」应该得到"没找到"，而不是被带到某栋随机的楼；
        · 图书馆**只有一座** ⇒ 「新图」不许进表（「老图」保留，那是口语叫法）；
        · 「思源」是**三重歧义**（思源楼 / 东楼 / 西楼），「机械」是二重
          （机械楼 / 机械实验馆），「体育馆」也是二重 ⇒ 都指向数组，走 §7.2.4 消歧。
   ⚠️ 订正记录（2026-09-30）：本条注释曾写「53 行 / 操场 ×3」，是照一轮已经作废的
      口头盘点抄的。以 `accept.py` 的 B4 与端到端探针的 `n=57` 两处**独立实测**为准。 */
const GALIAS = [
  ["一教", ["第一教学楼"]], ["二教", ["第二教学楼"]], ["五教", ["第五教学楼"]],
  ["七教", ["第七教学楼"]], ["八教", ["第八教学楼"]], ["九教", ["第九教学楼"]],
  ["老图", ["图书馆"]], ["图书", ["图书馆"]],
  ["一食堂", ["学生1食堂"]], ["1食堂", ["学生1食堂"]], ["食堂", ["学生1食堂"]],
  ["饭堂", ["学生1食堂"]], ["餐厅", ["学生1食堂"]],
  ["建艺楼", ["建筑艺术学院"]], ["建艺学院", ["建筑艺术学院"]],
  ["建艺", ["建筑艺术学院"]], ["艺术楼", ["建筑艺术学院"]],
  ["建筑艺术楼", ["建筑艺术学院"]], ["艺术学院", ["建筑艺术学院"]],
  ["思源", ["思源楼", "思源东楼", "思源西楼"]],       // ← 三重歧义
  ["机械", ["机械楼", "机械实验馆"]],                // ← 二重歧义
  ["体育馆", ["新体育馆", "老体育馆"]],              // ← 二重歧义
  ["新体", ["新体育馆"]], ["老体", ["老体育馆"]],
  ["明湖", ["水域"]], ["湖", ["水域"]],
  ["服务中心", ["学生服务中心"]], ["学服", ["学生服务中心"]],
  ["计中", ["计算机中心"]], ["计算机", ["计算机中心"]],
  ["工训", ["工程训练楼"]], ["工训楼", ["工程训练楼"]],
  ["逸夫", ["逸夫楼"]], ["逸夫教学楼", ["逸夫楼"]],
  ["天佑", ["天佑会堂"]], ["会堂", ["天佑会堂"]], ["科会", ["科学会堂"]],
  ["校史", ["校史馆"]], ["积秀", ["积秀园"]],
  ["运输", ["运输实验馆"]], ["光波", ["光波楼"]], ["电气", ["电气工程楼"]],
  ["16号楼", ["16宿舍楼"]], ["十六号楼", ["16宿舍楼"]], ["16号宿舍楼", ["16宿舍楼"]],
  ["18号楼", ["18宿舍楼"]], ["十八号楼", ["18宿舍楼"]], ["18号宿舍楼", ["18宿舍楼"]],
  ["田径场", ["操场"]], ["球场", ["篮球场"]]
];
const GKEY = Object.create(null);
for (const d of GDEST) if (!GKEY[d.name]) GKEY[d.name] = [d.name];
for (const a of GALIAS) GKEY[a[0]] = a[1];

/* 快捷按钮。⚠️ 写的是**玩家会说的词**（含别称），点下去走同一个 `guideAsk()` 入口。
   这里刻意只用**规范名**（唯一、无需消歧）—— 「16宿舍楼 / 18宿舍楼」这两个规范名
   本身就唯一，正好给「宿舍」那个 12 重的歧义当逃生口。 */
const GPICKS = ["图书馆", "思源楼", "第五教学楼", "第九教学楼",
                "学生1食堂", "逸夫楼", "建筑艺术学院", "16宿舍楼", "南门"];

/* --- 7.2.4 匹配：最长优先 + 位置次优 ---
   为什么不先剥掉「带我去 / 怎么走」再匹配：没必要，最长匹配在原文上直接命中
   （「带我去五教怎么走」里「五教」是子串，而「怎么走」不在任何地名里）。多剥一步
   反而会剥掉真名字。 */
function guideStrip(s) { return (s || "").replace(/[\s，。、？！,.?!~·:：]/g, ""); }

function guideResolve(text) {
  const t = guideStrip(text);
  if (!t) return null;
  if (t.indexOf("草坪") >= 0 || t.indexOf("草地") >= 0) return { grass: true };
  let bestLen = 0, bestPos = Infinity, cands = null;
  for (const key in GKEY) {
    const i = t.indexOf(key);
    if (i < 0) continue;
    const L = key.length;
    if (L > bestLen || (L === bestLen && i < bestPos)) {
      bestLen = L; bestPos = i; cands = GKEY[key].slice();
    } else if (L === bestLen && i === bestPos) {
      for (const n of GKEY[key]) if (cands.indexOf(n) < 0) cands.push(n);
    }
  }
  if (!cands) return null;
  return guidePick(cands, t);
}

/* 消歧：按优先级串成链，任一步把候选收敛到 1 就停。
   ① 方位词（东/西/南/北）→ 以校园中心切一半；
   ② 邻接地标（「图书馆旁边的宿舍」）→ 取离那个地标最近的；
   ③ 都没有 → 取**离玩家最近**的，并在回复里把判据讲出来。宁可把判据说出来，
      也不装懂。 */
function guidePick(cands, t) {
  let list = [];
  for (const n of cands) for (const d of GDEST) if (d.name === n) list.push(d);
  if (!list.length) return null;
  const total = list.length;
  const cut = f => { const s = list.filter(f); if (s.length) list = s; };
  if (/东/.test(t)) cut(d => d.ax > WORLD_W / 2);
  if (/西/.test(t)) cut(d => d.ax < WORLD_W / 2);
  if (/南/.test(t)) cut(d => d.ay > WORLD_H / 2);
  if (/北/.test(t)) cut(d => d.ay < WORLD_H / 2);
  let why = "";
  for (const L of _landmarks) {
    if (t.indexOf(L.n) < 0) continue;
    list.sort((a, b) => ((a.ax - L.x) ** 2 + (a.ay - L.y) ** 2)
                      - ((b.ax - L.x) ** 2 + (b.ay - L.y) ** 2));
    why = "最靠近" + L.n + "的那一个";
    list = [list[0]];
    break;
  }
  if (list.length > 1) {
    list.sort((a, b) => ((a.ax - player.x) ** 2 + (a.ay - player.y) ** 2)
                      - ((b.ax - player.x) ** 2 + (b.ay - player.y) ** 2));
  }
  return { spot: list[0], dup: total, why: why };
}

/* --- 7.2.5 寻路：栅格 + Dijkstra ---
   为什么是 Dijkstra 而不是 A*：这张图上**没有真正的地形成本**（可走/不可走二值），
   启发式省下的展开量在这个规模上没意义，而手写二叉堆 + 惰性删除 + 启发式一致性
   是三个各能静默出错的地方。**桶队列 + Dijkstra 不会出错**：边权是整数（10/14），
   桶按 g 索引，永不溢出、无需比较器。实测一次校内寻路展开几千格，毫秒级 —— 而且
   只在玩家说地名时跑一次，不占每帧预算。 */
const PASSK = new Uint8Array(16);
PASSK[K.FREE] = PASSK[K.GRASS] = PASSK[K.TRACK] = 1;
PASSK[K.BBALL] = PASSK[K.TENNIS] = PASSK[K.PLAZA] = PASSK[K.ROAD] = 1;
PASSK[K.WATER] = 0;
/* ⚠️ 第三十八轮：`K.WATER` 从 1 改成 0 —— 用户「不能直接横穿明湖」。
   ⚠️ **这只挡小北**，玩家一个字没变：玩家走的是主循环的 `canWalk`/`blocked`，
      水面本来就没有碰撞盒；`lakeSubmerge` 那套淹没渲染照旧（`45_water.js:111-112`
      只读玩家状态）。第三十六轮之前那句「`K.WATER` 是**可走**的」说的是**玩家**，
      对本段这张私有白名单从来没有约束力。
   ⚠️ **绝不许顺手给湖加 `addSolid`** —— 那会挪 `solids` ⇒ 重掷全校园散射
      （`60_assemble.js` §6.6 地雷，唯一探针 `_propdiff.py`）。
   `K.BLD`(1) 与 `K.OUT`(7) 保持 0：楼体与围墙外是硬的。 */

/* 第三十八轮：5 块景观草坪的禁区位图（**只对小北生效**）。
   ⚠️ 为什么不能用 `CELLK[i] === K.GRASS` 一刀切：`20_ground.js:297 classifyFree()`
      会把「离任何非留白格超过 `ROADBAND`(≈25px) 的留白格」**也**标成 `K.GRASS` ——
      那是全校园的开阔地，正是教学楼之间唯一的通道。一刀切会把半个校园变成禁区。
   ⚠️ 也没法从 `CELLK` 里反查：自动草地与这 5 块设计草坪在 `CELLK` 里是**同一个值 2**，
      没有任何差别信息残留（`classifyFree` 的 `if (CELLK[i] !== K.FREE) continue`
      会把它们整块跳过、值原样保留）⇒ 只能回到 `CAMPUS` 表里那 5 行**显式** `"grass"`。
   ⚠️ 格范围必须与 `20_ground.js:255 stampRectAbs()` **逐字同款**（同样的 `floor`、
      同样的闭区间），否则会有半格错位。 */
const NOGO = new Uint8Array(NW * NH);
(function markLawnNoGo() {
  for (const e of CAMPUS) {
    if (e[1] !== "grass") continue;
    const R = zoneRect(e);
    const c0 = Math.max(0, Math.floor(R.x / CELL)), c1 = Math.min(NW - 1, Math.floor((R.x + R.w) / CELL));
    const r0 = Math.max(0, Math.floor(R.y / CELL)), r1 = Math.min(NH - 1, Math.floor((R.y + R.h) / CELL));
    for (let cy = r0; cy <= r1; cy++)
      for (let cx = c0; cx <= c1; cx++) NOGO[cy * NW + cx] = 1;
  }
})();

const CELLWALK = new Uint8Array(NW * NH);
const G_G    = new Int32Array(NW * NH);
const G_FROM = new Int32Array(NW * NH);
const G_DONE = new Uint8Array(NW * NH);
const G_BUCK = [];
let   G_MAXG = 0, _walkReady = false;
const G_STEP = [[1, 0, 10], [-1, 0, 10], [0, 1, 10], [0, -1, 10],
                [1, 1, 14], [1, -1, 14], [-1, 1, 14], [-1, -1, 14]];

/* ⚠️ 惰性烘焙：6 万格 × 300 多个 AABB 是一千多万次比较（几十到一百多毫秒），
   放在加载期会拖慢首屏；放在第一次寻路时用户基本无感（他已经在等带路了）。
   探针里要提前烘，就先调一次 `ensureWalkGrid()`。
   ⚠️ `blocked` 是主循环段里的**函数声明** —— 同一个 <script> 里函数声明会提升，
      所以本段（排在 loop 段之前）在加载期调它是合法的；`solids` 是 60 段的 const，
      那时也已经初始化完毕。 */
function ensureWalkGrid() {
  if (_walkReady) return;
  for (let gy = 0; gy < NH; gy++) for (let gx = 0; gx < NW; gx++) {
    const i = gy * NW + gx;
    if (!PASSK[CELLK[i]]) continue;
    if (NOGO[i]) continue;                               // 第三十八轮：5 块景观草坪不给她走
    const x = gx * CELL + 8, y = gy * CELL + 8;          // 格心
    if (canWalk(x, y) && !blocked(x, y)) CELLWALK[i] = 1;
  }
  _walkReady = true;
}

/* 世界点 → 最近的可走格（返回格下标，找不到 -1）。
   ⚠️ 终点回退是**常规路径**而不是异常：用户的意图是"走到第五教学楼"，
      而楼本身占地那几格天然不可走 —— 每一栋楼都会走这条回退。半径 20 格 = 320px。
   ⚠️ 第三十八轮把半径从 14 放宽到 20：禁区变大了（5 块草坪 + 明湖），
      你站在图书馆东侧那块草坪（516px 宽）或湖心按 E 叫她时，14 格可能够不到岸
      ⇒ `guidePath` 返回 null ⇒ 她只会说「我这边过不去」。
   ⚠️ 放宽是安全的：下面的循环**取最近的那一环就 break**，
      所以只在"附近真的没有可走格"时才起作用，已有结果一个都不会变远。
   ⚠️ 打分加**北侧罚分**：这个校园是固定 3/4 视角、入口一律朝南，
      绕到楼的北墙根去"到站"是明显的错。400 = 20 世界像素的等效距离 ——
      大到能推翻同环内的微小距离差，小到不会把"多走 3 格但正确在南边"踢掉。 */
function guideSnap(px, py, maxR) {
  const gx0 = clamp(Math.floor(px / CELL), 0, NW - 1);
  const gy0 = clamp(Math.floor(py / CELL), 0, NH - 1);
  if (CELLWALK[gy0 * NW + gx0]) return gy0 * NW + gx0;
  let best = -1, bs = Infinity;
  maxR = maxR || 20;
  for (let r = 1; r <= maxR; r++) {
    for (let gy = gy0 - r; gy <= gy0 + r; gy++) {
      if (gy < 0 || gy >= NH) continue;
      const edge = (gy === gy0 - r || gy === gy0 + r);
      const step = edge ? 1 : 2 * r;                     // 非上下边只扫两端 ⇒ 只走最外环
      for (let gx = gx0 - r; gx <= gx0 + r; gx += step) {
        if (gx < 0 || gx >= NW) continue;
        const i = gy * NW + gx;
        if (!CELLWALK[i]) continue;
        const dx = gx * CELL + 8 - px, dy = gy * CELL + 8 - py;
        const sc = dx * dx + dy * dy + (dy < 0 ? 400 : 0);
        if (sc < bs) { bs = sc; best = i; }
      }
    }
    if (best >= 0) break;                                // 只取最近的那一环
  }
  return best;
}

/* 视线检测（string pulling 用）：在 CELLWALK 上走 Bresenham。
   ⚠️ 这一层**必须用栅格**而不是 canWalk/blocked：拉直要对每一对候选点做 LOS，
      最坏 ~5n 次判定 × 每次约 19 格 —— 格子级是几万次数组读（0ms），
      像素级是几万 × 300 个 AABB（上百 ms）。 */
function guideLOS(x0, y0, x1, y1) {
  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  for (;;) {
    if (x0 < 0 || y0 < 0 || x0 >= NW || y0 >= NH) return false;
    if (!CELLWALK[y0 * NW + x0]) return false;
    if (x0 === x1 && y0 === y1) return true;
    const e2 = err << 1;
    let mx = 0, my = 0;
    if (e2 > -dy) { err -= dy; x0 += sx; mx = 1; }
    if (e2 <  dx) { err += dx; y0 += sy; my = 1; }
    /* 与 A* 同款的「不许切角」：斜跨时两个正交邻格也得可走，
       否则拉出来的直线会从两栋楼的斜缝里穿过去 —— 格子上通，人过不去。 */
    if (mx && my && (!CELLWALK[(y0 - sy) * NW + x0] || !CELLWALK[y0 * NW + (x0 - sx)])) return false;
  }
}

/* 返回世界坐标路点数组；null = 无解；[] = 已经在终点。 */
function guidePath(sx, sy, tx, ty) {
  ensureWalkGrid();
  const S = guideSnap(sx, sy, 20), T = guideSnap(tx, ty, 20);
  if (S < 0 || T < 0) return null;
  if (S === T) return [];

  G_G.fill(-1); G_DONE.fill(0);
  for (let g = 0; g <= G_MAXG; g++) if (G_BUCK[g]) G_BUCK[g].length = 0;   // 只清用过的桶
  G_MAXG = 0;
  G_G[S] = 0; G_FROM[S] = -1;
  G_BUCK[0] = [S];

  let hit = false;
  for (let g = 0; g <= G_MAXG && !hit; g++) {
    const b = G_BUCK[g];
    if (!b) continue;
    for (let bi = 0; bi < b.length; bi++) {
      const i = b[bi];
      if (G_DONE[i] || G_G[i] !== g) continue;           // 惰性删除：同一格可能入桶多次
      G_DONE[i] = 1;
      if (i === T) { hit = true; break; }
      const cx = i % NW, cy = (i / NW) | 0;
      for (let k = 0; k < 8; k++) {
        const nx = cx + G_STEP[k][0], ny = cy + G_STEP[k][1];
        if (nx < 0 || ny < 0 || nx >= NW || ny >= NH) continue;
        const j = ny * NW + nx;
        if (!CELLWALK[j] || G_DONE[j]) continue;
        if (k >= 4 && (!CELLWALK[cy * NW + nx] || !CELLWALK[ny * NW + cx])) continue;  // 不许切角
        const ng = g + G_STEP[k][2];
        if (G_G[j] < 0 || ng < G_G[j]) {
          G_G[j] = ng; G_FROM[j] = i;
          if (!G_BUCK[ng]) G_BUCK[ng] = [];
          G_BUCK[ng].push(j);
          if (ng > G_MAXG) G_MAXG = ng;
        }
      }
    }
  }
  if (!hit) return null;

  const raw = [];
  for (let i = T; i >= 0; i = G_FROM[i]) raw.push([i % NW, (i / NW) | 0]);
  raw.reverse();
  /* ① 合并共线点 —— O(n)，先把点数砍下来 */
  const col = [raw[0]];
  for (let i = 1; i < raw.length - 1; i++) {
    const a = col[col.length - 1], b = raw[i], c = raw[i + 1];
    if ((b[0] - a[0]) * (c[1] - b[1]) !== (b[1] - a[1]) * (c[0] - b[0])) col.push(b);
  }
  if (raw.length > 1) col.push(raw[raw.length - 1]);
  /* ② 视线拉直：能直达就把中间点全跳掉。几十个点通常压到 3~6 段。 */
  const out = [col[0]];
  let i = 0;
  while (i < col.length - 1) {
    let j = col.length - 1;
    for (; j > i + 1; j--) if (guideLOS(col[i][0], col[i][1], col[j][0], col[j][1])) break;
    out.push(col[j]); i = j;
  }
  return out.map(c => [c[0] * CELL + 8, c[1] * CELL + 8]);
}

/* --- 7.2.6 她自己走路（2026-09-30 第三十六轮重写） ---
   三件事，顺序就是调用顺序：走一步 → 沿路点表推进 → 带路的滞回。

   ⚠️⚠️ 移动谓词与 `ensureWalkGrid()` 烘格子那一行**逐字相同**：
          if (canWalk(x, y) && !blocked(x, y)) CELLWALK[i] = 1;
        写成同一对，路径上每一格她**必然**走得通。换成 `ptBlocked`（hw=7/hh=5）
        就宽了 1px —— 那是第三十五轮在**规划**侧踩过的坑（见文件头 (2)），
        在**移动**侧踩的后果更难看：她会沿路磨墙，磨到永远到不了。

   ⚠️ 步态照抄玩家那两行（主循环里）：
          走：step = Math.floor(walk / WALK_STRIDE * WALK_FRAMES) & (WALK_FRAMES - 1)
          停：step = IDLE_BASE + (((idle * IDLE_HZ) | 0) & (IDLE_FRAMES - 1))
        所以她也正常抬腿、正常呼吸，节拍与玩家天然同步。
        `walk` 累加的是**实际位移** ⇒ 顶墙那几帧位移是 0 ⇒ 脚立刻停，不空踏。 */
function guideWalkToward(tx, ty, dt) {
  const dx = tx - GUIDE.x, dy = ty - GUIDE.y;
  const d = Math.hypot(dx, dy);
  if (d < 0.6) return false;                      // 已经站在目标点上
  const ux = dx / d, uy = dy / d;
  const s = (player.speed || 94) * dt;
  const nx = GUIDE.x + ux * s, ny = GUIDE.y + uy * s;
  let moved = 0;
  if (!blocked(nx, GUIDE.y) && canWalk(nx, GUIDE.y)) { moved += Math.abs(nx - GUIDE.x); GUIDE.x = nx; }
  if (!blocked(GUIDE.x, ny) && canWalk(GUIDE.x, ny)) { moved += Math.abs(ny - GUIDE.y); GUIDE.y = ny; }
  /* 朝向走**移动方向**（复用补丁 14 的判据：斜向取侧视）。
     ⚠️ 用 ux/uy 而不是 moved 之后的实际位移 —— 贴墙滑的时候实际位移会缩成单轴，
        用它的话她会一路扭头盯着墙看。 */
  if (Math.abs(ux) >= Math.abs(uy)) GUIDE.dir = ux < 0 ? "left" : "right";
  else GUIDE.dir = uy < 0 ? "up" : "down";
  if (moved > 0.01) {
    GUIDE.walk += moved; GUIDE.idle = 0;
    GUIDE.step = Math.floor(GUIDE.walk / WALK_STRIDE * WALK_FRAMES) & (WALK_FRAMES - 1);
    return true;
  }
  return false;                                   // 本帧一步没挪动 ⇒ 交给调用方计卡死
}

/* 站住：待机呼吸两帧，与玩家同一个 IDLE_HZ / IDLE_FRAMES。 */
function guideStand(dt) {
  GUIDE.idle += dt;
  GUIDE.step = IDLE_BASE + (((GUIDE.idle * IDLE_HZ) | 0) & (IDLE_FRAMES - 1));
}

/* 沿 `GUIDE.path` 从 `GUIDE.wi` 往前走。返回 "run" | "done" | "stuck"。
   ⚠️ `GUIDE.wi` 单调前进、不回头 —— 路点已经被 `guidePath` 拉直过，
      回头只会在"冲过一点点"时来回抖（第三十五轮那条投影判据就是为这个写的，
      现在她 1.57px/帧，14px 的半径根本冲不过去，那条判据可以省了）。 */
function guideFollow(dt) {
  const P = GUIDE.path;
  if (!P || !P.length) return "done";
  while (GUIDE.wi < P.length) {
    const R2 = (GUIDE.wi === P.length - 1) ? GUIDE_END_R2 : GUIDE_WP_R2;
    const w = P[GUIDE.wi];
    if ((w[0] - GUIDE.x) ** 2 + (w[1] - GUIDE.y) ** 2 >= R2) break;
    GUIDE.wi++;
  }
  if (GUIDE.wi >= P.length) return "done";
  const ok = guideWalkToward(P[GUIDE.wi][0], P[GUIDE.wi][1], dt);
  GUIDE.stuck = ok ? 0 : GUIDE.stuck + dt;
  return GUIDE.stuck > GUIDE_STUCK_T ? "stuck" : "run";
}

/* 带路的一帧：先判要不要停下等你，再决定走不走。
   滞回两条阈值不能合成一条 —— 合成一条的话，她会在阈值上每帧开开关关地抖。 */
function guideLeadStep(dt) {
  const dp = Math.hypot(player.x - GUIDE.x, player.y - GUIDE.y);
  if (GUIDE.hold === 2) {                              // 到站了，在原地等你跟上
    if (dp <= LEAD_END) { GUIDE.hold = 0; return "done"; }
    return "hold";
  }
  if (GUIDE.hold === 1) {
    if (dp < LEAD_MIN) GUIDE.hold = 0;                 // 你追回来了 ⇒ 继续走
    else return "hold";
  } else if (dp > LEAD_MAX) {
    GUIDE.hold = 1;                                    // 拉开了 ⇒ 停下等
    return "hold";
  }
  const r = guideFollow(dt);
  if (r !== "done") return r;
  /* 路走完了，但你还在后头 —— 站住等你，别一个人冲到楼门口把面板弹了 */
  if (dp > LEAD_END) { GUIDE.hold = 2; return "hold"; }
  return "done";
}

/* 卡住时原地重算一次。目标按当前状态取：come → 你；lead → 目的地；back → 南门。
   返回 true = 新路径已装好，下一帧接着走。
   ⚠️ 第三十八轮：守卫从三处调用点**搬进函数里**。
      原来调用点写的是「`GUIDE.retried` 短路或本函数」——
      `GUIDE.retried` 已经是 true 时 `||` **短路**，本函数压根不被调用，
      `!true` 又是 false ⇒ **else-if 整块跳过**，既不重算也不兜底
      ⇒ "回家"路上第二次卡住 = **永远停在半路**。
      这正是用户报的「按了 Esc 但没回到南门」的第二种现场。
      搬进来之后语义不变（"本段只重算一次"），只是**不再短路掉调用方的兜底**。
      三处调用点（come / lead / back）现在一律写成 `!guideReplan()`。
   ⚠️ `build.py` §7 里有一条 `== 0` 的反向断言盯着它（那句短路不许回来）。 */
function guideReplan() {
  if (GUIDE.retried) return false;
  GUIDE.retried = true;
  let tx = GUIDE_HOME.x, ty = GUIDE_HOME.y;
  if (GUIDE.mode === "come") { tx = player.x; ty = player.y; }
  else if (GUIDE.mode === "lead" && GUIDE.spot) { tx = GUIDE.spot.ax; ty = GUIDE.spot.ay; }
  const p = guidePath(GUIDE.x, GUIDE.y, tx, ty);
  if (p === null || !p.length) return false;
  GUIDE.path = p; GUIDE.wi = 0; GUIDE.stuck = 0;
  return true;
}

/* --- 7.2.7 启程 / 到站 / 中止 / 回家 / 呼唤 --- */

function guideStart(spot, name) {
  /* ⚠️ 路径起点是**她**，不是玩家（第三十六轮改）。她走在前面带路，
      "谁走这条路"这个问题的答案现在很明确。
      算不出路时退回你自己的位置再试一次：极少数情况下她站的那个角落通不到目的地，
      而你站的这一头通 —— 那时也得能带你走。 */
  let path = guidePath(GUIDE.x, GUIDE.y, spot.ax, spot.ay);
  if (path === null) path = guidePath(player.x, player.y, spot.ax, spot.ay);
  if (path === null) {
    guideSay("这条路我算不出来（" + name + " 附近没有可走的路），你走近一点再问我。");
    return;
  }
  if (path.length === 0) { guideSay("你已经站在" + name + "了。"); return; }
  GUIDE.path = path; GUIDE.wi = 0; GUIDE.mode = "lead";
  GUIDE.dest = name; GUIDE.spot = spot;
  GUIDE.hold = 0; GUIDE.stuck = 0; GUIDE.retried = false; GUIDE.walk = 0;
  guideClose();                        // 收起来才走得动（键盘焦点还给人物）
}
function guideArrive() {
  const name = GUIDE.dest;
  GUIDE.mode = "arrived"; GUIDE.hold = 0;
  GUIDE.path = null; GUIDE.wi = 0; GUIDE.stuck = 0;
  guideOpenPanel("到了，这就是" + name + "。还要去哪儿？");
}
/* 中止带路。⚠️ 只是"不带了"，人**走**回南门，不是瞬移 ——
   用户 2026-09-30 明确要「向导自己走回南门」，看得见她一路回去才算数。 */
function guideAbort(msg) {
  /* ⚠️ 第三十八轮补：中止 = 这次带路作废 ⇒ 连"还没启程"的那次也一起作废。
     不补的话，回复期的 1.1 秒里按 Esc 会把她送回家，1.1 秒后 `guideTick`
     又照旧把她送出门 —— 人已经在半路，原地来回。 */
  GUIDE.delay = 0; GUIDE.lastAsk = null;
  GUIDE.path = null; GUIDE.wi = 0; GUIDE.hold = 0; GUIDE.stuck = 0;
  if (msg) guideToast(msg);
  guideGoHome();
}
/* 回家。⚠️ 只有走完全程（或压根没有路）才把位置**吸附**到 GUIDE_HOME ——
   那一点是 guidePlace 验过的可走点，吸附不会把她塞进墙里。 */
function guideGoHome() {
  const p = guidePath(GUIDE.x, GUIDE.y, GUIDE_HOME.x, GUIDE_HOME.y);
  GUIDE.hold = 0; GUIDE.stuck = 0; GUIDE.retried = false;
  GUIDE.path = p; GUIDE.wi = 0;
  GUIDE.mode = (p && p.length) ? "back" : "home";
  if (GUIDE.mode === "home") { GUIDE.x = GUIDE_HOME.x; GUIDE.y = GUIDE_HOME.y; }
}
/* 按 E：她离得远就从那边走过来找你，离得近就当场开面板。
   ⚠️ 第三十六轮之前只有走后半条，所以"她在南门、你在北门"时按 E 毫无反应 ——
      用户要的是**随时随地**都能叫她。 */
function guideCall() {
  const d = Math.hypot(player.x - GUIDE.x, player.y - GUIDE.y);
  if (d * d < GUIDE_NEAR2) {                    // 就在旁边：与第三十五轮同款
    GUIDE.mode = "here";
    guideOpenPanel("你好，我是小北。想去哪儿？说个地方，我带你过去。");
    return;
  }
  const p = guidePath(GUIDE.x, GUIDE.y, player.x, player.y);
  if (p === null) { guideToast("我这边过不去，你走两步再叫我。"); return; }
  GUIDE.path = p; GUIDE.wi = 0; GUIDE.mode = "come";
  GUIDE.hold = 0; GUIDE.stuck = 0; GUIDE.retried = false; GUIDE.walk = 0;
  GUIDE.comeT = 0; GUIDE.comeX = player.x; GUIDE.comeY = player.y;
  if (GUIDE.open) guideClose();
}

/* --- 7.2.8 高亮路线：**已删除**（2026-09-30 第三十六轮）---
   ⚠️ 这里原本有一个函数：带路时沿路径画一条黄色流动虚线，由补丁 16 挂在
      `drawWater` 之后。用户明确要求「导航过程中不要显示引导线，自然一些」——
      她本人走在前面，比一条线自然得多。
      补丁 16 已同步删除；`build.py` §7 断言块里留了一条 `== 0` 的反向断言，
      防的是"哪天又被谁顺手加回来"。
   ⚠️ 连带作废的还有 `GUIDE.dash`（虚线流动相位）与 `GUIDE.lx/ly`（线的起点）。
      **不要复活它们。** */

/* --- 7.2.8 对话框 ---
   ⚠️ 这些 DOM 引用在 72 段顶层求值 —— `<div id="dlg">` 必须写在 `<body>` 里、
      且在 `<script>` 之前（00_head.html 里 #hud / #zoom 那一排的末尾）。 */
const guideDlg   = document.getElementById("dlg");
const guideIn    = document.getElementById("dlgIn");
const guideLog   = document.getElementById("dlgLog");
const guideQuick = document.getElementById("dlgQuick");
const guideGo    = document.getElementById("dlgGo");
const guideTip   = document.getElementById("tip");
const guideToastEl = document.getElementById("toast");
let   _toastT = 0;

/* 「她正在想」的指示（第三十九轮）：只改"带我去"那颗按钮的字。
   ⚠️ **不锁输入框、不锁面板** —— 等模型的这一两秒里你还应该能继续打字、按 Esc 退出。
      锁了输入框会出现"卡住不动"的错觉，比不做指示更糟。 */
function guideBusy(on) {
  GUIDE.busy = !!on;
  if (guideGo) { guideGo.disabled = !!on; guideGo.textContent = on ? "想想…" : "带我去"; }
}

function guideTyping() { return GUIDE.open && document.activeElement === guideIn; }

function guideOpenPanel(text) {
  if (!guideDlg) return;
  GUIDE.open = true; GUIDE.near = false;
  if (guideTip) guideTip.hidden = true;
  for (const k in keys) keys[k] = 0;                   // 不许有"卡住的按键"把人推着走
  if (text) guideSay(text);
  guideDlg.hidden = false;
  if (guideIn) guideIn.focus();
}
function guideClose() {
  GUIDE.open = false;
  if (guideDlg) guideDlg.hidden = true;
  for (const k in keys) keys[k] = 0;
  if (guideIn) { guideIn.value = ""; guideIn.blur(); } // ⚠️ 不 blur 的话下次按键还会被输入框吸走
}

/* 「退出对话」这个**动作**（第三十八轮抽出）。
   ⚠️ 三处共用：页面里的 Esc、**输入框里**的 Esc、点面板外的暗底。
      用户的口径是**动作**，不是「按了哪个键」—— 同一个动作用同一个函数，才不会又漏一处。
   ⚠️ 这里必须清 `delay` / `lastAsk`：`guideAsk()` 说完话会摆 1.1 秒才启程
      （`:610-611` 设、`guideTick` 里到点启程），而 `guideClose()` **故意不清**它们
      （方向键关面板要保住那次目的地，探针 P4 盯着）。
      于是**回复期那 1.1 秒里按 Esc，只关了面板，那趟带路照旧启程** —— 她永远不回家。
      这就是用户报的「有时候按 Esc 没回到南门」最可能的那一次。
   ⚠️ 方向键关面板**不许**走这里 —— 那是"我边走边听"，那次目的地不能丢。 */
function guideExitDialog() {
  GUIDE.delay = 0; GUIDE.lastAsk = null;              // 作废那次还没启程的带路
  GUIDE.think++;                                      // 顺带作废"正在想问大模型"的那一次
  guideBusy(false);
  guideClose();
  if (GUIDE.mode === "arrived") guideAbort(null);     // 到站后退出 = 她自己走回南门
}
function guideToast(t) {
  if (!guideToastEl) return;
  guideToastEl.textContent = t;
  guideToastEl.hidden = false;
  _toastT = 2.6;
}
function guideLogPush(who, t) {
  if (!guideLog) return;
  const d = document.createElement("div");
  const b = document.createElement("b");
  b.textContent = (who === "小北" ? "小北：" : "你：");
  b.style.color = who === "小北" ? "#ffd76e" : "#9fb4d0";
  d.appendChild(b);
  d.appendChild(document.createTextNode(t));
  guideLog.appendChild(d);
  while (guideLog.childNodes.length > 6) guideLog.removeChild(guideLog.firstChild);
  guideLog.scrollTop = guideLog.scrollHeight;
}
function guideSay(t) { guideLogPush("小北", t); }

/* 唯一的说话入口：按钮点击、输入框回车都走这里。
   --- 第三十九轮：三层判读 ---
   ① **字面地名**（`guideResolve`）—— 永远最优先。用户打了「五教」，任何联想都不许
      把它抢走；`guideResolve` 本身就是最长匹配，比 `LINK` 稳。
   ② **本地「知识联系」表**（`linkResolve`，在 74_llm.js）—— 「我想去吃饭」这类
      活动/目的。离线可用、零延迟、确定性。
   ③ **大模型**（`guideThink` → `llmAsk`）—— 前两层都没接住时才发出去，异步。
   ⚠️ 顺序不能反：模型又慢又花钱，还可能把已经匹配上的字面地名带偏。 */
function guideAsk(text) {
  const raw = (text || "").trim();
  if (!raw) { guideSay("说个地名吧 —— 比如「五教」「图书馆」「一食堂」。"); return; }
  guideLogPush("你", raw);

  /* ① 字面地名 */
  const m = guideResolve(raw);
  if (m && m.grass) { guideSay("校园里有 5 块草坪，不带你专门跑一趟 —— 你脚下可能就站着一块。"); return; }
  if (m) { guideOffer(m, raw, ""); return; }

  /* ② 本地活动 → 地点关联表 */
  const t = guideStrip(raw);
  const lk = linkResolve(t);
  if (lk) { guideOffer(guidePick(lk.names, t), raw, "我猜你是想" + lk.why + "。"); return; }

  /* ③ 交给她"想一下"（异步，见 §7.4） */
  guideThink(raw);
}

/* 把一次"问到的目的地"落成回复 + 启程。
   `lead` = 前面那句解释（本地表 / 大模型给的判据），字面地名时不加。
   ⚠️ 第三十九轮从 `guideAsk` 尾部原样抽出来的 —— 三条判读路径**共用同一句回复、
   同一个 1.1 秒启程**，不然"她怎么回应"会有三套写法，迟早对不上。 */
function guideOffer(pr, raw, lead) {
  if (!pr || !pr.spot) {
    guideSay("没听清「" + raw + "」。试试：五教 / 九教 / 图书馆 / 逸夫楼 / 一食堂 / 16号楼，"
           + "或者说「我想吃饭」「我要打羽毛球」这种，也可以点下面的按钮。");
    return;
  }
  const spot = pr.spot;
  /* 距离说人话。1 世界像素 ≈ 0.1111 m（10_const.js:6 的标尺：思源楼 450px = 50m），
     步行按 75 m/min 估。 */
  const dist = Math.hypot(spot.ax - player.x, spot.ay - player.y) * 0.1111;
  const how = dist < 60 ? "就在旁边，走两步就到"
            : dist < 220 ? "走过去两分钟"
            : "大概 " + Math.max(2, Math.round(dist / 75)) + " 分钟";
  const dupNote = pr.dup > 1
    ? "（这名字校园里有 " + pr.dup + " 处" + (pr.why ? "，我带你走" + pr.why : "，我带你走离你最近的那个") + "）"
    : "";
  guideSay(lead + "好，去" + spot.name + "。" + how + "。" + dupNote);
  GUIDE.spot = spot; GUIDE.dest = spot.name;
  GUIDE.lastAsk = { spot: spot, name: spot.name };
  GUIDE.delay = 1.1;                 // 回复摆 1.1 秒再启程（帧计时，不用 setTimeout）
}

/* 前两层都没接住 ⇒ 问一次大模型（`74_llm.js` 的 `llmAsk`）。
   ⚠️ 四条不许省的护栏：
      ① `GUIDE.think` 是**作废计数** —— 等模型的这一两秒里你又问了一句，
         旧回答回来时必须丢掉，否则面板上会突然冒出一句答非所问；
      ② 回来时先看面板还开着没 —— 你可能已经把对话关了；
      ③ 模型给的名字要过 `guidePick`（它拿 `GDEST` 核对），编出来的名字在这里被挡掉；
      ④ `guideBusy` 只动"带我去"那颗按钮的字，不锁输入框 —— 打字框锁了最烦人。 */
function guideThink(raw) {
  const seq = ++GUIDE.think;
  guideSay("……嗯，我想想。");
  guideBusy(true);
  llmAsk(raw, function (name, why) {
    if (seq !== GUIDE.think) return;               // ① 这期间你又问了别的
    guideBusy(false);
    if (!guideDlg || guideDlg.hidden) return;      // ② 这期间你把面板关了
    if (!name && why === "no-key") {
      /* 还没拿到 key（也没网/被拦了就另说）—— 问一次，贴好了当场重问 */
      guideSay("这句话我得动动脑子，可还没拿到大模型的钥匙。");
      if (llmKeyAsk()) guideThink(raw);
      return;
    }
    if (!name) {
      guideSay("这个我没听明白。说个地名（五教 / 图书馆 / 一食堂），或者说你想干什么"
             + "（「我想吃饭」「我要打羽毛球」），都行。");
      return;
    }
    const t = guideStrip(raw);
    const pr = guidePick([name], t);
    if (!pr || !pr.spot) {                         // ③ 模型编的 / 不在图上
      guideSay("我想到的是「" + name + "」，可图上找不到这个地方。");
      return;
    }
    guideOffer(pr, raw, "我猜你说的「" + raw + "」是想去" + name + (why ? "（" + why + "）" : "") + "。");
  });
}

(function guideWireUI() {
  if (guideQuick) for (const n of GPICKS) {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = n;
    b.addEventListener("click", () => { guideAsk(n); if (guideIn) guideIn.focus(); });
    guideQuick.appendChild(b);
  }
  /* ⚠️ 输入框自己掐断冒泡（与补丁 7 给 #zrng 写的那段同款手法）：
     不掐的话 w/a/s/d 会冒到 window 去推人物、0/1/+/- 会去调缩放。
     ⚠️ 中文输入法：组字过程中的 keydown 带 isComposing / keyCode 229，
        这时回车是"选字"不是"提交"，必须放行给 IME，否则打「wujiao」选字时会当场提交。 */
  if (guideIn) guideIn.addEventListener("keydown", e => {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter")  { e.preventDefault(); e.stopPropagation(); const v = guideIn.value; guideIn.value = ""; guideAsk(v); return; }
    /* ⚠️ 第三十八轮：Esc 走 `guideExitDialog()`（不只是 `guideClose()`）——
       焦点还在输入框里的那次按 Esc 是最容易漏的：它 `stopPropagation` 之后
       连 window 那条都到不了，只有这里补上才算数。 */
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); guideExitDialog(); return; }
    e.stopPropagation();
  });
  if (guideGo) guideGo.addEventListener("click", () => {
    const v = guideIn ? guideIn.value : "";
    if (guideIn) guideIn.value = "";
    guideAsk(v);
  });
  /* 点面板外的暗底 = 关掉。⚠️ 与 Esc 同一条规矩：到站后关掉 = 你退出了对话 ⇒
     她自己走回南门。用户要的是「退出对话」这个**动作**，不是「按了哪个键」。 */
  if (guideDlg) guideDlg.addEventListener("click", e => {
    if (e.target !== guideDlg) return;
    guideExitDialog();                 // 与两处 Esc 同一个动作（第三十八轮统一）
  });
})();

/* ⚠️ **注册时机很要紧**：本段在 chunks 里排在 loop 段**之前** ⇒ 这个监听比
   Demo:1262 的 WATCHED 监听、比补丁 7 的缩放监听**都早注册**。window 上同 target
   的监听按注册顺序触发，所以这里的 `stopImmediatePropagation()` 能把它们一起挡掉 ——
   这就是"打字不会推着人物走"的全部实现（否则打「宿舍 su she」「五教 wu jiao」
   里的 s/w 会被主循环 preventDefault + 推人物）。 */
window.addEventListener("keydown", e => {
  if (e.isComposing || e.keyCode === 229) return;
  if (GUIDE.open) {
    if (e.key === "Escape") {
      guideExitDialog(); e.preventDefault(); e.stopImmediatePropagation();
      /* 到站后那句「还要去哪儿？」被 Esc 关掉 = 你退出了对话 ⇒ 她自己走回南门
         （用户 2026-09-30 逐字要求）。其它场合（她在南门答你、被你叫过来答你）
         关掉只是关掉，她留在原地，你随时可以再问。
         ⚠️ 第三十八轮：这里原本是 `guideClose()` + 单独一句 arrived 判断，
            回复期那 1.1 秒的洞就是这么漏的（`delay`/`lastAsk` 没清）。已收进函数。 */
      return;
    }
    /* ⚠️ 面板开着时按方向键仍要关面板放行 —— 面板一开，下面那句
          `stopImmediatePropagation()` 会把方向键全吞掉，玩家当场走不动。
       ⚠️ 但**不再**清 `GUIDE.lastAsk` / `GUIDE.delay`：那个"清"是给"带路中取消"
          用的，第三十六轮方向键已经不是取消键了，清掉只会让回复期里的目的地
          莫名丢失。探针 P4 会盯这一条。
       ⚠️ 故意不调 stopImmediatePropagation —— 让 Demo:1262 的 WATCHED 监听照常
          把这一下记进 `keys`，于是本帧玩家就接管了控制权。`guideClose()` 会先清空
          `keys`，但它在**本监听里**跑、早于 WATCHED 监听（本段注册更早），
          所以清完立刻又被写上正确的 1 —— 顺序正好。 */
    const _ck = (e.key || "").toLowerCase();
    if (_ck.indexOf("arrow") === 0) {
      /* ⚠️ 第三十八轮补 `arrived` 分支：到站后按方向键关面板，原来只关面板、**不 abort**
         ⇒ `GUIDE.mode` 永远停在 "arrived"，而面板已经关了 ⇒ 之后按 Esc 落到下面那句
         `mode === "lead"` 的判据 ⇒ **什么都不做** —— 她永远僵在终点，
         这正是用户报的「按 Esc 没回到南门」的第三种现场。
         ⚠️ 这与本段自己的注释（上面写着「到站后关掉 = 你退出了对话 ⇒ 她自己走回南门，
            用户要的是**动作**不是**按键**」）直接矛盾 ⇒ 是实现漏了一条分支，不是设计选择。
         ⚠️ 这里**不调** `guideExitDialog()` —— 那条会把回复期还没启程的目的地一并清掉，
            而方向键的语义正是"我边走边听"（探针 P4 盯着这条）。 */
      guideClose();
      if (GUIDE.mode === "arrived") guideAbort(null);
      return;
    }
    /* 其余按键（打字、点按钮、加减号……）一律不许去推人物 / 调缩放。
       ⚠️ 焦点在输入框里时，输入框自己的监听（target 阶段）**先于** window 的
          冒泡监听跑，所以 Enter 提交照样生效。 */
    e.stopImmediatePropagation();
    return;
  }
  /* 带路中按 Esc = 中止，她走回南门。
     ⚠️ 第三十六轮**换键**的原因：方向键现在是你"跟着她走"的键，同一个键不能既跟
        又取消。用户 2026-09-30 在三个候选里拍板选了 Esc。
     ⚠️ 第三十八轮把判据从 `lead` 扩到 `lead | come | arrived`：
        这三种状态都是"她在为你忙"，Esc 都该是「不带了 / 你走吧」。
        原来只认 `lead`，于是 `arrived` 时（面板已被方向键关掉）按 Esc 毫无反应，
        `come` 时（她正走过来找你）按 Esc 也停不下来。

     ⚠️⚠️ 第三十九轮订正 —— 用户：「第一下 esc 有效，**多加两下就不行了**」。
        旧写法的毛病不是"哪一处错了"，而是**它只管一瞬**：第 1 下把她从 `lead`
        踢进 `back`，之后 `mode` 就一直是 `back`，第 2 / 3 下**全落进空档**，
        从玩家那边看就是"按了没反应"。
        ⇒ 改成一张**梯子**：不管按第几下，手上一定有事发生。
           ① `lead|come|arrived` → 中止，她走回南门（第 1 下的正常路径）
           ② `back`             → 别走了，**直接到家**（省掉剩下的路）
           ③ `here`             → 她也回南门（她本来在待命，这一下就是"你走吧"）
           ④ `home`             → 她已经在家了，给一句口头确认，免得看着像坏了
        ⚠️ ④ 这句"我在南门呢"是**故意**加的：反馈本身就是这次修复的一半。
           没有它，玩家按到第 3 下还是会觉得"不行了"。 */
  if (e.key === "Escape") {
    if (GUIDE.mode === "lead" || GUIDE.mode === "come" || GUIDE.mode === "arrived") {
      guideAbort("好，那我不带了。");
    } else if (GUIDE.mode === "back") {
      GUIDE.x = GUIDE_HOME.x; GUIDE.y = GUIDE_HOME.y;      // 与 §7.2.7 走完全程后同款吸附
      GUIDE.mode = "home"; GUIDE.path = null; GUIDE.wi = 0;
      GUIDE.hold = 0; GUIDE.stuck = 0;
      guideToast("我自己回去啦。");
    } else if (GUIDE.mode === "here") {
      guideAbort("那我先回南门了。");
    } else {
      guideToast("我在南门呢，随叫随到。");
    }
    e.preventDefault(); e.stopImmediatePropagation(); return;
  }
  /* 随时随地按 E 都能叫她。⚠️ 第三十五轮这里是 `&& GUIDE.near` ——
     于是"她在南门、你在北门"时按 E 毫无反应，而用户要的正是**随时**能叫。 */
  if ((e.key === "e" || e.key === "E") && !e.repeat) {
    if (GUIDE.mode === "lead") return;   // 她就在你面前带队；想换地方先按 Esc
    guideCall();
    e.preventDefault(); e.stopImmediatePropagation();
  }
}, false);

/* --- 7.2.9 每帧心跳：由补丁 19 挂在 `animateDiaosu` 之后 ---
   ⚠️ `player` / `cam` / `keys` / `zoom` / `cv` 都声明在主循环段里，本段只是**定义**函数，
      运行期才求值 —— 与 `60_assemble.js:49` 的 `setZoom` 是同一条规矩。
   ⚠️ `accept.py` 会直接调几十万次 `update(1/60)`，所以本函数：
      ① 任何分支都不许抛（抛一次主循环就死，accept 会报成大面积失败）；
      ② 不活跃时立刻早退 + 只在状态**翻转**时写 DOM。 */
let _tipX = -1e9, _tipY = -1e9, _bubTxt = undefined;
function guideTick(dt) {
  /* 回复展示期：到点关面板启程 */
  if (GUIDE.delay > 0) {
    GUIDE.delay -= dt;
    if (GUIDE.delay <= 0) {
      GUIDE.delay = 0;
      if (GUIDE.lastAsk) guideStart(GUIDE.lastAsk.spot, GUIDE.lastAsk.name);
    }
  }
  if (_toastT > 0 && (_toastT -= dt) <= 0 && guideToastEl) guideToastEl.hidden = true;

  const gx0 = GUIDE.x, gy0 = GUIDE.y;

  /* ⚠️ 这里原本有一条「玩家跑远（>260px）就自动收起面板」。2026-09-30 删掉，
     因为端到端探针当场抓到它**唯一实际发生的场合是误伤**：
         `guideArrive()` 弹的那句「到了，这就是第五教学楼」—— 玩家走到终点时人已经在
         几百像素外，面板刚打开、下一帧就被这条规则关掉，**玩家一个字都看不见**
         （日志仍留在 DOM 里，所以只看 `textContent` 的探针会报"到了 ✅"，是假绿）。
     ⇒ 第三十六轮**不要复活同类规则**。到站后的面板就该一直亮着，直到你按 Esc ——
        那个 Esc 正是"她自己走回南门"的触发条件。 */

  /* ---- ① 按状态推进她自己 ---- */
  let arrived = false;
  if (GUIDE.mode === "come") {
    /* 你边走边等 ⇒ 她追的是**旧坐标**。你走远超过 120px 就重算一次，0.6 秒最多一次 ——
       不节流的话每帧一次寻路，桶队列再快也架不住。 */
    GUIDE.comeT += dt;
    if (GUIDE.comeT > 0.6) {
      GUIDE.comeT = 0;
      if (Math.hypot(player.x - GUIDE.comeX, player.y - GUIDE.comeY) > 120) guideCall();
    }
    const r = guideFollow(dt);
    const px = player.x - GUIDE.x, py = player.y - GUIDE.y;
    if (r === "done" || px * px + py * py < COME_NEAR2) {
      GUIDE.mode = "here"; GUIDE.path = null; GUIDE.wi = 0; GUIDE.stuck = 0;
      guideOpenPanel("我来了。想去哪儿？说个地方，我带你过去。");
    } else if (r === "stuck" && !guideReplan()) {
      GUIDE.mode = "here"; GUIDE.path = null;
      guideToast("我这边过不去，你走两步再叫我。");
    }
  } else if (GUIDE.mode === "lead") {
    const r = guideLeadStep(dt);
    if (r === "done") arrived = true;
    else if (r === "stuck" && !guideReplan()) {
      GUIDE.mode = "here"; GUIDE.path = null;
      guideToast("前面过不去，我先站在这儿。");
    }
  } else if (GUIDE.mode === "back") {
    const r = guideFollow(dt);
    if (r === "done") {
      GUIDE.x = GUIDE_HOME.x; GUIDE.y = GUIDE_HOME.y;
      GUIDE.mode = "home"; GUIDE.path = null; GUIDE.wi = 0;
    } else if (r === "stuck" && !guideReplan()) {
      /* 回家路上卡住不值得让玩家看 —— 她多半已经在画面外了，直接归位 */
      GUIDE.x = GUIDE_HOME.x; GUIDE.y = GUIDE_HOME.y;
      GUIDE.mode = "home"; GUIDE.path = null;
    }
  }

  /* 本帧有没有真的挪窝。⚠️ 用坐标比较而不是让 move 函数回传标志 ——
     `guideLeadStep` 里"停下等你"那条路径根本不调 move，标志会漏。 */
  const moved = (GUIDE.x !== gx0 || GUIDE.y !== gy0);
  if (!moved) guideStand(dt);

  /* ---- ② 气泡：只在**文案翻转**时写 DOM（站着不动时这个函数零 DOM 写）---- */
  const bub = guideBubbleOf();
  if (bub !== _bubTxt) {
    _bubTxt = bub;
    GUIDE.near = !!bub;
    if (guideTip) {
      if (bub) { guideTip.innerHTML = bub; guideTip.hidden = false; }
      else guideTip.hidden = true;
    }
  }
  if (bub) guideTipFollow();

  /* ---- ③ 站住时朝你（走路时朝向已由 guideWalkToward 写死成移动方向）---- */
  if (!moved) {
    const dx = player.x - GUIDE.x, dy = player.y - GUIDE.y;
    const d2 = dx * dx + dy * dy;
    GUIDE.dir = (d2 < 260 * 260)
      ? (Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down"))
      : "down";
  }

  if (arrived) guideArrive();
}

/* 头顶气泡文案。null = 不显示。
   ⚠️ `GUIDE.near` 的语义变了：它不再是"她在招呼半径内"，而是"她此刻有话要说"。
      按 E 的判据已经不靠它了（第三十六轮改成**随时随地**按 E 都叫她），
      它现在纯粹是气泡的开关，名字为了少改一处、保持原样。
   ⚠️ 带路正常推进时返回 null —— 用户要的"自然一些"，一半就落在这里：
      她不吭声，就是走在前面。 */
function guideBubbleOf() {
  if (GUIDE.open) return null;                        // 面板开着就不叠气泡
  if (GUIDE.mode === "lead") {
    if (GUIDE.hold === 1) return "跟上来呀～";
    if (GUIDE.hold === 2) return "到了，就是这儿";
    return null;
  }
  if (GUIDE.mode === "come") return "我来啦";
  if (GUIDE.mode === "back") return null;             // 回家路上不吭声
  /* home / here / arrived：原来那条"走近 2 格冒『按 E 说话』"。
     ⚠️ 这里保留 `<b>` 标记（`#tip` 的 CSS 有 `#tip b{color:#ffd76e}`），
        所以走 innerHTML；文案是写死的常量，不带任何外部输入。 */
  return (player.x - GUIDE.x) ** 2 + (player.y - GUIDE.y) ** 2 < GUIDE_NEAR2
    ? "<b>E</b> 说话" : null;
}

/* 气泡定位。⚠️ **不用 `getBoundingClientRect()`**（每帧读布局 = 强制重排）：
   `#wrap` 是 `fixed; inset:0` + flex 居中 ⇒ 画布左上角就是
   ((innerWidth − 画布CSS宽)/2, (innerHeight − 画布CSS高)/2)，纯算术可得。
   CSS 宽由 `resize()` 写成 `(VIEW_W * s) + "px"`，直接读回来就是那个整数倍 s。 */
function guideTipFollow() {
  if (!guideTip) return;
  const cssW = parseFloat(cv.style.width);
  if (!cssW) return;
  const cs = cssW / VIEW_W;
  const x = (window.innerWidth  - VIEW_W * cs) / 2 + (GUIDE.x - cam.x) * zoom * cs;
  const y = (window.innerHeight - VIEW_H * cs) / 2 + (GUIDE.y - CH_AY - cam.y) * zoom * cs;
  if (Math.abs(x - _tipX) < 1 && Math.abs(y - _tipY) < 1) return;   // 站着不动 ⇒ 零开销
  _tipX = x; _tipY = y;
  guideTip.style.left = x + "px";
  guideTip.style.top  = y + "px";
}
