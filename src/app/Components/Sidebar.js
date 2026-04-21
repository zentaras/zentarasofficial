"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import ThemeToggle from "./Themetoggle";

const navItems = [
  { id: "dashboard",    icon: "⊞", label: "Dashboard" },
  { id: "applications", icon: "☰", label: "Applications" },
  { id: "analytics",   icon: "◈", label: "Analytics" },
  { id: "resume",      icon: "⬡", label: "Resume Matcher" },
];

const CHANGELOG = [
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

const COLLAPSED_WIDTH = 52;
const DEFAULT_WIDTH   = 220;
const MIN_WIDTH       = 180;
const MAX_WIDTH       = 340;

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
  const pathname                            = usePathname();
  const [showChangelog, setShowChangelog]   = useState(false);
  const [collapsed, setCollapsed]           = useState(false);
  const [width, setWidth]                   = useState(DEFAULT_WIDTH);
  const [hoveredItem, setHoveredItem]       = useState(null);
  const { user, isLoaded }                  = useUser();
  const isDragging                          = useRef(false);
  const dragStartX                          = useRef(0);
  const dragStartW                          = useRef(0);
  const prevWidth                           = useRef(DEFAULT_WIDTH);

  const currentVersion = CHANGELOG.find(r => r.tag !== "next")?.version ?? CHANGELOG[0].version;

  // ── Sync --sidebar-width CSS variable whenever width or collapsed changes ──
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? `${COLLAPSED_WIDTH}px` : `${width}px`
    );
  }, [width, collapsed]);

  // ── Drag-to-resize mouse events ────────────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    if (collapsed) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartW.current = width;
    document.body.style.cursor     = "col-resize";
    document.body.style.userSelect = "none";
  }, [collapsed, width]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const delta = e.clientX - dragStartX.current;
      const newW  = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, dragStartW.current + delta));
      setWidth(newW);
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current             = false;
      document.body.style.cursor     = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };
  }, []);

  // ── Collapse / expand ──────────────────────────────────────────────────────
  const toggleCollapse = () => {
    if (!collapsed) {
      prevWidth.current = width;
      setCollapsed(true);
    } else {
      setWidth(prevWidth.current);
      setCollapsed(false);
    }
  };

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : width;

  return (
    <>
      <aside
        className="sidebar"
        style={{
          width: sidebarWidth,
          minWidth: collapsed ? COLLAPSED_WIDTH : MIN_WIDTH,
          maxWidth: collapsed ? COLLAPSED_WIDTH : MAX_WIDTH,
          transition: isDragging.current
            ? "none"
            : "width 0.22s cubic-bezier(0.4,0,0.2,1)",
          position: "fixed",
          overflow: "visible",
        }}
      >
        {/* ── Logo row ──────────────────────────────────────────────────── */}
        <div
          className="sidebar-logo"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            gap: 6,
            overflow: "hidden",
          }}
        >
          {!collapsed && (
            <div className="logo-mark" style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              Leader<span>Lab</span>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              width: 22, height: 22, borderRadius: 5,
              border: "1px solid var(--sidebar-border)",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "transform 0.2s",
            }}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* ── Nav ───────────────────────────────────────────────────────── */}
        <nav className="sidebar-nav">
          {!collapsed && (
            <div className="nav-section-label">Navigation</div>
          )}

          {navItems.map((item) => {
            const href     = `/${item.id}`;
            const isActive = pathname === href;
            return (
              <div
                key={item.id}
                style={{ position: "relative" }}
                onMouseEnter={() => collapsed && setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={href}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  style={{
                    justifyContent: collapsed ? "center" : undefined,
                    padding:        collapsed ? "9px"    : undefined,
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && item.label}
                </Link>

                {/* Tooltip — visible only when collapsed */}
                {collapsed && hoveredItem === item.id && (
                  <div style={{
                    position: "absolute",
                    left: "calc(100% + 10px)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "var(--bg-card)",
                    color: "var(--text-primary)",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "5px 12px",
                    borderRadius: 7,
                    whiteSpace: "nowrap",
                    border: "1px solid var(--border-light)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                    zIndex: 200,
                    pointerEvents: "none",
                    animation: "tooltipIn 0.12s ease",
                  }}>
                    {item.label}
                    <div style={{
                      position: "absolute",
                      left: -5, top: "50%",
                      transform: "translateY(-50%)",
                      width: 0, height: 0,
                      borderTop: "5px solid transparent",
                      borderBottom: "5px solid transparent",
                      borderRight: "5px solid var(--border-light)",
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Bottom section ─────────────────────────────────────────────── */}
        <div style={{
          marginTop: "auto",
          padding: collapsed ? "12px 6px 14px" : "14px 12px 16px",
          borderTop: "1px solid var(--sidebar-border)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: collapsed ? "center" : undefined,
          overflow: "hidden",
        }}>

          {/* Theme toggle — hidden when collapsed */}
          {!collapsed && <ThemeToggle />}

          {/* User row */}
          {isLoaded && user ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: collapsed ? 0 : 9,
              padding: collapsed ? "4px" : "7px 9px",
              borderRadius: 8,
              background: "var(--sidebar-bottom-user-bg)",
              border: "1px solid var(--sidebar-bottom-user-border)",
              overflow: "hidden",
              justifyContent: collapsed ? "center" : undefined,
            }}>
              <UserButton afterSignOutUrl="/sign-in" />
              {!collapsed && (
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{
                    margin: 0, fontSize: 12, fontWeight: 600,
                    color: "var(--sidebar-logo-color)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {user.fullName || user.username || "User"}
                  </p>
                  <p style={{
                    margin: 0, fontSize: 10,
                    color: "var(--sidebar-logo-sub)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              )}
            </div>
          ) : isLoaded && !user ? (
            <Link href="/sign-in" style={{
              display: "flex", alignItems: "center",
              gap: collapsed ? 0 : 8,
              padding: collapsed ? "6px" : "7px 10px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none",
              justifyContent: collapsed ? "center" : undefined,
            }}>
              <span style={{ fontSize: 13 }}>→</span>
              {!collapsed && " Sign in"}
            </Link>
          ) : null}

          {/* Version / changelog button — hidden when collapsed */}
          {!collapsed && (
            <button
              suppressHydrationWarning
              onClick={() => setShowChangelog(true)}
              className="sidebar-version-btn"
            >
              <span className="sidebar-version-icon">◈</span>
              <span className="sidebar-version-text">{currentVersion}</span>
              <span className="sidebar-version-sub">What's new →</span>
            </button>
          )}
        </div>

        {/* ── Resize handle — desktop only, hidden when collapsed ────────── */}
        {!collapsed && (
          <div
            onMouseDown={onMouseDown}
            style={{
              position: "absolute",
              right: 0, top: 0, bottom: 0,
              width: 5,
              cursor: "col-resize",
              zIndex: 10,
              background: "transparent",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-border)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          />
        )}

        <style>{`
          @keyframes tooltipIn {
            from { opacity: 0; transform: translateY(-50%) translateX(-4px); }
            to   { opacity: 1; transform: translateY(-50%) translateX(0); }
          }
          @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
          @keyframes slideUp {
            from { opacity: 0; transform: translate(-50%, calc(-50% + 14px)); }
            to   { opacity: 1; transform: translate(-50%, -50%); }
          }
          @media (max-width: 768px) {
            aside.sidebar {
              display: none;
            }
          }
        `}</style>
      </aside>

      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
    </>
  );
}