"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import ThemeToggle from "./Themetoggle";

const navItems = [
  { id: "dashboard",    icon: "⊞", label: "Dashboard" },
  { id: "applications", icon: "☰", label: "Applications" },
  { id: "analytics",   icon: "◈", label: "Analytics" },
  { id: "resume",      icon: "⬡", label: "Resume Matcher" },
];

const CHANGELOG = [
  // {
  //   version: "v1.2.0",
  //   date: "Coming Soon",
  //   tag: "next",
  //   changes: [
  //     { type: "upcoming", text: "User authentication — sign up & log in to your account securely" },
  //     { type: "upcoming", text: "Cloud database sync — your applications backed up and accessible from any device" },
  //     { type: "upcoming", text: "No more local storage limits — unlimited applications stored in the cloud" },
  //   ],
  // },
  {
    version: "v1.2.0",
    date: "April 2025",
    tag: "null",
    changes: [
      { type: "new", text: "User authentication — sign up & log in to your account securely" },
      { type: "new", text: "Cloud database sync — your applications backed up and accessible from any device" },
      { type: "new", text: "No more local storage limits — unlimited applications stored in the cloud" },
      
    ],
  },
  {
    version: "v1.1.0",
    date: "March 2025",
    tag: null,
    changes: [
      { type: "new",      text: "Resume tab updated with only 3 limits per day." },
      { type: "fix",      text: "Minor bugs fixed" },
      { type: "improved", text: "Dashboard cards now show streak and active application count" },
    ],
  },
];

const TYPE_CONFIG = {
  new:      { label: "New",      color: "var(--green)",  bg: "var(--green-dim)",  border: "rgba(34,160,107,0.2)" },
  improved: { label: "Improved", color: "var(--accent)", bg: "var(--accent-dim)", border: "var(--accent-border)" },
  fix:      { label: "Fix",      color: "var(--yellow)", bg: "var(--yellow-dim)", border: "rgba(226,178,3,0.2)" },
  upcoming: { label: "Upcoming", color: "#f472b6",       bg: "rgba(244,114,182,0.07)", border: "rgba(244,114,182,0.2)" },
};

function ChangelogModal({ onClose }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        zIndex: 999, animation: "fadeIn 0.18s ease",
      }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(520px, 92vw)", maxHeight: "80vh",
        background: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: 12, display: "flex", flexDirection: "column",
        zIndex: 1000, boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)", overflow: "hidden",
      }}>
        <div style={{
          padding: "18px 22px 14px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>What's New</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>LeaderLab changelog</div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: "50%",
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--text-muted)", fontSize: 15, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        <div style={{ overflowY: "auto", padding: "18px 22px", display: "flex", flexDirection: "column", gap: 24 }}>
          {CHANGELOG.map((release, i) => {
            const regular  = release.changes.filter(c => c.type !== "upcoming");
            const upcoming = release.changes.filter(c => c.type === "upcoming");
            return (
              <div key={release.version}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{release.version}</span>
                  {release.tag === "next" && (
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px",
                      padding: "2px 7px", borderRadius: 4, background: "rgba(244,114,182,0.12)",
                      color: "#f472b6", border: "1px solid rgba(244,114,182,0.25)" }}>Next</span>
                  )}
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)" }}>{release.date}</span>
                </div>

                {regular.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {regular.map((c, j) => {
                      const cfg = TYPE_CONFIG[c.type];
                      return (
                        <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10,
                          padding: "8px 11px", borderRadius: 7,
                          background: "var(--bg-hover)", border: "1px solid var(--border)" }}>
                          <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                            letterSpacing: "0.6px", padding: "2px 6px", borderRadius: 4,
                            background: cfg.bg, color: cfg.color, flexShrink: 0, marginTop: 1,
                            border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                          <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{c.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {upcoming.length > 0 && (
                  <div style={{ marginTop: regular.length > 0 ? 14 : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, rgba(244,114,182,0.35), transparent)" }} />
                      <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: "1px", color: "#f472b6", opacity: 0.75 }}>✦ Coming Soon</span>
                      <div style={{ height: 1, flex: 1, background: "linear-gradient(to left, rgba(244,114,182,0.35), transparent)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {upcoming.map((c, j) => {
                        const cfg = TYPE_CONFIG.upcoming;
                        return (
                          <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10,
                            padding: "8px 11px", borderRadius: 7,
                            background: "rgba(244,114,182,0.04)", border: "1px dashed rgba(244,114,182,0.25)" }}>
                            <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                              letterSpacing: "0.6px", padding: "2px 6px", borderRadius: 4,
                              background: cfg.bg, color: cfg.color, flexShrink: 0, marginTop: 1,
                              border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                            <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6,
                              opacity: 0.75, fontStyle: "italic" }}>{c.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {i < CHANGELOG.length - 1 && (
                  <div style={{ height: 1, background: "var(--border)", marginTop: 20 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 14px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
      `}</style>
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [showChangelog, setShowChangelog] = useState(false);
  const { user, isLoaded } = useUser();

  const currentVersion = CHANGELOG.find(r => r.tag !== "next")?.version ?? CHANGELOG[0].version;

  return (
    <>
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">Leader<span>Lab</span></div>
          
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map((item) => {
            const href = `/${item.id}`;
            const isActive = pathname === href;
            return (
              <Link key={item.id} href={href} className={`nav-item ${isActive ? "active" : ""}`}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div style={{ marginTop: "auto", padding: "14px 12px 16px", borderTop: "1px solid var(--sidebar-border)", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User row */}
          {isLoaded && user ? (
           <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 9px",
  borderRadius: 8, background: "var(--sidebar-bottom-user-bg)", border: "1px solid var(--sidebar-bottom-user-border)" }}>
              <UserButton afterSignOutUrl="/sign-in" />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--sidebar-logo-color)",
  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.fullName || user.username || "User"}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: "var(--sidebar-logo-sub)",
  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          ) : isLoaded && !user ? (
            <Link href="/sign-in" style={{ display: "flex", alignItems: "center", gap: 8,
              padding: "7px 10px", borderRadius: 8,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              <span style={{ fontSize: 13 }}>→</span> Sign in
            </Link>
          ) : null}

          

          {/* Version button */}
          <button suppressHydrationWarning onClick={() => setShowChangelog(true)} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--sidebar-version-bg)", border: "1px solid var(--sidebar-version-border)",
            borderRadius: 6, padding: "5px 10px", cursor: "pointer", width: "100%", transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
          >
            <span style={{ fontSize: 10, color: "var(--sidebar-version-icon)" }}>◈</span>
<span style={{ fontSize: 11, fontWeight: 600, color: "var(--sidebar-version-text)" }}>{currentVersion}</span>
<span style={{ marginLeft: "auto", fontSize: 9, color: "var(--sidebar-version-sub)", fontStyle: "italic" }}>What's new →</span>
          </button>
        </div>
      </aside>

      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
    </>
  );
}