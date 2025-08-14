-- Tabela de Clientes
CREATE TABLE clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255), -- Nome será preenchido automaticamente com o nome da empresa
    email VARCHAR(255),
    phone VARCHAR(20),
    company VARCHAR(255) NOT NULL, -- Empresa é obrigatória
    contact_person VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Pessoas de Contato (relacionamento 1:N com clientes)
CREATE TABLE client_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_company ON clients(company);
CREATE INDEX idx_clients_is_active ON clients(is_active);
CREATE INDEX idx_clients_created_at ON clients(created_at);

CREATE INDEX idx_client_contacts_client_id ON client_contacts(client_id);
CREATE INDEX idx_client_contacts_email ON client_contacts(email);
CREATE INDEX idx_client_contacts_is_primary ON client_contacts(is_primary);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_contacts_updated_at 
    BEFORE UPDATE ON client_contacts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Opcional, dependendo da sua estratégia de segurança
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança básicas (ajuste conforme necessário)
CREATE POLICY "Permitir leitura de clientes para usuários autenticados" 
    ON clients FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção de clientes para usuários autenticados" 
    ON clients FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização de clientes para usuários autenticados" 
    ON clients FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão de clientes para usuários autenticados" 
    ON clients FOR DELETE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir leitura de contatos para usuários autenticados" 
    ON client_contacts FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção de contatos para usuários autenticados" 
    ON client_contacts FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização de contatos para usuários autenticados" 
    ON client_contacts FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão de contatos para usuários autenticados" 
    ON client_contacts FOR DELETE 
    USING (auth.role() = 'authenticated');

-- Dados de exemplo (opcional)
INSERT INTO clients (name, email, phone, company, contact_person, is_active) VALUES
('Tech Solutions Ltda', 'contato@techsolutions.com.br', '11999999999', 'Tech Solutions Ltda', 'Roberto Silva', true),
('FinanCorp Soluções Financeiras', 'admin@financorp.com.br', '11888888888', 'FinanCorp Soluções Financeiras', 'Ana Paula Costa', true),
('DataX Analytics Ltda', 'contato@datax.com.br', '11777777777', 'DataX Analytics Ltda', 'Carlos Mendes', true);

-- Inserir contatos para os clientes de exemplo
INSERT INTO client_contacts (client_id, name, email, is_primary) VALUES
((SELECT id FROM clients WHERE name = 'Tech Solutions Ltda'), 'Roberto Silva', 'roberto@techsolutions.com.br', true),
((SELECT id FROM clients WHERE name = 'Tech Solutions Ltda'), 'Maria Santos', 'maria@techsolutions.com.br', false),
((SELECT id FROM clients WHERE name = 'FinanCorp'), 'Ana Paula Costa', 'ana@financorp.com.br', true),
((SELECT id FROM clients WHERE name = 'DataX Analytics'), 'Carlos Mendes', 'carlos@datax.com.br', true),
((SELECT id FROM clients WHERE name = 'DataX Analytics'), 'Fernanda Lima', 'fernanda@datax.com.br', false);
