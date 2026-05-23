import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

import { getAuditById } from "@/lib/audits"
import { getDb } from "@/lib/db"
import { getAuditPublicUrl, sendAuditResultsEmail } from "@/lib/email"
import { leads } from "@/lib/schema"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type LeadBody = {
  auditId?: string
  email?: string
  companyName?: string
  role?: string
  website?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadBody

    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({ success: true })
    }

    const auditId = body.auditId?.trim()
    const email = body.email?.trim().toLowerCase()

    if (!auditId) {
      return NextResponse.json({ error: "auditId is required" }, { status: 400 })
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 })
    }

    const audit = await getAuditById(auditId)
    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 })
    }

    const existing = await getDb()
      .select({ id: leads.id })
      .from(leads)
      .where(and(eq(leads.auditId, auditId), eq(leads.email, email)))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "This email has already been submitted for this audit" },
        { status: 409 }
      )
    }

    await getDb().insert(leads).values({
      auditId,
      email,
      companyName: body.companyName?.trim() || null,
      role: body.role?.trim() || null,
    })

    try {
      await sendAuditResultsEmail({
        to: email,
        monthlySavings: audit.totalMonthlySavings,
        annualSavings: audit.totalAnnualSavings,
        auditUrl: getAuditPublicUrl(auditId),
      })
    } catch (emailError) {
      console.error("Failed to send audit email:", emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST /api/leads failed:", error)
    return NextResponse.json({ error: "Failed to submit lead" }, { status: 500 })
  }
}
