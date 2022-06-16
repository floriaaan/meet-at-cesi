import { PrismaClient } from "@prisma/client";

type GlobalPrisma = typeof globalThis & { prisma: any };

export const prisma = (global as GlobalPrisma).prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  (global as GlobalPrisma).prisma = prisma;
}
