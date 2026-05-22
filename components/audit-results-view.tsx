"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ShareAuditButton } from "@/components/share-audit-button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { AuditResult } from "@/lib/audit-engine"

const borderColor = (action: string) => {
  switch (action) {
    case "remove":
    case "switch":
      return "border-rose-500/80"
    case "downgrade":
      return "border-amber-400/80"
    default:
      return "border-emerald-500/70"
  }
}

type AuditResultsViewProps = {
  auditResult: AuditResult
  showEmailCapture?: boolean
  email?: string
  onEmailChange?: (value: string) => void
  shareUrl?: string | null
  shareStatus?: string | null
  onShare?: () => void
  publicShareUrl?: string
  showRerun?: boolean
}

export function AuditResultsView({
  auditResult,
  showEmailCapture = false,
  email = "",
  onEmailChange,
  shareUrl,
  shareStatus,
  onShare,
  publicShareUrl,
  showRerun = true,
}: AuditResultsViewProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <section className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-6 text-center">
          {auditResult.isAlreadyOptimal ? (
            <>
              <p className="text-sm uppercase tracking-[0.32em] text-emerald-300">Optimized AI spend</p>
              <h1 className="text-4xl font-semibold text-slate-100 sm:text-5xl">You&apos;re spending well 👍</h1>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Your AI stack is already optimized for your current team and use cases.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm uppercase tracking-[0.32em] text-emerald-300">Spend optimization</p>
              <h1 className="text-5xl font-semibold text-emerald-300 sm:text-6xl">
                You could save {`$${auditResult.totalMonthlySavings.toLocaleString()}`}/month
              </h1>
              <p className="text-2xl text-slate-200">{`$${auditResult.totalAnnualSavings.toLocaleString()}`}/year</p>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                You currently spend {`$${auditResult.totalCurrentSpend.toLocaleString()}/month`} across your AI
                stack, projected to {`$${auditResult.totalProjectedSpend.toLocaleString()}/month`} after
                recommendations.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          {auditResult.recommendations.map((recommendation, index) => (
            <Card
              key={`${recommendation.toolId}-${index}`}
              className={`rounded-[1.75rem] border ${borderColor(recommendation.recommendedAction)} bg-slate-900/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.3)]`}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.26em] text-slate-500">{recommendation.toolName}</p>
                  <h2 className="text-2xl font-semibold text-slate-100">{recommendation.currentPlanName}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span>{`$${recommendation.currentMonthlySpend.toLocaleString()}/month`}</span>
                    <span className="text-slate-600">•</span>
                    <span>
                      {recommendation.recommendedAction === "remove"
                        ? "Remove tool"
                        : recommendation.recommendedPlanName
                          ? `${recommendation.recommendedAction === "switch" ? "Switch to" : recommendation.recommendedAction === "downgrade" ? "Move to" : "Keep"} ${recommendation.recommendedPlanName}`
                          : recommendation.recommendedAction}
                    </span>
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-950/80 px-5 py-4 text-right ring-1 ring-slate-800">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Monthly savings</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-300">
                    {`$${recommendation.monthlySavings.toLocaleString()}`}
                  </p>
                  <p className="text-sm text-slate-400">{`$${recommendation.annualSavings.toLocaleString()}/year`}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-300">{recommendation.reason}</p>
            </Card>
          ))}
        </div>

        <aside className="space-y-6">
          {auditResult.isHighSavings && (
            <Card className="rounded-[1.75rem] bg-slate-900/95 p-6 shadow-[0_35px_90px_rgba(15,23,42,0.35)]">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.26em] text-emerald-300">Credex advantage</p>
                <h2 className="text-3xl font-semibold text-white">Credex can save you even more</h2>
                <p className="text-slate-400">
                  Get the same AI tools at 20-40% off through Credex discounted credits.
                </p>
                <Button asChild className="w-full">
                  <a href="https://credex.rocks" target="_blank" rel="noreferrer">
                    Book a Free Consultation
                  </a>
                </Button>
              </div>
            </Card>
          )}

          {showEmailCapture && auditResult.isAlreadyOptimal && onEmailChange && (
            <Card className="rounded-[1.75rem] bg-slate-900/95 p-6 shadow-[0_35px_90px_rgba(15,23,42,0.35)]">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.26em] text-slate-300">Stay ahead</p>
                <h2 className="text-2xl font-semibold text-white">
                  Notify me when new optimizations apply to your stack
                </h2>
                <div className="grid gap-4">
                  <Input
                    value={email}
                    onChange={(event) => onEmailChange(event.target.value)}
                    placeholder="Your email"
                    className="bg-slate-950 text-slate-100 placeholder:text-slate-500"
                  />
                  <Button className="w-full" type="button">
                    Subscribe
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {publicShareUrl ? <ShareAuditButton shareUrl={publicShareUrl} /> : null}

          {onShare && (
            <Card className="rounded-[1.75rem] bg-slate-900/95 p-6 shadow-[0_35px_90px_rgba(15,23,42,0.35)]">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Share your audit</h2>
                <p className="text-slate-400">
                  Copy a link to share this recommendation summary with your team.
                </p>
                {shareUrl ? (
                  <p className="break-all rounded-2xl bg-slate-950/80 px-4 py-3 text-sm text-emerald-300 ring-1 ring-slate-800">
                    Your audit: {shareUrl.replace(/^https?:\/\//, "")}
                  </p>
                ) : null}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button className="w-full" onClick={onShare} type="button">
                    Share your audit
                  </Button>
                  {shareStatus ? <span className="text-slate-300">{shareStatus}</span> : null}
                </div>
              </div>
            </Card>
          )}

          {showRerun && (
            <Card className="rounded-[1.75rem] bg-slate-950/90 p-6 shadow-[0_35px_90px_rgba(15,23,42,0.25)]">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-100">Re-run audit</h2>
                <p className="text-slate-400">
                  Edit your inputs and rerun the AI spend review to capture the latest pricing and team changes.
                </p>
                <Link href="/audit">
                  <Button className="w-full">Re-run audit</Button>
                </Link>
              </div>
            </Card>
          )}
        </aside>
      </section>
    </div>
  )
}
