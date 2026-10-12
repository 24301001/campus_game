/* =========================================================
   6. 场景装配
   ---------------------------------------------------------
   ⚠️ solids / props 必须**先声明**再烘焙地面 —— 4.6 的围墙会把碰撞盒
      直接推进 solids，而 buildGround() 里就调 paintWalls()。
   ========================================================= */
const solids = [];                           // 碰撞盒（世界坐标 AABB）
const props  = [];                           // 可绘制物，最终按 baseY 排序

/* 第三十七轮：**建筑画布登记表**，给「走到楼后边楼虚化」用（parts/73_occl.js）。
   ⚠️ 为什么必须是**独立的表**、而不是往 props 的元素上挂记号：
      ① addProp 是按白名单复制的（只取 img/ax/ay/x/y/baseY/tag），挂在建筑对象上的
         记号会在那一刻被丢掉 —— 与上面 §6.2 里 `b.__dx` 那个死胡同是同一个坑；
      ② `_propdiff.py` 逐条 dump `tag`，给建筑加 tag 会让它报满屏"全变了"，
         而它是"散射被重掷"的**唯一**探针，不能污染；
      ③ 建筑不能按 tag 认（大建筑里只有"老体育馆"带 tag），也不能按宽高认
         （图书馆精灵宽 401，与 18 宿舍楼**同宽**，§6.4 那条注释已实录）。
   键取 **canvas 对象**：建筑精灵的 `img` **永不替换**（会换 img 的只有鸭子 / 旗帜 /
   喷泉三件小道具，都不是建筑），而且各 `clear*` 重建 props 时搬回的是**同一个对象
   引用** —— 所以这张表整个运行期都有效。
   ⚠️ 角色画布**永远不许**进这张表：绘制循环里 `drawSwimRing` 紧跟角色那一笔，
      角色项一旦 alpha < 1，水线涟漪会被一起调暗。 */
var BLD_IMGS = new Set();

/* `tag` 透传（可选）：目前只有树带 `"tree"`，供离线探针 props_probe.py 区分
   「树」与「路灯」—— 路灯 32×84 也是细高精灵，按尺寸判会误判。 */
function addProp(s)                      { props.push({ img: s.canvas, ax: s.ax, ay: s.ay, x: s.x, y: s.y, baseY: s.y, tag: s.tag }); }
function addSolid(cx, by, w, d)          { solids.push({ x: cx - w / 2, y: by - d, w: w, h: d }); }
function cellAt(x, y)                    { return CELLK[(((y / CELL) | 0) * NW) + ((x / CELL) | 0)] || 0; }
function cellAtSafe(x, y) {
  const cx = (x / CELL) | 0, cy = (y / CELL) | 0;
  if (cx < 0 || cy < 0 || cx >= NW || cy >= NH) return 0;
  return CELLK[cy * NW + cx];
}
function ptBlocked(x, y, hw, hh) {
  hw = hw || 7; hh = hh || 5;
  for (const s of solids)
    if (x + hw > s.x && x - hw < s.x + s.w && y + hh > s.y && y - hh < s.y + s.h) return true;
  return false;
}

/* --- 6.0 占用图 → 路网 → 地面（顺序不能动） --- */
buildOcc();
classifyFree(distanceTransform());
stampLibraryPlaza();                         // 图书馆三角广场：从建筑里抠回可走
stampFlagNotch();                            // 升旗台凹口：草坪里划走 5×4 格 [52_flag]
stampDiaNotch();                             // 雕塑凹口：草坪南缘划走 7×6 格 [53_diaosu]
const groundCanvas = buildGround();
paintFlagGround(groundCanvas.getContext("2d"));   // 凹口铺装：**必须**在 buildGround 之后覆盖重绘
paintDiaGround(groundCanvas.getContext("2d"));    // 雕塑凹口铺装：同上，覆盖重绘

/* --- 6.0.1 地面 mip 金字塔（缩放用）→ **已挪到 §6.6d** ---
   ÷2 / ÷4 / ÷8 各一层。缩小时取的层级 L = floor(log2(1/zoom))，保证 2^L <= 1/zoom：
   于是**永远只做「1:1 或轻微缩小」，绝不放大 mip**（放大 mip 会糊）。
   ⚠️ 位置不能再回到这里：§6.6d 的树下落叶要**最后**往地面画布上补像素，
   而 mip 是那一刻从地面画布降采样出来的 —— 早一步建，落叶就进不去 mip。 */

/* --- 6.0.2 缩放档位 --- */
function mipLevelFor(z) {
  if (z >= 1) return 0;
  return Math.min(3, Math.max(0, Math.floor(Math.log2(1 / z))));
}
/* ⚠️ 这里写了 player.speed，所以**只能在主循环段声明 player 之后**调用（幂等，重复调无副作用）。 */
function setZoom(i) {
  zoomI = Math.max(0, Math.min(ZOOM_STEPS.length - 1, i));
  zoom  = ZOOM_STEPS[zoomI];
  viewW = VIEW_W / zoom;
  viewH = VIEW_H / zoom;
  /* 屏幕速度恒定：≥1× 时按倍率补偿，否则 4× 下 200 世界px/s = 800 屏px/s，0.6 秒横穿屏幕。
     <1× 不补偿 —— 世界速度恒定，缩小时走得慢是符合直觉的。 */
  player.speed = BASE_SPEED / Math.max(1, zoom);
  /* 读数与滑条同步（滑条位置 = 档位下标）。滑条是离散的，用下标而不是倍率，
     这样每一像素的拖动距离都对应"一档"，不会出现拖了没反应的空档。 */
  const el = document.getElementById("zoomlv");
  if (el) el.textContent = zoomI === 0 ? "全图"
                                : zoom >= 1 ? (zoom + "×")
                                : (Math.round(zoom * 100) + "%");
  const rg = document.getElementById("zrng");
  if (rg && Number(rg.value) !== zoomI) rg.value = zoomI;
}

/* --- 6.1 建筑样式：按名字归类 --- */
const PALETTE = [
  { wall: "#d2c9b4", roof: "#6c7f8c", glass: "#8FB6D9", door: "#5a3f2a" },   // 教学
  { wall: "#d6c5ac", roof: "#7b5d4e", glass: "#9ec0dc", door: "#5a3f2a" },   // 宿舍
  { wall: "#dbd0b8", roof: "#9a6a3e", glass: "#a8c8e0", door: "#6b4a2f" },   // 会堂 / 食堂
  { wall: "#c8ced4", roof: "#5f7f8a", glass: "#8FB6D9", door: "#4a5560" },   // 实验 / 场馆
  { wall: "#cfc6b2", roof: "#7d6a52", glass: "#a8c8e0", door: "#5a3f2a" },   // 其它
  /* 16 宿舍楼：**红砖档**（用户 2026-09-19「这栋楼楼体是红色的」）。
     照片实测 brick-mid #8f514b（阴影侧）/ brick-all #d19688（含高光）⇒ 取受光面
     的中间值 #bf6a59。这一档**只有 16 号楼用**，配 62_dorm16.js 的灰蓝门楼。
     ⚠️ 62 段拿 `pal.wall` 当"砖红基准亮度"做像素换色（门楼区红墙→灰蓝），
        所以这个色号改了，门楼的灰蓝明度层次跟着变——这正是想要的联动。 */
  { wall: "#bf6a59", roof: "#6b463c", glass: "#9ec0dc", door: "#5a3f2a" },   // 16 号宿舍楼（红砖）
  /* 逸夫楼：**深红档**（用户 2026-09-19「参考 ppt 和我们的照片，逸夫楼主题是深红色的」）。
     `wall` 就是 ppt 第 6 页的实测深红 #C00000 —— 63_yifu.js 拿它当整面墙的底，
     其余每一块（鲜红/深灰/浅灰/黑）也都是那一页的实测色，各自在 63 段里存着。
     `roof` 是**屋面**色：这栋是现代平顶楼，取中性灰；63 段还拿它画"右翼低一截"
     露出来的那块屋面，以及撤屋名牌之后回填补平的那一小块板面（同 59/61 段）。
     这一档**只有逸夫楼用**。 */
  { wall: "#c00000", roof: "#6b6b70", glass: "#8f8f8f", door: "#3a1418" }    // 逸夫楼（深红）
];
function styleOf(name) {
  /* 16 宿舍楼：**红砖档 p:5**（用户 2026-09-19 点名「楼体是红色的」）。
     ⚠️ 这条必须排在下面 `/宿舍/` **之前** —— 晚一步就被归成 p:1 的米色宿舍，
        62_dorm16.js 的灰蓝门楼会贴在一片米色墙上，红砖一条也看不见。
     ⚠️ 层数 6 与 62_dorm16.js 的 D16_FLOORS 必须一致；build.py 有断言把两处钉住
        （层数一变，wallH 与 62 段按 baseY 反推的 eaveY 是同一根链条）。 */
  if (/^16宿舍楼$/.test(name))                    return { p: 5, floors: 6 };
  /* 逸夫楼：**深红档 p:6 + 8 层**（用户 2026-09-19：颜色「参考 ppt 和我们的照片，
     逸夫楼主题是深红色的」、层数「逸夫楼实际上是 8 层」）。
     ⚠️ 层数 8 与 63_yifu.js 的 YF_FLOORS 必须一致；build.py 有断言把两处钉住
        （层数一变，wallH 与 63 段按 baseY 反推的 eaveY 是同一根链条）。
     ⚠️ 这条排在 `/教学楼/` **之前**不是必需的（"逸夫楼"这三个字里没有"教学楼"），
        但它必须排在最后那个 `{ p: 4, floors: 3 }` **兜底之前** —— 少了这条，
        逸夫楼会被归成 p:4 的米色其它楼、3 层，63 段的深红立面会贴在一栋 3 层米色楼上。 */
  if (/^逸夫楼$/.test(name))                      return { p: 6, floors: 8 };
  /* 机械工程楼：**兜底档写成显式的**（用户 2026-09-27 复刻正面图那一轮）。
     ⚠️ p:4 / floors:3 与最后那行兜底**逐字相同** ⇒ 30 段铺底出来的东西一个字节没变；
        写出来只是为了把契约钉住：65 段按画布高反推 eaveY，链条的另一头就是这里。
        少了这条，下面任一档 `/宿舍/`、`/体育馆|实验|馆$/`、`/教学楼/` 将来一改，
        机械楼会**静默**换档 —— p 变了底色调子变、floors 变了 wallH 变，
        65 段的立面会画到屋面上去，而五套自动验收都不看画面。
     ⚠️ 正则**锚定**首尾（"机械楼"三个字里没有"楼"以外的关键词，但锚定是纪律）：
        不锚定的话 `/机械楼/` 也会匹配"机械工程楼"，而这页图上没这个占位名。 */
  if (/^机械楼$/.test(name))                      return { p: 4, floors: 3 };
  /* 建筑艺术学院（第三十四轮新建档，§5.19，parts/70_jianyi.js）。
     ⚠️ **这条不加就会静默换档**：名字从 `"宿舍"` 改成 `"建筑艺术学院"` 之后不再命中
        下面那条 `/宿舍/`，会一路掉进最后的 `{p:4, floors:3}` 兜底 —— 楼体从米色 6 层
        变成棕色 3 层，70 段的立面（按 `eaveY = baseY − 5·34` 反推的）会整体错位，
        而五套自动验收一个都不看画面（机械楼那条注释讲的是同一件事）。
     ⚠️ 层数 **5** 不是拍的：照片（`预览\建艺楼照片.png`）逐排量出 5 排窗
        （y 320-389 / 439-525 / 590-666 / 717-777 / 888-999），最后那排是落地门厅大玻璃。
        5 层 ⇒ wallH = 170 > 进深 160.2 ⇒ **不需要 `roofFull`**：30 段默认的
        `roofT = round(0.6·160.2) = 96` 加 170 行墙已经盖满整个 footprint
        （判据是那条 `wallH ≥ 0.4·进深`，这里 170 ≥ 64.1）。
     ⚠️ p 仍取 1（宿舍那一档的米色系）：70 段把立面**整块重画**（色号全是照片实测的），
        这一档只决定屋面/门的兜底色，以及 `pal` 传给 70 段的那三个字段。
     ⚠️ 楼名与名字必须逐字对上（`/^建筑艺术学院$/`）—— 不锚定的话将来任何含"学院"
        的占位名都会被吸进来。 */
  if (/^建筑艺术学院$/.test(name))                return { p: 1, floors: 5 };
  if (/宿舍/.test(name))                          return { p: 1, floors: 6 };
  if (/食堂|餐厅/.test(name))                     return { p: 2, floors: 2 };
  /* §5.20 天佑会堂（第四十二轮）：**显式钉住 2 层**。它本来也会被下面那条
     `/会堂|…/` 归成 {p:2, floors:2} —— 但那是"顺带命中"，将来谁往那条正则里
     加一个词、或者挪一下顺序，天佑会堂就会静默换楼层，而 70b 段的 wallH 是
     按 TY_FLOORS=2 反解 eaveY 的 ⇒ 立面整体错位（五套自动验收全不看画面）。
     ⚠️ 楼名锚定 `/^天佑会堂$/`，同 141 行那条的规矩。 */
  if (/^天佑会堂$/.test(name))                    return { p: 2, floors: 2 };
  if (/会堂|校史馆|积秀园|服务中心|中心$/.test(name)) return { p: 2, floors: 2 };
  /* 新体育馆：**5 层**（用户 2026-09-17 拍板）。它本会被下面那条 `/体育馆|实验|馆$/`
     归成 3 层 —— 3 层时墙高只有 102px，而屋顶板被 30 段的 `clamp(round(depth*0.60),
     20,190)` 顶到 190，屋顶占了精灵的 2/3，像一张煎饼。所以这条必须排在它**之前**。
     ⚠️ 与 59_xgym.js 的 XG_FLOORS 必须一致；build.py 有断言把两处钉在一起。
     ⚠️ 它仍然归 p:3（`/体育馆|实验|馆$/` 那一档），配色与老体育馆、实验楼同一族。 */
  /* 两栋体育馆：屋面板**铺满整个进深**（`roofFull`，见 30_building.js 那一大段）。
     它们进深 450 / 483，通用的 0.60 + 190 只盖得住南半截，北侧一百多像素的
     K.BLD footprint 露在外面 —— 而 K.BLD 铺的是"楼前硬地"，读起来就是一块
     灰色石板。用户 2026-09-17：「两栋体育馆都向北延长直到分配给其的 k 灰色
     石板区域被覆盖」。**只有这两栋**要这条，所以标志写在 styleOf 里，
     与 floors 一样属于"数据"，30 段模板的默认比例一个字没动。
     ⚠️ 老体育馆这条必须排在下面 `/体育馆|实验|馆$/` **之前**（否则拿不到 roofFull）。 */
  if (/^老体育馆$/.test(name))                    return { p: 3, floors: 3, roofFull: true };
  if (/^新体育馆$/.test(name))                    return { p: 3, floors: 5, roofFull: true };
  if (/体育馆|实验|馆$/.test(name))               return { p: 3, floors: 3 };
  if (/教学楼/.test(name))                        return { p: 0, floors: 4 };
  /* 思源东楼 / 思源西楼：**6 层**（用户 2026-09-17 第十六轮：8 → 6，"减少两层，
     不动塔顶，只动中间的楼层"）。
     ⚠️ 这两栋的层数是"数据"不是"模板"：`floors` 一变，30 段的 wallH 与画布高 H
        自己就跟上来（3 层 259/269 → 8 层 429/439 → 6 层 361/371），58 段按 H 反推
        eaveY 也跟着对 —— 这正是"覆盖重绘不改模板"的边界，能靠数据改的绝不去改
        30_building.js。
     ⚠️ 塔尖跟着不动：`eaveY = PADT(18) + roofT` **与层数无关**，减层只改 wallH
        ⇒ 只改 H 与 baseY，屋面以上的每一行（含 dxAttic 的塔）逐字节不变。
        屏幕上的后果是屋面与塔尖整体下移 68 行（精灵底部锚在世界落地线上不动）。
     ⚠️ 与 58_dxdoor.js 的 DX_FLOORS 必须一致；build.py 有断言把两处钉在一起。 */
  if (/思源[东西]楼/.test(name))                  return { p: 4, floors: 6 };
  return { p: 4, floors: 3 };
}

/* --- 6.2 批量生成建筑 --- */
let bSeed = 7001;
for (const e of CAMPUS) {
  const name = e[0], kind = e[1];
  if (kind === "siyuan" || kind === "library") continue;      // 这两栋单独处理
  if (kind !== "bld") continue;
  const R = zoneRect(e);
  if (R.w < 40 || R.h < 40) continue;
  const st = styleOf(name);
  const pal = PALETTE[st.p];
  /* 图书馆南侧那一列（4 行）：**层数是数据** —— §5.15 的 `DL_FLOORS` 覆盖
     `styleOf` 给的 6 层。`styleOf` 只吃**楼名**、认不出"哪一行"，所以这里靠
     `dormLibPick(e)` 按占位 x 认（那一列 4 行都在 7.459 上；西侧七栋宿舍
     x ≤ 3.1125）。build.py 有闸钉住"恰好命中 4 行"。
     ⚠️ 层数一改，30 段的 wallH / 画布高 H / baseY **自己就跟上来**（与 58 段
        思源楼"8→6 层"同一条路）；占位、`addSolid`、散射随机流一个数都不动。 */
  const dlPick = dormLibPick(e);
  if (dlPick) st.floors = DL_FLOORS;
  const dside = (bSeed % 2) ? 0.18 : -0.18;
  /* 图书馆南侧那一列：**楼体宽与屋面色也都是"数据"**（用户 2026-09-27 第二十六轮
     「这些宿舍没这么长」+「对了楼顶还是白色的」）。
     ⚠️ 缩宽在**这里**缩、不在 66 段裁像素：传一个小的 `w`，30 段的屋面（板面 /
        女儿墙 / 分坡脊 / 屋面设备）、窗列、雨水管、落地投影**全部按新宽自己重排**
        —— 若改成事后裁像素，这一整套都得在 66 段重画一遍，还得自己重造屋面设备。
        ⚠️ 传小 `w` 会把 `b.w` 一起变小，而 §6.2 末尾那句 `addSolid(ax, ay, b.w-14, 34)`
           取的是**精灵宽** —— 碰撞盒会跟着缩，可能放出被挡住的散射候选点，**重掷全校园
           散射**（§6.6 那颗地雷，唯一探针 `_propdiff.py`）。所以那一行对 dlPick 行改用
           **占位宽** `Math.round(R.w)`（= 缩之前的 b.w，见 30 段 `w: Math.round(o.w)`）。
     ⚠️ `roof: DL_ROOF`（ppt 第 1 页那四行矩形的实测渲染色 #d9d9d9）—— 30 段的屋面是
        十几层 `shade(roof, k)` 叠出来的，换入参是**一次全中**。 */
  const dlW = dlPick ? Math.round(R.w * DL_W_RATIO) : R.w;
  const b = makeBuilding({
    name: name,                                 // 屋顶正前方挂楼名牌（§3.0；dlPick 行由 66 段撤掉）
    /* `roofFull`（第三十二轮起第五教学楼也在内）：屋带取 `roofT = ceil(进深) - 墙高`，
       即"屋顶盖满整个 footprint"，而不是 30 段的 `round(0.6 * 进深)`。
       为什么第五教学楼非用不可：0.6 那个惯例要盖住 footprint 得 `墙高 >= 0.4 * 进深`。
       第三十二轮把每层压到 34 行（与七教齐平）⇒ 墙高 102，0.4 * 352 = 140.8 > 102
       ⇒ 继续用 0.6 的话北缘会露出一条 38 行的裸地。见 69_wujiao.js 顶部 §屋面。 */
    w: dlW, depth: R.h, floors: st.floors, roofFull: st.roofFull || name === "第五教学楼",
    wall: pal.wall, roof: dlPick ? DL_ROOF : pal.roof, glass: pal.glass, door: pal.door,
    doorSide: dside,
    /* 16 号楼**不画 30 段那扇门**：它的两个门楼（62_dorm16.js）自己画门，
       30 段那扇会残留在中间的红墙上（连雨棚、台阶一起），并且它的**门占位**
       会挡掉首层一列窗 —— 撤掉门就必须连占位一起撤（详见 30_building.js §3.4）。
       ⚠️ 这个键在其它楼上不存在 ⇒ 默认路径逐字节不变。
       ⚠️ 逸夫楼同上：它的门厅（研究生院门、柱廊、台明）由 63_yifu.js 自己画，
          30 段那扇门（连雨棚、台阶、门占位）一律不要 —— 门占位不撤的话首层会凭空
          空掉一列窗，而那片墙上已经没有任何门了。
       ⚠️ 图书馆南侧那一列（dlPick）第三位：用户 2026-09-27 第二十六轮「楼体中间
          没有门」。这四栋**门与门占位一起撤**（占位不撤首层会空掉一列窗），
          66 段第 25 轮那套"逐字照抄 30 段 §3.7 的门 + 台阶"也一并删除
          —— 它是**盖在** 30 段旧台阶上的，30 段一撤就得跟着撤，否则剩一座没门的台阶。 */
    noDoor: name === "16宿舍楼" || name === "逸夫楼" || dlPick,
    seed: bSeed++
  });
  /* 老体育馆（西门）：门面按实拍覆盖重绘 + 门前长台阶（§5.5，parts/55_gym.js）。
     ⚠️ 必须在这里、addProp **之前** 调 —— gymRestyle 换的是 b.canvas，
        addProp 取的就是 s.canvas，晚一步就画不进去了。
     它不动 bSeed、不碰共享 RNG（内部用 makeRng(5591)），建筑序列一字不变。 */
  if (name === "老体育馆") gymRestyle(b);
  /* 思源东楼 / 思源西楼 的门面按实拍覆盖重绘（§5.8，parts/58_dxdoor.js）。
     两栋楼的门**完全一样**、只有门楣上那四个金字不同 ⇒ 各传各的点阵表；
     第四个实参 `pal.roof` 是给 §5.8.3d 的"楼顶探出体"用的 —— 它的顶面必须与屋面同色，
     而这个色只有这里（PALETTE）有，58 段自己不许再存一份色号。
     同 gymRestyle：必须在这里、addProp **之前** 调（重绘的是同一张 canvas 的内容，
     晚一步 addProp 已经把旧精灵挂进 props 了）；它也不动 bSeed、不碰共享 RNG
     （内部用 makeRng(5813) / makeRng(5807)），建筑序列与散射流一字不变。 */
  else if (name === "思源东楼") dxRestyle(b, DX_D_CHARS, name, pal.roof);
  else if (name === "思源西楼") dxRestyle(b, DX_X_CHARS, name, pal.roof);
  /* 新体育馆：正面按用户给的两张实拍覆盖重绘（§5.9，parts/59_xgym.js）。
     灰竖肋墙 + 中段一条**不贯穿**的蓝玻璃带 + 底部深灰基座，**立面上没有任何字**
     （屋名标牌撤掉 —— 同上，调 makeSign 只为填 _signCache）。
     同 gymRestyle/dxRestyle：必须在这里、addProp **之前** 调；不动 bSeed、
     不碰共享 RNG（内部用 makeRng(5903/5904)），建筑序列与散射流一字不变。
     第四个实参 `pal.roof`：makeBuilding 的返回值里没有色号，而擦掉屋名牌之后
     要按同色补回屋面板面，所以只能由这里给。 */
  else if (name === "新体育馆") xgRestyle(b, pal.roof);
  /* 科学会堂：正面按用户给的 ppt 正面图（校园示意图.pptx 第 4 页）覆盖重绘
     （§5.11，parts/61_kxht.js）。浅灰石板檐口带 + 四个金字、白瓷砖墙、近黑玻璃
     幕墙、6 级中央台阶、左右三角阶梯、两根花盆柱 + 柱顶半圆盆。
     ⚠️ 它**换的是整张画布**（立面高 117 行 ≠ styleOf 的 2 层 68 行），并且把
        `b.ay` 调大 KX_DY=85 ⇒ 整栋在画面上北移 85 行、从思源东楼屋脊后露出来。
        只动 `b.ay`：`b.y`（世界落地线）、`addSolid(ax, ay, ...)` 与 PPT 轮廓
        一个字节都不动 ⇒ 全校园散射随机流一个数都不动（§6.6 那颗地雷）。
     同 gymRestyle/dxRestyle/xgRestyle：必须在这里、addProp **之前** 调 ——
        addProp 取的就是 s.canvas / s.ay，晚一步挂进 props 的还是旧精灵。
        它也不动 bSeed、不碰共享 RNG（内部用局部 makeRng），建筑序列与散射流一字不变。
     第三个实参传 `pal`（整份调色板）：本段所有色都由它现推，本段不许再存一份
        PALETTE（PALETTE 只能在函数体里读，TDZ）。 */
  else if (name === "科学会堂") kxRestyle(b, pal);
  /* 16 宿舍楼：**两个灰蓝门楼 + 红砖墙 + 白色空调外机**（§5.12，parts/62_dorm16.js）。
     用户 2026-09-19「楼体是红色的，有窗户和白色空调外机」「这栋楼有两个门楼，
     一个在左侧一个在右侧，都距离边 2 个窗户」「大门前边四个柱子，除了正对门之外
     另外两个空挡是白色小柱子组成的网格」。楼体已加长（20_ground.js 的占位
     w 0.8931 → 1.0723，两端各延 35px）。
     ⚠️ 它**不动 b.ay**（与 61 段的 KX_DY 不同）：楼高、落地线、碰撞盒一字不动，
        只往同一张 canvas 上重绘门楼区 ⇒ 画面上这栋楼的位置与改前完全一致。
     同 gymRestyle/dxRestyle/xgRestyle/kxRestyle：必须在这里、addProp **之前** 调 ——
        addProp 取的就是 s.canvas，晚一步挂进 props 的还是旧精灵。
        它也不动 bSeed、不碰共享 RNG（内部用局部 makeRng），建筑序列与散射流一字不变。
     第三个实参传 `pal`：62 段拿 `pal.wall` 当砖红基准亮度做像素换色（门楼区
        红墙→灰蓝、保留已画好的窗户），本段不许再存一份 PALETTE（TDZ，58 段栽过）。 */
  else if (name === "16宿舍楼") dorm16Restyle(b, pal);
  /* 逸夫楼：**深红墙 + 竖向长条窗 + 深灰玻璃幕墙（带网格）+ 5 条黑色阳台 + 鲜红实墙板
     + 研究生院门厅 + 两块楼名标牌**（§5.13，parts/63_yifu.js）。
     用户 2026-09-19：「逸夫楼主题是深红色的，你可以在深红色区域安排窗户，逸夫楼窗户
     是长条状的，竖直方向的长条。深灰色部分是玻璃……注意玻璃网格，深灰色区域应该有
     四块，包括研究生院门那里，几个柱子后边……对了深灰色其实是 5 个区域，浅灰色代表
     建筑块……黑色矩形代表露台，阳台，鲜红色部分代表墙面，不用安排窗户」。
     ⚠️ 它**不动 b.ay**（与 61 段的 KX_DY 不同）：楼高、落地线、碰撞盒一字不动，
        只往同一张 canvas 上重绘 ⇒ 画面上这栋楼的位置与改前完全一致。
     同 gymRestyle/dxRestyle/xgRestyle/kxRestyle/dorm16Restyle：必须在这里、
        addProp **之前** 调 —— addProp 取的就是 s.canvas，晚一步挂进 props 的还是旧精灵。
        它也不动 bSeed、不碰共享 RNG（内部用局部 makeRng(6317)），建筑序列与散射流一字不变。
     第三个实参传 `pal`：63 段要拿 `pal.roof` 画"右翼低一截"露出来的那块屋面、
        以及撤屋名牌后回填补平的那一小块板面。本段不许再存一份 PALETTE
        （它只能在函数体里读 —— TDZ，58 段栽过：整页 JS 死）。 */
  else if (name === "逸夫楼") yifuRestyle(b, pal);
  /* 机械工程楼：正面按用户给的 ppt 正面图（校园示意图.pptx **第 7 页**）**逐形状**
     覆盖重绘（§5.14，parts/65_jixie.js）。棕橙楼体 + 8 根灰柱 + 顶部灰横梁
     + 主楼蓝玻璃（**在柱子后边**，被柱子遮挡）+ 浅灰楼名带 + 金色楷体「机械工程楼」
     + 右翼 2×8 蓝窗 + 左侧带坡顶的附楼（白门廊框 + 黑门）。
     ⚠️ 与 55/58/59/61/62/63 那几栋**做法不同**：这一页 54 个形状全是轴对齐矩形
        （+1 个三角），且**遮挡关系恰好就是 ppt 的 z 序**（玻璃先画、柱子后画）
        ⇒ 逐块按 idx 顺序直接落地，不需要手写 z 序表（详见 65 段文件头）。
     ⚠️ 它**换的是整张画布**（立面高 119 行 ≠ styleOf 的 3 层 102 行），
        但**不动 `b.ay`**（与 61 段的 KX_DY=85 不同：机械楼南边是主路、北边是空地，
        119 行的立面本来就露得出来，不需要为躲遮挡而北移）。
        只换画布：`b.y`（世界落地线）、`addSolid(ax, ay, ...)` 与 PPT 轮廓
        一个字节都不动 ⇒ 全校园散射随机流一个数都不动（§6.6 那颗地雷）。
     同 gymRestyle/dxRestyle/xgRestyle/kxRestyle/dorm16Restyle/yifuRestyle：必须
        在这里、addProp **之前** 调 —— addProp 取的就是 s.canvas / s.ay，
        晚一步挂进 props 的还是旧精灵。
        它也不动 bSeed、不碰共享 RNG（内部用局部 makeRng），建筑序列与散射流一字不变。
     第三个实参传 `pal`：65 段的色是**正面图自己给的**（不拿 pal 推），
        但撤屋名牌之后要按 `pal.roof` 补回那块屋面板面，那个色只有这里有
        —— 本段不许再存一份 PALETTE（TDZ，58 段栽过：整页 JS 死）。 */
  else if (name === "机械楼") jixieRestyle(b, pal);
  /* 图书馆南侧那一列宿舍：**白方块瓷砖墙 + 两层 + 首层防盗窗 + 白十字窗棂
     + 上下棕色带 + 空调外机 + 白楼顶 + 楼体缩到 2/3 + 无门 + 无屋名牌**
     （§5.15，parts/66_dormlib.js）。
     用户 2026-09-27 第二十五轮：「图书馆下边理论上是有三个宿舍的，现在只有两个」
     「这些宿舍楼都是只有两层，第一层有防盗窗，窗户是中间白色十字，并且上下都有
     棕色带。记得给窗户加空调外机」「每个宿舍楼外墙都是那种白色方块瓷砖」；
     追问后选定「**只改图书馆下边这一列**」（西侧七栋、16/18 号楼一概不动），
     并明确「那个宿舍（半幅那栋）就是这么宽」⇒ 第 25 轮只降层 + 换立面，宽度不动。
     第二十六轮：「说几个问题，第一，这些宿舍没这么长，第二楼体中间没有门（可能把
     门去掉之后长度就不是很长了）。楼上边的宿舍几个字也去掉」＋「对了楼顶还是白色的」；
     追问"缩多短"时在三个候选里选了「缩到 2/3」。
     ⚠️ 三处覆盖都在**上面**（`dlPick` 那几行：层数 / `dlW` / `roof`），本行只管重绘
        —— 顺序不能反：66 段的几何是 `eaveY = baseY − DL_FLOORS·FLOOR_H`、
        墙带是 [26, 26 + b.w] 反推出来的，覆盖没做就重绘，擦补的行带会整体错位。
     同 gymRestyle/dxRestyle/xgRestyle/kxRestyle/dorm16Restyle/yifuRestyle/
        jixieRestyle：必须在这里、addProp **之前** 调 —— addProp 取的就是 s.canvas。
     第二个实参传 `name`：66 段要调 `makeSign(name)` 填 `_signCache`（verify.py 的
        屋名标牌自检读它）并算出标牌矩形把屋顶上那块牌子擦掉。第 25 轮这里传的是
        `pal` + `dside`（它自己画门与雨篷、门色/棚色由 pal 现推）—— 第 26 轮门撤了，
        66 段不再需要任何调色板字段（瓷砖/棕带/白框/楼顶全是它自己的常量），
        所以两个实参一起删。本段不许再存一份 PALETTE（TDZ，58 段栽过：整页 JS 死）。 */
  else if (dlPick) dormLibRestyle(b, name);
  /* 第九教学楼：**正面按 ppt 第 9 页逐形状 1:1 复刻**（§5.16，parts/67_j9.js）。
     用户 2026-09-27 第二十七轮：「我首先把第九d教学楼的轮廓画出来到ppt中了，你只需要
     一比一复刻。其中中间的黑色区域代表黑色玻璃，你需要画上玻璃并进行网格划分，梯形是
     阶梯，蓝色是普通的玻璃，整个楼，除了中间的大门区域，外边都贴上了白色小方格瓷砖。
     请注意有些图形的覆盖关系和各个图形的轮廓。此外插入的字体我给你图片了，位置也在
     ppt中。注意九教高度是七层楼。」
     ⚠️ 与 65 段的两处不同：①这一页有 3 个 `custGeom` 多边形（金门廊 + 两翼），
        所以 `J9_EL` 多一列 `pi`（>=0 就走多边形，否则走矩形）；②这一页有一个
        TEXT_BOX（「字体插入位置」），那是用户给的**楼名落位标注**，被排除在
        `J9_EL` 之外、单独成 `J9_TXT`（楼名的字号就是从它反推的）。
     ⚠️ 它**换的是整张画布**（立面高 153 行 ≠ styleOf 的 4 层 136 行），
        但**不动 `b.ay` 之外的世界坐标**：`b.y`（世界落地线）与
        `addSolid(ax, ay, ...)` 一个字节都不动 ⇒ 全校园散射随机流一个数都不动
        （§6.6 那颗地雷）。多出来的 17 行全部朝北长。
     同 gymRestyle/dxRestyle/xgRestyle/kxRestyle/dorm16Restyle/yifuRestyle/
        jixieRestyle/dormLibRestyle：必须在这里、addProp **之前** 调
        —— addProp 取的就是 s.canvas / s.ay，晚一步挂进 props 的还是旧精灵。
     第二个实参传 `pal`：67 段不拿它推颜色（正面图的色是 ppt 自己给的），
        只用 `pal.roof` 补回撤掉屋名牌之后那块屋面板面 —— 那个色只有这里有。
        本段不许再存一份 PALETTE（TDZ，58 段栽过：整页 JS 死）。 */
  else if (name === "第九教学楼") j9Restyle(b, pal);
  /* 第七教学楼：**正面按用户给的照片覆盖重绘**（§5.17，parts/68_qijiao.js）。
     用户 2026-09-29 第二十九轮：「回到校园地图项目，我新加了一个关于第七教学楼的图片，
     依据图片精准还原出第七教学楼。首先找到第七教学楼的位置」
     ⚠️ 楼高由用户拍板「保持地图现有高度」（三个候选里选的那个，选项原文：
        「楼高、占地、碰撞盒一个字节不动，跟旁边第五教学楼齐平，对全校园零影响。」）
        ⇒ 画布**同高**、`b.ay` 也完全不动（仍是 baseY = 258），与 67 段那条
        "立面高 153 ≠ 136、多出来的 17 行朝北长"**不是一回事** —— 那条路本段不走。
        那为什么还换一张新画布？因为旧画布 `[baseY, H)` 留着 30 段的旧台阶
        （第 256~265 行）、旧投影也已合成在第 234~279 行上 —— 就地重画会让投影
        叠第二遍。只搬 `[0, eaveY)` 行 ⇒ 旧立面/旧门/旧台阶/旧投影整段进不来。
     ⚠️ 色号全部来自照片实测，**不拿 `pal` 推**（同 65/67 段的规矩）；
        `pal` 只用在 §5.17.7 —— 撤掉屋名牌之后要按 `shade(pal.roof, -0.04)`
        补回那块板面（30 段 §3.2 的同一支笔；67 段在这里拿本色补过，
        出图是一块 117×34 的亮斑）。本段不许再存一份 PALETTE（TDZ，58 段栽过）。
     同 gymRestyle/dxRestyle/xgRestyle/kxRestyle/dorm16Restyle/yifuRestyle/
        jixieRestyle/dormLibRestyle/j9Restyle：必须在这里、addProp **之前** 调
        —— addProp 取的就是 s.canvas / s.ay，晚一步挂进 props 的还是旧精灵。 */
  else if (name === "第七教学楼") qjRestyle(b, pal);
  /* §5.18 第五教学楼（parts/69_wujiao.js）—— 正面按照片覆盖重绘 + 自设计的四坡尖顶。
     ⚠️ 本段与前面十一段的**分水岭**：它**不搬旧画布一行**，新画面从零画
        （旧平屋顶板 / 女儿墙 / 屋面设备 / 旧台阶全作废 —— 用户要的就是
        "屋顶自己延长成尖顶"）。画布尺寸、`b.ay` 仍是 30 段算出来的原值
        （266×372、baseY = 337）⇒ 占地、碰撞盒、楼高一个字节不动。
     ⚠️ 色号全部来自照片实测，**不拿 `pal` 推**（同 65/67/68 段）；本段连
        `pal` 都没用上（新屋面不用补旧板面 —— 整个屋带都是重画的），
        实参留着只为与 59/61/63/65/67/68 的调用签名对齐。
        本段不许再存一份 PALETTE（TDZ，58 段栽过：整页 JS 死）。
     同 gymRestyle/…/qjRestyle：必须在这里、addProp **之前** 调 —— addProp 取的
        就是 s.canvas / s.ay，晚一步挂进 props 的还是旧精灵。 */
  else if (name === "第五教学楼") wjRestyle(b, pal);
  /* §5.19 建筑艺术学院（parts/70_jianyi.js）—— 正面按用户给的照片
     （`预览\建艺楼照片.png`）覆盖重绘：浅黄墙 + 五排蓝玻璃窗 + 右中深蓝灰玻璃塔
     + 塔上竖排 `BJTUSA` 点阵 + 贯通全宽的木质棚架与树状柱 + 首层落地大玻璃门厅
     + 右下角深棕金字招牌。
     用户 2026-09-29：「然后建筑艺术楼正面照也给你了，在老体育馆旁边的田径场下面
     那个是第一个宿舍楼，这个宿舍楼应该是建筑艺术楼标错了，给我复刻好，不用关会
     不会被遮挡，直接画」。
     ⚠️ 本段与 61/67/68/69 四段都**不同**：它**既不换画布、也不动 `b.ay`**
        （68 段换画布、67 段换画布 + `b.ay = G.baseY`、69 段不搬旧行但从零重画）。
        原因：本段要覆盖的只有**屋面 + 立面**（行 `[PADT, baseY)`），30 段画在
        `baseY` 以下的台阶与落地投影**一个像素都不碰** —— 旧画布原样够用。
        ⇒ `b.canvas / b.ay / b.w` 三样不动，世界落地线、`addSolid` 的碰撞盒、
          footprint 全部一个字节不变（全校园散射随机流也不动，见 §6.6 那颗地雷）。
     ⚠️ 色号全部来自照片实测，**不拿 `pal` 推**（同 65/67/68/69 段）；`pal` 这个
        实参留着只为与那一串 `xxxRestyle(b, pal)` 的签名对齐。本段不许再存一份
        PALETTE（TDZ，58 段栽过：整页 JS 死）。
     同 gymRestyle/…/wjRestyle：必须在这里、addProp **之前** 调 —— addProp 取的
        就是 s.canvas / s.ay，晚一步挂进 props 的还是旧精灵。 */
  else if (name === "建筑艺术学院") jyRestyle(b, pal);
  /* §5.20 天佑会堂（parts/70b_tyht.js）—— 正面按用户给的图片
     （`预览\tianyouhuitang.png`）覆盖重绘：米黄石墙 + 白檐板 + 中央蓝玻璃幕墙
     + 白平台栏杆 + 灰悬挑雨棚 + 三组首层大门 + 左右通高窄窗带
     + 右墙竖排金字「天佑会堂」+ 楼前大台阶 + 台阶下红黄绿蓝彩绘。
     用户 2026-10-02：「我给了你天佑会堂的正面图，找到天佑会堂的位置并复刻出来」，
     并当场拍板两个口径：楼名「照图：竖排金字贴右墙，撤屋顶大牌子」、
     台阶「都画：大台阶 + 彩色涂装」。
     ⚠️ 走 70_jianyi 那条路（不换画布、不动 b.ay），唯一分歧：往下多画 30 行
        （30 段画在 baseY 以下的小台阶与落地投影被整块重画成宽台阶 + 彩绘）。
        世界落地线、碰撞盒、footprint 仍一个字节不动。
     ⚠️ 色号全部来自照片实测，**不拿 `pal` 推**；本段不许再存一份 PALETTE。
     必须在这里、addProp **之前** 调 —— addProp 取的就是 b.canvas / b.ay。 */
  else if (name === "天佑会堂") tyRestyle(b, pal);
  const ax = R.x + R.w / 2, ay = R.y + R.h;
  /* 门的世界坐标登记给 §5.8.6 的门前净空（parts/58_dxdoor.js 的 DX_DOORS）。
     ⚠️ 只能在这里登记，**不能在 props 里找** —— 建筑是 addProp 造的道具，而 addProp
        是按白名单复制的（只取 img/ax/ay/x/y/baseY/tag 六个字段），挂在建筑对象上的
        记号 `b.__dx` 会在那一刻被丢掉。第一版就是拿 props 里的 `__dx` 找门，
        结果 DX_DOORS 恒空、净空一棵树都删不掉（三套自动验收全绿、只有出图看得见）。
     ⚠️ 第八轮起门组按用户要求**平移**了 k 个窗距（§5.8.7）⇒ 登记的必须是**门**的中轴
        （ax + 同一个偏移），不是建筑中轴；否则清空的是旧门前面那片地，
        新门前那棵树照样糊在门脸上 —— 而四套自动验收一个都看不出来。 */
  if (b.__dx) DX_DOORS.push({ x: ax + dxDoorShift(b.canvas.width, name), y: ay });
  addProp(Object.assign({}, b, { x: ax, y: ay,
    tag: name === "老体育馆" ? "gym" : undefined }));
  BLD_IMGS.add(b.canvas);                      // 第三十七轮：登记为「会挡人的楼」
  /* 碰撞：只取临街那一层（深度 34），保证能绕楼走。
     ⚠️ 宽度取**占位宽**，不取精灵宽 —— §5.15 那一列（dlPick）把楼体缩到 2/3
        （`dlW` 传进 makeBuilding ⇒ `b.w` 跟着变小），碰撞盒若跟着缩，会放出
        原本被挡住的散射候选点 ⇒ `scatter()` 里 `x = gx + (rngS()-0.5)*54` 那一行
        后半段全部挪位 ⇒ **重掷全校园散射**（§6.6 那颗地雷，唯一探针 `_propdiff.py`）。
        `Math.round(R.w)` 正是缩之前的 `b.w`（30 段 `w: Math.round(o.w)`）。
     ⚠️ 非 dlPick 行必须与旧代码**逐字节同值**：这里写死 `b.w` 那一支，绝不统一改成
        `R.w` —— `R.w` 是小数，差半像素也会挪碰撞盒、同样会重掷散射。 */
  addSolid(ax, ay, (dlPick ? Math.round(R.w) : b.w) - 14, 34);
}

/* --- 6.3 思源楼：标尺原点，位置由 PPT 精确给出 --- */
{
  const e = CAMPUS.find(c => c[1] === "siyuan");
  const R = zoneRect(e);
  /* ⚠️ scale 是硬约束（交接 §3.1「scale:1.5 冻结」），也是标尺本身：
     源码 BL=60→BR=360 宽 300 逻辑像素 × 1.5 = 450 世界像素 = 50 m。
     改成 2.25 会让楼宽变 675 px，既破坏 §4.1 的推导链，也与 PPT 矩形对不上。 */
  const ax = R.x + 450 / 2, ay = R.y + IX(e[5]);            // 2023.9, 1431.6
  const s = makeSiyuan({ scale: 1.5 });                      // 300px → 450px
  /* 顶部改写（parts/51_siyuan_top.js）：中央塔降高 + 题字换成 字体.png 的毛笔字（仍红色）。
     ⚠️ 只能**覆盖重绘**：demo 的 §3.5 是逐字节冻结的，一个字都不能改。
        这一行必须在 makeSiyuan 之后、addProp 之前 —— 晚了就画在精灵图外面了。
     ⚠️ 第十五轮起传**整个精灵对象**（不是 s.canvas）：函数会换成一块高 128 行的新画布
        并把 s.ay 一起挪，只传 canvas 的话这两样都写不回去（加高与落地线全丢）。 */
  siyuanRestyle(s, 1.5);
  addProp(Object.assign({}, s, { x: ax, y: ay }));
  BLD_IMGS.add(s.canvas);                      // 第三十七轮：登记为「会挡人的楼」
  addSolid(ax, ay, 450, 34);
}

/* --- 6.4 图书馆（parts/36_library.js 全量重写：四矮一高五体量 + 三锥顶 + 蓝玻璃带） --- */
{
  const s = makeLibrary({ seed: 8801 });
  /* ⚠️ 落地线是 `LIB_FY`，**不是** `LIB.y + LIB.h`。
     楼体南墙已整体后退 LIB_FORE(110) 让出门前前庭，LIB_FY 由 36 段现算
     （= 主路北缘 − LIB_FORE）。这里不许再拼一遍这个减法 —— 拼第二份就等着漂。 */
  /* ⚠️ 必须带 tag：图书馆精灵宽 401，与 18 宿舍楼**同宽** ⇒ `_prop.py` 按
     `img.width` 认道具会认到宿舍楼上去（实测已撞）。带 tag 才能用 `_propview.py`
     看原尺寸放大图 —— 而"画对了没有"是四套自动验收**唯一查不出**的东西。 */
  addProp(Object.assign({}, s, { x: LIB_CX, y: LIB_FY, tag: "lib" }));
  BLD_IMGS.add(s.canvas);                      // 第三十七轮：登记为「会挡人的楼」
  /* 前庭横贯全宽 ⇒ 回到全校通用的一条 AABB。旧方案那两条 L 形
     （"缺的正是三角广场那一角"）已随三角广场一并废弃。 */
  addSolid(LIB_CX, LIB_FY, LIB.w - 14, 34);
}
/* --- 6.4b 茅以升坐像（parts/36_library.js makeMaoyisheng）---
   ⚠️ 必须在 scatter() **之前**：addSolid 推进 solids，散射点才会避开它
      （同上一条 6.5b 升旗台的理由，晚一步坐像上会长出垃圾桶）。
   ⚠️ 必须是**独立道具**、不能并进建筑精灵 —— 并进去它就跟建筑共用 baseY 一起排序，
      走到坐像背后（台阶与坐像之间）的玩家 y 仍大于建筑 baseY，会被画在坐像**前面**。
      与"台阶必须并进精灵"（36 段 libStair 的注）正好相反，别搞混。 */
{
  const st = makeMaoyisheng();
  const sy = LIB_FY + LIB_STAIR + 34;         // 前庭铺装带上，离台阶脚 34px，离主路 31px
  addProp(Object.assign({}, st, { x: LIB_CX, y: sy, tag: "mao" }));
  addSolid(LIB_CX, sy, 44, 18);               // 只围黑石基座（含外挑台沿 44 宽），不围美术盒
}

/* --- 6.5 围墙 + 校门 --- */
buildGates();

/* --- 6.5b 升旗台（parts/52_flag.js）---
   ⚠️ 必须在 scatter() / plantRows() **之前**：addSolid 推进 solids，ptBlocked
      才会让散射点与行道树避开台子（晚一步台子上就会长出垃圾桶或树）。 */
addProp(Object.assign({}, flagStand(), { x: FLAG_CX, y: FLAG_FOOT, tag: "flag" }));
addSolid(FLAG_CX, FLAG_FOOT, FLAG_PZ.w, FLAG_PZ.t + FLAG_PZ.f);

/* --- 6.5c 齿轮铁砧雕塑（parts/53_diaosu.js）---
   同样是"凹口 + 本体"两件事：凹口已在 §6.0 划过，这里只摆本体。
   ⚠️ 也必须在 scatter() / plantRows() **之前** —— 同 §6.5b 的理由。 */
addProp(Object.assign({}, diaStand(0), { x: DIA_CX, y: DIA_FOOT, tag: "diaosu" }));
/* 喷泉逐帧（2026-09-13 第六轮）：抓住刚推进去的那个道具，然后预烘焙 8 帧。
   ⚠️ 水柱**不能另起一个道具** —— 道具按 baseY 排序，雕塑 baseY=1854（花坛落地线），
      水柱落地点只有 1830，单独立项会被排到雕塑背后、被前排柱子吃干净。
      只能并进这张画布，逐帧换 prop.img（同 §5.2 国旗的做法）。 */
diaProp = props[props.length - 1];
bakeDiaFountain(diaProp.img);         // 第 0 帧直接复用上面那张，不重烘
/* 本体碰撞盒 = 花坛的落地足迹（78×44，比雕塑其余部件都宽，一块就够挡住柱子与台座）。
   ⚠️ 改 §5.3.8 的 DIA_FLW_RX / RY 之后这里要同步重算。 */
addSolid(DIA_CX, DIA_FOOT, DIA_FLW_RX * 2 + 2, DIA_FLW_RY * 2);

/* 后围石是**另一个道具**（baseY 比雕塑靠北 57px，并进一张画布会串深度，见 §5.3.9b），
   逐块给碰撞盒 —— 块间 18.5px 的缝留空，人能像现实里那样从缝里穿过去。 */
addProp(Object.assign({}, diaRing(), { x: DIA_CX, y: DIA_ST_BY, tag: "diaRing" }));
for (const b of diaStoneBoxes()) addSolid(b.cx, b.by, b.w, b.d);

/* --- 6.5d 南门校名石 + 石狮（parts/54_southstone.js）---
   位置在南门（G2）**东侧**，与门拱共用同一条落地线（`IX(6.3750)`），见 §5.4 头注。
   ⚠️ 同 §6.5b/§6.5c：必须在 scatter() / plantRows() **之前** addProp + addSolid，
      否则碑与狮子那一格会长出散射树或垃圾桶。
   ⚠️ 两个道具的 baseY 现在**相等**（并排站）—— 水平上不重叠，画序无所谓；
      G2 的 y 一改，碑与狮跟着一起走（§5.4.1 用的是同一个 `IX(6.3750)` 表达式）。 */
buildSouthStone();

/* --- 6.5d-2 南门西侧「保安厅」+ 东侧「校名碑墙」（parts/64_southwest.js §6.4）---
   用户 2026-09-27 放了南门正立面图（`预览/nanmen.jpg`）：
   「重点复刻一下保安厅，按照照片的比例，石狮子不用动，那块红色北交石碑好像被嵌到了
    一个灰色贴瓷墙面，总之你需要复刻保安室和新石碑墙，不需要动石狮子和南门（拱形高门）」
   ⇒ 拱门（§4.9）与石狮（§5.4）**一个像素都不许变**；新增的只有这两件：
     · 拱门**西侧**：左砖墙 + 保安室（蓝窗/深蓝门）+ 右矮墙 + 悬挑折叠雨棚（照照片全放）
     · 拱门**东侧**：红石板嵌进砖墙的「校名碑墙」——**复用 §5.4 的 `makeSchoolStone()` 成品**
       裁掉花岗岩框后 1:1 嵌进去（所以金字与原来同一次绘制、不走样）
   ⚠️ 必须排在 scatter()/plantRows() **之前** —— 否则新占的地面上会长出散射树/垃圾桶。
   ⚠️ 石狮的世界坐标 x2111..2145 正好落在拱门东柱与碑墙之间那道缝里（照片里也是这个位置），
      §6.4 的两块净空盒**在中间留了这道缝**，别把缝填掉。 */
buildSouthWest();

/* --- 6.5e 明湖三景（parts/56_minghu.js §5.6）---
   石碑（含「明湖」刻字点阵）/ 湖心岛 + 小亭子 / 水中央的石塔。
   位置来自用户手写的 _build/_photo/minghudetail.txt（其中石塔的 y 因"明湖缩小"
   北移了 103.6，理由见 §5.6 文件头一）。
   ⚠️ 同 §6.5b/6.5c/6.5d：必须排在 scatter() **之前** —— 碑 / 岛 / 塔的 addSolid 要先进
      solids，否则绿化/路灯会种到它们身上去。（岛与塔的盒子是第六轮补的，
      旧前提"水面不可通行"已证伪，见 §5.6.6 头注。）
   ⚠️ 三件都必须是**道具**：渲染序是 地面 → drawWater（每帧） → 道具，
      烘进地面的话每帧的波纹会画到岛和塔上面（§5.6 文件头二）。 */
buildMinghu();

/* --- 6.5f 明湖南岸影壁群 + 假山（parts/57_yingbi.js §5.7）---
   带窗影壁 × 2 + 月亮门 + 假山，都在用户指定的落地线 y1378 上。
   ⚠️ 同 §6.5b~6.5e：必须排在 scatter() **之前** —— 影壁 / 门垛 / 假山的 addSolid 要先进
      solids，否则绿化、路灯、长椅会种到墙里和山上。
   ⚠️ 四件同时登记 WATER_AVOID（走 56 段的 mhSolid）：鸭子本轮的活动域已扩到南岸
      石板路（45_water.js §4.5.3d），avoidPush() 是**唯一**能让它绕开墙、
      从两端各 34px 的缺口上岸的机制 —— 只 addSolid 的话鸭子会径直穿墙。
   ⚠️ 本轮块内不动：石板路实测 0 道具 0 碰撞盒，**不需要清场函数**（详见 57 段文件头一）。 */
buildYingbi();

/* --- 6.5g 网球场围栏的碰撞盒（parts/37_sports.js §3.7 第二轮）---
   用户口径（逐字）：「加上围栏之后小人不能移动到围栏内了」。
   ⚠️⚠️ **本轮必须单独声明的一件事**：这是全项目第一次为了"围栏"推进 solids ——
      solids 一变 `ptBlocked` 的判定就变，散射循环里的 `n` 跟着平移，而 `n` 又是
      物种种子（`anyTree((n*131+11)|0)`）⇒ **全校园的树 / 灌木 / 花坛重掷一遍**。
      60 段 §6.6 头部那条地雷讲的就是这件事；唯一探针是 `_build/_propdiff.py`
      （必须跳过 `tag==='duck'`）。accept / verify / zoomtest 三套**一个数都不会变** ——
      别拿它们当"没事"的证据。
   ⚠️ 盒子按 zoneRect 现算，与 37 段画的那圈**同源**（CAMPUS 的网球场一行一改，
      围栏与盒子一起走）。整个区域一块 AABB：围栏围的是区域边界、内部就是球场，
      所以"不能走到围栏内" ＝ 封住这块矩形。
   ⚠️ 必须在 scatter() / plantRows() **之前**（同 §6.5b~6.5f）。 */
for (const e of CAMPUS) if (e[1] === "tennis") {
  const R = zoneRect(e);
  addSolid(R.x + R.w / 2, R.y + R.h, R.w, R.h);
}

/* --- 6.5h 伟人雕像（parts/59b_weiren.js §5.10）---
   用户指定世界坐标 (2439, 1880)，落在思源楼前东侧那块小草坪的南缘草地上。
   ⚠️ 同 §6.5b~6.5g：**必须排在 scatter() / plantRows() 之前** —— 一圈栏杆的
      addSolid 要先进 solids，否则圈内会照常长出散射树（那块草坪实测有柏树与樱花）。
   ⚠️ 碰撞盒 = 整个栏杆圈（132×84）。用户口径是「四周是石头栏杆」，玩家从哪一侧
      都进不去 ⇒ 一块 AABB 封死整圈，与 37 段网球场围栏同款做法。
      这也是本轮**第二处**推进 solids 的地方，散射重掷的声明见文件头 §四。 */
addProp(Object.assign({}, wrStand(), { x: WR_CX, y: WR_RAIL_Y1, tag: "weiren" }));
addSolid(WR_CX, WR_RAIL_Y1, WR_RAIL_W, WR_RAIL_D);

/* --- 6.5i 詹天佑雕塑（parts/59c_zhantianyou.js §5.21）---
   用户指定世界坐标 (1818, 1927)，落在思源楼前雕塑区西侧的**铺装走道**上
   （实测走道带 y ≈ 1883..1976，本件占地 y 1921..1933 整段在走道内 —— 不需要
   抠草坪凹口，柱座直接坐在铺装上）。
   ⚠️ 同 §6.5b~6.5h：**必须排在 scatter() / plantRows() 之前** —— 柱座的 addSolid
      要先进 solids，否则柱子脚下会照常冒出散射道具。
   ⚠️ 与 59b 不同的地方：那边盒子 = 整圈栏杆（把玩家挡在圈外）；本件**没有栏杆**，
      盒子只封柱座那 22×13 ⇒ 玩家可以贴着柱子走，只是进不去柱子。
      这是本轮**第三处**推进 solids 的地方，散射重掷的声明见 59c 文件头 §四。 */
addProp(Object.assign({}, ztStand(), { x: ZT_CX, y: ZT_S, tag: "zhantianyou" }));
addSolid(ZT_CX, ZT_S, ZT_SOL_W, ZT_SOL_D);

/* --- 6.6 绿化 / 路灯 / 长椅 / 花坛 / 垃圾桶 / 自行车 ---
   ⚠️⚠️ 地雷（2026-09-17 图书馆轮实测到，务必先读再改任何 addSolid）：
   下面那个 `n` 既是"已接受点数"**又当物种种子**（`anyTree((n*131+11)|0)`）。
   所以 `n` 一旦平移，**它之后的每一棵树、每一丛灌木都换树种/换尺寸** ——
   而 `n` 只统计"通过了 `ptBlocked` 的点"⇒ **任何一个 addSolid 盒子挪位，
      都会把全校园的散射结果重掷一遍**，而 accept / verify / zoomtest 三套验收
      一个数都不变（它们不看画面、也没有"道具集合"这一维）。
   图书馆轮实录：楼体南墙后退 110px ⇒ 楼体碰撞盒从"贴路那 34px 条带"挪到真实
   南墙 ⇒ 恰好 2 个候选格翻转（`3134,1281` 与 `3191,1299` 由接受变被挡），
   其后 `n` 整体平移 −2，另有南侧条带原先挡住的一行被放行 ⇒
   `_propdiff` 报 137 掉 / 151 增，逐字节相同的只剩 168/305。
   **唯一探针就是 `_build/_propdiff.py`**（必须跳过 `tag==='duck'`）。
   根治办法（尚未做，需用户拍板）：把种子从 `n` 换成**由格子坐标算出**的量
   （`gx/gy` 的哈希），这样 `n` 再怎么平移都不影响树种 —— 代价是换种子那一次
   会把全校园重掷一遍，所以必须单独立一轮、单独声明，不能夹带在别的轮里。
   （`_build/_scatprobe.py` 是为此写的工具：用同一条种子重放散射循环，
     逐格报出"接受了/被谁挡掉"，把"149 件变了"收敛到"就是这两个格子"。） */
const rngS = makeRng(31415926);
function scatter() {
  let n = 0;
  for (let gy = 80; gy < WORLD_H - 60; gy += 92) {
    for (let gx = 80; gx < WORLD_W - 60; gx += 92) {
      const x = gx + (rngS() - 0.5) * 54, y = gy + (rngS() - 0.5) * 54;
      if (!insideBoundary(x, y) || distToBound(x, y) < 30) continue;
      if (ptBlocked(x, y, 13, 8)) continue;
      const k = cellAtSafe(x, y);
      const r = rngS();
      n++;
      /* ⚠️ 上面 `rngS()` 的调用次数必须逐字不变（每点一次，见 §6.6 头部）。
         把 makeTree 换成 anyTree 只是**换分发**，物种由 seed 的数值决定、
         不摇随机 —— 所以灯 / 灌木 / 长椅的分布逐像素不变。 */
      if (k === K.GRASS) {
        if (r < 0.34) addProp(Object.assign({}, anyTree((n * 131 + 11) | 0, x, y), { x: x, y: y }));
        else if (r < 0.54) addProp(Object.assign({}, makeBush((n * 977 + 7) | 0), { x: x, y: y }));
        else if (r < 0.60) addProp(Object.assign({}, makeFlowerBed((n * 89 + 3) | 0), { x: x, y: y }));
        else if (r < 0.64) addProp(Object.assign({}, makeBench((n * 71 + 5) | 0), { x: x, y: y }));
        else if (r < 0.67) addProp(Object.assign({}, makeBin((n * 53 + 2) | 0), { x: x, y: y }));
      } else if (k === K.PLAZA) {
        if (r < 0.16) addProp(Object.assign({}, anyTree((n * 131 + 23) | 0, x, y), { x: x, y: y }));
        else if (r < 0.30) addProp(Object.assign({}, makeBench((n * 71 + 13) | 0), { x: x, y: y }));
        else if (r < 0.36) addProp(Object.assign({}, makeBin((n * 53 + 17) | 0), { x: x, y: y }));
      } else if (k === K.ROAD || k === K.FREE) {
        if (r < 0.16) addProp(Object.assign({}, makeLamp(), { x: x, y: y }));
        else if (r < 0.22) addProp(Object.assign({}, anyTree((n * 131 + 31) | 0, x, y), { x: x, y: y }));
        /* ⚠️ 用户要求：画面里不出现自行车 —— 原 `else if (r < 0.25) makeBike(...)` 已删除。
           删除**不扰动随机序列**：每个候选点只取一次 rngS()（上面的 `const r`），
           分支本身不消耗随机数，所以灯/树的分布逐像素不变，只是原先中签的那 ~3% 点位留空。
           demo 的 nature 段（805-1049）里 makeBike 的定义仍原样保留 —— 那是逐字节切片，
           一行不能改 —— 但产物里已无任何调用点，属死代码。 */
      }
    }
  }
  /* ⚠️ 这里原有"图书馆三角广场中央那棵大树"（makeTree(4242)）—— 随三角广场一并删除。
     删它**不扰动随机序列**：makeTree 自带种子 4242，本行不消耗 rngS()
     （与 §6.6 里删自行车那段的先例同理）。代价是 props.length 少一件、
     其后索引整体前移，`_propdiff.py` / `_sprhash.py` 会报 —— 属预期。 */
}
scatter();

/* --- 6.6b 行道树 / 广场树阵（parts\47_plants.js） ---
   与 scatter() 完全隔离：规则点阵 + 自己的 makeRng。scatter() 的 rngS
   序列一个数都没动，所以草地上既有的灯 / 灌木 / 花坛位置逐像素不变。 */
const rowTrees = plantRows();

/* --- 6.6b-2 南门纵向大道的白杨两排（parts\47_plants.js §4.7.3c）---
   用户 2026-09-13：「白杨排布一定要整体，树根的 x 轴坐标要一致」。
   ⚠️ 位置钉死在 plantRows() **之后**、clearPropTreeClash() **之前**：
     ① 之后 —— 它要删的正是 plantRows() 种下的那些"乱点"行道树；
     ② 之前 —— 补种的两排必须参与 §6.6c 的冲突清理（树冠底下压着的桶 / 椅要照常删掉），
        与既有树一视同仁。 */
const aveTrees = plantPoplarAve();

/* --- 6.6c 道具／树的视觉冲突清理 ---
   散射是"各摆各的"：树和垃圾桶各自按网格点撒，偶尔出现「垃圾桶的接地线整个落在
   树冠像素里、而树又排在它前面」—— 看起来就是垃圾桶挂在树尖上。
   ⚠️ 三条要点：
     ① 只删**小道具**（桶 / 椅 / 花坛 / 灯），树一律保留 —— 树是这一项的主角。
     ② 判据必须看**像素**，不能看包围盒：包围盒相交的 22 对里大半是"长椅站在树影里"
        "鸭子游在柳荫下"，都是对的（第一版按包围盒删，误伤一大片）。
     ③ 必须要求**树排在道具前面**（baseY 更大 = 更靠南），并且道具的接地线要明显地
        在树的北侧（≥40px）—— 否则"道具挨着树站着、脚被树干挡一点"是正常遮挡，
        删掉反而是损失。
   必须在 §6.7 鸭子下水**之前**跑：鸭子是 props 里的引用，删了会让鸭子消失。
   ⚠️ ④ **2026-09-17 修了一个既存缺陷**：本函数的"保留"判据原先只认 `p.tag`，
      而**建筑物没有 tag** ⇒ 楼会掉进"小道具"那一支、被 `footOnTree` 删掉。
      触发条件苛刻（树要排在楼前、且树冠像素**正好压在楼的接地线那 3 行上**），
      所以从 §2 起一直没被撞上；这一轮雕像的两处 addSolid 重掷了全校园散射、
      换了树位，第七教学楼（310×293）当场消失。现按宽度把楼排除掉（见函数内注释）。 */
function footOnTree(p, t) {
  const g = t.img.getContext("2d");
  /* 道具接地线（锚点行上下各 1px）换算到树的画布坐标 */
  const x0 = Math.round(p.x - (t.x - t.ax) - p.img.width / 2);
  const y0 = Math.round(p.y - (t.y - t.ay)) - 1;
  if (x0 + p.img.width < 0 || y0 + 3 < 0 || x0 >= t.img.width || y0 >= t.img.height) return false;
  const sx = Math.max(0, x0), sy = Math.max(0, y0);
  const sw = Math.min(t.img.width, x0 + p.img.width) - sx;
  const sh = Math.min(t.img.height, y0 + 3) - sy;
  if (sw <= 0 || sh <= 0) return false;
  const d = g.getImageData(sx, sy, sw, sh).data;
  let n = 0;
  for (let k = 3; k < d.length; k += 4) if (d[k] > 40) n++;
  return n >= 2;                                // 1px 擦边不算，要真盖住
}
function clearPropTreeClash() {
  const keep = [];
  let dropped = 0;
  for (const p of props) {
    /* ⚠️⚠️ 2026-09-17 补：`|| p.img.width > 110` 那半条是**本轮的 bug 修复**，
       不是重构 —— 原判据只有 `if (p.tag)`，于是**没有 tag 的建筑物**会掉进下面的
       `footOnTree` 判据：只要有一颗树排在楼前、树冠像素正好压在楼的接地线上，
       **整栋楼就被当成"压着树的小道具"删掉**（这一轮实测：第七教学楼 310×293
       就是这么没的 —— 雕像那两处 addSolid 重掷散射、换了树位才触发）。
       建筑在本项目里一律没有 tag（`addProp` 只拷 `img/ax/ay/x/y/baseY/tag`，
       `makeBuilding` 的产物没有 tag 字段）⇒ 用宽度把"楼"与"小道具"分开，
       与 §5.10.9 `clearWrClearance` 同款口径（小道具最大 ≈86px，楼最小 ≈150px）。 */
    if (p.tag || p.img.width > 110) { keep.push(p); continue; }   // 树 / 鸭子 / 建筑：不动
    let bad = false;
    for (const t of props) {
      if (t.tag !== "tree" || t.baseY <= p.baseY) continue;
      if (p.y > t.y - 40) continue;             // 挨着站 = 正常遮挡，放行
      if (footOnTree(p, t)) { bad = true; break; }
    }
    if (bad) dropped++; else keep.push(p);
  }
  props.length = 0;
  for (const p of keep) props.push(p);
  return dropped;
}
const clashDropped = clearPropTreeClash();

/* --- 6.6c-2 图书馆前庭净空（parts/36_library.js clearLibFore）---
   ⚠️ 位置钉在 plantRows() 与 clearPropTreeClash() **之后**：
      前庭被 stampLibraryPlaza() 标成 K.PLAZA，散射与规则树阵**都**往广场种树，
      两条来路都得等它俩跑完才清得干净（实测这些树的接地点 ≈1357，正好落在
      彩绘台阶上 —— 楼体没后退时它们一直被楼挡着，退完才露出来）。
      前面 §6.6b-2 白杨、§6.6c 冲突清理都不碰图书馆一带，顺序上互不干扰。 */
const foreDropped = clearLibFore();

/* 旗杆净空：台子东南侧 / 路北侧长出来的树冠会把杆身与旗面糊掉。
   ⚠️ 必须排在 clearPropTreeClash() 之后（先跑会改掉它的保留集，计数就变了）。 */
const flagCleared = clearFlagClearance();

/* 雕塑净空：同款理由 —— 凹口外围的草坪上照样会长出树，树冠一盖就把齿轮环糊掉。
   ⚠️ 与 clearFlagClearance 一样必须在 clearPropTreeClash() 之后；两者净空区
      （flag y1443..1639 / 雕塑 y1744..1875）不重叠，谁先谁后不影响结果。 */
const diaCleared = clearDiaClearance();

/* 伟人雕像净空（parts/59b_weiren.js §5.10.9）：那块草坪上散落的柏树 / 樱花 / 灌木
   会从栏杆里长出来。⚠️ 同款约束：必须排在 clearPropTreeClash() 之后
   （先跑会改它的保留集，计数就变了）。 */
const wrCleared = clearWrClearance();

/* 詹天佑雕塑净空（parts/59c_zhantianyou.js §5.21.11）：柱座周围的散落树 / 灌木 /
   路灯会糊住柱身与铭牌。⚠️ 同款约束：必须排在 clearPropTreeClash() 之后
   （先跑会改它的保留集，计数就变了）。 */
const ztCleared = clearZtClearance();

/* 体育馆台阶净空（parts/55_gym.js §5.5.7）：台阶画在建筑精灵**下方**（世界 y895..947），
   精灵 baseY 却仍是 895 —— 于是 baseY>895 的路灯/小树会排到台阶**前面**画上去。
   楼前那段砖石路 scatter() 本来就会撒东西，不清掉就是"灯柱子长在台阶上"。
   ⚠️ 同款约束：必须排在 clearPropTreeClash() 之后（先跑会改它的保留集）。 */
const gymCleared = clearGymStairs();

/* 南门西侧保安厅 + 东侧碑墙净空（parts/64_southwest.js §6.4.5）：两块新实体压在南门
   入口广场的砖石地上，scatter() 撒下的路灯/垃圾桶/小树会**长在墙里**。
   ⚠️ 必须排在 clearPropTreeClash() 之后（同前几处的理由：先跑会改它的保留集）。 */
const swCleared = clearSouthWest();

/* 思源东/西楼门前净空（parts/58_dxdoor.js §5.8.6）：门口正前方长出来的树会糊住门脸
   （西楼门口实测有一棵 54×104 的针叶树，用户要求清掉）。
   ⚠️ 同款约束：`__dx` 是 dxRestyle 打在建筑对象上的记号，净空靠它认门在哪 ——
      dxRestyle 必须在 addProp **之前**跑（§6.2 有断言），记号才带到道具上。 */
const dxDoorCleared = clearDxDoorFront();

/* 草坪整治区清场：删掉草坪**内部**散落的小道具（用户要「中间只有草地」）+ 草坪
   边线外 LAWN_BAND 以内**根不在草坪上**的东西（用户要「树的根部要求在草坪上，不能
   跑其他地方去」；这些"冒充边界树"的散射树 / 路灯正是把树圈顶出缺口的元凶）。
   ⚠️ 三条：
     ① 判据用**接地点**（p.x / p.y）而不是美术盒 —— 草坪外那一圈行道树的树冠会伸
        进草坪上方，用美术盒会把它们整批误删。
     ② 白名单（lawnTree / flag / diaosu / diaRing / 大件 img.width>90）必须保留，
        否则树圈自己会被自己删掉。
     ③ 必须排在 clearPropTreeClash() 之后（同前面两处净空的理由：先跑会改它的保留集），
        且必须排在 plantLawnRing() **之前** —— 清完场树圈才围得满。 */
const lawnCleared = clearLawnZone();

/* --- 6.6b-last 思源楼前大草坪的"边界树圈"（parts\47_plants.js §4.7.6b） ---
   ⚠️ 位置很讲究：必须排在**四个 clear* 之后**、**plantRows() 之后**。
     ① 排在 clear* 之后：clearFlagClearance / clearDiaClearance 是按**美术盒**判的，
        挨着两个凹口的树圈会被它们连根删掉（实测 13 棵只剩 11 棵，南边正是雕塑
        两侧那两棵 —— 树圈会豁出一个 206px 的大口子）。放到清理之后再种就没这回事。
     ② 排在 plantRows() **之后**：plantRows 的 treeSpotOK 里也走 treeFreeOfProps，
         树圈先种的话会把行道树顶掉（实测 88 → 87）。反过来让树圈后种，它自己会
         绕开已经站好的行道树（treeFreeOfProps 逐棵查），两边都不亏。
     ③ 之后没有 clear* 再跑，所以树圈是最终态；鸭子是 props 里的引用，排它前面安全。 */
const lawnRing = plantLawnRing();

/* --- 6.7 鸭子下水 --- */
spawnDucks(makeRng(60607));
for (const d of ducks) { d.tag = "duck"; props.push(d); }   // tag 仅供离线探针识别
/* 鱼**不是道具**（见 45_water.js 的 §4.5.3b）：它们在水下，要画在角色下面，
   升级成 props 会参与 baseY 排序，人站到鱼南边时鱼会浮到人身上。
   ⚠️ 参数是**自带的种子**，不蹭上面这把 makeRng(60607) —— 后面 §6.6d 落叶还要用它。 */
spawnFish();

/* --- 6.6d 树下落花 / 落叶 + 地面 mip 金字塔 ---
   ⚠️ 这一节**必须**排在所有 props 摆完之后（§6.6 散射 → §6.6c 冲突清理 → §6.7 鸭子）：
   落叶要知道树在哪。而且它画的是**地面画布**，所以必须在 buildMips() 之前 ——
   mip 是从地面画布降采样出来的，晚一步补的像素就永远进不去 mip
   （缩小到 1/4 以下时落叶会整批消失）。 */
/* ⚠️ 传的是 groundCanvas 的 **2d context**，不是 canvas 本身 ——
   `px()` 第一件事就是 g.fillStyle = ...，传 canvas 进去会报
   "g.fillRect is not a function"，而且是在**加载期**抛，整页 JS 全灭、
   accept/verify 只打出一行静态标题（看着像"没跑"，其实是脚本死了）。 */
const leafTrees = paintLeafFall(groundCanvas.getContext("2d"), props, makeRng(80808));

(function buildMips() {
  mips.push(groundCanvas);
  for (let L = 1; L <= 3; L++) {
    const p = mips[L - 1];
    const m = mkCanvas(Math.ceil(WORLD_W / (1 << L)), Math.ceil(WORLD_H / (1 << L)));
    const g = m.getContext("2d");
    g.imageSmoothingEnabled = true;           // 降采样必须开平滑，否则会整行整列地丢
    g.imageSmoothingQuality = "high";
    g.drawImage(p, 0, 0, p.width, p.height, 0, 0, m.width, m.height);
    mips.push(m);
  }
})();

/* --- 6.8 出生点：南门（G2）门内，沿轴向校园里推进到第一个可走点 ---
   ⚠️ 必须同时要求"界内 + 离墙 > 60"：门洞放行后 canWalk 在 d=0（门中心线上）
   就是真，光判 canWalk 会把人直接生成在边界线上、半个身子在墙外。 */
const SPAWN = (() => {
  const G = GATES.find(g => g.id === "G2") || GATES[0];
  for (let d = 60; d <= 480; d += 4) {
    const y = G.y - d;
    if (canWalk(G.x, y) && !ptBlocked(G.x, y) && insideBoundary(G.x, y) && distToBound(G.x, y) > 60)
      return { x: G.x, y: y };
  }
  return { x: G.x, y: G.y - 200 };
})();

/* --- 6.9 HUD：最近地标 + 坐标 --- */
const _hudEl = document.getElementById("hudpos");
const _landmarks = CAMPUS.filter(e => e[1] === "bld" || e[1] === "siyuan" || e[1] === "library")
  .map(e => ({ n: e[0], x: IX(e[2] + e[4] / 2), y: IX(e[3] + e[5]) }));
function hudTick() {
  if (!_hudEl) return;
  let best = null, bd = 1e9;
  for (const L of _landmarks) {
    const d = (L.x - player.x) ** 2 + (L.y - player.y) ** 2;
    if (d < bd) { bd = d; best = L; }
  }
  _hudEl.textContent = (best ? best.n + "  " : "")
    + "(" + (player.x | 0) + ", " + (player.y | 0) + ")";
}

/* --- 6.10 自检（控制台可查） --- */
console.log("[像素校园] 建筑 " + CAMPUS.filter(e => e[1] === "bld").length
  + " 栋 · 标牌 " + Object.keys(_signCache).length + " 款（" + SIGN_FS + "px）"
  + " · 行道树 " + rowTrees
  + " · 白杨大道 " + aveTrees.planted + "棵(清" + aveTrees.cleared + ")"
  + " · 草坪树圈 " + lawnRing
  + " · 冲突清理 " + clashDropped
  + " · 旗杆净空 " + flagCleared
  + " · 雕塑净空 " + diaCleared
  + " · 草坪清内 " + lawnCleared
  + " · 体育馆台阶净空 " + gymCleared
  + " · 思源楼门前净空 " + dxDoorCleared
  + " · 南门西侧净空 " + swCleared
  + " · 落叶树 " + leafTrees
  /* ⚠️ 2026-09-27：「校名石」从这一行撤了 —— 独立校名石不再摆进世界，
     它的石板嵌进 §6.4 的碑墙里（见 54 段 buildSouthStone() 头注）。石狮仍在。 */
  + " · 保安厅 1 · 校名碑墙 1 · 石狮 1"
  + " · 道具 " + props.length + " · 碰撞盒 " + solids.length
  + " · 世界 " + WORLD_W + "×" + WORLD_H + " · 出生 (" + (SPAWN.x | 0) + ", " + (SPAWN.y | 0) + ")");

/* --- 6.11 操场围网的碰撞盒（parts/37_sports.js §3.7.5 · 第四十五轮 2026-10-10）
   ⚠️ 第四十六轮（2026-10-10）**同一个循环又管了一块地**：用户口径"篮球场四周也是和
      操场一样的围栏围着" ⇒ `opFenceTarget` 扩到校园东半的 bball 一行（逸夫楼北边
      操场**左侧**那块），这里一个字不用改就同时封住了它。
      安全性同款：篮球场那块的格子在占用图里是 `K.BBALL`，而 `scatter()` 只落在
      GRASS / PLAZA / ROAD / FREE 四类格上 ⇒ 晚推盒子照样零散射扰动。
   围网是"网"不是"墙"，但一样挡人：小人不能穿网走进操场（口径同 §6.5g 的网球场围栏，
   用户第七轮原话「加上围栏之后小人不能移动到围栏内了」）。
   ⚠️⚠️ **为什么这一块故意排在文件最末**（而 §6.5g 的网球场盒子排在 scatter() 之前）：
      这个文件里**每一个排在 scatter() 之前的 addSolid 都会挪动 solids**，
      ⇒ `ptBlocked` 变 ⇒ 散射循环里那个"既当计数、又当物种种子"的 `n` 平移
      ⇒ **全校园的树 / 灌木 / 花坛重掷一遍**（§6.6 头部那条地雷），
      而 accept / verify / zoomtest 三套自动验收**一个数都不会变** ——
      唯一的探针是 `_build/_propdiff.py`（必须零差异）。
      而这块地**本来就长不出散射道具**：操场/篮球场的格子在占用图里是
      `K.TRACK` / `K.BBALL`，而 `scatter()` 只落在 GRASS / PLAZA / ROAD / FREE
      四类格子上（§6.6 的三个分支），这两类一格都不碰 ⇒ 盒子早推晚推，散射结果
      **一模一样**。
      所以排在末尾：围栏照样挡人（`solids` 是运行时逐帧现读的），
      而 `_propdiff.py` 保持**零差异** —— 这是本项目"改了地面不动散射"的硬口径。
      顺带也绕开了 §6.7 的 SPAWN 求解（它在 6.6 之后、本来就不该看见这里的盒子）。
   ⚠️ 盒子 = 整个地块的矩形（围网围的就是它），与 37 段画的那圈**同源同式**：
      两边都调 `opFenceTarget(e)` ⇒ 画到哪、挡到哪；CAMPUS 那一行一改，两边一起走。
      （这也保证只会封住**校园东半那两块**：逸夫楼北边的操场 + 它左侧的篮球场；
        西边老体育馆旁那两块操场/篮球场不围、也不挡。） */
for (const e of CAMPUS) if (opFenceTarget(e)) {
  const R = zoneRect(e);
  addSolid(R.x + R.w * 0.5, R.y + R.h, R.w, R.h);
}

/* --- 6.12 观众席（+ 扇形检阅台）的碰撞盒（parts/37_sports.js §3.7.8 · 第四十七轮）
   用户口径（逐字）：「注意到操场左侧是观众席和扇形检阅台」—— 看台是**坐人的实体**，
   不是画在地上的一条花纹，小人不能从它中间穿过去（口径同 §6.5g 的网球场围栏、
   §6.11 的操场围网：用户第七轮原话「加上围栏之后小人不能移动到围栏内了」）。
   ⚠️ 排在**同一个文件的最末**、理由与 §6.11 逐字相同：这个文件里每一个排在
      `scatter()` 之前的 `addSolid` 都会挪动 `solids` ⇒ `ptBlocked` 变 ⇒
      散射循环里那个"既当计数、又当物种种子"的 `n` 平移 ⇒ 全校园散射重掷
      （§6.6 头部的地雷），而 accept / verify / zoomtest **一个数都不会变**。
      这里又比 §6.11 更险一档：看台占的是**老体育馆与操场之间那条人行道**，
      格子在占用图里是 `K.ROAD` / `K.FREE` 那一类 —— **`scatter()` 本来就落在
      这类格子上**（§6.6 的三个分支含 GRASS / PLAZA / ROAD / FREE）。
      ⇒ 这个盒子**必须**晚于 `scatter()`：早推一步，这条道上就会少长出一棵散射树，
      全校园的物种种子跟着平移。排在最末，散射结果与不推盒子**逐字节相同**。
      唯一的探针仍是 `_build/_propdiff.py`（必须零差异）。
   ⚠️ 盒子 = 37 段 `grandstandRect(e)` 现算的那块（含扇形外挑），
      两边调**同一个**函数 ⇒ 画到哪、挡到哪。 */
for (const e of CAMPUS) if (stdTarget(e)) {
  const G = grandstandRect(e);
  addSolid(G.x + G.w * 0.5, G.y + G.h, G.w, G.h);
}
