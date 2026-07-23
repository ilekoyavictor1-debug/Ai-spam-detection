import React, { useState } from "react";
import "./EmailForm.css";

/**
 * EmailForm — Large textarea for email input + "Analyze Email" button.
 *
 * Props:
 *  - onAnalyze(text): callback invoked with the email text
 *  - isLoading: boolean — disables the button and shows a spinner
 */
const EmailForm = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate: require at least some meaningful content
    if (text.trim().length < 5) {
      setError("Please enter an email message (at least 5 characters).");
      return;
    }

    setError("");
    onAnalyze(text.trim());
  };

  return (
    <form className="email-form" onSubmit={handleSubmit} id="email-form">
      <label className="email-form__label" htmlFor="email-input">
        📧 Paste or type an email message
      </label>

      <div className="email-form__textarea-wrap">
        <textarea
          id="email-input"
          className="email-form__textarea"
          placeholder="Dear customer, your account has been selected for a special prize…"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError("");
          }}
          disabled={isLoading}
          spellCheck="false"
        />
        <span className="email-form__counter" aria-live="polite">
          {text.length.toLocaleString()} chars
        </span>
      </div>

      {error && (
        <p className="email-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="email-form__actions">
        <button
          type="submit"
          className="email-form__btn"
          disabled={isLoading}
          id="analyze-btn"
        >
          {isLoading ? (
            <>
              <span className="email-form__spinner" aria-hidden="true" />
              Analyzing…
            </>
          ) : (
            <>⚡ Analyze Email</>
          )}
        </button>
      </div>
    </form>
  );
};

export default EmailForm;
