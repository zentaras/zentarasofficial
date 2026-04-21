"use client";

import { useState } from "react";
import { useApplications } from "../../context/ApplicationsContext";
import ApplicationsTable from "../../Components/ApplicationsTab";
import AddJobModal from "../../Components/AddJobModal";

// ── Skeletons ─────────────────────────────────────────────────────────────────

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

function StatsSkeleton() {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            flex: "1 1 90px",
            minWidth: 80,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Skeleton width="55%" height={22} radius={4} />
          <Skeleton width="70%" height={10} radius={4} />
        </div>
      ))}
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
      <Skeleton width={220} height={34} radius={6} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} width={110} height={34} radius={6} />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div
      style={{
        borderRadius: 8,
        border: "1px solid var(--border)",
        overflow: "hidden",
        background: "var(--bg-card)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1.4fr 0.7fr 1fr 1fr 0.8fr 0.8fr 1fr 0.9fr 0.7fr",
          gap: 12,
          padding: "10px 14px",
          background: "var(--bg-hover)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {["50%","60%","40%","50%","45%","40%","45%","55%","50%","35%"].map((w, i) => (
          <Skeleton key={i} width={w} height={10} />
        ))}
      </div>

      {/* Rows */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1.4fr 0.7fr 1fr 1fr 0.8fr 0.8fr 1fr 0.9fr 0.7fr",
            gap: 12,
            padding: "13px 14px",
            borderBottom: i < 5 ? "1px solid var(--border)" : "none",
            alignItems: "center",
          }}
        >
          {/* Company cell — two lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <Skeleton width="65%" height={13} />
            <Skeleton width="40%" height={9} />
          </div>
          {/* Role */}
          <Skeleton width="70%" height={12} />
          {/* Type badge */}
          <Skeleton width="100%" height={20} radius={20} />
          {/* Platform */}
          <Skeleton width="60%" height={12} />
          {/* Applied */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <Skeleton width="55%" height={11} />
            <Skeleton width="40%" height={9} />
          </div>
          {/* Response */}
          <Skeleton width="50%" height={11} />
          {/* Priority badge */}
          <Skeleton width="65%" height={20} radius={20} />
          {/* Next action */}
          <Skeleton width="70%" height={11} />
          {/* Status select */}
          <Skeleton width="100%" height={24} radius={20} />
          {/* Actions */}
          <div style={{ display: "flex", gap: 5 }}>
            <Skeleton width={36} height={26} radius={5} />
            <Skeleton width={26} height={26} radius={5} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ApplicationsPageSkeleton() {
  return (
    <div>
      <Shimmer />
      <StatsSkeleton />
      <FiltersSkeleton />
      <Skeleton width={80} height={11} style={{ marginBottom: 10 }} />
      <TableSkeleton />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ApplicationsPage() {
  const {
    applications,
    loading,
    addApplication,
    updateApplication,
    deleteApplication,
  } = useApplications();

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">
            {loading
              ? "Loading..."
              : `${applications.length} total application${applications.length !== 1 ? "s" : ""} tracked`}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingJob(null);
            setShowModal(true);
          }}
        >
          <span>+</span> Add Application
        </button>
      </div>

      {loading ? (
        <ApplicationsPageSkeleton />
      ) : (
        <ApplicationsTable
          applications={applications}
          onUpdate={updateApplication}
          onDelete={deleteApplication}
          onEdit={(job) => {
            setEditingJob(job);
            setShowModal(true);
          }}
        />
      )}

      {showModal && (
        <AddJobModal
          onClose={() => {
            setShowModal(false);
            setEditingJob(null);
          }}
          onSave={(job) => {
            editingJob
              ? updateApplication(editingJob.id, job)
              : addApplication(job);
            setShowModal(false);
            setEditingJob(null);
          }}
          initialData={editingJob}
        />
      )}
    </>
  );
}