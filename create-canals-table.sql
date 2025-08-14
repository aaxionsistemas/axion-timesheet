-- 🚀 CRIAR TABELA CANALS COMPLETA
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tipo enum para canais (se não existir)
DO $$ BEGIN
    CREATE TYPE canal_type AS ENUM ('direto', 'parceiro', 'indicacao', 'marketing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Criar função para updated_at (se não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Criar tabela canals completa
CREATE TABLE canals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Informações básicas
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type canal_type NOT NULL,
    
    -- Valores e comissões
    commission_percentage DECIMAL(5, 2) DEFAULT 0 CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
    valor_hora DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (valor_hora >= 0),
    
    -- Informações de contato
    contact_person VARCHAR(255),
    contact_emails TEXT[] DEFAULT '{}', -- Array de emails
    contact_phone VARCHAR(20),
    
    -- Datas importantes
    data_apontamento DATE,
    data_faturamento DATE,
    data_pagamento DATE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_contact_emails CHECK (
        contact_emails IS NULL OR 
        array_length(contact_emails, 1) IS NULL OR
        (SELECT bool_and(email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') 
         FROM unnest(contact_emails) AS email)
    )
);

-- 5. Criar índices para performance
CREATE INDEX idx_canals_name ON canals(name);
CREATE INDEX idx_canals_type ON canals(type);
CREATE INDEX idx_canals_is_active ON canals(is_active);
CREATE INDEX idx_canals_valor_hora ON canals(valor_hora);
CREATE INDEX idx_canals_data_apontamento ON canals(data_apontamento);
CREATE INDEX idx_canals_data_faturamento ON canals(data_faturamento);
CREATE INDEX idx_canals_data_pagamento ON canals(data_pagamento);
CREATE INDEX idx_canals_contact_emails ON canals USING GIN(contact_emails);
CREATE INDEX idx_canals_created_at ON canals(created_at);

-- 6. Criar trigger para updated_at
CREATE TRIGGER update_canals_updated_at 
    BEFORE UPDATE ON canals
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Habilitar RLS (Row Level Security)
ALTER TABLE canals ENABLE ROW LEVEL SECURITY;

-- 8. Criar política para admins (podem fazer tudo)
CREATE POLICY "Admins can manage canals" ON canals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.email = auth.jwt() ->> 'email' 
            AND u.role = 'admin' 
            AND u.is_active = true
        )
    );

-- 9. Criar política para consultores (podem apenas visualizar)
CREATE POLICY "Consultants can view canals" ON canals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.email = auth.jwt() ->> 'email' 
            AND u.is_active = true
        )
    );

-- 10. Inserir dados de exemplo
INSERT INTO canals (
    name, 
    description, 
    type, 
    commission_percentage, 
    valor_hora,
    contact_person, 
    contact_emails, 
    contact_phone, 
    data_apontamento,
    data_faturamento,
    data_pagamento,
    is_active
) VALUES 
(
    'Vendas Diretas',
    'Canal de vendas diretas da empresa',
    'direto',
    0,
    200.00,
    'João Silva',
    ARRAY['joao@axionsistemas.com.br', 'vendas@axionsistemas.com.br'],
    '(11) 99999-9999',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '40 days',
    true
),
(
    'TechPartner Solutions',
    'Parceiro estratégico para soluções corporativas',
    'parceiro',
    15.0,
    180.00,
    'Maria Fernanda',
    ARRAY['maria@techpartner.com.br', 'contato@techpartner.com.br'],
    '(11) 88888-8888',
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '25 days',
    CURRENT_DATE + INTERVAL '35 days',
    true
),
(
    'Indicação Carlos Mendes',
    'Canal de indicações do consultor Carlos Mendes',
    'indicacao',
    5.0,
    150.00,
    'Carlos Mendes',
    ARRAY['carlos@email.com'],
    '(11) 77777-7777',
    CURRENT_DATE - INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '28 days',
    NULL,
    true
),
(
    'Campanha Google Ads',
    'Canal de marketing digital - Google Ads',
    'marketing',
    0,
    120.00,
    'Ana Marketing',
    ARRAY['ana@axionsistemas.com.br', 'marketing@axionsistemas.com.br'],
    NULL,
    NULL,
    NULL,
    NULL,
    false
);

-- 11. Verificar se foi criado corretamente
SELECT 
    'Tabela canals criada com sucesso!' as status,
    COUNT(*) as total_canals,
    COUNT(*) FILTER (WHERE is_active = true) as canals_ativos,
    AVG(valor_hora) as valor_hora_medio,
    AVG(commission_percentage) as comissao_media
FROM canals;

-- 12. Mostrar estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'canals' 
ORDER BY ordinal_position;

-- 13. Mostrar dados inseridos
SELECT 
    '📋 CANAIS CRIADOS:' as info,
    name,
    type,
    valor_hora,
    array_length(contact_emails, 1) as qtd_emails,
    data_apontamento,
    data_faturamento,
    data_pagamento,
    is_active
FROM canals 
ORDER BY created_at;

SELECT '✅ Tabela canals criada e populada com sucesso!' as resultado;


