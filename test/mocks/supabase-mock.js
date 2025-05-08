// Mock do cliente Supabase para uso nos testes
// Este arquivo simula as respostas da API do Supabase sem fazer chamadas reais

const mockData = {
  tasks: [
    {
      id: 'task-id-1',
      user_id: 'test-user-id',
      texto: 'Completar relatório do projeto',
      concluida: false,
      categoria: 'estudos',
      data: new Date().toISOString().split('T')[0]
    }
  ],
  user_priorities: [
    {
      id: 'priority-id-1',
      user_id: 'test-user-id',
      texto: 'Estudar para a certificação profissional',
      concluida: false,
      data: new Date().toISOString().split('T')[0],
      tipo: 'geral'
    }
  ],
  time_blocks: [
    {
      id: 'block-id-1',
      user_id: 'test-user-id',
      hora: '14:00',
      atividade: 'Reunião de equipe',
      categoria: 'estudos',
      data: new Date().toISOString().split('T')[0]
    }
  ],
  medications: [
    {
      id: 'medication-id-1',
      user_id: 'test-user-id',
      nome: 'Vitamina C',
      dosagem: '1000mg',
      frequencia: 'Diário',
      horarios: ['08:00', '20:00'],
      observacoes: 'Tomar com água',
      datainicio: new Date().toISOString().split('T')[0],
      intervalo: 12
    }
  ],
  user_profiles: [
    {
      id: '1',
      user_id: '123',
      nome: 'Usuário Teste',
      preferenciasvisuais: {
        textoGrande: false,
        altoContraste: false,
        reducaoEstimulos: false
      }
    }
  ],
  sleep_logs: [
    {
      id: 'sleep-id-1',
      user_id: 'test-user-id',
      inicio: new Date().toISOString(),
      fim: new Date().toISOString(),
      qualidade: 4
    }
  ],
  mood_logs: [
    {
      id: 'mood-id-1',
      user_id: 'test-user-id',
      nivel: 4,
      data: new Date().toISOString().split('T')[0],
      fatores: ['Boa noite de sono']
    }
  ],
  finance_categories: [
    {
      id: 'category-id-1',
      user_id: 'test-user-id',
      nome: 'Alimentação',
      cor: '#FF5722',
      icone: 'restaurant'
    }
  ],
  finance_transactions: [
    {
      id: 'transaction-id-1',
      user_id: 'test-user-id',
      valor: 42.50,
      descricao: 'Almoço',
      categoriaid: 'category-id-1',
      tipo: 'despesa',
      data: new Date().toISOString().split('T')[0]
    }
  ],
  finance_envelopes: [
    {
      id: 'envelope-id-1',
      user_id: 'test-user-id',
      nome: 'Orçamento Mensal de Alimentação',
      cor: '#FF5722',
      valoralocado: 500.00,
      valorutilizado: 42.50
    }
  ],
  users: [
    {
      id: '123',
      email: 'teste@exemplo.com',
      password: 'senha123'
    }
  ],
  profiles: [
    {
      user_id: '123',
      nome: 'Usuário Teste',
      preferenciasvisuais: {
        textoGrande: false,
        altoContraste: false,
        reducaoEstimulos: false
      }
    }
  ],
  user_configurations: []
};

let currentSession = null;

const createQueryBuilder = (tableData) => {
  const builder = {
    data: null,
    filters: {},
    isSingle: false,

    select: function(columns) {
      return this;
    },

    eq: function(column, value) {
      this.filters[column] = value;
      return this;
    },

    single: async function() {
      this.isSingle = true;
      let result = null;
      
      if (Object.keys(this.filters).length > 0) {
        result = tableData.find(item => {
          return Object.entries(this.filters).every(([key, value]) => item[key] === value);
        });
      } else if (this.data) {
        result = this.data;
      } else {
        result = tableData[0];
      }

      return {
        data: result || null,
        error: null
      };
    },

    then: async function(resolve) {
      let results = [];
      
      if (Object.keys(this.filters).length > 0) {
        results = tableData.filter(item => {
          return Object.entries(this.filters).every(([key, value]) => item[key] === value);
        });
      } else if (this.data) {
        results = [this.data];
      } else {
        results = tableData;
      }

      return resolve({
        data: this.isSingle ? results[0] || null : results,
        error: null
      });
    },

    insert: function(data) {
      const newItem = Array.isArray(data) ? data[0] : data;
      const insertedItem = { id: Date.now().toString(), ...newItem };
      tableData.push(insertedItem);
      this.data = insertedItem;
      return this;
    },

    upsert: function(data) {
      const index = tableData.findIndex(i => i.user_id === data.user_id);
      if (index >= 0) {
        tableData[index] = { ...tableData[index], ...data };
        this.data = tableData[index];
      } else {
        const newItem = { id: Date.now().toString(), ...data };
        tableData.push(newItem);
        this.data = newItem;
      }
      return this;
    },

    delete: function() {
      return {
        eq: (column, value) => {
          const index = tableData.findIndex(i => i[column] === value);
          if (index >= 0) {
            tableData.splice(index, 1);
          }
          return {
            data: null,
            error: null
          };
        }
      };
    }
  };

  return builder;
};

const supabaseMock = {
  auth: {
    signInWithPassword: jest.fn(async ({ email, password }) => {
      const user = mockData.users.find(u => u.email === email && u.password === password);
      if (user) {
        const session = {
          access_token: 'mock_token',
          user
        };
        currentSession = session;
        localStorage.setItem('supabase.auth.token', JSON.stringify(session));
        return {
          data: {
            user,
            session
          },
          error: null
        };
      }
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid credentials', code: 'auth/invalid-credentials' }
      };
    }),

    signOut: jest.fn(async () => {
      currentSession = null;
      localStorage.removeItem('supabase.auth.token');
      return { error: null };
    }),

    getSession: jest.fn(async () => {
      if (currentSession) {
        return {
          data: { session: currentSession },
          error: null
        };
      }
      return { data: { session: null }, error: null };
    })
  },

  from: jest.fn((table) => {
    const builder = createQueryBuilder(mockData[table] || []);
    return new Proxy(builder, {
      get: (target, prop) => {
        if (prop === 'then') {
          return async (resolve) => {
            const results = target.filters && Object.keys(target.filters).length > 0
              ? (mockData[table] || []).filter(item =>
                  Object.entries(target.filters).every(([key, value]) => item[key] === value)
                )
              : mockData[table] || [];
            
            return resolve({
              data: target.isSingle ? results[0] || null : results,
              error: null
            });
          };
        }
        return target[prop];
      }
    });
  })
};

// Função auxiliar para gerar valores padrão com base no tipo de tabela
function getDefaultValuesForTable(table) {
  switch (table) {
    case 'tasks':
      return {
        texto: 'Tarefa padrão',
        concluida: false,
        categoria: 'estudos',
        data: new Date().toISOString().split('T')[0]
      };
    case 'user_priorities':
      return {
        texto: 'Prioridade padrão',
        concluida: false,
        data: new Date().toISOString().split('T')[0],
        tipo: 'geral'
      };
    case 'time_blocks':
      return {
        hora: '12:00',
        atividade: 'Atividade padrão',
        categoria: 'estudos',
        data: new Date().toISOString().split('T')[0]
      };
    case 'finance_categories':
      return {
        nome: 'Categoria padrão',
        cor: '#000000',
        icone: 'default'
      };
    default:
      return {};
  }
}

module.exports = { supabaseMock, mockData };
