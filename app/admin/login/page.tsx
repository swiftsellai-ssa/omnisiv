import { redirect } from "next/navigation";

import { isAdminFromCookies } from "@/lib/admin";
import { AdminLoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  if (await isAdminFromCookies()) {
    redirect("/admin/submissions");
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 pt-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Enter the admin secret to review submissions.
        </p>
      </div>
      <AdminLoginForm />
    </div>
  );
}
