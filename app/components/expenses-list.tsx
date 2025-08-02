"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Filter, Plus, Calendar, DollarSign, User, Tag, Trash2, Edit } from "lucide-react"

interface ExpensesListProps {
  onBack: () => void
  onAddExpense: () => void
}

export default function ExpensesList({ onBack, onAddExpense }: ExpensesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterMember, setFilterMember] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Mock data
  const expenses = [
    {
      id: 1,
      description: "Supermercado Extra",
      amount: 245.67,
      category: "Alimentação",
      member: "João Silva",
      date: "2024-01-15",
      notes: "Compras da semana",
    },
    {
      id: 2,
      description: "Posto Shell",
      amount: 120.0,
      category: "Transporte",
      member: "Maria Silva",
      date: "2024-01-14",
      notes: "Gasolina",
    },
    {
      id: 3,
      description: "Cinema Shopping",
      amount: 85.5,
      category: "Entretenimento",
      member: "Pedro Silva",
      date: "2024-01-13",
      notes: "Filme em família",
    },
    {
      id: 4,
      description: "Farmácia Drogasil",
      amount: 67.8,
      category: "Saúde",
      member: "Ana Silva",
      date: "2024-01-12",
      notes: "Medicamentos",
    },
    {
      id: 5,
      description: "Livraria Cultura",
      amount: 156.9,
      category: "Educação",
      member: "Pedro Silva",
      date: "2024-01-11",
      notes: "Material escolar",
    },
    {
      id: 6,
      description: "Restaurante Italiano",
      amount: 198.4,
      category: "Alimentação",
      member: "João Silva",
      date: "2024-01-10",
      notes: "Jantar de aniversário",
    },
  ]

  const categories = ["Alimentação", "Transporte", "Entretenimento", "Saúde", "Educação"]
  const members = ["João Silva", "Maria Silva", "Pedro Silva", "Ana Silva"]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Alimentação: "bg-green-100 text-green-800",
      Transporte: "bg-blue-100 text-blue-800",
      Entretenimento: "bg-purple-100 text-purple-800",
      Saúde: "bg-red-100 text-red-800",
      Educação: "bg-yellow-100 text-yellow-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  // Filtrar e ordenar despesas
  const filteredExpenses = expenses
    .filter((expense) => {
      const matchesSearch =
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.notes.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "all" || expense.category === filterCategory
      const matchesMember = filterMember === "all" || expense.member === filterMember
      return matchesSearch && matchesCategory && matchesMember
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "amount":
          return b.amount - a.amount
        case "description":
          return a.description.localeCompare(b.description)
        default:
          return 0
      }
    })

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-emerald-700">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Lista de Despesas</h1>
          <p className="text-gray-600">Visualize e gerencie todas as despesas da família</p>
        </div>
        <Button onClick={onAddExpense} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Despesa
        </Button>
      </div>

      {/* Filtros e Busca */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Filter className="w-5 h-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por descrição ou observações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-emerald-200 focus:border-emerald-500"
            />
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Categoria</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Membro</label>
              <Select value={filterMember} onValueChange={setFilterMember}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os membros</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Data (mais recente)</SelectItem>
                  <SelectItem value="amount">Valor (maior)</SelectItem>
                  <SelectItem value="description">Descrição (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resumo */}
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total de Despesas</p>
                <p className="text-xl font-bold text-emerald-700">{filteredExpenses.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-xl font-bold text-emerald-700">{formatCurrency(totalExpenses)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Médio</p>
                <p className="text-xl font-bold text-emerald-700">
                  {filteredExpenses.length > 0 ? formatCurrency(totalExpenses / filteredExpenses.length) : "R$ 0,00"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Despesas */}
      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma despesa encontrada</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterCategory !== "all" || filterMember !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Adicione sua primeira despesa para começar"}
              </p>
              <Button onClick={onAddExpense} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Despesa
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredExpenses.map((expense) => (
            <Card key={expense.id} className="border-2 border-emerald-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">{expense.description}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(expense.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {expense.member}
                          </div>
                        </div>
                        {expense.notes && <p className="text-sm text-gray-600 mt-2 italic">{expense.notes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">-{formatCurrency(expense.amount)}</p>
                        <Badge className={`mt-2 ${getCategoryColor(expense.category)}`}>
                          <Tag className="w-3 h-3 mr-1" />
                          {expense.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                  <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
