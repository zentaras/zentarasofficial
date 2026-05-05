export default function Footer() {
  return (
    <div style={{
      textAlign: "center",
      marginTop: 56,
      paddingTop: 24,
      paddingBottom: 32,
      borderTop: "1px solid var(--border)",
    }}>
      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
        © 2026 Zentaras · Questions?{" "}
        <a href="mailto:team@zentaras.in" style={{ color: "var(--accent)", textDecoration: "none" }}>
          team@zentaras.in
        </a>
      </p>
    </div>
  );
}