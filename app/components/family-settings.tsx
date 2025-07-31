"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Users, Home, Plus, Edit, Trash2, Copy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface FamilySettingsProps {
  family: {
    id: string
    name: string
    inviteCode: string
    members: { id: string; name: string; email: string; role: string }[]
  } | null
  currentUser: { id: string; name: string; email: string; role: string } | null
}

export default function FamilySettings({ family, currentUser }: FamilySettingsProps) {
  const [familyName, setFamilyName] = useState(family?.name || "")
  const [currency, setCurrency] = useState("BRL")
  const [language, setLanguage] = useState("pt-BR")
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("member")
  const [familyMembers, setFamilyMembers] = useState(family?.members || [])

  useEffect(() => {
    if (family) {
      setFamilyName(family.name)
      setFamilyMembers(family.members)
    }
  }, [family])

  const handleUpdateFamilyName = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Nome da família atualizado para: ${familyName} (Mock)`)
    // Implement actual update logic
  }

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberName || !newMemberEmail) {
      alert("Nome e e-mail do novo membro são obrigatórios.")
      return
    }
    const newMember = {
      id: `user${familyMembers.length + 1}`, // Mock ID
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
    }
    setFamilyMembers((prev) => [...prev, newMember])
    setNewMemberName("")
    setNewMemberEmail("")
    setNewMemberRole("member")
    alert(`Membro ${newMemberName} adicionado! (Mock)`)
    // Implement actual add member logic
  }

  const handleEditMember = (memberId: string) => {
    alert(`Editar membro: ${memberId}`)
    // Implement actual edit member logic (e.g., open a dialog with pre-filled data)
  }

  const handleDeleteMember = (memberId: string) => {
    if (confirm("Tem certeza que deseja remover este membro da família?")) {
      setFamilyMembers((prev) => prev.filter((member) => member.id !== memberId))
      alert(`Membro ${memberId} removido! (Mock)`)
      // Implement actual delete member logic
    }
  }

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(family?.inviteCode || "").then(() => {
      alert("Código de convite copiado para a área de transferência!")
    })
  }

  return (
    <Card className="w-full bg-white text-[#007A33] rounded-lg shadow-lg">
      <CardHeader className="text-center border-b pb-4">
        <CardTitle className="text-2xl font-bold">Configurações da Família</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Family Name */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <Home className="h-5 w-5" /> Nome da Família
          </h3>
          <form onSubmit={handleUpdateFamilyName} className="flex gap-2">
            <Input
              id="family-name-setting"
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              required
              className="flex-1 border-[#007A33] focus:ring-[#007A33]"
            />
            <Button type="submit" className="bg-[#007A33] hover:bg-[#005F28] text-white">
              <Edit className="h-4 w-4 mr-2" /> Salvar
            </Button>
          </form>
        </div>

        {/* Invite Code */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <Users className="h-5 w-5" /> Código de Convite
          </h3>
          <div className="flex gap-2">
            <Input
              id="invite-code-setting"
              type="text"
              value={family?.inviteCode || "N/A"}
              readOnly
              className="flex-1 bg-gray-100 border-gray-300 text-gray-700"
            />
            <Button
              type="button"
              onClick={handleCopyInviteCode}
              className="bg-gray-200 hover:bg-gray-300 text-[#007A33]"
            >
              <Copy className="h-4 w-4 mr-2" /> Copiar
            </Button>
          </div>
          <p className="text-sm text-gray-500">Compartilhe este código para convidar novos membros para sua família.</p>
        </div>

        {/* Members List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <Users className="h-5 w-5" /> Membros da Família
          </h3>
          <div className="space-y-3">
            {familyMembers.map((member) => (
              <Card key={member.id} className="p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={`/placeholder-user.jpg?name=${member.name}`} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    <p className="text-xs text-gray-400 capitalize">{member.role}</p>
                  </div>
                </div>
                {currentUser?.role === "admin" && member.id !== currentUser?.id && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditMember(member.id)}
                      className="text-blue-500 border-blue-500 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-500 border-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {currentUser?.role === "admin" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-[#007A33] hover:bg-[#005F28] text-white flex items-center gap-2 mt-4">
                  <Plus className="h-5 w-5" /> Convidar Novo Membro
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Convidar Novo Membro</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddMember} className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="new-member-name" className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4" /> Nome
                    </Label>
                    <Input
                      id="new-member-name"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="Nome do membro"
                      required
                      className="border-[#007A33] focus:ring-[#007A33]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-member-email" className="flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4" /> E-mail
                    </Label>
                    <Input
                      id="new-member-email"
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      required
                      className="border-[#007A33] focus:ring-[#007A33]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-member-role" className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4" /> Papel
                    </Label>
                    <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                      <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                        <SelectValue placeholder="Selecione o papel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Membro</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="bg-[#007A33] hover:bg-[#005F28] text-white mt-4">
                    Adicionar Membro
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Preferences */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <Edit className="h-5 w-5" /> Preferências
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency" className="mb-1">
                Moeda
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                  <SelectValue placeholder="Selecione a moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
                  <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language" className="mb-1">
                Idioma
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full border-[#007A33] focus:ring-[#007A33]">
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español (España)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => alert("Preferências salvas! (Mock)")}
            className="bg-[#007A33] hover:bg-[#005F28] text-white mt-4"
          >
            Salvar Preferências
          </Button>
        </div>

        {/* User Profile (simplified, full profile in separate screen if needed) */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <User className="h-5 w-5" /> Seu Perfil
          </h3>
          <Card className="p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={`/placeholder-user.jpg?name=${currentUser?.name}`} />
                <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-800">{currentUser?.name}</p>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
                <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => alert("Editar perfil (Mock)")}
                className="text-blue-500 border-blue-500 hover:bg-blue-50"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => alert("Excluir conta (Mock)")}
                className="text-red-500 border-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
