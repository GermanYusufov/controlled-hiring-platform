# Controlled Hiring Platform

A structured hiring platform built with Next.js and Supabase that creates a fair, trackable, and controlled hiring process by limiting active applications per job posting.

---

## Live Demo

Production:
https://sachok-job.vercel.app

---

## Features

### Authentication
- Google Authentication
- Role-based registration
- Login & signup system
- Route guards & middleware protection

### Applicant Features
- Applicant onboarding flow
- Candidate profile editor
- Skills management
- Education management
- Resume PDF upload
- Application history tracker
- Dashboard analytics

### Employer Features
- Employer dashboard UI
- Application review portal
- Job posting management

### Hiring System
- Controlled application limits
- Atomic application submission logic
- Job discovery feed
- External dataset integration
- Hiring pipeline tracking
- Status management

### Infrastructure
- Supabase database
- Row Level Security (RLS)
- Server Actions
- Middleware authentication
- Responsive UI
- Vercel deployment

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