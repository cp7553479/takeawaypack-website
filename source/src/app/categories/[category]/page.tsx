import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import InquiryCTA from "@/components/InquiryCTA";
import ProductCard from "@/components/ProductCard";
import RfqChecklist from "@/components/RfqChecklist";
import { Button } from "@/components/ui/button";
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
      <section className="border-b bg-secondary/40">
        <div className="container-page section-tight">
          <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
          </nav>
          <p className="eyebrow mt-3 block">Category</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {cat!.name}
          </h1>
          {cat!.description ? (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {cat!.description}
            </p>
          ) : null}
          <div className="mt-5">
            <Button asChild variant="kraft">
              <Link href="/contact">Request a quotation</Link>
            </Button>
          </div>
        </div>
      </section>

      <RfqChecklist
        title={`Quoting ${cat!.name} products`}
        intro="Before selecting a final item, compare product size, material, quantity, packaging, destination, and documentation needs."
      />

      <section className="section">
        <div className="container-page">
          <p className="mb-6 text-sm text-muted-foreground">
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
