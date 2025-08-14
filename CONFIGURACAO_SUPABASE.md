# 🚀 Configuração do Supabase - Axion Timesheet

Este guia te ajudará a configurar o banco de dados Supabase corretamente para o projeto Axion Timesheet.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Node.js instalado
- Projeto Next.js configurado

## 🔧 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em **"New project"**
3. Escolha sua organização
4. Preencha:
   - **Name**: `axion-timesheet`
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: Escolha a região mais próxima (ex: South America)
5. Clique em **"Create new project"**
6. Aguarde a criação (pode levar alguns minutos)

### 2. Obter Credenciais do Projeto

1. No dashboard do seu projeto, vá para **Settings** → **API**
2. Copie os seguintes valores:
   - **Project URL** (algo como `https://xxx.supabase.co`)
   - **anon public key** (chave longa começando com `eyJ...`)

### 3. Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie o arquivo `.env.local`:

```bash
# Configuração do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

2. Substitua pelos valores reais que você copiou no passo anterior

### 4. Executar o Schema do Banco

1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo `supabase-schema.sql` (criado automaticamente)
4. Cole no editor SQL
5. Clique em **"Run"** para executar o script
6. Verifique se não houve erros na execução

### 5. Verificar Tabelas Criadas

1. Vá para **Table Editor** no dashboard
2. Você deve ver as seguintes tabelas:
   - `projects`
   - `project_team_members`
   - `project_time_entries`
   - `project_milestones`
   - `project_documents`

### 6. Testar a Conexão

1. Execute o projeto: `npm run dev`
2. Acesse `http://localhost:3000/projects`
3. Se tudo estiver correto, você verá:
   - Lista de projetos (pode estar vazia inicialmente)
   - Botão "Novo Projeto" funcionando
   - Sem erros no console do navegador

## 🔍 Verificação de Problemas

### Erro: "Variáveis de ambiente do Supabase não configuradas"

- ✅ Verifique se o arquivo `.env.local` existe na raiz do projeto
- ✅ Confirme se as variáveis estão nomeadas corretamente:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Reinicie o servidor de desenvolvimento após criar o arquivo

### Erro: "Failed to fetch" ou problemas de conexão

- ✅ Verifique se a URL do Supabase está correta
- ✅ Confirme se a chave anon está correta
- ✅ Verifique se o projeto no Supabase está ativo

### Erro: "relation does not exist" ou problemas de tabela

- ✅ Execute novamente o script `supabase-schema.sql` no SQL Editor
- ✅ Verifique se todas as tabelas foram criadas no Table Editor
- ✅ Confirme se não houve erros durante a execução do script

### Erro: "permission denied" ou problemas de acesso

- ✅ As políticas RLS estão comentadas por padrão
- ✅ Se você habilitou RLS, descomente as políticas no final do script
- ✅ Ou desabilite RLS temporariamente para testes

## 📊 Dados de Exemplo

O script já inclui alguns projetos de exemplo. Para ver os dados:

1. Vá para **Table Editor** → **projects**
2. Você deve ver 3 projetos de exemplo
3. Se não aparecerem, execute apenas a parte final do script SQL (INSERT statements)

## 🔒 Segurança (Opcional)

Para produção, considere:

1. **Habilitar RLS (Row Level Security)**:
   ```sql
   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
   ```

2. **Configurar políticas de acesso**:
   - Descomente as políticas no final do `supabase-schema.sql`
   - Ajuste conforme suas necessidades de segurança

3. **Usar Service Role Key** para operações administrativas:
   - Disponível em Settings → API
   - Use apenas no backend/servidor

## 🆘 Suporte

Se você encontrar problemas:

1. **Console do navegador**: Verifique erros JavaScript
2. **Network tab**: Verifique requisições HTTP falhando
3. **Supabase Logs**: Vá para Logs no dashboard do Supabase
4. **Documentação oficial**: [supabase.com/docs](https://supabase.com/docs)

## ✅ Checklist Final

- [ ] Projeto criado no Supabase
- [ ] Arquivo `.env.local` configurado
- [ ] Script SQL executado sem erros
- [ ] Tabelas visíveis no Table Editor
- [ ] Aplicação rodando sem erros
- [ ] Consegue criar/editar/excluir projetos

Após completar todos os passos, seu projeto estará conectado ao Supabase e funcionando corretamente! 🎉

