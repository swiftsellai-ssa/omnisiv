import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/search/SearchBar";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header minimal />
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-3">
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              omnisiv
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              All agents. One search.
            </p>
            <p className="text-sm text-muted-foreground/80">
              The search engine for the Agent Web
            </p>
          </div>

          <SearchBar size="large" autoFocus className="mx-auto" />

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Try:</span>
            {[
              "MCP web scraping",
              "coding agent",
              "multi-agent framework",
              "research agent",
            ].map((example) => (
              <Link
                key={example}
                href={`/search?q=${encodeURIComponent(example)}`}
                className="rounded-full border px-3 py-1 hover:bg-muted hover:text-foreground transition-colors"
              >
                {example}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
