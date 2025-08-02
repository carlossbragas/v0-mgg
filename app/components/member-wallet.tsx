"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Eye, EyeOff } from "lucide-react"

interface MemberWalletProps {
  familyData: {
    familyName: string
    adminName: string
    members: Array<{
      name: string
      role: "adult" | "child"
      allowance: number
    }>
    budget: {
      monthly: number
      categories: Array<{
        name: string
        limit: number
      }>
    }
  }
  onBack: () => void
}

export default function MemberWallet({ familyData, onBack }: MemberWalletProps) {
  const [showBalances, setShowBalances] = useState(true)
  const [selectedMember, setSelectedMember] = useState<string | null>(null)

  // Mock data para carteiras dos membros
  const walletData = [
    {
      name: "João Silva",
      role: "adult",
      balance: 3253.7,
      monthlyIncome: 5000.0,
      monthlyExpenses: 2800.0,
      savings: 1200.0,
      allowance: 0,
      transactions: [
        { id: 1, type: "income", description: "Salário", amount: 5000.0, date: "2024-01-01" },
        { id: 2, type: "expense", description: "Supermercado", amount: -245.67, date: "2024-01-15" },
        { id: 3, type: "expense", description: "Restaurante", amount: -198.4, date: "2024-01-10" },
      ],
    },
    {
      name: "Maria Silva",
      role: "adult",
      balance: 1200.0,
      monthlyIncome: 3500.0,
      monthlyExpenses: 1800.0,
      savings: 800.0,
      allowance: 0,
      transactions: [
        { id: 4, type: "income", description: "Freelance", amount: 1200.0, date: "2024-01-05" },
        { id: 5, type: "expense", description: "Gasolina", amount: -120.0, date: "2024-01-14" },
      ],
    },
    {
      name: "Pedro Silva",
      role: "child",
      balance: 150.0,
      monthlyIncome: 200.0,
      monthlyExpenses: 85.5,
      savings: 50.0,
      allowance: 200.0,
      transactions: [
        { id: 6, type: "income", description: "Mesada", amount: 200.0, date: "2024-01-01" },
        { id: 7, type: "expense", description: "Cinema", amount: -85.5, date: "2024-01-13" },
        { id: 8, type: "income", description: "Tarefa Extra", amount: 25.0, date: "2024-01-08" },
      ],
    },
    {
      name: "Ana Silva",
      role: "child",
      balance: 75.0,
      monthlyIncome: 150.0,
      monthlyExpenses: 67.8,
      savings: 25.0,
      allowance: 150.0,
      transactions: [
        { id: 9, type: "income", description: "Mesada", amount: 150.0, date: "2024-01-01" },
        { id: 10, type: "expense", description: "Farmácia", amount: -67.8, date: "2024-01-12" },
      ],
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 1000) return "text-green-600"
    if (balance > 500) return "text-yellow-600"
    return "text-red-600"
  }

  const getSavingsProgress = (member: any) => {
    const target = member.role === "adult" ? 2000 : 300
    return Math.min((member.savings / target) * 100, 100)
  }

  const totalFamilyBalance = walletData.reduce((sum, member) => sum + member.balance, 0)
  const totalFamilyIncome = walletData.reduce((sum, member) => sum + member.monthlyIncome, 0)
  const totalFamilyExpenses = walletData.reduce((sum, member) => sum + member.monthlyExpenses, 0)

  if (selectedMember) {
    const member = walletData.find((m) => m.name === selectedMember)
    if (!member) return null

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedMember(null)} className="text-emerald-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Carteira - {member.name}</h1>
            <p className="text-gray-600">Detalhes financeiros e transações</p>
          </div>
          <Badge variant={member.role === "adult" ? "default" : "secondary"}>
            {member.role === "adult" ? "Adulto" : "Criança"}
          </Badge>
        </div>

        {/* Resumo da Carteira */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Saldo Atual</p>
                  <p className={`text-2xl font-bold ${getBalanceColor(member.balance)}`}>
                    {showBalances ? formatCurrency(member.balance) : "••••••"}
                  </p>
                </div>
                <Wallet className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita Mensal</p>
                  <p className="text-2xl font-bold text-green-600">
                    {showBalances ? formatCurrency(member.monthlyIncome) : "••••••"}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gastos Mensais</p>
                  <p className="text-2xl font-bold text-red-600">
                    {showBalances ? formatCurrency(member.monthlyExpenses) : "••••••"}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Economia</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {showBalances ? formatCurrency(member.savings) : "••••••"}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meta de Economia */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Target className="w-5 h-5" />
              Meta de Economia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Progresso: {showBalances ? formatCurrency(member.savings) : "••••••"} /{" "}
                  {formatCurrency(member.role === "adult" ? 2000 : 300)}
                </span>
                <span className="text-sm font-medium text-emerald-700">{getSavingsProgress(member).toFixed(1)}%</span>
              </div>
              <Progress value={getSavingsProgress(member)} className="h-3" />
              <p className="text-xs text-gray-500">
                {member.role === "adult"
                  ? "Meta mensal de economia para adultos: R$ 2.000"
                  : "Meta mensal de economia para crianças: R$ 300"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transações Recentes */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Calendar className="w-5 h-5" />
              Transações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {member.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{transaction.description}</h4>
                      <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {showBalances ? formatCurrency(Math.abs(transaction.amount)) : "••••••"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-emerald-700">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Carteiras da Família</h1>
          <p className="text-gray-600">Visualize os saldos e transações de todos os membros</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowBalances(!showBalances)}
          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        >
          {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Resumo Geral */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <DollarSign className="w-5 h-5" />
            Resumo Financeiro da Família
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-gray-600">Saldo Total</p>
              <p className="text-2xl font-bold text-emerald-700">
                {showBalances ? formatCurrency(totalFamilyBalance) : "••••••"}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-green-700">
                {showBalances ? formatCurrency(totalFamilyIncome) : "••••••"}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Gastos Totais</p>
              <p className="text-2xl font-bold text-red-700">
                {showBalances ? formatCurrency(totalFamilyExpenses) : "••••••"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carteiras dos Membros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {walletData.map((member) => (
          <Card
            key={member.name}
            className="border-2 border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedMember(member.name)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-800">{member.name}</CardTitle>
                <Badge variant={member.role === "adult" ? "default" : "secondary"}>
                  {member.role === "adult" ? "Adulto" : "Criança"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Saldo Principal */}
              <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Saldo Atual</p>
                <p className={`text-3xl font-bold ${getBalanceColor(member.balance)}`}>
                  {showBalances ? formatCurrency(member.balance) : "••••••"}
                </p>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600">Receita</p>
                  <p className="text-lg font-bold text-green-600">
                    {showBalances ? formatCurrency(member.monthlyIncome) : "••••"}
                  </p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-gray-600">Gastos</p>
                  <p className="text-lg font-bold text-red-600">
                    {showBalances ? formatCurrency(member.monthlyExpenses) : "••••"}
                  </p>
                </div>
              </div>

              {/* Mesada para crianças */}
              {member.role === "child" && member.allowance > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Mesada Mensal</span>
                    <span className="font-bold text-blue-700">
                      {showBalances ? formatCurrency(member.allowance) : "••••"}
                    </span>
                  </div>
                </div>
              )}

              {/* Meta de Economia */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Meta de Economia</span>
                  <span className="text-xs font-medium text-emerald-700">{getSavingsProgress(member).toFixed(0)}%</span>
                </div>
                <Progress value={getSavingsProgress(member)} className="h-2" />
              </div>

              {/* Botão para ver detalhes */}
              <Button
                variant="outline"
                className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedMember(member.name)
                }}
              >
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
