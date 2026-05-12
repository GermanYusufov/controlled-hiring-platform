import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
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
          <a href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
            Log in
          </a>
          <a href="/signup" className="text-sm font-medium rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 transition-colors">
            Get started
          </a>
        </nav>
      </div>
    </header>
  );
}
