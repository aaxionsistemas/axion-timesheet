-- 🚀 SCHEMA GRADATIVO - PARTE 2: ADMINISTRAÇÃO - USUÁRIOS E CONSULTORES
-- Execute este script após o schema básico de projetos

-- 1. Criar tipos enum para usuários
CREATE TYPE user_role AS ENUM ('admin', 'consultant');
CREATE TYPE canal_type AS ENUM ('direto', 'parceiro', 'indicacao', 'marketing');

-- 2. Extensão para validação de email
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Tabela de usuários (estende auth.users do Supabase)
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

-- 4. Tabela de consultores (informações específicas)
CREATE TABLE consultants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(255),
    hourly_rate DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (hourly_rate >= 0),
    hire_date DATE,
    skills TEXT[], -- Array de strings para skills
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de canais
CREATE TABLE canals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type canal_type NOT NULL,
    commission_percentage DECIMAL(5, 2) DEFAULT 0 CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_contact_email CHECK (
        contact_email IS NULL OR 
        contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    )
);

-- 6. Tabela de clientes
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    company VARCHAR(255),
    cnpj VARCHAR(18), -- Formato: XX.XXX.XXX/XXXX-XX
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2), -- Código do estado (SP, RJ, etc.)
    zip_code VARCHAR(10), -- CEP
    contact_person VARCHAR(255),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_client_email CHECK (
        email IS NULL OR 
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT valid_cnpj CHECK (
        cnpj IS NULL OR 
        cnpj ~* '^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$'
    ),
    CONSTRAINT valid_state CHECK (
        state IS NULL OR 
        LENGTH(state) = 2
    )
);

-- 7. Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);

CREATE INDEX idx_consultants_user_id ON consultants(user_id);
CREATE INDEX idx_consultants_is_active ON consultants(is_active);
CREATE INDEX idx_consultants_hourly_rate ON consultants(hourly_rate);
CREATE INDEX idx_consultants_skills ON consultants USING GIN(skills);

CREATE INDEX idx_canals_type ON canals(type);
CREATE INDEX idx_canals_is_active ON canals(is_active);
CREATE INDEX idx_canals_name ON canals(name);

CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_company ON clients(company);
CREATE INDEX idx_clients_is_active ON clients(is_active);
CREATE INDEX idx_clients_city ON clients(city);
CREATE INDEX idx_clients_state ON clients(state);

-- 8. Triggers para updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultants_updated_at 
    BEFORE UPDATE ON consultants
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_canals_updated_at 
    BEFORE UPDATE ON canals
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Views úteis
CREATE VIEW consultant_details AS
SELECT 
    c.id as consultant_id,
    u.id as user_id,
    u.name,
    u.email,
    u.phone,
    u.role,
    u.is_active as user_active,
    c.specialty,
    c.hourly_rate,
    c.hire_date,
    c.skills,
    c.bio,
    c.is_active as consultant_active,
    u.created_at,
    c.updated_at
FROM consultants c
JOIN users u ON c.user_id = u.id;

-- 10. View para estatísticas de administração
CREATE VIEW admin_stats AS
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
    (SELECT COUNT(*) FROM consultants) as total_consultants,
    (SELECT COUNT(*) FROM consultants WHERE is_active = true) as active_consultants,
    (SELECT COUNT(*) FROM canals) as total_canals,
    (SELECT COUNT(*) FROM canals WHERE is_active = true) as active_canals,
    (SELECT COUNT(*) FROM clients) as total_clients,
    (SELECT COUNT(*) FROM clients WHERE is_active = true) as active_clients,
    (SELECT AVG(hourly_rate) FROM consultants WHERE is_active = true) as avg_hourly_rate,
    (SELECT AVG(commission_percentage) FROM canals WHERE is_active = true) as avg_commission;

-- 11. Função para sincronizar usuário com auth.users
CREATE OR REPLACE FUNCTION sync_user_with_auth()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar email no auth.users se mudou
    IF OLD.email != NEW.email THEN
        UPDATE auth.users 
        SET email = NEW.email 
        WHERE id = NEW.auth_user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. Trigger para sincronização
CREATE TRIGGER sync_user_auth_trigger
    AFTER UPDATE OF email ON users
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_with_auth();

-- 13. Inserir dados de exemplo
INSERT INTO users (name, email, role, phone, is_active) VALUES 
('João Silva', 'joao@axionsistemas.com.br', 'admin', '(11) 99999-9999', true),
('Maria Santos', 'maria@axionsistemas.com.br', 'consultant', '(11) 88888-8888', true),
('Pedro Costa', 'pedro@axionsistemas.com.br', 'consultant', '(11) 77777-7777', true),
('Ana Silva', 'ana@axionsistemas.com.br', 'consultant', '(11) 66666-6666', false);

-- 14. Inserir consultores
INSERT INTO consultants (user_id, specialty, hourly_rate, hire_date, skills, bio, is_active)
SELECT 
    u.id,
    CASE 
        WHEN u.name = 'Maria Santos' THEN 'Desenvolvimento Frontend'
        WHEN u.name = 'Pedro Costa' THEN 'Desenvolvimento Backend'
        WHEN u.name = 'Ana Silva' THEN 'UI/UX Design'
    END,
    CASE 
        WHEN u.name = 'Maria Santos' THEN 180.00
        WHEN u.name = 'Pedro Costa' THEN 200.00
        WHEN u.name = 'Ana Silva' THEN 150.00
    END,
    CASE 
        WHEN u.name = 'Maria Santos' THEN '2024-01-20'
        WHEN u.name = 'Pedro Costa' THEN '2024-02-01'
        WHEN u.name = 'Ana Silva' THEN '2023-12-15'
    END,
    CASE 
        WHEN u.name = 'Maria Santos' THEN ARRAY['React', 'TypeScript', 'Next.js', 'Tailwind']
        WHEN u.name = 'Pedro Costa' THEN ARRAY['Node.js', 'Python', 'PostgreSQL', 'Docker']
        WHEN u.name = 'Ana Silva' THEN ARRAY['Figma', 'Adobe XD', 'Prototyping', 'User Research']
    END,
    CASE 
        WHEN u.name = 'Maria Santos' THEN 'Especialista em desenvolvimento frontend com 5 anos de experiência'
        WHEN u.name = 'Pedro Costa' THEN 'Desenvolvedor backend sênior com expertise em arquitetura de sistemas'
        WHEN u.name = 'Ana Silva' THEN 'Designer com foco em experiência do usuário e interfaces modernas'
    END,
    u.is_active
FROM users u 
WHERE u.role = 'consultant';

-- 15. Inserir canais
INSERT INTO canals (name, description, type, commission_percentage, contact_person, contact_email, contact_phone, is_active) VALUES 
('Vendas Diretas', 'Canal de vendas diretas da empresa', 'direto', 0, 'João Silva', 'joao@axionsistemas.com.br', '(11) 99999-9999', true),
('TechPartner Solutions', 'Parceiro estratégico para soluções corporativas', 'parceiro', 15, 'Maria Fernanda', 'maria@techpartner.com.br', '(11) 88888-8888', true),
('Indicação Carlos Mendes', 'Canal de indicações do consultor Carlos Mendes', 'indicacao', 5, 'Carlos Mendes', 'carlos@email.com', '(11) 77777-7777', true),
('Campanha Google Ads', 'Canal de marketing digital - Google Ads', 'marketing', 0, 'Ana Marketing', 'ana@axionsistemas.com.br', NULL, false);

-- 16. Inserir clientes
INSERT INTO clients (name, email, phone, company, cnpj, address, city, state, zip_code, contact_person, notes, is_active) VALUES 
('Tech Solutions Ltda', 'contato@techsolutions.com.br', '(11) 3333-3333', 'Tech Solutions Ltda', '12.345.678/0001-90', 'Av. Paulista, 1000', 'São Paulo', 'SP', '01310-100', 'Roberto Silva', 'Cliente estratégico com potencial para novos projetos', true),
('FinanCorp', 'admin@financorp.com.br', '(11) 4444-4444', 'FinanCorp Soluções Financeiras', '98.765.432/0001-10', 'Rua das Flores, 500', 'São Paulo', 'SP', '04567-890', 'Ana Paula Costa', 'Foco em soluções de integração bancária', true),
('DataX Analytics', 'contato@datax.com.br', '(11) 5555-5555', 'DataX Analytics Ltda', '11.222.333/0001-44', 'Rua da Inovação, 123', 'São Paulo', 'SP', '01234-567', 'Carlos Mendes', 'Especialista em Business Intelligence', true),
('StartupX', 'founder@startupx.com.br', '(11) 6666-6666', 'StartupX Tecnologia', NULL, 'Hub de Inovação, 456', 'São Paulo', 'SP', '01111-222', 'Marina Oliveira', 'Cliente pequeno mas com grande potencial de crescimento', false);

-- 17. Atualizar tabela de projetos para usar FKs
-- Adicionar colunas de referência na tabela projects (se necessário)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id),
ADD COLUMN IF NOT EXISTS canal_id UUID REFERENCES canals(id),
ADD COLUMN IF NOT EXISTS consultant_id UUID REFERENCES consultants(id);

-- 18. Criar índices nas novas FKs
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_canal_id ON projects(canal_id);
CREATE INDEX IF NOT EXISTS idx_projects_consultant_id ON projects(consultant_id);

SELECT 'Schema de administração criado com sucesso!' as status;


