This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info

# Directory Structure
```
docs/
  reports/
    020#feat#verificar_itens_concluidos_report.md
    040#feat#identificar_divergencias_report.md
    070#docs#documentar_divergencias_modulos_pessoais_report.md
    090#docs#documentar_divergencias_modulos_produtividade_report.md
  specs/
    030#feat#identificar_itens_pendentes_spec.md
    040#feat#identificar_divergencias_spec.md
  tasks/
    010#chore#analisar_todo_e_estado_projeto.json
    010#docs#implementar_REC_001.json
    020#feat#verificar_itens_concluidos.json
    020#test#implementar_REC_002.json
    030#feat#identificar_itens_pendentes.json
    040#feat#identificar_divergencias.json
    050#chore#refine_implementar_REC_002.json
    050#docs#elaborar_relatorio_auditoria.json
    060#chore#analisar_codigo_modulos_pessoais.json
    060#chore#refine_implementar_REC_002.json
    070#docs#documentar_divergencias_modulos_pessoais.json
    080#chore#analisar_codigo_modulos_produtividade.json
    090#docs#documentar_divergencias_modulos_produtividade.json
    100#chore#analisar_codigo_modulo_financas.json
    110#docs#documentar_divergencia_modulo_financas.json
    120#chore#analisar_codigo_modulo_receitas.json
    130#docs#documentar_divergencia_modulo_receitas.json
    140#chore#analisar_codigo_funcionalidades_centrais.json
    150#docs#documentar_divergencias_funcionalidades_centrais.json
    160#chore#consolidar_relatorio_divergencias.json
  analise_funcionalidades_centrais.md
  analise_modulo_receitas.md
  api_autenticacao.md
  divergencia_modulo_financas.md
  divergencia_modulo_receitas.md
  exemplo-receita-unica.json
  exemplo-receitas-multiplas.json
  guia-receitas.md
  receita-plan.md
```

# Files

## File: docs/reports/020#feat#verificar_itens_concluidos_report.md
````markdown
# Relatório de Validação da Implementação da Arquitetura Supabase

**Tarefa Validada:** Implementação da Arquitetura Supabase conforme `todo.md`.
**ID da Tarefa de Validação:** `020#feat#verificar_itens_concluidos`
**Data da Validação:** 06/05/2025

## Itens Verificados do `todo.md`:

### 1. Supabase Auth: Gerenciamento completo de autenticação (registro, login email/senha, login social Google, logout, gerenciamento de sessão JWT).

*   **Status:** Concluído
*   **Justificativa:** A análise do código revelou a implementação das funcionalidades de autenticação utilizando o SDK do Supabase.
*   **Evidências:**
    *   **Inicialização do Cliente:** [`app/lib/supabaseClient.ts:1`](app/lib/supabaseClient.ts:1), [`app/lib/supabaseClient.ts:10`](app/lib/supabaseClient.ts:10)
    *   **Login Email/Senha:** [`app/auth/login/page.tsx:22-25`](app/auth/login/page.tsx:22-25)
    *   **Login Social (Google):** [`app/auth/login/page.tsx:42-47`](app/auth/login/page.tsx:42-47)
    *   **Registro Email/Senha:** [`app/auth/signup/page.tsx:30-32`](app/auth/signup/page.tsx:30-32)
    *   **Callback OAuth:** [`app/auth/callback/route.ts:13`](app/auth/callback/route.ts:13) (uso de `exchangeCodeForSession`)
    *   **Gerenciamento de Sessão (JWT implícito):** [`app/context/AuthContext.tsx:25`](app/context/AuthContext.tsx:25) (`getSession`), [`app/context/AuthContext.tsx:36`](app/context/AuthContext.tsx:36) (`onAuthStateChange`)
    *   **Logout:** [`app/context/AuthContext.tsx:47-48`](app/context/AuthContext.tsx:47-48) (`signOut`)

### 2. Supabase Database: Banco de dados PostgreSQL para armazenamento de dados.

*   **Status:** Não Concluído / Não Verificável
*   **Justificativa:** Nenhuma evidência de código utilizando o SDK do Supabase para interagir com tabelas do banco de dados (operações como `select`, `insert`, `update`, `delete`) foi encontrada nos arquivos do projeto após buscas por padrões comuns (`.from('tabela').select()`, etc.). Os dados da aplicação parecem ser gerenciados em memória (Zustand) e persistidos/recuperados localmente através do [`app/lib/dataService.ts`](app/lib/dataService.ts), sem indicação de integração com o Supabase Database para persistência remota.
*   **Evidências:**
    *   Ausência de resultados nas buscas por:
        *   `\.from\s*\(\s*['"\`][a-zA-Z0-9_]+['"\`]\s*\)\s*\.(select|insert|update|delete|upsert)`
        *   `supabase\.from\s*\(\s*['"\`][a-zA-Z0-9_]+['"\`]\s*\)`
    *   O arquivo [`app/lib/dataService.ts`](app/lib/dataService.ts) foca em importação/exportação de dados de/para arquivos JSON locais, utilizando o estado das stores Zustand, sem chamadas diretas ao Supabase para persistência.

### 3. Supabase Realtime: Sincronização de dados em tempo real.

*   **Status:** Não Concluído
*   **Justificativa:** Nenhuma evidência de código utilizando as funcionalidades de Realtime do Supabase (como `supabase.channel()` ou `supabase.realtime().on('postgres_changes', ...)`) foi encontrada nos arquivos do projeto.
*   **Evidências:**
    *   Ausência de resultados na busca por: `supabase\.(channel|realtime\(\s*['"\`][a-zA-Z0-9_]+['"\`]\s*\)\.on\s*\(\s*['"\`]postgres_changes['"\`]\s*,)`

### 4. Supabase Client Library (supabase-js): SDK para interação com Supabase no frontend/backend.

*   **Status:** Concluído
*   **Justificativa:** O SDK `@supabase/supabase-js` é importado e o cliente Supabase é inicializado e utilizado para as funcionalidades de autenticação.
*   **Evidências:**
    *   [`app/lib/supabaseClient.ts:1`](app/lib/supabaseClient.ts:1): `import { createClient } from '@supabase/supabase-js';`
    *   [`app/lib/supabaseClient.ts:10`](app/lib/supabaseClient.ts:10): `export const supabase = createClient(supabaseUrl, supabaseAnonKey);`
    *   Uso do objeto `supabase` importado nos arquivos de autenticação listados no item 1.

## Conclusão Geral da Validação:

A integração com Supabase Auth e o uso do Client SDK estão bem estabelecidos e implementados. No entanto, a utilização do Supabase Database para persistência dos dados da aplicação e a implementação de funcionalidades Realtime não puderam ser confirmadas através da análise de código e parecem não estar implementadas no estado atual do projeto.
````

## File: docs/reports/040#feat#identificar_divergencias_report.md
````markdown
# Relatório Consolidado de Divergências: Código vs. `todo.md`

## Introdução

Este relatório consolida as análises de divergências entre o código-fonte existente do projeto e o escopo inicialmente definido no arquivo `todo.md`. O objetivo é fornecer uma visão unificada das funcionalidades e módulos que foram desenvolvidos mas não estavam previstos ou detalhados no documento de planejamento original. Esta análise é um resultado da tarefa `040#feat#identificar_divergencias` e suas sub-tarefas de documentação.

O arquivo `todo.md` original, que serviu como base para a identificação das divergências, possui o seguinte conteúdo:

```
1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1.
```

O processo de identificação de divergências, conforme detalhado na especificação ([`.state/specs/040#feat#identificar_divergencias_spec.md`](.state/specs/040#feat#identificar_divergencias_spec.md)), consistiu na comparação direta entre este `todo.md` e a estrutura de arquivos e funcionalidades observadas no código.

## Sumário das Principais Áreas de Divergência

A análise revelou que a vasta maioria das funcionalidades de domínio da aplicação não está descrita no `todo.md`, que se concentra exclusivamente na infraestrutura básica do Supabase. As principais áreas de divergência incluem:

*   Módulos de Gerenciamento Pessoal
*   Módulos de Produtividade e Estudos
*   Módulo de Finanças
*   Módulo de Receitas
*   Funcionalidades Centrais e Estruturais (Dashboard, Perfil, UI de Autenticação, Biblioteca de UI, Gerenciamento de Estado, etc.)

A seguir, cada uma dessas áreas é detalhada.

---

## Detalhamento das Divergências por Módulo/Área

### 1. Módulos de Gerenciamento Pessoal

Esta seção consolida as divergências identificadas nos módulos de Alimentação, Autoconhecimento, Saúde, Sono e Lazer, com base no relatório [`.state/reports/070#docs#documentar_divergencias_modulos_pessoais_report.md`](.state/reports/070#docs#documentar_divergencias_modulos_pessoais_report.md).

**Hipótese Geral da Origem das Divergências (Módulos Pessoais):**
A maioria dos módulos de Gerenciamento Pessoal parece ser parte do escopo funcional principal de uma aplicação de bem-estar/produtividade. Este escopo não foi refletido no `todo.md` inicial, que se concentrava apenas na infraestrutura Supabase. O desenvolvimento provavelmente seguiu um plano funcional mais amplo, não documentado no `todo.md` analisado.

#### 1.1. Módulo: Alimentação

*   **Descrição da Funcionalidade Implementada:**
    *   Acompanhamento de hidratação: definição de meta diária, registro de copos consumidos e visualização do progresso.
    *   Planejamento de refeições: CRUD de refeições planejadas (horário, descrição).
    *   Registro de refeições consumidas: CRUD para refeições realizadas (horário, descrição, tipo/ícone, URL de foto simulada).
*   **Comparativo com o `todo.md`:**
    *   **Ausência Completa:** Nenhuma funcionalidade relacionada à alimentação mencionada.
    *   **Alinhamento com Supabase:** Utiliza Supabase para persistência, alinhado com a diretriz arquitetural.
*   **Origem Provável da Divergência:**
    *   Requisito funcional essencial para app de bem-estar, definido em escopo de produto mais detalhado.
*   **Análise de Impacto:**
    *   **Positivo:** Agrega valor ao usuário, torna a aplicação mais robusta.
    *   **Negativo:** Escopo de desenvolvimento considerável não previsto, potencial impacto em cronograma/recursos se o `todo.md` fosse o único guia.

#### 1.2. Módulo: Autoconhecimento

*   **Descrição da Funcionalidade Implementada:**
    *   Criação e edição de notas categorizadas (seções, título, conteúdo, tags, URL de imagem).
    *   Listagem, busca e remoção de notas.
    *   "Modo Refúgio": interface simplificada para foco.
*   **Comparativo com o `todo.md`:**
    *   **Ausência Completa:** Nenhuma funcionalidade de journaling ou autoconhecimento mencionada.
    *   **Alinhamento com Supabase:** Utiliza Supabase para persistir notas.
*   **Origem Provável da Divergência:**
    *   Funcionalidade central para desenvolvimento pessoal, parte de um escopo de produto mais amplo.
*   **Análise de Impacto:**
    *   **Positivo:** Oferece espaço valioso para reflexão, pode ser um diferencial.
    *   **Negativo:** Adicionou escopo de desenvolvimento não contabilizado, requer considerações de privacidade e backup para conteúdo gerado pelo usuário.

#### 1.3. Módulo: Saúde

*   **Descrição da Funcionalidade Implementada:**
    *   **Monitoramento de Humor:** Registro diário (nível, fatores, notas), visualização em calendário e estatísticas.
    *   **Registro de Medicamentos:** Cadastro (nome, dosagem, frequência, etc.), registro de doses, listagem com status.
*   **Comparativo com o `todo.md`:**
    *   **Ausência Completa:** Nenhuma funcionalidade de monitoramento de humor ou medicamentos mencionada.
    *   **Alinhamento com Supabase:** Persistência inferida como via Supabase.
*   **Origem Provável da Divergência:**
    *   Funcionalidades essenciais para app de saúde/bem-estar, de um planejamento de produto mais detalhado.
*   **Análise de Impacto:**
    *   **Positivo:** Ferramentas úteis para autocuidado, potencial para alto engajamento.
    *   **Negativo:** Esforço de desenvolvimento significativo não previsto, lida com dados sensíveis (exigindo atenção com segurança/privacidade/LGPD), adiciona complexidade.

#### 1.4. Módulo: Sono

*   **Descrição da Funcionalidade Implementada:**
    *   Registro de sono (início, fim, qualidade, notas, cálculo de duração).
    *   Configuração de lembretes para dormir/acordar.
    *   Visualizador semanal de sono (gráfico, estatísticas).
*   **Comparativo com o `todo.md`:**
    *   **Ausência Completa:** Nenhuma funcionalidade de monitoramento de sono mencionada.
    *   **Divergência de Persistência:** Utiliza `localStorage` (via Zustand persist middleware), divergindo da diretriz de usar Supabase Database.
*   **Origem Provável da Divergência:**
    *   **Funcionalidade:** Comum em apps de bem-estar.
    *   **Persistência Local:** Decisão por simplicidade, funcionamento offline básico, ou para evitar complexidade/custos de sincronização com Supabase para dados considerados menos críticos.
*   **Análise de Impacto:**
    *   **Positivo:** Ajuda usuários a melhorarem hábitos de sono, simplicidade do `localStorage` pode ter acelerado desenvolvimento.
    *   **Negativo:** Adiciona escopo funcional não previsto. Inconsistência de persistência (`localStorage`) leva a: perda de dados, falta de sincronização, dificuldade de backup, impede análise agregada de dados. Contaria a estratégia de centralização de dados no Supabase.

#### 1.5. Módulo: Lazer

*   **Descrição da Funcionalidade Implementada:**
    *   Registro de atividades de lazer (CRUD, categoria, duração, data, observações, status, estatísticas).
    *   Sugestões de descanso (aleatórias, categorizadas, favoritos).
    *   Temporizador de lazer (configurável, presets, alerta).
*   **Comparativo com o `todo.md`:**
    *   **Ausência Completa:** Nenhuma funcionalidade de gerenciamento de lazer mencionada.
    *   **Divergência Parcial de Persistência:** Atividades usam Supabase; sugestões favoritas usam `localStorage`.
*   **Origem Provável da Divergência:**
    *   **Funcionalidade:** Complementar para bem-estar, de escopo de produto mais amplo.
    *   **Persistência Mista:** `localStorage` para favoritos por simplicidade ou dados menos críticos.
*   **Análise de Impacto:**
    *   **Positivo:** Incentiva lazer e descanso, pode aumentar tempo de uso.
    *   **Negativo:** Adiciona escopo não previsto. Inconsistência de persistência (`localStorage` para favoritos) leva a: perda de dados, falta de sincronização. Múltiplas estratégias de persistência aumentam complexidade de manutenção.

---

### 2. Módulos de Produtividade e Estudos

Esta seção consolida as divergências identificadas nos módulos de Estudos, Concursos e Hiperfocos, com base no relatório [`.state/reports/090#docs#documentar_divergencias_modulos_produtividade_report.md`](.state/reports/090#docs#documentar_divergencias_modulos_produtividade_report.md).

#### 2.1. Módulo: Estudos

*   **Descrição da Funcionalidade:**
    *   **Registro de Sessões de Estudo:** CRUD e estatísticas.
    *   **Temporizador Pomodoro:** Ciclos configuráveis.
    *   **Visualizador de Materiais:** Checklist, Markdown, busca local, possível integração Google Drive.
    *   **Simulados:** Carregar JSON, gerar de banco de questões, realizar, resultados, histórico.
*   **Comparativo com `todo.md`:**
    *   Ausência completa de menção ao Módulo de Estudos ou suas funcionalidades.
*   **Origem Provável:**
    *   Desenvolvimento customizado, foco em ferramentas de produtividade para estudantes.
*   **Análise de Impacto:**
    *   **Positivo:** Agrega valor substancial, aumenta engajamento, potencial de diferenciação.
    *   **Negativo/Riscos:** Esforço não previsto (Médio a Alto), manutenção contínua, dependências (Google Drive), complexidade da base de código.

#### 2.2. Módulo: Concursos

*   **Descrição da Funcionalidade:**
    *   **Gerenciamento de Concursos:** CRUD, conteúdo programático.
    *   **Gerenciamento de Questões:** CRUD, associação a concursos.
    *   **Geração de Contexto de Concurso:** LLM simulado no frontend ou importação JSON.
    *   **Geração de Questões:** Integração com API Perplexity AI (`/api/gerar-questao`), importação.
    *   **Importação de Concurso:** Via JSON.
*   **Comparativo com `todo.md`:**
    *   Ausência completa de menção, especialmente funcionalidades com LLMs e APIs externas.
*   **Origem Provável:**
    *   Desenvolvimento customizado com funcionalidades de IA.
*   **Análise de Impacto:**
    *   **Positivo:** Inovação (LLMs), valor elevado para o nicho, automatização.
    *   **Negativo/Riscos:** Esforço e complexidade elevados (Alto), dependência de APIs externas (custos, riscos), qualidade do conteúdo gerado por IA, custos operacionais, manutenção de integrações.

#### 2.3. Módulo: Hiperfocos

*   **Descrição da Funcionalidade:**
    *   **Conversor de Interesses:** Transforma ideias em projetos de hiperfoco estruturados.
    *   **Visualizador de Projetos em Árvore:** Estrutura hierárquica (CRUD).
    *   **Sistema de Alternância:** Gerencia transições entre hiperfocos.
    *   **Temporizador de Foco:** Específico para sessões de hiperfoco.
*   **Comparativo com `todo.md`:**
    *   Ausência completa de menção.
*   **Origem Provável:**
    *   Desenvolvimento customizado para gerenciamento de foco profundo.
*   **Análise de Impacto:**
    *   **Positivo:** Atende necessidade específica, diferencial de nicho, estrutura para projetos pessoais.
    *   **Negativo/Riscos:** Esforço e complexidade elevados (Alto), adoção pelo usuário pode ser restrita, manutenção de lógica de projeto, integração com outros módulos.

---

### 3. Módulo de Finanças

Esta seção baseia-se no relatório [`docs/divergencia_modulo_financas.md`](docs/divergencia_modulo_financas.md).

*   **Descrição da Funcionalidade Existente:**
    *   **Adicionar Despesa:** Registro com descrição, valor, categoria.
    *   **Calendário de Pagamentos:** Gerencia pagamentos recorrentes, visualização mensal, adicionar novos, marcar como pagos/não pagos, destaque para pagamentos do dia/atrasados.
    *   **Envelopes Virtuais:** Criação e gerenciamento de envelopes para orçamento (CRUD), registro de gastos, visualização de progresso.
    *   **Rastreador de Gastos:** Visualiza despesas por categoria (gráfico de pizza, lista), calcula totais e percentuais.
    *   **Estrutura de Dados e Store:** Tipos (`Categoria`, `Transacao`, `Envelope`, `PagamentoRecorrente`), estado gerenciado (Zustand), CRUD completo, integração com Supabase (`finance_categories`, `finance_transactions`, etc.).
*   **Comparativo com `todo.md`:**
    *   **Escopo Detalhado vs. Geral:** `todo.md` foca na infraestrutura Supabase, sem detalhar módulos funcionais.
    *   **Ausência do Módulo de Finanças:** Nenhuma menção explícita no `todo.md`.
*   **Hipótese de Origem da Funcionalidade:**
    *   Funcionalidade central de um app de gerenciamento financeiro pessoal.
    *   Desenvolvido com Supabase (alinhado com `todo.md`) e frontend moderno (React/Next.js, Zustand).
    *   Implementa sistema multiusuário.
    *   Sugere-se que foi desenvolvido como parte essencial, mesmo não detalhado no `todo.md`.
*   **Impacto da Divergência:**
    *   **Valor Agregado (Positivo):** Módulo robusto e funcional já presente.
    *   **Necessidade de Atualização da Documentação:** Crucial atualizar `todo.md` ou outros documentos de escopo.
    *   **Considerações para Planejamento Futuro:** Esforço de entendimento, refatoração e expansão deve ser incorporado.
    *   **Manutenção e Dependências:** Requer manutenção contínua.
    *   **Alinhamento de Expectativas:** Documentação atualizada garante clareza para stakeholders.

---

### 4. Módulo de Receitas

Esta seção baseia-se no relatório [`docs/divergencia_modulo_receitas.md`](docs/divergencia_modulo_receitas.md).

*   **Descrição da Funcionalidade Existente:**
    *   **Gerenciamento de Receitas:** Adicionar (formulário detalhado: nome, descrição, categorias, tags, tempo, porções, calorias, imagem, ingredientes, passos), editar, remover.
    *   **Visualização e Descoberta:** Listagem (cards), filtros (categoria), pesquisa (nome, ingredientes), visualização detalhada (ajuste de ingredientes por porção, favoritar).
    *   **Funcionalidades Auxiliares:** Importação (JSON), Geração de Lista de Compras agregada (ajuste de porções, marcação de itens).
    *   **Gerenciamento de Estado:** Zustand (`receitasStore.ts`) para CRUD e favoritos, persistência em `localStorage`.
*   **Comparativo com o `todo.md`:**
    *   **Divergência Completa:** `todo.md` não faz menção a um módulo de gerenciamento de receitas.
*   **Origem da Divergência:**
    *   **Desenvolvimento Planejado à Parte ou Ad-hoc:** Desenvolvido intencionalmente, não documentado no `todo.md` inicial.
    *   **Desenvolvimento Customizado:** Estrutura coesa e complexidade sugerem esforço customizado significativo.
*   **Impacto da Divergência:**
    *   **Positivo:** Valor agregado ao usuário, base para expansão.
    *   **Negativo/Riscos:** Desalinhamento com planejamento inicial, consumo de recursos não previsto (esforço considerável), manutenção e evolução podem não estar contempladas, documentação central (`todo.md`) severamente desatualizada.

---

### 5. Funcionalidades Centrais e Estruturais

Esta seção consolida as divergências identificadas em funcionalidades que dão suporte à aplicação como um todo, com base no relatório [`docs/divergencias_funcionalidades_centrais.md`](docs/divergencias_funcionalidades_centrais.md).

#### 5.1. Dashboard/Início

*   **Descrição:** `PainelDia`, `ListaPrioridades`, `ChecklistMedicamentos`, `LembretePausas`, `ProximaProvaCard`, página principal integradora.
*   **Comparativo com `todo.md`:** Nenhuma menção a funcionalidades de Dashboard.
*   **Impacto:** Essencial para usabilidade, mas ausência no `todo.md` indica planejamento incompleto. Esforço de desenvolvimento significativo.

#### 5.2. Perfil do Usuário

*   **Descrição:** `InformacoesPessoais`, `MetasDiarias`, `PreferenciasVisuais`, página de perfil.
*   **Comparativo com `todo.md`:** Nenhuma menção a funcionalidades de perfil.
*   **Impacto:** Permite personalização, melhora engajamento. Esforço moderado não contabilizado.

#### 5.3. Interface de Autenticação (UI)

*   **Descrição:** Páginas de Login, Signup, Callback OAuth, `AuthContext`.
*   **Comparativo com `todo.md`:** `todo.md` menciona "Supabase Auth" mas não detalha UI/UX frontend.
*   **Impacto:** Fundamental para acesso. Esforço moderado para UI/contexto além da simples integração do serviço.

#### 5.4. Biblioteca de Componentes de UI

*   **Descrição:** Conjunto de componentes reutilizáveis (botões, cards, inputs, etc.), provavelmente baseada em Shadcn/ui.
*   **Comparativo com `todo.md`:** Nenhuma menção à criação/uso de biblioteca de UI.
*   **Impacto:** Garante consistência, acelera desenvolvimento. Esforço significativo não previsto.

#### 5.5. Gerenciamento de Estado com Zustand

*   **Descrição:** Múltiplas stores para estado global/local, lógica de interação com Supabase, store centralizada (`app/store/index.ts`).
*   **Comparativo com `todo.md`:** Nenhuma especificação de biblioteca de gerenciamento de estado ou arquitetura de stores.
*   **Impacto:** Permite gerenciamento eficiente e escalável. Esforço de desenvolvimento alto não previsto.

#### 5.6. Exportar/Importar Dados

*   **Descrição:** Componente simplificado informando sobre sincronização automática via Supabase; funcionalidade original removida/despriorizada.
*   **Comparativo com `todo.md`:** Nenhuma menção a exportar/importar dados.
*   **Impacto:** Baixo na forma atual. Se a intenção original era mais completa, sua ausência é uma divergência.

#### 5.7. ThemeProvider

*   **Descrição:** Alternar temas (light/dark/system), detecta preferência do SO, salva em `localStorage`.
*   **Comparativo com `todo.md`:** Nenhuma menção a sistema de temas.
*   **Impacto:** Melhora UX e acessibilidade. Esforço moderado não previsto.

---

## Conclusão Geral

O arquivo `todo.md`, em seu estado atual, é significativamente defasado e não reflete a amplitude e a profundidade das funcionalidades implementadas no projeto. A grande maioria dos módulos e componentes que constituem a aplicação real não possui qualquer documentação correspondente no `todo.md`, que se limita a descrever a infraestrutura básica do Supabase.

As divergências identificadas abrangem desde módulos de domínio completos (Gerenciamento Pessoal, Produtividade, Finanças, Receitas) até funcionalidades estruturais críticas (Dashboard, Perfil, Gerenciamento de Estado, Biblioteca de UI). Embora muitas dessas funcionalidades utilizem Supabase para persistência, alinhando-se parcialmente com a visão técnica do `todo.md`, o escopo funcional implementado é vastamente superior ao que foi documentado inicialmente.

Alguns módulos, como Sono e Lazer (parcialmente), apresentam divergências adicionais ao utilizarem `localStorage` para persistência de dados, o que contraria a estratégia de centralização de dados no Supabase definida no `todo.md`.

**Impactos Principais:**

*   **Valor Agregado:** A aplicação possui um conjunto rico de funcionalidades que agregam valor significativo ao usuário, muito além do que o `todo.md` sugeriria.
*   **Desalinhamento Documental:** Existe um sério desalinhamento entre a documentação de planejamento (`todo.md`) e o produto desenvolvido. Isso dificulta o onboarding de novos membros na equipe, a tomada de decisões estratégicas baseadas em documentação e o planejamento de futuras evoluções.
*   **Recursos e Esforço:** Um volume considerável de esforço de desenvolvimento foi investido em funcionalidades não previstas no `todo.md`.
*   **Manutenção e Evolução:** A manutenção e a evolução dessas funcionalidades não documentadas podem se tornar um desafio se não forem devidamente incorporadas ao planejamento e à documentação do projeto.

**Recomendação Urgente:**
É crucial e urgente que o `todo.md` seja drasticamente revisado e expandido, ou substituído por uma documentação de arquitetura e escopo de produto mais abrangente e detalhada. Esta nova documentação deve refletir com precisão o estado atual do projeto, incluindo todas as funcionalidades implementadas, as decisões de design e arquitetura (como o uso de `localStorage` em certos contextos), e servir como uma base confiável para o desenvolvimento e manutenção futuros.
````

## File: docs/reports/070#docs#documentar_divergencias_modulos_pessoais_report.md
````markdown
## 1. Módulo: Alimentação

**1.1. Descrição da Funcionalidade Implementada:**
O módulo de Alimentação permite:
*   Acompanhamento de hidratação: definição de meta diária, registro de copos consumidos e visualização do progresso.
*   Planejamento de refeições: criação, visualização, atualização e exclusão (CRUD) de refeições planejadas, com especificação de horário e descrição.
*   Registro de refeições consumidas: CRUD para refeições realizadas, incluindo horário, descrição, tipo/ícone e uma URL simulada para foto.

**1.4. Análise de Impacto:**
*   **Positivo:**
    *   **Valor para o Usuário:** Agrega valor significativo ao usuário, oferecendo ferramentas práticas para o gerenciamento da alimentação e hidratação.
    *   **Completude da Aplicação:** Torna a aplicação mais robusta e alinhada com as expectativas de um app de bem-estar.

---

## 2. Módulo: Autoconhecimento

**2.1. Descrição da Funcionalidade Implementada:**
O módulo de Autoconhecimento oferece:
*   Criação e edição de notas categorizadas por seções ("Quem sou", "Meus porquês", "Meus padrões"), permitindo título, conteúdo, tags e URL de imagem.
*   Listagem, busca e remoção de notas.
*   "Modo Refúgio": uma interface simplificada para foco.



**2.4. Análise de Impacto:**
*   **Positivo:**
    *   **Valor para o Usuário:** Oferece um espaço valioso para reflexão e organização de pensamentos, contribuindo para o bem-estar mental do usuário.
    *   **Diferencial:** Pode ser um diferencial da aplicação, promovendo o engajamento.
    *   **Manutenção:** A gestão de conteúdo gerado pelo usuário (notas) requer considerações de privacidade e backup.

---

## 3. Módulo: Saúde

**3.1. Descrição da Funcionalidade Implementada:**
O módulo de Saúde inclui:
*   **Monitoramento de Humor:** Registro diário de nível de humor, fatores influenciadores e notas. Visualização em calendário e estatísticas (média, tendência, fatores comuns).
*   **Registro de Medicamentos:** Cadastro de medicamentos (nome, dosagem, frequência, horários, intervalo, etc.), registro de doses tomadas e listagem com status e próxima dose.


**3.4. Análise de Impacto:**
*   **Positivo:**
    *   **Valor para o Usuário:** Ferramentas extremamente úteis para o autocuidado, acompanhamento da saúde mental e adesão a tratamentos médicos.
    *   **Engajamento:** Potencial para alto engajamento do usuário devido à natureza pessoal e relevante das funcionalidades.
*   **Negativo:**
    *   **Recursos e Cronograma:** Representa um esforço de desenvolvimento significativo (dois submódulos complexos) não previsto.
    *   **Sensibilidade dos Dados:** Lida com dados de saúde sensíveis, exigindo atenção redobrada com segurança, privacidade e conformidade (ex: LGPD).
    *   **Complexidade:** A lógica de cálculo de próxima dose e estatísticas de humor adiciona complexidade.

---

## 4. Módulo: Sono

**4.1. Descrição da Funcionalidade Implementada:**
O módulo de Sono permite:
*   Registro de sono: horário de início e fim, qualidade percebida e notas adicionais, com cálculo automático da duração.
*   Configuração de lembretes para dormir e acordar: definição de horário, dias da semana e ativação/desativação.
*   Visualizador semanal de sono: gráfico de horas dormidas e estatísticas (média, melhor/pior noite).

**4.4. Análise de Impacto:**
*   **Positivo:**
    *   **Valor para o Usuário:** Ajuda os usuários a entenderem e melhorarem seus hábitos de sono.
    *   **Simplicidade (Local Storage):** Pode ter acelerado o desenvolvimento inicial do módulo e permitir o uso offline básico.
*   **Negativo:**
    *   **Recursos e Cronograma:** Adiciona escopo funcional não previsto.
    *   **Inconsistência de Persistência (Local Storage):**
        *   **Perda de Dados:** Dados armazenados localmente podem ser perdidos se o usuário limpar o cache do navegador ou trocar de dispositivo.
        *   **Sincronização:** Não há sincronização entre dispositivos, limitando a experiência do usuário.
        *   **Backup:** Dificulta o backup centralizado dos dados do usuário.
        *   **Análise de Dados:** Impede a análise agregada de dados de sono no backend, caso fosse um requisito futuro.
    *   **Alinhamento Estratégico:** A escolha por `localStorage` para dados persistentes do usuário contraria a estratégia de centralização de dados no Supabase definida no `todo.md`.

---

## 5. Módulo: Lazer

**5.1. Descrição da Funcionalidade Implementada:**
O módulo de Lazer oferece:
*   Registro de atividades de lazer: CRUD para atividades, com categoria, duração, data, observações e status de conclusão. Inclui estatísticas básicas.
*   Sugestões de descanso: Apresenta sugestões aleatórias e categorizadas, com um sistema de favoritos.
*   Temporizador de lazer: Configurável com presets e alerta sonoro.

**5.4. Análise de Impacto:**
*   **Positivo:**
    *   **Valor para o Usuário:** Incentiva o usuário a dedicar tempo ao lazer e descanso, fornecendo ferramentas para planejamento e descoberta.
    *   **Engajamento:** Pode aumentar o tempo de uso da aplicação.
*   **Negativo:**
    *   **Recursos e Cronograma:** Adiciona escopo funcional e de desenvolvimento não previsto.
    *   **Inconsistência de Persistência (Local Storage para Favoritos):**
        *   **Perda de Dados:** Favoritos podem ser perdidos.
        *   **Sincronização:** Favoritos não sincronizados entre dispositivos.
        *   **Complexidade de Gerenciamento:** Ter múltiplas estratégias de persistência (Supabase e `localStorage`) pode aumentar a complexidade de manutenção e entendimento do fluxo de dados da aplicação a longo prazo.
````

## File: docs/reports/090#docs#documentar_divergencias_modulos_produtividade_report.md
````markdown
## Módulo: Estudos

### 1. Descrição da Funcionalidade

O Módulo de Estudos oferece um conjunto de ferramentas para auxiliar os usuários em suas atividades de aprendizado:
*   **Registro de Sessões de Estudo:** Permite o acompanhamento de sessões de estudo, incluindo funcionalidades de CRUD (Criar, Ler, Atualizar, Deletar) e a visualização de estatísticas de estudo.
*   **Temporizador Pomodoro:** Implementa a técnica Pomodoro com ciclos configuráveis para gerenciamento de tempo e foco durante os estudos.
*   **Visualizador de Materiais:** Capacidade de visualizar materiais de estudo em formatos como Checklist e Markdown. Inclui funcionalidade de busca em arquivos locais e, potencialmente, integração com Google Drive (inferida a partir da análise de código).
*   **Simulados:** Funcionalidade robusta para realização de simulados, permitindo carregar simulados a partir de arquivos JSON, gerar a partir de um banco de questões, realizar as provas, visualizar resultados detalhados e manter um histórico de tentativas.

### 4. Análise de Impacto

*   **Positivo:**
    *   Agrega valor substancial à aplicação, fornecendo ferramentas essenciais para estudantes e concurseiros.
    *   Aumenta o engajamento do usuário ao centralizar diversas funcionalidades de apoio ao estudo em uma única plataforma.
    *   Potencial para diferenciar a aplicação de outras mais genéricas.
*   **Negativo/Riscos:**
    *   **Esforço Não Previsto:** A complexidade do módulo é classificada como "Média" e o esforço de desenvolvimento como "Médio a Alto". Este é um investimento de recursos (tempo, desenvolvimento) não delineado no `todo.md`.
    *   **Manutenção:** Funcionalidades ricas como esta exigem manutenção contínua, correções de bugs e potenciais evoluções, implicando em custos de longo prazo.
    *   **Dependências:** A integração inferida com Google Drive para materiais pode introduzir dependências externas, sujeitas a mudanças de API ou políticas de uso.
    *   **Complexidade da Base de Código:** Adiciona complexidade geral ao projeto, o que pode dificultar a integração de novos desenvolvedores e aumentar o tempo necessário para novas funcionalidades ou refatorações.

## Módulo: Concursos

### 1. Descrição da Funcionalidade

O Módulo de Concursos é projetado para auxiliar usuários na preparação para concursos públicos, oferecendo:
*   **Gerenciamento de Concursos:** Funcionalidades CRUD para concursos, incluindo o cadastro de conteúdo programático.
*   **Gerenciamento de Questões:** Funcionalidades CRUD para questões, com capacidade de associação a concursos específicos.
*   **Geração de Contexto de Concurso:** Utiliza um LLM (Modelo de Linguagem Grande) simulado no frontend ou importação de JSON para gerar contextos relevantes para os concursos.
*   **Geração de Questões:** Integração com a API da Perplexity AI (`/api/gerar-questao`) para gerar questões de forma dinâmica, além da possibilidade de importação.
*   **Importação de Concurso:** Permite importar dados de concursos a partir de arquivos JSON, possivelmente gerados por LLMs externos.


### 4. Análise de Impacto

*   **Positivo:**
    *   **Inovação:** A utilização de LLMs para geração de questões e contextos é um diferencial significativo e inovador.
    *   **Valor Elevado para o Nicho:** Oferece ferramentas de alto valor para o público específico de concurseiros.
    *   **Automatização:** A geração de questões pode economizar tempo e esforço dos usuários na busca por material de estudo.
*   **Negativo/Riscos:**
    *   **Esforço e Complexidade Elevados:** Classificado com complexidade "Alta" e esforço "Alto"
    *   **Dependência de APIs Externas:** A integração com a Perplexity AI introduz custos (diretos ou indiretos), dependência de um serviço de terceiros, e riscos associados a mudanças na API, termos de serviço ou disponibilidade.
    *   **Qualidade do Conteúdo Gerado por IA:** A eficácia do módulo depende da qualidade e precisão das questões e contextos gerados pela IA, o que pode variar e exigir curadoria ou ajustes.
    *   **Custos Operacionais:** O uso de APIs de IA pode incorrer em custos operacionais contínuos baseados no volume de uso.
    *   **Manutenção de Integrações:** Manter a integração com APIs de IA pode ser complexo devido à rápida evolução dessas tecnologias.

## Módulo: Hiperfocos

### 1. Descrição da Funcionalidade

O Módulo de Hiperfocos visa auxiliar os usuários a gerenciar e manter o foco em tarefas e projetos importantes:
*   **Conversor de Interesses:** Ferramenta que permite transformar interesses ou ideias em projetos de hiperfoco estruturados, com tarefas associadas.
*   **Visualizador de Projetos em Árvore:** Apresenta os projetos de hiperfoco e suas tarefas/subtarefas em uma estrutura hierárquica (árvore), com funcionalidades CRUD.
*   **Sistema de Alternância:** Gerencia sessões de transição entre diferentes hiperfocos, ajudando o usuário a mudar de contexto de forma organizada.
*   **Temporizador de Foco:** Um temporizador específico para sessões de hiperfoco, possivelmente com alarmes e notificações para manter o usuário na tarefa.

### 4. Análise de Impacto

*   **Positivo:**
    *   **Atende a Necessidade Específica:** Oferece uma solução para usuários que buscam técnicas avançadas de gerenciamento de foco e produtividade.
    *   **Diferencial de Nicho:** Pode atrair e reter usuários interessados especificamente em metodologias de hiperfoco.
    *   **Estrutura para Projetos Pessoais:** Fornece uma maneira estruturada de decompor e acompanhar projetos que exigem concentração intensa.
*   **Negativo/Riscos:**
    *   **Esforço e Complexidade Elevados:** Também classificado com complexidade "Alta" e esforço "Alto", representa um investimento significativo não previsto.
    *   **Adoção pelo Usuário:** A utilidade deste módulo pode ser mais restrita a um subconjunto de usuários que praticam ou desejam praticar técnicas de hiperfoco.
    *   **Manutenção de Lógica de Projeto:** A gestão de projetos, tarefas, subtarefas e o sistema de alternância adicionam uma camada considerável de lógica de negócios e complexidade de manutenção.
    *   **Integração com Outros Módulos:** Garantir que o sistema de hiperfoco se integre de forma coesa com outras funcionalidades da aplicação (como estudos ou tarefas gerais) pode ser um desafio.
````

## File: docs/specs/030#feat#identificar_itens_pendentes_spec.md
````markdown
### Item 1: Utilização do Supabase como backend principal.

**Descrição:** "A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados."
*   **Status Atual:** Em Andamento
*   **Percentual de Conclusão Estimado:** 60% (Este é um item abrangente, seu status e progresso dependem da conclusão dos sub-componentes do Supabase listados abaixo).
*   **Bloqueios Identificados:**
    *   Implementação e verificação completa do Supabase Database (modelagem de dados, persistência para todos os módulos).
    *   Implementação do Supabase Realtime para funcionalidades que o requeiram.
    *   Finalização e verificação completa do Supabase Auth (login social, gerenciamento JWT).
*   **Estimativa de Finalização:** Dependente da conclusão dos itens de Database, Realtime e Auth. Estimativa geral: 2-4 semanas.
*   **Avaliação do Impacto Potencial:**
    *   **Cronograma:** Alto. Atrasos na implementação do backend Supabase impactarão diretamente o cronograma de desenvolvimento de todas as funcionalidades que dependem de persistência de dados, autenticação e/ou atualizações em tempo real.
    *   **Objetivos:** Muito Alto. A funcionalidade central da aplicação e a experiência do usuário dependem criticamente da correta e completa integração com o backend Supabase.
    *   **Dependências:** Alto. Muitos módulos da aplicação (`app/alimentacao`, `app/estudos`, `app/financas`, etc.) dependem da infraestrutura de backend.
*   **Nível de Criticidade para Priorização:** Muito Alto.

### Item 2: Supabase Auth: Gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT).

*   **Descrição `:** "Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT)."
*   **Status Atual:** Em Andamento
*   **Percentual de Conclusão Estimado:** 70% (Conforme análise da Tarefa 010, apesar da Tarefa 020 indicar "Concluído", há detalhes pendentes).
*   **Bloqueios Identificados:**
    *   Verificação e potencial implementação/finalização do login social (especificamente Google).
    *   Verificação e potencial implementação/finalização do gerenciamento completo de sessão JWT.
    *   Testes de segurança e robustez para todos os fluxos de autenticação.
*   **Estimativa de Finalização:** 1-3 dias.
*   **Avaliação do Impacto Potencial:**
    *   **Cronograma:** Baixo-Médio. A base da autenticação está funcional, mas a finalização é necessária para completar o escopo.
    *   **Objetivos:** Médio. A ausência de login social ou um gerenciamento de sessão JWT robusto pode afetar a experiência do usuário e a segurança da aplicação.
    *   **Dependências:** Médio. Todas as funcionalidades que requerem acesso restrito dependem da autenticação.
*   **Nível de Criticidade para Priorização:** Alto.

### Item 3: Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura.

*   **Descrição:** "Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura."
*   **Status Atual:** Em Andamento
*   **Percentual de Conclusão Estimado:** 60% (Conforme Tarefa 010, infraestrutura parece existir, mas extensão da modelagem e uso é incerta. Tarefa 020 indica "Não Concluído / Não Verificável").
*   **Bloqueios Identificados:**
    *   Definição completa e implementação da modelagem de dados para todos os módulos da aplicação (e.g., Alimentação, Estudos, Finanças, Receitas, etc.).
    *   Implementação das operações CRUD (Create, Read, Update, Delete) para todas as entidades de dados.
    *   Verificação da correta persistência, recuperação e segurança dos dados.
    *   Implementação de migrações de banco de dados, se necessário.
*   **Estimativa de Finalização:** 1-2 semanas (pode variar significativamente dependendo da complexidade da modelagem e da quantidade de módulos a serem integrados).
*   **Avaliação do Impacto Potencial:**
    *   **Cronograma:** Muito Alto. Atrasos aqui bloqueiam o desenvolvimento da maioria das funcionalidades da aplicação.
    *   **Objetivos:** Muito Alto. Essencial para a persistência de dados, que é um requisito fundamental para quase todas as funcionalidades planejadas.
    *   **Dependências:** Muito Alto. Praticamente todos os módulos da aplicação dependem da funcionalidade do banco de dados.
*   **Nível de Criticidade para Priorização:** Muito Alto.

### Item 4: Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend.

*   **Descrição:** "Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend."
*   **Status Atual:** Não Iniciado
*   **Percentual de Conclusão Estimado:** 5% (Conforme Tarefa 010, implementação não é aparente. Tarefa 020 indica "Não Concluído").
*   **Bloqueios Identificados:**
    *   Definição de quais funcionalidades específicas da aplicação necessitarão de atualizações em tempo real.
    *   Planejamento e implementação da lógica de sincronização em tempo real para as funcionalidades identificadas.
    *   Testes de performance e escalabilidade da funcionalidade realtime.
*   **Estimativa de Finalização:** 1 semana (após a conclusão da implementação base do Supabase Database, pois depende dele).
*   **Avaliação do Impacto Potencial:**
    *   **Cronograma:** Médio. Pode ser implementado em fases, após a funcionalidade básica dos módulos estar pronta.
    *   **Objetivos:** Médio-Alto. Impacta significativamente a experiência do usuário em funcionalidades colaborativas ou que exigem informações sempre atualizadas, mas pode não ser um bloqueio para o lançamento inicial de todas as funcionalidades.
    *   **Dependências:** Médio. Funcionalidades específicas se beneficiarão, mas nem todas são dependentes.
*   **Nível de Criticidade para Priorização:** Médio.

### Item 5: Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js).

*   **Descrição :** "Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js)."
*   **Status Atual:** Em Andamento
*   **Percentual de Conclusão Estimado:** 80% (Conforme Tarefa 010, SDK configurado e provavelmente em uso. Tarefa 020 indica "Concluído", mas a estimativa de 80% sugere que pode haver otimizações ou integrações pendentes).
*   **Bloqueios Identificados:**
    *   Garantir que o SDK está sendo utilizado de forma otimizada, segura e correta em todas as interações necessárias com o backend (Auth, Database, Realtime) em todos os módulos.
    *   Revisão de código para identificar possíveis melhorias no uso do SDK.
    *   Testes abrangentes de todas as interações via SDK.
*   **Estimativa de Finalização:** 2-4 dias (para revisão, ajustes finais e testes).
*   **Avaliação do Impacto Potencial:**
    *   **Cronograma:** Baixo. A base da integração com o SDK está implementada.
    *   **Objetivos:** Baixo-Médio. Otimizações e correções podem ser necessárias para garantir a estabilidade, performance e segurança das interações.
    *   **Dependências:** Baixo. As interações já ocorrem, o foco é em refinar.
*   **Nível de Criticidade para Priorização:** Médio.

## 3. Priorização Geral

Com base na criticidade e impacto:

1.  **Supabase Database** (Muito Alto)
2.  **Supabase Auth** (Alto)
3.  **Utilização do Supabase como backend principal** (Muito Alto - seu progresso é um reflexo dos outros)
4.  **Supabase Client Library (supabase-js)** (Médio)
5.  **Supabase Realtime** (Médio)

É crucial focar na finalização do Supabase Database e Auth, pois são os pilares para a maioria das funcionalidades da aplicação.
````

## File: docs/specs/040#feat#identificar_divergencias_spec.md
````markdown
## 2. Atual 

```
1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1.



Abaixo, uma lista das principais áreas funcionais e esforços de desenvolvimento:

### 4.1. Módulos de Gerenciamento Pessoal
*   **Descrição:** Conjunto de funcionalidades voltadas para o bem-estar e organização pessoal do usuário.
*   **Sub-módulos/Funcionalidades Específicas:**
    *   **Alimentação:** [`LembreteHidratacao.tsx`](app/components/alimentacao/LembreteHidratacao.tsx), [`PlanejadorRefeicoes.tsx`](app/components/alimentacao/PlanejadorRefeicoes.tsx), [`RegistroRefeicoes.tsx`](app/components/alimentacao/RegistroRefeicoes.tsx), [`alimentacaoStore.ts`](app/stores/alimentacaoStore.ts), [`app/alimentacao/page.tsx`](app/alimentacao/page.tsx).
    *   **Autoconhecimento:** [`EditorNotas.tsx`](app/components/autoconhecimento/EditorNotas.tsx), [`ListaNotas.tsx`](app/components/autoconhecimento/ListaNotas.tsx), [`ModoRefugio.tsx`](app/components/autoconhecimento/ModoRefugio.tsx), [`autoconhecimentoStore.ts`](app/stores/autoconhecimentoStore.ts), [`app/autoconhecimento/page.tsx`](app/autoconhecimento/page.tsx).
    *   **Saúde:** [`FatoresHumor.tsx`](app/components/saude/FatoresHumor.tsx), [`HumorCalendar.tsx`](app/components/saude/HumorCalendar.tsx), [`MedicamentosList.tsx`](app/components/saude/MedicamentosList.tsx), [`MonitoramentoHumor.tsx`](app/components/saude/MonitoramentoHumor.tsx), [`RegistroMedicamentos.tsx`](app/components/saude/RegistroMedicamentos.tsx), [`app/saude/page.tsx`](app/saude/page.tsx). (Nota: `ChecklistMedicamentos.tsx` em `inicio` também se relaciona aqui).
    *   **Sono:** [`ConfiguracaoLembretes.tsx`](app/components/sono/ConfiguracaoLembretes.tsx), [`RegistroSono.tsx`](app/components/sono/RegistroSono.tsx), [`VisualizadorSemanal.tsx`](app/components/sono/VisualizadorSemanal.tsx), [`sonoStore.ts`](app/stores/sonoStore.ts), [`app/sono/page.tsx`](app/sono/page.tsx).
    *   **Lazer:** [`AtividadesLazer.tsx`](app/components/lazer/AtividadesLazer.tsx), [`SugestoesDescanso.tsx`](app/components/lazer/SugestoesDescanso.tsx), [`TemporizadorLazer.tsx`](app/components/lazer/TemporizadorLazer.tsx), [`atividadesStore.ts`](app/stores/atividadesStore.ts), [`sugestoesStore.ts`](app/stores/sugestoesStore.ts), [`app/lazer/page.tsx`](app/lazer/page.tsx).
### 4.2. Módulos de Produtividade e Estudos
*   **Descrição:** Funcionalidades destinadas a auxiliar o usuário em seus estudos, preparação para concursos e gerenciamento de foco.
*   **Sub-módulos/Funcionalidades Específicas:**
    *   **Estudos:** [`RegistroEstudos.tsx`](app/components/estudos/RegistroEstudos.tsx), [`TemporizadorPomodoro.tsx`](app/components/estudos/TemporizadorPomodoro.tsx), [`VisualizadorChecklist.tsx`](app/components/estudos/VisualizadorChecklist.tsx), [`VisualizadorMarkdown.tsx`](app/components/estudos/VisualizadorMarkdown.tsx), componentes de Simulado (ex: [`SimuladoLoader.tsx`](app/components/estudos/simulado/SimuladoLoader.tsx)), stores ([`pomodoroStore.ts`](app/stores/pomodoroStore.ts), [`registroEstudosStore.ts`](app/stores/registroEstudosStore.ts), [`simuladoStore.ts`](app/stores/simuladoStore.ts)), páginas ([`app/estudos/page.tsx`](app/estudos/page.tsx), [`app/estudos/materiais/page.tsx`](app/estudos/materiais/page.tsx)), APIs de materiais ([`pages/api/materiais/`](pages/api/materiais/)).
    *   **Concursos:** Componentes em [`app/components/concursos/`](app/components/concursos/), stores ([`concursosStore.ts`](app/stores/concursosStore.ts), [`questoesStore.ts`](app/stores/questoesStore.ts)), página ([`app/concursos/page.tsx`](app/concursos/page.tsx)), API de geração de questões ([`pages/api/gerar-questao.ts`](pages/api/gerar-questao.ts)).
    *   **Hiperfocos:** Componentes em [`app/components/hiperfocos/`](app/components/hiperfocos/), store ([`hiperfocosStore.ts`](app/stores/hiperfocosStore.ts)), página ([`app/hiperfocos/page.tsx`](app/hiperfocos/page.tsx)).

### 4.3. Módulo de Finanças
*   **Descrição:** Funcionalidades para gerenciamento financeiro pessoal.
*   **Componentes/Stores/Páginas:** [`AdicionarDespesa.tsx`](app/components/financas/AdicionarDespesa.tsx), [`CalendarioPagamentos.tsx`](app/components/financas/CalendarioPagamentos.tsx), [`EnvelopesVirtuais.tsx`](app/components/financas/EnvelopesVirtuais.tsx), [`RastreadorGastos.tsx`](app/components/financas/RastreadorGastos.tsx), [`financasStore.ts`](app/stores/financasStore.ts), [`app/financas/page.tsx`](app/financas/page.tsx).


### 4.4. Módulo de Receitas
*   **Descrição:** Funcionalidades para gerenciamento e descoberta de receitas culinárias.
*   **Componentes/Stores/Páginas:** Componentes em [`app/components/receitas/`](app/components/receitas/), store ([`receitasStore.ts`](app/stores/receitasStore.ts)), páginas ([`app/receitas/page.tsx`](app/receitas/page.tsx), [`app/receitas/adicionar/page.tsx`](app/receitas/adicionar/page.tsx), [`app/receitas/lista-compras/page.tsx`](app/receitas/lista-compras/page.tsx)).


### 4.5. Funcionalidades Centrais e Estruturais
*   **Descrição:** Componentes e sistemas que dão suporte à aplicação como um todo.
*   **Sub-módulos/Funcionalidades Específicas:**
    *   **Dashboard/Início:** Componentes em [`app/components/inicio/`](app/components/inicio/) (ex: [`PainelDia.tsx`](app/components/inicio/PainelDia.tsx), [`ListaPrioridades.tsx`](app/components/inicio/ListaPrioridades.tsx)), store ([`prioridadesStore.ts`](app/stores/prioridadesStore.ts)), página principal ([`app/page.tsx`](app/page.tsx)).
    *   **Perfil do Usuário:** Componentes em [`app/components/perfil/`](app/components/perfil/) (ex: [`InformacoesPessoais.tsx`](app/components/perfil/InformacoesPessoais.tsx)), store ([`perfilStore.ts`](app/stores/perfilStore.ts)), página ([`app/perfil/page.tsx`](app/perfil/page.tsx)).
    *   **Interface de Autenticação (UI):** Páginas de login ([`app/auth/login/page.tsx`](app/auth/login/page.tsx)), signup ([`app/auth/signup/page.tsx`](app/auth/signup/page.tsx)), callback ([`app/auth/callback/route.ts`](app/auth/callback/route.ts)) e contexto de autenticação ([`AuthContext.tsx`](app/context/AuthContext.tsx)). Embora o `todo.md` mencione "Supabase Auth", ele não detalha a implementação da UI e o fluxo no frontend.
    *   **Biblioteca de Componentes de UI:** Esforço significativo na criação de componentes reutilizáveis em [`app/components/ui/`](app/components/ui/).
    *   **Gerenciamento de Estado com Zustand:** Implementação de múltiplas stores em [`app/stores/`](app/stores/) para gerenciar o estado global e local da aplicação.
    *   **Exportar/Importar Dados:** Componente [`ExportarImportarDados.tsx`](app/components/ExportarImportarDados.tsx).
    *   **ThemeProvider:** Componente [`ThemeProvider.tsx`](app/components/ThemeProvider.tsx) para temas visuais.
*   **Divergência:** Estes esforços estruturais e funcionalidades centrais, com exceção da menção genérica ao "Supabase Auth".
````

## File: docs/tasks/010#chore#analisar_todo_e_estado_projeto.json
````json
{
  "taskId": "010#chore#analisar_todo_e_estado_projeto",
  "status": "Done",
  "task_output": {
    "analysis_report": {
      "todo_md_analysis": {
        "extracted_items": [
          "Utilização do Supabase como backend principal.",
          "Supabase Auth: Gerenciamento completo de autenticação (registro, login email/senha, login social Google, logout, gerenciamento de sessão JWT).",
          "Supabase Database: Banco de dados PostgreSQL para armazenamento de dados.",
          "Supabase Realtime: Sincronização de dados em tempo real.",
          "Supabase Client Library (supabase-js): SDK para interação com Supabase no frontend/backend."
        ],
        "defined_scope": "Implementar uma arquitetura baseada em Supabase, cobrindo autenticação, banco de dados, funcionalidades em tempo real e interação via SDK para uma aplicação."
      },
      "workspace_analysis": {
        "project_scope_overview": "O projeto é uma aplicação web multifuncional (Anatel2), desenvolvida com Next.js e TypeScript, focada em auxiliar o usuário em diversas áreas como alimentação, estudos, finanças, saúde, autoconhecimento, concursos, hiperfocos, lazer, perfil, receitas e sono. A aplicação utiliza Supabase para serviços de backend, incluindo autenticação e banco de dados, e possui uma estrutura modular com componentes de UI reutilizáveis e gerenciamento de estado (provavelmente Zustand, inferido pela estrutura de 'app/stores').",
        "supabase_integration_status": {
          "auth": {
            "evidence": [
              "app/auth/login/page.tsx",
              "app/auth/signup/page.tsx",
              "app/auth/callback/route.ts",
              "app/context/AuthContext.tsx",
              "app/lib/supabaseClient.ts"
            ],
            "estimated_progress": "70%",
            "notes": "Estrutura para login/registro e callback OAuth presente. Login social e gerenciamento JWT necessitam confirmação no código."
          },
          "database": {
            "evidence": [
              "app/lib/dataService.ts",
              "app/lib/supabaseClient.ts",
              "Existência de múltiplos módulos de funcionalidade (e.g., app/alimentacao, app/receitas) e stores (e.g., app/stores/alimentacaoStore.ts) que presumivelmente interagem com o banco."
            ],
            "estimated_progress": "60%",
            "notes": "Infraestrutura para interações com banco de dados parece existir. A extensão da modelagem e uso é incerta sem análise de código."
          },
          "realtime": {
            "evidence": [
              "Nenhuma evidência clara na estrutura de arquivos."
            ],
            "estimated_progress": "5%",
            "notes": "Implementação de Supabase Realtime não é aparente. Pode não estar implementado ou requer inspeção de código."
          },
          "client_sdk": {
            "evidence": [
              "app/lib/supabaseClient.ts",
              "app/lib/dataService.ts"
            ],
            "estimated_progress": "80%",
            "notes": "SDK do Supabase está configurado e provavelmente em uso para interações com o backend."
          }
        },
        "application_modules_status": [
          {
            "module_name": "Alimentação",
            "evidence": ["app/alimentacao/page.tsx", "app/components/alimentacao/LembreteHidratacao.tsx", "app/components/alimentacao/PlanejadorRefeicoes.tsx", "app/components/alimentacao/RegistroRefeicoes.tsx", "app/stores/alimentacaoStore.ts"],
            "estimated_progress": "75%",
            "implemented_features_summary": "Lembretes de hidratação, planejamento e registro de refeições."
          },
          {
            "module_name": "Autoconhecimento",
            "evidence": ["app/autoconhecimento/page.tsx", "app/components/autoconhecimento/EditorNotas.tsx", "app/components/autoconhecimento/ListaNotas.tsx", "app/components/autoconhecimento/ModoRefugio.tsx", "app/stores/autoconhecimentoStore.ts"],
            "estimated_progress": "75%",
            "implemented_features_summary": "Editor e lista de notas, modo refúgio."
          },
          {
            "module_name": "Concursos",
            "evidence": ["app/concursos/page.tsx", "app/components/concursos/ConcursoForm.tsx", "app/components/concursos/GeradorContextoLLM.tsx", "app/components/concursos/QuestaoList.tsx", "app/stores/concursosStore.ts", "app/stores/questoesStore.ts"],
            "estimated_progress": "80%",
            "implemented_features_summary": "Formulário de concurso, geração de contexto e questões por LLM, listagem de questões."
          },
          {
            "module_name": "Estudos",
            "evidence": ["app/estudos/page.tsx", "app/components/estudos/RegistroEstudos.tsx", "app/components/estudos/TemporizadorPomodoro.tsx", "app/components/estudos/simulado/SimuladoLoader.tsx", "app/stores/registroEstudosStore.ts", "app/stores/pomodoroStore.ts", "app/stores/simuladoStore.ts"],
            "estimated_progress": "80%",
            "implemented_features_summary": "Registro de estudos, temporizador Pomodoro, simulados."
          },
          {
            "module_name": "Finanças",
            "evidence": ["app/financas/page.tsx", "app/components/financas/AdicionarDespesa.tsx", "app/components/financas/CalendarioPagamentos.tsx", "app/components/financas/RastreadorGastos.tsx", "app/stores/financasStore.ts"],
            "estimated_progress": "75%",
            "implemented_features_summary": "Adição de despesas, calendário de pagamentos, rastreador de gastos."
          },
          {
            "module_name": "Hiperfocos",
            "evidence": ["app/hiperfocos/page.tsx", "app/components/hiperfocos/ConversorInteresses.tsx", "app/components/hiperfocos/SistemaAlternancia.tsx", "app/components/hiperfocos/TemporizadorFoco.tsx", "app/stores/hiperfocosStore.ts"],
            "estimated_progress": "75%",
            "implemented_features_summary": "Conversor de interesses, sistema de alternância, temporizador de foco."
          },
          {
            "module_name": "Lazer",
            "evidence": ["app/lazer/page.tsx", "app/components/lazer/AtividadesLazer.tsx", "app/components/lazer/SugestoesDescanso.tsx", "app/components/lazer/TemporizadorLazer.tsx", "app/stores/atividadesStore.ts"],
            "estimated_progress": "70%",
            "implemented_features_summary": "Registro de atividades de lazer, sugestões de descanso, temporizador de lazer."
          },
          {
            "module_name": "Perfil",
            "evidence": ["app/perfil/page.tsx", "app/components/perfil/InformacoesPessoais.tsx", "app/components/perfil/MetasDiarias.tsx", "app/components/perfil/PreferenciasVisuais.tsx", "app/stores/perfilStore.ts"],
            "estimated_progress": "70%",
            "implemented_features_summary": "Informações pessoais, metas diárias, preferências visuais."
          },
          {
            "module_name": "Receitas",
            "evidence": ["app/receitas/page.tsx", "app/components/receitas/AdicionarReceitaForm.tsx", "app/components/receitas/ListaReceitas.tsx", "app/components/receitas/ListaCompras.tsx", "app/stores/receitasStore.ts"],
            "estimated_progress": "80%",
            "implemented_features_summary": "Adição e listagem de receitas, lista de compras."
          },
          {
            "module_name": "Saúde",
            "evidence": ["app/saude/page.tsx", "app/components/saude/MonitoramentoHumor.tsx", "app/components/saude/RegistroMedicamentos.tsx", "app/components/saude/HumorCalendar.tsx"],
            "estimated_progress": "75%",
            "implemented_features_summary": "Monitoramento de humor, registro de medicamentos, calendário de humor."
          },
          {
            "module_name": "Sono",
            "evidence": ["app/sono/page.tsx", "app/components/sono/ConfiguracaoLembretes.tsx", "app/components/sono/RegistroSono.tsx", "app/components/sono/VisualizadorSemanal.tsx", "app/stores/sonoStore.ts"],
            "estimated_progress": "70%",
            "implemented_features_summary": "Configuração de lembretes, registro de sono, visualizador semanal."
          }
        ],
        "overall_estimated_progress": "70%",
        "overall_notes": "O projeto possui uma vasta gama de funcionalidades de frontend estruturadas. A integração com Supabase está parcialmente evidente, com autenticação e uso do SDK bem encaminhados. A utilização do banco de dados é inferida pela estrutura, mas sua profundidade e a implementação de funcionalidades em tempo real são incertas e necessitam de análise de código mais detalhada para confirmação. A base da aplicação parece sólida, com muitos módulos de frontend já delineados."
      }
    }
  }
}
````

## File: docs/tasks/010#docs#implementar_REC_001.json
````json
{
  "taskId": "010#docs#implementar_REC_001",
  "status": "Pending Review",
  "message": "A documentação inicial da API de Autenticação foi gerada em docs/api_autenticacao.md. Aguardando revisão técnica pelo Arquiteto de Soluções.",
  "last_updated": "2025-05-07T20:20:41.000Z",
  "steps": [
    {
      "name": "Levantamento completo dos fluxos OAuth2 atuais.",
      "status": "Completed"
    },
    {
      "name": "Listagem e descrição detalhada de todos os escopos de permissão.",
      "status": "Completed"
    },
    {
      "name": "Criação de exemplos de requisição/resposta para cada endpoint.",
      "status": "Completed"
    },
    {
      "name": "Revisão técnica da documentação com o Arquiteto de Soluções.",
      "status": "Pending"
    },
    {
      "name": "Publicação da documentação no portal de desenvolvedores.",
      "status": "Pending"
    }
  ],
  "output_files": [
    "docs/api_autenticacao.md"
  ]
}
````

## File: docs/tasks/020#feat#verificar_itens_concluidos.json
````json
{
  "taskId": "020#feat#verificar_itens_concluidos",
  "status": "Done",
  "task_output": {
    "report_path": ".state/reports/020#feat#verificar_itens_concluidos_report.md",
    "validation_result_for_target": {
      "target_task_id": "N/A (validação da arquitetura Supabase conforme todo.md e análise em 010#chore#analisar_todo_e_estado_projeto)",
      "summary": "Supabase Auth e Client SDK estão implementados. Supabase Database (persistência de dados da aplicação) e Supabase Realtime não foram verificados como implementados.",
      "details": {
        "supabase_auth": "Concluído",
        "supabase_database": "Não Concluído / Não Verificável",
        "supabase_realtime": "Não Concluído",
        "supabase_client_sdk": "Concluído"
      }
    }
  },
  "error_message": null
}
````

## File: docs/tasks/020#test#implementar_REC_002.json
````json
{
  "taskId": "020#test#implementar_REC_002",
  "status": "Failed",
  "error_message": "Falha: Especificação insuficiente para prosseguir com a implementação dos testes de integração. O Módulo de Faturamento, conforme descrito (geração de faturas para clientes, processamento de pagamentos, tratamento de inadimplência), não foi encontrado no projeto. É necessário que o módulo exista ou seja desenvolvido antes que os testes de integração possam ser implementados. A investigação nos caminhos `app/financas/`, `app/lib/billingService.ts` e uma análise geral da estrutura de arquivos não revelaram componentes correspondentes a um sistema de faturamento para clientes da aplicação.",
  "output_references": [],
  "new_tasks_to_integrate": {
    "items": []
  }
}
````

## File: docs/tasks/030#feat#identificar_itens_pendentes.json
````json
{
  "taskId": "030#feat#identificar_itens_pendentes",
  "status": "Done",
  "task_output": {
    "classification_summary": "Os itens do 'todo.md' relacionados à arquitetura Supabase foram classificados. Supabase Database e Auth são os mais críticos e estão 'Em Andamento'. Supabase Realtime está 'Não Iniciado'. Supabase Client Library está 'Em Andamento' com bom progresso. A utilização geral do Supabase como backend está 'Em Andamento', dependendo da conclusão dos seus componentes.",
    "classified_items": [
      {
        "item_description": "Utilização do Supabase como backend principal.",
        "status": "Em Andamento",
        "completion_percentage": "60%",
        "blockers": "Implementação completa do Supabase Database, Realtime e finalização do Auth.",
        "estimated_completion": "2-4 semanas (dependente dos sub-itens)",
        "potential_impact": "Muito Alto no cronograma e objetivos. Alto em dependências.",
        "criticality_level": "Muito Alto"
      },
      {
        "item_description": "Supabase Auth: Gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT).",
        "status": "Em Andamento",
        "completion_percentage": "70%",
        "blockers": "Verificação/finalização do login social (Google), gerenciamento de sessão JWT e testes de segurança.",
        "estimated_completion": "1-3 dias",
        "potential_impact": "Baixo-Médio no cronograma. Médio nos objetivos e dependências.",
        "criticality_level": "Alto"
      },
      {
        "item_description": "Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura.",
        "status": "Em Andamento",
        "completion_percentage": "60%",
        "blockers": "Definição/implementação completa da modelagem de dados, operações CRUD para todos os módulos, verificação de persistência/segurança.",
        "estimated_completion": "1-2 semanas",
        "potential_impact": "Muito Alto no cronograma, objetivos e dependências.",
        "criticality_level": "Muito Alto"
      },
      {
        "item_description": "Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend.",
        "status": "Não Iniciado",
        "completion_percentage": "5%",
        "blockers": "Definição das funcionalidades que necessitam de realtime, planejamento e implementação da lógica de sincronização.",
        "estimated_completion": "1 semana (após Supabase Database)",
        "potential_impact": "Médio no cronograma. Médio-Alto nos objetivos. Médio em dependências.",
        "criticality_level": "Médio"
      },
      {
        "item_description": "Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js).",
        "status": "Em Andamento",
        "completion_percentage": "80%",
        "blockers": "Garantir uso otimizado, seguro e correto do SDK em todas as interações; revisão de código e testes abrangentes.",
        "estimated_completion": "2-4 dias",
        "potential_impact": "Baixo no cronograma. Baixo-Médio nos objetivos e dependências.",
        "criticality_level": "Médio"
      }
    ],
    "prioritization_order": [
      "Supabase Database",
      "Supabase Auth",
      "Utilização do Supabase como backend principal",
      "Supabase Client Library (supabase-js)",
      "Supabase Realtime"
    ],
    "spec_file_path": ".state/specs/030#feat#identificar_itens_pendentes_spec.md"
  },
  "new_tasks_to_integrate": [],
  "error_message": null
}
````

## File: docs/tasks/040#feat#identificar_divergencias.json
````json
{
  "taskId": "040#feat#identificar_divergencias",
  "status": "Done",
  "description": "Identificar componentes, funcionalidades, refatorações ou esforços substanciais no projeto atual que não possuem correspondência clara no 'todo.md'. Investigar sua provável origem e analisar o impacto.",
  "new_tasks_to_integrate": [
    {
      "taskId": "TEMP#chore#analisar_codigo_modulos_pessoais",
      "description": "Analisar o código dos módulos de Gerenciamento Pessoal (Alimentação, Autoconhecimento, Saúde, Sono, Lazer) identificados em '.state/specs/040#feat#identificar_divergencias_spec.md'. Identificar principais funcionalidades, estruturas de dados, complexidade, integrações e tentar inferir a origem (ex: requisito implícito, decisão de design) e o esforço de desenvolvimento.",
      "status": "Pending",
      "parentTaskId": "040#feat#identificar_divergencias",
      "dependencies": [],
      "tags": ["analise_codigo", "gerenciamento_pessoal"],
      "acceptance_criteria_for_delegation": "Relatório de análise de código para os módulos de Gerenciamento Pessoal, detalhando: 1. Funcionalidades chave de cada submódulo (Alimentação, Autoconhecimento, Saúde, Sono, Lazer). 2. Estruturas de dados principais e stores Zustand associadas. 3. Estimativa de complexidade (baixa, média, alta). 4. Pontos de integração com outros módulos ou serviços (ex: Supabase). 5. Hipótese sobre a origem do desenvolvimento (ex: parte do escopo inicial não documentado, requisito emergente). 6. Estimativa do esforço de desenvolvimento já empregado.",
      "suggested_mode_for_delegation": "coder-monk",
      "context_for_delegation": {
        "relevant_files_or_dirs": [
          "app/components/alimentacao/",
          "app/stores/alimentacaoStore.ts",
          "app/alimentacao/page.tsx",
          "app/components/autoconhecimento/",
          "app/stores/autoconhecimentoStore.ts",
          "app/autoconhecimento/page.tsx",
          "app/components/saude/",
          "app/saude/page.tsx",
          "app/components/sono/",
          "app/stores/sonoStore.ts",
          "app/sono/page.tsx",
          "app/components/lazer/",
          "app/stores/atividadesStore.ts",
          "app/stores/sugestoesStore.ts",
          "app/lazer/page.tsx",
          ".state/specs/040#feat#identificar_divergencias_spec.md"
        ],
        "todo_md_content": "1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1."
      }
    },
    {
      "taskId": "TEMP#docs#documentar_divergencias_modulos_pessoais",
      "description": "Com base na análise de código de TEMP#chore#analisar_codigo_modulos_pessoais, documentar as divergências dos módulos de Gerenciamento Pessoal (Alimentação, Autoconhecimento, Saúde, Sono, Lazer) em relação ao 'todo.md'. Detalhar a funcionalidade, a origem provável e a análise de impacto.",
      "status": "Pending",
      "parentTaskId": "040#feat#identificar_divergencias",
      "dependencies": ["TEMP#chore#analisar_codigo_modulos_pessoais"],
      "tags": ["documentacao", "gerenciamento_pessoal", "divergencia"],
      "acceptance_criteria_for_delegation": "Seção no relatório de divergências (a ser consolidado posteriormente) para os Módulos de Gerenciamento Pessoal, contendo para cada submódulo: 1. Descrição da funcionalidade implementada. 2. Comparativo com o 'todo.md' (destacando a ausência). 3. Origem provável da divergência (baseada na análise de código). 4. Análise de impacto (positivo/negativo) no projeto (recursos, cronograma, alinhamento estratégico, valor para o usuário).",
      "suggested_mode_for_delegation": "docu-crafter",
      "context_for_delegation": {
        "input_task_output_path": ".state/tasks/TEMP#chore#analisar_codigo_modulos_pessoais.json",
        "specification_file_path": ".state/specs/040#feat#identificar_divergencias_spec.md",
        "todo_md_content": "1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1."
      }
    },
    {
      "taskId": "TEMP#chore#analisar_codigo_modulos_produtividade",
      "description": "Analisar o código dos módulos de Produtividade e Estudos (Estudos, Concursos, Hiperfocos) identificados em '.state/specs/040#feat#identificar_divergencias_spec.md'. Identificar principais funcionalidades, estruturas de dados, complexidade, integrações e tentar inferir a origem e o esforço de desenvolvimento.",
      "status": "Pending",
      "parentTaskId": "040#feat#identificar_divergencias",
      "dependencies": [],
      "tags": ["analise_codigo", "produtividade", "estudos"],
      "acceptance_criteria_for_delegation": "Relatório de análise de código para os módulos de Produtividade e Estudos, detalhando: 1. Funcionalidades chave de cada submódulo (Estudos, Concursos, Hiperfocos). 2. Estruturas de dados principais e stores Zustand associadas. 3. Estimativa de complexidade. 4. Pontos de integração (APIs, Supabase). 5. Hipótese sobre a origem. 6. Estimativa do esforço.",
      "suggested_mode_for_delegation": "coder-monk",
      "context_for_delegation": {
        "relevant_files_or_dirs": [
          "app/components/estudos/",
          "app/stores/pomodoroStore.ts",
          "app/stores/registroEstudosStore.ts",
          "app/stores/simuladoStore.ts",
          "app/estudos/",
          "pages/api/materiais/",
          "app/components/concursos/",
          "app/stores/concursosStore.ts",
          "app/stores/questoesStore.ts",
          "app/concursos/page.tsx",
          "pages/api/gerar-questao.ts",
          "app/components/hiperfocos/",
          "app/stores/hiperfocosStore.ts",
          "app/hiperfocos/page.tsx",
          ".state/specs/040#feat#identificar_divergencias_spec.md"
        ],
        "todo_md_content": "1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1."
      }
    },
    {
      "taskId": "TEMP#docs#documentar_divergencias_modulos_produtividade",
      "description": "Com base na análise de código de TEMP#chore#analisar_codigo_modulos_produtividade, documentar as divergências dos módulos de Produtividade e Estudos em relação ao 'todo.md'. Detalhar a funcionalidade, a origem provável e a análise de impacto.",
      "status": "Pending",
      "parentTaskId": "040#feat#identificar_divergencias",
      "dependencies": ["TEMP#chore#analisar_codigo_modulos_produtividade"],
      "tags": ["documentacao", "produtividade", "estudos", "divergencia"],
      "acceptance_criteria_for_delegation": "Seção no relatório de divergências para os Módulos de Produtividade e Estudos, contendo para cada submódulo: 1. Descrição da funcionalidade. 2. Comparativo com 'todo.md'. 3. Origem provável. 4. Análise de impacto.",
      "suggested_mode_for_delegation": "docu-crafter",
      "context_for_delegation": {
        "input_task_output_path": ".state/tasks/TEMP#chore#analisar_codigo_modulos_produtividade.json",
        "specification_file_path": ".state/specs/040#feat#identificar_divergencias_spec.md",
        "todo_md_content": "1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1."
      }
    },
    {
      "taskId": "TEMP#chore#analisar_codigo_modulo_financas",
      "description": "Analisar o código do módulo de Finanças identificado em '.state/specs/040#feat#identificar_divergencias_spec.md'. Identificar funcionalidades, estruturas, complexidade, integrações, origem e esforço.",
      "status": "Pending",
      "parentTaskId": "040#feat#identificar_divergencias",
      "dependencies": [],
      "tags": ["analise_codigo", "financas"],
      "acceptance_criteria_for_delegation": "Relatório de análise de código para o módulo de Finanças, detalhando: 1. Funcionalidades chave. 2. Estruturas de dados e store Zustand. 3. Complexidade. 4. Integrações. 5. Hipótese de origem. 6. Estimativa de esforço.",
      "suggested_mode_for_delegation": "coder-monk",
      "context_for_delegation": {
        "relevant_files_or_dirs": [
          "app/components/financas/",
          "app/stores/financasStore.ts",
          "app/financas/page.tsx",
          ".state/specs/040#feat#identificar_divergencias_spec.md"
        ],
        "todo_md_content": "1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1."
      }
    },
    {
      "taskId": "TEMP#docs#documentar_divergencia_modulo_financas",
      "description": "Com base na análise de TEMP#chore#analisar_codigo_modulo_financas, documentar a divergência do módulo de Finanças em relação ao 'todo.md'. Detalhar funcionalidade, origem e impacto.",
      "status": "Pending",
      "parentTaskId": "040#feat#identificar_divergencias",
      "dependencies": ["TEMP#chore#analisar_codigo_modulo_financas"],
      "tags": ["documentacao", "financas", "divergencia"],
      "acceptance_criteria_for_delegation": "Seção no relatório de divergências para o Módulo de Finanças: 1. Descrição. 2. Comparativo. 3. Origem. 4. Impacto.",
      "suggested_mode_for_delegation": "docu-crafter",
      "context_for_delegation": {
        "input_task_output_path": ".state/tasks/TEMP#chore#analisar_codigo_modulo_financas.json",
        "specification_file_path": ".state/specs/040#feat#identificar_divergencias_spec.md",
        "todo_md_content": "1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1."
      }
    },
    {
      "taskId": "TEMP#chore#analisar_codigo_modulo_receitas",
      "description": "Analisar o código do módulo de Receitas identificado em '.state/specs/040#feat#identificar_divergencias_spec.md'. Identificar funcionalidades, estruturas, complexidade, integrações, origem e esforço.",
      "status": "Pending",
      "parentTaskId": "040#feat#identificar_divergencias",
      "dependencies": [],
      "tags": ["analise_codigo", "receitas"],
      "acceptance_criteria_for_delegation": "Relatório de análise de código para o módulo de Receitas: 1. Funcionalidades. 2. Estruturas e store. 3. Complexidade. 4. Integrações. 5. Origem. 6. Esforço.",
      "suggested_mode_for_delegation": "coder-monk",
      "context_for_delegation": {
        "relevant_files_or_dirs": [
          "app/components/receitas/",
          "app/stores/receitasStore.ts",
          "app/receitas/",
          ".state/specs/040#feat#identificar_divergencias_spec.md"
        ],
        "todo_md_content": "1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1."
      }
    },
    {
      "taskId": "TEMP#docs#documentar_divergencia_modulo_receitas",
      "description": "Com base na análise de TEMP#chore#analisar_codigo_modulo_receitas, documentar a divergência do módulo de Receitas. Detalhar funcionalidade, origem e impacto.",
      "status": "Pending",
      "parentTaskId": "040#feat#identificar_divergencias",
      "dependencies": ["TEMP#chore#analisar_codigo_modulo_receitas"],
      "tags": ["documentacao", "receitas", "divergencia"],
      "acceptance_criteria_for_delegation": "Seção no relatório de divergências para o Módulo de Receitas: 1. Descrição. 2. Comparativo. 3. Origem. 4. Impacto.",
      "suggested_mode_for_delegation": "docu-crafter",
      "context_for_delegation": {
        "input_task_output_path": ".state/tasks/TEMP#chore#analisar_codigo_modulo_receitas.json",
        "specification_file_path": ".state/specs/040#feat#identificar_divergencias_spec.md",
        "todo_md_content": "1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1."
      }
    },
    {
      "taskId": "TEMP#chore#analisar_codigo_funcionalidades_centrais",
      "description": "Analisar o código das Funcionalidades Centrais e Estruturais (Dashboard/Início, Perfil, UI de Autenticação, Biblioteca UI, Gerenciamento de Estado Zustand, Exportar/Importar, ThemeProvider) identificadas em '.state/specs/040#feat#identificar_divergencias_spec.md'. Identificar funcionalidades, estruturas, complexidade, integrações, origem e esforço.",
      "status": "Pending",
      "parentTaskId": "040#feat#identificar_divergencias",
      "dependencies": [],
      "tags": ["analise_codigo", "core", "ui", "estado"],
      "acceptance_criteria_for_delegation": "Relatório de análise de código para as Funcionalidades Centrais e Estruturais: 1. Funcionalidades chave de cada componente. 2. Arquitetura (ex: UI, Zustand). 3. Complexidade. 4. Integrações. 5. Origem. 6. Esforço.",
      "suggested_mode_for_delegation": "coder-monk",
      "context_for_delegation": {
        "relevant_files_or_dirs": [
          "app/components/inicio/",
          "app/stores/prioridadesStore.ts",
          "app/page.tsx",
          "app/components/perfil/",
          "app/stores/perfilStore.ts",
          "app/perfil/page.tsx",
          "app/auth/",
          "app/context/AuthContext.tsx",
          "app/components/ui/",
          "app/stores/",
          "app/components/ExportarImportarDados.tsx",
          "app/components/ThemeProvider.tsx",
          ".state/specs/040#feat#identificar_divergencias_spec.md"
        ],
        "todo_md_content": "1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1."
      }
    },
    {
      "taskId": "TEMP#docs#documentar_divergencias_funcionalidades_centrais",
      "description": "Com base na análise de TEMP#chore#analisar_codigo_funcionalidades_centrais, documentar as divergências das Funcionalidades Centrais e Estruturais. Detalhar funcionalidade, origem e impacto.",
      "status": "Pending",
      "parentTaskId": "040#feat#identificar_divergencias",
      "dependencies": ["TEMP#chore#analisar_codigo_funcionalidades_centrais"],
      "tags": ["documentacao", "core", "ui", "estado", "divergencia"],
      "acceptance_criteria_for_delegation": "Seção no relatório de divergências para as Funcionalidades Centrais e Estruturais: 1. Descrição. 2. Comparativo. 3. Origem. 4. Impacto.",
      "suggested_mode_for_delegation": "docu-crafter",
      "context_for_delegation": {
        "input_task_output_path": ".state/tasks/TEMP#chore#analisar_codigo_funcionalidades_centrais.json",
        "specification_file_path": ".state/specs/040#feat#identificar_divergencias_spec.md",
        "todo_md_content": "1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1."
      }
    },
    {
      "taskId": "TEMP#chore#consolidar_relatorio_divergencias",
      "description": "Consolidar os outputs das tarefas de documentação de divergências (TEMP#docs#...) em um único relatório markdown. O relatório deve apresentar uma visão geral das divergências e, em seguida, detalhar cada uma conforme documentado.",
      "status": "Pending",
      "parentTaskId": "040#feat#identificar_divergencias",
      "dependencies": [
        "TEMP#docs#documentar_divergencias_modulos_pessoais",
        "TEMP#docs#documentar_divergencias_modulos_produtividade",
        "TEMP#docs#documentar_divergencia_modulo_financas",
        "TEMP#docs#documentar_divergencia_modulo_receitas",
        "TEMP#docs#documentar_divergencias_funcionalidades_centrais"
      ],
      "tags": ["documentacao", "relatorio", "consolidacao"],
      "acceptance_criteria_for_delegation": "Um arquivo markdown único (`.state/reports/040#feat#identificar_divergencias_report.md`) contendo: 1. Introdução sobre o processo de identificação de divergências. 2. Sumário das principais áreas de divergência. 3. Seções detalhadas para cada área de divergência, incorporando os relatórios individuais produzidos pelas tarefas TEMP#docs#... . 4. Conclusão geral sobre o estado do 'todo.md' versus o projeto.",
      "suggested_mode_for_delegation": "docu-crafter",
      "context_for_delegation": {
        "input_task_output_paths": [
          ".state/tasks/TEMP#docs#documentar_divergencias_modulos_pessoais.json",
          ".state/tasks/TEMP#docs#documentar_divergencias_modulos_produtividade.json",
          ".state/tasks/TEMP#docs#documentar_divergencia_modulo_financas.json",
          ".state/tasks/TEMP#docs#documentar_divergencia_modulo_receitas.json",
          ".state/tasks/TEMP#docs#documentar_divergencias_funcionalidades_centrais.json"
        ],
        "specification_file_path": ".state/specs/040#feat#identificar_divergencias_spec.md",
        "output_report_path": ".state/reports/040#feat#identificar_divergencias_report.md"
      }
    }
  ],
  "task_output": null,
  "error_message": null
}
````

## File: docs/tasks/050#chore#refine_implementar_REC_002.json
````json
{
  "taskId": "050#chore#refine_implementar_REC_002",
  "status": "Done",
  "task_output": {
    "refined_task_id": "020#test#implementar_REC_002",
    "updated_delegation_details": {
      "description": "Implementar Recomendação 2: Implementação de Testes de Integração para Módulo de Faturamento",
      "context": {
        "id_recomendacao_original": "REC-002",
        "tarefa_acionavel_especifica": "Desenvolver e implementar testes de integração para o Módulo de Faturamento, cobrindo fluxos e cenários críticos detalhados no `context.detalhes_tecnicos_adicionais`. Integrar à pipeline CI/CD com relatórios.",
        "responsavel_justificativa": "coder-monk: Responsável pela escrita de código, incluindo testes automatizados.",
        "prioridade_justificativa": "Alta: Mitiga o risco de erros financeiros e garante a estabilidade do core business.",
        "sequencia_etapas_conclusao": [
          "Identificação dos Componentes: Localizar e documentar os componentes de software (arquivos, módulos, APIs) que constituem o Módulo de Faturamento.",
          "Mapeamento Detalhado de Fluxos e Cenários: Detalhar os fluxos de geração de faturas, processamento de pagamentos e tratamento de inadimplência, identificando cenários normais, alternativos e críticos (conforme `context.detalhes_tecnicos_adicionais.fluxos_cenarios_criticos_faturamento`).",
          "Definição da Estratégia e Ferramentas: Confirmar e configurar as ferramentas (Jest, msw/mocks) e a estratégia de teste (testes de API, simulação de serviços externos) conforme `context.detalhes_tecnicos_adicionais.estrategia_ferramentas_testes`.",
          "Configuração do Ambiente e Dados de Teste: Preparar o ambiente de teste (banco de dados dedicado ou transacional, variáveis de ambiente) e desenvolver scripts/fábricas para geração de dados de massa necessários (conforme `context.detalhes_tecnicos_adicionais.ambiente_dados_teste`).",
          "Desenvolvimento dos Scripts de Teste: Implementar os scripts de teste para cada cenário mapeado, visando 85% de cobertura dos cenários críticos.",
          "Execução e Depuração: Executar os testes, depurar falhas e garantir a estabilidade dos mesmos.",
          "Integração à Pipeline de CI/CD: Integrar a suíte de testes à pipeline de CI/CD, garantindo execução automática, falha da pipeline em caso de erro nos testes, e geração de relatórios de cobertura (conforme `context.detalhes_tecnicos_adicionais.integracao_cicd_validacao`).",
          "Documentação e Validação: Documentar os testes implementados e os resultados. Submeter para validação pelo Arquiteto de Soluções."
        ],
        "criterios_sucesso_metodo_verificacao": "Testes de integração executando com sucesso na CI/CD. Cobertura mínima de 85% dos cenários críticos mapeados (ver `context.detalhes_tecnicos_adicionais`). Código dos testes e cobertura validados pelo Arquiteto de Soluções.",
        "detalhes_tecnicos_adicionais": {
          "cobertura_testes_criticos": "85%",
          "localizacao_modulo_faturamento": "A ser identificado pelo coder-monk. Sugestão: investigar componentes em `app/financas/`, `app/lib/billingService.ts` (se existir), ou buscar por termos como 'faturamento', 'billing', 'invoice', 'payment'. Os componentes exatos e seus caminhos devem ser documentados como parte da tarefa.",
          "fluxos_cenarios_criticos_faturamento": {
            "geracao_faturas": {
              "descricao": "Fluxo de geração de faturas para clientes.",
              "cenarios": [
                "Geração de fatura para novo cliente com dados válidos.",
                "Geração de fatura recorrente para cliente existente.",
                "Geração de fatura com múltiplos itens/serviços e cálculo correto do total.",
                "Geração de fatura aplicando descontos e/ou acréscimos corretamente.",
                "Tentativa de geração de fatura com dados de cliente inválidos (crítico).",
                "Falha na comunicação com serviço de numeração de faturas (se aplicável) (crítico)."
              ]
            },
            "processamento_pagamentos": {
              "descricao": "Fluxo de processamento de pagamentos recebidos.",
              "cenarios": [
                "Processamento de pagamento bem-sucedido via cartão de crédito (simulado).",
                "Processamento de pagamento bem-sucedido via boleto bancário (simulado).",
                "Tentativa de processamento de pagamento com cartão recusado (saldo insuficiente, dados inválidos) (crítico).",
                "Processamento de pagamento parcial e atualização correta do saldo da fatura.",
                "Processamento de reembolso total/parcial de um pagamento.",
                "Falha na comunicação com gateway de pagamento (crítico)."
              ]
            },
            "tratamento_inadimplencia": {
              "descricao": "Fluxo de identificação e tratamento de clientes inadimplentes.",
              "cenarios": [
                "Identificação automática de faturas vencidas e não pagas.",
                "Envio de notificação de inadimplência para cliente.",
                "Suspensão automática de serviço após período de inadimplência (se aplicável).",
                "Registro de negociação de dívida e atualização do status do cliente.",
                "Falha no processo de notificação de inadimplência (crítico)."
              ]
            }
          },
          "estrategia_ferramentas_testes": {
            "estrategia": "Testes de API para os endpoints do módulo de Faturamento. Simulação de interações com serviços externos (ex: gateways de pagamento, serviços de e-mail) utilizando mocks ou stubs para isolar o módulo em teste. Foco na verificação da lógica de negócios, integridade dos dados e corretude dos fluxos.",
            "ferramentas": {
              "framework_teste": "Jest (ou framework de teste padrão do projeto)",
              "biblioteca_assertions": "Integrada ao Jest (ex: expect)",
              "mocks_stubs": "jest.fn(), jest.spyOn(). Para serviços HTTP externos, considerar msw (Mock Service Worker) ou Nock.",
              "test_runner": "Jest CLI (ou comando equivalente no projeto, ex: `npm test`, `yarn test`)"
            }
          },
          "ambiente_dados_teste": {
            "ambiente": "Utilizar um banco de dados de teste dedicado ou garantir que os testes sejam executados dentro de transações que são revertidas após cada teste para não afetar o banco de dados de desenvolvimento/produção. Configurar variáveis de ambiente específicas para o ambiente de teste (ex: chaves de API de sandbox para gateways de pagamento, URLs de serviços mockados).",
            "dados_massa": "Desenvolver scripts ou utilizar fábricas de dados (ex: com Faker.js) para popular o banco de dados de teste com um conjunto de dados iniciais que cubra diversos cenários (clientes com diferentes perfis, produtos/serviços variados, histórico de faturas, etc.). Garantir que os dados de teste sejam consistentes e representativos."
          },
          "integracao_cicd_validacao": {
            "integracao_cicd": "Os testes de integração devem ser adicionados como uma etapa na pipeline de CI/CD existente (ex: GitHub Actions, Jenkins, GitLab CI). A pipeline deve ser configurada para executar os testes automaticamente em cada push/pull request para branches protegidas (ex: main, develop). A falha em qualquer teste de integração deve causar a falha da pipeline. Configurar a geração e o arquivamento de relatórios de cobertura de testes (ex: LCOV report).",
            "processo_validacao": "Após a implementação, o coder-monk deve apresentar: 1. O código dos testes para revisão. 2. Um relatório de execução dos testes mostrando todos os testes passando. 3. Um relatório de cobertura de testes. A validação final será realizada pelo Arquiteto de Soluções, que verificará a adequação dos cenários testados, a qualidade do código dos testes e a cobertura alcançada em relação aos requisitos."
          }
        }
      },
      "acceptance_criteria": "Conjunto abrangente de testes de integração para o Módulo de Faturamento implementado e validado. Os testes devem cobrir os principais fluxos (geração de faturas, processamento de pagamentos, inadimplência) e cenários críticos detalhados no `context.detalhes_tecnicos_adicionais.fluxos_cenarios_criticos_faturamento`, alcançando no mínimo 85% de cobertura dos cenários críticos. Os testes devem estar integrados à pipeline de CI/CD, com execução automática e relatórios de cobertura. A documentação dos testes e a identificação dos componentes do módulo de faturamento devem ser entregues.",
      "suggested_mode": "coder-monk"
    }
  }
}
````

## File: docs/tasks/050#docs#elaborar_relatorio_auditoria.json
````json
{
  "taskId": "050#docs#elaborar_relatorio_auditoria",
  "status": "Done",
  "task_output": {
    "report_path": "docs/relatorio_auditoria_final_050.md",
    "summary": "Relatório final de auditoria consolidando análises de itens concluídos, pendentes, divergências, diagnóstico geral, análise de risco e recomendações acionáveis foi gerado com sucesso."
  },
  "error_message": null
}
````

## File: docs/tasks/060#chore#analisar_codigo_modulos_pessoais.json
````json
{
  "taskId": "060#chore#analisar_codigo_modulos_pessoais",
  "status": "Done",
  "summary": "Análise de código dos módulos de Gerenciamento Pessoal concluída. Detalhes sobre funcionalidades, estruturas de dados, complexidade, integrações, origem e esforço foram compilados.",
  "output_references": [
    "app/components/alimentacao/",
    "app/stores/alimentacaoStore.ts",
    "app/alimentacao/page.tsx",
    "app/components/autoconhecimento/",
    "app/stores/autoconhecimentoStore.ts",
    "app/autoconhecimento/page.tsx",
    "app/components/saude/",
    "app/saude/page.tsx",
    "app/components/sono/",
    "app/stores/sonoStore.ts",
    "app/sono/page.tsx",
    "app/components/lazer/",
    "app/stores/atividadesStore.ts",
    "app/stores/sugestoesStore.ts",
    "app/lazer/page.tsx"
  ],
  "analysis_details": {
    "geral": {
      "origem_hipotese": "A maioria dos módulos de Gerenciamento Pessoal parece ser parte do escopo funcional principal de uma aplicação de bem-estar/produtividade, não refletido no 'todo.md' inicial que focava apenas na infraestrutura Supabase. O desenvolvimento provavelmente seguiu um plano mais amplo não documentado no 'todo.md'.",
      "esforco_total_estimado_modulos_pessoais": "Alto. Envolve design de UI/UX, lógica de frontend complexa para cada módulo, gerenciamento de estado com Zustand e integrações com backend (Supabase para a maioria dos dados persistentes, e localStorage para algumas stores específicas como sono e sugestões de lazer)."
    },
    "modulos": [
      {
        "nome": "Alimentação",
        "arquivos_principais": [
          "app/components/alimentacao/LembreteHidratacao.tsx",
          "app/components/alimentacao/PlanejadorRefeicoes.tsx",
          "app/components/alimentacao/RegistroRefeicoes.tsx",
          "app/stores/alimentacaoStore.ts",
          "app/alimentacao/page.tsx"
        ],
        "funcionalidades_chave": [
          "Acompanhamento de hidratação (meta, registro de copos, progresso).",
          "Planejamento de refeições (CRUD para refeições com horário e descrição).",
          "Registro de refeições consumidas (CRUD com horário, descrição, tipo/ícone, foto simulada)."
        ],
        "estruturas_dados_stores": {
          "store": "alimentacaoStore.ts (Zustand)",
          "tipos_principais": [
            "RefeicaoPlanejada (id, user_id, horario, descricao, created_at)",
            "RegistroRefeicao (id, user_id, data, horario, descricao, tipoIcone, foto_url, created_at)",
            "HidratacaoConfig (id, user_id, meta_diaria_copos, updated_at)",
            "RegistroHidratacao (id, user_id, data, copos_bebidos, created_at, updated_at)"
          ],
          "tabelas_supabase": [
            "planned_meals",
            "meal_logs",
            "hydration_config",
            "hydration_logs"
          ]
        },
        "complexidade_estimada": "Média",
        "integracoes": [
          "Supabase (CRUD completo para 4 tabelas, criação de dados padrão)",
          "AuthContext (user.id)",
          "Componentes de UI (Button, Input, Card, etc.)",
          "Link para módulo de Receitas"
        ],
        "origem_hipotese_modulo": "Requisito funcional essencial para bem-estar, não detalhado no 'todo.md'.",
        "esforco_desenvolvimento_estimado_modulo": "Médio-Alto"
      },
      {
        "nome": "Autoconhecimento",
        "arquivos_principais": [
          "app/components/autoconhecimento/EditorNotas.tsx",
          "app/components/autoconhecimento/ListaNotas.tsx",
          "app/components/autoconhecimento/ModoRefugio.tsx",
          "app/stores/autoconhecimentoStore.ts",
          "app/autoconhecimento/page.tsx"
        ],
        "funcionalidades_chave": [
          "Criação e edição de notas (título, conteúdo, tags, imagem URL) por seções (Quem sou, Meus porquês, Meus padrões).",
          "Listagem, busca e remoção de notas.",
          "Modo Refúgio (interface simplificada)."
        ],
        "estruturas_dados_stores": {
          "store": "autoconhecimentoStore.ts (Zustand)",
          "tipos_principais": [
            "NotaAutoconhecimento (id, user_id, titulo, conteudo, secao, tags, imagemUrl, created_at, updated_at)"
          ],
          "tabelas_supabase": [
            "self_knowledge_notes"
          ]
        },
        "complexidade_estimada": "Média",
        "integracoes": [
          "Supabase (CRUD para notas)",
          "AuthContext (user.id)",
          "Componentes de UI (Button, Input, Textarea, Badge, Card, Modal)"
        ],
        "origem_hipotese_modulo": "Funcionalidade central para autoconhecimento, não mencionada no 'todo.md'.",
        "esforco_desenvolvimento_estimado_modulo": "Médio"
      },
      {
        "nome": "Saúde",
        "arquivos_principais": [
          "app/components/saude/MonitoramentoHumor.tsx",
          "app/components/saude/HumorCalendar.tsx",
          "app/components/saude/FatoresHumor.tsx",
          "app/components/saude/RegistroMedicamentos.tsx",
          "app/components/saude/MedicamentosList.tsx",
          "app/saude/page.tsx"
        ],
        "funcionalidades_chave": [
          "Monitoramento de Humor: Registro diário (nível, fatores, notas), visualização em calendário, estatísticas (média, tendência, fatores comuns).",
          "Registro de Medicamentos: Cadastro (nome, dosagem, frequência, horários, intervalo, etc.), registro de tomadas, listagem com status e próxima dose."
        ],
        "estruturas_dados_stores": {
          "store": "appStore.ts (Zustand - Global, contém estados de Saúde)",
          "tipos_principais": [
            "RegistroHumor (id, data, nivel, fatores, notas)",
            "Medicamento (id, nome, dosagem, frequencia, horarios, observacoes, dataInicio, ultimaTomada, intervalo)"
          ],
          "tabelas_supabase": [
            "Inferido para registros de humor e medicamentos (nomes exatos não presentes nos arquivos lidos, mas padrão de outras stores sugere)"
          ]
        },
        "complexidade_estimada": "Alta (considerando os dois submódulos)",
        "integracoes": [
          "Supabase (inferido para persistência)",
          "AuthContext (provavelmente para user.id)",
          "Componentes de UI (Card, Button, Input, Textarea, Badge, Modal, Select, StatCard)"
        ],
        "origem_hipotese_modulo": "Funcionalidades essenciais para saúde e bem-estar, não mencionadas no 'todo.md'.",
        "esforco_desenvolvimento_estimado_modulo": "Alto"
      },
      {
        "nome": "Sono",
        "arquivos_principais": [
          "app/components/sono/RegistroSono.tsx",
          "app/components/sono/ConfiguracaoLembretes.tsx",
          "app/components/sono/VisualizadorSemanal.tsx",
          "app/stores/sonoStore.ts",
          "app/sono/page.tsx"
        ],
        "funcionalidades_chave": [
          "Registro de sono (início, fim, qualidade, notas), cálculo de duração.",
          "Configuração de lembretes para dormir/acordar (horário, dias da semana, ativação).",
          "Visualizador semanal de sono (gráfico de horas, estatísticas de média, melhor/pior dia)."
        ],
        "estruturas_dados_stores": {
          "store": "sonoStore.ts (Zustand com persistência local)",
          "tipos_principais": [
            "RegistroSono (id, inicio, fim, qualidade, notas)",
            "ConfiguracaoLembrete (id, tipo, horario, diasSemana, ativo)"
          ],
          "tabelas_supabase": [
            "Nenhuma (usa localStorage)"
          ]
        },
        "complexidade_estimada": "Alta",
        "integracoes": [
          "localStorage (via Zustand persist middleware)",
          "Componentes de UI (Button, Input, Textarea, Select, Slider, Badge)"
        ],
        "origem_hipotese_modulo": "Funcionalidade comum em apps de bem-estar, não mencionada no 'todo.md'. Decisão por persistência local é uma divergência de padrão.",
        "esforco_desenvolvimento_estimado_modulo": "Alto"
      },
      {
        "nome": "Lazer",
        "arquivos_principais": [
          "app/components/lazer/AtividadesLazer.tsx",
          "app/components/lazer/SugestoesDescanso.tsx",
          "app/components/lazer/TemporizadorLazer.tsx",
          "app/stores/atividadesStore.ts",
          "app/stores/sugestoesStore.ts",
          "app/lazer/page.tsx"
        ],
        "funcionalidades_chave": [
          "Registro de atividades de lazer (CRUD, categoria, duração, data, status concluída), estatísticas.",
          "Sugestões de descanso aleatórias e categorizadas, com sistema de favoritos.",
          "Temporizador de lazer configurável com presets e alerta sonoro."
        ],
        "estruturas_dados_stores": {
          "store": "atividadesStore.ts (Zustand com Supabase), sugestoesStore.ts (Zustand com localStorage)",
          "tipos_principais": [
            "Atividade (id, user_id, nome, categoria, duracao, observacoes, data, concluida, created_at)",
            "sugestoesFavoritas (array de strings)"
          ],
          "tabelas_supabase": [
            "user_activities (para atividadesStore)"
          ]
        },
        "complexidade_estimada": "Alta",
        "integracoes": [
          "Supabase (para atividadesStore)",
          "localStorage (para sugestoesStore)",
          "AuthContext (provavelmente para user.id em atividadesStore)",
          "Componentes de UI (Button, Input, Textarea, Badge, Select, StatCard, Alert, Slider)"
        ],
        "origem_hipotese_modulo": "Funcionalidades complementares para bem-estar, não mencionadas no 'todo.md'. Mistura de persistência Supabase e local.",
        "esforco_desenvolvimento_estimado_modulo": "Alto"
      }
    ]
  }
}
````

## File: docs/tasks/060#chore#refine_implementar_REC_002.json
````json
{
  "taskId": "060#chore#refine_implementar_REC_002",
  "status": "Done",
  "task_output": {
    "refined_task_id": "020#test#implementar_REC_002",
    "updated_delegation_details": {
      "description": "Implementar Recomendação 2: Implementação de Testes de Integração para Módulo de Faturamento",
      "context": {
        "id_recomendacao_original": "REC-002",
        "tarefa_acionavel_especifica": "Desenvolver e implementar testes de integração para o Módulo de Faturamento, cobrindo fluxos e cenários críticos detalhados no `context.detalhes_tecnicos_adicionais`. Integrar à pipeline CI/CD com relatórios.",
        "responsavel_justificativa": "coder-monk: Responsável pela escrita de código, incluindo testes automatizados.",
        "prioridade_justificativa": "Alta: Mitiga o risco de erros financeiros e garante a estabilidade do core business.",
        "sequencia_etapas_conclusao": [
          "Identificação dos Componentes: Localizar e documentar os componentes de software (arquivos, módulos, APIs) que constituem o Módulo de Faturamento. Dada a nova informação em `localizacao_modulo_faturamento`, esta etapa pode resultar na confirmação da ausência do módulo.",
          "Mapeamento Detalhado de Fluxos e Cenários: Detalhar os fluxos de geração de faturas, processamento de pagamentos e tratamento de inadimplência, identificando cenários normais, alternativos e críticos (conforme `context.detalhes_tecnicos_adicionais.fluxos_cenarios_criticos_faturamento`). Esta etapa depende da existência e identificação do módulo.",
          "Definição da Estratégia e Ferramentas: Confirmar e configurar as ferramentas (Jest, msw/mocks) e a estratégia de teste (testes de API, simulação de serviços externos) conforme `context.detalhes_tecnicos_adicionais.estrategia_ferramentas_testes`.",
          "Configuração do Ambiente e Dados de Teste: Preparar o ambiente de teste (banco de dados dedicado ou transacional, variáveis de ambiente) e desenvolver scripts/fábricas para geração de dados de massa necessários (conforme `context.detalhes_tecnicos_adicionais.ambiente_dados_teste`).",
          "Desenvolvimento dos Scripts de Teste: Implementar os scripts de teste para cada cenário mapeado, visando 85% de cobertura dos cenários críticos.",
          "Execução e Depuração: Executar os testes, depurar falhas e garantir a estabilidade dos mesmos.",
          "Integração à Pipeline de CI/CD: Integrar a suíte de testes à pipeline de CI/CD, garantindo execução automática, falha da pipeline em caso de erro nos testes, e geração de relatórios de cobertura (conforme `context.detalhes_tecnicos_adicionais.integracao_cicd_validacao`).",
          "Documentação e Validação: Documentar os testes implementados e os resultados. Submeter para validação pelo Arquiteto de Soluções."
        ],
        "criterios_sucesso_metodo_verificacao": "Testes de integração executando com sucesso na CI/CD (se o módulo existir e for testável). Cobertura mínima de 85% dos cenários críticos mapeados (ver `context.detalhes_tecnicos_adicionais`). Código dos testes e cobertura validados pelo Arquiteto de Soluções. Se o módulo não for encontrado, o critério de sucesso para a etapa de identificação é a documentação clara dessa ausência e a comunicação do bloqueio.",
        "detalhes_tecnicos_adicionais": {
          "cobertura_testes_criticos": "85%",
          "localizacao_modulo_faturamento": "Investigação inicial (conforme feedback da tarefa anterior) indica que os componentes do Módulo de Faturamento, conforme descrito (geração de faturas para clientes, processamento de pagamentos, tratamento de inadimplência), não foram encontrados nos caminhos sugeridos (`app/financas/`, `app/lib/billingService.ts`) nem através de busca por termos chave. Os arquivos em `app/financas/` (ex: `app/components/financas/AdicionarDespesa.tsx`, `RastreadorGastos.tsx`) parecem ser focados em finanças pessoais do usuário, e não em um sistema de faturamento para clientes da aplicação. **Pré-requisito:** Antes de prosseguir com a implementação dos testes de integração, é necessário: 1. Confirmar se o Módulo de Faturamento existe e, em caso afirmativo, identificar sua localização exata. 2. Se o módulo não existir, ele precisará ser desenvolvido primeiro. Esta tarefa de teste pressupõe a existência e identificabilidade do módulo.",
          "fluxos_cenarios_criticos_faturamento": {
            "geracao_faturas": {
              "descricao": "Fluxo de geração de faturas para clientes.",
              "cenarios": [
                "Geração de fatura para novo cliente com dados válidos.",
                "Geração de fatura recorrente para cliente existente.",
                "Geração de fatura com múltiplos itens/serviços e cálculo correto do total.",
                "Geração de fatura aplicando descontos e/ou acréscimos corretamente.",
                "Tentativa de geração de fatura com dados de cliente inválidos (crítico).",
                "Falha na comunicação com serviço de numeração de faturas (se aplicável) (crítico)."
              ]
            },
            "processamento_pagamentos": {
              "descricao": "Fluxo de processamento de pagamentos recebidos.",
              "cenarios": [
                "Processamento de pagamento bem-sucedido via cartão de crédito (simulado).",
                "Processamento de pagamento bem-sucedido via boleto bancário (simulado).",
                "Tentativa de processamento de pagamento com cartão recusado (saldo insuficiente, dados inválidos) (crítico).",
                "Processamento de pagamento parcial e atualização correta do saldo da fatura.",
                "Processamento de reembolso total/parcial de um pagamento.",
                "Falha na comunicação com gateway de pagamento (crítico)."
              ]
            },
            "tratamento_inadimplencia": {
              "descricao": "Fluxo de identificação e tratamento de clientes inadimplentes.",
              "cenarios": [
                "Identificação automática de faturas vencidas e não pagas.",
                "Envio de notificação de inadimplência para cliente.",
                "Suspensão automática de serviço após período de inadimplência (se aplicável).",
                "Registro de negociação de dívida e atualização do status do cliente.",
                "Falha no processo de notificação de inadimplência (crítico)."
              ]
            }
          },
          "estrategia_ferramentas_testes": {
            "estrategia": "Testes de API para os endpoints do módulo de Faturamento. Simulação de interações com serviços externos (ex: gateways de pagamento, serviços de e-mail) utilizando mocks ou stubs para isolar o módulo em teste. Foco na verificação da lógica de negócios, integridade dos dados e corretude dos fluxos.",
            "ferramentas": {
              "framework_teste": "Jest (ou framework de teste padrão do projeto)",
              "biblioteca_assertions": "Integrada ao Jest (ex: expect)",
              "mocks_stubs": "jest.fn(), jest.spyOn(). Para serviços HTTP externos, considerar msw (Mock Service Worker) ou Nock.",
              "test_runner": "Jest CLI (ou comando equivalente no projeto, ex: `npm test`, `yarn test`)"
            }
          },
          "ambiente_dados_teste": {
            "ambiente": "Utilizar um banco de dados de teste dedicado ou garantir que os testes sejam executados dentro de transações que são revertidas após cada teste para não afetar o banco de dados de desenvolvimento/produção. Configurar variáveis de ambiente específicas para o ambiente de teste (ex: chaves de API de sandbox para gateways de pagamento, URLs de serviços mockados).",
            "dados_massa": "Desenvolver scripts ou utilizar fábricas de dados (ex: com Faker.js) para popular o banco de dados de teste com um conjunto de dados iniciais que cubra diversos cenários (clientes com diferentes perfis, produtos/serviços variados, histórico de faturas, etc.). Garantir que os dados de teste sejam consistentes e representativos."
          },
          "integracao_cicd_validacao": {
            "integracao_cicd": "Os testes de integração devem ser adicionados como uma etapa na pipeline de CI/CD existente (ex: GitHub Actions, Jenkins, GitLab CI). A pipeline deve ser configurada para executar os testes automaticamente em cada push/pull request para branches protegidas (ex: main, develop). A falha em qualquer teste de integração deve causar a falha da pipeline. Configurar a geração e o arquivamento de relatórios de cobertura de testes (ex: LCOV report).",
            "processo_validacao": "Após a implementação, o coder-monk deve apresentar: 1. O código dos testes para revisão. 2. Um relatório de execução dos testes mostrando todos os testes passando. 3. Um relatório de cobertura de testes. A validação final será realizada pelo Arquiteto de Soluções, que verificará a adequação dos cenários testados, a qualidade do código dos testes e a cobertura alcançada em relação aos requisitos."
          }
        }
      },
      "acceptance_criteria": "Conjunto abrangente de testes de integração para o Módulo de Faturamento implementado e validado (se o módulo existir e for testável). Os testes devem cobrir os principais fluxos (geração de faturas, processamento de pagamentos, inadimplência) e cenários críticos detalhados no `context.detalhes_tecnicos_adicionais.fluxos_cenarios_criticos_faturamento`, alcançando no mínimo 85% de cobertura dos cenários críticos. Os testes devem estar integrados à pipeline de CI/CD, com execução automática e relatórios de cobertura. A documentação dos testes e a identificação dos componentes do módulo de faturamento (ou a constatação de sua ausência) devem ser entregues.",
      "suggested_mode": "coder-monk"
    }
  }
}
````

## File: docs/tasks/070#docs#documentar_divergencias_modulos_pessoais.json
````json
{
  "taskId": "070#docs#documentar_divergencias_modulos_pessoais",
  "status": "Done",
  "summary": "Relatório de divergências dos módulos de Gerenciamento Pessoal (Alimentação, Autoconhecimento, Saúde, Sono, Lazer) em relação ao 'todo.md' foi gerado com sucesso.",
  "output_references": [
    ".state/reports/070#docs#documentar_divergencias_modulos_pessoais_report.md"
  ],
  "sub_tasks": []
}
````

## File: docs/tasks/080#chore#analisar_codigo_modulos_produtividade.json
````json
{
  "taskId": "080#chore#analisar_codigo_modulos_produtividade",
  "status": "Done",
  "output_references": [
    {
      "type": "analysis_report",
      "description": "Relatório de análise de código para os módulos de Produtividade e Estudos (Estudos, Concursos, Hiperfocos).",
      "details": {
        "module_Estudos": {
          "functionalities": [
            "Registro de Sessões de Estudo (CRUD, estatísticas)",
            "Temporizador Pomodoro (configurável, ciclos)",
            "Visualizador de Materiais (Checklist, Markdown, com busca local/Drive)",
            "Simulados (carregar JSON, gerar de banco de questões, realizar, ver resultados, histórico)"
          ],
          "data_structures": [
            "SessaoEstudo (para registroEstudosStore)",
            "ConfiguracaoPomodoro (para pomodoroStore)",
            "SimuladoData, Questao, SimuladoMetadata (para simuladoStore)",
            "HistoricoSimuladoEntry, TentativaSimulado (para historicoSimuladosStore)"
          ],
          "complexity": "Média",
          "integrations": [
            "Supabase (config Pomodoro)",
            "LocalStorage (registro de estudos, histórico simulados)",
            "API local /api/materiais/",
            "API externa /api/drive/carregar-material (inferida)",
            "Stores: pomodoroStore, registroEstudosStore, simuladoStore, historicoSimuladosStore"
          ],
          "origin_hypothesis": "Desenvolvimento customizado, foco em ferramentas de produtividade para estudantes.",
          "effort_estimation": "Médio a Alto"
        },
        "module_Concursos": {
          "functionalities": [
            "Gerenciamento de Concursos (CRUD, conteúdo programático)",
            "Gerenciamento de Questões (CRUD, associação a concursos)",
            "Geração de Contexto de Concurso (LLM simulado no frontend, importação JSON)",
            "Geração de Questões (LLM real via API Perplexity, importação)",
            "Importação de Concurso (JSON de LLM externa)"
          ],
          "data_structures": [
            "Concurso, ConteudoProgramatico (para concursosStore)",
            "Questao, AlternativaQuestao (para questoesStore)",
            "QuestaoLLM (para API gerar-questao)"
          ],
          "complexity": "Alta",
          "integrations": [
            "Supabase (concursos, questões)",
            "Perplexity AI (API /api/gerar-questao)",
            "Stores: concursosStore, questoesStore",
            "LocalStorage (passagem de questões para simulado personalizado)"
          ],
          "origin_hypothesis": "Desenvolvimento customizado com funcionalidades de IA.",
          "effort_estimation": "Alto"
        },
        "module_Hiperfocos": {
          "functionalities": [
            "Conversor de Interesses (cria projeto de hiperfoco com tarefas)",
            "Visualizador de Projetos em Árvore (CRUD de tarefas/subtarefas)",
            "Sistema de Alternância (gerencia sessões de transição entre hiperfocos)",
            "Temporizador de Foco (para hiperfocos específicos, com alarme)"
          ],
          "data_structures": [
            "HiperfocoProjeto, HiperfocoTarefa, HiperfocoSessao (para hiperfocosStore)",
            "CORES_HIPERFOCOS (constante de cores)"
          ],
          "complexity": "Alta",
          "integrations": [
            "Supabase (projetos, tarefas, sessões de hiperfoco)",
            "Store: hiperfocosStore"
          ],
          "origin_hypothesis": "Desenvolvimento customizado para gerenciamento de foco profundo.",
          "effort_estimation": "Alto"
        }
      }
    }
  ],
  "error_message": null,
  "new_tasks_to_integrate": []
}
````

## File: docs/tasks/090#docs#documentar_divergencias_modulos_produtividade.json
````json
{
  "taskId": "090#docs#documentar_divergencias_modulos_produtividade",
  "status": "Done",
  "output_references": [
    {
      "type": "divergence_report",
      "description": "Relatório de divergências para os Módulos de Produtividade e Estudos (Estudos, Concursos, Hiperfocos) em relação ao todo.md.",
      "path": ".state/reports/090#docs#documentar_divergencias_modulos_produtividade_report.md"
    }
  ],
  "error_message": null,
  "sub_tasks_created": [],
  "new_tasks_to_integrate": []
}
````

## File: docs/tasks/100#chore#analisar_codigo_modulo_financas.json
````json
{
  "taskId": "100#chore#analisar_codigo_modulo_financas",
  "status": "Done",
  "output_references": [
    ".state/tasks/100#chore#analisar_codigo_modulo_financas.json"
  ],
  "error_message": null,
  "new_tasks_to_integrate": {
    "description": "Relatório de Análise do Módulo de Finanças",
    "items": [
      {
        "id": "TEMP#ANALISE_FINANCAS_FUNCIONALIDADES",
        "description": "Funcionalidades Chave do Módulo de Finanças",
        "status": "Done",
        "details": [
          "Adicionar Despesa: Formulário para registrar novas despesas com descrição, valor e categoria. Feedback visual após o registro. Componente: app/components/financas/AdicionarDespesa.tsx",
          "Calendário de Pagamentos: Gerenciamento de pagamentos recorrentes. Visualização mensal, navegação entre meses, adição de novos pagamentos (descrição, valor, dia de vencimento, categoria), marcação de pagamentos como pagos/não pagos. Destaque visual para pagamentos do dia e atrasados. Componente: app/components/financas/CalendarioPagamentos.tsx",
          "Envelopes Virtuais: Criação e gerenciamento de 'envelopes' para orçamento. Adição, edição, remoção de envelopes (nome, valor alocado, cor). Registro de gastos dentro dos envelopes. Visualização do progresso de gastos por envelope. Componente: app/components/financas/EnvelopesVirtuais.tsx",
          "Rastreador de Gastos: Visualização de despesas por categoria através de um gráfico de pizza e lista detalhada. Cálculo de totais e percentuais de gastos por categoria. Componente: app/components/financas/RastreadorGastos.tsx"
        ]
      },
      {
        "id": "TEMP#ANALISE_FINANCAS_ESTRUTURA_DADOS_STORE",
        "description": "Estruturas de Dados e Store Zustand (app/stores/financasStore.ts)",
        "status": "Done",
        "details": {
          "tipos_principais": [
            "Categoria: id, user_id, nome, cor, icone, created_at.",
            "Transacao: id, user_id, data (YYYY-MM-DD), valor, descricao, categoriaId, tipo ('receita' | 'despesa'), created_at.",
            "Envelope: id, user_id, nome, cor, valorAlocado, valorUtilizado, created_at.",
            "PagamentoRecorrente: id, user_id, descricao, valor, dataVencimento (dia do mês), categoriaId, proximoPagamento (YYYY-MM-DD), pago (boolean), created_at."
          ],
          "estado_store": [
            "categorias: Categoria[]",
            "transacoes: Transacao[]",
            "envelopes: Envelope[]",
            "pagamentosRecorrentes: PagamentoRecorrente[]",
            "currentUser: User | null (do Supabase)"
          ],
          "acoes": [
            "setCurrentUser: Define o usuário logado.",
            "fetchFinancasData: Busca todos os dados financeiros do usuário logado no Supabase.",
            "Categorias: adicionarCategoria, atualizarCategoria, removerCategoria.",
            "Transações: adicionarTransacao, removerTransacao.",
            "Envelopes: adicionarEnvelope, atualizarEnvelope, removerEnvelope, registrarGastoEnvelope.",
            "Pagamentos Recorrentes: adicionarPagamentoRecorrente, atualizarPagamentoRecorrente, removerPagamentoRecorrente, marcarPagamentoComoPago (com lógica para calcular o próximo vencimento)."
          ],
          "integracao_supabase": "Todas as ações de CRUD interagem com tabelas do Supabase (finance_categories, finance_transactions, finance_envelopes, finance_recurring_payments). O user_id é usado para filtrar os dados por usuário. Comentários sobre a necessidade de configurar subscriptions Realtime no StoreInitializer.tsx."
        }
      },
      {
        "id": "TEMP#ANALISE_FINANCAS_COMPLEXIDADE",
        "description": "Complexidade do Módulo de Finanças",
        "status": "Done",
        "details": {
          "componentes": [
            "AdicionarDespesa.tsx: Baixa complexidade.",
            "CalendarioPagamentos.tsx: Média complexidade (lógica de datas, UI condicional).",
            "EnvelopesVirtuais.tsx: Média complexidade (CRUD, cálculo de progresso).",
            "RastreadorGastos.tsx: Média complexidade (agregação de dados, gráfico com recharts, tooltip customizado)."
          ],
          "store_zustand": "Média para Alta complexidade (múltiplas entidades, lógica de cálculo de datas em pagamentos recorrentes, integração assíncrona com Supabase para CRUD, potencial para Realtime)."
        }
      },
      {
        "id": "TEMP#ANALISE_FINANCAS_INTEGRACOES",
        "description": "Integrações do Módulo de Finanças",
        "status": "Done",
        "details": {
          "internas": [
            "Forte integração entre os componentes de Finanças e o app/stores/financasStore.ts.",
            "Uso de componentes de UI de app/components/ui/."
          ],
          "externas": [
            "Supabase: Persistência de dados (Auth, Database) via app/stores/financasStore.ts.",
            "Lucide-react: Ícones.",
            "Recharts: Gráfico de pizza em RastreadorGastos.tsx.",
            "Zustand: Gerenciamento de estado global."
          ]
        }
      },
      {
        "id": "TEMP#ANALISE_FINANCAS_HIPOTESE_ORIGEM",
        "description": "Hipótese de Origem do Módulo de Finanças",
        "status": "Done",
        "details": [
          "Funcionalidade central de um aplicativo de gerenciamento financeiro pessoal.",
          "Desenvolvido com abordagem 'backend-as-a-service' (Supabase).",
          "Frontend moderno (React/Next.js, Zustand).",
          "Sistema multiusuário com dados financeiros privados (uso de user_id)."
        ]
      },
      {
        "id": "TEMP#ANALISE_FINANCAS_ESTIMATIVA_ESFORCO",
        "description": "Estimativa de Esforço (Entendimento/Refatoração/Expansão)",
        "status": "Done",
        "details": {
          "entendimento_completo": "2-4 horas.",
          "refatoracao_pequena_media": "4-8 horas (melhorar tratamento de erros, consistência, implementar Realtime subscriptions).",
          "expansao_novas_funcionalidades": {
            "adicionar_receitas": "2-4 horas.",
            "relatorios_avancados": "8-16 horas.",
            "metas_financeiras": "6-12 horas.",
            "importacao_exportacao_csv": "4-8 horas."
          }
        }
      }
    ]
  }
}
````

## File: docs/tasks/110#docs#documentar_divergencia_modulo_financas.json
````json
{
  "taskId": "110#docs#documentar_divergencia_modulo_financas",
  "status": "Done",
  "output_references": [
    "docs/divergencia_modulo_financas.md"
  ],
  "error_message": null,
  "new_tasks_to_integrate": null
}
````

## File: docs/tasks/120#chore#analisar_codigo_modulo_receitas.json
````json
{
  "taskId": "120#chore#analisar_codigo_modulo_receitas",
  "status": "Done",
  "output_references": [
    "docs/analise_modulo_receitas.md"
  ],
  "error_message": null,
  "new_tasks_to_integrate": []
}
````

## File: docs/tasks/130#docs#documentar_divergencia_modulo_receitas.json
````json
{
  "taskId": "130#docs#documentar_divergencia_modulo_receitas",
  "status": "Done",
  "output_references": [
    "docs/divergencia_modulo_receitas.md"
  ],
  "error_message": null,
  "new_tasks_to_integrate": []
}
````

## File: docs/tasks/140#chore#analisar_codigo_funcionalidades_centrais.json
````json
{
  "taskId": "140#chore#analisar_codigo_funcionalidades_centrais",
  "status": "Done",
  "output_references": [
    "docs/analise_funcionalidades_centrais.md"
  ],
  "error_message": null,
  "new_tasks_to_integrate": {
    "description": null,
    "items": []
  }
}
````

## File: docs/tasks/150#docs#documentar_divergencias_funcionalidades_centrais.json
````json
{
  "taskId": "150#docs#documentar_divergencias_funcionalidades_centrais",
  "status": "Done",
  "output_references": [
    "docs/divergencias_funcionalidades_centrais.md"
  ],
  "error_message": null,
  "new_tasks_to_integrate": {
    "description": null,
    "items": []
  }
}
````

## File: docs/tasks/160#chore#consolidar_relatorio_divergencias.json
````json
{
  "taskId": "160#chore#consolidar_relatorio_divergencias",
  "status": "Done",
  "summary": "Relatório consolidado de divergências gerado com sucesso em .state/reports/040#feat#identificar_divergencias_report.md.",
  "output_references": [
    ".state/reports/040#feat#identificar_divergencias_report.md"
  ],
  "sub_tasks": [],
  "error_message": null
}
````

## File: docs/analise_funcionalidades_centrais.md
````markdown
# Relatório de Análise de Código: Funcionalidades Centrais e Estruturais

**Tarefa ID:** `140#chore#analisar_codigo_funcionalidades_centrais`

Este relatório detalha a análise das funcionalidades centrais e estruturais do projeto, conforme especificado na tarefa. A análise foca em identificar funcionalidades chave, arquitetura, complexidade, integrações, origem inferida e uma estimativa do esforço de desenvolvimento original.

## 1. Dashboard/Início

**Arquivos Analisados:**
*   [`app/components/inicio/ChecklistMedicamentos.tsx`](app/components/inicio/ChecklistMedicamentos.tsx:1)
*   [`app/components/inicio/LembretePausas.tsx`](app/components/inicio/LembretePausas.tsx:1)
*   [`app/components/inicio/ListaPrioridades.tsx`](app/components/inicio/ListaPrioridades.tsx:1)
*   [`app/components/inicio/PainelDia.tsx`](app/components/inicio/PainelDia.tsx:1)
*   [`app/components/inicio/ProximaProvaCard.tsx`](app/components/inicio/ProximaProvaCard.tsx:1)
*   [`app/stores/prioridadesStore.ts`](app/stores/prioridadesStore.ts:1)
*   [`app/page.tsx`](app/page.tsx:1) (Página principal que integra os componentes do dashboard)

### 1.1. Funcionalidades Chave
*   **PainelDia:** Visualização e gerenciamento de blocos de tempo para o dia atual, com atividades e categorias. Permite adicionar, editar e remover blocos.
*   **ListaPrioridades:** Gerenciamento das três principais prioridades do dia, com opção de marcar como concluída, editar e visualizar histórico de prioridades de dias anteriores. Integra prioridades de concursos.
*   **ChecklistMedicamentos:** Exibe medicamentos diários agrupados por tipo (Anfetaminas, Antidepressivos, Suplementos, Outros), permitindo marcar como tomados.
*   **LembretePausas:** Implementa um temporizador Pomodoro (25 min foco, 5 min pausa) para auxiliar na gestão do tempo e pausas.
*   **ProximaProvaCard:** Exibe as próximas provas de concursos cadastradas, com contagem regressiva e link para detalhes.
*   **Página Principal (`app/page.tsx`):** Integra todos os componentes do dashboard, utiliza um hook `useDashboard` para buscar e processar dados resumidos (prioridades pendentes/concluídas, próximos compromissos), e aplica preferências visuais do usuário.

### 1.2. Arquitetura
*   **UI:** Componentes React funcionais, utilizando hooks para estado e lógica. A página principal estrutura o layout do dashboard.
*   **Gerenciamento de Estado:**
    *   Zustand é utilizado para gerenciar o estado global/local.
        *   [`prioridadesStore.ts`](app/stores/prioridadesStore.ts:1): Gerencia o CRUD de prioridades e a lógica de histórico.
        *   [`app/store/index.ts`](app/store/index.ts:1) (referenciada por `PainelDia` e `ChecklistMedicamentos` via `useAppStore`): Gerencia blocos de tempo, medicamentos e outros dados da aplicação.
*   **Backend:** Interação com Supabase para persistência de dados (prioridades, blocos de tempo, medicamentos, concursos).
*   **Utilitários:** `date-fns` para manipulação e formatação de datas.

### 1.3. Complexidade
*   **Moderada a Alta.**
    *   `ListaPrioridades`: Lógica de histórico, diferenciação de tipos de prioridade (geral vs. concurso) e limite de 3 prioridades diárias.
    *   `PainelDia`: CRUD completo para blocos de tempo, ordenação e categorização visual.
    *   `ChecklistMedicamentos`: Lógica de filtragem de medicamentos diários, agrupamento por tipo (inferido do nome/observações) e persistência do status "tomado".
    *   `ProximaProvaCard`: Filtragem e ordenação de concursos futuros.
    *   `app/page.tsx`: Orquestração de múltiplos componentes e dados do hook `useDashboard`.
    *   `prioridadesStore.ts`: Lógica de CRUD com Supabase, incluindo tratamento de datas e tipos.

### 1.4. Integrações
*   Zustand (para estado global e local).
*   Supabase (para backend e persistência de dados).
*   `date-fns` (para manipulação de datas).
*   Lucide Icons (para iconografia).
*   Componentes da biblioteca de UI local (`app/components/ui/`).

### 1.5. Origem (Inferida)
*   Desenvolvimento customizado para atender aos requisitos específicos da aplicação de dashboard e gerenciamento pessoal.

### 1.6. Esforço Estimado (Original)
*   **Significativo.** A combinação da lógica de UI de cada componente, o gerenciamento de estado com Zustand e a integração com o Supabase para múltiplas entidades (prioridades, blocos de tempo, medicamentos, concursos) representam um esforço considerável de desenvolvimento.

## 2. Perfil do Usuário

**Arquivos Analisados:**
*   [`app/components/perfil/InformacoesPessoais.tsx`](app/components/perfil/InformacoesPessoais.tsx:1)
*   [`app/components/perfil/MetasDiarias.tsx`](app/components/perfil/MetasDiarias.tsx:1)
*   [`app/components/perfil/PreferenciasVisuais.tsx`](app/components/perfil/PreferenciasVisuais.tsx:1)
*   [`app/stores/perfilStore.ts`](app/stores/perfilStore.ts:1)
*   [`app/perfil/page.tsx`](app/perfil/page.tsx:1)

### 2.1. Funcionalidades Chave
*   **InformacoesPessoais:** Permite ao usuário visualizar e editar seu nome.
*   **MetasDiarias:** Permite ao usuário definir e personalizar metas diárias para horas de sono, tarefas prioritárias, copos de água e pausas programadas.
*   **PreferenciasVisuais:** Permite ao usuário ativar/desativar opções de acessibilidade como alto contraste, redução de estímulos e texto grande. Também controla preferências gerais como notificações e pausas ativas.
*   **Página de Perfil:** Integra os componentes acima e oferece uma opção para resetar as configurações do perfil para os valores padrão.

### 2.2. Arquitetura
*   **UI:** Componentes React funcionais.
*   **Gerenciamento de Estado:** Zustand (`perfilStore.ts`) é usado para gerenciar os dados do perfil do usuário, incluindo nome, metas e preferências.
*   **Backend:** Interação com Supabase para persistir os dados do perfil.
*   **Acessibilidade:** As preferências visuais manipulam classes CSS no elemento `<html>` para aplicar os estilos correspondentes.

### 2.3. Complexidade
*   **Moderada.**
    *   Cada componente gerencia seu próprio formulário de edição e interage com a `perfilStore`.
    *   `PreferenciasVisuais` tem a lógica adicional de aplicar/remover classes CSS globais.
    *   `perfilStore.ts` lida com o CRUD do perfil no Supabase, incluindo a criação de um perfil padrão se não existir.

### 2.4. Integrações
*   Zustand.
*   Supabase.
*   Lucide Icons.
*   Componentes da biblioteca de UI local.

### 2.5. Origem (Inferida)
*   Desenvolvimento customizado para gerenciamento das configurações e dados do usuário.

### 2.6. Esforço Estimado (Original)
*   **Moderado.** A criação dos formulários, a lógica de estado com Zustand e a integração com o Supabase para persistência representam um esforço de desenvolvimento considerável, mas mais contido que o dashboard.

## 3. Interface de Autenticação (UI)

**Arquivos Analisados:**
*   [`app/auth/callback/route.ts`](app/auth/callback/route.ts:1)
*   [`app/auth/login/page.tsx`](app/auth/login/page.tsx:1)
*   [`app/auth/signup/page.tsx`](app/auth/signup/page.tsx:1)
*   [`app/context/AuthContext.tsx`](app/context/AuthContext.tsx:1)

### 3.1. Funcionalidades Chave
*   **Login:** Permite aos usuários entrarem com email/senha ou via Google OAuth.
*   **Signup:** Permite que novos usuários criem uma conta com email/senha.
*   **Callback:** Rota para lidar com o redirecionamento do OAuth do Supabase.
*   **AuthContext:** Provê o estado da sessão de autenticação (usuário, sessão, status de carregamento) para toda a aplicação.

### 3.2. Arquitetura
*   **UI:** Páginas Next.js dedicadas para login e signup, utilizando componentes de UI customizados.
*   **Gerenciamento de Estado:** React Context (`AuthContext.tsx`) para gerenciar o estado da autenticação globalmente.
*   **Backend:** Interação direta com `supabase.auth` para todas as operações de autenticação (signInWithPassword, signInWithOAuth, signUp, exchangeCodeForSession, signOut, getSession, onAuthStateChange).

### 3.3. Complexidade
*   **Moderada.**
    *   Implementação dos fluxos de login (email/senha e OAuth) e cadastro.
    *   Tratamento de erros e feedback para o usuário.
    *   Gerenciamento do estado da sessão e atualização da UI com base nesse estado.
    *   Configuração correta das rotas de callback e redirecionamentos.

### 3.4. Integrações
*   Supabase Auth.
*   React Context.
*   Next.js Router (para redirecionamentos).
*   Componentes da biblioteca de UI local.

### 3.5. Origem (Inferida)
*   Implementação padrão para integração com Supabase Auth, utilizando componentes de UI customizados para as páginas de formulário.

### 3.6. Esforço Estimado (Original)
*   **Moderado.** Configurar os diferentes métodos de autenticação, gerenciar o estado da sessão e criar as interfaces de usuário requer um esforço considerável.

## 4. Biblioteca de Componentes de UI

**Arquivos Analisados (Amostra):**
*   [`app/components/ui/Button.tsx`](app/components/ui/Button.tsx:1)
*   [`app/components/ui/Card.tsx`](app/components/ui/Card.tsx:1)
*   [`app/components/ui/Input.tsx`](app/components/ui/Input.tsx:1)
*   [`app/components/ui/Modal.tsx`](app/components/ui/Modal.tsx:1)
*   (e outros listados em `app/components/ui/`)

### 4.1. Funcionalidades Chave
*   Fornece um conjunto de componentes de UI reutilizáveis e estilizados para a aplicação, incluindo botões, cards, inputs, modais, badges, checkboxes, etc.
*   Muitos componentes suportam variantes de estilo e tamanhos.

### 4.2. Arquitetura
*   Componentes React funcionais.
*   Utilização de `class-variance-authority` (CVA) para criar variantes de estilo de forma organizada (ex: `Button.tsx`).
*   Utilização da função `cn` (combinação de `clsx` e `tailwind-merge`) para aplicar classes condicionalmente e evitar conflitos de classes do Tailwind CSS.
*   Alguns componentes mais complexos, como `Modal.tsx`, utilizam bibliotecas de terceiros como `@headlessui/react` para funcionalidades de acessibilidade e comportamento.
*   Estilização primariamente com Tailwind CSS.

### 4.3. Complexidade
*   **Variável.**
    *   **Baixa a Moderada:** Para componentes simples que são wrappers de elementos HTML com classes Tailwind (ex: `Card.tsx` em sua estrutura básica).
    *   **Moderada a Alta:** Para componentes com múltiplas variantes (ex: `Button.tsx` com CVA), lógica interna (ex: `Input.tsx` com label e erro), ou que integram bibliotecas de terceiros (ex: `Modal.tsx` com Headless UI).

### 4.4. Integrações
*   Tailwind CSS.
*   `class-variance-authority`.
*   `clsx`, `tailwind-merge` (via `cn`).
*   `@headlessui/react` (para componentes como `Modal`).
*   Lucide Icons.

### 1.5. Origem (Inferida)
*   A estrutura e o uso de CVA e `cn` sugerem fortemente que a biblioteca é baseada ou inspirada em **Shadcn/ui**. Os componentes podem ter sido instalados via CLI do Shadcn/ui e, possivelmente, customizados.

### 1.6. Esforço Estimado (Original)
*   **Significativo.** Mesmo utilizando uma base como Shadcn/ui, o esforço para selecionar, instalar, configurar e potencialmente customizar um conjunto abrangente de componentes de UI é considerável. Se muitos componentes foram criados do zero, o esforço seria ainda maior.

## 5. Gerenciamento de Estado com Zustand

**Arquivos Analisados:**
*   [`app/stores/`](app/stores/) (diretório contendo múltiplas stores)
*   [`app/store/index.ts`](app/store/index.ts:1) (Store principal/agregadora)
*   [`app/stores/prioridadesStore.ts`](app/stores/prioridadesStore.ts:1) (Analisada anteriormente)
*   [`app/stores/perfilStore.ts`](app/stores/perfilStore.ts:1) (Analisada anteriormente)

### 5.1. Funcionalidades Chave
*   Prover gerenciamento de estado global e local para diversas funcionalidades da aplicação, como tarefas, blocos de tempo, refeições, medicamentos, humor, configurações do usuário, perfil, prioridades, etc.
*   Encapsular a lógica de interação com o backend (Supabase) para operações CRUD relacionadas a cada entidade do estado.
*   [`app/store/index.ts`](app/store/index.ts:1) atua como uma store centralizada que gerencia múltiplas entidades, incluindo uma função `fetchInitialData` para carregar dados de várias tabelas do Supabase de uma vez.

### 5.2. Arquitetura
*   Utilização da biblioteca Zustand para criar stores.
*   Cada store define seu estado (state), ações síncronas para modificar o estado, e ações assíncronas (geralmente para interagir com o Supabase).
*   As stores são modulares (ex: `perfilStore.ts`, `prioridadesStore.ts`), mas também há uma store agregadora (`app/store/index.ts`) que lida com um conjunto mais amplo de dados.
*   As interações com o Supabase são feitas diretamente dentro das ações das stores.

### 5.3. Complexidade
*   **Alta.**
    *   O gerenciamento de múltiplas stores, cada uma com sua lógica de CRUD e interações com o backend, introduz complexidade.
    *   A store `app/store/index.ts` é particularmente complexa devido ao grande número de entidades que gerencia e à lógica de `fetchInitialData` e ações CRUD para cada uma.
    *   Garantir a consistência dos dados, tratar erros de chamadas assíncronas e atualizar o estado local de forma otimista ou após confirmação do backend são desafios inerentes.

### 5.4. Integrações
*   Zustand.
*   Supabase.

### 5.5. Origem (Inferida)
*   Implementação customizada utilizando a biblioteca Zustand para atender às necessidades de gerenciamento de estado da aplicação.

### 5.6. Esforço Estimado (Original)
*   **Alto.** Definir a estrutura de cada store, implementar todas as ações CRUD com integração ao Supabase, e gerenciar o estado de forma coesa em toda a aplicação representa um esforço de desenvolvimento substancial.

## 6. Exportar/Importar Dados

**Arquivos Analisados:**
*   [`app/components/ExportarImportarDados.tsx`](app/components/ExportarImportarDados.tsx:1)

### 6.1. Funcionalidades Chave
*   Na versão atual, o componente foi simplificado para informar ao usuário que a sincronização de dados é automática através do Supabase.
*   A funcionalidade original de exportar/importar dados manualmente foi removida ou despriorizada.

### 6.2. Arquitetura
*   Componente React simples que exibe uma mensagem informativa.

### 6.3. Complexidade
*   **Baixa** (na sua forma atual).

### 6.4. Integrações
*   Nenhuma integração complexa na versão atual. Utiliza componentes de UI locais.

### 6.5. Origem (Inferida)
*   Refatorado a partir de uma possível funcionalidade anterior mais complexa, para se alinhar com a estratégia de sincronização de dados via Supabase.

### 6.6. Esforço Estimado (Original)
*   **Baixo** (para a versão atual). Se houvesse uma funcionalidade completa de exportação/importação JSON/CSV, o esforço teria sido moderado.

## 7. ThemeProvider

**Arquivos Analisados:**
*   [`app/components/ThemeProvider.tsx`](app/components/ThemeProvider.tsx:1)

### 7.1. Funcionalidades Chave
*   Permite alternar entre temas 'light', 'dark' e 'system'.
*   Detecta a preferência de tema do sistema operacional do usuário.
*   Aplica o tema escolhido manipulando classes no elemento `<html>`.
*   Salva a preferência de tema do usuário no `localStorage` para persistência entre sessões.
*   Opcionalmente desabilita transições durante a mudança de tema.

### 7.2. Arquitetura
*   Utiliza React Context (`ThemeProviderContext`) para prover o tema atual e a função `setTheme` para os componentes filhos.
*   Hooks `useEffect` são usados para aplicar o tema ao `document.documentElement`, ouvir mudanças na preferência de esquema de cores do sistema e carregar/salvar o tema do `localStorage`.

### 7.3. Complexidade
*   **Moderada.**
    *   Lógica para lidar com os três estados de tema (light, dark, system).
    *   Interação com APIs do navegador (`window.matchMedia`, `localStorage`).
    *   Manipulação direta do DOM (adicionar/remover classes no `<html>`).

### 7.4. Integrações
*   React Context.
*   `localStorage` API.
*   `window.matchMedia` API.

### 7.5. Origem (Inferida)
*   Implementação comum para gerenciamento de temas em aplicações React/Next.js. Pode ser inspirada ou baseada em bibliotecas populares como `next-themes`, adaptada para as necessidades do projeto.

### 7.6. Esforço Estimado (Original)
*   **Moderado.** Implementar a lógica de detecção, aplicação e persistência de temas, juntamente com o contexto, requer um esforço considerável.
````

## File: docs/analise_modulo_receitas.md
````markdown
# Relatório de Análise de Código: Módulo de Receitas

**Tarefa ID:** `120#chore#analisar_codigo_modulo_receitas`

## 1. Funcionalidades Identificadas

O módulo de Receitas apresenta um conjunto robusto de funcionalidades para gerenciamento culinário:

*   **Adicionar e Editar Receitas:**
    *   Formulário completo ([`AdicionarReceitaForm.tsx`](app/components/receitas/AdicionarReceitaForm.tsx:1)) para inserir ou modificar receitas.
    *   Campos incluem: nome, descrição, categorias (seleção múltipla), tags (com sugestões), tempo de preparo, porções, calorias (texto livre), imagem (upload com preview), ingredientes (nome, quantidade, unidade - dinâmico) e passos de preparo (dinâmico).
*   **Listar Receitas:**
    *   Exibição das receitas em formato de cards ([`ListaReceitas.tsx`](app/components/receitas/ListaReceitas.tsx:1)) na página principal ([`app/receitas/page.tsx`](app/receitas/page.tsx:1)).
    *   Filtro por categorias ([`FiltroCategorias.tsx`](app/components/receitas/FiltroCategorias.tsx:1)).
    *   Pesquisa por nome da receita ou nome dos ingredientes ([`Pesquisa.tsx`](app/components/ui/Pesquisa.tsx:1)).
*   **Visualizar Detalhes da Receita:**
    *   Página dedicada ([`DetalhesReceita.tsx`](app/components/receitas/DetalhesReceita.tsx:1)) para cada receita.
    *   Ajuste dinâmico da quantidade dos ingredientes com base no número de porções desejado.
    *   Funcionalidade de "Favoritar" receita.
    *   Integração para "Adicionar ao Planejador" (módulo de Alimentação).
    *   Opções para Editar ou Remover a receita.
*   **Importar Receitas:**
    *   Componente ([`ImportadorReceitas.tsx`](app/components/receitas/ImportadorReceitas.tsx:1)) para importar receitas a partir de um arquivo JSON.
    *   Suporta importação de um único objeto de receita ou um array de receitas.
    *   Inclui validação básica da estrutura do JSON.
*   **Lista de Compras:**
    *   Geração de lista de compras agregada ([`ListaCompras.tsx`](app/components/receitas/ListaCompras.tsx:1)) a partir de múltiplas receitas selecionadas.
    *   Ajuste individual de porções para cada receita selecionada na lista.
    *   Agrupamento de ingredientes idênticos (mesmo nome e unidade).
    *   Funcionalidade para marcar/desmarcar itens como comprados.
*   **Gerenciamento de Estado:**
    *   Utiliza Zustand ([`receitasStore.ts`](app/stores/receitasStore.ts:1)) para gerenciar o estado das receitas, incluindo operações CRUD (Criar, Ler, Atualizar, Deletar) e a lista de favoritos.
    *   Persistência dos dados no localStorage, permitindo que as receitas e favoritos sejam mantidos entre sessões.

## 2. Estruturas e Store

### 2.1. Componentes Principais (em [`app/components/receitas/`](app/components/receitas/))

*   **[`AdicionarReceitaForm.tsx`](app/components/receitas/AdicionarReceitaForm.tsx:1):** Formulário complexo para criação e edição de receitas. Gerencia estado local para os campos do formulário, incluindo arrays dinâmicos para ingredientes e passos, e upload de imagem com preview.
*   **[`DetalhesReceita.tsx`](app/components/receitas/DetalhesReceita.tsx:1):** Exibe todas as informações de uma receita. Permite interações como ajuste de porções, favoritar, adicionar ao planejamento, editar e remover.
*   **[`FiltroCategorias.tsx`](app/components/receitas/FiltroCategorias.tsx:1):** Componente de UI para selecionar uma categoria e filtrar a lista de receitas.
*   **[`ImportadorReceitas.tsx`](app/components/receitas/ImportadorReceitas.tsx:1):** Lida com o upload de arquivos JSON, parsing, validação e adição de receitas ao store.
*   **[`ListaCompras.tsx`](app/components/receitas/ListaCompras.tsx:1):** Componente interativo para selecionar receitas, ajustar porções, e gerar uma lista de compras consolidada com funcionalidade de checklist.
*   **[`ListaReceitas.tsx`](app/components/receitas/ListaReceitas.tsx:1):** Renderiza uma grade de cards, cada um representando uma receita e linkando para sua página de detalhes.

### 2.2. Store (Zustand)

*   **[`app/stores/receitasStore.ts`](app/stores/receitasStore.ts:1):**
    *   Define a interface `Receita` e `Ingrediente`.
    *   Estado: `receitas` (array de `Receita`), `favoritos` (array de IDs de receitas).
    *   Ações:
        *   `adicionarReceita(receita: Receita)`
        *   `atualizarReceita(receita: Receita)`
        *   `removerReceita(id: string)`
        *   `obterReceitaPorId(id: string): Receita | undefined`
        *   `alternarFavorito(id: string)`
    *   Utiliza o middleware `persist` do Zustand para salvar o estado no localStorage sob o nome `receitas-storage`.

### 2.3. Páginas (Rotas em [`app/receitas/`](app/receitas/))

*   **[`app/receitas/page.tsx`](app/receitas/page.tsx:1):** Página principal do módulo. Exibe a lista de receitas com opções de filtro, pesquisa, importação, link para adicionar nova receita e link para a lista de compras.
*   **[`app/receitas/adicionar/page.tsx`](app/receitas/adicionar/page.tsx:1):** Renderiza o componente [`AdicionarReceitaForm.tsx`](app/components/receitas/AdicionarReceitaForm.tsx:1) para criar uma nova receita.
*   **[`app/receitas/lista-compras/page.tsx`](app/receitas/lista-compras/page.tsx:1):** Renderiza o componente [`ListaCompras.tsx`](app/components/receitas/ListaCompras.tsx:1).
*   **Rota Dinâmica `/receitas/[id]`:** (Não há um arquivo de página explícito, é gerenciado pelo Next.js App Router). Exibe os detalhes de uma receita específica, provavelmente renderizando o componente [`DetalhesReceita.tsx`](app/components/receitas/DetalhesReceita.tsx:1) com o ID da receita.
*   **Rota Dinâmica `/receitas/editar/[id]`:** (Não há um arquivo de página explícito). Permite editar uma receita existente, provavelmente renderizando [`AdicionarReceitaForm.tsx`](app/components/receitas/AdicionarReceitaForm.tsx:1) com os dados da receita a ser editada.

## 3. Complexidade

*   **Geral: Média a Alta.** O módulo possui várias funcionalidades interconectadas e componentes com lógica de estado significativa.
*   **[`AdicionarReceitaForm.tsx`](app/components/receitas/AdicionarReceitaForm.tsx:1): Alta.** Gerenciamento de múltiplos campos, arrays dinâmicos (ingredientes, passos), lógica de upload e preview de imagem, validações e conversões de tipo.
*   **[`ListaCompras.tsx`](app/components/receitas/ListaCompras.tsx:1): Alta.** Lógica complexa para seleção de múltiplas receitas, ajuste de porções por receita, agregação de ingredientes (considerando unidades diferentes para o mesmo item, embora a implementação atual agrupe por nome+unidade), cálculo de quantidades totais e gerenciamento do estado de "comprado".
*   **[`DetalhesReceita.tsx`](app/components/receitas/DetalhesReceita.tsx:1): Média.** Lógica para ajuste de quantidades de ingredientes com base nas porções, interação com favoritos e com o `alimentacaoStore`.
*   **[`ImportadorReceitas.tsx`](app/components/receitas/ImportadorReceitas.tsx:1): Média.** Leitura de arquivo, parsing de JSON, validação da estrutura dos dados e adição em lote ao store.
*   **[`receitasStore.ts`](app/stores/receitasStore.ts:1): Média.** Operações CRUD padrão, gerenciamento de um array de favoritos e configuração da persistência.
*   **[`ListaReceitas.tsx`](app/components/receitas/ListaReceitas.tsx:1), [`FiltroCategorias.tsx`](app/components/receitas/FiltroCategorias.tsx:1): Baixa a Média.** Componentes mais focados na apresentação e interações simples de UI.

## 4. Integrações

### 4.1. Internas ao Projeto

*   **`useReceitasStore` ([`app/stores/receitasStore.ts`](app/stores/receitasStore.ts:1)):** Utilizado extensivamente por todos os componentes e páginas do módulo para acessar e manipular dados de receitas.
*   **`useAlimentacaoStore` ([`app/stores/alimentacaoStore.ts`](app/stores/alimentacaoStore.ts:1)):** Utilizado pelo [`DetalhesReceita.tsx`](app/components/receitas/DetalhesReceita.tsx:1) para a funcionalidade "Adicionar ao Planejador".
*   **Componentes de UI Reutilizáveis ([`app/components/ui/`](app/components/ui/)):** O módulo utiliza componentes genéricos como `Button`, `Input`, `Textarea`, `Select`, `TagInput`, `Card`, `Checkbox`, `Alert`, `Pesquisa`.
*   **Roteamento Next.js:** Utiliza `useRouter` e `Link` do Next.js para navegação entre as páginas do módulo.

### 4.2. Externas ao Projeto

*   Nenhuma integração direta com APIs externas (ex: Supabase para backend) foi observada no código específico do módulo de receitas. A persistência de dados é local (localStorage via Zustand).

## 5. Origem

*   Conforme o documento de especificação [`040#feat#identificar_divergencias_spec.md`](.state/specs/040#feat#identificar_divergencias_spec.md:51), o módulo de Receitas **é uma divergência completa** em relação ao `todo.md` fornecido, que foca apenas na infraestrutura básica do Supabase.
*   A origem provável é um desenvolvimento planejado e executado à parte da documentação inicial, ou um desenvolvimento ad-hoc para atender a requisitos não capturados no `todo.md`.
*   A estrutura e a coesão das funcionalidades sugerem um desenvolvimento customizado e intencional, e não um simples boilerplate.

## 6. Esforço Estimado (Desenvolvimento Original)

*   **Estimativa Geral: Alto.**
*   O módulo é relativamente completo, com múltiplas funcionalidades interconectadas, gerenciamento de estado, formulários complexos e componentes de UI específicos.
*   Uma estimativa aproximada para o desenvolvimento inicial deste módulo (sem considerar testes unitários/integração formais, que não são visíveis) seria:
    *   Desenvolvimento dos Componentes: 40-60 horas
    *   Desenvolvimento do Store (Zustand): 8-12 horas
    *   Criação das Páginas e Roteamento: 4-6 horas
    *   **Total Estimado (Desenvolvimento Funcional): 52-78 horas**
    *   Se incluirmos tempo para design de UI/UX básico e testes manuais, o esforço poderia facilmente chegar a **70-100 horas**.

Este relatório resume a análise do código existente para o módulo de Receitas.
````

## File: docs/api_autenticacao.md
````markdown
# Documentação da API de Autenticação

## 1. Visão Geral

A API de Autenticação do StayFocus é responsável por gerenciar o acesso dos usuários à plataforma. Ela utiliza o [Supabase](https://supabase.io/) como backend para lidar com os processos de cadastro, login e gerenciamento de sessões.

Atualmente, são suportados dois métodos principais de autenticação:
*   Autenticação via provedor OAuth 2.0 (Google).
*   Autenticação tradicional com Email e Senha.

## 2. Fluxo de Autenticação OAuth2 com Google

O fluxo de autenticação utilizando o Google como provedor OAuth 2.0 é orquestrado pelo SDK do Supabase e segue os seguintes passos:

1.  **Início do Fluxo:**
    *   O usuário clica no botão "Entrar com Google" na página de login ([`app/auth/login/page.tsx`](app/auth/login/page.tsx:106)).
    *   A função `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'URL_CALLBACK' } })` é chamada ([`app/auth/login/page.tsx:42`](app/auth/login/page.tsx:42)).
    *   `URL_CALLBACK` é dinamicamente definida como `${window.location.origin}/auth/callback`.

2.  **Redirecionamento para o Google:**
    *   O Supabase redireciona o navegador do usuário para a página de autorização do Google.
    *   O usuário autentica-se com suas credenciais do Google e autoriza o acesso da aplicação StayFocus às informações solicitadas (escopos).

3.  **Retorno do Google e Callback:**
    *   Após a autorização, o Google redireciona o usuário de volta para a aplicação, especificamente para a rota de callback configurada: `/auth/callback` ([`app/auth/callback/route.ts`](app/auth/callback/route.ts)).
    *   A URL de callback inclui um parâmetro `code` (código de autorização).

4.  **Troca do Código pela Sessão:**
    *   A rota de callback ([`app/auth/callback/route.ts`](app/auth/callback/route.ts:6)) extrai o `code` da URL.
    *   A função `supabase.auth.exchangeCodeForSession(code)` é chamada ([`app/auth/callback/route.ts:13`](app/auth/callback/route.ts:13)) para trocar o código de autorização por uma sessão de usuário válida com o Supabase.

5.  **Redirecionamento para a Aplicação:**
    *   Se a troca for bem-sucedida, o usuário é redirecionado para a página inicial da aplicação (`/`) ou para a URL especificada no parâmetro `next` ([`app/auth/callback/route.ts:15`](app/auth/callback/route.ts:15)).
    *   Em caso de erro, o usuário é redirecionado para a página de login com uma mensagem de erro ([`app/auth/callback/route.ts:21`](app/auth/callback/route.ts:21)).

## 3. Autenticação com Email e Senha

### 3.1. Cadastro (Sign Up)

*   **Endpoint (Frontend):** Página de cadastro em [`app/auth/signup/page.tsx`](app/auth/signup/page.tsx).
*   **Método Supabase:** `supabase.auth.signUp({ email, password })` ([`app/auth/signup/page.tsx:30`](app/auth/signup/page.tsx:30)).
*   **Descrição:** Permite que novos usuários criem uma conta fornecendo um email e senha.
    *   O sistema verifica se as senhas digitadas coincidem ([`app/auth/signup/page.tsx:22`](app/auth/signup/page.tsx:22)).
    *   A senha deve ter no mínimo 6 caracteres (padrão Supabase) ([`app/auth/signup/page.tsx:93`](app/auth/signup/page.tsx:93)).
    *   A confirmação de e-mail pode estar habilitada no Supabase. Se sim, o usuário receberá um e-mail para confirmar sua conta antes de poder fazer login. O código atual sugere que o redirecionamento para confirmação de e-mail (`emailRedirectTo`) está comentado ([`app/auth/signup/page.tsx:35`](app/auth/signup/page.tsx:35)), então o comportamento padrão do Supabase para confirmação de e-mail será aplicado.

**Exemplo de Interação (Frontend - Simplificado):**
```javascript
// Em app/auth/signup/page.tsx
async function handleSignup(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    // Tratar erro
    console.error("Erro no cadastro:", error.message);
  } else if (data.user) {
    // Cadastro bem-sucedido (ou requer confirmação de e-mail)
    console.log("Usuário registrado:", data.user);
    // Redirecionar para login ou página de "verifique seu e-mail"
  }
}
```

### 3.2. Login

*   **Endpoint (Frontend):** Página de login em [`app/auth/login/page.tsx`](app/auth/login/page.tsx).
*   **Método Supabase:** `supabase.auth.signInWithPassword({ email, password })` ([`app/auth/login/page.tsx:22`](app/auth/login/page.tsx:22)).
*   **Descrição:** Permite que usuários existentes acessem suas contas.

**Exemplo de Interação (Frontend - Simplificado):**
```javascript
// Em app/auth/login/page.tsx
async function handleLogin(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    // Tratar erro de login
    console.error("Erro no login:", error.message);
  } else {
    // Login bem-sucedido
    // Redirecionar para a página inicial
    console.log("Login realizado com sucesso!");
  }
}
```

## 4. Escopos de Permissão (OAuth)

Os escopos de permissão para o fluxo OAuth2 com Google não são explicitamente definidos no código da aplicação frontend ([`app/lib/supabaseClient.ts`](app/lib/supabaseClient.ts) ou [`app/auth/login/page.tsx`](app/auth/login/page.tsx)). Isso indica que a aplicação provavelmente utiliza os escopos padrão configurados durante a integração do provedor Google OAuth nas configurações do projeto Supabase.

Os escopos padrão comumente solicitados pelo Google para autenticação básica são:
*   `openid`: Afirma a identidade do usuário.
*   `email`: Permite o acesso ao endereço de e-mail principal do usuário.
*   `profile`: Permite o acesso às informações básicas do perfil do usuário (nome, foto, etc.).

**Nota:** Para confirmar os escopos exatos, é necessário verificar as configurações do provedor OAuth "Google" no painel de administração do Supabase e, possivelmente, as configurações do cliente OAuth no Google Cloud Console.

## 5. Endpoints da API (Conforme gerenciado pelo Supabase)

O Supabase abstrai as chamadas diretas de API REST para autenticação através do seu SDK. Os "endpoints" do ponto de vista do desenvolvedor frontend são as funções do SDK:

*   **Cadastro:** `supabase.auth.signUp()`
*   **Login com Email/Senha:** `supabase.auth.signInWithPassword()`
*   **Login com OAuth (Google):** `supabase.auth.signInWithOAuth()`
*   **Troca de Código por Sessão (OAuth Callback):** `supabase.auth.exchangeCodeForSession()`
*   **Logout:** `supabase.auth.signOut()` (Não explorado nos arquivos, mas é um endpoint comum)
*   **Obter Usuário Atual:** `supabase.auth.getUser()` (Não explorado, mas comum)
*   **Obter Sessão Atual:** `supabase.auth.getSession()` (Não explorado, mas comum)

**Exemplos de Requisição/Resposta:**

Como o SDK do Supabase gerencia as requisições HTTP subjacentes, os exemplos focam na interação com o SDK.

### 5.1. Cadastro (Email/Senha)

**Requisição (uso do SDK):**
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'novo.usuario@example.com',
  password: 'passwordSegura123',
  // options: {
  //   emailRedirectTo: 'https://example.com/welcome', // Opcional
  //   data: { // Dados adicionais a serem salvos no perfil do usuário
  //     full_name: 'Nome Completo',
  //   }
  // }
});
```

**Resposta (objeto `data` em caso de sucesso, se a confirmação de email estiver desabilitada ou após a confirmação):**
```json
{
  "user": {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "novo.usuario@example.com",
    "email_confirmed_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ", // Presente se confirmado
    "phone": "",
    "confirmed_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ", // Presente se confirmado
    "last_sign_in_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ", // Presente se logado automaticamente
    "app_metadata": {
      "provider": "email",
      "providers": ["email"]
    },
    "user_metadata": {
      // "full_name": "Nome Completo" // Se 'data' foi fornecido no signUp
    },
    "identities": [
      {
        "identity_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "user_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "identity_data": {
          "email": "novo.usuario@example.com",
          "email_verified": true, // ou false se aguardando confirmação
          "phone_verified": false,
          "sub": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        },
        "provider": "email",
        "last_sign_in_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ",
        "created_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ",
        "updated_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ"
      }
    ],
    "created_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ",
    "updated_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ"
  },
  "session": { // Pode ser null se a confirmação de email for necessária e o login automático não ocorrer
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": 1678886400, // Timestamp
    "refresh_token": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "user": {
      // ... (mesmo objeto user acima)
    }
  }
}
```
**Resposta (objeto `error` em caso de falha):**
```json
{
  "message": "User already registered", // ou outra mensagem de erro
  "status": 400 // ou outro código de status HTTP
}
```

### 5.2. Login (Email/Senha)

**Requisição (uso do SDK):**
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario.existente@example.com',
  password: 'passwordCorreta123',
});
```

**Resposta (objeto `data` em caso de sucesso):**
```json
{
  "user": {
    // ... (estrutura similar ao do cadastro)
    "last_sign_in_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": 1678886400,
    "refresh_token": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "user": {
      // ... (mesmo objeto user acima)
    }
  }
}
```
**Resposta (objeto `error` em caso de falha):**
```json
{
  "message": "Invalid login credentials",
  "status": 400
}
```

### 5.3. Login com Google (OAuth2)

Este fluxo é predominantemente gerenciado por redirecionamentos do navegador.

1.  **Requisição Inicial (uso do SDK):**
    ```javascript
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // scopes: 'email profile https://www.googleapis.com/auth/calendar' // Opcional, para escopos adicionais
      },
    });
    if (error) { console.error("Erro ao iniciar OAuth com Google:", error); }
    // Se não houver erro, o Supabase redireciona o navegador.
    ```
    *   **Resposta:** Não há uma resposta direta em JSON nesta etapa. Ocorre um redirecionamento do navegador para o Google.

2.  **Callback após autorização do Google:**
    *   O Google redireciona para `/auth/callback?code=AUTH_CODE_FROM_GOOGLE...`.
    *   **Requisição (interna do SDK na rota de callback):**
        ```javascript
        // Em app/auth/callback/route.ts
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        ```
    *   **Resposta (após `exchangeCodeForSession`, se bem-sucedido, uma sessão é estabelecida e o usuário é redirecionado):** A sessão resultante será similar à do login com email/senha, mas o `app_metadata` e `identities` no objeto `user` refletirão o provedor 'google'.
        ```json
        // Exemplo de user.app_metadata e user.identities[0].identity_data para Google
        "app_metadata": {
          "provider": "google",
          "providers": ["google"]
        },
        "identities": [
          {
            // ...
            "identity_data": {
              "avatar_url": "https://lh3.googleusercontent.com/a/...",
              "email": "usuario.google@gmail.com",
              "email_verified": true,
              "full_name": "Nome do Usuário Google",
              "iss": "https://accounts.google.com",
              "name": "Nome do Usuário Google",
              "picture": "https://lh3.googleusercontent.com/a/...",
              "provider_id": "GOOGLE_USER_ID",
              "sub": "GOOGLE_USER_ID" // Subject - ID único do usuário no Google
            },
            "provider": "google",
            // ...
          }
        ]
        ```

## 6. Próximos Passos

*   [ ] Revisão técnica da documentação com o Arquiteto de Soluções.
*   [ ] Publicação da documentação no portal de desenvolvedores.
*   [ ] Obter feedback de um desenvolvedor utilizando a documentação para integrar uma aplicação cliente.
````

## File: docs/divergencia_modulo_financas.md
````markdown
# Análise de Divergência: Módulo de Finanças vs. todo.md

**Data da Análise:** 06/05/2025
**Tarefa de Referência:** `110#docs#documentar_divergencia_modulo_financas`
**Análise de Código Base:** `100#chore#analisar_codigo_modulo_financas`
**Documento de Referência (Escopo Inicial):** `todo.md`

## 1. Descrição da Funcionalidade Existente no Módulo de Finanças

O módulo de Finanças, identificado através da análise de código, apresenta um conjunto robusto de funcionalidades para gerenciamento financeiro pessoal. Os componentes e a lógica de estado (utilizando Zustand e Supabase) indicam um desenvolvimento considerável nesta área.

**Funcionalidades Chave Identificadas:**

*   **Adicionar Despesa:**
    *   Componente: [`app/components/financas/AdicionarDespesa.tsx`](app/components/financas/AdicionarDespesa.tsx:16)
    *   Permite o registro de novas despesas com descrição, valor e categoria.
    *   Fornece feedback visual após o registro.
*   **Calendário de Pagamentos:**
    *   Componente: [`app/components/financas/CalendarioPagamentos.tsx`](app/components/financas/CalendarioPagamentos.tsx:17)
    *   Gerencia pagamentos recorrentes.
    *   Oferece visualização mensal com navegação.
    *   Permite adicionar novos pagamentos (descrição, valor, dia de vencimento, categoria).
    *   Funcionalidade para marcar pagamentos como pagos/não pagos.
    *   Destaque visual para pagamentos do dia e atrasados.
*   **Envelopes Virtuais:**
    *   Componente: [`app/components/financas/EnvelopesVirtuais.tsx`](app/components/financas/EnvelopesVirtuais.tsx:18)
    *   Permite a criação e gerenciamento de "envelopes" para orçamento.
    *   Funcionalidades de CRUD para envelopes (nome, valor alocado, cor).
    *   Registro de gastos dentro dos envelopes.
    *   Visualização do progresso de gastos por envelope.
*   **Rastreador de Gastos:**
    *   Componente: [`app/components/financas/RastreadorGastos.tsx`](app/components/financas/RastreadorGastos.tsx:19)
    *   Visualiza despesas por categoria através de um gráfico de pizza (Recharts) e lista detalhada.
    *   Calcula totais e percentuais de gastos por categoria.

**Estrutura de Dados e Store ([`app/stores/financasStore.ts`](app/stores/financasStore.ts:24)):**

*   **Tipos Principais:** `Categoria`, `Transacao`, `Envelope`, `PagamentoRecorrente`.
*   **Estado Gerenciado (Zustand):** Listas das entidades acima e `currentUser`.
*   **Ações:** CRUD completo para todas as entidades, incluindo lógica específica como cálculo de próximo vencimento para pagamentos recorrentes e registro de gastos em envelopes.
*   **Integração com Supabase:** Todas as ações de CRUD interagem com tabelas do Supabase (`finance_categories`, `finance_transactions`, `finance_envelopes`, `finance_recurring_payments`), utilizando `user_id` para segregação de dados.

## 2. Comparativo com `todo.md`

O arquivo [`todo.md`](todo.md:1), conforme fornecido no contexto da tarefa, descreve:
> "Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1."

**Principais Pontos de Divergência:**

*   **Escopo Detalhado vs. Geral:** O [`todo.md`](todo.md:1) foca na infraestrutura e serviços do Supabase a serem utilizados (Auth, Database, Realtime), sem detalhar módulos funcionais específicos da aplicação.
*   **Ausência do Módulo de Finanças:** Não há menção explícita a um "Módulo de Finanças" ou suas funcionalidades (como as descritas acima) no conteúdo do [`todo.md`](todo.md:1) fornecido.
*   **Conclusão da Divergência:** A análise de código revela um módulo de Finanças completo e funcional que não foi previamente documentado no [`todo.md`](todo.md:1) como parte do escopo inicial proposto ou como uma funcionalidade a ser desenvolvida. Ele existe e está operacional.

## 3. Hipótese de Origem da Funcionalidade

Com base na análise de código (referência `TEMP#ANALISE_FINANCAS_HIPOTESE_ORIGEM` do arquivo [`.state/tasks/100#chore#analisar_codigo_modulo_financas.json`](.state/tasks/100#chore#analisar_codigo_modulo_financas.json:83)):

*   O módulo parece ser uma **funcionalidade central** de um aplicativo de gerenciamento financeiro pessoal.
*   Foi desenvolvido utilizando uma abordagem de **'backend-as-a-service' com Supabase**, o que está alinhado com a direção arquitetural do [`todo.md`](todo.md:1).
*   Utiliza um **frontend moderno** (React/Next.js, Zustand).
*   Implementa um sistema **multiusuário** com dados financeiros privados, filtrados por `user_id`.

Sugere-se que o módulo de Finanças foi desenvolvido como uma parte essencial e integral da aplicação desde suas fases iniciais ou intermediárias, mesmo que não tenha sido explicitamente detalhado no escopo inicial do [`todo.md`](todo.md:1).

## 4. Impacto da Divergência

A existência deste módulo de Finanças não documentado no [`todo.md`](todo.md:1) tem os seguintes impactos:

*   **Valor Agregado (Positivo):** A aplicação já possui um módulo de Finanças significativamente mais robusto e funcional do que o que poderia ser inferido pela ausência de sua especificação no [`todo.md`](todo.md:1). Isso representa um desenvolvimento já realizado e um valor presente na aplicação.
*   **Necessidade de Atualização da Documentação:** É crucial atualizar a documentação do projeto (incluindo, potencialmente, o próprio [`todo.md`](todo.md:1), ou documentos de arquitetura e especificações funcionais) para refletir com precisão a existência, o escopo e o funcionamento deste módulo. O arquivo [`specification_file_path`](.state/specs/040#feat#identificar_divergencias_spec.md:1) (`.state/specs/040#feat#identificar_divergencias_spec.md`) deve ser atualizado ou referenciar este documento.
*   **Considerações para Planejamento Futuro:**
    *   O esforço estimado para entendimento completo (2-4 horas), refatoração (4-8 horas para melhorias como tratamento de erros e Realtime) e expansão (variável, ex: adicionar receitas 2-4 horas, relatórios avançados 8-16 horas) – conforme `TEMP#ANALISE_FINANCAS_ESTIMATIVA_ESFORCO` – deve ser incorporado em qualquer planejamento futuro de desenvolvimento ou manutenção.
*   **Manutenção e Dependências:** O módulo existente requer manutenção contínua. Suas dependências (Supabase, Zustand, Recharts, etc.) e interações com outras partes do sistema (se houver) precisam ser gerenciadas e consideradas em futuras evoluções da aplicação.
*   **Alinhamento de Expectativas:** Ter a documentação atualizada garante que todas as partes interessadas (desenvolvedores, gerentes de produto, etc.) tenham uma compreensão clara do estado atual e das capacidades da aplicação.
````

## File: docs/divergencia_modulo_receitas.md
````markdown
# Relatório de Divergência: Módulo de Receitas

**Tarefa de Análise de Código Referenciada:** `120#chore#analisar_codigo_modulo_receitas`
**Especificação de Identificação de Divergências:** `040#feat#identificar_divergencias`

## 1. Descrição da Funcionalidade Existente

O módulo de Receitas é uma funcionalidade completa e robusta dentro da aplicação, permitindo aos usuários gerenciar suas receitas culinárias de forma detalhada. As principais funcionalidades incluem:

*   **Gerenciamento de Receitas:**
    *   Adicionar novas receitas através de um formulário detalhado ([`AdicionarReceitaForm.tsx`](app/components/receitas/AdicionarReceitaForm.tsx:1)) que inclui nome, descrição, categorias, tags, tempo de preparo, porções, calorias, imagem, ingredientes (com quantidade e unidade) e passos de preparo.
    *   Editar receitas existentes.
    *   Remover receitas.
*   **Visualização e Descoberta:**
    *   Listagem de receitas em formato de cards ([`ListaReceitas.tsx`](app/components/receitas/ListaReceitas.tsx:1)) com filtros por categoria ([`FiltroCategorias.tsx`](app/components/receitas/FiltroCategorias.tsx:1)) e pesquisa por nome ou ingredientes ([`Pesquisa.tsx`](app/components/ui/Pesquisa.tsx:1)).
    *   Visualização detalhada de cada receita ([`DetalhesReceita.tsx`](app/components/receitas/DetalhesReceita.tsx:1)), com ajuste dinâmico de ingredientes por porção e opção de favoritar.
*   **Funcionalidades Auxiliares:**
    *   Importação de receitas via arquivo JSON ([`ImportadorReceitas.tsx`](app/components/receitas/ImportadorReceitas.tsx:1)).
    *   Geração de Lista de Compras agregada a partir de múltiplas receitas ([`ListaCompras.tsx`](app/components/receitas/ListaCompras.tsx:1)), com ajuste de porções e marcação de itens.
*   **Gerenciamento de Estado:**
    *   Utiliza Zustand ([`receitasStore.ts`](app/stores/receitasStore.ts:1)) para todas as operações CRUD e gerenciamento de favoritos, com persistência em localStorage.

Este módulo é acessível através das rotas em [`app/receitas/`](app/receitas/), incluindo [`app/receitas/page.tsx`](app/receitas/page.tsx:1), [`app/receitas/adicionar/page.tsx`](app/receitas/adicionar/page.tsx:1), e [`app/receitas/lista-compras/page.tsx`](app/receitas/lista-compras/page.tsx:1).

## 2. Comparativo com o `todo.md`

O arquivo `todo.md` fornecido descreve:
```
1 | Arquitetura Proposta com Supabase A nova arquitetura utilizará o Supabase como backend principal, aproveitando seus serviços integrados: Supabase Auth: Para gerenciamento completo de autenticação (registro, login com email/senha, login social como Google, logout, gerenciamento de sessão JWT). Supabase Database: Um banco de dados PostgreSQL para armazenar todos os dados da aplicação de forma estruturada e segura. Supabase Realtime: Para sincronização de dados em tempo real entre dispositivos, atualizando a interface do usuário instantaneamente quando os dados mudam no backend. Supabase Client Library (supabase-js): SDK para interagir com os serviços do Supabase no frontend e backend (se necessário em rotas de API Next.js). 3.1.
```

**Divergência Identificada:**
O módulo de Receitas, com todas as suas funcionalidades detalhadas acima, **é uma divergência completa** em relação ao `todo.md`. O `todo.md` foca exclusivamente na configuração da infraestrutura básica utilizando Supabase (Auth, Database, Realtime) e não faz qualquer menção à existência ou planejamento de um módulo de gerenciamento de receitas.

Conforme a especificação [`040#feat#identificar_divergencias_spec.md`](.state/specs/040#feat#identificar_divergencias_spec.md:51), este módulo não está previsto.

## 3. Origem da Divergência

Com base na análise de código ([`docs/analise_modulo_receitas.md`](docs/analise_modulo_receitas.md) seção 5), a origem mais provável para o módulo de Receitas é:

*   **Desenvolvimento Planejado à Parte ou Ad-hoc:** O módulo parece ter sido desenvolvido intencionalmente, seja como uma expansão planejada não documentada no `todo.md` inicial, ou como uma funcionalidade adicionada de forma ad-hoc para atender a requisitos emergentes ou específicos do projeto que não foram capturados na documentação de planejamento original.
*   **Desenvolvimento Customizado:** A estrutura coesa, a complexidade dos componentes (como [`AdicionarReceitaForm.tsx`](app/components/receitas/AdicionarReceitaForm.tsx:1) e [`ListaCompras.tsx`](app/components/receitas/ListaCompras.tsx:1)) e o gerenciamento de estado dedicado ([`receitasStore.ts`](app/stores/receitasStore.ts:1)) sugerem um esforço de desenvolvimento customizado e significativo, e não a simples adaptação de um template ou boilerplate.

Não há indicativos de que este módulo seja um resquício de um projeto anterior ou código de terceiros não relacionado, dada a sua integração com o sistema de stores (Zustand) e componentes de UI do projeto atual.

## 4. Impacto da Divergência

A existência do módulo de Receitas, embora não documentado no `todo.md`, tem os seguintes impactos:

*   **Positivo:**
    *   **Valor Agregado ao Usuário:** Adiciona uma funcionalidade rica e útil para o usuário final, expandindo o escopo da aplicação para além do que foi inicialmente delineado no `todo.md`.
    *   **Base para Expansão:** Pode servir como uma base sólida para futuras funcionalidades relacionadas à alimentação e planejamento de dietas.

*   **Negativo/Riscos:**
    *   **Desalinhamento com Planejamento Inicial:** Representa um desvio significativo do escopo documentado no `todo.md`, o que pode indicar falhas no processo de planejamento ou comunicação.
    *   **Consumo de Recursos Não Previsto:** O desenvolvimento deste módulo demandou um esforço considerável (estimado entre 52-78 horas, podendo chegar a 70-100 horas com UI/UX e testes, conforme [`docs/analise_modulo_receitas.md`](docs/analise_modulo_receitas.md) seção 6). Estes recursos podem não ter sido alocados ou contabilizados no planejamento original.
    *   **Manutenção e Evolução:** Sendo uma funcionalidade não prevista, sua manutenção contínua e evolução futura podem não estar contempladas nos planos de longo prazo do projeto, gerando débitos técnicos ou dificuldades de integração com novas funcionalidades que sigam o `todo.md` mais estritamente.
    *   **Documentação Defasada:** A principal implicação é que a documentação central (`todo.md`) está severamente desatualizada, não refletindo o estado real do produto e dificultando o onboarding de novos desenvolvedores ou a tomada de decisões estratégicas baseadas em documentação.

**Recomendação:** É crucial atualizar o `todo.md` ou criar uma documentação de arquitetura e escopo mais abrangente que reflita o estado atual do projeto, incluindo o módulo de Receitas e outras divergências identificadas.
````

## File: docs/exemplo-receita-unica.json
````json
{
  "nome": "Bolo de Cenoura Simples (Exemplo)",
  "descricao": "Um bolo de cenoura clássico, fofinho e fácil de fazer.",
  "categorias": ["sobremesa", "lanche"],
  "tags": ["Fácil", "Clássico", "Doce"],
  "tempoPreparo": 45,
  "porcoes": 8,
  "calorias": "350 kcal por porção (aprox.)",
  "imagem": "",
  "ingredientes": [
    { "nome": "Cenoura média ralada", "quantidade": 3, "unidade": "unidade" },
    { "nome": "Ovos", "quantidade": 3, "unidade": "unidade" },
    { "nome": "Óleo vegetal", "quantidade": 200, "unidade": "ml" },
    { "nome": "Açúcar", "quantidade": 250, "unidade": "g" },
    { "nome": "Farinha de trigo", "quantidade": 300, "unidade": "g" },
    { "nome": "Fermento em pó", "quantidade": 1, "unidade": "colher_sopa" }
  ],
  "passos": [
    "Pré-aqueça o forno a 180°C e unte uma forma.",
    "No liquidificador, bata as cenouras, os ovos e o óleo até ficar homogêneo.",
    "Despeje a mistura em uma tigela e adicione o açúcar e a farinha peneirada, misturando bem.",
    "Por último, incorpore delicadamente o fermento em pó.",
    "Despeje a massa na forma preparada e leve ao forno por cerca de 35-40 minutos, ou até que um palito inserido no centro saia limpo.",
    "Deixe esfriar antes de desenformar. Sirva com cobertura de chocolate, se desejar."
  ]
}
````

## File: docs/exemplo-receitas-multiplas.json
````json
[
  {
    "nome": "Panqueca Americana (Exemplo)",
    "descricao": "Panquecas fofinhas clássicas para o café da manhã.",
    "categorias": ["cafe_manha"],
    "tags": ["Rápido", "Fácil"],
    "tempoPreparo": 20,
    "porcoes": 4,
    "calorias": "250 kcal por porção",
    "imagem": "",
    "ingredientes": [
      { "nome": "Farinha de trigo", "quantidade": 150, "unidade": "g" },
      { "nome": "Açúcar", "quantidade": 1, "unidade": "colher_sopa" },
      { "nome": "Fermento em pó", "quantidade": 2, "unidade": "colher_cha" },
      { "nome": "Sal", "quantidade": 0.5, "unidade": "colher_cha" },
      { "nome": "Leite", "quantidade": 240, "unidade": "ml" },
      { "nome": "Ovo", "quantidade": 1, "unidade": "unidade" },
      { "nome": "Manteiga derretida", "quantidade": 2, "unidade": "colher_sopa" }
    ],
    "passos": [
      "Em uma tigela grande, misture a farinha, o açúcar, o fermento e o sal.",
      "Em outra tigela, misture o leite, o ovo e a manteiga derretida.",
      "Despeje os ingredientes líquidos sobre os secos e misture apenas até incorporar (não misture demais).",
      "Aqueça uma frigideira levemente untada em fogo médio.",
      "Despeje cerca de 1/4 de xícara de massa por panqueca na frigideira quente.",
      "Cozinhe por cerca de 2 minutos de cada lado, ou até dourar.",
      "Sirva quente com mel, frutas ou sua cobertura preferida."
    ]
  },
  {
    "nome": "Salada Caesar Simples (Exemplo)",
    "descricao": "Uma versão rápida e fácil da clássica Salada Caesar.",
    "categorias": ["almoco", "jantar", "salada"],
    "tags": ["Rápido", "Leve", "Clássico"],
    "tempoPreparo": 15,
    "porcoes": 2,
    "calorias": "400 kcal por porção (com frango)",
    "imagem": "",
    "ingredientes": [
      { "nome": "Alface romana picada", "quantidade": 1, "unidade": "unidade" },
      { "nome": "Peito de frango grelhado em tiras", "quantidade": 200, "unidade": "g" },
      { "nome": "Croutons", "quantidade": 50, "unidade": "g" },
      { "nome": "Queijo parmesão ralado", "quantidade": 30, "unidade": "g" },
      { "nome": "Molho Caesar pronto", "quantidade": 4, "unidade": "colher_sopa" }
    ],
    "passos": [
      "Em uma saladeira grande, coloque a alface romana picada.",
      "Adicione o frango grelhado em tiras.",
      "Regue com o molho Caesar e misture bem para cobrir todas as folhas.",
      "Adicione os croutons e o queijo parmesão ralado.",
      "Misture levemente mais uma vez e sirva imediatamente."
    ]
  }
]
````

## File: docs/guia-receitas.md
````markdown
# Guia de Implementação: Seção de Receitas na Página /alimentacao

## 1. Estrutura de Pastas e Arquivos

Crie a seguinte estrutura sugerida:

```
/components
  - ListaReceitas.tsx
  - FiltroCategorias.tsx
  - Pesquisa.tsx
  - Button.tsx
  - Tag.tsx
  - Input.tsx
  - Textarea.tsx
  - Select.tsx
  - TagInput.tsx
  - Checkbox.tsx
/pages ou /app
  /receitas
    - index.tsx (ou page.tsx)
    - [id].tsx (ou [id]/page.tsx)
    - adicionar.tsx (ou adicionar/page.tsx)
    - lista-compras.tsx (ou lista-compras/page.tsx)
/stores
  - receitasStore.ts
  - alimentacaoStore.ts
```

## 2. Store de Receitas

Implemente o arquivo `stores/receitasStore.ts` conforme o exemplo do documento de proposta. Isso garante o gerenciamento de receitas, favoritos e integração com o localStorage.

## 3. Componentes de UI

Implemente os componentes principais:
- `ReceitasPage` (listagem e filtro)
- `DetalhesReceita` (visualização detalhada)
- `AdicionarReceita` (formulário de criação/edição)
- `ListaCompras` (lista de compras baseada nas receitas)

Você pode copiar e colar os exemplos do documento de proposta, adaptando para o seu padrão de projeto (Next.js App Router ou Pages Router).

## 4. Integração com Alimentação

No arquivo da página `/alimentacao`, adicione um link ou botão para acessar a seção de receitas. Exemplo:

```tsx
// Em /pages/alimentacao/index.tsx ou /app/alimentacao/page.tsx
import Link from 'next/link';

export default function AlimentacaoPage() {
  return (
    <div>
      <h1>Alimentação</h1>
      {/* ...outros conteúdos... */}
      <Link href="/receitas">
        <button className="bg-primary-500 text-white px-4 py-2 rounded">
          Ir para Receitas
        </button>
      </Link>
    </div>
  );
}
```

## 5. Rotas

Garanta que as rotas estejam configuradas conforme o seu Next.js (App Router ou Pages Router). Isso permite acessar `/receitas`, `/receitas/adicionar`, `/receitas/[id]` e `/receitas/lista-compras`.

## 6. Sidebar/Navegação

Adicione o link para receitas no seu Sidebar, conforme sugerido:

```tsx
<Link href="/receitas">
  <Book /> Receitas
</Link>
```

## 7. Testes e Ajustes

- Teste a adição, edição, remoção e visualização de receitas.
- Teste a integração com o planejador de refeições.
- Teste a lista de compras.
- Ajuste responsividade e UX conforme necessário.

---

## Dúvidas Frequentes

- **Precisa de backend?** Não obrigatoriamente, pois o Zustand com persistência já salva no localStorage. Mas para multiusuários ou backup, um backend seria ideal.
- **Como tratar imagens?** O exemplo usa `URL.createObjectURL`, mas para produção, use um serviço de upload (Cloudinary, S3, etc).
- **Como integrar com outras áreas?** Use os IDs das receitas para relacionar com refeições planejadas, finanças, etc.

---
````

## File: docs/receita-plan.md
````markdown
## Proposta para uma Seção de Receitas dentro da Pagina Alimentação (`/receitas`)

### Funcionalidades Principais:

1. **Catálogo de Receitas**
   - Visualização em grid/lista de receitas salvas
   - Filtragem por categorias (café da manhã, almoço, jantar, lanches, etc.)
   - Pesquisa por ingredientes ou nome

2. **Detalhes da Receita**
   - Ingredientes com quantidades
   - Instruções passo a passo
   - Tempo de preparo e porções
   - Informações nutricionais
   - Tags para categorização (sem glúten, vegano, etc.)

3. **Adição/Edição de Receitas**
   - Formulário para adicionar novas receitas
   - Upload de imagens
   - Editor para formatação do texto

4. **Integração com Alimentação**
   - Adicionar receita ao planejador de refeições
   - Registrar refeição baseada em receita

5. **Funcionalidades Extra**
   - Lista de compras baseada em receitas selecionadas
   - Ajuste automático de quantidades baseado no número de porções
   - Favoritar receitas

Possivel estrutura de código e componentes para essa seção:

### Componentes Chave:

#### `ReceitasPage.tsx` (Página principal)
```tsx
import { useState } from 'react';
import { ListaReceitas } from './ListaReceitas';
import { FiltroCategorias } from './FiltroCategorias';
import { Pesquisa } from '../components/Pesquisa';
import { useReceitasStore } from '../stores/receitasStore';

export default function ReceitasPage() {
  const { receitas } = useReceitasStore();
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  
  const receitasFiltradas = receitas
    .filter(receita => filtroCategoria === 'todas' || receita.categorias.includes(filtroCategoria))
    .filter(receita => 
      receita.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      receita.ingredientes.some(ing => ing.nome.toLowerCase().includes(termoPesquisa.toLowerCase()))
    );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Minhas Receitas</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Pesquisa 
          placeholder="Buscar por nome ou ingrediente" 
          valor={termoPesquisa} 
          aoMudar={setTermoPesquisa} 
        />
        <FiltroCategorias 
          categoriaAtual={filtroCategoria} 
          aoSelecionar={setFiltroCategoria} 
        />
      </div>
      
      <ListaReceitas receitas={receitasFiltradas} />
    </div>
  );
}
```

#### `DetalhesReceita.tsx` (Visualização detalhada)
```tsx
import { useState } from 'react';
import { useReceitasStore } from '../stores/receitasStore';
import { useAlimentacaoStore } from '../stores/alimentacaoStore';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';

export function DetalhesReceita({ id }) {
  const { obterReceitaPorId } = useReceitasStore();
  const { adicionarAoPlanejador } = useAlimentacaoStore();
  const [porcoes, setPorcoes] = useState(1);
  
  const receita = obterReceitaPorId(id);
  
  if (!receita) return <p>Receita não encontrada</p>;
  
  const ajustarQuantidade = (quantidade) => {
    return (quantidade * porcoes / receita.porcoes).toFixed(1);
  };
  
  const adicionarAoPlanejamento = () => {
    adicionarAoPlanejador({
      descricao: receita.nome,
      horario: "",
      receitaId: receita.id
    });
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="relative h-64 rounded-lg overflow-hidden mb-6">
        {receita.imagem ? (
          <img 
            src={receita.imagem} 
            alt={receita.nome} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span>Sem imagem</span>
          </div>
        )}
      </div>
      
      <h1 className="text-3xl font-bold mb-2">{receita.nome}</h1>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {receita.tags.map(tag => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-primary-50 p-3 rounded-lg text-center">
          <p className="text-sm">Tempo de Preparo</p>
          <p className="font-bold">{receita.tempoPreparo} min</p>
        </div>
        <div className="bg-primary-50 p-3 rounded-lg text-center">
          <p className="text-sm">Porções</p>
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setPorcoes(Math.max(1, porcoes - 1))}>-</button>
            <p className="font-bold">{porcoes}</p>
            <button onClick={() => setPorcoes(porcoes + 1)}>+</button>
          </div>
        </div>
        <div className="bg-primary-50 p-3 rounded-lg text-center">
          <p className="text-sm">Calorias (por porção)</p>
          <p className="font-bold">{receita.calorias || "Não informado"}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4">Ingredientes</h2>
          <ul className="space-y-2">
            {receita.ingredientes.map((ing, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="font-medium">{ajustarQuantidade(ing.quantidade)} {ing.unidade}</span>
                <span>{ing.nome}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-6">
            <Button onClick={adicionarAoPlanejamento} color="primary">
              Adicionar ao Planejador
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Modo de Preparo</h2>
          <ol className="space-y-4 list-decimal pl-4">
            {receita.passos.map((passo, index) => (
              <li key={index} className="pl-2">
                {passo}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
```

#### `AdicionarReceita.tsx` (Formulário de adição/edição)
```tsx
import { useState } from 'react';
import { useReceitasStore } from '../stores/receitasStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Select } from '../components/Select';
import { TagInput } from '../components/TagInput';

export function AdicionarReceita({ receitaParaEditar, aoFinalizar }) {
  const { adicionarReceita, atualizarReceita } = useReceitasStore();
  const editando = !!receitaParaEditar;
  
  const [receita, setReceita] = useState({
    id: receitaParaEditar?.id || Date.now().toString(),
    nome: receitaParaEditar?.nome || '',
    descricao: receitaParaEditar?.descricao || '',
    categorias: receitaParaEditar?.categorias || [],
    tags: receitaParaEditar?.tags || [],
    tempoPreparo: receitaParaEditar?.tempoPreparo || 30,
    porcoes: receitaParaEditar?.porcoes || 2,
    calorias: receitaParaEditar?.calorias || '',
    imagem: receitaParaEditar?.imagem || '',
    ingredientes: receitaParaEditar?.ingredientes || [{ nome: '', quantidade: 1, unidade: 'g' }],
    passos: receitaParaEditar?.passos || ['']
  });
  
  const opcoesUnidades = [
    { value: 'g', label: 'gramas (g)' },
    { value: 'ml', label: 'mililitros (ml)' },
    { value: 'unidade', label: 'unidade(s)' },
    { value: 'colher_sopa', label: 'colher(es) de sopa' },
    { value: 'colher_cha', label: 'colher(es) de chá' },
    { value: 'xicara', label: 'xícara(s)' },
    { value: 'a_gosto', label: 'a gosto' },
  ];
  
  const categorias = [
    { value: 'cafe_manha', label: 'Café da Manhã' },
    { value: 'almoco', label: 'Almoço' },
    { value: 'jantar', label: 'Jantar' },
    { value: 'lanche', label: 'Lanche' },
    { value: 'sobremesa', label: 'Sobremesa' },
    { value: 'bebida', label: 'Bebida' }
  ];
  
  const atualizarCampo = (campo, valor) => {
    setReceita({ ...receita, [campo]: valor });
  };
  
  const atualizarIngrediente = (index, campo, valor) => {
    const novosIngredientes = [...receita.ingredientes];
    novosIngredientes[index] = { ...novosIngredientes[index], [campo]: valor };
    setReceita({ ...receita, ingredientes: novosIngredientes });
  };
  
  const adicionarIngrediente = () => {
    setReceita({
      ...receita,
      ingredientes: [...receita.ingredientes, { nome: '', quantidade: 1, unidade: 'g' }]
    });
  };
  
  const removerIngrediente = (index) => {
    const novosIngredientes = [...receita.ingredientes];
    novosIngredientes.splice(index, 1);
    setReceita({ ...receita, ingredientes: novosIngredientes });
  };
  
  const atualizarPasso = (index, valor) => {
    const novosPassos = [...receita.passos];
    novosPassos[index] = valor;
    setReceita({ ...receita, passos: novosPassos });
  };
  
  const adicionarPasso = () => {
    setReceita({
      ...receita,
      passos: [...receita.passos, '']
    });
  };
  
  const removerPasso = (index) => {
    const novosPassos = [...receita.passos];
    novosPassos.splice(index, 1);
    setReceita({ ...receita, passos: novosPassos });
  };
  
  const salvarReceita = () => {
    // Validação básica
    if (!receita.nome || receita.ingredientes.some(ing => !ing.nome) || receita.passos.some(p => !p)) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (editando) {
      atualizarReceita(receita);
    } else {
      adicionarReceita(receita);
    }
    
    aoFinalizar && aoFinalizar(receita);
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {editando ? 'Editar Receita' : 'Nova Receita'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-2 font-medium">Nome da Receita*</label>
          <Input
            value={receita.nome}
            onChange={(e) => atualizarCampo('nome', e.target.value)}
            placeholder="Ex: Panquecas de Banana"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Categorias</label>
          <Select
            options={categorias}
            value={receita.categorias}
            onChange={(value) => atualizarCampo('categorias', value)}
            multiple
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Descrição Breve</label>
        <Textarea
          value={receita.descricao}
          onChange={(e) => atualizarCampo('descricao', e.target.value)}
          placeholder="Uma breve descrição sobre a receita..."
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block mb-2 font-medium">Tempo de Preparo (min)*</label>
          <Input
            type="number"
            value={receita.tempoPreparo}
            onChange={(e) => atualizarCampo('tempoPreparo', parseInt(e.target.value))}
            min={1}
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Porções*</label>
          <Input
            type="number"
            value={receita.porcoes}
            onChange={(e) => atualizarCampo('porcoes', parseInt(e.target.value))}
            min={1}
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Calorias (por porção)</label>
          <Input
            type="number"
            value={receita.calorias}
            onChange={(e) => atualizarCampo('calorias', e.target.value)}
            min={0}
            placeholder="Opcional"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Tags</label>
        <TagInput
          tags={receita.tags}
          onChange={(tags) => atualizarCampo('tags', tags)}
          suggestions={['Sem Glúten', 'Vegano', 'Vegetariano', 'Low Carb', 'Rápido', 'Saudável']}
        />
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Imagem</label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            // Aqui você implementaria o upload da imagem
            // Por simplicidade, simulamos um URL da imagem
            if (e.target.files?.[0]) {
              const fileURL = URL.createObjectURL(e.target.files[0]);
              atualizarCampo('imagem', fileURL);
            }
          }}
        />
        {receita.imagem && (
          <div className="mt-2 relative h-40 w-40">
            <img 
              src={receita.imagem} 
              alt="Preview" 
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Ingredientes*</h2>
          <Button onClick={adicionarIngrediente} size="sm">+ Adicionar</Button>
        </div>
        
        {receita.ingredientes.map((ingrediente, index) => (
          <div key={index} className="flex items-center gap-3 mb-2">
            <Input
              type="number"
              value={ingrediente.quantidade}
              onChange={(e) => atualizarIngrediente(index, 'quantidade', parseFloat(e.target.value))}
              min={0}
              step={0.1}
              className="w-24"
            />
            
            <Select
              options={opcoesUnidades}
              value={ingrediente.unidade}
              onChange={(value) => atualizarIngrediente(index, 'unidade', value)}
              className="w-40"
            />
            
            <Input
              value={ingrediente.nome}
              onChange={(e) => atualizarIngrediente(index, 'nome', e.target.value)}
              placeholder="Ingrediente"
              className="flex-1"
            />
            
            <Button 
              onClick={() => removerIngrediente(index)} 
              variant="ghost" 
              size="sm"
              disabled={receita.ingredientes.length <= 1}
            >
              X
            </Button>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Modo de Preparo*</h2>
          <Button onClick={adicionarPasso} size="sm">+ Adicionar</Button>
        </div>
        
        {receita.passos.map((passo, index) => (
          <div key={index} className="flex items-start gap-3 mb-4">
            <div className="mt-2 font-medium">{index + 1}.</div>
            <Textarea
              value={passo}
              onChange={(e) => atualizarPasso(index, e.target.value)}
              placeholder={`Passo ${index + 1}`}
              className="flex-1"
              rows={2}
            />
            
            <Button 
              onClick={() => removerPasso(index)} 
              variant="ghost" 
              size="sm"
              disabled={receita.passos.length <= 1}
            >
              X
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-4">
        <Button onClick={() => aoFinalizar?.()} variant="outline">Cancelar</Button>
        <Button onClick={salvarReceita} color="primary">Salvar Receita</Button>
      </div>
    </div>
  );
}
```

### Store para Gerenciamento de Estado

Vamos criar uma store Zustand para armazenar e gerenciar as receitas:

```tsx
// stores/receitasStore.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface Ingrediente {
  nome: string;
  quantidade: number;
  unidade: string;
}

interface Receita {
  id: string;
  nome: string;
  descricao: string;
  categorias: string[];
  tags: string[];
  tempoPreparo: number;
  porcoes: number;
  calorias: string;
  imagem: string;
  ingredientes: Ingrediente[];
  passos: string[];
}

interface ReceitasStore {
  receitas: Receita[];
  adicionarReceita: (receita: Receita) => void;
  atualizarReceita: (receita: Receita) => void;
  removerReceita: (id: string) => void;
  obterReceitaPorId: (id: string) => Receita | undefined;
  favoritos: string[];
  alternarFavorito: (id: string) => void;
}

export const useReceitasStore = create<ReceitasStore>()(
  persist(
    (set, get) => ({
      receitas: [],
      adicionarReceita: (receita) => 
        set((state) => ({ receitas: [...state.receitas, receita] })),
      atualizarReceita: (receita) =>
        set((state) => ({
          receitas: state.receitas.map((r) => 
            r.id === receita.id ? receita : r
          ),
        })),
      removerReceita: (id) =>
        set((state) => ({
          receitas: state.receitas.filter((r) => r.id !== id),
        })),
      obterReceitaPorId: (id) => {
        return get().receitas.find((r) => r.id === id);
      },
      favoritos: [],
      alternarFavorito: (id) => 
        set((state) => {
          if (state.favoritos.includes(id)) {
            return { favoritos: state.favoritos.filter((fav) => fav !== id) };
          } else {
            return { favoritos: [...state.favoritos, id] };
          }
        }),
    }),
    {
      name: 'receitas-storage',
    }
  )
);
```

### Integração com a Alimentação

Para integrar a funcionalidade de receitas com a seção de alimentação existente, podemos modificar o `PlanejadorRefeicoes.tsx` para suportar a adição de receitas:

```tsx
// Modificação para o PlanejadorRefeicoes.tsx
import { useState, useEffect } from 'react';
import { useAlimentacaoStore } from '../stores/alimentacaoStore';
import { useReceitasStore } from '../stores/receitasStore';

export function PlanejadorRefeicoes() {
  const { refeicoesPlanejadas, adicionarRefeicao } = useAlimentacaoStore();
  const { receitas } = useReceitasStore();
  const [novaRefeicao, setNovaRefeicao] = useState({
    horario: "",
    descricao: "",
    receitaId: ""
  });
  
  const handleAdicionarRefeicao = () => {
    adicionarRefeicao(
      novaRefeicao.horario, 
      novaRefeicao.descricao, 
      novaRefeicao.receitaId
    );
    
    // Resetar o formulário
    setNovaRefeicao({
      horario: "",
      descricao: "",
      receitaId: ""
    });
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Planejador de Refeições</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1">Horário</label>
          <input
            type="time"
            value={novaRefeicao.horario}
            onChange={(e) => setNovaRefeicao({...novaRefeicao, horario: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-1">Descrição</label>
          <input
            type="text"
            value={novaRefeicao.descricao}
            onChange={(e) => setNovaRefeicao({...novaRefeicao, descricao: e.target.value})}
            placeholder="Ex: Café da manhã"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-1">Receita (opcional)</label>
          <select
            value={novaRefeicao.receitaId}
            onChange={(e) => setNovaRefeicao({...novaRefeicao, receitaId: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione uma receita</option>
            {receitas.map((receita) => (
              <option key={receita.id} value={receita.id}>
                {receita.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <button
        onClick={handleAdicionarRefeicao}
        disabled={!novaRefeicao.horario || !novaRefeicao.descricao}
        className="bg-primary-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Adicionar Refeição
      </button>
      
      <div className="mt-6">
        <h3 className="font-medium mb-2">Refeições Planejadas</h3>
        {refeicoesPlanejadas.length === 0 ? (
          <p className="text-gray-500">Nenhuma refeição planejada</p>
        ) : (
          <ul className="space-y-2">
            {refeicoesPlanejadas.map((refeicao, index) => {
              const receitaAssociada = refeicao.receitaId 
                ? receitas.find(r => r.id === refeicao.receitaId) 
                : null;
                
              return (
                <li key={index} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium">{refeicao.horario} - {refeicao.descricao}</div>
                  {receitaAssociada && (
                    <div className="text-sm text-primary-600 mt-1">
                      Receita: {receitaAssociada.nome}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
```

### Componente de Lista de Compras (Funcionalidade Extra)

```tsx
import { useState } from 'react';
import { useReceitasStore } from '../stores/receitasStore';
import { Checkbox } from '../components/Checkbox';
import { Button } from '../components/Button';

export function ListaCompras() {
  const { receitas } = useReceitasStore();
  const [receitasSelecionadas, setReceitasSelecionadas] = useState<string[]>([]);
  const [porcoes, setPorcoes] = useState<Record<string, number>>({});
  const [itensComprados, setItensComprados] = useState<string[]>([]);
  
  // Inicializar porcões ao selecionar uma receita
  const toggleReceitaSelecionada = (id: string) => {
    if (receitasSelecionadas.includes(id)) {
      setReceitasSelecionadas(receitasSelecionadas.filter(rid => rid !== id));
      
      // Remover do objeto de porções
      const novasPorcoes = { ...porcoes };
      delete novasPorcoes[id];
      setPorcoes(novasPorcoes);
    } else {
      setReceitasSelecionadas([...receitasSelecionadas, id]);
      
      // Inicializar com o número de porções da receita
      const receita = receitas.find(r => r.id === id);
      if (receita) {
        setPorcoes({
          ...porcoes,
          [id]: receita.porcoes
        });
      }
    }
  };
  
  const atualizarPorcoes = (id: string, valor: number) => {
    setPorcoes({
      ...porcoes,
      [id]: Math.max(1, valor)
    });
  };
  
  // Agrupar ingredientes similares e calcular quantidades
  const gerarListaCompras = () => {
    const ingredientesAgrupados: Record<string, { 
      nome: string, 
      quantidadeTotal: number, 
      unidade: string 
    }> = {};
    
    // Para cada receita selecionada
    receitasSelecionadas.forEach(id => {
      const receita = receitas.find(r => r.id === id);
      if (!receita) return;
      
      const fatorMultiplicacao = porcoes[id] / receita.porcoes;
      
      // Para cada ingrediente na receita
      receita.ingredientes.forEach(ing => {
        // Criar uma chave única para o ingrediente (nome + unidade)
        const chave = `${ing.nome}_${ing.unidade}`;
        
        if (ingredientesAgrupados[chave]) {
          // Se já existe, adicionar à quantidade
          ingredientesAgrupados[chave].quantidadeTotal += ing.quantidade * fatorMultiplicacao;
        } else {
          // Se não existe, criar nova entrada
          ingredientesAgrupados[chave] = {
            nome: ing.nome,
            quantidadeTotal: ing.quantidade * fatorMultiplicacao,
            unidade: ing.unidade
          };
        }
      });
    });
    
    // Converter para array e ordenar
    return Object.values(ingredientesAgrupados)
      .sort((a, b) => a.nome.localeCompare(b.nome));
  };
  
  const listaCompras = gerarListaCompras();
  
  const toggleItemComprado = (item: string) => {
    if (itensComprados.includes(item)) {
      setItensComprados(itensComprados.filter(i => i !== item));
    } else {
      setItensComprados([...itensComprados, item]);
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Lista de Compras</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Selecione as Receitas</h2>
        
        {receitas.length === 0 ? (
          <p
Vou continuar com o desenvolvimento do componente de Lista de Compras e finalizar a proposta para a seção de receitas.

```tsx
// Continuação do ListaCompras.tsx
        {receitas.length === 0 ? (
          <p className="text-gray-500">
            Nenhuma receita cadastrada. Adicione receitas para criar uma lista de compras.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {receitas.map(receita => (
              <div 
                key={receita.id} 
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  receitasSelecionadas.includes(receita.id) 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => toggleReceitaSelecionada(receita.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox 
                    checked={receitasSelecionadas.includes(receita.id)}
                    onChange={() => {}} // Gerenciado pelo click no container
                  />
                  <div>
                    <p className="font-medium">{receita.nome}</p>
                    {receitasSelecionadas.includes(receita.id) && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm">Porções:</span>
                        <button 
                          className="w-6 h-6 bg-gray-200 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            atualizarPorcoes(receita.id, (porcoes[receita.id] || 1) - 1);
                          }}
                        >
                          -
                        </button>
                        <span>{porcoes[receita.id] || receita.porcoes}</span>
                        <button 
                          className="w-6 h-6 bg-gray-200 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            atualizarPorcoes(receita.id, (porcoes[receita.id] || 1) + 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {receitasSelecionadas.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Lista de Compras</h2>
          
          {listaCompras.length === 0 ? (
            <p className="text-gray-500">
              Nenhum ingrediente encontrado nas receitas selecionadas.
            </p>
          ) : (
            <>
              <div className="mb-4 flex gap-2">
                <Button 
                  onClick={() => setItensComprados([])} 
                  variant="outline"
                >
                  Desmarcar Todos
                </Button>
                <Button 
                  onClick={() => setItensComprados(listaCompras.map(i => `${i.nome}_${i.unidade}`))} 
                  variant="outline"
                >
                  Marcar Todos
                </Button>
              </div>
              
              <ul className="space-y-2 mb-6">
                {listaCompras.map((item, index) => {
                  const itemKey = `${item.nome}_${item.unidade}`;
                  const isComprado = itensComprados.includes(itemKey);
                  
                  return (
                    <li 
                      key={index} 
                      className={`p-3 border rounded flex items-center gap-3 ${
                        isComprado ? 'bg-gray-100' : 'bg-white'
                      }`}
                    >
                      <Checkbox 
                        checked={isComprado}
                        onChange={() => toggleItemComprado(itemKey)}
                      />
                      <span className={isComprado ? 'line-through text-gray-500' : ''}>
                        <span className="font-medium">
                          {item.quantidadeTotal.toFixed(1)} {item.unidade}
                        </span>
                        {' '}{item.nome}
                      </span>
                    </li>
                  );
                })}
              </ul>
              
              <Button color="primary">
                Compartilhar Lista
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

### Navegação e Rotas

Para completar a implementação, precisamos adicionar as rotas e links de navegação:

#### Rotas no Next.js (pasta `app` ou `pages` dependendo da versão do Next.js)

Se estiver usando o App Router (Next.js >= 13):

```tsx
// app/receitas/page.tsx
export default function ReceitasPage() {
  return <ReceitasPage />;
}

// app/receitas/[id]/page.tsx
export default function ReceitaDetalhesPage({ params }) {
  return <DetalhesReceita id={params.id} />;
}

// app/receitas/adicionar/page.tsx
export default function AdicionarReceitaPage() {
  return <AdicionarReceita />;
}

// app/receitas/lista-compras/page.tsx
export default function ListaComprasPage() {
  return <ListaCompras />;
}
```

Ou, se estiver usando o Pages Router (versões anteriores do Next.js):

```tsx
// pages/receitas/index.tsx
export default function ReceitasPage() {
  return <ReceitasPage />;
}

// pages/receitas/[id].tsx
export default function ReceitaDetalhesPage({ id }) {
  return <DetalhesReceita id={id} />;
}

// pages/receitas/adicionar.tsx
export default function AdicionarReceitaPage() {
  return <AdicionarReceita />;
}

// pages/receitas/lista-compras.tsx
export default function ListaComprasPage() {
  return <ListaCompras />;
}
```

#### Atualização do Sidebar para incluir a seção de Receitas

```tsx
// Modificação no Sidebar.tsx
import { Utensils, Book, ShoppingCart } from 'lucide-react'; // Adicione os imports necessários

// No componente Sidebar, adicione:
<Link href="/alimentacao">
  <Utensils /> Alimentação
</Link>
<Link href="/receitas">
  <Book /> Receitas
</Link>
```

## Considerações de Implementação

### 1. Armazenamento de Dados
- Estou utilizando o Zustand com middleware `persist` para armazenar as receitas no localStorage.
- Para uma aplicação mais robusta, considere implementar um backend com banco de dados.

### 2. Manipulação de Imagens
- O upload de imagens no formulário foi implementado de forma simplificada com URL.createObjectURL.
- Para uma implementação completa, considere:
  - Compressão de imagens no cliente
  - Upload para um serviço de armazenamento (S3, Cloudinary, etc.)
  - Implementar cache e otimização de imagens

### 3. Responsividade
- Os componentes foram projetados com classes responsivas (grid-cols-1 md:grid-cols-3, etc.)
- Teste o layout em diferentes tamanhos de telas para garantir boa experiência móvel

### 4. Recursos Adicionais que Podem Ser Implementados
- **Sistema de avaliação** - Permitir classificar receitas com estrelas
- **Comentários** - Adicionar notas pessoais a cada receita
- **Calendário de refeições** - Visualização em formato de calendário para o planejamento
- **Importação/exportação** - Permitir importar receitas de outros sites ou exportar para formatos como PDF
- **Versões de receitas** - Salvar variações de uma mesma receita
````
