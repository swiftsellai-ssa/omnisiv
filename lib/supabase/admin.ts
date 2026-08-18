import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function jwtRole(key: string): string | null {
  try {
    const parts = key.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8")
    ) as { role?: string };
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

const WRONG_KEY_HINT =
  "SUPABASE_SERVICE_ROLE_KEY must be the service_role secret from Supabase → Project Settings → API. It is currently a public/anon key, so admin cannot read submissions.";

/** Returns a setup hint when the service client cannot be used safely. */
export function getServiceClientSetupError(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || url.includes("your-project")) {
    return "Set NEXT_PUBLIC_SUPABASE_URL in Vercel to your Supabase project URL.";
  }
  if (!key) {
    return "Set SUPABASE_SERVICE_ROLE_KEY in Vercel (Supabase → Project Settings → API → service_role secret), then redeploy.";
  }

  if (key.startsWith("sb_publishable_") || (anon && key === anon)) {
    return WRONG_KEY_HINT;
  }

  const role = jwtRole(key);
  if (role && role !== "service_role") {
    return WRONG_KEY_HINT;
  }

  return null;
}

export function createServiceClient(): SupabaseClient | null {
  if (getServiceClientSetupError()) return null;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(),
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}

export function explainSupabaseAdminError(error: {
  code?: string;
  message?: string;
}): string {
  const code = error.code ?? "";
  const message = error.message ?? "";

  if (code === "42P01" || message.includes("does not exist")) {
    return "The submissions table is missing. Run the Supabase migrations (001_initial_schema.sql) on your project.";
  }

  if (
    code === "42501" ||
    message.toLowerCase().includes("permission denied") ||
    message.toLowerCase().includes("row-level security")
  ) {
    return WRONG_KEY_HINT;
  }

  if (message.toLowerCase().includes("invalid api key")) {
    return "Invalid Supabase API key. Copy the service_role secret again from Supabase → Settings → API.";
  }

  return "Could not read from Supabase. Check Vercel env vars and redeploy.";
}
