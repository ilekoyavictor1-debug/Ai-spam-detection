import { Router } from "express";
import {
  getAllEmails,
  getEmailById,
  getStats,
  insertEmail,
} from "../database/emailRepository.js";
import { analyzeEmail } from "../services/spamDetectionService.js";
import { getReceiverStatus } from "../services/emailService.js";

const router = Router();

/**
 * GET /api/emails
 * Returns all processed emails (paginated/newest first).
 */
router.get("/", (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const data = getAllEmails(page, limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/emails/stats
 * Aggregate counts: total, spam, ham.
 */
router.get("/stats", (req, res) => {
  try {
    const stats = getStats();
    const receiverStatus = getReceiverStatus();
    res.json({ ...stats, receiver: receiverStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/emails/:id
 * Returns a single email by ID.
 */
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const email = getEmailById(id);
    if (!email) {
      return res.status(404).json({ error: "Email not found" });
    }
    res.json(email);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/emails/analyze
 * Manual text analysis endpoint.
 */
router.post("/analyze", (req, res) => {
  try {
    const { text, save = false, sender = "Manual Analysis" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    const analysis = analyzeEmail(text);

    if (save) {
      insertEmail({
        sender,
        subject: text.slice(0, 40) + "...",
        body: text,
        classification: analysis.classification,
        spamProbability: analysis.spamProbability,
        hamProbability: analysis.hamProbability,
        explanation: analysis.explanation,
        receivedAt: new Date().toISOString(),
        messageId: `manual-${Date.now()}-${Math.random()}`,
      });
    }

    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
