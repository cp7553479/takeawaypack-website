import Link from "next/link";
import { Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

interface BrandMarkProps {
  brandName?: string;
  tagline?: string;
  withLink?: boolean;
  variant?: "dark" | "light";
  className?: string;
}

/**
 * TakeawayPack wordmark. Icon glyph + typography so the brand renders
 * consistently without depending on an external logo asset.
 */
export default function BrandMark({
  brandName = "TakeawayPack",
  tagline = "Foodservice Packaging",
  withLink = true,
  variant = "dark",
  className,
}: BrandMarkProps) {
  const isLight = variant === "light";
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg shadow-sm",
          isLight ? "bg-white/15 text-white" : "bg-primary text-primary-foreground"
        )}
      >
        <Leaf className="h-5 w-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-base font-extrabold tracking-tight",
            isLight ? "text-white" : "text-foreground"
          )}
        >
          {brandName}
        </span>
        {tagline ? (
          <span
            className={cn(
              "mt-1 text-[10px] font-medium uppercase tracking-[0.2em]",
              isLight ? "text-white/70" : "text-muted-foreground"
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );

  if (withLink) {
    return (
      <Link href="/" aria-label={`${brandName} home`} className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}
