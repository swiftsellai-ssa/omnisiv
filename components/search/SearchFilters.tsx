"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SearchFilters } from "@/types";

interface SearchFiltersBarProps {
  filters: SearchFilters;
  categories: { id: string; name: string; slug: string }[];
}

export function SearchFiltersBar({ filters, categories }: SearchFiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string | boolean | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === false || value === "all") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  const toggleBool = (key: string) => {
    const current = searchParams.get(key) === "true";
    updateFilter(key, current ? undefined : true);
  };

  const sort = filters.sort ?? "relevance";

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
              onClick={() => updateFilter("sort", value)}
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
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Filters
        </p>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={filters.has_mcp === true}
            onClick={() => toggleBool("has_mcp")}
            label="MCP"
          />
          <FilterChip
            active={filters.has_api === true}
            onClick={() => toggleBool("has_api")}
            label="API"
          />
          <FilterChip
            active={filters.open_source === true}
            onClick={() => toggleBool("open_source")}
            label="Open Source"
          />
          <FilterChip
            active={filters.self_hostable === true}
            onClick={() => toggleBool("self_hostable")}
            label="Self-hostable"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Category
          </p>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              active={!filters.category}
              onClick={() => updateFilter("category", undefined)}
              label="All"
            />
            {categories.map((cat) => (
              <FilterChip
                key={cat.slug}
                active={filters.category === cat.slug}
                onClick={() => updateFilter("category", cat.slug)}
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
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button type="button" onClick={onClick}>
      <Badge
        variant={active ? "default" : "outline"}
        className="cursor-pointer hover:opacity-80"
      >
        {label}
      </Badge>
    </button>
  );
}
