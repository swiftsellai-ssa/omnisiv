import type { Agent } from "@/types";

export type ParsedQuery = {
  raw: string;
  terms: string[];
};

export function parseSearchQuery(q: string): ParsedQuery {
  const raw = q.trim();
  const terms = raw
    .toLowerCase()
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);

  return { raw, terms };
}

export function agentMatchesSearch(agent: Agent, parsed: ParsedQuery): boolean {
  if (!parsed.terms.length) return true;

  const haystack = [
    agent.name,
    agent.slug,
    agent.short_description,
    agent.description ?? "",
    ...(agent.categories?.map((c) => c.name) ?? []),
    ...(agent.tags?.map((t) => t.name) ?? []),
  ]
    .join(" ")
    .toLowerCase();

  // Match if ANY term hits text OR special MCP intent
  return parsed.terms.some((term) => {
    if (term === "mcp" && agent.has_mcp) return true;
    return haystack.includes(term);
  });
}

export function scoreSearchRelevance(agent: Agent, parsed: ParsedQuery): number {
  if (!parsed.terms.length) return 0;

  const name = agent.name.toLowerCase();
  const slug = agent.slug.toLowerCase();
  const short = agent.short_description.toLowerCase();
  const desc = (agent.description ?? "").toLowerCase();
  const cats = (agent.categories ?? []).map((c) => c.name.toLowerCase()).join(" ");
  const tags = (agent.tags ?? []).map((t) => t.name.toLowerCase()).join(" ");

  let score = 0;

  for (const term of parsed.terms) {
    // Exact / strong name signals
    if (name === term || slug === term) score += 100;
    else if (name.startsWith(term)) score += 70;
    else if (name.includes(term) || slug.includes(term)) score += 55;

    // Description signals
    if (short.includes(term)) score += 28;
    if (desc.includes(term)) score += 12;

    // Taxonomy
    if (cats.includes(term) || tags.includes(term)) score += 18;

    // Intent: MCP
    if (term === "mcp" && agent.has_mcp) score += 45;
  }

  // Small boost if many terms match
  const matchedTerms = parsed.terms.filter((term) => {
    const blob = `${name} ${slug} ${short} ${desc} ${cats} ${tags}`;
    return blob.includes(term) || (term === "mcp" && agent.has_mcp);
  }).length;

  score += matchedTerms * 6;

  return score;
}
