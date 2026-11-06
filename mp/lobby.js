(() => {
  'use strict';
  const L = window.MPLook;
  /* --- 企划组公告（右上角📢 那颗）---------------------------------------------
     只发布我们的版本更新通知，玩家发不了 ⇒ 不走服务器：能写的人只有企划组，
     改一次文案本来就要跟着 lobby.js 一起上线，多一张表、多一套权限只多一处会错。
     新增一条就往数组**前面**加一项，id 只增不减；"看到哪了"记在
     localStorage['mpNoticeSeen']，浏览器级、不按账号分 —— 更新通知是给这台
     机器前面的人看的，换号不该再提示一遍没读过的旧闻。 */
  const NOTICES = [
    { id: 4, at: '2026-11-06T21:00:00+08:00', title: '登录窗小剧场与全校动态上线',
      body: '本游戏企划组：登录窗口和右上角都换了新样子。\n🎬 登录窗：右边照常填账号密码，左边多了一块像素小动画，每 5 秒换一幕 —— 食堂的猫、湖里的鸭子、能留言的公告板、操场上的乐跑，配一句话提醒。点「注册」时左栏自动收起，把地方让给表单。\n📊 全校动态：右上角新增「📊 动态」，一次看四块 —— 算法哥的刷题榜、食堂阿姨最常被问的话和点得最多的菜、学霸姐被问到最多的知识点、老丁最近收到的失物类别。二十秒自动刷新，只算最近七天。\n👕 另外修了几处小毛病：小人的胳膊改成绕肩膀前后摆，鸭子游的方向和头一致；验证码的缺口不再有一圈白边，白色滑块按钮也和轨道严丝合缝了。' },
    { id: 3, at: '2026-11-04T21:40:00+08:00', title: '每日任务与乐跑上线',
      body: '本游戏企划组：新增「每日任务」和「当前在线」。\n📋 每日任务：每天第一次进来送一份猫粮；到新体育馆旁边的操场，绕着跑道跑满五圈再送一份。一天最多两份，一份猫粮只能喂一次猫，同一只猫一天也只吃一次。\n👥 当前在线：右上角能看到现在校园里有谁，只显示头像和昵称。' },
    { id: 2, at: '2026-11-04T17:50:00+08:00', title: '管理后台与安全中心上线',
      body: '本游戏企划组：后台与安全系统已上线。管理端可以查看注册、日活和各小应用的使用情况，处理违规账号；安全端会记录每个 IP 的访问、识别扫站探测与反复试密码，并支持封禁 IP、一键开启维护模式。\n⚠️ 请同学们注意：本站是咱们自己的校园，请勿进行任何不安全行为，包括扫描端口或文件、爆破密码、注入攻击、刷接口压测等。所有请求都有记录，发现异常会直接封禁 IP，情节严重的连同账号一并处理。' },
    { id: 1, at: '2026-11-04T17:30:00+08:00', title: '新增公告通知',
      body: '本游戏企划组：新增公告通知更新。以后每次改版都会在「公告」里留一条，写着改了什么、什么时候改的。' }
  ];
  const NOTICE_SEEN_KEY = 'mpNoticeSeen';
  const root=document.createElement('div');root.id='mpRoot';
  root.innerHTML=`
    <div id="mpStatus" role="status" aria-live="polite" hidden></div>
    <button id="mpSelf" type="button" hidden title="个人中心"></button>
    <button id="mpSprite" type="button" hidden>🧍 玩家精灵</button>
    <button id="mpSummonGuard" type="button" hidden>📣 呼叫老丁</button>
    <button id="mpTaskToggle" type="button" hidden>📋 每日任务</button>
    <button id="mpPortalToggle" type="button" hidden>🌀 传送门</button>
    <button id="mpSoloCanteen" type="button" hidden>🍜 进入食堂</button>
    <button id="mpSoloExit" type="button" hidden>退出单机 · 登录</button>
    <!-- 右上角两颗：公告（企划组发，只报更新）｜留言板（全校谁都能发）。
         2026-11-04 用户口径：「把原来的公告栏改名叫做留言板，然后旁边加一个新的按钮是公告」。
         ⚠️ 两颗包在一个 flex 容器里，不要各自绝对定位 —— 按钮宽度会随未读数、字体变，
            写死 right 的两颗迟早叠在一起。 -->
    <div id="mpTopBtns" hidden>
      <button id="mpNoticeToggle" type="button">📢<span class="mp-btn-txt"> 公告</span><span id="mpNoticeDot" hidden>●</span></button>
      <button id="mpBoardToggle" type="button">📌<span class="mp-btn-txt"> 留言板</span><span id="mpUnread" hidden>0</span></button>
      <button id="mpOnlineToggle" type="button" title="当前在线">👥<span class="mp-btn-txt"> 在线</span><span id="mpOnlineNum">0</span></button>
      <button id="mpPulseToggle" type="button" title="全校动态">📊<span class="mp-btn-txt"> 动态</span></button>
    </div>
    <div id="mpRunHud" hidden><b>🏃 乐跑</b><span id="mpRunText"></span></div>
    <section id="mpNotice" class="mp-panel" hidden aria-label="公告">
      <div class="mp-head"><span class="mp-title">公告 · 更新通知</span><button class="mp-icon" id="mpNoticeClose" aria-label="关闭公告">×</button></div>
      <div id="mpNoticeList"></div>
      <div id="mpNoticeFoot" class="mp-notice-foot">本栏只发布企划组的版本更新通知。</div>
    </section>
    <section id="mpTask" class="mp-panel" hidden aria-label="每日任务">
      <div class="mp-head"><span class="mp-title">每日任务</span><button class="mp-icon" id="mpTaskClose" aria-label="关闭每日任务">×</button></div>
      <div id="mpTaskBody"></div>
      <div class="mp-task-foot">每天零点（北京时间）重新开始。</div>
    </section>
    <section id="mpPortal" class="mp-panel" hidden aria-label="传送门">
      <div class="mp-head"><span class="mp-title">🌀 传送门</span><button class="mp-icon" id="mpPortalClose" aria-label="关闭传送门">×</button></div>
      <div id="mpPortalBody"></div>
      <div class="mp-task-foot">点一下直接站到门口，不用自己走过去。</div>
    </section>
    <section id="mpOnline" class="mp-panel" hidden aria-label="当前在线">
      <div class="mp-head"><span class="mp-title">当前在线</span><button class="mp-icon" id="mpOnlineClose" aria-label="关闭当前在线">×</button></div>
      <div id="mpOnlineList"></div>
      <div class="mp-notice-foot">这里只看得到头像和昵称，点不开个人资料。</div>
    </section>
    <section id="mpPulse" class="mp-panel" hidden aria-label="全校动态">
      <div class="mp-head"><span class="mp-title">📊 全校动态</span><button class="mp-icon" id="mpPulseClose" aria-label="关闭动态">×</button></div>
      <div id="mpPulseBody"><div class="mp-empty">正在读取…</div></div>
      <div class="mp-notice-foot">每 20 秒自动刷新 · 只显示最近 7 天的公开数字</div>
    </section>
    <section id="mpBoard" class="mp-panel" hidden aria-label="留言板">
      <div class="mp-head"><span class="mp-title">留言板 · 全校</span><button class="mp-icon" id="mpBoardClose" aria-label="关闭留言板">×</button></div>
      <div id="mpBoardList"><div class="mp-empty">还没有人留言，说第一句吧。</div></div>
      <form id="mpBoardForm" class="mp-compose"><input id="mpBoardInput" class="mp-field" maxlength="200" placeholder="输入留言，按回车发送" aria-label="留言内容"><button class="mp-primary">发送</button></form>
      <div id="mpBoardError" class="mp-error" role="alert" style="padding:0 10px"></div>
    </section>
    <section id="mpChat" class="mp-panel" hidden aria-label="私聊">
      <div class="mp-head"><span id="mpChatAvatar"></span><span id="mpChatTitle"></span><button type="button" id="mpChatHistory" class="mp-chat-history" title="查看与这位玩家的聊天记录">聊天记录</button><button type="button" id="mpChatReport" class="mp-chat-history" title="举报这位玩家">举报</button><button type="button" id="mpChatBlock" class="mp-chat-history" title="拉黑后双方都不能再发私聊">拉黑</button><button class="mp-icon" id="mpChatClose" aria-label="关闭私聊">×</button></div>
      <div id="mpChatLog"></div>
      <form id="mpChatForm"><textarea id="mpChatInput" class="mp-field" maxlength="500" rows="1" placeholder="输入消息，Enter 发送" aria-label="私聊消息"></textarea><button class="mp-primary">发送</button></form>
      <div id="mpChatError" class="mp-error" role="alert" style="padding:0 10px"></div>
    </section>
    <div id="mpAuthShade" hidden><section id="mpAuth" class="mp-panel" aria-label="大厅登录">
      <div class="mp-auth-art" aria-hidden="true"><div class="mp-auth-stage"><canvas id="mpAuthArt"></canvas></div><p class="mp-auth-tip" id="mpAuthTip"></p><div class="mp-auth-dots" id="mpAuthDots"><i class="on"></i><i></i><i></i><i></i></div></div>
      <div class="mp-auth-main">
      <h2>进入联机大厅</h2><p>注册或登录后，就能看见同场景的同学。</p>
      <div class="mp-tabs"><button type="button" class="mp-secondary" id="mpLoginTab">登录</button><button type="button" class="mp-secondary" id="mpRegisterTab">注册</button></div>
      <form id="mpAuthForm" autocomplete="off"><input id="mpName" class="mp-field" minlength="2" maxlength="16" placeholder="昵称（2–16 字）" autocomplete="off" required><input id="mpPass" class="mp-field" type="password" minlength="8" placeholder="密码（至少 8 位）" autocomplete="new-password" required><div id="mpPassMeter" class="mp-pass" hidden><div class="mp-pass-bars"><i></i><i></i><i></i><i></i></div><span id="mpPassHint" class="mp-pass-hint"></span></div><div id="mpNameHint" class="mp-name-hint" hidden></div><div id="mpCapBox" class="mp-cap" hidden><div class="mp-cap-stage" id="mpCapStage"><img id="mpCapBg" alt="验证图片" draggable="false"><img id="mpCapPiece" class="mp-cap-piece" alt="拼图块" draggable="false"><span id="mpCapLoading" class="mp-cap-loading">验证图片加载中…</span></div><div class="mp-cap-track" id="mpCapTrack"><div class="mp-cap-fill" id="mpCapFill"></div><div class="mp-cap-knob" id="mpCapKnob" role="slider" tabindex="0" aria-label="拖动完成验证" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">»</div></div><div class="mp-cap-foot"><span id="mpCapState" class="mp-cap-state">按住滑块，把碎片拖进缺口</span><button type="button" id="mpCapRefresh" class="mp-cap-refresh">换一张</button></div></div><label id="mpAuthPhotoLine" hidden>选择照片在浏览器生成卡通小人（可选，照片不上传）<input id="mpAuthPhoto" type="file" accept="image/*" class="mp-field"></label><div id="mpAuthLookPreview" hidden></div><button class="mp-primary" id="mpAuthSubmit">登录并进入</button><div id="mpAuthError" class="mp-error" role="alert"></div></form>
      <button type="button" class="mp-secondary" id="mpSolo">暂时单机游览</button>
      </div>
    </section></div>
    <div id="mpProfileShade" hidden><section id="mpProfile" class="mp-panel" aria-label="个人主页"><div class="mp-head"><span class="mp-title" id="mpProfileTitle">个人中心</span><button class="mp-icon" id="mpProfileClose" aria-label="关闭主页">×</button></div><div id="mpProfileBody"></div></section></div>
    <div id="mpLookShade" hidden><section id="mpLook" class="mp-panel" aria-label="设置我的形象"><div class="mp-head"><span class="mp-title">设置我的形象</span><button class="mp-icon" id="mpLookClose" aria-label="关闭形象设置">×</button></div><div id="mpLookBody"></div></section></div>
    <div id="mpNearby" class="mp-panel" hidden><div id="mpNearbyWho"></div><div class="mp-near-actions"><button type="button" id="mpNearbyChat" class="mp-primary">💬 发起私聊</button><button type="button" id="mpNearbyProfile" class="mp-secondary">查看主页</button></div></div>
    <section id="mpGuard" class="mp-panel" hidden aria-label="地图上和老丁对话"><div class="mp-head"><span class="mp-title">保安 · 老丁</span><button id="mpGuardClose" class="mp-icon" aria-label="关闭老丁对话">×</button></div><div id="mpGuardLog" role="log" aria-live="polite"></div><div id="mpGuardQuick" role="group" aria-label="快捷功能"><button type="button" data-act="lost_search">找失物</button><button type="button" data-act="lost_intake">登记失物</button><button type="button" data-act="repair">报修</button><button type="button" data-act="claim">认领核对</button></div><form id="mpGuardForm"><button type="button" id="mpGuardPhoto" title="拍照或选图——找东西、认证件">图</button><input id="mpGuardFile" type="file" accept="image/*" hidden><input id="mpGuardInput" class="mp-field" maxlength="500" placeholder="和老丁说句话，回车发送" aria-label="给老丁发消息"><button class="mp-primary">发送</button></form></section>
    <iframe id="mpGuardBridge" src="about:blank" hidden title="老丁对话服务"></iframe>
    <div id="mpMenu" class="mp-panel" hidden><button id="mpMenuChat">💬 发起对话</button><button id="mpMenuProfile">👤 个人主页</button></div>
    <div id="mpReportShade" hidden><section id="mpReport" class="mp-panel" aria-label="举报玩家">
      <div class="mp-head"><span class="mp-title" id="mpReportTitle">举报</span><button class="mp-icon" id="mpReportClose" aria-label="关闭举报">×</button></div>
      <p class="mp-muted" id="mpReportHint"></p>
      <textarea id="mpReportReason" class="mp-field" maxlength="200" rows="3" placeholder="请写清楚举报理由（2–200 字）"></textarea>
      <div class="mp-near-actions"><button type="button" id="mpReportSubmit" class="mp-primary">提交举报</button></div>
      <div id="mpReportError" class="mp-error" role="alert"></div>
    </section></div>
    `;
  document.body.append(root);
  const $=id=>document.getElementById(id), tokenKey='mpToken';
  let token='',me=null,ws=null,chatWith=null,authMode='login',authLook=null,showLookPrompt=false,retries=0,reconnectTimer=0,connectTimer=0,pingTimer=0,moveAt=0,lastMove='',scene='out',unread=0,menuUser=null,menuAnchor=null,boardSending='',nearUser=null,profileUser=null,guardReady=false,guardOpening=false,soloMode=false,offlineSolo=false,allowReconnect=true,lastRx=0,netTimer=0;
  const peers=new Map(),profiles=new Map(),chatCache=new Map(),pending=new Map(),seenMsgs=new Set(),chatMore=new Map(),chatOldest=new Map();
  /* 拉黑名单：服务端在 welcome 里一次性下发，之后每次拉黑/解除都整份替换。
     没发出去的私聊用一个很大的假 msgId 排在最后，气泡旁边打红感叹号。 */
  let blocks=new Set(),failedSeq=0;
  let boardItems=[],look=L.fallback,boardTimer=0,menuAt=0;
  let taskState=null,onlineUsers=[],onlineTimer=0,runHudKey='',pulseTimer=0;
  let statusTimer=0;
  /* keep=false 的那条到点先淡出再收起；keep=true 是"连接中断，正在重连…"这类要一直挂着的状态。
     ⚠️ 淡出用 class 不用 hidden：hidden 是瞬时消失，用户报的就是"老丁已到达"那条硬挂在地图顶上。 */
  /* keep=true 表示一直挂着不撤（网络中断这类要人看见的状态）；
     要它自己消失就传 keep=false 并用 ms 指定停留时长。 */
  function status(text,keep=false,ms=4200){const e=$('mpStatus');clearTimeout(statusTimer);e.classList.remove('mp-fade');e.textContent=text;e.hidden=!text;if(text&&!keep)statusTimer=setTimeout(()=>{e.classList.add('mp-fade');statusTimer=setTimeout(()=>{e.hidden=true;e.classList.remove('mp-fade')},420)},ms)}
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
  /* 形象设置：脸型/发型/穿搭这些**只管形象**的控件原来长在「个人中心」的表单里，
     现在整块搬到左上角「🧍 玩家精灵」弹出的面板里。个人中心从此只负责资料和聊天记录。
     面板第一次打开时搭一次 DOM，之后每次打开只把当前 look 灌回控件。 */
  const LOOK_KEYS=['faceShape','hairStyle','eye','eyeColor','mouth','acc','hairColor','cloth','clothPattern','clothAlt','skin','pants','accColor','packColor'];
  let lookEditor=null;
  function buildLookEditor(){
    if(lookEditor)return lookEditor;
    const form=document.createElement('form');form.id='mpLookForm';
    form.innerHTML=`<div class="mp-look-preview" id="mpLookPreview"></div><label>从照片生成形象（只在浏览器处理，保存时仅上传形象配方）<input name="photo" type="file" accept="image/*" class="mp-field"></label><div class="mp-look-controls"><label>脸型<select name="faceShape" class="mp-field"><option value="square">方脸</option><option value="round">圆脸</option></select></label><label>发型<select name="hairStyle" class="mp-field"><option value="short">短发</option><option value="mid">中发</option><option value="long">长发</option><option value="ponytail">马尾</option><option value="bun">丸子头</option><option value="twintails">双马尾</option></select></label><label>眼型<select name="eye" class="mp-field"><option value="round">圆眼</option><option value="narrow">细眼</option><option value="dot">豆豆眼</option></select></label><label>嘴型<select name="mouth" class="mp-field"><option value="soft">自然</option><option value="smile">微笑</option></select></label><label>瞳色<input name="eyeColor" type="color" class="mp-field"></label><label>配饰<select name="acc" class="mp-field"><option value="none">无</option><option value="glasses">眼镜</option><option value="cap">帽子</option><option value="scarf">围巾</option></select></label><label>发色<input name="hairColor" type="color" class="mp-field"></label><label>上衣主色<input name="cloth" type="color" class="mp-field"></label><label>上衣样式<select name="clothPattern" class="mp-field"><option value="solid">纯色</option><option value="stripe">横条纹</option></select></label><label>条纹副色<input name="clothAlt" type="color" class="mp-field"></label><label>肤色<input name="skin" type="color" class="mp-field"></label><label>裤子<input name="pants" type="color" class="mp-field"></label><label>书包颜色<input name="packColor" type="color" class="mp-field"></label><label id="mpAccColorRow"><span id="mpAccColorName">配饰颜色</span><input name="accColor" type="color" class="mp-field"></label></div><div class="mp-profile-actions"><button type="button" id="mpResetLook" class="mp-secondary">恢复默认形象</button><button type="button" id="mpDownloadLook" class="mp-secondary">下载卡通头像 PNG</button><button class="mp-primary">保存形象</button><button type="button" id="mpLookCancel" class="mp-secondary">关闭</button></div><div class="mp-error" id="mpLookError" role="alert"></div>`;
    $('mpLookBody').append(form);
    let draft=L.norm(look);
    const error=form.querySelector('#mpLookError');
    function preview(){const box=form.querySelector('#mpLookPreview');let host=box.firstElementChild;if(!host){host=avatarViewer(draft);box.append(host)}else host.update(draft)}
    function syncFields(){for(const k of LOOK_KEYS)form.elements[k].value=draft[k];preview()}
    for(const k of LOOK_KEYS){const apply=()=>{draft[k]=form.elements[k].value;preview()};form.elements[k].addEventListener('input',apply);form.elements[k].addEventListener('change',apply)}
    /* 配饰单独染色区：没戴配饰时隐藏，戴上后按配件改名（眼镜/帽子/围巾）。 */
    const accRow=form.querySelector('#mpAccColorRow'),accName=form.querySelector('#mpAccColorName');
    function syncAccColor(){const acc=form.elements.acc.value,names={glasses:'眼镜镜框颜色',cap:'帽子颜色',scarf:'围巾颜色'};accRow.hidden=acc==='none';accName.textContent=names[acc]||'配饰颜色'}
    form.elements.acc.addEventListener('change',syncAccColor);
    form.elements.photo.onchange=async()=>{try{const result=await lookFromPhoto(form.elements.photo.files[0]);draft={...L.norm(result.look),packColor:draft.packColor};syncFields();error.textContent='已在浏览器按照片生成，可微调后保存'}catch(err){error.textContent=err.message}};
    form.querySelector('#mpResetLook').onclick=()=>{draft={...L.fallback};syncFields();error.textContent=''};
    form.querySelector('#mpDownloadLook').onclick=()=>{const a=document.createElement('a');a.download='像素校园卡通头像.png';a.href=L.portrait(draft).toDataURL('image/png');a.click()};
    form.querySelector('#mpLookCancel').onclick=()=>closeLookPanel();
    form.onsubmit=async e=>{e.preventDefault();const button=form.querySelector('.mp-primary');button.disabled=true;error.textContent='';
      try{
        /* 服务端 PUT 是整份覆盖：形象面板只改 look，但资料字段得按现值原样带上，
           否则保存形象会把签名/学院/标签一起清空（新版服务端也会按现值合并，双保险）。 */
        const updated=await api('/profile/me',{method:'PUT',body:JSON.stringify({look:draft,bio:me.bio||'',college:me.college||'',grade:me.grade||'',tags:me.tags||[]})});
        me=updated;look=updated.look;profiles.set(me.id,updated);updateSelf();socketSend({type:'look.update',look});status('形象已保存');closeLookPanel();
      }catch(err){error.textContent=err.message}finally{button.disabled=false}};
    lookEditor={form,sync(){draft=L.norm(look);syncFields();syncAccColor();error.textContent=''}};
    return lookEditor;
  }
  function openLookPanel(){
    if(!me){showAuth('请先登录再设置形象');return}
    $('mpMenu').hidden=true;$('mpNearby').hidden=true;closeTopPanels();
    buildLookEditor();
    /* 预览每次都从当前 look 重来：上次关面板时已经把查看器卸了，没改过的草稿不跨次残留。 */
    lookEditor.sync();
    $('mpLookShade').hidden=false;
  }
  function closeLookPanel(){if($('mpLookShade').hidden)return;unmountAvatarViewers($('mpLookShade'));$('mpLookShade').hidden=true}
  /* 注册时的密码强度条：本地先即时打分，停手 600 毫秒再问服务器"泄露库查得到吗"。
     评分规则必须和 mp/password_check.py 保持一致，改一边就要改另一边。
     浏览器端这份只管提示，真正拦人的是注册接口。 */
  let pwTimer=0,pwSeq=0;
  function pwLocal(pw,nick){
    const issues=[];
    if(!pw||pw.length<8)return{ok:false,score:0,label:'很弱',issues:['至少 8 位']};
    const cls=[/[a-z]/,/[A-Z]/,/\d/,/[^A-Za-z0-9]/].filter(r=>r.test(pw)).length;
    let score=pw.length>=16?4:pw.length>=12?3:pw.length>=10?2:1;
    if(cls>=3)score++;
    else if(cls===1){score--;issues.push('别只用一种字符（比如纯数字或纯字母）')}
    if(/(.)\1\1/.test(pw)){score--;issues.push('别用连续重复的字符（aaa、111）')}
    if(/(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwer|wert|asdf|sdfg|zxcv|1qaz|2wsx|qazwsx)/i.test(pw)){score--;issues.push('别用键盘上挨着的顺序（1234、qwer）')}
    if(nick&&nick.trim().length>=3&&pw.toLowerCase().includes(nick.trim().toLowerCase())){score-=2;issues.push('密码里不要放昵称')}
    if(cls===1)score=Math.min(score,2);
    score=Math.max(0,Math.min(4,score));
    return{ok:score>=2,score,label:['很弱','弱','一般','强','很强'][score],issues};
  }
  function pwRender(r){
    const box=$('mpPassMeter');if(!box||box.hidden)return;
    const bars=box.querySelectorAll('i');
    for(let i=0;i<bars.length;i++)bars[i].className=i<r.score?'on s'+r.score:'';
    const hint=$('mpPassHint');
    hint.textContent=r.issues[0]||(r.score>=2?'强度够了':'再长一点，或者加一点大写/符号');
    hint.className='mp-pass-hint'+(r.score<=1?' bad':r.score>=3?' good':'');
  }
  function pwSchedule(){
    if(authMode!=='register')return;
    const pw=$('mpPass').value,nick=$('mpName').value.trim();
    pwRender(pwLocal(pw,nick));
    clearTimeout(pwTimer);
    if(pw.length<8)return;
    pwTimer=setTimeout(async()=>{
      const seq=++pwSeq,cur=pw;
      try{const r=await api('/password/check',{method:'POST',body:JSON.stringify({password:cur,nickname:nick})});if(seq===pwSeq&&cur===$('mpPass').value)pwRender(r)}catch{}
    },600);
  }
  $('mpPass').addEventListener('input',pwSchedule);
  $('mpName').addEventListener('input',pwSchedule);
  /* ---------- 昵称查重：边打字边问服务端 ----------
     服务端按「规范化键」比对，大小写、全角半角都算同一个名字，
     所以这里不用自己再折一遍，看到什么就显示什么。 */
  let nickTimer=0,nickSeq=0;
  function nickSchedule(){
    const hint=$('mpNameHint');
    if(authMode!=='register'){hint.hidden=true;return}
    const name=$('mpName').value.trim();
    clearTimeout(nickTimer);
    if(name.length<2){hint.hidden=true;return}
    hint.hidden=false;hint.className='mp-name-hint';hint.textContent='正在检查昵称…';
    nickTimer=setTimeout(async()=>{
      const seq=++nickSeq;
      try{
        const r=await api('/nickname/check?nickname='+encodeURIComponent(name));
        if(seq!==nickSeq)return;
        hint.textContent=r.available?('「'+name+'」可以用'):('✕ '+r.error);
        hint.className='mp-name-hint '+(r.available?'good':'bad');
      }catch{}
    },500);
  }
  /* ---------- 注册验证：拖动拼图 ----------
     题目（一张带缺口的校园图 + 一块碎片）由服务端现画，答案只留在服务端。
     这里负责把碎片拖到缺口，松手时把「最终横坐标 + 整条拖动轨迹」一起交上去。
     过关服务端发一张一次性票据，注册时拿票换账号。 */
  const cap={challenge:null,ticket:'',drag:null,ratio:0,busy:false};
  function capRender(ratio){
    cap.ratio=ratio;
    const knob=$('mpCapKnob'),fill=$('mpCapFill'),piece=$('mpCapPiece');
    // translateX 的百分比是按滑块自身宽度算的，要按轨道可用宽度换算成像素
    const track=$('mpCapTrack');
    if(track){
      const usable=Math.max(1,track.clientWidth-knob.offsetWidth);
      knob.style.transform='translateX('+(ratio*usable)+'px)';
      fill.style.width=(ratio*usable+knob.offsetWidth/2)+'px';
    }
    knob.setAttribute('aria-valuenow',String(Math.round(ratio*100)));
    if(cap.challenge&&piece){
      const piecePct=cap.challenge.pieceW/cap.challenge.w*100;
      piece.style.left=(ratio*(100-piecePct))+'%';
    }
  }
  function capState(text,cls){const el=$('mpCapState');if(!el)return;el.textContent=text;el.className='mp-cap-state'+(cls?' '+cls:'')}
  async function capLoad(){
    const box=$('mpCapBox');if(!box||box.hidden)return;
    cap.ticket='';cap.challenge=null;cap.busy=true;
    $('mpCapLoading').hidden=false;$('mpCapBg').style.opacity='.2';$('mpCapPiece').hidden=true;
    $('mpCapKnob').classList.remove('ok');$('mpCapTrack').classList.remove('ok','bad');
    capRender(0);capState('验证图片加载中…');
    try{
      const ch=await api('/captcha');
      cap.challenge=ch;
      $('mpCapBg').src=ch.bg;$('mpCapPiece').src=ch.piece;
      $('mpCapPiece').style.top=(ch.y/ch.h*100)+'%';
      $('mpCapPiece').style.width=(ch.pieceW/ch.w*100)+'%';
      const show=()=>{$('mpCapLoading').hidden=true;$('mpCapBg').style.opacity='1';$('mpCapPiece').hidden=false;capRender(cap.ratio)};
      if($('mpCapBg').complete)show();else $('mpCapBg').onload=show;
      capState('按住滑块，把碎片拖进缺口');
    }catch(err){
      capState(err.message||'验证图片加载失败，点「换一张」重试','bad');
    }finally{cap.busy=false}
  }
  function capStart(event){
    if(!cap.challenge||cap.ticket||cap.busy)return;
    const track=$('mpCapTrack');
    try{track.setPointerCapture(event.pointerId)}catch{}
    const rect=track.getBoundingClientRect();
    const knobW=$('mpCapKnob').offsetWidth||30;
    /* 轨道的 1px 边框不算可用宽度：clientWidth 才是滑块真正能走的距离，
       clientLeft 是左边框厚度。不扣这两处，按钮中心和碎片会差 1 像素。 */
    const usable=Math.max(1,track.clientWidth-knobW);
    cap.drag={start:performance.now(),usable,knobW,left:rect.left+track.clientLeft,trail:[],last:-1};
    capMove(event);
  }
  function capMove(event){
    const d=cap.drag;if(!d||!cap.challenge)return;
    const ratio=Math.max(0,Math.min(1,(event.clientX-d.left-d.knobW/2)/d.usable));
    capRender(ratio);
    const cx=ratio*(cap.challenge.w-cap.challenge.pieceW);
    if(!d.trail.length||Math.abs(cx-d.last)>=1.5){
      d.trail.push([Math.round(performance.now()-d.start),Math.round(cx*10)/10]);
      d.last=cx;
    }
  }
  async function capEnd(){
    const d=cap.drag;if(!d||!cap.challenge)return;
    cap.drag=null;
    const ch=cap.challenge,cx=cap.ratio*(ch.w-ch.pieceW);
    d.trail.push([Math.round(performance.now()-d.start),Math.round(cx*10)/10]);
    const spent=Math.round(performance.now()-d.start);
    cap.busy=true;capState('正在核对…');
    try{
      const r=await api('/captcha/verify',{method:'POST',body:JSON.stringify({id:ch.id,x:Math.round(cx*10)/10,spent,trail:d.trail})});
      cap.ticket=r.ticket;
      $('mpCapKnob').classList.add('ok');$('mpCapTrack').classList.add('ok');
      capState('验证通过 ✓');
    }catch(err){
      $('mpCapTrack').classList.add('bad');
      capState(err.message||'没对准，再试一次','bad');
      setTimeout(()=>{if(!$('mpAuthShade').hidden&&authMode==='register')capLoad()},900);
    }finally{cap.busy=false}
  }
  function capBind(){
    const track=$('mpCapTrack');if(!track||track.dataset.bound)return;
    track.dataset.bound='1';
    track.addEventListener('pointerdown',capStart);
    track.addEventListener('pointermove',e=>{if(cap.drag)capMove(e)});
    track.addEventListener('pointerup',capEnd);
    track.addEventListener('pointercancel',()=>{cap.drag=null});
    // 键盘也能用：聚焦滑块后按方向键微调，回车提交
    track.addEventListener('keydown',e=>{
      if(!cap.challenge||cap.ticket)return;
      const step=e.shiftKey?0.01:0.05;
      if(e.key==='ArrowRight'){e.preventDefault();capRender(Math.min(1,cap.ratio+step))}
      else if(e.key==='ArrowLeft'){e.preventDefault();capRender(Math.max(0,cap.ratio-step))}
    });
    $('mpCapRefresh').onclick=capLoad;
  }
  $('mpName').addEventListener('input',nickSchedule);
  function setAuthMode(mode){authMode=mode;$('mpAuthSubmit').textContent=mode==='register'?'注册并进入':'登录并进入';$('mpAuthPhotoLine').hidden=mode!=='register';$('mpPassMeter').hidden=mode!=='register';$('mpCapBox').hidden=mode!=='register';$('mpAuthPhoto').required=false;$('mpLoginTab').style.borderColor=mode==='login'?'#ffd76e':'';$('mpRegisterTab').style.borderColor=mode==='register'?'#ffd76e':'';$('mpAuthError').textContent='';if(mode!=='register'){$('mpNameHint').hidden=true;cap.ticket='';cap.challenge=null}else{capBind();pwSchedule();nickSchedule();capLoad()};if(mode==='register'){authArtStop();$('mpAuth').classList.add('mp-auth-reg')}else{$('mpAuth').classList.remove('mp-auth-reg');if(!$('mpAuthShade').hidden)authArtStart()}}
  /* [QODER-FIX #1] 退出登录后给一张干净的登录页：除了 reset()，再显式清空账号密码，
     防止浏览器自动填充把上一位用户的昵称/密码又填回来。 */
  function showAuth(msg=''){setAuthMode('login');$('mpAuthForm').reset();$('mpName').value='';$('mpPass').value='';$('mpAuthPhoto').value='';$('mpAuthLookPreview').replaceChildren();$('mpAuthLookPreview').hidden=true;authLook=null;$('mpAuthShade').hidden=false;$('mpAuthError').textContent=msg;$('mpName').focus();authArtStart()}
  function hideAuth(){$('mpAuthShade').hidden=true;authArtStop()}
  /* --- 登录窗左半边的小剧场 ------------------------------------------------
     用地图上同一套像素小人（L.sprite）在迷你场景里走，每 5 秒换一条提示。
     全部是 canvas 现画，不加载任何图片，断网也看得见。 */
  const AUTH_SCENES=[
    {tip:'每天登录都能领一份猫粮，点左上角的任务就有。',sky:'#243649',skyTop:'#0b1119',ground:'#24301f',prop:'canteen'},
    {tip:'别靠湖边的鸭子太近，它真的会追着人咬。',sky:'#1b2a39',skyTop:'#0a1018',ground:'#2a3324',prop:'lake'},
    {tip:'想在哪儿留句话就点开哪栋楼，留言全校都能看。',sky:'#262b37',skyTop:'#0c1017',ground:'#26301f',prop:'board'},
    {tip:'跑满 5 圈乐跑，食堂阿姨会再给你一包猫粮。',sky:'#1f2836',skyTop:'#0b1016',ground:'#2c2a1b',prop:'track'}
  ];
  /* 星星位置写死：用同一个公式算出来，刷新也不会乱跳 */
  const AUTH_STARS=[...Array(16)].map((_,i)=>({x:(i*47+9)%196,y:(i*61+13)%96}));
  let authArtRAF=0,authArtScene=0,authArtAt=0;
  function authArtStart(){
    authArtAt=performance.now();authArtScene=0;authArtTip();
    if(authArtRAF)return;
    const tick=now=>{
      if($('mpAuthShade').hidden){authArtRAF=0;return}
      if(now-authArtAt>5000){authArtAt=now;authArtScene=(authArtScene+1)%AUTH_SCENES.length;authArtTip()}
      authArtPaint(now);authArtRAF=requestAnimationFrame(tick);
    };
    authArtRAF=requestAnimationFrame(tick);
  }
  function authArtStop(){if(authArtRAF)cancelAnimationFrame(authArtRAF);authArtRAF=0}
  function authArtTip(){
    const tip=$('mpAuthTip');if(!tip)return;tip.textContent=AUTH_SCENES[authArtScene].tip;
    if(tip.animate)tip.animate([{opacity:0,transform:'translateY(3px)'},{opacity:1,transform:'none'}],{duration:280,easing:'ease-out'});
    const dots=$('mpAuthDots');if(dots)for(const [i,d] of [...dots.children].entries())d.className=i===authArtScene?'on':'';
  }
  function mixColor(a,b,t){
    const pa=parseInt(a.slice(1),16),pb=parseInt(b.slice(1),16),c=(s,sh)=>Math.round(((pa>>sh)&255)*(1-t)+((pb>>sh)&255)*t);
    return 'rgb('+c(0,16)+','+c(0,8)+','+c(0,0)+')';
  }
  function authArtProp(g,kind,W,gy,now,box){
    if(kind==='canteen'){
      box(112,gy-108,74,108,'#28323f');
      box(108,gy-115,82,8,'#3b4a5b');
      for(let i=0;i<6;i++)box(110+i*13,gy-107,7,6,i%2?'#d9ac4a':'#8a5a3a');
      for(let i=0;i<3;i++)box(120+i*20,gy-92,12,13,'#f0cf76');
      box(140,gy-34,24,34,'#171f29');
      box(143,gy-30,18,28,'#e3c070');
      box(97,gy-8,15,8,'#c9a15a');box(99,gy-11,11,4,'#e0b370');box(100,gy-13,9,2,'#f0cc88');
      const st=Math.floor(now/180)%6;
      g.globalAlpha=.35;
      box(102,gy-17-st*2,3,3,'#cfe0e8');box(107,gy-21-((st+3)%6)*2,3,3,'#cfe0e8');
      g.globalAlpha=1;
      const wag=Math.floor(now/380)%2,blink=now%3200<140;
      box(78,gy-13,13,13,'#8a6a46');
      box(80,gy-17,3,5,'#8a6a46');box(86,gy-17,3,5,'#8a6a46');
      if(blink)box(83,gy-9,7,1,'#5a4530');
      else{box(83,gy-9,2,2,'#20242a');box(88,gy-9,2,2,'#20242a')}
      box(74,gy-5-wag*2,4,2,'#8a6a46');
    } else if(kind==='lake'){
      box(52,gy-2,148,30,'#1b3646');
      box(52,gy-2,148,2,'#2b5568');
      for(let i=0;i<6;i++)box(60+i*24+Math.sin(now/700+i)*4,gy+6+(i%3)*7,14,2,'#2f5a6e');
      box(56,gy-16,2,16,'#3a5a32');box(59,gy-20,2,20,'#3a5a32');
      const dx=100+Math.sin(now/1100)*24,dy=gy+10+Math.sin(now/500)*2;
      /* 头跟着**速度方向**转：sin 在走、cos 是速度，速度朝左时整只鸭子镜像，
         不然会看到它倒着游 —— 头朝右、身子往左。 */
      const right=Math.cos(now/1100)>=0,hx=right?dx+11:dx-3;
      box(dx,dy,15,9,'#e6d38a');
      box(hx,dy-6,7,7,'#efe0a0');
      box(right?hx+7:hx-5,dy-4,5,2,'#d98c3f');
      box(hx+2,dy-3,2,2,'#20242a');
      box(right?dx-1:dx-3,dy+8,17,1,'#2b5568');
    } else if(kind==='board'){
      box(66,gy-74,76,54,'#3b3226');
      box(70,gy-70,68,46,'#c9b998');
      const notes=[[74,gy-66,26,18,'#d98c6a'],[104,gy-64,28,22,'#8fb4c9'],[76,gy-44,26,16,'#e0c46a'],[106,gy-38,24,14,'#b7d39a']];
      for(const [x,y,w,h,col] of notes){box(x,y,w,h,col);box((x+w/2)|0,y,2,2,'#c6534d')}
      box(66,gy-20,5,20,'#3b3226');box(137,gy-20,5,20,'#3b3226');
      box(150,gy-58,3,58,'#39404a');box(146,gy-65,11,7,'#e8c86a');
      g.globalAlpha=.1;box(136,gy-86,32,32,'#ffd98a');g.globalAlpha=1;
    } else {
      box(0,gy+14,W,2,'#cdc6ae');box(0,gy+28,W,2,'#cdc6ae');box(0,gy+42,W,2,'#cdc6ae');
      for(let i=0;i<3;i++)for(let j=0;j<2;j++)box(14+i*7,gy+14+j*7,7,7,(i+j)%2?'#d8d2c0':'#b14a3f');
      box(166,gy-70,3,70,'#5a6270');
      const wave=Math.sin(now/260)*2;
      box(169,gy-70,16,3,'#c25a4a');box(169,gy-67,18+wave,3,'#d96b58');box(169,gy-64,14,3,'#c25a4a');
      box(120,gy-9,9,9,'#c25a4a');box(122,gy-12,5,3,'#e07a4a');
    }
  }
  function authArtPaint(now){
    const c=$('mpAuthArt');if(!c)return;
    const stage=c.parentElement,cw=stage.clientWidth,ch=stage.clientHeight;
    if(cw<40||ch<60)return;
    /* 画布缓冲区按显示比例算高度：注册时窗口变高，天空跟着长，画面不会空一块 */
    const W=200,H=Math.min(460,Math.max(150,Math.round(W*ch/cw)));
    if(c.width!==W||c.height!==H){c.width=W;c.height=H}
    const g=c.getContext('2d');g.imageSmoothingEnabled=false;
    const gy=H-58,sc=AUTH_SCENES[authArtScene];
    const box=(x,y,w,h,col)=>{if(w<=0||h<=0)return;g.fillStyle=col;g.fillRect(x|0,y|0,Math.ceil(w),Math.ceil(h))};
    for(let i=0;i<8;i++)box(0,H*i/8,W,H/8+1,mixColor(sc.skyTop,sc.sky,i/7));
    for(let i=0;i<AUTH_STARS.length;i++){
      if((Math.floor(now/600)+i)%4===0)continue;
      box(AUTH_STARS[i].x,AUTH_STARS[i].y,1,1,i%5===0?'#cfe3ff':'#7d90a8');
    }
    for(let i=0;i<7;i++){
      const bw=18+(i*13)%14,bh=26+(i*29)%54,x=6+i*29;
      box(x,gy-bh,bw,bh,'#0a121b');
      for(let j=0;j<2;j++)if((i+j)%3)box(x+4+j*8,gy-bh+7+j*13,3,4,'#2a3b4d');
    }
    box(0,gy,W,H-gy,sc.ground);
    box(0,gy,W,3,'#35462b');box(0,gy+3,W,2,'#1d2a17');
    for(let i=4;i<W;i+=13){box(i,gy+10,2,3,'#33452a');box(i+4,gy+13,2,2,'#2b3c23')}
    box(22,gy-72,3,72,'#3a3f45');box(18,gy-79,11,7,'#e8c86a');
    g.globalAlpha=.1;box(6,gy-98,40,40,'#ffd98a');g.globalAlpha=1;
    authArtProp(g,sc.prop,W,gy,now,box);
    const span=W-88,t=(now/1000*30)%(2*span),x=32+(t<span?t:2*span-t),right=t<span;
    if(sc.prop==='track'){
      g.globalAlpha=.16;
      for(let i=0;i<3;i++)box(x-6-i*6,gy-6-i*2,3,3,'#d8d2c0');
      g.globalAlpha=1;
    }
    g.drawImage(L.sprite(L.fallback,right?'right':'left',Math.floor(now/135)%4),x,gy-56,36,56);
  }

  /* [2026-11-06 补回·同批] 这两个也是那次改动里没的：
     进来后 updateSelf() 每次形象变化都调，connectedUI() 在登录/断线时调。 */
  function connectedUI(on){
    const setH=(id,v)=>{const el=$(id);if(el)el.hidden=v};
    for(const id of ['mpSelf','mpSprite','mpSummonGuard','mpTopBtns','mpTaskToggle','mpPortalToggle'])setH(id,!on);
    if(!on){
      for(const id of ['mpTask','mpPortal','mpOnline','mpPulse','mpRunHud','mpBoard','mpNotice','mpChat','mpProfileShade','mpLookShade','mpMenu','mpNearby'])setH(id,true);
      clearInterval(onlineTimer);onlineTimer=0;clearInterval(pulseTimer);pulseTimer=0;
      nearUser=null;taskState=null;runReset();
    } else updateSelf();
  }
  function updateSelf(){if(!me)return;const el=$('mpSelf');if(!el)return;el.replaceChildren(avatarEl(look,me.id,true,false),document.createTextNode(me.nickname+' · 个人中心'))}
  /* [2026-11-06 补回] 这一组在一次改动里被删了，但 5 处调用还在 —— 登录第一行就是
     clearAccountState()，函数没了直接抛 "clearAccountState is not defined"，大厅进不去。
     按 a385e5c 那版恢复，只留下当前代码里还存在的符号：老丁巡逻点（GUARD_SPOTS /
     guardSnap）和居中场景 iframe（ctrF / hudTick）新版已经删掉，这里不再引用。 */
  function clearNpcTickets(){
    const exact=['xbg_token','ld_token','token','user','mpNickname','xbg_cred','ld_cred','cmr_cred','campus_cred','xbg_shot_auto'];
    try{for(const key of Object.keys(localStorage)){if(exact.includes(key)||/^(guard_v\d+_|agent_watch_)/.test(key))localStorage.removeItem(key)}}catch{}
    try{sessionStorage.removeItem('mpGuest')}catch{}
    try{$('mpGuardBridge').src='about:blank';guardReady=false;$('mpGuardLog').replaceChildren()}catch{}
  }
  function resetWorld(){
    $('mpSoloCanteen').hidden=true;$('mpSoloExit').hidden=true;closeLookPanel();
    try{if(typeof GUARD!=='undefined'&&GUARD){GUARD.summoned=false;GUARD.summonRepath=0}}catch{}
    guardReady=false;guardOpening=false;$('mpGuard').hidden=true;$('mpGuardLog').replaceChildren();$('mpGuardInput').value='';
    try{$('mpGuardBridge').src='about:blank'}catch{}
    try{if(typeof CENTER!=='undefined'&&CENTER.active)roomLeave();else if(typeof CENTER!=='undefined'&&CENTER.plat)ctrClosePlatform()}catch{}
    try{player.x=SPAWN.x;player.y=SPAWN.y;player.dir='down';player.step=0;player.walk=0;player.idle=0}catch{}
    try{for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0}catch{}
    scene='out';lastMove='';
  }
  function clearAccountState(){
    soloMode=false;offlineSolo=false;clearTimeout(boardTimer);boardSending='';
    allowReconnect=true;clearInterval(netTimer);
    clearTimeout(reconnectTimer);clearTimeout(connectTimer);clearInterval(pingTimer);
    const old=ws;ws=null;try{old&&old.close()}catch{}
    saveToken('');clearNpcTickets();MP.connected=false;me=null;look=L.fallback;showLookPrompt=false;
    peers.clear();profiles.clear();chatCache.clear();chatMore.clear();chatOldest.clear();boardItems=[];pending.clear();seenMsgs.clear();
    chatWith=null;menuUser=null;menuAnchor=null;nearUser=null;profileUser=null;unread=0;boardSending='';updateUnread();
    $('mpBoardList').replaceChildren();$('mpChatLog').replaceChildren();$('mpBoardInput').value='';$('mpChatInput').value='';
    $('mpBoardError').textContent='';$('mpChatError').textContent='';$('mpBoardForm').querySelector('button').disabled=false;
    connectedUI(false);resetWorld();status('');
  }

  async function submitAuth(e){e.preventDefault();const nickname=$('mpName').value.trim(),password=$('mpPass').value,button=$('mpAuthSubmit');button.disabled=true;$('mpAuthError').textContent='';try{
    if(authMode==='register'){
      const verdict=pwLocal(password,nickname);
      if(!verdict.ok)throw Error(verdict.issues[0]||'密码太弱，换一个');
      if(!cap.ticket)throw Error('请先按住滑块，把碎片拖进缺口完成验证');
      authLook={...L.fallback};
      if($('mpAuthPhoto').files[0])try{authLook=(await lookFromPhoto($('mpAuthPhoto').files[0])).look}catch{status('照片无法处理，已使用默认形象，可在个人中心调整')}
      try{await api('/register',{method:'POST',body:JSON.stringify({nickname,password,captchaTicket:cap.ticket})});cap.ticket=''}
      catch(err){if(/验证/.test(err.message)){cap.ticket='';capLoad()}throw err}
    }
    /* [QODER-FIX #3] 注册/登录成功后先把上一位用户的本地缓存整个清掉（留言、私聊、
       附近的人、NPC 票据），再写入新 token，避免新账号界面里还挂着旧用户的记录。 */
    const result=await api('/login',{method:'POST',body:JSON.stringify({nickname,password})});clearAccountState();saveToken(result.token);me=result.user;look=me.look;profiles.set(me.id,me);localStorage.setItem('mpNickname',me.nickname);
    /* 管理员不走游戏：登录成功直接送去后台（后台自己再验一次 is_admin）。 */
    if(me.admin){location.replace('/admin.html');return}
    if(authMode==='register'&&authLook){me=await api('/profile/me',{method:'PUT',body:JSON.stringify({look:authLook})});look=me.look;profiles.set(me.id,me)}
    showLookPrompt=L.isDefault(look);hideAuth();connect();
  }catch(err){$('mpAuthError').textContent=err.message}finally{button.disabled=false}}
  function socketSend(payload){if(ws&&ws.readyState===WebSocket.OPEN){ws.send(JSON.stringify(payload));return true}status('联机暂不可用，消息未发送',true);return false}
  function connect(){if(!token||location.protocol==='file:'||!allowReconnect||soloMode)return;if(ws&&ws.readyState<=1)return;clearTimeout(reconnectTimer);
    const scheme=location.protocol==='https:'?'wss':'ws';let socket;
    try{const wsHost=(location.port==='3000')?`${location.hostname}:${Number('__MP_WS_PORT__')||8090}`:location.host;socket=new WebSocket(`${scheme}://${wsHost}/mp?token=${encodeURIComponent(token)}`)}catch{scheduleReconnect();return}
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
    socket.onclose=e=>{if(ws!==socket)return;ws=null;clearTimeout(connectTimer);clearInterval(pingTimer);clearInterval(netTimer);if(e.code===4001||e.code===4003){clearAccountState();showAuth(e.code===4001?'该账号已在另一处登录':'请重新登录');return}if(boardSending){boardSending='';$('mpBoardForm').querySelector('button').disabled=false;$('mpBoardError').textContent='连接中断，留言未确认，请重试'}scheduleReconnect()};
  }
  function onPacket(m){switch(m.type){
    case 'welcome':{const recovered=offlineSolo;offlineSolo=false;$('mpSoloCanteen').hidden=true;$('mpSoloExit').hidden=true;me=m.me;look=me.look;profiles.set(me.id,me);chatRestore();scene=m.scene;peers.clear();m.peers.forEach(addPeer);blocks=new Set((m.blocks||[]).map(Number));MP.connected=true;lastMove='';connectedUI(true);updateSelf();
      /* 进场就抓一次每日任务和在线人数；之后每 15 秒刷一次在线数（按钮上那个数字）。 */
      loadTask();clearInterval(onlineTimer);onlineTimer=setInterval(loadOnline,15000);loadOnline();if(recovered)status('网络已恢复，自动返回联机大厅');if(showLookPrompt){showLookPrompt=false;openLookPanel();status('请设置你的卡通形象')}
      /* 重连之后把正开着的私聊重新拉一遍：断线期间对方发的、以及本地没存到的，一次补齐。 */
      if(chatWith)socketSend({type:'chat.history',withUser:chatWith,limit:30});break}
    /* 服务端发下来的每日任务状态（进场上线时一次、每跑完一圈一次）。 */
    case 'task.state':{const t={...m};delete t.type;setTask(t);break}
    case 'scene.peers':scene=m.scene;peers.clear();m.peers.forEach(addPeer);break;
    case 'peer.join':addPeer(m.peer);break;
    case 'peer.move':{const p=peers.get(m.id);if(p){const v=point(p,performance.now());p.fromX=v.x;p.fromY=v.y;p.x=m.x;p.y=m.y;p.dir=m.dir;p.at=performance.now()}break}
    case 'peer.leave':peers.delete(m.id);break;
    case 'peer.look':{const p=peers.get(m.id);if(p)p.look=m.look;const q=profiles.get(m.id);if(q)q.look=m.look;if(nearUser===m.id)nearUser=null;renderBoard();if(chatWith===m.id)renderChat();break}
    case 'announce.list':boardItems=m.items;renderBoard();break;
    case 'announce.new':boardItems.push(m);boardItems=boardItems.slice(-50);if($('mpBoard').hidden){unread++;updateUnread()}renderBoard();break;
    /* 管理员在后台点「清理」，那条留言当场从所有人的留言板上消失 */
    case 'announce.remove':boardItems=boardItems.filter(a=>Number(a.id)!==Number(m.id));renderBoard();break;
    case 'muted':status(m.msg||'你已被禁言');break;
    case 'announce.ack':if(m.clientMsgId===boardSending){clearTimeout(boardTimer);boardSending='';$('mpBoardInput').value='';$('mpBoardForm').querySelector('button').disabled=false;$('mpBoardError').textContent='留言已发送'}break;
    case 'chat.history':chatCache.set(m.withUser,mergeMessages(chatCache.get(m.withUser)||[],m.items));chatMore.set(m.withUser,!!m.hasMore);if(m.items.length)chatOldest.set(m.withUser,Number(m.items[0].msgId));chatSave(m.withUser);if(chatWith===m.withUser)renderChat();break;
    case 'chat.msg':{if(seenMsgs.has(m.msgId))break;seenMsgs.add(m.msgId);const other=m.from===me.id?m.to:m.from;chatCache.set(other,mergeMessages(chatCache.get(other)||[],[m]));chatSave(other);if(chatWith===other)renderChat();else status(m.fromNickname+' 发来新消息');break}
    case 'chat.ack':{const p=pending.get(m.clientMsgId);if(p){pending.delete(m.clientMsgId);const msg={...p,msgId:m.msgId,at:m.at};chatCache.set(p.to,mergeMessages(chatCache.get(p.to)||[],[msg]));chatSave(p.to);if(chatWith===p.to)renderChat()}break}
    case 'presence':{const p=profiles.get(m.userId);if(p){p.online=m.online;p.lastSeen=m.lastSeen}renderBoard();if(chatWith===m.userId)renderChatTitle();break}
    case 'error':if(m.code?.startsWith('ANNOUNCE')){if(!m.clientMsgId||m.clientMsgId===boardSending){clearTimeout(boardTimer);boardSending='';$('mpBoardForm').querySelector('button').disabled=false;$('mpBoardError').textContent=m.msg}}else if(m.code?.startsWith('CHAT')){
      $('mpChatError').textContent=m.msg;
      /* 没送达的那条也要留在聊天记录里，旁边打一个红色感叹号 ——
         否则用户只看到输入框清空了，不知道对方到底收没收到。 */
      const p=m.clientMsgId?pending.get(m.clientMsgId):null;
      if(p){pending.delete(m.clientMsgId);const msg={...p,msgId:8e15+(++failedSeq),at:new Date().toISOString(),failed:m.msg};chatCache.set(p.to,mergeMessages(chatCache.get(p.to)||[],[msg]));chatSave(p.to);if(chatWith===p.to)renderChat()}
    }status(m.msg);break;
  }}
  function mergeMessages(a,b){const map=new Map([...a,...b].map(x=>[x.msgId,x]));return [...map.values()].sort((x,y)=>x.msgId-y.msgId)}
  function addPeer(v){if(v.id===me?.id)return;peers.set(v.id,{...v,fromX:v.x,fromY:v.y,at:performance.now()});profiles.set(v.id,{...(profiles.get(v.id)||{}),...v,online:true})}
  function point(p,now){const t=Math.min(1,Math.max(0,(now-p.at)/120));return{x:p.fromX+(p.x-p.fromX)*t,y:p.fromY+(p.y-p.fromY)*t}}
  function updateNearby(){
    const platformOpen=!!CENTER.plat;
    $('mpTopBtns').hidden=platformOpen;
    if(platformOpen)$('mpBoard').hidden=true;
    const card=$('mpNearby');
    if(!MP.connected||anyTopPanelOpen()||!$('mpChat').hidden||!$('mpProfileShade').hidden){card.hidden=true;return}
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
  function renderBoard(){const list=$('mpBoardList');list.replaceChildren();if(!boardItems.length){list.innerHTML='<div class="mp-empty">还没有留言，说第一句吧。</div>';return}
    for(const a of [...boardItems].reverse()){const item=document.createElement('div');item.className='mp-post';const av=avatarEl(a.look,a.userId,a.online!==false),body=document.createElement('div'),meta=document.createElement('div'),content=document.createElement('div');body.className='mp-post-body';meta.className='mp-post-meta';meta.textContent=a.nickname+' · '+timeText(a.at);content.textContent=a.content;body.append(meta,content);item.append(av,body);list.append(item)}
  }
  function openBoard(){if(!MP.connected)return;closeTopPanels('mpBoard');$('mpBoard').hidden=false;unread=0;updateUnread();socketSend({type:'announce.list',limit:50});$('mpBoardInput').focus()}
  /* --- 公告面板 ---------------------------------------------------------- */
  function noticeTime(iso){const d=new Date(iso);if(Number.isNaN(d.getTime()))return '';const p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())}
  function noticeSeen(){try{return Number(localStorage.getItem(NOTICE_SEEN_KEY))||0}catch{return 0}}
  function updateNoticeDot(){const top=NOTICES.length?NOTICES[0].id:0;$('mpNoticeDot').hidden=!(top>noticeSeen())}
  function renderNotice(){const list=$('mpNoticeList');list.replaceChildren();
    if(!NOTICES.length){const e=document.createElement('div');e.className='mp-empty';e.textContent='还没有更新通知。';list.append(e);return}
    for(const n of [...NOTICES].sort((a,b)=>b.id-a.id)){const item=document.createElement('article');item.className='mp-notice';
      const head=document.createElement('div');head.className='mp-notice-head';
      const tag=document.createElement('span');tag.className='mp-notice-tag';tag.textContent='企划组';
      const t=document.createElement('b');t.textContent=n.title;
      const time=document.createElement('time');time.textContent=noticeTime(n.at);
      head.append(tag,t,time);
      const body=document.createElement('p');body.className='mp-notice-body';body.textContent=n.body;
      item.append(head,body);list.append(item)}}
  function openNotice(){closeTopPanels('mpNotice');$('mpNotice').hidden=false;
    try{const top=NOTICES.length?String(NOTICES[0].id):'0';localStorage.setItem(NOTICE_SEEN_KEY,top)}catch{}
    updateNoticeDot();renderNotice()}

  /* --- 右上角四块面板共用一个坑位 ------------------------------------------
     公告 / 留言板 / 每日任务 / 当前在线都是 right:16 top:53 那一格，
     同一时刻只许开一块（以前是两两互相 hidden，加到四块就成 12 条了）。 */
  const TOP_PANELS=['mpBoard','mpNotice','mpTask','mpOnline','mpPortal','mpPulse'];
  function closeTopPanels(keep=''){for(const id of TOP_PANELS)if(id!==keep)$(id).hidden=true;if(keep!=='mpPulse'){clearInterval(pulseTimer);pulseTimer=0}}
  function anyTopPanelOpen(){return TOP_PANELS.some(id=>!$(id).hidden)}

  /* --- 📋 每日任务 + 🏃 乐跑 ------------------------------------------------
     一天两份猫粮：① 当天第一次进来送一份（服务端在 /login、/session 里发）；
     ② 在新体育馆旁边那个操场跑满五圈，再送一份。
     喂猫扣一份 ⇒ `catFeed` 被包了一层（见文件末尾的 MPTask 那段）：
     没粮时返回 "nofood"，地图那边就改成"今日猫粮不够了"。
     乐跑的**判据**在下面 RUN 里，客户端只负责"我过了一圈"；发不发粮由服务端
     看它自己攒的位移、两圈间隔、以及当时人是不是站在操场里决定（server.py task.lap）。 */
  function taskRow(title,desc,ok){
    const row=document.createElement('div');row.className='mp-task-row'+(ok?' done':'');
    const tick=document.createElement('span');tick.className='mp-task-tick';tick.textContent=ok?'✓':'○';
    const text=document.createElement('div');text.className='mp-task-text';
    const b=document.createElement('b');b.textContent=title;
    const small=document.createElement('span');small.textContent=desc;
    text.append(b,small);
    const reward=document.createElement('span');reward.className='mp-task-reward';reward.textContent='+1 猫粮';
    row.append(tick,text,reward);return row;
  }
  function renderTask(){
    const body=$('mpTaskBody');if(!body)return;body.replaceChildren();
    /* 还没读到今天的账就先说"正在读取"：拿默认值画一张 0/2 的图，玩家会以为今天的粮没了。 */
    if(!taskState){const e=document.createElement('div');e.className='mp-empty';e.textContent='正在读取今天的任务…';body.append(e);return}
    const t=taskState;
    body.append(taskRow('每日登录',t.loginFood?'今天已经领到了':'进来就算完成',t.loginFood));
    body.append(taskRow('乐跑五圈',t.runFood?'今天已经跑完了':'已经跑了 '+t.laps+' / '+t.goal+' 圈',t.runFood));
    const food=document.createElement('div');food.className='mp-task-food';
    const label=document.createElement('span');label.textContent='今日猫粮';
    const num=document.createElement('b');num.textContent=t.foodLeft+' / '+t.foodMax+' 份';
    food.append(label,num);body.append(food);
    const tip=document.createElement('p');tip.className='mp-task-tip';
    tip.textContent='一份猫粮只能喂一次猫，同一只猫一天也只吃一次。操场在新体育馆旁边，绕着跑道按顺序跑满五圈就算完成乐跑。';
    body.append(tip);
  }
  function openTask(){closeTopPanels('mpTask');$('mpTask').hidden=false;renderTask();loadTask()}
  async function loadTask(){if(!token)return;try{setTask(await api('/task/me'))}catch{}}
  function setTask(state){if(!state)return;taskState=state;renderTask();runHudUpdate()}

  /* --- 🌀 传送门 ----------------------------------------------------------
     四颗按钮一键站到楼门口。位置**现算**：拿楼名在 CAMPUS 里找那一行，再用
     zoneRect 换算成像素，取矩形下沿正中 —— 全图的门都开在朝南那条边上，
     门口气泡 #dtip 也是钉在 rect.y + rect.h。
     ⚠️ 落点必须过 `blocked`（建筑、树、围墙）和 `canWalk`（校园边界）两道闸。
        主循环只放行"下一格不撞"的移动，把人塞进碰撞盒里就再也走不出来了。
        所以正中撞了就往两侧退，还不行就往下挪一档。
     ⚠️ `player` / `blocked` / `keys` / `CAMPUS` 都是地图那个 script 里的顶层
        声明，本文件是它之后的另一条 script，运行时读得到（加载期读会撞 TDZ，
        所以这里全写在点击回调里）。 */
  const PORTAL_SPOTS=[
    {tag:'🍜',name:'食堂阿姨',place:'学生1食堂门口',bld:'学生1食堂',tip:'到食堂门口了'},
    {tag:'💻',name:'算法哥',  place:'计算机中心门口',bld:'计算机中心',tip:'到计算机中心门口了 · 按 F 进去'},
    {tag:'📚',name:'学霸姐',  place:'逸夫楼门口',    bld:'逸夫楼',    tip:'到逸夫楼门口了 · 按 F 进去'},
    {tag:'🙈',name:'躲猫猫',  place:'逸夫楼门口',    bld:'逸夫楼',    tip:'到逸夫楼门口了 · 进楼走到公告栏前按 F'}
  ];
  function portalOpen(){
    closeTopPanels('mpPortal');
    const body=$('mpPortalBody');
    if(!body.childElementCount){
      for(const s of PORTAL_SPOTS){
        const b=document.createElement('button');
        b.type='button';b.className='mp-portal-row';
        /* 四个标签全是本文件里写死的常量，不含任何用户输入 ⇒ 与公告面板同一套写法。 */
        b.innerHTML='<span class="mp-portal-tag">'+s.tag+'</span>'
          +'<span class="mp-portal-text"><b>'+s.name+'</b><span>'+s.place+'</span></span>'
          +'<span class="mp-portal-go">去 →</span>';
        b.onclick=()=>portalGo(s);
        body.append(b);
      }
    }
    $('mpPortal').hidden=false;
  }
  function portalGo(s){
    if(typeof CAMPUS==='undefined'||typeof zoneRect!=='function'
       ||typeof player==='undefined'||typeof blocked!=='function'){
      status('地图还没准备好，等画面出来再点',false,10000);return;
    }
    const entry=CAMPUS.find(e=>e[0]===s.bld);
    if(!entry){status('地图上找不到「'+s.bld+'」',false,10000);return;}
    const r=zoneRect(entry),cx=r.x+r.w/2;
    let spot=null;
    for(const dy of [24,40,56,74,96]){
      for(const dx of [0,26,-26,52,-52,84,-84]){
        const x=cx+dx,y=r.y+r.h+dy;
        if(!blocked(x,y)&&(typeof canWalk!=='function'||canWalk(x,y))){spot={x,y};break;}
      }
      if(spot)break;
    }
    if(!spot){status('没能站到「'+s.bld+'」门口，换个地方再试',false,10000);return;}
    if(typeof CENTER!=='undefined'){
      if(CENTER.active&&typeof roomLeave==='function')roomLeave();
      else if(CENTER.plat&&typeof ctrClosePlatform==='function')ctrClosePlatform();
    }
    player.x=spot.x;player.y=spot.y;player.dir='up';
    if(typeof keys==='object'&&keys)for(const k in keys)keys[k]=0;
    if(window.MP&&MP.changeScene)MP.changeScene('out',spot.x,spot.y);
    closeTopPanels();
    status(s.tip,false,10000);
  }

  /* 跑道的几何：整个操场是 CAMPUS 里那格（1.0840,0.3889,1.0340,1.9090），
     世界像素按 450/1.1521=390.59 换算 ⇒ 包围盒 403.9×745.6。
     跑道是个圆角矩形，外沿半轴 196/367、跑道宽 86（取中线 ⇒ 153/324）、
     圆角 74；中线一圈约 1781 像素，按 200 像素/秒跑一圈约 9 秒、五圈约 45 秒。
     在跑道上顺时针排 12 个门，必须**按顺序**过：0→1→…→11→0 才算一圈。
     不按顺序假过、倒着跑、从中间抄近路，一律不算。 */
  const RUN=(()=>{
    const U=450/1.1521;                                  // 世界像素 / 英寸，与地图同一个常数
    const zx=1.0840*U,zy=0.3889*U,zw=1.0340*U,zh=1.9090*U;
    const cx=zx+zw/2,cy=zy+zh/2;
    const rx=zw/2-6-43,ry=zh/2-6-43,r=74;                 // 中线半轴 153/324，圆角 74
    const lh=rx-r,lv=ry-r,arc=Math.PI*r/2;
    const perimeter=4*lh+4*lv+4*arc;                      // 约 1781
    function point(s){
      s=((s%perimeter)+perimeter)%perimeter;
      if(s<2*lh)return{x:cx-lh+s,y:cy-ry};s-=2*lh;
      if(s<arc){const a=-Math.PI/2+s/r;return{x:cx+lh+r*Math.cos(a),y:cy-lv+r*Math.sin(a)}}s-=arc;
      if(s<2*lv)return{x:cx+rx,y:cy-lv+s};s-=2*lv;
      if(s<arc){const a=s/r;return{x:cx+lh+r*Math.cos(a),y:cy+lv+r*Math.sin(a)}}s-=arc;
      if(s<2*lh)return{x:cx+lh-s,y:cy+ry};s-=2*lh;
      if(s<arc){const a=Math.PI/2+s/r;return{x:cx-lh+r*Math.cos(a),y:cy+lv+r*Math.sin(a)}}s-=arc;
      if(s<2*lv)return{x:cx-rx,y:cy+lv-s};s-=2*lv;
      const a=Math.PI+s/r;return{x:cx-lh+r*Math.cos(a),y:cy-lv+r*Math.sin(a)};
    }
    const gates=[];for(let k=0;k<12;k++)gates.push(point(k*perimeter/12));
    /* 门半径 56：跑道宽 86（中线两侧各 43），贴内圈切弯时离中线会到 47 上下，
       45 会漏掉那几个门。相邻门相距 148，56 也压不到一起去。 */
    return {gates,gateR:56,x0:zx-80,x1:zx+zw+80,y0:zy-80,y1:zy+zh+80,cx,cy,rx,ry,r,perimeter};
  })();
  const run={inside:false,prog:-1,dir:0,start:-1,seen:0,lastInside:0};
  function runReset(){run.prog=-1;run.dir=0;run.start=-1;run.seen=0}
  function runTick(now){
    if(!MP.connected||scene!=='out'){run.inside=false;runReset();runHudUpdate();return}
    const px=player.x,py=player.y;
    if(px<RUN.x0||px>RUN.x1||py<RUN.y0||py>RUN.y1){
      /* 离开操场 30 秒才算断：出界一点点又回来不该把这一圈作废 */
      if(run.inside&&now-run.lastInside>30000)runReset();
      run.inside=false;runHudUpdate();return;
    }
    run.inside=true;run.lastInside=now;
    const near=i=>{const g=RUN.gates[i];return Math.hypot(px-g.x,py-g.y)<=RUN.gateR};
    if(run.prog<0){
      for(let i=0;i<12;i++)if(near(i)){run.prog=i;run.start=i;run.dir=0;run.seen=0;break}
    }else{
      /* dir=0 表示刚上道、方向还没定：两个方向都认，第一次往哪拐就定哪边。
         玩家多半是随手跑的，不该因为"跑反了"就白跑五圈。 */
      const options=run.dir===0?[(run.prog+1)%12,(run.prog+11)%12]:[(run.prog+run.dir+12)%12];
      for(const n of options){
        if(!near(n))continue;
        if(run.dir===0)run.dir=n===(run.prog+1)%12?1:-1;
        run.prog=n;
        if(n===run.start){
          if(run.seen>=11)completeLap();     // 回到起点且中间 11 个门都过过 ⇒ 一整圈
          run.seen=0;                        // 没跑全就重头数，别把半圈攒成整圈
        }else if(run.seen<11)run.seen++;
        break;
      }
    }
    runHudUpdate();
  }
  function completeLap(){
    if(taskState&&taskState.runFood)return;  // 今天的乐跑已经领过了，不用再上报
    socketSend({type:'task.lap'});
  }
  function runHudUpdate(){
    const el=$('mpRunHud');if(!el)return;
    const show=run.inside&&MP.connected&&scene==='out';
    const laps=taskState?taskState.laps:0,goal=taskState?taskState.goal:5;
    const done=!!(taskState&&taskState.runFood);
    const key=show?(done?'done'+laps:laps+':'+run.seen):'';
    if(key===runHudKey){el.hidden=!show;return}
    runHudKey=key;el.hidden=!show;
    if(show)$('mpRunText').textContent=done?('乐跑已完成 · 今天跑了 '+laps+' 圈'):('第 '+Math.min(laps+1,goal)+' / '+goal+' 圈 · 这一圈已过 '+run.seen+' / 12 个门');
  }

  /* --- 👥 当前在线 ---------------------------------------------------------
     只发头像和昵称，接口也只返回这两个字段（/api/mp/online）。
     列表里的头像是 `mp-avatar-static`、不带 data-user ⇒ 点了不会有任何反应，
     点不开主页也点不开形象 —— 这是用户明确要的"只看得到，点不开"。 */
  async function loadOnline(){
    if(!MP.connected||!token)return;
    try{const d=await api('/online');onlineUsers=d.users||[];$('mpOnlineNum').textContent=String(d.count||0);if(!$('mpOnline').hidden)renderOnline()}catch{}
  }
  function renderOnline(){
    const list=$('mpOnlineList');if(!list)return;list.replaceChildren();
    if(!onlineUsers.length){const e=document.createElement('div');e.className='mp-empty';e.textContent='现在没有人在线。';list.append(e);return}
    for(const u of onlineUsers){
      const cell=document.createElement('div');cell.className='mp-online-cell';
      cell.append(avatarEl(u.look,u.id,true,false));
      const name=document.createElement('span');name.className='mp-online-name';name.textContent=u.nickname;
      cell.append(name);list.append(cell);
    }
  }
  function openOnline(){
    if(!MP.connected){status('联机暂不可用',true);return}
    closeTopPanels('mpOnline');$('mpOnline').hidden=false;
    $('mpOnlineList').innerHTML='<div class="mp-empty">正在读取在线名单…</div>';
    loadOnline();
  }
  /* ⚠️ 只收面板、不停轮询：onlineTimer 是"进场就开、断线才停"的那一根，
     关掉面板就把它清了，右上角那个在线数会停在关面板的那一刻。 */
  function closeOnline(){$('mpOnline').hidden=true}
  /* --- 📊 全校动态 ----------------------------------------------------------
     四块一次拿全：算法哥刷题榜（大厅代为向 Java 要）、阿姨常被问的、学霸姐常被问
     到的知识点、老丁最近最多的失物。都是公开聚合数字，不带任何人的私聊内容。 */
  function pulseTime(s){const t=String(s||'');if(!t)return '';return timeText(/[zZ]|[+-]\d\d:?\d\d$/.test(t)?t:t+'+08:00')}
  function pulseSub(parent,text){const h=document.createElement('div');h.className='mp-pulse-sub';h.textContent=text;parent.append(h)}
  function pulseRows(parent,rows,valueOf,empty){
    if(!rows.length){if(empty){const p=document.createElement('p');p.className='mp-muted';p.textContent=empty;parent.append(p)}return}
    rows.forEach((r,i)=>{const p=document.createElement('p');p.className='mp-pulse-row';
      const k=document.createElement('span');k.className='mp-pulse-rank';k.textContent=(i+1)+'.';
      const t=document.createElement('span');t.className='mp-pulse-text';t.textContent=r.text;
      const n=document.createElement('b');n.className='mp-pulse-n';n.textContent=valueOf(r);
      p.append(k,t,n);parent.append(p)});
  }
  function renderPulse(d){
    const body=$('mpPulseBody');body.dataset.loaded='1';body.replaceChildren();
    const a=document.createElement('section');a.className='mp-pulse-sec';
    pulseSub(a,'💻 算法哥 · 最近 7 天');
    pulseRows(a,((d.agent||{}).leaders||[]).map(r=>({text:r.name||'玩家',solved:r.solved||0})),r=>r.solved+' 题',
      (d.agent&&d.agent.offline)?'算法哥这会儿没接上，稍后再看':'最近还没有人通过题目');
    const recent=((d.agent||{}).recent||[]).slice(0,5);
    if(recent.length){pulseSub(a,'刚刚通过');
      for(const r of recent){const p=document.createElement('p');p.className='mp-pulse-feed';
        const who=document.createElement('span');who.textContent=r.name||'玩家';
        const what=document.createElement('span');what.className='mp-muted';what.textContent=' 通过了 '+(r.problem||'一道题');
        const tm=document.createElement('span');tm.className='mp-pulse-time';tm.textContent=pulseTime(r.at);
        p.append(who,what,tm);a.append(p)}}
    body.append(a);

    const c=document.createElement('section');c.className='mp-pulse-sec';
    pulseSub(c,'🍚 食堂阿姨 · 最近被问');
    pulseRows(c,((d.cmr||{}).questions||[]).map(r=>({text:r.text,count:r.count})),r=>r.count+' 次','最近还没有人问阿姨');
    const dishes=(d.cmr||{}).dishes||[];
    if(dishes.length){pulseSub(c,'被点到的菜');pulseRows(c,dishes,r=>r.count+' 次')}
    body.append(c);

    const x=document.createElement('section');x.className='mp-pulse-sec';
    pulseSub(x,'🎓 学霸姐 · 常被问到的知识点');
    pulseRows(x,((d.xbg||{}).points||[]).map(r=>({text:r.text,count:r.count})),r=>r.count+' 次','最近还没有人问学霸姐');
    body.append(x);

    const l=document.createElement('section');l.className='mp-pulse-sec';
    pulseSub(l,'🛡️ 老丁 · 最近最多的失物');
    pulseRows(l,((d.ld||{}).items||[]).map(r=>({text:r.text,count:r.count,lost:r.lost,claim:r.claim})),
      r=>'挂失 '+r.lost+' · 认领 '+r.claim,'最近还没有新的挂失或认领');
    body.append(l);
  }
  function openPulse(){if(!MP.connected){status('联机暂不可用',true);return}closeTopPanels('mpPulse');$('mpPulse').hidden=false;loadPulse();clearInterval(pulseTimer);pulseTimer=setInterval(loadPulse,20000)}
  function closePulse(){$('mpPulse').hidden=true;clearInterval(pulseTimer);pulseTimer=0}
  async function loadPulse(){if(!token)return;const body=$('mpPulseBody');if(!body.dataset.loaded)body.textContent='正在读取…';
    try{const d=await api('/pulse');if(!$('mpPulse').hidden)renderPulse(d)}catch(e){if(!body.dataset.loaded)body.textContent='动态读取失败：'+e.message}}
  function chatProfile(id){return profiles.get(id)||{id,nickname:'玩家 '+id,look:L.fallback,online:false}}
  function renderChatTitle(){if(!chatWith)return;const p=chatProfile(chatWith);iconTo($('mpChatAvatar'),p.look,chatWith,p.online);$('mpChatTitle').replaceChildren();const b=document.createElement('b');b.textContent=p.nickname;const small=document.createElement('div');small.className='mp-muted';small.textContent=blocks.has(Number(chatWith))?'已拉黑 · 双方都发不了新消息':(p.online?(peers.has(chatWith)?'同场景在线':'在线 · 已离开当前场景'):'离线 · 上线后可收到消息');$('mpChatTitle').append(b,small);$('mpChatBlock').textContent=blocks.has(Number(chatWith))?'解除拉黑':'拉黑'}
  /* ---------- 私聊记录本地留底 ----------
     服务端才是唯一真相（记录全在库里，重登就重新拉一份），本地这份只干两件事：
     断线的那几秒先显示上次看到的，以及开窗口时不闪一下「还没有消息」。
     按「当前账号 : 对方 id」分开存，换号不会串。 */
  function chatStorage(){try{return JSON.parse(localStorage.getItem('mpChat:'+me?.id)||'{}')||{}}catch{return{}}}
  function chatSave(peer){try{const all=chatStorage();all[peer]=(chatCache.get(peer)||[]).slice(-80);localStorage.setItem('mpChat:'+me?.id,JSON.stringify(all))}catch{}}
  function chatRestore(){try{const all=chatStorage();for(const key in all){const items=Array.isArray(all[key])?all[key]:[];if(items.length)chatCache.set(Number(key),items)}}catch{}}
  function renderChat(){if(!chatWith)return;renderChatTitle();const log=$('mpChatLog'),stick=log.scrollHeight-log.scrollTop-log.clientHeight<48,previousScroll=log.scrollTop;log.replaceChildren();const data=chatCache.get(chatWith)||[];
    if(chatMore.get(chatWith)){const more=document.createElement('button');more.type='button';more.className='mp-secondary mp-chat-more';more.textContent='加载更早的消息';more.onclick=()=>{more.disabled=true;more.textContent='正在加载…';socketSend({type:'chat.history',withUser:chatWith,beforeId:chatOldest.get(chatWith)||undefined,limit:30})};log.append(more)}
    if(!data.length){const empty=document.createElement('div');empty.className='mp-empty';empty.textContent=MP.connected?'还没有消息，向对方打个招呼吧。':'暂时没有本机记录；恢复联机后会自动从服务器补全。';log.append(empty);return}
    let lastDay='',lastTime=0;for(const m of data){const at=new Date(m.at).getTime(),day=chatDay(m.at);if(day!==lastDay||at-lastTime>5*60*1000){const sep=document.createElement('div');sep.className='mp-chat-separator';sep.textContent=day+' '+chatTime(m.at);log.append(sep)}lastDay=day;lastTime=at;const mine=Number(m.from)===Number(me.id),p=mine?me:chatProfile(chatWith),wrap=document.createElement('div'),side=document.createElement('div'),bubble=document.createElement('div'),small=document.createElement('small');wrap.className='mp-message'+(mine?' mine':'')+(m.failed?' failed':'');bubble.className='mp-bubble';bubble.textContent=m.content;small.textContent=m.failed?'未送达 · '+chatTime(m.at):chatTime(m.at);side.className='mp-message-content';side.append(bubble,small);if(m.failed){const bang=document.createElement('span');bang.className='mp-fail-bang';bang.textContent='! '+m.failed;bang.title=m.failed;side.append(bang)}wrap.append(avatarEl(p.look,p.id,p.online,true,'查看个人主页'),side);log.append(wrap)}if(stick)log.scrollTop=log.scrollHeight;else log.scrollTop=previousScroll;
  }
  /* 断线时也允许打开：先用本地留底把窗口画出来，连上之后 welcome 那一段会再拉一次服务端记录。 */
  function openChat(id){if(!me||Number(id)===Number(me.id))return;chatWith=Number(id);$('mpBoard').hidden=true;$('mpNearby').hidden=true;$('mpChat').hidden=false;$('mpChatError').textContent='';renderChat();if(MP.connected)socketSend({type:'chat.history',withUser:chatWith,limit:30});$('mpChatInput').focus();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0}
  async function ensureProfile(id){const p=await api('/profile/'+id);profiles.set(id,p);return p}
  /* 学院不手填：名单由服务端下发（本校真实院系），下拉里选一个；
     账号里原来手写过的旧值保留成一项，但提示重新选择，保存时服务端只认名单内的值。 */
  let collegeList=null;
  async function colleges(){if(collegeList)return collegeList;try{collegeList=(await api('/colleges')).colleges||[]}catch{collegeList=[]}return collegeList}
  function fillColleges(sel,current){colleges().then(list=>{sel.replaceChildren();const blank=document.createElement('option');blank.value='';blank.textContent='（未选择）';sel.append(blank);for(const name of list){const o=document.createElement('option');o.value=name;o.textContent=name;sel.append(o)}if(current&&!list.includes(current)){const old=document.createElement('option');old.value=current;old.textContent=current+'（原来填的，请重新选择）';sel.append(old)}sel.value=current})}
  function closeProfile(){unmountAvatarViewers($('mpProfileBody'));profileUser=null;$('mpProfileShade').hidden=true}
  /* 个人主页的「📢 近期动态」：自己和别人都能看。
     内容 = 跟 NPC 的提问（只算真正进了模型的）、喂猫、乐跑、留言板发言，按时间倒序。
     数据只走 GET /activity/<id>，服务端已把被拦下的提问排除在外。 */
  function activityBlock(id){
    const box=document.createElement('details');box.className='mp-activity';
    box.innerHTML='<summary>📢 近期动态</summary><div class="mp-activity-body mp-muted">展开后加载…</div>';
    box.addEventListener('toggle',async()=>{if(!box.open)return;const body=box.querySelector('.mp-activity-body');if(body.dataset.loaded)return;body.textContent='正在加载…';
      try{const data=await api('/activity/'+id);body.dataset.loaded='1';body.replaceChildren();
        if(!data.items.length){const p=document.createElement('p');p.className='mp-muted';p.textContent='最近还没有动态';body.append(p);return}
        for(const it of data.items){const row=document.createElement('p'),when=document.createElement('span'),icon=document.createElement('span'),label=document.createElement('span');
          when.className='mp-his-time';when.textContent=timeText(it.at);
          icon.className='mp-act-icon';icon.textContent=it.icon;
          label.className='mp-act-label';label.textContent=it.label;
          row.append(when,icon,label,document.createTextNode(it.text));body.append(row)}
      }catch(e){body.textContent='动态加载失败：'+e.message}});
    return box;
  }
  function showProfile(id,historyPeer=0){id=Number(id);$('mpMenu').hidden=true;$('mpNearby').hidden=true;profileUser=id;const mine=id===me.id;$('mpProfile').classList.toggle('mp-other-profile',!mine);$('mpProfileShade').hidden=false;$('mpProfileTitle').textContent=mine?'个人中心':'个人主页';const body=$('mpProfileBody');unmountAvatarViewers(body);body.replaceChildren();
    ensureProfile(id).then(p=>{if($('mpProfileShade').hidden||profileUser!==id||!me)return;body.replaceChildren();const top=document.createElement('div');top.className='mp-profile-top';top.append(avatarEl(p.look,id,p.online,false));const details=document.createElement('div');const name=document.createElement('strong');name.textContent=p.nickname;const line=document.createElement('div');line.className='mp-muted';line.textContent=mine?'昵称不可修改 · ID '+id:(p.online?'● 在线 · ID '+id:'○ 离线 · ID '+id+' · '+(p.lastSeen?timeText(p.lastSeen):'暂无记录'));details.append(name,line);top.append(details);body.append(top);
      /* [QODER-FIX #16] 别人的主页按公开/隐藏设置显示：后端已把隐藏项清空，
         这里再按 visibility 兜一层（防止接口变化时把隐藏资料又渲染出来）。 */
      if(!mine){body.append(avatarViewer(p.look));const vis=p.visibility||{},info=document.createElement('dl');info.className='mp-public-info';for(const [key,label] of [['bio','签名'],['college','学院'],['grade','年级'],['tags','兴趣标签']]){if(vis[key]===false)continue;const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;const value=key==='tags'?(p.tags||[]):p[key];if(key==='tags'&&value.length){for(const tag of value){const chip=document.createElement('span');chip.className='mp-tag';chip.textContent=tag;dd.append(chip)}}else dd.textContent=key==='tags'?'未填写':(value||'未填写');row.append(dt,dd);info.append(row)}body.append(info);body.append(activityBlock(id));const button=document.createElement('button');button.className='mp-primary';button.textContent='💬 发起私聊';button.onclick=()=>{closeProfile();openChat(id)};body.append(button);return}
      const form=document.createElement('form');form.id='mpProfileForm';form.innerHTML=`<div class="mp-form-grid"><label class="wide">签名<input name="bio" class="mp-field" maxlength="40"></label><label>学院（从学校院系名单里选）<select name="college" class="mp-field" title="只能从下拉名单里选，不接受手填"></select></label><label>年级<select name="grade" class="mp-field"><option value="">未填写</option><option>大一</option><option>大二</option><option>大三</option><option>大四</option><option>硕士</option><option>博士</option></select></label><label class="wide">兴趣标签（输入后按逗号，最多 5 个）<span id="mpTagChips" class="mp-tag-list"></span><input name="tags" class="mp-field" maxlength="6" placeholder="输入标签后按逗号（,）生成"></label></div><fieldset class="mp-privacy"><legend>别人能看到的资料</legend><label><input type="checkbox" name="showBio"> 签名</label><label><input type="checkbox" name="showCollege"> 学院</label><label><input type="checkbox" name="showGrade"> 年级</label><label><input type="checkbox" name="showTags"> 兴趣标签</label></fieldset><p class="mp-muted mp-privacy-hint">勾选 = 公开；取消勾选后，其他玩家在你的主页看不到这一项。</p><p class="mp-muted mp-privacy-hint">形象（脸型、发型、穿搭）在左上角「🧍 玩家精灵」里设置。</p><div class="mp-profile-actions"><button class="mp-primary">保存资料</button><button type="button" id="mpLogout" class="mp-secondary">退出登录</button></div><div class="mp-error" id="mpProfileError" role="alert"></div>`;
      body.append(form);form.elements.bio.value=p.bio||'';fillColleges(form.elements.college,p.college||'');form.elements.grade.value=p.grade||'';for(const field of ['Bio','College','Grade','Tags'])form.elements['show'+field].checked=p.visibility?.[field.toLowerCase()]!==false;
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
      /* 聊天记录模块：留言板 / 私聊两个页签；私聊按对话对象逐个展开、每组一次多给 30 条，
         收和发都算（服务端 conversations 里带 mine 标记）。
         数据只走 GET /api/mp/history/me，那个接口只按当前 token 查库 ⇒ 别人的主页看不到这块。 */
      const history=document.createElement('details');history.className='mp-history';
      history.innerHTML='<summary>💬 我的聊天记录 · 仅自己可见</summary><div class="mp-history-body mp-muted">展开后加载记录…</div>';
      body.append(history);body.append(activityBlock(id));
      history.addEventListener('toggle',async()=>{if(!history.open)return;const box=history.querySelector('.mp-history-body');if(box.dataset.loaded)return;box.textContent='正在加载…';
        const groupByPeer=list=>{const map=new Map();for(const m of list){if(!map.has(m.to))map.set(m.to,{peer:m.to,nickname:m.nickname,items:[]});map.get(m.to).items.push(m)}return[...map.values()]};
        try{const data=await api('/history/me');box.dataset.loaded='1';box.replaceChildren();
          const tabs=document.createElement('div');tabs.className='mp-history-tabs';
          const board=document.createElement('section'),chats=document.createElement('section');chats.hidden=true;
          const mkTab=(label,pane)=>{const b=document.createElement('button');b.type='button';b.className='mp-secondary mp-history-tab'+(pane===board?' on':'');b.textContent=label;b.onclick=()=>{board.hidden=pane!==board;chats.hidden=pane!==chats;for(const t of tabs.children)t.classList.toggle('on',t===b)};tabs.append(b)};
          const bh=document.createElement('h4');bh.textContent='我发过的留言 · '+data.announcements.length+' 条';board.append(bh);
          if(!data.announcements.length){const empty=document.createElement('p');empty.className='mp-muted';empty.textContent='还没有发过留言';board.append(empty)}
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
          mkTab('📌 留言板 · '+data.announcements.length,board);mkTab('💬 私聊 · '+conversations.length,chats);
          box.append(tabs,board,chats);if(historyPeer){tabs.lastElementChild.click();const target=[...chats.querySelectorAll('details')].find(group=>Number(group.dataset.peer)===Number(historyPeer));if(target){target.open=true;target.scrollIntoView({block:'nearest'})}else{const empty=document.createElement('p');empty.className='mp-muted';empty.textContent='还没有与这位玩家的聊天记录';chats.append(empty)}}}catch(err){box.textContent=err.message}});
      if(historyPeer)history.open=true;
      $('mpLogout').onclick=async()=>{try{await api('/logout',{method:'POST',body:'{}'})}catch{}clearAccountState();showAuth()};
      form.onsubmit=async e=>{e.preventDefault();if(!commitTag())return;const visibility=Object.fromEntries(['Bio','College','Grade','Tags'].map(field=>[field.toLowerCase(),form.elements['show'+field].checked]));try{const updated=await api('/profile/me',{method:'PUT',body:JSON.stringify({look:L.norm(look),bio:form.elements.bio.value,college:form.elements.college.value,grade:form.elements.grade.value,tags,visibility})});me=updated;look=updated.look;profiles.set(me.id,updated);updateSelf();status('个人资料已保存');closeProfile()}catch(err){$('mpProfileError').textContent=err.message}};
    }).catch(err=>{body.textContent=err.message})}
  function showMenu(id,anchor){id=Number(id);if(id===me.id){showProfile(id);return}menuUser=id;menuAnchor=anchor;const menu=$('mpMenu');menuAt=performance.now();menu.hidden=false;const r=anchor.getBoundingClientRect(),h=80;menu.style.left=Math.max(6,Math.min(window.innerWidth-150,r.left))+'px';menu.style.top=(r.top>h+12?r.top-h-5:r.bottom+5)+'px'}
  /* [QODER-FIX #5/#8] 点击地图上的玩家精灵（没有 DOM 锚点，按点击坐标）弹出双选菜单
     （发起对话 / 个人主页），补回“点别人精灵直接私聊”的入口；不再一点就直接跳进私聊。 */
  function showMenuAt(id,x,y){id=Number(id);if(id===me.id){showProfile(id);return}menuUser=id;menuAnchor=null;const menu=$('mpMenu');menuAt=performance.now();menu.hidden=false;const h=80;menu.style.left=Math.max(6,Math.min(window.innerWidth-150,x-10))+'px';menu.style.top=(y>h+12?y-h-5:y+5)+'px'}
  function closeChat(){$('mpChat').hidden=true;$('mpReportShade').hidden=true;chatWith=null;$('mpChatInput').blur();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0}

  /* ---------- 举报 / 拉黑（2026-11-06） ----------
     举报：把理由和"最近一条私聊"的原话一起交给管理员，消息事后被删也留有快照。
     拉黑：双方都不能再发新的私聊；对方硬发的那条会在自己这边显示红色感叹号。 */
  function authHeaders(){return {'Content-Type':'application/json','Authorization':'Bearer '+token}}
  function openReport(){
    if(!chatWith||!me)return;
    $('mpReportTitle').textContent='举报 '+chatProfile(chatWith).nickname;
    $('mpReportHint').textContent='举报会连同最近一条私聊的内容一起交给管理员。恶意举报一样会被处理。';
    $('mpReportReason').value='';$('mpReportError').textContent='';
    $('mpReportShade').hidden=false;$('mpReportReason').focus();
  }
  function closeReport(){$('mpReportShade').hidden=true}
  function submitReport(){
    const reason=$('mpReportReason').value.trim();
    if(reason.length<2){$('mpReportError').textContent='请写清楚举报理由（至少 2 个字）';return}
    const list=chatCache.get(Number(chatWith))||[];
    const last=[...list].reverse().find(x=>!x.failed);
    $('mpReportSubmit').disabled=true;
    fetch('/api/mp/report',{method:'POST',headers:authHeaders(),body:JSON.stringify({targetId:Number(chatWith),reason,msgId:last?Number(last.msgId)||0:0})})
      .then(r=>r.json().catch(()=>({})).then(d=>{if(!r.ok)throw new Error(d.error||'提交失败');return d}))
      .then(d=>{closeReport();status(d.msg||'举报已提交，管理员会尽快受理')})
      .catch(e=>{$('mpReportError').textContent=e.message})
      .finally(()=>{$('mpReportSubmit').disabled=false});
  }
  function toggleBlock(){
    if(!chatWith)return;
    const id=Number(chatWith),on=!blocks.has(id);
    if(on&&!confirm('拉黑 '+chatProfile(id).nickname+'？拉黑后你们双方都发不了新的私聊。'))return;
    fetch('/api/mp/block',{method:'POST',headers:authHeaders(),body:JSON.stringify({targetId:id,on})})
      .then(r=>r.json().catch(()=>({})).then(d=>{if(!r.ok)throw new Error(d.error||'操作失败');return d}))
      .then(d=>{blocks=new Set((d.blocked||[]).map(Number));renderChatTitle();status(on?'已拉黑，双方都不能再发私聊':'已解除拉黑')})
      .catch(e=>{$('mpChatError').textContent=e.message});
  }
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
    closeTopPanels();$('mpChat').hidden=true;$('mpProfileShade').hidden=true;$('mpNearby').hidden=true;closeLookPanel();$('mpGuard').hidden=false;
    const log=$('mpGuardLog');
    if(!log.childElementCount)guardLine('guard','我到啦，正在接通对话…');
    for(const old of log.querySelectorAll('button')){const box=old.closest('.mp-gcard,.mp-guard-opts,.mp-guard-line');(box||old.parentNode).remove()}
    for(const shell of log.querySelectorAll('.mp-guard-cards'))if(!shell.childElementCount)shell.remove();
    try{
      const result=await MP.ensureNpc('ld');
      if(result!=='ok'){guardFail(result==='auth'?'登录票据没换成，请重新登录后再呼叫老丁':'当前站点服务器的老丁服务暂不可用，请稍后重试');return}
      if(!guardReady){$('mpGuardBridge').src='/ld/?v=20261106pulse';if(!await guardWaitReady(8000)){guardFail('桥没响应：老丁的页面没加载出来，点重试再连一次');return}}
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
    closeProfile();closeLookPanel();GUARD.summoned=true;GUARD.summonRepath=0;status('已呼叫老丁，他正沿路赶来',true);
  }
  /* runTick 挂在 onFrame 最前面：乐跑要按帧看位置，不能跟那个 100ms 一次的 move 上报共用节流。 */
  const MP={connected:false,get look(){return look},sprite:L.sprite,crouch:L.crouch,requireLogin(){connectedUI(false);showAuth('请在大厅重新登录')},async ensureNpc(kind){if(!token&&soloMode){try{await soloSignIn()}catch(e){return 'auth'}}if(!token)return 'auth';try{const t=await api('/npc/'+kind,{method:'POST',body:'{}'});if(kind==='xbg')localStorage.setItem('xbg_token',t.token);if(kind==='ld')localStorage.setItem('ld_token',t.token);if(kind==='agent'){localStorage.setItem('token',t.user.token);localStorage.setItem('user',JSON.stringify({id:t.user.userId,username:t.user.username,nickname:me.nickname,role:t.user.role}))}return 'ok'}catch(e){return /重新登录/.test(e.message)?'auth':'down'}},changeScene(next,x,y){scene=next;peers.clear();if(MP.connected)socketSend({type:'scene.change',to:next,x,y})},onFrame(now){runTick(now);if(!MP.connected||now-moveAt<100)return;moveAt=now;updateNearby();const p=myPos(),key=[scene,p.x.toFixed(1),p.y.toFixed(1),p.dir].join('|');if(key!==lastMove){socketSend({type:'move',...p});lastMove=key}},appendOutdoorPeers(list){if(!MP.connected||scene!=='out')return;for(const p of [...peers.values()].sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y)).slice(0,30)){const v=point(p,performance.now());if(Math.abs(v.x-cam.x)>viewW+30||Math.abs(v.y-cam.y)>viewH+30)continue;const step=performance.now()-p.at<500?Math.floor(performance.now()/135)%4:4;list.push({img:L.sprite(p.look,p.dir,step),ax:CH_AX,ay:CH_AY,x:v.x,y:v.y,baseY:v.y,clip:Math.round(CH_H*lakeSubmerge(v.x,v.y)),ch:1})}},appendIndoorPeers(who,g){if(!MP.connected||scene==='out')return;for(const p of [...peers.values()].slice(0,30)){const v=point(p,performance.now()),step=performance.now()-p.at<500?Math.floor(performance.now()/135)%4:4;who.push({y:v.y,f:()=>ctrDrawChar(g,L.sprite(p.look,p.dir,step),v.x,v.y)})}},drawLabels(){
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
  /* 打开与某位玩家的私聊面板（大厅内部本来就用它；挂到 MP 上方便别的模块和自动化测试调用） */
  MP.openChat=openChat;
  MP.guardArrived=()=>{status('老丁已到达');openGuardTalk()};
  MP.callGuard=callGuard;
  window.MP=MP;
  /* --- 猫粮：把地图的喂猫动作接上每日额度 -------------------------------------
     地图那边喂猫走 `catFeed(c)`（"ok" 吃上了 / "cold" 今天喂过 / "none" 猫不在），
     界面在 doFeed() 里按返回值说话。这里包一层：
       · 粮不够 ⇒ 直接返回 "nofood"：粮不落地、猫也没吃（地图会换成"今日猫粮不够了"）；
       · 真喂上了（"ok"）才扣一份，并把账记到服务端（POST /api/mp/task/feed）。
     ⚠️ 顺序不能反：先调原函数再判额度，就成"猫已经吃上了才知道今天没粮"。
     单机游览时 taskState 是 null ⇒ 不拦，跟以前一样随便喂。 */
  function takeFood(){
    if(!taskState)return;
    taskState.foodLeft=Math.max(0,taskState.foodLeft-1);
    taskState.foodUsed=(taskState.foodUsed||0)+1;
    renderTask();
    api('/task/feed',{method:'POST',body:'{}'}).then(setTask).catch(err=>{status(err.message);loadTask()});
  }
  /* 包两层是有原因的：`cat-dex/cat-dex.js` 比本脚本**后**加载，它会把当时的
     window.catFeed 存起来再换自己的一份（图鉴的好感度就是在那一层加的），
     并且"原函数不是 ok 就自己补一次放粮"。所以：
       · 现在包一层，管住地图原生的那份；
       · load 之后再包一层，把图鉴那份也套进来 —— 没粮时最外层直接返回 'nofood'，
         图鉴连它自己的补放粮都走不到，猫不会白吃。
     feedDepth 保证"扣一份"只在最外层发生一次（否则里外各扣一次，一份粮变两份）。 */
  let feedDepth=0;
  function wrapCatFeed(){
    const inner=window.catFeed;
    if(typeof inner!=='function'||inner.__mpFoodGuard)return;
    const guarded=function(c){
      if(taskState&&taskState.foodLeft<=0)return 'nofood';
      const outer=feedDepth===0;
      feedDepth++;
      let r;
      try{r=inner(c)}finally{feedDepth--}
      if(outer&&r==='ok'&&taskState)takeFood();
      return r;
    };
    guarded.__mpFoodGuard=true;
    window.catFeed=guarded;
  }
  wrapCatFeed();
  window.addEventListener('load',wrapCatFeed);
  window.MPTask={noFood(){return !!(taskState&&taskState.foodLeft<=0)},refresh:loadTask};
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
  $('mpSelf').onclick=()=>showProfile(me.id);
  $('mpBoardToggle').onclick=()=>{$('mpBoard').hidden?openBoard():$('mpBoard').hidden=true};
  $('mpBoardClose').onclick=()=>$('mpBoard').hidden=true;
  /* 公告面板在**联机与否**都开得起来：它是一张本地写死的通知表，不依赖 socket。 */
  $('mpNoticeToggle').onclick=()=>{$('mpNotice').hidden?openNotice():$('mpNotice').hidden=true};
  $('mpNoticeClose').onclick=()=>$('mpNotice').hidden=true;
  $('mpTaskToggle').onclick=()=>{$('mpTask').hidden?openTask():$('mpTask').hidden=true};
  $('mpTaskClose').onclick=()=>$('mpTask').hidden=true;
  $('mpPortalToggle').onclick=()=>{$('mpPortal').hidden?portalOpen():$('mpPortal').hidden=true};
  $('mpPortalClose').onclick=()=>$('mpPortal').hidden=true;
  $('mpOnlineToggle').onclick=()=>{$('mpOnline').hidden?openOnline():closeOnline()};
  $('mpOnlineClose').onclick=closeOnline;
  $('mpPulseToggle').onclick=()=>{$('mpPulse').hidden?openPulse():closePulse()};
  $('mpPulseClose').onclick=closePulse;
  updateNoticeDot();
  $('mpSprite').onclick=openLookPanel;$('mpSummonGuard').onclick=callGuard;
  $('mpBoardForm').onsubmit=e=>{e.preventDefault();const input=$('mpBoardInput'),content=input.value.trim(),error=$('mpBoardError'),button=$('mpBoardForm').querySelector('button');if(!content||content.length>200){error.textContent='留言须为 1 至 200 字';return}/* [QODER-FIX #7] 上一条没收到服务器确认时，旧代码在这里静默 return，
     按钮又一直是 disabled ⇒ 用户看到的就是“点发送没反应”。现在给提示，并加超时兜底。 */
    if(boardSending){error.textContent='上一条留言还在发送，请稍候…';return}
    const id=clientId();if(!socketSend({type:'announce.post',content,clientMsgId:id})){error.textContent='当前未连接，留言没有发送';return}
    boardSending=id;button.disabled=true;error.textContent='正在发送…';
    clearTimeout(boardTimer);boardTimer=setTimeout(()=>{if(boardSending!==id)return;boardSending='';button.disabled=false;error.textContent='发送超时：联机通道没有确认，请检查网络后重试'},8000)};
  $('mpChatClose').onclick=closeChat;$('mpChatHistory').onclick=()=>{if(chatWith)showProfile(me.id,chatWith)};
  $('mpChatReport').onclick=openReport;$('mpChatBlock').onclick=toggleBlock;
  $('mpReportClose').onclick=closeReport;$('mpReportSubmit').onclick=submitReport;
  $('mpReportShade').onclick=e=>{if(e.target.id==='mpReportShade')closeReport()};$('mpChatForm').onsubmit=e=>{e.preventDefault();const input=$('mpChatInput'),content=input.value.trim();if(!content||!chatWith)return;const clientMsgId=clientId();pending.set(clientMsgId,{from:me.id,to:chatWith,content,fromNickname:me.nickname,look,clientMsgId});if(socketSend({type:'chat.send',to:chatWith,content,clientMsgId})){input.value='';$('mpChatError').textContent='';input.focus()}else pending.delete(clientMsgId)};
  $('mpChatInput').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){e.preventDefault();$('mpChatForm').requestSubmit()}};
  $('mpProfileClose').onclick=closeProfile;$('mpProfileShade').onclick=e=>{if(e.target===$('mpProfileShade'))closeProfile()};
  $('mpLookClose').onclick=closeLookPanel;$('mpLookShade').onclick=e=>{if(e.target===$('mpLookShade'))closeLookPanel()};
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
  window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==$('mpGuardBridge').contentWindow)return;if(e.data?.type==='campus.guard.ready'){guardReady=true;guardConnectingDone();return}if(e.data?.type==='campus.guard.event'){const d=e.data;if(d.kind==='lost'||d.kind==='claim')api('/pulse/event',{method:'POST',body:JSON.stringify({kind:d.kind,item:String(d.category||'').slice(0,20)})}).catch(()=>{});return}if($('mpGuard').hidden)return;if(e.data?.type==='campus.guard.reply')guardLine(e.data.who==='sys'?'sys':'guard',String(e.data.text||''));else if(e.data?.type==='campus.guard.ui')guardUi(e.data.ui)});
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
  window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('mpMenu').hidden)$('mpMenu').hidden=true;else if(!$('mpProfileShade').hidden)closeProfile();else if(!$('mpLookShade').hidden)closeLookPanel();else if(!$('mpChat').hidden)closeChat();else if(!$('mpBoard').hidden)$('mpBoard').hidden=true;else if(!$('mpTask').hidden)$('mpTask').hidden=true;else if(!$('mpOnline').hidden)closeOnline();return}if(e.target.closest?.('#mpRoot')){for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0;return}if(e.key.toLowerCase()==='p'&&MP.connected){showProfile(me.id);e.preventDefault();e.stopImmediatePropagation()}},true);
  root.addEventListener('keydown',e=>{e.stopPropagation();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0});
  root.addEventListener('keyup',e=>{e.stopPropagation();for(const k in keys)keys[k]=0;for(const k in CKEYS)CKEYS[k]=0});
  window.addEventListener('online',()=>{if(token&&!MP.connected&&!soloMode){clearTimeout(reconnectTimer);retries=0;connect()}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&token&&!MP.connected&&!soloMode&&(!ws||ws.readyState>1)){clearTimeout(reconnectTimer);connect()}});
  if(location.protocol==='file:'){status('当前为单机模式');return}
  try{token=localStorage.getItem(tokenKey)||''}catch{}
  if(token){api('/session',{method:'POST',body:'{}'}).then(()=>api('/profile/me')).then(p=>{if(p.admin){location.replace('/admin.html');return}me=p;look=p.look;profiles.set(p.id,p);localStorage.setItem('mpNickname',p.nickname);showLookPrompt=L.isDefault(look);connect()}).catch(()=>{clearAccountState();showAuth()})}else showAuth();
})();
