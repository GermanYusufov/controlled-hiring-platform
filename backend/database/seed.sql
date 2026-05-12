-- Artificial Seeding Script
-- Adds demo users, profiles, companies, jobs, applications, and credits

INSERT INTO auth.users (id, email)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'applicant1@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'applicant2@example.com'),
  ('33333333-3333-3333-3333-333333333333', 'employer1@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public."User" (id, email, role)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'applicant1@example.com', 'applicant'),
  ('22222222-2222-2222-2222-222222222222', 'applicant2@example.com', 'applicant'),
  ('33333333-3333-3333-3333-333333333333', 'employer1@example.com', 'employer')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public."ApplicantProfile" (id, user_id, name, target_role, skills, experience_summary, education, availability_status)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Jane Smith', 'Frontend Developer', 'React, Next.js, TypeScript', 'Junior frontend developer focused on clean UI and responsive web apps.', 'Brooklyn College - Computer Science', 'available'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'David Cohen', 'Data Analyst', 'SQL, Python, Excel, Tableau', 'Entry-level analyst interested in business intelligence and reporting.', 'CUNY - Information Systems', 'available')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public."CompanyProfile" (id, user_id, company_name, description, location, contact_email)
VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'NY Tech Group', 'Small technology company hiring junior technical talent.', 'Brooklyn, NY', 'hr@nytechgroup.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public."JobPosting" (id, company_id, title, description, requirements, location, status, application_limit)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Junior Frontend Developer', 'Build responsive web pages and frontend features.', 'React, TypeScript, CSS', 'New York, NY', 'open', 10),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Data Analyst Intern', 'Support reporting and analytics projects.', 'SQL, Excel, Python', 'Remote', 'open', 15)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public."Application" (job_id, applicant_id, status)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SUBMITTED'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'VIEWED')
ON CONFLICT (job_id, applicant_id) DO NOTHING;

INSERT INTO public."ApplicationCredit" (user_id, total_credits, used_credits)
VALUES
  ('11111111-1111-1111-1111-111111111111', 5, 1),
  ('22222222-2222-2222-2222-222222222222', 5, 1)
ON CONFLICT (user_id) DO NOTHING;