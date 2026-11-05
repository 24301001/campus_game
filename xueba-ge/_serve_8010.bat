@echo off
chcp 65001 >nul
rem ============================================================
rem   学霸姐 · 后台启动壳（第四十一轮）
rem ------------------------------------------------------------
rem   给「启动像素校园.bat」用：只把服务拉起来，**不弹浏览器**。
rem   为什么要单独一个壳、而不是给「启动学霸哥.bat」加参数：
rem     那个文件里有中文、结尾有 pause、还会 start 浏览器；
rem     在中文路径 + chcp 65001 下用 start 传参不稳。新开一个最干净。
rem
rem   环境三件套照抄「启动学霸哥.bat」，一个字都不能少：
rem     PYTHONUTF8 / PYTHONIOENCODING —— 中文 Windows 默认 GBK，语料是 UTF-8
rem     NO_PROXY —— 阿里云百炼是国内服务，本机实测直连就是 200
rem ============================================================

set PYTHONUTF8=1
set PYTHONIOENCODING=utf-8
set NO_PROXY=127.0.0.1,localhost

cd /d "%~dp0"
".venv\Scripts\python.exe" -m uvicorn backend.app:app --host 127.0.0.1 --port 8010
