/**
 * Setup global para integração das ferramentas Supabase MCP com testes E2E
 * Este arquivo configura o ambiente de teste e registra as ferramentas MCP
 */

const supabaseMCPTools = require('./supabase-mcp-config');

// Inicializa globalmente o ambiente de testes MCP
global.setupMCPTestEnvironment = async (options = {}) => {
  console.log('🚀 Inicializando ambiente de testes com Supabase MCP...');
  return await supabaseMCPTools.setupTestEnvironment(options);
};

// Registra funções auxiliares MCP globalmente
global.applyTestMigration = supabaseMCPTools.applyTestMigration;
global.executeSQLTest = supabaseMCPTools.executeSQL;
global.cleanupMCPTestEnvironment = supabaseMCPTools.cleanupTestEnvironment;
global.getTestLogs = supabaseMCPTools.getTestLogs;

// Mock para quando as ferramentas MCP não estiverem disponíveis
if (typeof mcp4_list_projects !== 'function') {
  console.warn('⚠️ Ferramentas Supabase MCP não detectadas. Usando mocks para testes.');
  
  global.mcp4_list_projects = jest.fn().mockResolvedValue({ data: [] });
  global.mcp4_get_cost = jest.fn().mockResolvedValue({ data: { amount: 0, recurrence: 'hourly' } });
  global.mcp4_confirm_cost = jest.fn().mockResolvedValue({ data: { id: 'mock-cost-id' } });
  global.mcp4_create_branch = jest.fn().mockResolvedValue({ data: { ref: 'mock-branch-id' } });
  global.mcp4_create_project = jest.fn().mockResolvedValue({ data: { id: 'mock-project-id' } });
  global.mcp4_apply_migration = jest.fn().mockResolvedValue({ data: {}, error: null });
  global.mcp4_execute_sql = jest.fn().mockResolvedValue({ data: [], error: null });
  global.mcp4_delete_branch = jest.fn().mockResolvedValue({ error: null });
  global.mcp4_pause_project = jest.fn().mockResolvedValue({ error: null });
  global.mcp4_get_logs = jest.fn().mockResolvedValue({ data: [], error: null });
  
  console.info('ℹ️ Mocks das ferramentas MCP configurados para ambiente de teste.');
}

// Hook de setup global para Jest
beforeAll(async () => {
  // Verificar se está rodando com integração MCP
  const useMCP = process.env.USE_SUPABASE_MCP === 'true';
  
  if (useMCP) {
    try {
      // Inicializar ambiente MCP se necessário
      // Por padrão, não cria projeto/branch automaticamente
      const result = await setupMCPTestEnvironment({
        createNewProject: process.env.CREATE_TEST_PROJECT === 'true',
        createBranch: process.env.CREATE_TEST_BRANCH === 'true'
      });
      
      if (result.success) {
        console.log(`✅ Ambiente MCP inicializado com sucesso. ProjectID: ${result.projectId}`);
        // Armazena dados do ambiente para uso durante os testes
        global.__MCP_TEST_ENV__ = result;
      } else {
        console.warn(`⚠️ Não foi possível inicializar ambiente MCP: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar ambiente de teste MCP:', error);
    }
  } else {
    console.log('ℹ️ Testes rodando sem integração Supabase MCP.');
  }
});

// Hook de teardown global para Jest
afterAll(async () => {
  // Verificar se está rodando com integração MCP
  const useMCP = process.env.USE_SUPABASE_MCP === 'true';
  
  if (useMCP && global.__MCP_TEST_ENV__) {
    try {
      // Limpar recursos criados para os testes
      const result = await cleanupMCPTestEnvironment({
        projectId: global.__MCP_TEST_ENV__.projectId,
        branchId: global.__MCP_TEST_ENV__.branchId,
        deleteProject: process.env.DELETE_TEST_PROJECT === 'true',
        isBranch: global.__MCP_TEST_ENV__.isBranch
      });
      
      if (result.success) {
        console.log(`✅ Ambiente MCP limpo com sucesso: ${result.message || 'Recursos liberados'}`);
      } else {
        console.warn(`⚠️ Não foi possível limpar completamente o ambiente MCP: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Erro ao limpar ambiente de teste MCP:', error);
    }
  }
});

// Exporta funções para uso em arquivos individuais de teste
module.exports = supabaseMCPTools;
