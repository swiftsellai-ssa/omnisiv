import type { Agent } from "@/types";

import { AgentCard } from "./AgentCard";

interface SearchResultsProps {
  agents: Agent[];
  query?: string;
}

export function SearchResults({ agents, query }: SearchResultsProps) {
  if (agents.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-muted-foreground">
          No agents found{query ? ` for "${query}"` : ""}.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try different keywords or remove some filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        About {agents.length} result{agents.length !== 1 ? "s" : ""}
        {query ? (
          <>
            {" "}
            for <span className="font-medium text-foreground">&quot;{query}&quot;</span>
          </>
        ) : null}
      </p>
      <div className="space-y-3">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
