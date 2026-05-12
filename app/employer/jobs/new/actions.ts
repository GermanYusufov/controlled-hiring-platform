"use server";

import { createClient } from "@/backend/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJobPosting(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to post a job.");
  }

  const { data: companyProfile, error: profileError } = await supabase
    .from("CompanyProfile")
    .select("id, company_name")
    .eq("user_id", user.id)
    .single();

  if (profileError || !companyProfile) {
    throw new Error("Company profile not found. Please complete your employer profile first.");
  }

  // Extract data from the form (Application Limit is explicitly 10)
  const newJob = {
    company_id: companyProfile.id,
    job_title: formData.get("job_title") as string,
    application_limit: 10, // STRICTLY ENFORCED HERE
    company: formData.get("company") as string || companyProfile.company_name,
    job_location: formData.get("job_location") as string,
    job_level: formData.get("job_level") as string,
    job_type: formData.get("job_type") as string,
    search_city: formData.get("search_city") as string,
    search_country: formData.get("search_country") as string,
    job_link: formData.get("job_link") as string,
    job_summary: formData.get("job_summary") as string,
    job_skills: formData.get("job_skills") as string,
    first_seen: new Date().toLocaleDateString(),
  };

  const { error } = await supabase.from("JobPosting").insert(newJob);

  if (error) {
    console.error("Error inserting job:", error);
    throw new Error("Failed to create job posting.");
  }

  revalidatePath("/employer/jobs");
  revalidatePath("/employer/dashboard");
  revalidatePath("/discovery");
  redirect("/employer/jobs");
}