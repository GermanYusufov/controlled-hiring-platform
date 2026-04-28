import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getApplications, type Application, type ApplicationStatus } from "./data";

// ── Status config ─────────────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.submitted;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Summary strip ─────────────────────────────────────────────────────────────
function SummaryStrip({ applications }: { applications: Application[] }) {
  const total = applications.length;
  const active = applications.filter((a) => !["rejected", "offer"].includes(a.status)).length;
  const shortlisted = applications.filter((a) => a.status === "shortlisted").length;
  const offers = applications.filter((a) => a.status === "offer").length;

  const stats = [
    { label: "Total applied", value: total },
    { label: "Active", value: active },
    { label: "Shortlisted", value: shortlisted },
    { label: "Offers", value: offers },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl bg-white px-4 py-3 shadow-sm text-center">
          <p className="text-2xl font-bold text-zinc-900">{s.value}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ── Application row ───────────────────────────────────────────────────────────
function ApplicationRow({ app }: { app: Application }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4 last:border-0 hover:bg-zinc-50 transition-colors">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-zinc-900">{app.job_title}</p>
        <p className="mt-0.5 truncate text-sm text-zinc-500">
          {app.company_name}
          {app.location ? ` · ${app.location}` : ""}
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Applied {formatDate(app.applied_at)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <StatusBadge status={app.status} />
        <p className="text-xs text-zinc-400">
          Updated {relativeTime(app.status_updated_at)}
        </p>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-2xl">
        📋
      </div>
      <h3 className="font-semibold text-zinc-900">No applications yet</h3>
      <p className="mt-1 max-w-xs text-sm text-zinc-500">
        Once you apply for roles, they&apos;ll appear here with live status updates.
      </p>
      <a href="/jobs" className="mt-6 rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors">
        Browse open roles
      </a>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  // --- 1. GATEKEEPER START ---
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // Boot them to signup if not logged in
  if (userError || !user) {
    redirect('/signup');
  }

  // Check for profiles
  const { data: applicantProfile } = await supabase
    .from('ApplicantProfile')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  const { data: companyProfile } = await supabase
    .from('CompanyProfile')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  // If they have neither, force them to pick a role
  if (!applicantProfile && !companyProfile) {
    redirect('/profile')
  }
  // --- GATEKEEPER END ---

  // --- 2. FETCH DATA ---
  // Note: Once German hooks this up to Supabase, you'll pass the `user.id` or `applicantProfile.id` into this function!
  const applications = await getApplications();

  const statusOrder: ApplicationStatus[] = [
    "offer",
    "interviewing",
    "shortlisted",
    "viewed",
    "submitted",
    "rejected",
  ];

  // Group by status for the filter tabs
  const groups = statusOrder.filter((s) =>
    applications.some((a) => a.status === s),
  );

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              My applications
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Track every role you&apos;ve applied for.
            </p>
          </div>
          <a
            href="/profile"
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Edit profile
          </a>
        </div>

        {/* Summary */}
        {applications.length > 0 && (
          <div className="mb-6">
            <SummaryStrip applications={applications} />
          </div>
        )}

        {/* Application list */}
        {applications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-6">
            {/* All applications card */}
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                <h2 className="font-semibold text-zinc-900">All applications</h2>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                  {applications.length}
                </span>
              </div>
              {applications.map((app) => (
                <ApplicationRow key={app.id} app={app} />
              ))}
            </div>

            {/* By status */}
            {groups.length > 1 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
                  By status
                </h2>
                {groups.map((status) => {
                  const grouped = applications.filter(
                    (a) => a.status === status,
                  );
                  const cfg = STATUS_CONFIG[status];
                  return (
                    <div
                      key={status}
                      className="rounded-2xl bg-white shadow-sm overflow-hidden"
                    >
                      <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-3">
                        <span
                          className={`h-2 w-2 rounded-full ${cfg.dot}`}
                        />
                        <h3 className="text-sm font-semibold text-zinc-900">
                          {cfg.label}
                        </h3>
                        <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                          {grouped.length}
                        </span>
                      </div>
                      {grouped.map((app) => (
                        <ApplicationRow key={app.id} app={app} />
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}