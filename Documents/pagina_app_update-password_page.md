# Descrição da Página: app/update-password/page.tsx

Esta página é acessada por usuários que seguiram um link de redefinição de senha (enviado por email) e permite que eles definam uma nova senha para suas contas.

**Funcionalidades Principais:**

*   **Formulário de Atualização de Senha:** Exibe o componente `UpdatePasswordForm`. Este formulário provavelmente requer que o usuário insira sua nova senha e a confirme. Pode também incluir o token de redefinição (geralmente via URL) para validar a solicitação.
*   **Interface Informativa:** Apresenta um título "Atualize sua senha" e uma instrução para criar uma nova senha.
*   **Layout Centralizado:** Similar às outras páginas de autenticação, utiliza um layout que centraliza o formulário.

**Componentes Utilizados (Exemplos):**

*   `UpdatePasswordForm`: O componente principal que encapsula a lógica e a interface para o usuário inserir e submeter sua nova senha.

**Dados e Lógica:**

*   **Metadados da Página:** Define metadados como título (`Atualizar Senha | Painel Neurodivergentes`) e descrição.
*   A lógica de validar a nova senha (e sua confirmação), verificar a validade do token de redefinição (se aplicável) e comunicar-se com o backend/serviço de autenticação para atualizar a senha do usuário é encapsulada dentro do componente `UpdatePasswordForm`. A página `UpdatePasswordPage` serve como um contêiner para este formulário.