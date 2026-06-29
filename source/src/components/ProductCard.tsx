import Link from "next/link";

import ProductImage from "@/components/ProductImage";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const inquiryHref = `/contact?product=${encodeURIComponent(product.name)}`;
  return (
    <article className="card card-hover flex flex-col overflow-hidden">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
        aria-label={product.name}
      >
        <ProductImage src={product.image} alt={product.name} label={product.category} />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/categories/${product.categorySlug}`}
            className="chip hover:border-brand-300 hover:text-brand-700"
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

        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-500">
          {product.material ? (
            <div className="truncate">
              <dt className="inline font-medium text-slate-600">Material:</dt>{" "}
              <dd className="inline">{product.material}</dd>
            </div>
          ) : null}
          {product.moq ? (
            <div className="truncate">
              <dt className="inline font-medium text-slate-600">MOQ:</dt>{" "}
              <dd className="inline">{product.moq}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-4 flex items-center gap-2 pt-1">
          <Link href={`/products/${product.slug}`} className="btn-outline flex-1">
            Details
          </Link>
          <Link href={inquiryHref} className="btn-primary flex-1">
            Inquire
          </Link>
        </div>
      </div>
    </article>
  );
}
