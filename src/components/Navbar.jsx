import React, { useState, useEffect } from "react";
import { fetchStats } from "../services/api";
import "./Navbar.css";

const Navbar = () => {
  const [stats, setStats] = useState({ total: 0, spam: 0, ham: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (err) {
        // ignore errors if server is starting
      }
    };
    loadStats();
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar" role="banner">
      <div className="navbar__logo">
        <span className="navbar__icon" aria-hidden="true">
          🛡️
        </span>
        <h1 className="navbar__title">AI Spam Detection</h1>
      </div>

      <div className="navbar__stats">
        <span className="stat-chip">TOTAL: {stats.total}</span>
        <span className="stat-chip stat-chip--spam">SPAM: {stats.spam}</span>
        <span className="stat-chip stat-chip--ham">HAM: {stats.ham}</span>
      </div>
    </nav>
  );
};

export default Navbar;
