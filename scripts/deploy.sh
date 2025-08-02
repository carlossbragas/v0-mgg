#!/bin/bash

# Script de deploy para produção

echo "🚀 Iniciando deploy de produção..."

# Verificar se as variáveis de ambiente estão configuradas
if [ ! -f .env.production ]; then
    echo "❌ Arquivo .env.production não encontrado!"
    echo "📝 Crie o arquivo .env.production com as configurações de produção."
    exit 1
fi

# Fazer backup do banco de dados atual (se existir)
echo "💾 Fazendo backup do banco de dados..."
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres minhagrana > backup_$(date +%Y%m%d_%H%M%S).sql

# Parar containers de produção
echo "🛑 Parando containers de produção..."
docker-compose -f docker-compose.prod.yml down

# Build da nova versão
echo "🔨 Fazendo build da nova versão..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar containers de produção
echo "🚀 Iniciando containers de produção..."
docker-compose -f docker-compose.prod.yml up -d

# Aguardar o banco de dados ficar pronto
echo "⏳ Aguardando o banco de dados ficar pronto..."
sleep 30

# Executar migrações
echo "🗄️  Executando migrações..."
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

echo "✅ Deploy concluído!"
echo "🌐 Aplicação disponível em produção"
