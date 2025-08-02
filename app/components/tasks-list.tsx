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
import { Textarea } from "@/components/ui/textarea"
import { CheckSquare, Plus, Calendar, User, Clock, Star, Filter, MoreHorizontal, Award } from "lucide-react"

interface TasksListProps {
  user: any
}

export function TasksList({ user }: TasksListProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [filter, setFilter] = useState("all")

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
    reward: "",
  })

  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Lavar a louça",
      description: "Lavar todos os pratos e utensílios da cozinha",
      assignedTo: "João",
      assignedBy: "Maria",
      priority: "high",
      status: "pending",
      dueDate: new Date("2024-01-16"),
      reward: 10.0,
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Organizar o quarto",
      description: "Arrumar a cama e organizar os brinquedos",
      assignedTo: "Ana",
      assignedBy: "João",
      priority: "medium",
      status: "completed",
      dueDate: new Date("2024-01-15"),
      reward: 5.0,
      createdAt: new Date("2024-01-14"),
      completedAt: new Date("2024-01-15"),
    },
    {
      id: "3",
      title: "Tirar o lixo",
      description: "Levar o lixo para a coleta",
      assignedTo: "Pedro",
      assignedBy: "Maria",
      priority: "low",
      status: "in_progress",
      dueDate: new Date("2024-01-17"),
      reward: 3.0,
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "4",
      title: "Estudar matemática",
      description: "Fazer os exercícios da página 45 a 50",
      assignedTo: "Ana",
      assignedBy: "João",
      priority: "high",
      status: "pending",
      dueDate: new Date("2024-01-18"),
      reward: 15.0,
      createdAt: new Date("2024-01-15"),
    },
  ])

  const familyMembers = [
    { id: "1", name: "João", role: "admin" },
    { id: "2", name: "Maria", role: "member" },
    { id: "3", name: "Ana", role: "member" },
    { id: "4", name: "Pedro", role: "member" },
  ]

  const priorities = [
    { value: "low", label: "Baixa", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Média", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "Alta", color: "bg-red-100 text-red-800" },
  ]

  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignedTo) return

    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      assignedBy: user?.name || "Admin",
      priority: newTask.priority,
      status: "pending",
      dueDate: new Date(newTask.dueDate),
      reward: Number.parseFloat(newTask.reward) || 0,
      createdAt: new Date(),
    }

    setTasks([task, ...tasks])
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
      reward: "",
    })
    setIsAddingTask(false)
  }

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
              completedAt: task.status === "completed" ? undefined : new Date(),
            }
          : task,
      ),
    )
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "my") return task.assignedTo === user?.name
    if (filter === "pending") return task.status === "pending"
    if (filter === "completed") return task.status === "completed"
    return true
  })

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", color: "bg-gray-100 text-gray-800" },
      in_progress: { label: "Em Andamento", color: "bg-blue-100 text-blue-800" },
      completed: { label: "Concluída", color: "bg-green-100 text-green-800" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const totalRewards = tasks
    .filter((task) => task.status === "completed" && task.assignedTo === user?.name)
    .reduce((sum, task) => sum + task.reward, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-amber-800 mb-2">Lista de Tarefas</h2>
        <p className="text-amber-600">Organize e acompanhe as tarefas da família</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-amber-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">
                {tasks.filter((t) => t.status === "pending").length}
              </div>
              <p className="text-sm text-blue-600">Pendentes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-800">
                {tasks.filter((t) => t.status === "in_progress").length}
              </div>
              <p className="text-sm text-yellow-600">Em Andamento</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">
                {tasks.filter((t) => t.status === "completed").length}
              </div>
              <p className="text-sm text-green-600">Concluídas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">{formatCurrency(totalRewards)}</div>
              <p className="text-sm text-purple-600">Recompensas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="my">Minhas Tarefas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
              <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Nova Tarefa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título *</Label>
                    <Input
                      placeholder="Ex: Lavar a louça"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      placeholder="Descreva a tarefa..."
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Responsável *</Label>
                      <Select
                        value={newTask.assignedTo}
                        onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {familyMembers.map((member) => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data Limite</Label>
                      <Input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Recompensa (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={newTask.reward}
                        onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddTask} className="flex-1 bg-amber-600 hover:bg-amber-700">
                      Criar Tarefa
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingTask(false)} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="border-amber-200 bg-gradient-to-r from-white to-amber-50">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3
                        className={`font-semibold ${
                          task.status === "completed" ? "line-through text-gray-500" : "text-amber-800"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {getPriorityBadge(task.priority)}
                    </div>

                    {task.description && <p className="text-sm text-amber-600 mb-2">{task.description}</p>}

                    <div className="flex items-center space-x-4 text-sm text-amber-600">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{task.assignedTo}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{task.dueDate.toLocaleDateString("pt-BR")}</span>
                      </div>
                      {task.reward > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{formatCurrency(task.reward)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {getStatusBadge(task.status)}
                  <Button variant="ghost" size="sm" className="text-amber-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card className="border-dashed border-2 border-amber-300">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckSquare className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Nenhuma tarefa encontrada</h3>
                <p className="text-amber-600 mb-4">
                  {filter === "all"
                    ? "Crie sua primeira tarefa para começar"
                    : "Não há tarefas com os filtros selecionados"}
                </p>
                <Button onClick={() => setIsAddingTask(true)} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default TasksList
