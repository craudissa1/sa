import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient'; // Importar o cliente Supabase
import { User } from '@supabase/supabase-js';

// Tipos para o estado global (mantidos, mas IDs serão gerenciados pelo Supabase)
export type Tarefa = {
  id?: string; // ID será do Supabase, opcional no cliente antes de salvar
  user_id?: string; // Para associar ao usuário
  texto: string;
  concluida: boolean;
  categoria: 'inicio' | 'alimentacao' | 'estudos' | 'saude' | 'lazer';
  data: string; // formato YYYY-MM-DD
  created_at?: string;
};

export type BlocoTempo = {
  id?: string;
  user_id?: string;
  hora: string;
  atividade: string;
  categoria: 'inicio' | 'alimentacao' | 'estudos' | 'saude' | 'lazer' | 'nenhuma';
  data: string; // formato YYYY-MM-DD
  created_at?: string;
};

export type Refeicao = {
  id?: string;
  user_id?: string;
  hora: string;
  descricao: string;
  foto?: string; // Será uma URL para o Supabase Storage
  data: string; // formato YYYY-MM-DD
  created_at?: string;
};

// Tipo Medicacao legado (será migrado ou removido se Medicamento for o substituto)
export type MedicacaoLegado = {
  id?: string;
  user_id?: string;
  nome: string;
  horarios: string[];
  tomada: Record<string, boolean>; 
  created_at?: string;
};

export type Medicamento = {
  id?: string;
  user_id?: string;
  nome: string;
  dosagem: string;
  frequencia: string;
  horarios: string[];
  observacoes: string;
  dataInicio: string;
  ultimaTomada: string | null;
  intervalo?: number;
  created_at?: string;
};

export type RegistroHumor = {
  id?: string;
  user_id?: string;
  data: string;
  nivel: number;
  fatores: string[];
  notas: string;
  created_at?: string;
};

export type ConfiguracaoUsuario = {
  id?: string; // A configuração será por usuário
  user_id?: string;
  tempoFoco: number;
  tempoPausa: number;
  temaEscuro: boolean;
  reducaoEstimulos: boolean;
  updated_at?: string;
};

interface AppState {
  tarefas: Tarefa[];
  blocosTempo: BlocoTempo[];
  refeicoes: Refeicao[];
  medicacoesLegado: MedicacaoLegado[]; // Renomeado para clareza
  configuracao: ConfiguracaoUsuario | null; // Pode ser null até carregar
  medicamentos: Medicamento[];
  registrosHumor: RegistroHumor[];
  currentUser: User | null; // Adicionar estado para o usuário atual

  setCurrentUser: (user: User | null) => void;
  fetchInitialData: (userId: string) => Promise<void>;

  // Ações para tarefas (exemplos de como serão adaptadas)
  adicionarTarefa: (tarefa: Omit<Tarefa, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  removerTarefa: (id: string) => Promise<void>;
  toggleTarefaConcluida: (id: string, concluida: boolean) => Promise<void>;
  
  // Ações para blocos de tempo
  adicionarBlocoTempo: (bloco: Omit<BlocoTempo, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  atualizarBlocoTempo: (id: string, bloco: Partial<Omit<BlocoTempo, 'id' | 'user_id' | 'created_at'>>) => Promise<void>;
  removerBlocoTempo: (id: string) => Promise<void>;

  // Ações para refeições
  adicionarRefeicao: (refeicao: Omit<Refeicao, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  removerRefeicao: (id: string) => Promise<void>;

  // Ações para medicações legado (a serem migradas/removidas)
  // adicionarMedicacaoLegado: (medicacao: Omit<MedicacaoLegado, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  // marcarMedicacaoLegadoTomada: (id: string, data: string, horario: string, tomada: boolean) => Promise<void>;

  // Ações para medicamentos (novo modelo)
  adicionarMedicamento: (medicamento: Omit<Medicamento, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  atualizarMedicamento: (id: string, medicamento: Partial<Omit<Medicamento, 'id' | 'user_id' | 'created_at'>>) => Promise<void>;
  removerMedicamento: (id: string) => Promise<void>;
  registrarTomadaMedicamento: (id: string, dataHora: string) => Promise<void>;

  // Ações para registros de humor
  adicionarRegistroHumor: (registro: Omit<RegistroHumor, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  atualizarRegistroHumor: (id: string, registro: Partial<Omit<RegistroHumor, 'id' | 'user_id' | 'created_at'>>) => Promise<void>;
  removerRegistroHumor: (id: string) => Promise<void>;

  // Ações para configurações
  fetchConfiguracao: (userId: string) => Promise<void>;
  atualizarConfiguracao: (config: Partial<Omit<ConfiguracaoUsuario, 'id' | 'user_id' | 'updated_at'>>) => Promise<void>;
}

// Remoção do middleware `persist`
export const useAppStore = create<AppState>()((set, get) => ({
  // Estado inicial
  tarefas: [],
  blocosTempo: [],
  refeicoes: [],
  medicacoesLegado: [],
  configuracao: null,
  medicamentos: [],
  registrosHumor: [],
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchInitialData: async (userId) => {
    if (!userId) return;
    try {
      const [ 
        { data: tarefasData, error: tarefasError },
        { data: blocosTempoData, error: blocosTempoError },
        { data: refeicoesData, error: refeicoesError },
        { data: medicamentosData, error: medicamentosError },
        { data: registrosHumorData, error: registrosHumorError },
        { data: configuracaoData, error: configuracaoError },
      ] = await Promise.all([
        supabase.from('tasks').select('*').eq('user_id', userId),
        supabase.from('time_blocks').select('*').eq('user_id', userId),
        supabase.from('meals').select('*').eq('user_id', userId),
        supabase.from('medications').select('*').eq('user_id', userId),
        supabase.from('mood_logs').select('*').eq('user_id', userId),
        supabase.from('user_configurations').select('*').eq('user_id', userId).maybeSingle(),
      ]);

      if (tarefasError) console.error('Error fetching tarefas:', tarefasError.message);
      if (blocosTempoError) console.error('Error fetching blocosTempo:', blocosTempoError.message);
      if (refeicoesError) console.error('Error fetching refeicoes:', refeicoesError.message);
      if (medicamentosError) console.error('Error fetching medicamentos:', medicamentosError.message);
      if (registrosHumorError) console.error('Error fetching registrosHumor:', registrosHumorError.message);
      if (configuracaoError) console.error('Error fetching configuracao:', configuracaoError.message);

      set({
        tarefas: tarefasData || [],
        blocosTempo: blocosTempoData || [],
        refeicoes: refeicoesData || [],
        medicamentos: medicamentosData || [],
        registrosHumor: registrosHumorData || [],
        configuracao: configuracaoData || { tempoFoco: 25, tempoPausa: 5, temaEscuro: false, reducaoEstimulos: false, user_id: userId },
      });
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  },

  // Implementações das ações (exemplo para tarefas)
  adicionarTarefa: async (tarefa) => {
    const user = get().currentUser;
    if (!user) throw new Error('User not authenticated');
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...tarefa, user_id: user.id }])
      .select();
    if (error) throw error;
    if (data) set((state) => ({ tarefas: [...state.tarefas, ...data] }));
  },

  removerTarefa: async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
    set((state) => ({ tarefas: state.tarefas.filter((t) => t.id !== id) }));
  },

  toggleTarefaConcluida: async (id, concluida) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ concluida })
      .eq('id', id)
      .select();
    if (error) throw error;
    if (data) {
      set((state) => ({
        tarefas: state.tarefas.map((t) => (t.id === id ? { ...t, ...data[0] } : t)),
      }));
    }
  },

  // Implementar outras ações de forma similar para blocosTempo, refeicoes, etc.
  // ... (as implementações completas para todas as stores seriam muito extensas aqui)
  // ... Elas seguirão o padrão de chamar supabase.from('table_name')... e depois set()

  adicionarBlocoTempo: async (bloco) => {
    const user = get().currentUser;
    if (!user) throw new Error('User not authenticated');
    const { data, error } = await supabase.from('time_blocks').insert([{ ...bloco, user_id: user.id }]).select();
    if (error) throw error;
    if (data) set(state => ({ blocosTempo: [...state.blocosTempo, ...data] }));
  },
  atualizarBlocoTempo: async (id, bloco) => {
    const { data, error } = await supabase.from('time_blocks').update(bloco).eq('id', id).select();
    if (error) throw error;
    if (data) set(state => ({ blocosTempo: state.blocosTempo.map(b => b.id === id ? data[0] : b) }));
  },
  removerBlocoTempo: async (id) => {
    const { error } = await supabase.from('time_blocks').delete().eq('id', id);
    if (error) throw error;
    set(state => ({ blocosTempo: state.blocosTempo.filter(b => b.id !== id) }));
  },

  adicionarRefeicao: async (refeicao) => {
    const user = get().currentUser;
    if (!user) throw new Error('User not authenticated');
    const { data, error } = await supabase.from('meals').insert([{ ...refeicao, user_id: user.id }]).select();
    if (error) throw error;
    if (data) set(state => ({ refeicoes: [...state.refeicoes, ...data] }));
  },
  removerRefeicao: async (id) => {
    const { error } = await supabase.from('meals').delete().eq('id', id);
    if (error) throw error;
    set(state => ({ refeicoes: state.refeicoes.filter(r => r.id !== id) }));
  },

  adicionarMedicamento: async (medicamento) => {
    const user = get().currentUser;
    if (!user) throw new Error('User not authenticated');
    const { data, error } = await supabase.from('medications').insert([{ ...medicamento, user_id: user.id }]).select();
    if (error) throw error;
    if (data) set(state => ({ medicamentos: [...state.medicamentos, ...data] }));
  },
  atualizarMedicamento: async (id, medicamento) => {
    const { data, error } = await supabase.from('medications').update(medicamento).eq('id', id).select();
    if (error) throw error;
    if (data) set(state => ({ medicamentos: state.medicamentos.map(m => m.id === id ? data[0] : m) }));
  },
  removerMedicamento: async (id) => {
    const { error } = await supabase.from('medications').delete().eq('id', id);
    if (error) throw error;
    set(state => ({ medicamentos: state.medicamentos.filter(m => m.id !== id) }));
  },
  registrarTomadaMedicamento: async (id, ultimaTomada) => {
    const { data, error } = await supabase.from('medications').update({ ultimaTomada }).eq('id', id).select();
    if (error) throw error;
    if (data) set(state => ({ medicamentos: state.medicamentos.map(m => m.id === id ? data[0] : m) }));
  },

  adicionarRegistroHumor: async (registro) => {
    const user = get().currentUser;
    if (!user) throw new Error('User not authenticated');
    const { data, error } = await supabase.from('mood_logs').insert([{ ...registro, user_id: user.id }]).select();
    if (error) throw error;
    if (data) set(state => ({ registrosHumor: [...state.registrosHumor, ...data] }));
  },
  atualizarRegistroHumor: async (id, registro) => {
    const { data, error } = await supabase.from('mood_logs').update(registro).eq('id', id).select();
    if (error) throw error;
    if (data) set(state => ({ registrosHumor: state.registrosHumor.map(r => r.id === id ? data[0] : r) }));
  },
  removerRegistroHumor: async (id) => {
    const { error } = await supabase.from('mood_logs').delete().eq('id', id);
    if (error) throw error;
    set(state => ({ registrosHumor: state.registrosHumor.filter(r => r.id !== id) }));
  },

  fetchConfiguracao: async (userId) => {
    const { data, error } = await supabase
      .from('user_configurations')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle if there's at most one config per user
    if (error) {
      console.error('Error fetching configuracao:', error.message);
      // Set default config if none found or error occurs, ensuring user_id is present
      set({ configuracao: { tempoFoco: 25, tempoPausa: 5, temaEscuro: false, reducaoEstimulos: false, user_id: userId } });
      return;
    }
    if (data) {
      set({ configuracao: data });
    } else {
      // If no config exists, create a default one
      const defaultConfig = { tempoFoco: 25, tempoPausa: 5, temaEscuro: false, reducaoEstimulos: false, user_id: userId };
      const { data: newConfigData, error: newConfigError } = await supabase
        .from('user_configurations')
        .insert(defaultConfig)
        .select()
        .single(); // Assuming insert returns the created row
      if (newConfigError) {
        console.error('Error creating default configuracao:', newConfigError.message);
        set({ configuracao: defaultConfig }); // Fallback to local default
      } else if (newConfigData) {
        set({ configuracao: newConfigData });
      }
    }
  },
  atualizarConfiguracao: async (config) => {
    const user = get().currentUser;
    if (!user || !get().configuracao) throw new Error('User or configuration not available');
    // Ensure user_id is part of the update payload if it's not automatically handled by RLS or triggers
    const updatePayload = { ...config, user_id: user.id };
    const { data, error } = await supabase
      .from('user_configurations')
      .update(updatePayload)
      .eq('user_id', user.id) // Assuming user_id is the primary key or a unique key for upsert-like behavior
      .select()
      .single(); // Expecting a single row to be returned

    if (error) {
        // If the error is because the row doesn't exist (e.g., PGRST204 for no content on update)
        // then we should insert it.
        if (error.code === 'PGRST204' || (error.details && error.details.includes('0 rows'))) { 
            const { data: insertData, error: insertError } = await supabase
                .from('user_configurations')
                .insert([{ ...config, user_id: user.id }]) // Ensure user_id is included
                .select()
                .single();
            if (insertError) throw insertError;
            if (insertData) set(state => ({ configuracao: { ...state.configuracao, ...insertData } }));
            return;
        }
        throw error;
    }
    if (data) set(state => ({ configuracao: { ...state.configuracao, ...data } }));
  },
}));

// Exemplo de como usar a store em um componente:
// const { tarefas, adicionarTarefa, currentUser, setCurrentUser, fetchInitialData } = useAppStore();
// useEffect(() => {
//   if (currentUser) {
//     fetchInitialData(currentUser.id);
//   }
// }, [currentUser, fetchInitialData]);

// Realtime subscriptions seriam configuradas em um useEffect no nível do App ou em um componente wrapper
// que também teria acesso ao `currentUser` para filtrar por `user_id`.

