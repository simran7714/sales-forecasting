@echo off
title Sales Forecasting System - Launcher
echo =====================================================================
echo  SALES FORECASTING SYSTEM USING MACHINE LEARNING & TIME SERIES
echo  "Analyze Past Sales. Predict Future Growth."
echo =====================================================================
echo.

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo [1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000 ...
start "Sales Forecast Backend (FastAPI)" cmd /k "cd /d %SCRIPT_DIR%backend && venv\Scripts\python.exe run.py"

echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "Sales Forecast Frontend (React)" cmd /k "cd /d %SCRIPT_DIR%frontend && npm run dev"

echo.
echo Both servers are launching in separate terminal windows!
echo - Landing Page & Dashboard: http://localhost:5173
echo - FastAPI Interactive Docs:  http://127.0.0.1:8000/docs
echo.
pause
