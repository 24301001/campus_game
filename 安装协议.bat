@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

rem ============================================================
rem   注册 pixelcampus:// 协议（第四十轮）
rem ------------------------------------------------------------
rem   为什么需要它：网页**不能**自己执行本地程序 —— 这是浏览器的铁律，
rem   不是权限问题，谁也绕不过去。唯一合法的通道就是这个「自定义协议」：
rem   网页写 location.href = "pixelcampus://start"，浏览器弹一次
rem   「是否打开 启动像素校园.bat」，用户点一下，程序才跑起来。
rem
rem   ⚠️ 正常玩法下**根本用不到它**：地图本来就从启动器打开的，
rem      后端和前端必然在跑，按 C 是秒开刷题平台的。
rem      它只在「服务中途被关掉了」时兜底。
rem
rem   ⚠️ 写在 HKCU（当前用户）下 —— **不需要管理员权限**，也不动系统级设置。
rem      卸载就是删掉这一个键，见「卸载协议.bat」。
rem
rem   ⚠️ 本文件必须存成 UTF-8 无 BOM + CRLF。
rem ============================================================

set "BAT=%~dp0启动像素校园.bat"

if not exist "%BAT%" (
  echo  [X] 找不到启动器：
  echo      "%BAT%"
  echo      本文件和「启动像素校园.bat」必须在同一个文件夹里。
  echo.
  pause
  exit /b 1
)

echo.
echo  ============================================================
echo    注册 pixelcampus:// 协议
echo  ============================================================
echo.
echo  指向： "%BAT%"
echo.

reg add "HKCU\Software\Classes\pixelcampus" /ve /d "URL:pixelcampus Protocol" /f >nul
reg add "HKCU\Software\Classes\pixelcampus" /v "URL Protocol" /d "" /f >nul
reg add "HKCU\Software\Classes\pixelcampus\DefaultIcon" /ve /d "\"%BAT%\",0" /f >nul
reg add "HKCU\Software\Classes\pixelcampus\shell\open\command" /ve /d "\"%BAT%\" \"%%1\"" /f >nul

if errorlevel 1 (
  echo  [X] 写注册表失败。
  echo.
  pause
  exit /b 1
)

echo  [OK] 注册好了。
echo.
echo  现在浏览器里点 pixelcampus:// 链接，就会问你要不要打开启动器。
echo  （正常玩法用不到 —— 只在刷题平台的服务被关掉时兜底。）
echo.
echo  撤销：双击本目录下的「卸载协议.bat」。
echo.
pause
exit /b 0
