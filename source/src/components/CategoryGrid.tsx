import Image from "next/image";
import Link from "next/link";

import type { Category } from "@/lib/types";

const CATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  "kraft-paper-bags": "/generated/product-kraft-packaging.png",
  "food-containers": "/generated/product-food-containers.png",
  "paper-cups": "/generated/product-paper-cups.png",
  "compartment-trays": "/generated/product-compartment-trays.png",
  "sauce-cups": "/generated/product-sauce-cups.png",
  cutlery: "/generated/product-cutlery.png",
};

function categoryImage(category: Category) {
  return category.image ?? CATEGORY_IMAGE_FALLBACKS[category.slug];
}

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  const featuredCategories = categories.slice(0, 8);
  const compactCategories = categories.slice(8);

  return (
    <section className="section bg-slate-50">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow">Product range</span>
            <h2 className="h-section mt-2">Source by packaging category</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Visual category browsing helps buyers narrow materials, sizes, and use cases
              before sending an RFQ.
            </p>
          </div>
          <Link href="/products" className="btn-outline self-start sm:self-auto">
            Browse all products
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategories.map((category, index) => {
            const image = categoryImage(category);
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className={`card card-hover group overflow-hidden ${
                  index < 2 ? "lg:col-span-2" : ""
                }`}
              >
                <div className={`relative overflow-hidden bg-slate-100 ${index < 2 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                  {image ? (
                    <Image
                      src={image}
                      alt={`${category.name} packaging range`}
                      fill
                      sizes={index < 2 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="product-placeholder p-6 text-sm font-semibold text-brand-800">
                      {category.name}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent p-5 text-white">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                      {category.count} item{category.count === 1 ? "" : "s"}
                    </span>
                    <h3 className="mt-1 text-lg font-bold tracking-tight">{category.name}</h3>
                  </div>
                </div>
                {category.description ? (
                  <p className="p-5 pt-4 text-sm leading-relaxed text-slate-600">
                    {category.description}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>

        {compactCategories.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {compactCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="chip bg-white px-3 py-2 hover:border-brand-300 hover:text-brand-700"
              >
                {category.name} · {category.count}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
