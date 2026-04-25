"use server";

import type { ApplicationStatus } from "@/app/dashboard/data";

export type UpdateStatusResult = { error?: string; success?: boolean };

const VALID_STATUSES: ApplicationStatus[] = [
  "submitted",
  "viewed",
  "shortlisted",
  "interviewing",
  "rejected",
  "offer",
];

export async function updateCandidateStatus(
  candidateId: string,
  newStatus: ApplicationStatus,
): Promise<UpdateStatusResult> {
  if (!candidateId) return { error: "Missing candidate ID." };
  if (!VALID_STATUSES.includes(newStatus)) return { error: "Invalid status." };

  // TODO: replace with real Supabase update once auth is wired up
  // const cookieStore = await cookies();
  // const supabase = createClient(cookieStore);
  // const { error } = await supabase
  //   .from("applications")
  //   .update({ status: newStatus, status_updated_at: new Date().toISOString() })
  //   .eq("id", candidateId);
  // if (error) return { error: error.message };

  // Simulate network latency
  await new Promise((r) => setTimeout(r, 400));

  return { success: true };
}
