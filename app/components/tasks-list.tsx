"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, CheckSquare, Square, Edit, Trash2, User, Calendar, AlertCircle } from "lucide-react"

interface TasksListProps {
  onBack: () => void
}

export default function TasksList({ onBack }: TasksListProps) {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "overdue">("all")

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
    category: "",
  })

  // Mock data
  const members = ["João Silva", "Maria Silva", "Pedro Silva", "Ana Silva"]
  const categories = ["Casa", "Financeiro", "Saúde", "Educação", "Compras", "Outros"]

  const tasks = [
    {
      id: 1,
      title: "Pagar conta de luz",
      description: "Vencimento dia 20/01",
      assignedTo: "João Silva",
      dueDate: "2024-01-20",
      priority: "high" as const,
      category: "Financeiro",
      completed: false,
      createdAt: "2024-01-15",
      completedAt: null,
    },
    {
      id: 2,
      title: "Comprar remédio da Ana",
      description: "Remédio para pressão",
      assignedTo: "Maria Silva",
      dueDate: "2024-01-18",
      priority: "high" as const,
      category: "Saúde",
      completed: false,
      createdAt: "2024-01-14",
      completedAt: null,
    },
    {
      id: 3,
      title: "Limpar a garagem",
      description: "Organizar ferramentas e limpar",
      assignedTo: "Pedro Silva",
      dueDate: "2024-01-25",
      priority: "medium" as const,
      category: "Casa",
      completed: false,
      createdAt: "2024-01-13",
      completedAt: null,
    },
    {
      id: 4,
      title: "Renovar seguro do carro",
      description: "Pesquisar preços e renovar",
      assignedTo: "João Silva",
      dueDate: "2024-01-30",
      priority: "medium" as const,
      category: "Financeiro",
      completed: true,
      createdAt: "2024-01-10",
      completedAt: "2024-01-16",
    },
    {
      id: 5,
      title: "Comprar material escolar",
      description: "Lista da escola do Pedro",
      assignedTo: "Ana Silva",
      dueDate: "2024-01-12",
      priority: "low" as const,
      category: "Educação",
      completed: false,
      createdAt: "2024-01-08",
      completedAt: null,
    },
  ]

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock save task
    console.log("New task:", taskForm)
    setTaskForm({
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
      priority: "medium",
      category: "",
    })
    setShowTaskForm(false)
  }

  const toggleTaskComplete = (taskId: number) => {
    // Mock toggle completion
    console.log("Toggle task completion:", taskId)
  }

  const isOverdue = (dueDate: string, completed: boolean) => {
    if (completed) return false
    return new Date(dueDate) < new Date()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return priority
    }
  }

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "pending":
        return !task.completed
      case "completed":
        return task.completed
      case "overdue":
        return isOverdue(task.dueDate, task.completed)
      default:
        return true
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-purple-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Lista de Tarefas</h1>
            <p className="text-purple-100 text-sm">Organize as atividades da família</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Add Task Button */}
        <Card className="border-2 border-purple-200">
          <CardContent className="p-4">
            <Button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-4 h-auto flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Tarefa</span>
            </Button>
          </CardContent>
        </Card>

        {/* Task Form */}
        {showTaskForm && (
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Nova Tarefa</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taskTitle">Título da Tarefa</Label>
                  <Input
                    id="taskTitle"
                    placeholder="Ex: Pagar conta de luz"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="rounded-xl border-2 border-purple-200 focus:border-purple-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taskDescription">Descrição (opcional)</Label>
                  <Textarea
                    id="taskDescription"
                    placeholder="Detalhes da tarefa..."
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="rounded-xl border-2 border-purple-200 focus:border-purple-600 min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Responsável</Label>
                    <Select
                      value={taskForm.assignedTo}
                      onValueChange={(value) => setTaskForm({ ...taskForm, assignedTo: value })}
                    >
                      <SelectTrigger className="rounded-xl border-2 border-purple-200 focus:border-purple-600">
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member} value={member}>
                            {member}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taskDueDate">Data Limite</Label>
                    <Input
                      id="taskDueDate"
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className="rounded-xl border-2 border-purple-200 focus:border-purple-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <Select
                      value={taskForm.priority}
                      onValueChange={(value: any) => setTaskForm({ ...taskForm, priority: value })}
                    >
                      <SelectTrigger className="rounded-xl border-2 border-purple-200 focus:border-purple-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      value={taskForm.category}
                      onValueChange={(value) => setTaskForm({ ...taskForm, category: value })}
                    >
                      <SelectTrigger className="rounded-xl border-2 border-purple-200 focus:border-purple-600">
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

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                    Salvar Tarefa
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTaskForm(false)}
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
        <Card className="border-2 border-purple-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-2">
              <Button
                onClick={() => setFilter("all")}
                variant={filter === "all" ? "default" : "outline"}
                className={`rounded-xl text-xs ${
                  filter === "all"
                    ? "bg-purple-600 text-white"
                    : "border-2 border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                }`}
              >
                Todas
              </Button>
              <Button
                onClick={() => setFilter("pending")}
                variant={filter === "pending" ? "default" : "outline"}
                className={`rounded-xl text-xs ${
                  filter === "pending"
                    ? "bg-purple-600 text-white"
                    : "border-2 border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                }`}
              >
                Pendentes
              </Button>
              <Button
                onClick={() => setFilter("completed")}
                variant={filter === "completed" ? "default" : "outline"}
                className={`rounded-xl text-xs ${
                  filter === "completed"
                    ? "bg-purple-600 text-white"
                    : "border-2 border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                }`}
              >
                Concluídas
              </Button>
              <Button
                onClick={() => setFilter("overdue")}
                variant={filter === "overdue" ? "default" : "outline"}
                className={`rounded-xl text-xs ${
                  filter === "overdue"
                    ? "bg-red-600 text-white"
                    : "border-2 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                }`}
              >
                Atrasadas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="border-2 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTaskComplete(task.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-green-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3
                        className={`font-semibold text-gray-800 ${task.completed ? "line-through text-gray-500" : ""}`}
                      >
                        {task.title}
                      </h3>
                      <div className="flex gap-1 ml-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {task.description && (
                      <p className={`text-sm text-gray-600 mb-2 ${task.completed ? "line-through" : ""}`}>
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityText(task.priority)}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {task.category}
                      </span>
                      {isOverdue(task.dueDate, task.completed) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Atrasada
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{task.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <Card className="border-2 border-purple-200">
            <CardContent className="p-8 text-center">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Nenhuma tarefa encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
