import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"

export const BLOG_CATEGORIES = [
  { slug: "whats-on", label: "What's On" },
  { slug: "scene", label: "The Scene" },
  { slug: "openings", label: "New Openings" },
  { slug: "thought-leadership", label: "Big Picture" },
] as const

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]["slug"]

export function categoryLabel(slug: string) {
  return BLOG_CATEGORIES.find((c) => c.slug === slug)?.label ?? "What's On"
}

export type BlogPost = typeof blogPosts.$inferSelect

/** Published posts for the public blog index, newest first. */
export async function getPublishedPosts(category?: string) {
  const conds = [eq(blogPosts.status, "published")]
  if (category) conds.push(eq(blogPosts.category, category))
  return db
    .select()
    .from(blogPosts)
    .where(and(...conds))
    .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
}

/** The most recent featured (or newest) published post. */
export async function getFeaturedPost() {
  const [featured] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), eq(blogPosts.featured, true)))
    .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
    .limit(1)
  if (featured) return featured
  const [latest] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
    .limit(1)
  return latest ?? null
}

/** A single published post by slug. */
export async function getPostBySlug(slug: string) {
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
    .limit(1)
  return post ?? null
}

export function formatDate(date: Date | null) {
  if (!date) return ""
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(date)
}
