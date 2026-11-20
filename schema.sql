CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS finished_books (
  student_id TEXT NOT NULL REFERENCES students(id),
  book_id TEXT NOT NULL,
  PRIMARY KEY (student_id, book_id)
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id),
  book_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  correct INTEGER NOT NULL,
  total INTEGER NOT NULL,
  completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS quiz_results_student ON quiz_results(student_id);

CREATE TABLE IF NOT EXISTS admin_password (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  salt TEXT NOT NULL,
  hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_attempts (
  ip TEXT PRIMARY KEY,
  minute INTEGER NOT NULL,
  attempts INTEGER NOT NULL
);
