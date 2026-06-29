"use client";

import { useMemo, useRef, useState } from "react";

import ProductImage from "@/components/ProductImage";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  category?: string;
}

export default function ProductGallery({ images, productName, category }: ProductGalleryProps) {
  const usableImages = useMemo(() => images.filter(Boolean), [images]);
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const current = usableImages[active];

  const move = (direction: -1 | 1) => {
    if (usableImages.length <= 1) return;
    setActive((index) => (index + direction + usableImages.length) % usableImages.length);
    stripRef.current?.scrollBy({ left: direction * 132, behavior: "smooth" });
  };

  return (
    <div className="product-gallery">
      <div className="relative mx-auto aspect-[16/10] max-h-[460px] max-w-[680px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <ProductImage
          src={current}
          alt={productName}
          label={category}
          sizes="(min-width: 1024px) 48vw, 100vw"
          priority
        />
        {usableImages.length > 1 ? (
          <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
            <button
              type="button"
              aria-label="Previous product image"
              onClick={() => move(-1)}
              className="gallery-nav-button"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18 9 12l6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next product image"
              onClick={() => move(1)}
              className="gallery-nav-button"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>

      {usableImages.length > 1 ? (
        <div className="mt-4">
          <div
            ref={stripRef}
            className="flex snap-x gap-3 overflow-x-auto pb-2"
            aria-label={`${productName} image gallery`}
          >
            {usableImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`relative h-24 w-24 flex-none snap-start overflow-hidden rounded-lg border bg-white transition sm:h-28 sm:w-28 ${
                  index === active
                    ? "border-brand-500 ring-2 ring-brand-500/20"
                    : "border-slate-200 hover:border-brand-300"
                }`}
                aria-label={`Show image ${index + 1} of ${usableImages.length}`}
                aria-current={index === active}
              >
                <ProductImage src={image} alt={`${productName} thumbnail ${index + 1}`} label="Gallery" sizes="112px" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
