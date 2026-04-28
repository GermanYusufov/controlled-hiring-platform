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

  // Since the SELECT policy is active, this will successfully find the existing row
  const { data: userData, error: userError } = await supabase
    .from("User")
    .select("role")
    .eq("id", user.id)
    .single(); // Changed from maybeSingle() to single() since the row should definitely exist

  // If there's an error reading the user, throw it so you can see what went wrong
  if (userError || !userData) {
    throw new Error("User record not found: " + (userError?.message || "No data"));
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

export async function updateApplicantProfile(formData: FormData): Promise<ProfileFormState> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { user, role } = await getAuthenticatedUser(supabase);
  if (role !== 'applicant') return { error: "Unauthorized." };

  const name = String(formData.get("fullName") ?? "").trim();
  const targetRole = String(formData.get("targetRole") ?? "").trim();
  const skills = String(formData.get("skills") ?? "").trim();
  
  const degree = String(formData.get("educationDegree") ?? "").trim();
  const school = String(formData.get("educationSchool") ?? "").trim();
  const year = String(formData.get("educationYear") ?? "").trim();
  const education = [degree, school, year].filter(Boolean).join(" - ");
  
  if (!name) return { error: "Name is required." };

  // 1. Fetch the existing profile (select all columns instead of just id)
  const { data: existingProfile } = await supabase
    .from("ApplicantProfile")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const payload = {
    user_id: user.id,
    name: name,
    target_role: targetRole,
    skills: skills,
    education: education
  };

  if (existingProfile) {
    // 2. The Memory Check: If nothing changed, skip the database update entirely
    if (
      existingProfile.name === payload.name &&
      existingProfile.target_role === payload.target_role &&
      existingProfile.skills === payload.skills &&
      existingProfile.education === payload.education
    ) {
      return { success: true }; 
    }
    
    const { error } = await supabase.from("ApplicantProfile").update(payload).eq("id", existingProfile.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("ApplicantProfile").insert(payload);
    if (error) return { error: error.message };
  }

  return { success: true };
}

export async function updateCompanyProfile(formData: FormData): Promise<ProfileFormState> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { user, role } = await getAuthenticatedUser(supabase);
  if (role !== 'employer') return { error: "Unauthorized." };

  const companyName = String(formData.get("companyName") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();

  if (!companyName) return { error: "Company name is required." };
  if (!contactEmail) return { error: "Contact email is required." };

  const { data: existingProfile } = await supabase
    .from("CompanyProfile")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const payload = {
    user_id: user.id,
    company_name: companyName,
    description: description,
    location: location,
    contact_email: contactEmail
  };

  if (existingProfile) {
    // The Memory Check
    if (
      existingProfile.company_name === payload.company_name &&
      existingProfile.description === payload.description &&
      existingProfile.location === payload.location &&
      existingProfile.contact_email === payload.contact_email
    ) {
      return { success: true };
    }
    
    const { error } = await supabase.from("CompanyProfile").update(payload).eq("id", existingProfile.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("CompanyProfile").insert(payload);
    if (error) return { error: error.message };
  }

  return { success: true };
}

export async function getProfileData() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { user, role } = await getAuthenticatedUser(supabase);

  if (role === "employer") {
    // maybeSingle() is used instead of single() so it doesn't crash if they are a new user
    const { data } = await supabase.from("CompanyProfile").select("*").eq("user_id", user.id).maybeSingle();
    return { profile: data, role };
  } else {
    const { data } = await supabase.from("ApplicantProfile").select("*").eq("user_id", user.id).maybeSingle();
    return { profile: data, role };
  }
}