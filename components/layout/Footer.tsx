import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto px-6 py-6 text-center text-sm text-muted-foreground">
      <p>
        omnisiv — All agents. One search.{" "}
        <span className="text-muted-foreground/70">
          The search engine for the Agent Web.
        </span>
      </p>
      <p className="mt-2 text-muted-foreground/70">
        <Link
          href="/api-docs"
          className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
        >
          API
        </Link>
      </p>
    </footer>
  );
}
