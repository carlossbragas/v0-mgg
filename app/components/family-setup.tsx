"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Plus, UserPlus } from "lucide-react"

interface FamilySetupProps {
  onComplete: () => void
  onBack: () => void
}

export default function FamilySetup({ onComplete, onBack }: FamilySetupProps) {
  const [step, setStep] = useState<"choice" | "create" | "join" | "members">("choice")
  const [familyData, setFamilyData] = useState({
    name: "",
    code: "",
    adminEmail: "",
  })
  const [members, setMembers] = useState([{ name: "Você (Admin)", email: "admin@email.com", role: "admin" }])

  const handleCreateFamily = () => {
    setStep("members")
  }

  const handleJoinFamily = () => {
    setStep("members")
  }

  const addMember = () => {
    setMembers([...members, { name: "", email: "", role: "member" }])
  }

  if (step === "choice") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="bg-[#007A33] text-white p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-emerald-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Configurar Família</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-md mx-auto text-center mb-8">
            <Users className="w-16 h-16 text-[#007A33] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Vamos configurar sua família</h2>
            <p className="text-gray-600">Crie uma nova família ou entre em uma existente</p>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <Card
              className="border-2 border-emerald-200 cursor-pointer hover:bg-emerald-50 transition-colors"
              onClick={() => setStep("create")}
            >
              <CardContent className="p-6 text-center">
                <Plus className="w-12 h-12 text-[#007A33] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Criar Nova Família</h3>
                <p className="text-gray-600 text-sm">Seja o administrador e convide seus familiares</p>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-emerald-200 cursor-pointer hover:bg-emerald-50 transition-colors"
              onClick={() => setStep("join")}
            >
              <CardContent className="p-6 text-center">
                <UserPlus className="w-12 h-12 text-[#007A33] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Entrar em Família</h3>
                <p className="text-gray-600 text-sm">Use o código de convite que você recebeu</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (step === "create") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="bg-[#007A33] text-white p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setStep("choice")}
              className="text-white hover:bg-emerald-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Criar Família</h1>
          </div>
        </div>

        <div className="p-6">
          <Card className="max-w-md mx-auto border-2 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-center text-xl text-gray-800">Nova Família</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="familyName">Nome da Família</Label>
                <Input
                  id="familyName"
                  placeholder="Ex: Família Silva"
                  value={familyData.name}
                  onChange={(e) => setFamilyData({ ...familyData, name: e.target.value })}
                  className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Seu E-mail (Administrador)</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@email.com"
                  value={familyData.adminEmail}
                  onChange={(e) => setFamilyData({ ...familyData, adminEmail: e.target.value })}
                  className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                />
              </div>

              <Button
                onClick={handleCreateFamily}
                className="w-full bg-[#007A33] hover:bg-[#005A26] text-white font-semibold py-3 rounded-xl"
              >
                Criar Família
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "join") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="bg-[#007A33] text-white p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setStep("choice")}
              className="text-white hover:bg-emerald-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Entrar em Família</h1>
          </div>
        </div>

        <div className="p-6">
          <Card className="max-w-md mx-auto border-2 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-center text-xl text-gray-800">Código de Convite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteCode">Código da Família</Label>
                <Input
                  id="inviteCode"
                  placeholder="Ex: FAM123456"
                  value={familyData.code}
                  onChange={(e) => setFamilyData({ ...familyData, code: e.target.value })}
                  className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33] text-center text-lg font-mono"
                />
              </div>

              <Button
                onClick={handleJoinFamily}
                className="w-full bg-[#007A33] hover:bg-[#005A26] text-white font-semibold py-3 rounded-xl"
              >
                Entrar na Família
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="bg-[#007A33] text-white p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStep("choice")}
            className="text-white hover:bg-emerald-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Membros da Família</h1>
        </div>
      </div>

      <div className="p-6">
        <Card className="max-w-md mx-auto border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-center text-xl text-gray-800">Adicionar Membros</CardTitle>
            <p className="text-center text-gray-600 text-sm">Convide familiares para participar</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {members.map((member, index) => (
              <div key={index} className="p-3 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-[#007A33]" />
                  <span className="text-sm font-semibold text-gray-700">
                    {member.role === "admin" ? "Administrador" : "Membro"}
                  </span>
                </div>
                <p className="text-sm text-gray-800 font-medium">{member.name}</p>
                <p className="text-xs text-gray-600">{member.email}</p>
              </div>
            ))}

            <Button
              onClick={addMember}
              variant="outline"
              className="w-full border-2 border-[#007A33] text-[#007A33] hover:bg-emerald-50 rounded-xl bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Membro
            </Button>

            <Button
              onClick={onComplete}
              className="w-full bg-[#007A33] hover:bg-[#005A26] text-white font-semibold py-3 rounded-xl"
            >
              Finalizar Configuração
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
