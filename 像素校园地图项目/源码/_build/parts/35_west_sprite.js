/* =========================================================================
   §6.2b 楼体资源：西侧一列七栋换成「按正面图画」的精灵
   -------------------------------------------------------------------------
   用户 2026-11-07：「现有本地地图文件上这几栋楼依次从上到下用生成的图片替换。
   从上到下分别是：建艺楼、15号宿舍楼、9号宿舍楼、8号宿舍楼、研究中心、
   12号宿舍楼、2号宿舍楼」。

   这一列就是 CAMPUS 里 x = 1.5986 的那七行（最北一栋 `建筑艺术学院`，
   往南六行都叫 `宿舍`）。顺序按**世界 y 从小到大**（北 → 南）＝ 屏幕从上到下：
       0 建筑艺术学院 → 楼体资源/buildings/01_jianyi.js
       1 第一行宿舍   → 12_d15.js
       2 第二行宿舍   → 10_d9.js
       3 第三行宿舍   → 11_d8.js
       4 第四行宿舍   → 09_yanjiu.js
       5 第五行宿舍   → 07_d12.js
       6 第六行宿舍   → 05_d19.js（2026-11-07 第二轮：12号楼下方换成19号宿舍楼）

   ⚠️ 只换精灵，**不动 b.w** —— 占地宽、addSolid 的碰撞盒、footprint 全部保持
      30_building.js 算出来的原值 ⇒ 全校园散射随机流一个数都不变（§6.6 那颗地雷，
      唯一探针 `_propdiff.py`）。
   ⚠️ b.ax / b.ay 必须换成精灵**自己**的锚点：render() 按 `y - ay` 落笔，
      留 30 段的旧 baseY 会把整栋楼上下错位（生成精灵的屋面高度与地图模板不同）。
   ⚠️ 楼名仍是 CAMPUS 里的 `宿舍`，不改数据 —— 站点词典 / 向导 / 猫的领地里
      都按这个名字找楼，改了会连带错位。楼名牌由精灵自己画（spec 里 sign:false）。
   ========================================================================= */
const WEST_SPRITE_X = 1.5986;
/* ⚠️ 换图之后「立面还能不能看见」取决于精灵画布比 30 段模板高多少：
   模板给每栋的锚高 ay 都是 318（最北那栋 284），而这批精灵是按真实层数画的 —
   6 层的 15号/12号 ay = 354/348（屋面厚 132），比模板高 36 行，于是整列的可视
   带被南邻的屋面吃掉 36 行；4 层的建艺楼（ay 238）和 3 层的研究中心（ay 252）
   立面恰好整段落到南邻屋面后面，屏幕上只剩一条灰屋面。

   这两行按 61 段 KX_DY=85 的老办法**只把 b.ay 调大**（整栋在画面上北移）：
   b.y（世界落地线）、addSolid 的碰撞盒、footprint、散射随机流全都不动。
   抬起来露出的立面正好压在南邻的屋面上，抬离地面的那几十行也全部落在南邻
   精灵的覆盖范围里（建艺楼 → 15号 999 行起、研究中心 → 12号 1887 行起），
   所以看不到悬空。数值 = 让立面在南邻屋脊之上露出约两层（≈60 行）：
     建艺楼   ay 238 → 328   (15号屋脊在 999，立面 61 行可见)
     研究中心 ay 252 → 337   (12号屋脊在 1887，立面 60 行可见)

   用户 2026-11-07 第三轮：「8号、9号公寓楼上移一点，15号下移一点」。
   9号/8号是 3 层小楼（ay 140/174），整段立面被南邻的屋脊吃掉，只剩屋瓦；
   同样只抬 b.ay（负数 = 下移）。抬/压的每一行都落在邻栋精灵的覆盖里：
     15号  ay 354 → 328（下移 26：屋面顶 999 → 1025，露出建艺楼 88 行立面）
     9号   ay 140 → 200（上移 60：可见底 1507，正好被 8号新屋脊 1506 压住）
     8号   ay 174 → 270（上移 96：屋脊 1506、可见底 1680，研究中心屋脊 1676 接住）
   ⚠️ 8号/9号的数值是配对的：DY9 每加 1 行，DY8 至少也要加 1 行，否则两条画布
      之间会露出一条假"地面缝"（9号底面悬空 60 行的那截本来就靠 8号盖住）。 */
const WEST_SPRITE_DY = {
  "01-jianyi": 90, "12-d15": -26, "10-d9": 60, "11-d8": 96, "09-yanjiu": 85
};
/* 19号宿舍楼原始画布 572×447（ay 412）：占地只有 461×160，按原尺寸贴上去会左右
   各压出 55px、并把北邻 12号楼 的立面吃掉一截。0.8 之后画布 458×358（ay 330），
   宽几乎正好等于占地，和换之前的 2号宿舍楼（模板 ay 318）只差 12 行 —— 遮挡关系
   与用户现在看到的基本一致。
   ⚠️ 缩放只缩画布，不缩 b.w / 碰撞盒；ax / ay 同步乘 q（锚点跟着画布走）。 */
const WEST_SPRITE_SCALE = { "05-d19": 0.8 };
const WEST_SPRITE_IDS = [
  "01-jianyi",   // 建筑艺术学院（最北）
  "12-d15",      // 15号宿舍楼
  "10-d9",       // 9号宿舍楼
  "11-d8",       // 8号宿舍楼
  "09-yanjiu",   // 研究中心
  "07-d12",      // 12号宿舍楼
  "05-d19"       // 19号宿舍楼（最南；用户 2026-11-07：12号楼下方换成19号）
];

function westSpriteSpec(e) {
  if (e[1] !== "bld" || Math.abs(e[2] - WEST_SPRITE_X) > 1e-6) return null;
  /* 按同一列里的 y 升序排名：CAMPUS 表的书写顺序是南 → 北，不能直接拿来用。 */
  const rows = CAMPUS
    .filter(c => c[1] === "bld" && Math.abs(c[2] - WEST_SPRITE_X) <= 1e-6)
    .sort((a, b) => a[3] - b[3]);
  const id = WEST_SPRITE_IDS[rows.indexOf(e)];
  if (!id) return null;
  const lib = window.PC_BUILDINGS || [];
  for (let i = 0; i < lib.length; i++) if (lib[i].id === id) return lib[i];
  return null;
}

/* 画布缩放：imageSmoothingEnabled = false 保住像素块，锚点按同一比例走。
   ⚠️ 倍数只在 WEST_SPRITE_SCALE 里登记；没登记的楼原尺寸返回，逐字节不变。 */
function westSpriteScaled(s, id) {
  const q = WEST_SPRITE_SCALE[id];
  if (!q || q === 1) return s;
  const w = Math.round(s.canvas.width * q), h = Math.round(s.canvas.height * q);
  const c = mkCanvas(w, h), g = c.getContext("2d");
  g.imageSmoothingEnabled = false;
  g.drawImage(s.canvas, 0, 0, w, h);
  return { canvas: c, ax: Math.round(s.ax * q), ay: Math.round(s.ay * q) };
}

function westSpriteApply(e, b) {
  const item = westSpriteSpec(e);
  if (!item) return false;
  const s = westSpriteScaled(PC.make(item.spec), item.id);
  b.canvas = s.canvas;
  b.ax = s.ax;
  b.ay = s.ay + (WEST_SPRITE_DY[item.id] || 0);
  return true;
}
