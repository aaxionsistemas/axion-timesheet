-- 🔧 CORRIGIR CAMPOS DE DATA DA TABELA CANALS
-- Execute este script no SQL Editor do Supabase

-- 1. Alterar os campos de data para aceitar apenas o dia do mês (1-31)
ALTER TABLE canals 
DROP COLUMN IF EXISTS data_apontamento,
DROP COLUMN IF EXISTS data_faturamento,
DROP COLUMN IF EXISTS data_pagamento;

-- 2. Adicionar os novos campos como INTEGER para armazenar apenas o dia (1-31)
ALTER TABLE canals 
ADD COLUMN data_apontamento INTEGER CHECK (data_apontamento >= 1 AND data_apontamento <= 31),
ADD COLUMN data_faturamento INTEGER CHECK (data_faturamento >= 1 AND data_faturamento <= 31),
ADD COLUMN data_pagamento INTEGER CHECK (data_pagamento >= 1 AND data_pagamento <= 31);

-- 3. Comentários para documentar o propósito
COMMENT ON COLUMN canals.data_apontamento IS 'Dia do mês para apontamento (1-31)';
COMMENT ON COLUMN canals.data_faturamento IS 'Dia do mês para faturamento (1-31)';
COMMENT ON COLUMN canals.data_pagamento IS 'Dia do mês para pagamento (1-31)';

-- 4. Criar índices para os novos campos
CREATE INDEX IF NOT EXISTS idx_canals_data_apontamento ON canals(data_apontamento);
CREATE INDEX IF NOT EXISTS idx_canals_data_faturamento ON canals(data_faturamento);
CREATE INDEX IF NOT EXISTS idx_canals_data_pagamento ON canals(data_pagamento);

-- 5. Inserir dados de exemplo
UPDATE canals SET 
    data_apontamento = 20,
    data_faturamento = 25,
    data_pagamento = 10
WHERE name = 'Vendas Diretas';

UPDATE canals SET 
    data_apontamento = 15,
    data_faturamento = 30,
    data_pagamento = 5
WHERE name = 'TechPartner Solutions';
