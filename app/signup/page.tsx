"use client";

import { useState, useTransition } from "react";
import { signup } from "./actions";

type Role = "job_seeker" | "employer";

export default function SignupPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!role) {
      setError("Please select a role before continuing.");
      return;
    }

    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("role", role);

    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Choose how you&apos;ll use HireControl.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          {/* Role selection */}
          <fieldset>
            <legend className="mb-3 text-sm font-medium text-zinc-700">
              I am a&hellip; <span className="text-red-500">*</span>
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("job_seeker")}
                className={`flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${
                  role === "job_seeker"
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                }`}
                aria-pressed={role === "job_seeker"}
              >
                <span className="text-xl" aria-hidden>
                  🔍
                </span>
                <span className="font-semibold">Job seeker</span>
                <span
                  className={`text-xs leading-snug ${
                    role === "job_seeker" ? "text-zinc-300" : "text-zinc-400"
                  }`}
                >
                  Browse and apply for roles
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
                <span className="text-xl" aria-hidden>
                  🏢
                </span>
                <span className="font-semibold">Employer</span>
                <span
                  className={`text-xs leading-snug ${
                    role === "employer" ? "text-zinc-300" : "text-zinc-400"
                  }`}
                >
                  Post roles and evaluate candidates
                </span>
              </button>
            </div>
          </fieldset>

          {/* Name */}
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
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Jane Smith"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700"
            >
              Work email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="jane@company.com"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="At least 8 characters"
            />
          </div>

          {/* Error */}
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            {isPending ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-zinc-900 hover:underline"
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
