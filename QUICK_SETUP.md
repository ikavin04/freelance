# Quick Deployment Notes

## ✅ Contact form
The contact form uses **FormSubmit.co** to deliver submissions to **vkavin2006@gmail.com** (no backend).

Important: FormSubmit sends a **one-time activation email** the first time you submit from a new origin (e.g. `localhost` or your GitHub Pages site). Click **Activate Form** once.

## 🧪 Test locally
1. Run `npm run dev` inside `frontend/`
2. Open the Contact page and submit a test
3. Confirm you received the email in `vkavin2006@gmail.com`

## 🌐 GitHub Pages
This project uses **HashRouter** for GitHub Pages compatibility.
Your Contact page URL will look like `/#/contact`.
