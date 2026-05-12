"use server";

import { cookies } from "next/headers";
import { createClient } from "@/backend/utils/supabase/server";

// 1. Fetch Profile Data (Used to pre-fill the form on page load)
export async function getProfileData() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Check role
  const { data: userData } = await supabase
    .from("User")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = userData?.role || "applicant";

  let profile = null;
  if (role === "employer") {
    const { data } = await supabase.from("CompanyProfile").select("*").eq("user_id", user.id).maybeSingle();
    profile = data;
  } else {
    const { data } = await supabase.from("ApplicantProfile").select("*").eq("user_id", user.id).maybeSingle();
    profile = data;
    
    // If you need to fetch their skills to pre-fill the UI, you would do a join here:
    // This assumes you want to pull skills back out to show them on load
    if (profile) {
      const { data: skillsData } = await supabase
        .from("ApplicantSkill")
        .select("Skill(name)")
        .eq("applicant_id", profile.id);
        
      if (skillsData) {
        // @ts-ignore
        profile.skills = skillsData.map(s => s.Skill.name).join(",");
      }
    }
  }

  return { role, profile };
}

// 2. Update Employer Profile
export async function updateCompanyProfile(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const companyName = formData.get("companyName") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase
    .from("CompanyProfile")
    .update({
      company_name: companyName,
      contact_email: contactEmail,
      location,
      description,
    })
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

// 3. Update Applicant Profile (With Resume Upload & Normalized Skills)
export async function updateApplicantProfile(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Extract text fields
  const name = formData.get("fullName") as string;
  const targetRole = formData.get("targetRole") as string;
  
  const updatePayload: any = {
    name,
    target_role: targetRole,
  };

  // Handle the Resume file
  const resumeFile = formData.get("resume") as File | null;

  if (resumeFile && resumeFile.size > 0) {
    if (resumeFile.type !== "application/pdf") {
      return { error: "Only PDF files are allowed for resumes." };
    }

    const filePath = `${user.id}/${Date.now()}-${resumeFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, resumeFile, {
        upsert: true,
        contentType: "application/pdf",
      });

    if (uploadError) return { error: uploadError.message };

    const { data: urlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(filePath);

    updatePayload.resume_url = urlData.publicUrl;
  }

  // Update ApplicantProfile table and return the profile ID
  const { data: profileData, error: updateError } = await supabase
    .from("ApplicantProfile")
    .update(updatePayload)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (updateError) return { error: updateError.message };
  if (!profileData) return { error: "Applicant profile not found." };

  // Handle the normalized Skills tables
  const skillsString = formData.get("skills") as string;
  const applicantId = profileData.id;

  if (skillsString) {
    const skillNames = skillsString.split(",").map(s => s.trim()).filter(Boolean);

    await supabase
      .from("ApplicantSkill")
      .delete()
      .eq("applicant_id", applicantId);

    for (const skillName of skillNames) {
      let { data: skillData } = await supabase
        .from("Skill")
        .select("id")
        .eq("name", skillName)
        .maybeSingle();

      if (!skillData) {
        const { data: newSkill } = await supabase
          .from("Skill")
          .insert({ name: skillName })
          .select("id")
          .single();
          
        skillData = newSkill;
      }

      if (skillData) {
        await supabase
          .from("ApplicantSkill")
          .insert({
            applicant_id: applicantId,
            skill_id: skillData.id
          });
      }
    }
  }

  return { success: true };
}