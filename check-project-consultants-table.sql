-- 🔍 VERIFICAR SE A TABELA project_consultants EXISTE E ESTÁ CONFIGURADA
-- Execute no SQL Editor do Supabase para diagnosticar

-- 1. Verificar se a tabela existe
SELECT 
    table_name, 
    table_type 
FROM information_schema.tables 
WHERE table_name = 'project_consultants';

-- 2. Verificar estrutura da tabela (se existir)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'project_consultants'
ORDER BY ordinal_position;

-- 3. Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'project_consultants';

-- 4. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    forcerowsecurity
FROM pg_tables 
WHERE tablename = 'project_consultants';

-- 5. Teste simples de inserção (descomente para testar)
/*
INSERT INTO project_consultants (
    project_id, 
    consultant_id, 
    consultant_name, 
    hourly_rate
) VALUES (
    gen_random_uuid(),
    gen_random_uuid(),
    'Teste',
    100.00
);
*/
