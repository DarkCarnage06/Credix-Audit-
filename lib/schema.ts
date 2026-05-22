import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const audits = pgTable("audits", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  teamSize: integer("team_size"),
  useCase: text("use_case"),
  toolEntries: text("tool_entries"),
  recommendations: text("recommendations"),
  totalMonthlySavings: integer("total_monthly_savings"),
  totalAnnualSavings: integer("total_annual_savings"),
  totalCurrentSpend: integer("total_current_spend"),
  isAlreadyOptimal: boolean("is_already_optimal"),
  isHighSavings: boolean("is_high_savings"),
})

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  auditId: text("audit_id").references(() => audits.id),
  email: text("email").notNull(),
  companyName: text("company_name"),
  role: text("role"),
  createdAt: timestamp("created_at").defaultNow(),
})
