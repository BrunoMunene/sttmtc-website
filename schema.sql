-- ============================================================
-- STTMTC Student Portal — Database Schema
-- Engine: MySQL 8.0+ / PostgreSQL 14+
-- ============================================================

-- Users (auth table)
CREATE TABLE users (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  UNIQUE NOT NULL,
  email         VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('student','lecturer','admin') NOT NULL DEFAULT 'student',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_login    DATETIME,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students
CREATE TABLE students (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admission_no    VARCHAR(30) UNIQUE NOT NULL,
  first_name      VARCHAR(80) NOT NULL,
  last_name       VARCHAR(80) NOT NULL,
  phone           VARCHAR(20),
  program         VARCHAR(100) NOT NULL,
  year_of_study   TINYINT UNSIGNED NOT NULL DEFAULT 1,
  semester        TINYINT UNSIGNED NOT NULL DEFAULT 1,
  intake_year     YEAR NOT NULL,
  national_id     VARCHAR(20),
  photo_url       VARCHAR(255),
  sms_student_id  VARCHAR(50),   -- external SMS ID for sync
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Lecturers
CREATE TABLE lecturers (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  staff_no        VARCHAR(30) UNIQUE NOT NULL,
  first_name      VARCHAR(80) NOT NULL,
  last_name       VARCHAR(80) NOT NULL,
  phone           VARCHAR(20),
  department      VARCHAR(100),
  qualification   VARCHAR(100),
  photo_url       VARCHAR(255),
  sms_staff_id    VARCHAR(50),
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Academic Units (Subjects/Courses)
CREATE TABLE units (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(20) UNIQUE NOT NULL,
  name        VARCHAR(120) NOT NULL,
  description TEXT,
  credits     TINYINT UNSIGNED NOT NULL DEFAULT 3,
  program     VARCHAR(100),
  year_of_study TINYINT UNSIGNED,
  semester    TINYINT UNSIGNED,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sms_unit_id VARCHAR(50),
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Lecturer–Unit Assignments (who teaches what)
CREATE TABLE lecturer_units (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lecturer_id BIGINT UNSIGNED NOT NULL REFERENCES lecturers(id),
  unit_id     BIGINT UNSIGNED NOT NULL REFERENCES units(id),
  academic_year VARCHAR(10) NOT NULL,
  semester    TINYINT UNSIGNED NOT NULL,
  UNIQUE KEY uq_lec_unit_sem (lecturer_id, unit_id, academic_year, semester)
);

-- Student Unit Enrollments
CREATE TABLE enrollments (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id  BIGINT UNSIGNED NOT NULL REFERENCES students(id),
  unit_id     BIGINT UNSIGNED NOT NULL REFERENCES units(id),
  academic_year VARCHAR(10) NOT NULL,
  semester    TINYINT UNSIGNED NOT NULL,
  status      ENUM('registered','dropped','completed') NOT NULL DEFAULT 'registered',
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_enroll (student_id, unit_id, academic_year, semester)
);

-- Results (CATs, Assignments, Exams, Final)
CREATE TABLE results (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id      BIGINT UNSIGNED NOT NULL REFERENCES students(id),
  unit_id         BIGINT UNSIGNED NOT NULL REFERENCES units(id),
  academic_year   VARCHAR(10) NOT NULL,
  semester        TINYINT UNSIGNED NOT NULL,
  cat1_score      DECIMAL(5,2),
  cat2_score      DECIMAL(5,2),
  assignment_score DECIMAL(5,2),
  exam_score      DECIMAL(5,2),
  total_score     DECIMAL(5,2),
  grade           VARCHAR(5),
  grade_points    DECIMAL(3,1),
  remarks         VARCHAR(50),
  published       BOOLEAN NOT NULL DEFAULT FALSE,
  published_at    DATETIME,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_result (student_id, unit_id, academic_year, semester)
);

-- Fee Structure
CREATE TABLE fee_structure (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  program     VARCHAR(100) NOT NULL,
  academic_year VARCHAR(10) NOT NULL,
  semester    TINYINT UNSIGNED NOT NULL,
  amount      DECIMAL(12,2) NOT NULL,
  description VARCHAR(120),
  UNIQUE KEY uq_fee (program, academic_year, semester)
);

-- Student Fee Accounts
CREATE TABLE fee_accounts (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id      BIGINT UNSIGNED NOT NULL UNIQUE REFERENCES students(id),
  total_charged   DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_paid      DECIMAL(12,2) NOT NULL DEFAULT 0,
  balance         DECIMAL(12,2) GENERATED ALWAYS AS (total_charged - total_paid) STORED,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Payments / Transactions
CREATE TABLE payments (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id      BIGINT UNSIGNED NOT NULL REFERENCES students(id),
  amount          DECIMAL(12,2) NOT NULL,
  method          ENUM('mpesa','bank','cash','waiver') NOT NULL,
  reference_no    VARCHAR(80) UNIQUE NOT NULL,
  mpesa_code      VARCHAR(20),
  phone_number    VARCHAR(20),
  bank_name       VARCHAR(80),
  academic_year   VARCHAR(10),
  semester        TINYINT UNSIGNED,
  status          ENUM('pending','confirmed','failed','reversed') NOT NULL DEFAULT 'pending',
  confirmed_at    DATETIME,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Lecture Notes / Materials
CREATE TABLE materials (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  unit_id     BIGINT UNSIGNED NOT NULL REFERENCES units(id),
  lecturer_id BIGINT UNSIGNED NOT NULL REFERENCES lecturers(id),
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  file_url    VARCHAR(255) NOT NULL,
  file_type   VARCHAR(20),
  file_size   INT UNSIGNED,
  week_number TINYINT UNSIGNED,
  is_visible  BOOLEAN NOT NULL DEFAULT TRUE,
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Assignments & CATs
CREATE TABLE assignments (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  unit_id         BIGINT UNSIGNED NOT NULL REFERENCES units(id),
  lecturer_id     BIGINT UNSIGNED NOT NULL REFERENCES lecturers(id),
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  type            ENUM('assignment','cat','exam','quiz') NOT NULL DEFAULT 'assignment',
  total_marks     DECIMAL(5,2) NOT NULL DEFAULT 100,
  is_timed        BOOLEAN NOT NULL DEFAULT FALSE,
  duration_mins   SMALLINT UNSIGNED,       -- NULL = open/untimed
  start_at        DATETIME,
  due_at          DATETIME NOT NULL,
  allow_late      BOOLEAN NOT NULL DEFAULT FALSE,
  instructions_url VARCHAR(255),
  academic_year   VARCHAR(10),
  semester        TINYINT UNSIGNED,
  status          ENUM('draft','published','closed','graded') NOT NULL DEFAULT 'draft',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Assignment Questions (for online CATs)
CREATE TABLE questions (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assignment_id   BIGINT UNSIGNED NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  question_text   TEXT NOT NULL,
  question_type   ENUM('mcq','short_answer','essay','file_upload') NOT NULL DEFAULT 'short_answer',
  marks           DECIMAL(5,2) NOT NULL DEFAULT 1,
  options_json    JSON,        -- for MCQ: [{label:"A",text:"...",correct:true}]
  order_no        SMALLINT UNSIGNED NOT NULL DEFAULT 1
);

-- Student Submissions
CREATE TABLE submissions (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assignment_id   BIGINT UNSIGNED NOT NULL REFERENCES assignments(id),
  student_id      BIGINT UNSIGNED NOT NULL REFERENCES students(id),
  submitted_at    DATETIME,
  file_url        VARCHAR(255),
  text_response   TEXT,
  answers_json    JSON,        -- for online CATs
  score_obtained  DECIMAL(5,2),
  feedback        TEXT,
  graded_at       DATETIME,
  graded_by       BIGINT UNSIGNED REFERENCES lecturers(id),
  status          ENUM('not_submitted','submitted','late','graded') NOT NULL DEFAULT 'not_submitted',
  is_physical     BOOLEAN NOT NULL DEFAULT FALSE,
  physical_status ENUM('pending','received','graded') DEFAULT 'pending',
  UNIQUE KEY uq_submission (assignment_id, student_id)
);

-- Lecturer Evaluations
CREATE TABLE evaluations (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id      BIGINT UNSIGNED NOT NULL REFERENCES students(id),
  lecturer_id     BIGINT UNSIGNED NOT NULL REFERENCES lecturers(id),
  unit_id         BIGINT UNSIGNED NOT NULL REFERENCES units(id),
  academic_year   VARCHAR(10) NOT NULL,
  semester        TINYINT UNSIGNED NOT NULL,
  rating_teaching  TINYINT UNSIGNED CHECK (rating_teaching BETWEEN 1 AND 5),
  rating_content   TINYINT UNSIGNED CHECK (rating_content BETWEEN 1 AND 5),
  rating_communication TINYINT UNSIGNED CHECK (rating_communication BETWEEN 1 AND 5),
  rating_punctuality   TINYINT UNSIGNED CHECK (rating_punctuality BETWEEN 1 AND 5),
  comments        TEXT,
  is_anonymous    BOOLEAN NOT NULL DEFAULT TRUE,
  submitted_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_eval (student_id, lecturer_id, unit_id, academic_year, semester)
);

-- Notifications
CREATE TABLE notifications (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL REFERENCES users(id),
  title       VARCHAR(200) NOT NULL,
  message     TEXT NOT NULL,
  type        ENUM('assignment','result','payment','general','system') NOT NULL DEFAULT 'general',
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  link_url    VARCHAR(255),
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Document Requests
CREATE TABLE document_requests (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id  BIGINT UNSIGNED NOT NULL REFERENCES students(id),
  doc_type    ENUM('transcript','fee_statement','clearance','recommendation') NOT NULL,
  reason      VARCHAR(200),
  status      ENUM('pending','processing','ready','collected') NOT NULL DEFAULT 'pending',
  notes       TEXT,
  requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ready_at    DATETIME
);

-- Audit Logs
CREATE TABLE audit_logs (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED REFERENCES users(id),
  action      VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id   BIGINT UNSIGNED,
  ip_address  VARCHAR(45),
  user_agent  VARCHAR(300),
  payload     JSON,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SMS Sync Log (for external SMS integration)
CREATE TABLE sms_sync_log (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sync_type   VARCHAR(50) NOT NULL,
  direction   ENUM('inbound','outbound') NOT NULL,
  status      ENUM('success','failed','partial') NOT NULL,
  records_synced INT NOT NULL DEFAULT 0,
  error_details TEXT,
  synced_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
