# 躲猫猫联机桥接 · 上线包

把 duo1 躲猫猫接成像素校园里的一个"游戏房间"：走到逸夫楼大厅里公告栏前按 F →
全屏弹出 CF 式房间大厅 → 建房/进房/准备 → 房主点开始 → 进 3D 逸夫楼打一局。

这块代码**独立成目录**，不塞进像素校园也不塞进 duo1：

| 本地 | 服务器落点 | 作用 |
|---|---|---|
| `bridge.py` | `/opt/campus_bridge/bridge.py` | 房间表 + 准备状态 + 开局发一次性房码。只听 `127.0.0.1:8300` |
| `lobby.html` | `/opt/campus_bridge/lobby.html` | CF 式大厅页（列表/建房/进房/准备/开始），由 bridge 直发 |
| `probe-pointer-lock.html` | `/opt/campus_bridge/probe-pointer-lock.html` | 实测页：duo1 开在 iframe 里指针锁能不能锁上（生死闸） |
| `duo1-bridge.js` | `/opt/campus_portal/mp/duo1-bridge.js` | 地图侧胶水：画公告栏 + 判靠近 + 冒提示 + 接 F + 开抽屉 |
| `campus-bridge.service` | `/etc/systemd/system/` | `User=wr`，`Restart=always` |
| `nginx-duo1-bridge.conf` | 抄进 `/etc/nginx/sites-available/campus-portal` | 只加一个 `location /game/`（2026-11-02 已由 `deploy.sh` 插入，这份留作人读） |
| `nginx-insert.py` | 由 deploy.sh 调 | 往 nginx 里插那段（锚点命中数断言，避开 `$host` 被 shell 吃掉） |
| `deploy.sh` | `~/duobridge/` | 首次上线：闸 md5 → 备份 → 服务 → nginx → 地图三处 → 公网验收 |
| `update.sh` | `~/duobridge/` | 只换公告栏脚本/大厅页/地图版本号，不重装服务 |
| `rollback.sh` | `~/duobridge/` | 全部退回 `.bak-duobridge`，停并禁用 `campus-bridge` |
| `test_bridge.py` | 不上线 | 本地 mock 全流程 **39 项**断言（含好友房密码 7 项） |
| `install.py` | 不上线 | 三处插座的幂等补丁器（改前重搜锚点、命中数必须对、改后骨架对账） |
| `shot.py` `runner_local.py` | 不上线 | 本地出图/演示：假大厅(8399) + bridge(8301) + 无头 Edge CDP |
| `截图_*.png` | 不上线 | 渲染留证（列表页 / 房主视角页） |
| `基线快照/` | 不上线 | 2026-11-02 从服务器拉下来的真件，补丁的定位基准 |
| `待部署/` | 上传它 | `基线快照` 打上补丁后的副本 |

**已于 2026-11-02 上线**：`campus-bridge` 在跑、nginx 已有 `/game/`、地图已引用
`mp/duo1-bridge.js?v=duobridge02`。备份三份都在（地图、`mp/server.py`、nginx 配置的 `.bak-duobridge`）。

## 上线顺序（每一步都可回滚）

0. 备份：`sudo cp -a /opt/campus_portal/mp/server.py{,.bak-duobridge}`、地图 HTML 同样处理、
   `sudo cp /etc/nginx/sites-available/campus-portal{,.bak-duobridge}`
1. 新目录：`sudo mkdir -p /opt/campus_bridge && sudo chown wr:wr /opt/campus_bridge`，
   放 `bridge.py`、`lobby.html`、`probe-pointer-lock.html`
2. 起服务：`sudo cp campus-bridge.service /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable --now campus-bridge`
   验收：`curl -s http://127.0.0.1:8300/game/healthz`
3. nginx：加 `location /game/` → `sudo nginx -t && sudo systemctl reload nginx`
   验收：`curl -s -o /dev/null -w '%{http_code}\n' http://38.247.162.154/game/duo1/` = 200
4. **先过生死闸**：浏览器开 `http://38.247.162.154/game/probe-pointer-lock`，
   画面加载完**用鼠标点一下 3D 画面**。出 PASS ⇒ `ENTER_MODE="iframe"`；
   出 FAIL ⇒ 把 `duo1-bridge.js` 顶上 `ENTER_MODE` 改成 `"tab"` 再继续
5. duo1 侧：上传打好补丁的 `待部署/net.js` → `/opt/campus_duo1/duo1/net.js`，
   并把 `index.html` 的 `main.js?v=duo101` 和 `main.js` 里的 `net.js?v=`、`map.js?v=` 一起 bump 成 `duo102`
6. 地图侧：上传 `待部署/duo1-bridge.js` → `/opt/campus_portal/mp/`，
   上传 `待部署/map_live.html` → `/opt/campus_portal/像素校园_全校地图.html`，
   上传 `待部署/server.py` → `/opt/campus_portal/mp/server.py` 后
   `sudo systemctl restart campus-lobby`（白名单在 server.py 里，必须重启才生效）
7. 回归：`systemctl is-active` 九个服务全 active；公网 `/`、`/agent`、`/duo1/`、`/game/duo1/` 都 200；
   地图登录 → 进逸夫楼 → 公告栏前按 F → 大厅出来

## 验收清单（哪些验了什么，别混）

- `test_bridge.py` 39 项：鉴权（无 token 一律 401）、建房、一人开局被拒、进房、第三人满员被拒、
  对方没准备开局被拒、非房主开局 403、开局发码、房码 5 位且字符集与 `net.js` 一致、
  房码只对房内成员可见、游戏中不接新人、结束作废、下局换码、离开、房主走即关房、
  页面路由不吃 JSON 路由、编码路径穿越拿不到文件、
  **一人只能占一间房**（并发刷列表那条路堵掉）+ 离开后允许重开、
  **好友房**：带密码建房、响应里不含密码原文、没给密码 403、密码不对 403、密码对进房、
  已在房里的人重进不再要密码、局外人只看到 `locked` 看不到密码或哈希。
  **它验的是我这套桥接的判决逻辑，不验 duo1 能不能连上、不验浏览器渲染。**
- 浏览器实测（`browser-use` 读计算样式，不看图）：没进房时右卡 `display:none`、
  进房后 `flex` + 座位数对 + 房主侧 `startDisabled:false`；好友房那一行有 `锁` 标签和行内密码框，
  输对密码能进；**行内密码在 1.5 秒重画后值和焦点都还在**（不保就会打字被刷掉）。
- 渲染留证：`截图_大厅列表.png`（7 间房、板子顶到屏幕底、列表内滚）、
  `截图_房间内_房主视角.png`。这两张也各抓出一个 bug：右卡该藏不藏、自己的满房显示"进不去"。

**好友房密码的边界（说清楚，别当安全功能）**：服务端只存 `sha256(房间id + ":" + 密码)`，
密码不进内存原文、不进任何响应、不进日志。但整站是 **HTTP 没有 TLS**（交付文档 §7.1），
所以密码在网络上仍是明文可被同路径的人读到 —— 它挡的是"路人随便进房"，不挡"有心人 sniff"。
要真闭掉得上 HTTPS，那是另一件事。
- `install.py`：锚点命中数 + 幂等（重跑全 SKIP）+ 骨架对账 + `node --check` 已过。
  **它不验公告栏画得对不对、位置挡不挡路。**
- 还没做的两项：
  - 走道复核 —— 公告栏立牌 `x[188,212]` 落在左柱与咨询台之间 84px 走道里，左右各剩 22/38px
    （`CTR_R=7` ⇒ 门槛 14px）。要跑地图自带的 `源码/_build/_centerprobe.py`（网格采样 + BFS）才算数
  - 两台设备联机实测（同一浏览器多标签会被节流成假断线，交付文档 §4.1）

## 失败形态（提前摊开）

1. 指针锁被 iframe 拦 ⇒ 画面开了但永远不开局（`main.js` 里 `started = locked`）。第 4 步专治这条
2. 白名单没加 ⇒ `mp/duo1-bridge.js` 404，公告栏根本不出现；`window.pxGame.status` 会是 `"no-mounted"`
3. `duo1-bridge.js` 里 `CENTER`/`ROOMS` 取不到（引擎若改成 module 作用域）⇒ 明着 warn + `status="no-mounted"`，
   不会静默
4. `#ctrTip` 气泡与学霸姐的共用一个元素；两处相隔 320px，正常不会抢，同时站中间时会互相盖
5. bridge 内存存房，`systemctl restart campus-bridge` 会让大厅列表清空；正在打的那局不受影响
   （他们的 3D 同步走 duo1 自己的 8124，不经我手）
6. 中继仍无鉴权：房码不可猜（5 位、约 335 万种），但**拿到码的人就能进房**，
   这跟交付文档 §4.6 的现状一样。真握手验票是下一阶段

## 明确没做的

- 3 人以上同一间 3D 房：`net.js` 的 `peer` 是单个对象、血量只有一份 `guestHP`，
  部署版连名字牌代码都没有 ⇒ 要重写同步层，不是把 `MAX_PER_ROOM` 从 2 改成 8
- 对手昵称显示：需要中继把 nick 一起转发（改协议）；本版只在自己的角标上显示"我是谁"
- 战绩回写地图、观战、聊天、段位

## 两条与交付文档不一致的实测发现（别按文档改）

1. **地图 HTML 与本地源码不是同一份**：服务器那份 1,317,669 字节，本地源码 1,348,344 字节，
   符号名一致但行号差约 640 行（`YF_SOLID` 服务器 5813 行 / 本地 6480 行）。
   定位一律按 `基线快照/map_live.html`
2. **部署版 `net.js` 只有 418 行**，本地那份 444 行，且部署版 `buildPeer()` 里**没有名字牌代码**
   （搜不到 `drawLabel`/`peerLabel`）。交付文档 §4.3 说的"5 处部署适配"不含这个差异
