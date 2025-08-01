"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          senha: loginData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Login falhou")
        return
      }

      toast.success("Login realizado com sucesso")
      onLogin(data.usuario)
    } catch (err) {
      console.error(err)
      toast.error("Erro ao tentar fazer login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-sm mx-auto mt-10">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Acesse sua conta familiar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
