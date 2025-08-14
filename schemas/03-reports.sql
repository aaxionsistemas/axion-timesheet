-- 📊 SCHEMA GRADATIVO - PARTE 3: REPORTS
-- Execute este script quando quiser migrar a página de Reports
-- Requer: 01-projects-basic.sql e 02-timesheet.sql já executados

-- 1. View para relatório de projetos detalhado
CREATE VIEW detailed_project_report AS
SELECT 
    p.id,
    p.cliente as client,
    COALESCE(p.name, p.cliente) as project_name,
    p.descricao as description,
    p.produto as product,
    p.canal as channel,
    p.consultor as consultant,
    p.status,
    p.priority,
    p.start_date,
    p.end_date,
    p.estimated_hours,
    p.worked_hours,
    p.valor_hora_canal as channel_hourly_rate,
    p.valor_hora_consultor as consultant_hourly_rate,
    
    -- Cálculos financeiros
    p.worked_hours * p.valor_hora_canal as total_revenue,
    p.worked_hours * p.valor_hora_consultor as total_cost,
    (p.worked_hours * p.valor_hora_canal) - (p.worked_hours * p.valor_hora_consultor) as profit,
    
    -- Métricas de progresso
    CASE 
        WHEN p.estimated_hours > 0 THEN ROUND((p.worked_hours / p.estimated_hours * 100), 2)
        ELSE 0 
    END as progress_percentage,
    
    -- Status de risco
    CASE 
        WHEN p.end_date IS NOT NULL AND p.end_date < CURRENT_DATE AND p.status != 'concluido' THEN 'Atrasado'
        WHEN p.worked_hours > p.estimated_hours * 1.2 THEN 'Horas Estouradas'
        WHEN p.worked_hours > p.estimated_hours * 1.1 THEN 'Próximo do Limite'
        ELSE 'Normal'
    END as risk_status,
    
    -- Contadores
    (SELECT COUNT(*) FROM project_time_entries pte WHERE pte.project_id = p.id) as time_entries_count,
    
    p.created_at,
    p.updated_at
FROM projects p;

-- 2. View para relatório mensal consolidado
CREATE VIEW monthly_report AS
SELECT 
    DATE_TRUNC('month', COALESCE(pte.date, p.start_date, p.created_at)) as month,
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT p.cliente) as total_clients,
    COUNT(DISTINCT p.consultor) as total_consultants,
    
    -- Horas
    SUM(p.worked_hours) as total_worked_hours,
    SUM(p.estimated_hours) as total_estimated_hours,
    
    -- Receita
    SUM(p.worked_hours * COALESCE(p.valor_hora_canal, 0)) as total_revenue,
    SUM(p.worked_hours * COALESCE(p.valor_hora_consultor, 0)) as total_costs,
    SUM((p.worked_hours * COALESCE(p.valor_hora_canal, 0)) - (p.worked_hours * COALESCE(p.valor_hora_consultor, 0))) as total_profit,
    
    -- Métricas
    ROUND(AVG(COALESCE(p.valor_hora_canal, 0)), 2) as avg_hourly_rate,
    
    -- Status dos projetos
    COUNT(CASE WHEN p.status = 'concluido' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN p.status = 'em_andamento' THEN 1 END) as active_projects,
    COUNT(CASE WHEN p.status = 'pausado' THEN 1 END) as paused_projects,
    COUNT(CASE WHEN p.status = 'cancelado' THEN 1 END) as cancelled_projects
    
FROM projects p
LEFT JOIN project_time_entries pte ON p.id = pte.project_id
GROUP BY DATE_TRUNC('month', COALESCE(pte.date, p.start_date, p.created_at))
ORDER BY month DESC;

-- 3. View para relatório por consultor
CREATE VIEW consultant_performance_report AS
SELECT 
    p.consultor as consultant_name,
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT p.cliente) as total_clients,
    
    -- Horas
    SUM(p.worked_hours) as total_worked_hours,
    SUM(p.estimated_hours) as total_estimated_hours,
    ROUND(AVG(p.worked_hours), 2) as avg_hours_per_project,
    
    -- Performance
    ROUND(
        CASE 
            WHEN SUM(p.estimated_hours) > 0 THEN (SUM(p.worked_hours) / SUM(p.estimated_hours) * 100)
            ELSE 0 
        END, 2
    ) as efficiency_percentage,
    
    -- Financeiro
    SUM(p.worked_hours * COALESCE(p.valor_hora_consultor, 0)) as total_earnings,
    ROUND(AVG(COALESCE(p.valor_hora_consultor, 0)), 2) as avg_hourly_rate,
    
    -- Status dos projetos
    COUNT(CASE WHEN p.status = 'concluido' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN p.status = 'em_andamento' THEN 1 END) as active_projects,
    
    -- Última atividade
    MAX(p.updated_at) as last_activity,
    
    -- Registros de tempo
    (SELECT COUNT(*) FROM project_time_entries pte WHERE pte.consultant_name = p.consultor) as time_entries_count
    
FROM projects p
WHERE p.consultor IS NOT NULL
GROUP BY p.consultor
ORDER BY total_worked_hours DESC;

-- 4. View para relatório por cliente
CREATE VIEW client_report AS
SELECT 
    p.cliente as client_name,
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT p.consultor) as consultants_involved,
    
    -- Horas e progresso
    SUM(p.worked_hours) as total_worked_hours,
    SUM(p.estimated_hours) as total_estimated_hours,
    
    -- Financeiro
    SUM(p.worked_hours * COALESCE(p.valor_hora_canal, 0)) as total_billed,
    ROUND(AVG(COALESCE(p.valor_hora_canal, 0)), 2) as avg_hourly_rate,
    
    -- Status dos projetos
    COUNT(CASE WHEN p.status = 'concluido' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN p.status = 'em_andamento' THEN 1 END) as active_projects,
    COUNT(CASE WHEN p.status = 'pausado' THEN 1 END) as paused_projects,
    
    -- Datas
    MIN(p.start_date) as first_project_date,
    MAX(COALESCE(p.end_date, p.updated_at::date)) as last_activity_date,
    
    -- Canais utilizados
    STRING_AGG(DISTINCT p.canal, ', ') as channels_used,
    STRING_AGG(DISTINCT p.produto, ', ') as products_used
    
FROM projects p
GROUP BY p.cliente
ORDER BY total_billed DESC;

-- 5. View para relatório de produtividade semanal
CREATE VIEW weekly_productivity_report AS
SELECT 
    DATE_TRUNC('week', pte.date) as week_start,
    pte.consultant_name,
    
    -- Horas trabalhadas
    SUM(pte.hours) as total_hours,
    SUM(CASE WHEN pte.billable THEN pte.hours ELSE 0 END) as billable_hours,
    SUM(CASE WHEN NOT pte.billable THEN pte.hours ELSE 0 END) as non_billable_hours,
    
    -- Distribuição por tipo de trabalho
    SUM(CASE WHEN pte.work_type = 'Desenvolvimento' THEN pte.hours ELSE 0 END) as development_hours,
    SUM(CASE WHEN pte.work_type = 'Reunião' THEN pte.hours ELSE 0 END) as meeting_hours,
    SUM(CASE WHEN pte.work_type = 'Documentação' THEN pte.hours ELSE 0 END) as documentation_hours,
    
    -- Métricas
    ROUND((SUM(CASE WHEN pte.billable THEN pte.hours ELSE 0 END) / SUM(pte.hours) * 100), 2) as billability_percentage,
    COUNT(DISTINCT pte.project_id) as projects_worked_on,
    COUNT(*) as total_entries,
    
    -- Receita
    SUM(pte.hours * COALESCE(pte.hourly_rate, 0)) as total_revenue
    
FROM project_time_entries pte
GROUP BY DATE_TRUNC('week', pte.date), pte.consultant_name
ORDER BY week_start DESC, total_hours DESC;

-- 6. Função para gerar relatório personalizado por período
CREATE OR REPLACE FUNCTION generate_period_report(
    start_date DATE,
    end_date DATE,
    consultant_filter VARCHAR DEFAULT NULL,
    client_filter VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    project_id UUID,
    client_name VARCHAR,
    project_name VARCHAR,
    consultant_name VARCHAR,
    total_hours DECIMAL,
    total_revenue DECIMAL,
    entries_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.cliente,
        COALESCE(p.name, p.cliente)::VARCHAR,
        p.consultor,
        COALESCE(SUM(pte.hours), 0)::DECIMAL,
        COALESCE(SUM(pte.hours * COALESCE(pte.hourly_rate, p.valor_hora_consultor, 0)), 0)::DECIMAL,
        COUNT(pte.id)
    FROM projects p
    LEFT JOIN project_time_entries pte ON p.id = pte.project_id 
        AND pte.date BETWEEN start_date AND end_date
    WHERE 
        (consultant_filter IS NULL OR p.consultor = consultant_filter)
        AND (client_filter IS NULL OR p.cliente = client_filter)
    GROUP BY p.id, p.cliente, p.name, p.consultor
    ORDER BY COALESCE(SUM(pte.hours), 0) DESC;
END;
$$ LANGUAGE plpgsql;

-- ✅ SCHEMA PARTE 3 CONCLUÍDO!
-- Suporta: Página de Reports com relatórios avançados
-- Próximo: Execute 04-financial.sql quando quiser migrar a página Financial


