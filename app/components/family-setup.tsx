"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Plus, Trash2, Edit3, Check, PiggyBank, Target, Home, ArrowRight, ArrowLeft } from "lucide-react"

interface FamilyMember {
  id: string
  name: string
  role: "admin" | "parent" | "child"
  allowance?: number
  avatar?: string
}

interface FamilySetupProps {
  onComplete?: (familyData: any) => void
  onBack?: () => void
}

export function FamilySetup({ onComplete, onBack }: FamilySetupProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [familyName, setFamilyName] = useState("")
  const [familyDescription, setFamilyDescription] = useState("")
  const [monthlyBudget, setMonthlyBudget] = useState("")
  const [members, setMembers] = useState<FamilyMember[]>([{ id: "1", name: "", role: "admin" }])
  const [editingMember, setEditingMember] = useState<string | null>(null)

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const addMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: "",
      role: "child",
      allowance: 0,
    }
    setMembers([...members, newMember])
    setEditingMember(newMember.id)
  }

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter((member) => member.id !== id))
    }
  }

  const updateMember = (id: string, updates: Partial<FamilyMember>) => {
    setMembers(members.map((member) => (member.id === id ? { ...member, ...updates } : member)))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Finalizar setup
      const familyData = {
        name: familyName,
        description: familyDescription,
        monthlyBudget: Number.parseFloat(monthlyBudget),
        members: members.filter((member) => member.name.trim() !== ""),
        createdAt: new Date().toISOString(),
      }
      onComplete?.(familyData)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack?.()
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return familyName.trim() !== ""
      case 2:
        return members.some((member) => member.name.trim() !== "")
      case 3:
        return monthlyBudget !== "" && Number.parseFloat(monthlyBudget) > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-fit mx-auto mb-4">
                <Home className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vamos começar com sua família</h2>
              <p className="text-gray-600">Primeiro, nos conte um pouco sobre sua família</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="familyName" className="text-sm font-medium text-gray-700">
                  Nome da Família *
                </Label>
                <Input
                  id="familyName"
                  placeholder="Ex: Família Silva"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="mt-1 h-12 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div>
                <Label htmlFor="familyDescription" className="text-sm font-medium text-gray-700">
                  Descrição (Opcional)
                </Label>
                <Textarea
                  id="familyDescription"
                  placeholder="Conte um pouco sobre sua família..."
                  value={familyDescription}
                  onChange={(e) => setFamilyDescription(e.target.value)}
                  className="mt-1 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[100px]"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Adicione os membros da família</h2>
              <p className="text-gray-600">Quem faz parte da sua família?</p>
            </div>

            <div className="space-y-4">
              {members.map((member, index) => (
                <Card key={member.id} className="bg-white/50 border-gray-200">
                  <CardContent className="p-4">
                    {editingMember === member.id ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Nome do membro"
                            value={member.name}
                            onChange={(e) => updateMember(member.id, { name: e.target.value })}
                            className="flex-1"
                          />
                          <select
                            value={member.role}
                            onChange={(e) => updateMember(member.id, { role: e.target.value as any })}
                            className="px-3 py-2 border border-gray-200 rounded-md bg-white"
                          >
                            <option value="admin">Administrador</option>
                            <option value="parent">Responsável</option>
                            <option value="child">Filho(a)</option>
                          </select>
                        </div>

                        {member.role === "child" && (
                          <div>
                            <Label className="text-sm text-gray-600">Mesada (R$)</Label>
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={member.allowance || ""}
                              onChange={(e) =>
                                updateMember(member.id, { allowance: Number.parseFloat(e.target.value) || 0 })
                              }
                              className="mt-1"
                            />
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingMember(null)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          {members.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeMember(member.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                            {member.name.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name || "Nome não definido"}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {member.role === "admin"
                                  ? "Administrador"
                                  : member.role === "parent"
                                    ? "Responsável"
                                    : "Filho(a)"}
                              </Badge>
                              {member.role === "child" && member.allowance && (
                                <Badge variant="outline" className="text-xs">
                                  R$ {member.allowance.toFixed(2)}/mês
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setEditingMember(member.id)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={addMember}
                className="w-full h-12 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Membro
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full w-fit mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Defina seu orçamento mensal</h2>
              <p className="text-gray-600">Qual é o orçamento mensal da sua família?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="monthlyBudget" className="text-sm font-medium text-gray-700">
                  Orçamento Mensal (R$) *
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    id="monthlyBudget"
                    type="number"
                    placeholder="0,00"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Este valor será usado para acompanhar seus gastos mensais</p>
              </div>

              {monthlyBudget && Number.parseFloat(monthlyBudget) > 0 && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Sugestão de Distribuição</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Gastos Essenciais (50%)</span>
                        <span className="font-medium">R$ {(Number.parseFloat(monthlyBudget) * 0.5).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Lazer e Entretenimento (30%)</span>
                        <span className="font-medium">R$ {(Number.parseFloat(monthlyBudget) * 0.3).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Poupança (20%)</span>
                        <span className="font-medium">R$ {(Number.parseFloat(monthlyBudget) * 0.2).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-fit mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tudo pronto!</h2>
              <p className="text-gray-600">Revise as informações da sua família</p>
            </div>

            <div className="space-y-4">
              <Card className="bg-white/50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">Resumo da Família</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nome</Label>
                    <p className="text-gray-900 font-medium">{familyName}</p>
                  </div>

                  {familyDescription && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                      <p className="text-gray-900">{familyDescription}</p>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Orçamento Mensal</Label>
                    <p className="text-gray-900 font-medium">R$ {Number.parseFloat(monthlyBudget).toFixed(2)}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Membros ({members.filter((m) => m.name.trim()).length})
                    </Label>
                    <div className="space-y-2 mt-2">
                      {members
                        .filter((member) => member.name.trim())
                        .map((member) => (
                          <div key={member.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {member.role === "admin"
                                    ? "Administrador"
                                    : member.role === "parent"
                                      ? "Responsável"
                                      : "Filho(a)"}
                                </Badge>
                                {member.role === "child" && member.allowance && (
                                  <Badge variant="outline" className="text-xs">
                                    R$ {member.allowance.toFixed(2)}/mês
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <PiggyBank className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              MinhaGrana
            </h1>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm text-gray-600">
              Passo {currentStep} de {totalSteps}
            </span>
          </div>

          <Progress value={progress} className="h-2 mb-6" />
        </div>

        {/* Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 1 ? "Voltar" : "Anterior"}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {currentStep === totalSteps ? "Finalizar" : "Próximo"}
            {currentStep < totalSteps && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FamilySetup
