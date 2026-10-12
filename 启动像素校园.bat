@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

rem ============================================================
rem   像素校园 · 启动器（第四十轮）
rem ------------------------------------------------------------
rem   干八件事：
rem     1) 确认 MySQL 在跑        2) 后端 8081 没跑就拉起来
rem     3) 前端 3000 没跑就拉起来  4) 学霸姐 8010 没跑就拉起来（**可选件，失败不阻断**）
rem     5) 老丁 8000 没跑就拉起来（**可选件，失败不阻断**）
rem     6) 阿姨 8020 没跑就拉起来（**可选件，失败不阻断**）
rem     7) 把地图复制成 frontend/public/campus.html
rem     8) 等 3000 就绪 → 打开浏览器 http://localhost:3000/campus.html
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

set "MAP=%~dp0像素校园地图项目\像素校园_全校地图.html"
set "CG=%~dp0campus_game"
set "JAR=%CG%\backend\target\coding-platform-1.0.0.jar"
set "PUB=%CG%\frontend\public"
set "JAVA_HOME=C:\Program Files\Java\jdk1.8.0_202"
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
echo  [1/8] MySQL 没在跑，正在启动（要几秒）...
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
echo  [1/8] MySQL 就绪（3306）

rem ---------- 2/8 后端 ----------
rem ⚠️ MinGW 要先挂进 PATH 再 start —— start 继承当前环境，
rem    后端判 C/C++ 题时要调 g++，路径不对会报「编译失败」而不是「找不到编译器」。
set "PATH=%CG%\tools\mingw64\bin;%PATH%"
call :port 8081
if not errorlevel 1 goto be_ok
echo  [2/8] 后端没在跑，正在拉起来（会弹一个小窗口，别关它）...
start "像素校园 · 后端 8081" /min /d "%CG%\backend" "%JAVA_HOME%\bin\java.exe" -jar "target\coding-platform-1.0.0.jar"
:be_ok
echo  [2/8] 后端就绪（8081）

rem ---------- 3/8 前端 ----------
call :port 3000
if not errorlevel 1 goto fe_ok
echo  [3/8] 前端没在跑，正在拉起来（会弹一个小窗口，别关它）...
start "像素校园 · 前端 3000" /min /d "%CG%\frontend" cmd /c npm run dev
:fe_ok
echo  [3/8] 前端就绪（3000）

rem ---------- 4/8 学霸姐 ----------
rem ⚠️ 她是**可选件**：.venv 或索引没建好、或者 40 秒起不来，都只提示、不阻断 ——
rem    地图必须照常打开。真没起来时，进逸夫楼按 C 会弹协议框再兜一次底。
rem ⚠️ 等的是**端口** LISTENING，不是"索引读完了"：她 bind 完还要读 85 MB 向量，
rem    那十几秒里地图侧的登录门有退避重试兜着（见 71b_center.js 的 xbgSync）。
call :port 8010
if not errorlevel 1 goto xbg_ok
if not exist "%XBGPY%" goto xbg_miss
if not exist "%XBGIDX%" goto xbg_miss
echo  [4/8] 学霸姐没在跑，正在拉起来（要读 85 MB 索引，十几秒，别关那个小窗口）...
start "像素校园 · 学霸姐 8010" /min "%XBG%\_serve_8010.bat"
for /l %%I in (1,1,40) do (
  call :port 8010
  if not errorlevel 1 goto xbg_ok
  call :nap
)
echo       ... 学霸姐 40 秒没起来。不影响地图，先往下走。
goto xbg_done
:xbg_miss
echo  [4/8] 学霸姐跳过 —— .venv 或 kb\index 还没建，详见 xueba-ge\DEPLOY.md
goto xbg_done
:xbg_ok
echo  [4/8] 学霸姐就绪（8010）
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
echo  [5/8] 老丁（保卫处 8000）没在跑，正在拉起来...
start "像素校园 · 老丁 8000" /min /d "%LD%" "%LDPY%" server\app.py
for /l %%I in (1,1,20) do (
  call :port 8000
  if not errorlevel 1 goto ld_ok
  call :nap
)
echo       ... 老丁 20 秒没起来。不影响地图，先往下走（按 C 会提示你手动起）。
goto ld_done
:ld_miss
echo  [5/8] 老丁跳过 —— 找不到 laoding\server\app.py
goto ld_done
:ld_ok
echo  [5/8] 老丁就绪（8000）
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
echo  [6/8] 食堂阿姨（8020）没在跑，正在拉起来...
start "像素校园 · 食堂阿姨 8020" /min /d "%CMR%" "%CMRPY%" -m uvicorn aunt.server:app --host 127.0.0.1 --port 8020
for /l %%I in (1,1,20) do (
  call :port 8020
  if not errorlevel 1 goto cmr_ok
  call :nap
)
echo       ... 食堂阿姨 20 秒没起来。不影响地图，先往下走（按 C 会提示你手动起）。
goto cmr_done
:cmr_miss
echo  [6/8] 食堂阿姨跳过 —— 找不到 campus_game_cmr\aunt\server.py
goto cmr_done
:cmr_ok
echo  [6/8] 食堂阿姨就绪（8020）
:cmr_done

rem ---------- 7/8 铺地图 ----------
rem ⚠️ 单向复制：项目根那份**始终是权威源**，public/ 这份是生成物。
rem    改名 campus.html 是为了绕开中文文件名的 URL 编码。
if not exist "%PUB%" mkdir "%PUB%"
copy /y "%MAP%" "%PUB%\campus.html" >nul
if errorlevel 1 (
  echo  [X] 复制地图失败："%PUB%\campus.html"
  pause
  exit /b 1
)
echo  [7/8] 地图已铺到 frontend/public/campus.html

rem ---------- 8/8 等就绪 + 开浏览器 ----------
echo  [8/8] 等 3000 端口响应 ...
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
echo   ⭐ 登录这一次，刷题平台、学霸姐、老丁都不用再登了（同一套账号密码）。
echo      ⚠️ 食堂只认 admin：用 user 登入时，进食堂会弹她自己的登录框
echo         （user123 只有 7 位，她那边要求至少 8 位）—— 这是既定行为，不是故障。
echo.
echo   ⚠️ 那几个小窗口（后端 / 前端 / 学霸姐 / 老丁 / 食堂阿姨）不能关，关了对应功能就没了。
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
