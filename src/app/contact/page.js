'use client';

import styles from './Contact.module.css';
import Navbar from '../Components/navbar';
import Footer from '../Components/footer';

const CONTACT_REASONS = [
  {
    icon: '💼',
    title: 'Internship Applications',
    desc: 'Applying for one of our open intern tracks? Send your resume, GitHub, and a one-liner on what you want to build.',
    email: 'careers@zentaras.in',
    color: 'var(--accent)',
    colorDim: 'var(--accent-dim)',
    colorBorder: 'var(--accent-border)',
  },
  {
    icon: '🤝',
    title: 'Partnerships & Integrations',
    desc: 'Want to integrate your data pipeline with one of our products, or explore a joint research direction?',
    email: 'careers@zentaras.in',
    color: 'var(--green)',
    colorDim: 'var(--green-dim)',
    colorBorder: 'rgba(34,160,107,0.3)',
  },
  {
    icon: '🐛',
    title: 'Bug Reports & Feedback',
    desc: 'Found something broken? Have a UX opinion? We read every single one — no ticketing system between you and us.',
    email: 'careers@zentaras.in',
    color: 'var(--yellow)',
    colorDim: 'var(--yellow-dim)',
    colorBorder: 'rgba(226,178,3,0.3)',
  },
  {
    icon: '📰',
    title: 'Press & Media',
    desc: "Writing about AI hiring tools, ML infrastructure, or the Indian startup ecosystem? We're happy to talk.",
    email: 'careers@zentaras.in',
    color: 'var(--blue)',
    colorDim: 'var(--blue-dim)',
    colorBorder: 'rgba(87,157,255,0.25)',
  },
];

const SOCIALS = [
  { label: 'LinkedIn', handle: 'zentaras', href: 'https://linkedin.com/company/zentarasindia' },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>

        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroEyebrow}>Contact Zentaras</div>
          <h1 className={styles.heroTitle}>
            We actually read<br />
            <span className={styles.heroAccent}>every message.</span>
          </h1>
          <p className={styles.heroSub}>
            Drop us an email and a real
            person on the team will get back to you.
          </p>
        </section>

      

        <div className={styles.divider} />

        {/* ── Direct Email CTA ── */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelBar} />
            General Enquiries
          </div>
          <div className={styles.ctaBlock}>
            <div>
              <p> Reach us directly. We reply to every email.
              </p>
            </div>
            <a href="mailto:careers@zentaras.in" className={styles.emailCta}>
              careers@zentaras.in
            </a>
          </div>

  {/* <div className={styles.divider} />
 
          <div className={styles.metaRow}>
            <div className={styles.responseCard}>
              <span className={styles.responseIcon}>⏱</span>
              <div>
                <div className={styles.responseTitle}>Response time</div>
                <div className={styles.responseDesc}>
                  We aim to reply within <strong>2 business days</strong>. Urgent issues (prod bugs) usually get a same-day response.
                </div>
              </div>
            </div>


            <div className={styles.socialsBlock}>
              <div className={styles.sectionLabel} style={{ marginBottom: 14 }}>
                <span className={styles.labelBar} />
                Find us online
              </div>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialRow}
                >
                  <span className={styles.socialLabel}>{s.label}</span>
                  <span className={styles.socialHandle}>{s.handle}</span>
                </a>
              ))}
            </div>
          </div> */}
        </section>

      </main>
      <Footer />
    </>
  );
}