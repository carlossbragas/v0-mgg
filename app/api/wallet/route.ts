import { type NextRequest, NextResponse } from "next/server"
import {
  addBalance,
  removeBalance,
  transferBalance,
  getAllBalances,
  getAllTransactions,
  getMemberTransactions,
  walletTransactionSchema,
  transferSchema,
} from "@/lib/wallet-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const memberId = searchParams.get("memberId")

    switch (action) {
      case "balances":
        return NextResponse.json({
          success: true,
          balances: getAllBalances(),
        })

      case "transactions":
        if (memberId) {
          return NextResponse.json({
            success: true,
            transactions: getMemberTransactions(memberId),
          })
        } else {
          return NextResponse.json({
            success: true,
            transactions: getAllTransactions(),
          })
        }

      default:
        return NextResponse.json({
          success: true,
          balances: getAllBalances(),
          transactions: getAllTransactions(),
        })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case "add": {
        const validatedData = walletTransactionSchema.parse(body)
        const transaction = addBalance(
          validatedData.memberId,
          validatedData.amount,
          validatedData.description,
          validatedData.category,
        )

        return NextResponse.json({
          success: true,
          transaction,
          message: `R$ ${validatedData.amount.toFixed(2)} adicionado com sucesso!`,
        })
      }

      case "remove": {
        const validatedData = walletTransactionSchema.parse(body)
        const transaction = removeBalance(
          validatedData.memberId,
          validatedData.amount,
          validatedData.description,
          validatedData.category,
        )

        if (!transaction) {
          return NextResponse.json(
            {
              success: false,
              error: "Saldo insuficiente",
            },
            { status: 400 },
          )
        }

        return NextResponse.json({
          success: true,
          transaction,
          message: `R$ ${validatedData.amount.toFixed(2)} removido com sucesso!`,
        })
      }

      case "transfer": {
        const validatedData = transferSchema.parse(body)

        if (validatedData.fromMemberId === validatedData.toMemberId) {
          return NextResponse.json(
            {
              success: false,
              error: "Não é possível transferir para o mesmo membro",
            },
            { status: 400 },
          )
        }

        const transactions = transferBalance(
          validatedData.fromMemberId,
          validatedData.toMemberId,
          validatedData.amount,
          validatedData.description,
        )

        if (!transactions) {
          return NextResponse.json(
            {
              success: false,
              error: "Saldo insuficiente ou membro não encontrado",
            },
            { status: 400 },
          )
        }

        return NextResponse.json({
          success: true,
          transactions,
          message: `R$ ${validatedData.amount.toFixed(2)} transferido com sucesso!`,
        })
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Ação não reconhecida",
          },
          { status: 400 },
        )
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
