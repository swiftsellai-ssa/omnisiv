import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-xl font-semibold tracking-tight">omnisiv</span>
      </Link>
    </header>
  );
}
