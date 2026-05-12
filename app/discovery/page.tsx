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
        <div className="min-h-screen bg-zinc-50 px-4 py-12">
            <div className="mx-auto max-w-4xl">
                {/*Header */}
                <a
                href="/profile"
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-red-100 transition-colors" 
                >
                    Back to Profile
                </a>

                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                    Job Discovery
                </h1>
                <p className="mt-2 text-sm text-zinc-500">
                    Explore the latest job openings and find your next opportunity.
                </p>

                {/* Job listings */}
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm hover:border-blue-500 transition-colors">
                            <h3 className="text-lg font-medium text-zinc-900">{job.title}</h3>
                            <p className="mt-1 text-sm text-zinc-500">{job.company}</p>
                            <p className="mt-0.5 text-xs text-zinc-400">
                                Posted {new Date(job.posted_at).toLocaleDateString()}
                            </p>
                            <button onClick={() => setSelectedJobId(job.id)} className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                                View Details 
                            </button>

                            {/*Job Details Popout */}
                            {selectedJobId === job.id && selectedJob && (
                                <Popup open={true} onClose={() => setSelectedJobId(null)} modal nested>
                                    <div className="rounded-lg bg-white p-6 shadow-lg max-w-md mx-auto">
                                        <h2 className="text-xl font-bold text-zinc-900">{selectedJob.title}</h2>
                                        <p className="mt-2 text-sm text-zinc-500">{selectedJob.company}</p>
                                        <p className="mt-4 text-sm text-zinc-700">{selectedJob.description}</p>
                                        <p className="mt-4 text-xs text-zinc-400">
                                            Posted on {new Date(selectedJob.posted_at).toLocaleDateString()}
                                        </p>
                                        <p className="mt-4 text-sm text-zinc-500">
                                            Location: {selectedJob.location}
                                        </p>
                                        <p className="mt-4 text-sm text-zinc-500">
                                            Salary: {selectedJob.salary_range}
                                        </p>
                                        <p className="mt-4 text-sm text-zinc-500">
                                            Job Type: {selectedJob.employment_type}
                                        </p>
                                        <button onClick={() => alert("Apply functionality coming soon!")} className="mt-6 inline-block rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors">
                                            Apply Now 
                                        </button>

                                        <button onClick={() => setSelectedJobId(null)} className="mt-6 inline-block rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 transition-colors">
                                            Close
                                        </button>
                                    </div>
                                </Popup>
                            )}
                        </div>
                    ))}
                </div>
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
}