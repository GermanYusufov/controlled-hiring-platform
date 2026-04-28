"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function submitRoleSelection(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const role = formData.get("role") as string;

  const { error: userError } = await supabase
    .from("User")
    .update({ role: role })
    .eq("id", user.id);

  if (userError) return { error: userError.message };

  if (role === "employer") {
    const companyName = String(formData.get("companyName") ?? "").trim();
    if (!companyName) return { error: "Company name is required." };

    const { error: companyError } = await supabase
      .from("CompanyProfile")
      .insert({
        user_id: user.id,
        company_name: companyName,
      });

    if (companyError) return { error: companyError.message };
  } else if (role === "applicant") {
      const { error: applicantError } = await supabase
      .from("ApplicantProfile")
      .insert({
        user_id: user.id,
        name: user.email?.split('@')[0] || "New User",
      });
      if (applicantError) return { error: applicantError.message };
  }

  redirect("/profile");
}