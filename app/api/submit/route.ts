import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { isSupabaseConfigured } from "@/lib/search";

const submitSchema = z.object({
  name: z.string().min(2).max(100),
  website_url: z.string().url().optional().or(z.literal("")),
  short_description: z.string().min(10).max(160),
  submitted_by: z.string().email().optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = submitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, website_url, short_description, submitted_by } = parsed.data;

  if (!isSupabaseConfigured()) {
    // Demo mode: accept but log
    console.log("[Omnisiv] Agent submission (demo mode):", parsed.data);
    return NextResponse.json({
      success: true,
      message: "Submission received (demo mode — connect Supabase to persist)",
    });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error } = await supabase.from("submissions").insert({
    name,
    website_url: website_url || null,
    short_description,
    submitted_by: submitted_by || null,
    status: "pending",
  });

  if (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
