"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
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

export function SearchBar({
  defaultValue = "",
  size = "default",
  autoFocus = false,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/search");
    }
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
            "pl-12 pr-28 shadow-sm hover:shadow-md focus-visible:shadow-md transition-shadow",
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
