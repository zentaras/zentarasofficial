// "use client";

// import { useState, useEffect } from "react";
// import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
// import Link from "next/link";
// import Navbar from "./Components/navbar";
// import Footer from "./Components/footer";

// const PROJECTS = [
//   {
//     id: "ai-resume-screener",
//     tag: "AI / ML",
//     tagColor: "accent",
//     icon: "🤖",
//     title: "AI-Powered Resume Screener",
//     subtitle: "Build an intelligent system that ranks resumes against job descriptions using NLP + ML.",
//     description: "We're building an end-to-end resume screening pipeline that parses resumes, extracts entities (skills, experience, education) using spaCy/NLTK, and scores them against a job description using cosine similarity and a fine-tuned BERT model. You'll work on the ML core, evaluation benchmarks, and a lightweight FastAPI layer.",
//     duration: "3 Months",
//     mode: "Remote",
//     type: "Unpaid · Experience-based",
//     stack: ["Python", "spaCy", "HuggingFace", "FastAPI", "PostgreSQL"],
//     requirements: [
//       "Strong Python fundamentals (OOP, file handling)",
//       "Familiarity with NLP concepts (tokenisation, embeddings, similarity)",
//       "Basic understanding of ML pipelines and scikit-learn",
//       "Exposure to REST APIs (Flask or FastAPI)",
//       "Git basics for collaborative development",
//     ],
//     deliverables: [
//       "Resume parser with entity extraction",
//       "Scoring engine using BERT embeddings",
//       "API endpoint + Postman documentation",
//       "Final report with benchmark results",
//     ],
//     openings: 2,
//     deadline: "June 10, 2025",
//     extraField: null,
//   },
//   {
//     id: "ecommerce-analytics",
//     tag: "Data Analytics",
//     tagColor: "green",
//     icon: "📊",
//     title: "E-Commerce Sales Analytics Dashboard",
//     subtitle: "Turn raw transactional data into actionable insights with Python, SQL, and Plotly.",
//     description: "We have 2+ years of raw e-commerce order data sitting in CSV dumps. This project involves cleaning it with pandas, building a star-schema in PostgreSQL, writing analytical SQL queries, and creating an interactive Plotly Dash or Power BI dashboard covering cohort retention, RFM segmentation, and monthly revenue trends.",
//     duration: "2 Months",
//     mode: "Remote",
//     type: "Unpaid · Experience-based",
//     stack: ["Python", "Pandas", "PostgreSQL", "Plotly Dash", "Power BI"],
//     requirements: [
//       "Proficient in Python pandas and data wrangling",
//       "SQL queries — GROUP BY, JOINs, window functions",
//       "Basic statistics (mean, median, distribution understanding)",
//       "Any data visualisation experience (matplotlib, seaborn, etc.)",
//       "Bonus: Power BI or Tableau exposure",
//     ],
//     deliverables: [
//       "Cleaned, normalised PostgreSQL data warehouse",
//       "10+ analytical SQL query library",
//       "Interactive Plotly Dash or Power BI dashboard",
//       "Executive summary PDF with key findings",
//     ],
//     openings: 3,
//     deadline: "June 5, 2025",
//     extraField: "projectLink",
//   },
//   {
//     id: "sentiment-dashboard",
//     tag: "NLP / ML",
//     tagColor: "yellow",
//     icon: "🧠",
//     title: "Real-Time Social Sentiment Dashboard",
//     subtitle: "Stream tweets/Reddit posts, run sentiment classification, and visualise trends live.",
//     description: "This project involves building a real-time pipeline: Twitter/Reddit API → Kafka (or simple queuing) → sentiment model (VADER + fine-tuned RoBERTa) → time-series database → live Streamlit/Dash dashboard. You'll implement multi-class sentiment and track topic trends over time.",
//     duration: "2.5 Months",
//     mode: "Remote",
//     type: "Unpaid · Experience-based",
//     stack: ["Python", "Transformers", "Streamlit", "Redis", "PostgreSQL"],
//     requirements: [
//       "Python proficiency, comfortable with async/streaming patterns",
//       "NLP background — text pre-processing, classification",
//       "Any experience with HuggingFace Transformers is a strong plus",
//       "Basic understanding of REST APIs and webhooks",
//       "Interest in social media data and trend analysis",
//     ],
//     deliverables: [
//       "Ingestion pipeline (API → queue → DB)",
//       "Fine-tuned sentiment classifier with evaluation metrics",
//       "Live Streamlit dashboard with topic filters",
//       "Documentation + architecture diagram",
//     ],
//     openings: 2,
//     deadline: "June 15, 2025",
//     extraField: "nlpExperience",
//   },
// ];

// const TOTAL_PROJECTS = PROJECTS.length;
// const TOTAL_OPENINGS = PROJECTS.reduce((sum, p) => sum + p.openings, 0);

// const tagStyles = {
//   accent: { bg: "var(--accent-dim)", border: "var(--accent-border)", color: "var(--accent)" },
//   green:  { bg: "var(--green-dim)",  border: "rgba(34,160,107,0.3)",  color: "var(--green)"  },
//   yellow: { bg: "var(--yellow-dim)", border: "rgba(226,178,3,0.3)",   color: "var(--yellow)" },
// };

// function statusChip(status) {
//   if (status === "Shortlisted") return { label: "✓ Shortlisted", bg: "var(--green-dim)", color: "var(--green)", border: "rgba(34,160,107,0.3)" };
//   if (status === "Rejected")    return { label: "✕ Rejected",    bg: "var(--red-dim)",   color: "var(--red)",   border: "rgba(227,73,53,0.25)" };
//   return                               { label: "⏳ Pending",     bg: "var(--blue-dim)",  color: "var(--blue)",  border: "rgba(87,157,255,0.25)" };
// }

// // ── Two-step Apply Modal ──────────────────────────────────────────────────
// function ApplyModal({ project, onClose, onSuccess }) {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({ project: project.id });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const tagStyle = tagStyles[project.tagColor];

//   const handleChange = (e) =>
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch("/api/apply", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (!res.ok) setError(data.error || "Something went wrong.");
//       else { setSuccess(true); onSuccess?.(); }
//     } catch {
//       setError("Please login.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{
//       position: "fixed", inset: 0, zIndex: 100,
//       background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
//       display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
//     }} onClick={onClose}>
//       <div style={{
//         background: "var(--bg-card)", border: "1px solid var(--border-light)",
//         borderRadius: 12, width: "100%", maxWidth: 600,
//         maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column",
//         boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
//       }} onClick={e => e.stopPropagation()}>

//         {success ? (
//           <div style={{ padding: "56px 32px", textAlign: "center" }}>
//             <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
//             <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 10 }}>
//               Application Submitted!
//             </h2>
//             <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, maxWidth: 360, margin: "0 auto 28px" }}>
//               We'll review your application for <strong style={{ color: "var(--text-primary)" }}>{project.title}</strong> and get back within 5–7 working days.
//             </p>
//             <button onClick={onClose} style={{
//               background: "var(--accent)", color: "#fff", border: "none",
//               borderRadius: "var(--radius-sm)", padding: "10px 28px",
//               fontSize: 14, fontWeight: 600, cursor: "pointer",
//             }}>Close</button>
//           </div>

//         ) : step === 1 ? (
//           <>
//             <div style={{
//               padding: "20px 24px 16px", borderBottom: "1px solid var(--border)",
//               display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0,
//             }}>
//               <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
//                 <div style={{
//                   width: 42, height: 42, borderRadius: 10, flexShrink: 0,
//                   background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
//                   display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
//                 }}>{project.icon}</div>
//                 <div>
//                   <p style={{ fontSize: 10, fontWeight: 700, color: tagStyle.color, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 2 }}>
//                     {project.tag}
//                   </p>
//                   <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>
//                     {project.title}
//                   </h2>
//                 </div>
//               </div>
//               <button onClick={onClose} style={{
//                 background: "var(--bg-hover)", border: "1px solid var(--border)",
//                 borderRadius: 6, width: 28, height: 28, cursor: "pointer",
//                 color: "var(--text-muted)", fontSize: 14,
//                 display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//               }}>✕</button>
//             </div>

//             <div style={{ padding: "20px 24px 24px", overflowY: "auto", flex: 1 }}>
//               <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
//                 {[project.duration, project.mode, project.type, `Deadline: ${project.deadline}`].map(c => (
//                   <span key={c} style={{
//                     fontSize: 11, padding: "3px 9px", borderRadius: 4,
//                     background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)",
//                   }}>{c}</span>
//                 ))}
//               </div>
//               <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
//                 {project.description}
//               </p>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", marginBottom: 20 }}>
//                 <div>
//                   <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingBottom: 5, borderBottom: "1px solid var(--border)" }}>
//                     Requirements
//                   </p>
//                   <ul style={{ listStyle: "none", padding: 0 }}>
//                     {project.requirements.map(r => (
//                       <li key={r} style={{ fontSize: 12, color: "var(--text-secondary)", padding: "5px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 6, lineHeight: 1.5 }}>
//                         <span style={{ color: tagStyle.color, flexShrink: 0 }}>›</span> {r}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div>
//                   <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingBottom: 5, borderBottom: "1px solid var(--border)" }}>
//                     What You'll Build
//                   </p>
//                   <ul style={{ listStyle: "none", padding: 0 }}>
//                     {project.deliverables.map(d => (
//                       <li key={d} style={{ fontSize: 12, color: "var(--text-secondary)", padding: "5px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 6, lineHeight: 1.5 }}>
//                         <span style={{ color: "var(--green)", flexShrink: 0 }}>✓</span> {d}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//               <div style={{ marginBottom: 20 }}>
//                 <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Tech Stack</p>
//                 <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
//                   {project.stack.map(s => (
//                     <span key={s} style={{
//                       fontSize: 11, padding: "3px 9px", borderRadius: 3,
//                       background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
//                       color: tagStyle.color, fontWeight: 700,
//                     }}>{s}</span>
//                   ))}
//                 </div>
//               </div>
//               <div style={{
//                 background: "var(--yellow-dim)", border: "1px solid rgba(226,178,3,0.3)",
//                 borderRadius: "var(--radius-sm)", padding: "10px 14px",
//                 fontSize: 12, color: "var(--yellow)", marginBottom: 20, fontWeight: 500,
//               }}>
//                 ⚠️ This is an <strong>unpaid, experience-based internship</strong>. You'll receive mentorship and a Letter of Recommendation upon completion.
//               </div>
//               <button onClick={() => setStep(2)} style={{
//                 width: "100%", padding: "11px 0",
//                 background: "var(--accent)", color: "#fff", border: "none",
//                 borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 700,
//                 cursor: "pointer", fontFamily: "Syne, sans-serif",
//               }}>
//                 Apply 
//               </button>
//             </div>
//           </>

//         ) : (
//           <>
//             <div style={{
//               padding: "16px 24px", borderBottom: "1px solid var(--border)",
//               display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
//             }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <button onClick={() => setStep(1)} style={{
//                   background: "var(--bg-hover)", border: "1px solid var(--border)",
//                   borderRadius: 6, width: 28, height: 28, cursor: "pointer",
//                   color: "var(--text-muted)", fontSize: 14,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>←</button>
//                 <div>
//                   <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>
//                     Apply — {project.title}
//                   </h2>
//                   <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>Step 2 of 2 · Fill in your details</p>
//                 </div>
//               </div>
//               <button onClick={onClose} style={{
//                 background: "var(--bg-hover)", border: "1px solid var(--border)",
//                 borderRadius: 6, width: 28, height: 28, cursor: "pointer",
//                 color: "var(--text-muted)", fontSize: 14,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//               }}>✕</button>
//             </div>

//             <div style={{ padding: "18px 24px 24px", overflowY: "auto", flex: 1 }}>
//               {error && (
//                 <div style={{
//                   background: "var(--red-dim)", border: "1px solid rgba(227,73,53,0.25)",
//                   borderRadius: "var(--radius-sm)", padding: "10px 14px",
//                   fontSize: 13, color: "var(--red)", marginBottom: 16,
//                 }}>{error}</div>
//               )}
//               <SectionLabel>Personal Details</SectionLabel>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
//                 <FormField label="Full Name *" name="fullName" type="text" placeholder="Arjun Sharma" onChange={handleChange} />
//                 <FormField label="Email Address *" name="email" type="email" placeholder="arjun@college.edu" onChange={handleChange} />
//               </div>
//               <FormField label="Phone (optional)" name="phone" type="tel" placeholder="+91 98765 43210" onChange={handleChange} />
//               <SectionLabel>Academic Details</SectionLabel>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
//                 <FormField label="College / University *" name="college" type="text" placeholder="KIET Group of Institutions" onChange={handleChange} />
//                 <FormField label="Branch / Department *" name="branch" type="text" placeholder="Computer Science & Engineering" onChange={handleChange} />
//                 <FormField label="Graduation Year *" name="graduationYear" type="text" placeholder="2026" onChange={handleChange} />
//                 <FormField label="CGPA / % (optional)" name="cgpa" type="text" placeholder="8.4 / 10" onChange={handleChange} />
//               </div>
//               <SectionLabel>Profiles & Resume</SectionLabel>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
//                 <FormField label="LinkedIn (optional)" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." onChange={handleChange} />
//                 <FormField label="GitHub (optional)" name="githubUrl" type="url" placeholder="https://github.com/..." onChange={handleChange} />
//               </div>
//               <FormField label="Resume Link (Drive / Notion) *" name="resumeLink" type="url" placeholder="https://drive.google.com/..." onChange={handleChange} />
//               <SectionLabel>Technical Background</SectionLabel>
//               <FormField label="Tools & Technologies You Know *" name="toolsKnown" type="text" placeholder="Python, pandas, scikit-learn, SQL, Git..." onChange={handleChange} />
//               {project.extraField === "projectLink" && (
//                 <FormField label="Past Data/Analytics Project Link (optional)" name="projectLink" type="url" placeholder="GitHub / Kaggle / Colab link" onChange={handleChange} />
//               )}
//               {project.extraField === "nlpExperience" && (
//                 <FormTextarea label="Describe Your NLP Experience *" name="nlpExperience" placeholder="E.g., built a sentiment classifier using NLTK..." onChange={handleChange} />
//               )}
//               <FormTextarea label="Prior Experience / Projects *" name="priorExperience" placeholder="Describe any relevant projects, coursework, or work experience..." onChange={handleChange} />
//               <FormTextarea label="Why do you want to work on this project? *" name="whyInterested" placeholder="Tell us what excites you about this specific project..." onChange={handleChange} />
//               <SectionLabel>Availability</SectionLabel>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
//                 <div className="form-group">
//                   <label className="form-label">Availability *</label>
//                   <select className="form-select" name="availability" required onChange={handleChange} defaultValue="">
//                     <option value="" disabled>Select…</option>
//                     <option value="Full-time (40 hrs/week)">Full-time (40 hrs/week)</option>
//                     <option value="Part-time (20 hrs/week)">Part-time (20 hrs/week)</option>
//                   </select>
//                 </div>
//                 <FormField label="Earliest Start Date *" name="startDate" type="date" onChange={handleChange} />
//               </div>
//               <button onClick={handleSubmit} disabled={loading} style={{
//                 width: "100%", marginTop: 16, padding: "11px 0",
//                 background: "var(--accent)", color: "#fff", border: "none",
//                 borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 700,
//                 cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
//                 fontFamily: "Syne, sans-serif",
//               }}>
//                 {loading ? "Submitting…" : "Submit Application →"}
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// function SectionLabel({ children }) {
//   return (
//     <p style={{
//       fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700,
//       color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px",
//       margin: "16px 0 10px", paddingBottom: 6, borderBottom: "1px solid var(--border)",
//     }}>{children}</p>
//   );
// }

// function FormField({ label, name, type, placeholder, onChange }) {
//   return (
//     <div className="form-group">
//       <label className="form-label">{label}</label>
//       <input className="form-input" name={name} type={type} placeholder={placeholder} onChange={onChange} />
//     </div>
//   );
// }

// function FormTextarea({ label, name, placeholder, onChange }) {
//   return (
//     <div className="form-group">
//       <label className="form-label">{label}</label>
//       <textarea className="form-textarea" name={name} placeholder={placeholder} rows={3} onChange={onChange} />
//     </div>
//   );
// }

// function ProjectCard({ project, onApply, appStatus }) {
//   const tagStyle = tagStyles[project.tagColor];
//   const { isSignedIn } = useUser();

//   const applied = !!appStatus;
//   const canReapply = appStatus?.status === "Rejected";
//   const chip = appStatus ? statusChip(appStatus.status) : null;

//   return (
//     <div style={{
//       background: "var(--bg-card)", border: "1px solid var(--border)",
//       borderRadius: "var(--radius)", padding: "22px 24px",
//       transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
//       position: "relative", overflow: "hidden",
//       display: "flex", flexDirection: "column",
//     }}
//       onMouseEnter={e => {
//         e.currentTarget.style.borderColor = "var(--border-light)";
//         e.currentTarget.style.transform = "translateY(-2px)";
//         e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
//       }}
//       onMouseLeave={e => {
//         e.currentTarget.style.borderColor = "var(--border)";
//         e.currentTarget.style.transform = "translateY(0)";
//         e.currentTarget.style.boxShadow = "none";
//       }}
//     >
//       <div style={{
//         position: "absolute", top: 0, left: 0, right: 0, height: 3,
//         background: tagStyle.color, opacity: 0.7,
//         borderRadius: "var(--radius) var(--radius) 0 0",
//       }} />
//       <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{
//             width: 42, height: 42, borderRadius: 10, flexShrink: 0,
//             background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
//             display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
//           }}>{project.icon}</div>
//           <div>
//             <span style={{
//               display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.6px",
//               textTransform: "uppercase", padding: "2px 8px", borderRadius: 3,
//               background: tagStyle.bg, border: `1px solid ${tagStyle.border}`, color: tagStyle.color, marginBottom: 4,
//             }}>{project.tag}</span>
//             <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
//               {project.title}
//             </h3>
//           </div>
//         </div>
//         <div style={{
//           flexShrink: 0, background: "var(--green-dim)",
//           border: "1px solid rgba(34,160,107,0.25)", borderRadius: 5, padding: "4px 10px", textAlign: "center",
//         }}>
//           <div style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "var(--green)", lineHeight: 1 }}>
//             {project.openings}
//           </div>
//           <div style={{ fontSize: 9, color: "var(--green)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
//             Open{project.openings > 1 ? "ings" : "ing"}
//           </div>
//         </div>
//       </div>
//       <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14 }}>
//         {project.subtitle}
//       </p>
//       <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
//         {[project.duration, project.mode, `Deadline: ${project.deadline}`].map(c => (
//           <span key={c} style={{
//             display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11,
//             padding: "3px 8px", borderRadius: 4, background: "var(--bg-hover)",
//             border: "1px solid var(--border)", color: "var(--text-muted)", fontWeight: 500,
//           }}>{c}</span>
//         ))}
//       </div>
//       <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>
//         {project.stack.map(s => (
//           <span key={s} style={{
//             fontSize: 10, padding: "2px 8px", borderRadius: 3,
//             background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
//             color: tagStyle.color, fontWeight: 700,
//           }}>{s}</span>
//         ))}
//       </div>
//       {appStatus?.status === "Rejected" && appStatus?.adminNote && (
//         <div style={{
//           background: "var(--red-dim)", border: "1px solid rgba(227,73,53,0.25)",
//           borderRadius: "var(--radius-sm)", padding: "10px 12px", marginBottom: 14,
//         }}>
//           <p style={{ fontSize: 10, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
//             Feedback
//           </p>
//           <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{appStatus.adminNote}</p>
//         </div>
//       )}
//       <div style={{ marginTop: "auto" }}>
//         {applied && chip && (
//           <div style={{
//             display: "flex", alignItems: "center", justifyContent: "space-between",
//             marginBottom: canReapply ? 10 : 0,
//           }}>
//             <span style={{
//               fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20,
//               background: chip.bg, color: chip.color, border: `1px solid ${chip.border}`,
//             }}>{chip.label}</span>
//             {appStatus?.status === "Shortlisted" && (
//               <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Check dashboard for details</span>
//             )}
//           </div>
//         )}
//         {!isSignedIn ? (
//           <button onClick={() => onApply(project)} style={{
//             width: "100%", marginTop: applied ? 0 : 0, padding: "9px 0",
//             background: "var(--accent)", color: "#fff", border: "none",
//             borderRadius: "var(--radius-sm)", fontSize: 13,
//             fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif",
//           }}>Apply Now </button>
//         ) : !applied ? (
//           <button onClick={() => onApply(project)} style={{
//             width: "100%", padding: "9px 0",
//             background: "var(--accent)", color: "#fff", border: "none",
//             borderRadius: "var(--radius-sm)", fontSize: 13,
//             fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif",
//           }}>Apply Now</button>
//         ) : canReapply ? (
//           <button onClick={() => onApply(project)} style={{
//             width: "100%", padding: "9px 0",
//             background: "var(--red-dim)", color: "var(--red)",
//             border: "1px solid rgba(227,73,53,0.3)",
//             borderRadius: "var(--radius-sm)", fontSize: 13,
//             fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif",
//           }}>Reapply </button>
//         ) : null}
//       </div>
//     </div>
//   );
// }

// export default function HomePage() {
//   const [activeProject, setActiveProject] = useState(null);
//   const [mounted, setMounted] = useState(false);
//   const [myApps, setMyApps] = useState({});
//   const { isSignedIn } = useUser();

//   useEffect(() => setMounted(true), []);

//   useEffect(() => {
//     if (!isSignedIn) return;
//     fetch("/api/my-applications")
//       .then(r => r.json())
//       .then(d => setMyApps(d.applications ?? {}));
//   }, [isSignedIn]);

//   const refreshApps = () => {
//     if (!isSignedIn) return;
//     fetch("/api/my-applications")
//       .then(r => r.json())
//       .then(d => setMyApps(d.applications ?? {}));
//   };

//   if (!mounted) return null;

//   return (
//     <>
//       {/* ── Shared Navbar (show Dashboard link for signed-in users) ── */}
//       <Navbar showDashboardLink={true} showBackLink={false} />

//       <main style={{
//         maxWidth: 1080, margin: "0 auto",
//         padding: "48px 28px 80px", minHeight: "100vh", background: "var(--bg)",
//       }}>
//         {/* Hero */}
//         <div style={{ textAlign: "center", marginBottom: 56 }}>
//           <h1 style={{
//             fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 5vw, 48px)",
//             fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.15,
//             letterSpacing: "-0.5px", marginBottom: 16,
//           }}>
//             Build Real AI & Data Projects.<br />
//             <span style={{ color: "var(--accent)" }}>Gain Real Experience.</span>
//           </h1>
//           <p style={{
//             fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7,
//             maxWidth: 560, margin: "0 auto 28px",
//           }}>
//             No stipend. No shortcuts. Just hands-on project work alongside our core team — you ship real code, real models, and real dashboards.
//           </p>
//           <div style={{
//             display: "inline-flex", gap: 0, border: "1px solid var(--border)",
//             borderRadius: "var(--radius)", overflow: "hidden", background: "var(--bg-card)",
//           }}>
//             {[
//               { val: TOTAL_PROJECTS, label: "Projects" },
//               { val: TOTAL_OPENINGS, label: "Open Spots" },
//               { val: "LOR", label: "On Completion" },
//               { val: "Remote", label: "Fully" },
//             ].map((s, i) => (
//               <div key={s.label} style={{
//                 padding: "12px 20px",
//                 borderRight: i < 3 ? "1px solid var(--border)" : "none",
//                 textAlign: "center",
//               }}>
//                 <div style={{
//                   fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800,
//                   color: "var(--text-primary)", lineHeight: 1, marginBottom: 3,
//                 }}>{s.val}</div>
//                 <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                   {s.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Project cards */}
//         <div style={{
//           display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//           gap: 16, marginBottom: 56,
//         }}>
//           {PROJECTS.map(p => (
//             <ProjectCard
//               key={p.id}
//               project={p}
//               onApply={setActiveProject}
//               appStatus={myApps[p.id] ?? null}
//             />
//           ))}
//         </div>

//         {/* How it works */}
//         <div style={{ marginBottom: 56 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
//             <div style={{ width: 4, height: 20, borderRadius: 2, background: "var(--green)", flexShrink: 0 }} />
//             <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
//               How It Works
//             </h2>
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
//             {[
//               { step: "01", title: "Apply Online", desc: "Fill out the application form. Select your preferred project and submit all details in one place." },
//               { step: "02", title: "Shortlisting", desc: "We review within 5–7 days. Shortlisted candidates receive a confirmation with next steps." },
//               { step: "03", title: "Start Building", desc: "You join the team, get access to repos and tools, and start contributing from week one." },
//             ].map(s => (
//               <div key={s.step} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 20px" }}>
//                 <span style={{
//                   fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 800, color: "var(--accent)",
//                   background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
//                   borderRadius: 4, padding: "1px 7px", display: "inline-block", marginBottom: 10,
//                 }}>{s.step}</span>
//                 <h4 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{s.title}</h4>
//                 <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{s.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* FAQ */}
//         <div style={{ maxWidth: 680, margin: "0 auto" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
//             <div style={{ width: 4, height: 20, borderRadius: 2, background: "var(--yellow)", flexShrink: 0 }} />
//             <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
//               Frequently Asked
//             </h2>
//           </div>
//           {[
//             { q: "Is there any stipend?", a: "No. These are fully unpaid, experience-based internships. You'll receive a Letter of Recommendation and build a real project for your portfolio." },
//             { q: "Can I apply to multiple projects?", a: "Yes, but please apply individually for each project you're genuinely interested in." },
//             { q: "What if I'm a fresher with no experience?", a: "That's fine. We look for curiosity, willingness to learn, and basic technical foundations." },
//             { q: "Are these internships certificate-based only?", a: "No. You'll do real, meaningful work. Quality matters over just completing time." },
//           ].map(faq => (
//             <div key={faq.q} style={{
//               background: "var(--bg-card)", border: "1px solid var(--border)",
//               borderRadius: "var(--radius-sm)", padding: "14px 18px", marginBottom: 8,
//             }}>
//               <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 5 }}>{faq.q}</p>
//               <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{faq.a}</p>
//             </div>
//           ))}
//         </div>

//         {/* ── Shared Footer ── */}
//         <Footer />
//       </main>

//       {activeProject && (
//         <ApplyModal
//           project={activeProject}
//           onClose={() => setActiveProject(null)}
//           onSuccess={() => { refreshApps(); setActiveProject(null); }}
//         />
//       )}
//     </>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Navbar from "./Components/navbar";
import Footer from "./Components/footer";

const PROJECTS = [
  {
    id: "ai-resume-screener",
    tag: "AI / ML",
    tagColor: "accent",
    icon: "🤖",
    title: "AI-Powered Resume Screener",
    subtitle: "Build an intelligent system that ranks resumes against job descriptions using NLP + ML.",
    description: "We're building an end-to-end resume screening pipeline that parses resumes, extracts entities (skills, experience, education) using spaCy/NLTK, and scores them against a job description using cosine similarity and a fine-tuned BERT model. You'll work on the ML core, evaluation benchmarks, and a lightweight FastAPI layer.",
    duration: "3 Months", mode: "Remote", type: "Unpaid · Experience-based",
    stack: ["Python", "spaCy", "HuggingFace", "FastAPI", "PostgreSQL"],
    requirements: [
      "Strong Python fundamentals (OOP, file handling)",
      "Familiarity with NLP concepts (tokenisation, embeddings, similarity)",
      "Basic understanding of ML pipelines and scikit-learn",
      "Exposure to REST APIs (Flask or FastAPI)",
      "Git basics for collaborative development",
    ],
    deliverables: [
      "Resume parser with entity extraction",
      "Scoring engine using BERT embeddings",
      "API endpoint + Postman documentation",
      "Final report with benchmark results",
    ],
    openings: 2, deadline: "June 10, 2025", extraField: null,
    product: "NeuralHire™", productDesc: "Our AI recruitment intelligence platform",
  },
  {
    id: "ecommerce-analytics",
    tag: "Data Analytics",
    tagColor: "green",
    icon: "📊",
    title: "E-Commerce Sales Analytics Dashboard",
    subtitle: "Turn raw transactional data into actionable insights with Python, SQL, and Plotly.",
    description: "We have 2+ years of raw e-commerce order data sitting in CSV dumps. This project involves cleaning it with pandas, building a star-schema in PostgreSQL, writing analytical SQL queries, and creating an interactive Plotly Dash or Power BI dashboard covering cohort retention, RFM segmentation, and monthly revenue trends.",
    duration: "2 Months", mode: "Remote", type: "Unpaid · Experience-based",
    stack: ["Python", "Pandas", "PostgreSQL", "Plotly Dash", "Power BI"],
    requirements: [
      "Proficient in Python pandas and data wrangling",
      "SQL queries — GROUP BY, JOINs, window functions",
      "Basic statistics (mean, median, distribution understanding)",
      "Any data visualisation experience (matplotlib, seaborn, etc.)",
      "Bonus: Power BI or Tableau exposure",
    ],
    deliverables: [
      "Cleaned, normalised PostgreSQL data warehouse",
      "10+ analytical SQL query library",
      "Interactive Plotly Dash or Power BI dashboard",
      "Executive summary PDF with key findings",
    ],
    openings: 3, deadline: "June 5, 2025", extraField: "projectLink",
    product: "DataPulse™", productDesc: "Our real-time business intelligence engine",
  },
  {
    id: "sentiment-dashboard",
    tag: "NLP / ML",
    tagColor: "yellow",
    icon: "🧠",
    title: "Real-Time Social Sentiment Dashboard",
    subtitle: "Stream tweets/Reddit posts, run sentiment classification, and visualise trends live.",
    description: "This project involves building a real-time pipeline: Twitter/Reddit API → Kafka (or simple queuing) → sentiment model (VADER + fine-tuned RoBERTa) → time-series database → live Streamlit/Dash dashboard. You'll implement multi-class sentiment and track topic trends over time.",
    duration: "2.5 Months", mode: "Remote", type: "Unpaid · Experience-based",
    stack: ["Python", "Transformers", "Streamlit", "Redis", "PostgreSQL"],
    requirements: [
      "Python proficiency, comfortable with async/streaming patterns",
      "NLP background — text pre-processing, classification",
      "Any experience with HuggingFace Transformers is a strong plus",
      "Basic understanding of REST APIs and webhooks",
      "Interest in social media data and trend analysis",
    ],
    deliverables: [
      "Ingestion pipeline (API → queue → DB)",
      "Fine-tuned sentiment classifier with evaluation metrics",
      "Live Streamlit dashboard with topic filters",
      "Documentation + architecture diagram",
    ],
    openings: 2, deadline: "June 15, 2025", extraField: "nlpExperience",
    product: "SentiScope™", productDesc: "Our brand intelligence & market listening platform",
  },
];

const TOTAL_OPENINGS = PROJECTS.reduce((sum, p) => sum + p.openings, 0);

// Tag styles using CSS variables so they respond to theme
const tagStyles = {
  accent: { bg: "var(--accent-dim)",  border: "var(--accent-border)", color: "var(--accent)"  },
  green:  { bg: "var(--green-dim)",   border: "rgba(34,160,107,0.3)", color: "var(--green)"   },
  yellow: { bg: "var(--yellow-dim)",  border: "rgba(226,178,3,0.3)",  color: "var(--yellow)"  },
};

function statusChip(status) {
  if (status === "Shortlisted") return { label: "✓ Shortlisted", bg: "var(--green-dim)",  color: "var(--green)", border: "rgba(34,160,107,0.3)"  };
  if (status === "Rejected")    return { label: "✕ Rejected",    bg: "var(--red-dim)",    color: "var(--red)",   border: "rgba(227,73,53,0.25)"  };
  return                               { label: "⏳ Under Review. Go to dashboard", bg: "var(--blue-dim)",  color: "var(--blue)",  border: "rgba(87,157,255,0.25)" };
}

// ── Apply Modal ───────────────────────────────────────────────────────────────
function ApplyModal({ project, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ project: project.id });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const tagStyle = tagStyles[project.tagColor];

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/apply", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong.");
      else { setSuccess(true); onSuccess?.(); }
    } catch { setError("Please login to apply."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-light)",
        borderRadius: 14, width: "100%", maxWidth: 620,
        maxHeight: "93vh", overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }} onClick={e => e.stopPropagation()}>

        {/* ── Success state ── */}
        {success ? (
          <div style={{ padding: "60px 32px", textAlign: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, margin: "0 auto 20px", color: "var(--green)",
            }}>✓</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 10 }}>
              Application Received
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, maxWidth: 360, margin: "0 auto 12px" }}>
              You've applied to contribute to{" "}
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>{project.product}</span> — {project.productDesc}.
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 28 }}>
              We'll review your application within 5–7 working days.
            </p>
            <button onClick={onClose} className="btn-primary">Close</button>
          </div>

        ) : step === 1 ? (
          <>
            {/* Step 1 header */}
            <div style={{
              padding: "20px 24px 16px", borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0,
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>{project.icon}</div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: tagStyle.color, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 3 }}>
                    {project.tag} · {project.product}
                  </p>
                  <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "var(--text-primary)" }}>
                    {project.title}
                  </h2>
                </div>
              </div>
              <button onClick={onClose} style={{
                background: "var(--bg-hover)", border: "1px solid var(--border)",
                borderRadius: 6, width: 28, height: 28, cursor: "pointer",
                color: "var(--text-muted)", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>✕</button>
            </div>

            {/* Step 1 body */}
            <div style={{ padding: "20px 24px 24px", overflowY: "auto", flex: 1 }}>
              {/* Info callout */}
              <div style={{
                background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
                borderRadius: 10, padding: "12px 16px", marginBottom: 18,
                display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  You're applying to work on a live module of{" "}
                  <strong style={{ color: "var(--accent)" }}>{project.product}</strong> — {project.productDesc}. This is real product work, not a tutorial project.
                </p>
              </div>

              {/* Meta chips */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                {[project.duration, project.mode, project.type, `Deadline: ${project.deadline}`].map(c => (
                  <span key={c} style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 4,
                    background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)",
                  }}>{c}</span>
                ))}
              </div>

              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 20 }}>
                {project.description}
              </p>

              {/* Requirements + Deliverables */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingBottom: 5, borderBottom: "1px solid var(--border)" }}>
                    What We Need
                  </p>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {project.requirements.map(r => (
                      <li key={r} style={{ fontSize: 12, color: "var(--text-secondary)", padding: "5px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 6, lineHeight: 1.5 }}>
                        <span style={{ color: tagStyle.color, flexShrink: 0 }}>›</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingBottom: 5, borderBottom: "1px solid var(--border)" }}>
                    You'll Ship
                  </p>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {project.deliverables.map(d => (
                      <li key={d} style={{ fontSize: 12, color: "var(--text-secondary)", padding: "5px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 6, lineHeight: 1.5 }}>
                        <span style={{ color: "var(--green)", flexShrink: 0 }}>✓</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Stack */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Stack</p>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {project.stack.map(s => (
                    <span key={s} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 4, background: tagStyle.bg, border: `1px solid ${tagStyle.border}`, color: tagStyle.color, fontWeight: 700 }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div style={{
                background: "var(--yellow-dim)", border: "1px solid rgba(226,178,3,0.3)",
                borderRadius: 8, padding: "10px 14px", fontSize: 12,
                color: "var(--yellow)", marginBottom: 20,
              }}>
                ⚠️ Unpaid · Experience-based internship. You'll receive a Letter of Recommendation + portfolio-ready work on completion.
              </div>

              <button onClick={() => setStep(2)} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "11px 0" }}>
                Continue to Application →
              </button>
            </div>
          </>

        ) : (
          <>
            {/* Step 2 header */}
            <div style={{
              padding: "16px 24px", borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setStep(1)} style={{
                  background: "var(--bg-hover)", border: "1px solid var(--border)",
                  borderRadius: 6, width: 28, height: 28, cursor: "pointer",
                  color: "var(--text-muted)", fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>←</button>
                <div>
                  <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Your Application</h2>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>Step 2 of 2 · {project.title}</p>
                </div>
              </div>
              <button onClick={onClose} style={{
                background: "var(--bg-hover)", border: "1px solid var(--border)",
                borderRadius: 6, width: 28, height: 28, cursor: "pointer",
                color: "var(--text-muted)", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>

            {/* Step 2 body */}
            <div style={{ padding: "18px 24px 24px", overflowY: "auto", flex: 1 }}>
              {error && (
                <div style={{
                  background: "var(--red-dim)", border: "1px solid rgba(227,73,53,0.25)",
                  borderRadius: 8, padding: "10px 14px", fontSize: 13,
                  color: "var(--red)", marginBottom: 16,
                }}>{error}</div>
              )}

              <MSectionLabel>Personal Details</MSectionLabel>
              <div className="form-row">
                <MField label="Full Name *"     name="fullName" type="text"  placeholder="Arjun Sharma"      onChange={handleChange} />
                <MField label="Email Address *" name="email"    type="email" placeholder="arjun@college.edu" onChange={handleChange} />
              </div>
              <MField label="Phone (optional)" name="phone" type="tel" placeholder="+91 98765 43210" onChange={handleChange} />

              <MSectionLabel>Academic Background</MSectionLabel>
              <div className="form-row">
                <MField label="College / University *" name="college"        type="text" placeholder="KIET Group of Institutions"      onChange={handleChange} />
                <MField label="Branch / Department *"  name="branch"         type="text" placeholder="Computer Science & Engineering"   onChange={handleChange} />
                <MField label="Graduation Year *"      name="graduationYear" type="text" placeholder="2026"                             onChange={handleChange} />
                <MField label="CGPA / % (optional)"    name="cgpa"           type="text" placeholder="8.4 / 10"                        onChange={handleChange} />
              </div>

              <MSectionLabel>Profiles &amp; Resume</MSectionLabel>
              <div className="form-row">
                <MField label="LinkedIn (optional)" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." onChange={handleChange} />
                <MField label="GitHub (optional)"   name="githubUrl"   type="url" placeholder="https://github.com/..."    onChange={handleChange} />
              </div>
              <MField label="Resume Link (Drive / Notion) *" name="resumeLink" type="url" placeholder="https://drive.google.com/..." onChange={handleChange} />

              <MSectionLabel>Technical Background</MSectionLabel>
              <MField label="Tools &amp; Technologies You Know *" name="toolsKnown" type="text" placeholder="Python, pandas, scikit-learn, SQL, Git..." onChange={handleChange} />
              {project.extraField === "projectLink" && (
                <MField label="Past Data/Analytics Project Link (optional)" name="projectLink" type="url" placeholder="GitHub / Kaggle / Colab link" onChange={handleChange} />
              )}
              {project.extraField === "nlpExperience" && (
                <MTextarea label="Describe Your NLP Experience *" name="nlpExperience" placeholder="E.g., built a sentiment classifier using NLTK..." onChange={handleChange} />
              )}
              <MTextarea label="Prior Projects / Experience *"    name="priorExperience" placeholder="Describe relevant projects, coursework, or work experience..." onChange={handleChange} />
              <MTextarea label="Why this project specifically? *" name="whyInterested"   placeholder="Tell us what excites you about contributing to this product..." onChange={handleChange} />

              <MSectionLabel>Availability</MSectionLabel>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Availability *</label>
                  <select className="form-select" name="availability" required onChange={handleChange} defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option>Full-time (40 hrs/week)</option>
                    <option>Part-time (20 hrs/week)</option>
                  </select>
                </div>
                <MField label="Earliest Start Date *" name="startDate" type="date" onChange={handleChange} />
              </div>

              <button onClick={handleSubmit} disabled={loading} className="btn-primary"
                style={{ width: "100%", marginTop: 16, justifyContent: "center", padding: "11px 0", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Submitting…" : "Submit Application →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MSectionLabel({ children }) {
  return <p className="modal-section-label" style={{ margin: "16px 0 10px" }}>{children}</p>;
}
function MField({ label, name, type, placeholder, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" name={name} type={type} placeholder={placeholder} onChange={onChange} />
    </div>
  );
}
function MTextarea({ label, name, placeholder, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea className="form-textarea" name={name} placeholder={placeholder} rows={3} onChange={onChange} />
    </div>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, onApply, appStatus }) {
  const tagStyle = tagStyles[project.tagColor];
  const { isSignedIn } = useUser();
  const applied   = !!appStatus;
  const canReapply = appStatus?.status === "Rejected";
  const chip      = appStatus ? statusChip(appStatus.status) : null;

  return (
    <div className="card" style={{
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
      transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--accent-border)";
        e.currentTarget.style.transform   = "translateY(-3px)";
        e.currentTarget.style.boxShadow   = "0 12px 32px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform   = "translateY(0)";
        e.currentTarget.style.boxShadow   = "none";
      }}
    >
      {/* Coloured top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${tagStyle.color}, transparent)`,
        borderRadius: "var(--radius) var(--radius) 0 0",
      }} />

      {/* Product badge */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        background: "var(--bg-hover)", border: "1px solid var(--border)",
        borderRadius: 4, padding: "2px 8px",
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
          {project.product}
        </span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12, paddingRight: 80 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>{project.icon}</div>
        <div>
          <span style={{
            display: "inline-block", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.7px", textTransform: "uppercase",
            padding: "2px 7px", borderRadius: 3,
            background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
            color: tagStyle.color, marginBottom: 5,
          }}>{project.tag}</span>
          <h3 style={{
            fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700,
            color: "var(--text-primary)", lineHeight: 1.25,
          }}>{project.title}</h3>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 14 }}>
        {project.subtitle}
      </p>

      {/* Meta chips */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
        {[project.duration, project.mode, `Due ${project.deadline}`].map(c => (
          <span key={c} style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 4,
            background: "var(--bg-hover)", border: "1px solid var(--border)",
            color: "var(--text-muted)", fontWeight: 500,
          }}>{c}</span>
        ))}
      </div>

      {/* Stack */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
        {project.stack.map(s => (
          <span key={s} style={{
            fontSize: 10, padding: "2px 7px", borderRadius: 4,
            background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
            color: tagStyle.color, fontWeight: 700,
          }}>{s}</span>
        ))}
      </div>

      {/* Openings pill */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
        padding: "8px 12px", background: "var(--green-dim)",
        border: "1px solid rgba(34,160,107,0.25)", borderRadius: 8,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>
          {project.openings} intern {project.openings > 1 ? "spots" : "spot"} open
        </span>
        <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>
          Apply before {project.deadline}
        </span>
      </div>

      {/* Rejection feedback */}
      {appStatus?.status === "Rejected" && appStatus?.adminNote && (
        <div style={{
          background: "var(--red-dim)", border: "1px solid rgba(227,73,53,0.2)",
          borderRadius: 8, padding: "10px 12px", marginBottom: 14,
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Feedback</p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{appStatus.adminNote}</p>
        </div>
      )}

      <div style={{ marginTop: "auto" }}>
        {applied && chip && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: canReapply ? 10 : 0 }}>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "5px 14px",
              borderRadius: 20, background: chip.bg, color: chip.color,
              border: `1px solid ${chip.border}`,
            }}>{chip.label}</span>
            {appStatus?.status === "Shortlisted" && (
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Check your dashboard</span>
            )}
          </div>
        )}
        {(!isSignedIn || !applied) && (
          <button onClick={() => onApply(project)} className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "10px 0" }}>
            Apply to Intern →
          </button>
        )}
        {applied && canReapply && (
          <button onClick={() => onApply(project)} className="btn-danger"
            style={{ width: "100%", padding: "10px 0", fontSize: 13, fontWeight: 700 }}>
            Reapply →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeProject, setActiveProject] = useState(null);
  const [mounted, setMounted]   = useState(false);
  const [myApps, setMyApps]     = useState({});
  const { isSignedIn }          = useUser();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/my-applications").then(r => r.json()).then(d => setMyApps(d.applications ?? {}));
  }, [isSignedIn]);

  const refreshApps = () => {
    if (!isSignedIn) return;
    fetch("/api/my-applications").then(r => r.json()).then(d => setMyApps(d.applications ?? {}));
  };

  if (!mounted) return null;

  return (
    <>
      <Navbar showDashboardLink={true} showBackLink={false} />

      <main style={{ background: "var(--bg)", minHeight: "100vh", transition: "background 0.25s" }}>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section style={{
          position: "relative", padding: "96px 28px 80px",
          textAlign: "center", overflow: "hidden",
        }}>
          {/* Subtle grid */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
            opacity: 0.4,
          }} />
          {/* Glow */}
          <div style={{
            position: "absolute", width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)",
            top: -180, left: "50%", transform: "translateX(-50%)", pointerEvents: "none",
          }} />

          <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
            {/* Label pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
              borderRadius: 20, padding: "6px 16px", marginBottom: 28,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.5px" }}>
                AI/ML SaaS Platform · Open Internship Projects
              </span>
            </div>

            <h1 style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(32px, 5.5vw, 56px)", fontWeight: 800,
              color: "var(--text-primary)", lineHeight: 1.1,
              letterSpacing: "-1px", marginBottom: 20,
            }}>
              Build Products That Use{" "}
              <span style={{ color: "var(--accent)" }}>Real AI.</span>
            </h1>

            <p style={{
              fontSize: 17, color: "var(--text-secondary)",
              lineHeight: 1.75, maxWidth: 540, margin: "0 auto 36px",
            }}>
              We're a data-first AI/ML company building production-grade tools. These aren't mock projects — you'll contribute code that ships inside our actual products.
            </p>

            {/* Stats bar */}
            <div style={{
              display: "inline-flex",
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", overflow: "hidden",
            }}>
              {[
                { val: "3",              label: "Live Products" },
                { val: `${TOTAL_OPENINGS}`, label: "Intern Spots"  },
                { val: "LOR",            label: "On Completion" },
                { val: "100%",           label: "Remote"        },
              ].map((s, i) => (
                <div key={s.label} style={{
                  padding: "14px 22px", textAlign: "center",
                  borderRight: i < 3 ? "1px solid var(--border)" : "none",
                }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, marginBottom: 3 }}>
                    {s.val}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Content ──────────────────────────────────────────── */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px 64px" }}>

          {/* Products row */}
          <SectionHeading color="var(--accent)" label="Our Products — Where You'll Contribute" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 64 }}>
            {[
              { name: "NeuralHire™", desc: "AI recruitment intelligence — resume parsing, candidate scoring, and JD matching at scale.", tag: "AI / ML",       icon: "🤖", colorKey: "accent" },
              { name: "DataPulse™",  desc: "Business intelligence engine — cohort analytics, RFM segmentation, and revenue dashboards.",  tag: "Data Analytics", icon: "📊", colorKey: "green"  },
              { name: "SentiScope™", desc: "Brand intelligence platform — real-time social listening, sentiment models, and trend alerts.", tag: "NLP / ML",      icon: "🧠", colorKey: "yellow" },
            ].map(p => {
              const ts = tagStyles[p.colorKey];
              return (
                <div key={p.name} className="card" style={{ display: "flex", gap: 14, alignItems: "flex-start", background: ts.bg, borderColor: ts.border }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{p.icon}</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>{p.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: ts.color, background: ts.bg, border: `1px solid ${ts.border}`, borderRadius: 3, padding: "1px 6px", textTransform: "uppercase", letterSpacing: "0.6px" }}>{p.tag}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Open projects */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: "var(--green)" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Open Intern Projects</span>
            <span className="badge badge-offer">{TOTAL_OPENINGS} spots</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginBottom: 72 }}>
            {PROJECTS.map(p => (
              <ProjectCard key={p.id} project={p} onApply={setActiveProject} appStatus={myApps[p.id] ?? null} />
            ))}
          </div>

          {/* Why intern */}
          <div className="insight-box" style={{ borderRadius: "var(--radius)", padding: "36px 40px", marginBottom: 64 }}>
            <SectionHeading color="var(--accent)" label="Why Intern With Us" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
              {[
                { icon: "🚀", title: "Ship to Production",  desc: "Your code goes into real products used by real clients. Not a sandbox, not a tutorial." },
                { icon: "🧑‍💻", title: "Mentored Closely",    desc: "You'll be reviewed by our ML engineers. Code quality and architecture matter here." },
                { icon: "📁", title: "Portfolio-Grade Work", desc: "Walk away with a GitHub PR history, a case study, and an LOR for your resume." },
                { icon: "🌐", title: "Fully Remote",         desc: "Async-first culture. Work from anywhere, stay connected via Notion + Slack." },
              ].map(item => (
                <div key={item.title}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{item.icon}</div>
                  <h4 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{item.title}</h4>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <SectionHeading color="var(--yellow)" label="Process" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 0, marginBottom: 64 }}>
            {[
              { step: "01", title: "Apply Online",      desc: "Select your project and submit your details. We read every application carefully." },
              { step: "02", title: "Technical Review",  desc: "We review profiles in 5–7 days. Shortlisted candidates get a brief async task." },
              { step: "03", title: "Onboarding",        desc: "Repo access, tool setup, and your first PR assigned — contributing from week one." },
              { step: "04", title: "Ship + Graduate",   desc: "Deliver your module. Receive your LOR, case study sign-off, and team endorsement." },
            ].map((s, i) => (
              <div key={s.step} style={{
                background: "var(--bg-card)", padding: "20px 22px",
                border: "1px solid var(--border)",
                borderLeft: i > 0 ? "none" : "1px solid var(--border)",
                borderRadius: i === 0 ? "var(--radius) 0 0 var(--radius)" : i === 3 ? "0 var(--radius) var(--radius) 0" : 0,
              }}>
                <span className="badge badge-applied" style={{ marginBottom: 12, display: "inline-block", fontFamily: "monospace" }}>{s.step}</span>
                <h4 style={{ fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{s.title}</h4>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: 680, margin: "0 auto 64px" }}>
            <SectionHeading color="var(--border-light)" label="FAQ" />
            {[
              { q: "Is there a stipend?",                a: "No. These are fully unpaid internships. You'll receive a Letter of Recommendation, portfolio-ready deliverables, and real product experience to show employers." },
              { q: "Can I apply to multiple projects?",  a: "Yes — apply individually to each one. We recommend choosing the project that best aligns with your current skills." },
              { q: "I'm a fresher — should I still apply?", a: "Absolutely. We look for curiosity and foundational knowledge, not years of experience." },
              { q: "Is this just a certificate programme?", a: "No. You contribute to actual product code. Quality and delivery matter — this is not participation-trophy work." },
              { q: "What tech stack do I need?",         a: "Each project lists its specific stack. Generally: Python, Git, and domain knowledge (ML/NLP/Data) are the baseline." },
            ].map(faq => (
              <div key={faq.q} className="card" style={{ marginBottom: 6 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{faq.q}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>

        </section>

        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px" }}>
          <Footer />
        </div>
      </main>

      {activeProject && (
        <ApplyModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
          onSuccess={() => { refreshApps(); setActiveProject(null); }}
        />
      )}
    </>
  );
}

function SectionHeading({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
      <div style={{ width: 3, height: 18, borderRadius: 2, background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
        {label}
      </span>
    </div>
  );
}