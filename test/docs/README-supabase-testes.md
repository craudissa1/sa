# Testes de Integração Supabase para StayFocus

Este documento descreve os testes implementados para validar a integração do Supabase no StayFocus.

## Estrutura de Testes

Implementamos quatro conjuntos de testes que abordam diferentes aspectos da integração:

1. **Testes de Autenticação** (`supabase-auth.test.js`)
   - Verificam login, logout e gerenciamento de sessão
   - Testam o acesso ao perfil do usuário autenticado

2. **Testes de Migração de Dados** (`supabase-migration.test.js`)
   - Validam o processo de migração de dados do localStorage para o Supabase
   - Testam criação e atualização de perfil, configurações, tarefas e categorias financeiras

3. **Testes de Componentes React** (`supabase-components.test.js`)
   - Testam o comportamento do formulário de login com o Supabase
   - Validam feedback visual, tratamento de erros e redirecionamentos após autenticação

4. **Testes End-to-End (E2E)** (`supabase-e2e.test.js`)
   - Simulam fluxos completos de usuário através de múltiplos módulos:
     - Gerenciamento de tarefas e prioridades
     - Dashboard central (blocos de tempo, medicamentos)
     - Saúde e sono (registros de sono e humor)
     - Módulo financeiro (categorias, transações, envelopes)

## Pré-requisitos para Execução dos Testes

1. Node.js v14 ou superior instalado
2. Dependências do projeto instaladas: `npm install`
3. Usuário de teste já cadastrado e confirmado no Supabase
   - Email: teste@exemplo.com
   - Senha: senha123

## Configuração

1. Instale as dependências de teste:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

2. Adicione a seguinte configuração ao seu `package.json`:

```json
"jest": {
  "testEnvironment": "jsdom",
  "setupFilesAfterEnv": [
    "<rootDir>/test/jest-setup.js"
  ],
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/app/$1"
  }
}
```

3. Adicione os scripts de teste ao `package.json`:

```json
"scripts": {
  "test": "jest",
  "test:auth": "jest supabase-auth",
  "test:migration": "jest supabase-migration",
  "test:components": "jest supabase-components",
  "test:e2e": "jest supabase-e2e"
}
```

## Executando os Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes específicos

```bash
# Testes de autenticação
npm run test:auth

# Testes de migração
npm run test:migration

# Testes de componentes
npm run test:components

# Testes E2E
npm run test:e2e
```

## Notas Importantes

1. **Dados de Teste**: Os testes criam e removem dados no Supabase. Caso algum teste falhe, pode ser necessário limpar manualmente os dados residuais.

2. **Usuário de Teste**: Certifique-se de que o usuário de teste existe e teve seu email confirmado antes de executar os testes.

3. **Timeout**: Os testes que interagem com o Supabase possuem um timeout estendido (15 segundos) para acomodar a latência de rede.

4. **Limpeza**: Os testes E2E incluem etapas de limpeza no `afterAll` para remover dados criados durante a execução.

5. **Mocks**: Os testes de componentes utilizam mocks para o hook `useAuth` e para o `useRouter` do Next.js para isolar a lógica dos componentes.

## Cobertura de Funcionalidades

Os testes abrangem todas as principais funcionalidades do StayFocus:

- **Dashboard Central**: Blocos de tempo, prioridades, medicamentos, pomodoro
- **Perfil do Usuário**: Preferências, metas, configurações
- **Autenticação**: Login, logout, sessão
- **Módulos Específicos**:
  - Tarefas e prioridades
  - Saúde e medicamentos
  - Sono e humor
  - Finanças (categorias, transações, envelopes)

Esta estrutura de testes garante que a integração com o Supabase funcione corretamente em todas as partes da aplicação, validando tanto componentes isolados quanto fluxos completos de usuário.

# Documentação de Testes Supabase

## Estrutura de Testes

### 1. Testes de Autenticação (`supabase-auth.test.js`)
- Login/Logout
- Gerenciamento de Sessão
- Perfil de Usuário

### 2. Testes E2E (`supabase-e2e.test.js`)
- Fluxos completos de usuário
- Integração entre módulos
- Cenários reais de uso

### 3. Testes de Migração (`supabase-migration.test.js`)
- Migração de dados
- Atualizações de esquema
- Transformações de dados

## Padrões de Teste

### 1. Setup e Cleanup
```javascript
beforeEach(async () => {
  await supabase.auth.signOut();
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(async () => {
  // Limpar dados de teste
  await Promise.all([
    // Limpeza de cada entidade
  ]);
});
```

### 2. Organização de Testes
```javascript
describe('Módulo', () => {
  describe('Funcionalidade', () => {
    test('Caso específico', async () => {
      // Arrange
      const dados = { /* ... */ };
      
      // Act
      const { data, error } = await supabase.from('tabela').insert(dados);
      
      // Assert
      expect(error).toBeNull();
      expect(data).toBeTruthy();
    });
  });
});
```

### 3. Tratamento de Erros
```javascript
const { data, error } = await supabase.from('tabela').select();

if (error?.code === 'PGRST116') {
  // Registro não encontrado
} else if (error) {
  throw new Error(`Erro inesperado: ${error.message}`);
}
```

## Melhores Práticas

### 1. Isolamento de Testes
- Cada teste deve ser independente
- Limpar estado antes e depois
- Não compartilhar dados entre testes

### 2. Dados de Teste
- Usar dados realistas
- Documentar estrutura esperada
- Limpar após o uso

### 3. Asserções
- Verificar erros primeiro
- Validar estrutura dos dados
- Confirmar efeitos colaterais

## Execução dos Testes

### 1. Ambiente Local
```bash
# Executar todos os testes
npm test

# Executar suite específica
npm test supabase-e2e.test.js

# Executar com coverage
npm test -- --coverage
```

### 2. CI/CD
- Testes executados em cada PR
- Coverage mínima de 80%
- Falha na build se testes falham

## Troubleshooting

### 1. Erros Comuns
- Sessão não limpa
- Dados de teste persistentes
- Timeouts em operações lentas

### 2. Soluções
- Implementar cleanup robusto
- Aumentar timeouts quando necessário
- Verificar estado antes dos testes

## Manutenção

### 1. Atualizações
- Manter dependências atualizadas
- Revisar padrões periodicamente
- Atualizar documentação

### 2. Monitoramento
- Acompanhar tempo de execução
- Verificar flaky tests
- Manter coverage

## Checklist de Qualidade

- [ ] Testes isolados e independentes
- [ ] Cleanup implementado
- [ ] Tratamento de erros robusto
- [ ] Documentação atualizada
- [ ] Coverage adequada
- [ ] CI/CD configurado
- [ ] Logs informativos
- [ ] Timeouts adequados
