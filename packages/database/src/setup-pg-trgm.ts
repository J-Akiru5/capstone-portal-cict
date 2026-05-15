import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Starting pg_trgm setup...")

  try {
    // 1. Enable pg_trgm extension
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`)
    console.log("✅ Extension pg_trgm enabled.")

    // 2. Create GIN index on HistoricalTitle
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_historical_titles_trgm 
      ON "HistoricalTitle" USING GIN (title gin_trgm_ops);
    `)
    console.log("✅ GIN index created on HistoricalTitle.")

    // 3. Create Similarity Function
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION search_similar_titles(query_title TEXT, threshold FLOAT DEFAULT 0.3)
      RETURNS TABLE(id TEXT, title TEXT, year INT, similarity FLOAT) AS $$
        SELECT id, title, year, similarity(title, query_title) AS similarity
        FROM "HistoricalTitle"
        WHERE similarity(title, query_title) >= threshold
        ORDER BY similarity DESC
        LIMIT 20;
      $$ LANGUAGE sql;
    `)
    console.log("✅ search_similar_titles function created.")

  } catch (error) {
    console.error("❌ Error setting up pg_trgm:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
