"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Smartphone, Lightbulb, Thermometer, Wifi, WifiOff, Plus, Power, Home, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Family {
  id: string
  name: string
  adminId: string
  members: { id: string; name: string; email: string; role: string }[]
}

interface IoTDevice {
  id: string
  name: string
  type: "light" | "thermostat" | "switch" | "sensor"
  room: string
  status: "online" | "offline"
  isOn: boolean
  value?: number
  maxValue?: number
  unit?: string
  addedAt: string
}

interface IoTControlProps {
  family: Family | null
}

const deviceTypes = [
  { value: "light", label: "Lâmpada", icon: Lightbulb },
  { value: "thermostat", label: "Termostato", icon: Thermometer },
  { value: "switch", label: "Interruptor", icon: Power },
  { value: "sensor", label: "Sensor", icon: Wifi },
]

const rooms = ["Sala", "Cozinha", "Quarto", "Banheiro", "Garagem", "Jardim", "Escritório"]

export function IoTControl({ family }: IoTControlProps) {
  const [devices, setDevices] = useState<IoTDevice[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "" as "light" | "thermostat" | "switch" | "sensor" | "",
    room: "",
  })

  useEffect(() => {
    // Carregar dispositivos do localStorage
    const savedDevices = JSON.parse(localStorage.getItem("iot-devices") || "[]")

    // Se não houver dispositivos, criar alguns exemplos
    if (savedDevices.length === 0) {
      const exampleDevices: IoTDevice[] = [
        {
          id: "1",
          name: "Luz da Sala",
          type: "light",
          room: "Sala",
          status: "online",
          isOn: true,
          value: 80,
          maxValue: 100,
          unit: "%",
          addedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Ar Condicionado",
          type: "thermostat",
          room: "Quarto",
          status: "online",
          isOn: false,
          value: 22,
          maxValue: 30,
          unit: "°C",
          addedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Sensor de Movimento",
          type: "sensor",
          room: "Cozinha",
          status: "offline",
          isOn: false,
          addedAt: new Date().toISOString(),
        },
      ]
      setDevices(exampleDevices)
      localStorage.setItem("iot-devices", JSON.stringify(exampleDevices))
    } else {
      setDevices(savedDevices)
    }
  }, [])

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.type || !formData.room) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    const newDevice: IoTDevice = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      room: formData.room,
      status: "online",
      isOn: false,
      value: formData.type === "light" ? 50 : formData.type === "thermostat" ? 20 : undefined,
      maxValue: formData.type === "light" ? 100 : formData.type === "thermostat" ? 30 : undefined,
      unit: formData.type === "light" ? "%" : formData.type === "thermostat" ? "°C" : undefined,
      addedAt: new Date().toISOString(),
    }

    const updatedDevices = [...devices, newDevice]
    setDevices(updatedDevices)
    localStorage.setItem("iot-devices", JSON.stringify(updatedDevices))

    toast.success("Dispositivo adicionado com sucesso!")
    setFormData({ name: "", type: "", room: "" })
    setShowAddDialog(false)
  }

  const handleToggleDevice = (id: string) => {
    const updatedDevices = devices.map((device) => (device.id === id ? { ...device, isOn: !device.isOn } : device))
    setDevices(updatedDevices)
    localStorage.setItem("iot-devices", JSON.stringify(updatedDevices))

    const device = devices.find((d) => d.id === id)
    toast.success(`${device?.name} ${device?.isOn ? "desligado" : "ligado"}!`)
  }

  const handleValueChange = (id: string, newValue: number[]) => {
    const updatedDevices = devices.map((device) => (device.id === id ? { ...device, value: newValue[0] } : device))
    setDevices(updatedDevices)
    localStorage.setItem("iot-devices", JSON.stringify(updatedDevices))
  }

  const handleDeleteDevice = (id: string) => {
    const updatedDevices = devices.filter((device) => device.id !== id)
    setDevices(updatedDevices)
    localStorage.setItem("iot-devices", JSON.stringify(updatedDevices))
    toast.success("Dispositivo removido!")
  }

  const getDeviceIcon = (type: string) => {
    const deviceType = deviceTypes.find((dt) => dt.value === type)
    return deviceType?.icon || Wifi
  }

  const onlineDevices = devices.filter((d) => d.status === "online")
  const offlineDevices = devices.filter((d) => d.status === "offline")

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="retro-shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Controle IoT
              </CardTitle>
              <CardDescription className="text-sm">
                {onlineDevices.length} dispositivo{onlineDevices.length !== 1 ? "s" : ""} online
                {offlineDevices.length > 0 && ` • ${offlineDevices.length} offline`}
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-retro-purple hover:bg-retro-purple/90 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Dispositivo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle>Novo Dispositivo IoT</DialogTitle>
                  <DialogDescription>Adicione um novo dispositivo à sua casa inteligente</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDevice} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="device-name">Nome do Dispositivo *</Label>
                    <Input
                      id="device-name"
                      placeholder="Ex: Luz da Sala"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {deviceTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Cômodo *</Label>
                      <Select
                        value={formData.room}
                        onValueChange={(value) => setFormData({ ...formData, room: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecione" />
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
                      className="flex-1 h-11 bg-retro-purple hover:bg-retro-purple/90 order-1 sm:order-2"
                    >
                      Adicionar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Resumo por Cômodo */}
      <Card className="retro-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Home className="h-5 w-5" />
            Resumo por Cômodo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {rooms.map((room) => {
              const roomDevices = devices.filter((d) => d.room === room)
              const onlineCount = roomDevices.filter((d) => d.status === "online").length

              if (roomDevices.length === 0) return null

              return (
                <div key={room} className="text-center p-3 border rounded-lg">
                  <h3 className="font-medium text-sm mb-1">{room}</h3>
                  <p className="text-xs text-muted-foreground">
                    {onlineCount}/{roomDevices.length} online
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dispositivos Online */}
      {onlineDevices.length > 0 && (
        <Card className="retro-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-600" />
              Dispositivos Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {onlineDevices.map((device) => {
                const DeviceIcon = getDeviceIcon(device.type)
                return (
                  <Card key={device.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <DeviceIcon className={`h-5 w-5 ${device.isOn ? "text-retro-orange" : "text-gray-400"}`} />
                          <div>
                            <h3 className="font-medium text-sm">{device.name}</h3>
                            <p className="text-xs text-muted-foreground">{device.room}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs text-green-600">
                            Online
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDevice(device.id)}
                            className="text-red-600 hover:text-red-700 p-1 h-8 w-8"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Ligado</span>
                          <Switch checked={device.isOn} onCheckedChange={() => handleToggleDevice(device.id)} />
                        </div>

                        {device.value !== undefined && device.maxValue && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{device.type === "light" ? "Intensidade" : "Temperatura"}</span>
                              <span className="text-sm font-medium">
                                {device.value}
                                {device.unit}
                              </span>
                            </div>
                            <Slider
                              value={[device.value]}
                              onValueChange={(value) => handleValueChange(device.id, value)}
                              max={device.maxValue}
                              min={device.type === "thermostat" ? 16 : 0}
                              step={1}
                              disabled={!device.isOn}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dispositivos Offline */}
      {offlineDevices.length > 0 && (
        <Card className="retro-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <WifiOff className="h-5 w-5 text-red-600" />
              Dispositivos Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {offlineDevices.map((device) => {
                const DeviceIcon = getDeviceIcon(device.type)
                return (
                  <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <DeviceIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-sm">{device.name}</h3>
                        <p className="text-xs text-muted-foreground">{device.room}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs text-red-600">
                        Offline
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDevice(device.id)}
                        className="text-red-600 hover:text-red-700 p-1 h-8 w-8"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado Vazio */}
      {devices.length === 0 && (
        <Card className="retro-shadow">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">Nenhum Dispositivo</h3>
            <p className="text-muted-foreground text-center mb-6">
              Comece adicionando dispositivos IoT à sua casa inteligente
            </p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-retro-purple hover:bg-retro-purple/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Dispositivo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
