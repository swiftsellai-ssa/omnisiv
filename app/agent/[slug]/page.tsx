import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  ExternalLink,
  Code2,
  BookOpen,
  Play,
  Plug,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AgentCard } from "@/components/search/AgentCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAgentBySlug, searchAgents } from "@/lib/search";
import { getScoreLabel } from "@/lib/scoring";

interface AgentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AgentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) return { title: "Agent not found" };
  return {
    title: agent.name,
    description: agent.short_description,
  };
}

const PRICING_LABELS: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  open_source: "Open Source",
  enterprise: "Enterprise",
};

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);

  if (!agent) notFound();

  const similar = (await searchAgents({ category: agent.categories?.[0]?.slug }))
    .filter((a) => a.slug !== agent.slug)
    .slice(0, 3);

  const links = [
    { href: agent.website_url, label: "Website", icon: ExternalLink },
    { href: agent.github_url, label: "GitHub", icon: Code2 },
    { href: agent.demo_url, label: "Demo", icon: Play },
    { href: agent.docs_url, label: "Docs", icon: BookOpen },
    { href: agent.mcp_url, label: "MCP", icon: Plug },
  ].filter((l) => l.href);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  {agent.name}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  {agent.short_description}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Star className="size-5 fill-current" />
                  <span className="text-xl font-semibold">
                    {agent.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {agent.review_count.toLocaleString()} reviews
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {PRICING_LABELS[agent.pricing_type]}
                {agent.pricing_details && ` · ${agent.pricing_details}`}
              </Badge>
              {agent.has_mcp && <Badge>MCP</Badge>}
              {agent.has_api && <Badge variant="secondary">API</Badge>}
              {agent.is_open_source && <Badge variant="outline">Open Source</Badge>}
              {agent.is_self_hostable && (
                <Badge variant="outline">Self-hostable</Badge>
              )}
              {agent.is_structured && <Badge variant="ghost">Structured</Badge>}
              {agent.payment_ready && (
                <Badge variant="ghost">Payment-ready</Badge>
              )}
              {agent.categories?.map((cat) => (
                <Badge key={cat.id} variant="outline">
                  {cat.name}
                </Badge>
              ))}
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium">Agent-ready score</p>
              <p className="mt-1 text-2xl font-semibold">
                {agent.agent_ready_score}/100
              </p>
              <p className="text-sm text-muted-foreground">
                {getScoreLabel(agent.agent_ready_score)}
              </p>
            </div>

            {links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {links.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-7 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <Icon className="size-4" />
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {agent.description && (
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {agent.description}
              </p>
            </section>
          )}

          {similar.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Similar agents</h2>
              <div className="space-y-3">
                {similar.map((a) => (
                  <AgentCard key={a.id} agent={a} />
                ))}
              </div>
            </section>
          )}

          <div className="pt-4">
            <Link
              href="/search"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to search
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
