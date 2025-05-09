# Descrição da Página: app/autoconhecimento/page.tsx

Esta página é dedicada a auxiliar o usuário no processo de autoconhecimento, permitindo o registro e organização de reflexões pessoais.

**Funcionalidades Principais:**

*   **Organização por Abas:** As notas são categorizadas em três seções principais para facilitar a organização:
    *   **Quem sou:** Para registrar preferências, aversões e características pessoais.
    *   **Meus porquês:** Para documentar motivações e valores fundamentais.
    *   **Meus padrões:** Para anotar reações emocionais típicas e estratégias de enfrentamento.
*   **Criação e Edição de Notas:** O usuário pode criar novas notas dentro de cada seção ou editar notas existentes. Um editor de texto é fornecido para inserir o conteúdo.
*   **Listagem de Notas:** As notas criadas em cada seção são listadas, permitindo ao usuário visualizá-las e selecionar uma para edição.
*   **Modo Refúgio:** A página oferece um "Modo Refúgio", que provavelmente simplifica a interface para um ambiente de escrita mais focado e com menos distrações.
*   **Interface Dinâmica:** A visualização da página se adapta dependendo se o usuário está visualizando a lista de notas, criando uma nova nota ou editando uma existente. Em telas maiores, a lista de notas e o editor podem ser exibidos lado a lado.

**Componentes Utilizados (Exemplos):**

*   `EditorNotas`: Componente para a entrada e edição do conteúdo das notas.
*   `ListaNotas`: Exibe as notas de uma determinada seção e permite a seleção ou adição de novas notas.
*   `ModoRefugio`: Componente que ativa/desativa a interface simplificada.
*   Abas de navegação para alternar entre as seções "Quem sou", "Meus porquês" e "Meus padrões".
*   Botões para criar nova nota, salvar, cancelar edição.

**Dados e Lógica:**

*   Gerencia o estado da aba selecionada, a nota atualmente selecionada para edição e se o usuário está no processo de criar uma nova nota.
*   Utiliza o `useAutoconhecimentoStore` para acessar o estado do `modoRefugio`.
*   A lógica de salvar, carregar e deletar notas provavelmente reside dentro dos componentes `EditorNotas` e `ListaNotas`, que interagem com o store ou um serviço de dados.