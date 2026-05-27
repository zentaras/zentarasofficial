import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      marginTop: 72,
      borderTop: "1px solid var(--border)",
      transition: "border-color 0.25s",
    }}>
      {/* ── Inner container — matches page max-width ── */}
      <div style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "40px 28px 32px",
      }}>

        {/* ── Top row ── */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 40,
          justifyContent: "space-between", alignItems: "flex-start",
          marginBottom: 32,
        }}>

          {/* Brand */}
          <div style={{ maxWidth: 240, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            
              <span style={{
                fontFamily: "sans-serif", fontWeight: 800, fontSize: 15,
                color: "var(--sidebar-logo-color)", letterSpacing: "-0.2px",
                transition: "color 0.25s",
              }}>
                Zen<span style={{ color: "var(--sidebar-logo-accent)", transition: "color 0.25s" }}>taras</span>
              </span>
            </div>
            <p style={{
              fontSize: 12, color: "var(--sidebar-logo-sub)", lineHeight: 1.7,
              transition: "color 0.25s",
            }}>
              AI/ML &amp; Data Science solutions. We build production-grade intelligent systems for real-world problems.
            </p>
          </div>

          {/* Link columns */}
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[
              // {
              //   heading: "Products",
              //   links: [
              //     { label: "NeuralHire", href: "#" },
              //     { label: "DataPulse",  href: "#" },
              //     { label: "SentiScope", href: "#" },
              //   ],
              // },
              // {
              //   heading: "Internships",
              //   links: [
              //     { label: "Open Projects", href: "#projects" },
              //     { label: "How It Works",  href: "#process"  },
              //     { label: "FAQ",           href: "#faq"      },
              //   ],
              // },
              {
                heading: "Company",
                links: [
                  { label: "About",   href: "/about" },
                   { label: "Careers", href: "/careers" },
                  { label: "Contact", href: "/contact" }
                 
                ],
              },
            ].map(col => (
              <div key={col.heading}>
                <p style={{
                  fontFamily: "sans-serif", fontSize: 10, fontWeight: 700,
                  color: "var(--sidebar-section-label)", textTransform: "uppercase",
                  letterSpacing: "0.9px", marginBottom: 12,
                  transition: "color 0.25s",
                }}>{col.heading}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {col.links.map(lk => (
                    <a key={lk.label} href={lk.href} style={{
                      fontSize: 13, color: "var(--sidebar-nav-item)",
                      textDecoration: "none", fontWeight: 500,
                      transition: "color 0.15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = "var(--sidebar-nav-item-hover)"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--sidebar-nav-item)"}
                    >{lk.label}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: "1px solid var(--border)", transition: "border-color 0.25s" }} />

        {/* ── Bottom row ── */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 12,
          alignItems: "center", justifyContent: "space-between",
          paddingTop: 20,
        }}>
          <p style={{ fontSize: 12, color: "var(--sidebar-logo-sub)", transition: "color 0.25s" }}>
            © 2026 Zentaras. All rights reserved.
          </p>

       
        </div>

      </div>
    </footer>
  );
}