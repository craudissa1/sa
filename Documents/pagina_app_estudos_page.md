# Descrição da Página: app/estudos/page.tsx

Esta página centraliza as ferramentas e informações para auxiliar o usuário em suas sessões de estudo.

**Funcionalidades Principais:**

*   **Temporizador Pomodoro:** Integra um temporizador Pomodoro para gerenciamento do tempo de estudo e pausas.
*   **Registro de Estudos:** Permite ao usuário registrar suas sessões de estudo, possivelmente para acompanhamento de progresso e dedicação.
*   **Informações do Próximo Concurso:** Exibe um card com detalhes do próximo concurso planejado (título, organizadora, data da prova, progresso de estudos), com link para a página de detalhes do concurso. Se nenhum concurso estiver planejado, oferece um link para adicionar um.
*   **Acesso a Materiais de Estudo:** Apresenta uma seção com botões para diferentes tipos de materiais de estudo (Resumos, Flashcards, Simulados, Tarefas, Estratégias de Foco, Agendamento de Pausas, Mapas Mentais, Outlines de Infográficos, Checklists, Guias de Estudo).
    *   Ao clicar em um tipo de material, a página busca arquivos correspondentes (provavelmente de um serviço de armazenamento como Google Drive, via API `/api/drive/listar-materiais`).
    *   Se múltiplos arquivos forem encontrados, um modal (`isFileListModalOpen`) é exibido para o usuário selecionar o arquivo desejado.
    *   Se apenas um arquivo for encontrado, ele é aberto diretamente.
    *   O conteúdo do arquivo selecionado (Markdown ou Checklist) é exibido em um modal de visualização (`isVisualizationModalOpen`), utilizando os componentes `VisualizadorMarkdown` ou `VisualizadorChecklist`.
*   **Navegação Rápida:** Contém botões para navegar para a página de "Simulado", "Ver Todos Concursos" e "Acesso a matérias de estudos" (que parece ser a página `/estudos/materiais`).

**Componentes Utilizados (Exemplos):**

*   `Card`: Para organizar as seções da página.
*   `Button`: Para navegação e seleção de materiais.
*   `Modal`: Para exibir a lista de arquivos e os visualizadores de conteúdo.
*   `TemporizadorPomodoro`: Componente do temporizador.
*   `RegistroEstudos`: Componente para registrar sessões de estudo.
*   `VisualizadorMarkdown`: Para renderizar conteúdo Markdown.
*   `VisualizadorChecklist`: Para renderizar checklists.
*   `Link`: Para navegação entre páginas.

**Dados e Lógica:**

*   Utiliza `useConcursosStore` para obter a lista de concursos e identificar o próximo.
*   Gerencia estados para:
    *   ID do arquivo selecionado (`selectedFileId`).
    *   Título do modal de visualização (`modalTitle`).
    *   Visibilidade do modal de visualização (`isVisualizationModalOpen`).
    *   Visibilidade do modal de listagem de arquivos (`isFileListModalOpen`).
    *   Lista de arquivos para seleção (`filesForSelection`).
    *   Tipo de material selecionado (`selectedMaterialType`).
*   A função `handleSelectMaterialType` busca os arquivos do tipo selecionado via API e decide se abre um arquivo diretamente ou mostra a lista para seleção.
*   A função `handleFileSelection` define o arquivo selecionado da lista e abre o modal de visualização.
*   A função `handleCloseVisualizationModal` fecha o modal de visualização e reseta os estados relacionados.
*   Formata datas usando `date-fns` com localização `ptBR`.
*   Calcula o progresso de estudos para o próximo concurso.