/* ============================================================
   Email Schema / Model Definition (SQLite Reference Schema)
   ============================================================ */

export const EmailModelSchema = `
  CREATE TABLE IF NOT EXISTS emails (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    sender            TEXT    NOT NULL,
    subject           TEXT    DEFAULT '',
    body              TEXT    DEFAULT '',
    classification    TEXT    CHECK(classification IN ('SPAM', 'HAM')),
    spam_probability  REAL    DEFAULT 0,
    ham_probability   REAL    DEFAULT 0,
    explanation       TEXT    DEFAULT '[]',
    received_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    message_id        TEXT    UNIQUE
  );
`;
