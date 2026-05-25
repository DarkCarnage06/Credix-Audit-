# Tests

## Running the Tests

```bash
npm test
```

All tests use Jest with ts-jest. Test files match `**/*.test.ts`.

## Test Files

### src/lib/audit-engine.test.ts

**How to run:** `npm test` or `npx jest audit-engine`

| Test | What it covers |
|---|---|
| Cursor Business 2 seats → downgrade to Pro | Verifies seat-count based downgrade rule, checks monthlySavings = $40 |
| GitHub Copilot Business 2 seats → Individual | Verifies small team downgrade, checks savings = $18/month |
| Claude Max 3 seats → Team | Verifies Max→Team rule, checks savings = $210/month |
| Cursor Pro + Copilot Business → remove Copilot | Verifies overlap detection across two tools |
| ChatGPT Team 2 seats → Plus | Verifies Team→Plus downgrade for small teams |
| All optimal plans → isAlreadyOptimal | Verifies that savings < $100 sets isAlreadyOptimal = true |
| API spend > $500 → isHighSavings | Verifies high spend flag triggers correctly |
| Windsurf Team + useCase writing → remove | Verifies use-case based removal rule |

**Total: 8 tests, all passing**

## Test Philosophy

The audit engine is tested with pure unit tests because it is a pure function — same input always produces same output, no database or API calls involved. This makes the tests fast, reliable, and easy to debug.

React components are not tested with automated tests in this submission — the audit engine is where correctness matters most, and that is fully covered.