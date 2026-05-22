import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

import { AuditResultsView } from "@/components/audit-results-view"
import { Button } from "@/components/ui/button"
import { getAuditById } from "@/lib/audits"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const audit = await getAuditById(id)

  if (!audit) {
    return { title: "Audit not found" }
  }

  const title = `I could save $${audit.totalMonthlySavings.toLocaleString()}/month on AI tools`
  const description =
    "Free AI spend audit — find out if your startup is overpaying for Cursor, Claude, ChatGPT and more"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "/og-image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  }
}

export default async function PublicAuditPage({ params }: PageProps) {
  const { id } = await params
  const audit = await getAuditById(id)

  if (!audit) {
    notFound()
  }

  const auditResult = {
    recommendations: audit.recommendations,
    totalMonthlySavings: audit.totalMonthlySavings,
    totalAnnualSavings: audit.totalAnnualSavings,
    totalCurrentSpend: audit.totalCurrentSpend,
    totalProjectedSpend: audit.totalProjectedSpend,
    isAlreadyOptimal: audit.isAlreadyOptimal,
    isHighSavings: audit.isHighSavings,
  }

  const headersList = await headers()
  const host = headersList.get("host") ?? "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"
  const publicShareUrl = `${protocol}://${host}/audit/${id}`

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <AuditResultsView
        auditResult={auditResult}
        showEmailCapture={false}
        showRerun={false}
        publicShareUrl={publicShareUrl}
      />
      <div className="mx-auto mt-8 flex max-w-6xl justify-center">
        <Button asChild variant="outline">
          <Link href="/audit">Run your own audit</Link>
        </Button>
      </div>
    </main>
  )
}
