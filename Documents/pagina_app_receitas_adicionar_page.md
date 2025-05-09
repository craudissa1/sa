# Descrição da Página: app/receitas/adicionar/page.tsx

Esta página é dedicada exclusivamente a permitir que o usuário adicione uma nova receita ao sistema.

**Funcionalidades Principais:**

*   **Formulário de Nova Receita:** A página renderiza o componente `AdicionarReceitaForm`. Como nenhuma propriedade `receitaParaEditar` é passada para este componente, ele é inicializado como um formulário em branco, pronto para a entrada de dados de uma nova receita.

**Componentes Utilizados (Exemplos):**

*   `AdicionarReceitaForm`: O componente que contém todos os campos e a lógica para coletar as informações de uma nova receita (nome, ingredientes, modo de preparo, categorias, etc.) e salvá-la.

**Dados e Lógica:**

*   A página em si é muito simples e atua como um invólucro para o `AdicionarReceitaForm`.
*   Toda a lógica de manipulação do formulário, validação de dados e submissão para salvar a nova receita reside dentro do componente `AdicionarReceitaForm`.