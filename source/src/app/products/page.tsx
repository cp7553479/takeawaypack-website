import type { Metadata } from "next";
import Link from "next/link";

import InquiryCTA from "@/components/InquiryCTA";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getCategories, getProducts } from "@/lib/dataAdapter";

export const metadata: Metadata = {
  title: "Products — Takeaway Packaging Catalog",
  description:
    "Browse the full catalog of takeaway and food-service packaging. Filter by category and request a quotation on any product.",
};

function SampleNotice() {
  return (
    <div className="container-page pb-12">
      <p className="rounded-lg border border-kraft-200 bg-kraft-50 px-4 py-3 text-xs text-kraft-800">
        Showing sample product content. Real catalog data loads automatically once the Feishu
        Base import is unblocked.
      </p>
    </div>
  );
}

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();
  const isSample = products.some((p) => p.source === "sample");

  return (
    <>
      <section className="border-b bg-secondary/40">
        <div className="container-page section-tight">
          <p className="eyebrow">Catalog</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Product catalog
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Filter by category, compare materials and specs, then request a quotation with your
            exact size, print, quantity, and destination.
          </p>
          <div className="mt-5">
            <Button asChild variant="kraft">
              <Link href="/contact">Send an inquiry</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Category rail */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Categories
            </h2>
            <nav className="mt-3 flex flex-row flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
              <Link
                href="/products"
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "bg-accent text-accent-foreground"
                )}
              >
                All products · {products.length}
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                >
                  {c.name} · {c.count}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Grid */}
          <div>
            <p className="mb-6 text-sm text-muted-foreground">
              {products.length} product{products.length === 1 ? "" : "s"} in the catalog
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {products.length === 0 ? (
              <Card className="p-10 text-center text-muted-foreground">
                No products available yet.
              </Card>
            ) : null}
          </div>
        </div>
      </section>

      <InquiryCTA />
      {isSample ? <SampleNotice /> : null}
    </>
  );
}
