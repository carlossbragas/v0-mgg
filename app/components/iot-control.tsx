"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Lightbulb, Thermometer, Speaker, Wifi, Home, Search } from "lucide-react"

interface Device {
  id: string
  id_dispositivo: string // Unique ID from the device itself (e.g., MAC address, custom ID)
  name: string
  type: "light" | "thermostat" | "speaker" | "other"
  room: string
  status: "on" | "off"
  ip?: string
  mac?: string
  wifi_rssi?: number
  version?: string
  createdAt: string // ISO string
  updatedAt?: string // ISO string
}

export default function IotControl() {
  const [devices, setDevices] = useState<Device[]>([])
  const [newDeviceName, setNewDeviceName] = useState("")
  const [newDeviceType, setNewDeviceType] = useState<"light" | "thermostat" | "speaker" | "other" | "">("")
  const [newDeviceRoom, setNewDeviceRoom] = useState("")
  const [newDeviceId, setNewDeviceId] = useState("") // For id_dispositivo
  const [filterRoom, setFilterRoom] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api" // Use env var for API URL

  // Fetch devices from backend
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dispositivos`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Device[] = await response.json()
        setDevices(data)
      } catch (error) {
        console.error("Erro ao buscar dispositivos:", error)
        // Fallback to mock data if API fails
        setDevices([
          {
            id: "d1",
            id_dispositivo: "ESP-LIGHT-001",
            name: "Lâmpada Sala",
            type: "light",
            room: "Sala de Estar",
            status: "on",
            ip: "192.168.1.100",
            mac: "AA:BB:CC:DD:EE:F1",
            wifi_rssi: -50,
            version: "1.0.0",
            createdAt: new Date().toISOString(),
          },
          {
            id: "d2",
            id_dispositivo: "ESP-THERM-002",
            name: "Termostato Quarto",
            type: "thermostat",
            room: "Quarto Principal",
            status: "off",
            ip: "192.168.1.101",
            mac: "AA:BB:CC:DD:EE:F2",
            wifi_rssi: -65,
            version: "1.1.0",
            createdAt: new Date().toISOString(),
          },
          {
            id: "d3",
            id_dispositivo: "ESP-SPEAKER-003",
            name: "Caixa de Som Cozinha",
            type: "speaker",
            room: "Cozinha",
            status: "on",
            ip: "192.168.1.102",
            mac: "AA:BB:CC:DD:EE:F3",
            wifi_rssi: -40,
            version: "1.0.1",
            createdAt: new Date().toISOString(),
          },
        ])
      }
    }
    fetchDevices()
  }, [API_BASE_URL])

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeviceName || !newDeviceType || !newDeviceRoom || !newDeviceId) {
      alert("Todos os campos são obrigatórios para adicionar um dispositivo.")
      return
    }

    const newDeviceData = {
      id_dispositivo: newDeviceId,
      name: newDeviceName,
      type: newDeviceType,
      room: newDeviceRoom,
      status: "off", // Default status
      version: "1.0.0", // Mock version
      ip: "192.168.1.XXX", // Mock IP
      mac: "XX:XX:XX:XX:XX:XX", // Mock MAC
      wifi_rssi: -50, // Mock RSSI
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dispositivos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDeviceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao adicionar dispositivo.")
      }

      const result = await response.json()
      setDevices((prev) => [
        ...prev,
        { ...newDeviceData, id: result.dispositivo.id, createdAt: result.dispositivo.createdAt } as Device,
      ])
      setNewDeviceName("")
      setNewDeviceType("")
      setNewDeviceRoom("")
      setNewDeviceId("")
      alert("Dispositivo adicionado com sucesso!")
    } catch (error: any) {
      console.error("Erro ao adicionar dispositivo:", error)
      alert(`Erro ao adicionar dispositivo: ${error.message}`)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: "on" | "off") => {
    const deviceToUpdate = devices.find((d) => d.id === id)
    if (!deviceToUpdate) return

    const newStatus = currentStatus === "on" ? "off" : "on"
    const updatedDeviceData = { ...deviceToUpdate, status: newStatus }

    try {
      const response = await fetch(`${API_BASE_URL}/dispositivos`, {
        // Using POST for update as per API spec
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDeviceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao atualizar status do dispositivo.")
      }

      setDevices((prev) => prev.map((device) => (device.id === id ? { ...device, status: newStatus } : device)))
      alert(`Dispositivo ${deviceToUpdate.name} ${newStatus === "on" ? "ligado" : "desligado"}!`)
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error)
      alert(`Erro ao atualizar status: ${error.message}`)
    }
  }

  const handleEditDevice = (id: string) => {
    alert(`Editar dispositivo: ${id}`)
    // Implement actual edit logic (e.g., open a dialog with pre-filled data)
  }

  const handleDeleteDevice = async (id: string, id_dispositivo: string) => {
    if (confirm("Tem certeza que deseja remover este dispositivo?")) {
      try {
        // Assuming a DELETE endpoint for devices by id_dispositivo
        const response = await fetch(`${API_BASE_URL}/dispositivos/${id_dispositivo}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Erro ao excluir dispositivo.")
        }

        setDevices((prev) => prev.filter((device) => device.id !== id))
        alert("Dispositivo removido!")
      } catch (error: any) {
        console.error("Erro ao excluir dispositivo:", error)
        alert(`Erro ao excluir dispositivo: ${error.message}`)
      }
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "light":
        return <Lightbulb className="h-5 w-5" />
      case "thermostat":
        return <Thermometer className="h-5 w-5" />
      case "speaker":
        return <Speaker className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const rooms = Array.from(new Set(devices.map((d) => d.room)))
  const types = Array.from(new Set(devices.map((d) => d.type)))

  const filteredDevices = devices.filter((device) => {
    const matchesRoom = filterRoom === "all" || device.room === filterRoom
    const matchesType = filterType === "all" || device.type === filterType
    const matchesSearch =
      searchTerm === "" ||
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id_dispositivo.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesRoom && matchesType && matchesSearch
  })

  return (
    <Card className="w-full bg-white text-[#007A33] rounded-lg shadow-lg">
      <CardHeader className="text-center border-b pb-4">
        <CardTitle className="text-2xl font-bold">Controle de Dispositivos IoT</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Add New Device Form */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Adicionar Novo Dispositivo</h3>
        <form onSubmit={handleAddDevice} className="space-y-4 p-4 border rounded-lg bg-cyan-50">
          <div>
            <Label htmlFor="device-id" className="flex items-center gap-2 mb-1">
              ID do Dispositivo (ESP8266)
            </Label>
            <Input
              id="device-id"
              type="text"
              placeholder="Ex: ESP-LIGHT-001"
              value={newDeviceId}
              onChange={(e) => setNewDeviceId(e.target.value)}
              required
              className="border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          <div>
            <Label htmlFor="device-name" className="flex items-center gap-2 mb-1">
              Nome do Dispositivo
            </Label>
            <Input
              id="device-name"
              type="text"
              placeholder="Ex: Lâmpada da Sala"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              required
              className="border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="device-type" className="flex items-center gap-2 mb-1">
                Tipo
              </Label>
              <Select value={newDeviceType} onValueChange={setNewDeviceType} required>
                <SelectTrigger className="w-full border-cyan-500 focus:ring-cyan-500">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Lâmpada</SelectItem>
                  <SelectItem value="thermostat">Termostato</SelectItem>
                  <SelectItem value="speaker">Caixa de Som</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="device-room" className="flex items-center gap-2 mb-1">
                <Home className="h-4 w-4" /> Cômodo
              </Label>
              <Input
                id="device-room"
                type="text"
                placeholder="Ex: Cozinha, Quarto"
                value={newDeviceRoom}
                onChange={(e) => setNewDeviceRoom(e.target.value)}
                required
                className="border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
            <Plus className="h-5 w-5 mr-2" /> Adicionar Dispositivo
          </Button>
        </form>

        {/* Device List */}
        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Dispositivos Conectados</h3>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
          <div>
            <Label htmlFor="filter-room" className="flex items-center gap-2 mb-1">
              <Home className="h-4 w-4" /> Filtrar por Cômodo
            </Label>
            <Select value={filterRoom} onValueChange={setFilterRoom}>
              <SelectTrigger className="w-full border-cyan-500 focus:ring-cyan-500">
                <SelectValue placeholder="Todos os cômodos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {rooms.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-type" className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-4 w-4" /> Filtrar por Tipo
            </Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full border-cyan-500 focus:ring-cyan-500">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Label htmlFor="search-device" className="flex items-center gap-2 mb-1">
              <Search className="h-4 w-4" /> Buscar
            </Label>
            <Input
              id="search-device"
              type="text"
              placeholder="Buscar por nome, ID, cômodo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-cyan-500 focus:ring-cyan-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="space-y-3">
          {filteredDevices.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Nenhum dispositivo encontrado.</p>
          ) : (
            filteredDevices.map((device) => (
              <Card
                key={device.id}
                className={`p-3 flex items-center justify-between shadow-sm ${
                  device.status === "on"
                    ? "bg-green-50 border-l-4 border-green-500"
                    : "bg-red-50 border-l-4 border-red-500"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getDeviceIcon(device.type)}
                  <div>
                    <p className="font-medium text-gray-800">{device.name}</p>
                    <p className="text-sm text-gray-600">
                      {device.room} • ID: {device.id_dispositivo}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 gap-2">
                      <span>
                        <Wifi className="inline-block h-3 w-3 mr-1" />
                        RSSI: {device.wifi_rssi} dBm
                      </span>
                      <span>Versão: {device.version}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${device.status === "on" ? "text-green-600" : "text-red-600"}`}>
                    {device.status === "on" ? "Ligado" : "Desligado"}
                  </span>
                  <Switch
                    checked={device.status === "on"}
                    onCheckedChange={() => handleToggleStatus(device.id, device.status)}
                    className="data-[state=checked]:bg-cyan-600"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditDevice(device.id)}
                    className="text-blue-500 border-blue-500 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteDevice(device.id, device.id_dispositivo)}
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
