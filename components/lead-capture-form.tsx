"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LeadCaptureFormProps = {
  auditId: string
  monthlySavings: number
  isHighSavings: boolean
  onSuccess?: () => void
}

export function LeadCaptureForm({
  auditId,
  monthlySavings: _monthlySavings,
  isHighSavings,
  onSuccess,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [role, setRole] = useState("")
  const [website, setWebsite] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId,
          email,
          companyName: companyName || undefined,
          role: role || undefined,
          website,
        }),
      })

      if (response.status === 409) {
        setError("This email has already been sent a report for this audit.")
        return
      }

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? "Failed to send report")
      }

      setSubmitted(true)
      onSuccess?.()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-6xl rounded-[1.75rem] border border-emerald-500/40 bg-slate-900/95 p-6 sm:p-8">
        <p className="text-center text-lg font-medium text-emerald-300">✓ Report sent! Check your inbox.</p>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-6xl rounded-[1.75rem] border border-slate-800/80 bg-slate-900/95 p-6 shadow-[0_35px_90px_rgba(15,23,42,0.35)] sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Get your audit report via email</h2>
          {isHighSavings ? (
            <p className="text-slate-400">
              High savings detected — a Credex advisor will also reach out about discounted credits.
            </p>
          ) : (
            <p className="text-slate-400">We&apos;ll email you a link to your full audit results.</p>
          )}
        </div>

        <input
          type="text"
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          style={{ display: "none" }}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="lead-email">Email</Label>
            <Input
              id="lead-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="bg-slate-950 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lead-company">Company name (optional)</Label>
            <Input
              id="lead-company"
              type="text"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="Acme Inc."
              className="bg-slate-950 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lead-role">Role (optional)</Label>
            <Input
              id="lead-role"
              type="text"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="CTO"
              className="bg-slate-950 text-slate-100 placeholder:text-slate-500"
            />
          </div>
        </div>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
          {loading ? "Sending..." : "Send My Report"}
        </Button>
      </form>
    </Card>
  )
}
