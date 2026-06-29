import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import InquiryCTA from "@/components/InquiryCTA";
import ProductCard from "@/components/ProductCard";
import RfqChecklist from "@/components/RfqChecklist";
import { getCategories, getProductsByCategory } from "@/lib/dataAdapter";

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cat = (await getCategories()).find((c) => c.slug === params.category);
  if (!cat) return { title: "Category not found" };
  return {
    title: `${cat.name} — Takeaway Packaging`,
    description: cat.description ?? `${cat.name} for takeaway and food-service packaging.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const cat = (await getCategories()).find((c) => c.slug === params.category);
  if (!cat) notFound();
  const products = await getProductsByCategory(params.category);
  if (products.length === 0) notFound();

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="container-page section-tight">
          <nav className="text-xs text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/products" className="hover:text-brand-700">Products</Link>
          </nav>
          <span className="eyebrow mt-3 block">Category</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {cat!.name}
          </h1>
          {cat!.description ? <p className="lead mt-3 max-w-2xl">{cat!.description}</p> : null}
          <div className="mt-4">
            <Link href="/contact" className="btn-accent">Request a quotation</Link>
          </div>
        </div>
      </section>

      <RfqChecklist
        title={`Quoting ${cat!.name} products`}
        intro="Before selecting a final item, compare product size, material, quantity, packaging, destination, and documentation needs."
      />

      <section className="section">
        <div className="container-page">
          <p className="mb-6 text-sm text-slate-500">
            {products.length} product{products.length === 1 ? "" : "s"} in this category
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <InquiryCTA />
    </>
  );
}
