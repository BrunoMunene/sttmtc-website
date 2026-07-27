# STTMTC — Complete Project File Structure
**St Theresa Medical Training College, Kiirua**
Developed by Infranova Systems

---

## Full Directory Tree

```
sttmtc/                                    ← Project root
│
├── .gitignore                             ← ✅ Provided below
├── README.md
│
├── ── WEBSITE (static, deployed to Vercel) ───────────────────
│
├── index.html                             ← Homepage
├── about.html                             ← About the college
├── courses.html                           ← KRCHN programme only
├── faculty.html                           ← Nursing faculty only
├── admissions.html                        ← Application form
├── facilities.html                        ← Campus facilities
├── gallery.html                           ← Photo gallery
├── news.html                              ← News & events
├── contact.html                           ← Contact + FAQ
├── 404.html                               ← Custom error page
│
└── assets/
    ├── css/
    │   └── styles.css                     ← 1,486-line main stylesheet
    ├── js/
    │   └── main.js                        ← Nav, scroll reveal, counters, lightbox
    └── img/                               ← All website images
        ├── logo.png                       ← ⚠️ Used in header + footer (add filter for footer)
        ├── admn1.jpg, admn2.jpg           ← Hero backgrounds
        ├── or1.jpeg                       ← Admissions hero
        ├── stdt1.jpg, stdt2.jpg           ← Student photos
        ├── hos1.jpg                       ← Hospital building
        ├── hostel.jpeg                    ← Student hostel
        ├── labb1.jpeg                     ← Laboratory (ISO accredited)
        ├── lab2.jpg → lab6.jpg            ← Lab images
        ├── labexp.jpeg, labtraining.jpeg  ← Lab training
        ├── clinical-skills-lab.jpg        ← Skills lab
        ├── clinical-area.jpeg             ← Clinical ward
        ├── lib.jpeg, medical-library.jpeg ← Library
        ├── class1.jpeg, class2.jpeg       ← Classroom
        ├── campus-building.jpeg           ← Campus exterior
        ├── stdlife.jpeg                   ← Student life
        ├── students.jpeg                  ← Students group
        └── graduation.jpg                 ← Graduation ceremony
│
├── ── PORTAL (frontend, same Vercel deployment) ───────────────
│
├── login.html                             ← Login page (Student + Staff tabs)
├── student.html                           ← Student dashboard (all views)
├── lecturer.html                          ← Lecturer dashboard
├── dashboard-student.html                 ← (alternate/older student dashboard)
├── dashboard-lecturer.html                ← (alternate/older lecturer dashboard)
├── portal.html                            ← Legacy portal hub page
└── portal.css                             ← Shared dashboard stylesheet
│
├── ── PORTAL BACKEND (Node.js, separate deployment) ───────────
│
└── portal-backend/
    ├── .env.example                       ← ✅ COMMIT — shows required variables
    ├── .env                               ← 🚫 GITIGNORE — real secrets
    ├── package.json
    ├── package-lock.json
    │
    ├── src/
    │   ├── server.js                      ← Express entry point + all middleware
    │   │
    │   ├── controllers/
    │   │   └── authController.js          ← login, logout, refresh, changePassword, me
    │   │
    │   ├── middleware/
    │   │   ├── auth.js                    ← requireAuth, requireRole, requireSelf
    │   │   ├── rateLimiter.js             ← global / auth / sensitive limiters
    │   │   ├── validate.js                ← express-validator rules
    │   │   └── audit.js                   ← DB audit log writer
    │   │
    │   ├── routes/
    │   │   └── auth.js                    ← /login /refresh /logout /me routes
    │   │
    │   └── utils/
    │       ├── tokens.js                  ← JWT sign/verify + refresh token DB ops
    │       ├── logger.js                  ← Winston (console + rotating file logs)
    │       └── security_schema.sql        ← ALTER users + refresh_tokens table
    │
    ├── config/
    │   └── database.js                    ← MySQL2 connection pool
    │
    ├── logs/                              ← 🚫 GITIGNORE — runtime log files
    │   ├── error-YYYY-MM-DD.log
    │   └── combined-YYYY-MM-DD.log
    │
    ├── uploads/                           ← 🚫 GITIGNORE — multer file uploads
    │   └── .gitkeep                       ← ✅ COMMIT — keeps the folder in git
    │
    ├── node_modules/                      ← 🚫 GITIGNORE
    │
    └── tests/
        └── auth.test.js                   ← Jest + Supertest security tests
│
└── ── DATABASE ────────────────────────────────────────────────
    │
    └── database/
        ├── schema.sql                     ← 19-table MySQL schema
        ├── security_schema.sql            ← login_attempts, refresh_tokens, events
        └── seed.sql                       ← Sample data for local dev
```

---

## What Goes in `.gitignore` and Why

| Path | Reason |
|------|--------|
| `.env` | Contains JWT secrets, DB password, M-Pesa keys — leak = full compromise |
| `node_modules/` | 50–200 MB, regenerated with `npm install` |
| `logs/` | Runtime log files — large, noisy, no value in version history |
| `uploads/` | Student/staff uploaded files — may contain PII (ODPC-regulated) |
| `coverage/` | Jest coverage output — generated on test run |
| `.DS_Store`, `Thumbs.db` | OS junk files — different for every developer |
| `*.pem`, `*.key` | SSL certificates — security critical |
| `dist/`, `build/` | Future-proofing for any bundler step |

---

## Files That MUST Be Committed

| Path | Why |
|------|-----|
| `.env.example` | Shows teammates what variables to set — no real values |
| `database/schema.sql` | Needed to recreate the DB from scratch |
| `database/security_schema.sql` | Same — security additions |
| `portal-backend/src/utils/security_schema.sql` | Same |
| `uploads/.gitkeep` | Keeps the uploads directory in git so multer doesn't crash |
| `assets/img/*` | Website images — needed for the deployed site |
| `portal.css`, `styles.css` | Stylesheets — core to the application |

---

## Deployment Architecture

```
                    ┌─────────────────────────────────────┐
                    │           Vercel (static)            │
                    │  index.html, courses.html, ...       │
                    │  assets/css/styles.css               │
  User → HTTPS ──►  │  assets/js/main.js                  │
                    │  assets/img/...                      │
                    │  login.html, student.html             │
                    │  portal.css                          │
                    └──────────────┬──────────────────────┘
                                   │  fetch('/api/...')
                                   ▼
                    ┌─────────────────────────────────────┐
                    │     Node.js API (Railway / Render)   │
                    │     portal-backend/src/server.js     │
                    │                                      │
                    │  POST /api/auth/login                │
                    │  POST /api/auth/refresh              │
                    │  GET  /api/student/...               │
                    │  GET  /api/lecturer/...              │
                    └──────────────┬──────────────────────┘
                                   │  mysql2
                                   ▼
                    ┌─────────────────────────────────────┐
                    │     MySQL 8 (PlanetScale / local)    │
                    │  users, students, lecturers          │
                    │  units, enrollments, results         │
                    │  refresh_tokens, audit_logs          │
                    └─────────────────────────────────────┘
```

---

## Quick Commands

```bash
# Install backend dependencies
cd portal-backend && npm install

# Set up environment
cp .env.example .env
# Edit .env with real values

# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Run migrations
mysql -u root -p sttmtc_portal < database/schema.sql
mysql -u root -p sttmtc_portal < database/security_schema.sql

# Start dev server
npm run dev

# Run security tests
npm test
```
