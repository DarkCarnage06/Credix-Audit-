import { Card } from "@/components/ui/card"

type AuditSummaryCardProps = {
  summary: string
  isAiGenerated: boolean
}

export function AuditSummaryCard({ summary, isAiGenerated }: AuditSummaryCardProps) {
  return (
    <Card className="mx-auto max-w-6xl rounded-[1.75rem] border border-slate-800/80 bg-slate-900/90 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.3)] sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-xl font-semibold text-slate-100 sm:text-2xl">Your Personalized Summary</h2>
        <span
          className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
            isAiGenerated
              ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
              : "bg-slate-800 text-slate-400 ring-1 ring-slate-700"
          }`}
        >
          {isAiGenerated ? "AI generated" : "Template summary"}
        </span>
      </div>
      <p className="mt-4 text-base leading-7 text-slate-300">{summary}</p>
    </Card>
  )
}
