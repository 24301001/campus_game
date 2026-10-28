/* Photo pixels stay in this browser. Only the small look recipe is saved. */
(() => {
  const fallback = {skin:'#f2c9a0',hairStyle:'short',hairColor:'#30251e',eye:'round',eyeColor:'#332a2b',cloth:'#c94954',clothAlt:'#f3eee7',clothPattern:'solid',pants:'#38516d',acc:'none',accColor:'#b67a56'};
  const oldFallback = {skin:'#e9bb92',hairStyle:'short',hairColor:'#241d1a',eye:'round',cloth:'#3f6ea8',pants:'#454c5a',acc:'none'};
  const cache = new Map();
  const hex = ([r,g,b]) => '#' + [r,g,b].map(x => Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('');
  const rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
  const dist = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
  const shade=(h,k)=>hex(rgb(h).map(x=>k>0?x+(255-x)*k:x*(1+k)));
  const norm = value => {
    const v=value&&typeof value==='object'?value:{};
    const result={...fallback};
    for(const k of ['skin','hairColor','eyeColor','cloth','clothAlt','pants','accColor'])if(typeof v[k]==='string'&&/^#[0-9a-f]{6}$/i.test(v[k]))result[k]=v[k].toLowerCase();
    if(['short','mid','long','ponytail','bun','curly'].includes(v.hairStyle))result.hairStyle=v.hairStyle;
    if(['round','narrow','dot'].includes(v.eye))result.eye=v.eye;
    if(['none','glasses','cap','scarf'].includes(v.acc))result.acc=v.acc;
    if(['solid','stripe'].includes(v.clothPattern))result.clothPattern=v.clothPattern;
    return result;
  };
  const isDefault = value => [fallback,oldFallback].some(v=>JSON.stringify(norm(value))===JSON.stringify(norm(v)));
  // One 18×30 paper-doll skeleton. Side view looks left; the right view mirrors it.
  function paint(look, dir, step, crouched, pose) {
    const v=norm(look), c=document.createElement('canvas'); c.width=18; c.height=30;
    const g=c.getContext('2d'); g.imageSmoothingEnabled=false;
    const side=dir==='left'||dir==='right', back=dir==='up', flip=dir==='right';
    const dark=shade(v.hairColor,-.32), light=shade(v.hairColor,.24);
    const skinLight=shade(v.skin,.14), skinDark=shade(v.skin,-.20);
    const shirtLight=shade(v.cloth,.20), shirtDark=shade(v.cloth,-.24);
    const pantLight=shade(v.pants,.18), pantDark=shade(v.pants,-.23);
    const shoe='#34313a', sole='#24232a';
    function px(x,y,w,h,col){if(w<=0||h<=0)return;g.fillStyle=col;g.fillRect(flip?18-x-w:x,y,w,h)}
    function shirtBands(x,y,w,h){if(v.clothPattern==='stripe')for(let row=y+1;row<y+h;row+=3)px(x,row,w,1,v.clothAlt)}
    const walking=!crouched&&step>=0&&step<4;
    const phase=walking?(step<2?-1:1):0;
    const bob=0;
    const hy=crouched?8:1+bob;
    // Shadow and shoes remain attached to the map's (9,27) foot anchor.
    px(5,28,9,1,'rgba(47,40,36,.20)');
    px(6,29,7,1,'rgba(47,40,36,.12)');
    if(crouched){
      if(side){
        px(6,18,6,6,v.cloth);px(6,18,1,6,shirtLight);px(11,19,1,5,shirtDark);
        shirtBands(6,18,6,6);
        px(pose==='pet'?4:5,21,2,4,shirtLight);px(pose==='pet'?3:5,24,2,2,v.skin);
      }else{
        px(5,18,9,6,v.cloth);px(5,18,2,5,shirtLight);px(12,19,1,5,shirtDark);
        shirtBands(5,18,9,6);
        px(3,19,2,5,shirtLight);px(14,19,2,5,shirtDark);
        px(3,24,2,2,v.skin);px(14,24,2,2,skinDark);
      }
      px(5,23,8,4,v.pants);px(6,24,2,2,pantLight);px(10,24,2,2,pantDark);
      px(4,26,5,2,shoe);px(9,26,5,2,shoe);px(4,27,10,1,sole);
    }else if(side){
      // Six-pixel profile, front hand and a visible bag at the back.
      const front=7, rear=9;
      px(rear,18,3,8,pantDark);px(front,18,3,8,v.pants);px(front,19,1,6,pantLight);
      px(rear,26,4,2,shoe);px(front-1,26,4,2,shoe);
      px(front-1,26,3,1,'#67616a');px(front-1,27,8,1,sole);
      px(6,10+bob,6,8,v.cloth);px(6,10+bob,1,8,shirtLight);
      px(11,11+bob,1,7,shirtDark);px(7,17+bob,4,1,shirtDark);
      shirtBands(6,10+bob,6,8);
      px(5,12+phase,2,6,shirtLight);px(5,18+phase,2,2,v.skin);
    }else{
      // Front/back: shoulders wider than waist, separated legs and exposed hands.
      const l=0, r=0;
      px(6+l,18,3,8,v.pants);px(10+r,18,3,8,v.pants);
      /* [QODER-FIX #14] 裤子染色更明显：主色占 2/3，亮/暗只做少量明暗，
         以前正面两条腿各只有 1px 是主色，看上去像没染上。 */
      px(6+l,19,1,3,pantLight);px(10+r,19,1,3,pantLight);
      px(8+l,22,1,4,pantDark);px(12+r,22,1,4,pantDark);
      px(5+l,26,4,2,shoe);px(10+r,26,4,2,shoe);
      px(5+l,26,3,1,'#67616a');px(10+r,26,3,1,'#67616a');
      px(5+l,27,4,1,sole);px(10+r,27,4,1,sole);
      if(walking){px(6,23,1,2,phase<0?pantLight:pantDark);px(12,23,1,2,phase>0?pantLight:pantDark)}
      px(5,10+bob,9,6,v.cloth);px(6,16+bob,7,2,v.cloth);
      px(5,10+bob,2,6,shirtLight);px(12,11+bob,2,5,shirtDark);
      px(7,17+bob,5,1,shirtDark);
      shirtBands(5,10+bob,9,6);shirtBands(6,16+bob,7,2);
      px(3,11+bob+l,2,6,shirtLight);px(14,11+bob+r,2,6,shirtDark);
      if(v.clothPattern==='stripe'){px(3,13+bob+l,2,1,v.clothAlt);px(14,13+bob+r,2,1,v.clothAlt)}
      px(3,17+bob+l,2,2,v.skin);px(14,17+bob+r,2,2,skinDark);
      if(!back){px(9,11+bob,1,6,shirtDark);px(7,15+bob,4,1,shirtDark)}
    }
    px(8,hy+8,3,2,skinDark);
    if(back){
      px(6,hy,6,1,light);px(5,hy+1,8,8,v.hairColor);
      px(5,hy+2,1,7,light);px(12,hy+2,1,7,dark);
      px(8,hy+3,2,1,light);
    }else if(side){
      // Face left: forehead and nose project at x4; hair and bag stay on the right.
      px(6,hy,6,1,light);px(5,hy+1,8,2,v.hairColor);
      px(5,hy+3,8,6,v.skin);px(10,hy+2,3,7,v.hairColor);
      px(12,hy+3,1,6,dark);px(5,hy+3,4,1,v.hairColor);
      px(4,hy+4,2,2,skinLight);px(4,hy+6,2,1,v.skin);
      px(5,hy+7,1,1,skinDark);px(6,hy+8,3,1,skinDark);
      px(6,hy+4,2,v.eye==='narrow'?1:2,'#fff7e3');
      px(6,hy+4,1,1,'#ffffff');px(7,hy+5,1,1,v.eyeColor);
      px(5,hy+7,1,1,'#a15f5c');
    }else{
      px(6,hy,6,1,light);px(5,hy+1,8,2,v.hairColor);
      px(6,hy+3,7,5,v.skin);px(6,hy+3,2,1,v.hairColor);
      px(5,hy+3,1,4,dark);px(13,hy+3,1,4,dark);
      px(7,hy+8,5,1,skinDark);px(8,hy+9,3,1,skinDark);
      for(const x of [7,10]){
        px(x,hy+4,2,v.eye==='narrow'?1:2,'#fff7e3');
        px(x,hy+4,1,1,'#ffffff');
        px(x+1,hy+5,1,1,v.eyeColor);
        if(v.eye==='dot')px(x,hy+4,1,1,v.eyeColor);
      }
      px(6,hy+7,1,1,'#d88d88');px(12,hy+7,1,1,'#d88d88');
      px(9,hy+7,1,1,'#a15f5c');
    }
    /* [QODER-FIX #10/#11/#12] 发型重画：
       · 丸子头以头顶正中（x=5..12 的中心）对齐，不再偏右；
       · 中发＝齐肩内扣，左右两侧连成发帘，不再像两根不等长的双马尾；
       · 长发垂到肩下，卷发改成围着头缘的圆弧卷团。 */
    if(v.hairStyle==='mid'||v.hairStyle==='long'){
      /* [QODER-FIX #11-v2] 中发/长发＝贴着脑袋的左右发帘：外侧 2px 主体 + 内侧 1px 高光，
         底部向脸颊收一点；正面左右完全同长对称，不再像两根粗细/长短不同的马尾。 */
      const len=v.hairStyle==='long'?10:6;
      if(side){
        px(11,hy+2,3,len,dark);px(11,hy+2,2,len-1,v.hairColor);px(12,hy+3,1,Math.max(2,len-3),light);
      }else{
        px(4,hy+2,2,len,dark);px(13,hy+2,2,len,dark);
        px(5,hy+2,1,len-1,v.hairColor);px(13,hy+2,1,len-1,v.hairColor);
        px(4,hy+2,1,2,light);px(14,hy+2,1,2,light);
        if(back){px(6,hy+7,7,Math.max(1,len-5),v.hairColor);px(7,hy+len+1,5,1,dark)}
      }
    }
    if(v.hairStyle==='ponytail'){
      if(side){px(12,hy+4,3,2,dark);px(13,hy+5,2,6,v.hairColor);px(13,hy+10,2,1,dark)}
      else if(back){px(8,hy+5,3,2,dark);px(8,hy+7,3,5,v.hairColor);px(9,hy+12,2,1,dark)}
      else{px(12,hy+4,2,2,dark);px(13,hy+6,2,5,v.hairColor);px(13,hy+11,2,1,dark)}
    }
    if(v.hairStyle==='bun'){
      /* [QODER-FIX #10-v2] 丸子头缩成 4×3 的圆发髻，压在头顶正中 x=7..10（头中心 8.5），
         上窄下宽有层次；侧面上窄下宽地靠在后脑，不再是一整块横条/方砖。 */
      const by=Math.max(0,hy-2);
      if(side){px(9,by,2,1,dark);px(8,by+1,4,2,dark);px(9,by+1,2,1,light);px(8,by+3,1,1,v.hairColor)}
      else{px(8,by,2,1,dark);px(7,by+1,4,2,dark);px(8,by+1,2,1,light);px(7,by+3,4,1,v.hairColor)}
    }
    if(v.hairStyle==='curly'){
      /* [QODER-FIX #12-v2] 卷发＝沿头缘一圈对称的小卷团（左右镜像），
         贴着头顶和两颊，不再是一边大一边小的乱块。 */
      const by=Math.max(0,hy-1);
      if(side){
        px(7,by,5,2,v.hairColor);px(11,hy+1,3,7,dark);px(12,hy+2,1,5,v.hairColor);
        for(const [x,y] of [[9,by],[12,hy+3],[11,hy+7]])px(x,y,1,1,light);
      }else{
        px(5,by,8,2,v.hairColor);px(4,hy+2,2,7,dark);px(13,hy+2,2,7,dark);
        for(const [x,y] of [[6,by],[9,by],[4,hy+4],[14,hy+4],[5,hy+8],[13,hy+8]])px(x,y,1,1,light);
        if(back)px(6,hy+7,7,2,v.hairColor);
      }
    }
    /* [QODER-FIX #15] 配饰统一读 v.accColor：眼镜/帽子/围巾各用各自选的颜色，
       修掉以前配饰颜色写死、改了“配饰颜色”也不生效的问题。 */
    if(v.acc==='glasses'&&!back){
      const frame=v.accColor;
      /* [QODER-FIX #13] 正面眼镜补全下镜框：左右两片各画完整一圈，中间留鼻梁桥。 */
      if(side){px(5,hy+3,4,1,frame);px(5,hy+4,1,2,frame);px(6,hy+6,3,1,frame);px(9,hy+3,2,1,frame)}
      else{px(5,hy+3,8,1,frame);px(5,hy+4,1,3,frame);px(12,hy+4,1,3,frame);px(8,hy+4,2,1,frame);px(5,hy+6,4,1,frame);px(10,hy+6,3,1,frame)}
    }
    if(v.acc==='cap'){px(5,hy-1,8,3,shade(v.accColor,-.18));px(4,hy+2,side?5:10,1,v.accColor)}
    if(v.acc==='scarf'){px(6,hy+9,7,2,v.accColor);px(11,hy+11,2,3,shade(v.accColor,-.22))}
    return c;
  }
  function sprite(look,dir='down',step=4) {
    const v=norm(look), k=JSON.stringify(v)+'|'+dir+'|'+step;
    if (!cache.has(k)) {if(cache.size>768)cache.clear();cache.set(k,paint(v,dir,step,false,''))}
    return cache.get(k);
  }
  function crouch(look,dir='down',pose='pet',frame=0) {
    const v=norm(look), k=JSON.stringify(v)+'|c|'+dir+'|'+pose+'|'+frame;
    if (!cache.has(k)) {if(cache.size>768)cache.clear();cache.set(k,paint(v,dir,frame,true,pose))}
    return cache.get(k);
  }
  function avatar(look) {
    const c=document.createElement('canvas');c.width=c.height=24;
    const g=c.getContext('2d');g.imageSmoothingEnabled=false;
    g.drawImage(sprite(look,'down',4),3,0,12,12,0,0,24,24);
    return c;
  }
  function portrait(look) {
    const c=document.createElement('canvas');c.width=c.height=96;
    const g=c.getContext('2d');g.imageSmoothingEnabled=false;
    g.fillStyle='#1b2630';g.fillRect(0,0,96,96);
    g.fillStyle='#304b50';g.fillRect(5,5,86,86);
    g.fillStyle='#88c8ad';g.fillRect(9,9,78,78);
    g.fillStyle='#496c5f';g.fillRect(9,70,78,17);
    g.drawImage(sprite(look,'down',4),0,0,18,28,21,4,54,84);
    g.fillStyle='#e9d9a5';g.fillRect(4,4,88,2);g.fillRect(4,90,88,2);
    g.fillRect(4,4,2,88);g.fillRect(90,4,2,88);
    return c;
  }
  function sample(data,x1,y1,x2,y2,filter) {
    const out=[];
    for(let y=Math.max(0,Math.floor(y1*128));y<Math.min(128,Math.floor(y2*128));y+=2)
      for(let x=Math.max(0,Math.floor(x1*128));x<Math.min(128,Math.floor(x2*128));x+=2) {
        const i=(y*128+x)*4, col=[data[i],data[i+1],data[i+2]];
        if (!filter || filter(col)) out.push(col);
      }
    if (!out.length) return null;
    const mid=a=>a.sort((a,b)=>a-b)[a.length>>1];
    return [0,1,2].map(i=>mid(out.map(c=>c[i])));
  }
  /* [QODER-FIX #4] 取“最常见颜色”而不是中位数：照片里的背景/阴影会把中位数拉灰，
     分桶投票后再平均，衣服、头发、裤子都更接近照片主色。 */
  function dominant(list, fallbackColor) {
    if (!list || !list.length) return fallbackColor;
    const bins=new Map();
    for(const c of list){
      const key=(c[0]>>4)+','+(c[1]>>4)+','+(c[2]>>4);
      const bin=bins.get(key)||{n:0,s:[0,0,0]};
      bin.n++;bin.s[0]+=c[0];bin.s[1]+=c[1];bin.s[2]+=c[2];bins.set(key,bin);
    }
    let best=null;for(const bin of bins.values())if(!best||bin.n>best.n)best=bin;
    return hex(best.s.map(v=>v/best.n));
  }
  /* [QODER-FIX #4-v2] 用连通域找脸：只有成片、位于画面中上部、宽高比例像脸的肤色块才算脸。
     老算法按“行投影”分组，背景里的土路、树干、墙面颜色接近肤色时会被连成一大块，
     导致脸框变成 90×70，后面的头发/衣服全采到背景上。 */
  function locateFace(data,skinTest){
    const W=128,seen=new Uint8Array(W*W),queue=new Int32Array(W*W);
    const isSkin=(x,y)=>{const i=(y*W+x)*4;return skinTest([data[i],data[i+1],data[i+2]])};
    let best=null;
    const comps=[];
    for(let sy=8;sy<100;sy++)for(let sx=10;sx<118;sx++){
      const start=sy*W+sx;
      if(seen[start]||!isSkin(sx,sy))continue;
      let head=0,tail=0;queue[tail++]=start;seen[start]=1;
      let n=0,minX=sx,maxX=sx,minY=sy,maxY=sy;
      while(head<tail){
        const cur=queue[head++],x=cur%W,y=(cur/W)|0;n++;
        if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
          const nx=x+dx,ny=y+dy;
          if(nx<10||nx>117||ny<8||ny>99)continue;
          const ni=ny*W+nx;
          if(seen[ni]||!isSkin(nx,ny))continue;
          seen[ni]=1;queue[tail++]=ni;
        }
      }
      if(n<60)continue;
      const cw=maxX-minX+1,ch=maxY-minY+1;
      comps.push({x:minX,y:minY,w:cw,h:ch,n});
      if(n<150)continue;
      const w=cw,h=ch;
      if(w<18||h<18||w>72||h>88||h/w<0.62||h/w>2.1)continue;
      const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
      if(cy>88)continue;
      const score=n*(1-.55*Math.abs(cx-64)/64)*(1-.55*Math.max(0,cy-62)/62);
      if(!best||score>best.score)best={x:minX,y:minY,w,h,score};
    }
    /* 眼镜/刘海会把脸切成上下两块，把正上方宽度相近的肤色块并回脸框，
       否则脸框只剩下半张，后面的眼镜检测和头发采样都会错位。 */
    if(best)for(const c of comps){
      const overlap=Math.min(best.x+best.w,c.x+c.w)-Math.max(best.x,c.x);
      const gap=best.y-(c.y+c.h);
      if(overlap<Math.min(best.w,c.w)*.5)continue;
      if(gap<-4||gap>10)continue;
      if(c.w<best.w*.5||c.w>best.w*2||c.n<80)continue;
      best={x:Math.min(best.x,c.x),y:Math.min(best.y,c.y),score:best.score,
        w:Math.max(best.x+best.w,c.x+c.w)-Math.min(best.x,c.x),
        h:Math.max(best.y+best.h,c.y+c.h)-Math.min(best.y,c.y)};
    }
    return best?{x:best.x,y:best.y,w:best.w,h:best.h}:null;
  }
  /* [QODER-FIX #4-v2] 上衣：取下巴正下方、身体中段的像素，排除肤色和头发后做主色投票；
     两个色团都占 28% 以上且色差明显时才判成条纹，避免阴影被误判成条纹。 */
  function shirtFromPhoto(data,face,skinTest,hairRgb){
    const luma=c=>c[0]*.21+c[1]*.72+c[2]*.07;
    const x1=Math.max(0,Math.floor(face.x+face.w*.05)),x2=Math.min(128,Math.ceil(face.x+face.w*.95));
    const y1=Math.min(126,Math.floor(face.y+face.h*.96)),y2=Math.min(128,Math.ceil(Math.max(y1+14,face.y+face.h*1.5)));
    if(x2-x1<6||y2-y1<4)return {cloth:fallback.cloth,clothAlt:fallback.clothAlt,clothPattern:'solid'};
    const colors=[];
    for(let y=y1;y<y2;y+=2)for(let x=x1;x<x2;x+=2){
      const i=(y*128+x)*4,col=[data[i],data[i+1],data[i+2]];
      if(skinTest(col))continue;
      if(y<face.y+face.h+3&&luma(col)<150&&dist(col,hairRgb)<52)continue;
      if(luma(col)>242)continue;
      colors.push(col);
    }
    if(colors.length<12)return {cloth:fallback.cloth,clothAlt:fallback.clothAlt,clothPattern:'solid'};
    const avg=list=>[0,1,2].map(i=>list.reduce((s,c)=>s+c[i],0)/list.length);
    const sorted=[...colors].sort((a,b)=>luma(a)-luma(b));
    let lo=sorted[Math.floor(sorted.length*.25)],hi=sorted[Math.floor(sorted.length*.75)];
    for(let k=0;k<4;k++){
      const g1=[],g2=[];
      for(const c of colors)(dist(c,lo)<dist(c,hi)?g1:g2).push(c);
      if(!g1.length||!g2.length)break;
      lo=avg(g1);hi=avg(g2);
    }
    const g1=[],g2=[];
    for(const c of colors)(dist(c,lo)<dist(c,hi)?g1:g2).push(c);
    if(g1.length>=colors.length*.28&&g2.length>=colors.length*.28&&dist(lo,hi)>58){
      const main=g1.length>=g2.length?lo:hi, alt=g1.length>=g2.length?hi:lo;
      return {cloth:hex(main),clothAlt:hex(alt),clothPattern:'stripe'};
    }
    /* 照片里的衣服有一半落在阴影里，直接取主色会偏暗；取偏亮的那一半做投票，
       像素小人上的衣服才接近肉眼看到的颜色（深色衣服仍然是深色）。 */
    const byLuma=[...colors].sort((a,b)=>luma(a)-luma(b));
    const lit=byLuma.slice(Math.floor(byLuma.length*.55),Math.floor(byLuma.length*.92));
    return {cloth:dominant(lit.length>=8?lit:colors,hex(rgb(fallback.cloth))),clothAlt:fallback.clothAlt,clothPattern:'solid'};
  }
  /* [QODER-FIX #4/#14] 从照片下半身取裤子的主色；只有真的采到有饱和度的像素才用，
     否则保留默认色，避免把背景墙或上衣下摆误当裤子。 */
  function pantsFromPhoto(data,face,skinTest){
    const x1=Math.max(0,Math.floor(face.x-face.w*.55)),x2=Math.min(128,Math.ceil(face.x+face.w*1.55));
    const y1=Math.min(126,Math.floor(face.y+face.h*2.0));
    if(128-y1<6)return rgb(fallback.pants);
    const colors=[];
    for(let y=y1;y<128;y+=2)for(let x=x1;x<x2;x+=2){
      const i=(y*128+x)*4,col=[data[i],data[i+1],data[i+2]];
      const value=col[0]*.21+col[1]*.72+col[2]*.07;
      if(!skinTest(col)&&value<215&&Math.max(...col)-Math.min(...col)>14)colors.push(col);
    }
    if(colors.length<12)return rgb(fallback.pants);
    return rgb(dominant(colors,hex(rgb(fallback.pants))));
  }
  async function fromPhoto(file) {
    if (!file || !file.type.startsWith('image/')) throw Error('请选择照片文件');
    if (file.size > 10 * 1024 * 1024) throw Error('照片不能超过 10 MB');
    const bitmap=await createImageBitmap(file), c=document.createElement('canvas');c.width=c.height=128;
    const g=c.getContext('2d',{willReadFrequently:true});
    // Fit portrait photos instead of cutting away their hair and clothing.
    const scale=Math.min(128/bitmap.width,128/bitmap.height);
    const dw=Math.round(bitmap.width*scale),dh=Math.round(bitmap.height*scale);
    g.fillStyle='#ececf0';g.fillRect(0,0,128,128);
    g.drawImage(bitmap,0,0,bitmap.width,bitmap.height,(128-dw)/2,(128-dh)/2,dw,dh);bitmap.close?.();
    const data=g.getImageData(0,0,128,128).data;
    const skinTest=([r,gr,b])=>r>50 && gr>38 && b>26 && r/gr>1.04 && r/gr<1.85 && gr/b>.85 && gr/b<1.8 && r-b>8;
    const luma=c=>c[0]*.21+c[1]*.72+c[2]*.07;
    const face=locateFace(data,skinTest)||{x:46,y:40,w:36,h:43};
    const region=(x1,y1,x2,y2,filter)=>sample(data,x1/128,y1/128,x2/128,y2/128,filter);
    const skin=region(face.x+face.w*.22,face.y+face.h*.38,face.x+face.w*.78,face.y+face.h*.76,skinTest)||rgb(fallback.skin);
    /* [QODER-FIX #4-v2] 头发只从“额头正上方窄带 + 两颊外侧”取像素，并要求：
       不是肤色、不是画布留白、亮度不太高、不是绿色背景。再投票取主色。
       旧版取“脸上方一大片”，树林/墙面常被当成头发（曾出现橄榄绿头发）。 */
    const hairPixels=[];
    const pushHair=(x0,y0,x1,y1,top=false)=>{
      for(let y=Math.max(0,Math.floor(y0));y<Math.min(128,Math.floor(y1));y+=2)
        for(let x=Math.max(0,Math.floor(x0));x<Math.min(128,Math.floor(x1));x+=2){
          const i=(y*128+x)*4,col=[data[i],data[i+1],data[i+2]];
          if(dist(col,skin)<35||(!top&&skinTest(col)))continue;
          const l=luma(col),chroma=Math.max(...col)-Math.min(...col);
          if(l>205)continue;
          if(col[0]>225&&col[1]>225&&col[2]>225)continue;
          if(col[1]>col[0]*1.18&&col[1]>col[2]*1.25)continue;
          if(!top&&chroma>80)continue;
          hairPixels.push(col);
        }
    };
    pushHair(face.x+face.w*.05,face.y-face.h*.20,face.x+face.w*.95,face.y+face.h*.10,true);
    pushHair(face.x-face.w*.18,face.y+face.h*.10,face.x+face.w*.02,face.y+face.h*.95);
    pushHair(face.x+face.w*.98,face.y+face.h*.10,face.x+face.w*1.18,face.y+face.h*.95);
    /* 只取偏暗的一半投票：浅色墙面/树叶再亮也可能混进来，头发本体通常在这条暗带里。 */
    const darkHair=hairPixels.slice().sort((a,b)=>luma(a)-luma(b)).slice(0,Math.max(8,Math.ceil(hairPixels.length*.55)));
    const hairHex=dominant(darkHair.length?darkHair:hairPixels,hex(rgb(fallback.hairColor)));
    const hairRgb=rgb(hairHex);
    const share=(a,b)=>{
      let match=0,total=0;
      for(let y=Math.max(0,Math.floor(face.y+face.h*.55));y<Math.min(128,Math.floor(face.y+face.h*.87));y+=2)
        for(let x=Math.max(0,Math.floor(a));x<Math.min(128,Math.floor(b));x+=2){
          const i=(y*128+x)*4,col=[data[i],data[i+1],data[i+2]];total++;
          if(!skinTest(col)&&luma(col)<200&&dist(col,hairRgb)<58)match++;
        }
      return total?match/total:0;
    };
    const left=share(face.x+face.w*.05,face.x+face.w*.30);
    const right=share(face.x+face.w*.70,face.x+face.w*.95);
    let hairStyle=left>.08&&right>.08?'long':((left>.02&&right<left*.45)||(right>.02&&left<right*.45))?'ponytail':Math.max(left,right)>.02?'mid':'short';
    /* [QODER-FIX #4-v3] 不再凭“明暗起伏”猜卷发：128px 下头发高光/阴影的起伏
       比真实卷度更明显，容易把普通短发判成卷发；照片只区分短/中/长/马尾。 */
    const shirt=shirtFromPhoto(data,face,skinTest,hairRgb);
    let pantsRgb=pantsFromPhoto(data,face,skinTest);
    if(dist(pantsRgb,rgb(shirt.cloth))<38)pantsRgb=rgb(fallback.pants);
    // Two matching dark lens bands across the eye area; use both halves so hair on
    // one side does not turn into a false eyeglass frame.
    let glassesRows=0;
    for(let y=Math.floor(face.y+face.h*.25);y<Math.floor(face.y+face.h*.60);y++){
      const density=(a,b)=>{let dark=0,total=0;for(let x=Math.floor(face.x+face.w*a);x<Math.ceil(face.x+face.w*b);x++){
        const i=(y*128+x)*4;if(i<0||i+2>=data.length)continue;
        total++;if(luma([data[i],data[i+1],data[i+2]])<125)dark++;
      }return total?dark/total:0};
      if(density(.16,.46)>.20&&density(.54,.84)>.20)glassesRows++;
    }
    // The photo's shaded cheek is too gray at 18 pixels; warm the sampled tone for the sprite.
    const paintedSkin=[skin[0]+25,skin[1]+20,skin[2]+14];
    return {...fallback,skin:hex(paintedSkin),hairColor:hairHex,...shirt,pants:hex(pantsRgb),hairStyle,acc:glassesRows>=2?'glasses':'none',accColor:glassesRows>=2?'#777a83':fallback.accColor};
  }
  window.MPLook={fallback,norm,isDefault,sprite,crouch,avatar,portrait,fromPhoto};
})();
