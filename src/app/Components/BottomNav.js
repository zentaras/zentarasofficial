"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import ThemeToggle from "./Themetoggle";

const navItems = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "applications", icon: "☰", label: "Applications" },
  { id: "analytics", icon: "◈", label: "Analytics" },
  { id: "resume", icon: "⬡", label: "Resume Matcher" },
];

const bottomItems = navItems.slice(0, 4);
const moreItems = navItems.slice(4);

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
  new: {
    label: "New",
    color: "var(--green)",
    bg: "var(--green-dim)",
    border: "rgba(34,160,107,0.2)",
  },
  improved: {
    label: "Improved",
    color: "var(--accent)",
    bg: "var(--accent-dim)",
    border: "var(--accent-border)",
  },
  fix: {
    label: "Fix",
    color: "var(--yellow)",
    bg: "var(--yellow-dim)",
    border: "rgba(226,178,3,0.2)",
  },
  upcoming: {
    label: "Upcoming",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.07)",
    border: "rgba(244,114,182,0.2)",
  },
};

function ChangelogModal({ onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          zIndex: 1100,
          animation: "fadeIn 0.18s ease",
        }}
      />

      {/* Modal container */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(520px, 92vw)",
          maxHeight: "80vh",
          background: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          zIndex: 1101,
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
          animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            background: "var(--bg-card)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.3px",
              }}
            >
              What's New
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 2,
              }}
            >
              LeaderLab changelog
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div
          style={{
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 28,
            background: "var(--bg-card)",
          }}
        >
          {CHANGELOG.map((release, i) => {
            const regularChanges = release.changes.filter(
              (c) => c.type !== "upcoming"
            );
            const upcomingChanges = release.changes.filter(
              (c) => c.type === "upcoming"
            );
            return (
              <div key={release.version}>
                {/* Version header row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "var(--text-primary)",
                    }}
                  >
                    {release.version}
                  </span>
                  {release.tag === "next" && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        padding: "2px 7px",
                        borderRadius: 4,
                        background: "rgba(244,114,182,0.12)",
                        color: "#f472b6",
                        border: "1px solid rgba(244,114,182,0.25)",
                      }}
                    >
                      Next
                    </span>
                  )}
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      color: "var(--text-muted)",
                    }}
                  >
                    {release.date}
                  </span>
                </div>

                {/* Regular changes */}
                {regularChanges.length > 0 && (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {regularChanges.map((c, j) => {
                      const cfg = TYPE_CONFIG[c.type];
                      return (
                        <div
                          key={j}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            padding: "9px 12px",
                            borderRadius: 8,
                            background: "var(--bg-hover)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.6px",
                              padding: "2px 6px",
                              borderRadius: 4,
                              background: cfg.bg,
                              color: cfg.color,
                              flexShrink: 0,
                              marginTop: 1,
                              border: `1px solid ${cfg.border}`,
                            }}
                          >
                            {cfg.label}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--text-secondary)",
                              lineHeight: 1.6,
                            }}
                          >
                            {c.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upcoming changes */}
                {upcomingChanges.length > 0 && (
                  <div
                    style={{ marginTop: regularChanges.length > 0 ? 16 : 0 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          height: 1,
                          flex: 1,
                          background:
                            "linear-gradient(to right, rgba(244,114,182,0.35), transparent)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          color: "#f472b6",
                          opacity: 0.75,
                        }}
                      >
                        ✦ Coming Soon
                      </span>
                      <div
                        style={{
                          height: 1,
                          flex: 1,
                          background:
                            "linear-gradient(to left, rgba(244,114,182,0.35), transparent)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {upcomingChanges.map((c, j) => {
                        const cfg = TYPE_CONFIG.upcoming;
                        return (
                          <div
                            key={j}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              padding: "9px 12px",
                              borderRadius: 8,
                              background: "rgba(244,114,182,0.04)",
                              border: "1px dashed rgba(244,114,182,0.25)",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.6px",
                                padding: "2px 6px",
                                borderRadius: 4,
                                background: cfg.bg,
                                color: cfg.color,
                                flexShrink: 0,
                                marginTop: 1,
                                border: `1px solid ${cfg.border}`,
                              }}
                            >
                              {cfg.label}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                color: "var(--text-secondary)",
                                lineHeight: 1.6,
                                opacity: 0.75,
                                fontStyle: "italic",
                              }}
                            >
                              {c.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Divider between releases */}
                {i < CHANGELOG.length - 1 && (
                  <div
                    style={{
                      height: 1,
                      background: "var(--border)",
                      marginTop: 24,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
      `}</style>
    </>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const { user, isLoaded } = useUser();

  const currentVersion =
    CHANGELOG.find((r) => r.tag !== "next")?.version ?? CHANGELOG[0].version;

  return (
    <>
      <nav className="mobile-bottom-nav">
        {bottomItems.map((item) => {
          const href = `/${item.id}`;
          const isActive = pathname === href;
          return (
            <Link
              key={item.id}
              href={href}
              className={`mobile-tab-item ${isActive ? "active" : ""}`}
              onClick={() => setMoreOpen(false)}
            >
              <span className="mobile-tab-icon">{item.icon}</span>
              <span className="mobile-tab-label">{item.label}</span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          className={`mobile-tab-item ${
            moreItems.some((i) => `/${i.id}` === pathname) || moreOpen
              ? "active"
              : ""
          }`}
          onClick={() => setMoreOpen((p) => !p)}
        >
          <span className="mobile-tab-icon">•••</span>
          <span className="mobile-tab-label">More</span>
        </button>

        {/* More drawer */}
        {moreOpen && (
          <>
            <div className="more-backdrop" onClick={() => setMoreOpen(false)} />
            <div className="more-drawer">

              {/* ── USER SECTION ── */}
              {isLoaded && user ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px 14px",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: 4,
                  }}
                >
                  <UserButton afterSignOutUrl="/sign-in" />
                  <div style={{ overflow: "hidden", flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user.fullName || user.username || "User"}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11,
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                </div>
              ) : isLoaded && !user ? (
                <div
                  style={{
                    padding: "12px 16px 14px",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: 4,
                  }}
                >
                  <Link
                    href="/sign-in"
                    onClick={() => setMoreOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "var(--accent)",
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <span>→</span> Sign in to your account
                  </Link>
                </div>
              ) : null}

              {/* Nav items in drawer */}
              {moreItems.map((item) => {
                const href = `/${item.id}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={`more-drawer-item ${isActive ? "active" : ""}`}
                    onClick={() => setMoreOpen(false)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}

              {/* ── THEME TOGGLE ROW ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 16px",
                  marginTop: 4,
                  borderTop: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                  }}
                >
                  Theme
                </span>
                <ThemeToggle />
              </div>

              {/* ── VERSION / CHANGELOG ── */}
              <button
                onClick={() => {
                  setMoreOpen(false);
                  setShowChangelog(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "10px 16px",
                  borderTop: "1px solid var(--border)",
                  background: "transparent",
                  border: "none",
                  borderTop: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--bg-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span style={{ fontSize: 12, color: "var(--sidebar-version-icon)" }}>◈</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--accent)",
                  }}
                >
                  {currentVersion}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 10,
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  What's new →
                </span>
              </button>
            </div>
          </>
        )}
      </nav>

      {showChangelog && (
        <ChangelogModal onClose={() => setShowChangelog(false)} />
      )}
    </>
  );
}