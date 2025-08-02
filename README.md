# MinhaGrana PWA 💰

Uma aplicação PWA para controle financeiro familiar com design retrô e funcionalidades completas.

## 🚀 Funcionalidades

- 📱 **PWA** - Funciona offline e pode ser instalado no celular
- 👨‍👩‍👧‍👦 **Controle Familiar** - Cada família é uma instância isolada
- 💰 **Gestão de Gastos** - Controle completo de receitas e despesas
- 📊 **Relatórios Visuais** - Gráficos e análises detalhadas
- 👤 **Carteiras Individuais** - Controle por membro da família
- 🛒 **Lista de Compras** - Colaborativa e sincronizada
- ✅ **Gerenciador de Tarefas** - Organização familiar
- 🏠 **Controle IoT** - Integração com dispositivos inteligentes
- 🎨 **Design Retrô** - Interface nostálgica e moderna

## 🐳 Docker Setup

### Desenvolvimento

\`\`\`bash
# Clonar o repositório
git clone <repository-url>
cd minha-grana-pwa

# Configurar ambiente
chmod +x scripts/setup.sh
./scripts/setup.sh

# Ou manualmente:
cp .env.example .env
docker-compose up --build
\`\`\`

### Produção

\`\`\`bash
# Configurar variáveis de produção
cp .env.example .env.production
# Editar .env.production com valores reais

# Deploy
chmod +x scripts/deploy.sh
./scripts/deploy.sh

# Ou manualmente:
docker-compose -f docker-compose.prod.yml up --build -d
\`\`\`

## 📋 Comandos Úteis

\`\`\`bash
# Desenvolvimento
npm run docker:dev      # Iniciar em modo desenvolvimento
npm run docker:prod     # Iniciar em modo produção
npm run docker:down     # Parar containers
npm run docker:clean    # Limpar tudo (containers, volumes, imagens)

# Banco de dados
docker-compose exec app npx prisma migrate dev
docker-compose exec app npx prisma generate
docker-compose exec app npx prisma studio

# Logs
docker-compose logs -f app      # Logs da aplicação
docker-compose logs -f postgres # Logs do banco
\`\`\`

## 🌐 Acessos

- **Aplicação**: http://localhost:3000
- **Adminer** (DB Manager): http://localhost:8080
- **Prisma Studio**: http://localhost:5555

### Credenciais do Banco (desenvolvimento)
- **Host**: localhost:5432
- **Database**: minhagrana
- **Username**: postgres
- **Password**: minhagrana123

## 🏗️ Arquitetura

\`\`\`
minha-grana-pwa/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── components/        # Componentes React
│   └── globals.css        # Estilos globais
├── components/            # Componentes UI (shadcn/ui)
├── lib/                   # Utilitários e configurações
├── prisma/               # Schema e migrações do banco
├── public/               # Arquivos estáticos
├── scripts/              # Scripts de automação
├── docker-compose.yml    # Configuração Docker (dev)
├── docker-compose.prod.yml # Configuração Docker (prod)
├── Dockerfile            # Multi-stage build
└── nginx.conf            # Configuração Nginx (prod)
\`\`\`

## 🔧 Configuração

### Variáveis de Ambiente

\`\`\`env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/minhagrana"

# Next.js
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

### Banco de Dados

O projeto usa PostgreSQL com Prisma ORM. As migrações são executadas automaticamente no primeiro build.

### PWA

A aplicação é configurada como PWA com:
- Service Worker para cache offline
- Manifest para instalação
- Ícones otimizados para diferentes dispositivos

## 🚀 Deploy

### Docker Swarm (Produção)

\`\`\`bash
# Inicializar swarm
docker swarm init

# Deploy do stack
docker stack deploy -c docker-compose.prod.yml minhagrana

# Verificar serviços
docker service ls
\`\`\`

### Variáveis de Produção

\`\`\`env
POSTGRES_PASSWORD="secure-password"
NEXT_PUBLIC_API_BASE_URL="https://yourdomain.com"
NEXTAUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
\`\`\`

## 🛠️ Desenvolvimento

### Estrutura do Projeto

- **Frontend**: Next.js 14 com App Router
- **Backend**: API Routes do Next.js
- **Database**: PostgreSQL com Prisma
- **UI**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

### Adicionando Novas Funcionalidades

1. Criar componente em `app/components/`
2. Adicionar rota de API em `app/api/`
3. Atualizar schema do Prisma se necessário
4. Executar migrações

## 📱 PWA Features

- ✅ Offline First
- ✅ Installable
- ✅ Responsive Design
- ✅ Push Notifications (futuro)
- ✅ Background Sync (futuro)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
