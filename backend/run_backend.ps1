Set-Location $PSScriptRoot
$pythonVersion = & py -3.11 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}')"
if ($LASTEXITCODE -ne 0) {
  Write-Host "Python 3.11 is required. Install Python 3.11.9, then rerun this script." -ForegroundColor Red
  exit 1
}

Write-Host "Using Python $pythonVersion for EchoGuard AI backend."
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
