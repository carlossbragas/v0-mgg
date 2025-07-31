"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Settings, Users, User, Edit, Trash2, UserPlus, Copy } from "lucide-react"

interface FamilySettingsProps {
  onBack: () => void
}

export default function FamilySettings({ onBack }: FamilySettingsProps) {
  const [activeTab, setActiveTab] = useState<"family" | "members" | "preferences">("family")

  // Form state
  const [familyName, setFamilyName] = useState("Família Silva")
  const [userName, setUserName] = useState("João Silva")
  const [userEmail, setUserEmail] = useState("joao@email.com")
  const [newMember, setNewMember] = useState({ name: "", email: "" })
  const [currency, setCurrency] = useState("BRL")
  const [language, setLanguage] = useState("pt-BR")

  // Mock data
  const familyData = {
    name: "Família Silva",
    code: "FAM123456",
    admin: "João Silva",
    createdAt: "2024-01-01",
  }

  const members = [
    { id: 1, name: "João Silva", email: "joao@email.com", role: "admin", joinedAt: "2024-01-01" },
    { id: 2, name: "Maria Silva", email: "maria@email.com", role: "member", joinedAt: "2024-01-02" },
    { id: 3, name: "Pedro Silva", email: "pedro@email.com", role: "member", joinedAt: "2024-01-03" },
    { id: 4, name: "Ana Silva", email: "ana@email.com", role: "member", joinedAt: "2024-01-04" },
  ]

  const copyInviteCode = () => {
    navigator.clipboard.writeText(familyData.code)
    // Show toast notification
  }

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      // Add member logic here
      setNewMember({ name: "", email: "" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="bg-[#007A33] text-white p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-emerald-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Configurações</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-emerald-200">
        <div className="flex">
          <Button
            variant={activeTab === "family" ? "default" : "ghost"}
            onClick={() => setActiveTab("family")}
            className={`flex-1 rounded-none ${
              activeTab === "family" ? "bg-[#007A33] text-white" : "text-gray-600 hover:bg-emerald-50"
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Família
          </Button>
          <Button
            variant={activeTab === "members" ? "default" : "ghost"}
            onClick={() => setActiveTab("members")}
            className={`flex-1 rounded-none ${
              activeTab === "members" ? "bg-[#007A33] text-white" : "text-gray-600 hover:bg-emerald-50"
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Membros
          </Button>
          <Button
            variant={activeTab === "preferences" ? "default" : "ghost"}
            onClick={() => setActiveTab("preferences")}
            className={`flex-1 rounded-none ${
              activeTab === "preferences" ? "bg-[#007A33] text-white" : "text-gray-600 hover:bg-emerald-50"
            }`}
          >
            <User className="w-4 h-4 mr-2" />
            Perfil
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === "family" && (
          <>
            {/* Family Info */}
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Informações da Família</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="familyName">Nome da Família</Label>
                  <Input
                    id="familyName"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Código de Convite</Label>
                  <div className="flex gap-2">
                    <Input
                      value={familyData.code}
                      readOnly
                      className="rounded-xl border-2 border-emerald-200 font-mono text-center"
                    />
                    <Button
                      onClick={copyInviteCode}
                      variant="outline"
                      size="icon"
                      className="border-2 border-[#007A33] text-[#007A33] hover:bg-emerald-50 bg-transparent"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">Compartilhe este código para convidar novos membros</p>
                </div>

                <div className="space-y-2">
                  <Label>Administrador</Label>
                  <Input
                    value={familyData.admin}
                    readOnly
                    className="rounded-xl border-2 border-emerald-200 bg-gray-50"
                  />
                </div>

                <Button className="w-full bg-[#007A33] hover:bg-[#005A26] text-white rounded-xl">
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "members" && (
          <>
            {/* Add Member */}
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Convidar Novo Membro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Nome completo"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                  />
                  <Input
                    placeholder="E-mail"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                  />
                </div>
                <Button
                  onClick={handleAddMember}
                  className="w-full bg-[#007A33] hover:bg-[#005A26] text-white rounded-xl"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Enviar Convite
                </Button>
              </CardContent>
            </Card>

            {/* Members List */}
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Membros da Família</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#007A33] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.email}</p>
                        <p className="text-xs text-gray-500">
                          {member.role === "admin" ? "Administrador" : "Membro"} • Desde {member.joinedAt}
                        </p>
                      </div>
                    </div>
                    {member.role !== "admin" && (
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "preferences" && (
          <>
            {/* User Profile */}
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Meu Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Nome Completo</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userEmail">E-mail</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Papel na Família</Label>
                  <Input value="Administrador" readOnly className="rounded-xl border-2 border-emerald-200 bg-gray-50" />
                </div>

                <Button className="w-full bg-[#007A33] hover:bg-[#005A26] text-white rounded-xl">
                  Atualizar Perfil
                </Button>
              </CardContent>
            </Card>

            {/* App Preferences */}
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Preferências do App</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Moeda</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="rounded-xl border-2 border-emerald-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                      <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="rounded-xl border-2 border-emerald-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-[#007A33] hover:bg-[#005A26] text-white rounded-xl">
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-2 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Zona de Perigo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-xl bg-transparent"
                >
                  Sair da Família
                </Button>
                <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl">
                  Excluir Conta
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
