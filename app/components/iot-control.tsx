"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lightbulb, List, MoreVertical, PlusCircle, Trash2, Edit, Thermometer, Speaker, HardDrive } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Dispositivo {
  id: string
  id_dispositivo: string
  nome?: string
  tipo?: string
  comodo?: string
  status?: boolean // true para ligado, false para desligado
  versao?: string
  ip?: string
  mac?: string
  wifi_rssi?: number
  origem?: string
  createdAt: string
  updatedAt: string
}

interface Log {
  id: string
  id_dispositivo: string
  mensagem: string
  timestamp: string
  createdAt: string
}

export default function IoTControl() {
  const { toast } = useToast()
  const [devices, setDevices] = useState<Dispositivo[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newDeviceName, setNewDeviceName] = useState("")
  const [newDeviceType, setNewDeviceType] = useState("")
  const [newDeviceRoom, setNewDeviceRoom] = useState("")
  const [filterRoom, setFilterRoom] = useState("Todos")
  const [filterType, setFilterType] = useState("Todos")

  const deviceTypes = ["Lâmpada", "Termostato", "Caixa de Som", "Outro"]
  const rooms = ["Sala de Estar", "Quarto Principal", "Cozinha", "Banheiro", "Escritório", "Outro"]

  const fetchDevices = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/dispositivos")
      if (!res.ok) throw new Error("Falha ao buscar dispositivos")
      const data = await res.json()
      setDevices(
        data.map((d: any) => ({
          ...d,
          status: Math.random() > 0.5, // Mock status for now, replace with actual IoT state
        })),
      )
    } catch (error) {
      console.error("Erro ao buscar dispositivos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dispositivos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    try {
      const newDeviceId = `device-${Date.now()}` // Gerar um ID único para o mock
      const res = await fetch("/api/dispositivos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_dispositivo: newDeviceId,
          nome: newDeviceName,
          tipo: newDeviceType,
          comodo: newDeviceRoom,
          origem: "minhagrana-app",
          versao: "1.0",
          ip: "192.168.1.100", // Mock IP
          mac: "00:00:00:00:00:00", // Mock MAC
          wifi_rssi: -50, // Mock RSSI
        }),
      })

      if (!res.ok) throw new Error("Falha ao adicionar dispositivo")
      const data = await res.json()
      setDevices((prev) => [...prev, { ...data.dispositivo, status: false }]) // Adiciona com status mockado
      setNewDeviceName("")
      setNewDeviceType("")
      setNewDeviceRoom("")
      setIsAdding(false)
      toast({
        title: "Sucesso",
        description: "Dispositivo adicionado com sucesso!",
      })
    } catch (error) {
      console.error("Erro ao adicionar dispositivo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o dispositivo.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleDevice = async (id_dispositivo: string, currentStatus: boolean) => {
    // Para o protótipo, apenas atualizamos o estado localmente.
    // Em um cenário real, você enviaria uma requisição para o dispositivo IoT.
    setDevices((prev) => prev.map((d) => (d.id_dispositivo === id_dispositivo ? { ...d, status: !currentStatus } : d)))
    toast({
      title: "Status do Dispositivo",
      description: `Dispositivo ${id_dispositivo} ${currentStatus ? "desligado" : "ligado"}. (Ação mockada)`,
    })

    // Exemplo de como você enviaria um log para o backend
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_dispositivo: id_dispositivo,
          mensagem: `Dispositivo ${currentStatus ? "desligado" : "ligado"} via app.`,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Erro ao enviar log:", error)
    }
  }

  const handleDeleteDevice = async (id: string, id_dispositivo: string) => {
    // Em um cenário real, você teria uma rota DELETE /api/dispositivos/[id]
    // Por enquanto, apenas remove do estado local
    setDevices((prev) => prev.filter((d) => d.id !== id))
    toast({
      title: "Sucesso",
      description: `Dispositivo ${id_dispositivo} removido. (Ação mockada)`,
    })
  }

  const filteredDevices = devices.filter((device) => {
    const matchesRoom = filterRoom === "Todos" || device.comodo === filterRoom
    const matchesType = filterType === "Todos" || device.tipo === filterType
    return matchesRoom && matchesType
  })

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] min-h-screen font-retro">
      <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-4 sm:p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-[#007A33] flex items-center gap-2">
            <Lightbulb className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-600" />
            Controle de Dispositivos IoT
          </CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            Gerencie seus dispositivos inteligentes conectados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulário para Adicionar Dispositivo */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 space-y-4">
            <h3 className="text-xl font-semibold text-cyan-800 flex items-center gap-2">
              <PlusCircle className="w-5 h-5" /> Adicionar Novo Dispositivo
            </h3>
            <form onSubmit={handleAddDevice} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deviceName">Nome do Dispositivo</Label>
                <Input
                  id="deviceName"
                  placeholder="Ex: Lâmpada da Sala"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  required
                  className="rounded-md border-cyan-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceType">Tipo</Label>
                <Select value={newDeviceType} onValueChange={setNewDeviceType} required>
                  <SelectTrigger className="rounded-md border-cyan-300 focus:border-cyan-500 focus:ring-cyan-500">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="deviceRoom">Cômodo</Label>
                <Select value={newDeviceRoom} onValueChange={setNewDeviceRoom} required>
                  <SelectTrigger className="rounded-md border-cyan-300 focus:border-cyan-500 focus:ring-cyan-500">
                    <SelectValue placeholder="Selecione o cômodo" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full sm:col-span-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md font-semibold py-2 transition-colors duration-200"
                disabled={isAdding}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  "Adicionar Dispositivo"
                )}
              </Button>
            </form>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 bg-cyan-50 border border-cyan-200 rounded-lg p-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="filterRoom">Filtrar por Cômodo</Label>
              <Select value={filterRoom} onValueChange={setFilterRoom}>
                <SelectTrigger className="rounded-md border-cyan-300 focus:border-cyan-500 focus:ring-cyan-500">
                  <SelectValue placeholder="Todos os cômodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  {rooms.map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="filterType">Filtrar por Tipo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="rounded-md border-cyan-300 focus:border-cyan-500 focus:ring-cyan-500">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  {deviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de Dispositivos */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-cyan-800 flex items-center gap-2">
              <List className="w-5 h-5" /> Meus Dispositivos
            </h3>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                <span className="ml-2 text-cyan-700">Carregando dispositivos...</span>
              </div>
            ) : filteredDevices.length === 0 ? (
              <p className="text-center text-gray-500">Nenhum dispositivo encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDevices.map((device) => (
                  <Card
                    key={device.id}
                    className="bg-white border border-cyan-200 rounded-lg shadow-sm p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {device.tipo === "Lâmpada" && <Lightbulb className="w-6 h-6 text-yellow-500" />}
                      {device.tipo === "Termostato" && <Thermometer className="w-6 h-6 text-red-500" />}
                      {device.tipo === "Caixa de Som" && <Speaker className="w-6 h-6 text-blue-500" />}
                      {device.tipo === "Outro" && <HardDrive className="w-6 h-6 text-gray-500" />}
                      <div>
                        <p className="font-semibold text-gray-800">{device.nome || "Dispositivo Sem Nome"}</p>
                        <p className="text-sm text-gray-500">
                          {device.comodo} - {device.tipo}
                        </p>
                        <Badge
                          className={cn(
                            "mt-1 text-xs",
                            device.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                          )}
                        >
                          {device.status ? "Ligado" : "Desligado"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={device.status}
                        onCheckedChange={() => handleToggleDevice(device.id_dispositivo, device.status || false)}
                        className="data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-gray-300"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => alert("Funcionalidade de edição em desenvolvimento.")}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteDevice(device.id, device.id_dispositivo)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
