import { MOCK_JOBS } from "../data";
import type { ApplicationStatus } from "@/app/dashboard/data";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; dot: string; badge: string }
> = {
  submitted: { label: "Submitted", dot: "bg-zinc-400", badge: "bg-zinc-100 text-zinc-600" },
  viewed: { label: "Viewed", dot: "bg-blue-400", badge: "bg-blue-50 text-blue-700" },
  shortlisted: { label: "Shortlisted", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700" },
  interviewing: { label: "Interviewing", dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700" },
  rejected: { label: "Rejected", dot: "bg-red-400", badge: "bg-red-50 text-red-600" },
  offer: { label: "Offer", dot: "bg-green-500", badge: "bg-green-50 text-green-700" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EmployerJobsPage() {
  const totalApplicants = MOCK_JOBS.reduce((sum, j) => sum + j.applicant_count, 0);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Job listings
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {MOCK_JOBS.length} open roles · {totalApplicants} total applicants
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            + Post a role
          </button>
        </div>

        {/* Job cards */}
        <div className="flex flex-col gap-4">
          {MOCK_JOBS.map((job) => {
            // Count candidates per status
            const statusCounts = job.candidates.reduce<
              Partial<Record<ApplicationStatus, number>>
            >((acc, c) => {
              acc[c.status] = (acc[c.status] ?? 0) + 1;
              return acc;
            }, {});

            const visibleStatuses: ApplicationStatus[] = [
              "offer",
              "interviewing",
              "shortlisted",
              "viewed",
              "submitted",
              "rejected",
            ].filter((s) => statusCounts[s as ApplicationStatus]) as ApplicationStatus[];

            return (
              <a
                key={job.id}
                href={`/employer/jobs/${job.id}`}
                className="block rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-zinc-900">{job.title}</h2>
                    <p className="mt-0.5 text-sm text-zinc-500">
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

                {/* Status breakdown pills */}
                {visibleStatuses.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {visibleStatuses.map((s) => {
                      const cfg = STATUS_CONFIG[s];
                      return (
                        <span
                          key={s}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {statusCounts[s]} {cfg.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
