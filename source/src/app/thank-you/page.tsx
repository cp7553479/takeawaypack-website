import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your inquiry has been received.",
};

export default function ThankYouPage() {
  return (
    <section className="section">
      <div className="container-page max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground">Thank you</h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          Your inquiry has been received. The quotation team will review the details and follow up
          through the contact information you provided.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/products">Continue browsing</Link>
          </Button>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
