// app/dashboard/ApplicationRow.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Application, ApplicationStatus } from "./data";

const Popup = dynamic(() => import("reactjs-popup"), { ssr: false });

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; dot: string; badge: string }> = {
  submitted: { label: "Submitted", dot: "bg-zinc-400", badge: "bg-zinc-100 text-zinc-600" },
  viewed: { label: "Viewed", dot: "bg-blue-400", badge: "bg-blue-50 text-blue-700" },
  shortlisted: { label: "Shortlisted", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700" },
  interviewing: { label: "Interviewing", dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700" },
  rejected: { label: "Rejected", dot: "bg-red-400", badge: "bg-red-50 text-red-600" },
  offer: { label: "Offer", dot: "bg-green-500", badge: "bg-green-50 text-green-700" },
};

function formatDate(iso: string) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function relativeTime(iso: string) {
  if (!iso) return "N/A";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function ApplicationRow({ app }: { app: Application }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => setIsClient(true), []);

  const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.submitted;

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4 last:border-0 hover:bg-zinc-50 transition-colors cursor-pointer"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-zinc-900">{app.job_title}</p>
          <p className="mt-0.5 truncate text-sm text-zinc-500">
            {app.company_name}
            {app.location ? ` · ${app.location}` : ""}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Applied {formatDate(app.applied_at)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <p className="text-xs text-zinc-400">
            Updated {relativeTime(app.status_updated_at)}
          </p>
        </div>
      </div>

      {isClient && (
        <Popup open={isOpen} modal nested onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-8">
            <div className="mx-auto max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-zinc-50 p-6">
              <div className="flex items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 shrink-0">
                  Application Details
                </h1>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 shrink-0"
                >
                  Close
                </button>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-zinc-900 break-words">{app.job_title}</h2>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${cfg.badge}`}>
                    <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>
                
                <p className="text-sm text-zinc-500 break-words">{app.company_name}</p>
                <p className="mt-2 text-sm text-zinc-600 break-words">{app.location || "Location not listed"}</p>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-zinc-900 mb-2">Job Description</h3>
                  <p className="text-zinc-700 whitespace-pre-wrap break-words">
                    {app.job_summary || "No description available."}
                  </p>
                </div>

                {app.job_skills && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">Required Skills</h3>
                    <p className="text-zinc-700 break-words">{app.job_skills}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}