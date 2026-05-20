"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuditStore } from "@/lib/store"
import { AI_TOOLS } from "@/lib/tools"

export default function Page() {
  const [loading, setLoading] = useState(true)
  const toolEntries = useAuditStore((state) => state.toolEntries)

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 900)
    return () => window.clearTimeout(timeout)
  }, [])

  const getToolName = (toolId: string) => AI_TOOLS.find((tool) => tool.id === toolId)?.name ?? toolId
  const getPlanName = (toolId: string, planId: string) =>
    AI_TOOLS.find((tool) => tool.id === toolId)?.plans.find((plan) => plan.id === planId)?.name ?? planId

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.35)] text-center">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
            </div>
            <p className="text-sm uppercase tracking-[0.32em] text-primary">Calculation in progress</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">Calculating your audit...</h1>
            <p className="max-w-2xl text-slate-400">
              We are reviewing your subscriptions and spend data. Your results will be ready in a moment.
            </p>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8 shadow-[0_35px_90px_rgba(15,23,42,0.25)]">
            <h2 className="text-xl font-semibold">What you entered</h2>
            <div className="mt-6 grid gap-4">
              {toolEntries.length === 0 ? (
                <p className="text-slate-400">No tools were added yet.</p>
              ) : (
                toolEntries.map((entry) => (
                  <Card key={entry.id} className="p-4">
                    <div className="grid gap-2">
                      <p className="text-sm text-slate-400">{getToolName(entry.toolId)}</p>
                      <p className="text-lg font-semibold text-slate-100">{getPlanName(entry.toolId, entry.planId)}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                        <span>{entry.seats} seat{entry.seats === 1 ? "" : "s"}</span>
                        <span>${entry.monthlySpend.toLocaleString()} / month</span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8 shadow-[0_35px_90px_rgba(15,23,42,0.25)]">
            <h2 className="text-2xl font-semibold">Audit coming soon</h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              This placeholder confirms your tools are saved and the audit engine will be built next. The final report will compare your spend against market benchmarks and identify savings opportunities.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/audit">
                <Button variant="outline">Edit audit details</Button>
              </Link>
              <Button onClick={() => window.location.reload()}>{loading ? "Refreshing..." : "Refresh status"}</Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
