import HeroHeading from "@/components/HeroHeading";
import HandwritingTitleClient from "@/components/HandwritingTitleClient";
import TenAnimatedClient from "@/components/TenAnimatedClient";
import FeaturesSection from "@/components/FeaturesSection";
import RoughButton from "@/components/RoughButton";
import JobOfferTitleClient from "@/components/JobOfferTitleClient";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">

      <main className="flex-1">

        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Now in public beta
          </span>
          <HandwritingTitleClient />
          <HeroHeading />
          <p className="mx-auto mt-6 max-w-2xl text-xl text-zinc-500 font-[family-name:var(--font-caveat)]">
            A structured hiring platform that reduces bias, standardises
            evaluations, and gives your team a clear, auditable process from
            application to offer.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <RoughButton
              href="/signup"
              className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
              annotationColor="#ffffff"
            >
              Start for free
            </RoughButton>
            <RoughButton
              href="/login"
              className="rounded-lg border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Log in
            </RoughButton>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-zinc-100 bg-zinc-50 py-10">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
              {[
                { value: "500+", label: "Companies hiring" },
                { value: "12k+", label: "Interviews logged" },
                { value: "40%", label: "Faster time-to-hire" },
                { value: "3×", label: "Less bias reported" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-bold tracking-tight text-zinc-900">{s.value}</p>
                  <p className="mt-1 text-sm text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cover image */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="flex flex-col items-center justify-center py-16 gap-0">
            <object
              data="/Logo_NONAME_vector.svg"
              type="image/svg+xml"
              aria-label="Sachok Job"
              className="w-full max-w-lg"
            />
            <JobOfferTitleClient />
          </div>
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <FeaturesSection>
              <h2 className="text-center text-2xl font-semibold text-zinc-900">
                Everything you need for a controlled process
              </h2>
              <div className="mt-12 grid gap-8 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-zinc-900">Structured scorecards</h3>
                  <p className="mt-2 text-sm text-zinc-500">Define criteria before interviews begin so every evaluator rates candidates against the same bar.</p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-zinc-900">Team collaboration</h3>
                  <p className="mt-2 text-sm text-zinc-500">Invite interviewers, assign roles, and collect independent feedback before the debrief.</p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-zinc-900">Audit &amp; analytics</h3>
                  <p className="mt-2 text-sm text-zinc-500">Track decision rationale end-to-end and surface patterns that reveal where bias or bottlenecks creep in.</p>
                </div>
              </div>
            </FeaturesSection>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 border-t border-zinc-100">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-2xl font-semibold text-zinc-900">How it works</h2>
            <p className="mt-3 text-center text-sm text-zinc-500 max-w-xl mx-auto">
              From posting a role to making an offer — a clear, repeatable process in three steps.
            </p>
            <div className="mt-14 grid gap-12 sm:grid-cols-3 relative">
              {/* connector line (desktop only) */}
              <div className="hidden sm:block absolute top-5 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-zinc-200" />
              {[
                {
                  step: "01",
                  title: "Post a role",
                  desc: "Create a job listing with defined skills, stages, and evaluation criteria before a single CV lands.",
                },
                {
                  step: "02",
                  title: "Review fairly",
                  desc: "Candidates are scored on the same structured rubric. Every interviewer submits blind feedback independently.",
                },
                {
                  step: "03",
                  title: "Decide with confidence",
                  desc: "Compare candidates side-by-side, audit every decision, and make an offer backed by data.",
                },
              ].map((item) => (
                <div key={item.step} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white text-sm font-semibold">
                    {item.step}
                  </div>
                  <h3 className="mt-5 font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-zinc-500 max-w-[220px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 border-t border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-2xl font-semibold text-zinc-900">What teams are saying</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                {
                  quote: "We cut our average time-to-hire from 6 weeks to 3. The scorecards forced us to agree on what we actually wanted before interviewing anyone.",
                  name: "Sarah K.",
                  role: "Head of Talent, Series B startup",
                },
                {
                  quote: "The audit trail alone made it worth it. When a candidate asked why they weren't progressed, we had a clear, documented answer.",
                  name: "Marcus T.",
                  role: "Engineering Manager",
                },
                {
                  quote: "Finally a tool that treats candidates fairly. The blind scoring means we're judging on merit, not memory or mood.",
                  name: "Priya N.",
                  role: "People Ops Lead",
                },
              ].map((t) => (
                <div key={t.name} className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between gap-6">
                  <p className="text-sm text-zinc-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                    <p className="text-xs text-zinc-400">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10 applicants cap */}
        <section className="py-24 border-t border-zinc-100">
          <div className="mx-auto max-w-3xl px-6 text-center">
            {/* Animated number */}
            <div className="flex flex-col items-center">
              <TenAnimatedClient />
              <span className="text-sm font-medium uppercase tracking-widest text-zinc-400 mt-2">max applicants</span>
            </div>
            {/* Text */}
            <div className="mt-8">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                Quality over quantity.
              </h2>
              <p className="mt-4 text-3xl font-[family-name:var(--font-caveat)] text-zinc-500">
                Every role on Sachok Job is visible to job seekers — but only the first 10 to apply get through. Knowing spots fill fast, candidates put real effort in: sharper CVs, considered cover letters, and applications only for roles they genuinely want.
              </p>
              <p className="mt-3 text-3xl font-[family-name:var(--font-caveat)] text-zinc-500">
                You get a shortlist worth reading — not a pile to filter.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-28">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-3xl font-bold text-zinc-900">Ready to take control of hiring?</h2>
            <p className="mt-4 text-zinc-500">Set up your first role in minutes. No credit card required.</p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <RoughButton
                href="/signup"
                className="rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
                annotationColor="#ffffff"
              >
                Get started for free
              </RoughButton>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-10">
        <div className="mx-auto max-w-5xl px-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between text-sm text-zinc-400">
          <span className="font-medium text-zinc-900">Sachok Job</span>
          <div className="flex items-center gap-6">
            <a href="/signup" className="hover:text-zinc-700 transition-colors">Sign up</a>
            <a href="/login" className="hover:text-zinc-700 transition-colors">Log in</a>
            <a href="/discovery" className="hover:text-zinc-700 transition-colors">Browse jobs</a>
          </div>
          <span>&copy; {new Date().getFullYear()} Sachok Job. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
