// "use client";

// import { useState, useEffect } from "react";
// import Navbar from "../Components/navbar";
// import Footer from "../Components/footer";
// import { INTERNSHIP_STEPS, STEP_STATUS_COLORS } from "../../lib/internshipSteps";

// const PROJECT_META = {
//   "data-analyst-intern": { icon: "📊", color: "#22a06b", label: "Data Analyst Intern" },
//   "web-dev-intern":      { icon: "🌐", color: "#6366f1", label: "Web Developer Intern" },
// };

// // ─── Live countdown hook ───────────────────────────────────────────────────────
// function useCountdown(deadline, stepStatus) {
//   const isApproved = stepStatus === "approved";

//   const calc = () => {
//     if (!deadline || isApproved) return null;
//     const diff = new Date(deadline) - new Date();
//     if (diff <= 0) return { label: "Deadline passed", urgent: true, overdue: true, color: "var(--red)", days: 0, hours: 0, minutes: 0, seconds: 0 };
//     const days    = Math.floor(diff / 86400000);
//     const hours   = Math.floor((diff % 86400000) / 3600000);
//     const minutes = Math.floor((diff % 3600000) / 60000);
//     const seconds = Math.floor((diff % 60000) / 1000);
//     return {
//       label:   days > 0 ? `${days}d ${hours}h ${minutes}m left` : `${hours}h ${minutes}m ${seconds}s left`,
//       urgent:  days <= 2,
//       overdue: false,
//       color:   days <= 2 ? (days === 0 ? "var(--red)" : "var(--yellow)") : "var(--green)",
//       days, hours, minutes, seconds,
//     };
//   };

//   const [remaining, setRemaining] = useState(calc);
//   useEffect(() => {
//     if (!deadline || isApproved) { setRemaining(null); return; }
//     const id = setInterval(() => setRemaining(calc()), 1000);
//     return () => clearInterval(id);
//   }, [deadline, isApproved]);

//   return remaining;
// }

// // ─── Deadline Banner ───────────────────────────────────────────────────────────
// function DeadlineBanner({ deadline, stepStatus }) {
//   const remaining = useCountdown(deadline, stepStatus);
//   if (!deadline || !remaining || stepStatus === "approved") return null;

//   return (
//     <div style={{
//       border: `1px solid ${remaining.overdue ? "rgba(227,73,53,0.4)" : remaining.urgent ? "rgba(226,178,3,0.4)" : "rgba(34,160,107,0.3)"}`,
//       borderRadius: "var(--radius-sm)", padding: "14px 16px", marginBottom: 20,
//       background: remaining.overdue ? "var(--red-dim)" : remaining.urgent ? "var(--yellow-dim)" : "var(--green-dim)",
//     }}>
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
//         <div>
//           <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, color: remaining.overdue ? "var(--red)" : remaining.urgent ? "var(--yellow)" : "var(--green)" }}>
//             {remaining.overdue ? "⚠ Deadline Passed" : "⏰ Submission Deadline"}
//           </p>
//           <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
//             {new Date(deadline).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
//           </p>
//         </div>
//         <div style={{ background: "var(--bg-card)", border: `1px solid ${remaining.color}40`, borderRadius: 8, padding: "8px 16px", textAlign: "center", minWidth: 140 }}>
//           {remaining.overdue ? (
//             <p style={{ fontSize: 14, fontWeight: 800, color: "var(--red)", fontFamily: "sans-serif" }}>Overdue</p>
//           ) : (
//             <>
//               <div style={{ display: "flex", gap: 8, alignItems: "baseline", justifyContent: "center" }}>
//                 {(remaining.days > 0
//                   ? [{ val: remaining.days, unit: "d" }, { val: remaining.hours, unit: "h" }, { val: remaining.minutes, unit: "m" }]
//                   : [{ val: remaining.hours, unit: "h" }, { val: remaining.minutes, unit: "m" }, { val: remaining.seconds, unit: "s" }]
//                 ).map(seg => (
//                   <div key={seg.unit} style={{ textAlign: "center" }}>
//                     <span style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 800, color: remaining.color, lineHeight: 1 }}>
//                       {String(seg.val).padStart(2, "0")}
//                     </span>
//                     <span style={{ fontSize: 9, color: "var(--text-muted)", marginLeft: 1 }}>{seg.unit}</span>
//                   </div>
//                 ))}
//               </div>
//               <p style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>remaining</p>
//             </>
//           )}
//         </div>
//       </div>
//       {!remaining.overdue && (
//         <div style={{ marginTop: 10, height: 4, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
//           <div style={{ height: "100%", borderRadius: 99, background: remaining.color, width: remaining.urgent ? "25%" : "65%", transition: "width 1s linear" }} />
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Step 5 Candidate View ─────────────────────────────────────────────────────
// function Step5CandidatePanel({ track, applicantId, onSubmitSuccess }) {
//   const step4       = track.steps.find(s => s.stepNumber === 4);
//   const step4Approved = step4?.status === "approved";
//   const isCompleted = track.isCompleted;

//   if (!isCompleted && !step4Approved) {
//     return (
//       <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "40px 28px", textAlign: "center" }}>
//         <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
//         <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
//           Step 5 — Certificate & Completion
//         </p>
//         <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 400, margin: "0 auto" }}>
//           This step will be available once admin reviews and evaluates your <strong style={{ color: "var(--accent)" }}>Step 4 Final Submission</strong>.
//         </p>
//       </div>
//     );
//   }

//   if (!track.performanceRating && !track.overallFeedback) {
//     return (
//       <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "40px 28px", textAlign: "center" }}>
//         <div style={{ fontSize: 40, marginBottom: 14 }}>⏳</div>
//         <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>
//           Step 5 — Awaiting Admin Evaluation
//         </p>
//         <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 440, margin: "0 auto" }}>
//           Your Final Submission has been approved! Admin is now preparing your performance evaluation, feedback, and certificate. You'll see it here once it's ready.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
//       <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", gap: 14 }}>
//         <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>
//           🎓
//         </div>
//         <div style={{ flex: 1 }}>
//           <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Step 5 — Certificate & Completion</p>
//           <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Your internship evaluation and certificate are ready</p>
//         </div>
//         <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(34,160,107,0.3)", textTransform: "uppercase" }}>
//           Completed ✓
//         </span>
//       </div>

//       <div style={{ padding: "24px" }}>
//         <div style={{ background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)", padding: "16px 20px", marginBottom: 24, textAlign: "center" }}>
//           <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
//           <p style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 800, color: "var(--green)", marginBottom: 4 }}>
//             Congratulations! You've completed your internship.
//           </p>
//           <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Here is your performance evaluation from admin.</p>
//         </div>

//         {track.overallFeedback && (
//           <div style={{ marginBottom: 20 }}>
//             <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Admin Feedback</p>
//             <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "14px 16px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
//               {track.overallFeedback}
//             </div>
//           </div>
//         )}

//         {(track.certificateLink || track.lorLink || track.projectRepoLink) && (
//           <div style={{ marginBottom: 24 }}>
//             <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
//               Your Documents & Links
//             </p>
//             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//               {track.certificateLink && (
//                 <a href={track.certificateLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.35)", borderRadius: "var(--radius-sm)", textDecoration: "none" }}>
//                   <span style={{ fontSize: 20 }}>🎓</span>
//                   <div>
//                     <p style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", marginBottom: 1 }}>Download Certificate</p>
//                     <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{track.certificateLink}</p>
//                   </div>
//                   <span style={{ marginLeft: "auto", fontSize: 14, color: "var(--green)" }}>↗</span>
//                 </a>
//               )}
//               {track.lorLink && (
//                 <a href={track.lorLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", textDecoration: "none" }}>
//                   <span style={{ fontSize: 20 }}>📄</span>
//                   <div>
//                     <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", marginBottom: 1 }}>Letter of Recommendation</p>
//                     <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{track.lorLink}</p>
//                   </div>
//                   <span style={{ marginLeft: "auto", fontSize: 14, color: "var(--accent)" }}>↗</span>
//                 </a>
//               )}
//               {track.projectRepoLink && (
//                 <a href={track.projectRepoLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", textDecoration: "none" }}>
//                   <span style={{ fontSize: 20 }}>📂</span>
//                   <div>
//                     <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }}>Final Project Repository</p>
//                     <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{track.projectRepoLink}</p>
//                   </div>
//                   <span style={{ marginLeft: "auto", fontSize: 14, color: "var(--text-muted)" }}>↗</span>
//                 </a>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Step Rail ─────────────────────────────────────────────────────────────────
// function StepRail({ currentStep, steps, totalSteps, onSelect, activeIndex }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//       {Array.from({ length: totalSteps }).map((_, i) => {
//         const sNum     = i + 1;
//         const stepData = steps.find(s => s.stepNumber === sNum);
//         const status   = stepData?.status ?? "pending";
//         const isActive = sNum === activeIndex;
//         const isLocked = sNum > currentStep;
//         const deadline = stepData?.deadline;
//         const showDeadlineBadge = deadline && !isLocked && status !== "approved";

//         let dot = "var(--bg-hover)", dotBorder = "var(--border)", dotText = "var(--text-muted)";
//         if (status === "approved")        { dot = "var(--green)";  dotBorder = "var(--green)";  dotText = "#fff"; }
//         else if (status === "submitted")  { dot = "var(--blue)";   dotBorder = "var(--blue)";   dotText = "#fff"; }
//         else if (status === "rejected")   { dot = "var(--red)";    dotBorder = "var(--red)";    dotText = "#fff"; }
//         else if (sNum === currentStep)    { dot = "var(--accent)"; dotBorder = "var(--accent)"; dotText = "#fff"; }

//         const deadlineRemaining = showDeadlineBadge ? (() => {
//           const diff = new Date(deadline) - new Date();
//           if (diff <= 0) return { urgent: true, overdue: true };
//           return { urgent: Math.floor(diff / 86400000) <= 2, overdue: false };
//         })() : null;

//         return (
//           <div key={sNum} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
//               <button
//                 onClick={() => !isLocked && onSelect(sNum)}
//                 disabled={isLocked}
//                 style={{
//                   width: 32, height: 32, borderRadius: "50%",
//                   background: dot, border: `2px solid ${dotBorder}`, color: dotText,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontSize: 12, fontWeight: 800, fontFamily: "sans-serif",
//                   cursor: isLocked ? "not-allowed" : "pointer",
//                   boxShadow: isActive ? `0 0 0 3px var(--accent-dim)` : "none",
//                   transition: "all 0.2s", outline: "none",
//                 }}
//               >
//                 {status === "approved" ? "✓" : isLocked ? "🔒" : sNum}
//               </button>
//               {sNum < totalSteps && (
//                 <div style={{ width: 2, height: 24, marginTop: 2, background: status === "approved" ? "var(--green)" : "var(--border)", transition: "background 0.3s" }} />
//               )}
//             </div>
//             <div style={{ paddingTop: 6, paddingBottom: sNum < totalSteps ? 24 : 0, flex: 1, minWidth: 0 }}>
//               <p style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, lineHeight: 1.3, marginBottom: 2, color: isLocked ? "var(--text-muted)" : isActive ? "var(--accent)" : "var(--text-primary)" }}>
//                 {INTERNSHIP_STEPS[i]?.title}
//               </p>
//               {showDeadlineBadge && deadlineRemaining && (
//                 <span style={{
//                   fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 8,
//                   background: deadlineRemaining.overdue ? "var(--red-dim)" : deadlineRemaining.urgent ? "var(--yellow-dim)" : "var(--green-dim)",
//                   color: deadlineRemaining.overdue ? "var(--red)" : deadlineRemaining.urgent ? "var(--yellow)" : "var(--green)",
//                   border: `1px solid ${deadlineRemaining.overdue ? "rgba(227,73,53,0.3)" : deadlineRemaining.urgent ? "rgba(226,178,3,0.3)" : "rgba(34,160,107,0.3)"}`,
//                   display: "inline-block",
//                 }}>
//                   {deadlineRemaining.overdue ? "⚠ Overdue" : deadlineRemaining.urgent ? "⏰ Due soon" : "📅 Has deadline"}
//                 </span>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ─── Field Input ───────────────────────────────────────────────────────────────
// function FieldInput({ field, value, onChange, readOnly }) {
//   const base = {
//     width: "100%", boxSizing: "border-box",
//     background: readOnly ? "var(--bg)" : "var(--bg-card)",
//     border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
//     padding: "9px 12px",
//     color: readOnly ? "var(--text-secondary)" : "var(--text-primary)",
//     fontSize: 13, outline: "none", fontFamily: "DM Sans, sans-serif",
//     cursor: readOnly ? "default" : "text",
//   };
//   return (
//     <div style={{ marginBottom: 14 }}>
//       <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
//         {field.label} {field.required && <span style={{ color: "var(--red)" }}>*</span>}
//       </label>
//       {field.type === "textarea" ? (
//         <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={readOnly ? "—" : field.placeholder}
//           maxLength={field.maxLength} readOnly={readOnly} rows={4}
//           style={{ ...base, resize: "vertical", lineHeight: 1.6 }} />
//       ) : (
//         <input type={field.type === "url" ? "url" : "text"} value={value}
//           onChange={e => onChange(e.target.value)} placeholder={readOnly ? "—" : field.placeholder}
//           readOnly={readOnly} style={base} />
//       )}
//       {field.maxLength && !readOnly && (
//         <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "right", marginTop: 3 }}>{(value ?? "").length} / {field.maxLength}</p>
//       )}
//     </div>
//   );
// }

// // ─── Regular Step Panel (steps 1–4) ───────────────────────────────────────────
// function StepPanel({ stepConfig, stepData, isActive, isLocked, currentStep, applicantId, onSubmitSuccess }) {
//   const [formData, setFormData]   = useState({});
//   const [loading, setLoading]     = useState(false);
//   const [error, setError]         = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     if (stepData?.data) setFormData(stepData.data);
//     else setFormData({});
//   }, [stepData]);

//   const status   = stepData?.status ?? "pending";
//   const deadline = stepData?.deadline ?? null;
//   const canEdit  = isActive && (!stepData || status === "rejected" || status === "pending");
//   const readOnly = !canEdit;

//   const handleSubmit = async () => {
//     setLoading(true); setError("");
//     try {
//       const res = await fetch("/api/intern/track", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ applicantId, stepNumber: stepConfig.number, data: formData }),
//       });
//       const json = await res.json();
//       if (!res.ok) { setError(json.error); return; }
//       setSubmitted(true);
//       onSubmitSuccess();
//     } catch { setError("Network error. Please try again."); }
//     finally { setLoading(false); }
//   };

//   if (isLocked) {
//     return (
//       <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "40px 28px", textAlign: "center" }}>
//         <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
//         <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>Step {stepConfig.number} — Locked</p>
//         <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 360, margin: "0 auto" }}>
//           Complete <strong style={{ color: "var(--accent)" }}>Step {currentStep}</strong> first. Admin will unlock this step after review.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ background: "var(--bg-card)", border: `1px solid ${isActive ? "var(--accent-border)" : "var(--border)"}`, borderRadius: "var(--radius)", overflow: "hidden" }}>
//       <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: isActive ? "var(--bg)" : "transparent", display: "flex", alignItems: "center", gap: 14 }}>
//         <div style={{
//           width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
//           background: status === "approved" ? "var(--green)" : status === "submitted" ? "var(--blue)" : status === "rejected" ? "var(--red)" : isActive ? "var(--accent)" : "var(--bg-hover)",
//           color: ["approved","submitted","rejected"].includes(status) || isActive ? "#fff" : "var(--text-muted)",
//           display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800,
//         }}>
//           {status === "approved" ? "✓" : stepConfig.number}
//         </div>
//         <div style={{ flex: 1 }}>
//           <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>Step {stepConfig.number} — {stepConfig.title}</p>
//           <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{stepConfig.description}</p>
//         </div>
//         <span style={{
//           fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.5px",
//           background: status === "approved" ? "var(--green-dim)" : status === "submitted" ? "var(--blue-dim)" : status === "rejected" ? "var(--red-dim)" : "var(--bg-hover)",
//           color: status === "approved" ? "var(--green)" : status === "submitted" ? "var(--blue)" : status === "rejected" ? "var(--red)" : "var(--text-muted)",
//         }}>
//           {status === "approved" ? "Approved ✓" : status === "submitted" ? "Under Review" : status === "rejected" ? "Needs Revision" : "Not Started"}
//         </span>
//       </div>

//       <div style={{ padding: "22px 24px" }}>
//         {isActive && deadline && status !== "approved" && (
//           <DeadlineBanner deadline={deadline} stepStatus={status} />
//         )}

//         {stepData?.adminNote && (
//           <div style={{
//             marginBottom: 20, padding: "12px 16px",
//             background: status === "rejected" ? "var(--red-dim)" : "var(--green-dim)",
//             border: `1px solid ${status === "rejected" ? "rgba(227,73,53,0.3)" : "rgba(34,160,107,0.3)"}`,
//             borderRadius: "var(--radius-sm)",
//           }}>
//             <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, color: status === "rejected" ? "var(--red)" : "var(--green)" }}>
//               {status === "rejected" ? "❌ Admin Feedback — Please Revise" : "✓ Admin Note"}
//             </p>
//             <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{stepData.adminNote}</p>
//           </div>
//         )}

//         {stepConfig.fields.map(field => (
//           <FieldInput key={field.key} field={field} value={formData[field.key] ?? ""}
//             onChange={v => setFormData(p => ({ ...p, [field.key]: v }))} readOnly={readOnly} />
//         ))}

//         {status === "submitted" && !submitted && (
//           <div style={{ padding: "12px 16px", background: "var(--blue-dim)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "var(--radius-sm)", marginBottom: 14 }}>
//             <p style={{ fontSize: 13, color: "var(--blue)", fontWeight: 600 }}>🕐 Under Review — Admin will approve or leave feedback.</p>
//           </div>
//         )}
//         {submitted && (
//           <div style={{ padding: "12px 16px", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)", marginBottom: 14 }}>
//             <p style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>✓ Submitted! Awaiting admin review.</p>
//           </div>
//         )}
//         {error && <p style={{ fontSize: 12, color: "var(--red)", marginBottom: 12 }}>{error}</p>}
//         {canEdit && !submitted && (
//           <button onClick={handleSubmit} disabled={loading} style={{
//             padding: "11px 28px", background: "var(--accent)", color: "#fff",
//             border: "none", borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 700,
//             cursor: loading ? "not-allowed" : "pointer", fontFamily: "sans-serif", opacity: loading ? 0.7 : 1,
//           }}>
//             {loading ? "Submitting…" : `Submit Step ${stepConfig.number} →`}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Applicant Details Panel ───────────────────────────────────────────────────
// function ApplicantDetails({ applicant, projectKey }) {
//   const meta = PROJECT_META[projectKey] ?? { icon: "🎓", color: "#6366f1", label: "Internship" };
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 20px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
//           <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: `${meta.color}18`, border: `1px solid ${meta.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{meta.icon}</div>
//           <div>
//             <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Assigned Project</p>
//             <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{meta.label}</p>
//           </div>
//         </div>
//         <div style={{ background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)", padding: "8px 12px" }}>
//           <p style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>✓ Shortlisted — Internship Active</p>
//         </div>
//       </div>

//       <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 20px" }}>
//         <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Your Details</p>
//         {[
//           ["Full Name",        applicant.fullName],
//           ["Email",            applicant.email],
//           ["College",          applicant.college],
//           ["Branch",           applicant.branch],
//           ["Graduation Year",  applicant.graduationYear],
//           ["CGPA / %",         applicant.cgpa || "—"],
//         ].map(([l, v]) => (
//           <div key={l} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
//             <span style={{ fontSize: 11, color: "var(--text-muted)", width: 110, flexShrink: 0 }}>{l}</span>
//             <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, wordBreak: "break-all" }}>{v}</span>
//           </div>
//         ))}
//       </div>

//       <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 20px" }}>
//         <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Links</p>
//         <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//           {[{ label: "📄 Resume", url: applicant.resumeLink }, { label: "GitHub", url: applicant.githubUrl }].filter(l => l.url).map(l => (
//             <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
//               style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 600, padding: "6px 10px", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", display: "block" }}>
//               {l.label} ↗
//             </a>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ────────────────────────────────────────────────────────────
// export default function InternshipClient({ clerkUser, applicant, track: initialTrack, projectKey, projectName }) {
//   const [track, setTrack]           = useState(initialTrack);
//   const [activeStep, setActiveStep] = useState(initialTrack.currentStep);
//   const [view, setView]             = useState("tracker");
//   const meta = PROJECT_META[projectKey] ?? { icon: "🎓", color: "#6366f1", label: projectName };

//   const refreshTrack = async () => {
//     const res  = await fetch(`/api/intern/track?applicantId=${applicant.id}`);
//     const data = await res.json();
//     if (data.track) { setTrack(data.track); setActiveStep(data.track.currentStep); }
//   };

//   const approved = track.steps.filter(s => s.status === "approved").length;
//   const progress = Math.round((approved / INTERNSHIP_STEPS.length) * 100);

//   const activeStepConfig = INTERNSHIP_STEPS.find(s => s.number === activeStep);
//   const activeStepData   = track.steps.find(s => s.stepNumber === activeStep) ?? null;
//   const isLocked         = activeStep > track.currentStep;

//   return (
//     <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
//       <Navbar showBackLink={true} showDashboardLink={true} />

//       <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 80px" }}>

//         <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 20 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
//             <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: `${meta.color}18`, border: `1px solid ${meta.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{meta.icon}</div>
//             <div style={{ flex: 1, minWidth: 200 }}>
//               <h1 style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>{meta.label} — Internship Tracker</h1>
//               <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Hi {clerkUser.firstName ?? "there"} 👋 · Complete all 5 steps to finish your internship.</p>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
//               <div style={{ width: 120, height: 6, background: "var(--border)", borderRadius: 99 }}>
//                 <div style={{ height: "100%", borderRadius: 99, background: "var(--green)", width: `${progress}%`, transition: "width 0.5s" }} />
//               </div>
//               <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", whiteSpace: "nowrap" }}>{progress}% done</span>
//             </div>
//           </div>
//           <div style={{ display: "flex", gap: 4, marginTop: 18, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
//             {[{ key: "tracker", label: "📋 Internship Steps" }, { key: "details", label: "👤 My Application" }].map(t => (
//               <button key={t.key} onClick={() => setView(t.key)} style={{ padding: "7px 16px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", background: view === t.key ? "var(--accent)" : "transparent", color: view === t.key ? "#fff" : "var(--text-muted)", border: view === t.key ? "none" : "1px solid var(--border)", transition: "all 0.15s" }}>
//                 {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {view === "details" ? (
//           <ApplicantDetails applicant={applicant} projectKey={projectKey} />
//         ) : (
//           <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "start" }}>
//             <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px", position: "sticky", top: 76 }}>
//               <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Progress</p>
//               <StepRail currentStep={track.currentStep} steps={track.steps} totalSteps={INTERNSHIP_STEPS.length} onSelect={setActiveStep} activeIndex={activeStep} />
//               {track.isCompleted && (
//                 <div style={{ marginTop: 20, padding: "12px", textAlign: "center", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)" }}>
//                   <div style={{ fontSize: 24, marginBottom: 4 }}>🎓</div>
//                   <p style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>Completed!</p>
//                 </div>
//               )}
//             </div>

//             <div>
//               {!track.isCompleted && activeStep !== 5 && (
//                 <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
//                   <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, boxShadow: "0 0 0 3px var(--accent-dim)" }} />
//                   <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
//                     <strong style={{ color: "var(--accent)" }}>Step {track.currentStep}</strong> is currently active.
//                     {track.currentStep < INTERNSHIP_STEPS.length ? " Submit it — admin will review before unlocking the next step." : " This is the final step."}
//                   </p>
//                 </div>
//               )}

//               {activeStep === 5 ? (
//                 <Step5CandidatePanel
//                   track={track}
//                   applicantId={applicant.id}
//                   onSubmitSuccess={refreshTrack}
//                 />
//               ) : (
//                 activeStepConfig && (
//                   <StepPanel
//                     key={activeStep}
//                     stepConfig={activeStepConfig}
//                     stepData={activeStepData}
//                     isActive={activeStep === track.currentStep && !track.isCompleted}
//                     isLocked={isLocked}
//                     currentStep={track.currentStep}
//                     applicantId={applicant.id}
//                     onSubmitSuccess={refreshTrack}
//                   />
//                 )
//               )}
//             </div>
//           </div>
//         )}

//         {track.isCompleted && view === "tracker" && activeStep !== 5 && (
//           <div style={{ marginTop: 20, padding: "28px", textAlign: "center", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius)" }}>
//             <div style={{ fontSize: 52, marginBottom: 10 }}>🎓</div>
//             <h2 style={{ fontFamily: "sans-serif", fontSize: 20, fontWeight: 800, color: "var(--green)", marginBottom: 6 }}>Internship Completed!</h2>
//             <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 16px" }}>
//               Congratulations on completing your internship at <strong>{meta.label}</strong>.
//             </p>
//             <button onClick={() => setActiveStep(5)} style={{ padding: "10px 24px", background: "var(--green)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>
//               View Your Certificate & Feedback →
//             </button>
//           </div>
//         )}

//         <Footer />
//       </main>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import { INTERNSHIP_STEPS, STEP_STATUS_COLORS } from "../../lib/internshipSteps";

const PROJECT_META = {
  "data-analyst-intern": { icon: "📊", color: "#22a06b", label: "Data Analyst Intern" },
  "web-dev-intern":      { icon: "🌐", color: "#6366f1", label: "Web Developer Intern" },
};

// ─── Responsive hook ───────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

// ─── Live countdown hook ───────────────────────────────────────────────────────
function useCountdown(deadline, stepStatus) {
  const isApproved = stepStatus === "approved";

  const calc = () => {
    if (!deadline || isApproved) return null;
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return { label: "Deadline passed", urgent: true, overdue: true, color: "var(--red)", days: 0, hours: 0, minutes: 0, seconds: 0 };
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return {
      label:   days > 0 ? `${days}d ${hours}h ${minutes}m left` : `${hours}h ${minutes}m ${seconds}s left`,
      urgent:  days <= 2,
      overdue: false,
      color:   days <= 2 ? (days === 0 ? "var(--red)" : "var(--yellow)") : "var(--green)",
      days, hours, minutes, seconds,
    };
  };

  const [remaining, setRemaining] = useState(calc);
  useEffect(() => {
    if (!deadline || isApproved) { setRemaining(null); return; }
    const id = setInterval(() => setRemaining(calc()), 1000);
    return () => clearInterval(id);
  }, [deadline, isApproved]);

  return remaining;
}

// ─── Deadline Banner ───────────────────────────────────────────────────────────
function DeadlineBanner({ deadline, stepStatus }) {
  const remaining = useCountdown(deadline, stepStatus);
  if (!deadline || !remaining || stepStatus === "approved") return null;

  return (
    <div style={{
      border: `1px solid ${remaining.overdue ? "rgba(227,73,53,0.4)" : remaining.urgent ? "rgba(226,178,3,0.4)" : "rgba(34,160,107,0.3)"}`,
      borderRadius: "var(--radius-sm)", padding: "14px 16px", marginBottom: 20,
      background: remaining.overdue ? "var(--red-dim)" : remaining.urgent ? "var(--yellow-dim)" : "var(--green-dim)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, color: remaining.overdue ? "var(--red)" : remaining.urgent ? "var(--yellow)" : "var(--green)" }}>
            {remaining.overdue ? "⚠ Deadline Passed" : "⏰ Submission Deadline"}
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
            {new Date(deadline).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div style={{ background: "var(--bg-card)", border: `1px solid ${remaining.color}40`, borderRadius: 8, padding: "8px 16px", textAlign: "center", minWidth: 120 }}>
          {remaining.overdue ? (
            <p style={{ fontSize: 14, fontWeight: 800, color: "var(--red)", fontFamily: "sans-serif" }}>Overdue</p>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline", justifyContent: "center" }}>
                {(remaining.days > 0
                  ? [{ val: remaining.days, unit: "d" }, { val: remaining.hours, unit: "h" }, { val: remaining.minutes, unit: "m" }]
                  : [{ val: remaining.hours, unit: "h" }, { val: remaining.minutes, unit: "m" }, { val: remaining.seconds, unit: "s" }]
                ).map(seg => (
                  <div key={seg.unit} style={{ textAlign: "center" }}>
                    <span style={{ fontFamily: "sans-serif", fontSize: 18, fontWeight: 800, color: remaining.color, lineHeight: 1 }}>
                      {String(seg.val).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: 9, color: "var(--text-muted)", marginLeft: 1 }}>{seg.unit}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>remaining</p>
            </>
          )}
        </div>
      </div>
      {!remaining.overdue && (
        <div style={{ marginTop: 10, height: 4, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 99, background: remaining.color, width: remaining.urgent ? "25%" : "65%", transition: "width 1s linear" }} />
        </div>
      )}
    </div>
  );
}

// ─── Step 5 Candidate View ─────────────────────────────────────────────────────
function Step5CandidatePanel({ track, applicantId, onSubmitSuccess }) {
  const step4         = track.steps.find(s => s.stepNumber === 4);
  const step4Approved = step4?.status === "approved";
  const isCompleted   = track.isCompleted;

  if (!isCompleted && !step4Approved) {
    return (
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
        <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
          Step 5 — Certificate & Completion
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 400, margin: "0 auto" }}>
          This step will be available once admin reviews and evaluates your <strong style={{ color: "var(--accent)" }}>Step 4 Final Submission</strong>.
        </p>
      </div>
    );
  }

  if (!track.performanceRating && !track.overallFeedback) {
    return (
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>⏳</div>
        <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>
          Step 5 — Awaiting Admin Evaluation
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 440, margin: "0 auto" }}>
          Your Final Submission has been approved! Admin is now preparing your performance evaluation, feedback, and certificate. You'll see it here once it's ready.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
      <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, flexShrink: 0 }}>
          🎓
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Step 5 — Certificate & Completion</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Your internship evaluation and certificate are ready</p>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(34,160,107,0.3)", textTransform: "uppercase", flexShrink: 0 }}>
          Completed ✓
        </span>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)", padding: "16px 20px", marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
          <p style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 800, color: "var(--green)", marginBottom: 4 }}>
            Congratulations! You've completed your internship.
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Here is your performance evaluation from admin.</p>
        </div>

        {track.overallFeedback && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Admin Feedback</p>
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "14px 16px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {track.overallFeedback}
            </div>
          </div>
        )}

        {(track.certificateLink || track.lorLink || track.projectRepoLink) && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              Your Documents & Links
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {track.certificateLink && (
                <a href={track.certificateLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.35)", borderRadius: "var(--radius-sm)", textDecoration: "none" }}>
                  <span style={{ fontSize: 20 }}>🎓</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", marginBottom: 1 }}>Download Certificate</p>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.certificateLink}</p>
                  </div>
                  <span style={{ fontSize: 14, color: "var(--green)", flexShrink: 0 }}>↗</span>
                </a>
              )}
              {track.lorLink && (
                <a href={track.lorLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", textDecoration: "none" }}>
                  <span style={{ fontSize: 20 }}>📄</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", marginBottom: 1 }}>Letter of Recommendation</p>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.lorLink}</p>
                  </div>
                  <span style={{ fontSize: 14, color: "var(--accent)", flexShrink: 0 }}>↗</span>
                </a>
              )}
              {track.projectRepoLink && (
                <a href={track.projectRepoLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", textDecoration: "none" }}>
                  <span style={{ fontSize: 20 }}>📂</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }}>Final Project Repository</p>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.projectRepoLink}</p>
                  </div>
                  <span style={{ fontSize: 14, color: "var(--text-muted)", flexShrink: 0 }}>↗</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step Rail (vertical, used in sidebar on desktop / collapsible on mobile) ──
function StepRail({ currentStep, steps, totalSteps, onSelect, activeIndex }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const sNum     = i + 1;
        const stepData = steps.find(s => s.stepNumber === sNum);
        const status   = stepData?.status ?? "pending";
        const isActive = sNum === activeIndex;
        const isLocked = sNum > currentStep;
        const deadline = stepData?.deadline;
        const showDeadlineBadge = deadline && !isLocked && status !== "approved";

        let dot = "var(--bg-hover)", dotBorder = "var(--border)", dotText = "var(--text-muted)";
        if (status === "approved")        { dot = "var(--green)";  dotBorder = "var(--green)";  dotText = "#fff"; }
        else if (status === "submitted")  { dot = "var(--blue)";   dotBorder = "var(--blue)";   dotText = "#fff"; }
        else if (status === "rejected")   { dot = "var(--red)";    dotBorder = "var(--red)";    dotText = "#fff"; }
        else if (sNum === currentStep)    { dot = "var(--accent)"; dotBorder = "var(--accent)"; dotText = "#fff"; }

        const deadlineRemaining = showDeadlineBadge ? (() => {
          const diff = new Date(deadline) - new Date();
          if (diff <= 0) return { urgent: true, overdue: true };
          return { urgent: Math.floor(diff / 86400000) <= 2, overdue: false };
        })() : null;

        return (
          <div key={sNum} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <button
                onClick={() => !isLocked && onSelect(sNum)}
                disabled={isLocked}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: dot, border: `2px solid ${dotBorder}`, color: dotText,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, fontFamily: "sans-serif",
                  cursor: isLocked ? "not-allowed" : "pointer",
                  boxShadow: isActive ? `0 0 0 3px var(--accent-dim)` : "none",
                  transition: "all 0.2s", outline: "none",
                }}
              >
                {status === "approved" ? "✓" : isLocked ? "🔒" : sNum}
              </button>
              {sNum < totalSteps && (
                <div style={{ width: 2, height: 24, marginTop: 2, background: status === "approved" ? "var(--green)" : "var(--border)", transition: "background 0.3s" }} />
              )}
            </div>
            <div style={{ paddingTop: 6, paddingBottom: sNum < totalSteps ? 24 : 0, flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, lineHeight: 1.3, marginBottom: 2, color: isLocked ? "var(--text-muted)" : isActive ? "var(--accent)" : "var(--text-primary)" }}>
                {INTERNSHIP_STEPS[i]?.title}
              </p>
              {showDeadlineBadge && deadlineRemaining && (
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 8,
                  background: deadlineRemaining.overdue ? "var(--red-dim)" : deadlineRemaining.urgent ? "var(--yellow-dim)" : "var(--green-dim)",
                  color: deadlineRemaining.overdue ? "var(--red)" : deadlineRemaining.urgent ? "var(--yellow)" : "var(--green)",
                  border: `1px solid ${deadlineRemaining.overdue ? "rgba(227,73,53,0.3)" : deadlineRemaining.urgent ? "rgba(226,178,3,0.3)" : "rgba(34,160,107,0.3)"}`,
                  display: "inline-block",
                }}>
                  {deadlineRemaining.overdue ? "⚠ Overdue" : deadlineRemaining.urgent ? "⏰ Due soon" : "📅 Has deadline"}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Mobile Step Progress Bar (horizontal pill strip) ─────────────────────────
function MobileStepBar({ currentStep, steps, totalSteps, onSelect, activeIndex }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const sNum     = i + 1;
        const stepData = steps.find(s => s.stepNumber === sNum);
        const status   = stepData?.status ?? "pending";
        const isActive = sNum === activeIndex;
        const isLocked = sNum > currentStep;

        let bg = "var(--bg-hover)", border = "var(--border)", color = "var(--text-muted)";
        if (status === "approved")      { bg = "var(--green)";  border = "var(--green)";  color = "#fff"; }
        else if (status === "submitted"){ bg = "var(--blue)";   border = "var(--blue)";   color = "#fff"; }
        else if (status === "rejected") { bg = "var(--red)";    border = "var(--red)";    color = "#fff"; }
        else if (sNum === currentStep)  { bg = "var(--accent)"; border = "var(--accent)"; color = "#fff"; }

        return (
          <button
            key={sNum}
            onClick={() => !isLocked && onSelect(sNum)}
            disabled={isLocked}
            style={{
              flexShrink: 0,
              width: 34, height: 34, borderRadius: "50%",
              background: bg, border: `2px solid ${border}`, color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, fontFamily: "sans-serif",
              cursor: isLocked ? "not-allowed" : "pointer",
              boxShadow: isActive ? `0 0 0 3px var(--accent-dim)` : "none",
              transition: "all 0.2s", outline: "none",
              opacity: isLocked ? 0.6 : 1,
            }}
          >
            {status === "approved" ? "✓" : isLocked ? "🔒" : sNum}
          </button>
        );
      })}
      <div style={{ flex: 1, minWidth: 8 }} />
    </div>
  );
}

// ─── Field Input ───────────────────────────────────────────────────────────────
function FieldInput({ field, value, onChange, readOnly }) {
  const base = {
    width: "100%", boxSizing: "border-box",
    background: readOnly ? "var(--bg)" : "var(--bg-card)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
    padding: "9px 12px",
    color: readOnly ? "var(--text-secondary)" : "var(--text-primary)",
    fontSize: 13, outline: "none", fontFamily: "DM Sans, sans-serif",
    cursor: readOnly ? "default" : "text",
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {field.label} {field.required && <span style={{ color: "var(--red)" }}>*</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={readOnly ? "—" : field.placeholder}
          maxLength={field.maxLength} readOnly={readOnly} rows={4}
          style={{ ...base, resize: "vertical", lineHeight: 1.6 }} />
      ) : (
        <input type={field.type === "url" ? "url" : "text"} value={value}
          onChange={e => onChange(e.target.value)} placeholder={readOnly ? "—" : field.placeholder}
          readOnly={readOnly} style={base} />
      )}
      {field.maxLength && !readOnly && (
        <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "right", marginTop: 3 }}>{(value ?? "").length} / {field.maxLength}</p>
      )}
    </div>
  );
}

// ─── Regular Step Panel (steps 1–4) ───────────────────────────────────────────
function StepPanel({ stepConfig, stepData, isActive, isLocked, currentStep, applicantId, onSubmitSuccess }) {
  const [formData, setFormData]   = useState({});
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (stepData?.data) setFormData(stepData.data);
    else setFormData({});
  }, [stepData]);

  const status   = stepData?.status ?? "pending";
  const deadline = stepData?.deadline ?? null;
  const canEdit  = isActive && (!stepData || status === "rejected" || status === "pending");
  const readOnly = !canEdit;

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/intern/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId, stepNumber: stepConfig.number, data: formData }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error); return; }
      setSubmitted(true);
      onSubmitSuccess();
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  if (isLocked) {
    return (
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>Step {stepConfig.number} — Locked</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 360, margin: "0 auto" }}>
          Complete <strong style={{ color: "var(--accent)" }}>Step {currentStep}</strong> first. Admin will unlock this step after review.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-card)", border: `1px solid ${isActive ? "var(--accent-border)" : "var(--border)"}`, borderRadius: "var(--radius)", overflow: "hidden" }}>
      {/* Step header — wraps on small screens */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: isActive ? "var(--bg)" : "transparent" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
            background: status === "approved" ? "var(--green)" : status === "submitted" ? "var(--blue)" : status === "rejected" ? "var(--red)" : isActive ? "var(--accent)" : "var(--bg-hover)",
            color: ["approved","submitted","rejected"].includes(status) || isActive ? "#fff" : "var(--text-muted)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800,
          }}>
            {status === "approved" ? "✓" : stepConfig.number}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>Step {stepConfig.number} — {stepConfig.title}</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{stepConfig.description}</p>
          </div>
          {/* Status badge moves below on very small screens via its own line */}
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.5px", flexShrink: 0,
            background: status === "approved" ? "var(--green-dim)" : status === "submitted" ? "var(--blue-dim)" : status === "rejected" ? "var(--red-dim)" : "var(--bg-hover)",
            color: status === "approved" ? "var(--green)" : status === "submitted" ? "var(--blue)" : status === "rejected" ? "var(--red)" : "var(--text-muted)",
          }}>
            {status === "approved" ? "Approved ✓" : status === "submitted" ? "Under Review" : status === "rejected" ? "Needs Revision" : "Not Started"}
          </span>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {isActive && deadline && status !== "approved" && (
          <DeadlineBanner deadline={deadline} stepStatus={status} />
        )}

        {stepData?.adminNote && (
          <div style={{
            marginBottom: 20, padding: "12px 16px",
            background: status === "rejected" ? "var(--red-dim)" : "var(--green-dim)",
            border: `1px solid ${status === "rejected" ? "rgba(227,73,53,0.3)" : "rgba(34,160,107,0.3)"}`,
            borderRadius: "var(--radius-sm)",
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, color: status === "rejected" ? "var(--red)" : "var(--green)" }}>
              {status === "rejected" ? "❌ Admin Feedback — Please Revise" : "✓ Admin Note"}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{stepData.adminNote}</p>
          </div>
        )}

        {stepConfig.fields.map(field => (
          <FieldInput key={field.key} field={field} value={formData[field.key] ?? ""}
            onChange={v => setFormData(p => ({ ...p, [field.key]: v }))} readOnly={readOnly} />
        ))}

        {status === "submitted" && !submitted && (
          <div style={{ padding: "12px 16px", background: "var(--blue-dim)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "var(--radius-sm)", marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: "var(--blue)", fontWeight: 600 }}>🕐 Under Review — Admin will approve or leave feedback.</p>
          </div>
        )}
        {submitted && (
          <div style={{ padding: "12px 16px", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)", marginBottom: 14 }}>
            <p style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>✓ Submitted! Awaiting admin review.</p>
          </div>
        )}
        {error && <p style={{ fontSize: 12, color: "var(--red)", marginBottom: 12 }}>{error}</p>}
        {canEdit && !submitted && (
          <button onClick={handleSubmit} disabled={loading} style={{
            width: "100%", padding: "12px 28px", background: "var(--accent)", color: "#fff",
            border: "none", borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer", fontFamily: "sans-serif", opacity: loading ? 0.7 : 1,
            maxWidth: 320,
          }}>
            {loading ? "Submitting…" : `Submit Step ${stepConfig.number} →`}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Applicant Details Panel ───────────────────────────────────────────────────
function ApplicantDetails({ applicant, projectKey }) {
  const meta = PROJECT_META[projectKey] ?? { icon: "🎓", color: "#6366f1", label: "Internship" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: `${meta.color}18`, border: `1px solid ${meta.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{meta.icon}</div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Assigned Project</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{meta.label}</p>
          </div>
        </div>
        <div style={{ background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)", padding: "8px 12px" }}>
          <p style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>✓ Shortlisted — Internship Active</p>
        </div>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 20px" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Your Details</p>
        {[
          ["Full Name",        applicant.fullName],
          ["Email",            applicant.email],
          ["College",          applicant.college],
          ["Branch",           applicant.branch],
          ["Graduation Year",  applicant.graduationYear],
          ["CGPA / %",         applicant.cgpa || "—"],
        ].map(([l, v]) => (
          <div key={l} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", width: 110, flexShrink: 0 }}>{l}</span>
            <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, wordBreak: "break-all", flex: 1 }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 20px" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Links</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[{ label: "📄 Resume", url: applicant.resumeLink }, { label: "GitHub", url: applicant.githubUrl }].filter(l => l.url).map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 600, padding: "6px 10px", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", display: "block" }}>
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function InternshipClient({ clerkUser, applicant, track: initialTrack, projectKey, projectName }) {
  const [track, setTrack]               = useState(initialTrack);
  const [activeStep, setActiveStep]     = useState(initialTrack.currentStep);
  const [view, setView]                 = useState("tracker");
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const isMobile                        = useIsMobile(768);
  const meta = PROJECT_META[projectKey] ?? { icon: "🎓", color: "#6366f1", label: projectName };

  const refreshTrack = async () => {
    const res  = await fetch(`/api/intern/track?applicantId=${applicant.id}`);
    const data = await res.json();
    if (data.track) { setTrack(data.track); setActiveStep(data.track.currentStep); }
  };

  const handleStepSelect = (sNum) => {
    setActiveStep(sNum);
    setSidebarOpen(false); // close sidebar on mobile after selection
  };

  const approved = track.steps.filter(s => s.status === "approved").length;
  const progress = Math.round((approved / INTERNSHIP_STEPS.length) * 100);

  const activeStepConfig = INTERNSHIP_STEPS.find(s => s.number === activeStep);
  const activeStepData   = track.steps.find(s => s.stepNumber === activeStep) ?? null;
  const isLocked         = activeStep > track.currentStep;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <Navbar showBackLink={true} showDashboardLink={true} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "16px 12px 80px" : "28px 20px 80px" }}>

        {/* ── Header card ── */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: isMobile ? "16px" : "20px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: `${meta.color}18`, border: `1px solid ${meta.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{meta.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontFamily: "sans-serif", fontSize: isMobile ? 15 : 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>{meta.label} — Internship Tracker</h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Hi {clerkUser.firstName ?? "there"} 👋 · Complete all 5 steps to finish your internship.</p>
            </div>
            {/* Progress bar — full width on mobile */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, width: isMobile ? "100%" : "auto" }}>
              <div style={{ flex: 1, height: 6, background: "var(--border)", borderRadius: 99, minWidth: isMobile ? 0 : 120 }}>
                <div style={{ height: "100%", borderRadius: 99, background: "var(--green)", width: `${progress}%`, transition: "width 0.5s" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", whiteSpace: "nowrap" }}>{progress}% done</span>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 4, marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
            {[{ key: "tracker", label: "📋 Internship Steps" }, { key: "details", label: "👤 My Application" }].map(t => (
              <button key={t.key} onClick={() => setView(t.key)} style={{
                flex: isMobile ? 1 : "none",
                padding: isMobile ? "9px 10px" : "7px 16px",
                borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                background: view === t.key ? "var(--accent)" : "transparent",
                color: view === t.key ? "#fff" : "var(--text-muted)",
                border: view === t.key ? "none" : "1px solid var(--border)", transition: "all 0.15s",
                textAlign: "center",
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {view === "details" ? (
          <ApplicantDetails applicant={applicant} projectKey={projectKey} />
        ) : (
          <>
            {/* ── Mobile: horizontal step strip ── */}
            {isMobile && (
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 16px", marginBottom: 14 }}>
                <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Progress</p>
                <MobileStepBar
                  currentStep={track.currentStep}
                  steps={track.steps}
                  totalSteps={INTERNSHIP_STEPS.length}
                  onSelect={handleStepSelect}
                  activeIndex={activeStep}
                />
                {/* Active step label */}
                <p style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600, marginTop: 10 }}>
                  Step {activeStep}: {INTERNSHIP_STEPS.find(s => s.number === activeStep)?.title}
                </p>
                {track.isCompleted && (
                  <div style={{ marginTop: 10, padding: "8px 12px", textAlign: "center", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <span style={{ fontSize: 18 }}>🎓</span>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>Internship Completed!</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Desktop: sidebar + content grid ── */}
            <div style={{
              display: isMobile ? "block" : "grid",
              gridTemplateColumns: isMobile ? undefined : "240px 1fr",
              gap: 20,
              alignItems: "start",
            }}>
              {/* Sidebar — hidden on mobile (replaced by MobileStepBar above) */}
              {!isMobile && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px", position: "sticky", top: 76 }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Progress</p>
                  <StepRail
                    currentStep={track.currentStep}
                    steps={track.steps}
                    totalSteps={INTERNSHIP_STEPS.length}
                    onSelect={setActiveStep}
                    activeIndex={activeStep}
                  />
                  {track.isCompleted && (
                    <div style={{ marginTop: 20, padding: "12px", textAlign: "center", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)" }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>🎓</div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>Completed!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Main content */}
              <div>
                {!track.isCompleted && activeStep !== 5 && (
                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 4, boxShadow: "0 0 0 3px var(--accent-dim)" }} />
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      <strong style={{ color: "var(--accent)" }}>Step {track.currentStep}</strong> is currently active.
                      {track.currentStep < INTERNSHIP_STEPS.length ? " Submit it — admin will review before unlocking the next step." : " This is the final step."}
                    </p>
                  </div>
                )}

                {activeStep === 5 ? (
                  <Step5CandidatePanel track={track} applicantId={applicant.id} onSubmitSuccess={refreshTrack} />
                ) : (
                  activeStepConfig && (
                    <StepPanel
                      key={activeStep}
                      stepConfig={activeStepConfig}
                      stepData={activeStepData}
                      isActive={activeStep === track.currentStep && !track.isCompleted}
                      isLocked={isLocked}
                      currentStep={track.currentStep}
                      applicantId={applicant.id}
                      onSubmitSuccess={refreshTrack}
                    />
                  )
                )}
              </div>
            </div>
          </>
        )}

        {/* ── Completion banner ── */}
        {track.isCompleted && view === "tracker" && activeStep !== 5 && (
          <div style={{ marginTop: 20, padding: isMobile ? "24px 16px" : "28px", textAlign: "center", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius)" }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>🎓</div>
            <h2 style={{ fontFamily: "sans-serif", fontSize: isMobile ? 17 : 20, fontWeight: 800, color: "var(--green)", marginBottom: 6 }}>Internship Completed!</h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 16px" }}>
              Congratulations on completing your internship at <strong>{meta.label}</strong>.
            </p>
            <button onClick={() => setActiveStep(5)} style={{ padding: "10px 24px", background: "var(--green)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", width: isMobile ? "100%" : "auto" }}>
              View Your Certificate & Feedback →
            </button>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}