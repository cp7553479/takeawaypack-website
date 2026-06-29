"use client";

import { useMemo, useState } from "react";

import ProductCard from "@/components/ProductCard";
import type { Category, Product } from "@/lib/types";

interface ProductBrowserProps {
  products: Product[];
  categories: Category[];
}

export default function ProductBrowser({ products, categories }: ProductBrowserProps) {
  const [active, setActive] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      const inCat = active === "all" || p.categorySlug === active;
      if (!inCat) return false;
      if (!needle) return true;
      return (
        p.name.toLowerCase().includes(needle) ||
        (p.summary ?? "").toLowerCase().includes(needle) ||
        (p.material ?? "").toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle)
      );
    });
  }, [products, active, q]);

  const activeName =
    active === "all" ? "All products" : categories.find((c) => c.slug === active)?.name ?? active;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={`chip cursor-pointer ${
              active === "all" ? "border-brand-400 bg-brand-50 text-brand-800" : ""
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActive(c.slug)}
              className={`chip cursor-pointer ${
                active === c.slug ? "border-brand-400 bg-brand-50 text-brand-800" : ""
              }`}
            >
              {c.name} ({c.count})
            </button>
          ))}
        </div>

        <div className="lg:w-72">
          <label className="sr-only" htmlFor="product-search">
            Search products
          </label>
          <input
            id="product-search"
            className="input"
            placeholder="Search products…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{" "}
        {products.length} — {activeName}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 card p-10 text-center text-slate-500">
          No products match your filter. Try another category or search term.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
