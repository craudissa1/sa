# Descrição da Página: app/estudos/simulado-personalizado/page.tsx

Esta página é responsável por carregar e exibir um simulado personalizado, montado a partir de questões previamente selecionadas pelo usuário e armazenadas no `localStorage`.

**Funcionalidades Principais:**

*   **Carregamento de Questões Personalizadas:**
    *   Ao carregar a página, ela tenta buscar um item chamado `simulado_personalizado_questoes` do `localStorage`.
    *   Se encontrado, o conteúdo (que se espera ser um JSON de um array de questões) é parseado.
    *   As questões recuperadas são então transformadas e adaptadas para a estrutura de dados esperada pelo `simuladoStore` e pelo componente `SimuladoReview`. Isso inclui:
        *   Criar metadados básicos para o simulado (título, total de questões, data de geração, ID do concurso da primeira questão).
        *   Mapear os campos de cada questão (enunciado, alternativas, gabarito, assunto, dificuldade, explicação) para o formato do store.
        *   Converter as alternativas de um array para um objeto com chaves 'a', 'b', 'c', etc.
        *   Identificar a chave da alternativa correta para o campo `gabarito`.
    *   Após a transformação, os dados do simulado são carregados no `simuladoStore` usando a função `loadSimulado`.
*   **Exibição do Simulado:**
    *   Se os dados do simulado (`simuladoData` do store) ainda não estiverem carregados, uma mensagem "Carregando simulado personalizado..." é exibida.
    *   Uma vez que `simuladoData` esteja disponível, o componente `SimuladoReview` é renderizado, permitindo ao usuário interagir com o simulado personalizado (responder às questões, revisar, etc.).

**Componentes Utilizados (Exemplos):**

*   `SimuladoReview`: O principal componente para a interface de realização/revisão do simulado.

**Dados e Lógica:**

*   Utiliza o `useSimuladoStore` para carregar os dados do simulado personalizado (`loadSimulado`) e para verificar se os dados já foram carregados (`simuladoData`).
*   A lógica principal reside no `useEffect` hook, que é executado uma vez quando a página monta:
    *   Lê dados do `localStorage`.
    *   Faz o parsing e a transformação dos dados das questões.
    *   Chama `loadSimulado` para popular o store.
*   Não há interface para *selecionar* as questões nesta página; presume-se que a seleção e o armazenamento no `localStorage` ocorrem em outra parte da aplicação (provavelmente na página de detalhes de um concurso ou em uma seção de banco de questões).
*   Se houver erro ao parsear os dados do `localStorage` ou se não houver questões, a página pode não carregar o simulado corretamente, mas o `useEffect` tenta tratar erros de parse silenciosamente.