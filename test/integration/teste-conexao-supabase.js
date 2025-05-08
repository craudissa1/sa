import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = 'https://ekdygbctzcrzrqqxfszz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZHlnYmN0emNyenJxcXhmc3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDY5MTQsImV4cCI6MjA2MjEyMjkxNH0.fYu9IWemd3jadizoaCajJTGyHB3KgKhUOEfLxpdACJE';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para testar a conexão
async function testarConexao() {
  try {
    // Testar uma consulta simples
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Erro na conexão com Supabase:', error);
      return false;
    }
    
    console.log('Conexão com Supabase estabelecida com sucesso!');
    console.log('Resposta:', data);
    return true;
  } catch (error) {
    console.error('Erro ao conectar com Supabase:', error.message);
    return false;
  }
}

// Função para testar o cadastro de usuário
async function testarCadastroUsuario(email, senha) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: senha
    });
    
    if (error) {
      console.error('Erro no cadastro de usuário:', error);
      return false;
    }
    
    console.log('Cadastro de usuário realizado com sucesso!');
    console.log('Dados do usuário:', data);
    return true;
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error.message);
    return false;
  }
}

// Função para testar o login de usuário
async function testarLoginUsuario(email, senha) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha
    });
    
    if (error) {
      console.error('Erro no login de usuário:', error);
      return false;
    }
    
    console.log('Login realizado com sucesso!');
    console.log('Dados da sessão:', data);
    return data;
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    return false;
  }
}

// Executar os testes
async function executarTestes() {
  console.log('Iniciando testes de conexão e autenticação...');
  
  // Testar conexão com o Supabase
  const conexaoOk = await testarConexao();
  if (!conexaoOk) {
    console.error('Teste de conexão falhou. Verifique as credenciais.');
    return;
  }
  
  // Dados para teste
  const email = 'teste@exemplo.com';
  const senha = 'senha123';
  
  // Testar cadastro de usuário
  // Descomente a linha abaixo para testar o cadastro (use apenas na primeira execução)
  // await testarCadastroUsuario(email, senha);
  
  // Testar login de usuário
  const sessao = await testarLoginUsuario(email, senha);
  if (sessao) {
    console.log('Usuário autenticado com sucesso. ID:', sessao.user?.id);
  }
}

// Executar testes
executarTestes(); 