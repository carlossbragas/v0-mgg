"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  Home,
  DollarSign,
  Settings,
  Plus,
  Trash2,
  Check,
  ArrowRight,
  ArrowLeft,
  PiggyBank,
  Target,
} from "lucide-react"

interface FamilyMember {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  avatar?: string
  allowance?: number
}

interface FamilySetupProps {
  onComplete?: (familyData: any) => void
  onSkip?: () => void
}

export function FamilySetup({ onComplete, onSkip }: FamilySetupProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [familyName, setFamilyName] = useState("")
  const [familyDescription, setFamilyDescription] = useState("")
  const [monthlyBudget, setMonthlyBudget] = useState("")
  const [savingsGoal, setSavingsGoal] = useState("")
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      name: "",
      email: "",
      role: "admin",
    },
  ])

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const addMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: "",
      email: "",
      role: "member",
    }
    setMembers([...members, newMember])
  }

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter((member) => member.id !== id))
    }
  }

  const updateMember = (id: string, field: keyof FamilyMember, value: string | number) => {
    setMembers(members.map((member) => (member.id === id ? { ...member, [field]: value } : member)))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    const familyData = {
      name: familyName,
      description: familyDescription,
      monthlyBudget: Number.parseFloat(monthlyBudget) || 0,
      savingsGoal: Number.parseFloat(savingsGoal) || 0,
      members: members.filter((member) => member.name && member.email),
    }

    if (onComplete) {
      onComplete(familyData)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return familyName.trim().length > 0
      case 2:
        return members.every((member) => member.name && member.email)
      case 3:
        return monthlyBudget && Number.parseFloat(monthlyBudget) > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const stepIcons = [
    { icon: Home, title: "Família" },
    { icon: Users, title: "Membros" },
    { icon: DollarSign, title: "Orçamento" },
    { icon: Settings, title: "Finalizar" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500">
              <PiggyBank className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Configuração Familiar
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Vamos configurar sua família no MinhaGrana! Este processo levará apenas alguns minutos.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {stepIcons.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index + 1 <= currentStep
                      ? "bg-gradient-to-r from-orange-500 to-red-500 border-orange-500 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {index + 1 < currentStep ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                {index < stepIcons.length - 1 && (
                  <div
                    className={`w-full h-0.5 mx-4 ${
                      index + 1 < currentStep ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>
              Etapa {currentStep} de {totalSteps}
            </span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              {React.createElement(stepIcons[currentStep - 1].icon, { className: "h-6 w-6 text-orange-600" })}
              {currentStep === 1 && "Informações da Família"}
              {currentStep === 2 && "Membros da Família"}
              {currentStep === 3 && "Orçamento e Metas"}
              {currentStep === 4 && "Revisão e Finalização"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Defina o nome e descrição da sua família"}
              {currentStep === 2 && "Adicione os membros que farão parte do controle financeiro"}
              {currentStep === 3 && "Configure o orçamento mensal e metas de economia"}
              {currentStep === 4 && "Revise as informações e finalize a configuração"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Family Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="familyName">Nome da Família *</Label>
                  <Input
                    id="familyName"
                    placeholder="Ex: Família Silva"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="familyDescription">Descrição (opcional)</Label>
                  <Textarea
                    id="familyDescription"
                    placeholder="Descreva um pouco sobre sua família..."
                    value={familyDescription}
                    onChange={(e) => setFamilyDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">💡 Dica</h4>
                  <p className="text-sm text-orange-700">
                    O nome da família será usado em relatórios e notificações. Escolha algo que todos reconheçam
                    facilmente.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Family Members */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Membros da Família</h3>
                  <Button onClick={addMember} size="sm" className="bg-gradient-to-r from-orange-500 to-red-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Membro
                  </Button>
                </div>

                <div className="space-y-4">
                  {members.map((member, index) => (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-r from-orange-200 to-red-200">
                            {member.name
                              ? member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : `M${index + 1}`}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nome *</Label>
                            <Input
                              placeholder="Nome completo"
                              value={member.name}
                              onChange={(e) => updateMember(member.id, "name", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input
                              type="email"
                              placeholder="email@exemplo.com"
                              value={member.email}
                              onChange={(e) => updateMember(member.id, "email", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Função</Label>
                            <select
                              className="w-full p-2 border rounded-md"
                              value={member.role}
                              onChange={(e) => updateMember(member.id, "role", e.target.value)}
                            >
                              <option value="admin">Administrador</option>
                              <option value="member">Membro</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>Mesada (opcional)</Label>
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={member.allowance || ""}
                              onChange={(e) =>
                                updateMember(member.id, "allowance", Number.parseFloat(e.target.value) || 0)
                              }
                            />
                          </div>
                        </div>

                        {members.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeMember(member.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                          {member.role === "admin" ? "Administrador" : "Membro"}
                        </Badge>
                        {member.allowance && <Badge variant="outline">Mesada: R$ {member.allowance.toFixed(2)}</Badge>}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Budget & Goals */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-green-200">
                        <DollarSign className="h-5 w-5 text-green-700" />
                      </div>
                      <h3 className="font-semibold text-green-800">Orçamento Mensal</h3>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyBudget">Valor mensal disponível *</Label>
                      <Input
                        id="monthlyBudget"
                        type="number"
                        placeholder="0.00"
                        value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(e.target.value)}
                        className="text-lg"
                      />
                      <p className="text-sm text-green-700">Este será o limite de gastos mensais da família</p>
                    </div>
                  </Card>

                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-200">
                        <Target className="h-5 w-5 text-blue-700" />
                      </div>
                      <h3 className="font-semibold text-blue-800">Meta de Economia</h3>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="savingsGoal">Valor para economizar</Label>
                      <Input
                        id="savingsGoal"
                        type="number"
                        placeholder="0.00"
                        value={savingsGoal}
                        onChange={(e) => setSavingsGoal(e.target.value)}
                        className="text-lg"
                      />
                      <p className="text-sm text-blue-700">Meta mensal de economia (recomendado: 20% do orçamento)</p>
                    </div>
                  </Card>
                </div>

                {monthlyBudget && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3">Resumo do Orçamento</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Orçamento Total:</span>
                        <p className="font-semibold text-lg">R$ {Number.parseFloat(monthlyBudget).toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Meta de Economia:</span>
                        <p className="font-semibold text-lg text-blue-600">
                          R$ {(Number.parseFloat(savingsGoal) || 0).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Disponível para Gastos:</span>
                        <p className="font-semibold text-lg text-green-600">
                          R$ {(Number.parseFloat(monthlyBudget) - (Number.parseFloat(savingsGoal) || 0)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="p-4 rounded-full bg-green-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quase pronto!</h3>
                  <p className="text-gray-600">Revise as informações abaixo e finalize a configuração</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Informações da Família
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Nome:</span>
                        <p className="font-medium">{familyName}</p>
                      </div>
                      {familyDescription && (
                        <div>
                          <span className="text-gray-600">Descrição:</span>
                          <p className="font-medium">{familyDescription}</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Membros ({members.filter((m) => m.name && m.email).length})
                    </h4>
                    <div className="space-y-2">
                      {members
                        .filter((m) => m.name && m.email)
                        .map((member) => (
                          <div key={member.id} className="flex items-center gap-2 text-sm">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-gradient-to-r from-orange-200 to-red-200">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.name}</span>
                            <Badge variant={member.role === "admin" ? "default" : "secondary"} className="text-xs">
                              {member.role === "admin" ? "Admin" : "Membro"}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </Card>

                  <Card className="p-4 md:col-span-2">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Orçamento e Metas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Orçamento Mensal:</span>
                        <p className="font-semibold text-lg">R$ {Number.parseFloat(monthlyBudget || "0").toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Meta de Economia:</span>
                        <p className="font-semibold text-lg text-blue-600">
                          R$ {Number.parseFloat(savingsGoal || "0").toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">% para Economia:</span>
                        <p className="font-semibold text-lg text-green-600">
                          {monthlyBudget
                            ? (
                                (Number.parseFloat(savingsGoal || "0") / Number.parseFloat(monthlyBudget)) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 border-t">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              )}
              <Button variant="ghost" onClick={onSkip} className="text-gray-600">
                Pular configuração
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Finalizar Configuração
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default FamilySetup
