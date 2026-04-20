"use client";

import { useMemo, useState } from "react";
import {
  PieChart, Pie, BarChart, Bar, AreaChart, Area,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";

// ── Read CSS variables from :root so the chart colours respect the theme ──
function cssVar(name) {
  if (typeof window === "undefined") return "#888";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getT() {
  return {
    bg:          cssVar("--bg")           || "#161a21",
    bgCard:      cssVar("--bg-card")      || "#1d2125",
    bgHover:     cssVar("--bg-hover")     || "#282e33",
    border:      cssVar("--border")       || "#2c333a",
    borderLight: cssVar("--border-light") || "#3a424a",
    textP:       cssVar("--text-primary")   || "#b6c2cf",
    textS:       cssVar("--text-secondary") || "#8c9bab",
    textM:       cssVar("--text-muted")     || "#596775",
    accent:      cssVar("--accent")         || "#0c66e4",
    accentDim:   cssVar("--accent-dim")     || "rgba(12,102,228,0.14)",
    accentBorder:cssVar("--accent-border")  || "rgba(12,102,228,0.35)",
    green:       cssVar("--green")          || "#22a06b",
    greenDim:    cssVar("--green-dim")      || "rgba(34,160,107,0.12)",
    yellow:      cssVar("--yellow")         || "#e2b203",
    yellowDim:   cssVar("--yellow-dim")     || "rgba(226,178,3,0.12)",
    red:         cssVar("--red")            || "#e34935",
    redDim:      cssVar("--red-dim")        || "rgba(227,73,53,0.12)",
    blue:        cssVar("--blue")           || "#579dff",
    blueDim:     cssVar("--blue-dim")       || "rgba(87,157,255,0.12)",
  };
}

const STATUS_COLORS_KEYS = {
  Applied:   "--blue",
  Interview: "--yellow",
  Offer:     "--green",
  Rejected:  "--red",
};

const PALETTE_KEYS = [
  "--accent", "--blue", "--green", "--yellow",
];

// ── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload?.length) return null;
  const T = getT();
  return (
    <div style={{
      background: T.bgCard,
      border: `1px solid ${T.borderLight}`,
      borderRadius: 8,
      padding: "9px 13px",
      fontSize: 12,
      color: T.textP,
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    }}>
      {label && (
        <div style={{ fontSize: 10, color: T.textM, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>
          {label}
        </div>
      )}
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginTop: i > 0 ? 4 : 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color || p.fill || T.accent, flexShrink: 0 }} />
          <span style={{ fontWeight: 500, color: T.textP }}>
            {p.name && <span style={{ color: T.textS, fontWeight: 400, marginRight: 4 }}>{p.name}:</span>}
            {p.value}{suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, colorVar, sub }) {
  return (
    <div className="metric-card">
      <div className="metric-value" style={{ color: `var(${colorVar})` }}>{value}</div>
      <div className="metric-label">{label}</div>
      {sub && <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ── Chart card wrapper ────────────────────────────────────────────────────────
function ChartCard({ title, children, height = 220 }) {
  return (
    <div className="chart-card">
      <div className="chart-card-title">
        <span className="chart-title-bar" />
        <span className="chart-title-text">{title}</span>
      </div>
      <div style={{ height, width: "100%" }}>{children}</div>
    </div>
  );
}

// ── Inline legend ─────────────────────────────────────────────────────────────
function InlineLegend({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 14px", marginBottom: 12 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, flexShrink: 0, background: item.color }} />
          {item.label}
          {item.count !== undefined && (
            <span style={{ fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Syne', sans-serif" }}>{item.count}</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OptimizedAnalytics({ applications }) {
  const [timeFilter, setTimeFilter] = useState("7d");

  const tabs = [
    { key: "7d",  label: "7 days" },
    { key: "30d", label: "30 days" },
    { key: "all", label: "All time" },
  ];

  // Build stats
  const stats = useMemo(() => {
    if (!applications?.length) return null;
    const cutoff = timeFilter === "7d" ? 7 : timeFilter === "30d" ? 30 : null;
    const filtered = cutoff
      ? applications.filter(a => new Date(a.createdAt) >= new Date(Date.now() - cutoff * 86400000))
      : [...applications];

    const total = filtered.length;
    if (!total) return { total: 0 };

    const byStatus   = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
    const byWorkType = {};
    const byJobType  = {};
    const byPlatform = {};
    const dailyMap   = {};
    const weeklyMap  = {};

    filtered.forEach(app => {
      if (byStatus[app.status] !== undefined) byStatus[app.status]++;
      const wt = app.workType || "Other";
      byWorkType[wt] = (byWorkType[wt] || 0) + 1;
      const jt = app.jobType || "Job";
      byJobType[jt] = (byJobType[jt] || 0) + 1;
      const pl = app.platform || "Other";
      if (!byPlatform[pl]) byPlatform[pl] = { total: 0, success: 0 };
      byPlatform[pl].total++;
      if (app.status === "Interview" || app.status === "Offer") byPlatform[pl].success++;
      const dateKey = new Date(app.dateApplied || app.createdAt)
        .toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + 1;
      const d  = new Date(app.dateApplied || app.createdAt);
      const wk = `W${Math.ceil(d.getDate() / 7)} ${d.toLocaleDateString("en-IN", { month: "short" })}`;
      if (!weeklyMap[wk]) weeklyMap[wk] = { t: 0, s: 0 };
      weeklyMap[wk].t++;
      if (app.status === "Interview" || app.status === "Offer") weeklyMap[wk].s++;
    });

    const platformSuccess = Object.entries(byPlatform)
      .map(([name, d]) => ({ name, rate: Math.round((d.success / d.total) * 100), total: d.total }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 6);

    const dailyTrend     = Object.entries(dailyMap).slice(-14).map(([date, count]) => ({ date, count }));
    const weeklyResponse = Object.entries(weeklyMap).slice(-6).map(([week, d]) => ({
      week, rate: Math.round((d.s / d.t) * 100), apps: d.t,
    }));

    const workTypeData = Object.entries(byWorkType).map(([name, value]) => ({ name, value }));
    const jobTypeData  = Object.entries(byJobType).map(([name, value]) => ({ name, value }));
    const responseRate = Math.round(((byStatus.Interview + byStatus.Offer) / total) * 100);
    const offerRate    = Math.round((byStatus.Offer / total) * 100);

    return {
      total, byStatus, responseRate, offerRate,
      platformSuccess, dailyTrend, weeklyResponse,
      workTypeData, jobTypeData,
      bestPlatform: platformSuccess[0],
    };
  }, [applications, timeFilter]);

  // Resolve CSS-var colours at render time
  const T = getT();
  const STATUS_COLORS = Object.fromEntries(
    Object.entries(STATUS_COLORS_KEYS).map(([k, v]) => [k, cssVar(v)])
  );
  const PALETTE = PALETTE_KEYS.map(k => cssVar(k));
  const AXIS = {
    tick:     { fontSize: 11, fill: T.textM },
    axisLine: false,
    tickLine: false,
  };

  if (!stats) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📊</div>
        <h3>No data yet</h3>
        <p>Add applications to see your analytics</p>
      </div>
    );
  }

  const funnelData = [
    { name: "Applied",   value: stats.byStatus?.Applied   || 0 },
    { name: "Interview", value: stats.byStatus?.Interview || 0 },
    { name: "Offer",     value: stats.byStatus?.Offer     || 0 },
    { name: "Rejected",  value: stats.byStatus?.Rejected  || 0 },
  ].filter(d => d.value > 0);

  return (
    <div style={{ paddingBottom: 32 }}>
      <style>{`
        .recharts-surface:focus,.recharts-surface:focus-visible,
        .recharts-wrapper:focus,.recharts-wrapper:focus-visible,
        .recharts-sector:focus,.recharts-sector:focus-visible,
        .recharts-bar-rectangle:focus,.recharts-rectangle:focus,
        .recharts-pie-sector:focus,.recharts-layer:focus,
        svg:focus,g:focus,path:focus { outline:none!important; }
      `}</style>

      {/* Time filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTimeFilter(t.key)}
            className={`analytics-time-tab ${timeFilter === t.key ? "active" : "inactive"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Metric cards */}
      {stats.total > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 20 }}>
          <MetricCard label="Total Applied"  value={stats.total}                  colorVar="--accent" />
          <MetricCard label="Interviews"     value={stats.byStatus.Interview}      colorVar="--yellow" />
          <MetricCard label="Offers"         value={stats.byStatus.Offer}          colorVar="--green"  />
          <MetricCard label="Rejected"       value={stats.byStatus.Rejected}       colorVar="--red"    />
          <MetricCard label="Response Rate"  value={`${stats.responseRate}%`}      colorVar="--blue"   sub={`${stats.offerRate}% offer rate`} />
        </div>
      )}

      {stats.total === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No data in this period</h3>
          <p>Try switching to a wider time range</p>
        </div>
      )}

      {stats.total > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* 1 — Daily trend */}
          <ChartCard title="Daily Applications" height={200}>
            <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
              <BarChart data={stats.dailyTrend} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.border} />
                <XAxis dataKey="date" {...AXIS} />
                <YAxis {...AXIS} width={22} allowDecimals={false} />
                <Tooltip content={<CustomTooltip suffix=" apps" />} cursor={{ fill: T.accentDim }} />
                <Bar dataKey="count" fill={T.accent} fillOpacity={.9} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 2 — Funnel + Work type */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            <ChartCard title="Application Funnel" height={230}>
              <InlineLegend items={funnelData.map(d => ({ label: d.name, color: STATUS_COLORS[d.name] || T.accent, count: d.value }))} />
              <div style={{ height: 178 }}>
                <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
                  <PieChart>
                    <Pie data={funnelData} innerRadius="50%" outerRadius="75%" paddingAngle={4} dataKey="value" stroke="none">
                      {funnelData.map((entry, i) => <Cell key={i} fill={STATUS_COLORS[entry.name] || PALETTE[i % PALETTE.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Work Type" height={230}>
              <InlineLegend items={stats.workTypeData.map((d, i) => ({ label: d.name, color: PALETTE[i % PALETTE.length], count: d.value }))} />
              <div style={{ height: 178 }}>
                <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
                  <BarChart data={stats.workTypeData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.border} />
                    <XAxis dataKey="name" {...AXIS} />
                    <YAxis {...AXIS} width={22} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip suffix=" apps" />} cursor={{ fill: T.accentDim }} />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                      {stats.workTypeData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* 3 — Platform success */}
          <ChartCard title="Platform Success Rate" height={Math.max(200, stats.platformSuccess.length * 44 + 40)}>
            <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
              <BarChart data={stats.platformSuccess} layout="vertical" margin={{ left: 4, right: 28 }} barSize={18}>
                <XAxis type="number" {...AXIS} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" {...AXIS} width={96} />
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={T.border} />
                <Tooltip content={<CustomTooltip suffix="%" />} cursor={{ fill: T.accentDim }} />
                <Bar dataKey="rate" radius={[0, 5, 5, 0]}>
                  {stats.platformSuccess.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 4 — Weekly response + Job type */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            <ChartCard title="Weekly Response Rate" height={200}>
              <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
                <AreaChart data={stats.weeklyResponse}>
                  <defs>
                    <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={T.accent} stopOpacity={.22} />
                      <stop offset="100%" stopColor={T.accent} stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.border} />
                  <XAxis dataKey="week" {...AXIS} />
                  <YAxis {...AXIS} width={30} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip suffix="%" />} cursor={{ stroke: T.accent, strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="rate" stroke={T.accent} strokeWidth={2} fill="url(#accentGrad)"
                    dot={{ r: 3, fill: T.accent, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: T.accent, stroke: T.bgCard, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Job vs Internship" height={200}>
              <InlineLegend items={stats.jobTypeData.map((d, i) => ({ label: d.name, color: [T.accent, T.blue][i % 2], count: d.value }))} />
              <div style={{ height: 158 }}>
                <ResponsiveContainer width="100%" height="100%" tabIndex={-1}>
                  <BarChart data={stats.jobTypeData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.border} />
                    <XAxis dataKey="name" {...AXIS} />
                    <YAxis {...AXIS} width={22} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip suffix=" apps" />} cursor={{ fill: T.accentDim }} />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                      {stats.jobTypeData.map((_, i) => <Cell key={i} fill={[T.accent, T.blue][i % 2]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Insight strip */}
          <div className="analytics-insight">
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "var(--accent)", marginRight: 6 }}>💡 Insight</span>
            {stats.bestPlatform ? (
              <>
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{stats.bestPlatform.name}</span>
                {" "}is your top platform with a{" "}
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{stats.bestPlatform.rate}% response rate</span>.
                {" "}Focus your effort there this week. Overall response rate is{" "}
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{stats.responseRate}%</span>
                {" "}across {stats.total} application{stats.total !== 1 ? "s" : ""}.
              </>
            ) : (
              "Add more applications to unlock actionable insights."
            )}
          </div>

        </div>
      )}
    </div>
  );
}