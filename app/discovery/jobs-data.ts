// app/discovery/jobs-data.ts
import { createClient } from "@/backend/utils/supabase/client";

export async function getDiscoveryData() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  let hasResume = false;
  let applicantId = null;

  if (user) {
    const { data: profile } = await supabase
      .from("ApplicantProfile")
      .select("resume_url, id")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      applicantId = profile.id;
      hasResume = !!profile.resume_url;
    }
  }

  // FIXED: Added .order() so the newest jobs are always fetched
  const { data, error } = await supabase
    .from("JobPosting")
    .select(`
      *,
      applications:Application(count)
    `)
    .order("created_at", { ascending: false }) 
    .limit(50);

  if (error) {
    console.error("Error fetching jobs:", error);
    return { jobs: [], hasResume, applicantId };
  }

  const formattedJobs = data.map((job: any) => ({
    ...job,
    applicationCount: job.applications?.[0]?.count || 0
  }));

  return { jobs: formattedJobs, hasResume, applicantId };
}

export async function applyToJob(jobId: string, applicantId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .rpc("apply_for_job", {
      p_job_id: jobId,
      p_applicant_id: applicantId
    });

  if (error) {
    if (error.message.includes('ALREADY_APPLIED')) return { error: 'You have already applied for this job.' };
    if (error.message.includes('JOB_FILLED')) return { error: 'Sorry, this job has reached its application limit.' };
    return { error: 'Something went wrong. Please try again.' };
  }

  return { data, error: null };
}