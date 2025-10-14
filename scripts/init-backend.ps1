# Backend Initialization Script
# Run this from the project root: .\scripts\init-backend.ps1

Write-Host "🚀 Initializing Backend..." -ForegroundColor Cyan

# Navigate to backend directory
Set-Location -Path "backend"

# Check if virtual environment exists
if (!(Test-Path "venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✅ Virtual environment created!" -ForegroundColor Green
} else {
    Write-Host "✅ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please edit backend\.env with your credentials!" -ForegroundColor Red
    Write-Host "   - PostgreSQL password" -ForegroundColor Yellow
    Write-Host "   - Gmail email and app password" -ForegroundColor Yellow
    Write-Host "   - Secret keys (change them!)" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Backend initialization complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit backend\.env with your credentials" -ForegroundColor White
Write-Host "2. Ensure PostgreSQL is running" -ForegroundColor White
Write-Host "3. Create database: CREATE DATABASE freelance_db;" -ForegroundColor White
Write-Host "4. Run: python app.py" -ForegroundColor White
Write-Host ""

# Return to project root
Set-Location -Path ".."
