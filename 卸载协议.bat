@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

rem ============================================================
rem   撤销 pixelcampus:// 协议（第四十轮）
rem ------------------------------------------------------------
rem   就删一个键：HKCU\Software\Classes\pixelcampus
rem   ⚠️ 只删这一个。**不要**写成删 Software\Classes 或更大范围 ——
rem      那是把整个用户级的文件关联一起铲了。
rem   ⚠️ 本文件必须存成 UTF-8 无 BOM + CRLF。
rem ============================================================

echo.
echo  撤销 pixelcampus:// 协议 ...
echo.

reg query "HKCU\Software\Classes\pixelcampus" >nul 2>&1
if errorlevel 1 (
  echo  [--] 本来就没注册过，什么都不用做。
  echo.
  pause
  exit /b 0
)

reg delete "HKCU\Software\Classes\pixelcampus" /f >nul
if errorlevel 1 (
  echo  [X] 删除失败。可能被别的程序占着，重开一个窗口再试。
  echo.
  pause
  exit /b 1
)

echo  [OK] 撤销了。
echo.
echo  刷题平台照旧能玩 —— 这个协议只在服务被关掉时兜底，
echo  平时都是启动器直接把服务拉起来的。
echo.
pause
exit /b 0
