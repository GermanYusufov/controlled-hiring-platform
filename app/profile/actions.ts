"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type ProfileFormState = {
  error?: string;
  success?: boolean;
};

async function getAuthenticatedUser(supabase: any) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect("/login");

  const { data: userData, error: userError } = await supabase
    .from("User")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (userError) throw new Error(userError.message);

  if (!userData) {
    const { error: insertError } = await supabase.from("User").insert({
      id: user.id,
      email: user.email,
      role: "applicant",
    });

    if (insertError) throw new Error(insertError.message);

    return { user, role: "applicant" };
  }

  return { user, role: userData.role };
}

async function updateUserRole(supabase: any, userId: string, role: "applicant" | "employer") {
  const { error } = await supabase
    .from("User")
    .update({ role })
    .eq("id", userId);

  if (error) throw new Error(error.message);
}

export async function updateApplicantProfile(
  formData: FormData
): Promise<ProfileFormState> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { user } = await getAuthenticatedUser(supabase);

  const name = String(formData.get("name") ?? "").trim();
  const targetRole = String(formData.get("targetRole") ?? "").trim();
  const skills = String(formData.get("skills") ?? "").trim();
  const experience = String(formData.get("experience") ?? "").trim();
  const education = String(formData.get("education") ?? "").trim();

  if (!name) return { error: "Name is required." };

  await updateUserRole(supabase, user.id, "applicant");

  const payload = {
    user_id: user.id,
    name,
    target_role: targetRole,
    skills,
    experience_summary: experience,
    education,
    availability_status: "available",
  };

  const { error } = await supabase
    .from("ApplicantProfile")
    .upsert(payload, { onConflict: "user_id" });

  if (error) return { error: error.message };

  return { success: true };
}

export async function updateCompanyProfile(
  formData: FormData
): Promise<ProfileFormState> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { user } = await getAuthenticatedUser(supabase);

  const companyName = String(formData.get("companyName") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();

  if (!companyName) return { error: "Company name is required." };
  if (!contactEmail) return { error: "Contact email is required." };

  await updateUserRole(supabase, user.id, "employer");

  const payload = {
    user_id: user.id,
    company_name: companyName,
    description,
    location,
    contact_email: contactEmail,
  };

  const { error } = await supabase
    .from("CompanyProfile")
    .upsert(payload, { onConflict: "user_id" });

  if (error) return { error: error.message };

  return { success: true };
}