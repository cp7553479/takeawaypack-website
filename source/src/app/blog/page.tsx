import type { Metadata } from "next";
import Link from "next/link";

import { BLOG_POSTS } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog & Buyer Guides",
  description:
    "Practical buyer guides for takeaway packaging RFQs, sample review, materials, and custom foodservice packaging sourcing.",
};

export default function BlogPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="container-page section-tight">
          <span className="eyebrow">Blog</span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Buyer guides for packaging sourcing
          </h1>
          <p className="lead mt-3 max-w-2xl">
            Practical notes for overseas foodservice packaging buyers, written to support clearer
            RFQs, sample checks, and conservative material claims.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="card card-hover flex flex-col p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="chip border-brand-100 bg-brand-50 text-brand-800">{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-4 text-lg font-bold leading-snug text-slate-950">
                <Link href={`/blog/${post.slug}`} className="hover:text-brand-700">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="btn-outline mt-5 self-start">
                Read guide
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
