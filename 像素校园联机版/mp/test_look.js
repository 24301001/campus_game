/* Synthetic pixel-region check for the exact browser-side look generator. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname,'look.js'),'utf8');
const pixels = new Uint8ClampedArray(128*128*4);
function paint(x1,y1,x2,y2,hex){const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));for(let y=y1;y<y2;y++)for(let x=x1;x<x2;x++){const i=(y*128+x)*4;pixels.set([...c,255],i)}}
function makePortrait(hair,shirt,glasses){paint(0,0,128,128,'#b1bdc1');paint(32,15,96,88,hair);paint(46,40,82,83,'#e8b792');paint(25,87,103,128,shirt);if(glasses)paint(47,50,81,57,'#252525')}
const canvas=()=>({width:0,height:0,getContext:()=>({drawImage(){},fillRect(){},getImageData(){return{data:pixels}}})});
const spriteCanvas=()=>({...canvas(),width:18,height:30});
const sandbox={window:{},document:{createElement:canvas},createImageBitmap:async()=>({width:128,height:128,close(){}}),buildChar:()=>()=>spriteCanvas(),buildCrouch:()=>()=>spriteCanvas(),shade:h=>h};
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
  for(const dir of ['up','down','left','right']){
    assert.equal(sandbox.window.MPLook.sprite(blond,dir,4).width,18);
    assert.equal(sandbox.window.MPLook.sprite(blond,dir,4).height,30);
    assert.equal(sandbox.window.MPLook.crouch(blond,dir,'pet',0).height,30);
  }
  console.log('PASS: photo-region color/glasses extraction, distinct looks');
})().catch(e=>{console.error(e);process.exitCode=1});
