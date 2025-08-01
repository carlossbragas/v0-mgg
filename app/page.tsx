"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeIcon, UsersIcon, WalletIcon, ListTodoIcon, ShoppingCartIcon, LightbulbIcon } from "lucide-react"
import Dashboard from "./components/dashboard"
import MemberWallet from "./components/member-wallet"
import FamilySettings from "./components/family-settings"
import TasksList from "./components/tasks-list"
import ShoppingList from "./components/shopping-list"
import IotControl from "./components/iot-control"
import LoginScreen from "./components/login-screen"
import FamilySetup from "./components/family-setup"

interface UserData {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  familyId?: string
}

interface FamilyData {
  id: string
  name: string
  adminId: string
  members: UserData[]
}

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null)
  const [family, setFamily] = useState<FamilyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de dados do localStorage
    const savedUser = localStorage.getItem("user")
    const savedFamily = localStorage.getItem("family")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedFamily) {
      setFamily(JSON.parse(savedFamily))
    }

    setLoading(false)
  }, [])

  const handleLogin = (userData: UserData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleFamilySetup = (familyData: FamilyData) => {
    setFamily(familyData)
    localStorage.setItem("family", JSON.stringify(familyData))
  }

  const handleLogout = () => {
    setUser(null)
    setFamily(null)
    localStorage.removeItem("user")
    localStorage.removeItem("family")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-retro-orange to-retro-yellow">
        <div className="text-2xl font-retro text-white">Carregando MinhaGrana...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (!family && user.role === "admin") {
    return <FamilySetup user={user} onFamilySetup={handleFamilySetup} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="bg-[#007A33] text-white p-4 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold">MinhaGrana</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg">{user?.name}</span>
          <Button variant="ghost" className="text-white hover:bg-[#005F28]" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4">
        <Tabs
          value={family ? family.id : "dashboard"}
          onValueChange={(value) => {
            if (value === "dashboard") {
              setFamily(null)
            }
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-7 bg-gray-200 rounded-lg p-1 mb-4">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2 flex flex-col items-center text-sm"
            >
              <HomeIcon className="h-5 w-5 mb-1" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2 flex flex-col items-center text-sm"
            >
              <WalletIcon className="h-5 w-5 mb-1" />
              Carteira
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2 flex flex-col items-center text-sm"
            >
              <ListTodoIcon className="h-5 w-5 mb-1" />
              Tarefas
            </TabsTrigger>
            <TabsTrigger
              value="shopping"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2 flex flex-col items-center text-sm"
            >
              <ShoppingCartIcon className="h-5 w-5 mb-1" />
              Compras
            </TabsTrigger>
            <TabsTrigger
              value="iot"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2 flex flex-col items-center text-sm"
            >
              <LightbulbIcon className="h-5 w-5 mb-1" />
              IoT
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-[#007A33] data-[state=active]:text-white rounded-md p-2 flex flex-col items-center text-sm"
            >
              <UsersIcon className="h-5 w-5 mb-1" />
              Família
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard user={user} family={family} onLogout={handleLogout} />
          </TabsContent>
          <TabsContent value="wallet">
            <MemberWallet currentUser={user} />
          </TabsContent>
          <TabsContent value="tasks">
            <TasksList familyMembers={family?.members || []} />
          </TabsContent>
          <TabsContent value="shopping">
            <ShoppingList />
          </TabsContent>
          <TabsContent value="iot">
            <IotControl />
          </TabsContent>
          <TabsContent value="settings">
            <FamilySettings family={family} currentUser={user} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
