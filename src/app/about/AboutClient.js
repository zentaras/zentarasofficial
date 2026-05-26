'use client';

import { useEffect, useState } from 'react';
import styles from './about.module.css';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

// ── Reusable Theme Toggle (same logic as your navbar) ──────────────────────
function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('zentaras-theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('zentaras-theme', next);
  };

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb" />
      </div>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────
const TEAM = [
  {
    initials: 'RK',
    name: 'Rohan Kapoor',
    role: 'Founder & CEO',
    bio: 'Ex-Google ML engineer. Built NLP pipelines at scale. Obsessed with real-world AI impact over demo-ware.',
    tags: ['NLP', 'MLOps', 'Product'],
    color: 'var(--accent)',
    colorDim: 'var(--accent-dim)',
    colorBorder: 'var(--accent-border)',
  },
  {
    initials: 'PM',
    name: 'Priya Mehta',
    role: 'Head of Engineering',
    bio: 'Full-stack engineer with a data background. Shipped 3 SaaS products before 25. Believes clean code is a form of respect.',
    tags: ['React', 'PostgreSQL', 'Python'],
    color: 'var(--green)',
    colorDim: 'var(--green-dim)',
    colorBorder: 'rgba(34,160,107,0.3)',
  },
  {
    initials: 'AS',
    name: 'Arjun Singh',
    role: 'ML Research Lead',
    bio: 'IIT grad, ex-Flipkart DS. Publishes papers and ships models — not often you find both in one person.',
    tags: ['PyTorch', 'Transformers', 'Research'],
    color: 'var(--yellow)',
    colorDim: 'var(--yellow-dim)',
    colorBorder: 'rgba(226,178,3,0.3)',
  },
  {
    initials: 'ND',
    name: 'Neha Desai',
    role: 'Product & Growth',
    bio: 'Brings the user into every technical decision. Previously grew a B2B SaaS from 0 → 10k users organically.',
    tags: ['Product', 'Analytics', 'GTM'],
    color: 'var(--blue)',
    colorDim: 'var(--blue-dim)',
    colorBorder: 'rgba(87,157,255,0.25)',
  },
];

const VALUES = [
  {
    icon: '⚙️',
    title: 'Ship Real Code',
    desc: 'Everything we build ends up in production. No mock projects, no throwaway demos. Our interns commit to the same repos as our full-time engineers.',
  },
  {
    icon: '🔬',
    title: 'Research-Backed',
    desc: 'We follow the literature and apply it. ML decisions at Zentaras are grounded in evidence — not hype cycles or vendor claims.',
  },
  {
    icon: '📦',
    title: 'Own the Outcome',
    desc: 'We don\'t measure success by hours logged. We measure it by whether the thing we built actually worked in the real world.',
  },
  {
    icon: '🌐',
    title: 'Open by Default',
    desc: 'We write about what we learn. We publish our benchmarks. We believe the ecosystem gets stronger when people share honestly.',
  },
];

const TIMELINE = [
  { year: '2023', label: 'Founded', desc: 'Started as a 2-person experiment building recruitment AI tools.' },
  { year: '2024', label: 'Suite Expands', desc: 'DataPulse and SentiScope shipped. Team grew to 12 full-time.' },
  { year: '2025', label: 'Intern Program', desc: 'Launched structured internship tracks. 10 open spots across 2 products.' },
  { year: '2026', label: 'Now', desc: 'Building next-gen AI infrastructure. 3 live products, 100% remote.', active: true },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      {/* ── Navbar ── */}
      <Navbar/>
      <main className={styles.main}>

        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroEyebrow}>
           
            About Zentaras
          </div>
          <h1 className={styles.heroTitle}>
            We build AI tools<br />
            <span className={styles.heroAccent}>that actually ship.</span>
          </h1>
          <p className={styles.heroSub}>
            Zentaras is a data-first AI/ML company. We don't do mock projects or proof-of-concepts
            that never see users. Every line of code we write ends up inside a product that real
            people depend on.
          </p>
        </section>

      
        {/* ── Mission ── */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelBar} />
            Our Mission
          </div>
          <div className={styles.missionGrid}>
            <div className={styles.missionText}>
              <h2 className={styles.sectionTitle}>
                AI that earns its place in production
              </h2>
              <p className={styles.bodyText}>
                There's no shortage of AI demos. What's rare is AI that survives contact with messy
                real-world data, angry edge cases, and the scrutiny of engineers who have to maintain
                it six months from now.
              </p>
              <p className={styles.bodyText} style={{ marginTop: 14 }}>
                That's the only kind we build. Our three products — NeuralHire, DataPulse, and
                SentiScope — are live, used daily, and continuously improved by a small team
                that cares obsessively about correctness and reliability.
              </p>
              
            </div>
           
          </div>
        </section>

        <div className={styles.divider} />

       

        {/* ── Timeline ── */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelBar} />
            Company History
          </div>
          <h2 className={styles.sectionTitle} style={{ marginBottom: 28 }}>How we got here</h2>
          <div className={styles.timeline}>
            {TIMELINE.map((t, i) => (
              <div key={t.year} className={`${styles.timelineEntry} ${t.active ? styles.timelineActive : ''}`}>
                <div className={styles.timelineLeft}>
                  <span className={styles.timelineYear}>{t.year}</span>
                </div>
                <div className={styles.timelineConnector}>
                  <div className={styles.timelineDot} />
                  {i < TIMELINE.length - 1 && <div className={styles.timelineLine} />}
                </div>
                <div className={styles.timelineRight}>
                  <span className={styles.timelineLabel}>{t.label}</span>
                  <p className={styles.timelineDesc}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      
      </main>

      <Footer/>
     
    </>
  );
}
