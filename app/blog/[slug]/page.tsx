import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogSubscribe } from "@/components/blog/blog-subscribe"
import {
  getPostBySlug,
  getPublishedPosts,
  categoryLabel,
  formatDate,
} from "@/lib/blog"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: "Article not found — BamSip" }
  return {
    title: `${post.title} — BamSip`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      type: "article",
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const related = (await getPublishedPosts(post.category))
    .filter((p) => p.id !== post.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-ink">
      <Header />

      <main className="pb-20 pt-24">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-mute transition-colors hover:text-cream"
          >
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>

          <div className="mt-6 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-flame/15 px-2.5 py-1 font-semibold text-flame">
              {categoryLabel(post.category)}
            </span>
            <span className="text-mute">{formatDate(post.publishedAt)}</span>
          </div>

          <h1 className="mt-4 text-balance font-display text-3xl font-bold leading-tight text-cream sm:text-4xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-pretty text-lg leading-relaxed text-cream2">
              {post.excerpt}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm text-mute">
            <span>By {post.author}</span>
            {post.sourceName && (
              <>
                <span aria-hidden>·</span>
                {post.sourceUrl ? (
                  <a
                    href={post.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-flame hover:underline"
                  >
                    {post.sourceName}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span>via {post.sourceName}</span>
                )}
              </>
            )}
          </div>
        </article>

        {post.coverImage && (
          <div className="mx-auto mt-8 max-w-4xl px-4 sm:px-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-hairline">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        <div
          className="prose-bamsip mx-auto mt-8 max-w-3xl px-4 sm:px-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {related.length > 0 && (
          <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-xl font-bold text-cream">
              More in {categoryLabel(post.category)}
            </h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-ink2 transition-colors hover:border-flame/40"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {r.coverImage && (
                      <Image
                        src={r.coverImage || "/placeholder.svg"}
                        alt={r.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="text-pretty font-display text-base font-bold leading-snug text-cream">
                      {r.title}
                    </h3>
                    {r.excerpt && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-mute">
                        {r.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <BlogSubscribe />
        </div>
      </main>

      <Footer />
    </div>
  )
}
