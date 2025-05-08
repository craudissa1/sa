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