


"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import ThemeToggle from "../theme/ThemeToggle";

export default function Navbar({ showDashboardLink = false }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 40,
      background: "var(--sidebar-bg)",
      borderBottom: "1px solid var(--sidebar-border)",
      padding: "0 28px", height: 56,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      backdropFilter: "blur(8px)",
      transition: "background 0.25s ease, border-color 0.25s ease",
    }}>

      {/* ── Logo ── */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
      

        <div>
          <div style={{
            fontFamily: "sans-serif", fontWeight: 800, fontSize: 16,
            color: "var(--sidebar-logo-color)", letterSpacing: "-0.3px",
            lineHeight: 1.1, transition: "color 0.25s",
          }}>
            Zen<span style={{ color: "var(--sidebar-logo-accent)", transition: "color 0.25s" }}>taras</span>
          </div>
          
        </div>
      </Link>

     

      {/* ── Right side ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ThemeToggle />

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "var(--sidebar-border)", flexShrink: 0 }} />

        <SignedOut>
          <SignInButton mode="modal">
            <button style={{
              padding: "6px 14px", borderRadius: "var(--radius-sm)",
              border: "1px solid var(--sidebar-border)",
              background: "transparent",
              color: "var(--sidebar-nav-item)", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "DM Sans, sans-serif",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--border-light)";
                e.currentTarget.style.color = "var(--sidebar-nav-item-hover)";
                e.currentTarget.style.background = "var(--sidebar-nav-item-hover-bg)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--sidebar-border)";
                e.currentTarget.style.color = "var(--sidebar-nav-item)";
                e.currentTarget.style.background = "transparent";
              }}
            >Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button style={{
              padding: "6px 14px", borderRadius: "var(--radius-sm)",
              border: "none", background: "var(--accent)",
              color: "#fff", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "DM Sans, sans-serif",
              transition: "background 0.15s, box-shadow 0.15s, transform 0.1s",
              boxShadow: "0 1px 4px rgba(12,102,228,0.3)",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--accent-hover)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 3px 10px rgba(12,102,228,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(12,102,228,0.3)";
              }}
            >Get Started →</button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          {showDashboardLink && (
            <Link href="/dashboard" style={{
              fontSize: 13, fontWeight: 600, textDecoration: "none",
              color: "var(--sidebar-nav-item)",
              padding: "5px 12px", borderRadius: "var(--radius-sm)",
              border: "1px solid var(--sidebar-border)",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--sidebar-nav-item-hover-bg)";
                e.currentTarget.style.color = "var(--sidebar-nav-item-hover)";
                e.currentTarget.style.borderColor = "var(--border-light)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--sidebar-nav-item)";
                e.currentTarget.style.borderColor = "var(--sidebar-border)";
              }}
            >
              Dashboard
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      {/* ── Responsive: hide center links on mobile ── */}
      <style>{`
        @media (max-width: 768px) {
          .nav-center-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}