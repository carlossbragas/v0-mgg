# Etapa base com OpenSSL (Debian)
FROM node:20 AS base
RUN apt-get update && apt-get install -y openssl

# Etapa de dependências
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --no-frozen-lockfile

# Etapa de build
FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN pnpm build

# Etapa final
FROM base AS runner
WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000

CMD ["pnpm", "start"]
