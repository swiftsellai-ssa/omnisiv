import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { searchAgents } from "@/lib/search";
import type { PricingType, SearchFilters } from "@/types";

const searchSchema = z.object({
  q: z.string().optional(),
  pricing: z
    .enum(["free", "freemium", "paid", "open_source", "enterprise", "all"])
    .optional(),
  open_source: z.coerce.boolean().optional(),
  has_mcp: z.coerce.boolean().optional(),
  has_api: z.coerce.boolean().optional(),
  self_hostable: z.coerce.boolean().optional(),
  category: z.string().optional(),
  sort: z.enum(["relevance", "score", "rating", "newest"]).optional(),
});

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = searchSchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid search parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const filters: SearchFilters = {
    q: parsed.data.q,
    pricing: (parsed.data.pricing as PricingType | "all") ?? "all",
    open_source: parsed.data.open_source || undefined,
    has_mcp: parsed.data.has_mcp || undefined,
    has_api: parsed.data.has_api || undefined,
    self_hostable: parsed.data.self_hostable || undefined,
    category: parsed.data.category,
    sort: parsed.data.sort ?? "relevance",
  };

  const agents = await searchAgents(filters);

  return NextResponse.json({
    agents,
    total: agents.length,
    query: filters.q ?? "",
  });
}
