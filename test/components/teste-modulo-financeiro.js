import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://ekdygbctzcrzrqqxfszz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZHlnYmN0emNyenJxcXhmc3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDY5MTQsImV4cCI6MjA2MjEyMjkxNH0.fYu9IWemd3jadizoaCajJTGyHB3KgKhUOEfLxpdACJE';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Variáveis para armazenar IDs
let userId;
let categoriaid;
let transacaoId;
let envelopeId;

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

// Função para testar a criação de categoria financeira
async function criarCategoriaFinanceira() {
  const novaCategoria = {
    user_id: userId,
    nome: 'Alimentação',
    cor: '#4CAF50',
    icone: 'restaurant'
  };
  
  const { data, error } = await supabase
    .from('finance_categories')
    .insert(novaCategoria)
    .select();
  
  if (error) {
    console.error('Erro ao criar categoria financeira:', error);
    return null;
  }
  
  console.log('Categoria financeira criada com sucesso:', data[0]);
  categoriaid = data[0].id;
  return data[0];
}

// Função para testar a leitura de categorias financeiras
async function listarCategoriasFinanceiras() {
  const { data, error } = await supabase
    .from('finance_categories')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Erro ao listar categorias:', error);
    return null;
  }
  
  console.log('Categorias financeiras encontradas:', data.length);
  console.log('Categorias:', data);
  return data;
}

// Função para testar a criação de transação financeira
async function criarTransacaoFinanceira() {
  const novaTransacao = {
    user_id: userId,
    data: new Date().toISOString().split('T')[0],
    valor: 150.75,
    descricao: 'Compras no supermercado',
    categoriaid: categoriaid,
    tipo: 'despesa'
  };
  
  const { data, error } = await supabase
    .from('finance_transactions')
    .insert(novaTransacao)
    .select();
  
  if (error) {
    console.error('Erro ao criar transação financeira:', error);
    return null;
  }
  
  console.log('Transação financeira criada com sucesso:', data[0]);
  transacaoId = data[0].id;
  return data[0];
}

// Função para testar a leitura de transações financeiras
async function listarTransacoesFinanceiras() {
  const { data, error } = await supabase
    .from('finance_transactions')
    .select('*, finance_categories(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Erro ao listar transações:', error);
    return null;
  }
  
  console.log('Transações financeiras encontradas:', data.length);
  console.log('Transações:', data);
  return data;
}

// Função para testar a atualização de transação financeira
async function atualizarTransacaoFinanceira() {
  const atualizacao = {
    valor: 175.30,
    descricao: 'Compras no supermercado (atualizado)'
  };
  
  const { data, error } = await supabase
    .from('finance_transactions')
    .update(atualizacao)
    .eq('id', transacaoId)
    .select();
  
  if (error) {
    console.error('Erro ao atualizar transação:', error);
    return null;
  }
  
  console.log('Transação financeira atualizada com sucesso:', data[0]);
  return data[0];
}

// Função para testar a criação de envelope
async function criarEnvelopeFinanceiro() {
  const novoEnvelope = {
    user_id: userId,
    nome: 'Alimentação Mensal',
    cor: '#2196F3',
    valoralocado: 900.00,
    valorutilizado: 175.30
  };
  
  const { data, error } = await supabase
    .from('finance_envelopes')
    .insert(novoEnvelope)
    .select();
  
  if (error) {
    console.error('Erro ao criar envelope financeiro:', error);
    return null;
  }
  
  console.log('Envelope financeiro criado com sucesso:', data[0]);
  envelopeId = data[0].id;
  return data[0];
}

// Função para testar a exclusão de transação financeira
async function excluirTransacaoFinanceira() {
  const { error } = await supabase
    .from('finance_transactions')
    .delete()
    .eq('id', transacaoId);
  
  if (error) {
    console.error('Erro ao excluir transação:', error);
    return false;
  }
  
  console.log('Transação financeira excluída com sucesso.');
  return true;
}

// Executar os testes
async function executarTestes() {
  console.log('Iniciando testes do módulo financeiro...');
  
  // Fazer login
  const email = 'teste@exemplo.com';
  const senha = 'senha123';
  const sessao = await fazerLogin(email, senha);
  if (!sessao) {
    console.error('Falha ao fazer login. Testes não podem continuar.');
    return;
  }
  
  // Testar criação de categoria
  const categoria = await criarCategoriaFinanceira();
  if (!categoria) {
    console.error('Falha ao criar categoria. Testes não podem continuar.');
    return;
  }
  
  // Testar listagem de categorias
  await listarCategoriasFinanceiras();
  
  // Testar criação de transação
  const transacao = await criarTransacaoFinanceira();
  if (!transacao) {
    console.error('Falha ao criar transação. Testes não podem continuar.');
    return;
  }
  
  // Testar atualização de transação
  await atualizarTransacaoFinanceira();
  
  // Testar listagem de transações
  await listarTransacoesFinanceiras();
  
  // Testar criação de envelope
  await criarEnvelopeFinanceiro();
  
  // Testar exclusão de transação
  await excluirTransacaoFinanceira();
  
  console.log('Testes do módulo financeiro concluídos!');
}

// Executar testes
executarTestes(); 