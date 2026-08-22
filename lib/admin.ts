import "server-only";

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "omnisiv_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SITE_URL = "https://www.omnisiv.com";

export function getAdminSecret(): string | undefined {
  const secret = process.env.ADMIN_SECRET;
  return secret && secret.length > 0 ? secret : undefined;
}

function hash(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function secretsMatch(provided: string, expected: string): boolean {
  return timingSafeEqual(hash(provided), hash(expected));
}

/** Opaque session token — the raw ADMIN_SECRET never goes in the cookie. */
export function adminSessionToken(secret: string): string {
  return createHmac("sha256", secret).update("omnisiv-admin-session").digest("hex");
}

export function isValidAdminSecret(provided: string | null | undefined): boolean {
  const secret = getAdminSecret();
  if (!secret || !provided) return false;
  return secretsMatch(provided, secret);
}

export function isValidAdminCookie(value: string | null | undefined): boolean {
  const secret = getAdminSecret();
  if (!secret || !value) return false;
  return secretsMatch(value, adminSessionToken(secret));
}

export function isAdminRequest(request: NextRequest): boolean {
  if (isValidAdminSecret(request.headers.get("x-admin-secret"))) return true;
  return isValidAdminCookie(request.cookies.get(ADMIN_COOKIE)?.value);
}

export async function isAdminFromCookies(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminCookie(cookieStore.get(ADMIN_COOKIE)?.value);
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

export function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return slug || "agent";
}

export function isGithubUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "github.com" || host === "www.github.com";
  } catch {
    return false;
  }
}

export function suggestsOpenSource(
  name: string,
  description: string | null | undefined,
  websiteUrl: string | null | undefined
): boolean {
  const blob = `${name} ${description ?? ""} ${websiteUrl ?? ""}`.toLowerCase();
  if (isGithubUrl(websiteUrl)) return true;
  return /\bopen[\s-]?source\b|\boss\b|\bgithub\b/.test(blob);
}

export function suggestsMcp(
  name: string,
  description: string | null | undefined
): boolean {
  return /\bmcp\b/i.test(`${name} ${description ?? ""}`);
}

export function agentPublicUrl(slug: string): string {
  return `${SITE_URL}/agent/${slug}`;
}

export function uniqueSlug(base: string, taken: Set<string>, suffix: string): string {
  if (!taken.has(base)) return base;
  const short = suffix.replace(/-/g, "").slice(0, 6).toLowerCase() || "x";
  let candidate = `${base}-${short}`;
  let n = 2;
  while (taken.has(candidate)) {
    candidate = `${base}-${short}-${n}`;
    n += 1;
  }
  return candidate;
}
