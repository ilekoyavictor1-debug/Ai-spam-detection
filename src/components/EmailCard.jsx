import React from "react";
import "./EmailCard.css";

const EmailCard = ({ email, onClick }) => {
  const isSpam = email.classification === "SPAM";
  const dateFormatted = new Date(email.received_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="email-card" onClick={() => onClick(email.id)}>
      <span
        className={`email-card__badge ${
          isSpam ? "email-card__badge--spam" : "email-card__badge--ham"
        }`}
      >
        {isSpam ? "🚨 SPAM" : "✅ HAM"}
      </span>

      <span className="email-card__sender" title={email.sender}>
        {email.sender}
      </span>

      <span className="email-card__subject" title={email.subject}>
        {email.subject}
      </span>

      <span
        className={`email-card__prob ${
          isSpam ? "email-card__prob--spam" : "email-card__prob--ham"
        }`}
      >
        {isSpam ? `${email.spam_probability}% Spam` : `${email.ham_probability}% Ham`}
      </span>

      <span className="email-card__time">{dateFormatted}</span>
    </div>
  );
};

export default EmailCard;
