# Sales Forecasting System - PowerShell Launcher
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " SALES FORECASTING SYSTEM USING MACHINE LEARNING & TIME SERIES" -ForegroundColor Yellow
Write-Host " 'Analyze Past Sales. Predict Future Growth.'" -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir\backend'; .\venv\Scripts\python.exe run.py"

Write-Host "[2/2] Starting React Vite Frontend on http://localhost:5173 ..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir\frontend'; npm run dev"

Write-Host ""
Write-Host "Both servers launched!" -ForegroundColor Green
Write-Host "- Web Application: http://localhost:5173" -ForegroundColor Yellow
Write-Host "- Swagger API Docs: http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host ""
