import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {featuredCategories.map((category, index) => {
        const image = categoryImage(category);
        const wide = index < 2;
        return (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className={`group ${wide ? "lg:col-span-2" : ""}`}
          >
            <Card className="h-full overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
              <div
                className={`relative overflow-hidden bg-muted/40 ${wide ? "aspect-[16/9]" : "aspect-[4/3]"}`}
              >
                {image ? (
                  <Image
                    src={image}
                    alt={`${category.name} packaging range`}
                    fill
                    sizes={
                      wide
                        ? "(min-width: 1024px) 50vw, 100vw"
                        : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    }
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="product-placeholder p-6 text-sm font-semibold text-brand-800">
                    {category.name}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-5 text-white">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                    {category.count} item{category.count === 1 ? "" : "s"}
                  </span>
                  <h3 className="mt-1 text-lg font-bold tracking-tight">
                    {category.name}
                  </h3>
                </div>
              </div>
              {category.description ? (
                <p className="p-5 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              ) : null}
            </Card>
          </Link>
        );
      })}

      {compactCategories.length > 0 ? (
        <div className="sm:col-span-2 lg:col-span-4">
          <div className="flex flex-wrap gap-3">
            {compactCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="inline-flex items-center rounded-full border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:border-brand-300 hover:text-primary"
              >
                {category.name} · {category.count}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
