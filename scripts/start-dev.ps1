$root = Split-Path -Parent $PSScriptRoot
Write-Host "Starting AudioAware AI backend and frontend..."
Start-Process powershell -WindowStyle Hidden -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$root\backend\start-backend.ps1`""
Start-Process powershell -WindowStyle Hidden -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "Set-Location `"$root\frontend`"; npm install; npm run dev -- --host 0.0.0.0"
Write-Host "Backend:  http://localhost:8000"
Write-Host "Frontend: http://localhost:5173"
