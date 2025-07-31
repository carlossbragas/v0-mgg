import { PrismaClient } from "@prisma/client"

// Adiciona o PrismaClient ao objeto global para evitar múltiplas instâncias em desenvolvimento
// Isso é uma boa prática para evitar problemas de "hot-reloading" no Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // Opcional: logs de queries para depuração
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
