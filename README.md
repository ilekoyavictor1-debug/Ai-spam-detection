# AI Spam Detection — Cybersecurity Email Security Gateway

A modern, full-stack cybersecurity application built with **React.js**, **Node.js + Express**, **IMAP**, **SQLite**, and the modular **Antigravity AI Spam Engine**.

---

## 🏗️ Architecture & Folder Structure

```
Ai Spam Detection/
├── backend/
│   ├── server.js                   # Express server entry point (Port 5000)
│   ├── config.js                   # Environment configuration loader
│   ├── routes/
│   │   └── emailRoutes.js          # REST API endpoints (/api/emails)
│   ├── services/
│   │   ├── emailService.js         # IMAP connection & polling logic
│   │   └── spamDetectionService.js # Antigravity AI classification engine
│   ├── models/
│   │   └── emailModel.js           # Email schema definition
│   └── database/
│       ├── init.js                 # SQLite database initialization
│       └── emailRepository.js      # CRUD operations for emails database
├── src/                            # React Frontend
│   ├── components/                 # React UI components (Dashboard, EmailCard, EmailDetail, etc.)
│   ├── services/                   # Frontend API client
│   ├── App.jsx                     # Main application layout & state
│   └── index.css                   # Black & Gold cybersecurity design system
├── .env.example                    # Environment setup template
└── README.md                       # Setup and run instructions
```

---

## ⚙️ Environment Setup & Gmail IMAP Configuration

### Step 1: Enable IMAP in Gmail
1. Log into your Gmail account.
2. Go to **Settings** (gear icon) → **See all settings**.
3. Click on the **Forwarding and POP/IMAP** tab.
4. Under **IMAP access**, select **Enable IMAP**.
5. Click **Save Changes** at the bottom.

### Step 2: Generate Gmail App Password
1. Go to your Google Account security settings: [https://myaccount.google.com/security](https://myaccount.google.com/security).
2. Ensure **2-Step Verification** is turned **ON**.
3. Search for **App Passwords** or visit: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
4. Enter an App name (e.g. `AI Spam Gateway`) and click **Create**.
5. Copy the generated 16-character password (without spaces).

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

Update `.env` with your credentials:
```env
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
IMAP_POLL_INTERVAL=30000
PORT=5000
```

---

## 🚀 How to Run the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend & Frontend Concurrently
Run both the Express backend server (Port 5000) and React frontend (Vite) simultaneously:
```bash
npm run dev
```

- **Backend API**: `http://localhost:5000/api/emails`
- **React Gateway Dashboard**: `http://localhost:5173/` (or `:5174`)

---

## 📡 REST API Endpoints

- `GET /api/emails` — Returns list of all received & classified emails.
- `GET /api/emails/:id` — Returns full details of a specific email by ID.
- `GET /api/emails/stats` — Aggregate metrics (`TOTAL`, `SPAM`, `HAM`).
- `POST /api/emails/analyze` — Endpoint for manual text analysis.
