# Metrics

## North Star Metric

**Audits completed per week**

Why: An audit completed means a user got real value from the tool. It's the moment the product works. Everything else — email captures, consultations, revenue — flows from this. DAU is wrong for a tool people use once a quarter. Signups are wrong because they don't mean value was delivered. Completed audits do.

## 3 Input Metrics That Drive the North Star

1. **Homepage → Audit form conversion rate**
   If people land but don't start the form, the hero copy or CTA is broken. Target: >40%.

2. **Form completion rate**
   If people start the form but don't finish, the form is too long or confusing. Target: >60%.

3. **Audit form → Results page conversion rate**
   If people finish the form but don't click "Get My Audit", there's a trust or UX issue. Target: >80%.

## What to Instrument First

1. **Audit completed event** — fire when POST /api/audits succeeds
2. **Email captured event** — fire when POST /api/leads succeeds
3. **Consultation CTA clicked** — fire when "Book a Free Consultation" is clicked
4. **Share button clicked** — fire when shareable URL is copied
5. **Page load time** — Vercel Analytics already tracks this

Tools: Vercel Analytics for page-level data, a simple events table in Postgres for custom events.

## What Number Triggers a Pivot Decision

If after 500 completed audits:
- Email capture rate is below 10% → the value proposition isn't landing, redesign results page
- Consultation booking rate is below 3% → high-savings users aren't converting, redesign Credex CTA
- Audit completion rate is below 20% → form is too long or confusing, simplify inputs

If after 30 days the tool drives zero consultation bookings despite 200+ audits → the audit logic is not surfacing real enough savings, revisit pricing rules.