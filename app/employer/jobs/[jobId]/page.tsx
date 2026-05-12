// app/employer/jobs/[jobId]/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/backend/utils/supabase/server";
import { redirect } from "next/navigation";
import JobManager from "./JobManager";

export default async function JobDetailsPage({ params }: { params: { jobId: string } }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  // Await the params to get the jobId securely
  const resolvedParams = await params;
  const jobId = resolvedParams.jobId;

  // 1. Fetch the Job
  const { data: job, error: jobError } = await supabase
    .from("JobPosting")
    .select("*")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    redirect("/employer/jobs");
  }

  // 2. Fetch the applicants for this job
  const { data: applicants } = await supabase
    .from("Application")
    .select(`
      id,
      status,
      created_at,
      applicant:ApplicantProfile (
        name,
        target_role,
        resume_url
      )
    `)
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link
            href="/employer/jobs"
            className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            ← Back to all jobs
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {job.job_title}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {job.job_location || "Remote"} · {job.job_type || "Full-time"} · Posted {new Date(job.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Client Component passing the real DB data */}
        <JobManager job={job} applicants={applicants || []} />
        
      </div>
    </div>
  );
}