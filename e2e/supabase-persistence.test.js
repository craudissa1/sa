// Testes para verificar a persistência real dos dados no Supabase
// Utiliza a conexão real com o ambiente de staging, não mocks
const { supabase } = require('@/lib/supabaseClient');

// Importar as ferramentas MCP do Supabase para testes
const {
  setupTestEnvironment,
  applyTestMigration,
  executeSQL,
  cleanupTestEnvironment,
  getTestLogs
} = require('./config/supabase-mcp-config');

// Função para verificar a conexão com o Supabase
async function checkConnection() {
  try {
    const { error } = await supabase.from('tasks').select('id').limit(1);
    return { connected: !error, error: error ? error.message : null };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

// Função para limpar dados de teste
async function cleanupTestData(userId) {
  if (!userId) return;
  
  try {
    // Limpar dados de teste por ID do usuário e marcador de teste
    const tables = [
      'tasks',
      'medications',
      'user_priorities',
      'time_blocks',
      'sleep_logs',
      'mood_logs',
      'finance_categories',
      'finance_transactions'
    ];
    
    // Executar limpeza em todas as tabelas conhecidas
    const promises = tables.map(table => {
      return supabase
        .from(table)
        .delete()
        .match({ user_id: userId, teste: true });
    });
    
    await Promise.all(promises);
    console.log(`Dados de teste do usuário ${userId} limpos com sucesso.`);
  } catch (err) {
    console.warn(`Erro ao limpar dados de teste: ${err.message}`);
  }
}

// Dados para teste - importante usar um prefixo para identificar dados de teste
const TEST_PREFIX = '[TESTE]';
const testUser = {
  email: 'teste@exemplo.com',
  password: 'senha123',
  nome_completo: 'Usuário Teste Persistência' // Adicionada propriedade nome_completo para consistência
};

/**
 * Testes para validar a persistência real dos dados no Supabase
 * sem uso de mocks, verificando se os dados persistem entre sessões
 */
describe('Testes de Persistência Real com Supabase', () => {
  let userId = null;
  let isConnected = false;
  let mcpEnvironment = null; // Armazena informações do ambiente MCP
  
  // Verificar se a conexão com o Supabase está disponível
  beforeAll(async () => {
    // Verificar se deve usar MCP para ambiente de teste
    const useMCP = process.env.USE_SUPABASE_MCP === 'true';
    
    if (useMCP) {
      try {
        // Configurar ambiente de teste com MCP (usando branch para isolar testes)
        mcpEnvironment = await setupTestEnvironment({
          createBranch: true,
          branchName: `persistence-test-${Date.now()}`
        });
        
        if (mcpEnvironment.success) {
          console.log(`✅ Ambiente MCP configurado para testes de persistência. ProjectID: ${mcpEnvironment.projectId}`);
          
          // Se branch foi criado com sucesso, consideramos conectado
          isConnected = true;
          
          // Configurar schema inicial para testes (se necessário)
          if (mcpEnvironment.isBranch) {
            // SQL para criar tabelas de teste se não existirem
            const setupSQL = `
              -- Criação de tabelas de teste se não existirem
              CREATE TABLE IF NOT EXISTS tasks (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                texto TEXT NOT NULL,
                concluida BOOLEAN DEFAULT FALSE,
                categoria TEXT CHECK (categoria IN ('estudos', 'trabalho', 'pessoal', 'saude')),
                data DATE,
                teste BOOLEAN DEFAULT FALSE
              );
              
              CREATE TABLE IF NOT EXISTS finance_categories (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                nome TEXT NOT NULL,
                cor TEXT,
                icone TEXT,
                teste BOOLEAN DEFAULT FALSE
              );
              
              CREATE TABLE IF NOT EXISTS finance_transactions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                valor DECIMAL(10,2) NOT NULL,
                descricao TEXT,
                categoriaid UUID REFERENCES finance_categories(id),
                tipo TEXT CHECK (tipo IN ('receita', 'despesa')),
                data DATE,
                teste BOOLEAN DEFAULT FALSE
              );
              
              CREATE TABLE IF NOT EXISTS mood_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                nivel INTEGER CHECK (nivel BETWEEN 1 AND 5),
                data DATE,
                fatores TEXT[],
                teste BOOLEAN DEFAULT FALSE
              );
            `;
            
            // Aplicar migração para setup de testes
            await applyTestMigration(
              mcpEnvironment.projectId, 
              setupSQL, 
              'persistence_test_setup'
            );
          }
        } else {
          console.warn(`⚠️ Não foi possível configurar ambiente MCP: ${mcpEnvironment.message}`);
          
          // Fallback para verificação de conexão padrão
          const connection = await checkConnection();
          isConnected = connection.connected;
        }
      } catch (error) {
        console.error('❌ Erro ao configurar ambiente MCP para testes:', error);
        
        // Fallback para verificação de conexão padrão
        const connection = await checkConnection();
        isConnected = connection.connected;
      }
    } else {
      // Verificação de conexão padrão quando não usar MCP
      const connection = await checkConnection();
      isConnected = connection.connected;
    }
    
    // Se não houver conexão, pular todos os testes
    if (!isConnected) {
      console.warn(`Sem conexão com o Supabase: ${connection.error}`);
      return;
    }
    
    // Fazer login com usuário de teste
    const { data, error } = await supabase.auth.signInWithPassword(testUser);
    
    if (error) {
      // Se o erro for "User not found", tentar registrar o usuário
      if (error.message.toLowerCase().includes('user not found') || error.message.toLowerCase().includes('invalid login credentials')) {
        console.warn(`Usuário de teste ${testUser.email} não encontrado, tentando registrar...`);
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp(testUser);
        if (signUpError) {
          throw new Error(`Erro ao registrar usuário de teste para persistência: ${signUpError.message}`);
        }
        if (!signUpData.user) {
          throw new Error('Falha ao obter dados do usuário após o registro para persistência.');
        }
        userId = signUpData.user.id;
        console.log(`Usuário de teste ${testUser.email} registrado com ID: ${userId}`);
      } else {
        throw new Error(`Erro no login para testes de persistência: ${error.message}`);
      }
    } else {
      userId = data.user.id;
    }
    
    if (!userId) {
      throw new Error('Não foi possível obter o ID do usuário para os testes de persistência.');
    }
    // Limpar quaisquer dados de teste anteriores que possam ter ficado
    await cleanupTestData(userId);
  });
  
  // Cleanup após todos os testes
  afterAll(async () => {
    if (isConnected && userId) {
      await cleanupTestData(userId);
      await supabase.auth.signOut();
    }
    
    // Limpar ambiente MCP se foi usado
    if (mcpEnvironment && mcpEnvironment.success) {
      try {
        // Obter logs antes de limpar (para debug se necessário)
        const logs = await getTestLogs(mcpEnvironment.projectId, 'postgres');
        if (logs.success) {
          console.log('📋 Logs do teste de persistência:', logs.logs.slice(0, 3));
        }
        
        // Limpar recursos MCP criados para o teste
        await cleanupTestEnvironment({
          projectId: mcpEnvironment.projectId,
          branchId: mcpEnvironment.branchId,
          isBranch: mcpEnvironment.isBranch
        });
        
        console.log('🧹 Ambiente MCP de testes limpo com sucesso');
      } catch (error) {
        console.error('❌ Erro ao limpar ambiente MCP de teste:', error);
      }
    }
  });

  // Pular todos os testes se não houver conexão
  beforeEach(() => {
    if (!isConnected) {
      console.warn('Pulando teste devido à falta de conexão com o Supabase');
      return;
    }
  });

  test('Deve criar e persistir dados no Supabase real', async () => {
    // Pular teste se não houver conexão
    if (!isConnected) return;
    
    // Usar MCP para executar query de teste se disponível
    const useMCP = mcpEnvironment && mcpEnvironment.success;
    
    const dataHoje = new Date().toISOString().split('T')[0];
    const testTaskName = `${TEST_PREFIX} Tarefa de teste persistência ${Date.now()}`;
    
    // 1. Criar uma tarefa no Supabase real
    const novaTarefa = {
      user_id: userId,
      texto: testTaskName,
      concluida: false,
      categoria: 'estudos',  // Usando valor permitido pela restrição
      data: dataHoje,
      teste: true // Marcar como dado de teste para fácil limpeza
    };
    
    const { data: tarefa, error: tarefaError } = await supabase
      .from('tasks')
      .insert(novaTarefa)
      .select()
      .single();
    
    expect(tarefaError).toBeNull();
    expect(tarefa).toBeTruthy();
    expect(tarefa.user_id).toBe(userId);
    expect(tarefa.texto).toBe(testTaskName);
    
    // Armazenar o ID para referência
    const tarefaId = tarefa.id;
    
    // 2. Encerrar a sessão completamente e fazer login novamente
    await supabase.auth.signOut();
    
    // Fazer login novamente para simular um novo acesso
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword(testUser);
    
    expect(loginError).toBeNull();
    expect(loginData.user.id).toBe(userId);
    
    // 3. Verificar se conseguimos recuperar a tarefa criada anteriormente
    let tarefaRecuperada;
    let recuperacaoError;
    
    if (useMCP) {
      // Usar MCP para executar consulta SQL direta
      const sqlResult = await executeSQL(
        mcpEnvironment.projectId,
        `SELECT * FROM tasks WHERE id = '${tarefaId}'`
      );
      
      tarefaRecuperada = sqlResult.success && sqlResult.data.length > 0 ? sqlResult.data[0] : null;
      recuperacaoError = sqlResult.success ? null : { message: sqlResult.message };
    } else {
      // Usar Supabase SDK padrão
      const result = await supabase
        .from('tasks')
        .select()
        .eq('id', tarefaId)
        .single();
      
      tarefaRecuperada = result.data;
      recuperacaoError = result.error;
    }
    
    // Validar que a tarefa está persistida e disponível após novo login
    expect(recuperacaoError).toBeNull();
    expect(tarefaRecuperada).toBeTruthy();
    expect(tarefaRecuperada.texto).toBe(testTaskName);
    expect(tarefaRecuperada.user_id).toBe(userId);
    
    // 4. Limpar a tarefa de teste
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', tarefaId);
    
    expect(deleteError).toBeNull();
  });

  test('Deve criar, atualizar e recuperar dados complexos em módulos diferentes', async () => {
    // Pular teste se não houver conexão
    if (!isConnected) return;
    
    const dataHoje = new Date().toISOString().split('T')[0];
    const testTimestamp = Date.now();
    
    // 1. Criar uma categoria financeira
    const novaCategoria = {
      user_id: userId,
      nome: `${TEST_PREFIX} Alimentação ${testTimestamp}`,
      cor: '#FF5722',
      icone: 'restaurant',
      teste: true
    };
    
    const { data: categoria, error: categoriaError } = await supabase
      .from('finance_categories')
      .insert(novaCategoria)
      .select()
      .single();
    
    expect(categoriaError).toBeNull();
    expect(categoria).toBeTruthy();
    const categoriaId = categoria.id;
    
    // 2. Criar uma transação associada à categoria
    const novaTransacao = {
      user_id: userId,
      valor: 42.50,
      descricao: `${TEST_PREFIX} Almoço ${testTimestamp}`,
      categoriaid: categoriaId,
      tipo: 'despesa',
      data: dataHoje,
      teste: true
    };
    
    const { data: transacao, error: transacaoError } = await supabase
      .from('finance_transactions')
      .insert(novaTransacao)
      .select()
      .single();
    
    expect(transacaoError).toBeNull();
    expect(transacao).toBeTruthy();
    const transacaoId = transacao.id;
    
    // 3. Criar um registro de humor para o mesmo dia
    const novoHumor = {
      user_id: userId,
      nivel: 4,
      data: dataHoje,
      fatores: ['Boa alimentação'],
      teste: true
    };
    
    const { data: humor, error: humorError } = await supabase
      .from('mood_logs')
      .insert(novoHumor)
      .select()
      .single();
    
    expect(humorError).toBeNull();
    expect(humor).toBeTruthy();
    const humorId = humor.id;
    
    // 4. Encerrar a sessão completamente e fazer login novamente
    await supabase.auth.signOut();
    
    // Limpar o estado local
    localStorage.clear();
    sessionStorage.clear();
    
    // Fazer login novamente para simular um novo acesso
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword(testUser);
    
    expect(loginError).toBeNull();
    expect(loginData.user.id).toBe(userId);
    
    // 5. Buscar todos os dados criados nos diferentes módulos
    const [
      categoriaResult,
      transacaoResult,
      humorResult
    ] = await Promise.all([
      supabase.from('finance_categories').select().eq('id', categoriaId).single(),
      supabase.from('finance_transactions').select().eq('id', transacaoId).single(),
      supabase.from('mood_logs').select().eq('id', humorId).single()
    ]);
    
    // Validar que todos os dados persistiram corretamente
    expect(categoriaResult.error).toBeNull();
    expect(categoriaResult.data).toBeTruthy();
    expect(categoriaResult.data.nome).toContain(TEST_PREFIX);
    
    expect(transacaoResult.error).toBeNull();
    expect(transacaoResult.data).toBeTruthy();
    expect(transacaoResult.data.descricao).toContain(TEST_PREFIX);
    expect(transacaoResult.data.categoriaid).toBe(categoriaId);
    
    expect(humorResult.error).toBeNull();
    expect(humorResult.data).toBeTruthy();
    expect(humorResult.data.nivel).toBe(4);
    
    // 6. Verificar relações entre dados
    // Buscar transações pela categoria
    const { data: transacoesPorCategoria, error: transacoesCatError } = await supabase
      .from('finance_transactions')
      .select()
      .eq('categoriaid', categoriaId);
    
    expect(transacoesCatError).toBeNull();
    expect(transacoesPorCategoria).toBeTruthy();
    expect(transacoesPorCategoria.some(t => t.id === transacaoId)).toBe(true);
    
    // 7. Limpar dados de teste
    await Promise.all([
      supabase.from('finance_transactions').delete().eq('id', transacaoId),
      supabase.from('finance_categories').delete().eq('id', categoriaId),
      supabase.from('mood_logs').delete().eq('id', humorId)
    ]);
  });
});
