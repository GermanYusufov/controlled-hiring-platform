// app/employer/applications/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/backend/utils/supabase/server";

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  submitted:    { label: "Submitted",    dot: "bg-zinc-400",   badge: "bg-zinc-100 text-zinc-600" },
  viewed:       { label: "Viewed",       dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-700" },
  shortlisted:  { label: "Shortlisted",  dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-700" },
  interview:    { label: "Interviewing", dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700" },
  rejected:     { label: "Rejected",     dot: "bg-red-400",    badge: "bg-red-50 text-red-600" },
  offer:        { label: "Offer",        dot: "bg-green-500",  badge: "bg-green-50 text-green-700" },
};

function formatDate(iso: string) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default async function EmployerApplicationsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  let applications: any[] = [];

  if (user) {
    const { data: company } = await supabase
      .from("CompanyProfile")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (company) {
      // Fetch all applications, enforcing that the JobPosting belongs to this company
      const { data, error } = await supabase
        .from("Application")
        .select(`
          id,
          status,
          created_at,
          job_id,
          job:JobPosting!inner(job_title, company_id),
          applicant:ApplicantProfile(name, target_role, resume_url)
        `)
        .eq("job.company_id", company.id)
        .order("created_at", { ascending: false });

      if (data) {
        applications = data;
      } else if (error) {
        console.error("Failed to fetch applications:", error);
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">All Applications</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Review all {applications.length} candidates across your active job postings.
          </p>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {applications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 bg-white">
              No one has applied to your jobs yet.
            </div>
          ) : (
            applications.map((app) => {
              // Ensure lowercase status matching
              const rawStatus = app.status?.toLowerCase() || 'submitted';
              const cfg = STATUS_CONFIG[rawStatus] || STATUS_CONFIG.submitted;

              return (
                <div
                  key={app.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700 uppercase">
                      {app.applicant?.name?.charAt(0) || "?"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-zinc-900">
                        {app.applicant?.name || "Unknown Applicant"}
                      </h3>
                      <p className="truncate text-sm text-zinc-500">
                        Applied for: <Link href={`/employer/jobs/${app.job_id}`} className="hover:underline font-medium text-zinc-700">{app.job?.job_title}</Link>
                      </p>
                      
                      {app.applicant?.resume_url && (
                        <a href={app.applicant.resume_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 inline-block">
                          View Resume Document
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {formatDate(app.created_at)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}