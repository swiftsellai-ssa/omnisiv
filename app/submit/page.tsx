"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      website_url: form.get("website_url"),
      short_description: form.get("short_description"),
      submitted_by: form.get("submitted_by"),
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Submission failed");
      }

      setSubmittedName(String(body.name ?? "").trim());
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
          <div className="max-w-md text-center space-y-5">
            <CheckCircle2 className="mx-auto size-12 text-green-600" />
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">You&apos;re all set</h1>
              <p className="text-muted-foreground">
                {submittedName ? (
                  <>
                    <span className="font-medium text-foreground">
                      {submittedName}
                    </span>{" "}
                    was submitted successfully.
                  </>
                ) : (
                  "Your agent was submitted successfully."
                )}
              </p>
            </div>
            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-left text-sm text-muted-foreground">
              <p className="font-medium text-foreground">What happens next</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>We review every submission manually.</li>
                <li>Approved agents appear in search within a few days.</li>
                <li>We&apos;ll reach out by email if we need more details.</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                href="/search"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                Browse agents
              </Link>
              <Link
                href="/"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted transition-colors"
              >
                Back to search
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-lg space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Submit an agent</h1>
            <p className="text-muted-foreground">
              Help grow the Agent Web index. We review all submissions manually.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Agent name *</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g. Firecrawl MCP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                name="website_url"
                type="url"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Short description *</Label>
              <Textarea
                id="short_description"
                name="short_description"
                required
                maxLength={160}
                placeholder="What does this agent do? (max 160 chars)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="submitted_by">Your email</Label>
              <Input
                id="submitted_by"
                name="submitted_by"
                type="email"
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send for review"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
