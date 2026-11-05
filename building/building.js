/* =========================================================================
   building.js — 楼宇主页（本模块的代码全在 building/ 这一个文件夹里）
   -------------------------------------------------------------------------
   对外的口子只有 `window.MPBuilding`：
     MPBuilding.open(slug) / close() / isOpen() / sites()

   它干三件事：
     ① 在几栋楼的屋顶上方画一颗上下漂浮的圆形像素「i」；
     ② 点开是这栋楼的小页面：简介 + 照片墙（照片底下挂着上传人） + 留言；
     ③ 点照片打开「明信片」：照片在上，下面是一条奶油色纸条，写着上传者、
        时间和寄语。

   位置从哪来：主脚本在建楼那一圈里把「门面中轴 + 屋顶顶边」写进了
   `window.BLD_ANCHORS[楼名]`（世界坐标，口径与 render() 的 `p.y - p.ay` 同一笔）。
   本文件只读它，不认识地图内部任何一个变量 —— 取不到的楼就安静地不画。
   ========================================================================= */
(function () {
  "use strict";

  const API = "/api/mp/building/";
  const LIFT = 20;              // 「i」浮在屋顶上方多少世界像素
  const PHOTO_MAX = 1400;       // 上传前把长边压到这个数（再大就只是变慢）
  const NOTE_MAX = 60;          // 与 mp/server.py 的 BLD_NOTE_MAX 一致
  const COMMENT_MAX = 200;      // 与 mp/server.py 的 BLD_COMMENT_MAX 一致

  /* --- 上主页的楼：slug 与 mp/server.py 里的 bld 字段一一对应 ---------------
     楼名（name）必须与地图 CAMPUS 表里的名字**逐字相同**，否则找不到锚点。
     简介写的是能查到的实情，不编数字；找不到出处的那句就不写。 */
  const SITES = {
    library: {
      name: "图书馆", sub: "LIBRARY",
      tags: ["七层八角", "约 200 万册", "1909"],
      info: [
        "学校 1909 年建校时就有了图书室，现在这座是第三代馆舍 —— 一座七层的八角形建筑，上下一共八个体量错落着叠起来，同学们私下叫它「八卦楼」。",
        "纸质文献约 200 万册。七层是特藏闭架库，收民国书刊、本校学位论文和校友文库，得联系馆员才进得去。"
      ]
    },
    yifu: {
      name: "逸夫楼", sub: "NO.10 TEACHING · YIFU",
      tags: ["2007 年落成", "72 间教室", "第十教学楼"],
      info: [
        "立项时叫「软件工程楼」，建成后正式命名为第十教学楼；因为拿了邵氏基金的赠款，大家更习惯叫它逸夫楼。2007 年 9 月 3 日落成，建筑总长 117.1 米。",
        "全校教室最多的一栋：72 间教室、5790 个座位，西侧一到二层是计算机教学基地。本科四年里在这儿待的时间大概比宿舍还长。"
      ]
    },
    kexue: {
      name: "科学会堂", sub: "SCIENCE HALL",
      tags: ["邓小平题名", "报告厅"],
      info: [
        "堂名是邓小平题写的。主报告厅之外，还有院士厅、茅以升厅、郑振铎厅、智瑾厅几间小厅，报告、答辩、颁奖多半排在这里。",
        "门口的台阶不宽，散场的时候人流会从两侧的绿化带边绕出去 —— 赶下一节课的时候记得早两分钟起身。"
      ]
    },
    jiujiao: {
      name: "第九教学楼", sub: "NO.9 TEACHING",
      tags: ["计算机学院", "中心报告厅"],
      info: [
        "学校的南门进来第一眼就是它。计算机科学与技术学院等院系的办公和教学都在这栋楼里，楼内还有一个中心报告厅。",
        "九教的门厅不算大，课间换教室的人流全挤在那一小片，铃声一响就堵上了。"
      ]
    },
    jixie: {
      name: "机械楼", sub: "MECHANICAL ENGINEERING",
      tags: ["2008 年建成", "十层", "蒸汽机车"],
      info: [
        "2008 年建成，地上十层。一层大厅里停着一台 C2 型蒸汽机车，从门口路过就能看见那截黑绿色的车头。",
        "十层是大学生机械博物馆，齿轮、连杆、老机床摆了一屋子，平时安静得很。"
      ]
    },
    xin: {
      name: "新体育馆", sub: "NEW GYMNASIUM",
      tags: ["室内球场", "紧邻网球场"],
      info: [
        "学校的室内体育馆，篮球场和羽毛球场都在里头，课后的场次得提前抢。",
        "东边紧挨着网球场和操场，从操场绕过来就是它的大门，跑完步顺路进来投两个球刚刚好。"
      ]
    },
    tianyou: {
      name: "天佑会堂", sub: "TIANYOU AUDITORIUM",
      tags: ["2001 年改扩建", "约 1500 座", "詹天佑"],
      info: [
        "名字取自「中国铁路之父」詹天佑。前身是 1953 年的大礼堂，2001 年改扩建成了现在的样子。",
        "约 1500 个座位，开学典礼、毕业典礼和各种演出都在这里。散场时从台阶上往下走，能看见整条主路的路灯。"
      ]
    }
  };

  /* --- 小工具 ------------------------------------------------------------ */
  const el = function (tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  };

  function avatarEl(look, size) {
    const box = el("div", "bld-av");
    box.style.width = size + "px";
    box.style.height = size + "px";
    let c = null;
    try { c = window.MPLook && MPLook.avatar ? MPLook.avatar(look) : null; } catch (e) { c = null; }
    if (c) box.appendChild(c);
    return box;
  }

  function tok() { try { return localStorage.getItem("mpToken") || ""; } catch (e) { return ""; } }

  async function call(path, opts) {
    const r = await fetch(API + path, Object.assign({ cache: "no-store" }, opts || {}));
    let data = null;
    try { data = await r.json(); } catch (e) { data = null; }
    if (!r.ok) {
      const err = new Error((data && data.error) || "网络开小差了，再试一次");
      err.status = r.status;
      throw err;
    }
    return data;
  }

  function fmt(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const p = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  function ago(iso) {
    const t = new Date(iso).getTime();
    if (!t) return "";
    const d = Date.now() - t;
    if (d < 60000) return "刚刚";
    if (d < 3600000) return Math.floor(d / 60000) + " 分钟前";
    if (d < 86400000) return Math.floor(d / 3600000) + " 小时前";
    if (d < 7 * 86400000) return Math.floor(d / 86400000) + " 天前";
    return fmt(iso).slice(0, 10);
  }

  /* --- 那颗「i」----------------------------------------------------------
     17×17 的逻辑像素，页面上放大 2 倍。外圈深色描边 + 金色圆面 + 中间一个
     带衬线的「i」—— 和地图自己那套像素风对得上，缩到 34px 也认得出。 */
  function pinCanvas() {
    const c = document.createElement("canvas");
    c.width = c.height = 17;
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    for (let y = 0; y < 17; y++) {
      for (let x = 0; x < 17; x++) {
        const dx = x + 0.5 - 8.5, dy = y + 0.5 - 8.5;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d <= 6.4) g.fillStyle = "#ffd76e";
        else if (d <= 7.6) g.fillStyle = "#1d2129";
        else continue;
        g.fillRect(x, y, 1, 1);
      }
    }
    g.fillStyle = "#1b2028";
    const rows = [
      [5, [7, 8, 9]], [6, [8]], [7, [7, 8, 9]],
      [8, [8]], [9, [8]], [10, [8]], [11, [7, 8, 9]]
    ];
    for (const [y, xs] of rows) for (const x of xs) g.fillRect(x, y, 1, 1);
    return c;
  }

  /* 世界 → 屏幕：全项目没有现成的换算函数，照 cat-dex.js §7.5.16 同一笔抄一份
     （含"画布居中后剩下的边距"那一项）。取不到就返回 null。 */
  function worldToScreen(wx, wy) {
    let VW, VH, z, cm;
    try { VW = VIEW_W; VH = VIEW_H; z = zoom; cm = cam; } catch (e) { return null; }
    const cvEl = document.getElementById("cv");
    const cssW = cvEl && parseFloat(cvEl.style.width);
    if (!cssW || !VW) return null;
    const cs = cssW / VW;
    return {
      x: (window.innerWidth - VW * cs) / 2 + (wx - cm.x) * z * cs,
      y: (window.innerHeight - VH * cs) / 2 + (wy - cm.y) * z * cs
    };
  }

  /* --- 状态 -------------------------------------------------------------- */
  /* 两层分开挂：#bldRoot 只放地图上那几颗「i」（压在面板下面），
     #bldLayer 放楼的小页面和提示（压在大厅面板上面）。用户 2026-11-04 报的就是这层打架。 */
  let root = null, layer = null, pinsBox = null, shade = null, panel = null, postshade = null, toastEl = null;
  let fileInput = null;
  const pins = [];              // {slug, el, x, top, ph}
  let current = "";             // 当前打开的楼
  let state = null;             // 服务端那份 payload
  let pending = null;           // {dataUrl} 选完图还没上传的那一张
  let busy = false;
  let raf = 0;

  function isOpen() { return !!(shade && !shade.hidden); }
  function postOpen() { return !!(postshade && !postshade.hidden); }

  /* 这几种时候「i」要收起来：进了室内、任何一张全屏弹窗开着 —— 留着就是压脸。 */
  function blocked() {
    if (isOpen()) return true;
    try {
      if (document.body.classList.contains("ctr-on")) return true;
      const lg = document.getElementById("login");
      if (lg && !lg.hidden) return true;
      for (const id of ["mpAuthShade", "mpLookShade", "mpProfileShade", "mpOfflineShade"]) {
        const n = document.getElementById(id);
        if (n && !n.hidden) return true;
      }
      if (document.querySelector("#catDexRoot .cdx-shade:not([hidden])")) return true;
    } catch (e) { /* 纯静态页没有这些节点，正常 */ }
    return false;
  }

  let toastTimer = 0;
  function toast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }

  /* --- 每帧：把「i」钉在楼顶上 -------------------------------------------- */
  function tick(now) {
    raf = requestAnimationFrame(tick);
    if (!pinsBox) return;
    const hide = blocked();
    if (hide) { if (pinsBox.style.display !== "none") pinsBox.style.display = "none"; return; }
    if (pinsBox.style.display === "none") pinsBox.style.display = "";
    let z = 1;
    try { z = zoom; } catch (e) { z = 1; }
    /* 缩放跟着镜头走一点点：看全图时别让六颗图标比楼还大，凑近了也别显得太小。
       ⚠️ 只改 transform 里的 scale，不动 width/height —— 每帧改尺寸会逼浏览器重排。 */
    const sc = Math.min(1.4, Math.max(0.82, 0.55 + z * 0.45));
    for (const p of pins) {
      const s = worldToScreen(p.x, p.top - LIFT);
      if (!s || s.x < -60 || s.x > window.innerWidth + 60 || s.y < -60 || s.y > window.innerHeight + 60) {
        if (!p.el.hidden) p.el.hidden = true;
        continue;
      }
      if (p.el.hidden) p.el.hidden = false;
      const bob = Math.sin(now / 520 + p.ph) * 3.2;
      p.el.style.left = Math.round(s.x) + "px";
      p.el.style.top = Math.round(s.y) + "px";
      p.el.style.transform = "translate(-50%,-50%) translateY(" + bob.toFixed(1) + "px) scale(" + sc.toFixed(2) + ")";
    }
  }

  /* --- 打开 / 关闭 -------------------------------------------------------- */
  async function open(slug) {
    if (!SITES[slug]) return;
    current = slug;
    state = null;
    pending = null;
    render();
    shade.hidden = false;
    panel.scrollTop = 0;
    await load();
  }

  function close() {
    shade.hidden = true;
    closePost();
    current = ""; state = null; pending = null;
  }

  async function load() {
    const slug = current;
    try {
      const data = await call(slug);
      if (slug !== current) return;          // 请求在路上的时候玩家已经换了一栋楼
      state = data;
      render();
    } catch (e) {
      if (slug !== current) return;
      toast(e.message);
    }
  }

  /* 没登录时的统一出口：本模块的层（53）压在大厅那几张门（50）之上，
     所以必须**先把自己收掉**再喊登录门，否则登录框被这层盖住、点不着。 */
  function needLogin() {
    toast("先在大厅登录，才能上传照片和留言");
    close();
    if (window.MP && typeof MP.requireLogin === "function") MP.requireLogin();
  }

  /* --- 楼的小页面 -------------------------------------------------------- */
  function render() {
    if (!panel) return;
    const site = SITES[current];
    if (!site) return;
    const keepScroll = panel.scrollTop;
    panel.replaceChildren();

    const photos = (state && state.photos) || [];
    const comments = (state && state.comments) || [];

    /* 头 */
    const head = el("div", "bld-head");
    head.appendChild(el("span", "bld-title", site.name));
    head.appendChild(el("span", "bld-stat",
      state ? (photos.length + " 张照片 · " + comments.length + " 条留言") : "正在翻开…"));
    const x = el("button", "bld-x", "×");
    x.type = "button";
    x.setAttribute("aria-label", "关闭楼宇主页");
    x.addEventListener("click", close);
    head.appendChild(x);
    panel.appendChild(head);

    const body = el("div", "bld-body");

    /* 简介 */
    const info = el("div");
    info.appendChild(el("p", "bld-sub", site.sub));
    const tagRow = el("div", "bld-tags");
    for (const t of site.tags) tagRow.appendChild(el("span", "bld-tag", t));
    info.appendChild(tagRow);
    for (const p of site.info) info.appendChild(el("p", "bld-p", p));
    body.appendChild(info);

    /* 照片墙 */
    const wallH = el("div", "bld-sec-h");
    wallH.appendChild(el("b", "楼影"));
    wallH.appendChild(el("span", "bld-count", photos.length ? photos.length + " 张" : "还没有人拍过"));
    body.appendChild(wallH);

    const wall = el("div", "bld-wall");
    if (!photos.length) {
      wall.appendChild(el("div", "bld-empty", state ? "这面墙还空着，第一张留给你。" : "照片正在路上…"));
    } else {
      for (const ph of photos) {
        const b = el("button", "bld-ph");
        b.type = "button";
        b.title = (ph.note ? ph.note + " —— " : "") + ph.by.nickname;
        const img = document.createElement("img");
        img.src = ph.url;
        img.alt = site.name + " · " + ph.by.nickname;
        img.loading = "lazy";
        img.decoding = "async";
        b.appendChild(img);
        const cap = el("span", "bld-ph-by");
        cap.appendChild(avatarEl(ph.by.look, 14));
        cap.appendChild(el("i", "", ph.by.nickname));
        b.appendChild(cap);
        b.addEventListener("click", function () { openPost(ph); });
        wall.appendChild(b);
      }
    }
    body.appendChild(wall);

    /* 上传 */
    if (pending) {
      body.appendChild(composeBlock());
    } else {
      const up = el("div", "bld-up");
      const btn = el("button", "bld-btn bld-primary", "＋ 上传一张照片");
      btn.type = "button";
      btn.addEventListener("click", startPick);
      up.appendChild(btn);
      up.appendChild(el("span", "bld-hint", "写下此刻想说的话，别人点开照片就能看到"));
      body.appendChild(up);
    }

    /* 留言 */
    const cmH = el("div", "bld-sec-h");
    cmH.appendChild(el("b", "留言"));
    cmH.appendChild(el("span", "bld-count", comments.length ? comments.length + " 条" : "还没有人说话"));
    body.appendChild(cmH);

    const list = el("div", "bld-cmts");
    if (!comments.length) {
      list.appendChild(el("div", "bld-empty", "还没有留言。路过就留一句吧。"));
    } else {
      for (const c of comments) {
        const row = el("div", "bld-cmt");
        row.appendChild(avatarEl(c.by.look, 22));
        const main = el("div", "bld-cmt-main");
        const ch = el("div", "bld-cmt-h");
        ch.appendChild(el("b", "", c.by.nickname));
        ch.appendChild(el("span", "", ago(c.at)));
        main.appendChild(ch);
        main.appendChild(el("p", "bld-cmt-t", c.content));
        row.appendChild(main);
        list.appendChild(row);
      }
    }
    body.appendChild(list);

    const form = el("form", "bld-cfmt");
    const input = document.createElement("input");
    input.maxLength = COMMENT_MAX;
    input.placeholder = "说说你在" + site.name + "的事……";
    input.setAttribute("aria-label", "留言内容");
    const send = el("button", "bld-btn", "发布");
    send.type = "submit";
    form.appendChild(avatarEl(currentLook(), 22));
    form.appendChild(input);
    form.appendChild(send);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) { input.focus(); return; }
      if (!tok()) return needLogin();
      send.disabled = true;
      send.textContent = "发送中";
      postJSON(current + "/comment", { content: text })
        .then(function (data) {
          state = data; render();
          toast("留言发出去了");
        })
        .catch(function (err) {
          toast(err.message);
          send.disabled = false; send.textContent = "发布";
        });
    });
    body.appendChild(form);

    panel.appendChild(body);
    panel.scrollTop = keepScroll;
  }

  /* 自己那颗头像：没登录时退回默认形象，气泡也还是得有个脸 */
  function currentLook() {
    try {
      if (window.MP && MP.look) return MP.look;
      if (window.MPLook && MPLook.fallback) return MPLook.fallback;
    } catch (e) { /* 没大厅 */ }
    return {};
  }

  function composeBlock() {
    const box = el("div", "bld-compose");
    const img = document.createElement("img");
    img.className = "bld-cmp-img";
    img.src = pending.dataUrl;
    img.alt = "待上传的照片";
    box.appendChild(img);

    const ta = document.createElement("textarea");
    ta.className = "bld-cmp";
    ta.maxLength = NOTE_MAX;
    ta.placeholder = "给这张照片写句话（不写也行）";
    ta.value = pending.note || "";
    box.appendChild(ta);

    const row = el("div", "bld-cmp-row");
    const ok = el("button", "bld-btn bld-primary", "挂上墙");
    ok.type = "button";
    const cancel = el("button", "bld-btn", "取消");
    cancel.type = "button";
    const counter = el("span", "", (ta.value.length) + " / " + NOTE_MAX);
    ta.addEventListener("input", function () { counter.textContent = ta.value.length + " / " + NOTE_MAX; });
    cancel.addEventListener("click", function () { pending = null; render(); });
    ok.addEventListener("click", function () {
      if (busy) return;
      busy = true;
      ok.disabled = true; cancel.disabled = true;
      ok.textContent = "上传中…";
      postJSON(current + "/photo", { dataUrl: pending.dataUrl, note: ta.value.slice(0, NOTE_MAX) })
        .then(function (data) {
          state = data; pending = null;
          render();
          toast("照片挂上墙了");
        })
        .catch(function (err) {
          ok.disabled = false; cancel.disabled = false;
          ok.textContent = "挂上墙";
          toast(err.message);
        })
        .then(function () { busy = false; });
    });
    row.appendChild(ok); row.appendChild(cancel); row.appendChild(counter);
    box.appendChild(row);
    return box;
  }

  function postJSON(path, payload) {
    return call(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + tok() },
      body: JSON.stringify(payload)
    }).catch(function (err) {
      if (err.status === 401) { needLogin(); throw new Error("登录已失效，请重新登录"); }
      throw err;
    });
  }

  /* --- 选图 → 压到 1400 → 交给 composeBlock --------------------------------- */
  function startPick() {
    if (!tok()) return needLogin();
    fileInput.value = "";
    fileInput.click();
  }

  function readFile(file) {
    return new Promise(function (resolve, reject) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () {
        try {
          let w = img.naturalWidth, h = img.naturalHeight;
          const k = Math.min(1, PHOTO_MAX / Math.max(w, h));
          w = Math.max(1, Math.round(w * k));
          h = Math.max(1, Math.round(h * k));
          const c = document.createElement("canvas");
          c.width = w; c.height = h;
          const g = c.getContext("2d");
          g.fillStyle = "#ffffff";               // 透明 PNG 转 JPEG 会变黑底，先垫一层白
          g.fillRect(0, 0, w, h);
          g.drawImage(img, 0, 0, w, h);
          resolve(c.toDataURL("image/jpeg", 0.85));
        } catch (e) {
          reject(new Error("这张图片处理不了，换一张试试"));
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("这张图片读不出来，换一张试试")); };
      img.src = url;
    });
  }

  /* --- 明信片 ------------------------------------------------------------ */
  function openPost(ph) {
    const site = SITES[current];
    if (!site || !postshade) return;
    postshade.replaceChildren();

    const card = el("div", "bld-card");
    const x = el("button", "bld-card-x", "×");
    x.type = "button";
    x.setAttribute("aria-label", "关闭");
    x.addEventListener("click", closePost);
    card.appendChild(x);

    const top = el("div", "bld-card-top");
    const img = document.createElement("img");
    img.className = "bld-card-img";
    img.src = ph.url;
    img.alt = site.name;
    top.appendChild(img);
    top.appendChild(el("div", "bld-stamp", site.name.slice(0, 2)));
    card.appendChild(top);

    const body = el("div", "bld-card-body");
    const meta = el("div", "bld-card-meta");
    meta.appendChild(avatarEl(ph.by.look, 26));
    const who = el("div");
    who.appendChild(el("b", "", ph.by.nickname));
    meta.appendChild(who);
    const tm = el("time", "", fmt(ph.at));
    meta.appendChild(tm);
    body.appendChild(meta);

    if (ph.note) body.appendChild(el("p", "bld-card-note", ph.note));
    else body.appendChild(el("p", "bld-card-note bld-blank", "这张照片没留话。"));

    const foot = el("div", "bld-card-foot", "BEIJING JIAOTONG UNIVERSITY");
    foot.appendChild(el("span", "", "像素校园 · " + site.name));
    body.appendChild(foot);
    card.appendChild(body);

    postshade.appendChild(card);
    postshade.hidden = false;
  }

  function closePost() { if (postshade) postshade.hidden = true; }

  /* --- 搭 DOM ------------------------------------------------------------ */
  function build() {
    const host = document.getElementById("mpRoot") || document.body;
    root = el("div");
    root.id = "bldRoot";
    host.appendChild(root);

    /* 楼的小页面走另一层，层级高于大厅的公告/留言板/私聊。 */
    layer = el("div");
    layer.id = "bldLayer";
    host.appendChild(layer);

    pinsBox = el("div", "bld-pins");
    root.appendChild(pinsBox);

    /* 锚点由主脚本登记；登记不到的楼（比如以后地图改名了）就当没这栋楼。 */
    const anchors = window.BLD_ANCHORS || {};
    let i = 0;
    for (const slug in SITES) {
      const a = anchors[SITES[slug].name];
      if (!a) continue;
      const btn = el("button", "bld-pin");
      btn.type = "button";
      btn.setAttribute("aria-label", SITES[slug].name + " · 楼宇主页");
      btn.appendChild(pinCanvas());
      btn.appendChild(el("b", "", SITES[slug].name));
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        open(slug);
      });
      pinsBox.appendChild(btn);
      pins.push({ slug: slug, el: btn, x: a.x, top: a.top, ph: (i++) * 1.15 });
    }

    shade = el("div", "bld-shade");
    shade.hidden = true;
    panel = el("section", "bld-panel");
    panel.setAttribute("aria-label", "楼宇主页");
    shade.appendChild(panel);
    shade.addEventListener("click", function (e) { if (e.target === shade) close(); });
    layer.appendChild(shade);

    postshade = el("div", "bld-postshade");
    postshade.hidden = true;
    postshade.addEventListener("click", function (e) { if (e.target === postshade) closePost(); });
    layer.appendChild(postshade);

    toastEl = el("div", "bld-toast");
    toastEl.hidden = true;
    toastEl.setAttribute("role", "status");
    layer.appendChild(toastEl);

    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png,image/jpeg,image/webp";
    fileInput.hidden = true;
    fileInput.addEventListener("change", function () {
      const f = fileInput.files && fileInput.files[0];
      if (!f) return;
      if (f.size > 20 * 1024 * 1024) { toast("这张图太大了（20 MB 以内）"); return; }
      readFile(f).then(function (dataUrl) {
        pending = { dataUrl: dataUrl, note: "" };
        render();
        if (panel) panel.scrollTop = panel.scrollHeight;
      }).catch(function (err) { toast(err.message); });
    });
    layer.appendChild(fileInput);

    /* 键盘与滚轮：地图把 WASD 和缩放都挂在 window 上，**不看焦点**。
       不掐断的话，在留言框里打 "w" 会一边输入一边把人物往北推。
       两层都要拦：按钮那层收不到键盘，得靠窗口那份兜底。 */
    [root, layer].forEach(function (node) {
      node.addEventListener("keydown", function (e) {
        /* Esc 也在这层收：焦点在留言框里的时候事件冒不到 window，地图外面那份收不到。 */
        if (e.key === "Escape") {
          if (postOpen()) closePost();
          else if (isOpen()) close();
        }
        e.stopPropagation();
      });
      node.addEventListener("keyup", function (e) { e.stopPropagation(); });
      node.addEventListener("wheel", function (e) { e.stopPropagation(); }, { passive: true });
    });

    window.addEventListener("keydown", function (e) {
      if ((e.key || "") !== "Escape") return;
      if (postOpen()) closePost();
      else if (isOpen()) close();
    });

    raf = requestAnimationFrame(tick);
  }

  /* --- 导出 -------------------------------------------------------------- */
  window.MPBuilding = {
    open: open,
    close: close,
    isOpen: isOpen,
    sites: function () { return Object.keys(SITES); }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build, { once: true });
  } else {
    build();
  }
})();
