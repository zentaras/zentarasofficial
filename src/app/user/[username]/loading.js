// src/app/[username]/loading.js  (same folder as page.js)

export default function Loading() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      color: "var(--text-primary)",
      fontFamily: "DM Sans, sans-serif",
    }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px" }}>

        {/* Avatar + name skeleton */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "32px",
          textAlign: "center",
          marginBottom: 24,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "var(--border)",
            margin: "0 auto 16px",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
          <div style={{ height: 22, width: 160, borderRadius: 6, background: "var(--border)", margin: "0 auto 8px", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: 14, width: 100, borderRadius: 6, background: "var(--border)", margin: "0 auto 8px", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ height: 12, width: 140, borderRadius: 6, background: "var(--border)", margin: "0 auto",   animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>

        {/* Shortlisted card skeleton */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "24px",
        }}>
          <div style={{ height: 11, width: 100, borderRadius: 4, background: "var(--border)", marginBottom: 16, animation: "pulse 1.5s ease-in-out infinite" }} />
          {[1, 2].map(i => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 0", borderBottom: "1px solid var(--border)",
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--border)", flexShrink: 0, animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, width: 160, borderRadius: 4, background: "var(--border)", marginBottom: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
                <div style={{ height: 12, width: 60,  borderRadius: 4, background: "var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
              </div>
              <div style={{ height: 22, width: 80, borderRadius: 20, background: "var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}