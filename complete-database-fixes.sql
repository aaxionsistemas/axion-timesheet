-- 🚀 CORREÇÕES COMPLETAS DO BANCO DE DADOS
-- Execute este script no SQL Editor do Supabase
-- Resolve: enum user_role + tabela project_consultants + políticas

-- ================================
-- 1. CORRIGIR ENUM user_role
-- ================================

-- Adicionar novos valores ao enum user_role
DO $$ 
BEGIN
    -- Adicionar 'view' se não existir
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'view' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE user_role ADD VALUE 'view';
    END IF;
    
    -- Adicionar 'master_admin' se não existir  
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'master_admin' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE user_role ADD VALUE 'master_admin';
    END IF;
END $$;

-- ================================
-- 2. CRIAR TABELA project_consultants
-- ================================

-- Criar tabela de relacionamento project_consultants
CREATE TABLE IF NOT EXISTS project_consultants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    consultant_id UUID NOT NULL,
    consultant_name VARCHAR(255) NOT NULL,
    consultant_email VARCHAR(255),
    hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (hourly_rate >= 0),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(project_id, consultant_id)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_project_consultants_project_id ON project_consultants(project_id);
CREATE INDEX IF NOT EXISTS idx_project_consultants_consultant_id ON project_consultants(consultant_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_project_consultants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_project_consultants_updated_at ON project_consultants;
CREATE TRIGGER update_project_consultants_updated_at 
    BEFORE UPDATE ON project_consultants
    FOR EACH ROW 
    EXECUTE FUNCTION update_project_consultants_updated_at();

-- ================================
-- 3. CONFIGURAR RLS E POLÍTICAS
-- ================================

-- Habilitar RLS na tabela project_consultants
ALTER TABLE project_consultants ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Admins can manage project consultants" ON project_consultants;
DROP POLICY IF EXISTS "Consultants can view their assignments" ON project_consultants;

-- Criar políticas atualizadas
CREATE POLICY "Admins can manage project consultants" ON project_consultants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.email = auth.jwt() ->> 'email' 
            AND u.role IN ('admin', 'master_admin') 
            AND u.is_active = true
        )
    );

CREATE POLICY "Consultants can view their assignments" ON project_consultants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.email = auth.jwt() ->> 'email' 
            AND u.email = consultant_email
            AND u.is_active = true
        )
    );

-- Atualizar políticas da tabela canals também
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

-- ================================
-- 4. COMENTÁRIOS E DOCUMENTAÇÃO
-- ================================

COMMENT ON TYPE user_role IS 'Tipos de usuário: view, consultant, admin, master_admin';
COMMENT ON TABLE project_consultants IS 'Relacionamento N:N entre projetos e consultores com valores individuais';
COMMENT ON COLUMN project_consultants.hourly_rate IS 'Valor por hora específico deste consultor neste projeto';

-- ================================
-- 5. VERIFICAÇÃO (opcional)
-- ================================

-- Verificar se os valores do enum estão corretos
-- SELECT unnest(enum_range(NULL::user_role)) AS available_roles;

-- Verificar se a tabela foi criada
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'project_consultants';

-- ================================
-- 6. DADOS DE EXEMPLO (opcional)
-- ================================

-- Migrar projetos existentes para a nova estrutura (descomente se necessário)
/*
INSERT INTO project_consultants (project_id, consultant_id, consultant_name, hourly_rate)
SELECT 
    p.id as project_id,
    COALESCE(c.id, gen_random_uuid()) as consultant_id,
    p.consultor as consultant_name,
    COALESCE(p.valor_hora_consultor, 0) as hourly_rate
FROM projects p
LEFT JOIN consultants c ON c.name = p.consultor
WHERE p.consultor IS NOT NULL AND p.consultor != ''
ON CONFLICT (project_id, consultant_id) DO NOTHING;
*/
