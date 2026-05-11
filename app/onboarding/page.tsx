import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect("/login");

    // Check for actual profile existence rather than just the 'role' string
    const { data: applicantProfile } = await supabase
        .from('ApplicantProfile')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

    const { data: companyProfile } = await supabase
        .from('CompanyProfile')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

    // Only redirect if their respective profile data actually exists
    if (companyProfile) redirect("/employer/dashboard");
    if (applicantProfile) redirect("/dashboard");

    return <OnboardingForm />;
}