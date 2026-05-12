import Link from "next/link";
import { createJobPosting } from "./actions";

export default function PostRolePage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href="/employer/jobs"
            className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            ← Back to Jobs
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Post a New Role
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Fill out the details below to publish a new job to the discovery board. All jobs are limited to 10 applicants.
          </p>
        </div>

        <form action={createJobPosting} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col gap-5">
          {/* Basic Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-zinc-700">Job Title *</label>
              <input required type="text" name="job_title" placeholder="e.g. Senior Frontend Engineer" className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900" />
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-zinc-700">Company Display Name</label>
              <input type="text" name="company" placeholder="Leave blank to use profile name" className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900" />
            </div>
          </div>

          {/* Location & Metadata */}
          <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-5">
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-zinc-700">General Location</label>
              <input type="text" name="job_location" placeholder="e.g. Remote, UK or New York, NY" className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Search City</label>
              <input type="text" name="search_city" placeholder="e.g. New York" className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Search Country</label>
              <input type="text" name="search_country" placeholder="e.g. USA" className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Job Type</label>
              <select name="job_type" className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900 bg-white">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Job Level</label>
              <select name="job_level" className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900 bg-white">
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </div>

          {/* Description & Links */}
          <div className="flex flex-col gap-4 border-t border-zinc-100 pt-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Job Summary</label>
              <textarea name="job_summary" rows={4} placeholder="Describe the responsibilities and requirements..." className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900 resize-none" />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Target Skills</label>
              <input type="text" name="job_skills" placeholder="e.g. React, TypeScript, Node.js (comma separated)" className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">External Job Link (Optional)</label>
              <input type="url" name="job_link" placeholder="https://..." className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900" />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              Publish Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}