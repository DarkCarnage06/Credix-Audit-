import { Resend } from "resend"

type AuditEmailParams = {
  to: string
  monthlySavings: number
  annualSavings: number
  auditUrl: string
}

function buildAuditEmailHtml({ monthlySavings, annualSavings, auditUrl }: Omit<AuditEmailParams, "to">) {
  return `<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f172a; color: #f1f5f9;">
  <h1 style="color: #34d399;">Your AI Spend Audit</h1>
  <p>Thanks for using the AI Spend Audit tool.</p>
  <h2 style="color: #34d399;">You could save $${monthlySavings.toLocaleString()}/month</h2>
  <p>That's $${annualSavings.toLocaleString()}/year in potential savings on your AI tools.</p>
  <p>View your full audit anytime at: <a href="${auditUrl}" style="color: #34d399;">${auditUrl}</a></p>
  <hr style="border-color: #1e293b;" />
  <p style="color: #64748b; font-size: 14px;">If your potential savings exceed $500/month, a Credex advisor will reach out within 2 business days about discounted AI credits.</p>
  <p><a href="https://credex.rocks" style="color: #34d399;">Learn more about Credex →</a></p>
</body>
</html>`
}

export async function sendAuditResultsEmail(params: AuditEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set — skipping audit email")
    return
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: "AI Spend Audit <onboarding@resend.dev>",
    to: params.to,
    subject: "Your AI Spend Audit Results",
    html: buildAuditEmailHtml(params),
  })

  if (error) {
    throw new Error(error.message)
  }
}

export function getAuditPublicUrl(auditId: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  if (configured) {
    return `${configured.replace(/\/$/, "")}/audit/${auditId}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/audit/${auditId}`
  }
  return `http://localhost:3000/audit/${auditId}`
}
