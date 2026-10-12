# -*- coding: utf-8 -*-
"""蹲姿调试图台（第四十四轮 · 猫宠交互）—— 照 sprite.py / _catsprite.py 的路子

用法: python _build/_crouch.py

拼 demo 的 utils 段 + parts/50_char.js，网格页无头 Chrome 截图到 _look/crouch_all.png。

网格：
  ① 站姿 vs 蹲姿 **并排**（同一朝向、同一相位）—— 肉眼一眼比出高度差
  ② 蹲姿：四向 × 两姿势（pet / feed）× 两帧

DIAG（写进 <title>，--dump-dom 回读）：
  · 每个姿势**两帧必须不同**（min=0 = 两帧一模一样 = 缺陷，本项目的老判据）
  · **蹲姿头顶必须比站姿低 ≥6px** —— 蹲下去肉眼看不出来就等于白做
  · **脚点一致**：两者的最大实心行都要落在 CH_AY+影子 那一带（不一致 = 人一蹲就"跳"）
"""
import io, os, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
DEMO = os.path.join(PROJ, '像素校园Demo.html')
CHAR = os.path.join(HERE, 'parts', '50_char.js')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT_HTML = os.path.join(HERE, '_crouch_gen.html')
OUT_PNG = os.path.join(HERE, '_look', 'crouch_all.png')

UTILS = (50, 195)


def cut(lines, ab):
    a, b = ab
    seg = '\n'.join(lines[a - 1:b])
    assert seg.strip(), '切空了'
    return seg


PAGE = u"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>crouch</title>
<style>
  html,body{margin:0;background:#1b1f27;color:#c9d4e2;font:12px/1.4 Consolas,monospace}
  h2{margin:16px 0 6px 14px;font-size:13px;color:#8fb6d9;font-weight:normal}
  .row{display:flex;align-items:flex-end;gap:6px;padding:0 14px;margin-bottom:2px}
  .cell{text-align:center}
  .cell canvas{display:block;image-rendering:pixelated;background:#3d752d}
  .lab{opacity:.65;margin-top:2px;font-size:10px}
  .rl{width:96px;text-align:right;color:#e8d9a8;align-self:center;margin-right:8px}
  .sep{width:14px}
</style></head><body>
<script>__JS__</script>
<script>
window.__diag=[];
window.onerror=function(m,s,l,c){window.__diag.push('ERR '+m+' @'+l+':'+c);
  document.title='CD|ERR '+m+' @'+l+':'+c;};
var POSES=['pet','feed'];
var DIRS=['down','left','right','up'];
function cell(cv,fn,S,bg){
  var g=cv.getContext('2d');g.imageSmoothingEnabled=false;
  if(bg){g.fillStyle=bg;g.fillRect(0,0,cv.width,cv.height);}
  var s=fn();
  g.drawImage(s,0,0,s.width*S,s.height*S);
}
function mkCell(fn,S,lab){
  var cv=document.createElement('canvas');
  cv.width=CH_W*S;cv.height=CH_H*S;
  cell(cv,fn,S,'#3d752d');
  var c=document.createElement('div');c.className='cell';c.appendChild(cv);
  var L=document.createElement('div');L.className='lab';L.textContent=lab;
  c.appendChild(L);return c;
}
/* ① 站姿 vs 蹲姿 并排（相位 4 = 待机，与蹲姿"静止"最可比） */
function mkCompare(S){
  var d=document.createElement('div');d.innerHTML='<h2>① 站姿 vs 蹲姿（待机相位 / 蹲 帧0）—— 比高度、比脚点</h2>';
  DIRS.forEach(function(dir){
    var r=document.createElement('div');r.className='row';
    var t=document.createElement('div');t.className='rl';t.textContent=dir;r.appendChild(t);
    ['站', '蹲摸', '蹲喂'].forEach(function(kind){
      r.appendChild(mkCell(function(){
        return kind==='站' ? charSprite(dir,4)
             : poseSprite(dir, kind==='蹲摸'?'pet':'feed', 0);
      }, S, kind));
    });
    var sp=document.createElement('div');sp.className='sep';r.appendChild(sp);
    d.appendChild(r);
  });
  return d;
}
/* ② 蹲姿全动作全向全帧 */
function mkPoses(S){
  var d=document.createElement('div');d.innerHTML='<h2>② 蹲姿 · 四向 × 两姿势 × 两帧</h2>';
  POSES.forEach(function(po){
    var r=document.createElement('div');r.className='row';
    var t=document.createElement('div');t.className='rl';t.textContent=po;r.appendChild(t);
    DIRS.forEach(function(dir){
      for(var f=0;f<CU_POSES[po];f++){
        r.appendChild(mkCell(function(dd,ff){return function(){return poseSprite(dd,po,ff);};}(dir,f),
                             S, dir[0]+f));
      }
      var sp=document.createElement('div');sp.className='sep';r.appendChild(sp);
    });
    d.appendChild(r);
  });
  return d;
}
[
  mkCompare(6),
  mkPoses(6)
].forEach(function(n){document.body.appendChild(n);});
/* --- 判据 ---
   ⚠️ 取样函数**绝不能叫 `px`**：`50_char.js` 用的 `px()` 是 utils 段提供的
      **画像素原语**，同名函数会被这里的声明提升整个换掉，结果是所有精灵
      一个格子都画不出来、页面纯白（这个坑刚栽过一次）。 */
function imgData(spr){
  var cv=mkCanvas(spr.width,spr.height),g=cv.getContext('2d');
  g.imageSmoothingEnabled=false;g.drawImage(spr,0,0);
  return g.getImageData(0,0,spr.width,spr.height).data;
}
function diffOf(a,b){
  var da=imgData(a),db=imgData(b),n=0;
  for(var i=0;i<da.length;i++) if(da[i]!==db[i]) n++;
  return n;
}
/* 实心像素的行范围 */
function solidRows(spr){
  var d=imgData(spr),W=spr.width,H=spr.height,r0=99,r1=-1;
  for(var y=0;y<H;y++)for(var x=0;x<W;x++) if(d[(y*W+x)*4+3]>0){ if(y<r0)r0=y; if(y>r1)r1=y; }
  return [r0,r1];
}
(function(){
  var bad=[], t=[];
  /* 帧差 */
  POSES.forEach(function(po){
    DIRS.forEach(function(dir){
      var n=CU_POSES[po], lo=1e9, who='';
      for(var i=0;i<n;i++)for(var j=i+1;j<n;j++){
        var m=diffOf(poseSprite(dir,po,i), poseSprite(dir,po,j));
        if(m<lo){lo=m;who=i+'/'+j;}
      }
      t.push(dir[0]+po+'='+lo);
      if(lo===0) bad.push(po+'-'+dir);
    });
  });
  /* 高度：蹲姿头顶必须明显低 */
  var hi=[];
  DIRS.forEach(function(dir){
    var sb=solidRows(charSprite(dir,4)), cb=solidRows(poseSprite(dir,'pet',0));
    var dh=cb[0]-sb[0];                        // 正值 = 蹲姿头顶更低
    hi.push(dir[0]+' top'+sb[0]+'->'+cb[0]+'(+'+dh+') foot'+sb[1]+'/'+cb[1]);
    if(dh<6) bad.push('CROUCH-SHALLOW-'+dir);
    if(sb[1]!==cb[1]) bad.push('ANCHOR-'+dir+' '+sb[1]+'vs'+cb[1]);
  });
  document.title='CD|'+t.join(' ')+'|'+hi.join(' | ')
                +'|'+(bad.length?('BAD '+bad.join(' ')):'ok')
                +'|'+(window.__diag.join('|')||'clean');
})();
</script></body></html>
"""


def main():
    lines = io.open(DEMO, encoding='utf-8').read().split('\n')
    js = (cut(lines, UTILS) + '\n'
          + io.open(CHAR, encoding='utf-8').read())
    for need in ('function outlineSprite(', 'function charSprite(', 'function poseSprite('):
        assert need in js, '没切到 ' + need
    html = PAGE.replace('__JS__', js)
    io.open(OUT_HTML, 'w', encoding='utf-8', newline='\n').write(html)

    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    for mode, args in (('shot', ['--screenshot=' + OUT_PNG.replace('\\', '/')]), ('dom', ['--dump-dom'])):
        p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                            '--hide-scrollbars', '--window-size=1300,2000'] + args
                           + ['file:///' + OUT_HTML.replace('\\', '/')],
                           capture_output=True, check=False)
        if mode == 'dom':
            m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
            print(m.group(1).strip() if m else 'NO TITLE')
    print('shot ->', OUT_PNG, os.path.getsize(OUT_PNG) if os.path.exists(OUT_PNG) else 'MISSING')


main()
