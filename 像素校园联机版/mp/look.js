/* The photo is decoded and sampled only in this browser. Only the small look recipe is saved. */
(() => {
  const fallback = {skin:'#e9bb92',hairStyle:'short',hairColor:'#241d1a',eye:'round',cloth:'#3f6ea8',pants:'#454c5a',acc:'none'};
  const cache = new Map();
  const hex = ([r,g,b]) => '#' + [r,g,b].map(x => Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('');
  const rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
  const dist = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
  const norm = value => ({...fallback,...(value || {})});
  function palette(look) {
    const v=norm(look), sk=v.skin, hr=v.hairColor, co=v.cloth, pa=v.pants;
    return {skin:sk,skinL:shade(sk,.16),skinD:shade(sk,-.18),hair:hr,hairL:shade(hr,.2),hairD:shade(hr,-.35),coat:co,coatL:shade(co,.2),coatD:shade(co,-.25),pant:pa,pantL:shade(pa,.15),pantD:shade(pa,-.24),shoe:'#272831',shoeL:'#454a54',pack:co,packL:shade(co,.15),packD:shade(co,-.2)};
  }
  function decorate(c,v,dir,crouched) {
    const g=c.getContext('2d'), top=crouched?10:1, side=dir==='left'||dir==='right';
    g.fillStyle=v.hairColor;
    if (v.hairStyle==='long' || v.hairStyle==='mid' || v.hairStyle==='curly') {
      g.fillRect(4,top+4,2,v.hairStyle==='long'?9:5);
      if (!side) g.fillRect(12,top+4,2,v.hairStyle==='long'?9:5);
    }
    if (v.hairStyle==='ponytail') g.fillRect(side?13:12,top+4,2,8);
    if (v.hairStyle==='bun') g.fillRect(12,top-1,3,4);
    if (v.hairStyle==='curly') {g.fillRect(4,top-1,3,2);g.fillRect(10,top-1,4,2);}
    if (v.acc==='glasses' && dir!=='up') {
      g.fillStyle='#30333b';g.fillRect(6,top+4,3,2);g.fillRect(10,top+4,3,2);g.fillRect(9,top+4,1,1);
      g.fillStyle='#d7e7e9';g.fillRect(7,top+4,1,1);g.fillRect(11,top+4,1,1);
    }
    if (v.acc==='cap') {g.fillStyle=shade(v.cloth,-.3);g.fillRect(5,top,9,2);g.fillRect(side?11:4,top+2,4,1);}
    if (v.acc==='scarf') {g.fillStyle='#f2b649';g.fillRect(6,top+8,7,2);}
    if (v.eye==='round' && dir==='down') {g.fillStyle='#faf9e7';g.fillRect(7,top+4,1,1);g.fillRect(11,top+4,1,1);}
    return c;
  }
  function sprite(look,dir='down',step=4) {
    const v=norm(look), k=JSON.stringify(v)+'|'+dir+'|'+step;
    if (!cache.has(k)) cache.set(k,decorate(buildChar(8,palette(v))(dir,step),v,dir,false));
    return cache.get(k);
  }
  function crouch(look,dir='down',pose='pet',frame=0) {
    const v=norm(look), k=JSON.stringify(v)+'|c|'+dir+'|'+pose+'|'+frame;
    if (!cache.has(k)) cache.set(k,decorate(buildCrouch(palette(v))(dir,pose,frame),v,dir,true));
    return cache.get(k);
  }
  function avatar(look) {
    const c=document.createElement('canvas');c.width=c.height=24;
    const g=c.getContext('2d');g.imageSmoothingEnabled=false;
    g.drawImage(sprite(look,'down',4),2,0,14,15,0,0,24,24);
    return c;
  }
  function sample(data,x1,y1,x2,y2,filter) {
    const out=[];
    for(let y=Math.floor(y1*128);y<Math.floor(y2*128);y+=2)
      for(let x=Math.floor(x1*128);x<Math.floor(x2*128);x+=2) {
        const i=(y*128+x)*4, col=[data[i],data[i+1],data[i+2]];
        if (!filter || filter(col)) out.push(col);
      }
    if (!out.length) return null;
    const mid=a=>a.sort((a,b)=>a-b)[a.length>>1];
    return [0,1,2].map(i=>mid(out.map(c=>c[i])));
  }
  async function fromPhoto(file) {
    if (!file || !file.type.startsWith('image/')) throw Error('请选择照片文件');
    const bitmap=await createImageBitmap(file), c=document.createElement('canvas');c.width=c.height=128;
    const g=c.getContext('2d',{willReadFrequently:true});
    const side=Math.min(bitmap.width,bitmap.height), sx=(bitmap.width-side)/2, sy=(bitmap.height-side)/2;
    g.drawImage(bitmap,sx,sy,side,side,0,0,128,128);bitmap.close?.();
    const data=g.getImageData(0,0,128,128).data;
    const skinTest=([r,gr,b])=>r>70 && gr>60 && b>40 && r/gr>1.05 && r/gr<1.6 && gr/b>.95 && gr/b<1.7 && r-b>12;
    const skin=sample(data,.37,.34,.63,.56,skinTest)||rgb(fallback.skin);
    const hair=sample(data,.34,.13,.66,.30,c=>!skinTest(c))||rgb(fallback.hairColor);
    const cloth=sample(data,.27,.68,.73,.9)||rgb(fallback.cloth);
    const left=sample(data,.25,.48,.37,.68),right=sample(data,.63,.48,.75,.68);
    const length=[left,right].filter(c=>c&&dist(c,hair)<85).length;
    let darkBand=0;
    for(let y=50;y<56;y+=2)for(let x=48;x<80;x+=2){const i=(y*128+x)*4;if(data[i]+data[i+1]+data[i+2]<(skin[0]+skin[1]+skin[2])*.65)darkBand++}
    return {...fallback,skin:hex(skin),hairColor:hex(hair),cloth:hex(cloth),hairStyle:length===2?'long':length===1?'mid':'short',acc:darkBand>=8?'glasses':'none'};
  }
  window.MPLook={fallback,norm,sprite,crouch,avatar,fromPhoto};
})();
