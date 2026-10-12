@echo off
chcp 65001 >nul
rem 切到本脚本所在目录（项目根目录）
cd /d "%~dp0"

rem 依赖装在模块目录内的 server_vendor，无需系统 pip
set "PYTHONPATH=%~dp0server_vendor;%PYTHONPATH%"

rem 解析 Python：优先嵌入版 D:\Scripts\python.exe，没有就用 PATH 上的 python
set "PYEXE=D:\Scripts\python.exe"
if not exist "%PYEXE%" set "PYEXE=python"

echo ============================================================
echo   保安 · 老丁  后端 + 网页 一起启动
echo   地址: http://127.0.0.1:8000
echo   停止: 本窗口按 Ctrl+C，或直接关窗
echo ============================================================
echo.

rem 3 秒后用默认浏览器打开页面（独立小窗等待，不挡服务启动）
start "open-browser" /min cmd /c "timeout /t 3 >nul & start "" http://127.0.0.1:8000"

"%PYEXE%" server\app.py

echo.
echo 服务已退出。如果上面有报错，把红字截图发我。
pause
