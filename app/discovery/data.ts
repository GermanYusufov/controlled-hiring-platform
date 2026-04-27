export type Job = {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  employment_type: "Full-time" | "Part-time" | "Contract" | "Freelance";
  posted_at: string;
  applicant_count: number;
  salary_range: string;
};

export const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp",
    description: "Build scalable web applications with React and TypeScript",
    location: "New York, NY",
    employment_type: "Full-time",
    posted_at: "2024-05-01",
    salary_range: "$120k - $150k",
    applicant_count: 0
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    description: "Work on modern web stack with React and Node.js",
    location: "San Francisco, CA",
    employment_type: "Full-time",
    posted_at: "2024-05-10",
    salary_range: "$110k - $140k",
    applicant_count: 0
  },
  {
    id: "3",
    title: "Frontend Developer",
    company: "DesignStudio",
    description: "Create beautiful user interfaces with React and CSS",
    location: "Remote",
    employment_type: "Contract",
    posted_at: "2024-05-15",
    salary_range: "$80k - $100k",
    applicant_count: 0
  },
  

];