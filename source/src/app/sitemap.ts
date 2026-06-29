import type { MetadataRoute } from "next";

import { BLOG_POSTS } from "@/lib/blogPosts";
import { getCategories, getProducts } from "@/lib/dataAdapter";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000");
  const now = new Date();

  const staticRoutes = ["", "/products", "/blog", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const categories = await getCategories();
  const products = await getProducts();

  const categoryRoutes = categories.map((c) => ({
    url: `${base}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
