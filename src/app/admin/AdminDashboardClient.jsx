// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { UserButton } from "@clerk/nextjs";

// const PROJECT_FILTERS = [
//   { key: "all", label: "All Projects" },
//   { key: "ai-resume-screener", label: "AI Resume Screener" },
//   { key: "ecommerce-analytics", label: "E-Commerce Analytics" },
//   { key: "sentiment-dashboard", label: "Sentiment Dashboard" },
// ];

// const STATUS_FILTERS = ["All", "Pending", "Shortlisted", "Rejected"];

// function statusStyle(s) {
//   if (s === "Shortlisted") return { bg: "#dcfce7", color: "#16a34a" };
//   if (s === "Rejected") return { bg: "#fee2e2", color: "#dc2626" };
//   return { bg: "#eff6ff", color: "#2563eb" };
// }

// export default function AdminDashboardClient() {
//   const [applicants, setApplicants] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [projectFilter, setProjectFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState(null); // detail modal
//   const [reviewModal, setReviewModal] = useState(null); // { applicant, action }
//   const [note, setNote] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const fetchApplicants = useCallback(async () => {
//     setLoading(true);
//     const res = await fetch("/api/admin/applicants");
//     const data = await res.json();
//     setApplicants(data.applicants ?? []);
//     setLoading(false);
//   }, []);

//   useEffect(() => { fetchApplicants(); }, [fetchApplicants]);

//   const filtered = applicants.filter(a => {
//     if (projectFilter !== "all" && a.projectKey !== projectFilter) return false;
//     if (statusFilter !== "All" && a.status !== statusFilter) return false;
//     if (search) {
//       const q = search.toLowerCase();
//       return a.fullName?.toLowerCase().includes(q) ||
//              a.email?.toLowerCase().includes(q) ||
//              a.college?.toLowerCase().includes(q);
//     }
//     return true;
//   });

//   const counts = {
//     total: applicants.length,
//     pending: applicants.filter(a => a.status === "Pending").length,
//     shortlisted: applicants.filter(a => a.status === "Shortlisted").length,
//     rejected: applicants.filter(a => a.status === "Rejected").length,
//   };

//   const handleReview = async () => {
//     if (!reviewModal) return;
//     setSubmitting(true);
//     await fetch("/api/admin/review", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         id: reviewModal.applicant.id,
//         table: reviewModal.applicant.projectKey,
//         status: reviewModal.action === "approve" ? "Shortlisted" : "Rejected",
//         adminNote: note,
//       }),
//     });
//     setSubmitting(false);
//     setReviewModal(null);
//     setNote("");
//     fetchApplicants();
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
//       {/* Navbar */}
//       <nav style={{
//         position: "sticky", top: 0, zIndex: 40,
//         background: "var(--sidebar-bg)", borderBottom: "1px solid var(--sidebar-border)",
//         padding: "0 24px", height: 56,
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "var(--sidebar-logo-color)" }}>
//             Zen<span style={{ color: "var(--sidebar-logo-accent)" }}>taras</span>
//           </span>
//           <span style={{
//             fontSize: 10, background: "var(--red-dim)", border: "1px solid rgba(227,73,53,0.3)",
//             color: "var(--red)", padding: "2px 8px", borderRadius: 3, fontWeight: 700, letterSpacing: "0.5px",
//           }}>ADMIN</span>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <UserButton afterSignOutUrl="/" />
//         </div>
//       </nav>

//       <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 80px" }}>
//         {/* Header */}
//         <div style={{ marginBottom: 24 }}>
//           <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
//             Applications Dashboard
//           </h1>
//           <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Review, approve, and reject internship applicants</p>
//         </div>

//         {/* Stats */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
//           {[
//             { label: "Total", val: counts.total, color: "var(--text-primary)" },
//             { label: "Pending", val: counts.pending, color: "var(--blue)" },
//             { label: "Shortlisted", val: counts.shortlisted, color: "var(--green)" },
//             { label: "Rejected", val: counts.rejected, color: "var(--red)" },
//           ].map(s => (
//             <div key={s.label} style={{
//               background: "var(--bg-card)", border: "1px solid var(--border)",
//               borderRadius: "var(--radius)", padding: "16px 18px",
//             }}>
//               <div style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
//               <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Filters */}
//         <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 20px", marginBottom: 16 }}>
//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
//             {/* Search */}
//             <input
//               placeholder="Search name, email, college…"
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               style={{
//                 flex: 1, minWidth: 200, background: "var(--bg)", border: "1px solid var(--border)",
//                 borderRadius: "var(--radius-sm)", padding: "7px 12px", color: "var(--text-primary)",
//                 fontSize: 13, outline: "none", fontFamily: "DM Sans, sans-serif",
//               }}
//             />
//             {/* Project filter */}
//             <select
//               value={projectFilter}
//               onChange={e => setProjectFilter(e.target.value)}
//               style={{
//                 background: "var(--bg)", border: "1px solid var(--border)",
//                 borderRadius: "var(--radius-sm)", padding: "7px 12px", color: "var(--text-secondary)",
//                 fontSize: 12, outline: "none", cursor: "pointer",
//               }}
//             >
//               {PROJECT_FILTERS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
//             </select>
//             {/* Status filter */}
//             <div style={{ display: "flex", gap: 4 }}>
//               {STATUS_FILTERS.map(s => (
//                 <button
//                   key={s}
//                   onClick={() => setStatusFilter(s)}
//                   style={{
//                     padding: "5px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer",
//                     fontFamily: "DM Sans, sans-serif", fontWeight: statusFilter === s ? 700 : 400,
//                     border: statusFilter === s ? "1px solid var(--accent-border)" : "1px solid var(--border)",
//                     background: statusFilter === s ? "var(--accent-dim)" : "var(--bg)",
//                     color: statusFilter === s ? "var(--accent)" : "var(--text-muted)",
//                   }}
//                 >
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div style={{
//           background: "var(--bg-card)", border: "1px solid var(--border)",
//           borderRadius: "var(--radius)", overflow: "hidden",
//         }}>
//           {loading ? (
//             <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
//           ) : filtered.length === 0 ? (
//             <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>No applicants found.</div>
//           ) : (
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//                 <thead style={{ background: "var(--bg-hover)" }}>
//                   <tr>
//                     {["Applicant", "Project", "College", "Applied", "Status", "Actions"].map(h => (
//                       <th key={h} style={{
//                         padding: "10px 14px", textAlign: "left",
//                         fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700,
//                         color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px",
//                         borderBottom: "1px solid var(--border)", whiteSpace: "nowrap",
//                       }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map(app => {
//                     const sc = statusStyle(app.status);
//                     return (
//                       <tr key={app.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
//                         onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
//                         onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
//                         <td style={{ padding: "12px 14px" }}>
//                           <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{app.fullName}</p>
//                           <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{app.email}</p>
//                         </td>
//                         <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>{app.projectName}</td>
//                         <td style={{ padding: "12px 14px", color: "var(--text-secondary)", fontSize: 12 }}>{app.college}</td>
//                         <td style={{ padding: "12px 14px", color: "var(--text-muted)", fontSize: 12, whiteSpace: "nowrap" }}>
//                           {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
//                         </td>
//                         <td style={{ padding: "12px 14px" }}>
//                           <span style={{
//                             fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
//                             background: sc.bg, color: sc.color,
//                           }}>{app.status}</span>
//                         </td>
//                         <td style={{ padding: "12px 14px" }}>
//                           <div style={{ display: "flex", gap: 6 }}>
//                             <button
//                               onClick={() => setSelected(app)}
//                               style={{
//                                 padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11,
//                                 cursor: "pointer", background: "var(--bg-hover)", color: "var(--text-secondary)",
//                                 border: "1px solid var(--border)", fontFamily: "DM Sans, sans-serif",
//                               }}
//                             >View</button>
//                             {app.status !== "Shortlisted" && (
//                               <button
//                                 onClick={() => { setReviewModal({ applicant: app, action: "approve" }); setNote(""); }}
//                                 style={{
//                                   padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11,
//                                   cursor: "pointer", background: "var(--green-dim)", color: "var(--green)",
//                                   border: "1px solid rgba(34,160,107,0.3)", fontFamily: "DM Sans, sans-serif", fontWeight: 600,
//                                 }}
//                               >✓ Approve</button>
//                             )}
//                             {app.status !== "Rejected" && (
//                               <button
//                                 onClick={() => { setReviewModal({ applicant: app, action: "reject" }); setNote(""); }}
//                                 style={{
//                                   padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11,
//                                   cursor: "pointer", background: "var(--red-dim)", color: "var(--red)",
//                                   border: "1px solid rgba(227,73,53,0.25)", fontFamily: "DM Sans, sans-serif", fontWeight: 600,
//                                 }}
//                               >✕ Reject</button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Detail Modal */}
//       {selected && (
//         <div style={{
//           position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
//           zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
//         }} onClick={() => setSelected(null)}>
//           <div style={{
//             background: "var(--bg-card)", border: "1px solid var(--border-light)",
//             borderRadius: 10, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto",
//             boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
//           }} onClick={e => e.stopPropagation()}>
//             <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//               <div>
//                 <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
//                   {selected.fullName}
//                 </h2>
//                 <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.projectName}</p>
//               </div>
//               <button onClick={() => setSelected(null)} style={{
//                 background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 6,
//                 width: 28, height: 28, cursor: "pointer", color: "var(--text-muted)", fontSize: 14,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//               }}>✕</button>
//             </div>
//             <div style={{ padding: "16px 24px 24px" }}>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", marginBottom: 16 }}>
//                 {[
//                   ["Email", selected.email],
//                   ["Phone", selected.phone || "—"],
//                   ["College", selected.college],
//                   ["Branch", selected.branch],
//                   ["Graduation", selected.graduationYear],
//                   ["CGPA", selected.cgpa || "—"],
//                   ["Availability", selected.availability],
//                   ["Start Date", selected.startDate],
//                 ].map(([l, v]) => (
//                   <div key={l} style={{ padding: "7px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 8 }}>
//                     <span style={{ fontSize: 11, color: "var(--text-muted)", width: 90, flexShrink: 0 }}>{l}</span>
//                     <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v}</span>
//                   </div>
//                 ))}
//               </div>

//               {[
//                 ["Tools Known", selected.toolsKnown],
//                 ["Why Interested", selected.whyInterested],
//                 ["Prior Experience", selected.priorExperience],
//                 ...(selected.nlpExperience ? [["NLP Experience", selected.nlpExperience]] : []),
//               ].map(([l, v]) => (
//                 <div key={l} style={{ marginBottom: 12 }}>
//                   <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{l}</p>
//                   <div style={{
//                     fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7,
//                     background: "var(--bg)", border: "1px solid var(--border)",
//                     borderRadius: "var(--radius-sm)", padding: "10px 12px",
//                   }}>{v}</div>
//                 </div>
//               ))}

//               {selected.adminNote && (
//                 <div style={{
//                   background: selected.status === "Rejected" ? "var(--red-dim)" : "var(--green-dim)",
//                   border: `1px solid ${selected.status === "Rejected" ? "rgba(227,73,53,0.3)" : "rgba(34,160,107,0.3)"}`,
//                   borderRadius: "var(--radius-sm)", padding: "10px 14px", marginTop: 12,
//                 }}>
//                   <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, color: selected.status === "Rejected" ? "var(--red)" : "var(--green)" }}>
//                     Admin Note
//                   </p>
//                   <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{selected.adminNote}</p>
//                 </div>
//               )}

//               <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
//                 {selected.resumeLink && (
//                   <a href={selected.resumeLink} target="_blank" rel="noopener noreferrer" style={{
//                     padding: "7px 14px", background: "var(--accent-dim)", color: "var(--accent)",
//                     border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)",
//                     fontSize: 12, textDecoration: "none", fontWeight: 600,
//                   }}>📄 Resume</a>
//                 )}
//                 {selected.linkedinUrl && (
//                   <a href={selected.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{
//                     padding: "7px 14px", background: "var(--bg-hover)", color: "var(--text-secondary)",
//                     border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
//                     fontSize: 12, textDecoration: "none",
//                   }}>LinkedIn</a>
//                 )}
//                 {selected.githubUrl && (
//                   <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer" style={{
//                     padding: "7px 14px", background: "var(--bg-hover)", color: "var(--text-secondary)",
//                     border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
//                     fontSize: 12, textDecoration: "none",
//                   }}>GitHub</a>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Review Modal */}
//       {reviewModal && (
//         <div style={{
//           position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
//           zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
//         }} onClick={() => setReviewModal(null)}>
//           <div style={{
//             background: "var(--bg-card)", border: "1px solid var(--border-light)",
//             borderRadius: 10, width: "100%", maxWidth: 440,
//             boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
//           }} onClick={e => e.stopPropagation()}>
//             <div style={{ padding: "20px 24px 0" }}>
//               <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
//                 {reviewModal.action === "approve" ? "✓ Approve Applicant" : "✕ Reject Applicant"}
//               </h2>
//               <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
//                 {reviewModal.applicant.fullName} · {reviewModal.applicant.projectName}
//               </p>
//             </div>
//             <div style={{ padding: "16px 24px 24px" }}>
//               <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                 {reviewModal.action === "reject" ? "Rejection Reason (required)" : "Note for applicant (optional)"}
//               </label>
//               <textarea
//                 value={note}
//                 onChange={e => setNote(e.target.value)}
//                 placeholder={reviewModal.action === "reject"
//                   ? "e.g. Your GitHub profile lacks project examples. Please add 2–3 relevant projects and reapply."
//                   : "e.g. Great background! We'll reach out with next steps shortly."}
//                 rows={4}
//                 style={{
//                   width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
//                   borderRadius: "var(--radius-sm)", padding: "10px 12px", color: "var(--text-primary)",
//                   fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical",
//                   lineHeight: 1.6,
//                 }}
//               />
//               <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
//                 <button
//                   onClick={() => setReviewModal(null)}
//                   style={{
//                     flex: 1, padding: "9px 0", background: "transparent", color: "var(--text-secondary)",
//                     border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
//                     fontSize: 13, cursor: "pointer", fontFamily: "DM Sans, sans-serif",
//                   }}
//                 >Cancel</button>
//                 <button
//                   onClick={handleReview}
//                   disabled={submitting || (reviewModal.action === "reject" && !note.trim())}
//                   style={{
//                     flex: 2, padding: "9px 0",
//                     background: reviewModal.action === "approve" ? "var(--green)" : "var(--red)",
//                     color: "#fff", border: "none", borderRadius: "var(--radius-sm)",
//                     fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.7 : 1,
//                     fontFamily: "Syne, sans-serif",
//                   }}
//                 >
//                   {submitting ? "Saving…" : reviewModal.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
//                 </button>
//               </div>
//               {reviewModal.action === "reject" && !note.trim() && (
//                 <p style={{ fontSize: 11, color: "var(--red)", marginTop: 6 }}>A rejection reason is required so the user can improve.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

// app/admin/AdminDashboardClient.jsx
import { useState, useEffect, useCallback } from "react";
import { UserButton } from "@clerk/nextjs";
import { INTERNSHIP_STEPS, STEP_STATUS_COLORS } from "../../lib/internshipSteps";

const PROJECT_FILTERS = [
  { key: "all",                 label: "All Projects" },
  { key: "ai-resume-screener",  label: "AI Resume Screener" },
  { key: "ecommerce-analytics", label: "E-Commerce Analytics" },
  { key: "sentiment-dashboard", label: "Sentiment Dashboard" },
];
const STATUS_FILTERS = ["All", "Pending", "Shortlisted", "Rejected"];

const PROJECT_META = {
  "ai-resume-screener":  { icon: "🤖", color: "#6366f1" },
  "ecommerce-analytics": { icon: "📊", color: "#22a06b" },
  "sentiment-dashboard": { icon: "🧠", color: "#e2b203" },
};

function appStatusStyle(s) {
  if (s === "Shortlisted") return { bg: "var(--green-dim)", color: "var(--green)" };
  if (s === "Rejected")    return { bg: "var(--red-dim)",   color: "var(--red)" };
  return { bg: "var(--blue-dim)", color: "var(--blue)" };
}

// ─── Step Pill ────────────────────────────────────────────────────────────────
function StepPill({ status }) {
  const s = STEP_STATUS_COLORS[status] ?? STEP_STATUS_COLORS.pending;
  const labels = {
    pending:   "Not Submitted",
    submitted: "Needs Review ⚡",
    approved:  "Approved ✓",
    rejected:  "Needs Revision",
  };
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap",
    }}>
      {labels[status] ?? status}
    </span>
  );
}

// ─── Single step row inside the track modal ───────────────────────────────────
function StepRow({ stepConfig, stepData, isCurrentStep, isLocked, canUnlock, trackId, onAction, onUnlock, unlocking }) {
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(stepData?.status === "submitted");
  const status = stepData?.status ?? "pending";

  return (
    <div style={{
      border: `1px solid ${stepData?.status === "submitted" ? "rgba(226,178,3,0.5)" : "var(--border)"}`,
      borderRadius: "var(--radius-sm)", marginBottom: 8, overflow: "hidden",
      opacity: isLocked ? 0.4 : 1,
      transition: "opacity 0.2s",
    }}>
      {/* ── Header row ── */}
      <div
        onClick={() => !isLocked && setOpen(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 16px",
          cursor: isLocked ? "default" : "pointer",
          background: stepData?.status === "submitted" ? "rgba(226,178,3,0.05)" : "transparent",
        }}
      >
        {/* Circle */}
        <div style={{
          width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800,
          background:
            status === "approved"  ? "var(--green)"  :
            status === "submitted" ? "var(--yellow)"  :
            status === "rejected"  ? "var(--red)"    :
            isCurrentStep          ? "var(--accent)"  : "var(--bg-hover)",
          color:
            ["approved","submitted","rejected"].includes(status) || isCurrentStep
              ? "#fff" : "var(--text-muted)",
        }}>
          {status === "approved" ? "✓" : isLocked ? "🔒" : stepConfig.number}
        </div>

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
            Step {stepConfig.number} — {stepConfig.title}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {stepConfig.description}
          </p>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <StepPill status={status} />

          {/* ── UNLOCK BUTTON — shown when this is exactly currentStep+1 ── */}
          {canUnlock && (
            <button
              onClick={e => {
                e.stopPropagation();
                onUnlock(trackId, stepConfig.number);
              }}
              disabled={unlocking}
              style={{
                padding: "5px 14px",
                background: "var(--accent)", color: "#fff",
                border: "none", borderRadius: "var(--radius-sm)",
                fontSize: 11, fontWeight: 700,
                cursor: unlocking ? "not-allowed" : "pointer",
                fontFamily: "DM Sans, sans-serif",
                opacity: unlocking ? 0.6 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {unlocking ? "Unlocking…" : `🔓 Unlock Step ${stepConfig.number}`}
            </button>
          )}

          {!isLocked && (
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
              {open ? "▲" : "▼"}
            </span>
          )}
        </div>
      </div>

      {/* ── Expanded body ── */}
      {open && !isLocked && (
        <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>

          {/* No submission yet */}
          {!stepData || status === "pending" ? (
            <p style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
              {isCurrentStep
                ? "⏳ Waiting for intern to submit this step."
                : "Not yet reached."}
            </p>
          ) : (
            <>
              {/* Show submitted data fields */}
              {stepData.data && Object.entries(stepData.data).map(([k, v]) =>
                v ? (
                  <div key={k} style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                      {k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                    </p>
                    {(k.toLowerCase().includes("link") || k.toLowerCase().includes("url")) ? (
                      <a href={v} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: "var(--accent)", wordBreak: "break-all" }}>
                        {v} ↗
                      </a>
                    ) : (
                      <div style={{
                        fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6,
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)", padding: "8px 10px",
                        maxHeight: 120, overflowY: "auto",
                      }}>
                        {v}
                      </div>
                    )}
                  </div>
                ) : null
              )}

              {/* Previous admin note */}
              {stepData.adminNote && (
                <div style={{
                  padding: "8px 12px", marginBottom: 12,
                  background: status === "rejected" ? "var(--red-dim)" : "var(--green-dim)",
                  border: `1px solid ${status === "rejected" ? "rgba(227,73,53,0.3)" : "rgba(34,160,107,0.3)"}`,
                  borderRadius: "var(--radius-sm)",
                }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3, color: status === "rejected" ? "var(--red)" : "var(--green)" }}>
                    Previous Note
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{stepData.adminNote}</p>
                </div>
              )}

              {/* Approve / Reject — only for submitted */}
              {status === "submitted" && (
                <div style={{ marginTop: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 5 }}>
                    Feedback (optional for approve · required for reject)
                  </label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Leave feedback for the intern…"
                    rows={3}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      background: "var(--bg-card)", border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)", padding: "8px 10px",
                      color: "var(--text-primary)", fontSize: 12,
                      fontFamily: "DM Sans, sans-serif", outline: "none",
                      resize: "vertical", lineHeight: 1.5,
                    }}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button
                      onClick={() => { onAction(stepData.id, "approve", note); setOpen(false); }}
                      style={{
                        padding: "7px 20px", background: "var(--green)", color: "#fff",
                        border: "none", borderRadius: "var(--radius-sm)",
                        fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif",
                      }}
                    >✓ Approve Step {stepConfig.number}</button>
                    <button
                      onClick={() => {
                        if (!note.trim()) { alert("Please add a rejection reason first."); return; }
                        onAction(stepData.id, "reject", note);
                        setOpen(false);
                      }}
                      style={{
                        padding: "7px 20px", background: "var(--red-dim)", color: "var(--red)",
                        border: "1px solid rgba(227,73,53,0.3)", borderRadius: "var(--radius-sm)",
                        fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                      }}
                    >✕ Request Revision</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Track Detail Modal ───────────────────────────────────────────────────────
function TrackDetailModal({ track, onClose, onStepAction, onUnlockStep }) {
  const [unlocking, setUnlocking] = useState(false);
  const meta     = PROJECT_META[track.projectKey] ?? { icon: "🎓", color: "#6366f1" };
  const approved = track.steps.filter(s => s.status === "approved").length;
  const progress = Math.round((approved / INTERNSHIP_STEPS.length) * 100);

  const handleUnlock = async (trackId, stepNum) => {
    setUnlocking(true);
    await onUnlockStep(trackId, stepNum);
    setUnlocking(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)",
      zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-light)",
        borderRadius: 12, width: "100%", maxWidth: 700, maxHeight: "90vh",
        overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                background: `${meta.color}18`, border: `1px solid ${meta.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>{meta.icon}</div>
              <div>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>
                  {track.user?.firstName ?? ""} {track.user?.lastName ?? ""}
                </h2>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {track.user?.email} · {track.projectName}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 6,
              width: 28, height: 28, cursor: "pointer", color: "var(--text-muted)", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>✕</button>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
            <div style={{ flex: 1, height: 5, background: "var(--border)", borderRadius: 99 }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: track.isCompleted ? "var(--green)" : "var(--accent)",
                width: `${progress}%`, transition: "width 0.5s",
              }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: track.isCompleted ? "var(--green)" : "var(--accent)", whiteSpace: "nowrap" }}>
              {track.isCompleted ? "✓ Completed" : `Step ${track.currentStep} active · ${progress}%`}
            </span>
          </div>

          {/* Info banner */}
          {!track.isCompleted && (
            <div style={{
              marginTop: 12, padding: "9px 14px",
              background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
              borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--accent)",
            }}>
              <strong>Step {track.currentStep}</strong> is currently active for the intern.
              Approve their submission to auto-advance, or use the <strong>🔓 Unlock</strong> button to manually open the next step.
            </div>
          )}
        </div>

        {/* Steps list */}
        <div style={{ overflowY: "auto", padding: "16px 24px 24px", flex: 1 }}>
          <p style={{
            fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700,
            color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12,
          }}>
            All Steps
          </p>

          {INTERNSHIP_STEPS.map(cfg => {
            const stepData     = track.steps.find(s => s.stepNumber === cfg.number) ?? null;
            const isCurrentStep = cfg.number === track.currentStep;
            const isLocked      = cfg.number > track.currentStep;
            // Unlock button only on the step that's exactly ONE ahead of currentStep
            const canUnlock     = !track.isCompleted && cfg.number === track.currentStep + 1 && cfg.number <= 5;

            return (
              <StepRow
                key={cfg.number}
                stepConfig={cfg}
                stepData={stepData}
                isCurrentStep={isCurrentStep}
                isLocked={isLocked}
                canUnlock={canUnlock}
                trackId={track.id}
                onAction={(stepId, action, note) => onStepAction(stepId, action, note, track.id)}
                onUnlock={handleUnlock}
                unlocking={unlocking}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Internship Tracks Tab ────────────────────────────────────────────────────
function InternshipTracksTab() {
  const [tracks, setTracks]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter]   = useState("all");

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    const url  = projectFilter !== "all" ? `/api/admin/tracks?projectKey=${projectFilter}` : `/api/admin/tracks`;
    const res  = await fetch(url);
    const data = await res.json();
    setTracks(data.tracks ?? []);
    setLoading(false);
  }, [projectFilter]);

  useEffect(() => { fetchTracks(); }, [fetchTracks]);

  const refreshModal = useCallback(async (trackId) => {
    const res  = await fetch(`/api/admin/tracks?trackId=${trackId}`);
    const data = await res.json();
    if (data.track) setSelectedTrack(data.track);
  }, []);

  // Approve or reject a submitted step
  const handleStepAction = async (stepId, action, note, trackId) => {
    await fetch("/api/admin/tracks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stepId, action, adminNote: note }),
    });
    await fetchTracks();
    if (selectedTrack?.id === trackId) await refreshModal(trackId);
  };

  // Manually unlock next step
  const handleUnlockStep = async (trackId, stepNumber) => {
    const res  = await fetch("/api/admin/tracks/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId, stepNumber }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error ?? "Failed to unlock step."); return; }
    await fetchTracks();
    if (selectedTrack?.id === trackId) await refreshModal(trackId);
  };

  const filtered = tracks.filter(t => {
    if (statusFilter === "completed") return t.isCompleted;
    if (statusFilter === "active")    return !t.isCompleted;
    return true;
  });

  const counts = {
    total:         tracks.length,
    active:        tracks.filter(t => !t.isCompleted).length,
    completed:     tracks.filter(t => t.isCompleted).length,
    pendingReview: tracks.reduce((n, t) => n + t.steps.filter(s => s.status === "submitted").length, 0),
  };

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Interns",   val: counts.total,         color: "var(--text-primary)" },
          { label: "Active",          val: counts.active,        color: "var(--accent)" },
          { label: "Completed",       val: counts.completed,     color: "var(--green)" },
          { label: "Awaiting Review", val: counts.pendingReview, color: "var(--yellow)" },
        ].map(s => (
          <div key={s.label} style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: "16px 18px",
          }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", padding: "14px 20px", marginBottom: 16,
        display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
      }}>
        <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} style={{
          background: "var(--bg)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)", padding: "7px 12px",
          color: "var(--text-secondary)", fontSize: 12, outline: "none", cursor: "pointer",
        }}>
          {PROJECT_FILTERS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ key: "all", label: "All" }, { key: "active", label: "Active" }, { key: "completed", label: "Completed" }].map(s => (
            <button key={s.key} onClick={() => setStatusFilter(s.key)} style={{
              padding: "5px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer",
              fontFamily: "DM Sans, sans-serif", fontWeight: statusFilter === s.key ? 700 : 400,
              border: statusFilter === s.key ? "1px solid var(--accent-border)" : "1px solid var(--border)",
              background: statusFilter === s.key ? "var(--accent-dim)" : "var(--bg)",
              color: statusFilter === s.key ? "var(--accent)" : "var(--text-muted)",
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading tracks…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
            <p>No internship tracks yet.</p>
            <p style={{ fontSize: 12, marginTop: 6, color: "var(--text-muted)" }}>
              Tracks are auto-created when you approve an applicant.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead style={{ background: "var(--bg-hover)" }}>
                <tr>
                  {["Intern", "Project", "Step Progress", "Pending Review", "Status", "Actions"].map(h => (
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
                {filtered.map(track => {
                  const meta          = PROJECT_META[track.projectKey] ?? { icon: "🎓", color: "#6366f1" };
                  const approvedCount = track.steps.filter(s => s.status === "approved").length;
                  const pendingCount  = track.steps.filter(s => s.status === "submitted").length;

                  return (
                    <tr key={track.id}
                      style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                          {track.user?.firstName ?? ""} {track.user?.lastName ?? ""}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{track.user?.email}</p>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 15 }}>{meta.icon}</span>
                          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{track.projectName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ display: "flex", gap: 3 }}>
                            {INTERNSHIP_STEPS.map(cfg => {
                              const s      = track.steps.find(st => st.stepNumber === cfg.number);
                              const status = s?.status ?? (cfg.number <= track.currentStep ? "pending" : "locked");
                              return (
                                <div key={cfg.number} title={`Step ${cfg.number}: ${status}`} style={{
                                  width: 11, height: 11, borderRadius: "50%",
                                  background:
                                    status === "approved"  ? "var(--green)"  :
                                    status === "submitted" ? "var(--yellow)" :
                                    status === "rejected"  ? "var(--red)"    :
                                    status === "pending"   ? "var(--accent)" : "var(--border)",
                                }} />
                              );
                            })}
                          </div>
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            {approvedCount}/{INTERNSHIP_STEPS.length}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {pendingCount > 0 ? (
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                            background: "var(--yellow-dim)", color: "var(--yellow)",
                            border: "1px solid rgba(226,178,3,0.35)",
                          }}>
                            {pendingCount} step{pendingCount > 1 ? "s" : ""} waiting
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                          background: track.isCompleted ? "var(--green-dim)" : "var(--accent-dim)",
                          color: track.isCompleted ? "var(--green)" : "var(--accent)",
                          border: `1px solid ${track.isCompleted ? "rgba(34,160,107,0.3)" : "var(--accent-border)"}`,
                        }}>
                          {track.isCompleted ? "✓ Completed" : `Step ${track.currentStep} Active`}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <button
                          onClick={() => setSelectedTrack(track)}
                          style={{
                            padding: "5px 14px", borderRadius: "var(--radius-sm)", fontSize: 11,
                            cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                            background: pendingCount > 0 ? "var(--yellow-dim)" : "var(--bg-hover)",
                            color:      pendingCount > 0 ? "var(--yellow)"     : "var(--text-secondary)",
                            border: `1px solid ${pendingCount > 0 ? "rgba(226,178,3,0.4)" : "var(--border)"}`,
                            fontWeight: pendingCount > 0 ? 700 : 400,
                          }}
                        >
                          {pendingCount > 0 ? "🔔 Review" : "Manage"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedTrack && (
        <TrackDetailModal
          track={selectedTrack}
          onClose={() => setSelectedTrack(null)}
          onStepAction={handleStepAction}
          onUnlockStep={handleUnlockStep}
        />
      )}
    </div>
  );
}

// ─── Applications Tab ─────────────────────────────────────────────────────────
function ApplicationsTab() {
  const [applicants, setApplicants]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [search, setSearch]               = useState("");
  const [selected, setSelected]           = useState(null);
  const [reviewModal, setReviewModal]     = useState(null);
  const [note, setNote]                   = useState("");
  const [submitting, setSubmitting]       = useState(false);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/applicants");
    const data = await res.json();
    setApplicants(data.applicants ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchApplicants(); }, [fetchApplicants]);

  const filtered = applicants.filter(a => {
    if (projectFilter !== "all" && a.projectKey !== projectFilter) return false;
    if (statusFilter !== "All"  && a.status !== statusFilter)      return false;
    if (search) {
      const q = search.toLowerCase();
      return a.fullName?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.college?.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    total:       applicants.length,
    pending:     applicants.filter(a => a.status === "Pending").length,
    shortlisted: applicants.filter(a => a.status === "Shortlisted").length,
    rejected:    applicants.filter(a => a.status === "Rejected").length,
  };

  const handleReview = async () => {
    if (!reviewModal) return;
    setSubmitting(true);
    await fetch("/api/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: reviewModal.applicant.id, table: reviewModal.applicant.projectKey,
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
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total", val: counts.total, color: "var(--text-primary)" },
          { label: "Pending", val: counts.pending, color: "var(--blue)" },
          { label: "Shortlisted", val: counts.shortlisted, color: "var(--green)" },
          { label: "Rejected", val: counts.rejected, color: "var(--red)" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 18px" }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 20px", marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input placeholder="Search name, email, college…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "7px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "DM Sans, sans-serif" }} />
        <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "7px 12px", color: "var(--text-secondary)", fontSize: 12, outline: "none", cursor: "pointer" }}>
          {PROJECT_FILTERS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
        <div style={{ display: "flex", gap: 4 }}>
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "5px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: statusFilter === s ? 700 : 400, border: statusFilter === s ? "1px solid var(--accent-border)" : "1px solid var(--border)", background: statusFilter === s ? "var(--accent-dim)" : "var(--bg)", color: statusFilter === s ? "var(--accent)" : "var(--text-muted)" }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>No applicants found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead style={{ background: "var(--bg-hover)" }}>
                <tr>{["Applicant","Project","College","Applied","Status","Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map(app => {
                  const sc = appStatusStyle(app.status);
                  return (
                    <tr key={app.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 14px" }}><p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{app.fullName}</p><p style={{ fontSize: 11, color: "var(--text-muted)" }}>{app.email}</p></td>
                      <td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>{app.projectName}</td>
                      <td style={{ padding: "12px 14px", color: "var(--text-secondary)", fontSize: 12 }}>{app.college}</td>
                      <td style={{ padding: "12px 14px", color: "var(--text-muted)", fontSize: 12, whiteSpace: "nowrap" }}>{new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td style={{ padding: "12px 14px" }}><span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: sc.bg, color: sc.color }}>{app.status}</span></td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => setSelected(app)} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)", fontFamily: "DM Sans, sans-serif" }}>View</button>
                          {app.status !== "Shortlisted" && <button onClick={() => { setReviewModal({ applicant: app, action: "approve" }); setNote(""); }} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(34,160,107,0.3)", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>✓ Approve</button>}
                          {app.status !== "Rejected" && <button onClick={() => { setReviewModal({ applicant: app, action: "reject" }); setNote(""); }} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(227,73,53,0.25)", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>✕ Reject</button>}
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

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setSelected(null)}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 10, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div><h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{selected.fullName}</h2><p style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.projectName}</p></div>
              <button onClick={() => setSelected(null)} style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 6, width: 28, height: 28, cursor: "pointer", color: "var(--text-muted)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ padding: "16px 24px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", marginBottom: 16 }}>
                {[["Email",selected.email],["Phone",selected.phone||"—"],["College",selected.college],["Branch",selected.branch],["Graduation",selected.graduationYear],["CGPA",selected.cgpa||"—"],["Availability",selected.availability],["Start Date",selected.startDate]].map(([l,v]) => (
                  <div key={l} style={{ padding: "7px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 8 }}><span style={{ fontSize: 11, color: "var(--text-muted)", width: 90, flexShrink: 0 }}>{l}</span><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v}</span></div>
                ))}
              </div>
              {[["Tools Known",selected.toolsKnown],["Why Interested",selected.whyInterested],["Prior Experience",selected.priorExperience],...(selected.nlpExperience?[["NLP Experience",selected.nlpExperience]]:[])].map(([l,v]) => (
                <div key={l} style={{ marginBottom: 12 }}><p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{l}</p><div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px" }}>{v}</div></div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                {selected.resumeLink && <a href={selected.resumeLink} target="_blank" rel="noopener noreferrer" style={{ padding: "7px 14px", background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", fontSize: 12, textDecoration: "none", fontWeight: 600 }}>📄 Resume</a>}
                {selected.linkedinUrl && <a href={selected.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "7px 14px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 12, textDecoration: "none" }}>LinkedIn</a>}
                {selected.githubUrl && <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "7px 14px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 12, textDecoration: "none" }}>GitHub</a>}
              </div>
            </div>
          </div>
        </div>
      )}

      {reviewModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setReviewModal(null)}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 10, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "20px 24px 0" }}>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{reviewModal.action === "approve" ? "✓ Approve Applicant" : "✕ Reject Applicant"}</h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{reviewModal.applicant.fullName} · {reviewModal.applicant.projectName}</p>
            </div>
            <div style={{ padding: "16px 24px 24px" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{reviewModal.action === "reject" ? "Rejection Reason (required)" : "Note for applicant (optional)"}</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={reviewModal.action === "reject" ? "e.g. Your GitHub profile lacks project examples…" : "e.g. Great background! We'll reach out with next steps."} rows={4} style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", color: "var(--text-primary)", fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button onClick={() => setReviewModal(null)} style={{ flex: 1, padding: "9px 0", background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 13, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>Cancel</button>
                <button onClick={handleReview} disabled={submitting || (reviewModal.action === "reject" && !note.trim())} style={{ flex: 2, padding: "9px 0", background: reviewModal.action === "approve" ? "var(--green)" : "var(--red)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.7 : 1, fontFamily: "Syne, sans-serif" }}>
                  {submitting ? "Saving…" : reviewModal.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                </button>
              </div>
              {reviewModal.action === "reject" && !note.trim() && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 6 }}>A rejection reason is required.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardClient() {
  const [tab, setTab] = useState("applications");
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 40, background: "var(--sidebar-bg)", borderBottom: "1px solid var(--sidebar-border)", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "var(--sidebar-logo-color)" }}>Zen<span style={{ color: "var(--sidebar-logo-accent)" }}>taras</span></span>
          <span style={{ fontSize: 10, background: "var(--red-dim)", border: "1px solid rgba(227,73,53,0.3)", color: "var(--red)", padding: "2px 8px", borderRadius: 3, fontWeight: 700, letterSpacing: "0.5px" }}>ADMIN</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>
      <main style={{ maxWidth: 1140, margin: "0 auto", padding: "32px 20px 80px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Manage applicants and internship progress</p>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border)" }}>
          {[{ key: "applications", label: "📥 Applications" }, { key: "internships", label: "🎓 Internship Tracks" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "10px 20px", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", border: "1px solid var(--border)", borderBottom: tab === t.key ? "2px solid var(--accent)" : "1px solid transparent", background: tab === t.key ? "var(--bg-card)" : "transparent", color: tab === t.key ? "var(--accent)" : "var(--text-muted)", marginBottom: -1, transition: "all 0.15s" }}>{t.label}</button>
          ))}
        </div>
        {tab === "applications" ? <ApplicationsTab /> : <InternshipTracksTab />}
      </main>
    </div>
  );
}

