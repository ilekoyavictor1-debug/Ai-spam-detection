/* ============================================================
   Email Service — IMAP Email Fetching & Polling
   ============================================================ */

import Imap from "imap";
import { simpleParser } from "mailparser";
import config from "../config.js";
import { analyzeEmail } from "./spamDetectionService.js";
import { insertEmail, emailExists } from "../database/emailRepository.js";

let imapConnection = null;
let pollTimer = null;
let isConnected = false;

function processMessage(msg) {
  return new Promise((resolve, reject) => {
    let rawData = "";

    msg.on("body", (stream) => {
      stream.on("data", (chunk) => {
        rawData += chunk.toString("utf8");
      });
    });

    msg.once("end", async () => {
      try {
        const parsed = await simpleParser(rawData);

        const messageId = parsed.messageId || `gen-${Date.now()}-${Math.random()}`;
        const sender = parsed.from?.text || "Unknown Sender";
        const subject = parsed.subject || "(No Subject)";
        const body = parsed.text || parsed.html || "";
        const receivedAt = parsed.date
          ? parsed.date.toISOString()
          : new Date().toISOString();

        if (emailExists(messageId)) {
          resolve(null);
          return;
        }

        console.log("⚡ Running Spam Detection...");
        const analysis = analyzeEmail(`${subject} ${body}`);

        const inserted = insertEmail({
          sender,
          subject,
          body,
          classification: analysis.classification,
          spamProbability: analysis.spamProbability,
          hamProbability: analysis.hamProbability,
          explanation: analysis.explanation,
          receivedAt,
          messageId,
        });

        if (inserted) {
          console.log(
            `✅ Processed & Stored: ${analysis.classification} (${analysis.spamProbability}%) — Subject: "${subject}"`
          );
        }

        resolve({ sender, subject, classification: analysis.classification });
      } catch (err) {
        console.error("❌ Error processing email message:", err.message);
        reject(err);
      }
    });
  });
}

function fetchNewEmails() {
  if (!imapConnection || !isConnected) return;

  imapConnection.openBox("INBOX", false, (err) => {
    if (err) {
      console.error("❌ Error opening INBOX:", err.message);
      return;
    }

    imapConnection.search(["UNSEEN"], (err, results) => {
      if (err) {
        console.error("❌ Error searching emails:", err.message);
        return;
      }

      if (!results || results.length === 0) {
        console.log("📭 No new emails found in INBOX.");
        return;
      }

      console.log(`📩 New Email Received! Found ${results.length} unread message(s).`);

      const fetch = imapConnection.fetch(results, {
        bodies: "",
        markSeen: true,
      });

      fetch.on("message", (msg) => {
        processMessage(msg).catch((err) =>
          console.error("❌ Failed to process message:", err.message)
        );
      });

      fetch.once("error", (err) => {
        console.error("❌ IMAP fetch error:", err.message);
      });
    });
  });
}

export function startEmailReceiver() {
  const { host, port, user, password, tls, pollInterval } = config.imap;

  if (!user || !password) {
    console.warn("⚠️  IMAP credentials not configured (EMAIL_USER / EMAIL_PASS).");
    console.warn("   Copy .env.example to .env and enter your credentials.");
    return;
  }

  console.log(`📧 Connecting to IMAP server ${host}:${port} as ${user}...`);

  imapConnection = new Imap({
    user,
    password,
    host,
    port,
    tls,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 10000,
  });

  imapConnection.once("ready", () => {
    isConnected = true;
    console.log("✅ IMAP Connected");

    fetchNewEmails();

    pollTimer = setInterval(() => {
      console.log(`\n🔄 Auto-polling inbox (every ${pollInterval / 1000}s)...`);
      fetchNewEmails();
    }, pollInterval);
  });

  imapConnection.once("error", (err) => {
    console.error("❌ IMAP Connection Error:", err.message);
    isConnected = false;
  });

  imapConnection.once("end", () => {
    console.log("📧 IMAP Connection Ended.");
    isConnected = false;
    setTimeout(() => {
      console.log("🔄 Reconnecting IMAP...");
      startEmailReceiver();
    }, 10000);
  });

  imapConnection.connect();
}

export function stopEmailReceiver() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  if (imapConnection) {
    try {
      imapConnection.end();
    } catch {
      // ignore
    }
    imapConnection = null;
  }
  isConnected = false;
}

export function getReceiverStatus() {
  return {
    connected: isConnected,
    configured: !!(config.imap.user && config.imap.password),
  };
}
