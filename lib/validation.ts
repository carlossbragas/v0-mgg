import { z } from "zod"

// Schemas para API existente
export const createUserSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  papel: z.enum(["ADMIN", "MEMBRO"]).default("MEMBRO"),
  familiaId: z.string().optional(),
})

export const updateUserSchema = z.object({
  nome: z.string().min(1).optional(),
  email: z.string().email().optional(),
  senha: z.string().min(6).optional(),
  papel: z.enum(["ADMIN", "MEMBRO"]).optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
})

// Schemas para dispositivos IoT
export const DispositivoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.enum(["LAMPADA", "TOMADA", "SENSOR", "CAMERA", "TERMOSTATO", "OUTRO"]),
  comodo: z.string().min(1, "Cômodo é obrigatório"),
  ip: z.string().ip("IP inválido"),
  porta: z.number().int().min(1).max(65535),
  status: z.enum(["ONLINE", "OFFLINE"]).default("OFFLINE"),
  ativo: z.boolean().default(false),
  intensidade: z.number().int().min(0).max(100).default(0),
  versaoFirmware: z.string().optional(),
  ultimaAtualizacao: z.date().optional(),
  familiaId: z.string(),
})

export const LogSchema = z.object({
  id: z.string().optional(),
  dispositivoId: z.string(),
  acao: z.string().min(1, "Ação é obrigatória"),
  valor: z.string().optional(),
  timestamp: z.date().default(() => new Date()),
  usuarioId: z.string().optional(),
  sucesso: z.boolean().default(true),
  erro: z.string().optional(),
})

// Schemas para controle de dispositivos
export const ControleDispositivoSchema = z.object({
  dispositivoId: z.string(),
  acao: z.enum(["LIGAR", "DESLIGAR", "TOGGLE", "DEFINIR_INTENSIDADE"]),
  valor: z.number().int().min(0).max(100).optional(),
  usuarioId: z.string(),
})

// Schemas para família
export const createFamiliaSchema = z.object({
  nome: z.string().min(1, "Nome da família é obrigatório"),
  descricao: z.string().optional(),
})

// Schemas para transações financeiras
export const transacaoSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.number().positive("Valor deve ser positivo"),
  tipo: z.enum(["RECEITA", "DESPESA"]),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  data: z.date().default(() => new Date()),
  usuarioId: z.string(),
  familiaId: z.string(),
})

// Schemas para tarefas
export const tarefaSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  concluida: z.boolean().default(false),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA"]).default("MEDIA"),
  dataVencimento: z.date().optional(),
  responsavelId: z.string().optional(),
  familiaId: z.string(),
})

// Schemas para lista de compras
export const itemCompraSchema = z.object({
  nome: z.string().min(1, "Nome do item é obrigatório"),
  quantidade: z.number().int().positive().default(1),
  preco: z.number().positive().optional(),
  categoria: z.string().optional(),
  comprado: z.boolean().default(false),
  familiaId: z.string(),
})

// Types derivados dos schemas
export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
export type Login = z.infer<typeof loginSchema>
export type Dispositivo = z.infer<typeof DispositivoSchema>
export type Log = z.infer<typeof LogSchema>
export type ControleDispositivo = z.infer<typeof ControleDispositivoSchema>
export type CreateFamilia = z.infer<typeof createFamiliaSchema>
export type Transacao = z.infer<typeof transacaoSchema>
export type Tarefa = z.infer<typeof tarefaSchema>
export type ItemCompra = z.infer<typeof itemCompraSchema>
