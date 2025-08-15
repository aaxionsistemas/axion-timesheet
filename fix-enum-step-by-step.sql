-- 🔧 CORRIGIR ENUM user_role - PASSO A PASSO
-- Execute cada comando SEPARADAMENTE no SQL Editor do Supabase
-- NÃO execute tudo de uma vez!

-- =====================================
-- PASSO 1: Adicionar 'view'
-- Execute este comando primeiro e aguarde completar
-- =====================================

ALTER TYPE user_role ADD VALUE 'view';

-- =====================================
-- PASSO 2: Adicionar 'master_admin' 
-- Execute este comando EM SEPARADO depois do Passo 1
-- =====================================

-- ALTER TYPE user_role ADD VALUE 'master_admin';

-- =====================================
-- PASSO 3: Verificar os valores
-- Execute para confirmar que funcionou
-- =====================================

-- SELECT unnest(enum_range(NULL::user_role)) AS user_role_values;
