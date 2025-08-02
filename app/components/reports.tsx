"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, PieChart, TrendingUp, TrendingDown, Calendar, Download, Filter } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

interface ReportsProps {
  onBack: () => void
}

export default function Reports({ onBack }: ReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [reportType, setReportType] = useState("expenses")

  // Mock data para relatórios
  const monthlyData = [
    { month: "Jan", expenses: 2800, income: 8500, budget: 3000 },
    { month: "Fev", expenses: 3200, income: 8500, budget: 3000 },
    { month: "Mar", expenses: 2600, income: 8500, budget: 3000 },
    { month: "Abr", expenses: 3400, income: 8500, budget: 3000 },
    { month: "Mai", expenses: 2900, income: 8500, budget: 3000 },
    { month: "Jun", expenses: 3100, income: 8500, budget: 3000 },
  ]

  const categoryData = [
    { name: "Alimentação", value: 1200, color: "#FF6B6B", percentage: 35 },
    { name: "Transporte", value: 800, color: "#4ECDC4", percentage: 23 },
    { name: "Entretenimento", value: 450, color: "#45B7D1", percentage: 13 },
    { name: "Educação", value: 600, color: "#96CEB4", percentage: 17 },
    { name: "Saúde", value: 350, color: "#FFEAA7", percentage: 10 },
    { name: "Outros", value: 100, color: "#DDA0DD", percentage: 3 },
  ]

  const memberData = [
    { name: "João Silva", expenses: 1800, income: 5000, savings: 1200 },
    { name: "Maria Silva", expenses: 1200, income: 3500, savings: 800 },
    { name: "Pedro Silva", expenses: 180, income: 200, savings: 50 },
    { name: "Ana Silva", expenses: 120, income: 150, savings: 25 },
  ]

  const dailyExpenses = [
    { day: "1", amount: 120 },
    { day: "2", amount: 80 },
    { day: "3", amount: 200 },
    { day: "4", amount: 150 },
    { day: "5", amount: 90 },
    { day: "6", amount: 300 },
    { day: "7", amount: 180 },
    { day: "8", amount: 220 },
    { day: "9", amount: 160 },
    { day: "10", amount: 140 },
    { day: "11", amount: 190 },
    { day: "12", amount: 250 },
    { day: "13", amount: 170 },
    { day: "14", amount: 130 },
    { day: "15", amount: 280 },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0)
  const totalIncome = memberData.reduce((sum, member) => sum + member.income, 0)
  const totalSavings = memberData.reduce((sum, member) => sum + member.savings, 0)
  const averageDaily = dailyExpenses.reduce((sum, day) => sum + day.amount, 0) / dailyExpenses.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-emerald-700">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Relatórios Financeiros</h1>
          <p className="text-gray-600">Análise detalhada das finanças da família</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      {/* Filtros */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Filter className="w-5 h-5" />
            Filtros do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Categoria</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  <SelectItem value="alimentacao">Alimentação</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="entretenimento">Entretenimento</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipo de Relatório</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expenses">Despesas</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="savings">Economia</SelectItem>
                  <SelectItem value="budget">Orçamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Despesas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                <p className="text-xs text-gray-500 mt-1">+12% vs mês anterior</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Receitas</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                <p className="text-xs text-gray-500 mt-1">Estável</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Economia Total</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalSavings)}</p>
                <p className="text-xs text-gray-500 mt-1">+8% vs mês anterior</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gasto Médio/Dia</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(averageDaily)}</p>
                <p className="text-xs text-gray-500 mt-1">Últimos 15 dias</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gastos por Categoria */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <PieChart className="w-5 h-5" />
              Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </RechartsPieChart>
            </ResponsiveContainer>

            {/* Legenda */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-sm text-gray-600">
                    {category.name}: {formatCurrency(category.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Evolução Mensal */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <BarChart3 className="w-5 h-5" />
              Evolução Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="budget" fill="#E8F5E8" name="Orçamento" />
                <Bar dataKey="expenses" fill="#FF6B6B" name="Gastos" />
                <Bar dataKey="income" fill="#4ECDC4" name="Receitas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gastos por Membro */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <BarChart3 className="w-5 h-5" />
            Análise por Membro da Família
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {memberData.map((member, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{member.name}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      Receita: {formatCurrency(member.income)}
                    </Badge>
                    <Badge variant="outline" className="text-red-700 border-red-300">
                      Gastos: {formatCurrency(member.expenses)}
                    </Badge>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      Economia: {formatCurrency(member.savings)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Taxa de Economia</p>
                    <p className="text-xl font-bold text-green-600">
                      {((member.savings / member.income) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">% dos Gastos Totais</p>
                    <p className="text-xl font-bold text-red-600">
                      {((member.expenses / totalExpenses) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Saldo Líquido</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(member.income - member.expenses)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendência Diária */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <TrendingUp className="w-5 h-5" />
            Tendência de Gastos Diários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#007A33"
                fill="#007A33"
                fillOpacity={0.3}
                name="Gastos Diários"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <TrendingUp className="w-5 h-5" />
            Insights e Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">✅ Pontos Positivos</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Economia mensal dentro da meta (25% da receita)</li>
                <li>• Gastos com educação bem distribuídos</li>
                <li>• Controle eficiente dos gastos com entretenimento</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Pontos de Atenção</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Gastos com alimentação acima da média (35%)</li>
                <li>• Aumento de 12% nos gastos vs mês anterior</li>
                <li>• Considere revisar o orçamento de transporte</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Recomendações</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Estabeleça um limite de R$ 1.000 para gastos com alimentação</li>
              <li>• Considere usar mais transporte público para reduzir custos</li>
              <li>• Mantenha o bom controle dos gastos com entretenimento</li>
              <li>• Continue incentivando a economia das crianças com as mesadas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
