"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function uploadResume(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  const file = formData.get("resume") as File | null;

  if (!file || file.size === 0) {
    return { success: false, error: "No file selected" };
  }

  if (file.type !== "application/pdf") {
    return { success: false, error: "Only PDF files are allowed" };
  }

  const filePath = `${user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, file, {
      upsert: true,
      contentType: "application/pdf",
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("ApplicantProfile")
    .update({
      resume_url: data.publicUrl,
    })
    .eq("user_id", user.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return {
    success: true,
    resumeUrl: data.publicUrl,
  };
}