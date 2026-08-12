export interface AgentScoreInput {
  has_mcp: boolean;
  has_api: boolean;
  is_structured: boolean;
  is_open_source: boolean;
  is_self_hostable: boolean;
  payment_ready: boolean;
  docs_url?: string | null;
  rating: number;
}

/** Aggressive MCP-weighted scoring (max 100). */
export function calculateAgentReadyScore(agent: AgentScoreInput): number {
  let score = 0;

  if (agent.has_mcp) score += 40;
  if (agent.has_api) score += 18;
  if (agent.is_structured) score += 12;
  if (agent.is_open_source) score += 8;
  if (agent.is_self_hostable) score += 8;
  if (agent.payment_ready) score += 7;
  if (agent.docs_url) score += 5;
  if (agent.rating >= 4.2) score += 2;

  return Math.min(score, 100);
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Highly agent-ready";
  if (score >= 60) return "Agent-ready";
  if (score >= 40) return "Partially ready";
  return "Basic";
}
