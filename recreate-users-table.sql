-- 🔥 RECRIAR TABELA USERS COM ADMIN MASTER
-- Execute este script no SQL Editor do Supabase

-- 1. Apagar tabela users existente (se existir)
DROP TABLE IF EXISTS users CASCADE;

-- 2. Criar tipos enum necessários (se não existirem)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'consultant');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 4. Criar nova tabela users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'consultant',
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 5. Criar índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);

-- 6. Criar função para updated_at (se não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Criar trigger para updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Inserir João Nunes como ADMIN MASTER
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
    '(11) 99999-9999',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 9. Inserir alguns usuários de exemplo
INSERT INTO users (name, email, role, phone, is_active) VALUES 
('Maria Santos', 'maria@axionsistemas.com.br', 'consultant', '(11) 88888-8888', true),
('Pedro Costa', 'pedro@axionsistemas.com.br', 'consultant', '(11) 77777-7777', true),
('Ana Silva', 'ana@axionsistemas.com.br', 'consultant', '(11) 66666-6666', false),
('Carlos Mendes', 'carlos@axionsistemas.com.br', 'admin', '(11) 55555-5555', true);

-- 10. Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 11. Criar política para admins (podem fazer tudo)
CREATE POLICY "Admins can manage all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.email = auth.jwt() ->> 'email' 
            AND u.role = 'admin' 
            AND u.is_active = true
        )
    );

-- 12. Criar política para usuários (podem ver apenas próprios dados)
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (email = auth.jwt() ->> 'email');

-- 13. Verificar se foi criado corretamente
SELECT 
    'Tabela users recriada com sucesso!' as status,
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE role = 'admin') as total_admins,
    COUNT(*) FILTER (WHERE is_active = true) as users_ativos
FROM users;

-- 14. Mostrar dados do admin master
SELECT 
    '🔐 ADMIN MASTER CRIADO:' as info,
    id,
    name,
    email,
    role,
    is_active,
    created_at
FROM users 
WHERE email = 'joao.nunes@axionsistemas.com';

SELECT '✅ Pronto! João Nunes é agora ADMIN MASTER!' as resultado;


