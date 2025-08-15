-- 🔄 FUNÇÃO RPC PARA CRIAR USUÁRIO + CONSULTOR
-- Execute este script no SQL Editor do Supabase para ter transações mais robustas
-- Esta função é opcional - o sistema funciona sem ela usando transação simulada

-- 1. Função para criar usuário com consultor em uma transação
CREATE OR REPLACE FUNCTION create_user_with_consultant(
  user_name TEXT,
  user_email TEXT,
  consultant_hourly_rate DECIMAL(10, 2),
  user_phone TEXT DEFAULT NULL,
  consultant_pix_key TEXT DEFAULT NULL,
  consultant_bank TEXT DEFAULT NULL
)
RETURNS TABLE(
  user_id UUID,
  user_name_out TEXT,
  user_email_out TEXT,
  user_role user_role,
  user_phone_out TEXT,
  user_is_active BOOLEAN,
  user_created_at TIMESTAMP WITH TIME ZONE,
  user_updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  new_consultant_id UUID;
BEGIN
  -- Verificar se email já existe
  IF EXISTS (SELECT 1 FROM users WHERE email = user_email) THEN
    RAISE EXCEPTION 'Email já está em uso: %', user_email;
  END IF;

  -- Criar usuário
  INSERT INTO users (name, email, role, phone, is_active)
  VALUES (user_name, user_email, 'consultant', user_phone, true)
  RETURNING id INTO new_user_id;

  -- Criar consultor vinculado
  INSERT INTO consultants (
    user_id, 
    hourly_rate, 
    pix_key, 
    bank, 
    is_active
  )
  VALUES (
    new_user_id,
    consultant_hourly_rate, 
    consultant_pix_key, 
    consultant_bank, 
    true
  )
  RETURNING id INTO new_consultant_id;

  -- Retornar dados do usuário criado
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.phone,
    u.is_active,
    u.created_at,
    u.updated_at
  FROM users u
  WHERE u.id = new_user_id;

EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro, a transação será automaticamente revertida
    RAISE EXCEPTION 'Erro ao criar usuário com consultor: %', SQLERRM;
END;
$$;

-- 2. Comentário da função
COMMENT ON FUNCTION create_user_with_consultant IS 
'Cria um usuário do tipo consultor e seu registro correspondente na tabela consultants em uma única transação';

-- 3. Permissões (ajustar conforme necessário)
-- GRANT EXECUTE ON FUNCTION create_user_with_consultant TO authenticated;
