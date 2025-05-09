# Descrição da Página: app/roadmap/page.tsx

Esta página apresenta o roadmap de desenvolvimento do aplicativo "StayFocus", detalhando o conceito por trás do projeto, as funcionalidades já implementadas em sprints anteriores e os planos para sprints futuros.

**Funcionalidades Principais:**

*   **Apresentação do Conceito:**
    *   Explica a motivação para a criação do StayFocus (experiência pessoal com TDAH).
    *   Destaca os princípios de design: simplicidade, clareza visual, adaptabilidade e persistência.
*   **Detalhes das Sprints de Desenvolvimento:**
    *   **Sprint 1 (Concluído):**
        *   Página Inicial (Painel do Dia, Lista de Prioridades, Lembretes de Pausas, Checklist de Medicamentos).
        *   Alimentação (Planejador e Registro de Refeições, Lembrete de Hidratação).
        *   Estudos (Pomodoro, Registro de Estudos, Conferência e Histórico de Simulados, Integração do Histórico com Backups).
        *   Saúde (Registro de Medicamentos com intervalo entre doses, Monitoramento de Humor).
        *   Lazer (Temporizador, Atividades de Lazer, Sugestões de Descanso).
    *   **Sprint 2 (Concluído):**
        *   Gestão do Sono (Registro, Visualizador Semanal, Lembretes Personalizáveis, Metas de Sono).
    *   **Sprint 3 (Concluído):**
        *   Notas de Autoconhecimento (Seções organizadas, Modo Refúgio, Tags, Âncoras Visuais).
        *   Informações Pessoais (Perfil, Metas Diárias, Preferências Visuais).
    *   **Sprint 4 (Concluído):**
        *   Melhorias de Interface (Correções visuais, novos ícones/layout, atualização do rodapé, renomeação para StayFocus).
    *   **Sprint 6 (Funcionalidades Adicionais - Concluído):**
        *   Backup e Restauração (Local via JSON, Integração com Google Drive, Inclusão do Histórico de Simulados nos backups).
    *   **Sprint 7 (Final - Planejado):**
        *   Aviso sobre uma pausa de um mês antes do início do desenvolvimento desta sprint.
        *   Sincronização e Apps Mobile (Backend com Supabase, Aplicativos iOS e Android, Sincronização offline).
*   **Status das Sprints:** Cada sprint é marcada como "Concluído" ou "Planejado", com um ícone visual.

**Componentes Utilizados (Exemplos):**

*   `Container`: Para o layout geral da página.
*   `Card`: Para agrupar as informações de cada sprint e a seção de conceito.
*   `Section`: Para o título principal da página.
*   Ícone `CheckCircle2` da `lucide-react` para indicar sprints concluídas.
*   Listas (`ul`, `li`) para detalhar as funcionalidades de cada sprint.

**Dados e Lógica:**

*   A página é puramente informativa e estática, apresentando o histórico e os planos de desenvolvimento do projeto.
*   Não há interações com stores ou APIs para buscar dados dinâmicos; todo o conteúdo está codificado diretamente no JSX.