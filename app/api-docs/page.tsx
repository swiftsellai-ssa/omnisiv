import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "API",
  description:
    "Public search and submit API for omnisiv — find agents, MCP servers, and AI tools.",
};

const HOST = "https://www.omnisiv.com";

const SEARCH_PARAMS = [
  { name: "q", type: "string", description: "Full-text search query" },
  { name: "has_mcp", type: "boolean", description: "Agents with an MCP server" },
  { name: "has_api", type: "boolean", description: "Agents with a public API" },
  { name: "open_source", type: "boolean", description: "Open-source license (is_open_source)" },
  {
    name: "free",
    type: "boolean",
    description: "Free to use — pricing_type is free or open_source",
  },
  {
    name: "category",
    type: "string",
    description: "Category slug — coding, research, data, multi-agent",
  },
  {
    name: "sort",
    type: "string",
    description: "relevance (default) · score · rating · newest",
  },
  { name: "limit", type: "number", description: "Results to return — default 20, max 50" },
] as const;

const SEARCH_EXAMPLES = [
  { path: "/api/search?q=mcp&limit=5" },
  { path: "/api/search?has_mcp=true&sort=score" },
  { path: "/api/search?q=web+scraping&has_mcp=true&free=true" },
] as const;

const SUBMIT_FIELDS = [
  { name: "name", type: "string", description: "Required. 2–80 characters." },
  {
    name: "short_description",
    type: "string",
    description: "Required. Max 160 characters.",
  },
  { name: "website_url", type: "string", description: "Optional. Valid URL." },
  {
    name: "submitted_by",
    type: "string",
    description: "Optional. Contact string, max 120 characters.",
  },
] as const;

const SEARCH_SAMPLE = `{
  "query": "mcp",
  "count": 1,
  "results": [
    {
      "id": "2",
      "name": "Firecrawl MCP",
      "slug": "firecrawl-mcp",
      "url": "${HOST}/agent/firecrawl-mcp",
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
      "last_verified_at": "2026-08-24T00:00:00.000Z",
      "categories": [{ "name": "Data", "slug": "data" }],
      "tags": [
        { "name": "MCP", "slug": "mcp" },
        { "name": "Open Source", "slug": "open-source" }
      ]
    }
  ]
}`;

const SUBMIT_BODY = `{
  "name": "Firecrawl MCP",
  "short_description": "MCP server for web scraping and structured data extraction.",
  "website_url": "https://firecrawl.dev",
  "submitted_by": "you@example.com"
}`;

const SUBMIT_SUCCESS = `{
  "ok": true,
  "status": "pending",
  "message": "Submission received. We review all agents manually."
}`;

const SUBMIT_ERROR = `{
  "ok": false,
  "error": "name must be at least 2 characters"
}`;

const SUBMIT_CURL = `curl -X POST ${HOST}/api/submit \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Firecrawl MCP",
    "short_description": "MCP server for web scraping and structured data extraction.",
    "website_url": "https://firecrawl.dev",
    "submitted_by": "you@example.com"
  }'`;

const MCP_INSTALL = "npx -y omnisiv-mcp";

const MCP_CONFIG = `{
  "mcpServers": {
    "omnisiv": {
      "command": "npx",
      "args": ["-y", "omnisiv-mcp"]
    }
  }
}`;



function MethodBadge({ method }: { method: "GET" | "POST" }) {
  return (
    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
      {method}
    </span>
  );
}

function ParamTable({
  columns,
  rows,
}: {
  columns: [string, string, string];
  rows: readonly { name: string; type: string; description: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2.5 text-left font-medium text-muted-foreground"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map(({ name, type, description }) => (
            <tr key={name}>
              <td className="px-4 py-3">
                <code className="font-mono text-xs">{name}</code>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{type}</td>
              <td className="px-4 py-3 text-muted-foreground">{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted/30 px-4 py-4 font-mono text-xs leading-relaxed text-foreground/80">
      {children}
    </pre>
  );
}

function ExternalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="size-3 opacity-50"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-2xl space-y-14">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">API</h1>
            <p className="text-muted-foreground">
              Public endpoints for search and submissions, plus an MCP server.
              No auth required.
            </p>
          </div>

          {/* Search API */}
          <section className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Search API
              </h2>
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
                <MethodBadge method="GET" />
                <code className="font-mono text-sm">/api/search</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Returns published agents. Same ranking as the website. Default{" "}
                <code className="font-mono text-xs">limit</code> is 20, max 50.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Query params
              </h3>
              <ParamTable
                columns={["Param", "Type", "Description"]}
                rows={SEARCH_PARAMS}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Examples
              </h3>
              <ul className="space-y-2">
                {SEARCH_EXAMPLES.map(({ path }) => (
                  <li key={path}>
                    <Link
                      href={`${HOST}${path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-sm text-primary hover:underline underline-offset-4"
                    >
                      {path}
                      <ExternalIcon />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Response
              </h3>
              <p className="text-sm text-muted-foreground">
                <code className="font-mono text-xs">
                  {"{ query, count, results: AgentPublic[] }"}
                </code>
              </p>
              <CodeBlock>{SEARCH_SAMPLE}</CodeBlock>
            </div>
          </section>

          {/* Submit API */}
          <section className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Submit API
              </h2>
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
                <MethodBadge method="POST" />
                <code className="font-mono text-sm">/api/submit</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Queues an agent for manual review.{" "}
                <code className="font-mono text-xs">Content-Type: application/json</code>
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Body
              </h3>
              <ParamTable
                columns={["Field", "Type", "Description"]}
                rows={SUBMIT_FIELDS}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Sample request
              </h3>
              <CodeBlock>{SUBMIT_BODY}</CodeBlock>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                curl
              </h3>
              <CodeBlock>{SUBMIT_CURL}</CodeBlock>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Responses
              </h3>
              <p className="text-sm text-muted-foreground">
                <code className="font-mono text-xs">201</code> success
              </p>
              <CodeBlock>{SUBMIT_SUCCESS}</CodeBlock>
              <p className="text-sm text-muted-foreground">
                <code className="font-mono text-xs">400</code> validation error
              </p>
              <CodeBlock>{SUBMIT_ERROR}</CodeBlock>
            </div>
          </section>

          {/* MCP */}
          <section className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                MCP
              </h2>
              <p className="text-sm text-muted-foreground">
                Omnisiv MCP server for Cursor, Claude Desktop, Windsurf, and
                other MCP clients. npm package{" "}
                <a
                  href="https://www.npmjs.com/package/omnisiv-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-primary hover:underline underline-offset-4"
                >
                  omnisiv-mcp
                </a>
                .
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Install / run
              </h3>
              <CodeBlock>{MCP_INSTALL}</CodeBlock>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Config
              </h3>
              <p className="text-sm text-muted-foreground">
                Cursor, Claude Desktop, and Windsurf.
              </p>
              <CodeBlock>{MCP_CONFIG}</CodeBlock>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Tools
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="select-none text-muted-foreground/50">—</span>
                  <span>
                    <code className="font-mono text-xs">search_agents</code> —
                    search agents, tools, and MCP servers
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="select-none text-muted-foreground/50">—</span>
                  <span>
                    <code className="font-mono text-xs">submit_agent</code> —
                    submit an agent for manual review
                  </span>
                </li>
              </ul>
            </div>

            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="select-none text-muted-foreground/50">—</span>
                Uses the public omnisiv API. No admin tools.
              </li>
              <li className="flex gap-2">
                <span className="select-none text-muted-foreground/50">—</span>
                Optional env{" "}
                <code className="font-mono text-xs">OMNISIV_API_BASE</code>{" "}
                (default{" "}
                <code className="font-mono text-xs">https://www.omnisiv.com</code>
                ).
              </li>
            </ul>
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
                Search returns only published agents, ranked the same as the site.
              </li>
              <li className="flex gap-2">
                <span className="select-none text-muted-foreground/50">—</span>
                Boolean params accept{" "}
                <code className="font-mono text-xs">true</code> or{" "}
                <code className="font-mono text-xs">1</code>.
              </li>
              <li className="flex gap-2">
                <span className="select-none text-muted-foreground/50">—</span>
                <code className="font-mono text-xs">open_source</code> is license;{" "}
                <code className="font-mono text-xs">free</code> is pricing (
                <code className="font-mono text-xs">free</code> or{" "}
                <code className="font-mono text-xs">open_source</code>).
              </li>
              <li className="flex gap-2">
                <span className="select-none text-muted-foreground/50">—</span>
                Submissions stay pending until a human approves them. They are
                not published automatically.
              </li>
              <li className="flex gap-2">
                <span className="select-none text-muted-foreground/50">—</span>
                Use{" "}
                <code className="font-mono text-xs">https://www.omnisiv.com</code>{" "}
                as the host. The apex domain redirects with 308.
              </li>
              <li className="flex gap-2">
                <span className="select-none text-muted-foreground/50">—</span>
                <code className="font-mono text-xs">agent_ready_score</code> is
                a 0–100 signal of how agent-friendly a tool is (MCP, API,
                structure, docs).
              </li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
