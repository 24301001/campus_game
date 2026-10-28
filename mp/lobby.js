(() => {
  'use strict';
  const L = window.MPLook;
  const root=document.createElement('div');root.id='mpRoot';
  root.innerHTML=`
    <div id="mpStatus" hidden></div>
    <button id="mpSelf" type="button" hidden title="个人中心"></button>
    <button id="mpSprite" type="button" hidden>🧍 玩家精灵</button>
    <div id="mpSpriteMenu" class="mp-panel" hidden><div id="mpSpriteFigure"></div><button type="button" id="mpSummonGuard" class="mp-primary">📣 呼叫老丁</button></div>
    <button id="mpSoloCanteen" type="button" hidden>🍜 进入食堂</button>
    <button id="mpSoloExit" type="button" hidden>退出单机 · 登录</button>
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
      <form id="mpAuthForm" autocomplete="off"><input id="mpName" class="mp-field" minlength="2" maxlength="16" placeholder="昵称（2–16 字）" autocomplete="off" required><input id="mpPass" class="mp-field" type="password" minlength="8" placeholder="密码（至少 8 位）" autocomplete="new-password" required><label id="mpAuthPhotoLine" hidden>上传照片生成卡通小人（可选，失败也能进入）<input id="mpAuthPhoto" type="file" accept="image/*" class="mp-field"></label><div id="mpAuthLookPreview" hidden></div><button class="mp-primary" id="mpAuthSubmit">登录并进入</button><div id="mpAuthError" class="mp-error" role="alert"></div></form>
      <button type="button" class="mp-secondary" id="mpSolo">暂时单机游览</button>
    </section></div>
    <div id="mpProfileShade" hidden><section id="mpProfile" class="mp-panel" aria-label="个人主页"><div class="mp-head"><span class="mp-title" id="mpProfileTitle">个人中心</span><button class="mp-icon" id="mpProfileClose" aria-label="关闭主页">×</button></div><div id="mpProfileBody"></div></section></div>
    <div id="mpNearby" class="mp-panel" hidden><div id="mpNearbyWho"></div><div class="mp-near-actions"><button type="button" id="mpNearbyChat" class="mp-primary">💬 发起私聊</button><button type="button" id="mpNearbyProfile" class="mp-secondary">查看主页</button></div></div>
    <section id="mpGuard" class="mp-panel" hidden aria-label="地图上和老丁对话"><div class="mp-head"><span class="mp-title">保安 · 老丁</span><button id="mpGuardClose" class="mp-icon" aria-label="关闭老丁对话">×</button></div><div id="mpGuardLog" role="log" aria-live="polite"></div><form id="mpGuardForm"><input id="mpGuardInput" class="mp-field" maxlength="500" placeholder="和老丁说句话…" aria-label="给老丁发消息"><button class="mp-primary">发送</button></form></section>
    <iframe id="mpGuardBridge" src="about:blank" hidden title="老丁对话服务"></iframe>
    <div id="mpMenu" class="mp-panel" hidden><button id="mpMenuChat">💬 发起对话</button><button id="mpMenuProfile">👤 个人主页</button></div>`;
  document.body.append(root);
  const $=id=>document.getElementById(id), tokenKey='mpToken';
  let token='',me=null,ws=null,chatWith=null,authMode='login',authLook=null,showLookPrompt=false,retries=0,reconnectTimer=0,pingTimer=0,moveAt=0,lastMove='',scene='out',unread=0,menuUser=null,menuAnchor=null,boardSending='',nearUser=null,profileUser=null,guardReady=false,guardOpening=false,soloMode=false;
  const peers=new Map(),profiles=new Map(),chatCache=new Map(),pending=new Map(),seenMsgs=new Set();
  let boardItems=[],look=L.fallback,boardTimer=0,menuAt=0;
  function status(text,keep=false){const e=$('mpStatus');e.textContent=text;e.hidden=!text;if(!keep&&text)setTimeout(()=>{if(e.textContent===text)e.hidden=true},3000)}
  function authHeader(){return {'Content-Type':'application/json',Authorization:'Bearer '+token}}
  async function api(path,options={}){const r=await fetch('/api/mp'+path,{...options,headers:{...authHeader(),...(options.headers||{})}});let data=await r.json();if(!r.ok)throw Error(data.error||'请求失败');return data}
  function saveToken(v){token=v;try{v?localStorage.setItem(tokenKey,v):localStorage.removeItem(tokenKey)}catch{}}
  function clientId(){if(crypto?.randomUUID)return crypto.randomUUID();const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);return [...bytes].map(x=>x.toString(16).padStart(2,'0')).join('')}
  /* [QODER-FIX #21] 单机访客登录抽成独立函数：首次点“暂时单机游览”和刷新后
     再进食堂/NPC 都走它。以前只在按钮回调里登录一次，刷新后 token 只存在内存，
     ensureNpc 直接返回 auth ⇒ 单机状态进不了食堂（阿姨处同样）。 */
  async function soloSignIn(){
    let guest;try{guest=JSON.parse(sessionStorage.getItem('mpGuest')||'null')}catch{}
    if(!guest?.nickname||!guest?.password){guest={nickname:'游客'+clientId().slice(0,8),password:clientId()+clientId()};await api('/register',{method:'POST',body:JSON.stringify(guest)});sessionStorage.setItem('mpGuest',JSON.stringify(guest))}
    const result=await api('/login',{method:'POST',body:JSON.stringify(guest)});
    token=result.token;me=result.user;look=me.look;soloMode=true;
    try{localStorage.setItem('mpNickname',guest.nickname)}catch{}
    return result;
  }
  function currentScene(){return typeof CENTER!=='undefined'&&CENTER.active&&CENTER.room?CENTER.room.key:'out'}
  function myPos(){return scene==='out'?{x:player.x,y:player.y,dir:player.dir}:{x:CENTER.x,y:CENTER.y,dir:CENTER.dir}}
  function avatarEl(recipe,id,online=true,interactive=true){const c=L.avatar(recipe);c.className='mp-avatar'+(interactive?'':' mp-avatar-static');if(interactive){c.title='查看头像菜单';c.dataset.user=id;c.setAttribute('role','button');c.setAttribute('tabindex','0')}c.style.opacity=online?1:.65;return c}
  function iconTo(parent,recipe,id,online=true){parent.replaceChildren(avatarEl(recipe,id,online))}
  function timeText(iso){if(!iso)return '';const d=new Date(iso),sec=Math.max(0,(Date.now()-d.getTime())/1000);return sec<60?'刚刚':sec<3600?Math.floor(sec/60)+' 分钟前':d.toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}
  function setAuthMode(mode){authMode=mode;$('mpAuthSubmit').textContent=mode==='register'?'注册并进入':'登录并进入';$('mpAuthPhotoLine').hidden=mode!=='register';$('mpAuthPhoto').required=false;$('mpLoginTab').style.borderColor=mode==='login'?'#ffd76e':'';$('mpRegisterTab').style.borderColor=mode==='register'?'#ffd76e':'';$('mpAuthError').textContent=''}
  /* [QODER-FIX #1] 退出登录后给一张干净的登录页：除了 reset()，再显式清空账号密码，
     防止浏览器自动填充把上一位用户的昵称/密码又填回来。 */
  function showAuth(msg=''){setAuthMode('login');$('mpAuthForm').reset();$('mpName').value='';$('mpPass').value='';$('mpAuthPhoto').value='';$('mpAuthLookPreview').replaceChildren();$('mpAuthLookPreview').hidden=true;authLook=null;$('mpAuthShade').hidden=false;$('mpAuthError').textContent=msg;$('mpName').focus()}
  function hideAuth(){$('mpAuthShade').hidden=true}
  function connectedUI(on){$('mpSelf').hidden=$('mpSprite').hidden=$('mpBoardToggle').hidden=!on;if(!on){$('mpBoard').hidden=true;$('mpChat').hidden=true;$('mpProfileShade').hidden=true;$('mpMenu').hidden=true;$('mpSpriteMenu').hidden=true;$('mpNearby').hidden=true;nearUser=null}else updateSelf()}
  function updateSelf(){if(!me)return;const el=$('mpSelf');el.replaceChildren(avatarEl(look,me.id,true,false),document.createTextNode(me.nickname+' · 个人中心'));$('mpSpriteFigure').replaceChildren(L.sprite(look,'down',4))}
  function clearNpcTickets(){/* [QODER-FIX #9] 换账号时把 NPC 侧的会话/历史一起清掉：
      活着的密钥按前缀扫（老丁 guard_v…_chat_、guard_v…_player_，算法哥 agent_watch_），
      再把已经加载的抽屉和地图对话桥接 iframe 打回空白页，避免上一位用户的聊天还挂在界面上。 */
    const exact=['xbg_token','ld_token','token','user','mpNickname','xbg_cred','ld_cred','cmr_cred','campus_cred','xbg_shot_auto'];
    try{for(const key of Object.keys(localStorage)){if(exact.includes(key)||/^(guard_v\d+_|agent_watch_)/.test(key))localStorage.removeItem(key)}}catch{}
    try{sessionStorage.removeItem('mpGuest')}catch{}
    try{$('mpGuardBridge').src='about:blank';guardReady=false;$('mpGuardLog').replaceChildren()}catch{}
    try{if(ctrF)ctrF.setAttribute('src','about:blank')}catch{}}
  function resetWorld(){
    $('mpSoloCanteen').hidden=true;
    $('mpSoloExit').hidden=true;$('mpSpriteMenu').hidden=true;
    GUARD.summoned=false;GUARD.path=null;GUARD.spot=0;GUARD.wi=0;GUARD.pauseT=1.2;GUARD.summonRepath=0;
    if(GUARD_SPOTS.length){const home=guardSnap(GUARD_SPOTS[0].x,GUARD_SPOTS[0].y);GUARD.x=home.x;GUARD.y=home.y}
    guardReady=false;guardOpening=false;$('mpGuard').hidden=true;$('mpGuardLog').replaceChildren();$('mpGuardInput').value='';$('mpGuardBridge').src='about:blank';
    if(CENTER.active)roomLeave();else if(CENTER.plat)ctrClosePlatform();
    if(ctrF)ctrF.setAttribute('src','about:blank');
    player.x=SPAWN.x;player.y=SPAWN.y;player.dir='down';player.step=0;player.walk=0;player.idle=0;player.act=null;/* [QODER-FIX #2] 每次登录/登出都把玩家送回南门出生点，不继承上一位用户站的位置 */
    for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0;
    scene='out';lastMove='';hudTick();
  }
  function clearAccountState(){
    soloMode=false;clearTimeout(boardTimer);boardSending='';
    clearTimeout(reconnectTimer);clearInterval(pingTimer);const old=ws;ws=null;old?.close();
    saveToken('');clearNpcTickets();MP.connected=false;me=null;look=L.fallback;showLookPrompt=false;
    peers.clear();profiles.clear();chatCache.clear();boardItems=[];pending.clear();seenMsgs.clear();
    chatWith=null;menuUser=null;menuAnchor=null;nearUser=null;profileUser=null;unread=0;boardSending='';updateUnread();
    $('mpBoardList').replaceChildren();$('mpChatLog').replaceChildren();$('mpBoardInput').value='';$('mpChatInput').value='';
    $('mpBoardError').textContent='';$('mpChatError').textContent='';$('mpBoardForm').querySelector('button').disabled=false;
    connectedUI(false);resetWorld();status('');
  }
  async function submitAuth(e){e.preventDefault();const nickname=$('mpName').value.trim(),password=$('mpPass').value,button=$('mpAuthSubmit');button.disabled=true;$('mpAuthError').textContent='';try{
    if(authMode==='register'){
      authLook={...L.fallback};
      if($('mpAuthPhoto').files[0])try{authLook=await L.fromPhoto($('mpAuthPhoto').files[0])}catch{status('照片无法处理，已使用默认形象，可在个人中心调整',true)}
      await api('/register',{method:'POST',body:JSON.stringify({nickname,password})});
    }
    /* [QODER-FIX #3] 注册/登录成功后先把上一位用户的本地缓存整个清掉（公告、私聊、
       附近的人、NPC 票据），再写入新 token，避免新账号界面里还挂着旧用户的记录。 */
    const result=await api('/login',{method:'POST',body:JSON.stringify({nickname,password})});clearAccountState();saveToken(result.token);me=result.user;look=me.look;profiles.set(me.id,me);localStorage.setItem('mpNickname',me.nickname);
    if(authMode==='register'&&authLook){me=await api('/profile/me',{method:'PUT',body:JSON.stringify({look:authLook})});look=me.look;profiles.set(me.id,me)}
    showLookPrompt=L.isDefault(look);hideAuth();connect();
  }catch(err){$('mpAuthError').textContent=err.message}finally{button.disabled=false}}
  function socketSend(payload){if(ws&&ws.readyState===WebSocket.OPEN){ws.send(JSON.stringify(payload));return true}status('联机暂不可用，消息未发送',true);return false}
  function connect(){if(!token||location.protocol==='file:')return;if(ws&&ws.readyState<=1)ws.close();clearTimeout(reconnectTimer);
    const scheme=location.protocol==='https:'?'wss':'ws';let socket;
    try{socket=new WebSocket(`${scheme}://${location.hostname}:8090/mp?token=${encodeURIComponent(token)}`)}catch{retries++;status('连接中断，正在重连…',true);reconnectTimer=setTimeout(connect,Math.min(30000,1000*2**Math.min(retries-1,5)));return}
    ws=socket;
    socket.onopen=()=>{if(ws!==socket)return;retries=0;scene=currentScene();const p=myPos();socketSend({type:'hello',scene,...p,look});socketSend({type:'announce.list',limit:50});clearInterval(pingTimer);pingTimer=setInterval(()=>socketSend({type:'ping'}),15000);status('已连接联机大厅')};
    socket.onmessage=e=>{if(ws!==socket)return;try{onPacket(JSON.parse(e.data))}catch(err){console.error('[mp]',err)}};
    socket.onclose=e=>{if(ws!==socket)return;ws=null;clearInterval(pingTimer);MP.connected=false;if(e.code===4001||e.code===4003){clearAccountState();showAuth(e.code===4001?'该账号已在另一处登录':'请重新登录');return}if(boardSending){boardSending='';$('mpBoardForm').querySelector('button').disabled=false;$('mpBoardError').textContent='连接中断，公告未确认，请重试'}connectedUI(false);peers.clear();retries++;status('连接中断，正在重连…',true);reconnectTimer=setTimeout(connect,Math.min(30000,1000*2**Math.min(retries-1,5)))};
  }
  function onPacket(m){switch(m.type){
    case 'welcome':me=m.me;look=me.look;profiles.set(me.id,me);scene=m.scene;peers.clear();m.peers.forEach(addPeer);MP.connected=true;connectedUI(true);updateSelf();if(showLookPrompt){showLookPrompt=false;showProfile(me.id);status('请上传照片生成你的卡通形象',true)}break;
    case 'scene.peers':scene=m.scene;peers.clear();m.peers.forEach(addPeer);break;
    case 'peer.join':addPeer(m.peer);break;
    case 'peer.move':{const p=peers.get(m.id);if(p){const v=point(p,performance.now());p.fromX=v.x;p.fromY=v.y;p.x=m.x;p.y=m.y;p.dir=m.dir;p.at=performance.now()}break}
    case 'peer.leave':peers.delete(m.id);break;
    case 'peer.look':{const p=peers.get(m.id);if(p)p.look=m.look;const q=profiles.get(m.id);if(q)q.look=m.look;if(nearUser===m.id)nearUser=null;renderBoard();if(chatWith===m.id)renderChat();break}
    case 'announce.list':boardItems=m.items;renderBoard();break;
    case 'announce.new':boardItems.push(m);boardItems=boardItems.slice(-50);if($('mpBoard').hidden){unread++;updateUnread()}renderBoard();break;
    case 'announce.ack':if(m.clientMsgId===boardSending){clearTimeout(boardTimer);boardSending='';$('mpBoardInput').value='';$('mpBoardForm').querySelector('button').disabled=false;$('mpBoardError').textContent='公告已发送'}break;
    case 'chat.history':chatCache.set(m.withUser,mergeMessages(chatCache.get(m.withUser)||[],m.items));if(chatWith===m.withUser)renderChat();break;
    case 'chat.msg':{if(seenMsgs.has(m.msgId))break;seenMsgs.add(m.msgId);const other=m.from===me.id?m.to:m.from;chatCache.set(other,mergeMessages(chatCache.get(other)||[],[m]));if(chatWith===other)renderChat();else status(m.fromNickname+' 发来新消息');break}
    case 'chat.ack':{const p=pending.get(m.clientMsgId);if(p){pending.delete(m.clientMsgId);const msg={...p,msgId:m.msgId,at:m.at};chatCache.set(p.to,mergeMessages(chatCache.get(p.to)||[],[msg]));if(chatWith===p.to)renderChat()}break}
    case 'presence':{const p=profiles.get(m.userId);if(p){p.online=m.online;p.lastSeen=m.lastSeen}renderBoard();if(chatWith===m.userId)renderChatTitle();break}
    case 'error':if(m.code?.startsWith('ANNOUNCE')){if(!m.clientMsgId||m.clientMsgId===boardSending){clearTimeout(boardTimer);boardSending='';$('mpBoardForm').querySelector('button').disabled=false;$('mpBoardError').textContent=m.msg}}else if(m.code?.startsWith('CHAT'))$('mpChatError').textContent=m.msg;status(m.msg);break;
  }}
  function mergeMessages(a,b){const map=new Map([...a,...b].map(x=>[x.msgId,x]));return [...map.values()].sort((x,y)=>x.msgId-y.msgId)}
  function addPeer(v){if(v.id===me?.id)return;peers.set(v.id,{...v,fromX:v.x,fromY:v.y,at:performance.now()});profiles.set(v.id,{...(profiles.get(v.id)||{}),...v,online:true})}
  function point(p,now){const t=Math.min(1,Math.max(0,(now-p.at)/120));return{x:p.fromX+(p.x-p.fromX)*t,y:p.fromY+(p.y-p.fromY)*t}}
  function updateNearby(){
    const platformOpen=!!CENTER.plat;
    $('mpBoardToggle').hidden=platformOpen;
    if(platformOpen)$('mpBoard').hidden=true;
    const card=$('mpNearby');
    if(!MP.connected||!$('mpBoard').hidden||!$('mpChat').hidden||!$('mpProfileShade').hidden){card.hidden=true;return}
    const here=myPos(),now=performance.now();let closest=null,distance=52;
    for(const p of peers.values()){
      const v=point(p,now),d=Math.hypot(here.x-v.x,here.y-v.y);
      if(d<distance){closest=p;distance=d}
    }
    if(!closest){card.hidden=true;nearUser=null;return}
    if(nearUser!==closest.id){
      nearUser=closest.id;const who=$('mpNearbyWho'),text=document.createElement('span');
      text.textContent=closest.nickname;who.replaceChildren(avatarEl(closest.look,closest.id,true,false),text);
    }
    card.hidden=false;
  }
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
  function openChat(id){if(!MP.connected||id===me.id)return;chatWith=Number(id);$('mpBoard').hidden=true;$('mpNearby').hidden=true;$('mpChat').hidden=false;$('mpChatError').textContent='';renderChat();socketSend({type:'chat.history',withUser:chatWith,limit:30});$('mpChatInput').focus();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0}
  async function ensureProfile(id){const p=await api('/profile/'+id);profiles.set(id,p);return p}
  function closeProfile(){profileUser=null;$('mpProfileShade').hidden=true}
  function showProfile(id){$('mpMenu').hidden=true;$('mpNearby').hidden=true;profileUser=id;const mine=id===me.id;$('mpProfile').classList.toggle('mp-other-profile',!mine);$('mpProfileShade').hidden=false;$('mpProfileTitle').textContent=mine?'个人中心':'个人主页';const body=$('mpProfileBody');body.replaceChildren();
    ensureProfile(id).then(p=>{if($('mpProfileShade').hidden||profileUser!==id||!me)return;body.replaceChildren();const top=document.createElement('div');top.className='mp-profile-top';top.append(avatarEl(p.look,id,p.online,false));const details=document.createElement('div');const name=document.createElement('strong');name.textContent=p.nickname;const line=document.createElement('div');line.className='mp-muted';line.textContent=mine?'昵称不可修改 · ID '+id:(p.online?'● 在线 · ID '+id:'○ 离线 · ID '+id+' · '+(p.lastSeen?timeText(p.lastSeen):'暂无记录'));details.append(name,line);top.append(details);body.append(top);
      /* [QODER-FIX #16] 别人的主页按公开/隐藏设置显示：后端已把隐藏项清空，
         这里再按 visibility 兜一层（防止接口变化时把隐藏资料又渲染出来）。 */
      if(!mine){const vis=p.visibility||{},info=document.createElement('dl');info.className='mp-public-info';for(const [key,label] of [['bio','签名'],['college','学院'],['grade','年级'],['tags','兴趣标签']]){if(vis[key]===false)continue;const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;const value=key==='tags'?(p.tags||[]):p[key];if(key==='tags'&&value.length){for(const tag of value){const chip=document.createElement('span');chip.className='mp-tag';chip.textContent=tag;dd.append(chip)}}else dd.textContent=key==='tags'?'未填写':(value||'未填写');row.append(dt,dd);info.append(row)}body.append(info);const button=document.createElement('button');button.className='mp-primary';button.textContent='💬 发起私聊';button.onclick=()=>{closeProfile();openChat(id)};body.append(button);return}
      const form=document.createElement('form');form.id='mpProfileForm';form.innerHTML=`<div class="mp-form-grid"><label class="wide">签名<input name="bio" class="mp-field" maxlength="40"></label><label>学院<input name="college" class="mp-field" maxlength="32"></label><label>年级<select name="grade" class="mp-field"><option value="">未填写</option><option>大一</option><option>大二</option><option>大三</option><option>大四</option><option>硕士</option><option>博士</option></select></label><label class="wide">兴趣标签（输入后按回车或逗号，最多 5 个）<span id="mpTagChips" class="mp-tag-list"></span><input name="tags" class="mp-field" maxlength="6" placeholder="输入标签后按回车"></label></div><fieldset class="mp-privacy"><legend>别人能看到的资料</legend><label><input type="checkbox" name="showBio"> 签名</label><label><input type="checkbox" name="showCollege"> 学院</label><label><input type="checkbox" name="showGrade"> 年级</label><label><input type="checkbox" name="showTags"> 兴趣标签</label></fieldset><p class="mp-muted mp-privacy-hint">勾选 = 公开；取消勾选后，其他玩家在你的主页看不到这一项。</p><div class="mp-look-preview" id="mpLookPreview"></div><label>从照片生成形象（照片只在本机处理）<input name="photo" type="file" accept="image/*" class="mp-field"></label><div class="mp-look-controls"><label>发型<select name="hairStyle" class="mp-field"><option value="short">短发</option><option value="mid">中发</option><option value="long">长发</option><option value="ponytail">马尾</option><option value="bun">丸子头</option><option value="curly">卷发</option></select></label><label>眼型<select name="eye" class="mp-field"><option value="round">圆眼</option><option value="narrow">细眼</option><option value="dot">豆豆眼</option></select></label><label>瞳色<input name="eyeColor" type="color" class="mp-field"></label><label>配饰<select name="acc" class="mp-field"><option value="none">无</option><option value="glasses">眼镜</option><option value="cap">帽子</option><option value="scarf">围巾</option></select></label><label>发色<input name="hairColor" type="color" class="mp-field"></label><label>上衣主色<input name="cloth" type="color" class="mp-field"></label><label>上衣样式<select name="clothPattern" class="mp-field"><option value="solid">纯色</option><option value="stripe">横条纹</option></select></label><label>条纹副色<input name="clothAlt" type="color" class="mp-field"></label><label>肤色<input name="skin" type="color" class="mp-field"></label><label>裤子<input name="pants" type="color" class="mp-field"></label><label id="mpAccColorRow"><span id="mpAccColorName">配饰颜色</span><input name="accColor" type="color" class="mp-field"></label></div><div class="mp-profile-actions"><button type="button" id="mpResetLook" class="mp-secondary">恢复默认形象</button><button type="button" id="mpDownloadLook" class="mp-secondary">下载卡通头像 PNG</button><button class="mp-primary">保存资料</button><button type="button" id="mpLogout" class="mp-secondary">退出登录</button></div><div class="mp-error" id="mpProfileError" role="alert"></div>`;
      body.append(form);form.elements.bio.value=p.bio||'';form.elements.college.value=p.college||'';form.elements.grade.value=p.grade||'';for(const field of ['Bio','College','Grade','Tags'])form.elements['show'+field].checked=p.visibility?.[field.toLowerCase()]!==false;let draft=L.norm(p.look);
      const tags=[...(p.tags||[])],chips=$('mpTagChips');
      function renderTags(){chips.replaceChildren();for(const value of tags){const tag=document.createElement('button');tag.type='button';tag.className='mp-tag';tag.textContent=value+' ×';tag.title='删除标签';tag.onclick=()=>{tags.splice(tags.indexOf(value),1);renderTags()};chips.append(tag)}}
      function commitTag(){const value=form.elements.tags.value.trim();form.elements.tags.value='';if(!value)return true;if(value.length>6||tags.length>=5){$('mpProfileError').textContent='最多 5 个标签，每个最多 6 字';return false}if(!tags.includes(value))tags.push(value);renderTags();$('mpProfileError').textContent='';return true}
      renderTags();form.elements.tags.addEventListener('keydown',e=>{if(['Enter','Return','NumpadEnter',',','，'].includes(e.key)||e.code==='NumpadEnter'){e.preventDefault();e.stopPropagation();commitTag()}});form.elements.tags.addEventListener('input',()=>{const val=form.elements.tags.value;if(/[，,]/.test(val)){form.elements.tags.value=val.split(/[，,]/)[0];commitTag()}});
      const history=document.createElement('details');history.className='mp-history';history.innerHTML='<summary>我的发送记录 · 仅自己可见</summary><div class="mp-muted">展开后加载记录…</div>';body.append(history);history.addEventListener('toggle',async()=>{if(!history.open)return;const box=history.querySelector('div');box.textContent='正在加载…';try{const data=await api('/history/me');box.replaceChildren();const board=document.createElement('section'),bh=document.createElement('h4');bh.textContent='我发过的公告 · '+data.announcements.length+' 条';board.append(bh);if(!data.announcements.length){const empty=document.createElement('p');empty.textContent='还没有发送公告';board.append(empty)}for(const a of data.announcements){const item=document.createElement('p');item.textContent=timeText(a.at)+' · '+a.content;board.append(item)}box.append(board);const groups=new Map();for(const m of data.private){if(!groups.has(m.to))groups.set(m.to,{name:m.nickname,items:[]});groups.get(m.to).items.push(m)}const heading=document.createElement('h4');heading.textContent='我发过的私聊 · 按用户分类';box.append(heading);if(!groups.size){const empty=document.createElement('p');empty.textContent='还没有发送私聊';box.append(empty)}for(const [uid,group] of groups){const section=document.createElement('details'),summary=document.createElement('summary');summary.textContent=group.name+' · ID '+uid+' · '+group.items.length+' 条';section.append(summary);for(const m of group.items){const item=document.createElement('p');item.textContent=timeText(m.at)+' · '+m.content;section.append(item)}box.append(section)}}catch(err){box.textContent=err.message}});
      function syncFields(){for(const k of ['hairStyle','eye','eyeColor','acc','hairColor','cloth','clothPattern','clothAlt','skin','pants','accColor'])form.elements[k].value=draft[k];preview()}
      function preview(){const box=$('mpLookPreview');box.replaceChildren();for(const d of ['down','left','right','up']){const c=L.sprite(draft,d,4).cloneNode();c.getContext('2d').drawImage(L.sprite(draft,d,4),0,0);box.append(c)}}
      syncFields();for(const k of ['hairStyle','eye','eyeColor','acc','hairColor','cloth','clothPattern','clothAlt','skin','pants','accColor']){const apply=()=>{draft[k]=form.elements[k].value;preview()};form.elements[k].addEventListener('input',apply);form.elements[k].addEventListener('change',apply)}
      /* [QODER-FIX #15] 配饰单独染色区：没戴配饰时隐藏，戴上后按配件改名（眼镜/帽子/围巾），
         颜色只作用于当前这件配饰。 */
      const accRow=form.querySelector('#mpAccColorRow'),accName=form.querySelector('#mpAccColorName');
      function syncAccColor(){const acc=form.elements.acc.value,names={glasses:'眼镜镜框颜色',cap:'帽子颜色',scarf:'围巾颜色'};accRow.hidden=acc==='none';accName.textContent=names[acc]||'配饰颜色'}
      form.elements.acc.addEventListener('change',syncAccColor);syncAccColor();
      form.elements.photo.onchange=async()=>{try{draft=await L.fromPhoto(form.elements.photo.files[0]);syncFields();$('mpProfileError').textContent='照片处理完成，可微调后保存'}catch(err){$('mpProfileError').textContent=err.message}};
      $('mpResetLook').onclick=()=>{draft={...L.fallback};syncFields()};
      $('mpDownloadLook').onclick=()=>{const a=document.createElement('a');a.download='像素校园卡通头像.png';a.href=L.portrait(draft).toDataURL('image/png');a.click()};
      $('mpLogout').onclick=async()=>{try{await api('/logout',{method:'POST',body:'{}'})}catch{}clearAccountState();showAuth()};
      form.onsubmit=async e=>{e.preventDefault();if(!commitTag())return;const visibility=Object.fromEntries(['Bio','College','Grade','Tags'].map(field=>[field.toLowerCase(),form.elements['show'+field].checked]));try{const updated=await api('/profile/me',{method:'PUT',body:JSON.stringify({look:draft,bio:form.elements.bio.value,college:form.elements.college.value,grade:form.elements.grade.value,tags,visibility})});me=updated;look=updated.look;profiles.set(me.id,updated);updateSelf();socketSend({type:'look.update',look});status('个人资料已保存');closeProfile()}catch(err){$('mpProfileError').textContent=err.message}};
    }).catch(err=>{body.textContent=err.message})}
  function showMenu(id,anchor){id=Number(id);if(id===me.id){showProfile(id);return}menuUser=id;menuAnchor=anchor;const menu=$('mpMenu');menuAt=performance.now();menu.hidden=false;const r=anchor.getBoundingClientRect(),h=80;menu.style.left=Math.max(6,Math.min(window.innerWidth-150,r.left))+'px';menu.style.top=(r.top>h+12?r.top-h-5:r.bottom+5)+'px'}
  /* [QODER-FIX #5/#8] 点击地图上的玩家精灵（没有 DOM 锚点，按点击坐标）弹出双选菜单
     （发起对话 / 个人主页），补回“点别人精灵直接私聊”的入口；不再一点就直接跳进私聊。 */
  function showMenuAt(id,x,y){id=Number(id);if(id===me.id){showProfile(id);return}menuUser=id;menuAnchor=null;const menu=$('mpMenu');menuAt=performance.now();menu.hidden=false;const h=80;menu.style.left=Math.max(6,Math.min(window.innerWidth-150,x-10))+'px';menu.style.top=(y>h+12?y-h-5:y+5)+'px'}
  function closeChat(){$('mpChat').hidden=true;chatWith=null;$('mpChatInput').blur();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0}
  function activePoint(e,indoor){const c=indoor?ctrCv:cv,r=c.getBoundingClientRect();if(indoor){const z=Math.max(1,Math.min(Math.floor(c.width/CTR_W),Math.floor(c.height/CTR_H))),ox=((c.width-CTR_W*z)/2)|0,oy=((c.height-CTR_H*z)/2)|0;return{x:((e.clientX-r.left)*c.width/r.width-ox)/z,y:((e.clientY-r.top)*c.height/r.height-oy)/z}}return{x:cam.x+((e.clientX-r.left)*VIEW_W/r.width)/zoom,y:cam.y+((e.clientY-r.top)*VIEW_H/r.height)/zoom}}
  function hit(e,indoor){if(!MP.connected||scene!==(indoor?CENTER.room?.key:'out'))return null;const at=activePoint(e,indoor);if(indoor){const n=CENTER.room?.npc;if(n&&Math.abs(at.x-n.x)<18&&Math.abs(at.y-n.y)<28)return null}else{for(const n of [GUIDE,GUARD,AUNT])if(n&&Math.abs(at.x-n.x)<18&&Math.abs(at.y-n.y)<30)return null}return [...peers.values()].filter(p=>{const v=point(p,performance.now());return Math.abs(at.x-v.x)<14&&at.y>=v.y-32&&at.y<=v.y+7}).sort((a,b)=>b.y-a.y)[0]||null}
  function bindHits(c,indoor){let down=null;c.addEventListener('pointerdown',e=>{if(e.button!==0)return;const p=hit(e,indoor);down=p?{id:p.id,x:e.clientX,y:e.clientY}:null});c.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<=5)showMenuAt(down.id,e.clientX,e.clientY);down=null});c.addEventListener('pointermove',e=>{c.style.cursor=hit(e,indoor)?'pointer':''});c.addEventListener('pointercancel',()=>down=null)}
  function outdoorLabelMetrics(scale){
    // Keep the tag close to the player's screen size, even in the whole-map view.
    const font=Math.max(2,Math.min(10,Math.round(10*scale))),small=scale<.5;
    return {font,height:font+(small?2:4),pad:small?1:Math.max(2,Math.round(4*scale)),gap:small?1:Math.max(2,Math.round(4*scale)),maxChars:small?5:scale<1?8:16};
  }
  function guardLine(who,message){const row=document.createElement('div');row.className='mp-guard-line '+who;row.textContent=(who==='self'?(me?.nickname||'我'):'老丁')+'：'+message;$('mpGuardLog').append(row);$('mpGuardLog').scrollTop=$('mpGuardLog').scrollHeight}
  /* [QODER-FIX #18] 老丁到达后不再弹独立对话框，直接在地图右下角展开这段对话；
     地图侧靠近按 C 也调用同一个入口。原来的“走进保卫处抽屉再聊”不再作为主路径。 */
  async function openGuardTalk(){
    if(guardOpening)return;
    if(!token){showAuth('请先登录再与老丁对话');return}
    guardOpening=true;
    $('mpBoard').hidden=true;$('mpChat').hidden=true;$('mpProfileShade').hidden=true;$('mpNearby').hidden=true;$('mpSpriteMenu').hidden=true;$('mpGuard').hidden=false;
    if(!$('mpGuardLog').childElementCount)guardLine('guard','我到啦，正在接通对话…');
    try{
      const result=await MP.ensureNpc('ld');
      if(result!=='ok'){guardLine('guard',result==='auth'?'请重新登录后再试':'老丁服务暂不可用，请稍后再试');return}
      if($('mpGuardBridge').getAttribute('src')!=='/ld/'){$('mpGuardBridge').src='/ld/';guardReady=false}
      guardLine('guard','已经接通，有什么事？');
      $('mpGuardInput').focus();
    }finally{guardOpening=false}
  }
  /* [QODER-FIX #18] 从个人中心一键召唤：置 GUARD.summoned 后，地图侧 79_guard.js 的
     guardTick 会持续朝玩家重算路径（跨场景跟随），距离 ≤54 时回调 MP.guardArrived 并自动开聊。 */
  function callGuard(){
    if(!token){showAuth('请先登录再呼叫老丁');return}
    if(CENTER.active){status('请先走出室内再呼叫老丁',true);return}
    closeProfile();$('mpSpriteMenu').hidden=true;GUARD.summoned=true;GUARD.summonRepath=0;status('已呼叫老丁，他正沿路赶来',true);
  }
  const MP={connected:false,get look(){return look},sprite:L.sprite,crouch:L.crouch,requireLogin(){connectedUI(false);showAuth('请在大厅重新登录')},async ensureNpc(kind){if(!token&&soloMode){try{await soloSignIn()}catch(e){return 'auth'}}if(!token)return 'auth';try{const t=await api('/npc/'+kind,{method:'POST',body:'{}'});if(kind==='xbg')localStorage.setItem('xbg_token',t.token);if(kind==='ld')localStorage.setItem('ld_token',t.token);if(kind==='agent'){localStorage.setItem('token',t.user.token);localStorage.setItem('user',JSON.stringify({id:t.user.userId,username:t.user.username,nickname:me.nickname,role:t.user.role}))}return 'ok'}catch(e){return /重新登录/.test(e.message)?'auth':'down'}},changeScene(next,x,y){scene=next;peers.clear();if(MP.connected)socketSend({type:'scene.change',to:next,x,y})},onFrame(now){if(!MP.connected||now-moveAt<100)return;moveAt=now;updateNearby();const p=myPos(),key=[scene,p.x.toFixed(1),p.y.toFixed(1),p.dir].join('|');if(key!==lastMove){socketSend({type:'move',...p});lastMove=key}},appendOutdoorPeers(list){if(!MP.connected||scene!=='out')return;for(const p of [...peers.values()].sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)).slice(0,30)){const v=point(p,performance.now());if(Math.abs(v.x-cam.x)>viewW+30||Math.abs(v.y-cam.y)>viewH+30)continue;const step=performance.now()-p.at<500?Math.floor(performance.now()/135)%4:4;list.push({img:L.sprite(p.look,p.dir,step),ax:CH_AX,ay:CH_AY,x:v.x,y:v.y,baseY:v.y,clip:Math.round(CH_H*lakeSubmerge(v.x,v.y))})}},appendIndoorPeers(who,g){if(!MP.connected||scene==='out')return;for(const p of [...peers.values()].slice(0,30)){const v=point(p,performance.now()),step=performance.now()-p.at<500?Math.floor(performance.now()/135)%4:4;who.push({y:v.y,f:()=>ctrDrawChar(g,L.sprite(p.look,p.dir,step),v.x,v.y)})}},drawLabels(){
    if(!MP.connected||scene!=='out')return;
    const metrics=outdoorLabelMetrics(zoom);
    if(!metrics)return;
    const now=performance.now(),drawn=[];
    ctx.save();ctx.font=`bold ${metrics.font}px system-ui`;ctx.textAlign='center';ctx.textBaseline='bottom';
    const self={id:me.id,nickname:me.nickname+' #'+me.id,x:player.x,y:player.y,fromX:player.x,fromY:player.y,at:now};
    for(const p of [self,...[...peers.values()].sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)).slice(0,30)]){
      const v=point(p,now),x=(v.x-Math.round(cam.x))*zoom,y=(v.y-CH_AY-Math.round(cam.y))*zoom-metrics.gap;
      if(x<0||x>VIEW_W||y<0||y>VIEW_H)continue;
      const own=p.id===me.id,font=own?Math.max(7,metrics.font):metrics.font,height=own?font+4:metrics.height,pad=own?2:metrics.pad;
      ctx.font=`bold ${font}px system-ui`;
      const name=own&&zoom<.5?'#'+me.id:(p.nickname.length>metrics.maxChars?p.nickname.slice(0,metrics.maxChars)+'…':p.nickname);
      const w=ctx.measureText(name).width+pad*2,box={left:x-w/2,right:x+w/2,top:y-height,bottom:y};
      if(drawn.some(q=>box.left<q.right&&box.right>q.left&&box.top<q.bottom&&box.bottom>q.top))continue;
      drawn.push(box);
      ctx.fillStyle='rgba(19,27,35,.88)';ctx.fillRect(box.left,box.top,w,height);
      ctx.fillStyle='#fff';ctx.fillText(name,x,y-2);
    }
    ctx.restore()
  },drawIndoorLabels(g){if(!MP.connected||scene==='out')return;g.save();g.font='bold 10px system-ui';g.textAlign='center';const own=myPos();for(const p of [{id:me.id,nickname:me.nickname+' #'+me.id,x:own.x,y:own.y,fromX:own.x,fromY:own.y,at:performance.now()},...peers.values()]){const v=point(p,performance.now()),w=g.measureText(p.nickname).width+6;g.fillStyle='rgba(19,27,35,.9)';g.fillRect(v.x-w/2,v.y-43,w,13);g.fillStyle='#fff';g.fillText(p.nickname,v.x,v.y-33)}g.restore()}};
  MP.openGuardTalk=openGuardTalk;
  MP.guardArrived=()=>{status('老丁已到达',true);openGuardTalk()};
  MP.callGuard=callGuard;
  window.MP=MP;
  bindHits(cv,false);bindHits(ctrCv,true);
  $('mpLoginTab').onclick=()=>setAuthMode('login');$('mpRegisterTab').onclick=()=>setAuthMode('register');$('mpAuthForm').onsubmit=submitAuth;$('mpSolo').onclick=async()=>{
    const button=$('mpSolo');button.disabled=true;$('mpAuthError').textContent='';
    try{
      await soloSignIn();
      hideAuth();$('mpSoloCanteen').hidden=false;$('mpSoloExit').hidden=false;status('单机游览中，可进入食堂与 NPC 功能',true);
    }catch(error){$('mpAuthError').textContent='单机服务暂不可用：'+error.message}
    finally{button.disabled=false}
  };
  $('mpSoloCanteen').onclick=()=>ctrOpenPlatform(AUNT_APP);
  $('mpSoloExit').onclick=async()=>{try{if(token)await api('/logout',{method:'POST',body:'{}'})}catch{}clearAccountState();showAuth()};
  $('mpAuthPhoto').onchange=async()=>{const file=$('mpAuthPhoto').files[0];if(!file)return;try{authLook=await L.fromPhoto(file);const box=$('mpAuthLookPreview');box.hidden=false;box.replaceChildren(L.portrait(authLook),document.createTextNode('像素卡通形象已生成，进入后还可以微调'));$('mpAuthError').textContent=''}catch(e){authLook=null;$('mpAuthError').textContent=e.message}};
  $('mpSelf').onclick=()=>showProfile(me.id);$('mpBoardToggle').onclick=()=>{$('mpBoard').hidden?openBoard():$('mpBoard').hidden=true};$('mpBoardClose').onclick=()=>$('mpBoard').hidden=true;
  $('mpSprite').onclick=()=>{$('mpSpriteMenu').hidden=!$('mpSpriteMenu').hidden};$('mpSummonGuard').onclick=callGuard;
  $('mpBoardForm').onsubmit=e=>{e.preventDefault();const input=$('mpBoardInput'),content=input.value.trim(),error=$('mpBoardError'),button=$('mpBoardForm').querySelector('button');if(!content||content.length>200){error.textContent='公告须为 1 至 200 字';return}/* [QODER-FIX #7] 上一条没收到服务器确认时，旧代码在这里静默 return，
     按钮又一直是 disabled ⇒ 用户看到的就是“点发送没反应”。现在给提示，并加超时兜底。 */
    if(boardSending){error.textContent='上一条公告还在发送，请稍候…';return}
    const id=clientId();if(!socketSend({type:'announce.post',content,clientMsgId:id})){error.textContent='当前未连接，公告没有发送';return}
    boardSending=id;button.disabled=true;error.textContent='正在发送…';
    clearTimeout(boardTimer);boardTimer=setTimeout(()=>{if(boardSending!==id)return;boardSending='';button.disabled=false;error.textContent='发送超时：联机通道没有确认，请检查网络后重试'},8000)};
  $('mpChatClose').onclick=closeChat;$('mpChatForm').onsubmit=e=>{e.preventDefault();const input=$('mpChatInput'),content=input.value.trim();if(!content||!chatWith)return;const clientMsgId=clientId();pending.set(clientMsgId,{from:me.id,to:chatWith,content,fromNickname:me.nickname,look,clientMsgId});if(socketSend({type:'chat.send',to:chatWith,content,clientMsgId})){input.value='';$('mpChatError').textContent='';input.focus()}else pending.delete(clientMsgId)};
  $('mpChatInput').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('mpChatForm').requestSubmit()}};
  $('mpProfileClose').onclick=closeProfile;$('mpProfileShade').onclick=e=>{if(e.target===$('mpProfileShade'))closeProfile()};
  /* [QODER-FIX #5/#8] 双选菜单的两个入口：发起对话 / 查看个人主页 */
  $('mpMenuChat').onclick=()=>{const id=menuUser;$('mpMenu').hidden=true;openChat(id)};$('mpMenuProfile').onclick=()=>showProfile(menuUser);
  $('mpNearbyChat').onclick=()=>{if(nearUser)openChat(nearUser)};$('mpNearbyProfile').onclick=()=>{if(nearUser)showProfile(nearUser)};
  $('mpGuardClose').onclick=()=>$('mpGuard').hidden=true;
  $('mpGuardForm').onsubmit=e=>{e.preventDefault();const input=$('mpGuardInput'),value=input.value.trim();if(!value)return;if(!guardReady){status('正在接通老丁，请稍等',true);return}guardLine('self',value);$('mpGuardBridge').contentWindow.postMessage({type:'campus.guard.ask',text:value},location.origin);input.value=''};
  window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==$('mpGuardBridge').contentWindow)return;if(e.data?.type==='campus.guard.ready'){guardReady=true;return}if(e.data?.type==='campus.guard.reply'&&!$('mpGuard').hidden)guardLine('guard',String(e.data.text||''))});
  /* [QODER-FIX #8] menuAt：pointerup 打开双选菜单后，浏览器还会补发一次 click，
     旧逻辑会立刻把菜单关掉。250ms 内的点击不算“点空白处关闭”。 */
  root.addEventListener('click',e=>{const av=e.target.closest('.mp-avatar');if(av&&av.dataset.user){showMenu(av.dataset.user,av);e.stopPropagation()}else if(!$('mpMenu').hidden&&!e.target.closest('#mpMenu')&&performance.now()-menuAt>250)$('mpMenu').hidden=true});
  root.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList.contains('mp-avatar')){showMenu(e.target.dataset.user,e.target);e.stopPropagation()}});
  window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('mpMenu').hidden)$('mpMenu').hidden=true;else if(!$('mpProfileShade').hidden)closeProfile();else if(!$('mpChat').hidden)closeChat();else if(!$('mpBoard').hidden)$('mpBoard').hidden=true;return}if(e.key.toLowerCase()==='p'&&MP.connected&&!e.target.closest('#mpRoot')){showProfile(me.id);e.preventDefault();e.stopImmediatePropagation()}if(e.target.closest?.('#mpRoot')){e.stopImmediatePropagation();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0}},true);
  window.addEventListener('keyup',e=>{if(e.target.closest?.('#mpRoot'))e.stopImmediatePropagation()},true);
  window.addEventListener('online',()=>{if(token&&!MP.connected){clearTimeout(reconnectTimer);retries=0;connect()}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&token&&!MP.connected&&(!ws||ws.readyState>1)){clearTimeout(reconnectTimer);connect()}});
  if(location.protocol==='file:'){status('当前为单机模式');return}
  try{token=localStorage.getItem(tokenKey)||''}catch{}
  if(token){api('/session',{method:'POST',body:'{}'}).then(()=>api('/profile/me')).then(p=>{me=p;look=p.look;profiles.set(p.id,p);localStorage.setItem('mpNickname',p.nickname);showLookPrompt=L.isDefault(look);connect()}).catch(()=>{clearAccountState();showAuth()})}else showAuth();
})();
