"use client";

import { useState, useEffect } from "react";
import {
  SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import ThemeToggle from "./theme/ThemeToggle";

const PROJECTS = [
  {
    id: "ai-resume-screener",
    tag: "AI / ML",
    tagColor: "accent",
    icon: "🤖",
    title: "AI-Powered Resume Screener",
    subtitle: "Build an intelligent system that ranks resumes against job descriptions using NLP + ML.",
    description: "We're building an end-to-end resume screening pipeline that parses resumes, extracts entities (skills, experience, education) using spaCy/NLTK, and scores them against a job description using cosine similarity and a fine-tuned BERT model. You'll work on the ML core, evaluation benchmarks, and a lightweight FastAPI layer.",
    duration: "3 Months",
    mode: "Remote",
    type: "Unpaid · Experience-based",
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
    openings: 2,
    deadline: "June 10, 2025",
    extraField: null,
  },
  {
    id: "ecommerce-analytics",
    tag: "Data Analytics",
    tagColor: "green",
    icon: "📊",
    title: "E-Commerce Sales Analytics Dashboard",
    subtitle: "Turn raw transactional data into actionable insights with Python, SQL, and Plotly.",
    description: "We have 2+ years of raw e-commerce order data sitting in CSV dumps. This project involves cleaning it with pandas, building a star-schema in PostgreSQL, writing analytical SQL queries, and creating an interactive Plotly Dash or Power BI dashboard covering cohort retention, RFM segmentation, and monthly revenue trends.",
    duration: "2 Months",
    mode: "Remote",
    type: "Unpaid · Experience-based",
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
    openings: 3,
    deadline: "June 5, 2025",
    extraField: "projectLink",
  },
  {
    id: "sentiment-dashboard",
    tag: "NLP / ML",
    tagColor: "yellow",
    icon: "🧠",
    title: "Real-Time Social Sentiment Dashboard",
    subtitle: "Stream tweets/Reddit posts, run sentiment classification, and visualise trends live.",
    description: "This project involves building a real-time pipeline: Twitter/Reddit API → Kafka (or simple queuing) → sentiment model (VADER + fine-tuned RoBERTa) → time-series database → live Streamlit/Dash dashboard. You'll implement multi-class sentiment and track topic trends over time.",
    duration: "2.5 Months",
    mode: "Remote",
    type: "Unpaid · Experience-based",
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
    openings: 2,
    deadline: "June 15, 2025",
    extraField: "nlpExperience",
  },
];

// ── Dynamic stats from PROJECTS array ──────────────────────────────────
const TOTAL_PROJECTS = PROJECTS.length;
const TOTAL_OPENINGS = PROJECTS.reduce((sum, p) => sum + p.openings, 0);

const tagStyles = {
  accent: { bg: "var(--accent-dim)", border: "var(--accent-border)", color: "var(--accent)" },
  green:  { bg: "var(--green-dim)",  border: "rgba(34,160,107,0.3)",  color: "var(--green)"  },
  yellow: { bg: "var(--yellow-dim)", border: "rgba(226,178,3,0.3)",   color: "var(--yellow)" },
};

function statusChip(status) {
  if (status === "Shortlisted") return { label: "✓ Shortlisted", bg: "var(--green-dim)", color: "var(--green)", border: "rgba(34,160,107,0.3)" };
  if (status === "Rejected")    return { label: "✕ Rejected",    bg: "var(--red-dim)",   color: "var(--red)",   border: "rgba(227,73,53,0.25)" };
  return                               { label: "⏳ Pending",     bg: "var(--blue-dim)",  color: "var(--blue)",  border: "rgba(87,157,255,0.25)" };
}

// ── Two-step Apply Modal ──────────────────────────────────────────────────
function ApplyModal({ project, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1 = requirements, 2 = form
  const [formData, setFormData] = useState({ project: project.id });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const tagStyle = tagStyles[project.tagColor];

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong.");
      else { setSuccess(true); onSuccess?.(); }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-light)",
        borderRadius: 12, width: "100%", maxWidth: 600,
        maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }} onClick={e => e.stopPropagation()}>

        {success ? (
          /* ── Success ── */
          <div style={{ padding: "56px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 10 }}>
              Application Submitted!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, maxWidth: 360, margin: "0 auto 28px" }}>
              We'll review your application for <strong style={{ color: "var(--text-primary)" }}>{project.title}</strong> and get back within 5–7 working days.
            </p>
            <button onClick={onClose} style={{
              background: "var(--accent)", color: "#fff", border: "none",
              borderRadius: "var(--radius-sm)", padding: "10px 28px",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>Close</button>
          </div>

        ) : step === 1 ? (
          /* ── Step 1: Requirements ── */
          <>
            <div style={{
              padding: "20px 24px 16px", borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0,
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>{project.icon}</div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: tagStyle.color, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 2 }}>
                    {project.tag}
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

            <div style={{ padding: "20px 24px 24px", overflowY: "auto", flex: 1 }}>
              {/* Meta chips */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                {[project.duration, project.mode, project.type, `Deadline: ${project.deadline}`].map(c => (
                  <span key={c} style={{
                    fontSize: 11, padding: "3px 9px", borderRadius: 4,
                    background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)",
                  }}>{c}</span>
                ))}
              </div>

              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
                {project.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", marginBottom: 20 }}>
                <div>
                  <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingBottom: 5, borderBottom: "1px solid var(--border)" }}>
                    Requirements
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
                  <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingBottom: 5, borderBottom: "1px solid var(--border)" }}>
                    What You'll Build
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
                <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Tech Stack</p>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {project.stack.map(s => (
                    <span key={s} style={{
                      fontSize: 11, padding: "3px 9px", borderRadius: 3,
                      background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
                      color: tagStyle.color, fontWeight: 700,
                    }}>{s}</span>
                  ))}
                </div>
              </div>

              <div style={{
                background: "var(--yellow-dim)", border: "1px solid rgba(226,178,3,0.3)",
                borderRadius: "var(--radius-sm)", padding: "10px 14px",
                fontSize: 12, color: "var(--yellow)", marginBottom: 20, fontWeight: 500,
              }}>
                ⚠️ This is an <strong>unpaid, experience-based internship</strong>. You'll receive mentorship and a Letter of Recommendation upon completion.
              </div>

              <button onClick={() => setStep(2)} style={{
                width: "100%", padding: "11px 0",
                background: "var(--accent)", color: "#fff", border: "none",
                borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "Syne, sans-serif",
              }}>
                Apply 
              </button>
            </div>
          </>

        ) : (
          /* ── Step 2: Application Form ── */
          <>
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
                  <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>
                    Apply — {project.title}
                  </h2>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>Step 2 of 2 · Fill in your details</p>
                </div>
              </div>
              <button onClick={onClose} style={{
                background: "var(--bg-hover)", border: "1px solid var(--border)",
                borderRadius: 6, width: 28, height: 28, cursor: "pointer",
                color: "var(--text-muted)", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>

            <div style={{ padding: "18px 24px 24px", overflowY: "auto", flex: 1 }}>
              {error && (
                <div style={{
                  background: "var(--red-dim)", border: "1px solid rgba(227,73,53,0.25)",
                  borderRadius: "var(--radius-sm)", padding: "10px 14px",
                  fontSize: 13, color: "var(--red)", marginBottom: 16,
                }}>{error}</div>
              )}

              <SectionLabel>Personal Details</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                <FormField label="Full Name *" name="fullName" type="text" placeholder="Arjun Sharma" onChange={handleChange} />
                <FormField label="Email Address *" name="email" type="email" placeholder="arjun@college.edu" onChange={handleChange} />
              </div>
              <FormField label="Phone (optional)" name="phone" type="tel" placeholder="+91 98765 43210" onChange={handleChange} />

              <SectionLabel>Academic Details</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                <FormField label="College / University *" name="college" type="text" placeholder="KIET Group of Institutions" onChange={handleChange} />
                <FormField label="Branch / Department *" name="branch" type="text" placeholder="Computer Science & Engineering" onChange={handleChange} />
                <FormField label="Graduation Year *" name="graduationYear" type="text" placeholder="2026" onChange={handleChange} />
                <FormField label="CGPA / % (optional)" name="cgpa" type="text" placeholder="8.4 / 10" onChange={handleChange} />
              </div>

              <SectionLabel>Profiles & Resume</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                <FormField label="LinkedIn (optional)" name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/..." onChange={handleChange} />
                <FormField label="GitHub (optional)" name="githubUrl" type="url" placeholder="https://github.com/..." onChange={handleChange} />
              </div>
              <FormField label="Resume Link (Drive / Notion) *" name="resumeLink" type="url" placeholder="https://drive.google.com/..." onChange={handleChange} />

              <SectionLabel>Technical Background</SectionLabel>
              <FormField label="Tools & Technologies You Know *" name="toolsKnown" type="text" placeholder="Python, pandas, scikit-learn, SQL, Git..." onChange={handleChange} />

              {project.extraField === "projectLink" && (
                <FormField label="Past Data/Analytics Project Link (optional)" name="projectLink" type="url" placeholder="GitHub / Kaggle / Colab link" onChange={handleChange} />
              )}
              {project.extraField === "nlpExperience" && (
                <FormTextarea label="Describe Your NLP Experience *" name="nlpExperience" placeholder="E.g., built a sentiment classifier using NLTK..." onChange={handleChange} />
              )}

              <FormTextarea label="Prior Experience / Projects *" name="priorExperience" placeholder="Describe any relevant projects, coursework, or work experience..." onChange={handleChange} />
              <FormTextarea label="Why do you want to work on this project? *" name="whyInterested" placeholder="Tell us what excites you about this specific project..." onChange={handleChange} />

              <SectionLabel>Availability</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                <div className="form-group">
                  <label className="form-label">Availability *</label>
                  <select className="form-select" name="availability" required onChange={handleChange} defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option value="Full-time (40 hrs/week)">Full-time (40 hrs/week)</option>
                    <option value="Part-time (20 hrs/week)">Part-time (20 hrs/week)</option>
                  </select>
                </div>
                <FormField label="Earliest Start Date *" name="startDate" type="date" onChange={handleChange} />
              </div>

              <button onClick={handleSubmit} disabled={loading} style={{
                width: "100%", marginTop: 16, padding: "11px 0",
                background: "var(--accent)", color: "#fff", border: "none",
                borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                fontFamily: "Syne, sans-serif",
              }}>
                {loading ? "Submitting…" : "Submit Application →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700,
      color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px",
      margin: "16px 0 10px", paddingBottom: 6, borderBottom: "1px solid var(--border)",
    }}>{children}</p>
  );
}

function FormField({ label, name, type, placeholder, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" name={name} type={type} placeholder={placeholder} onChange={onChange} />
    </div>
  );
}

function FormTextarea({ label, name, placeholder, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea className="form-textarea" name={name} placeholder={placeholder} rows={3} onChange={onChange} />
    </div>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────
function ProjectCard({ project, onApply, appStatus }) {
  const tagStyle = tagStyles[project.tagColor];
  const { isSignedIn } = useUser();

  // appStatus = null (not applied) | { status, adminNote }
  const applied = !!appStatus;
  const canReapply = appStatus?.status === "Rejected";
  const chip = appStatus ? statusChip(appStatus.status) : null;

  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "22px 24px",
      transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--border-light)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: tagStyle.color, opacity: 0.7,
        borderRadius: "var(--radius) var(--radius) 0 0",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10, flexShrink: 0,
            background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>{project.icon}</div>
          <div>
            <span style={{
              display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.6px",
              textTransform: "uppercase", padding: "2px 8px", borderRadius: 3,
              background: tagStyle.bg, border: `1px solid ${tagStyle.border}`, color: tagStyle.color, marginBottom: 4,
            }}>{project.tag}</span>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {project.title}
            </h3>
          </div>
        </div>
        <div style={{
          flexShrink: 0, background: "var(--green-dim)",
          border: "1px solid rgba(34,160,107,0.25)", borderRadius: 5, padding: "4px 10px", textAlign: "center",
        }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "var(--green)", lineHeight: 1 }}>
            {project.openings}
          </div>
          <div style={{ fontSize: 9, color: "var(--green)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Open{project.openings > 1 ? "ings" : "ing"}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14 }}>
        {project.subtitle}
      </p>

      {/* Meta chips */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {[project.duration, project.mode, `Deadline: ${project.deadline}`].map(c => (
          <span key={c} style={{
            display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11,
            padding: "3px 8px", borderRadius: 4, background: "var(--bg-hover)",
            border: "1px solid var(--border)", color: "var(--text-muted)", fontWeight: 500,
          }}>{c}</span>
        ))}
      </div>

      {/* Stack */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>
        {project.stack.map(s => (
          <span key={s} style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 3,
            background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
            color: tagStyle.color, fontWeight: 700,
          }}>{s}</span>
        ))}
      </div>

      {/* Rejection note */}
      {appStatus?.status === "Rejected" && appStatus?.adminNote && (
        <div style={{
          background: "var(--red-dim)", border: "1px solid rgba(227,73,53,0.25)",
          borderRadius: "var(--radius-sm)", padding: "10px 12px", marginBottom: 14,
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            Feedback
          </p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{appStatus.adminNote}</p>
        </div>
      )}

      {/* Bottom action area — pushed to bottom */}
      <div style={{ marginTop: "auto" }}>
        {/* Status badge if applied */}
        {applied && chip && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: canReapply ? 10 : 0,
          }}>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20,
              background: chip.bg, color: chip.color, border: `1px solid ${chip.border}`,
            }}>{chip.label}</span>
            {appStatus?.status === "Shortlisted" && (
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Check dashboard for details</span>
            )}
          </div>
        )}

        {/* Apply button logic */}
        {!isSignedIn ? (
          <button onClick={() => onApply(project)} style={{
            width: "100%", marginTop: applied ? 0 : 0, padding: "9px 0",
            background: "var(--accent)", color: "#fff", border: "none",
            borderRadius: "var(--radius-sm)", fontSize: 13,
            fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif",
          }}>
            Apply Now 
          </button>
        ) : !applied ? (
          <button onClick={() => onApply(project)} style={{
            width: "100%", padding: "9px 0",
            background: "var(--accent)", color: "#fff", border: "none",
            borderRadius: "var(--radius-sm)", fontSize: 13,
            fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif",
          }}>
            Apply Now
          </button>
        ) : canReapply ? (
          <button onClick={() => onApply(project)} style={{
            width: "100%", padding: "9px 0",
            background: "var(--red-dim)", color: "var(--red)",
            border: "1px solid rgba(227,73,53,0.3)",
            borderRadius: "var(--radius-sm)", fontSize: 13,
            fontWeight: 700, cursor: "pointer", fontFamily: "Syne, sans-serif",
          }}>
            Reapply 
          </button>
        ) : null /* Pending or Shortlisted — no button */ }
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeProject, setActiveProject] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [myApps, setMyApps] = useState({});
  const { isSignedIn } = useUser();

  useEffect(() => setMounted(true), []);

  // Fetch user's existing applications
  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/my-applications")
      .then(r => r.json())
      .then(d => setMyApps(d.applications ?? {}));
  }, [isSignedIn]);

  const refreshApps = () => {
    if (!isSignedIn) return;
    fetch("/api/my-applications")
      .then(r => r.json())
      .then(d => setMyApps(d.applications ?? {}));
  };

  if (!mounted) return null;

  return (
    <>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "var(--sidebar-bg)", borderBottom: "1px solid var(--sidebar-border)",
        padding: "0 28px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backdropFilter: "blur(8px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18,
            color: "var(--sidebar-logo-color)", letterSpacing: "-0.3px",
          }}>
            Zen<span style={{ color: "var(--sidebar-logo-accent)" }}>taras</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <button style={{
                padding: "6px 16px", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--text-primary)", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button style={{
                padding: "6px 16px", borderRadius: "var(--radius-sm)",
                border: "none", background: "var(--accent)",
                color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Sign Up</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", fontWeight: 500 }}>
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      <main style={{
        maxWidth: 1080, margin: "0 auto",
        padding: "48px 28px 80px", minHeight: "100vh", background: "var(--bg)",
      }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h1 style={{
            fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.15,
            letterSpacing: "-0.5px", marginBottom: 16,
          }}>
            Build Real AI & Data Projects.<br />
            <span style={{ color: "var(--accent)" }}>Gain Real Experience.</span>
          </h1>
          <p style={{
            fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7,
            maxWidth: 560, margin: "0 auto 28px",
          }}>
            No stipend. No shortcuts. Just hands-on project work alongside our core team — you ship real code, real models, and real dashboards.
          </p>

          {/* ── Dynamic stats ── */}
          <div style={{
            display: "inline-flex", gap: 0, border: "1px solid var(--border)",
            borderRadius: "var(--radius)", overflow: "hidden", background: "var(--bg-card)",
          }}>
            {[
              { val: TOTAL_PROJECTS, label: "Projects" },
              { val: TOTAL_OPENINGS, label: "Open Spots" },
              { val: "LOR", label: "On Completion" },
              { val: "Remote", label: "Fully" },
            ].map((s, i) => (
              <div key={s.label} style={{
                padding: "12px 20px",
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800,
                  color: "var(--text-primary)", lineHeight: 1, marginBottom: 3,
                }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16, marginBottom: 56,
        }}>
          {PROJECTS.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              onApply={setActiveProject}
              appStatus={myApps[p.id] ?? null}
            />
          ))}
        </div>

        {/* How it works */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 4, height: 20, borderRadius: 2, background: "var(--green)", flexShrink: 0 }} />
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
              How It Works
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { step: "01", title: "Apply Online", desc: "Fill out the application form. Select your preferred project and submit all details in one place." },
              { step: "02", title: "Shortlisting", desc: "We review within 5–7 days. Shortlisted candidates receive a confirmation with next steps." },
              { step: "03", title: "Start Building", desc: "You join the team, get access to repos and tools, and start contributing from week one." },
            ].map(s => (
              <div key={s.step} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 20px" }}>
                <span style={{
                  fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 800, color: "var(--accent)",
                  background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
                  borderRadius: 4, padding: "1px 7px", display: "inline-block", marginBottom: 10,
                }}>{s.step}</span>
                <h4 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{s.title}</h4>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 4, height: 20, borderRadius: 2, background: "var(--yellow)", flexShrink: 0 }} />
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Frequently Asked
            </h2>
          </div>
          {[
            { q: "Is there any stipend?", a: "No. These are fully unpaid, experience-based internships. You'll receive a Letter of Recommendation and build a real project for your portfolio." },
            { q: "Can I apply to multiple projects?", a: "Yes, but please apply individually for each project you're genuinely interested in." },
            { q: "What if I'm a fresher with no experience?", a: "That's fine. We look for curiosity, willingness to learn, and basic technical foundations." },
            { q: "Are these internships certificate-based only?", a: "No. You'll do real, meaningful work. Quality matters over just completing time." },
          ].map(faq => (
            <div key={faq.q} style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", padding: "14px 18px", marginBottom: 8,
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 5 }}>{faq.q}</p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 56, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            © 2026 Zentaras · Questions?{" "}
            <a href="mailto:team@zentaras.in" style={{ color: "var(--accent)", textDecoration: "none" }}>team@zentaras.in</a>
          </p>
        </div>
      </main>

      {/* Apply modal */}
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