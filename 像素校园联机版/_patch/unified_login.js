/* --- 7.5.14 统一登录（二期 W1）：全局一张票，四家免登 --------------------
   一期这一大段是「地图拿账号密码去四家各登一次」，所以留下四套
   `*Sync` / 四份明文 `*_cred` / 一个 `ctrFrameOnLogin` 踹醒补丁。
   二期按任务书 §3.1.2 把这些**连根拔掉**：

     ① 主站只登一次（昵称 + 密码，8081 签发主 JWT）；
     ② 8081 在后台替这个人向四家换票，写成**路径限定的 HttpOnly cookie**
        （/xbg、/ld、/cmr、/agent），地图这边**不经手任何票**；
     ③ iframe 走同源代理加载 ⇒ 浏览器自动带 cookie ⇒ 开局即已登录；
     ④ 票过期 ⇒ 宿主静默换一次票再问一遍（§9.2 铁律 3），
        四家**都没有登录页**，所以任何情况下都不会在抽屉里弹表单。

   ⚠️ 主票（`localStorage.token`）与 `campus_cred` 那类明文口令**都不再写四家的**；
      四家的票是 HttpOnly，JS 读不到，也不需要读。

   ⭐ 第四十六轮（登录态全局可用）有一半落在**这一段之外**，这里只登记名字，改的时候
      两边都要动，别只改这一份：
        · 00_head 的 CSS：`#ctrGate` / `#cgBox` / `#cgT` / `#cgMsg` / `#cgRow` 一整套，
          加上登录门那批打磨（`#lgBox` 进场动画、`#lgRow input.bad`、`#lgMsg.ok`、`#lgSwitch`）；
        · DOM 段（7.5.4）：`ctrGate` / `cgT` / `cgMsg` / `cgRetry` / `cgBack` 五个零件；
        · 7.5.13：`ctrGateShow` / `ctrGateHide` / `ctrGateRetry` / `CG_R`，
          以及 `ctrOpenPlatform` 的新口径 —— **闸门没过就不设 src**；
        · 7.5.15：抽屉里没页面时 iframe 接不到 Esc，闸门亮着时由地图这边代收；
        · 四个 App 注册对象各加一个 `mpKey`（告示上要说"学霸姐/老丁/食堂阿姨/刷题平台"，
          而不是"保卫处"这种地名）。 */
const MP_SERVICES = {
  /* probe 就是那家自己开机用来恢复会话的接口 —— 问它本人，不猜。 */
  xbg:    { label: "学霸姐",  probe: "/xbg/api/me",    cookie: true  },
  ld:     { label: "老丁",    probe: "/ld/api/me",     cookie: true  },
  cmr:    { label: "食堂阿姨", probe: "/cmr/api/me",   cookie: true  },
  /* 刷题平台读的是主 JWT（Bearer 头），而且它的 401 有**两种**回法：
     过滤器链直接 HTTP 401，或控制器 HTTP 200 + `{code:401}`（GlobalExceptionHandler），
     所以 `code: true` —— 只看 r.ok 会把后者误判成"活着"。 */
  campus: { label: "刷题平台", probe: "/api/user/info", cookie: false, code: true }
};
function mpSet(key, st) { CENTER[key] = st; hudUserTick(); }
/* 主票的过期时间：JWT 第二段里的 `exp`（秒）。解不出来就当它永不过期 ——
   ⚠️ 宁可不拦，也别因为一次 base64 抖动把人踢下线。 */
function mpJwtExp(tok) {
  const p = String(tok || "").split(".")[1];
  if (!p) return 0;
  try {
    const b = p.replace(/-/g, "+").replace(/_/g, "/");
    const j = JSON.parse(atob(b + "=".repeat((4 - b.length % 4) % 4)));
    return j && typeof j.exp === "number" ? j.exp : 0;
  } catch (e) { return 0; }
}
/* ⭐ 第四十六轮：读票的地方**顺手把过期的票清掉**。
   主票躺在 `localStorage` 里不会自己死：8081 认不出它，四家的票也就再也续不上，
   可 HUD 还写着"已登录"、点哪间房都被闸门挡回来 —— 嘴上说登着、身上没票，
   用户看到的就是"我明明登录了却说没登录"。在这里一次性戳破，后面每一条路都干净。 */
/* ⭐ 票在这一刻被当场识破（过期）。光清 `localStorage` 不够 —— 抽屉还开着、登录门还藏着，
   人看到的是"地图照常跑，但哪间房都进不去"。这里当场把场面收回来：
   收抽屉（摘掉 iframe，绝不留一张刷不出来的页面）→ 重画 HUD → 摆回登录门。
   ⚠️ 不会有递归：本函数里每一次 `mpToken` 再进来时票已被删，走的是开头那条 `return ""`。 */
function mpExpiredNotice() {
  if (CENTER.plat) ctrClosePlatform(true);
  hudUserTick();
  loginGate();
}
function mpToken() {
  let t = "";
  try { t = localStorage.getItem("token") || ""; } catch (e) { return ""; }
  if (!t) return "";
  const exp = mpJwtExp(t);
  if (exp && exp * 1000 <= Date.now()) {
    try { localStorage.removeItem("token"); localStorage.removeItem("user"); } catch (e) {}
    mpExpiredNotice();
    return "";
  }
  return t;
}

/* 一次换四张票。`force` 是"票刚被证明不活了"时再来一遍用的。
   ⚠️ 并发去重：四条闸门可能同时扑上来（进楼时按 C、HUD 也在探），
      合并成**一个**在途请求，免得对 8081 打四次 exchange。 */
let MP_EXCHANGE = null;
/* 最近一次换票时**各家自己回的状态**（`ok` / `down`）。
   光看探针分不出"没开"和"没登进去"：8010 没跑时 Vite 代理回的是 **500**，
   `fetch` 这一层是成功的 ⇒ `mpAsk` 只能说"不认得你"（no），HUD 就会把"她根本没开"
   误报成"没登进去"。8081 是逐家去换票的，它知道哪一家连不上 —— 把那份结果留在这儿。 */
let MP_PEER = {};
function mpExchange(force) {
  const tok = mpToken();
  if (!tok) return Promise.resolve("skip");
  if (MP_EXCHANGE) return MP_EXCHANGE;
  MP_EXCHANGE = fetch("/api/auth/exchange", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + tok },
    credentials: "same-origin"
  }).then(r => {
    if (!r.ok) return "skip";
    /* 读不到 body 不算失败：票已经种下了，只是少了"哪家没开"这条情报。 */
    return r.json().then(j => { MP_PEER = (j && j.data) || {}; return "ok"; }, () => "ok");
  }).catch(() => "down")
    .then(st => { MP_EXCHANGE = null; if (force && st === "ok") return "ok"; return st; });
  return MP_EXCHANGE;
}

/* 问某一家："带着你现在这身 cookie（或主票），我还认得你吗？" */
function mpAsk(key) {
  const svc = MP_SERVICES[key];
  const h = svc.cookie ? {} : { "Authorization": "Bearer " + mpToken() };
  return fetch(svc.probe, { headers: h, credentials: "same-origin" }).then(r => {
    if (!r.ok) return "no";
    if (!svc.code) return "yes";
    return r.json().then(j => (j && j.code === 200) ? "yes" : "no").catch(() => "no");
  }).catch(() => "down");
}

/* ⭐ 闸门（任务书 §9.2 铁律 3 的实现）。返回值：
     "ok"    —— 已登录，iframe 可以放心加载
     "skip"  —— 换过票还是不认，如实报告（HUD 挂尾巴），**但绝不弹登录框**
     "down"  —— 那家服务连不上（和"没登录"是两件事，提示语不同）
   ⚠️ 只有 `campus` 这一家失败会**落回主站登录门**：主票都没了，
      另外三家的票也不可能续上，那才是真的需要重新登录。 */
function mpEnsure(key) {
  return mpAsk(key).then(st => {
    if (st === "yes") return "ok";
    if (st === "down") return "down";
    return mpExchange(true).then(x => {
      if (x === "down") return "down";
      return mpAsk(key).then(s2 => s2 === "yes" ? "ok"
                          : (MP_PEER[key] === "down" ? "down" : "skip"));
    });
  }).then(mark => {
    mpSet(key, mark);
    if (mark === "skip" && key === "campus") loginGate();
    return mark;
  });
}
/* 四家各留一个同名包装 —— 一期那四处 App 注册（`ensure: function(){ return xbgEnsure(); }`）
   和探针造负对照的写法都靠名字挂钩，**不改它们**。 */
function xbgEnsure()    { return mpEnsure("xbg"); }
function ldEnsure()     { return mpEnsure("ld"); }
function cmrEnsure()    { return mpEnsure("cmr"); }
function campusEnsure() { return mpEnsure("campus"); }

/* 开机补票：手里有主票就先把四张 cookie 焐热，人不用等到按 C 才换。
   ⚠️ 不 await：启动器那几家服务可能还在读索引，卡住地图启动是本末倒置。 */
let MP_LASTSYNC = 0;
function mpBootSync() {
  MP_LASTSYNC = Date.now();
  if (!mpToken()) {
    /* 票没了（包括刚刚被 `mpToken` 识破并清掉的那张过期票）。
       ⚠️ 抽屉正开着的话**当场收掉**：那张页面上的会话是靠票续的，票一没，
          它下一次请求就是 401，用户会看见抽屉里慢慢变成一张死页。 */
    if (CENTER.plat) ctrClosePlatform(true);
    hudUserTick();
    loginGate();
    return;                               // 停在登录门上，doLogin 那条路自己会换
  }
  mpExchange(true).then(st => {
    if (st !== "ok") return;
    for (const k in MP_SERVICES) { if (k !== "campus") mpAsk(k).then(a => { if (a === "no") mpEnsure(k); }); }
  });
}

/* ⭐ 第四十六轮：**登录态自己维护自己**，不等人按 C 才发现票凉了。
   三条路都会把票焐回来：
     ① 切回这个标签页（`visibilitychange` / `focus`）—— 挂机一会儿再回来的最常见路径；
     ② 别的标签页登录了（`storage` 里 `token` 从无到有）—— 同源代理下 `localStorage` 是共享的，
        刷题平台那个抽屉里的登录也会写到这里；
     ③ 别的标签页登出了（`token` 被清）—— 四家的票已被 8081 一并作废（§9.2 铁律 4），
        地图这边必须同步变回登录门，不能留着"已登录"的 HUD 骗人。
   ⚠️ 8 秒节流：`focus` 在切窗口、点任务栏时反复触发，不节流就是对 8081 打点射。 */
function mpAutoSync() {
  /* 有票就补票；没票的话 `mpToken()` 自己会在**识破过期的那一刻**收场（`mpExpiredNotice`），
     这里不必再判第二遍。
     ⚠️ 本来人就停在登录门上时一个字都不能做：`loginGate()` 会清空正在输入的框，
        用户切出去看一眼别的东西再回来，密码白打了，那就是新 bug。
        而 `mpToken()` 只在"手里真有一张过期票"时才叫那一嗓子，登录门上没票 ⇒ 不动。 */
  if (!mpToken()) return;
  if (Date.now() - MP_LASTSYNC < 8000) return;
  mpBootSync();
}
document.addEventListener("visibilitychange", () => { if (!document.hidden) mpAutoSync(); });
window.addEventListener("focus", mpAutoSync);
window.addEventListener("storage", ev => {
  const k = ev && ev.key;
  if (k !== "token" && k !== "user") return;      // 猫宠、缩放那些本地键不关这里的事
  if (mpToken()) {
    MP_LASTSYNC = 0;
    mpBootSync();                                  // 别的标签页登进来了 ⇒ 这边立刻把票焐上
    if (loginEl && !loginEl.hidden) loginGate();   // 有票了就把登录门收掉（这条路径不会清输入框）
  } else if (CENTER.plat) ctrClosePlatform(true);  // 那边登出了 ⇒ 票已全废，抽屉留着就是死页
  hudUserTick();
}, false);

/* --- 主站登录门（全站唯一的一处口令输入，§9.2 铁律 1） ------------------- */
function campusLoginPost(u, p) {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: u, password: p })
  }).then(r => r.json());
}
/* 二期注册：昵称 + 密码，**没有邮箱字段**（§3.1.1）。昵称 2~16 字、密码 ≥8 位。 */
function campusRegisterPost(u, p) {
  return fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname: u, password: p })
  }).then(r => r.json());
}
/* 字段名必须与 campus_game 的 `stores/user.js:31-36` 一致（`{id,username,nickname,role}`）——
   那边路由守卫读 `user.role`，名字错了管理后台会被踢出来。 */
function campusWriteSession(d) {
  try {
    localStorage.setItem("token", d.token);
    localStorage.setItem("user", JSON.stringify({
      id: d.userId, username: d.username, nickname: d.nickname, role: d.role
    }));
  } catch (e) {}
}

function hudUserTick() {
  if (!hudUser) return;
  let u = null;
  try { u = JSON.parse(localStorage.getItem("user") || "null"); } catch (e) {}
  /* ⚠️ 先问票、再报名字：`user` 那份缓存会跟着过期票留下来，
     只读它就等于 HUD 挂着"已登录 · ××"，人却一间房都进不去。
     `mpToken()` 这一步顺带把过期票清了（见上），这里只是不再替它宣传。 */
  let t = (mpToken() && u && (u.nickname || u.username)) ? ("已登录 · " + (u.nickname || u.username)) : "";
  /* 尾巴只在"主站登上了、那家结果也回来了"时才挂 —— 主站都没登就什么都别说。
     "没开起来"是服务没跑，"没登进去"是票没换上，两件事别混成一句。 */
  if (t) for (const k in MP_SERVICES) {
    const st = CENTER[k];
    if (!st || st === "ok") continue;
    t += "　·　" + MP_SERVICES[k].label + (st === "down" ? "没开起来" : "没登进去");
  }
  hudUser.textContent = t;
  if (lgOut) lgOut.hidden = !t;
}

/* 两个预设账号按钮：**只绑一次**（加载期）。
   ⚠️ 绝不能放进 `loginGate()` 里 —— 那个函数每登出一次就会被再调一次，
      于是每轮往同一批按钮上再叠一条监听。 */
(function bindQuick() {
  if (lgSwitch) lgSwitch.addEventListener("click", () => lgSetMode(LG_MODE === "register" ? "login" : "register"));
  /* 密码显隐开关：只换 type、不动值 —— 切回打码时原来那串还在。
     ⚠️ 和 #lgQuick 一样只绑一次；别搬进 loginGate()，那函数每登出一次就被再调一次。 */
  if (lgPwEye && lgP) lgPwEye.addEventListener("click", () => {
    const show = lgP.type === "password";
    lgP.type = show ? "text" : "password";
    lgPwEye.textContent = show ? "隐藏" : "显示";
    lgPwEye.title = show ? "隐藏密码" : "显示密码";
    lgP.focus();
  });
  if (!loginEl) return;
  const btns = loginEl.querySelectorAll("#lgQuick button");
  for (const b of btns) {
    const on = () => {
      for (const o of btns) o.classList.remove("on");
      b.classList.add("on");
      if (lgU) lgU.value = b.getAttribute("data-u") || "";
      if (lgP) lgP.value = b.getAttribute("data-p") || "";
      if (lgMsg) lgMsg.textContent = "";
    };
    b.addEventListener("click", on);
  }
})();

/* 门上的模式：登录 ↔ 注册（二期新注册入口，§3.1.1「不填邮箱」）。 */
let LG_MODE = "login";
function lgSetMode(mode) {
  LG_MODE = mode === "register" ? "register" : "login";
  const reg = LG_MODE === "register";
  if (lgGo) lgGo.textContent = reg ? "注册并进入像素校园" : "进入像素校园";
  if (lgSwitch) lgSwitch.textContent = reg ? "已有账号？去登录" : "没有账号？注册一个";
  /* 登录态那句提示按需求删掉了（#lgHint 空着就整块收起，不留一段空白）；
     注册还留一句密码长度提醒 —— 那一条是注册才用得上的规则。 */
  if (lgHint) {
    lgHint.textContent = reg ? "起个 2~16 字的昵称，校园里别人看到的就是它。密码至少 8 位。" : "";
    lgHint.hidden = !reg;
  }
  if (lgU) lgU.placeholder = "昵称";
  /* ⭐ 注册**不**沿用预设测试账号：两颗演示按钮收起来，两个框也清空 ——
     否则点过「管理员 admin」再切注册，会拿 admin/admin123 去抢注那个号。 */
  if (lgQuick) lgQuick.hidden = reg;
  if (reg) {
    if (lgU) { lgU.value = ""; lgU.classList.remove("bad"); }
    if (lgP) { lgP.value = ""; lgP.classList.remove("bad"); }
    for (const b of loginEl.querySelectorAll("#lgQuick button")) b.classList.remove("on");
  }
  if (lgMsg) lgMsg.textContent = "";
}

function loginGate() {
  if (!loginEl) return;
  hudUserTick();
  if (mpToken()) { loginEl.hidden = true; return; }        // 24 小时内再来，直接进
  loginEl.hidden = false;
  if (lgMsg) { lgMsg.textContent = ""; lgMsg.classList.remove("ok"); }
  if (lgU) { lgU.value = ""; lgU.classList.remove("bad"); }
  if (lgP) { lgP.value = ""; lgP.classList.remove("bad"); lgP.type = "password"; }
  if (lgPwEye) { lgPwEye.textContent = "显示"; lgPwEye.title = "显示密码"; }
  /* 只清高亮，不重新绑监听（绑在加载期那一次就够） */
  for (const b of loginEl.querySelectorAll("#lgQuick button")) b.classList.remove("on");
  if (lgU) lgU.focus();
}

/* 出错的话同一句话讲两处：底下那行红字 + 把要改的那个框描红一圈。
   ⚠️ 只红一个框：两个一起红等于没说。 */
function lgFail(msg, bad) {
  if (lgMsg) { lgMsg.textContent = msg; lgMsg.classList.remove("ok"); }
  if (lgU) lgU.classList.toggle("bad", bad === lgU);
  if (lgP) lgP.classList.toggle("bad", bad === lgP);
}

function doLogin() {
  if (!lgU || !lgP) return;
  const u = (lgU.value || "").trim(), p = lgP.value || "";
  lgU.classList.remove("bad"); lgP.classList.remove("bad");
  if (!u || !p) { lgFail("昵称和密码都要填。", !u ? lgU : lgP); return; }
  if (LG_MODE === "register" && p.length < 8) { lgFail("密码太短了，至少凑够 8 位。", lgP); return; }
  if (lgGo) { lgGo.disabled = true; lgGo.textContent = LG_MODE === "register" ? "注册中…" : "登录中…"; }
  if (lgMsg) lgMsg.textContent = "";
  const go = LG_MODE === "register"
    ? campusRegisterPost(u, p).then(res =>
        (res && res.code === 200) ? campusLoginPost(u, p) : res)   // 注册成功 ⇒ 立刻登一次拿主票
    : campusLoginPost(u, p);
  go.then(res => {
    if (res && res.code === 200 && res.data && res.data.token) {
      campusWriteSession(res.data);
      loginEl.hidden = true;
      hudUserTick();
      /* ⭐ 平台这一步过了 —— 现在才去换四家的票。
         ⚠️ **不 await**：学霸姐要读 85 MB 向量，绝不能拿它卡住进地图。
         用 `mpBootSync` 而不是光 `mpExchange`：顺手把四家问一遍，HUD 当场就能
         说出"哪家没开起来"，不用等人走到门口按 C 才发现。 */
      mpBootSync();
    } else {
      lgFail((res && (res.message || res.msg)) ||
        (LG_MODE === "register" ? "这个昵称已经有了，换一个试试。" : "昵称或密码不对，再看一眼。"),
        LG_MODE === "register" ? lgU : lgP);
    }
  }).catch(() => {
    lgFail("连不上服务器。先双击「启动像素校园.bat」，等窗口都开起来再试。");
  }).then(() => {
    /* ⚠️ 这里**不能**调 `lgSetMode()` —— 它末尾那句 `lgMsg.textContent = ""`
       会把刚写上去的失败原因当场擦掉，于是"点了注册毫无反馈"。只把按钮恢复原样。 */
    if (lgGo) {
      lgGo.disabled = false;
      lgGo.textContent = LG_MODE === "register" ? "注册并进入像素校园" : "进入像素校园";
    }
  });
}

function doLogout() {
  /* 主票与账号信息清掉；四家的票是 HttpOnly cookie，JS 删不掉 —— 叫 8081 删，
     它顺手把 `mp_ticket` 里那四行也清掉（§9.2 铁律 4：一次登出全退，不留残票）。 */
  try { localStorage.removeItem("token"); localStorage.removeItem("user"); } catch (e) {}
  const tok = "";
  try {
    fetch("/api/auth/logout", {
      method: "POST", headers: { "Authorization": "Bearer " + (tok || "") },
      credentials: "same-origin"
    }).catch(() => {});
  } catch (e) {}
  /* 兜底：各家自己的登出接口也喊一嗓子（fire-and-forget，失败不拦人退登）。
     ⚠️ 阿姨的 `/api/logout` 挂了 `check_origin` ⇒ 依赖 Vite 那边 `changeOrigin:false`。 */
  for (const k in MP_SERVICES) {
    if (k === "campus") continue;
    try { fetch(MP_SERVICES[k].probe.replace(/\/me$/, "/logout"), { method: "POST", credentials: "same-origin" }).catch(() => {}); } catch (e) {}
  }
  CENTER.xbg = ""; CENTER.ld = ""; CENTER.cmr = ""; CENTER.campus = "";
  hudUserTick();
  loginGate();
}

/* ⭐ 二期 §3.1.3：**抽屉里"认不出票"由 iframe 自己报上来**，宿主补票再把抽屉重载一次。
   三家 Python 服务与刷题平台都读不到那张 HttpOnly cookie（JS 碰不上去），它们唯一
   能做的就是把 401 如实说出来 —— 这里正是接住那句话的地方。
   ⚠️ 与 §3.1.2 是一条绳上的：登录窗删掉之后，"认不出"必须有个出口，不然抽屉就成死页。
   消息由 `frontend/src/utils/hostAuth.js` 发出（type: pixelcampus:need-ticket）。 */
window.addEventListener("message", ev => {
  const d = ev.data;
  if (!d || d.type !== "pixelcampus:need-ticket") return;
  const key = d.from === "agent" ? "campus" : d.from;
  if (!MP_SERVICES[key]) return;                 // 报上来的名字不认识 ⇒ 不当回事
  mpEnsure(key).then(mark => {
    if (mark !== "ok") {
      /* 补不上票 ⇒ **别把一张死页留在人脸上**。第四十六轮的口径：抽屉不硬收，
         摘掉 iframe 后把宿主那张告示摆在他面前，说清是"没开起来"还是"票没续上"，
         人自己选重试还是回校园 —— 上一版直接 `ctrClosePlatform` 把他踢回地图，
         什么解释都没有，看起来就像"按了 C 结果什么都没发生"。
         只有主票都没了（campus 这一家）才落回地图那张登录门（§9.2 铁律 3 的最后一档）。 */
      try { if (ctrF) ctrF.removeAttribute("src"); } catch (e) {}
      if (key === "campus") { ctrClosePlatform(true); loginGate(); return; }
      ctrGateShow(CG_R || CENTER.room, mark);
      return;
    }
    /* 票补上了 ⇒ 把**这一个**抽屉重新过一遍水。⚠️ 先摘 src 再设回去：
       同一个 URL 直接设 src 有些浏览器会当作无变化，不重新发请求。 */
    ctrGateHide();
    try {
      if (ctrF && ctrF.getAttribute("src")) {
        const s = ctrF.getAttribute("src");
        ctrF.removeAttribute("src");
        ctrF.setAttribute("src", s);
      }
    } catch (e) {}
  });
});

/* ⭐ 二期：各家抽屉里那颗「退出」按下去以后的出口。
   §3.1.2 把四家的登录窗连根拔掉之后，"退出"就没有可去的地方了 —— 留在原地只会露出
   那张「这里不登录」的告示。用户要的是**退出即回大厅**，所以由宿主把抽屉收掉、
   顺手摘掉 iframe（见 `ctrClosePlatform(detach)`），下一次按 C 重新过闸门补票。
   ⚠️ 两道校验照 7.10.6 的 `aunt-exit`：`origin` 对得上**且** `source` 就是本抽屉那个
      frame —— 少一道的话页面上任何 iframe / 弹窗都能凭一条消息关掉地图的抽屉。
   ⚠️ 只有刷题平台那颗是**主站**退出（它清的是与地图同源的 `localStorage.token`），
      这时四家的票一律作废，不留残票（§9.2 铁律 4）。 */
window.addEventListener("message", ev => {
  const d = ev.data;
  if (!d || d.type !== "pixelcampus:exit") return;
  if (ev.origin !== location.origin) return;
  if (!ctrF || ev.source !== ctrF.contentWindow) return;
  const key = d.from === "agent" ? "campus" : d.from;
  if (!MP_SERVICES[key]) return;
  if (key === "campus") { ctrClosePlatform(true); doLogout(); return; }
  CENTER[key] = "";
  ctrClosePlatform(true);
  hudUserTick();
}, false);
