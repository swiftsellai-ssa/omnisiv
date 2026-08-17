"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  size?: "default" | "large";
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar(props: SearchBarProps) {
  const [query, setQuery] = useState(props.defaultValue ?? "");

  return (
    <Suspense
      fallback={
        <SearchBarForm
          {...props}
          query={query}
          setQuery={setQuery}
          preserveParams={false}
        />
      }
    >
      <SearchBarWithParams
        {...props}
        query={query}
        setQuery={setQuery}
      />
    </Suspense>
  );
}

function SearchBarWithParams(
  props: SearchBarProps & {
    query: string;
    setQuery: Dispatch<SetStateAction<string>>;
  }
) {
  const searchParams = useSearchParams();
  return (
    <SearchBarForm
      {...props}
      currentParams={searchParams}
    />
  );
}

function SearchBarForm({
  size = "default",
  autoFocus = false,
  className,
  query,
  setQuery,
  currentParams,
  preserveParams = true,
}: SearchBarProps & {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  currentParams?: URLSearchParams;
  preserveParams?: boolean;
}) {
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(
      preserveParams && currentParams ? currentParams.toString() : ""
    );
    const q = query.trim();
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative w-full", className)}
    >
      <div className="relative flex items-center">
        <Search className="absolute left-4 size-5 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for any AI agent, tool, or MCP server..."
          autoFocus={autoFocus}
          className={cn(
            "pl-12 pr-28 shadow-sm hover:shadow-md focus-visible:shadow-md transition-shadow dark:shadow-none dark:hover:shadow-none",
            size === "large" ? "h-14 text-lg rounded-full" : "h-11 rounded-full"
          )}
        />
        <Button
          type="submit"
          size={size === "large" ? "lg" : "default"}
          className="absolute right-1.5 rounded-full"
        >
          Search
        </Button>
      </div>
    </form>
  );
}
