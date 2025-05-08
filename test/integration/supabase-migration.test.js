// Importar o mock do Supabase em vez de criar uma instância real
const { supabaseMock: supabase, mockData } = require('../mocks/supabase-mock');

// Dados para teste
const testUser = {
  email: 'teste@exemplo.com',
  password: 'senha123'
};

/**
 * Testes de migração de dados para o Supabase
 */
describe('Testes de Migração para Supabase', () => {
  let userId = null;
  let sessionUser = null;
  
  // Setup antes de cada teste
  beforeEach(async () => {
    // Limpar dados de teste anteriores
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    
    // Fazer login para obter ID
    const { data, error } = await supabase.auth.signInWithPassword(testUser);
    
    if (error) {
      throw new Error(`Erro no login para testes de migração: ${error.message}`);
    }
    
    userId = data.user.id;
    sessionUser = data.user;
  });
  
  // Cleanup após cada teste
  afterEach(async () => {
    // Limpar dados de teste
    if (userId) {
      await Promise.all([
        supabase.from('tasks').delete().eq('user_id', userId),
        supabase.from('finance_categories').delete().eq('user_id', userId)
      ]);
    }
    await supabase.auth.signOut();
  });

  describe('Perfil de Usuário', () => {
    test('Deve verificar se o perfil do usuário existe', async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, nome')
        .eq('user_id', userId)
        .single();
      
      if (error?.code === 'PGRST116') {
        // Perfil não encontrado - esperado em alguns casos
        expect(data).toBeNull();
      } else {
        expect(error).toBeNull();
        if (data) {
          expect(data.user_id).toBe(userId);
        }
      }
    });

    test('Deve criar ou atualizar o perfil do usuário', async () => {
      const perfilDados = {
        user_id: userId,
        nome: 'Usuário de Teste',
        preferenciasvisuais: {
          textoGrande: false,
          altoContraste: false,
          reducaoEstimulos: true
        },
        metasdiarias: {
          horasSono: 8,
          coposAgua: 8,
          pausasProgramadas: 4,
          tarefasPrioritarias: 3
        }
      };
      
      // Verificar se já existe
      const { data: existingProfile, error: queryError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      expect(queryError?.code !== 'PGRST116').toBeTruthy();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(perfilDados)
        .select()
        .single();
      
      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data.user_id).toBe(userId);
      expect(data.nome).toBe(perfilDados.nome);
    });
  });

  describe('Configurações do Usuário', () => {
    test('Deve criar ou atualizar as configurações', async () => {
      const configDados = {
        user_id: userId,
        notificacoes: true,
        pausaativa: true,
        tempofoco: 25,
        tempopausa: 5,
        temaescuro: false,
        reducaoestimulos: true
      };
      
      const { data, error } = await supabase
        .from('user_configurations')
        .upsert(configDados)
        .select()
        .single();
      
      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data.user_id).toBe(userId);
      expect(data.tempofoco).toBe(configDados.tempofoco);
    });
  });

  describe('Tarefas', () => {
    test('Deve criar e listar uma tarefa', async () => {
      const tarefa = {
        user_id: userId,
        texto: 'Tarefa de teste de migração',
        concluida: false,
        categoria: 'estudos',
        data: new Date().toISOString().split('T')[0]
      };
      
      // Criar tarefa
      const { data: novaTarefa, error: createError } = await supabase
        .from('tasks')
        .insert(tarefa)
        .select()
        .single();
      
      expect(createError).toBeNull();
      expect(novaTarefa).toBeTruthy();
      expect(novaTarefa.user_id).toBe(userId);
      
      // Listar tarefas
      const { data: tarefas, error: listError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
      
      expect(listError).toBeNull();
      expect(tarefas).toBeTruthy();
      expect(tarefas.length).toBeGreaterThan(0);
      expect(tarefas.find(t => t.id === novaTarefa.id)).toBeTruthy();
    });
  });

  describe('Finanças', () => {
    test('Deve criar e listar uma categoria financeira', async () => {
      const categoria = {
        user_id: userId,
        nome: 'Categoria de Teste',
        cor: '#4CAF50',
        icone: 'shopping_cart'
      };
      
      // Criar categoria
      const { data: novaCategoria, error: createError } = await supabase
        .from('finance_categories')
        .insert(categoria)
        .select()
        .single();
      
      expect(createError).toBeNull();
      expect(novaCategoria).toBeTruthy();
      expect(novaCategoria.user_id).toBe(userId);
      
      // Listar categorias
      const { data: categorias, error: listError } = await supabase
        .from('finance_categories')
        .select('*')
        .eq('user_id', userId);
      
      expect(listError).toBeNull();
      expect(categorias).toBeTruthy();
      expect(categorias.length).toBeGreaterThan(0);
      expect(categorias.find(c => c.id === novaCategoria.id)).toBeTruthy();
    });
  });
});
