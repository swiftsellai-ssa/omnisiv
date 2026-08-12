import type { Agent } from "@/types";

/** Columns safe for PostgREST (excludes vector/tsvector types). */
export const AGENT_COLUMNS = `
  id,
  name,
  slug,
  short_description,
  description,
  website_url,
  github_url,
  demo_url,
  docs_url,
  mcp_url,
  pricing_type,
  pricing_details,
  is_open_source,
  is_self_hostable,
  has_api,
  has_mcp,
  is_structured,
  payment_ready,
  rating,
  review_count,
  view_count,
  agent_ready_score,
  status,
  source,
  created_at,
  updated_at,
  published_at
`.trim();

type AgentRow = {
  agent_categories?: { categories: { id: string; name: string; slug: string } }[];
  agent_tags?: { tags: { id: string; name: string; slug: string } }[];
} & Omit<Agent, "categories" | "tags">;

export function mapAgentRow(row: AgentRow): Agent {
  return {
    ...row,
    rating: Number(row.rating),
    agent_ready_score: Number(row.agent_ready_score),
    categories:
      row.agent_categories?.map((ac) => ac.categories).filter(Boolean) ?? [],
    tags: row.agent_tags?.map((at) => at.tags).filter(Boolean) ?? [],
  };
}

export function agentSelectQuery(withCategoryFilter: boolean): string {
  const categoryJoin = withCategoryFilter ? "!inner" : "";
  return `
    ${AGENT_COLUMNS},
    agent_categories${categoryJoin} (
      categories${categoryJoin} ( id, name, slug )
    ),
    agent_tags (
      tags ( id, name, slug )
    )
  `;
}

export function logSupabaseError(context: string, error: unknown) {
  if (!error || typeof error !== "object") {
    console.error(`[Omnisiv] ${context}:`, error);
    return;
  }
  const e = error as { message?: string; code?: string; details?: string; hint?: string };
  console.error(
    `[Omnisiv] ${context}:`,
    e.message ?? "Unknown error",
    e.code ? `(${e.code})` : "",
    e.details ?? "",
    e.hint ?? ""
  );
}
