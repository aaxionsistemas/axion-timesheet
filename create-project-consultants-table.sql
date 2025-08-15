-- 🚀 CRIAR TABELA PARA MÚLTIPLOS CONSULTORES POR PROJETO
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela de relacionamento project_consultants
CREATE TABLE IF NOT EXISTS project_consultants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    consultant_id UUID NOT NULL,
    consultant_name VARCHAR(255) NOT NULL, -- Nome do consultor (para facilitar queries)
    consultant_email VARCHAR(255), -- Email do consultor (para referência)
    hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (hourly_rate >= 0),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(project_id, consultant_id) -- Evita duplicatas
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_project_consultants_project_id ON project_consultants(project_id);
CREATE INDEX IF NOT EXISTS idx_project_consultants_consultant_id ON project_consultants(consultant_id);
CREATE INDEX IF NOT EXISTS idx_project_consultants_hourly_rate ON project_consultants(hourly_rate);

-- 3. Criar função para updated_at
CREATE OR REPLACE FUNCTION update_project_consultants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Criar trigger para updated_at
CREATE TRIGGER update_project_consultants_updated_at 
    BEFORE UPDATE ON project_consultants
    FOR EACH ROW 
    EXECUTE FUNCTION update_project_consultants_updated_at();

-- 5. Habilitar RLS (Row Level Security)
ALTER TABLE project_consultants ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas para admins e consultores
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

-- 7. Comentários para documentação
COMMENT ON TABLE project_consultants IS 'Relacionamento entre projetos e consultores com valores individuais';
COMMENT ON COLUMN project_consultants.project_id IS 'ID do projeto (FK para projects.id)';
COMMENT ON COLUMN project_consultants.consultant_id IS 'ID do consultor (pode ser da tabela consultants ou users)';
COMMENT ON COLUMN project_consultants.consultant_name IS 'Nome do consultor para facilitar queries';
COMMENT ON COLUMN project_consultants.hourly_rate IS 'Valor por hora específico deste consultor neste projeto';

-- 8. Função para migrar dados existentes (opcional)
-- Descomente e execute se quiser migrar projetos existentes

/*
INSERT INTO project_consultants (project_id, consultant_id, consultant_name, hourly_rate)
SELECT 
    id as project_id,
    gen_random_uuid() as consultant_id, -- Gerar ID único temporário
    consultor as consultant_name,
    COALESCE(valor_hora_consultor, 0) as hourly_rate
FROM projects 
WHERE consultor IS NOT NULL AND consultor != ''
ON CONFLICT (project_id, consultant_id) DO NOTHING;
*/
