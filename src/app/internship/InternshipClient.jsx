

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
    if (diff <= 0) return { urgent: true, overdue: true, color: "var(--red)", days: 0, hours: 0, minutes: 0, seconds: 0 };
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return {
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

// ─── Points Badge ──────────────────────────────────────────────────────────────
function PointsBadge({ points, maxPoints = 100, size = "normal" }) {
  if (points == null) return null;
  const isMax = points === maxPoints;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: size === "small" ? 9 : 11, fontWeight: 700,
      padding: size === "small" ? "1px 6px" : "3px 10px",
      borderRadius: 20,
      background: isMax ? "var(--green-dim)" : points >= 70 ? "var(--blue-dim)" : "var(--yellow-dim)",
      color: isMax ? "var(--green)" : points >= 70 ? "var(--blue)" : "var(--yellow)",
      border: `1px solid ${isMax ? "rgba(34,160,107,0.3)" : points >= 70 ? "rgba(99,102,241,0.3)" : "rgba(226,178,3,0.3)"}`,
      flexShrink: 0,
    }}>
      {points}/{maxPoints} pts
    </span>
  );
}

// ─── Smart Field Value — detects URLs and renders as links ────────────────────
function FieldValue({ value }) {
  if (!value) return <span style={{ color: "var(--text-muted)" }}>—</span>;

  // Split value by lines, then detect URLs per line
  const lines = value.split("\n");

  return (
    <span>
      {lines.map((line, li) => {
        // Simple URL detection
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = line.split(urlRegex);

        return (
          <span key={li}>
            {parts.map((part, pi) =>
              /^https?:\/\//.test(part) ? (
                <a
                  key={pi}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--accent)",
                    textDecoration: "underline",
                    fontWeight: 600,
                    wordBreak: "break-all",
                    overflowWrap: "anywhere",
                    display: "inline",
                  }}
                >
                  {part}
                </a>
              ) : (
                <span key={pi}>{part}</span>
              )
            )}
            {li < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}

// ─── Step 1 Briefing Panel ─────────────────────────────────────────────────────
function Step1BriefingPanel({ stepData }) {
  const briefing = stepData?.data;
  const status   = stepData?.status ?? "pending";
  const isReady  = !!briefing && status === "approved";
  const points   = stepData?.pointsAwarded ?? null;

  if (!isReady) {
    return (
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>⏳</div>
        <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>
          Step 1 — Awaiting Project Briefing
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>
          Admin is preparing your dataset assignment, problem statement, and project approach.
          Once published, <strong style={{ color: "var(--text-primary)" }}>Step 1 will auto-complete</strong> and you'll receive <strong style={{ color: "var(--green)" }}>100 points</strong> automatically.
        </p>
        <div style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>No action required from you for this step</span>
        </div>
      </div>
    );
  }

  const fields = [
    { key: "assignedDataset",  label: "Assigned Dataset",   icon: "🗄️" },
    { key: "problemStatement", label: "Problem Statement",  icon: "🎯" },
    { key: "toolsPlanned",     label: "Tools & Stack",      icon: "🛠️" },
    { key: "approach",         label: "Suggested Approach", icon: "📐" },
  ];

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
            ✓
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>Step 1 — Project Briefing & Setup</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Your project has been assigned by admin. Review the details below.</p>
          </div>
          {/* Badges on their own line below on mobile */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", width: "100%", paddingLeft: 50 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "var(--green-dim)", color: "var(--green)", border: "1px solid rgba(34,160,107,0.3)", textTransform: "uppercase" }}>
              Approved ✓
            </span>
            <PointsBadge points={points ?? 100} />
          </div>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Auto-points notice */}
        <div style={{ marginBottom: 20, padding: "12px 16px", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🎉</span>
          <p style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
            You've been awarded <strong>100/100 points</strong> for Step 1 — auto-granted on briefing publish.
          </p>
        </div>

        {/* Briefing fields — read-only, URLs rendered as links */}
        {fields.map(({ key, label, icon }) => briefing[key] ? (
          <div key={key} style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
              {icon} {label}
            </p>
            <div style={{
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
              padding: "10px 14px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7,
              wordBreak: "break-word", overflowWrap: "anywhere",
              overflow: "hidden",
            }}>
              <FieldValue value={briefing[key]} />
            </div>
          </div>
        ) : null)}
      </div>
    </div>
  );
}

// ─── Step 5 Candidate View ─────────────────────────────────────────────────────
function Step5CandidatePanel({ track }) {
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
          This step will be available once admin reviews and evaluates your{" "}
          <strong style={{ color: "var(--accent)" }}>Step 4 Final Submission</strong>.
        </p>
      </div>
    );
  }

  if (!track.analyticalFeedback && !track.insightsFeedback) {
    return (
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>⏳</div>
        <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>
          Step 5 — Awaiting Admin Evaluation
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 440, margin: "0 auto" }}>
          Your Final Submission has been approved! Admin is now preparing your performance feedback and certificate. You'll see everything here once it's published.
        </p>
      </div>
    );
  }

  const totalPoints = track.steps
    .filter(s => s.stepNumber >= 1 && s.stepNumber <= 4)
    .reduce((acc, s) => acc + (s.pointsAwarded ?? 0), 0);
  const maxTotal = 400;

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
        <div style={{ background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)", padding: "20px", marginBottom: 24, textAlign: "center" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 16, fontWeight: 800, color: "var(--green)", marginBottom: 4 }}>
            Congratulations! You've completed your internship.
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>Here is your performance evaluation from admin.</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: 20, padding: "6px 16px" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "var(--green)" }}>{totalPoints} / {maxTotal}</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>total points</span>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Points Breakdown</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[1, 2, 3, 4].map(n => {
              const s      = track.steps.find(st => st.stepNumber === n);
              const pts    = s?.pointsAwarded ?? null;
              const config = INTERNSHIP_STEPS.find(st => st.number === n);
              return (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", width: 16, flexShrink: 0 }}>{n}</span>
                  <span style={{ fontSize: 12, color: "var(--text-primary)", flex: 1, minWidth: 0 }}>{config?.title}</span>
                  {pts != null ? <PointsBadge points={pts} size="small" /> : <span style={{ fontSize: 10, color: "var(--text-muted)" }}>—</span>}
                </div>
              );
            })}
          </div>
        </div>

        {track.analyticalFeedback && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              🧠 Feedback — Analytical Thinking
            </p>
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "14px 16px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {track.analyticalFeedback}
            </div>
          </div>
        )}

        {track.insightsFeedback && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              💡 Feedback — Communication of Insights
            </p>
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "14px 16px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {track.insightsFeedback}
            </div>
          </div>
        )}

        {(track.certificateLink || track.lorLink || track.projectRepoLink) && (
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              Your Documents & Links
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {track.certificateLink && (
                <a href={track.certificateLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.35)", borderRadius: "var(--radius-sm)", textDecoration: "none" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>🎓</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", marginBottom: 1 }}>Download Certificate</p>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.certificateLink}</p>
                  </div>
                  <span style={{ fontSize: 14, color: "var(--green)", flexShrink: 0 }}>↗</span>
                </a>
              )}
              {track.lorLink && (
                <a href={track.lorLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", textDecoration: "none" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>📄</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", marginBottom: 1 }}>Letter of Recommendation</p>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.lorLink}</p>
                  </div>
                  <span style={{ fontSize: 14, color: "var(--accent)", flexShrink: 0 }}>↗</span>
                </a>
              )}
              {track.projectRepoLink && (
                <a href={track.projectRepoLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", textDecoration: "none" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>📂</span>
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

// ─── Step Rail ─────────────────────────────────────────────────────────────────
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
        const points   = stepData?.pointsAwarded ?? null;
        const showDeadlineBadge = deadline && !isLocked && status !== "approved";

        let dot = "var(--bg-hover)", dotBorder = "var(--border)", dotText = "var(--text-muted)";
        if (status === "approved")       { dot = "var(--green)";  dotBorder = "var(--green)";  dotText = "#fff"; }
        else if (status === "submitted") { dot = "var(--blue)";   dotBorder = "var(--blue)";   dotText = "#fff"; }
        else if (status === "rejected")  { dot = "var(--red)";    dotBorder = "var(--red)";    dotText = "#fff"; }
        else if (sNum === currentStep)   { dot = "var(--accent)"; dotBorder = "var(--accent)"; dotText = "#fff"; }

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
              <p style={{
                fontSize: 11, fontWeight: isActive ? 700 : 500, lineHeight: 1.3, marginBottom: 3,
                color: isLocked ? "var(--text-muted)" : isActive ? "var(--accent)" : "var(--text-primary)",
                wordBreak: "break-word", overflowWrap: "break-word",
              }}>
                {INTERNSHIP_STEPS[i]?.title}
              </p>
              {points != null && <PointsBadge points={points} size="small" />}
              {showDeadlineBadge && deadlineRemaining && (
                <span style={{
                  display: "inline-block", marginTop: points != null ? 4 : 0,
                  fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 8,
                  background: deadlineRemaining.overdue ? "var(--red-dim)" : deadlineRemaining.urgent ? "var(--yellow-dim)" : "var(--green-dim)",
                  color: deadlineRemaining.overdue ? "var(--red)" : deadlineRemaining.urgent ? "var(--yellow)" : "var(--green)",
                  border: `1px solid ${deadlineRemaining.overdue ? "rgba(227,73,53,0.3)" : deadlineRemaining.urgent ? "rgba(226,178,3,0.3)" : "rgba(34,160,107,0.3)"}`,
                }}>
                  {deadlineRemaining.overdue ? "⚠ Overdue" : deadlineRemaining.urgent ? "⏰ Due soon" : "Has deadline"}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Mobile Step Bar ───────────────────────────────────────────────────────────
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
        if (status === "approved")       { bg = "var(--green)";  border = "var(--green)";  color = "#fff"; }
        else if (status === "submitted") { bg = "var(--blue)";   border = "var(--blue)";   color = "#fff"; }
        else if (status === "rejected")  { bg = "var(--red)";    border = "var(--red)";    color = "#fff"; }
        else if (sNum === currentStep)   { bg = "var(--accent)"; border = "var(--accent)"; color = "#fff"; }

        return (
          <button
            key={sNum}
            onClick={() => !isLocked && onSelect(sNum)}
            disabled={isLocked}
            style={{
              flexShrink: 0, width: 34, height: 34, borderRadius: "50%",
              background: bg, border: `2px solid ${border}`, color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, fontFamily: "sans-serif",
              cursor: isLocked ? "not-allowed" : "pointer",
              boxShadow: isActive ? `0 0 0 3px var(--accent-dim)` : "none",
              transition: "all 0.2s", outline: "none", opacity: isLocked ? 0.6 : 1,
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
        <textarea
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={readOnly ? "—" : field.placeholder}
          maxLength={field.maxLength} readOnly={readOnly} rows={4}
          style={{ ...base, resize: "vertical", lineHeight: 1.6 }}
        />
      ) : (
        <input
          type={field.type === "url" ? "url" : "text"}
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={readOnly ? "—" : field.placeholder}
          readOnly={readOnly} style={base}
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

// ─── Regular Step Panel (steps 2–4) ───────────────────────────────────────────
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
  const points   = stepData?.pointsAwarded ?? null;
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
        <p style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
          Step {stepConfig.number} — Locked
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 360, margin: "0 auto" }}>
          Complete <strong style={{ color: "var(--accent)" }}>Step {currentStep}</strong> first. Admin will unlock this step after review.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-card)", border: `1px solid ${isActive ? "var(--accent-border)" : "var(--border)"}`, borderRadius: "var(--radius)", overflow: "hidden" }}>
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
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3, wordBreak: "break-word" }}>
              Step {stepConfig.number} — {stepConfig.title}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{stepConfig.description}</p>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", width: "100%", paddingLeft: 50, alignItems: "center" }}>
            {points != null && <PointsBadge points={points} />}
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
              textTransform: "uppercase", letterSpacing: "0.5px",
              background: status === "approved" ? "var(--green-dim)" : status === "submitted" ? "var(--blue-dim)" : status === "rejected" ? "var(--red-dim)" : "var(--bg-hover)",
              color: status === "approved" ? "var(--green)" : status === "submitted" ? "var(--blue)" : status === "rejected" ? "var(--red)" : "var(--text-muted)",
            }}>
              {status === "approved" ? "Approved ✓" : status === "submitted" ? "Under Review" : status === "rejected" ? "Needs Revision" : "Not Started"}
            </span>
          </div>
        </div>
        {points == null && !isLocked && (
          <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 8, marginLeft: 50 }}>
            Up to {stepConfig.maxPoints} points — awarded by admin after review
          </p>
        )}
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
          <FieldInput
            key={field.key} field={field}
            value={formData[field.key] ?? ""}
            onChange={v => setFormData(p => ({ ...p, [field.key]: v }))}
            readOnly={readOnly}
          />
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
          <button
            onClick={handleSubmit} disabled={loading}
            style={{
              padding: "12px 28px", background: "var(--accent)", color: "#fff",
              border: "none", borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer", fontFamily: "sans-serif",
              opacity: loading ? 0.7 : 1, maxWidth: 320,
            }}
          >
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

  const mentor = {
    name: "Soon",
    email: "Soon",
    phone: "+91 000000000",
    designation: "Soon",
    topmateLink: "Soon",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Project Card */}
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

      {/* Mentor Card */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 20px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Your Mentor</p>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: "#6366f118", border: "1px solid #6366f130", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#6366f1" }}>
            {mentor.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {mentor.name && <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{mentor.name}</p>}
            {mentor.designation && <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{mentor.designation}</p>}
          </div>
        </div>

        {[
          mentor.email && ["Email", mentor.email],
          mentor.phone && ["Phone", mentor.phone],
        ].filter(Boolean).map(([l, v]) => (
          <div key={l} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", width: 90, flexShrink: 0 }}>{l}</span>
            <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, wordBreak: "break-all", flex: 1 }}>{v}</span>
          </div>
        ))}

        {mentor.topmateLink && (
          <a
            href={mentor.topmateLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", marginTop: 14, fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 600, padding: "8px 12px", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-sm)", textAlign: "center" }}
          >
            Book a Session on Topmate
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function InternshipClient({ clerkUser, applicant, track: initialTrack, projectKey, projectName }) {
  const [track, setTrack]           = useState(initialTrack);
  const [activeStep, setActiveStep] = useState(initialTrack.currentStep);
  const [view, setView]             = useState("tracker");
  const isMobile                    = useIsMobile(768);
  const meta = PROJECT_META[projectKey] ?? { icon: "🎓", color: "#6366f1", label: projectName };

  const refreshTrack = async () => {
    const res  = await fetch(`/api/intern/track?applicantId=${applicant.id}`);
    const data = await res.json();
    if (data.track) { setTrack(data.track); setActiveStep(data.track.currentStep); }
  };

  const handleStepSelect = (sNum) => setActiveStep(sNum);

  const approved    = track.steps.filter(s => s.status === "approved").length;
  const progress    = Math.round((approved / INTERNSHIP_STEPS.length) * 100);
  const totalPoints = track.steps.reduce((acc, s) => acc + (s.pointsAwarded ?? 0), 0);

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
            <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: `${meta.color}18`, border: `1px solid ${meta.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              {meta.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontFamily: "sans-serif", fontSize: isMobile ? 15 : 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2, wordBreak: "break-word" }}>
                {meta.label} — Internship Tracker
              </h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Hi {clerkUser.firstName ?? "there"}. Complete all 5 steps to finish your internship.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0, width: isMobile ? "100%" : "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                <div style={{ flex: 1, height: 6, background: "var(--border)", borderRadius: 99, minWidth: isMobile ? 0 : 120 }}>
                  <div style={{ height: "100%", borderRadius: 99, background: "var(--green)", width: `${progress}%`, transition: "width 0.5s" }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", whiteSpace: "nowrap" }}>{progress}% done</span>
              </div>
              {totalPoints > 0 && (
                <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
                  {totalPoints} / 400 pts total
                </span>
              )}
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 4, marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
            {[{ key: "tracker", label: "Internship Steps" }, { key: "details", label: "Mentor Details" }].map(t => (
              <button key={t.key} onClick={() => setView(t.key)} style={{
                flex: isMobile ? 1 : "none",
                padding: isMobile ? "9px 10px" : "7px 16px",
                borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                background: view === t.key ? "var(--accent)" : "transparent",
                color: view === t.key ? "#fff" : "var(--text-muted)",
                border: view === t.key ? "none" : "1px solid var(--border)",
                transition: "all 0.15s", textAlign: "center",
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
            {isMobile && (
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 16px", marginBottom: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Progress</p>
                <MobileStepBar
                  currentStep={track.currentStep}
                  steps={track.steps}
                  totalSteps={INTERNSHIP_STEPS.length}
                  onSelect={handleStepSelect}
                  activeIndex={activeStep}
                />
                <p style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600, marginTop: 10 }}>
                  Step {activeStep}: {INTERNSHIP_STEPS.find(s => s.number === activeStep)?.title}
                </p>
                {track.isCompleted && (
                  <div style={{ marginTop: 10, padding: "8px 12px", textAlign: "center", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                   
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>Internship Completed!</p>
                  </div>
                )}
              </div>
            )}

            <div style={{
              display: isMobile ? "block" : "grid",
              gridTemplateColumns: isMobile ? undefined : "240px 1fr",
              gap: 20, alignItems: "start",
            }}>
              {!isMobile && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px", position: "sticky", top: 76 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Progress</p>
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
                      {totalPoints > 0 && (
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{totalPoints}/400 pts</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div>
                {!track.isCompleted && activeStep !== 5 && activeStep !== 1 && (
                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 4, boxShadow: "0 0 0 3px var(--accent-dim)" }} />
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      <strong style={{ color: "var(--accent)" }}>Step {track.currentStep}</strong> is currently active.
                      {track.currentStep < INTERNSHIP_STEPS.length
                        ? " Submit it — admin will review before unlocking the next step."
                        : " This is the final step."}
                    </p>
                  </div>
                )}

                {activeStep === 1 ? (
                  <Step1BriefingPanel stepData={activeStepData} />
                ) : activeStep === 5 ? (
                  <Step5CandidatePanel track={track} />
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

        {track.isCompleted && view === "tracker" && activeStep !== 5 && (
          <div style={{ marginTop: 20, padding: isMobile ? "24px 16px" : "28px", textAlign: "center", background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)", borderRadius: "var(--radius)" }}>

            <h2 style={{ fontFamily: "sans-serif", fontSize: isMobile ? 17 : 20, fontWeight: 800, color: "var(--green)", marginBottom: 6 }}>
              Internship Completed!
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 8px" }}>
              Congratulations on completing your internship at <strong>{meta.label}</strong>.
            </p>
            {totalPoints > 0 && (
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", marginBottom: 16 }}>
                Final Score: {totalPoints} / 400 points
              </p>
            )}
            <button
              onClick={() => setActiveStep(5)}
              style={{ padding: "10px 24px", background: "var(--green)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif", width: isMobile ? "100%" : "auto" }}
            >
              View Your Certificate & Feedback
            </button>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}