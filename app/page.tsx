"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Users, TrendingUp, Shield } from "lucide-react"
import LoginScreen from "./components/login-screen"
import FamilySetup from "./components/family-setup"
import Dashboard from "./components/dashboard"

export default function MinhaGranaApp() {
  const [currentScreen, setCurrentScreen] = useState<"home" | "login" | "register" | "family-setup" | "dashboard">(
    "home",
  )
  const [user, setUser] = useState<any>(null)

  if (currentScreen === "login") {
    return (
      <LoginScreen
        onLogin={(userData) => {
          setUser(userData)
          setCurrentScreen("family-setup")
        }}
        onBack={() => setCurrentScreen("home")}
      />
    )
  }

  if (currentScreen === "family-setup") {
    return <FamilySetup onComplete={() => setCurrentScreen("dashboard")} onBack={() => setCurrentScreen("login")} />
  }

  if (currentScreen === "dashboard") {
    return <Dashboard onBack={() => setCurrentScreen("home")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-[#007A33] text-white p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Wallet className="w-8 h-8" />
          <h1 className="text-3xl font-bold tracking-wide">MinhaGrana</h1>
        </div>
        <p className="text-emerald-100 text-lg">Organize as finanças da sua família</p>
      </div>

      {/* Hero Section */}
      <div className="px-6 py-8">
        <div className="max-w-md mx-auto text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Controle financeiro familiar nunca foi tão fácil</h2>
          <p className="text-gray-600 leading-relaxed">
            Gerencie despesas, divida contas e acompanhe o orçamento da família em um só lugar
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-[#007A33] mx-auto mb-2" />
              <h3 className="font-semibold text-sm text-gray-800">Família Unida</h3>
              <p className="text-xs text-gray-600 mt-1">Todos conectados</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-[#007A33] mx-auto mb-2" />
              <h3 className="font-semibold text-sm text-gray-800">Relatórios</h3>
              <p className="text-xs text-gray-600 mt-1">Gráficos claros</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200">
            <CardContent className="p-4 text-center">
              <Wallet className="w-8 h-8 text-[#007A33] mx-auto mb-2" />
              <h3 className="font-semibold text-sm text-gray-800">Carteira</h3>
              <p className="text-xs text-gray-600 mt-1">Saldo individual</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-[#007A33] mx-auto mb-2" />
              <h3 className="font-semibold text-sm text-gray-800">Segurança</h3>
              <p className="text-xs text-gray-600 mt-1">Dados protegidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="max-w-md mx-auto space-y-4">
          <Button
            onClick={() => setCurrentScreen("login")}
            className="w-full bg-[#007A33] hover:bg-[#005A26] text-white font-semibold py-3 rounded-xl text-lg"
          >
            Entrar
          </Button>

          <Button
            onClick={() => setCurrentScreen("register")}
            variant="outline"
            className="w-full border-2 border-[#007A33] text-[#007A33] hover:bg-emerald-50 font-semibold py-3 rounded-xl text-lg"
          >
            Criar Conta
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Versão 1.0 • Feito com ❤️ para famílias</p>
        </div>
      </div>
    </div>
  )
}
