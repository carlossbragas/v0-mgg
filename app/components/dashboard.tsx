"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Users,
  ShoppingCart,
  CheckSquare,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Target,
  Calendar,
} from "lucide-react"

interface DashboardProps {
  familyData?: {
    name: string
    members: number
    totalBalance: number
    monthlyGoal: number
    currentExpenses: number
  }
}

export function Dashboard({ familyData }: DashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const defaultData = {
    name: "Família Silva",
    members: 4,
    totalBalance: 2500.0,
    monthlyGoal: 3000.0,
    currentExpenses: 1850.0,
  }

  const data = familyData || defaultData
  const goalProgress = (data.currentExpenses / data.monthlyGoal) * 100
  const remainingBudget = data.monthlyGoal - data.currentExpenses

  const quickStats = [
    {
      title: "Saldo Total",
      value: `R$ ${data.totalBalance.toFixed(2)}`,
      icon: Wallet,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Gastos do Mês",
      value: `R$ ${data.currentExpenses.toFixed(2)}`,
      icon: TrendingDown,
      trend: "-5%",
      trendUp: false,
    },
    {
      title: "Meta Mensal",
      value: `R$ ${data.monthlyGoal.toFixed(2)}`,
      icon: Target,
      trend: `${goalProgress.toFixed(0)}%`,
      trendUp: goalProgress < 80,
    },
    {
      title: "Membros Ativos",
      value: data.members.toString(),
      icon: Users,
      trend: "+1",
      trendUp: true,
    },
  ]

  const recentActivities = [
    { type: "expense", description: "Supermercado Extra", amount: -125.5, member: "Maria", time: "2h atrás" },
    { type: "income", description: "Mesada João", amount: +50.0, member: "João", time: "1 dia atrás" },
    { type: "expense", description: "Farmácia", amount: -35.8, member: "Carlos", time: "2 dias atrás" },
    { type: "task", description: "Tarefa concluída: Lavar louça", amount: +10.0, member: "Ana", time: "3 dias atrás" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Olá, {data.name}! 👋
            </h1>
            <p className="text-gray-600 mt-1">Aqui está o resumo das suas finanças familiares</p>
          </div>
          <div className="flex gap-2">
            {["week", "month", "year"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="capitalize"
              >
                {period === "week" ? "Semana" : period === "month" ? "Mês" : "Ano"}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`p-2 rounded-full ${stat.trendUp ? "bg-green-100" : "bg-red-100"}`}>
                      <stat.icon className={`h-5 w-5 ${stat.trendUp ? "text-green-600" : "text-red-600"}`} />
                    </div>
                    <span className={`text-xs font-medium mt-2 ${stat.trendUp ? "text-green-600" : "text-red-600"}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Budget Progress */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-orange-600" />
              Progresso da Meta Mensal
            </CardTitle>
            <CardDescription>
              Você gastou R$ {data.currentExpenses.toFixed(2)} de R$ {data.monthlyGoal.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={goalProgress} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{goalProgress.toFixed(1)}% da meta utilizada</span>
                <span className={`font-medium ${remainingBudget > 0 ? "text-green-600" : "text-red-600"}`}>
                  {remainingBudget > 0
                    ? `R$ ${remainingBudget.toFixed(2)} restantes`
                    : `R$ ${Math.abs(remainingBudget).toFixed(2)} acima da meta`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>Últimas movimentações da família</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "income"
                          ? "bg-green-100"
                          : activity.type === "expense"
                            ? "bg-red-100"
                            : "bg-blue-100"
                      }`}
                    >
                      {activity.type === "income" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : activity.type === "expense" ? (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-600">
                        {activity.member} • {activity.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${activity.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {activity.amount > 0 ? "+" : ""}R$ {Math.abs(activity.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Adicionar Gasto</h3>
              <p className="text-orange-100 text-sm">Registre uma nova despesa</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Lista de Compras</h3>
              <p className="text-green-100 text-sm">Gerencie suas compras</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <CheckSquare className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Tarefas</h3>
              <p className="text-blue-100 text-sm">Organize as atividades</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
