 # Documentação de Testes

## Visão Geral

Este diretório contém todos os testes automatizados do projeto StayFocus. A estrutura de testes foi projetada para garantir a qualidade e confiabilidade do código através de diferentes níveis de teste.

## Estrutura de Diretórios

```
test/
├── components/       # Testes de componentes React
├── e2e/             # Testes end-to-end
├── integration/     # Testes de integração
├── mocks/           # Mocks e fixtures
├── utils/           # Utilitários de teste
└── setup/           # Configuração de testes
```

## Tipos de Teste

### 1. Testes de Componentes
- Testes unitários de componentes React
- Integração com Supabase
- Validação de comportamento e renderização

### 2. Testes E2E
- Fluxos completos de usuário
- Integração entre módulos
- Cenários reais de uso

### 3. Testes de Integração
- Comunicação com Supabase
- Autenticação e autorização
- Operações de banco de dados

## Configuração

### Pré-requisitos
- Node.js >= 18
- npm >= 9
- Jest
- Testing Library

### Instalação
```bash
npm install
```

### Executando Testes
```bash
# Todos os testes
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Testes específicos
npm run test:auth
npm run test:migration
npm run test:components
npm run test:e2e
```

## Padrões e Boas Práticas

### 1. Nomenclatura
- Arquivos de teste: `*.test.js` ou `*.spec.js`
- Descrições claras e objetivas
- Padrão: `describe('Componente', () => { ... })`

### 2. Organização
```javascript
describe('Componente', () => {
  // Setup comum
  beforeEach(() => { ... });
  
  // Testes agrupados por funcionalidade
  describe('Funcionalidade', () => {
    test('deve fazer algo específico', () => { ... });
  });
});
```

### 3. Asserções
```javascript
// DOM
expect(element).toBeInTheDocument();
expect(button).toBeDisabled();

// Eventos
expect(onSubmit).toHaveBeenCalledWith(data);

// Estado
expect(result).toBeTruthy();
expect(error).toBeNull();
```

## Mocks

### 1. Supabase
```javascript
const supabaseMock = {
  auth: {
    signIn: jest.fn(),
    signOut: jest.fn()
  },
  from: jest.fn()
};
```

### 2. Componentes
```javascript
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));
```

### 3. Dados
```javascript
const mockUser = {
  id: '123',
  email: 'test@example.com'
};
```

## Troubleshooting

### 1. Erros Comuns
- Act warnings
- Async updates
- Memory leaks

### 2. Soluções
```javascript
// Act warning
await act(async () => {
  await userEvent.click(button);
});

// Async
await waitFor(() => {
  expect(element).toBeVisible();
});
```

## CI/CD

### 1. GitHub Actions
```yaml
- name: Run tests
  run: npm run test:ci
```

### 2. Coverage
- Mínimo: 80%
- Relatórios: `/coverage`
- JUnit: `/coverage/junit`

## Manutenção

### 1. Updates
- Manter dependências atualizadas
- Revisar mocks periodicamente
- Atualizar snapshots quando necessário

### 2. Documentação
- Manter README atualizado
- Documentar decisões importantes
- Registrar problemas conhecidos

## Checklist de Qualidade

- [ ] Testes cobrem casos principais
- [ ] Mocks configurados corretamente
- [ ] Cleanup implementado
- [ ] Documentação atualizada
- [ ] Coverage adequada
- [ ] CI/CD configurado

## Contribuindo

1. Criar branch para feature/fix
2. Adicionar/atualizar testes
3. Verificar coverage
4. Submeter PR
5. Revisar e manter qualidade

## Recursos

- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Supabase Testing](https://supabase.com/docs/guides/testing)
- [React Testing](https://reactjs.org/docs/testing.html)