import Link from "next/link";

import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-xl font-semibold tracking-tight">omnisiv</span>
      </Link>
      <nav className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link
          href="/submit"
          className="hover:text-foreground transition-colors"
        >
          Submit agent
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
