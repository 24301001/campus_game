# -*- coding: utf-8 -*-
"""操场围网运行时探针（2026-10-10 · 第四十五轮）。

为什么必须单独有一个：本轮给操场加了**围网 + 它的碰撞盒**，而坏法全是静默的 ——
  · 判定"哪个操场要围"的 `opFenceTarget` 要是判反了 ⇒ 西边那个操场被凭空围上、
    东边那个敞着，而 build.py 的静态断言（"函数在不在""盒子排在 scatter 之后"）
    **一条都拦不住** —— 它们钉的是形式，不是"围的是哪一块"。
  · 盒子要是算错行（比如把 `R.y + R.h` 写成 `R.y + R.h * 0.5`），网还画在原地、
    人却能大摇大摆穿网走进操场 —— 图上完全看不出来（图只画地面）。
  · 反过来，盒子要是圈太大，会在地面上凭空多出一堵看不见的墙。

它验五件事，全走真实浏览器（`--dump-dom` 回读 <title>，同 accept.py）：

  P0  CAMPUS 里 track 恰 2 行，且 `opFenceTarget` 只认其中**一行**（东边那个）
  P1  ⭐ 正路：把小人放在东操场南墙外 12px、按住 W 往北跑 200 帧
        ⇒ 必须**被挡在南墙之外**（终 y > 南边界），且确实往北挪动过（不是根本没动）
  P2  ⭐ 挡的**就是那块矩形**：场内中心 = 实体、南墙外 12px = 空、北墙外 12px = 空
        （三点一起验，才能排除"整条南北向都封死了"）
  P3  ⭐ **负对照**：西边那个操场场内中心**不许**是实体 —— 证明只圈了东边那一个
  P4  ⭐ 盒子与围网**同源**：solids 里恰好有一个盒子 ≈ 东操场 zoneRect、且没有一个 ≈ 西操场

用法：`python _build/_opfenceprobe.py`。判读看最后的 `OPF|` 行。"""
import io, os, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, u'像素校园_全校地图.html')
TMP = os.path.join(PROJ, '_opfence_gen.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

HARNESS = """<script>
window.__diag=[];window.onerror=function(m,s,l,c){window.__diag.push(m+'@'+l);};
</script>
"""

TAIL = u"""
<script>
(function(){
  var ok = [], bad = [];
  function chk(name, cond, info){ (cond ? ok : bad).push(name + (info ? '(' + info + ')' : '')); }
  function ROf(e){ return { x: IX(e[2]), y: IX(e[3]), w: IX(e[4]), h: IX(e[5]) }; }

  /* ---------- P0 判据只认一行 ---------- */
  var trk = CAMPUS.filter(function(c){ return c[1] === 'track'; });
  var eastE = trk.filter(function(e){ return opFenceTarget(e); });
  var westE = trk.filter(function(e){ return !opFenceTarget(e); });
  chk('P0 track 恰 2 行、opFenceTarget 只认其中一行',
      trk.length === 2 && eastE.length === 1 && westE.length === 1,
      'track=' + trk.length + ' 围=' + eastE.length);
  if (eastE.length !== 1 || westE.length !== 1) { document.title = 'OPF|BAD'; return; }
  var RE = ROf(eastE[0]), RW = ROf(westE[0]);

  /* ---------- P1 正路：往北走，进不去 ---------- */
  var cxE = RE.x + RE.w / 2, yStart = RE.y + RE.h + 12;
  player.x = cxE; player.y = yStart;
  keys.a = keys.d = keys.w = keys.s = false;
  keys.arrowleft = keys.arrowright = keys.arrowup = keys.arrowdown = false;
  keys.w = true;                                   /* accept.py 同款：w = 负 y = 往北 */
  for (var f = 0; f < 200; f++) update(1 / 60);
  keys.w = false;
  var yEnd = player.y;
  chk('P1 东操场：南墙外按 W 走不进去',
      yEnd > RE.y + RE.h && yEnd < yStart - 3 && !blocked(player.x, player.y),
      'y=' + yEnd.toFixed(1) + ' 南边界=' + (RE.y + RE.h).toFixed(1)
      + ' 起点=' + yStart.toFixed(1));

  /* ---------- P2 挡的就是那块矩形（三点一起验） ---------- */
  var inC = blocked(RE.x + RE.w / 2, RE.y + RE.h / 2);
  var sS  = blocked(RE.x + RE.w / 2, RE.y + RE.h + 12);
  var sN  = blocked(RE.x + RE.w / 2, RE.y - 12);
  var sW  = blocked(RE.x - 12, RE.y + RE.h / 2);
  var sE  = blocked(RE.x + RE.w + 12, RE.y + RE.h / 2);
  chk('P2 场内=实体、四周墙外=空',
      inC === true && !sS && !sN && !sW && !sE,
      '内=' + inC + ' 南=' + sS + ' 北=' + sN + ' 西=' + sW + ' 东=' + sE);

  /* ---------- P3 负对照：西边那个操场不许被封 ---------- */
  chk('P3 西边那个操场没有被封（负对照）',
      blocked(RW.x + RW.w / 2, RW.y + RW.h / 2) === false,
      'blocked=' + blocked(RW.x + RW.w / 2, RW.y + RW.h / 2));

  /* ---------- P4 盒子与围网同源 ---------- */
  function nearBox(R, tol){
    var hit = 0;
    for (var i = 0; i < solids.length; i++) {
      var s = solids[i];
      if (Math.abs(s.x - R.x) < tol && Math.abs(s.y - R.y) < tol
          && Math.abs(s.w - R.w) < tol && Math.abs(s.h - R.h) < tol) hit++;
    }
    return hit;
  }
  var nE = nearBox(RE, 1.5), nW = nearBox(RW, 1.5);
  chk('P4 盒子与围网同源（东=1 个、西=0 个）', nE === 1 && nW === 0, 'E=' + nE + ' W=' + nW);

  document.title = 'OPF|OK[' + ok.length + ']=' + ok.join(' ; ')
                 + '|FAIL[' + bad.length + ']=' + (bad.join(' ; ') || 'none')
                 + '|err=' + (window.__diag.join(',') || 'clean');
})();
</script>
"""


def main():
    html = io.open(SRC, encoding='utf-8').read()
    assert '</body>' in html, '源产物里没有 </body>'
    html = html.replace('<script>', HARNESS + '<script>', 1)
    html = html.replace('</body>', TAIL + '</body>', 1)
    io.open(TMP, 'w', encoding='utf-8', newline='\n').write(html)
    try:
        p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                            '--hide-scrollbars', '--window-size=1200,700',
                            '--dump-dom', 'file:///' + TMP.replace('\\', '/')],
                           capture_output=True, check=False, timeout=180)
        dom = p.stdout.decode('utf-8', 'replace')
    finally:
        # ⚠️ 收尾**逐个精确路径**删（绝不扫描 / 前缀模式）
        if os.path.exists(TMP):
            os.remove(TMP)
    m = re.search(r'<title>(.*?)</title>', dom, re.S)
    t = m.group(1).strip() if m else 'NO TITLE'
    for seg in t.split('|'):
        print(seg.replace(' ; ', '\n  '))


if __name__ == '__main__':
    main()
