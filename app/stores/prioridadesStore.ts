'use client';

import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // Ajuste o caminho se necessário
import { User } from "@supabase/supabase-js";

// Tipos (adaptados para Supabase)
export type Prioridade = {
  id?: string; // Gerenciado pelo Supabase
  user_id?: string;
  texto: string;
  concluida: boolean;
  data: string; // formato ISO: YYYY-MM-DD
  tipo?: "geral" | "concurso";
  origemId?: string | null; // ID da origem (ex: concursoId)
  created_at?: string;
  updated_at?: string;
};

interface PrioridadesState {
  prioridades: Prioridade[];
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchPrioridades: (userId: string) => Promise<void>;

  adicionarPrioridade: (prioridade: Omit<Prioridade, "id" | "user_id" | "created_at" | "updated_at" | "data"> & { data?: string }) => Promise<void>;
  editarPrioridade: (id: string, updates: Partial<Omit<Prioridade, "id" | "user_id" | "created_at" | "updated_at">>) => Promise<void>;
  removerPrioridade: (id: string) => Promise<void>;
  toggleConcluida: (id: string, concluida: boolean) => Promise<void>;
  getHistoricoPorData: (data?: string) => Prioridade[];
  getDatasPrioridades: () => string[];
}

const NOME_TABELA_PRIORIDADES = "user_priorities";

export const usePrioridadesStore = create<PrioridadesState>()((set, get) => ({
  prioridades: [],
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchPrioridades: async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from(NOME_TABELA_PRIORIDADES)
        .select("*")
        .eq("user_id", userId)
        .order("data", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching prioridades:", error.message);
        throw error;
      }
      set({ prioridades: data || [] });
    } catch (error) {
      console.error("Error in fetchPrioridades:", error);
      set({ prioridades: [] });
    }
  },

  adicionarPrioridade: async (novaPrioridade) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");

    const dataPrioridade = novaPrioridade.data || new Date().toISOString().split("T")[0];

    const prioridadeParaSalvar: Omit<Prioridade, "id" | "created_at" | "updated_at"> = {
      user_id: user.id,
      texto: novaPrioridade.texto,
      concluida: novaPrioridade.concluida ?? false,
      data: dataPrioridade,
      tipo: novaPrioridade.tipo || "geral",
      origemId: novaPrioridade.origemId,
    };

    const { data, error } = await supabase
      .from(NOME_TABELA_PRIORIDADES)
      .insert([prioridadeParaSalvar])
      .select();

    if (error) {
      console.error("Error adding prioridade:", error.message);
      throw error;
    }
    if (data) {
      // Adiciona no início da lista local para melhor UX se ordenado por data desc.
      set((state) => ({ prioridades: [...data, ...state.prioridades].sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime() || new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())  }));
    }
  },

  editarPrioridade: async (id, updates) => {
    const { data, error } = await supabase
      .from(NOME_TABELA_PRIORIDADES)
      .update(updates)
      .eq("id", id)
      .select();
    if (error) {
      console.error("Error updating prioridade:", error.message);
      throw error;
    }
    if (data && data.length > 0) {
      set((state) => ({
        prioridades: state.prioridades.map((p) => (p.id === id ? { ...p, ...data[0] } : p)),
      }));
    }
  },

  removerPrioridade: async (id) => {
    const { error } = await supabase
      .from(NOME_TABELA_PRIORIDADES)
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error removing prioridade:", error.message);
      throw error;
    }
    set((state) => ({ prioridades: state.prioridades.filter((p) => p.id !== id) }));
  },

  toggleConcluida: async (id, concluida) => {
    const { data, error } = await supabase
      .from(NOME_TABELA_PRIORIDADES)
      .update({ concluida })
      .eq("id", id)
      .select();
    if (error) {
      console.error("Error toggling prioridade:", error.message);
      throw error;
    }
    if (data && data.length > 0) {
      set((state) => ({
        prioridades: state.prioridades.map((p) => (p.id === id ? { ...p, ...data[0] } : p)),
      }));
    }
  },

  getHistoricoPorData: (data) => {
    const dataFiltro = data || new Date().toISOString().split("T")[0];
    return get().prioridades.filter((p) => p.data === dataFiltro);
  },
  getDatasPrioridades: () => {
    const datas = new Set(get().prioridades.map((p) => p.data));
    return Array.from(datas).sort((a, b) => b.localeCompare(a));
  },
}));

// Realtime subscriptions para NOME_TABELA_PRIORIDADES
// devem ser configuradas no StoreInitializer.tsx.
// Exemplo:
// setupSubscription(NOME_TABELA_PRIORIDADES, (payload) => {
//   const { eventType, new: newRecord, old: oldRecord, table } = payload;
//   const store = usePrioridadesStore.getState();
//   if (store.currentUser && (newRecord.user_id === store.currentUser.id || (oldRecord && oldRecord.user_id === store.currentUser.id) )) {
//      store.fetchPrioridades(store.currentUser.id); // Simples refetch para manter atualizado
//   }
// });
