import React, { useState, useEffect } from "react";
import EmailCard from "./EmailCard";
import EmailDetail from "./EmailDetail";
import { fetchEmails, fetchEmailById } from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [totalEmails, setTotalEmails] = useState(0);

  const loadEmails = async () => {
    try {
      const data = await fetchEmails(1, 50);
      setEmails(data.emails || []);
      setTotalEmails(data.total || 0);
    } catch (err) {
      console.error("Error loading emails:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
    const interval = setInterval(loadEmails, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = async (id) => {
    try {
      const fullEmail = await fetchEmailById(id);
      setSelectedEmail(fullEmail);
    } catch (err) {
      console.error("Failed to fetch detail:", err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__status">
        <div className="dashboard__indicator">
          <span className="dashboard__dot dashboard__dot--active" />
          <span>IMAP Gateway Active (Auto-polling)</span>
        </div>
        <span>Total Logged: {totalEmails}</span>
      </div>

      {loading ? (
        <div className="dashboard__empty">Scanning system logs...</div>
      ) : emails.length === 0 ? (
        <div className="dashboard__empty">
          <div className="dashboard__empty-icon">📭</div>
          <h3>No incoming emails detected yet</h3>
          <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
            Send an email to your configured address or use the Manual Scanner tab.
          </p>
        </div>
      ) : (
        <div className="dashboard__list">
          {emails.map((email) => (
            <EmailCard key={email.id} email={email} onClick={handleCardClick} />
          ))}
        </div>
      )}

      {selectedEmail && (
        <EmailDetail email={selectedEmail} onClose={() => setSelectedEmail(null)} />
      )}
    </div>
  );
};

export default Dashboard;
