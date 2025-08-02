"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Wallet,
  CheckSquare,
  ShoppingCart,
  Smartphone,
  Settings,
  BarChart3,
  LogOut,
  Bell,
  PiggyBank,
} from "lucide-react"

// Import components with correct exports
import { Dashboard } from "./components/dashboard"
import { LoginScreen } from "./components/login-screen"
import { FamilySetup } from "./components/family-setup"
import MemberWallet from "./components/member-wallet"
import TasksList from "./components/tasks-list"
import ShoppingList from "./components/shopping-list"
import { IotControl } from "./components/iot-control"
import FamilySettings from "./components/family-settings"
import Reports from "./components/reports"

export default function MinhaGranaApp() {
  const [user, setUser] = useState<any>(null)
  const [family, setFamily] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    // Se o usuário não tem família, vai para setup
    if (!userData.familyId) {
      // Não definir família ainda, deixar o FamilySetup aparecer
    } else {
      // Simular dados da família
      setFamily({
        id: userData.familyId,
        name: "Família Silva",
        code: "FAM2024",
        members: 4,
      })
    }
  }

  const handleFamilySetup = (familyData: any) => {
    setFamily(familyData)
    setUser({ ...user, familyId: familyData.id })
  }

  const handleLogout = () => {
    setUser(null)
    setFamily(null)
    setActiveTab("dashboard")
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "wallet", label: "Carteira", icon: Wallet },
    { id: "tasks", label: "Tarefas", icon: CheckSquare },
    { id: "shopping", label: "Compras", icon: ShoppingCart },
    { id: "iot", label: "IoT", icon: Smartphone },
    { id: "reports", label: "Relatórios", icon: BarChart3 },
    { id: "settings", label: "Configurações", icon: Settings },
  ]

  // Se não está logado, mostrar tela de login
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  // Se está logado mas não tem família, mostrar setup da família
  if (!family) {
    return <FamilySetup onSetup={handleFamilySetup} />
  }

  // App principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  MinhaGrana
                </h1>
                {family && <p className="text-xs text-amber-600">{family.name}</p>}
              </div>
            </div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <nav className="hidden md:flex space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab(item.id)}
                      className={
                        activeTab === item.id
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "text-amber-700 hover:bg-amber-100"
                      }
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  )
                })}
              </nav>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-amber-700">
                <Bell className="w-5 h-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-amber-100 text-amber-800">
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <Badge variant="outline" className="w-fit mt-1">
                        {user.role === "admin" ? "Administrador" : "Membro"}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Desktop Content */}
          {!isMobile && (
            <>
              {activeTab === "dashboard" && <Dashboard user={user} />}
              {activeTab === "wallet" && <MemberWallet user={user} />}
              {activeTab === "tasks" && <TasksList user={user} />}
              {activeTab === "shopping" && <ShoppingList user={user} />}
              {activeTab === "iot" && <IotControl user={user} />}
              {activeTab === "reports" && <Reports user={user} />}
              {activeTab === "settings" && <FamilySettings user={user} family={family} />}
            </>
          )}

          {/* Mobile Content with Tabs */}
          {isMobile && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="space-y-6">
                {/* Tab Content */}
                <TabsContent value="dashboard" className="mt-0">
                  <Dashboard user={user} />
                </TabsContent>
                <TabsContent value="wallet" className="mt-0">
                  <MemberWallet user={user} />
                </TabsContent>
                <TabsContent value="tasks" className="mt-0">
                  <TasksList user={user} />
                </TabsContent>
                <TabsContent value="shopping" className="mt-0">
                  <ShoppingList user={user} />
                </TabsContent>
                <TabsContent value="iot" className="mt-0">
                  <IotControl user={user} />
                </TabsContent>
                <TabsContent value="reports" className="mt-0">
                  <Reports user={user} />
                </TabsContent>
                <TabsContent value="settings" className="mt-0">
                  <FamilySettings user={user} family={family} />
                </TabsContent>
              </div>

              {/* Bottom Navigation */}
              <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-amber-200 z-50">
                <TabsList className="grid w-full grid-cols-4 h-16 bg-transparent">
                  <TabsTrigger
                    value="dashboard"
                    className="flex-col space-y-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
                  >
                    <Home className="w-5 h-5" />
                    <span className="text-xs">Home</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="wallet"
                    className="flex-col space-y-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
                  >
                    <Wallet className="w-5 h-5" />
                    <span className="text-xs">Carteira</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    className="flex-col space-y-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
                  >
                    <CheckSquare className="w-5 h-5" />
                    <span className="text-xs">Tarefas</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="flex-col space-y-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-xs">Config</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Spacer for bottom navigation */}
              <div className="h-16" />
            </Tabs>
          )}
        </div>
      </main>
    </div>
  )
}
