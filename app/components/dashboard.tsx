"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CheckSquare,
  ShoppingCart,
  Calendar,
  Target,
  Wallet,
  PiggyBank,
} from "lucide-react"

interface DashboardProps {
  user: any
}

export function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState({
    totalBalance: 2450.75,
    monthlyIncome: 5200.0,
    monthlyExpenses: 3850.25,
    savingsGoal: 10000.0,
    currentSavings: 6750.5,
    pendingTasks: 8,
    shoppingItems: 12,
    familyMembers: 4,
  })

  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: "1",
      description: "Supermercado Extra",
      amount: -245.8,
      category: "Alimentação",
      date: new Date("2024-01-15"),
      member: "Maria Silva",
    },
    {
      id: "2",
      description: "Salário Janeiro",
      amount: 5200.0,
      category: "Renda",
      date: new Date("2024-01-01"),
      member: "João Silva",
    },
    {
      id: "3",
      description: "Conta de Luz",
      amount: -180.45,
      category: "Utilidades",
      date: new Date("2024-01-10"),
      member: "Maria Silva",
    },
    {
      id: "4",
      description: "Farmácia",
      amount: -67.9,
      category: "Saúde",
      date: new Date("2024-01-12"),
      member: "Ana Silva",
    },
  ])

  const [quickActions] = useState([
    { id: "add-expense", label: "Adicionar Gasto", icon: TrendingDown, color: "red" },
    { id: "add-income", label: "Adicionar Renda", icon: TrendingUp, color: "green" },
    { id: "add-task", label: "Nova Tarefa", icon: CheckSquare, color: "blue" },
    { id: "add-shopping", label: "Lista Compras", icon: ShoppingCart, color: "purple" },
  ])

  // Calcular progresso da meta de economia
  const savingsProgress = (stats.currentSavings / stats.savingsGoal) * 100

  // Calcular saldo mensal
  const monthlyBalance = stats.monthlyIncome - stats.monthlyExpenses

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Olá, {user?.name?.split(" ")[0] || "Usuário"}! 👋</h2>
            <p className="text-orange-100">Aqui está um resumo das suas finanças familiares</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <PiggyBank className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saldo Total */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              R$ {stats.totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-green-600 mt-1">+12% em relação ao mês passado</p>
          </CardContent>
        </Card>

        {/* Renda Mensal */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Renda Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              R$ {stats.monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-blue-600 mt-1">Estável este mês</p>
          </CardContent>
        </Card>

        {/* Gastos Mensais */}
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Gastos Mensais</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              R$ {stats.monthlyExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-red-600 mt-1">-5% em relação ao mês passado</p>
          </CardContent>
        </Card>

        {/* Membros da Família */}
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Família</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats.familyMembers} membros</div>
            <p className="text-xs text-purple-600 mt-1">Todos ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-orange-600" />
            <span>Ações Rápidas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`h-auto py-4 flex flex-col items-center space-y-2 hover:bg-${action.color}-50 border-${action.color}-200`}
                >
                  <Icon className={`w-6 h-6 text-${action.color}-600`} />
                  <span className="text-sm text-center">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meta de Economia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PiggyBank className="w-5 h-5 text-orange-600" />
              <span>Meta de Economia</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Progresso</span>
              <span className="text-sm font-medium">{savingsProgress.toFixed(1)}%</span>
            </div>
            <Progress value={savingsProgress} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                R$ {stats.currentSavings.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <span className="font-medium">
                R$ {stats.savingsGoal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Faltam:</strong> R${" "}
                {(stats.savingsGoal - stats.currentSavings).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} para
                atingir sua meta!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resumo do Mês */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span>Resumo do Mês</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-green-800 font-medium">Saldo Mensal</p>
                <p className="text-xs text-green-600">Renda - Gastos</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-900">
                  R$ {monthlyBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <CheckSquare className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium">{stats.pendingTasks}</p>
                <p className="text-xs text-gray-600">Tarefas Pendentes</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">{stats.shoppingItems}</p>
                <p className="text-xs text-gray-600">Itens na Lista</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <span>Transações Recentes</span>
            </div>
            <Button variant="outline" size="sm">
              Ver Todas
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.amount > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.amount > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                      <span>•</span>
                      <span>{transaction.member}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {transaction.amount > 0 ? "+" : ""}R${" "}
                    {Math.abs(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.date.toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
