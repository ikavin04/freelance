# 🚀 Quick Start Deployment Checklist

## Before Deployment

- [ ] Test app locally (backend + frontend + database)
- [ ] Verify email sending works
- [ ] Check all features work correctly
- [ ] Admin account created and working

## Deploy Database (5 min)

- [ ] Sign up on Render.com
- [ ] Create PostgreSQL database
- [ ] Save Internal Database URL
- [ ] Save External Database URL

## Deploy Backend (10 min)

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Create Web Service on Render
- [ ] Set Root Directory: `backend`
- [ ] Add all environment variables
- [ ] Wait for deployment
- [ ] Test: Visit `https://your-backend.onrender.com/`

## Deploy Frontend (5 min)

- [ ] Update API URL in `frontend/src/services/api.js`
- [ ] Commit and push changes
- [ ] Create Static Site on Render
- [ ] Set Root Directory: `frontend`
- [ ] Add VITE_API_URL environment variable
- [ ] Wait for deployment
- [ ] Test: Visit `https://your-frontend.onrender.com/`

## Post-Deployment

- [ ] Update CORS settings in backend
- [ ] Create admin user via Render Shell
- [ ] Test registration with real email
- [ ] Test OTP verification
- [ ] Test login
- [ ] Test application submission
- [ ] Test file upload
- [ ] Test admin dashboard
- [ ] Test delivery system

## Optional

- [ ] Set up UptimeRobot to keep services awake
- [ ] Add custom domain
- [ ] Set up monitoring
- [ ] Configure SSL (automatic on Render)

## 🎉 Done!

Your app is live at:
- Frontend: `https://your-frontend.onrender.com`
- Backend: `https://your-backend.onrender.com`

Share your link with the world! 🌍
