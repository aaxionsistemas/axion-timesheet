-- 👤 SCHEMA GRADATIVO - PARTE 5: USUÁRIOS E AUTENTICAÇÃO
-- Execute este script quando quiser adicionar sistema de usuários
-- Requer: Todas as partes anteriores executadas

-- IMPORTANTE: Este script trabalha com o sistema de autenticação nativo do Supabase
-- Certifique-se de que a autenticação está habilitada no seu projeto

-- 1. Tabela de perfis de usuário (estende auth.users do Supabase)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informações básicas
    full_name VARCHAR(255),
    avatar_url TEXT,
    
    -- Informações profissionais
    role VARCHAR(50) DEFAULT 'consultor' CHECK (role IN ('admin', 'consultor', 'cliente')),
    department VARCHAR(100),
    position VARCHAR(100),
    
    -- Informações de contato
    phone VARCHAR(20),
    
    -- Configurações financeiras (para consultores)
    default_hourly_rate DECIMAL(10, 2),
    payment_day INTEGER DEFAULT 10 CHECK (payment_day BETWEEN 1 AND 31),
    
    -- Configurações
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    language VARCHAR(10) DEFAULT 'pt-BR',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Índices para performance
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_is_active ON user_profiles(is_active);
CREATE INDEX idx_user_profiles_department ON user_profiles(department);

-- 3. Trigger para atualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'consultor')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION handle_new_user();

-- 6. Tabela de membros da equipe do projeto (atualizada para usar user_profiles)
CREATE TABLE project_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Informações do membro
    role VARCHAR(100) NOT NULL, -- Ex: "Desenvolvedor", "Gerente de Projeto", "Designer"
    hourly_rate DECIMAL(10, 2), -- Taxa específica deste membro para este projeto
    
    -- Permissões
    can_edit_project BOOLEAN DEFAULT false,
    can_view_financials BOOLEAN DEFAULT false,
    can_manage_team BOOLEAN DEFAULT false,
    
    -- Timestamps
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Evitar duplicatas
    UNIQUE(project_id, user_id)
);

-- 7. Índices para project_team_members
CREATE INDEX idx_project_team_project_id ON project_team_members(project_id);
CREATE INDEX idx_project_team_user_id ON project_team_members(user_id);

-- 8. Atualizar project_time_entries para usar user_id
ALTER TABLE project_time_entries 
ADD COLUMN user_profile_id UUID REFERENCES user_profiles(id);

-- 9. Migrar dados existentes de consultant_name para user_profile_id
-- (Este será um processo manual baseado nos nomes dos consultores)

-- 10. View para usuários ativos com suas estatísticas
CREATE VIEW active_users_stats AS
SELECT 
    up.id,
    up.full_name,
    up.role,
    up.department,
    up.default_hourly_rate,
    up.is_active,
    
    -- Estatísticas de projetos
    COUNT(DISTINCT ptm.project_id) as active_projects,
    COUNT(DISTINCT p.cliente) as clients_worked_with,
    
    -- Estatísticas de tempo
    COALESCE(SUM(pte.hours), 0) as total_hours_logged,
    COUNT(pte.id) as total_time_entries,
    
    -- Financeiro
    COALESCE(SUM(pte.hours * COALESCE(pte.hourly_rate, up.default_hourly_rate, 0)), 0) as total_earnings,
    
    -- Última atividade
    MAX(pte.created_at) as last_time_entry,
    MAX(ptm.assigned_at) as last_project_assignment
    
FROM user_profiles up
LEFT JOIN project_team_members ptm ON up.id = ptm.user_id
LEFT JOIN projects p ON ptm.project_id = p.id
LEFT JOIN project_time_entries pte ON up.id = pte.user_profile_id
WHERE up.is_active = true
GROUP BY up.id, up.full_name, up.role, up.department, up.default_hourly_rate, up.is_active;

-- 11. Políticas de RLS (Row Level Security)

-- Habilitar RLS nas tabelas principais
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para projects
CREATE POLICY "Team members can view their projects" ON projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM project_team_members 
            WHERE project_id = projects.id AND user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Project managers can update projects" ON projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM project_team_members 
            WHERE project_id = projects.id 
                AND user_id = auth.uid() 
                AND can_edit_project = true
        )
        OR EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para project_time_entries
CREATE POLICY "Users can view own time entries" ON project_time_entries
    FOR SELECT USING (user_profile_id = auth.uid());

CREATE POLICY "Users can create own time entries" ON project_time_entries
    FOR INSERT WITH CHECK (user_profile_id = auth.uid());

CREATE POLICY "Users can update own time entries" ON project_time_entries
    FOR UPDATE USING (user_profile_id = auth.uid());

CREATE POLICY "Admins can view all time entries" ON project_time_entries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para financial_transactions
CREATE POLICY "Admins can manage financial transactions" ON financial_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view own financial transactions" ON financial_transactions
    FOR SELECT USING (
        consultant_name = (
            SELECT full_name FROM user_profiles WHERE id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM project_team_members ptm
            JOIN user_profiles up ON ptm.user_id = up.id
            WHERE ptm.project_id = financial_transactions.project_id 
                AND up.id = auth.uid()
                AND ptm.can_view_financials = true
        )
    );

-- 12. Função para verificar permissões
CREATE OR REPLACE FUNCTION check_user_permission(
    user_id UUID,
    project_id UUID,
    permission_type VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Admin tem todas as permissões
    IF EXISTS (SELECT 1 FROM user_profiles WHERE id = user_id AND role = 'admin') THEN
        RETURN true;
    END IF;
    
    -- Verificar permissão específica no projeto
    CASE permission_type
        WHEN 'view_project' THEN
            RETURN EXISTS (
                SELECT 1 FROM project_team_members 
                WHERE project_id = project_id AND user_id = user_id
            );
        WHEN 'edit_project' THEN
            RETURN EXISTS (
                SELECT 1 FROM project_team_members 
                WHERE project_id = project_id AND user_id = user_id AND can_edit_project = true
            );
        WHEN 'view_financials' THEN
            RETURN EXISTS (
                SELECT 1 FROM project_team_members 
                WHERE project_id = project_id AND user_id = user_id AND can_view_financials = true
            );
        WHEN 'manage_team' THEN
            RETURN EXISTS (
                SELECT 1 FROM project_team_members 
                WHERE project_id = project_id AND user_id = user_id AND can_manage_team = true
            );
        ELSE
            RETURN false;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ SCHEMA PARTE 5 CONCLUÍDO!
-- Suporta: Sistema completo de usuários e autenticação
-- 
-- Para usar:
-- 1. Configure a autenticação no Supabase Dashboard
-- 2. Crie usuários via interface ou código
-- 3. Os perfis serão criados automaticamente
-- 4. Configure as permissões dos usuários nos projetos


