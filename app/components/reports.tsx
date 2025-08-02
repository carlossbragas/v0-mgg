"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Filter,
  PieChartIcon,
  BarChart3,
  Target,
  Users,
} from "lucide-react"

interface ReportsProps {
  user: any
}

export function Reports({ user }: ReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Dados simulados para os gráficos
  const monthlyData = [
    { month: "Jan", income: 5200, expenses: 3800, savings: 1400 },
    { month: "Fev", income: 5200, expenses: 4100, savings: 1100 },
    { month: "Mar", income: 5200, expenses: 3600, savings: 1600 },
    { month: "Abr", income: 5200, expenses: 3900, savings: 1300 },
    { month: "Mai", income: 5200, expenses: 3750, savings: 1450 },
    { month: "Jun", income: 5200, expenses: 3850, savings: 1350 },
  ]

  const categoryData = [
    { name: "Alimentação", value: 1200, color: "#f59e0b" },
    { name: "Transporte", value: 800, color: "#ef4444" },
    { name: "Moradia", value: 1500, color: "#3b82f6" },
    { name: "Saúde", value: 400, color: "#10b981" },
    { name: "Educação", value: 600, color: "#8b5cf6" },
    { name: "Lazer", value: 350, color: "#f97316" },
  ]

  const memberExpenses = [
    { name: "João", amount: 2100, percentage: 45 },
    { name: "Maria", amount: 1800, percentage: 38 },
    { name: "Ana", amount: 500, percentage: 11 },
    { name: "Pedro", amount: 300, percentage: 6 },
  ]

  const budgetGoals = [
    { category: "Alimentação", budget: 1500, spent: 1200, percentage: 80 },
    { category: "Transporte", budget: 1000, spent: 800, percentage: 80 },
    { category: "Lazer", budget: 500, spent: 350, percentage: 70 },
    { category: "Saúde", budget: 600, spent: 400, percentage: 67 },
  ]

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = monthlyData.reduce((sum, item) => sum + item.expenses, 0)
  const totalSavings = monthlyData.reduce((sum, item) => sum + item.savings, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-amber-800 mb-2">Relatórios Financeiros</h2>
        <p className="text-amber-600">Análise detalhada das finanças familiares</p>
      </div>

      {/* Filters */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="food">Alimentação</SelectItem>
                  <SelectItem value="transport">Transporte</SelectItem>
                  <SelectItem value="housing">Moradia</SelectItem>
                  <SelectItem value="health">Saúde</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Mais Filtros
              </Button>
            </div>

            <Button className="bg-amber-600 hover:bg-amber-700">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-amber-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{formatCurrency(totalIncome)}</div>
              <p className="text-sm text-green-600">Receita Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-red-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">{formatCurrency(totalExpenses)}</div>
              <p className="text-sm text-red-600">Gastos Totais</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{formatCurrency(totalSavings)}</div>
              <p className="text-sm text-blue-600">Economia Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">
                {((totalSavings / totalIncome) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-purple-600">Taxa de Economia</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-amber-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-amber-200">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-amber-200">
            Categorias
          </TabsTrigger>
          <TabsTrigger value="members" className="data-[state=active]:bg-amber-200">
            Membros
          </TabsTrigger>
          <TabsTrigger value="budget" className="data-[state=active]:bg-amber-200">
            Orçamento
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-amber-600" />
                <span>Evolução Mensal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="income" fill="#10b981" name="Receita" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Gastos" />
                  <Bar dataKey="savings" fill="#3b82f6" name="Economia" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span>Tendência de Economia</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line type="monotone" dataKey="savings" stroke="#f59e0b" strokeWidth={3} name="Economia" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="w-5 h-5 text-amber-600" />
                  <span>Gastos por Categoria</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle>Detalhes por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                        <span className="font-medium text-amber-800">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-800">{formatCurrency(category.value)}</div>
                        <div className="text-xs text-amber-600">
                          {((category.value / categoryData.reduce((sum, c) => sum + c.value, 0)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-600" />
                <span>Gastos por Membro</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberExpenses.map((member) => (
                  <div key={member.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-amber-800">{member.name}</span>
                      <span className="font-bold text-amber-800">{formatCurrency(member.amount)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={member.percentage} className="flex-1 h-2" />
                      <span className="text-sm text-amber-600 w-12">{member.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-6">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-amber-600" />
                <span>Controle de Orçamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgetGoals.map((goal) => (
                  <div key={goal.category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-amber-800">{goal.category}</h4>
                      <div className="text-right">
                        <div className="font-bold text-amber-800">
                          {formatCurrency(goal.spent)} / {formatCurrency(goal.budget)}
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            goal.percentage > 90
                              ? "border-red-300 text-red-700"
                              : goal.percentage > 75
                                ? "border-yellow-300 text-yellow-700"
                                : "border-green-300 text-green-700"
                          }
                        >
                          {goal.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={goal.percentage}
                      className={`h-3 ${
                        goal.percentage > 90
                          ? "[&>div]:bg-red-500"
                          : goal.percentage > 75
                            ? "[&>div]:bg-yellow-500"
                            : "[&>div]:bg-green-500"
                      }`}
                    />
                    <div className="flex justify-between text-sm text-amber-600">
                      <span>Restante: {formatCurrency(goal.budget - goal.spent)}</span>
                      <span>{goal.percentage > 100 ? "Orçamento excedido" : "Dentro do orçamento"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Reports
