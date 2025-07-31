"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, User, Mail, Users } from "lucide-react"

interface FamilySetupScreenProps {
  onFamilySetup: (familyData: any) => void
}

export default function FamilySetupScreen({ onFamilySetup }: FamilySetupScreenProps) {
  const [tab, setTab] = useState("create") // 'create' or 'join'
  const [familyName, setFamilyName] = useState("")
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [inviteCode, setInviteCode] = useState("")

  const handleCreateFamily = (e: React.FormEvent) => {
    e.preventDefault()
    onFamilySetup({ familyName, adminName, adminEmail, type: "create" })
  }

  const handleJoinFamily = (e: React.FormEvent) => {
    e.preventDefault()
    onFamilySetup({ inviteCode, type: "join" })
  }

  return (
    <Card className="w-full max-w-sm bg-white text-[#007A33] rounded-lg shadow-lg p-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold mb-4">Configurar Família</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200 rounded-lg p-1 mb-4">
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2"
            >
              Criar Nova Família
            </TabsTrigger>
            <TabsTrigger
              value="join"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2"
            >
              Entrar em Família
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <form onSubmit={handleCreateFamily} className="space-y-4">
              <div>
                <Label htmlFor="family-name" className="flex items-center gap-2 mb-1">
                  <Home className="h-4 w-4" /> Nome da Família
                </Label>
                <Input
                  id="family-name"
                  type="text"
                  placeholder="Ex: Família Silva"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  required
                  className="border-[#007A33] focus:ring-[#007A33]"
                />
              </div>
              <div>
                <Label htmlFor="admin-name" className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4" /> Seu Nome (Admin)
                </Label>
                <Input
                  id="admin-name"
                  type="text"
                  placeholder="Seu nome"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                  className="border-[#007A33] focus:ring-[#007A33]"
                />
              </div>
              <div>
                <Label htmlFor="admin-email" className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4" /> Seu E-mail (Admin)
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  className="border-[#007A33] focus:ring-[#007A33]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#007A33] hover:bg-[#005F28] text-white font-bold py-3 rounded-lg text-lg transition-colors"
              >
                Criar Família
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="join" className="space-y-4">
            <form onSubmit={handleJoinFamily} className="space-y-4">
              <div>
                <Label htmlFor="invite-code" className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4" /> Código de Convite
                </Label>
                <Input
                  id="invite-code"
                  type="text"
                  placeholder="Insira o código"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                  className="border-[#007A33] focus:ring-[#007A33]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#007A33] hover:bg-[#005F28] text-white font-bold py-3 rounded-lg text-lg transition-colors"
              >
                Entrar na Família
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
