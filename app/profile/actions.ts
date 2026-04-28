"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type ProfileFormState = {
  error?: string;
  success?: boolean;
};

async function getAuthenticatedUser(supabase: any) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const { data: userData, error: userError } = await supabase
    .from("User")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userError || !userData) throw new Error("User record not found");
  
  return { user, role: userData.role };
}

export async function updateApplicantProfile(formData: FormData): Promise<ProfileFormState> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { user, role } = await getAuthenticatedUser(supabase);
  
  if (role !== 'applicant') return { error: "Unauthorized: You are not registered as an applicant." };

  const name = String(formData.get("name") ?? "").trim();
  const targetRole = String(formData.get("targetRole") ?? "").trim();
  const skills = String(formData.get("skills") ?? "").trim();
  const experience = String(formData.get("experience") ?? "").trim();
  const education = String(formData.get("education") ?? "").trim();
  
  if (!name) return { error: "Name is required." };

  const { data: existingProfile } = await supabase
    .from("ApplicantProfile")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const payload = {
    user_id: user.id,
    name: name,
    target_role: targetRole,
    skills: skills,
    experience_summary: experience,
    education: education
  };

  const { error } = existingProfile 
    ? await supabase.from("ApplicantProfile").update(payload).eq("id", existingProfile.id)
    : await supabase.from("ApplicantProfile").insert(payload);

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateCompanyProfile(formData: FormData): Promise<ProfileFormState> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { user, role } = await getAuthenticatedUser(supabase);
  
  if (role !== 'employer') return { error: "Unauthorized: You are not registered as an employer." };

  const companyName = String(formData.get("companyName") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();

  if (!companyName) return { error: "Company name is required." };
  if (!contactEmail) return { error: "Contact email is required." };

  const { data: existingProfile } = await supabase
    .from("CompanyProfile")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const payload = {
    user_id: user.id,
    company_name: companyName,
    description: description,
    location: location,
    contact_email: contactEmail
  };

  const { error } = existingProfile 
    ? await supabase.from("CompanyProfile").update(payload).eq("id", existingProfile.id)
    : await supabase.from("CompanyProfile").insert(payload);

  if (error) return { error: error.message };
  return { success: true };
}