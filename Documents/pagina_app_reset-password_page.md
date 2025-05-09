# Descrição da Página: app/reset-password/page.tsx

Esta página permite que usuários que esqueceram suas senhas iniciem o processo de redefinição.

**Funcionalidades Principais:**

*   **Formulário de Solicitação de Redefinição:** Exibe o componente `ResetPasswordForm`. Este formulário provavelmente solicita o endereço de email associado à conta do usuário.
*   **Interface Informativa:** Apresenta um título "Redefinir sua senha" e uma breve instrução de que um link será enviado por email para o processo de redefinição.
*   **Layout Centralizado:** Assim como as páginas de login e registro, esta página utiliza um layout que centraliza o formulário na tela.

**Componentes Utilizados (Exemplos):**

*   `ResetPasswordForm`: O componente principal que encapsula a lógica e a interface para o usuário submeter seu email e solicitar o link de redefinição de senha.

**Dados e Lógica:**

*   **Metadados da Página:** Define metadados como título (`Redefinir Senha | Painel Neurodivergentes`) e descrição.
*   A lógica de verificar o email, gerar um token de redefinição e enviar o email com o link é encapsulada dentro do componente `ResetPasswordForm` e/ou no backend/serviço de autenticação. A página `ResetPasswordPage` serve como um contêiner para este formulário.