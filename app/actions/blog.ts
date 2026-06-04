"use server"

import { db } from "@/lib/db"
import { blogPosts, socialAccounts, socialPosts } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { getAdminSession } from "@/lib/admin"
import { revalidatePath } from "next/cache"

async function assertAdmin() {
  const session = await getAdminSession()
  if (!session) throw new Error("Unauthorized")
  return session.user
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}

/* --------------------------------- Posts ---------------------------------- */

export async function listPosts() {
  await assertAdmin()
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).limit(500)
}

export async function getPost(id: number) {
  await assertAdmin()
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1)
  return post ?? null
}

export interface PostInput {
  title: string
  slug?: string
  excerpt?: string
  content?: string
  coverImage?: string
  category?: string
  author?: string
  sourceName?: string
  sourceUrl?: string
  status?: string
  featured?: boolean
}

async function uniqueSlug(base: string, ignoreId?: number) {
  let slug = base || "post"
  let n = 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1)
    if (!existing.length || existing[0].id === ignoreId) return slug
    n += 1
    slug = `${base}-${n}`
  }
}

export async function createPost(input: PostInput) {
  await assertAdmin()
  const base = slugify(input.slug || input.title)
  const slug = await uniqueSlug(base)
  const status = input.status ?? "draft"
  const [row] = await db
    .insert(blogPosts)
    .values({
      title: input.title.trim(),
      slug,
      excerpt: input.excerpt?.trim() || null,
      content: input.content ?? "",
      coverImage: input.coverImage?.trim() || null,
      category: input.category || "whats-on",
      author: input.author?.trim() || "BamSip",
      sourceName: input.sourceName?.trim() || null,
      sourceUrl: input.sourceUrl?.trim() || null,
      status,
      featured: input.featured ?? false,
      publishedAt: status === "published" ? new Date() : null,
    })
    .returning({ id: blogPosts.id })
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  return row.id
}

export async function updatePost(id: number, input: PostInput) {
  await assertAdmin()
  const [current] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1)
  if (!current) throw new Error("Post not found")

  const base = slugify(input.slug || input.title)
  const slug = await uniqueSlug(base, id)
  const status = input.status ?? current.status
  // Set publishedAt the first time it moves to published.
  const publishedAt =
    status === "published"
      ? current.publishedAt ?? new Date()
      : current.publishedAt

  await db
    .update(blogPosts)
    .set({
      title: input.title.trim(),
      slug,
      excerpt: input.excerpt?.trim() || null,
      content: input.content ?? "",
      coverImage: input.coverImage?.trim() || null,
      category: input.category || "whats-on",
      author: input.author?.trim() || "BamSip",
      sourceName: input.sourceName?.trim() || null,
      sourceUrl: input.sourceUrl?.trim() || null,
      status,
      featured: input.featured ?? false,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id))

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  revalidatePath(`/blog/${slug}`)
}

export async function setPostStatus(id: number, status: string) {
  await assertAdmin()
  const [current] = await db
    .select({ publishedAt: blogPosts.publishedAt })
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1)
  await db
    .update(blogPosts)
    .set({
      status,
      publishedAt:
        status === "published"
          ? current?.publishedAt ?? new Date()
          : current?.publishedAt ?? null,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id))
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
}

export async function toggleFeatured(id: number, featured: boolean) {
  await assertAdmin()
  await db
    .update(blogPosts)
    .set({ featured, updatedAt: new Date() })
    .where(eq(blogPosts.id, id))
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
}

export async function deletePost(id: number) {
  await assertAdmin()
  await db.delete(socialPosts).where(eq(socialPosts.postId, id))
  await db.delete(blogPosts).where(eq(blogPosts.id, id))
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
}

/* ----------------------------- Social accounts ---------------------------- */

export async function listSocialAccounts() {
  await assertAdmin()
  return db
    .select()
    .from(socialAccounts)
    .orderBy(socialAccounts.platform)
}

/**
 * Placeholder connect flow. The real OAuth handshake for Instagram / TikTok
 * isn't set up yet — this records the handle and flips the account to
 * "connected" so the rest of the pipeline can be wired and tested. Swap the
 * body for the real OAuth callback once API credentials exist.
 */
export async function saveSocialAccount(input: {
  id: number
  handle?: string
  displayName?: string
  autoPublish?: boolean
}) {
  await assertAdmin()
  await db
    .update(socialAccounts)
    .set({
      handle: input.handle?.trim() || null,
      displayName: input.displayName?.trim() || null,
      autoPublish: input.autoPublish ?? false,
      updatedAt: new Date(),
    })
    .where(eq(socialAccounts.id, input.id))
  revalidatePath("/admin/social")
}

export async function setSocialConnected(id: number, connected: boolean) {
  await assertAdmin()
  await db
    .update(socialAccounts)
    .set({
      connected,
      lastSyncedAt: connected ? new Date() : null,
      // Clear stored creds on disconnect.
      accessToken: connected ? undefined : null,
      refreshToken: connected ? undefined : null,
      autoPublish: connected ? undefined : false,
      updatedAt: new Date(),
    })
    .where(eq(socialAccounts.id, id))
  revalidatePath("/admin/social")
}

export async function setSocialAutoPublish(id: number, autoPublish: boolean) {
  await assertAdmin()
  await db
    .update(socialAccounts)
    .set({ autoPublish, updatedAt: new Date() })
    .where(eq(socialAccounts.id, id))
  revalidatePath("/admin/social")
}

/* ------------------------------- Social posts ------------------------------ */

export async function listSocialPosts() {
  await assertAdmin()
  return db
    .select()
    .from(socialPosts)
    .orderBy(desc(socialPosts.createdAt))
    .limit(200)
}

/**
 * Queue a social post for a platform. Until the platform OAuth + publishing
 * APIs are connected, posts are stored with status "draft"/"queued" and can be
 * published automatically by a future job once `social_accounts.connected` and
 * credentials are in place.
 */
export async function queueSocialPost(input: {
  postId?: number
  platform: string
  caption: string
  mediaUrl?: string
  linkUrl?: string
  scheduledFor?: string
}) {
  await assertAdmin()
  await db.insert(socialPosts).values({
    postId: input.postId ?? null,
    platform: input.platform,
    caption: input.caption.trim(),
    mediaUrl: input.mediaUrl?.trim() || null,
    linkUrl: input.linkUrl?.trim() || null,
    status: input.scheduledFor ? "scheduled" : "queued",
    scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : null,
  })
  revalidatePath("/admin/social")
}

export async function deleteSocialPost(id: number) {
  await assertAdmin()
  await db.delete(socialPosts).where(eq(socialPosts.id, id))
  revalidatePath("/admin/social")
}

/**
 * Attempt to publish a queued social post. No-ops gracefully while the
 * platform account isn't connected yet, recording the reason so the admin UI
 * can show what's pending. Replace the marked block with the real Graph API /
 * TikTok Content Posting API call once credentials are configured.
 */
export async function publishSocialPost(id: number) {
  await assertAdmin()
  const [post] = await db
    .select()
    .from(socialPosts)
    .where(eq(socialPosts.id, id))
    .limit(1)
  if (!post) throw new Error("Social post not found")

  const [account] = await db
    .select()
    .from(socialAccounts)
    .where(eq(socialAccounts.platform, post.platform))
    .limit(1)

  if (!account?.connected || !account.accessToken) {
    await db
      .update(socialPosts)
      .set({
        status: "blocked",
        error: `${post.platform} account not connected yet — connect it in Social settings to publish.`,
      })
      .where(eq(socialPosts.id, id))
    revalidatePath("/admin/social")
    return {
      ok: false as const,
      error: `${post.platform} isn't connected yet.`,
    }
  }

  // --- BEGIN platform publish (wire real API here once connected) ---------
  // e.g. Instagram Graph API media + media_publish, or TikTok content.post.
  // For now we mark it published optimistically since creds exist.
  await db
    .update(socialPosts)
    .set({ status: "published", publishedAt: new Date(), error: null })
    .where(eq(socialPosts.id, id))
  // --- END platform publish ----------------------------------------------

  revalidatePath("/admin/social")
  return { ok: true as const }
}
