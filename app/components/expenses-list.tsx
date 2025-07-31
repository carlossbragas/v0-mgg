"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Edit, Trash2, Utensils, Car, Plus } from "lucide-react"

interface ExpensesListProps {
  onBack: () => void
}

export default function ExpensesList({ onBack }: ExpensesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterMember, setFilterMember] = useState("all")

  // Mock data
  const expenses = [
    {
      id: 1,
      description: "Supermercado Extra",
      amount: 156.8,
      category: "Alimentação",
      member: "Maria Silva",
      date: "2024-01-15",
      notes: "Compras da semana",
    },
    {
      id: 2,
      description: "Gasolina Posto Shell",
      amount: 89.5,
      category: "Transporte",
      member: "João Silva",
      date: "2024-01-14",
      notes: "",
    },
    {
      id: 3,
      description: "Farmácia Drogasil",
      amount: 45.2,
      category: "Saúde",
      member: "Ana Silva",
      date: "2024-01-13",
      notes: "Remédios",
    },
    {
      id: 4,
      description: "Netflix",
      amount: 32.9,
      category: "Lazer",
      member: "Pedro Silva",
      date: "2024-01-12",
      notes: "Assinatura mensal",
    },
    {
      id: 5,
      description: "Padaria",
      amount: 18.5,
      category: "Alimentação",
      member: "Maria Silva",
      date: "2024-01-11",
      notes: "Pães e leite",
    },
  ]

  const categories = ["all", "Alimentação", "Transporte", "Saúde", "Lazer", "Casa", "Outros"]
  const members = ["all", "João Silva", "Maria Silva", "Pedro Silva", "Ana Silva"]

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || expense.category === filterCategory
    const matchesMember = filterMember === "all" || expense.member === filterMember
    return matchesSearch && matchesCategory && matchesMember
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Alimentação":
        return <Utensils className="w-5 h-5 text-white" />
      case "Transporte":
        return <Car className="w-5 h-5 text-white" />
      case "Saúde":
        return <Plus className="w-5 h-5 text-white" />
      default:
        return <div className="w-5 h-5 bg-white rounded-full" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="bg-[#007A33] text-white p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-emerald-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Despesas</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search and Filters */}
        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar despesas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="rounded-xl border-2 border-emerald-200">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "Todas as categorias" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterMember} onValueChange={setFilterMember}>
                <SelectTrigger className="rounded-xl border-2 border-emerald-200">
                  <SelectValue placeholder="Membro" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member} value={member}>
                      {member === "all" ? "Todos os membros" : member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <div className="space-y-3">
          {filteredExpenses.map((expense) => (
            <Card key={expense.id} className="border-2 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-[#007A33] rounded-full flex items-center justify-center flex-shrink-0">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm">{expense.description}</h3>
                      <p className="text-xs text-gray-600 mt-1">{expense.member}</p>
                      <p className="text-xs text-gray-500">
                        {expense.date} • {expense.category}
                      </p>
                      {expense.notes && <p className="text-xs text-gray-600 mt-1 italic">{expense.notes}</p>}
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
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExpenses.length === 0 && (
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Nenhuma despesa encontrada</p>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card className="border-2 border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">Total das despesas:</span>
              <span className="font-bold text-xl text-[#007A33]">
                R$ {filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
