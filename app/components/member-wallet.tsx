"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, Plus, TrendingUp, TrendingDown, Filter, Download, Eye, EyeOff, PiggyBank, Target } from "lucide-react"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  date: Date
  category: string
  status: "completed" | "pending"
}

interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: Date
}

interface MemberWalletProps {
  user: any
}

export function MemberWallet({ user }: MemberWalletProps) {
  const [balance, setBalance] = useState(1250.75)
  const [showBalance, setShowBalance] = useState(true)
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)

  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  })

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "expense",
      amount: -45.5,
      description: "Lanche na escola",
      category: "Alimentação",
      date: new Date("2024-01-15"),
      status: "completed",
    },
    {
      id: "2",
      type: "income",
      amount: 50.0,
      description: "Mesada semanal",
      category: "Mesada",
      date: new Date("2024-01-14"),
      status: "completed",
    },
    {
      id: "3",
      type: "expense",
      amount: -12.0,
      description: "Transporte",
      category: "Transporte",
      date: new Date("2024-01-13"),
      status: "completed",
    },
    {
      id: "4",
      type: "expense",
      amount: -25.3,
      description: "Material escolar",
      category: "Educação",
      date: new Date("2024-01-12"),
      status: "pending",
    },
  ])

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "Novo Videogame",
      target: 500.0,
      current: 180.0,
      deadline: new Date("2024-06-01"),
    },
    {
      id: "2",
      name: "Viagem de Férias",
      target: 300.0,
      current: 75.0,
      deadline: new Date("2024-12-01"),
    },
  ])

  const categories = [
    "Alimentação",
    "Transporte",
    "Educação",
    "Entretenimento",
    "Roupas",
    "Saúde",
    "Mesada",
    "Presente",
    "Outros",
  ]

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) return

    const transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      amount:
        newTransaction.type === "expense"
          ? -Number.parseFloat(newTransaction.amount)
          : Number.parseFloat(newTransaction.amount),
      description: newTransaction.description,
      category: newTransaction.category,
      date: new Date(newTransaction.date),
      status: "pending",
    }

    setTransactions([transaction, ...transactions])
    setBalance(balance + transaction.amount)
    setNewTransaction({
      type: "expense",
      amount: "",
      description: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    })
    setIsAddingTransaction(false)
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const getTransactionIcon = (type: string) => {
    return type === "income" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    )
  }

  const getStatusBadge = (status: string) => {
    return status === "completed" ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Concluído
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        Pendente
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-amber-800 mb-2">Minha Carteira</h2>
        <p className="text-amber-600">Gerencie seus gastos e economias pessoais</p>
      </div>

      {/* Balance Card */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="w-6 h-6 text-amber-600" />
              <span className="text-amber-800">Saldo Atual</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-amber-600 hover:text-amber-700"
            >
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-800 mb-2">
              {showBalance ? formatCurrency(balance) : "••••••"}
            </div>
            <p className="text-sm text-amber-600">Disponível para uso</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Transação</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select
                        value={newTransaction.type}
                        onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Receita</SelectItem>
                          <SelectItem value="expense">Gasto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Valor</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      placeholder="Ex: Lanche na escola"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      value={newTransaction.category}
                      onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddTransaction} className="flex-1 bg-amber-600 hover:bg-amber-700">
                      Adicionar
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingTransaction(false)} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Extrato
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-amber-100">
          <TabsTrigger value="transactions" className="data-[state=active]:bg-amber-200">
            Transações
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-amber-200">
            Metas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Filters */}
          <Card className="border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-amber-800">Histórico de Transações</h3>
                <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="border-amber-200 bg-gradient-to-r from-white to-amber-50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-amber-800">{transaction.description}</h4>
                        <div className="flex items-center space-x-2 text-sm text-amber-600">
                          <Badge variant="outline" className="text-xs border-amber-300">
                            {transaction.category}
                          </Badge>
                          <span>•</span>
                          <span>{transaction.date.toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          {/* Goals List */}
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100
              const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

              return (
                <Card key={goal.id} className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-amber-600" />
                        <span className="text-amber-800">{goal.name}</span>
                      </CardTitle>
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        {daysLeft} dias restantes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm text-amber-700">
                      <span>Progresso: {progress.toFixed(1)}%</span>
                      <span>
                        {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                      </span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-amber-600">
                        Faltam: {formatCurrency(goal.target - goal.current)}
                      </span>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        <PiggyBank className="w-4 h-4 mr-2" />
                        Contribuir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Add Goal Button */}
          <Card className="border-dashed border-2 border-amber-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="font-semibold text-amber-800 mb-2">Criar Nova Meta</h3>
                <p className="text-sm text-amber-600 mb-4">Defina um objetivo de economia e acompanhe seu progresso</p>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Meta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MemberWallet
