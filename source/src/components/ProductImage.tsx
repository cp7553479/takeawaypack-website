import Image from "next/image";

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
 * available, otherwise an honest gradient placeholder. Feishu attachment tokens
 * (which are not usable URLs) fall through to the placeholder until the asset
 * import step downloads them into /public.
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
      <Image
        src={src as string}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className ?? ""}`}
      />
    );
  }

  return (
    <div className={`product-placeholder ${className ?? ""}`} aria-label={`${alt} — image on request`}>
      <div className="px-4">
        <span className="block text-xs font-semibold uppercase tracking-widest text-brand-700">
          {label ?? "Product"}
        </span>
        <span className="mt-1 block text-xs text-slate-400">Image on request</span>
      </div>
    </div>
  );
}
