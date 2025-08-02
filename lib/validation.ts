import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export const familySetupSchema = z.object({
  familyName: z.string().min(2, "Nome da família deve ter pelo menos 2 caracteres"),
  adminName: z.string().min(2, "Nome do administrador deve ter pelo menos 2 caracteres"),
  members: z.array(
    z.object({
      name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
      role: z.enum(["adult", "child"]),
      allowance: z.number().min(0, "Mesada deve ser um valor positivo"),
    }),
  ),
  budget: z.object({
    monthly: z.number().min(0, "Orçamento mensal deve ser um valor positivo"),
    categories: z.array(
      z.object({
        name: z.string().min(1, "Nome da categoria é obrigatório"),
        limit: z.number().min(0, "Limite deve ser um valor positivo"),
      }),
    ),
  }),
})

export const expenseSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  category: z.string().min(1, "Categoria é obrigatória"),
  member: z.string().min(1, "Membro é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
})

export const deviceSchema = z.object({
  name: z.string().min(1, "Nome do dispositivo é obrigatório"),
  type: z.enum(["light", "climate", "security", "appliance", "sensor"]),
  room: z.string().min(1, "Cômodo é obrigatório"),
  value: z.number().min(0, "Valor deve ser positivo"),
  isOn: z.boolean(),
})

export type LoginData = z.infer<typeof loginSchema>
export type FamilySetupData = z.infer<typeof familySetupSchema>
export type ExpenseData = z.infer<typeof expenseSchema>
export type DeviceData = z.infer<typeof deviceSchema>
