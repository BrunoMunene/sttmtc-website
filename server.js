// ============================================================
// STTMTC Student Portal — Backend API (Node.js / Express)
// ============================================================
// Install: npm install express bcryptjs jsonwebtoken mysql2
//          multer cors dotenv express-rate-limit helmet morgan
// Run:     node server.js
// ============================================================

const express    = require('express');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ── Middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('combined'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// ── JWT Auth Middleware ───────────────────────────────────────
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { return res.status(401).json({ error: 'Invalid token' }); }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };
}

// ============================================================
// API ENDPOINTS
// ============================================================

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Returns: { token, user: { id, username, role, name } }
 */
app.post('/api/auth/login', async (req, res) => {
  /* DB: SELECT users JOIN students/lecturers WHERE username = ?
     Verify password, generate JWT, log audit */
  res.json({ message: 'Login endpoint — see full implementation below' });
});

/**
 * POST /api/auth/logout
 * Invalidates session / blacklists token
 */
app.post('/api/auth/logout', auth, (req, res) => {
  res.json({ message: 'Logged out' });
});

// ── STUDENT ENDPOINTS ────────────────────────────────────────

/** GET /api/student/profile — own profile */
app.get('/api/student/profile', auth, requireRole('student'), (req, res) => {
  /* DB: SELECT students WHERE user_id = req.user.id */
});

/** GET /api/student/units — enrolled units this semester */
app.get('/api/student/units', auth, requireRole('student'), (req, res) => {
  /* DB: SELECT units JOIN enrollments JOIN lecturer_units JOIN lecturers
         WHERE student_id = ? AND academic_year = current AND semester = current */
});

/** POST /api/student/units/register — register for unit */
app.post('/api/student/units/register', auth, requireRole('student'), (req, res) => {
  /* Body: { unit_id } — insert into enrollments, sync to SMS */
});

/** GET /api/student/results — all results */
app.get('/api/student/results', auth, requireRole('student'), (req, res) => {
  /* DB: SELECT results WHERE student_id = ? AND published = TRUE */
});

/** GET /api/student/fees — fee account summary */
app.get('/api/student/fees', auth, requireRole('student'), (req, res) => {
  /* DB: SELECT fee_accounts WHERE student_id = ? */
});

/** GET /api/student/fees/statement — fee statement (JSON → PDF on frontend) */
app.get('/api/student/fees/statement', auth, requireRole('student'), (req, res) => {
  /* DB: SELECT payments WHERE student_id = ? ORDER BY created_at DESC */
});

/** POST /api/student/fees/mpesa — initiate M-Pesa STK Push */
app.post('/api/student/fees/mpesa', auth, requireRole('student'), async (req, res) => {
  /* Body: { amount, phone }
     1. Call Safaricom Daraja API STK Push
     2. Store pending payment record
     3. Return CheckoutRequestID */
  const { amount, phone } = req.body;
  // --- Daraja STK Push integration skeleton ---
  // const token = await getMpesaToken();
  // const response = await stkPush({ token, amount, phone, accountRef: req.user.admissionNo });
  res.json({ checkoutRequestId: 'SIMULATED', message: 'STK Push sent to ' + phone });
});

/** GET /api/student/assignments — assignments for enrolled units */
app.get('/api/student/assignments', auth, requireRole('student'), (req, res) => {
  /* DB: SELECT assignments JOIN enrollments WHERE student_id = ? AND status='published' */
});

/** GET /api/student/assignments/:id — single assignment + questions */
app.get('/api/student/assignments/:id', auth, requireRole('student'), (req, res) => {
  /* DB: SELECT assignments + questions WHERE id = ? */
});

/** POST /api/student/assignments/:id/submit — submit assignment */
app.post('/api/student/assignments/:id/submit', auth, requireRole('student'), (req, res) => {
  /* Body: { text_response?, answers_json?, file? }
     Check: not past due (unless allow_late), no duplicate submission */
});

/** GET /api/student/submissions — own submissions */
app.get('/api/student/submissions', auth, requireRole('student'), (req, res) => {});

/** GET /api/student/materials — lecture notes for enrolled units */
app.get('/api/student/materials', auth, requireRole('student'), (req, res) => {
  /* DB: SELECT materials JOIN enrollments WHERE student_id = ? */
});

/** POST /api/student/evaluate — submit lecturer evaluation */
app.post('/api/student/evaluate', auth, requireRole('student'), (req, res) => {
  /* Body: { lecturer_id, unit_id, ratings, comments } */
});

/** POST /api/student/documents/request — request document */
app.post('/api/student/documents/request', auth, requireRole('student'), (req, res) => {
  /* Body: { doc_type, reason } */
});

/** GET /api/student/notifications — own notifications */
app.get('/api/student/notifications', auth, requireRole('student'), (req, res) => {});

/** PATCH /api/student/notifications/:id/read */
app.patch('/api/student/notifications/:id/read', auth, requireRole('student'), (req, res) => {});

// ── LECTURER ENDPOINTS ───────────────────────────────────────

/** GET /api/lecturer/units — assigned units */
app.get('/api/lecturer/units', auth, requireRole('lecturer'), (req, res) => {});

/** GET /api/lecturer/units/:id/students — class list */
app.get('/api/lecturer/units/:id/students', auth, requireRole('lecturer'), (req, res) => {});

/** POST /api/lecturer/materials — upload lecture note */
app.post('/api/lecturer/materials', auth, requireRole('lecturer'), (req, res) => {
  /* Multipart: { unit_id, title, description, week_number, file } */
});

/** DELETE /api/lecturer/materials/:id */
app.delete('/api/lecturer/materials/:id', auth, requireRole('lecturer'), (req, res) => {});

/** POST /api/lecturer/assignments — create assignment/CAT */
app.post('/api/lecturer/assignments', auth, requireRole('lecturer'), (req, res) => {
  /* Body: { unit_id, title, type, total_marks, is_timed, duration_mins, due_at, questions[] } */
});

/** PATCH /api/lecturer/assignments/:id — update/publish assignment */
app.patch('/api/lecturer/assignments/:id', auth, requireRole('lecturer'), (req, res) => {});

/** GET /api/lecturer/assignments/:id/submissions — all submissions */
app.get('/api/lecturer/assignments/:id/submissions', auth, requireRole('lecturer'), (req, res) => {});

/** POST /api/lecturer/submissions/:id/grade — grade submission */
app.post('/api/lecturer/submissions/:id/grade', auth, requireRole('lecturer'), (req, res) => {
  /* Body: { score_obtained, feedback } */
});

/** GET /api/lecturer/results/:unit_id — results for unit */
app.get('/api/lecturer/results/:unit_id', auth, requireRole('lecturer'), (req, res) => {});

/** POST /api/lecturer/results — save/update results */
app.post('/api/lecturer/results', auth, requireRole('lecturer'), (req, res) => {
  /* Body: { unit_id, results: [{ student_id, cat1, cat2, assignment, exam }] } */
});

/** POST /api/lecturer/results/publish/:unit_id — publish results */
app.post('/api/lecturer/results/publish/:unit_id', auth, requireRole('lecturer'), (req, res) => {
  /* Mark published=TRUE, trigger notifications to all enrolled students */
});

// ── SMS SYNC ENDPOINTS ───────────────────────────────────────

/** POST /api/sync/students — pull students from SMS */
app.post('/api/sync/students', auth, requireRole('admin'), async (req, res) => {
  /* 1. GET {SMS_BASE_URL}/api/students with SMS API key
     2. Upsert into students table
     3. Log to sms_sync_log */
});

/** POST /api/sync/units */
app.post('/api/sync/units', auth, requireRole('admin'), (req, res) => {});

/** POST /api/sync/payments — pull fee payment records from SMS */
app.post('/api/sync/payments', auth, requireRole('admin'), (req, res) => {});

/** POST /api/sync/results — push results back to SMS */
app.post('/api/sync/results', auth, requireRole('admin'), (req, res) => {});

// ── M-PESA CALLBACK ──────────────────────────────────────────

/** POST /api/payments/mpesa/callback — Safaricom IPN */
app.post('/api/payments/mpesa/callback', (req, res) => {
  /* 1. Validate callback from Safaricom
     2. Extract ResultCode, CheckoutRequestID, Amount, PhoneNumber
     3. If ResultCode == 0 → update payment status, update fee_account, notify student
     4. Log transaction */
  const { Body } = req.body;
  const { ResultCode } = Body.stkCallback;
  if (ResultCode === 0) {
    // Payment successful — update DB
  }
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

// ── HEALTH CHECK ─────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Portal API running on port ${PORT}`));

module.exports = app;
