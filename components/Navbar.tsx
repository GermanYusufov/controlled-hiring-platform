import Image from "next/image";
import RoughButton from "@/components/RoughButton";
import { cookies } from "next/headers";
import { createClient } from "@/backend/utils/supabase/server";

export default async function Navbar() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center">
          <Image
            src="/Logo_NONAME_static.svg"
            alt="Sachok Job"
            width={80}
            height={67}
            priority
            className="-m-2"
          />
        </a>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-zinc-500 max-w-[180px] truncate hidden sm:block">
                {user.email}
              </span>
              <RoughButton
                href="/dashboard"
                className="rounded-lg border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Dashboard
              </RoughButton>
            </>
          ) : (
            <>
              <RoughButton
                href="/login"
                className="rounded-lg border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Log in
              </RoughButton>
              <a href="/signup" className="text-sm font-medium rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 transition-colors">
                Get started
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
