"use client";

import { useState, useTransition } from "react";
import { login } from "./actions";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Log in to your account
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Welcome back to Sachok Job!
          </p>
        </div>

        {/* GOOGLE STUFF */}
        <GoogleSignInButton />

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-6">
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
              autoComplete="current-password"
              required
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Enter your password"
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
            {isPending ? "Logging in…" : "Log in"}
          </button>

          <p className="text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-zinc-900 hover:underline"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}