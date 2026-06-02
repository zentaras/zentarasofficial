"use client"

export default function InternshipPage() {
  return (
    <main className="internship-page">

      {/* ── HERO ── */}
      <section className="ip-hero">
        <div className="ip-hero-tag">Program Document</div>
        <h1 className="ip-hero-title">
          Zentaras Remote<br /><span>Internship Program</span>
        </h1>
        <p className="ip-hero-desc">
          Work on real production systems. Interns contribute directly to live platforms, analyzing
          actual datasets or building features on zentaras.in with structured mentorship and a
          verifiable certificate on completion.
        </p>
        <div className="ip-hero-chips">
          {META_CHIPS.map((c) => (
            <div key={c.label} className="ip-chip">
              <span>{c.icon}</span> {c.label}
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION LABEL ── */}
      <div className="ip-section-label">Available Tracks</div>

      {/* ── DOMAIN OVERVIEW CARDS ── */}
      <div className="ip-grid2">
        {DOMAINS.map((d) => (
          <div key={d.name} className="ip-card">
            <div className="ip-card-title">{d.trackLabel}</div>
            <div className="ip-domain-header">
              <span className="ip-domain-name">{d.icon} {d.name}</span>
              <span className={`ip-domain-badge ip-badge-${d.color}`}>{d.badgeText}</span>
            </div>
            <p className="ip-domain-desc">{d.desc}</p>
            <div className="ip-skill-tags">
              {d.skills.map((s) => (
                <span key={s} className="ip-skill-tag">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── DA REAL WORK ── */}
      <div className="ip-section-label">Data Analyst — Real Work Breakdown</div>
      <div className="ip-card">
        <div className="ip-card-title">What You&apos;ll Actually Work On</div>
        {DA_PHASES.map((p) => (
          <div key={p.title} className="ip-project-block">
            <div className="ip-pb-header">
              <span className="ip-pb-title">{p.title}</span>
              <span className="ip-pb-phase ip-phase-da">{p.week}</span>
            </div>
            <p className="ip-pb-desc">{p.desc}</p>
            <div className="ip-pb-deliverable">
              <span className="ip-del-icon">📦</span>
              <span><strong>Deliverable:</strong> {p.deliverable}</span>
            </div>
            <div className="ip-skill-tags">
              {p.skills.map((s) => (
                <span key={s} className="ip-skill-tag">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── WD REAL WORK ── */}
      <div className="ip-section-label">Web Developer — Real Work Breakdown</div>
      <div className="ip-card">
        <div className="ip-card-title">What You&apos;ll Actually Build on zentaras.in</div>
        {WD_PHASES.map((p) => (
          <div key={p.title} className="ip-project-block">
            <div className="ip-pb-header">
              <span className="ip-pb-title">{p.title}</span>
              <span className="ip-pb-phase ip-phase-wd">{p.week}</span>
            </div>
            <p className="ip-pb-desc">{p.desc}</p>
            <div className="ip-pb-deliverable">
              <span className="ip-del-icon-g">🌐</span>
              <span><strong>Deliverable:</strong> {p.deliverable}</span>
            </div>
            {p.skills && (
              <div className="ip-skill-tags">
                {p.skills.map((s) => (
                  <span key={s} className="ip-skill-tag">{s}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      

      {/* ── TIMELINE + PERKS ── */}
      <div className="ip-section-label">Program Structure</div>
      <div className="ip-grid2">

        {/* Timeline */}
        <div className="ip-card">
          <div className="ip-card-title">Week-by-Week Timeline</div>
          <div className="ip-timeline">
            {WEEKS.map((w, i) => (
              <div key={w.week} className="ip-tl-item">
                <div className="ip-tl-left">
                  <div className="ip-tl-dot">{w.week}</div>
                  {i < WEEKS.length - 1 && <div className="ip-tl-line" />}
                </div>
                <div className="ip-tl-content">
                  <div className="ip-tl-title">{w.title}</div>
                  <div className="ip-tl-desc">{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Perks */}
        <div className="ip-card">
          <div className="ip-card-title">What You Get</div>
          <div className="ip-perks-grid">
            {PERKS.map((p) => (
              <div key={p.title} className="ip-perk-item">
                <div className="ip-perk-icon">{p.icon}</div>
                <div className="ip-perk-title">{p.title}</div>
                <div className="ip-perk-desc">{p.desc}</div>
              </div>
            ))}
          </div>
         
        </div>
      </div>

      {/* ── APPLICATION PROCESS ── */}
      <div className="ip-section-label">Application Process</div>
      <div className="ip-card">
        <div className="ip-card-title">How to Join</div>
        <div className="ip-steps-row">
          {STEPS.map((s, i) => (
            <div key={s} className="ip-step-item">
              <div className="ip-step-num">{i + 1}</div>
              <div className="ip-step-label">{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CERT + CONTACT ── */}
      <div className="ip-section-label">Certificate &amp; Contact</div>
      <div className="ip-card">
        <div className="ip-cert-box">
          <div className="ip-cert-icon">🏆</div>
          <div>
            <div className="ip-cert-title">Internship Completion Certificate</div>
            <p className="ip-cert-desc">
              Awarded upon full task completion, deliverable submission, and positive performance
              evaluation. Certificate includes your name, domain, duration, and is signed by the
              Zentaras founder. Verifiable by any employer via our website.
            </p>
          </div>
        </div>
        <div className="ip-card-title" style={{ marginTop: '20px' }}>Contact &amp; Links</div>
        {CONTACT.map((c) => (
          <div key={c.label} className="ip-contact-row">
            <span className="ip-contact-label">{c.label}</span>
            <span className="ip-contact-val">{c.value}</span>
          </div>
        ))}
      </div>

      <style jsx>{styles}</style>
    </main>
  )
}

/* ── DATA ────────────────────────────────────────────────────────────────── */

const META_CHIPS = [
  { icon: '🌐', label: '100% Remote' },
  { icon: '📅', label: '4–8 Weeks' },
  { icon: '⏱', label: '8–15 hrs / week' },
  { icon: '🎓', label: 'B.Tech · BCA · MCA · B.Sc' },
  { icon: '📋', label: 'Offer Letter Provided' },
  { icon: '🏆', label: 'Certificate on Completion' },
]

const DOMAINS = [
  {
    trackLabel: 'Data Analytics',
    name: 'Data Analyst Intern',
    icon: '📊',
    color: 'da',
    badgeText: 'Real Datasets',
    desc: 'Work on live, unclean business datasets — sales records, user behavior logs, and survey data. Perform full EDA cycles, build dashboards, and derive actionable insights presented to the Zentaras team.',
    skills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Power BI', 'Excel', 'EDA', 'Matplotlib', 'Seaborn', 'Dashboards'],
  },
  {
    trackLabel: 'Web Development',
    name: 'Web Dev Intern',
    icon: '💻',
    color: 'wd',
    badgeText: 'Live Platform',
    desc: 'Build and ship features directly on zentaras.in. You\'ll own a dedicated public profile page at zentaras.in/user/username and contribute UI components, backend APIs, and new platform sections that go live.',
    skills: ['Next.js', 'React', 'Tailwind', 'Prisma', 'PostgreSQL', 'Clerk Auth', 'REST APIs', 'Git', 'Vercel'],
  },
]

const DA_PHASES = [
  {
    title: 'Phase 1 — Data Cleaning & Exploration',
    week: 'Week 1–2',
    desc: 'You\'ll receive raw, messy CSV/Excel datasets from real business contexts (e-commerce orders, internship application logs, or survey responses). Your job: handle nulls, remove duplicates, fix dtypes, and perform a full exploratory analysis. Document every assumption.',
    deliverable: 'Cleaned dataset + Jupyter Notebook with documented EDA — distribution plots, outlier analysis, correlation heatmaps, and a written summary of key findings.',
    skills: ['Python', 'Pandas', 'NumPy', 'Jupyter', 'Matplotlib'],
  },
  {
    title: 'Phase 2 — SQL Querying & Business Questions',
    week: 'Week 2–3',
    desc: 'The cleaned data gets loaded into a PostgreSQL database. You\'ll write queries to answer specific business questions — top-performing regions, drop-off points in a funnel, cohort retention, and revenue trends. Queries must be optimized and well-commented.',
    deliverable: 'SQL script file with 10+ analytical queries + a written Q&A document explaining what each query answers and what action it might drive.',
    skills: ['SQL', 'PostgreSQL', 'Aggregations', 'Window Fns', 'CTEs'],
  },
  {
    title: 'Phase 3 — Dashboard & Insight Presentation',
    week: 'Week 3–4',
    desc: 'Build an interactive dashboard in Power BI (or Streamlit if preferred) that visualizes the full story of the dataset. The dashboard should be self-explanatory — any non-technical person should understand the key takeaways. You\'ll present it live to the Zentaras team.',
    deliverable: 'Published dashboard link (Power BI / Streamlit) + 5-min recorded walkthrough video + a one-page insight report with 3 actionable recommendations.',
    skills: ['Power BI', 'Streamlit', 'Seaborn', 'Storytelling', 'Reporting'],
  },
]

const WD_PHASES = [
  {
    title: '🔖 Your Public Profile — zentaras.in/user/username',
    week: 'Core Feature',
    desc: 'Every intern gets a dedicated, publicly accessible profile page on the live Zentaras platform. You\'ll design and build this page from scratch — it becomes your portfolio proof. The page displays your internship track, progress, submitted deliverables, and a short bio. It\'s live on the internet with your name on it.',
    deliverable: 'A fully live page at zentaras.in/user/username — built with Next.js dynamic routing, Prisma-backed user data, and responsive design. This link goes on your resume.',
    skills: null,
  },
  {
    title: 'Phase 1 — Platform UI Components',
    week: 'Week 1–2',
    desc: 'Contribute reusable UI components to the Zentaras component library — cards, modals, form elements, status badges, and loading states. All components must support dark/light mode via CSS variables, be fully responsive, and follow the existing design system.',
    deliverable: '5–8 merged React components in the codebase with usage docs. Each component reviewed and merged by the maintainer.',
    skills: ['React', 'Next.js', 'CSS Variables', 'Responsive', 'Dark Mode'],
  },
  {
    title: 'Phase 2 — New Platform Section (Assigned)',
    week: 'Week 2–3',
    desc: 'Each intern gets assigned a new section of the Zentaras website to own and ship. Past sections include: a Public Leaderboard for intern points, a Resources & Learning Hub page, an Alumni Showcase grid, and a Blog/Updates section. You\'ll handle the full stack — DB schema, API routes, and frontend.',
    deliverable: 'One fully shipped section live on zentaras.in — Prisma schema + API route + frontend page. Must pass a PR review and be deployed to production.',
    skills: ['Prisma', 'PostgreSQL', 'API Routes', 'Next.js', 'Vercel'],
  },
  {
    title: 'Phase 3 — Feature Polish & Production Readiness',
    week: 'Week 3–4',
    desc: 'Fix real bugs from the Zentaras issue tracker, improve mobile responsiveness across existing pages, add SEO meta tags, and optimize page load performance. This phase teaches you what real production codebases look like vs. tutorial projects.',
    deliverable: '3+ merged PRs resolving open issues + a brief performance report (Lighthouse scores before vs. after) shared with the team.',
    skills: ['SEO', 'Lighthouse', 'Git PRs', 'Bug Fixes', 'Mobile UX'],
  },
]

const WD_FEATURES = [
  { icon: '👤', title: 'Intern Public Profiles', desc: 'Dynamic /user/[username] pages with bio, track, progress, and deliverables. Built with Next.js dynamic routing + Prisma.' },
  { icon: '🏅', title: 'Points Leaderboard', desc: 'Live ranking of all interns by task completion points. Real-time updates with server components and Neon DB.' },
  { icon: '📚', title: 'Resources Hub', desc: 'Curated learning materials page organized by domain — filtered, searchable, and admin-editable.' },
  { icon: '🎓', title: 'Alumni Showcase', desc: 'A grid of past interns with their projects, LinkedIn links, and testimonials. Managed via the admin dashboard.' },
  { icon: '📋', title: 'Application Dashboard', desc: 'Applicant-facing tracker showing application status, assigned mentor, and onboarding checklist post-selection.' },
  { icon: '📝', title: 'Blog & Updates', desc: 'A markdown-powered blog section for program announcements, intern spotlights, and tech articles.' },
]

const WEEKS = [
  { week: 'W1', title: 'Orientation & Setup', desc: 'Offer letter issued, tools configured, codebase/dataset access granted, mentor assigned, first task briefed.' },
  { week: 'W2', title: 'Phase 1 - Execution', desc: 'Core task work begins. Mid-week check-in with mentor. First deliverable due by end of week.' },
  { week: 'W3', title: 'Phase 2 - Deeper Work', desc: 'Advanced tasks unlocked. SQL/API work or dashboard/feature build. Peer review of Phase 1 deliverable.' },
  { week: 'W4', title: 'Phase 3 - Production', desc: 'Final feature/dashboard polish. Bug fixes, responsiveness, performance pass. PR review or dashboard walkthrough.' },
  { week: 'W5', title: 'Final Presentation', desc: 'Live demo or report presentation to Zentaras team. Feedback session. Internship report submission.' },
  { week: 'W6', title: 'Certificate & Closeout', desc: 'Performance evaluation completed. Certificate issued. LinkedIn recommendation for top performers.' },
]

const PERKS = [
  { icon: '📄', title: 'Offer Letter', desc: 'Official letter on Day 1.' },
  { icon: '🏆', title: 'Certificate', desc: 'Verifiable completion certificate.' },
  { icon: '🌐', title: 'Live Profile', desc: 'Public page to showcase your work' },
  { icon: '🤝', title: 'Mentorship', desc: 'Weekly 1:1 reviews.' },
  { icon: '🔗', title: 'LinkedIn Rec', desc: 'Recommendation for top-performing interns' },
]

const STEPS = ['Apply Online', 'Resume Review', 'Selection', 'Onboarding']

const CONTACT = [
  { label: 'Website', value: 'https://www.zentaras.in' },
  { label: 'Email',   value: 'careers@zentaras.in' },
  { label: 'Apply',   value: 'zentaras.in/careers' },
  
]

/* ── STYLES ──────────────────────────────────────────────────────────────── */

const styles = `
  .internship-page {
    max-width: 960px;
    margin: 0 auto;
    padding: 40px 24px 60px;
  }

  /* Hero */
  .ip-hero {
    position: relative;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 48px 44px;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .ip-hero::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--accent-dim), transparent 70%);
    pointer-events: none;
  }
  .ip-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--accent-dim);
    border: 1px solid var(--accent-border);
    border-radius: 4px;
    padding: 4px 12px;
    font-size: 10px;
    font-weight: 700;
    color: var(--blue);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    margin-bottom: 18px;
  }
  .ip-hero-title {
    font-size: 36px;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.8px;
    line-height: 1.15;
    margin-bottom: 14px;
  }
  .ip-hero-title span { color: var(--blue); }
  .ip-hero-desc {
    font-size: 14px;
    color: var(--text-secondary);
    max-width: 560px;
    line-height: 1.75;
    margin-bottom: 24px;
  }
  .ip-hero-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .ip-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 6px 13px;
    font-size: 12px;
    color: var(--text-secondary);
  }

  /* Section label */
  .ip-section-label {
    font-size: 10px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1.4px;
    margin: 28px 0 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ip-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* Grid */
  .ip-grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  /* Card */
  .ip-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px;
    margin-bottom: 0;
    transition: border-color 0.2s;
  }
  .ip-card:hover { border-color: var(--border-light); }
  .ip-card-title {
    font-size: 10px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ip-card-title::before {
    content: '';
    width: 3px; height: 12px;
    background: var(--accent);
    border-radius: 2px;
    display: block;
    flex-shrink: 0;
  }

  /* Domain */
  .ip-domain-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .ip-domain-name {
    font-size: 17px;
    font-weight: 800;
    color: var(--text-primary);
  }
  .ip-domain-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
  }
  .ip-badge-da {
    background: var(--blue-dim);
    color: var(--blue);
    border: 1px solid var(--accent-border);
  }
  .ip-badge-wd {
    background: var(--green-dim);
    color: var(--green);
    border: 1px solid var(--green-border);
  }
  .ip-domain-desc {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.65;
    margin-bottom: 12px;
  }
  .ip-skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .ip-skill-tag {
    padding: 3px 9px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    background: var(--bg-hover);
    color: var(--text-muted);
    border: 1px solid var(--border);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  /* Project blocks */
  .ip-project-block {
    background: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 16px;
    margin-bottom: 10px;
  }
  .ip-project-block:last-child { margin-bottom: 0; }
  .ip-pb-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
  }
  .ip-pb-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-primary);
  }
  .ip-pb-phase {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 2px 8px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .ip-phase-da {
    background: var(--blue-dim);
    color: var(--blue);
    border: 1px solid var(--accent-border);
  }
  .ip-phase-wd {
    background: var(--green-dim);
    color: var(--green);
    border: 1px solid var(--green-border);
  }
  .ip-pb-desc {
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.65;
    margin-bottom: 8px;
  }
  .ip-pb-deliverable {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    padding: 8px 10px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 5px;
    font-size: 11px;
    color: var(--text-secondary);
    line-height: 1.55;
    margin-bottom: 8px;
  }
  .ip-del-icon { color: var(--blue); flex-shrink: 0; margin-top: 1px; }
  .ip-del-icon-g { color: var(--green); flex-shrink: 0; margin-top: 1px; }

  /* WD features */
  .ip-feature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 4px;
  }
  .ip-feature-item {
    background: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: 7px;
    padding: 12px 14px;
  }
  .ip-fi-icon { font-size: 18px; margin-bottom: 6px; }
  .ip-fi-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
  }
  .ip-fi-desc { font-size: 11px; color: var(--text-muted); line-height: 1.55; }

  /* Timeline */
  .ip-timeline { display: flex; flex-direction: column; }
  .ip-tl-item {
    display: flex;
    gap: 14px;
    align-items: stretch;
    padding-bottom: 18px;
  }
  .ip-tl-item:last-child { padding-bottom: 0; }
  .ip-tl-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 32px;
  }
  .ip-tl-dot {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: var(--accent-dim);
    border: 1px solid var(--accent-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 800;
    color: var(--blue);
    flex-shrink: 0;
  }
  .ip-tl-line {
    width: 1px;
    flex: 1;
    background: var(--border);
    margin-top: 4px;
  }
  .ip-tl-content { padding-top: 5px; }
  .ip-tl-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 3px;
  }
  .ip-tl-desc { font-size: 11px; color: var(--text-muted); line-height: 1.55; }

  /* Perks */
  .ip-perks-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 14px;
  }
  .ip-perk-item {
    background: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px;
    text-align: center;
  }
  .ip-perk-icon { font-size: 22px; margin-bottom: 7px; }
  .ip-perk-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 3px;
  }
  .ip-perk-desc { font-size: 11px; color: var(--text-muted); line-height: 1.5; }

  /* Notice */
  .ip-notice-box {
    background: rgba(251,146,60,0.08);
    border: 1px solid rgba(251,146,60,0.2);
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.6;
  }
  .ip-notice-icon { flex-shrink: 0; font-size: 15px; margin-top: 1px; }

  /* Steps */
  .ip-steps-row {
    display: flex;
    align-items: flex-start;
    gap: 0;
  }
  .ip-step-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
  }
  .ip-step-item::after {
    content: '';
    position: absolute;
    top: 16px; left: 50%;
    width: 100%; height: 1px;
    background: var(--border);
    z-index: 0;
  }
  .ip-step-item:last-child::after { display: none; }
  .ip-step-num {
    width: 33px; height: 33px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 1px solid var(--accent-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
    color: var(--blue);
    margin-bottom: 8px;
    position: relative;
    z-index: 1;
  }
  .ip-step-label {
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1.4;
    max-width: 70px;
  }

  /* Cert */
  .ip-cert-box {
    background: linear-gradient(135deg, var(--accent-dim), rgba(52,211,153,0.05));
    border: 1px solid var(--accent-border);
    border-radius: var(--radius);
    padding: 20px 22px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .ip-cert-icon {
    width: 50px; height: 50px;
    background: var(--accent-dim);
    border: 1px solid var(--accent-border);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }
  .ip-cert-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--blue);
    margin-bottom: 5px;
  }
  .ip-cert-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.65; }

  /* Contact */
  .ip-contact-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .ip-contact-row:last-child { border-bottom: none; }
  .ip-contact-label {
    color: var(--text-muted);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: 72px;
    flex-shrink: 0;
  }
  .ip-contact-val { color: var(--blue); font-size: 12px; }

  /* Responsive */
  @media (max-width: 640px) {
    .ip-hero { padding: 28px 22px; }
    .ip-hero-title { font-size: 26px; }
    .ip-grid2 { grid-template-columns: 1fr; }
    .ip-feature-grid { grid-template-columns: 1fr; }
    .ip-perks-grid { grid-template-columns: 1fr 1fr; }
    .ip-steps-row { flex-direction: column; gap: 12px; align-items: flex-start; }
    .ip-step-item::after { display: none; }
    .ip-step-item { flex-direction: row; align-items: center; text-align: left; gap: 12px; }
    .ip-step-num { margin-bottom: 0; flex-shrink: 0; }
    .ip-step-label { max-width: none; }
  }
`