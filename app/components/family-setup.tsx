"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, UserPlus, Home, Key, CheckCircle, ArrowRight, GroupIcon as Family } from "lucide-react"

interface FamilySetupProps {
  onSetup: (familyData: any) => void
}

export function FamilySetup({ onSetup }: FamilySetupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  // Estados para criar família
  const [createFamilyData, setCreateFamilyData] = useState({
    familyName: "",
    description: "",
  })

  // Estados para entrar em família
  const [joinFamilyData, setJoinFamilyData] = useState({
    familyCode: "",
  })

  // Função para criar família
  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!createFamilyData.familyName.trim()) {
        throw new Error("Nome da família é obrigatório")
      }

      // Gerar código da família
      const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase()

      const familyData = {
        id: "family-1",
        name: createFamilyData.familyName,
        code: familyCode,
        description: createFamilyData.description,
        adminId: "1",
        members: [
          {
            id: "1",
            name: "João Silva",
            email: "joao@email.com",
            role: "admin",
            balance: 0,
          },
        ],
        createdAt: new Date(),
      }

      onSetup(familyData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Função para entrar em família
  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!joinFamilyData.familyCode.trim()) {
        throw new Error("Código da família é obrigatório")
      }

      // Simular busca da família
      const familyData = {
        id: "family-2",
        name: "Família Silva",
        code: joinFamilyData.familyCode,
        description: "Nossa família unida",
        adminId: "2",
        members: [
          {
            id: "2",
            name: "Maria Silva",
            email: "maria@email.com",
            role: "admin",
            balance: 1500.0,
          },
          {
            id: "1",
            name: "João Silva",
            email: "joao@email.com",
            role: "member",
            balance: 0,
          },
        ],
        createdAt: new Date(),
      }

      onSetup(familyData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Family className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Configurar Família
          </h1>
          <p className="text-gray-600 mt-2">Crie uma nova família ou entre em uma existente</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? "bg-orange-500" : "bg-gray-200"}`} />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-gray-800">Como você quer começar?</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="create" className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Criar Família</span>
                  </TabsTrigger>
                  <TabsTrigger value="join" className="flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Entrar em Família</span>
                  </TabsTrigger>
                </TabsList>

                {/* Criar Família */}
                <TabsContent value="create">
                  <form onSubmit={handleCreateFamily} className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Home className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Criar Nova Família</h3>
                      <p className="text-sm text-gray-600">Você será o administrador da família</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="family-name">Nome da Família *</Label>
                        <Input
                          id="family-name"
                          type="text"
                          placeholder="Ex: Família Silva"
                          value={createFamilyData.familyName}
                          onChange={(e) =>
                            setCreateFamilyData({
                              ...createFamilyData,
                              familyName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="family-description">Descrição (Opcional)</Label>
                        <Input
                          id="family-description"
                          type="text"
                          placeholder="Ex: Nossa família unida e organizada"
                          value={createFamilyData.description}
                          onChange={(e) =>
                            setCreateFamilyData({
                              ...createFamilyData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-orange-800">Como administrador, você poderá:</p>
                          <ul className="text-xs text-orange-700 mt-1 space-y-1">
                            <li>• Convidar e gerenciar membros</li>
                            <li>• Configurar permissões e mesadas</li>
                            <li>• Visualizar todas as transações</li>
                            <li>• Gerar relatórios completos</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Criando família..." : "Criar Família"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>

                {/* Entrar em Família */}
                <TabsContent value="join">
                  <form onSubmit={handleJoinFamily} className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Key className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Entrar em Família Existente</h3>
                      <p className="text-sm text-gray-600">Use o código fornecido pelo administrador</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="family-code">Código da Família *</Label>
                        <Input
                          id="family-code"
                          type="text"
                          placeholder="Ex: ABC123"
                          className="text-center text-lg font-mono tracking-wider"
                          value={joinFamilyData.familyCode}
                          onChange={(e) =>
                            setJoinFamilyData({
                              ...joinFamilyData,
                              familyCode: e.target.value.toUpperCase(),
                            })
                          }
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Ao entrar na família, você terá acesso a:</p>
                          <ul className="text-xs text-blue-700 mt-1 space-y-1">
                            <li>• Sua carteira pessoal</li>
                            <li>• Tarefas e lista de compras compartilhadas</li>
                            <li>• Controle de dispositivos IoT</li>
                            <li>• Relatórios de gastos pessoais</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando na família..." : "Entrar na Família"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    {/* Demo Code */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-2">Para demonstração, use o código:</p>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setJoinFamilyData({ familyCode: "DEMO01" })}
                      >
                        DEMO01
                      </Badge>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default FamilySetup
