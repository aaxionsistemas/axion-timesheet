-- Schema completo para o Axion Timesheet no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tipos enum
CREATE TYPE project_status AS ENUM ('planejamento', 'em_andamento', 'pausado', 'aguardando_cliente', 'concluido', 'cancelado');
CREATE TYPE project_priority AS ENUM ('baixa', 'media', 'alta', 'urgente');
CREATE TYPE milestone_status AS ENUM ('pendente', 'em_andamento', 'concluido', 'atrasado');

-- 2. Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Tabela de projetos
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    client VARCHAR(255) NOT NULL,
    client_contact VARCHAR(255),
    client_email VARCHAR(255),
    client_phone VARCHAR(20),
    hourly_rate DECIMAL(10, 2) NOT NULL CHECK (hourly_rate >= 0),
    estimated_hours DECIMAL(8, 2) NOT NULL CHECK (estimated_hours >= 0),
    worked_hours DECIMAL(8, 2) DEFAULT 0 CHECK (worked_hours >= 0),
    status project_status NOT NULL DEFAULT 'planejamento',
    priority project_priority NOT NULL DEFAULT 'media',
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(12, 2) CHECK (budget >= 0),
    notes TEXT,
    tags TEXT[], -- Array de strings para tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Campos específicos do projeto atual
    canal VARCHAR(100),
    cliente VARCHAR(255) NOT NULL, -- Mantendo compatibilidade
    descricao TEXT,
    produto VARCHAR(255),
    valor_hora_canal DECIMAL(10, 2),
    valor_hora_consultor DECIMAL(10, 2),
    consultor VARCHAR(255),
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT valid_budget CHECK (budget IS NULL OR budget >= (estimated_hours * COALESCE(hourly_rate, valor_hora_canal, 0) * 0.5))
);

-- 4. Tabela de membros da equipe
CREATE TABLE project_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(100) NOT NULL,
    hourly_rate DECIMAL(10, 2),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(project_id, user_id)
);

-- 5. Tabela de registros de tempo
CREATE TABLE project_time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    description TEXT NOT NULL,
    hours DECIMAL(5, 2) NOT NULL CHECK (hours > 0 AND hours <= 24),
    date DATE NOT NULL,
    billable BOOLEAN DEFAULT true,
    hourly_rate DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela de marcos do projeto
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    completed_date DATE,
    status milestone_status DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_completion_date CHECK (completed_date IS NULL OR due_date IS NULL OR completed_date >= due_date - INTERVAL '30 days')
);

-- 7. Tabela de documentos/anexos
CREATE TABLE project_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_url VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_by UUID NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Índices para otimização
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_priority ON projects(priority);
CREATE INDEX idx_projects_client ON projects(client);
CREATE INDEX idx_projects_cliente ON projects(cliente);
CREATE INDEX idx_projects_start_date ON projects(start_date);
CREATE INDEX idx_projects_end_date ON projects(end_date);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);

CREATE INDEX idx_project_team_project_id ON project_team_members(project_id);
CREATE INDEX idx_project_team_user_id ON project_team_members(user_id);

CREATE INDEX idx_time_entries_project_id ON project_time_entries(project_id);
CREATE INDEX idx_time_entries_user_id ON project_time_entries(user_id);
CREATE INDEX idx_time_entries_date ON project_time_entries(date);
CREATE INDEX idx_time_entries_billable ON project_time_entries(billable);

CREATE INDEX idx_milestones_project_id ON project_milestones(project_id);
CREATE INDEX idx_milestones_due_date ON project_milestones(due_date);
CREATE INDEX idx_milestones_status ON project_milestones(status);

CREATE INDEX idx_documents_project_id ON project_documents(project_id);
CREATE INDEX idx_documents_uploaded_by ON project_documents(uploaded_by);

-- 9. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Triggers para atualizar updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON project_time_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Views úteis
CREATE VIEW project_stats AS
SELECT 
    p.id,
    COALESCE(p.name, p.cliente) as name,
    p.client,
    p.cliente,
    p.status,
    p.priority,
    p.estimated_hours,
    p.worked_hours,
    COALESCE(p.hourly_rate, p.valor_hora_canal, 0) as hourly_rate,
    COALESCE(p.worked_hours * COALESCE(p.hourly_rate, p.valor_hora_canal, 0), 0) as revenue,
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
    END as is_ending_soon,
    (SELECT COUNT(*) FROM project_team_members ptm WHERE ptm.project_id = p.id) as team_size,
    (SELECT COUNT(*) FROM project_time_entries pte WHERE pte.project_id = p.id) as time_entries_count
FROM projects p;

-- 12. Inserir dados de exemplo (compatíveis com o formato atual)
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

-- 13. RLS (Row Level Security) - Opcional
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE project_time_entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;

-- Políticas de exemplo (descomente se necessário):
-- CREATE POLICY "Users can view projects they are members of" ON projects FOR SELECT USING (true);
-- CREATE POLICY "Users can insert projects" ON projects FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Users can update projects" ON projects FOR UPDATE USING (true);
-- CREATE POLICY "Users can delete projects" ON projects FOR DELETE USING (true);

