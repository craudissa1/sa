# Descrição da Página: app/estudos/materiais/page.tsx

Esta página permite ao usuário acessar e visualizar seus materiais de estudo, que estão organizados por tipo e armazenados externamente (provavelmente no Google Drive).

**Funcionalidades Principais:**

*   **Seleção de Tipo de Material:** Apresenta uma lista de tipos de materiais de estudo (Resumos, Flashcards, Simulados, Tarefas, etc.) em botões.
*   **Busca de Arquivos no Drive:**
    *   Ao selecionar um tipo de material, o sistema solicita ao usuário o ID da pasta correspondente no Google Drive através de um `prompt`.
    *   Com o ID da pasta, a página faz uma requisição à API (`/api/drive/listar-materiais?folderId=...`) para listar os arquivos dentro dessa pasta.
    *   Os arquivos retornados são filtrados para incluir apenas aqueles cujo nome contém o tipo de material selecionado (case-insensitive).
*   **Seleção de Arquivo Específico:**
    *   Se a busca retornar múltiplos arquivos correspondentes, um modal (`isFileListModalOpen`) é exibido, listando os arquivos para que o usuário escolha qual visualizar.
    *   Se apenas um arquivo for encontrado, ele é selecionado automaticamente para visualização.
    *   Se nenhum arquivo for encontrado, uma mensagem de alerta é exibida.
*   **Visualização de Material:**
    *   O arquivo selecionado é exibido em um modal de visualização (`isVisualizationModalOpen`).
    *   Se o tipo de material for "Checklists", o componente `VisualizadorChecklist` é usado.
    *   Para outros tipos de material, o componente `VisualizadorMarkdown` é utilizado.
    *   O título do modal de visualização inclui o tipo de material e o nome do arquivo.

**Componentes Utilizados (Exemplos):**

*   `Card`: Para agrupar os botões de tipos de materiais.
*   `Button`: Para selecionar tipos de materiais e arquivos específicos.
*   `Modal`: Para exibir a lista de arquivos para seleção e para visualizar o conteúdo do material.
*   `VisualizadorMarkdown`: Para renderizar conteúdo Markdown.
*   `VisualizadorChecklist`: Para renderizar checklists.
*   `Input`: (Embora importado, não parece ser usado diretamente no JSX principal, mas pode ser parte de um componente interno ou lógica futura).

**Dados e Lógica:**

*   Mantém uma lista estática `materialTypes` com os tipos de materiais disponíveis.
*   Gerencia diversos estados:
    *   `isFileListModalOpen`: Controla a visibilidade do modal de seleção de arquivos.
    *   `filesForSelection`: Armazena a lista de arquivos retornados pela API para seleção.
    *   `selectedMaterialType`: Armazena o tipo de material atualmente selecionado.
    *   `isVisualizationModalOpen`: Controla a visibilidade do modal de visualização de material.
    *   `selectedFileId`: Armazena o ID do arquivo selecionado para visualização.
    *   `modalTitle`: Armazena o título para os modais.
*   A função `handleSelectMaterialType` é acionada ao clicar em um tipo de material, solicita o ID da pasta, busca os arquivos na API, filtra-os e decide se mostra a lista de seleção ou abre a visualização diretamente.
*   A função `handleFileSelection` é chamada quando um arquivo é selecionado na lista, atualizando o estado para abrir o modal de visualização.
*   A função `handleCloseVisualizationModal` fecha o modal de visualização e reseta os estados relevantes.
*   Interage com uma API backend (`/api/drive/listar-materiais`) para buscar os arquivos do Google Drive.