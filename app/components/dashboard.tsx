"use client"

import { useState } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, PieChart, Plus, List, BarChart, ListTodo, ShoppingCart, Lightbulb } from "lucide-react"
import ExpenseForm from "./expense-form"
import ExpensesList from "./expenses-list"
import Reports from "./reports"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface DashboardProps {
  family: {
    id: string
    name: string
    inviteCode: string
    members: { id: string; name: string; email: string; role: string }[]
  } | null
  currentUser: { id: string; name: string; email: string; role: string } | null
}

export default function Dashboard({ family, currentUser }: DashboardProps) {
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showExpensesList, setShowExpensesList] = useState(false)
  const [showReports, setShowReports] = useState(false)

  // Mock Data for Dashboard
  const totalBalance = 5200.75
  const monthSpend = 1250.3
  const categorySpend = [
    { name: "Alimentação", value: 450 },
    { name: "Transporte", value: 200 },
    { name: "Moradia", value: 300 },
    { name: "Lazer", value: 150 },
    { name: "Outros", value: 150.3 },
  ]

  const mockTasks = [
    { id: "t1", title: "Pagar conta de luz", status: "pending", dueDate: "2025-08-10" },
    { id: "t2", title: "Comprar presente da vovó", status: "pending", dueDate: "2025-08-15" },
  ]

  const mockShoppingItems = [
    { id: "s1", name: "Leite", status: "pending" },
    { id: "s2", name: "Pão", status: "pending" },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#007A33] mb-6">Dashboard da {family?.name || "Família"}</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 border-l-4 border-[#007A33]">
          <DollarSign className="h-8 w-8 text-[#007A33]" />
          <div>
            <CardTitle className="text-lg font-semibold text-gray-600">Saldo Total</CardTitle>
            <CardContent className="p-0 text-2xl font-bold text-[#007A33]">R$ {totalBalance.toFixed(2)}</CardContent>
          </div>
        </Card>
        <Card className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 border-l-4 border-red-500">
          <TrendingUp className="h-8 w-8 text-red-500" />
          <div>
            <CardTitle className="text-lg font-semibold text-gray-600">Gasto do Mês</CardTitle>
            <CardContent className="p-0 text-2xl font-bold text-red-500">R$ {monthSpend.toFixed(2)}</CardContent>
          </div>
        </Card>
        <Card className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 border-l-4 border-blue-500">
          <PieChart className="h-8 w-8 text-blue-500" />
          <div>
            <CardTitle className="text-lg font-semibold text-gray-600">Gráfico por Categoria</CardTitle>
            <CardContent className="p-0 text-2xl font-bold text-blue-500">
              {/* Placeholder for a small chart */}
              <div className="h-10 w-full bg-gray-100 rounded-md flex overflow-hidden">
                {categorySpend.map((cat, index, arr) => {
                  const total = arr.reduce((sum, c) => sum + c.value, 0)
                  const width = (cat.value / total) * 100 + "%"
                  const colors = ["bg-purple-500", "bg-yellow-500", "bg-green-500", "bg-orange-500", "bg-gray-400"]
                  return (
                    <div
                      key={cat.name}
                      className={`${colors[index % colors.length]} h-full`}
                      style={{ width }}
                      title={`${cat.name}: R$ ${cat.value}`}
                    />
                  )
                })}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white rounded-lg shadow-md p-6">
        <CardTitle className="text-xl font-semibold text-[#007A33] mb-4">Ações Rápidas</CardTitle>
        <CardContent className="p-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
            <DialogTrigger asChild>
              <Button className="w-full bg-[#007A33] hover:bg-[#005F28] text-white py-3 rounded-lg flex items-center justify-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Criar Despesa</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0">
              <ExpenseForm familyMembers={family?.members || []} onSave={() => setShowExpenseForm(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={showExpensesList} onOpenChange={setShowExpensesList}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gray-200 hover:bg-gray-300 text-[#007A33] py-3 rounded-lg flex items-center justify-center space-x-2">
                <List className="h-5 w-5" />
                <span>Ver Despesas</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0">
              <ExpensesList familyMembers={family?.members || []} />
            </DialogContent>
          </Dialog>

          <Dialog open={showReports} onOpenChange={setShowReports}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gray-200 hover:bg-gray-300 text-[#007A33] py-3 rounded-lg flex items-center justify-center space-x-2">
                <BarChart className="h-5 w-5" />
                <span>Ver Relatórios</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0">
              <Reports familyMembers={family?.members || []} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Organization Section */}
      <Card className="bg-white rounded-lg shadow-md p-6">
        <CardTitle className="text-xl font-semibold text-[#007A33] mb-4">Organização Familiar</CardTitle>
        <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-purple-50 border-l-4 border-purple-500 p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-700">Tarefas Pendentes</h3>
              <p className="text-2xl font-bold text-purple-900">
                {mockTasks.filter((t) => t.status === "pending").length}
              </p>
            </div>
            <ListTodo className="h-10 w-10 text-purple-500" />
          </Card>
          <Card className="bg-blue-50 border-l-4 border-blue-500 p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-700">Itens de Compra</h3>
              <p className="text-2xl font-bold text-blue-900">
                {mockShoppingItems.filter((s) => s.status === "pending").length}
              </p>
            </div>
            <ShoppingCart className="h-10 w-10 text-blue-500" />
          </Card>
          <Card className="bg-cyan-50 border-l-4 border-cyan-500 p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-cyan-700">Dispositivos IoT</h3>
              <p className="text-2xl font-bold text-cyan-900">3 Ativos</p>
            </div>
            <Lightbulb className="h-10 w-10 text-cyan-500" />
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
