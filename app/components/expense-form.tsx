"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, DollarSign, Tag, User, Users, Check, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface ExpenseFormProps {
  familyMembers: { id: string; name: string; email: string; role: string }[]
  onSave: () => void
}

export default function ExpenseForm({ familyMembers, onSave }: ExpenseFormProps) {
  const [value, setValue] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [category, setCategory] = useState("")
  const [payer, setPayer] = useState("")
  const [notes, setNotes] = useState("")
  const [splitType, setSplitType] = useState<"equal" | "percentage" | "value">("equal")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [splitValues, setSplitValues] = useState<{ [key: string]: number }>({})
  const [splitPercentages, setSplitPercentages] = useState<{ [key: string]: number }>({})
  const [totalSplitValue, setTotalSplitValue] = useState(0)
  const [totalSplitPercentage, setTotalSplitPercentage] = useState(0)

  const categories = ["Alimentação", "Moradia", "Transporte", "Saúde", "Educação", "Lazer", "Contas", "Outros"]

  useEffect(() => {
    // Initialize split values/percentages when members change
    const initialSplit: { [key: string]: number } = {}
    selectedMembers.forEach((memberId) => {
      initialSplit[memberId] = 0
    })
    setSplitValues(initialSplit)
    setSplitPercentages(initialSplit)
  }, [selectedMembers])

  useEffect(() => {
    const parsedValue = Number.parseFloat(value.replace(",", ".")) || 0
    if (splitType === "equal" && selectedMembers.length > 0) {
      const perMember = parsedValue / selectedMembers.length
      const newSplit: { [key: string]: number } = {}
      selectedMembers.forEach((memberId) => {
        newSplit[memberId] = perMember
      })
      setSplitValues(newSplit)
      setTotalSplitValue(parsedValue)
    } else if (splitType === "value") {
      const sum = Object.values(splitValues).reduce((acc, val) => acc + val, 0)
      setTotalSplitValue(sum)
    } else if (splitType === "percentage") {
      const sum = Object.values(splitPercentages).reduce((acc, val) => acc + val, 0)
      setTotalSplitPercentage(sum)
      const newSplitValues: { [key: string]: number } = {}
      selectedMembers.forEach((memberId) => {
        newSplitValues[memberId] = (parsedValue * (splitPercentages[memberId] || 0)) / 100
      })
      setSplitValues(newSplitValues)
    }
  }, [value, splitType, selectedMembers, splitValues, splitPercentages])

  const handleMemberSelect = (memberId: string, isChecked: boolean) => {
    setSelectedMembers((prev) => (isChecked ? [...prev, memberId] : prev.filter((id) => id !== memberId)))
  }

  const handleSplitValueChange = (memberId: string, val: string) => {
    const numVal = Number.parseFloat(val.replace(",", ".")) || 0
    setSplitValues((prev) => ({ ...prev, [memberId]: numVal }))
  }

  const handleSplitPercentageChange = (memberId: string, val: string) => {
    const numVal = Number.parseFloat(val.replace(",", ".")) || 0
    setSplitPercentages((prev) => ({ ...prev, [memberId]: numVal }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedValue = Number.parseFloat(value.replace(",", ".")) || 0

    if (selectedMembers.length === 0) {
      alert("Selecione pelo menos um membro para dividir a despesa.")
      return
    }

    if (splitType === "value" && totalSplitValue !== parsedValue) {
      alert("A soma dos valores divididos deve ser igual ao valor total da despesa.")
      return
    }

    if (splitType === "percentage" && totalSplitPercentage !== 100) {
      alert("A soma dos percentuais deve ser 100%.")
      return
    }

    const expenseData = {
      value: parsedValue,
      date: date?.toISOString(),
      category,
      payer,
      notes,
      splitType,
      splitDetails: selectedMembers.map((memberId) => ({
        memberId,
        amount: splitValues[memberId] || 0,
        percentage: splitPercentages[memberId] || 0,
      })),
    }
    console.log("Despesa a ser salva:", expenseData)
    alert("Despesa salva com sucesso! (Mock)")
    onSave()
  }

  const parsedValue = Number.parseFloat(value.replace(",", ".")) || 0

  return (
    <Card className="w-full bg-white text-[#007A33] rounded-lg shadow-lg">
      <CardHeader className="text-center border-b pb-4">
        <CardTitle className="text-2xl font-bold">Criar Nova Despesa</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Expense Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value" className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4" /> Valor
              </Label>
              <Input
                id="value"
                type="text"
                placeholder="R$ 0,00"
                value={value}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9,.]/g, "")
                  setValue(val)
                }}
                required
                className="border-[#007A33] focus:ring-[#007A33]"
              />
            </div>
            <div>
              <Label htmlFor="date" className="flex items-center gap-2 mb-1">
                <CalendarIcon className="h-4 w-4" /> Data
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="category" className="flex items-center gap-2 mb-1">
                <Tag className="h-4 w-4" /> Categoria
              </Label>
              <Select value={category} onValueChange={setCategory} required>
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
            <div>
              <Label htmlFor="payer" className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4" /> Pago por
              </Label>
              <Select value={payer} onValueChange={setPayer} required>
                <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                  <SelectValue placeholder="Quem pagou?" />
                </SelectTrigger>
                <SelectContent>
                  {familyMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="mb-1">
              Observações
            </Label>
            <Textarea
              id="notes"
              placeholder="Detalhes adicionais sobre a despesa..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-[#007A33] focus:ring-[#007A33]"
            />
          </div>

          {/* Expense Splitting Section */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-4">
            <h3 className="text-lg font-semibold text-[#007A33] flex items-center gap-2">
              <Users className="h-5 w-5" /> Dividir com
            </h3>

            {/* Member Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {familyMembers.map((member) => (
                <Label
                  key={member.id}
                  htmlFor={`member-${member.id}`}
                  className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-green-100"
                >
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) => handleMemberSelect(member.id, checked as boolean)}
                    className="data-[state=checked]:bg-[#007A33] data-[state=checked]:text-white"
                  />
                  <span>{member.name}</span>
                </Label>
              ))}
            </div>

            {selectedMembers.length > 0 && (
              <>
                {/* Split Type Selection */}
                <div className="flex space-x-2 mt-4">
                  <Button
                    type="button"
                    variant={splitType === "equal" ? "default" : "outline"}
                    onClick={() => setSplitType("equal")}
                    className={
                      splitType === "equal"
                        ? "bg-[#007A33] hover:bg-[#005F28] text-white"
                        : "text-[#007A33] border-[#007A33] hover:bg-green-100"
                    }
                  >
                    Divisão Igual
                  </Button>
                  <Button
                    type="button"
                    variant={splitType === "percentage" ? "default" : "outline"}
                    onClick={() => setSplitType("percentage")}
                    className={
                      splitType === "percentage"
                        ? "bg-[#007A33] hover:bg-[#005F28] text-white"
                        : "text-[#007A33] border-[#007A33] hover:bg-green-100"
                    }
                  >
                    Percentual
                  </Button>
                  <Button
                    type="button"
                    variant={splitType === "value" ? "default" : "outline"}
                    onClick={() => setSplitType("value")}
                    className={
                      splitType === "value"
                        ? "bg-[#007A33] hover:bg-[#005F28] text-white"
                        : "text-[#007A33] border-[#007A33] hover:bg-green-100"
                    }
                  >
                    Valor
                  </Button>
                </div>

                {/* Split Details Input */}
                <div className="space-y-3 mt-4">
                  {selectedMembers.map((memberId) => {
                    const member = familyMembers.find((m) => m.id === memberId)
                    if (!member) return null

                    return (
                      <div key={member.id} className="flex items-center gap-2">
                        <Label className="w-24 shrink-0">{member.name}:</Label>
                        {splitType === "equal" && (
                          <Input
                            type="text"
                            value={`R$ ${(splitValues[memberId] || 0).toFixed(2).replace(".", ",")}`}
                            readOnly
                            className="bg-gray-100 border-gray-300 text-gray-700"
                          />
                        )}
                        {splitType === "percentage" && (
                          <>
                            <Input
                              type="text"
                              value={(splitPercentages[memberId] || 0).toString().replace(".", ",")}
                              onChange={(e) => handleSplitPercentageChange(memberId, e.target.value)}
                              className="w-20 border-[#007A33] focus:ring-[#007A33]"
                            />
                            <span className="mr-2">%</span>
                            <Input
                              type="text"
                              value={`R$ ${((parsedValue * (splitPercentages[memberId] || 0)) / 100).toFixed(2).replace(".", ",")}`}
                              readOnly
                              className="flex-1 bg-gray-100 border-gray-300 text-gray-700"
                            />
                          </>
                        )}
                        {splitType === "value" && (
                          <Input
                            type="text"
                            value={(splitValues[memberId] || 0).toFixed(2).replace(".", ",")}
                            onChange={(e) => handleSplitValueChange(memberId, e.target.value)}
                            className="flex-1 border-[#007A33] focus:ring-[#007A33]"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Validation Summary */}
                {splitType === "value" && (
                  <div
                    className={`text-sm font-semibold flex items-center gap-2 ${totalSplitValue === parsedValue ? "text-green-600" : "text-red-600"}`}
                  >
                    Total Dividido: R$ {totalSplitValue.toFixed(2).replace(".", ",")}
                    {totalSplitValue === parsedValue ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </div>
                )}
                {splitType === "percentage" && (
                  <div
                    className={`text-sm font-semibold flex items-center gap-2 ${totalSplitPercentage === 100 ? "text-green-600" : "text-red-600"}`}
                  >
                    Total Percentual: {totalSplitPercentage}%
                    {totalSplitPercentage === 100 ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onSave}
              className="text-[#007A33] border-[#007A33] hover:bg-gray-100 bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#007A33] hover:bg-[#005F28] text-white">
              Salvar Despesa
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
