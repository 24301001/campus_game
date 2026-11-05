# -*- coding: utf-8 -*-
"""思源楼**精灵图**放大探针：把 makeSiyuan 的产物单独以 N 倍渲染出来，衬一块中灰绿底。

为什么要它：游戏内截图里楼顶那一小块常被树、花坛、灌木挡掉一半，3× 截图里
白塔又被红字压着，肉眼判不准"塔降够没有"。这里把精灵图整个抽出来放大看，
白塔 / 门楼 / 题字的比例一目了然。

用法：python _prop.py [倍率=4] [out] [raw] [精灵宽=492] [锚点 ay=0=任意]
  精灵宽：按 img.width 认道具 —— 492=思源楼；给别的宽度就换一个道具看。
  raw   ：只对思源楼有意义 —— 画 makeSiyuan 的**原始产物**（不经过 siyuanRestyle），
          用来和改写后的成品背靠背比对，判断"某处是原版就这样，还是改写改出来的"。
  ay    ：**同宽精灵撞车时的第二把钥匙**。第十六轮起两栋思源楼的宽度各不相同，但
          **科学会堂（423）与思源东楼（423）同宽**、且 props 里东楼在前 ⇒ 只按宽度认
          永远取到东楼。给定 ay 就再筛一层（ay = 该精灵的落地点 = 精灵高 − 35）。

⚠️ out 传**文件名即可**（相对 _build\ 落）；传相对路径带 `_build/` 前缀会被二次拼接。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, u'像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT = os.path.join(HERE, '_prop_gen.html')

Z = int(sys.argv[1]) if len(sys.argv) > 1 else 4
PNG = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, '_look', 'syprop.png')
# ⚠️ 必须绝对路径：chrome 的 --screenshot 是相对**它自己的** cwd 落的，
#    给相对路径不会报错、只是文件落到别处（或干脆没有），排查起来很费时。
if not os.path.isabs(PNG):
    PNG = os.path.join(HERE, PNG)

PROBE = """
<script>
(function(){
  var p = props.find(function (q) {
    return q.img.width === __PW__ && (!__AY__ || (q.ay | 0) === __AY__); });
  var img = (__MODE__ === 'raw') ? makeSiyuan({ scale: 1.5 }).canvas : (p && p.img), z = __Z__;
  var cv = document.createElement('canvas');
  cv.width = img.width * z; cv.height = img.height * z;
  var g = cv.getContext('2d');
  g.fillStyle = '#7d9a52';                       // 中灰绿底：白塔/门楼的轮廓才看得清
  g.fillRect(0, 0, cv.width, cv.height);
  g.imageSmoothingEnabled = false;                // 就近邻，看的就是硬边
  g.drawImage(img, 0, 0, cv.width, cv.height);
  document.body.style.margin = '0';
  document.body.innerHTML = '';
  document.body.appendChild(cv);
  document.title = 'SYP|' + cv.width + 'x' + cv.height + '||' + (window.__diag || []).join(' ');
})();
</script>
"""

MODE = sys.argv[3] if len(sys.argv) > 3 else 'prop'
PW = int(sys.argv[4]) if len(sys.argv) > 4 else 492      # 按宽度认道具：492 = 思源楼
AY = int(sys.argv[5]) if len(sys.argv) > 5 else 0        # 同宽撞车时的第二把钥匙，0 = 不筛

html = io.open(SRC, encoding='utf-8').read()
html = html.replace('</body>', PROBE.replace('__Z__', str(Z)).replace('__MODE__', repr(MODE)).replace('__PW__', str(PW)).replace('__AY__', str(AY)) + '</body>')
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)

# 画布尺寸要等页面跑完才知道 → 先用最小窗口 dump-dom 拿 title
p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--dump-dom', 'file:///' + OUT.replace('\\', '/')],
                   capture_output=True, check=False)
m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
print('title:', m.group(1) if m else 'NO TITLE（整页 JS 没跑？）')
if not m:
    sys.exit(1)
w, h = m.group(1).split('|')[1].split('x')

p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--window-size=%s,%s' % (w, h),
                    '--screenshot=' + PNG, 'file:///' + OUT.replace('\\', '/')],
                   capture_output=True, check=False)
print(PNG, os.path.getsize(PNG) if os.path.exists(PNG) else 'MISSING')
