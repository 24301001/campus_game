@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 学霸哥 · 学霸哥服务 (127.0.0.1:8010)

REM ============================================================
REM  学霸哥 · 一键启动
REM
REM  这是给「本机已经配好」的情况用的，只负责把服务拉起来。
REM  第一次配环境 / 重建索引请看 DEPLOY.md，或者跑：
REM      .venv\Scripts\python.exe -m kb.build
REM
REM  ⚠️ 两条本机踩过的坑，别删：
REM   1. PYTHONUTF8=1 —— 中文 Windows 默认 GBK。队友的 requirements.txt 和
REM      语料都是 UTF-8，不开这个会 UnicodeDecodeError。
REM   2. 不设任何 *_PROXY —— 阿里云百炼是国内服务，实测直连就是 HTTP 200。
REM      但如果你本机 Clash 开了全局模式导致直连不通，把下面两行注释取消：
REM          set HTTP_PROXY=http://127.0.0.1:7897
REM          set HTTPS_PROXY=http://127.0.0.1:7897
REM ============================================================

set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
set NO_PROXY=127.0.0.1,localhost

if not exist ".venv\Scripts\python.exe" (
    echo [!] 没找到 .venv —— 环境还没建。
    echo     先跑：python -m venv .venv
    echo            .venv\Scripts\python.exe -m pip install -r requirements.txt
    pause
    exit /b 1
)

if not exist "kb\index\doc_vecs.f32" (
    echo [!] 没找到索引 kb\index\ —— 第一次启动前必须建一次，约 3~6 分钟：
    echo         .venv\Scripts\python.exe -m kb.build
    pause
    exit /b 1
)

echo.
echo   学霸哥就绪  →  http://127.0.0.1:8010/xbg/
echo   浏览器打开后注册个账号就能聊；顶栏「资料库」是教材/往年卷面板。
echo   ⚠️ 尾巴那个 /xbg/ 是第四十一轮加的网关前缀（与像素校园地图同源的那条路）。
echo      裸 http://127.0.0.1:8010 也照常能用 —— 剥前缀的中间件就在本服务里，
echo      两条路同时活着，所以 tests\smoke_api.py 一个字没改。
echo   关掉这个黑窗口即停服务。
echo.
start "" "http://127.0.0.1:8010/xbg/"
".venv\Scripts\python.exe" -m uvicorn backend.app:app --host 127.0.0.1 --port 8010
pause
