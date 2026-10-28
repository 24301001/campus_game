@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   3D 房间
echo   地址: http://127.0.0.1:8123/
echo   关闭此窗口即停止服务
echo ========================================
start "" cmd /c "timeout /t 2 >nul & start http://127.0.0.1:8123/"
python -m http.server 8123 --bind 127.0.0.1
