// Importar o mock do Supabase em vez de criar uma instância real
const { supabaseMock: supabase, mockData } = require('../mocks/supabase-mock');

// Dados para teste
const testUser = {
  email: 'teste@exemplo.com',
  password: 'senha123'
};

/**
 * Testes End-to-End (E2E) simulando fluxos completos de usuário
 * Estes testes seguem cenários reais de uso da aplicação StayFocus
 */
describe('Testes E2E StayFocus com Supabase', () => {
  let userId = null;
  let cleanupIds = {
    tarefa: null,
    medicamento: null,
    prioridade: null,
    blocoTempo: null,
    sono: null,
    humor: null
  };
  
  // Setup antes de cada suite de testes
  beforeEach(async () => {
    // Limpar estado anterior
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    
    // Login novo
    const { data, error } = await supabase.auth.signInWithPassword(testUser);
    
    if (error) {
      throw new Error(`Erro no login para testes E2E: ${error.message}`);
    }
    
    userId = data.user.id;
  });
  
  // Cleanup após cada suite
  afterEach(async () => {
    if (userId) {
      // Limpar dados de teste
      await Promise.all([
        cleanupIds.tarefa && supabase.from('tasks').delete().eq('id', cleanupIds.tarefa),
        cleanupIds.medicamento && supabase.from('medications').delete().eq('id', cleanupIds.medicamento),
        cleanupIds.prioridade && supabase.from('user_priorities').delete().eq('id', cleanupIds.prioridade),
        cleanupIds.blocoTempo && supabase.from('time_blocks').delete().eq('id', cleanupIds.blocoTempo),
        cleanupIds.sono && supabase.from('sleep_logs').delete().eq('id', cleanupIds.sono),
        cleanupIds.humor && supabase.from('mood_logs').delete().eq('id', cleanupIds.humor)
      ]);
    }
    
    // Resetar IDs
    cleanupIds = {
      tarefa: null,
      medicamento: null,
      prioridade: null,
      blocoTempo: null,
      sono: null,
      humor: null
    };
    
    // Logout
    await supabase.auth.signOut();
  });

  describe('Gerenciamento de Tarefas e Prioridades', () => {
    test('Deve gerenciar tarefas e prioridades do dia', async () => {
      const dataHoje = new Date().toISOString().split('T')[0];
      
      // 1. Criar tarefa
      const novaTarefa = {
        user_id: userId,
        texto: 'Completar relatório do projeto',
        concluida: false,
        categoria: 'estudos',
        data: dataHoje
      };
      
      const { data: tarefa, error: tarefaError } = await supabase
        .from('tasks')
        .insert(novaTarefa)
        .select()
        .single();
      
      expect(tarefaError).toBeNull();
      expect(tarefa).toBeTruthy();
      expect(tarefa.user_id).toBe(userId);
      cleanupIds.tarefa = tarefa.id;
      
      // 2. Criar prioridade
      const novaPrioridade = {
        user_id: userId,
        texto: 'Estudar para a certificação',
        concluida: false,
        data: dataHoje,
        tipo: 'geral'
      };
      
      const { data: prioridade, error: prioridadeError } = await supabase
        .from('user_priorities')
        .insert(novaPrioridade)
        .select()
        .single();
      
      expect(prioridadeError).toBeNull();
      expect(prioridade).toBeTruthy();
      cleanupIds.prioridade = prioridade.id;
      
      // 3. Listar itens do dia
      const { data: tarefasHoje, error: listTarefasError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('data', dataHoje);
      
      expect(listTarefasError).toBeNull();
      expect(tarefasHoje).toBeTruthy();
      expect(tarefasHoje.find(t => t.id === tarefa.id)).toBeTruthy();
      
      const { data: prioridadesHoje, error: listPrioridadesError } = await supabase
        .from('user_priorities')
        .select('*')
        .eq('user_id', userId)
        .eq('data', dataHoje);
      
      expect(listPrioridadesError).toBeNull();
      expect(prioridadesHoje).toBeTruthy();
      expect(prioridadesHoje.find(p => p.id === prioridade.id)).toBeTruthy();
      
      // 4. Marcar tarefa como concluída
      const { data: tarefaAtualizada, error: updateError } = await supabase
        .from('tasks')
        .update({ concluida: true })
        .eq('id', tarefa.id)
        .select()
        .single();
      
      expect(updateError).toBeNull();
      expect(tarefaAtualizada.concluida).toBe(true);
    });
  });

  describe('Dashboard Central', () => {
    test('Deve gerenciar componentes do dashboard', async () => {
      const dataHoje = new Date().toISOString().split('T')[0];
      
      // 1. Criar bloco de tempo
      const novoBloco = {
        user_id: userId,
        hora: '14:00',
        atividade: 'Reunião de equipe',
        categoria: 'estudos',
        data: dataHoje
      };
      
      const { data: bloco, error: blocoError } = await supabase
        .from('time_blocks')
        .insert(novoBloco)
        .select()
        .single();
      
      expect(blocoError).toBeNull();
      expect(bloco).toBeTruthy();
      cleanupIds.blocoTempo = bloco.id;
      
      // 2. Criar medicamento
      const novoMedicamento = {
        user_id: userId,
        nome: 'Vitamina C',
        dosagem: '1000mg',
        frequencia: 'Diário',
        horarios: ['08:00', '20:00'],
        observacoes: 'Tomar com água',
        datainicio: dataHoje,
        intervalo: 12
      };
      
      const { data: medicamento, error: medicamentoError } = await supabase
        .from('medications')
        .insert(novoMedicamento)
        .select()
        .single();
      
      expect(medicamentoError).toBeNull();
      expect(medicamento).toBeTruthy();
      cleanupIds.medicamento = medicamento.id;
      
      // 3. Verificar dashboard
      const promises = await Promise.all([
        // Blocos do dia
        supabase
          .from('time_blocks')
          .select('*')
          .eq('user_id', userId)
          .eq('data', dataHoje),
          
        // Medicamentos ativos
        supabase
          .from('medications')
          .select('*')
          .eq('user_id', userId),
          
        // Prioridades do dia
        supabase
          .from('user_priorities')
          .select('*')
          .eq('user_id', userId)
          .eq('data', dataHoje)
          .limit(3)
      ]);
      
      promises.forEach(({ error }) => expect(error).toBeNull());
      
      const [blocos, medicamentos, prioridades] = promises.map(p => p.data);
      
      expect(blocos.find(b => b.id === bloco.id)).toBeTruthy();
      expect(medicamentos.find(m => m.id === medicamento.id)).toBeTruthy();
      
      // 4. Registrar tomada de medicamento
      const agora = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('medications')
        .update({ ultimatomada: agora })
        .eq('id', medicamento.id)
        .select()
        .single();
      
      expect(updateError).toBeNull();
    });
  });

  describe('Saúde e Sono', () => {
    test('Deve gerenciar registros de saúde', async () => {
      const dataHoje = new Date().toISOString().split('T')[0];
      
      // 1. Registrar sono
      const novoSono = {
        user_id: userId,
        inicio: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        fim: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
        qualidade: 4,
        notas: 'Dormi bem, sem interrupções'
      };
      
      const { data: sono, error: sonoError } = await supabase
        .from('sleep_logs')
        .insert(novoSono)
        .select()
        .single();
      
      expect(sonoError).toBeNull();
      expect(sono).toBeTruthy();
      cleanupIds.sono = sono.id;
      
      // 2. Registrar humor
      const novoHumor = {
        user_id: userId,
        data: dataHoje,
        nivel: 4,
        fatores: ['Boa noite de sono', 'Produtividade alta'],
        notas: 'Dia muito produtivo'
      };
      
      const { data: humor, error: humorError } = await supabase
        .from('mood_logs')
        .insert(novoHumor)
        .select()
        .single();
      
      expect(humorError).toBeNull();
      expect(humor).toBeTruthy();
      cleanupIds.humor = humor.id;
      
      // 3. Verificar registros
      const { data: registrosSono, error: listSonoError } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('inicio', dataHoje);
      
      expect(listSonoError).toBeNull();
      expect(registrosSono).toBeTruthy();
      expect(registrosSono.find(s => s.id === sono.id)).toBeTruthy();
      
      const { data: registrosHumor, error: listHumorError } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('data', dataHoje);
      
      expect(listHumorError).toBeNull();
      expect(registrosHumor).toBeTruthy();
      expect(registrosHumor.find(h => h.id === humor.id)).toBeTruthy();
    });
  });
});
