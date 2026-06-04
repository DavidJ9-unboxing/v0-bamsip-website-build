import { requireAdmin } from "@/lib/admin"
import { listSocialAccounts, listSocialPosts } from "@/app/actions/blog"
import { SocialManager } from "@/components/admin/social-manager"

export default async function AdminSocialPage() {
  await requireAdmin()
  const [accounts, posts] = await Promise.all([
    listSocialAccounts(),
    listSocialPosts(),
  ])
  return <SocialManager accounts={accounts} posts={posts} />
}
