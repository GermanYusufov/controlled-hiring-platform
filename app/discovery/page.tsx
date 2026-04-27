"use client";
import { useState, useEffect } from "react";
import { MOCK_JOBS } from "./data";
import dynamic from "next/dynamic";

// Dynamically import Popup with SSR disabled
const Popup = dynamic(() => import("reactjs-popup"), { ssr: false });

export default function DiscoveryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    const filteredJobs = MOCK_JOBS.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedJob = selectedJobId ? MOCK_JOBS.find(j => j.id === selectedJobId) : null;

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="min-h-screen bg-zinc-50 px-4 py-12">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                    Job Discovery
                </h1>
                <p className="mt-2 text-sm text-zinc-500">
                    Explore the latest job openings and find your next opportunity.
                </p>

                {/* Search input */}
                <div className="mt-6">
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                </div>

                {/* Job listings */}
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm hover:border-blue-500 transition-colors">
                            <h3 className="text-lg font-medium text-zinc-900">{job.title}</h3>
                            <p className="mt-1 text-sm text-zinc-500">{job.company}</p>
                            <p className="mt-0.5 text-xs text-zinc-400">
                                Posted {new Date(job.posted_at).toLocaleDateString()}
                            </p>
                            <button
                                onClick={() => setSelectedJobId(job.id)}
                                className="mt-4 inline-block rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>

                {/* Job Details Popup */}
                {isClient && selectedJob && (
                    <Popup
                        open={!!selectedJob}
                        modal
                        nested
                        onClose={() => setSelectedJobId(null)}
                    >
                        <div className="min-h-screen bg-zinc-50 px-4 py-12">
                            <div className="mx-auto max-w-3xl">
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
                                    <h2 className="text-xl font-semibold text-zinc-900">{selectedJob.title}</h2>
                                    <p className="mt-1 text-sm text-zinc-500">{selectedJob.company}</p>
                                    <div className="mt-4 flex items-center gap-4 text-sm text-zinc-600">
                                        <span>{selectedJob.location}</span>
                                        <span>•</span>
                                        <span>{selectedJob.employment_type}</span>
                                        <span>•</span>
                                        <span>{selectedJob.salary_range}</span>
                                    </div>
                                    <p className="mt-2 text-xs text-zinc-400">
                                        Posted {new Date(selectedJob.posted_at).toLocaleDateString()}
                                    </p>

                                    <div className="mt-6">
                                        <h3 className="text-lg font-medium text-zinc-900 mb-2">Description</h3>
                                        <p className="text-zinc-700">{selectedJob.description}</p>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
                                            Apply Now
                                        </button>
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