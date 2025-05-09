/**
 * Setup específico para testes da página de alimentação
 * Estende o setup MCP geral com funções específicas para testes de alimentação
 */

const { 
  setupTestEnvironment, 
  applyTestMigration, 
  executeSQL,
  cleanupTestEnvironment 
} = require('../../e2e/config/supabase-mcp-config');

// Usuário de teste padrão para testes de alimentação
const testUser = {
  email: 'teste-alimentacao@example.com',
  password: 'senha123',
  nome_completo: 'Usuário Teste Alimentação'
};

// SQL para criação de tabelas de teste de alimentação
const alimentacaoTestSchema = `
  -- Criação de tabelas de teste se não existirem
  CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    meal_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  CREATE TABLE IF NOT EXISTS meal_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT NOT NULL,
    image_url TEXT,
    calories INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  CREATE TABLE IF NOT EXISTS hydration_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    frequency_minutes INTEGER DEFAULT 60,
    start_time TIME DEFAULT '08:00:00',
    end_time TIME DEFAULT '20:00:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
`;

/**
 * Configurar ambiente de teste para testes de alimentação
 */
async function setupAlimentacaoTestEnv(options = {}) {
  const testEnv = await setupTestEnvironment({
    createBranch: true,
    branchName: `alimentacao-test-${Date.now()}`,
    ...options
  });
  
  if (testEnv.success) {
    // Aplicar schema de banco de dados para os testes
    await applyTestMigration(
      testEnv.projectId,
      alimentacaoTestSchema,
      'alimentacao_test_setup'
    );
    
    console.log(`✅ Ambiente de testes de alimentação configurado. ProjectID: ${testEnv.projectId}`);
  } else {
    console.warn(`⚠️ Falha ao configurar ambiente de teste: ${testEnv.message}`);
  }
  
  return testEnv;
}

/**
 * Criar dados de teste para planejamento de refeições
 */
async function criarPlanoRefeicaoTeste(projectId, userId, planoRefeicao = {}) {
  const plano = {
    user_id: userId,
    date: new Date().toISOString().split('T')[0],
    meal_type: 'Almoço',
    description: 'Teste de refeição planejada',
    ...planoRefeicao
  };
  
  const query = `
    INSERT INTO meal_plans (user_id, date, meal_type, description)
    VALUES ('${plano.user_id}', '${plano.date}', '${plano.meal_type}', '${plano.description}')
    RETURNING *;
  `;
  
  const result = await executeSQL(projectId, query);
  return result;
}

/**
 * Criar registro de refeição para testes
 */
async function criarRegistroRefeicaoTeste(projectId, userId, registroRefeicao = {}) {
  const registro = {
    user_id: userId,
    description: 'Registro de refeição teste',
    calories: 300,
    ...registroRefeicao
  };
  
  const query = `
    INSERT INTO meal_records (user_id, description, calories)
    VALUES ('${registro.user_id}', '${registro.description}', ${registro.calories})
    RETURNING *;
  `;
  
  const result = await executeSQL(projectId, query);
  return result;
}

/**
 * Configurar lembrete de hidratação para testes
 */
async function configurarLembreteHidratacaoTeste(projectId, userId, config = {}) {
  const configuracao = {
    user_id: userId,
    active: true,
    frequency_minutes: 60,
    start_time: '08:00:00',
    end_time: '20:00:00',
    ...config
  };
  
  const query = `
    INSERT INTO hydration_reminders (user_id, active, frequency_minutes, start_time, end_time)
    VALUES (
      '${configuracao.user_id}', 
      ${configuracao.active}, 
      ${configuracao.frequency_minutes}, 
      '${configuracao.start_time}', 
      '${configuracao.end_time}'
    )
    RETURNING *;
  `;
  
  const result = await executeSQL(projectId, query);
  return result;
}

/**
 * Limpar dados de teste de alimentação
 */
async function limparDadosAlimentacaoTeste(projectId, userId) {
  if (!projectId || !userId) return;
  
  const queries = [
    `DELETE FROM meal_plans WHERE user_id = '${userId}';`,
    `DELETE FROM meal_records WHERE user_id = '${userId}';`,
    `DELETE FROM hydration_reminders WHERE user_id = '${userId}';`
  ];
  
  for (const query of queries) {
    await executeSQL(projectId, query);
  }
  
  return { success: true };
}

module.exports = {
  setupAlimentacaoTestEnv,
  criarPlanoRefeicaoTeste,
  criarRegistroRefeicaoTeste,
  configurarLembreteHidratacaoTeste,
  limparDadosAlimentacaoTeste,
  alimentacaoTestSchema,
  testUser
};
