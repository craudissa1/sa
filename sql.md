-- Script de configuração de Row Level Security (RLS) para todas as tabelas
-- Este script é idempotente - pode ser executado múltiplas vezes com segurança

--------------------------
-- Tabela: tasks
--------------------------
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tasks - Allow own select" ON public.tasks;
CREATE POLICY "tasks - Allow own select" 
    ON public.tasks 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "tasks - Allow own insert" ON public.tasks;
CREATE POLICY "tasks - Allow own insert" 
    ON public.tasks 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tasks - Allow own update" ON public.tasks;
CREATE POLICY "tasks - Allow own update" 
    ON public.tasks 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tasks - Allow own delete" ON public.tasks;
CREATE POLICY "tasks - Allow own delete" 
    ON public.tasks 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: time_blocks
--------------------------
ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "time_blocks - Allow own select" ON public.time_blocks;
CREATE POLICY "time_blocks - Allow own select" 
    ON public.time_blocks 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "time_blocks - Allow own insert" ON public.time_blocks;
CREATE POLICY "time_blocks - Allow own insert" 
    ON public.time_blocks 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "time_blocks - Allow own update" ON public.time_blocks;
CREATE POLICY "time_blocks - Allow own update" 
    ON public.time_blocks 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "time_blocks - Allow own delete" ON public.time_blocks;
CREATE POLICY "time_blocks - Allow own delete" 
    ON public.time_blocks 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: meal_logs
--------------------------
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "meal_logs - Allow own select" ON public.meal_logs;
CREATE POLICY "meal_logs - Allow own select" 
    ON public.meal_logs 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "meal_logs - Allow own insert" ON public.meal_logs;
CREATE POLICY "meal_logs - Allow own insert" 
    ON public.meal_logs 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "meal_logs - Allow own update" ON public.meal_logs;
CREATE POLICY "meal_logs - Allow own update" 
    ON public.meal_logs 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "meal_logs - Allow own delete" ON public.meal_logs;
CREATE POLICY "meal_logs - Allow own delete" 
    ON public.meal_logs 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: medications
--------------------------
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "medications - Allow own select" ON public.medications;
CREATE POLICY "medications - Allow own select" 
    ON public.medications 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "medications - Allow own insert" ON public.medications;
CREATE POLICY "medications - Allow own insert" 
    ON public.medications 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "medications - Allow own update" ON public.medications;
CREATE POLICY "medications - Allow own update" 
    ON public.medications 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "medications - Allow own delete" ON public.medications;
CREATE POLICY "medications - Allow own delete" 
    ON public.medications 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: mood_logs
--------------------------
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mood_logs - Allow own select" ON public.mood_logs;
CREATE POLICY "mood_logs - Allow own select" 
    ON public.mood_logs 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "mood_logs - Allow own insert" ON public.mood_logs;
CREATE POLICY "mood_logs - Allow own insert" 
    ON public.mood_logs 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "mood_logs - Allow own update" ON public.mood_logs;
CREATE POLICY "mood_logs - Allow own update" 
    ON public.mood_logs 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "mood_logs - Allow own delete" ON public.mood_logs;
CREATE POLICY "mood_logs - Allow own delete" 
    ON public.mood_logs 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: user_configurations
--------------------------
ALTER TABLE public.user_configurations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_configurations - Allow own select" ON public.user_configurations;
CREATE POLICY "user_configurations - Allow own select" 
    ON public.user_configurations 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_configurations - Allow own insert" ON public.user_configurations;
CREATE POLICY "user_configurations - Allow own insert" 
    ON public.user_configurations 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_configurations - Allow own update" ON public.user_configurations;
CREATE POLICY "user_configurations - Allow own update" 
    ON public.user_configurations 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_configurations - Allow own delete" ON public.user_configurations;
CREATE POLICY "user_configurations - Allow own delete" 
    ON public.user_configurations 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: finance_categories
--------------------------
ALTER TABLE public.finance_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "finance_categories - Allow own select" ON public.finance_categories;
CREATE POLICY "finance_categories - Allow own select" 
    ON public.finance_categories 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "finance_categories - Allow own insert" ON public.finance_categories;
CREATE POLICY "finance_categories - Allow own insert" 
    ON public.finance_categories 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "finance_categories - Allow own update" ON public.finance_categories;
CREATE POLICY "finance_categories - Allow own update" 
    ON public.finance_categories 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "finance_categories - Allow own delete" ON public.finance_categories;
CREATE POLICY "finance_categories - Allow own delete" 
    ON public.finance_categories 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: finance_transactions
--------------------------
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "finance_transactions - Allow own select" ON public.finance_transactions;
CREATE POLICY "finance_transactions - Allow own select" 
    ON public.finance_transactions 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "finance_transactions - Allow own insert" ON public.finance_transactions;
CREATE POLICY "finance_transactions - Allow own insert" 
    ON public.finance_transactions 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "finance_transactions - Allow own update" ON public.finance_transactions;
CREATE POLICY "finance_transactions - Allow own update" 
    ON public.finance_transactions 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "finance_transactions - Allow own delete" ON public.finance_transactions;
CREATE POLICY "finance_transactions - Allow own delete" 
    ON public.finance_transactions 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: finance_envelopes
--------------------------
ALTER TABLE public.finance_envelopes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "finance_envelopes - Allow own select" ON public.finance_envelopes;
CREATE POLICY "finance_envelopes - Allow own select" 
    ON public.finance_envelopes 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "finance_envelopes - Allow own insert" ON public.finance_envelopes;
CREATE POLICY "finance_envelopes - Allow own insert" 
    ON public.finance_envelopes 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "finance_envelopes - Allow own update" ON public.finance_envelopes;
CREATE POLICY "finance_envelopes - Allow own update" 
    ON public.finance_envelopes 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "finance_envelopes - Allow own delete" ON public.finance_envelopes;
CREATE POLICY "finance_envelopes - Allow own delete" 
    ON public.finance_envelopes 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: finance_recurring_payments
--------------------------
ALTER TABLE public.finance_recurring_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "finance_recurring_payments - Allow own select" ON public.finance_recurring_payments;
CREATE POLICY "finance_recurring_payments - Allow own select" 
    ON public.finance_recurring_payments 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "finance_recurring_payments - Allow own insert" ON public.finance_recurring_payments;
CREATE POLICY "finance_recurring_payments - Allow own insert" 
    ON public.finance_recurring_payments 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "finance_recurring_payments - Allow own update" ON public.finance_recurring_payments;
CREATE POLICY "finance_recurring_payments - Allow own update" 
    ON public.finance_recurring_payments 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "finance_recurring_payments - Allow own delete" ON public.finance_recurring_payments;
CREATE POLICY "finance_recurring_payments - Allow own delete" 
    ON public.finance_recurring_payments 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: pomodoro_configurations
--------------------------
ALTER TABLE public.pomodoro_configurations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pomodoro_configurations - Allow own select" ON public.pomodoro_configurations;
CREATE POLICY "pomodoro_configurations - Allow own select" 
    ON public.pomodoro_configurations 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "pomodoro_configurations - Allow own insert" ON public.pomodoro_configurations;
CREATE POLICY "pomodoro_configurations - Allow own insert" 
    ON public.pomodoro_configurations 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pomodoro_configurations - Allow own update" ON public.pomodoro_configurations;
CREATE POLICY "pomodoro_configurations - Allow own update" 
    ON public.pomodoro_configurations 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pomodoro_configurations - Allow own delete" ON public.pomodoro_configurations;
CREATE POLICY "pomodoro_configurations - Allow own delete" 
    ON public.pomodoro_configurations 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: study_sessions
--------------------------
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "study_sessions - Allow own select" ON public.study_sessions;
CREATE POLICY "study_sessions - Allow own select" 
    ON public.study_sessions 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "study_sessions - Allow own insert" ON public.study_sessions;
CREATE POLICY "study_sessions - Allow own insert" 
    ON public.study_sessions 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "study_sessions - Allow own update" ON public.study_sessions;
CREATE POLICY "study_sessions - Allow own update" 
    ON public.study_sessions 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "study_sessions - Allow own delete" ON public.study_sessions;
CREATE POLICY "study_sessions - Allow own delete" 
    ON public.study_sessions 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: simulated_exams_meta
--------------------------
ALTER TABLE public.simulated_exams_meta ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "simulated_exams_meta - Allow own select" ON public.simulated_exams_meta;
CREATE POLICY "simulated_exams_meta - Allow own select" 
    ON public.simulated_exams_meta 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "simulated_exams_meta - Allow own insert" ON public.simulated_exams_meta;
CREATE POLICY "simulated_exams_meta - Allow own insert" 
    ON public.simulated_exams_meta 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "simulated_exams_meta - Allow own update" ON public.simulated_exams_meta;
CREATE POLICY "simulated_exams_meta - Allow own update" 
    ON public.simulated_exams_meta 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "simulated_exams_meta - Allow own delete" ON public.simulated_exams_meta;
CREATE POLICY "simulated_exams_meta - Allow own delete" 
    ON public.simulated_exams_meta 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: simulated_exam_attempts
--------------------------
ALTER TABLE public.simulated_exam_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "simulated_exam_attempts - Allow own select" ON public.simulated_exam_attempts;
CREATE POLICY "simulated_exam_attempts - Allow own select" 
    ON public.simulated_exam_attempts 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "simulated_exam_attempts - Allow own insert" ON public.simulated_exam_attempts;
CREATE POLICY "simulated_exam_attempts - Allow own insert" 
    ON public.simulated_exam_attempts 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "simulated_exam_attempts - Allow own update" ON public.simulated_exam_attempts;
CREATE POLICY "simulated_exam_attempts - Allow own update" 
    ON public.simulated_exam_attempts 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "simulated_exam_attempts - Allow own delete" ON public.simulated_exam_attempts;
CREATE POLICY "simulated_exam_attempts - Allow own delete" 
    ON public.simulated_exam_attempts 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: exam_questions
--------------------------
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exam_questions - Allow own select" ON public.exam_questions;
CREATE POLICY "exam_questions - Allow own select" 
    ON public.exam_questions 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "exam_questions - Allow own insert" ON public.exam_questions;
CREATE POLICY "exam_questions - Allow own insert" 
    ON public.exam_questions 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "exam_questions - Allow own update" ON public.exam_questions;
CREATE POLICY "exam_questions - Allow own update" 
    ON public.exam_questions 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "exam_questions - Allow own delete" ON public.exam_questions;
CREATE POLICY "exam_questions - Allow own delete" 
    ON public.exam_questions 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: profiles (caso especial: usa id em vez de user_id)
--------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles - Allow own select" ON public.profiles;
CREATE POLICY "profiles - Allow own select" 
    ON public.profiles 
    FOR SELECT 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles - Allow own insert" ON public.profiles;
CREATE POLICY "profiles - Allow own insert" 
    ON public.profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles - Allow own update" ON public.profiles;
CREATE POLICY "profiles - Allow own update" 
    ON public.profiles 
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles - Allow own delete" ON public.profiles;
CREATE POLICY "profiles - Allow own delete" 
    ON public.profiles 
    FOR DELETE 
    USING (auth.uid() = id);

--------------------------
-- Tabela: planned_meals
--------------------------
ALTER TABLE public.planned_meals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "planned_meals - Allow own select" ON public.planned_meals;
CREATE POLICY "planned_meals - Allow own select" 
    ON public.planned_meals 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "planned_meals - Allow own insert" ON public.planned_meals;
CREATE POLICY "planned_meals - Allow own insert" 
    ON public.planned_meals 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "planned_meals - Allow own update" ON public.planned_meals;
CREATE POLICY "planned_meals - Allow own update" 
    ON public.planned_meals 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "planned_meals - Allow own delete" ON public.planned_meals;
CREATE POLICY "planned_meals - Allow own delete" 
    ON public.planned_meals 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: hydration_config
--------------------------
ALTER TABLE public.hydration_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hydration_config - Allow own select" ON public.hydration_config;
CREATE POLICY "hydration_config - Allow own select" 
    ON public.hydration_config 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "hydration_config - Allow own insert" ON public.hydration_config;
CREATE POLICY "hydration_config - Allow own insert" 
    ON public.hydration_config 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "hydration_config - Allow own update" ON public.hydration_config;
CREATE POLICY "hydration_config - Allow own update" 
    ON public.hydration_config 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "hydration_config - Allow own delete" ON public.hydration_config;
CREATE POLICY "hydration_config - Allow own delete" 
    ON public.hydration_config 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: hydration_logs
--------------------------
ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hydration_logs - Allow own select" ON public.hydration_logs;
CREATE POLICY "hydration_logs - Allow own select" 
    ON public.hydration_logs 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "hydration_logs - Allow own insert" ON public.hydration_logs;
CREATE POLICY "hydration_logs - Allow own insert" 
    ON public.hydration_logs 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "hydration_logs - Allow own update" ON public.hydration_logs;
CREATE POLICY "hydration_logs - Allow own update" 
    ON public.hydration_logs 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "hydration_logs - Allow own delete" ON public.hydration_logs;
CREATE POLICY "hydration_logs - Allow own delete" 
    ON public.hydration_logs 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: self_knowledge_notes
--------------------------
ALTER TABLE public.self_knowledge_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "self_knowledge_notes - Allow own select" ON public.self_knowledge_notes;
CREATE POLICY "self_knowledge_notes - Allow own select" 
    ON public.self_knowledge_notes 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "self_knowledge_notes - Allow own insert" ON public.self_knowledge_notes;
CREATE POLICY "self_knowledge_notes - Allow own insert" 
    ON public.self_knowledge_notes 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "self_knowledge_notes - Allow own update" ON public.self_knowledge_notes;
CREATE POLICY "self_knowledge_notes - Allow own update" 
    ON public.self_knowledge_notes 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "self_knowledge_notes - Allow own delete" ON public.self_knowledge_notes;
CREATE POLICY "self_knowledge_notes - Allow own delete" 
    ON public.self_knowledge_notes 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: hyperfocus_projects
--------------------------
ALTER TABLE public.hyperfocus_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hyperfocus_projects - Allow own select" ON public.hyperfocus_projects;
CREATE POLICY "hyperfocus_projects - Allow own select" 
    ON public.hyperfocus_projects 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "hyperfocus_projects - Allow own insert" ON public.hyperfocus_projects;
CREATE POLICY "hyperfocus_projects - Allow own insert" 
    ON public.hyperfocus_projects 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "hyperfocus_projects - Allow own update" ON public.hyperfocus_projects;
CREATE POLICY "hyperfocus_projects - Allow own update" 
    ON public.hyperfocus_projects 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "hyperfocus_projects - Allow own delete" ON public.hyperfocus_projects;
CREATE POLICY "hyperfocus_projects - Allow own delete" 
    ON public.hyperfocus_projects 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: hyperfocus_tasks
--------------------------
ALTER TABLE public.hyperfocus_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hyperfocus_tasks - Allow own select" ON public.hyperfocus_tasks;
CREATE POLICY "hyperfocus_tasks - Allow own select" 
    ON public.hyperfocus_tasks 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "hyperfocus_tasks - Allow own insert" ON public.hyperfocus_tasks;
CREATE POLICY "hyperfocus_tasks - Allow own insert" 
    ON public.hyperfocus_tasks 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "hyperfocus_tasks - Allow own update" ON public.hyperfocus_tasks;
CREATE POLICY "hyperfocus_tasks - Allow own update" 
    ON public.hyperfocus_tasks 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "hyperfocus_tasks - Allow own delete" ON public.hyperfocus_tasks;
CREATE POLICY "hyperfocus_tasks - Allow own delete" 
    ON public.hyperfocus_tasks 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: hyperfocus_sessions
--------------------------
ALTER TABLE public.hyperfocus_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hyperfocus_sessions - Allow own select" ON public.hyperfocus_sessions;
CREATE POLICY "hyperfocus_sessions - Allow own select" 
    ON public.hyperfocus_sessions 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "hyperfocus_sessions - Allow own insert" ON public.hyperfocus_sessions;
CREATE POLICY "hyperfocus_sessions - Allow own insert" 
    ON public.hyperfocus_sessions 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "hyperfocus_sessions - Allow own update" ON public.hyperfocus_sessions;
CREATE POLICY "hyperfocus_sessions - Allow own update" 
    ON public.hyperfocus_sessions 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "hyperfocus_sessions - Allow own delete" ON public.hyperfocus_sessions;
CREATE POLICY "hyperfocus_sessions - Allow own delete" 
    ON public.hyperfocus_sessions 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: user_activities
--------------------------
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_activities - Allow own select" ON public.user_activities;
CREATE POLICY "user_activities - Allow own select" 
    ON public.user_activities 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_activities - Allow own insert" ON public.user_activities;
CREATE POLICY "user_activities - Allow own insert" 
    ON public.user_activities 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_activities - Allow own update" ON public.user_activities;
CREATE POLICY "user_activities - Allow own update" 
    ON public.user_activities 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_activities - Allow own delete" ON public.user_activities;
CREATE POLICY "user_activities - Allow own delete" 
    ON public.user_activities 
    FOR DELETE 
    USING (auth.uid() = user_id);

--------------------------
-- Tabela: favorite_suggestions
--------------------------
ALTER TABLE public.favorite_suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorite_suggestions - Allow own select" ON public.favorite_suggestions;
CREATE POLICY "favorite_suggestions - Allow own select" 
    ON public.favorite_suggestions 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorite_suggestions - Allow own insert" ON public.favorite_suggestions;
CREATE POLICY "favorite_suggestions - Allow own insert" 
    ON public.favorite_suggestions 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorite_suggestions - Allow own update" ON public.favorite_suggestions;
CREATE POLICY "favorite_suggestions - Allow own update" 
    ON public.favorite_suggestions 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorite_suggestions - Allow own delete" ON public.favorite_suggestions;
CREATE POLICY "favorite_suggestions - Allow own delete" 
    ON public.favorite_suggestions 
    FOR DELETE