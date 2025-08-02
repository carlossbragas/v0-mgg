#!/bin/bash

# Script de configuração inicial do projeto MinhaGrana

echo "🚀 Configurando o projeto MinhaGrana..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis conforme necessário."
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover volumes antigos (opcional)
read -p "🗑️  Deseja remover volumes antigos do banco de dados? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down -v
    echo "✅ Volumes removidos."
fi

# Build e iniciar containers
echo "🔨 Fazendo build dos containers..."
docker-compose build

echo "🚀 Iniciando containers..."
docker-compose up -d

# Aguardar o banco de dados ficar pronto
echo "⏳ Aguardando o banco de dados ficar pronto..."
sleep 30

# Executar migrações do Prisma
echo "🗄️  Executando migrações do banco de dados..."
docker-compose exec app npx prisma migrate dev --name init

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
docker-compose exec app npx prisma generate

echo "✅ Configuração concluída!"
echo ""
echo "🌐 Aplicação disponível em: http://localhost:3000"
echo "🗄️  Adminer (gerenciador de BD) disponível em: http://localhost:8080"
echo ""
echo "📋 Comandos úteis:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Parar: docker-compose down"
echo "  - Reiniciar: docker-compose restart"
echo "  - Acessar container: docker-compose exec app sh"
