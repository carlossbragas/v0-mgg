# Use a imagem oficial do Node.js para a fase de build
FROM --platform=linux/amd64 node:20-alpine AS base

# 1. Instalar dependências do pnpm
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# 2. Buildar a aplicação Next.js
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build

# Use uma imagem menor para a fase de produção
FROM base AS runner

WORKDIR /app

# Copia os arquivos de produção do build anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Garante que o Prisma Client esteja disponível
ENV NODE_ENV production
# Desabilita a telemetria do Next.js em produção
ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate --schema=./prisma/schema.prisma

# Expõe a porta que o Next.js usa
EXPOSE 3000

# Define a variável de ambiente para o host do Next.js
ENV HOST=0.0.0.0

# Comando para iniciar a aplicação em produção
CMD ["pnpm", "start"]
