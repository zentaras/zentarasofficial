"use client";

import { useState } from "react";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";

const PROJECT_DETAILS = {
  "AI Resume Screener": {
    duration: "3 Months", mode: "Remote", type: "Unpaid · Experience-based",
    stack: ["Python", "spaCy", "HuggingFace", "FastAPI", "PostgreSQL"],
    deliverables: ["Resume parser with entity extraction", "Scoring engine using BERT embeddings", "API endpoint + Postman documentation", "Final report with benchmark results"],
  },
  "E-Commerce Analytics": {
    duration: "2 Months", mode: "Remote", type: "Unpaid · Experience-based",
    stack: ["Python", "Pandas", "PostgreSQL", "Plotly Dash", "Power BI"],
    deliverables: ["Cleaned, normalised PostgreSQL data warehouse", "10+ analytical SQL query library", "Interactive dashboard", "Executive summary PDF"],
  },
  "Sentiment Dashboard": {
    duration: "2.5 Months", mode: "Remote", type: "Unpaid · Experience-based",
    stack: ["Python", "Transformers", "Streamlit", "Redis", "PostgreSQL"],
    deliverables: ["Ingestion pipeline", "Fine-tuned sentiment classifier", "Live Streamlit dashboard with topic filters", "Documentation + architecture diagram"],
  },
};

function statusStyle(s) {
  if (s === "Shortlisted") return { bg: "var(--green-dim)", color: "var(--green)" };
  if (s === "Rejected")    return { bg: "var(--red-dim)",   color: "var(--red)" };
  return { bg: "var(--blue-dim)", color: "var(--blue)" };
}

// ── SSR-safe origin ───────────────────────────────────────────────────────────
// Next.js SSR-renders "use client" components on the server too, where
// `window` is undefined. Wrapping in a function means it's only called
// during actual rendering/events — the typeof guard keeps the server safe.
const getOrigin = () =>
  typeof window !== "undefined"
    ? window.location.origin
    : "https://zentaras.vercel.app";

export default function DashboardClient({ clerkUser, dbUser, allApps, primaryEmail }) {
  const [username, setUsername]           = useState(dbUser.username ?? "");
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(dbUser.username ?? "");
  const [usernameError, setUsernameError] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [approvalPopup, setApprovalPopup] = useState(null);

  // Safe to call during render — getOrigin() defers the window access
  const publicUrl = (name) => `${getOrigin()}/user/${name}`;

  const handleSaveUsername = async () => {
    setUsernameLoading(true);
    setUsernameError("");
    const res = await fetch("/api/user/username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameInput }),
    });
    const data = await res.json();
    setUsernameLoading(false);
    if (!res.ok) { setUsernameError(data.error); return; }
    setUsername(usernameInput.toLowerCase());
    setEditingUsername(false);
    setUsernameSuccess(true);
    setTimeout(() => setUsernameSuccess(false), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <Navbar showBackLink={true} showDashboardLink={false} />

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px 80px" }}>

        {/* ── Hero card ── */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "22px 24px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {clerkUser.imageUrl && (
              <img src={clerkUser.imageUrl} alt="avatar"
                style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid var(--border)", flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>
                Hello, {clerkUser.firstName ?? "there"} 👋
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{primaryEmail}</p>
            </div>
            <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
              {[
                { val: allApps.length,                                        label: "Applied" },
                { val: allApps.filter(a => a.status === "Shortlisted").length, label: "Shortlisted" },
                { val: allApps.filter(a => a.status === "Pending").length,     label: "Pending" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Profile card ── */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 20,
        }}>
          <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
            Profile
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px 24px", marginBottom: 16 }}>
            {[["Member Since", new Date(dbUser.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })]].map(([label, value]) => (
              <div key={label} style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)", width: 90, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Username */}
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editingUsername ? 10 : 0 }}>
              <div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>Public Username</p>
                {!editingUsername && (
                  <p style={{ fontSize: 14, fontWeight: 600, color: username ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {username ? `@${username}` : "Not set"}
                  </p>
                )}
                {username && !editingUsername && (
                  <a href={publicUrl(username)} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 11, color: "var(--accent)", marginTop: 2, display: "inline-block", textDecoration: "none" }}>
                    {publicUrl(username)}
                  </a>
                )}
              </div>
              {!editingUsername && (
                <button
                  onClick={() => { setEditingUsername(true); setUsernameInput(username); setUsernameError(""); }}
                  style={{
                    padding: "5px 12px", background: "var(--accent-dim)", color: "var(--accent)",
                    border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)",
                    fontSize: 12, cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 600,
                  }}
                >{username ? "Edit" : "Set Username"}</button>
              )}
            </div>

            {editingUsername && (
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>@</span>
                  <input
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    placeholder="yourname"
                    style={{
                      flex: 1, background: "var(--bg-card)", border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)", padding: "7px 10px", color: "var(--text-primary)",
                      fontSize: 13, outline: "none", fontFamily: "DM Sans, sans-serif",
                    }}
                  />
                  <button onClick={handleSaveUsername} disabled={usernameLoading} style={{
                    padding: "7px 14px", background: "var(--accent)", color: "#fff", border: "none",
                    borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer", fontWeight: 600,
                    fontFamily: "DM Sans, sans-serif",
                  }}>{usernameLoading ? "Saving…" : "Save"}</button>
                  <button onClick={() => setEditingUsername(false)} style={{
                    padding: "7px 10px", background: "transparent", color: "var(--text-muted)",
                    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                    fontSize: 12, cursor: "pointer",
                  }}>Cancel</button>
                </div>
                {usernameError && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 5 }}>{usernameError}</p>}
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>3–30 chars, letters/numbers/underscore/hyphen only.</p>
              </div>
            )}

            {usernameSuccess && (
              <p style={{ fontSize: 12, color: "var(--green)", marginTop: 6 }}>
                ✓ Username updated! Share:{" "}
                <a href={publicUrl(username)} target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--green)", fontWeight: 700 }}>
                  {publicUrl(username)}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* ── Applications ── */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>
              My Applications
            </p>
            <a href="/" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
              + Apply to a project
            </a>
          </div>

          {allApps.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 0", border: "1px dashed var(--border)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>No applications yet</p>
              <a href="/" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Browse open projects →</a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {allApps.map((app) => {
                const sc = statusStyle(app.status);
                return (
                  <div key={app.id} style={{
                    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                    padding: "14px 16px", background: "var(--bg)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {/* Icon */}
                      <div style={{
                        width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                        background: `${app.color}18`, border: `1px solid ${app.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
                      }}>{app.icon}</div>

                      {/* Name + date + status badge */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>
                          {app.projectName}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5 }}>
                          Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <span style={{
                          display: "inline-block", fontSize: 10, fontWeight: 700,
                          padding: "2px 10px", borderRadius: 20,
                          background: sc.bg, color: sc.color,
                        }}>
                          {app.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div style={{ flexShrink: 0 }}>
                        {app.status === "Shortlisted" && (
                          <button
                            onClick={() => setApprovalPopup(app)}
                            style={{
                              fontSize: 11, fontWeight: 700, padding: "5px 13px", borderRadius: 6,
                              background: "var(--green-dim)", color: "var(--green)",
                              border: "1px solid rgba(34,160,107,0.35)",
                              cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                            }}
                          >
                            Show Details →
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Rejection note */}
                    {app.status === "Rejected" && app.adminNote && (
                      <div style={{
                        marginTop: 10, background: "var(--red-dim)",
                        border: "1px solid rgba(227,73,53,0.25)", borderRadius: "var(--radius-sm)",
                        padding: "10px 12px",
                      }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                          Feedback from Admin
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{app.adminNote}</p>
                        <a href="/" style={{ display: "inline-block", marginTop: 8, fontSize: 11, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                          Improve & Reapply →
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Footer />
      </main>

      {/* ── Shortlisted Detail Popup ── */}
      {approvalPopup && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }} onClick={() => setApprovalPopup(null)}>
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border-light)",
            borderRadius: 12, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }} onClick={e => e.stopPropagation()}>

            <div style={{ padding: "22px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 28 }}>{approvalPopup.icon}</span>
                  <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>
                    You're Shortlisted! 🎉
                  </h2>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{approvalPopup.projectName}</p>
              </div>
              <button onClick={() => setApprovalPopup(null)} style={{
                background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 6,
                width: 28, height: 28, cursor: "pointer", color: "var(--text-muted)", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>✕</button>
            </div>

            <div style={{ padding: "16px 24px 24px" }}>
              <div style={{
                background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)",
                borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: 18,
                fontSize: 12, color: "var(--green)",
              }}>
                🎊 Congratulations! Your application has been shortlisted.
              </div>

              {/* Internship details */}
              {PROJECT_DETAILS[approvalPopup.projectName] && (() => {
                const d = PROJECT_DETAILS[approvalPopup.projectName];
                return (
                  <>
                    <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                      Internship Details
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", marginBottom: 14 }}>
                      {[["Duration", d.duration], ["Mode", d.mode], ["Type", d.type]].map(([l, v]) => (
                        <div key={l} style={{ padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                          <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{l}</p>
                          <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Stack</p>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                      {d.stack.map(s => (
                        <span key={s} style={{
                          fontSize: 10, padding: "2px 8px", borderRadius: 3,
                          background: "var(--accent-dim)", border: "1px solid var(--accent-border)", color: "var(--accent)", fontWeight: 700,
                        }}>{s}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>What You'll Build</p>
                    <ul style={{ listStyle: "none", padding: 0, marginBottom: 0 }}>
                      {d.deliverables.map(dl => (
                        <li key={dl} style={{ fontSize: 12, color: "var(--text-secondary)", padding: "5px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 6 }}>
                          <span style={{ color: "var(--green)", flexShrink: 0 }}>✓</span> {dl}
                        </li>
                      ))}
                    </ul>
                  </>
                );
              })()}

              {/* Application details */}
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, margin: "16px 0 10px" }}>
                Your Application Details
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
                {[
                  ["Full Name",    approvalPopup.fullName],
                  ["Email",        approvalPopup.email],
                  ["College",      approvalPopup.college],
                  ["Branch",       approvalPopup.branch],
                  ["Graduation",   approvalPopup.graduationYear],
                  ["Availability", approvalPopup.availability],
                  ["Start Date",   approvalPopup.startDate],
                ].map(([l, v]) => (
                  <div key={l} style={{ padding: "5px 0", borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{l}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>

              {approvalPopup.adminNote && (
                <div style={{
                  marginTop: 16, background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)",
                  borderRadius: "var(--radius-sm)", padding: "10px 14px",
                }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Note from Admin</p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{approvalPopup.adminNote}</p>
                </div>
              )}

              {/* ── Go to Internship Tracker button ── */}
              <a
                href={`/internship?applicantId=${approvalPopup.id}`}
                style={{
                  display: "block", marginTop: 20, padding: "12px 0", textAlign: "center",
                  background: "var(--accent)", color: "#fff",
                  borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 700,
                  textDecoration: "none", fontFamily: "Syne, sans-serif",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                🚀 Go to Internship Tracker →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}