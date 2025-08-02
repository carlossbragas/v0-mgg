"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HomeIcon, UsersIcon, WalletIcon, ListTodoIcon, ShoppingCartIcon, LightbulbIcon } from "lucide-react"

// Imports dos componentes
import { Dashboard } from "./components/dashboard"
import { MemberWallet } from "./components/member-wallet"
import { FamilySettings } from "./components/family-settings"
import { TasksList } from "./components/tasks-list"
import { ShoppingList } from "./components/shopping-list"
import { IotControl } from "./components/iot-control"
import { LoginScreen } from "./components/login-screen"
import { FamilySetup } from "./components/family-setup"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasFamily, setHasFamily] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Verificar se há dados salvos no localStorage
    const savedUser = localStorage.getItem("currentUser")
    const savedFamily = localStorage.getItem("hasFamily")

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }

    if (savedFamily === "true") {
      setHasFamily(true)
    }
  }, [])

  const handleLogin = (user: any) => {
    setCurrentUser(user)
    setIsLoggedIn(true)
    localStorage.setItem("currentUser", JSON.stringify(user))
  }

  const handleFamilySetup = () => {
    setHasFamily(true)
    localStorage.setItem("hasFamily", "true")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setHasFamily(false)
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("hasFamily")
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (!hasFamily) {
    return <FamilySetup onComplete={handleFamilySetup} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto p-4">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-amber-800 mb-2">MinhaGrana</h1>
          <p className="text-amber-600">Controle Financeiro Familiar</p>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent"
          >
            Sair
          </Button>
        </header>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-amber-100 border-amber-200">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-800"
            >
              <HomeIcon className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-800">
              <WalletIcon className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Carteira</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-800">
              <ListTodoIcon className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Tarefas</span>
            </TabsTrigger>
            <TabsTrigger
              value="shopping"
              className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-800"
            >
              <ShoppingCartIcon className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Compras</span>
            </TabsTrigger>
            <TabsTrigger value="iot" className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-800">
              <LightbulbIcon className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">IoT</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-800"
            >
              <UsersIcon className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Família</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="wallet" className="mt-6">
            <MemberWallet />
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <TasksList />
          </TabsContent>

          <TabsContent value="shopping" className="mt-6">
            <ShoppingList />
          </TabsContent>

          <TabsContent value="iot" className="mt-6">
            <IotControl />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <FamilySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
