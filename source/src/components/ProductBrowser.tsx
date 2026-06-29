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
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [availability, setAvailability] = useState<"all" | "images" | "quoted" | "gallery">("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      const inCat = active === "all" || p.categorySlug === active;
      if (!inCat) return false;
      if (availability === "images" && p.hasImage === false) return false;
      if (availability === "quoted" && p.hasQuote === false) return false;
      if (availability === "gallery" && (p.gallery?.length ?? 0) < 2) return false;
      if (!needle) return true;
      const searchable = [
        p.name,
        p.summary,
        p.description,
        p.material,
        p.category,
        p.customization,
        p.leadTime,
        p.moq,
        ...(p.features ?? []),
        ...(p.useCases ?? []),
        ...p.specs.flatMap((spec) => [spec.label, spec.value]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        searchable.includes(needle)
      );
    });
  }, [products, active, availability, q]);

  const activeName =
    active === "all" ? "All products" : categories.find((c) => c.slug === active)?.name ?? active;
  const clearFilters = () => {
    setActive("all");
    setAvailability("all");
    setQ("");
  };
  const pinnedCategories = categories.slice(0, 12);
  const activeCategory = categories.find((c) => c.slug === active);
  const visibleCategories =
    filtersExpanded || active === "all" || pinnedCategories.some((c) => c.slug === active)
      ? filtersExpanded
        ? categories
        : pinnedCategories
      : [...pinnedCategories, activeCategory].filter((c): c is Category => Boolean(c));
  const hiddenCategoryCount = Math.max(categories.length - pinnedCategories.length, 0);
  const withImagesCount = products.filter((p) => p.hasImage !== false).length;
  const quotedCount = products.filter((p) => p.hasQuote !== false).length;
  const galleryCount = products.filter((p) => (p.gallery?.length ?? 0) > 1).length;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Find products</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search by product name, material, specs, category, or use the category filters.
            </p>
          </div>
          <div className="lg:w-96">
            <label className="sr-only" htmlFor="product-search">
              Search products
            </label>
            <input
              id="product-search"
              className="input"
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

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
          {visibleCategories.map((c) => (
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
          {hiddenCategoryCount > 0 ? (
            <button
              type="button"
              onClick={() => setFiltersExpanded((value) => !value)}
              className="chip cursor-pointer border-brand-200 bg-white text-brand-800 hover:border-brand-300"
            >
              {filtersExpanded ? "Fewer filters" : `More filters (+${hiddenCategoryCount})`}
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
          <span className="w-full text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-auto">
            Availability
          </span>
          <button
            type="button"
            onClick={() => setAvailability("all")}
            className={`chip cursor-pointer ${
              availability === "all" ? "border-brand-400 bg-brand-50 text-brand-800" : ""
            }`}
          >
            All records
          </button>
          <button
            type="button"
            onClick={() => setAvailability("images")}
            className={`chip cursor-pointer ${
              availability === "images" ? "border-brand-400 bg-brand-50 text-brand-800" : ""
            }`}
          >
            With images ({withImagesCount})
          </button>
          <button
            type="button"
            onClick={() => setAvailability("quoted")}
            className={`chip cursor-pointer ${
              availability === "quoted" ? "border-brand-400 bg-brand-50 text-brand-800" : ""
            }`}
          >
            Price tier shown ({quotedCount})
          </button>
          <button
            type="button"
            onClick={() => setAvailability("gallery")}
            className={`chip cursor-pointer ${
              availability === "gallery" ? "border-brand-400 bg-brand-50 text-brand-800" : ""
            }`}
          >
            Multi-image ({galleryCount})
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{" "}
          {products.length} — {activeName}
        </p>
        {(q || active !== "all" || availability !== "all") ? (
          <button type="button" onClick={clearFilters} className="btn-ghost self-start px-3 py-1.5 text-xs">
            Clear filters
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 card p-10 text-center text-slate-500">
          <p>No products match your filter. Try another category, availability filter, or search term.</p>
          <button type="button" onClick={clearFilters} className="btn-outline mt-4">
            Reset catalog view
          </button>
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
