# Architecture

## System Diagram

```mermaid
graph TD
    A[User] -->|Fills spend form| B[/audit - Next.js Page]
    B -->|Saves to Zustand store| C[LocalStorage]
    B -->|Navigate| D[/results - Next.js Page]
    D -->|runAudit - pure function| E[Audit Engine]
    E -->|AuditResult| D
    D -->|POST /api/audits| F[API Route]
    F -->|generateAuditSummary| G[Anthropic API]
    G -->|fallback| H[Template Summary]
    F -->|INSERT| I[(Neon Postgres)]
    F -->|returns auditId| D
    D -->|Shows results + summary| A
    A -->|Submits email| J[POST /api/leads]
    J -->|INSERT| I
    J -->|Send email| K[Resend API]
    A -->|Shares URL| L[/audit/id - Public Page]
    L -->|SELECT| I
    L -->|Shows audit - no PII| A
```

## Data Flow

1. User fills the spend input form at `/audit` — tool, plan, seats, monthly spend
2. Form state is saved to Zustand store with localStorage persistence
3. On submit, user is navigated to `/results`
4. `/results` computes the audit synchronously using `runAudit()` — pure TypeScript, no API call
5. In parallel, `/results` calls `POST /api/audits` which saves the audit to Neon Postgres and generates an AI summary via Anthropic API (falls back to template if API unavailable)
6. The API returns an `auditId` — a 10-char nanoid
7. Results page shows savings breakdown, summary card, and lead capture form
8. User submits email via `POST /api/leads` — stored in DB, confirmation email sent via Resend
9. Shareable URL `/audit/[id]` fetches audit from DB and renders it without PII

## Why I Chose This Stack

- **Next.js 14 App Router** — server components for the public shareable page (good for OG tags and SEO), client components for interactive form and results
- **TypeScript** — audit engine logic is complex enough that types prevent entire classes of bugs
- **Zustand with persist** — simpler than Redux for this use case, localStorage persistence is built-in
- **Neon Postgres** — serverless Postgres that works natively with Vercel, no connection pooling issues
- **Drizzle ORM** — lightweight, TypeScript-first, no magic
- **Tailwind + shadcn/ui** — fast to build with, consistent dark theme, accessible components out of the box
- **Resend** — simplest transactional email API, generous free tier
- **nanoid** — shorter and more URL-friendly than UUID for shareable links

## What I Would Change for 10k Audits/Day

- **Add a Redis cache** — audit results for the same tool/plan combination are deterministic, cache them
- **Move audit saving to a background job** — currently blocks the results page render
- **Add a CDN for the OG images** — dynamic OG image generation with Vercel OG would improve sharing
- **Rate limiting middleware** — currently only have honeypot on leads, need proper rate limiting on all API routes
- **Database indexes** — add index on `leads.email` and `leads.audit_id` for faster lookups
- **Separate the audit engine into a microservice** — would allow independent scaling
- **Add monitoring** — Sentry for errors, Vercel Analytics for performance