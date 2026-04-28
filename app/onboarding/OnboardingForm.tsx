"use client";

import { useState, useTransition } from "react";
import { submitRoleSelection } from "./actions";

type Role = "applicant" | "employer";

export default function OnboardingForm() {
    const [role, setRole] = useState<Role | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [companyName, setCompanyName] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!role) {
            setError("Please select a role before continuing.");
            return;
        }
        if (role === "employer" && !companyName.trim()) {
            setError("Company name is required for employers.");
            return;
        }
        setError(null);
        const formData = new FormData(e.currentTarget);
        formData.set("role", role);
        startTransition(async () => {
            const result = await submitRoleSelection(formData);
            if (result?.error) setError(result.error);
        });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-center text-zinc-900">
                        Welcome to Sachok Job!
                    </h1>
                    <h1 className="mt-2 text-sm text-center text-zinc-500">
                        Let&apos;s get you started.
                    </h1>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                    <fieldset>
                        <legend className="mb-3 text-sm font-medium text-zinc-700">
                            Are you an...<span className="text-red-500">*</span>
                        </legend>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole("applicant")}
                                className={`flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${
                                    role === "applicant"
                                    ? "border-zinc-900 bg-zinc-900 text-white"
                                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                                }`}
                                aria-pressed={role === "applicant"}
                            >
                                <span className="text-xl" aria-hidden>🔍</span>
                                <span className="text-lg font-semibold">Applicant</span>
                                <span className={`text-xs leading-snug ${role === "applicant" ? "text-white/90" : "text-zinc-500"}`}>
                                    Looking for next opportunity
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("employer")}
                                className={`flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${
                                    role === "employer"
                                    ? "border-zinc-900 bg-zinc-900 text-white"
                                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                                }`}
                                aria-pressed={role === "employer"}
                            >
                                <span className="text-xl" aria-hidden>🏢</span>
                                <span className="text-lg font-semibold">Employer</span>
                                <span className={`text-xs leading-snug ${role === "employer" ? "text-white/90" : "text-zinc-500"}`}>
                                    Hiring for your team
                                </span>
                            </button>
                        </div>
                    </fieldset>

                    {role === "employer" && (
                        <div className="mt-4">
                            <label htmlFor="companyName" className="block text-sm font-medium text-zinc-700">
                                Company Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                required
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-zinc-300 shadow-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            />
                        </div>
                    )}

                    {error && (
                        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    >
                        {isPending ? "Submitting..." : "Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}
