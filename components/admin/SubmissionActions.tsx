"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface SubmissionRow {
  id: string;
  name: string;
  website_url?: string | null;
  short_description?: string | null;
  submitted_by?: string | null;
  created_at: string;
}

export function SubmissionActions({ submission }: { submission: SubmissionRow }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState("");

  async function approve() {
    setBusy("approve");
    setError("");
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: submission.id }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        slug?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Approve failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approve failed");
    } finally {
      setBusy(null);
    }
  }

  async function reject() {
    setBusy("reject");
    setError("");
    try {
      const res = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: submission.id }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Reject failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reject failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-1.5">
        <Button
          type="button"
          size="sm"
          disabled={busy !== null}
          onClick={approve}
        >
          {busy === "approve" ? "..." : "Approve"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy !== null}
          onClick={reject}
        >
          {busy === "reject" ? "..." : "Reject"}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-xs text-muted-foreground hover:text-foreground"
    >
      Sign out
    </button>
  );
}
