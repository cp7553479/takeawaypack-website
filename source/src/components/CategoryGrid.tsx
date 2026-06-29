import Link from "next/link";

import type { Category } from "@/lib/types";

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  return (
    <section className="section">
      <div className="container-page">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Product Range</span>
            <h2 className="h-section mt-2">Browse by category</h2>
          </div>
          <Link href="/products" className="hidden text-sm font-semibold text-brand-700 hover:underline sm:block">
            All products →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="card card-hover group flex flex-col justify-between p-5"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-brand-700">
                  {c.name}
                </h3>
                {c.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{c.description}</p>
                ) : null}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="chip">{c.count} item{c.count === 1 ? "" : "s"}</span>
                <span className="text-sm font-semibold text-brand-700 group-hover:translate-x-0.5 transition">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
