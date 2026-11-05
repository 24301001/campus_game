# -*- coding: utf-8 -*-
"""猫宠 —— **朝向判据的数值探针**（一次性，验证完删）。

为什么要有这个：第四十四轮我把"喂食抬头朝向"接好之后，探针读出 `cdir=right`、
粮在锚点右 4px，**状态是对的**；可我盯着放大截图却说"猫头在左边、粮在肚子底下"。
两张证据打架 —— 而肉眼判读已经错过一次，不能再拿它当裁判。

所以这里**不看图**，直接对精灵画布做像素统计：

  ① 对 `catSprite('cat_daju','eat',dir,0)` 逐像素扫，
     精确匹配**眼睛色族**（`C.eye` 本体 + `outlineSprite` 由它派生出的描边色 = eye×0.45），
     求这些像素的 **x 均值** —— 眼睛在哪半张脸，数值说了算；
  ② 同时打印 `CAT_W / CAT_AX`，好把"精灵内坐标"换算成"世界坐标偏移"。

判据（写死）：
  · `right` 的眼睛 x 必须 **> CAT_W/2**（头在右半张脸）
  · `left`  的眼睛 x 必须 **< CAT_W/2**，且 ≈ `CAT_W-1-(right 的值)`（正是镜像）
  · 两眼 x 均值之差 ≥ 6 px —— 差了半个身子，"左右"才真的能被人眼分辨
读数进 `<title>`，`--dump-dom` 回读。
"""
import os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# 大橘的 C.eye = "#2b2a24" -> rgb(43,42,36)；描边 = 逐通道 ×0.45 取整 -> rgb(19,18,16)
EYE_RGB = (43, 42, 36)
EDG_RGB = (int(43 * 0.45), int(42 * 0.45), int(36 * 0.45))

INJECT = """<script>
try { localStorage.setItem('token', 'catdir-probe'); } catch (e) {}
</script>
"""

TAIL = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  var EYE = [%(ER)d, %(EG)d, %(EB)d], EDG = [%(DR)d, %(DG)d, %(DB)d];
  var out = [];
  function eyeX(dir){
    var cv = catSprite('cat_daju', 'eat', dir, 0);
    var W = cv.width, H = cv.height;
    var d = cv.getContext('2d').getImageData(0, 0, W, H).data;
    var sx = 0, n = 0;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++){
      var i = (y * W + x) * 4;
      if (d[i + 3] < 40) continue;
      var isEye = (d[i] === EYE[0] && d[i+1] === EYE[1] && d[i+2] === EYE[2]);
      var isEdg = (d[i] === EDG[0] && d[i+1] === EDG[1] && d[i+2] === EDG[2]);
      if (isEye || isEdg){ sx += x; n++; }
    }
    return n ? (sx / n) : -1;
  }
  var R = eyeX('right'), L = eyeX('left'), D = eyeX('down'), U = eyeX('up');
  var mid = (CAT_W - 1) / 2;
  out.push('W=' + CAT_W + ' AX=' + CAT_AX + ' mid=' + mid);
  out.push('right_eyeX=' + R.toFixed(2) + ' ' + (R > mid ? 'HEAD-RIGHT-OK' : 'HEAD-RIGHT-BAD'));
  out.push('left_eyeX=' + L.toFixed(2) + ' ' + (L < mid ? 'HEAD-LEFT-OK' : 'HEAD-LEFT-BAD'));
  out.push('mirror_gap=' + (R - L).toFixed(2) + ' ' + ((R - L) >= 6 ? 'GAP-OK' : 'GAP-BAD'));
  out.push('down_eyeX=' + D.toFixed(2) + ' up_eyeX=' + U.toFixed(2));
  document.title = 'CD|' + out.join('|');
}, 1500); });
</script>
"""


def main():
    html = open(SRC, encoding='utf-8').read()
    html = html.replace('<script>', INJECT + '<script>', 1)
    tag = TAIL % {'ER': EYE_RGB[0], 'EG': EYE_RGB[1], 'EB': EYE_RGB[2],
                  'DR': EDG_RGB[0], 'DG': EDG_RGB[1], 'DB': EDG_RGB[2]}
    html = html.replace('</body>', tag + '</body>', 1)
    tmp = os.path.join(HERE, '_catdir_gen.html')
    open(tmp, 'w', encoding='utf-8', newline='\n').write(html)
    p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--hide-scrollbars', '--virtual-time-budget=15000',
                        '--window-size=600,400', '--dump-dom',
                        'file:///' + tmp.replace('\\', '/')],
                       capture_output=True, check=False)
    t = p.stdout.decode('utf-8', 'replace')
    m = re.search(r'<title>(.*?)</title>', t, re.S)
    print((m.group(1).strip() if m else 'NO TITLE').replace('|', '\n  '))


if __name__ == '__main__':
    main()
