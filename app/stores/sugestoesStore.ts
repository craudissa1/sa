import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// Tipo para a tabela Supabase
interface FavoriteSuggestion {
    id?: number; // PK
    user_id: string;
    suggestion_text: string; // O texto da sugestão favorita
    created_at?: string;
}

interface SugestoesState {
  sugestoesFavoritas: string[]; // Mantém apenas os textos localmente
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchSugestoesFavoritas: (userId: string) => Promise<void>;

  adicionarFavorita: (sugestao: string) => Promise<void>;
  removerFavorita: (sugestao: string) => Promise<void>;
}

const NOME_TABELA_SUGESTOES_FAVORITAS = "favorite_suggestions";

export const useSugestoesStore = create<SugestoesState>()((set, get) => ({
  sugestoesFavoritas: [],
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchSugestoesFavoritas: async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from(NOME_TABELA_SUGESTOES_FAVORITAS)
        .select('suggestion_text')
        .eq('user_id', userId);

      if (error) throw error;
      set({ sugestoesFavoritas: data?.map(item => item.suggestion_text) || [] });
    } catch (error) {
      console.error("Error fetching sugestoes favoritas:", error);
      set({ sugestoesFavoritas: [] });
    }
  },

  adicionarFavorita: async (sugestao) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const { sugestoesFavoritas } = get();

    // Evitar duplicatas locais e no DB (idealmente o DB teria um UNIQUE constraint)
    if (sugestoesFavoritas.includes(sugestao)) return;

    const { error } = await supabase
      .from(NOME_TABELA_SUGESTOES_FAVORITAS)
      .insert({ user_id: user.id, suggestion_text: sugestao });

    if (error) {
        // Se o erro for de violação de constraint UNIQUE, ignora (já existe)
        if (error.code === '23505') { // Código de erro do PostgreSQL para unique_violation
            console.warn(`Sugestão "${sugestao}" já existe como favorita.`);
            // Garante que está no estado local caso tenha sido removida e a remoção do DB falhou
            if (!sugestoesFavoritas.includes(sugestao)) {
                 set((state) => ({ sugestoesFavoritas: [...state.sugestoesFavoritas, sugestao] }));
            }
            return;
        }
        console.error("Error adding sugestao favorita:", error.message);
        throw error;
    }
    set((state) => ({ sugestoesFavoritas: [...state.sugestoesFavoritas, sugestao] }));
  },

  removerFavorita: async (sugestao) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from(NOME_TABELA_SUGESTOES_FAVORITAS)
      .delete()
      .match({ user_id: user.id, suggestion_text: sugestao });

    if (error) {
      console.error("Error removing sugestao favorita:", error.message);
      throw error;
    }
    set((state) => ({
      sugestoesFavoritas: state.sugestoesFavoritas.filter((s) => s !== sugestao),
    }));
  },
}));