"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Search, Filter } from "lucide-react"
import { toast } from "sonner"

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  notes: string
  member: string
  createdAt: string
}

interface ExpensesListProps {
  limit?: number
}

const categoryColors: { [key: string]: string } = {
  Alimentação: "bg-green-100 text-green-800",
  Transporte: "bg-blue-100 text-blue-800",
  Casa: "bg-purple-100 text-purple-800",
  Saúde: "bg-red-100 text-red-800",
  Educação: "bg-yellow-100 text-yellow-800",
  Lazer: "bg-pink-100 text-pink-800",
  Roupas: "bg-indigo-100 text-indigo-800",
  Tecnologia: "bg-gray-100 text-gray-800",
  Outros: "bg-orange-100 text-orange-800",
}

export function ExpensesList({ limit }: ExpensesListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Carregar gastos do localStorage
    const savedExpenses = JSON.parse(localStorage.getItem("expenses") || "[]")
    setExpenses(savedExpenses)
    setFilteredExpenses(limit ? savedExpenses.slice(0, limit) : savedExpenses)
  }, [limit])

  useEffect(() => {
    let filtered = expenses

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (expense) =>
          expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoria
    if (categoryFilter !== "all") {
      filtered = filtered.filter((expense) => expense.category === categoryFilter)
    }

    setFilteredExpenses(limit ? filtered.slice(0, limit) : filtered)
  }, [expenses, searchTerm, categoryFilter, limit])

  const handleDelete = (id: string) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id)
    setExpenses(updatedExpenses)
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses))
    toast.success("Gasto removido com sucesso!")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const categories = Array.from(new Set(expenses.map((expense) => expense.category)))

  if (filteredExpenses.length === 0) {
    return (
      <Card className="retro-shadow">
        <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
          <div className="text-4xl sm:text-6xl mb-4">💸</div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Nenhum gasto encontrado</h3>
          <p className="text-sm sm:text-base text-muted-foreground text-center">
            {searchTerm || categoryFilter !== "all"
              ? "Tente ajustar os filtros de busca"
              : "Comece registrando seu primeiro gasto!"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {!limit && (
        <Card className="retro-shadow">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl">Gastos da Família</CardTitle>
                <CardDescription className="text-sm">
                  {filteredExpenses.length} gasto{filteredExpenses.length !== 1 ? "s" : ""} encontrado
                  {filteredExpenses.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardHeader>

          {showFilters && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por descrição..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-11">
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
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <div className="space-y-3">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id} className="retro-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{expense.description}</h3>
                    <Badge className={`${categoryColors[expense.category] || categoryColors["Outros"]} text-xs w-fit`}>
                      {expense.category}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
                    <span>{formatDate(expense.date)}</span>
                    {expense.notes && <span className="truncate max-w-48 sm:max-w-none">{expense.notes}</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="font-bold text-lg sm:text-xl text-retro-orange">
                    {formatCurrency(expense.amount)}
                  </span>
                  {!limit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {limit && filteredExpenses.length >= limit && (
        <div className="text-center pt-4">
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            Ver todos os gastos
          </Button>
        </div>
      )}
    </div>
  )
}
