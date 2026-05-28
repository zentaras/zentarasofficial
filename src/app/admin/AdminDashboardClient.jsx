
// "use client";

// // app/admin/AdminDashboardClient.jsx
// import { useState, useEffect, useCallback } from "react";
// import { UserButton } from "@clerk/nextjs";
// import { INTERNSHIP_STEPS, STEP_STATUS_COLORS } from "../../lib/internshipSteps";

// const PROJECT_FILTERS = [
//   { key: "all",                 label: "All Projects" },
//   { key: "data-analyst-intern", label: "Data Analyst Intern" },
//   { key: "web-dev-intern",      label: "Web Developer Intern" },
// ];
// const STATUS_FILTERS = ["All", "Pending", "Shortlisted", "Rejected"];
// const PROJECT_META = {
//   "data-analyst-intern": { icon: "📊", color: "#22a06b" },
//   "web-dev-intern":      { icon: "🌐", color: "#6366f1" },
// };

// function appStatusStyle(s) {
//   if (s === "Shortlisted") return { bg: "var(--green-dim)", color: "var(--green)" };
//   if (s === "Rejected")    return { bg: "var(--red-dim)",   color: "var(--red)" };
//   return { bg: "var(--blue-dim)", color: "var(--blue)" };
// }

// function timeRemaining(deadline, stepStatus) {
//   if (!deadline || stepStatus === "approved") return null;
//   const diff = new Date(deadline) - new Date();
//   if (diff <= 0) return { label: "Overdue", color: "var(--red)", urgent: true, overdue: true };
//   const days  = Math.floor(diff / 86400000);
//   const hours = Math.floor((diff % 86400000) / 3600000);
//   if (days > 0) return { label: `${days}d ${hours}h left`, color: days <= 2 ? "var(--yellow)" : "var(--green)", urgent: days <= 2, overdue: false };
//   return { label: `${hours}h left`, color: "var(--red)", urgent: true, overdue: false };
// }

// function StepPill({ status }) {
//   const s = STEP_STATUS_COLORS[status] ?? STEP_STATUS_COLORS.pending;
//   const labels = { pending: "Not Submitted", submitted: "Needs Review ⚡", approved: "Approved ✓", rejected: "Needs Revision", locked: "🔒 Locked" };
//   return (
//     <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 12, background: s.bg, color: s.color, border: `1px solid ${s.border}`, textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap" }}>
//       {labels[status] ?? status}
//     </span>
//   );
// }

// function PointsBadge({ points, size = "normal" }) {
//   if (points == null) return null;
//   const isMax = points === 100;
//   return (
//     <span style={{
//       display: "inline-flex", alignItems: "center", gap: 3,
//       fontSize: size === "small" ? 9 : 11, fontWeight: 700,
//       padding: size === "small" ? "1px 6px" : "2px 8px", borderRadius: 20,
//       background: isMax ? "var(--green-dim)" : points >= 70 ? "var(--blue-dim)" : "var(--yellow-dim)",
//       color: isMax ? "var(--green)" : points >= 70 ? "var(--blue)" : "var(--yellow)",
//       border: `1px solid ${isMax ? "rgba(34,160,107,0.3)" : points >= 70 ? "rgba(99,102,241,0.3)" : "rgba(226,178,3,0.3)"}`,
//     }}>
//       {points}/100
//     </span>
//   );
// }

// // ── Confirm Modal ──────────────────────────────────────────────────────────────
// function ConfirmModal({ config, onConfirm, onCancel }) {
//   if (!config) return null;
//   return (
//     <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onCancel}>
//       <div style={{ background: "var(--bg-card)", border: `1px solid ${config.danger ? "rgba(227,73,53,0.45)" : "var(--accent-border)"}`, borderRadius: 12, width: "100%", maxWidth: 400, boxShadow: "0 24px 64px rgba(0,0,0,0.55)", padding: "28px 24px 22px" }} onClick={e => e.stopPropagation()}>
//         <div style={{ fontSize: 38, textAlign: "center", marginBottom: 12 }}>{config.icon}</div>
//         <h3 style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, textAlign: "center" }}>{config.title}</h3>
//         <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 10, textAlign: "center" }}>{config.message}</p>
//         {config.warning && (
//           <div style={{ background: config.danger ? "var(--red-dim)" : "var(--yellow-dim)", border: `1px solid ${config.danger ? "rgba(227,73,53,0.3)" : "rgba(226,178,3,0.3)"}`, borderRadius: "var(--radius-sm)", padding: "8px 12px", marginBottom: 18, fontSize: 12, color: config.danger ? "var(--red)" : "var(--yellow)", fontWeight: 600 }}>
//             ⚠ {config.warning}
//           </div>
//         )}
//         <div style={{ display: "flex", gap: 8 }}>
//           <button onClick={onCancel} style={{ flex: 1, padding: "9px 0", background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 13, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>Cancel</button>
//           <button onClick={onConfirm} style={{ flex: 2, padding: "9px 0", background: config.danger ? "var(--red)" : "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>{config.confirmLabel}</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Deadline Editor ────────────────────────────────────────────────────────────
// function DeadlineEditor({ stepConfig, stepData, trackId, onDeadlineUpdate, busy }) {
//   const currentDeadline = stepData?.deadline ?? null;
//   const stepStatus      = stepData?.status ?? "pending";
//   const remaining       = timeRemaining(currentDeadline, stepStatus);
//   const [editing, setEditing] = useState(false);
//   const [newDl, setNewDl]     = useState("");
//   const [saving, setSaving]   = useState(false);

//   const openEditor = e => {
//     e.stopPropagation();
//     if (currentDeadline) {
//       const d = new Date(currentDeadline);
//       const pad = n => String(n).padStart(2, "0");
//       setNewDl(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
//     } else { setNewDl(""); }
//     setEditing(true);
//   };

//   const save = async e => {
//     e.stopPropagation(); setSaving(true);
//     await onDeadlineUpdate(trackId, stepConfig.number, newDl || null);
//     setSaving(false); setEditing(false);
//   };

//   const clear = async e => {
//     e.stopPropagation(); setSaving(true);
//     await onDeadlineUpdate(trackId, stepConfig.number, null);
//     setSaving(false); setEditing(false); setNewDl("");
//   };

//   if (editing) {
//     return (
//       <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-start", marginTop: 6 }} onClick={e => e.stopPropagation()}>
//         <p style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{currentDeadline ? "Update Deadline" : "Set Deadline"}</p>
//         <input type="datetime-local" value={newDl} onChange={e => setNewDl(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "5px 8px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none" }} />
//         <div style={{ display: "flex", gap: 5 }}>
//           <button onClick={save} disabled={saving} style={{ padding: "4px 12px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, cursor: "pointer", background: "var(--accent)", color: "#fff", border: "none", fontFamily: "DM Sans, sans-serif", opacity: saving ? 0.6 : 1 }}>{saving ? "Saving…" : "Save"}</button>
//           {currentDeadline && <button onClick={clear} disabled={saving} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, cursor: "pointer", background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(227,73,53,0.3)", fontFamily: "DM Sans, sans-serif" }}>Remove</button>}
//           <button onClick={e => { e.stopPropagation(); setEditing(false); }} style={{ padding: "4px 8px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)" }}>✕</button>
//         </div>
//       </div>
//     );
//   }

//   if (stepStatus === "approved" && currentDeadline) {
//     return (
//       <div style={{ marginTop: 5 }}>
//         <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
//           📅 {new Date(currentDeadline).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div style={{ marginTop: 5 }}>
//       {currentDeadline ? (
//         <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
//           <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
//             📅 {new Date(currentDeadline).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
//           </span>
//           {remaining && (
//             <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10, background: remaining.overdue ? "var(--red-dim)" : remaining.urgent ? "var(--yellow-dim)" : "var(--green-dim)", color: remaining.color, border: `1px solid ${remaining.overdue ? "rgba(227,73,53,0.3)" : remaining.urgent ? "rgba(226,178,3,0.3)" : "rgba(34,160,107,0.3)"}` }}>
//               {remaining.overdue ? "⚠ Overdue" : remaining.label}
//             </span>
//           )}
//           <button onClick={openEditor} style={{ fontSize: 10, fontWeight: 600, padding: "1px 8px", borderRadius: 6, cursor: "pointer", background: remaining?.overdue ? "var(--red-dim)" : "var(--accent-dim)", color: remaining?.overdue ? "var(--red)" : "var(--accent)", border: `1px solid ${remaining?.overdue ? "rgba(227,73,53,0.35)" : "var(--accent-border)"}`, fontFamily: "DM Sans, sans-serif" }}>
//             {remaining?.overdue ? "⚠ Extend" : "Edit"}
//           </button>
//         </div>
//       ) : (
//         <button onClick={openEditor} style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 6, cursor: "pointer", background: "var(--bg-hover)", color: "var(--text-muted)", border: "1px solid var(--border)", fontFamily: "DM Sans, sans-serif" }}>
//           + Set Deadline
//         </button>
//       )}
//     </div>
//   );
// }

// // ── Lock/Unlock Toggle ─────────────────────────────────────────────────────────
// function StepToggleButton({ stepConfig, isUnlocked, trackId, onToggle, busy, disableUnlock = false }) {
//   const [showPicker, setShowPicker] = useState(false);
//   const [deadline, setDeadline]     = useState("");
//   const [confirm, setConfirm]       = useState(null);

//   const askLock = e => {
//     e.stopPropagation();
//     setConfirm({ icon: "🔒", danger: true, title: `Lock Step ${stepConfig.number}?`, message: `"${stepConfig.title}" will be locked immediately.`, warning: "The intern will lose access until you unlock it again.", confirmLabel: "Yes, Lock It", onConfirm: () => { setConfirm(null); onToggle(trackId, stepConfig.number, "lock", null); } });
//   };
//   const askUnlock = () => {
//     setConfirm({ icon: "🔓", danger: false, title: `Unlock Step ${stepConfig.number}?`, message: `"${stepConfig.title}" will be accessible to the intern.`, warning: deadline ? `Deadline: ${new Date(deadline).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}` : "No deadline set — intern can submit anytime.", confirmLabel: "Yes, Unlock It", onConfirm: () => { setConfirm(null); setShowPicker(false); setDeadline(""); onToggle(trackId, stepConfig.number, "unlock", deadline || null); } });
//   };

//   return (
//     <>
//       {isUnlocked ? (
//         <button onClick={askLock} disabled={busy} style={{ padding: "4px 12px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(227,73,53,0.35)", fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap", opacity: busy ? 0.6 : 1 }}>🔒 Lock</button>
//       ) : disableUnlock ? (
//         <span style={{ fontSize: 10, color: "var(--text-muted)", fontStyle: "italic" }}>Auto-unlocked via briefing</span>
//       ) : !showPicker ? (
//         <button onClick={e => { e.stopPropagation(); setShowPicker(true); }} disabled={busy} style={{ padding: "4px 12px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", background: "var(--accent)", color: "#fff", border: "none", fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap", opacity: busy ? 0.6 : 1 }}>🔓 Unlock</button>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }} onClick={e => e.stopPropagation()}>
//           <div><p style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>Deadline (optional)</p><input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "4px 8px", color: "var(--text-primary)", fontSize: 11, fontFamily: "DM Sans, sans-serif", outline: "none" }} /></div>
//           <div style={{ display: "flex", gap: 4 }}>
//             <button onClick={askUnlock} disabled={busy} style={{ padding: "5px 14px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, cursor: "pointer", background: "var(--accent)", color: "#fff", border: "none", fontFamily: "DM Sans, sans-serif" }}>{busy ? "…" : "Unlock →"}</button>
//             <button onClick={() => { setShowPicker(false); setDeadline(""); }} style={{ padding: "5px 8px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)" }}>✕</button>
//           </div>
//         </div>
//       )}
//       {confirm && <ConfirmModal config={confirm} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
//     </>
//   );
// }

// // ── Step 1 Briefing Row (admin publishes dataset + problem + tools + approach) ─
// function Step1BriefingRow({ stepData, trackId, onPublishBriefing, onToggle, busy }) {
//   const isPublished = stepData?.status === "approved";
//   const briefing    = stepData?.data ?? {};
//   const [open, setOpen] = useState(!isPublished);
//   const [form, setForm] = useState({
//     assignedDataset:  briefing.assignedDataset  ?? "",
//     problemStatement: briefing.problemStatement ?? "",
//     toolsPlanned:     briefing.toolsPlanned     ?? "",
//     approach:         briefing.approach         ?? "",
//   });
//   const [saving, setSaving]   = useState(false);
//   const [saved, setSaved]     = useState(false);
//   const [confirm, setConfirm] = useState(null);

//   const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));

//   const handlePublish = () => {
//     if (!form.assignedDataset.trim() || !form.problemStatement.trim() || !form.toolsPlanned.trim() || !form.approach.trim()) {
//       alert("All 4 briefing fields are required before publishing."); return;
//     }
//     setConfirm({
//       icon: "📊", danger: false,
//       title: "Publish Project Briefing?",
//       message: "This will auto-approve Step 1, award 100 points, and unlock Step 2 for the intern.",
//       warning: "The intern will see the briefing immediately after you publish.",
//       confirmLabel: "Publish & Unlock Step 2",
//       onConfirm: async () => {
//         setConfirm(null); setSaving(true);
//         await onPublishBriefing(trackId, form);
//         setSaving(false); setSaved(true);
//         setTimeout(() => setSaved(false), 2500);
//       },
//     });
//   };

//   const fieldDefs = [
//     { key: "assignedDataset",  label: "Assigned Dataset",   placeholder: "e.g. Superstore Sales CSV, Flipkart product listings, hospital patient records…", rows: 2 },
//     { key: "problemStatement", label: "Problem Statement",  placeholder: "e.g. Analyze sales trends and identify top 3 factors affecting revenue decline in Q3…", rows: 3 },
//     { key: "toolsPlanned",     label: "Tools & Stack",      placeholder: "e.g. Python (pandas, matplotlib, seaborn), SQL, Power BI for dashboard…", rows: 2 },
//     { key: "approach",         label: "Suggested Approach", placeholder: "e.g. Start with EDA → clean nulls → feature analysis → build dashboard → write insights…", rows: 3 },
//   ];

//   return (
//     <div style={{ border: `1px solid ${isPublished ? "rgba(34,160,107,0.5)" : "rgba(226,178,3,0.4)"}`, borderRadius: "var(--radius-sm)", marginBottom: 10, overflow: "visible", background: isPublished ? "rgba(34,160,107,0.02)" : "rgba(226,178,3,0.02)" }}>
//       {/* Header */}
//       <div onClick={() => setOpen(v => !v)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", cursor: "pointer" }}>
//         <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: isPublished ? "var(--green)" : "var(--yellow)", color: "#fff" }}>
//           {isPublished ? "✓" : "1"}
//         </div>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
//             <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Step 1 — Project Briefing & Setup</p>
//             <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap", background: isPublished ? "var(--green-dim)" : "var(--yellow-dim)", color: isPublished ? "var(--green)" : "var(--yellow)", border: `1px solid ${isPublished ? "rgba(34,160,107,0.3)" : "rgba(226,178,3,0.3)"}` }}>
//               {isPublished ? "Published ✓ · 100 pts auto-awarded" : "⚡ Admin Action Required"}
//             </span>
//             {isPublished && stepData?.pointsAwarded != null && <PointsBadge points={stepData.pointsAwarded} size="small" />}
//           </div>
//           <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
//             {isPublished ? "Briefing published — intern can view it. Step 2 is now active." : "Fill in the dataset, problem statement, tools, and approach. Publishing auto-approves this step and awards 100 points."}
//           </p>
//         </div>
//         <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>{open ? "▲" : "▼"}</span>
//       </div>

//       {/* Form */}
//       {open && (
//         <div style={{ padding: "16px 18px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
//           <div style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "var(--accent)" }}>
//             📊 <strong>Admin fills this section.</strong> Intern sees it as a read-only briefing once published. Publishing auto-advances to Step 2.
//           </div>

//           {fieldDefs.map(({ key, label, placeholder, rows }) => (
//             <div key={key} style={{ marginBottom: 14 }}>
//               <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                 {label} <span style={{ color: "var(--red)" }}>*</span>
//               </label>
//               <textarea
//                 value={form[key]}
//                 onChange={e => setField(key, e.target.value)}
//                 rows={rows}
//                 placeholder={placeholder}
//                 style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "9px 12px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6 }}
//               />
//             </div>
//           ))}

//           {saved && <p style={{ fontSize: 12, color: "var(--green)", marginBottom: 10 }}>✓ Briefing published successfully!</p>}

//           <div style={{ display: "flex", gap: 10 }}>
//             {!isPublished ? (
//               <button onClick={handlePublish} disabled={saving} style={{ padding: "9px 24px", background: "var(--green)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "sans-serif", opacity: saving ? 0.7 : 1 }}>
//                 {saving ? "Publishing…" : "📊 Publish Briefing & Unlock Step 2 →"}
//               </button>
//             ) : (
//               <button onClick={handlePublish} disabled={saving} style={{ padding: "9px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif", opacity: saving ? 0.7 : 1 }}>
//                 {saving ? "Updating…" : "✏ Update Briefing"}
//               </button>
//             )}
//           </div>
//           {confirm && <ConfirmModal config={confirm} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Regular Step Row (steps 2–4) ───────────────────────────────────────────────
// function StepRow({ stepConfig, stepData, isUnlocked, isCurrentlyActive, trackId, onApproveReject, onToggle, onDeadlineUpdate, busy }) {
//   const [note, setNote]     = useState("");
//   const [points, setPoints] = useState("");
//   const [open, setOpen]     = useState(stepData?.status === "submitted");
//   const status   = stepData?.status ?? "pending";
//   const deadline = stepData?.deadline;

//   return (
//     <div style={{ border: `1px solid ${stepData?.status === "submitted" ? "rgba(226,178,3,0.5)" : "var(--border)"}`, borderRadius: "var(--radius-sm)", marginBottom: 10, overflow: "visible" }}>
//       <div onClick={() => isUnlocked && setOpen(v => !v)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", cursor: isUnlocked ? "pointer" : "default", borderRadius: "var(--radius-sm)", background: !isUnlocked ? "rgba(0,0,0,0.06)" : stepData?.status === "submitted" ? "rgba(226,178,3,0.04)" : "transparent" }}>
//         <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, opacity: !isUnlocked ? 0.4 : 1, background: status === "approved" ? "var(--green)" : status === "submitted" ? "var(--yellow)" : status === "rejected" ? "var(--red)" : isCurrentlyActive ? "var(--accent)" : "var(--bg-hover)", color: ["approved","submitted","rejected"].includes(status) || isCurrentlyActive ? "#fff" : "var(--text-muted)" }}>
//           {!isUnlocked ? "🔒" : status === "approved" ? "✓" : stepConfig.number}
//         </div>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
//             <p style={{ fontSize: 13, fontWeight: 600, color: !isUnlocked ? "var(--text-muted)" : "var(--text-primary)" }}>
//               Step {stepConfig.number} — {stepConfig.title}
//               {stepData?.status === "submitted" && <span style={{ marginLeft: 8, fontSize: 10, background: "var(--yellow-dim)", color: "var(--yellow)", padding: "1px 7px", borderRadius: 3, fontWeight: 700 }}>⚡ Needs Review</span>}
//             </p>
//             <StepPill status={isUnlocked ? status : "locked"} />
//             {/* Points badge in header once awarded */}
//             {stepData?.pointsAwarded != null && <PointsBadge points={stepData.pointsAwarded} size="small" />}
//           </div>
//           <DeadlineEditor stepConfig={stepConfig} stepData={stepData} trackId={trackId} onDeadlineUpdate={onDeadlineUpdate} busy={busy} />
//         </div>
//         <div onClick={e => e.stopPropagation()}>
//           <StepToggleButton stepConfig={stepConfig} isUnlocked={isUnlocked} trackId={trackId} onToggle={onToggle} busy={busy} />
//         </div>
//         {isUnlocked && <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>{open ? "▲" : "▼"}</span>}
//       </div>

//       {open && isUnlocked && (
//         <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
//           {(!stepData || status === "pending") ? (
//             <p style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>{isCurrentlyActive ? "⏳ Waiting for intern to submit." : "Not yet submitted."}</p>
//           ) : (
//             <>
//               {/* Submission data */}
//               {stepData.data && Object.entries(stepData.data).map(([k, v]) => v ? (
//                 <div key={k} style={{ marginBottom: 12 }}>
//                   <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
//                     {k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
//                   </p>
//                   {(k.toLowerCase().includes("link") || k.toLowerCase().includes("url"))
//                     ? <a href={v} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--accent)", wordBreak: "break-all" }}>{v} ↗</a>
//                     : <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", maxHeight: 120, overflowY: "auto", whiteSpace: "pre-wrap" }}>{v}</div>}
//                 </div>
//               ) : null)}

//               {stepData.adminNote && (
//                 <div style={{ padding: "8px 12px", marginBottom: 12, background: status === "rejected" ? "var(--red-dim)" : "var(--green-dim)", border: `1px solid ${status === "rejected" ? "rgba(227,73,53,0.3)" : "rgba(34,160,107,0.3)"}`, borderRadius: "var(--radius-sm)" }}>
//                   <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3, color: status === "rejected" ? "var(--red)" : "var(--green)" }}>Previous Note</p>
//                   <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{stepData.adminNote}</p>
//                 </div>
//               )}

//               {status === "submitted" && (
//                 <div style={{ marginTop: 8 }}>
//                   <div style={{ background: "var(--bg-card)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "var(--accent)" }}>
//                     💡 After approving, <strong>manually unlock the next step</strong> — it does not happen automatically.
//                   </div>

//                   {/* Feedback note */}
//                   <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 5 }}>Feedback / Note</label>
//                   <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Leave feedback for the intern…" rows={3} style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.5 }} />

//                   {/* Points input */}
//                   <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, marginBottom: 12 }}>
//                     <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
//                       Points (0–100)
//                     </label>
//                     <input
//                       type="number" min={0} max={100} value={points}
//                       onChange={e => setPoints(e.target.value)}
//                       placeholder="e.g. 85"
//                       style={{ width: 80, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "6px 10px", color: "var(--text-primary)", fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none", textAlign: "center" }}
//                     />
//                     <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/ 100 — shown to intern after approval</span>
//                   </div>

//                   <div style={{ display: "flex", gap: 8 }}>
//                     <button
//                       onClick={() => {
//                         const pts = points !== "" ? Number(points) : undefined;
//                         if (pts != null && (pts < 0 || pts > 100)) { alert("Points must be between 0 and 100."); return; }
//                         onApproveReject(stepData.id, "approve", note, pts);
//                         setOpen(false);
//                       }}
//                       style={{ padding: "7px 20px", background: "var(--green)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}
//                     >
//                       ✓ Approve Step {stepConfig.number}
//                     </button>
//                     <button
//                       onClick={() => {
//                         if (!note.trim()) { alert("Add rejection reason first."); return; }
//                         onApproveReject(stepData.id, "reject", note, undefined);
//                         setOpen(false);
//                       }}
//                       style={{ padding: "7px 20px", background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(227,73,53,0.3)", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}
//                     >
//                       ✕ Request Revision
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Award points separately if already approved but no points yet */}
//               {status === "approved" && stepData.pointsAwarded == null && (
//                 <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--yellow-dim)", border: "1px solid rgba(226,178,3,0.3)", borderRadius: "var(--radius-sm)" }}>
//                   <p style={{ fontSize: 11, fontWeight: 700, color: "var(--yellow)", marginBottom: 8 }}>Points not yet awarded — set them now</p>
//                   <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                     <input
//                       type="number" min={0} max={100} value={points}
//                       onChange={e => setPoints(e.target.value)}
//                       placeholder="0–100"
//                       style={{ width: 70, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "6px 10px", color: "var(--text-primary)", fontSize: 13, outline: "none", textAlign: "center" }}
//                     />
//                     <button
//                       onClick={() => {
//                         const pts = Number(points);
//                         if (isNaN(pts) || pts < 0 || pts > 100) { alert("Enter a value between 0 and 100."); return; }
//                         onApproveReject(stepData.id, "award_points", "", pts);
//                       }}
//                       style={{ padding: "6px 16px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}
//                     >
//                       Award Points
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Step 5 Evaluation Row ──────────────────────────────────────────────────────
// function Step5EvaluationRow({ track, trackId, onEvaluate, onToggle, busy }) {
//   const step5       = track.steps.find(s => s.stepNumber === 5);
//   const step4       = track.steps.find(s => s.stepNumber === 4);
//   const step4Done   = step4?.status === "approved";
//   const isUnlocked  = track.currentStep >= 5;
//   const isCompleted = track.isCompleted;

//   const [open, setOpen]                     = useState(false);
//   const [analyticalFeedback, setAnalytical] = useState(track.analyticalFeedback ?? "");
//   const [insightsFeedback, setInsights]     = useState(track.insightsFeedback   ?? "");
//   const [certLink, setCertLink]             = useState(track.certificateLink    ?? "");
//   const [lorLink, setLorLink]               = useState(track.lorLink            ?? "");
//   const [repoLink, setRepoLink]             = useState(track.projectRepoLink    ?? "");
//   const [evalNotes, setEvalNotes]           = useState(track.evaluationNotes    ?? "");
//   const [saving, setSaving]                 = useState(false);
//   const [saved, setSaved]                   = useState(false);
//   const [confirm, setConfirm]               = useState(null);

//   const hasEvaluation = !!(track.analyticalFeedback && track.insightsFeedback);

//   const handleSave = async (publish = false) => {
//     setSaving(true);
//     await onEvaluate({
//       trackId,
//       analyticalFeedback,
//       insightsFeedback,
//       certificateLink:  certLink,
//       lorLink,
//       projectRepoLink:  repoLink,
//       evaluationNotes:  evalNotes,
//     }, publish);
//     setSaving(false); setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//   };

//   const handlePublish = () => {
//     if (!analyticalFeedback.trim()) { alert("Analytical thinking feedback is required."); return; }
//     if (!insightsFeedback.trim())   { alert("Communication of insights feedback is required."); return; }
//     setConfirm({
//       icon: "🎓", danger: false,
//       title: "Publish Evaluation?",
//       message: "This will mark the internship as completed and make the evaluation visible to the intern.",
//       warning: certLink ? `Certificate link is set ✓` : "No certificate link set — you can add one after publishing.",
//       confirmLabel: "Yes, Publish & Complete",
//       onConfirm: async () => { setConfirm(null); await handleSave(true); },
//     });
//   };

//   // Total points across steps 1–4
//   const totalPoints = track.steps
//     .filter(s => s.stepNumber >= 1 && s.stepNumber <= 4)
//     .reduce((acc, s) => acc + (s.pointsAwarded ?? 0), 0);

//   return (
//     <div style={{ border: `1px solid ${isCompleted ? "rgba(34,160,107,0.5)" : "var(--border)"}`, borderRadius: "var(--radius-sm)", marginBottom: 10, overflow: "visible", background: isCompleted ? "rgba(34,160,107,0.03)" : "transparent" }}>
//       {/* Header */}
//       <div onClick={() => isUnlocked && setOpen(v => !v)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", cursor: isUnlocked ? "pointer" : "default", borderRadius: "var(--radius-sm)", background: !isUnlocked ? "rgba(0,0,0,0.06)" : "transparent" }}>
//         <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, opacity: !isUnlocked ? 0.4 : 1, background: isCompleted ? "var(--green)" : isUnlocked ? "var(--accent)" : "var(--bg-hover)", color: isCompleted || isUnlocked ? "#fff" : "var(--text-muted)" }}>
//           {!isUnlocked ? "🔒" : isCompleted ? "✓" : "5"}
//         </div>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
//             <p style={{ fontSize: 13, fontWeight: 600, color: !isUnlocked ? "var(--text-muted)" : "var(--text-primary)" }}>
//               Step 5 — Certificate & Completion
//               {!step4Done && isUnlocked && (
//                 <span style={{ marginLeft: 8, fontSize: 10, background: "var(--yellow-dim)", color: "var(--yellow)", padding: "1px 7px", borderRadius: 3, fontWeight: 700 }}>⚠ Step 4 not yet approved</span>
//               )}
//             </p>
//             <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap", background: isCompleted ? "var(--green-dim)" : isUnlocked ? "var(--accent-dim)" : STEP_STATUS_COLORS.pending.bg, color: isCompleted ? "var(--green)" : isUnlocked ? "var(--accent)" : STEP_STATUS_COLORS.pending.color, border: `1px solid ${isCompleted ? "rgba(34,160,107,0.3)" : isUnlocked ? "var(--accent-border)" : STEP_STATUS_COLORS.pending.border}` }}>
//               {isCompleted ? "Published ✓" : isUnlocked ? (hasEvaluation ? "Draft Saved" : "Admin Action Required") : "🔒 Locked"}
//             </span>
//           </div>
//           {isUnlocked && !isCompleted && (
//             <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
//               {hasEvaluation ? "Draft saved — click Publish to make visible to intern." : "Fill analytical thinking & insights feedback, then publish to complete internship."}
//             </p>
//           )}
//           {isCompleted && (
//             <p style={{ fontSize: 11, color: "var(--green)" }}>
//               ✓ Evaluation published · Internship completed · <strong>{totalPoints}/400 pts</strong>
//             </p>
//           )}
//         </div>
//         <div onClick={e => e.stopPropagation()}>
//           <StepToggleButton stepConfig={{ number: 5, title: "Certificate & Completion" }} isUnlocked={isUnlocked} trackId={trackId} onToggle={onToggle} busy={busy} />
//         </div>
//         {isUnlocked && <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>{open ? "▲" : "▼"}</span>}
//       </div>

//       {/* Evaluation Form */}
//       {open && isUnlocked && (
//         <div style={{ padding: "16px 18px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
//           <div style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: 18, fontSize: 12, color: "var(--accent)" }}>
//             🎓 <strong>Admin fills this section.</strong> Intern does not submit anything here — they see your evaluation once published.
//           </div>

//           {/* Points summary */}
//           <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: 18 }}>
//             <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Points Summary (Steps 1–4)</p>
//             <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//               {[1,2,3,4].map(n => {
//                 const s = track.steps.find(st => st.stepNumber === n);
//                 return (
//                   <div key={n} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
//                     <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Step {n}</span>
//                     {s?.pointsAwarded != null
//                       ? <PointsBadge points={s.pointsAwarded} size="small" />
//                       : <span style={{ fontSize: 10, color: "var(--text-muted)" }}>— not awarded</span>}
//                   </div>
//                 );
//               })}
//               <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)" }}>
//                 <span style={{ fontSize: 10, fontWeight: 700, color: "var(--green)" }}>Total: {totalPoints}/400</span>
//               </div>
//             </div>
//           </div>

//           {/* Analytical Thinking Feedback */}
//           <div style={{ marginBottom: 14 }}>
//             <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
//               🧠 Feedback — Analytical Thinking <span style={{ color: "var(--red)" }}>*</span>
//             </label>
//             <textarea value={analyticalFeedback} onChange={e => setAnalytical(e.target.value)} rows={4} placeholder="Assess depth of analysis, choice of techniques, accuracy of insights, data interpretation quality…" style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "9px 12px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6 }} />
//           </div>

//           {/* Communication of Insights Feedback */}
//           <div style={{ marginBottom: 14 }}>
//             <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
//               💡 Feedback — Communication of Insights <span style={{ color: "var(--red)" }}>*</span>
//             </label>
//             <textarea value={insightsFeedback} onChange={e => setInsights(e.target.value)} rows={4} placeholder="How clearly were findings presented? Were recommendations actionable and well-structured? Dashboard quality?…" style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "9px 12px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6 }} />
//           </div>

//           {/* Certificate & LOR */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px", marginBottom: 14 }}>
//             <div>
//               <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Certificate Link</label>
//               <input type="url" value={certLink} onChange={e => setCertLink(e.target.value)} placeholder="https://drive.google.com/..." style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none" }} />
//             </div>
//             <div>
//               <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>LOR Link</label>
//               <input type="url" value={lorLink} onChange={e => setLorLink(e.target.value)} placeholder="https://drive.google.com/..." style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none" }} />
//             </div>
//           </div>

//           {/* Repo link */}
//           <div style={{ marginBottom: 14 }}>
//             <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Final Project Repo (admin curated)</label>
//             <input type="url" value={repoLink} onChange={e => setRepoLink(e.target.value)} placeholder="https://github.com/..." style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none" }} />
//           </div>

//           {/* Internal notes */}
//           <div style={{ marginBottom: 18 }}>
//             <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
//               Internal Notes <span style={{ fontSize: 10, fontWeight: 400, textTransform: "none" }}>(not visible to intern)</span>
//             </label>
//             <textarea value={evalNotes} onChange={e => setEvalNotes(e.target.value)} rows={2} placeholder="Private notes for admin team only…" style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", color: "var(--text-secondary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.5 }} />
//           </div>

//           {saved && <p style={{ fontSize: 12, color: "var(--green)", marginBottom: 10 }}>✓ Saved.</p>}

//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//             <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: "8px 20px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", opacity: saving ? 0.7 : 1 }}>
//               {saving ? "Saving…" : "💾 Save Draft"}
//             </button>
//             {!isCompleted && (
//               <button onClick={handlePublish} disabled={saving} style={{ padding: "8px 24px", background: "var(--green)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", opacity: saving ? 0.7 : 1 }}>
//                 🎓 Publish Evaluation & Complete Internship
//               </button>
//             )}
//             {isCompleted && (
//               <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: "8px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans, sans-serif", opacity: saving ? 0.7 : 1 }}>
//                 ✏ Update Evaluation
//               </button>
//             )}
//           </div>
//           {confirm && <ConfirmModal config={confirm} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Track Detail Modal ─────────────────────────────────────────────────────────
// function TrackDetailModal({ track, onClose, onStepAction, onToggleStep, onDeadlineUpdate, onEvaluate, onPublishBriefing }) {
//   const [busy, setBusy] = useState(false);
//   const meta     = PROJECT_META[track.projectKey] ?? { icon: "🎓", color: "#6366f1" };
//   const approved = track.steps.filter(s => s.status === "approved").length;
//   const progress = Math.round((approved / INTERNSHIP_STEPS.length) * 100);
//   const totalPoints = track.steps.reduce((acc, s) => acc + (s.pointsAwarded ?? 0), 0);

//   const handleToggle = async (trackId, stepNumber, action, deadline) => {
//     setBusy(true);
//     await onToggleStep(trackId, stepNumber, action, deadline);
//     setBusy(false);
//   };
//   const handleDeadlineUpdate = async (trackId, stepNumber, deadline) => {
//     setBusy(true);
//     await onDeadlineUpdate(trackId, stepNumber, deadline);
//     setBusy(false);
//   };

//   return (
//     <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
//       <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 12, width: "100%", maxWidth: 760, maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }} onClick={e => e.stopPropagation()}>

//         {/* Modal header */}
//         <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
//           <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//               <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0, background: `${meta.color}18`, border: `1px solid ${meta.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{meta.icon}</div>
//               <div>
//                 <h2 style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>{track.user?.firstName ?? ""} {track.user?.lastName ?? ""}</h2>
//                 <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{track.user?.email} · {track.projectName}</p>
//               </div>
//             </div>
//             <button onClick={onClose} style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 6, width: 28, height: 28, cursor: "pointer", color: "var(--text-muted)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
//             <div style={{ flex: 1, height: 5, background: "var(--border)", borderRadius: 99 }}>
//               <div style={{ height: "100%", borderRadius: 99, background: track.isCompleted ? "var(--green)" : "var(--accent)", width: `${progress}%`, transition: "width 0.5s" }} />
//             </div>
//             <span style={{ fontSize: 11, fontWeight: 700, color: track.isCompleted ? "var(--green)" : "var(--accent)", whiteSpace: "nowrap" }}>
//               {track.isCompleted ? `✓ Completed · ${totalPoints}/400 pts` : `${progress}% · Step ${track.currentStep} active · ${totalPoints}/400 pts`}
//             </span>
//           </div>
//         </div>

//         {/* Modal body */}
//         <div style={{ overflowY: "auto", padding: "16px 24px 24px", flex: 1 }}>
//           <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>All Steps — Full Control</p>

//           {/* Step 1 — briefing row */}
//           <Step1BriefingRow
//             stepData={track.steps.find(s => s.stepNumber === 1) ?? null}
//             trackId={track.id}
//             onPublishBriefing={onPublishBriefing}
//             onToggle={handleToggle}
//             busy={busy}
//           />

//           {/* Steps 2–4 */}
//           {INTERNSHIP_STEPS.filter(cfg => cfg.number >= 2 && cfg.number <= 4).map(cfg => {
//             const stepData          = track.steps.find(s => s.stepNumber === cfg.number) ?? null;
//             const isUnlocked        = cfg.number <= track.currentStep;
//             const isCurrentlyActive = cfg.number === track.currentStep && !track.isCompleted;
//             return (
//               <StepRow
//                 key={cfg.number}
//                 stepConfig={cfg}
//                 stepData={stepData}
//                 isUnlocked={isUnlocked}
//                 isCurrentlyActive={isCurrentlyActive}
//                 trackId={track.id}
//                 onApproveReject={(stepId, action, note, pts) => onStepAction(stepId, action, note, pts, track.id)}
//                 onToggle={handleToggle}
//                 onDeadlineUpdate={handleDeadlineUpdate}
//                 busy={busy}
//               />
//             );
//           })}

//           {/* Step 5 */}
//           <Step5EvaluationRow
//             track={track}
//             trackId={track.id}
//             onEvaluate={(data, publish) => onEvaluate(data, publish, track.id)}
//             onToggle={handleToggle}
//             busy={busy}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Internship Tracks Tab ──────────────────────────────────────────────────────
// function InternshipTracksTab() {
//   const [tracks, setTracks]               = useState([]);
//   const [loading, setLoading]             = useState(true);
//   const [selectedTrack, setSelectedTrack] = useState(null);
//   const [projectFilter, setProjectFilter] = useState("all");
//   const [statusFilter, setStatusFilter]   = useState("all");

//   const fetchTracks = useCallback(async () => {
//     setLoading(true);
//     const url  = projectFilter !== "all" ? `/api/admin/tracks?projectKey=${projectFilter}` : `/api/admin/tracks`;
//     const res  = await fetch(url);
//     const data = await res.json();
//     setTracks(data.tracks ?? []);
//     setLoading(false);
//   }, [projectFilter]);

//   useEffect(() => { fetchTracks(); }, [fetchTracks]);

//   const refreshModal = useCallback(async (trackId) => {
//     const res  = await fetch(`/api/admin/tracks?trackId=${trackId}`);
//     const data = await res.json();
//     if (data.track) setSelectedTrack(data.track);
//   }, []);

//   // approve / reject / award_points
//   const handleStepAction = async (stepId, action, note, points, trackId) => {
//     if (action === "award_points") {
//       await fetch("/api/admin/tracks", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action: "award_points", stepId, points }),
//       });
//     } else {
//       await fetch("/api/admin/tracks", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ stepId, action, adminNote: note, points }),
//       });
//     }
//     await fetchTracks();
//     if (selectedTrack?.id === trackId) await refreshModal(trackId);
//   };

//   const handleToggleStep = async (trackId, stepNumber, action, deadline) => {
//     const res  = await fetch("/api/admin/tracks/unlock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trackId, stepNumber, action, deadline }) });
//     const data = await res.json();
//     if (!res.ok) { alert(data.error ?? "Failed."); return; }
//     await fetchTracks();
//     if (selectedTrack?.id === trackId) await refreshModal(trackId);
//   };

//   const handleDeadlineUpdate = async (trackId, stepNumber, deadline) => {
//     const res  = await fetch("/api/admin/tracks/unlock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trackId, stepNumber, action: "update_deadline", deadline }) });
//     const data = await res.json();
//     if (!res.ok) { alert(data.error ?? "Failed to update deadline."); return; }
//     await fetchTracks();
//     if (selectedTrack?.id === trackId) await refreshModal(trackId);
//   };

//   const handleEvaluate = async (evalData, publish, trackId) => {
//     const res  = await fetch("/api/admin/tracks", {
//       method: "POST", headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action: "evaluate", publish, ...evalData }),
//     });
//     const data = await res.json();
//     if (!res.ok) { alert(data.error ?? "Failed to save evaluation."); return; }
//     await fetchTracks();
//     if (selectedTrack?.id === trackId) await refreshModal(trackId);
//   };

//   const handlePublishBriefing = async (trackId, form) => {
//     const res  = await fetch("/api/admin/tracks", {
//       method: "POST", headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ action: "publish_briefing", trackId, ...form }),
//     });
//     const data = await res.json();
//     if (!res.ok) { alert(data.error ?? "Failed to publish briefing."); return; }
//     await fetchTracks();
//     if (selectedTrack?.id === trackId) await refreshModal(trackId);
//   };

//   const filtered = tracks.filter(t => {
//     if (statusFilter === "completed") return t.isCompleted;
//     if (statusFilter === "active")    return !t.isCompleted;
//     return true;
//   });

//   const counts = {
//     total:         tracks.length,
//     active:        tracks.filter(t => !t.isCompleted).length,
//     completed:     tracks.filter(t => t.isCompleted).length,
//     pendingReview: tracks.reduce((n, t) => n + t.steps.filter(s => s.status === "submitted").length, 0),
//   };

//   return (
//     <div>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
//         {[
//           { label: "Total Interns",    val: counts.total,         color: "var(--text-primary)" },
//           { label: "Active",           val: counts.active,        color: "var(--accent)" },
//           { label: "Completed",        val: counts.completed,     color: "var(--green)" },
//           { label: "Awaiting Review",  val: counts.pendingReview, color: "var(--yellow)" },
//         ].map(s => (
//           <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 18px" }}>
//             <div style={{ fontFamily: "sans-serif", fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
//             <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
//           </div>
//         ))}
//       </div>

//       <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 20px", marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
//         <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "7px 12px", color: "var(--text-secondary)", fontSize: 12, outline: "none", cursor: "pointer" }}>
//           {PROJECT_FILTERS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
//         </select>
//         <div style={{ display: "flex", gap: 4 }}>
//           {[{ key: "all", label: "All" }, { key: "active", label: "Active" }, { key: "completed", label: "Completed" }].map(s => (
//             <button key={s.key} onClick={() => setStatusFilter(s.key)} style={{ padding: "5px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: statusFilter === s.key ? 700 : 400, border: statusFilter === s.key ? "1px solid var(--accent-border)" : "1px solid var(--border)", background: statusFilter === s.key ? "var(--accent-dim)" : "var(--bg)", color: statusFilter === s.key ? "var(--accent)" : "var(--text-muted)" }}>{s.label}</button>
//           ))}
//         </div>
//       </div>

//       <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
//         {loading
//           ? <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
//           : filtered.length === 0
//           ? <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}><div style={{ fontSize: 32, marginBottom: 10 }}>📭</div><p>No tracks yet.</p></div>
//           : (
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//                 <thead style={{ background: "var(--bg-hover)" }}>
//                   <tr>{["Intern","Project","Step Progress","Points","Review","Status","Actions"].map(h => (
//                     <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
//                   ))}</tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map(track => {
//                     const meta         = PROJECT_META[track.projectKey] ?? { icon: "🎓", color: "#6366f1" };
//                     const approvedCount = track.steps.filter(s => s.status === "approved").length;
//                     const pendingCount  = track.steps.filter(s => s.status === "submitted").length;
//                     const hasOverdue    = track.steps.some(s => s.deadline && new Date(s.deadline) < new Date() && s.status === "pending");
//                     const needsEval     = track.currentStep >= 5 && !track.isCompleted && !track.analyticalFeedback;
//                     const totalPts      = track.steps.reduce((acc, s) => acc + (s.pointsAwarded ?? 0), 0);
//                     return (
//                       <tr key={track.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
//                         <td style={{ padding: "12px 14px" }}>
//                           <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{track.user?.firstName ?? ""} {track.user?.lastName ?? ""}</p>
//                           <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{track.user?.email}</p>
//                         </td>
//                         <td style={{ padding: "12px 14px" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                             <span style={{ fontSize: 15 }}>{meta.icon}</span>
//                             <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{track.projectName}</span>
//                           </div>
//                         </td>
//                         <td style={{ padding: "12px 14px" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                             <div style={{ display: "flex", gap: 3 }}>
//                               {INTERNSHIP_STEPS.map(cfg => {
//                                 const s = track.steps.find(st => st.stepNumber === cfg.number);
//                                 const status = s?.status ?? (cfg.number <= track.currentStep ? "pending" : "locked");
//                                 return <div key={cfg.number} title={`Step ${cfg.number}: ${status}`} style={{ width: 11, height: 11, borderRadius: "50%", background: status === "approved" ? "var(--green)" : status === "submitted" ? "var(--yellow)" : status === "rejected" ? "var(--red)" : status === "pending" ? "var(--accent)" : "var(--border)" }} />;
//                               })}
//                             </div>
//                             <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{approvedCount}/{INTERNSHIP_STEPS.length}</span>
//                           </div>
//                         </td>
//                         <td style={{ padding: "12px 14px" }}>
//                           <span style={{ fontSize: 11, fontWeight: 700, color: totalPts > 0 ? "var(--green)" : "var(--text-muted)" }}>
//                             {totalPts > 0 ? `${totalPts}/400` : "—"}
//                           </span>
//                         </td>
//                         <td style={{ padding: "12px 14px" }}>
//                           <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
//                             {pendingCount > 0 && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "var(--yellow-dim)", color: "var(--yellow)", border: "1px solid rgba(226,178,3,0.3)", display: "inline-block" }}>{pendingCount} waiting</span>}
//                             {needsEval    && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent-border)", display: "inline-block" }}>🎓 Needs Eval</span>}
//                             {hasOverdue   && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(227,73,53,0.3)", display: "inline-block" }}>⚠ Overdue</span>}
//                             {!pendingCount && !needsEval && !hasOverdue && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>—</span>}
//                           </div>
//                         </td>
//                         <td style={{ padding: "12px 14px" }}>
//                           <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: track.isCompleted ? "var(--green-dim)" : "var(--accent-dim)", color: track.isCompleted ? "var(--green)" : "var(--accent)", border: `1px solid ${track.isCompleted ? "rgba(34,160,107,0.3)" : "var(--accent-border)"}` }}>
//                             {track.isCompleted ? "✓ Done" : `Step ${track.currentStep} Active`}
//                           </span>
//                         </td>
//                         <td style={{ padding: "12px 14px" }}>
//                           <button onClick={() => setSelectedTrack(track)} style={{ padding: "5px 14px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", fontFamily: "DM Sans, sans-serif", background: (pendingCount > 0 || needsEval) ? "var(--yellow-dim)" : "var(--bg-hover)", color: (pendingCount > 0 || needsEval) ? "var(--yellow)" : "var(--text-secondary)", border: `1px solid ${(pendingCount > 0 || needsEval) ? "rgba(226,178,3,0.4)" : "var(--border)"}`, fontWeight: (pendingCount > 0 || needsEval) ? 700 : 400 }}>
//                             {pendingCount > 0 ? "🔔 Review" : needsEval ? "🎓 Evaluate" : "Manage"}
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//       </div>

//       {selectedTrack && (
//         <TrackDetailModal
//           track={selectedTrack}
//           onClose={() => setSelectedTrack(null)}
//           onStepAction={handleStepAction}
//           onToggleStep={handleToggleStep}
//           onDeadlineUpdate={handleDeadlineUpdate}
//           onEvaluate={handleEvaluate}
//           onPublishBriefing={handlePublishBriefing}
//         />
//       )}
//     </div>
//   );
// }

// // ── Applications Tab ───────────────────────────────────────────────────────────
// function ApplicationsTab() {
//   const [applicants, setApplicants]       = useState([]);
//   const [loading, setLoading]             = useState(true);
//   const [projectFilter, setProjectFilter] = useState("all");
//   const [statusFilter, setStatusFilter]   = useState("All");
//   const [search, setSearch]               = useState("");
//   const [selected, setSelected]           = useState(null);
//   const [reviewModal, setReviewModal]     = useState(null);
//   const [note, setNote]                   = useState("");
//   const [submitting, setSubmitting]       = useState(false);

//   const fetchApplicants = useCallback(async () => {
//     setLoading(true);
//     const res  = await fetch("/api/admin/applicants");
//     const data = await res.json();
//     setApplicants(data.applicants ?? []);
//     setLoading(false);
//   }, []);
//   useEffect(() => { fetchApplicants(); }, [fetchApplicants]);

//   const filtered = applicants.filter(a => {
//     if (projectFilter !== "all" && a.projectKey !== projectFilter) return false;
//     if (statusFilter !== "All" && a.status !== statusFilter) return false;
//     if (search) { const q = search.toLowerCase(); return a.fullName?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.college?.toLowerCase().includes(q); }
//     return true;
//   });
//   const counts = { total: applicants.length, pending: applicants.filter(a => a.status === "Pending").length, shortlisted: applicants.filter(a => a.status === "Shortlisted").length, rejected: applicants.filter(a => a.status === "Rejected").length };

//   const handleReview = async () => {
//     if (!reviewModal) return;
//     setSubmitting(true);
//     await fetch("/api/admin/review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: reviewModal.applicant.id, table: reviewModal.applicant.projectKey, status: reviewModal.action === "approve" ? "Shortlisted" : "Rejected", adminNote: note }) });
//     setSubmitting(false); setReviewModal(null); setNote(""); fetchApplicants();
//   };

//   return (
//     <div>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
//         {[{ label: "Total", val: counts.total, color: "var(--text-primary)" }, { label: "Pending", val: counts.pending, color: "var(--blue)" }, { label: "Shortlisted", val: counts.shortlisted, color: "var(--green)" }, { label: "Rejected", val: counts.rejected, color: "var(--red)" }].map(s => (
//           <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 18px" }}>
//             <div style={{ fontFamily: "sans-serif", fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
//             <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
//           </div>
//         ))}
//       </div>
//       <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 20px", marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
//         <input placeholder="Search name, email, college…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "7px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "DM Sans, sans-serif" }} />
//         <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "7px 12px", color: "var(--text-secondary)", fontSize: 12, outline: "none", cursor: "pointer" }}>{PROJECT_FILTERS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}</select>
//         <div style={{ display: "flex", gap: 4 }}>{STATUS_FILTERS.map(s => (<button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "5px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: statusFilter === s ? 700 : 400, border: statusFilter === s ? "1px solid var(--accent-border)" : "1px solid var(--border)", background: statusFilter === s ? "var(--accent-dim)" : "var(--bg)", color: statusFilter === s ? "var(--accent)" : "var(--text-muted)" }}>{s}</button>))}</div>
//       </div>
//       <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
//         {loading ? <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
//         : filtered.length === 0 ? <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>No applicants found.</div>
//         : <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead style={{ background: "var(--bg-hover)" }}><tr>{["Applicant","Project","College","Applied","Status","Actions"].map(h => (<th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>))}</tr></thead><tbody>{filtered.map(app => { const sc = appStatusStyle(app.status); return (<tr key={app.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><td style={{ padding: "12px 14px" }}><p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{app.fullName}</p><p style={{ fontSize: 11, color: "var(--text-muted)" }}>{app.email}</p></td><td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>{app.projectName}</td><td style={{ padding: "12px 14px", color: "var(--text-secondary)", fontSize: 12 }}>{app.college}</td><td style={{ padding: "12px 14px", color: "var(--text-muted)", fontSize: 12, whiteSpace: "nowrap" }}>{new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td><td style={{ padding: "12px 14px" }}><span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: sc.bg, color: sc.color }}>{app.status}</span></td><td style={{ padding: "12px 14px" }}><div style={{ display: "flex", gap: 6 }}><button onClick={() => setSelected(app)} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)", fontFamily: "DM Sans, sans-serif" }}>View</button>{app.status !== "Shortlisted" && <button onClick={() => { setReviewModal({ applicant: app, action: "approve" }); setNote(""); }} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(34,160,107,0.3)", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>✓ Approve</button>}{app.status !== "Rejected" && <button onClick={() => { setReviewModal({ applicant: app, action: "reject" }); setNote(""); }} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(227,73,53,0.25)", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>✕ Reject</button>}</div></td></tr>); })}</tbody></table></div>}
//       </div>
//       {selected && (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setSelected(null)}><div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 10, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }} onClick={e => e.stopPropagation()}><div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><h2 style={{ fontFamily: "sans-serif", fontSize: 17, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{selected.fullName}</h2><p style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.projectName}</p></div><button onClick={() => setSelected(null)} style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 6, width: 28, height: 28, cursor: "pointer", color: "var(--text-muted)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button></div><div style={{ padding: "16px 24px 24px" }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", marginBottom: 16 }}>{[["Email",selected.email],["College",selected.college],["Branch",selected.branch],["Graduation",selected.graduationYear],["CGPA",selected.cgpa||"—"]].map(([l,v]) => (<div key={l} style={{ padding: "7px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 8 }}><span style={{ fontSize: 11, color: "var(--text-muted)", width: 90, flexShrink: 0 }}>{l}</span><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v}</span></div>))}</div><div style={{ display: "flex", gap: 8, marginTop: 16 }}>{selected.resumeLink && <a href={selected.resumeLink} target="_blank" rel="noopener noreferrer" style={{ padding: "7px 14px", background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", fontSize: 12, textDecoration: "none", fontWeight: 600 }}>📄 Resume</a>}{selected.githubUrl && <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "7px 14px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 12, textDecoration: "none" }}>GitHub</a>}</div></div></div></div>)}
//       {reviewModal && (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setReviewModal(null)}><div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 10, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }} onClick={e => e.stopPropagation()}><div style={{ padding: "20px 24px 0" }}><h2 style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{reviewModal.action === "approve" ? "✓ Approve Applicant" : "✕ Reject Applicant"}</h2><p style={{ fontSize: 12, color: "var(--text-muted)" }}>{reviewModal.applicant.fullName} · {reviewModal.applicant.projectName}</p></div><div style={{ padding: "16px 24px 24px" }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{reviewModal.action === "reject" ? "Rejection Reason (required)" : "Note (optional)"}</label><textarea value={note} onChange={e => setNote(e.target.value)} rows={4} style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", color: "var(--text-primary)", fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6 }} /><div style={{ display: "flex", gap: 8, marginTop: 14 }}><button onClick={() => setReviewModal(null)} style={{ flex: 1, padding: "9px 0", background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 13, cursor: "pointer" }}>Cancel</button><button onClick={handleReview} disabled={submitting || (reviewModal.action === "reject" && !note.trim())} style={{ flex: 2, padding: "9px 0", background: reviewModal.action === "approve" ? "var(--green)" : "var(--red)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.7 : 1, fontFamily: "sans-serif" }}>{submitting ? "Saving…" : reviewModal.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}</button></div>{reviewModal.action === "reject" && !note.trim() && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 6 }}>Rejection reason required.</p>}</div></div></div>)}
//     </div>
//   );
// }

// // ── Root ───────────────────────────────────────────────────────────────────────
// export default function AdminDashboardClient() {
//   const [tab, setTab] = useState("applications");
//   return (
//     <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
//       <nav style={{ position: "sticky", top: 0, zIndex: 40, background: "var(--sidebar-bg)", borderBottom: "1px solid var(--sidebar-border)", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <span style={{ fontFamily: "sans-serif", fontWeight: 800, fontSize: 18, color: "var(--sidebar-logo-color)" }}>Zen<span style={{ color: "var(--sidebar-logo-accent)" }}>taras</span></span>
//           <span style={{ fontSize: 10, background: "var(--red-dim)", border: "1px solid rgba(227,73,53,0.3)", color: "var(--red)", padding: "2px 8px", borderRadius: 3, fontWeight: 700, letterSpacing: "0.5px" }}>ADMIN</span>
//         </div>
//         <UserButton afterSignOutUrl="/" />
//       </nav>
//       <main style={{ maxWidth: 1140, margin: "0 auto", padding: "32px 20px 80px" }}>
//         <div style={{ marginBottom: 24 }}>
//           <h1 style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Admin Dashboard</h1>
//           <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Manage applicants and internship progress</p>
//         </div>
//         <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--border)" }}>
//           {[{ key: "applications", label: "📥 Applications" }, { key: "internships", label: "🎓 Internship Tracks" }].map(t => (
//             <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "10px 20px", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", border: "1px solid var(--border)", borderBottom: tab === t.key ? "2px solid var(--accent)" : "1px solid transparent", background: tab === t.key ? "var(--bg-card)" : "transparent", color: tab === t.key ? "var(--accent)" : "var(--text-muted)", marginBottom: -1, transition: "all 0.15s" }}>{t.label}</button>
//           ))}
//         </div>
//         {tab === "applications" ? <ApplicationsTab /> : <InternshipTracksTab />}
//       </main>
//     </div>
//   );
// }



"use client";

// app/admin/AdminDashboardClient.jsx
import { useState, useEffect, useCallback } from "react";
import { UserButton } from "@clerk/nextjs";
import { getStepsByProjectKey, STEP_STATUS_COLORS } from "../../lib/internshipSteps";

const PROJECT_FILTERS = [
  { key: "all",                 label: "All Projects" },
  { key: "data-analyst-intern", label: "Data Analyst Intern" },
  { key: "web-dev-intern",      label: "Web Developer Intern" },
];
const STATUS_FILTERS = ["All", "Pending", "Shortlisted", "Rejected"];
const PROJECT_META = {
  "data-analyst-intern": { icon: "📊", color: "#22a06b" },
  "web-dev-intern":      { icon: "🌐", color: "#6366f1" },
};

function appStatusStyle(s) {
  if (s === "Shortlisted") return { bg: "var(--green-dim)", color: "var(--green)" };
  if (s === "Rejected")    return { bg: "var(--red-dim)",   color: "var(--red)" };
  return { bg: "var(--blue-dim)", color: "var(--blue)" };
}

function timeRemaining(deadline, stepStatus) {
  if (!deadline || stepStatus === "approved") return null;
  const diff = new Date(deadline) - new Date();
  if (diff <= 0) return { label: "Overdue", color: "var(--red)", urgent: true, overdue: true };
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return { label: `${days}d ${hours}h left`, color: days <= 2 ? "var(--yellow)" : "var(--green)", urgent: days <= 2, overdue: false };
  return { label: `${hours}h left`, color: "var(--red)", urgent: true, overdue: false };
}

function StepPill({ status }) {
  const s = STEP_STATUS_COLORS[status] ?? STEP_STATUS_COLORS.pending;
  const labels = { pending: "Not Submitted", submitted: "Needs Review ⚡", approved: "Approved ✓", rejected: "Needs Revision", locked: "🔒 Locked" };
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 12, background: s.bg, color: s.color, border: `1px solid ${s.border}`, textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap" }}>
      {labels[status] ?? status}
    </span>
  );
}

function PointsBadge({ points, size = "normal" }) {
  if (points == null) return null;
  const isMax = points === 100;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      fontSize: size === "small" ? 9 : 11, fontWeight: 700,
      padding: size === "small" ? "1px 6px" : "2px 8px", borderRadius: 20,
      background: isMax ? "var(--green-dim)" : points >= 70 ? "var(--blue-dim)" : "var(--yellow-dim)",
      color: isMax ? "var(--green)" : points >= 70 ? "var(--blue)" : "var(--yellow)",
      border: `1px solid ${isMax ? "rgba(34,160,107,0.3)" : points >= 70 ? "rgba(99,102,241,0.3)" : "rgba(226,178,3,0.3)"}`,
    }}>
      {points}/100
    </span>
  );
}

// ── Confirm Modal ──────────────────────────────────────────────────────────────
function ConfirmModal({ config, onConfirm, onCancel }) {
  if (!config) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onCancel}>
      <div style={{ background: "var(--bg-card)", border: `1px solid ${config.danger ? "rgba(227,73,53,0.45)" : "var(--accent-border)"}`, borderRadius: 12, width: "100%", maxWidth: 400, boxShadow: "0 24px 64px rgba(0,0,0,0.55)", padding: "28px 24px 22px" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 38, textAlign: "center", marginBottom: 12 }}>{config.icon}</div>
        <h3 style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, textAlign: "center" }}>{config.title}</h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 10, textAlign: "center" }}>{config.message}</p>
        {config.warning && (
          <div style={{ background: config.danger ? "var(--red-dim)" : "var(--yellow-dim)", border: `1px solid ${config.danger ? "rgba(227,73,53,0.3)" : "rgba(226,178,3,0.3)"}`, borderRadius: "var(--radius-sm)", padding: "8px 12px", marginBottom: 18, fontSize: 12, color: config.danger ? "var(--red)" : "var(--yellow)", fontWeight: 600 }}>
            ⚠ {config.warning}
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "9px 0", background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 13, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 2, padding: "9px 0", background: config.danger ? "var(--red)" : "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>{config.confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Deadline Editor ────────────────────────────────────────────────────────────
function DeadlineEditor({ stepConfig, stepData, trackId, onDeadlineUpdate, busy }) {
  const currentDeadline = stepData?.deadline ?? null;
  const stepStatus      = stepData?.status ?? "pending";
  const remaining       = timeRemaining(currentDeadline, stepStatus);
  const [editing, setEditing] = useState(false);
  const [newDl, setNewDl]     = useState("");
  const [saving, setSaving]   = useState(false);

  const openEditor = e => {
    e.stopPropagation();
    if (currentDeadline) {
      const d = new Date(currentDeadline);
      const pad = n => String(n).padStart(2, "0");
      setNewDl(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
    } else { setNewDl(""); }
    setEditing(true);
  };
  const save = async e => { e.stopPropagation(); setSaving(true); await onDeadlineUpdate(trackId, stepConfig.number, newDl || null); setSaving(false); setEditing(false); };
  const clear = async e => { e.stopPropagation(); setSaving(true); await onDeadlineUpdate(trackId, stepConfig.number, null); setSaving(false); setEditing(false); setNewDl(""); };

  if (editing) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-start", marginTop: 6 }} onClick={e => e.stopPropagation()}>
        <p style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{currentDeadline ? "Update Deadline" : "Set Deadline"}</p>
        <input type="datetime-local" value={newDl} onChange={e => setNewDl(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "5px 8px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none" }} />
        <div style={{ display: "flex", gap: 5 }}>
          <button onClick={save} disabled={saving} style={{ padding: "4px 12px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, cursor: "pointer", background: "var(--accent)", color: "#fff", border: "none", fontFamily: "DM Sans, sans-serif", opacity: saving ? 0.6 : 1 }}>{saving ? "Saving…" : "Save"}</button>
          {currentDeadline && <button onClick={clear} disabled={saving} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, cursor: "pointer", background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(227,73,53,0.3)", fontFamily: "DM Sans, sans-serif" }}>Remove</button>}
          <button onClick={e => { e.stopPropagation(); setEditing(false); }} style={{ padding: "4px 8px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)" }}>✕</button>
        </div>
      </div>
    );
  }
  if (stepStatus === "approved" && currentDeadline) {
    return <div style={{ marginTop: 5 }}><span style={{ fontSize: 10, color: "var(--text-muted)" }}>📅 {new Date(currentDeadline).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span></div>;
  }
  return (
    <div style={{ marginTop: 5 }}>
      {currentDeadline ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>📅 {new Date(currentDeadline).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
          {remaining && <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10, background: remaining.overdue ? "var(--red-dim)" : remaining.urgent ? "var(--yellow-dim)" : "var(--green-dim)", color: remaining.color, border: `1px solid ${remaining.overdue ? "rgba(227,73,53,0.3)" : remaining.urgent ? "rgba(226,178,3,0.3)" : "rgba(34,160,107,0.3)"}` }}>{remaining.overdue ? "⚠ Overdue" : remaining.label}</span>}
          <button onClick={openEditor} style={{ fontSize: 10, fontWeight: 600, padding: "1px 8px", borderRadius: 6, cursor: "pointer", background: remaining?.overdue ? "var(--red-dim)" : "var(--accent-dim)", color: remaining?.overdue ? "var(--red)" : "var(--accent)", border: `1px solid ${remaining?.overdue ? "rgba(227,73,53,0.35)" : "var(--accent-border)"}`, fontFamily: "DM Sans, sans-serif" }}>{remaining?.overdue ? "⚠ Extend" : "Edit"}</button>
        </div>
      ) : (
        <button onClick={openEditor} style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 6, cursor: "pointer", background: "var(--bg-hover)", color: "var(--text-muted)", border: "1px solid var(--border)", fontFamily: "DM Sans, sans-serif" }}>+ Set Deadline</button>
      )}
    </div>
  );
}

// ── Lock/Unlock Toggle ─────────────────────────────────────────────────────────
function StepToggleButton({ stepConfig, isUnlocked, trackId, onToggle, busy, disableUnlock = false }) {
  const [showPicker, setShowPicker] = useState(false);
  const [deadline, setDeadline]     = useState("");
  const [confirm, setConfirm]       = useState(null);

  const askLock = e => {
    e.stopPropagation();
    setConfirm({ icon: "🔒", danger: true, title: `Lock Step ${stepConfig.number}?`, message: `"${stepConfig.title}" will be locked immediately.`, warning: "The intern will lose access until you unlock it again.", confirmLabel: "Yes, Lock It", onConfirm: () => { setConfirm(null); onToggle(trackId, stepConfig.number, "lock", null); } });
  };
  const askUnlock = () => {
    setConfirm({ icon: "🔓", danger: false, title: `Unlock Step ${stepConfig.number}?`, message: `"${stepConfig.title}" will be accessible to the intern.`, warning: deadline ? `Deadline: ${new Date(deadline).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}` : "No deadline set — intern can submit anytime.", confirmLabel: "Yes, Unlock It", onConfirm: () => { setConfirm(null); setShowPicker(false); setDeadline(""); onToggle(trackId, stepConfig.number, "unlock", deadline || null); } });
  };

  return (
    <>
      {isUnlocked ? (
        <button onClick={askLock} disabled={busy} style={{ padding: "4px 12px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(227,73,53,0.35)", fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap", opacity: busy ? 0.6 : 1 }}>🔒 Lock</button>
      ) : disableUnlock ? (
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontStyle: "italic" }}>Auto-unlocked via briefing</span>
      ) : !showPicker ? (
        <button onClick={e => { e.stopPropagation(); setShowPicker(true); }} disabled={busy} style={{ padding: "4px 12px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", background: "var(--accent)", color: "#fff", border: "none", fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap", opacity: busy ? 0.6 : 1 }}>🔓 Unlock</button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }} onClick={e => e.stopPropagation()}>
          <div><p style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>Deadline (optional)</p><input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "4px 8px", color: "var(--text-primary)", fontSize: 11, fontFamily: "DM Sans, sans-serif", outline: "none" }} /></div>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={askUnlock} disabled={busy} style={{ padding: "5px 14px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, cursor: "pointer", background: "var(--accent)", color: "#fff", border: "none", fontFamily: "DM Sans, sans-serif" }}>{busy ? "…" : "Unlock →"}</button>
            <button onClick={() => { setShowPicker(false); setDeadline(""); }} style={{ padding: "5px 8px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)" }}>✕</button>
          </div>
        </div>
      )}
      {confirm && <ConfirmModal config={confirm} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
    </>
  );
}

// ── Step 1 Briefing Row ────────────────────────────────────────────────────────
function Step1BriefingRow({ stepData, trackId, projectKey, onPublishBriefing, onToggle, busy }) {
  const isPublished = stepData?.status === "approved";
  const briefing    = stepData?.data ?? {};
  const isWebDev    = projectKey === "web-dev-intern";

  const [open, setOpen] = useState(!isPublished);
  const [form, setForm] = useState({
    assignedDataset:  briefing.assignedDataset  ?? "",
    problemStatement: briefing.problemStatement ?? "",
    toolsPlanned:     briefing.toolsPlanned     ?? "",
    approach:         briefing.approach         ?? "",
  });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [confirm, setConfirm] = useState(null);

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handlePublish = () => {
    if (!form.assignedDataset.trim() || !form.problemStatement.trim() || !form.toolsPlanned.trim() || !form.approach.trim()) {
      alert("All 4 briefing fields are required before publishing."); return;
    }
    setConfirm({
      icon: isWebDev ? "🌐" : "📊", danger: false,
      title: "Publish Project Briefing?",
      message: "This will auto-approve Step 1, award 100 points, and unlock Step 2 for the intern.",
      warning: "The intern will see the briefing immediately after you publish.",
      confirmLabel: "Publish & Unlock Step 2",
      onConfirm: async () => {
        setConfirm(null); setSaving(true);
        await onPublishBriefing(trackId, form);
        setSaving(false); setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      },
    });
  };

  // Field labels adapt to role
  const fieldDefs = isWebDev
    ? [
        { key: "assignedDataset",  label: "Project Assignment",    placeholder: "e.g. Build a full-stack task manager with React + Node, or a portfolio site with CMS…", rows: 2 },
        { key: "problemStatement", label: "Project Requirements",  placeholder: "e.g. Users should be able to register, create tasks, assign deadlines, and track progress…", rows: 3 },
        { key: "toolsPlanned",     label: "Tech Stack & Tools",    placeholder: "e.g. React, Tailwind CSS, Node.js, Express, PostgreSQL, Prisma, deployed on Vercel…", rows: 2 },
        { key: "approach",         label: "Suggested Approach",    placeholder: "e.g. Start with wireframes → set up repo → build auth → CRUD → styling → deploy…", rows: 3 },
      ]
    : [
        { key: "assignedDataset",  label: "Assigned Dataset",      placeholder: "e.g. Superstore Sales CSV, Flipkart product listings, hospital patient records…", rows: 2 },
        { key: "problemStatement", label: "Problem Statement",     placeholder: "e.g. Analyze sales trends and identify top 3 factors affecting revenue decline in Q3…", rows: 3 },
        { key: "toolsPlanned",     label: "Tools & Stack",         placeholder: "e.g. Python (pandas, matplotlib, seaborn), SQL, Power BI for dashboard…", rows: 2 },
        { key: "approach",         label: "Suggested Approach",    placeholder: "e.g. Start with EDA → clean nulls → feature analysis → build dashboard → write insights…", rows: 3 },
      ];

  return (
    <div style={{ border: `1px solid ${isPublished ? "rgba(34,160,107,0.5)" : "rgba(226,178,3,0.4)"}`, borderRadius: "var(--radius-sm)", marginBottom: 10, overflow: "visible", background: isPublished ? "rgba(34,160,107,0.02)" : "rgba(226,178,3,0.02)" }}>
      <div onClick={() => setOpen(v => !v)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", cursor: "pointer" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: isPublished ? "var(--green)" : "var(--yellow)", color: "#fff" }}>
          {isPublished ? "✓" : "1"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Step 1 — Project Briefing & Setup</p>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap", background: isPublished ? "var(--green-dim)" : "var(--yellow-dim)", color: isPublished ? "var(--green)" : "var(--yellow)", border: `1px solid ${isPublished ? "rgba(34,160,107,0.3)" : "rgba(226,178,3,0.3)"}` }}>
              {isPublished ? "Published ✓ · 100 pts auto-awarded" : "⚡ Admin Action Required"}
            </span>
            {isPublished && stepData?.pointsAwarded != null && <PointsBadge points={stepData.pointsAwarded} size="small" />}
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {isPublished ? "Briefing published — intern can view it. Step 2 is now active." : `Fill in the ${isWebDev ? "project assignment, requirements, tech stack, and approach" : "dataset, problem statement, tools, and approach"}. Publishing auto-approves this step and awards 100 points.`}
          </p>
        </div>
        <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ padding: "16px 18px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
          <div style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "var(--accent)" }}>
            {isWebDev ? "🌐" : "📊"} <strong>Admin fills this section.</strong> Intern sees it as a read-only briefing once published. Publishing auto-advances to Step 2.
          </div>

          {fieldDefs.map(({ key, label, placeholder, rows }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {label} <span style={{ color: "var(--red)" }}>*</span>
              </label>
              <textarea value={form[key]} onChange={e => setField(key, e.target.value)} rows={rows} placeholder={placeholder}
                style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "9px 12px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6 }} />
            </div>
          ))}

          {saved && <p style={{ fontSize: 12, color: "var(--green)", marginBottom: 10 }}>✓ Briefing published successfully!</p>}

          <div style={{ display: "flex", gap: 10 }}>
            {!isPublished ? (
              <button onClick={handlePublish} disabled={saving} style={{ padding: "9px 24px", background: "var(--green)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "sans-serif", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Publishing…" : `${isWebDev ? "🌐" : "📊"} Publish Briefing & Unlock Step 2 →`}
              </button>
            ) : (
              <button onClick={handlePublish} disabled={saving} style={{ padding: "9px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Updating…" : "✏ Update Briefing"}
              </button>
            )}
          </div>
          {confirm && <ConfirmModal config={confirm} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
        </div>
      )}
    </div>
  );
}

// ── Regular Step Row (steps 2–4) ───────────────────────────────────────────────
function StepRow({ stepConfig, stepData, isUnlocked, isCurrentlyActive, trackId, onApproveReject, onToggle, onDeadlineUpdate, busy }) {
  const [note, setNote]     = useState("");
  const [points, setPoints] = useState("");
  const [open, setOpen]     = useState(stepData?.status === "submitted");
  const status   = stepData?.status ?? "pending";

  return (
    <div style={{ border: `1px solid ${stepData?.status === "submitted" ? "rgba(226,178,3,0.5)" : "var(--border)"}`, borderRadius: "var(--radius-sm)", marginBottom: 10, overflow: "visible" }}>
      <div onClick={() => isUnlocked && setOpen(v => !v)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", cursor: isUnlocked ? "pointer" : "default", borderRadius: "var(--radius-sm)", background: !isUnlocked ? "rgba(0,0,0,0.06)" : stepData?.status === "submitted" ? "rgba(226,178,3,0.04)" : "transparent" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, opacity: !isUnlocked ? 0.4 : 1, background: status === "approved" ? "var(--green)" : status === "submitted" ? "var(--yellow)" : status === "rejected" ? "var(--red)" : isCurrentlyActive ? "var(--accent)" : "var(--bg-hover)", color: ["approved","submitted","rejected"].includes(status) || isCurrentlyActive ? "#fff" : "var(--text-muted)" }}>
          {!isUnlocked ? "🔒" : status === "approved" ? "✓" : stepConfig.number}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: !isUnlocked ? "var(--text-muted)" : "var(--text-primary)" }}>
              Step {stepConfig.number} — {stepConfig.title}
              {stepData?.status === "submitted" && <span style={{ marginLeft: 8, fontSize: 10, background: "var(--yellow-dim)", color: "var(--yellow)", padding: "1px 7px", borderRadius: 3, fontWeight: 700 }}>⚡ Needs Review</span>}
            </p>
            <StepPill status={isUnlocked ? status : "locked"} />
            {stepData?.pointsAwarded != null && <PointsBadge points={stepData.pointsAwarded} size="small" />}
          </div>
          <DeadlineEditor stepConfig={stepConfig} stepData={stepData} trackId={trackId} onDeadlineUpdate={onDeadlineUpdate} busy={busy} />
        </div>
        <div onClick={e => e.stopPropagation()}>
          <StepToggleButton stepConfig={stepConfig} isUnlocked={isUnlocked} trackId={trackId} onToggle={onToggle} busy={busy} />
        </div>
        {isUnlocked && <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>{open ? "▲" : "▼"}</span>}
      </div>

      {open && isUnlocked && (
        <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
          {(!stepData || status === "pending") ? (
            <p style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>{isCurrentlyActive ? "⏳ Waiting for intern to submit." : "Not yet submitted."}</p>
          ) : (
            <>
              {stepData.data && Object.entries(stepData.data).map(([k, v]) => v ? (
                <div key={k} style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}</p>
                  {(k.toLowerCase().includes("link") || k.toLowerCase().includes("url"))
                    ? <a href={v} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--accent)", wordBreak: "break-all" }}>{v} ↗</a>
                    : <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", maxHeight: 120, overflowY: "auto", whiteSpace: "pre-wrap" }}>{v}</div>}
                </div>
              ) : null)}
              {stepData.adminNote && (
                <div style={{ padding: "8px 12px", marginBottom: 12, background: status === "rejected" ? "var(--red-dim)" : "var(--green-dim)", border: `1px solid ${status === "rejected" ? "rgba(227,73,53,0.3)" : "rgba(34,160,107,0.3)"}`, borderRadius: "var(--radius-sm)" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3, color: status === "rejected" ? "var(--red)" : "var(--green)" }}>Previous Note</p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{stepData.adminNote}</p>
                </div>
              )}
              {status === "submitted" && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "var(--accent)" }}>
                    💡 After approving, <strong>manually unlock the next step</strong> — it does not happen automatically.
                  </div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 5 }}>Feedback / Note</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Leave feedback for the intern…" rows={3} style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.5 }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, marginBottom: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>Points (0–100)</label>
                    <input type="number" min={0} max={100} value={points} onChange={e => setPoints(e.target.value)} placeholder="e.g. 85" style={{ width: 80, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "6px 10px", color: "var(--text-primary)", fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none", textAlign: "center" }} />
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/ 100 — shown to intern after approval</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { const pts = points !== "" ? Number(points) : undefined; if (pts != null && (pts < 0 || pts > 100)) { alert("Points must be between 0 and 100."); return; } onApproveReject(stepData.id, "approve", note, pts); setOpen(false); }} style={{ padding: "7px 20px", background: "var(--green)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>✓ Approve Step {stepConfig.number}</button>
                    <button onClick={() => { if (!note.trim()) { alert("Add rejection reason first."); return; } onApproveReject(stepData.id, "reject", note, undefined); setOpen(false); }} style={{ padding: "7px 20px", background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(227,73,53,0.3)", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>✕ Request Revision</button>
                  </div>
                </div>
              )}
              {status === "approved" && stepData.pointsAwarded == null && (
                <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--yellow-dim)", border: "1px solid rgba(226,178,3,0.3)", borderRadius: "var(--radius-sm)" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--yellow)", marginBottom: 8 }}>Points not yet awarded — set them now</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="number" min={0} max={100} value={points} onChange={e => setPoints(e.target.value)} placeholder="0–100" style={{ width: 70, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "6px 10px", color: "var(--text-primary)", fontSize: 13, outline: "none", textAlign: "center" }} />
                    <button onClick={() => { const pts = Number(points); if (isNaN(pts) || pts < 0 || pts > 100) { alert("Enter a value between 0 and 100."); return; } onApproveReject(stepData.id, "award_points", "", pts); }} style={{ padding: "6px 16px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>Award Points</button>
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

// ── Step 5 Evaluation Row ──────────────────────────────────────────────────────
function Step5EvaluationRow({ track, trackId, onEvaluate, onToggle, busy }) {
  const step4       = track.steps.find(s => s.stepNumber === 4);
  const step4Done   = step4?.status === "approved";
  const isUnlocked  = track.currentStep >= 5;
  const isCompleted = track.isCompleted;

  const [open, setOpen]                     = useState(false);
  const [analyticalFeedback, setAnalytical] = useState(track.analyticalFeedback ?? "");
  const [insightsFeedback, setInsights]     = useState(track.insightsFeedback   ?? "");
  const [certLink, setCertLink]             = useState(track.certificateLink    ?? "");
  const [lorLink, setLorLink]               = useState(track.lorLink            ?? "");
  const [repoLink, setRepoLink]             = useState(track.projectRepoLink    ?? "");
  const [evalNotes, setEvalNotes]           = useState(track.evaluationNotes    ?? "");
  const [saving, setSaving]                 = useState(false);
  const [saved, setSaved]                   = useState(false);
  const [confirm, setConfirm]               = useState(null);

  const hasEvaluation = !!(track.analyticalFeedback && track.insightsFeedback);

  const handleSave = async (publish = false) => {
    setSaving(true);
    await onEvaluate({ trackId, analyticalFeedback, insightsFeedback, certificateLink: certLink, lorLink, projectRepoLink: repoLink, evaluationNotes: evalNotes }, publish);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePublish = () => {
    if (!analyticalFeedback.trim()) { alert("Analytical thinking feedback is required."); return; }
    if (!insightsFeedback.trim())   { alert("Communication of insights feedback is required."); return; }
    setConfirm({
      icon: "🎓", danger: false,
      title: "Publish Evaluation?",
      message: "This will mark the internship as completed and make the evaluation visible to the intern.",
      warning: certLink ? `Certificate link is set ✓` : "No certificate link set — you can add one after publishing.",
      confirmLabel: "Yes, Publish & Complete",
      onConfirm: async () => { setConfirm(null); await handleSave(true); },
    });
  };

  const totalPoints = track.steps.filter(s => s.stepNumber >= 1 && s.stepNumber <= 4).reduce((acc, s) => acc + (s.pointsAwarded ?? 0), 0);

  // Label for feedback sections varies by project
  const isWebDev = track.projectKey === "web-dev-intern";
  const label1 = isWebDev ? "🧠 Feedback — Technical Implementation" : "🧠 Feedback — Analytical Thinking";
  const label2 = isWebDev ? "💡 Feedback — Code Quality & Communication" : "💡 Feedback — Communication of Insights";
  const ph1    = isWebDev ? "Assess code quality, architecture decisions, problem-solving approach, and use of best practices…" : "Assess depth of analysis, choice of techniques, accuracy of insights, data interpretation quality…";
  const ph2    = isWebDev ? "How well did they communicate their technical choices? Is the project well-documented and easy to navigate?…" : "How clearly were findings presented? Were recommendations actionable and well-structured? Dashboard quality?…";

  return (
    <div style={{ border: `1px solid ${isCompleted ? "rgba(34,160,107,0.5)" : "var(--border)"}`, borderRadius: "var(--radius-sm)", marginBottom: 10, overflow: "visible", background: isCompleted ? "rgba(34,160,107,0.03)" : "transparent" }}>
      <div onClick={() => isUnlocked && setOpen(v => !v)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", cursor: isUnlocked ? "pointer" : "default", borderRadius: "var(--radius-sm)", background: !isUnlocked ? "rgba(0,0,0,0.06)" : "transparent" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, opacity: !isUnlocked ? 0.4 : 1, background: isCompleted ? "var(--green)" : isUnlocked ? "var(--accent)" : "var(--bg-hover)", color: isCompleted || isUnlocked ? "#fff" : "var(--text-muted)" }}>
          {!isUnlocked ? "🔒" : isCompleted ? "✓" : "5"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: !isUnlocked ? "var(--text-muted)" : "var(--text-primary)" }}>
              Step 5 — Certificate & Completion
              {!step4Done && isUnlocked && <span style={{ marginLeft: 8, fontSize: 10, background: "var(--yellow-dim)", color: "var(--yellow)", padding: "1px 7px", borderRadius: 3, fontWeight: 700 }}>⚠ Step 4 not yet approved</span>}
            </p>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap", background: isCompleted ? "var(--green-dim)" : isUnlocked ? "var(--accent-dim)" : STEP_STATUS_COLORS.pending.bg, color: isCompleted ? "var(--green)" : isUnlocked ? "var(--accent)" : STEP_STATUS_COLORS.pending.color, border: `1px solid ${isCompleted ? "rgba(34,160,107,0.3)" : isUnlocked ? "var(--accent-border)" : STEP_STATUS_COLORS.pending.border}` }}>
              {isCompleted ? "Published ✓" : isUnlocked ? (hasEvaluation ? "Draft Saved" : "Admin Action Required") : "🔒 Locked"}
            </span>
          </div>
          {isUnlocked && !isCompleted && <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{hasEvaluation ? "Draft saved — click Publish to make visible to intern." : "Fill feedback fields, then publish to complete internship."}</p>}
          {isCompleted && <p style={{ fontSize: 11, color: "var(--green)" }}>✓ Evaluation published · Internship completed · <strong>{totalPoints}/400 pts</strong></p>}
        </div>
        <div onClick={e => e.stopPropagation()}>
          <StepToggleButton stepConfig={{ number: 5, title: "Certificate & Completion" }} isUnlocked={isUnlocked} trackId={trackId} onToggle={onToggle} busy={busy} />
        </div>
        {isUnlocked && <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>{open ? "▲" : "▼"}</span>}
      </div>

      {open && isUnlocked && (
        <div style={{ padding: "16px 18px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
          <div style={{ background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: 18, fontSize: 12, color: "var(--accent)" }}>
            🎓 <strong>Admin fills this section.</strong> Intern does not submit anything here — they see your evaluation once published.
          </div>

          {/* Points summary */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: 18 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Points Summary (Steps 1–4)</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[1,2,3,4].map(n => {
                const s = track.steps.find(st => st.stepNumber === n);
                return (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Step {n}</span>
                    {s?.pointsAwarded != null ? <PointsBadge points={s.pointsAwarded} size="small" /> : <span style={{ fontSize: 10, color: "var(--text-muted)" }}>— not awarded</span>}
                  </div>
                );
              })}
              <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--green)" }}>Total: {totalPoints}/400</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label1} <span style={{ color: "var(--red)" }}>*</span></label>
            <textarea value={analyticalFeedback} onChange={e => setAnalytical(e.target.value)} rows={4} placeholder={ph1} style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "9px 12px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6 }} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label2} <span style={{ color: "var(--red)" }}>*</span></label>
            <textarea value={insightsFeedback} onChange={e => setInsights(e.target.value)} rows={4} placeholder={ph2} style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "9px 12px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px", marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Certificate Link</label>
              <input type="url" value={certLink} onChange={e => setCertLink(e.target.value)} placeholder="https://drive.google.com/..." style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>LOR Link</label>
              <input type="url" value={lorLink} onChange={e => setLorLink(e.target.value)} placeholder="https://drive.google.com/..." style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none" }} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Final Project {isWebDev ? "Repo / Live URL" : "Repo"} (admin curated)</label>
            <input type="url" value={repoLink} onChange={e => setRepoLink(e.target.value)} placeholder={isWebDev ? "https://github.com/... or live URL" : "https://github.com/..."} style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", color: "var(--text-primary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none" }} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Internal Notes <span style={{ fontSize: 10, fontWeight: 400, textTransform: "none" }}>(not visible to intern)</span></label>
            <textarea value={evalNotes} onChange={e => setEvalNotes(e.target.value)} rows={2} placeholder="Private notes for admin team only…" style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", color: "var(--text-secondary)", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.5 }} />
          </div>

          {saved && <p style={{ fontSize: 12, color: "var(--green)", marginBottom: 10 }}>✓ Saved.</p>}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: "8px 20px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", opacity: saving ? 0.7 : 1 }}>{saving ? "Saving…" : "💾 Save Draft"}</button>
            {!isCompleted && <button onClick={handlePublish} disabled={saving} style={{ padding: "8px 24px", background: "var(--green)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", opacity: saving ? 0.7 : 1 }}>🎓 Publish Evaluation & Complete Internship</button>}
            {isCompleted && <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: "8px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans, sans-serif", opacity: saving ? 0.7 : 1 }}>✏ Update Evaluation</button>}
          </div>
          {confirm && <ConfirmModal config={confirm} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
        </div>
      )}
    </div>
  );
}

// ── Track Detail Modal ─────────────────────────────────────────────────────────
function TrackDetailModal({ track, onClose, onStepAction, onToggleStep, onDeadlineUpdate, onEvaluate, onPublishBriefing }) {
  const [busy, setBusy] = useState(false);
  const meta           = PROJECT_META[track.projectKey] ?? { icon: "🎓", color: "#6366f1" };

  // ── use the correct steps for this track's role ──
  const INTERNSHIP_STEPS = getStepsByProjectKey(track.projectKey);

  const approved    = track.steps.filter(s => s.status === "approved").length;
  const progress    = Math.round((approved / INTERNSHIP_STEPS.length) * 100);
  const totalPoints = track.steps.reduce((acc, s) => acc + (s.pointsAwarded ?? 0), 0);

  const handleToggle = async (trackId, stepNumber, action, deadline) => { setBusy(true); await onToggleStep(trackId, stepNumber, action, deadline); setBusy(false); };
  const handleDeadlineUpdate = async (trackId, stepNumber, deadline) => { setBusy(true); await onDeadlineUpdate(trackId, stepNumber, deadline); setBusy(false); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 12, width: "100%", maxWidth: 760, maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0, background: `${meta.color}18`, border: `1px solid ${meta.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{meta.icon}</div>
              <div>
                <h2 style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>{track.user?.firstName ?? ""} {track.user?.lastName ?? ""}</h2>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{track.user?.email} · {track.projectName}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 6, width: 28, height: 28, cursor: "pointer", color: "var(--text-muted)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
            <div style={{ flex: 1, height: 5, background: "var(--border)", borderRadius: 99 }}>
              <div style={{ height: "100%", borderRadius: 99, background: track.isCompleted ? "var(--green)" : "var(--accent)", width: `${progress}%`, transition: "width 0.5s" }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: track.isCompleted ? "var(--green)" : "var(--accent)", whiteSpace: "nowrap" }}>
              {track.isCompleted ? `✓ Completed · ${totalPoints}/400 pts` : `${progress}% · Step ${track.currentStep} active · ${totalPoints}/400 pts`}
            </span>
          </div>
        </div>

        <div style={{ overflowY: "auto", padding: "16px 24px 24px", flex: 1 }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>All Steps — Full Control</p>

          {/* Step 1 — briefing row (pass projectKey so labels adapt) */}
          <Step1BriefingRow
            stepData={track.steps.find(s => s.stepNumber === 1) ?? null}
            trackId={track.id}
            projectKey={track.projectKey}
            onPublishBriefing={onPublishBriefing}
            onToggle={handleToggle}
            busy={busy}
          />

          {/* Steps 2–4 — filtered from the role-specific config */}
          {INTERNSHIP_STEPS.filter(cfg => cfg.number >= 2 && cfg.number <= 4).map(cfg => {
            const stepData          = track.steps.find(s => s.stepNumber === cfg.number) ?? null;
            const isUnlocked        = cfg.number <= track.currentStep;
            const isCurrentlyActive = cfg.number === track.currentStep && !track.isCompleted;
            return (
              <StepRow
                key={cfg.number}
                stepConfig={cfg}
                stepData={stepData}
                isUnlocked={isUnlocked}
                isCurrentlyActive={isCurrentlyActive}
                trackId={track.id}
                onApproveReject={(stepId, action, note, pts) => onStepAction(stepId, action, note, pts, track.id)}
                onToggle={handleToggle}
                onDeadlineUpdate={handleDeadlineUpdate}
                busy={busy}
              />
            );
          })}

          {/* Step 5 */}
          <Step5EvaluationRow
            track={track}
            trackId={track.id}
            onEvaluate={(data, publish) => onEvaluate(data, publish, track.id)}
            onToggle={handleToggle}
            busy={busy}
          />
        </div>
      </div>
    </div>
  );
}

// ── Internship Tracks Tab ──────────────────────────────────────────────────────
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

  const handleStepAction = async (stepId, action, note, points, trackId) => {
    if (action === "award_points") {
      await fetch("/api/admin/tracks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "award_points", stepId, points }) });
    } else {
      await fetch("/api/admin/tracks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stepId, action, adminNote: note, points }) });
    }
    await fetchTracks();
    if (selectedTrack?.id === trackId) await refreshModal(trackId);
  };

  const handleToggleStep = async (trackId, stepNumber, action, deadline) => {
    const res  = await fetch("/api/admin/tracks/unlock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trackId, stepNumber, action, deadline }) });
    const data = await res.json();
    if (!res.ok) { alert(data.error ?? "Failed."); return; }
    await fetchTracks();
    if (selectedTrack?.id === trackId) await refreshModal(trackId);
  };

  const handleDeadlineUpdate = async (trackId, stepNumber, deadline) => {
    const res  = await fetch("/api/admin/tracks/unlock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trackId, stepNumber, action: "update_deadline", deadline }) });
    const data = await res.json();
    if (!res.ok) { alert(data.error ?? "Failed to update deadline."); return; }
    await fetchTracks();
    if (selectedTrack?.id === trackId) await refreshModal(trackId);
  };

  const handleEvaluate = async (evalData, publish, trackId) => {
    const res  = await fetch("/api/admin/tracks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "evaluate", publish, ...evalData }) });
    const data = await res.json();
    if (!res.ok) { alert(data.error ?? "Failed to save evaluation."); return; }
    await fetchTracks();
    if (selectedTrack?.id === trackId) await refreshModal(trackId);
  };

  const handlePublishBriefing = async (trackId, form) => {
    const res  = await fetch("/api/admin/tracks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "publish_briefing", trackId, ...form }) });
    const data = await res.json();
    if (!res.ok) { alert(data.error ?? "Failed to publish briefing."); return; }
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Interns",   val: counts.total,         color: "var(--text-primary)" },
          { label: "Active",          val: counts.active,        color: "var(--accent)" },
          { label: "Completed",       val: counts.completed,     color: "var(--green)" },
          { label: "Awaiting Review", val: counts.pendingReview, color: "var(--yellow)" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 18px" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 20px", marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "7px 12px", color: "var(--text-secondary)", fontSize: 12, outline: "none", cursor: "pointer" }}>
          {PROJECT_FILTERS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ key: "all", label: "All" }, { key: "active", label: "Active" }, { key: "completed", label: "Completed" }].map(s => (
            <button key={s.key} onClick={() => setStatusFilter(s.key)} style={{ padding: "5px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: statusFilter === s.key ? 700 : 400, border: statusFilter === s.key ? "1px solid var(--accent-border)" : "1px solid var(--border)", background: statusFilter === s.key ? "var(--accent-dim)" : "var(--bg)", color: statusFilter === s.key ? "var(--accent)" : "var(--text-muted)" }}>{s.label}</button>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        {loading
          ? <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
          : filtered.length === 0
          ? <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}><div style={{ fontSize: 32, marginBottom: 10 }}>📭</div><p>No tracks yet.</p></div>
          : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead style={{ background: "var(--bg-hover)" }}>
                  <tr>{["Intern","Project","Step Progress","Points","Review","Status","Actions"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.map(track => {
                    const meta          = PROJECT_META[track.projectKey] ?? { icon: "🎓", color: "#6366f1" };
                    // ── use per-track step config for dot count ──
                    const trackSteps    = getStepsByProjectKey(track.projectKey);
                    const approvedCount = track.steps.filter(s => s.status === "approved").length;
                    const pendingCount  = track.steps.filter(s => s.status === "submitted").length;
                    const hasOverdue    = track.steps.some(s => s.deadline && new Date(s.deadline) < new Date() && s.status === "pending");
                    const needsEval     = track.currentStep >= 5 && !track.isCompleted && !track.analyticalFeedback;
                    const totalPts      = track.steps.reduce((acc, s) => acc + (s.pointsAwarded ?? 0), 0);
                    return (
                      <tr key={track.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "12px 14px" }}>
                          <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{track.user?.firstName ?? ""} {track.user?.lastName ?? ""}</p>
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
                              {trackSteps.map(cfg => {
                                const s = track.steps.find(st => st.stepNumber === cfg.number);
                                const status = s?.status ?? (cfg.number <= track.currentStep ? "pending" : "locked");
                                return <div key={cfg.number} title={`Step ${cfg.number}: ${status}`} style={{ width: 11, height: 11, borderRadius: "50%", background: status === "approved" ? "var(--green)" : status === "submitted" ? "var(--yellow)" : status === "rejected" ? "var(--red)" : status === "pending" ? "var(--accent)" : "var(--border)" }} />;
                              })}
                            </div>
                            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{approvedCount}/{trackSteps.length}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: totalPts > 0 ? "var(--green)" : "var(--text-muted)" }}>{totalPts > 0 ? `${totalPts}/400` : "—"}</span>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {pendingCount > 0 && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "var(--yellow-dim)", color: "var(--yellow)", border: "1px solid rgba(226,178,3,0.3)", display: "inline-block" }}>{pendingCount} waiting</span>}
                            {needsEval    && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent-border)", display: "inline-block" }}>🎓 Needs Eval</span>}
                            {hasOverdue   && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(227,73,53,0.3)", display: "inline-block" }}>⚠ Overdue</span>}
                            {!pendingCount && !needsEval && !hasOverdue && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>—</span>}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: track.isCompleted ? "var(--green-dim)" : "var(--accent-dim)", color: track.isCompleted ? "var(--green)" : "var(--accent)", border: `1px solid ${track.isCompleted ? "rgba(34,160,107,0.3)" : "var(--accent-border)"}` }}>
                            {track.isCompleted ? "✓ Done" : `Step ${track.currentStep} Active`}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <button onClick={() => setSelectedTrack(track)} style={{ padding: "5px 14px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", fontFamily: "DM Sans, sans-serif", background: (pendingCount > 0 || needsEval) ? "var(--yellow-dim)" : "var(--bg-hover)", color: (pendingCount > 0 || needsEval) ? "var(--yellow)" : "var(--text-secondary)", border: `1px solid ${(pendingCount > 0 || needsEval) ? "rgba(226,178,3,0.4)" : "var(--border)"}`, fontWeight: (pendingCount > 0 || needsEval) ? 700 : 400 }}>
                            {pendingCount > 0 ? "🔔 Review" : needsEval ? "🎓 Evaluate" : "Manage"}
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
          onToggleStep={handleToggleStep}
          onDeadlineUpdate={handleDeadlineUpdate}
          onEvaluate={handleEvaluate}
          onPublishBriefing={handlePublishBriefing}
        />
      )}
    </div>
  );
}

// ── Applications Tab ───────────────────────────────────────────────────────────
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
    if (statusFilter !== "All" && a.status !== statusFilter) return false;
    if (search) { const q = search.toLowerCase(); return a.fullName?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.college?.toLowerCase().includes(q); }
    return true;
  });
  const counts = { total: applicants.length, pending: applicants.filter(a => a.status === "Pending").length, shortlisted: applicants.filter(a => a.status === "Shortlisted").length, rejected: applicants.filter(a => a.status === "Rejected").length };

  const handleReview = async () => {
    if (!reviewModal) return;
    setSubmitting(true);
    await fetch("/api/admin/review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: reviewModal.applicant.id, table: reviewModal.applicant.projectKey, status: reviewModal.action === "approve" ? "Shortlisted" : "Rejected", adminNote: note }) });
    setSubmitting(false); setReviewModal(null); setNote(""); fetchApplicants();
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[{ label: "Total", val: counts.total, color: "var(--text-primary)" }, { label: "Pending", val: counts.pending, color: "var(--blue)" }, { label: "Shortlisted", val: counts.shortlisted, color: "var(--green)" }, { label: "Rejected", val: counts.rejected, color: "var(--red)" }].map(s => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 18px" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 20px", marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input placeholder="Search name, email, college…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "7px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", fontFamily: "DM Sans, sans-serif" }} />
        <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "7px 12px", color: "var(--text-secondary)", fontSize: 12, outline: "none", cursor: "pointer" }}>{PROJECT_FILTERS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}</select>
        <div style={{ display: "flex", gap: 4 }}>{STATUS_FILTERS.map(s => (<button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "5px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: statusFilter === s ? 700 : 400, border: statusFilter === s ? "1px solid var(--accent-border)" : "1px solid var(--border)", background: statusFilter === s ? "var(--accent-dim)" : "var(--bg)", color: statusFilter === s ? "var(--accent)" : "var(--text-muted)" }}>{s}</button>))}</div>
      </div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        {loading ? <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        : filtered.length === 0 ? <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>No applicants found.</div>
        : <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead style={{ background: "var(--bg-hover)" }}><tr>{["Applicant","Project","College","Applied","Status","Actions"].map(h => (<th key={h} style={{ padding: "10px 14px", textAlign: "left", fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.7px", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>))}</tr></thead><tbody>{filtered.map(app => { const sc = appStatusStyle(app.status); return (<tr key={app.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><td style={{ padding: "12px 14px" }}><p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{app.fullName}</p><p style={{ fontSize: 11, color: "var(--text-muted)" }}>{app.email}</p></td><td style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>{app.projectName}</td><td style={{ padding: "12px 14px", color: "var(--text-secondary)", fontSize: 12 }}>{app.college}</td><td style={{ padding: "12px 14px", color: "var(--text-muted)", fontSize: 12, whiteSpace: "nowrap" }}>{new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td><td style={{ padding: "12px 14px" }}><span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: sc.bg, color: sc.color }}>{app.status}</span></td><td style={{ padding: "12px 14px" }}><div style={{ display: "flex", gap: 6 }}><button onClick={() => setSelected(app)} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)", fontFamily: "DM Sans, sans-serif" }}>View</button>{app.status !== "Shortlisted" && <button onClick={() => { setReviewModal({ applicant: app, action: "approve" }); setNote(""); }} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(34,160,107,0.3)", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>✓ Approve</button>}{app.status !== "Rejected" && <button onClick={() => { setReviewModal({ applicant: app, action: "reject" }); setNote(""); }} style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, cursor: "pointer", background: "var(--red-dim)", color: "var(--red)", border: "1px solid rgba(227,73,53,0.25)", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>✕ Reject</button>}</div></td></tr>); })}</tbody></table></div>}
      </div>
      {selected && (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setSelected(null)}><div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 10, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }} onClick={e => e.stopPropagation()}><div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><div><h2 style={{ fontFamily: "sans-serif", fontSize: 17, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{selected.fullName}</h2><p style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.projectName}</p></div><button onClick={() => setSelected(null)} style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", borderRadius: 6, width: 28, height: 28, cursor: "pointer", color: "var(--text-muted)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button></div><div style={{ padding: "16px 24px 24px" }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", marginBottom: 16 }}>{[["Email",selected.email],["College",selected.college],["Branch",selected.branch],["Graduation",selected.graduationYear],["CGPA",selected.cgpa||"—"]].map(([l,v]) => (<div key={l} style={{ padding: "7px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 8 }}><span style={{ fontSize: 11, color: "var(--text-muted)", width: 90, flexShrink: 0 }}>{l}</span><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v}</span></div>))}</div><div style={{ display: "flex", gap: 8, marginTop: 16 }}>{selected.resumeLink && <a href={selected.resumeLink} target="_blank" rel="noopener noreferrer" style={{ padding: "7px 14px", background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", fontSize: 12, textDecoration: "none", fontWeight: 600 }}>📄 Resume</a>}{selected.githubUrl && <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "7px 14px", background: "var(--bg-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 12, textDecoration: "none" }}>GitHub</a>}</div></div></div></div>)}
      {reviewModal && (<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setReviewModal(null)}><div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 10, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }} onClick={e => e.stopPropagation()}><div style={{ padding: "20px 24px 0" }}><h2 style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{reviewModal.action === "approve" ? "✓ Approve Applicant" : "✕ Reject Applicant"}</h2><p style={{ fontSize: 12, color: "var(--text-muted)" }}>{reviewModal.applicant.fullName} · {reviewModal.applicant.projectName}</p></div><div style={{ padding: "16px 24px 24px" }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{reviewModal.action === "reject" ? "Rejection Reason (required)" : "Note (optional)"}</label><textarea value={note} onChange={e => setNote(e.target.value)} rows={4} style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", color: "var(--text-primary)", fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6 }} /><div style={{ display: "flex", gap: 8, marginTop: 14 }}><button onClick={() => setReviewModal(null)} style={{ flex: 1, padding: "9px 0", background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 13, cursor: "pointer" }}>Cancel</button><button onClick={handleReview} disabled={submitting || (reviewModal.action === "reject" && !note.trim())} style={{ flex: 2, padding: "9px 0", background: reviewModal.action === "approve" ? "var(--green)" : "var(--red)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.7 : 1, fontFamily: "sans-serif" }}>{submitting ? "Saving…" : reviewModal.action === "approve" ? "Confirm Approval" : "Confirm Rejection"}</button></div>{reviewModal.action === "reject" && !note.trim() && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 6 }}>Rejection reason required.</p>}</div></div></div>)}
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function AdminDashboardClient() {
  const [tab, setTab] = useState("applications");
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 40, background: "var(--sidebar-bg)", borderBottom: "1px solid var(--sidebar-border)", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "sans-serif", fontWeight: 800, fontSize: 18, color: "var(--sidebar-logo-color)" }}>Zen<span style={{ color: "var(--sidebar-logo-accent)" }}>taras</span></span>
          <span style={{ fontSize: 10, background: "var(--red-dim)", border: "1px solid rgba(227,73,53,0.3)", color: "var(--red)", padding: "2px 8px", borderRadius: 3, fontWeight: 700, letterSpacing: "0.5px" }}>ADMIN</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>
      <main style={{ maxWidth: 1140, margin: "0 auto", padding: "32px 20px 80px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Admin Dashboard</h1>
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