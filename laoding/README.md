# 保安 · 老丁 —— 北交大像素校园

单文件零构建前端 + FastAPI 轻后端的校园保卫处对话应用：失物四维匹配 / 以图搜物 / 证件 OCR 核对 / 报修工单 / 认领交还闭环。

- 前端：`index.html`（纯原生 HTML/CSS/JS，无 npm、无构建，数据种子内嵌兜底）
- 后端：`server/app.py`（FastAPI：注册 / 登录 / 签发 token，并托管前端与 `data/` 数据）
- 依赖：已随仓库放在 `server_vendor/`、`.pylibs/`，**不需要联网 pip 安装**

---

## 一、环境要求

| 项 | 要求 |
|---|---|
| Python | 3.10+（开发机为 3.13.5，可用任意 3.10+ 解释器） |
| 第三方包 | 无需安装，fastapi / uvicorn / pydantic 等已在 `server_vendor/` |
| 浏览器 | Edge / Chrome 等现代浏览器 |
| 网络 | 仅 OCR、以图搜物两个可选能力需云端；断网时文字功能全部可用 |

> 本项目通过 `PYTHONPATH` 指向项目内依赖目录运行，**不依赖、也不修改系统 Python 的 site-packages / pip**，系统 pip 损坏也能跑。

---

## 二、快速启动（Windows，三选一）

### 方式 1：双击 / cmd 运行批处理（最省事）

项目根目录已有 `run_server.bat`。

- 文件管理器里**双击 `run_server.bat`**；或
- 在 IDEA / cmd 终端（位于项目根目录 `guard>`）执行：

  ```cmd
  run_server.bat
  ```

脚本会自动：切到项目根目录 → 配置 `PYTHONPATH`（`server_vendor` + `.pylibs`）→ 找 Python（优先 `D:\Scripts\python.exe`，找不到退回 PATH 上的 `python`）→ 启动服务并在 3 秒后自动打开浏览器。

看到下面这行就是成功了：

```
Uvicorn running on http://127.0.0.1:8000
```

### 方式 2：PowerShell 终端

IDEA 终端提示符是 `PS>` 时：

```powershell
$env:PYTHONPATH="$PWD\server_vendor;$PWD\.pylibs"
python server\app.py
```

（若 `python` 不在 PATH，把 `python` 换成解释器全路径，例如 `D:\Scripts\python.exe`。）

### 方式 3：IDEA 点绿三角（需 Python 插件）

IDEA Ultimate 自带 Python 支持；社区版先在插件市场安装 Python 插件。

1. `File → Settings → Project → Python Interpreter → Add Interpreter → Add Local Interpreter → System Interpreter`，选择本机 Python（如 `D:\Scripts\python.exe`）。
2. 右上角 `Edit Configurations → + → Python`：
   - **Script path**：`server/app.py`
   - **Working directory**：项目根目录（`guard`）
   - **Environment variables**：
     ```
     PYTHONPATH=server_vendor;.pylibs
     ```
3. 保存后点绿色 ▶ 运行，效果与批处理一致。

---

## 三、访问

服务启动后浏览器打开：

```
http://127.0.0.1:8000
```

- 首次使用先**注册**昵称+密码（数据存于本机 `server/users.db`），登录后聊天历史按账号隔离。
- **不要直接双击 `index.html` 用 `file://` 打开**：页面能显示，但注册/登录会因连不上账号服务而失败。
- 停止服务：运行窗口按 `Ctrl+C`，或直接关掉该终端/窗口。

---

## 四、目录结构

```
guard/
├── index.html          # 前端单文件（页面 + 业务引擎 + 内嵌数据种子）
├── run_server.bat      # Windows 一键启动脚本（推荐）
├── server/
│   ├── app.py          # FastAPI：账号服务 + 静态托管，入口
│   └── users.db        # 首次运行自动生成（SQLite，账号/token）
├── data/
│   ├── points.json     # 北交大楼宇点位（官方名+简称+俗称）
│   ├── lostitems.json  # 失物库种子
│   ├── workorders.json # 报修工单种子
│   └── agents/guard.json  # 老丁人设与值班配置
├── server_vendor/      # 随仓库自带的 Python 依赖（主）
├── .pylibs/            # 随仓库自带的 Python 依赖（备）
└── cloud/              # 可选：OCR / 以图搜物云端服务（不启动不影响文字功能）
```

运行时数据说明：

| 数据 | 存放位置 |
|---|---|
| 账号、登录 token | `server/users.db`（SQLite） |
| 失物库 / 工单库 | 浏览器 `localStorage`（首次访问由 `data/*.json` 播种，版本变更时自动重播） |
| 各人聊天历史、私密记忆 | 浏览器 `localStorage`，按账号隔离 |

页面右上角「**重置数据**」可清空失物库/工单库并恢复初始种子。

---

## 四点五、图像识别（Qwen3.8-Flash）配置

老丁的三处"看图"能力——登记拍照自动填表、卡面证件识别、以图搜物降级——默认走阿里云百炼的 **qwen3.8-flash** 多模态模型（OpenAI 兼容接口，后端同源代理，密钥不进前端）。**不配 key 不影响任何文字功能**，拍照时会提示并自动走口头描述/备用识别路。

### 申请 key（约 2 分钟）

1. 登录阿里云百炼控制台：https://bailian.console.aliyun.com/
2. 右上角头像 → **API-KEY 管理** → 创建我的 API-KEY，拿到 `sk-` 开头的一串密钥
3. （首次使用可能需开通"模型服务"，qwen3.8-flash 在免费/低价额度内即可调试）

### 二选一配置

**方式 A：写文件（推荐，最省事）**
在 `server/` 目录下新建 `qwen_key.txt`，把 `sk-` 密钥整串粘进去保存（只放密钥一行，不要引号空格）：

```
guard/laoding/server/qwen_key.txt
└──────────────────
sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

**方式 B：环境变量**

```powershell
$env:DASHSCOPE_API_KEY = 'sk-xxxxxxxxxxxxxxxxxxxxxxxx'
.\run_server.bat
```

配置后**重启服务**，浏览器访问验证：

```powershell
(Invoke-WebRequest http://127.0.0.1:8000/api/vision/status -UseBasicParsing).Content
# 应返回 {"model":"qwen3.8-flash","enabled":true}
```

> 安全：`server/qwen_key.txt` 已写入 `.gitignore`，不会被提交。后端调用百炼时显式直连（绕过本机 Clash 等代理），无需挂梯子。

---

## 五、常见问题

**1. `ModuleNotFoundError: No module named 'fastapi''`**
直接 `python server/app.py` 启动时没配 `PYTHONPATH`。用 `run_server.bat` 启动，或按方式 2/3 配置环境变量。

**2. `[Errno 10048] ... 127.0.0.1:8000` / 端口被占用**
已经有一个服务在跑。直接刷新 http://127.0.0.1:8000 即可；要重启先在原窗口 `Ctrl+C` 停掉旧实例。
确认占用进程：

```powershell
Get-NetTCPConnection -LocalPort 8000 -State Listen | Select-Object OwningProcess
```

**3. 系统 Python 坏了（`No module named pip`、`py` 启动器报错）**
不影响本项目——依赖在项目目录里，不碰 pip。`run_server.bat` 也会自动尝试两个解释器位置。换任何一台装有 Python 3.10+ 的机器，把整个项目目录拷过去都能直接跑。

**4. 控制台出现 `GET /@vite/client net::ERR_ABORTED`**
预览工具（trae-preview 等）自行注入的热更新脚本请求，本项目不使用 Vite，可忽略；用系统浏览器直接开 http://127.0.0.1:8000 即无此提示。

**5. OCR / 以图搜物提示"连不上"**
原 9000 端口云端 CV 服务（见 `cloud/`）是可选能力。现在拍照识别优先走 Qwen3.8（见上节配置），未配 key 时再降级到口头描述/备用识别路——失物登记、文字找物、认领、报修始终正常。
