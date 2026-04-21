"use client";

import { useMemo, useState } from "react";

const STATUS_COLORS = {
  Applied: "#3b82f6",
  Interview: "#eab308",
  Offer: "#22c55e",
  Rejected: "#ef4444",
};

function getStreakData(applications) {
  if (!applications.length)
    return { streak: 0, appliedToday: 0, missedYesterday: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dateSet = new Set();
  applications.forEach((a) => {
    const d = new Date(a.dateApplied || a.createdAt);
    d.setHours(0, 0, 0, 0);
    dateSet.add(d.getTime());
  });

  const appliedToday = applications.filter((a) => {
    const d = new Date(a.dateApplied || a.createdAt);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  }).length;

  const missedYesterday =
    !dateSet.has(yesterday.getTime()) && appliedToday === 0;

  let streak = 0;
  let cursor = new Date(today);
  while (dateSet.has(cursor.getTime())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  if (streak === 0 && dateSet.has(yesterday.getTime())) {
    cursor = new Date(yesterday);
    while (dateSet.has(cursor.getTime())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  return { streak, appliedToday, missedYesterday };
}

function fmtResponseDays(d) {
  if (d === null || d === undefined) return "—";
  if (d === 0) return "< 1 day";
  return `${d}d`;
}

// ── Skeleton primitives ───────────────────────────────────────────────────────

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
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// ── Skeleton screens ──────────────────────────────────────────────────────────

function StreakSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 12,
        marginBottom: 20,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="card">
          <Skeleton width="55%" height={11} style={{ marginBottom: 10 }} />
          <Skeleton width="40%" height={30} style={{ marginBottom: 10 }} />
          <Skeleton width="80%" height={11} />
        </div>
      ))}
    </div>
  );
}

function TwoColSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        marginBottom: 20,
      }}
    >
      {[0, 1].map((i) => (
        <div key={i} className="card">
          <Skeleton width="50%" height={11} style={{ marginBottom: 16 }} />
          {[0, 1, 2, 3].map((j) => (
            <div key={j} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Skeleton width="35%" height={11} />
                <Skeleton width="20%" height={11} />
              </div>
              <Skeleton width="100%" height={6} radius={20} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <Skeleton width="40%" height={11} style={{ marginBottom: 18 }} />
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 0,
            bottom: 0,
            width: 1,
            background: "var(--border)",
          }}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{ display: "flex", gap: 16, paddingBottom: 16 }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "var(--bg-hover)",
                flexShrink: 0,
                marginTop: 2,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Skeleton width="30%" height={12} />
                <Skeleton width="15%" height={10} />
              </div>
              <Skeleton width="55%" height={10} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Skeleton width="35%" height={11} />
        <Skeleton width={60} height={28} radius={6} />
      </div>
      <div
        className="table-wrapper"
        style={{ border: "none", overflow: "hidden" }}
      >
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1fr",
            gap: 12,
            padding: "10px 14px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-hover)",
          }}
        >
          {["40%", "55%", "50%", "45%", "35%"].map((w, i) => (
            <Skeleton key={i} width={w} height={10} />
          ))}
        </div>
        {/* Data rows */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1fr",
              gap: 12,
              padding: "13px 14px",
              borderBottom: i < 4 ? "1px solid var(--border)" : "none",
            }}
          >
            {["60%", "75%", "55%", "45%", "50%"].map((w, j) => (
              <Skeleton key={j} width={w} height={12} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <StreakSkeleton />
      <TwoColSkeleton />
      <TimelineSkeleton />
      <TableSkeleton />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StreakCard({ applications }) {
  const DAILY_TARGET = 5;
  const { streak, appliedToday, missedYesterday } = useMemo(
    () => getStreakData(applications),
    [applications],
  );
  const progress = Math.min((appliedToday / DAILY_TARGET) * 100, 100);
  const remaining = Math.max(DAILY_TARGET - appliedToday, 0);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 12,
        marginBottom: 20,
      }}
    >
      {/* Streak */}
      <div
        className="card"
        style={{
          borderColor: streak >= 3 ? "rgba(234,179,8,0.3)" : "var(--border)",
          background:
            streak >= 3 ? "rgba(234,179,8,0.04)" : "var(--bg-card)",
        }}
      >
        <div className="stat-label">Apply Streak</div>
        <div
          className="stat-value"
          style={{
            color:
              streak >= 3
                ? "var(--yellow)"
                : streak > 0
                  ? "var(--text-primary)"
                  : "var(--text-muted)",
            fontSize: 30,
          }}
        >
          {streak}
          <span style={{ fontSize: 14, fontWeight: 500, marginLeft: 4 }}>
            days
          </span>
        </div>
        <div className="stat-sub">
          {missedYesterday
            ? "Streak broken — start again today"
            : streak >= 3
              ? "Keep it going"
              : streak > 0
                ? "Building momentum"
                : "No active streak"}
        </div>
      </div>

      {/* Daily target */}
      <div className="card">
        <div className="stat-label">Today's Target</div>
        <div
          className="stat-value"
          style={{
            color: progress >= 100 ? "var(--green)" : "var(--text-primary)",
            fontSize: 30,
          }}
        >
          {appliedToday}
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-muted)",
              marginLeft: 2,
            }}
          >
            / {DAILY_TARGET}
          </span>
        </div>
        <div style={{ marginTop: 8 }}>
          <div className="progress-bar-wrap" style={{ height: 5 }}>
            <div
              className="progress-bar"
              style={{
                width: `${progress}%`,
                background: progress >= 100 ? "var(--green)" : "var(--accent)",
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <div className="stat-sub" style={{ marginTop: 6 }}>
            {progress >= 100
              ? "Daily goal hit"
              : `${remaining} more to hit goal`}
          </div>
        </div>
      </div>

      {/* Status Check */}
      <div
        className="card"
        style={{
          borderColor: missedYesterday
            ? "rgba(239,68,68,0.3)"
            : "var(--border)",
          background: missedYesterday
            ? "rgba(239,68,68,0.04)"
            : "var(--bg-card)",
        }}
      >
        <div className="stat-label">Status Check</div>
        <div
          style={{
            fontSize: 13,
            color: missedYesterday
              ? "var(--red)"
              : appliedToday >= DAILY_TARGET
                ? "var(--green)"
                : "var(--text-secondary)",
            fontWeight: 600,
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          {missedYesterday
            ? "You fell behind. Top candidates apply 10+ jobs daily. Catch up today."
            : appliedToday >= DAILY_TARGET
              ? "On track. Maintain consistency — most offers come from volume."
              : appliedToday > 0
                ? `${appliedToday} done today. Strong candidates don't stop here.`
                : "No applications today yet. The market doesn't wait."}
        </div>
      </div>
    </div>
  );
}

function TimelineList({ events, cardBg }) {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: 7,
          top: 0,
          bottom: 0,
          width: 1,
          background: "var(--border)",
        }}
      />
      {events.map((ev, i) => (
        <div
          key={ev.id}
          style={{
            display: "flex",
            gap: 16,
            paddingBottom: i < events.length - 1 ? 16 : 0,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: STATUS_COLORS[ev.status] || "var(--border-light)",
              flexShrink: 0,
              marginTop: 2,
              border: `2px solid ${cardBg || "var(--bg-card)"}`,
              zIndex: 1,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                }}
              >
                {ev.company}
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                {ev.date.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}
              </span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 1,
              }}
            >
              {ev.role} —{" "}
              <span
                style={{ color: STATUS_COLORS[ev.status], fontWeight: 600 }}
              >
                {ev.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineModal({ events, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: 14,
          width: "100%",
          maxWidth: 480,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 22px 14px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Full Activity Timeline
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 2,
              }}
            >
              {events.length} event{events.length !== 1 ? "s" : ""}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text-muted)",
              fontSize: 16,
              cursor: "pointer",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-light)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ overflowY: "auto", padding: "18px 22px 22px", flex: 1 }}>
          <TimelineList events={events} cardBg="var(--bg-card)" />
        </div>
      </div>
    </div>
  );
}

function ActivityTimeline({ applications }) {
  const [modalOpen, setModalOpen] = useState(false);
  const PREVIEW_COUNT = 5;

  const allEvents = useMemo(() => {
    const list = [];
    applications.forEach((app) => {
      if (app.statusHistory && app.statusHistory.length > 0) {
        app.statusHistory.forEach((h, idx) => {
          list.push({
            date: new Date(h.date),
            company: app.company,
            role: app.role,
            status: h.status,
            id: `${app.id}-${h.status}-${idx}`,
          });
        });
      } else {
        list.push({
          date: new Date(app.createdAt),
          company: app.company,
          role: app.role,
          status: "Applied",
          id: `${app.id}-applied`,
        });
      }
    });
    return list.sort((a, b) => b.date - a.date);
  }, [applications]);

  const preview = allEvents.slice(0, PREVIEW_COUNT);
  const remaining = allEvents.length - PREVIEW_COUNT;

  if (!allEvents.length) return null;

  return (
    <>
      <div className="card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div className="card-title" style={{ marginBottom: 0 }}>
            Activity Timeline
          </div>
        </div>
        <TimelineList events={preview} cardBg="var(--bg-card)" />
        {remaining > 0 && (
          <button
            onClick={() => setModalOpen(true)}
            style={{
              marginTop: 14,
              width: "100%",
              padding: "9px",
              borderRadius: "var(--radius-sm)",
              border: "1px dashed var(--border-light)",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-border)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-light)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            + {remaining} more event{remaining !== 1 ? "s" : ""} — click to
            view all
          </button>
        )}
      </div>
      {modalOpen && (
        <TimelineModal
          events={allEvents}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Dashboard({
  applications,
  onAddClick,
  onUpdateStatus,
  setActiveTab,
  isLoading = false,        // ← pass this prop from parent while DB is fetching
}) {
  const stats = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter(
      (a) => a.status === "Interview",
    ).length;
    const offers = applications.filter((a) => a.status === "Offer").length;
    const rejected = applications.filter(
      (a) => a.status === "Rejected",
    ).length;
    const applied = applications.filter((a) => a.status === "Applied").length;
    const callbackRate =
      total > 0 ? (((interviews + offers) / total) * 100).toFixed(1) : 0;

    let totalDays = 0,
      responseCount = 0;
    applications.forEach((app) => {
      if (app.statusHistory && app.statusHistory.length > 1) {
        const first = new Date(app.statusHistory[0].date);
        const second = new Date(app.statusHistory[1].date);
        const days = Math.round((second - first) / (1000 * 60 * 60 * 24));
        if (days >= 0) {
          totalDays += days;
          responseCount++;
        }
      }
    });
    const avgResponseDays =
      responseCount > 0 ? Math.round(totalDays / responseCount) : null;

    const platformMap = {};
    applications.forEach((app) => {
      if (!app.platform) return;
      if (!platformMap[app.platform])
        platformMap[app.platform] = { total: 0, interviews: 0, offers: 0 };
      platformMap[app.platform].total++;
      if (app.status === "Interview") platformMap[app.platform].interviews++;
      if (app.status === "Offer") platformMap[app.platform].offers++;
    });

    const platformStats = Object.entries(platformMap)
      .map(([name, data]) => ({
        name,
        total: data.total,
        responses: data.interviews + data.offers,
        rate:
          data.total > 0
            ? (((data.interviews + data.offers) / data.total) * 100).toFixed(0)
            : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);

    return {
      total,
      interviews,
      offers,
      rejected,
      applied,
      callbackRate,
      avgResponseDays,
      platformStats,
    };
  }, [applications]);

  const recentApps = applications
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ── Loading state ───────────────────────────────────────────────────────────
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (applications.length === 0) {
    return (
      <div>
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <h3>No applications yet</h3>
          <p>
            Start tracking your job search by adding your first application
          </p>
          <button
            className="btn-primary"
            style={{ margin: "16px auto 0", display: "inline-flex" }}
            onClick={onAddClick}
          >
            <span>+</span> Add Your First Application
          </button>
        </div>
      </div>
    );
  }

  // ── Loaded state ────────────────────────────────────────────────────────────
  return (
    <div>
      <StreakCard applications={applications} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Status breakdown */}
        <div className="card">
          <div className="card-title">Status Breakdown</div>
          {["Applied", "Interview", "Offer", "Rejected"].map((status) => {
            const count = applications.filter(
              (a) => a.status === status,
            ).length;
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={status} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    {status}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {count} &middot; {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${pct}%`,
                      background: STATUS_COLORS[status],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Platform performance */}
        <div className="card">
          <div className="card-title">Platform Performance</div>
          {stats.platformStats.length === 0 ? (
            <div
              style={{
                color: "var(--text-muted)",
                fontSize: 12,
                paddingTop: 8,
              }}
            >
              No platform data yet.
            </div>
          ) : (
            stats.platformStats.map((p) => (
              <div key={p.name} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    {p.name}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {p.rate}% ({p.responses}/{p.total})
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.max(p.rate, 2)}%`,
                      background: "var(--accent)",
                    }}
                  />
                </div>
              </div>
            ))
          )}

          {stats.avgResponseDays !== null && (
            <div
              style={{
                marginTop: 16,
                paddingTop: 14,
                borderTop: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Avg Response Time
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  fontFamily: "'Syne', sans-serif",
                  color: "var(--yellow)",
                }}
              >
                {fmtResponseDays(stats.avgResponseDays)}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                Callback ratio: {stats.callbackRate}%
              </div>
            </div>
          )}
        </div>
      </div>

      <ActivityTimeline applications={applications} />

      {/* Recent Applications */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div className="card-title" style={{ marginBottom: 0 }}>
            Recent Applications
          </div>
          <button
            className="btn-ghost"
            style={{ fontSize: 11 }}
            onClick={() => setActiveTab("applications")}
          >
            View all
          </button>
        </div>
        {recentApps.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
            No recent applications.
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: "none" }}>
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Platform</th>
                  <th>Applied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app.id}>
                    <td className="company-cell">{app.company}</td>
                    <td>{app.role}</td>
                    <td>{app.platform || "—"}</td>
                    <td>
                      {app.dateApplied
                        ? new Date(app.dateApplied).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short" },
                          )
                        : "—"}
                    </td>
                    <td>
                      <span
                        className={`badge badge-${app.status.toLowerCase()}`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}