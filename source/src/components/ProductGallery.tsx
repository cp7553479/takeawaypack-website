"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ProductImage from "@/components/ProductImage";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  category?: string;
}

/**
 * Product media viewer built on the shadcn Carousel (Embla). Shows the active
 * image on a fixed-ratio stage, with a thumbnail strip that syncs the active
 * slide. Falls back to an honest "no image in source" state when there is no
 * renderable asset.
 */
export default function ProductGallery({
  images,
  productName,
  category,
}: ProductGalleryProps) {
  const usable = React.useMemo(() => images.filter(Boolean), [images]);
  const list = usable.length ? usable : [undefined];
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Carousel opts={{ align: "center" }} setApi={setApi} className="px-1 py-1">
          <CarouselContent>
            {list.map((src, i) => (
              <CarouselItem key={i}>
                <AspectRatio ratio={1}>
                  <ProductImage
                    src={src}
                    alt={`${productName} — image ${i + 1}`}
                    label={category}
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    priority={i === 0}
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          {list.length > 1 ? (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          ) : null}
        </Carousel>
      </div>

      {list.length > 1 ? (
        <div
          className="grid grid-cols-5 gap-2"
          aria-label={`${productName} image gallery`}
        >
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => api?.scrollTo(i)}
              aria-label={`Show image ${i + 1} of ${list.length}`}
              aria-current={i === current}
              className={cn(
                "relative overflow-hidden rounded-md border bg-muted/30 transition",
                i === current
                  ? "border-primary ring-2 ring-ring/40"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              <AspectRatio ratio={1}>
                <ProductImage
                  src={src}
                  alt={`${productName} thumbnail ${i + 1}`}
                  label="Gallery"
                  sizes="120px"
                />
              </AspectRatio>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
