"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, ShoppingCart, Edit, Trash2, DollarSign, Tag } from "lucide-react"

interface ShoppingItem {
  id: string
  name: string
  quantity: string
  category: string
  estimatedPrice: number
  actualPrice?: number
  notes?: string
  isPurchased: boolean
}

export default function ShoppingList() {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([
    {
      id: "s1",
      name: "Leite Integral",
      quantity: "2 litros",
      category: "Laticínios",
      estimatedPrice: 8.5,
      actualPrice: 8.5,
      isPurchased: true,
    },
    {
      id: "s2",
      name: "Pão Francês",
      quantity: "10 unidades",
      category: "Padaria",
      estimatedPrice: 12.0,
      isPurchased: false,
    },
    {
      id: "s3",
      name: "Detergente",
      quantity: "1 unidade",
      category: "Limpeza",
      estimatedPrice: 4.99,
      isPurchased: false,
    },
  ])

  const [newItemName, setNewItemName] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("")
  const [newItemEstimatedPrice, setNewItemEstimatedPrice] = useState("")
  const [newItemNotes, setNewItemNotes] = useState("")

  const categories = [
    "Alimentação",
    "Bebidas",
    "Limpeza",
    "Higiene Pessoal",
    "Padaria",
    "Laticínios",
    "Carnes",
    "Hortifruti",
    "Outros",
  ]

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    const estimatedPrice = Number.parseFloat(newItemEstimatedPrice.replace(",", ".")) || 0
    if (!newItemName || !newItemQuantity || !newItemCategory) {
      alert("Nome, quantidade e categoria são obrigatórios para o item de compra.")
      return
    }

    const newItem: ShoppingItem = {
      id: `s${shoppingItems.length + 1}`,
      name: newItemName,
      quantity: newItemQuantity,
      category: newItemCategory,
      estimatedPrice: estimatedPrice,
      isPurchased: false,
    }
    setShoppingItems((prev) => [...prev, newItem])
    setNewItemName("")
    setNewItemQuantity("")
    setNewItemCategory("")
    setNewItemEstimatedPrice("")
    setNewItemNotes("")
    alert("Item adicionado à lista de compras!")
  }

  const handleTogglePurchased = (id: string, isChecked: boolean) => {
    setShoppingItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isPurchased: isChecked, actualPrice: isChecked ? item.estimatedPrice : undefined }
          : item,
      ),
    )
  }

  const handleEditItem = (id: string) => {
    alert(`Editar item: ${id}`)
    // Implement actual edit logic (e.g., open a dialog with pre-filled data)
  }

  const handleDeleteItem = (id: string) => {
    if (confirm("Tem certeza que deseja remover este item da lista de compras?")) {
      setShoppingItems((prev) => prev.filter((item) => item.id !== id))
      alert("Item removido!")
    }
  }

  const totalEstimated = shoppingItems.reduce((sum, item) => sum + item.estimatedPrice, 0)
  const totalPurchased = shoppingItems.reduce(
    (sum, item) => sum + (item.isPurchased ? item.actualPrice || item.estimatedPrice : 0),
    0,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            className="text-white hover:bg-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Lista de Compras</h1>
            <p className="text-blue-100 text-sm">Organize as compras da família</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Add New Item Form */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Adicionar Novo Item</h3>
        <form onSubmit={handleAddItem} className="space-y-4 p-4 border rounded-lg bg-blue-50">
          <div>
            <Label htmlFor="item-name" className="flex items-center gap-2 mb-1">
              <ShoppingCart className="h-4 w-4" /> Nome do Item
            </Label>
            <Input
              id="item-name"
              type="text"
              placeholder="Ex: Arroz, Leite, Pão"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              required
              className="border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="item-quantity" className="flex items-center gap-2 mb-1">
                Quantidade
              </Label>
              <Input
                id="item-quantity"
                type="text"
                placeholder="Ex: 5kg, 2 unidades"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
                required
                className="border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="item-category" className="flex items-center gap-2 mb-1">
                <Tag className="h-4 w-4" /> Categoria
              </Label>
              <Select value={newItemCategory} onValueChange={setNewItemCategory} required>
                <SelectTrigger className="w-full border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="item-estimated-price" className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4" /> Preço Estimado (R$)
            </Label>
            <Input
              id="item-estimated-price"
              type="text"
              placeholder="Ex: 15,99"
              value={newItemEstimatedPrice}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9,.]/g, "")
                setNewItemEstimatedPrice(val)
              }}
              className="border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="item-notes" className="mb-1">
              Observações
            </Label>
            <Input
              id="item-notes"
              type="text"
              placeholder="Ex: Marca X, Tamanho grande"
              value={newItemNotes}
              onChange={(e) => setNewItemNotes(e.target.value)}
              className="border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-5 w-5 mr-2" /> Adicionar Item
          </Button>
        </form>

        {/* Shopping List */}
        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Itens da Lista</h3>
        <div className="space-y-3">
          {shoppingItems.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Sua lista de compras está vazia.</p>
          ) : (
            shoppingItems.map((item) => (
              <Card
                key={item.id}
                className={`p-3 flex items-center justify-between shadow-sm ${
                  item.isPurchased ? "bg-green-50 border-l-4 border-green-500" : "bg-white border-l-4 border-blue-500"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.isPurchased}
                    onCheckedChange={(checked) => handleTogglePurchased(item.id, checked as boolean)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                  />
                  <div>
                    <p className={`font-medium text-gray-800 ${item.isPurchased ? "line-through text-gray-500" : ""}`}>
                      {item.name} ({item.quantity})
                    </p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                    {item.estimatedPrice > 0 && (
                      <p className="text-xs text-gray-500">
                        Estimado: R$ {item.estimatedPrice.toFixed(2).replace(".", ",")}
                        {item.isPurchased && item.actualPrice && item.actualPrice !== item.estimatedPrice && (
                          <span className="ml-1"> (Pago: R$ {item.actualPrice.toFixed(2).replace(".", ",")})</span>
                        )}
                      </p>
                    )}
                    {item.notes && <p className="text-xs text-gray-500 italic">{item.notes}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditItem(item.id)}
                    className="text-blue-500 border-blue-500 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Resumo da Lista</h3>
          <div className="flex justify-between items-center text-gray-800">
            <span>Total Estimado:</span>
            <span className="font-bold">R$ {totalEstimated.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between items-center text-gray-800">
            <span>Total Comprado:</span>
            <span className="font-bold text-green-600">R$ {totalPurchased.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between items-center text-gray-800">
            <span>Itens Pendentes:</span>
            <span className="font-bold text-red-600">{shoppingItems.filter((item) => !item.isPurchased).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
