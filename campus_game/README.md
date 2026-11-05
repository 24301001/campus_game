# 在线编程刷题与学习管理系统（myleetcode）

一个 LeetCode / 洛谷风格的在线判题与学习管理平台：题库、在线编辑器、判题机、学情统计、排行榜、比赛，外加一个基于大模型的 AI 助教「算法哥」。

---

> **这份文档怎么用**
> - 想自己跑起来 → 看 **「四、快速开始」**（5 步，照抄命令即可）。
> - 想知道每个配置是什么意思 → 看 **「五、配置项详解」**。
> - **让 AI 助手帮你部署** → 把 **「十、给 AI 助手 / 自动化部署的清单」** 整段丢给它。
> - 准备部署到公网 → **必须先看「十二、安全提示」**，仓库里有明文密码和密钥。

---

## 一、功能概览

### 刷题与判题
- 在线写代码（Monaco 编辑器，支持 Java / C++ / C / Python / JavaScript 五种语言）
- 提交后本地编译运行、比对样例输出判题，1 秒超时控制
- 判题结果：`ACCEPTED` / `WRONG_ANSWER` / `COMPILE_ERROR` / `RUNTIME_ERROR` / `TIME_LIMIT_EXCEEDED`
- 提交记录、提交详情、错误信息回显

### 题库
- 170 道题，按**分类 / 难度 / 标签 / 企业**多维筛选与关键词搜索
- 题目详情含题面、样例、题解（Markdown 渲染）
- 每题挂 3 道**相似题**（标签重叠 + 同分类 + 难度接近，见 `sql/13-problem-similar.sql`）
- 收藏、讨论区（含点赞）、浏览量统计

### 个人与社区
- 注册 / 登录（JWT）、邮箱验证（**限 `bjtu.edu.cn` 域名**）
- 个人主页：技能雷达图、年度热力图、难度分布、成就徽章
- 关注 / 粉丝、排行榜（含按标签排名）、比赛（contest）与 rating 记录

### 算法哥（AI 助教）
- 对话式刷题教练，账号间记忆互相隔离
- 分级提示 L1→L4（方向 → 关键一步 → 伪代码 → 完整代码）
- 学情诊断、排名播报、每日一题、刷题题单、判题讲解
- 直接代写代码（返回库里验证过 AC 的答案）
- 用自然语言改个人资料（性别 / 位置 / 昵称 / 头像 / 邮箱 / 密码）
- **错题本**、**找类似题**、**帮收藏题目**、**帮发讨论**
- 页面右下角浮标：可拖动、双击「拍拍他」、拍够 9 下会生气并甩给你一道题

### 管理后台
- 用户管理（禁用 / 启用）、题目增删改查、分类管理、提交记录查看

---

## 二、技术栈与运行环境

| 层 | 技术 |
|---|---|
| 后端 | Java 8 语法目标 · Spring Boot 2.7.14 · MyBatis-Plus 3.5.3.1 · Spring Security + JWT · Hutool · Lombok |
| 前端 | Vue 3 · Vite 4.5 · Element Plus · Monaco Editor · ECharts · Axios · Pinia |
| 数据库 | MySQL 8.0（utf8mb4） |
| 判题机 | 本地进程调用 `javac` / `java` / `g++` / `gcc` / `python` / `node` |
| 大模型 | 任意 OpenAI 兼容接口（默认 DeepSeek `deepseek-chat`） |

### 环境要求

| 软件 | 版本要求 | 用途 | 必须 |
|---|---|---|---|
| JDK | **17**（实测）或 8 | 跑后端 + 判 Java 题 | ✅ |
| `JAVA_HOME` 环境变量 | — | **判题机靠它拼 `javac` 路径，不设 Java 题判不了** | ✅ |
| MySQL | 8.0+ | 数据存储 | ✅ |
| Node.js | 18+（实测 24 可用） | 前端构建/开发 | ✅ |
| Maven | 3.6+ | 构建后端；**用自带 `mvnw` 也行，不必全局装** | ⭕ |
| g++ / gcc | 任意 | 判 C++ / C 题 | 可选 |
| Python 3 | 3.8+ | 判 Python 题 | 可选 |
| Node.js | 同上 | 判 JavaScript 题（复用前端的 Node） | 可选 |

> 判题机启动时会**自动探测**每种语言是否可用，不可用的语言前端会置灰。装了哪个就能判哪个，没装不影响平台其他功能。

---

## 三、项目结构

```
myleetcode/
├── backend/                                  # Spring Boot 后端（端口 8081，上下文 /api）
│   ├── src/main/java/com/coding/platform/
│   │   ├── config/                           # Security、Jackson、MyBatis-Plus 配置
│   │   ├── controller/                       # 14 个控制器（见「十一、API 一览」）
│   │   ├── entity/ mapper/                   # 实体与 MyBatis-Plus Mapper
│   │   ├── service/ + service/impl/          # 业务；算法哥在 AgentServiceImpl
│   │   ├── dto/ vo/ utils/ common/ exception/
│   │   └── CodingPlatformApplication.java
│   ├── src/main/resources/application.yml     # ★ 唯一配置文件，全部配置都在这里
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                                 # Vue 3 + Vite（端口 3000）
│   ├── src/{views,components,api,router,stores,utils,styles}
│   ├── public/agent/                         # 算法哥立绘与头像（4 张立绘 + 4 张头像）
│   ├── vite.config.js                        # ★ 开发代理：/api → http://localhost:8081
│   ├── nginx.conf                            # Docker 部署时的 Nginx 配置
│   └── Dockerfile
├── database/
│   └── coding_platform-full.sql              # ★ 完整数据库快照（含全部数据，可直接导入）
├── sql/                                      # 增量脚本 00→13（建表 + 题库 + 题解 + 相似题）
├── docker-compose.yml                        # 一键容器化部署（MySQL + 后端 + 前端）
└── README.md
```

---

## 四、快速开始（本地开发）

### 第 1 步：准备数据库

确保 MySQL 8 已启动，然后二选一导入数据。

**方式 A：导入完整快照（推荐，含全部数据）**

```bash
mysql -u root -p < database/coding_platform-full.sql
```

这个文件自带 `CREATE DATABASE` 和 `USE`，**不用先建库**。

**方式 B：只要干净的结构（不含业务数据）**

```bash
mysql -u root -p -e "CREATE DATABASE coding_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p coding_platform < sql/00-init.sql
mysql -u root -p coding_platform < sql/02-leetcode-profile.sql
mysql -u root -p coding_platform < sql/03-algorithm-brother.sql
# 04 ~ 13 同理，按编号顺序执行
```

> 编码必须是 **utf8mb4**，否则题目里的中文和 emoji 会乱码。

### 第 2 步：改配置

编辑 [backend/src/main/resources/application.yml](backend/src/main/resources/application.yml)，**至少要改数据库密码**：

```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/coding_platform?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: "你的MySQL密码"        # ← 改这里
```

算法哥要能说话，还得配一个大模型 key（见「五、配置项详解」的 `agent.llm`）。不配也能跑，只是算法哥只会播报数据、不会讲解。

### 第 3 步：启动后端

```bash
cd backend

# Windows（PowerShell）—— 注意 -D 参数要加引号
.\mvnw.cmd spring-boot:run "-Dmaven.compiler.release=8"

# macOS / Linux
./mvnw spring-boot:run -Dmaven.compiler.release=8
```

关于 `-Dmaven.compiler.release=8`：项目源码目标是 Java 8，用 **JDK 17** 构建时**必须**加这个参数；如果你本机就是 JDK 8，可以不加。

启动成功的标志：

```
Tomcat started on port(s): 8081 (http) with context path '/api'
Started CodingPlatformApplication in 2.0 seconds
```

### 第 4 步：启动前端

```bash
cd frontend
npm install
npm run dev
```

访问 **http://localhost:3000** 即可。

> 前端开发服务器把 `/api` 反向代理到 `http://localhost:8081`（见 `vite.config.js`），所以后端端口变了要同步改这里。

### 第 5 步：验收

用测试账号登录（见「八、测试账号」），然后：

1. 打开题库，能看到 170 道题 → 数据库通了
2. 打开任意题目，点「提交」能出判题结果 → 判题机通了、`JAVA_HOME` 设对了
3. 右下角算法哥浮标能点开、能聊天 → 大模型配好了

命令行快速自检（后端是否活着）：

```bash
curl http://localhost:8081/api/agent/status
```

---

## 五、配置项详解

全部配置集中在 [backend/src/main/resources/application.yml](backend/src/main/resources/application.yml)。

### 5.1 服务与数据源

| 配置项 | 说明 | 默认值 |
|---|---|---|
| `server.port` | 后端端口 | `8081` |
| `server.servlet.context-path` | 所有接口的统一前缀。**改动后前端代理和 nginx 都要跟着改** | `/api` |
| `spring.datasource.url` | JDBC 连接串。`serverTimezone=Asia/Shanghai` 建议保留，时间会错 | `jdbc:mysql://127.0.0.1:3306/coding_platform?...` |
| `spring.datasource.username` | 数据库账号 | `root` |
| `spring.datasource.password` | 数据库密码 | ⚠️ 见「十二、安全提示」 |
| `spring.servlet.multipart.max-file-size` | 单文件上传上限（头像） | `10MB` |

### 5.2 JWT 与鉴权

| 配置项 | 说明 | 默认值 |
|---|---|---|
| `jwt.secret` | 签发 token 用的密钥。**上线前必须换成一段长随机串**，否则任何人可伪造登录态 | `coding-platform-secret-key-2024` |
| `jwt.expiration` | token 有效期（毫秒） | `86400000`（24 小时） |

### 5.3 判题机（`judge`）

| 配置项 | 说明 | 默认值 |
|---|---|---|
| `judge.work-dir` | 判题临时目录，每个提交会在这里开一个独立子目录 | `${user.dir}/tmp` |
| `judge.time-limit` | 单次运行超时（毫秒） | `1000` |
| `judge.python-path` | Python 解释器路径。**留空即自动探测**：先找 PATH 上的 `python`/`python3`，再找 Anaconda / Miniconda 常见安装位置 | 空 |
| `file.upload-path` | 头像等上传文件的存放目录 | `./uploads` |

判题依赖（全部通过**本地进程**调用，没有沙箱）：

| 语言 | 依赖 | 说明 |
|---|---|---|
| Java | `$JAVA_HOME/bin/javac`、`$JAVA_HOME/bin/java` | **必须设置 `JAVA_HOME`**，否则路径拼出来是 `null/bin/javac` |
| C++ | PATH 上的 `g++` | 用 `-std=c++17` |
| C | PATH 上的 `gcc` | |
| Python | `python` / `python3`，或 `judge.python-path` | 没加进 PATH 的 Anaconda 也能自动找到 |
| JavaScript | PATH 上的 `node` | |

### 5.4 算法哥（`agent`）

| 配置项 | 说明 | 默认值 |
|---|---|---|
| `agent.llm.base-url` | OpenAI 兼容服务地址，工具会自动补 `/v1/chat/completions` | `https://api.deepseek.com` |
| `agent.llm.api-key` | 大模型 key。**留空则算法哥只会播报确定性数据，不会开口讲解** | ⚠️ 见「十二」 |
| `agent.llm.model` | 模型名 | `deepseek-chat` |
| `agent.llm.temperature` | 采样温度 | `0.6` |
| `agent.llm.timeout` | 请求超时（毫秒） | `60000` |
| `agent.search.api-key` | 「联网找类似题」用的搜索 key（**可选**）。留空就纯用题库内的相似题数据，功能照常 | 空 |
| `agent.search.endpoint` | 搜索服务地址，需返回 `{organic:[{title,link,snippet}]}` | `https://google.serper.dev/search` |

任何兼容 OpenAI 协议的服务都能接，例如：

| 服务 | base-url | model |
|---|---|---|
| DeepSeek | `https://api.deepseek.com` | `deepseek-chat` |
| 通义千问（兼容模式） | `https://dashscope.aliyuncs.com/compatible-mode` | `qwen-plus` |
| 智谱 GLM | `https://open.bigmodel.cn/api/paas/v4` | `glm-4-plus` |
| 月之暗面 | `https://api.moonshot.cn` | `moonshot-v1-8k` |

### 5.5 邮件（注册邮箱验证）

| 配置项 | 说明 | 默认值 |
|---|---|---|
| `spring.mail.host` / `port` | SMTP 服务器 | `smtp.163.com` / `465` |
| `spring.mail.username` | 发信邮箱账号 | ⚠️ 见「十二」 |
| `spring.mail.password` | **邮箱授权码**（不是登录密码） | ⚠️ 见「十二」 |
| `spring.mail.properties.*` | SSL 相关，163 邮箱固定这么配 | — |
| `email.verification.allowed-domains` | 允许注册的邮箱域名白名单 | `bjtu.edu.cn` |
| `email.verification.expiration-minutes` | 验证链接有效期（分钟） | `10` |
| `email.verification.frontend-url` | 验证链接指向的前端页面 | `http://localhost:3000/verify-email` |

> 改成你自己的域名白名单（或加多个）才能让其他学校的邮箱注册。`frontend-url` 部署到服务器后要改成真实域名，否则邮件里的链接点不开。

---

## 六、用环境变量覆盖配置（部署用）

不想把密码写进文件时，可以用环境变量覆盖。

**命名规则（实测有效）**：配置项的点 `.` 换成下划线 `_`，**连字符 `-` 直接删掉**，整体大写。

| application.yml 配置项 | 对应环境变量 |
|---|---|
| `spring.datasource.url` | `SPRING_DATASOURCE_URL` |
| `spring.datasource.username` | `SPRING_DATASOURCE_USERNAME` |
| `spring.datasource.password` | `SPRING_DATASOURCE_PASSWORD` |
| `spring.mail.host` | `SPRING_MAIL_HOST` |
| `spring.mail.username` | `SPRING_MAIL_USERNAME` |
| `spring.mail.password` | `SPRING_MAIL_PASSWORD` |
| `server.port` | `SERVER_PORT` |
| `server.servlet.context-path` | `SERVER_SERVLET_CONTEXTPATH` |
| `jwt.secret` | `JWT_SECRET` |
| `agent.llm.base-url` | `AGENT_LLM_BASEURL` |
| `agent.llm.api-key` | `AGENT_LLM_APIKEY` ⚠️ **不是** `AGENT_LLM_API_KEY` |
| `agent.llm.model` | `AGENT_LLM_MODEL` |
| `agent.search.api-key` | `AGENT_SEARCH_APIKEY` |
| `judge.work-dir` | `JUDGE_WORKDIR` ⚠️ **不是** `JUDGE_WORK_DIR` |
| `judge.python-path` | `JUDGE_PYTHONPATH` |
| `file.upload-path` | `FILE_UPLOADPATH` |

> ⚠️ **最容易踩的坑**：`api-key` 这类带连字符的配置，环境变量里是 `APIKEY`（连字符被删掉），写成 `API_KEY` 会**静默失效**——不报错，但配置不生效。

如果记不住规则，也可以用 `SPRING_APPLICATION_JSON` 传任意层级，这个**最保险**：

```bash
# Linux / macOS
export SPRING_APPLICATION_JSON='{"spring":{"datasource":{"password":"xxx"}},"agent":{"llm":{"api-key":"sk-xxx"}}}'

# Windows PowerShell
$env:SPRING_APPLICATION_JSON='{"spring":{"datasource":{"password":"xxx"}},"agent":{"llm":{"api-key":"sk-xxx"}}}'
```

---

## 七、数据库说明

### 表清单（32 张）

| 分组 | 表 |
|---|---|
| 用户 | `user`、`user_rating_history`、`follow`、`email_verification` |
| 题库 | `problem`、`category`、`tag`、`problem_tag`、`problem_similar`、`problem_solution`、`problem_view` |
| 企业 | `company`、`problem_company`、`enterprise`、`enterprise_problem` |
| 提交 | `submit_record` |
| 互动 | `collect`、`note`、`comment_like` |
| 比赛 | `contest`、`contest_problem`、`contest_registration`、`contest_submission`、`contest_final_score`、`user_contest_rating` |
| 算法哥 | `agent_session`、`agent_message`、`agent_memory`、`agent_plan`、`agent_plan_item`、`agent_hint_log` |
| 其他 | `sys_log` |

### 备份与恢复

```bash
# 备份
mysqldump -u root -p --databases coding_platform --single-transaction \
  --default-character-set=utf8mb4 --set-gtid-purged=OFF \
  --result-file=coding_platform-full.sql

# 恢复
mysql -u root -p < coding_platform-full.sql
```

> Windows 上导出请用 `--result-file` 参数，**不要用 `>` 重定向**——PowerShell 默认写 UTF-16，导出来的文件会乱码且无法导入。

---

## 八、测试账号

| 角色 | 用户名 | 密码 | 说明 |
|---|---|---|---|
| 管理员 | `admin` | `admin123` | 可进 `/admin` 管理后台 |
| 普通用户 | `user` | `user123` | 可刷题、用算法哥 |

> 这两个是代码里写死的兜底账号（见 `UserServiceImpl#login`），**导不导入数据都能登录**。数据库里其他账号是 BCrypt 加密的，能正常登录。

---

## 九、Docker 部署（可选）

仓库根目录已备好 `docker-compose.yml`，一条命令拉起 MySQL + 后端 + Nginx 前端：

```bash
docker compose up -d --build
```

| 服务 | 宿主机端口 | 说明 |
|---|---|---|
| `mysql` | `3307` → 3306 | 避开宿主机已有 MySQL；root 密码在 `docker-compose.yml` 里 |
| `backend` | `8081` | JDK 8 镜像，内含 Java 判题能力 |
| `frontend` | `3000` → 80 | Nginx 托管静态文件，`/api/` 反代到 `backend:8081` |

访问 **http://localhost:3000**。

**容器化的两个注意点：**

1. 后端镜像基于 `eclipse-temurin:8-jdk-alpine`，**只装了 JDK**，没有 `g++` / `python` / `node`。也就是说容器里**只能判 Java 题**；要判其他语言得自行在 `backend/Dockerfile` 里 `apk add` 对应工具链。
2. 数据库数据在名为 `mysql-data` 的 Docker 卷里，`docker compose down` 不会丢，`down -v` 才会删。

---

## 十、给 AI 助手 / 自动化部署的清单

> 把这一节整段复制给 AI（Claude / GPT / Trae / Cursor 等）即可让它照着部署。

**目标**：在本地把项目跑起来，前端 `http://localhost:3000`、后端 `http://localhost:8081/api`。

**执行步骤**

1. **检查环境**：`java -version`（需 17 或 8）、`mysql --version`（需 8.x）、`node -v`（需 18+）、确认 `JAVA_HOME` 环境变量**已设置且指向 JDK 根目录**（不是 bin 目录）。
2. **建库导数据**：在项目根目录执行 `mysql -u root -p < database/coding_platform-full.sql`。该文件自带建库语句，**不要**先手动建库。数据库名固定为 `coding_platform`。
3. **改后端配置**：编辑 `backend/src/main/resources/application.yml`，把 `spring.datasource.password` 改成实际 MySQL 密码。
4. **启动后端**：在 `backend/` 目录执行 `./mvnw spring-boot:run -Dmaven.compiler.release=8`（Windows 用 `.\mvnw.cmd spring-boot:run "-Dmaven.compiler.release=8"`，**引号不能省**）。
5. **等待并验证后端**：日志出现 `Tomcat started on port(s): 8081 (http) with context path '/api'` 即成功。用 `curl http://localhost:8081/api/agent/status` 应返回 JSON；返回 404 说明上下文路径不对。
6. **启动前端**：在 `frontend/` 目录执行 `npm install` 然后 `npm run dev`，等 Vite 打印 `Local: http://localhost:3000/`。
7. **端到端验证**：用 `admin` / `admin123` 登录 → 题库应显示 170 道题 → 打开任意题目提交一次代码应有判题结果。

**硬性约束（违反会出问题）**

- 后端端口是 **8081 不是 8080**；上下文路径是 **`/api`**，所有接口都要带这个前缀。
- 前端代理**不能 rewrite 掉 `/api` 前缀**（后端 context-path 就是 `/api`），否则全部 404。
- 数据库字符集必须是 **utf8mb4**。
- 用 JDK 17 构建**必须**加 `-Dmaven.compiler.release=8`。
- 判 Java 题**必须**设置 `JAVA_HOME`；判 Python 题需要本机有 Python（Anaconda 也行，会自动探测）。
- 环境变量覆盖配置文件时，**连字符要删掉**：`agent.llm.api-key` → `AGENT_LLM_APIKEY`。

**验证成功的判定标准**：上面 7 步全部无报错，且 `curl http://localhost:8081/api/agent/status` 返回 200。

---

## 十一、API 一览

所有接口前缀为 `/api`。除标注外均需在请求头带 `Authorization: Bearer <token>`。

| 模块 | 方法 | 路径 |
|---|---|---|
| 认证 | POST | `/auth/login`、`/auth/register`、`/auth/send-verification-email`、`/auth/verify-email` |
| 认证 | GET | `/auth/check-verification-status` |
| 用户 | GET | `/user/info`、`/user/stats` |
| 用户 | PUT | `/user/update` |
| 用户 | POST | `/user/password` |
| 个人主页 | GET | `/profile/{userId}`、`/profile/rankings` |
| 个人主页 | POST | `/profile/follow/{targetUserId}`、`/profile/view/{problemId}`、`/profile/comment/like/{noteId}` |
| 题目 | GET | `/problem/list`、`/problem/detail/{id}`、`/problem/similar/{id}` |
| 分类 / 标签 / 企业 | GET | `/category/list`、`/tag/list`、`/company/list` |
| 判题 | POST | `/judge/compile` |
| 判题 | GET | `/judge/languages` |
| 提交 | GET | `/submit/list`、`/submit/detail/{id}` |
| 收藏 | POST / DELETE / GET | `/collect/add`、`/collect/remove`、`/collect/check`、`/collect/list` |
| 讨论（笔记） | GET | `/note/detail`、`/note/list` |
| 讨论（笔记） | POST | `/note/save` |
| 文件 | POST | `/file/upload/avatar` |
| 算法哥 | GET | `/agent/status`（免登录）、`/agent/sessions`、`/agent/messages`、`/agent/memory`、`/agent/analysis`、`/agent/daily`、`/agent/rank`、`/agent/plan/latest`、`/agent/wrong-problems` |
| 算法哥 | POST | `/agent/session`、`/agent/chat`、`/agent/solve`、`/agent/plan`、`/agent/plan/item/{id}/done`、`/agent/event`、`/agent/event/follow` |
| 算法哥 | DELETE | `/agent/session/{id}`、`/agent/memory` |
| 管理后台 | GET | `/admin/user/list`、`/admin/problem/list`、`/admin/category/list`、`/admin/submit/list` |
| 管理后台 | POST / PUT / DELETE | `/admin/problem/{add,update,delete}`、`/admin/category/{add,update,delete}`、`/admin/user/status` |

---

## 十二、安全提示（部署到公网前必看）

这是一个课程设计 / 毕业设计项目，**没有做代码沙箱**，直接以本机进程运行用户提交的代码。请只在你信任的环境里使用，不要直接暴露到公网。

**仓库里已经存在、必须替换的敏感信息：**

| 位置 | 内容 | 处理 |
|---|---|---|
| `application.yml` | MySQL 密码 | 改成环境变量注入并**更换密码** |
| `application.yml` | 163 邮箱账号 + 授权码 | 去邮箱后台**重新生成授权码**，改用环境变量 |
| `application.yml` | 大模型 `api-key` | 去服务商后台**重新生成 key**，改用环境变量 |
| `application.yml` | `jwt.secret` 太短 | 换成一串长随机值 |
| `docker-compose.yml` / `TestMySQL.java` | MySQL 密码 | 同上 |
| `database/coding_platform-full.sql` | 完整数据快照，含账号、明文/加密密码、提交代码、算法哥聊天记录 | 公开前建议改成脱敏版本（密码统一改成 `123456`、邮箱与 IP 置空） |

> **注意**：这些值一旦提交进 Git 历史，即使后续删掉文件也仍然能通过 `git log` 查到。所以**必须在第一次 push 之前**就换掉，并且把线上用过的旧凭据全部视为已泄露、逐一重置。

**上线前建议再做三件事：**
1. 给判题加沙箱（Docker / nsjail / seccomp），或限制提交权限到登录用户；
2. 关闭 `mybatis-plus.configuration.log-impl` 的 SQL 打印（会把 SQL 全量打到日志）；
3. 用 `nginx` 统一入口并开启 HTTPS。

---

## 十三、常见问题

**Q：后端起不来，报数据库连接失败？**
`spring.datasource.password` 没改，或 MySQL 没启动，或库名不是 `coding_platform`。

**Q：接口全 404 / 前端一直请求失败？**
检查上下文路径。后端是 `http://localhost:8081/api`，**不是** `8080`，也不是 `http://localhost:8081`。前端代理不允许 rewrite 掉 `/api`。

**Q：提交代码后一直报「语言不可用」？**
判题机启动时会探测本机工具链。Java 题必须设置 `JAVA_HOME` 环境变量；Python 题需要本机有 Python，找不到时用 `judge.python-path` 手动指定绝对路径。

**Q：编译用 JDK 17 报错？**
加 `-Dmaven.compiler.release=8`。注意 PowerShell 里要加引号：`"-Dmaven.compiler.release=8"`。

**Q：题目 / 昵称里的中文显示成乱码？**
数据库或表不是 utf8mb4。重建库时指定 `DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`。

**Q：算法哥只会报数据、不会讲解？**
`agent.llm.api-key` 是空的。填上任意 OpenAI 兼容服务的 key 即可。

**Q：命令行访问 `http://localhost:3000/home` 返回 404？**
这是 Vite 的正常行为——它只对带 `Accept: text/html` 的请求做单页回退。浏览器访问正常。

**Q：导出的 SQL 文件中文全是乱码？**
PowerShell 的 `>` 默认写 UTF-16。用 `mysqldump --result-file=xxx.sql` 代替重定向。

---

## 许可证

MIT License
