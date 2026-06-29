import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import InquiryCTA from "@/components/InquiryCTA";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import {
  getProductBySlug,
  getProductsByCategory,
  getProducts,
} from "@/lib/dataAdapter";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.summary ?? product.description?.slice(0, 150),
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getProductsByCategory(product.categorySlug)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const inquiryHref = `/contact?product=${encodeURIComponent(product.name)}`;

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="container-page section-tight">
          <nav className="text-xs text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/products" className="hover:text-brand-700">Products</Link>
            <span className="mx-1.5">/</span>
            <Link href={`/categories/${product.categorySlug}`} className="hover:text-brand-700">
              {product.category}
            </Link>
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <ProductImage
                src={product.image}
                alt={product.name}
                label={product.category}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </div>
            {product.gallery && product.gallery.length > 0 ? (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {product.gallery.slice(0, 4).map((g, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    <ProductImage src={g} alt={`${product.name} ${i + 1}`} label="Gallery" sizes="25vw" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/categories/${product.categorySlug}`} className="chip hover:border-brand-300 hover:text-brand-700">
                {product.category}
              </Link>
              {product.featured ? (
                <span className="chip border-kraft-200 bg-kraft-50 text-kraft-700">Featured</span>
              ) : null}
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {product.name}
            </h1>
            {product.summary ? <p className="mt-3 lead">{product.summary}</p> : null}

            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm">
              {product.material ? <SpecItem label="Material" value={product.material} /> : null}
              {product.moq ? <SpecItem label="MOQ" value={product.moq} /> : null}
              {product.leadTime ? <SpecItem label="Lead time" value={product.leadTime} /> : null}
              {product.customization ? <SpecItem label="Customization" value={product.customization} /> : null}
            </dl>

            {product.priceNote ? (
              <p className="mt-3 text-sm text-slate-500">{product.priceNote}</p>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Pricing: contact us for an FOB quotation based on your specs and quantity.</p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={inquiryHref} className="btn-accent">
                Request a quotation
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact us
              </Link>
            </div>

            {product.useCases && product.useCases.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Suitable for
                </h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {product.useCases.map((u) => (
                    <li key={u} className="chip">{u}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {(product.description || (product.features && product.features.length) || product.specs.length > 0) ? (
        <section className="section bg-slate-50">
          <div className="container-page grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Overview</h2>
              {product.description ? (
                <p className="mt-3 leading-relaxed text-slate-600">{product.description}</p>
              ) : null}
              {product.features && product.features.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-brand-700">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              ) : null}
              {product.certifications && product.certifications.length > 0 ? (
                <div className="mt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Certifications / reports
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {product.certifications.map((c) => (
                      <li key={c} className="chip border-kraft-200 bg-kraft-50 text-kraft-800">{c}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {product.specs.length > 0 ? (
              <div>
                <h2 className="text-xl font-bold text-slate-900">Specifications</h2>
                <table className="mt-3 w-full overflow-hidden rounded-xl border border-slate-200 text-sm">
                  <tbody>
                    {product.specs.map((s, i) => (
                      <tr key={s.label} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <th scope="row" className="w-2/5 border-b border-slate-100 px-4 py-3 text-left font-medium text-slate-600">
                          {s.label}
                        </th>
                        <td className="border-b border-slate-100 px-4 py-3 text-slate-800">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="section">
          <div className="container-page">
            <h2 className="text-xl font-bold text-slate-900">Related products</h2>
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

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-slate-800">{value}</dd>
    </div>
  );
}
