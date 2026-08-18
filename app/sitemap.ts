import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

import { logSupabaseError } from "@/lib/supabase/agents";

const BASE = "https://www.omnisiv.com";
const PAGE_SIZE = 1000;

export const revalidate = 3600;

function staticPages(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE}/submit`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/api-docs`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}

function toDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function publishedAgents(): Promise<
  { slug: string; lastModified?: Date }[]
> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your-project")) return [];

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const agents: { slug: string; lastModified?: Date }[] = [];
    let from = 0;

    for (;;) {
      const { data, error } = await supabase
        .from("agents")
        .select("slug, updated_at, published_at")
        .eq("status", "published")
        .not("slug", "is", null)
        .order("slug", { ascending: true })
        .range(from, from + PAGE_SIZE - 1);

      if (error) {
        logSupabaseError("sitemap.agents", error);
        break;
      }
      if (!data?.length) break;

      for (const row of data) {
        if (typeof row.slug !== "string" || !row.slug) continue;
        agents.push({
          slug: row.slug,
          lastModified: toDate(row.updated_at ?? row.published_at),
        });
      }

      if (data.length < PAGE_SIZE) break;
      from += PAGE_SIZE;
    }

    return agents;
  } catch (err) {
    logSupabaseError("sitemap.agents", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agents = await publishedAgents();

  return [
    ...staticPages(),
    ...agents.map(({ slug, lastModified }) => ({
      url: `${BASE}/agent/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
