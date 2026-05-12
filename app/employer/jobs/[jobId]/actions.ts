// app/employer/jobs/[jobId]/actions.ts
"use server";

import { createClient } from "@/backend/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateJobPosting(jobId: string, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const updatedData = {
    job_title: formData.get("job_title") as string,
    job_location: formData.get("job_location") as string,
    job_type: formData.get("job_type") as string,
    job_level: formData.get("job_level") as string,
    job_summary: formData.get("job_summary") as string,
    job_skills: formData.get("job_skills") as string,
  };

  const { error } = await supabase.from("JobPosting").update(updatedData).eq("id", jobId);

  if (error) {
    console.error("Update failed:", error);
    throw new Error("Failed to update job.");
  }

  revalidatePath(`/employer/jobs/${jobId}`);
  revalidatePath("/employer/jobs");
  revalidatePath("/discovery");
}

export async function deleteJobPosting(jobId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("JobPosting").delete().eq("id", jobId);

  if (error) {
    console.error("Delete failed:", error);
    throw new Error("Failed to delete job.");
  }

  revalidatePath("/employer/jobs");
  revalidatePath("/employer/dashboard");
  revalidatePath("/discovery");
  redirect("/employer/jobs");
}

// app/employer/jobs/[jobId]/actions.ts
export async function updateCandidateStatus(applicationId: string, newStatus: string, jobId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const dbStatus = newStatus.toUpperCase();

  const { error } = await supabase
    .from("Application")
    .update({ status: dbStatus })
    .eq("id", applicationId);

  if (error) {
    console.error("Failed to update candidate status:", error);
    return { error: "Failed to update candidate status." };
  }

  if (jobId) {
    revalidatePath(`/employer/jobs/${jobId}`);
  }
  revalidatePath("/employer/applications");
  revalidatePath("/employer/dashboard");
  
  return { success: true };
}