"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Trash2, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"

interface MemberWalletProps {
  currentUser: { id: string; name: string; email: string; role: string } | null
}

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  date: Date
}

interface RecurringExpense {
  id: string
  description: string
  amount: number
  category: string
  frequency: "daily" | "weekly" | "monthly" | "annually"
  dayOfMonth?: number // For monthly
  dayOfWeek?: number // For weekly (0=Sunday, 6=Saturday)
  monthOfYear?: number // For annually (0=Jan, 11=Dec)
  dayOfYear?: number // For annually (1-366)
  startDate: Date
  endDate?: Date
  isActive: boolean
}

export default function MemberWallet({ currentUser }: MemberWalletProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [balance, setBalance] = useState(1500.0) // Mock initial balance
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "t1", type: "income", amount: 2000, description: "Salário", date: new Date("2025-07-01") },
    { id: "t2", type: "expense", amount: 450, description: "Aluguel", date: new Date("2025-07-05") },
    { id: "t3", type: "expense", amount: 120, description: "Supermercado", date: new Date("2025-07-10") },
  ])
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([
    {
      id: "rec1",
      description: "Aluguel",
      amount: 1500,
      category: "Moradia",
      frequency: "monthly",
      dayOfMonth: 5,
      startDate: new Date("2025-01-01"),
      isActive: true,
    },
    {
      id: "rec2",
      description: "Assinatura Streaming",
      amount: 35,
      category: "Lazer",
      frequency: "monthly",
      dayOfMonth: 15,
      startDate: new Date("2025-03-01"),
      isActive: true,
    },
    {
      id: "rec3",
      description: "Seguro Carro",
      amount: 1200,
      category: "Transporte",
      frequency: "annually",
      monthOfYear: 8, // September (0-indexed)
      dayOfYear: 1, // Day of month
      startDate: new Date("2025-09-01"),
      isActive: true,
    },
  ])

  // State for new transaction form
  const [newTransactionType, setNewTransactionType] = useState<"income" | "expense">("expense")
  const [newTransactionAmount, setNewTransactionAmount] = useState("")
  const [newTransactionDescription, setNewTransactionDescription] = useState("")
  const [newTransactionDate, setNewTransactionDate] = useState<Date | undefined>(new Date())

  // State for new recurring expense form
  const [newRecDescription, setNewRecDescription] = useState("")
  const [newRecAmount, setNewRecAmount] = useState("")
  const [newRecCategory, setNewRecCategory] = useState("")
  const [newRecFrequency, setNewRecFrequency] = useState<"daily" | "weekly" | "monthly" | "annually" | "">("")
  const [newRecDayOfMonth, setNewRecDayOfMonth] = useState<number | undefined>(undefined)
  const [newRecDayOfWeek, setNewRecDayOfWeek] = useState<number | undefined>(undefined)
  const [newRecMonthOfYear, setNewRecMonthOfYear] = useState<number | undefined>(undefined)
  const [newRecDayOfYear, setNewRecDayOfYear] = useState<number | undefined>(undefined)
  const [newRecStartDate, setNewRecStartDate] = useState<Date | undefined>(new Date())
  const [newRecEndDate, setNewRecEndDate] = useState<Date | undefined>(undefined)

  const categories = ["Alimentação", "Moradia", "Transporte", "Saúde", "Educação", "Lazer", "Contas", "Outros"]

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(newTransactionAmount.replace(",", "."))
    if (isNaN(amount) || !newTransactionDescription || !newTransactionDate) {
      alert("Preencha todos os campos da transação.")
      return
    }

    const newTransaction: Transaction = {
      id: `t${transactions.length + 1}`,
      type: newTransactionType,
      amount: amount,
      description: newTransactionDescription,
      date: newTransactionDate,
    }

    setTransactions((prev) => [...prev, newTransaction])
    setBalance((prev) => (newTransactionType === "income" ? prev + amount : prev - amount))
    setNewTransactionAmount("")
    setNewTransactionDescription("")
    setNewTransactionDate(new Date())
    alert("Transação adicionada com sucesso!")
  }

  const handleDeleteTransaction = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      const transactionToDelete = transactions.find((t) => t.id === id)
      if (transactionToDelete) {
        setTransactions((prev) => prev.filter((t) => t.id !== id))
        setBalance((prev) =>
          transactionToDelete.type === "income" ? prev - transactionToDelete.amount : prev + transactionToDelete.amount,
        )
        alert("Transação excluída!")
      }
    }
  }

  const handleAddRecurringExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(newRecAmount.replace(",", "."))
    if (isNaN(amount) || !newRecDescription || !newRecCategory || !newRecFrequency || !newRecStartDate) {
      alert("Preencha todos os campos obrigatórios da despesa recorrente.")
      return
    }

    const newRecurring: RecurringExpense = {
      id: `rec${recurringExpenses.length + 1}`,
      description: newRecDescription,
      amount: amount,
      category: newRecCategory,
      frequency: newRecFrequency as any,
      startDate: newRecStartDate,
      endDate: newRecEndDate,
      isActive: true,
    }

    if (newRecFrequency === "monthly") newRecurring.dayOfMonth = newRecDayOfMonth
    if (newRecFrequency === "weekly") newRecurring.dayOfWeek = newRecDayOfWeek
    if (newRecFrequency === "annually") {
      newRecurring.monthOfYear = newRecMonthOfYear
      newRecurring.dayOfYear = newRecDayOfYear
    }

    setRecurringExpenses((prev) => [...prev, newRecurring])
    setNewRecDescription("")
    setNewRecAmount("")
    setNewRecCategory("")
    setNewRecFrequency("")
    setNewRecDayOfMonth(undefined)
    setNewRecDayOfWeek(undefined)
    setNewRecMonthOfYear(undefined)
    setNewRecDayOfYear(undefined)
    setNewRecStartDate(new Date())
    setNewRecEndDate(undefined)
    alert("Despesa recorrente adicionada com sucesso!")
  }

  const handleToggleRecurringStatus = (id: string) => {
    setRecurringExpenses((prev) => prev.map((rec) => (rec.id === id ? { ...rec, isActive: !rec.isActive } : rec)))
  }

  const handleDeleteRecurring = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta despesa recorrente?")) {
      setRecurringExpenses((prev) => prev.filter((rec) => rec.id !== id))
      alert("Despesa recorrente excluída!")
    }
  }

  const getNextOccurrence = (rec: RecurringExpense): Date | null => {
    const now = new Date()
    const nextDate = new Date(rec.startDate)

    if (rec.endDate && nextDate > rec.endDate) return null

    while (nextDate < now) {
      if (rec.frequency === "daily") {
        nextDate.setDate(nextDate.getDate() + 1)
      } else if (rec.frequency === "weekly") {
        nextDate.setDate(nextDate.getDate() + 7)
      } else if (rec.frequency === "monthly") {
        nextDate.setMonth(nextDate.getMonth() + 1)
        if (rec.dayOfMonth) {
          nextDate.setDate(Math.min(rec.dayOfMonth, daysInMonth(nextDate.getFullYear(), nextDate.getMonth())))
        }
      } else if (rec.frequency === "annually") {
        nextDate.setFullYear(nextDate.getFullYear() + 1)
        if (rec.monthOfYear !== undefined && rec.dayOfYear !== undefined) {
          nextDate.setMonth(rec.monthOfYear)
          nextDate.setDate(rec.dayOfYear)
        }
      }
      if (rec.endDate && nextDate > rec.endDate) return null
    }
    return nextDate
  }

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()

  return (
    <Card className="w-full bg-white text-[#007A33] rounded-lg shadow-lg">
      <CardHeader className="text-center border-b pb-4">
        <CardTitle className="text-2xl font-bold">Carteira de {currentUser?.name || "Membro"}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-200 rounded-lg p-1 mb-4">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2"
            >
              Saldo
            </TabsTrigger>
            <TabsTrigger
              value="recurring"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2"
            >
              Recorrentes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-green-50 border-l-4 border-[#007A33] p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#007A33]">Saldo Atual</h3>
                <p className="text-3xl font-bold text-[#007A33]">R$ {balance.toFixed(2).replace(".", ",")}</p>
              </div>
              <DollarSign className="h-12 w-12 text-[#007A33]" />
            </Card>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Últimas Transações</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-600">
                    <th className="py-2 px-4 rounded-tl-lg">Data</th>
                    <th className="py-2 px-4">Descrição</th>
                    <th className="py-2 px-4 text-right rounded-tr-lg">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 5)
                    .map((t) => (
                      <tr key={t.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-2 px-4 text-gray-800">{format(t.date, "dd/MM/yyyy")}</td>
                        <td className="py-2 px-4 text-gray-800">{t.description}</td>
                        <td
                          className={`py-2 px-4 text-right font-semibold ${
                            t.type === "income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"} R$ {t.amount.toFixed(2).replace(".", ",")}
                        </td>
                      </tr>
                    ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-gray-500">
                        Nenhuma transação registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Adicionar Movimentação</h3>
            <form onSubmit={handleAddTransaction} className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trans-type" className="flex items-center gap-2 mb-1">
                    Tipo
                  </Label>
                  <Select
                    value={newTransactionType}
                    onValueChange={(value: "income" | "expense") => setNewTransactionType(value)}
                  >
                    <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Entrada</SelectItem>
                      <SelectItem value="expense">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="trans-amount" className="flex items-center gap-2 mb-1">
                    Valor
                  </Label>
                  <Input
                    id="trans-amount"
                    type="text"
                    placeholder="R$ 0,00"
                    value={newTransactionAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9,.]/g, "")
                      setNewTransactionAmount(val)
                    }}
                    required
                    className="border-[#007A33] focus:ring-[#007A33]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="trans-description" className="flex items-center gap-2 mb-1">
                  Descrição
                </Label>
                <Input
                  id="trans-description"
                  type="text"
                  placeholder="Ex: Salário, Aluguel, Supermercado"
                  value={newTransactionDescription}
                  onChange={(e) => setNewTransactionDescription(e.target.value)}
                  required
                  className="border-[#007A33] focus:ring-[#007A33]"
                />
              </div>
              <div>
                <Label htmlFor="trans-date" className="flex items-center gap-2 mb-1">
                  Data
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !newTransactionDate && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTransactionDate ? format(newTransactionDate, "PPP") : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTransactionDate}
                      onSelect={setNewTransactionDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit" className="w-full bg-[#007A33] hover:bg-[#005F28] text-white">
                Adicionar Movimentação
              </Button>
            </form>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Histórico de Movimentações</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-600">
                    <th className="py-2 px-4 rounded-tl-lg">Data</th>
                    <th className="py-2 px-4">Descrição</th>
                    <th className="py-2 px-4 text-right">Valor</th>
                    <th className="py-2 px-4 text-center rounded-tr-lg">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map((t) => (
                      <tr key={t.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-2 px-4 text-gray-800">{format(t.date, "dd/MM/yyyy")}</td>
                        <td className="py-2 px-4 text-gray-800">{t.description}</td>
                        <td
                          className={`py-2 px-4 text-right font-semibold ${
                            t.type === "income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"} R$ {t.amount.toFixed(2).replace(".", ",")}
                        </td>
                        <td className="py-2 px-4 text-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteTransaction(t.id)}
                            className="text-red-500 border-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-500">
                        Nenhuma movimentação registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="recurring" className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Adicionar Despesa Recorrente</h3>
            <form onSubmit={handleAddRecurringExpense} className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div>
                <Label htmlFor="rec-description" className="flex items-center gap-2 mb-1">
                  Descrição
                </Label>
                <Input
                  id="rec-description"
                  type="text"
                  placeholder="Ex: Aluguel, Financiamento Carro"
                  value={newRecDescription}
                  onChange={(e) => setNewRecDescription(e.target.value)}
                  required
                  className="border-[#007A33] focus:ring-[#007A33]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rec-amount" className="flex items-center gap-2 mb-1">
                    Valor
                  </Label>
                  <Input
                    id="rec-amount"
                    type="text"
                    placeholder="R$ 0,00"
                    value={newRecAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9,.]/g, "")
                      setNewRecAmount(val)
                    }}
                    required
                    className="border-[#007A33] focus:ring-[#007A33]"
                  />
                </div>
                <div>
                  <Label htmlFor="rec-category" className="flex items-center gap-2 mb-1">
                    Categoria
                  </Label>
                  <Select value={newRecCategory} onValueChange={setNewRecCategory} required>
                    <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="rec-frequency" className="flex items-center gap-2 mb-1">
                  Frequência
                </Label>
                <Select
                  value={newRecFrequency}
                  onValueChange={(value: typeof newRecFrequency) => setNewRecFrequency(value)}
                  required
                >
                  <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="annually">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newRecFrequency === "monthly" && (
                <div>
                  <Label htmlFor="rec-day-month" className="flex items-center gap-2 mb-1">
                    Dia do Mês
                  </Label>
                  <Input
                    id="rec-day-month"
                    type="number"
                    min="1"
                    max="31"
                    value={newRecDayOfMonth || ""}
                    onChange={(e) => setNewRecDayOfMonth(Number.parseInt(e.target.value) || undefined)}
                    placeholder="Ex: 5"
                    required
                    className="border-[#007A33] focus:ring-[#007A33]"
                  />
                </div>
              )}
              {newRecFrequency === "weekly" && (
                <div>
                  <Label htmlFor="rec-day-week" className="flex items-center gap-2 mb-1">
                    Dia da Semana
                  </Label>
                  <Select
                    value={newRecDayOfWeek?.toString() || ""}
                    onValueChange={(value) => setNewRecDayOfWeek(Number.parseInt(value))}
                    required
                  >
                    <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Domingo</SelectItem>
                      <SelectItem value="1">Segunda-feira</SelectItem>
                      <SelectItem value="2">Terça-feira</SelectItem>
                      <SelectItem value="3">Quarta-feira</SelectItem>
                      <SelectItem value="4">Quinta-feira</SelectItem>
                      <SelectItem value="5">Sexta-feira</SelectItem>
                      <SelectItem value="6">Sábado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {newRecFrequency === "annually" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rec-month-year" className="flex items-center gap-2 mb-1">
                      Mês
                    </Label>
                    <Select
                      value={newRecMonthOfYear?.toString() || ""}
                      onValueChange={(value) => setNewRecMonthOfYear(Number.parseInt(value))}
                      required
                    >
                      <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {format(new Date(2000, i, 1), "MMMM")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rec-day-year" className="flex items-center gap-2 mb-1">
                      Dia
                    </Label>
                    <Input
                      id="rec-day-year"
                      type="number"
                      min="1"
                      max="31"
                      value={newRecDayOfYear || ""}
                      onChange={(e) => setNewRecDayOfYear(Number.parseInt(e.target.value) || undefined)}
                      placeholder="Ex: 1"
                      required
                      className="border-[#007A33] focus:ring-[#007A33]"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rec-start-date" className="flex items-center gap-2 mb-1">
                    Data de Início
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !newRecStartDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newRecStartDate ? format(newRecStartDate, "PPP") : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={newRecStartDate} onSelect={setNewRecStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="rec-end-date" className="flex items-center gap-2 mb-1">
                    Data de Fim (Opcional)
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !newRecEndDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newRecEndDate ? format(newRecEndDate, "PPP") : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={newRecEndDate} onSelect={setNewRecEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#007A33] hover:bg-[#005F28] text-white">
                Adicionar Recorrente
              </Button>
            </form>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Despesas Recorrentes Cadastradas</h3>
            <div className="space-y-4">
              {recurringExpenses.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhuma despesa recorrente cadastrada.</p>
              ) : (
                recurringExpenses.map((rec) => {
                  const nextOccurrence = rec.isActive ? getNextOccurrence(rec) : null
                  return (
                    <Card key={rec.id} className="p-4 border rounded-lg shadow-sm bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{rec.description}</h4>
                          <p className="text-sm text-gray-600">
                            R$ {rec.amount.toFixed(2).replace(".", ",")} • {rec.frequency === "daily" && "Diário"}
                            {rec.frequency === "weekly" &&
                              `Semanal (Todo ${format(new Date(2000, 0, rec.dayOfWeek || 0), "EEEE")})`}
                            {rec.frequency === "monthly" && `Mensal (Dia ${rec.dayOfMonth})`}
                            {rec.frequency === "annually" && `Anual (${rec.dayOfYear}/${(rec.monthOfYear || 0) + 1})`}
                          </p>
                          <p className="text-xs text-gray-500">
                            Início: {format(rec.startDate, "dd/MM/yyyy")}
                            {rec.endDate && ` • Fim: ${format(rec.endDate, "dd/MM/yyyy")}`}
                          </p>
                          {nextOccurrence && (
                            <p className="text-sm text-gray-700 font-medium mt-1">
                              Próximo Vencimento: {format(nextOccurrence, "dd/MM/yyyy")}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${rec.isActive ? "text-green-600" : "text-red-600"}`}>
                            {rec.isActive ? "Ativo" : "Inativo"}
                          </span>
                          <Switch
                            checked={rec.isActive}
                            onCheckedChange={() => handleToggleRecurringStatus(rec.id)}
                            className="data-[state=checked]:bg-[#007A33]"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteRecurring(rec.id)}
                            className="text-red-500 border-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
