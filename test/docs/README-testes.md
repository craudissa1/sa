# Instruções para Testes do Backend Supabase

Este documento explica como executar os testes de integração do backend Supabase para o projeto Stayback.

## Pré-requisitos

1. Node.js instalado (v14 ou superior)
2. Cliente Supabase JS instalado: `npm install @supabase/supabase-js`

## Configuração inicial

Antes de executar os testes, é necessário:

1. Ter um usuário de teste cadastrado no Supabase
2. Editar os arquivos de teste para usar as credenciais corretas

## Arquivos de teste

Foram desenvolvidos quatro arquivos de teste para verificar diferentes aspectos da implementação:

1. `teste-conexao-supabase.js`: Testa a conexão e autenticação com o Supabase
2. `teste-modulo-financeiro.js`: Testa as operações CRUD do módulo financeiro
3. `teste-modulo-tarefas.js`: Testa as operações CRUD do módulo de tarefas e prioridades
4. `teste-modulo-saude.js`: Testa as operações CRUD dos módulos de saúde e sono

## Como executar os testes

### 1. Configurar usuário de teste

O primeiro passo é criar um usuário de teste (caso ainda não tenha um):

1. Descomente a linha `await testarCadastroUsuario(email, senha);` no arquivo `teste-conexao-supabase.js`
2. Execute o teste de conexão para criar o usuário: `node teste-conexao-supabase.js`
3. Após criar o usuário, comente novamente essa linha para evitar erros em execuções futuras

### 2. Executar os testes individuais

Execute cada arquivo de teste para verificar diferentes funcionalidades:

```bash
# Teste de conexão e autenticação
node teste-conexao-supabase.js

# Teste do módulo financeiro
node teste-modulo-financeiro.js

# Teste do módulo de tarefas e prioridades
node teste-modulo-tarefas.js

# Teste dos módulos de saúde e sono
node teste-modulo-saude.js
```

## Interpretando os resultados

Cada teste imprimirá mensagens no console para indicar o sucesso ou falha de cada operação. 

- Mensagens com "sucesso" indicam que a operação foi completada sem erros
- Mensagens de erro explicam qual problema ocorreu durante a execução do teste

## Observações importantes

1. Os testes criam registros reais no banco de dados
2. Alguns testes incluem operações de exclusão para limpar os dados criados
3. Caso um teste falhe, pode ser necessário limpar manualmente os dados no dashboard do Supabase

## Solução de problemas

Se encontrar erros durante a execução dos testes:

1. **Erro de autenticação**: Verifique se as credenciais de email/senha estão corretas
2. **Erro de permissão**: Verifique se as políticas RLS (Row Level Security) estão configuradas corretamente
3. **Erro de estrutura de dados**: Confira se a estrutura das tabelas corresponde ao esperado pelos testes

## Próximos passos após testes

Após verificar que o backend está funcionando corretamente:

1. Integrar o cliente Supabase na aplicação frontend
2. Migrar os dados existentes em localStorage para o Supabase
3. Implementar verificações de consistência de dados
4. Configurar monitoramento e logs para produção

# Documentação de Testes

## Estrutura de Testes

### 1. Testes de Componentes
- Testes unitários de componentes React
- Integração com Supabase
- Mocks e simulações

### 2. Testes E2E
- Fluxos completos de usuário
- Integração entre módulos
- Cenários reais

### 3. Testes de API
- Endpoints Supabase
- Autenticação
- Operações CRUD

## Padrões de Teste

### 1. Componentes React
```javascript
// Helper de renderização
const renderComponent = (props = {}) => {
  return render(<Component {...defaultProps} {...props} />);
};

// Teste básico
test('deve renderizar corretamente', () => {
  renderComponent();
  expect(screen.getByTestId('component')).toBeInTheDocument();
});

// Teste de interação
test('deve responder a eventos', async () => {
  const onChange = jest.fn();
  renderComponent({ onChange });
  await userEvent.type(screen.getByTestId('input'), 'texto');
  expect(onChange).toHaveBeenCalled();
});
```

### 2. Mocks
```javascript
// Mock de módulo
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock de contexto
const mockAuth = {
  user: null,
  signIn: jest.fn(),
  loading: false
};
useAuth.mockReturnValue(mockAuth);
```

### 3. Asserções
```javascript
// Presença no DOM
expect(element).toBeInTheDocument();

// Estado do componente
expect(button).toBeDisabled();
expect(element).toHaveClass('visible');

// Chamadas de função
expect(onSubmit).toHaveBeenCalledWith(expectedData);
```

## Melhores Práticas

### 1. Organização de Testes
- Agrupar por funcionalidade
- Descrever comportamento esperado
- Isolar casos de teste

### 2. Setup e Cleanup
```javascript
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});
```

### 3. Dados de Teste
- Usar dados realistas
- Evitar dependências entre testes
- Limpar após uso

## Ferramentas

### 1. Testing Library
- Queries por acessibilidade
- Simulação de eventos
- Utilitários de teste

### 2. Jest
- Framework de teste
- Mocks e spies
- Asserções

### 3. User Event
- Simulação realista de interação
- Eventos do usuário
- Async/await

## Execução

### 1. Comandos
```bash
# Todos os testes
npm test

# Suite específica
npm test components

# Com coverage
npm test -- --coverage
```

### 2. Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
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

// Cleanup
jest.useRealTimers();
```

## Manutenção

### 1. Coverage
- Manter cobertura > 80%
- Testar casos de erro
- Documentar exceções

### 2. Updates
- Manter dependências atualizadas
- Revisar mocks
- Atualizar snapshots

## Checklist

- [ ] Testes isolados
- [ ] Mocks configurados
- [ ] Cleanup implementado
- [ ] Casos de erro cobertos
- [ ] Documentação atualizada
- [ ] Coverage adequada

## Próximos Passos

1. Implementar testes E2E com Cypress
2. Adicionar testes de performance
3. Melhorar documentação
4. Configurar CI/CD
5. Implementar relatórios automáticos 