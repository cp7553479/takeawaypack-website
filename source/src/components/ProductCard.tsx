import Link from "next/link";

import ProductImage from "@/components/ProductImage";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  showMoq?: boolean;
}

export default function ProductCard({ product, showMoq = true }: ProductCardProps) {
  const inquiryHref = `/contact?product=${encodeURIComponent(product.name)}`;
  return (
    <article className="card card-hover flex min-w-0 flex-col overflow-hidden">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-white"
        aria-label={product.name}
      >
        <ProductImage src={product.image} alt={product.name} label={product.category} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4 sm:pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href={`/categories/${product.categorySlug}`}
            className="chip min-w-0 max-w-full whitespace-normal break-words hover:border-brand-300 hover:text-brand-700"
          >
            {product.category}
          </Link>
          {product.featured ? (
            <span className="chip border-kraft-200 bg-kraft-50 text-kraft-700">Featured</span>
          ) : null}
        </div>

        <h3 className="mt-2 text-base font-semibold text-slate-900">
          <Link href={`/products/${product.slug}`} className="hover:text-brand-700">
            {product.name}
          </Link>
        </h3>

        {product.summary ? (
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{product.summary}</p>
        ) : null}

        <dl className="mt-3 grid gap-y-1 text-xs leading-snug text-slate-500 sm:grid-cols-2 sm:gap-x-3">
          {product.material ? (
            <div className="min-w-0 break-words">
              <dt className="inline font-medium text-slate-600">Material:</dt>{" "}
              <dd className="inline">{product.material}</dd>
            </div>
          ) : null}
          {showMoq && product.moq ? (
            <div className="min-w-0 break-words">
              <dt className="inline font-medium text-slate-600">MOQ:</dt>{" "}
              <dd className="inline">{product.moq}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-3 flex min-w-0 flex-wrap gap-2 text-xs">
          <span className="chip max-w-full whitespace-normal break-words border-brand-100 bg-brand-50 text-brand-800">
            {product.hasQuote === false ? "Contact for quote" : product.priceNote ?? "Contact for quote"}
          </span>
          {product.variantCount ? <span className="chip max-w-full whitespace-normal">{product.variantCount} specs</span> : null}
          {product.hasImage === false ? <span className="chip max-w-full whitespace-normal">No image</span> : null}
        </div>

        <div className="mt-4 flex min-w-0 items-center gap-2 pt-1">
          <Link href={`/products/${product.slug}`} className="btn-outline min-w-0 flex-1 px-2.5 text-xs sm:px-3 sm:text-sm">
            Details
          </Link>
          <Link
            href={inquiryHref}
            className="btn-primary min-w-0 flex-1 px-2.5 text-xs sm:px-3 sm:text-sm"
            aria-label={`Request a quote for ${product.name}`}
          >
            Quote
          </Link>
        </div>
      </div>
    </article>
  );
}
