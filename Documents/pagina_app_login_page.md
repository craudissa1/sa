# Descrição da Página: app/login/page.tsx

Esta página é responsável por apresentar a interface de login para os usuários acessarem suas contas na aplicação "Painel Neurodivergentes".

**Funcionalidades Principais:**

*   **Formulário de Login:** Exibe o componente `LoginForm`, que contém os campos necessários para o usuário inserir suas credenciais (provavelmente email e senha) e realizar o login.
*   **Interface de Boas-Vindas:** Apresenta uma mensagem de boas-vindas e um texto instrutivo para o usuário.
*   **Layout Centralizado:** A página possui um layout que centraliza o formulário de login na tela, com um fundo diferenciado.

**Componentes Utilizados (Exemplos):**

*   `LoginForm`: O componente principal que encapsula a lógica e a interface do formulário de login.

**Dados e Lógica:**

*   **Metadados da Página:** Define metadados específicos para a página de login, como título (`Login | Painel Neurodivergentes`) e descrição, que são importantes para SEO e para a aba do navegador.
*   A lógica de autenticação em si (validação de credenciais, comunicação com o backend/serviço de autenticação) é encapsulada dentro do componente `LoginForm`. A página `LoginPage` atua primariamente como um contêiner para este formulário.