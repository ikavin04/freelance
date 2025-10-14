# Kavin Creative Hub - Full-Stack Freelance Portfolio

A professional, fully responsive full-stack website for a creative freelancer offering video editing, poster design, website creation, and app development services.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue)
![Tech Stack](https://img.shields.io/badge/Flask-3.0-green)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-15-blue)
![Tech Stack](https://img.shields.io/badge/TailwindCSS-3.3-cyan)

## ✨ Features

- 🔐 **Email Registration & OTP Verification** - Secure sign-up with email verification
- 🔑 **JWT Authentication** - Token-based authentication system
- 📝 **Project Application Form** - Validated form with minimum 3-day requirement
- 🎨 **Modern UI/UX** - Dark theme with glassmorphism and smooth animations
- 📱 **Fully Responsive** - Works seamlessly on all devices
- 🎭 **Framer Motion Animations** - Smooth, professional animations throughout
- 📊 **Application Tracking** - Users can view their submitted applications
- 💌 **Email Service** - Automated OTP emails with professional templates

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **React Confetti** - Success celebrations
- **React Icons** - Icon library

### Backend
- **Flask 3.0** - Python web framework
- **PostgreSQL** - Relational database
- **Flask-SQLAlchemy** - ORM
- **Flask-Mail** - Email service
- **Flask-Bcrypt** - Password hashing
- **Flask-JWT-Extended** - JWT authentication
- **Flask-CORS** - CORS handling

## 📁 Project Structure

```
freelance/
├── backend/
│   ├── routes/
│   │   ├── auth.py              # Authentication routes
│   │   └── applications.py      # Application routes
│   ├── app.py                   # Flask application
│   ├── config.py                # Configuration
│   ├── models.py                # Database models
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Apply.jsx
│   │   │   └── MyApplications.jsx
│   │   ├── services/
│   │   │   └── api.js           # API service & helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
└── database/
    ├── schema.sql               # Database schema
    └── README.md                # Database setup guide
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **PostgreSQL** (v13 or higher)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/ikavin04/freelance.git
cd freelance
```

### 2. Database Setup

#### Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql && brew services start postgresql`
- **Linux**: `sudo apt install postgresql postgresql-contrib`

#### Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE freelance_db;

# Exit
\q
```

#### Run Schema (Optional - Flask will auto-create tables)

```bash
psql -U postgres -d freelance_db -f database/schema.sql
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux

# Edit .env and add your credentials
```

#### Configure .env file

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/freelance_db
JWT_SECRET_KEY=your-super-secret-jwt-key
SECRET_KEY=your-super-secret-key
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
```

> **Important**: For Gmail, you need to generate an **App Password**:
> 1. Go to Google Account → Security
> 2. Enable 2-Step Verification
> 3. Generate App Password for "Mail"
> 4. Use that password in `.env`

#### Run Backend

```bash
python app.py
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux

# Edit .env if needed (default is fine for local dev)
```

#### Configure .env file

```env
VITE_API_URL=http://localhost:5000/api
```

#### Run Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🎯 Usage

### 1. Register a New Account
- Navigate to `/register`
- Fill in your details (name, email, password)
- Check your email for OTP
- Verify OTP to activate account

### 2. Login
- Navigate to `/login`
- Enter your email and password
- Get redirected to application page

### 3. Submit Application
- Fill out the project application form
- Select service type from dropdown
- Enter minimum 3 days for completion
- Submit and see success animation! 🎉

### 4. View Applications
- Navigate to `/my-applications`
- See all your submitted projects
- Track application status

## 📧 Email Configuration

The application uses **Gmail SMTP** for sending OTPs. To set this up:

1. **Enable 2-Step Verification** in your Google Account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/security
   - Select "2-Step Verification"
   - Scroll to "App passwords"
   - Select "Mail" and your device
   - Copy the generated 16-character password
3. **Add to `.env`**:
   ```env
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-char-app-password
   ```

## 🗄️ Database Schema

### Users Table
| Column    | Type         | Description        |
|-----------|--------------|--------------------|
| id        | SERIAL PK    | Primary key        |
| name      | VARCHAR(100) | User's name        |
| email     | VARCHAR(150) | Email (unique)     |
| password  | VARCHAR(255) | Hashed password    |
| verified  | BOOLEAN      | Email verified     |
| created_at| TIMESTAMP    | Registration date  |

### OTPs Table
| Column     | Type         | Description        |
|------------|--------------|--------------------|
| id         | SERIAL PK    | Primary key        |
| email      | VARCHAR(150) | Email address      |
| otp        | VARCHAR(6)   | 6-digit OTP        |
| created_at | TIMESTAMP    | OTP creation time  |

### Applications Table
| Column       | Type         | Description         |
|--------------|--------------|---------------------|
| id           | SERIAL PK    | Primary key         |
| client_name  | VARCHAR(100) | Client name         |
| city         | VARCHAR(100) | City                |
| service_type | VARCHAR(100) | Service requested   |
| days         | INTEGER      | Days to complete    |
| user_email   | VARCHAR(150) | User's email (FK)   |
| created_at   | TIMESTAMP    | Submission date     |

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Email verification required
- ✅ OTP expiration (5 minutes)
- ✅ Protected routes
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (SQLAlchemy ORM)

## 🎨 UI/UX Features

- ✨ Dark mode with purple-blue gradient theme
- 💎 Glassmorphism design
- 🎭 Smooth Framer Motion animations
- 📱 Fully responsive design
- 🎯 Intuitive navigation
- 🎊 Success celebrations with confetti
- 🔔 Toast notifications
- ✨ Hover effects and transitions
- 🎨 Custom scrollbar
- 💫 Loading states

## 🧪 Testing

### Test Registration Flow
1. Register with a real email address
2. Check inbox/spam for OTP email
3. Verify OTP within 5 minutes
4. Login with credentials

### Test Application Submission
1. Login to your account
2. Navigate to "Apply Now"
3. Fill form with valid data
4. Try submitting with < 3 days (should fail)
5. Submit with ≥ 3 days (should succeed)

### Test Protected Routes
1. Try accessing `/apply` without login (should redirect to login)
2. Login and access `/apply` (should work)

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Applications
- `POST /api/apply` - Submit application (protected)
- `GET /api/applications` - Get user's applications (protected)
- `GET /api/applications/all` - Get all applications (admin)

## 🚀 Deployment

### Backend (Render / Railway / Heroku)

1. Create account on deployment platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy backend

### Frontend (Vercel / Netlify)

1. Create account on deployment platform
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL`
6. Deploy frontend

### Database (Render / Railway / ElephantSQL)

1. Create PostgreSQL instance
2. Copy connection string
3. Update `DATABASE_URL` in backend environment

## 🔮 Future Enhancements

- [ ] Payment integration (Razorpay/Stripe)
- [ ] Admin dashboard with filtering
- [ ] File upload for project samples
- [ ] Real-time notifications
- [ ] Email notifications for application updates
- [ ] User profile page
- [ ] Application status tracking
- [ ] Review & rating system
- [ ] Portfolio showcase section
- [ ] Blog/testimonials section

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Kavin**
- GitHub: [@ikavin04](https://github.com/ikavin04)

## 🙏 Acknowledgments

- Built with ❤️ using React, Flask & PostgreSQL
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

---

**© 2025 Kavin Creative Hub. All rights reserved.**

*Built with ❤️ using React, Flask & PostgreSQL*
