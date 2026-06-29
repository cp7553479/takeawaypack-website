import Link from "next/link";

import BrandMark from "@/components/BrandMark";
import type { Category, SiteInfo } from "@/lib/types";

interface SiteFooterProps {
  info: SiteInfo;
  categories: Category[];
}

export default function SiteFooter({ info, categories }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandMark brandName={info.brandName} compact />
          {info.tagline ? (
            <p className="mt-3 text-sm text-slate-600">{info.tagline}</p>
          ) : null}
          {info.description ? (
            <p className="mt-2 line-clamp-3 text-sm text-slate-500">{info.description}</p>
          ) : null}
        </div>

        <nav aria-label="Products">
          <h3 className="text-sm font-semibold text-slate-900">Products</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="text-slate-600 transition hover:text-brand-700"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="font-medium text-brand-700 hover:underline">
                View all products →
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h3 className="text-sm font-semibold text-slate-900">Company</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-slate-600 transition hover:text-brand-700">
                About &amp; Capabilities
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-slate-600 transition hover:text-brand-700">
                Product Catalog
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-slate-600 transition hover:text-brand-700">
                Blog &amp; Buyer Guides
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-600 transition hover:text-brand-700">
                Request Inquiry / RFQ
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {info.contact.email ? (
              <li>
                <a className="hover:text-brand-700" href={`mailto:${info.contact.email}`}>
                  {info.contact.email}
                </a>
              </li>
            ) : null}
            {info.contact.phone ? (
              <li>
                <a className="hover:text-brand-700" href={`tel:${info.contact.phone.replace(/\s+/g, "")}`}>
                  {info.contact.phone}
                </a>
              </li>
            ) : null}
            {info.contact.whatsapp ? (
              <li>
                <span className="text-slate-500">WhatsApp:</span>{" "}
                <span className="text-slate-700">{info.contact.whatsapp}</span>
              </li>
            ) : null}
            {info.contact.address ? (
              <li className="text-slate-500">{info.contact.address}</li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-500 sm:flex-row">
          <p>
            © {year} {info.brandName}. All rights reserved.
          </p>
          <p className="text-slate-400">
            Data source:{" "}
            <span
              className={
                info.source === "imported"
                  ? "font-semibold text-brand-700"
                  : "font-semibold text-kraft-600"
              }
            >
              {info.source === "imported" ? "imported Base data" : "sample content"}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
