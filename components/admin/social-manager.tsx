"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  saveSocialAccount,
  setSocialConnected,
  setSocialAutoPublish,
  publishSocialPost,
  deleteSocialPost,
} from "@/app/actions/blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Instagram, Music2, Trash2, Send, AlertCircle, Check } from "lucide-react"

type Account = {
  id: number
  platform: string
  handle: string | null
  displayName: string | null
  connected: boolean
  autoPublish: boolean
  lastSyncedAt: Date | null
}

type SocialPost = {
  id: number
  postId: number | null
  platform: string
  caption: string | null
  mediaUrl: string | null
  linkUrl: string | null
  status: string
  scheduledFor: Date | null
  publishedAt: Date | null
  error: string | null
  createdAt: Date | null
}

const PLATFORM_META: Record<
  string,
  { label: string; icon: typeof Instagram }
> = {
  instagram: { label: "Instagram", icon: Instagram },
  tiktok: { label: "TikTok", icon: Music2 },
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-success/15 text-success",
  queued: "bg-amber/15 text-amber",
  scheduled: "bg-amber/15 text-amber",
  blocked: "bg-error/15 text-error",
  draft: "bg-ink3 text-mute",
}

export function SocialManager({
  accounts,
  posts,
}: {
  accounts: Account[]
  posts: SocialPost[]
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-cream">Social</h1>
        <p className="text-sm text-mute">
          Connect Instagram and TikTok, then auto-share new articles to your
          followers.
        </p>
      </div>

      {/* Accounts */}
      <div className="grid gap-4 sm:grid-cols-2">
        {accounts.map((a) => (
          <AccountCard key={a.id} account={a} />
        ))}
      </div>

      {/* Queue */}
      <div>
        <h2 className="font-display text-lg font-bold text-cream">
          Post queue
        </h2>
        <p className="text-sm text-mute">
          Articles you&apos;ve pushed to socials. Connected accounts publish
          automatically; the rest wait here.
        </p>

        <div className="mt-3 overflow-hidden rounded-2xl border border-hairline">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink2 text-left text-xs uppercase tracking-wide text-mute">
                <tr>
                  <th className="px-4 py-3 font-medium">Platform</th>
                  <th className="px-4 py-3 font-medium">Caption</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {posts.map((p) => (
                  <PostRow key={p.id} post={p} />
                ))}
                {!posts.length && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-mute"
                    >
                      Nothing queued yet. Push an article from the Blog editor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccountCard({ account }: { account: Account }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const meta = PLATFORM_META[account.platform] ?? {
    label: account.platform,
    icon: Instagram,
  }
  const Icon = meta.icon
  const [handle, setHandle] = useState(account.handle ?? "")

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-hairline bg-ink2 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink3 text-flame">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-cream">{meta.label}</p>
            <p className="text-xs text-mute">
              {account.connected ? "Connected" : "Not connected"}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            account.connected
              ? "bg-success/15 text-success"
              : "bg-ink3 text-mute"
          }`}
        >
          {account.connected ? "Live" : "Off"}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-cream2">Handle</Label>
        <Input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@bamsip"
          onBlur={() =>
            startTransition(async () => {
              await saveSocialAccount({ id: account.id, handle })
              router.refresh()
            })
          }
        />
      </div>

      <label className="flex items-center justify-between rounded-xl border border-hairline bg-ink p-3">
        <span className="text-sm text-cream2">
          Auto-publish new articles
          <span className="block text-xs text-mute">
            Push articles here automatically
          </span>
        </span>
        <Switch
          checked={account.autoPublish}
          disabled={!account.connected || isPending}
          onCheckedChange={(v) =>
            startTransition(async () => {
              await setSocialAutoPublish(account.id, v)
              router.refresh()
            })
          }
        />
      </label>

      <Button
        type="button"
        variant={account.connected ? "outline" : "default"}
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await setSocialConnected(account.id, !account.connected)
            router.refresh()
          })
        }
        className={
          account.connected ? "" : "bg-flame text-cream hover:bg-flame-soft"
        }
      >
        {account.connected
          ? "Disconnect"
          : `Connect ${meta.label}`}
      </Button>
      {!account.connected && (
        <p className="flex items-start gap-1.5 text-xs text-mute">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          OAuth isn&apos;t wired yet — connecting marks the account ready so the
          publishing pipeline can be tested.
        </p>
      )}
    </div>
  )
}

function PostRow({ post }: { post: SocialPost }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)
  const meta = PLATFORM_META[post.platform]

  return (
    <tr className="bg-ink align-top transition-colors hover:bg-ink2">
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 capitalize text-cream2">
          {meta && <meta.icon className="h-4 w-4 text-flame" />}
          {meta?.label ?? post.platform}
        </span>
      </td>
      <td className="max-w-xs px-4 py-3 text-cream2">
        <p className="line-clamp-2">{post.caption}</p>
        {msg && (
          <p className="mt-1 flex items-center gap-1 text-xs text-success">
            <Check className="h-3 w-3" />
            {msg}
          </p>
        )}
        {post.error && (
          <p className="mt-1 text-xs text-error">{post.error}</p>
        )}
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
            STATUS_STYLES[post.status] ?? "bg-ink3 text-mute"
          }`}
        >
          {post.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          {post.status !== "published" && (
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  const res = await publishSocialPost(post.id)
                  if (res.ok) setMsg("Published")
                  router.refresh()
                })
              }
              className="rounded-lg p-2 text-mute transition-colors hover:bg-ink3 hover:text-cream"
              title="Publish now"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await deleteSocialPost(post.id)
                router.refresh()
              })
            }
            className="rounded-lg p-2 text-mute transition-colors hover:bg-error/10 hover:text-error"
            title="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
