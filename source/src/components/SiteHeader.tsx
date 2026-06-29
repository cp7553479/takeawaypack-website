"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import BrandMark from "@/components/BrandMark";
import type { NavItem } from "@/lib/types";

interface SiteHeaderProps {
  brandName: string;
  tagline?: string;
  nav: NavItem[];
}

export default function SiteHeader({ brandName, tagline, nav }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" aria-label={`${brandName} home`}>
          <BrandMark brandName={brandName} tagline={tagline} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/contact" className="btn-primary">
            Get a Quote
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="container-page flex flex-col py-2" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-3 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary mt-2">
              Get a Quote
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
