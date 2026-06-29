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
    <footer className="border-t bg-secondary/40">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandMark brandName={info.brandName} tagline={info.tagline} withLink={false} />
          {info.description ? (
            <p className="mt-4 line-clamp-4 text-sm text-muted-foreground">
              {info.description}
            </p>
          ) : null}
        </div>

        <nav aria-label="Products">
          <h3 className="text-sm font-semibold text-foreground">Products</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="text-muted-foreground transition hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="font-medium text-primary hover:underline">
                View all products →
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h3 className="text-sm font-semibold text-foreground">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/about" className="text-muted-foreground transition hover:text-primary">
                About &amp; Capabilities
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-muted-foreground transition hover:text-primary">
                Product Catalog
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-muted-foreground transition hover:text-primary">
                Blog &amp; Buyer Guides
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground transition hover:text-primary">
                Request Inquiry / RFQ
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {info.contact.email ? (
              <li>
                <a className="transition hover:text-primary" href={`mailto:${info.contact.email}`}>
                  {info.contact.email}
                </a>
              </li>
            ) : null}
            {info.contact.phone ? (
              <li>
                <a
                  className="transition hover:text-primary"
                  href={`tel:${info.contact.phone.replace(/\s+/g, "")}`}
                >
                  {info.contact.phone}
                </a>
              </li>
            ) : null}
            {info.contact.whatsapp ? (
              <li>
                <span className="text-foreground/60">WhatsApp:</span>{" "}
                <span className="text-foreground/80">{info.contact.whatsapp}</span>
              </li>
            ) : null}
            {info.contact.address ? (
              <li className="text-foreground/60">{info.contact.address}</li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {info.brandName}. All rights reserved.
          </p>
          <p>
            Data source:{" "}
            <span
              className={
                info.source === "imported"
                  ? "font-semibold text-primary"
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
