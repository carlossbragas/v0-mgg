import { z } from "zod"

export const UsuarioSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["admin", "member"]).default("member"),
  familiaId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const FamiliaSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, "Nome da família deve ter pelo menos 2 caracteres"),
  descricao: z.string().optional(),
  orcamentoMensal: z.number().positive("Orçamento deve ser positivo"),
  metaEconomia: z.number().min(0, "Meta de economia deve ser positiva").optional(),
  adminId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const GastoSchema = z.object({
  id: z.string().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.number().positive("Valor deve ser positivo"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  data: z.date(),
  usuarioId: z.string(),
  familiaId: z.string(),
  createdAt: z.date().optional(),
})

export const CategoriaSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome da categoria é obrigatório"),
  cor: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato hexadecimal"),
  icone: z.string().optional(),
  familiaId: z.string(),
  createdAt: z.date().optional(),
})

export const DispositivoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome do dispositivo é obrigatório"),
  tipo: z.enum(["luz", "ar_condicionado", "tv", "geladeira", "outros"]),
  status: z.boolean().default(false),
  consumo: z.number().min(0, "Consumo deve ser positivo").optional(),
  familiaId: z.string(),
  createdAt: z.date().optional(),
})

export const LogSchema = z.object({
  id: z.string().optional(),
  acao: z.string().min(1, "Ação é obrigatória"),
  dispositivo: z.string().min(1, "Dispositivo é obrigatório"),
  usuario: z.string().min(1, "Usuário é obrigatório"),
  timestamp: z.date(),
  familiaId: z.string(),
})

export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
})

export const SignupSchema = z
  .object({
    nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "Senhas não coincidem",
    path: ["confirmarSenha"],
  })

export type Usuario = z.infer<typeof UsuarioSchema>
export type Familia = z.infer<typeof FamiliaSchema>
export type Gasto = z.infer<typeof GastoSchema>
export type Categoria = z.infer<typeof CategoriaSchema>
export type Dispositivo = z.infer<typeof DispositivoSchema>
export type Log = z.infer<typeof LogSchema>
export type LoginData = z.infer<typeof LoginSchema>
export type SignupData = z.infer<typeof SignupSchema>
