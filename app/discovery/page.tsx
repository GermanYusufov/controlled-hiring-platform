"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getDiscoveryData, applyToJob } from "./jobs-data";

const Popup = dynamic(() => import("reactjs-popup"), { ssr: false });

const MAX_APPLICATIONS = 10;

export default function DiscoveryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  
  // New state variables for the application flow
  const [hasResume, setHasResume] = useState(false);
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    setIsClient(true);

    async function loadData() {
      const data = await getDiscoveryData();
      setJobs(data.jobs);
      setHasResume(data.hasResume);
      setApplicantId(data.applicantId);
    }

    loadData();
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

  const handleApply = async () => {
    if (!selectedJob || !applicantId) return;
    
    setIsApplying(true);
    const { error } = await applyToJob(selectedJob.id, applicantId);
    setIsApplying(false);

    if (error) {
      alert("Failed to apply. You might have already applied to this job.");
      console.error(error);
    } else {
      // Update local state so the progress bar fills up immediately
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === selectedJob.id
            ? { ...job, applicationCount: job.applicationCount + 1 }
            : job
        )
      );
      alert("Successfully applied! Your profile has been sent to the employer.");
      setSelectedJobId(null); // Close the popup
    }
  };

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
                className="mt-6 rounded-lg bg-blue-500 px-5 py-2 text-white hover:bg-blue-600 transition-colors"
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

                  {/* 10-Piece Progress Bar Section */}
                  <div className="mt-6 rounded-lg bg-zinc-50 p-4 border border-zinc-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-zinc-700">Applicant Spots</span>
                      <span className="text-xs font-semibold text-zinc-500">
                        {selectedJob.applicationCount} / {MAX_APPLICATIONS} Filled
                      </span>
                    </div>
                    
                    <div className="flex gap-1 h-3 w-full">
                      {Array.from({ length: MAX_APPLICATIONS }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm transition-colors ${
                            i < selectedJob.applicationCount 
                              ? 'bg-blue-500' 
                              : 'bg-zinc-200'
                          }`}
                        />
                      ))}
                    </div>
                    
                    {selectedJob.applicationCount >= MAX_APPLICATIONS && (
                      <p className="mt-2 text-sm font-bold text-red-500">
                        Filled! No more applications accepted.
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      Description
                    </h3>

                    <p className="text-zinc-700 whitespace-pre-wrap">
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

                  <div className="mt-8 flex flex-col gap-3 border-t border-zinc-100 pt-6">
                    <div className="flex gap-3">
                      <button
                        onClick={handleApply}
                        disabled={selectedJob.applicationCount >= MAX_APPLICATIONS || !hasResume || isApplying}
                        className={`rounded-lg px-8 py-2 text-sm font-medium text-white transition-colors ${
                          selectedJob.applicationCount >= MAX_APPLICATIONS || !hasResume
                            ? "bg-zinc-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isApplying ? "Applying..." : selectedJob.applicationCount >= MAX_APPLICATIONS ? "Filled" : "Apply"}
                      </button>

                      <button
                        onClick={() => setSelectedJobId(null)}
                        className="rounded-lg border border-zinc-300 px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        Back to Jobs
                      </button>
                    </div>

                    {/* Resume Warning Message */}
                    {!hasResume && selectedJob.applicationCount < MAX_APPLICATIONS && (
                      <p className="text-sm font-medium text-red-500 mt-1">
                        * You must add a resume to your profile before applying.
                      </p>
                    )}
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