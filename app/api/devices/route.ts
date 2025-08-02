import { type NextRequest, NextResponse } from "next/server"
import { deviceSchema } from "@/lib/validation"

// Mock database
const devices = [
  {
    id: 1,
    name: "Luz da Sala",
    type: "light",
    status: "online",
    room: "Sala",
    value: 80,
    isOn: true,
    lastUpdate: "2024-01-15 14:30",
  },
  {
    id: 2,
    name: "Ar Condicionado",
    type: "climate",
    status: "online",
    room: "Quarto Principal",
    value: 22,
    isOn: true,
    lastUpdate: "2024-01-15 14:25",
  },
]

export async function GET() {
  return NextResponse.json({ devices })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = deviceSchema.parse(body)

    const newDevice = {
      id: devices.length + 1,
      ...validatedData,
      status: "online",
      lastUpdate: new Date().toLocaleString("pt-BR"),
    }

    devices.push(newDevice)

    return NextResponse.json({ device: newDevice }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const deviceIndex = devices.findIndex((d) => d.id === id)
    if (deviceIndex === -1) {
      return NextResponse.json({ error: "Dispositivo não encontrado" }, { status: 404 })
    }

    devices[deviceIndex] = {
      ...devices[deviceIndex],
      ...updateData,
      lastUpdate: new Date().toLocaleString("pt-BR"),
    }

    return NextResponse.json({ device: devices[deviceIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar dispositivo" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = Number.parseInt(searchParams.get("id") || "0")

    const deviceIndex = devices.findIndex((d) => d.id === id)
    if (deviceIndex === -1) {
      return NextResponse.json({ error: "Dispositivo não encontrado" }, { status: 404 })
    }

    devices.splice(deviceIndex, 1)

    return NextResponse.json({ message: "Dispositivo removido com sucesso" })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao remover dispositivo" }, { status: 500 })
  }
}
