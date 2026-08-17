import { redirect } from "next/navigation";

import { isAdminFromCookies } from "@/lib/admin";

export default async function AdminHomePage() {
  if (await isAdminFromCookies()) {
    redirect("/admin/submissions");
  }
  redirect("/admin/login");
}
