import Link from "next/link";
import { MOCK_JOBS } from "../data";
import type { ApplicationStatus } from "@/app/dashboard/data";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; dot: string; badge: string }> = {
  submitted:    { label: "Submitted",    dot: "bg-zinc-400",   badge: "bg-zinc-100 text-zinc-600" },
  viewed:       { label: "Viewed",       dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-700" },
  shortlisted:  { label: "Shortlisted",  dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-700" },
  interviewing: { label: "Interviewing", dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700" },
  rejected:     { label: "Rejected",     dot: "bg-red-400",    badge: "bg-red-50 text-red-600" },
  offer:        { label: "Offer",        dot: "bg-green-500",  badge: "bg-green-50 text-green-700" },
};

const PIPELINE_STATUSES: ApplicationStatus[] = [
  "submitted", "viewed", "shortlisted", "interviewing", "offer", "rejected",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EmployerDashboardPage() {
  const totalApplicants = MOCK_JOBS.reduce((sum, j) => sum + j.applicant_count, 0);
  const pendingReview = MOCK_JOBS.reduce(
    (sum, j) => sum + j.candidates.filter((c) => c.status === "submitted").length,
    0,
  );

  const recentCandidates = MOCK_JOBS
    .flatMap((job) =>
      job.candidates.map((c) => ({ ...c, jobTitle: job.title, jobId: job.id })),
    )
    .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Employer Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">Welcome back</p>
          </div>
          <Link
            href="/employer/jobs"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            + Post a role
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-zinc-500">Active Jobs</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{MOCK_JOBS.length}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-zinc-500">Total Applicants</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{totalApplicants}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-zinc-500">Pending Review</p>
            <p className="mt-1 text-3xl font-bold text-amber-600">{pendingReview}</p>
          </div>
        </div>

        {/* Pipeline breakdown */}
        <div className="mb-8 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {PIPELINE_STATUSES.map((s) => {
            const count = MOCK_JOBS.reduce(
              (sum, j) => sum + j.candidates.filter((c) => c.status === s).length,
              0,
            );
            const cfg = STATUS_CONFIG[s];
            return (
              <div key={s} className="rounded-lg bg-white p-3 shadow-sm text-center">
                <span className={`inline-block mb-1 h-2 w-2 rounded-full ${cfg.dot}`} />
                <p className="text-xs text-zinc-500">{cfg.label}</p>
                <p className="text-xl font-bold text-zinc-900">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Navigation cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/employer/jobs"
            className="group flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-zinc-900 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">&#x1F4BC;</span>
              <span className="text-xs text-zinc-400 group-hover:text-zinc-700 transition-colors">
                {MOCK_JOBS.length} open roles &#x2192;
              </span>
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">Manage Job Postings</h2>
            <p className="text-sm text-zinc-500">
              View, edit, and create job listings. See how many applicants each role has.
            </p>
          </Link>

          <Link
            href="/employer/applications"
            className="group flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-zinc-900 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">&#x1F4CB;</span>
              <span className="text-xs text-zinc-400 group-hover:text-zinc-700 transition-colors">
                {totalApplicants} applicants &#x2192;
              </span>
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">All Applications</h2>
            <p className="text-sm text-zinc-500">
              Browse every resume and application across all your job postings in one place.
            </p>
          </Link>
        </div>

        {/* Recent applications */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900">Recent Applications</h2>
            <Link
              href="/employer/applications"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              View all &#x2192;
            </Link>
          </div>
          <div className="space-y-3">
            {recentCandidates.map((c) => {
              const cfg = STATUS_CONFIG[c.status];
              return (
                <Link
                  key={c.id}
                  href={`/employer/jobs/${c.jobId}`}
                  className="flex items-center justify-between gap-4 rounded-xl bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">
                      {c.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-zinc-900">{c.name}</p>
                      <p className="truncate text-xs text-zinc-500">{c.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                    <span className="text-xs text-zinc-400">{formatDate(c.applied_at)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
