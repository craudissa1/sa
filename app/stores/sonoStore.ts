import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// Tipos Adaptados para Supabase
export type RegistroSono = {
  id?: string; // UUID
  user_id?: string;
  inicio: string; // timestamptz
  fim?: string | null; // timestamptz nullable
  qualidade?: number | null; // int2 nullable (1-5)
  notas?: string; // text nullable
  created_at?: string;
  updated_at?: string;
};

export type ConfiguracaoLembrete = {
  id?: string; // UUID
  user_id?: string;
  tipo: 'dormir' | 'acordar'; // text
  horario: string; // time (HH:MM)
  diasSemana: number[]; // int2[] (0-6)
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
};

interface SonoState {
  registros: RegistroSono[];
  lembretes: ConfiguracaoLembrete[];
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchSonoData: (userId: string) => Promise<void>;

  // Registros
  adicionarRegistroSono: (registro: Omit<RegistroSono, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  atualizarRegistroSono: (id: string, dados: Partial<Omit<RegistroSono, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  removerRegistroSono: (id: string) => Promise<void>;

  // Lembretes
  adicionarLembrete: (lembrete: Omit<ConfiguracaoLembrete, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'ativo'>) => Promise<void>;
  atualizarLembrete: (id: string, dados: Partial<Omit<ConfiguracaoLembrete, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  removerLembrete: (id: string) => Promise<void>;
  alternarAtivoLembrete: (id: string, ativo: boolean) => Promise<void>;
}

const NOME_TABELA_REGISTROS = "sleep_logs";
const NOME_TABELA_LEMBRETES = "sleep_reminders";

export const useSonoStore = create<SonoState>()((set, get) => ({
  registros: [],
  lembretes: [],
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchSonoData: async (userId) => {
    if (!userId) return;
    try {
      const [
        { data: registrosData, error: registrosError },
        { data: lembretesData, error: lembretesError },
      ] = await Promise.all([
        supabase.from(NOME_TABELA_REGISTROS).select('*').eq('user_id', userId).order('inicio', { ascending: false }),
        supabase.from(NOME_TABELA_LEMBRETES).select('*').eq('user_id', userId).order('horario', { ascending: true }),
      ]);

      if (registrosError) throw registrosError;
      if (lembretesError) throw lembretesError;

      set({
        registros: registrosData || [],
        lembretes: lembretesData || [],
      });
    } catch (error) {
      console.error("Error fetching sono data:", error);
      set({ registros: [], lembretes: [] });
    }
  },

  // Registros de Sono
  adicionarRegistroSono: async (registro) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase
      .from(NOME_TABELA_REGISTROS)
      .insert([{ ...registro, user_id: user.id }])
      .select();
    if (error) throw error;
    if (data) set((state) => ({ registros: [...data, ...state.registros].sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime()) }));
  },

  atualizarRegistroSono: async (id, dados) => {
    const { data, error } = await supabase
      .from(NOME_TABELA_REGISTROS)
      .update(dados)
      .eq('id', id)
      .select();
    if (error) throw error;
    if (data) set((state) => ({ registros: state.registros.map((r) => (r.id === id ? data[0] : r)) }));
  },

  removerRegistroSono: async (id) => {
    const { error } = await supabase
      .from(NOME_TABELA_REGISTROS)
      .delete()
      .eq('id', id);
    if (error) throw error;
    set((state) => ({ registros: state.registros.filter((r) => r.id !== id) }));
  },

  // Lembretes de Sono
  adicionarLembrete: async (lembrete) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase
      .from(NOME_TABELA_LEMBRETES)
      .insert([{ ...lembrete, user_id: user.id, ativo: true }])
      .select();
    if (error) throw error;
    if (data) set((state) => ({ lembretes: [...state.lembretes, ...data].sort((a, b) => a.horario.localeCompare(b.horario)) }));
  },

  atualizarLembrete: async (id, dados) => {
    const { data, error } = await supabase
      .from(NOME_TABELA_LEMBRETES)
      .update(dados)
      .eq('id', id)
      .select();
    if (error) throw error;
    if (data) set((state) => ({ lembretes: state.lembretes.map((l) => (l.id === id ? data[0] : l)).sort((a, b) => a.horario.localeCompare(b.horario)) }));
  },

  removerLembrete: async (id) => {
    const { error } = await supabase
      .from(NOME_TABELA_LEMBRETES)
      .delete()
      .eq('id', id);
    if (error) throw error;
    set((state) => ({ lembretes: state.lembretes.filter((l) => l.id !== id) }));
  },

  alternarAtivoLembrete: async (id, ativo) => {
    const { data, error } = await supabase
      .from(NOME_TABELA_LEMBRETES)
      .update({ ativo })
      .eq('id', id)
      .select();
    if (error) throw error;
    if (data) set((state) => ({ lembretes: state.lembretes.map((l) => (l.id === id ? data[0] : l)) }));
  },
}));