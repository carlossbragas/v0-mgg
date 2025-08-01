"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member"
  familyId?: string
}

interface LoginScreenProps {
  onLogin: (user: User) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulação de login
    if (loginData.email && loginData.password) {
      const user: User = {
        id: "1",
        name: "Usuário Demo",
        email: loginData.email,
        role: "admin",
      }

      toast.success("Login realizado com sucesso!")
      onLogin(user)
    } else {
      toast.error("Preencha todos os campos")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Senhas não conferem")
      return
    }

    if (registerData.name && registerData.email && registerData.password) {
      const user: User = {
        id: "1",
        name: registerData.name,
        email: registerData.email,
        role: "admin",
      }

      toast.success("Conta criada com sucesso!")
      onLogin(user)
    } else {
      toast.error("Preencha todos os campos")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 retro-gradient">
      <Card className="w-full max-w-md retro-shadow retro-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 bg-retro-orange rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">💰</span>
          </div>
          <CardTitle className="text-2xl font-bold font-retro">MinhaGrana</CardTitle>
          <CardDescription>Controle financeiro familiar retrô</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar Conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-retro-orange hover:bg-retro-orange/90">
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-retro-green hover:bg-retro-green/90">
                  Criar Conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
