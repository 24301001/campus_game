# -*- coding: utf-8 -*-
"""像素校园 —— 缩放交互验收（滚轮 / 按键 / HUD 按钮 / 相机夹取 / 帧循环健壮性）

用法: python _build/zoomtest.py
结果写进 <title>，由 --dump-dom 取回。同 verify.py：不要用 --virtual-time-budget。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC  = os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

HARNESS = """<script>
window.__diag=[];window.onerror=function(m,s,l,c){window.__diag.push('ERR '+m+' @'+l+':'+c);};
</script>
"""

TAIL = """
<script>
(function(){
  var out = [], bad = 0, n = 0;
  function ck(name, ok, info) { n++; if (!ok) bad++; out.push((ok ? 'OK ' : 'FAIL ') + name
      + (info ? '(' + info + ')' : '')); }
  var IDX1 = ZOOM_STEPS.indexOf(1);
  function wheel(dy) { window.dispatchEvent(new WheelEvent('wheel',
      { deltaY: dy, cancelable: true, bubbles: true })); }
  function key(k) { window.dispatchEvent(new KeyboardEvent('keydown',
      { key: k, cancelable: true, bubbles: true })); }
  function click(z) { document.querySelector('#zoom button[data-z="' + z + '"]').click(); }
  function camTo() {                       /* 主循环同款 zoom 感知夹取 */
    cam.x = Math.max(0, Math.min(player.x - viewW / 2,    Math.max(0, WORLD_W - viewW)));
    cam.y = Math.max(0, Math.min(player.y - viewH * 0.62, Math.max(0, WORLD_H - viewH)));
  }

  var TOP = ZOOM_STEPS.length - 1;
  /* 每条检查都从 1× 重新出发、期望值按上下限夹取 ——
     否则前一条在顶端被夹住会连锁影响后面所有相对期望（踩过一次）。 */
  function zexp(k) { return Math.min(Math.max(IDX1 + k, 0), TOP); }
  function wtest(label, dy, k) {
    setZoom(IDX1); wheel(dy);
    ck(label, zoomI === zexp(k), 'zoomI=' + zoomI + ' 期望 ' + zexp(k));
  }
  function ktest(label, keyName, k) {
    setZoom(IDX1); key(keyName);
    ck(label, zoomI === zexp(k), 'zoomI=' + zoomI + ' 期望 ' + zexp(k));
  }
  function ctest(label, z, k) {
    setZoom(IDX1); click(z);
    ck(label, zoomI === zexp(k), 'zoomI=' + zoomI + ' 期望 ' + zexp(k));
  }
  wtest('滚轮上 = 放大一档', -100, 1);
  wtest('滚轮下 = 缩小一档',  100, -1);
  ktest('按键 +  = 放大', '+', 1);
  ktest('按键 =  = 放大', '=', 1);
  ktest('按键 ]  = 放大', ']', 1);
  ktest('按键 -  = 缩小', '-', -1);
  ktest('按键 _  = 缩小', '_', -1);
  ktest('按键 [  = 缩小', '[', -1);
  /* 连按 12 次真正测一次两端夹取（单次按键只走一档，到不了顶） */
  setZoom(IDX1); for (var t1 = 0; t1 < 12; t1++) key(']');
  ck('顶端连按放大 = 夹在 3×', zoomI === TOP, 'zoomI=' + zoomI);
  setZoom(IDX1); for (var t2 = 0; t2 < 12; t2++) key('[');
  ck('底端连按缩小 = 夹在整幅', zoomI === 0, 'zoomI=' + zoomI);
  ctest('按钮 +  = 放大',  '1', 1);
  ctest('按钮 -  = 缩小', '-1', -1);

  /* --- 滑条 --- */
  var rg = document.getElementById('zrng');
  function drag(v) { rg.value = v; rg.dispatchEvent(new Event('input', { bubbles: true })); }
  ck('滑条上限 = 档位数-1', Number(rg.max) === ZOOM_STEPS.length - 1,
     'max=' + rg.max);
  ck('放大封顶 = 3×（用户定的）',
     ZOOM_STEPS[ZOOM_STEPS.length - 1] === 3, 'top=' + ZOOM_STEPS[ZOOM_STEPS.length - 1]);
  drag(0);   ck('滑到最左 = 整个校园', zoomI === 0 && viewW >= WORLD_W - 1,
                'zoomI=' + zoomI + ' view=' + Math.round(viewW));
  drag(8);   ck('滑到最右 = 3×', zoomI === 8 && zoom === 3, 'zoomI=' + zoomI);
  drag(3);   ck('拖到中间档 = 25%', Math.abs(zoom - 0.25) < 1e-9, 'zoom=' + zoom);
  click('1'); ck('点按钮后滑条跟着走', Number(rg.value) === zoomI,
                 'rng=' + rg.value + ' zoomI=' + zoomI);
  key('0');   ck('按 0 后滑条跟着走', Number(rg.value) === 0 && zoomI === 0,
                 'rng=' + rg.value);
  setZoom(IDX1);
  var px0 = player.x, py0 = player.y;
  rg.focus();
  rg.dispatchEvent(new KeyboardEvent('keydown',
      { key: 'ArrowLeft', cancelable: true, bubbles: true }));
  ck('滑条聚焦时方向键不去推人物', player.x === px0 && player.y === py0,
     'dx=' + (player.x - px0) + ' dy=' + (player.y - py0));
  rg.blur();

  /* 档位夹取：在两端继续缩/放不应越界 */
  setZoom(0); key('-'); wheel(100);
  ck('已在最小档时继续缩小 = 不动', zoomI === 0, 'zoomI=' + zoomI);
  ck('最小档 = 整幅铺满', viewW >= WORLD_W - 1 && viewH >= WORLD_H - 1,
     'view=' + Math.round(viewW) + 'x' + Math.round(viewH));
  setZoom(ZOOM_STEPS.length - 1); key('+'); wheel(-100);
  ck('已在最大档时继续放大 = 不动', zoomI === ZOOM_STEPS.length - 1, 'zoomI=' + zoomI);

  /* 全档位健壮性：每档 update + render 若干帧，相机必须始终在世界内且非 NaN */
  var spots = [[2005,2426],[2024,1431],[4067,1420],[1200,2600]];
  var badCam = 0, sped = '';
  for (var zi = 0; zi < ZOOM_STEPS.length; zi++) {
    setZoom(zi);
    var want = BASE_SPEED / Math.max(1, zoom);
    if (player.speed !== want) sped += '!' + zi;
    for (var s = 0; s < spots.length; s++) {
      player.x = spots[s][0]; player.y = spots[s][1];
      for (var i = 0; i < 20; i++) {
        update(1 / 60); render();
        if (!isFinite(cam.x) || !isFinite(cam.y)) { badCam++; continue; }
        if (cam.x < -1e-6 || cam.y < -1e-6) badCam++;
        if (cam.x > Math.max(0, WORLD_W - viewW) + 1e-6) badCam++;
        if (cam.y > Math.max(0, WORLD_H - viewH) + 1e-6) badCam++;
      }
    }
  }
  ck('全档位相机始终在世界内（非负、不超界、非 NaN）', badCam === 0, 'bad=' + badCam);
  ck('行走速度补偿正确（≥1× 恒定屏幕速度）', sped === '', sped || 'all-ok');

  /* FIT 档相机必须钉在原点（否则会露出世界外的空白） */
  setZoom(0); player.x = 2024; player.y = 1431; camTo();
  ck('整幅档相机钉在 (0,0)', cam.x === 0 && cam.y === 0,
     'cam=' + cam.x + ',' + cam.y);

  /* 渲染不得抛异常，且画布上确实有内容（非全空） */
  var threw = '';
  try { for (var q = 0; q < 5; q++) { update(1 / 60); render(); } }
  catch (e) { threw = e.message; }
  ck('FIT 档渲染不抛异常', threw === '', threw);
  var nonzero = -1, gErr = '';
  try {
    var img = ctx.getImageData(0, 0, VIEW_W, VIEW_H).data;
    nonzero = 0;
    for (var b = 3; b < img.length; b += 4 * 97) if (img[b] > 0) nonzero++;
  } catch (e) { gErr = e.message; }
  ck('FIT 档画布非空（无整片透明 → 无夹取越界/透明缝）', nonzero > 50,
     gErr ? gErr : ('alphaSamples=' + nonzero));

  setZoom(IDX1);
  document.title = (bad ? 'ZOOMFAIL' : 'ZOOMOK') + '[' + (n - bad) + '/' + n + ']'
    + ' ' + out.join(' ; ') + ' || ' + (window.__diag.join(' || ') || 'clean');
})();
</script>
"""


def main():
    sys.stdout.reconfigure(errors='replace')   # 控制台是 GBK，标题里有 U+2212 等字符
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('<script>', HARNESS + '<script>', 1)
    html = html.replace('</body>', TAIL + '</body>', 1)
    tmp = os.path.join(HERE, '_zoomtest_gen.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(html)
    for _ in range(2):
        p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                            '--hide-scrollbars', '--window-size=1480,900',
                            '--dump-dom', 'file:///' + tmp],
                           capture_output=True, check=False)
        dom = p.stdout.decode('utf-8', 'replace')
        m = re.search(r'<title>(.*?)</title>', dom, re.S)
        print(m.group(1).strip() if m else 'NO TITLE (%d bytes)' % len(dom))


main()
