"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Plus, Trash2, Edit, Filter, DollarSign, Package, User, CheckCircle } from "lucide-react"

interface ShoppingListProps {
  user: any
}

export function ShoppingList({ user }: ShoppingListProps) {
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [activeList, setActiveList] = useState("main")

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "1",
    category: "",
    estimatedPrice: "",
    priority: "medium",
    notes: "",
  })

  const [shoppingLists, setShoppingLists] = useState([
    {
      id: "main",
      name: "Lista Principal",
      description: "Compras do mês",
      createdBy: "Maria",
      items: [
        {
          id: "1",
          name: "Arroz",
          quantity: 2,
          unit: "kg",
          category: "Grãos",
          estimatedPrice: 12.0,
          actualPrice: null,
          priority: "high",
          completed: false,
          addedBy: "Maria",
          notes: "Arroz tipo 1",
        },
        {
          id: "2",
          name: "Leite",
          quantity: 3,
          unit: "litros",
          category: "Laticínios",
          estimatedPrice: 15.0,
          actualPrice: 14.5,
          priority: "medium",
          completed: true,
          addedBy: "João",
          notes: "",
        },
        {
          id: "3",
          name: "Banana",
          quantity: 1,
          unit: "kg",
          category: "Frutas",
          estimatedPrice: 6.0,
          actualPrice: null,
          priority: "low",
          completed: false,
          addedBy: "Ana",
          notes: "Banana prata",
        },
      ],
    },
    {
      id: "urgent",
      name: "Lista Urgente",
      description: "Itens que acabaram",
      createdBy: "João",
      items: [
        {
          id: "4",
          name: "Pão",
          quantity: 2,
          unit: "unidades",
          category: "Padaria",
          estimatedPrice: 8.0,
          actualPrice: null,
          priority: "high",
          completed: false,
          addedBy: "Pedro",
          notes: "Pão francês",
        },
      ],
    },
  ])

  const categories = [
    "Frutas",
    "Verduras",
    "Carnes",
    "Laticínios",
    "Grãos",
    "Bebidas",
    "Limpeza",
    "Higiene",
    "Padaria",
    "Congelados",
    "Outros",
  ]

  const priorities = [
    { value: "low", label: "Baixa", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Média", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "Alta", color: "bg-red-100 text-red-800" },
  ]

  const currentList = shoppingLists.find((list) => list.id === activeList)

  const handleAddItem = () => {
    if (!newItem.name || !currentList) return

    const item = {
      id: Date.now().toString(),
      name: newItem.name,
      quantity: Number.parseInt(newItem.quantity) || 1,
      unit: "unidades",
      category: newItem.category,
      estimatedPrice: Number.parseFloat(newItem.estimatedPrice) || 0,
      actualPrice: null,
      priority: newItem.priority,
      completed: false,
      addedBy: user?.name || "Usuário",
      notes: newItem.notes,
    }

    setShoppingLists(
      shoppingLists.map((list) => (list.id === activeList ? { ...list, items: [...list.items, item] } : list)),
    )

    setNewItem({
      name: "",
      quantity: "1",
      category: "",
      estimatedPrice: "",
      priority: "medium",
      notes: "",
    })
    setIsAddingItem(false)
  }

  const handleToggleItem = (itemId: string) => {
    setShoppingLists(
      shoppingLists.map((list) =>
        list.id === activeList
          ? {
              ...list,
              items: list.items.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
            }
          : list,
      ),
    )
  }

  const handleDeleteItem = (itemId: string) => {
    setShoppingLists(
      shoppingLists.map((list) =>
        list.id === activeList ? { ...list, items: list.items.filter((item) => item.id !== itemId) } : list,
      ),
    )
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = priorities.find((p) => p.value === priority)
    return <Badge className={priorityConfig?.color}>{priorityConfig?.label}</Badge>
  }

  const getTotalEstimated = () => {
    if (!currentList) return 0
    return currentList.items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0)
  }

  const getTotalActual = () => {
    if (!currentList) return 0
    return currentList.items.reduce((sum, item) => sum + (item.actualPrice || 0), 0)
  }

  const getCompletedCount = () => {
    if (!currentList) return 0
    return currentList.items.filter((item) => item.completed).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-amber-800 mb-2">Lista de Compras</h2>
        <p className="text-amber-600">Organize as compras da família</p>
      </div>

      {/* List Selector */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="pt-6">
          <Tabs value={activeList} onValueChange={setActiveList}>
            <TabsList className="grid w-full grid-cols-2 bg-amber-100">
              {shoppingLists.map((list) => (
                <TabsTrigger key={list.id} value={list.id} className="data-[state=active]:bg-amber-200">
                  {list.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {currentList && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-amber-200 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-800">{currentList.items.length}</div>
                  <p className="text-sm text-blue-600">Total de Itens</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-800">{getCompletedCount()}</div>
                  <p className="text-sm text-green-600">Comprados</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-800">{formatCurrency(getTotalEstimated())}</div>
                  <p className="text-sm text-yellow-600">Estimado</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <ShoppingCart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-800">{formatCurrency(getTotalActual())}</div>
                  <p className="text-sm text-purple-600">Gasto Real</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                  <Badge variant="outline" className="border-amber-300 text-amber-700">
                    {currentList.name}
                  </Badge>
                </div>

                <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                  <DialogTrigger asChild>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Adicionar Item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nome do Item *</Label>
                        <Input
                          placeholder="Ex: Arroz"
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Quantidade</Label>
                          <Input
                            type="number"
                            min="1"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Categoria</Label>
                          <Select
                            value={newItem.category}
                            onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                          >
                            <SelectTrigger>
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

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Preço Estimado (R$)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={newItem.estimatedPrice}
                            onChange={(e) => setNewItem({ ...newItem, estimatedPrice: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Prioridade</Label>
                          <Select
                            value={newItem.priority}
                            onValueChange={(value) => setNewItem({ ...newItem, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {priorities.map((priority) => (
                                <SelectItem key={priority.value} value={priority.value}>
                                  {priority.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Observações</Label>
                        <Input
                          placeholder="Ex: Marca específica, tamanho..."
                          value={newItem.notes}
                          onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={handleAddItem} className="flex-1 bg-amber-600 hover:bg-amber-700">
                          Adicionar
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddingItem(false)} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Items List */}
          <div className="space-y-4">
            {currentList.items.map((item) => (
              <Card key={item.id} className="border-amber-200 bg-gradient-to-r from-white to-amber-50">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => handleToggleItem(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3
                            className={`font-semibold ${
                              item.completed ? "line-through text-gray-500" : "text-amber-800"
                            }`}
                          >
                            {item.name}
                          </h3>
                          <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                            {item.quantity} {item.unit}
                          </Badge>
                          {getPriorityBadge(item.priority)}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-amber-600">
                          <span>{item.category}</span>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{item.addedBy}</span>
                          </div>
                          {item.estimatedPrice > 0 && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{formatCurrency(item.estimatedPrice)}</span>
                            </div>
                          )}
                        </div>

                        {item.notes && <p className="text-sm text-amber-600 mt-1">{item.notes}</p>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-amber-600">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {currentList.items.length === 0 && (
              <Card className="border-dashed border-2 border-amber-300">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Lista vazia</h3>
                    <p className="text-amber-600 mb-4">Adicione itens à sua lista de compras</p>
                    <Button onClick={() => setIsAddingItem(true)} className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ShoppingList
