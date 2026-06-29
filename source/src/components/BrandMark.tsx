interface BrandMarkProps {
  brandName: string;
  tagline?: string;
  compact?: boolean;
}

export default function BrandMark({ brandName, tagline, compact = false }: BrandMarkProps) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-200 bg-white shadow-sm">
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          className="h-8 w-8 text-brand-700"
          fill="none"
        >
          <path
            d="M10 17.5 24 10l14 7.5-14 7.5-14-7.5Z"
            fill="#D1FAE5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M10 18v14.5L24 40l14-7.5V18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M24 25v15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M28.5 17.5c4.5-6.2 10.4-4.4 11.8-3.8-.3 2.2-2.3 7.4-9.9 7.2"
            fill="#F7ECD9"
            stroke="#AD6624"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 35.5c4.8 2.9 10.2 4.3 16 4.3s11.2-1.4 16-4.3"
            stroke="#AD6624"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 4"
          />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-base font-extrabold tracking-tight text-slate-950">
          {brandName}
        </span>
        {!compact && tagline ? (
          <span className="hidden max-w-[240px] truncate text-[11px] font-medium text-slate-500 sm:block">
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
