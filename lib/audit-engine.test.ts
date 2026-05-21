import { runAudit, type AuditInput } from "./audit-engine"

describe("audit engine", () => {
  test("Cursor Business with 2 seats coding should recommend downgrade to Pro", () => {
    const input: AuditInput = {
      teamSize: 2,
      useCase: "coding",
      toolEntries: [
        {
          id: "1",
          toolId: "cursor",
          planId: "business",
          seats: 2,
          monthlySpend: 80,
        },
      ],
    }

    const result = runAudit(input)
    const cursorRecommendation = result.recommendations.find((rec) => rec.toolId === "cursor")

    expect(cursorRecommendation).toBeDefined()
    expect(cursorRecommendation?.recommendedAction).toBe("downgrade")
    expect(cursorRecommendation?.recommendedPlanName).toBe("Pro")
    expect(cursorRecommendation?.monthlySavings).toBe(40)
  })

  test("GitHub Copilot Business with 2 seats should recommend Individual", () => {
    const input: AuditInput = {
      teamSize: 2,
      useCase: "coding",
      toolEntries: [
        {
          id: "2",
          toolId: "github-copilot",
          planId: "business",
          seats: 2,
          monthlySpend: 38,
        },
      ],
    }

    const result = runAudit(input)
    const recommendation = result.recommendations[0]

    expect(recommendation.recommendedAction).toBe("downgrade")
    expect(recommendation.recommendedPlanName).toBe("Individual")
    expect(recommendation.monthlySavings).toBe(18)
  })

  test("Claude Max with 3 seats should recommend Team with $210 savings", () => {
    const input: AuditInput = {
      teamSize: 3,
      useCase: "research",
      toolEntries: [
        {
          id: "3",
          toolId: "claude",
          planId: "max",
          seats: 3,
          monthlySpend: 300,
        },
      ],
    }

    const result = runAudit(input)
    const recommendation = result.recommendations[0]

    expect(recommendation.recommendedAction).toBe("downgrade")
    expect(recommendation.recommendedPlanName).toBe("Team")
    expect(recommendation.monthlySavings).toBe(210)
  })

  test("Cursor Pro plus GitHub Copilot Business should remove Copilot for overlap", () => {
    const input: AuditInput = {
      teamSize: 2,
      useCase: "coding",
      toolEntries: [
        {
          id: "4",
          toolId: "cursor",
          planId: "pro",
          seats: 2,
          monthlySpend: 40,
        },
        {
          id: "5",
          toolId: "github-copilot",
          planId: "business",
          seats: 2,
          monthlySpend: 38,
        },
      ],
    }

    const result = runAudit(input)
    const copilotRecommendation = result.recommendations.find((rec) => rec.toolId === "github-copilot")

    expect(copilotRecommendation).toBeDefined()
    expect(copilotRecommendation?.recommendedAction).toBe("remove")
    expect(copilotRecommendation?.monthlySavings).toBe(38)
  })

  test("ChatGPT Team with 2 seats should recommend Plus", () => {
    const input: AuditInput = {
      teamSize: 2,
      useCase: "mixed",
      toolEntries: [
        {
          id: "6",
          toolId: "chatgpt",
          planId: "team",
          seats: 2,
          monthlySpend: 60,
        },
      ],
    }

    const result = runAudit(input)
    const recommendation = result.recommendations[0]

    expect(recommendation.recommendedAction).toBe("downgrade")
    expect(recommendation.recommendedPlanName).toBe("Plus")
    expect(recommendation.monthlySavings).toBe(20)
  })

  test("Correct plans for team size should be already optimal when savings are low", () => {
    const input: AuditInput = {
      teamSize: 2,
      useCase: "coding",
      toolEntries: [
        {
          id: "7",
          toolId: "cursor",
          planId: "pro",
          seats: 2,
          monthlySpend: 40,
        },
        {
          id: "8",
          toolId: "chatgpt",
          planId: "plus",
          seats: 2,
          monthlySpend: 40,
        },
      ],
    }

    const result = runAudit(input)

    expect(result.isAlreadyOptimal).toBe(true)
    expect(result.totalMonthlySavings).toBeLessThan(100)
  })

  test("API spend over $500 should mark high savings if total savings exceed threshold", () => {
    const input: AuditInput = {
      teamSize: 9,
      useCase: "coding",
      toolEntries: [
        {
          id: "9",
          toolId: "openai-api",
          planId: "api-direct",
          seats: 0,
          monthlySpend: 600,
        },
        {
          id: "10",
          toolId: "cursor",
          planId: "enterprise",
          seats: 9,
          monthlySpend: 900,
        },
      ],
    }

    const result = runAudit(input)

    expect(result.isHighSavings).toBe(true)
    expect(result.totalMonthlySavings).toBeGreaterThan(500)
  })

  test("Windsurf Team on writing use case should recommend removal", () => {
    const input: AuditInput = {
      teamSize: 2,
      useCase: "writing",
      toolEntries: [
        {
          id: "11",
          toolId: "windsurf",
          planId: "team",
          seats: 2,
          monthlySpend: 70,
        },
      ],
    }

    const result = runAudit(input)
    const recommendation = result.recommendations[0]

    expect(recommendation.recommendedAction).toBe("remove")
    expect(recommendation.monthlySavings).toBe(70)
  })
})
