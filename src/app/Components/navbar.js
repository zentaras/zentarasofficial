"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import ThemeToggle from "../theme/ThemeToggle";

export default function Navbar({ showDashboardLink = false}) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 40,
      background: "var(--sidebar-bg)", borderBottom: "1px solid var(--sidebar-border)",
      padding: "0 28px", height: 56,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      backdropFilter: "blur(8px)",
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18,
          color: "var(--sidebar-logo-color)", letterSpacing: "-0.3px",
        }}>
          Zen<span style={{ color: "var(--sidebar-logo-accent)" }}>taras</span>
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ThemeToggle />


        <SignedOut>
          <SignInButton mode="modal">
            <button style={{
              padding: "6px 16px", borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)", background: "transparent",
              color: "var(--text-primary)", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button style={{
              padding: "6px 16px", borderRadius: "var(--radius-sm)",
              border: "none", background: "var(--accent)",
              color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>Sign Up</button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          {showDashboardLink && (
            <Link href="/dashboard" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", fontWeight: 500 }}>
              Dashboard
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}