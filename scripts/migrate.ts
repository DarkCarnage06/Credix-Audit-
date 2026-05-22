import { runMigrations } from "../lib/migrations"

async function main() {
  await runMigrations()
  console.log("Migrations complete.")
}

main().catch((error) => {
  console.error("Migration failed:", error)
  process.exit(1)
})
