"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Plus,
  Smartphone,
  Lightbulb,
  Thermometer,
  Shield,
  Zap,
  Activity,
  Wifi,
  WifiOff,
  Home,
  Bed,
  ChefHat,
  Bath,
  DoorOpen,
  Navigation,
  TreePine,
} from "lucide-react"
import { toast } from "sonner"

interface IoTControlProps {
  onBack: () => void
}

export default function IoTControl({ onBack }: IoTControlProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState("all")

  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "",
    room: "",
    brand: "",
    model: "",
  })

  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Luz da Sala",
      type: "Iluminação",
      room: "Sala de Estar",
      brand: "Philips",
      model: "Hue White",
      status: "online",
      state: { power: true, brightness: 75 },
    },
    {
      id: 2,
      name: "Ar Condicionado Quarto",
      type: "Clima",
      room: "Quarto Principal",
      brand: "Samsung",
      model: "WindFree",
      status: "online",
      state: { power: true, temperature: 22 },
    },
    {
      id: 3,
      name: "Câmera Entrada",
      type: "Segurança",
      room: "Entrada",
      brand: "Ring",
      model: "Video Doorbell",
      status: "online",
      state: { power: true, recording: true },
    },
    {
      id: 4,
      name: "Smart TV",
      type: "Eletrodoméstico",
      room: "Sala de Estar",
      brand: "LG",
      model: "OLED C1",
      status: "offline",
      state: { power: false },
    },
    {
      id: 5,
      name: "Sensor Movimento",
      type: "Sensor",
      room: "Corredor",
      brand: "Xiaomi",
      model: "Motion Sensor",
      status: "online",
      state: { power: true, motion: false },
    },
    {
      id: 6,
      name: "Luz do Quarto",
      type: "Iluminação",
      room: "Quarto das Crianças",
      brand: "Philips",
      model: "Hue Color",
      status: "online",
      state: { power: false, brightness: 50 },
    },
  ])

  const deviceTypes = [
    { value: "Iluminação", icon: Lightbulb, color: "text-yellow-600" },
    { value: "Clima", icon: Thermometer, color: "text-blue-600" },
    { value: "Segurança", icon: Shield, color: "text-red-600" },
    { value: "Eletrodoméstico", icon: Zap, color: "text-purple-600" },
    { value: "Sensor", icon: Activity, color: "text-green-600" },
  ]

  const rooms = [
    { value: "Sala de Estar", icon: Home },
    { value: "Quarto Principal", icon: Bed },
    { value: "Quarto das Crianças", icon: Bed },
    { value: "Cozinha", icon: ChefHat },
    { value: "Banheiro", icon: Bath },
    { value: "Entrada", icon: DoorOpen },
    { value: "Corredor", icon: Navigation },
    { value: "Área Externa", icon: TreePine },
  ]

  const getDeviceIcon = (type: string) => {
    const deviceType = deviceTypes.find((dt) => dt.value === type)
    return deviceType ? deviceType.icon : Smartphone
  }

  const getDeviceColor = (type: string) => {
    const deviceType = deviceTypes.find((dt) => dt.value === type)
    return deviceType ? deviceType.color : "text-gray-600"
  }

  const getRoomIcon = (room: string) => {
    const roomData = rooms.find((r) => r.value === room)
    return roomData ? roomData.icon : Home
  }

  const addDevice = () => {
    if (!newDevice.name || !newDevice.type || !newDevice.room) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const device = {
      id: Date.now(),
      name: newDevice.name,
      type: newDevice.type,
      room: newDevice.room,
      brand: newDevice.brand || "Genérico",
      model: newDevice.model || "Modelo Padrão",
      status: "online",
      state: { power: false },
    }

    setDevices([...devices, device])
    setNewDevice({ name: "", type: "", room: "", brand: "", model: "" })
    setShowAddDialog(false)
    toast.success("Dispositivo adicionado com sucesso!")
  }

  const toggleDevice = (id: number) => {
    setDevices(
      devices.map((device) =>
        device.id === id ? { ...device, state: { ...device.state, power: !device.state.power } } : device,
      ),
    )

    const device = devices.find((d) => d.id === id)
    if (device) {
      toast.success(`${device.name} ${device.state.power ? "desligado" : "ligado"}`)
    }
  }

  const updateDeviceState = (id: number, key: string, value: any) => {
    setDevices(
      devices.map((device) => (device.id === id ? { ...device, state: { ...device.state, [key]: value } } : device)),
    )
  }

  const filteredDevices = selectedRoom === "all" ? devices : devices.filter((device) => device.room === selectedRoom)

  const onlineDevices = devices.filter((d) => d.status === "online").length
  const activeDevices = devices.filter((d) => d.state.power).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-emerald-700">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Controle IoT</h1>
          <p className="text-gray-600">Gerencie todos os dispositivos inteligentes da casa</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Dispositivo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-700">
                <Plus className="w-5 h-5" />
                Adicionar Dispositivo IoT
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Dispositivo *</Label>
                <Input
                  placeholder="Ex: Luz da Sala, Ar Condicionado..."
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select value={newDevice.type} onValueChange={(value) => setNewDevice({ ...newDevice, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${type.color}`} />
                            {type.value}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cômodo *</Label>
                <Select value={newDevice.room} onValueChange={(value) => setNewDevice({ ...newDevice, room: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cômodo" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => {
                      const Icon = room.icon
                      return (
                        <SelectItem key={room.value} value={room.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-600" />
                            {room.value}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Marca</Label>
                  <Input
                    placeholder="Ex: Philips, Samsung..."
                    value={newDevice.brand}
                    onChange={(e) => setNewDevice({ ...newDevice, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Input
                    placeholder="Ex: Hue White, WindFree..."
                    value={newDevice.model}
                    onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={addDevice} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Dispositivos</p>
                <p className="text-2xl font-bold text-gray-800">{devices.length}</p>
              </div>
              <Smartphone className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online</p>
                <p className="text-2xl font-bold text-green-600">{onlineDevices}</p>
              </div>
              <Wifi className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-blue-600">{activeDevices}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-red-600">{devices.length - onlineDevices}</p>
              </div>
              <WifiOff className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros por Cômodo */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedRoom === "all" ? "default" : "outline"}
          onClick={() => setSelectedRoom("all")}
          className={
            selectedRoom === "all"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          }
        >
          Todos ({devices.length})
        </Button>
        {rooms.map((room) => {
          const Icon = room.icon
          const count = devices.filter((d) => d.room === room.value).length
          if (count === 0) return null

          return (
            <Button
              key={room.value}
              variant={selectedRoom === room.value ? "default" : "outline"}
              onClick={() => setSelectedRoom(room.value)}
              className={
                selectedRoom === room.value
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              }
            >
              <Icon className="w-4 h-4 mr-2" />
              {room.value} ({count})
            </Button>
          )
        })}
      </div>

      {/* Lista de Dispositivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device) => {
          const DeviceIcon = getDeviceIcon(device.type)
          const RoomIcon = getRoomIcon(device.room)

          return (
            <Card
              key={device.id}
              className={`border-2 transition-all ${
                device.status === "online" ? "border-emerald-200 hover:shadow-lg" : "border-gray-200 bg-gray-50"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${device.status === "online" ? "bg-emerald-100" : "bg-gray-100"}`}
                    >
                      <DeviceIcon
                        className={`w-5 h-5 ${
                          device.status === "online" ? getDeviceColor(device.type) : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{device.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <RoomIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{device.room}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={device.status === "online" ? "default" : "secondary"}
                      className={
                        device.status === "online"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {device.status === "online" ? (
                        <>
                          <Wifi className="w-3 h-3 mr-1" />
                          Online
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-3 h-3 mr-1" />
                          Offline
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Informações do Dispositivo */}
                <div className="text-xs text-gray-500">
                  <p>
                    {device.brand} {device.model}
                  </p>
                  <p>Tipo: {device.type}</p>
                </div>

                {/* Controles */}
                {device.status === "online" && (
                  <div className="space-y-3">
                    {/* Power Switch */}
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Ligado/Desligado</Label>
                      <Switch checked={device.state.power} onCheckedChange={() => toggleDevice(device.id)} />
                    </div>

                    {/* Controles Específicos por Tipo */}
                    {device.state.power && (
                      <>
                        {/* Controle de Brilho para Iluminação */}
                        {device.type === "Iluminação" && device.state.brightness !== undefined && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Brilho</Label>
                              <span className="text-sm text-gray-600">{device.state.brightness}%</span>
                            </div>
                            <Slider
                              value={[device.state.brightness]}
                              onValueChange={(value) => updateDeviceState(device.id, "brightness", value[0])}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        )}

                        {/* Controle de Temperatura para Clima */}
                        {device.type === "Clima" && device.state.temperature !== undefined && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Temperatura</Label>
                              <span className="text-sm text-gray-600">{device.state.temperature}°C</span>
                            </div>
                            <Slider
                              value={[device.state.temperature]}
                              onValueChange={(value) => updateDeviceState(device.id, "temperature", value[0])}
                              min={16}
                              max={30}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        )}

                        {/* Status de Gravação para Segurança */}
                        {device.type === "Segurança" && device.state.recording !== undefined && (
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Gravando</Label>
                            <Switch
                              checked={device.state.recording}
                              onCheckedChange={(checked) => updateDeviceState(device.id, "recording", checked)}
                            />
                          </div>
                        )}

                        {/* Status de Movimento para Sensores */}
                        {device.type === "Sensor" && device.state.motion !== undefined && (
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Movimento Detectado</Label>
                            <Badge variant={device.state.motion ? "destructive" : "secondary"}>
                              {device.state.motion ? "Sim" : "Não"}
                            </Badge>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Dispositivo Offline */}
                {device.status === "offline" && (
                  <div className="text-center py-4">
                    <WifiOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Dispositivo offline</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                    >
                      Tentar Reconectar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Estado Vazio */}
      {filteredDevices.length === 0 && (
        <Card className="border-2 border-emerald-200">
          <CardContent className="p-8 text-center">
            <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {selectedRoom === "all" ? "Nenhum dispositivo encontrado" : `Nenhum dispositivo em ${selectedRoom}`}
            </h3>
            <p className="text-gray-500 mb-4">
              {selectedRoom === "all"
                ? "Adicione seu primeiro dispositivo IoT para começar"
                : "Não há dispositivos neste cômodo"}
            </p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Dispositivo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
