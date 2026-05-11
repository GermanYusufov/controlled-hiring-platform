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
    .single();

  if (userError || !userData) {
    throw new Error("User record not found: " + (userError?.message || "No data"));
  }

  return { user, role: userData.role };
}

export async function updateApplicantProfile(formData: FormData): Promise<ProfileFormState> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { user, role } = await getAuthenticatedUser(supabase);
  if (role !== 'applicant') return { error: "Unauthorized." };

  const name = String(formData.get("fullName") ?? "").trim();
  const targetRole = String(formData.get("targetRole") ?? "").trim();
  
  if (!name) return { error: "Name is required." };

  // 1. Upsert the base ApplicantProfile
  const { data: applicantProfile, error: profileError } = await supabase
    .from("ApplicantProfile")
    .upsert({
      user_id: user.id,
      name: name,
      target_role: targetRole,
    }, { onConflict: 'user_id' })
    .select('id')
    .single();

  if (profileError) return { error: `Profile Error: ${profileError.message}` };
  const applicantId = applicantProfile.id;

  // 2. Handle Education
  const degree = String(formData.get("educationDegree") ?? "").trim();
  const school = String(formData.get("educationSchool") ?? "").trim();
  const year = String(formData.get("educationYear") ?? "").trim();

  const { error: edDelError } = await supabase.from("ApplicantEducation").delete().eq("applicant_id", applicantId);
  if (edDelError) return { error: `Ed Delete Error: ${edDelError.message}` };
  
  if (degree || school || year) {
    const { error: edInsError } = await supabase.from("ApplicantEducation").insert({
      applicant_id: applicantId,
      institution: school || 'Not Specified',
      degree: degree || null,
      end_date: year ? `${year}-01-01` : null
    });
    if (edInsError) return { error: `Ed Insert Error: ${edInsError.message}` };
  }

  // 3. Handle Skills
  const skillsStr = String(formData.get("skills") ?? "").trim();
  
  // FIX: Use a Set to automatically strip out any duplicate tags the user typed!
  const skillsList = Array.from(new Set(skillsStr ? skillsStr.split(",").map(s => s.trim()).filter(Boolean) : []));

  const { error: skillDelError } = await supabase.from("ApplicantSkill").delete().eq("applicant_id", applicantId);
  if (skillDelError) return { error: `Skill Delete Error: ${skillDelError.message}` };

  for (const skillName of skillsList) {
    // Upsert the skill
    const { data: skillRow, error: skillError } = await supabase
      .from("Skill")
      .upsert({ name: skillName }, { onConflict: 'name' })
      .select('id')
      .single();

    // FIX: Catch and display the exact database error if one happens
    if (skillError) return { error: `Skill Error [${skillName}]: ${skillError.message}` };

    // Link it to the applicant
    if (skillRow) {
      const { error: linkError } = await supabase.from("ApplicantSkill").insert({
        applicant_id: applicantId,
        skill_id: skillRow.id
      });
      if (linkError) return { error: `Skill Link Error: ${linkError.message}` };
    }
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

  const { error } = await supabase
    .from("CompanyProfile")
    .upsert({
      user_id: user.id,
      company_name: companyName,
      description: description,
      location: location,
      contact_email: contactEmail
    }, { onConflict: 'user_id' });

  if (error) return { error: error.message };

  return { success: true };
}

export async function getProfileData() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { user, role } = await getAuthenticatedUser(supabase);

  if (role === "employer") {
    const { data } = await supabase.from("CompanyProfile").select("*").eq("user_id", user.id).maybeSingle();
    return { profile: data, role };
  } else {
    const { data } = await supabase
      .from("ApplicantProfile")
      .select(`
        *,
        ApplicantEducation ( degree, institution, end_date ),
        ApplicantSkill ( Skill ( name ) )
      `)
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      const skillsArr = data.ApplicantSkill?.map((sk: any) => sk.Skill?.name).filter(Boolean) || [];
      data.skills = skillsArr.join(",");

      const ed = data.ApplicantEducation?.[0];
      if (ed) {
        const year = ed.end_date ? ed.end_date.split('-')[0] : "";
        data.education = [ed.degree, ed.institution, year].filter(Boolean).join(" - ");
      }
    }

    return { profile: data, role };
  }
}