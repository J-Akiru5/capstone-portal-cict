import { PrismaClient } from "@prisma/client"
const databaseUrl = process.env.NEXT_POSTGRES_PRISMA_URL || process.env.DATABASE_URL || process.env.NEXT_POSTGRES_URL || process.env.POSTGRES_URL

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
})

export * from "@prisma/client"
