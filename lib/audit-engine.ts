import { AI_TOOLS } from "@/lib/tools"

export type ToolEntry = {
  id: string
  toolId: string
  planId: string
  monthlySpend: number
  seats: number
}

export type AuditInput = {
  toolEntries: ToolEntry[]
  teamSize: number
  useCase: "coding" | "writing" | "data" | "research" | "mixed"
}

export type Recommendation = {
  toolId: string
  toolName: string
  currentPlanName: string
  currentMonthlySpend: number
  recommendedAction: "downgrade" | "switch" | "keep" | "remove"
  recommendedPlanName?: string
  recommendedToolName?: string
  projectedMonthlySpend: number
  monthlySavings: number
  annualSavings: number
  reason: string
}

export type AuditResult = {
  recommendations: Recommendation[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  totalCurrentSpend: number
  totalProjectedSpend: number
  isAlreadyOptimal: boolean
  isHighSavings: boolean
}

const getTool = (toolId: string) => AI_TOOLS.find((tool) => tool.id === toolId)
const getPlan = (toolId: string, planId: string) => getTool(toolId)?.plans.find((plan) => plan.id === planId)

const formatMoney = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`

export function runAudit(input: AuditInput): AuditResult {
  const hasPaidCursor = input.toolEntries.some(
    (entry) => entry.toolId === "cursor" && (getPlan(entry.toolId, entry.planId)?.price ?? 0) > 0
  )
  const hasPaidCopilot = input.toolEntries.some(
    (entry) => entry.toolId === "github-copilot" && (getPlan(entry.toolId, entry.planId)?.price ?? 0) > 0
  )
  const hasPaidClaude = input.toolEntries.some(
    (entry) => entry.toolId === "claude" && (getPlan(entry.toolId, entry.planId)?.price ?? 0) > 0
  )
  const hasPaidChatGPT = input.toolEntries.some(
    (entry) => entry.toolId === "chatgpt" && (getPlan(entry.toolId, entry.planId)?.price ?? 0) > 0
  )
  const hasChatGPTPlus = input.toolEntries.some(
    (entry) => entry.toolId === "chatgpt" && entry.planId === "plus"
  )

  const toolRecommendations = input.toolEntries.map((entry) => {
    const tool = getTool(entry.toolId)
    const plan = getPlan(entry.toolId, entry.planId)
    const currentSpend = entry.monthlySpend
    let recommendedAction: Recommendation["recommendedAction"] = "keep"
    let recommendedPlanName: string | undefined
    let recommendedToolName: string | undefined
    let projectedMonthlySpend = currentSpend
    let reason = `Your current ${tool?.name ?? entry.toolId} ${plan?.name ?? entry.planId} plan looks reasonable.`

    const overrideKeep = (message: string) => {
      recommendedAction = "keep"
      projectedMonthlySpend = currentSpend
      reason = message
    }

    const isPaidPlan = (plan?.price ?? 0) > 0

    const setRecommendation = (
      action: Recommendation["recommendedAction"],
      projectedPrice: number,
      planName?: string,
      toolName?: string,
      text?: string
    ) => {
      recommendedAction = action
      projectedMonthlySpend = projectedPrice
      recommendedPlanName = planName
      recommendedToolName = toolName
      reason =
        text ||
        `${tool?.name ?? entry.toolId} ${plan?.name ?? entry.planId} is not the most efficient option for this team.`
    }

    switch (entry.toolId) {
      case "cursor": {
        if (plan?.id === "business" && entry.seats <= 3) {
          const projected = 20 * entry.seats
          setRecommendation(
            "downgrade",
            projected,
            "Pro",
            undefined,
            `Cursor Business is $40/seat. Cursor Pro is $20/seat, saving ${formatMoney(currentSpend - projected)} per month for ${entry.seats} seats.`
          )
        } else if (plan?.id === "enterprise" && entry.seats < 10) {
          const projected = 40 * entry.seats
          setRecommendation(
            "downgrade",
            projected,
            "Business",
            undefined,
            `Cursor Enterprise is $100/seat. Cursor Business is $40/seat, saving ${formatMoney(currentSpend - projected)} per month for ${entry.seats} seats.`
          )
        } else if (plan?.id === "pro" && ["writing", "data", "research"].includes(input.useCase)) {
          const projected = 20 * entry.seats
          setRecommendation(
            "switch",
            projected,
            "Pro",
            "Claude",
            `Cursor Pro is priced like Claude Pro at $20/seat, but Claude is a stronger fit for ${input.useCase} workflows and can reduce overlap.`
          )
        }
        break
      }

      case "github-copilot": {
        if (plan?.id === "business" && entry.seats <= 2) {
          const projected = 10 * entry.seats
          setRecommendation(
            "downgrade",
            projected,
            "Individual",
            undefined,
            `GitHub Copilot Business is $19/seat. Individual is $10/seat, saving ${formatMoney(currentSpend - projected)} per month for ${entry.seats} seats.`
          )
        } else if (plan?.id === "enterprise" && entry.seats < 5) {
          const projected = 19 * entry.seats
          setRecommendation(
            "downgrade",
            projected,
            "Business",
            undefined,
            `GitHub Copilot Enterprise is $39/seat. Business is $19/seat, saving ${formatMoney(currentSpend - projected)} per month for ${entry.seats} seats.`
          )
        }

        if (input.useCase === "coding" && hasPaidCursor && isPaidPlan) {
          setRecommendation(
            "remove",
            0,
            undefined,
            undefined,
            `Cursor and GitHub Copilot overlap for coding teams. Removing Copilot eliminates duplication and saves ${formatMoney(currentSpend)} per month.`
          )
        }
        break
      }

      case "claude": {
        if (plan?.id === "max" && entry.seats > 1) {
          const projected = 30 * entry.seats
          setRecommendation(
            "downgrade",
            projected,
            "Team",
            undefined,
            `Claude Max is $100/seat. Claude Team is $30/seat, saving ${formatMoney(currentSpend - projected)} per month across ${entry.seats} seats.`
          )
        } else if (plan?.id === "team" && entry.seats <= 2) {
          const projected = 20 * entry.seats
          setRecommendation(
            "downgrade",
            projected,
            "Pro",
            undefined,
            `Claude Team is $30/seat. Claude Pro is $20/seat, saving ${formatMoney(currentSpend - projected)} per month for ${entry.seats} seats.`
          )
        } else if (plan?.id === "enterprise" && entry.seats < 5) {
          const projected = 30 * entry.seats
          setRecommendation(
            "downgrade",
            projected,
            "Team",
            undefined,
            `Claude Enterprise is $60/seat. Claude Team is $30/seat, saving ${formatMoney(currentSpend - projected)} per month for ${entry.seats} seats.`
          )
        }
        break
      }

      case "chatgpt": {
        if (plan?.id === "team" && entry.seats <= 2) {
          const projected = 20 * entry.seats
          setRecommendation(
            "downgrade",
            projected,
            "Plus",
            undefined,
            `ChatGPT Team is $30/seat. ChatGPT Plus is $20/seat, saving ${formatMoney(currentSpend - projected)} per month for ${entry.seats} seats.`
          )
        } else if (plan?.id === "enterprise" && entry.seats < 5) {
          const projected = 30 * entry.seats
          setRecommendation(
            "downgrade",
            projected,
            "Team",
            undefined,
            `ChatGPT Enterprise is $60/seat. ChatGPT Team is $30/seat, saving ${formatMoney(currentSpend - projected)} per month for ${entry.seats} seats.`
          )
        }
        break
      }

      case "windsurf": {
        if (input.useCase !== "coding") {
          setRecommendation(
            "remove",
            0,
            undefined,
            undefined,
            `Windsurf is not the strongest fit for ${input.useCase} workflows. Removing it saves ${formatMoney(currentSpend)} per month.`
          )
        } else if (plan?.id === "team" && entry.seats <= 2) {
          const projected = 15 * entry.seats
          setRecommendation(
            "downgrade",
            projected,
            "Pro",
            undefined,
            `Windsurf Team is $35/seat. Winding down to Pro at $15/seat saves ${formatMoney(currentSpend - projected)} per month for ${entry.seats} seats.`
          )
        }
        break
      }

      case "gemini": {
        if (plan?.id === "ultra" && input.useCase === "coding") {
          const projected = 20 * entry.seats
          setRecommendation(
            "switch",
            projected,
            "Pro",
            "Cursor",
            `Gemini Ultra is $30/seat. Cursor Pro is $20/seat and is a stronger fit for coding workflows, saving ${formatMoney(currentSpend - projected)} per month.`
          )
        } else if (plan?.id === "pro" && hasChatGPTPlus) {
          setRecommendation(
            "remove",
            0,
            undefined,
            undefined,
            `Gemini Pro overlaps with ChatGPT Plus for general AI tasks. Removing Gemini saves ${formatMoney(currentSpend)} per month.`
          )
        }
        break
      }

      case "anthropic-api":
      case "openai-api": {
        if (currentSpend > 500) {
          setRecommendation(
            "keep",
            currentSpend,
            undefined,
            undefined,
            `Your API Direct spend is ${formatMoney(currentSpend)} / month. Credex discounted credits could reduce this spend by 20-40%.`
          )
        } else if (currentSpend > 200) {
          setRecommendation(
            "keep",
            currentSpend,
            undefined,
            undefined,
            `Your API Direct spend is ${formatMoney(currentSpend)} / month. Consider a vendor Team plan if available to lower ongoing usage costs.`
          )
        }
        break
      }

      default: {
        break
      }
    }

    if (entry.toolId === "chatgpt" && hasPaidClaude && input.useCase !== "mixed" && isPaidPlan) {
      setRecommendation(
        "remove",
        0,
        undefined,
        undefined,
        `Paid ChatGPT overlaps with Claude for ${input.useCase} use cases. Removing ChatGPT saves ${formatMoney(currentSpend)} per month.`
      )
    }

    if (entry.toolId === "github-copilot" && hasPaidCursor && isPaidPlan) {
      const overlapReason = `Cursor provides paid coding assistance overlapping with GitHub Copilot. Removing Copilot saves ${formatMoney(currentSpend)} per month.`
      if (input.useCase === "coding" || input.useCase !== "mixed") {
        setRecommendation("remove", 0, undefined, undefined, overlapReason)
      }
    }

    if (recommendedAction === "keep" && projectedMonthlySpend === currentSpend) {
      reason = `Your current ${tool?.name ?? entry.toolId} ${plan?.name ?? entry.planId} plan is already the best fit for this team.`
    }

    const monthlySavings = Math.max(0, currentSpend - projectedMonthlySpend)
    const annualSavings = monthlySavings * 12

    return {
      toolId: entry.toolId,
      toolName: tool?.name ?? entry.toolId,
      currentPlanName: plan?.name ?? entry.planId,
      currentMonthlySpend: currentSpend,
      recommendedAction,
      recommendedPlanName,
      recommendedToolName,
      projectedMonthlySpend,
      monthlySavings,
      annualSavings,
      reason,
    }
  })

  const totalCurrentSpend = toolRecommendations.reduce((sum, rec) => sum + rec.currentMonthlySpend, 0)
  const totalProjectedSpend = toolRecommendations.reduce((sum, rec) => sum + rec.projectedMonthlySpend, 0)
  const totalMonthlySavings = totalCurrentSpend - totalProjectedSpend
  const totalAnnualSavings = totalMonthlySavings * 12

  return {
    recommendations: toolRecommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    totalCurrentSpend,
    totalProjectedSpend,
    isAlreadyOptimal: totalMonthlySavings < 100,
    isHighSavings: totalMonthlySavings > 500,
  }
}
