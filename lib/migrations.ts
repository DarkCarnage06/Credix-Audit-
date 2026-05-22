import { neon } from "@neondatabase/serverless"

let migrated = false

export async function runMigrations() {
  if (migrated) return

  const sql = neon(process.env.DATABASE_URL!)

  await sql`
    CREATE TABLE IF NOT EXISTS audits (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT NOW(),
      team_size INTEGER,
      use_case TEXT,
      tool_entries TEXT,
      recommendations TEXT,
      total_monthly_savings INTEGER,
      total_annual_savings INTEGER,
      total_current_spend INTEGER,
      is_already_optimal BOOLEAN,
      is_high_savings BOOLEAN
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      audit_id TEXT REFERENCES audits(id),
      email TEXT NOT NULL,
      company_name TEXT,
      role TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  migrated = true
}
