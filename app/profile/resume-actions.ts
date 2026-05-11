"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function uploadResume(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const file = formData.get("resume") as File | null;

  if (!file || file.size === 0) {
    throw new Error("No file selected");
  }

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  const filePath = `${user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, file, {
      upsert: true,
      contentType: "application/pdf",
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("ApplicantProfile")
    .update({
      resume_url: data.publicUrl,
    })
    .eq("user_id", user.id);

  if (updateError) throw updateError;
}