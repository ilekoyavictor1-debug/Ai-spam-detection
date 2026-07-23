import React from "react";
import "./ResultCard.css";

/**
 * ResultCard — Displays spam/ham classification, probability bars, and
 *              a list of detected indicators.
 *
 * Props:
 *  - result: { classification, spamProbability, hamProbability, explanation[] }
 */
const ResultCard = ({ result }) => {
  if (!result) return null;

  const { classification, spamProbability, hamProbability, explanation } =
    result;
  const isSpam = classification === "SPAM";

  return (
    <section className="result-card" id="result-card" aria-live="polite">
      {/* ── Classification Badge ── */}
      <div className="result-card__header">
        <span
          className={`result-card__badge ${
            isSpam ? "result-card__badge--spam" : "result-card__badge--ham"
          }`}
          id="classification-badge"
        >
          {isSpam ? "🚨" : "✅"} {classification}
        </span>
        <span className="result-card__subtitle">
          {isSpam
            ? "This message has been flagged as potentially unwanted."
            : "This message appears to be legitimate."}
        </span>
      </div>

      {/* ── Probability Bars ── */}
      <div className="result-card__bars">
        {/* Spam bar */}
        <div className="prob-bar">
          <div className="prob-bar__label">
            <span className="prob-bar__label-name">Spam Probability</span>
            <span className="prob-bar__label-value prob-bar__label-value--spam">
              {spamProbability}%
            </span>
          </div>
          <div className="prob-bar__track">
            <div
              className="prob-bar__fill prob-bar__fill--spam"
              style={{ width: `${spamProbability}%` }}
              role="progressbar"
              aria-valuenow={spamProbability}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Spam probability: ${spamProbability}%`}
            />
          </div>
        </div>

        {/* Ham bar */}
        <div className="prob-bar">
          <div className="prob-bar__label">
            <span className="prob-bar__label-name">Ham Probability</span>
            <span className="prob-bar__label-value prob-bar__label-value--ham">
              {hamProbability}%
            </span>
          </div>
          <div className="prob-bar__track">
            <div
              className="prob-bar__fill prob-bar__fill--ham"
              style={{ width: `${hamProbability}%` }}
              role="progressbar"
              aria-valuenow={hamProbability}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Ham probability: ${hamProbability}%`}
            />
          </div>
        </div>
      </div>

      {/* ── Explanation ── */}
      <div className="result-card__explanation">
        <h3 className="result-card__explanation-title">
          🔍 Detected Indicators
        </h3>
        <ul className="result-card__reasons">
          {explanation.map((reason, index) => (
            <li className="result-card__reason" key={index}>
              <span className="result-card__reason-icon" aria-hidden="true">
                {isSpam ? "⚠️" : "•"}
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ResultCard;
