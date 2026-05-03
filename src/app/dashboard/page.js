import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../lib/prisma";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const primaryEmail = clerkUser.emailAddresses?.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  const dbUser = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {},
    create: {
      clerkId:   clerkUser.id,
      email:     primaryEmail ?? "",
      firstName: clerkUser.firstName ?? null,
      lastName:  clerkUser.lastName  ?? null,
      imageUrl:  clerkUser.imageUrl  ?? null,
      username:  clerkUser.username  ?? null,
    },
    include: {
      aiResumeScreenerApps:   { orderBy: { createdAt: "desc" } },
      ecommerceAnalyticsApps: { orderBy: { createdAt: "desc" } },
      sentimentDashboardApps: { orderBy: { createdAt: "desc" } },
    },
  });

  const allApps = [
    ...dbUser.aiResumeScreenerApps.map(a => ({
      ...a,
      projectName: "AI Resume Screener",
      icon: "🤖",
      color: "#6366f1",
    })),
    ...dbUser.ecommerceAnalyticsApps.map(a => ({
      ...a,
      projectName: "E-Commerce Analytics",
      icon: "📊",
      color: "#22a06b",
    })),
    ...dbUser.sentimentDashboardApps.map(a => ({
      ...a,
      projectName: "Sentiment Dashboard",
      icon: "🧠",
      color: "#e2b203",
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const statusColor = (s) =>
    s === "Shortlisted" ? { bg: "#dcfce7", color: "#16a34a" }
    : s === "Rejected"  ? { bg: "#fee2e2", color: "#dc2626" }
    :                     { bg: "#eff6ff", color: "#2563eb" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "var(--sidebar-bg)",
        borderBottom: "1px solid var(--sidebar-border)",
        padding: "0 32px", height: 58,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backdropFilter: "blur(8px)",
      }}>
        <span style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20,
          color: "var(--sidebar-logo-color)", letterSpacing: "-0.3px",
        }}>
          Leader<span style={{ color: "var(--sidebar-logo-accent)" }}>Lab</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
            ← Back to Projects
          </a>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Welcome hero */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "28px 32px",
          marginBottom: 28,
          display: "flex", alignItems: "center", gap: 20,
        }}>
          {clerkUser.imageUrl && (
            <img
              src={clerkUser.imageUrl}
              alt="avatar"
              style={{ width: 64, height: 64, borderRadius: "50%", border: "2px solid var(--border)" }}
            />
          )}
          <div>
            <h1 style={{
              fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800,
              color: "var(--text-primary)", marginBottom: 4,
            }}>
              Hello, {clerkUser.firstName ?? "there"} 👋
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>{primaryEmail}</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
            {[
              { val: allApps.length, label: "Applied" },
              { val: allApps.filter(a => a.status === "Shortlisted").length, label: "Shortlisted" },
              { val: allApps.filter(a => a.status === "Pending").length, label: "Pending" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800,
                  color: "var(--text-primary)", lineHeight: 1,
                }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile card */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "24px 28px", marginBottom: 28,
        }}>
          <p style={{
            fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 700,
            color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16,
          }}>Profile</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 32px" }}>
            {[
              ["Full Name", `${dbUser.firstName ?? ""} ${dbUser.lastName ?? ""}`.trim() || "—"],
              ["Email",     dbUser.email],
              ["Username",  dbUser.username ?? "—"],
              ["Member Since", new Date(dbUser.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)", width: 100, flexShrink: 0, paddingTop: 1 }}>{label}</span>
                <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Applications */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "24px 28px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{
              fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 700,
              color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1,
            }}>My Applications</p>
            <a href="/" style={{
              fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 600,
            }}>
              + Apply to a project
            </a>
          </div>

          {allApps.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "40px 0",
              border: "1px dashed var(--border)", borderRadius: "var(--radius-sm)",
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>No applications yet</p>
              <a href="/" style={{
                fontSize: 13, color: "var(--accent)", textDecoration: "none", fontWeight: 600,
              }}>
                Browse open projects →
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {allApps.map((app) => {
                const sc = statusColor(app.status);
                return (
                  <div key={app.id} style={{
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "16px 20px",
                    display: "flex", alignItems: "center", gap: 16,
                    background: "var(--bg)",
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: `${app.color}18`,
                      border: `1px solid ${app.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                    }}>
                      {app.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>
                        {app.projectName}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        Applied {new Date(app.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "4px 12px",
                        borderRadius: 20, background: sc.bg, color: sc.color,
                      }}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}