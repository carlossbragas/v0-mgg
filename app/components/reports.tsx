"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, PieChart, Calendar } from "lucide-react"

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

export function Reports() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("current-month")

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses") || "[]")
    setExpenses(savedExpenses)
  }, [])

  const filterExpensesByPeriod = (expenses: Expense[], period: string) => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)

      switch (period) {
        case "current-month":
          return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
        case "last-month":
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
          return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear
        case "current-year":
          return expenseDate.getFullYear() === currentYear
        default:
          return true
      }
    })
  }

  const filteredExpenses = filterExpensesByPeriod(expenses, selectedPeriod)

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const categoryTotals = filteredExpenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as { [key: string]: number },
  )

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "current-month":
        return "Mês Atual"
      case "last-month":
        return "Mês Passado"
      case "current-year":
        return "Ano Atual"
      default:
        return "Todos"
    }
  }

  const categoryColors = ["bg-retro-orange", "bg-retro-blue", "bg-retro-green", "bg-retro-purple", "bg-retro-pink"]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="retro-shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Relatórios Financeiros
              </CardTitle>
              <CardDescription className="text-sm">Análise detalhada dos gastos da família</CardDescription>
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-48 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Mês Atual</SelectItem>
                <SelectItem value="last-month">Mês Passado</SelectItem>
                <SelectItem value="current-year">Ano Atual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="retro-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
            <TrendingDown className="h-4 w-4 text-retro-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-retro-orange">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">{getPeriodLabel(selectedPeriod)}</p>
          </CardContent>
        </Card>

        <Card className="retro-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <Calendar className="h-4 w-4 text-retro-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-retro-blue">{filteredExpenses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Gastos registrados</p>
          </CardContent>
        </Card>

        <Card className="retro-shadow sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Gasto</CardTitle>
            <TrendingUp className="h-4 w-4 text-retro-green" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-retro-green">
              {formatCurrency(filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Por transação</p>
          </CardContent>
        </Card>
      </div>

      {/* Gastos por Categoria */}
      <Card className="retro-shadow">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Gastos por Categoria</CardTitle>
          <CardDescription className="text-sm">Top 5 categorias com maior gasto no período</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedCategories.length > 0 ? (
            sortedCategories.map(([category, amount], index) => {
              const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0
              return (
                <div key={category} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${categoryColors[index]}`} />
                      <span className="font-medium text-sm sm:text-base">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {percentage.toFixed(1)}%
                      </Badge>
                      <span className="font-bold text-sm sm:text-base">{formatCurrency(amount)}</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-muted-foreground">Nenhum gasto encontrado para o período selecionado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gastos Recentes */}
      {filteredExpenses.length > 0 && (
        <Card className="retro-shadow">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Últimos Gastos</CardTitle>
            <CardDescription className="text-sm">Gastos mais recentes do período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredExpenses.slice(0, 5).map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-medium text-sm sm:text-base truncate">{expense.description}</span>
                      <Badge variant="outline" className="text-xs w-fit">
                        {expense.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(expense.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span className="font-bold text-retro-orange text-sm sm:text-base">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
