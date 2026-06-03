"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"

export function AdminAuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === "sign-up"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? "Something went wrong")
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-2xl border border-hairline bg-ink2 p-7">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-flame/15 text-flame">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-cream">
            BamSip admin
          </h1>
          <p className="mt-1 text-sm text-mute">
            {isSignUp
              ? "Set up your admin account"
              : "Sign in to manage inquiries"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-cream2">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-cream2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-cream2">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          {error && (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-flame text-cream hover:bg-flame-soft"
          >
            {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-mute">
          {isSignUp ? "Already set up? " : "First time here? "}
          <button
            type="button"
            onClick={() => {
              setMode(isSignUp ? "sign-in" : "sign-up")
              setError(null)
            }}
            className="font-medium text-cream underline-offset-4 hover:underline"
          >
            {isSignUp ? "Sign in" : "Create your account"}
          </button>
        </p>
        <p className="mt-3 text-center text-xs text-mute">
          Access is restricted to authorized BamSip admins.
        </p>
      </div>
    </main>
  )
}
