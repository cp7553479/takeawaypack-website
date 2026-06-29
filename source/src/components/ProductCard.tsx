import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  /** When true, the card links to the detail page (default). When false it
   *  renders without the wrapping link (e.g. inside its own link). */
  linked?: boolean;
}

export default function ProductCard({ product, linked = true }: ProductCardProps) {
  const body = (
    <Card className="flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
      <div className="relative bg-muted/30">
        <AspectRatio ratio={1}>
          <ProductImage
            src={product.image}
            alt={product.name}
            label={product.category}
          />
        </AspectRatio>
        {product.featured ? (
          <Badge variant="kraft" className="absolute left-3 top-3">
            Featured
          </Badge>
        ) : null}
        {product.variantCount ? (
          <Badge variant="secondary" className="absolute right-3 top-3">
            {product.variantCount} specs
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        {product.summary ? (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {product.summary}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {product.material ? (
            <span className="truncate">
              <span className="font-medium text-foreground/70">Material:</span>{" "}
              {product.material}
            </span>
          ) : null}
          {product.moq ? (
            <span className="truncate">
              <span className="font-medium text-foreground/70">MOQ:</span> {product.moq}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-sm">
          <Badge variant="brand">
            {product.hasQuote === false
              ? "Contact for quote"
              : product.priceNote ?? "Contact for quote"}
          </Badge>
          <span className="font-semibold text-primary">View →</span>
        </div>
      </div>
    </Card>
  );

  if (!linked) return <div className="group h-full">{body}</div>;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block h-full"
      aria-label={product.name}
    >
      {body}
    </Link>
  );
}
