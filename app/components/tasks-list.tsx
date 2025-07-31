"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, isPast } from "date-fns"
import { Plus, Edit, Trash2, CalendarIcon, User, Tag, Flag } from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string
  assignedTo: string // member ID
  dueDate: Date
  priority: "high" | "medium" | "low"
  category: string
  isCompleted: boolean
}

interface TasksListProps {
  familyMembers: { id: string; name: string; email: string; role: string }[]
}

export default function TasksList({ familyMembers }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      title: "Pagar conta de luz",
      description: "Vencimento dia 10",
      assignedTo: "user1",
      dueDate: new Date("2025-08-10"),
      priority: "high",
      category: "Financeiro",
      isCompleted: false,
    },
    {
      id: "t2",
      title: "Comprar presente da vovó",
      description: "Aniversário dia 15",
      assignedTo: "user2",
      dueDate: new Date("2025-08-15"),
      priority: "medium",
      category: "Pessoal",
      isCompleted: false,
    },
    {
      id: "t3",
      title: "Limpar a garagem",
      assignedTo: "user3",
      dueDate: new Date("2025-07-20"),
      priority: "low",
      category: "Casa",
      isCompleted: true,
    },
  ])

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("")
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>(new Date())
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium")
  const [newTaskCategory, setNewTaskCategory] = useState("")

  const categories = ["Casa", "Financeiro", "Saúde", "Educação", "Trabalho", "Pessoal", "Outros"]

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle || !newTaskAssignedTo || !newTaskDueDate || !newTaskCategory) {
      alert("Título, responsável, data limite e categoria são obrigatórios para a tarefa.")
      return
    }

    const newTask: Task = {
      id: `t${tasks.length + 1}`,
      title: newTaskTitle,
      description: newTaskDescription,
      assignedTo: newTaskAssignedTo,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      category: newTaskCategory,
      isCompleted: false,
    }
    setTasks((prev) => [...prev, newTask])
    setNewTaskTitle("")
    setNewTaskDescription("")
    setNewTaskAssignedTo("")
    setNewTaskDueDate(new Date())
    setNewTaskPriority("medium")
    setNewTaskCategory("")
    alert("Tarefa adicionada com sucesso!")
  }

  const handleToggleComplete = (id: string, isChecked: boolean) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, isCompleted: isChecked } : task)))
  }

  const handleEditTask = (id: string) => {
    alert(`Editar tarefa: ${id}`)
    // Implement actual edit logic (e.g., open a dialog with pre-filled data)
  }

  const handleDeleteTask = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      setTasks((prev) => prev.filter((task) => task.id !== id))
      alert("Tarefa excluída!")
    }
  }

  const getMemberName = (id: string) => {
    return familyMembers.find((m) => m.id === id)?.name || "Desconhecido"
  }

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getPriorityBadgeColor = (priority: "high" | "medium" | "low") => {
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

  return (
    <Card className="w-full bg-white text-[#007A33] rounded-lg shadow-lg">
      <CardHeader className="text-center border-b pb-4">
        <CardTitle className="text-2xl font-bold">Lista de Tarefas</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Add New Task Form */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Adicionar Nova Tarefa</h3>
        <form onSubmit={handleAddTask} className="space-y-4 p-4 border rounded-lg bg-purple-50">
          <div>
            <Label htmlFor="task-title" className="flex items-center gap-2 mb-1">
              Título da Tarefa
            </Label>
            <Input
              id="task-title"
              type="text"
              placeholder="Ex: Pagar conta de luz"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
              className="border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <Label htmlFor="task-description" className="mb-1">
              Descrição
            </Label>
            <Input
              id="task-description"
              type="text"
              placeholder="Detalhes da tarefa..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-assigned-to" className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4" /> Responsável
              </Label>
              <Select value={newTaskAssignedTo} onValueChange={setNewTaskAssignedTo} required>
                <SelectTrigger className="w-full border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Selecione um membro" />
                </SelectTrigger>
                <SelectContent>
                  {familyMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="task-due-date" className="flex items-center gap-2 mb-1">
                <CalendarIcon className="h-4 w-4" /> Data Limite
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !newTaskDueDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTaskDueDate ? format(newTaskDueDate, "PPP") : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={newTaskDueDate} onSelect={setNewTaskDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-priority" className="flex items-center gap-2 mb-1">
                <Flag className="h-4 w-4" /> Prioridade
              </Label>
              <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                <SelectTrigger className="w-full border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="task-category" className="flex items-center gap-2 mb-1">
                <Tag className="h-4 w-4" /> Categoria
              </Label>
              <Select value={newTaskCategory} onValueChange={setNewTaskCategory} required>
                <SelectTrigger className="w-full border-purple-500 focus:ring-purple-500">
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
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="h-5 w-5 mr-2" /> Adicionar Tarefa
          </Button>
        </form>

        {/* Tasks List */}
        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Tarefas da Família</h3>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Nenhuma tarefa cadastrada.</p>
          ) : (
            tasks
              .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()) // Sort by due date
              .map((task) => (
                <Card
                  key={task.id}
                  className={`p-3 flex items-center justify-between shadow-sm ${
                    task.isCompleted
                      ? "bg-green-50 border-l-4 border-green-500"
                      : isPast(task.dueDate) && !task.isCompleted
                        ? "bg-red-50 border-l-4 border-red-500"
                        : "bg-white border-l-4 border-purple-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.isCompleted}
                      onCheckedChange={(checked) => handleToggleComplete(task.id, checked as boolean)}
                      className="data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                    />
                    <div>
                      <p
                        className={`font-medium text-gray-800 ${task.isCompleted ? "line-through text-gray-500" : ""}`}
                      >
                        {task.title}
                      </p>
                      {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
                      <p className="text-xs text-gray-500">Responsável: {getMemberName(task.assignedTo)}</p>
                      <p className="text-xs text-gray-500">
                        Data Limite: {format(task.dueDate, "dd/MM/yyyy")}
                        {isPast(task.dueDate) && !task.isCompleted && (
                          <span className="ml-1 text-red-600 font-semibold">(Atrasada)</span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                          Prioridade: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">Categoria: {task.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditTask(task.id)}
                      className="text-blue-500 border-blue-500 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 border-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
