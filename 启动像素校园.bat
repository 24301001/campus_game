@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
echo.
echo  像素校园 · 原地图联机大厅
echo  大厅 http://localhost:3000/ ；同一局域网的电脑使用本机 IPv4 地址。
echo  正在启动大厅与本机可用的四个角色服务。Ctrl+C 可停止本次启动的服务。
echo  单独检查环境：python mp\launch_local.py --check
echo.
python -u mp\launch_local.py --open
if errorlevel 1 pause
