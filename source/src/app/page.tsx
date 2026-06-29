import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  PackageSearch,
  PenTool,
  ShieldCheck,
  Truck,
} from "lucide-react";

import CategoryGrid from "@/components/CategoryGrid";
import InquiryCTA from "@/components/InquiryCTA";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/section-heading";
import ValueProps from "@/components/value-props";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { getFeaturedProducts, getSiteData } from "@/lib/dataAdapter";
import { getMediaAssetUrl } from "@/lib/mediaAssets";

const HOW_IT_WORKS = [
  {
    icon: PackageSearch,
    title: "Browse the catalog",
    body: "Filter by category and material to shortlist formats for hot, cold, delivery, or retail use.",
  },
  {
    icon: PenTool,
    title: "Define your spec",
    body: "Share size, material, print, quantity, and destination so MOQ and pricing match the exact item.",
  },
  {
    icon: ShieldCheck,
    title: "Confirm with samples",
    body: "Use artwork checks and physical samples to lock fit, print direction, and documentation.",
  },
  {
    icon: Truck,
    title: "Export-ready packing",
    body: "Align carton marks, packing method, and shipping notes for international foodservice buyers.",
  },
];

export default async function HomePage() {
  const data = await getSiteData();
  const featured = await getFeaturedProducts(6);
  const [heroImage] = await Promise.all([
    getMediaAssetUrl("/generated/marketing/hero-global-foodservice-packaging.png"),
  ]);

  const stats = data.info.stats ?? [
    { label: "Product range", value: "Broad" },
    { label: "Export support", value: "Ready" },
    { label: "RFQ model", value: "First" },
    { label: "MOQ", value: "Flexible" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/60 via-background to-background"
        />
        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="animate-fade-up">
            <Badge variant="brand" className="mb-4">
              {data.info.tagline ?? "Takeaway & Food Packaging for Export"}
            </Badge>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Reliable takeaway packaging, built for global trade buyers.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Browse the catalog, then send one RFQ with your size, material, print,
              quantity, and destination. Pricing, MOQ, and lead time are confirmed against
              the exact specification — not assumed from a generic card.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">
                  Get a Quote <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                "Custom print & private label",
                "Material options per item",
                "Sample-first decisions",
                "Export packing notes",
              ].map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-card shadow-xl">
              <Image
                src={heroImage}
                alt="Foodservice packaging range for export sourcing"
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
            </div>
            <Card className="absolute -bottom-5 -left-3 hidden gap-2 p-4 shadow-lg sm:flex">
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Data source
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {data.dataSource === "imported" ? "Imported catalog" : "Sample catalog"}
                </span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b bg-secondary/40">
        <div className="container-page grid grid-cols-2 gap-px py-2 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-6 text-center">
              <div className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Product range"
              title="Source by packaging category"
              description="Visual category browsing helps buyers narrow materials, sizes, and use cases before sending an RFQ."
            />
            <Button asChild variant="outline" className="self-start sm:self-auto">
              <Link href="/products">Browse all products</Link>
            </Button>
          </div>
          <div className="mt-10">
            <CategoryGrid categories={data.categories} />
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section bg-secondary/40">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Featured"
              title="Popular packaging for trade buyers"
              description="A starting shortlist. Confirm the right material, size, print, and MOQ for your order through the RFQ."
            />
            <Button asChild variant="outline" className="self-start sm:self-auto">
              <Link href="/products">
                All products <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <ValueProps pillars={data.info.valueProps} />

      {/* How it works */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="From shortlist to quote in fewer steps"
            description="The site is built around the sourcing questions overseas packaging buyers ask first."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, index) => (
              <Card key={step.title} className="relative h-full p-6">
                <span className="text-sm font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <step.icon className="mt-3 h-7 w-7 text-foreground" />
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog / Insights teaser */}
      <section className="section bg-secondary/40">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Blog & Insights"
              title="Buyer guides for better packaging RFQs"
              description="Reference articles help buyers prepare product specs, sample checks, and material questions before contacting the sales team."
            />
            <Button asChild variant="outline" className="self-start sm:self-auto">
              <Link href="/blog">View all guides</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <Card
                key={post.slug}
                className="flex flex-col p-6 transition hover:border-brand-300 hover:shadow-md"
              >
                <Badge variant="brand" className="self-start">
                  {post.category}
                </Badge>
                <h3 className="mt-4 text-lg font-bold leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  Read guide <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <InquiryCTA />
    </>
  );
}
