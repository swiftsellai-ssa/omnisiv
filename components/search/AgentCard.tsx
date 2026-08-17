import type { Agent } from "@/types";
import { Star, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getScoreLabel } from "@/lib/scoring";

interface AgentCardProps {
  agent: Agent;
}

const PRICING_LABELS: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  open_source: "Open Source",
  enterprise: "Enterprise",
};

export function AgentCard({ agent }: AgentCardProps) {
  const badges = [
    agent.has_mcp && { label: "MCP", variant: "default" as const },
    agent.has_api && { label: "API", variant: "secondary" as const },
    agent.is_open_source && { label: "Open Source", variant: "outline" as const },
    agent.is_self_hostable && { label: "Self-hostable", variant: "outline" as const },
    agent.is_structured && { label: "Structured", variant: "ghost" as const },
    agent.payment_ready && { label: "Payment-ready", variant: "ghost" as const },
  ].filter(Boolean) as { label: string; variant: "default" | "secondary" | "outline" | "ghost" }[];

  return (
    <Card className="hover:shadow-md transition-shadow dark:shadow-none dark:hover:shadow-none dark:hover:border-foreground/15">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link href={`/agent/${agent.slug}`}>
              <CardTitle className="hover:underline text-lg">
                {agent.name}
              </CardTitle>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {agent.short_description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 text-sm">
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Star className="size-3.5 fill-current" />
              <span className="font-medium">{agent.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({agent.review_count.toLocaleString()})
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Score: {agent.agent_ready_score} · {getScoreLabel(agent.agent_ready_score)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">
            {PRICING_LABELS[agent.pricing_type] ?? agent.pricing_type}
          </Badge>
          {agent.categories?.map((cat) => (
            <Badge key={cat.id} variant="outline">
              {cat.name}
            </Badge>
          ))}
          {badges.map((b) => (
            <Badge key={b.label} variant={b.variant}>
              {b.label}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {agent.website_url && (
            <a
              href={agent.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              Visit <ExternalLink className="size-3" />
            </a>
          )}
          <Link
            href={`/agent/${agent.slug}`}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            View details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
