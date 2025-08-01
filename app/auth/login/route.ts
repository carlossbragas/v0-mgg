import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const LoginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(4),
})

// POST /api/auth/login
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, senha } = LoginSchema.parse(body)

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    })

    if (!usuario || !usuario.senha) {
      return NextResponse.json(
        { message: "Usuário não encontrado ou senha inválida" },
        { status: 401 }
      )
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if (!senhaCorreta) {
      return NextResponse.json(
        { message: "Email ou senha incorretos" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        message: "Login realizado com sucesso",
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erro ao autenticar:", error)
    return NextResponse.json(
      { message: "Erro interno", error: (error as Error).message },
      { status: 500 }
    )
  }
}
