import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  ADMIN_COOKIE,
  adminCookieOptions,
  adminSessionToken,
  getAdminSecret,
  isValidAdminSecret,
} from "@/lib/admin";

const loginSchema = z.object({
  secret: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const adminSecret = getAdminSecret();
  if (!adminSecret) {
    return NextResponse.json(
      { ok: false, error: "Admin is not configured" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success || !isValidAdminSecret(parsed.data.secret)) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, adminSessionToken(adminSecret), adminCookieOptions());
  return response;
}
