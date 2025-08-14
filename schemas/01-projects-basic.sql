-- 🚀 SCHEMA GRADATIVO - PARTE 1: PROJETOS BÁSICOS
-- Execute este script primeiro no SQL Editor do Supabase
-- Este schema suporta: Dashboard e Página de Projetos

-- 1. Criar tipos enum básicos
CREATE TYPE project_status AS ENUM (
    'planejamento',
    'em_andamento', 
    'pausado',
    'aguardando_cliente',
    'concluido',
    'cancelado'
);

CREATE TYPE project_priority AS ENUM (
    'baixa',
    'media', 
    'alta',
    'urgente'
);

-- 2. Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Tabela principal de projetos
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Informações básicas
    name VARCHAR(255),
    description TEXT,
    cliente VARCHAR(255) NOT NULL, -- Nome do cliente
    descricao TEXT, -- Descrição do projeto
    
    -- Informações do canal/produto
    canal VARCHAR(100), -- 'Direto', 'Parceiro', etc.
    produto VARCHAR(255), -- Nome do produto/serviço
    
    -- Valores e horas
    valor_hora_canal DECIMAL(10, 2), -- Valor cobrado do cliente
    valor_hora_consultor DECIMAL(10, 2), -- Valor pago ao consultor
    estimated_hours DECIMAL(8, 2) DEFAULT 0 CHECK (estimated_hours >= 0),
    worked_hours DECIMAL(8, 2) DEFAULT 0 CHECK (worked_hours >= 0),
    
    -- Status e prioridade
    status project_status NOT NULL DEFAULT 'planejamento',
    priority project_priority DEFAULT 'media',
    
    -- Datas
    start_date DATE,
    end_date DATE,
    
    -- Informações adicionais
    consultor VARCHAR(255), -- Nome do consultor responsável
    notes TEXT,
    budget DECIMAL(12, 2) CHECK (budget >= 0),
    tags TEXT[], -- Array de strings para tags
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
    CONSTRAINT valid_budget CHECK (budget IS NULL OR estimated_hours IS NULL OR valor_hora_canal IS NULL OR budget >= (estimated_hours * valor_hora_canal * 0.5))
);

-- 4. Índices para performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_priority ON projects(priority);
CREATE INDEX idx_projects_cliente ON projects(cliente);
CREATE INDEX idx_projects_consultor ON projects(consultor);
CREATE INDEX idx_projects_start_date ON projects(start_date);
CREATE INDEX idx_projects_end_date ON projects(end_date);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);

-- 5. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Trigger para atualizar updated_at
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. View básica para estatísticas de projetos
CREATE VIEW project_stats AS
SELECT 
    p.id,
    COALESCE(p.name, p.cliente) as name,
    p.cliente,
    p.status,
    p.priority,
    p.estimated_hours,
    p.worked_hours,
    COALESCE(p.valor_hora_canal, 0) as hourly_rate,
    COALESCE(p.worked_hours * p.valor_hora_canal, 0) as revenue,
    COALESCE(p.budget, 0) as budget,
    CASE 
        WHEN p.estimated_hours > 0 THEN (p.worked_hours / p.estimated_hours * 100)
        ELSE 0 
    END as progress_percentage,
    CASE 
        WHEN p.end_date IS NOT NULL AND p.end_date < CURRENT_DATE AND p.status != 'concluido' THEN true
        WHEN p.worked_hours > p.estimated_hours * 1.1 THEN true
        ELSE false
    END as is_at_risk,
    CASE 
        WHEN p.end_date IS NOT NULL AND p.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' AND p.status != 'concluido' THEN true
        ELSE false
    END as is_ending_soon
FROM projects p;

-- 8. Inserir dados de exemplo para testar
INSERT INTO projects (
    cliente, descricao, status, produto, valor_hora_canal, valor_hora_consultor, 
    consultor, estimated_hours, worked_hours, start_date, end_date, notes, canal
) VALUES 
(
    'Tech Solutions Ltda', 
    'Implantação de sistema ERP completo para gestão empresarial',
    'em_andamento',
    'ERP Enterprise',
    200.00,
    150.00,
    'João Silva',
    120,
    85,
    '2024-01-15',
    '2024-03-15',
    'Cliente muito exigente, atenção aos detalhes',
    'Direto'
),
(
    'FinanCorp',
    'Desenvolvimento de API para integração com bancos',
    'aguardando_cliente',
    'API Banking',
    220.00,
    180.00,
    'Maria Santos',
    80,
    75,
    '2024-02-01',
    '2024-02-28',
    NULL,
    'Parceiro'
),
(
    'DataX Analytics',
    'Painel de controle com relatórios e gráficos',
    'concluido',
    'Dashboard BI',
    180.00,
    140.00,
    'Pedro Costa',
    60,
    60,
    '2024-01-01',
    '2024-01-31',
    NULL,
    'Direto'
);

-- ✅ SCHEMA PARTE 1 CONCLUÍDO!
-- Suporta: Dashboard e Página de Projetos
-- Próximo: Execute 02-timesheet.sql quando quiser migrar a página de Timesheet


