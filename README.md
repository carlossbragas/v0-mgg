# 🏠 MinhaGrana PWA

PWA para controle financeiro familiar com design retrô, desenvolvido com Next.js 14, Prisma e PostgreSQL.

## ✨ Funcionalidades

- 📱 **PWA Completo** - Funciona offline e pode ser instalado
- 💰 **Controle Financeiro** - Gestão de gastos e receitas familiares
- 👨‍👩‍👧‍👦 **Multi-usuário** - Cada família é uma instância isolada
- 📊 **Relatórios Visuais** - Gráficos e análises detalhadas
- 🛒 **Lista de Compras** - Colaborativa para toda a família
- ✅ **Gerenciador de Tarefas** - Organize as atividades familiares
- 🏠 **Controle IoT** - Gerencie dispositivos inteligentes
- 🎨 **Design Retrô** - Interface nostálgica e moderna
- 📱 **Mobile First** - Otimizado para dispositivos móveis

## 🚀 Deploy na Vercel

### 1. Preparação

\`\`\`bash
# Clone o repositório
git clone https://github.com/seu-usuario/minha-grana-pwa.git
cd minha-grana-pwa

# Instale as dependências
npm install
\`\`\`

### 2. Configuração do Banco de Dados

#### Opção A: Neon (Recomendado)
1. Acesse [Neon](https://neon.tech)
2. Crie um novo projeto PostgreSQL
3. Copie a connection string

#### Opção B: Supabase
1. Acesse [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a connection string

### 3. Deploy na Vercel

#### Via GitHub (Recomendado)
1. Faça push do código para o GitHub
2. Acesse [Vercel](https://vercel.com)
3. Importe o repositório
4. Configure as variáveis de ambiente:

\`\`\`env
DATABASE_URL=sua_connection_string_aqui
DIRECT_URL=sua_connection_string_aqui
NEXTAUTH_URL=https://seu-app.vercel.app
NEXTAUTH_SECRET=sua_chave_secreta_aqui
NEXT_PUBLIC_API_BASE_URL=https://seu-app.vercel.app/api
\`\`\`

5. Deploy automático! 🎉

#### Via CLI
\`\`\`bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel --prod
\`\`\`

### 4. Configuração Pós-Deploy

1. **Domínio Personalizado** (opcional)
   - Vá em Settings > Domains na Vercel
   - Adicione seu domínio personalizado

2. **Analytics** (opcional)
   - Ative o Vercel Analytics no dashboard

3. **Monitoramento**
   - Configure alertas de erro
   - Monitore performance

## 🛠️ Desenvolvimento Local

\`\`\`bash
# Instalar dependências
npm install

# Configurar banco de dados
cp .env.example .env
# Edite o .env com suas configurações

# Executar migrações
npm run db:push

# Iniciar desenvolvimento
npm run dev
\`\`\`

## 📦 Scripts Disponíveis

\`\`\`bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar produção
npm run lint         # Linter
npm run type-check   # Verificação de tipos
npm run vercel-build # Build para Vercel
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Aplicar schema ao banco
npm run db:migrate   # Executar migrações
npm run db:studio    # Interface visual do banco
\`\`\`

## 🏗️ Arquitetura

\`\`\`
minha-grana-pwa/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes
│   ├── components/        # Componentes da aplicação
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx          # Página inicial
│   └── manifest.json     # PWA Manifest
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de UI (shadcn)
│   └── theme-provider.tsx
├── lib/                   # Utilitários
│   ├── prisma.ts         # Cliente Prisma
│   ├── utils.ts          # Funções utilitárias
│   └── validation.ts     # Schemas de validação
├── prisma/               # Schema do banco
│   └── schema.prisma
├── public/               # Arquivos estáticos
├── styles/               # Estilos adicionais
├── next.config.mjs       # Configuração Next.js
├── tailwind.config.ts    # Configuração Tailwind
├── vercel.json          # Configuração Vercel
└── package.json
\`\`\`

## 🎨 Design System

- **Cores Principais**: Verde retrô (#007A33), Laranja (#FF6B35), Ciano (#00CED1)
- **Tipografia**: Inter (Google Fonts)
- **Componentes**: shadcn/ui + customizações retrô
- **Ícones**: Lucide React
- **Animações**: Tailwind CSS + CSS custom

## 🔒 Segurança

- ✅ Validação de dados com Zod
- ✅ Sanitização de inputs
- ✅ Headers de segurança
- ✅ CORS configurado
- ✅ Rate limiting (Vercel)
- ✅ Isolamento por família

## 📱 PWA Features

- ✅ Service Worker
- ✅ Manifest completo
- ✅ Ícones em todas as resoluções
- ✅ Shortcuts de aplicativo
- ✅ Funciona offline
- ✅ Instalável
- ✅ Push notifications (preparado)

## 🚀 Performance

- ✅ Next.js 14 App Router
- ✅ Server Components
- ✅ Image Optimization
- ✅ Bundle Analyzer
- ✅ Lazy Loading
- ✅ Cache Strategy
- ✅ Edge Functions

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 📧 Email: suporte@minhagrana.com
- 💬 Discord: [MinhaGrana Community](https://discord.gg/minhagrana)
- 📖 Documentação: [docs.minhagrana.com](https://docs.minhagrana.com)

---

Feito com ❤️ para famílias brasileiras 🇧🇷
\`\`\`

```plaintext file=".gitignore"
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
/prisma/migrations/

# docker
docker-compose.override.yml

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test
.env.production
.env.local
.env.development.local
.env.test.local
.env.production.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test
