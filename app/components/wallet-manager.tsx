"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Wallet,
  Plus,
  Minus,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  History,
  Eye,
  EyeOff,
} from "lucide-react"
import { toast } from "sonner"

interface WalletManagerProps {
  onBack: () => void
}

export default function WalletManager({ onBack }: WalletManagerProps) {
  const [showBalances, setShowBalances] = useState(true)
  const [selectedOperation, setSelectedOperation] = useState<"add" | "remove" | "transfer" | null>(null)

  // Form states
  const [addForm, setAddForm] = useState({
    member: "",
    amount: "",
    category: "",
    description: "",
  })

  const [removeForm, setRemoveForm] = useState({
    member: "",
    amount: "",
    category: "",
    description: "",
  })

  const [transferForm, setTransferForm] = useState({
    fromMember: "",
    toMember: "",
    amount: "",
    description: "",
  })

  // Mock data
  const members = [
    { name: "João Silva", balance: 3253.7, role: "adult" },
    { name: "Maria Silva", balance: 1200.0, role: "adult" },
    { name: "Pedro Silva", balance: 150.0, role: "child" },
    { name: "Ana Silva", balance: 75.0, role: "child" },
  ]

  const incomeCategories = ["Salário", "Freelance", "Mesada", "Presente", "Recompensa por Tarefa"]

  const expenseCategories = [
    "Alimentação",
    "Transporte",
    "Entretenimento",
    "Educação",
    "Saúde",
    "Compras Pessoais",
    "Emergência",
    "Outros",
  ]

  const transactions = [
    {
      id: 1,
      type: "add",
      member: "João Silva",
      amount: 5000.0,
      category: "Salário",
      description: "Salário mensal",
      date: "2024-01-01",
    },
    {
      id: 2,
      type: "remove",
      member: "João Silva",
      amount: 245.67,
      category: "Alimentação",
      description: "Supermercado Extra",
      date: "2024-01-15",
    },
    {
      id: 3,
      type: "transfer",
      fromMember: "João Silva",
      toMember: "Pedro Silva",
      amount: 200.0,
      description: "Mesada mensal",
      date: "2024-01-01",
    },
    {
      id: 4,
      type: "add",
      member: "Pedro Silva",
      amount: 25.0,
      category: "Recompensa por Tarefa",
      description: "Lavar a louça",
      date: "2024-01-08",
    },
    {
      id: 5,
      type: "remove",
      member: "Maria Silva",
      amount: 120.0,
      category: "Transporte",
      description: "Gasolina",
      date: "2024-01-14",
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const handleAddMoney = async () => {
    if (!addForm.member || !addForm.amount || !addForm.category) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(`${formatCurrency(Number.parseFloat(addForm.amount))} adicionado à carteira de ${addForm.member}`)

      setAddForm({ member: "", amount: "", category: "", description: "" })
      setSelectedOperation(null)
    } catch (error) {
      toast.error("Erro ao adicionar dinheiro")
    }
  }

  const handleRemoveMoney = async () => {
    if (!removeForm.member || !removeForm.amount || !removeForm.category) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const member = members.find((m) => m.name === removeForm.member)
    const amount = Number.parseFloat(removeForm.amount)

    if (member && member.balance < amount) {
      toast.error("Saldo insuficiente")
      return
    }

    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(`${formatCurrency(amount)} removido da carteira de ${removeForm.member}`)

      setRemoveForm({ member: "", amount: "", category: "", description: "" })
      setSelectedOperation(null)
    } catch (error) {
      toast.error("Erro ao remover dinheiro")
    }
  }

  const handleTransferMoney = async () => {
    if (!transferForm.fromMember || !transferForm.toMember || !transferForm.amount) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    if (transferForm.fromMember === transferForm.toMember) {
      toast.error("Não é possível transferir para o mesmo membro")
      return
    }

    const fromMember = members.find((m) => m.name === transferForm.fromMember)
    const amount = Number.parseFloat(transferForm.amount)

    if (fromMember && fromMember.balance < amount) {
      toast.error("Saldo insuficiente para transferência")
      return
    }

    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(`${formatCurrency(amount)} transferido de ${transferForm.fromMember} para ${transferForm.toMember}`)

      setTransferForm({ fromMember: "", toMember: "", amount: "", description: "" })
      setSelectedOperation(null)
    } catch (error) {
      toast.error("Erro ao transferir dinheiro")
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "add":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "remove":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      case "transfer":
        return <ArrowRightLeft className="w-4 h-4 text-blue-600" />
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "add":
        return "text-green-600"
      case "remove":
        return "text-red-600"
      case "transfer":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const totalBalance = members.reduce((sum, member) => sum + member.balance, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-emerald-700">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciador de Carteiras</h1>
          <p className="text-gray-600">Adicione, remova ou transfira dinheiro entre membros</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowBalances(!showBalances)}
          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        >
          {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Resumo Geral */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Wallet className="w-5 h-5" />
            Resumo das Carteiras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Saldo Total da Família</p>
            <p className="text-4xl font-bold text-emerald-700">
              {showBalances ? formatCurrency(totalBalance) : "••••••••"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {members.map((member, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{member.name}</h3>
                  <Badge variant={member.role === "adult" ? "default" : "secondary"}>
                    {member.role === "adult" ? "Adulto" : "Criança"}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-emerald-700">
                  {showBalances ? formatCurrency(member.balance) : "••••••"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Adicionar Dinheiro */}
        <Dialog open={selectedOperation === "add"} onOpenChange={(open) => !open && setSelectedOperation(null)}>
          <DialogTrigger asChild>
            <Card
              className="border-2 border-green-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedOperation("add")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Adicionar Dinheiro</h3>
                <p className="text-sm text-gray-600">Adicione dinheiro à carteira de um membro</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-700">
                <Plus className="w-5 h-5" />
                Adicionar Dinheiro
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Membro</Label>
                <Select value={addForm.member} onValueChange={(value) => setAddForm({ ...addForm, member: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um membro" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.name} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={addForm.amount}
                  onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={addForm.category} onValueChange={(value) => setAddForm({ ...addForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Descrição (opcional)</Label>
                <Textarea
                  placeholder="Adicione uma descrição..."
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setSelectedOperation(null)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleAddMoney} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Remover Dinheiro */}
        <Dialog open={selectedOperation === "remove"} onOpenChange={(open) => !open && setSelectedOperation(null)}>
          <DialogTrigger asChild>
            <Card
              className="border-2 border-red-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedOperation("remove")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Minus className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Remover Dinheiro</h3>
                <p className="text-sm text-gray-600">Remova dinheiro da carteira de um membro</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-700">
                <Minus className="w-5 h-5" />
                Remover Dinheiro
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Membro</Label>
                <Select
                  value={removeForm.member}
                  onValueChange={(value) => setRemoveForm({ ...removeForm, member: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um membro" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.name} value={member.name}>
                        {member.name} - {showBalances ? formatCurrency(member.balance) : "••••••"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={removeForm.amount}
                  onChange={(e) => setRemoveForm({ ...removeForm, amount: e.target.value })}
                />
                {removeForm.member && removeForm.amount && (
                  <p className="text-xs text-gray-600">
                    Saldo disponível:{" "}
                    {showBalances
                      ? formatCurrency(members.find((m) => m.name === removeForm.member)?.balance || 0)
                      : "••••••"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={removeForm.category}
                  onValueChange={(value) => setRemoveForm({ ...removeForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Descrição (opcional)</Label>
                <Textarea
                  placeholder="Adicione uma descrição..."
                  value={removeForm.description}
                  onChange={(e) => setRemoveForm({ ...removeForm, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setSelectedOperation(null)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleRemoveMoney} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  Remover
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Transferir Dinheiro */}
        <Dialog open={selectedOperation === "transfer"} onOpenChange={(open) => !open && setSelectedOperation(null)}>
          <DialogTrigger asChild>
            <Card
              className="border-2 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedOperation("transfer")}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ArrowRightLeft className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Transferir Dinheiro</h3>
                <p className="text-sm text-gray-600">Transfira dinheiro entre membros</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-700">
                <ArrowRightLeft className="w-5 h-5" />
                Transferir Dinheiro
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>De (Origem)</Label>
                <Select
                  value={transferForm.fromMember}
                  onValueChange={(value) => setTransferForm({ ...transferForm, fromMember: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o membro origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.name} value={member.name}>
                        {member.name} - {showBalances ? formatCurrency(member.balance) : "••••••"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Para (Destino)</Label>
                <Select
                  value={transferForm.toMember}
                  onValueChange={(value) => setTransferForm({ ...transferForm, toMember: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o membro destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {members
                      .filter((m) => m.name !== transferForm.fromMember)
                      .map((member) => (
                        <SelectItem key={member.name} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                />
                {transferForm.fromMember && transferForm.amount && (
                  <p className="text-xs text-gray-600">
                    Saldo disponível:{" "}
                    {showBalances
                      ? formatCurrency(members.find((m) => m.name === transferForm.fromMember)?.balance || 0)
                      : "••••••"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Descrição (opcional)</Label>
                <Textarea
                  placeholder="Ex: Mesada mensal, Presente, etc..."
                  value={transferForm.description}
                  onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setSelectedOperation(null)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleTransferMoney} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Transferir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Histórico de Transações */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <History className="w-5 h-5" />
            Histórico de Transações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full border">{getTransactionIcon(transaction.type)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-800">
                        {transaction.type === "add" && "Adição"}
                        {transaction.type === "remove" && "Remoção"}
                        {transaction.type === "transfer" && "Transferência"}
                      </h4>
                      {transaction.category && (
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {transaction.type === "transfer"
                        ? `${transaction.fromMember} → ${transaction.toMember}`
                        : transaction.member}
                    </p>
                    {transaction.description && <p className="text-xs text-gray-500">{transaction.description}</p>}
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === "add" && "+"}
                    {transaction.type === "remove" && "-"}
                    {transaction.type === "transfer" && ""}
                    {showBalances ? formatCurrency(transaction.amount) : "••••••"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
