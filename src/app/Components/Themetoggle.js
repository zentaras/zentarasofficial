"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // On mount, read saved preference
    const saved = localStorage.getItem("ll_theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ll_theme", next);
  };

  return (
   <button 
  className="theme-toggle" 
  onClick={toggle} 
  title="Toggle theme"
  style={{ width: "100%", justifyContent: "flex-start", padding: "10px 14px" }}
>
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb" />
      </div>
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}