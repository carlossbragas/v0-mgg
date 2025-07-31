"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ArrowLeft, Search, Edit, Trash2, Filter } from "lucide-react"
import { Label } from "@/components/ui/label"
import { User, Tag } from "lucide-react"

interface ExpensesListProps {
  familyMembers: { id: string; name: string; email: string; role: string }[]
}

interface Expense {
  id: string
  value: number
  date: Date
  category: string
  payer: string
  notes?: string
  splitType: "equal" | "percentage" | "value"
  splitDetails: { memberId: string; amount: number; percentage?: number }[]
}

export default function ExpensesList({ familyMembers }: ExpensesListProps) {
  const [filterMember, setFilterMember] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock Data
  const mockExpenses: Expense[] = [
    {
      id: "exp1",
      value: 150.0,
      date: new Date("2025-07-28"),
      category: "Alimentação",
      payer: "user1",
      notes: "Jantar fora com a família",
      splitType: "equal",
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
      notes: "Gasolina do carro",
      splitType: "value",
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
      notes: "Conta de luz",
      splitType: "percentage",
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
      notes: "Cinema",
      splitType: "equal",
      splitDetails: [{ memberId: "user3", amount: 50.0 }],
    },
  ]

  const getMemberName = (id: string) => {
    return familyMembers.find((m) => m.id === id)?.name || "Desconhecido"
  }

  const filteredExpenses = mockExpenses.filter((expense) => {
    const matchesMember = filterMember === "all" || expense.splitDetails.some((d) => d.memberId === filterMember)
    const matchesCategory = filterCategory === "all" || expense.category === filterCategory
    const matchesSearch =
      searchTerm === "" ||
      expense.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getMemberName(expense.payer).toLowerCase().includes(searchTerm.toLowerCase())

    // Simple period filter (e.g., current month)
    const expenseMonth = expense.date.getMonth()
    const currentMonth = new Date().getMonth()
    const matchesPeriod = filterPeriod === "all" || (filterPeriod === "this-month" && expenseMonth === currentMonth)

    return matchesMember && matchesCategory && matchesPeriod && matchesSearch
  })

  const handleEdit = (expenseId: string) => {
    alert(`Editar despesa: ${expenseId}`)
    // Implement navigation to expense form with pre-filled data
  }

  const handleDelete = (expenseId: string) => {
    if (confirm(`Tem certeza que deseja excluir a despesa ${expenseId}?`)) {
      alert(`Despesa ${expenseId} excluída! (Mock)`)
      // Implement actual deletion logic
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="bg-[#007A33] text-white p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            className="text-white hover:bg-emerald-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Despesas</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Filters */}
        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label htmlFor="filter-member" className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4" /> Membro
                </Label>
                <Select value={filterMember} onValueChange={setFilterMember}>
                  <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                    <SelectValue placeholder="Todos os membros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {familyMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filter-category" className="flex items-center gap-2 mb-1">
                  <Tag className="h-4 w-4" /> Categoria
                </Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Alimentação">Alimentação</SelectItem>
                    <SelectItem value="Moradia">Moradia</SelectItem>
                    <SelectItem value="Transporte">Transporte</SelectItem>
                    <SelectItem value="Saúde">Saúde</SelectItem>
                    <SelectItem value="Educação">Educação</SelectItem>
                    <SelectItem value="Lazer">Lazer</SelectItem>
                    <SelectItem value="Contas">Contas</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filter-period" className="flex items-center gap-2 mb-1">
                  <Filter className="h-4 w-4" /> Período
                </Label>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                    <SelectValue placeholder="Todo o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo o período</SelectItem>
                    <SelectItem value="this-month">Este mês</SelectItem>
                    {/* Add more period options as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Label htmlFor="search-term" className="flex items-center gap-2 mb-1">
                  <Search className="h-4 w-4" /> Buscar
                </Label>
                <Input
                  id="search-term"
                  type="text"
                  placeholder="Buscar por descrição, categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-[#007A33] focus:ring-[#007A33] pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-[#007A33]">Data</TableHead>
                <TableHead className="text-[#007A33]">Valor</TableHead>
                <TableHead className="text-[#007A33]">Categoria</TableHead>
                <TableHead className="text-[#007A33]">Pago por</TableHead>
                <TableHead className="text-[#007A33]">Dividido com</TableHead>
                <TableHead className="text-[#007A33]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                    Nenhuma despesa encontrada com os filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{format(expense.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell className="font-semibold text-red-600">
                      R$ {expense.value.toFixed(2).replace(".", ",")}
                    </TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{getMemberName(expense.payer)}</TableCell>
                    <TableCell>
                      {expense.splitDetails.map((detail) => getMemberName(detail.memberId)).join(", ")}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(expense.id)}
                        className="text-blue-500 border-blue-500 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-500 border-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
