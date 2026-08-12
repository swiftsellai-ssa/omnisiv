import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto px-6 py-6 text-center text-sm text-muted-foreground">
      <p>
        Omnisiv — All agents. One search.{" "}
        <span className="text-muted-foreground/70">
          The search engine for the Agent Web.
        </span>
      </p>
      <div className="mt-2 flex items-center justify-center gap-4">
        <Link href="/submit" className="hover:text-foreground transition-colors">
          Submit
        </Link>
        <span className="text-border">·</span>
        <span className="text-muted-foreground/70">API coming soon</span>
      </div>
    </footer>
  );
}
