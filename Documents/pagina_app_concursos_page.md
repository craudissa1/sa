# Descrição da Página: app/concursos/page.tsx

Esta página é a central de gerenciamento de concursos para o usuário, permitindo adicionar, visualizar e acompanhar o progresso nos estudos para diferentes certames.

**Funcionalidades Principais:**

*   **Listagem de Concursos:** Exibe os concursos cadastrados pelo usuário em formato de cards. Cada card mostra:
    *   Título do concurso.
    *   Organizadora.
    *   Status atual do concurso (ex: Planejado, Inscrito, Estudando, Realizado, Aguardando Resultado), com cores distintas para fácil identificação.
    *   Data da prova.
    *   Barra de progresso geral dos estudos para o conteúdo programático.
    *   Link para ver detalhes do concurso.
*   **Adicionar Concurso Manualmente:** Permite ao usuário cadastrar um novo concurso preenchendo um formulário (`ConcursoForm`).
*   **Importar Concurso via JSON:** Oferece a funcionalidade de importar os dados de um concurso a partir de um arquivo JSON, provavelmente contendo informações do edital. Após a importação, o usuário é redirecionado para a página de detalhes do concurso importado.
*   **Visualização Condicional:** Se nenhum concurso estiver cadastrado, uma mensagem informativa é exibida.

**Componentes Utilizados (Exemplos):**

*   `Card`: Para exibir as informações de cada concurso.
*   `Button`: Para ações como "Adicionar Manualmente", "Importar JSON" e "Ver detalhes".
*   `ConcursoForm`: Modal ou formulário para o cadastro manual de novos concursos.
*   `ImportarConcursoJsonModal`: Modal para o upload e processamento do arquivo JSON do edital.
*   Ícones (`Award`, `Calendar`, `Plus`, `Upload`): Para melhorar a interface visual.

**Dados e Lógica:**

*   Utiliza o `useConcursosStore` para buscar a lista de concursos e adicionar novos.
*   Gerencia o estado de exibição dos modais de adição manual (`showAddModal`) e importação (`showImportModal`).
*   Formata a data da prova utilizando `date-fns` com localização para `ptBR`.
*   Calcula o progresso geral dos estudos com base no `conteudoProgramatico` de cada concurso.
*   Define mapeamentos para `statusLabel` (rótulos dos status em português) e `statusColors` (cores de fundo e texto para cada status).
*   A função `handleImportConcurso` processa o concurso importado, gera um ID, define um status inicial e o adiciona ao store, redirecionando o usuário em seguida.
*   Utiliza `next/navigation` (`useRouter`) para redirecionamento após a importação.