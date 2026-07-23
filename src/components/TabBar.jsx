import React from "react";
import "./TabBar.css";

const TabBar = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-bar">
      <button
        className={`tab-btn ${activeTab === "dashboard" ? "tab-btn--active" : ""}`}
        onClick={() => onTabChange("dashboard")}
      >
        📊 Incoming Dashboard
      </button>
      <button
        className={`tab-btn ${activeTab === "manual" ? "tab-btn--active" : ""}`}
        onClick={() => onTabChange("manual")}
      >
        ⚡ Manual Scanner
      </button>
    </div>
  );
};

export default TabBar;
