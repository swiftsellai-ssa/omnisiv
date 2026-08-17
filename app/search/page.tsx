import { Suspense } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFiltersBar } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { parseSearchFilters } from "@/lib/search-filters";
import { getCategories, searchAgents } from "@/lib/search";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const filters = parseSearchFilters(params);
  const [agents, categories] = await Promise.all([
    searchAgents(filters),
    getCategories(),
  ]);

  return (
    <div className="flex min-h-dvh flex-col">
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
