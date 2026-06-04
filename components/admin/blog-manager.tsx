"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  createPost,
  updatePost,
  setPostStatus,
  toggleFeatured,
  deletePost,
  queueSocialPost,
  type PostInput,
} from "@/app/actions/blog"
import { BLOG_CATEGORIES, categoryLabel } from "@/lib/blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Star,
  Trash2,
  Pencil,
  ExternalLink,
  Eye,
  EyeOff,
  Share2,
  Check,
} from "lucide-react"

type Post = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content: string
  coverImage: string | null
  category: string
  author: string
  sourceName: string | null
  sourceUrl: string | null
  status: string
  featured: boolean
  publishedAt: Date | null
  createdAt: Date | null
}

const empty: Post = {
  id: 0,
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "whats-on",
  author: "BamSip",
  sourceName: "",
  sourceUrl: "",
  status: "draft",
  featured: false,
  publishedAt: null,
  createdAt: null,
}

export function BlogManager({ initial }: { initial: Post[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<Post | null>(null)
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream">Blog</h1>
          <p className="text-sm text-mute">
            {initial.length} article{initial.length === 1 ? "" : "s"} · write
            once, push to email, SMS & socials
          </p>
        </div>
        <Button
          onClick={() => setEditing({ ...empty })}
          className="bg-flame text-cream hover:bg-flame-soft"
        >
          <Plus className="h-4 w-4" />
          New article
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink2 text-left text-xs uppercase tracking-wide text-mute">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {initial.map((p) => (
                <tr key={p.id} className="bg-ink transition-colors hover:bg-ink2">
                  <td className="px-4 py-3">
                    <div className="font-medium text-cream">{p.title}</div>
                    <div className="text-xs text-mute">/blog/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-cream2">
                    {categoryLabel(p.category)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          await setPostStatus(
                            p.id,
                            p.status === "published" ? "draft" : "published",
                          )
                          router.refresh()
                        })
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        p.status === "published"
                          ? "bg-success/15 text-success"
                          : "bg-ink3 text-mute"
                      }`}
                      title="Toggle published"
                    >
                      {p.status === "published" ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      {p.status === "published" ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          await toggleFeatured(p.id, !p.featured)
                          router.refresh()
                        })
                      }
                      title="Toggle featured"
                      className={
                        p.featured ? "text-amber" : "text-mute hover:text-cream2"
                      }
                    >
                      <Star
                        className="h-4 w-4"
                        fill={p.featured ? "currentColor" : "none"}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        className="rounded-lg p-2 text-mute transition-colors hover:bg-ink3 hover:text-cream"
                        title="View"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setEditing(p)}
                        className="rounded-lg p-2 text-mute transition-colors hover:bg-ink3 hover:text-cream"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        disabled={isPending}
                        onClick={() => {
                          if (!confirm(`Delete "${p.title}"?`)) return
                          startTransition(async () => {
                            await deletePost(p.id)
                            router.refresh()
                          })
                        }}
                        className="rounded-lg p-2 text-mute transition-colors hover:bg-error/10 hover:text-error"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!initial.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-mute">
                    No articles yet. Write your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PostEditor
        post={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null)
          router.refresh()
        }}
      />
    </div>
  )
}

function PostEditor({
  post,
  onClose,
  onSaved,
}: {
  post: Post | null
  onClose: () => void
  onSaved: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [shareMsg, setShareMsg] = useState<string | null>(null)

  return (
    <Sheet open={!!post} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto border-hairline bg-ink2 text-cream sm:max-w-xl"
      >
        {post && (
          <>
            <SheetHeader>
              <SheetTitle className="text-cream">
                {post.id ? "Edit article" : "New article"}
              </SheetTitle>
            </SheetHeader>

            <form
              id="post-form"
              action={(formData) => {
                setError(null)
                const input: PostInput = {
                  title: String(formData.get("title") || ""),
                  slug: String(formData.get("slug") || ""),
                  category: String(formData.get("category") || "whats-on"),
                  excerpt: String(formData.get("excerpt") || ""),
                  content: String(formData.get("content") || ""),
                  coverImage: String(formData.get("coverImage") || ""),
                  author: String(formData.get("author") || "BamSip"),
                  sourceName: String(formData.get("sourceName") || ""),
                  sourceUrl: String(formData.get("sourceUrl") || ""),
                  status: formData.get("publish") === "on" ? "published" : "draft",
                  featured: formData.get("featured") === "on",
                }
                if (!input.title.trim()) {
                  setError("A title is required.")
                  return
                }
                startTransition(async () => {
                  try {
                    if (post.id) await updatePost(post.id, input)
                    else await createPost(input)
                    onSaved()
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Failed to save")
                  }
                })
              }}
              className="mt-4 flex flex-col gap-4"
            >
              <Field label="Title">
                <Input name="title" defaultValue={post.title} required />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Category">
                  <Select name="category" defaultValue={post.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOG_CATEGORIES.map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Author">
                  <Input name="author" defaultValue={post.author} />
                </Field>
              </div>

              <Field label="Slug (optional — auto from title)">
                <Input
                  name="slug"
                  defaultValue={post.slug}
                  placeholder="auto-generated"
                />
              </Field>

              <Field label="Excerpt">
                <Textarea
                  name="excerpt"
                  defaultValue={post.excerpt ?? ""}
                  rows={2}
                  placeholder="One or two sentences for cards and previews."
                />
              </Field>

              <Field label="Cover image URL">
                <Input
                  name="coverImage"
                  defaultValue={post.coverImage ?? ""}
                  placeholder="/images/blog/your-image.png"
                />
              </Field>

              <Field label="Content (HTML — use <p>, <h2>, <ul>...)">
                <Textarea
                  name="content"
                  defaultValue={post.content}
                  rows={12}
                  className="font-mono text-xs"
                  placeholder="<p>Start writing...</p>"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Source name (optional)">
                  <Input
                    name="sourceName"
                    defaultValue={post.sourceName ?? ""}
                    placeholder="e.g. The Manc"
                  />
                </Field>
                <Field label="Source URL (optional)">
                  <Input
                    name="sourceUrl"
                    defaultValue={post.sourceUrl ?? ""}
                    placeholder="https://..."
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-hairline bg-ink p-3">
                <label className="flex items-center gap-2 text-sm text-cream2">
                  <Checkbox
                    name="publish"
                    defaultChecked={post.status === "published"}
                  />
                  Published (visible on the public blog)
                </label>
                <label className="flex items-center gap-2 text-sm text-cream2">
                  <Checkbox name="featured" defaultChecked={post.featured} />
                  Feature at the top of the blog
                </label>
              </div>

              {error && <p className="text-sm text-error">{error}</p>}
            </form>

            {/* Share to socials — only for saved posts */}
            {post.id > 0 && (
              <div className="mt-4 rounded-xl border border-hairline bg-ink p-3">
                <p className="flex items-center gap-1.5 text-sm font-medium text-cream">
                  <Share2 className="h-4 w-4 text-flame" />
                  Push to socials
                </p>
                <p className="mt-1 text-xs text-mute">
                  Queue this article as a post for Instagram and TikTok. It
                  sends automatically once those accounts are connected.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["instagram", "tiktok"].map((platform) => (
                    <Button
                      key={platform}
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          await queueSocialPost({
                            postId: post.id,
                            platform,
                            caption: `${post.title}${
                              post.excerpt ? ` — ${post.excerpt}` : ""
                            }`,
                            mediaUrl: post.coverImage ?? undefined,
                            linkUrl: `/blog/${post.slug}`,
                          })
                          setShareMsg(`Queued for ${platform}.`)
                        })
                      }
                      className="capitalize"
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
                {shareMsg && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-success">
                    <Check className="h-3 w-3" />
                    {shareMsg}
                  </p>
                )}
              </div>
            )}

            <SheetFooter className="mt-4 flex-row justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="post-form"
                disabled={isPending}
                className="bg-flame text-cream hover:bg-flame-soft"
              >
                {isPending ? "Saving..." : "Save article"}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-cream2">{label}</Label>
      {children}
    </div>
  )
}
