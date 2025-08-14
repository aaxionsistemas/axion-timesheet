-- 🔐 SCRIPT PARA CONFIGURAR ADMIN MASTER
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela users existe
SELECT 'Verificando tabela users...' as status;

-- 2. Inserir ou atualizar o usuário admin master
INSERT INTO users (
    name, 
    email, 
    role, 
    phone, 
    is_active,
    created_at,
    updated_at
) VALUES (
    'João Nunes', 
    'joao.nunes@axionsistemas.com', 
    'admin', 
    null,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) 
ON CONFLICT (email) 
DO UPDATE SET 
    role = 'admin',
    is_active = true,
    updated_at = CURRENT_TIMESTAMP;

-- 3. Verificar se foi inserido/atualizado corretamente
SELECT 
    id,
    name,
    email,
    role,
    is_active,
    created_at,
    updated_at
FROM users 
WHERE email = 'joao.nunes@axionsistemas.com';

SELECT 'Admin master configurado com sucesso!' as status;


