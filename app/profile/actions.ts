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

export async function updateApplicantProfile(
  formData: FormData
): Promise<ProfileFormState> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { user, role } = await getAuthenticatedUser(supabase);
  
  if (role !== 'applicant') return { error: "Unauthorized: You are not registered as an applicant." };

  const name = String(formData.get("fullName") ?? "").trim(); // (From your previous fix!)
  const targetRole = String(formData.get("targetRole") ?? "").trim();
  const skills = String(formData.get("skills") ?? "").trim();
  const experience = String(formData.get("experience") ?? "").trim();
  
  // 1. Grab the three separate education fields
  const degree = String(formData.get("educationDegree") ?? "").trim();
  const school = String(formData.get("educationSchool") ?? "").trim();
  const year = String(formData.get("educationYear") ?? "").trim();

  // 2. Combine them into a single string (e.g. "Bachelor's Degree - University of Edinburgh - 2022")
  // The filter(Boolean) makes sure we don't include empty dashes if they left a field blank
  const education = [degree, school, year].filter(Boolean).join(" - ");
  
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