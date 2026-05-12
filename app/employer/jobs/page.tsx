// app/employer/jobs/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/backend/utils/supabase/server";

function formatDate(iso: string) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function EmployerJobsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();

  let jobs: any[] = [];
  let totalApplicants = 0;

  if (user) {
    // 1. Get the employer's company profile
    const { data: company } = await supabase
      .from("CompanyProfile")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (company) {
      // 2. Fetch their jobs and simultaneously count the applications on each job
      const { data, error } = await supabase
        .from("JobPosting")
        .select(`
          *,
          applications:Application(id)
        `)
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      if (data) {
        jobs = data.map((job: any) => ({
          ...job,
          applicant_count: job.applications?.length || 0
        }));
        totalApplicants = jobs.reduce((sum, j) => sum + j.applicant_count, 0);
      }
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/employer/dashboard"
            className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Manage Job Postings
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {jobs.length} open roles · {totalApplicants} total applicants
            </p>
          </div>
          <Link
            href="/employer/jobs/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            + Post a role
          </Link>
        </div>

        {/* Job cards */}
        <div className="flex flex-col gap-4">
          {jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 bg-white">
              No jobs posted yet. Click "+ Post a role" to get started.
            </div>
          ) : (
            jobs.map((job) => (
              <Link
                key={job.id}
                href={`/employer/jobs/${job.id}`}
                className="block rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-zinc-900">{job.job_title}</h2>
                    <p className="mt-0.5 text-sm text-zinc-500">
                      {job.job_location || "Location not specified"} · {job.job_type || "Type not specified"}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      Posted {formatDate(job.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
                    {job.applicant_count} / {job.application_limit} applicant{job.applicant_count !== 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}