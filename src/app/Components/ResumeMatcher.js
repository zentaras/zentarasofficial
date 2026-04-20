"use client";

import { useState, useEffect, useCallback } from "react";

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const DAILY_LIMIT = 10;

const JOB_SECTION_WEIGHTS = [
  { key: "experience",      label: "Work Experience",           points: 25 },
  { key: "projects",        label: "Projects",                  points: 20 },
  { key: "technicalSkills", label: "Technical Skills",          points: 15 },
  { key: "certifications",  label: "Certifications",            points: 15 },
  { key: "education",       label: "Education",                 points: 10 },
  { key: "summary",         label: "Bio / Professional Summary",points: 10 },
  { key: "achievements",    label: "Achievements / Awards",     points:  5 },
];

const INTERNSHIP_SECTION_WEIGHTS = [
  { key: "projects",        label: "Projects",                  points: 30 },
  { key: "technicalSkills", label: "Technical Skills",          points: 20 },
  { key: "certifications",  label: "Certifications",            points: 20 },
  { key: "education",       label: "Education",                 points: 10 },
  { key: "summary",         label: "Bio / Professional Summary",points: 10 },
  { key: "achievements",    label: "Achievements / Awards",     points: 10 },
];

function getSectionWeights(jobType) {
  return jobType === "internship" ? INTERNSHIP_SECTION_WEIGHTS : JOB_SECTION_WEIGHTS;
}

// ── Mobile hook ───────────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ── DB API helpers ─────────────────────────────────────────────────────────────
async function fetchRemaining() {
  try {
    const res = await fetch("/api/resume/usage");
    if (!res.ok) return DAILY_LIMIT;
    const data = await res.json();
    return data.remaining ?? DAILY_LIMIT;
  } catch {
    return DAILY_LIMIT;
  }
}

async function incrementUsageAPI() {
  const res = await fetch("/api/resume/usage", { method: "POST" });
  if (!res.ok) throw new Error("Daily limit reached");
  const data = await res.json();
  return data.remaining ?? 0;
}

async function fetchHistory() {
  try {
    const res = await fetch("/api/resume/history");
    if (!res.ok) return [];
    const data = await res.json();
    return (data.analyses || []).map((a) => ({
      id: a.id,
      formattedTime: new Date(a.createdAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      resumeVersion: a.resumeVersion,
      matchScore: a.matchScore,
      verdict: a.verdict,
    }));
  } catch {
    return [];
  }
}

async function saveToHistoryAPI(payload) {
  await fetch("/api/resume/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// ── Score Ring ─────────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 100 }) {
  const r = 38, circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  const color =
    score >= 75 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <text x="50" y="46" textAnchor="middle" fill={color}
        style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-display, sans-serif)" }}>
        {score}%
      </text>
      <text x="50" y="60" textAnchor="middle" fill="var(--text-muted)"
        style={{ fontSize: 8, letterSpacing: 0.5, fontFamily: "sans-serif" }}>
        MATCH
      </text>
    </svg>
  );
}

function qualityScore(pct) {
  return Math.min(1, Math.max(0, pct / 100));
}

// ── Section Breakdown ──────────────────────────────────────────────────────────
function SectionBreakdown({ sections, jobType }) {
  const weights = getSectionWeights(jobType);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {weights.map(({ key, label, points }) => {
        const s = sections?.[key];
        if (!s) return null;
        const present = s.present;
        const qualityPct = s.qualityScore ?? (present ? 80 : 0);
        const earned = present ? Math.round(points * qualityScore(qualityPct)) : 0;
        const barColor = present
          ? qualityPct >= 70 ? "var(--green)" : qualityPct >= 40 ? "var(--yellow)" : "var(--red)"
          : "var(--red)";
        return (
          <div key={key} className={`rm-section-row${present ? "" : " rm-section-row-missing"}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge" style={{
                  background: present ? "var(--bg-hover)" : "var(--red-dim)",
                  color: present ? "var(--text-muted)" : "var(--red)",
                  border: `1px solid ${present ? "var(--border)" : "rgba(227,73,53,0.3)"}`,
                  fontSize: 10, fontWeight: 700,
                }}>
                  {present ? `${earned}/${points}` : `0/${points}`}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{label}</span>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.5px", color: present ? barColor : "var(--red)",
              }}>
                {present ? s.quality || "present" : "missing"}
              </span>
            </div>
            <div style={{ height: 3, background: "var(--border)", borderRadius: 2 }}>
              <div style={{
                height: "100%", width: `${present ? qualityPct : 0}%`,
                background: barColor, borderRadius: 2,
                transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
              }} />
            </div>
            {s.note && (
              <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.55 }}>
                {s.note}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────────
function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 16px" }}>
      <div style={{ height: 1, flex: 1, background: "var(--border)" }} />
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: "1.2px",
        textTransform: "uppercase", color: "var(--text-muted)",
      }}>{label}</span>
      <div style={{ height: 1, flex: 1, background: "var(--border)" }} />
    </div>
  );
}

// ── Keyword Tag ────────────────────────────────────────────────────────────────
function Tag({ text, variant }) {
  return (
    <span className={variant === "miss" ? "rm-keyword-miss" : "rm-keyword-hit"}>
      {text}
    </span>
  );
}

// ── History Modal ──────────────────────────────────────────────────────────────
function HistoryModal({ isOpen, onClose, history, historyLoading }) {
  if (!isOpen) return null;
  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
        style={{ alignItems: "center", justifyContent: "center" }}
      />
      <div
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)", zIndex: 1000,
          width: "90%", maxWidth: 600, maxHeight: "85vh", overflowY: "auto",
        }}
        className="rm-history-modal-bg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="rm-history-header" style={{ position: "sticky", top: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                Analysis History
              </h3>
              <p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--text-muted)" }}>
                {historyLoading ? "Loading…" : `${history.length} saved (last 50)`}
              </p>
            </div>
            <button onClick={onClose} className="modal-close">✕</button>
          </div>
        </div>

        {/* Body */}
        {historyLoading ? (
          <div className="empty-state">
            <p style={{ color: "var(--text-muted)" }}>Loading history…</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <p>No analyses yet.</p>
          </div>
        ) : (
          <div style={{ padding: "14px 18px" }}>
            {history.map((entry) => (
              <div key={entry.id} className="rm-history-entry">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
                      {entry.resumeVersion && (
                        <span className="badge badge-applied">{entry.resumeVersion}</span>
                      )}
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {entry.formattedTime}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, fontStyle: "italic" }}>
                      "{entry.verdict}"
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{
                      fontSize: 20, fontWeight: 800,
                      color: entry.matchScore >= 75 ? "var(--green)" : entry.matchScore >= 50 ? "var(--yellow)" : "var(--red)",
                    }}>
                      {entry.matchScore}%
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>match</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ResumeMatcher() {
  const isMobile = useIsMobile();

  // Form state
  const [resume, setResume]               = useState("");
  const [jobDesc, setJobDesc]             = useState("");
  const [role, setRole]                   = useState("");
  const [jobType, setJobType]             = useState("job");
  const [resumeVersion, setResumeVersion] = useState("");
  const [experience, setExperience]       = useState("");

  // UI state
  const [result, setResult]                 = useState(null);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [remaining, setRemaining]           = useState(DAILY_LIMIT);
  const [usageLoading, setUsageLoading]     = useState(true);
  const [history, setHistory]               = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory]       = useState(false);

  // Load usage from DB on mount
  useEffect(() => {
    setUsageLoading(true);
    fetchRemaining()
      .then(setRemaining)
      .finally(() => setUsageLoading(false));
  }, []);

  // Fetch history lazily when modal opens
  const handleOpenHistory = useCallback(async () => {
    setShowHistory(true);
    setHistoryLoading(true);
    try {
      const data = await fetchHistory();
      setHistory(data);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const isLimitReached   = !usageLoading && remaining <= 0;
  const expYears         = experience === "" ? null : parseInt(experience);
  const isFresherOrUnset = expYears === null || expYears === 0;
  const currentWeights   = getSectionWeights(jobType);
  const isInternship     = jobType === "internship";

  const handleExperienceChange = (e) => {
    const val = e.target.value;
    if (val === "" || (/^\d+$/.test(val) && parseInt(val) <= 50)) {
      setExperience(val);
      if (val !== "" && parseInt(val) > 0) setJobType("job");
    }
  };

  const analyze = async () => {
    if (!resume.trim() || !jobDesc.trim() || !role.trim()) {
      setError("Resume, job description, and role are required.");
      return;
    }
    if (experience === "") {
      setError("Years of experience required. Enter 0 if fresher.");
      return;
    }
    if (isLimitReached) {
      setError("Daily limit reached. Resets at midnight IST.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    const positionType = isInternship ? "Internship" : "Full-Time Job";
    const expContext   = expYears === 0
      ? "0 years (Fresher — no work experience)"
      : `${expYears} year${expYears === 1 ? "" : "s"} of professional experience`;

    const sectionWeightsDesc = currentWeights
      .map((s) => `  - ${s.label}: ${s.points} points`)
      .join("\n");

    const allSectionKeys = [
      "experience", "projects", "technicalSkills", "certifications",
      "education", "summary", "achievements",
    ];
    const sectionScoresTemplate = allSectionKeys
      .map(
        (key) =>
          `    "${key}": { "present": <bool>, "qualityScore": <0-100 or null if not scored>, "quality": "strong|weak|missing", "note": "<brief specific note about this section vs JD>" }`
      )
      .join(",\n");

    const internshipNote = isInternship
      ? `\n\nIMPORTANT — This is an INTERNSHIP role. Do NOT penalize for missing work experience. Score only the sections listed above.`
      : "";

    const prompt = `You are a senior technical recruiter and ATS specialist. Give a surgical, honest analysis.

Position Type: ${positionType}
Target Role: ${role}
Candidate Experience: ${expContext}${internshipNote}

Resume:
${resume}

Job Description:
${jobDesc}

## SCORING SYSTEM — 100 points total

Section weights:
${sectionWeightsDesc}

TOTAL MATCH SCORE = sum of (weight × quality%) for each present section. Cap at 100. Be realistic.

Return ONLY a valid JSON object — no markdown, no explanation:

{
  "matchScore": <integer 0-100>,
  "verdict": "<one direct sentence: hiring recommendation>",
  "sectionScores": {
${sectionScoresTemplate}
  },
  "missingSections": ["<section name if not found AND in scoring weights>"],
  "criticalGaps": ["<gap 1>","<gap 2>","<gap 3>"],
  "missingKeywords": ["<exact keyword from JD not in resume>"],
  "matchedKeywords": ["<exact keyword present in both>"],
  "atsRisk": "<one sentence: ATS pass likelihood and why>",
  "oneThingToFix": "<the single most impactful change before applying>"
}`;

    try {
      // 1. Call Groq
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.1,
          max_tokens: 1600,
          messages: [
            { role: "system", content: "You are a blunt expert technical recruiter. Return ONLY valid JSON." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!groqRes.ok) {
        const errData = await groqRes.json();
        throw new Error(errData?.error?.message || "Groq API error");
      }

      const groqData = await groqRes.json();
      const text     = groqData.choices?.[0]?.message?.content || "";
      const clean    = text.replace(/```json|```/g, "").trim();
      const parsed   = JSON.parse(clean);

      // 2. Save trimmed record to DB
      await saveToHistoryAPI({
        resumeVersion: resumeVersion || null,
        matchScore: parsed.matchScore,
        verdict: parsed.verdict,
      });

      // 3. Increment daily usage in DB
      const newRemaining = await incrementUsageAPI();
      setRemaining(newRemaining);

      setResult({ ...parsed, _jobType: jobType });
    } catch (err) {
      if (err.message === "Daily limit reached") {
        setError("Daily limit reached. Resets at midnight IST.");
        setRemaining(0);
      } else {
        setError(err.message || "Analysis failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResume("");
    setJobDesc("");
    setRole("");
    setResumeVersion("");
    setExperience("");
    setJobType("job");
    setResult(null);
    setError("");
  };

  const expLabel =
    expYears === null ? "" : expYears === 0 ? "Fresher" : `${expYears}yr${expYears === 1 ? "" : "s"}`;

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div className="topbar">
        <div>
          <h2 className="page-title">Resume Matcher</h2>
          <p className="page-subtitle">Section-weighted scoring against job description</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            {usageLoading ? (
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Loading…</div>
            ) : (
              <>
                <div style={{
                  fontSize: 18, fontWeight: 800,
                  color: isLimitReached ? "var(--red)" : remaining === 1 ? "var(--yellow)" : "var(--green)",
                }}>
                  {remaining}/{DAILY_LIMIT}
                </div>
                <div className="stat-label" style={{ textAlign: "right" }}>left today</div>
              </>
            )}
          </div>
          <button className="btn-ghost" onClick={handleOpenHistory}>
            📊 History
          </button>
        </div>
      </div>

      {/* Weights panel */}
      <div
        className={`rm-weights-panel${isInternship ? " rm-weights-panel-intern" : ""}`}
        style={{ borderColor: isInternship ? "var(--accent-border)" : "var(--border)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div className="rm-section-label" style={{ color: isInternship ? "var(--accent)" : "var(--text-muted)", margin: 0 }}>
            Scoring breakdown — {isInternship ? "Internship" : "Full-Time Job"} (100 pts total)
          </div>
          {isInternship && (
            <span className="badge badge-applied">Experience not scored</span>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {currentWeights.map(({ label, points }) => (
            <span key={label} className="toggle-btn" style={{ cursor: "default", fontSize: 11 }}>
              {label} <strong style={{ color: isInternship ? "var(--accent)" : "var(--text-primary)" }}>{points}pt</strong>
            </span>
          ))}
        </div>
        {isInternship && (
          <p style={{ margin: "10px 0 0", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
            ℹ️ Internship scoring emphasises Projects (30), Skills (20) and Certifications (20) — work experience carries no weight.
          </p>
        )}
      </div>

      {/* Banners */}
      {isLimitReached && (
        <div className="rm-warn-banner">Daily limit reached — resets at midnight IST.</div>
      )}
      {!usageLoading && remaining === 1 && !isLimitReached && (
        <div className="rm-caution-banner">Last analysis for today — use it wisely.</div>
      )}

      {/* Input grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: 16,
        marginBottom: 14,
      }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Target Role</label>
            <input
              type="text"
              value={role}
              disabled={isLimitReached}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. ML Engineer, Frontend Dev"
              className="form-input"
              style={{ opacity: isLimitReached ? 0.4 : 1 }}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Years of Experience <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                inputMode="numeric"
                value={experience}
                disabled={isLimitReached}
                onChange={handleExperienceChange}
                placeholder="0 for fresher"
                className="form-input"
                style={{
                  paddingRight: expLabel ? "80px" : "11px",
                  opacity: isLimitReached ? 0.4 : 1,
                  borderColor:
                    experience === "" ? "var(--border)"
                    : expYears === 0 ? "var(--red)" : "var(--green)",
                }}
              />
              {expLabel && (
                <span style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  fontSize: 10, fontWeight: 700, pointerEvents: "none",
                  color: expYears === 0 ? "var(--red)" : "var(--green)",
                }}>
                  {expLabel}
                </span>
              )}
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Resume Version (optional)</label>
            <input
              type="text"
              value={resumeVersion}
              disabled={isLimitReached}
              onChange={(e) => setResumeVersion(e.target.value)}
              placeholder="e.g. v1.2, ML-focused"
              className="form-input"
              style={{ opacity: isLimitReached ? 0.4 : 1 }}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Position Type</label>
            <div
              className="rm-toggle-type"
              style={{ display: "grid", gridTemplateColumns: isFresherOrUnset ? "1fr 1fr" : "1fr" }}
            >
              {[
                { value: "job",        label: "Full-Time Job" },
                { value: "internship", label: "Internship"    },
              ]
                .filter(({ value }) => value === "job" || isFresherOrUnset)
                .map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setJobType(value)}
                    disabled={isLimitReached}
                    className={`rm-type-btn ${jobType === value ? (value === "internship" ? "active-intern" : "active-job") : ""}`}
                    style={{ opacity: isLimitReached ? 0.4 : 1 }}
                  >
                    {label}
                  </button>
                ))}
            </div>
            {!isFresherOrUnset && (
              <p style={{ margin: "5px 0 0", fontSize: 10, color: "var(--text-muted)" }}>
                Internship only available for freshers.
              </p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Resume",          value: resume,  setter: setResume,  placeholder: "Paste your resume text here…"    },
            { label: "Job Description", value: jobDesc, setter: setJobDesc, placeholder: "Paste the job description here…" },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <label className="form-label" style={{ margin: 0 }}>{label}</label>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                  {value.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={value}
                disabled={isLimitReached}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="rm-textarea"
                style={{ minHeight: isMobile ? 120 : 148, opacity: isLimitReached ? 0.4 : 1 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && <div className="rm-warn-banner">{error}</div>}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginBottom: 32, alignItems: "center" }}>
        <button
          onClick={analyze}
          disabled={loading || isLimitReached || usageLoading}
          className="btn-primary"
          style={{
            opacity: loading || isLimitReached || usageLoading ? 0.5 : 1,
            cursor: isLimitReached ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
              Analyzing…
            </span>
          ) : "Analyze Resume"}
        </button>
        {(resume || jobDesc || role || result) && (
          <button onClick={handleClear} className="btn-ghost">Clear</button>
        )}
      </div>

      {/* Results */}
      {result && (
        <div>
          {/* Score + Verdict */}
          <div
            className="rm-score-section"
            style={{
              display: "flex", gap: isMobile ? 16 : 24,
              alignItems: "center", flexDirection: isMobile ? "column" : "row",
            }}
          >
            <ScoreRing score={result.matchScore} size={isMobile ? 90 : 100} />
            <div style={{ flex: 1 }}>
              <div className="rm-section-label">Verdict</div>
              <p className="rm-verdict-text">{result.verdict}</p>
              <div style={{ display: "flex", gap: 7, marginTop: 8, flexWrap: "wrap" }}>
                {role && (
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>{role}</span>
                )}
                <span className={`badge ${result._jobType === "internship" ? "badge-applied" : "badge-offer"}`}>
                  {result._jobType === "internship" ? "Internship" : "Job"}
                </span>
                {expYears !== null && (
                  <span className={`badge ${expYears === 0 ? "badge-rejected" : "badge-offer"}`}>
                    {expYears === 0 ? "Fresher" : `${expYears}yr exp`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ATS Risk */}
          {result.atsRisk && (
            <div className="rm-ats-strip">
              <span className="rm-ats-label">ATS Risk</span>
              <span className="rm-ats-value">{result.atsRisk}</span>
            </div>
          )}

          {/* Section Breakdown */}
          <Divider label="Section Scores" />
          {result.sectionScores && (
            <SectionBreakdown sections={result.sectionScores} jobType={result._jobType} />
          )}

          {/* Missing Sections */}
          {result.missingSections?.length > 0 && (
            <div className="rm-missing-banner">
              <div className="rm-section-label" style={{ color: "var(--red)", marginBottom: 8 }}>
                Scored sections not found in resume
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {result.missingSections.map((s, i) => (
                  <span key={i} className="badge badge-rejected">✕ {s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Critical Gaps */}
          {result.criticalGaps?.length > 0 && (
            <>
              <Divider label="Critical Gaps" />
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {result.criticalGaps.map((gap, i) => (
                  <div key={i} className="rm-gap-row">
                    <span style={{ fontSize: 10, fontWeight: 800, color: "var(--red)", flexShrink: 0, marginTop: 1 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.65 }}>{gap}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Keywords */}
          <Divider label="Keyword Coverage" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div className="rm-section-label">Missing</div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {(result.missingKeywords || []).map((kw, i) => (
                  <Tag key={i} text={kw} variant="miss" />
                ))}
              </div>
            </div>
            <div>
              <div className="rm-section-label">Matched</div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {(result.matchedKeywords || []).map((kw, i) => (
                  <Tag key={i} text={kw} variant="hit" />
                ))}
              </div>
            </div>
          </div>

          {/* One Thing to Fix */}
          {result.oneThingToFix && (
            <>
              <Divider label="Top Priority Fix" />
              <div className="rm-fix-box">
                <div className="rm-fix-label">Do this before applying</div>
                <p className="rm-fix-text">{result.oneThingToFix}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        historyLoading={historyLoading}
      />
    </div>
  );
}