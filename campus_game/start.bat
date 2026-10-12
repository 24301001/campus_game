@echo off
title Coding Platform - Startup
color 0A

set "PROJECT_DIR=%~dp0"
set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

echo =============================================
echo   Coding Platform - Start
echo =============================================
echo.

:: Check dependencies
echo [1/3] Checking MySQL...
sc query MySQL80 2>nul | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo  [!] MySQL not running, starting...
    net start MySQL80 >nul 2>&1
    if %errorlevel% neq 0 (
        echo  [FAIL] Start MySQL80 manually via services.msc
        pause
        exit /b 1
    )
)
echo  [OK]
echo.

:: Check if Java/Maven work
echo [2/3] Checking Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [FAIL] Java not found
    pause
    exit /b 1
)
echo  [OK]
echo.

:: Check if compiled already
if not exist "%PROJECT_DIR%\backend\target\classes\com\coding\platform\CodingPlatformApplication.class" (
    echo  [WARN] Backend not compiled yet.
    echo   Please compile once first:
    echo.
    echo   cd /d "%PROJECT_DIR%\backend"
    echo   mvn compile -DskipTests
    echo.
    echo  Or press any key to compile now...
    pause
    cd /d "%PROJECT_DIR%\backend"
    call mvn compile -DskipTests
    if %errorlevel% neq 0 (
        echo  [FAIL] Compilation failed
        pause
        exit /b 1
    )
    cd /d "%PROJECT_DIR%"
)
echo  [OK] Backend compiled
echo.

echo [3/3] Starting services...
echo.

:: Kill old windows
taskkill /fi "WINDOWTITLE eq Backend*" /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq Frontend*" /f >nul 2>&1

:: Backend
echo  Starting Backend (port 8081)...
start "Backend - Coding Platform" cmd /k "title Backend - Coding Platform && cd /d "%PROJECT_DIR%\backend" && mvn spring-boot:run -DskipTests"

:: Frontend
echo  Starting Frontend (port 3000)...
start "Frontend - Coding Platform" cmd /k "title Frontend - Coding Platform && cd /d "%PROJECT_DIR%\frontend" && npm run dev"

echo.
echo =============================================
echo   Started!
echo   Frontend: http://localhost:3000
echo   Backend:  http://127.0.0.1:8081
echo =============================================
echo.
echo  Close this window to stop all services.
echo.

pause >nul

taskkill /fi "WINDOWTITLE eq Backend*" /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq Frontend*" /f >nul 2>&1
