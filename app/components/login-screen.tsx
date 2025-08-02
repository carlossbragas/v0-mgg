"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Wallet, Eye, EyeOff } from "lucide-react"

interface LoginScreenProps {
  onLogin: (userData: any) => void
  onBack: () => void
}

export default function LoginScreen({ onLogin, onBack }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login
    onLogin({
      name: formData.name || "Usuário",
      email: formData.email,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-[#007A33] text-white p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-emerald-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            <h1 className="text-xl font-bold">MinhaGrana</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="max-w-md mx-auto border-2 border-emerald-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">{isLogin ? "Entrar" : "Criar Conta"}</CardTitle>
            <p className="text-gray-600">{isLogin ? "Acesse sua conta familiar" : "Crie sua conta familiar"}</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="rounded-xl border-2 border-emerald-200 focus:border-[#007A33] pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#007A33] hover:bg-[#005A26] text-white font-semibold py-3 rounded-xl"
              >
                {isLogin ? "Entrar" : "Criar Conta"}
              </Button>
            </form>

            {isLogin && (
              <div className="text-center mt-4">
                <Button variant="link" className="text-[#007A33] text-sm">
                  Esqueci minha senha
                </Button>
              </div>
            )}

            <div className="text-center mt-6 pt-4 border-t border-emerald-200">
              <p className="text-gray-600 text-sm">{isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}</p>
              <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-[#007A33] font-semibold">
                {isLogin ? "Criar conta" : "Fazer login"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
