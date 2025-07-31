"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, TrendingUp, Users, Calendar } from "lucide-react"

interface ReportsProps {
  onBack: () => void
}

export default function Reports({ onBack }: ReportsProps) {
  // Mock data for charts
  const categoryData = [
    { name: "Alimentação", amount: 456.8, percentage: 37 },
    { name: "Transporte", amount: 289.5, percentage: 23 },
    { name: "Saúde", amount: 145.2, percentage: 12 },
    { name: "Lazer", name: "Lazer", amount: 132.9, percentage: 11 },
    { name: "Casa", amount: 210.1, percentage: 17 },
  ]

  const memberData = [
    { name: "João Silva", amount: 523.4, percentage: 42 },
    { name: "Maria Silva", amount: 398.2, percentage: 32 },
    { name: "Pedro Silva", amount: 201.1, percentage: 16 },
    { name: "Ana Silva", amount: 111.8, percentage: 10 },
  ]

  const monthlyData = [
    { month: "Nov", amount: 1156.3 },
    { month: "Dez", amount: 1289.5 },
    { month: "Jan", amount: 1234.5 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="bg-[#007A33] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-emerald-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Relatórios</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-700">
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-3 text-center">
              <TrendingUp className="w-6 h-6 text-[#007A33] mx-auto mb-1" />
              <p className="text-xs text-gray-600">Total Gasto</p>
              <p className="text-sm font-bold text-gray-800">R$ 1.234,50</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200">
            <CardContent className="p-3 text-center">
              <Users className="w-6 h-6 text-[#007A33] mx-auto mb-1" />
              <p className="text-xs text-gray-600">Membros</p>
              <p className="text-sm font-bold text-gray-800">4 ativos</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200">
            <CardContent className="p-3 text-center">
              <Calendar className="w-6 h-6 text-[#007A33] mx-auto mb-1" />
              <p className="text-xs text-gray-600">Período</p>
              <p className="text-sm font-bold text-gray-800">Janeiro</p>
            </CardContent>
          </Card>
        </div>

        {/* Gastos por Categoria */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categoryData.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm font-bold text-gray-800">R$ {category.amount.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#007A33] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-right">{category.percentage}% do total</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Gastos por Membro */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Gastos por Membro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {memberData.map((member, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{member.name}</span>
                  <span className="text-sm font-bold text-gray-800">R$ {member.amount.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${member.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-right">{member.percentage}% do total</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Evolução Mensal */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#007A33] rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">{month.month}/2024</span>
                  </div>
                  <span className="font-bold text-gray-800">R$ {month.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Exportar Relatório</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-[#007A33] hover:bg-[#005A26] text-white rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <Button
              variant="outline"
              className="w-full border-2 border-[#007A33] text-[#007A33] hover:bg-emerald-50 rounded-xl bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
