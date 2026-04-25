import { notFound } from "next/navigation";
import { getJob } from "@/app/employer/data";
import type { ApplicationStatus } from "@/app/dashboard/data";
import CandidateList from "./CandidateList";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; dot: string }> = {
  submitted:    { label: "Submitted",    dot: "bg-zinc-400" },
  viewed:       { label: "Viewed",       dot: "bg-blue-400" },
  shortlisted:  { label: "Shortlisted",  dot: "bg-amber-400" },
  interviewing: { label: "Interviewing", dot: "bg-purple-400" },
  rejected:     { label: "Rejected",     dot: "bg-red-400" },
  offer:        { label: "Offer",        dot: "bg-green-500" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) notFound();

  // Status summary counts
  const statusCounts = job.candidates.reduce<Partial<Record<ApplicationStatus, number>>>(
    (acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const summaryStatuses: ApplicationStatus[] = [
    "submitted", "viewed", "shortlisted", "interviewing", "offer", "rejected",
  ].filter((s) => statusCounts[s as ApplicationStatus]) as ApplicationStatus[];

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <a
          href="/employer/jobs"
          className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          ← All jobs
        </a>

        {/* Job header */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-zinc-900">{job.title}</h1>
              <p className="mt-1 text-sm text-zinc-500">
                {job.location} · {job.employment_type}
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">
                Posted {formatDate(job.posted_at)}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
              {job.applicant_count} applicant{job.applicant_count !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Status summary */}
          {summaryStatuses.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-100 pt-4">
              {summaryStatuses.map((s) => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {statusCounts[s]} {cfg.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Candidates heading */}
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Candidates
        </h2>

        {/* Interactive candidate list */}
        <CandidateList candidates={job.candidates} />
      </div>
    </div>
  );
}
