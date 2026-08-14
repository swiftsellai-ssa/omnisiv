import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { isSupabaseConfigured } from "@/lib/search";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const SUCCESS_MESSAGE = "Submission received. We review all agents manually.";

const submitSchema = z.object({
  name: z.string().min(2, "name must be at least 2 characters").max(80, "name must be 80 characters or fewer"),
  short_description: z.string().min(1, "short_description is required").max(160, "short_description must be 160 characters or fewer"),
  website_url: z
    .string()
    .url("website_url must be a valid URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  submitted_by: z
    .string()
    .max(120, "submitted_by must be 120 characters or fewer")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

function ok400(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400, headers: CORS_HEADERS });
}

function ok500(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 500, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return ok400("Request body must be valid JSON");
  }

  const parsed = submitSchema.safeParse(body);

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return ok400(first?.message ?? "Invalid submission");
  }

  const { name, website_url, short_description, submitted_by } = parsed.data;

  if (!isSupabaseConfigured()) {
    console.log("[Omnisiv] Submission (demo mode):", parsed.data);
    return NextResponse.json(
      {
        ok: true,
        status: "pending",
        message: SUCCESS_MESSAGE,
      },
      { status: 201, headers: CORS_HEADERS }
    );
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error } = await supabase
    .from("submissions")
    .insert({
      name,
      website_url: website_url ?? null,
      short_description,
      submitted_by: submitted_by ?? null,
      status: "pending",
    });

  if (error) {
    console.error("[Omnisiv] Submission DB error:", error.code, error.message);
    return ok500("Failed to save submission. Please try again.");
  }

  return NextResponse.json(
    {
      ok: true,
      status: "pending",
      message: SUCCESS_MESSAGE,
    },
    { status: 201, headers: CORS_HEADERS }
  );
}
