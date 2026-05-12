// app/employer/jobs/[jobId]/JobManager.tsx
"use client";

import { useState } from "react";
import { updateJobPosting, deleteJobPosting } from "./actions";

export default function JobManager({ job, applicants }: { job: any, applicants: any[] }) {
    const [activeTab, setActiveTab] = useState<"applicants" | "edit">("applicants");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData = new FormData(e.currentTarget);
        try {
            await updateJobPosting(job.id, formData);
            alert("Job updated successfully!");
            setActiveTab("applicants");
        } catch (err) {
            alert("Failed to update job.");
        }
        setIsUpdating(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this job? This will also delete all applications associated with it. This action cannot be undone.")) return;

        setIsDeleting(true);
        try {
            await deleteJobPosting(job.id);
        } catch (err) {
            alert("Failed to delete job.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="mt-8">
            {/* Tabs */}
            <div className="flex border-b border-zinc-200 mb-6">
                <button
                    onClick={() => setActiveTab("applicants")}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === "applicants" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
                        }`}
                >
                    Applicants ({applicants.length})
                </button>
                <button
                    onClick={() => setActiveTab("edit")}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === "edit" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
                        }`}
                >
                    Edit Job Details
                </button>
            </div>

            {/* Tab Content: Applicants */}
            {activeTab === "applicants" && (
                <div className="space-y-4">
                    {applicants.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 bg-white">
                            No applicants yet. Check back soon!
                        </div>
                    ) : (
                        applicants.map((app) => (
                            <div key={app.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm flex justify-between items-center">
                                <div>
                                    {/* FIXED: Added ?. to safely handle missing profiles */}
                                    <h3 className="font-semibold text-zinc-900">{app.applicant?.name || "Unknown Applicant"}</h3>
                                    <p className="text-sm text-zinc-500">Role: {app.applicant?.target_role || "Not specified"}</p>

                                    {app.applicant?.resume_url && (
                                        <a href={app.applicant.resume_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 inline-block">
                                            View Resume
                                        </a>
                                    )}
                                </div>
                                <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-medium uppercase">
                                    {app.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Tab Content: Edit Job */}
            {activeTab === "edit" && (
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700">Job Title</label>
                            <input required type="text" name="job_title" defaultValue={job.job_title} className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">Location</label>
                                <input type="text" name="job_location" defaultValue={job.job_location} className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700">Job Type</label>
                                <select name="job_type" defaultValue={job.job_type} className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900 bg-white">
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700">Job Level</label>
                            <select name="job_level" defaultValue={job.job_level} className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900 bg-white">
                                <option value="Entry Level">Entry Level</option>
                                <option value="Mid Level">Mid Level</option>
                                <option value="Senior Level">Senior Level</option>
                                <option value="Executive">Executive</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700">Job Summary</label>
                            <textarea name="job_summary" rows={4} defaultValue={job.job_summary} className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900 resize-none" />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700">Skills (Comma separated)</label>
                            <input type="text" name="job_skills" defaultValue={job.job_skills} className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900" />
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-5">
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                {isDeleting ? "Deleting..." : "Delete Job"}
                            </button>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
                            >
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}