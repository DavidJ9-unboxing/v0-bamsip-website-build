import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogSubscribe } from "@/components/blog/blog-subscribe"
import {
  getPublishedPosts,
  getFeaturedPost,
  BLOG_CATEGORIES,
  categoryLabel,
  formatDate,
} from "@/lib/blog"

export const metadata: Metadata = {
  title: "What's On in Manchester — The BamSip Blog",
  description:
    "Manchester nightlife news, new openings and the stories shaping the city after dark. Delivered by email, SMS, TikTok and Instagram.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "What's On in Manchester — The BamSip Blog",
    description:
      "Manchester nightlife news, new openings and the stories shaping the city after dark.",
    url: "/blog",
    type: "website",
  },
}

export const revalidate = 3600

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const activeCategory =
    category && BLOG_CATEGORIES.some((c) => c.slug === category)
      ? category
      : undefined

  const [featured, posts] = await Promise.all([
    getFeaturedPost(),
    getPublishedPosts(activeCategory),
  ])

  // When viewing "all", don't repeat the featured post in the grid below.
  const gridPosts =
    activeCategory || !featured
      ? posts
      : posts.filter((p) => p.id !== featured.id)

  return (
    <div className="min-h-screen bg-ink">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-flame">
            The BamSip Blog
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl font-bold text-cream sm:text-5xl">
            What&apos;s on in Manchester
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-cream2">
            Nightlife news, new openings and the stories shaping the city after
            dark. We send the best of it straight to you — by email, SMS, TikTok
            and Instagram.
          </p>
        </header>

        {/* Category filter */}
        <nav
          aria-label="Blog categories"
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <CategoryPill href="/blog" label="All" active={!activeCategory} />
          {BLOG_CATEGORIES.map((c) => (
            <CategoryPill
              key={c.slug}
              href={`/blog?category=${c.slug}`}
              label={c.label}
              active={activeCategory === c.slug}
            />
          ))}
        </nav>

        {/* Featured */}
        {!activeCategory && featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-10 grid overflow-hidden rounded-3xl border border-hairline bg-ink2 md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
              {featured.coverImage && (
                <Image
                  src={featured.coverImage || "/placeholder.svg"}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              )}
            </div>
            <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-flame/15 px-2.5 py-1 font-semibold text-flame">
                  {categoryLabel(featured.category)}
                </span>
                <span className="text-mute">
                  {formatDate(featured.publishedAt)}
                </span>
              </div>
              <h2 className="text-balance font-display text-2xl font-bold text-cream sm:text-3xl">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="text-pretty leading-relaxed text-cream2">
                  {featured.excerpt}
                </p>
              )}
              <span className="mt-1 text-sm font-semibold text-flame">
                Read the story →
              </span>
            </div>
          </Link>
        )}

        {/* Grid */}
        {gridPosts.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-ink2 transition-colors hover:border-flame/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {post.coverImage && (
                    <Image
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="rounded-full bg-ink3 px-2 py-0.5 font-semibold text-amber">
                      {categoryLabel(post.category)}
                    </span>
                    <span className="text-mute">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-pretty font-display text-lg font-bold leading-snug text-cream">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="line-clamp-3 text-sm leading-relaxed text-mute">
                      {post.excerpt}
                    </p>
                  )}
                  {post.sourceName && (
                    <p className="mt-auto pt-2 text-[11px] text-mute">
                      via {post.sourceName}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-mute">
            No articles here yet — check back soon.
          </p>
        )}

        {/* Subscribe */}
        <BlogSubscribe />
      </main>

      <Footer />
    </div>
  )
}

function CategoryPill({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-flame text-cream"
          : "border border-hairline bg-ink2 text-cream2 hover:text-cream"
      }`}
    >
      {label}
    </Link>
  )
}
