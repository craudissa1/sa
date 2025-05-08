import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://ekdygbctzcrzrqqxfszz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZHlnYmN0emNyenJxcXhmc3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDY5MTQsImV4cCI6MjA2MjEyMjkxNH0.fYu9IWemd3jadizoaCajJTGyHB3KgKhUOEfLxpdACJE';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Variáveis para armazenar IDs
let userId;
let medicamentoId;
let registroSonoId;
let lembreteId;
let registroHumorId;

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

// Função para testar a criação de medicamento
async function criarMedicamento() {
  const novoMedicamento = {
    user_id: userId,
    nome: 'Vitamina D',
    dosagem: '1000 UI',
    frequencia: 'Diário',
    horarios: ['08:00'],
    observacoes: 'Tomar com água após o café da manhã',
    datainicio: new Date().toISOString().split('T')[0],
    intervalo: 24
  };
  
  const { data, error } = await supabase
    .from('medications')
    .insert(novoMedicamento)
    .select();
  
  if (error) {
    console.error('Erro ao criar medicamento:', error);
    return null;
  }
  
  console.log('Medicamento criado com sucesso:', data[0]);
  medicamentoId = data[0].id;
  return data[0];
}

// Função para testar a leitura de medicamentos
async function listarMedicamentos() {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Erro ao listar medicamentos:', error);
    return null;
  }
  
  console.log('Medicamentos encontrados:', data.length);
  console.log('Medicamentos:', data);
  return data;
}

// Função para testar a atualização de medicamento
async function atualizarMedicamento() {
  const agora = new Date().toISOString();
  
  const atualizacao = {
    ultimaTomada: agora,
    observacoes: 'Tomar com água após o café da manhã. Última dose tomada.'
  };
  
  const { data, error } = await supabase
    .from('medications')
    .update(atualizacao)
    .eq('id', medicamentoId)
    .select();
  
  if (error) {
    console.error('Erro ao atualizar medicamento:', error);
    return null;
  }
  
  console.log('Medicamento atualizado com sucesso:', data[0]);
  return data[0];
}

// Função para testar a criação de registro de sono
async function criarRegistroSono() {
  const inicio = new Date();
  inicio.setHours(inicio.getHours() - 8); // 8 horas atrás
  
  const fim = new Date();
  
  const novoRegistro = {
    user_id: userId,
    inicio: inicio.toISOString(),
    fim: fim.toISOString(),
    qualidade: 4,
    notas: 'Dormi bem, mas acordei uma vez durante a noite'
  };
  
  const { data, error } = await supabase
    .from('sleep_logs')
    .insert(novoRegistro)
    .select();
  
  if (error) {
    console.error('Erro ao criar registro de sono:', error);
    return null;
  }
  
  console.log('Registro de sono criado com sucesso:', data[0]);
  registroSonoId = data[0].id;
  return data[0];
}

// Função para testar a leitura de registros de sono
async function listarRegistrosSono() {
  const datainicio = new Date();
  datainicio.setDate(datainicio.getDate() - 7); // 7 dias atrás
  
  const { data, error } = await supabase
    .from('sleep_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('inicio', datainicio.toISOString())
    .order('inicio', { ascending: false });
  
  if (error) {
    console.error('Erro ao listar registros de sono:', error);
    return null;
  }
  
  console.log('Registros de sono encontrados:', data.length);
  console.log('Registros de sono:', data);
  return data;
}

// Função para testar a criação de lembrete de sono
async function criarLembreteSono() {
  const novoLembrete = {
    user_id: userId,
    tipo: 'dormir',
    horario: '22:30:00',
    diasSemana: [0, 1, 2, 3, 4], // Domingo a Quinta
    ativo: true
  };
  
  const { data, error } = await supabase
    .from('sleep_reminders')
    .insert(novoLembrete)
    .select();
  
  if (error) {
    console.error('Erro ao criar lembrete de sono:', error);
    return null;
  }
  
  console.log('Lembrete de sono criado com sucesso:', data[0]);
  lembreteId = data[0].id;
  return data[0];
}

// Função para testar a criação de registro de humor
async function criarRegistroHumor() {
  const novoRegistro = {
    user_id: userId,
    data: new Date().toISOString().split('T')[0],
    nivel: 4,
    fatores: ['Boa noite de sono', 'Progresso no trabalho'],
    notas: 'Me senti muito bem e produtivo hoje'
  };
  
  const { data, error } = await supabase
    .from('mood_logs')
    .insert(novoRegistro)
    .select();
  
  if (error) {
    console.error('Erro ao criar registro de humor:', error);
    return null;
  }
  
  console.log('Registro de humor criado com sucesso:', data[0]);
  registroHumorId = data[0].id;
  return data[0];
}

// Função para testar a leitura de registros de humor
async function listarRegistrosHumor() {
  const datainicio = new Date();
  datainicio.setDate(datainicio.getDate() - 30); // 30 dias atrás
  const datainicioString = datainicio.toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('data', datainicioString)
    .order('data', { ascending: false });
  
  if (error) {
    console.error('Erro ao listar registros de humor:', error);
    return null;
  }
  
  console.log('Registros de humor encontrados:', data.length);
  console.log('Registros de humor:', data);
  return data;
}

// Função para testar a exclusão de registro de sono
async function excluirRegistroSono() {
  const { error } = await supabase
    .from('sleep_logs')
    .delete()
    .eq('id', registroSonoId);
  
  if (error) {
    console.error('Erro ao excluir registro de sono:', error);
    return false;
  }
  
  console.log('Registro de sono excluído com sucesso.');
  return true;
}

// Executar os testes
async function executarTestes() {
  console.log('Iniciando testes do módulo de saúde e sono...');
  
  // Fazer login
  const email = 'teste@exemplo.com';
  const senha = 'senha123';
  const sessao = await fazerLogin(email, senha);
  if (!sessao) {
    console.error('Falha ao fazer login. Testes não podem continuar.');
    return;
  }
  
  // Testar criação de medicamento
  const medicamento = await criarMedicamento();
  if (!medicamento) {
    console.error('Falha ao criar medicamento. Testes não podem continuar.');
    return;
  }
  
  // Testar listagem de medicamentos
  await listarMedicamentos();
  
  // Testar atualização de medicamento
  await atualizarMedicamento();
  
  // Testar criação de registro de sono
  const registroSono = await criarRegistroSono();
  if (!registroSono) {
    console.error('Falha ao criar registro de sono. Testes não podem continuar.');
    return;
  }
  
  // Testar listagem de registros de sono
  await listarRegistrosSono();
  
  // Testar criação de lembrete de sono
  const lembrete = await criarLembreteSono();
  if (!lembrete) {
    console.error('Falha ao criar lembrete de sono.');
    // Continuar os testes mesmo se falhar
  }
  
  // Testar criação de registro de humor
  const registroHumor = await criarRegistroHumor();
  if (!registroHumor) {
    console.error('Falha ao criar registro de humor.');
    // Continuar os testes mesmo se falhar
  } else {
    // Testar listagem de registros de humor
    await listarRegistrosHumor();
  }
  
  // Testar exclusão de registro de sono
  await excluirRegistroSono();
  
  console.log('Testes do módulo de saúde e sono concluídos!');
}

// Executar testes
executarTestes(); 