import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-4xl font-semibold">404</h1>
        <p className="mt-2 text-muted-foreground">Agent not found.</p>
        <Link
          href="/"
          className="mt-6 text-sm text-primary hover:underline"
        >
          Back to Omnisiv
        </Link>
      </main>
      <Footer />
    </div>
  );
}
