/* ============================================================
   Database Initialization — SQLite via better-sqlite3
   Creates the database file and emails table on first run.
   ============================================================ */

import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "..", "data");
const DB_PATH = join(DATA_DIR, "emails.db");

let db;

/**
 * Initialize (or return existing) database connection.
 * Creates the data/ directory and emails table if they don't exist.
 */
export function getDatabase() {
  if (db) return db;

  // Ensure data directory exists
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent read performance
  db.pragma("journal_mode = WAL");

  // Create emails table
  db.exec(`
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
  `);

  // Index for fast lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_emails_received_at
    ON emails(received_at DESC);
  `);

  console.log("📦 Database initialized at", DB_PATH);
  return db;
}
