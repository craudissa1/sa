# Descrição da Página: app/estudos/simulado/page.tsx

Esta página é dedicada à realização e conferência de simulados. Ela gerencia o fluxo de um simulado, desde o carregamento das questões até a exibição dos resultados e revisão.

**Funcionalidades Principais:**

*   **Carregamento de Simulado:** Inicialmente, apresenta uma interface para carregar um simulado (componente `SimuladoLoader`). Isso provavelmente envolve selecionar um arquivo de simulado ou configurar um novo.
*   **Revisão do Simulado:** Após o carregamento ou durante a realização, permite a revisão das questões (componente `SimuladoReview`).
*   **Exibição de Resultados:** Ao finalizar o simulado, mostra os resultados obtidos pelo usuário (componente `SimuladoResults`).
*   **Histórico de Simulados:** Permite ao usuário visualizar um histórico de simulados realizados através de um modal (componente `HistoricoModal`).
*   **Reiniciar/Carregar Novo Simulado:** Oferece um botão para "Carregar Novo", que reseta o estado atual do simulado (via `resetSimulado` do store) e volta para a tela de carregamento, permitindo iniciar um novo simulado. Este botão só aparece se o status não for 'idle'.

**Componentes Utilizados (Exemplos):**

*   `SimuladoLoader`: Interface para iniciar ou carregar um simulado.
*   `SimuladoReview`: Interface para responder ou revisar as questões do simulado.
*   `SimuladoResults`: Interface para exibir o desempenho no simulado.
*   `HistoricoModal`: Modal para exibir o histórico de simulados anteriores.
*   `Container`: Componente de layout para envolver o conteúdo da página.
*   `Button`: Para ações como "Histórico" e "Carregar Novo".
*   Ícone `History`: Usado no botão de histórico.

**Dados e Lógica:**

*   Utiliza o `useSimuladoStore` para gerenciar o estado do simulado (`status`, `resetSimulado`). O `status` pode ser:
    *   `idle`: Estado inicial, esperando o carregamento de um simulado.
    *   `loading`: Carregando dados do simulado.
    *   `reviewing`: Em processo de realização/revisão do simulado.
    *   `results`: Exibindo os resultados do simulado.
*   A função `renderContent` decide qual componente (`SimuladoLoader`, `SimuladoReview`, `SimuladoResults` ou uma mensagem de carregamento) exibir com base no `status` atual do simulado.
*   Gerencia o estado `isHistoricoOpen` para controlar a visibilidade do modal de histórico.