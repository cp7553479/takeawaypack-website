import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-page max-w-xl text-center">
        <p className="text-6xl font-extrabold tracking-tight text-primary">404</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
