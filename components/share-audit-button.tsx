"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type ShareAuditButtonProps = {
  shareUrl: string
}

export function ShareAuditButton({ shareUrl }: ShareAuditButtonProps) {
  const [shareStatus, setShareStatus] = useState<string | null>(null)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareStatus("Link copied!")
      window.setTimeout(() => setShareStatus(null), 2400)
    } catch {
      setShareStatus("Unable to copy link")
    }
  }

  return (
    <Card className="rounded-[1.75rem] bg-slate-900/95 p-6 shadow-[0_35px_90px_rgba(15,23,42,0.35)]">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Share your audit</h2>
        <p className="text-slate-400">Copy a link to share this recommendation summary with your team.</p>
        <p className="break-all rounded-2xl bg-slate-950/80 px-4 py-3 text-sm text-emerald-300 ring-1 ring-slate-800">
          Your audit: {shareUrl.replace(/^https?:\/\//, "")}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button className="w-full" onClick={handleShare} type="button">
            Share your audit
          </Button>
          {shareStatus ? <span className="text-slate-300">{shareStatus}</span> : null}
        </div>
      </div>
    </Card>
  )
}
