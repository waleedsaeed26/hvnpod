import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://hvnpod.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: { slug: string; updatedAt: Date }[] = [];
  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    [products, posts] = await Promise.all([
      prisma.product.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);
  } catch {
    // Database not available during build — return static pages only
  }

  const staticPages = [
    { url: `${BASE_URL}/en`, priority: 1.0 },
    { url: `${BASE_URL}/ar`, priority: 1.0 },
    { url: `${BASE_URL}/en/products`, priority: 0.9 },
    { url: `${BASE_URL}/en/products/acoustic-pods`, priority: 0.9 },
    { url: `${BASE_URL}/en/configure`, priority: 0.8 },
    { url: `${BASE_URL}/en/about`, priority: 0.7 },
    { url: `${BASE_URL}/en/journal`, priority: 0.7 },
    { url: `${BASE_URL}/en/contact`, priority: 0.7 },
    { url: `${BASE_URL}/en/faq`, priority: 0.6 },
  ].map(({ url, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
  }));

  const productPages = products.map((p) => ({
    url: `${BASE_URL}/en/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages = posts.map((p) => ({
    url: `${BASE_URL}/en/journal/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
