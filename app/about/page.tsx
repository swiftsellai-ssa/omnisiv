import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "About",
  description: "All agents. One search. What omnisiv is, who it’s for, and how listing works.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              About omnisiv
            </h1>
            <p className="text-lg text-muted-foreground">
              All agents. One search.
            </p>
          </div>

          <div className="mt-14 space-y-10 text-sm leading-relaxed text-muted-foreground">
            <section className="space-y-2">
              <h2 className="text-sm font-medium text-foreground">What it is</h2>
              <p>
                A search engine for AI agents, tools, and MCP servers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-medium text-foreground">
                Who it&apos;s for
              </h2>
              <p>
                People and agents looking for a tool. Builders who want to be
                found.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-medium text-foreground">API &amp; MCP</h2>
              <p>
                Public HTTP API and an MCP server (
                <code className="font-mono text-xs">omnisiv-mcp</code>) for
                Cursor, Claude Desktop, Windsurf, and other clients.{" "}
                <Link
                  href="/api-docs"
                  className="text-primary hover:underline underline-offset-4"
                >
                  API docs
                </Link>
                .
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-medium text-foreground">Quality</h2>
              <p>
                Every submission is reviewed by a human before it appears in
                search.{" "}
                <Link
                  href="/submit"
                  className="text-primary hover:underline underline-offset-4"
                >
                  Submit an agent
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
