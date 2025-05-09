# Guia para Estruturação e Execução de Testes no StayFocus

## Índice
1. [Introdução](#introdução)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Fluxo de Trabalho para Criação de Testes](#fluxo-de-trabalho-para-criação-de-testes)
4. [Uso das Ferramentas Supabase MCP](#uso-das-ferramentas-supabase-mcp)
5. [Estrutura de Testes para Páginas](#estrutura-de-testes-para-páginas)
6. [Exemplos de Implementação](#exemplos-de-implementação)
7. [Simulação vs. Ambiente Real](#simulação-vs-ambiente-real)
8. [Execução de Testes](#execução-de-testes)
9. [Boas Práticas](#boas-práticas)

## Introdução

Este guia estabelece diretrizes para a criação e execução de testes no aplicativo StayFocus. O sistema de testes é projetado para permitir testes isolados usando o Supabase MCP, que fornece ambientes de teste efêmeros e isolados para cada execução.

O StayFocus é uma aplicação de gerenciamento pessoal projetada para ajudar usuários a organizar seu dia, manter o foco em suas prioridades e cuidar do seu bem-estar. O aplicativo possui diversas páginas, cada uma com funcionalidades específicas que precisam ser testadas adequadamente.

## Estrutura de Pastas

```
/testes
├── e2e/
│   ├── config/                 # Configurações gerais para testes E2E
│   │   └── supabase-mcp-config.js
│   └── run-tests-with-mcp.js   # Script para executar testes com Supabase MCP
├── mocks/                      # Mocks para simulação de serviços
├── paginas/                    # Testes organizados por página
│   ├── alimentacao/            # Exemplo: testes para a página de alimentação
│   │   ├── e2e/                # Testes end-to-end para a página
│   │   │   └── alimentacao-flows.test.js
│   │   ├── integration/        # Testes de integração para a página
│   │   ├── unit/               # Testes unitários para a página
│   │   └── setup-alimentacao.js  # Configurações específicas para testes da página
│   ├── autoconhecimento/       # Exemplo: testes para a página de autoconhecimento
│   │   └── ... (estrutura similar)
│   └── ... (outras páginas)
└── utils/                      # Utilitários compartilhados entre testes
```

## Fluxo de Trabalho para Criação de Testes

Para criar testes para uma nova página, siga este fluxo de trabalho:

1. **Interpretação das Funcionalidades**: Analise detalhadamente a documentação/código da página para entender todas as funcionalidades.

2. **Reflexão com Sequential Thinking**: Use a ferramenta MCP Sequential Thinking para decompor as funcionalidades em cenários de teste testáveis.

3. **Estruturação dos Arquivos**:
   - Crie uma pasta para a página dentro de `/testes/paginas/`
   - Crie um arquivo `setup-[nome-pagina].js` com funções de configuração
   - Crie subpastas `e2e`, `integration` e `unit` conforme necessário
   - Adicione os arquivos de teste correspondentes

4. **Implementação dos Testes**: Utilize o padrão estabelecido para implementar os testes para cada funcionalidade.

5. **Execução e Validação**: Execute os testes para verificar se estão funcionando corretamente.

## Uso das Ferramentas Supabase MCP

O StayFocus utiliza o Supabase como backend, e os testes podem aproveitar as ferramentas Supabase MCP para criar ambientes isolados.

### Configuração de Ambiente de Teste

```javascript
// Exemplo de configuração para ambiente de teste com Supabase MCP
async function setupTestEnvironment() {
  try {
    const hasMCPTools = typeof mcp4_list_projects === 'function';
    if (!hasMCPTools) {
      console.warn('Ferramentas Supabase MCP não disponíveis. Usando configuração padrão.');
      return {
        success: false,
        message: 'Ferramentas MCP não disponíveis',
        projectId: null
      };
    }

    // Verificar configurações de ambiente
    const shouldCreateProject = process.env.CREATE_TEST_PROJECT === 'true';
    const shouldCreateBranch = process.env.CREATE_TEST_BRANCH === 'true';
    
    if (shouldCreateProject) {
      // Criar novo projeto de teste
      // Implementação da criação do projeto usando ferramentas MCP
    } else if (shouldCreateBranch) {
      // Criar branch em projeto existente
      // Implementação da criação de branch usando ferramentas MCP
    } else {
      // Usar projeto existente
      const { data: projects } = await mcp4_list_projects();
      const testProject = projects.find(p => p.name.startsWith('stayfocus-test'));
      
      if (!testProject) {
        return {
          success: false,
          message: 'Projeto de teste não encontrado',
          projectId: null
        };
      }
      
      return {
        success: true,
        message: 'Usando projeto existente',
        projectId: testProject.id
      };
    }
  } catch (error) {
    console.error('Erro ao configurar ambiente de teste:', error);
    return {
      success: false,
      message: `Erro: ${error.message}`,
      projectId: null
    };
  }
}
```

### Execução de Consultas SQL

```javascript
// Exemplo de função para executar SQL em ambiente de teste
async function executeSQL(projectId, query) {
  try {
    const hasMCPTools = typeof mcp4_execute_sql === 'function';
    if (!hasMCPTools) {
      console.warn('Ferramentas Supabase MCP não disponíveis. Simulando execução SQL.');
      return {
        success: true,
        data: [{ id: 'mock-id', message: 'SQL simulado executado com sucesso' }]
      };
    }

    const { data, error } = await mcp4_execute_sql({
      project_id: projectId,
      query: query
    });

    if (error) {
      console.error('Erro ao executar SQL:', error);
      return {
        success: false,
        error: error
      };
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Erro ao executar SQL:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

### Limpeza após Testes

```javascript
// Exemplo de função para limpar dados após testes
async function cleanupTestData(projectId, userId) {
  if (!projectId || !userId) {
    console.warn('Informações insuficientes para limpeza. Pulando...');
    return;
  }

  // Lista de tabelas a limpar
  const tabelas = [
    'user_settings',
    'meal_plans',
    'meal_records',
    'hydration_reminders',
    'notes',
    // Adicione outras tabelas conforme necessário
  ];

  for (const tabela of tabelas) {
    try {
      await executeSQL(
        projectId,
        `DELETE FROM ${tabela} WHERE user_id = '${userId}'`
      );
    } catch (error) {
      console.error(`Erro ao limpar tabela ${tabela}:`, error);
    }
  }
}
```

## Estrutura de Testes para Páginas

Cada página deve ter testes para cobrir suas funcionalidades específicas. Utilize a estrutura abaixo como base:

### Arquivo de Setup para a Página

```javascript
// Exemplo: setup-[nome-pagina].js
const { 
  setupTestEnvironment,
  executeSQL,
  applyTestMigration,
  cleanupTestEnvironment
} = require('../e2e/config/supabase-mcp-config');

// Função para configurar ambiente específico da página
async function setupPaginaTestEnv() {
  const testEnv = await setupTestEnvironment();
  
  if (testEnv.success) {
    // Aplicar migrações específicas para esta página
    await applyTestMigration(testEnv.projectId, `
      -- Criar tabelas necessárias para os testes desta página
    `);
    
    console.log(`✅ Ambiente de testes configurado. ProjectID: ${testEnv.projectId}`);
  } else {
    console.warn(`⚠️ Falha ao configurar ambiente de teste: ${testEnv.message}`);
  }
  
  return testEnv;
}

// Função para limpar dados específicos da página
async function limparDadosPaginaTeste(projectId, userId) {
  // Implementação específica para limpar dados da página
}

module.exports = {
  setupPaginaTestEnv,
  limparDadosPaginaTeste
};
```

### Arquivo de Teste E2E para a Página

```javascript
// Exemplo: [nome-pagina]-flows.test.js
const { 
  setupPaginaTestEnv,
  limparDadosPaginaTeste
} = require('../setup-[nome-pagina]');

// Função auxiliar para login de usuário de teste
async function loginTestUser(page, supabase) {
  // Implementação do login para testes
}

describe('Testes E2E da Página de [Nome da Página]', () => {
  let testEnv;
  let testUserId;
  let supabase = {};
  
  // Setup global
  beforeAll(async () => {
    // Configurar ambiente de teste
    testEnv = await setupPaginaTestEnv();
    
    // Configurar usuário de teste
    testUserId = 'mock-user-id';
    console.log(`👤 Usuário de teste configurado: ${testUserId}`);
  });
  
  // Cleanup após todos os testes
  afterAll(async () => {
    // Limpar dados de teste
    if (testEnv && testEnv.success) {
      console.log(`🧹 Limpeza de dados para o usuário ${testUserId}`);
    }
  });
  
  // Testes específicos para cada funcionalidade
  test('Deve permitir [funcionalidade 1]', async () => {
    // Implementação do teste para funcionalidade 1
  });
  
  test('Deve permitir [funcionalidade 2]', async () => {
    // Implementação do teste para funcionalidade 2
  });
  
  // Adicione mais testes conforme necessário
});
```

## Exemplos de Implementação

### Exemplo: Testes para a Página de Alimentação

A página de alimentação possui as seguintes funcionalidades principais:
1. Planejamento de refeições
2. Registro de refeições consumidas
3. Lembretes de hidratação
4. Navegação para a página de receitas

Os testes devem cobrir cada uma dessas funcionalidades:

```javascript
// Teste: Planejamento de Refeições
test('Deve permitir criar e visualizar um plano de refeições', async () => {    
  // Este teste é simulado para demonstrar o fluxo com mocks
  console.log('Teste simulado: Criar e visualizar plano de refeições');
  
  // 1. Simular o preenchimento de dados
  const tituloNota = `Teste simulado de plano de refeição`;
  const descricao = 'Salada com frango grelhado';
  const tipo = 'Almoço';
  
  // 2. Simular a criação do plano no banco de dados
  const mockResult = {
    success: true,
    data: [{
      id: 'mock-meal-plan-id',
      user_id: testUserId,
      date: new Date().toISOString().split('T')[0],
      meal_type: tipo,
      description: descricao,
      created_at: new Date().toISOString()
    }]
  };
  
  // 3. Mock da função executeSQL para testes
  const mockExecuteSQL = jest.fn().mockResolvedValue(mockResult);
  
  // 4. Validar o comportamento esperado
  const result = await mockExecuteSQL();
  expect(result.success).toBe(true);
  expect(result.data.length).toBe(1);
  expect(result.data[0].description).toBe(descricao);
  expect(result.data[0].meal_type).toBe(tipo);
  
  // 5. Simular a verificação na UI
  const mockTextContent = jest.fn().mockResolvedValue(`Plano de Refeição: ${descricao} - ${tipo}`);
  expect(await mockTextContent()).toContain('Salada com frango grelhado');
});
```

## Simulação vs. Ambiente Real

Os testes podem ser executados em dois modos:

### Modo de Simulação

Para execução local sem dependências externas:
- Utiliza mocks para simular as interações com o Supabase
- Não requer acesso real às ferramentas Supabase MCP
- É mais rápido, mas menos preciso

### Modo Real com MCP

Para execução em ambientes de CI/CD ou teste completo:
- Usa as ferramentas reais do Supabase MCP
- Cria ambientes de teste isolados temporários
- É mais preciso, mas requer acesso às ferramentas MCP

Para alternar entre os modos, configure as variáveis de ambiente:
- `USE_SUPABASE_MCP`: Define se as ferramentas MCP devem ser utilizadas
- `CREATE_TEST_BRANCH`: Indica se um branch de teste deve ser criado
- `CREATE_TEST_PROJECT`: Indica se um projeto de teste deve ser criado
- `DELETE_TEST_PROJECT`: Indica se o projeto de teste deve ser removido após os testes

## Execução de Testes

Para executar os testes, use o script `run-tests-with-mcp.js` que configura o ambiente adequado:

```bash
# Executar testes para uma página específica
node testes/e2e/run-tests-with-mcp.js testes/paginas/alimentacao/e2e/alimentacao-flows.test.js

# Executar todos os testes E2E
node testes/e2e/run-tests-with-mcp.js "testes/paginas/**/e2e/*.test.js"
```

Ou usando o Jest diretamente:

```bash
# Executar testes para uma página específica
npx jest --testPathPattern="testes/paginas/alimentacao/e2e/alimentacao-flows.test.js"

# Executar todos os testes E2E
npx jest --testPathPattern="testes/paginas/.*/e2e/.*\.test\.js"
```

## Boas Práticas

1. **Isolamento de Testes**: Cada teste deve ser independente e não depender do estado de outros testes.

2. **Limpeza de Dados**: Sempre limpe os dados criados durante os testes para evitar interferência entre execuções.

3. **Simulação Inteligente**: Ao usar mocks, simule o comportamento real do sistema o máximo possível.

4. **Testes Descritivos**: Use nomes descritivos para os testes, indicando claramente o que está sendo testado.

5. **Organização por Funcionalidade**: Organize os testes por funcionalidade, não por componente técnico.

6. **Tratamento de Erros**: Inclua tratamento adequado de erros em todos os testes.

7. **Documentação**: Documente o propósito e o escopo de cada conjunto de testes.

8. **Evite Hardcoding**: Evite valores codificados diretamente; use constantes ou variáveis configuráveis.

9. **Testes Concisos**: Mantenha os testes simples e focados em testar apenas uma coisa por vez.

10. **Cobertura Completa**: Certifique-se de testar todos os fluxos principais e casos de borda.

---

Este guia deve ser usado como referência para criar e executar testes no aplicativo StayFocus. Siga o fluxo descrito para garantir uma cobertura adequada de testes para cada página e funcionalidade do aplicativo.
