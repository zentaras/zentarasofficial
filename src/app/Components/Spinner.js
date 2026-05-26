export default function Spinner() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "3px solid var(--border)",
        borderTopColor: "var(--accent)",
        animation: "spin 0.7s linear infinite",
      }} />
    </div>
  );
}