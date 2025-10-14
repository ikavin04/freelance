# Frontend Initialization Script
# Run this from the project root: .\scripts\init-frontend.ps1

Write-Host "🚀 Initializing Frontend..." -ForegroundColor Cyan

# Navigate to frontend directory
Set-Location -Path "frontend"

# Install dependencies
Write-Host "📥 Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
npm install

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created with default values" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Frontend initialization complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Ensure backend is running on http://localhost:5000" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""

# Return to project root
Set-Location -Path ".."
