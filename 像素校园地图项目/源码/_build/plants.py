# -*- coding: utf-8 -*-
"""像素校园 —— 植物对比台（阔叶 / 针叶 / 垂柳 / 开花 + 行道树成行）

用法: python _build/plants.py

做三件事:
  1) 把 demo 的 utils 段 + 冻结 nature 段里的 **makeTree**（逐字节切，只作对照）
     与 **交付件 parts/47_plants.js** 拼成一张对比页 —— 数据源就是产物本身，
     不另存副本（副本会悄悄过期，sprite.py 已经踩过这个坑）。
  2) 无头 Chrome 截图: 3×（屏幕观感）/ 7×（像素级审视）/ 一行行道树实地场景
  3) --dump-dom 取回 DIAG: 内部空洞扫描 + 画布尺寸 / 锚点回报

⚠️ 截图输出必须传**绝对路径** —— --screenshot= 是按 Chrome 自己的 CWD 解析的。
⚠️ 切片起点取 813（`const LEAF_D…`）而不是 805：805 起是 §4 的注释头 + makeTree，
   只要 makeTree 这一个函数，少切一点少一份重复声明的风险（同 sprite.py 的教训：
   同一 <script> 里重复声明 const = SyntaxError，整页 JS 会静默不执行）。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
DEMO = os.path.join(PROJ, '像素校园Demo.html')
PLANTS = os.path.join(HERE, 'parts', '47_plants.js')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT_HTML = os.path.join(HERE, '_plants_gen.html')
OUT_PNG = os.path.join(HERE, '_look', 'plants_ab.png')

SLICE = {'utils': (50, 195),
         # LEAF_D/M/L 三常量 + makeTree（原物种，只作对照）+ makeBush + seg/ring。
         # ⚠️ 必须切到 914：`seg`（细线段）在 demo 899 行，是 makeWillow / makeBlossom
         #    画主枝用的。少切这一段 → 页面里 seg 未定义 → 建 DOM 时抛错 → 整页空白
         #    （且 title 停在静态值，看起来像"JS 完全没跑"，很容易误判成重复声明 const）。
         'tree':  (813, 914)}


def cut(lines, key):
    a, b = SLICE[key]
    seg = '\n'.join(lines[a - 1:b])
    assert seg.strip(), '切空了: ' + key
    return seg


PAGE = u"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>plants</title>
<style>
  html,body{margin:0;background:#1b1f27;color:#c9d4e2;font:12px/1.5 Consolas,monospace}
  h2{margin:16px 0 6px 14px;font-size:13px;color:#8fb6d9;font-weight:normal}
  .row{display:flex;flex-wrap:wrap;align-items:flex-end;gap:10px;padding:0 14px}
  .cell{text-align:center}
  .cell canvas{display:block;image-rendering:pixelated;image-rendering:crisp-edges;background:#3d752d}
  .lab{opacity:.66;margin-top:3px}
  .k{color:#e8d9a8}
</style></head><body>
<script>__JS__</script>
<script>
window.__diag=[];
window.onerror=function(m,s,l,c){window.__diag.push('ERR '+m+' @'+l+':'+c);};
var SPECIES=[
  {k:'阔叶(原)', fn:makeTree,    col:'#7bbf6a'},
  {k:'针叶',     fn:makeConifer, col:'#5f9e4a'},
  {k:'垂柳',     fn:makeWillow,  col:'#a8c95e'},
  {k:'开花',     fn:makeBlossom, col:'#e0a4bb'}
];
/* 一格：让**精灵自己的画布**按 S 倍放大画出来（不裁、不补），
   四周留 1px 参考线 → 一眼看出物体有没有贴边或被切。 */
function cell(fn,seed,S,bg,pit){
  var s = fn(seed);
  if(pit) treePit(s.canvas.getContext('2d'), s.ax, s.ay);
  var W=s.canvas.width, H=s.canvas.height;
  var cv=document.createElement('canvas');
  cv.width=(W+2)*S; cv.height=(H+2)*S;
  var g=cv.getContext('2d'); g.imageSmoothingEnabled=false;
  g.fillStyle='#2a3038'; g.fillRect(0,0,cv.width,cv.height);
  if(bg){ g.fillStyle=bg; g.fillRect(S,S,W*S,H*S); }
  g.drawImage(s.canvas, S, S, W*S, H*S);
  /* 锚点（ax, ay）= 精灵的"脚"：绿十字必须落在地面线上 */
  g.fillStyle='rgba(0,255,0,0.9)';
  g.fillRect(S+s.ax*S-1, S+s.ay*S, 3, 1);
  g.fillRect(S+s.ax*S, S+s.ay*S-1, 1, 3);
  var box=document.createElement('div'); box.className='cell';
  box.appendChild(cv);
  var L=document.createElement('div'); L.className='lab';
  L.innerHTML='<span class="k">'+fn.name.replace('make','')+'</span> '+W+'×'+H
            + '<br>ay='+s.ay+(pit?' +坑':'');
  box.appendChild(L);
  return box;
}
function row(title,seeds,S,bg,pit){
  var d=document.createElement('div'); d.innerHTML='<h2>'+title+'</h2>';
  var r=document.createElement('div'); r.className='row';
  SPECIES.forEach(function(sp, i){
    seeds.forEach(function(sd){
      var w=document.createElement('div');
      w.appendChild(cell(sp.fn,sd,S,bg,pit));
      r.appendChild(w);
    });
  });
  d.appendChild(r); return d;
}
/* --- 实地场景：一条路 + 路缘行道树成行 + 树坑 ------------------------
   直接按 ROW_SP 的间距摆一行，看"成行"到底成不成 —— 这是这一项的核心观感。 */
function streetScene(S){
  var N=4, PITCH=118;
  var cv=document.createElement('canvas');
  cv.width=(N*PITCH+80)*S/4; cv.height=(150)*S/4;
  var g=cv.getContext('2d'); g.imageSmoothingEnabled=false;
  var k=S/4;
  function R(x,y,w,h,c){g.fillStyle=c;g.fillRect(x*k,y*k,w*k,h*k);}
  R(0,0,cv.width,150,'#3d752d');
  R(cv.width*0.42,0,cv.width*0.58,150,'#8f8878');            /* 路 */
  R(cv.width*0.42,0,2,150,'#6e6a5c');
  /* ⚠️ 不能走 makeStreetTree：它经 anyTree → waterNear，那条链依赖 CELL/CELLK/NW
     （产物里才有），对比页里没有 → "CELL is not defined"。这里直接按物种下标取。 */
  var PICK=[makeTree,makeConifer,makeWillow,makeBlossom];
  for(var i=0;i<4;i++){
    var s=PICK[i](1000+i*761);
    treePit(s.canvas.getContext('2d'), s.ax, s.ay);
    var x=(40+i*PITCH)*k, y=126*k;
    g.drawImage(s.canvas, x-s.ax*k, y-s.ay*k, s.canvas.width*k, s.canvas.height*k);
  }
  var box=document.createElement('div'); box.className='cell';
  box.appendChild(cv);
  var L=document.createElement('div'); L.className='lab';
  L.innerHTML='间距 '+PITCH+' 世界px（≈13 m）· 由小到大 = 阔叶/针叶/垂柳/开花';
  box.appendChild(L);
  return box;
}
/* --- 局部放大：把精灵的某一块挖出来放大，用来看清"那到底是什么" ---
   （全图缩到 1700px 宽之后，5px 的小东西根本认不出；这一格是查证工具） */
function cropRow(items){
  var d=document.createElement('div'); d.innerHTML='<h2>⑤ 12× 局部（挖出来看）</h2>';
  var r=document.createElement('div'); r.className='row';
  items.forEach(function(it){
    var s=it.fn(it.seed), S=12;
    var cv=document.createElement('canvas');
    cv.width=it.w*S; cv.height=it.h*S;
    var g=cv.getContext('2d'); g.imageSmoothingEnabled=false;
    g.fillStyle='#2a3038'; g.fillRect(0,0,cv.width,cv.height);
    g.drawImage(s.canvas, -it.x*S, -it.y*S, s.canvas.width*S, s.canvas.height*S);
    var box=document.createElement('div'); box.className='cell'; box.appendChild(cv);
    var L=document.createElement('div'); L.className='lab'; L.innerHTML=it.label;
    box.appendChild(L); r.appendChild(box);
  });
  d.appendChild(r); return d;
}
var root=document.body;
/* ⚠️ 摆版的每一段都套 try/catch 并把异常推给 __diag ——
   这一段只要抛一次错，后面的 title 就永远设不上，页面看起来像"JS 没跑"，
   与"重复声明 const 导致整页不执行"几乎无法区分（plants.py 自己踩过）。 */
function guard(fn){ try{ fn(); }catch(e){ window.__diag.push('BUILD '+e.message); } }
guard(function(){
  root.appendChild(row('① 3× —— 屏幕观感（每个物种两种种子，看形态差异）',[11,7331],3,'#3d752d',false));
  root.appendChild(row('② 5× —— 像素级审视（冠内层次 / 枝条 / 镂空）',[11,7331],5,'#3d752d',false));
  root.appendChild(row('③ 3× —— 行道树（带树坑；绿十字 = 锚点，必须落在地面线上）',[11,7331],3,'#8f8878',true));
  var sc=document.createElement('div');
  sc.innerHTML='<h2>④ 4× —— 实地场景：一条路，行道树等距成行</h2>';
  var sw=document.createElement('div'); sw.className='row';
  sw.appendChild(streetScene(4));
  sc.appendChild(sw); root.appendChild(sc);
  root.appendChild(cropRow([
    {fn:makeConifer, seed:11, x:14, y:2,  w:26, h:26, label:'针叶尖（冠顶 26×26）'},
    {fn:makeConifer, seed:11, x:2,  y:88, w:26, h:16, label:'针叶根（裙摆 + 树干）'},
    {fn:makeBlossom, seed:11, x:16, y:24, w:30, h:30, label:'开花冠心（枝 / 团 / 单朵）'},
    {fn:makeWillow,  seed:11, x:12, y:16, w:30, h:26, label:'柳冠 + 垂条根'},
    {fn:makeWillow,  seed:11, x:12, y:66, w:30, h:20, label:'柳垂条梢 + 根'}
  ]));
});

/* --- DIAG：空洞扫描（洪水填充找被实心像素围住的透明像素） --- */
function holes(fn,seed,pit){
  var s=fn(seed);
  if(pit) treePit(s.canvas.getContext('2d'),s.ax,s.ay);
  var W=s.canvas.width,H=s.canvas.height,g=s.canvas.getContext('2d');
  var d=g.getImageData(0,0,W,H).data;
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
    if(!seen[i2]&&!op(x2,y2))out.push(x2+','+y2+'(a'+d[(y2*W+x2)*4+3]+')');
  }
  return out;
}
/* 落地检查：地面线以下（y > ay）不允许有实心像素 —— 有就是"插进土里" */
function below(fn,seed){
  var s=fn(seed),W=s.canvas.width,H=s.canvas.height;
  var d=s.canvas.getContext('2d').getImageData(0,0,W,H).data,n=0,deep=0;
  for(var y=s.ay+1;y<H;y++)for(var x=0;x<W;x++)
    if(d[(y*W+x)*4+3]>60){n++; if(y>s.ay+2) deep++;}
  return n?n+(deep?'/'+deep+'(深!)':''):'0';
}
(function(){
  var t=[];
  SPECIES.forEach(function(sp){
    t.push(sp.k+' 空洞='+(holes(sp.fn,11,false).length||'0')
         + ' 坑后空洞='+(holes(sp.fn,11,true).length||'0')
         + ' 地面线以下='+below(sp.fn,11));
  });
  document.title='DIAG|'+t.join(' | ')+'|'+(window.__diag.join('||')||'clean');
})();
</script></body></html>
"""


def main():
    lines = io.open(DEMO, encoding='utf-8').read().split('\n')
    js = (cut(lines, 'utils') + '\n' + cut(lines, 'tree') + '\n'
          + io.open(PLANTS, encoding='utf-8').read())
    assert 'function makeTree(' in js, '原物种没切到'
    assert 'function makeWillow(' in js, '交付件植物段没切到'
    html = PAGE.replace('__JS__', js)
    io.open(OUT_HTML, 'w', encoding='utf-8', newline='\n').write(html)

    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--window-size=1700,3800',
                    '--screenshot=' + OUT_PNG.replace('\\', '/'),
                    'file:///' + OUT_HTML.replace('\\', '/')],
                   capture_output=True, check=False)
    p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--dump-dom', 'file:///' + OUT_HTML.replace('\\', '/')],
                       capture_output=True, check=False)
    m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
    for ln in (m.group(1).strip() if m else 'NO TITLE').split('|'):
        print(ln)
    print('shot ->', OUT_PNG, os.path.getsize(OUT_PNG) if os.path.exists(OUT_PNG) else 'MISSING')


main()
