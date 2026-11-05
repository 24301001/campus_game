# -*- coding: utf-8 -*-
"""两栋思源楼的精灵**逐像素背靠背**导出（第十五轮修订立，长期探针）。

用途：第十五轮修订只改 `dxAttic` 的**像素**（尖顶白 / 窗带 56），精灵尺寸、锚点、
道具集合全都不动 ⇒ `_propdiff` 一个字都不报（326/326 逐字节相同）、`_sprhash` 只说
"这两件变了"但不说**变在哪**。这里把两栋楼的精灵各自 1:1 导出成 PNG，好做 regional 差异框：
实测（修订前后）差异框 = **东楼 (80,19,184,136) / 西楼 (288,29,392,146)** ——
宽都恰好 104 = `DX_ATT_W`、上沿 = 尖顶顶点行、下沿 = `eaveY + DX_OUTS`，
即**改动一字不差地落在阁楼那一条矩形里**，屋面瓷砖 / 窗阵 / 门 / 台阶逐字节未动。

用法：
  python _build/_attcmp.py <产物.html> <输出前缀>
  ⇒ <前缀>_e.png（东楼 423x361）/ <前缀>_w.png（西楼 513x371）
  然后用 PIL 逐张 ImageChops.difference(...).getbbox() 比新旧两版。

⚠️ 第十六轮（8 层 → 6 层）起它是"不动塔顶"的**唯一硬证据**：裁切高改成 361/371（跟着
   ay = H − 35 走），差异框的上沿必须恰好落在檐口行（东 122 / 西 132）—— 屋面、女儿墙、
   塔尖、分坡脊线一个像素都不许进框。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
WANT = [[423, 211.5, 326, 'e'], [513, 256.5, 336, 'w']]

TAIL = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    var want = %(W)s, got = [];
    for (var j=0;j<want.length;j++)
      for (var i=0;i<props.length;i++){
        var p = props[i];
        if (p.img.width === want[j][0] && p.ax === want[j][1] && p.ay === want[j][2])
          got.push([want[j][3], p.img]);
      }
    var W = 0, H = 0;
    for (var k=0;k<got.length;k++){ W = Math.max(W, got[k][1].width); H += got[k][1].height; }
    var c2 = document.createElement('canvas');
    c2.width = W; c2.height = H;
    var g2 = c2.getContext('2d');
    g2.imageSmoothingEnabled = false;
    var yy = 0;
    for (var k=0;k<got.length;k++){
      g2.drawImage(got[k][1], 0, yy);
      /* 每张左上角写一个字母，防止两栋楼认反（同宽度撞车时肉眼也能判） */
      yy += got[k][1].height;
    }
    document.body.innerHTML=''; document.body.style.margin='0';
    document.body.style.background='#000';
    document.body.appendChild(c2);
    document.title = 'ATT|' + W + 'x' + H + '|' + got.length;
  }catch(e){ document.title='ATT|EX '+e.message; }
}, 2500); });
</script>
"""


def run(html, out):
    src = io.open(html, encoding='utf-8').read()
    tmp = os.path.join(HERE, '_attcmp_gen.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(
        src.replace('</body>', TAIL % {'W': [w[:3] for w in WANT]} + '</body>', 1))
    p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--hide-scrollbars', '--virtual-time-budget=20000',
                        '--window-size=700,1000', '--dump-dom', 'file:///' + tmp],
                       capture_output=True, check=False)
    m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
    print('ATT ->', (m.group(1).strip() if m else 'NO TITLE'))
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--virtual-time-budget=20000',
                    '--window-size=700,1000', '--screenshot=' + tmp + '.png',
                    'file:///' + tmp], stderr=subprocess.DEVNULL, check=False)
    from PIL import Image
    im = Image.open(tmp + '.png')
    y = 0
    for w, ax, ay, tag in WANT:
        h = 361 if tag == 'e' else 371
        im.crop((0, y, w, y + h)).save('%s_%s.png' % (out, tag))
        y += h
    os.remove(tmp)
    os.remove(tmp + '.png')


run(sys.argv[1], sys.argv[2])
