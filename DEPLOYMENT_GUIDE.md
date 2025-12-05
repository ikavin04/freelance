# 🚀 DEPLOYMENT GUIDE - Freelance Web Application

## Complete Deployment to Render.com (Free Tier)

This guide will help you deploy your full-stack application with:
- ✅ Backend (Flask API)
- ✅ Frontend (React App)
- ✅ Database (PostgreSQL)
- ✅ All for FREE!

---

## 📋 Prerequisites

1. GitHub account
2. Render.com account (sign up at https://render.com)
3. Gmail account (for email service)
4. Git installed on your computer

---

## 🔧 STEP 1: Prepare Your Code

### 1.1 Update Environment Variables

Create/Update `backend/.env.example`:
```env
DATABASE_URL=your_postgresql_url_here
JWT_SECRET_KEY=your_super_secret_key_change_this
SECRET_KEY=another_secret_key_change_this
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_specific_password
MAIL_DEFAULT_SENDER=your_email@gmail.com
```

### 1.2 Update Frontend API URL

Edit `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com/api';
```

---

## 🗄️ STEP 2: Deploy PostgreSQL Database

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:
   - **Name**: `freelance-db`
   - **Database**: `freelance_db`
   - **User**: `freelance_user`
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **"Create Database"**
5. **SAVE** the following from the database page:
   - **Internal Database URL** (for backend)
   - **External Database URL** (for local testing)

---

## 🖥️ STEP 3: Deploy Backend (Flask API)

### 3.1 Push Code to GitHub

```bash
cd E:\WEB\freelance
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/freelance.git
git push -u origin main
```

### 3.2 Deploy on Render

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `freelance-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free

### 3.3 Add Environment Variables

In the Render dashboard for your backend service, go to **"Environment"** and add:

```
DATABASE_URL = [Paste Internal Database URL from Step 2]
JWT_SECRET_KEY = your_generated_secret_key_here
SECRET_KEY = another_generated_secret_key_here
MAIL_SERVER = smtp.gmail.com
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_USERNAME = your_email@gmail.com
MAIL_PASSWORD = your_gmail_app_password
MAIL_DEFAULT_SENDER = your_email@gmail.com
```

**Important:** For Gmail App Password:
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search for "App Passwords"
4. Create new app password for "Mail"
5. Use this 16-character password in `MAIL_PASSWORD`

### 3.4 Deploy

Click **"Create Web Service"** and wait for deployment (5-10 minutes)

Your backend will be available at: `https://freelance-backend.onrender.com`

---

## 🎨 STEP 4: Deploy Frontend (React App)

### 4.1 Update API URL

Edit `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://freelance-backend.onrender.com/api';
```

Commit changes:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

### 4.2 Deploy on Render

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect same GitHub repository
4. Configure:
   - **Name**: `freelance-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

### 4.3 Add Environment Variable

In Environment section:
```
VITE_API_URL = https://freelance-backend.onrender.com/api
```

### 4.4 Deploy

Click **"Create Static Site"** and wait for deployment (3-5 minutes)

Your frontend will be available at: `https://freelance-frontend.onrender.com`

---

## 🔧 STEP 5: Update CORS Settings

Update `backend/app.py`:
```python
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://freelance-frontend.onrender.com",
            "http://localhost:3000"
        ]
    }
}, supports_credentials=True)
```

Commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the changes.

---

## 🗄️ STEP 6: Initialize Database

### 6.1 Create Admin User

Once backend is deployed, go to your backend URL and add `/admin-init` to run migrations:

Or use Render Shell:
1. Go to backend service on Render
2. Click **"Shell"**
3. Run:
```bash
python create_admin.py
```

---

## ✅ STEP 7: Test Your Deployment

1. **Visit Frontend**: `https://freelance-frontend.onrender.com`
2. **Test Registration**: Create a new user account
3. **Check Email**: Verify OTP email arrives
4. **Test Login**: Login with verified account
5. **Submit Application**: Test application submission
6. **Admin Login**: Use admin credentials
7. **Test File Upload**: Upload files as admin
8. **Test Delivery**: Submit delivery with URLs

---

## 🎯 Your Deployed URLs

- **Frontend**: https://freelance-frontend.onrender.com
- **Backend API**: https://freelance-backend.onrender.com
- **Database**: Managed by Render (PostgreSQL)

---

## 📝 Important Notes

### Free Tier Limitations:
- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free (one service = 24/7)
- Database: 1 GB storage, 97 hours/month

### To Keep Services Active:
Use a service like UptimeRobot or Cron-job.org to ping your backend every 10 minutes:
- URL to ping: `https://freelance-backend.onrender.com/`
- Interval: Every 10 minutes

---

## 🔒 Security Checklist

- ✅ Change all SECRET_KEY values
- ✅ Use Gmail App Password (not regular password)
- ✅ Don't commit `.env` file
- ✅ Update CORS origins to your actual URLs
- ✅ Enable HTTPS only (automatic on Render)
- ✅ Use strong JWT secret keys

---

## 🐛 Troubleshooting

### Backend Issues:
- Check logs in Render dashboard
- Verify DATABASE_URL is set correctly
- Ensure all environment variables are set
- Check Python version (should be 3.10)

### Frontend Issues:
- Verify VITE_API_URL is correct
- Check browser console for errors
- Ensure build command completed successfully
- Clear browser cache

### Database Issues:
- Verify connection string format
- Check if database is active
- Run migrations if needed
- Check database logs

### Email Issues:
- Use Gmail App Password, not regular password
- Enable 2-Step Verification first
- Check MAIL_USERNAME and MAIL_PASSWORD
- Verify SMTP settings

---

## 🚀 Alternative Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend + DB)
- Deploy frontend to Vercel: `vercel --prod`
- Keep backend and DB on Render

### Option 2: Railway.app (All-in-One)
- Supports full-stack deployment
- Automatic PostgreSQL provisioning
- $5/month credit (then paid)

### Option 3: Heroku
- Backend + Database on Heroku
- Frontend on Vercel or Netlify

### Option 4: DigitalOcean App Platform
- Full-stack deployment
- More control
- Starts at $5/month

---

## 📊 Monitoring Your App

1. **Render Dashboard**: Monitor service health
2. **Database Stats**: Check database usage
3. **Logs**: View real-time application logs
4. **Email Logs**: Check SMTP delivery status

---

## 🎉 Congratulations!

Your freelance web application is now live on the internet! 

Share your URL: `https://freelance-frontend.onrender.com`

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Render logs
3. Verify all environment variables
4. Test database connection
5. Check email configuration

---

## 🔄 Future Updates

To update your deployed application:

```bash
# Make your changes
git add .
git commit -m "Your update message"
git push

# Render will automatically deploy changes!
```

---

**Need Help?** 
- Render Documentation: https://render.com/docs
- Flask Documentation: https://flask.palletsprojects.com/
- React Documentation: https://react.dev/

---

*Deployment Guide Version 1.0*
*Last Updated: December 5, 2025*
