"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Lightbulb,
  Home,
  Shield,
  Thermometer,
  Droplets,
  Zap,
  Plus,
  Settings,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Device {
  id: number
  name: string
  type: "light" | "climate" | "security" | "appliance" | "sensor"
  status: "online" | "offline"
  room: string
  value: number
  isOn: boolean
  lastUpdate: string
}

export default function IoTPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "light" as const,
    room: "",
    value: 0,
    isOn: false,
  })

  const rooms = ["all", "Sala", "Quarto Principal", "Quarto dos Filhos", "Cozinha", "Banheiro", "Entrada"]

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const response = await fetch("/api/devices")
      const data = await response.json()
      setDevices(data.devices || [])
    } catch (error) {
      toast.error("Erro ao carregar dispositivos")
    } finally {
      setLoading(false)
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "light":
        return <Lightbulb className="w-5 h-5" />
      case "climate":
        return <Thermometer className="w-5 h-5" />
      case "security":
        return <Shield className="w-5 h-5" />
      case "appliance":
        return <Zap className="w-5 h-5" />
      case "sensor":
        return <Droplets className="w-5 h-5" />
      default:
        return <Home className="w-5 h-5" />
    }
  }

  const getDeviceColor = (type: string) => {
    switch (type) {
      case "light":
        return "text-yellow-500"
      case "climate":
        return "text-blue-500"
      case "security":
        return "text-red-500"
      case "appliance":
        return "text-purple-500"
      case "sensor":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const toggleDevice = async (deviceId: number) => {
    const device = devices.find((d) => d.id === deviceId)
    if (!device) return

    try {
      const response = await fetch("/api/devices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: deviceId,
          isOn: !device.isOn,
        }),
      })

      if (response.ok) {
        setDevices((prev) =>
          prev.map((d) =>
            d.id === deviceId
              ? {
                  ...d,
                  isOn: !d.isOn,
                  lastUpdate: new Date().toLocaleString("pt-BR"),
                }
              : d,
          ),
        )
        toast.success("Dispositivo atualizado com sucesso!")
      }
    } catch (error) {
      toast.error("Erro ao atualizar dispositivo")
    }
  }

  const updateDeviceValue = async (deviceId: number, newValue: number[]) => {
    try {
      const response = await fetch("/api/devices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: deviceId,
          value: newValue[0],
        }),
      })

      if (response.ok) {
        setDevices((prev) =>
          prev.map((d) =>
            d.id === deviceId
              ? {
                  ...d,
                  value: newValue[0],
                  lastUpdate: new Date().toLocaleString("pt-BR"),
                }
              : d,
          ),
        )
      }
    } catch (error) {
      toast.error("Erro ao atualizar dispositivo")
    }
  }

  const addDevice = async () => {
    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDevice),
      })

      if (response.ok) {
        const data = await response.json()
        setDevices((prev) => [...prev, data.device])
        setNewDevice({ name: "", type: "light", room: "", value: 0, isOn: false })
        setShowAddDialog(false)
        toast.success("Dispositivo adicionado com sucesso!")
      }
    } catch (error) {
      toast.error("Erro ao adicionar dispositivo")
    }
  }

  const deleteDevice = async (deviceId: number) => {
    try {
      const response = await fetch(`/api/devices?id=${deviceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDevices((prev) => prev.filter((d) => d.id !== deviceId))
        toast.success("Dispositivo removido com sucesso!")
      }
    } catch (error) {
      toast.error("Erro ao remover dispositivo")
    }
  }

  const filteredDevices = selectedRoom === "all" ? devices : devices.filter((device) => device.room === selectedRoom)
  const onlineDevices = devices.filter((d) => d.status === "online").length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007A33] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dispositivos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-[#007A33] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-700">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">Controle IoT</h1>
              <p className="text-emerald-100 text-sm">
                {onlineDevices}/{devices.length} dispositivos online
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-emerald-700">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-2 border-emerald-200">
            <CardContent className="p-4 text-center">
              <Wifi className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Online</p>
              <p className="text-lg font-bold text-gray-800">{onlineDevices}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200">
            <CardContent className="p-4 text-center">
              <WifiOff className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Offline</p>
              <p className="text-lg font-bold text-gray-800">{devices.length - onlineDevices}</p>
            </CardContent>
          </Card>
        </div>

        {/* Room Filter */}
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Filtrar por Cômodo</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cômodo" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room === "all" ? "Todos os cômodos" : room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Devices List */}
        <div className="space-y-4">
          {filteredDevices.map((device) => (
            <Card key={device.id} className="border-2 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${getDeviceColor(device.type)}`}>{getDeviceIcon(device.type)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{device.name}</h3>
                      <p className="text-sm text-gray-600">{device.room}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={device.status === "online" ? "default" : "secondary"}>
                      {device.status === "online" ? "Online" : "Offline"}
                    </Badge>
                    <Switch
                      checked={device.isOn && device.status === "online"}
                      onCheckedChange={() => toggleDevice(device.id)}
                      disabled={device.status === "offline"}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteDevice(device.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {device.isOn && device.status === "online" && (
                  <div className="space-y-3">
                    {device.type === "light" && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-sm font-medium text-gray-700">Intensidade</Label>
                          <span className="text-sm text-gray-600">{device.value}%</span>
                        </div>
                        <Slider
                          value={[device.value]}
                          onValueChange={(value) => updateDeviceValue(device.id, value)}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    )}

                    {device.type === "climate" && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-sm font-medium text-gray-700">Temperatura</Label>
                          <span className="text-sm text-gray-600">{device.value}°C</span>
                        </div>
                        <Slider
                          value={[device.value]}
                          onValueChange={(value) => updateDeviceValue(device.id, value)}
                          min={16}
                          max={30}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    )}

                    {device.type === "appliance" && device.name.includes("Geladeira") && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-sm font-medium text-gray-700">Temperatura</Label>
                          <span className="text-sm text-gray-600">{device.value}°C</span>
                        </div>
                        <Slider
                          value={[device.value]}
                          onValueChange={(value) => updateDeviceValue(device.id, value)}
                          min={1}
                          max={8}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    )}

                    {device.type === "sensor" && (
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Umidade Atual</p>
                        <p className="text-lg font-bold text-emerald-600">{device.value}%</p>
                      </div>
                    )}

                    {device.type === "security" && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Status</p>
                        <p className="text-lg font-bold text-red-600">Ativo - Monitorando</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Última atualização: {device.lastUpdate}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Device Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Card className="border-2 border-dashed border-emerald-300 cursor-pointer hover:border-emerald-400 transition-colors">
              <CardContent className="p-6 text-center">
                <Plus className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800 mb-1">Adicionar Dispositivo</h3>
                <p className="text-sm text-gray-600">Conecte um novo dispositivo IoT à sua casa</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Dispositivo</DialogTitle>
              <DialogDescription>Preencha as informações do dispositivo IoT que deseja adicionar.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="device-name">Nome do Dispositivo</Label>
                <Input
                  id="device-name"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="Ex: Luz da Sala"
                />
              </div>
              <div>
                <Label htmlFor="device-type">Tipo</Label>
                <Select
                  value={newDevice.type}
                  onValueChange={(value: any) => setNewDevice({ ...newDevice, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Iluminação</SelectItem>
                    <SelectItem value="climate">Climatização</SelectItem>
                    <SelectItem value="security">Segurança</SelectItem>
                    <SelectItem value="appliance">Eletrodoméstico</SelectItem>
                    <SelectItem value="sensor">Sensor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="device-room">Cômodo</Label>
                <Select value={newDevice.room} onValueChange={(value) => setNewDevice({ ...newDevice, room: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cômodo" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.slice(1).map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="device-value">Valor Inicial</Label>
                <Input
                  id="device-value"
                  type="number"
                  min="0"
                  max="100"
                  value={newDevice.value}
                  onChange={(e) => setNewDevice({ ...newDevice, value: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="device-on"
                  checked={newDevice.isOn}
                  onCheckedChange={(checked) => setNewDevice({ ...newDevice, isOn: checked })}
                />
                <Label htmlFor="device-on">Ligar dispositivo ao adicionar</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={addDevice} className="bg-[#007A33] hover:bg-[#005A26]">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
