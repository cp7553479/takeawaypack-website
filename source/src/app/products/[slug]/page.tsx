import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import InquiryCTA from "@/components/InquiryCTA";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import RfqChecklist from "@/components/RfqChecklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getProductBySlug,
  getProducts,
  getProductsByCategory,
  getVariantsForProduct,
} from "@/lib/dataAdapter";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.summary ?? product.description?.slice(0, 150),
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = (await getProductsByCategory(product.categorySlug))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);
  const variants = await getVariantsForProduct(product);

  const inquiryHref = `/contact?product=${encodeURIComponent(product.name)}`;
  const galleryImages = Array.from(
    new Set([product.image, ...(product.gallery ?? [])].filter(Boolean))
  ) as string[];

  const facts: Array<[string, string | undefined]> = [
    ["Material", product.material],
    ["MOQ", product.moq],
    ["Lead time", product.leadTime],
    ["Customization", product.customization],
  ].filter(([, v]) => Boolean(v)) as Array<[string, string]>;

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
            <span className="mx-1.5">/</span>
            <Link
              href={`/categories/${product.categorySlug}`}
              className="hover:text-primary"
            >
              {product.category}
            </Link>
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <ProductGallery
            images={galleryImages}
            productName={product.name}
            category={product.category}
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/categories/${product.categorySlug}`}>
                <Badge variant="secondary">{product.category}</Badge>
              </Link>
              {product.featured ? <Badge variant="kraft">Featured</Badge> : null}
              {product.variantCount ? (
                <Badge variant="outline">{product.variantCount} specs</Badge>
              ) : null}
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>
            {product.summary ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {product.summary}
              </p>
            ) : null}

            {facts.length > 0 ? (
              <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border bg-card p-5">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-0.5 text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <p className="mt-4 text-sm font-medium text-foreground">
              {product.hasQuote === false
                ? "Contact for quote"
                : product.priceNote ?? "Contact for quote"}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="kraft" size="lg">
                <Link href={inquiryHref}>Request a quotation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4" /> Back to catalog
                </Link>
              </Button>
            </div>

            {product.useCases && product.useCases.length > 0 ? (
              <div className="mt-7">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Suitable for
                </h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {product.useCases.map((u) => (
                    <li key={u}>
                      <Badge variant="outline">{u}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {(product.description ||
        (product.features && product.features.length) ||
        product.specs.length > 0) ? (
        <section className="section bg-secondary/40">
          <div className="container-page grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-foreground">Overview</h2>
              {product.description ? (
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              ) : null}
              {product.features && product.features.length > 0 ? (
                <ul className="mt-5 space-y-2.5">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              ) : null}
              {product.certifications && product.certifications.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Certifications / reports
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {product.certifications.map((c) => (
                      <li key={c}>
                        <Badge variant="kraft">{c}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {product.specs.length > 0 ? (
              <div>
                <h2 className="text-xl font-bold text-foreground">Specifications</h2>
                <Accordion type="single" collapsible defaultValue="specs" className="mt-3">
                  <AccordionItem value="specs" className="rounded-lg border bg-card px-4">
                    <AccordionTrigger>Full specification table</AccordionTrigger>
                    <AccordionContent>
                      <table className="w-full overflow-hidden text-sm">
                        <tbody>
                          {product.specs.map((s) => (
                            <tr key={s.label} className="border-b last:border-0">
                              <th
                                scope="row"
                                className="w-2/5 py-2.5 pr-4 text-left font-medium text-muted-foreground"
                              >
                                {s.label}
                              </th>
                              <td className="py-2.5 text-foreground">{s.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <RfqChecklist
        title="Prepare the product quotation request"
        intro="Use the checklist below to send the context needed for a practical product quotation and sample discussion."
      />

      {variants.length > 0 ? (
        <section className="section">
          <div className="container-page">
            <h2 className="text-xl font-bold text-foreground">Available specifications</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {variants.map((variant) => (
                <ProductCard key={variant.id} product={variant} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="section bg-secondary/40">
          <div className="container-page">
            <h2 className="text-xl font-bold text-foreground">Related products</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <InquiryCTA />
    </>
  );
}
