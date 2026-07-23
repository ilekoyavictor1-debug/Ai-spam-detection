/* ============================================================
   Backend Express Server — server.js
   ============================================================ */

import express from "express";
import cors from "cors";
import config from "./config.js";
import emailRoutes from "./routes/emailRoutes.js";
import { getDatabase } from "./database/init.js";
import { startEmailReceiver, stopEmailReceiver } from "./services/emailService.js";

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Database
getDatabase();

// Mount API Routes
app.use("/api/emails", emailRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start Express Server
const server = app.listen(config.port, () => {
  console.log(`\n🚀 AI Spam Detection Backend Server running on http://localhost:${config.port}`);
  
  // Start IMAP email receiver
  startEmailReceiver();
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("\n Gracefully shutting down server...");
  stopEmailReceiver();
  server.close(() => {
    console.log(" Server stopped.");
    process.exit(0);
  });
});
