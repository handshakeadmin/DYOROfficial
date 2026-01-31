/**
 * Run Supabase Migrations via JS Client
 *
 * This script reads SQL migration files and executes them against the database.
 * Usage: npx tsx scripts/run-migrations.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(filename: string): Promise<boolean> {
  const filepath = path.join(process.cwd(), "supabase", "migrations", filename);

  if (!fs.existsSync(filepath)) {
    console.error(`  ❌ File not found: ${filepath}`);
    return false;
  }

  const sql = fs.readFileSync(filepath, "utf-8");

  // Split by semicolons but be careful about function bodies
  // For simplicity, we'll execute the whole file as one statement using rpc
  // Since Supabase JS client doesn't support raw SQL execution directly,
  // we need to use the REST API or a workaround

  console.log(`  Running ${filename}...`);

  // Use the SQL API endpoint directly
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "apikey": supabaseServiceKey as string,
      "Authorization": `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    // Try alternative: use pg_query function if available
    const { error } = await supabase.rpc("exec_sql", { query: sql });
    if (error) {
      console.error(`  ❌ Failed: ${error.message}`);
      return false;
    }
  }

  console.log(`  ✅ ${filename} completed`);
  return true;
}

async function main(): Promise<void> {
  console.log("🚀 Running Supabase Migrations");
  console.log("==============================");
  console.log(`URL: ${supabaseUrl}`);
  console.log("");

  // Note: Supabase JS client doesn't support raw SQL execution.
  // The migrations need to be run via:
  // 1. Supabase Dashboard SQL Editor
  // 2. Supabase CLI (supabase db push)
  // 3. Direct PostgreSQL connection

  console.log("⚠️  The Supabase JS client doesn't support raw SQL execution.");
  console.log("");
  console.log("Please run the migrations using one of these methods:");
  console.log("");
  console.log("Option 1: Supabase Dashboard");
  console.log(`  1. Go to: ${supabaseUrl?.replace('.supabase.co', '') ?? 'YOUR_PROJECT'}/project/vjqoarseyxptyadlxaza/sql`);
  console.log("  2. Copy and paste each migration file's contents");
  console.log("  3. Run them in order (001, 002, 003, 004)");
  console.log("");
  console.log("Option 2: Supabase CLI");
  console.log("  1. Run: supabase link --project-ref vjqoarseyxptyadlxaza");
  console.log("  2. Enter your database password when prompted");
  console.log("  3. Run: supabase db push");
  console.log("");
  console.log("Migration files to run:");

  const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    console.log(`  - supabase/migrations/${file}`);
  }
}

main();
