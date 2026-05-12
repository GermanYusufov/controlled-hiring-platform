"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/backend/utils/supabase/server";

export async function submitRoleSelection(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const role = formData.get("role") as string;

  // FAILSAFE: We use upsert here instead of update. 
  // If the database trigger failed silently, this will create the missing User row!
  const { error: userError } = await supabase
    .from("User")
    .upsert({ 
      id: user.id, 
      email: user.email || `${user.id}@placeholder.com`,
      role: role 
    }, { onConflict: 'id' });

  if (userError) return { error: userError.message };

  if (role === "employer") {
    const companyName = String(formData.get("companyName") ?? "").trim();
    if (!companyName) return { error: "Company name is required." };

    const { error: companyError } = await supabase
      .from("CompanyProfile")
      .upsert({
        user_id: user.id,
        company_name: companyName,
      }, { onConflict: 'user_id' });

    if (companyError) return { error: companyError.message };
  } else if (role === "applicant") {
      const { error: applicantError } = await supabase
      .from("ApplicantProfile")
      .upsert({
        user_id: user.id,
        name: user.email?.split('@')[0] || "New User",
      }, { onConflict: 'user_id' });

      if (applicantError) return { error: applicantError.message };
  }

  redirect("/profile");
}