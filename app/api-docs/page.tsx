import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "API",
  description: "Public search API for omnisiv — find agents, MCP servers, and AI tools.",
};

const SAMPLE_RESPONSE = `{
  "query": "mcp",
  "count": 1,
  "results": [
    {
      "id": "2",
      "name": "Firecrawl MCP",
      "slug": "firecrawl-mcp",
      "url": "https://omnisiv.com/agent/firecrawl-mcp",
      "short_description": "MCP server for web scraping and structured data extraction.",
      "website_url": "https://firecrawl.dev",
      "github_url": "https://github.com/mendableai/firecrawl",
      "docs_url": "https://docs.firecrawl.dev",
      "mcp_url": "https://github.com/mendableai/firecrawl-mcp-server",
      "pricing_type": "freemium",
      "is_open_source": true,
      "is_self_hostable": true,
      "has_api": true,
      "has_mcp": true,
      "agent_ready_score": 100,
      "rating": 4.4,
      "review_count": 420,
      "categories": [{ "name": "Data", "slug": "data" }],
      "tags": [
        { "name": "MCP", "slug": "mcp" },
        { "name": "Open Source", "slug": "open-source" }
      ]
    }
  ]
}`;

const PARAMS = [
  { name: "q", type: "string", description: "Full-text search query" },
  { name: "has_mcp", type: "boolean", description: "Filter to agents with an MCP server" },
  { name: "has_api", type: "boolean", description: "Filter to agents with a public API" },
  { name: "open_source", type: "boolean", description: "Filter to open-source agents" },
  { name: "category", type: "string", description: "Category slug — e.g. coding, research, data, multi-agent" },
  {
    name: "sort",
    type: "string",
    description: "relevance (default) · score · rating · newest",
  },
  { name: "limit", type: "number", description: "Results to return — default 20, max 50" },
] as const;

const EXAMPLES = [
  { label: "/api/search?q=mcp&limit=5", href: "/api/search?q=mcp&limit=5" },
  { label: "/api/search?has_mcp=true&sort=score", href: "/api/search?has_mcp=true&sort=score" },
  {
    label: "/api/search?q=web+scraping&has_mcp=true",
    href: "/api/search?q=web+scraping&has_mcp=true",
  },
] as const;

export default function ApiDocsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-2xl space-y-12">

          {/* Title */}
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">API</h1>
            <p className="text-muted-foreground">
              Public search API for omnisiv. No auth required.
            </p>
          </div>

          {/* Endpoint */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Endpoint
            </h2>
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                GET
              </span>
              <code className="font-mono text-sm">/api/search</code>
            </div>
          </section>

          {/* Parameters */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Parameters
            </h2>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                      Param
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {PARAMS.map(({ name, type, description }) => (
                    <tr key={name}>
                      <td className="px-4 py-3">
                        <code className="font-mono text-xs">{name}</code>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {type}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Examples */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Examples
            </h2>
            <ul className="space-y-2">
              {EXAMPLES.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-sm text-primary hover:underline underline-offset-4"
                  >
                    {label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="size-3 opacity-50"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Sample response */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Response
            </h2>
            <pre className="overflow-x-auto rounded-lg border bg-muted/30 px-4 py-4 font-mono text-xs leading-relaxed text-foreground/80">
              {SAMPLE_RESPONSE}
            </pre>
          </section>

          {/* Notes */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Notes
            </h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="select-none text-muted-foreground/50">—</span>
                No authentication required.
              </li>
              <li className="flex gap-2">
                <span className="select-none text-muted-foreground/50">—</span>
                Only published agents are returned.
              </li>
              <li className="flex gap-2">
                <span className="select-none text-muted-foreground/50">—</span>
                Results use the same ranking as the website.
              </li>
              <li className="flex gap-2">
                <span className="select-none text-muted-foreground/50">—</span>
                Boolean params accept{" "}
                <code className="font-mono text-xs">true</code> or{" "}
                <code className="font-mono text-xs">1</code>.
              </li>
              <li className="flex gap-2">
                <span className="select-none text-muted-foreground/50">—</span>
                <code className="font-mono text-xs">agent_ready_score</code> is
                a 0–100 signal of how agent-friendly a tool is (MCP, API,
                structure, docs, etc.).
              </li>
            </ul>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
