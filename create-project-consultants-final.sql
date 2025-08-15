-- 🚀 CRIAR TABELA project_consultants - VERSÃO FINAL
-- Execute este script completo no SQL Editor do Supabase

-- 1. Criar tabela project_consultants
CREATE TABLE project_consultants (
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

-- 2. Criar índices para performance
CREATE INDEX idx_project_consultants_project_id ON project_consultants(project_id);
CREATE INDEX idx_project_consultants_consultant_id ON project_consultants(consultant_id);
CREATE INDEX idx_project_consultants_hourly_rate ON project_consultants(hourly_rate);

-- 3. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_project_consultants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_consultants_updated_at 
    BEFORE UPDATE ON project_consultants
    FOR EACH ROW 
    EXECUTE FUNCTION update_project_consultants_updated_at();

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE project_consultants ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas de segurança
CREATE POLICY "Anyone can manage project consultants for now" ON project_consultants
    FOR ALL USING (true);

-- 6. Comentários para documentação
COMMENT ON TABLE project_consultants IS 'Relacionamento N:N entre projetos e consultores com valores individuais';
COMMENT ON COLUMN project_consultants.project_id IS 'ID do projeto';
COMMENT ON COLUMN project_consultants.consultant_id IS 'ID do consultor';
COMMENT ON COLUMN project_consultants.consultant_name IS 'Nome do consultor';
COMMENT ON COLUMN project_consultants.hourly_rate IS 'Valor por hora específico deste consultor neste projeto';

-- 7. Verificar se funcionou
SELECT 'Tabela project_consultants criada com sucesso!' AS status;
