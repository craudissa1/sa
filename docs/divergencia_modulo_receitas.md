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