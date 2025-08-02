"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "./components/dashboard"
import { LoginScreen } from "./components/login-screen"
import { FamilySetup } from "./components/family-setup"

type AppState = "login" | "setup" | "dashboard"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member"
}

interface Family {
  id: string
  name: string
  description?: string
  monthlyBudget: number
  savingsGoal?: number
  members: User[]
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>("login")
  const [user, setUser] = useState<User | null>(null)
  const [family, setFamily] = useState<Family | null>(null)

  // Simular verificação de autenticação
  useEffect(() => {
    const savedUser = localStorage.getItem("minhagrana_user")
    const savedFamily = localStorage.getItem("minhagrana_family")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
      if (savedFamily) {
        setFamily(JSON.parse(savedFamily))
        setCurrentState("dashboard")
      } else {
        setCurrentState("setup")
      }
    }
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("minhagrana_user", JSON.stringify(userData))

    // Verificar se já tem família configurada
    const savedFamily = localStorage.getItem("minhagrana_family")
    if (savedFamily) {
      setFamily(JSON.parse(savedFamily))
      setCurrentState("dashboard")
    } else {
      setCurrentState("setup")
    }
  }

  const handleFamilySetup = (familyData: any) => {
    const newFamily: Family = {
      id: Date.now().toString(),
      name: familyData.name,
      description: familyData.description,
      monthlyBudget: familyData.monthlyBudget,
      savingsGoal: familyData.savingsGoal,
      members: familyData.members || [],
    }

    setFamily(newFamily)
    localStorage.setItem("minhagrana_family", JSON.stringify(newFamily))
    setCurrentState("dashboard")
  }

  const handleSkipSetup = () => {
    // Criar família básica
    const basicFamily: Family = {
      id: Date.now().toString(),
      name: `Família de ${user?.name}`,
      monthlyBudget: 5000,
      members: user ? [user] : [],
    }

    setFamily(basicFamily)
    localStorage.setItem("minhagrana_family", JSON.stringify(basicFamily))
    setCurrentState("dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    setFamily(null)
    localStorage.removeItem("minhagrana_user")
    localStorage.removeItem("minhagrana_family")
    setCurrentState("login")
  }

  if (currentState === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (currentState === "setup") {
    return <FamilySetup onComplete={handleFamilySetup} onSkip={handleSkipSetup} />
  }

  return <Dashboard user={user} family={family} onLogout={handleLogout} />
}
