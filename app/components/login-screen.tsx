"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Mail, Lock, Shield, PiggyBank, Users, TrendingUp, Star } from "lucide-react"

interface LoginScreenProps {
  onLogin?: (email: string, password: string) => void
  onSignup?: () => void
  onForgotPassword?: () => void
}

export function LoginScreen({ onLogin, onSignup, onForgotPassword }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginMode, setLoginMode] = useState<"login" | "signup">("login")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular delay de autenticação
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (loginMode === "login" && onLogin) {
      onLogin(email, password)
    } else if (loginMode === "signup" && onSignup) {
      onSignup()
    }

    setIsLoading(false)
  }

  const features = [
    {
      icon: PiggyBank,
      title: "Controle Financeiro",
      description: "Gerencie gastos e receitas da família",
    },
    {
      icon: Users,
      title: "Gestão Familiar",
      description: "Organize tarefas e responsabilidades",
    },
    {
      icon: TrendingUp,
      title: "Relatórios Inteligentes",
      description: "Acompanhe metas e progresso",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Seus dados protegidos e privados",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl">
                <PiggyBank className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  MinhaGrana
                </h1>
                <p className="text-sm text-gray-600">Finanças familiares inteligentes</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-4">Organize as finanças da sua família</h2>
            <p className="text-xl text-gray-600 mb-8">
              Controle gastos, gerencie tarefas e alcance suas metas financeiras com facilidade.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                <Star className="h-3 w-3 mr-1" />
                4.9/5 estrelas
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                <Users className="h-3 w-3 mr-1" />
                +10k famílias
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl">
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    MinhaGrana
                  </h1>
                </div>
              </div>

              <CardTitle className="text-2xl font-bold text-gray-900">
                {loginMode === "login" ? "Bem-vindo de volta!" : "Crie sua conta"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {loginMode === "login" ? "Entre na sua conta para continuar" : "Comece a organizar suas finanças hoje"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 bg-white/50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {loginMode === "login" && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-600">Lembrar de mim</span>
                    </label>
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Esqueci a senha
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {loginMode === "login" ? "Entrando..." : "Criando conta..."}
                    </div>
                  ) : loginMode === "login" ? (
                    "Entrar"
                  ) : (
                    "Criar conta"
                  )}
                </Button>
              </form>

              <div className="relative">
                <Separator className="my-6" />
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
                  ou
                </span>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 border-gray-200 hover:bg-gray-50 font-medium bg-transparent"
                onClick={() => {
                  /* Implementar login com Google */
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {loginMode === "login" ? "Não tem uma conta?" : "Já tem uma conta?"}
                  <button
                    type="button"
                    onClick={() => setLoginMode(loginMode === "login" ? "signup" : "login")}
                    className="ml-1 text-orange-600 hover:text-orange-700 font-medium"
                  >
                    {loginMode === "login" ? "Criar conta" : "Fazer login"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Features */}
          <div className="lg:hidden mt-8 grid grid-cols-2 gap-3">
            {features.slice(0, 4).map((feature, index) => (
              <div
                key={index}
                className="p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 text-center"
              >
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg w-fit mx-auto mb-2">
                  <feature.icon className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-xs">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
