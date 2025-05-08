import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://ekdygbctzcrzrqqxfszz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZHlnYmN0emNyenJxcXhmc3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDY5MTQsImV4cCI6MjA2MjEyMjkxNH0.fYu9IWemd3jadizoaCajJTGyHB3KgKhUOEfLxpdACJE';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Variáveis para armazenar IDs
let userId;
let tarefaId;
let prioridadeId;
let blocoTempoId;

// Função para fazer login
async function fazerLogin(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha
  });
  
  if (error) {
    console.error('Erro no login:', error);
    return null;
  }
  
  userId = data.user.id;
  console.log('Login realizado com sucesso. ID do usuário:', userId);
  return data;
}

// Função para testar a criação de tarefa
async function criarTarefa() {
  const novaTarefa = {
    user_id: userId,
    texto: 'Finalizar relatório do projeto',
    concluida: false,
    categoria: 'estudos',
    data: new Date().toISOString().split('T')[0]
  };
  
  const { data, error } = await supabase
    .from('tasks')
    .insert(novaTarefa)
    .select();
  
  if (error) {
    console.error('Erro ao criar tarefa:', error);
    return null;
  }
  
  console.log('Tarefa criada com sucesso:', data[0]);
  tarefaId = data[0].id;
  return data[0];
}

// Função para testar a leitura de tarefas
async function listarTarefas() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false });
  
  if (error) {
    console.error('Erro ao listar tarefas:', error);
    return null;
  }
  
  console.log('Tarefas encontradas:', data.length);
  console.log('Tarefas:', data);
  return data;
}

// Função para testar a atualização de tarefa
async function atualizarTarefa() {
  const atualizacao = {
    concluida: true,
    texto: 'Finalizar relatório do projeto (concluído)'
  };
  
  const { data, error } = await supabase
    .from('tasks')
    .update(atualizacao)
    .eq('id', tarefaId)
    .select();
  
  if (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return null;
  }
  
  console.log('Tarefa atualizada com sucesso:', data[0]);
  return data[0];
}

// Função para testar a criação de prioridade
async function criarPrioridade() {
  const novaPrioridade = {
    user_id: userId,
    texto: 'Estudar para a prova de certificação',
    concluida: false,
    data: new Date().toISOString().split('T')[0],
    tipo: 'geral'
  };
  
  const { data, error } = await supabase
    .from('user_priorities')
    .insert(novaPrioridade)
    .select();
  
  if (error) {
    console.error('Erro ao criar prioridade:', error);
    return null;
  }
  
  console.log('Prioridade criada com sucesso:', data[0]);
  prioridadeId = data[0].id;
  return data[0];
}

// Função para testar a leitura de prioridades
async function listarPrioridades() {
  const { data, error } = await supabase
    .from('user_priorities')
    .select('*')
    .eq('user_id', userId)
    .eq('tipo', 'geral')
    .eq('concluida', false);
  
  if (error) {
    console.error('Erro ao listar prioridades:', error);
    return null;
  }
  
  console.log('Prioridades encontradas:', data.length);
  console.log('Prioridades:', data);
  return data;
}

// Função para testar a criação de bloco de tempo
async function criarBlocoTempo() {
  const novoBloco = {
    user_id: userId,
    hora: '14:00',
    atividade: 'Revisão do material de estudo',
    categoria: 'estudos',
    data: new Date().toISOString().split('T')[0]
  };
  
  const { data, error } = await supabase
    .from('time_blocks')
    .insert(novoBloco)
    .select();
  
  if (error) {
    console.error('Erro ao criar bloco de tempo:', error);
    return null;
  }
  
  console.log('Bloco de tempo criado com sucesso:', data[0]);
  blocoTempoId = data[0].id;
  return data[0];
}

// Função para testar a leitura de blocos de tempo
async function listarBlocosTempo() {
  const hoje = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('time_blocks')
    .select('*')
    .eq('user_id', userId)
    .eq('data', hoje)
    .order('hora');
  
  if (error) {
    console.error('Erro ao listar blocos de tempo:', error);
    return null;
  }
  
  console.log('Blocos de tempo encontrados:', data.length);
  console.log('Blocos de tempo:', data);
  return data;
}

// Função para testar a exclusão de tarefa
async function excluirTarefa() {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', tarefaId);
  
  if (error) {
    console.error('Erro ao excluir tarefa:', error);
    return false;
  }
  
  console.log('Tarefa excluída com sucesso.');
  return true;
}

// Executar os testes
async function executarTestes() {
  console.log('Iniciando testes do módulo de tarefas e prioridades...');
  
  // Fazer login
  const email = 'teste@exemplo.com';
  const senha = 'senha123';
  const sessao = await fazerLogin(email, senha);
  if (!sessao) {
    console.error('Falha ao fazer login. Testes não podem continuar.');
    return;
  }
  
  // Testar criação de tarefa
  const tarefa = await criarTarefa();
  if (!tarefa) {
    console.error('Falha ao criar tarefa. Testes não podem continuar.');
    return;
  }
  
  // Testar listagem de tarefas
  await listarTarefas();
  
  // Testar atualização de tarefa
  await atualizarTarefa();
  
  // Testar criação de prioridade
  const prioridade = await criarPrioridade();
  if (!prioridade) {
    console.error('Falha ao criar prioridade. Testes não podem continuar.');
    return;
  }
  
  // Testar listagem de prioridades
  await listarPrioridades();
  
  // Testar criação de bloco de tempo
  const blocoTempo = await criarBlocoTempo();
  if (!blocoTempo) {
    console.error('Falha ao criar bloco de tempo. Testes não podem continuar.');
    return;
  }
  
  // Testar listagem de blocos de tempo
  await listarBlocosTempo();
  
  // Testar exclusão de tarefa
  await excluirTarefa();
  
  console.log('Testes do módulo de tarefas e prioridades concluídos!');
}

// Executar testes
executarTestes(); 