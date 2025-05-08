// Importar o mock do Supabase em vez de criar uma instância real
const { supabaseMock: supabase, mockData } = require('../mocks/supabase-mock');

// Dados para teste
const testUser = {
  email: 'teste@exemplo.com',
  password: 'senha123' 
};

/**
 * Testes de autenticação com Supabase
 */
describe('Testes de Autenticação Supabase', () => {
  let userId = null;
  
  // Limpar estado antes de cada teste
  beforeEach(async () => {
    // Garantir que não há sessão ativa
    await supabase.auth.signOut();
    // Limpar storage
    localStorage.clear();
    sessionStorage.clear();
    // Resetar mocks
    jest.clearAllMocks();
  });
  
  // Após cada teste, fazer logout
  afterEach(async () => {
    try {
      await supabase.auth.signOut();
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        console.warn('Sessão não foi limpa corretamente após o teste');
      }
    } catch (error) {
      console.error('Erro ao limpar sessão:', error);
    }
  });

  describe('Login', () => {
    test('Deve fazer login com sucesso', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password
      });
      
      expect(error).toBeNull();
      expect(data.user).toBeTruthy();
      expect(data.user.email).toBe(testUser.email);
      expect(data.session).toBeTruthy();
      expect(data.session.access_token).toBeTruthy();
    });

    test('Deve falhar ao fazer login com credenciais inválidas', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'invalido@exemplo.com',
        password: 'senhaerrada'
      });
      
      expect(error).toBeTruthy();
      expect(error).toBeSupabaseError();
      expect(data.session).toBeNull();
    });
  });

  describe('Sessão', () => {
    test('Deve manter sessão após login', async () => {
      // Login
      await supabase.auth.signInWithPassword(testUser);
      
      // Verificar sessão
      const { data, error } = await supabase.auth.getSession();
      
      expect(error).toBeNull();
      expect(data.session).toBeTruthy();
      expect(data.session.user.email).toBe(testUser.email);
    });

    test('Não deve ter sessão sem login', async () => {
      const { data, error } = await supabase.auth.getSession();
      
      expect(error).toBeNull();
      expect(data.session).toBeNull();
    });
  });

  describe('Logout', () => {
    test('Deve fazer logout e limpar sessão', async () => {
      // Login primeiro
      await supabase.auth.signInWithPassword(testUser);
      
      // Verificar se está logado
      const { data: beforeLogout } = await supabase.auth.getSession();
      expect(beforeLogout.session).toBeTruthy();
      
      // Fazer logout
      const { error } = await supabase.auth.signOut();
      expect(error).toBeNull();
      
      // Verificar se sessão foi limpa
      const { data: afterLogout } = await supabase.auth.getSession();
      expect(afterLogout.session).toBeNull();
      
      // Verificar se storage foi limpo
      expect(localStorage.getItem('supabase.auth.token')).toBeNull();
    });
  });

  describe('Perfil de Usuário', () => {
    beforeEach(async () => {
      // Garantir login antes de testar perfil
      const { data } = await supabase.auth.signInWithPassword(testUser);
      userId = data.user?.id;
    });

    test('Deve acessar perfil do usuário', async () => {
      expect(userId).toBeTruthy();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data.user_id).toBe(userId);
    });

    test('Deve criar perfil se não existir', async () => {
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('user_id', userId)
        .single();
      
      if (!existingProfile) {
        const { data, error } = await supabase
          .from('user_profiles')
          .insert([{
            user_id: userId,
            nome: 'Usuário Teste',
            preferenciasvisuais: {
              textoGrande: false,
              altoContraste: false,
              reducaoEstimulos: false
            }
          }])
          .single();
        
        expect(error).toBeNull();
        expect(data).toBeTruthy();
      }
    });
  });
});

// Execute os testes com: npm test supabase-auth.test.js
