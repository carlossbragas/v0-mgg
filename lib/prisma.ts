import { PrismaClient } from "@prisma/client"

// Garante que apenas uma instância do PrismaClient seja criada
// e reutilizada em todo o ambiente de desenvolvimento.
// Isso evita problemas de "hot-reloading" no Next.js que poderiam
// criar múltiplas instâncias do PrismaClient.
const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma
