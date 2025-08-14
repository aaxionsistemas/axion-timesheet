-- Tabela de Consultores
CREATE TABLE consultants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    pix_key VARCHAR(255),
    bank VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_consultants_name ON consultants(name);
CREATE INDEX idx_consultants_email ON consultants(email);
CREATE INDEX idx_consultants_is_active ON consultants(is_active);
CREATE INDEX idx_consultants_created_at ON consultants(created_at);
CREATE INDEX idx_consultants_hourly_rate ON consultants(hourly_rate);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_consultants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_consultants_updated_at 
    BEFORE UPDATE ON consultants 
    FOR EACH ROW 
    EXECUTE FUNCTION update_consultants_updated_at();

-- RLS (Row Level Security)
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança básicas
CREATE POLICY "Permitir leitura de consultores para usuários autenticados" 
    ON consultants FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção de consultores para usuários autenticados" 
    ON consultants FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização de consultores para usuários autenticados" 
    ON consultants FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão de consultores para usuários autenticados" 
    ON consultants FOR DELETE 
    USING (auth.role() = 'authenticated');

-- Dados de exemplo (opcional)
INSERT INTO consultants (name, email, hourly_rate, pix_key, bank, is_active) VALUES
('Maria Santos', 'maria@axionsistemas.com.br', 180.00, 'maria@axionsistemas.com.br', 'Banco do Brasil', true),
('Pedro Costa', 'pedro@axionsistemas.com.br', 200.00, '11999999999', 'Itaú', true),
('Ana Silva', 'ana@axionsistemas.com.br', 150.00, 'ana.silva@pix.com', 'Nubank', true),
('Carlos Mendes', 'carlos@axionsistemas.com.br', 220.00, '12345678901', 'Santander', false);


