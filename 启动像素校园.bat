@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

rem ============================================================
rem   像素校园 · 启动器（第四十轮）
rem ------------------------------------------------------------
rem   干九件事：
rem     1) 确认 MySQL 在跑        2) 后端 8081 没跑就拉起来
rem     3) 前端 3000 没跑就拉起来  4) 学霸姐 8010 没跑就拉起来（**可选件，失败不阻断**）
rem     5) 老丁 8000 没跑就拉起来（**可选件，失败不阻断**）
rem     6) 阿姨 8020 没跑就拉起来（**可选件，失败不阻断**）
rem     7) 联机网关 8090 没跑就拉起来（**可选件**：它没跑地图自动落单机模式）
rem     8) 把地图复制成 frontend/public/campus.html，联机那几个 js/css 复制成 public\mp\
rem     9) 等 3000 就绪 → 打开浏览器 http://localhost:3000/campus.html
rem
rem   ⭐ 二期模块 2：联机网关（8090）是**独立 Node 进程**，不塞进 8081 ——
rem      8081 每改一行 Java 都要过 javac，机房那台机器上 360 会拦（CreateProcess error=5）；
rem      而且网关是长连接、最容易写崩的一层，独立进程崩了**单机版照常双击即开**。
rem      它自己**不碰账号表**：验票是拿主 JWT 去问 8081 的 /api/user/info。
rem      库账号也不用在这里填 —— 它去读 backend\src\main\resources\application.yml。
rem
rem   ⚠️ 学霸姐（xueba-ge）走的是 frontend\vite.config.js 里那条 '/xbg' 代理，
rem      与 ':3000' **同源**才谈得上免登录 / Esc 穿透 / 教材原件下载。详见 xueba-ge\DEPLOY.md。
rem   ⚠️ 老丁（laoding）同理走 '/ld' 代理 → 127.0.0.1:8000（服务端 PrefixStrip 剥前缀）。
rem      不同源的话地图里按 Esc 退不出抽屉（父页拿不到 iframe 里的按键）。
rem   ⚠️ 食堂阿姨（campus_game_cmr）同理走 '/cmr' 代理 → 127.0.0.1:8020。
rem      ⚠️⚠️ 她那条代理在 vite.config.js 里是 **changeOrigin:false**（另两家是 true），
rem          因为她服务端有 check_origin() 拿 Origin 比 Host —— 改成 true 会让
rem          所有 POST 403（页面能开、一登录就失败）。详见那段注释。
rem      ⚠️ 她用 **8020** 不是 8000：8000 是老丁的地盘。
rem
rem   为什么要复制到 public/ 并从 3000 端口打开（**不是**直接双击那个 HTML）：
rem     地图必须与刷题平台**同源**，否则三件事全做不了 ——
rem       ① 登录一次就免登录（localStorage 不共享）
rem       ② 按 Esc 关掉刷题平台（跨源拿不到 iframe 里的按键）
rem       ③ 探测后端在不在
rem     ⚠️ 直接双击「像素校园_全校地图.html」**照样能看地图**，只是没有刷题入口。
rem
rem   ⚠️ 本文件必须存成 **UTF-8 无 BOM + CRLF**。带 BOM 的话第一行会变成
rem      「\ufeff@echo off」，cmd 认不出来，屏幕上会先冒一条报错。
rem      中文只出现在 `chcp 65001` **之后** —— 之前的行必须是纯 ASCII。
rem ============================================================

rem ⭐ 二期：铺到 campus.html 的是**联机版副本**（任务书 §2 运行图、交付物表都把
rem    `像素校园_多人版.html` 当运行件；一期那份「像素校园_全校地图.html」已冻结）。
set "MAP=%~dp0像素校园联机版\像素校园_多人版.html"
set "CG=%~dp0campus_game"
set "JAR=%CG%\backend\target\coding-platform-1.0.0.jar"
set "PUB=%CG%\frontend\public"
set "JAVA_HOME=C:\Program Files\Java\jdk1.8.0_202"
rem ⚠️ 换机器只改这一行：上面那个 JDK 8 路径不在就退到本机便携 JDK 17
rem    （pom 是 1.8，17 编 `-source 8` 没问题；JDK 23+ 的 javac 不跑 classpath 上的
rem     Lombok，会报一堆「找不到符号 getId()」—— 别拿 25 来构建）。
if not exist "%JAVA_HOME%\bin\java.exe" set "JAVA_HOME=D:\tools\jdk-17.0.20.1+1"
set "XBG=%~dp0xueba-ge"
set "XBGPY=%XBG%\.venv\Scripts\python.exe"
set "XBGIDX=%XBG%\kb\index\doc_vecs.f32"
set "LD=%~dp0laoding"
rem ⚠️ 与 laoding\run_server.bat 同一套解析：优先嵌入版，没有就退回 PATH 上的 python。
set "LDPY=D:\Scripts\python.exe"
if not exist "%LDPY%" set "LDPY=python"
set "CMR=%~dp0campus_game_cmr"
rem ⚠️ 优先她自己的 .venv（DEPLOY.md 让各自建 venv），没有就退回 PATH 上的 python。
set "CMRPY=%CMR%\.venv\Scripts\python.exe"
if not exist "%CMRPY%" set "CMRPY=python"
rem ⭐ 二期模块 2：联机网关（Node + ws + mysql2，8090）。
set "MPGW=%~dp0像素校园联机版\gateway"

rem ---------- 二期换票用的内部密钥（任务书 §3.1.3） ----------
rem 8081 和三家 NPC 服务共用这一个值：主站登录后拿它去各家领票。
rem ⚠️ **绝不写进仓库**（这仓库是公开的）—— 第一次跑随机生成，存进根目录 .mp_secret
rem    （已 gitignore），以后每次复用。换了或没生成只是换不到票（HUD 会说
rem    「XX 没登进去」），主站登录、刷题、地图都不受影响。
set "SECRETFILE=%~dp0.mp_secret"
if not exist "%SECRETFILE%" (
  powershell -NoProfile -Command "[Convert]::ToBase64String([byte[]](1..24 | ForEach-Object { Get-Random -Maximum 256 })) | Out-File -Encoding ascii -NoNewline -FilePath '%SECRETFILE%'"
)
set "CAMPUS_INTERNAL_SECRET="
for /f "usebackq delims=" %%I in ("%SECRETFILE%") do if not defined CAMPUS_INTERNAL_SECRET set "CAMPUS_INTERNAL_SECRET=%%I"
if not defined CAMPUS_INTERNAL_SECRET echo  [!] 内部密钥没生成成，四家的票这次换不到（详见 .mp_secret）

echo.
echo  ============================================================
echo    像素校园 · 启动器
echo  ============================================================
echo.

if not exist "%MAP%" (
  echo  [X] 找不到地图文件：
  echo      "%MAP%"
  echo      先到「像素校园地图项目\源码」跑一次 python _build\_deliver.py
  echo.
  pause
  exit /b 1
)
if not exist "%JAR%" (
  echo  [X] 找不到后端程序：
  echo      "%JAR%"
  echo      先到「campus_game\backend」跑一次 mvn package -DskipTests
  echo.
  pause
  exit /b 1
)
if not exist "%CG%\frontend\node_modules" (
  echo  [X] 前端依赖没装：
  echo      "%CG%\frontend\node_modules"
  echo      先到「campus_game\frontend」跑一次 npm install
  echo.
  pause
  exit /b 1
)

rem ---------- 1/8 MySQL ----------
call :port 3306
if not errorlevel 1 goto mysql_ok
echo  [1/9] MySQL 没在跑，正在启动（要几秒）...
net start MySQL80 >nul 2>&1
for /l %%I in (1,1,25) do (
  call :port 3306
  if not errorlevel 1 goto mysql_ok
  call :nap
)
echo       ... MySQL 起不来。手动开一下「MySQL80」服务，再双击本文件。
echo       （开始菜单搜「服务」→ 找 MySQL80 → 右键启动）
echo.
pause
exit /b 1
:mysql_ok
echo  [1/9] MySQL 就绪（3306）

rem ---------- 2/8 后端 ----------
rem ⚠️ MinGW 要先挂进 PATH 再 start —— start 继承当前环境，
rem    后端判 C/C++ 题时要调 g++，路径不对会报「编译失败」而不是「找不到编译器」。
set "PATH=%CG%\tools\mingw64\bin;%PATH%"
call :port 8081
if not errorlevel 1 goto be_ok
echo  [2/9] 后端没在跑，正在拉起来（会弹一个小窗口，别关它）...
start "像素校园 · 后端 8081" /min /d "%CG%\backend" "%JAVA_HOME%\bin\java.exe" -jar "target\coding-platform-1.0.0.jar"
:be_ok
echo  [2/9] 后端就绪（8081）

rem ---------- 3/8 前端 ----------
call :port 3000
if not errorlevel 1 goto fe_ok
echo  [3/9] 前端没在跑，正在拉起来（会弹一个小窗口，别关它）...
start "像素校园 · 前端 3000" /min /d "%CG%\frontend" cmd /c npm run dev
:fe_ok
echo  [3/9] 前端就绪（3000）

rem ---------- 4/8 学霸姐 ----------
rem ⚠️ 她是**可选件**：.venv 或索引没建好、或者 40 秒起不来，都只提示、不阻断 ——
rem    地图必须照常打开。真没起来时，进逸夫楼按 C 会弹协议框再兜一次底。
rem ⚠️ 等的是**端口** LISTENING，不是"索引读完了"：她 bind 完还要读 85 MB 向量，
rem    那十几秒里地图侧的登录门有退避重试兜着（见 71b_center.js 的 xbgSync）。
call :port 8010
if not errorlevel 1 goto xbg_ok
if not exist "%XBGPY%" goto xbg_miss
if not exist "%XBGIDX%" goto xbg_miss
echo  [4/9] 学霸姐没在跑，正在拉起来（要读 85 MB 索引，十几秒，别关那个小窗口）...
start "像素校园 · 学霸姐 8010" /min "%XBG%\_serve_8010.bat"
for /l %%I in (1,1,40) do (
  call :port 8010
  if not errorlevel 1 goto xbg_ok
  call :nap
)
echo       ... 学霸姐 40 秒没起来。不影响地图，先往下走。
goto xbg_done
:xbg_miss
echo  [4/9] 学霸姐跳过 —— .venv 或 kb\index 还没建，详见 xueba-ge\DEPLOY.md
goto xbg_done
:xbg_ok
echo  [4/9] 学霸姐就绪（8010）
:xbg_done

rem ---------- 5/8 保安 · 老丁 ----------
rem ⚠️ 也是**可选件**：目录/依赖缺了、或 20 秒起不来，都只提示、不阻断。
rem    真没起来时，走到老丁身边按 C 会弹「请把启动器跑起来」再兜一次底
rem    （见 79_guard.js 的 GUARD_APP.coldTip）。他自己的 run_server.bat 会顺手开浏览器，
rem    这里**不调它** —— 走后端那套「父进程先设 PYTHONPATH、start 继承」的写法，
rem    免得每次启动都多弹一个 8000 的网页。
call :port 8000
if not errorlevel 1 goto ld_ok
if not exist "%LD%\server\app.py" goto ld_miss
set "PYTHONPATH=%LD%\server_vendor;%PYTHONPATH%"
echo  [5/9] 老丁（保卫处 8000）没在跑，正在拉起来...
start "像素校园 · 老丁 8000" /min /d "%LD%" "%LDPY%" server\app.py
for /l %%I in (1,1,20) do (
  call :port 8000
  if not errorlevel 1 goto ld_ok
  call :nap
)
echo       ... 老丁 20 秒没起来。不影响地图，先往下走（按 C 会提示你手动起）。
goto ld_done
:ld_miss
echo  [5/9] 老丁跳过 —— 找不到 laoding\server\app.py
goto ld_done
:ld_ok
echo  [5/9] 老丁就绪（8000）
:ld_done

rem ---------- 6/8 食堂阿姨 ----------
rem ⚠️ 也是**可选件**：目录/依赖缺了、或 20 秒起不来，都只提示、不阻断。
rem    真没起来时，走到学生一食堂门口按 C 会弹「请把启动器跑起来」再兜一次底
rem    （见 80_canteen.js 的 AUNT_APP.coldTip）。
rem ⚠️ 端口是 **8020**，不是 8000 —— 8000 是老丁的地盘。
rem ⚠️ 起法走后端那套「父进程 start 继承」，**不调她的独立脚本**：
rem    免得每次启动都多弹一个 8020 的网页（同一份应用，地图里的抽屉才是正路）。
call :port 8020
if not errorlevel 1 goto cmr_ok
if not exist "%CMR%\aunt\server.py" goto cmr_miss
echo  [6/9] 食堂阿姨（8020）没在跑，正在拉起来...
start "像素校园 · 食堂阿姨 8020" /min /d "%CMR%" "%CMRPY%" -m uvicorn aunt.server:app --host 127.0.0.1 --port 8020
for /l %%I in (1,1,20) do (
  call :port 8020
  if not errorlevel 1 goto cmr_ok
  call :nap
)
echo       ... 食堂阿姨 20 秒没起来。不影响地图，先往下走（按 C 会提示你手动起）。
goto cmr_done
:cmr_miss
echo  [6/9] 食堂阿姨跳过 —— 找不到 campus_game_cmr\aunt\server.py
goto cmr_done
:cmr_ok
echo  [6/9] 食堂阿姨就绪（8020）
:cmr_done

rem ---------- 7/9 联机网关 ----------
rem ⚠️ **可选件**：Node 没装、依赖没下成、端口起不来，都只提示、不阻断 ——
rem    地图自己会落到「单机模式」那条细条（任务书 §7.7），一期的玩法一个字都不少。
rem    这是答辩的保命绳：网关崩了不能把单机版一起带走。
rem ⚠️ 第一次跑要 npm install（只有 ws 和 mysql2 两个依赖，约半分钟）。
call :port 8090
if not errorlevel 1 goto mp_ok
if not exist "%MPGW%\server.js" goto mp_miss
where node >nul 2>&1
if errorlevel 1 goto mp_nonode
if not exist "%MPGW%\node_modules" (
  echo  [7/9] 联机网关第一次跑，正在装依赖（ws + mysql2，约半分钟）...
  call npm install --prefix "%MPGW%" --no-audit --no-fund
)
echo  [7/9] 联机网关没在跑，正在拉起来 ...
start "像素校园 · 联机网关 8090" /min /d "%MPGW%" node server.js
for /l %%I in (1,1,20) do (
  call :port 8090
  if not errorlevel 1 goto mp_ok
  call :nap
)
echo       ... 联机网关 20 秒没起来。不影响地图，只会变成单机模式。
goto mp_done
:mp_miss
echo  [7/9] 联机网关跳过 —— 找不到 像素校园联机版\gateway\server.js
goto mp_done
:mp_nonode
echo  [7/9] 联机网关跳过 —— 这台机器没装 Node，地图会以单机模式打开
goto mp_done
:mp_ok
echo  [7/9] 联机网关就绪（8090）
:mp_done

rem ---------- 8/9 铺地图 ----------
rem ⚠️ 单向复制：项目根那份**始终是权威源**，public/ 这份是生成物。
rem    改名 campus.html 是为了绕开中文文件名的 URL 编码。
if not exist "%PUB%" mkdir "%PUB%"
copy /y "%MAP%" "%PUB%\campus.html" >nul
if errorlevel 1 (
  echo  [X] 复制地图失败："%PUB%\campus.html"
  pause
  exit /b 1
)
rem ⭐ 二期模块 2：联机客户端是**独立文件**（任务书 §10.1），从 3000 打开时它们必须
rem    一起拷进 public\mp\，否则地图只会有「mp/client.js 没加载」那副样子（=单机）。
xcopy /y /e /i /q "%~dp0像素校园联机版\mp" "%PUB%\mp" >nul
echo  [8/9] 地图已铺到 frontend/public/campus.html（联机文件在 public\mp\）

rem ---------- 9/9 等就绪 + 开浏览器 ----------
echo  [9/9] 等 3000 端口响应 ...
for /l %%I in (1,1,90) do (
  call :port 3000
  if not errorlevel 1 goto ready
  call :nap
)
echo       ... 3000 一直没起来，看看那个前端小窗口里报了什么。
echo.
pause
exit /b 1

:ready
echo      全部就绪，打开浏览器 ...
start "" "http://localhost:3000/campus.html"
echo.
echo  ------------------------------------------------------------
echo   已打开。两个预设账号（登录框上点一下就自动填）：
echo       admin / admin123     普通用户：user / user123
echo.
echo   进门后：走到「计算机中心」按 F 进教室 → 走到算法哥身边按 C 开刷题平台
echo           走到「逸夫楼」按 F 进一楼大厅 → 走到学霸姐身边按 C 开教材问答
echo           老丁**不用找** —— 他一直在校园的主干道上巡逻，走到他身边按 C 就开保卫处
echo           走到「学生1食堂」门口（南门）找食堂阿姨，走近按 C 就进食堂问吃的
echo           在里面按 Esc 退出来 → 按 B 出屋回地图
echo.
echo   ⭐ 二期：登录这一次，刷题平台、学霸姐、老丁、食堂阿姨都不用再登 ——
echo      主站登录后 8081 会替你去四家各领一张票（路径限定的 HttpOnly cookie），
echo      四家自己的登录框已经删掉了。哪一家没领到，地图右上角会写「XX 没登进去」。
echo      ⚠️ 领票要内部密钥：必须由本启动器拉起各家服务（它生成 .mp_secret 并传下去），
echo         单独双击各家的 .bat 起服务时换不到票，这是预期的。
echo.
echo   ⭐ 二期模块 2（联机）：再开一个浏览器（**另一个账号**，比如 admin 与 user 各一个），
echo      两边都登录进地图，就能在校园里**互相看见**——头顶是昵称，走动是连续的，
echo      各进各的楼（逸夫楼 / 计算机中心）就互相看不见了，出门又重新出现。
echo      左上角 HUD 最后一行会写「联机 · out · 同场景 N 人」；
echo      8090 那个窗口没开起来的话，它写「单机模式」，一期玩法照常。
echo.
echo   ⭐ 二期模块 3~6（形象 / 私聊 / 公告 / 个人中心）：
echo      点校园里另一个人 = 直接开私聊窗口（他不在线也能发，留言会存着等他上线）；
echo      拖动地图不算点击（移动超过 5 像素就不开窗），在输入框里打字人物不会跟着走；
echo      右上角那颗图钉是全服公告栏（200 字以内、每人 30 秒一条、每天 20 条）；
echo      按 P 或点左上角自己头像 = 个人中心（昵称 / 简介 / 标签 / 形象试衣间）；
echo      试衣间里选的照片**只在你这台电脑上处理**，一个请求都不发出去；
echo      按住别人头像不放 = 弹「看 TA 的主页 / 和 TA 聊天」双选菜单。
echo.
echo   ⭐ 二期模块 7~8：四个 NPC 的对话按账号隔离（换个人登录看不到别人的记录）；
echo      网关重启会自动重连；同一账号开两个标签，后开的那个会被踢下线；
echo      主票过期时地图会自己收抽屉、摘 iframe、重新摆登录门，不会卡在"已登录"。
echo.
echo   ⚠️ 那几个小窗口（后端 / 前端 / 学霸姐 / 老丁 / 食堂阿姨 / 联机网关）不能关，关了对应功能就没了。
echo  ------------------------------------------------------------
echo.
rem 服务是本文件拉起来的才等 3 秒；本来就在跑的（协议触发）不等，直接退。
call :port 8081
if errorlevel 1 timeout /t 3 >nul 2>&1
exit /b 0

rem ---------- 子过程 ----------
:port
rem 探端口：%~1 = 端口号；LISTENING 则 errorlevel=0
netstat -ano | findstr ":%~1 " | findstr "LISTENING" >nul
exit /b %errorlevel%

:nap
rem 睡 1 秒。⚠️ 不用 `timeout`：它在没有交互控制台的场合会直接报错返回。
ping -n 2 127.0.0.1 >nul
exit /b 0
