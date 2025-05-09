/**
 * Setup específico para testes da página de autoconhecimento
 * Estende o setup MCP geral com funções específicas para testes de autoconhecimento
 */

const { 
  setupTestEnvironment, 
  applyTestMigration, 
  executeSQL,
  cleanupTestEnvironment 
} = require('../../e2e/config/supabase-mcp-config');

// Usuário de teste padrão para testes de autoconhecimento
const testUser = {
  email: 'teste-autoconhecimento@example.com',
  password: 'senha123',
  nome_completo: 'Usuário Teste Autoconhecimento'
};

// SQL para criação de tabelas de teste de autoconhecimento
const autoconhecimentoTestSchema = `
  -- Criação de tabelas para notas de autoconhecimento
  CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    section TEXT NOT NULL CHECK (section IN ('quem_sou', 'meus_porques', 'meus_padroes')),
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Tabela para preferências do usuário (modo refúgio)
  CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY,
    refugio_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
`;

/**
 * Configurar ambiente de teste para testes de autoconhecimento
 */
async function setupAutoconhecimentoTestEnv(options = {}) {
  const testEnv = await setupTestEnvironment({
    createBranch: true,
    branchName: `autoconhecimento-test-${Date.now()}`,
    ...options
  });
  
  if (testEnv.success) {
    // Aplicar schema de banco de dados para os testes
    await applyTestMigration(
      testEnv.projectId,
      autoconhecimentoTestSchema,
      'autoconhecimento_test_setup'
    );
    
    console.log(`✅ Ambiente de testes de autoconhecimento configurado. ProjectID: ${testEnv.projectId}`);
  }
  
  return testEnv;
}

/**
 * Criar nota de teste para uma seção específica
 */
async function criarNotaTeste(projectId, userId, notaData = {}) {
  const nota = {
    user_id: userId,
    section: 'quem_sou',
    title: 'Nota de teste',
    content: 'Conteúdo da nota de teste',
    ...notaData
  };
  
  const query = `
    INSERT INTO notes (user_id, section, title, content)
    VALUES ('${nota.user_id}', '${nota.section}', '${nota.title}', '${nota.content}')
    RETURNING *;
  `;
  
  const result = await executeSQL(projectId, query);
  return result;
}

/**
 * Atualizar uma nota existente
 */
async function atualizarNotaTeste(projectId, notaId, notaData = {}) {
  // Primeiro obtém a nota existente
  const getQuery = `SELECT * FROM notes WHERE id = '${notaId}';`;
  const existingNota = await executeSQL(projectId, getQuery);
  
  if (!existingNota.success || existingNota.data.length === 0) {
    return { success: false, message: 'Nota não encontrada' };
  }
  
  // Combina dados existentes com atualizações
  const notaAtualizada = {
    ...existingNota.data[0],
    ...notaData,
    updated_at: new Date().toISOString()
  };
  
  const updateQuery = `
    UPDATE notes
    SET 
      title = '${notaAtualizada.title}',
      content = '${notaAtualizada.content}',
      updated_at = '${notaAtualizada.updated_at}'
    WHERE id = '${notaId}'
    RETURNING *;
  `;
  
  const result = await executeSQL(projectId, updateQuery);
  return result;
}

/**
 * Configurar o modo refúgio do usuário
 */
async function configurarModoRefugio(projectId, userId, ativar = true) {
  // Verificar se já existe configuração
  const checkQuery = `SELECT * FROM user_preferences WHERE user_id = '${userId}';`;
  const existingConfig = await executeSQL(projectId, checkQuery);
  
  if (existingConfig.success && existingConfig.data.length > 0) {
    // Atualizar configuração existente
    const updateQuery = `
      UPDATE user_preferences
      SET 
        refugio_mode = ${ativar},
        updated_at = '${new Date().toISOString()}'
      WHERE user_id = '${userId}'
      RETURNING *;
    `;
    return await executeSQL(projectId, updateQuery);
  } else {
    // Criar nova configuração
    const insertQuery = `
      INSERT INTO user_preferences (user_id, refugio_mode)
      VALUES ('${userId}', ${ativar})
      RETURNING *;
    `;
    return await executeSQL(projectId, insertQuery);
  }
}

/**
 * Obter notas de uma seção específica
 */
async function obterNotasSecao(projectId, userId, secao = 'quem_sou') {
  const query = `
    SELECT * FROM notes 
    WHERE user_id = '${userId}' AND section = '${secao}'
    ORDER BY updated_at DESC;
  `;
  
  return await executeSQL(projectId, query);
}

/**
 * Limpar dados de teste de autoconhecimento
 */
async function limparDadosAutoconhecimentoTeste(projectId, userId) {
  if (!projectId || !userId) return;
  
  const queries = [
    `DELETE FROM notes WHERE user_id = '${userId}';`,
    `DELETE FROM user_preferences WHERE user_id = '${userId}';`
  ];
  
  for (const query of queries) {
    await executeSQL(projectId, query);
  }
  
  return { success: true };
}

module.exports = {
  setupAutoconhecimentoTestEnv,
  criarNotaTeste,
  atualizarNotaTeste,
  configurarModoRefugio,
  obterNotasSecao,
  limparDadosAutoconhecimentoTeste,
  autoconhecimentoTestSchema,
  testUser
};
