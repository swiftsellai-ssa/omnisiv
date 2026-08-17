import type { PricingType, SearchFilters } from "@/types";

export const FREE_PRICING_TYPES: PricingType[] = ["free", "open_source"];

export const BOOL_FILTER_KEYS = [
  "has_mcp",
  "has_api",
  "open_source",
  "self_hostable",
  "free",
] as const;

export type BoolFilterKey = (typeof BOOL_FILTER_KEYS)[number];

const SORT_VALUES = ["relevance", "score", "rating", "newest"] as const;
const PRICING_VALUES: PricingType[] = [
  "free",
  "freemium",
  "paid",
  "open_source",
  "enterprise",
];

export function isTruthyParam(value: string | null | undefined): boolean {
  return value === "true" || value === "1";
}

export function isFreePricing(pricing: PricingType): boolean {
  return FREE_PRICING_TYPES.includes(pricing);
}

export function paramValue(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const val = params[key];
  return Array.isArray(val) ? val[0] : val;
}

export function parseSearchFilters(
  params: Record<string, string | string[] | undefined>
): SearchFilters {
  const get = (key: string) => paramValue(params, key);
  const sort = get("sort");
  const pricing = get("pricing");

  return {
    q: get("q") || undefined,
    pricing:
      pricing && PRICING_VALUES.includes(pricing as PricingType)
        ? (pricing as PricingType)
        : "all",
    open_source: isTruthyParam(get("open_source")) || undefined,
    has_mcp: isTruthyParam(get("has_mcp")) || undefined,
    has_api: isTruthyParam(get("has_api")) || undefined,
    self_hostable: isTruthyParam(get("self_hostable")) || undefined,
    free: isTruthyParam(get("free")) || undefined,
    category: get("category") || undefined,
    sort:
      sort && (SORT_VALUES as readonly string[]).includes(sort)
        ? (sort as SearchFilters["sort"])
        : "relevance",
  };
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return Boolean(
    filters.has_mcp ||
      filters.has_api ||
      filters.open_source ||
      filters.self_hostable ||
      filters.free ||
      filters.category ||
      (filters.pricing && filters.pricing !== "all")
  );
}
