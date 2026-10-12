# -*- coding: utf-8 -*-
"""像素校园 —— 无头 Chrome 验收：烘焙耗时 + 逐帧渲染耗时 + JS 错误

用法: python _build/verify.py [产物.html]
      不给路径就量 源码\像素校园_全校地图.html。
      ⚠️ 计时受外部 CPU 负载支配（实测同一份产物 worst 帧在 3.4~17.2ms 之间跳），
         所以**判断"这轮改动拖慢了吗"必须 A/B 交替跑**（新-旧-新-旧），
         看的是两组的中位数差，不是某一趟的绝对值。
注意: **不能**用 --virtual-time-budget —— 虚时间下 performance.now() 不推进,
计时会全部读成 0.00ms。这里改成同步测量: 注入脚本记 t0, 尾脚本跑完主脚本后
立刻取差值, 随后同步跑渲染基准, 结果写进 <title>, 由 --dump-dom 取回。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC  = sys.argv[1] if len(sys.argv) > 1 else os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

HARNESS = """<script>
window.__diag=[];window.onerror=function(m,s,l,c){window.__diag.push('ERR '+m+' @'+l+':'+c);};
window.__t0 = performance.now();
</script>
"""

TAIL = """
<script>
/* 本块在主脚本之后、load 之前同步执行 —— 全部资源已就绪，且不依赖虚时间 */
(function(){
  var err = window.__diag.join(' || ') || 'clean';
  var bake = performance.now() - window.__t0;
  /* 把玩家钉在几个信息量最大的位置，逐帧计时（丢掉前 10 帧预热） */
  var spots = [[2004,2474],[4067,1420],[2024,1431],[3300,1500],[1200,2600]];
  function camTo() {                     /* 与主循环同一套 zoom 感知夹取 */
    cam.x = Math.max(0, Math.min(player.x - viewW / 2,    Math.max(0, WORLD_W - viewW)));
    cam.y = Math.max(0, Math.min(player.y - viewH * 0.62, Math.max(0, WORLD_H - viewH)));
  }
  /* 全部档位都测：FIT 档（索引 0）是最高风险场景 —— 全图道具都在视口内 */
  var rows = [];
  for (var zi = 0; zi < ZOOM_STEPS.length; zi++) {
    setZoom(zi);
    var worst = 0, tot = 0, n = 0;
    for (var s = 0; s < spots.length; s++) {
      player.x = spots[s][0]; player.y = spots[s][1];
      camTo();
      for (var i = 0; i < 60; i++) {
        var a = performance.now();
        render();
        var d = performance.now() - a;
        if (i >= 10) { if (d > worst) worst = d; tot += d; n++; }
      }
    }
    rows.push((zoom >= 1 ? zoom + 'x' : Math.round(zoom * 100) + '%')
              + ':' + worst.toFixed(2) + '/' + (tot / n).toFixed(2));
  }
  setZoom(ZOOM_STEPS.indexOf(1));        /* 还原默认档，别影响后续截图 */
  /* 屋名标牌自检：每个「具名建筑」都必须拿到一块牌面（_signCache 里非 null）。
     漏一块就是字体没拿到字形（makeSign 返回 null）——那栋楼会静悄悄地没名字。 */
  var wantNames = {}, want = 0, got = 0, missing = [];
  for (var ci = 0; ci < CAMPUS.length; ci++) {
    var kd = CAMPUS[ci][1];
    if (kd !== 'bld' && kd !== 'library') continue;      /* 思源楼例外：冻结精灵自带题字 */
    if (!wantNames[CAMPUS[ci][0]]) { wantNames[CAMPUS[ci][0]] = 1; want++; }
  }
  for (var k in _signCache) if (_signCache[k]) got++;
  for (var k2 in wantNames) if (!_signCache[k2]) missing.push(k2);
  document.title = 'DIAG|bake=' + bake.toFixed(0) + 'ms'
                 + '|signs=' + got + '/' + want + (missing.length ? ' MISS:' + missing.join('/') : ' ok')
                 + '|props=' + props.length + '|solids=' + solids.length
                 + '|world=' + WORLD_W + 'x' + WORLD_H
                 + '|spawn=' + Math.round(SPAWN.x) + ',' + Math.round(SPAWN.y)
                 + '|mips=' + mips.length + ',' + mips[3].width + 'x' + mips[3].height
                 + '|WORST/AVG  ' + rows.join('  ') + '|' + err;
})();
</script>
"""


def main():
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('<script>', HARNESS + '<script>', 1)
    html = html.replace('</body>', TAIL + '</body>', 1)
    tmp = os.path.join(HERE, '_verify_gen.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(html)

    runs = []
    for _ in range(3):
        p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                            '--hide-scrollbars', '--window-size=1480,900',
                            '--dump-dom', 'file:///' + tmp],
                           capture_output=True, check=False)
        dom = p.stdout.decode('utf-8', 'replace')
        m = re.search(r'<title>(.*?)</title>', dom, re.S)
        runs.append(m.group(1).strip() if m else 'NO TITLE (' + str(len(dom)) + ' bytes)')
    for r in runs:
        print(r)


main()
