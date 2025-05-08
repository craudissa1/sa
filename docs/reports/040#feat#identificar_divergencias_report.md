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
