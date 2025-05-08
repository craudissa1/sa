import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// Tipo Adaptado para Supabase
export type SessaoEstudo = {
  id?: string; // Gerenciado pelo Supabase (UUID)
  user_id?: string;
  titulo: string;
  descricao?: string; // Tornar opcional se pode ser nulo
  duracao: number; // em minutos (int4)
  data: string; // YYYY-MM-DD (date)
  completo: boolean;
  created_at?: string;
  updated_at?: string;
};

interface RegistroEstudosState {
  sessoes: SessaoEstudo[];
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchSessoesEstudo: (userId: string) => Promise<void>;

  adicionarSessao: (sessao: Omit<SessaoEstudo, 'id' | 'user_id' | 'data' | 'completo' | 'created_at' | 'updated_at'> & { data?: string }) => Promise<void>;
  removerSessao: (id: string) => Promise<void>;
  alternarCompletar: (id: string, completo: boolean) => Promise<void>;
  editarSessao: (id: string, dados: Partial<Omit<SessaoEstudo, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'data' | 'completo'>>) => Promise<void>;
}

const NOME_TABELA_SESSOES_ESTUDO = "study_sessions";

export const useRegistroEstudosStore = create<RegistroEstudosState>()((set, get) => ({
  sessoes: [],
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchSessoesEstudo: async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from(NOME_TABELA_SESSOES_ESTUDO)
        .select('*')
        .eq('user_id', userId)
        .order('data', { ascending: false }); // Ordenar por data, mais recente primeiro

      if (error) throw error;
      set({ sessoes: data || [] });
    } catch (error) {
      console.error("Error fetching sessoes de estudo:", error);
      set({ sessoes: [] });
    }
  },

  adicionarSessao: async (sessao) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");

    const dataSessao = sessao.data || new Date().toISOString().split("T")[0];
    const sessaoParaSalvar: Omit<SessaoEstudo, 'id' | 'created_at' | 'updated_at'> = {
      user_id: user.id,
      titulo: sessao.titulo,
      descricao: sessao.descricao || '',
      duracao: sessao.duracao,
      data: dataSessao,
      completo: false,
    };

    const { data, error } = await supabase
      .from(NOME_TABELA_SESSOES_ESTUDO)
      .insert([sessaoParaSalvar])
      .select();
    if (error) {
      console.error("Error adding sessao de estudo:", error.message);
      throw error;
    }
    if (data) {
      set((state) => ({ sessoes: [...data, ...state.sessoes].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()) }));
    }
  },

  removerSessao: async (id) => {
    const { error } = await supabase
      .from(NOME_TABELA_SESSOES_ESTUDO)
      .delete()
      .eq('id', id);
    if (error) {
      console.error("Error removing sessao de estudo:", error.message);
      throw error;
    }
    set((state) => ({ sessoes: state.sessoes.filter((s) => s.id !== id) }));
  },

  alternarCompletar: async (id, completo) => {
    const { data, error } = await supabase
      .from(NOME_TABELA_SESSOES_ESTUDO)
      .update({ completo })
      .eq('id', id)
      .select();
    if (error) {
      console.error("Error toggling sessao de estudo:", error.message);
      throw error;
    }
    if (data && data.length > 0) {
      set((state) => ({
        sessoes: state.sessoes.map((s) => (s.id === id ? { ...s, ...data[0] } : s)),
      }));
    }
  },

  editarSessao: async (id, dados) => {
    const { data, error } = await supabase
      .from(NOME_TABELA_SESSOES_ESTUDO)
      .update(dados)
      .eq('id', id)
      .select();
    if (error) {
      console.error("Error editing sessao de estudo:", error.message);
      throw error;
    }
    if (data && data.length > 0) {
      set((state) => ({
        sessoes: state.sessoes.map((s) => (s.id === id ? { ...s, ...data[0] } : s)),
      }));
    }
  },
}));