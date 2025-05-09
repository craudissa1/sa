# Descrição da Página: app/receitas/page.tsx

Esta página serve como a interface principal para o usuário gerenciar e visualizar suas receitas.

**Funcionalidades Principais:**

*   **Listagem de Receitas:** Exibe uma lista de receitas cadastradas (componente `ListaReceitas`).
*   **Adicionar Nova Receita:** Contém um botão que redireciona o usuário para a página de adicionar nova receita (`/receitas/adicionar`).
*   **Importador de Receitas:** Inclui um componente (`ImportadorReceitas`) que permite ao usuário importar receitas, provavelmente de um formato de arquivo específico ou URL.
*   **Pesquisa de Receitas:**
    *   Um campo de pesquisa (`Pesquisa`) permite ao usuário buscar receitas por nome ou por ingredientes.
    *   A pesquisa é case-insensitive.
*   **Filtro por Categorias:**
    *   Um seletor de categorias (`FiltroCategorias`) permite filtrar as receitas exibidas.
    *   O filtro pode ser "todas" ou uma categoria específica.
*   **Acesso à Lista de Compras:** Um botão redireciona para a página da lista de compras (`/receitas/lista-compras`).
*   **Filtragem Combinada:** As receitas exibidas são o resultado da combinação do filtro de categoria e do termo de pesquisa.

**Componentes Utilizados (Exemplos):**

*   `ListaReceitas`: Para exibir os cards ou itens de receita.
*   `FiltroCategorias`: Dropdown ou seletor para as categorias de receitas.
*   `Pesquisa`: Campo de input para busca textual.
*   `Button`: Para "Adicionar Nova Receita" e "Lista de Compras".
*   `Link`: Para navegação para outras páginas de receitas.
*   `ImportadorReceitas`: Componente para a funcionalidade de importação.

**Dados e Lógica:**

*   Utiliza o `useReceitasStore` para obter a lista completa de `receitas`.
*   Gerencia os estados locais:
    *   `filtroCategoria`: Armazena a categoria atualmente selecionada para filtro.
    *   `termoPesquisa`: Armazena o texto digitado no campo de pesquisa.
*   A lógica de `receitasFiltradas` combina os dois filtros:
    1.  Filtra por categoria (se não for "todas").
    2.  Filtra o resultado anterior pelo `termoPesquisa`, verificando se o termo (em minúsculas) está presente no nome da receita (em minúsculas) ou no nome de algum dos ingredientes (em minúsculas).
    *   O código comentado sugere que a pesquisa poderia ser estendida para incluir descrições e tags.
*   Passa as `receitasFiltradas` para o componente `ListaReceitas` para renderização.