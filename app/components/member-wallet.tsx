"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  familyId?: string
}

interface Family {
  id: string
  name: string
  adminId: string
  members: User[]
}

interface Transaction {
  id: string
  type: "income" | "expense" | "transfer"
  amount: number
  description: string
  date: string
  memberId: string
  fromMemberId?: string
  toMemberId?: string
}

interface MemberWalletProps {
  user: User
  family: Family | null
}

export function MemberWallet({ user, family }: MemberWalletProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income")
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    // Carregar transações do localStorage
    const savedTransactions = JSON.parse(localStorage.getItem("wallet-transactions") || "[]")
    setTransactions(savedTransactions)
  }, [])

  const getMemberTransactions = (memberId: string) => {
    return transactions.filter(
      (t) => t.memberId === memberId || t.fromMemberId === memberId || t.toMemberId === memberId,
    )
  }

  const getMemberBalance = (memberId: string) => {
    const memberTransactions = getMemberTransactions(memberId)
    return memberTransactions.reduce((balance, transaction) => {
      if (transaction.type === "income") {
        return balance + transaction.amount
      } else if (transaction.type === "expense") {
        return balance - transaction.amount
      } else if (transaction.type === "transfer") {
        if (transaction.fromMemberId === memberId) {
          return balance - transaction.amount
        } else if (transaction.toMemberId === memberId) {
          return balance + transaction.amount
        }
      }
      return balance
    }, 0)
  }

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.description) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: Number.parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
      memberId: user.id,
    }

    const updatedTransactions = [newTransaction, ...transactions]
    setTransactions(updatedTransactions)
    localStorage.setItem("wallet-transactions", JSON.stringify(updatedTransactions))

    toast.success(`${transactionType === "income" ? "Receita" : "Gasto"} adicionado com sucesso!`)
    setShowAddTransaction(false)
    setFormData({ amount: "", description: "", date: new Date().toISOString().split("T")[0] })
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const userBalance = getMemberBalance(user.id)
  const userTransactions = getMemberTransactions(user.id).slice(0, 10)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header da Carteira */}
      <Card className="retro-shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                <AvatarFallback className="bg-retro-orange text-white text-lg sm:text-xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg sm:text-xl">Minha Carteira</CardTitle>
                <CardDescription className="text-sm">{user.name}</CardDescription>
              </div>
            </div>
            <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
              <DialogTrigger asChild>
                <Button className="bg-retro-green hover:bg-retro-green/90 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Transação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle>Nova Transação</DialogTitle>
                  <DialogDescription>Adicione uma receita ou gasto à sua carteira</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTransaction} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={transactionType === "income" ? "default" : "outline"}
                      onClick={() => setTransactionType("income")}
                      className="h-11"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Receita
                    </Button>
                    <Button
                      type="button"
                      variant={transactionType === "expense" ? "default" : "outline"}
                      onClick={() => setTransactionType("expense")}
                      className="h-11"
                    >
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Gasto
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição *</Label>
                    <Input
                      id="description"
                      placeholder="Ex: Salário, Compras..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddTransaction(false)}
                      className="flex-1 h-11 order-2 sm:order-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-11 bg-retro-green hover:bg-retro-green/90 order-1 sm:order-2"
                    >
                      Salvar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Saldo Atual */}
      <Card className="retro-shadow">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-retro-blue" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Saldo Atual</h3>
            <div
              className={`text-3xl sm:text-4xl font-bold ${userBalance >= 0 ? "text-retro-green" : "text-retro-orange"}`}
            >
              {formatCurrency(userBalance)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo dos Membros da Família */}
      {family && family.members.length > 1 && (
        <Card className="retro-shadow">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Saldos da Família</CardTitle>
            <CardDescription className="text-sm">Visão geral dos saldos de todos os membros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {family.members.map((member) => {
                const memberBalance = getMemberBalance(member.id)
                return (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-retro-purple text-white text-sm">
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        {member.id === user.id && (
                          <Badge variant="secondary" className="text-xs">
                            Você
                          </Badge>
                        )}
                      </div>
                    </div>
                    <span
                      className={`font-bold text-sm sm:text-base ${memberBalance >= 0 ? "text-retro-green" : "text-retro-orange"}`}
                    >
                      {formatCurrency(memberBalance)}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Transações */}
      <Card className="retro-shadow">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Histórico de Transações</CardTitle>
          <CardDescription className="text-sm">Suas últimas movimentações financeiras</CardDescription>
        </CardHeader>
        <CardContent>
          {userTransactions.length > 0 ? (
            <div className="space-y-3">
              {userTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <span
                    className={`font-bold text-sm sm:text-base ${
                      transaction.type === "income" ? "text-retro-green" : "text-retro-orange"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💳</div>
              <p className="text-muted-foreground">Nenhuma transação encontrada</p>
              <p className="text-sm text-muted-foreground mt-2">Comece adicionando sua primeira receita ou gasto!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
