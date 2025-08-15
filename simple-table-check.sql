-- 🔍 VERIFICAÇÃO SIMPLES DA TABELA project_consultants
-- Execute no SQL Editor do Supabase

-- 1. Verificar se a tabela existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'project_consultants'
) AS table_exists;

-- 2. Se a tabela existe, verificar estrutura
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'project_consultants'
ORDER BY ordinal_position;

-- 3. Verificar RLS
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'project_consultants';

-- 4. Contar registros existentes
SELECT COUNT(*) as total_records FROM project_consultants;
