import React, { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import TabBar from "./components/TabBar";
import Dashboard from "./components/Dashboard";
import EmailForm from "./components/EmailForm";
import ResultCard from "./components/ResultCard";
import { analyzeEmail } from "./services/spamDetectionService";

const appStyles = {
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3rem 1.5rem 4rem",
  },
  hero: {
    textAlign: "center",
    marginBottom: "2rem",
    animation: "fadeInUp 0.5s ease-out",
  },
  heroTitle: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
    fontWeight: 900,
    letterSpacing: "2px",
    background: "linear-gradient(135deg, var(--gold), var(--gold-accent))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "0.75rem",
  },
  heroSub: {
    fontSize: "0.95rem",
    color: "var(--text-secondary)",
    maxWidth: "540px",
    margin: "0 auto",
    lineHeight: 1.7,
  },
  footer: {
    textAlign: "center",
    padding: "1.5rem",
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.2)",
    borderTop: "1px solid var(--gold-dim)",
    fontFamily: "var(--font-body)",
    letterSpacing: "0.5px",
  },
};

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = useCallback(async (text) => {
    setIsLoading(true);
    setResult(null);

    try {
      const analysis = await analyzeEmail(text);
      setResult(analysis);
    } catch (err) {
      console.error("Analysis failed:", err);
      setResult({
        classification: "HAM",
        spamProbability: 0,
        hamProbability: 100,
        explanation: ["Analysis encountered an error. Please try again."],
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <Navbar />

      <main style={appStyles.main}>
        <div style={appStyles.hero}>
          <h2 style={appStyles.heroTitle}>Intelligent Email Analysis</h2>
          <p style={appStyles.heroSub}>
            Real-time cybersecurity gateway analyzing incoming messages and manual text feeds for spam indicators, phishing attempts, and threat metrics.
          </p>
        </div>

        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "dashboard" ? (
          <Dashboard />
        ) : (
          <>
            <EmailForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            <ResultCard result={result} />
          </>
        )}
      </main>

      <footer style={appStyles.footer}>
        © {new Date().getFullYear()} AI Spam Detection — Cybersecurity Gateway Engine
      </footer>
    </>
  );
};

export default App;
