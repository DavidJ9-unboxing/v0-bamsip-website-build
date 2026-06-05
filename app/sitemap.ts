import type { MetadataRoute } from "next"
import { getPublishedPosts } from "@/lib/blog"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bamsip.com"

// Regenerate the sitemap at most once an hour so newly published posts get
// picked up without rebuilding the whole site.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/venues`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/bammers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  let postRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await getPublishedPosts()
    postRoutes = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  } catch {
    // If the DB is unavailable, still return the static routes.
    postRoutes = []
  }

  return [...staticRoutes, ...postRoutes]
}
