# Sachok Job — Controlled Hiring Platform

A structured, bias-reducing hiring platform that limits every job posting to **10 applicants**, creating a fair and auditable process from application to offer.

---

## Live Demo

**Production:** https://sachok-job.vercel.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Database & Auth** | Supabase (PostgreSQL + Row Level Security) |
| **Auth Strategy** | Supabase SSR + Google OAuth |
| **Server Actions** | Next.js Server Actions (`"use server"`) |
| **Animations** | Penflow (handwriting SVG), Rough Notation (sketch boxes), canvas-confetti |
| **Fonts** | Geist Sans, Geist Mono, Caveat, Dancing Script (Google Fonts) |
| **Deployment** | Vercel |
| **UI Utilities** | reactjs-popup |

---

## Features

### Authentication
- Google OAuth sign-in
- Role-based registration (`applicant` / `employer`)
- Email/password login & signup
- Route guards via Next.js middleware

### Applicant Features
- Guided onboarding flow
- Profile editor — name, target role, skills, education, experience summary
- Resume PDF upload (stored in Supabase Storage)
- Application history tracker with live status badges
- Dashboard with pipeline overview

### Employer Features
- Employer dashboard with live applicant counts per role
- Application review portal
- Job posting management (create, edit, close)
- Per-candidate status progression: `submitted → viewed → shortlisted → interviewing → offer → rejected`

### Hiring System
- Hard cap of **10 applicants per job** — enforced atomically via a Supabase RPC function
- Scarcity indicators on job cards ("🔥 2 spots left!")
- Confetti + in-app success screen on application submission
- Job discovery feed with search, urgency badges, and animated spot bars

---

## Code Snippets

### 1. Atomic application submission (Supabase RPC)

Applications are submitted through a PostgreSQL function to prevent race conditions — no two candidates can claim the last spot simultaneously:

```ts
// app/discovery/jobs-data.ts
export async function applyToJob(jobId: string, applicantId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("apply_for_job", {
    p_job_id: jobId,
    p_applicant_id: applicantId,
  });

  if (error) {
    if (error.message.includes("ALREADY_APPLIED"))
      return { error: "You have already applied for this job." };
    if (error.message.includes("JOB_FILLED"))
      return { error: "Sorry, this job has reached its application limit." };
    return { error: "Something went wrong. Please try again." };
  }

  return { error: null };
}
```

### 2. Scroll-triggered Penflow handwriting animation

The "10" on the landing page draws itself the moment the section enters the viewport, using an `IntersectionObserver`:

```tsx
// components/TenAnimated.tsx
useEffect(() => {
  const el = ref.current;
  if (!el) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        setPlayheadKey((k) => k + 1); // triggers Penflow to animate
      }
    },
    { threshold: 0.4 }
  );

  observer.observe(el);
  return () => observer.disconnect();
}, []);
```

### 3. Server-side auth in the Navbar

The navbar reads the current Supabase session on the server — no client-side flash or loading state. Logged-in users see their email and a Dashboard link; guests see Log in / Get started:

```tsx
// components/Navbar.tsx
export default async function Navbar() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white">
      <nav className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-zinc-500 truncate hidden sm:block">
              {user.email}
            </span>
            <RoughButton href="/dashboard">Dashboard</RoughButton>
          </>
        ) : (
          <>
            <RoughButton href="/login">Log in</RoughButton>
            <a href="/signup">Get started</a>
          </>
        )}
      </nav>
    </header>
  );
}
```

---

## Project Structure

```
app/
  auth/          # OAuth callback & sign-out actions
  dashboard/     # Applicant dashboard
  discovery/     # Job feed + application flow
  employer/      # Employer dashboard, jobs, applications
  onboarding/    # Role-based onboarding form
  profile/       # Applicant profile + resume upload
  login/signup/  # Auth pages
backend/
  database/      # schema.sql + seed.sql
  utils/supabase # Client, server, and middleware Supabase helpers
components/      # Shared UI components
public/          # Static assets, fonts, icons
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Setup

Run [`backend/database/schema.sql`](backend/database/schema.sql) against your Supabase project to create tables, enums, and RLS policies. Optionally seed with [`backend/database/seed.sql`](backend/database/seed.sql).

---

## Deployment

Deployed on [Vercel](https://vercel.com). Set the two Supabase environment variables in your Vercel project settings and push to `main`.


---

## Tech Stack

- Next.js
- TypeScript
- Supabase
- Tailwind CSS
- Vercel

---

## Database Tables

Main Supabase tables:

- User
- ApplicantProfile
- CompanyProfile
- JobPosting
- Application
- ApplicationCredit
- ApplicantSkill
- ApplicantEducation
- Skill

---

## Main Pages

### Homepage
Landing page introducing the hiring platform and core workflow.

### Discovery Page
Browse jobs from the Supabase database with controlled application limits.

### Applicant Dashboard
Track:
- Submitted applications
- Active applications
- Shortlisted jobs
- Offers

### Profile Page
Manage:
- Personal information
- Skills
- Education
- Resume uploads

### Employer Dashboard
Employers can:
- Manage applicants
- Review applications
- Track hiring pipeline

---

## Resume Upload

Applicants can upload PDF resumes directly from the profile page.

### Validation
- PDF files only
- Maximum file size: 5MB

---

## Completed Tasks

- Setup Supabase
- Google Authentication
- Homepage UI
- Employer Dashboard UI
- Candidate Profile Editor
- Job Discovery Feed
- Application Review Portal
- Profile Management APIs
- Artificial Seeding Script
- Middleware & Route Guards
- RLS Policies
- Resume Storage Service
- Resume PDF Upload
- Hiring Pipeline Updates
- Database Schema Implementation
- Vercel Deployment
- Controlled Job Application Limits

---

## Project Structure

```bash
app/
├── auth/
├── dashboard/
├── discovery/
├── employer/
├── login/
├── onboarding/
├── profile/
├── signup/

components/
database/
public/
utils/

Deployment

Hosted on Vercel:
https://sachok-job.vercel.app

Contributors
German Yusufov
Ivan Rudik
Freddie Feria
Anna Belenko