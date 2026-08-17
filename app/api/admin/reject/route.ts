import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { isAdminRequest, unauthorized } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";
import { logSupabaseError } from "@/lib/supabase/agents";

const rejectSchema = z.object({
  id: z.string().uuid(),
  notes: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = rejectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Database is not configured" },
      { status: 503 }
    );
  }

  const patch: { status: "rejected"; notes?: string } = { status: "rejected" };
  if (parsed.data.notes?.trim()) {
    patch.notes = parsed.data.notes.trim();
  }

  const { data, error } = await supabase
    .from("submissions")
    .update(patch)
    .eq("id", parsed.data.id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (error) {
    logSupabaseError("admin.reject", error);
    return NextResponse.json({ ok: false, error: "Failed to reject submission" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ ok: false, error: "Submission not found or not pending" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
