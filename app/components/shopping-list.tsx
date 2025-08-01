"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Plus, Trash2, Check } from "lucide-react"
import { toast } from "sonner"

interface Family {
  id: string
  name: string
  adminId: string
  members: { id: string; name: string; email: string; role: string }[]
}

interface ShoppingItem {
  id: string
  name: string
  quantity: number
  category: string
  completed: boolean
  addedBy: string
  addedAt: string
}

interface ShoppingListProps {
  family: Family | null
}

const categories = ["Alimentação", "Limpeza", "Higiene", "Bebidas", "Padaria", "Açougue", "Hortifruti", "Outros"]

export function ShoppingList({ family }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    quantity: "1",
    category: "",
  })

  useEffect(() => {
    // Carregar lista do localStorage
    const savedItems = JSON.parse(localStorage.getItem("shopping-list") || "[]")
    setItems(savedItems)
  }, [])

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.category) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: formData.name,
      quantity: Number.parseInt(formData.quantity) || 1,
      category: formData.category,
      completed: false,
      addedBy: "user-1", // Simular usuário atual
      addedAt: new Date().toISOString(),
    }

    const updatedItems = [newItem, ...items]
    setItems(updatedItems)
    localStorage.setItem("shopping-list", JSON.stringify(updatedItems))

    toast.success("Item adicionado à lista!")
    setFormData({ name: "", quantity: "1", category: "" })
    setShowAddDialog(false)
  }

  const handleToggleItem = (id: string) => {
    const updatedItems = items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    setItems(updatedItems)
    localStorage.setItem("shopping-list", JSON.stringify(updatedItems))
  }

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)
    localStorage.setItem("shopping-list", JSON.stringify(updatedItems))
    toast.success("Item removido da lista!")
  }

  const handleClearCompleted = () => {
    const updatedItems = items.filter((item) => !item.completed)
    setItems(updatedItems)
    localStorage.setItem("shopping-list", JSON.stringify(updatedItems))
    toast.success("Itens concluídos removidos!")
  }

  const pendingItems = items.filter((item) => !item.completed)
  const completedItems = items.filter((item) => item.completed)

  const categoryColors: { [key: string]: string } = {
    Alimentação: "bg-green-100 text-green-800",
    Limpeza: "bg-blue-100 text-blue-800",
    Higiene: "bg-purple-100 text-purple-800",
    Bebidas: "bg-orange-100 text-orange-800",
    Padaria: "bg-yellow-100 text-yellow-800",
    Açougue: "bg-red-100 text-red-800",
    Hortifruti: "bg-emerald-100 text-emerald-800",
    Outros: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="retro-shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Lista de Compras
              </CardTitle>
              <CardDescription className="text-sm">
                {pendingItems.length} item{pendingItems.length !== 1 ? "s" : ""} pendente
                {pendingItems.length !== 1 ? "s" : ""}
                {completedItems.length > 0 &&
                  ` • ${completedItems.length} concluído${completedItems.length !== 1 ? "s" : ""}`}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {completedItems.length > 0 && (
                <Button variant="outline" onClick={handleClearCompleted} className="w-full sm:w-auto bg-transparent">
                  Limpar Concluídos
                </Button>
              )}
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-retro-green hover:bg-retro-green/90 w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle>Adicionar Item</DialogTitle>
                    <DialogDescription>Adicione um novo item à lista de compras</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddItem} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="item-name">Nome do Item *</Label>
                      <Input
                        id="item-name"
                        placeholder="Ex: Leite, Pão..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantidade</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Categoria *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddDialog(false)}
                        className="flex-1 h-11 order-2 sm:order-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-11 bg-retro-green hover:bg-retro-green/90 order-1 sm:order-2"
                      >
                        Adicionar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de Itens Pendentes */}
      {pendingItems.length > 0 && (
        <Card className="retro-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Itens Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggleItem(item.id)}
                    className="data-[state=checked]:bg-retro-green data-[state=checked]:text-white"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-medium text-sm sm:text-base">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.quantity}x
                        </Badge>
                        <Badge className={`${categoryColors[item.category] || categoryColors["Outros"]} text-xs`}>
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Itens Concluídos */}
      {completedItems.length > 0 && (
        <Card className="retro-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="h-5 w-5 text-retro-green" />
              Itens Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggleItem(item.id)}
                    className="data-[state=checked]:bg-retro-green data-[state=checked]:text-white"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-medium text-sm sm:text-base line-through text-muted-foreground">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.quantity}x
                        </Badge>
                        <Badge className={`${categoryColors[item.category] || categoryColors["Outros"]} text-xs`}>
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado Vazio */}
      {items.length === 0 && (
        <Card className="retro-shadow">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold mb-2">Lista Vazia</h3>
            <p className="text-muted-foreground text-center mb-6">Comece adicionando itens à sua lista de compras</p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-retro-green hover:bg-retro-green/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
