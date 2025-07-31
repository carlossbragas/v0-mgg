"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Wallet,
  Plus,
  TrendingUp,
  Settings,
  User,
  Receipt,
  BarChart3,
  ArrowLeft,
  Car,
  Utensils,
  CheckSquare,
  ShoppingCart,
} from "lucide-react"
import ExpenseForm from "./expense-form"
import ExpensesList from "./expenses-list"
import Reports from "./reports"
import MemberWallet from "./member-wallet"
import FamilySettings from "./family-settings"
import TasksList from "./tasks-list"
import ShoppingList from "./shopping-list"

interface DashboardProps {
  onBack: () => void
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "expense-form" | "expenses" | "reports" | "wallet" | "settings" | "tasks" | "shopping"
  >("dashboard")

  // Mock data
  const familyData = {
    name: "Família Silva",
    totalBalance: 2450.8,
    monthlySpent: 1234.5,
    members: [
      { name: "João Silva", balance: 850.3, role: "admin" },
      { name: "Maria Silva", balance: 650.2, role: "member" },
      { name: "Pedro Silva", balance: 450.1, role: "member" },
      { name: "Ana Silva", balance: 500.2, role: "member" },
    ],
  }

  const recentExpenses = [
    { id: 1, description: "Supermercado", amount: 156.8, category: "Alimentação", member: "Maria", date: "2024-01-15" },
    { id: 2, description: "Gasolina", amount: 89.5, category: "Transporte", member: "João", date: "2024-01-14" },
    { id: 3, description: "Farmácia", amount: 45.2, category: "Saúde", member: "Ana", date: "2024-01-13" },
  ]

  // Mock data for tasks and shopping
  const pendingTasks = [
    { id: 1, title: "Pagar conta de luz", assignedTo: "João Silva", dueDate: "2024-01-20" },
    { id: 2, title: "Comprar remédio da Ana", assignedTo: "Maria Silva", dueDate: "2024-01-18" },
  ]

  const shoppingItems = [
    { id: 1, item: "Leite", quantity: 2, category: "Laticínios" },
    { id: 2, item: "Pão", quantity: 1, category: "Padaria" },
    { id: 3, item: "Arroz", quantity: 1, category: "Grãos" },
  ]

  if (currentView === "expense-form") {
    return <ExpenseForm onBack={() => setCurrentView("dashboard")} onSave={() => setCurrentView("dashboard")} />
  }

  if (currentView === "expenses") {
    return <ExpensesList onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "reports") {
    return <Reports onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "wallet") {
    return <MemberWallet onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "settings") {
    return <FamilySettings onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "tasks") {
    return <TasksList onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "shopping") {
    return <ShoppingList onBack={() => setCurrentView("dashboard")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-[#007A33] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-emerald-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">{familyData.name}</h1>
              <p className="text-emerald-100 text-sm">{familyData.members.length} membros</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("settings")}
            className="text-white hover:bg-emerald-700"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-4 text-center">
              <Wallet className="w-8 h-8 text-[#007A33] mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Saldo Total</p>
              <p className="text-lg font-bold text-gray-800">R$ {familyData.totalBalance.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Gasto do Mês</p>
              <p className="text-lg font-bold text-gray-800">R$ {familyData.monthlySpent.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setCurrentView("expense-form")}
              className="bg-[#007A33] hover:bg-[#005A26] text-white rounded-xl p-4 h-auto flex-col gap-2"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm">Nova Despesa</span>
            </Button>

            <Button
              onClick={() => setCurrentView("expenses")}
              variant="outline"
              className="border-2 border-[#007A33] text-[#007A33] hover:bg-emerald-50 rounded-xl p-4 h-auto flex-col gap-2"
            >
              <Receipt className="w-6 h-6" />
              <span className="text-sm">Ver Despesas</span>
            </Button>

            <Button
              onClick={() => setCurrentView("reports")}
              variant="outline"
              className="border-2 border-[#007A33] text-[#007A33] hover:bg-emerald-50 rounded-xl p-4 h-auto flex-col gap-2"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">Relatórios</span>
            </Button>

            <Button
              onClick={() => setCurrentView("wallet")}
              variant="outline"
              className="border-2 border-[#007A33] text-[#007A33] hover:bg-emerald-50 rounded-xl p-4 h-auto flex-col gap-2"
            >
              <User className="w-6 h-6" />
              <span className="text-sm">Minha Carteira</span>
            </Button>
          </CardContent>
        </Card>

        {/* New: Tasks and Shopping Quick Access */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Organização Familiar</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setCurrentView("tasks")}
              variant="outline"
              className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 rounded-xl p-4 h-auto flex-col gap-2 bg-transparent"
            >
              <CheckSquare className="w-6 h-6" />
              <span className="text-sm">Tarefas</span>
              {pendingTasks.length > 0 && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {pendingTasks.length} pendentes
                </span>
              )}
            </Button>

            <Button
              onClick={() => setCurrentView("shopping")}
              variant="outline"
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-xl p-4 h-auto flex-col gap-2 bg-transparent"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-sm">Compras</span>
              {shoppingItems.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {shoppingItems.length} itens
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Despesas Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#007A33] rounded-full flex items-center justify-center">
                    {expense.category === "Alimentação" && <Utensils className="w-5 h-5 text-white" />}
                    {expense.category === "Transporte" && <Car className="w-5 h-5 text-white" />}
                    {expense.category === "Saúde" && <Plus className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{expense.description}</p>
                    <p className="text-xs text-gray-600">
                      {expense.member} • {expense.date}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-gray-800">R$ {expense.amount.toFixed(2)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Family Members */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Membros da Família</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {familyData.members.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#007A33] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.role === "admin" ? "Administrador" : "Membro"}</p>
                  </div>
                </div>
                <p className="font-bold text-gray-800">R$ {member.balance.toFixed(2)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
