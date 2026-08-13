import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://omnisiv.com"),
  title: {
    default: "omnisiv — All agents. One search.",
    template: "%s · omnisiv",
  },
  description:
    "The search engine for AI agents. Find any agent, tool, or MCP server in one place.",
  openGraph: {
    title: "omnisiv — All agents. One search.",
    description:
      "The search engine for AI agents. Find any agent, tool, or MCP server in one place.",
    url: "https://omnisiv.com",
    siteName: "omnisiv",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "omnisiv — All agents. One search.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "omnisiv — All agents. One search.",
    description:
      "The search engine for AI agents. Find any agent, tool, or MCP server in one place.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
