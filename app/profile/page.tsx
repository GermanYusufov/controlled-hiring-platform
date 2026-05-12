"use client";

import { useState, useTransition, KeyboardEvent, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { updateApplicantProfile, updateCompanyProfile, getProfileData } from "./actions";
import { uploadResume } from "./resume-actions";

const DEGREE_OPTIONS = [
  "High School Diploma",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Bootcamp Certificate",
  "Professional Certificate",
  "Other",
];

// ─── Job Seeker Form ─────────────────────────────────────────────────────────

function JobSeekerForm({ initialData }: { initialData: any }) {
  const [skills, setSkills] = useState<string[]>(() =>
    initialData?.skills ? initialData.skills.split(",").filter(Boolean) : []
  );
  const [skillInput, setSkillInput] = useState("");
  const [available, setAvailable] = useState<boolean>(initialData?.availability_status ?? false);
  const [state, setState] = useState<{ error?: string; success?: boolean }>({});
  const [isPending, startTransition] = useTransition();

  const edParts = initialData?.education ? initialData.education.split(" - ") : [];

  function addSkill(skill: string) {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  function handleSkillKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    } else if (e.key === "Backspace" && skillInput === "" && skills.length > 0) {
      setSkills((prev) => prev.slice(0, -1));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({});

    const formData = new FormData(e.currentTarget);
    formData.set("skills", skills.join(","));
    formData.set("availabilityStatus", String(available));

    startTransition(async () => {
      const profileResult = await updateApplicantProfile(formData);

      if (profileResult?.error) {
        setState(profileResult);
        return;
      }

      const resumeFile = formData.get("resume") as File | null;

      if (resumeFile && resumeFile.size > 0) {
        const resumeResult = await uploadResume(formData);
        if (resumeResult?.error) {
          setState({ error: resumeResult.error });
          return;
        }
      }

      setState({ success: true });
    });
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <a href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
            ← Back
          </a>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Your profile</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Help employers understand who you are and what you&apos;re looking for.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
          {/* Personal details */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-zinc-900">Personal details</h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="fullName" className="text-sm font-medium text-zinc-700">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  defaultValue={initialData?.name}
                  placeholder="Jane Smith"
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="targetRole" className="text-sm font-medium text-zinc-700">
                  Target role <span className="text-red-500">*</span>
                </label>
                <input
                  id="targetRole"
                  name="targetRole"
                  type="text"
                  required
                  defaultValue={initialData?.target_role}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <p className="text-xs text-zinc-400">The specific job title you&apos;re targeting.</p>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-base font-semibold text-zinc-900">Skills</h2>
            <p className="mb-4 text-sm text-zinc-500">Type a skill and press Enter or comma to add it.</p>

            <div className="flex min-h-[44px] flex-wrap gap-2 rounded-lg border border-zinc-200 px-3 py-2">
              {skills.map((skill) => (
                <span key={skill} className="flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-0.5 text-zinc-400 hover:text-white transition-colors">
                    ×
                  </button>
                </span>
              ))}
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                onBlur={() => skillInput && addSkill(skillInput)}
                placeholder={skills.length === 0 ? "e.g. React, Python, SQL…" : ""}
                className="min-w-[120px] flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
              />
            </div>
          </section>

          {/* Experience Summary */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-base font-semibold text-zinc-900">Experience summary</h2>
            <p className="mb-4 text-sm text-zinc-500">A brief overview of your work history and key achievements.</p>

            <textarea
              id="experienceSummary"
              name="experienceSummary"
              rows={5}
              defaultValue={initialData?.experience_summary}
              placeholder="e.g. 5 years building scalable web apps with React and Node.js, led a team of 3 engineers…"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </section>

          {/* Education */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-zinc-900">Education</h2>

            <div className="flex flex-col gap-4">
              <select
                name="educationDegree"
                defaultValue={edParts[0] || ""}
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
              >
                <option value="" disabled>Select a degree…</option>
                {DEGREE_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <input
                name="educationSchool"
                type="text"
                defaultValue={edParts[1] || ""}
                placeholder="School / institution"
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
              />

              <input
                name="educationYear"
                type="number"
                min={1950}
                max={2030}
                defaultValue={edParts[2] || ""}
                placeholder="Graduation year"
                className="w-32 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
              />
            </div>
          </section>

          {/* Availability Status */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Availability</h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {available ? "You are currently available for opportunities." : "You are not currently available."}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={available}
                onClick={() => setAvailable((v) => !v)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${available ? "bg-zinc-900" : "bg-zinc-200"}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${available ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
          </section>

          {/* Resume */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-base font-semibold text-zinc-900">Resume</h2>
            <p className="mb-4 text-xs text-zinc-400">Upload a PDF resume (max 5 MB). It will be saved when you click Save profile.</p>

            <input
              type="file"
              name="resume"
              accept=".pdf"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.type !== "application/pdf") {
                    setState({ error: "Please select a valid PDF file." });
                    e.target.value = "";
                  } else if (file.size > 5 * 1024 * 1024) {
                    setState({ error: "File exceeds 5 MB limit." });
                    e.target.value = "";
                  } else {
                    setState({});
                  }
                }
              }}
            />
          </section>

          {state.error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>}
          {state.success && <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">Profile saved successfully.</p>}

          <div className="flex justify-end">
            <button type="submit" disabled={isPending} className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50">
              {isPending ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Employer Form ────────────────────────────────────────────────────────────

function EmployerForm({ initialData }: { initialData: any }) {
  const [state, setState] = useState<{ error?: string; success?: boolean }>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({});

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateCompanyProfile(formData);
      setState(result ?? {});
    });
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <a href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
            ← Back
          </a>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Company profile</h1>
          <p className="mt-1 text-sm text-zinc-500">Tell applicants about your company.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="companyName" className="text-sm font-medium text-zinc-700">
                  Company name <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  defaultValue={initialData?.company_name}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="description" className="text-sm font-medium text-zinc-700">Business description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  defaultValue={initialData?.description}
                  placeholder="What does your company do? What's your mission?"
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="location" className="text-sm font-medium text-zinc-700">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue={initialData?.location}
                  placeholder="e.g. San Francisco, CA"
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              {/* preserve contactEmail for backend compatibility */}
              <input type="hidden" name="contactEmail" defaultValue={initialData?.contact_email} />
            </div>
          </section>

          {state.error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>}
          {state.success && <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">Profile saved successfully.</p>}

          <div className="flex justify-end">
            <button type="submit" disabled={isPending} className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50">
              {isPending ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page shell ──────────────────────────────────────────────────────────────

export default function ProfileEditorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-zinc-500">Loading profile...</div>}>
      <ProfileEditorContent />
    </Suspense>
  );
}

function ProfileEditorContent() {
  const searchParams = useSearchParams();
  const urlRole = searchParams.get("role");

  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRole] = useState(urlRole || "applicant");

  useEffect(() => {
    getProfileData()
      .then((res) => {
        setInitialData(res.profile || {});
        if (res.role) setActiveRole(res.role);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading your profile...</div>;
  }

  if (activeRole === "employer") {
    return <EmployerForm initialData={initialData} />;
  }

  return <JobSeekerForm initialData={initialData} />;
}