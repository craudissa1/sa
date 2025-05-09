# Descrição da Página: app/registration-success/page.tsx

Esta página é exibida ao usuário imediatamente após ele ter completado o processo de registro com sucesso. Seu principal objetivo é informar sobre a necessidade de confirmação por email.

**Funcionalidades Principais:**

*   **Confirmação Visual de Sucesso:**
    *   Exibe um ícone de "CheckCircle2" e uma mensagem "Registro Concluído!" para indicar que o cadastro inicial foi bem-sucedido.
*   **Instrução para Confirmação de Email:**
    *   Informa ao usuário que um email de confirmação foi enviado e que ele precisa clicar no link contido nesse email para ativar sua conta.
*   **Solução de Problemas (Email não recebido):**
    *   Sugere verificar a pasta de spam.
    *   Menciona a possibilidade de tentar fazer login novamente para reenviar o email de confirmação.
*   **Navegação Pós-Registro:**
    *   Oferece um botão "Ir para Login" que direciona o usuário para a página de login.
    *   Oferece um botão "Voltar para Página Inicial" que direciona o usuário para a home page da aplicação.

**Componentes Utilizados (Exemplos):**

*   Ícone `CheckCircle2` da biblioteca `lucide-react`.
*   `Link` do Next.js para os botões de navegação.

**Dados e Lógica:**

*   **Metadados da Página:** Define metadados específicos como título (`Registro Concluído | Painel Neurodivergentes`) e descrição.
*   A página é primariamente informativa e estática, focada em guiar o usuário para o próximo passo (confirmação de email) e oferecer opções de navegação.
*   Não há manipulação de dados do usuário ou interações com stores nesta página.