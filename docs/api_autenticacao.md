# Documentação da API de Autenticação

## 1. Visão Geral

A API de Autenticação do StayFocus é responsável por gerenciar o acesso dos usuários à plataforma. Ela utiliza o [Supabase](https://supabase.io/) como backend para lidar com os processos de cadastro, login e gerenciamento de sessões.

Atualmente, são suportados dois métodos principais de autenticação:
*   Autenticação via provedor OAuth 2.0 (Google).
*   Autenticação tradicional com Email e Senha.

## 2. Fluxo de Autenticação OAuth2 com Google

O fluxo de autenticação utilizando o Google como provedor OAuth 2.0 é orquestrado pelo SDK do Supabase e segue os seguintes passos:

1.  **Início do Fluxo:**
    *   O usuário clica no botão "Entrar com Google" na página de login ([`app/auth/login/page.tsx`](app/auth/login/page.tsx:106)).
    *   A função `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'URL_CALLBACK' } })` é chamada ([`app/auth/login/page.tsx:42`](app/auth/login/page.tsx:42)).
    *   `URL_CALLBACK` é dinamicamente definida como `${window.location.origin}/auth/callback`.

2.  **Redirecionamento para o Google:**
    *   O Supabase redireciona o navegador do usuário para a página de autorização do Google.
    *   O usuário autentica-se com suas credenciais do Google e autoriza o acesso da aplicação StayFocus às informações solicitadas (escopos).

3.  **Retorno do Google e Callback:**
    *   Após a autorização, o Google redireciona o usuário de volta para a aplicação, especificamente para a rota de callback configurada: `/auth/callback` ([`app/auth/callback/route.ts`](app/auth/callback/route.ts)).
    *   A URL de callback inclui um parâmetro `code` (código de autorização).

4.  **Troca do Código pela Sessão:**
    *   A rota de callback ([`app/auth/callback/route.ts`](app/auth/callback/route.ts:6)) extrai o `code` da URL.
    *   A função `supabase.auth.exchangeCodeForSession(code)` é chamada ([`app/auth/callback/route.ts:13`](app/auth/callback/route.ts:13)) para trocar o código de autorização por uma sessão de usuário válida com o Supabase.

5.  **Redirecionamento para a Aplicação:**
    *   Se a troca for bem-sucedida, o usuário é redirecionado para a página inicial da aplicação (`/`) ou para a URL especificada no parâmetro `next` ([`app/auth/callback/route.ts:15`](app/auth/callback/route.ts:15)).
    *   Em caso de erro, o usuário é redirecionado para a página de login com uma mensagem de erro ([`app/auth/callback/route.ts:21`](app/auth/callback/route.ts:21)).

## 3. Autenticação com Email e Senha

### 3.1. Cadastro (Sign Up)

*   **Endpoint (Frontend):** Página de cadastro em [`app/auth/signup/page.tsx`](app/auth/signup/page.tsx).
*   **Método Supabase:** `supabase.auth.signUp({ email, password })` ([`app/auth/signup/page.tsx:30`](app/auth/signup/page.tsx:30)).
*   **Descrição:** Permite que novos usuários criem uma conta fornecendo um email e senha.
    *   O sistema verifica se as senhas digitadas coincidem ([`app/auth/signup/page.tsx:22`](app/auth/signup/page.tsx:22)).
    *   A senha deve ter no mínimo 6 caracteres (padrão Supabase) ([`app/auth/signup/page.tsx:93`](app/auth/signup/page.tsx:93)).
    *   A confirmação de e-mail pode estar habilitada no Supabase. Se sim, o usuário receberá um e-mail para confirmar sua conta antes de poder fazer login. O código atual sugere que o redirecionamento para confirmação de e-mail (`emailRedirectTo`) está comentado ([`app/auth/signup/page.tsx:35`](app/auth/signup/page.tsx:35)), então o comportamento padrão do Supabase para confirmação de e-mail será aplicado.

**Exemplo de Interação (Frontend - Simplificado):**
```javascript
// Em app/auth/signup/page.tsx
async function handleSignup(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    // Tratar erro
    console.error("Erro no cadastro:", error.message);
  } else if (data.user) {
    // Cadastro bem-sucedido (ou requer confirmação de e-mail)
    console.log("Usuário registrado:", data.user);
    // Redirecionar para login ou página de "verifique seu e-mail"
  }
}
```

### 3.2. Login

*   **Endpoint (Frontend):** Página de login em [`app/auth/login/page.tsx`](app/auth/login/page.tsx).
*   **Método Supabase:** `supabase.auth.signInWithPassword({ email, password })` ([`app/auth/login/page.tsx:22`](app/auth/login/page.tsx:22)).
*   **Descrição:** Permite que usuários existentes acessem suas contas.

**Exemplo de Interação (Frontend - Simplificado):**
```javascript
// Em app/auth/login/page.tsx
async function handleLogin(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    // Tratar erro de login
    console.error("Erro no login:", error.message);
  } else {
    // Login bem-sucedido
    // Redirecionar para a página inicial
    console.log("Login realizado com sucesso!");
  }
}
```

## 4. Escopos de Permissão (OAuth)

Os escopos de permissão para o fluxo OAuth2 com Google não são explicitamente definidos no código da aplicação frontend ([`app/lib/supabaseClient.ts`](app/lib/supabaseClient.ts) ou [`app/auth/login/page.tsx`](app/auth/login/page.tsx)). Isso indica que a aplicação provavelmente utiliza os escopos padrão configurados durante a integração do provedor Google OAuth nas configurações do projeto Supabase.

Os escopos padrão comumente solicitados pelo Google para autenticação básica são:
*   `openid`: Afirma a identidade do usuário.
*   `email`: Permite o acesso ao endereço de e-mail principal do usuário.
*   `profile`: Permite o acesso às informações básicas do perfil do usuário (nome, foto, etc.).

**Nota:** Para confirmar os escopos exatos, é necessário verificar as configurações do provedor OAuth "Google" no painel de administração do Supabase e, possivelmente, as configurações do cliente OAuth no Google Cloud Console.

## 5. Endpoints da API (Conforme gerenciado pelo Supabase)

O Supabase abstrai as chamadas diretas de API REST para autenticação através do seu SDK. Os "endpoints" do ponto de vista do desenvolvedor frontend são as funções do SDK:

*   **Cadastro:** `supabase.auth.signUp()`
*   **Login com Email/Senha:** `supabase.auth.signInWithPassword()`
*   **Login com OAuth (Google):** `supabase.auth.signInWithOAuth()`
*   **Troca de Código por Sessão (OAuth Callback):** `supabase.auth.exchangeCodeForSession()`
*   **Logout:** `supabase.auth.signOut()` (Não explorado nos arquivos, mas é um endpoint comum)
*   **Obter Usuário Atual:** `supabase.auth.getUser()` (Não explorado, mas comum)
*   **Obter Sessão Atual:** `supabase.auth.getSession()` (Não explorado, mas comum)

**Exemplos de Requisição/Resposta:**

Como o SDK do Supabase gerencia as requisições HTTP subjacentes, os exemplos focam na interação com o SDK.

### 5.1. Cadastro (Email/Senha)

**Requisição (uso do SDK):**
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'novo.usuario@example.com',
  password: 'passwordSegura123',
  // options: {
  //   emailRedirectTo: 'https://example.com/welcome', // Opcional
  //   data: { // Dados adicionais a serem salvos no perfil do usuário
  //     full_name: 'Nome Completo',
  //   }
  // }
});
```

**Resposta (objeto `data` em caso de sucesso, se a confirmação de email estiver desabilitada ou após a confirmação):**
```json
{
  "user": {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "novo.usuario@example.com",
    "email_confirmed_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ", // Presente se confirmado
    "phone": "",
    "confirmed_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ", // Presente se confirmado
    "last_sign_in_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ", // Presente se logado automaticamente
    "app_metadata": {
      "provider": "email",
      "providers": ["email"]
    },
    "user_metadata": {
      // "full_name": "Nome Completo" // Se 'data' foi fornecido no signUp
    },
    "identities": [
      {
        "identity_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "user_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "identity_data": {
          "email": "novo.usuario@example.com",
          "email_verified": true, // ou false se aguardando confirmação
          "phone_verified": false,
          "sub": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        },
        "provider": "email",
        "last_sign_in_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ",
        "created_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ",
        "updated_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ"
      }
    ],
    "created_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ",
    "updated_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ"
  },
  "session": { // Pode ser null se a confirmação de email for necessária e o login automático não ocorrer
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": 1678886400, // Timestamp
    "refresh_token": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "user": {
      // ... (mesmo objeto user acima)
    }
  }
}
```
**Resposta (objeto `error` em caso de falha):**
```json
{
  "message": "User already registered", // ou outra mensagem de erro
  "status": 400 // ou outro código de status HTTP
}
```

### 5.2. Login (Email/Senha)

**Requisição (uso do SDK):**
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario.existente@example.com',
  password: 'passwordCorreta123',
});
```

**Resposta (objeto `data` em caso de sucesso):**
```json
{
  "user": {
    // ... (estrutura similar ao do cadastro)
    "last_sign_in_at": "YYYY-MM-DDTHH:mm:ss.ssssssZ"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": 1678886400,
    "refresh_token": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "user": {
      // ... (mesmo objeto user acima)
    }
  }
}
```
**Resposta (objeto `error` em caso de falha):**
```json
{
  "message": "Invalid login credentials",
  "status": 400
}
```

### 5.3. Login com Google (OAuth2)

Este fluxo é predominantemente gerenciado por redirecionamentos do navegador.

1.  **Requisição Inicial (uso do SDK):**
    ```javascript
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // scopes: 'email profile https://www.googleapis.com/auth/calendar' // Opcional, para escopos adicionais
      },
    });
    if (error) { console.error("Erro ao iniciar OAuth com Google:", error); }
    // Se não houver erro, o Supabase redireciona o navegador.
    ```
    *   **Resposta:** Não há uma resposta direta em JSON nesta etapa. Ocorre um redirecionamento do navegador para o Google.

2.  **Callback após autorização do Google:**
    *   O Google redireciona para `/auth/callback?code=AUTH_CODE_FROM_GOOGLE...`.
    *   **Requisição (interna do SDK na rota de callback):**
        ```javascript
        // Em app/auth/callback/route.ts
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        ```
    *   **Resposta (após `exchangeCodeForSession`, se bem-sucedido, uma sessão é estabelecida e o usuário é redirecionado):** A sessão resultante será similar à do login com email/senha, mas o `app_metadata` e `identities` no objeto `user` refletirão o provedor 'google'.
        ```json
        // Exemplo de user.app_metadata e user.identities[0].identity_data para Google
        "app_metadata": {
          "provider": "google",
          "providers": ["google"]
        },
        "identities": [
          {
            // ...
            "identity_data": {
              "avatar_url": "https://lh3.googleusercontent.com/a/...",
              "email": "usuario.google@gmail.com",
              "email_verified": true,
              "full_name": "Nome do Usuário Google",
              "iss": "https://accounts.google.com",
              "name": "Nome do Usuário Google",
              "picture": "https://lh3.googleusercontent.com/a/...",
              "provider_id": "GOOGLE_USER_ID",
              "sub": "GOOGLE_USER_ID" // Subject - ID único do usuário no Google
            },
            "provider": "google",
            // ...
          }
        ]
        ```

## 6. Próximos Passos

*   [ ] Revisão técnica da documentação com o Arquiteto de Soluções.
*   [ ] Publicação da documentação no portal de desenvolvedores.
*   [ ] Obter feedback de um desenvolvedor utilizando a documentação para integrar uma aplicação cliente.