-- 🔧 CORRIGIR ENUM user_role PARA INCLUIR TODOS OS TIPOS DE USUÁRIO
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar novos valores ao enum user_role
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'view';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'master_admin';

-- 2. Verificar os valores atuais do enum (opcional - para debug)
-- SELECT unnest(enum_range(NULL::user_role)) AS user_role_values;

-- 3. Atualizar a política de canais que referencia 'admin' para incluir 'master_admin'
-- (Se existir)
DROP POLICY IF EXISTS "Admins can manage canals" ON canals;

CREATE POLICY "Admins can manage canals" ON canals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.email = auth.jwt() ->> 'email' 
            AND u.role IN ('admin', 'master_admin') 
            AND u.is_active = true
        )
    );

-- 4. Atualizar a política da tabela project_consultants (se já foi criada)
DROP POLICY IF EXISTS "Admins can manage project consultants" ON project_consultants;

CREATE POLICY "Admins can manage project consultants" ON project_consultants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.email = auth.jwt() ->> 'email' 
            AND u.role IN ('admin', 'master_admin') 
            AND u.is_active = true
        )
    );

-- 5. Comentário para documentação
COMMENT ON TYPE user_role IS 'Tipos de usuário: view (apenas visualização), consultant (consultor), admin (administrador), master_admin (super administrador)';

-- 6. Verificar se as atualizações funcionaram
-- Descomente para testar:
-- SELECT 'view'::user_role, 'consultant'::user_role, 'admin'::user_role, 'master_admin'::user_role;
