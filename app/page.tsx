"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Mail, Home, Users, Wallet, ListTodo, ShoppingCart, Lightbulb } from "lucide-react"
import Dashboard from "./components/dashboard"
import MemberWallet from "./components/member-wallet"
import FamilySettings from "./components/family-settings"
import TasksList from "./components/tasks-list"
import ShoppingList from "./components/shopping-list"
import IotControl from "./components/iot-control"

export default function HomePage() {
  const [screen, setScreen] = useState("home") // 'home', 'login', 'register', 'family-setup', 'dashboard', 'wallet', 'settings', 'tasks', 'shopping', 'iot'
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentFamily, setCurrentFamily] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const handleLogin = (email: string) => {
    // Mock login logic
    console.log("Attempting login for:", email)
    setIsLoggedIn(true)
    // Mock user and family data
    setCurrentUser({
      id: "user1",
      name: "Administrador",
      email: email,
      role: "admin",
    })
    setCurrentFamily({
      id: "family1",
      name: "Família Silva",
      inviteCode: "ABC123XYZ",
      members: [
        { id: "user1", name: "Administrador", email: email, role: "admin" },
        { id: "user2", name: "Maria", email: "maria@example.com", role: "member" },
        { id: "user3", name: "Pedro", email: "pedro@example.com", role: "member" },
      ],
    })
    setScreen("dashboard")
  }

  const handleRegister = (email: string) => {
    // Mock register logic
    console.log("Attempting registration for:", email)
    setScreen("family-setup")
  }

  const handleFamilySetup = (familyData: any) => {
    // Mock family setup logic
    console.log("Family setup complete:", familyData)
    setIsLoggedIn(true)
    setCurrentUser({
      id: "user1",
      name: familyData.adminName,
      email: familyData.adminEmail,
      role: "admin",
    })
    setCurrentFamily({
      id: "family1",
      name: familyData.familyName,
      inviteCode: "ABC123XYZ", // Mock invite code
      members: [
        {
          id: "user1",
          name: familyData.adminName,
          email: familyData.adminEmail,
          role: "admin",
        },
      ],
    })
    setScreen("dashboard")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentFamily(null)
    setCurrentUser(null)
    setScreen("home")
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#007A33] to-[#005F28] p-4 text-white font-sans">
        {screen === "home" && (
          <Card className="w-full max-w-sm bg-white text-[#007A33] rounded-lg shadow-lg p-6 text-center">
            <CardHeader>
              <img src="/placeholder-logo.png" alt="MinhaGrana Logo" className="mx-auto mb-4 h-24 w-24" />
              <CardTitle className="text-4xl font-bold mb-2">MinhaGrana</CardTitle>
              <p className="text-lg text-gray-600">Sua família no controle financeiro.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full bg-[#007A33] hover:bg-[#005F28] text-white font-bold py-3 rounded-lg text-lg transition-colors"
                onClick={() => setScreen("login")}
              >
                Entrar
              </Button>
              <Button
                className="w-full bg-gray-200 hover:bg-gray-300 text-[#007A33] font-bold py-3 rounded-lg text-lg transition-colors"
                onClick={() => setScreen("register")}
              >
                Criar conta
              </Button>
            </CardContent>
          </Card>
        )}

        {screen === "login" && <LoginScreen onLogin={handleLogin} onGoToRegister={() => setScreen("register")} />}

        {screen === "register" && <RegisterScreen onRegister={handleRegister} onGoToLogin={() => setScreen("login")} />}

        {screen === "family-setup" && <FamilySetupScreen onFamilySetup={handleFamilySetup} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="bg-[#007A33] text-white p-4 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold">MinhaGrana</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg">{currentUser?.name}</span>
          <Button variant="ghost" className="text-white hover:bg-[#005F28]" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4">
        <Tabs value={screen} onValueChange={setScreen} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-7 bg-gray-200 rounded-lg p-1 mb-4">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2 flex flex-col items-center text-sm"
            >
              <Home className="h-5 w-5 mb-1" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2 flex flex-col items-center text-sm"
            >
              <Wallet className="h-5 w-5 mb-1" />
              Carteira
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2 flex flex-col items-center text-sm"
            >
              <ListTodo className="h-5 w-5 mb-1" />
              Tarefas
            </TabsTrigger>
            <TabsTrigger
              value="shopping"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2 flex flex-col items-center text-sm"
            >
              <ShoppingCart className="h-5 w-5 mb-1" />
              Compras
            </TabsTrigger>
            <TabsTrigger
              value="iot"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2 flex flex-col items-center text-sm"
            >
              <Lightbulb className="h-5 w-5 mb-1" />
              IoT
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2 flex flex-col items-center text-sm"
            >
              <Users className="h-5 w-5 mb-1" />
              Família
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard family={currentFamily} currentUser={currentUser} />
          </TabsContent>
          <TabsContent value="wallet">
            <MemberWallet currentUser={currentUser} />
          </TabsContent>
          <TabsContent value="tasks">
            <TasksList familyMembers={currentFamily?.members || []} />
          </TabsContent>
          <TabsContent value="shopping">
            <ShoppingList />
          </TabsContent>
          <TabsContent value="iot">
            <IotControl />
          </TabsContent>
          <TabsContent value="settings">
            <FamilySettings family={currentFamily} currentUser={currentUser} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function LoginScreen({ onLogin, onGoToRegister }: { onLogin: (email: string) => void; onGoToRegister: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(email)
  }

  return (
    <Card className="w-full max-w-sm bg-white text-[#007A33] rounded-lg shadow-lg p-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold mb-4">Entrar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email-login" className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4" /> E-mail
            </Label>
            <Input
              id="email-login"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#007A33] focus:ring-[#007A33]"
            />
          </div>
          <div>
            <Label htmlFor="password-login" className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4" /> Senha
            </Label>
            <Input
              id="password-login"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#007A33] focus:ring-[#007A33]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#007A33] hover:bg-[#005F28] text-white font-bold py-3 rounded-lg text-lg transition-colors"
          >
            Entrar
          </Button>
        </form>
        <Button
          variant="link"
          className="w-full text-[#007A33] hover:text-[#005F28]"
          onClick={() => alert('Funcionalidade "Esqueci a senha" em desenvolvimento!')}
        >
          Esqueci a senha
        </Button>
        <div className="text-center text-gray-600">
          Não tem uma conta?{" "}
          <Button variant="link" className="text-[#007A33] hover:text-[#005F28]" onClick={onGoToRegister}>
            Criar conta
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function RegisterScreen({ onRegister, onGoToLogin }: { onRegister: (email: string) => void; onGoToLogin: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }
    onRegister(email)
  }

  return (
    <Card className="w-full max-w-sm bg-white text-[#007A33] rounded-lg shadow-lg p-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold mb-4">Criar Conta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email-register" className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4" /> E-mail
            </Label>
            <Input
              id="email-register"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#007A33] focus:ring-[#007A33]"
            />
          </div>
          <div>
            <Label htmlFor="password-register" className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4" /> Senha
            </Label>
            <Input
              id="password-register"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#007A33] focus:ring-[#007A33]"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password-register" className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4" /> Confirmar Senha
            </Label>
            <Input
              id="confirm-password-register"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border-[#007A33] focus:ring-[#007A33]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#007A33] hover:bg-[#005F28] text-white font-bold py-3 rounded-lg text-lg transition-colors"
          >
            Criar Conta
          </Button>
        </form>
        <div className="text-center text-gray-600">
          Já tem uma conta?{" "}
          <Button variant="link" className="text-[#007A33] hover:text-[#005F28]" onClick={onGoToLogin}>
            Entrar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function FamilySetupScreen({ onFamilySetup }: { onFamilySetup: (familyData: any) => void }) {
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
