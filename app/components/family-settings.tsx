"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Settings, Users, Copy, UserPlus, Trash2, Crown } from "lucide-react"
import { toast } from "sonner"

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

interface FamilySettingsProps {
  user: User
  family: Family | null
}

export function FamilySettings({ user, family }: FamilySettingsProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [familyName, setFamilyName] = useState(family?.name || "")

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inviteEmail) {
      toast.error("Digite um email válido")
      return
    }

    toast.success(`Convite enviado para ${inviteEmail}!`)
    setInviteEmail("")
    setShowInviteDialog(false)
  }

  const handleRemoveMember = (memberId: string, memberName: string) => {
    toast.success(`${memberName} foi removido da família`)
  }

  const handleUpdateFamilyName = () => {
    if (!familyName.trim()) {
      toast.error("Nome da família não pode estar vazio")
      return
    }

    toast.success("Nome da família atualizado!")
  }

  const copyInviteCode = () => {
    if (family?.id) {
      navigator.clipboard.writeText(family.id)
      toast.success("Código de convite copiado!")
    }
  }

  const isAdmin = user.role === "admin"

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Configurações da Família */}
      <Card className="retro-shadow">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações da Família
          </CardTitle>
          <CardDescription className="text-sm">
            Gerencie as configurações e membros da sua família
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="family-name" className="text-sm font-medium">Nome da Família</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                id="family-name"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="Nome da família"
                disabled={!isAdmin}
                className="flex-1 h-11"
              />
              {isAdmin && (
                <Button
                  onClick={handleUpdateFamilyName}
                  className="bg-retro-blue hover:bg-retro-blue/90 w-full sm:w-auto"
                >
                  Salvar
                </Button>
              )}
            </div>
          </div>

          {family && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Código de Convite</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={family.id}
                  readOnly
                  className="flex-1 h-11 bg-muted"
                />
                <Button
                  onClick={copyInviteCode}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Compartilhe este código para convidar novos membros
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Membros da Família */}
      <Card className="retro-shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Users className="h-5 w-5" />
                Membros da Família
              </CardTitle>
              <CardDescription className="text-sm">
                {family?.members.length || 0} membro{(family?.members.length || 0) !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            {isAdmin && (
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-retro-green hover:bg-retro-green/90 w-full sm:w-auto">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Convidar Membro
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle>Convidar Novo Membro</DialogTitle>
                    <DialogDescription>
                      Digite o email da pessoa que você deseja convidar
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInviteMember} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="invite-email">Email *</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        placeholder="exemplo@email.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowInviteDialog(false)}
                        className="flex-1 h-11 order-2 sm:order-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-11 bg-retro-green hover:bg-retro-green/90 order-1 sm:order-2"
                      >
                        Enviar Convite
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {family?.members && family.members.length > 0 ? (
            <div className="space-y-3">
              {family.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-retro-purple text-white">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm sm:text-base">{member.name}</p>
                        {member.role === "admin" && <Crown className="h-4 w-4 text-yellow-500" />}
                        {member.id === user.id && (
                          <Badge variant="secondary" className="text-xs">
                            Você
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{member.email}</p>
                      <Badge
                        variant={member.role === "admin" ? "default" : "secondary"}
                        className="text-xs mt-1"
                      >
                        {member.role === "admin" ? "Administrador" : "Membro"}
                      </Badge>
                    </div>
                  </div>

                  {isAdmin && member.id !== user.id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="mx-4">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover Membro</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover {member.name} da família? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveMember(member.id, member.name)}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">👥</div>
              <p className="text-muted-foreground">Nenhum membro na família ainda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações de Conta */}
      <Card className="retro-shadow">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Minha Conta</CardTitle>
          <CardDescription className="text-sm">Configurações da sua conta pessoal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-sm sm:text-base">Nome</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-sm sm:text-base">Email</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-sm sm:text-base">Função</p>
              <Badge
                variant={user.role === "admin" ? "default" : "secondary"}
                className="text-xs mt-1"
              >
                {user.role === "admin" ? "Administrador" : "Membro"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zona de Perigo */}
      {isAdmin && (
        <Card className="retro-shadow border-red-200">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-red-600">Zona de Perigo</CardTitle>
            <CardDescription className="text-sm">
              Ações irreversíveis que afetam toda a família
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  Excluir Família
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="mx-4">
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Família</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir esta família? Todos os dados, gastos e configurações
                    serão perdidos permanentemente. Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
                    Excluir Família
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
