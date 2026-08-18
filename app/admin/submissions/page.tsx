import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { AdminDbError } from "@/components/admin/AdminDbError";
import { SubmissionActions } from "@/components/admin/SubmissionActions";
import { isAdminFromCookies } from "@/lib/admin";
import {
  createServiceClient,
  explainSupabaseAdminError,
  getServiceClientSetupError,
} from "@/lib/supabase/admin";
import { logSupabaseError } from "@/lib/supabase/agents";
import type { Submission } from "@/types";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function SubmissionsPage() {
  if (!(await isAdminFromCookies())) {
    redirect("/admin/login");
  }

  const setupError = getServiceClientSetupError();
  if (setupError) {
    return (
      <AdminDbError
        nav="submissions"
        title="Submissions"
        message={setupError}
      />
    );
  }

  const supabase = createServiceClient()!;

  const { data, error } = await supabase
    .from("submissions")
    .select("id, name, website_url, short_description, submitted_by, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    logSupabaseError("admin.submissions.list", error);
    return (
      <AdminDbError
        nav="submissions"
        title="Submissions"
        message={explainSupabaseAdminError(error)}
      />
    );
  }

  const submissions = (data ?? []) as Pick<
    Submission,
    | "id"
    | "name"
    | "website_url"
    | "short_description"
    | "submitted_by"
    | "created_at"
  >[];

  return (
    <div className="space-y-6">
      <AdminNav current="submissions" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Submissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {submissions.length} pending
        </p>
      </div>

      {submissions.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No pending submissions.
        </p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {submissions.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <p className="font-medium">{item.name}</p>
                {item.website_url && (
                  <a
                    href={item.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm text-primary hover:underline"
                  >
                    {item.website_url}
                  </a>
                )}
                {item.short_description && (
                  <p className="text-sm text-muted-foreground">
                    {item.short_description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {item.submitted_by ?? "Anonymous"} · {formatDate(item.created_at)}
                </p>
              </div>
              <SubmissionActions submission={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
