import Image from "next/image";

import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  alt: string;
  label?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Renders a real product image when an http(s) URL or local public path is
 * available, otherwise an honest placeholder. The wrapper is absolutely
 * positioned so it fills any positioning parent (e.g. AspectRatio or a
 * relative card). Missing product images are stored as a no-image state in the
 * product database — the placeholder says so explicitly.
 */
export default function ProductImage({
  src,
  alt,
  label,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority,
  className,
}: ProductImageProps) {
  const isRenderableImage =
    typeof src === "string" && (/^https?:\/\//i.test(src) || src.startsWith("/"));

  if (isRenderableImage) {
    return (
      <div className={cn("absolute inset-0", className)}>
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain p-3"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("product-placeholder absolute inset-0", className)}
      aria-label={`${alt} — image on request`}
    >
      <div className="px-4">
        <span className="block text-xs font-semibold uppercase tracking-widest text-brand-700">
          {label ?? "Product"}
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">
          No image in source
        </span>
      </div>
    </div>
  );
}
