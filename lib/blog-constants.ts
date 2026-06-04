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

export function formatDate(date: Date | null) {
  if (!date) return ""
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(date)
}
