import React from "react";
import ResultCard from "./ResultCard";
import "./EmailDetail.css";

const EmailDetail = ({ email, onClose }) => {
  if (!email) return null;

  const resultData = {
    classification: email.classification,
    spamProbability: email.spam_probability,
    hamProbability: email.ham_probability,
    explanation: email.explanation || [],
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="email-detail" onClick={(e) => e.stopPropagation()}>
        <div className="email-detail__header">
          <div className="email-detail__meta">
            <h2 className="email-detail__title">{email.subject}</h2>
            <span className="email-detail__sender">
              From: {email.sender} • {new Date(email.received_at).toLocaleString()}
            </span>
          </div>
          <button className="email-detail__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="email-detail__body">
          <div className="email-detail__content">
            {email.body || "(Empty email body)"}
          </div>

          <ResultCard result={resultData} />
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
