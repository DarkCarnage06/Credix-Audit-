# Prompts

## AI Summary Prompt

Used in `src/lib/summary.ts` to generate the personalized audit summary.

### Final Prompt
### Why I wrote it this way

- Second person ("Your team") makes the summary feel personal and actionable
- Passing exact numbers forces the model to use real data instead of hallucinating
- "No fluff" instruction prevents the model from padding with generic AI advice
- Explicit instruction for the already-optimal case prevents the model from manufacturing fake savings

### What I tried that didn't work

- First version didn't pass the spending numbers explicitly — the model made up figures
- Tried asking for bullet points instead of a paragraph — felt too clinical for a summary card
- Tried a longer 200-word summary — too long for the UI card, 80-100 words is the sweet spot

### Fallback Template

When the Anthropic API is unavailable or the key is set to "dummy", the following template is used:

For high savings case:
"Your {teamSize}-person team is spending ${totalCurrentSpend}/month on AI tools, but you could cut that to ${totalProjectedSpend}/month — saving ${totalMonthlySavings}/month (${totalAnnualSavings}/year). {topRecommendationReason} These optimizations require no capability trade-offs for your {useCase} use case."

For already optimal case:
"Your {teamSize}-person team is running a well-optimized AI stack for {useCase} work. Your current spend of ${totalCurrentSpend}/month is appropriate for your team size and use case. No major changes recommended — keep an eye on new plan tiers as vendors update pricing."