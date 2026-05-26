# AI Spend Audit

Find out if your startup is overpaying for AI tools. Free 2-minute audit for teams using Cursor, Claude, ChatGPT, GitHub Copilot, Gemini, Windsurf and more.

**Live tool:** https://credix-audit-ti1g.vercel.app/

## What it does

A free web app that audits your AI tool stack and tells you exactly where you're overspending — with specific dollar savings, defensible reasoning, and a shareable report URL.

## Screenshots
## Demo

[▶ Watch 30-second demo](https://www.loom.com/share/edfde6bfead246339de698b264dd78cc)

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your DATABASE_URL, RESEND_API_KEY, ANTHROPIC_API_KEY

# Run locally
npm run dev

# Run tests
npm test
```

## Deploy

Deployed on Vercel. Connect your GitHub repo and add the environment variables listed above.

## Decisions

1. **Audit engine is pure TypeScript, no AI** — The rules are deterministic and need to be defensible to a finance person. Using an LLM for the audit math would introduce hallucinated savings numbers. Hardcoded rules are correct here; AI is only used for the summary paragraph where creativity is appropriate.

2. **Zustand over Redux** — The form state is simple enough that Redux would be overkill. Zustand's persist middleware handles localStorage sync in 3 lines of code.

3. **Neon Postgres over Firebase** — Relational data (audits + leads with foreign keys) fits SQL better than a document store. Neon's serverless driver works perfectly with Vercel's edge runtime.

4. **nanoid over UUID for audit IDs** — Shorter URLs are more shareable. `pDNXYb6kP1` looks better in a tweet than `550e8400-e29b-41d4-a716-446655440000`.

5. **Email captured after value, never before** — Capturing email before showing results would kill conversion. Users need to see their savings number first — that's the moment they're willing to give their email.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (form state)
- Neon Postgres + Drizzle ORM
- Anthropic API (summary generation)
- Resend (transactional email)
- Vercel (deployment)