"use client";

import { useState, useTransition, KeyboardEvent } from "react";
import { updateApplicantProfile, updateCompanyProfile } from "./actions";

const SUGGESTED_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "SQL",
  "GraphQL",
  "AWS",
  "Docker",
  "Figma",
  "Product Management",
  "Data Analysis",
  "UX Research",
  "Marketing",
];

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

export default function ProfileEditorPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [state, setState] = useState<{ error?: string; success?: boolean }>({});
  const [isPending, startTransition] = useTransition();

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
    // Inject skills as comma-separated string
    formData.set("skills", skills.join(","));

    startTransition(async () => {
      const result = await updateApplicantProfile(formData);
      setState(result ?? {});
    });
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            ← Back
          </a>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Your profile
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Help employers understand who you are and what you&apos;re looking for.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
          {/* ── Personal details ── */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-zinc-900">
              Personal details
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-zinc-700"
                >
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Jane Smith"
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="targetRole"
                  className="text-sm font-medium text-zinc-700"
                >
                  Target role <span className="text-red-500">*</span>
                </label>
                <input
                  id="targetRole"
                  name="targetRole"
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <p className="text-xs text-zinc-400">
                  The specific job title you&apos;re targeting.
                </p>
              </div>
            </div>
          </section>

          {/* ── Skills ── */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-base font-semibold text-zinc-900">
              Skills
            </h2>
            <p className="mb-4 text-sm text-zinc-500">
              Type a skill and press <kbd className="rounded border border-zinc-200 px-1 py-0.5 text-xs">Enter</kbd> or <kbd className="rounded border border-zinc-200 px-1 py-0.5 text-xs">,</kbd> to add it. Backspace removes the last one.
            </p>

            {/* Tag input */}
            <div className="flex min-h-[44px] flex-wrap gap-2 rounded-lg border border-zinc-200 px-3 py-2 focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    aria-label={`Remove ${skill}`}
                    className="ml-0.5 text-zinc-400 hover:text-white transition-colors"
                  >
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

            {/* Suggestions */}
            <div className="mt-3">
              <p className="mb-2 text-xs text-zinc-400">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => addSkill(suggestion)}
                      className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ),
                )}
              </div>
            </div>
          </section>

          {/* ── Education ── */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-zinc-900">
              Education
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="educationDegree"
                  className="text-sm font-medium text-zinc-700"
                >
                  Highest degree
                </label>
                <select
                  id="educationDegree"
                  name="educationDegree"
                  defaultValue=""
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="" disabled>
                    Select a degree…
                  </option>
                  {DEGREE_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="educationSchool"
                  className="text-sm font-medium text-zinc-700"
                >
                  School / institution
                </label>
                <input
                  id="educationSchool"
                  name="educationSchool"
                  type="text"
                  placeholder="e.g. University of Edinburgh"
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="educationYear"
                  className="text-sm font-medium text-zinc-700"
                >
                  Graduation year
                </label>
                <input
                  id="educationYear"
                  name="educationYear"
                  type="number"
                  min={1950}
                  max={2030}
                  placeholder="e.g. 2022"
                  className="w-32 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>
          </section>

          {/* Error / success */}
          {state.error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {state.error}
            </p>
          )}
          {state.success && (
            <p
              role="status"
              className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              Profile saved successfully.
            </p>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
