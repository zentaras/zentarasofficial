"use client";

// app/internship/InternshipClient.jsx
import { useState, useEffect } from "react";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import { INTERNSHIP_STEPS, STEP_STATUS_COLORS } from "../../lib/internshipSteps";

// ─── Project meta ─────────────────────────────────────────────────────────────
const PROJECT_META = {
  "ai-resume-screener":  { icon: "🤖", color: "#6366f1", label: "AI Resume Screener" },
  "ecommerce-analytics": { icon: "📊", color: "#22a06b", label: "E-Commerce Analytics" },
  "sentiment-dashboard": { icon: "🧠", color: "#e2b203", label: "Sentiment Dashboard" },
};

// ─── Status Pill ─────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const s = STEP_STATUS_COLORS[status] ?? STEP_STATUS_COLORS.pending;
  const labels = {
    pending: "Not Started",
    submitted: "Under Review",
    approved: "Approved ✓",
    rejected: "Needs Revision",
  };
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap",
    }}>
      {labels[status] ?? status}
    </span>
  );
}

// ─── Visual step rail ────────────────────────────────────────────────────────
function StepRail({ currentStep, steps, totalSteps, onSelect, activeIndex }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const sNum = i + 1;
        const stepData = steps.find(s => s.stepNumber === sNum);
        const status = stepData?.status ?? "pending";
        const isActive = sNum === activeIndex;
        const isLocked = sNum > currentStep;

        let dot = "var(--bg-hover)", dotBorder = "var(--border)", dotText = "var(--text-muted)";
        if (status === "approved") { dot = "var(--green)"; dotBorder = "var(--green)"; dotText = "#fff"; }
        else if (status === "submitted") { dot = "var(--blue)"; dotBorder = "var(--blue)"; dotText = "#fff"; }
        else if (status === "rejected") { dot = "var(--red)"; dotBorder = "var(--red)"; dotText = "#fff"; }
        else if (sNum === currentStep) { dot = "var(--accent)"; dotBorder = "var(--accent)"; dotText = "#fff"; }

        const stepConfig = INTERNSHIP_STEPS[i];

        return (
          <div key={sNum} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            {/* Dot + connector */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <button
                onClick={() => !isLocked && onSelect(sNum)}
                disabled={isLocked}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: dot, border: `2px solid ${dotBorder}`, color: dotText,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, fontFamily: "Syne, sans-serif",
                  cursor: isLocked ? "not-allowed" : "pointer",
                  boxShadow: isActive ? `0 0 0 3px var(--accent-dim)` : "none",
                  transition: "all 0.2s", outline: "none",
                }}
              >
                {status === "approved" ? "✓" : isLocked ? "🔒" : sNum}
              </button>
              {sNum < totalSteps && (
                <div style={{
                  width: 2, height: 28, marginTop: 2,
                  background: status === "approved" ? "var(--green)" : "var(--border)",
                  transition: "background 0.3s",
                }} />
              )}
            </div>

            {/* Label */}
            <div style={{ paddingTop: 6, paddingBottom: sNum < totalSteps ? 28 : 0 }}>
              <p style={{
                fontSize: 12, fontWeight: isActive ? 700 : 500,
                color: isLocked ? "var(--text-muted)" : isActive ? "var(--accent)" : "var(--text-primary)",
                marginBottom: 1, lineHeight: 1.3,
              }}>
                {stepConfig?.title}
              </p>
              <StatusPill status={status} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Field Input ──────────────────────────────────────────────────────────────
function FieldInput({ field, value, onChange, readOnly }) {
  const base = {
    width: "100%", boxSizing: "border-box",
    background: readOnly ? "var(--bg)" : "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "9px 12px",
    color: readOnly ? "var(--text-secondary)" : "var(--text-primary)",
    fontSize: 13, outline: "none",
    fontFamily: "DM Sans, sans-serif",
    cursor: readOnly ? "default" : "text",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
        display: "block", marginBottom: 5,
        textTransform: "uppercase", letterSpacing: "0.5px",
      }}>
        {field.label}{" "}
        {field.required && <span style={{ color: "var(--red)" }}>*</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={readOnly ? "—" : field.placeholder}
          maxLength={field.maxLength}
          readOnly={readOnly}
          rows={4}
          style={{ ...base, resize: "vertical", lineHeight: 1.6 }}
        />
      ) : (
        <input
          type={field.type === "url" ? "url" : "text"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={readOnly ? "—" : field.placeholder}
          readOnly={readOnly}
          style={base}
        />
      )}
      {field.maxLength && !readOnly && (
        <p style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "right", marginTop: 3 }}>
          {(value ?? "").length} / {field.maxLength}
        </p>
      )}
    </div>
  );
}

// ─── Single Step Panel ───────────────────────────────────────────────────────
function StepPanel({ stepConfig, stepData, isActive, isLocked, currentStep, applicantId, onSubmitSuccess }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (stepData?.data) setFormData(stepData.data);
    else setFormData({});
  }, [stepData]);

  const status = stepData?.status ?? "pending";

  const canEdit = isActive && (
    !stepData || status === "rejected" || status === "pending"
  );
  const canSubmit = canEdit && !stepConfig.isAdminControlled;
  const readOnly = !canEdit;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
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
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLocked) {
    return (
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", padding: "32px 28px", textAlign: "center",
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
        <p style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
          Step {stepConfig.number} — Locked
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 360, margin: "0 auto" }}>
          Complete and get approval for{" "}
          <strong style={{ color: "var(--accent)" }}>Step {currentStep}</strong> first. Admin will unlock this step after review.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: "var(--bg-card)", border: `1px solid ${isActive ? "var(--accent-border)" : "var(--border)"}`,
      borderRadius: "var(--radius)", overflow: "hidden",
    }}>
      {/* Step header */}
      <div style={{
        padding: "18px 24px", borderBottom: "1px solid var(--border)",
        background: isActive ? "var(--bg)" : "transparent",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: status === "approved" ? "var(--green)" : status === "submitted" ? "var(--blue)" : status === "rejected" ? "var(--red)" : isActive ? "var(--accent)" : "var(--bg-hover)",
          color: ["approved","submitted","rejected"].includes(status) || isActive ? "#fff" : "var(--text-muted)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 800, fontFamily: "Syne, sans-serif",
        }}>
          {status === "approved" ? "✓" : stepConfig.number}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>
            Step {stepConfig.number} — {stepConfig.title}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{stepConfig.description}</p>
        </div>
        <StatusPill status={status} />
      </div>

      <div style={{ padding: "22px 24px" }}>
        {/* Admin note banner */}
        {stepData?.adminNote && (
          <div style={{
            marginBottom: 20, padding: "12px 16px",
            background: status === "rejected" ? "var(--red-dim)" : "var(--green-dim)",
            border: `1px solid ${status === "rejected" ? "rgba(227,73,53,0.3)" : "rgba(34,160,107,0.3)"}`,
            borderRadius: "var(--radius-sm)",
          }}>
            <p style={{
              fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4,
              color: status === "rejected" ? "var(--red)" : "var(--green)",
            }}>
              {status === "rejected" ? "❌ Admin Feedback — Please Revise" : "✓ Admin Note"}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{stepData.adminNote}</p>
          </div>
        )}

        {/* Admin-controlled final step */}
        {stepConfig.isAdminControlled ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            {status === "approved" ? (
              <>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🎓</div>
                <p style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 800, color: "var(--green)", marginBottom: 8 }}>
                  Internship Complete!
                </p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 400, margin: "0 auto 20px" }}>
                  Congratulations! Your certificate will be emailed within 3–5 business days.
                </p>
                {/* Optional LinkedIn + testimonial fields */}
                {stepConfig.fields.map(f => (
                  <FieldInput key={f.key} field={f} value={formData[f.key] ?? ""} onChange={v => setFormData(p => ({ ...p, [f.key]: v }))} readOnly={false} />
                ))}
              </>
            ) : (
              <div style={{
                background: "var(--bg)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)", padding: "28px",
              }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  Awaiting final admin review. Once your <strong style={{ color: "var(--accent)" }}>Step 4</strong> submission is approved, this step will be marked complete and your certificate will be issued.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Form fields */}
            {stepConfig.fields.map(field => (
              <FieldInput
                key={field.key}
                field={field}
                value={formData[field.key] ?? ""}
                onChange={v => setFormData(p => ({ ...p, [field.key]: v }))}
                readOnly={readOnly}
              />
            ))}

            {/* Status messages */}
            {status === "submitted" && !submitted && (
              <div style={{
                padding: "12px 16px", background: "var(--blue-dim)",
                border: "1px solid rgba(99,102,241,0.3)", borderRadius: "var(--radius-sm)", marginBottom: 14,
              }}>
                <p style={{ fontSize: 13, color: "var(--blue)", fontWeight: 600 }}>
                  🕐 Under Review — Admin will approve or leave feedback.
                </p>
              </div>
            )}

            {submitted && (
              <div style={{
                padding: "12px 16px", background: "var(--green-dim)",
                border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)", marginBottom: 14,
              }}>
                <p style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                  ✓ Submitted! Awaiting admin review.
                </p>
              </div>
            )}

            {error && (
              <p style={{ fontSize: 12, color: "var(--red)", marginBottom: 12 }}>{error}</p>
            )}

            {canSubmit && !submitted && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: "11px 28px",
                  background: "var(--accent)", color: "#fff",
                  border: "none", borderRadius: "var(--radius-sm)",
                  fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "Syne, sans-serif", opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Submitting…" : `Submit Step ${stepConfig.number} →`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Applicant Details Panel ──────────────────────────────────────────────────
function ApplicantDetails({ applicant, projectKey }) {
  const meta = PROJECT_META[projectKey] ?? { icon: "🎓", color: "#6366f1", label: "Internship" };

  const rows = [
    ["Full Name", applicant.fullName],
    ["Email", applicant.email],
    ["Phone", applicant.phone || "—"],
    ["College", applicant.college],
    ["Branch", applicant.branch],
    ["Graduation Year", applicant.graduationYear],
    ["CGPA / %", applicant.cgpa || "—"],
    ["Availability", applicant.availability],
    ["Start Date", applicant.startDate],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Project badge */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", padding: "18px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: `${meta.color}18`, border: `1px solid ${meta.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>{meta.icon}</div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Assigned Project</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{meta.label}</p>
          </div>
        </div>
        <div style={{
          background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)",
          borderRadius: "var(--radius-sm)", padding: "8px 12px",
        }}>
          <p style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>✓ Shortlisted — Internship Active</p>
        </div>
      </div>

      {/* Personal details */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", padding: "18px 20px",
      }}>
        <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
          Your Details
        </p>
        {rows.map(([l, v]) => (
          <div key={l} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", width: 100, flexShrink: 0 }}>{l}</span>
            <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, wordBreak: "break-all" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Links */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", padding: "18px 20px",
      }}>
        <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
          Links
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { label: "📄 Resume", url: applicant.resumeLink },
            { label: "LinkedIn", url: applicant.linkedinUrl },
            { label: "GitHub", url: applicant.githubUrl },
          ].filter(l => l.url).map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 600,
              padding: "6px 10px", background: "var(--accent-dim)",
              border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)",
              display: "block",
            }}>
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>

      {/* Essays */}
      {[
        ["Why Interested", applicant.whyInterested],
        ["Prior Experience", applicant.priorExperience],
        ["Tools Known", applicant.toolsKnown],
        ...(applicant.nlpExperience ? [["NLP Experience", applicant.nlpExperience]] : []),
      ].map(([l, v]) => (
        <div key={l} style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "16px 20px",
        }}>
          <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            {l}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>{v}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InternshipClient({ clerkUser, applicant, track: initialTrack, projectKey, projectName }) {
  const [track, setTrack] = useState(initialTrack);
  const [activeStep, setActiveStep] = useState(initialTrack.currentStep);
  const [view, setView] = useState("tracker"); // "tracker" | "details"
  const meta = PROJECT_META[projectKey] ?? { icon: "🎓", color: "#6366f1", label: projectName };

  const refreshTrack = async () => {
    const res = await fetch(`/api/intern/track?applicantId=${applicant.id}`);
    const data = await res.json();
    if (data.track) {
      setTrack(data.track);
      setActiveStep(data.track.currentStep);
    }
  };

  const progress = Math.round(
    (track.steps.filter(s => s.status === "approved").length / INTERNSHIP_STEPS.length) * 100
  );

  const activeStepConfig = INTERNSHIP_STEPS.find(s => s.number === activeStep);
  const activeStepData = track.steps.find(s => s.stepNumber === activeStep) ?? null;
  const isLocked = activeStep > track.currentStep;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <Navbar showBackLink={true} showDashboardLink={true} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* ── Top Header Card ── */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: `${meta.color}18`, border: `1px solid ${meta.color}30`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>{meta.icon}</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>
                {meta.label} — Internship Tracker
              </h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Hi {clerkUser.firstName ?? "there"} 👋 · Complete all 5 steps to finish your internship and receive your certificate.
              </p>
            </div>

            {/* Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ width: 120, height: 6, background: "var(--border)", borderRadius: 99 }}>
                <div style={{
                  height: "100%", borderRadius: 99, background: "var(--green)",
                  width: `${progress}%`, transition: "width 0.5s ease",
                }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", whiteSpace: "nowrap" }}>
                {progress}% done
              </span>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 4, marginTop: 18, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            {[
              { key: "tracker", label: "📋 Internship Steps" },
              { key: "details", label: "👤 My Application" },
            ].map(t => (
              <button key={t.key} onClick={() => setView(t.key)} style={{
                padding: "7px 16px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                background: view === t.key ? "var(--accent)" : "transparent",
                color: view === t.key ? "#fff" : "var(--text-muted)",
                border: view === t.key ? "none" : "1px solid var(--border)",
                transition: "all 0.15s",
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {view === "details" ? (
          /* ── Application Details View ── */
          <ApplicantDetails applicant={applicant} projectKey={projectKey} />
        ) : (
          /* ── Tracker View ── */
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "start" }}>

            {/* Left sidebar — step rail */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "20px 20px",
              position: "sticky", top: 76,
            }}>
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                Progress
              </p>
              <StepRail
                currentStep={track.currentStep}
                steps={track.steps}
                totalSteps={INTERNSHIP_STEPS.length}
                onSelect={setActiveStep}
                activeIndex={activeStep}
              />

              {track.isCompleted && (
                <div style={{
                  marginTop: 20, padding: "12px", textAlign: "center",
                  background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)",
                  borderRadius: "var(--radius-sm)",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>🎓</div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>Completed!</p>
                </div>
              )}
            </div>

            {/* Right — active step content */}
            <div>
              {/* Active step info banner */}
              {!track.isCompleted && (
                <div style={{
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius)", padding: "14px 20px", marginBottom: 16,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "var(--accent)", flexShrink: 0,
                    boxShadow: "0 0 0 3px var(--accent-dim)",
                  }} />
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    <strong style={{ color: "var(--accent)" }}>Step {track.currentStep}</strong> is currently active.
                    {track.currentStep < INTERNSHIP_STEPS.length
                      ? " Complete and submit it — admin will review before unlocking the next step."
                      : " This is the final step."}
                  </p>
                </div>
              )}

              {activeStepConfig && (
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
              )}
            </div>
          </div>
        )}

        {/* Completed banner */}
        {track.isCompleted && view === "tracker" && (
          <div style={{
            marginTop: 20, padding: "28px", textAlign: "center",
            background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)",
            borderRadius: "var(--radius)",
          }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>🎓</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800, color: "var(--green)", marginBottom: 6 }}>
              Internship Completed!
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto" }}>
              Congratulations on completing your internship at <strong>{meta.label}</strong>. Your certificate will be emailed within 3–5 business days.
            </p>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}