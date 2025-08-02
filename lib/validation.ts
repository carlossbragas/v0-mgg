import { z } from "zod"

// Schemas para usuários
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "member", "child"]),
  familyId: z.string().optional(),
  balance: z.number().default(0),
  avatar: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Schemas para família
export const FamilySchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nome da família deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  code: z.string().min(6, "Código deve ter pelo menos 6 caracteres"),
  adminId: z.string(),
  currency: z.string().default("BRL"),
  timezone: z.string().default("America/Sao_Paulo"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export const CreateFamilySchema = FamilySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateFamilySchema = FamilySchema.partial().omit({
  id: true,
  createdAt: true,
})

// Schemas para transações
export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  familyId: z.string(),
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Valor deve ser positivo"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  date: z.date().default(() => new Date()),
  status: z.enum(["pending", "completed", "cancelled"]).default("completed"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export const CreateTransactionSchema = TransactionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateTransactionSchema = TransactionSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Schemas para tarefas
export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  assignedTo: z.string(),
  assignedBy: z.string(),
  familyId: z.string(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
  dueDate: z.date().optional(),
  reward: z.number().min(0).default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  completedAt: z.date().optional(),
})

export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
})

export const UpdateTaskSchema = TaskSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Schemas para lista de compras
export const ShoppingItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome do item é obrigatório"),
  quantity: z.number().positive("Quantidade deve ser positiva").default(1),
  unit: z.string().default("unidades"),
  category: z.string().optional(),
  estimatedPrice: z.number().min(0).default(0),
  actualPrice: z.number().min(0).optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  completed: z.boolean().default(false),
  addedBy: z.string(),
  familyId: z.string(),
  listId: z.string(),
  notes: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export const CreateShoppingItemSchema = ShoppingItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateShoppingItemSchema = ShoppingItemSchema.partial().omit({
  id: true,
  createdAt: true,
})

export const ShoppingListSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome da lista é obrigatório"),
  description: z.string().optional(),
  familyId: z.string(),
  createdBy: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export const CreateShoppingListSchema = ShoppingListSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

// Schemas para dispositivos IoT
export const DispositivoSchema = z.object({
  id: z.string(),
  nome: z.string().min(1, "Nome do dispositivo é obrigatório"),
  tipo: z.enum(["luz", "ar_condicionado", "tv", "som", "camera", "sensor", "outros"]),
  status: z.enum(["online", "offline", "erro"]).default("offline"),
  ativo: z.boolean().default(false),
  familyId: z.string(),
  configuracao: z.record(z.any()).optional(),
  ultimaAtualizacao: z.date().default(() => new Date()),
  criadoEm: z.date().default(() => new Date()),
})

export const CreateDispositivoSchema = DispositivoSchema.omit({
  id: true,
  criadoEm: true,
  ultimaAtualizacao: true,
})

export const UpdateDispositivoSchema = DispositivoSchema.partial().omit({
  id: true,
  criadoEm: true,
})

// Schemas para logs
export const LogSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  familyId: z.string(),
  acao: z.string().min(1, "Ação é obrigatória"),
  detalhes: z.string().optional(),
  tipo: z.enum(["info", "warning", "error", "success"]).default("info"),
  timestamp: z.date().default(() => new Date()),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
})

export const CreateLogSchema = LogSchema.omit({
  id: true,
  timestamp: true,
})

// Schemas para autenticação
export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export const RegisterSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  })

// Schemas para metas de economia
export const SavingsGoalSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome da meta é obrigatório"),
  target: z.number().positive("Meta deve ser positiva"),
  current: z.number().min(0).default(0),
  userId: z.string(),
  familyId: z.string(),
  deadline: z.date().optional(),
  description: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export const CreateSavingsGoalSchema = SavingsGoalSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateSavingsGoalSchema = SavingsGoalSchema.partial().omit({
  id: true,
  createdAt: true,
})

// Tipos TypeScript derivados dos schemas
export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type UpdateUser = z.infer<typeof UpdateUserSchema>

export type Family = z.infer<typeof FamilySchema>
export type CreateFamily = z.infer<typeof CreateFamilySchema>
export type UpdateFamily = z.infer<typeof UpdateFamilySchema>

export type Transaction = z.infer<typeof TransactionSchema>
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>

export type Task = z.infer<typeof TaskSchema>
export type CreateTask = z.infer<typeof CreateTaskSchema>
export type UpdateTask = z.infer<typeof UpdateTaskSchema>

export type ShoppingItem = z.infer<typeof ShoppingItemSchema>
export type CreateShoppingItem = z.infer<typeof CreateShoppingItemSchema>
export type UpdateShoppingItem = z.infer<typeof UpdateShoppingItemSchema>

export type ShoppingList = z.infer<typeof ShoppingListSchema>
export type CreateShoppingList = z.infer<typeof CreateShoppingListSchema>

export type Dispositivo = z.infer<typeof DispositivoSchema>
export type CreateDispositivo = z.infer<typeof CreateDispositivoSchema>
export type UpdateDispositivo = z.infer<typeof UpdateDispositivoSchema>

export type Log = z.infer<typeof LogSchema>
export type CreateLog = z.infer<typeof CreateLogSchema>

export type Login = z.infer<typeof LoginSchema>
export type Register = z.infer<typeof RegisterSchema>

export type SavingsGoal = z.infer<typeof SavingsGoalSchema>
export type CreateSavingsGoal = z.infer<typeof CreateSavingsGoalSchema>
export type UpdateSavingsGoal = z.infer<typeof UpdateSavingsGoalSchema>
