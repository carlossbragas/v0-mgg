"use client"

import { useState } from "react"
import LoginScreen from "./components/login-screen"
import FamilySetup from "./components/family-setup"
import Dashboard from "./components/dashboard"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "setup" | "dashboard">("login")
  const [familyData, setFamilyData] = useState<{
    familyName: string
    adminName: string
    members: Array<{
      name: string
      role: "adult" | "child"
      allowance: number
    }>
    budget: {
      monthly: number
      categories: Array<{
        name: string
        limit: number
      }>
    }
  } | null>(null)

  const handleLogin = (userData: { name: string; email: string }) => {
    // Simular login bem-sucedido
    setCurrentScreen("setup")
  }

  const handleFamilySetup = (data: {
    familyName: string
    adminName: string
    members: Array<{
      name: string
      role: "adult" | "child"
      allowance: number
    }>
    budget: {
      monthly: number
      categories: Array<{
        name: string
        limit: number
      }>
    }
  }) => {
    setFamilyData(data)
    setCurrentScreen("dashboard")
  }

  // Dados padrão caso familyData seja null
  const defaultFamilyData = {
    familyName: "Minha Família",
    adminName: "Usuário",
    members: [{ name: "Usuário", role: "adult" as const, allowance: 0 }],
    budget: {
      monthly: 3000,
      categories: [
        { name: "Alimentação", limit: 800 },
        { name: "Transporte", limit: 400 },
        { name: "Entretenimento", limit: 300 },
        { name: "Educação", limit: 500 },
        { name: "Saúde", limit: 300 },
      ],
    },
  }

  if (currentScreen === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (currentScreen === "setup") {
    return <FamilySetup onComplete={handleFamilySetup} />
  }

  return <Dashboard familyData={familyData || defaultFamilyData} />
}
