"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { Badge } from "@/components/ui/badge";
import {
  BOOL_FILTER_KEYS,
  isTruthyParam,
  type BoolFilterKey,
} from "@/lib/search-filters";
import { cn } from "@/lib/utils";
import type { SearchFilters } from "@/types";

interface SearchFiltersBarProps {
  filters: SearchFilters;
  categories: { id: string; name: string; slug: string }[];
}

const TOGGLE_CHIPS: { key: BoolFilterKey; label: string; title: string }[] = [
  { key: "has_mcp", label: "MCP", title: "Has an MCP server" },
  { key: "has_api", label: "API", title: "Has a public API" },
  { key: "free", label: "Free", title: "Free to use (pricing is free or open source)" },
  { key: "open_source", label: "Open Source", title: "Open source license" },
  {
    key: "self_hostable",
    label: "Self-hostable",
    title: "Can be self-hosted",
  },
];

export function SearchFiltersBar({ filters, categories }: SearchFiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const commit = useCallback(
    (params: URLSearchParams) => {
      const qs = params.toString();
      router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
    },
    [router]
  );

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      commit(params);
    },
    [commit, searchParams]
  );

  const toggleBool = useCallback(
    (key: BoolFilterKey) => {
      const params = new URLSearchParams(searchParams.toString());
      if (isTruthyParam(params.get(key))) {
        params.delete(key);
      } else {
        params.set(key, "true");
      }
      commit(params);
    },
    [commit, searchParams]
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of BOOL_FILTER_KEYS) {
      params.delete(key);
    }
    params.delete("category");
    params.delete("pricing");
    commit(params);
  }, [commit, searchParams]);

  const sort = searchParams.get("sort") ?? filters.sort ?? "relevance";
  const category = searchParams.get("category") || undefined;
  const pricing = searchParams.get("pricing");
  const filtersOn =
    BOOL_FILTER_KEYS.some((key) => isTruthyParam(searchParams.get(key))) ||
    Boolean(category) ||
    Boolean(pricing && pricing !== "all");

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Sort by
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["relevance", "Relevance"],
              ["score", "Agent-ready"],
              ["rating", "Rating"],
              ["newest", "Newest"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => updateParam("sort", value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs transition-colors",
                sort === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Filters
          </p>
          {filtersOn && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TOGGLE_CHIPS.map(({ key, label, title }) => (
            <FilterChip
              key={key}
              label={label}
              title={title}
              active={isTruthyParam(searchParams.get(key))}
              onClick={() => toggleBool(key)}
            />
          ))}
        </div>
      </div>

      {categories.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Category
          </p>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              active={!category}
              onClick={() => updateParam("category", undefined)}
              label="All"
            />
            {categories.map((cat) => (
              <FilterChip
                key={cat.slug}
                active={category === cat.slug}
                onClick={() =>
                  updateParam(
                    "category",
                    category === cat.slug ? undefined : cat.slug
                  )
                }
                label={cat.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  title,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className="cursor-pointer"
    >
      <Badge
        variant={active ? "default" : "outline"}
        className="cursor-pointer hover:opacity-80"
      >
        {label}
      </Badge>
    </button>
  );
}
