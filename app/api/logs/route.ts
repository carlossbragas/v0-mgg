import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { LogSchema } from "@/lib/validation"
import { ZodError } from "zod"

// Configuração CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*", // Usa a variável de ambiente ou '*' como fallback
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handler para OPTIONS (preflight requests)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// POST /api/logs: Registrar logs de dispositivos
export async function POST(req: Request) {
  console.log("Requisição POST recebida em /api/logs")
  try {
    const body = await req.json()
    const data = LogSchema.parse(body)

    // Verifica se o dispositivo existe antes de registrar o log
    const existingDispositivo = await prisma.dispositivo.findUnique({
      where: { id_dispositivo: data.id_dispositivo },
    })

    if (!existingDispositivo) {
      console.warn(`Tentativa de registrar log para dispositivo não existente: ${data.id_dispositivo}`)
      return NextResponse.json(
        { message: `Dispositivo com ID ${data.id_dispositivo} não encontrado.`, error: "Dispositivo não registrado." },
        { status: 404, headers: corsHeaders },
      )
    }

    const log = await prisma.log.create({
      data: {
        id_dispositivo: data.id_dispositivo,
        mensagem: data.mensagem,
        timestamp: new Date(data.timestamp), // Converte a string ISO 8601 para Date
      },
    })
    console.log(`Log registrado para dispositivo ${data.id_dispositivo}.`)

    return NextResponse.json({ message: "Log registrado com sucesso", log }, { status: 201, headers: corsHeaders })
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Erro de validação:", error.errors)
      return NextResponse.json(
        { message: "Dados inválidos", errors: error.errors },
        { status: 400, headers: corsHeaders },
      )
    }
    console.error("Erro ao registrar log:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor", error: (error as Error).message },
      { status: 500, headers: corsHeaders },
    )
  }
}
