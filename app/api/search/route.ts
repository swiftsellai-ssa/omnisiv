import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { searchAgents } from "@/lib/search";
import type { Agent, AgentPublic, SearchFilters } from "@/types";

const BASE_URL = "https://omnisiv.com";
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const searchSchema = z.object({
  q: z.string().optional(),
  has_mcp: z.coerce.boolean().optional(),
  has_api: z.coerce.boolean().optional(),
  open_source: z.coerce.boolean().optional(),
  category: z.string().optional(),
  sort: z.enum(["relevance", "score", "rating", "newest"]).optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_LIMIT)
    .default(DEFAULT_LIMIT)
    .optional(),
});

function toPublic(agent: Agent): AgentPublic {
  return {
    id: agent.id,
    name: agent.name,
    slug: agent.slug,
    url: `${BASE_URL}/agent/${agent.slug}`,
    short_description: agent.short_description,
    website_url: agent.website_url ?? null,
    github_url: agent.github_url ?? null,
    docs_url: agent.docs_url ?? null,
    mcp_url: agent.mcp_url ?? null,
    pricing_type: agent.pricing_type,
    is_open_source: agent.is_open_source,
    is_self_hostable: agent.is_self_hostable,
    has_api: agent.has_api,
    has_mcp: agent.has_mcp,
    agent_ready_score: agent.agent_ready_score,
    rating: agent.rating,
    review_count: agent.review_count,
    categories: (agent.categories ?? []).map(({ name, slug }) => ({
      name,
      slug,
    })),
    tags: (agent.tags ?? []).map(({ name, slug }) => ({ name, slug })),
  };
}

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = searchSchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { q, has_mcp, has_api, open_source, category, sort, limit } =
    parsed.data;

  const filters: SearchFilters = {
    q,
    has_mcp: has_mcp || undefined,
    has_api: has_api || undefined,
    open_source: open_source || undefined,
    category,
    sort: sort ?? "relevance",
  };

  const agents = await searchAgents(filters);
  const cap = limit ?? DEFAULT_LIMIT;
  const results = agents.slice(0, cap).map(toPublic);

  return NextResponse.json(
    {
      query: q ?? "",
      count: results.length,
      results,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
