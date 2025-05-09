# Descrição da Página: app/page.tsx

Esta é a página inicial da aplicação, funcionando como um dashboard central para o usuário.

**Funcionalidades Principais:**

*   **Visão Geral do Dia:** Apresenta um painel visual com informações relevantes para o dia do usuário.
*   **Gerenciamento de Tarefas:** Exibe uma lista de prioridades diárias e permite o acompanhamento de um checklist de medicamentos.
*   **Lembretes e Avisos:** Mostra lembretes para pausas e informações sobre a próxima prova agendada (se houver pausas configuradas para serem exibidas).
*   **Resumo de Atividades:** Fornece um resumo quantitativo de prioridades pendentes, prioridades concluídas e o número de próximos compromissos.
*   **Navegação Rápida:** Oferece links de acesso rápido para seções importantes da aplicação, como "Estudos", "Saúde", "Hiperfocos" e "Lazer".
*   **Personalização Visual:** Aplica automaticamente as preferências visuais definidas pelo usuário, como aumento do tamanho do texto, modo de alto contraste e redução de animações/estímulos, visando melhorar a acessibilidade e a experiência de uso.
*   **Carregamento Progressivo:** Utiliza componentes de carregamento (placeholders) enquanto os dados principais do dashboard estão sendo buscados, melhorando a percepção de performance.

**Componentes Utilizados (Exemplos):**

*   `DashboardHeader`: Cabeçalho da página.
*   `DashboardSummary`: Resumo das atividades.
*   `PainelDia`: Componente visual do dia.
*   `ListaPrioridades`: Lista de tarefas prioritárias.
*   `ChecklistMedicamentos`: Checklist para medicamentos.
*   `LembretePausas`: Lembretes para descanso.
*   `ProximaProvaCard`: Card com informações da próxima prova.
*   Links para outras seções (`/estudos`, `/saude`, etc.).

**Dados e Lógica:**

*   Utiliza o hook `useDashboard` para buscar e gerenciar os dados exibidos no dashboard.
*   Aplica dinamicamente classes CSS ao `document.documentElement` com base nas `preferenciasVisuais` do usuário.