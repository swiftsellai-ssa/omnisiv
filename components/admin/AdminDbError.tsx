import { AdminNav } from "@/components/admin/AdminNav";

export function AdminDbError({
  title,
  message,
  nav,
}: {
  title: string;
  message: string;
  nav?: "submissions" | "insights";
}) {
  return (
    <div className="space-y-4">
      {nav && <AdminNav current={nav} />}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-xl text-sm text-destructive">{message}</p>
    </div>
  );
}
