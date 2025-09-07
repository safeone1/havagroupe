import { PrismaClient } from "@/generated/prisma";

// Add type to `globalThis` for TS
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // Always create a new PrismaClient in production
  prisma = new PrismaClient();
} else {
  // In development, use globalThis to avoid multiple instances
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

export { prisma };
