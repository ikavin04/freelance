# Complete Project Initialization Script
# Run this from the project root: .\scripts\setup-project.ps1

Write-Host "🎉 Welcome to Kavin Creative Hub Setup!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is accessible
Write-Host "🔍 Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgCheck = psql -U postgres -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL is accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Cannot connect to PostgreSQL" -ForegroundColor Red
        Write-Host "   Please ensure PostgreSQL is installed and running" -ForegroundColor Yellow
        Write-Host "   Default user: postgres" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ PostgreSQL not found or not in PATH" -ForegroundColor Red
    Write-Host "   Please install PostgreSQL first" -ForegroundColor Yellow
    exit 1
}

# Create database
Write-Host ""
Write-Host "🗄️  Creating database..." -ForegroundColor Yellow
$dbExists = psql -U postgres -lqt | Select-String -Pattern "freelance_db"
if ($dbExists) {
    Write-Host "⚠️  Database 'freelance_db' already exists" -ForegroundColor Yellow
    $response = Read-Host "Do you want to drop and recreate it? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        psql -U postgres -c "DROP DATABASE IF EXISTS freelance_db;"
        psql -U postgres -c "CREATE DATABASE freelance_db;"
        Write-Host "✅ Database recreated" -ForegroundColor Green
    }
} else {
    psql -U postgres -c "CREATE DATABASE freelance_db;"
    Write-Host "✅ Database created" -ForegroundColor Green
}

# Initialize backend
Write-Host ""
Write-Host "🔧 Setting up backend..." -ForegroundColor Cyan
& ".\scripts\init-backend.ps1"

# Initialize frontend
Write-Host ""
Write-Host "🎨 Setting up frontend..." -ForegroundColor Cyan
& ".\scripts\init-frontend.ps1"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎊 Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: Before running the application:" -ForegroundColor Red
Write-Host ""
Write-Host "1. Edit backend\.env with your credentials:" -ForegroundColor Yellow
Write-Host "   - PostgreSQL password" -ForegroundColor White
Write-Host "   - Gmail email (MAIL_USERNAME)" -ForegroundColor White
Write-Host "   - Gmail App Password (MAIL_PASSWORD)" -ForegroundColor White
Write-Host "   - Change JWT_SECRET_KEY and SECRET_KEY" -ForegroundColor White
Write-Host ""
Write-Host "2. Generate Gmail App Password:" -ForegroundColor Yellow
Write-Host "   - Go to: https://myaccount.google.com/security" -ForegroundColor White
Write-Host "   - Enable 2-Step Verification" -ForegroundColor White
Write-Host "   - Create App Password for Mail" -ForegroundColor White
Write-Host ""
Write-Host "3. Run the application:" -ForegroundColor Yellow
Write-Host "   Terminal 1: cd backend; .\venv\Scripts\Activate.ps1; python app.py" -ForegroundColor White
Write-Host "   Terminal 2: cd frontend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "4. Open: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 For detailed instructions, see:" -ForegroundColor Cyan
Write-Host "   - README.md (full documentation)" -ForegroundColor White
Write-Host "   - SETUP_GUIDE.md (quick start)" -ForegroundColor White
Write-Host "   - CHEATSHEET.md (commands)" -ForegroundColor White
Write-Host ""
