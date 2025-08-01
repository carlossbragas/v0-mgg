"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Users,
  LogOut,
  Plus,
  ShoppingCart,
  CheckSquare,
  Smartphone,
  Menu,
} from "lucide-react"
import { ExpenseForm } from "./expense-form"
import { ExpensesList } from "./expenses-list"
import { Reports } from "./reports"
import { MemberWallet } from "./member-wallet"
import { FamilySettings } from "./family-settings"
import { ShoppingList } from "./shopping-list"
import { TasksList } from "./tasks-list"
import { IoTControl } from "./iot-control"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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

interface DashboardProps {
  user: User
  family: Family | null
  onLogout: () => void
}

export function Dashboard({ user, family, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Dados simulados
  const stats = {
    totalBalance: 2580.5,
    monthlyIncome: 4500.0,
    monthlyExpenses: 1919.5,
    familyMembers: family?.members.length || 1,
  }

  const tabs = [
    { value: "overview", label: "Início", icon: PiggyBank },
    { value: "expenses", label: "Gastos", icon: TrendingDown },
    { value: "reports", label: "Relatórios", icon: TrendingUp },
    { value: "wallet", label: "Carteira", icon: Users },
    { value: "shopping", label: "Compras", icon: ShoppingCart },
    { value: "tasks", label: "Tarefas", icon: CheckSquare },
    { value: "iot", label: "IoT", icon: Smartphone },
    { value: "settings", label: "Config", icon: Menu },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-yellow/20 to-retro-green/20">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b retro-border safe-area-top">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-retro-orange rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-xl font-bold text-white">💰</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold font-retro">MinhaGrana</h1>
                {family && (
                  <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-32 sm:max-w-none">
                    {family.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="font-medium text-sm">{user.name}</p>
                <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
                  {user.role === "admin" ? "Admin" : "Membro"}
                </Badge>
              </div>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="sm:hidden">
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col space-y-4 mt-6">
                    <div className="text-center pb-4 border-b">
                      <p className="font-medium">{user.name}</p>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs mt-1">
                        {user.role === "admin" ? "Administrador" : "Membro"}
                      </Badge>
                    </div>
                    <Button variant="outline" onClick={onLogout} className="w-full bg-transparent">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Button variant="outline" size="sm" onClick={onLogout} className="hidden sm:flex bg-transparent">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl mx-auto safe-area-bottom">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Mobile Tabs - Scrollable */}
          <div className="sm:hidden">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex h-12 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground mobile-tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px]"
                    >
                      <Icon className="h-4 w-4 mb-1" />
                      <span className="block text-xs">{tab.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </ScrollArea>
          </div>

          {/* Desktop Tabs */}
          <TabsList className="hidden sm:grid w-full grid-cols-8">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs lg:text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Cards de Estatísticas - Mobile First */}
            <div className="mobile-grid">
              <Card className="retro-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Saldo Total</CardTitle>
                  <PiggyBank className="h-4 w-4 text-retro-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-retro-green">
                    R$ {stats.totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card className="retro-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Receita Mensal</CardTitle>
                  <TrendingUp className="h-4 w-4 text-retro-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-retro-blue">
                    R$ {stats.monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card className="retro-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Gastos Mensais</CardTitle>
                  <TrendingDown className="h-4 w-4 text-retro-orange" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-retro-orange">
                    R$ {stats.monthlyExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card className="retro-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Membros</CardTitle>
                  <Users className="h-4 w-4 text-retro-purple" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-retro-purple">{stats.familyMembers}</div>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas - Mobile Optimized */}
            <Card className="retro-shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Ações Rápidas</CardTitle>
                <CardDescription className="text-sm">Acesse rapidamente as funcionalidades principais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <Button
                    onClick={() => setShowExpenseForm(true)}
                    className="h-16 sm:h-20 bg-retro-orange hover:bg-retro-orange/90 flex-col text-xs sm:text-sm"
                  >
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                    Novo Gasto
                  </Button>
                  <Button
                    onClick={() => setActiveTab("shopping")}
                    variant="outline"
                    className="h-16 sm:h-20 flex-col text-xs sm:text-sm"
                  >
                    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                    Compras
                  </Button>
                  <Button
                    onClick={() => setActiveTab("tasks")}
                    variant="outline"
                    className="h-16 sm:h-20 flex-col text-xs sm:text-sm"
                  >
                    <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                    Tarefas
                  </Button>
                  <Button
                    onClick={() => setActiveTab("iot")}
                    variant="outline"
                    className="h-16 sm:h-20 flex-col text-xs sm:text-sm"
                  >
                    <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                    IoT
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Gastos Recentes - Mobile Optimized */}
            <Card className="retro-shadow">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Gastos Recentes</CardTitle>
                <CardDescription className="text-sm">Últimas transações da família</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <ExpensesList limit={5} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <ExpensesList />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>

          <TabsContent value="wallet">
            <MemberWallet user={user} family={family} />
          </TabsContent>

          <TabsContent value="shopping">
            <ShoppingList family={family} />
          </TabsContent>

          <TabsContent value="tasks">
            <TasksList family={family} />
          </TabsContent>

          <TabsContent value="iot">
            <IoTControl family={family} />
          </TabsContent>

          <TabsContent value="settings">
            <FamilySettings user={user} family={family} />
          </TabsContent>
        </Tabs>

        {/* Modal de Novo Gasto */}
        {showExpenseForm && <ExpenseForm onClose={() => setShowExpenseForm(false)} user={user} family={family} />}
      </main>
    </div>
  )
}
