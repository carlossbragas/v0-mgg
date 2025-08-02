"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Home,
  Users,
  DollarSign,
  ShoppingCart,
  CheckSquare,
  Settings,
  Plus,
  Wallet,
  BarChart3,
  PieChartIcon,
  Smartphone,
  Bell,
  CreditCard,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
} from "lucide-react"
import ExpenseForm from "./expense-form"
import ExpensesList from "./expenses-list"
import MemberWallet from "./member-wallet"
import ShoppingList from "./shopping-list"
import TasksList from "./tasks-list"
import Reports from "./reports"
import FamilySettings from "./family-settings"
import IoTControl from "./iot-control"
import WalletManager from "./wallet-manager"

interface DashboardProps {
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
}

export default function Dashboard({ familyData }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showBalances, setShowBalances] = useState(true)

  // Garantir que familyData sempre tenha valores válidos
  const safeData = {
    familyName: familyData?.familyName || "Minha Família",
    adminName: familyData?.adminName || "Usuário",
    members: familyData?.members || [{ name: "Usuário", role: "adult" as const, allowance: 0 }],
    budget: {
      monthly: familyData?.budget?.monthly || 3000,
      categories: familyData?.budget?.categories || [
        { name: "Alimentação", limit: 800 },
        { name: "Transporte", limit: 400 },
        { name: "Entretenimento", limit: 300 },
      ],
    },
  }

  // Mock data para demonstração
  const mockExpenses = [
    {
      id: 1,
      description: "Supermercado",
      amount: 150.0,
      category: "Alimentação",
      member: "João Silva",
      date: "2024-01-15",
    },
    { id: 2, description: "Gasolina", amount: 80.0, category: "Transporte", member: "Maria Silva", date: "2024-01-14" },
    {
      id: 3,
      description: "Cinema",
      amount: 45.0,
      category: "Entretenimento",
      member: "Pedro Silva",
      date: "2024-01-13",
    },
  ]

  const mockBalances = [
    { name: "João Silva", role: "adult", balance: 3253.7 },
    { name: "Maria Silva", role: "adult", balance: 1200.0 },
    { name: "Pedro Silva", role: "child", balance: 150.0 },
    { name: "Ana Silva", role: "child", balance: 75.0 },
  ]

  const expensesByCategory = [
    { name: "Alimentação", value: 450, color: "#FF6B6B" },
    { name: "Transporte", value: 320, color: "#4ECDC4" },
    { name: "Entretenimento", value: 180, color: "#45B7D1" },
    { name: "Educação", value: 250, color: "#96CEB4" },
    { name: "Saúde", value: 150, color: "#FFEAA7" },
  ]

  const monthlyExpenses = [
    { month: "Jan", expenses: 1200, budget: 1500 },
    { month: "Fev", expenses: 1350, budget: 1500 },
    { month: "Mar", expenses: 980, budget: 1500 },
    { month: "Abr", expenses: 1450, budget: 1500 },
    { month: "Mai", expenses: 1100, budget: 1500 },
    { month: "Jun", expenses: 1300, budget: 1500 },
  ]

  const totalBalance = mockBalances.reduce((sum, member) => sum + member.balance, 0)
  const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const budgetUsed = (totalExpenses / safeData.budget.monthly) * 100

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "expenses":
        return <ExpenseForm familyData={safeData} onBack={() => setActiveTab("overview")} />
      case "list":
        return <ExpensesList onBack={() => setActiveTab("overview")} onAddExpense={() => setActiveTab("expenses")} />
      case "wallet":
        return <MemberWallet familyData={safeData} onBack={() => setActiveTab("overview")} />
      case "shopping":
        return <ShoppingList onBack={() => setActiveTab("overview")} />
      case "tasks":
        return <TasksList onBack={() => setActiveTab("overview")} />
      case "reports":
        return <Reports onBack={() => setActiveTab("overview")} />
      case "settings":
        return <FamilySettings familyData={safeData} onBack={() => setActiveTab("overview")} />
      case "iot":
        return <IoTControl onBack={() => setActiveTab("overview")} />
      case "wallet-manager":
        return <WalletManager onBack={() => setActiveTab("overview")} />
      default:
        return (
          <div className="space-y-6">
            {/* Header com saudação */}
            <div className="bg-gradient-to-r from-[#007A33] to-emerald-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Olá, {safeData.adminName}! 👋</h1>
                  <p className="text-emerald-100">Bem-vindo ao painel da família {safeData.familyName}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-100 text-sm">Saldo Total da Família</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold">{showBalances ? formatCurrency(totalBalance) : "••••••"}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowBalances(!showBalances)}
                      className="text-white hover:bg-emerald-700"
                    >
                      {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-2 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Gastos do Mês</p>
                      <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalExpenses)}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <ArrowDownRight className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Orçamento Usado</p>
                      <p className="text-2xl font-bold text-gray-800">{budgetUsed.toFixed(1)}%</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Target className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Membros Ativos</p>
                      <p className="text-2xl font-bold text-gray-800">{safeData.members.length}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Economia</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(safeData.budget.monthly - totalExpenses)}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <ArrowUpRight className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Saldos dos Membros */}
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Saldos dos Membros
                  </CardTitle>
                  <Button
                    onClick={() => setActiveTab("wallet-manager")}
                    className="bg-[#007A33] hover:bg-[#005A26] text-white"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Gerenciar Carteiras
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockBalances.map((member, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{member.name}</h3>
                          <Badge variant={member.role === "adult" ? "default" : "secondary"}>
                            {member.role === "adult" ? "Adulto" : "Criança"}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#007A33]">
                            {showBalances ? formatCurrency(member.balance) : "••••••"}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab("wallet-manager")}
                            className="text-[#007A33] hover:bg-emerald-100"
                          >
                            Gerenciar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Gastos por Categoria */}
              <Card className="border-2 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" />
                    Gastos por Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Gastos Mensais */}
              <Card className="border-2 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Gastos vs Orçamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyExpenses}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="budget" fill="#E8F5E8" name="Orçamento" />
                      <Bar dataKey="expenses" fill="#007A33" name="Gastos" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas */}
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => setActiveTab("expenses")}
                    className="h-20 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
                  >
                    <Plus className="w-6 h-6 mb-2" />
                    Nova Despesa
                  </Button>

                  <Button
                    onClick={() => setActiveTab("wallet-manager")}
                    className="h-20 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <Wallet className="w-6 h-6 mb-2" />
                    Gerenciar Carteiras
                  </Button>

                  <Button
                    onClick={() => setActiveTab("shopping")}
                    className="h-20 flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                  >
                    <ShoppingCart className="w-6 h-6 mb-2" />
                    Lista de Compras
                  </Button>

                  <Button
                    onClick={() => setActiveTab("iot")}
                    className="h-20 flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    <Smartphone className="w-6 h-6 mb-2" />
                    Controle IoT
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Últimas Transações */}
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-800">Últimas Transações</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("list")}
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    Ver Todas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockExpenses.slice(0, 3).map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-800">{expense.description}</h3>
                        <p className="text-sm text-gray-600">
                          {expense.member} • {expense.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">-{formatCurrency(expense.amount)}</p>
                        <p className="text-xs text-gray-500">{expense.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Navigation */}
      <div className="bg-[#007A33] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="w-6 h-6" />
            <h1 className="text-xl font-bold">MinhaGrana</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-700">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-700">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-emerald-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
            >
              <Home className="w-4 h-4" />
              Início
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
            >
              <Plus className="w-4 h-4" />
              Despesas
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
            >
              <DollarSign className="w-4 h-4" />
              Lista
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
            >
              <CreditCard className="w-4 h-4" />
              Carteiras
            </TabsTrigger>
            <TabsTrigger
              value="shopping"
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
            >
              <ShoppingCart className="w-4 h-4" />
              Compras
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
            >
              <CheckSquare className="w-4 h-4" />
              Tarefas
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
            >
              <BarChart3 className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="p-4">{renderContent()}</div>
    </div>
  )
}
