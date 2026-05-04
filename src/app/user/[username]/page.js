import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";

export default async function UserProfilePage({ params }) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      aiResumeScreenerApps: { where: { status: "Shortlisted" }, orderBy: { createdAt: "desc" } },
      ecommerceAnalyticsApps: { where: { status: "Shortlisted" }, orderBy: { createdAt: "desc" } },
      sentimentDashboardApps: { where: { status: "Shortlisted" }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) notFound();

  const shortlisted = [
    ...user.aiResumeScreenerApps.map(a => ({ ...a, projectName: "AI Resume Screener", icon: "🤖" })),
    ...user.ecommerceAnalyticsApps.map(a => ({ ...a, projectName: "E-Commerce Analytics", icon: "📊" })),
    ...user.sentimentDashboardApps.map(a => ({ ...a, projectName: "Sentiment Dashboard", icon: "🧠" })),
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "32px", textAlign: "center", marginBottom: 24,
        }}>
          {user.imageUrl && (
            <img src={user.imageUrl} alt="avatar"
              style={{ width: 72, height: 72, borderRadius: "50%", border: "2px solid var(--border)", marginBottom: 16 }} />
          )}
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
            {user.firstName} {user.lastName}
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>@{user.username}</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{user.email}</p>
        </div>

        {shortlisted.length > 0 && (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "24px" }}>
            <p style={{ fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
              Shortlisted For
            </p>
            {shortlisted.map(a => (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 0", borderBottom: "1px solid var(--border)",
              }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{a.projectName}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Zentaras</p>
                </div>
                <span style={{
                  marginLeft: "auto", fontSize: 11, fontWeight: 700,
                  padding: "3px 10px", borderRadius: 20,
                  background: "var(--green-dim)", color: "var(--green)",
                }}>Shortlisted ✓</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}