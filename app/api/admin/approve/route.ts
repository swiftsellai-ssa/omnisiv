import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  agentPublicUrl,
  isAdminRequest,
  isGithubUrl,
  slugify,
  suggestsMcp,
  suggestsOpenSource,
  unauthorized,
  uniqueSlug,
} from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";
import { logSupabaseError } from "@/lib/supabase/agents";
import { isHttpUrl } from "@/lib/utils";
import type { Submission } from "@/types";

const approveSchema = z.object({
  id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = approveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Database is not configured" },
      { status: 503 }
    );
  }

  const { data: submission, error: loadError } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (loadError) {
    logSupabaseError("admin.approve.load", loadError);
    return NextResponse.json({ ok: false, error: "Failed to load submission" }, { status: 500 });
  }

  if (!submission) {
    return NextResponse.json({ ok: false, error: "Submission not found" }, { status: 404 });
  }

  const row = submission as Submission;

  if (row.status === "approved") {
    return NextResponse.json({ ok: false, error: "Already approved" }, { status: 409 });
  }
  if (row.status !== "pending") {
    return NextResponse.json({ ok: false, error: "Submission is not pending" }, { status: 409 });
  }

  const websiteUrl = isHttpUrl(row.website_url) ? row.website_url : null;
  const openSource = suggestsOpenSource(row.name, row.short_description, websiteUrl);
  const hasMcp = suggestsMcp(row.name, row.short_description);
  const githubUrl = isGithubUrl(websiteUrl) ? websiteUrl : null;

  const baseSlug = slugify(row.name);
  const { data: collisions, error: slugError } = await supabase
    .from("agents")
    .select("slug")
    .ilike("slug", `${baseSlug}%`)
    .limit(50);

  if (slugError) {
    logSupabaseError("admin.approve.slugs", slugError);
    return NextResponse.json({ ok: false, error: "Failed to allocate slug" }, { status: 500 });
  }

  const taken = new Set((collisions ?? []).map((agent) => agent.slug as string));
  const slug = uniqueSlug(baseSlug, taken, row.id);

  const now = new Date().toISOString();
  const { error: insertError } = await supabase.from("agents").insert({
    name: row.name,
    slug,
    short_description: row.short_description || row.name,
    website_url: websiteUrl,
    github_url: githubUrl,
    status: "published",
    source: "submission",
    published_at: now,
    last_verified_at: now,
    is_open_source: openSource,
    has_mcp: hasMcp,
    kind: hasMcp ? "mcp" : "agent",
    pricing_type: openSource ? "open_source" : "free",
  });

  if (insertError) {
    logSupabaseError("admin.approve.insert", insertError);
    return NextResponse.json({ ok: false, error: "Failed to publish agent" }, { status: 500 });
  }

  const notes = `Published as ${slug}`;
  const { error: updateError } = await supabase
    .from("submissions")
    .update({ status: "approved", notes })
    .eq("id", row.id)
    .eq("status", "pending");

  if (updateError) {
    logSupabaseError("admin.approve.update", updateError);
    return NextResponse.json({ ok: false, error: "Published, but failed to update submission" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    slug,
    url: agentPublicUrl(slug),
  });
}
