"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Download, CalendarIcon } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart as RechartsPieChart } from "recharts"
import { format } from "date-fns"

interface ReportsProps {
  familyMembers: { id: string; name: string; email: string; role: string }[]
}

export default function Reports({ familyMembers }: ReportsProps) {
  const [reportType, setReportType] = useState("category") // 'category', 'member', 'month'
  const [selectedYear, setSelectedYear] = useState("2025")

  // Mock Data for Reports
  const mockExpenses = [
    {
      id: "exp1",
      value: 150.0,
      date: new Date("2025-07-28"),
      category: "Alimentação",
      payer: "user1",
      splitDetails: [
        { memberId: "user1", amount: 50.0 },
        { memberId: "user2", amount: 50.0 },
        { memberId: "user3", amount: 50.0 },
      ],
    },
    {
      id: "exp2",
      value: 80.5,
      date: new Date("2025-07-25"),
      category: "Transporte",
      payer: "user2",
      splitDetails: [
        { memberId: "user2", amount: 40.5 },
        { memberId: "user1", amount: 40.0 },
      ],
    },
    {
      id: "exp3",
      value: 300.0,
      date: new Date("2025-07-20"),
      category: "Moradia",
      payer: "user1",
      splitDetails: [
        { memberId: "user1", amount: 150.0, percentage: 50 },
        { memberId: "user2", amount: 90.0, percentage: 30 },
        { memberId: "user3", amount: 60.0, percentage: 20 },
      ],
    },
    {
      id: "exp4",
      value: 50.0,
      date: new Date("2025-07-18"),
      category: "Lazer",
      payer: "user3",
      splitDetails: [{ memberId: "user3", amount: 50.0 }],
    },
    {
      id: "exp5",
      value: 70.0,
      date: new Date("2025-06-10"),
      category: "Alimentação",
      payer: "user1",
      splitDetails: [
        { memberId: "user1", amount: 35.0 },
        { memberId: "user2", amount: 35.0 },
      ],
    },
    {
      id: "exp6",
      value: 120.0,
      date: new Date("2025-06-05"),
      category: "Educação",
      payer: "user2",
      splitDetails: [{ memberId: "user2", amount: 120.0 }],
    },
  ]

  const getMemberName = (id: string) => {
    return familyMembers.find((m) => m.id === id)?.name || "Desconhecido"
  }

  const processDataForChart = () => {
    const data: { name: string; value: number; fill: string }[] = []
    const colors = ["#007A33", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]

    const expensesInSelectedYear = mockExpenses.filter((exp) => exp.date.getFullYear().toString() === selectedYear)

    if (reportType === "category") {
      const categoryMap: { [key: string]: number } = {}
      expensesInSelectedYear.forEach((exp) => {
        exp.splitDetails.forEach((detail) => {
          categoryMap[exp.category] = (categoryMap[exp.category] || 0) + detail.amount
        })
      })
      Object.entries(categoryMap).forEach(([categoryName, total], index) => {
        data.push({
          name: categoryName,
          value: Number.parseFloat(total.toFixed(2)),
          fill: colors[index % colors.length],
        })
      })
    } else if (reportType === "member") {
      const memberMap: { [key: string]: number } = {}
      expensesInSelectedYear.forEach((exp) => {
        exp.splitDetails.forEach((detail) => {
          const memberName = getMemberName(detail.memberId)
          memberMap[memberName] = (memberMap[memberName] || 0) + detail.amount
        })
      })
      Object.entries(memberMap).forEach(([memberName, total], index) => {
        data.push({
          name: memberName,
          value: Number.parseFloat(total.toFixed(2)),
          fill: colors[index % colors.length],
        })
      })
    } else if (reportType === "month") {
      const monthMap: { [key: string]: number } = {}
      expensesInSelectedYear.forEach((exp) => {
        const monthName = format(exp.date, "MMM/yyyy")
        exp.splitDetails.forEach((detail) => {
          monthMap[monthName] = (monthMap[monthName] || 0) + detail.amount
        })
      })
      // Sort by month
      const sortedMonths = Object.keys(monthMap).sort((a, b) => {
        const [monthA, yearA] = a.split("/")
        const [monthB, yearB] = b.split("/")
        const dateA = new Date(`${monthA} 1, ${yearA}`)
        const dateB = new Date(`${monthB} 1, ${yearB}`)
        return dateA.getTime() - dateB.getTime()
      })
      sortedMonths.forEach((monthName, index) => {
        data.push({
          name: monthName,
          value: Number.parseFloat(monthMap[monthName].toFixed(2)),
          fill: colors[index % colors.length],
        })
      })
    }
    return data
  }

  const chartData = processDataForChart()

  const handleExport = (formatType: "pdf" | "excel") => {
    alert(`Exportando relatório em ${formatType.toUpperCase()} (Mock)`)
    // Implement actual export logic here
  }

  const years = ["2024", "2025", "2026"] // Mock years

  return (
    <Card className="w-full bg-white text-[#007A33] rounded-lg shadow-lg">
      <CardHeader className="text-center border-b pb-4">
        <CardTitle className="text-2xl font-bold">Relatórios</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Report Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="report-type" className="flex items-center gap-2 mb-1">
              <BarChart className="h-4 w-4" /> Tipo de Relatório
            </label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Por Categoria</SelectItem>
                <SelectItem value="member">Por Membro</SelectItem>
                <SelectItem value="month">Por Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="select-year" className="flex items-center gap-2 mb-1">
              <CalendarIcon className="h-4 w-4" /> Ano
            </label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleExport("pdf")}
              className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Exportar PDF
            </Button>
            <Button
              onClick={() => handleExport("excel")}
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Exportar Excel
            </Button>
          </div>
        </div>

        {/* Chart Display */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Gráfico de Despesas -{" "}
            {reportType === "category" ? "Por Categoria" : reportType === "member" ? "Por Membro" : "Por Mês"}
          </h3>
          {chartData.length > 0 ? (
            <ChartContainer
              config={{
                value: {
                  label: "Valor (R$)",
                  color: "#007A33",
                },
              }}
              className="min-h-[300px] w-full"
            >
              <RechartsPieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  fill="#8884d8"
                  label
                />
              </RechartsPieChart>
            </ChartContainer>
          ) : (
            <div className="text-center text-gray-500 py-10">
              Nenhum dado disponível para o relatório selecionado no ano {selectedYear}.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
