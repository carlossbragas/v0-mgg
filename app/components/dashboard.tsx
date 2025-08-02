"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  PiggyBank,
  Home,
  CreditCard,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ShoppingCart,
  Lightbulb,
  Bell,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member"
}

interface Family {
  id: string
  name: string
  description?: string
  monthlyBudget: number
  savingsGoal?: number
  members: User[]
}

interface DashboardProps {
  user: User | null
  family: Family | null
  onLogout: () => void
}

export function Dashboard({ user, family, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Dados simulados
  const currentSpent = 2847.5
  const budgetUsed = family ? (currentSpent / family.monthlyBudget) * 100 : 0
  const savingsProgress = family?.savingsGoal ? (850 / family.savingsGoal) * 100 : 0

  const recentTransactions = [
    {
      id: 1,
      description: "Supermercado Extra",
      amount: -156.8,
      category: "Alimentação",
      date: "Hoje",
      type: "expense",
    },
    { id: 2, description: "Salário", amount: 3500.0, category: "Renda", date: "Ontem", type: "income" },
    { id: 3, description: "Conta de Luz", amount: -89.5, category: "Utilidades", date: "2 dias", type: "expense" },
    { id: 4, description: "Farmácia", amount: -45.2, category: "Saúde", date: "3 dias", type: "expense" },
  ]

  const categories = [
    { name: "Alimentação", spent: 856.4, budget: 1200, color: "bg-red-500" },
    { name: "Transporte", spent: 340.8, budget: 500, color: "bg-blue-500" },
    { name: "Utilidades", spent: 289.5, budget: 400, color: "bg-green-500" },
    { name: "Lazer", spent: 180.2, budget: 300, color: "bg-purple-500" },
  ]

  const sidebarItems = [
    { icon: Home, label: "Visão Geral", value: "overview" },
    { icon: CreditCard, label: "Transações", value: "transactions" },
    { icon: TrendingUp, label: "Relatórios", value: "reports" },
    { icon: Users, label: "Família", value: "family" },
    { icon: Lightbulb, label: "IoT Control", value: "iot" },
    { icon: Settings, label: "Configurações", value: "settings" },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <Sidebar className="border-r border-orange-200">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  MinhaGrana
                </h2>
                <p className="text-sm text-gray-600">{family?.name}</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        onClick={() => setActiveTab(item.value)}
                        isActive={activeTab === item.value}
                        className="w-full justify-start"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-white/50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-orange-200 to-red-200">
                  {user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-gray-600 hover:text-red-600">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-orange-200 px-4 bg-white/80 backdrop-blur-sm">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500">
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </header>

          <main className="flex-1 p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Orçamento Mensal</CardTitle>
                      <Wallet className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">R$ {family?.monthlyBudget.toFixed(2)}</div>
                      <p className="text-xs text-gray-600">
                        Restam R$ {((family?.monthlyBudget || 0) - currentSpent).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Gastos do Mês</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">R$ {currentSpent.toFixed(2)}</div>
                      <p className="text-xs text-gray-600">{budgetUsed.toFixed(1)}% do orçamento</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Meta de Economia</CardTitle>
                      <Target className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">R$ {family?.savingsGoal?.toFixed(2) || "0.00"}</div>
                      <p className="text-xs text-gray-600">R$ 850.00 economizados</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
                      <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{family?.members.length || 0}</div>
                      <p className="text-xs text-gray-600">
                        {family?.members.filter((m) => m.role === "admin").length || 0} administradores
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Budget Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
                    <CardHeader>
                      <CardTitle>Progresso do Orçamento</CardTitle>
                      <CardDescription>Acompanhe seus gastos mensais</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Gasto atual</span>
                          <span>
                            R$ {currentSpent.toFixed(2)} / R$ {family?.monthlyBudget.toFixed(2)}
                          </span>
                        </div>
                        <Progress value={budgetUsed} className="h-2" />
                        <p className="text-xs text-gray-600">
                          {budgetUsed > 80 ? "⚠️ Atenção: Você está próximo do limite!" : "✅ Gastos sob controle"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
                    <CardHeader>
                      <CardTitle>Meta de Economia</CardTitle>
                      <CardDescription>Progresso da sua economia mensal</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Economizado</span>
                          <span>R$ 850.00 / R$ {family?.savingsGoal?.toFixed(2) || "0.00"}</span>
                        </div>
                        <Progress value={savingsProgress} className="h-2" />
                        <p className="text-xs text-gray-600">
                          {savingsProgress >= 100
                            ? "🎉 Meta atingida!"
                            : `Faltam R$ ${((family?.savingsGoal || 0) - 850).toFixed(2)}`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Categories and Recent Transactions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
                    <CardHeader>
                      <CardTitle>Gastos por Categoria</CardTitle>
                      <CardDescription>Distribuição dos seus gastos</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {categories.map((category) => (
                        <div key={category.name} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${category.color}`} />
                              {category.name}
                            </span>
                            <span>
                              R$ {category.spent.toFixed(2)} / R$ {category.budget.toFixed(2)}
                            </span>
                          </div>
                          <Progress value={(category.spent / category.budget) * 100} className="h-1" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
                    <CardHeader>
                      <CardTitle>Transações Recentes</CardTitle>
                      <CardDescription>Suas últimas movimentações</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                transaction.type === "income"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{transaction.description}</p>
                              <p className="text-xs text-gray-600">
                                {transaction.category} • {transaction.date}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`font-semibold ${
                              transaction.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : ""}R$ {Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab !== "overview" && (
              <div className="flex items-center justify-center h-96">
                <Card className="bg-white/80 backdrop-blur-sm border-orange-200 p-8 text-center">
                  <CardContent>
                    <div className="p-4 rounded-full bg-orange-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Settings className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Em Desenvolvimento</h3>
                    <p className="text-gray-600 mb-4">
                      Esta seção está sendo desenvolvida e estará disponível em breve.
                    </p>
                    <Button
                      onClick={() => setActiveTab("overview")}
                      className="bg-gradient-to-r from-orange-500 to-red-500"
                    >
                      Voltar ao Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default Dashboard
