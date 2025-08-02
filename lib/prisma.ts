import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Função para conectar ao banco
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log("✅ Conectado ao banco de dados")
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error)
    throw error
  }
}

// Função para desconectar do banco
export async function disconnectDB() {
  try {
    await prisma.$disconnect()
    console.log("✅ Desconectado do banco de dados")
  } catch (error) {
    console.error("❌ Erro ao desconectar do banco:", error)
  }
}

// Middleware para logs de query em desenvolvimento
if (process.env.NODE_ENV === "development") {
  prisma.$use(async (params, next) => {
    const before = Date.now()
    const result = await next(params)
    const after = Date.now()
    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
    return result
  })
}

export default prisma
