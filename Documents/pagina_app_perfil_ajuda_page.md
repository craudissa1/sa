# Descrição da Página: app/perfil/ajuda/page.tsx

Esta página serve como um guia de ajuda detalhado para os usuários, explicando duas funcionalidades principais: a importação/exportação de dados do aplicativo e a criação de simulados utilizando Inteligência Artificial (IA).

**Funcionalidades Principais:**

*   **Navegação:**
    *   Inclui um link "Voltar para Perfil" para fácil navegação de retorno à página de perfil.
*   **Seção de Ajuda para Importação/Exportação de Dados:**
    *   **Exportação:**
        *   Explica o propósito da exportação (backup, transferência de dados).
        *   Fornece um passo a passo de como exportar dados (ir ao Perfil, localizar seção, clicar em "Exportar Dados").
        *   Informa o nome do arquivo gerado (`stayfocus_backup_DATA.json`).
        *   Recomenda backups regulares.
    *   **Importação:**
        *   Explica que a importação substitui os dados atuais.
        *   Fornece um passo a passo de como importar dados (ir ao Perfil, localizar seção, clicar em "Importar Dados", selecionar arquivo, confirmar).
        *   Alerta sobre a substituição dos dados e a irreversibilidade da ação, sugerindo exportar dados atuais antes de importar.
    *   **Perguntas Frequentes (FAQ):**
        *   Aborda o que acontece com os dados atuais ao importar.
        *   Confirma a possibilidade de transferir dados entre dispositivos.
        *   Discute a segurança do arquivo de backup.
        *   Menciona a compatibilidade de backups com futuras versões do aplicativo.
*   **Seção de Ajuda para Criação de Simulados com IA:**
    *   Explica que LLMs (Claude, ChatGPT, Gemini, etc.) podem ser usados para gerar arquivos de simulado.
    *   **Passo 1: Copiar Estrutura JSON:**
        *   Fornece um modelo JSON completo que a IA deve seguir para criar o simulado.
        *   Destaca os campos obrigatórios (`titulo`, `totalQuestoes`, `id` da questão, `enunciado`, `alternativas`, `gabarito`).
    *   **Passo 2: Preparar Conteúdo (Opcional):**
        *   Sugere copiar o material de estudo para um arquivo `.txt` para fornecer à IA.
    *   **Passo 3: Criar Prompt para IA:**
        *   Instrui sobre como criar um prompt claro para a IA.
        *   Fornece um exemplo de prompt, incluindo placeholders para número de questões, tópico e a instrução para colar a estrutura JSON.
    *   **Passo 4: Usar JSON Gerado no StayFocus:**
        *   Explica como copiar o JSON da IA.
        *   Descreve duas opções para carregar o simulado no StayFocus:
            1.  Colar o texto JSON diretamente na interface de carregamento de simulado.
            2.  Salvar o JSON como um arquivo `.json` e carregá-lo.
    *   **Alerta de Revisão:** Enfatiza a importância de revisar o conteúdo gerado pela IA (questões, alternativas, gabarito, formatação JSON) devido à possibilidade de erros.

**Componentes Utilizados (Exemplos):**

*   Ícones da biblioteca `lucide-react` (`ArrowLeft`, `HelpCircle`, `FileDown`, `FileUp`, `AlertTriangle`).
*   Um ícone SVG customizado para "Brain Circuit" na seção de IA.
*   `Link` do Next.js para navegação.
*   Estrutura de formatação de texto (títulos, parágrafos, listas ordenadas, blocos de citação, blocos de código `pre`/`code`) para apresentar as informações de ajuda de forma clara.

**Dados e Lógica:**

*   A página é primariamente estática, contendo texto informativo e instruções.
*   Não há interações complexas com stores ou APIs, exceto pela navegação.
*   O foco é fornecer um guia compreensível para o usuário.