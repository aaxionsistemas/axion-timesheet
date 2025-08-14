-- Script para migrar tabela de clientes existente
-- Remove a obrigatoriedade do campo 'name' e torna 'company' obrigatório

-- Primeiro, atualizar registros existentes onde name está vazio
UPDATE clients 
SET name = company 
WHERE name IS NULL OR name = '';

-- Alterar a estrutura da tabela
ALTER TABLE clients 
ALTER COLUMN name DROP NOT NULL;

ALTER TABLE clients 
ALTER COLUMN company SET NOT NULL;

-- Atualizar índices se necessário
DROP INDEX IF EXISTS idx_clients_name;
CREATE INDEX idx_clients_company_name ON clients(company, name);

-- Comentário para documentar a mudança
COMMENT ON COLUMN clients.name IS 'Nome do cliente - preenchido automaticamente com o nome da empresa';
COMMENT ON COLUMN clients.company IS 'Nome da empresa - campo obrigatório';


