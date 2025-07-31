"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"

interface ExpenseFormProps {
  onBack: () => void
  onSave: () => void
}

export default function ExpenseForm({ onBack, onSave }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    member: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const [divisionType, setDivisionType] = useState<"equal" | "percentage" | "value">("equal")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [memberDivisions, setMemberDivisions] = useState<Record<string, number>>({})

  const categories = ["Alimentação", "Transporte", "Saúde", "Educação", "Lazer", "Casa", "Roupas", "Outros"]

  const members = ["João Silva", "Maria Silva", "Pedro Silva", "Ana Silva"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação da divisão
    if (selectedMembers.length === 0) {
      alert("Selecione pelo menos um membro para dividir a despesa")
      return
    }

    if (divisionType === "percentage") {
      const totalPercentage = Object.values(memberDivisions).reduce((sum, val) => sum + val, 0)
      if (Math.abs(totalPercentage - 100) > 0.1) {
        alert("A soma dos percentuais deve ser 100%")
        return
      }
    }

    if (divisionType === "value") {
      const totalDivided = Object.values(memberDivisions).reduce((sum, val) => sum + val, 0)
      const totalAmount = Number.parseFloat(formData.amount || "0")
      if (Math.abs(totalDivided - totalAmount) > 0.01) {
        alert("A soma dos valores divididos deve ser igual ao valor total da despesa")
        return
      }
    }

    // Mock save with division data
    const expenseData = {
      ...formData,
      divisionType,
      selectedMembers,
      memberDivisions:
        divisionType === "equal"
          ? selectedMembers.reduce(
              (acc, member) => ({
                ...acc,
                [member]: Number.parseFloat(formData.amount || "0") / selectedMembers.length,
              }),
              {},
            )
          : memberDivisions,
    }

    console.log("Expense with division:", expenseData)
    onSave()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="bg-[#007A33] text-white p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-emerald-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Nova Despesa</h1>
        </div>
      </div>

      <div className="p-4">
        <Card className="max-w-md mx-auto border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-center text-xl text-gray-800">Adicionar Despesa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33] text-lg font-semibold text-center"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Ex: Supermercado, Gasolina..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]">
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
                <Label>Quem Pagou</Label>
                <Select value={formData.member} onValueChange={(value) => setFormData({ ...formData, member: value })}>
                  <SelectTrigger className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]">
                    <SelectValue placeholder="Quem fez o pagamento?" />
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

              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                  required
                />
              </div>

              {/* Nova seção de divisão */}
              <div className="space-y-4 p-4 bg-emerald-50 rounded-xl">
                <Label className="text-base font-semibold text-gray-800">Dividir Despesa</Label>

                {/* Seleção de membros */}
                <div className="space-y-2">
                  <Label className="text-sm">Membros que vão dividir:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {members.map((member) => (
                      <label
                        key={member}
                        className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-emerald-200"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers([...selectedMembers, member])
                            } else {
                              setSelectedMembers(selectedMembers.filter((m) => m !== member))
                              const newDivisions = { ...memberDivisions }
                              delete newDivisions[member]
                              setMemberDivisions(newDivisions)
                            }
                          }}
                          className="rounded border-emerald-300 text-[#007A33] focus:ring-[#007A33]"
                        />
                        <span className="text-sm text-gray-700">{member}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedMembers.length > 0 && (
                  <>
                    {/* Tipo de divisão */}
                    <div className="space-y-2">
                      <Label className="text-sm">Como dividir:</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setDivisionType("equal")}
                          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                            divisionType === "equal"
                              ? "bg-[#007A33] text-white"
                              : "bg-white border border-emerald-200 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          Igual
                        </button>
                        <button
                          type="button"
                          onClick={() => setDivisionType("percentage")}
                          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                            divisionType === "percentage"
                              ? "bg-[#007A33] text-white"
                              : "bg-white border border-emerald-200 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          Percentual
                        </button>
                        <button
                          type="button"
                          onClick={() => setDivisionType("value")}
                          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                            divisionType === "value"
                              ? "bg-[#007A33] text-white"
                              : "bg-white border border-emerald-200 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          Valor
                        </button>
                      </div>
                    </div>

                    {/* Divisão por igual */}
                    {divisionType === "equal" && (
                      <div className="p-3 bg-white rounded-lg border border-emerald-200">
                        <p className="text-sm text-gray-600 mb-2">
                          Divisão igual entre {selectedMembers.length} membros:
                        </p>
                        <div className="space-y-1">
                          {selectedMembers.map((member) => (
                            <div key={member} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700">{member}</span>
                              <span className="font-semibold text-[#007A33]">
                                R${" "}
                                {formData.amount
                                  ? (Number.parseFloat(formData.amount) / selectedMembers.length).toFixed(2)
                                  : "0,00"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Divisão por percentual */}
                    {divisionType === "percentage" && (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">Defina o percentual para cada membro:</p>
                        {selectedMembers.map((member) => (
                          <div key={member} className="flex items-center gap-2">
                            <span className="text-sm text-gray-700 w-20 flex-shrink-0">{member.split(" ")[0]}</span>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              placeholder="0"
                              value={memberDivisions[member] || ""}
                              onChange={(e) =>
                                setMemberDivisions({
                                  ...memberDivisions,
                                  [member]: Number.parseFloat(e.target.value) || 0,
                                })
                              }
                              className="flex-1 rounded-lg border-2 border-emerald-200 focus:border-[#007A33] text-center"
                            />
                            <span className="text-sm text-gray-500 w-8">%</span>
                            <span className="text-sm font-semibold text-[#007A33] w-16 text-right">
                              R${" "}
                              {formData.amount && memberDivisions[member]
                                ? ((Number.parseFloat(formData.amount) * memberDivisions[member]) / 100).toFixed(2)
                                : "0,00"}
                            </span>
                          </div>
                        ))}
                        <div className="p-2 bg-white rounded-lg border border-emerald-200">
                          <div className="flex justify-between text-sm">
                            <span>Total:</span>
                            <span
                              className={`font-semibold ${
                                Object.values(memberDivisions).reduce((sum, val) => sum + val, 0) === 100
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {Object.values(memberDivisions)
                                .reduce((sum, val) => sum + val, 0)
                                .toFixed(1)}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Divisão por valor */}
                    {divisionType === "value" && (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">Defina o valor para cada membro:</p>
                        {selectedMembers.map((member) => (
                          <div key={member} className="flex items-center gap-2">
                            <span className="text-sm text-gray-700 w-20 flex-shrink-0">{member.split(" ")[0]}</span>
                            <div className="flex-1 relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                R$
                              </span>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0,00"
                                value={memberDivisions[member] || ""}
                                onChange={(e) =>
                                  setMemberDivisions({
                                    ...memberDivisions,
                                    [member]: Number.parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="pl-8 rounded-lg border-2 border-emerald-200 focus:border-[#007A33] text-center"
                              />
                            </div>
                          </div>
                        ))}
                        <div className="p-2 bg-white rounded-lg border border-emerald-200">
                          <div className="flex justify-between text-sm">
                            <span>Total dividido:</span>
                            <span
                              className={`font-semibold ${
                                Object.values(memberDivisions).reduce((sum, val) => sum + val, 0) ===
                                Number.parseFloat(formData.amount || "0")
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              R${" "}
                              {Object.values(memberDivisions)
                                .reduce((sum, val) => sum + val, 0)
                                .toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Valor total:</span>
                            <span>R$ {formData.amount || "0,00"}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Detalhes adicionais..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33] min-h-[80px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#007A33] hover:bg-[#005A26] text-white font-semibold py-3 rounded-xl"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Despesa
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
