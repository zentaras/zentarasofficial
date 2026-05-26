"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderRadius: "var(--radius-sm, 6px)",
        border: "none",
        background: "var(--bg-hover, rgba(255,255,255,0.05))",
        color: "var(--text-muted, #888)",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        transition: "background 0.15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-card, rgba(255,255,255,0.08))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-hover, rgba(255,255,255,0.05))";
      }}
    >
      {/* Track */}
      <div style={{
        width: 32,
        height: 18,
        borderRadius: 9,
        background: theme === "dark"
          ? "rgba(255,255,255,0.12)"
          : "rgba(99,102,241,0.25)",
        border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(99,102,241,0.4)"}`,
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s, border-color 0.2s",
      }}>
        <div style={{
          position: "absolute",
          top: 2,
          left: theme === "dark" ? 2 : 14,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: theme === "dark" ? "#888" : "var(--accent, #6366f1)",
          transition: "left 0.2s, background 0.2s",
        }} />
      </div>

      {/* Label */}
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}