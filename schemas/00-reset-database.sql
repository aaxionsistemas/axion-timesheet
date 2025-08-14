-- 🧹 RESET DO BANCO DE DADOS
-- Execute este script para limpar tudo e começar do zero
-- MANTÉM APENAS: auth.users (sistema do Supabase)

-- ⚠️ ATENÇÃO: Este script vai APAGAR TODOS OS DADOS!
-- Execute apenas se tiver certeza!

-- 1. Remover views primeiro (dependências)
DROP VIEW IF EXISTS project_stats CASCADE;
DROP VIEW IF EXISTS detailed_project_report CASCADE;
DROP VIEW IF EXISTS monthly_report CASCADE;
DROP VIEW IF EXISTS consultant_performance_report CASCADE;
DROP VIEW IF EXISTS client_report CASCADE;
DROP VIEW IF EXISTS weekly_productivity_report CASCADE;
DROP VIEW IF EXISTS project_financial_summary CASCADE;
DROP VIEW IF EXISTS monthly_cash_flow CASCADE;
DROP VIEW IF EXISTS overdue_payments CASCADE;
DROP VIEW IF EXISTS upcoming_payments CASCADE;
DROP VIEW IF EXISTS consultant_financial_summary CASCADE;
DROP VIEW IF EXISTS timesheet_summary CASCADE;
DROP VIEW IF EXISTS monthly_consultant_hours CASCADE;
DROP VIEW IF EXISTS active_users_stats CASCADE;

-- 2. Remover funções
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_project_worked_hours() CASCADE;
DROP FUNCTION IF EXISTS generate_period_report(DATE, DATE, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS generate_consultant_payments(DATE) CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS check_user_permission(UUID, UUID, VARCHAR) CASCADE;

-- 3. Remover tabelas (ordem inversa para evitar conflitos de FK)
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS financial_transactions CASCADE;
DROP TABLE IF EXISTS project_documents CASCADE;
DROP TABLE IF EXISTS project_milestones CASCADE;
DROP TABLE IF EXISTS project_time_entries CASCADE;
DROP TABLE IF EXISTS project_team_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Tabelas que parecem ser do seu sistema antigo
DROP TABLE IF EXISTS project_attachments CASCADE;
DROP TABLE IF EXISTS project_tasks CASCADE;
DROP TABLE IF EXISTS demands CASCADE;
DROP TABLE IF EXISTS demand_time_entries CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS payment_entries CASCADE;
DROP TABLE IF EXISTS time_entry_approvals CASCADE;
DROP TABLE IF EXISTS app_settings CASCADE;
DROP TABLE IF EXISTS consultant_performance CASCADE;
DROP TABLE IF EXISTS demands_dashboard CASCADE;
DROP TABLE IF EXISTS monthly_financial CASCADE;

-- 4. Remover tipos enum
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS project_priority CASCADE;
DROP TYPE IF EXISTS milestone_status CASCADE;
DROP TYPE IF EXISTS task_status CASCADE;
DROP TYPE IF EXISTS task_priority CASCADE;

-- 5. Remover políticas RLS (se existirem)
-- As políticas são removidas automaticamente com as tabelas

-- ✅ LIMPEZA CONCLUÍDA!
-- Agora você pode executar os schemas na ordem:
-- 1. schemas/01-projects-basic.sql
-- 2. schemas/02-timesheet.sql (opcional)
-- 3. schemas/03-reports.sql (opcional)
-- 4. schemas/04-financial.sql (opcional)
-- 5. schemas/05-users-auth.sql (opcional)

-- MANTIDO:
-- ✅ auth.users (tabela do Supabase Auth)
-- ✅ auth.* (todo o sistema de autenticação)
-- ✅ storage.* (sistema de arquivos, se estiver usando)

SELECT 'Banco limpo com sucesso! Pode executar os schemas do zero.' as status;


