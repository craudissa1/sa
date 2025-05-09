/**
 * Script para executar testes E2E com integração das ferramentas Supabase MCP
 * Este script configura o ambiente e inicia os testes com suporte ao Supabase MCP
 */

// Dependências necessárias
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configurações
const config = {
  // Definir variáveis de ambiente para os testes
  env: {
    USE_SUPABASE_MCP: 'true',
    CREATE_TEST_BRANCH: process.argv.includes('--create-branch') ? 'true' : 'false',
    CREATE_TEST_PROJECT: process.argv.includes('--create-project') ? 'true' : 'false',
    DELETE_TEST_PROJECT: process.argv.includes('--delete-project') ? 'true' : 'false',
    TEST_APP_URL: process.env.TEST_APP_URL || 'http://localhost:3000',
    SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID,
    SUPABASE_ORG_ID: process.env.SUPABASE_ORG_ID,
  },
  
  // Arquivos de setup para Jest
  setupFiles: ['./config/mcp-setup.js'],
  
  // Diretório de testes
  testDir: './e2e',
  
  // Arquivos a serem testados (padrão glob)
  testPattern: process.argv.length > 2 ? process.argv[2] : 'supabase-*.test.js',
};

/**
 * Verifica se as ferramentas MCP do Supabase estão disponíveis
 */
function checkMCPAvailability() {
  try {
    // Verificar se as ferramentas globais estão disponíveis
    console.log('👉 Verificando disponibilidade das ferramentas Supabase MCP...');
    
    // Verificar se estamos em um ambiente com funções MCP
    const hasMCPTools = typeof mcp4_list_projects === 'function';
    
    if (hasMCPTools) {
      console.log('✅ Ferramentas Supabase MCP disponíveis!');
      return true;
    } else {
      console.log('⚠️ Ferramentas Supabase MCP não detectadas. Os testes usarão mocks MCP.');
      return false;
    }
  } catch (error) {
    console.log('⚠️ Erro ao verificar ferramentas MCP:', error.message);
    return false;
  }
}

/**
 * Executa os testes com a configuração apropriada
 */
function runTests() {
  try {
    console.log(`🚀 Iniciando testes E2E com padrão: ${config.testPattern}`);
    
    // Construir o comando de teste
    let command = 'npx jest';
    
    // Adicionar padrão de testes
    command += ` --testPathPattern="${config.testDir}/${config.testPattern}"`;
    
    // Configurar variáveis de ambiente para o processo
    const env = {
      ...process.env,
      ...config.env
    };
    
    // Executar os testes com as variáveis de ambiente configuradas
    execSync(command, { 
      stdio: 'inherit',
      env
    });
    
    console.log('✅ Testes concluídos com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar testes:', error.message);
    process.exit(1);
  }
}

/**
 * Função principal
 */
function main() {
  console.log('🔧 Configurando ambiente para execução de testes com Supabase MCP...');
  
  // Verificar se os diretórios de configuração existem
  const configDir = path.join(__dirname, 'config');
  if (!fs.existsSync(configDir)) {
    console.log('⚠️ Diretório de configuração não encontrado. Criando...');
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  // Verificar disponibilidade das ferramentas MCP
  const mcpAvailable = checkMCPAvailability();
  
  // Exibir configuração
  console.log('📋 Configuração dos testes:');
  console.log(`   - Padrão de testes: ${config.testPattern}`);
  console.log(`   - Usar MCP: ${config.env.USE_SUPABASE_MCP}`);
  console.log(`   - Criar branch: ${config.env.CREATE_TEST_BRANCH}`);
  console.log(`   - Criar projeto: ${config.env.CREATE_TEST_PROJECT}`);
  
  // Executar os testes
  runTests();
}

// Iniciar o script
main();
