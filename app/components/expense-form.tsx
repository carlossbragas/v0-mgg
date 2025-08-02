"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, DollarSign, Save, Receipt } from "lucide-react"
import { toast } from "sonner"

interface ExpenseFormProps {
  familyData: {
    familyName: string
    adminName: string
    members: Array<{
      name: string
      role: "adult" | "child"
      allowance: number
    }>
    budget: {
      monthly: number
      categories: Array<{
        name: string
        limit: number
      }>
    }
  }
  onBack: () => void
}

export default function ExpenseForm({ familyData, onBack }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    member: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = familyData.budget.categories.map((cat) => cat.name)
  const members = familyData.members.map((member) => member.name)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description || !formData.amount || !formData.category || !formData.member) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsSubmitting(true)

    try {
      // Simular envio para API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Despesa adicionada com sucesso!")

      // Reset form
      setFormData({
        description: "",
        amount: "",
        category: "",
        member: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      })

      // Voltar para dashboard após 1 segundo
      setTimeout(() => {
        onBack()
      }, 1000)
    } catch (error) {
      toast.error("Erro ao adicionar despesa. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "")
    const formattedValue = (Number(numericValue) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
    return formattedValue
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setFormData({ ...formData, amount: value })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-emerald-700">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Nova Despesa</h1>
          <p className="text-gray-600">Adicione uma nova despesa para a família {familyData.familyName}</p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Receipt className="w-5 h-5" />
            Detalhes da Despesa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Descrição e Valor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  placeholder="Ex: Supermercado, Gasolina, Cinema..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border-emerald-200 focus:border-emerald-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Valor *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="amount"
                    placeholder="0,00"
                    value={formData.amount ? formatCurrency(formData.amount) : ""}
                    onChange={handleAmountChange}
                    className="pl-10 border-emerald-200 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Categoria e Membro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
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
                <Label>Membro Responsável *</Label>
                <Select value={formData.member} onValueChange={(value) => setFormData({ ...formData, member: value })}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Quem fez a despesa?" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="date">Data da Despesa</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Adicione detalhes adicionais sobre esta despesa..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="border-emerald-200 focus:border-emerald-500 min-h-[100px]"
              />
            </div>

            {/* Resumo */}
            {formData.amount && (
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <h3 className="font-semibold text-emerald-800 mb-2">Resumo da Despesa</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Valor:</span> {formatCurrency(formData.amount)}
                  </p>
                  {formData.category && (
                    <p>
                      <span className="font-medium">Categoria:</span> {formData.category}
                    </p>
                  )}
                  {formData.member && (
                    <p>
                      <span className="font-medium">Responsável:</span> {formData.member}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Data:</span> {new Date(formData.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Despesa
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
