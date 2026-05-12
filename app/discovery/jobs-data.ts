import { createClient } from "@/utils/supabase/client";

export async function getJobs() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("JobPosting")
    .select("*")
    .limit(50);

  if (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }

  return data || [];
}