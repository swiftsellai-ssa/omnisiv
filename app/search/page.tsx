import { Suspense } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFiltersBar } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { getCategories, searchAgents } from "@/lib/search";
import type { SearchFilters, PricingType } from "@/types";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseFilters(
  params: Record<string, string | string[] | undefined>
): SearchFilters {
  const get = (key: string) => {
    const val = params[key];
    return Array.isArray(val) ? val[0] : val;
  };

  return {
    q: get("q"),
    pricing: (get("pricing") as PricingType | "all") ?? "all",
    open_source: get("open_source") === "true" || undefined,
    has_mcp: get("has_mcp") === "true" || undefined,
    has_api: get("has_api") === "true" || undefined,
    self_hostable: get("self_hostable") === "true" || undefined,
    category: get("category"),
    sort: (get("sort") as SearchFilters["sort"]) ?? "relevance",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const [agents, categories] = await Promise.all([
    searchAgents(filters),
    getCategories(),
  ]);

  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <SearchBar defaultValue={filters.q ?? ""} autoFocus />

          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <Suspense fallback={null}>
                <SearchFiltersBar filters={filters} categories={categories} />
              </Suspense>
            </aside>

            <div>
              <SearchResults agents={agents} query={filters.q} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
