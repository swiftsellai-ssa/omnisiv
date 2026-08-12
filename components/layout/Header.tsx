import Link from "next/link";

export function Header({ minimal = false }: { minimal?: boolean }) {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-xl font-semibold tracking-tight">omnisiv</span>
      </Link>
      {!minimal && (
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link
            href="/submit"
            className="hover:text-foreground transition-colors"
          >
            Submit agent
          </Link>
        </nav>
      )}
    </header>
  );
}
