// app/dashboard/page.tsx
import { createClient } from '@/backend/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getApplications, type Application, type ApplicationStatus } from "./data";
import { signOut } from "@/app/auth/actions"; 
import ApplicationRow from "./ApplicationRow"; // <-- IMPORT THE NEW CLIENT COMPONENT

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
      <a href="/discovery" className="mt-6 rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors">
        Browse open roles
      </a>
    </div>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) redirect('/login');

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

  if (!applicantProfile) {
    if (companyProfile) {
      redirect('/employer/dashboard');
    } else {
      redirect('/onboarding');
    }
  }

  const applications = await getApplications(applicantProfile.id);

  const statusOrder: ApplicationStatus[] = [
    "offer", "interviewing", "shortlisted", "viewed", "submitted", "rejected",
  ];

  const groups = statusOrder.filter((s) => applications.some((a) => a.status === s));

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My applications</h1>
            <p className="mt-1 text-sm text-zinc-500">Track every role you&apos;ve applied for.</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/discovery" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              Discover Jobs
            </a>
            <a href="/profile" className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors">
              Edit profile
            </a>
            <form action={signOut}>
              <button type="submit" className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>

        {applications.length > 0 && (
          <div className="mb-6"><SummaryStrip applications={applications} /></div>
        )}

        {applications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-6">
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

            {groups.length > 1 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">By status</h2>
                {groups.map((status) => {
                  const grouped = applications.filter((a) => a.status === status);
                  const cfg = STATUS_CONFIG[status];
                  return (
                    <div key={status} className="rounded-2xl bg-white shadow-sm overflow-hidden">
                      <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-3">
                        <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                        <h3 className="text-sm font-semibold text-zinc-900">{cfg.label}</h3>
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