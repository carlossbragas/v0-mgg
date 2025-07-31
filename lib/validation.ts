import { z } from "zod"

// Esquema para validação de Dispositivo
export const DispositivoSchema = z.object({
  id_dispositivo: z.string().min(1, "ID do dispositivo é obrigatório"),
  versao: z.string().optional(),
  nome: z.string().min(1, "Nome do dispositivo é obrigatório"),
  sobrenome: z.string().optional(), // Pode ser usado para um nome mais descritivo ou localização
  telefone: z.string().optional(),
  email: z.string().email("Formato de e-mail inválido").optional(),
  ip: z.string().ip("Formato de IP inválido").optional(),
  mac: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Formato de MAC inválido")
    .optional(),
  wifi_rssi: z.number().int().optional(),
  origem: z.string().optional(), // Ex: "tseca", "minhagrana-app"
  status: z.enum(["on", "off"]).optional().default("off"), // Adicionado status para controle IoT
  type: z.enum(["light", "thermostat", "speaker", "other"]).optional().default("other"), // Tipo de dispositivo
  room: z.string().optional(), // Cômodo onde o dispositivo está
})

// Esquema para validação de Log
export const LogSchema = z.object({
  id_dispositivo: z.string().min(1, "ID do dispositivo é obrigatório"),
  mensagem: z.string().min(1, "Mensagem do log é obrigatória"),
  timestamp: z.string().datetime("Formato de timestamp inválido (ISO 8601 esperado)"), // Espera string ISO 8601
})
