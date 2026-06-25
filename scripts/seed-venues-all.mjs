/**
 * Seeds / refreshes the venue_directory table from lib/data/venues-all.ts
 * (the canonical 500-venue list). Idempotent:
 *  - adds the priority / emailable / times_sent / last_sent_at columns if missing
 *  - upserts every venue by id (the source ids are stable)
 *  - never resets existing send tracking (times_sent / last_sent_at preserved)
 */
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import pg from "pg"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

function loadVenues() {
  const file = readFileSync(join(root, "lib/data/venues-all.ts"), "utf8")
  const marker = "VENUES: Venue[]"
  const start = file.indexOf("[", file.indexOf(marker) + marker.length)
  const end = file.lastIndexOf("]")
  return JSON.parse(file.slice(start, end + 1))
}

const venues = loadVenues()
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

const clean = (v) => {
  if (v == null) return null
  const s = String(v).trim()
  return s === "" ? null : s
}

async function main() {
  await pool.query(`
    ALTER TABLE venue_directory
      ADD COLUMN IF NOT EXISTS priority integer,
      ADD COLUMN IF NOT EXISTS emailable boolean NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS times_sent integer NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS last_sent_at timestamp;
  `)

  const sql = `
    INSERT INTO venue_directory
      (id, name, category, address, website, instagram, owner,
       contact_url, source, confidence, description, phone, email,
       priority, emailable, status, imported_at, created_at, updated_at)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'prospect',now(),now(),now())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      category = EXCLUDED.category,
      address = EXCLUDED.address,
      website = EXCLUDED.website,
      instagram = EXCLUDED.instagram,
      owner = EXCLUDED.owner,
      contact_url = EXCLUDED.contact_url,
      source = EXCLUDED.source,
      confidence = EXCLUDED.confidence,
      description = EXCLUDED.description,
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      priority = EXCLUDED.priority,
      emailable = EXCLUDED.emailable,
      updated_at = now();
  `

  let n = 0
  for (const v of venues) {
    await pool.query(sql, [
      v.id,
      v.name,
      clean(v.category),
      clean(v.address),
      clean(v.website),
      clean(v.instagram),
      clean(v.owner),
      clean(v.bestPublicContact),
      clean(v.emailSource) ?? "venues-all",
      clean(v.confidence),
      clean(v.description),
      clean(v.phone),
      v.emailable ? clean(v.email) : clean(v.email), // keep raw email even if not emailable
      v.priority ?? null,
      Boolean(v.emailable),
    ])
    n++
  }

  // keep the serial sequence ahead of the explicit ids we inserted
  await pool.query(
    `SELECT setval(pg_get_serial_sequence('venue_directory','id'),
            (SELECT MAX(id) FROM venue_directory))`,
  )

  const counts = await pool.query(
    `SELECT count(*)::int total,
            count(*) FILTER (WHERE emailable)::int emailable,
            count(*) FILTER (WHERE priority IS NOT NULL)::int prioritised
     FROM venue_directory`,
  )
  console.log(`Upserted ${n} venues.`, counts.rows[0])
  await pool.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
