-- 🕒 SCHEMA GRADATIVO - PARTE 2: TIMESHEET
-- Execute este script quando quiser migrar a página de Timesheet
-- Requer: 01-projects-basic.sql já executado

-- 1. Tabela de registros de tempo
CREATE TABLE project_time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Informações do registro
    user_id UUID, -- Futuramente será referência para auth.users
    consultant_name VARCHAR(255), -- Por enquanto, nome do consultor
    description TEXT NOT NULL,
    
    -- Tempo e data
    hours DECIMAL(5, 2) NOT NULL CHECK (hours > 0 AND hours <= 24),
    date DATE NOT NULL,
    
    -- Informações de faturamento
    billable BOOLEAN DEFAULT true, -- Se as horas são faturáveis
    hourly_rate DECIMAL(10, 2), -- Taxa usada para este registro específico
    
    -- Categoria/tipo de trabalho
    work_type VARCHAR(100), -- 'Desenvolvimento', 'Reunião', 'Documentação', etc.
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Índices para performance
CREATE INDEX idx_time_entries_project_id ON project_time_entries(project_id);
CREATE INDEX idx_time_entries_consultant ON project_time_entries(consultant_name);
CREATE INDEX idx_time_entries_date ON project_time_entries(date);
CREATE INDEX idx_time_entries_billable ON project_time_entries(billable);
CREATE INDEX idx_time_entries_work_type ON project_time_entries(work_type);

-- 3. Trigger para atualizar updated_at
CREATE TRIGGER update_time_entries_updated_at 
    BEFORE UPDATE ON project_time_entries
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Função para atualizar horas trabalhadas no projeto automaticamente
CREATE OR REPLACE FUNCTION update_project_worked_hours()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar worked_hours do projeto baseado na soma dos registros de tempo
    UPDATE projects 
    SET worked_hours = (
        SELECT COALESCE(SUM(hours), 0) 
        FROM project_time_entries 
        WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
    )
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- 5. Triggers para manter worked_hours sincronizado
CREATE TRIGGER sync_project_hours_insert
    AFTER INSERT ON project_time_entries
    FOR EACH ROW 
    EXECUTE FUNCTION update_project_worked_hours();

CREATE TRIGGER sync_project_hours_update
    AFTER UPDATE ON project_time_entries
    FOR EACH ROW 
    EXECUTE FUNCTION update_project_worked_hours();

CREATE TRIGGER sync_project_hours_delete
    AFTER DELETE ON project_time_entries
    FOR EACH ROW 
    EXECUTE FUNCTION update_project_worked_hours();

-- 6. View para relatórios de timesheet
CREATE VIEW timesheet_summary AS
SELECT 
    pte.id,
    pte.project_id,
    p.cliente as client,
    COALESCE(p.name, p.cliente) as project_name,
    pte.consultant_name,
    pte.description,
    pte.hours,
    pte.date,
    pte.billable,
    COALESCE(pte.hourly_rate, p.valor_hora_consultor, 0) as effective_rate,
    COALESCE(pte.hourly_rate, p.valor_hora_consultor, 0) * pte.hours as entry_value,
    pte.work_type,
    pte.created_at
FROM project_time_entries pte
JOIN projects p ON pte.project_id = p.id
ORDER BY pte.date DESC, pte.created_at DESC;

-- 7. View para resumo mensal por consultor
CREATE VIEW monthly_consultant_hours AS
SELECT 
    DATE_TRUNC('month', pte.date) as month,
    pte.consultant_name,
    COUNT(*) as entries_count,
    SUM(pte.hours) as total_hours,
    SUM(CASE WHEN pte.billable THEN pte.hours ELSE 0 END) as billable_hours,
    SUM(pte.hours * COALESCE(pte.hourly_rate, p.valor_hora_consultor, 0)) as total_revenue,
    AVG(COALESCE(pte.hourly_rate, p.valor_hora_consultor, 0)) as avg_hourly_rate
FROM project_time_entries pte
JOIN projects p ON pte.project_id = p.id
GROUP BY DATE_TRUNC('month', pte.date), pte.consultant_name
ORDER BY month DESC, total_hours DESC;

-- 8. Inserir dados de exemplo para testar
INSERT INTO project_time_entries (
    project_id, 
    consultant_name, 
    description, 
    hours, 
    date, 
    billable, 
    work_type
) 
SELECT 
    p.id,
    p.consultor,
    'Desenvolvimento de funcionalidades básicas',
    8.0,
    CURRENT_DATE - INTERVAL '1 day',
    true,
    'Desenvolvimento'
FROM projects p 
WHERE p.consultor = 'João Silva'
LIMIT 1;

INSERT INTO project_time_entries (
    project_id, 
    consultant_name, 
    description, 
    hours, 
    date, 
    billable, 
    work_type
) 
SELECT 
    p.id,
    p.consultor,
    'Reunião de alinhamento com cliente',
    2.0,
    CURRENT_DATE,
    true,
    'Reunião'
FROM projects p 
WHERE p.consultor = 'Maria Santos'
LIMIT 1;

-- ✅ SCHEMA PARTE 2 CONCLUÍDO!
-- Suporta: Página de Timesheet com registros de tempo
-- Próximo: Execute 03-reports.sql quando quiser migrar a página de Reports


