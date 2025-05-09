// e2e/mocks/supabase-mock.js

const mockData = {
  // Adicione dados de mock conforme necessário
  users: [
    {
      id: 'test-user-id', // ID de usuário mockado
      email: 'teste@exemplo.com',
      password: 'senha123', // A senha não será realmente verificada aqui no mock simplificado
      nome_completo: 'Usuário Teste E2E'
    }
  ],
  // Controle de sessão para mock
  currentSession: null,
  tasks: [],
  medications: [],
  user_priorities: [],
  time_blocks: [],
  sleep_logs: [],
  mood_logs: [],
};

const supabaseMock = {
  auth: {
    signInWithPassword: jest.fn(async (credentials) => {
      const user = mockData.users.find(u => u.email === credentials.email);
      if (user && user.password === credentials.password) {
        // Criar uma sessão mockada ao fazer login
        mockData.currentSession = {
          user: { id: user.id, email: user.email },
          access_token: `mock_token_${Date.now()}`,
          refresh_token: `mock_refresh_${Date.now()}`
        };
        return { data: { user: { id: user.id, email: user.email }, session: mockData.currentSession }, error: null };
      }
      return { data: { user: null, session: null }, error: { message: 'Invalid credentials' } };
    }),
    signUp: jest.fn(async (credentials) => {
      const existingUser = mockData.users.find(u => u.email === credentials.email);
      if (existingUser) {
        return { data: { user: null }, error: { message: 'User already exists' } };
      }
      const newUser = { id: `user_${Date.now()}`, ...credentials };
      mockData.users.push(newUser);
      // Criar uma sessão ao registrar
      mockData.currentSession = {
        user: { id: newUser.id, email: newUser.email },
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`
      };
      return { data: { user: { id: newUser.id, email: newUser.email }, session: mockData.currentSession }, error: null };
    }),
    signOut: jest.fn(async () => {
      // Limpar a sessão ao fazer logout
      mockData.currentSession = null;
      return { error: null };
    }),
    // Implementação do método getUser
    getUser: jest.fn(async () => {
      if (mockData.currentSession && mockData.currentSession.user) {
        return { data: { user: mockData.currentSession.user }, error: null };
      }
      return { data: { user: null }, error: null };
    }),
    // Adicione outros métodos de auth mockados conforme necessário
  },
  from: jest.fn((table) => {
  const queryBuilder = {
    data: mockData[table] || [], // Dados iniciais da tabela
    error: null,
    filters: [], // Array para armazenar filtros aplicados

    eq: jest.fn(function(column, value) {
      // Aplica filtro de igualdade
      this.filters.push({type: 'eq', column, value});
      return this;
    }),
    gte: jest.fn(function(column, value) {
      // Aplica filtro maior ou igual
      this.filters.push({type: 'gte', column, value});
      return this;
    }),
    lte: jest.fn(function(column, value) {
      // Aplica filtro menor ou igual
      this.filters.push({type: 'lte', column, value});
      return this;
    }),
    limit: jest.fn(function(count) {
      this.filters.push({type: 'limit', value: count});
      return this;
    }),
    order: jest.fn(function(column, {ascending = true} = {}) {
      this.filters.push({type: 'order', column, ascending});
      return this;
    }),
    single: jest.fn(function() {
      // Aplica todos os filtros
      const filteredData = this.applyFilters();
      return Promise.resolve({ 
        data: (filteredData.length > 0) ? filteredData[0] : null, 
        error: this.error 
      });
    }),
    then: jest.fn(function(callback) {
      // Aplica filtros e retorna resultado
      const filteredData = this.applyFilters();
      return Promise.resolve({ data: filteredData, error: this.error }).then(callback);
    }),
    applyFilters: function() {
      // Função auxiliar para aplicar todos os filtros
      let result = [...this.data];
      
      for (const filter of this.filters) {
        if (filter.type === 'eq') {
          result = result.filter(item => item[filter.column] === filter.value);
        } 
        else if (filter.type === 'gte') {
          result = result.filter(item => item[filter.column] >= filter.value);
        }
        else if (filter.type === 'lte') {
          result = result.filter(item => item[filter.column] <= filter.value);
        }
        else if (filter.type === 'limit') {
          result = result.slice(0, filter.value);
        }
        else if (filter.type === 'order') {
          result.sort((a, b) => {
            if (filter.ascending) {
              return a[filter.column] > b[filter.column] ? 1 : -1;
            } else {
              return a[filter.column] < b[filter.column] ? 1 : -1;
            }
          });
        }
      }
      return result;
    }
  };

  return {
    select: jest.fn(() => {
      // Retorna uma NOVA instância do queryBuilder para cada select,
      // para evitar que filtros de uma query afetem outra.
      // Inicializa com todos os dados da tabela.
      const newQueryBuilderInstance = { ...queryBuilder, data: [...(mockData[table] || [])] };
      return newQueryBuilderInstance;
    }),
    insert: jest.fn((newData) => ({
        select: jest.fn(() => ({
          single: jest.fn(() => {
            const item = { id: `${table}_${Date.now()}`, ...newData };
            if (!mockData[table]) mockData[table] = [];
            mockData[table].push(item);
            return Promise.resolve({ data: item, error: null });
          }),
        })),
      })),
      update: jest.fn((updatedData) => ({
        eq: jest.fn((column, value) => ({
          select: jest.fn(() => ({
            single: jest.fn(() => {
              if (!mockData[table]) return Promise.resolve({ data: null, error: { message: 'Table not found' } });
              const itemIndex = mockData[table].findIndex(item => item[column] === value);
              if (itemIndex > -1) {
                mockData[table][itemIndex] = { ...mockData[table][itemIndex], ...updatedData };
                return Promise.resolve({ data: mockData[table][itemIndex], error: null });
              }
              return Promise.resolve({ data: null, error: { message: 'Item not found' } });
            }),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn((column, value) => {
          if (!mockData[table]) return Promise.resolve({ error: { message: 'Table not found' } });
          const initialLength = mockData[table].length;
          mockData[table] = mockData[table].filter(item => item[column] !== value);
          if (mockData[table].length < initialLength) {
            return Promise.resolve({ error: null });
          }
          return Promise.resolve({ error: { message: 'Item not found or not deleted' } });
        }),
      })),
    };
  }),
  // Adicione outros serviços Supabase mockados conforme necessário
};

module.exports = { supabaseMock, mockData };