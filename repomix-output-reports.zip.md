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
reports/
  020#feat#verificar_itens_concluidos_report.md
  040#feat#identificar_divergencias_report.md
  070#docs#documentar_divergencias_modulos_pessoais_report.md
  090#docs#documentar_divergencias_modulos_produtividade_report.md
  analise_funcionalidades_centrais.md
```

# Files

## File: reports/020#feat#verificar_itens_concluidos_report.md
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

## File: reports/040#feat#identificar_divergencias_report.md
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

## File: reports/070#docs#documentar_divergencias_modulos_pessoais_report.md
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

## File: reports/090#docs#documentar_divergencias_modulos_produtividade_report.md
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

## File: reports/analise_funcionalidades_centrais.md
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
