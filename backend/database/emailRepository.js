/* ============================================================
   Email Repository — CRUD operations for the emails table
   ============================================================ */

import { getDatabase } from "./init.js";

/**
 * Insert a processed email into the database.
 * Skips silently if message_id already exists (UNIQUE constraint).
 */
export function insertEmail({
  sender,
  subject,
  body,
  classification,
  spamProbability,
  hamProbability,
  explanation,
  receivedAt,
  messageId,
}) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO emails
      (sender, subject, body, classification, spam_probability,
       ham_probability, explanation, received_at, message_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    sender,
    subject || "(No Subject)",
    body || "",
    classification,
    spamProbability,
    hamProbability,
    JSON.stringify(explanation || []),
    receivedAt || new Date().toISOString(),
    messageId || null
  );

  return result.changes > 0; // true if inserted, false if duplicate
}

/**
 * Retrieve paginated list of emails (newest first).
 * Returns { emails, total, page, totalPages }.
 */
export function getAllEmails(page = 1, limit = 20) {
  const db = getDatabase();
  const offset = (page - 1) * limit;

  const emails = db
    .prepare(
      `SELECT id, sender, subject, classification, spam_probability,
              ham_probability, received_at
       FROM emails
       ORDER BY received_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(limit, offset);

  const { total } = db
    .prepare("SELECT COUNT(*) as total FROM emails")
    .get();

  return {
    emails,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single email by ID (includes full body and explanation).
 */
export function getEmailById(id) {
  const db = getDatabase();
  const email = db
    .prepare("SELECT * FROM emails WHERE id = ?")
    .get(id);

  if (email && email.explanation) {
    try {
      email.explanation = JSON.parse(email.explanation);
    } catch {
      email.explanation = [];
    }
  }

  return email || null;
}

/**
 * Get aggregate stats: total, spam count, ham count.
 */
export function getStats() {
  const db = getDatabase();
  const stats = db
    .prepare(
      `SELECT
         COUNT(*) as total,
         SUM(CASE WHEN classification = 'SPAM' THEN 1 ELSE 0 END) as spam,
         SUM(CASE WHEN classification = 'HAM'  THEN 1 ELSE 0 END) as ham
       FROM emails`
    )
    .get();

  return {
    total: stats.total || 0,
    spam: stats.spam || 0,
    ham: stats.ham || 0,
  };
}

/**
 * Check if an email with the given message_id already exists.
 */
export function emailExists(messageId) {
  if (!messageId) return false;
  const db = getDatabase();
  const row = db
    .prepare("SELECT 1 FROM emails WHERE message_id = ?")
    .get(messageId);
  return !!row;
}
