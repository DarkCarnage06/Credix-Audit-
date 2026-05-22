import { NextResponse } from "next/server"

import { getAuditById } from "@/lib/audits"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const audit = await getAuditById(id)

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 })
    }

    const { toolEntries, recommendations, ...rest } = audit

    return NextResponse.json({
      ...rest,
      toolEntries,
      recommendations,
    })
  } catch (error) {
    console.error("GET /api/audits/[id] failed:", error)
    return NextResponse.json({ error: "Failed to fetch audit" }, { status: 500 })
  }
}
