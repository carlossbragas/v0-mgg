import { z } from "zod"

// Esquema para o cadastro/atualização de dispositivos
export const DispositivoSchema = z.object({
  id_dispositivo: z.string().min(1, "ID do dispositivo é obrigatório"),
  versao: z.string().optional(),
  nome: z.string().optional(),
  sobrenome: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("Formato de e-mail inválido").optional(),
  ip: z.string().ip("Formato de IP inválido").optional(),
  mac: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Formato MAC inválido")
    .optional(),
  wifi_rssi: z.number().int().optional(),
  origem: z.string().optional(),
})

// Esquema para o registro de logs
export const LogSchema = z.object({
  id_dispositivo: z.string().min(1, "ID do dispositivo é obrigatório"),
  mensagem: z.string().min(1, "Mensagem do log é obrigatória"),
  timestamp: z.string().datetime("Formato de data/hora inválido para o timestamp do dispositivo"), // Espera string ISO 8601
})

export type DispositivoInput = z.infer<typeof DispositivoSchema>
export type LogInput = z.infer<typeof LogSchema>
