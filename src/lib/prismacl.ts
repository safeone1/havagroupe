import { PrismaClient } from "@/generated/prisma";

let prisma = new PrismaClient();

// Note: In dev mode with Next.js hot-reload, use a global singleton to avoid multiple Prisma instances
declare global {
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}
export { prisma };
