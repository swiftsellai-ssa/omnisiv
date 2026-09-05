import "server-only";

import { after } from "next/server";

import { createServiceClient } from "@/lib/supabase/admin";
import { logSupabaseError } from "@/lib/supabase/agents";
import type { SearchFilters } from "@/types";

const MAX_QUERY_LENGTH = 200;

export type SearchLogSource = "web" | "api";

export interface LogSearchInput {
  query?: string | null;
  filters?: SearchFilters;
  result_count: number;
  source: SearchLogSource;
}

/** Compact filter snapshot — no query text, no PII. */
export function compactSearchFilters(
  filters?: SearchFilters
): Record<string, unknown> {
  if (!filters) return {};

  const out: Record<string, unknown> = {};
  if (filters.has_mcp) out.has_mcp = true;
  if (filters.kind) out.kind = filters.kind;
  if (filters.has_api) out.has_api = true;
  if (filters.open_source) out.open_source = true;
  if (filters.self_hostable) out.self_hostable = true;
  if (filters.free) out.free = true;
  if (filters.category) out.category = filters.category;
  if (filters.pricing && filters.pricing !== "all") out.pricing = filters.pricing;
  if (filters.sort && filters.sort !== "relevance") out.sort = filters.sort;
  return out;
}

async function insertSearchLog(input: LogSearchInput): Promise<void> {
  try {
    const supabase = createServiceClient();
    if (!supabase) return;

    const { error } = await supabase.from("search_logs").insert({
      query: (input.query ?? "").trim().slice(0, MAX_QUERY_LENGTH),
      filters: compactSearchFilters(input.filters),
      result_count: input.result_count,
      source: input.source,
    });

    if (error) logSupabaseError("search.log", error);
  } catch (err) {
    logSupabaseError("search.log", err);
  }
}

/**
 * Best-effort search log. Schedules after the response so search UX is not blocked.
 * Never throws.
 */
export function logSearch(input: LogSearchInput): void {
  try {
    after(() => {
      void insertSearchLog(input);
    });
  } catch {
    void insertSearchLog(input);
  }
}
