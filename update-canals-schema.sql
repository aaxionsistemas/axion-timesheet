-- 🔄 ATUALIZAR SCHEMA DE CANAIS COM NOVOS CAMPOS
-- Execute este script no SQL Editor do Supabase

-- 1. Fazer backup dos dados existentes (opcional)
CREATE TEMP TABLE canals_backup AS SELECT * FROM canals;

-- 2. Adicionar novas colunas na tabela canals
ALTER TABLE canals 
ADD COLUMN IF NOT EXISTS contact_emails TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS data_apontamento DATE,
ADD COLUMN IF NOT EXISTS data_faturamento DATE,
ADD COLUMN IF NOT EXISTS data_pagamento DATE,
ADD COLUMN IF NOT EXISTS valor_hora DECIMAL(10, 2) DEFAULT 0 CHECK (valor_hora >= 0);

-- 3. Migrar dados existentes (contact_email -> contact_emails)
UPDATE canals 
SET contact_emails = CASE 
    WHEN contact_email IS NOT NULL AND contact_email != '' 
    THEN ARRAY[contact_email]
    ELSE '{}'
END
WHERE contact_emails = '{}' OR contact_emails IS NULL;

-- 4. Criar índices para os novos campos
CREATE INDEX IF NOT EXISTS idx_canals_valor_hora ON canals(valor_hora);
CREATE INDEX IF NOT EXISTS idx_canals_data_apontamento ON canals(data_apontamento);
CREATE INDEX IF NOT EXISTS idx_canals_data_faturamento ON canals(data_faturamento);
CREATE INDEX IF NOT EXISTS idx_canals_data_pagamento ON canals(data_pagamento);
CREATE INDEX IF NOT EXISTS idx_canals_contact_emails ON canals USING GIN(contact_emails);

-- 5. Atualizar dados de exemplo com os novos campos
UPDATE canals SET 
    contact_emails = ARRAY['joao@axionsistemas.com.br'],
    valor_hora = 200.00,
    data_apontamento = CURRENT_DATE,
    data_faturamento = CURRENT_DATE + INTERVAL '30 days'
WHERE name = 'Vendas Diretas';

UPDATE canals SET 
    contact_emails = ARRAY['maria@techpartner.com.br', 'contato@techpartner.com.br'],
    valor_hora = 180.00,
    data_apontamento = CURRENT_DATE - INTERVAL '5 days',
    data_faturamento = CURRENT_DATE + INTERVAL '25 days',
    data_pagamento = CURRENT_DATE + INTERVAL '35 days'
WHERE name = 'TechPartner Solutions';

UPDATE canals SET 
    contact_emails = ARRAY['carlos@email.com'],
    valor_hora = 150.00,
    data_apontamento = CURRENT_DATE - INTERVAL '2 days',
    data_faturamento = CURRENT_DATE + INTERVAL '28 days'
WHERE name = 'Indicação Carlos Mendes';

UPDATE canals SET 
    contact_emails = ARRAY['ana@axionsistemas.com.br', 'marketing@axionsistemas.com.br'],
    valor_hora = 120.00
WHERE name = 'Campanha Google Ads';

-- 6. Verificar se os dados foram atualizados corretamente
SELECT 
    'Canais atualizados com sucesso!' as status,
    COUNT(*) as total_canais,
    COUNT(*) FILTER (WHERE valor_hora > 0) as canais_com_valor,
    COUNT(*) FILTER (WHERE array_length(contact_emails, 1) > 0) as canais_com_emails,
    COUNT(*) FILTER (WHERE data_apontamento IS NOT NULL) as canais_com_data_apontamento
FROM canals;

-- 7. Mostrar dados atualizados
SELECT 
    name,
    type,
    valor_hora,
    contact_emails,
    data_apontamento,
    data_faturamento,
    data_pagamento,
    is_active
FROM canals 
ORDER BY created_at;

SELECT '✅ Schema de canais atualizado com sucesso!' as resultado;


