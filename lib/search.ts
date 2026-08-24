import type { Agent, SearchFilters } from "@/types";
import { calculateAgentReadyScore } from "@/lib/scoring";
import { isFreePricing, FREE_PRICING_TYPES } from "@/lib/search-filters";
import {
  agentMatchesSearch,
  parseSearchQuery,
  scoreSearchRelevance,
} from "@/lib/search-query";
import {
  agentSelectQuery,
  logSupabaseError,
  mapAgentRow,
} from "@/lib/supabase/agents";
import { ADDITIONAL_DEMO_AGENTS } from "@/lib/demo-agents-additions";

/** Demo data used when Supabase is not configured. */
export const DEMO_AGENTS: Agent[] = [
  {
    id: "1",
    name: "Cursor",
    slug: "cursor",
    short_description:
      "AI-powered code editor with agentic coding capabilities in VS Code.",
    description:
      "Cursor is an AI-first code editor built on VS Code. It features agent mode for autonomous coding tasks, multi-file edits, codebase understanding, and integration with popular models.",
    website_url: "https://cursor.com",
    demo_url: "https://cursor.com",
    docs_url: "https://docs.cursor.com",
    pricing_type: "freemium",
    pricing_details: "Free tier + Pro from $20/mo",
    is_open_source: false,
    is_self_hostable: false,
    has_api: true,
    has_mcp: false,
    is_structured: true,
    payment_ready: false,
    rating: 4.7,
    review_count: 2840,
    view_count: 125000,
    agent_ready_score: calculateAgentReadyScore({
      has_mcp: false,
      has_api: true,
      is_structured: true,
      is_open_source: false,
      is_self_hostable: false,
      payment_ready: false,
      docs_url: "https://docs.cursor.com",
      rating: 4.7,
    }),
    status: "published",
    source: "seed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    categories: [{ id: "1", name: "Coding", slug: "coding" }],
    tags: [{ id: "2", name: "API", slug: "api" }],
  },
  {
    id: "2",
    name: "Firecrawl MCP",
    slug: "firecrawl-mcp",
    short_description:
      "MCP server for web scraping and structured data extraction.",
    description:
      "Firecrawl MCP provides agents with clean, structured web data via the Model Context Protocol. Supports crawling, scraping, and converting web pages to LLM-ready formats.",
    website_url: "https://firecrawl.dev",
    github_url: "https://github.com/mendableai/firecrawl",
    docs_url: "https://docs.firecrawl.dev",
    mcp_url: "https://github.com/mendableai/firecrawl-mcp-server",
    pricing_type: "freemium",
    pricing_details: "Free tier + paid plans",
    is_open_source: true,
    is_self_hostable: true,
    has_api: true,
    has_mcp: true,
    is_structured: true,
    payment_ready: true,
    rating: 4.4,
    review_count: 420,
    view_count: 31000,
    agent_ready_score: calculateAgentReadyScore({
      has_mcp: true,
      has_api: true,
      is_structured: true,
      is_open_source: true,
      is_self_hostable: true,
      payment_ready: true,
      docs_url: "https://docs.firecrawl.dev",
      rating: 4.4,
    }),
    status: "published",
    source: "seed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    categories: [{ id: "5", name: "Data", slug: "data" }],
    tags: [
      { id: "1", name: "MCP", slug: "mcp" },
      { id: "2", name: "Open Source", slug: "open-source" },
    ],
  },
  {
    id: "3",
    name: "CrewAI",
    slug: "crewai",
    short_description:
      "Multi-agent orchestration framework for collaborative AI teams.",
    description:
      "CrewAI enables you to create teams of specialized AI agents that collaborate on complex tasks. Supports role-based agents, tools, memory, and sequential/hierarchical workflows.",
    website_url: "https://crewai.com",
    github_url: "https://github.com/crewAIInc/crewAI",
    docs_url: "https://docs.crewai.com",
    pricing_type: "open_source",
    pricing_details: "MIT License",
    is_open_source: true,
    is_self_hostable: true,
    has_api: true,
    has_mcp: true,
    is_structured: true,
    payment_ready: false,
    rating: 4.5,
    review_count: 980,
    view_count: 54000,
    agent_ready_score: calculateAgentReadyScore({
      has_mcp: true,
      has_api: true,
      is_structured: true,
      is_open_source: true,
      is_self_hostable: true,
      payment_ready: false,
      docs_url: "https://docs.crewai.com",
      rating: 4.5,
    }),
    status: "published",
    source: "seed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    categories: [{ id: "6", name: "Multi-Agent", slug: "multi-agent" }],
    tags: [
      { id: "1", name: "MCP", slug: "mcp" },
      { id: "2", name: "Open Source", slug: "open-source" },
    ],
  },
  {
    id: "4",
    name: "Perplexity",
    slug: "perplexity",
    short_description:
      "AI-powered research agent with real-time web search and citations.",
    description:
      "Perplexity is an AI answer engine that searches the web in real-time, synthesizes information, and provides cited sources. Excellent for research tasks and fact-checking.",
    website_url: "https://perplexity.ai",
    docs_url: "https://docs.perplexity.ai",
    pricing_type: "freemium",
    pricing_details: "Free + Pro from $20/mo",
    is_open_source: false,
    is_self_hostable: false,
    has_api: true,
    has_mcp: false,
    is_structured: true,
    payment_ready: false,
    rating: 4.6,
    review_count: 5200,
    view_count: 210000,
    agent_ready_score: calculateAgentReadyScore({
      has_mcp: false,
      has_api: true,
      is_structured: true,
      is_open_source: false,
      is_self_hostable: false,
      payment_ready: false,
      docs_url: "https://docs.perplexity.ai",
      rating: 4.6,
    }),
    status: "published",
    source: "seed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    categories: [{ id: "2", name: "Research", slug: "research" }],
    tags: [{ id: "2", name: "API", slug: "api" }],
  },
  {
    id: "5",
    name: "Composio",
    slug: "composio",
    short_description:
      "Tool integration platform with MCP support for AI agents.",
    description:
      "Composio provides 250+ tool integrations for AI agents with a unified API. Supports MCP, function calling, and auth management for agent tool use.",
    website_url: "https://composio.dev",
    github_url: "https://github.com/ComposioHQ/composio",
    docs_url: "https://docs.composio.dev",
    mcp_url: "https://github.com/ComposioHQ/composio-mcp",
    pricing_type: "freemium",
    pricing_details: "Free tier + paid",
    is_open_source: true,
    is_self_hostable: false,
    has_api: true,
    has_mcp: true,
    is_structured: true,
    payment_ready: true,
    rating: 4.3,
    review_count: 340,
    view_count: 28000,
    agent_ready_score: calculateAgentReadyScore({
      has_mcp: true,
      has_api: true,
      is_structured: true,
      is_open_source: true,
      is_self_hostable: false,
      payment_ready: true,
      docs_url: "https://docs.composio.dev",
      rating: 4.3,
    }),
    status: "published",
    source: "seed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    categories: [{ id: "6", name: "Multi-Agent", slug: "multi-agent" }],
    tags: [
      { id: "1", name: "MCP", slug: "mcp" },
      { id: "2", name: "Open Source", slug: "open-source" },
    ],
  },
  {
    id: "6",
    name: "LangGraph",
    slug: "langgraph",
    short_description:
      "Framework for building stateful, multi-agent workflows with LLMs.",
    description:
      "LangGraph is a library for building controllable agent workflows. Supports multi-agent orchestration, human-in-the-loop, persistence, and production deployment.",
    website_url: "https://langchain.com/langgraph",
    github_url: "https://github.com/langchain-ai/langgraph",
    docs_url: "https://langchain-ai.github.io/langgraph/",
    pricing_type: "open_source",
    pricing_details: "MIT License",
    is_open_source: true,
    is_self_hostable: true,
    has_api: true,
    has_mcp: false,
    is_structured: true,
    payment_ready: false,
    rating: 4.6,
    review_count: 1520,
    view_count: 89000,
    agent_ready_score: calculateAgentReadyScore({
      has_mcp: false,
      has_api: true,
      is_structured: true,
      is_open_source: true,
      is_self_hostable: true,
      payment_ready: false,
      docs_url: "https://langchain-ai.github.io/langgraph/",
      rating: 4.6,
    }),
    status: "published",
    source: "seed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    categories: [{ id: "6", name: "Multi-Agent", slug: "multi-agent" }],
    tags: [
      { id: "2", name: "Open Source", slug: "open-source" },
      { id: "3", name: "Self-Hostable", slug: "self-hostable" },
    ],
  },
  {
    id: "7",
    name: "Devin",
    slug: "devin",
    short_description:
      "Autonomous AI software engineer that plans and executes coding tasks.",
    description:
      "Devin is an autonomous AI software engineer developed by Cognition. It can plan, write, debug, and deploy code across full projects with minimal human intervention.",
    website_url: "https://devin.ai",
    demo_url: "https://devin.ai",
    pricing_type: "paid",
    pricing_details: "Enterprise pricing",
    is_open_source: false,
    is_self_hostable: false,
    has_api: true,
    has_mcp: false,
    is_structured: false,
    payment_ready: false,
    rating: 4.1,
    review_count: 890,
    view_count: 67000,
    agent_ready_score: calculateAgentReadyScore({
      has_mcp: false,
      has_api: true,
      is_structured: false,
      is_open_source: false,
      is_self_hostable: false,
      payment_ready: false,
      docs_url: null,
      rating: 4.1,
    }),
    status: "published",
    source: "seed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    categories: [{ id: "1", name: "Coding", slug: "coding" }],
    tags: [{ id: "2", name: "API", slug: "api" }],
  },
  {
    id: "8",
    name: "Agno",
    slug: "agno",
    short_description:
      "Framework for building AI agents with memory, tools, and knowledge.",
    description:
      "Agno (formerly Phidata) is a lightweight framework for building AI agents with tools, knowledge bases, memory, and multi-agent teams.",
    website_url: "https://agno.com",
    github_url: "https://github.com/agno-agi/agno",
    docs_url: "https://docs.agno.com",
    pricing_type: "open_source",
    pricing_details: "MPL 2.0",
    is_open_source: true,
    is_self_hostable: true,
    has_api: true,
    has_mcp: false,
    is_structured: true,
    payment_ready: false,
    rating: 4.4,
    review_count: 560,
    view_count: 38000,
    agent_ready_score: calculateAgentReadyScore({
      has_mcp: false,
      has_api: true,
      is_structured: true,
      is_open_source: true,
      is_self_hostable: true,
      payment_ready: false,
      docs_url: "https://docs.agno.com",
      rating: 4.4,
    }),
    status: "published",
    source: "seed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    categories: [{ id: "1", name: "Coding", slug: "coding" }],
    tags: [
      { id: "2", name: "Open Source", slug: "open-source" },
      { id: "3", name: "Self-Hostable", slug: "self-hostable" },
    ],
  },
  ...ADDITIONAL_DEMO_AGENTS,
];

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
  );
}

function applyFilters(agents: Agent[], filters: SearchFilters): Agent[] {
  const parsed = filters.q ? parseSearchQuery(filters.q) : null;

  return agents.filter((agent) => {
    if (parsed && !agentMatchesSearch(agent, parsed)) return false;
    if (
      filters.pricing &&
      filters.pricing !== "all" &&
      agent.pricing_type !== filters.pricing
    )
      return false;
    if (filters.free && !isFreePricing(agent.pricing_type)) return false;
    if (filters.open_source && !agent.is_open_source) return false;
    if (filters.has_mcp && !agent.has_mcp) return false;
    if (filters.has_api && !agent.has_api) return false;
    if (filters.self_hostable && !agent.is_self_hostable) return false;
    if (
      filters.category &&
      !agent.categories?.some((c) => c.slug === filters.category)
    )
      return false;
    return true;
  });
}

function sortAgents(
  agents: Agent[],
  sort: SearchFilters["sort"],
  query?: string
): Agent[] {
  const parsed = query ? parseSearchQuery(query) : null;
  const sorted = [...agents];

  switch (sort) {
    case "score":
      return sorted.sort((a, b) => b.agent_ready_score - a.agent_ready_score);

    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);

    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.published_at ?? b.created_at).getTime() -
          new Date(a.published_at ?? a.created_at).getTime()
      );

    case "relevance":
    default: {
      if (parsed?.raw) {
        return sorted.sort((a, b) => {
          const relA = scoreSearchRelevance(a, parsed);
          const relB = scoreSearchRelevance(b, parsed);

          const finalA =
            relA * 0.55 +
            a.agent_ready_score * 0.3 +
            a.rating * 2 +
            Math.log10((a.review_count ?? 0) + 1) * 0.5;

          const finalB =
            relB * 0.55 +
            b.agent_ready_score * 0.3 +
            b.rating * 2 +
            Math.log10((b.review_count ?? 0) + 1) * 0.5;

          return finalB - finalA;
        });
      }

      // No query → best agent-ready first
      return sorted.sort((a, b) => {
        const rankA =
          a.agent_ready_score * 0.5 +
          a.rating * 8 +
          Math.log10((a.review_count ?? 0) + 1);
        const rankB =
          b.agent_ready_score * 0.5 +
          b.rating * 8 +
          Math.log10((b.review_count ?? 0) + 1);
        return rankB - rankA;
      });
    }
  }
}

export function searchDemoAgents(filters: SearchFilters): Agent[] {
  const filtered = applyFilters(DEMO_AGENTS, filters);
  return sortAgents(filtered, filters.sort ?? "relevance", filters.q);
}

export async function searchAgents(filters: SearchFilters): Promise<Agent[]> {
  if (!isSupabaseConfigured()) {
    return searchDemoAgents(filters);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const hasCategory = Boolean(filters.category);

  // Fetch structural filters from DB; text matching is done in-app (more tolerant)
  let query = supabase
    .from("agents")
    .select(agentSelectQuery(hasCategory))
    .eq("status", "published");

  if (filters.pricing && filters.pricing !== "all") {
    query = query.eq("pricing_type", filters.pricing);
  }
  if (filters.free) query = query.in("pricing_type", FREE_PRICING_TYPES);
  if (filters.open_source) query = query.eq("is_open_source", true);
  if (filters.has_mcp) query = query.eq("has_mcp", true);
  if (filters.has_api) query = query.eq("has_api", true);
  if (filters.self_hostable) query = query.eq("is_self_hostable", true);
  if (filters.category) {
    query = query.eq("agent_categories.categories.slug", filters.category);
  }

  const { data, error } = await query.limit(200);

  if (error) {
    logSupabaseError("searchAgents", error);
    return [];
  }

  if (!data) return [];

  const agents = data.map((row) =>
    mapAgentRow(row as unknown as Parameters<typeof mapAgentRow>[0])
  );

  return sortAgents(applyFilters(agents, filters), filters.sort ?? "relevance", filters.q);
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_AGENTS.find((a) => a.slug === slug) ?? null;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agents")
    .select(agentSelectQuery(false))
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    logSupabaseError("getAgentBySlug", error);
    return null;
  }

  if (!data) return null;

  return mapAgentRow(data as unknown as Parameters<typeof mapAgentRow>[0]);
}

export async function getCategories() {
  if (!isSupabaseConfigured()) {
    const cats = new Map<string, { id: string; name: string; slug: string }>();
    DEMO_AGENTS.forEach((a) =>
      a.categories?.forEach((c) => cats.set(c.slug, c))
    );
    return Array.from(cats.values());
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data ?? [];
}
