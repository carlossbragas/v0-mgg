"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Lightbulb,
  Plug,
  Thermometer,
  Camera,
  Wifi,
  WifiOff,
  Power,
  Settings,
  Activity,
  Home,
  Bed,
  ChefHat,
  Bath,
  Car,
} from "lucide-react"

interface Dispositivo {
  id: string
  nome: string
  tipo: "LAMPADA" | "TOMADA" | "SENSOR" | "CAMERA" | "TERMOSTATO" | "OUTRO"
  comodo: string
  ip: string
  porta: number
  status: "ONLINE" | "OFFLINE"
  ativo: boolean
  intensidade: number
  versaoFirmware?: string
  ultimaAtualizacao?: Date
}

const dispositivosSimulados: Dispositivo[] = [
  {
    id: "1",
    nome: "Lâmpada Sala",
    tipo: "LAMPADA",
    comodo: "Sala",
    ip: "192.168.1.101",
    porta: 80,
    status: "ONLINE",
    ativo: true,
    intensidade: 75,
    versaoFirmware: "1.2.3",
    ultimaAtualizacao: new Date(),
  },
  {
    id: "2",
    nome: "Tomada Cozinha",
    tipo: "TOMADA",
    comodo: "Cozinha",
    ip: "192.168.1.102",
    porta: 80,
    status: "ONLINE",
    ativo: false,
    intensidade: 0,
    versaoFirmware: "1.1.0",
    ultimaAtualizacao: new Date(),
  },
  {
    id: "3",
    nome: "Sensor Quarto",
    tipo: "SENSOR",
    comodo: "Quarto",
    ip: "192.168.1.103",
    porta: 80,
    status: "OFFLINE",
    ativo: false,
    intensidade: 0,
    versaoFirmware: "2.0.1",
    ultimaAtualizacao: new Date(),
  },
  {
    id: "4",
    nome: "Câmera Entrada",
    tipo: "CAMERA",
    comodo: "Entrada",
    ip: "192.168.1.104",
    porta: 8080,
    status: "ONLINE",
    ativo: true,
    intensidade: 100,
    versaoFirmware: "3.1.2",
    ultimaAtualizacao: new Date(),
  },
  {
    id: "5",
    nome: "Termostato Sala",
    tipo: "TERMOSTATO",
    comodo: "Sala",
    ip: "192.168.1.105",
    porta: 80,
    status: "ONLINE",
    ativo: true,
    intensidade: 22,
    versaoFirmware: "1.5.0",
    ultimaAtualizacao: new Date(),
  },
]

const getIconForType = (tipo: string) => {
  switch (tipo) {
    case "LAMPADA":
      return <Lightbulb className="w-5 h-5" />
    case "TOMADA":
      return <Plug className="w-5 h-5" />
    case "SENSOR":
      return <Activity className="w-5 h-5" />
    case "CAMERA":
      return <Camera className="w-5 h-5" />
    case "TERMOSTATO":
      return <Thermometer className="w-5 h-5" />
    default:
      return <Settings className="w-5 h-5" />
  }
}

const getIconForRoom = (comodo: string) => {
  switch (comodo.toLowerCase()) {
    case "sala":
      return <Home className="w-4 h-4" />
    case "quarto":
      return <Bed className="w-4 h-4" />
    case "cozinha":
      return <ChefHat className="w-4 h-4" />
    case "banheiro":
      return <Bath className="w-4 h-4" />
    case "garagem":
      return <Car className="w-4 h-4" />
    default:
      return <Home className="w-4 h-4" />
  }
}

export function IotControl() {
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>(dispositivosSimulados)
  const [selectedRoom, setSelectedRoom] = useState<string>("todos")

  const rooms = ["todos", ...Array.from(new Set(dispositivos.map((d) => d.comodo)))]

  const filteredDevices =
    selectedRoom === "todos" ? dispositivos : dispositivos.filter((d) => d.comodo === selectedRoom)

  const stats = {
    total: dispositivos.length,
    online: dispositivos.filter((d) => d.status === "ONLINE").length,
    offline: dispositivos.filter((d) => d.status === "OFFLINE").length,
    ativos: dispositivos.filter((d) => d.ativo).length,
  }

  const toggleDevice = (id: string) => {
    setDispositivos((prev) =>
      prev.map((device) =>
        device.id === id ? { ...device, ativo: !device.ativo, ultimaAtualizacao: new Date() } : device,
      ),
    )
  }

  const updateIntensity = (id: string, intensity: number[]) => {
    setDispositivos((prev) =>
      prev.map((device) =>
        device.id === id ? { ...device, intensidade: intensity[0], ultimaAtualizacao: new Date() } : device,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-amber-800 mb-2">Controle IoT</h2>
        <p className="text-amber-600">Gerencie todos os dispositivos da sua casa</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-800">{stats.total}</div>
            <div className="text-sm text-amber-600">Total</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-800">{stats.online}</div>
            <div className="text-sm text-green-600">Online</div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-800">{stats.offline}</div>
            <div className="text-sm text-red-600">Offline</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-800">{stats.ativos}</div>
            <div className="text-sm text-blue-600">Ativos</div>
          </CardContent>
        </Card>
      </div>

      {/* Room Filter */}
      <Tabs value={selectedRoom} onValueChange={setSelectedRoom} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-amber-100 border-amber-200">
          {rooms.map((room) => (
            <TabsTrigger
              key={room}
              value={room}
              className="data-[state=active]:bg-amber-200 data-[state=active]:text-amber-800 flex items-center gap-1"
            >
              {room !== "todos" && getIconForRoom(room)}
              <span className="capitalize">{room}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedRoom} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDevices.map((device) => (
              <Card
                key={device.id}
                className={`border-2 transition-all duration-200 ${
                  device.status === "ONLINE"
                    ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
                    : "border-red-200 bg-gradient-to-br from-red-50 to-rose-50"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getIconForType(device.tipo)}
                      <CardTitle className="text-lg">{device.nome}</CardTitle>
                    </div>
                    <Badge
                      variant={device.status === "ONLINE" ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {device.status === "ONLINE" ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                      {device.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    {getIconForRoom(device.comodo)}
                    {device.comodo}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Power Control */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Power className="w-4 h-4" />
                      <span className="font-medium">Energia</span>
                    </div>
                    <Switch
                      checked={device.ativo}
                      onCheckedChange={() => toggleDevice(device.id)}
                      disabled={device.status === "OFFLINE"}
                    />
                  </div>

                  {/* Intensity Control */}
                  {(device.tipo === "LAMPADA" || device.tipo === "TERMOSTATO") && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {device.tipo === "TERMOSTATO" ? "Temperatura" : "Intensidade"}
                        </span>
                        <span className="text-sm text-gray-600">
                          {device.intensidade}
                          {device.tipo === "TERMOSTATO" ? "°C" : "%"}
                        </span>
                      </div>
                      <Slider
                        value={[device.intensidade]}
                        onValueChange={(value) => updateIntensity(device.id, value)}
                        max={device.tipo === "TERMOSTATO" ? 30 : 100}
                        min={device.tipo === "TERMOSTATO" ? 16 : 0}
                        step={1}
                        disabled={device.status === "OFFLINE" || !device.ativo}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Device Info */}
                  <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
                    <div>
                      IP: {device.ip}:{device.porta}
                    </div>
                    {device.versaoFirmware && <div>Firmware: v{device.versaoFirmware}</div>}
                    <div>Atualizado: {device.ultimaAtualizacao?.toLocaleTimeString("pt-BR")}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDevices.length === 0 && (
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-8 text-center">
                <Settings className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Nenhum dispositivo encontrado</h3>
                <p className="text-amber-600">
                  {selectedRoom === "todos"
                    ? "Adicione dispositivos IoT para começar a controlar sua casa."
                    : `Não há dispositivos no cômodo "${selectedRoom}".`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Export default para compatibilidade
export default IotControl

// Export alternativo
export { IotControl as IoTControl }
