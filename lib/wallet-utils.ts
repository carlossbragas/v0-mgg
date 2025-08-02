import { z } from "zod"

// Schemas de validação
export const walletTransactionSchema = z.object({
  memberId: z.string().min(1, "Membro é obrigatório"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.enum(["mesada", "salario", "presente", "venda", "transferencia", "gasto", "compra", "outros"]),
  type: z.enum(["add", "remove", "transfer"]),
})

export const transferSchema = z.object({
  fromMemberId: z.string().min(1, "Membro de origem é obrigatório"),
  toMemberId: z.string().min(1, "Membro de destino é obrigatório"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  description: z.string().min(1, "Descrição é obrigatória"),
})

// Tipos
export interface WalletTransaction {
  id: string
  memberId: string
  amount: number
  description: string
  category: string
  type: "add" | "remove" | "transfer"
  date: string
  fromMemberId?: string
  toMemberId?: string
}

export interface MemberBalance {
  memberId: string
  memberName: string
  balance: number
  role: "adult" | "child"
}

// Mock data - em produção seria um banco de dados
const mockBalances: MemberBalance[] = [
  { memberId: "1", memberName: "João Silva", balance: 3253.7, role: "adult" },
  { memberId: "2", memberName: "Maria Silva", balance: 1200.0, role: "adult" },
  { memberId: "3", memberName: "Pedro Silva", balance: 150.0, role: "child" },
  { memberId: "4", memberName: "Ana Silva", balance: 75.0, role: "child" },
]

const mockTransactions: WalletTransaction[] = [
  {
    id: "1",
    memberId: "1",
    amount: 3500.0,
    description: "Salário Janeiro",
    category: "salario",
    type: "add",
    date: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    memberId: "3",
    amount: 50.0,
    description: "Mesada semanal",
    category: "mesada",
    type: "add",
    date: "2024-01-14T15:30:00Z",
  },
]

// Funções utilitárias
export function addBalance(memberId: string, amount: number, description: string, category: string): WalletTransaction {
  const transaction: WalletTransaction = {
    id: Date.now().toString(),
    memberId,
    amount,
    description,
    category,
    type: "add",
    date: new Date().toISOString(),
  }

  // Atualizar saldo
  const memberIndex = mockBalances.findIndex((m) => m.memberId === memberId)
  if (memberIndex !== -1) {
    mockBalances[memberIndex].balance += amount
  }

  // Adicionar transação
  mockTransactions.push(transaction)

  return transaction
}

export function removeBalance(
  memberId: string,
  amount: number,
  description: string,
  category: string,
): WalletTransaction | null {
  const member = mockBalances.find((m) => m.memberId === memberId)

  if (!member || member.balance < amount) {
    return null // Saldo insuficiente
  }

  const transaction: WalletTransaction = {
    id: Date.now().toString(),
    memberId,
    amount,
    description,
    category,
    type: "remove",
    date: new Date().toISOString(),
  }

  // Atualizar saldo
  member.balance -= amount

  // Adicionar transação
  mockTransactions.push(transaction)

  return transaction
}

export function transferBalance(
  fromMemberId: string,
  toMemberId: string,
  amount: number,
  description: string,
): WalletTransaction[] | null {
  const fromMember = mockBalances.find((m) => m.memberId === fromMemberId)
  const toMember = mockBalances.find((m) => m.memberId === toMemberId)

  if (!fromMember || !toMember || fromMember.balance < amount) {
    return null // Saldo insuficiente ou membro não encontrado
  }

  const fromTransaction: WalletTransaction = {
    id: Date.now().toString(),
    memberId: fromMemberId,
    amount,
    description,
    category: "transferencia",
    type: "transfer",
    date: new Date().toISOString(),
    toMemberId,
  }

  const toTransaction: WalletTransaction = {
    id: (Date.now() + 1).toString(),
    memberId: toMemberId,
    amount,
    description,
    category: "transferencia",
    type: "transfer",
    date: new Date().toISOString(),
    fromMemberId,
  }

  // Atualizar saldos
  fromMember.balance -= amount
  toMember.balance += amount

  // Adicionar transações
  mockTransactions.push(fromTransaction, toTransaction)

  return [fromTransaction, toTransaction]
}

export function getMemberBalance(memberId: string): MemberBalance | null {
  return mockBalances.find((m) => m.memberId === memberId) || null
}

export function getAllBalances(): MemberBalance[] {
  return mockBalances
}

export function getMemberTransactions(memberId: string): WalletTransaction[] {
  return mockTransactions.filter((t) => t.memberId === memberId)
}

export function getAllTransactions(): WalletTransaction[] {
  return mockTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export type WalletTransactionData = z.infer<typeof walletTransactionSchema>
export type TransferData = z.infer<typeof transferSchema>
