# Descrição da Página: app/hiperfocos/page.tsx

Esta página é projetada para ajudar usuários a gerenciar seus "hiperfocos" — interesses intensos — transformando-os em projetos estruturados e auxiliando na gestão de transições de foco.

**Funcionalidades Principais:**

*   **Navegação por Abas:** A interface é organizada em quatro abas principais para diferentes funcionalidades:
    *   **Conversor de Interesses:** Provavelmente uma ferramenta para ajudar a transformar um interesse bruto em um projeto mais definido (componente `ConversorInteresses`).
    *   **Sistema de Alternância:** Pode oferecer estratégias ou ferramentas para ajudar o usuário a alternar entre diferentes focos ou tarefas (componente `SistemaAlternancia`).
    *   **Estrutura de Projetos:** Uma ferramenta para visualizar e organizar os projetos de hiperfoco (componente `VisualizadorProjetos`).
    *   **Temporizador:** Um temporizador de foco, possivelmente similar ao Pomodoro, mas adaptado para hiperfocos (componente `TemporizadorFoco`).
*   **Resumo dos Hiperfocos:** Se houver projetos de hiperfoco cadastrados, um card de resumo é exibido abaixo das abas. Este resumo lista cada projeto com:
    *   Título do projeto (com uma cor associada).
    *   Contagem de tarefas concluídas em relação ao total de tarefas do projeto.

**Componentes Utilizados (Exemplos):**

*   `ConversorInteresses`: Ferramenta para converter interesses em projetos.
*   `SistemaAlternancia`: Ferramenta para gerenciar a alternância de foco.
*   `VisualizadorProjetos`: Para visualizar a estrutura dos projetos de hiperfoco.
*   `TemporizadorFoco`: Temporizador específico para sessões de hiperfoco.
*   Botões de navegação para alternar entre as abas.

**Dados e Lógica:**

*   Utiliza o `useHiperfocosStore` para acessar a lista de `hiperfocoProjetos` e `hiperfocoTarefas`.
*   Gerencia o estado da `tabAtiva` para controlar qual componente de funcionalidade é exibido.
*   No card de resumo, para cada projeto, filtra as tarefas associadas a ele a partir do `hiperfocoTarefas` no store e calcula o número de tarefas concluídas e o total de tarefas.
*   A cor de fundo do item do projeto no resumo é dinamicamente definida com base na `cor` do projeto, com uma transparência aplicada (`${hiperfoco.cor}20`).