# 部署 · 学霸哥（xueba-ge）

> 面向拿到本仓库的人：clone 之后怎么跑起来。项目全貌/设计口径看同目录 `README.md`，
> 与其他角色合体的接口看 `接口契约.md`。

## 你在仓库里拿到什么 / 没拿到什么

| 在仓库里 | 不在，怎么补 |
|---|---|
| 全部代码 + 配置 + 测试 | **索引 `kb/index/`** → 第 3 步一条命令重建 |
| 语料 `kb/sources/*.md`（OCR 后的教材/真题文本，11MB） | **教材 PDF 原件** → 走网盘：链接在 `config/corpus.json` 的「网盘分享」（含提取码） |
| **往年卷 PDF 原件 `试卷/`（28 份，37MB）** → clone 完面板上「原件」直接能下 | **数据库/密钥 `data/`** → 首启自动建库；Key 见第 2 步 |
| KaTeX 本地资源（离线渲染公式） | ONNX 模型（可选，端上推理演示才要）→ `python tools/get_onnx_assets.py` |

⚠️ `kb/sources/*.md` 是教材的文字版语料，**仅限课程内使用，不得公开散布**。

## 四步跑起来（Windows PowerShell）

```powershell
# 0) 环境（一次）：Python 3.11+ 实测 3.13 可用
cd campus_game\xueba-ge
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

# 1) LLM Key —— 二选一：
#    a. 有 DashScope Key：设环境变量（或写进 data\.llm_key，该文件不进 git）
$env:XBG_LLM_KEY = "sk-..."
#    b. 没 Key：把 config/llm.json 的 provider 改成 "stub" ——
#       检索/出处/面板/下载全都能跑，只是回答由"抽取式拼资料"代替模型生成

# 2) 建索引（第一次启动前必须跑一次，约 3~7 分钟）
#    默认 embedding 走 api（要 Key，全库约 260 万 token ≈ 一块多钱）；
#    不想花钱：把 config/retrieval.json 的 embedding.provider 改成 "onnx"（先跑
#    tools/get_onnx_assets.py 拉 23MB 权重）或 "hash"（零依赖兜底，语义那条腿变弱）
.\.venv\Scripts\python.exe -m kb.build

# 3) 起服务
.\run.ps1 -NoBuild
#    浏览器打开 http://127.0.0.1:8010 —— 注册个账号就能聊
#    顶栏「资料库」= 面板（年级分组/页数字数/往年卷原件下载/教材网盘跳转）
```

## 自检（可选，跑给组长看之前自己先过一遍）

```powershell
.\.venv\Scripts\python.exe -m pytest tests -q            # 应 214 passed（1 skip 正常）
.\.venv\Scripts\python.exe eval\run_eval.py --top 3      # recall@3 ≈ 97%，拒答 100%
.\.venv\Scripts\python.exe tests\smoke_api.py http://127.0.0.1:8010   # 服务起着后跑，63 项全过
```

已知会红的项（不是坏了）：`prob-bayes` 评测用例常红、冒烟里"角标/未定式"两条偶红——
清单见 README §10。

## 换机器 / 换目录要注意的

- **代码里不写死绝对路径**：语料、索引、模型、题库全按项目根解析；
  `corpus.json` 里教材的 `PDF` 字段是相对路径，仅作对账记录（原件本来就不进仓库）。
- **重新 OCR 教材**才需要把 PDF 按 `corpus.json` 里的相对路径摆好（`教材\`），
  然后 `run_ocr.ps1` / `kb.extract` → `kb.build`，流程见 README §4/§4B。
- C 盘紧张时 pip 会炸：`$env:TMP=$env:TEMP='<项目>\.tmp'` 再装（README §12）。

## 合体 & 公网部署

- 对外契约在 `config/tools.json`（`askTextbook` / `explainProblem` / `makeStudyPlan`）
  与 `接口契约.md`；账号服务自带（FastAPI + SQLite），合体时五套并一套。
- 上公网前必读 README §11（nginx `proxy_buffering off`、Key 只走环境变量、worker 内存账），
  并且**关掉 `/api/download` 的真题原件路由**（版权口径，README §10 第 36 条）。
