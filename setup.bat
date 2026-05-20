@echo off
cd /d "%~dp0"
echo Installing dependencies...
call npm install
echo.
echo Starting dev server...
call npm run dev
