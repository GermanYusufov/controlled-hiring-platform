export type ApplicationStatus =
  | "submitted"
  | "viewed"
  | "shortlisted"
  | "interviewing"
  | "rejected"
  | "offer";

export type Application = {
  id: string;
  job_title: string;
  company_name: string;
  location: string | null;
  applied_at: string;
  status: ApplicationStatus;
  status_updated_at: string;
};

// TODO: replace with real Supabase query once auth is wired up
export async function getApplications(): Promise<Application[]> {
  const now = new Date();
  const daysAgo = (d: number) =>
    new Date(now.getTime() - d * 86_400_000).toISOString();

  return [
    {
      id: "1",
      job_title: "Senior Frontend Engineer",
      company_name: "Acme Corp",
      location: "London, UK",
      applied_at: daysAgo(14),
      status: "shortlisted",
      status_updated_at: daysAgo(3),
    },
    {
      id: "2",
      job_title: "Product Designer",
      company_name: "Nimbus Studio",
      location: "Remote",
      applied_at: daysAgo(10),
      status: "interviewing",
      status_updated_at: daysAgo(1),
    },
    {
      id: "3",
      job_title: "Full Stack Developer",
      company_name: "Orbit Systems",
      location: "Edinburgh, UK",
      applied_at: daysAgo(7),
      status: "viewed",
      status_updated_at: daysAgo(5),
    },
    {
      id: "4",
      job_title: "UX Researcher",
      company_name: "Waverly Health",
      location: "Manchester, UK",
      applied_at: daysAgo(4),
      status: "submitted",
      status_updated_at: daysAgo(4),
    },
    {
      id: "5",
      job_title: "Engineering Manager",
      company_name: "Apex Fintech",
      location: "Remote",
      applied_at: daysAgo(21),
      status: "rejected",
      status_updated_at: daysAgo(8),
    },
    {
      id: "6",
      job_title: "Staff Engineer",
      company_name: "Meridian AI",
      location: "London, UK",
      applied_at: daysAgo(30),
      status: "offer",
      status_updated_at: daysAgo(0),
    },
  ];
}
