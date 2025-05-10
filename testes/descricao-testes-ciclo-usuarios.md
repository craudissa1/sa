# Descrição de Testes: Ciclo Completo de Criação e Gerenciamento de Usuários

## 1. Contexto e Objetivos
Este documento descreve os testes necessários para validar todo o fluxo de criação, autenticação, redirecionamento e persistência de dados de usuários no StayFocus.

Objetivos:
- Garantir que o usuário seja criado corretamente no banco de dados (Supabase MCP ou mock).
- Validar todos os redirecionamentos de rotas plausíveis (sucesso, erro, callback sem code).
- Assegurar persistência de sessão e dados entre diferentes dispositivos.
- Detectar e lidar com possíveis conflitos de dados quando dois dispositivos modificam o mesmo perfil simultaneamente.

> **Referência:** Consulte o guia em `testes/guia-estruturacao-testes.md` para padrões de estrutura, uso de MCP e mocks.

## 2. Ferramentas e Pré-requisitos
- Supabase MCP (mcp4_list_projects, mcp4_execute_sql, mcp4_get_project_url, mcp4_get_anon_key).
- Arquivo de setup: `testes/e2e/config/supabase-mcp-config.js`.
- Mocks: `testes/mocks/supabase-mock.js`.
- Jest + Playwright (simulado) para E2E.
- Variáveis de ambiente: USE_SUPABASE_MCP, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.

## 3. Estrutura de Pastas
```bash
/testes
├── e2e/config      # config geral MCP
├── mocks           # mocks supabase
├── paginas
└── descricao-testes-ciclo-usuarios.md  # este arquivo
```

## 4. Fluxo de Trabalho
1. **Analisar funcionalidades** (signup, login, callback, dashboard).
2. **Dividir cenários** via sequential-thinking: criações bem-sucedida, erro de email duplicado, callback inválido.
3. **Criar setup** específico de usuário: `setup-usuarios.js` se necessário.
4. **Implementar testes** em Jest na pasta `e2e`.
5. **Executar e validar** cada cenário.

## 5. Cenários de Teste

### 5.1. Criação de Usuário
- Cenário S1: usuário novo, email único.
  - Chamar API `auth.signUp`.
  - Validar resposta sem erro e retorno de `user.id`.
  - Verificar registro em `user_profiles` via SQL: SELECT * WHERE email = ...

- Cenário S2: email já existe.
  - Simular `auth.signUp` com erro de duplicação.
  - Validar mensagem de erro no UI.

### 5.2. Autenticação e Callback
- Cenário S3: login bem-sucedido.
  - Redirecionar para `/auth/callback?code=...`.
  - Simular `exchangeCodeForSession` e `getSession`.
  - Validar inserção ou leitura de `user_profiles`.
  - Confirmar redirecionamento final para `/dashboard`.

- Cenário S4: callback sem código.
  - Acessar `/auth/callback` sem param `code`.
  - Validar redirect para `/login?error=code_missing` (exemplo).

### 5.3. Redirecionamentos
- Cenário S5: usuário não autenticado acessa `/dashboard`.
  - Redirecionar para `/login?redirect=%2Fdashboard`.

- Cenário S6: logout.
  - Chamar `auth.signOut`, validar clear de cookies.
  - Redirecionar para `/login`.

### 5.4. Persistência de Sessão e Dados Entre Dispositivos
- Cenário S7: criar usuário e login no dispositivo A.
  - Obter token, salvar em cookie local.
  - Em dispositivo B (mesmo email/senha), chamar login.
  - Validar que sessão é compartilhada (mesmo user.id, mesma sessão ativa no MCP).

- Cenário S8: sessão expirada.
  - Simular `expires_in` menor.
  - Validar refresh via `provider_token` ou redirecionar ao login.

### 5.5. Conflito de Dados em Dispositivos Distintos
- Cenário S9: dois dispositivos A e B editam o perfil.
  - A altera `full_name` para "Alice".
  - B altera `full_name` para "Alice Souza".
  - Executar atualizações quase simultâneas.
  - Validar política de resolução (último grava, lock otimista ou notificação de conflito).

- Cenário S10: conflito em `user_settings` (ex: preferências visuais).
  - Simular merge ou fallback apropriado.

## 6. Modo Simulado vs. Real
- **Simulado:** usar mocks para `auth.signUp`, `auth.exchangeCodeForSession`, `mcp4_execute_sql`.
- **Real MCP:** criar projeto/branch com `setupTestEnvironment` e usar `mcp4_*` reales.

## 7. Execução dos Testes
```bash
# Simulado (local)
npx jest --testPathPattern="descricao-testes-ciclo-usuarios.md"

# Com MCP (CI)
node testes/e2e/run-tests-with-mcp.js testes/paginas/usuarios/e2e/usuarios-flows.test.js
```

## 8. Boas Práticas
- Isolar dados com prefixos únicos.
- Limpar dados após cada teste.
- Nomear cenários de forma descritiva.
- Documentar alterações de políticas de conflito.
- Manter mocks alinhados com a API real.

---

Este arquivo serve como blueprint para garantir a cobertura completa do ciclo de vida de um usuário no StayFocus. Siga os cenários e adapte conforme novas funcionalidades forem adicionadas.
