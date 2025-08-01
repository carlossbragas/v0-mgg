import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Schema de validação Zod
const UsuarioSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
})

// Handler para OPTIONS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// POST /api/usuarios – Cadastro seguro
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = UsuarioSchema.parse(body)

    // Verifica se já existe um usuário com o e-mail
    const existing = await prisma.usuario.findUnique({
      where: { email: data.email },
    })

    if (existing) {
      return NextResponse.json(
        { message: "E-mail já cadastrado." },
        { status: 409, headers: corsHeaders }
      )
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(data.senha, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: hashedPassword,
      },
    })

    return NextResponse.json(
      { message: "Usuário criado com sucesso", usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } },
      { status: 201, headers: corsHeaders }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Erro de validação", errors: error.errors }, { status: 400, headers: corsHeaders })
    }

    console.error("Erro ao cadastrar usuário:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500, headers: corsHeaders })
  }
}
