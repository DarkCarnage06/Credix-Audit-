import { eq } from "drizzle-orm"

import type { AuditInput, AuditResult, Recommendation, ToolEntry } from "@/lib/audit-engine"
import { getDb } from "@/lib/db"
import { runMigrations } from "@/lib/migrations"
import { audits } from "@/lib/schema"

export type StoredAudit = AuditResult & {
  id: string
  teamSize: number
  useCase: AuditInput["useCase"]
  toolEntries: ToolEntry[]
  summary: string | null
  isAiGenerated: boolean
  createdAt: Date | null
}

function mapRow(row: typeof audits.$inferSelect): StoredAudit | null {
  if (!row.toolEntries || !row.recommendations) return null

  let toolEntries: ToolEntry[]
  let recommendations: Recommendation[]

  try {
    toolEntries = JSON.parse(row.toolEntries) as ToolEntry[]
    recommendations = JSON.parse(row.recommendations) as Recommendation[]
  } catch {
    return null
  }

  const totalProjectedSpend = recommendations.reduce(
    (sum, rec) => sum + rec.projectedMonthlySpend,
    0
  )

  return {
    id: row.id,
    teamSize: row.teamSize ?? 1,
    useCase: (row.useCase ?? "mixed") as AuditInput["useCase"],
    toolEntries,
    recommendations,
    totalMonthlySavings: row.totalMonthlySavings ?? 0,
    totalAnnualSavings: row.totalAnnualSavings ?? 0,
    totalCurrentSpend: row.totalCurrentSpend ?? 0,
    totalProjectedSpend,
    isAlreadyOptimal: row.isAlreadyOptimal ?? false,
    isHighSavings: row.isHighSavings ?? false,
    summary: row.summary,
    isAiGenerated: row.isAiGenerated ?? false,
    createdAt: row.createdAt,
  }
}

export async function getAuditById(id: string): Promise<StoredAudit | null> {
  await runMigrations()

  const rows = await getDb().select().from(audits).where(eq(audits.id, id)).limit(1)
  const row = rows[0]
  if (!row) return null

  return mapRow(row)
}

export async function saveAudit(
  id: string,
  input: AuditInput,
  result: AuditResult,
  summary: string,
  isAiGenerated: boolean
): Promise<void> {
  await runMigrations()

  await getDb().insert(audits).values({
    id,
    teamSize: input.teamSize,
    useCase: input.useCase,
    toolEntries: JSON.stringify(input.toolEntries),
    recommendations: JSON.stringify(result.recommendations),
    totalMonthlySavings: result.totalMonthlySavings,
    totalAnnualSavings: result.totalAnnualSavings,
    totalCurrentSpend: result.totalCurrentSpend,
    isAlreadyOptimal: result.isAlreadyOptimal,
    isHighSavings: result.isHighSavings,
    summary,
    isAiGenerated,
  })
}
