"use client";

import { useState, useEffect, useCallback } from "react";
import { UserButton } from "@clerk/nextjs";

const PROJECT_FILTERS = [
  { key: "all", label: "All Projects" },
  { key: "ai-resume-screener", label: "AI Resume Screener" },
  { key: "ecommerce-analytics", label: "E-Commerce Analytics" },
  { key: "sentiment-dashboard", label: "Sentiment Dashboard" },
];

const STATUS_FILTERS = ["All", "Pending", "Shortlisted", "Rejected"];

function statusStyle(s) {
  if (s === "Shortlisted") return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Rejected") return { bg: "#fee2e2", color: "#dc2626" };
  return { bg: "#eff6ff", color: "#2563eb" };
}

export default function AdminDashboardClient() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // detail modal
  const [reviewModal, setReviewModal] = useState(null); // { applicant, action }
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/applicants");
    const data = await res.json();
    setApplicants(data.applicants ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchApplicants(); }, [fetchApplicants]);

  const filtered = applicants.filter(a => {
    if (projectFilter !== "all" && a.projectKey !== projectFilter) return false;
    if (statusFilter !== "All" && a.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.fullName?.toLowerCase().includes(q) ||
             a.email?.toLowerCase().includes(q) ||
             a.college?.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    total: applicants.length,
    pending: applicants.filter(a => a.status === "Pending").length,
    shortlisted: applicants.filter(a => a.status === "Shortlisted").length,
    rejected: applicants.filter(a => a.status === "Rejected").length,
  };

  const handleReview = async () => {
    if (!reviewModal) return;
    setSubmitting(true);
    await fetch("/api/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: reviewModal.applicant.id,
        table: reviewModal.applicant.projectKey,
        status: reviewModal.action === "approve" ? "Shortlisted" : "Rejected",
        adminNote: note,
      }),
    });
    setSubmitting(false);
    setReviewModal(null);
    setNote("");
    fetchApplicants();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "var(--sidebar-bg)", borderBottom: "1px solid var(--sidebar-border)",
        padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "var(--sidebar-logo-color)" }}>
            Zen<span style={{ color: "var(--sidebar-logo-accent)" }}>taras</span>
          </span>
          <span style={{
            fontSize: 10, background: "var(--red-dim)", border: "1px solid rgba(227,73,53,0.3)",
            color: "var(--red)", padding: "2px 8px", borderRadius: 3, fontWeight: 700, letterSpacing: "0.5px",
          }}>ADMIN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/dashboard" style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>User Dashboard</a>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
            Applications Dashboard
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Review, approve, and reject internship applicants</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total", val: counts.total, color: "var(--text-primary)" },
            { label: "Pending", val: counts.pending, color: "var(--blue)" },
            { label: "Shortlisted", val: counts.shortlisted, color: "var(--green)" },
            { label: "Rejected", val: counts.rejected, color: "var(--red)" },
          ].map(s => (
            <div key={s.label} style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "16px 18px",
            }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <input
              placeholder="Search name, email, college…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, minWidth: 200, background: "var(--bg)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)", padding: "7px 12px", color: "var(--text-primary)",
                fontSize: 13, outline: "none", fontFamily: "DM Sans, sans-serif",
              }}
            />
            {/* Project filter */}
            <select
              value={projectFilter}
              onChange={e => setProjectFilter(e.target.value)}
              style={{
                background: "var(--bg)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)", padding: "7px 12px", color: "var(--text-secondary)",
                fontSize: 12, outline: "none", cursor: "pointer",
              }}
            >
              {PROJECT_FILTERS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
            {/* Status filter */}
            <div style={{ display: "flex", gap: 4 }}>
              {STATUS_FILTERS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: "5px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif", fontWeight: statusFilter === s ? 700 : 400,
                    border: statusFilter === s ? "1px solid var(--accent-border)" : "1px solid var(--border)",
                    background: statusFilter === s ? "var(--accent-dim)" : "var(--bg)",
                    color: statusFilter === s ? "var(--accent)" : "var(--text-muted)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", overflow: "hidden",
        }}>
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>No applicants found.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead style={{ background: "var(--bg-hover)" }}>
                  <tr>
                    {["Applicant", "Project", "College", "Applied", "Status", "Actions"].map(h => (
                      <th key={h} style={{
                        padding: "10px 14px", textAlign: "left",
                        fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700,
                        color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px",
                        borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(app => {
                    const sc = statusStyle(app.status);
                    return (
                      <tr key={app.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "12px 14px" }}>
                          <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{app.fullName}</p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{app.email}</p>
                        </td>
                        <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>{app.projectName}</td>
                        <td style={{ padding: "12px 14px", color: "var(--text-secondary)", fontSize: 12 }}>{app.college}</td>
                        <td style={{ padding: "12px 14px", color: "var(--text-muted)", fontSize: 12, whiteSpace: "nowrap" }}>
                          {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                            background: sc.bg, color: sc.color,
                          }}>{app.status}</span>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={() => setSelected(app)}
                              style={{
                                padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11,
                                cursor: "pointer", background: "var(--bg-hover)", color: "var(--text-secondary)",
                                border: "1px solid var(--border)", fontFamily: "DM Sans, sans-serif",
                              }}
                            >View</button>
                            {app.status !== "Shortlisted" && (
                              <button
                                onClick={() => { setReviewModal({ applicant: app, action: "approve" }); setNote(""); }}
                                style={{
                                  padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11,
                                  cursor: "pointer", background: "var(--green-dim)", color: "var(--green)",
                                  border: "1px solid rgba(34,160,107,0.3)", fontFamily: "DM Sans, sans-serif", fontWeight: 600,
                                }}
                              >✓ Approve</button>
                            )}
                            {app.status !== "Rejected" && (
                              <button
                                onClick={() => { setReviewModal({ applicant: app, action: "reject" }); setNote(""); }}
                                style={{
                                  padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11,
                                  cursor: "pointer", background: "var(--red-dim)", color: "var(--red)",
                                  border: "1px solid rgba(227,73,53,0.25)", fontFamily: "DM Sans, sans-serif", fontWeight: 600,
                                }}
                              >✕ Reject</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selected && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }} onClick={() => setSelected(null)}>
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border-light)",
            borderRadius: 10, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                  {selected.fullName}
                </h2>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.projectName}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 6,
                width: 28, height: 28, cursor: "pointer", color: "var(--text-muted)", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>
            <div style={{ padding: "16px 24px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", marginBottom: 16 }}>
                {[
                  ["Email", selected.email],
                  ["Phone", selected.phone || "—"],
                  ["College", selected.college],
                  ["Branch", selected.branch],
                  ["Graduation", selected.graduationYear],
                  ["CGPA", selected.cgpa || "—"],
                  ["Availability", selected.availability],
                  ["Start Date", selected.startDate],
                ].map(([l, v]) => (
                  <div key={l} style={{ padding: "7px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", width: 90, flexShrink: 0 }}>{l}</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v}</span>
                  </div>
                ))}
              </div>

              {[
                ["Tools Known", selected.toolsKnown],
                ["Why Interested", selected.whyInterested],
                ["Prior Experience", selected.priorExperience],
                ...(selected.nlpExperience ? [["NLP Experience", selected.nlpExperience]] : []),
              ].map(([l, v]) => (
                <div key={l} style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{l}</p>
                  <div style={{
                    fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7,
                    background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)", padding: "10px 12px",
                  }}>{v}</div>
                </div>
              ))}

              {selected.adminNote && (
                <div style={{
                  background: selected.status === "Rejected" ? "var(--red-dim)" : "var(--green-dim)",
                  border: `1px solid ${selected.status === "Rejected" ? "rgba(227,73,53,0.3)" : "rgba(34,160,107,0.3)"}`,
                  borderRadius: "var(--radius-sm)", padding: "10px 14px", marginTop: 12,
                }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, color: selected.status === "Rejected" ? "var(--red)" : "var(--green)" }}>
                    Admin Note
                  </p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{selected.adminNote}</p>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                {selected.resumeLink && (
                  <a href={selected.resumeLink} target="_blank" rel="noopener noreferrer" style={{
                    padding: "7px 14px", background: "var(--accent-dim)", color: "var(--accent)",
                    border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)",
                    fontSize: 12, textDecoration: "none", fontWeight: 600,
                  }}>📄 Resume</a>
                )}
                {selected.linkedinUrl && (
                  <a href={selected.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{
                    padding: "7px 14px", background: "var(--bg-hover)", color: "var(--text-secondary)",
                    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                    fontSize: 12, textDecoration: "none",
                  }}>LinkedIn</a>
                )}
                {selected.githubUrl && (
                  <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer" style={{
                    padding: "7px 14px", background: "var(--bg-hover)", color: "var(--text-secondary)",
                    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                    fontSize: 12, textDecoration: "none",
                  }}>GitHub</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }} onClick={() => setReviewModal(null)}>
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border-light)",
            borderRadius: 10, width: "100%", maxWidth: 440,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "20px 24px 0" }}>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
                {reviewModal.action === "approve" ? "✓ Approve Applicant" : "✕ Reject Applicant"}
              </h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {reviewModal.applicant.fullName} · {reviewModal.applicant.projectName}
              </p>
            </div>
            <div style={{ padding: "16px 24px 24px" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {reviewModal.action === "reject" ? "Rejection Reason (required)" : "Note for applicant (optional)"}
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder={reviewModal.action === "reject"
                  ? "e.g. Your GitHub profile lacks project examples. Please add 2–3 relevant projects and reapply."
                  : "e.g. Great background! We'll reach out with next steps shortly."}
                rows={4}
                style={{
                  width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)", padding: "10px 12px", color: "var(--text-primary)",
                  fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical",
                  lineHeight: 1.6,
                }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button
                  onClick={() => setReviewModal(null)}
                  style={{
                    flex: 1, padding: "9px 0", background: "transparent", color: "var(--text-secondary)",
                    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                    fontSize: 13, cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                  }}
                >Cancel</button>
                <button
                  onClick={handleReview}
                  disabled={submitting || (reviewModal.action === "reject" && !note.trim())}
                  style={{
                    flex: 2, padding: "9px 0",
                    background: reviewModal.action === "approve" ? "var(--green)" : "var(--red)",
                    color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
                    fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.7 : 1,
                    fontFamily: "Syne, sans-serif",
                  }}
                >
                  {submitting ? "Saving…" : reviewModal.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                </button>
              </div>
              {reviewModal.action === "reject" && !note.trim() && (
                <p style={{ fontSize: 11, color: "var(--red)", marginTop: 6 }}>A rejection reason is required so the user can improve.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}