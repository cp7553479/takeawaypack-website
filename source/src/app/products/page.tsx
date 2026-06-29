import type { Metadata } from "next";
import Link from "next/link";

import InquiryCTA from "@/components/InquiryCTA";
import ProductBrowser from "@/components/ProductBrowser";
import { getCategories, getProducts } from "@/lib/dataAdapter";

export const metadata: Metadata = {
  title: "Products — Takeaway Packaging Catalog",
  description:
    "Browse the full catalog of takeaway and food-service packaging. Filter by category and request a quotation on any product.",
};

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="container-page section-tight">
          <span className="eyebrow">Catalog</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Product catalog
          </h1>
          <p className="lead mt-3 max-w-2xl">
            Filter by category, search by material or keyword, then request a quotation with your
            specs and quantity.
          </p>
          <div className="mt-4">
            <Link href="/contact" className="btn-accent">
              Send an inquiry
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <ProductBrowser products={products} categories={categories} />
        </div>
      </section>

      <InquiryCTA />
      {products.some((p) => p.source === "sample") ? <SampleNotice /> : null}
    </>
  );
}

function SampleNotice() {
  return (
    <div className="container-page pb-12">
      <p className="rounded-lg border border-kraft-200 bg-kraft-50 px-4 py-3 text-xs text-kraft-800">
        Showing sample product content. Real catalog data loads automatically once the Feishu Base
        import is unblocked.
      </p>
    </div>
  );
}
