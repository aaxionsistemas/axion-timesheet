-- 🗑️ REMOVER COLUNA DE COMISSÃO DA TABELA CANALS
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar estrutura atual da tabela
SELECT 
    'Estrutura atual da tabela canals:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'canals' 
ORDER BY ordinal_position;

-- 2. Fazer backup dos dados (opcional - apenas para verificação)
SELECT 
    'Backup dos dados atuais:' as info,
    COUNT(*) as total_canals,
    COUNT(*) FILTER (WHERE commission_percentage IS NOT NULL) as canals_with_commission,
    AVG(commission_percentage) as avg_commission
FROM canals;

-- 3. Remover a coluna commission_percentage
ALTER TABLE canals DROP COLUMN IF EXISTS commission_percentage;

-- 4. Verificar se a coluna foi removida
SELECT 
    'Estrutura após remoção:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'canals' 
ORDER BY ordinal_position;

-- 5. Verificar dados após remoção
SELECT 
    'Dados após remoção da coluna:' as info,
    id,
    name,
    type,
    valor_hora,
    is_active
FROM canals 
ORDER BY created_at;

-- 6. Remover índice relacionado à comissão (se existir)
DROP INDEX IF EXISTS idx_canals_commission_percentage;

-- 7. Atualizar view admin_stats se ela referenciar commission_percentage
-- Verificar se a view existe e contém referência à comissão
DO $$
BEGIN
    -- Recriar a view admin_stats sem a comissão média
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'admin_stats') THEN
        DROP VIEW admin_stats;
        CREATE VIEW admin_stats AS
        SELECT 
            (SELECT COUNT(*) FROM users) as total_users,
            (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
            (SELECT COUNT(*) FROM consultants) as total_consultants,
            (SELECT COUNT(*) FROM consultants WHERE is_active = true) as active_consultants,
            (SELECT COUNT(*) FROM canals) as total_canals,
            (SELECT COUNT(*) FROM canals WHERE is_active = true) as active_canals,
            (SELECT COUNT(*) FROM clients) as total_clients,
            (SELECT COUNT(*) FROM clients WHERE is_active = true) as active_clients,
            (SELECT AVG(hourly_rate) FROM consultants WHERE is_active = true) as avg_hourly_rate,
            (SELECT AVG(valor_hora) FROM canals WHERE is_active = true) as avg_canal_valor_hora;
        
        RAISE NOTICE 'View admin_stats atualizada sem referência à comissão';
    END IF;
END $$;

-- 8. Verificar se tudo está funcionando
SELECT 
    '✅ Coluna commission_percentage removida com sucesso!' as resultado,
    COUNT(*) as total_canals_remaining,
    COUNT(*) FILTER (WHERE valor_hora > 0) as canals_with_valor_hora
FROM canals;

-- 9. Mostrar estrutura final da tabela
SELECT 
    '📋 ESTRUTURA FINAL DA TABELA CANALS:' as info;

\d canals;


