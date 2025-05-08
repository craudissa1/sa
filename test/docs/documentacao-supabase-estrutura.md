# Documentação da Estrutura do Banco de Dados Supabase

## Visão Geral

Este documento detalha a estrutura do banco de dados implementada no Supabase para o projeto "Stayback". O banco de dados foi projetado para suportar todas as funcionalidades da aplicação, incluindo gerenciamento de usuários, finanças, alimentação, saúde, sono e produtividade.

## Detalhes do Projeto Supabase

- **Nome do Projeto:** Stayback
- **ID do Projeto:** ekdygbctzcrzrqqxfszz
- **URL do Projeto:** https://ekdygbctzcrzrqqxfszz.supabase.co
- **Região:** sa-east-1
- **Versão PostgreSQL:** 15.8.1.082

## Estrutura de Tabelas

### 1. Módulo de Autenticação e Perfil

#### 1.1 Tabela: `user_profiles`

Armazena informações do perfil do usuário, incluindo preferências visuais e metas diárias.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| nome | TEXT | Nome do usuário |
| preferenciasVisuais | JSONB | Preferências visuais (altoContraste, reducaoEstimulos, textoGrande) |
| metasDiarias | JSONB | Metas diárias (horasSono, tarefasPrioritarias, coposAgua, pausasProgramadas) |
| notificacoesAtivas | BOOLEAN | Indica se as notificações estão ativas |
| pausasAtivas | BOOLEAN | Indica se as pausas programadas estão ativas |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |
| updated_at | TIMESTAMPTZ | Data e hora da última atualização |

### 2. Módulo Financeiro

#### 2.1 Tabela: `finance_categories`

Categorias para classificação de transações financeiras.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| nome | TEXT | Nome da categoria |
| cor | TEXT | Código de cor para exibição na interface |
| icone | TEXT | Nome do ícone associado à categoria |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |

#### 2.2 Tabela: `finance_transactions`

Registro de todas as transações financeiras do usuário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| data | DATE | Data da transação |
| valor | NUMERIC | Valor da transação |
| descricao | TEXT | Descrição da transação |
| categoriaId | UUID | Referência à categoria na tabela `finance_categories` |
| tipo | TEXT | Tipo da transação: 'receita' ou 'despesa' |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |

#### 2.3 Tabela: `finance_envelopes`

Sistema de envelopes para organização do orçamento.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| nome | TEXT | Nome do envelope |
| cor | TEXT | Código de cor para exibição na interface |
| valorAlocado | NUMERIC | Valor alocado para o envelope |
| valorUtilizado | NUMERIC | Valor já utilizado do envelope |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |

#### 2.4 Tabela: `finance_recurring_payments`

Gerenciamento de pagamentos recorrentes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| descricao | TEXT | Descrição do pagamento |
| valor | NUMERIC | Valor do pagamento |
| dataVencimento | TEXT | Dia do vencimento (1-31) |
| categoriaId | UUID | Referência à categoria na tabela `finance_categories` |
| proximoPagamento | DATE | Data do próximo pagamento |
| pago | BOOLEAN | Indica se o pagamento atual foi realizado |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |

### 3. Módulo de Prioridades e Tarefas

#### 3.1 Tabela: `user_priorities`

Registro das prioridades do usuário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| texto | TEXT | Descrição da prioridade |
| concluida | BOOLEAN | Indica se a prioridade foi concluída |
| data | DATE | Data da prioridade |
| tipo | TEXT | Tipo de prioridade: 'geral' ou 'concurso' |
| origemId | TEXT | Identificador de origem (para prioridades de concurso) |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |
| updated_at | TIMESTAMPTZ | Data e hora da última atualização |

#### 3.2 Tabela: `tasks`

Registro de tarefas do usuário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| texto | TEXT | Descrição da tarefa |
| concluida | BOOLEAN | Indica se a tarefa foi concluída |
| categoria | TEXT | Categoria da tarefa (início, alimentacao, estudos, saude, lazer) |
| data | DATE | Data da tarefa |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |

#### 3.3 Tabela: `time_blocks`

Blocos de tempo para organização da rotina.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| hora | TEXT | Horário do bloco |
| atividade | TEXT | Descrição da atividade |
| categoria | TEXT | Categoria da atividade (início, alimentacao, estudos, saude, lazer, nenhuma) |
| data | DATE | Data do bloco de tempo |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |

### 4. Módulo de Sono

#### 4.1 Tabela: `sleep_logs`

Registros de sono do usuário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| inicio | TIMESTAMPTZ | Data e hora de início do sono |
| fim | TIMESTAMPTZ | Data e hora de término do sono |
| qualidade | SMALLINT | Qualidade do sono (1-5) |
| notas | TEXT | Observações sobre o sono |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |
| updated_at | TIMESTAMPTZ | Data e hora da última atualização |

#### 4.2 Tabela: `sleep_reminders`

Lembretes para dormir e acordar.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| tipo | TEXT | Tipo de lembrete: 'dormir' ou 'acordar' |
| horario | TIME | Horário do lembrete |
| diasSemana | SMALLINT[] | Dias da semana (0-6, onde 0 é domingo) |
| ativo | BOOLEAN | Indica se o lembrete está ativo |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |
| updated_at | TIMESTAMPTZ | Data e hora da última atualização |

### 5. Módulo de Alimentação

#### 5.1 Tabela: `planned_meals`

Planejamento de refeições.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| horario | TEXT | Horário planejado da refeição |
| descricao | TEXT | Descrição da refeição planejada |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |

#### 5.2 Tabela: `meal_logs`

Registro de refeições realizadas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| data | DATE | Data da refeição |
| horario | TEXT | Horário da refeição |
| descricao | TEXT | Descrição da refeição |
| tipoIcone | TEXT | Tipo/ícone da refeição |
| foto_url | TEXT | URL da foto da refeição |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |

#### 5.3 Tabela: `meals`

Tabela complementar de refeições.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| hora | TEXT | Horário da refeição |
| descricao | TEXT | Descrição da refeição |
| foto | TEXT | URL da foto da refeição |
| data | DATE | Data da refeição |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |

#### 5.4 Tabela: `hydration_config`

Configuração de metas de hidratação.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| meta_diaria_copos | INTEGER | Meta diária de copos de água |
| updated_at | TIMESTAMPTZ | Data e hora da última atualização |

#### 5.5 Tabela: `hydration_logs`

Registro de consumo de água.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| data | DATE | Data do registro |
| copos_bebidos | INTEGER | Número de copos de água bebidos |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |
| updated_at | TIMESTAMPTZ | Data e hora da última atualização |

### 6. Módulo de Saúde

#### 6.1 Tabela: `medications`

Gerenciamento de medicamentos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| nome | TEXT | Nome do medicamento |
| dosagem | TEXT | Dosagem do medicamento |
| frequencia | TEXT | Frequência de uso |
| horarios | TEXT[] | Horários para tomar o medicamento |
| observacoes | TEXT | Observações sobre o medicamento |
| dataInicio | DATE | Data de início do tratamento |
| ultimaTomada | TIMESTAMPTZ | Data e hora da última tomada |
| intervalo | INTEGER | Intervalo entre doses (em horas) |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |

#### 6.2 Tabela: `mood_logs`

Registro de humor do usuário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| data | DATE | Data do registro |
| nivel | INTEGER | Nível de humor (1-5) |
| fatores | TEXT[] | Fatores que influenciaram o humor |
| notas | TEXT | Observações sobre o humor |
| created_at | TIMESTAMPTZ | Data e hora de criação do registro |

### 7. Módulo de Configurações

#### 7.1 Tabela: `user_configurations`

Configurações gerais do usuário.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária, gerada automaticamente |
| user_id | UUID | Referência ao usuário na tabela `auth.users` |
| tempoFoco | INTEGER | Tempo de foco (em minutos) |
| tempoPausa | INTEGER | Tempo de pausa (em minutos) |
| temaEscuro | BOOLEAN | Preferência por tema escuro |
| reducaoEstimulos | BOOLEAN | Preferência por redução de estímulos visuais |
| updated_at | TIMESTAMPTZ | Data e hora da última atualização |

## Segurança

Todas as tabelas possuem Row Level Security (RLS) habilitado, com políticas que garantem que os usuários só possam acessar seus próprios dados. As políticas implementadas são:

1. **Política de Leitura (SELECT)**: Usuários só podem ler seus próprios dados onde `auth.uid() = user_id`.
2. **Política de Inserção (INSERT)**: Usuários só podem inserir registros com seu próprio ID onde `auth.uid() = user_id`.
3. **Política de Atualização (UPDATE)**: Usuários só podem atualizar seus próprios dados onde `auth.uid() = user_id`.
4. **Política de Exclusão (DELETE)**: Usuários só podem excluir seus próprios dados onde `auth.uid() = user_id`.

## Relacionamentos

As principais relações entre as tabelas são:

- Todas as tabelas têm uma relação com `auth.users` através da coluna `user_id`.
- `finance_transactions` e `finance_recurring_payments` estão relacionadas com `finance_categories` através da coluna `categoriaId`.

## Funções e Triggers

1. **Função `update_updated_at()`**: Atualiza automaticamente o campo `updated_at` com o timestamp atual sempre que um registro é modificado.

2. **Triggers**: 
   - `update_user_profiles_updated_at`: Dispara a função `update_updated_at()` antes de qualquer atualização na tabela `user_profiles`.
   - `update_user_priorities_updated_at`: Dispara a função `update_updated_at()` antes de qualquer atualização na tabela `user_priorities`.
   - `update_sleep_logs_updated_at`: Dispara a função `update_updated_at()` antes de qualquer atualização na tabela `sleep_logs`.
   - `update_sleep_reminders_updated_at`: Dispara a função `update_updated_at()` antes de qualquer atualização na tabela `sleep_reminders`.
   - `update_hydration_config_updated_at`: Dispara a função `update_updated_at()` antes de qualquer atualização na tabela `hydration_config`.
   - `update_hydration_logs_updated_at`: Dispara a função `update_updated_at()` antes de qualquer atualização na tabela `hydration_logs`.
   - `update_user_configurations_updated_at`: Dispara a função `update_updated_at()` antes de qualquer atualização na tabela `user_configurations`. 