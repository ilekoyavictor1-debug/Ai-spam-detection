/* ============================================================
   Spam Detection Service
   ---------------------------------------------------------------
   Rule-based heuristic engine for email spam classification.

   ARCHITECTURE NOTE:
   This module exports a single async function `analyzeEmail(text)`.
   The UI layer depends ONLY on this interface.  To integrate a real
   ML model or external API in the future, replace the implementation
   of `analyzeEmail` — zero UI changes required.
   ============================================================ */

// ── Pattern Definitions ──────────────────────────────────────
// Each rule has: name, patterns (regex array), weight (0-100 contribution),
// and a human-readable label shown in the explanation.

const RULES = [
  {
    name: "urgency",
    label: "Urgency / pressure language detected",
    weight: 15,
    patterns: [
      /\bact now\b/i,
      /\blimited time\b/i,
      /\bimmediately\b/i,
      /\burgent\b/i,
      /\bexpires?\b/i,
      /\bhurry\b/i,
      /\bdon'?t miss\b/i,
      /\blast chance\b/i,
      /\btime.?sensitive\b/i,
      /\bdeadline\b/i,
      /\bonly \d+ left\b/i,
    ],
  },
  {
    name: "financial",
    label: "Financial incentives or money language",
    weight: 15,
    patterns: [
      /\bfree\b/i,
      /\bwinner\b/i,
      /\bprize\b/i,
      /\bcash\b/i,
      /\bmoney\b/i,
      /\bdollar/i,
      /\binvestment\b/i,
      /\blottery\b/i,
      /\bjackpot\b/i,
      /\bcongratulations\b/i,
      /\bmillion/i,
      /\brich\b/i,
      /\bno cost\b/i,
      /\bsave big\b/i,
      /\bdiscount\b/i,
      /\boffer\b/i,
      /\bbargain\b/i,
    ],
  },
  {
    name: "suspicious_keywords",
    label: "Suspicious call-to-action keywords",
    weight: 10,
    patterns: [
      /\bclick here\b/i,
      /\bunsubscribe\b/i,
      /\bno obligation\b/i,
      /\brisk.?free\b/i,
      /\bguarantee/i,
      /\bspecial promotion\b/i,
      /\bexclusive deal\b/i,
      /\bbuy now\b/i,
      /\border now\b/i,
      /\bapply now\b/i,
      /\bsign up free\b/i,
    ],
  },
  {
    name: "phishing",
    label: "Phishing / identity-theft phrases",
    weight: 15,
    patterns: [
      /\bverify your (account|identity|email|password)\b/i,
      /\bconfirm (your )?(identity|account|details|information)\b/i,
      /\bsuspicious activity\b/i,
      /\baccount (has been |was )?(suspended|locked|compromised)\b/i,
      /\breset your password\b/i,
      /\bunauthorized (access|login|transaction)\b/i,
      /\bsecurity alert\b/i,
      /\bupdate your (payment|billing|info)/i,
    ],
  },
  {
    name: "links",
    label: "Abnormal link / URL patterns",
    weight: 10,
    patterns: [
      /https?:\/\/\S+/gi,   // any URL
      /bit\.ly/i,
      /tinyurl/i,
      /goo\.gl/i,
      /t\.co\//i,
      /\bclk\b/i,
    ],
  },
  {
    name: "caps_abuse",
    label: "Excessive use of CAPITAL LETTERS",
    weight: 10,
    /* Evaluated separately — see `evaluateCaps` */
    patterns: [],
  },
  {
    name: "exclamation_abuse",
    label: "Excessive exclamation marks (!!!)",
    weight: 5,
    /* Evaluated separately — see `evaluateExclamations` */
    patterns: [],
  },
  {
    name: "sender_deception",
    label: "Deceptive sender / impersonation language",
    weight: 10,
    patterns: [
      /\bdear (customer|user|member|valued)\b/i,
      /\bfrom the desk of\b/i,
      /\bofficial notification\b/i,
      /\bthis is not a scam\b/i,
      /\btrusted\b/i,
      /\bverified sender\b/i,
    ],
  },
  {
    name: "emotional_manipulation",
    label: "Emotional manipulation detected",
    weight: 10,
    patterns: [
      /\byou'?ve been selected\b/i,
      /\byou are (a |the )?winner\b/i,
      /\bdon'?t ignore\b/i,
      /\bthis is your (last|final)\b/i,
      /\bbelieve it or not\b/i,
      /\byou won'?t believe\b/i,
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────

/**
 * Count how many patterns from a rule match the text.
 * For the "links" rule, count each URL occurrence separately.
 */
function countMatches(text, patterns) {
  let hits = 0;
  for (const regex of patterns) {
    const matches = text.match(new RegExp(regex.source, regex.flags));
    if (matches) {
      hits += matches.length;
    }
  }
  return hits;
}

/**
 * Check if >30% of alpha characters are uppercase.
 */
function evaluateCaps(text) {
  const alpha = text.replace(/[^a-zA-Z]/g, "");
  if (alpha.length < 10) return false; // too short to judge
  const upper = alpha.replace(/[^A-Z]/g, "").length;
  return upper / alpha.length > 0.3;
}

/**
 * Check if there are more than 3 exclamation marks.
 */
function evaluateExclamations(text) {
  return (text.match(/!/g) || []).length > 3;
}

// ── Main Analysis Function ──────────────────────────────────

/**
 * Analyze the given email text for spam indicators.
 *
 * @param {string} text - Raw email body text
 * @returns {Promise<{
 *   classification: "SPAM" | "HAM",
 *   spamProbability: number,
 *   hamProbability: number,
 *   explanation: string[]
 * }>}
 */
export async function analyzeEmail(text) {
  // Simulate network / model latency (1.5s)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  let totalScore = 0;
  const maxPossibleScore = RULES.reduce((sum, r) => sum + r.weight, 0);
  const triggeredExplanations = [];

  for (const rule of RULES) {
    let triggered = false;

    // Special-case evaluations
    if (rule.name === "caps_abuse") {
      triggered = evaluateCaps(text);
    } else if (rule.name === "exclamation_abuse") {
      triggered = evaluateExclamations(text);
    } else {
      const hits = countMatches(text, rule.patterns);
      triggered = hits > 0;
      // Bonus for multiple hits in the same category (capped at 2× weight)
      if (hits > 1) {
        totalScore += Math.min(rule.weight * (hits / 2), rule.weight * 2);
        triggeredExplanations.push(rule.label);
        continue;
      }
    }

    if (triggered) {
      totalScore += rule.weight;
      triggeredExplanations.push(rule.label);
    }
  }

  // Normalize score to 0–100 probability
  const spamProbability = Math.min(
    Math.round((totalScore / maxPossibleScore) * 100),
    99
  );
  const hamProbability = 100 - spamProbability;

  // Classify at 50% threshold
  const classification = spamProbability >= 50 ? "SPAM" : "HAM";

  // Add a fallback explanation for very clean emails
  if (triggeredExplanations.length === 0) {
    triggeredExplanations.push(
      "No suspicious patterns detected — message appears legitimate."
    );
  }

  return {
    classification,
    spamProbability,
    hamProbability,
    explanation: triggeredExplanations,
  };
}
