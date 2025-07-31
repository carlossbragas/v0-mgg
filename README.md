# MinhaGrana PWA

Este é um protótipo funcional de um aplicativo PWA (Progressive Web App) chamado **MinhaGrana**, focado em organização financeira familiar com um visual retrô moderno.

## Visão Geral

O MinhaGrana visa proporcionar clareza e usabilidade na gestão de despesas e tarefas domésticas entre os membros da família. Cada família é tratada como uma instância separada, garantindo que os dados sejam visíveis apenas para os membros autorizados.

## Tecnologias Utilizadas

*   **Frontend:** Next.js (App Router) com React e TypeScript
*   **Estilização:** Tailwind CSS com componentes shadcn/ui
*   **Backend (Mock):** Dados fictícios para simular o fluxo completo
*   **PWA:** Configurado para instalação e navegação fluida em dispositivos móveis
*   **Banco de Dados (Backend):** PostgreSQL com Prisma ORM
*   **Orquestração:** Docker Swarm com Traefik

## Estrutura do Projeto

\`\`\`
.
├── app/
│   ├── api/                  # Rotas da API (backend)
│   │   ├── dispositivos/
│   │   │   └── route.ts      # API para gerenciar dispositivos IoT
│   │   └── logs/
│   │       └── route.ts      # API para registrar logs de dispositivos
│   ├── components/           # Componentes React reutilizáveis
│   │   ├── dashboard.tsx
│   │   ├── expense-form.tsx
│   │   ├── expenses-list.tsx
│   │   ├── family-settings.tsx
│   │   ├── family-setup.tsx
│   │   ├── iot-control.tsx   # Componente para controle de dispositivos IoT
│   │   ├── login-screen.tsx
│   │   ├── member-wallet.tsx
│   │   ├── reports.tsx
│   │   ├── shopping-list.tsx
│   │   └── tasks-list.tsx
│   ├── iot-control/          # Página para o módulo IoT
│   │   └── page.tsx
│   ├── globals.css           # Estilos globais
│   ├── layout.tsx            # Layout principal da aplicação
│   ├── manifest.json         # Manifest do PWA
│   └── page.tsx              # Página inicial (controle de fluxo de telas)
├── components/ui/            # Componentes Shadcn UI (gerados)
├── hooks/                    # Hooks personalizados
├── lib/                      # Funções utilitárias e configurações
│   ├── prisma.ts             # Configuração do Prisma Client
│   └── validation.ts         # Esquemas de validação com Zod
├── prisma/                   # Configuração do Prisma ORM
│   └── schema.prisma         # Esquema do banco de dados
├── public/                   # Ativos estáticos (imagens, ícones)
├── styles/                   # Estilos adicionais
├── .env.production           # Variáveis de ambiente para produção
├── Dockerfile                # Configuração para build da imagem Docker
├── docker-stack.yaml         # Configuração para deploy com Docker Swarm e Traefik
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
\`\`\`

## Fluxo do Usuário (Frontend)

1.  **Início:** Nome do app, logo, slogan. Botões: `[Entrar]` e `[Criar conta]`.
2.  **Login/Cadastro:** Campos: e-mail, senha. Ações: Entrar, Criar conta, Esqueci a senha.
3.  **Criar ou Entrar em Família:**
    *   Criar nova família: nome, e-mail (admin).
    *   Entrar em família existente: inserir código de convite.
4.  **Dashboard da Família:** Visão geral: saldo total, gasto do mês, gráfico por categoria. Ações rápidas: `[Criar Despesa]`, `[Ver Despesas]`, `[Ver Relatórios]`.
5.  **Criar Nova Despesa:** Campos: valor, data, categoria, membro, dividir com (igual, percentual, valor), observações. Botão: `[Salvar]`.
6.  **Ver Despesas:** Filtros: membro, categoria, período. Lista com edição/exclusão.
7.  **Ver Relatórios:** Gráficos: por membro, por categoria, por mês. Exportação em PDF ou Excel.
8.  **Carteira do Membro:** Saldo individual, histórico pessoal de despesas, **cadastro de saldo**, **despesas recorrentes** (dia, mês, ano).
9.  **Lista de Tarefas:** Gerenciamento de tarefas com responsável, data limite, prioridade e status.
10. **Lista de Compras:** Gerenciamento de itens de compra com quantidade, preço estimado e status de compra.
11. **Controle IoT:** Módulo para listar e controlar dispositivos inteligentes (ligar/desligar).
12. **Configurações:** Nome da família, membros, preferências (idioma/moeda).
13. **Perfil do Usuário:** Nome, e-mail, papel, botão para editar ou excluir.

## Backend (API RESTful)

O backend é uma API RESTful desenvolvida com Next.js API Routes, Prisma ORM e PostgreSQL.

### Rotas da API

*   `POST /api/dispositivos`: Cadastra um novo dispositivo ou atualiza um existente (`id_dispositivo` é a chave única).
*   `GET /api/dispositivos`: Lista todos os dispositivos registrados.
*   `DELETE /api/dispositivos/{id_dispositivo}`: Exclui um dispositivo pelo seu `id_dispositivo`.
*   `POST /api/logs`: Registra logs de uso para um dispositivo específico.

### Modelo de Dados (Prisma)

*   **`Dispositivo`**: Representa um dispositivo IoT conectado.
    *   `id` (UUID)
    *   `id_dispositivo` (String, único) - ID do dispositivo físico (ex: MAC, ID customizado)
    *   `versao` (String)
    *   `nome` (String)
    *   `sobrenome` (String)
    *   `telefone` (String)
    *   `email` (String)
    *   `ip` (String)
    *   `mac` (String)
    *   `wifi_rssi` (Int)
    *   `origem` (String) - Ex: "tseca"
    *   `status` (String) - "on" ou "off"
    *   `type` (String) - "light", "thermostat", "speaker", "other"
    *   `room` (String) - Cômodo onde está
    *   `createdAt` (DateTime)
    *   `updatedAt` (DateTime)
*   **`Log`**: Registra eventos e mensagens dos dispositivos.
    *   `id` (UUID)
    *   `id_dispositivo` (String) - Chave estrangeira para `Dispositivo`
    *   `mensagem` (String)
    *   `timestamp` (DateTime) - Timestamp do evento no dispositivo
    *   `createdAt` (DateTime) - Timestamp de registro no banco

### Validação

*   Utiliza `Zod` para validação de esquemas de entrada nas rotas da API, garantindo a integridade dos dados.

### CORS

*   Configurado para permitir requisições do domínio `https://despesas.seulimacasafacil.com.br` via variável de ambiente `CORS_ORIGIN`.

## Configuração de Ambiente

Crie um arquivo `.env.production` na raiz do projeto com as seguintes variáveis:

```dotenv
DATABASE_URL="postgresql://postgres:TxFEUjXbqEfbaawTVmdE@postgresql:5432/minhagrana?schema=public"
CORS_ORIGIN="https://despesas.seulimacasafacil.com.br"
PORT=3000
