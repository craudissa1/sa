'use client';

import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // Ajuste o caminho se necessário
import { User } from "@supabase/supabase-js";

// Tipos (adaptados para Supabase)
export interface ConteudoProgramatico {
  disciplina: string;
  topicos: string[]; // Array de strings
  progresso: number;
}

export interface Concurso {
  id?: string; // Gerenciado pelo Supabase
  user_id?: string;
  titulo: string;
  organizadora: string;
  dataInscricao: string; // YYYY-MM-DD
  dataProva: string; // YYYY-MM-DD
  edital?: string | null; // URL ou texto
  status: "planejado" | "inscrito" | "estudando" | "realizado" | "aguardando_resultado";
  conteudoProgramatico: ConteudoProgramatico[]; // Armazenado como JSONB no Supabase
  created_at?: string;
  updated_at?: string;
}

interface ConcursosState {
  concursos: Concurso[];
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchConcursos: (userId: string) => Promise<void>;

  adicionarConcurso: (concurso: Omit<Concurso, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>;
  removerConcurso: (id: string) => Promise<void>;
  atualizarConcurso: (id: string, updates: Partial<Omit<Concurso, "id" | "user_id" | "created_at" | "updated_at">>) => Promise<void>;
  // atualizarProgresso é feito através de atualizarConcurso, modificando o array conteudoProgramatico
}

const NOME_TABELA_CONCURSOS = "user_contests";

export const useConcursosStore = create<ConcursosState>()((set, get) => ({
  concursos: [],
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchConcursos: async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from(NOME_TABELA_CONCURSOS)
        .select("*")
        .eq("user_id", userId)
        .order("dataProva", { ascending: true }); // Ordenar por data da prova, por exemplo

      if (error) {
        console.error("Error fetching concursos:", error.message);
        throw error;
      }
      set({ concursos: data || [] });
    } catch (error) {
      console.error("Error in fetchConcursos:", error);
      set({ concursos: [] });
    }
  },

  adicionarConcurso: async (concurso) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    
    const concursoParaSalvar = {
      ...concurso,
      user_id: user.id,
      status: concurso.status || "planejado",
      conteudoProgramatico: concurso.conteudoProgramatico.map(c => ({ ...c, progresso: c.progresso || 0 }))
    };

    const { data, error } = await supabase
      .from(NOME_TABELA_CONCURSOS)
      .insert([concursoParaSalvar])
      .select();
    if (error) {
      console.error("Error adding concurso:", error.message);
      throw error;
    }
    if (data) set((state) => ({ concursos: [...state.concursos, ...data] }));
  },

  removerConcurso: async (id) => {
    const { error } = await supabase
      .from(NOME_TABELA_CONCURSOS)
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error removing concurso:", error.message);
      throw error;
    }
    set((state) => ({ concursos: state.concursos.filter((c) => c.id !== id) }));
  },

  atualizarConcurso: async (id, updates) => {
    // Se conteudoProgramatico está sendo atualizado, garantir que o progresso seja um número
    if (updates.conteudoProgramatico) {
      updates.conteudoProgramatico = updates.conteudoProgramatico.map(cp => ({
        ...cp,
        progresso: typeof cp.progresso === 'number' ? cp.progresso : 0,
        topicos: Array.isArray(cp.topicos) ? cp.topicos : [] // Garantir que tópicos seja um array
      }));
    }

    const { data, error } = await supabase
      .from(NOME_TABELA_CONCURSOS)
      .update(updates)
      .eq("id", id)
      .select();
    if (error) {
      console.error("Error updating concurso:", error.message);
      throw error;
    }
    if (data) {
      set((state) => ({
        concursos: state.concursos.map((c) => (c.id === id ? { ...c, ...data[0] } : c)),
      }));
    }
  },
}));

// As Realtime subscriptions para esta tabela devem ser configuradas no StoreInitializer.tsx
// Exemplo para NOME_TABELA_CONCURSOS:
// setupSubscription(NOME_TABELA_CONCURSOS, (payload) => {
//   const { eventType, new: newRecord, old: oldRecord } = payload;
//   const store = useConcursosStore.getState();
//   if (!store.currentUser) return;
//   // Refetch all or update granularly
//   if (eventType === "INSERT" || eventType === "UPDATE" || eventType === "DELETE") {
//      store.fetchConcursos(store.currentUser.id);
//   }
//   // Granular updates:
//   // if (eventType === "INSERT") useConcursosStore.setState((state) => ({ concursos: [...state.concursos, newRecord as any] }));
//   // if (eventType === "UPDATE") useConcursosStore.setState((state) => ({ concursos: state.concursos.map((c) => (c.id === newRecord.id ? (newRecord as any) : c)) }));
//   // if (eventType === "DELETE") useConcursosStore.setState((state) => ({ concursos: state.concursos.filter((c) => c.id !== oldRecord.id) }));
// });

