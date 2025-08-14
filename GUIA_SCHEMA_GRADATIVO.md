# 🚀 Guia de Schema Gradativo - Axion Timesheet

Este guia te ajudará a aplicar o schema do banco de dados de forma gradativa, uma funcionalidade por vez.

## 📋 Ordem de Execução

### ✅ **Parte 1: Projetos Básicos** (OBRIGATÓRIA)
**Arquivo:** `schemas/01-projects-basic.sql`

**O que inclui:**
- Tabela `projects` com todos os campos necessários
- Tipos enum (`project_status`, `project_priority`)
- Índices de performance
- View `project_stats`
- Dados de exemplo

**Suporta:**
- ✅ Dashboard completo
- ✅ Página de Projetos
- ✅ Todos os gráficos e estatísticas

---

### 🕒 **Parte 2: Timesheet** (OPCIONAL)
**Arquivo:** `schemas/02-timesheet.sql`
**Requer:** Parte 1 executada

**O que inclui:**
- Tabela `project_time_entries`
- Sincronização automática de horas trabalhadas
- Views para relatórios de timesheet
- Dados de exemplo

**Suporta:**
- ✅ Página de Timesheet
- ✅ Registros de tempo detalhados
- ✅ Relatórios de produtividade

---

### 📊 **Parte 3: Reports** (OPCIONAL)
**Arquivo:** `schemas/03-reports.sql`
**Requer:** Partes 1 e 2 executadas

**O que inclui:**
- Views avançadas para relatórios
- Relatórios por consultor, cliente, período
- Métricas de performance
- Função para relatórios personalizados

**Suporta:**
- ✅ Página de Reports
- ✅ Relatórios avançados
- ✅ Análises detalhadas

---

### 💰 **Parte 4: Financial** (OPCIONAL)
**Arquivo:** `schemas/04-financial.sql`
**Requer:** Partes 1, 2 e 3 executadas

**O que inclui:**
- Tabela `financial_transactions`
- Gestão de pagamentos e recebimentos
- Fluxo de caixa
- Geração automática de pagamentos

**Suporta:**
- ✅ Página Financial
- ✅ Controle financeiro completo
- ✅ Gestão de pagamentos

---

### 👤 **Parte 5: Usuários e Autenticação** (OPCIONAL)
**Arquivo:** `schemas/05-users-auth.sql`
**Requer:** Todas as partes anteriores

**O que inclui:**
- Sistema de usuários integrado ao Supabase Auth
- Permissões por projeto
- Row Level Security (RLS)
- Controle de acesso

**Suporta:**
- ✅ Login/logout real
- ✅ Controle de permissões
- ✅ Segurança avançada

---

## 🎯 Como Executar

### **Passo 1: Escolha o que implementar**
Você pode executar apenas as partes que precisa:

- **Mínimo:** Apenas Parte 1 (Dashboard + Projetos funcionando)
- **Básico:** Partes 1 + 2 (+ Timesheet)
- **Avançado:** Partes 1 + 2 + 3 (+ Reports)
- **Completo:** Todas as partes

### **Passo 2: Execute no Supabase**
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para **SQL Editor**
3. Crie uma **New query**
4. Copie e cole o conteúdo do arquivo desejado
5. Clique em **Run**
6. Verifique se não houve erros

### **Passo 3: Teste a funcionalidade**
- Execute `npm run dev`
- Acesse a página correspondente
- Verifique se os dados aparecem corretamente

---

## 🔍 Verificação de Problemas

### **Se der erro na execução:**
1. **Verifique a ordem:** Execute sempre na ordem correta (1 → 2 → 3 → 4 → 5)
2. **Limpe o cache:** Reinicie o servidor Next.js
3. **Verifique variáveis:** Confirme se `.env.local` está configurado
4. **Veja os logs:** Console do navegador e terminal

### **Se não aparecerem dados:**
1. **Dados de exemplo:** Cada script inclui dados de teste
2. **Configuração:** Verifique se o Supabase está conectado
3. **Permissões:** Se usar RLS (Parte 5), configure as permissões

---

## 📈 Status Atual

**✅ Implementado e testado:**
- Parte 1: Projetos Básicos
- Dashboard 100% funcional
- Gráficos com dados reais

**⏳ Próximos passos:**
Escolha qual parte implementar:

1. **Timesheet** → Para controle detalhado de horas
2. **Reports** → Para relatórios avançados  
3. **Financial** → Para gestão financeira
4. **Auth** → Para sistema multiusuário

---

## 🆘 Suporte

**Se encontrar problemas:**
1. Verifique o console do navegador (F12)
2. Veja os logs do terminal onde roda o Next.js
3. Confira se todas as tabelas foram criadas no Supabase
4. Teste com dados de exemplo primeiro

**Dicas:**
- Execute uma parte por vez
- Teste cada funcionalidade após implementar
- Mantenha backups dos dados importantes
- Use dados de exemplo para testar

---

## 🎉 Vantagens do Schema Gradativo

- ✅ **Implementação segura** - Uma funcionalidade por vez
- ✅ **Testes isolados** - Cada parte pode ser testada separadamente  
- ✅ **Flexibilidade** - Implemente apenas o que precisa
- ✅ **Manutenção fácil** - Problemas isolados por funcionalidade
- ✅ **Evolução natural** - Adicione recursos conforme a necessidade

Comece com a **Parte 1** e vá evoluindo conforme sua necessidade! 🚀


