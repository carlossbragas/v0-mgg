"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, ShoppingCart, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"

interface ShoppingListProps {
  onBack: () => void
}

export default function ShoppingList({ onBack }: ShoppingListProps) {
  const [newItem, setNewItem] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newQuantity, setNewQuantity] = useState("1")
  const [newPrice, setNewPrice] = useState("")
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [filter, setFilter] = useState("all")

  const [items, setItems] = useState([
    {
      id: 1,
      name: "Leite integral",
      category: "Laticínios",
      quantity: 2,
      price: 4.5,
      completed: false,
      addedBy: "João Silva",
      addedAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Pão de forma",
      category: "Padaria",
      quantity: 1,
      price: 6.8,
      completed: true,
      addedBy: "Maria Silva",
      addedAt: "2024-01-14",
    },
    {
      id: 3,
      name: "Maçã",
      category: "Frutas",
      quantity: 1,
      price: 8.9,
      completed: false,
      addedBy: "Pedro Silva",
      addedAt: "2024-01-13",
    },
    {
      id: 4,
      name: "Arroz",
      category: "Grãos",
      quantity: 1,
      price: 12.5,
      completed: false,
      addedBy: "Ana Silva",
      addedAt: "2024-01-12",
    },
    {
      id: 5,
      name: "Detergente",
      category: "Limpeza",
      quantity: 2,
      price: 3.2,
      completed: true,
      addedBy: "João Silva",
      addedAt: "2024-01-11",
    },
  ])

  const categories = ["Laticínios", "Padaria", "Frutas", "Grãos", "Limpeza", "Carnes", "Bebidas", "Higiene"]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const addItem = () => {
    if (!newItem.trim() || !newCategory) {
      toast.error("Preencha o nome do item e a categoria")
      return
    }

    const item = {
      id: Date.now(),
      name: newItem,
      category: newCategory,
      quantity: Number.parseInt(newQuantity) || 1,
      price: Number.parseFloat(newPrice) || 0,
      completed: false,
      addedBy: "Usuário Atual",
      addedAt: new Date().toISOString().split("T")[0],
    }

    setItems([...items, item])
    setNewItem("")
    setNewCategory("")
    setNewQuantity("1")
    setNewPrice("")
    toast.success("Item adicionado à lista!")
  }

  const toggleItem = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
    const item = items.find((i) => i.id === id)
    if (item) {
      toast.success(item.completed ? "Item desmarcado" : "Item marcado como comprado!")
    }
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
    toast.success("Item removido da lista!")
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Laticínios: "bg-blue-100 text-blue-800",
      Padaria: "bg-yellow-100 text-yellow-800",
      Frutas: "bg-green-100 text-green-800",
      Grãos: "bg-orange-100 text-orange-800",
      Limpeza: "bg-purple-100 text-purple-800",
      Carnes: "bg-red-100 text-red-800",
      Bebidas: "bg-cyan-100 text-cyan-800",
      Higiene: "bg-pink-100 text-pink-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const filteredItems = items.filter((item) => {
    if (filter === "completed") return item.completed
    if (filter === "pending") return !item.completed
    return true
  })

  const totalItems = filteredItems.length
  const completedItems = filteredItems.filter((item) => item.completed).length
  const totalValue = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const completedValue = filteredItems
    .filter((item) => item.completed)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-emerald-700">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Lista de Compras</h1>
          <p className="text-gray-600">Organize as compras da família</p>
        </div>
      </div>

      {/* Resumo */}
      <Card className="border-2 border-emerald-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total de Itens</p>
              <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Comprados</p>
              <p className="text-2xl font-bold text-green-600">{completedItems}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalValue)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Já Gasto</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(completedValue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adicionar Item */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Plus className="w-5 h-5" />
            Adicionar Item
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input
              placeholder="Nome do item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="md:col-span-2 border-emerald-200 focus:border-emerald-500"
            />
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Qtd"
              type="number"
              min="1"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              className="border-emerald-200 focus:border-emerald-500"
            />
            <Input
              placeholder="Preço (R$)"
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>
          <Button onClick={addItem} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar à Lista
          </Button>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          }
        >
          Todos ({items.length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
          className={
            filter === "pending"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          }
        >
          Pendentes ({items.filter((i) => !i.completed).length})
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
          className={
            filter === "completed"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          }
        >
          Comprados ({items.filter((i) => i.completed).length})
        </Button>
      </div>

      {/* Lista de Itens */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {filter === "all"
                  ? "Lista vazia"
                  : filter === "pending"
                    ? "Nenhum item pendente"
                    : "Nenhum item comprado"}
              </h3>
              <p className="text-gray-500">
                {filter === "all"
                  ? "Adicione itens à sua lista de compras"
                  : filter === "pending"
                    ? "Todos os itens foram comprados!"
                    : "Nenhum item foi comprado ainda"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`border-2 transition-all ${
                item.completed ? "border-green-200 bg-green-50" : "border-emerald-200 hover:shadow-md"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${item.completed ? "line-through text-gray-500" : "text-gray-800"}`}
                        >
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                          <span className="text-sm text-gray-600">Qtd: {item.quantity}</span>
                          {item.price > 0 && (
                            <span className="text-sm text-gray-600">{formatCurrency(item.price * item.quantity)}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Adicionado por {item.addedBy} em {new Date(item.addedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingItem(item.id)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
