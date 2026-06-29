import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your inquiry has been received.",
};

export default function ThankYouPage() {
  return (
    <section className="section">
      <div className="container-page max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">Thank you</h1>
        <p className="lead mt-3">
          Your inquiry has been received. Our team will review it and reply by email, typically
          within one business day.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn-outline">Continue browsing</Link>
          <Link href="/" className="btn-primary">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
