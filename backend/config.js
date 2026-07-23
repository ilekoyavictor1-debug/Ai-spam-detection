import dotenv from "dotenv";
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5001,
  imap: {
    host: process.env.IMAP_HOST || "imap.gmail.com",
    port: parseInt(process.env.IMAP_PORT, 10) || 993,
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASS || "",
    tls: process.env.IMAP_TLS !== "false",
    pollInterval: parseInt(process.env.IMAP_POLL_INTERVAL, 10) || 30000,
  },
};

export default config;
