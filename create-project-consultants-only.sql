-- 🚀 CRIAR APENAS A TABELA project_consultants
-- Execute depois de corrigir o enum user_role

-- ================================
-- 1. CRIAR TABELA project_consultants
-- ================================

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

-- ================================
-- 2. ÍNDICES
-- ================================

CREATE INDEX IF NOT EXISTS idx_project_consultants_project_id ON project_consultants(project_id);
CREATE INDEX IF NOT EXISTS idx_project_consultants_consultant_id ON project_consultants(consultant_id);
CREATE INDEX IF NOT EXISTS idx_project_consultants_hourly_rate ON project_consultants(hourly_rate);

-- ================================
-- 3. TRIGGER PARA updated_at
-- ================================

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
-- 4. RLS E POLÍTICAS
-- ================================

ALTER TABLE project_consultants ENABLE ROW LEVEL SECURITY;

-- Política para admins e master admins
CREATE POLICY "Admins can manage project consultants" ON project_consultants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.email = auth.jwt() ->> 'email' 
            AND u.role IN ('admin', 'master_admin') 
            AND u.is_active = true
        )
    );

-- Política para consultores verem suas próprias atribuições
CREATE POLICY "Consultants can view their assignments" ON project_consultants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.email = auth.jwt() ->> 'email' 
            AND u.email = consultant_email
            AND u.is_active = true
        )
    );

-- ================================
-- 5. COMENTÁRIOS
-- ================================

COMMENT ON TABLE project_consultants IS 'Relacionamento N:N entre projetos e consultores com valores de hora individuais';
COMMENT ON COLUMN project_consultants.project_id IS 'ID do projeto';
COMMENT ON COLUMN project_consultants.consultant_id IS 'ID do consultor';
COMMENT ON COLUMN project_consultants.consultant_name IS 'Nome do consultor para facilitar queries';
COMMENT ON COLUMN project_consultants.hourly_rate IS 'Valor por hora específico deste consultor neste projeto';
