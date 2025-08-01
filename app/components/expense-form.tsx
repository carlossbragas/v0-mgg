"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  familyId?: string
}

interface Family {
  id: string
  name: string
  adminId: string
  members: User[]
}

interface ExpenseFormProps {
  onClose: () => void
  user: User
  family: Family | null
}

const categories = ["Alimentação", "Transporte", "Casa", "Saúde", "Educação", "Lazer", "Roupas", "Tecnologia", "Outros"]

export function ExpenseForm({ onClose, user, family }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    member: user.id,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description || !formData.amount || !formData.category) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    // Simular salvamento
    const expense = {
      id: Date.now().toString(),
      ...formData,
      amount: Number.parseFloat(formData.amount),
      createdAt: new Date().toISOString(),
    }

    // Salvar no localStorage (simulação)
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]")
    expenses.unshift(expense)
    localStorage.setItem("expenses", JSON.stringify(expenses))

    toast.success("Gasto registrado com sucesso!")
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader className="text-left">
          <DialogTitle className="font-retro text-lg sm:text-xl">Novo Gasto</DialogTitle>
          <DialogDescription className="text-sm">Registre um novo gasto para sua família</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição *
            </Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Valor *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Data
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Categoria *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="h-11">
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
            <Label className="text-sm font-medium">Membro Responsável</Label>
            <Select value={formData.member} onValueChange={(value) => setFormData({ ...formData, member: value })}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {family?.members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Observações
            </Label>
            <Textarea
              id="notes"
              placeholder="Observações adicionais..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 bg-transparent order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 h-11 bg-retro-green hover:bg-retro-green/90 order-1 sm:order-2">
              Salvar Gasto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
