(() => {
  'use strict';
  const L = window.MPLook;
  const root=document.createElement('div');root.id='mpRoot';
  root.innerHTML=`
    <div id="mpStatus" role="status" aria-live="polite" hidden></div>
    <button id="mpSelf" type="button" hidden title="个人中心"></button>
    <button id="mpSprite" type="button" hidden>🧍 玩家精灵</button>
    <div id="mpSpriteMenu" class="mp-panel" hidden><div id="mpSpriteFigure"></div><button type="button" id="mpSummonGuard" class="mp-primary">📣 呼叫老丁</button></div>
    <button id="mpSoloCanteen" type="button" hidden>🍜 进入食堂</button>
    <button id="mpSoloExit" type="button" hidden>退出单机 · 登录</button>
    <button id="mpBoardToggle" type="button" hidden>📌 公告 <span id="mpUnread" hidden>0</span></button>
    <section id="mpBoard" class="mp-panel" hidden aria-label="公告栏">
      <div class="mp-head"><span class="mp-title">公告栏 · 全校</span><button class="mp-icon" id="mpBoardClose" aria-label="关闭公告">×</button></div>
      <div id="mpBoardList"><div class="mp-empty">还没有公告，发第一条吧。</div></div>
      <form id="mpBoardForm" class="mp-compose"><input id="mpBoardInput" class="mp-field" maxlength="200" placeholder="输入公告，按回车发送" aria-label="公告内容"><button class="mp-primary">发送</button></form>
      <div id="mpBoardError" class="mp-error" role="alert" style="padding:0 10px"></div>
    </section>
    <section id="mpChat" class="mp-panel" hidden aria-label="私聊">
      <div class="mp-head"><span id="mpChatAvatar"></span><span id="mpChatTitle"></span><button type="button" id="mpChatHistory" class="mp-chat-history" title="查看与这位玩家的聊天记录">聊天记录</button><button class="mp-icon" id="mpChatClose" aria-label="关闭私聊">×</button></div>
      <div id="mpChatLog"></div>
      <form id="mpChatForm"><textarea id="mpChatInput" class="mp-field" maxlength="500" rows="1" placeholder="输入消息，Enter 发送" aria-label="私聊消息"></textarea><button class="mp-primary">发送</button></form>
      <div id="mpChatError" class="mp-error" role="alert" style="padding:0 10px"></div>
    </section>
    <div id="mpAuthShade" hidden><section id="mpAuth" class="mp-panel" aria-label="大厅登录">
      <h2>进入联机大厅</h2><p>注册或登录后，就能看见同场景的同学。</p>
      <div class="mp-tabs"><button type="button" class="mp-secondary" id="mpLoginTab">登录</button><button type="button" class="mp-secondary" id="mpRegisterTab">注册</button></div>
      <form id="mpAuthForm" autocomplete="off"><input id="mpName" class="mp-field" minlength="2" maxlength="16" placeholder="昵称（2–16 字）" autocomplete="off" required><input id="mpPass" class="mp-field" type="password" minlength="8" placeholder="密码（至少 8 位）" autocomplete="new-password" required><label id="mpAuthPhotoLine" hidden>选择照片在浏览器生成卡通小人（可选，照片不上传）<input id="mpAuthPhoto" type="file" accept="image/*" class="mp-field"></label><div id="mpAuthLookPreview" hidden></div><button class="mp-primary" id="mpAuthSubmit">登录并进入</button><div id="mpAuthError" class="mp-error" role="alert"></div></form>
      <button type="button" class="mp-secondary" id="mpSolo">暂时单机游览</button>
    </section></div>
    <div id="mpProfileShade" hidden><section id="mpProfile" class="mp-panel" aria-label="个人主页"><div class="mp-head"><span class="mp-title" id="mpProfileTitle">个人中心</span><button class="mp-icon" id="mpProfileClose" aria-label="关闭主页">×</button></div><div id="mpProfileBody"></div></section></div>
    <div id="mpNearby" class="mp-panel" hidden><div id="mpNearbyWho"></div><div class="mp-near-actions"><button type="button" id="mpNearbyChat" class="mp-primary">💬 发起私聊</button><button type="button" id="mpNearbyProfile" class="mp-secondary">查看主页</button></div></div>
    <section id="mpGuard" class="mp-panel" hidden aria-label="地图上和老丁对话"><div class="mp-head"><span class="mp-title">保安 · 老丁</span><button id="mpGuardClose" class="mp-icon" aria-label="关闭老丁对话">×</button></div><div id="mpGuardLog" role="log" aria-live="polite"></div><div id="mpGuardQuick" role="group" aria-label="快捷功能"><button type="button" data-act="lost_search">找失物</button><button type="button" data-act="lost_intake">登记失物</button><button type="button" data-act="repair">报修</button><button type="button" data-act="claim">认领核对</button></div><form id="mpGuardForm"><button type="button" id="mpGuardPhoto" title="拍照或选图——找东西、认证件">图</button><input id="mpGuardFile" type="file" accept="image/*" hidden><input id="mpGuardInput" class="mp-field" maxlength="500" placeholder="和老丁说句话，回车发送" aria-label="给老丁发消息"><button class="mp-primary">发送</button></form></section>
    <iframe id="mpGuardBridge" src="about:blank" hidden title="老丁对话服务"></iframe>
    <div id="mpMenu" class="mp-panel" hidden><button id="mpMenuChat">💬 发起对话</button><button id="mpMenuProfile">👤 个人主页</button></div>
    `;
  document.body.append(root);
  const $=id=>document.getElementById(id), tokenKey='mpToken';
  let token='',me=null,ws=null,chatWith=null,authMode='login',authLook=null,showLookPrompt=false,retries=0,reconnectTimer=0,connectTimer=0,pingTimer=0,moveAt=0,lastMove='',scene='out',unread=0,menuUser=null,menuAnchor=null,boardSending='',nearUser=null,profileUser=null,guardReady=false,guardOpening=false,soloMode=false,offlineSolo=false,allowReconnect=true,lastRx=0,netTimer=0;
  const peers=new Map(),profiles=new Map(),chatCache=new Map(),pending=new Map(),seenMsgs=new Set();
  let boardItems=[],look=L.fallback,boardTimer=0,menuAt=0;
  let statusTimer=0;
  /* keep=false 的那条到点先淡出再收起；keep=true 是"连接中断，正在重连…"这类要一直挂着的状态。
     ⚠️ 淡出用 class 不用 hidden：hidden 是瞬时消失，用户报的就是"老丁已到达"那条硬挂在地图顶上。 */
  function status(text,keep=false){const e=$('mpStatus');clearTimeout(statusTimer);e.classList.remove('mp-fade');e.textContent=text;e.hidden=!text;if(text&&!keep)statusTimer=setTimeout(()=>{e.classList.add('mp-fade');statusTimer=setTimeout(()=>{e.hidden=true;e.classList.remove('mp-fade')},420)},4200)}
  /* A silent half-open socket needs its own timeout; a close event is not guaranteed.
     Both failure paths keep the current player in the map and retry in the background. */
  const RX_STALL_MS=32000;
  function enterOfflineSolo(){
    if(!me||soloMode||!allowReconnect)return;
    offlineSolo=true;MP.connected=false;peers.clear();connectedUI(false);
    $('mpSoloCanteen').hidden=false;$('mpSoloExit').hidden=false;
    status('网络中断，已自动进入单机游览；正在后台重连…',true);
  }
  function scheduleReconnect(){if(!allowReconnect||!token)return;enterOfflineSolo();retries++;clearTimeout(reconnectTimer);reconnectTimer=setTimeout(connect,Math.min(30000,1000*2**Math.min(retries-1,5)))}
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
  function soloUi(msg='单机游览中，可进入食堂与 NPC 功能'){hideAuth();$('mpSoloCanteen').hidden=false;$('mpSoloExit').hidden=false;status(msg,true)}
  function currentScene(){return typeof CENTER!=='undefined'&&CENTER.active&&CENTER.room?CENTER.room.key:'out'}
  function myPos(){return scene==='out'?{x:player.x,y:player.y,dir:player.dir}:{x:CENTER.x,y:CENTER.y,dir:CENTER.dir}}
  function avatarEl(recipe,id,online=true,interactive=true,title='查看头像菜单'){const c=L.avatar(recipe);c.className='mp-avatar'+(interactive?'':' mp-avatar-static');if(interactive){c.title=title;c.dataset.user=id;c.setAttribute('role','button');c.setAttribute('tabindex','0');c.setAttribute('aria-label',title)}c.style.opacity=online?1:.65;return c}
  function iconTo(parent,recipe,id,online=true){parent.replaceChildren(avatarEl(recipe,id,online,true,'查看个人主页'))}
  function timeText(iso){if(!iso)return '';const d=new Date(iso),sec=Math.max(0,(Date.now()-d.getTime())/1000);return sec<60?'刚刚':sec<3600?Math.floor(sec/60)+' 分钟前':d.toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}
  function chatTime(iso){const d=new Date(iso);return Number.isNaN(d.getTime())?'':d.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false})}
  function chatDay(iso){const d=new Date(iso);if(Number.isNaN(d.getTime()))return '';const today=new Date(),yesterday=new Date(today);yesterday.setDate(today.getDate()-1);const key=x=>x.getFullYear()+'-'+x.getMonth()+'-'+x.getDate();return key(d)===key(today)?'今天':key(d)===key(yesterday)?'昨天':d.toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric'})}
  // 本人预览与他人主页共用 main 分支的 Pixel3D 画法和配方。
  function unmountAvatarViewers(parent){
    parent.querySelectorAll('.mp-pixel3d-host').forEach(host=>window.Pixel3D?.unmount(host));
  }
  function avatarViewer(recipe){
    const host=document.createElement('div');host.className='mp-pixel3d-host';
    let current=recipe;
    const mount=()=>{
      if(!host.isConnected)return;
      if(!window.Pixel3D){host.textContent='3D 形象加载失败，请刷新页面重试';return}
      window.Pixel3D.mount(host,current,{autoRotate:false});
    };
    host.update=next=>{current=next;if(host.isConnected)mount()};
    requestAnimationFrame(mount);
    return host;
  }
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
    soloMode=false;offlineSolo=false;clearTimeout(boardTimer);boardSending='';
    allowReconnect=true;clearInterval(netTimer);
    clearTimeout(reconnectTimer);clearTimeout(connectTimer);clearInterval(pingTimer);const old=ws;ws=null;old?.close();
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
      if($('mpAuthPhoto').files[0])try{authLook=(await lookFromPhoto($('mpAuthPhoto').files[0])).look}catch{status('照片无法处理，已使用默认形象，可在个人中心调整')}
      await api('/register',{method:'POST',body:JSON.stringify({nickname,password})});
    }
    /* [QODER-FIX #3] 注册/登录成功后先把上一位用户的本地缓存整个清掉（公告、私聊、
       附近的人、NPC 票据），再写入新 token，避免新账号界面里还挂着旧用户的记录。 */
    const result=await api('/login',{method:'POST',body:JSON.stringify({nickname,password})});clearAccountState();saveToken(result.token);me=result.user;look=me.look;profiles.set(me.id,me);localStorage.setItem('mpNickname',me.nickname);
    if(authMode==='register'&&authLook){me=await api('/profile/me',{method:'PUT',body:JSON.stringify({look:authLook})});look=me.look;profiles.set(me.id,me)}
    showLookPrompt=L.isDefault(look);hideAuth();connect();
  }catch(err){$('mpAuthError').textContent=err.message}finally{button.disabled=false}}
  function socketSend(payload){if(ws&&ws.readyState===WebSocket.OPEN){ws.send(JSON.stringify(payload));return true}status('联机暂不可用，消息未发送',true);return false}
  function connect(){if(!token||location.protocol==='file:'||!allowReconnect||soloMode)return;if(ws&&ws.readyState<=1)return;clearTimeout(reconnectTimer);
    const scheme=location.protocol==='https:'?'wss':'ws';let socket;
    try{socket=new WebSocket(`${scheme}://${location.hostname}:${Number('__MP_WS_PORT__')||8090}/mp?token=${encodeURIComponent(token)}`)}catch{scheduleReconnect();return}
    ws=socket;
    clearTimeout(connectTimer);connectTimer=setTimeout(()=>{if(ws===socket&&socket.readyState===WebSocket.CONNECTING){ws=null;try{socket.close()}catch{}scheduleReconnect()}},8000);
    socket.onopen=()=>{if(ws!==socket)return;clearTimeout(connectTimer);retries=0;allowReconnect=true;lastRx=performance.now();scene=currentScene();const p=myPos();socketSend({type:'hello',scene,...p,look});socketSend({type:'announce.list',limit:50});clearInterval(pingTimer);pingTimer=setInterval(()=>socketSend({type:'ping'}),15000);clearInterval(netTimer);netTimer=setInterval(()=>{
      if(ws!==socket){clearInterval(netTimer);return}
      /* 服务器对每条 ping 都会回 pong（server.py:670），所以 32 秒收不到任何东西
         就是链路断了。半开 TCP 的 close 事件要等浏览器自己的超时，这里不等了：
         直接按断开处理并弹提示，真到 onclose 时 ws 已换人，那边会自己 return。 */
      if(performance.now()-lastRx>RX_STALL_MS){
        lastRx=performance.now();try{socket.close()}catch{}
        ws=null;clearInterval(netTimer);clearInterval(pingTimer);scheduleReconnect();
      }
    },4000);status(offlineSolo?'正在恢复联机大厅…':'已连接联机大厅',offlineSolo)};
    socket.onmessage=e=>{if(ws!==socket)return;lastRx=performance.now();try{onPacket(JSON.parse(e.data))}catch(err){console.error('[mp]',err)}};
    socket.onclose=e=>{if(ws!==socket)return;ws=null;clearTimeout(connectTimer);clearInterval(pingTimer);clearInterval(netTimer);if(e.code===4001||e.code===4003){clearAccountState();showAuth(e.code===4001?'该账号已在另一处登录':'请重新登录');return}if(boardSending){boardSending='';$('mpBoardForm').querySelector('button').disabled=false;$('mpBoardError').textContent='连接中断，公告未确认，请重试'}scheduleReconnect()};
  }
  function onPacket(m){switch(m.type){
    case 'welcome':{const recovered=offlineSolo;offlineSolo=false;$('mpSoloCanteen').hidden=true;$('mpSoloExit').hidden=true;me=m.me;look=me.look;profiles.set(me.id,me);scene=m.scene;peers.clear();m.peers.forEach(addPeer);MP.connected=true;lastMove='';connectedUI(true);updateSelf();if(recovered)status('网络已恢复，自动返回联机大厅');if(showLookPrompt){showLookPrompt=false;showProfile(me.id);status('请上传照片生成你的卡通形象')}break}
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
  function openBoard(){if(!MP.connected)return;$('mpBoard').hidden=false;unread=0;updateUnread();socketSend({type:'announce.list',limit:50});$('mpBoardInput').focus()}
  function chatProfile(id){return profiles.get(id)||{id,nickname:'玩家 '+id,look:L.fallback,online:false}}
  function renderChatTitle(){if(!chatWith)return;const p=chatProfile(chatWith);iconTo($('mpChatAvatar'),p.look,chatWith,p.online);$('mpChatTitle').replaceChildren();const b=document.createElement('b');b.textContent=p.nickname;const small=document.createElement('div');small.className='mp-muted';small.textContent=p.online?(peers.has(chatWith)?'同场景在线':'在线 · 已离开当前场景'):'离线 · 上线后可收到消息';$('mpChatTitle').append(b,small)}
  function renderChat(){if(!chatWith)return;renderChatTitle();const log=$('mpChatLog'),stick=log.scrollHeight-log.scrollTop-log.clientHeight<48,previousScroll=log.scrollTop;log.replaceChildren();const data=chatCache.get(chatWith)||[];if(!data.length){log.innerHTML='<div class="mp-empty">还没有消息，向对方打个招呼吧。</div>';return}
    let lastDay='',lastTime=0;for(const m of data){const at=new Date(m.at).getTime(),day=chatDay(m.at);if(day!==lastDay||at-lastTime>5*60*1000){const sep=document.createElement('div');sep.className='mp-chat-separator';sep.textContent=day+' '+chatTime(m.at);log.append(sep)}lastDay=day;lastTime=at;const mine=Number(m.from)===Number(me.id),p=mine?me:chatProfile(chatWith),wrap=document.createElement('div'),side=document.createElement('div'),bubble=document.createElement('div'),small=document.createElement('small');wrap.className='mp-message'+(mine?' mine':'');bubble.className='mp-bubble';bubble.textContent=m.content;small.textContent=chatTime(m.at);side.className='mp-message-content';side.append(bubble,small);wrap.append(avatarEl(p.look,p.id,p.online,true,'查看个人主页'),side);log.append(wrap)}if(stick)log.scrollTop=log.scrollHeight;else log.scrollTop=previousScroll;
  }
  function openChat(id){if(!MP.connected||id===me.id)return;chatWith=Number(id);$('mpBoard').hidden=true;$('mpNearby').hidden=true;$('mpChat').hidden=false;$('mpChatError').textContent='';renderChat();socketSend({type:'chat.history',withUser:chatWith,limit:30});$('mpChatInput').focus();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0}
  async function ensureProfile(id){const p=await api('/profile/'+id);profiles.set(id,p);return p}
  /* 学院不手填：名单由服务端下发（本校真实院系），下拉里选一个；
     账号里原来手写过的旧值保留成一项，但提示重新选择，保存时服务端只认名单内的值。 */
  let collegeList=null;
  async function colleges(){if(collegeList)return collegeList;try{collegeList=(await api('/colleges')).colleges||[]}catch{collegeList=[]}return collegeList}
  function fillColleges(sel,current){colleges().then(list=>{sel.replaceChildren();const blank=document.createElement('option');blank.value='';blank.textContent='（未选择）';sel.append(blank);for(const name of list){const o=document.createElement('option');o.value=name;o.textContent=name;sel.append(o)}if(current&&!list.includes(current)){const old=document.createElement('option');old.value=current;old.textContent=current+'（原来填的，请重新选择）';sel.append(old)}sel.value=current})}
  function closeProfile(){unmountAvatarViewers($('mpProfileBody'));profileUser=null;$('mpProfileShade').hidden=true}
  function showProfile(id,historyPeer=0){id=Number(id);$('mpMenu').hidden=true;$('mpNearby').hidden=true;profileUser=id;const mine=id===me.id;$('mpProfile').classList.toggle('mp-other-profile',!mine);$('mpProfileShade').hidden=false;$('mpProfileTitle').textContent=mine?'个人中心':'个人主页';const body=$('mpProfileBody');unmountAvatarViewers(body);body.replaceChildren();
    ensureProfile(id).then(p=>{if($('mpProfileShade').hidden||profileUser!==id||!me)return;body.replaceChildren();const top=document.createElement('div');top.className='mp-profile-top';top.append(avatarEl(p.look,id,p.online,false));const details=document.createElement('div');const name=document.createElement('strong');name.textContent=p.nickname;const line=document.createElement('div');line.className='mp-muted';line.textContent=mine?'昵称不可修改 · ID '+id:(p.online?'● 在线 · ID '+id:'○ 离线 · ID '+id+' · '+(p.lastSeen?timeText(p.lastSeen):'暂无记录'));details.append(name,line);top.append(details);body.append(top);
      /* [QODER-FIX #16] 别人的主页按公开/隐藏设置显示：后端已把隐藏项清空，
         这里再按 visibility 兜一层（防止接口变化时把隐藏资料又渲染出来）。 */
      if(!mine){body.append(avatarViewer(p.look));const vis=p.visibility||{},info=document.createElement('dl');info.className='mp-public-info';for(const [key,label] of [['bio','签名'],['college','学院'],['grade','年级'],['tags','兴趣标签']]){if(vis[key]===false)continue;const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;const value=key==='tags'?(p.tags||[]):p[key];if(key==='tags'&&value.length){for(const tag of value){const chip=document.createElement('span');chip.className='mp-tag';chip.textContent=tag;dd.append(chip)}}else dd.textContent=key==='tags'?'未填写':(value||'未填写');row.append(dt,dd);info.append(row)}body.append(info);const button=document.createElement('button');button.className='mp-primary';button.textContent='💬 发起私聊';button.onclick=()=>{closeProfile();openChat(id)};body.append(button);return}
      const form=document.createElement('form');form.id='mpProfileForm';form.innerHTML=`<div class="mp-form-grid"><label class="wide">签名<input name="bio" class="mp-field" maxlength="40"></label><label>学院（从学校院系名单里选）<select name="college" class="mp-field" title="只能从下拉名单里选，不接受手填"></select></label><label>年级<select name="grade" class="mp-field"><option value="">未填写</option><option>大一</option><option>大二</option><option>大三</option><option>大四</option><option>硕士</option><option>博士</option></select></label><label class="wide">兴趣标签（输入后按逗号，最多 5 个）<span id="mpTagChips" class="mp-tag-list"></span><input name="tags" class="mp-field" maxlength="6" placeholder="输入标签后按逗号（,）生成"></label></div><fieldset class="mp-privacy"><legend>别人能看到的资料</legend><label><input type="checkbox" name="showBio"> 签名</label><label><input type="checkbox" name="showCollege"> 学院</label><label><input type="checkbox" name="showGrade"> 年级</label><label><input type="checkbox" name="showTags"> 兴趣标签</label></fieldset><p class="mp-muted mp-privacy-hint">勾选 = 公开；取消勾选后，其他玩家在你的主页看不到这一项。</p><div class="mp-look-preview" id="mpLookPreview"></div><label>从照片生成形象（只在浏览器处理，保存时仅上传形象配方）<input name="photo" type="file" accept="image/*" class="mp-field"></label><div class="mp-look-controls"><label>脸型<select name="faceShape" class="mp-field"><option value="square">方脸</option><option value="round">圆脸</option></select></label><label>发型<select name="hairStyle" class="mp-field"><option value="short">短发</option><option value="mid">中发</option><option value="long">长发</option><option value="ponytail">马尾</option><option value="bun">丸子头</option><option value="twintails">双马尾</option></select></label><label>眼型<select name="eye" class="mp-field"><option value="round">圆眼</option><option value="narrow">细眼</option><option value="dot">豆豆眼</option></select></label><label>嘴型<select name="mouth" class="mp-field"><option value="soft">自然</option><option value="smile">微笑</option></select></label><label>瞳色<input name="eyeColor" type="color" class="mp-field"></label><label>配饰<select name="acc" class="mp-field"><option value="none">无</option><option value="glasses">眼镜</option><option value="cap">帽子</option><option value="scarf">围巾</option></select></label><label>发色<input name="hairColor" type="color" class="mp-field"></label><label>上衣主色<input name="cloth" type="color" class="mp-field"></label><label>上衣样式<select name="clothPattern" class="mp-field"><option value="solid">纯色</option><option value="stripe">横条纹</option></select></label><label>条纹副色<input name="clothAlt" type="color" class="mp-field"></label><label>肤色<input name="skin" type="color" class="mp-field"></label><label>裤子<input name="pants" type="color" class="mp-field"></label><label>书包颜色<input name="packColor" type="color" class="mp-field"></label><label id="mpAccColorRow"><span id="mpAccColorName">配饰颜色</span><input name="accColor" type="color" class="mp-field"></label></div><div class="mp-profile-actions"><button type="button" id="mpResetLook" class="mp-secondary">恢复默认形象</button><button type="button" id="mpDownloadLook" class="mp-secondary">下载卡通头像 PNG</button><button class="mp-primary">保存资料</button><button type="button" id="mpLogout" class="mp-secondary">退出登录</button></div><div class="mp-error" id="mpProfileError" role="alert"></div>`;
      body.append(form);form.elements.bio.value=p.bio||'';fillColleges(form.elements.college,p.college||'');form.elements.grade.value=p.grade||'';for(const field of ['Bio','College','Grade','Tags'])form.elements['show'+field].checked=p.visibility?.[field.toLowerCase()]!==false;let draft=L.norm(p.look);
      const tags=[...(p.tags||[])],chips=$('mpTagChips');
      function renderTags(){chips.replaceChildren();for(const value of tags){
        /* ⚠️ 胶囊必须是 `<span role=button>`，不能用 `<button>`：这排胶囊在
           `<label class="wide">兴趣标签…</label>` 里面，而 HTML 的 labelable 元素**包含 button**，
           树里第一个 labelable 才是这个 label 的控件 ⇒ 用 button 时"兴趣标签"那几个字变成了
           删除键的代理，点标题文字就等于点掉第一个标签（实测点空白处标签自己没了）。
           换成 span 后 label 的控件回到输入框，键盘删除靠下面这条 keydown 补。 */
        const tag=document.createElement('span');tag.className='mp-tag';tag.setAttribute('role','button');tag.tabIndex=0;tag.textContent=value+' ×';tag.title='删除标签';
        const del=()=>{tags.splice(tags.indexOf(value),1);renderTags()};
        tag.onclick=del;tag.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();del()}};
        chips.append(tag)}}
      function commitTag(){const value=form.elements.tags.value.trim();form.elements.tags.value='';if(!value)return true;if(value.length>6||tags.length>=5){$('mpProfileError').textContent='最多 5 个标签，每个最多 6 字';return false}if(!tags.includes(value))tags.push(value);renderTags();$('mpProfileError').textContent='';return true}
      renderTags();form.elements.tags.addEventListener('keydown',e=>{if(e.key==='Enter'||e.code==='NumpadEnter'){e.preventDefault();e.stopPropagation();$('mpProfileError').textContent='输入标签后按逗号（,）生成';return}if([',','，'].includes(e.key)){e.preventDefault();e.stopPropagation();commitTag()}});form.elements.tags.addEventListener('input',()=>{const val=form.elements.tags.value;if(/[，,]/.test(val)){form.elements.tags.value=val.split(/[，,]/)[0];commitTag()}});
      /* 聊天记录模块：公告 / 私聊两个页签；私聊按对话对象逐个展开、每组一次多给 30 条，
         收和发都算（服务端 conversations 里带 mine 标记）。
         数据只走 GET /api/mp/history/me，那个接口只按当前 token 查库 ⇒ 别人的主页看不到这块。 */
      const history=document.createElement('details');history.className='mp-history';
      history.innerHTML='<summary>💬 我的聊天记录 · 仅自己可见</summary><div class="mp-history-body mp-muted">展开后加载记录…</div>';
      body.append(history);
      history.addEventListener('toggle',async()=>{if(!history.open)return;const box=history.querySelector('.mp-history-body');if(box.dataset.loaded)return;box.textContent='正在加载…';
        const groupByPeer=list=>{const map=new Map();for(const m of list){if(!map.has(m.to))map.set(m.to,{peer:m.to,nickname:m.nickname,items:[]});map.get(m.to).items.push(m)}return[...map.values()]};
        try{const data=await api('/history/me');box.dataset.loaded='1';box.replaceChildren();
          const tabs=document.createElement('div');tabs.className='mp-history-tabs';
          const board=document.createElement('section'),chats=document.createElement('section');chats.hidden=true;
          const mkTab=(label,pane)=>{const b=document.createElement('button');b.type='button';b.className='mp-secondary mp-history-tab'+(pane===board?' on':'');b.textContent=label;b.onclick=()=>{board.hidden=pane!==board;chats.hidden=pane!==chats;for(const t of tabs.children)t.classList.toggle('on',t===b)};tabs.append(b)};
          const bh=document.createElement('h4');bh.textContent='我发过的公告 · '+data.announcements.length+' 条';board.append(bh);
          if(!data.announcements.length){const empty=document.createElement('p');empty.className='mp-muted';empty.textContent='还没有发过公告';board.append(empty)}
          for(const a of data.announcements){const row=document.createElement('p'),when=document.createElement('span');when.className='mp-his-time';when.textContent=timeText(a.at);row.append(when,document.createTextNode(a.content));board.append(row)}
          const conversations=data.conversations&&data.conversations.length?data.conversations:groupByPeer(data.private||[]);
          const ch=document.createElement('h4');ch.textContent='我的私聊 · 按对话对象（'+conversations.length+' 位）';chats.append(ch);
          if(!conversations.length){const empty=document.createElement('p');empty.className='mp-muted';empty.textContent='还没有私聊记录';chats.append(empty)}
          for(const c of conversations){const group=document.createElement('details'),sum=document.createElement('summary');group.dataset.peer=String(c.peer);
            sum.textContent=(c.nickname||'玩家 '+c.peer)+' · ID '+c.peer+' · '+c.items.length+' 条';group.append(sum);
            const jump=document.createElement('button');jump.type='button';jump.className='mp-secondary mp-his-jump';jump.textContent='打开与 TA 的聊天 →';jump.onclick=()=>{closeProfile();openChat(c.peer)};group.append(jump);
            const list=document.createElement('div');list.className='mp-his-list';let shown=0;
            const more=()=>{const batch=c.items.slice(shown,shown+30);for(const m of batch){const row=document.createElement('p'),who=document.createElement('span');who.className='mp-his-who';who.textContent=(m.mine===false?c.nickname:'我说')+' · '+timeText(m.at);row.append(who,document.createTextNode(m.content));list.append(row)}shown+=batch.length;
              if(shown<c.items.length){const btn=document.createElement('button');btn.type='button';btn.className='mp-secondary mp-his-more';btn.textContent='再看 30 条（还有 '+(c.items.length-shown)+' 条）';btn.onclick=()=>{btn.remove();more()};list.append(btn)}else if(c.items.length>30){const end=document.createElement('div');end.className='mp-muted';end.textContent='到这里为止，共 '+c.items.length+' 条';list.append(end)}};
            more();group.append(list);chats.append(group)}
          mkTab('📌 公告 · '+data.announcements.length,board);mkTab('💬 私聊 · '+conversations.length,chats);
          box.append(tabs,board,chats);if(historyPeer){tabs.lastElementChild.click();const target=[...chats.querySelectorAll('details')].find(group=>Number(group.dataset.peer)===Number(historyPeer));if(target){target.open=true;target.scrollIntoView({block:'nearest'})}else{const empty=document.createElement('p');empty.className='mp-muted';empty.textContent='还没有与这位玩家的聊天记录';chats.append(empty)}}}catch(err){box.textContent=err.message}});
      if(historyPeer)history.open=true;
      function syncFields(){for(const k of ['faceShape','hairStyle','eye','eyeColor','mouth','acc','hairColor','cloth','clothPattern','clothAlt','skin','pants','accColor','packColor'])form.elements[k].value=draft[k];preview()}
      function preview(){const box=$('mpLookPreview');let viewer=box.querySelector('.mp-pixel3d-host');if(!viewer){viewer=avatarViewer(draft);box.append(viewer)}else viewer.update(draft)}
      syncFields();for(const k of ['faceShape','hairStyle','eye','eyeColor','mouth','acc','hairColor','cloth','clothPattern','clothAlt','skin','pants','accColor','packColor']){const apply=()=>{draft[k]=form.elements[k].value;preview()};form.elements[k].addEventListener('input',apply);form.elements[k].addEventListener('change',apply)}
      /* [QODER-FIX #15] 配饰单独染色区：没戴配饰时隐藏，戴上后按配件改名（眼镜/帽子/围巾），
         颜色只作用于当前这件配饰。 */
      const accRow=form.querySelector('#mpAccColorRow'),accName=form.querySelector('#mpAccColorName');
      function syncAccColor(){const acc=form.elements.acc.value,names={glasses:'眼镜镜框颜色',cap:'帽子颜色',scarf:'围巾颜色'};accRow.hidden=acc==='none';accName.textContent=names[acc]||'配饰颜色'}
      form.elements.acc.addEventListener('change',syncAccColor);syncAccColor();
      form.elements.photo.onchange=async()=>{try{const result=await lookFromPhoto(form.elements.photo.files[0]);draft={...L.norm(result.look),packColor:draft.packColor};syncFields();$('mpProfileError').textContent='已在浏览器按照片生成，可微调后保存'}catch(err){$('mpProfileError').textContent=err.message}};
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
  function guardLine(who,message){const row=document.createElement('div');row.className='mp-guard-line '+who;row.textContent=(who==='self'?(me?.nickname||'我')+'：':who==='sys'?'':'老丁：')+message;$('mpGuardLog').append(row);$('mpGuardLog').scrollTop=$('mpGuardLog').scrollHeight}
  function guardPost(msg){const w=$('mpGuardBridge').contentWindow;if(w)w.postMessage(msg,location.origin)}
  const GUARD_CONNECTING_STATUS='正在接通老丁，请稍等';
  function guardConnectingDone(message='老丁已接通'){
    if($('mpStatus').textContent===GUARD_CONNECTING_STATUS)status($('mpGuard').hidden?'':message);
  }
  function guardLive(){if(guardReady)return true;status(GUARD_CONNECTING_STATUS,true);return false}
  /* 老丁那头的「处理界面」——比对卡片和当面认一眼那排选项。
     ⚠️ 这里只画按钮、只把点击原样送回 iframe（campus.guard.pick），认领状态机、
        失物库、销账全在 iframe 那一侧；面板自己判定"能不能领"就会两套逻辑打架。
        来一条新的处理界面就把上一排的按钮锁死：老丁的流程只认最新那一次操作。 */
  function guardUi(p){
    const log=$('mpGuardLog');if(!log||!p||!p.kind)return;
    for(const box of log.querySelectorAll('.mp-guard-cards,.mp-guard-opts'))for(const b of box.querySelectorAll('button'))b.disabled=true;
    if(p.kind==='cards'){
      const wrap=document.createElement('div');wrap.className='mp-guard-cards';
      for(const it of (p.items||[])){
        const c=document.createElement('div');c.className='mp-gcard'+(it.best?' best':'');
        const hd=document.createElement('div');hd.className='mp-gcard-hd';
        hd.textContent=String(it.category||'物品');
        if(it.best)hd.append(Object.assign(document.createElement('span'),{className:'mp-gbest',textContent:'最像这条'}));
        hd.append(Object.assign(document.createElement('span'),{className:'mp-gscore',textContent:'匹配 '+(Number(it.score)||0)+'%'}));
        const meta=document.createElement('div');meta.className='mp-gmeta';meta.textContent='捡到：'+String(it.place||'—')+' · '+String(it.time||'');
        const desc=document.createElement('div');desc.className='mp-gdesc';desc.textContent=String(it.desc||'');
        const dim=document.createElement('div');dim.className='mp-gmeta';
        dim.textContent=(p.mode==='image'?'外观':'描述')+' '+(Number(it.detail)||0)+'%'+(it.owner?' · 登记 '+it.owner:'');
        const btn=document.createElement('button');btn.type='button';btn.className='mp-gclaim';btn.textContent='认领这条';
        btn.onclick=()=>{if(btn.disabled)return;guardLine('self','认领这条：'+String(it.category||'物品'));guardPick({act:'claim',entryId:it.id});guardLock(wrap)};
        c.append(hd,meta,desc,dim,btn);wrap.append(c);
      }
      log.append(wrap);
    }else if(p.kind==='options'){
      const row=document.createElement('div');row.className='mp-guard-opts';
      for(const o of (p.options||[])){
        const label=String(o.label||o.value||'');
        const btn=document.createElement('button');btn.type='button';btn.className='mp-gopt'+(o.ghost?' ghost':'');btn.textContent=label;
        btn.onclick=()=>{if(btn.disabled)return;guardLine('self',label);guardPick({act:'option',entryId:p.entryId,stage:p.stage,value:o.value??o.label,label});guardLock(row)};
        row.append(btn);
      }
      log.append(row);
    }
    log.scrollTop=log.scrollHeight;
  }
  function guardLock(box){for(const b of box.querySelectorAll('button'))b.disabled=true}
  function guardPick(body){guardPost({type:'campus.guard.pick',...body})}
  /* 照片压到长边 512 的 JPEG：手机原图动辄七八兆，整张 base64 走 postMessage 或 fetch
     都会先把页面卡住。此函数只供老丁的识图入口使用。 */
  function shrinkPhoto(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,512/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.85))};im.onerror=()=>rej(Error('图片读不出来'));im.src=r.result};r.onerror=()=>rej(Error('图片读不出来'));r.readAsDataURL(file)})}
  /* 形象照片只在浏览器解析。服务端只接收保存后的 look 配方。 */
  async function lookFromPhoto(file){
    return{look:await L.fromPhoto(file),source:'local'};
  }
  /* [QODER-FIX #18/#22] 老丁全程只在地图右下角这块面板里说完：验票 → 拉隐藏 iframe 桥 → 等 ready。
     任何一步不通都在面板里落一行说明 + 一个"重试"按钮，绝不退回"开抽屉 / 冷启动提示窗"
     那条路（地图侧 guardTalk 已经把那条分支整体删掉了）。 */
  function guardWaitReady(ms){return new Promise(res=>{const on=e=>{if(e.origin===location.origin&&e.source===$('mpGuardBridge').contentWindow&&e.data?.type==='campus.guard.ready')done(true)};function done(ok){clearTimeout(t);window.removeEventListener('message',on);res(ok)}const t=setTimeout(()=>done(false),ms);window.addEventListener('message',on)})}
  function guardFail(text){guardConnectingDone('老丁接通失败，请重试');const log=$('mpGuardLog'),row=document.createElement('div');row.className='mp-guard-line';row.textContent=text+' ';const btn=document.createElement('button');btn.type='button';btn.className='mp-secondary';btn.textContent='重试';btn.onclick=()=>openGuardTalk();row.append(btn);log.append(row);log.scrollTop=log.scrollHeight}
  async function openGuardTalk(){
    if(guardOpening)return;
    if(!token){showAuth('请先登录再与老丁对话');return}
    guardOpening=true;
    $('mpBoard').hidden=true;$('mpChat').hidden=true;$('mpProfileShade').hidden=true;$('mpNearby').hidden=true;$('mpSpriteMenu').hidden=true;$('mpGuard').hidden=false;
    const log=$('mpGuardLog');
    if(!log.childElementCount)guardLine('guard','我到啦，正在接通对话…');
    for(const old of log.querySelectorAll('button')){const box=old.closest('.mp-gcard,.mp-guard-opts,.mp-guard-line');(box||old.parentNode).remove()}
    for(const shell of log.querySelectorAll('.mp-guard-cards'))if(!shell.childElementCount)shell.remove();
    try{
      const result=await MP.ensureNpc('ld');
      if(result!=='ok'){guardFail(result==='auth'?'登录票据没换成，请重新登录后再呼叫老丁':'当前站点服务器的老丁服务暂不可用，请稍后重试');return}
      if(!guardReady){$('mpGuardBridge').src='/ld/';if(!await guardWaitReady(8000)){guardFail('桥没响应：老丁的页面没加载出来，点重试再连一次');return}}
      guardConnectingDone();
      /* 中途关过面板再打开的，让 iframe 把还走得通的那套处理界面（比对卡片 / 当面认一眼）
         再递一次；那句"已经接通"晚 150ms 再说，恢复出来的按钮才排在我这句话上面。 */
      guardPost({type:'campus.guard.replay'});
      setTimeout(()=>{if(!$('mpGuard').hidden)guardLine('guard','已经接通，有什么事？')},150);
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
  const MP={connected:false,get look(){return look},sprite:L.sprite,crouch:L.crouch,requireLogin(){connectedUI(false);showAuth('请在大厅重新登录')},async ensureNpc(kind){if(!token&&soloMode){try{await soloSignIn()}catch(e){return 'auth'}}if(!token)return 'auth';try{const t=await api('/npc/'+kind,{method:'POST',body:'{}'});if(kind==='xbg')localStorage.setItem('xbg_token',t.token);if(kind==='ld')localStorage.setItem('ld_token',t.token);if(kind==='agent'){localStorage.setItem('token',t.user.token);localStorage.setItem('user',JSON.stringify({id:t.user.userId,username:t.user.username,nickname:me.nickname,role:t.user.role}))}return 'ok'}catch(e){return /重新登录/.test(e.message)?'auth':'down'}},changeScene(next,x,y){scene=next;peers.clear();if(MP.connected)socketSend({type:'scene.change',to:next,x,y})},onFrame(now){if(!MP.connected||now-moveAt<100)return;moveAt=now;updateNearby();const p=myPos(),key=[scene,p.x.toFixed(1),p.y.toFixed(1),p.dir].join('|');if(key!==lastMove){socketSend({type:'move',...p});lastMove=key}},appendOutdoorPeers(list){if(!MP.connected||scene!=='out')return;for(const p of [...peers.values()].sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)).slice(0,30)){const v=point(p,performance.now());if(Math.abs(v.x-cam.x)>viewW+30||Math.abs(v.y-cam.y)>viewH+30)continue;const step=performance.now()-p.at<500?Math.floor(performance.now()/135)%4:4;list.push({img:L.sprite(p.look,p.dir,step),ax:CH_AX,ay:CH_AY,x:v.x,y:v.y,baseY:v.y,clip:Math.round(CH_H*lakeSubmerge(v.x,v.y)),ch:1})}},appendIndoorPeers(who,g){if(!MP.connected||scene==='out')return;for(const p of [...peers.values()].slice(0,30)){const v=point(p,performance.now()),step=performance.now()-p.at<500?Math.floor(performance.now()/135)%4:4;who.push({y:v.y,f:()=>ctrDrawChar(g,L.sprite(p.look,p.dir,step),v.x,v.y)})}},drawLabels(){
    if(!me||(!MP.connected&&!offlineSolo&&!soloMode)||scene!=='out')return;
    const metrics=outdoorLabelMetrics(zoom);
    if(!metrics)return;
    const now=performance.now(),drawn=[];
    ctx.save();ctx.font=`bold ${metrics.font}px system-ui`;ctx.textAlign='center';ctx.textBaseline='bottom';
    const self={id:me.id,nickname:me.nickname+' #'+me.id,x:player.x,y:player.y,fromX:player.x,fromY:player.y,at:now};
    for(const p of [self,...[...peers.values()].sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)).slice(0,30)]){
      const v=point(p,now),G=window.CAMG||{x:Math.round(cam.x),y:Math.round(cam.y)};
      // Use the same rounded sprite origin as render(): fractional text coordinates
      // change glyph antialiasing every walking frame at 2x/3x zoom.
      const sx=Math.round((v.x-CH_AX-G.x)*zoom),sy=Math.round((v.y-CH_AY-G.y)*zoom);
      const x=sx+Math.round(CH_AX*zoom),y=sy-metrics.gap;
      if(x<0||x>VIEW_W||y<0||y>VIEW_H)continue;
      const own=p.id===me.id,font=own?Math.max(7,metrics.font):metrics.font,height=own?font+4:metrics.height,pad=own?2:metrics.pad;
      ctx.font=`bold ${font}px system-ui`;
      const name=own&&zoom<.5?'#'+me.id:(p.nickname.length>metrics.maxChars?p.nickname.slice(0,metrics.maxChars)+'…':p.nickname);
      const w=Math.ceil(ctx.measureText(name).width+pad*2),left=Math.round(x-w/2),box={left,right:left+w,top:y-height,bottom:y};
      if(drawn.some(q=>box.left<q.right&&box.right>q.left&&box.top<q.bottom&&box.bottom>q.top))continue;
      drawn.push(box);
      ctx.fillStyle='rgba(19,27,35,.88)';ctx.fillRect(box.left,box.top,w,height);
      ctx.fillStyle='#fff';ctx.fillText(name,x,y-2);
    }
    ctx.restore()
  },drawIndoorLabels(g){if(!me||(!MP.connected&&!offlineSolo&&!soloMode)||scene==='out')return;g.save();g.font='bold 10px system-ui';g.textAlign='center';const own=myPos();for(const p of [{id:me.id,nickname:me.nickname+' #'+me.id,x:own.x,y:own.y,fromX:own.x,fromY:own.y,at:performance.now()},...peers.values()]){const v=point(p,performance.now()),w=g.measureText(p.nickname).width+6;g.fillStyle='rgba(19,27,35,.9)';g.fillRect(v.x-w/2,v.y-43,w,13);g.fillStyle='#fff';g.fillText(p.nickname,v.x,v.y-33)}g.restore()}};
  Object.defineProperty(MP,'offlineSolo',{get:()=>offlineSolo||soloMode});
  MP.openGuardTalk=openGuardTalk;
  MP.guardArrived=()=>{status('老丁已到达');openGuardTalk()};
  MP.callGuard=callGuard;
  window.MP=MP;
  bindHits(cv,false);bindHits(ctrCv,true);
  $('mpLoginTab').onclick=()=>setAuthMode('login');$('mpRegisterTab').onclick=()=>setAuthMode('register');$('mpAuthForm').onsubmit=submitAuth;$('mpSolo').onclick=async()=>{
    const button=$('mpSolo');button.disabled=true;$('mpAuthError').textContent='';
    try{
      await soloSignIn();
      soloUi();
    }catch(error){$('mpAuthError').textContent='单机服务暂不可用：'+error.message}
    finally{button.disabled=false}
  };
  $('mpSoloCanteen').onclick=()=>ctrOpenPlatform(AUNT_APP);
  $('mpSoloExit').onclick=async()=>{try{if(token)await api('/logout',{method:'POST',body:'{}'})}catch{}clearAccountState();showAuth()};
  $('mpAuthPhoto').onchange=async()=>{const file=$('mpAuthPhoto').files[0];if(!file)return;const box=$('mpAuthLookPreview');box.hidden=false;box.replaceChildren(document.createTextNode('正在按照片生成形象……'));$('mpAuthError').textContent='';try{const result=await lookFromPhoto(file);authLook=result.look;box.replaceChildren(L.portrait(authLook),document.createTextNode('像素卡通形象已在浏览器生成，进入后还可以微调'));$('mpAuthError').textContent=''}catch(e){authLook=null;box.replaceChildren();$('mpAuthError').textContent=e.message}};
  $('mpSelf').onclick=()=>showProfile(me.id);$('mpBoardToggle').onclick=()=>{$('mpBoard').hidden?openBoard():$('mpBoard').hidden=true};$('mpBoardClose').onclick=()=>$('mpBoard').hidden=true;
  $('mpSprite').onclick=()=>{$('mpSpriteMenu').hidden=!$('mpSpriteMenu').hidden};$('mpSummonGuard').onclick=callGuard;
  $('mpBoardForm').onsubmit=e=>{e.preventDefault();const input=$('mpBoardInput'),content=input.value.trim(),error=$('mpBoardError'),button=$('mpBoardForm').querySelector('button');if(!content||content.length>200){error.textContent='公告须为 1 至 200 字';return}/* [QODER-FIX #7] 上一条没收到服务器确认时，旧代码在这里静默 return，
     按钮又一直是 disabled ⇒ 用户看到的就是“点发送没反应”。现在给提示，并加超时兜底。 */
    if(boardSending){error.textContent='上一条公告还在发送，请稍候…';return}
    const id=clientId();if(!socketSend({type:'announce.post',content,clientMsgId:id})){error.textContent='当前未连接，公告没有发送';return}
    boardSending=id;button.disabled=true;error.textContent='正在发送…';
    clearTimeout(boardTimer);boardTimer=setTimeout(()=>{if(boardSending!==id)return;boardSending='';button.disabled=false;error.textContent='发送超时：联机通道没有确认，请检查网络后重试'},8000)};
  $('mpChatClose').onclick=closeChat;$('mpChatHistory').onclick=()=>{if(chatWith)showProfile(me.id,chatWith)};$('mpChatForm').onsubmit=e=>{e.preventDefault();const input=$('mpChatInput'),content=input.value.trim();if(!content||!chatWith)return;const clientMsgId=clientId();pending.set(clientMsgId,{from:me.id,to:chatWith,content,fromNickname:me.nickname,look,clientMsgId});if(socketSend({type:'chat.send',to:chatWith,content,clientMsgId})){input.value='';$('mpChatError').textContent='';input.focus()}else pending.delete(clientMsgId)};
  $('mpChatInput').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){e.preventDefault();$('mpChatForm').requestSubmit()}};
  $('mpProfileClose').onclick=closeProfile;$('mpProfileShade').onclick=e=>{if(e.target===$('mpProfileShade'))closeProfile()};
  /* [QODER-FIX #5/#8] 双选菜单的两个入口：发起对话 / 查看个人主页 */
  $('mpMenuChat').onclick=()=>{const id=menuUser;$('mpMenu').hidden=true;openChat(id)};$('mpMenuProfile').onclick=()=>showProfile(menuUser);
  $('mpNearbyChat').onclick=()=>{if(nearUser)openChat(nearUser)};$('mpNearbyProfile').onclick=()=>{if(nearUser)showProfile(nearUser)};
  $('mpGuardClose').onclick=()=>{$('mpGuard').hidden=true;guardConnectingDone()};
  $('mpGuardForm').onsubmit=e=>{e.preventDefault();const input=$('mpGuardInput'),value=input.value.trim();if(!value)return;if(!guardLive())return;guardLine('self',value);guardPost({type:'campus.guard.ask',text:value});input.value=''};
  /* 四个快捷功能键 + 「图」：全部只是把动作转递给隐藏 iframe 里那套原生状态机
     （FLOWS / 失物库 / Qwen 识图都在那一侧），面板不另起一套业务。 */
  $('mpGuardQuick').onclick=e=>{const b=e.target.closest('button[data-act]');if(!b||!guardLive())return;guardLine('self',b.textContent);guardPost({type:'campus.guard.action',act:b.dataset.act})};
  $('mpGuardPhoto').onclick=()=>{if(guardLive())$('mpGuardFile').click()};
  $('mpGuardFile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f||!guardLive())return;
    try{const image=await shrinkPhoto(f);const text=$('mpGuardInput').value.trim();$('mpGuardInput').value='';guardLine('self','【照片】'+f.name);guardPost({type:'campus.guard.photo',image,text})}
    catch(err){guardLine('sys','这张照片读不出来，换一张再试')}};
  window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==$('mpGuardBridge').contentWindow)return;if(e.data?.type==='campus.guard.ready'){guardReady=true;guardConnectingDone();return}if($('mpGuard').hidden)return;if(e.data?.type==='campus.guard.reply')guardLine(e.data.who==='sys'?'sys':'guard',String(e.data.text||''));else if(e.data?.type==='campus.guard.ui')guardUi(e.data.ui)});
  /* [QODER-FIX #8] menuAt：pointerup 打开双选菜单后，浏览器还会补发一次 click，
     旧逻辑会立刻把菜单关掉。250ms 内的点击不算“点空白处关闭”。 */
  root.addEventListener('click',e=>{const av=e.target.closest('.mp-avatar');if(av&&av.dataset.user){if(av.closest('#mpChat'))showProfile(av.dataset.user);else showMenu(av.dataset.user,av);e.stopPropagation()}else if(!$('mpMenu').hidden&&!e.target.closest('#mpMenu')&&performance.now()-menuAt>250)$('mpMenu').hidden=true});
  root.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('mp-avatar')){e.preventDefault();if(e.target.closest('#mpChat'))showProfile(e.target.dataset.user);else showMenu(e.target.dataset.user,e.target);e.stopPropagation()}});
  /* ⚠️ 大厅内部的按键**不能**在 window 捕获阶段 stopImmediatePropagation：
     捕获比输入框自己的 keydown 先跑，一挡就等于把 mpRoot 里所有内部处理器废掉 ——
     标签框那句 preventDefault 跑不到，回车就落到浏览器的"表单默认提交"上，
     onsubmit 存完资料顺手 closeProfile()，用户看到的是"标签刚加完主页自己关了"。
     所以这里只把地图的按键状态清零并放行，拦截交给下面 root 上的冒泡监听
     （冒泡阶段 root 比 window/document 晚，输入框和头像的监听都已经跑完）。 */
  window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('mpMenu').hidden)$('mpMenu').hidden=true;else if(!$('mpProfileShade').hidden)closeProfile();else if(!$('mpChat').hidden)closeChat();else if(!$('mpBoard').hidden)$('mpBoard').hidden=true;return}if(e.target.closest?.('#mpRoot')){for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0;return}if(e.key.toLowerCase()==='p'&&MP.connected){showProfile(me.id);e.preventDefault();e.stopImmediatePropagation()}},true);
  root.addEventListener('keydown',e=>{e.stopPropagation();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0});
  root.addEventListener('keyup',e=>{e.stopPropagation();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0});
  window.addEventListener('online',()=>{if(token&&!MP.connected&&!soloMode){clearTimeout(reconnectTimer);retries=0;connect()}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&token&&!MP.connected&&!soloMode&&(!ws||ws.readyState>1)){clearTimeout(reconnectTimer);connect()}});
  if(location.protocol==='file:'){status('当前为单机模式');return}
  try{token=localStorage.getItem(tokenKey)||''}catch{}
  if(token){api('/session',{method:'POST',body:'{}'}).then(()=>api('/profile/me')).then(p=>{me=p;look=p.look;profiles.set(p.id,p);localStorage.setItem('mpNickname',p.nickname);showLookPrompt=L.isDefault(look);connect()}).catch(()=>{clearAccountState();showAuth()})}else showAuth();
})();
