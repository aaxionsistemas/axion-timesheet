-- 💰 SCHEMA GRADATIVO - PARTE 4: FINANCIAL
-- Execute este script quando quiser migrar a página Financial
-- Requer: 01-projects-basic.sql, 02-timesheet.sql e 03-reports.sql já executados

-- 1. Tabela de pagamentos/recebimentos
CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Tipo de transação
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('receita', 'custo', 'pagamento_consultor')),
    
    -- Informações da transação
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    
    -- Datas
    due_date DATE,
    paid_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')),
    
    -- Informações adicionais
    consultant_name VARCHAR(255), -- Para pagamentos de consultores
    client_name VARCHAR(255), -- Para recebimentos de clientes
    payment_method VARCHAR(100), -- 'Transferência', 'PIX', 'Boleto', etc.
    reference_month DATE, -- Mês de referência para pagamentos mensais
    
    -- Observações
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Índices para performance
CREATE INDEX idx_financial_transactions_project_id ON financial_transactions(project_id);
CREATE INDEX idx_financial_transactions_type ON financial_transactions(transaction_type);
CREATE INDEX idx_financial_transactions_status ON financial_transactions(status);
CREATE INDEX idx_financial_transactions_due_date ON financial_transactions(due_date);
CREATE INDEX idx_financial_transactions_paid_date ON financial_transactions(paid_date);
CREATE INDEX idx_financial_transactions_consultant ON financial_transactions(consultant_name);
CREATE INDEX idx_financial_transactions_client ON financial_transactions(client_name);

-- 3. Trigger para atualizar updated_at
CREATE TRIGGER update_financial_transactions_updated_at 
    BEFORE UPDATE ON financial_transactions
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. View para resumo financeiro por projeto
CREATE VIEW project_financial_summary AS
SELECT 
    p.id as project_id,
    p.cliente as client,
    COALESCE(p.name, p.cliente) as project_name,
    p.consultor as consultant,
    p.status as project_status,
    
    -- Receitas
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'receita' THEN ft.amount END), 0) as total_revenue,
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'receita' AND ft.status = 'pago' THEN ft.amount END), 0) as received_revenue,
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'receita' AND ft.status = 'pendente' THEN ft.amount END), 0) as pending_revenue,
    
    -- Custos
    COALESCE(SUM(CASE WHEN ft.transaction_type IN ('custo', 'pagamento_consultor') THEN ft.amount END), 0) as total_costs,
    COALESCE(SUM(CASE WHEN ft.transaction_type IN ('custo', 'pagamento_consultor') AND ft.status = 'pago' THEN ft.amount END), 0) as paid_costs,
    COALESCE(SUM(CASE WHEN ft.transaction_type IN ('custo', 'pagamento_consultor') AND ft.status = 'pendente' THEN ft.amount END), 0) as pending_costs,
    
    -- Lucro
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'receita' THEN ft.amount ELSE -ft.amount END), 0) as net_profit,
    
    -- Baseado nas horas trabalhadas (backup se não houver transações)
    p.worked_hours * COALESCE(p.valor_hora_canal, 0) as estimated_revenue,
    p.worked_hours * COALESCE(p.valor_hora_consultor, 0) as estimated_costs,
    (p.worked_hours * COALESCE(p.valor_hora_canal, 0)) - (p.worked_hours * COALESCE(p.valor_hora_consultor, 0)) as estimated_profit
    
FROM projects p
LEFT JOIN financial_transactions ft ON p.id = ft.project_id
GROUP BY p.id, p.cliente, p.name, p.consultor, p.status, p.worked_hours, p.valor_hora_canal, p.valor_hora_consultor;

-- 5. View para fluxo de caixa mensal
CREATE VIEW monthly_cash_flow AS
SELECT 
    DATE_TRUNC('month', COALESCE(ft.paid_date, ft.due_date)) as month,
    
    -- Entradas (receitas pagas)
    SUM(CASE WHEN ft.transaction_type = 'receita' AND ft.status = 'pago' THEN ft.amount ELSE 0 END) as cash_in,
    
    -- Saídas (custos pagos)
    SUM(CASE WHEN ft.transaction_type IN ('custo', 'pagamento_consultor') AND ft.status = 'pago' THEN ft.amount ELSE 0 END) as cash_out,
    
    -- Saldo
    SUM(CASE WHEN ft.transaction_type = 'receita' AND ft.status = 'pago' THEN ft.amount 
             WHEN ft.transaction_type IN ('custo', 'pagamento_consultor') AND ft.status = 'pago' THEN -ft.amount 
             ELSE 0 END) as net_cash_flow,
    
    -- Previsões (pendentes)
    SUM(CASE WHEN ft.transaction_type = 'receita' AND ft.status = 'pendente' THEN ft.amount ELSE 0 END) as expected_income,
    SUM(CASE WHEN ft.transaction_type IN ('custo', 'pagamento_consultor') AND ft.status = 'pendente' THEN ft.amount ELSE 0 END) as expected_expenses
    
FROM financial_transactions ft
GROUP BY DATE_TRUNC('month', COALESCE(ft.paid_date, ft.due_date))
ORDER BY month DESC;

-- 6. View para pagamentos em atraso
CREATE VIEW overdue_payments AS
SELECT 
    ft.id,
    ft.project_id,
    p.cliente as client,
    COALESCE(p.name, p.cliente) as project_name,
    ft.transaction_type,
    ft.description,
    ft.amount,
    ft.due_date,
    CURRENT_DATE - ft.due_date as days_overdue,
    ft.consultant_name,
    ft.client_name,
    ft.notes
FROM financial_transactions ft
LEFT JOIN projects p ON ft.project_id = p.id
WHERE ft.status IN ('pendente', 'atrasado') 
    AND ft.due_date < CURRENT_DATE
ORDER BY ft.due_date ASC;

-- 7. View para próximos pagamentos (próximos 30 dias)
CREATE VIEW upcoming_payments AS
SELECT 
    ft.id,
    ft.project_id,
    p.cliente as client,
    COALESCE(p.name, p.cliente) as project_name,
    ft.transaction_type,
    ft.description,
    ft.amount,
    ft.due_date,
    ft.due_date - CURRENT_DATE as days_until_due,
    ft.consultant_name,
    ft.client_name,
    ft.status
FROM financial_transactions ft
LEFT JOIN projects p ON ft.project_id = p.id
WHERE ft.status = 'pendente' 
    AND ft.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
ORDER BY ft.due_date ASC;

-- 8. View para resumo financeiro por consultor
CREATE VIEW consultant_financial_summary AS
SELECT 
    p.consultor as consultant_name,
    
    -- Totais baseados em projetos
    COUNT(DISTINCT p.id) as total_projects,
    SUM(p.worked_hours) as total_hours,
    SUM(p.worked_hours * COALESCE(p.valor_hora_consultor, 0)) as total_earnings_estimate,
    
    -- Pagamentos reais
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'pagamento_consultor' AND ft.status = 'pago' THEN ft.amount END), 0) as paid_amount,
    COALESCE(SUM(CASE WHEN ft.transaction_type = 'pagamento_consultor' AND ft.status = 'pendente' THEN ft.amount END), 0) as pending_amount,
    
    -- Próximo pagamento
    MIN(CASE WHEN ft.transaction_type = 'pagamento_consultor' AND ft.status = 'pendente' THEN ft.due_date END) as next_payment_date,
    
    -- Última atividade
    MAX(p.updated_at) as last_activity
    
FROM projects p
LEFT JOIN financial_transactions ft ON p.id = ft.project_id AND ft.consultant_name = p.consultor
WHERE p.consultor IS NOT NULL
GROUP BY p.consultor
ORDER BY total_earnings_estimate DESC;

-- 9. Função para gerar pagamentos automáticos baseados nas horas trabalhadas
CREATE OR REPLACE FUNCTION generate_consultant_payments(
    reference_month DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)
)
RETURNS INTEGER AS $$
DECLARE
    consultant_record RECORD;
    payment_count INTEGER := 0;
BEGIN
    -- Para cada consultor com horas no mês
    FOR consultant_record IN
        SELECT 
            p.consultor,
            SUM(pte.hours) as total_hours,
            AVG(COALESCE(p.valor_hora_consultor, 0)) as avg_rate
        FROM projects p
        JOIN project_time_entries pte ON p.id = pte.project_id
        WHERE DATE_TRUNC('month', pte.date) = reference_month
            AND p.consultor IS NOT NULL
        GROUP BY p.consultor
    LOOP
        -- Inserir pagamento se não existir
        INSERT INTO financial_transactions (
            transaction_type,
            description,
            amount,
            due_date,
            status,
            consultant_name,
            reference_month
        )
        SELECT 
            'pagamento_consultor',
            'Pagamento referente a ' || TO_CHAR(reference_month, 'MM/YYYY'),
            consultant_record.total_hours * consultant_record.avg_rate,
            reference_month + INTERVAL '1 month' + INTERVAL '10 days', -- Dia 10 do mês seguinte
            'pendente',
            consultant_record.consultor,
            reference_month
        WHERE NOT EXISTS (
            SELECT 1 FROM financial_transactions 
            WHERE transaction_type = 'pagamento_consultor' 
                AND consultant_name = consultant_record.consultor 
                AND reference_month = reference_month
        );
        
        payment_count := payment_count + 1;
    END LOOP;
    
    RETURN payment_count;
END;
$$ LANGUAGE plpgsql;

-- 10. Inserir dados de exemplo para testar
INSERT INTO financial_transactions (
    project_id,
    transaction_type,
    description,
    amount,
    due_date,
    status,
    client_name
)
SELECT 
    p.id,
    'receita',
    'Faturamento do projeto ' || p.cliente,
    p.worked_hours * COALESCE(p.valor_hora_canal, 0),
    CURRENT_DATE + INTERVAL '15 days',
    'pendente',
    p.cliente
FROM projects p
WHERE p.worked_hours > 0
LIMIT 3;

-- Gerar pagamentos de consultores para o mês atual
SELECT generate_consultant_payments();

-- ✅ SCHEMA PARTE 4 CONCLUÍDO!
-- Suporta: Página Financial com gestão financeira completa
-- Próximo: Execute 05-users-auth.sql quando quiser adicionar autenticação


