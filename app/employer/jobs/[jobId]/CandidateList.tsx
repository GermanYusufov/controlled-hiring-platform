"use client";

import { useState, useTransition } from "react";
import { updateCandidateStatus } from "./actions";
import type { ApplicationStatus } from "@/app/dashboard/data";
import type { Candidate } from "@/app/employer/data";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; dot: string; badge: string; ring: string }
> = {
  submitted:   { label: "Submitted",   dot: "bg-zinc-400",   badge: "bg-zinc-100 text-zinc-600",   ring: "ring-zinc-300" },
  viewed:      { label: "Viewed",      dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-700",    ring: "ring-blue-300" },
  shortlisted: { label: "Shortlisted", dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-700",  ring: "ring-amber-300" },
  interviewing:{ label: "Interviewing",dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700",ring: "ring-purple-300" },
  rejected:    { label: "Rejected",    dot: "bg-red-400",    badge: "bg-red-50 text-red-600",      ring: "ring-red-300" },
  offer:       { label: "Offer",       dot: "bg-green-500",  badge: "bg-green-50 text-green-700",  ring: "ring-green-300" },
};

const STATUS_FLOW: ApplicationStatus[] = [
  "submitted",
  "viewed",
  "shortlisted",
  "interviewing",
  "offer",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const [status, setStatus] = useState<ApplicationStatus>(candidate.status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);

  function handleStatusChange(newStatus: ApplicationStatus) {
    if (newStatus === status || isPending) return;
    setError(null);
    startTransition(async () => {
      const result = await updateCandidateStatus(candidate.id, newStatus);
      if (result.error) {
        setError(result.error);
      } else {
        setStatus(newStatus);
      }
    });
  }

  const cfg = STATUS_CONFIG[status];

  return (
    <div
      className={`rounded-2xl border-2 bg-white transition-all ${
        isPending ? "opacity-60" : "opacity-100"
      } ${cfg.ring}`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">
              {candidate.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-zinc-900">{candidate.name}</p>
              <p className="truncate text-xs text-zinc-500">{candidate.email}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-zinc-600">{candidate.target_role}</p>
          <p className="mt-0.5 text-xs text-zinc-400">Applied {formatDate(candidate.applied_at)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusBadge status={status} />
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            {expanded ? "Hide controls ▲" : "Show controls ▼"}
          </button>
        </div>
      </div>

      {/* Skills */}
      {candidate.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-zinc-100 px-5 py-3">
          {candidate.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Interactive controls */}
      {expanded && (
        <div className="border-t border-zinc-100 px-5 py-4">
          <p className="mb-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">
            Update status
          </p>

          {/* Pipeline stepper */}
          <div className="mb-4 flex items-center gap-1">
            {STATUS_FLOW.map((s, i) => {
              const stepCfg = STATUS_CONFIG[s];
              const isActive = s === status;
              const isPast =
                STATUS_FLOW.indexOf(status) > i && status !== "rejected";
              return (
                <div key={s} className="flex flex-1 items-center">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange(s)}
                    className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${
                      isActive
                        ? `${stepCfg.badge} border-transparent`
                        : isPast
                        ? "border-zinc-200 bg-zinc-50 text-zinc-400"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50"
                    }`}
                    aria-pressed={isActive}
                  >
                    {stepCfg.label}
                  </button>
                  {i < STATUS_FLOW.length - 1 && (
                    <span className="mx-1 text-zinc-300">›</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isPending || status === "rejected"}
              onClick={() => handleStatusChange("rejected")}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              Reject
            </button>
            <button
              type="button"
              disabled={isPending || status === "offer"}
              onClick={() => handleStatusChange("offer")}
              className="rounded-lg border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 transition-colors disabled:opacity-40"
            >
              Make offer
            </button>
          </div>

          {isPending && (
            <p className="mt-2 text-xs text-zinc-400">Saving…</p>
          )}
          {error && (
            <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function CandidateList({ candidates }: { candidates: Candidate[] }) {
  const statusOrder: ApplicationStatus[] = [
    "offer",
    "interviewing",
    "shortlisted",
    "viewed",
    "submitted",
    "rejected",
  ];

  const sorted = [...candidates].sort(
    (a, b) =>
      statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
  );

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((c) => (
        <CandidateCard key={c.id} candidate={c} />
      ))}
    </div>
  );
}
