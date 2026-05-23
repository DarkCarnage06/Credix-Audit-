import { nanoid } from "nanoid"
import { NextResponse } from "next/server"

import { runAudit, type AuditInput } from "@/lib/audit-engine"
import { saveAudit } from "@/lib/audits"
import { generateAuditSummary } from "@/lib/summary"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AuditInput>

    if (!body.toolEntries || !Array.isArray(body.toolEntries)) {
      return NextResponse.json({ error: "toolEntries is required" }, { status: 400 })
    }

    if (typeof body.teamSize !== "number" || body.teamSize < 1) {
      return NextResponse.json({ error: "teamSize is required" }, { status: 400 })
    }

    if (!body.useCase) {
      return NextResponse.json({ error: "useCase is required" }, { status: 400 })
    }

    const input: AuditInput = {
      toolEntries: body.toolEntries,
      teamSize: body.teamSize,
      useCase: body.useCase,
    }

    const auditResult = runAudit(input)
    const { summary, isAiGenerated } = await generateAuditSummary(
      auditResult,
      input.useCase,
      input.teamSize
    )
    const auditId = nanoid(10)

    await saveAudit(auditId, input, auditResult, summary, isAiGenerated)

    return NextResponse.json({
      auditId,
      summary,
      isAiGenerated,
      ...auditResult,
    })
  } catch (error) {
    console.error("POST /api/audits failed:", error)
    return NextResponse.json({ error: "Failed to save audit" }, { status: 500 })
  }
}
