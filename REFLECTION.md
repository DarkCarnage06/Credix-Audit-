# Reflection

## 1. The Hardest Bug

The hardest bug was on the results page where the lead capture form and summary card would appear briefly then disappear. The symptom was clear but the cause wasn't obvious at first.

My first hypothesis was that a re-render was wiping state. I added console.logs to every setState call and confirmed that auditId, summary, and leadSubmitted were being set correctly — but then immediately reset to null. 

Second hypothesis: the useEffect calling POST /api/audits was firing twice due to React Strict Mode, which mounts components twice in development. Each call was racing — the second call would reset state while the first was still resolving.

What I tried: wrapping the useEffect in a condition checking if auditId already existed. Didn't work because auditId starts as null.

What worked: a useRef flag (hasSaved) set to true before the API call. useRef persists across renders without triggering re-renders, so the second Strict Mode mount sees hasSaved.current = true and exits early. The deeper fix was computing auditResult synchronously from the Zustand store instead of asynchronously — this eliminated the loading state that was causing the flash.

## 2. A Decision I Reversed

I initially built the results page to automatically redirect to `/audit/[id]` after saving — the idea was that the shareable URL would be the canonical results page. 

I reversed this after realizing it broke the lead capture flow. If the user is redirected to the public page, the lead form disappears because the public page intentionally has no PII collection. The user never gets to submit their email.

The fix was keeping the user on `/results` for the full experience (summary, recommendations, lead form) and making `/audit/[id]` the separate public shareable version. Two pages, two purposes.

## 3. What I Would Build in Week 2

First priority: a real OG image generator using Vercel OG. Right now the shareable URL has meta tags but no dynamic image — a real screenshot-style card showing "I could save $X/month" would dramatically increase click-through when shared on X or LinkedIn.

Second: PDF export of the full audit report. Several people I interviewed asked for this — they want to share it with their manager or co-founder as a document.

Third: benchmark mode — "your AI spend per developer is $X, companies your size average $Y." This requires collecting anonymized aggregate data from audits, which we're already storing. The data is there, just needs a stats layer on top.

## 4. How I Used AI Tools

I used Claude (via Cursor) as my primary coding assistant throughout the week.

**What I used it for:**
- Generating boilerplate (API route structure, Drizzle schema, Zustand store setup)
- Debugging TypeScript errors
- Writing the audit engine rules when I described the logic in plain English
- Drafting markdown documentation

**What I didn't trust it with:**
- The pricing numbers — I verified every single number against official vendor pages myself. AI confidently gives wrong prices.
- The audit logic reasoning — I wrote the "reason" strings myself to make sure they were defensible and included real dollar amounts
- The user interview notes — those came from real conversations

**One specific time the AI was wrong:**
Claude suggested using `useEffect` with `auditResult` as a dependency to trigger the API save. This caused an infinite loop because auditResult is recomputed on every render. I caught it because the network tab showed hundreds of POST requests firing. The fix was an empty dependency array with a useRef guard.

## 5. Self-Rating

| Dimension | Score | Reason |
|---|---|---|
| Discipline | 7/10 | Committed on 5 distinct days, DEVLOG written daily, but Day 3 and 4 were rushed |
| Code quality | 7/10 | Audit engine is clean and well-typed, results page state management got messy before the fix |
| Design sense | 8/10 | Dark theme looks professional and screenshot-worthy, mobile responsive throughout |
| Problem solving | 8/10 | Debugged the re-render bug methodically, fixed the Vercel deployment submodule issue |
| Entrepreneurial thinking | 7/10 | User interviews were real, GTM is specific, but ECONOMICS math is rough estimates |