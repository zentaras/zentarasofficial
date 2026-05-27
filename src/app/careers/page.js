"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";

const PROJECTS = [
  {
    id: "data-analyst-intern",
    tag: "Data Analytics",
    tagColor: "green",
    icon: "📊",
    title: "Data Analyst Intern",
    subtitle: "Dig into real datasets, surface insights, and build dashboards that actually get used.",
    description: "You'll work directly with raw business data — cleaning, transforming, and analysing it using Python and SQL. Deliverables include an analytical report, a set of reusable SQL queries, and a Plotly/Power BI dashboard. This is hands-on data work: no toy datasets, no guided tutorials. You'll own the problem end-to-end.",
    duration: "6 Weeks", mode: "Remote", type: "Unpaid · Experience-based",
    stack: ["Python", "Pandas", "SQL", "Plotly", "Power BI"],
    requirements: [
      "Comfortable with Python pandas — filtering, groupby, merges",
      "SQL fundamentals: JOINs, window functions, aggregations",
      "Basic stats: distributions, correlation, outlier detection",
      "Any visualisation experience (matplotlib, seaborn, Tableau, etc.)",
      "Git basics for version control",
    ],
    deliverables: [
      "Cleaned, analysis-ready dataset with documented steps",
      "SQL query library (10+ queries covering key business questions)",
      "Interactive Plotly or Power BI dashboard",
      "Written insight report with findings and recommendations",
    ],
    openings: 2, deadline: "June 10, 2026",
    product: "DataPulse", productDesc: "Our internal business intelligence layer",
  },
  {
    id: "web-dev-intern",
    tag: "Web Development",
    tagColor: "accent",
    icon: "🌐",
    title: "Web Developer Intern",
    subtitle: "Ship a real feature on a live production website — from design to deployment.",
    description: "You'll be integrated into the dev workflow of an active product and assigned a specific feature to build end-to-end. This involves reading existing code, implementing UI and backend logic, writing clean commits, and getting your code reviewed and merged. The feature will be scoped before you start so you hit the ground running on day one.",
    duration: "6 Weeks", mode: "Remote", type: "Unpaid · Experience-based",
    stack: ["Next.js", "React", "Tailwind CSS", "PostgreSQL", "Prisma"],
    requirements: [
      "Solid React fundamentals — components, hooks, state management",
      "Familiarity with Next.js App Router and server components",
      "Basic CSS / Tailwind for layout and responsive design",
      "Comfortable reading existing codebases and following conventions",
      "Git workflow: branches, PRs, commit messages",
    ],
    deliverables: [
      "Feature branch with clean, reviewed commits",
      "Merged PR with working feature on production",
      "Brief technical write-up on implementation decisions",
      "Any tests or documentation relevant to the feature",
    ],
    openings: 1, deadline: "June 10, 2026",
    product: "Zentaras", productDesc: "Our live job-tracking and productivity web app",
  },
];

const tagStyles = {
  accent: { bg: "var(--accent-dim)",  border: "var(--accent-border)", color: "var(--accent)"  },
  green:  { bg: "var(--green-dim)",   border: "rgba(34,160,107,0.3)", color: "var(--green)"   },
  yellow: { bg: "var(--yellow-dim)",  border: "rgba(226,178,3,0.3)",  color: "var(--yellow)"  },
};

function statusChip(status) {
  if (status === "Shortlisted") return { label: "✓ Shortlisted", bg: "var(--green-dim)",  color: "var(--green)", border: "rgba(34,160,107,0.3)"  };
  if (status === "Rejected")    return { label: "✕ Rejected",    bg: "var(--red-dim)",    color: "var(--red)",   border: "rgba(227,73,53,0.25)"  };
  return                               { label: "⏳ Under Review", bg: "var(--blue-dim)",  color: "var(--blue)",  border: "rgba(87,157,255,0.25)" };
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
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "12px",
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-light)",
        borderRadius: 14, width: "100%", maxWidth: 620,
        maxHeight: "93vh", overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)", boxSizing: "border-box",
      }} onClick={e => e.stopPropagation()}>

        {success ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "var(--green-dim)", border: "1px solid rgba(34,160,107,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, margin: "0 auto 20px", color: "var(--green)",
            }}>✓</div>
            <h2 style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 10 }}>
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
            <div style={{
              padding: "16px 16px 14px", borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0,
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0, flex: 1 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>{project.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: tagStyle.color, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 3 }}>
                    {project.tag} · {project.product}
                  </p>
                  <h2 style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 800, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {project.title}
                  </h2>
                </div>
              </div>
              <button onClick={onClose} style={{
                background: "var(--bg-hover)", border: "1px solid var(--border)",
                borderRadius: 6, width: 28, height: 28, cursor: "pointer",
                color: "var(--text-muted)", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                marginLeft: 8,
              }}>✕</button>
            </div>

            <div style={{ padding: "16px 16px 20px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                {[project.duration, project.mode, project.type, `Deadline: ${project.deadline}`].map(c => (
                  <span key={c} style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 4,
                    background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)",
                  }}>{c}</span>
                ))}
              </div>

              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 18 }}>
                {project.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px 20px", marginBottom: 18 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingBottom: 5, borderBottom: "1px solid var(--border)" }}>
                    What We Need
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {project.deliverables.map(d => (
                      <li key={d} style={{ fontSize: 12, color: "var(--text-secondary)", padding: "5px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 6, lineHeight: 1.5 }}>
                        <span style={{ color: "var(--green)", flexShrink: 0 }}>✓</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Stack</p>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {project.stack.map(s => (
                    <span key={s} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 4, background: tagStyle.bg, border: `1px solid ${tagStyle.border}`, color: tagStyle.color, fontWeight: 700 }}>{s}</span>
                  ))}
                </div>
              </div>

              <div style={{
                background: "var(--yellow-dim)", border: "1px solid rgba(226,178,3,0.3)",
                borderRadius: 8, padding: "10px 14px", fontSize: 12,
                color: "var(--yellow)", marginBottom: 18,
              }}>
                Unpaid · Experience-based internship. You'll receive a Letter of Recommendation + portfolio-ready work on completion.
              </div>

              <button onClick={() => setStep(2)} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "11px 0" }}>
                Continue to Application →
              </button>
            </div>
          </>

        ) : (
          <>
            <div style={{
              padding: "14px 16px", borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                <button onClick={() => setStep(1)} style={{
                  background: "var(--bg-hover)", border: "1px solid var(--border)",
                  borderRadius: 6, width: 28, height: 28, cursor: "pointer",
                  color: "var(--text-muted)", fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>←</button>
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ fontFamily: "sans-serif", fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Your Application</h2>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>Step 2 of 2 · {project.title}</p>
                </div>
              </div>
              <button onClick={onClose} style={{
                background: "var(--bg-hover)", border: "1px solid var(--border)",
                borderRadius: 6, width: 28, height: 28, cursor: "pointer",
                color: "var(--text-muted)", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                marginLeft: 8,
              }}>✕</button>
            </div>

            <div style={{ padding: "16px 16px 20px", overflowY: "auto", flex: 1 }}>
              {error && (
                <div style={{
                  background: "var(--red-dim)", border: "1px solid rgba(227,73,53,0.25)",
                  borderRadius: 8, padding: "10px 14px", fontSize: 13,
                  color: "var(--red)", marginBottom: 16,
                }}>{error}</div>
              )}

              <MSectionLabel>Personal Details</MSectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                <MField label="Full Name *"     name="fullName" type="text"  onChange={handleChange} />
                <MField label="Email Address *" name="email"    type="email" onChange={handleChange} />
              </div>

              <MSectionLabel>Academic Background</MSectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                <MField label="College / University *" name="college"        type="text" onChange={handleChange} />
                <MField label="Branch / Department *"  name="branch"         type="text" onChange={handleChange} />
                <MField label="Graduation Year *"      name="graduationYear" type="text" onChange={handleChange} />
                <MField label="CGPA / % (optional)"    name="cgpa"           type="text" onChange={handleChange} />
              </div>

              <MSectionLabel>Profiles &amp; Resume</MSectionLabel>
              <MField label="GitHub *" name="githubUrl" type="url" placeholder="https://github.com/..." onChange={handleChange} />
              <MField label="Resume Link (Drive / Notion) *" name="resumeLink" type="url" placeholder="https://drive.google.com/..." onChange={handleChange} />

              <button onClick={handleSubmit} disabled={loading} className="btn-primary"
                style={{ width: "100%", marginTop: 20, justifyContent: "center", padding: "11px 0", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
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

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, onApply, appStatus }) {
  const tagStyle = tagStyles[project.tagColor];
  const { isSignedIn } = useUser();
  const applied    = !!appStatus;
  const canReapply = appStatus?.status === "Rejected";
  const chip       = appStatus ? statusChip(appStatus.status) : null;

  return (
    <div className="card" style={{
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
      boxSizing: "border-box", minWidth: 0, width: "100%",
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
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${tagStyle.color}, transparent)`,
        borderRadius: "var(--radius) var(--radius) 0 0",
      }} />

      <div style={{
        position: "absolute", top: 14, right: 14,
        background: "var(--bg-hover)", border: "1px solid var(--border)",
        borderRadius: 4, padding: "2px 8px",
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
          {project.product}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12, paddingRight: 72 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>{project.icon}</div>
        <div style={{ minWidth: 0 }}>
          <span style={{
            display: "inline-block", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.7px", textTransform: "uppercase",
            padding: "2px 7px", borderRadius: 3,
            background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
            color: tagStyle.color, marginBottom: 5,
          }}>{project.tag}</span>
          <h3 style={{
            fontFamily: "sans-serif", fontSize: 15, fontWeight: 700,
            color: "var(--text-primary)", lineHeight: 1.25, wordBreak: "break-word",
          }}>{project.title}</h3>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 14 }}>
        {project.subtitle}
      </p>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
        {[project.duration, project.mode, `Due ${project.deadline}`].map(c => (
          <span key={c} style={{
            fontSize: 10, padding: "2px 8px", borderRadius: 4,
            background: "var(--bg-hover)", border: "1px solid var(--border)",
            color: "var(--text-muted)", fontWeight: 500,
          }}>{c}</span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
        {project.stack.map(s => (
          <span key={s} style={{
            fontSize: 10, padding: "2px 7px", borderRadius: 4,
            background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
            color: tagStyle.color, fontWeight: 700,
          }}>{s}</span>
        ))}
      </div>

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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: canReapply ? 10 : 0, flexWrap: "wrap", gap: 6 }}>
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

// ── Careers Page ──────────────────────────────────────────────────────────────
export default function CareersPage() {
  const [activeProject, setActiveProject] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [myApps, setMyApps]   = useState({});
  const { isSignedIn }        = useUser();

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

        {/* ── Hero ── */}
        <section style={{
          position: "relative",
          padding: "96px 16px 80px",
          textAlign: "center", overflow: "hidden",
         }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
            opacity: 0.4,
          }} />
          <div style={{
            position: "absolute", width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)",
            top: -180, left: "50%", transform: "translateX(-50%)", pointerEvents: "none",
          }} />
          <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
            {/* Careers label */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "5px 14px", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: 20 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 1 }}>Openings</span>
            </div>
            
              
           
          </div>
        </section>

        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px 64px" }}>

          {/* ── Open Roles ── */}
          <SectionHeading color="var(--green)" label="Open Intern Projects" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 72 }}>
            {PROJECTS.map(p => (
              <ProjectCard key={p.id} project={p} onApply={setActiveProject} appStatus={myApps[p.id] ?? null} />
            ))}
          </div>

         

          {/* ── FAQ ── */}
          <SectionHeading color="var(--border-light)" label="FAQ" />
          <div style={{ marginBottom: 64 }}>
            {[
              { q: "Is there a stipend?",                   a: "No. These are fully unpaid internships. You'll receive a Letter of Recommendation, portfolio-ready deliverables, and real product experience to show employers." },
              { q: "Can I apply to both projects?",         a: "Yes — apply individually to each one. We recommend choosing the one that best matches your current skills." },
              { q: "I'm a fresher — should I still apply?", a: "Absolutely. We look for curiosity and foundational knowledge, not years of experience." },
              { q: "Is this just a certificate programme?", a: "No. You contribute to actual product code and real data. Quality and delivery matter — this is not participation-trophy work." },
              { q: "What tech stack do I need?",            a: "Each project lists its stack. Data Analyst: Python + SQL. Web Dev: React + Next.js. GitHub is mandatory for both." },
            ].map(faq => (
              <div key={faq.q} className="card" style={{ marginBottom: 6, boxSizing: "border-box" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{faq.q}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>

        </section>

        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px" }}>
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
