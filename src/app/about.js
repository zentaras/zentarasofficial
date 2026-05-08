<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>About — Zentaras</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
<style>
/* ── DARK THEME (default — Jira-inspired navy/charcoal) ─────────────────── */
:root,[data-theme="dark"]{--bg:#161a21;--bg-card:#1d2125;--bg-hover:#282e33;--border:#2c333a;--border-light:#3a424a;--text-primary:#b6c2cf;--text-secondary:#8c9bab;--text-muted:#596775;--accent:#0c66e4;--accent-hover:#1977f3;--accent-dim:rgba(12,102,228,0.14);--accent-border:rgba(12,102,228,0.35);--green:#22a06b;--green-dim:rgba(34,160,107,0.12);--yellow:#e2b203;--yellow-dim:rgba(226,178,3,0.12);--red:#e34935;--red-dim:rgba(227,73,53,0.12);--blue:#579dff;--blue-dim:rgba(87,157,255,0.12);--sidebar-width:240px;--radius:8px;--radius-sm:5px;--sidebar-bg:#1d2125;--sidebar-border:#2c333a;--sidebar-item-active-bg:rgba(12,102,228,0.18);--sidebar-item-active-color:#579dff;--sidebar-logo-color:#ffffff;--sidebar-logo-accent:#579dff;--sidebar-logo-sub:rgba(255,255,255,0.45);--sidebar-section-label:rgba(255,255,255,0.35);--sidebar-nav-item:rgba(255,255,255,0.65);--sidebar-nav-item-hover-bg:rgba(255,255,255,0.10);--sidebar-nav-item-hover:#ffffff;--sidebar-bottom-user-bg:rgba(255,255,255,0.08);--sidebar-bottom-user-border:rgba(255,255,255,0.12);--sidebar-version-bg:rgba(255,255,255,0.06);--sidebar-version-border:rgba(255,255,255,0.12);--sidebar-version-hover-bg:rgba(255,255,255,0.12);--sidebar-version-text:rgba(255,255,255,0.70);--sidebar-version-sub:rgba(255,255,255,0.35);--sidebar-version-icon:rgba(255,255,255,0.40);--toggle-bg:#282e33;--toggle-border:#3a424a;}
[data-theme="light"]{--bg:#f4f5f7;--bg-card:#ffffff;--bg-hover:#f0f1f3;--border:#dfe1e6;--border-light:#c1c7d0;--text-primary:#172b4d;--text-secondary:#344563;--text-muted:#7a8699;--accent:#0052cc;--accent-hover:#0065ff;--accent-dim:rgba(0,82,204,0.08);--accent-border:rgba(0,82,204,0.28);--green:#006644;--green-dim:rgba(0,102,68,0.08);--yellow:#ff8b00;--yellow-dim:rgba(255,139,0,0.1);--red:#de350b;--red-dim:rgba(222,53,11,0.08);--blue:#0052cc;--blue-dim:rgba(0,82,204,0.08);--sidebar-bg:#e8edf7;--sidebar-border:rgba(0,82,204,0.14);--sidebar-item-active-bg:rgba(0,82,204,0.14);--sidebar-item-active-color:#0052cc;--sidebar-logo-color:#172b4d;--sidebar-logo-accent:#0052cc;--sidebar-logo-sub:rgba(23,43,77,0.45);--sidebar-section-label:rgba(23,43,77,0.38);--sidebar-nav-item:rgba(23,43,77,0.65);--sidebar-nav-item-hover-bg:rgba(0,82,204,0.08);--sidebar-nav-item-hover:#172b4d;--sidebar-bottom-user-bg:rgba(0,82,204,0.07);--sidebar-bottom-user-border:rgba(0,82,204,0.18);--sidebar-version-bg:rgba(0,82,204,0.06);--sidebar-version-border:rgba(0,82,204,0.18);--sidebar-version-hover-bg:rgba(0,82,204,0.12);--sidebar-version-text:rgba(23,43,77,0.75);--sidebar-version-sub:rgba(23,43,77,0.38);--sidebar-version-icon:rgba(23,43,77,0.30);--toggle-bg:#ffffff;--toggle-border:#dfe1e6;}

*{margin:0;padding:0;box-sizing:border-box;}
html,body{background:var(--bg);color:var(--text-primary);font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.6;-webkit-font-smoothing:antialiased;transition:background 0.25s ease,color 0.25s ease;}

/* NAV */
.topnav{position:sticky;top:0;z-index:50;background:var(--bg-card);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:52px;backdrop-filter:blur(8px);}
.logo-mark{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:var(--sidebar-logo-color);letter-spacing:-0.2px;text-decoration:none;}
.logo-mark span{color:var(--sidebar-logo-accent);}
.nav-links{display:flex;align-items:center;gap:6px;}
.nav-links a{font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:var(--sidebar-nav-item);padding:6px 12px;border-radius:var(--radius-sm);text-decoration:none;transition:all 0.12s;}
.nav-links a:hover{background:var(--sidebar-nav-item-hover-bg);color:var(--sidebar-nav-item-hover);}
.nav-links a.active{background:var(--sidebar-item-active-bg);color:var(--sidebar-item-active-color);}
.theme-toggle{display:flex;align-items:center;gap:6px;background:var(--toggle-bg);border:1px solid var(--toggle-border);border-radius:20px;padding:4px 12px 4px 6px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;color:var(--text-secondary);transition:all 0.2s;white-space:nowrap;}
.theme-toggle:hover{border-color:var(--accent-border);color:var(--accent);}
.theme-toggle-track{width:32px;height:18px;border-radius:9px;background:var(--bg-hover);border:1px solid var(--border-light);position:relative;transition:background 0.2s;flex-shrink:0;}
[data-theme="light"] .theme-toggle-track{background:var(--accent-dim);border-color:var(--accent-border);}
.theme-toggle-thumb{position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:var(--text-muted);transition:transform 0.2s,background 0.2s;}
[data-theme="light"] .theme-toggle-thumb{transform:translateX(14px);background:var(--accent);}

/* HERO */
.about-hero{text-align:center;padding:80px 40px 64px;max-width:760px;margin:0 auto;}
.hero-tag{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;background:var(--accent-dim);border:1px solid var(--accent-border);font-size:11px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:20px;}
.about-hero h1{font-family:'Syne',sans-serif;font-size:48px;font-weight:800;line-height:1.1;letter-spacing:-1px;color:var(--text-primary);margin-bottom:18px;}
.about-hero h1 span{color:var(--accent);}
.about-hero p{font-size:16px;color:var(--text-secondary);line-height:1.75;max-width:580px;margin:0 auto;}

/* WRAPPER */
.page-wrap{max-width:900px;margin:0 auto;padding:0 40px 80px;}

/* SECTION LABEL */
.section-label{display:flex;align-items:center;gap:10px;margin-bottom:20px;}
.section-label-bar{width:3px;height:14px;border-radius:2px;background:var(--accent);}
.section-label-text{font-family:'Syne',sans-serif;font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.2px;}

/* INSIGHT BOX */
.insight-box{background:var(--accent-dim);border:1px solid var(--accent-border);border-radius:var(--radius);padding:16px 20px;font-size:14px;color:var(--text-secondary);line-height:1.75;margin-bottom:32px;}
.insight-box strong{color:var(--text-primary);}

/* MISSION GRID */
.mission-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:40px;}
.mission-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:22px 22px;transition:border-color 0.15s;}
.mission-card:hover{border-color:var(--border-light);}
.mc-icon{font-size:22px;margin-bottom:12px;}
.mc-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:8px;}
.mc-body{font-size:13px;color:var(--text-secondary);line-height:1.7;}

/* PRODUCTS */
.products-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:40px;}
.product-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:18px;transition:border-color 0.15s,transform 0.15s;}
.product-card:hover{border-color:var(--border-light);transform:translateY(-2px);}
.product-icon{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:12px;flex-shrink:0;}
.pi-blue{background:var(--blue-dim);border:1px solid rgba(87,157,255,0.25);}
.pi-green{background:var(--green-dim);border:1px solid rgba(34,160,107,0.25);}
.pi-yellow{background:var(--yellow-dim);border:1px solid rgba(226,178,3,0.25);}
.product-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:4px;}
.product-tag{display:inline-block;padding:1px 7px;border-radius:3px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:8px;}
.tag-ai{background:var(--blue-dim);color:var(--blue);}
.tag-data{background:var(--green-dim);color:var(--green);}
.tag-nlp{background:var(--yellow-dim);color:var(--yellow);}
.product-desc{font-size:12px;color:var(--text-muted);line-height:1.65;}

/* STATS ROW */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:40px;}
.stat-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center;transition:border-color 0.15s;}
.stat-card:hover{border-color:var(--border-light);}
.stat-num{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;line-height:1;margin-bottom:6px;}
.stat-desc{font-size:11px;color:var(--text-muted);font-weight:500;text-transform:uppercase;letter-spacing:0.6px;}

/* TEAM */
.team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:40px;}
.team-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;text-align:center;transition:border-color 0.15s;}
.team-card:hover{border-color:var(--border-light);}
.team-avatar{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:18px;font-weight:800;margin:0 auto 12px;border:2px solid var(--accent-border);background:var(--accent-dim);color:var(--accent);}
.team-name{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:3px;}
.team-role{font-size:11px;color:var(--accent);font-weight:600;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:8px;}
.team-bio{font-size:12px;color:var(--text-muted);line-height:1.6;}

/* VALUES */
.values-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:40px;}
.value-row{display:flex;align-items:flex-start;gap:14px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:18px;}
.value-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;background:var(--bg-hover);border:1px solid var(--border-light);}
.value-title{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:4px;}
.value-body{font-size:12px;color:var(--text-muted);line-height:1.65;}

/* CTA */
.cta-box{background:var(--accent-dim);border:1px solid var(--accent-border);border-radius:var(--radius);padding:32px 36px;display:flex;align-items:center;justify-content:space-between;gap:24px;}
.cta-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:var(--text-primary);margin-bottom:6px;}
.cta-sub{font-size:13px;color:var(--text-secondary);}
.btn-primary{background:var(--accent);color:#fff;border:none;padding:9px 20px;border-radius:var(--radius-sm);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:background 0.15s,box-shadow 0.15s,transform 0.1s;white-space:nowrap;box-shadow:0 1px 2px rgba(0,0,0,0.2);text-decoration:none;}
.btn-primary:hover{background:var(--accent-hover);box-shadow:0 2px 6px rgba(12,102,228,0.35);transform:translateY(-1px);}
.btn-ghost{background:transparent;color:var(--text-secondary);border:1px solid var(--border);padding:8px 18px;border-radius:var(--radius-sm);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all 0.15s;text-decoration:none;display:inline-flex;align-items:center;gap:6px;}
.btn-ghost:hover{border-color:var(--border-light);color:var(--text-primary);background:var(--bg-hover);}

/* FOOTER */
footer{border-top:1px solid var(--border);padding:32px 40px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
.footer-copy{font-size:12px;color:var(--text-muted);}
.footer-links{display:flex;gap:16px;}
.footer-links a{font-size:12px;color:var(--text-muted);text-decoration:none;transition:color 0.15s;}
.footer-links a:hover{color:var(--text-secondary);}

/* DIVIDER */
.divider{height:1px;background:var(--border);margin:40px 0;}

::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--border-light);border-radius:3px;}

@media(max-width:768px){
  .about-hero{padding:48px 20px 40px;}
  .about-hero h1{font-size:32px;}
  .page-wrap{padding:0 20px 60px;}
  .mission-grid,.products-grid,.team-grid,.values-grid,.stats-row{grid-template-columns:1fr;}
  .cta-box{flex-direction:column;align-items:flex-start;}
  .topnav{padding:0 20px;}
  footer{padding:24px 20px;flex-direction:column;align-items:flex-start;}
}
</style>
</head>
<body>

<!-- NAV -->
<nav class="topnav">
  <a href="index.html" class="logo-mark">Zen<span>taras</span></a>
  <div class="nav-links">
    <a href="index.html">Home</a>
    <a href="about.html" class="active">About</a>
    <a href="contact.html">Contact</a>
  </div>
  <button class="theme-toggle" onclick="toggleTheme()">
    <div class="theme-toggle-track"><div class="theme-toggle-thumb"></div></div>
    <span id="theme-label">Light</span>
  </button>
</nav>

<!-- HERO -->
<section class="about-hero">
  <div class="hero-tag">⚡ About Zentaras</div>
  <h1>AI/ML Built for the <span>Real World</span></h1>
  <p>We're a data-first company building production-grade intelligent systems. Not demos. Not mock projects. Real tools that ship to real users.</p>
</section>

<div class="page-wrap">

  <!-- WHO WE ARE -->
  <div class="section-label"><div class="section-label-bar"></div><span class="section-label-text">Who We Are</span></div>
  <div class="insight-box">
    <strong>Zentaras is an AI/ML & Data Science company</strong> founded on a single belief: most AI companies build impressive demos that never make it to production. We do the opposite — every line of code we write ships inside a live product used by real businesses. Our team combines deep ML expertise with product-engineering discipline to close the gap between research and reality.
  </div>

  <!-- MISSION CARDS -->
  <div class="section-label"><div class="section-label-bar"></div><span class="section-label-text">Our Mission</span></div>
  <div class="mission-grid">
    <div class="mission-card">
      <div class="mc-icon">🎯</div>
      <div class="mc-title">Ship Real AI</div>
      <div class="mc-body">We build systems that don't just impress in Jupyter notebooks — they run in production, handle edge cases, and deliver measurable business value day after day.</div>
    </div>
    <div class="mission-card">
      <div class="mc-icon">🧠</div>
      <div class="mc-title">Grow the Next Generation</div>
      <div class="mc-body">Through our internship programme, we give emerging engineers hands-on experience contributing to products that actually exist — not toy problems.</div>
    </div>
    <div class="mission-card">
      <div class="mc-icon">📊</div>
      <div class="mc-title">Data-First, Always</div>
      <div class="mc-body">Every decision at Zentaras starts with data. We don't guess — we measure, instrument, iterate, and deploy based on real signals from real users.</div>
    </div>
    <div class="mission-card">
      <div class="mc-icon">🚀</div>
      <div class="mc-title">Move Fast, Don't Break Things</div>
      <div class="mc-body">Speed without rigour is chaos. We enforce code quality, reproducible pipelines, and thorough testing so we can ship quickly and confidently.</div>
    </div>
  </div>

  <!-- PRODUCTS -->
  <div class="section-label"><div class="section-label-bar"></div><span class="section-label-text">Our Products</span></div>
  <div class="products-grid" style="margin-bottom:40px;">
    <div class="product-card">
      <div class="product-icon pi-blue">🤖</div>
      <div class="product-name">NeuralHire</div>
      <span class="product-tag tag-ai">AI / ML</span>
      <div class="product-desc">AI recruitment intelligence — resume parsing, candidate scoring, and JD matching at scale. Helps companies cut screening time by 70%.</div>
    </div>
    <div class="product-card">
      <div class="product-icon pi-green">📊</div>
      <div class="product-name">DataPulse</div>
      <span class="product-tag tag-data">Data Analytics</span>
      <div class="product-desc">Business intelligence engine with cohort analytics, RFM segmentation, and revenue dashboards. Turns raw transactions into decisions.</div>
    </div>
    <div class="product-card">
      <div class="product-icon pi-yellow">💬</div>
      <div class="product-name">SentiScope</div>
      <span class="product-tag tag-nlp">NLP / ML</span>
      <div class="product-desc">Brand intelligence platform — real-time social listening, sentiment models, and trend alerts across Twitter, Reddit, and beyond.</div>
    </div>
  </div>

  <!-- STATS -->
  <div class="section-label"><div class="section-label-bar"></div><span class="section-label-text">By the Numbers</span></div>
  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-num" style="color:var(--accent);">3</div>
      <div class="stat-desc">Live Products</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--green);">7</div>
      <div class="stat-desc">Intern Spots</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--yellow);">LOR</div>
      <div class="stat-desc">On Completion</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--blue);">100%</div>
      <div class="stat-desc">Remote</div>
    </div>
  </div>

  <!-- TEAM -->
  <div class="section-label"><div class="section-label-bar"></div><span class="section-label-text">The Team</span></div>
  <div class="team-grid">
    <div class="team-card">
      <div class="team-avatar">RK</div>
      <div class="team-name">Rahul Kumar</div>
      <div class="team-role">Founder & ML Lead</div>
      <div class="team-bio">5+ years building NLP and computer vision systems for enterprise clients. Previously at a Series B fintech startup.</div>
    </div>
    <div class="team-card">
      <div class="team-avatar">SP</div>
      <div class="team-name">Shreya Patel</div>
      <div class="team-role">Head of Data Engineering</div>
      <div class="team-bio">Specialises in large-scale data pipelines, dbt, and real-time analytics. Ex-consultant at a top-tier analytics firm.</div>
    </div>
    <div class="team-card">
      <div class="team-avatar">AM</div>
      <div class="team-name">Arjun Mehta</div>
      <div class="team-role">Product & Backend</div>
      <div class="team-bio">Full-stack engineer with a bias for shipping. Obsessed with clean APIs, fast iteration, and making ML models production-safe.</div>
    </div>
  </div>

  <!-- VALUES -->
  <div class="section-label"><div class="section-label-bar"></div><span class="section-label-text">Our Values</span></div>
  <div class="values-grid">
    <div class="value-row">
      <div class="value-icon">🔬</div>
      <div>
        <div class="value-title">Rigour Over Hype</div>
        <div class="value-body">We don't chase trends. We measure outcomes, validate with data, and ship things that hold up in the real world.</div>
      </div>
    </div>
    <div class="value-row">
      <div class="value-icon">🤝</div>
      <div>
        <div class="value-title">Radical Transparency</div>
        <div class="value-body">Interns see the full picture — product decisions, technical debt, failures, and wins. No black boxes internally.</div>
      </div>
    </div>
    <div class="value-row">
      <div class="value-icon">⚡</div>
      <div>
        <div class="value-title">Ownership Mindset</div>
        <div class="value-body">Everyone here owns their work end-to-end. If you broke it, you fix it. If you built it, you're proud of it.</div>
      </div>
    </div>
    <div class="value-row">
      <div class="value-icon">📚</div>
      <div>
        <div class="value-title">Continuous Learning</div>
        <div class="value-body">The ML landscape moves fast. We dedicate time every week to research, reading, and experimenting with new techniques.</div>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="cta-box">
    <div>
      <div class="cta-title">Ready to build real AI with us?</div>
      <div class="cta-sub">7 intern spots open. Applications close soon. 100% remote.</div>
    </div>
    <div style="display:flex;gap:10px;flex-shrink:0;">
      <a href="index.html" class="btn-primary">View Open Projects →</a>
      <a href="contact.html" class="btn-ghost">Get in Touch</a>
    </div>
  </div>

</div>

<!-- FOOTER -->
<footer>
  <div class="footer-copy">© 2026 Zentaras. All rights reserved.</div>
  <div class="footer-links">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
  </div>
</footer>

<script>
function toggleTheme(){
  const html=document.documentElement;
  const isDark=html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme',isDark?'light':'dark');
  document.getElementById('theme-label').textContent=isDark?'Dark':'Light';
}
</script>
</body>
</html>