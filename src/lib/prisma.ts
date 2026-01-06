import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { Pool } from "pg";

/**
 * Singleton instance of Prisma Client with PostgreSQL adapter
 * Prevents multiple instances in development with hot reload
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
