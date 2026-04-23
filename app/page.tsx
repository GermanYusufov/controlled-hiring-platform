export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Nav */}
      <header className="border-b border-zinc-100">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight text-zinc-900">
            Hiring Application
          </span>
          <nav className="flex items-center gap-4">
            <a
              href="/login"
              className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="text-sm font-medium rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 transition-colors"
            >
              Get started
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
            Hiring that&apos;s fair,
            <br />
            consistent, and controlled.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500">
            A structured hiring platform that reduces bias, standardises
            evaluations, and gives your team a clear, auditable process from
            application to offer.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/signup"
              className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              Start for free
            </a>
            <a
              href="/demo"
              className="rounded-lg border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              View demo
            </a>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-zinc-100 bg-zinc-50 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-2xl font-semibold text-zinc-900">
              Everything you need for a controlled process
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-zinc-900">
                  Structured scorecards
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Define criteria before interviews begin so every evaluator
                  rates candidates against the same bar.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-zinc-900">
                  Team collaboration
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Invite interviewers, assign roles, and collect independent
                  feedback before the debrief.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-zinc-900">
                  Audit &amp; analytics
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Track decision rationale end-to-end and surface patterns that
                  reveal where bias or bottlenecks creep in.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-3xl font-bold text-zinc-900">
              Ready to take control of hiring?
            </h2>
            <p className="mt-4 text-zinc-500">
              Set up your first role in minutes. No credit card required.
            </p>
            <a
              href="/signup"
              className="mt-8 inline-block rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              Get started for free
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-zinc-400">
          &copy; {new Date().getFullYear()} HireControl. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
