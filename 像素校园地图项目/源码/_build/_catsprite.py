# -*- coding: utf-8 -*-
"""猫宠 —— CatSprite 调试图台（照 sprite.py 的路子）

用法: python _build/_catsprite.py

把 demo 的 utils 段 + parts/50_char.js(只要 outlineSprite) + parts/75_cat_char.js
拼成一张网格页，无头 Chrome 截图到 _look/cat_all.png。
网格：行 = 8 个动作，列 = 方向 × 帧。另出一段"四只猫并排"对照毛色。

DIAG（写进 <title>，--dump-dom 回读）：
  · 每个动作内**两两帧必须不同**（min=0 就是有两帧一模一样 = 缺陷）
  · 透明空洞扫描（被实心像素围住的透明像素）
"""
import io, os, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
DEMO = os.path.join(PROJ, '像素校园Demo.html')
CHAR = os.path.join(HERE, 'parts', '50_char.js')
CATS = os.path.join(HERE, 'parts', '75_cat_char.js')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT_HTML = os.path.join(HERE, '_catsprite_gen.html')
OUT_PNG = os.path.join(HERE, '_look', 'cat_all.png')

UTILS = (50, 195)


def cut(lines, ab):
    a, b = ab
    seg = '\n'.join(lines[a - 1:b])
    assert seg.strip(), '切空了'
    return seg


PAGE = u"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>cat</title>
<style>
  html,body{margin:0;background:#1b1f27;color:#c9d4e2;font:12px/1.4 Consolas,monospace}
  h2{margin:16px 0 6px 14px;font-size:13px;color:#8fb6d9;font-weight:normal}
  .row{display:flex;align-items:flex-end;gap:6px;padding:0 14px;margin-bottom:2px}
  .cell{text-align:center}
  .cell canvas{display:block;image-rendering:pixelated;background:#3d752d}
  .lab{opacity:.65;margin-top:2px;font-size:10px}
  .rl{width:74px;text-align:right;color:#e8d9a8;align-self:center;margin-right:8px}
</style></head><body>
<script>__JS__</script>
<script>
window.__diag=[];
window.onerror=function(m,s,l,c){window.__diag.push('ERR '+m+' @'+l+':'+c);};
var ACTS=['walk','idle','sleep','flee','retreat','rub','wait','eat','look','play'];
var DIRS=['down','left','right','up'];
var CATS=[['cat_daju','大橘'],['cat_guanzhang','馆长'],['cat_zhima','芝麻'],['cat_lihua','狸花']];
function cell(cv,fn,dir,act,fr,S,bg){
  var g=cv.getContext('2d');g.imageSmoothingEnabled=false;
  if(bg){g.fillStyle=bg;g.fillRect(0,0,cv.width,cv.height);}
  var s=fn(dir,act,fr);
  g.drawImage(s,0,0,s.width*S,s.height*S);
}
function mkRow(S,title,catId,acts,dirs){
  var d=document.createElement('div');d.innerHTML='<h2>'+title+'</h2>';
  acts.forEach(function(act){
    var r=document.createElement('div');r.className='row';
    var t=document.createElement('div');t.className='rl';t.textContent=act;r.appendChild(t);
    dirs.forEach(function(dir){
      var n=CAT_ACTS[act];
      for(var f=0;f<n;f++){
        var cv=document.createElement('canvas');
        cv.width=CAT_W*S;cv.height=CAT_H*S;
        cell(cv,function(dd,aa,ff){return catSprite(catId,aa,dd,ff);},dir,act,f,S,'#3d752d');
        var c=document.createElement('div');c.className='cell';c.appendChild(cv);
        var L=document.createElement('div');L.className='lab';L.textContent=dir[0]+f;
        c.appendChild(L);r.appendChild(c);
      }
    });
    d.appendChild(r);
  });
  return d;
}
/* 四只猫并排（走 帧0 + 待机 帧0），看毛色差异 */
function mkCats(S){
  var d=document.createElement('div');d.innerHTML='<h2>④ 四只猫（毛色）—— 走/待 各一帧</h2>';
  [['walk',0],['idle',0],['sleep',0],['wait',0]].forEach(function(p){
    var r=document.createElement('div');r.className='row';
    var t=document.createElement('div');t.className='rl';t.textContent=p[0];r.appendChild(t);
    CATS.forEach(function(cc){
      ['right','down'].forEach(function(dir){
        var cv=document.createElement('canvas');cv.width=CAT_W*S;cv.height=CAT_H*S;
        cell(cv,function(dd,aa,ff){return catSprite(cc[0],aa,dd,ff);},dir,p[0],p[1],S,'#3d752d');
        var c=document.createElement('div');c.className='cell';c.appendChild(cv);
        var L=document.createElement('div');L.className='lab';L.textContent=cc[1]+dir[0];
        c.appendChild(L);r.appendChild(c);
      });
    });
    d.appendChild(r);
  });
  return d;
}
/* ⚠️ mkRow 是**返回**节点、不自己 insert —— 忘了 append 就白画（这坑栽过一次：
   只看见 ④，①②③ 生成了却没进 DOM，还以为是画错了）。 */
[
  mkRow(4,'① 大橘 · 全动作全向（行=动作，列=方向×帧）','cat_daju',ACTS,DIRS),
  mkRow(6,'② 大橘 · 放大看（走 / 跑 / 蹭 / 等 / 逗）','cat_daju',['walk','flee','rub','wait','play'],['down','right']),
  mkRow(6,'②b 大橘 · 新动作（抬头 / 逗）—— 第四十四轮','cat_daju',['look','play'],['down','right','up']),
  mkRow(4,'③ 馆长 · 走+待','cat_guanzhang',['walk','idle'],['down','right']),
  mkRow(4,'③b 芝麻 · 走+待','cat_zhima',['walk','idle'],['down','right']),
  mkCats(5)
].forEach(function(n){document.body.appendChild(n);});
/* --- DIAG：动作内两两帧差异 --- */
function diff(catId,dir,act,a,b){
  var ca=mkCanvas(CAT_W,CAT_H),cb=mkCanvas(CAT_W,CAT_H);
  ca.getContext('2d').drawImage(catSprite(catId,act,dir,a),0,0);
  cb.getContext('2d').drawImage(catSprite(catId,act,dir,b),0,0);
  var da=ca.getContext('2d').getImageData(0,0,CAT_W,CAT_H).data,
      db=cb.getContext('2d').getImageData(0,0,CAT_W,CAT_H).data,n=0;
  for(var i=0;i<da.length;i++) if(da[i]!==db[i]) n++;
  return n;
}
(function(){
  var bad=[];
  var t=[];
  ['down','right','up'].forEach(function(dir){
    var bads=[];
    ACTS.forEach(function(act){
      var n=CAT_ACTS[act]; if(n<2) return;
      var lo=1e9,who='';
      for(var i=0;i<n;i++)for(var j=i+1;j<n;j++){
        var m=diff('cat_daju',dir,act,i,j); if(m<lo){lo=m;who=i+'/'+j;}
      }
      t.push(dir[0]+act+'='+lo+'('+who+')');
      if(lo===0) bads.push(act);
    });
    if(bads.length) bad.push(dir+':'+bads.join(','));
  });
  /* 包围盒：只看 minRow 就够判"画不下"。
     设计预算见 75_cat_char.js 头注（耳顶 1 / 脚掌 14，画布 0..17）。
     ⚠️ 别写成"贴边即被裁"——描边本来就画在实体外 1px，第 0 行必然有像素，
     那种检查分不清"描边"和"被裁"，只会骗自己。 */
  var bb=[];
  [['down','walk'],['right','walk'],['down','sleep'],['right','wait']].forEach(function(p){
    var s=catSprite('cat_daju',p[1],p[0],0);
    var g2=mkCanvas(CAT_W,CAT_H).getContext('2d'); g2.imageSmoothingEnabled=false; g2.drawImage(s,0,0);
    var d=g2.getImageData(0,0,CAT_W,CAT_H).data;
    var r0=99,r1=-1,c0=99,c1=-1;
    for(var y=0;y<CAT_H;y++)for(var x=0;x<CAT_W;x++) if(d[(y*CAT_W+x)*4+3]>0){
      if(y<r0)r0=y; if(y>r1)r1=y; if(x<c0)c0=x; if(x>c1)c1=x;
    }
    bb.push(p[0][0]+p[1]+' r'+r0+'-'+r1+' c'+c0+'-'+c1);
  });
  document.title='DIAG|'+t.join(' ')+'|'+(bad.length?('ZERO '+bad.join(' ')):'no-zero')
                +'|BB '+bb.join(' | ')
                +'|'+(window.__diag.join('|')||'clean');
})();
</script></body></html>
"""


def main():
    lines = io.open(DEMO, encoding='utf-8').read().split('\n')
    js = (cut(lines, UTILS) + '\n'
          + io.open(CHAR, encoding='utf-8').read() + '\n'
          + io.open(CATS, encoding='utf-8').read())
    assert 'function outlineSprite(' in js, '没切到 outlineSprite'
    assert 'function buildCat(' in js, '没切到 buildCat'
    html = PAGE.replace('__JS__', js)
    io.open(OUT_HTML, 'w', encoding='utf-8', newline='\n').write(html)

    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    for mode, args in (('shot', ['--screenshot=' + OUT_PNG.replace('\\', '/')]), ('dom', ['--dump-dom'])):
        p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                            '--hide-scrollbars', '--window-size=1700,5400'] + args
                           + ['file:///' + OUT_HTML.replace('\\', '/')],
                           capture_output=True, check=False)
        if mode == 'dom':
            m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
            print(m.group(1).strip() if m else 'NO TITLE')
    print('shot ->', OUT_PNG, os.path.getsize(OUT_PNG) if os.path.exists(OUT_PNG) else 'MISSING')


main()
