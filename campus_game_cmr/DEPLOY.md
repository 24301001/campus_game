# 食堂阿姨模块部署说明

本仓库中的 `aunt/` 是独立的 FastAPI 应用。启动后浏览器访问 `/`，无需接入校园地图。运行环境建议 Python 3.10 或更新版本；依赖见 `aunt/requirements.txt`。

## 1. 获取代码并安装依赖

在仓库根目录执行：

```powershell
git clone -b cmr https://github.com/24301001/campus_game.git
cd campus_game
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r aunt/requirements.txt
```

Linux/macOS 将激活命令改为 `source .venv/bin/activate`。如果已经克隆仓库，先运行 `git fetch origin` 和 `git switch cmr`，再安装依赖。

## 2. 配置数据库与 AI

应用默认把用户、会话、聊天记录和口碑写入 `aunt/data/aunt.sqlite3`。部署时建议将数据库放在持久化目录，避免更新代码或重建实例时丢失：

```powershell
$env:AUNT_DB_PATH = "D:\campus_game_data\aunt.sqlite3"
```

Linux/macOS 示例：`export AUNT_DB_PATH=/var/lib/campus_game/aunt.sqlite3`。启动账号需有该目录的写入权限；应用会创建数据库文件和表。

需要 DeepSeek 辅助答复时，在**服务器进程环境**中设置密钥：

```powershell
$env:DEEPSEEK_API_KEY = "在服务器上填写你的密钥"
```

没有设置密钥时，聊天仍会使用本地资料答复。`AUNT_LLM_ENDPOINT`、`AUNT_LLM_MODEL` 可覆盖接口地址和模型；默认值与说明见 `aunt/.env.example`。应用不会自动读取 `.env.example`，也不要把真实密钥写入仓库、网页代码或命令截图。此前在聊天中分享过的密钥建议到服务商后台轮换后再部署。

## 3. 启动

在仓库根目录运行：

```powershell
python -m uvicorn aunt.server:app --host 127.0.0.1 --port 8000
```

本机访问 <http://127.0.0.1:8000/>，接口文档位于 <http://127.0.0.1:8000/api/docs>。首次使用先注册账号。若需要局域网访问，可将 `--host` 改为 `0.0.0.0` 并配置防火墙；公网部署应通过 HTTPS 反向代理对外提供服务，因为登录会话和麦克风功能需要安全的访问环境。

持续运行时，可用服务器的进程管理器托管同一条 Uvicorn 命令，并保持数据库目录持久化。当前实现使用 SQLite，建议先以**单个 Uvicorn worker**运行；不要用多个副本各自写入不同的本地数据库。

## 4. 更新与备份

更新前备份 `AUNT_DB_PATH` 指向的数据库文件。停止服务后执行 `git pull --ff-only origin cmr`、重新安装 `aunt/requirements.txt`，然后重启。资料 JSON 和静态图片随代码更新；账号及历史记录保存在 SQLite，不应提交到 Git。仓库的 `aunt/.gitignore` 已排除 `*.sqlite3` 和 `.env`。

## 5. 检查

```powershell
python -m unittest discover -s aunt/tests -v
node --check aunt/static/app.js
node --check aunt/static/map.js
node --check aunt/static/pixel-aunt.js
```

Node.js 仅用于上述前端语法检查，不是运行服务的依赖。浏览器语音输入依赖 `SpeechRecognition` / `webkitSpeechRecognition` 支持和麦克风权限；不支持的浏览器仍可使用文字输入。更多功能与资料状态见 `aunt/README.md`。
