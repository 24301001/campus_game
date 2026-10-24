/* =====================================================================
 * 像素校园 · 二期联机网关（8090）
 * ---------------------------------------------------------------
 * 职责（任务书 §4.2 / §4.3）：只做**实时**这一件事 ——
 *   ① 验票：拿 8081 的主 JWT 去问 8081 本人「这是谁」，网关**不碰账号表**；
 *   ② 房间：一个场景一个广播组（§3.3），位置只同步给同场景的人；
 *   ③ 节流：客户端 10 Hz 上报 → 服务端 100 ms 合并广播（§7.1）；
 *   ④ 落库：位置每 10 s 或切场景时写 `mp_player`，心跳时写 `mp_presence`。
 *
 * ⚠️ 为什么是独立 Node 进程：8081 每改一行 Java 都要过 javac，机房那台机器上
 *    360 会拦（CreateProcess error=5）；而联机层要天天调，且它崩了不能把单机版带走。
 *
 * ┌──── 端口与依赖 ────────────────────────────────────────────────┐
 * │ 监听 8090；MySQL 连接池（mysql2/promise）；HTTP 依赖 Node 自带。│
 * └───────────────────────────────────────────────────────────────┘
 *
 * 关闭码约定（§6.1）：4001 同一账号在别处登录 / 4003 票无效 → 落单机 / 4008 心跳超时。
 * =============================================================== */

"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const mysql = require("mysql2/promise");

/* --- 0. 配置：全部可用环境变量覆盖，默认值对准本机一套的环境 ---------
   ⚠️ 数据库账号**不写死在本文件里**。它和 8081 用的是同一个库，唯一真相在
      `campus_game/backend/src/main/resources/application.yml`，这里去**读**它，
      免得同一条口令在两处漂移。（仓库是公开的，部署前请按 DEPLOY.md 轮换。） */
const CFG = {
  port: Number(process.env.MP_PORT || 8090),
  mainHost: process.env.MP_MAIN_HOST || "127.0.0.1",
  mainPort: Number(process.env.MP_MAIN_PORT || 8081),
  db: {
    host: process.env.MP_DB_HOST || "",
    port: Number(process.env.MP_DB_PORT || 3306),
    database: process.env.MP_DB_NAME || "coding_platform",
    user: process.env.MP_DB_USER || "",
    password: process.env.MP_DB_PASS || ""
  },
  /* §7.1 同步参数（写死，别调）。 */
  moveBatchMs: 100,       // 服务端广播合并
  flushMs: 10000,         // 位置落库
  offlineMs: 45000,       // 无心跳 45 s 判离线
  sweepMs: 15000,         // 扫描周期 = 客户端心跳周期
  /* 「同场景 且 距离 < 2 屏」的粗筛半径：客户端在 hello 里带自己那一档的
     2 倍视口过来覆盖这两个默认值（默认值 = 一期 1× 档 480×270 的两屏）。 */
  syncRx: 960,
  syncRy: 540,
  maxPeersPerScene: 30,   // §7.1 人数上限：服务端也兜一道，超出只多发 join 的裁剪
  msgMaxLen: 500,         // §6.1 私聊 ≤500 字
  announceMaxLen: 200,    // §7.3 公告 ≤200 字
  announceGapMs: 30000,   // §7.3 单人 ≥30 秒一条
  announcePerDay: 20,     // §7.3 每天 ≤20 条
  announceKeep: 50,       // §7.3 表里只留最新 50 条
  announceDays: 7,        // §7.3 超过 7 天不再展示
  verifyTtlMs: 60000      // 同一张票问 8081 的最长间隔
};

const DIRS = { up: 1, down: 1, left: 1, right: 1 };
const LOOK_MAX = 240;     // `look_json` 列宽 256，留点余量

/* --- 1. 数据库配置：从 application.yml 里捞 jdbc 那一截 -------------- */
function readDbFromYml() {
  const d = CFG.db;
  if (d.host && d.user) return;                       // 环境变量已经给全了
  const yml = process.env.MP_APP_YML || path.join(__dirname, "..", "..",
    "campus_game", "backend", "src", "main", "resources", "application.yml");
  let text = "";
  try { text = fs.readFileSync(yml, "utf8"); } catch (e) {
    console.warn("[mp] 读不到 " + yml + "（用环境变量 MP_DB_* 也行）：" + e.message);
    return;
  }
  /* ⚠️ 必须从 `url: jdbc:mysql` **往后**找 username/password：
     yml 里 mail.username 也叫 username，全局正则会捞到邮箱账号。 */
  const i = text.indexOf("url: jdbc:mysql");
  if (i < 0) return;
  const seg = text.slice(i, i + 400);
  const m = /jdbc:mysql:\/\/([^:/\s"]+):(\d+)\/([^?\s"]+)/.exec(seg);
  const u = /username:\s*"?([^\s"]+)"?/.exec(seg);
  const p = /password:\s*"?([^\s"]*)"?\s*$/m.exec(seg);
  if (m) { d.host = m[1]; d.port = Number(m[2]); d.database = m[3]; }
  if (u) d.user = u[1];
  if (p) d.password = p[1];
}
readDbFromYml();
if (!CFG.db.host || !CFG.db.user) {
  console.error("[mp] 数据库账号没拿到 —— 请确认 backend/application.yml 存在，" +
                "或设置 MP_DB_HOST / MP_DB_USER / MP_DB_PASS。");
  process.exit(1);
}

let pool = null;
function db() {
  if (!pool) pool = mysql.createPool({
    host: CFG.db.host, port: CFG.db.port, database: CFG.db.database,
    user: CFG.db.user, password: CFG.db.password,
    /* ⚠️ §4.3 唯一硬约束：**连接池**，不许每来一条消息建一次连接。 */
    connectionLimit: 10, waitForConnections: true, queueLimit: 0,
    charset: "utf8mb4_unicode_ci", dateStrings: false
  });
  return pool;
}
/* 落库这件事**永远不能拖垮实时**：所有 SQL 都走这个包装，失败只打日志。 */
function safeSql(sql, args, tag) {
  return db().execute(sql, args).catch(e => {
    console.warn("[mp][sql:" + (tag || "?") + "] " + e.code + " " + e.message);
  });
}

/* --- 2. 验票：问 8081 本人 -------------------------------------------
   `GET /api/user/info` 是主站现成的接口（Spring Security 的过滤器已经替我们
   判过票了），返回 `{code:200,data:{id,username,nickname,role}}`。
   ⚠️ 走这条路 = **不用给 8081 加新接口、不用重编 Java**（§13 风险 7）。
   结果按票缓存 60 s：同一个人刷新页面不必再问一遍。 */
const VERIFY_CACHE = new Map();
function verifyToken(token) {
  const hit = VERIFY_CACHE.get(token);
  if (hit && Date.now() - hit.at < CFG.verifyTtlMs) return Promise.resolve(hit.user);
  return new Promise((resolve, reject) => {
    const req = http.get({
      host: CFG.mainHost, port: CFG.mainPort, path: "/api/user/info",
      headers: { "Authorization": "Bearer " + token }, timeout: 3000
    }, res => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", c => { body += c; if (body.length > 65536) req.destroy(); });
      res.on("end", () => {
        if (res.statusCode !== 200) { resolve(null); return; }   // 401/403 ⇒ 票不活
        let j = null;
        try { j = JSON.parse(body); } catch (e) { resolve(null); return; }
        const d = j && j.data;
        if (!d || !d.id) { resolve(null); return; }
        const user = { id: Number(d.id), nickname: String(d.nickname || d.username || ("玩家" + d.id)), username: String(d.username || "") };
        VERIFY_CACHE.set(token, { at: Date.now(), user });
        resolve(user);
      });
    });
    req.on("timeout", () => { req.destroy(new Error("8081 超时")); });
    req.on("error", reject);
  });
}

/* --- 3. 运行时状态 --------------------------------------------------- */
const rooms = new Map();      // scene -> Set(conn)
const byUser = new Map();     // userId -> conn（单端登录，§13 风险 8）
let nextCid = 1;
function room(scene) {
  let s = rooms.get(scene);
  if (!s) { s = new Set(); rooms.set(scene, s); }
  return s;
}

function send(c, obj) {
  if (!c || c.ws.readyState !== WebSocket.OPEN) return;
  /* 每条消息都要 JSON.stringify：昵称是中文，`btoa` 那类二进制拼接一律不许用（§13 风险 9）。 */
  try { c.ws.send(JSON.stringify(obj)); } catch (e) {}
}
function sendStr(c, str) {
  if (!c || c.ws.readyState !== WebSocket.OPEN) return;
  try { c.ws.send(str); } catch (e) {}
}
function err(c, code, msg, clientMsgId) {
  send(c, { type: "error", code, msg, clientMsgId });
}
function peerProfile(c) {
  return { id: c.userId, nickname: c.nickname, x: Math.round(c.x), y: Math.round(c.y),
           dir: c.dir, look: c.look };
}
/* 「同场景 且 距离 < 2 屏」：以**收的人**的视野为半径，别人才会看不见他。 */
function canSee(b, a) {
  return Math.abs(a.x - b.x) <= b.rx && Math.abs(a.y - b.y) <= b.ry;
}

function joinRoom(c, scene) {
  c.scene = scene;
  c.inRoom = true;
  room(scene).add(c);
}
/* 有人走了 / 换场景了：只通知**那些真的看见过他的人**，省掉全房间广播。 */
function announceLeave(c, reason) {
  const s = rooms.get(c.scene);
  if (!s) return;
  const msg = { type: "peer.leave", id: c.userId, reason };
  for (const b of s) if (b !== c && b.seen.delete(c.userId)) sendStr(b, JSON.stringify(msg));
}
function leaveRoom(c, reason) {
  /* ⚠️ 幂等：被 4001 顶掉的那条连接，握手时自己摘一次、`close` 事件到了 WS 层还会再来一次。
     没有这道闸门的话，同一个 userId 会被 announceLeave 两遍，第二遍还会把别人 `seen`
     里的记录删掉 —— 那个人就再也收不到新来的 peer.join 了。 */
  if (!c.inRoom) return;
  c.inRoom = false;
  announceLeave(c, reason);
  const s = rooms.get(c.scene);
  if (s) { s.delete(c); if (!s.size) rooms.delete(c.scene); }
}

/* --- 4. 100 ms 合并广播（§7.1）-------------------------------------- */
function tickSync() {
  for (const s of rooms.values()) {
    if (s.size < 2) {
      /* 一个人的房间也要把 dirty 位置放平，否则他下次有人进来时会带着旧集合。 */
      for (const b of s) { b.moved = false; }
      continue;
    }
    const arr = Array.from(s);
    /* ① 可见集**整个重算**再和上一比 —— 谁进谁出都自动补 join/leave。
       半径变化（客户端缩放档位换了）走的是同一条路，不需要额外标记。 */
    for (const b of arr) {
      b.visible.clear();
      for (const a of arr) if (a !== b && canSee(b, a)) b.visible.add(a);
      for (const a of b.visible) {
        if (b.seen.has(a.userId)) continue;
        if (b.seen.size >= CFG.maxPeersPerScene) continue;      // §7.1 上限：超出不渲染，也不报错
        b.seen.add(a.userId);
        send(b, { type: "peer.join", peer: peerProfile(a) });
      }
      if (b.seen.size > b.visible.size) {
        for (const id of Array.from(b.seen)) {
          let inRange = false;
          for (const a of b.visible) if (a.userId === id) { inRange = true; break; }
          if (!inRange) { b.seen.delete(id); sendStr(b, JSON.stringify({ type: "peer.leave", id, reason: "range" })); }
        }
      }
    }
    /* ② 位置：同一个人的多帧合成一条（客户端 10 Hz → 这里最多 10 条/秒）。
       ⚠️ 只发给**已经收到过他 join** 的人，不然客户端会拿到一个不认识的人的坐标。 */
    const payload = new Map();
    for (const a of arr) {
      if (!a.moved) continue;
      a.moved = false;
      payload.set(a.userId, JSON.stringify({
        type: "peer.move", id: a.userId,
        x: Math.round(a.x), y: Math.round(a.y), dir: a.dir, t: Date.now()
      }));
    }
    if (!payload.size) continue;
    for (const b of arr) for (const [id, str] of payload) if (id !== b.userId && b.seen.has(id)) sendStr(b, str);
  }
}

/* --- 5. 落库：位置每 10 s / 切场景时；在线状态随心跳 ----------------- */
function flushPositions() {
  for (const c of byUser.values()) {
    if (!c.posDirty) continue;
    c.posDirty = false;
    safeSql("UPDATE mp_player SET last_x=?, last_y=?, last_scene=? WHERE user_id=?",
      [Math.round(c.x), Math.round(c.y), c.scene, c.userId], "pos");
  }
}
function touchPresence(c) {
  safeSql("INSERT INTO mp_presence (user_id, last_seen, last_scene) VALUES (?, NOW(), ?) " +
          "ON DUPLICATE KEY UPDATE last_seen=NOW(), last_scene=VALUES(last_scene)",
    [c.userId, c.scene], "presence");
}
/* 换设备登录时读回上次那份形象配方。查不到 / 库里是脏 JSON ⇒ null，让 hello 走默认。 */
async function loadStoredLook(userId) {
  try {
    const pool = await db();
    const rows = await pool.query("SELECT look_json FROM mp_player WHERE user_id=?", [userId]);
    const raw = rows && rows[0] && rows[0].length ? rows[0][0].look_json : "";
    if (!raw) return null;
    const o = JSON.parse(raw);
    return o && typeof o === "object" ? o : null;
  } catch (e) { console.warn("[mp] 读形象档案失败：" + e.message); return null; }
}
function upsertPlayer(c, lookJson) {
  safeSql("INSERT INTO mp_player (user_id, nickname, look_json, last_x, last_y, last_scene) " +
          "VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nickname=VALUES(nickname), " +
          "look_json=VALUES(look_json), last_x=VALUES(last_x), last_y=VALUES(last_y), last_scene=VALUES(last_scene)",
    [c.userId, c.nickname, lookJson, Math.round(c.x), Math.round(c.y), c.scene], "player");
}

/* 在线快照（§6.1 的 `presence`）：**全服**一份，不分场景 ——
   私聊窗顶部的"正在走动 / 已离开当前场景"、公告栏头像的绿点/灰点都读它。
   只有人进图、切场景、下线三种时刻才广播，量级 = 在线人数，不会成风暴（§13 风险 11）。 */
function presenceSnapshot() {
  const list = [];
  for (const u of byUser.values())
    list.push({ userId: u.userId, nickname: u.nickname, online: true,
                scene: u.helloDone ? u.scene : "", look: u.look || null });
  return { type: "presence", list };
}
function broadcastPresence(except) {
  const str = JSON.stringify(presenceSnapshot());
  for (const u of byUser.values()) if (u !== except) sendStr(u, str);
}

/* --- 6.5 私聊（模块 4，§7.2 / §7.4）---------------------------------
   真相源是 MySQL，网关只做「校验 + 落库 + 在线秒推」；离线的不推，
   等他下次 `hello` 时补拉（§7.6「一条不丢」）。 */
function pairOf(a, b) { return a < b ? [a, b] : [b, a]; }
async function ensureSession(a, b) {
  const [x, y] = pairOf(a, b);
  /* `ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`：插入和命中唯一键都返回同一个 id，
     省掉"再 SELECT 一次"的往返（并发首发时也不会拿到 0）。 */
  const [r] = await db().execute(
    "INSERT INTO mp_session (user_a, user_b) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)",
    [x, y]);
  return Number(r.insertId);
}
/* 未读补推：只在**重连/进图**时做，且不写 `read_at`（§7.4「打开即已读」由历史拉取触发）。
   客户端按 msgId 去重，所以同一条被补推两次也只会显示一次。 */
async function pushUnread(c) {
  try {
    const [rows] = await db().execute(
      "SELECT m.id, m.session_id, m.from_user, m.to_user, m.content, m.created_at, p.nickname " +
      "FROM mp_message m LEFT JOIN mp_player p ON p.user_id = m.from_user " +
      "WHERE m.to_user = ? AND m.read_at IS NULL ORDER BY m.id ASC LIMIT 200", [c.userId]);
    for (const r of rows) {
      send(c, {
        type: "chat.msg", sessionId: Number(r.session_id), from: Number(r.from_user),
        fromNickname: r.nickname || ("玩家" + r.from_user), to: Number(r.to_user),
        content: r.content, at: Number(r.created_at && r.created_at.getTime ? r.created_at.getTime() : Date.now()),
        msgId: Number(r.id)
      });
    }
    if (rows.length) console.log("[mp] " + c.nickname + "#" + c.userId + " 补推未读 " + rows.length + " 条");
  } catch (e) { console.warn("[mp] 补拉未读失败：" + e.message); }
}
function atOf(d) { return Number(d && d.getTime ? d.getTime() : Date.now()); }

/* --- 6.55 公告栏（模块 5，§7.3）---------------------------------------
   可见范围是 **L2 全服在线**：不分场景，人在机房里也收得到（§4「公告全服可见」）。
   限流在服务端**再算一遍**（§13 风险 13「公告刷屏」）：≤200 字 / ≥30 秒一条 /
   每天 ≤20 条 —— 每日条数问 MySQL，不记在连接上，否则刷新一次页面就能绕过。 */
function lookFromJson(raw) {
  if (typeof raw !== "string" || !raw) return null;
  try { const o = JSON.parse(raw); return o && typeof o === "object" ? o : null; } catch (e) { return null; }
}
function announceItemOf(r) {
  const uid = Number(r.user_id);
  const on = byUser.get(uid);
  return {
    id: Number(r.id), userId: uid,
    nickname: (on && on.nickname) || r.nickname || ("玩家" + uid),
    look: (on && on.look) || lookFromJson(r.look_json),
    content: r.content, at: atOf(r.created_at),
    /* 头像的绿点/灰点（§7.3）：在线由内存说了算，离线拿 `mp_presence.last_seen`。 */
    online: !!on, lastSeen: on ? 0 : (r.last_seen ? atOf(r.last_seen) : 0)
  };
}
async function announceRows(limit) {
  const [rows] = await db().execute(
    "SELECT a.id, a.user_id, a.content, a.created_at, p.nickname, p.look_json, s.last_seen " +
    "FROM mp_announcement a " +
    "LEFT JOIN mp_player p ON p.user_id = a.user_id " +
    "LEFT JOIN mp_presence s ON s.user_id = a.user_id " +
    "WHERE a.deleted=0 AND a.created_at > DATE_SUB(NOW(), INTERVAL " + CFG.announceDays + " DAY) " +
    "ORDER BY a.id DESC LIMIT " + limit);          // limit 是上面夹出来的整数，没有注入面
  return rows.map(announceItemOf);
}
/* 全服广播一份：所有在线连接都收，包含发送者自己（他那份就是回执）。 */
function broadcastAll(obj) {
  const str = JSON.stringify(obj);
  for (const u of byUser.values()) sendStr(u, str);
}

/* --- 6.6 协议处理 -----------------------------------------------------
   客户端 → 服务端类型见 §6.1：在场/位置/形象 + 私聊（模块 4）+ 公告（模块 5）。 */
const HANDLERS = {
  hello(c, m) {
    if (c.helloDone) return;                       // 报到只认第一次，后面用 scene.change
    c.helloDone = true;
    c.scene = normScene(m.scene);
    c.x = num(m.x, 0); c.y = num(m.y, 0); c.dir = normDir(m.dir);
    if (Array.isArray(m.view) && m.view.length === 2) { c.rx = clamp(num(m.view[0], c.rx), 240, 20000); c.ry = clamp(num(m.view[1], c.ry), 140, 20000); }
    applyLook(c, m.look || c.storedLook);            // 客户端没带 ⇒ 用库里那份（换设备）
    joinRoom(c, c.scene);
    upsertPlayer(c, c.lookJson);
    touchPresence(c);
    send(c, {
      type: "welcome",
      me: { id: c.userId, nickname: c.nickname, look: c.look },
      scene: c.scene,
      peers: Array.from(rooms.get(c.scene)).filter(a => a !== c && canSee(c, a)).slice(0, CFG.maxPeersPerScene).map(peerProfile),
      serverTime: Date.now()
    });
    /* 在线快照先给自己，再通知全场"多了一个人"；顺手补拉离线期间的私聊（§7.6）。 */
    send(c, presenceSnapshot());
    broadcastPresence(c);
    pushUnread(c);
    log(c, "进图 " + c.scene);
  },
  move(c, m) {
    if (!c.helloDone) return;
    /* 视口半径**必须在去重之前**处理：缩放档位变了但人站着不动时，
       客户端只会捎来一个带 `view` 的空 move —— 先 return 就把这次更新吞掉了。 */
    let viewChanged = false;
    if (Array.isArray(m.view) && m.view.length === 2) {
      const rx = clamp(num(m.view[0], c.rx), 240, 20000), ry = clamp(num(m.view[1], c.ry), 140, 20000);
      if (rx !== c.rx || ry !== c.ry) { c.rx = rx; c.ry = ry; viewChanged = true; }
    }
    const x = num(m.x, c.x), y = num(m.y, c.y), dir = normDir(m.dir) || c.dir;
    /* 位置没变不发（§6.1）：这里再兜一道，省掉客户端漏判的重复包。 */
    if (!viewChanged && x === c.x && y === c.y && dir === c.dir) return;
    c.x = x; c.y = y; c.dir = dir;
    c.moved = true; c.posDirty = true;
  },
  "scene.change"(c, m) {
    if (!c.helloDone) return;
    const to = normScene(m.to);
    if (to === c.scene) return;
    leaveRoom(c, "scene");                          // 旧房间：他走了
    c.x = num(m.x, c.x); c.y = num(m.y, c.y); c.dir = normDir(m.dir) || c.dir;
    joinRoom(c, to);
    c.seen.clear(); c.moved = false;
    flushOne(c);
    /* 新房间：给他一份完整名单（与 §6.3 时序② 同构），两端各推一次进出。 */
    send(c, {
      type: "welcome",
      me: { id: c.userId, nickname: c.nickname, look: c.look },
      scene: to,
      peers: Array.from(rooms.get(to)).filter(a => a !== c && canSee(c, a)).slice(0, CFG.maxPeersPerScene).map(peerProfile),
      serverTime: Date.now(), switched: true
    });
    send(c, presenceSnapshot());
    broadcastPresence(c);
    log(c, "切场景 → " + to);
  },
  "chat.send"(c, m) {
    const to = Math.trunc(num(m.to, 0));
    const cmid = String(m.clientMsgId || "").slice(0, 40);
    if (!c.helloDone) { err(c, "not_ready", "还没报到成功", cmid); return; }
    if (!(to > 0) || to === c.userId) { err(c, "bad_target", "不能给自己发消息", cmid); return; }
    const content = (typeof m.content === "string" ? m.content : "").replace(/\r\n?/g, "\n").trim();
    const len = [...content].length;                       // §7.4：≤500 **字**，按码点算，emoji 也只算一个
    if (!len) { err(c, "empty", "空消息不发出去", cmid); return; }
    if (len > CFG.msgMaxLen) { err(c, "too_long", "私聊最多 " + CFG.msgMaxLen + " 字", cmid); return; }
    /* clientMsgId 去重：客户端以为 ack 丢了而重发时，不写出两条（§6.1）。
       ⚠️ 必须排在限流**之前** —— 重发的是同一条已经收下的话，拿"一秒只能发一条"去拒它，
          客户端会把一条已经入库的消息标成"没发出去"。 */
    if (cmid && c.chatSeen.has(cmid)) { send(c, c.chatSeen.get(cmid)); return; }
    const now = Date.now();
    if (c.chatAt && now - c.chatAt < 1000) { err(c, "too_fast", "慢一点，一秒只能发一条", cmid); return; }
    if (!c.chatWin || now - c.chatWin > 60000) { c.chatWin = now; c.chatN = 0; }
    if (c.chatN >= 30) { err(c, "flood", "这一分钟发得太多了，歇一会儿再发", cmid); return; }
    c.chatAt = now; c.chatN++;
    (async () => {
      try {
        const sid = await ensureSession(c.userId, to);
        const t = Date.now();
        const [r] = await db().execute(
          "INSERT INTO mp_message (session_id, from_user, to_user, content, created_at) VALUES (?, ?, ?, ?, ?)",
          [sid, c.userId, to, content, new Date(t)]);
        const msgId = Number(r.insertId);
        const preview = [...content].slice(0, 60).join("");
        safeSql("UPDATE mp_session SET last_msg_at=?, last_preview=? WHERE id=?",
          [new Date(t), preview, sid], "session");
        const ack = { type: "chat.ack", clientMsgId: cmid, msgId, at: t, to };
        if (cmid) {
          c.chatSeen.set(cmid, ack);
          if (c.chatSeen.size > 200) c.chatSeen.delete(c.chatSeen.keys().next().value);
        }
        send(c, ack);
        const peer = byUser.get(to);
        if (peer) send(peer, {
          type: "chat.msg", sessionId: sid, from: c.userId, fromNickname: c.nickname,
          to, content, at: t, msgId
        });
      } catch (e) {
        console.warn("[mp][chat.send] " + e.code + " " + e.message);
        err(c, "save_failed", "这条没存下来，请再发一次", cmid);
      }
    })().catch(() => {});
  },
  "chat.history"(c, m) {
    const withUser = Math.trunc(num(m.withUser, 0));
    if (!(withUser > 0)) { err(c, "bad_target", "不认识这个人"); return; }
    const limit = Math.max(1, Math.min(50, Math.trunc(num(m.limit, 30)) || 30));
    const beforeId = Math.max(0, Math.trunc(num(m.beforeId, 0)));
    (async () => {
      try {
        const [x, y] = pairOf(c.userId, withUser);
        const [sr] = await db().execute("SELECT id FROM mp_session WHERE user_a=? AND user_b=?", [x, y]);
        const sid = sr.length ? Number(sr[0].id) : 0;
        if (!sid) { send(c, { type: "chat.history", withUser, list: [], hasMore: false, oldestId: 0 }); return; }
        const args = [sid];
        let sql = "SELECT id, from_user, to_user, content, created_at FROM mp_message WHERE session_id=?";
        if (beforeId) { sql += " AND id < ?"; args.push(beforeId); }
        /* `limit + 1` 决定 hasMore；这个数是上面夹出来的整数，拼进 SQL 没有注入面。 */
        sql += " ORDER BY id DESC LIMIT " + (limit + 1);
        const [rows] = await db().execute(sql, args);
        const hasMore = rows.length > limit;
        const list = rows.slice(0, limit).reverse().map(r => ({
          msgId: Number(r.id), from: Number(r.from_user), to: Number(r.to_user),
          content: r.content, at: atOf(r.created_at)
        }));
        send(c, { type: "chat.history", withUser, list, hasMore, oldestId: list.length ? list[0].msgId : 0 });
        /* 打开即已读（§7.4）：拉历史 = 窗口已经摊在他面前了。 */
        safeSql("UPDATE mp_message SET read_at=NOW(3) WHERE session_id=? AND to_user=? AND read_at IS NULL",
          [sid, c.userId], "read");
      } catch (e) {
        console.warn("[mp][chat.history] " + e.code + " " + e.message);
        err(c, "load_failed", "历史没拉下来，关掉窗口再点开试试");
      }
    })().catch(() => {});
  },
  /* 窗**开着期间**新到的消息没有再走一次历史，靠这条把 read_at 补上
     （§7.4「打开即写 read_at」；§6.1 冻结表里没这个类型，是最小扩展，见 chat.js §8.5）。 */
  "chat.read"(c, m) {
    const withUser = Math.trunc(num(m.withUser, 0));
    if (!(withUser > 0)) return;
    const [x, y] = pairOf(c.userId, withUser);
    safeSql("UPDATE mp_message SET read_at=NOW(3) WHERE session_id IN " +
            "(SELECT id FROM mp_session WHERE user_a=? AND user_b=?) AND to_user=? AND read_at IS NULL",
      [x, y, c.userId], "read2");
  },
  /* 发公告（§7.3）：`clientMsgId` 去重同私聊一条路 —— 客户端以为丢了而重发时，
     不插第二条，直接把原来那份 `announce.new` 再回给他一次。 */
  "announce.post"(c, m) {
    const cmid = String(m.clientMsgId || "").slice(0, 40);
    if (!c.helloDone) { err(c, "ann_not_ready", "还没报到成功", cmid); return; }
    const content = (typeof m.content === "string" ? m.content : "").replace(/\r\n?/g, "\n").trim();
    const len = [...content].length;                    // ≤200 **字**，按码点算
    if (!len) { err(c, "ann_empty", "空公告不发出去", cmid); return; }
    if (len > CFG.announceMaxLen) { err(c, "ann_too_long", "公告最多 " + CFG.announceMaxLen + " 字", cmid); return; }
    /* 去重同私聊一条规矩：**排在限流之前**。重发的是同一条已经收下并广播过的公告，
       用"30 秒一条"去拒它，客户端会把公告板上已经挂着的那条标成"没发出去"。 */
    if (cmid && c.annSeen.has(cmid)) { send(c, c.annSeen.get(cmid)); return; }
    const now = Date.now();
    if (c.announceAt && now - c.announceAt < CFG.announceGapMs) {
      err(c, "ann_too_fast", "公告最快 " + (CFG.announceGapMs / 1000) + " 秒一条", cmid); return;
    }
    (async () => {
      try {
        const [dn] = await db().execute(
          "SELECT COUNT(*) AS n FROM mp_announcement WHERE user_id=? AND deleted=0 AND created_at >= CURDATE()",
          [c.userId]);
        if (Number(dn[0] && dn[0].n) >= CFG.announcePerDay) {
          err(c, "ann_daily", "今天公告发满了（每天 " + CFG.announcePerDay + " 条），明天再来", cmid); return;
        }
        const t = Date.now();
        const [r] = await db().execute(
          "INSERT INTO mp_announcement (user_id, content, created_at) VALUES (?, ?, ?)",
          [c.userId, content, new Date(t)]);
        c.announceAt = t;
        const msg = {
          type: "announce.new", id: Number(r.insertId), userId: c.userId, nickname: c.nickname,
          look: c.look || null, content, at: t, online: true, lastSeen: 0, clientMsgId: cmid
        };
        if (cmid) {
          c.annSeen.set(cmid, msg);
          if (c.annSeen.size > 40) c.annSeen.delete(c.annSeen.keys().next().value);
        }
        broadcastAll(msg);
        /* 「保留最新 50 条」就地裁一次：内层派生表带 LIMIT，MySQL 才会真的物化，
           不然报 "Table is specified twice"。裁失败不影响公告已经发出去。 */
        safeSql("DELETE FROM mp_announcement WHERE id NOT IN " +
                "(SELECT id FROM (SELECT id FROM mp_announcement WHERE deleted=0 ORDER BY id DESC LIMIT " +
                CFG.announceKeep + ") AS keep50)", [], "ann_trim");
        log(c, "发公告 #" + msg.id);
      } catch (e) {
        console.warn("[mp][announce.post] " + e.code + " " + e.message);
        err(c, "ann_save_failed", "这条公告没发出去，再试一次", cmid);
      }
    })().catch(() => {});
  },
  "announce.list"(c, m) {
    const limit = Math.max(1, Math.min(CFG.announceKeep, Math.trunc(num(m.limit, CFG.announceKeep)) || CFG.announceKeep));
    (async () => {
      try { send(c, { type: "announce.list", items: await announceRows(limit) }); }
      catch (e) {
        console.warn("[mp][announce.list] " + e.code + " " + e.message);
        err(c, "ann_load_failed", "公告没拉下来，稍后再点开");
      }
    })().catch(() => {});
  },
  "look.update"(c, m) {
    if (!applyLook(c, m.look)) return;
    safeSql("UPDATE mp_player SET look_json=? WHERE user_id=?", [c.lookJson, c.userId], "look");
    const msg = JSON.stringify({ type: "peer.look", id: c.userId, look: c.look });
    const s = rooms.get(c.scene);
    if (s) for (const b of s) if (b !== c) sendStr(b, msg);
    log(c, "换形象");
  },
  ping(c) {
    c.alive = true; c.lastBeat = Date.now();
    /* 心跳顺手刷新在线状态（§7.6 的「3 分钟前在线」就靠这一行）。 */
    if (Date.now() - (c.presenceAt || 0) > 20000) { c.presenceAt = Date.now(); touchPresence(c); }
    send(c, { type: "pong", serverTime: Date.now() });
  }
};

function flushOne(c) {
  c.posDirty = false;
  safeSql("UPDATE mp_player SET last_x=?, last_y=?, last_scene=? WHERE user_id=?",
    [Math.round(c.x), Math.round(c.y), c.scene, c.userId], "pos1");
  touchPresence(c);
}
function log(c, what) {
  console.log("[mp] " + c.nickname + "#" + c.userId + " " + what +
              "　在线 " + byUser.size + "　场景 " + c.scene);
}
function num(v, d) { const n = Number(v); return Number.isFinite(n) ? n : d; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function normDir(d) { return DIRS[d] ? d : ""; }
function normScene(s) {
  s = String(s || "out").replace(/[^a-z0-9_-]/gi, "").slice(0, 32);
  return s || "out";
}
/* 形象配方：只认 §8.4 那七个字段，值一律走白名单或颜色正则 ——
   网关**不信任客户端**，脏数据进 `look_json` 会把所有人的小人画崩。 */
const LOOK_ENUM = {
  hairStyle: ["short", "mid", "long", "ponytail", "bun", "curly"],
  eye: ["round", "narrow", "dot"],
  acc: ["none", "glasses", "cap", "scarf"]
};
const HEX = /^#[0-9a-fA-F]{6}$/;
function applyLook(c, raw) {
  const o = raw && typeof raw === "object" ? raw : {};
  const pick = (k, def) => LOOK_ENUM[k].indexOf(o[k]) >= 0 ? o[k] : def;
  const col = (k, def) => HEX.test(String(o[k] || "")) ? String(o[k]).toLowerCase() : def;
  const look = {
    skin: col("skin", "#e9bb92"),
    hairStyle: pick("hairStyle", "short"),
    hairColor: col("hairColor", "#241d1a"),
    eye: pick("eye", "round"),
    cloth: col("cloth", "#3f6ea8"),
    pants: col("pants", "#454c5a"),
    acc: pick("acc", "none")
  };
  const json = JSON.stringify(look);
  if (json.length > LOOK_MAX) return false;
  const changed = c.lookJson !== json;
  c.look = look; c.lookJson = json;
  return changed;
}

/* --- 7. 握手与生命周期 ------------------------------------------------ */
const server = http.createServer((req, res) => {
  /* 给启动器和人肉检查用的最小说明：`curl http://127.0.0.1:8090/` 能看到在线数。 */
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({
    ok: true, service: "pixelcampus-mp-gateway", online: byUser.size,
    scenes: Array.from(rooms.keys()).map(k => ({ scene: k, n: rooms.get(k).size }))
  }));
});
const wss = new WebSocket.Server({ server, path: "/mp", maxPayload: 16384 });

/* 🔴 这段的**顺序**是修出来的 bug，别再改动它：
   验票要问 8081，是异步的（几十到几百毫秒），而客户端 `onopen` 那一刻就把 `hello`
   发出来了。要是等验完票才挂 `message` 监听，这条 `hello` 就**掉在缝里没人接** ——
   症状是「连上了、票也对，可就是谁都不出现」，而且日志一个字都不报。
   所以：**监听先挂上，验票期间的消息进 `inbox` 排队**，票验好了再按原顺序补处理。 */
const INBOX_MAX = 24;
wss.on("connection", (ws, req) => {
  let token = "";
  try { token = new URL(req.url, "http://x").searchParams.get("token") || ""; } catch (e) {}
  const inbox = [];
  let c = null;

  ws.on("message", buf => {
    if (!c) { if (inbox.length < INBOX_MAX) inbox.push(buf); return; }
    dispatch(c, buf);
  });
  ws.on("pong", () => { if (c) { c.alive = true; c.lastBeat = Date.now(); } });
  ws.on("close", () => { if (c) dropConn(c, "left"); });
  ws.on("error", () => { if (c) dropConn(c, "error"); });

  (async () => {
    console.log("[mp] 握手 " + (req.socket.remoteAddress || "?") + " 票长 " + token.length);
    if (!token) { close(ws, 4003, "没有通行证"); return; }

    let user = null;
    try { user = await verifyToken(token); }
    catch (e) {
      /* 8081 连不上是**服务问题**，不是票问题：用 1011 关，客户端会当成一次普通失败去重连，
         不会误判成「票无效」把人踢回登录页。 */
      console.warn("[mp] 验票失败：" + e.message);
      close(ws, 1011, "主站暂时连不上");
      return;
    }
    if (!user) { close(ws, 4003, "通行证无效"); return; }
    if (ws.readyState !== WebSocket.OPEN) return;      // 排队期间对面已经走了

    /* 换设备登录时本地没有形象缓存 ⇒ 服务端 `mp_player.look_json` 那份才是他上次的脸
       （§10.3「形象配方：本地缓存 + 服务端为准」）。握手本来就要问 8081，这里顺手多查
       一行，不额外拖慢。 */
    let storedLook = null;
    try { storedLook = await loadStoredLook(user.id); } catch (e) {}
    if (ws.readyState !== WebSocket.OPEN) return;

    /* 单端登录（§13 风险 8）：新连接赢，旧连接吃 4001 且**不再自动重连**。 */
    const old = byUser.get(user.id);
    if (old) {
      old.kicked = true;
      send(old, { type: "error", code: "kicked", msg: "这个账号在别处登录了" });
      close(old.ws, 4001, "同一账号在别处登录");
      byUser.delete(user.id);
    }

    c = {
      cid: nextCid++, ws, userId: user.id, nickname: user.nickname, username: user.username,
      scene: "out", x: 0, y: 0, dir: "down",
      look: null, lookJson: "", storedLook: storedLook,
      rx: CFG.syncRx, ry: CFG.syncRy,
      seen: new Set(), visible: new Set(), moved: false, posDirty: false, inRoom: false,
      alive: true, lastBeat: Date.now(), helloDone: false, presenceAt: 0, kicked: false,
      /* 私聊与公告限流（§7.4 / §7.3）：两张 Map 兼作 clientMsgId 去重表。
         每日公告条数**不在这里记** —— 问 MySQL，刷新页面绕不过去。 */
      chatSeen: new Map(), chatAt: 0, chatWin: 0, chatN: 0,
      announceAt: 0, annSeen: new Map()
    };
    byUser.set(user.id, c);
    const queued = inbox.splice(0, inbox.length);
    for (const buf of queued) dispatch(c, buf);
  })().catch(e => console.warn("[mp] 握手流程出错：" + e.message));
});

function dispatch(c, buf) {
  let m;
  try { m = JSON.parse(buf.toString("utf8")); } catch (e) { return; }
  if (!m || typeof m !== "object" || typeof m.type !== "string") return;
  const h = HANDLERS[m.type];
  if (!h) { err(c, "unknown_type", "不认得这种消息：" + m.type); return; }
  try { h(c, m); } catch (e) { console.warn("[mp] 处理 " + m.type + " 出错：" + e.message); }
}

function dropConn(c, reason) {
  /* ⚠️ 「这条连接还代表不代表那个账号」和「他还在不在房间里」是两件事。
     被 4001 顶掉的那条正是这种组合：`byUser` 已经指向新连接了，可旧连接还挂在房间集合里 ——
     旧写法在这里整个 `return`，幽灵就永远留在房间里：别人每 100 ms 还在给他算可见集，
     每 10 s 又把他 `join` 回来一次（表现为"人早走了，地图上还站着一个不动的他"）。
     所以这里只跳过「不属于我的那份全局清理」，搬房间与落库照常做。 */
  const owned = byUser.get(c.userId) === c;
  if (owned) byUser.delete(c.userId);
  leaveRoom(c, c.kicked ? "kicked" : reason);
  if (c.helloDone) flushOne(c);                  // 没报过到的连接连坐标都没有，别把 last_x/y 写成 0
  if (owned) broadcastPresence(null);            // 头像绿点变灰（§7.3 / §7.6）
}
function close(ws, code, reason) {
  try { ws.close(code, reason); } catch (e) {}
}

/* --- 8. 定时器 -------------------------------------------------------- */
setInterval(tickSync, CFG.moveBatchMs);
setInterval(flushPositions, CFG.flushMs);
/* 判离线以 `offlineMs`（§7.1 写死 45 s）为准，不是"漏答一次 ping 就杀"。
   ⚠️ 旧写法只看了 `alive`：一个扫描周期（15 s）没收到 pong 就发 4008，
      实际比任务书早了三倍 —— 校园网里卡顿十几秒的人会被误判成离开，
      而且 `CFG.offlineMs` 这一行配置根本没人用（写了等于没写）。
      现在：漏答 pong 只是起疑，还要看"上一次心跳距今"够不够 45 秒，
      起疑期间每轮都再 ping 一次，对方一活过来就把 `lastBeat` 抹平。 */
setInterval(() => {
  for (const c of Array.from(byUser.values())) {
    if (!c.alive && Date.now() - (c.lastBeat || 0) >= CFG.offlineMs) {
      close(c.ws, 4008, "心跳超时"); dropConn(c, "timeout"); continue;
    }
    c.alive = false;
    try { c.ws.ping(); } catch (e) {}
  }
}, CFG.sweepMs);

/* --- 9. 起 ------------------------------------------------------------- */
server.listen(CFG.port, () => {
  console.log("[mp] 联机网关已启动  ws://127.0.0.1:" + CFG.port + "/mp　" +
              "验票→http://" + CFG.mainHost + ":" + CFG.mainPort +
              "　库→" + CFG.db.user + "@" + CFG.db.host + ":" + CFG.db.port + "/" + CFG.db.database);
  /* 开机先把库探一下：表没建就在日志里说清楚，别等人进图才报一堆 sql 警告。 */
  safeSql("SELECT 1 FROM mp_player LIMIT 1", [], "probe");
});
process.on("SIGINT", () => { console.log("\n[mp] 收工"); process.exit(0); });
