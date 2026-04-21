"use client";

import { useApplications } from "../../context/ApplicationsContext";
import Analytics from "../../Components/AnalyticsTab";

// ── Shimmer keyframe ──────────────────────────────────────────────────────────
function Shimmer() {
  return (
    <style>{`
      @keyframes shimmer {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  );
}

// ── Base skeleton block ───────────────────────────────────────────────────────
function Skeleton({ width = "100%", height = 14, radius = 6, style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: "var(--bg-hover)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
          animation: "shimmer 1.6s infinite",
        }}
      />
    </div>
  );
}

// ── Skeleton sections ─────────────────────────────────────────────────────────

function TabsSkeleton() {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      {[60, 70, 65].map((w, i) => (
        <Skeleton key={i} width={w} height={34} radius={8} />
      ))}
    </div>
  );
}

function MetricsSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: 12,
        marginBottom: 20,
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Skeleton width="55%" height={28} radius={4} />
          <Skeleton width="70%" height={10} radius={4} />
        </div>
      ))}
    </div>
  );
}

function ChartCardSkeleton({ height = 220 }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "18px 20px",
      }}
    >
      {/* Card title */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div
          style={{
            width: 3,
            height: 12,
            borderRadius: 2,
            background: "var(--bg-hover)",
          }}
        />
        <Skeleton width={130} height={11} radius={4} />
      </div>
      {/* Chart area */}
      <Skeleton width="100%" height={height} radius={6} />
    </div>
  );
}

function TwoColSkeleton({ heights = [230, 230] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 12,
      }}
    >
      {heights.map((h, i) => (
        <ChartCardSkeleton key={i} height={h} />
      ))}
    </div>
  );
}

function InsightSkeleton() {
  return (
    <div
      style={{
        background: "var(--accent-dim)",
        border: "1px solid var(--accent-border)",
        borderRadius: 8,
        padding: "14px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <Skeleton width="25%" height={11} radius={4} />
      <Skeleton width="90%" height={11} radius={4} />
      <Skeleton width="60%" height={11} radius={4} />
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div style={{ paddingBottom: 32 }}>
      <Shimmer />
      <TabsSkeleton />
      <MetricsSkeleton />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Daily trend bar chart */}
        <ChartCardSkeleton height={200} />

        {/* Funnel + Work type */}
        <TwoColSkeleton heights={[230, 230]} />

        {/* Platform success horizontal bar */}
        <ChartCardSkeleton height={220} />

        {/* Weekly response + Job type */}
        <TwoColSkeleton heights={[200, 200]} />

        {/* Insight strip */}
        <InsightSkeleton />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { applications, loading } = useApplications();

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">
            {loading
              ? "Loading..."
              : `${applications.length} total application${applications.length !== 1 ? "s" : ""} tracked`}
          </p>
        </div>
      </div>

      {loading ? (
        <AnalyticsSkeleton />
      ) : (
        <Analytics applications={applications} />
      )}
    </>
  );
}