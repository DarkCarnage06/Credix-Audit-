import Anthropic from "@anthropic-ai/sdk"

import type { AuditResult } from "@/lib/audit-engine"

export async function generateAuditSummary(
  auditResult: AuditResult,
  useCase: string,
  teamSize: number
): Promise<{ summary: string; isAiGenerated: boolean }> {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "dummy") {
    return {
      summary: generateFallbackSummary(auditResult, useCase, teamSize),
      isAiGenerated: false,
    }
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: `You are an AI spend analyst. Write a personalized 80-100 word audit summary for a startup.
          
          Team size: ${teamSize}
          Primary use case: ${useCase}
          Current monthly AI spend: $${auditResult.totalCurrentSpend}
          Potential monthly savings: $${auditResult.totalMonthlySavings}
          Annual savings: $${auditResult.totalAnnualSavings}
          Already optimal: ${auditResult.isAlreadyOptimal}
          Number of recommendations: ${auditResult.recommendations.length}
          Top recommendation: ${auditResult.recommendations[0]?.reason || "Stack is optimized"}
          
          Write in second person ("Your team...", "You're..."). Be specific with numbers. Be direct and honest. No fluff. If already optimal, acknowledge that genuinely.`,
        },
      ],
    })

    const summary = message.content[0]?.type === "text" ? message.content[0].text : ""
    return { summary, isAiGenerated: true }
  } catch (error) {
    console.error("Anthropic API error, using fallback:", error)
    return {
      summary: generateFallbackSummary(auditResult, useCase, teamSize),
      isAiGenerated: false,
    }
  }
}

function generateFallbackSummary(
  auditResult: AuditResult,
  useCase: string,
  teamSize: number
): string {
  if (auditResult.isAlreadyOptimal) {
    return `Your ${teamSize}-person team is running a well-optimized AI stack for ${useCase} work. Your current spend of $${auditResult.totalCurrentSpend}/month is appropriate for your team size and use case. No major changes recommended — keep an eye on new plan tiers as vendors update pricing.`
  }

  const topRec = auditResult.recommendations.find((r) => r.recommendedAction !== "keep")
  return `Your ${teamSize}-person team is spending $${auditResult.totalCurrentSpend}/month on AI tools, but you could cut that to $${auditResult.totalProjectedSpend}/month — saving $${auditResult.totalMonthlySavings}/month ($${auditResult.totalAnnualSavings}/year). ${topRec ? `The biggest win: ${topRec.reason}` : ""} These optimizations require no capability trade-offs for your ${useCase} use case.`
}
