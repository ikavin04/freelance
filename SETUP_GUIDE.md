# 🚀 Quick Setup Guide - Kavin Creative Hub

This guide will get you up and running in **under 10 minutes**!

## ⚡ Quick Start Commands

### 1️⃣ Database Setup (2 minutes)

```powershell
# Start PostgreSQL (if not running)
# Windows: Open pgAdmin or Services

# Create database (run in psql or pgAdmin)
# psql -U postgres
CREATE DATABASE freelance_db;
```

### 2️⃣ Backend Setup (3 minutes)

```powershell
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Setup environment
copy .env.example .env

# Edit .env and add:
# - Your PostgreSQL password
# - Gmail email and app password
# - Change secret keys

# Run backend
python app.py
```

**Backend runs on:** `http://localhost:5000`

### 3️⃣ Frontend Setup (3 minutes)

Open a **new terminal**:

```powershell
cd frontend

# Install dependencies
npm install

# Setup environment
copy .env.example .env

# Run frontend
npm run dev
```

**Frontend runs on:** `http://localhost:3000`

## 🔑 Important: Gmail App Password

To send OTP emails, you **MUST** set up Gmail App Password:

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Search for **"App passwords"**
4. Select **Mail** → Generate
5. Copy the **16-character password**
6. Add to `backend/.env`:
   ```env
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=abcd efgh ijkl mnop
   ```

## 📝 Required Environment Variables

### Backend `.env`
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/freelance_db
JWT_SECRET_KEY=change-this-to-something-random-and-secure
SECRET_KEY=change-this-to-something-random-and-secure
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## ✅ Verify Setup

1. **Backend**: Visit `http://localhost:5000` → Should see: `{"message": "Kavin Creative Hub API is running!"}`
2. **Frontend**: Visit `http://localhost:3000` → Should see the homepage
3. **Database**: Check if tables exist:
   ```sql
   \c freelance_db
   \dt
   -- Should show: users, otps, applications
   ```

## 🎯 Test the Application

1. **Register**: Go to `/register`
   - Enter your details
   - Check email for OTP
   - Verify OTP

2. **Login**: Go to `/login`
   - Enter credentials
   - Get redirected to `/apply`

3. **Apply**: Submit a project
   - Fill the form
   - Try < 3 days (should fail)
   - Submit with ≥ 3 days (success! 🎉)

4. **View**: Check `/my-applications`

## 🐛 Troubleshooting

### Backend won't start
- ✅ Check PostgreSQL is running
- ✅ Verify `.env` file exists and has correct values
- ✅ Activate virtual environment

### Can't receive OTP emails
- ✅ Enable 2-Step Verification in Gmail
- ✅ Generate App Password (not your regular Gmail password)
- ✅ Check spam folder

### Frontend won't connect to backend
- ✅ Check backend is running on port 5000
- ✅ Verify `VITE_API_URL` in frontend `.env`
- ✅ Check for CORS errors in browser console

### Database connection error
- ✅ Check PostgreSQL service is running
- ✅ Verify database name and password in `DATABASE_URL`
- ✅ Test connection: `psql -U postgres -d freelance_db`

## 📦 Project Structure

```
freelance/
├── backend/           # Flask API
├── frontend/          # React App
├── database/          # SQL schemas
└── README.md          # Full documentation
```

## 🎨 Features You'll See

- ✨ Beautiful dark theme with purple-blue gradients
- 💎 Glassmorphism design
- 🎭 Smooth animations
- 🎊 Confetti on success
- 📧 Professional OTP emails
- 🔒 Secure authentication
- 📱 Fully responsive

## 🚀 What's Next?

- Explore the codebase
- Customize colors in `tailwind.config.js`
- Add your social media links in `Footer.jsx`
- Deploy to production (see main README.md)

## 💡 Tips

- Use **real email** for testing OTP
- Keep both terminals open (backend + frontend)
- Check browser console for any errors
- OTP expires in 5 minutes

---

**Need help?** Check the main `README.md` for detailed documentation!

**Built with ❤️ by Kavin**
