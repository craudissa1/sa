# Configuração e Uso do Supabase

## Visão Geral

Este documento fornece instruções detalhadas sobre como configurar e utilizar o Supabase no projeto "Stayback". Inclui informações sobre a configuração do ambiente, as credenciais necessárias, e exemplos de uso das principais funcionalidades.

## Credenciais do Projeto

Para integrar a aplicação com o Supabase, você precisa das seguintes credenciais:

```
URL do Projeto: https://ekdygbctzcrzrqqxfszz.supabase.co
Chave Anônima (anon key): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZHlnYmN0emNyenJxcXhmc3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDY5MTQsImV4cCI6MjA2MjEyMjkxNH0.fYu9IWemd3jadizoaCajJTGyHB3KgKhUOEfLxpdACJE
ID do Projeto: ekdygbctzcrzrqqxfszz
```

## Configuração do Ambiente

### 1. Arquivo `.env.local`

Crie ou atualize o arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ekdygbctzcrzrqqxfszz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZHlnYmN0emNyenJxcXhmc3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDY5MTQsImV4cCI6MjA2MjEyMjkxNH0.fYu9IWemd3jadizoaCajJTGyHB3KgKhUOEfLxpdACJE
```

### 2. Cliente Supabase

O cliente Supabase já está configurado no arquivo `/app/lib/supabaseClient.ts`. Verifique se este arquivo está correto:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Tabelas Implementadas

Foram implementadas todas as tabelas necessárias para o funcionamento da aplicação. Para informações detalhadas sobre a estrutura das tabelas, consulte o documento `documentacao-supabase-estrutura.md`.

## Uso do Cliente Supabase

### Autenticação

```typescript
// Login com email/senha
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@exemplo.com',
  password: 'senha123'
});

// Login com Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
});

// Cadastro de usuário
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@exemplo.com',
  password: 'senha123'
});

// Obter sessão atual
const { data: { session }, error } = await supabase.auth.getSession();

// Logout
await supabase.auth.signOut();
```

### Operações CRUD

#### Leitura (SELECT)

```typescript
// Buscar perfil do usuário
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', userId)
  .single();

// Buscar tarefas do usuário
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId)
  .eq('concluida', false);
  
// Buscar registros com filtro de data
const { data, error } = await supabase
  .from('sleep_logs')
  .select('*')
  .eq('user_id', userId)
  .gte('inicio', dataInicio) // Maior ou igual que
  .lte('inicio', dataFim)    // Menor ou igual que
  .order('inicio', { ascending: false });
```

#### Inserção (INSERT)

```typescript
// Adicionar uma tarefa
const { data, error } = await supabase
  .from('tasks')
  .insert([{ 
    user_id: userId,
    texto: 'Nova tarefa',
    concluida: false,
    categoria: 'estudos',
    data: '2025-05-10'
  }])
  .select();

// Adicionar um medicamento
const { data, error } = await supabase
  .from('medications')
  .insert([{
    user_id: userId,
    nome: 'Medicamento',
    dosagem: '10mg',
    frequencia: 'Diário',
    horarios: ['08:00', '20:00'],
    observacoes: 'Tomar com água',
    dataInicio: '2025-05-06'
  }])
  .select();
```

#### Atualização (UPDATE)

```typescript
// Marcar tarefa como concluída
const { data, error } = await supabase
  .from('tasks')
  .update({ concluida: true })
  .eq('id', tarefaId)
  .select();

// Registrar tomada de medicamento
const { data, error } = await supabase
  .from('medications')
  .update({ ultimaTomada: new Date().toISOString() })
  .eq('id', medicamentoId)
  .select();
```

#### Exclusão (DELETE)

```typescript
// Remover uma tarefa
const { error } = await supabase
  .from('tasks')
  .delete()
  .eq('id', tarefaId);

// Remover um registro de sono
const { error } = await supabase
  .from('sleep_logs')
  .delete()
  .eq('id', registroId);
```

## Exemplos de Integração com Componentes React

### Uso com Zustand Store

O arquivo `app/stores/perfilStore.ts` exemplifica como integrar o Supabase com uma store Zustand:

```typescript
import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/supabase-js";

// Definição dos tipos
export type PerfilUsuario = {
  id?: string;
  user_id?: string;
  nome: string;
  // outros campos...
};

// Definição da store
export const usePerfilStore = create<PerfilState>()((set, get) => ({
  perfil: null,
  currentUser: null,
  
  // Obter perfil do usuário
  fetchPerfil: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (data) {
        set({ perfil: data });
      } else {
        // Criar perfil padrão se não existir
        // ...
      }
    } catch (error) {
      console.error("Error in fetchPerfil:", error);
    }
  },
  
  // Atualizar perfil do usuário
  updatePerfil: async (updates) => {
    // Implementação...
  }
}));
```

### Uso em um Componente React

```tsx
import { useEffect } from 'react';
import { usePerfilStore } from '@/app/stores/perfilStore';
import { useAuthContext } from '@/app/context/AuthContext';

export function PerfilComponent() {
  const { user } = useAuthContext();
  const { perfil, fetchPerfil, updatePerfil } = usePerfilStore();
  
  useEffect(() => {
    if (user) {
      fetchPerfil(user.id);
    }
  }, [user, fetchPerfil]);
  
  const handleSave = async (e) => {
    e.preventDefault();
    await updatePerfil({
      nome: e.target.nome.value,
      // outros campos...
    });
  };
  
  if (!perfil) return <div>Carregando...</div>;
  
  return (
    <form onSubmit={handleSave}>
      <input name="nome" defaultValue={perfil.nome} />
      {/* outros campos... */}
      <button type="submit">Salvar</button>
    </form>
  );
}
```

## Depuração e Resolução de Problemas

### Visualização de Logs

Você pode visualizar os logs do Supabase diretamente no Dashboard ou usar o console do navegador para registrar informações de depuração.

### Problemas Comuns

1. **Erro de Autenticação:**
   - Verifique se o `NEXT_PUBLIC_SUPABASE_ANON_KEY` está correto.
   - Certifique-se de que o usuário está autorizado para a operação.

2. **Erro nas Políticas RLS:**
   - Verifique se o usuário está autenticado antes de tentar operações.
   - Confirme se o `user_id` sendo usado corresponde ao `auth.uid()`.

3. **Dados Não Aparecem:**
   - Verifique se os registros existem para o usuário atual.
   - Confirme que as consultas estão utilizando o filtro `user_id` correto.

## Dashboard do Supabase

Para acessar o dashboard do Supabase e gerenciar o projeto:

1. Acesse https://app.supabase.com/project/ekdygbctzcrzrqqxfszz
2. Navegue até "Table Editor" para visualizar os dados
3. Use "SQL Editor" para executar consultas SQL diretas
4. Em "Authentication", gerencie usuários e configurações de autenticação

## Segurança e Boas Práticas

1. **Nunca compartilhe a Service Role Key** (diferente da Anon Key) em código frontend.
2. **Sempre use Row Level Security (RLS)** para proteger os dados dos usuários.
3. **Valide os dados** antes de inserir no banco de dados.
4. **Use transações** para operações que envolvem múltiplas tabelas.
5. **Implemente tratamento de erros** adequado para lidar com falhas nas operações do Supabase.

## Próximos Passos

1. **Migrar os dados existentes** armazenados em localStorage para o Supabase.
2. **Implementar notificações em tempo real** usando Supabase Realtime.
3. **Configurar backups** regulares do banco de dados.
4. **Monitorar uso e desempenho** para otimizações futuras.

# Melhores Práticas e Lições Aprendidas - Testes Supabase

## Configuração do Ambiente

### 1. Setup do Babel
- Sempre incluir `runtime: 'automatic'` para suporte moderno ao React
- Adicionar plugins necessários como `transform-runtime` e `class-properties`
- Configurar `modules: 'auto'` para melhor compatibilidade com Jest

### 2. Configuração do Jest
- Aumentar timeout para 30s para acomodar operações de rede
- Implementar mocks robustos para `fetch`, `localStorage` e `sessionStorage`
- Adicionar matchers customizados para erros do Supabase
- Incluir polyfills necessários (TextEncoder/TextDecoder)

## Melhores Práticas em Testes

### 1. Limpeza de Estado
```javascript
beforeEach(async () => {
  await supabase.auth.signOut();
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
});
```

### 2. Verificação de Sessão
```javascript
afterEach(async () => {
  await supabase.auth.signOut();
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    console.warn('Sessão não foi limpa corretamente');
  }
});
```

### 3. Estrutura de Testes
- Usar `describe` para agrupar testes relacionados
- Implementar setup específico para cada grupo de testes
- Testar casos de sucesso e falha
- Verificar estado antes e depois das operações

## Erros Comuns e Soluções

### 1. Problema: Sessões persistentes
Solução: Implementar limpeza completa após cada teste
```javascript
await supabase.auth.signOut();
localStorage.clear();
sessionStorage.clear();
```

### 2. Problema: Falsos positivos em testes assíncronos
Solução: Usar `waitForAsync` e verificações adequadas
```javascript
await waitForAsync();
expect(error).toBeSupabaseError();
```

### 3. Problema: Mocks incompletos
Solução: Implementar mocks mais robustos
```javascript
global.fetch = jest.fn((url) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: null, error: null }),
    status: 200
  });
});
```

## Checklist de Implementação

1. [ ] Configuração do Babel atualizada
2. [ ] Setup do Jest completo
3. [ ] Mocks implementados corretamente
4. [ ] Limpeza de estado implementada
5. [ ] Testes de autenticação refatorados
6. [ ] Verificações de erro melhoradas
7. [ ] Documentação atualizada

## Próximos Passos

1. Refatorar testes de migração
2. Implementar testes E2E mais robustos
3. Adicionar testes de componentes React
4. Melhorar cobertura de testes
5. Implementar CI/CD para testes automatizados 