import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect("/login");

    const { data: profile } = await supabase
        .from("User")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role) {
        redirect(profile.role === "employer" ? "/employer/dashboard" : "/dashboard");
    }

    return <OnboardingForm />;
}