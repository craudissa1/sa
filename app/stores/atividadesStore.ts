import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // Ajuste o caminho se necessário
import { User } from "@supabase/supabase-js";

// Tipos (adaptados para Supabase)
export type Atividade = {
  id?: string; // Gerenciado pelo Supabase
  user_id?: string;
  nome: string;
  categoria: string; // Pode ser um ID para uma tabela de categorias de atividades no futuro
  duracao: number; // em minutos
  observacoes: string;
  data: string; // YYYY-MM-DD
  concluida: boolean;
  created_at?: string;
};

interface AtividadesState {
  atividades: Atividade[];
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchAtividades: (userId: string) => Promise<void>;

  adicionarAtividade: (atividade: Omit<Atividade, "id" | "user_id" | "created_at">) => Promise<void>;
  removerAtividade: (id: string) => Promise<void>;
  marcarConcluida: (id: string, concluida: boolean) => Promise<void>;
  // atualizarAtividade: (id: string, updates: Partial<Omit<Atividade, "id" | "user_id" | "created_at">>) => Promise<void>; // Adicionar se necessário
}

const NOME_TABELA_ATIVIDADES = "user_activities";

export const useAtividadesStore = create<AtividadesState>()((set, get) => ({
  atividades: [],
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchAtividades: async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from(NOME_TABELA_ATIVIDADES)
        .select("*")
        .eq("user_id", userId)
        .order("data", { ascending: false }); // Ordenar para UI, se desejado

      if (error) {
        console.error("Error fetching atividades:", error.message);
        throw error;
      }
      set({ atividades: data || [] });
    } catch (error) {
      console.error("Error in fetchAtividades:", error);
      set({ atividades: [] }); // Reseta em caso de erro
    }
  },

  adicionarAtividade: async (atividade) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase
      .from(NOME_TABELA_ATIVIDADES)
      .insert([{ ...atividade, user_id: user.id }])
      .select();
    if (error) {
      console.error("Error adding atividade:", error.message);
      throw error;
    }
    if (data) set((state) => ({ atividades: [...state.atividades, ...data] }));
  },

  removerAtividade: async (id) => {
    const { error } = await supabase
      .from(NOME_TABELA_ATIVIDADES)
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error removing atividade:", error.message);
      throw error;
    }
    set((state) => ({ atividades: state.atividades.filter((a) => a.id !== id) }));
  },

  marcarConcluida: async (id, concluida) => {
    const { data, error } = await supabase
      .from(NOME_TABELA_ATIVIDADES)
      .update({ concluida })
      .eq("id", id)
      .select();
    if (error) {
      console.error("Error updating atividade:", error.message);
      throw error;
    }
    if (data) {
      set((state) => ({
        atividades: state.atividades.map((a) => (a.id === id ? { ...a, ...data[0] } : a)),
      }));
    }
  },
}));

// As Realtime subscriptions para esta tabela devem ser configuradas no StoreInitializer.tsx
// Exemplo para NOME_TABELA_ATIVIDADES:
// setupSubscription(NOME_TABELA_ATIVIDADES, (payload) => {
//   const { eventType, new: newRecord, old: oldRecord } = payload;
//   const store = useAtividadesStore.getState();
//   if (eventType === "INSERT") store.fetchAtividades(store.currentUser.id); // Ou adicionar diretamente
//   if (eventType === "UPDATE") store.fetchAtividades(store.currentUser.id); // Ou atualizar diretamente
//   if (eventType === "DELETE") store.fetchAtividades(store.currentUser.id); // Ou remover diretamente
// });
// Uma abordagem mais granular para realtime seria:
// if (eventType === 'INSERT') useAtividadesStore.setState((state) => ({ atividades: [...state.atividades, newRecord as any] }));
// if (eventType === 'UPDATE') useAtividadesStore.setState((state) => ({ atividades: state.atividades.map((a) => (a.id === newRecord.id ? (newRecord as any) : a)) }));
// if (eventType === 'DELETE') useAtividadesStore.setState((state) => ({ atividades: state.atividades.filter((a) => a.id !== oldRecord.id) }));

