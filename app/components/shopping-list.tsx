"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, ShoppingCart, Check, Edit, Trash2, DollarSign } from "lucide-react"

interface ShoppingListProps {
  onBack: () => void
}

export default function ShoppingList({ onBack }: ShoppingListProps) {
  const [showItemForm, setShowItemForm] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "purchased">("all")

  const [itemForm, setItemForm] = useState({
    item: "",
    quantity: "1",
    category: "",
    estimatedPrice: "",
    notes: "",
  })

  // Mock data
  const categories = [
    "Laticínios",
    "Padaria",
    "Grãos",
    "Carnes",
    "Frutas",
    "Verduras",
    "Limpeza",
    "Higiene",
    "Bebidas",
    "Outros",
  ]

  const shoppingItems = [
    {
      id: 1,
      item: "Leite integral",
      quantity: 2,
      category: "Laticínios",
      estimatedPrice: 8.5,
      actualPrice: null,
      purchased: false,
      addedBy: "Maria Silva",
      addedAt: "2024-01-15",
      notes: "Marca preferida: Nestlé",
    },
    {
      id: 2,
      item: "Pão francês",
      quantity: 1,
      category: "Padaria",
      estimatedPrice: 12.0,
      actualPrice: 11.5,
      purchased: true,
      addedBy: "João Silva",
      addedAt: "2024-01-14",
      purchasedAt: "2024-01-16",
      notes: "",
    },
    {
      id: 3,
      item: "Arroz tipo 1",
      quantity: 1,
      category: "Grãos",
      estimatedPrice: 25.0,
      actualPrice: null,
      purchased: false,
      addedBy: "Ana Silva",
      addedAt: "2024-01-13",
      notes: "Pacote de 5kg",
    },
    {
      id: 4,
      item: "Banana prata",
      quantity: 2,
      category: "Frutas",
      estimatedPrice: 6.0,
      actualPrice: 5.8,
      purchased: true,
      addedBy: "Pedro Silva",
      addedAt: "2024-01-12",
      purchasedAt: "2024-01-16",
      notes: "Por kg",
    },
    {
      id: 5,
      item: "Detergente",
      quantity: 3,
      category: "Limpeza",
      estimatedPrice: 15.0,
      actualPrice: null,
      purchased: false,
      addedBy: "Maria Silva",
      addedAt: "2024-01-11",
      notes: "Qualquer marca",
    },
  ]

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock save item
    console.log("New shopping item:", itemForm)
    setItemForm({
      item: "",
      quantity: "1",
      category: "",
      estimatedPrice: "",
      notes: "",
    })
    setShowItemForm(false)
  }

  const toggleItemPurchased = (itemId: number) => {
    // Mock toggle purchased
    console.log("Toggle item purchased:", itemId)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Laticínios: "bg-blue-100 text-blue-800",
      Padaria: "bg-yellow-100 text-yellow-800",
      Grãos: "bg-orange-100 text-orange-800",
      Carnes: "bg-red-100 text-red-800",
      Frutas: "bg-green-100 text-green-800",
      Verduras: "bg-emerald-100 text-emerald-800",
      Limpeza: "bg-purple-100 text-purple-800",
      Higiene: "bg-pink-100 text-pink-800",
      Bebidas: "bg-cyan-100 text-cyan-800",
      Outros: "bg-gray-100 text-gray-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const filteredItems = shoppingItems.filter((item) => {
    switch (filter) {
      case "pending":
        return !item.purchased
      case "purchased":
        return item.purchased
      default:
        return true
    }
  })

  const totalEstimated = shoppingItems
    .filter((item) => !item.purchased)
    .reduce((sum, item) => sum + item.estimatedPrice, 0)

  const totalSpent = shoppingItems
    .filter((item) => item.purchased && item.actualPrice)
    .reduce((sum, item) => sum + (item.actualPrice || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-blue-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Lista de Compras</h1>
            <p className="text-blue-100 text-sm">Organize as compras da família</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-2 border-blue-200">
            <CardContent className="p-4 text-center">
              <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Valor Estimado</p>
              <p className="text-lg font-bold text-gray-800">R$ {totalEstimated.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Total Gasto</p>
              <p className="text-lg font-bold text-gray-800">R$ {totalSpent.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Item Button */}
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <Button
              onClick={() => setShowItemForm(!showItemForm)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 h-auto flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Item</span>
            </Button>
          </CardContent>
        </Card>

        {/* Item Form */}
        {showItemForm && (
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Novo Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleItemSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Nome do Item</Label>
                  <Input
                    id="itemName"
                    placeholder="Ex: Leite integral, Pão francês..."
                    value={itemForm.item}
                    onChange={(e) => setItemForm({ ...itemForm, item: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 focus:border-blue-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="itemQuantity">Quantidade</Label>
                    <Input
                      id="itemQuantity"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={itemForm.quantity}
                      onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                      className="rounded-xl border-2 border-blue-200 focus:border-blue-600"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      value={itemForm.category}
                      onValueChange={(value) => setItemForm({ ...itemForm, category: value })}
                    >
                      <SelectTrigger className="rounded-xl border-2 border-blue-200 focus:border-blue-600">
                        <SelectValue placeholder="Selecionar" />
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

                <div className="space-y-2">
                  <Label htmlFor="itemPrice">Preço Estimado (R$)</Label>
                  <Input
                    id="itemPrice"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={itemForm.estimatedPrice}
                    onChange={(e) => setItemForm({ ...itemForm, estimatedPrice: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 focus:border-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemNotes">Observações (opcional)</Label>
                  <Input
                    id="itemNotes"
                    placeholder="Ex: Marca preferida, tamanho..."
                    value={itemForm.notes}
                    onChange={(e) => setItemForm({ ...itemForm, notes: e.target.value })}
                    className="rounded-xl border-2 border-blue-200 focus:border-blue-600"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    Adicionar Item
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowItemForm(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl bg-transparent"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filter Buttons */}
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => setFilter("all")}
                variant={filter === "all" ? "default" : "outline"}
                className={`rounded-xl text-sm ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "border-2 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                }`}
              >
                Todos
              </Button>
              <Button
                onClick={() => setFilter("pending")}
                variant={filter === "pending" ? "default" : "outline"}
                className={`rounded-xl text-sm ${
                  filter === "pending"
                    ? "bg-blue-600 text-white"
                    : "border-2 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                }`}
              >
                Pendentes
              </Button>
              <Button
                onClick={() => setFilter("purchased")}
                variant={filter === "purchased" ? "default" : "outline"}
                className={`rounded-xl text-sm ${
                  filter === "purchased"
                    ? "bg-blue-600 text-white"
                    : "border-2 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                }`}
              >
                Comprados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Shopping Items List */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="border-2 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleItemPurchased(item.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {item.purchased ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3
                          className={`font-semibold text-gray-800 ${
                            item.purchased ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {item.item}
                        </h3>
                        <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      {item.purchased && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Comprado
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className={`text-sm text-gray-600 mb-2 italic ${item.purchased ? "line-through" : ""}`}>
                        {item.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        <span>Estimado: R$ {item.estimatedPrice.toFixed(2)}</span>
                        {item.actualPrice && (
                          <span className="ml-2 text-green-600 font-semibold">
                            Real: R$ {item.actualPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.addedBy} • {item.addedAt}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="border-2 border-blue-200">
            <CardContent className="p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Nenhum item encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
