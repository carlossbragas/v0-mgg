"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail } from "lucide-react"

interface LoginScreenProps {
  onLogin: (email: string) => void
  onGoToRegister: () => void
}

export default function LoginScreen({ onLogin, onGoToRegister }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login logic
    onLogin(email)
  }

  return (
    <Card className="w-full max-w-sm bg-white text-[#007A33] rounded-lg shadow-lg p-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold mb-4">Entrar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email-login" className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4" /> E-mail
            </Label>
            <Input
              id="email-login"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#007A33] focus:ring-[#007A33]"
            />
          </div>
          <div>
            <Label htmlFor="password-login" className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4" /> Senha
            </Label>
            <Input
              id="password-login"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#007A33] focus:ring-[#007A33]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#007A33] hover:bg-[#005F28] text-white font-bold py-3 rounded-lg text-lg transition-colors"
          >
            Entrar
          </Button>
        </form>
        <Button
          variant="link"
          className="w-full text-[#007A33] hover:text-[#005F28]"
          onClick={() => alert('Funcionalidade "Esqueci a senha" em desenvolvimento!')}
        >
          Esqueci a senha
        </Button>
        <div className="text-center text-gray-600">
          Não tem uma conta?{" "}
          <Button variant="link" className="text-[#007A33] hover:text-[#005F28]" onClick={onGoToRegister}>
            Criar conta
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function RegisterScreen({ onRegister, onGoToLogin }: { onRegister: (email: string) => void; onGoToLogin: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }
    onRegister(email)
  }

  return (
    <Card className="w-full max-w-sm bg-white text-[#007A33] rounded-lg shadow-lg p-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold mb-4">Criar Conta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email-register" className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4" /> E-mail
            </Label>
            <Input
              id="email-register"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#007A33] focus:ring-[#007A33]"
            />
          </div>
          <div>
            <Label htmlFor="password-register" className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4" /> Senha
            </Label>
            <Input
              id="password-register"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#007A33] focus:ring-[#007A33]"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password-register" className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4" /> Confirmar Senha
            </Label>
            <Input
              id="confirm-password-register"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border-[#007A33] focus:ring-[#007A33]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#007A33] hover:bg-[#005F28] text-white font-bold py-3 rounded-lg text-lg transition-colors"
          >
            Criar Conta
          </Button>
        </form>
        <div className="text-center text-gray-600">
          Já tem uma conta?{" "}
          <Button variant="link" className="text-[#007A33] hover:text-[#005F28]" onClick={onGoToLogin}>
            Entrar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
