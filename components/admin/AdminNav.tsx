import Link from "next/link";

import { LogoutButton } from "@/components/admin/SubmissionActions";
import { cn } from "@/lib/utils";

export function AdminNav({
  current,
}: {
  current: "submissions" | "insights";
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <nav className="flex items-center gap-3 text-sm">
        <Link
          href="/admin/submissions"
          className={cn(
            "transition-colors",
            current === "submissions"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Submissions
        </Link>
        <Link
          href="/admin/insights"
          className={cn(
            "transition-colors",
            current === "insights"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Insights
        </Link>
      </nav>
      <LogoutButton />
    </div>
  );
}
