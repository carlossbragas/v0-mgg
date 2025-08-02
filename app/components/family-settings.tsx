"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Settings,
  Users,
  Plus,
  Trash2,
  Copy,
  Bell,
  Database,
  Download,
  Upload,
  Key,
  UserPlus,
  Crown,
} from "lucide-react"

interface FamilySettingsProps {
  user: any
  family: any
}

export function FamilySettings({ user, family }: FamilySettingsProps) {
  const [isInviting, setIsInviting] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")

  const [familyData, setFamilyData] = useState({
    name: family?.name || "Família Silva",
    description: family?.description || "Nossa família unida",
    code: family?.code || "FAM2024",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
  })

  const [members, setMembers] = useState([
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      role: "admin",
      avatar: "/placeholder-user.jpg",
      balance: 1250.75,
      joinedAt: new Date("2024-01-01"),
      lastActive: new Date("2024-01-15"),
      permissions: {
        viewAllTransactions: true,
        manageMembers: true,
        manageSettings: true,
        createTasks: true,
      },
    },
    {
      id: "2",
      name: "Maria Silva",
      email: "maria@email.com",
      role: "member",
      avatar: "/placeholder-user.jpg",
      balance: 850.0,
      joinedAt: new Date("2024-01-02"),
      lastActive: new Date("2024-01-14"),
      permissions: {
        viewAllTransactions: false,
        manageMembers: false,
        manageSettings: false,
        createTasks: true,
      },
    },
    {
      id: "3",
      name: "Ana Silva",
      email: "ana@email.com",
      role: "child",
      avatar: "/placeholder-user.jpg",
      balance: 45.5,
      joinedAt: new Date("2024-01-03"),
      lastActive: new Date("2024-01-15"),
      permissions: {
        viewAllTransactions: false,
        manageMembers: false,
        manageSettings: false,
        createTasks: false,
      },
    },
  ])

  const [notifications, setNotifications] = useState({
    newTransactions: true,
    taskReminders: true,
    weeklyReports: true,
    budgetAlerts: true,
    memberActivity: false,
  })

  const roles = [
    { value: "admin", label: "Administrador", icon: Crown, color: "text-yellow-600" },
    { value: "member", label: "Membro", icon: Users, color: "text-blue-600" },
    { value: "child", label: "Criança", icon: UserPlus, color: "text-green-600" },
  ]

  const handleInviteMember = () => {
    if (!inviteEmail) return

    // Simular convite
    console.log("Convite enviado para:", inviteEmail)
    setInviteEmail("")
    setIsInviting(false)
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((member) => member.id !== memberId))
  }

  const handleUpdateRole = (memberId: string, newRole: string) => {
    setMembers(
      members.map((member) =>
        member.id === memberId
          ? {
              ...member,
              role: newRole,
              permissions: {
                viewAllTransactions: newRole === "admin",
                manageMembers: newRole === "admin",
                manageSettings: newRole === "admin",
                createTasks: newRole !== "child",
              },
            }
          : member,
      ),
    )
  }

  const copyInviteCode = () => {
    navigator.clipboard.writeText(familyData.code)
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const getRoleIcon = (role: string) => {
    const roleConfig = roles.find((r) => r.value === role)
    if (!roleConfig) return Users
    return roleConfig.icon
  }

  const getRoleColor = (role: string) => {
    const roleConfig = roles.find((r) => r.value === role)
    return roleConfig?.color || "text-gray-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-amber-800 mb-2">Configurações da Família</h2>
        <p className="text-amber-600">Gerencie membros, permissões e configurações</p>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-amber-100">
          <TabsTrigger value="members" className="data-[state=active]:bg-amber-200">
            Membros
          </TabsTrigger>
          <TabsTrigger value="family" className="data-[state=active]:bg-amber-200">
            Família
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-amber-200">
            Notificações
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-amber-200">
            Dados
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-amber-600" />
                  <span className="text-amber-800">Membros da Família</span>
                </CardTitle>
                <Dialog open={isInviting} onOpenChange={setIsInviting}>
                  <DialogTrigger asChild>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Convidar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Convidar Novo Membro</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email do Convidado</Label>
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>

                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Key className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">Código da Família</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="bg-white px-3 py-2 rounded border text-lg font-mono">{familyData.code}</code>
                          <Button variant="outline" size="sm" onClick={copyInviteCode}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-amber-600 mt-2">
                          Compartilhe este código para que outros possam entrar na família
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={handleInviteMember} className="flex-1 bg-amber-600 hover:bg-amber-700">
                          Enviar Convite
                        </Button>
                        <Button variant="outline" onClick={() => setIsInviting(false)} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => {
                  const RoleIcon = getRoleIcon(member.role)
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-amber-800">{member.name}</h3>
                            <RoleIcon className={`w-4 h-4 ${getRoleColor(member.role)}`} />
                          </div>
                          <p className="text-sm text-amber-600">{member.email}</p>
                          <div className="flex items-center space-x-4 text-xs text-amber-500 mt-1">
                            <span>Saldo: {formatCurrency(member.balance)}</span>
                            <span>•</span>
                            <span>Ativo: {member.lastActive.toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`border-amber-300 ${getRoleColor(member.role)}`}>
                          {roles.find((r) => r.value === member.role)?.label}
                        </Badge>

                        {user?.role === "admin" && member.id !== user?.id && (
                          <>
                            <Select value={member.role} onValueChange={(value) => handleUpdateRole(member.id, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem key={role.value} value={role.value}>
                                    {role.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Family Tab */}
        <TabsContent value="family" className="space-y-4">
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-6 h-6 text-amber-600" />
                <span className="text-amber-800">Informações da Família</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Família</Label>
                  <Input
                    value={familyData.name}
                    onChange={(e) => setFamilyData({ ...familyData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Código da Família</Label>
                  <div className="flex items-center space-x-2">
                    <Input value={familyData.code} readOnly />
                    <Button variant="outline" size="sm" onClick={copyInviteCode}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Moeda</Label>
                  <Select
                    value={familyData.currency}
                    onValueChange={(value) => setFamilyData({ ...familyData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fuso Horário</Label>
                  <Select
                    value={familyData.timezone}
                    onValueChange={(value) => setFamilyData({ ...familyData, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={familyData.description}
                  onChange={(e) => setFamilyData({ ...familyData, description: e.target.value })}
                />
              </div>

              <Button className="bg-amber-600 hover:bg-amber-700">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-6 h-6 text-amber-600" />
                <span className="text-amber-800">Notificações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-amber-800">
                      {key === "newTransactions" && "Novas Transações"}
                      {key === "taskReminders" && "Lembretes de Tarefas"}
                      {key === "weeklyReports" && "Relatórios Semanais"}
                      {key === "budgetAlerts" && "Alertas de Orçamento"}
                      {key === "memberActivity" && "Atividade dos Membros"}
                    </h4>
                    <p className="text-sm text-amber-600">
                      {key === "newTransactions" && "Receba notificações sobre novas transações"}
                      {key === "taskReminders" && "Lembretes sobre tarefas pendentes"}
                      {key === "weeklyReports" && "Relatório semanal de gastos"}
                      {key === "budgetAlerts" && "Alertas quando o orçamento for ultrapassado"}
                      {key === "memberActivity" && "Notificações sobre atividade dos membros"}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-4">
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-6 h-6 text-amber-600" />
                <span className="text-amber-800">Gerenciar Dados</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col border-amber-300 text-amber-700 bg-transparent">
                  <Download className="w-6 h-6 mb-2" />
                  Exportar Dados
                  <span className="text-xs">Baixar backup completo</span>
                </Button>

                <Button variant="outline" className="h-20 flex-col border-amber-300 text-amber-700 bg-transparent">
                  <Upload className="w-6 h-6 mb-2" />
                  Importar Dados
                  <span className="text-xs">Restaurar backup</span>
                </Button>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Zona de Perigo</h4>
                <p className="text-sm text-red-600 mb-4">
                  Estas ações são irreversíveis. Tenha certeza antes de prosseguir.
                </p>
                <div className="space-y-2">
                  <Button variant="destructive" size="sm">
                    Limpar Todos os Dados
                  </Button>
                  <Button variant="destructive" size="sm">
                    Excluir Família
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FamilySettings
