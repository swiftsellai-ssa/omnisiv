const DEFAULT_BASE = "https://www.omnisiv.com";
const TIMEOUT_MS = 15_000;

export const BASE_URL = (process.env.OMNISIV_API_BASE ?? DEFAULT_BASE).replace(
  /\/$/,
  ""
);

export type SearchAgentsInput = {
  q?: string;
  has_mcp?: boolean;
  has_api?: boolean;
  open_source?: boolean;
  free?: boolean;
  limit?: number;
};

export type CompactAgent = {
  name: string;
  slug: string;
  url: string;
  short_description: string;
  has_mcp: boolean;
  has_api: boolean;
  is_open_source: boolean;
  agent_ready_score: number;
  website_url: string | null;
};

export type SubmitAgentInput = {
  name: string;
  short_description: string;
  website_url?: string;
  submitted_by?: string;
};

export class OmnisivApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: unknown
  ) {
    super(message);
    this.name = "OmnisivApiError";
  }
}

function flag(value: boolean | undefined): string | undefined {
  return value ? "true" : undefined;
}

async function request(
  path: string,
  init: RequestInit
): Promise<{ status: number; json: unknown }> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "User-Agent": "omnisiv-mcp/0.1.0",
        ...init.headers,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    throw new OmnisivApiError(
      `Omnisiv API is unreachable (${BASE_URL}). ${cause}`
    );
  }

  const text = await res.text();
  let json: unknown = text;
  if (text) {
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      throw new OmnisivApiError(
        `Omnisiv API returned non-JSON (HTTP ${res.status}).`,
        res.status,
        text.slice(0, 300)
      );
    }
  }

  return { status: res.status, json };
}

function compact(row: Record<string, unknown>): CompactAgent | null {
  if (typeof row.name !== "string" || typeof row.slug !== "string") return null;
  const slug = row.slug;
  return {
    name: row.name,
    slug,
    url: `${DEFAULT_BASE}/agent/${slug}`,
    short_description:
      typeof row.short_description === "string" ? row.short_description : "",
    has_mcp: Boolean(row.has_mcp),
    has_api: Boolean(row.has_api),
    is_open_source: Boolean(row.is_open_source),
    agent_ready_score: Number(row.agent_ready_score) || 0,
    website_url:
      typeof row.website_url === "string" && row.website_url
        ? row.website_url
        : null,
  };
}

export async function searchAgents(input: SearchAgentsInput): Promise<{
  query: string;
  count: number;
  results: CompactAgent[];
}> {
  const limit = Math.min(Math.max(input.limit ?? 10, 1), 20);
  const params = new URLSearchParams();
  if (input.q?.trim()) params.set("q", input.q.trim());
  const mcp = flag(input.has_mcp);
  const api = flag(input.has_api);
  const oss = flag(input.open_source);
  const free = flag(input.free);
  if (mcp) params.set("has_mcp", mcp);
  if (api) params.set("has_api", api);
  if (oss) params.set("open_source", oss);
  if (free) params.set("free", free);
  params.set("limit", String(limit));

  const { status, json } = await request(`/api/search?${params}`, {
    method: "GET",
  });

  if (status >= 500) {
    throw new OmnisivApiError(
      "Omnisiv search API is down. Try again later.",
      status,
      json
    );
  }
  if (status >= 400) {
    const msg =
      json &&
      typeof json === "object" &&
      "error" in json &&
      typeof json.error === "string"
        ? json.error
        : `Search validation failed (HTTP ${status}).`;
    throw new OmnisivApiError(msg, status, json);
  }

  const payload = json as { query?: string; results?: unknown };
  const rows = Array.isArray(payload.results) ? payload.results : [];
  const results = rows
    .filter((row): row is Record<string, unknown> =>
      Boolean(row && typeof row === "object")
    )
    .map(compact)
    .filter((row): row is CompactAgent => row !== null);

  return {
    query: typeof payload.query === "string" ? payload.query : input.q ?? "",
    count: results.length,
    results,
  };
}

export async function submitAgent(
  input: SubmitAgentInput
): Promise<{ status: number; body: unknown }> {
  const { status, json } = await request("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input.name,
      short_description: input.short_description,
      website_url: input.website_url || undefined,
      submitted_by: input.submitted_by || undefined,
    }),
  });

  if (status >= 500) {
    throw new OmnisivApiError(
      "Omnisiv submit API is down. Try again later.",
      status,
      json
    );
  }

  return { status, body: json };
}
