"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type ProfileFormState = {
  error?: string;
  success?: boolean;
};

export async function saveProfile(
  formData: FormData,
): Promise<ProfileFormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const targetRole = String(formData.get("targetRole") ?? "").trim();
  const skills = String(formData.get("skills") ?? "").trim();
  const educationDegree = String(formData.get("educationDegree") ?? "").trim();
  const educationSchool = String(formData.get("educationSchool") ?? "").trim();
  const educationYear = String(formData.get("educationYear") ?? "").trim();

  if (!fullName) return { error: "Full name is required." };
  if (!targetRole) return { error: "Target role is required." };
  if (educationYear && !/^\d{4}$/.test(educationYear))
    return { error: "Graduation year must be a 4-digit year." };

  const skillsList = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    target_role: targetRole,
    skills: skillsList,
    education: {
      degree: educationDegree,
      school: educationSchool,
      graduation_year: educationYear ? Number(educationYear) : null,
    },
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  return { success: true };
}
