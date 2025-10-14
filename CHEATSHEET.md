# 🎯 Development Cheat Sheet

## 🔧 Common Commands

### Backend Commands

```powershell
# Activate virtual environment
cd backend
.\venv\Scripts\Activate.ps1

# Install new package
pip install package-name
pip freeze > requirements.txt

# Run backend
python app.py

# Run in debug mode
$env:FLASK_DEBUG=1; python app.py

# Database operations (Flask shell)
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()  # Create tables
...     db.drop_all()    # Drop all tables
```

### Frontend Commands

```powershell
# Install dependencies
cd frontend
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install package-name
```

### Database Commands

```sql
-- Connect to database
psql -U postgres -d freelance_db

-- List tables
\dt

-- View table structure
\d users
\d otps
\d applications

-- View all users
SELECT * FROM users;

-- View all applications
SELECT * FROM applications;

-- Clear a table
TRUNCATE TABLE otps;

-- Drop database (careful!)
DROP DATABASE freelance_db;

-- Create database
CREATE DATABASE freelance_db;

-- Export database
pg_dump -U postgres freelance_db > backup.sql

-- Import database
psql -U postgres freelance_db < backup.sql
```

## 🐛 Debugging Tips

### Check Backend Logs
```powershell
# Backend terminal shows all requests
# Look for errors in red
```

### Check Frontend Console
```javascript
// Open browser DevTools (F12)
// Check Console tab for errors
// Check Network tab for API calls
```

### Test API Endpoints
```powershell
# Using curl (install from chocolatey)
curl http://localhost:5000/

# Register user
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"123456\",\"confirm_password\":\"123456\"}'
```

## 📝 Useful SQL Queries

```sql
-- Count users
SELECT COUNT(*) FROM users;

-- Find user by email
SELECT * FROM users WHERE email = 'user@example.com';

-- View recent applications
SELECT * FROM applications ORDER BY created_at DESC LIMIT 10;

-- View applications with user details
SELECT a.*, u.name, u.email 
FROM applications a 
JOIN users u ON a.user_email = u.email;

-- Delete expired OTPs
DELETE FROM otps WHERE created_at < NOW() - INTERVAL '5 minutes';

-- View unverified users
SELECT * FROM users WHERE verified = false;
```

## 🎨 Customization Guide

### Change Color Theme

Edit `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: {
    600: '#your-color',  // Main purple
  },
  accent: {
    600: '#your-color',  // Main blue
  }
}
```

### Change Font

Edit `frontend/src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'YourFont', sans-serif;
}
```

### Update Social Links

Edit `frontend/src/components/Footer.jsx`:

```javascript
const socialLinks = [
  { icon: FaInstagram, href: 'YOUR_INSTAGRAM_URL' },
  { icon: FaYoutube, href: 'YOUR_YOUTUBE_URL' },
  { icon: FaGithub, href: 'YOUR_GITHUB_URL' },
];
```

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET_KEY` in backend `.env`
- [ ] Change `SECRET_KEY` in backend `.env`
- [ ] Use Gmail App Password (not regular password)
- [ ] Never commit `.env` files to git
- [ ] Use strong database password
- [ ] Enable HTTPS in production
- [ ] Set up CORS properly for production

## 📦 Git Commands

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/ikavin04/freelance.git
git branch -M main
git push -u origin main
```

## 🚀 Deployment Checklist

### Backend (Render/Railway)
- [ ] Create account
- [ ] Connect GitHub repo
- [ ] Set environment variables
- [ ] Add PostgreSQL addon
- [ ] Deploy

### Frontend (Vercel/Netlify)
- [ ] Create account
- [ ] Connect GitHub repo
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Add `VITE_API_URL` env variable
- [ ] Deploy

## 🛠️ VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Python
- SQLTools
- Thunder Client (API testing)
- GitLens
- Prettier
- ESLint

## ⌨️ VS Code Shortcuts

- `Ctrl + Shift + P` - Command palette
- `Ctrl + \`` - Toggle terminal
- `Ctrl + P` - Quick open file
- `Ctrl + /` - Comment line
- `Alt + Shift + F` - Format document
- `F12` - Go to definition
- `Ctrl + Space` - Trigger suggestions

## 🎯 Performance Tips

### Frontend
```javascript
// Use React.memo for expensive components
export default React.memo(ComponentName);

// Lazy load routes
const Home = lazy(() => import('./pages/Home'));

// Optimize images
// Use WebP format
// Add width/height attributes
```

### Backend
```python
# Use database indexes
# Optimize queries with joins
# Cache frequently accessed data
# Use pagination for large datasets
```

## 📊 Project Statistics

```powershell
# Count lines of code
cd frontend/src
(Get-ChildItem -Recurse -Include *.jsx,*.js,*.css | Get-Content | Measure-Object -Line).Lines

cd ../../backend
(Get-ChildItem -Recurse -Include *.py | Get-Content | Measure-Object -Line).Lines
```

## 🎉 Testing Checklist

- [ ] Register with valid email
- [ ] Receive OTP email
- [ ] Verify OTP
- [ ] Login with credentials
- [ ] Submit application with < 3 days (should fail)
- [ ] Submit application with ≥ 3 days (should succeed)
- [ ] View applications page
- [ ] Test logout
- [ ] Test protected routes without login
- [ ] Test responsive design on mobile
- [ ] Test all navigation links
- [ ] Test form validation

---

**Keep this cheat sheet handy during development!** 🚀
