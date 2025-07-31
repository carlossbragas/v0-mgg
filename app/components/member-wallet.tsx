"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  Utensils,
  Car,
  Plus,
  Edit,
  Trash2,
  Repeat,
  DollarSign,
} from "lucide-react"

interface MemberWalletProps {
  onBack: () => void
}

export default function MemberWallet({ onBack }: MemberWalletProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "balance" | "recurring">("overview")
  const [showBalanceForm, setShowBalanceForm] = useState(false)
  const [showRecurringForm, setShowRecurringForm] = useState(false)

  // Form states
  const [balanceForm, setBalanceForm] = useState({
    amount: "",
    description: "",
    type: "income" as "income" | "expense",
  })

  const [recurringForm, setRecurringForm] = useState({
    description: "",
    amount: "",
    category: "",
    frequency: "monthly" as "daily" | "weekly" | "monthly" | "yearly",
    dayOfMonth: "1",
    dayOfWeek: "1",
    dayOfYear: new Date().toISOString().split("T")[0],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    isActive: true,
  })

  // Mock data for current user
  const userData = {
    name: "João Silva",
    balance: 850.3,
    monthlySpent: 523.4,
    role: "admin",
  }

  const personalExpenses = [
    {
      id: 1,
      description: "Supermercado Extra",
      amount: 156.8,
      category: "Alimentação",
      date: "2024-01-15",
      type: "expense",
    },
    {
      id: 2,
      description: "Gasolina Posto Shell",
      amount: 89.5,
      category: "Transporte",
      date: "2024-01-14",
      type: "expense",
    },
    {
      id: 3,
      description: "Salário depositado",
      amount: 3500.0,
      category: "Salário",
      date: "2024-01-13",
      type: "income",
    },
    { id: 4, description: "Farmácia Drogasil", amount: 45.2, category: "Saúde", date: "2024-01-12", type: "expense" },
    { id: 5, description: "Netflix", amount: 32.9, category: "Lazer", date: "2024-01-11", type: "expense" },
  ]

  // Mock recurring expenses
  const recurringExpenses = [
    {
      id: 1,
      description: "Aluguel",
      amount: 1200.0,
      category: "Casa",
      frequency: "monthly",
      dayOfMonth: 5,
      isActive: true,
      nextDate: "2024-02-05",
    },
    {
      id: 2,
      description: "Financiamento do Carro",
      amount: 450.0,
      category: "Transporte",
      frequency: "monthly",
      dayOfMonth: 10,
      isActive: true,
      nextDate: "2024-02-10",
    },
    {
      id: 3,
      description: "Condomínio",
      amount: 280.0,
      category: "Casa",
      frequency: "monthly",
      dayOfMonth: 15,
      isActive: true,
      nextDate: "2024-02-15",
    },
    {
      id: 4,
      description: "Academia",
      amount: 89.9,
      category: "Saúde",
      frequency: "monthly",
      dayOfMonth: 1,
      isActive: false,
      nextDate: "2024-02-01",
    },
  ]

  const categories = ["Alimentação", "Transporte", "Saúde", "Educação", "Lazer", "Casa", "Roupas", "Salário", "Outros"]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Alimentação":
        return <Utensils className="w-4 h-4 text-white" />
      case "Transporte":
        return <Car className="w-4 h-4 text-white" />
      case "Saúde":
        return <Plus className="w-4 h-4 text-white" />
      default:
        return <Wallet className="w-4 h-4 text-white" />
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "Diário"
      case "weekly":
        return "Semanal"
      case "monthly":
        return "Mensal"
      case "yearly":
        return "Anual"
      default:
        return frequency
    }
  }

  const handleBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock save balance
    console.log("Balance entry:", balanceForm)
    setBalanceForm({ amount: "", description: "", type: "income" })
    setShowBalanceForm(false)
  }

  const handleRecurringSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock save recurring expense
    console.log("Recurring expense:", recurringForm)
    setRecurringForm({
      description: "",
      amount: "",
      category: "",
      frequency: "monthly",
      dayOfMonth: "1",
      dayOfWeek: "1",
      dayOfYear: new Date().toISOString().split("T")[0],
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      isActive: true,
    })
    setShowRecurringForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="bg-[#007A33] text-white p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-emerald-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Minha Carteira</h1>
            <p className="text-emerald-100 text-sm">{userData.name}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-emerald-200">
        <div className="flex">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className={`flex-1 rounded-none ${
              activeTab === "overview" ? "bg-[#007A33] text-white" : "text-gray-600 hover:bg-emerald-50"
            }`}
          >
            <Wallet className="w-4 h-4 mr-2" />
            Visão Geral
          </Button>
          <Button
            variant={activeTab === "balance" ? "default" : "ghost"}
            onClick={() => setActiveTab("balance")}
            className={`flex-1 rounded-none ${
              activeTab === "balance" ? "bg-[#007A33] text-white" : "text-gray-600 hover:bg-emerald-50"
            }`}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Saldo
          </Button>
          <Button
            variant={activeTab === "recurring" ? "default" : "ghost"}
            onClick={() => setActiveTab("recurring")}
            className={`flex-1 rounded-none ${
              activeTab === "recurring" ? "bg-[#007A33] text-white" : "text-gray-600 hover:bg-emerald-50"
            }`}
          >
            <Repeat className="w-4 h-4 mr-2" />
            Recorrentes
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {activeTab === "overview" && (
          <>
            {/* Balance Card */}
            <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-500 to-[#007A33] text-white">
              <CardContent className="p-6 text-center">
                <Wallet className="w-12 h-12 mx-auto mb-3 opacity-80" />
                <p className="text-emerald-100 text-sm mb-1">Saldo Atual</p>
                <p className="text-3xl font-bold mb-2">R$ {userData.balance.toFixed(2)}</p>
                <p className="text-emerald-100 text-sm">
                  {userData.role === "admin" ? "Administrador" : "Membro"} da família
                </p>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-2 border-emerald-200">
                <CardContent className="p-4 text-center">
                  <TrendingDown className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Gasto do Mês</p>
                  <p className="text-lg font-bold text-gray-800">R$ {userData.monthlySpent.toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-emerald-200">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Economia</p>
                  <p className="text-lg font-bold text-gray-800">
                    R$ {(userData.balance - userData.monthlySpent).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Personal Expenses History */}
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Histórico Recente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {personalExpenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          expense.type === "income" ? "bg-green-500" : "bg-[#007A33]"
                        }`}
                      >
                        {expense.type === "income" ? (
                          <TrendingUp className="w-4 h-4 text-white" />
                        ) : (
                          getCategoryIcon(expense.category)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{expense.description}</p>
                        <p className="text-xs text-gray-600">
                          {expense.date} • {expense.category}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-bold text-lg ${expense.type === "income" ? "text-green-600" : "text-gray-800"}`}
                    >
                      {expense.type === "income" ? "+" : "-"}R$ {expense.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "balance" && (
          <>
            {/* Add Balance Button */}
            <Card className="border-2 border-emerald-200">
              <CardContent className="p-4">
                <Button
                  onClick={() => setShowBalanceForm(!showBalanceForm)}
                  className="w-full bg-[#007A33] hover:bg-[#005A26] text-white rounded-xl p-4 h-auto flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Adicionar Entrada/Saída</span>
                </Button>
              </CardContent>
            </Card>

            {/* Balance Form */}
            {showBalanceForm && (
              <Card className="border-2 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800">Nova Movimentação</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBalanceSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setBalanceForm({ ...balanceForm, type: "income" })}
                          className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                            balanceForm.type === "income"
                              ? "bg-green-500 text-white"
                              : "bg-white border-2 border-emerald-200 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                          Entrada
                        </button>
                        <button
                          type="button"
                          onClick={() => setBalanceForm({ ...balanceForm, type: "expense" })}
                          className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                            balanceForm.type === "expense"
                              ? "bg-red-500 text-white"
                              : "bg-white border-2 border-emerald-200 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          <TrendingDown className="w-4 h-4 mx-auto mb-1" />
                          Saída
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="balanceAmount">Valor (R$)</Label>
                      <Input
                        id="balanceAmount"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={balanceForm.amount}
                        onChange={(e) => setBalanceForm({ ...balanceForm, amount: e.target.value })}
                        className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33] text-lg font-semibold text-center"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="balanceDescription">Descrição</Label>
                      <Input
                        id="balanceDescription"
                        placeholder="Ex: Salário, Freelance, Transferência..."
                        value={balanceForm.description}
                        onChange={(e) => setBalanceForm({ ...balanceForm, description: e.target.value })}
                        className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 bg-[#007A33] hover:bg-[#005A26] text-white rounded-xl">
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowBalanceForm(false)}
                        className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl bg-transparent"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Balance History */}
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Histórico Completo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {personalExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          expense.type === "income" ? "bg-green-500" : "bg-[#007A33]"
                        }`}
                      >
                        {expense.type === "income" ? (
                          <TrendingUp className="w-4 h-4 text-white" />
                        ) : (
                          getCategoryIcon(expense.category)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{expense.description}</p>
                        <p className="text-xs text-gray-600">
                          {expense.date} • {expense.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${expense.type === "income" ? "text-green-600" : "text-gray-800"}`}
                      >
                        {expense.type === "income" ? "+" : "-"}R$ {expense.amount.toFixed(2)}
                      </p>
                      <div className="flex gap-1 mt-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-600">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "recurring" && (
          <>
            {/* Add Recurring Button */}
            <Card className="border-2 border-emerald-200">
              <CardContent className="p-4">
                <Button
                  onClick={() => setShowRecurringForm(!showRecurringForm)}
                  className="w-full bg-[#007A33] hover:bg-[#005A26] text-white rounded-xl p-4 h-auto flex items-center justify-center gap-2"
                >
                  <Repeat className="w-5 h-5" />
                  <span>Nova Despesa Recorrente</span>
                </Button>
              </CardContent>
            </Card>

            {/* Recurring Form */}
            {showRecurringForm && (
              <Card className="border-2 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800">Nova Despesa Recorrente</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRecurringSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recurringDescription">Descrição</Label>
                      <Input
                        id="recurringDescription"
                        placeholder="Ex: Aluguel, Financiamento, Condomínio..."
                        value={recurringForm.description}
                        onChange={(e) => setRecurringForm({ ...recurringForm, description: e.target.value })}
                        className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recurringAmount">Valor (R$)</Label>
                      <Input
                        id="recurringAmount"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={recurringForm.amount}
                        onChange={(e) => setRecurringForm({ ...recurringForm, amount: e.target.value })}
                        className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33] text-lg font-semibold text-center"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        value={recurringForm.category}
                        onValueChange={(value) => setRecurringForm({ ...recurringForm, category: value })}
                      >
                        <SelectTrigger className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Frequência</Label>
                      <Select
                        value={recurringForm.frequency}
                        onValueChange={(value: any) => setRecurringForm({ ...recurringForm, frequency: value })}
                      >
                        <SelectTrigger className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Diário</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                          <SelectItem value="yearly">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Conditional date fields based on frequency */}
                    {recurringForm.frequency === "monthly" && (
                      <div className="space-y-2">
                        <Label>Dia do Mês</Label>
                        <Select
                          value={recurringForm.dayOfMonth}
                          onValueChange={(value) => setRecurringForm({ ...recurringForm, dayOfMonth: value })}
                        >
                          <SelectTrigger className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                Dia {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {recurringForm.frequency === "weekly" && (
                      <div className="space-y-2">
                        <Label>Dia da Semana</Label>
                        <Select
                          value={recurringForm.dayOfWeek}
                          onValueChange={(value) => setRecurringForm({ ...recurringForm, dayOfWeek: value })}
                        >
                          <SelectTrigger className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Segunda-feira</SelectItem>
                            <SelectItem value="2">Terça-feira</SelectItem>
                            <SelectItem value="3">Quarta-feira</SelectItem>
                            <SelectItem value="4">Quinta-feira</SelectItem>
                            <SelectItem value="5">Sexta-feira</SelectItem>
                            <SelectItem value="6">Sábado</SelectItem>
                            <SelectItem value="0">Domingo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {recurringForm.frequency === "yearly" && (
                      <div className="space-y-2">
                        <Label htmlFor="recurringDayOfYear">Data Anual</Label>
                        <Input
                          id="recurringDayOfYear"
                          type="date"
                          value={recurringForm.dayOfYear}
                          onChange={(e) => setRecurringForm({ ...recurringForm, dayOfYear: e.target.value })}
                          className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="recurringStartDate">Data de Início</Label>
                        <Input
                          id="recurringStartDate"
                          type="date"
                          value={recurringForm.startDate}
                          onChange={(e) => setRecurringForm({ ...recurringForm, startDate: e.target.value })}
                          className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recurringEndDate">Data de Fim (opcional)</Label>
                        <Input
                          id="recurringEndDate"
                          type="date"
                          value={recurringForm.endDate}
                          onChange={(e) => setRecurringForm({ ...recurringForm, endDate: e.target.value })}
                          className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 bg-[#007A33] hover:bg-[#005A26] text-white rounded-xl">
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowRecurringForm(false)}
                        className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl bg-transparent"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Recurring Expenses List */}
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Despesas Recorrentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recurringExpenses.map((expense) => (
                  <div key={expense.id} className="p-3 bg-emerald-50 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-[#007A33] rounded-full flex items-center justify-center flex-shrink-0">
                          <Repeat className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800 text-sm">{expense.description}</h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                expense.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {expense.isActive ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            {expense.category} • {getFrequencyText(expense.frequency)}
                          </p>
                          <p className="text-xs text-gray-500">Próximo vencimento: {expense.nextDate}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="font-bold text-gray-800 text-lg">R$ {expense.amount.toFixed(2)}</p>
                        <div className="flex gap-1 mt-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
