# Estrutura do Banco de Dados - Sistema de Projetos

## Visão Geral

Este documento descreve a estrutura completa do banco de dados para o sistema de gestão de projetos do Axion Timesheet. O sistema utiliza **PostgreSQL** como banco de dados principal.

## Tabelas

### 1. projects (Projetos)

Tabela principal que armazena informações dos projetos.

```sql
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
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT valid_budget CHECK (budget IS NULL OR budget >= (estimated_hours * hourly_rate * 0.5))
);

-- Índices para otimização
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_priority ON projects(priority);
CREATE INDEX idx_projects_client ON projects(client);
CREATE INDEX idx_projects_start_date ON projects(start_date);
CREATE INDEX idx_projects_end_date ON projects(end_date);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
```

### 2. project_team_members (Membros da Equipe)

Tabela para relacionar usuários com projetos e seus papéis.

```sql
CREATE TABLE project_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- Referência para tabela de usuários (será criada posteriormente)
    role VARCHAR(100) NOT NULL, -- Ex: "Desenvolvedor", "Gerente de Projeto", "Designer"
    hourly_rate DECIMAL(10, 2), -- Taxa específica deste membro para este projeto
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Evitar duplicatas
    UNIQUE(project_id, user_id)
);

-- Índices
CREATE INDEX idx_project_team_project_id ON project_team_members(project_id);
CREATE INDEX idx_project_team_user_id ON project_team_members(user_id);
```

### 3. project_time_entries (Registros de Tempo)

Tabela para registrar as horas trabalhadas em cada projeto.

```sql
CREATE TABLE project_time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- Referência para tabela de usuários
    description TEXT NOT NULL,
    hours DECIMAL(5, 2) NOT NULL CHECK (hours > 0 AND hours <= 24),
    date DATE NOT NULL,
    billable BOOLEAN DEFAULT true, -- Se as horas são faturáveis
    hourly_rate DECIMAL(10, 2), -- Taxa usada para este registro específico
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_time_entries_project_id ON project_time_entries(project_id);
CREATE INDEX idx_time_entries_user_id ON project_time_entries(user_id);
CREATE INDEX idx_time_entries_date ON project_time_entries(date);
CREATE INDEX idx_time_entries_billable ON project_time_entries(billable);
```

### 4. project_milestones (Marcos do Projeto)

Tabela opcional para marcos importantes do projeto.

```sql
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

-- Índices
CREATE INDEX idx_milestones_project_id ON project_milestones(project_id);
CREATE INDEX idx_milestones_due_date ON project_milestones(due_date);
CREATE INDEX idx_milestones_status ON project_milestones(status);
```

### 5. project_documents (Documentos do Projeto)

Tabela para armazenar referências a documentos relacionados aos projetos.

```sql
CREATE TABLE project_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500), -- Caminho para o arquivo
    file_url VARCHAR(500), -- URL do arquivo (se hospedado externamente)
    file_size BIGINT, -- Tamanho do arquivo em bytes
    mime_type VARCHAR(100),
    uploaded_by UUID NOT NULL, -- Referência para usuário
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_documents_project_id ON project_documents(project_id);
CREATE INDEX idx_documents_uploaded_by ON project_documents(uploaded_by);
```

## Enums (Tipos Customizados)

### project_status (Status do Projeto)

```sql
CREATE TYPE project_status AS ENUM (
    'planejamento',
    'em_andamento',
    'pausado',
    'aguardando_cliente',
    'concluido',
    'cancelado'
);
```

### project_priority (Prioridade do Projeto)

```sql
CREATE TYPE project_priority AS ENUM (
    'baixa',
    'media',
    'alta',
    'urgente'
);
```

### milestone_status (Status do Marco)

```sql
CREATE TYPE milestone_status AS ENUM (
    'pendente',
    'em_andamento',
    'concluido',
    'atrasado'
);
```

## Triggers e Funções

### 1. Trigger para atualizar worked_hours automaticamente

```sql
-- Função para recalcular horas trabalhadas
CREATE OR REPLACE FUNCTION update_project_worked_hours()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects 
    SET 
        worked_hours = (
            SELECT COALESCE(SUM(hours), 0) 
            FROM project_time_entries 
            WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para INSERT, UPDATE e DELETE
CREATE TRIGGER trigger_update_worked_hours
    AFTER INSERT OR UPDATE OR DELETE ON project_time_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_project_worked_hours();
```

### 2. Trigger para atualizar updated_at automaticamente

```sql
-- Função genérica para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas relevantes
CREATE TRIGGER trigger_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_time_entries_updated_at
    BEFORE UPDATE ON project_time_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Views Úteis

### 1. View de estatísticas do projeto

```sql
CREATE VIEW project_stats AS
SELECT 
    p.id,
    p.name,
    p.client,
    p.status,
    p.priority,
    p.estimated_hours,
    p.worked_hours,
    p.hourly_rate,
    COALESCE(p.worked_hours * p.hourly_rate, 0) as revenue,
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
```

### 2. View de relatório mensal

```sql
CREATE VIEW monthly_project_report AS
SELECT 
    DATE_TRUNC('month', pte.date) as month,
    p.id as project_id,
    p.name as project_name,
    p.client,
    SUM(pte.hours) as total_hours,
    SUM(pte.hours * COALESCE(pte.hourly_rate, p.hourly_rate)) as total_revenue,
    COUNT(DISTINCT pte.user_id) as unique_contributors
FROM projects p
JOIN project_time_entries pte ON p.id = pte.project_id
GROUP BY DATE_TRUNC('month', pte.date), p.id, p.name, p.client
ORDER BY month DESC, total_revenue DESC;
```

## Scripts de Migração

### Script completo de criação

```sql
-- 1. Criar tipos enum
CREATE TYPE project_status AS ENUM ('planejamento', 'em_andamento', 'pausado', 'aguardando_cliente', 'concluido', 'cancelado');
CREATE TYPE project_priority AS ENUM ('baixa', 'media', 'alta', 'urgente');
CREATE TYPE milestone_status AS ENUM ('pendente', 'em_andamento', 'concluido', 'atrasado');

-- 2. Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Criar tabelas na ordem correta
-- (Executar os CREATE TABLE commands na ordem listada acima)

-- 4. Criar funções e triggers
-- (Executar os códigos de função e trigger listados acima)

-- 5. Criar views
-- (Executar os CREATE VIEW commands listados acima)

-- 6. Inserir dados iniciais se necessário
INSERT INTO projects (name, client, hourly_rate, estimated_hours, status, priority, start_date) 
VALUES ('Projeto de Exemplo', 'Cliente Teste', 150.00, 40, 'planejamento', 'media', CURRENT_DATE);
```

Esta estrutura fornece uma base sólida e escalável para o sistema de gestão de projetos, com todas as funcionalidades necessárias para controle de tempo, custos, equipes e relatórios.