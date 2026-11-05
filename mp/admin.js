/* =============================================================================
   admin.js —— 像素校园 · 管理后台（/admin.html 专用，游戏里不引这一份）
   -----------------------------------------------------------------------------
   登录管理员（默认账号 admin）以后，大厅会直接把人送到 /admin.html；
   这个页面拿 localStorage 里的 mpToken 去问 /api/mp/admin/me：
     · 是管理员   → 进后台
     · 不是 / 没登录 → 只显示"回大厅登录"那块，什么数据都不请求
   数据全部由服务端算好（见 mp/server.py 的 admin_stats / admin_users），
   前端只负责画图和摆表格 —— 两边口径只有一处，改口径改服务端。
   ========================================================================== */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var TOKEN_KEY = "mpToken";
  var tok = function () { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; } };

  function api(path, opts) {
    opts = opts || {};
    var headers = {};
    if (opts.body) headers["Content-Type"] = "application/json";
    if (tok()) headers["Authorization"] = "Bearer " + tok();
    return fetch(path, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (!r.ok) { var err = new Error(data.error || ("请求失败（" + r.status + "）")); err.status = r.status; throw err; }
        return data;
      });
    });
  }

  var state = { users: [], stats: null, days: 7, filter: "", hover: -1, openId: null };

  /* ---------------- 小工具 ---------------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function fmtDur(sec) {
    sec = Math.max(0, Math.round(sec || 0));
    if (!sec) return "—";
    if (sec < 60) return sec + " 秒";
    if (sec < 3600) return Math.round(sec / 60) + " 分钟";
    var h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
    return h + " 小时" + (m ? " " + m + " 分" : "");
  }
  function shortDate(d) {
    var p = String(d).split("-");
    return p.length === 3 ? p[1] + "-" + p[2] : String(d);
  }

  /* ---------------- 登录闸门 ---------------- */
  function showGate(msg) {
    $("adApp").hidden = true;
    $("adGate").hidden = false;
    $("adGateErr").textContent = msg || "";
    // 手里那张票已经没用了，留着只会让人以为"我明明登录了"
    try { if (/需要管理员|重新登录|登录/.test(msg || "")) localStorage.removeItem(TOKEN_KEY); } catch (e) {}
  }

  function boot() {
    if (!tok()) { showGate("这台浏览器里没有登录记录，请先回大厅用管理员账号登录。"); return; }
    api("/api/mp/admin/me").then(function (me) {
      $("adWho").textContent = me.nickname;
      $("adGate").hidden = true;
      $("adApp").hidden = false;
      return loadAll();
    }).catch(function (e) {
      showGate(e.status === 401 ? "登录已失效，请回大厅重新登录。" : (e.status === 403 ? "这个账号不是管理员，进不了后台。" : e.message));
    });
  }

  function loadAll() {
    return Promise.all([
      api("/api/mp/admin/users"),
      api("/api/mp/admin/stats?days=" + state.days)
    ]).then(function (res) {
      state.users = res[0].users || [];
      state.stats = res[1];
      renderCards();
      renderChart();
      renderNumTable();
      renderApps();
      renderUsers();
    }).catch(function (e) { alert("加载失败：" + e.message); });
  }

  /* ---------------- 顶部四张卡 ---------------- */
  function today() {
    var s = state.stats && state.stats.series;
    return s && s.length ? s[s.length - 1] : { date: "", dau: 0, played: 0, finished: 0, logged: 0 };
  }
  function renderCards() {
    var box = $("adCards");
    box.replaceChildren();
    var t = today();
    var banned = state.users.filter(function (u) { return u.banned; }).length;
    var online = state.users.filter(function (u) { return u.online; }).length;
    [
      ["注册用户", state.users.length, "", "含管理员"],
      ["今日活跃", t.dau, "teal", "今天登录或玩过的人"],
      ["当前在线", online, "teal", "这会儿连着大厅的"],
      ["已封禁", banned, "warn", banned ? "封着的号登不进来" : "目前一个都没有"]
    ].forEach(function (c) {
      var card = el("div", "ad-card" + (c[2] ? " " + c[2] : ""));
      card.append(el("span", "", c[0]), el("b", "", String(c[1])), el("small", "", c[3]));
      box.append(card);
    });
  }

  /* ---------------- 主图：7 天日活 ----------------
     一根纵轴，两个都表示"人数"，所以能同轴（绝不做双纵轴）。
     柱子 = 日活；折线 = 当天结束过游玩的人（说明"来了并且真的玩完一段"）。 */
  var CHART = { pad: { l: 34, r: 14, t: 16, b: 26 }, geo: null };

  function niceStep(x) {
    if (x <= 1) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(x))), n = x / p;
    var m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return Math.max(1, m * p);
  }

  function roundTop(g, x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    g.beginPath();
    g.moveTo(x, y + h);
    g.lineTo(x, y + r);
    g.quadraticCurveTo(x, y, x + r, y);
    g.lineTo(x + w - r, y);
    g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h);
    g.closePath();
  }

  function setupCanvas(cv) {
    var dpr = window.devicePixelRatio || 1;
    var w = cv.clientWidth || cv.parentElement.clientWidth, h = cv.clientHeight || cv.parentElement.clientHeight;
    cv.width = Math.max(1, Math.round(w * dpr));
    cv.height = Math.max(1, Math.round(h * dpr));
    var g = cv.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    return { g: g, w: w, h: h };
  }

  function renderChart() {
    if (!state.stats) return;
    var S = state.stats.series;
    var cv = $("adChart");
    var box = setupCanvas(cv), g = box.g, W = box.w, H = box.h;
    var pad = CHART.pad;
    var iw = Math.max(10, W - pad.l - pad.r), ih = Math.max(10, H - pad.t - pad.b);
    var peak = 0;
    S.forEach(function (d) { peak = Math.max(peak, d.dau, d.finished); });
    var step = niceStep(Math.max(1, peak / 4)), top = Math.max(step, Math.ceil(peak / step) * step);
    if (top === 0) top = 1;
    var slot = iw / Math.max(1, S.length);
    var barW = Math.max(6, Math.min(40, slot * 0.56));

    var y = function (v) { return pad.t + ih - (v / top) * ih; };

    // 网格 + 纵轴刻度（recessive：细线、灰字，不抢数据）
    g.font = '11px system-ui,"Microsoft YaHei",sans-serif';
    g.textBaseline = "middle";
    for (var t = 0; t <= top + 1e-9; t += step) {
      var ty = y(t);
      g.strokeStyle = t === 0 ? "#475261" : "#2a313c";
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(pad.l, Math.round(ty) + 0.5); g.lineTo(pad.l + iw, Math.round(ty) + 0.5); g.stroke();
      g.fillStyle = "#b9c9d5";
      g.textAlign = "right";
      g.fillText(String(Math.round(t)), pad.l - 8, ty);
    }

    // 横轴日期
    g.textAlign = "center";
    S.forEach(function (d, i) {
      var cx = pad.l + slot * (i + 0.5);
      g.fillStyle = i === S.length - 1 ? "#f3efe3" : "#8e9aa8";
      g.fillText(S.length > 8 ? shortDate(d.date) : shortDate(d.date), cx, pad.t + ih + 14);
    });

    // 柱子：4px 圆角顶、贴基线、彼此留缝
    S.forEach(function (d, i) {
      var cx = pad.l + slot * (i + 0.5);
      var h = ih * (d.dau / top);
      if (d.dau > 0 && h < 2) h = 2;
      var x = cx - barW / 2;
      g.fillStyle = i === state.hover ? "#d8ae33" : "#b08c22";
      if (h > 0) {
        roundTop(g, x, pad.t + ih - h, barW, h, 4);
        g.fill();
      }
    });

    // 折线：当天结束过游玩的人数（2px 线 + 8px 圆点，点外圈补一圈底色当间隔）
    if (S.length > 0) {
      g.strokeStyle = "#1a9c8f";
      g.lineWidth = 2;
      g.lineJoin = "round";
      g.beginPath();
      S.forEach(function (d, i) {
        var cx = pad.l + slot * (i + 0.5), cy = y(d.finished);
        if (i === 0) g.moveTo(cx, cy); else g.lineTo(cx, cy);
      });
      g.stroke();
      S.forEach(function (d, i) {
        var cx = pad.l + slot * (i + 0.5), cy = y(d.finished);
        g.fillStyle = "#1d2129"; g.beginPath(); g.arc(cx, cy, 6, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#1a9c8f"; g.beginPath(); g.arc(cx, cy, 4, 0, Math.PI * 2); g.fill();
      });
    }

    // 只给最后一天（今天）直接标数，其余靠悬停和下面的表
    var last = S[S.length - 1];
    if (last && last.dau > 0) {
      g.fillStyle = "#f3efe3";
      g.textAlign = "center";
      g.fillText(String(last.dau), pad.l + slot * (S.length - 0.5), y(last.dau) - 12);
    }

    CHART.geo = { pad: pad, slot: slot, top: top, iw: iw, ih: ih, S: S };
  }

  function tooltipFor(i) {
    var geo = CHART.geo, tip = $("adTip");
    if (!geo || !geo.S[i]) { tip.hidden = true; return; }
    var d = geo.S[i];
    tip.replaceChildren();
    tip.append(el("b", "", d.date), el("em", "", " · 日活 " + d.dau + " 人 · 结束游玩 " + d.finished + " 人"));
    tip.hidden = false;
    var x = geo.pad.l + geo.slot * (i + 0.5);
    var cy = geo.pad.t + geo.ih - (d.dau / geo.top) * geo.ih;
    tip.style.left = Math.max(60, Math.min(x, geo.pad.l + geo.iw - 60)) + "px";
    tip.style.top = Math.max(44, cy - 10) + "px";
  }

  function bindHover() {
    var cv = $("adChart");
    cv.addEventListener("mousemove", function (e) {
      var geo = CHART.geo;
      if (!geo) return;
      var r = cv.getBoundingClientRect();
      var mx = e.clientX - r.left;
      var i = Math.floor((mx - geo.pad.l) / geo.slot);
      if (i < 0 || i >= geo.S.length) { i = -1; }
      if (i !== state.hover) { state.hover = i; renderChart(); }
      if (i >= 0) tooltipFor(i); else $("adTip").hidden = true;
    });
    cv.addEventListener("mouseleave", function () {
      state.hover = -1; $("adTip").hidden = true; renderChart();
    });
  }

  function renderNumTable() {
    if (!state.stats) return;
    var S = state.stats.series, table = $("adNum");
    table.replaceChildren();
    var hr = el("tr");
    ["日期", "日活", "登录过", "开始游玩", "结束游玩"].forEach(function (h) { hr.append(el("th", "", h)); });
    table.append(hr);
    S.forEach(function (d) {
      var tr = el("tr");
      [d.date, d.dau, d.logged, d.played, d.finished].forEach(function (v) { tr.append(el("td", "", String(v))); });
      table.append(tr);
    });
  }

  /* ---------------- 五个小应用的日活（各自一张小图） ---------------- */
  function renderApps() {
    var box = $("adApps");
    box.replaceChildren();
    if (!state.stats) return;
    state.stats.apps_meta.forEach(function (meta) {
      var list = state.stats.apps[meta.key] || [];
      var total = list.reduce(function (a, b) { return a + b.value; }, 0);
      var card = el("div", "ad-app");
      var h = el("h3", "", meta.name);
      var sum = el("div", "ad-app-sum");
      sum.append(el("b", "", String(total)), el("span", "", " 人次 / " + list.length + " 天"));
      card.append(h, sum);
      var cv = el("canvas");
      card.append(cv);
      box.append(card);
      drawMini(cv, list);
    });
  }

  function drawMini(cv, list) {
    var box = setupCanvas(cv), g = box.g, W = box.w, H = box.h;
    var n = list.length || 1;
    var peak = 1;
    list.forEach(function (d) { peak = Math.max(peak, d.value); });
    var slot = W / n, bw = Math.max(3, Math.min(18, slot * 0.6));
    var base = H - 1;
    // 只画一条 0 基线和柱子，不画刻度：这五张是"看趋势"的，精确数字在上面的"看数字"表里
    g.strokeStyle = "#2a313c"; g.lineWidth = 1;
    g.beginPath(); g.moveTo(0, base + 0.5); g.lineTo(W, base + 0.5); g.stroke();
    list.forEach(function (d, i) {
      var h = (d.value / peak) * (H - 6);
      if (d.value > 0 && h < 2) h = 2;
      var x = slot * (i + 0.5) - bw / 2;
      g.fillStyle = d.value ? "#1a9c8f" : "#26303a";
      roundTop(g, x, base - h, bw, Math.max(h, d.value ? 2 : 1.5), 3);
      g.fill();
    });
  }

  /* ---------------- 用户表 ---------------- */
  function renderUsers() {
    var box = $("adUsers");
    box.replaceChildren();
    var kw = state.filter.trim().toLowerCase();
    var list = state.users.filter(function (u) {
      if (!kw) return true;
      return u.nickname.toLowerCase().indexOf(kw) >= 0 || (u.lastLoginIp || "").indexOf(kw) >= 0;
    });
    $("adUserNote").textContent = kw
      ? "筛出 " + list.length + " 个（共 " + state.users.length + "）"
      : "共 " + state.users.length + " 个账号 · 点任意一行看详细资料";

    if (!list.length) { box.append(el("div", "ad-empty", "没有匹配的账号")); return; }

    var table = el("table", "ad-ut");
    var thead = el("thead"), htr = el("tr");
    ["用户", "最近登录", "登录 IP", "最近结束游玩", "累计游玩", "状态", "操作"].forEach(function (h) {
      htr.append(el("th", "", h));
    });
    thead.append(htr);
    var tbody = el("tbody");

    list.forEach(function (u) {
      var tr = el("tr", "row");
      tr.tabIndex = 0;

      var tdName = el("td");
      var nm = el("div", "nm");
      nm.append(el("i", "dot" + (u.online ? " on" : "")));
      nm.append(el("span", "", u.nickname));
      if (u.admin) nm.append(el("span", "tag admin", "管理员"));
      if (u.banned) nm.append(el("span", "tag banned", "已封禁"));
      tdName.append(nm);

      var tdLogin = el("td", "muted", u.lastLoginAt || "—");
      var tdIp = el("td", "ip", u.lastLoginIp || "—");
      var tdEnd = el("td", "muted", u.lastPlayEnd || "—");
      var tdDur = el("td", "num muted", fmtDur(u.playSeconds));

      var tdState = el("td");
      if (u.banned) {
        tdState.append(el("span", "tag banned", u.banForever ? "永久封禁" : "封到 " + u.bannedUntil));
      } else {
        tdState.append(el("span", "tag " + (u.online ? "on" : "off"), u.online ? "在线" : "离线"));
      }

      var tdAct = el("td");
      var btnDetail = el("button", "ad-btn small", "详情");
      btnDetail.onclick = function (e) { e.stopPropagation(); openDetail(u.id); };
      tdAct.append(btnDetail);
      if (!u.admin) {
        var btnBan = el("button", "ad-btn small " + (u.banned ? "ok" : "danger"), u.banned ? "解封" : "封号");
        btnBan.style.marginLeft = "6px";
        btnBan.onclick = function (e) {
          e.stopPropagation();
          if (u.banned) unban(u); else openBan(u);
        };
        tdAct.append(btnBan);
      }

      [tdName, tdLogin, tdIp, tdEnd, tdDur, tdState, tdAct].forEach(function (td) { tr.append(td); });
      tr.onclick = function () { openDetail(u.id); };
      tr.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetail(u.id); } };
      tbody.append(tr);
    });

    table.append(thead, tbody);
    box.append(table);
  }

  /* ---------------- 用户详情 ---------------- */
  function openDetail(id) {
    api("/api/mp/admin/user/" + id).then(function (data) {
      state.openId = id;
      renderDetail(data);
      $("adMask").hidden = false;
      $("adDetail").hidden = false;
      $("adDetailTitle").textContent = data.profile.nickname + " 的资料";
    }).catch(function (e) { alert("打不开：" + e.message); });
  }
  function closeDetail() {
    state.openId = null;
    $("adDetail").hidden = true;
    $("adMask").hidden = true;
  }

  function avatarCanvas(look, size) {
    var box = el("div", "ad-avatar");
    try {
      if (window.MPLook && window.MPLook.avatar) {
        var cv = window.MPLook.avatar(look || window.MPLook.fallback);
        if (cv && cv.style) {
          if (size) { cv.style.width = size + "px"; cv.style.height = size + "px"; }
          box.append(cv);
          return box;
        }
      }
    } catch (e) {}
    box.append(el("div", "none", "形象读不出来"));
    return box;
  }

  function renderDetail(data) {
    var body = $("adDetailBody");
    body.replaceChildren();
    var p = data.profile, c = data.counts;
    var user = state.users.filter(function (u) { return u.id === p.id; })[0] || {};

    // 形象 + 资料
    var idc = el("div", "ad-idcard");
    idc.append(avatarCanvas(p.look));
    var dl = el("dl");
    [["编号", "#" + p.id], ["昵称", p.nickname], ["学院", p.college || "—"],
     ["年级", p.grade || "—"], ["签名", p.bio || "—"],
     ["标签", (p.tags && p.tags.length) ? p.tags.join("、") : "—"]].forEach(function (kv) {
      dl.append(el("dt", "", kv[0]), el("dd", "", kv[1]));
    });
    idc.append(dl);
    body.append(idc);

    // 账号活动
    var kvBox = el("dl", "ad-kv");
    kvBox.append(el("dt", "", "最近登录"), el("dd", "", user.lastLoginAt || "—"));
    kvBox.append(el("dt", "", "登录 IP"), el("dd", "mono", user.lastLoginIp || "—"));
    kvBox.append(el("dt", "", "最近结束游玩"), el("dd", "", user.lastPlayEnd || "—"));
    kvBox.append(el("dt", "", "累计游玩"), el("dd", "", fmtDur(user.playSeconds) + (user.playCount ? "（" + user.playCount + " 段）" : "")));
    kvBox.append(el("dt", "", "注册时间"), el("dd", "", user.createdAt || "（老账号，没记）"));

    var dtPwd = el("dt", "", "密码"), ddPwd = el("dd");
    if (user.hasPassword) {
      var hidden = el("span", "mono", "••••••••");
      var btnShow = el("button", "ad-btn small", "显示");
      btnShow.style.marginLeft = "8px";
      btnShow.onclick = function () {
        btnShow.disabled = true;
        api("/api/mp/admin/password/" + p.id).then(function (r) {
          hidden.textContent = r.password;
          btnShow.remove();
        }).catch(function (e) { btnShow.disabled = false; alert(e.message); });
      };
      ddPwd.append(hidden, btnShow);
    } else {
      ddPwd.append(el("span", "muted", "这个账号在密码备份功能上线前就注册了，库里只有哈希，取不回来"));
    }
    kvBox.append(dtPwd, ddPwd);

    var dtBan = el("dt", "", "封禁"), ddBan = el("dd");
    if (user.banned) {
      ddBan.append(el("span", "", (user.banForever ? "永久封禁" : "封到 " + user.bannedUntil) + (user.banReason ? " · " + user.banReason : "")));
      if (!user.admin) {
        var btnUnban = el("button", "ad-btn small ok", "解封");
        btnUnban.style.marginLeft = "8px";
        btnUnban.onclick = function () { unban(user); };
        ddBan.append(btnUnban);
      }
    } else {
      ddBan.append(el("span", "muted", "正常"));
      if (!user.admin) {
        var btnBan2 = el("button", "ad-btn small danger", "封禁这个号");
        btnBan2.style.marginLeft = "8px";
        btnBan2.onclick = function () { openBan(user); };
        ddBan.append(btnBan2);
      }
    }
    kvBox.append(dtBan, ddBan);
    body.append(kvBox);

    body.append(playSection(data.plays || []));

    // 发过什么
    body.append(section("留言板留言", c.board, data.board, function (x) {
      return { meta: x.at, txt: x.content };
    }));
    body.append(section("楼宇留言", c.comments, data.buildingComments, function (x) {
      return { meta: x.bld + " · " + x.at, txt: x.content };
    }));
    body.append(photoSection(c.photos, data.photos));
    body.append(section("私聊发出", c.chats, data.chats, function (x) {
      return { meta: "发给 " + x.nickname + " · " + x.at, txt: x.content };
    }));
  }

  /* 每一段游玩的起止时间 —— 这是"几点来、几点走"最直接的样子 */
  function playSection(list) {
    var box = el("div", "ad-sec");
    var h = el("h3", "", "最近游玩记录");
    h.append(el("span", "", list.length ? "最近 " + list.length + " 段，从新到旧" : ""));
    box.append(h);
    if (!list.length) { box.append(el("div", "none", "还没有联机游玩记录（登录了但没进地图也算没玩）")); return box; }
    var ul = el("ul");
    list.forEach(function (p) {
      var li = el("li");
      var start = String(p.start || "").slice(5);           // 去掉年份，留 11-04 15:02
      var when = p.end ? (start + " → " + String(p.end).slice(5)) : (start + " 开始，现在还在玩");
      li.append(el("div", "meta", when));
      li.append(el("div", "txt", "玩了 " + fmtDur(p.seconds) + (p.ip ? " · " + p.ip : "")));
      ul.append(li);
    });
    box.append(ul);
    return box;
  }

  function section(title, total, list, pick) {
    var box = el("div", "ad-sec");
    var h = el("h3", "", title);
    h.append(el("span", "", "共 " + total + " 条" + (list.length < total ? "，这里显示最近 " + list.length + " 条" : "")));
    box.append(h);
    if (!list.length) { box.append(el("div", "none", "还没有")); return box; }
    var ul = el("ul");
    list.forEach(function (x) {
      var info = pick(x);
      var li = el("li");
      li.append(el("div", "meta", info.meta));
      li.append(el("div", "txt", info.txt || "（空）"));
      ul.append(li);
    });
    box.append(ul);
    return box;
  }

  function photoSection(total, list) {
    var box = el("div", "ad-sec");
    var h = el("h3", "", "上传的照片");
    h.append(el("span", "", "共 " + total + " 张" + (list.length < total ? "，这里显示最近 " + list.length + " 张" : "")));
    box.append(h);
    if (!list.length) { box.append(el("div", "none", "还没有")); return box; }
    var ul = el("ul");
    list.forEach(function (x) {
      var li = el("li");
      li.append(el("div", "meta", x.bld + " · " + x.at));
      if (x.note) li.append(el("div", "txt", x.note));
      var img = el("img", "thumb");
      img.src = x.url;
      img.alt = x.bld + " 的照片";
      img.loading = "lazy";
      li.append(img);
      ul.append(li);
    });
    box.append(ul);
    return box;
  }

  /* ---------------- 封号 / 解封 ---------------- */
  var banTarget = null;

  function openBan(user) {
    banTarget = user;
    $("adBanTitle").textContent = "封禁 " + user.nickname;
    $("adBanErr").textContent = "";
    $("adBanReason").value = "";
    $("adBanUntil").value = "";
    $("adBanUntil").disabled = true;
    var radios = document.querySelectorAll('input[name="banmode"]');
    for (var i = 0; i < radios.length; i++) radios[i].checked = radios[i].value === "forever";
    $("adBan").hidden = false;
  }
  function closeBan() { $("adBan").hidden = true; banTarget = null; }

  function submitBan() {
    if (!banTarget) return;
    var mode = document.querySelector('input[name="banmode"]:checked').value;
    var body = { userId: banTarget.id, mode: mode, reason: $("adBanReason").value.trim() };
    if (mode === "until") {
      var raw = $("adBanUntil").value;
      if (!raw) { $("adBanErr").textContent = "先选一个解封时间"; return; }
      var ts = new Date(raw).getTime() / 1000;
      if (!(ts > Date.now() / 1000)) { $("adBanErr").textContent = "解封时间要晚于现在"; return; }
      body.until = ts;
    }
    $("adBanOk").disabled = true;
    api("/api/mp/admin/ban", { method: "POST", body: body }).then(function (r) {
      state.users = r.users || state.users;
      closeBan(); renderCards(); renderUsers();
      if (state.openId) openDetail(state.openId);
    }).catch(function (e) {
      $("adBanErr").textContent = e.message;
    }).then(function () { $("adBanOk").disabled = false; });
  }

  function unban(user) {
    if (!confirm("解封 " + user.nickname + "？解封后这个号马上能登录。")) return;
    api("/api/mp/admin/unban", { method: "POST", body: { userId: user.id } }).then(function (r) {
      state.users = r.users || state.users;
      renderCards(); renderUsers();
      if (state.openId) openDetail(state.openId);
    }).catch(function (e) { alert("解封失败：" + e.message); });
  }

  /* =============================================================================
     页签二：网络安全（2026-11-04）
     -----------------------------------------------------------------------------
     服务端才是唯一裁判：哪些 IP 在敲门、封了谁、端口是谁开的，全由 security_payload()
     算好；这里只负责摆。口径要改改服务端，别在这里补算。
     ========================================================================== */
  var SEC = { data: null, hover: -1, geo: null, loaded: false };

  function loadSec() {
    loadWaf();
    return api("/api/mp/admin/security").then(function (d) {
      SEC.data = d;
      SEC.loaded = true;
      renderSecCards(); renderSecChart(); renderSecNum(); renderPorts();
      renderSwitches(); renderSecIps(); renderSecBans(); renderSecScans(); renderSecFails();
    }).catch(function (e) { alert("安全数据加载失败：" + e.message); });
  }

  /* -----------------------------------------------------------------------------
     WAF：CrowdSec 的拦截数据。它自己有一套网页控制台，我们不用——数据从本地 API
     读过来，摆进这一页，跟自家封禁名单挨着看。
     -------------------------------------------------------------------------- */
  var WAF = { data: null };
  var WAF_REASON = {
    "crowdsecurity/ssh-bf": "SSH 暴力破解",
    "crowdsecurity/ssh-slow-bf": "SSH 慢速爆破",
    "crowdsecurity/http-probing": "在猜有哪些路径",
    "crowdsecurity/http-sensitive-files": "在翻敏感文件",
    "crowdsecurity/http-bad-user-agent": "工具特征明显的 UA",
    "crowdsecurity/http-crawl-non_statics": "疯狂抓全站",
    "crowdsecurity/http-path-traversal-probing": "在试目录穿越",
    "crowdsecurity/http-xss-probing": "在试跨站脚本",
    "crowdsecurity/http-sql-injection": "在试 SQL 注入",
    "crowdsecurity/http-generic-bf": "在猜口令",
    "crowdsecurity/nginx-req-limit-exceeded": "请求太密"
  };
  var WAF_ORIGIN = {
    cscli: "手动加的",
    crowdsec: "本机抓到",
    CAPI: "社区情报",
    lists: "社区情报",
    console: "云端控制台"
  };
  /* 怎么处理的：默认是整包丢掉，少数场景配成弹验证码或只记录 */
  var WAF_ACTION = { ban: "", captcha: "弹验证码", bypass: "只记录", throttle: "限速" };

  function loadWaf() {
    return api("/api/mp/admin/waf").then(function (d) { WAF.data = d; renderWaf(); })
      .catch(function () { WAF.data = { installed: true, running: false, count: 0, decisions: [], error: "读取失败" }; renderWaf(); });
  }

  function wafLeft(sec) {
    if (sec === null || sec === undefined) return "永久";
    if (sec <= 0) return "即将解封";
    var d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), m = Math.floor((sec % 3600) / 60);
    if (d) return d + " 天 " + h + " 小时";
    if (h) return h + " 小时 " + m + " 分";
    return Math.max(1, m) + " 分钟";
  }

  function renderWaf() {
    var box = $("secWaf"), tag = $("wafState");
    if (!box || !WAF.data) return;
    var d = WAF.data;
    box.replaceChildren();
    if (tag) tag.textContent = !d.installed ? "未接入" : (d.error ? "异常" : (d.running ? "运行中" : "未响应"));

    if (!d.installed) {
      box.append(el("div", "ad-empty", "没检测到 CrowdSec —— 不装游戏也照常跑，装上就多一层自动防护。"));
      return;
    }
    if (d.error) {
      box.append(el("div", "ad-empty", "连不上 WAF：" + d.error + "。可以先看服务是不是起着的。"));
      return;
    }
    // 社区情报是全网黑名单（一万多条），跟我们站没直接关系，只报个数不铺表格
    var line = el("div", "ad-note", "本机自己抓到 " + d.count + " 个"
      + (d.community ? "；另有 " + d.community + " 个社区情报 IP，在防火墙层一并挡着" : ""));
    line.style.margin = "0 0 8px";
    box.append(line);
    if (!d.count) {
      box.append(el("div", "ad-empty", "本机这会儿没拦到人 —— 说明没人针对我们捣乱。"));
      return;
    }
    var table = el("table", "ad-ut");
    var thead = el("thead"), htr = el("tr");
    ["IP / 归属地", "干了什么", "还剩多久", "来源"].forEach(function (h) { htr.append(el("th", "", h)); });
    thead.append(htr);
    var tbody = el("tbody");
    d.decisions.forEach(function (x) {
      var tr = el("tr");
      /* IP 那格复用安全页的写法：上面 IP，下面小字「省市区 · 运营商」 */
      tr.append(ipTd(x));
      tr.append(el("td", "muted", WAF_REASON[x.reason] || x.reason || "—"));
      tr.append(el("td", "", wafLeft(x.left)));
      var tdSrc = el("td", "muted");
      tdSrc.append(el("span", "", WAF_ORIGIN[x.origin] || x.origin || "—"));
      var how = WAF_ACTION[x.action] || "";
      if (how) tdSrc.append(el("span", "ad-detail", how));
      tr.append(tdSrc);
      tbody.append(tr);
    });
    table.append(thead, tbody);
    box.append(table);
  }

  function renderSecCards() {
    var box = $("secCards");
    if (!SEC.data) return;
    var d = SEC.data;
    var bad = d.ips.reduce(function (a, x) { return a + (x.bad || 0); }, 0);
    box.replaceChildren();
    [
      ["今日请求", d.today, "", "到现在为止，全站收到的请求数"],
      ["最近 24 小时来访 IP", d.ips.length, "teal", d.ips.length ? "最多的是 " + d.ips[0].ip + (d.ips[0].region ? "（" + d.ips[0].region + "）" : "") : "还没有记录"],
      ["封禁中的 IP", d.bans.length, "warn", d.bans.length ? "被挡的请求进不来" : "目前一个都没封"],
      ["24 小时内被拒的请求", bad, bad > 100 ? "warn" : "", "4xx / 5xx（找错门、没登录、扫站）"]
    ].forEach(function (c) {
      var card = el("div", "ad-card" + (c[2] ? " " + c[2] : ""));
      card.append(el("span", "", c[0]), el("b", "", String(c[1])), el("small", "", c[3]));
      box.append(card);
    });
  }

  /* 24 小时请求量：一个量、一根纵轴、柱子。单序列不需要图例，标题已经说明它是什么。 */
  function renderSecChart() {
    if (!SEC.data) return;
    var S = SEC.data.series;
    var cv = $("secChart");
    var box = setupCanvas(cv), g = box.g, W = box.w, H = box.h;
    var pad = { l: 44, r: 14, t: 16, b: 26 };
    var iw = Math.max(10, W - pad.l - pad.r), ih = Math.max(10, H - pad.t - pad.b);
    var peak = 0;
    S.forEach(function (d) { peak = Math.max(peak, d.value); });
    var step = niceStep(Math.max(1, peak / 4)), top = Math.max(step, Math.ceil(peak / step) * step);
    if (top === 0) top = 1;
    var slot = iw / Math.max(1, S.length);
    var barW = Math.max(3, Math.min(26, slot * 0.6));
    var y = function (v) { return pad.t + ih - (v / top) * ih; };

    g.font = '11px system-ui,"Microsoft YaHei",sans-serif';
    g.textBaseline = "middle";
    for (var t = 0; t <= top + 1e-9; t += step) {
      var ty = y(t);
      g.strokeStyle = t === 0 ? "#475261" : "#2a313c";
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(pad.l, Math.round(ty) + 0.5); g.lineTo(pad.l + iw, Math.round(ty) + 0.5); g.stroke();
      g.fillStyle = "#b9c9d5";
      g.textAlign = "right";
      g.fillText(String(Math.round(t)), pad.l - 8, ty);
    }

    // 横轴每三小时标一次，24 个标签排不下
    g.textAlign = "center";
    S.forEach(function (d, i) {
      if (i % 3 !== 0 && i !== S.length - 1) return;
      var cx = pad.l + slot * (i + 0.5);
      g.fillStyle = i === S.length - 1 ? "#f3efe3" : "#8e9aa8";
      g.fillText(d.hour, cx, pad.t + ih + 14);
    });

    S.forEach(function (d, i) {
      var cx = pad.l + slot * (i + 0.5);
      var h = ih * (d.value / top);
      if (d.value > 0 && h < 2) h = 2;
      g.fillStyle = i === SEC.hover ? "#d8ae33" : "#b08c22";
      if (h > 0) { roundTop(g, cx - barW / 2, pad.t + ih - h, barW, h, 4); g.fill(); }
    });

    var last = S[S.length - 1];
    if (last && last.value > 0) {
      g.fillStyle = "#f3efe3"; g.textAlign = "center";
      g.fillText(String(last.value), pad.l + slot * (S.length - 0.5), y(last.value) - 12);
    }

    SEC.geo = { pad: pad, slot: slot, S: S, top: top, iw: iw, ih: ih };
  }

  function secTooltip(i) {
    var geo = SEC.geo, tip = $("secTip");
    if (!geo || !geo.S[i]) { tip.hidden = true; return; }
    var d = geo.S[i];
    tip.replaceChildren();
    tip.append(el("b", "", d.hour), el("em", "", " · " + d.value + " 次请求"));
    tip.hidden = false;
    var x = geo.pad.l + geo.slot * (i + 0.5);
    var cy = geo.pad.t + geo.ih - (d.value / geo.top) * geo.ih;
    tip.style.left = Math.max(60, Math.min(x, geo.pad.l + geo.iw - 60)) + "px";
    tip.style.top = Math.max(44, cy - 10) + "px";
  }

  function bindSecHover() {
    var cv = $("secChart");
    if (!cv) return;
    cv.addEventListener("mousemove", function (e) {
      var geo = SEC.geo;
      if (!geo) return;
      var r = cv.getBoundingClientRect();
      var i = Math.floor((e.clientX - r.left - geo.pad.l) / geo.slot);
      if (i < 0 || i >= geo.S.length) i = -1;
      if (i !== SEC.hover) { SEC.hover = i; renderSecChart(); }
      if (i >= 0) secTooltip(i); else $("secTip").hidden = true;
    });
    cv.addEventListener("mouseleave", function () {
      SEC.hover = -1; $("secTip").hidden = true; renderSecChart();
    });
  }

  function renderSecNum() {
    if (!SEC.data) return;
    var table = $("secNum");
    table.replaceChildren();
    var hr = el("tr");
    ["时段", "请求数"].forEach(function (h) { hr.append(el("th", "", h)); });
    table.append(hr);
    SEC.data.series.forEach(function (d) {
      var tr = el("tr");
      tr.append(el("td", "", d.hour), el("td", "", String(d.value)));
      table.append(tr);
    });
  }

  function renderPorts() {
    var box = $("secPorts");
    if (!SEC.data) return;
    box.replaceChildren();
    if (!SEC.data.ports.length) {
      box.append(el("div", "ad-empty", "读不到端口表（多半是这台机器的 /proc 不给读），服务本身没问题"));
      return;
    }
    SEC.data.ports.forEach(function (p) {
      var card = el("div", "ad-port" + (p.mine ? " mine" : ""));
      card.append(el("span", "pn", ":" + p.port));
      var info = el("div", "pinfo");
      info.append(el("b", "", p.name || "（不认识的程序）"));
      info.append(el("span", "", (p.public ? "对外开放" : "只听本机") + " · " + p.host));
      card.append(info);
      card.append(el("span", "plock", p.mine ? "我们的" : "只读"));
      box.append(card);
    });
  }

  function renderSwitches() {
    if (!SEC.data) return;
    var m = $("secMaint");
    m.textContent = SEC.data.maintenance ? "维护模式：已开启" : "维护模式：已关闭";
    m.className = "ad-btn " + (SEC.data.maintenance ? "on" : "off");
    var a = $("secAutoban");
    a.textContent = SEC.data.autoban ? "自动封禁：已开启" : "自动封禁：已关闭";
    a.className = "ad-btn " + (SEC.data.autoban ? "on" : "off");
    $("secThreshold").value = SEC.data.autobanThreshold;
  }

  /* IP 那一格：上面是 IP，下面小字是归属地（省市区 · 运营商），查不到就没有第二行。 */
  function ipTd(obj) {
    var td = el("td", "ip");
    td.append(el("span", "", obj.ip));
    if (obj.mine) td.append(el("span", "tag self", "管理员本人"));
    if (obj.region) {
      var g = el("em", "ad-geo", obj.region);
      g.title = obj.region;   /* 太长被省略号截断时，鼠标停住能看全 */
      td.append(g);
    }
    return td;
  }

  function renderSecIps() {
    var box = $("secIps");
    if (!SEC.data) return;
    box.replaceChildren();
    if (!SEC.data.ips.length) { box.append(el("div", "ad-empty", "最近 24 小时还没有请求记录（服务刚起来？过几分钟再看）")); return; }
    var bannedSet = {};
    SEC.data.bans.forEach(function (b) { bannedSet[b.ip] = true; });

    var table = el("table", "ad-ut");
    var thead = el("thead"), htr = el("tr");
    ["IP", "24 小时请求", "其中被拒", "最近一分钟", "最近一次", "操作"].forEach(function (h) { htr.append(el("th", "", h)); });
    thead.append(htr);
    var tbody = el("tbody");
    SEC.data.ips.forEach(function (x) {
      var tr = el("tr");
      var tdIp = el("td", "ip");
      tdIp.append(el("span", "", x.ip));
      if (x.mine) tdIp.append(el("span", "tag self", "管理员本人"));
      if (bannedSet[x.ip]) { var tag = el("span", "tag banned", "已封"); tag.style.marginLeft = "6px"; tdIp.append(tag); }
      if (x.region) { var gI = el("em", "ad-geo", x.region); gI.title = x.region; tdIp.append(gI); }
      tr.append(tdIp);
      tr.append(el("td", "num", String(x.total)));
      tr.append(el("td", "num" + (x.bad ? "" : " muted"), String(x.bad)));
      tr.append(el("td", "num" + (x.recent > 50 ? "" : " muted"), String(x.recent)));
      tr.append(el("td", "muted", x.lastAt));
      var tdAct = el("td", "act");
      if (bannedSet[x.ip]) {
        var b = el("button", "ad-btn small ok", "解封");
        b.onclick = function () { unbanIp(x.ip); };
        tdAct.append(b);
      } else {
        var b2 = el("button", "ad-btn small danger", "封禁");
        b2.onclick = function () { openIpBan(x.ip); };
        tdAct.append(b2);
      }
      tr.append(tdAct);
      tbody.append(tr);
    });
    table.append(thead, tbody);
    box.append(table);
  }

  function renderSecBans() {
    var box = $("secBans");
    if (!SEC.data) return;
    box.replaceChildren();
    if (!SEC.data.bans.length) { box.append(el("div", "ad-empty", "还没有封过任何 IP")); return; }
    var table = el("table", "ad-ut");
    var thead = el("thead"), htr = el("tr");
    ["IP", "原因", "封到", "封的时间", "来源", "操作"].forEach(function (h) { htr.append(el("th", "", h)); });
    thead.append(htr);
    var tbody = el("tbody");
    SEC.data.bans.forEach(function (b) {
      var tr = el("tr");
      tr.append(ipTd(b));
      tr.append(el("td", "muted", b.reason || "—"));
      tr.append(el("td", "", b.until));
      tr.append(el("td", "muted", b.createdAt));
      tr.append(el("td", "", b.auto ? "系统自动" : "手动"));
      var tdAct = el("td", "act");
      var btn = el("button", "ad-btn small ok", "解封");
      btn.onclick = function () { unbanIp(b.ip); };
      tdAct.append(btn);
      tr.append(tdAct);
      tbody.append(tr);
    });
    table.append(thead, tbody);
    box.append(table);
  }

  function renderSecScans() {
    var box = $("secScans");
    if (!SEC.data) return;
    box.replaceChildren();
    if (!SEC.data.scans.length) {
      box.append(el("div", "ad-empty", "最近 24 小时没人扫站 —— 这是好消息"));
      return;
    }
    var table = el("table", "ad-ut");
    var thead = el("thead"), htr = el("tr");
    ["IP", "试的文件", "时间", "操作"].forEach(function (h) { htr.append(el("th", "", h)); });
    thead.append(htr);
    var tbody = el("tbody");
    SEC.data.scans.forEach(function (s) {
      var tr = el("tr");
      tr.append(ipTd(s));
      tr.append(el("td", "muted", s.path));
      tr.append(el("td", "muted", s.at));
      var tdAct = el("td", "act");
      var b = el("button", "ad-btn small danger", "封这个 IP");
      b.onclick = function () { openIpBan(s.ip); };
      tdAct.append(b);
      tr.append(tdAct);
      tbody.append(tr);
    });
    table.append(thead, tbody);
    box.append(table);
  }

  function renderSecFails() {
    var box = $("secFails");
    if (!SEC.data) return;
    box.replaceChildren();
    if (!SEC.data.loginFails.length) { box.append(el("div", "ad-empty", "没有登录失败的记录")); return; }
    var table = el("table", "ad-ut");
    var thead = el("thead"), htr = el("tr");
    ["IP", "试的昵称", "时间", "操作"].forEach(function (h) { htr.append(el("th", "", h)); });
    thead.append(htr);
    var tbody = el("tbody");
    SEC.data.loginFails.forEach(function (f) {
      var tr = el("tr");
      tr.append(ipTd(f));
      tr.append(el("td", "", f.nickname || "—"));
      tr.append(el("td", "muted", f.at));
      var tdAct = el("td", "act");
      var b = el("button", "ad-btn small danger", "封这个 IP");
      b.onclick = function () { openIpBan(f.ip); };
      tdAct.append(b);
      tr.append(tdAct);
      tbody.append(tr);
    });
    table.append(thead, tbody);
    box.append(table);
  }

  /* ---------------- 封禁 / 解封 IP ---------------- */
  function openIpBan(ip) {
    $("secBanIp").value = ip || "";
    $("secBanErr").textContent = "";
    $("secBanReason").value = "";
    $("secBanUntil").value = "";
    $("secBanUntil").disabled = true;
    var radios = document.querySelectorAll('input[name="ipmode"]');
    for (var i = 0; i < radios.length; i++) radios[i].checked = radios[i].value === "forever";
    $("secBanModal").hidden = false;
    $("secBanIp").focus();
  }
  function closeIpBan() { $("secBanModal").hidden = true; }

  function submitIpBan() {
    var ip = $("secBanIp").value.trim();
    if (!ip) { $("secBanErr").textContent = "先填一个 IP"; return; }
    var mode = document.querySelector('input[name="ipmode"]:checked').value;
    var body = { ip: ip, mode: mode, reason: $("secBanReason").value.trim() };
    if (mode === "until") {
      var raw = $("secBanUntil").value;
      if (!raw) { $("secBanErr").textContent = "先选一个解封时间"; return; }
      var ts = new Date(raw).getTime() / 1000;
      if (!(ts > Date.now() / 1000)) { $("secBanErr").textContent = "解封时间要晚于现在"; return; }
      body.until = ts;
    }
    $("secBanOk").disabled = true;
    api("/api/mp/admin/ip/ban", { method: "POST", body: body }).then(function (r) {
      SEC.data = r.security || SEC.data;
      closeIpBan();
      renderSecCards(); renderSecIps(); renderSecBans(); renderSecScans(); renderSecFails();
    }).catch(function (e) {
      $("secBanErr").textContent = e.message;
    }).then(function () { $("secBanOk").disabled = false; });
  }

  function unbanIp(ip) {
    if (!confirm("解封 " + ip + "？解封后这个 IP 马上能再访问。")) return;
    api("/api/mp/admin/ip/unban", { method: "POST", body: { ip: ip } }).then(function (r) {
      SEC.data = r.security || SEC.data;
      renderSecCards(); renderSecIps(); renderSecBans();
    }).catch(function (e) { alert("解封失败：" + e.message); });
  }

  function toggleMaint() {
    var on = !(SEC.data && SEC.data.maintenance);
    if (on && !confirm("打开维护模式？所有普通用户会马上看到“校园正在维护”，管理员和后台不受影响。")) return;
    api("/api/mp/admin/maintenance", { method: "POST", body: { on: on } }).then(function (r) {
      if (SEC.data) SEC.data.maintenance = r.maintenance;
      renderSwitches();
    }).catch(function (e) { alert("改不了：" + e.message); });
  }

  function toggleAutoban() {
    var on = !(SEC.data && SEC.data.autoban);
    if (on && !confirm("打开自动封禁？同一 IP 一分钟内请求超线会直接封 1 小时。\n学校网络常有多人共用一个出口 IP，开之前想清楚。")) return;
    var threshold = Number($("secThreshold").value) || 600;
    api("/api/mp/admin/autoban", { method: "POST", body: { on: on, threshold: threshold } }).then(function (r) {
      if (SEC.data) { SEC.data.autoban = r.autoban; SEC.data.autobanThreshold = r.threshold; }
      renderSwitches();
    }).catch(function (e) { alert("改不了：" + e.message); });
  }

  /* ---------------- 页签切换 ---------------- */
  function showPane(id) {
    var tabs = document.querySelectorAll(".ad-tab");
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle("on", tabs[i].getAttribute("data-pane") === id);
    $("paneMain").hidden = id !== "paneMain";
    $("paneSec").hidden = id !== "paneSec";
    if (id === "paneSec" && !SEC.loaded) loadSec();
    if (id === "paneSec") { renderSecChart(); }
    else { renderChart(); }
  }

  /* ---------------- 事件绑定 ---------------- */
  function bind() {
    $("adRefresh").onclick = function () {
      if (!$("paneSec").hidden) loadSec(); else loadAll();
    };
    // 页签
    var tabs = document.querySelectorAll(".ad-tab");
    for (var ti = 0; ti < tabs.length; ti++) {
      tabs[ti].onclick = (function (btn) {
        return function () { showPane(btn.getAttribute("data-pane")); };
      })(tabs[ti]);
    }
    $("secRefresh").onclick = loadSec;
    $("wafRefresh").onclick = loadWaf;
    $("secMaint").onclick = toggleMaint;
    $("secAutoban").onclick = toggleAutoban;
    $("secBanNew").onclick = function () { openIpBan(""); };
    $("secBanCancel").onclick = closeIpBan;
    $("secBanOk").onclick = submitIpBan;
    var ipRadios = document.querySelectorAll('input[name="ipmode"]');
    for (var ri = 0; ri < ipRadios.length; ri++) {
      ipRadios[ri].onchange = function () { $("secBanUntil").disabled = this.value !== "until"; };
    }
    // 安全页签开着且勾了"自动刷新"时，每 30 秒自己抓一次
    setInterval(function () {
      if (!$("paneSec").hidden && $("secAuto").checked) loadSec();
    }, 30000);
    $("adGateRetry").onclick = boot;
    $("adLogout").onclick = function () {
      api("/api/mp/logout", { method: "POST" }).catch(function () {}).then(function () {
        try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
        location.href = "/";
      });
    };
    $("adDays").onchange = function () {
      state.days = Number(this.value) || 7;
      api("/api/mp/admin/stats?days=" + state.days).then(function (s) {
        state.stats = s; renderCards(); renderChart(); renderNumTable(); renderApps();
      }).catch(function (e) { alert("加载失败：" + e.message); });
    };
    $("adFilter").oninput = function () { state.filter = this.value; renderUsers(); };
    $("adDetailClose").onclick = closeDetail;
    $("adMask").onclick = closeDetail;
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeDetail(); closeBan(); closeIpBan(); } });
    var radios = document.querySelectorAll('input[name="banmode"]');
    for (var i = 0; i < radios.length; i++) {
      radios[i].onchange = function () { $("adBanUntil").disabled = this.value !== "until"; };
    }
    $("adBanCancel").onclick = closeBan;
    $("adBanOk").onclick = submitBan;
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        renderChart(); renderApps(); renderSecChart();
      }, 150);
    });
    bindHover();
    bindSecHover();
  }

  bind();
  boot();
})();
