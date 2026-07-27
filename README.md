# STTMTC Student Portal System
**St Theresa Medical Training College — Kiirua, Kenya**  
Built by Infranova Systems

---

## 📁 Project Structure

```
portal/
├── frontend/
│   ├── login.html              ← Login page (Student & Lecturer)
│   ├── dashboard-student.html  ← Full student dashboard (all views)
│   ├── dashboard-lecturer.html ← Full lecturer dashboard (all views)
│   ├── portal.css              ← Shared dashboard styles
│   └── portal.js               ← Shared data layer & utilities
│
├── backend/
│   └── server.js               ← Node.js/Express REST API skeleton
│
├── database/
│   ├── schema.sql              ← Full MySQL/PostgreSQL schema
│   └── seed.sql                ← Sample data for testing
│
└── README.md                   ← This file
```

---

## 🚀 Quick Start (Demo — No Backend Needed)

Just open `frontend/login.html` in any browser.

**Demo Credentials:**

| Role     | Username          | Password |
|----------|-------------------|----------|
| Student  | ST/NUR/2026/001   | demo123  |
| Student  | ST/LAB/2026/001   | demo123  |
| Lecturer | LEC/NUR/001       | demo123  |
| Lecturer | LEC/LAB/001       | demo123  |

---

## 🎓 Student Features

| Feature                | Status       |
|------------------------|-------------|
| Dashboard with stats   | ✅ Complete  |
| Enrolled units view    | ✅ Complete  |
| Lecture notes download | ✅ Complete  |
| Online CAT/Assignment  | ✅ Complete  |
| MCQ + Essay + Short    | ✅ Complete  |
| Timed exam with timer  | ✅ Complete  |
| Physical submission    | ✅ Complete  |
| Results & GPA          | ✅ Complete  |
| M-Pesa payment         | ✅ Complete  |
| Bank payment           | ✅ Complete  |
| Fee statement PDF      | ✅ Complete  |
| Document requests      | ✅ Complete  |
| Lecturer evaluation    | ✅ Complete  |
| Notifications          | ✅ Complete  |

## 👨‍🏫 Lecturer Features

| Feature                   | Status       |
|---------------------------|-------------|
| Dashboard with stats      | ✅ Complete  |
| Assigned units view       | ✅ Complete  |
| Class lists + attendance  | ✅ Complete  |
| Upload lecture materials  | ✅ Complete  |
| Create assignments/CATs   | ✅ Complete  |
| Question builder (MCQ etc)| ✅ Complete  |
| Grade submissions         | ✅ Complete  |
| Enter & publish results   | ✅ Complete  |
| Performance analytics     | ✅ Complete  |
| Export class lists        | ✅ Complete  |
| Notifications             | ✅ Complete  |

---

## ⚙️ Full Backend Setup

### Prerequisites
- Node.js v18+
- MySQL 8.0+ or PostgreSQL 14+
- npm

### 1. Create Database

```sql
-- MySQL
CREATE DATABASE sttmtc_portal;
USE sttmtc_portal;
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

### 2. Install Backend Dependencies

```bash
cd backend
npm init -y
npm install express bcryptjs jsonwebtoken mysql2 cors helmet morgan
npm install express-rate-limit multer dotenv
```

### 3. Environment Variables

Create `backend/.env`:
```env
PORT=3001
JWT_SECRET=your_super_secret_key_here_change_this

DB_HOST=localhost
DB_PORT=3306
DB_NAME=sttmtc_portal
DB_USER=root
DB_PASS=your_db_password

CLIENT_URL=http://localhost:3000

# M-Pesa Daraja API
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/mpesa/callback
MPESA_ENV=sandbox

# SMS Integration
SMS_BASE_URL=https://your-sms-system.co.ke/api
SMS_API_KEY=your_sms_api_key

# Email (SendGrid / Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@sttheresamedcollege.co.ke
SMTP_PASS=your_email_password
```

### 4. Run the API

```bash
cd backend
node server.js
# API running on http://localhost:3001
```

### 5. Connect Frontend to Backend

In `portal.js`, replace the demo auth logic with real API calls:

```javascript
// Replace the demo login in login.html with:
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const data = await response.json();
if (data.token) {
  sessionStorage.setItem('portal_token', data.token);
  sessionStorage.setItem('portal_user', JSON.stringify(data.user));
  window.location.href = data.user.role === 'student'
    ? 'dashboard-student.html' : 'dashboard-lecturer.html';
}
```

---

## 💳 M-Pesa Integration

The backend includes a full STK Push skeleton in `server.js`.

```javascript
// POST /api/student/fees/mpesa
// 1. Get OAuth token from Safaricom
// 2. Initiate STK Push
// 3. Wait for callback at /api/payments/mpesa/callback
// 4. Update fee_accounts table
// 5. Send notification to student
```

Test on Daraja Sandbox: https://developer.safaricom.co.ke

---

## 🔗 SMS System Integration

The portal syncs with your external School Management System via:

```
POST /api/sync/students    ← Pull student records
POST /api/sync/units       ← Pull unit registrations
POST /api/sync/payments    ← Pull fee payments
POST /api/sync/results     ← Push results back to SMS
```

Configure `SMS_BASE_URL` and `SMS_API_KEY` in `.env`.

---

## 📱 Responsive Breakpoints

- Desktop: Full sidebar + content
- Tablet (≤768px): Collapsible hamburger sidebar
- Mobile (≤480px): Single column, full-width cards

---

## 🎨 Design System

- **Fonts:** Sora (UI) + Lora (display/numbers)
- **Primary:** `#0B4F8A` (STTMTC Brand Blue)
- **Secondary:** `#2F7DD1`
- **Accent:** `#3A86FF`
- **Dark Mode:** Auto via `prefers-color-scheme: dark`
- **Print:** Optimized for fee statements & transcripts

---

## 🔒 Security Notes

- Hash all passwords with `bcrypt` (rounds ≥ 12)
- Use `JWT` with short expiry (1h) + refresh tokens
- Rate limit login endpoint (5 attempts / 15min)
- Validate all inputs server-side
- Use HTTPS in production
- Add CORS whitelist for your domain

---

## 📞 Support

**ICT Department — STTMTC**  
📧 ict@sttheresamedcollege.co.ke  
📞 +254 700 626 189  

**Developer: Infranova Systems**
