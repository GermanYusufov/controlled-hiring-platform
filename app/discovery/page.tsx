"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getJobs } from "./jobs-data";

const Popup = dynamic(() => import("reactjs-popup"), { ssr: false });

export default function DiscoveryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);

    async function loadJobs() {
      const data = await getJobs();
      setJobs(data);
    }

    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const company = job.company || "";

    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const selectedJob = selectedJobId
    ? jobs.find((job) => job.id === selectedJobId)
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <a
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            ← Back
          </a>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Job Discovery
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Explore the latest job openings and find your next opportunity.
          </p>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border placeholder-zinc-500 text-zinc-500 border-zinc-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-zinc-900">
                {job.title}
              </h2>

              <p className="mt-3 text-zinc-500">{job.company}</p>

              <p className="mt-2 text-sm text-zinc-500">
                {job.job_location || "Location not listed"}
              </p>

              <p className="text-sm text-zinc-400">
                Posted {job.first_seen || "N/A"}
              </p>

              <button
                onClick={() => setSelectedJobId(job.id)}
                className="mt-6 rounded-lg bg-blue-500 px-5 py-2 text-white"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {isClient && selectedJob && (
          <Popup
            open={!!selectedJob}
            modal
            nested
            onClose={() => setSelectedJobId(null)}
          >
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-8">
              <div className="mx-auto max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-zinc-50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                    Job Details
                  </h1>

                  <button
                    onClick={() => setSelectedJobId(null)}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                  >
                    Close
                  </button>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-zinc-900">
                    {selectedJob.title}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    {selectedJob.company}
                  </p>

                  <p className="mt-4 text-sm text-zinc-600">
                    {selectedJob.job_location || "Location not listed"}
                  </p>

                  <p className="mt-2 text-xs text-zinc-400">
                    Posted {selectedJob.first_seen || "N/A"}
                  </p>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      Description
                    </h3>

                    <p className="text-zinc-700">
                      {selectedJob.job_summary ||
                        selectedJob.description ||
                        "No description available."}
                    </p>
                  </div>

                  {selectedJob.job_skills && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-zinc-900 mb-2">
                        Skills
                      </h3>

                      <p className="text-zinc-700">{selectedJob.job_skills}</p>
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    {selectedJob.job_link && (
                      <a
                        href={selectedJob.job_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        View Job
                      </a>
                    )}

                    <button
                      onClick={() => setSelectedJobId(null)}
                      className="rounded-lg border border-zinc-300 px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      Back to Jobs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
}