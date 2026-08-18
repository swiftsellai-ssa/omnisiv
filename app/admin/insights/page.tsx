import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { isAdminFromCookies } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";
import { logSupabaseError } from "@/lib/supabase/agents";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatFilters(filters: unknown) {
  if (!filters || typeof filters !== "object" || Array.isArray(filters)) {
    return "—";
  }
  const entries = Object.entries(filters as Record<string, unknown>).filter(
    ([, v]) => v !== undefined && v !== null && v !== false
  );
  if (entries.length === 0) return "—";
  return entries
    .map(([k, v]) => (v === true ? k : `${k}:${String(v)}`))
    .join(" · ");
}

interface EmptySearchRow {
  id: string;
  query: string | null;
  filters: unknown;
  created_at: string;
}

export default async function InsightsPage() {
  if (!(await isAdminFromCookies())) {
    redirect("/admin/login");
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return (
      <div className="space-y-4">
        <AdminNav current="insights" />
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Database is not configured. Set SUPABASE_SERVICE_ROLE_KEY.
        </p>
      </div>
    );
  }

  const { data, error } = await supabase
    .from("search_logs")
    .select("id, query, filters, created_at")
    .eq("result_count", 0)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    logSupabaseError("admin.insights.empty-searches", error);
    return (
      <div className="space-y-4">
        <AdminNav current="insights" />
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
        <p className="text-sm text-destructive">
          Failed to load search logs. Run the search_logs migration if this table
          is missing.
        </p>
      </div>
    );
  }

  const rows = (data ?? []) as EmptySearchRow[];

  return (
    <div className="space-y-6">
      <AdminNav current="insights" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Last {rows.length} searches with zero results
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No empty searches yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-2.5">Query</th>
                <th className="px-4 py-2.5">Filters</th>
                <th className="px-4 py-2.5">When</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="max-w-[16rem] px-4 py-3 font-medium">
                    {row.query?.trim() ? (
                      <span className="break-words">{row.query}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatFilters(row.filters)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {formatDate(row.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
