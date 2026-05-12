import Link from "next/link";
import { MOCK_JOBS } from "../data";
import type { ApplicationStatus } from "@/app/dashboard/data";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; dot: string; badge: string }
> = {
  submitted:    { label: "Submitted",    dot: "bg-zinc-400",   badge: "bg-zinc-100 text-zinc-600" },
  viewed:       { label: "Viewed",       dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-700" },
  shortlisted:  { label: "Shortlisted",  dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-700" },
  interviewing: { label: "Interviewing", dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700" },
  rejected:     { label: "Rejected",     dot: "bg-red-400",    badge: "bg-red-50 text-red-600" },
  offer:        { label: "Offer",        dot: "bg-green-500",  badge: "bg-green-50 text-green-700" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AllApplicationsPage() {
  const totalApplicants = MOCK_JOBS.reduce((sum, j) => sum + j.applicant_count, 0);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/employer/dashboard"
              className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">All Applications</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {totalApplicants} applicants across {MOCK_JOBS.length} job postings
            </p>
          </div>
        </div>

        {/* Jobs with their candidates */}
        <div className="space-y-10">
          {MOCK_JOBS.map((job) => {
            const sortedCandidates = [...job.candidates].sort((a, b) => {
              const order: ApplicationStatus[] = [
                "offer", "interviewing", "shortlisted", "viewed", "submitted", "rejected",
              ];
              return order.indexOf(a.status) - order.indexOf(b.status);
            });

            return (
              <section key={job.id}>
                {/* Job header */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900">{job.title}</h2>
                    <p className="text-sm text-zinc-500">
                      {job.location} · {job.employment_type} · {job.candidates.length} applicant{job.candidates.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Link
                    href={`/employer/jobs/${job.id}`}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
                  >
                    Manage candidates →
                  </Link>
                </div>

                {/* Candidate cards */}
                <div className="space-y-3">
                  {sortedCandidates.map((c) => {
                    const cfg = STATUS_CONFIG[c.status];
                    return (
                      <div
                        key={c.id}
                        className="rounded-2xl bg-white p-5 shadow-sm"
                      >
                        {/* Candidate header row */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700">
                              {c.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-zinc-900">{c.name}</p>
                              <p className="text-sm text-zinc-500">{c.email}</p>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.badge}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                            <span className="text-xs text-zinc-400">
                              Applied {formatDate(c.applied_at)}
                            </span>
                          </div>
                        </div>

                        {/* Target role */}
                        <p className="mt-3 text-sm text-zinc-600">
                          <span className="font-medium text-zinc-700">Applying for:</span>{" "}
                          {c.target_role}
                        </p>

                        {/* Skills */}
                        {c.skills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {c.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
                          <span className="text-xs text-zinc-400">
                            Status updated {formatDate(c.status_updated_at)}
                          </span>
                          <Link
                            href={`/employer/jobs/${job.id}`}
                            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                          >
                            Update status →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

      </div>
    </div>
  );
}
