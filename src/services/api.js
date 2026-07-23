/* ============================================================
   API Client Module
   ============================================================ */

const BASE_URL = "/api/emails";

export async function fetchEmails(page = 1, limit = 20) {
  const res = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch emails");
  return res.json();
}

export async function fetchEmailById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch email details");
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error("Failed to fetch email stats");
  return res.json();
}

export async function analyzeTextApi(text, save = false) {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, save }),
  });
  if (!res.ok) throw new Error("Failed to analyze text");
  return res.json();
}
