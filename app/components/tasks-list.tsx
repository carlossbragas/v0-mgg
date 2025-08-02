"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, CheckSquare, Star, Clock, User, Gift, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"

interface TasksListProps {
  onBack: () => void
}

export default function TasksList({ onBack }: TasksListProps) {
  const [newTask, setNewTask] = useState("")
  const [newAssignee, setNewAssignee] = useState("")
  const [newReward, setNewReward] = useState("")
  const [newPriority, setNewPriority] = useState("medium")
  const [newDescription, setNewDescription] = useState("")
  const [filter, setFilter] = useState("all")

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Lavar a louça",
      description: "Lavar toda a louça do jantar",
      assignee: "Pedro Silva",
      reward: 10.0,
      priority: "high",
      completed: false,
      createdBy: "João Silva",
      createdAt: "2024-01-15",
      dueDate: "2024-01-16",
    },
    {
      id: 2,
      title: "Organizar o quarto",
      description: "Arrumar a cama e organizar os brinquedos",
      assignee: "Ana Silva",
      reward: 15.0,
      priority: "medium",
      completed: true,
      createdBy: "Maria Silva",
      createdAt: "2024-01-14",
      dueDate: "2024-01-15",
      completedAt: "2024-01-15",
    },
    {
      id: 3,
      title: "Tirar o lixo",
      description: "Levar o lixo para a coleta",
      assignee: "Pedro Silva",
      reward: 5.0,
      priority: "low",
      completed: false,
      createdBy: "João Silva",
      createdAt: "2024-01-13",
      dueDate: "2024-01-17",
    },
    {
      id: 4,
      title: "Estudar matemática",
      description: "Fazer os exercícios da página 45",
      assignee: "Ana Silva",
      reward: 20.0,
      priority: "high",
      completed: false,
      createdBy: "Maria Silva",
      createdAt: "2024-01-12",
      dueDate: "2024-01-18",
    },
  ])

  const members = ["Pedro Silva", "Ana Silva", "João Silva", "Maria Silva"]
  const priorities = [
    { value: "low", label: "Baixa", color: "bg-gray-100 text-gray-800" },
    { value: "medium", label: "Média", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "Alta", color: "bg-red-100 text-red-800" },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const addTask = () => {
    if (!newTask.trim() || !newAssignee) {
      toast.error("Preencha o título da tarefa e selecione um responsável")
      return
    }

    const task = {
      id: Date.now(),
      title: newTask,
      description: newDescription,
      assignee: newAssignee,
      reward: Number.parseFloat(newReward) || 0,
      priority: newPriority,
      completed: false,
      createdBy: "Usuário Atual",
      createdAt: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 dias
    }

    setTasks([...tasks, task])
    setNewTask("")
    setNewAssignee("")
    setNewReward("")
    setNewPriority("medium")
    setNewDescription("")
    toast.success("Tarefa criada com sucesso!")
  }

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const updatedTask = {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString().split("T")[0] : undefined,
          }

          if (!task.completed && task.reward > 0) {
            toast.success(`Parabéns! Você ganhou ${formatCurrency(task.reward)}!`)
          }

          return updatedTask
        }
        return task
      }),
    )
  }

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
    toast.success("Tarefa removida!")
  }

  const getPriorityInfo = (priority: string) => {
    return priorities.find((p) => p.value === priority) || priorities[1]
  }

  const isOverdue = (dueDate: string, completed: boolean) => {
    if (completed) return false
    return new Date(dueDate) < new Date()
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    if (filter === "overdue") return isOverdue(task.dueDate, task.completed)
    return true
  })

  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter((task) => task.completed).length
  const totalRewards = filteredTasks.reduce((sum, task) => sum + task.reward, 0)
  const earnedRewards = filteredTasks.filter((task) => task.completed).reduce((sum, task) => sum + task.reward, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-emerald-700">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Lista de Tarefas</h1>
          <p className="text-gray-600">Organize as tarefas da família com recompensas</p>
        </div>
      </div>

      {/* Resumo */}
      <Card className="border-2 border-emerald-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total de Tarefas</p>
              <p className="text-2xl font-bold text-gray-800">{totalTasks}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Concluídas</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Recompensas Totais</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalRewards)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Já Ganhas</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(earnedRewards)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Criar Tarefa */}
      <Card className="border-2 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Plus className="w-5 h-5" />
            Criar Nova Tarefa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Título da Tarefa</label>
              <Input
                placeholder="Ex: Lavar a louça, Organizar quarto..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Responsável</label>
              <Select value={newAssignee} onValueChange={setNewAssignee}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue placeholder="Selecione um membro" />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Recompensa (R$)</label>
              <Input
                placeholder="0,00"
                type="number"
                step="0.01"
                value={newReward}
                onChange={(e) => setNewReward(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prioridade</label>
              <Select value={newPriority} onValueChange={setNewPriority}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
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
            <label className="text-sm font-medium text-gray-700">Descrição (opcional)</label>
            <Textarea
              placeholder="Descreva os detalhes da tarefa..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="border-emerald-200 focus:border-emerald-500 min-h-[80px]"
            />
          </div>

          <Button onClick={addTask} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Criar Tarefa
          </Button>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          }
        >
          Todas ({tasks.length})
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
          Pendentes ({tasks.filter((t) => !t.completed).length})
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
          Concluídas ({tasks.filter((t) => t.completed).length})
        </Button>
        <Button
          variant={filter === "overdue" ? "default" : "outline"}
          onClick={() => setFilter("overdue")}
          className={
            filter === "overdue"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          }
        >
          Atrasadas ({tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length})
        </Button>
      </div>

      {/* Lista de Tarefas */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-8 text-center">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {filter === "all"
                  ? "Nenhuma tarefa encontrada"
                  : filter === "pending"
                    ? "Nenhuma tarefa pendente"
                    : filter === "completed"
                      ? "Nenhuma tarefa concluída"
                      : "Nenhuma tarefa atrasada"}
              </h3>
              <p className="text-gray-500">
                {filter === "all"
                  ? "Crie sua primeira tarefa para começar"
                  : filter === "pending"
                    ? "Todas as tarefas foram concluídas!"
                    : filter === "completed"
                      ? "Nenhuma tarefa foi concluída ainda"
                      : "Ótimo! Nenhuma tarefa está atrasada"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const priorityInfo = getPriorityInfo(task.priority)
            const overdue = isOverdue(task.dueDate, task.completed)

            return (
              <Card
                key={task.id}
                className={`border-2 transition-all ${
                  task.completed
                    ? "border-green-200 bg-green-50"
                    : overdue
                      ? "border-red-200 bg-red-50"
                      : "border-emerald-200 hover:shadow-md"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3
                            className={`font-semibold text-lg ${
                              task.completed ? "line-through text-gray-500" : "text-gray-800"
                            }`}
                          >
                            {task.title}
                          </h3>

                          {task.description && (
                            <p className={`text-sm mt-1 ${task.completed ? "text-gray-400" : "text-gray-600"}`}>
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <Badge className={priorityInfo.color}>
                              <Star className="w-3 h-3 mr-1" />
                              {priorityInfo.label}
                            </Badge>

                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              {task.assignee}
                            </div>

                            <div
                              className={`flex items-center gap-1 text-sm ${
                                overdue ? "text-red-600" : "text-gray-600"
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                              {formatDate(task.dueDate)}
                              {overdue && !task.completed && (
                                <span className="text-red-600 font-medium ml-1">(Atrasada)</span>
                              )}
                            </div>

                            {task.reward > 0 && (
                              <div className="flex items-center gap-1 text-sm text-emerald-600">
                                <Gift className="w-4 h-4" />
                                {formatCurrency(task.reward)}
                              </div>
                            )}
                          </div>

                          <p className="text-xs text-gray-500 mt-2">
                            Criada por {task.createdBy} em {formatDate(task.createdAt)}
                            {task.completedAt && (
                              <span className="text-green-600 ml-2">• Concluída em {formatDate(task.completedAt)}</span>
                            )}
                          </p>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeTask(task.id)}
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
            )
          })
        )}
      </div>
    </div>
  )
}
