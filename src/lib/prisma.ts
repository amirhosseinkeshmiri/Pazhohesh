import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function databasePoolConfig() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  let parsed: URL;
  try {
    parsed = new URL(connectionString);
  } catch {
    throw new Error("DATABASE_URL is invalid.");
  }
  if (!["postgres:", "postgresql:"].includes(parsed.protocol) || !parsed.hostname || parsed.pathname === "/" || !parsed.pathname) {
    throw new Error("DATABASE_URL must identify a PostgreSQL database.");
  }
  return { connectionString, connectionTimeoutMillis: 7_000 };
}

export function getPrisma() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const prisma = new PrismaClient({
    adapter: new PrismaPg(databasePoolConfig(), {
      onPoolError: () => console.warn("[database] idle pool connection error"),
      onConnectionError: () => console.warn("[database] active connection error"),
    }),
  });
  globalForPrisma.prisma = prisma;
  return prisma;
}
