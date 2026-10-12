# -*- coding: utf-8 -*-
"""五星红旗**风动**探针：证明旗面真的在逐帧变，且星星没从布上浮起来。

为什么非要有这么个东西：accept / verify / zoomtest 三套**都查不出"旗子没动"** ——
静态旗面照样 13/13、照样 props=285。这里做三件事：
  ① 逐列核对：第 i 帧每一列的"填充像素集合"必须 = 第 0 帧同列集合整体平移
     (clothDY(r,i) − clothDY(r,0))。**布面与星子都含在这个集合里**，所以只要星星
     用了另一套 dy（哪怕差半列），这一列就对不上 → 立刻报 bad。
  ② 数不同的帧：16 帧必须两两不同，否则等于白烘。
  ③ 换帧通路：直接摆 flagPhase 并调 animateFlag(0)，看 flagProp.img 是不是
     就是 flagFrames[phase]（走的是主循环真正走的那条路，不是另写一遍）。
  ④ 出一张 8×2 的帧条 + 4 张整只台子的放大图，肉眼过一遍。

用法：python _flaganim.py [倍率=3] [out]
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, u'像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT = os.path.join(HERE, '_flaganim_gen.html')

Z = int(sys.argv[1]) if len(sys.argv) > 1 else 3
PNG = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, '_look', 'flag_anim.png')
# ⚠️ 必须绝对路径（chrome 的 --screenshot 相对它自己的 cwd 落文件，给相对路径会静默出旧图）
if not os.path.isabs(PNG):
    PNG = os.path.join(HERE, PNG)

PROBE = r"""
<script>
(function(){
  var LOG = [];
  function bad(s){ LOG.push('BAD:' + s); }
  try {
  window.__probe_err = '';

  /* ---- ① 逐列平移核对 ----
     ⚠️ 扫描窗口要绕开**杆与顶球**：x33 是杆身（整列实心，必然污染），x34/x35 在
        顶球（y5..11）的半径内。所以 r=0 整列跳过、r≤2 把上沿抬到 y12 以下。
        布面 dy ∈ [−3,3]，所以 r≥3 用 y9 起（最低的布顶在 y11）不会截头。 */
  function colFill(g, r) {
    var x = flagX(FLAG_CX + 1 + r);
    var y0 = (r <= 2) ? flagY(FLAG_FT) - 2 : flagY(FLAG_FT) - 5, y1 = flagY(FLAG_FT) + FLAG_FH + 5;
    var d = g.getImageData(x, y0, 1, y1 - y0).data, out = [];
    for (var i = 0; i < (y1 - y0); i++) if (d[i * 4 + 3] > 0) out.push(y0 + i);
    return out;
  }
  var G = flagFrames.map(function(c){ return c.getContext('2d'); });
  var D = [];
  for (var i = 0; i < FLAG_FRAMES; i++) {
    var row = [];
    for (var r = 0; r < FLAG_FW; r++) row.push(clothDY(r, i / FLAG_FRAMES));
    D.push(row);
  }
  var nbad = 0, thin = 0, n = 0;
  for (var r = 1; r < FLAG_FW; r++) {
    var a = colFill(G[0], r);
    if (a.length !== FLAG_FH) { thin++; if (thin < 4) bad('col' + r + ' 布厚 ' + a.length + '≠' + FLAG_FH); }
    for (var i = 1; i < FLAG_FRAMES; i++) {
      var b = colFill(G[i], r), d = D[i][r] - D[0][r];
      if (a.length !== b.length) { bad('col' + r + ' f' + i + ' 像素数不同'); nbad++; continue; }
      for (var k = 0; k < a.length; k++)
        if (b[k] !== a[k] + d) { bad('col' + r + ' f' + i + ' 平移量≠clothDY(' + d + ')'); nbad++; break; }
      n++;
    }
  }
  /* 每帧的"逐列顶边 + 顶边颜色"签名必须两两不同（颜色也算：只有明暗变、位置不变也算动） */
  var uniq = {};
  for (var i = 0; i < FLAG_FRAMES; i++) {
    var s = [];
    for (var r = 1; r < FLAG_FW; r++) { var f = colFill(G[i], r); s.push(f[0] || 0); }
    var px0 = G[i].getImageData(flagX(FLAG_CX + 1 + 30), flagY(FLAG_FT) + 20, 1, 1).data;
    s.push(px0[0] + '.' + px0[1] + '.' + px0[2]);
    uniq[s.join(',')] = 1;
  }

  /* ---- ③ 换帧通路：走主循环真正走的那条 ---- */
  var swapBad = 0;
  for (var i = 0; i < FLAG_FRAMES; i++) {
    flagPhase = i; flagFrameI = -1;
    animateFlag(0);
    if (!flagProp || flagProp.img !== flagFrames[i]) swapBad++;
  }
  if (!flagProp) bad('animateFlag 找不到 tag=flag 的道具');

  /* ---- ③b 坏 dt 回归（2026-09-13 Edge 整页定格事故） ----
     主循环首帧 dt 可能是负极（last 在整页烘焙之后求值，而 rAF 首帧的 now 更早）→
     flagPhase 转负 → **JS 的 % 对负数返回负数**（floor(-22.02) % 16 = -7，不是 9）→
     flagFrames[-7] = undefined → flagProp.img 被写成 undefined → 下一帧 render 死在
     p.img.width → 异常抛在 requestAnimationFrame(loop) 之前 → rAF 断链 → 整页永久定格。
     accept/verify/zoomtest 三套**都查不出这条**（它们不喂坏输入，也不看 img 身份）。
     所以这里把三种坏输入直接打进去，img 必须挺住 —— 旗子可以不动，页面不能死。 */
  var keep = flagProp && flagProp.img;
  function dtTrial(name, v, n) {
    flagT = 0; flagPhase = 0; flagFrameI = -1;
    for (var k = 0; k < n; k++) animateFlag(v);
    if (!flagProp.img || !flagProp.img.width) bad(name + ' 把 flagProp.img 打成 ' + flagProp.img);
  }
  if (!keep) bad('③b 起手就没有 img（前面的检查先炸了）');
  else {
    dtTrial('负 dt×90', -0.0167, 90);
    dtTrial('大负 dt×90', -1.5, 90);
    dtTrial('NaN dt×90', NaN, 90);
    flagT = 0; flagPhase = -22.0179; flagFrameI = -1;      // 事故现场的相位值
    animateFlag(0);
    if (!flagProp.img || !flagProp.img.width) bad('flagPhase=-22.02 换帧取到了 undefined');
    flagProp.img = keep; flagT = 0; flagPhase = 0; flagFrameI = -1;
  }

  /* ---- ⑤ 端到端：强制相位 → 走**真渲染** → 采样主画布 ----
     前面 ③ 只证明 flagProp.img 被换掉了；这里证明那个 img 真的落到了画面上
     （换帧若被某处缓存/裁剪挡掉，这条会炸）。 */
  var sx = 2000, sy = 1450;
  function sampleCol(ph) {
    cam.x = sx; cam.y = sy;
    flagPhase = ph; flagFrameI = -1; animateFlag(0);
    render();
    var d = ctx.getImageData(FLAG_CX + 31 - sx, FLAG_FT - 4 - sy, 1, 14).data, s = [];
    for (var k = 0; k < 14; k++) s.push(d[k * 4] + ',' + d[k * 4 + 1] + ',' + d[k * 4 + 2]);
    return s.join('|');
  }
  function reds(s) {
    return s.split('|').filter(function(v){ var c = v.split(','); return +c[0] > 120 && +c[1] < 110; }).length;
  }
  var ea = sampleCol(0), eb = sampleCol(8);
  if (ea === eb) bad('端到端：相位 0 与 8 渲染出的旗面像素**完全一样**（换帧没走到屏幕）');
  if (reds(ea) === 0 || reds(eb) === 0) bad('端到端：采样列里没有红像素 → 采样点没落在旗面上，这条是空过的');
  LOG.push('E2E 红旗像素 f0=' + reds(ea) + ' f8=' + reds(eb) + '/14');

  /* ---- ④ 出图 ---- */
  var CW = FLAG_FW + 8, CH = FLAG_FH + 18, GAP = 6;
  var W = (CW * 3 + GAP) * 8 + GAP, H = (CH * 3 + GAP) * 2 + GAP;
  var FH = 214 * 2, FW = 108 * 2, ROW2 = FW * 4 + GAP * 5;
  W = Math.max(W, ROW2);
  var cv = document.createElement('canvas');
  cv.width = W; cv.height = H + FH + GAP * 2;
  var g = cv.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.fillStyle = '#5b6b3a'; g.fillRect(0, 0, cv.width, cv.height);
  for (var i = 0; i < FLAG_FRAMES; i++) {
    var cx = GAP + (i % 8) * (CW * 3 + GAP), cy = GAP + Math.floor(i / 8) * (CH * 3 + GAP);
    g.drawImage(flagFrames[i], flagX(FLAG_CX + 1) - 4, flagY(FLAG_FT) - 9, CW, CH, cx, cy, CW * 3, CH * 3);
    g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 1; g.strokeRect(cx + 0.5, cy + 0.5, CW * 3 - 1, CH * 3 - 1);
  }
  for (var j = 0; j < 4; j++) {
    var i2 = j * 4, dx = GAP + j * (FW + GAP), dy = H + GAP * 2;
    g.drawImage(flagFrames[i2], 0, 0, 108, 214, dx, dy, FW, FH);
    g.strokeStyle = 'rgba(255,255,255,0.45)'; g.strokeRect(dx + 0.5, dy + 0.5, FW - 1, FH - 1);
  }
  document.body.style.margin = '0'; document.body.innerHTML = '';
  document.body.appendChild(cv);

  LOG.unshift('CHECK ' + n + ' 列×帧 / bad=' + nbad + ' / 布厚异常=' + thin
              + ' / 不同帧=' + Object.keys(uniq).length + '/' + FLAG_FRAMES
              + ' / 换帧错=' + swapBad);
  document.title = 'FLAG|' + cv.width + 'x' + cv.height + '|' + LOG.join(' ');
  } catch (e) {
    document.title = 'FLAG|0x0|THROW ' + (e && e.message) + ' @' + (e && e.stack ? String(e.stack).split('\n')[1] : '');
  }
})();
</script>
"""

html = io.open(SRC, encoding='utf-8').read()
assert '</body>' in html
html = html.replace('</body>', PROBE + '</body>')
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)

p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--dump-dom', 'file:///' + OUT.replace('\\', '/')],
                   capture_output=True, check=False)
m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
if not m:
    print('NO TITLE（整页 JS 没跑？）')
    sys.exit(1)
title = m.group(1)
print('title:', title)
wh = title.split('|')[1].split('x')

p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--window-size=%s,%s' % (wh[0], wh[1]),
                    '--screenshot=' + PNG, 'file:///' + OUT.replace('\\', '/')],
                   capture_output=True, check=False)
print(PNG, os.path.getsize(PNG) if os.path.exists(PNG) else 'MISSING')
