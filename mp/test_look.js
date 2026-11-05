/* Synthetic pixel-region check for the exact browser-side look generator. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname,'look.js'),'utf8');
const pixels = new Uint8ClampedArray(128*128*4);
function paint(x1,y1,x2,y2,hex){const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));for(let y=y1;y<y2;y++)for(let x=x1;x<x2;x++){const i=(y*128+x)*4;pixels.set([...c,255],i)}}
function makePortrait(hair,shirt,glasses,shift=0){paint(0,0,128,128,'#b1bdc1');paint(32+shift,15,96+shift,88,hair);paint(46+shift,40,82+shift,83,'#e8b792');paint(25+shift,87,103+shift,128,shirt);if(glasses)paint(47+shift,50,81+shift,57,'#252525')}
function makeStripedPortrait(){makePortrait('#26242b','#e8e5e0',true);for(let y=91;y<128;y+=7)paint(25,y,103,Math.min(y+3,128),'#26252a')}
const canvas=()=>{
  const c={width:0,height:0,rects:[],draws:[]};
  const g={fillStyle:'',imageSmoothingEnabled:true,
    fillRect(x,y,w,h){c.rects.push([x,y,w,h,this.fillStyle])},
    drawImage(...args){c.draws.push(args)},
    getImageData(){return{data:pixels}}};
  c.getContext=()=>g;
  return c;
};
const sandbox={window:{},document:{createElement:canvas},createImageBitmap:async()=>({width:128,height:128,close(){}})};
const pixel=(c,x,y)=>{let result=null;for(const [rx,ry,w,h,col] of c.rects)if(x>=rx&&x<rx+w&&y>=ry&&y<ry+h)result=col;return result};
vm.runInNewContext(source,sandbox);
(async()=>{
  makePortrait('#f0c457','#d03c3c',true);
  const blond=await sandbox.window.MPLook.fromPhoto({type:'image/png'});
  assert.equal(blond.hairColor,'#f0c457');
  assert.equal(blond.cloth,'#d03c3c');
  assert.equal(blond.acc,'glasses');
  makePortrait('#241d1a','#3155aa',false);
  const dark=await sandbox.window.MPLook.fromPhoto({type:'image/png'});
  assert.equal(dark.hairColor,'#241d1a');
  assert.equal(dark.cloth,'#3155aa');
  assert.equal(dark.acc,'none');
  assert.notDeepEqual(blond,dark);
  makePortrait('#f0c457','#d03c3c',true,20);
  const offset=await sandbox.window.MPLook.fromPhoto({type:'image/png'});
  assert.equal(offset.hairColor,'#f0c457');
  assert.equal(offset.cloth,'#d03c3c');
  makeStripedPortrait();
  const striped=await sandbox.window.MPLook.fromPhoto({type:'image/png'});
  assert.equal(striped.hairColor,'#26242b');
  assert.equal(striped.acc,'glasses');
  assert.equal(striped.clothPattern,'stripe');
  assert.equal(striped.cloth,'#e8e5e0');
  assert.equal(striped.clothAlt,'#26252a');
  const stripedSprite=sandbox.window.MPLook.sprite(striped,'down',4);
  assert(stripedSprite.rects.some(r=>r[4]===striped.clothAlt),'shirt stripes must be visible');
  for(const dir of ['up','down','left','right']){
    const standing=sandbox.window.MPLook.sprite(blond,dir,4);
    const crouching=sandbox.window.MPLook.crouch(blond,dir,'pet',0);
    assert.equal(standing.width,18);assert.equal(standing.height,30);
    assert.equal(crouching.width,18);assert.equal(crouching.height,30);
    assert(standing.rects.some(([x,y,w,h])=>y<=27&&y+h>27),'shoe must reach fixed foot anchor');
    assert(crouching.rects.some(([x,y,w,h])=>y<=27&&y+h>27),'crouch must keep foot anchor');
    assert(standing.rects.some(r=>r[4]==='#f0c457'),'photo hair color must be drawn');
    assert(standing.rects.some(r=>r[4]==='#d03c3c'),'photo clothing color must be drawn');
  }
  const a=sandbox.window.MPLook.avatar(blond);
  assert.equal(a.width,24);assert.equal(a.height,24);
  assert.equal(a.draws[0][0],sandbox.window.MPLook.sprite(blond,'down',4),'avatar must crop the matching map sprite');
  const left=sandbox.window.MPLook.sprite(blond,'left',4).rects;
  const right=sandbox.window.MPLook.sprite(blond,'right',4).rects;
  assert.deepEqual(right.map(r=>r.slice(0,4)),left.map(([x,y,w,h])=>[18-x-w,y,w,h]),'right direction must mirror left');
  const leftFace=sandbox.window.MPLook.sprite(dark,'left',4);
  const rightFace=sandbox.window.MPLook.sprite(dark,'right',4);
  assert.notEqual(pixel(leftFace,6,6),null,'left-facing nose must project to the left');
  assert.equal(pixel(leftFace,6,6),pixel(rightFace,11,6),'nose must switch sides with direction');
  assert.notEqual(pixel(leftFace,6,6),dark.hairColor,'nose must show skin rather than hair');
  assert.equal(pixel(leftFace,12,5),pixel(rightFace,5,5),'back of head must switch sides');
  const front=sandbox.window.MPLook.sprite(dark,'down',4);
  assert.equal(pixel(front,7,5),dark.eyeColor);
  assert.equal(pixel(front,11,5),dark.eyeColor);
  assert.notEqual(pixel(front,7,3),dark.eyeColor,'forehead must separate eyes from hairline');
  const blueEyes=sandbox.window.MPLook.sprite({...dark,eye:'dot',eyeColor:'#317ac1'},'down',4);
  assert.equal(pixel(blueEyes,7,5),'#317ac1','custom pupil color must be visible');
  for(const dir of ['down','left']){
    const eyeShapes=['round','narrow','dot'].map(eye=>{
      const frame=sandbox.window.MPLook.sprite({...dark,eye},dir,4);
      return Array.from({length:4},(_,row)=>Array.from({length:9},(_,col)=>pixel(frame,col+5,row+2)===dark.eyeColor?'1':'0').join('')).join('/');
    });
    assert.equal(new Set(eyeShapes).size,3,dir+' round, narrow and dot eyes must look different');
  }
  for(const dir of ['down','left']){
    const feet=[0,1,2,3,4].map(step=>[5,6,7,8,9,10,11,12,13].map(x=>pixel(sandbox.window.MPLook.sprite(dark,dir,step),x,27)));
    for(const frame of feet.slice(1))assert.deepEqual(frame,feet[0],'walk frames must keep shoes at the fixed anchor');
  }
  for(const dir of ['down','left']){
    const silhouettes=[0,1,2,3].map(step=>{
      const frame=sandbox.window.MPLook.sprite(dark,dir,step);
      return Array.from({length:10},(_,row)=>Array.from({length:14},(_,col)=>pixel(frame,col+2,row+17)?'1':'0').join('')).join('/');
    });
    assert(new Set(silhouettes).size>=3,dir+' walking legs must show distinct planted and passing poses');
    const crown=[0,1,2,3].map(step=>pixel(sandbox.window.MPLook.sprite(dark,dir,step),9,1));
    assert(crown.every(value=>value===crown[0]),dir+' walking frames must not bounce the head');
  }
  const recolored=sandbox.window.MPLook.sprite({...dark,pants:'#e33275',acc:'glasses',accColor:'#39d4c8'},'down',4);
  assert(recolored.rects.some(r=>r[4]==='#e33275'),'pants color must reach sprite');
  assert(recolored.rects.some(r=>r[4]==='#39d4c8'),'accessory color must reach sprite');
  assert.equal(pixel(recolored,7,6),'#39d4c8','front glasses need a bottom rim');
  const sideGlasses=sandbox.window.MPLook.sprite({...dark,acc:'glasses',accColor:'#39d4c8'},'left',4);
  assert.notEqual(pixel(sideGlasses,5,7),'#39d4c8','side glasses must not hang below the face');
  const bun=sandbox.window.MPLook.sprite({...dark,hairStyle:'bun'},'down',4);
  assert.notEqual(pixel(bun,8,0),null,'front bun must sit above the center of the head');
  const appearances=new Set();
  for(let i=0;i<20;i++){
    const look={...blond,hairColor:'#'+i.toString(16).padStart(2,'0')+'3456',cloth:'#c0'+i.toString(16).padStart(2,'0')+'66'};
    appearances.add(JSON.stringify(sandbox.window.MPLook.sprite(look,'down',4).rects));
  }
  assert.equal(appearances.size,20,'twenty recipes must render differently');
  assert(sandbox.window.MPLook.isDefault(sandbox.window.MPLook.fallback));
  assert(sandbox.window.MPLook.isDefault({skin:'#e9bb92',hairStyle:'short',hairColor:'#241d1a',eye:'round',cloth:'#3f6ea8',pants:'#454c5a',acc:'none'}));
  assert(!/fetch\s*\(|XMLHttpRequest|WebSocket/.test(sandbox.window.MPLook.fromPhoto.toString()),'photo processing must not send pixels');
  const lobby=fs.readFileSync(require('node:path').join(__dirname,'lobby.js'),'utf8');
  assert(!lobby.includes('/api/mp/look/from-photo'),'profile and registration must not upload photos');
  console.log('PASS: local photo extraction including stripes, 18x30/9,27 sprites, visible left/right-facing head, shared 24x24 avatar, 20 unique looks');
})().catch(e=>{console.error(e);process.exitCode=1});
