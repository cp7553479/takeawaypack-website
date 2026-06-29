import Image from "next/image";

interface BrandMarkProps {
  brandName: string;
  tagline?: string;
  compact?: boolean;
}

export default function BrandMark({ brandName }: BrandMarkProps) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span className="relative block h-11 w-[158px] shrink-0 overflow-hidden sm:w-[190px]">
        <Image
          src="/brand-logo.png"
          alt={brandName}
          fill
          priority
          sizes="(min-width: 640px) 190px, 158px"
          className="object-contain object-left"
        />
      </span>
      <span className="sr-only">{brandName}</span>
    </span>
  );
}
