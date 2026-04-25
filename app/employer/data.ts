// TODO: replace with real Supabase queries once auth is wired up

import type { ApplicationStatus } from "@/app/dashboard/data";

export type Candidate = {
  id: string;
  name: string;
  email: string;
  applied_at: string;
  status: ApplicationStatus;
  status_updated_at: string;
  target_role: string;
  skills: string[];
};

export type Job = {
  id: string;
  title: string;
  location: string;
  employment_type: "Full-time" | "Part-time" | "Contract" | "Freelance";
  posted_at: string;
  applicant_count: number;
  candidates: Candidate[];
};

const now = new Date();
const daysAgo = (d: number) =>
  new Date(now.getTime() - d * 86_400_000).toISOString();

export const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Frontend Engineer",
    location: "London, UK",
    employment_type: "Full-time",
    posted_at: daysAgo(20),
    applicant_count: 4,
    candidates: [
      {
        id: "c-1",
        name: "Alice Cheng",
        email: "alice@example.com",
        applied_at: daysAgo(14),
        status: "shortlisted",
        status_updated_at: daysAgo(3),
        target_role: "Senior Frontend Engineer",
        skills: ["React", "TypeScript", "Next.js", "GraphQL"],
      },
      {
        id: "c-2",
        name: "Ben Okafor",
        email: "ben@example.com",
        applied_at: daysAgo(12),
        status: "viewed",
        status_updated_at: daysAgo(10),
        target_role: "Frontend Engineer",
        skills: ["Vue", "JavaScript", "CSS", "Node.js"],
      },
      {
        id: "c-3",
        name: "Carla Mendes",
        email: "carla@example.com",
        applied_at: daysAgo(10),
        status: "interviewing",
        status_updated_at: daysAgo(1),
        target_role: "Lead Frontend Engineer",
        skills: ["React", "TypeScript", "AWS", "Docker"],
      },
      {
        id: "c-4",
        name: "David Park",
        email: "david@example.com",
        applied_at: daysAgo(8),
        status: "submitted",
        status_updated_at: daysAgo(8),
        target_role: "Frontend Developer",
        skills: ["JavaScript", "React", "Figma"],
      },
    ],
  },
  {
    id: "job-2",
    title: "Product Designer",
    location: "Remote",
    employment_type: "Full-time",
    posted_at: daysAgo(15),
    applicant_count: 3,
    candidates: [
      {
        id: "c-5",
        name: "Eva Fischer",
        email: "eva@example.com",
        applied_at: daysAgo(9),
        status: "shortlisted",
        status_updated_at: daysAgo(2),
        target_role: "Senior Product Designer",
        skills: ["Figma", "UX Research", "Prototyping"],
      },
      {
        id: "c-6",
        name: "Frank Adeyemi",
        email: "frank@example.com",
        applied_at: daysAgo(7),
        status: "rejected",
        status_updated_at: daysAgo(5),
        target_role: "Product Designer",
        skills: ["Sketch", "Figma", "Adobe XD"],
      },
      {
        id: "c-7",
        name: "Grace Liu",
        email: "grace@example.com",
        applied_at: daysAgo(5),
        status: "offer",
        status_updated_at: daysAgo(0),
        target_role: "Lead Product Designer",
        skills: ["Figma", "Design Systems", "User Testing", "SQL"],
      },
    ],
  },
  {
    id: "job-3",
    title: "Full Stack Developer",
    location: "Edinburgh, UK",
    employment_type: "Contract",
    posted_at: daysAgo(10),
    applicant_count: 2,
    candidates: [
      {
        id: "c-8",
        name: "Hugo Reyes",
        email: "hugo@example.com",
        applied_at: daysAgo(6),
        status: "submitted",
        status_updated_at: daysAgo(6),
        target_role: "Full Stack Engineer",
        skills: ["Node.js", "React", "PostgreSQL", "Docker"],
      },
      {
        id: "c-9",
        name: "Isla Thomson",
        email: "isla@example.com",
        applied_at: daysAgo(4),
        status: "viewed",
        status_updated_at: daysAgo(2),
        target_role: "Backend Developer",
        skills: ["Python", "Django", "AWS", "SQL"],
      },
    ],
  },
];

export function getJob(jobId: string): Job | undefined {
  return MOCK_JOBS.find((j) => j.id === jobId);
}
