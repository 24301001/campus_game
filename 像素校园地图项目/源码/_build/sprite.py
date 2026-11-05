# -*- coding: utf-8 -*-
"""像素校园 —— 人物精灵对比台（现版 vs 交付版 A vs B 档备选）

用法: python _build/sprite.py

做三件事:
  1) 把 demo 的 utils 段 + **现版人物段**（逐字节切、只把 makeChar 改名 makeCharOld，不动 demo）
     与 **交付件 parts/50_char.js** 拼成一张对比页 —— 数据源就是产物本身，不另存副本；
     否则对比台会悄悄过期（parts/99_charA.js 就是这么废掉的：影子参数改了它不知道）。
  2) 无头 Chrome 截图: 4 方向和 6 个相位的精灵，按 3×（真实屏幕观感）与 7×（像素级审视）放大
  3) 用 --dump-dom 取回 DIAG: 内部空洞扫描 + **相位差异**（相邻相位不能像素完全相同）

⚠️ 截图输出必须传**绝对路径** —— --screenshot= 是按 Chrome 自己的 CWD 解析的。

相位语义（见 50_char.js 的 GAIT 表）：0..3 = 行走四帧，4..5 = 待机呼吸两帧。
现版 makeCharOld 只有布尔量，所以它的 frames 只列 [0,1]。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
DEMO = os.path.join(PROJ, '像素校园Demo.html')
CHAR_A = os.path.join(HERE, 'parts', '50_char.js')   # 数据源 = 交付件本身
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT_HTML = os.path.join(HERE, '_sprite_gen.html')
OUT_PNG = os.path.join(HERE, '_look', 'char_ab.png')

SLICE = {'utils': (50, 195),
         # 现版对照：**从 1058 起**（跳过 1057 的 `const CH_W = 18, …`）到 makeChar 结束。
         # ⚠️ 起点不能取 1051：50_char.js 自带那四个常量（它就是来替换 §5 的），
         #    同一 <script> 里重复声明 const = SyntaxError，会让整页 JS 静默不执行
         #    （现象：只出 <title>char</title>、截图缩到 10 KB）。
         #    `const _chars` / `charSprite` 也必须留给新段，所以终点取 1160。
         'char':  (1058, 1160)}


def cut(lines, key):
    a, b = SLICE[key]
    seg = '\n'.join(lines[a - 1:b])
    assert seg.strip(), '切空了: ' + key
    return seg


PAGE = u"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>char</title>
<style>
  html,body{margin:0;background:#1b1f27;color:#c9d4e2;
            font:12px/1.5 Consolas,monospace}
  h2{margin:14px 0 6px 14px;font-size:13px;color:#8fb6d9;font-weight:normal}
  .row{display:flex;align-items:flex-end;gap:8px;padding:0 14px}
  .cell{text-align:center}
  .cell canvas{display:block;image-rendering:pixelated;
               image-rendering:crisp-edges;background:#3d752d}
  .lab{opacity:.6;margin-top:3px}
  .k{color:#e8d9a8}
</style></head><body>
__ROWS__
<script>__JS__</script>
<script>
window.__diag=[];
window.onerror=function(m,s,l,c){window.__diag.push('ERR '+m+' @'+l+':'+c);};
/* --- 摆版 --- */
var DIRS=['down','left','right','up'];
var ALLF=[0,1,2,3,4,5];
var VARIANTS=[
  {k:'cur',fn:makeCharOld,col:'#d9a066',frames:[0,1],
   tag:'现版(已弃)<br>头 8px<br>2 帧'},
  {k:'A',  fn:makeChar,   col:'#8bd88b',frames:ALLF,
   tag:'<b>交付版 A 档</b><br>头 6px / 4.3 头身<br>4 帧行走 + 2 帧待机'},
  {k:'B',  fn:makeCharB,  col:'#8bb8d8',frames:ALLF,
   tag:'B 档(备选)<br>头 8px<br>3.4 头身'}
];
/* 一格：给定精灵 + 放大倍率 + 底色，画到 canvas 上 */
function cell(cv,fn,dir,st,S,bg,x0,y0){
  var w=cv.width,h=cv.height,g=cv.getContext('2d');
  g.imageSmoothingEnabled=false;
  if(bg){                                   /* 左草右砖：看剪影在两种地面上的对比 */
    g.fillStyle=bg[0];g.fillRect(0,0,w/2,h);
    g.fillStyle=bg[1];g.fillRect(w/2,0,w/2,h);
  }
  var s=fn(dir,st);
  g.drawImage(s,x0*S,y0*S,s.width*S,s.height*S);
}
function mkRow(S,title,withBg,dirs,frames,only){
  var d=document.createElement('div');
  d.innerHTML='<h2>'+title+'</h2>';
  VARIANTS.forEach(function(v){
    if(only && only.indexOf(v.k)<0) return;
    var fn=v.fn;
    var r=document.createElement('div');r.className='row';
    var tag=document.createElement('div');
    tag.className='lab';
    tag.style.alignSelf='center';tag.style.width='96px';
    tag.style.textAlign='right';tag.style.marginRight='10px';
    tag.style.color=v.col;
    tag.innerHTML=v.tag;
    r.appendChild(tag);
    dirs.forEach(function(dir){
      v.frames.forEach(function(st){
        if(frames.indexOf(st)<0) return;
        var cv=document.createElement('canvas');
        cv.width=18*S;cv.height=30*S;
        cell(cv,fn,dir,st,S,withBg?['#3d752d','#8f8878']:null,2,0);
        var c=document.createElement('div');c.className='cell';
        c.appendChild(cv);
        var L=document.createElement('div');L.className='lab';
        /* 4/5 是待机帧，标出来 —— 不然会被当成"走路走歪了" */
        L.textContent=dir+(st>=4?' 待'+(st-3):' 帧'+st);
        c.appendChild(L);
        r.appendChild(c);
      });
    });
    d.appendChild(r);
  });
  return d;
}
/* --- 尺子场景：真实建筑色 + 46px 门 + 24px 窗，角色站在门前（真实对比度） --- */
function scene(fn,label){
  var W=120,H=120,S=4;
  var cv=document.createElement('canvas');cv.width=W*S;cv.height=H*S;
  var g=cv.getContext('2d');g.imageSmoothingEnabled=false;
  function R(x,y,w,h,col){g.fillStyle=col;g.fillRect(x*S,y*S,w*S,h*S);}
  R(0,0,W,H,'#d2c9b4');                       /* 墙（PALETTE[0].wall） */
  for(var f=1;f<4;f++) R(0,f*34,W,1,'#b3ab97');
  R(0,0,W,2,'#e2dac6');
  [[6,44],[88,44]].forEach(function(w){       /* 窗（24 高，与 makeBuilding 同色语） */
    R(w[0]-1,w[1]-1,28,26,'#c0b9a6');
    R(w[0],w[1],26,24,'#2c3746');
    R(w[0]+2,w[1]+2,22,4,'#a8c8e0');
    R(w[0]+2,w[1]+14,22,9,'#7e9fbe');
    R(w[0],w[1]+24,26,2,'#e2dac6');
  });
  R(56,72,38,3,'#b3ab97');                    /* 门楣 */
  R(42,74,36,46,'#5a3f2a');                   /* 门：46 高（makeBuilding dh=44 + 框） */
  R(42,74,36,2,'#7a5a3f');
  R(76,106,2,5,'#c9b98d');                    /* 门把手 */
  var s=fn('down',0);
  g.drawImage(s,(60-9)*S,(118-27)*S,s.width*S,s.height*S);
  var box=document.createElement('div');box.className='cell';
  box.appendChild(cv);
  var L=document.createElement('div');L.className='lab';L.innerHTML=label;
  box.appendChild(L);
  return box;
}
var root=document.body;
root.appendChild(mkRow(3,'① 3× —— 你在屏幕上真正看到的观感（左草右砖）',true,
  DIRS,ALLF,null));
root.appendChild(mkRow(7,'② 7× —— 像素级审视（只取 down / left，含 4 帧行走 + 2 帧待机）',false,
  ['down','left'],ALLF,['A']));
var sc=document.createElement('div');
sc.innerHTML='<h2>③ 4× —— 站在 46px 门前的真实比例（人物高 = 门的 65%）</h2>';
var sw=document.createElement('div');sw.className='row';
VARIANTS.forEach(function(v){ sw.appendChild(scene(v.fn,v.tag)); });
sc.appendChild(sw);root.appendChild(sc);

/* --- DIAG 1：内部空洞扫描（洪水填充找被实心像素围住的透明像素） --- */
function holes(fn,dir,st){
  var cv=mkCanvas(18,30),g=cv.getContext('2d');
  g.drawImage(fn(dir,st),0,0);
  var W=18,H=30,d=g.getImageData(0,0,W,H).data;
  var op=function(x,y){return d[(y*W+x)*4+3]>40;};
  var seen=new Uint8Array(W*H),q=[];
  for(var x=0;x<W;x++){q.push(x,0);q.push(x,H-1);}
  for(var y=0;y<H;y++){q.push(0,y);q.push(W-1,y);}
  while(q.length){
    var yy=q.pop(),xx=q.pop(),i=yy*W+xx;
    if(xx<0||yy<0||xx>=W||yy>=H||seen[i]||op(xx,yy))continue;
    seen[i]=1;q.push(xx+1,yy);q.push(xx-1,yy);q.push(xx,yy+1);q.push(xx,yy-1);
  }
  var out=[];
  for(var y2=0;y2<H;y2++)for(var x2=0;x2<W;x2++){
    var i2=y2*W+x2;
    /* ⚠️ 带上真实 α：α40 是"实心"阈值，介于 1..39 的像素是**半透明影子**、
       不是空洞（例：两只鞋之间那颗 α39 的地面影子）。不标出来就会被当成缺陷。 */
    if(!seen[i2]&&!op(x2,y2))out.push(x2+','+y2+'(a'+d[(y2*W+x2)*4+3]+')');
  }
  return out;
}
/* --- DIAG 2：相位差异（像素级）。相邻相位若完全相同，4 帧就白给一帧 --- */
function diff(fn,dir,a,b){
  var ca=mkCanvas(18,30),cb=mkCanvas(18,30);
  ca.getContext('2d').drawImage(fn(dir,a),0,0);
  cb.getContext('2d').drawImage(fn(dir,b),0,0);
  var da=ca.getContext('2d').getImageData(0,0,18,30).data,
      db=cb.getContext('2d').getImageData(0,0,18,30).data,n=0;
  for(var i=0;i<da.length;i++) if(da[i]!==db[i]) n++;
  return n;
}
(function(){
  var bad=window.__diag.join('|');
  var t=[];
  VARIANTS.forEach(function(v){
    ['down','up','left','right'].forEach(function(dir){
      var h=holes(v.fn,dir,0);
      t.push(v.k+'.'+dir+'='+(h.length?h.length+'@'+h.slice(0,6).join(' '):'0'));
    });
  });
  document.title='DIAG|空洞(被围住的透明像素) '+t.join(' | ')+'|'+(bad||'clean');
})();
/* 相位差异单独一行输出（放 title 里太长，画到页面上）。
   ⚠️ 必须**两两全比**，不能只看相邻帧：相邻不等只是必要条件 ——
   踩过的坑就是 4 帧行走里两个"通过帧"的正背面腿完全一样（只差手臂），
   相邻比差异够大（手臂在动）看不出来，两两比立刻暴露 min=0。 */
(function(){
  var box=document.createElement('div');
  box.style.cssText='margin:14px;padding:10px;background:#232a35;border-radius:6px';
  var lines=['<b>DIAG 相位差异（两两全比）</b>—— 行走 4 帧 + 待机 2 帧，'
           + '每一对都必须不同；<b>min=0 就是有两帧一模一样 = 缺陷</b>'];
  ['down','up','left','right'].forEach(function(dir){
    var lo=1e9, who='';
    /* 行走 4 帧两两比 */
    for(var i=0;i<4;i++)for(var j=i+1;j<4;j++){
      var n=diff(makeChar,dir,i,j);
      if(n<lo){lo=n;who=i+'/'+j;}
    }
    /* 待机两帧也要不同，且要与行走帧不同 */
    var idle=diff(makeChar,dir,4,5);
    var cross=1e9, cw='';
    for(var k=0;k<4;k++){
      var m=diff(makeChar,dir,k,4);
      if(m<cross){cross=m;cw=k+'/4';}
    }
    lines.push('<span class="k">'+dir+'</span>  行走两两最小 '+lo+'（'+who+'）'
             + '　待机 4/5=' + idle + '　行走×待机最小 ' + cross + '（' + cw + '）');
  });
  box.innerHTML=lines.join('<br>');
  document.body.appendChild(box);
})();
</script></body></html>
"""


def main():
    lines = io.open(DEMO, encoding='utf-8').read().split('\n')
    old = cut(lines, 'char').replace('function makeChar(', 'function makeCharOld(', 1)
    js = (cut(lines, 'utils') + '\n' + old + '\n'
          + io.open(CHAR_A, encoding='utf-8').read()
          + '\nconst makeCharB = buildChar(8);\n')      # B 档 = 同一工厂换头高，按需对比
    assert 'function makeCharOld(' in js, '现版对照段没改名'
    assert 'function charSprite(' in js, '交付件人物段没切到'
    html = PAGE.replace('__JS__', js).replace('__ROWS__', '')
    io.open(OUT_HTML, 'w', encoding='utf-8', newline='\n').write(html)

    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--window-size=1560,1560',
                    '--screenshot=' + OUT_PNG.replace('\\', '/'), 'file:///' + OUT_HTML.replace('\\', '/')],
                   capture_output=True, check=False)
    p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--dump-dom', 'file:///' + OUT_HTML.replace('\\', '/')],
                       capture_output=True, check=False)
    m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
    print(m.group(1).strip() if m else 'NO TITLE')
    d = p.stdout.decode('utf-8', 'replace')
    for k in ('down', 'up', 'left', 'right'):
        i = d.find(k + '</span>  ')
        if i > 0:
            print(d[i:i + 150].split('<br>')[0])
    print('shot ->', OUT_PNG, os.path.getsize(OUT_PNG) if os.path.exists(OUT_PNG) else 'MISSING')


main()
