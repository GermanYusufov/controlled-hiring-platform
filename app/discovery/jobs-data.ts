import { createClient } from "@/backend/utils/supabase/client";

export async function getDiscoveryData() {
  const supabase = createClient();

  // 1. Get current user and profile to check for resume
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

  // 2. Fetch jobs along with their current application count
  const { data, error } = await supabase
    .from("JobPosting")
    .select(`
      *,
      applications:Application(count)
    `)
    .limit(50);

  if (error) {
    console.error("Error fetching jobs:", error);
    return { jobs: [], hasResume, applicantId };
  }

  // 3. Format the data to easily access the count
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
    if (error.message.includes('ALREADY_APPLIED')) {
      return { error: 'You have already applied for this job.' };
    }
    if (error.message.includes('JOB_FILLED')) {
      return { error: 'Sorry, this job has reached its application limit.' };
    }
    
    console.error("Database apply error:", error);
    return { error: 'Something went wrong. Please try again.' };
  }

  return { data, error: null };
}