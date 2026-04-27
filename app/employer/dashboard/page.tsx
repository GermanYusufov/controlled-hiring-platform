import { MOCK_JOBS } from "../data";
import type { ApplicationStatus } from "@/app/dashboard/data";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; dot: string; badge: string } > = {
  submitted: { label: "Submitted", dot: "bg-zinc-400", badge: "bg-zinc-100 text-zinc-600" },
  viewed: { label: "Viewed", dot: "bg-blue-400", badge: "bg-blue-50 text-blue-700" },
    shortlisted: { label: "Shortlisted", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700" },
    interviewing: { label: "Interviewing", dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700" },
    rejected: { label: "Rejected", dot: "bg-red-400", badge: "bg-red-50 text-red-600" },
    offer: { label: "Offer", dot: "bg-green-500", badge: "bg-green-50 text-green-700" },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { 
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function EmployerJobsPage() {
    const totalApplicants = MOCK_JOBS.reduce((sum, j) => sum + j.applicant_count, 0);

    return (
        <div className="min-h-screen bg-zinc-50 px-4 py-12">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                            Employer Dashboard
                        </h1>
                    </div>
                    <div className="text-right">
                        <h1 className="font-medium text-lg text-zinc-500">
                            Welcome back, Employer!
                        </h1>
                    </div>
                    <button
                        type="button"
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
                        >
                            Logout
                        </button>
                </div>
                {/* Summary cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-md bg-white p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900">Active Jobs</h3>
                        <p className="mt-1 text-2xl font-bold text-zinc-900">{MOCK_JOBS.length}</p>
                    </div>
                    <div className="rounded-md bg-white p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900">Total Applicants</h3>
                        <p className="mt-1 text-2xl font-bold text-zinc-900">{totalApplicants}</p>
                    </div>
                    <div className="rounded-md bg-white p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900">Pending Review</h3>
                        <p className="mt-1 text-2xl font-bold text-zinc-900">
                            {MOCK_JOBS.reduce((sum, j) => sum + j.candidates.filter(c => c.status === "submitted").length, 0)}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-zinc-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <a
                            href="#"
                            className="border-b-2 border-blue-500 px-1 py-4 text-sm font-medium text-blue-600"
                        >
                            My Job Postings
                        </a>
                        <a
                            href="#"
                            className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                        >
                            Applications: {totalApplicants}
                        </a>
                        <a
                            href="#"
                            className="border-b-2 border-transparent px-1 py-4 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                        >
                            + Post New Job
                        </a>
                    </nav>
                </div>
                {/* List of jobs with applicant counts */}
                <div className="space-y-4">
                    {MOCK_JOBS.map((job) => (
                        <a key={job.id} href={`/jobs/${job.id}`} className="block rounded-lg border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-900">{job.title}</h2>
                                    <p className="text-sm text-zinc-500">{job.location} • {job.employment_type}</p>
                                    <p className="text-sm text-zinc-500">Posted on {formatDate(job.posted_at)}</p>
                                </div>
                                <div className="text-sm text-zinc-500">
                                    {job.applicant_count} applicants
                                </div>
                                
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    ); 
}
