"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Users, Plus, Trash2 } from "lucide-react"

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

interface FamilySetupProps {
  user: User
  onFamilySetup: (family: Family) => void
}

export function FamilySetup({ user, onFamilySetup }: FamilySetupProps) {
  const [familyName, setFamilyName] = useState("")
  const [members, setMembers] = useState<{ name: string; email: string }[]>([])
  const [newMember, setNewMember] = useState({ name: "", email: "" })

  const addMember = () => {
    if (newMember.name && newMember.email) {
      setMembers([...members, newMember])
      setNewMember({ name: "", email: "" })
      toast.success("Membro adicionado!")
    } else {
      toast.error("Preencha nome e email do membro")
    }
  }

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
    toast.success("Membro removido!")
  }

  const handleSetupFamily = (e: React.FormEvent) => {
    e.preventDefault()

    if (!familyName) {
      toast.error("Digite o nome da família")
      return
    }

    const familyMembers: User[] = [
      user,
      ...members.map((member, index) => ({
        id: `member-${index + 1}`,
        name: member.name,
        email: member.email,
        role: "member" as const,
        familyId: "family-1",
      })),
    ]

    const family: Family = {
      id: "family-1",
      name: familyName,
      adminId: user.id,
      members: familyMembers,
    }

    toast.success("Família configurada com sucesso!")
    onFamilySetup(family)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 retro-gradient">
      <Card className="w-full max-w-2xl retro-shadow retro-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 bg-retro-blue rounded-full flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold font-retro">Configurar Família</CardTitle>
          <CardDescription>Configure sua família para começar a usar o MinhaGrana</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetupFamily} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="family-name">Nome da Família</Label>
              <Input
                id="family-name"
                placeholder="Ex: Família Silva"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Membros da Família</Label>

              {/* Admin sempre presente */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.name} (Você)</p>
                    <p className="text-sm text-muted-foreground">{user.email} • Administrador</p>
                  </div>
                  <div className="bg-retro-orange text-white px-2 py-1 rounded text-xs font-bold">ADMIN</div>
                </div>
              </div>

              {/* Membros adicionados */}
              {members.map((member, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email} • Membro</p>
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeMember(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Adicionar novo membro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder="Nome do membro"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Email do membro"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
                <Button type="button" onClick={addMember} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-retro-green hover:bg-retro-green/90">
              Criar Família
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
