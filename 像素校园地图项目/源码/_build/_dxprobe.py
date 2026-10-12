# -*- coding: utf-8 -*-
"""思源东楼 / 思源西楼 现状精灵放大 + 几何实测 —— 「门的覆盖重绘」专用。
※ 临时工具，用完删。

为什么必须实测而不能离线算：
  · doorSide = (bSeed % 2) ? 0.18 : -0.18 —— bSeed 取决于它在 CAMPUS 里是第几个
    合格的 bld（每栋 +1），数错了门就画偏一整列；
  · depth 传的是 zoneRect 的浮点 R.h，roofT = clamp(round(depth*0.6),20,190) 在
    104 / 114 这两档上取整方向不同；
  · SUN.x / SUN.y 决定 SHY，那是画布高的一部分。
  ⇒ 直接问页面要 props，拿到的就是真值。
"""
import io, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
_LOOK = os.path.join(HERE, '_look') + os.sep
os.makedirs(_LOOK, exist_ok=True)

# 两栋楼是通用建筑，addProp 时 tag 是 undefined ⇒ 只能按"精灵宽 + 锚点"三元组认。
# 单看宽度会撞车（同宽 423/513 的楼一大把），加上 ax/ay 就唯一了 ——
# 它们直接来自 CAMPUS 比例：ax = IX(x)+IX(w)/2、ay = IX(y)+IX(h)（实测已核对）。
#   ⚠️ ay 是**跟着层数走的**（ay = baseY = H − 35，H = PADT+roofT+floors*34+SHY+14）：
#      第四轮 3 层 → 8 层后，两栋的 H 由 259/269 变 429/439，ay 也由 224/234 变 394/404；
#      第十六轮 8 层 → 6 层（"减少两层、不动塔顶"）后，H 变 361/371、ay 变 326/336。
#      ⚠️ **eaveY 不随层数变**（= PADT + roofT）：屋面与塔尖在精灵局部坐标里原地不动，
#         只是精灵变矮、屏幕落地线不动 ⇒ 塔尖整体在屏幕上下移 68 行。
#      这一栏是**幂等断言**不是备注：认不到楼（FOUND 0）就是层数/几何被改了，先查这里。
#   东楼 ["思源东楼",…,5.8833,3.2215,0.9486,0.4437] → 423x361 / ax 211.5 / ay 326
#   西楼 ["思源西楼",…,3.1125,3.2076,1.1792,0.4854] → 513x371 / ax 256.5 / ay 336
WANT = [[423, 211.5, 326], [513, 256.5, 336]]

TAIL = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    var S = %(S)d, want = %(W)s, got = [];
    for (var i=0;i<props.length;i++){
      var p = props[i], hit = false;
      for (var j=0;j<want.length;j++)
        if (p.img.width === want[j][0] && p.ax === want[j][1]
            && p.ay === want[j][2]) hit = true;
      if (hit) got.push(p);
    }
    var info = [];
    for (var k=0;k<got.length;k++){
      var p = got[k];
      info.push('img=' + p.img.width + 'x' + p.img.height
                + ' ax=' + p.ax + ' ay=' + p.ay
                + ' world=' + Math.round(p.x) + ',' + Math.round(p.y)
                + ' left=' + Math.round(p.x - p.ax));
    }
    /* 纵向并排、留 16px 间隙；每张上面画一条 baseY 横线（= p.ay） */
    var GAP = 16, y = GAP, W = 0;
    for (var k=0;k<got.length;k++) W = Math.max(W, got[k].img.width * S);
    var H = GAP;
    for (var k=0;k<got.length;k++) H += got[k].img.height * S + GAP + 14;
    var c2 = document.createElement('canvas');
    c2.width = W + GAP * 2; c2.height = H;
    var g2 = c2.getContext('2d');
    g2.imageSmoothingEnabled = false;
    g2.fillStyle = '#20242c'; g2.fillRect(0, 0, c2.width, c2.height);
    for (var k=0;k<got.length;k++){
      var p = got[k], iw = p.img.width * S, ih = p.img.height * S;
      var ox = GAP, oy = y;
      for (var yy=0;yy<ih;yy+=8) for (var xx=0;xx<iw;xx+=8)
        { g2.fillStyle = (((xx/8+yy/8)|0)%%2) ? '#3a3f48' : '#2c3138';
          g2.fillRect(ox+xx, oy+yy, 8, 8); }
      g2.drawImage(p.img, ox, oy, iw, ih);
      g2.fillStyle = '#ff4488'; g2.fillRect(ox, oy + p.ay * S, iw, 1);   // 落地线
      g2.fillStyle = '#44ff88'; g2.fillRect(ox, oy, iw, 1);               // 画布顶
      g2.fillStyle = '#ffffff'; g2.font = '12px monospace';
      g2.fillText('#' + k + '  ' + p.img.width + 'x' + p.img.height
                  + '  ay=' + p.ay + '  S=' + S, ox, oy + ih + 11);
      y = oy + ih + GAP + 14;
    }
    document.body.innerHTML = '';
    document.body.style.margin='0'; document.body.style.background='#000';
    document.body.appendChild(c2);
    document.title = 'DIAG|' + (info.join(' || ') || 'FOUND 0');
  }catch(e){ document.title='DIAG|EX '+e.message; }
}, 2500); });
</script>
"""


def main():
    a = sys.argv[1:]
    scale = int(a[0]) if a else 2
    out = os.path.abspath(a[1] if len(a) > 1 else (_LOOK + 'dx_now_x%d.png' % scale))
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('</body>', TAIL % {'S': scale, 'W': WANT} + '</body>', 1)
    tmp = os.path.join(HERE, '_dxprobe_gen.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(html)
    p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--hide-scrollbars', '--virtual-time-budget=20000',
                        '--window-size=1400,2000', '--dump-dom', 'file:///' + tmp],
                       capture_output=True, check=False)
    import re
    t = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
    print('DIAG ->', (t.group(1).strip() if t else 'NO TITLE').encode(
        'ascii', 'replace').decode('ascii'))
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--virtual-time-budget=20000',
                    '--window-size=1400,2000', '--screenshot=' + out,
                    'file:///' + tmp], stderr=subprocess.DEVNULL, check=False)
    print(out, os.path.getsize(out) if os.path.exists(out) else 'MISSING')


main()
