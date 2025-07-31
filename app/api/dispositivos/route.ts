import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { DispositivoSchema } from "@/lib/validation"
import { ZodError } from "zod"

// Configuração CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*", // Usa a variável de ambiente ou '*' como fallback
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handler para OPTIONS (preflight requests)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// POST /api/dispositivos: Cadastrar ou atualizar dados de um dispositivo
export async function POST(req: Request) {
  console.log("Requisição POST recebida em /api/dispositivos")
  try {
    const body = await req.json()
    const data = DispositivoSchema.parse(body)

    const { id_dispositivo, ...rest } = data

    // Tenta encontrar o dispositivo existente
    const existingDispositivo = await prisma.dispositivo.findUnique({
      where: { id_dispositivo },
    })

    let dispositivo

    if (existingDispositivo) {
      // Atualiza o dispositivo existente
      dispositivo = await prisma.dispositivo.update({
        where: { id_dispositivo },
        data: {
          ...rest,
          updatedAt: new Date(), // Garante que updatedAt seja atualizado
        },
      })
      console.log(`Dispositivo ${id_dispositivo} atualizado com sucesso.`)
    } else {
      // Cria um novo dispositivo
      dispositivo = await prisma.dispositivo.create({
        data: {
          id_dispositivo,
          ...rest,
        },
      })
      console.log(`Novo dispositivo ${id_dispositivo} cadastrado com sucesso.`)
    }

    return NextResponse.json(
      { message: "Dispositivo processado com sucesso", dispositivo },
      { status: 200, headers: corsHeaders },
    )
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Erro de validação:", error.errors)
      return NextResponse.json(
        { message: "Dados inválidos", errors: error.errors },
        { status: 400, headers: corsHeaders },
      )
    }
    console.error("Erro ao processar dispositivo:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor", error: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}

// GET /api/dispositivos: Listar todos os dispositivos
export async function GET() {
  console.log("Requisição GET recebida em /api/dispositivos")
  try {
    const dispositivos = await prisma.dispositivo.findMany({
      orderBy: { createdAt: "desc" },
    })
    console.log(`Listados ${dispositivos.length} dispositivos.`)
    return NextResponse.json(dispositivos, { status: 200, headers: corsHeaders })
  } catch (error) {
    console.error("Erro ao listar dispositivos:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor", error: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}
