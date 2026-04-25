"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type SignupResult = { error: string } | void;

export async function signup(formData: FormData): Promise<SignupResult> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "");

  // Server-side validation
  if (!fullName) return { error: "Full name is required." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "A valid email address is required." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (role !== "job_seeker" && role !== "employer")
    return { error: "Please select a valid role." };

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/signup/confirm");
}
