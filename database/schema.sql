-- 1. ENUMS for standardized statuses
CREATE TYPE user_role AS ENUM ('applicant', 'employer');
CREATE TYPE application_status AS ENUM ('SUBMITTED', 'VIEWED', 'SHORTLISTED', 'REJECTED', 'INTERVIEW');
CREATE TYPE profile_availability AS ENUM ('available', 'unavailable');

-- 2. User Table (Extending Supabase Auth)
CREATE TABLE "User" (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Applicant Profile Table
CREATE TABLE "ApplicantProfile" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_role VARCHAR(255),
    skills TEXT,
    experience_summary TEXT,
    education TEXT,
    resume_url VARCHAR(500),
    availability_status profile_availability DEFAULT 'available'
);

-- 4. Company Profile Table
CREATE TABLE "CompanyProfile" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL
);

-- 5. Job Posting Table
CREATE TABLE "JobPosting" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES "CompanyProfile"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'open',
    application_limit INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Application Table
CREATE TABLE "Application" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES "JobPosting"(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES "ApplicantProfile"(id) ON DELETE CASCADE,
    status application_status DEFAULT 'SUBMITTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (job_id, applicant_id) 
);

-- 7. Application Credit Table
CREATE TABLE "ApplicationCredit" (
    user_id UUID PRIMARY KEY REFERENCES "User"(id) ON DELETE CASCADE,
    total_credits INT DEFAULT 0 NOT NULL,
    used_credits INT DEFAULT 0 NOT NULL
);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE "ApplicantProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CompanyProfile" ENABLE ROW LEVEL SECURITY;

-- Job Seekers can only update their own profile
CREATE POLICY "Users can edit their own applicant profile" 
ON "ApplicantProfile" FOR ALL 
USING (auth.uid() = user_id);

-- Employers can only update their own company profile
CREATE POLICY "Users can edit their own company profile" 
ON "CompanyProfile" FOR ALL 
USING (auth.uid() = user_id);

-- Create a function to handle new user sign-ups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (id, email, role)
  VALUES (
    new.id, 
    new.email, 
    -- You can set a default role here, or update it later during the onboarding flow
    'applicant'::user_role 
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger that fires when a Google Auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

ALTER TABLE "ApplicantProfile"
ADD CONSTRAINT applicant_profile_user_id_unique UNIQUE (user_id);

ALTER TABLE "CompanyProfile"
ADD CONSTRAINT company_profile_user_id_unique UNIQUE (user_id);