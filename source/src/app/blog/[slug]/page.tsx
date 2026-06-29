import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import InquiryCTA from "@/components/InquiryCTA";
import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS, getBlogPost } from "@/lib/blogPosts";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return { title: "Guide not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <article>
        <section className="border-b bg-secondary/40">
          <div className="container-page section-tight">
            <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-1.5">/</span>
              <Link href="/blog" className="hover:text-primary">
                Blog
              </Link>
            </nav>
            <div className="mt-5 max-w-3xl">
              <Badge variant="brand">{post.category}</Badge>
              <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                {post.date} · {post.readTime}
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-page max-w-3xl">
            <div className="space-y-10">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-xl font-bold text-foreground">{section.heading}</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{section.body}</p>
                </section>
              ))}
            </div>
            <div className="mt-10 rounded-xl border bg-secondary/40 p-5 text-sm leading-relaxed text-muted-foreground">
              Use these guides as preparation notes. Exact MOQ, price, lead time, compliance
              documents, and material claims should always be confirmed against the selected
              product specification and destination market.
            </div>
          </div>
        </section>
      </article>

      <InquiryCTA />
    </>
  );
}
