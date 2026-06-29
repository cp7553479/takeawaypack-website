import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BLOG_POSTS } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog & Buyer Guides",
  description:
    "Practical buyer guides for takeaway packaging RFQs, sample review, materials, and custom foodservice packaging sourcing.",
};

export default function BlogPage() {
  return (
    <>
      <section className="border-b bg-secondary/40">
        <div className="container-page section-tight">
          <p className="eyebrow">Blog</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Buyer guides for packaging sourcing
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Practical notes for overseas foodservice packaging buyers, written to support clearer
            RFQs, sample checks, and conservative material claims.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Card
              key={post.slug}
              className="flex flex-col p-6 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="brand">{post.category}</Badge>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-4 text-lg font-bold leading-snug">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                  {post.title}
                </Link>
              </h2>
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
      </section>
    </>
  );
}
