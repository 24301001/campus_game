(() => {
  'use strict';
  const L = window.MPLook;
  const root=document.createElement('div');root.id='mpRoot';
  root.innerHTML=`
    <div id="mpStatus" hidden></div>
    <button id="mpSelf" type="button" hidden title="个人中心"></button>
    <button id="mpBoardToggle" type="button" hidden>📌 公告 <span id="mpUnread" hidden>0</span></button>
    <section id="mpBoard" class="mp-panel" hidden aria-label="公告栏">
      <div class="mp-head"><span class="mp-title">公告栏 · 全校</span><button class="mp-icon" id="mpBoardClose" aria-label="关闭公告">×</button></div>
      <div id="mpBoardList"><div class="mp-empty">还没有公告，发第一条吧。</div></div>
      <form id="mpBoardForm" class="mp-compose"><input id="mpBoardInput" class="mp-field" maxlength="200" placeholder="说点什么…" aria-label="公告内容"><button class="mp-primary">发送</button></form>
      <div id="mpBoardError" class="mp-error" role="alert" style="padding:0 10px"></div>
    </section>
    <section id="mpChat" class="mp-panel" hidden aria-label="私聊">
      <div class="mp-head"><span id="mpChatAvatar"></span><span id="mpChatTitle"></span><button class="mp-icon" id="mpChatClose" aria-label="关闭私聊">×</button></div>
      <div id="mpChatLog"></div>
      <form id="mpChatForm"><textarea id="mpChatInput" class="mp-field" maxlength="500" rows="1" placeholder="输入消息，Enter 发送" aria-label="私聊消息"></textarea><button class="mp-primary">发送</button></form>
      <div id="mpChatError" class="mp-error" role="alert" style="padding:0 10px"></div>
    </section>
    <div id="mpAuthShade" hidden><section id="mpAuth" class="mp-panel" aria-label="大厅登录">
      <h2>进入联机大厅</h2><p>注册或登录后，就能看见同场景的同学。</p>
      <div class="mp-tabs"><button type="button" class="mp-secondary" id="mpLoginTab">登录</button><button type="button" class="mp-secondary" id="mpRegisterTab">注册</button></div>
      <form id="mpAuthForm"><input id="mpName" class="mp-field" minlength="2" maxlength="16" placeholder="昵称（2–16 字）" autocomplete="username" required><input id="mpPass" class="mp-field" type="password" minlength="8" placeholder="密码（至少 8 位）" autocomplete="current-password" required><button class="mp-primary" id="mpAuthSubmit">登录并进入</button><div id="mpAuthError" class="mp-error" role="alert"></div></form>
      <button type="button" class="mp-secondary" id="mpSolo">暂时单机游览</button>
    </section></div>
    <div id="mpProfileShade" hidden><section id="mpProfile" class="mp-panel" aria-label="个人主页"><div class="mp-head"><span class="mp-title" id="mpProfileTitle">个人中心</span><button class="mp-icon" id="mpProfileClose" aria-label="关闭主页">×</button></div><div id="mpProfileBody"></div></section></div>
    <div id="mpMenu" class="mp-panel" hidden><button id="mpMenuChat">💬 发起对话</button><button id="mpMenuProfile">👤 个人主页</button></div>`;
  document.body.append(root);
  const $=id=>document.getElementById(id), tokenKey='mpToken';
  let token='',me=null,ws=null,chatWith=null,authMode='login',manualLogout=false,retries=0,reconnectTimer=0,pingTimer=0,moveAt=0,lastMove='',scene='out',unread=0,menuUser=null,menuAnchor=null;
  const peers=new Map(),profiles=new Map(),chatCache=new Map(),pending=new Map(),seenMsgs=new Set();
  let boardItems=[],look=L.fallback;
  function status(text,keep=false){const e=$('mpStatus');e.textContent=text;e.hidden=!text;if(!keep&&text)setTimeout(()=>{if(e.textContent===text)e.hidden=true},3000)}
  function authHeader(){return {'Content-Type':'application/json',Authorization:'Bearer '+token}}
  async function api(path,options={}){const r=await fetch('/api/mp'+path,{...options,headers:{...authHeader(),...(options.headers||{})}});let data=await r.json();if(!r.ok)throw Error(data.error||'请求失败');return data}
  function saveToken(v){token=v;try{v?localStorage.setItem(tokenKey,v):localStorage.removeItem(tokenKey)}catch{}}
  function currentScene(){return typeof CENTER!=='undefined'&&CENTER.active&&CENTER.room?CENTER.room.key:'out'}
  function myPos(){return scene==='out'?{x:player.x,y:player.y,dir:player.dir}:{x:CENTER.x,y:CENTER.y,dir:CENTER.dir}}
  function avatarEl(recipe,id,online=true){const c=L.avatar(recipe);c.className='mp-avatar';c.title='查看头像菜单';c.dataset.user=id;c.setAttribute('role','button');c.setAttribute('tabindex','0');c.style.opacity=online?1:.65;return c}
  function iconTo(parent,recipe,id,online=true){parent.replaceChildren(avatarEl(recipe,id,online))}
  function timeText(iso){if(!iso)return '';const d=new Date(iso),sec=Math.max(0,(Date.now()-d.getTime())/1000);return sec<60?'刚刚':sec<3600?Math.floor(sec/60)+' 分钟前':d.toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}
  function setAuthMode(mode){authMode=mode;$('mpAuthSubmit').textContent=mode==='register'?'注册并进入':'登录并进入';$('mpLoginTab').style.borderColor=mode==='login'?'#ffd76e':'';$('mpRegisterTab').style.borderColor=mode==='register'?'#ffd76e':'';$('mpAuthError').textContent=''}
  function showAuth(msg=''){$('mpAuthShade').hidden=false;$('mpAuthError').textContent=msg;$('mpName').focus()}
  function hideAuth(){$('mpAuthShade').hidden=true}
  function connectedUI(on){$('mpSelf').hidden=$('mpBoardToggle').hidden=!on;if(!on){$('mpBoard').hidden=true;$('mpChat').hidden=true;$('mpProfileShade').hidden=true;$('mpMenu').hidden=true}else updateSelf()}
  function updateSelf(){if(!me)return;const el=$('mpSelf');el.replaceChildren(avatarEl(look,me.id),document.createTextNode(me.nickname+' · 个人中心'))}
  async function submitAuth(e){e.preventDefault();const nickname=$('mpName').value.trim(),password=$('mpPass').value,button=$('mpAuthSubmit');button.disabled=true;$('mpAuthError').textContent='';try{
    if(authMode==='register')await api('/register',{method:'POST',body:JSON.stringify({nickname,password})});
    const result=await api('/login',{method:'POST',body:JSON.stringify({nickname,password})});saveToken(result.token);me=result.user;look=me.look;profiles.set(me.id,me);hideAuth();connect();
  }catch(err){$('mpAuthError').textContent=err.message}finally{button.disabled=false}}
  function socketSend(payload){if(ws&&ws.readyState===WebSocket.OPEN){ws.send(JSON.stringify(payload));return true}status('联机暂不可用，消息未发送',true);return false}
  function connect(){if(!token||location.protocol==='file:')return;if(ws&&ws.readyState<=1)ws.close();clearTimeout(reconnectTimer);
    const scheme=location.protocol==='https:'?'wss':'ws';ws=new WebSocket(`${scheme}://${location.hostname}:8090/mp?token=${encodeURIComponent(token)}`);
    ws.onopen=()=>{retries=0;scene=currentScene();const p=myPos();socketSend({type:'hello',scene,...p,look});socketSend({type:'announce.list',limit:50});pingTimer=setInterval(()=>socketSend({type:'ping'}),15000);status('已连接联机大厅')};
    ws.onmessage=e=>{try{onPacket(JSON.parse(e.data))}catch(err){console.error('[mp]',err)}};
    ws.onclose=e=>{clearInterval(pingTimer);MP.connected=false;if(manualLogout){manualLogout=false;return}if(e.code===4001){connectedUI(false);saveToken('');status('该账号已在另一处登录',true);showAuth('该账号已在另一处登录');return}if(e.code===4003){connectedUI(false);saveToken('');status('登录已失效，当前为单机模式',true);showAuth('请重新登录');return}connectedUI(false);peers.clear();retries++;status('连接中断，正在重连…',true);reconnectTimer=setTimeout(connect,Math.min(30000,1000*2**Math.min(retries-1,5)))};
  }
  function onPacket(m){switch(m.type){
    case 'welcome':me=m.me;look=me.look;profiles.set(me.id,me);scene=m.scene;peers.clear();m.peers.forEach(addPeer);MP.connected=true;connectedUI(true);updateSelf();break;
    case 'scene.peers':scene=m.scene;peers.clear();m.peers.forEach(addPeer);break;
    case 'peer.join':addPeer(m.peer);break;
    case 'peer.move':{const p=peers.get(m.id);if(p){const v=point(p,performance.now());p.fromX=v.x;p.fromY=v.y;p.x=m.x;p.y=m.y;p.dir=m.dir;p.at=performance.now()}break}
    case 'peer.leave':peers.delete(m.id);break;
    case 'peer.look':{const p=peers.get(m.id);if(p)p.look=m.look;const q=profiles.get(m.id);if(q)q.look=m.look;renderBoard();if(chatWith===m.id)renderChat();break}
    case 'announce.list':boardItems=m.items;renderBoard();break;
    case 'announce.new':boardItems.push(m);boardItems=boardItems.slice(-50);if($('mpBoard').hidden){unread++;updateUnread()}renderBoard();break;
    case 'chat.history':chatCache.set(m.withUser,mergeMessages(chatCache.get(m.withUser)||[],m.items));if(chatWith===m.withUser)renderChat();break;
    case 'chat.msg':{if(seenMsgs.has(m.msgId))break;seenMsgs.add(m.msgId);const other=m.from===me.id?m.to:m.from;chatCache.set(other,mergeMessages(chatCache.get(other)||[],[m]));if(chatWith===other)renderChat();else status(m.fromNickname+' 发来新消息');break}
    case 'chat.ack':{const p=pending.get(m.clientMsgId);if(p){pending.delete(m.clientMsgId);const msg={...p,msgId:m.msgId,at:m.at};chatCache.set(p.to,mergeMessages(chatCache.get(p.to)||[],[msg]));if(chatWith===p.to)renderChat()}break}
    case 'presence':{const p=profiles.get(m.userId);if(p){p.online=m.online;p.lastSeen=m.lastSeen}renderBoard();if(chatWith===m.userId)renderChatTitle();break}
    case 'error':$('mpChatError').textContent=m.code?.startsWith('CHAT')?m.msg:'';$('mpBoardError').textContent=m.code?.startsWith('ANNOUNCE')?m.msg:'';status(m.msg);break;
  }}
  function mergeMessages(a,b){const map=new Map([...a,...b].map(x=>[x.msgId,x]));return [...map.values()].sort((x,y)=>x.msgId-y.msgId)}
  function addPeer(v){if(v.id===me?.id)return;peers.set(v.id,{...v,fromX:v.x,fromY:v.y,at:performance.now()});profiles.set(v.id,{...(profiles.get(v.id)||{}),...v,online:true})}
  function point(p,now){const t=Math.min(1,Math.max(0,(now-p.at)/120));return{x:p.fromX+(p.x-p.fromX)*t,y:p.fromY+(p.y-p.fromY)*t}}
  function updateUnread(){const e=$('mpUnread');e.hidden=!unread;e.textContent=String(unread)}
  function renderBoard(){const list=$('mpBoardList');list.replaceChildren();if(!boardItems.length){list.innerHTML='<div class="mp-empty">还没有公告，发第一条吧。</div>';return}
    for(const a of [...boardItems].reverse()){const item=document.createElement('div');item.className='mp-post';const av=avatarEl(a.look,a.userId,a.online!==false),body=document.createElement('div'),meta=document.createElement('div'),content=document.createElement('div');body.className='mp-post-body';meta.className='mp-post-meta';meta.textContent=a.nickname+' · '+timeText(a.at);content.textContent=a.content;body.append(meta,content);item.append(av,body);list.append(item)}
  }
  function openBoard(){if(!MP.connected)return;$('mpBoard').hidden=false;unread=0;updateUnread();socketSend({type:'announce.list',limit:50})}
  function chatProfile(id){return profiles.get(id)||{id,nickname:'玩家 '+id,look:L.fallback,online:false}}
  function renderChatTitle(){if(!chatWith)return;const p=chatProfile(chatWith);iconTo($('mpChatAvatar'),p.look,chatWith,p.online);$('mpChatTitle').replaceChildren();const b=document.createElement('b');b.textContent=p.nickname;const small=document.createElement('div');small.className='mp-muted';small.textContent=p.online?(peers.has(chatWith)?'同场景在线':'在线 · 已离开当前场景'):'离线 · 上线后可收到消息';$('mpChatTitle').append(b,small)}
  function renderChat(){if(!chatWith)return;renderChatTitle();const log=$('mpChatLog');log.replaceChildren();const data=chatCache.get(chatWith)||[];if(!data.length){log.innerHTML='<div class="mp-empty">还没有消息，先打个招呼吧。</div>';return}
    for(const m of data){const mine=m.from===me.id,p=mine?me:chatProfile(chatWith),wrap=document.createElement('div'),side=document.createElement('div'),bubble=document.createElement('div'),small=document.createElement('small');wrap.className='mp-message'+(mine?' mine':'');bubble.className='mp-bubble';bubble.textContent=m.content;small.textContent=p.nickname+' · '+timeText(m.at);side.append(small,bubble);wrap.append(avatarEl(p.look,p.id,p.online),side);log.append(wrap)}log.scrollTop=log.scrollHeight;
  }
  function openChat(id){if(!MP.connected||id===me.id)return;chatWith=Number(id);$('mpBoard').hidden=true;$('mpChat').hidden=false;$('mpChatError').textContent='';renderChat();socketSend({type:'chat.history',withUser:chatWith,limit:30});$('mpChatInput').focus();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0}
  async function ensureProfile(id){if(profiles.has(id)&&profiles.get(id).bio!==undefined)return profiles.get(id);const p=await api('/profile/'+id);profiles.set(id,p);return p}
  function closeProfile(){$('mpProfileShade').hidden=true}
  function showProfile(id){$('mpMenu').hidden=true;const mine=id===me.id;$('mpProfileShade').hidden=false;$('mpProfileTitle').textContent=mine?'个人中心':'个人主页';const body=$('mpProfileBody');body.replaceChildren();
    ensureProfile(id).then(p=>{if($('mpProfileShade').hidden)return;body.replaceChildren();const top=document.createElement('div');top.className='mp-profile-top';top.append(avatarEl(p.look,id,p.online));const details=document.createElement('div');const name=document.createElement('strong');name.textContent=p.nickname;const line=document.createElement('div');line.className='mp-muted';line.textContent=mine?'昵称不可修改':(p.online?'● 在线':'○ 离线 · '+(p.lastSeen?timeText(p.lastSeen):'暂无记录'));details.append(name,line);top.append(details);body.append(top);
      if(!mine){for(const value of [p.college+' '+p.grade,p.bio,p.tags.join(' · ')])if(value.trim()){const line=document.createElement('p');line.textContent=value;body.append(line)}const button=document.createElement('button');button.className='mp-primary';button.textContent='💬 发消息';button.onclick=()=>{closeProfile();openChat(id)};body.append(button);return}
      const form=document.createElement('form');form.id='mpProfileForm';form.innerHTML=`<div class="mp-form-grid"><label class="wide">签名<input name="bio" class="mp-field" maxlength="40"></label><label>学院<input name="college" class="mp-field" maxlength="32"></label><label>年级<select name="grade" class="mp-field"><option value="">未填写</option><option>大一</option><option>大二</option><option>大三</option><option>大四</option><option>硕士</option><option>博士</option></select></label><label class="wide">兴趣标签（逗号分隔，最多 5 个）<input name="tags" class="mp-field"></label></div><div class="mp-look-preview" id="mpLookPreview"></div><label>从照片生成形象（照片只在本机处理）<input name="photo" type="file" accept="image/*" class="mp-field"></label><div class="mp-look-controls"><label>发型<select name="hairStyle" class="mp-field"><option value="short">短发</option><option value="mid">中发</option><option value="long">长发</option><option value="ponytail">马尾</option><option value="bun">丸子头</option><option value="curly">卷发</option></select></label><label>配饰<select name="acc" class="mp-field"><option value="none">无</option><option value="glasses">眼镜</option><option value="cap">帽子</option><option value="scarf">围巾</option></select></label><label>发色<input name="hairColor" type="color" class="mp-field"></label><label>衣服<input name="cloth" type="color" class="mp-field"></label><label>肤色<input name="skin" type="color" class="mp-field"></label><label>裤子<input name="pants" type="color" class="mp-field"></label></div><div class="mp-profile-actions"><button type="button" id="mpResetLook" class="mp-secondary">恢复默认形象</button><button class="mp-primary">保存资料</button><button type="button" id="mpLogout" class="mp-secondary">退出登录</button></div><div class="mp-error" id="mpProfileError" role="alert"></div>`;
      body.append(form);form.elements.bio.value=p.bio||'';form.elements.college.value=p.college||'';form.elements.grade.value=p.grade||'';form.elements.tags.value=(p.tags||[]).join('，');let draft=L.norm(p.look);
      function syncFields(){for(const k of ['hairStyle','acc','hairColor','cloth','skin','pants'])form.elements[k].value=draft[k];preview()}
      function preview(){const box=$('mpLookPreview');box.replaceChildren();for(const d of ['down','left','right','up']){const c=L.sprite(draft,d,4).cloneNode();c.getContext('2d').drawImage(L.sprite(draft,d,4),0,0);box.append(c)}}
      syncFields();for(const k of ['hairStyle','acc','hairColor','cloth','skin','pants'])form.elements[k].addEventListener('input',()=>{draft[k]=form.elements[k].value;preview()});
      form.elements.photo.onchange=async()=>{try{draft=await L.fromPhoto(form.elements.photo.files[0]);syncFields();$('mpProfileError').textContent='照片处理完成，可微调后保存'}catch(err){$('mpProfileError').textContent=err.message}};
      $('mpResetLook').onclick=()=>{draft={...L.fallback};syncFields()};
      $('mpLogout').onclick=async()=>{manualLogout=true;try{await api('/logout',{method:'POST',body:'{}'})}catch{}saveToken('');ws?.close();MP.connected=false;me=null;peers.clear();profiles.clear();chatCache.clear();boardItems=[];pending.clear();seenMsgs.clear();connectedUI(false);closeProfile();showAuth('已退出登录')};
      form.onsubmit=async e=>{e.preventDefault();const tags=form.elements.tags.value.split(/[，,]/).map(x=>x.trim()).filter(Boolean);try{const updated=await api('/profile/me',{method:'PUT',body:JSON.stringify({look:draft,bio:form.elements.bio.value,college:form.elements.college.value,grade:form.elements.grade.value,tags})});me=updated;look=updated.look;profiles.set(me.id,updated);updateSelf();socketSend({type:'look.update',look});status('个人资料已保存');closeProfile()}catch(err){$('mpProfileError').textContent=err.message}};
    }).catch(err=>{body.textContent=err.message})}
  function showMenu(id,anchor){id=Number(id);if(id===me.id){showProfile(id);return}menuUser=id;menuAnchor=anchor;const menu=$('mpMenu');menu.hidden=false;const r=anchor.getBoundingClientRect(),h=80;menu.style.left=Math.max(6,Math.min(window.innerWidth-150,r.left))+'px';menu.style.top=(r.top>h+12?r.top-h-5:r.bottom+5)+'px'}
  function closeChat(){$('mpChat').hidden=true;chatWith=null;$('mpChatInput').blur();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0}
  function activePoint(e,indoor){const c=indoor?ctrCv:cv,r=c.getBoundingClientRect();if(indoor){const z=Math.max(1,Math.min(Math.floor(c.width/CTR_W),Math.floor(c.height/CTR_H))),ox=((c.width-CTR_W*z)/2)|0,oy=((c.height-CTR_H*z)/2)|0;return{x:((e.clientX-r.left)*c.width/r.width-ox)/z,y:((e.clientY-r.top)*c.height/r.height-oy)/z}}return{x:cam.x+((e.clientX-r.left)*VIEW_W/r.width)/zoom,y:cam.y+((e.clientY-r.top)*VIEW_H/r.height)/zoom}}
  function hit(e,indoor){if(!MP.connected||scene!==(indoor?CENTER.room?.key:'out'))return null;const at=activePoint(e,indoor);if(indoor){const n=CENTER.room?.npc;if(n&&Math.abs(at.x-n.x)<18&&Math.abs(at.y-n.y)<28)return null}else{for(const n of [GUIDE,GUARD,AUNT])if(n&&Math.abs(at.x-n.x)<18&&Math.abs(at.y-n.y)<30)return null}return [...peers.values()].filter(p=>{const v=point(p,performance.now());return Math.abs(at.x-v.x)<14&&at.y>=v.y-32&&at.y<=v.y+7}).sort((a,b)=>b.y-a.y)[0]||null}
  function bindHits(c,indoor){let down=null;c.addEventListener('pointerdown',e=>{if(e.button!==0)return;const p=hit(e,indoor);down=p?{id:p.id,x:e.clientX,y:e.clientY}:null});c.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<=5)openChat(down.id);down=null});c.addEventListener('pointermove',e=>{c.style.cursor=hit(e,indoor)?'pointer':''});c.addEventListener('pointercancel',()=>down=null)}
  const MP={connected:false,get look(){return look},sprite:L.sprite,crouch:L.crouch,changeScene(next,x,y){scene=next;peers.clear();if(MP.connected)socketSend({type:'scene.change',to:next,x,y})},onFrame(now){if(!MP.connected||now-moveAt<100)return;moveAt=now;const p=myPos(),key=[scene,p.x.toFixed(1),p.y.toFixed(1),p.dir].join('|');if(key!==lastMove){socketSend({type:'move',...p});lastMove=key}},appendOutdoorPeers(list){if(!MP.connected||scene!=='out')return;for(const p of [...peers.values()].sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)).slice(0,30)){const v=point(p,performance.now());if(Math.abs(v.x-cam.x)>viewW+30||Math.abs(v.y-cam.y)>viewH+30)continue;const step=performance.now()-p.at<500?Math.floor(performance.now()/135)%4:4;list.push({img:L.sprite(p.look,p.dir,step),ax:CH_AX,ay:CH_AY,x:v.x,y:v.y,baseY:v.y,clip:Math.round(CH_H*lakeSubmerge(v.x,v.y))})}},appendIndoorPeers(who,g){if(!MP.connected||scene==='out')return;for(const p of [...peers.values()].slice(0,30)){const v=point(p,performance.now()),step=performance.now()-p.at<500?Math.floor(performance.now()/135)%4:4;who.push({y:v.y,f:()=>ctrDrawChar(g,L.sprite(p.look,p.dir,step),v.x,v.y)})}},drawLabels(){if(!MP.connected||scene!=='out')return;ctx.save();ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.textBaseline='bottom';for(const p of peers.values()){const v=point(p,performance.now()),x=(v.x-Math.round(cam.x))*zoom,y=(v.y-CH_AY-Math.round(cam.y))*zoom-4;if(x<0||x>VIEW_W||y<0||y>VIEW_H)continue;const name=p.nickname.slice(0,16),w=ctx.measureText(name).width+8;ctx.fillStyle='rgba(19,27,35,.88)';ctx.fillRect(x-w/2,y-13,w,14);ctx.fillStyle='#fff';ctx.fillText(name,x,y-2)}ctx.restore()},drawIndoorLabels(g){if(!MP.connected||scene==='out')return;g.save();g.font='bold 10px system-ui';g.textAlign='center';for(const p of peers.values()){const v=point(p,performance.now()),w=g.measureText(p.nickname).width+6;g.fillStyle='rgba(19,27,35,.9)';g.fillRect(v.x-w/2,v.y-43,w,13);g.fillStyle='#fff';g.fillText(p.nickname,v.x,v.y-33)}g.restore()}};
  window.MP=MP;
  bindHits(cv,false);bindHits(ctrCv,true);
  $('mpLoginTab').onclick=()=>setAuthMode('login');$('mpRegisterTab').onclick=()=>setAuthMode('register');$('mpAuthForm').onsubmit=submitAuth;$('mpSolo').onclick=()=>{hideAuth();status('当前为单机模式')};
  $('mpSelf').onclick=()=>showProfile(me.id);$('mpBoardToggle').onclick=()=>{$('mpBoard').hidden?openBoard():$('mpBoard').hidden=true};$('mpBoardClose').onclick=()=>$('mpBoard').hidden=true;
  $('mpBoardForm').onsubmit=e=>{e.preventDefault();const input=$('mpBoardInput'),content=input.value.trim();if(content&&socketSend({type:'announce.post',content,clientMsgId:crypto.randomUUID()})){input.value='';$('mpBoardError').textContent=''}};
  $('mpChatClose').onclick=closeChat;$('mpChatForm').onsubmit=e=>{e.preventDefault();const input=$('mpChatInput'),content=input.value.trim();if(!content||!chatWith)return;const clientMsgId=crypto.randomUUID();pending.set(clientMsgId,{from:me.id,to:chatWith,content,fromNickname:me.nickname,look,clientMsgId});if(socketSend({type:'chat.send',to:chatWith,content,clientMsgId})){input.value='';$('mpChatError').textContent='';input.focus()}else pending.delete(clientMsgId)};
  $('mpChatInput').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('mpChatForm').requestSubmit()}};
  $('mpProfileClose').onclick=closeProfile;$('mpProfileShade').onclick=e=>{if(e.target===$('mpProfileShade'))closeProfile()};
  $('mpMenuChat').onclick=()=>{const id=menuUser;$('mpMenu').hidden=true;openChat(id)};$('mpMenuProfile').onclick=()=>showProfile(menuUser);
  root.addEventListener('click',e=>{const av=e.target.closest('.mp-avatar');if(av&&av.dataset.user){showMenu(av.dataset.user,av);e.stopPropagation()}else if(!$('mpMenu').hidden&&!e.target.closest('#mpMenu'))$('mpMenu').hidden=true});
  root.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList.contains('mp-avatar')){showMenu(e.target.dataset.user,e.target);e.stopPropagation()}});
  window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('mpMenu').hidden)$('mpMenu').hidden=true;else if(!$('mpProfileShade').hidden)closeProfile();else if(!$('mpChat').hidden)closeChat();else if(!$('mpBoard').hidden)$('mpBoard').hidden=true;return}if(e.key.toLowerCase()==='p'&&MP.connected&&!e.target.closest('#mpRoot')){showProfile(me.id);e.preventDefault();e.stopImmediatePropagation()}if(e.target.closest?.('#mpRoot')){e.stopImmediatePropagation();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0}},true);
  window.addEventListener('keyup',e=>{if(e.target.closest?.('#mpRoot'))e.stopImmediatePropagation()},true);
  if(location.protocol==='file:'){status('当前为单机模式');return}
  try{token=localStorage.getItem(tokenKey)||''}catch{}
  if(token){api('/profile/me').then(p=>{me=p;look=p.look;profiles.set(p.id,p);connect()}).catch(()=>{saveToken('');showAuth('请登录联机大厅')})}else showAuth();
})();
