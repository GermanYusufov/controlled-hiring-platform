export default function SignupConfirmPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-2xl">
          ✉️
        </div>
        <h1 className="text-xl font-bold text-zinc-900">Check your email</h1>
        <p className="mt-2 text-sm text-zinc-500">
          We sent a confirmation link to your email address. Click it to
          activate your account and get started.
        </p>
        <a
          href="/"
          className="mt-6 inline-block text-sm font-medium text-zinc-900 hover:underline"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
