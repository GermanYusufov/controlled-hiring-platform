import { createClient } from "@/backend/utils/supabase/server";
import { cookies } from "next/headers";

export type ApplicationStatus = "submitted" | "viewed" | "shortlisted" | "interviewing" | "rejected" | "offer";

export type Application = {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  location: string;
  status: ApplicationStatus;
  applied_at: string;
  status_updated_at: string;
  job_summary?: string;
  job_skills?: string;
};

export async function getApplications(applicantId: string): Promise<Application[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch applications, grabbing the text 'company' column and full details
  const { data, error } = await supabase
    .from("Application")
    .select(`
      id,
      status,
      created_at,
      job_id,
      job:JobPosting (
        id,
        job_title,
        job_location,
        company,
        job_summary,
        job_skills
      )
    `)
    .eq("applicant_id", applicantId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
    return [];
  }

  return (data || []).map((app: any) => ({
    id: app.id,
    job_id: app.job?.id || "",
    job_title: app.job?.job_title || "Unknown Role",
    // FIXED: Correctly pulls from the text column instead of the joined table
    company_name: app.job?.company || "Unknown Company",
    location: app.job?.job_location || "",
    status: (app.status?.toLowerCase() || "submitted") as ApplicationStatus,
    applied_at: app.created_at,
    status_updated_at: app.created_at, 
    job_summary: app.job?.job_summary || "",
    job_skills: app.job?.job_skills || "",
  }));
}