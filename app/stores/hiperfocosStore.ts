import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // Ajuste o caminho se necessário
import { User } from "@supabase/supabase-js";

// Constante de Cores para Hiperfocos
export const CORES_HIPERFOCOS: string[] = [
  "#FF6B6B", // Vermelho Coral
  "#4ECDC4", // Turquesa
  "#45B7D1", // Azul Celeste
  "#FED766", // Amarelo Milho
  "#2AB7CA", // Azul Ciano
  "#F0B67F", // Pêssego
  "#8A6F9E", // Roxo Ametista
  "#1DD3B0", // Verde Menta
  "#FF9F1C", // Laranja Brilhante
  "#C1E7E3", // Azul Gelo Claro
  "#E4F9F5", // Azul Gelo Muito Claro
  "#30E3CA"  // Verde Água Brilhante
];

// Tipos (adaptados para Supabase)
export type HiperfocoProjeto = {
  id?: string; // Gerenciado pelo Supabase
  user_id?: string;
  titulo: string;
  descricao: string;
  cor: string;
  tempoLimite?: number | null; // em minutos, opcional
  created_at?: string;
  updated_at?: string;
};

export type HiperfocoTarefa = {
  id?: string;
  user_id?: string;
  hiperfoco_id: string; // FK to HiperfocoProjeto
  parent_task_id?: string | null; // FK to HiperfocoTarefa (self-referencing for subtasks)
  texto: string;
  concluida: boolean;
  cor?: string | null; // Cor específica da tarefa, se houver
  created_at?: string;
  updated_at?: string;
};

export type HiperfocoSessao = {
  id?: string;
  user_id?: string;
  titulo: string;
  hiperfoco_atual_id: string | null; // FK to HiperfocoProjeto
  hiperfoco_anterior_id: string | null; // FK to HiperfocoProjeto
  tempo_inicio: string; // ISO string timestamp
  duracao_estimada: number; // em minutos
  concluida: boolean;
  created_at?: string;
  updated_at?: string;
};

interface HiperfocosState {
  hiperfocoProjetos: HiperfocoProjeto[];
  hiperfocoTarefas: HiperfocoTarefa[]; // Inclui tarefas principais e sub-tarefas
  hiperfocoSessoes: HiperfocoSessao[];
  currentUser: User | null;

  setCurrentUser: (user: User | null) => void;
  fetchHiperfocosData: (userId: string) => Promise<void>;

  // Projetos (Hiperfocos)
  adicionarHiperfocoProjeto: (projeto: Omit<HiperfocoProjeto, "id" | "user_id" | "created_at" | "updated_at">) => Promise<string | undefined>;
  atualizarHiperfocoProjeto: (id: string, updates: Partial<Omit<HiperfocoProjeto, "id" | "user_id" | "created_at" | "updated_at">>) => Promise<void>;
  removerHiperfocoProjeto: (id: string) => Promise<void>;

  // Tarefas (inclui sub-tarefas)
  adicionarHiperfocoTarefa: (tarefa: Omit<HiperfocoTarefa, "id" | "user_id" | "created_at" | "updated_at">) => Promise<string | undefined>;
  atualizarHiperfocoTarefa: (id: string, updates: Partial<Omit<HiperfocoTarefa, "id" | "user_id" | "created_at" | "updated_at">>) => Promise<void>;
  removerHiperfocoTarefa: (id: string) => Promise<void>;

  // Sessoes de Alternância
  adicionarHiperfocoSessao: (sessao: Omit<HiperfocoSessao, "id" | "user_id" | "created_at" | "updated_at">) => Promise<string | undefined>;
  atualizarHiperfocoSessao: (id: string, updates: Partial<Omit<HiperfocoSessao, "id" | "user_id" | "created_at" | "updated_at">>) => Promise<void>;
  removerHiperfocoSessao: (id: string) => Promise<void>;
}

const TABELA_PROJETOS = "hyperfocus_projects";
const TABELA_TAREFAS = "hyperfocus_tasks";
const TABELA_SESSOES = "hyperfocus_sessions";

export const useHiperfocosStore = create<HiperfocosState>()((set, get) => ({
  hiperfocoProjetos: [],
  hiperfocoTarefas: [],
  hiperfocoSessoes: [],
  currentUser: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  fetchHiperfocosData: async (userId) => {
    if (!userId) return;
    try {
      const [
        { data: projetosData, error: projetosError },
        { data: tarefasData, error: tarefasError },
        { data: sessoesData, error: sessoesError },
      ] = await Promise.all([
        supabase.from(TABELA_PROJETOS).select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from(TABELA_TAREFAS).select("*").eq("user_id", userId).order("created_at", { ascending: true }),
        supabase.from(TABELA_SESSOES).select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      ]);

      if (projetosError) console.error(`Error fetching ${TABELA_PROJETOS}:`, projetosError.message);
      if (tarefasError) console.error(`Error fetching ${TABELA_TAREFAS}:`, tarefasError.message);
      if (sessoesError) console.error(`Error fetching ${TABELA_SESSOES}:`, sessoesError.message);

      set({
        hiperfocoProjetos: projetosData || [],
        hiperfocoTarefas: tarefasData || [],
        hiperfocoSessoes: sessoesData || [],
      });
    } catch (error) {
      console.error("Error fetching hiperfocos data:", error);
    }
  },

  // Projetos (Hiperfocos)
  adicionarHiperfocoProjeto: async (projeto) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from(TABELA_PROJETOS).insert([{ ...projeto, user_id: user.id }]).select().single();
    if (error) throw error;
    if (data) {
      set((state) => ({ hiperfocoProjetos: [data, ...state.hiperfocoProjetos] }));
      return data.id;
    }
    return undefined;
  },
  atualizarHiperfocoProjeto: async (id, updates) => {
    const { data, error } = await supabase.from(TABELA_PROJETOS).update(updates).eq("id", id).select().single();
    if (error) throw error;
    if (data) set((state) => ({ hiperfocoProjetos: state.hiperfocoProjetos.map((p) => (p.id === id ? data : p)) }));
  },
  removerHiperfocoProjeto: async (id) => {
    const { error } = await supabase.from(TABELA_PROJETOS).delete().eq("id", id);
    if (error) throw error;
    set((state) => ({
      hiperfocoProjetos: state.hiperfocoProjetos.filter((p) => p.id !== id),
      hiperfocoTarefas: state.hiperfocoTarefas.filter(t => t.hiperfoco_id !== id),
      hiperfocoSessoes: state.hiperfocoSessoes.filter(s => s.hiperfoco_atual_id !== id && s.hiperfoco_anterior_id !== id),
    }));
  },

  // Tarefas
  adicionarHiperfocoTarefa: async (tarefa) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from(TABELA_TAREFAS).insert([{ ...tarefa, user_id: user.id }]).select().single();
    if (error) throw error;
    if (data) {
      set((state) => ({ hiperfocoTarefas: [...state.hiperfocoTarefas, data] }));
      return data.id;
    }
    return undefined;
  },
  atualizarHiperfocoTarefa: async (id, updates) => {
    const { data, error } = await supabase.from(TABELA_TAREFAS).update(updates).eq("id", id).select().single();
    if (error) throw error;
    if (data) set((state) => ({ hiperfocoTarefas: state.hiperfocoTarefas.map((t) => (t.id === id ? data : t)) }));
  },
  removerHiperfocoTarefa: async (id) => {
    const { error } = await supabase.from(TABELA_TAREFAS).delete().eq("id", id);
    if (error) throw error;
    const tasksToRemove = new Set<string>();
    tasksToRemove.add(id);
    let changed = true;
    while(changed){
        changed = false;
        const currentSize = tasksToRemove.size;
        get().hiperfocoTarefas.forEach(t => {
            if(t.parent_task_id && tasksToRemove.has(t.parent_task_id) && !tasksToRemove.has(t.id!)){
                tasksToRemove.add(t.id!);
                changed = true;
            }
        });
        if(tasksToRemove.size === currentSize && changed) changed = false;
    }
    set((state) => ({ hiperfocoTarefas: state.hiperfocoTarefas.filter((t) => !tasksToRemove.has(t.id!)) }));
  },

  // Sessoes de Alternância
  adicionarHiperfocoSessao: async (sessao) => {
    const user = get().currentUser;
    if (!user) throw new Error("User not authenticated");
    const { data, error } = await supabase.from(TABELA_SESSOES).insert([{ ...sessao, user_id: user.id }]).select().single();
    if (error) throw error;
    if (data) {
      set((state) => ({ hiperfocoSessoes: [data, ...state.hiperfocoSessoes] }));
      return data.id;
    }
    return undefined;
  },
  atualizarHiperfocoSessao: async (id, updates) => {
    const { data, error } = await supabase.from(TABELA_SESSOES).update(updates).eq("id", id).select().single();
    if (error) throw error;
    if (data) set((state) => ({ hiperfocoSessoes: state.hiperfocoSessoes.map((s) => (s.id === id ? data : s)) }));
  },
  removerHiperfocoSessao: async (id) => {
    const { error } = await supabase.from(TABELA_SESSOES).delete().eq("id", id);
    if (error) throw error;
    set((state) => ({ hiperfocoSessoes: state.hiperfocoSessoes.filter((s) => s.id !== id) }));
  },
}));

