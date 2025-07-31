#!/bin/bash

echo "🚀 Iniciando atualização da aplicação MinhaGrana..."

cd /opt/minha-grana-api || { echo "❌ Diretório não encontrado!"; exit 1; }

echo "🔄 Restaurando alterações locais..."
git reset --hard HEAD

echo "🔄 Atualizando repositório com git pull..."
git pull origin main || { echo "❌ Falha ao executar git pull"; exit 1; }

echo "📦 Recriando imagem Docker minhagrana-api..."
docker build -t minhagrana-api . || { echo "❌ Falha ao buildar imagem"; exit 1; }

echo "🚢 Atualizando stack Docker Swarm..."
docker stack deploy -c docker-stack.yaml api-despesas || { echo "❌ Falha no deploy da stack"; exit 1; }

echo "✅ Aplicação atualizada com sucesso!"
