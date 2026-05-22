"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { AuditResultsView } from "@/components/audit-results-view"
import { runAudit } from "@/lib/audit-engine"
import { useAuditStore } from "@/lib/store"

export default function Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [auditId, setAuditId] = useState<string | null>(null)
  const [shareStatus, setShareStatus] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const savedRef = useRef(false)
  const teamSize = useAuditStore((state) => state.teamSize)
  const useCase = useAuditStore((state) => state.useCase)
  const toolEntries = useAuditStore((state) => state.toolEntries)

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 900)
    return () => window.clearTimeout(timeout)
  }, [])

  const auditResult = useMemo(() => runAudit({ toolEntries, teamSize, useCase }), [toolEntries, teamSize, useCase])

  const shareUrl = auditId ? `${window.location.origin}/audit/${auditId}` : null

  useEffect(() => {
    if (loading || savedRef.current) return

    savedRef.current = true
    setSaving(true)

    const saveAudit = async () => {
      try {
        const response = await fetch("/api/audits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolEntries, teamSize, useCase }),
        })

        if (!response.ok) {
          throw new Error("Failed to save audit")
        }

        const data = (await response.json()) as { auditId: string }
        setAuditId(data.auditId)
      } catch (error) {
        console.error(error)
        savedRef.current = false
      } finally {
        setSaving(false)
      }
    }

    void saveAudit()
  }, [loading, toolEntries, teamSize, useCase])

  useEffect(() => {
    if (!auditId) return

    const timeout = window.setTimeout(() => {
      router.push(`/audit/${auditId}`)
    }, 2000)

    return () => window.clearTimeout(timeout)
  }, [auditId, router])

  const handleShare = async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareStatus("Link copied!")
      window.setTimeout(() => setShareStatus(null), 2400)
    } catch {
      setShareStatus("Unable to copy link")
    }
  }

  if (loading || saving) {
    return (
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-slate-950 px-4 text-slate-300">
        <p className="text-lg">{saving ? "Saving your audit..." : "Running your audit..."}</p>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <AuditResultsView
        auditResult={auditResult}
        showEmailCapture
        email={email}
        onEmailChange={setEmail}
        shareUrl={shareUrl}
        shareStatus={shareStatus}
        onShare={handleShare}
      />
    </main>
  )
}
