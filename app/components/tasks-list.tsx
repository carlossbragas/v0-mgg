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
import { Textarea } from "@/components/ui/textarea"
import { CheckSquare, Plus, Trash2, Calendar, User, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface Family {
  id: string
  name: string
  adminId: string
  members: { id: string; name: string; email: string; role: string }[]
}

interface Task {
  id: string
  title: string
  description: string
  assignedTo: string
  priority: "low" | "medium" | "high"
  dueDate: string
  completed: boolean
  createdBy: string
  createdAt: string
}

interface TasksListProps {
  family: Family | null
}

export function TasksList({ family }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  })

  useEffect(() => {
    // Carregar tarefas do localStorage
    const savedTasks = JSON.parse(localStorage.getItem("family-tasks") || "[]")
    setTasks(savedTasks)
  }, [])

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.assignedTo) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      assignedTo: formData.assignedTo,
      priority: formData.priority,
      dueDate: formData.dueDate,
      completed: false,
      createdBy: "user-1", // Simular usuário atual
      createdAt: new Date().toISOString(),
    }

    const updatedTasks = [newTask, ...tasks]
    setTasks(updatedTasks)
    localStorage.setItem("family-tasks", JSON.stringify(updatedTasks))

    toast.success("Tarefa criada com sucesso!")
    setFormData({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: "" })
    setShowAddDialog(false)
  }

  const handleToggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    setTasks(updatedTasks)
    localStorage.setItem("family-tasks", JSON.stringify(updatedTasks))
  }

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)
    localStorage.setItem("family-tasks", JSON.stringify(updatedTasks))
    toast.success("Tarefa removida!")
  }

  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return "Média"
    }
  }

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getMemberName = (memberId: string) => {
    const member = family?.members.find((m) => m.id === memberId)
    return member?.name || "Membro não encontrado"
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="retro-shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Tarefas da Família
              </CardTitle>
              <CardDescription className="text-sm">
                {pendingTasks.length} tarefa{pendingTasks.length !== 1 ? "s" : ""} pendente
                {pendingTasks.length !== 1 ? "s" : ""}
                {completedTasks.length > 0 &&
                  ` • ${completedTasks.length} concluída${completedTasks.length !== 1 ? "s" : ""}`}
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-retro-blue hover:bg-retro-blue/90 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nova Tarefa</DialogTitle>
                  <DialogDescription>Crie uma nova tarefa para a família</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Título *</Label>
                    <Input
                      id="task-title"
                      placeholder="Ex: Lavar a louça"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-description">Descrição</Label>
                    <Textarea
                      id="task-description"
                      placeholder="Detalhes da tarefa..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Responsável *</Label>
                      <Select
                        value={formData.assignedTo}
                        onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {family?.members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setFormData({ ...formData, priority: value })
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="due-date">Data de Vencimento</Label>
                    <Input
                      id="due-date"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="h-11"
                    />
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
                      className="flex-1 h-11 bg-retro-blue hover:bg-retro-blue/90 order-1 sm:order-2"
                    >
                      Criar Tarefa
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Tarefas Pendentes */}
      {pendingTasks.length > 0 && (
        <Card className="retro-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Tarefas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                      className="mt-1 data-[state=checked]:bg-retro-blue data-[state=checked]:text-white"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm sm:text-base">{task.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                          {task.dueDate && isOverdue(task.dueDate) && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Atrasada
                            </Badge>
                          )}
                        </div>
                      </div>

                      {task.description && <p className="text-sm text-muted-foreground mb-3">{task.description}</p>}

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{getMemberName(task.assignedTo)}</span>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className={isOverdue(task.dueDate) ? "text-red-600" : ""}>
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tarefas Concluídas */}
      {completedTasks.length > 0 && (
        <Card className="retro-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Tarefas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                      className="mt-1 data-[state=checked]:bg-retro-blue data-[state=checked]:text-white"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm sm:text-base line-through text-muted-foreground">
                          {task.title}
                        </h3>
                        <Badge className={getPriorityColor(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{getMemberName(task.assignedTo)}</span>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado Vazio */}
      {tasks.length === 0 && (
        <Card className="retro-shadow">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Nenhuma Tarefa</h3>
            <p className="text-muted-foreground text-center mb-6">Comece criando tarefas para organizar a família</p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-retro-blue hover:bg-retro-blue/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Tarefa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
