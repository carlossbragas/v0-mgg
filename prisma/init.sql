-- Script de inicialização do banco de dados
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurações de timezone
SET timezone = 'America/Sao_Paulo';

-- Criar índices adicionais se necessário
-- (Os índices principais são criados pelo Prisma)

-- Inserir dados iniciais se necessário
-- INSERT INTO "User" (id, email, name) VALUES ('admin', 'admin@minhagrana.com', 'Administrador');
