"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, Users, DollarSign, Plus, Trash2, Edit, Save } from "lucide-react"
import { toast } from "sonner"

interface FamilySettingsProps {
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
  onBack?: () => void
}

export default function FamilySettings({ familyData, onBack }: FamilySettingsProps) {
  const [editingMember, setEditingMember] = useState<number | null>(null)
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<"adult" | "child">("adult")
  const [newMemberAllowance, setNewMemberAllowance] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryLimit, setNewCategoryLimit] = useState("")

  // Estados locais para edição
  const [localFamilyName, setLocalFamilyName] = useState(familyData.familyName)
  const [localMonthlyBudget, setLocalMonthlyBudget] = useState(familyData.budget.monthly.toString())
  const [localMembers, setLocalMembers] = useState(familyData.members)
  const [localCategories, setLocalCategories] = useState(familyData.budget.categories)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const addMember = () => {
    if (!newMemberName.trim()) return

    const newMember = {
      name: newMemberName,
      role: newMemberRole,
      allowance: Number.parseFloat(newMemberAllowance) || 0,
    }

    setLocalMembers([...localMembers, newMember])
    setNewMemberName("")
    setNewMemberRole("adult")
    setNewMemberAllowance("")
    toast.success("Membro adicionado!")
  }

  const removeMember = (index: number) => {
    setLocalMembers(localMembers.filter((_, i) => i !== index))
    toast.success("Membro removido!")
  }

  const addCategory = () => {
    if (!newCategoryName.trim() || !newCategoryLimit) return

    const newCategory = {
      name: newCategoryName,
      limit: Number.parseFloat(newCategoryLimit),
    }

    setLocalCategories([...localCategories, newCategory])
    setNewCategoryName("")
    setNewCategoryLimit("")
    toast.success("Categoria adicionada!")
  }

  const removeCategory = (index: number) => {
    setLocalCategories(localCategories.filter((_, i) => i !== index))
    toast.success("Categoria removida!")
  }

  const saveSettings = () => {
    // Aqui você salvaria as configurações no backend
    toast.success("Configurações salvas com sucesso!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="text-emerald-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Configurações da Família</h1>
          <p className="text-gray-600">Gerencie os dados e configurações da família</p>
        </div>
        <Button onClick={saveSettings} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Informações Gerais */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Settings className="w-5 h-5" />
            Informações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="familyName">Nome da Família</Label>
              <Input
                id="familyName"
                value={localFamilyName}
                onChange={(e) => setLocalFamilyName(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyBudget">Orçamento Mensal (R$)</Label>
              <Input
                id="monthlyBudget"
                type="number"
                value={localMonthlyBudget}
                onChange={(e) => setLocalMonthlyBudget(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membros da Família */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Users className="w-5 h-5" />
            Membros da Família
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lista de Membros */}
          <div className="space-y-3">
            {localMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-medium text-gray-800">{member.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === "adult" ? "default" : "secondary"}>
                        {member.role === "adult" ? "Adulto" : "Criança"}
                      </Badge>
                      {member.role === "child" && member.allowance > 0 && (
                        <Badge variant="outline" className="text-green-700">
                          Mesada: {formatCurrency(member.allowance)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditingMember(index)} className="text-blue-600">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeMember(index)} className="text-red-600">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Adicionar Novo Membro */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-3">Adicionar Novo Membro</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Nome do membro"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
              <Select value={newMemberRole} onValueChange={(value: "adult" | "child") => setNewMemberRole(value)}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Adulto</SelectItem>
                  <SelectItem value="child">Criança</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Mesada (R$)"
                type="number"
                value={newMemberAllowance}
                onChange={(e) => setNewMemberAllowance(e.target.value)}
                disabled={newMemberRole === "adult"}
                className="border-emerald-200 focus:border-emerald-500"
              />
              <Button onClick={addMember} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorias de Orçamento */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <DollarSign className="w-5 h-5" />
            Categorias de Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lista de Categorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {localCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-600">Limite: {formatCurrency(category.limit)}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditingCategory(index)} className="text-blue-600">
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeCategory(index)} className="text-red-600">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Adicionar Nova Categoria */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-3">Adicionar Nova Categoria</h4>
            <div className="flex gap-3">
              <Input
                placeholder="Nome da categoria"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 border-emerald-200 focus:border-emerald-500"
              />
              <Input
                placeholder="Limite (R$)"
                type="number"
                value={newCategoryLimit}
                onChange={(e) => setNewCategoryLimit(e.target.value)}
                className="w-32 border-emerald-200 focus:border-emerald-500"
              />
              <Button onClick={addCategory} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Resumo do Orçamento */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Categorias</p>
                <p className="text-xl font-bold text-emerald-700">
                  {formatCurrency(localCategories.reduce((sum, cat) => sum + cat.limit, 0))}
                </p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Orçamento Mensal</p>
                <p className="text-xl font-bold text-blue-700">
                  {formatCurrency(Number.parseFloat(localMonthlyBudget) || 0)}
                </p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Diferença</p>
                <p className="text-xl font-bold text-purple-700">
                  {formatCurrency(
                    (Number.parseFloat(localMonthlyBudget) || 0) -
                      localCategories.reduce((sum, cat) => sum + cat.limit, 0),
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
