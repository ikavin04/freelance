# 🏗️ Project Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                     http://localhost:3000                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │ (JWT Token in Headers)
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      REACT FRONTEND                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pages: Home, About, Services, Register, Login, Apply   │  │
│  │  Components: Navbar, Footer, ProtectedRoute             │  │
│  │  Services: API calls, Auth helpers                      │  │
│  │  Styling: Tailwind CSS + Framer Motion                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Axios HTTP Client
                         │ JSON data
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      FLASK BACKEND                              │
│                  http://localhost:5000/api                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes:                                                 │  │
│  │  ├─ auth.py (register, verify-otp, login)              │  │
│  │  └─ applications.py (apply, get applications)          │  │
│  │                                                          │  │
│  │  Middleware:                                             │  │
│  │  ├─ CORS (Cross-Origin Resource Sharing)               │  │
│  │  ├─ JWT Authentication                                  │  │
│  │  └─ Request Validation                                  │  │
│  │                                                          │  │
│  │  Services:                                               │  │
│  │  ├─ Flask-Mail (OTP emails)                            │  │
│  │  ├─ Flask-Bcrypt (password hashing)                    │  │
│  │  └─ Flask-SQLAlchemy (ORM)                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────┬───────────────────────────┘
             │                        │
             │ SQL Queries            │ SMTP
             │                        │
┌────────────▼─────────┐   ┌─────────▼──────────┐
│   POSTGRESQL DB      │   │   GMAIL SMTP       │
│   localhost:5432     │   │   smtp.gmail.com   │
│                      │   │                    │
│  Tables:             │   │  Sends:            │
│  ├─ users            │   │  └─ OTP emails     │
│  ├─ otps             │   │                    │
│  └─ applications     │   └────────────────────┘
└──────────────────────┘
```

## Data Flow Diagrams

### 1. User Registration Flow

```
┌──────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│ User │         │ Frontend │         │ Backend │         │ Database │
└──┬───┘         └────┬─────┘         └────┬────┘         └────┬─────┘
   │                  │                    │                   │
   │ 1. Fill form     │                    │                   │
   ├─────────────────>│                    │                   │
   │                  │                    │                   │
   │                  │ 2. POST /register  │                   │
   │                  ├───────────────────>│                   │
   │                  │                    │                   │
   │                  │                    │ 3. Hash password  │
   │                  │                    │ 4. Save user      │
   │                  │                    ├──────────────────>│
   │                  │                    │                   │
   │                  │                    │ 5. Generate OTP   │
   │                  │                    │ 6. Save OTP       │
   │                  │                    ├──────────────────>│
   │                  │                    │                   │
   │                  │                    │ 7. Send OTP email │
   │                  │                    ├──────────────────>Gmail
   │                  │                    │                   │
   │                  │ 8. Success response│                   │
   │                  │<───────────────────┤                   │
   │                  │                    │                   │
   │ 9. Show OTP modal│                   │                   │
   │<─────────────────┤                    │                   │
   │                  │                    │                   │
   │ 10. Check email  │                    │                   │
   │<────────────────────────────────Gmail │                   │
   │                  │                    │                   │
   │ 11. Enter OTP    │                    │                   │
   ├─────────────────>│                    │                   │
   │                  │                    │                   │
   │                  │ 12. POST /verify   │                   │
   │                  ├───────────────────>│                   │
   │                  │                    │                   │
   │                  │                    │ 13. Verify OTP    │
   │                  │                    │ 14. Mark verified │
   │                  │                    ├──────────────────>│
   │                  │                    │                   │
   │                  │ 15. Success        │                   │
   │                  │<───────────────────┤                   │
   │                  │                    │                   │
   │ 16. Redirect     │                    │                   │
   │    to login      │                    │                   │
   │<─────────────────┤                    │                   │
```

### 2. Login & Apply Flow

```
┌──────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│ User │         │ Frontend │         │ Backend │         │ Database │
└──┬───┘         └────┬─────┘         └────┬────┘         └────┬─────┘
   │                  │                    │                   │
   │ 1. Login         │                    │                   │
   ├─────────────────>│                    │                   │
   │                  │                    │                   │
   │                  │ 2. POST /login     │                   │
   │                  ├───────────────────>│                   │
   │                  │                    │                   │
   │                  │                    │ 3. Verify creds   │
   │                  │                    ├──────────────────>│
   │                  │                    │                   │
   │                  │                    │ 4. Generate JWT   │
   │                  │ 5. Return token    │                   │
   │                  │<───────────────────┤                   │
   │                  │                    │                   │
   │                  │ 6. Store token     │                   │
   │ 7. Redirect      │    in localStorage │                   │
   │    to /apply     │                    │                   │
   │<─────────────────┤                    │                   │
   │                  │                    │                   │
   │ 8. Fill form     │                    │                   │
   ├─────────────────>│                    │                   │
   │                  │                    │                   │
   │                  │ 9. POST /apply     │                   │
   │                  │    (with JWT)      │                   │
   │                  ├───────────────────>│                   │
   │                  │                    │                   │
   │                  │                    │ 10. Verify JWT    │
   │                  │                    │ 11. Validate days │
   │                  │                    │ 12. Save app      │
   │                  │                    ├──────────────────>│
   │                  │                    │                   │
   │                  │ 13. Success        │                   │
   │                  │<───────────────────┤                   │
   │                  │                    │                   │
   │ 14. Show confetti│                   │                   │
   │     & redirect   │                    │                   │
   │<─────────────────┤                    │                   │
```

## Component Hierarchy

```
App
├── Navbar (always visible)
├── Routes
│   ├── Home
│   │   ├── Hero Section
│   │   ├── Services Preview
│   │   └── CTA Section
│   ├── About
│   │   ├── Profile Card
│   │   ├── Skills Grid
│   │   ├── Mission Statement
│   │   └── Values
│   ├── Services
│   │   ├── Service Cards (4)
│   │   ├── Process Steps
│   │   └── CTA
│   ├── Register
│   │   ├── Registration Form
│   │   └── OTP Modal
│   ├── Login
│   │   └── Login Form
│   ├── Apply (Protected)
│   │   ├── Application Form
│   │   └── Confetti Animation
│   └── MyApplications (Protected)
│       ├── Stats Dashboard
│       └── Application Cards
└── Footer (always visible)
```

## Database Relationships

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │──┐
│ password        │  │
│ verified        │  │
│ created_at      │  │
└─────────────────┘  │
                     │
                     │ Foreign Key
                     │
                     │
┌────────────────────┼─────────┐
│    applications    │         │
├────────────────────┼─────────┤
│ id (PK)            │         │
│ client_name        │         │
│ city               │         │
│ service_type       │         │
│ days               │         │
│ user_email (FK) ───┘         │
│ created_at                   │
└──────────────────────────────┘

┌─────────────────┐
│      otps       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ otp             │
│ created_at      │
└─────────────────┘
(No FK - temporary data, auto-deleted)
```

## Authentication Flow

```
┌────────────────────────────────────────┐
│     User Registration (First Time)     │
└──────────────┬─────────────────────────┘
               │
               ▼
      ┌────────────────┐
      │  Enter Details │
      │  (name, email, │
      │   password)    │
      └───────┬────────┘
              │
              ▼
      ┌────────────────┐
      │  Send Email    │
      │  with OTP      │
      └───────┬────────┘
              │
              ▼
      ┌────────────────┐     ┌──────────┐
      │  Verify OTP    │────>│ Account  │
      │  (5 min expiry)│     │ Verified │
      └────────────────┘     └──────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│            User Login                    │
└──────────────┬──────────────────────────┘
               │
               ▼
      ┌────────────────┐
      │  Email + Pass  │
      └───────┬────────┘
              │
              ▼
      ┌────────────────┐
      │  JWT Token     │
      │  Generated     │
      └───────┬────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│        Protected Routes Access          │
└──────────────┬──────────────────────────┘
               │
               ▼
      ┌────────────────┐
      │  Token in      │
      │  localStorage  │
      └───────┬────────┘
              │
              ▼
      ┌────────────────┐
      │  Send with     │
      │  Each Request  │
      └───────┬────────┘
              │
              ▼
      ┌────────────────┐
      │  Backend       │
      │  Verifies      │
      └───────┬────────┘
              │
              ▼
      ┌────────────────┐
      │  Access        │
      │  Granted       │
      └────────────────┘
```

## Technology Stack Overview

```
┌──────────────────────────────────────────────────────┐
│                    FRONTEND                          │
├──────────────────────────────────────────────────────┤
│  React 18.2        │  Component-based UI library     │
│  Vite 5.0          │  Fast build tool                │
│  Tailwind CSS 3.3  │  Utility-first CSS              │
│  Framer Motion 10  │  Animation library              │
│  React Router 6    │  Client-side routing            │
│  Axios 1.6         │  HTTP client                    │
│  React Toastify    │  Toast notifications            │
│  React Confetti    │  Success celebrations           │
│  React Icons       │  Icon library                   │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                    BACKEND                           │
├──────────────────────────────────────────────────────┤
│  Flask 3.0         │  Python web framework           │
│  PostgreSQL        │  Relational database            │
│  SQLAlchemy        │  ORM (Object-Relational Map)    │
│  Flask-Mail        │  Email service                  │
│  Flask-Bcrypt      │  Password hashing               │
│  Flask-JWT-Ext     │  JWT authentication             │
│  Flask-CORS        │  Cross-origin requests          │
│  Python-dotenv     │  Environment variables          │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                    TOOLING                           │
├──────────────────────────────────────────────────────┤
│  Git               │  Version control                │
│  npm               │  Package manager (frontend)     │
│  pip               │  Package manager (backend)      │
│  psql              │  PostgreSQL CLI                 │
│  PowerShell        │  Automation scripts             │
└──────────────────────────────────────────────────────┘
```

---

**This architecture provides:**
- ✅ Separation of concerns (frontend/backend)
- ✅ Scalable structure
- ✅ Secure authentication
- ✅ Modern tech stack
- ✅ Easy to maintain and extend

