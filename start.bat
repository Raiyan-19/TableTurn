@echo off
echo ===================================================
echo   Starting TableTurn Bangladesh Platform
echo ===================================================
echo Starting Backend API Server on http://localhost:5000 ...
start "TableTurn Backend API" cmd /k "cd /d %~dp0server && node server.js"

echo Starting Vite Frontend on http://localhost:5173 ...
start "TableTurn Web App" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo All services launched!
echo Opening http://localhost:5173 in your default browser...
echo ===================================================
timeout /t 2 /nobreak >nul
start http://localhost:5173
pause
