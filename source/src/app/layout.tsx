import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getSiteData } from "@/lib/dataAdapter";

import "./globals.css";

// NOTE: next/font/google is intentionally avoided so the project builds in
// offline/sandboxed environments. The Tailwind font stack falls back to the
// system UI. Swap in next/font for a custom typeface once network is available.

export async function generateMetadata(): Promise<Metadata> {
  const { info } = getSiteData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const title = info.seo?.title ?? `${info.brandName} — Takeaway & Food Packaging | B2B Inquiry`;
  const description =
    info.seo?.description ??
    "Browse takeaway and food-service packaging and request a quotation directly.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${info.brandName}`,
    },
    description,
    keywords: info.seo?.keywords,
    openGraph: {
      type: "website",
      siteName: info.brandName,
      title,
      description,
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const data = getSiteData();
  const nav = data.info.nav ?? [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-slate-900">
        <SiteHeader brandName={data.info.brandName} tagline={data.info.tagline} nav={nav} />
        <main className="flex-1">{children}</main>
        <SiteFooter info={data.info} categories={data.categories} />
      </body>
    </html>
  );
}
