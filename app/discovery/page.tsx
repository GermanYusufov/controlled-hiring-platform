// app/discovery/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import confetti from "canvas-confetti";
import { getDiscoveryData, applyToJob } from "./jobs-data";
import RoughButtonEl from "@/components/RoughButtonEl";

const Popup = dynamic(() => import("reactjs-popup"), { ssr: false });

const MAX_APPLICATIONS = 10;

function SpotsBadge({ count }: { count: number }) {
  const remaining = MAX_APPLICATIONS - count;
  if (remaining <= 0) return <span className="text-xs font-semibold text-red-500">Filled</span>;
  if (remaining <= 2) return <span className="text-xs font-semibold text-red-500 animate-pulse">🔥 {remaining} spot{remaining === 1 ? "" : "s"} left!</span>;
  if (remaining <= 5) return <span className="text-xs font-semibold text-amber-500">{remaining} spots left</span>;
  return null;
}

export default function DiscoveryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [hasResume, setHasResume] = useState(false);
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedPosition, setAppliedPosition] = useState<number | null>(null);

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
    const title = job.job_title || "";
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
      alert(error);
    } else {
      const newCount = selectedJob.applicationCount + 1;
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === selectedJob.id
            ? { ...job, applicationCount: newCount }
            : job
        )
      );
      setAppliedPosition(newCount);

      // Colorful confetti burst
      const colors = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#f97316"];
      confetti({ particleCount: 180, spread: 90, origin: { y: 0.5 }, colors });
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.55 }, colors }), 150);
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.55 }, colors }), 300);
    }
  };

  const handleCloseSuccess = () => {
    setAppliedPosition(null);
    setSelectedJobId(null);
  };

  const positionMessage = (pos: number) => {
    if (pos === 1) return "You're the very first applicant! 🏆";
    if (pos <= 3) return `You're applicant #${pos} — you got in early! 🚀`;
    if (pos <= 6) return `You're applicant #${pos} of ${MAX_APPLICATIONS}. Good timing!`;
    return `You're applicant #${pos} of ${MAX_APPLICATIONS}. Cutting it close!`;
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
            placeholder="Search for a specific title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border placeholder-zinc-500 text-zinc-500 border-zinc-300 px-4 py-2 focus:border-zinc-900 focus:outline-none"
          />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const remaining = MAX_APPLICATIONS - job.applicationCount;
            return (
              <div
                key={job.id}
                className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                onClick={() => setSelectedJobId(job.id)}
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h2
                      className="text-xl font-semibold text-zinc-900 line-clamp-2 break-words"
                      title={job.job_title}
                    >
                      {job.job_title}
                    </h2>
                    <SpotsBadge count={job.applicationCount} />
                  </div>
                  <p className="mt-2 text-zinc-500 truncate" title={job.company}>
                    {job.company}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500 truncate">
                    {job.job_location || "Location not listed"}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">
                    Posted {job.first_seen || new Date(job.created_at).toLocaleDateString()}
                  </p>
                  {/* Mini spots bar */}
                  <div className="mt-4 flex gap-0.5 h-1.5 w-full">
                    {Array.from({ length: MAX_APPLICATIONS }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full ${
                          i < job.applicationCount
                            ? remaining <= 2 ? "bg-red-400" : remaining <= 5 ? "bg-amber-400" : "bg-zinc-400"
                            : "bg-zinc-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <RoughButtonEl
                  onClick={(e) => { (e as any)?.stopPropagation?.(); setSelectedJobId(job.id); }}
                  className="mt-6 rounded-lg border border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors w-full"
                >
                  View Details
                </RoughButtonEl>
              </div>
            );
          })}
        </div>

        {isClient && selectedJob && (
          <Popup
            open={!!selectedJob}
            modal
            nested
            onClose={handleCloseSuccess}
          >
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-8">
              <div className="mx-auto max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-zinc-50 p-6">

                {/* ── Success screen ── */}
                {appliedPosition !== null ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-white text-4xl shadow-lg">
                      ✓
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900">Application sent!</h2>
                    <p className="text-lg font-[family-name:var(--font-caveat)] text-zinc-500">
                      {positionMessage(appliedPosition)}
                    </p>
                    <p className="text-sm text-zinc-400 max-w-sm">
                      Your profile and resume have been forwarded to the employer. Check your dashboard for status updates.
                    </p>
                    <RoughButtonEl
                      onClick={handleCloseSuccess}
                      className="mt-4 rounded-lg border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      Back to Jobs
                    </RoughButtonEl>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6 gap-4">
                      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 shrink-0">
                        Job Details
                      </h1>
                      <button
                        onClick={() => setSelectedJobId(null)}
                        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 shrink-0"
                      >
                        Close
                      </button>
                    </div>

                    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-zinc-900 break-words">
                        {selectedJob.job_title}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-500 break-words">
                        {selectedJob.company}
                      </p>
                      <p className="mt-4 text-sm text-zinc-600 break-words">
                        {selectedJob.job_location || "Location not listed"}
                      </p>

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
                                i < selectedJob.applicationCount ? "bg-zinc-500" : "bg-zinc-200"
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
                        <h3 className="text-lg font-medium text-zinc-900 mb-2">Description</h3>
                        <p className="text-zinc-700 whitespace-pre-wrap break-words">
                          {selectedJob.job_summary || selectedJob.description || "No description available."}
                        </p>
                      </div>

                      {selectedJob.job_skills && (
                        <div className="mt-6">
                          <h3 className="text-lg font-medium text-zinc-900 mb-2">Skills</h3>
                          <p className="text-zinc-700 break-words">{selectedJob.job_skills}</p>
                        </div>
                      )}

                      <div className="mt-8 flex flex-col gap-3 border-t border-zinc-100 pt-6">
                        <div className="flex gap-3">
                          <RoughButtonEl
                            onClick={handleApply}
                            disabled={selectedJob.applicationCount >= MAX_APPLICATIONS || !hasResume || isApplying}
                            className={`rounded-lg border px-8 py-2 text-sm font-medium transition-colors ${
                              selectedJob.applicationCount >= MAX_APPLICATIONS || !hasResume || isApplying
                                ? "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                            }`}
                          >
                            {isApplying ? "Applying..." : selectedJob.applicationCount >= MAX_APPLICATIONS ? "Filled" : "Apply"}
                          </RoughButtonEl>
                          <button
                            onClick={() => setSelectedJobId(null)}
                            className="rounded-lg border border-zinc-300 px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                          >
                            Back to Jobs
                          </button>
                        </div>
                        {!hasResume && selectedJob.applicationCount < MAX_APPLICATIONS && (
                          <p className="text-sm font-medium text-red-500 mt-1">
                            * You must add a resume to your profile before applying.
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
}
