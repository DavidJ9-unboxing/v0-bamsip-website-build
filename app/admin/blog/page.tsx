import { requireAdmin } from "@/lib/admin"
import { listPosts } from "@/app/actions/blog"
import { BlogManager } from "@/components/admin/blog-manager"

export default async function AdminBlogPage() {
  await requireAdmin()
  const posts = await listPosts()
  return <BlogManager initial={posts} />
}
